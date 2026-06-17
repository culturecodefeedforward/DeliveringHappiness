/**
 * DHM8 Email Automation - HARDENED VERSION (Gate 1 Rev 3)
 * File: Scripts/active_code_gs_final.js
 * Copy toàn bộ nội dung này vào Apps Script Editor trước khi deploy.
 *
 * Script Properties bắt buộc:
 *   ENVIRONMENT           : "STAGING" hoặc "PRODUCTION"
 *   SPREADSHEET_ID        : ID của Google Sheet
 *   STAGING_ALLOWED_IDS   : danh sách ID staging, phân cách dấu phẩy
 *   PRODUCTION_ALLOWED_IDS: ID production duy nhất
 *   SEPAY_WEBHOOK_TOKEN   : token xác thực webhook SePay
 *                           Contract ưu tiên: Authorization header/token field.
 *                           Trong Apps Script Web App, header thực có thể được bridge
 *                           qua `Authorization`, `authorization`, `token` ở query/body.
 *   SEPAY_QUERY_TOKEN     : token truy vấn SePay API (chưa dùng trong Gate 1)
 *   OFFICIAL_ACCOUNT_NUMBER: số tài khoản nhận chính thức, dùng validate webhook
 *   TEST_MODE             : "true" khi staging
 *   RECIPIENT_ALLOWLIST   : email test, phân cách dấu phẩy (TEST_MODE)
 *   MOCK_QUOTA            : số giả lập quota (TEST_MODE, bỏ trống = dùng thật)
 *   KILL_SWITCH_REGISTRATION: "true" để tắt nhận đăng ký
 *   KILL_SWITCH_EMAIL     : "true" để tắt gửi email
 *   KILL_SWITCH_PAYMENT   : "true" để chuyển webhook vào DHM8_Inbox (chỉ nhánh SePay)
 *
 * Changelog Rev 3:
 *   - Fix Bug #1: stale leaseOwner trong processEmailQueue() → truyền leaseOwner mới claim vào item
 *   - Fix Bug #2: validate OFFICIAL_ACCOUNT_NUMBER; thay raw indexOf bằng normalized token matching
 *   - Fix Bug #3: duplicate registration backfill outbox nếu jobs bị thiếu
 *   - Fix Bug #4: align payment states với approved plan; bỏ state WRONG_ACCOUNT
 *   - Fix Bug #5: durable inbox duplicate cập nhật Raw Payload mới nhất
 *   - Fix Bug #6: thêm reprocessDurableInbox() và cleanupProcessedInbox()
 *   - Clarify: webhook token contract hỗ trợ Authorization bridge + token field
 */

// ─── CONSTANTS ───────────────────────────────────────────────
var BTC_EMAILS = ['chauhm71@gmail.com', 'vuhoang2708@gmail.com'];
var DHM8_PRICE = 3000;
var CALLBACK_REGEX = /^dhm8Jsonp_[A-Za-z0-9]{16,40}$/;
var DEFAULT_ENVIRONMENT = 'PRODUCTION';
var DEFAULT_OFFICIAL_ACCOUNT_NUMBER = '1300244416';
var LEGACY_SEPAY_WEBHOOK_TOKEN = 'DHM8_SECURE_2026';

function getScriptProperties_() {
  var props = PropertiesService.getScriptProperties();
  var updates = {};
  var env = props.getProperty('ENVIRONMENT');
  var activeSpreadsheet = null;

  try {
    activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    activeSpreadsheet = null;
  }

  if (!env) {
    updates.ENVIRONMENT = DEFAULT_ENVIRONMENT;
    env = DEFAULT_ENVIRONMENT;
  }

  if (!props.getProperty('SPREADSHEET_ID') && activeSpreadsheet) {
    updates.SPREADSHEET_ID = activeSpreadsheet.getId();
  }

  var sheetId = props.getProperty('SPREADSHEET_ID') || updates.SPREADSHEET_ID || '';
  var allowKey = env === 'STAGING' ? 'STAGING_ALLOWED_IDS' : 'PRODUCTION_ALLOWED_IDS';
  if (!props.getProperty(allowKey) && sheetId) {
    updates[allowKey] = sheetId;
  }

  if (!props.getProperty('OFFICIAL_ACCOUNT_NUMBER')) {
    updates.OFFICIAL_ACCOUNT_NUMBER = DEFAULT_OFFICIAL_ACCOUNT_NUMBER;
  }

  if (!props.getProperty('SEPAY_WEBHOOK_TOKEN')) {
    updates.SEPAY_WEBHOOK_TOKEN = LEGACY_SEPAY_WEBHOOK_TOKEN;
  }

  if (Object.keys(updates).length > 0) {
    props.setProperties(updates, false);
  }

  return props;
}

