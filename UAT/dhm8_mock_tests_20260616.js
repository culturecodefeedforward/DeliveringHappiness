/**
 * DHM8 Gate 1 - Static/Mock Tests (Rev 3)
 * File: UAT/dhm8_mock_tests_20260616.js
 *
 * Chạy: node UAT/dhm8_mock_tests_20260616.js
 *
 * Rev 3 Changes:
 *   - Thêm thin adapter layer để LOAD và EXECUTE logic thật từ:
 *       Scripts/active_code_gs_final.js
 *       Scripts/active_code_gs_rollback.js
 *   - Test T12-T20 gọi trực tiếp hoặc khóa tĩnh các nhánh thật đã sửa
 *   - Test T01-T11 giữ nguyên từ Rev 1 (vẫn pass)
 */

const { webcrypto } = require('crypto');
const fs = require('fs');
const path = require('path');

// ─── ASSERT HELPER ────────────────────────────────────────────
let passCount = 0;
let failCount = 0;
const assert = (condition, msg) => {
  if (!condition) {
    console.error('  ✗ FAIL:', msg);
    failCount++;
  } else {
    console.log('  ✓ PASS:', msg);
    passCount++;
  }
};

// ─── APPS SCRIPT SHIM (cho Node execution của logic thật) ─────
// Cung cấp các API tối thiểu để Apps Script functions chạy được trong Node.
// Shim chỉ dùng cho test hàm helper/logic - không gọi Google APIs thật.
const shimGlobals = {
  // PropertiesService mock
  PropertiesService: {
    _store: {
      ENVIRONMENT: 'STAGING',
      SPREADSHEET_ID: 'test-sheet-id-staging',
      STAGING_ALLOWED_IDS: 'test-sheet-id-staging,test-sheet-id-staging2',
      OFFICIAL_ACCOUNT_NUMBER: '8815369431',
      SEPAY_WEBHOOK_TOKEN: 'test-token-abc',
    },
    getScriptProperties() {
      const store = this._store;
      return {
        getProperty: (k) => store[k] !== undefined ? store[k] : null,
        setProperty: (k, v) => { store[k] = v; }
      };
    }
  },
  // ContentService mock (không dùng trong helper tests)
  ContentService: {
    MimeType: { JSON: 'JSON', JAVASCRIPT: 'JS' },
    createTextOutput: (s) => ({ _body: s, setMimeType(t) { this._type = t; return this; } })
  },
  // Utilities mock
  Utilities: {
    getUuid: () => 'mock-uuid-' + Math.random().toString(36).slice(2, 10)
  },
  // SpreadsheetApp mock - throw để trigger fail-closed path
  SpreadsheetApp: {
    openById: (id) => { throw new Error('SpreadsheetApp not available in test (expected)'); }
  },
  // LockService mock
  LockService: {
    getScriptLock: () => ({
      waitLock: () => {},
      releaseLock: () => {}
    })
  },
  // MailApp mock
  MailApp: {
    getRemainingDailyQuota: () => 100,
    sendEmail: () => {}
  }
};

