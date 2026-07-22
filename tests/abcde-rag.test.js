'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  RETRIEVAL_MODEL,
  buildRetrievalQuery,
  hasDisputationIntent,
  inspectKnowledgeBase,
  lexicalScore,
  loadAuditedKnowledgeBase,
  rankKnowledge,
  selectSocraticLens,
  selectSourceDiverse
} = require('../lib/abcde-rag-retrieval');

function chunk(id, sourceId, text, vector = []) {
  return {
    id,
    sourceId,
    sourceTitle: sourceId,
    sourceType: 'test',
    title: id,
    text,
    vector,
    citation: sourceId,
    location: 'fixture',
    concept: 'fixture',
    reviewStatus: 'approved'
  };
}

function writeAuditedKnowledgeBase(directory, records, manifestOverrides = {}) {
  const kbPath = path.join(directory, 'knowledge.json');
  const manifestPath = path.join(directory, 'manifest.json');
  const raw = JSON.stringify(records);
  fs.writeFileSync(kbPath, raw, 'utf8');
  const approvedCount = records.filter(record => record.metadata.review_status === 'approved').length;
  const manifest = {
    version: 'test-v1',
    retrieval_model: RETRIEVAL_MODEL,
    chunk_count: records.length,
    approved_chunk_count: approvedCount,
    vector_dimensions: 0,
    knowledge_base_sha256: crypto.createHash('sha256').update(raw, 'utf8').digest('hex'),
    ...manifestOverrides
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest), 'utf8');
  return { kbPath, manifestPath };
}

test('retrieval query carries A-B-C and weights B twice', () => {
  const query = buildRetrievalQuery(
    { A: 'Sếp giao việc gấp', B: 'Tôi nghĩ sếp ghét mình', C: 'Tôi lo và im lặng' },
    'Tôi muốn phản biện'
  );
  assert.match(query, /Nghịch cảnh: Sếp giao việc gấp/);
  assert.equal((query.match(/sếp ghét mình/gi) || []).length, 2);
  assert.match(query, /Hệ quả: Tôi lo và im lặng/);
});

test('full-context lexical score beats message-only score for the matching case', () => {
  const document = 'Sếp giao deadline gấp khiến người học tin rằng sếp ghét mình và thấy lo lắng.';
  const full = buildRetrievalQuery(
    { A: 'Sếp giao deadline gấp', B: 'Tôi nghĩ sếp ghét mình', C: 'Tôi lo lắng' },
    'Có đúng không'
  );
  assert.ok(lexicalScore(full, document) > lexicalScore('Có đúng không', document));
});

test('local TF-IDF confidence gate keeps source-diverse lexical results', () => {
  const entries = [
    chunk('a1', 'source-a', 'bằng chứng sếp giao việc gấp'),
    chunk('a2', 'source-a', 'bằng chứng khác về sếp giao việc'),
    chunk('b1', 'source-b', 'cách giải thích khác cho deadline')
  ];
  const ranked = rankKnowledge(null, 'sếp giao việc deadline bằng chứng cách giải thích khác', entries, {
    topK: 2,
    minScore: 0,
    minCoverage: 0,
    currentMessage: 'Tôi muốn kiểm tra bằng chứng và cách giải thích khác.'
  });
  assert.equal(ranked.status, 'grounded');
  assert.equal(ranked.results.length, 2);
  assert.equal(new Set(ranked.results.map(item => item.sourceId)).size, 2);
});

test('technical answer request is outside the disputation retrieval domain', () => {
  const entries = [
    chunk('a1', 'source-a', 'Bằng chứng giúp kiểm tra niềm tin trong ABCDE.')
  ];
  const currentMessage = 'Tôi phải uống chính xác bao nhiêu miligam metformin mỗi ngày?';
  const ranked = rankKnowledge(null, currentMessage, entries, {
    minScore: 0,
    minCoverage: 0,
    currentMessage
  });
  assert.equal(hasDisputationIntent(currentMessage), false);
  assert.equal(ranked.status, 'no_match');
  assert.equal(ranked.results.length, 0);
});

test('local retrieval selects a generic Socratic lens without exposing chunk text', () => {
  assert.equal(
    selectSocraticLens([chunk('a1', 'source-a', 'nội dung', [])], 'Tôi muốn tìm một cách giải thích khác.'),
    'Alternatives'
  );
  assert.equal(
    selectSocraticLens([{ ...chunk('a2', 'source-a', 'nội dung', []), concept: 'rational_action_and_stages' }], ''),
    'Utility'
  );
});

test('source deduplication removes identical normalized text', () => {
  const selected = selectSourceDiverse([
    { ...chunk('a1', 'a', 'Cùng một đoạn.', [1]), score: 0.9 },
    { ...chunk('b1', 'b', 'Cùng một đoạn!', [1]), score: 0.8 },
    { ...chunk('c1', 'c', 'Đoạn độc lập.', [1]), score: 0.7 }
  ], 3);
  assert.deepEqual(selected.map(item => item.id), ['a1', 'c1']);
});

test('missing knowledge base is an infrastructure state, not RAG success', () => {
  const health = inspectKnowledgeBase({
    kbPath: 'Z:\\definitely-missing\\knowledge.json',
    manifestPath: 'Z:\\definitely-missing\\manifest.json'
  });
  assert.equal(health.available, false);
  assert.equal(health.chunkCount, 0);
  assert.equal(health.errorCode, 'KB_FILE_MISSING');
});

test('a knowledge base without its reviewed manifest is not healthy', () => {
  const health = inspectKnowledgeBase({
    kbPath: path.join(process.cwd(), 'data', 'artifacts', 'knowledge_base_abcde.json'),
    manifestPath: 'Z:\\definitely-missing\\manifest.json'
  });
  assert.equal(health.available, false);
  assert.equal(health.manifestAvailable, false);
  assert.equal(health.errorCode, 'KB_MANIFEST_MISSING');
});

test('audited knowledge base requires a matching SHA-256 manifest', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'abcde-kb-hash-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const records = [{
    id: 'approved-1',
    metadata: {
      text: 'Đoạn tri thức đã duyệt.',
      source_id: 'source-1',
      review_status: 'approved'
    }
  }];
  const paths = writeAuditedKnowledgeBase(directory, records);
  assert.equal(inspectKnowledgeBase(paths).available, true);

  const mismatched = writeAuditedKnowledgeBase(directory, records, {
    knowledge_base_sha256: '0'.repeat(64)
  });
  const health = inspectKnowledgeBase(mismatched);
  assert.equal(health.available, false);
  assert.equal(health.hashMatches, false);
  assert.equal(health.errorCode, 'KB_MANIFEST_MISMATCH');
  assert.throws(
    () => loadAuditedKnowledgeBase(mismatched),
    error => error && error.code === 'KB_MANIFEST_MISMATCH'
  );
});

test('audited local TF-IDF knowledge base rejects neural vectors', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'abcde-kb-dimensions-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const paths = writeAuditedKnowledgeBase(directory, [
    {
      id: 'approved-1',
      vector: [1, 0],
      metadata: { text: 'Đoạn một.', source_id: 'source-1', review_status: 'approved' }
    },
    {
      id: 'approved-2',
      vector: [],
      metadata: { text: 'Đoạn hai.', source_id: 'source-2', review_status: 'approved' }
    }
  ]);
  const health = inspectKnowledgeBase(paths);
  assert.equal(health.available, false);
  assert.equal(health.errorCode, 'KB_UNEXPECTED_NEURAL_VECTORS');
});