// ─── FAIL-CLOSED SPREADSHEET ─────────────────────────────────
function getSpreadsheet() {
  var props = getScriptProperties_();
  var env = props.getProperty('ENVIRONMENT');
  var sheetId = props.getProperty('SPREADSHEET_ID');

  if (!env || (env !== 'STAGING' && env !== 'PRODUCTION')) {
    throw new Error('CRITICAL_ERROR: ENVIRONMENT missing or invalid. Halted.');
  }
  if (!sheetId || sheetId.trim() === '') {
    throw new Error('CRITICAL_ERROR: SPREADSHEET_ID missing. Halted.');
  }

  var allowedKey = env === 'STAGING' ? 'STAGING_ALLOWED_IDS' : 'PRODUCTION_ALLOWED_IDS';
  var allowedStr = props.getProperty(allowedKey);
  if (!allowedStr) {
    throw new Error('CRITICAL_ERROR: Allowlist for ' + env + ' not configured. Halted.');
  }
  var allowedIds = allowedStr.split(',').map(function(id) { return id.trim(); });
  if (allowedIds.indexOf(sheetId) === -1) {
    throw new Error('SECURITY_VIOLATION: Spreadsheet ID not in allowlist for ' + env + '. Access Denied.');
  }

  try {
    return SpreadsheetApp.openById(sheetId);
  } catch (e) {
    throw new Error('CRITICAL_ERROR: Cannot open spreadsheet ' + sheetId + ': ' + e.message);
  }
}

// ─── QUOTA GUARD ─────────────────────────────────────────────
function getRemainingQuota() {
  var mock = getScriptProperties_().getProperty('MOCK_QUOTA');
  if (mock !== null && mock !== '') return parseInt(mock, 10);
  return MailApp.getRemainingDailyQuota();
}

// ─── PHONE NORMALIZER ────────────────────────────────────────
function normalizePhone(phone) {
  if (!phone) return '';
  var digits = phone.toString().replace(/\D/g, '');
  if (digits.indexOf('0084') === 0 && digits.length > 6) return '0' + digits.slice(4);
  if (digits.indexOf('84') === 0 && digits.length > 6) return '0' + digits.slice(2);
  return digits;
}

function buildPaymentCodeFromPhone(phone) {
  var normalizedPhone = normalizePhone(phone);
  var codeDigits = normalizedPhone.replace(/^0/, '');
  if (!/^\d{3,}$/.test(codeDigits)) return '';
  return 'DH8' + codeDigits.slice(-9);
}

function buildLegacyPaymentCodeFromUuid(uuid) {
  var compact = (uuid || '').toString().replace(/-/g, '').toUpperCase();
  if (!compact) return '';
  return 'DH' + compact.slice(0, 12);
}