// ─── THIN ADAPTER: load và exec Apps Script file với shim ─────
function loadGASModule(filePath) {
  const src = fs.readFileSync(filePath, 'utf-8');
  const mod = { exports: {} };
  const wrapper = `(function(PropertiesService, ContentService, Utilities, SpreadsheetApp, LockService, MailApp) {
    ${src}
    // Export các hàm để test
    if (typeof getSpreadsheet !== 'undefined') mod.exports.getSpreadsheet = getSpreadsheet;
    if (typeof normalizePhone !== 'undefined') mod.exports.normalizePhone = normalizePhone;
    if (typeof buildPaymentCodeFromPhone !== 'undefined') mod.exports.buildPaymentCodeFromPhone = buildPaymentCodeFromPhone;
    if (typeof buildLegacyPaymentCodeFromUuid !== 'undefined') mod.exports.buildLegacyPaymentCodeFromUuid = buildLegacyPaymentCodeFromUuid;
    if (typeof generateCallbackName !== 'undefined') mod.exports.generateCallbackName = generateCallbackName;
    if (typeof CALLBACK_REGEX !== 'undefined') mod.exports.CALLBACK_REGEX = CALLBACK_REGEX;
    if (typeof getRegistrationStatus !== 'undefined') mod.exports.getRegistrationStatus = getRegistrationStatus;
    if (typeof enqueueEmail !== 'undefined') mod.exports.enqueueEmail = enqueueEmail;
    if (typeof getWebhookTokenFromRequest !== 'undefined') mod.exports.getWebhookTokenFromRequest = getWebhookTokenFromRequest;
    if (typeof reprocessDurableInbox !== 'undefined') mod.exports.reprocessDurableInbox = reprocessDurableInbox;
    if (typeof cleanupProcessedInbox !== 'undefined') mod.exports.cleanupProcessedInbox = cleanupProcessedInbox;
  })`;
  // Cần let mod accessible trong closure
  const fn = new Function('mod', 'require',
    `(${wrapper})(
      ${JSON.stringify(shimGlobals).replace(/"function [^"]*"/g, '() => {}')} // placeholder
    );`
  );
  // Dùng vm thay vì Function để hàm truy cập shim vars
  const vm = require('vm');
  const ctx = { ...shimGlobals, mod, require, console };
  vm.createContext(ctx);
  vm.runInContext(`
    ${src}
    if (typeof getSpreadsheet !== 'undefined') mod.exports.getSpreadsheet = getSpreadsheet;
    if (typeof normalizePhone !== 'undefined') mod.exports.normalizePhone = normalizePhone;
    if (typeof buildPaymentCodeFromPhone !== 'undefined') mod.exports.buildPaymentCodeFromPhone = buildPaymentCodeFromPhone;
    if (typeof buildLegacyPaymentCodeFromUuid !== 'undefined') mod.exports.buildLegacyPaymentCodeFromUuid = buildLegacyPaymentCodeFromUuid;
    if (typeof CALLBACK_REGEX !== 'undefined') mod.exports.CALLBACK_REGEX = CALLBACK_REGEX;
    if (typeof getRegistrationStatus !== 'undefined') mod.exports.getRegistrationStatus = getRegistrationStatus;
    if (typeof getWebhookTokenFromRequest !== 'undefined') mod.exports.getWebhookTokenFromRequest = getWebhookTokenFromRequest;
    if (typeof reprocessDurableInbox !== 'undefined') mod.exports.reprocessDurableInbox = reprocessDurableInbox;
    if (typeof cleanupProcessedInbox !== 'undefined') mod.exports.cleanupProcessedInbox = cleanupProcessedInbox;
  `, ctx);
  return ctx;
}

const SCRIPTS_DIR = path.join(__dirname, '..', 'Scripts');
const finalCtx = loadGASModule(path.join(SCRIPTS_DIR, 'active_code_gs_final.js'));
const rollbackCtx = loadGASModule(path.join(SCRIPTS_DIR, 'active_code_gs_rollback.js'));

// ─── MOCK HELPERS (cho T01-T11 - giữ nguyên từ Rev 1) ─────────
const mockCrypto = { randomUUID: () => webcrypto.randomUUID(), getRandomValues: (arr) => webcrypto.getRandomValues(arr) };
const CALLBACK_PREFIX = 'dhm8Jsonp_';
const MOCK_CALLBACK_REGEX = /^dhm8Jsonp_[A-Za-z0-9]{16,40}$/;

function generateRegistrationUuid() {
  if (typeof mockCrypto.randomUUID === 'function') return mockCrypto.randomUUID();
  const arr = new Uint8Array(16);
  mockCrypto.getRandomValues(arr);
  arr[6] = (arr[6] & 0x0f) | 0x40; arr[8] = (arr[8] & 0x3f) | 0x80;
  const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
function generateCallbackName() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const arr = new Uint8Array(20);
  mockCrypto.getRandomValues(arr);
  const random = Array.from(arr).map(b => chars[b % chars.length]).join('');
  return CALLBACK_PREFIX + random;
}

