'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  assessStage,
  countQuestions,
  enforceSocraticReply
} = require('../lib/abcde-socratic-policy');
const {
  RETRIEVAL_MODEL,
  buildRetrievalQuery,
  normalizeChunk,
  normalizeForSearch,
  rankKnowledge,
  tokenize
} = require('../lib/abcde-rag-retrieval');

function parseArgs(argv) {
  const output = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    output[key] = next && !next.startsWith('--') ? argv[++index] : true;
  }
  return output;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function asPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function tokenSimilarity(left, right) {
  const leftTokens = new Set(tokenize(left));
  const rightTokens = new Set(tokenize(right));
  if (!leftTokens.size || !rightTokens.size) return 0;
  const intersection = [...leftTokens].filter(token => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union ? intersection / union : 0;
}

function duplicateRate(records) {
  let duplicates = 0;
  const accepted = [];
  for (const record of records) {
    const normalized = normalizeForSearch(record.text);
    const duplicate = accepted.some(item =>
      item.normalized === normalized || tokenSimilarity(item.text, record.text) >= 0.92
    );
    if (duplicate) duplicates += 1;
    accepted.push({ normalized, text: record.text });
  }
  return records.length ? duplicates / records.length : 0;
}

function escapeRegex(value) {
  const special = new Set('\\^$.*+?()[]{}|'.split(''));
  return Array.from(value)
    .map(character => special.has(character) ? `\\${character}` : character)
    .join('');
}

function containsExactRedaction(text, name, caseInsensitive = false) {
  const pattern = new RegExp(
    `(?:^|[^\\p{L}\\p{N}_])${escapeRegex(name)}(?=$|[^\\p{L}\\p{N}_])`,
    caseInsensitive ? 'iu' : 'u'
  );
  return pattern.test(text);
}

function evaluateFullFlow(fullFlow) {
  const failures = [];
  let turnCount = 0;
  let oneQuestionCount = 0;
  let inferenceGateCount = 0;
  let inferenceGatePassed = 0;

  for (const journey of fullFlow.journeys) {
    for (const [index, turn] of journey.turns.entries()) {
      turnCount += 1;
      const assessment = assessStage(
        turn.state,
        turn.message,
        turn.practiceContext || {},
        { controlIntent: turn.controlIntent || null }
      );
      for (const field of ['stageComplete', 'nextState', 'assessmentCode']) {
        if (assessment[field] !== turn.expected[field]) {
          failures.push(
            `${journey.id} lượt ${index + 1}: ${field}=${assessment[field]}, mong đợi ${turn.expected[field]}`
          );
        }
      }
      const reply = enforceSocraticReply(
        `Mình đang theo sát điều bạn vừa chia sẻ. ${assessment.fallbackQuestion}`,
        assessment.fallbackQuestion
      );
      if (countQuestions(reply) === 1) oneQuestionCount += 1;
      else failures.push(`${journey.id} lượt ${index + 1}: phản hồi không có đúng một câu hỏi`);

      if (turn.state === 'STEP_A' && ['A_INFERENCE_PRESENT', 'PROMPT_INJECTION_BLOCKED'].includes(turn.expected.assessmentCode)) {
        inferenceGateCount += 1;
        if (!assessment.stageComplete && assessment.nextState === 'STEP_A') {
          inferenceGatePassed += 1;
        }
      }
    }
  }

  return {
    journeyCount: fullFlow.journeys.length,
    turnCount,
    failures,
    exactRate: turnCount ? (turnCount - failures.length) / turnCount : 0,
    oneQuestionRate: turnCount ? oneQuestionCount / turnCount : 0,
    inferenceGateRate: inferenceGateCount ? inferenceGatePassed / inferenceGateCount : 0
  };
}

function evaluateRetrieval(golden, records) {
  const results = [];
  let inDomainCount = 0;
  let inDomainPassed = 0;
  let outOfDomainCount = 0;
  let outOfDomainPassed = 0;

  for (const item of golden.cases) {
    const query = buildRetrievalQuery(item.practiceContext, item.currentMessage);
    const ranked = rankKnowledge(null, query, records, {
      topK: 3,
      currentMessage: item.currentMessage
    });
    const selected = ranked.diagnosticResults;
    const chunkMatch = selected.some(record => (item.expectedChunkIds || []).includes(record.id));
    const sourceMatch = selected.some(record => (item.expectedSourceIds || []).includes(record.sourceId));
    const conceptMatch = selected.some(record => (item.expectedConcepts || []).includes(record.concept));
    const passed = item.inDomain
      ? ranked.status === 'grounded' && (chunkMatch || sourceMatch || conceptMatch)
      : ranked.status !== 'grounded' && ranked.results.length === 0;
    if (item.inDomain) {
      inDomainCount += 1;
      if (passed) inDomainPassed += 1;
    } else {
      outOfDomainCount += 1;
      if (passed) outOfDomainPassed += 1;
    }
    results.push({
      id: item.id,
      inDomain: item.inDomain,
      passed,
      retrievalStatus: ranked.status,
      bestScore: ranked.bestScore,
      corpusCoverage: ranked.corpusCoverage,
      selected: selected.map(record => ({
        id: record.id,
        sourceId: record.sourceId,
        concept: record.concept,
        score: record.tfidfScore
      }))
    });
  }

  return {
    results,
    inDomainRate: inDomainCount ? inDomainPassed / inDomainCount : 0,
    outOfDomainRate: outOfDomainCount ? outOfDomainPassed / outOfDomainCount : 0
  };
}

function evaluateCorpus(records, sourceManifest, artifactManifest, recordsPath) {
  const approvedSources = new Map(
    sourceManifest.sources
      .filter(source => source.decision === 'approved' && source.review_status === 'approved')
      .map(source => [source.source_id, source])
  );
  const required = [
    'notebookId',
    'sourceId',
    'sourceTitle',
    'sourceType',
    'location',
    'abcdeStep',
    'concept',
    'citation',
    'text'
  ];
  const provenanceFailures = [];
  const citationFailures = [];
  const piiFindings = [];
  const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phonePattern = /(?<!\d)(?:\+?84|0)\d{8,10}(?!\d)/;
  const redactions = sourceManifest.redactions || [];
  const caseInsensitiveRedactions = sourceManifest.case_insensitive_redactions || [];

  for (const record of records) {
    const missing = required.filter(field => !String(record[field] || '').trim());
    if (missing.length || record.reviewStatus !== 'approved') {
      provenanceFailures.push(`${record.id}: ${missing.join(',') || 'review_status'}`);
    }
    if (!approvedSources.has(record.sourceId)) {
      citationFailures.push(`${record.id}: source_id không thuộc danh sách approved`);
    }
    if (emailPattern.test(record.text) || phonePattern.test(record.text)) {
      piiFindings.push(`${record.id}: email hoặc số điện thoại`);
    }
    const visibleName = redactions.find(name => name && containsExactRedaction(record.text, name));
    if (visibleName) piiFindings.push(`${record.id}: còn tên trong redaction list`);
    const visibleAlias = caseInsensitiveRedactions.find(
      name => name && containsExactRedaction(record.text, name, true)
    );
    if (visibleAlias) piiFindings.push(`${record.id}: còn tên trong case-insensitive redaction list`);
  }

  const sourceCount = new Set(records.map(record => record.sourceId)).size;
  const caseStudyCount = records.filter(record => record.sourceType === 'case_study').length;
  const notebookCount = new Set(
    records
      .map(record => record.notebookId)
      .filter(notebookId => notebookId && notebookId !== 'repo-local')
  ).size;
  const vectorsAbsent = records.length > 0
    && records.every(record => record.vector.length === 0);
  const actualHash = crypto.createHash('sha256')
    .update(fs.readFileSync(recordsPath))
    .digest('hex');
  const retrievalModelReady = Boolean(
    artifactManifest
    && artifactManifest.retrieval_model === RETRIEVAL_MODEL
    && artifactManifest.embedding_model === 'none'
    && artifactManifest.vector_dimensions === 0
    && artifactManifest.external_corpus_exported === false
  );
  const manifestMatches = Boolean(
    artifactManifest
    && artifactManifest.chunk_count === records.length
    && artifactManifest.approved_chunk_count === records.length
    && String(artifactManifest.knowledge_base_sha256 || '').toLowerCase() === actualHash
  );

  return {
    chunkCount: records.length,
    caseStudyCount,
    sourceCount,
    notebookCount,
    duplicateRate: duplicateRate(records),
    provenanceFailures,
    citationFailures,
    piiFindings,
    vectorsAbsent,
    retrievalModelReady,
    artifactManifestReady: manifestMatches && retrievalModelReady && vectorsAbsent
  };
}

function status(ok) {
  return ok ? 'VERIFIED local' : 'FAILED';
}

function writeReport(outputPath, details) {
  const {
    generatedAt,
    mode,
    paths,
    baselineCount,
    corpus,
    fullFlow,
    retrieval,
    hardGatePassed
  } = details;
  const retrievalRows = retrieval.results.map(item => {
    const top = item.selected
      .map(result => `${result.id}:${result.sourceId.slice(0, 8)}/${result.concept} (${result.score.toFixed(3)})`)
      .join('<br>');
    const result = item.passed
      ? `VERIFIED local ${item.retrievalStatus}`
      : 'FAILED';
    return `| ${item.id} | ${result} | ${item.bestScore.toFixed(3)} / ${asPercent(item.corpusCoverage)} | ${top || 'không có'} |`;
  });

  const lines = [
    '# Báo cáo chất lượng ABCDE RAG',
    '',
    `- Thời điểm chạy: ${generatedAt}`,
    `- Chế độ: ${mode === 'knowledge_base' ? 'knowledge base văn bản với TF-IDF cục bộ' : 'candidate văn bản đã ẩn danh'}`,
    `- Baseline: ${baselineCount === null ? 'UNVERIFIED' : `${baselineCount} chunks`}`,
    `- Kết luận local: ${hardGatePassed ? 'VERIFIED các cổng có thể kiểm tra local' : 'FAILED ít nhất một cổng local'}`,
    '- Kết luận production/browser/email: UNVERIFIED trong báo cáo này.',
    '',
    '## Nguồn bằng chứng',
    '',
    `- Full-flow fixtures: \`${paths.fullFlow}\``,
    `- Golden retrieval fixtures: \`${paths.golden}\``,
    `- Source manifest: \`${paths.sourceManifest}\``,
    `- Corpus được chấm: \`${paths.records}\``,
    `- Artifact manifest: ${paths.artifactManifest || 'UNVERIFIED'}`,
    '',
    '## Cổng corpus',
    '',
    '| Chỉ số | Kết quả | Trạng thái |',
    '| :--- | :--- | :--- |',
    `| Số chunk | ${corpus.chunkCount} (yêu cầu 60-120) | ${status(corpus.chunkCount >= 60 && corpus.chunkCount <= 120)} |`,
    `| Case study cho practice-abcde | ${corpus.caseStudyCount} (yêu cầu 18) | ${status(corpus.caseStudyCount === 18)} |`,
    `| Nguồn / notebook | ${corpus.sourceCount} / ${corpus.notebookCount} | ${status(corpus.sourceCount >= 4 && corpus.notebookCount >= 3)} |`,
    `| Provenance | ${corpus.provenanceFailures.length} lỗi | ${status(corpus.provenanceFailures.length === 0)} |`,
    `| Citation thuộc source approved | ${corpus.citationFailures.length} lỗi | ${status(corpus.citationFailures.length === 0)} |`,
    `| Duplicate rate | ${asPercent(corpus.duplicateRate)} | ${status(corpus.duplicateRate < 0.05)} |`,
    `| Dữ liệu cá nhân còn lộ | ${corpus.piiFindings.length} phát hiện | ${status(corpus.piiFindings.length === 0)} |`,
    `| Mô hình truy xuất / vector / artifact manifest | ${corpus.retrievalModelReady ? RETRIEVAL_MODEL : 'không khớp'} / ${corpus.vectorsAbsent ? 'không có' : 'còn tồn tại'} / ${corpus.artifactManifestReady ? 'khớp' : 'không khớp'} | ${status(corpus.artifactManifestReady)} |`,
    '',
    '## Cổng Socratic A-E',
    '',
    '| Chỉ số | Kết quả | Trạng thái |',
    '| :--- | :--- | :--- |',
    `| Hành trình / lượt | ${fullFlow.journeyCount} / ${fullFlow.turnCount} | ${status(fullFlow.journeyCount >= 6)} |`,
    `| Khớp state/rubric | ${asPercent(fullFlow.exactRate)} | ${status(fullFlow.failures.length === 0)} |`,
    `| Đúng một câu hỏi | ${asPercent(fullFlow.oneQuestionRate)} | ${status(fullFlow.oneQuestionRate === 1)} |`,
    `| A chặn suy diễn/chèn chỉ thị | ${asPercent(fullFlow.inferenceGateRate)} | ${status(fullFlow.inferenceGateRate === 1)} |`,
    '',
    '## Cổng truy xuất',
    '',
    `Tỷ lệ ca trong miền được nối đúng nguồn/khái niệm và vượt cổng tin cậy: ${asPercent(retrieval.inDomainRate)}.`,
    `Tỷ lệ ca ngoài miền bị từ chối truy xuất: ${asPercent(retrieval.outOfDomainRate)}.`,
    '',
    '| Ca kiểm thử | Kết quả | Điểm TF-IDF tốt nhất / độ phủ corpus | Top 3 chẩn đoán |',
    '| :--- | :--- | :--- | :--- |',
    ...retrievalRows,
    '',
    '## Ma trận bề mặt kiểm chứng',
    '',
    '| Bề mặt kiểm chứng | Phương pháp | Kết quả kỳ vọng | Trạng thái |',
    '| :--- | :--- | :--- | :--- |',
    `| Local files | Runner + fixture + corpus audit | Qua toàn bộ cổng local | ${hardGatePassed ? 'VERIFIED' : 'FAILED'} |`,
    '| Apps Script deployment | Clasp deployment + submit marker | Deployment riêng và ChatVersion=beta | UNVERIFIED |',
    '| Public frontend URLs | HTTP probe các URL bắt buộc | Không hồi quy và đúng deployment | UNVERIFIED |',
    '| Browser evidence | Desktop/mobile live UAT | A-E, citation, console/network đúng | UNVERIFIED |',
    '| Final verdict | Đối chiếu toàn bộ bề mặt | Tất cả bề mặt đạt | UNVERIFIED |',
    '',
    '## Sai lệch chi tiết',
    '',
    fullFlow.failures.length ? fullFlow.failures.map(item => `- ${item}`).join('\n') : '- Không có lỗi full-flow.',
    corpus.provenanceFailures.length ? corpus.provenanceFailures.map(item => `- Provenance: ${item}`).join('\n') : '- Không có lỗi provenance.',
    corpus.citationFailures.length ? corpus.citationFailures.map(item => `- Citation: ${item}`).join('\n') : '- Không có lỗi citation.',
    corpus.piiFindings.length ? corpus.piiFindings.map(item => `- Privacy: ${item}`).join('\n') : '- Không phát hiện dữ liệu cá nhân theo cổng tự động.',
    ''
  ];
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(__dirname, '..');
  const candidatePath = path.resolve(
    args.candidates || path.join(process.env.TEMP || 'C:\\tmp', 'abcde-kb-candidates-20260721.json')
  );
  const kbPath = path.resolve(args.kb || path.join(root, 'data', 'artifacts', 'knowledge_base_abcde.json'));
  const artifactManifestPath = path.resolve(
    args['artifact-manifest'] || path.join(root, 'data', 'artifacts', 'knowledge_base_abcde_manifest.json')
  );
  const sourceManifestPath = path.resolve(
    args['source-manifest'] || path.join(root, 'data', 'sources', 'abcde_source_manifest.json')
  );
  const fullFlowPath = path.resolve(
    args['full-flow'] || path.join(root, 'data', 'evals', 'abcde-full-flow-cases.json')
  );
  const goldenPath = path.resolve(
    args.golden || path.join(root, 'data', 'evals', 'abcde-rag-golden-cases.json')
  );
  const outputPath = path.resolve(
    args.output || path.join(root, 'UAT', 'abcde_rag_quality_20260721.md')
  );
  const baselinePath = path.resolve(
    args.baseline || 'C:\\tmp\\abcde-kb-backup-20260721\\knowledge_base_abcde.before.json'
  );

  const kbReady = fs.existsSync(kbPath) && fs.existsSync(artifactManifestPath);
  const recordsPath = kbReady ? kbPath : candidatePath;
  if (!fs.existsSync(recordsPath)) {
    throw new Error(`CORPUS_NOT_FOUND:${recordsPath}`);
  }
  const records = readJson(recordsPath).map(normalizeChunk);
  const sourceManifest = readJson(sourceManifestPath);
  const artifactManifest = kbReady ? readJson(artifactManifestPath) : null;
  const fullFlow = evaluateFullFlow(readJson(fullFlowPath));
  const retrieval = evaluateRetrieval(readJson(goldenPath), records);
  const corpus = evaluateCorpus(records, sourceManifest, artifactManifest, recordsPath);
  const baselineCount = fs.existsSync(baselinePath) && Array.isArray(readJson(baselinePath))
    ? readJson(baselinePath).length
    : null;

  const corpusGate = corpus.chunkCount >= 60
    && corpus.chunkCount <= 120
    && corpus.caseStudyCount === 18
    && corpus.sourceCount >= 4
    && corpus.notebookCount >= 3
    && corpus.duplicateRate < 0.05
    && corpus.provenanceFailures.length === 0
    && corpus.citationFailures.length === 0
    && corpus.piiFindings.length === 0;
  const socraticGate = fullFlow.journeyCount >= 6
    && fullFlow.failures.length === 0
    && fullFlow.oneQuestionRate === 1
    && fullFlow.inferenceGateRate === 1;
  const retrievalGate = retrieval.inDomainRate >= 0.85
    && retrieval.outOfDomainRate === 1;
  const artifactGate = kbReady && corpus.artifactManifestReady;
  const hardGatePassed = corpusGate && socraticGate && retrievalGate && artifactGate;

  writeReport(outputPath, {
    generatedAt: new Date().toISOString(),
    mode: kbReady ? 'knowledge_base' : 'candidate',
    paths: {
      fullFlow: fullFlowPath,
      golden: goldenPath,
      sourceManifest: sourceManifestPath,
      records: recordsPath,
      artifactManifest: kbReady ? artifactManifestPath : null
    },
    baselineCount,
    corpus,
    fullFlow,
    retrieval,
    hardGatePassed
  });

  console.log(JSON.stringify({
    output: outputPath,
    mode: kbReady ? 'knowledge_base' : 'candidate',
    chunkCount: corpus.chunkCount,
    caseStudyCount: corpus.caseStudyCount,
    sourceCount: corpus.sourceCount,
    notebookCount: corpus.notebookCount,
    duplicateRate: corpus.duplicateRate,
    fullFlow: `${fullFlow.turnCount - fullFlow.failures.length}/${fullFlow.turnCount}`,
    oneQuestionRate: fullFlow.oneQuestionRate,
    inDomainRetrievalRate: retrieval.inDomainRate,
    outOfDomainRejectionRate: retrieval.outOfDomainRate,
    hardGatePassed,
    externalEmbeddingUsed: false
  }, null, 2));

  if (!hardGatePassed) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error && error.stack ? error.stack : error);
  process.exitCode = 1;
}