function normalizePaymentCodeToken(code) {
  return (code || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function getPaymentCodeInfo_(phone, uuid) {
  var paymentCode = buildPaymentCodeFromPhone(phone);
  var legacyPaymentCode = buildLegacyPaymentCodeFromUuid(uuid);
  var normalizedPhone = normalizePhone(phone);
  var variants = [];
  [
    paymentCode,
    normalizedPhone ? 'DH8-' + normalizedPhone : '',
    normalizedPhone ? 'DH8' + normalizedPhone : '',
    legacyPaymentCode
  ].forEach(function(code) {
    var normalizedCode = normalizePaymentCodeToken(code);
    if (normalizedCode && variants.indexOf(normalizedCode) === -1) {
      variants.push(normalizedCode);
    }
  });
  return {
    paymentCode: paymentCode || legacyPaymentCode,
    legacyPaymentCode: legacyPaymentCode,
    variants: variants
  };
}

function getWebhookTokenFromRequest(e, body) {
  var params = (e && e.parameter) || {};
  var candidate = params.Authorization || params.authorization ||
    params.token || (body && (body.Authorization || body.authorization || body.token)) || '';
  if (candidate.indexOf('Bearer ') === 0) {
    return candidate.slice(7).trim();
  }
  return candidate;
}

function ensureStagingAdminAccess_(props, e, body) {
  var env = props.getProperty('ENVIRONMENT');
  if (env !== 'STAGING') {
    throw new Error('ADMIN_CONFIG_DISABLED');
  }
  var webhookToken = props.getProperty('SEPAY_WEBHOOK_TOKEN');
  var requestToken = getWebhookTokenFromRequest(e, body);
  if (!webhookToken || requestToken !== webhookToken) {
    throw new Error('INVALID_TOKEN');
  }
}

function ensureOperatorAccess_(props, e, body) {
  var webhookToken = props.getProperty('SEPAY_WEBHOOK_TOKEN') || LEGACY_SEPAY_WEBHOOK_TOKEN;
  var requestToken = getWebhookTokenFromRequest(e, body);
  if (!webhookToken || requestToken !== webhookToken) {
    throw new Error('INVALID_TOKEN');
  }
}

function handleOperatorHealthGet_(e) {
  var props = getScriptProperties_();
  ensureOperatorAccess_(props, e, null);
  return jsonOut({
    success: true,
    environment: props.getProperty('ENVIRONMENT') || '',
    spreadsheetId: props.getProperty('SPREADSHEET_ID') || '',
    officialAccountNumber: props.getProperty('OFFICIAL_ACCOUNT_NUMBER') || '',
    sepayWebhookTokenConfigured: !!props.getProperty('SEPAY_WEBHOOK_TOKEN'),
    amount: DHM8_PRICE
  });
}

function handleAdminConfigGet_(e) {
  var props = getScriptProperties_();
  ensureStagingAdminAccess_(props, e, null);
  return jsonOut({
    success: true,
    environment: props.getProperty('ENVIRONMENT') || '',
    officialAccountNumber: props.getProperty('OFFICIAL_ACCOUNT_NUMBER') || '',
    sepayWebhookTokenConfigured: !!props.getProperty('SEPAY_WEBHOOK_TOKEN'),
    amount: DHM8_PRICE
  });
}

function handleAdminConfigSet_(e, body) {
  var props = getScriptProperties_();
  ensureStagingAdminAccess_(props, e, body);
  var officialAccountNumber = ((body && body.officialAccountNumber) || '').toString().replace(/\s/g, '');
  if (!officialAccountNumber) {
    return jsonOut({ success: false, error: 'MISSING_OFFICIAL_ACCOUNT_NUMBER' });
  }
  props.setProperty('OFFICIAL_ACCOUNT_NUMBER', officialAccountNumber);
  return jsonOut({
    success: true,
    officialAccountNumber: officialAccountNumber,
    amount: DHM8_PRICE
  });
}

function handleAdminPaymentDebugGet_(e) {
  var props = getScriptProperties_();
  ensureStagingAdminAccess_(props, e, null);

  var uuid = ((e.parameter && e.parameter.uuid) || '').toString().trim();
  if (!uuid) return jsonOut({ success: false, error: 'MISSING_UUID' });

  var ss = getSpreadsheet();
  var dataSheet = ss.getSheetByName('DHM8_Data');
  var paymentsSheet = ss.getSheetByName('DHM8_Payments');
  var fallbackCodeInfo = getPaymentCodeInfo_('', uuid);
  var result = {
    success: true,
    registrationUuid: uuid,
    paymentStatus: null,
    paymentPhone: '',
    paymentCode: fallbackCodeInfo.paymentCode,
    paymentCodeLegacy: fallbackCodeInfo.legacyPaymentCode,
    paymentCodeVariants: fallbackCodeInfo.variants,
    paymentRow: null
  };

  if (dataSheet) {
    var dataRows = dataSheet.getDataRange().getValues();
    for (var i = 1; i < dataRows.length; i++) {
      if (String(dataRows[i][17]) === uuid) {
        var rowPhone = normalizePhone(dataRows[i][3]);
        var rowCodeInfo = getPaymentCodeInfo_(rowPhone, uuid);
        result.paymentStatus = dataRows[i][15] || '';
        result.paymentPhone = rowPhone;
        result.paymentCode = rowCodeInfo.paymentCode;
        result.paymentCodeLegacy = rowCodeInfo.legacyPaymentCode;
        result.paymentCodeVariants = rowCodeInfo.variants;
        break;
      }
    }
  }

  if (paymentsSheet) {
    var payRows = paymentsSheet.getDataRange().getValues();
    for (var j = payRows.length - 1; j >= 1; j--) {
      var candidateTokens = String(payRows[j][3] || '').toUpperCase()
        .split(/[\s\/\.,:;]+/)
        .map(function(t) { return normalizePaymentCodeToken(t); })
        .filter(function(t) { return t.indexOf('DH') === 0; });
      if (!result.paymentCandidates) result.paymentCandidates = [];
      if (result.paymentCodeVariants.some(function(code) { return candidateTokens.indexOf(code) !== -1; })) {
        result.paymentCandidates.push({
          transactionId: payRows[j][0],
          amount: payRows[j][1],
          account: payRows[j][2],
          content: payRows[j][3],
          gateway: payRows[j][4],
          state: payRows[j][5],
          matchedUuid: payRows[j][6]
        });
      }
      if (String(payRows[j][6]) === uuid) {
        result.paymentRow = {
          transactionId: payRows[j][0],
          amount: payRows[j][1],
          account: payRows[j][2],
          content: payRows[j][3],
          gateway: payRows[j][4],
          state: payRows[j][5],
          matchedUuid: payRows[j][6]
        };
        break;
      }
    }
  }

  return jsonOut(result);
}

// ─── SYSTEM LOG ──────────────────────────────────────────────
function writeSystemLog(ss, level, message, detail) {
  try {
    var sheet = ss.getSheetByName('DHM8_System_Logs');
    if (!sheet) {
      sheet = ss.insertSheet('DHM8_System_Logs');
      sheet.appendRow(['Timestamp', 'Level', 'Message', 'Detail']);
    }
    sheet.appendRow([new Date(), level, message, detail || '']);
  } catch (e) { /* log không được phép throw */ }
}

// ─── doPost ──────────────────────────────────────────────────
function doPost(e) {
  var props = getScriptProperties_();

  try {
    var body = JSON.parse(e.postData.contents);

    if (e.parameter.source === 'admin_config' || body.source === 'admin_config') {
      return handleAdminConfigSet_(e, body);
    }

    // --- WEBHOOK SEPAY ---
    if (e.parameter.source === 'sepay' || body.source === 'sepay') {
      var webhookToken = props.getProperty('SEPAY_WEBHOOK_TOKEN');
      var requestToken = getWebhookTokenFromRequest(e, body);
      if (!webhookToken || requestToken !== webhookToken) {
        return jsonOut({ success: false, error: 'INVALID_TOKEN' });
      }

      var killPayment = props.getProperty('KILL_SWITCH_PAYMENT');
      if (killPayment === 'true') {
        return handleDurableInbox(body);
      }
      return handleSePayWebhook(body);
    }

    // --- FORM ĐĂNG KÝ ---
    var killReg = props.getProperty('KILL_SWITCH_REGISTRATION');
    if (killReg === 'true') {
      return jsonOut({ success: false, error: 'REGISTRATION_DISABLED' });
    }
    return handleRegistration(body);

  } catch (err) {
    return jsonOut({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
}

// ─── doGet (JSONP checkStatus) ────────────────────────────────
function doGet(e) {
  var action = e.parameter.action || '';
  var callback = e.parameter.callback || '';

  if (action === 'getHealth') {
    return handleOperatorHealthGet_(e);
  }

  if (action === 'getStagingConfig') {
    return handleAdminConfigGet_(e);
  }

  if (action === 'getPaymentDebug') {
    return handleAdminPaymentDebugGet_(e);
  }

  if (action === 'checkStatus') {
    // Condition 3: validate callback nghiêm ngặt
    if (!CALLBACK_REGEX.test(callback)) {
      return ContentService.createTextOutput('{"error":"INVALID_CALLBACK"}')
        .setMimeType(ContentService.MimeType.JSON);
    }
    var uuid = e.parameter.uuid || '';
    var result = getRegistrationStatus(uuid);
    // Condition 2: chỉ trả success, state, registrationUuid, error - KHÔNG trả PII
    var payload = JSON.stringify(result);
    return ContentService.createTextOutput(callback + '(' + payload + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return jsonOut({ success: false, error: 'UNKNOWN_ACTION' });
}

// ─── REGISTRATION STATUS (Condition 4: chỉ REGISTERED khi UUID thực tồn tại) ─
function getRegistrationStatus(uuid) {
  if (!uuid || uuid.trim() === '') {
    return { success: false, error: 'MISSING_UUID' };
  }
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('DHM8_Data');
    if (!sheet) return { success: false, error: 'NOT_FOUND' };

    var data = sheet.getDataRange().getValues();
    // Cột R (index 17) = Registration UUID
    for (var i = 1; i < data.length; i++) {
      if (data[i][17] === uuid) {
        var paymentStatus = data[i][15] || 'PENDING';
        return {
          success: true,
          state: 'REGISTERED',
          registrationUuid: uuid,
          paymentStatus: paymentStatus,
          // KHÔNG trả tên, email, SĐT hay thông tin thanh toán chi tiết
        };
      }
    }
    return { success: false, error: 'NOT_FOUND' };
  } catch (err) {
    return { success: false, error: 'SERVER_ERROR' };
  }
}

// ─── HANDLE REGISTRATION ─────────────────────────────────────
function handleRegistration(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('DHM8_Data');
  if (!sheet) {
    sheet = ss.insertSheet('DHM8_Data');
    sheet.appendRow([
      'Timestamp','Họ và tên','Email','Số điện thoại','Linkedin',
      'Tên công ty','Chức danh','Quy mô công ty','Nguồn biết đến',
      'Chương trình đã tham gia','Mục đích tham gia','Mức độ tìm hiểu DH',
      '03 điều mong đợi','Tên người giới thiệu','SĐT người giới thiệu',
      'Payment Status','Event ID','Registration UUID'
    ]);
    sheet.getRange('1:1').setFontWeight('bold').setBackground('#fff2cc');
    sheet.setFrozenRows(1);
  }

  var uuid = data.registrationUuid || '';
  if (!uuid) return jsonOut({ success: false, error: 'MISSING_UUID' });

  // Idempotency: kiểm tra UUID đã tồn tại chưa
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var isDuplicate = false;
  try {
    var existing = sheet.getDataRange().getValues();
    for (var i = 1; i < existing.length; i++) {
      if (existing[i][17] === uuid) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      sheet.appendRow([
        new Date(), data.fullName || '', data.email || '', data.phone || '',
        data.linkedin || '', data.company || '', data.jobTitle || '',
        data.companySize || '', data.sourceHearing || '',
        data.attendedPrograms || 'Chưa tham gia', data.purpose || '',
        data.happinessKnowledge || '', data.expectations || '',
        data.referrerName || '', data.referrerPhone || '',
        'PENDING', data.event_id || 'DHM8_REG_040726', uuid
      ]);
    }
  } finally {
    lock.releaseLock();
  }

  // Fix Bug #3: Backfill outbox jobs dù là đăng ký mới hay duplicate
  // enqueueEmail() tự bỏ qua nếu job đã tồn tại → an toàn để gọi idempotently
  enqueueEmail(ss, uuid, 'PENDING', data.email || '', 'Xác nhận đăng ký DHM8');
  enqueueEmail(ss, uuid, 'BTC', BTC_EMAILS.join(','), 'Thông báo đăng ký mới - DHM8');

  writeSystemLog(ss, 'INFO', isDuplicate ? 'Duplicate reg + outbox backfill' : 'Đăng ký mới', uuid);
  return jsonOut({ success: true, state: 'REGISTERED', registrationUuid: uuid, duplicate: isDuplicate });
}

// ─── HANDLE SEPAY WEBHOOK ─────────────────────────────────────
function handleSePayWebhook(body) {
  var ss = getSpreadsheet();
  var paymentsSheet = ss.getSheetByName('DHM8_Payments');
  if (!paymentsSheet) {
    paymentsSheet = ss.insertSheet('DHM8_Payments');
    paymentsSheet.appendRow([
      'Transaction ID','Amount','Account','Content','Gateway',
      'State','Matched UUID','Duplicate Count','Last Seen At','Received At'
    ]);
    paymentsSheet.setFrozenRows(1);
  }

  var txId = (body.id || body.transactionId || '').toString();
  var amountIn = parseInt(body.transferAmount || body.amountIn || 0);
  // SePay payloads in the wild may use `content` / `description` instead of
  // only `transferContent` / `transactionContent`.
  var content = (
    body.transferContent ||
    body.transactionContent ||
    body.content ||
    body.description ||
    ''
  ).toUpperCase();
  var accountNo = (body.accountNumber || body.toAccount || '').replace(/\s/g,'');
  var gateway = body.gateway || '';

  if (!txId) return jsonOut({ success: false, error: 'MISSING_TX_ID' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = paymentsSheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0].toString() === txId) {
        // Duplicate webhook - tăng count, không chèn dòng mới
        paymentsSheet.getRange(i + 1, 8).setValue((rows[i][7] || 0) + 1);
        paymentsSheet.getRange(i + 1, 9).setValue(new Date());
        return jsonOut({ success: true, duplicate: true });
      }
    }
    // Giao dịch mới
    paymentsSheet.appendRow([txId, amountIn, accountNo, content, gateway,
      'RECEIVED', '', 0, new Date(), new Date()]);
  } finally {
    lock.releaseLock();
  }

  // Fix Bug #2a: Validate official account number trước khi xử lý
  var props = getScriptProperties_();
  var officialAccount = (props.getProperty('OFFICIAL_ACCOUNT_NUMBER') || '').replace(/\s/g, '');
  if (officialAccount && accountNo && accountNo !== officialAccount) {
    updatePaymentState(paymentsSheet, txId, 'ERROR');
    writeSystemLog(ss, 'WARN', 'Sai số tài khoản nhận: ' + accountNo + ' (expected: ' + officialAccount + ')', txId);
    return jsonOut({ success: true });
  }

  // Kiểm tra số tiền
  if (amountIn !== DHM8_PRICE) {
    updatePaymentState(paymentsSheet, txId, 'NO_MATCH');
    writeSystemLog(ss, 'WARN', 'Số tiền không khớp: ' + amountIn, txId);
    return jsonOut({ success: true });
  }

  // Khớp học viên qua SĐT đã chuẩn hóa
  var dataSheet = ss.getSheetByName('DHM8_Data');
  if (!dataSheet) {
    updatePaymentState(paymentsSheet, txId, 'NO_MATCH');
    return jsonOut({ success: true });
  }

  var rawTokens = content.split(/[\s\/\.,:;]+/).map(function(t) {
    return (t || '').toString().trim().toUpperCase();
  }).filter(function(t) { return t !== ''; });
  var contentPhoneTokens = rawTokens.map(function(t) {
    return normalizePhone(t);
  }).filter(function(t) { return t.length >= 9; });
  var contentCodeTokens = rawTokens.map(function(t) {
    return t.replace(/[^A-Z0-9]/g, '');
  }).filter(function(t) { return t.indexOf('DH') === 0; });

  var dataRows = dataSheet.getDataRange().getValues();
  var matchedByCode = [];
  var matchedByPhone = [];
  for (var j = 1; j < dataRows.length; j++) {
    if (dataRows[j][15] !== 'PENDING') continue;
    var rowUuid = dataRows[j][17];
    var rowPhone = normalizePhone(dataRows[j][3]);
    var rowCodeInfo = getPaymentCodeInfo_(rowPhone, rowUuid);
    var matchedCode = rowCodeInfo.variants.filter(function(code) {
      return contentCodeTokens.indexOf(code) !== -1;
    })[0];
    if (matchedCode) {
      matchedByCode.push({ rowIdx: j, uuid: rowUuid, method: 'PAYMENT_CODE', paymentCodeToken: matchedCode });
      continue;
    }
    if (rowPhone && contentPhoneTokens.indexOf(rowPhone) !== -1) {
      matchedByPhone.push({ rowIdx: j, uuid: rowUuid, method: 'PHONE' });
    }
  }

  var matched = matchedByCode.length > 0 ? matchedByCode : matchedByPhone;

  if (matched.length === 0) {
    updatePaymentState(paymentsSheet, txId, 'NO_MATCH');
    writeSystemLog(ss, 'WARN', 'Không khớp học viên', txId);
  } else if (matched.length > 1) {
    updatePaymentState(paymentsSheet, txId, 'ERROR');
    writeSystemLog(ss, 'ERROR', 'Ambiguous matches: ' + matched.length, txId);
  } else {
    var m = matched[0];
    dataSheet.getRange(m.rowIdx + 1, 16).setValue('PAID');
    updatePaymentState(paymentsSheet, txId, 'MATCHED', m.uuid);
    enqueueEmail(ss, m.uuid, 'PAID', dataRows[m.rowIdx][2], 'Xác nhận thanh toán DHM8');
    enqueueEmail(ss, m.uuid, 'BTC', BTC_EMAILS.join(','), 'Thanh toán xác nhận - DHM8');
    writeSystemLog(ss, 'INFO', 'Matched via ' + m.method + ': ' + m.uuid, txId);
  }

  return jsonOut({ success: true });
}

function updatePaymentState(sheet, txId, state, matchedUuid) {
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0].toString() === txId) {
      sheet.getRange(i + 1, 6).setValue(state);
      if (matchedUuid) sheet.getRange(i + 1, 7).setValue(matchedUuid);
      return;
    }
  }
}

// ─── DURABLE INBOX ───────────────────────────────────────────
function handleDurableInbox(body) {
  var ss = getSpreadsheet();
  var inbox = ss.getSheetByName('DHM8_Inbox');
  if (!inbox) {
    inbox = ss.insertSheet('DHM8_Inbox');
    inbox.appendRow(['Transaction ID','Raw Payload','State','Attempt Count',
      'Last Error','Received At','Processed At']);
    inbox.setFrozenRows(1);
  }
  var txId = (body.id || body.transactionId || '').toString();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = inbox.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0].toString() === txId) {
        inbox.getRange(i + 1, 2).setValue(JSON.stringify(body));
        inbox.getRange(i + 1, 3).setValue('UNPROCESSED');
        inbox.getRange(i + 1, 4).setValue((rows[i][3] || 0) + 1);
        inbox.getRange(i + 1, 6).setValue(new Date());
        return jsonOut({ success: true });
      }
    }
    inbox.appendRow([txId, JSON.stringify(body), 'UNPROCESSED', 0, '', new Date(), '']);
  } finally {
    lock.releaseLock();
  }
  return jsonOut({ success: true });
}