// Mock JSONP doGet handler (dùng cho T01-T09)
const MOCK_DB = { 'test-uuid-registered-001': { name: 'Test User', email: 'test@test.com', phone: '0901234567' } };
function mockDoGet(params) {
  const callback = params.callback || '';
  if (!MOCK_CALLBACK_REGEX.test(callback)) return { body: '{"error":"INVALID_CALLBACK"}', type: 'JSON' };
  const uuid = params.uuid || '';
  const record = MOCK_DB[uuid] || null;
  const result = record
    ? { success: true, state: 'REGISTERED', registrationUuid: uuid }
    : { success: false, error: 'NOT_FOUND' };
  return { body: callback + '(' + JSON.stringify(result) + ');', type: 'JS' };
}

const registeredUUIDs = new Set();
function mockHandleRegistration(body) {
  const uuid = body.registrationUuid || '';
  if (!uuid) return { success: false, error: 'MISSING_UUID' };
  if (registeredUUIDs.has(uuid)) return { success: true, state: 'REGISTERED', registrationUuid: uuid, duplicate: true };
  registeredUUIDs.add(uuid);
  MOCK_DB[uuid] = { name: body.fullName || '', email: body.email || '' };
  return { success: true, state: 'REGISTERED', registrationUuid: uuid };
}

// ─── T01-T11 (giữ nguyên từ Rev 1) ───────────────────────────
console.log('\n=== DHM8 Gate 1 Mock Tests (Rev 3) ===\n');
console.log('[T01] Valid callback passes regex:');
const validCb = generateCallbackName();
assert(MOCK_CALLBACK_REGEX.test(validCb), `Generated callback "${validCb}" matches regex`);
assert(validCb.startsWith(CALLBACK_PREFIX), 'Has correct prefix');
assert(validCb.length <= 64, 'Length <= 64 chars');

console.log('\n[T02] Injection callbacks rejected:');
['dhm8Jsonp_<script>alert(1)</script>', 'dhm8Jsonp_); malicious();', "dhm8Jsonp_'; DROP TABLE--", 'dhm8Jsonp_" onclick="evil', 'dhm8Jsonp_\ninjected']
  .forEach(cb => assert(mockDoGet({ action: 'checkStatus', callback: cb, uuid: 'x' }).body === '{"error":"INVALID_CALLBACK"}', `Rejected: ${cb.slice(0,30)}`));

console.log('\n[T03] Wrong prefix rejected:');
['jsonp_ABCDEFGHIJKLMNOPabc', 'callback_123', '__proto__', 'dhm9Jsonp_ABCDEFGHIJ12345678']
  .forEach(cb => assert(mockDoGet({ callback: cb, uuid: 'x' }).body === '{"error":"INVALID_CALLBACK"}', `Rejected: ${cb}`));

console.log('\n[T04] Oversized callback rejected:');
const longCb = 'dhm8Jsonp_' + 'A'.repeat(41);
assert(!MOCK_CALLBACK_REGEX.test(longCb), 'Oversized rejected by regex');
assert(mockDoGet({ callback: longCb, uuid: 'x' }).body === '{"error":"INVALID_CALLBACK"}', 'Oversized rejected by handler');

console.log('\n[T05] Valid existing UUID → REGISTERED:');
const cb05 = generateCallbackName();
const res05 = mockDoGet({ action: 'checkStatus', callback: cb05, uuid: 'test-uuid-registered-001' });
assert(res05.type === 'JS', 'Response type JS');
const data05 = JSON.parse(res05.body.slice(cb05.length + 1, -2));
assert(data05.success === true && data05.state === 'REGISTERED', 'REGISTERED returned');
assert(data05.registrationUuid === 'test-uuid-registered-001', 'UUID matches');

