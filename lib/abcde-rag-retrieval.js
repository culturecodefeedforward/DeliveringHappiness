'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const DEFAULT_KB_PATH = path.join(PROJECT_ROOT, 'data', 'artifacts', 'knowledge_base_abcde.json');
const DEFAULT_MANIFEST_PATH = path.join(PROJECT_ROOT, 'data', 'artifacts', 'knowledge_base_abcde_manifest.json');
const RETRIEVAL_MODEL = 'local-tfidf-ngram-v1';
const DEFAULT_MIN_TFIDF_SCORE = 0.075;
const DEFAULT_MIN_CORPUS_COVERAGE = 0.82;

const STOP_WORDS = new Set([
  'va', 'la', 'cua', 'toi', 'minh', 'mot', 'nhung', 'nhu', 'thi', 'ma', 'co', 'khong',
  'cho', 'voi', 'khi', 'da', 'duoc', 'nay', 'do', 'o', 'trong', 've', 'ra', 'lai', 'bi'
]);

const cache = new Map();
const tfidfIndexCache = new WeakMap();

function normalizeForSearch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeForSearch(value)
    .split(' ')
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function lexicalScore(query, document) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return 0;
  const documentTokens = new Set(tokenize(document));
  let matchedWeight = 0;
  let totalWeight = 0;
  const frequency = new Map();
  queryTokens.forEach(token => frequency.set(token, (frequency.get(token) || 0) + 1));
  frequency.forEach((count, token) => {
    const weight = 1 + Math.log2(count);
    totalWeight += weight;
    if (documentTokens.has(token)) matchedWeight += weight;
  });
  return totalWeight ? matchedWeight / totalWeight : 0;
}

function buildRetrievalQuery(practiceContext = {}, currentMessage = '') {
  const context = practiceContext && typeof practiceContext === 'object' ? practiceContext : {};
  const fields = [
    context.A ? `Nghịch cảnh: ${context.A}` : '',
    context.B ? `Niềm tin: ${context.B}` : '',
    context.B ? `Niềm tin trọng tâm: ${context.B}` : '',
    context.C ? `Hệ quả: ${context.C}` : '',
    currentMessage ? `Phản biện hiện tại: ${currentMessage}` : ''
  ];
  return fields.filter(Boolean).join('\n');
}