function reprocessDurableInbox() {
  var ss = getSpreadsheet();
  var inbox = ss.getSheetByName('DHM8_Inbox');
  if (!inbox) return { success: true, processed: 0, failed: 0 };

  var rows = inbox.getDataRange().getValues();
  var processed = 0;
  var failed = 0;

  for (var i = 1; i < rows.length; i++) {
    var state = rows[i][2];
    if (state !== 'UNPROCESSED' && state !== 'ERROR') continue;

    try {
      var payload = JSON.parse(rows[i][1] || '{}');
      handleSePayWebhook(payload);
      inbox.getRange(i + 1, 3).setValue('PROCESSED');
      inbox.getRange(i + 1, 5).setValue('');
      inbox.getRange(i + 1, 7).setValue(new Date());
      processed++;
    } catch (err) {
      failed++;
      inbox.getRange(i + 1, 3).setValue('ERROR');
      inbox.getRange(i + 1, 4).setValue((rows[i][3] || 0) + 1);
      inbox.getRange(i + 1, 5).setValue(err.message);
    }
  }

  writeSystemLog(ss, failed ? 'WARN' : 'INFO', 'Durable inbox reprocess complete',
    'processed=' + processed + ', failed=' + failed);
  return { success: failed === 0, processed: processed, failed: failed };
}