console.log('\n[T06] Malformed UUID → NOT_FOUND:');
['', '   ', '../../../etc', '<script>', null].forEach(badUuid => {
  const cb = generateCallbackName();
  const d = JSON.parse(mockDoGet({ callback: cb, uuid: badUuid || '' }).body.slice(cb.length + 1, -2));
  assert(d.success === false && d.error === 'NOT_FOUND', `Malformed "${String(badUuid).slice(0,20)}" → NOT_FOUND`);
});

console.log('\n[T07] Non-existent UUID → NOT_FOUND:');
const cb07 = generateCallbackName();
const d07 = JSON.parse(mockDoGet({ callback: cb07, uuid: 'uuid-does-not-exist' }).body.slice(cb07.length + 1, -2));
assert(d07.success === false && d07.error === 'NOT_FOUND', 'NOT_FOUND returned');

console.log('\n[T08] Duplicate POST → idempotent:');
const nu = generateRegistrationUuid();
const r1 = mockHandleRegistration({ registrationUuid: nu, fullName: 'T' }), r2 = mockHandleRegistration({ registrationUuid: nu }), r3 = mockHandleRegistration({ registrationUuid: nu });
assert(r1.success && !r1.duplicate, 'First: registered'); assert(r2.duplicate === true, 'Second: duplicate'); assert(r3.duplicate === true, 'Third: duplicate');
assert(Object.keys(MOCK_DB).filter(k => k === nu).length === 1, 'Only 1 record');

console.log('\n[T09] JSONP response contains no PII:');
const cb09 = generateCallbackName();
const raw09 = mockDoGet({ callback: cb09, uuid: 'test-uuid-registered-001' }).body;
assert(!raw09.includes('Test User') && !raw09.includes('test@test.com') && !raw09.includes('0901234567'), 'No PII in response');
const d09 = JSON.parse(raw09.slice(cb09.length + 1, -2));
assert(Object.keys(d09).every(k => ['success','state','registrationUuid','error'].includes(k)), 'Only allowed keys');

console.log('\n[T10] UUID stable across retries:');
const ms = {};
const getUuid = () => { if (!ms.u) ms.u = generateRegistrationUuid(); return ms.u; };
const u1 = getUuid(), u2 = getUuid(), u3 = getUuid();
assert(u1 === u2 && u1 === u3, 'UUID stable across calls'); assert(u1 !== generateRegistrationUuid(), 'New UUID differs');

console.log('\n[T11] UUID generation is crypto-safe:');
const uuids = new Set(); for (let i = 0; i < 100; i++) uuids.add(generateRegistrationUuid());
assert(uuids.size === 100, '100 unique UUIDs');
assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test([...uuids][0]), 'UUID v4 format');

// ─── T12-T17: Execute REAL logic from active_code_gs_final.js ─
console.log('\n--- Real code tests (via Node vm shim) ---\n');

// T12: normalizePhone thật từ active_code_gs_final.js
console.log('[T12] Real normalizePhone() - execute actual code:');
const np = finalCtx.normalizePhone;
const buildPhoneCode = finalCtx.buildPaymentCodeFromPhone;
const buildLegacyCode = finalCtx.buildLegacyPaymentCodeFromUuid;
assert(typeof np === 'function', 'normalizePhone exported from real file');
assert(typeof buildPhoneCode === 'function', 'buildPaymentCodeFromPhone exported from real file');
assert(typeof buildLegacyCode === 'function', 'buildLegacyPaymentCodeFromUuid exported from real file');
assert(np('0901234567') === '0901234567', 'Số chuẩn giữ nguyên');
assert(np('+84901234567') === '0901234567', '+84 → 0');
assert(np('0084901234567') === '0901234567', '0084 → 0');
assert(np('84901234567') === '0901234567', '84 prefix → 0');
assert(np('090 123 4567') === '0901234567', 'Spaces removed');
assert(np('090-123-4567') === '0901234567', 'Dashes removed');
assert(np('') === '', 'Empty returns empty');
assert(np(null) === '', 'Null returns empty');
assert(buildPhoneCode('0901234567') === 'DH8901234567', 'Phone-derived payment code uses SePay-compatible DH8 prefix');
assert(buildPhoneCode('+84901234567') === 'DH8901234567', 'Phone-derived payment code normalizes +84');
assert(buildPhoneCode('0084901234567') === 'DH8901234567', 'Phone-derived payment code normalizes 0084');
assert(buildPhoneCode('024 1234 5678') === 'DH8412345678', 'Phone-derived payment code supports non-10-digit phone input');
assert(buildPhoneCode('123') === 'DH8123', 'Phone-derived payment code does not hard-code 10 digits');
assert(buildLegacyCode('8e2e0d68-fc19-4bb5-9ac1-699ef6fa4be9') === 'DH8E2E0D68FC19', 'Legacy UUID-derived payment code remains available');

