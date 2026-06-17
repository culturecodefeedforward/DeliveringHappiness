/**
 * DHM8 Gate 2 Staging UAT Runner
 * File: Scripts/dhm8_gate2_uat_runner.js
 *
 * Copy this file into the same Apps Script staging project as
 * Scripts/active_code_gs_final.js, then run runDHM8Gate2UAT().
 *
 * The runner mutates only the spreadsheet resolved by getSpreadsheet().
 * Use it with ENVIRONMENT=STAGING and a staging-only SPREADSHEET_ID.
 */

var DHM8_UAT_TOKEN = 'test-sepay-token-123456';
var DHM8_UAT_ACCOUNT = '123456789';
var DHM8_UAT_PHONE = '0901234567';
var DHM8_UAT_AMOUNT = 3000;

function bootstrapDHM8Gate2Staging() {
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) throw new Error('No active spreadsheet for staging bootstrap');

  var id = active.getId();
  var props = PropertiesService.getScriptProperties();
  props.setProperties({
    ENVIRONMENT: 'STAGING',
    SPREADSHEET_ID: id,
    STAGING_ALLOWED_IDS: id,
    SEPAY_WEBHOOK_TOKEN: DHM8_UAT_TOKEN,
    OFFICIAL_ACCOUNT_NUMBER: DHM8_UAT_ACCOUNT,
    TEST_MODE: 'true',
    RECIPIENT_ALLOWLIST: 'vuhoang2708@gmail.com',
    MOCK_QUOTA: '100',
    KILL_SWITCH_REGISTRATION: 'false',
    KILL_SWITCH_EMAIL: 'false',
    KILL_SWITCH_PAYMENT: 'false'
  }, true);

  return {
    success: true,
    spreadsheetId: id,
    spreadsheetUrl: active.getUrl()
  };
}