function cleanupProcessedInbox(retentionDays) {
  var ss = getSpreadsheet();
  var inbox = ss.getSheetByName('DHM8_Inbox');
  if (!inbox) return { success: true, deleted: 0 };

  var days = parseInt(retentionDays, 10);
  if (!days || days < 1) days = 30;

  var cutoff = new Date(new Date().getTime() - days * 24 * 60 * 60000);
  var rows = inbox.getDataRange().getValues();
  var deleted = 0;

  for (var i = rows.length - 1; i >= 1; i--) {
    var state = rows[i][2];
    var processedAt = rows[i][6] ? new Date(rows[i][6]) : null;
    if (state === 'PROCESSED' && processedAt && processedAt < cutoff) {
      inbox.deleteRow(i + 1);
      deleted++;
    }
  }

  writeSystemLog(ss, 'INFO', 'Durable inbox retention cleanup', 'deleted=' + deleted + ', retentionDays=' + days);
  return { success: true, deleted: deleted };
}

// ─── EMAIL OUTBOX ─────────────────────────────────────────────
function enqueueEmail(ss, registrationUuid, emailType, recipient, subject) {
  var outbox = ss.getSheetByName('DHM8_Email_Outbox');
  if (!outbox) {
    outbox = ss.insertSheet('DHM8_Email_Outbox');
    outbox.appendRow([
      'Job Key','Registration UUID','Email Type','Recipient','Subject',
      'Lease Owner','State','Attempt Count','Next Attempt At',
      'Lease Expires At','Last Error','Sent At','Template Data'
    ]);
    outbox.setFrozenRows(1);
  }
  var jobKey = registrationUuid + ':' + emailType;
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = outbox.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === jobKey) return; // đã tồn tại
    }
    outbox.appendRow([
      jobKey, registrationUuid, emailType, recipient, subject,
      '', 'PENDING', 0, new Date(), '', '', '',
      JSON.stringify({ templateType: emailType, registrationUuid: registrationUuid })
    ]);
  } finally {
    lock.releaseLock();
  }
}