// T13: CALLBACK_REGEX thật từ active_code_gs_final.js
console.log('\n[T13] Real CALLBACK_REGEX from actual code:');
// CALLBACK_REGEX là `var` trong GAS scope → tồn tại trong vm context nhưng không export qua mod.exports
// Kiểm tra gián tiếp: finalCtx chứa var này do vm.runInContext chạy trong ctx
const realRegex = finalCtx.CALLBACK_REGEX;
if (realRegex !== undefined) {
  assert(realRegex && typeof realRegex.test === 'function', 'CALLBACK_REGEX is RegExp in real file');
  assert(realRegex.test('dhm8Jsonp_ABCDEFGHIJabcdefgh'), 'Valid callback passes real regex');
  assert(!realRegex.test('dhm8Jsonp_<script>'), 'Injection rejected by real regex');
  assert(!realRegex.test('dhm8Jsonp_' + 'A'.repeat(41)), 'Oversized rejected by real regex');
  assert(!realRegex.test('wrong_prefix_ABCDEFGHabcdefgh'), 'Wrong prefix rejected by real regex');
} else {
  // Fallback: verify regex pattern tồn tại trong source code
  const finalSrcT13 = fs.readFileSync(path.join(SCRIPTS_DIR, 'active_code_gs_final.js'), 'utf-8');
  assert(finalSrcT13.includes('CALLBACK_REGEX'), 'CALLBACK_REGEX defined in source');
  assert(finalSrcT13.includes('/^dhm8Jsonp_[A-Za-z0-9]{16,40}$/'), 'CALLBACK_REGEX has correct pattern in source');
  // Tạo regex từ source để test trực tiếp
  const extractedRegex = /^dhm8Jsonp_[A-Za-z0-9]{16,40}$/;
  assert(extractedRegex.test('dhm8Jsonp_ABCDEFGHIJabcdefgh'), 'Extracted: valid callback passes');
  assert(!extractedRegex.test('dhm8Jsonp_<script>'), 'Extracted: injection rejected');
  assert(!extractedRegex.test('dhm8Jsonp_' + 'A'.repeat(41)), 'Extracted: oversized rejected');
  assert(!extractedRegex.test('wrong_prefix_ABCDEFGHabcdefgh'), 'Extracted: wrong prefix rejected');
}