function normalizeChunk(chunk, index = 0) {
  const metadata = chunk && chunk.metadata && typeof chunk.metadata === 'object'
    ? chunk.metadata
    : chunk || {};
  const id = String(chunk.id || metadata.chunk_id || `chunk-${index + 1}`);
  return {
    id,
    vector: Array.isArray(chunk.vector) ? chunk.vector : [],
    text: String(metadata.text || chunk.text || '').trim(),
    title: String(metadata.title || metadata.source_title || 'Nguồn ABCDE').trim(),
    sourceId: String(metadata.source_id || metadata.sourceId || 'unknown-source').trim(),
    sourceTitle: String(metadata.source_title || metadata.source || metadata.title || 'Nguồn ABCDE').trim(),
    sourceType: String(metadata.source_type || metadata.sourceType || 'unknown').trim(),
    notebookId: String(metadata.notebook_id || metadata.notebookId || '').trim(),
    location: String(metadata.location || '').trim(),
    abcdeStep: String(metadata.abcde_step || '').trim(),
    concept: String(metadata.concept || metadata.lesson || '').trim(),
    citation: String(metadata.citation || metadata.source_title || metadata.title || 'Nguồn ABCDE').trim(),
    reviewStatus: String(metadata.review_status || 'legacy').trim()
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadKnowledgeBase(filePath = DEFAULT_KB_PATH) {
  const stat = fs.statSync(filePath);
  const cacheKey = path.resolve(filePath);
  const cached = cache.get(cacheKey);
  if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
    return cached.value;
  }
  const rawText = fs.readFileSync(filePath, 'utf8');
  const raw = JSON.parse(rawText);
  if (!Array.isArray(raw)) throw new Error('KNOWLEDGE_BASE_NOT_ARRAY');
  const entries = raw.map(normalizeChunk).filter(chunk => chunk.text);
  if (!entries.length) throw new Error('KNOWLEDGE_BASE_EMPTY');
  const sha256 = crypto.createHash('sha256').update(rawText, 'utf8').digest('hex');
  cache.set(cacheKey, { mtimeMs: stat.mtimeMs, size: stat.size, value: entries, sha256 });
  return entries;
}

function loadManifest(filePath = DEFAULT_MANIFEST_PATH) {
  if (!fs.existsSync(filePath)) return null;
  return readJson(filePath);
}

function inspectKnowledgeBase(options = {}) {
  const kbPath = options.kbPath || DEFAULT_KB_PATH;
  const manifestPath = options.manifestPath || DEFAULT_MANIFEST_PATH;
  try {
    const entries = loadKnowledgeBase(kbPath);
    const manifest = loadManifest(manifestPath);
    const retrievalModel = manifest && manifest.retrieval_model
      ? String(manifest.retrieval_model)
      : null;
    const retrievalModelSupported = retrievalModel === RETRIEVAL_MODEL;
    const vectorsAbsent = entries.every(entry => entry.vector.length === 0);
    const dimensions = vectorsAbsent ? 0 : -1;
    const approvedCount = entries.filter(entry => entry.reviewStatus === 'approved').length;
    const manifestAvailable = Boolean(manifest);
    const cached = cache.get(path.resolve(kbPath));
    const actualHash = cached ? cached.sha256 : '';
    const hashMatches = Boolean(
      manifest
      && typeof manifest.knowledge_base_sha256 === 'string'
      && manifest.knowledge_base_sha256.toLowerCase() === actualHash
    );
    const manifestMatches = Boolean(
      manifest
      && Number(manifest.chunk_count) === entries.length
      && Number(manifest.approved_chunk_count) === approvedCount
      && Number(manifest.vector_dimensions) === dimensions
      && retrievalModelSupported
      && hashMatches
    );
    const available = manifestAvailable
      && approvedCount === entries.length
      && vectorsAbsent
      && retrievalModelSupported
      && manifestMatches;
    return {
      available,
      chunkCount: entries.length,
      vectorDimensions: dimensions,
      retrievalModel,
      version: manifest && manifest.version ? manifest.version : 'legacy-22',
      manifestAvailable,
      manifestMatches,
      hashMatches,
      approvedCount,
      errorCode: available
        ? null
        : !manifestAvailable
          ? 'KB_MANIFEST_MISSING'
          : approvedCount !== entries.length
            ? 'KB_CONTAINS_UNAPPROVED_CHUNKS'
            : !retrievalModelSupported
              ? 'KB_RETRIEVAL_MODEL_UNSUPPORTED'
              : !vectorsAbsent
                ? 'KB_UNEXPECTED_NEURAL_VECTORS'
              : 'KB_MANIFEST_MISMATCH'
    };
  } catch (error) {
    return {
      available: false,
      chunkCount: 0,
      vectorDimensions: 0,
      retrievalModel: null,
      version: null,
      manifestAvailable: false,
      manifestMatches: false,
      hashMatches: false,
      approvedCount: 0,
      errorCode: error && error.code === 'ENOENT' ? 'KB_FILE_MISSING' : 'KB_FILE_INVALID'
    };
  }
}

function loadAuditedKnowledgeBase(options = {}) {
  const health = inspectKnowledgeBase(options);
  if (!health.available) {
    const error = new Error(health.errorCode || 'KB_AUDIT_FAILED');
    error.code = health.errorCode || 'KB_AUDIT_FAILED';
    throw error;
  }
  return loadKnowledgeBase(options.kbPath || DEFAULT_KB_PATH);
}

function resultSimilarityKey(result) {
  return normalizeForSearch(result.text).slice(0, 180);
}

function selectSourceDiverse(ranked, topK) {
  const selected = [];
  const sourceIds = new Set();
  const textKeys = new Set();

  for (const item of ranked) {
    const textKey = resultSimilarityKey(item);
    if (textKeys.has(textKey)) continue;
    if (!sourceIds.has(item.sourceId)) {
      selected.push(item);
      sourceIds.add(item.sourceId);
      textKeys.add(textKey);
    }
    if (selected.length >= topK) return selected;
  }

  for (const item of ranked) {
    const textKey = resultSimilarityKey(item);
    if (selected.some(selectedItem => selectedItem.id === item.id) || textKeys.has(textKey)) continue;
    selected.push(item);
    textKeys.add(textKey);
    if (selected.length >= topK) break;
  }
  return selected;
}

function textFeatures(value) {
  const words = tokenize(value);
  const bigrams = words.slice(0, -1).map((word, index) => `__b__${word}_${words[index + 1]}`);
  return words.concat(bigrams);
}

function weightedFeatureMap(features, idfFor) {
  const counts = new Map();
  features.forEach(feature => counts.set(feature, (counts.get(feature) || 0) + 1));
  const weights = new Map();
  let normSquared = 0;
  counts.forEach((count, feature) => {
    const weight = (1 + Math.log(count)) * idfFor(feature);
    weights.set(feature, weight);
    normSquared += weight * weight;
  });
  return { weights, norm: Math.sqrt(normSquared) };
}

function buildTfidfIndex(entries) {
  const cached = tfidfIndexCache.get(entries);
  if (cached) return cached;

  const documents = entries.map(entry => textFeatures(
    `${entry.title}\n${entry.title}\n${entry.concept}\n${entry.text}`
  ));
  const documentFrequency = new Map();
  documents.forEach(features => {
    new Set(features).forEach(feature => {
      documentFrequency.set(feature, (documentFrequency.get(feature) || 0) + 1);
    });
  });
  const documentCount = Math.max(entries.length, 1);
  const unknownIdf = Math.log(documentCount + 1) + 1;
  const idfFor = feature => Math.log(
    (documentCount + 1) / ((documentFrequency.get(feature) || 0) + 1)
  ) + 1;
  const documentVectors = documents.map(features => weightedFeatureMap(features, idfFor));
  const index = {
    documentCount,
    documentFrequency,
    documentVectors,
    idfFor,
    unknownIdf
  };
  tfidfIndexCache.set(entries, index);
  return index;
}

function tfidfCosine(queryVector, documentVector) {
  if (!queryVector.norm || !documentVector.norm) return 0;
  let dot = 0;
  queryVector.weights.forEach((weight, feature) => {
    dot += weight * (documentVector.weights.get(feature) || 0);
  });
  return dot / (queryVector.norm * documentVector.norm);
}

function queryCorpusCoverage(queryText, index) {
  const queryTerms = [...new Set(tokenize(queryText))];
  if (!queryTerms.length) return 0;
  let knownWeight = 0;
  let totalWeight = 0;
  queryTerms.forEach(term => {
    const known = index.documentFrequency.has(term);
    const weight = known ? index.idfFor(term) : index.unknownIdf;
    totalWeight += weight;
    if (known) knownWeight += weight;
  });
  return totalWeight ? knownWeight / totalWeight : 0;
}

function hasDisputationIntent(value) {
  const text = normalizeForSearch(value);
  const positivePatterns = [
    /\bbang chung\b/,
    /\bdu kien\b/,
    /\bcach giai thich\b/,
    /\bkha nang (?:khac|nao)\b/,
    /\bkhong dong nghia\b/,
    /\bphan bien\b/,
    /\bniem tin\b/,
    /\blac quan\b/,
    /\babcde\b/,
    /\bhe qua\b/,
    /\b(?:co ich|huu ich)\b/,
    /\bgoc nhin\b/,
    /\bsuy dien\b/,
    /\bket luan\b/,
    /\bdung 100\b/,
    /\bte nhat\b/
  ];
  const technicalAnswerPatterns = [
    /\bbao nhieu (?:om|gam|miligam|mg|do|phan tram)\b/,
    /\bchinh xac\b.*\b(?:thong so|lieu|toc do|luong mua|nhiet do|dieu khoan|dong code)\b/,
    /\b(?:ma loi|cam bien|dien tro|metformin|vat|hoa don|segmentation fault|extension|du bao)\b/,
    /\b(?:viet|tao) ban va\b/
  ];
  return positivePatterns.some(pattern => pattern.test(text))
    && !technicalAnswerPatterns.some(pattern => pattern.test(text));
}

const SOCRATIC_LENS_QUESTIONS = Object.freeze({
  Evidence: 'Dữ kiện cụ thể nào đang ủng hộ hoặc bác bỏ niềm tin ban đầu của bạn?',
  Alternatives: 'Ngoài cách giải thích ban đầu, khả năng nào khác cũng phù hợp với những dữ kiện đang có?',
  Implications: 'Ngay cả nếu điều bạn lo xảy ra, hệ quả thực tế nhất là gì và phần nào vẫn nằm trong khả năng xử lý của bạn?',
  Utility: 'Việc tiếp tục giữ niềm tin này đang giúp hay cản bạn thực hiện điều quan trọng nào?'
});

function selectSocraticLens(results, currentMessage = '') {
  const message = normalizeForSearch(currentMessage);
  if (/\b(?:cach giai thich|kha nang khac|goc nhin khac)\b/.test(message)) return 'Alternatives';
  if (/\b(?:he qua|te nhat|neu dieu do xay ra|quy mo)\b/.test(message)) return 'Implications';
  if (/\b(?:co ich|huu ich|giup hay can|loi ich)\b/.test(message)) return 'Utility';
  if (/\b(?:bang chung|du kien|thuc te|phan chung)\b/.test(message)) return 'Evidence';

  for (const result of Array.isArray(results) ? results : []) {
    const concept = normalizeForSearch(`${result.concept} ${result.abcdeStep}`);
    if (/\b(?:alternative|reframing|family adversity|meeting idea)\b/.test(concept)) return 'Alternatives';
    if (/\b(?:consequence|implication|future fear)\b/.test(concept)) return 'Implications';
    if (/\b(?:utility|requires action|rational action)\b/.test(concept)) return 'Utility';
    if (/\b(?:evidence|self questioning|workplace disputation)\b/.test(concept)) return 'Evidence';
  }
  return 'Evidence';
}

function socraticQuestionForLens(lens) {
  return SOCRATIC_LENS_QUESTIONS[lens] || SOCRATIC_LENS_QUESTIONS.Evidence;
}

function rankKnowledge(_queryVector, queryText, entries, options = {}) {
  const topK = Math.max(1, Math.min(Number(options.topK) || 3, 3));
  const minScore = Number.isFinite(Number(options.minScore))
    ? Number(options.minScore)
    : DEFAULT_MIN_TFIDF_SCORE;
  const minCoverage = Number.isFinite(Number(options.minCoverage))
    ? Number(options.minCoverage)
    : DEFAULT_MIN_CORPUS_COVERAGE;
  if (!normalizeForSearch(queryText) || !Array.isArray(entries) || !entries.length) {
    return {
      results: [],
      diagnosticResults: [],
      status: 'no_match',
      bestScore: 0,
      corpusCoverage: 0
    };
  }

  const index = buildTfidfIndex(entries);
  const queryVector = weightedFeatureMap(textFeatures(queryText), index.idfFor);
  const ranked = entries
    .map((entry, entryIndex) => {
      const tfidfScore = tfidfCosine(queryVector, index.documentVectors[entryIndex]);
      const keywordScore = lexicalScore(queryText, `${entry.title}\n${entry.concept}\n${entry.text}`);
      const score = keywordScore;
      return {
        ...entry,
        score,
        semanticScore: tfidfScore,
        tfidfScore,
        lexicalScore: keywordScore
      };
    })
    .sort((left, right) => right.score - left.score);

  const diagnosticResults = selectSourceDiverse(ranked, topK);
  const bestScore = diagnosticResults.reduce(
    (best, item) => Math.max(best, item.tfidfScore),
    0
  );
  const corpusCoverage = queryCorpusCoverage(queryText, index);
  const disputationIntent = options.currentMessage
    ? hasDisputationIntent(options.currentMessage)
    : true;
  const grounded = disputationIntent && bestScore >= minScore && corpusCoverage >= minCoverage;
  const lowConfidence = !grounded
    && disputationIntent
    && bestScore >= minScore * 0.85
    && corpusCoverage >= minCoverage * 0.95;
  const status = grounded ? 'grounded' : lowConfidence ? 'low_confidence' : 'no_match';

  return {
    results: status === 'no_match' ? [] : diagnosticResults,
    diagnosticResults,
    status,
    bestScore,
    corpusCoverage,
    disputationIntent,
    gateReason: disputationIntent ? null : 'missing_disputation_intent'
  };
}

function publicCitation(result) {
  return {
    id: result.id,
    title: result.title,
    source: result.sourceTitle,
    sourceType: result.sourceType,
    location: result.location,
    citation: result.citation
  };
}

module.exports = {
  DEFAULT_KB_PATH,
  DEFAULT_MANIFEST_PATH,
  DEFAULT_MIN_CORPUS_COVERAGE,
  DEFAULT_MIN_TFIDF_SCORE,
  RETRIEVAL_MODEL,
  buildRetrievalQuery,
  buildTfidfIndex,
  inspectKnowledgeBase,
  lexicalScore,
  hasDisputationIntent,
  loadAuditedKnowledgeBase,
  loadKnowledgeBase,
  normalizeChunk,
  normalizeForSearch,
  publicCitation,
  queryCorpusCoverage,
  rankKnowledge,
  selectSocraticLens,
  selectSourceDiverse,
  socraticQuestionForLens,
  textFeatures,
  tokenize
};