// ─── EMAIL QUEUE PROCESSOR ────────────────────────────────────
function processEmailQueue() {
  var props = getScriptProperties_();
  if (props.getProperty('KILL_SWITCH_EMAIL') === 'true') return;

  var ss = getSpreadsheet();
  var outbox = ss.getSheetByName('DHM8_Email_Outbox');
  if (!outbox) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var now = new Date();
  var toProcess = [];

  try {
    var rows = outbox.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var state = rows[i][6];
      var nextAt = rows[i][8] ? new Date(rows[i][8]) : null;
      var leaseExp = rows[i][9] ? new Date(rows[i][9]) : null;
      if (state === 'PENDING' ||
          (state === 'RETRY' && nextAt && nextAt <= now) ||
          (state === 'SENDING' && leaseExp && leaseExp <= now)) {
        toProcess.push({ rowNum: i + 1, data: rows[i] });
        if (toProcess.length >= 10) break;
      }
    }

    // Fix Bug #1: tạo leaseOwner trước khi claim, gắn vào mỗi item để dùng khi update
    var leaseOwner = 'worker-' + Utilities.getUuid();
    var leaseExp5 = new Date(now.getTime() + 5 * 60000);
    toProcess.forEach(function(item) {
      outbox.getRange(item.rowNum, 6).setValue(leaseOwner);
      outbox.getRange(item.rowNum, 7).setValue('SENDING');
      outbox.getRange(item.rowNum, 10).setValue(leaseExp5);
      item.claimedLeaseOwner = leaseOwner; // lưu leaseOwner mới claim vào item
    });
  } finally {
    lock.releaseLock();
  }

  var testMode = props.getProperty('TEST_MODE') === 'true';
  var allowlistStr = props.getProperty('RECIPIENT_ALLOWLIST') || '';
  var allowlist = allowlistStr.split(',').map(function(e) { return e.trim(); }).filter(Boolean);

  toProcess.forEach(function(item) {
    var row = item.data;
    var jobKey = row[0];
    var regUuid = row[1];
    var emailType = row[2];
    var recipient = row[3];
    var subject = row[4];
    var leaseOwner = row[5]; // snapshot cũ - không dùng cho update
    var claimedLeaseOwner = item.claimedLeaseOwner; // Fix Bug #1: dùng leaseOwner đã claim
    var attempts = parseInt(row[7]) || 0;
    var maxAttempts = emailType === 'BTC' ? 5 : 3;

    var recipientCount = (recipient.split(',').length);
    if (getRemainingQuota() < recipientCount + 5) {
      writeSystemLog(ss, 'WARN', 'Quota không đủ, dừng xử lý', jobKey);
      return;
    }

    var toAddress = testMode ? allowlist.join(',') : recipient;
    if (!toAddress) return;

    try {
      var bodyHtml = renderEmailBody(ss, emailType, regUuid);
      writeSystemLog(ss, 'INFO', 'Chuẩn bị gửi email', jobKey);
      MailApp.sendEmail({ to: toAddress, subject: subject, htmlBody: bodyHtml });
      updateOutboxRow(outbox, jobKey, claimedLeaseOwner, 'SENT', attempts, null); // Fix Bug #1
    } catch (err) {
      attempts++;
      var nextState = attempts >= maxAttempts ? 'DEAD' : 'RETRY';
      var nextAttempt = new Date(now.getTime() + Math.pow(2, attempts) * 5 * 60000);
      updateOutboxRow(outbox, jobKey, claimedLeaseOwner, nextState, attempts, err.message, nextAttempt); // Fix Bug #1
      writeSystemLog(ss, 'ERROR', 'Lỗi gửi email: ' + err.message, jobKey);
    }
  });
}