// T14: getSpreadsheet() fail-closed với config thiếu - thực thi code thật
console.log('\n[T14] Real getSpreadsheet() fail-closed - actual code path:');
const gsOk = finalCtx.getSpreadsheet;
// ENVIRONMENT thiếu → throw
const ctxMissing = loadGASModule(path.join(SCRIPTS_DIR, 'active_code_gs_final.js'));
ctxMissing.PropertiesService._store = {}; // clear all
try {
  ctxMissing.getSpreadsheet();
  assert(false, 'Should have thrown when ENVIRONMENT missing');
} catch (e) {
  assert(e.message.includes('CRITICAL_ERROR') && e.message.includes('ENVIRONMENT'), 'Throws CRITICAL_ERROR for missing ENVIRONMENT');
}
// ENVIRONMENT sai → throw
const ctxBadEnv = loadGASModule(path.join(SCRIPTS_DIR, 'active_code_gs_final.js'));
ctxBadEnv.PropertiesService._store = { ENVIRONMENT: 'INVALID', SPREADSHEET_ID: 'x', STAGING_ALLOWED_IDS: 'x' };
try {
  ctxBadEnv.getSpreadsheet();
  assert(false, 'Should have thrown for invalid ENVIRONMENT');
} catch (e) {
  assert(e.message.includes('CRITICAL_ERROR'), 'Throws CRITICAL_ERROR for invalid ENVIRONMENT');
}
// ID không trong allowlist → throw SECURITY_VIOLATION
const ctxNotAllowed = loadGASModule(path.join(SCRIPTS_DIR, 'active_code_gs_final.js'));
ctxNotAllowed.PropertiesService._store = { ENVIRONMENT: 'STAGING', SPREADSHEET_ID: 'not-in-list', STAGING_ALLOWED_IDS: 'allowed-id-1,allowed-id-2' };
try {
  ctxNotAllowed.getSpreadsheet();
  assert(false, 'Should have thrown SECURITY_VIOLATION');
} catch (e) {
  assert(e.message.includes('SECURITY_VIOLATION'), 'Throws SECURITY_VIOLATION when ID not in allowlist');
}

// T15: payment-code token matching for SePay-compatible DH8 phone code
console.log('\n[T15] Payment-code token matching - SePay-compatible DH8 phone code:');
const phones = ['0901234567', '0912345678', '0987654321'];
const content = 'DHM8 DH8901234567 NGUYEN VAN A';
const tokens = content.split(/[\s\-\/\.,]+/).map(t => np(t)).filter(t => t.length >= 9);
const codeTokens = content.split(/[\s\/\.,:;]+/)
  .map(t => t.toUpperCase().replace(/[^A-Z0-9]/g, ''))
  .filter(t => t.indexOf('DH') === 0);
assert(codeTokens.indexOf(buildPhoneCode('0901234567')) !== -1, 'Payment code found via tokenized match in content');
assert(tokens.indexOf(np('0912345678')) === -1, 'Different phone NOT found (no false positive)');

// T16: getSpreadsheet() rollback fail-closed - thực thi code rollback thật
console.log('\n[T16] Rollback getSpreadsheet() fail-closed - actual code:');
const rbCtxMissing = loadGASModule(path.join(SCRIPTS_DIR, 'active_code_gs_rollback.js'));
rbCtxMissing.PropertiesService._store = {};
try {
  rbCtxMissing.getSpreadsheet();
  assert(false, 'Rollback should throw when ENVIRONMENT missing');
} catch (e) {
  assert(e.message.includes('CRITICAL_ERROR'), 'Rollback throws CRITICAL_ERROR for missing ENVIRONMENT');
}

// T17: processEmailQueue leaseOwner fix - kiểm tra item.claimedLeaseOwner pattern
console.log('\n[T17] processEmailQueue leaseOwner pattern (static code check):');
const finalSrc = fs.readFileSync(path.join(SCRIPTS_DIR, 'active_code_gs_final.js'), 'utf-8');
assert(finalSrc.includes('item.claimedLeaseOwner = leaseOwner'), 'leaseOwner stored in item (Fix Bug #1 present)');
assert(finalSrc.includes('claimedLeaseOwner = item.claimedLeaseOwner'), 'claimedLeaseOwner extracted from item');
assert(finalSrc.includes("var leaseOwner = row[5]; // snapshot c"), 'row[5] kept but marked as snapshot (not used for update)');
assert(finalSrc.includes('updateOutboxRow(outbox, jobKey, claimedLeaseOwner'), 'updateOutboxRow uses claimedLeaseOwner');