function runDHM8Gate2UAT() {
  var startedAt = new Date();
  var results = [];

  resetDHM8Gate2StagingData_();
  setDHM8Gate2BaseProperties_();

  recordUat_(results, 'UAT-01 registration happy path', function() {
    var uuid = 'uat-reg-' + Utilities.getUuid();
    var res = parseJsonOutput_(doPost(makePostEvent_(registrationPayload_(uuid, DHM8_UAT_PHONE), {})));
    var ss = getSpreadsheet();
    assert_(res.success === true && res.state === 'REGISTERED', 'registration response must be REGISTERED');
    assert_(countRowsByValue_(ss, 'DHM8_Data', 18, uuid) === 1, 'DHM8_Data must contain exactly one registration row');
    assert_(countRowsByPrefix_(ss, 'DHM8_Email_Outbox', 1, uuid + ':') === 2, 'outbox must contain PENDING and BTC jobs');
    return 'uuid=' + uuid;
  });

  recordUat_(results, 'UAT-02 duplicate registration and outbox backfill', function() {
    var uuid = 'uat-dup-' + Utilities.getUuid();
    doPost(makePostEvent_(registrationPayload_(uuid, '0901111222'), {}));
    deleteOutboxJob_(uuid + ':BTC');
    var res = parseJsonOutput_(doPost(makePostEvent_(registrationPayload_(uuid, '0901111222'), {})));
    var ss = getSpreadsheet();
    assert_(res.duplicate === true, 'duplicate response expected');
    assert_(countRowsByValue_(ss, 'DHM8_Data', 18, uuid) === 1, 'duplicate must not append data row');
    assert_(countRowsByPrefix_(ss, 'DHM8_Email_Outbox', 1, uuid + ':') === 2, 'missing outbox job must be backfilled');
    return 'uuid=' + uuid;
  });

  recordUat_(results, 'UAT-03 JSONP checkStatus contract', function() {
    var uuid = 'uat-jsonp-' + Utilities.getUuid();
    doPost(makePostEvent_(registrationPayload_(uuid, '0902222333'), {}));
    var callback = 'dhm8Jsonp_ABCDEFGHIJKLMNOP';
    var body = getTextOutput_(doGet({ parameter: { action: 'checkStatus', uuid: uuid, callback: callback } }));
    assert_(body.indexOf(callback + '(') === 0, 'JSONP callback wrapper expected');
    var payload = JSON.parse(body.slice(callback.length + 1, -2));
    var keys = Object.keys(payload).sort().join(',');
    assert_(payload.success === true && payload.state === 'REGISTERED', 'registered JSONP payload expected');
    assert_(keys === 'registrationUuid,state,success', 'payload keys must stay whitelisted');
    assert_(body.indexOf('@') === -1 && body.indexOf(DHM8_UAT_PHONE) === -1, 'payload must not expose PII');
    return 'callback=' + callback;
  });

  recordUat_(results, 'UAT-04 JSONP invalid callback and NOT_FOUND', function() {
    var invalid = getTextOutput_(doGet({ parameter: { action: 'checkStatus', uuid: 'x', callback: 'dhm8Jsonp_<script>' } }));
    var callback = 'dhm8Jsonp_QRSTUVWXYZabcdef';
    var notFound = getTextOutput_(doGet({ parameter: { action: 'checkStatus', uuid: 'missing-uuid', callback: callback } }));
    assert_(invalid.indexOf('INVALID_CALLBACK') !== -1, 'invalid callback must be rejected');
    assert_(notFound.indexOf('NOT_FOUND') !== -1, 'unknown UUID must return NOT_FOUND');
    return 'invalid callback rejected; NOT_FOUND verified';
  });

  recordUat_(results, 'UAT-05 webhook auth negative and accepted token', function() {
    var missing = parseJsonOutput_(doPost(makePostEvent_(sepayPayload_('uat-auth-missing', DHM8_UAT_PHONE), { source: 'sepay' })));
    var wrong = parseJsonOutput_(doPost(makePostEvent_(sepayPayload_('uat-auth-wrong', DHM8_UAT_PHONE), { source: 'sepay', token: 'wrong' })));
    var accepted = parseJsonOutput_(doPost(makePostEvent_(sepayPayload_('uat-auth-ok', DHM8_UAT_PHONE), {
      source: 'sepay',
      Authorization: 'Bearer ' + DHM8_UAT_TOKEN
    })));
    assert_(missing.error === 'INVALID_TOKEN', 'missing token must be rejected');
    assert_(wrong.error === 'INVALID_TOKEN', 'wrong token must be rejected');
    assert_(accepted.success === true, 'Authorization bridge token must be accepted');
    return 'auth paths verified';
  });

  recordUat_(results, 'UAT-06 valid payment matching', function() {
    var uuid = 'uat-pay-' + Utilities.getUuid();
    doPost(makePostEvent_(registrationPayload_(uuid, DHM8_UAT_PHONE), {}));
    var txId = 'uat-pay-tx-' + Utilities.getUuid();
    var res = parseJsonOutput_(doPost(makePostEvent_(sepayPayload_(txId, DHM8_UAT_PHONE), {
      source: 'sepay',
      token: DHM8_UAT_TOKEN
    })));
    var ss = getSpreadsheet();
    assert_(res.success === true, 'payment webhook success response expected');
    assert_(getPaymentState_(ss, txId) === 'MATCHED', 'payment state must be MATCHED');
    assert_(getDataPaymentStatus_(ss, uuid) === 'PAID', 'registration must become PAID');
    assert_(countRowsByPrefix_(ss, 'DHM8_Email_Outbox', 1, uuid + ':') >= 3, 'PAID/BTC outbox jobs expected');
    return 'txId=' + txId + ', uuid=' + uuid;
  });

  recordUat_(results, 'UAT-07 wrong account', function() {
    var uuid = 'uat-wrong-account-' + Utilities.getUuid();
    doPost(makePostEvent_(registrationPayload_(uuid, '0903333444'), {}));
    var txId = 'uat-wrong-account-tx-' + Utilities.getUuid();
    var payload = sepayPayload_(txId, '0903333444');
    payload.accountNumber = '999999999';
    doPost(makePostEvent_(payload, { source: 'sepay', token: DHM8_UAT_TOKEN }));
    assert_(getPaymentState_(getSpreadsheet(), txId) === 'ERROR', 'wrong account must map to ERROR');
    assert_(getDataPaymentStatus_(getSpreadsheet(), uuid) === 'PENDING', 'wrong account must not mark PAID');
    return 'txId=' + txId;
  });

  recordUat_(results, 'UAT-08 wrong amount', function() {
    var txId = 'uat-wrong-amount-tx-' + Utilities.getUuid();
    var payload = sepayPayload_(txId, '0904444555');
    payload.transferAmount = 100000;
    doPost(makePostEvent_(payload, { source: 'sepay', token: DHM8_UAT_TOKEN }));
    assert_(getPaymentState_(getSpreadsheet(), txId) === 'NO_MATCH', 'wrong amount must map to NO_MATCH');
    return 'txId=' + txId;
  });

  recordUat_(results, 'UAT-09 no matching phone', function() {
    var txId = 'uat-no-phone-tx-' + Utilities.getUuid();
    doPost(makePostEvent_(sepayPayload_(txId, '0919999888'), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    assert_(getPaymentState_(getSpreadsheet(), txId) === 'NO_MATCH', 'no matching phone must map to NO_MATCH');
    return 'txId=' + txId;
  });

  recordUat_(results, 'UAT-10 ambiguous phone match', function() {
    doPost(makePostEvent_(registrationPayload_('uat-amb-a-' + Utilities.getUuid(), '0905555666'), {}));
    doPost(makePostEvent_(registrationPayload_('uat-amb-b-' + Utilities.getUuid(), '0905555666'), {}));
    var txId = 'uat-amb-tx-' + Utilities.getUuid();
    doPost(makePostEvent_(sepayPayload_(txId, '0905555666'), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    assert_(getPaymentState_(getSpreadsheet(), txId) === 'ERROR', 'ambiguous match must map to ERROR');
    return 'txId=' + txId;
  });

  recordUat_(results, 'UAT-11 duplicate payment webhook', function() {
    var txId = 'uat-dup-pay-tx-' + Utilities.getUuid();
    doPost(makePostEvent_(sepayPayload_(txId, '0906666777'), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    var before = countRowsByValue_(getSpreadsheet(), 'DHM8_Payments', 1, txId);
    doPost(makePostEvent_(sepayPayload_(txId, '0906666777'), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    var row = findRowByValue_(getSpreadsheet().getSheetByName('DHM8_Payments'), 1, txId);
    assert_(before === 1 && countRowsByValue_(getSpreadsheet(), 'DHM8_Payments', 1, txId) === 1, 'duplicate must not append row');
    assert_(row[7] >= 1, 'Duplicate Count must increment');
    return 'txId=' + txId + ', duplicateCount=' + row[7];
  });

  recordUat_(results, 'UAT-12 kill switch payment durable inbox', function() {
    PropertiesService.getScriptProperties().setProperty('KILL_SWITCH_PAYMENT', 'true');
    var txId = 'uat-inbox-tx-' + Utilities.getUuid();
    doPost(makePostEvent_(sepayPayload_(txId, '0907777888'), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    assert_(countRowsByValue_(getSpreadsheet(), 'DHM8_Inbox', 1, txId) === 1, 'inbox row expected');
    assert_(findRowByValue_(getSpreadsheet().getSheetByName('DHM8_Inbox'), 1, txId)[2] === 'UNPROCESSED', 'inbox state must be UNPROCESSED');
    return 'txId=' + txId;
  });

  recordUat_(results, 'UAT-13 duplicate durable inbox raw payload refresh', function() {
    PropertiesService.getScriptProperties().setProperty('KILL_SWITCH_PAYMENT', 'true');
    var txId = 'uat-inbox-dup-tx-' + Utilities.getUuid();
    doPost(makePostEvent_(sepayPayload_(txId, '0908888999'), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    var payload2 = sepayPayload_(txId, '0908888999');
    payload2.transferContent = 'DH8908888999 UPDATED_PAYLOAD_MARKER';
    doPost(makePostEvent_(payload2, { source: 'sepay', token: DHM8_UAT_TOKEN }));
    var row = findRowByValue_(getSpreadsheet().getSheetByName('DHM8_Inbox'), 1, txId);
    assert_(row[1].indexOf('UPDATED_PAYLOAD_MARKER') !== -1, 'Raw Payload must refresh');
    assert_(row[3] >= 1, 'Attempt Count must increment');
    return 'txId=' + txId;
  });

  recordUat_(results, 'UAT-14 durable inbox replay', function() {
    PropertiesService.getScriptProperties().setProperty('KILL_SWITCH_PAYMENT', 'true');
    var uuid = 'uat-replay-' + Utilities.getUuid();
    var phone = '0909999000';
    doPost(makePostEvent_(registrationPayload_(uuid, phone), {}));
    var txId = 'uat-replay-tx-' + Utilities.getUuid();
    doPost(makePostEvent_(sepayPayload_(txId, phone), { source: 'sepay', token: DHM8_UAT_TOKEN }));
    PropertiesService.getScriptProperties().setProperty('KILL_SWITCH_PAYMENT', 'false');
    var replay = reprocessDurableInbox();
    var inboxRow = findRowByValue_(getSpreadsheet().getSheetByName('DHM8_Inbox'), 1, txId);
    assert_(replay.processed >= 1, 'replay must process at least one inbox row');
    assert_(inboxRow[2] === 'PROCESSED', 'inbox row must become PROCESSED');
    assert_(getPaymentState_(getSpreadsheet(), txId) === 'MATCHED', 'replayed payment must be MATCHED');
    return 'txId=' + txId + ', processed=' + replay.processed;
  });

  recordUat_(results, 'UAT-15 durable inbox retention cleanup', function() {
    var ss = getSpreadsheet();
    var inbox = ensureSheet_(ss, 'DHM8_Inbox', ['Transaction ID','Raw Payload','State','Attempt Count','Last Error','Received At','Processed At']);
    var oldTx = 'uat-old-processed-' + Utilities.getUuid();
    var recentTx = 'uat-recent-processed-' + Utilities.getUuid();
    inbox.appendRow([oldTx, '{}', 'PROCESSED', 0, '', new Date(), new Date(new Date().getTime() - 31 * 24 * 60 * 60000)]);
    inbox.appendRow([recentTx, '{}', 'PROCESSED', 0, '', new Date(), new Date()]);
    var cleanup = cleanupProcessedInbox(30);
    assert_(countRowsByValue_(ss, 'DHM8_Inbox', 1, oldTx) === 0, 'old processed row must be deleted');
    assert_(countRowsByValue_(ss, 'DHM8_Inbox', 1, recentTx) === 1, 'recent processed row must survive');
    return 'deleted=' + cleanup.deleted;
  });

  recordUat_(results, 'UAT-16 email queue success and allowlist', function() {
    setDHM8Gate2BaseProperties_();
    var uuid = 'uat-email-success-' + Utilities.getUuid();
    doPost(makePostEvent_(registrationPayload_(uuid, '0901212121'), {}));
    processEmailQueue();
    assert_(countOutboxState_(getSpreadsheet(), uuid, 'SENT') >= 1, 'at least one job must become SENT');
    return 'uuid=' + uuid + ', allowlist=' + PropertiesService.getScriptProperties().getProperty('RECIPIENT_ALLOWLIST');
  });

  recordUat_(results, 'UAT-17 email queue quota guard', function() {
    setDHM8Gate2BaseProperties_();
    PropertiesService.getScriptProperties().setProperty('MOCK_QUOTA', '0');
    var uuid = 'uat-quota-' + Utilities.getUuid();
    doPost(makePostEvent_(registrationPayload_(uuid, '0901313131'), {}));
    processEmailQueue();
    assert_(countOutboxState_(getSpreadsheet(), uuid, 'SENT') === 0, 'quota guard must prevent SENT state');
    return 'uuid=' + uuid;
  });

  recordUat_(results, 'UAT-18 email queue retry, dead, and expired lease reclaim', function() {
    setDHM8Gate2BaseProperties_();
    PropertiesService.getScriptProperties().setProperty('TEST_MODE', 'false');
    var ss = getSpreadsheet();
    enqueueEmail(ss, 'uat-invalid-email-' + Utilities.getUuid(), 'PENDING', 'not-an-email', 'Invalid email test');
    processEmailQueue();
    assert_(countRowsByValue_(ss, 'DHM8_Email_Outbox', 7, 'RETRY') >= 1, 'invalid email should create RETRY or Apps Script failure state');

    var outbox = ss.getSheetByName('DHM8_Email_Outbox');
    var expiredUuid = 'uat-expired-' + Utilities.getUuid();
    outbox.appendRow([
      expiredUuid + ':PENDING', expiredUuid, 'PENDING', 'not-an-email', 'Expired lease test',
      'old-worker', 'SENDING', 2, new Date(), new Date(new Date().getTime() - 10 * 60000), '', '',
      JSON.stringify({ templateType: 'PENDING', registrationUuid: expiredUuid })
    ]);
    processEmailQueue();
    var row = findRowByValue_(outbox, 1, expiredUuid + ':PENDING');
    assert_(row[5] !== 'old-worker', 'expired SENDING lease must be reclaimed by a new worker');
    return 'retry and expired lease checked';
  });

  recordUat_(results, 'UAT-19 fail-closed config', function() {
    var props = PropertiesService.getScriptProperties();
    var oldEnv = props.getProperty('ENVIRONMENT');
    var oldAllowed = props.getProperty('STAGING_ALLOWED_IDS');
    try {
      props.deleteProperty('ENVIRONMENT');
      assertThrows_(function() { getSpreadsheet(); }, 'ENVIRONMENT');
      props.setProperty('ENVIRONMENT', 'STAGING');
      props.setProperty('STAGING_ALLOWED_IDS', 'not-this-sheet');
      assertThrows_(function() { getSpreadsheet(); }, 'SECURITY_VIOLATION');
    } finally {
      props.setProperty('ENVIRONMENT', oldEnv || 'STAGING');
      props.setProperty('STAGING_ALLOWED_IDS', oldAllowed || props.getProperty('SPREADSHEET_ID'));
    }
    return 'fail-closed guards verified';
  });

  writeUatReportSheet_(results, startedAt, new Date());
  return {
    success: results.every(function(r) { return r.status === 'VERIFIED'; }),
    startedAt: startedAt,
    finishedAt: new Date(),
    results: results
  };
}

function resetDHM8Gate2StagingData_() {
  var ss = getSpreadsheet();
  var specs = [
    ['DHM8_Data', ['Timestamp','Họ và tên','Email','Số điện thoại','Linkedin','Tên công ty','Chức danh','Quy mô công ty','Nguồn biết đến','Chương trình đã tham gia','Mục đích tham gia','Mức độ tìm hiểu DH','03 điều mong đợi','Tên người giới thiệu','SĐT người giới thiệu','Payment Status','Event ID','Registration UUID']],
    ['DHM8_Payments', ['Transaction ID','Amount','Account','Content','Gateway','State','Matched UUID','Duplicate Count','Last Seen At','Received At']],
    ['DHM8_Email_Outbox', ['Job Key','Registration UUID','Email Type','Recipient','Subject','Lease Owner','State','Attempt Count','Next Attempt At','Lease Expires At','Last Error','Sent At','Template Data']],
    ['DHM8_Inbox', ['Transaction ID','Raw Payload','State','Attempt Count','Last Error','Received At','Processed At']],
    ['DHM8_System_Logs', ['Timestamp','Level','Message','Detail']]
  ];
  specs.forEach(function(spec) {
    var sheet = ensureSheet_(ss, spec[0], spec[1]);
    sheet.clear();
    sheet.appendRow(spec[1]);
    sheet.setFrozenRows(1);
  });
}

function setDHM8Gate2BaseProperties_() {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('ENVIRONMENT', 'STAGING');
  props.setProperty('STAGING_ALLOWED_IDS', props.getProperty('SPREADSHEET_ID'));
  props.setProperty('SEPAY_WEBHOOK_TOKEN', DHM8_UAT_TOKEN);
  props.setProperty('OFFICIAL_ACCOUNT_NUMBER', DHM8_UAT_ACCOUNT);
  props.setProperty('TEST_MODE', 'true');
  props.setProperty('RECIPIENT_ALLOWLIST', 'vuhoang2708@gmail.com');
  props.setProperty('MOCK_QUOTA', '100');
  props.setProperty('KILL_SWITCH_REGISTRATION', 'false');
  props.setProperty('KILL_SWITCH_EMAIL', 'false');
  props.setProperty('KILL_SWITCH_PAYMENT', 'false');
}

function recordUat_(results, name, fn) {
  try {
    var detail = fn();
    results.push({ name: name, status: 'VERIFIED', detail: detail || '' });
  } catch (err) {
    results.push({ name: name, status: 'FAILED', detail: err.message });
  } finally {
    setDHM8Gate2BaseProperties_();
  }
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0 && headers) sheet.appendRow(headers);
  return sheet;
}

function writeUatReportSheet_(results, startedAt, finishedAt) {
  var ss = getSpreadsheet();
  var sheet = ensureSheet_(ss, 'DHM8_UAT_Report', ['Timestamp','Test Case','Status','Detail']);
  sheet.clear();
  sheet.appendRow(['Started At', startedAt, 'Finished At', finishedAt]);
  sheet.appendRow(['Test Case', 'Status', 'Detail', 'Recorded At']);
  results.forEach(function(result) {
    sheet.appendRow([result.name, result.status, result.detail, new Date()]);
  });
  sheet.setFrozenRows(2);
}

function makePostEvent_(body, params) {
  return {
    parameter: params || {},
    postData: {
      contents: JSON.stringify(body || {})
    }
  };
}

function registrationPayload_(uuid, phone) {
  return {
    registrationUuid: uuid,
    fullName: 'UAT Test User',
    email: 'uat.dhm8@example.com',
    phone: phone,
    event_id: 'DHM8_GATE2_UAT'
  };
}

function sepayPayload_(txId, phone) {
  var content = buildPaymentCodeFromPhone(phone) || ('DHM8 ' + phone + ' UAT');
  return {
    source: 'sepay',
    id: txId,
    transferAmount: DHM8_UAT_AMOUNT,
    transferContent: content,
    transactionContent: content,
    content: content,
    description: 'BankAPINotify ' + content,
    accountNumber: DHM8_UAT_ACCOUNT,
    subAccount: 'UAT_SUB_ACCOUNT',
    gateway: 'SEPAY_UAT'
  };
}

function parseJsonOutput_(output) {
  return JSON.parse(getTextOutput_(output));
}

function getTextOutput_(output) {
  if (output && typeof output.getContent === 'function') return output.getContent();
  if (output && output._body) return output._body;
  return String(output);
}

function assert_(condition, message) {
  if (!condition) throw new Error(message);
}

function assertThrows_(fn, expectedText) {
  try {
    fn();
  } catch (err) {
    if (!expectedText || err.message.indexOf(expectedText) !== -1) return;
    throw new Error('Expected error containing "' + expectedText + '", got: ' + err.message);
  }
  throw new Error('Expected function to throw: ' + expectedText);
}

function countRowsByValue_(ss, sheetName, oneBasedColumn, value) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return 0;
  var rows = sheet.getDataRange().getValues();
  var count = 0;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][oneBasedColumn - 1]) === String(value)) count++;
  }
  return count;
}

function countRowsByPrefix_(ss, sheetName, oneBasedColumn, prefix) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return 0;
  var rows = sheet.getDataRange().getValues();
  var count = 0;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][oneBasedColumn - 1]).indexOf(prefix) === 0) count++;
  }
  return count;
}

function findRowByValue_(sheet, oneBasedColumn, value) {
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][oneBasedColumn - 1]) === String(value)) return rows[i];
  }
  throw new Error('Row not found: ' + value);
}

function deleteOutboxJob_(jobKey) {
  var sheet = getSpreadsheet().getSheetByName('DHM8_Email_Outbox');
  var rows = sheet.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0] === jobKey) sheet.deleteRow(i + 1);
  }
}

function getPaymentState_(ss, txId) {
  return findRowByValue_(ss.getSheetByName('DHM8_Payments'), 1, txId)[5];
}

function getDataPaymentStatus_(ss, uuid) {
  return findRowByValue_(ss.getSheetByName('DHM8_Data'), 18, uuid)[15];
}

function countOutboxState_(ss, uuid, state) {
  var rows = ss.getSheetByName('DHM8_Email_Outbox').getDataRange().getValues();
  var count = 0;
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] === uuid && rows[i][6] === state) count++;
  }
  return count;
}