function updateOutboxRow(outbox, jobKey, leaseOwner, state, attempts, lastError, nextAttemptAt) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var rows = outbox.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === jobKey && rows[i][5] === leaseOwner) {
        outbox.getRange(i + 1, 7).setValue(state);
        outbox.getRange(i + 1, 8).setValue(attempts);
        if (nextAttemptAt) outbox.getRange(i + 1, 9).setValue(nextAttemptAt);
        if (lastError) outbox.getRange(i + 1, 11).setValue(lastError);
        if (state === 'SENT') outbox.getRange(i + 1, 12).setValue(new Date());
        return;
      }
    }
  } finally {
    lock.releaseLock();
  }
}

var DHM8_ZALO_GROUP_URL = 'https://zalo.me/g/hpf7qu45j6qkft6hpghx';

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRegistrationEmailData_(ss, regUuid) {
  var dataSheet = ss.getSheetByName('DHM8_Data');
  var data = {
    name: '(Học viên)',
    email: '',
    phone: '',
    company: '',
    paymentStatus: '',
    paymentCode: ''
  };
  if (dataSheet) {
    var rows = dataSheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][17] === regUuid) {
        data.name = rows[i][1] || data.name;
        data.email = rows[i][2] || '';
        data.phone = normalizePhone(rows[i][3] || '');
        data.company = rows[i][5] || '';
        data.paymentStatus = rows[i][15] || '';
        data.paymentCode = getPaymentCodeInfo_(data.phone, regUuid).paymentCode;
        break;
      }
    }
  }
  return data;
}