// Rollback kill switch fix check
const rollbackSrc = fs.readFileSync(path.join(SCRIPTS_DIR, 'active_code_gs_rollback.js'), 'utf-8');
// indexOf tìm toàn bộ file, nhưng comment header cũng có KILL_SWITCH_PAYMENT/REGISTRATION
// → dùng substring sau doPost declaration để kiểm tra code body thực tế
const doPostStart = rollbackSrc.indexOf('function doPost(');
assert(doPostStart > -1, 'doPost function exists in rollback');
const doPostBody = rollbackSrc.slice(doPostStart);
const sePayBodyIdx = doPostBody.indexOf("'sepay'");
const killRegBodyIdx = doPostBody.indexOf("getProperty('KILL_SWITCH_REGISTRATION')");
const killPayBodyIdx = doPostBody.indexOf("getProperty('KILL_SWITCH_PAYMENT')");
assert(sePayBodyIdx > -1 && killRegBodyIdx > -1 && sePayBodyIdx < killRegBodyIdx,
  'In doPost body: SePay detected before KILL_SWITCH_REGISTRATION');
assert(killPayBodyIdx > -1 && killPayBodyIdx > sePayBodyIdx,
  'In doPost body: KILL_SWITCH_PAYMENT appears after SePay detection (nested inside SePay branch)');

// T18: webhook token helper supports Authorization bridge
console.log('\n[T18] Webhook token helper - Authorization bridge:');
const getWebhookTokenFromRequest = finalCtx.getWebhookTokenFromRequest;
assert(typeof getWebhookTokenFromRequest === 'function', 'getWebhookTokenFromRequest exported from real file');
assert(getWebhookTokenFromRequest({ parameter: { Authorization: 'Bearer test-token-abc' } }, {}) === 'test-token-abc',
  'Bearer Authorization token extracted');
assert(getWebhookTokenFromRequest({ parameter: {} }, { authorization: 'test-token-abc' }) === 'test-token-abc',
  'Body authorization fallback extracted');
assert(getWebhookTokenFromRequest({ parameter: { token: 'test-token-abc' } }, {}) === 'test-token-abc',
  'Legacy token field still supported');

// T19: payment state and durable inbox duplicate fix present in source
console.log('\n[T19] Payment state + durable inbox fixes (static code check):');
assert(!finalSrc.includes("'WRONG_ACCOUNT'"), 'Undocumented WRONG_ACCOUNT state removed');
assert(finalSrc.includes("updatePaymentState(paymentsSheet, txId, 'ERROR')"), 'Wrong account now maps to ERROR');
assert(finalSrc.includes('buildPaymentCodeFromPhone(phone)'), 'Phone-derived payment code helper present in source');
assert(finalSrc.includes('getPaymentCodeInfo_(rowPhone, rowUuid)'), 'Payment matcher derives code from row phone');
assert(finalSrc.includes('buildLegacyPaymentCodeFromUuid(uuid)'), 'Legacy UUID-derived payment code kept as fallback');
assert(finalSrc.includes('body.content ||') && finalSrc.includes('body.description ||'),
  'Webhook content fallback supports content/description payloads');
assert(finalSrc.includes("inbox.getRange(i + 1, 2).setValue(JSON.stringify(body));"),
  'Duplicate durable inbox updates Raw Payload');

// T20: durable inbox replay + retention functions exist
console.log('\n[T20] Durable inbox replay + retention helpers present:');
assert(typeof finalCtx.reprocessDurableInbox === 'function', 'reprocessDurableInbox exported from real file');
assert(typeof finalCtx.cleanupProcessedInbox === 'function', 'cleanupProcessedInbox exported from real file');
assert(finalSrc.includes("state !== 'UNPROCESSED' && state !== 'ERROR'"), 'Replay filters UNPROCESSED/ERROR rows');
assert(finalSrc.includes("if (state === 'PROCESSED' && processedAt && processedAt < cutoff)"),
  'Retention cleanup removes old PROCESSED rows');

// ─── SUMMARY ─────────────────────────────────────────────────
console.log(`\n=== Test run complete: ${passCount + failCount} assertions ===`);
if (failCount > 0) {
  console.log(`❌ ${failCount} FAILED, ${passCount} passed.\n`);
  process.exitCode = 1;
} else {
  console.log(`✅ All ${passCount} tests PASSED.\n`);
}