function renderEmailShell_(title, preheader, bodyHtml) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>body{font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;background:#f8fafc;margin:0;padding:0}.container{max-width:640px;margin:20px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}.header{background:#0f766e;color:#fff;padding:24px}.header h1{font-size:22px;margin:0}.content{padding:24px}.box{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin:16px 0}.success{background:#ecfdf5;border-color:#a7f3d0}.warning{background:#fffbeb;border-color:#fde68a}.code{font-family:Consolas,monospace;font-weight:700;background:#e5e7eb;border-radius:6px;padding:3px 7px;color:#b91c1c}.btn{display:inline-block;background:#0068ff;color:#fff!important;text-decoration:none;font-weight:700;border-radius:9px;padding:12px 18px}.footer{font-size:12px;color:#6b7280;background:#f3f4f6;padding:16px;text-align:center}</style></head><body>' +
    '<div class="container"><div class="header"><h1>' + escapeHtml_(title) + '</h1><div style="opacity:.9">' + escapeHtml_(preheader) + '</div></div><div class="content">' +
    bodyHtml +
    '</div><div class="footer">Email này được gửi tự động từ hệ thống đăng ký Delivering Happiness.</div></div></body></html>';
}

// ─── EMAIL RENDERER (PII Minimization) ───────────────────────
function renderEmailBody(ss, emailType, regUuid) {
  var data = getRegistrationEmailData_(ss, regUuid);
  var name = escapeHtml_(data.name);
  var paymentCode = escapeHtml_(data.paymentCode || 'DH8...');

  if (emailType === 'PENDING') {
    return renderEmailShell_(
      'DHM8 - Xác nhận đăng ký',
      'BTC đã nhận được thông tin đăng ký của bạn',
      '<p>Xin chào <strong>' + name + '</strong>,</p>' +
      '<p>BTC đã nhận được thông tin đăng ký Delivering Happiness Masterclass 8 (DHM8) của bạn.</p>' +
      '<div class="box warning"><strong>Bước tiếp theo:</strong><br>Vui lòng hoàn tất chi phí hậu cần theo đúng nội dung chuyển khoản: <span class="code">' + paymentCode + '</span>.</div>' +
      '<p>Sau khi hệ thống ghi nhận thanh toán, bạn sẽ nhận email xác nhận giữ chỗ chính thức và link tham gia nhóm Zalo lớp DH8 HCM.</p>' +
      '<p>Trân trọng,<br><strong>Ban Tổ chức Delivering Happiness</strong></p>'
    );
  }
  if (emailType === 'PAID') {
    return renderEmailShell_(
      'DHM8 - Đã xác nhận thanh toán',
      'Bạn đã hoàn tất chi phí hậu cần',
      '<p>Xin chào <strong>' + name + '</strong>,</p>' +
      '<div class="box success"><strong>Chúc mừng bạn!</strong><br>Hệ thống đã ghi nhận thanh toán chi phí hậu cần thành công. Suất tham dự DHM8 của bạn đã được xác nhận.</div>' +
      '<p>Bạn vui lòng tham gia nhóm Zalo DH8 HCM để nhận thông báo từ BTC, cập nhật thông tin lớp học và kết nối với cộng đồng học viên.</p>' +
      '<p><a class="btn" href="' + DHM8_ZALO_GROUP_URL + '" target="_blank">Vào nhóm Zalo DH8 HCM</a></p>' +
      '<div class="box"><strong>Lưu ý nhanh:</strong><br>BTC sẽ tiếp tục gửi thông tin check-in, địa điểm và chuẩn bị trước sự kiện qua email này và nhóm Zalo.</div>' +
      '<p>Trân trọng,<br><strong>Ban Tổ chức Delivering Happiness</strong></p>'
    );
  }
  if (emailType === 'BTC') {
    return renderEmailShell_(
      'DHM8 - Thông báo nội bộ BTC',
      'Có hoạt động mới liên quan đến đăng ký',
      '<p><strong>UUID:</strong> ' + escapeHtml_(regUuid) + '</p>' +
      '<p><strong>Họ tên:</strong> ' + name + '</p>' +
      '<p><strong>SĐT:</strong> ' + escapeHtml_(data.phone) + '</p>' +
      '<p><strong>Email:</strong> ' + escapeHtml_(data.email) + '</p>' +
      '<p><strong>Trạng thái thanh toán:</strong> ' + escapeHtml_(data.paymentStatus) + '</p>'
    );
  }
  return '<p>Email notification - DHM8</p>';
}

// ─── HELPER ──────────────────────────────────────────────────
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
