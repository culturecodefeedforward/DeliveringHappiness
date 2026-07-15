/**
 * DHM8 Email Automation - HARDENED VERSION (Gate 1 Rev 3.1 - ABCDE)
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
var BTC_EMAILS = ['chauhm71@gmail.com', 'vuhoang2708@gmail.com', 'hoanhn.edu.vn@gmail.com'];
var DHM8_PRICE = 250000;
var DHM8_REGISTRATION_CAP = 32;
var DHM9_REGISTRATION_CAP = 40;
var DEFAULT_INTEREST_URL = 'https://delivering-happiness.vercel.app/interest.html';
var DEFAULT_DH9_INTEREST_URL = 'https://delivering-happiness.vercel.app/interest_dh9.html';
var CALLBACK_REGEX = /^dh(?:m8|9)Jsonp_[A-Za-z0-9]{16,40}$/;
var DEFAULT_ENVIRONMENT = 'PRODUCTION';
var DEFAULT_OFFICIAL_ACCOUNT_NUMBER = '8815369431';
var LEGACY_SEPAY_WEBHOOK_TOKEN = 'DHM8_SECURE_2026';
var MAIL_TRIGGER_FUNCTION = 'processEmailQueue';
var MAIL_TRIGGER_EVERY_MINUTES = 5;
var PAYMENT_BTC_EMAIL_TYPE = 'BTC_PAID';
var RUNTIME_BUILD_LABEL = 'DHM8_PREVIEW_EMAIL_DEBUG_20260618B';
var DEFAULT_PAYMENT_SUBACCOUNT = '96247CULTURECODE';
var DEFAULT_PAYMENT_BANK = 'BIDV';
var DEFAULT_PAYMENT_HOLDER = 'HA NGOC HOAN';
var DEFAULT_PAYMENT_HOLDER_DISPLAY = 'Hà Ngọc Hoàn';
var DEFAULT_PUBLIC_REGISTER_URL = 'https://delivering-happiness.vercel.app/register.html';
var DEFAULT_DH9_PUBLIC_REGISTER_URL = 'https://delivering-happiness.vercel.app/register_dh9_hanoi.html';
var DEFAULT_DHM8_ZALO_GROUP_URL = 'https://zalo.me/g/hpf7qu45j6qkft6hpghx';
var DEFAULT_DH9_ZALO_GROUP_URL = 'https://zalo.me/g/3wrsaoygrfcjubr0ie44';

function getLaneKey_(value) {
  var normalized = String(value || '').toLowerCase();
  return (normalized === 'dh9' || normalized === 'dhm9') ? 'dh9' : 'dh8';
}

function isDhm9Token_(value) {
  var normalized = normalizePaymentCodeToken(value || '');
  return normalized.indexOf('DH9') === 0 || normalized.indexOf('DHM9') === 0;
}

function containsDhm9Token_(value) {
  var raw = String(value || '').toUpperCase();
  var tokens = raw.split(/[^A-Z0-9]+/)
    .map(function(token) { return normalizePaymentCodeToken(token); })
    .filter(function(token) { return token !== ''; });
  var stripped = normalizePaymentCodeToken(raw);
  if (stripped && tokens.indexOf(stripped) === -1) {
    tokens.push(stripped);
  }
  return tokens.some(function(token) { return isDhm9Token_(token); });
}

function detectLaneKeyFromPaymentCode_(paymentCode) {
  if (isDhm9Token_(paymentCode)) return 'dh9';
  return 'dh8';
}

function detectLaneKeyFromPayload_(data) {
  var laneCandidate = String((data && (data.lane || data.registrationLane || data.eventLane)) || '').toLowerCase();
  if (laneCandidate === 'dh9' || laneCandidate === 'dhm9') return 'dh9';
  var eventId = String((data && data.event_id) || '').toUpperCase();
  var type = String((data && data.type) || '').toUpperCase();
  var source = String((data && data.source) || '').toUpperCase();
  var content = data ? [
    data.transferContent,
    data.transactionContent,
    data.content,
    data.description,
    data.paymentCode,
    data.code
  ].join(' ').toUpperCase() : '';
  if (eventId.indexOf('DH9') !== -1 || eventId.indexOf('DHM9') !== -1 ||
      type.indexOf('DH9') !== -1 || type.indexOf('DHM9') !== -1 ||
      source.indexOf('DH9') !== -1 || source.indexOf('DHM9') !== -1 ||
      containsDhm9Token_(content)) {
    return 'dh9';
  }
  return 'dh8';
}

function getLaneConfig_(laneKey) {
  var props = getScriptProperties_();
  var resolvedLane = getLaneKey_(laneKey);
  if (resolvedLane === 'dh9') {
    return {
      laneKey: 'dh9',
      paymentPrefix: 'DHM9',
      paymentPrefixes: ['DHM9', 'DH9'],
      registrationCap: parseInt(props.getProperty('DH9_REGISTRATION_CAP'), 10) || DHM9_REGISTRATION_CAP,
      dataSheetName: 'DHM9_Data',
      paymentsSheetName: 'DHM9_Payments',
      outboxSheetName: 'DHM9_Email_Outbox',
      inboxSheetName: 'DHM9_Inbox',
      interestSheetName: 'DHM9 interest',
      interestUrl: (props.getProperty('DH9_INTEREST_URL') || DEFAULT_DH9_INTEREST_URL).trim(),
      publicRegisterUrl: (props.getProperty('DH9_PUBLIC_REGISTER_URL') || DEFAULT_DH9_PUBLIC_REGISTER_URL).trim(),
      titleShort: 'DHM9',
      classLabel: 'Delivering Happiness Masterclass 9 (DHM9)',
      cityLabel: 'Hà Nội',
      zaloGroupUrl: (props.getProperty('DH9_ZALO_GROUP_URL') || DEFAULT_DH9_ZALO_GROUP_URL).trim(),
      defaultEventId: 'DHM9_REG_220826_HN',
      defaultInterestEventId: 'DHM9_INTEREST_220826_HN',
      defaultLeadType: 'EVENT_LEAD_DHM9',
      defaultLeadSource: 'Web_DHM9_Hanoi_Official',
      defaultInterestType: 'DHM9_INTEREST',
      defaultInterestSource: 'Web_DHM9_Interest'
    };
  }

  return {
    laneKey: 'dh8',
    paymentPrefix: 'DH8',
    registrationCap: DHM8_REGISTRATION_CAP,
    dataSheetName: 'DHM8_Data',
    paymentsSheetName: 'DHM8_Payments',
    outboxSheetName: 'DHM8_Email_Outbox',
    inboxSheetName: 'DHM8_Inbox',
    interestSheetName: 'DH interest',
    interestUrl: (props.getProperty('INTEREST_URL') || DEFAULT_INTEREST_URL).trim(),
    publicRegisterUrl: (props.getProperty('PUBLIC_REGISTER_URL') || DEFAULT_PUBLIC_REGISTER_URL).trim(),
    titleShort: 'DHM8',
    classLabel: 'Delivering Happiness Masterclass 8 (DHM8)',
    cityLabel: 'HCM',
    zaloGroupUrl: (props.getProperty('DHM8_ZALO_GROUP_URL') || DEFAULT_DHM8_ZALO_GROUP_URL).trim(),
    defaultEventId: 'DHM8_REG_180726',
    defaultInterestEventId: 'DH_INTEREST',
    defaultLeadType: 'EVENT_LEAD_DHM8',
    defaultLeadSource: 'Web_DHM8_Official',
    defaultInterestType: 'DH_INTEREST',
    defaultInterestSource: 'Web_DH_Interest'
  };
}

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
  if (env === 'PRODUCTION' && props.getProperty('OFFICIAL_ACCOUNT_NUMBER') !== DEFAULT_OFFICIAL_ACCOUNT_NUMBER) {
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

function getProcessEmailQueueTriggerInfo_() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var count = 0;
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === MAIL_TRIGGER_FUNCTION) {
        count++;
      }
    }
    return { present: count > 0, count: count, error: '' };
  } catch (err) {
    return { present: false, count: 0, error: err.message || String(err) };
  }
}

function ensureProcessEmailQueueTrigger_(ss) {
  var triggerInfo = getProcessEmailQueueTriggerInfo_();
  if (triggerInfo.present) return triggerInfo;

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    triggerInfo = getProcessEmailQueueTriggerInfo_();
    if (!triggerInfo.present) {
      ScriptApp.newTrigger(MAIL_TRIGGER_FUNCTION)
        .timeBased()
        .everyMinutes(MAIL_TRIGGER_EVERY_MINUTES)
        .create();
      if (ss) {
        writeSystemLog(ss, 'INFO',
          'Auto-created mail trigger',
          MAIL_TRIGGER_FUNCTION + ' every ' + MAIL_TRIGGER_EVERY_MINUTES + ' minutes');
      }
    }
  } finally {
    lock.releaseLock();
  }

  return getProcessEmailQueueTriggerInfo_();
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
  if (digits.indexOf('0084') === 0 && digits.length > 6) digits = '0' + digits.slice(4);
  else if (digits.indexOf('84') === 0 && digits.length > 6) digits = '0' + digits.slice(2);

  if (digits.length === 9 && digits.indexOf('0') !== 0) {
    digits = '0' + digits;
  }
  return digits;
}

function buildPaymentCodeFromPhone(phone, laneKey) {
  var normalizedPhone = normalizePhone(phone);
  var codeDigits = normalizedPhone.replace(/^0/, '');
  if (!/^\d{3,}$/.test(codeDigits)) return '';
  return getLaneConfig_(laneKey).paymentPrefix + codeDigits.slice(-9);
}

function getPaymentPrefixesForLane_(config) {
  var prefixes = (config && config.paymentPrefixes) || (config && config.paymentPrefix ? [config.paymentPrefix] : []);
  return prefixes.filter(function(prefix, index) {
    return prefix && prefixes.indexOf(prefix) === index;
  });
}

function buildLegacyPaymentCodeFromUuid(uuid) {
  var compact = (uuid || '').toString().replace(/-/g, '').toUpperCase();
  if (!compact) return '';
  return 'DH' + compact.slice(0, 12);
}

function normalizePaymentCodeToken(code) {
  return (code || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function isActiveRegistrationStatus_(status) {
  var normalized = String(status || '').toUpperCase();
  return normalized === 'PENDING' || normalized === 'PAID';
}

function getPaymentCodeInfo_(phone, uuid, laneKey) {
  var config = getLaneConfig_(laneKey);
  var paymentCode = buildPaymentCodeFromPhone(phone, config.laneKey);
  var legacyPaymentCode = buildLegacyPaymentCodeFromUuid(uuid);
  var normalizedPhone = normalizePhone(phone);
  var codeDigits = normalizedPhone.replace(/^0/, '');
  var variants = [];
  var prefixVariants = [paymentCode];
  getPaymentPrefixesForLane_(config).forEach(function(prefix) {
    if (normalizedPhone) {
      prefixVariants.push(prefix + '-' + normalizedPhone);
      prefixVariants.push(prefix + normalizedPhone);
    }
    if (/^\d{3,}$/.test(codeDigits)) {
      prefixVariants.push(prefix + codeDigits.slice(-9));
    }
  });
  prefixVariants.concat([
    legacyPaymentCode
  ]).forEach(function(code) {
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

function buildQueryString_(params) {
  return Object.keys(params).filter(function(key) {
    return params[key] !== null && params[key] !== undefined && params[key] !== '';
  }).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
}

function formatVndAmount_(amount) {
  return String(parseInt(amount, 10) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getPaymentConfig_(laneKey) {
  var props = getScriptProperties_();
  var lane = getLaneConfig_(laneKey);
  var officialAccount = (props.getProperty('OFFICIAL_ACCOUNT_NUMBER') || DEFAULT_OFFICIAL_ACCOUNT_NUMBER).replace(/\s/g, '');
  var subAccount = (props.getProperty('PAYMENT_SUBACCOUNT') || DEFAULT_PAYMENT_SUBACCOUNT).trim();
  var bank = (props.getProperty('PAYMENT_BANK') || DEFAULT_PAYMENT_BANK).trim();
  var holder = (props.getProperty('PAYMENT_ACCOUNT_HOLDER') || DEFAULT_PAYMENT_HOLDER).trim();
  var holderDisplay = (props.getProperty('PAYMENT_ACCOUNT_HOLDER_DISPLAY') || DEFAULT_PAYMENT_HOLDER_DISPLAY).trim();

  return {
    amount: DHM8_PRICE,
    subAccount: subAccount,
    officialAccount: officialAccount,
    bank: bank,
    holder: holder,
    holderDisplay: holderDisplay,
    publicRegisterUrl: lane.publicRegisterUrl,
    accountLabel: 'VA ' + subAccount + ' / ' + bank + ' ' + officialAccount + ' / ' + holderDisplay
  };
}

function buildPaymentQrUrl_(paymentCode, laneKey) {
  if (!paymentCode) return '';
  var config = getPaymentConfig_(laneKey);
  return 'https://qr.sepay.vn/img?' + buildQueryString_({
    acc: config.subAccount,
    bank: config.bank,
    amount: String(config.amount),
    des: paymentCode,
    template: 'compact',
    showinfo: 'false',
    holder: config.holder
  });
}

function buildPaymentResumeUrl_(regUuid, paymentCode, laneKey) {
  var config = getPaymentConfig_(laneKey);
  var query = buildQueryString_({
    resume: '1',
    uuid: regUuid || '',
    paymentCode: paymentCode || ''
  });
  return config.publicRegisterUrl + (config.publicRegisterUrl.indexOf('?') === -1 ? '?' : '&') + query;
}

function getDhm8PaymentConfig_() {
  return getPaymentConfig_('dh8');
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
  var triggerInfo = getProcessEmailQueueTriggerInfo_();
  return jsonOut({
    success: true,
    environment: props.getProperty('ENVIRONMENT') || '',
    spreadsheetId: props.getProperty('SPREADSHEET_ID') || '',
    officialAccountNumber: props.getProperty('OFFICIAL_ACCOUNT_NUMBER') || '',
    sepayWebhookTokenConfigured: !!props.getProperty('SEPAY_WEBHOOK_TOKEN'),
    processEmailQueueTriggerPresent: triggerInfo.present,
    processEmailQueueTriggerCount: triggerInfo.count,
    processEmailQueueTriggerError: triggerInfo.error || '',
    amount: DHM8_PRICE
  });
}

function handleOperatorEnsureMailTriggerGet_(e) {
  var props = getScriptProperties_();
  ensureOperatorAccess_(props, e, null);
  var ss = getSpreadsheet();
  var before = getProcessEmailQueueTriggerInfo_();
  var after = ensureProcessEmailQueueTrigger_(ss);
  return jsonOut({
    success: true,
    before: before,
    after: after,
    amount: DHM8_PRICE
  });
}

function authorizeMailWorkerScopes() {
  var ss = getSpreadsheet();
  var before = getProcessEmailQueueTriggerInfo_();
  var after = ensureProcessEmailQueueTrigger_(ss);
  return {
    success: true,
    before: before,
    after: after,
    amount: DHM8_PRICE
  };
}

function handleOperatorRunEmailQueueGet_(e) {
  var props = getScriptProperties_();
  ensureOperatorAccess_(props, e, null);
  var ss = getSpreadsheet();
  var before = getEmailOutboxSummary_(ss);
  processEmailQueue();
  var after = getEmailOutboxSummary_(ss);
  return jsonOut({
    success: true,
    before: before,
    after: after
  });
}

function handleOperatorRuntimeDebugGet_(e) {
  var props = getScriptProperties_();
  ensureOperatorAccess_(props, e, null);
  return jsonOut({
    success: true,
    environment: props.getProperty('ENVIRONMENT') || '',
    runtimeBuildLabel: RUNTIME_BUILD_LABEL,
    paymentBtcEmailType: PAYMENT_BTC_EMAIL_TYPE,
    btcEmails: BTC_EMAILS.join(','),
    mailTriggerFunction: MAIL_TRIGGER_FUNCTION,
    mailTriggerEveryMinutes: MAIL_TRIGGER_EVERY_MINUTES
  });
}

function handleOperatorPreviewEmailGet_(e) {
  var props = getScriptProperties_();
  ensureOperatorAccess_(props, e, null);

  var lane = getLaneConfig_((e.parameter && e.parameter.lane) || 'dh8');
  var uuid = ((e.parameter && e.parameter.uuid) || '').toString().trim();
  var emailType = ((e.parameter && e.parameter.emailType) || 'PENDING').toString().trim().toUpperCase();
  if (!uuid) return jsonOut({ success: false, error: 'MISSING_UUID' });

  var ss = getSpreadsheet();
  var html = renderEmailBody(ss, emailType, uuid, lane.laneKey);
  var paymentConfig = getPaymentConfig_(lane.laneKey);

  return jsonOut({
    success: true,
    environment: props.getProperty('ENVIRONMENT') || '',
    runtimeBuildLabel: RUNTIME_BUILD_LABEL,
    lane: lane.laneKey,
    registrationUuid: uuid,
    emailType: emailType,
    amount: paymentConfig.amount,
    accountLabel: paymentConfig.accountLabel,
    hasAmountLine: html.indexOf('Số tiền:') !== -1,
    hasAccountLine: html.indexOf('Đích nhận tiền:') !== -1,
    hasResumeLink: html.indexOf('Mở lại trang thanh toán') !== -1,
    hasQrImage: html.indexOf('QR thanh toán ' + lane.titleShort) !== -1,
    hasLegacyCopy: html.indexOf('theo đúng nội dung chuyển khoản') !== -1,
    html: html
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
  var lane = getLaneConfig_((e.parameter && e.parameter.lane) || 'dh8');

  var uuid = ((e.parameter && e.parameter.uuid) || '').toString().trim();
  if (!uuid) return jsonOut({ success: false, error: 'MISSING_UUID' });

  var ss = getSpreadsheet();
  var dataSheet = ss.getSheetByName(lane.dataSheetName);
  var paymentsSheet = ss.getSheetByName(lane.paymentsSheetName);
  var fallbackCodeInfo = getPaymentCodeInfo_('', uuid, lane.laneKey);
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

    if (String(body.type || '').toUpperCase().indexOf('INTEREST') !== -1) {
      return handleInterestLead_(body, detectLaneKeyFromPayload_(body));
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
        return handleDurableInbox(body, detectLaneKeyFromPayload_(body));
      }
      return handleSePayWebhook(body, detectLaneKeyFromPayload_(body));
    }

    // --- BÀI TEST GIÁ TRỊ CỐT LÕI (PERSONAL VALUES) ---
    if (body.action === 'submit_pv') {
      return handlePersonalValuesSubmission(body);
    }

    // --- THỰC HÀNH LẠC QUAN ABCDE ---
    if (body.action === 'submit_abcde') {
      return jsonOut(handleAbcdeSubmission(body));
    }

    // --- FORM ĐĂNG KÝ ---
    var killReg = props.getProperty('KILL_SWITCH_REGISTRATION');
    if (killReg === 'true') {
      return jsonOut({ success: false, error: 'REGISTRATION_DISABLED' });
    }
    return handleRegistration(body, detectLaneKeyFromPayload_(body));

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

  if (action === 'ensureMailTrigger') {
    return handleOperatorEnsureMailTriggerGet_(e);
  }

  if (action === 'runEmailQueue') {
    return handleOperatorRunEmailQueueGet_(e);
  }

  if (action === 'getRuntimeDebug') {
    return handleOperatorRuntimeDebugGet_(e);
  }

  if (action === 'previewEmail') {
    return handleOperatorPreviewEmailGet_(e);
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
    var paymentCode = normalizePaymentCodeToken(e.parameter.paymentCode || '');
    var lane = getLaneKey_(e.parameter.lane || detectLaneKeyFromPaymentCode_(paymentCode));
    var result = getRegistrationStatus({ uuid: uuid, paymentCode: paymentCode, lane: lane });
    // Condition 2: chỉ trả success, state, registrationUuid, error - KHÔNG trả PII
    var payload = JSON.stringify(result);
    return ContentService.createTextOutput(callback + '(' + payload + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  if (action === 'checkRegistrationAvailability') {
    var availability = getRegistrationAvailability_(getLaneKey_(e.parameter.lane));
    if (callback) {
      if (!CALLBACK_REGEX.test(callback)) {
        return ContentService.createTextOutput('{"error":"INVALID_CALLBACK"}')
          .setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(availability) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonOut(availability);
  }

  if (action === 'submit_pv') {
    if (!CALLBACK_REGEX.test(callback)) {
      return ContentService.createTextOutput('{"error":"INVALID_CALLBACK"}')
        .setMimeType(ContentService.MimeType.JSON);
    }
    var result = handlePersonalValuesSubmission(e.parameter);
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(result) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return jsonOut({ success: false, error: 'UNKNOWN_ACTION' });
}

function getInterestUrl_(laneKey) {
  return getLaneConfig_(laneKey).interestUrl;
}

function getDhm8RegistrationDataRowCount_(sheet) {
  if (!sheet) return 0;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;
  var values = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  var count = 0;
  values.forEach(function(row) {
    var hasData = row.some(function(cell) {
      return String(cell || '').trim() !== '';
    });
    if (hasData) count++;
  });
  return count;
}

function getRegistrationPaidCount_(sheet) {
  if (!sheet) return 0;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;
  // Cột P (index 16 trong Sheet, index 15 trong mảng) = Payment Status.
  var values = sheet.getRange(2, 16, lastRow - 1, 1).getValues();
  var count = 0;
  values.forEach(function(row) {
    if (String(row[0] || '').trim().toUpperCase() === 'PAID') count++;
  });
  return count;
}

function buildRegistrationClosedPayload_(paidCount, laneKey, dataRowCount) {
  var lane = getLaneConfig_(laneKey);
  return {
    success: false,
    state: 'REGISTRATION_CLOSED',
    error: 'REGISTRATION_CLOSED',
    cap: lane.registrationCap,
    paidCount: paidCount,
    dataRowCount: dataRowCount,
    countBasis: 'PAID',
    interestLink: getInterestUrl_(lane.laneKey)
  };
}

function getRegistrationAvailability_(laneKey) {
  var lane = getLaneConfig_(laneKey);
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(lane.dataSheetName);
  var dataRowCount = getDhm8RegistrationDataRowCount_(sheet);
  var paidCount = getRegistrationPaidCount_(sheet);
  var isOpen = paidCount < lane.registrationCap;
  return {
    success: true,
    state: isOpen ? 'OPEN' : 'REGISTRATION_CLOSED',
    registrationOpen: isOpen,
    cap: lane.registrationCap,
    paidCount: paidCount,
    dataRowCount: dataRowCount,
    countBasis: 'PAID',
    interestLink: getInterestUrl_(lane.laneKey)
  };
}

// ─── REGISTRATION STATUS (Condition 4: chỉ REGISTERED khi UUID thực tồn tại) ─
function getRegistrationStatus(query) {
  var uuid = '';
  var paymentCode = '';
  if (typeof query === 'string') {
    uuid = query;
  } else if (query) {
    uuid = query.uuid || '';
    paymentCode = normalizePaymentCodeToken(query.paymentCode || '');
  }
  var lane = getLaneConfig_(query && query.lane ? query.lane : detectLaneKeyFromPaymentCode_(paymentCode));

  if ((!uuid || uuid.trim() === '') && !paymentCode) {
    return { success: false, error: 'MISSING_IDENTIFIER' };
  }
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(lane.dataSheetName);
    if (!sheet) return { success: false, error: 'NOT_FOUND' };

    var data = sheet.getDataRange().getValues();
    // Cột R (index 17) = Registration UUID
    if (uuid && uuid.trim() !== '') {
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
    }

    if (paymentCode) {
      var matches = [];
      for (var j = 1; j < data.length; j++) {
        var rowStatus = data[j][15] || 'PENDING';
        if (!isActiveRegistrationStatus_(rowStatus)) continue;
        var rowUuid = data[j][17] || '';
        var rowPhone = normalizePhone(data[j][3]);
        var rowCodeInfo = getPaymentCodeInfo_(rowPhone, rowUuid, lane.laneKey);
        if (rowCodeInfo.variants.indexOf(paymentCode) !== -1) {
          matches.push({
            registrationUuid: rowUuid,
            paymentStatus: rowStatus
          });
        }
      }

      if (matches.length === 1) {
        if (uuid && matches[0].registrationUuid && matches[0].registrationUuid !== uuid) {
          var duplicateStatus = String(matches[0].paymentStatus || '').toUpperCase();
          return {
            success: false,
            error: duplicateStatus === 'PAID' ? 'DUPLICATE_PAID' : 'DUPLICATE_PENDING',
            state: duplicateStatus === 'PAID' ? 'DUPLICATE_PAID' : 'DUPLICATE_PENDING',
            paymentStatus: duplicateStatus,
            message: duplicateStatus === 'PAID'
              ? 'Số điện thoại này đã được đăng ký và thanh toán ' + lane.titleShort + '. Vui lòng không đăng ký lại.'
              : 'Số điện thoại này đã có đăng ký ' + lane.titleShort + ' đang chờ thanh toán. Vui lòng không đăng ký lại.'
          };
        }
        return {
          success: true,
          state: 'REGISTERED',
          registrationUuid: matches[0].registrationUuid,
          paymentStatus: matches[0].paymentStatus
        };
      }

      var paidMatches = matches.filter(function(match) {
        return String(match.paymentStatus || '').toUpperCase() === 'PAID';
      });
      if (paidMatches.length === 1) {
        if (uuid && paidMatches[0].registrationUuid && paidMatches[0].registrationUuid !== uuid) {
          return {
            success: false,
            error: 'DUPLICATE_PAID',
            state: 'DUPLICATE_PAID',
            paymentStatus: 'PAID',
            message: 'Số điện thoại này đã được đăng ký và thanh toán ' + lane.titleShort + '. Vui lòng không đăng ký lại.'
          };
        }
        return {
          success: true,
          state: 'REGISTERED',
          registrationUuid: paidMatches[0].registrationUuid,
          paymentStatus: paidMatches[0].paymentStatus
        };
      }

      if (matches.length > 1) {
        return { success: false, error: 'AMBIGUOUS_PAYMENT_CODE' };
      }
    }

    var availability = getRegistrationAvailability_(lane.laneKey);
    if (!availability.registrationOpen) {
      return buildRegistrationClosedPayload_(availability.paidCount, lane.laneKey, availability.dataRowCount);
    }

    return { success: false, error: 'NOT_FOUND' };
  } catch (err) {
    return { success: false, error: 'SERVER_ERROR' };
  }
}

function getMissingRegistrationFields_(data) {
  var required = ['fullName', 'email', 'phone'];
  var missing = [];
  required.forEach(function(field) {
    if (!String((data && data[field]) || '').trim()) missing.push(field);
  });
  return missing;
}

// ─── DUPLICATE PHONE GUARD ───────────────────────────────────
function findActiveRegistrationsByPhone_(dataSheet, phone, laneKey) {
  var normalized = normalizePhone(phone);
  var submittedPaymentCode = buildPaymentCodeFromPhone(phone, laneKey);
  if (!normalized && !submittedPaymentCode) return [];
  var rows = dataSheet.getDataRange().getValues();
  var matches = [];
  for (var i = 1; i < rows.length; i++) {
    var rowPhone = normalizePhone(rows[i][3]);
    var rowPaymentCode = buildPaymentCodeFromPhone(rowPhone, laneKey);
    var status = String(rows[i][15] || '').toUpperCase();
    var samePhoneOrCode = (rowPhone === normalized) ||
      (submittedPaymentCode && rowPaymentCode === submittedPaymentCode);
    if (samePhoneOrCode && isActiveRegistrationStatus_(status)) {
      matches.push({
        rowIdx: i,
        uuid: rows[i][17],
        paymentStatus: status,
        email: rows[i][2],
        phone: rows[i][3]
      });
    }
  }
  return matches;
}

// ─── HANDLE REGISTRATION ─────────────────────────────────────
function handleRegistration(data, laneKey) {
  var lane = getLaneConfig_(laneKey);
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(lane.dataSheetName);
  if (!sheet) {
    sheet = ss.insertSheet(lane.dataSheetName);
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

  var missingFields = getMissingRegistrationFields_(data);
  if (missingFields.length) {
    writeSystemLog(ss, 'WARN', 'Rejected incomplete registration payload', JSON.stringify({
      uuid: uuid,
      missingFields: missingFields,
      event: data.event || '',
      source: data.source || '',
      hasSessionId: !!data.sessionId
    }));
    return jsonOut({
      success: false,
      error: 'MISSING_REQUIRED_REGISTRATION_FIELDS',
      missingFields: missingFields
    });
  }

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
      // ─── PHONE DUPLICATE GUARD ────────────────────────────
      var activeByPhone = findActiveRegistrationsByPhone_(sheet, data.phone || '', lane.laneKey);
      if (activeByPhone.length >= 2) {
        writeSystemLog(ss, 'ERROR', 'DUPLICATE_ACTIVE_REGISTRATION blocked: ' + normalizePhone(data.phone || ''), uuid);
        return jsonOut({
          success: false,
          error: 'DUPLICATE_ACTIVE_REGISTRATION',
          message: 'Số điện thoại này đang có nhiều đăng ký active. BTC sẽ xử lý thủ công.'
        });
      }
      if (activeByPhone.length === 1) {
        var existingReg = activeByPhone[0];
        var existingPaymentCode = buildPaymentCodeFromPhone(existingReg.phone, lane.laneKey);
        var existingQrUrl = buildPaymentQrUrl_(existingPaymentCode, lane.laneKey);
        var existingResumeUrl = buildPaymentResumeUrl_(existingReg.uuid, existingPaymentCode, lane.laneKey);
        writeSystemLog(ss, 'WARN', 'DUPLICATE_PHONE blocked, returning existing: ' + existingReg.uuid, uuid);
        if (existingReg.paymentStatus === 'PAID') {
          return jsonOut({
            success: false,
            error: 'DUPLICATE_PAID',
            state: 'DUPLICATE_PAID',
            duplicate: true,
            paymentStatus: 'PAID',
            paymentCode: existingPaymentCode,
            message: 'Số điện thoại này đã được đăng ký và thanh toán ' + lane.titleShort + '. Vui lòng không đăng ký lại.'
          });
        }
        return jsonOut({
          success: false,
          error: 'DUPLICATE_PENDING',
          state: 'DUPLICATE_PENDING',
          duplicate: true,
          paymentStatus: 'PENDING',
          paymentCode: existingPaymentCode,
          message: 'Số điện thoại này đã có đăng ký ' + lane.titleShort + ' đang chờ thanh toán. Vui lòng không đăng ký lại.'
        });
      }
      // ─── END PHONE DUPLICATE GUARD ────────────────────────

      var dataRowCount = getDhm8RegistrationDataRowCount_(sheet);
      var paidCount = getRegistrationPaidCount_(sheet);
      if (paidCount >= lane.registrationCap) {
        return jsonOut(buildRegistrationClosedPayload_(paidCount, lane.laneKey, dataRowCount));
      }
      sheet.appendRow([
        new Date(), data.fullName || '', data.email || '', data.phone || '',
        data.linkedin || '', data.company || '', data.jobTitle || '',
        data.companySize || '', data.sourceHearing || '',
        data.attendedPrograms || 'Chưa tham gia', data.purpose || '',
        data.happinessKnowledge || '', data.expectations || '',
        data.referrerName || '', data.referrerPhone || '',
        'PENDING', data.event_id || lane.defaultEventId, uuid
      ]);
    }
  } finally {
    lock.releaseLock();
  }

  // Fix Bug #3: Backfill outbox jobs dù là đăng ký mới hay duplicate
  // enqueueEmail() tự bỏ qua nếu job đã tồn tại → an toàn để gọi idempotently
  enqueueEmail(ss, uuid, 'PENDING', data.email || '', 'Xác nhận đăng ký ' + lane.titleShort, lane.laneKey);
  var recipients = [].concat(BTC_EMAILS);
  if (data.referrerName === 'GEM Global') {
    recipients.push('hang.ho@gemglobal.edu.vn');
  } else if (data.referrerName === 'Smart Train') {
    recipients.push('thanh.pham@smarttrain.edu.vn');
  }
  enqueueEmail(ss, uuid, 'BTC', recipients.join(','), 'Thông báo đăng ký mới - ' + lane.titleShort, lane.laneKey);
  kickEmailQueueSafely_(ss, 'registration:' + uuid);

  writeSystemLog(ss, 'INFO', isDuplicate ? 'Duplicate reg + outbox backfill' : 'Đăng ký mới', uuid);
  return jsonOut({ success: true, state: 'REGISTERED', registrationUuid: uuid, duplicate: isDuplicate });
}

function handleInterestLead_(data, laneKey) {
  var lane = getLaneConfig_(laneKey);
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(lane.interestSheetName);
  if (!sheet) {
    sheet = ss.insertSheet(lane.interestSheetName);
    sheet.appendRow([
      'Timestamp','Họ và tên','Email','Số điện thoại','Công ty',
      'Chức danh','Ghi chú','Source','Event ID','Interest UUID'
    ]);
    sheet.getRange('1:1').setFontWeight('bold').setBackground('#d9ead3');
    sheet.setFrozenRows(1);
  }

  var uuid = data.interestUuid || '';
  if (!uuid) return jsonOut({ success: false, error: 'MISSING_UUID' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var isDuplicate = false;
  try {
    var existing = sheet.getDataRange().getValues();
    for (var i = 1; i < existing.length; i++) {
      if (existing[i][9] === uuid) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      sheet.appendRow([
        new Date(), data.fullName || '', data.email || '', data.phone || '',
        data.company || '', data.jobTitle || '', data.note || '',
        data.source || lane.defaultInterestSource, data.event_id || lane.defaultInterestEventId, uuid
      ]);
    }
  } finally {
    lock.releaseLock();
  }

  writeSystemLog(ss, 'INFO', isDuplicate ? 'Duplicate interest lead' : 'Interest lead saved', uuid);
  return jsonOut({ success: true, state: 'INTEREST_SAVED', interestUuid: uuid, duplicate: isDuplicate });
}

// ─── HANDLE SEPAY WEBHOOK ─────────────────────────────────────
function handleSePayWebhook(body, laneKey) {
  var lane = getLaneConfig_(laneKey || detectLaneKeyFromPayload_(body));
  var ss = getSpreadsheet();
  var paymentsSheet = ss.getSheetByName(lane.paymentsSheetName);
  if (!paymentsSheet) {
    paymentsSheet = ss.insertSheet(lane.paymentsSheetName);
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
  var dataSheet = ss.getSheetByName(lane.dataSheetName);
  if (!dataSheet) {
    updatePaymentState(paymentsSheet, txId, 'NO_MATCH');
    return jsonOut({ success: true });
  }

  var rawTokens = content.split(/[^A-Z0-9]+/i).map(function(t) {
    return (t || '').toString().trim().toUpperCase();
  }).filter(function(t) { return t !== ''; });
  var strippedContent = content.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  if (strippedContent && rawTokens.indexOf(strippedContent) === -1) {
    rawTokens.push(strippedContent);
  }
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
    var rowCodeInfo = getPaymentCodeInfo_(rowPhone, rowUuid, lane.laneKey);
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
    enqueueEmail(ss, m.uuid, 'PAID', dataRows[m.rowIdx][2], 'Xác nhận thanh toán ' + lane.titleShort, lane.laneKey);
    var referrerName = dataRows[m.rowIdx][13] || '';
    var paymentRecipients = [].concat(BTC_EMAILS);
    if (referrerName === 'GEM Global') {
      paymentRecipients.push('hang.ho@gemglobal.edu.vn');
    } else if (referrerName === 'Smart Train') {
      paymentRecipients.push('thanh.pham@smarttrain.edu.vn');
    }
    enqueueEmail(ss, m.uuid, PAYMENT_BTC_EMAIL_TYPE, paymentRecipients.join(','), 'Thanh toán xác nhận - ' + lane.titleShort, lane.laneKey);
    kickEmailQueueSafely_(ss, 'payment:' + txId);
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
function handleDurableInbox(body, laneKey) {
  var lane = getLaneConfig_(laneKey || detectLaneKeyFromPayload_(body));
  var ss = getSpreadsheet();
  var inbox = ss.getSheetByName(lane.inboxSheetName);
  if (!inbox) {
    inbox = ss.insertSheet(lane.inboxSheetName);
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
  var processed = 0;
  var failed = 0;

  ['dh8', 'dh9'].forEach(function(laneKey) {
    var lane = getLaneConfig_(laneKey);
    var inbox = ss.getSheetByName(lane.inboxSheetName);
    if (!inbox) return;

    var rows = inbox.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var state = rows[i][2];
      if (state !== 'UNPROCESSED' && state !== 'ERROR') continue;

      try {
        var payload = JSON.parse(rows[i][1] || '{}');
        handleSePayWebhook(payload, lane.laneKey);
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
  });

  writeSystemLog(ss, failed ? 'WARN' : 'INFO', 'Durable inbox reprocess complete',
    'processed=' + processed + ', failed=' + failed);
  return { success: failed === 0, processed: processed, failed: failed };
}

function cleanupProcessedInbox(retentionDays) {
  var ss = getSpreadsheet();
  var days = parseInt(retentionDays, 10);
  if (!days || days < 1) days = 30;

  var cutoff = new Date(new Date().getTime() - days * 24 * 60 * 60000);
  var deleted = 0;

  ['dh8', 'dh9'].forEach(function(laneKey) {
    var inbox = ss.getSheetByName(getLaneConfig_(laneKey).inboxSheetName);
    if (!inbox) return;
    var rows = inbox.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      var state = rows[i][2];
      var processedAt = rows[i][6] ? new Date(rows[i][6]) : null;
      if (state === 'PROCESSED' && processedAt && processedAt < cutoff) {
        inbox.deleteRow(i + 1);
        deleted++;
      }
    }
  });

  writeSystemLog(ss, 'INFO', 'Durable inbox retention cleanup', 'deleted=' + deleted + ', retentionDays=' + days);
  return { success: true, deleted: deleted };
}

// ─── EMAIL OUTBOX ─────────────────────────────────────────────
function enqueueEmail(ss, registrationUuid, emailType, recipient, subject, laneKey) {
  var lane = getLaneConfig_(laneKey);
  var outbox = ss.getSheetByName(lane.outboxSheetName);
  if (!outbox) {
    outbox = ss.insertSheet(lane.outboxSheetName);
    outbox.appendRow([
      'Job Key','Registration UUID','Email Type','Recipient','Subject',
      'Lease Owner','State','Attempt Count','Next Attempt At',
      'Lease Expires At','Last Error','Sent At','Template Data','Lane Key'
    ]);
    outbox.setFrozenRows(1);
  }
  var jobKey = lane.laneKey + ':' + registrationUuid + ':' + emailType;
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
      JSON.stringify({ templateType: emailType, registrationUuid: registrationUuid, laneKey: lane.laneKey }),
      lane.laneKey
    ]);
  } finally {
    lock.releaseLock();
  }
}

// ─── EMAIL QUEUE PROCESSOR ────────────────────────────────────
function processEmailQueue() {
  var props = getScriptProperties_();
  if (props.getProperty('KILL_SWITCH_EMAIL') === 'true') return;

  processEmailQueueForLane_('dh8');
  processEmailQueueForLane_('dh9');
}

function processEmailQueueForLane_(laneKey) {
  var props = getScriptProperties_();
  var lane = getLaneConfig_(laneKey);
  var ss = getSpreadsheet();
  var outbox = ss.getSheetByName(lane.outboxSheetName);
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
    var maxAttempts = emailType.indexOf('BTC') === 0 ? 5 : 3;

    var recipientCount = (recipient.split(',').length);
    if (getRemainingQuota() < recipientCount + 5) {
      writeSystemLog(ss, 'WARN', 'Quota không đủ, dừng xử lý', jobKey);
      return;
    }

    var toAddress = testMode ? allowlist.join(',') : recipient;
    if (!toAddress) return;

    try {
      var bodyHtml = renderEmailBody(ss, emailType, regUuid, lane.laneKey);
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

function getEmailOutboxSummary_(ss, laneKey) {
  var outbox = ss.getSheetByName(getLaneConfig_(laneKey || 'dh8').outboxSheetName);
  var summary = { total: 0, states: {} };
  if (!outbox) return summary;
  var rows = outbox.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var state = rows[i][6] || '(blank)';
    summary.total++;
    summary.states[state] = (summary.states[state] || 0) + 1;
  }
  return summary;
}

function kickEmailQueueSafely_(ss, detail) {
  // Chỉ tối ưu hóa đối với luồng đăng ký mới (registration) để bảo vệ trải nghiệm học viên
  if (detail && detail.indexOf('registration:') === 0) {
    try {
      var triggerInfo = getProcessEmailQueueTriggerInfo_();
      if (triggerInfo.present && triggerInfo.count >= 1) {
        writeSystemLog(ss, 'INFO', 'Bỏ qua kích hoạt email đồng bộ (Trigger hoạt động tốt)', detail);
        return; // Thoát ngay, nhường việc gửi email cho trigger chạy ngầm xử lý sau ít giây
      } else {
        writeSystemLog(ss, 'WARN', 'Trigger thiếu hoặc lỗi, chạy đồng bộ làm fallback phòng mất email', detail);
      }
    } catch (e_trigger) {
      writeSystemLog(ss, 'ERROR', 'Lỗi kiểm tra trigger, chạy đồng bộ làm fallback', detail + ' | Err: ' + e_trigger.message);
    }
  }

  // Thực hiện xử lý gửi thư ngay lập tức (cho webhook payment hoặc khi trigger bị lỗi/thiếu)
  try {
    processEmailQueue();
  } catch (err) {
    writeSystemLog(ss, 'ERROR', 'Inline email queue kick failed: ' + err.message, detail || '');
  }
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRegistrationEmailData_(ss, regUuid, laneKey) {
  var lane = getLaneConfig_(laneKey);
  var dataSheet = ss.getSheetByName(lane.dataSheetName);
  var data = {
    name: '(Học viên)',
    email: '',
    phone: '',
    company: '',
    paymentStatus: '',
    paymentCode: '',
    laneKey: lane.laneKey
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
        data.paymentCode = getPaymentCodeInfo_(data.phone, regUuid, lane.laneKey).paymentCode;
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
function renderEmailBody(ss, emailType, regUuid, laneKey) {
  var lane = getLaneConfig_(laneKey);
  var data = getRegistrationEmailData_(ss, regUuid, lane.laneKey);
  var name = escapeHtml_(data.name);
  var paymentCode = escapeHtml_(data.paymentCode || (lane.paymentPrefix + '...'));
  var paymentConfig = getPaymentConfig_(lane.laneKey);
  var paymentAmountLabel = escapeHtml_(formatVndAmount_(paymentConfig.amount) + 'đ');
  var paymentAccountLabel = escapeHtml_(paymentConfig.accountLabel);
  var paymentQrUrl = escapeHtml_(buildPaymentQrUrl_(data.paymentCode || '', lane.laneKey));
  var paymentResumeUrl = escapeHtml_(buildPaymentResumeUrl_(regUuid, data.paymentCode || '', lane.laneKey));

  if (emailType === 'PENDING') {
    return renderEmailShell_(
      lane.titleShort + ' - Xác nhận đăng ký',
      'BTC đã nhận được thông tin đăng ký của bạn',
      '<p>Xin chào <strong>' + name + '</strong>,</p>' +
      '<p>BTC đã nhận được thông tin đăng ký ' + escapeHtml_(lane.classLabel) + ' của bạn.</p>' +
      '<div class="box warning"><strong>Bước tiếp theo:</strong><br>Vui lòng hoàn tất chi phí hậu cần theo thông tin dưới đây.</div>' +
      '<div class="box">' +
      '<p><strong>Số tiền:</strong> ' + paymentAmountLabel + '</p>' +
      '<p><strong>Đích nhận tiền:</strong> ' + paymentAccountLabel + '</p>' +
      '<p><strong>Nội dung chuyển khoản:</strong> <span class="code">' + paymentCode + '</span></p>' +
      '</div>' +
      (paymentQrUrl
        ? '<div style="text-align:center; margin:20px 0;">' +
          '<img src="' + paymentQrUrl + '" alt="QR thanh toán ' + escapeHtml_(lane.titleShort) + '" style="display:block; width:100%; max-width:260px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;">' +
          '</div>'
        : '') +
      '<p><a class="btn" href="' + paymentResumeUrl + '" target="_blank">Mở lại trang thanh toán</a></p>' +
      '<p style="font-size:13px; color:#6b7280;">Bạn có thể mở link này trên thiết bị khác để xem lại QR và trạng thái thanh toán.</p>' +
      '<p>Sau khi hệ thống ghi nhận thanh toán, bạn sẽ nhận email xác nhận giữ chỗ chính thức và link tham gia nhóm Zalo lớp ' + escapeHtml_(lane.titleShort) + ' ' + escapeHtml_(lane.cityLabel) + '.</p>' +
      '<div style="margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 15px;">' +
      '<p>Trân trọng,<br><strong>Ban tổ chức ' + escapeHtml_(lane.titleShort) + '</strong></p>' +
      '<img src="https://delivering-happiness.vercel.app/culturecode_logo_transparent.png" alt="CultureCode" style="width: 90px; height: 90px; margin-top: 10px; display: block; border-radius: 8px;">' +
      '<p style="margin-top: 5px;"><a href="https://www.linkedin.com/company/culturecodecommunity" style="color: #0f766e; text-decoration: none; font-size: 14px;">Cập nhật thông tin mới nhất trên LinkedIn CultureCode</a></p>' +
      '</div>'
    );
  }
  if (emailType === 'PAID') {
    return renderEmailShell_(
      lane.titleShort + ' - Đã xác nhận thanh toán',
      'Bạn đã hoàn tất chi phí hậu cần',
      '<p>Xin chào <strong>' + name + '</strong>,</p>' +
      '<div class="box success"><strong>Chúc mừng bạn!</strong><br>Hệ thống đã ghi nhận thanh toán chi phí hậu cần thành công. Suất tham dự ' + escapeHtml_(lane.titleShort) + ' của bạn đã được xác nhận.</div>' +
      '<p>Bạn vui lòng tham gia nhóm Zalo ' + escapeHtml_(lane.titleShort) + ' ' + escapeHtml_(lane.cityLabel) + ' để nhận thông báo từ BTC, cập nhật thông tin lớp học và kết nối với cộng đồng học viên.</p>' +
      '<p><a class="btn" href="' + escapeHtml_(lane.zaloGroupUrl) + '" target="_blank">Vào nhóm Zalo ' + escapeHtml_(lane.titleShort) + ' ' + escapeHtml_(lane.cityLabel) + '</a></p>' +
      '<div class="box"><strong>Lưu ý nhanh:</strong><br>BTC sẽ tiếp tục gửi thông tin check-in, địa điểm và chuẩn bị trước sự kiện qua email này và nhóm Zalo.</div>' +
      '<div style="margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 15px;">' +
      '<p>Trân trọng,<br><strong>Ban tổ chức ' + escapeHtml_(lane.titleShort) + '</strong></p>' +
      '<img src="https://delivering-happiness.vercel.app/culturecode_logo_transparent.png" alt="CultureCode" style="width: 90px; height: 90px; margin-top: 10px; display: block; border-radius: 8px;">' +
      '<p style="margin-top: 5px;"><a href="https://www.linkedin.com/company/culturecodecommunity" style="color: #0f766e; text-decoration: none; font-size: 14px;">Cập nhật thông tin mới nhất trên LinkedIn CultureCode</a></p>' +
      '</div>'
    );
  }
  if (emailType === 'BTC' || emailType === 'BTC_PAID') {
    var isPaidNotice = emailType === 'BTC_PAID';
    var dataSheet = ss.getSheetByName(lane.dataSheetName);
    var paidCount = getRegistrationPaidCount_(dataSheet);
    return renderEmailShell_(
      lane.titleShort + ' - Thông báo nội bộ BTC',
      isPaidNotice ? 'Có học viên vừa hoàn tất thanh toán' : 'Có hoạt động mới liên quan đến đăng ký',
      '<p><strong>UUID:</strong> ' + escapeHtml_(regUuid) + '</p>' +
      '<p><strong>Họ tên:</strong> ' + name + '</p>' +
      '<p><strong>SĐT:</strong> ' + escapeHtml_(data.phone) + '</p>' +
      '<p><strong>Email:</strong> ' + escapeHtml_(data.email) + '</p>' +
      '<p><strong>Trạng thái thanh toán:</strong> ' + escapeHtml_(data.paymentStatus) + '</p>' +
      (isPaidNotice ? '<p><strong>Sự kiện:</strong> Học viên đã hoàn tất thanh toán.</p>' : '') +
      '<p>Tổng số lượng học viên hoàn thành thanh toán của ' + escapeHtml_(lane.titleShort) + ' là ' + paidCount + ' người.</p>' +
      '<div style="margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 15px;">' +
      '<p>Trân trọng,<br><strong>Ban tổ chức ' + escapeHtml_(lane.titleShort) + '</strong></p>' +
      '<img src="https://delivering-happiness.vercel.app/culturecode_logo_transparent.png" alt="CultureCode" style="width: 90px; height: 90px; margin-top: 10px; display: block; border-radius: 8px;">' +
      '<p style="margin-top: 5px;"><a href="https://www.linkedin.com/company/culturecodecommunity" style="color: #0f766e; text-decoration: none; font-size: 14px;">Cập nhật thông tin mới nhất trên LinkedIn CultureCode</a></p>' +
      '</div>'
    );
  }
  return '<p>Email notification - ' + escapeHtml_(lane.titleShort) + '</p>';
}

// ─── HELPER ──────────────────────────────────────────────────
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── PERSONAL VALUES ASSESSMENT SERVICES ─────────────────────
function handlePersonalValuesSubmission(body) {
  var ss = getSpreadsheet();
  var props = getScriptProperties_();
  
  // 1. Kill switch
  if (props.getProperty('KILL_SWITCH_PV') === 'true') {
    return { success: false, error: 'PV_DISABLED', message: 'Hệ thống khảo sát đang tạm đóng. Vui lòng liên hệ BTC.' };
  }
  
  // 2. Input validation
  var fullName = (body.fullName || '').trim();
  var email = (body.email || '').trim();
  var rankedDataStr = body.rankedData || '';
  var duelHistoryStr = body.duelHistory || '';
  
  if (!fullName || fullName.length > 100) {
    return { success: false, error: 'INVALID_NAME', message: 'Họ và tên không hợp lệ hoặc quá dài.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'INVALID_EMAIL', message: 'Địa chỉ Email không hợp lệ.' };
  }
  
  // CAPTCHA verification
  var num1 = parseInt(body.num1, 10);
  var num2 = parseInt(body.num2, 10);
  var captchaAnswer = parseInt(body.captchaAnswer, 10);
  var captchaToken = parseInt(body.captchaToken, 10);
  
  if (isNaN(num1) || isNaN(num2) || isNaN(captchaAnswer) || isNaN(captchaToken)) {
    return { success: false, error: 'INVALID_CAPTCHA_INPUT', message: 'Thiếu thông tin xác minh người dùng.' };
  }
  
  var expectedToken = (num1 * 3 + num2 * 7) ^ 90;
  if (captchaToken !== expectedToken || captchaAnswer !== (num1 + num2)) {
    return { success: false, error: 'CAPTCHA_FAILED', message: 'Mã xác minh không chính xác.' };
  }
  
  // 3. Parse and validate rankedData
  var parsedRanked = [];
  try {
    parsedRanked = JSON.parse(rankedDataStr);
  } catch(e) {
    return { success: false, error: 'INVALID_RANKED_JSON', message: 'Dữ liệu xếp hạng không hợp lệ.' };
  }
  
  if (!Array.isArray(parsedRanked) || parsedRanked.length !== 7) {
    return { success: false, error: 'INVALID_RANKED_SIZE', message: 'Báo cáo bắt buộc phải chứa đúng 7 giá trị.' };
  }
  
  for (var i = 0; i < parsedRanked.length; i++) {
    var item = parsedRanked[i];
    if (!item.name || typeof item.name !== 'string') {
      return { success: false, error: 'INVALID_RANKED_ITEM', message: 'Tên giá trị không hợp lệ.' };
    }
    item.score = parseInt(item.score, 10);
    if (isNaN(item.score) || item.score < 0 || item.score > 6) {
      return { success: false, error: 'INVALID_RANKED_SCORE', message: 'Điểm số của giá trị không hợp lệ.' };
    }
    // Escape HTML for security
    item.name = escapeHtml_(item.name);
    item.details = escapeHtml_(item.details || item.desc || '');
  }
  
  // 4. Rate Limiting by Email (Max 3 submissions in 5 minutes)
  var sheetName = 'PV_Data';
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      'Timestamp', 
      'Full Name', 
      'Email', 
      'Top 7 Values (Ranked)', 
      'Duel History (JSON)'
    ]);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#f59e0b');
    sheet.setFrozenRows(1);
  } else {
    var now = new Date();
    var fiveMinsAgo = new Date(now.getTime() - 5 * 60 * 1000);
    var emailSubmissions = 0;
    var rows = sheet.getDataRange().getValues();
    for (var j = rows.length - 1; j >= 1; j--) {
      var rowEmail = rows[j][2];
      var rowTime = rows[j][0] ? new Date(rows[j][0]) : null;
      if (rowEmail === email && rowTime && rowTime >= fiveMinsAgo) {
        emailSubmissions++;
        if (emailSubmissions >= 3) {
          return { success: false, error: 'RATE_LIMIT_EXCEEDED', message: 'Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau ít phút.' };
        }
      }
    }
  }
  
  // 5. Append to sheet (Write to Sheet)
  var timestamp = new Date();
  var escapedFullName = escapeHtml_(fullName);
  var escapedEmail = escapeHtml_(email);
  
  var rankedDisplay = parsedRanked.map(function(item, idx) {
    return (idx + 1) + '. ' + item.name + ' (' + item.score + 'đ)';
  }).join(', ');
  
  if (duelHistoryStr.length > 5000) {
    duelHistoryStr = duelHistoryStr.substring(0, 5000);
  }
  var escapedDuelHistoryStr = escapeHtml_(duelHistoryStr);
  
  sheet.appendRow([
    timestamp,
    escapedFullName,
    escapedEmail,
    rankedDisplay,
    escapedDuelHistoryStr
  ]);
  
  // 6. Quota check & Send Email
  var emailSent = false;
  var emailMessage = '';
  
  var killEmail = props.getProperty('KILL_SWITCH_EMAIL') === 'true';
  if (killEmail) {
    writeSystemLog(ss, 'INFO', 'KILL_SWITCH_EMAIL is true, skipping PV email to ' + escapedEmail);
    emailMessage = 'Gửi email tạm tắt từ hệ thống.';
  } else if (getRemainingQuota() < 5) {
    writeSystemLog(ss, 'WARN', 'Daily email quota low, skipping PV email to ' + escapedEmail);
    emailMessage = 'Hạn mức gửi thư của hệ thống đã hết hôm nay. Kết quả vẫn được ghi nhận.';
  } else {
    try {
      sendPersonalValuesEmail(escapedEmail, escapedFullName, parsedRanked);
      emailSent = true;
    } catch(mailErr) {
      writeSystemLog(ss, 'ERROR', 'Failed to send PV email to ' + escapedEmail, mailErr.message);
      emailMessage = 'Gửi email gặp lỗi: ' + mailErr.message;
    }
  }
  
  return { 
    success: true, 
    emailSent: emailSent, 
    emailMessage: emailMessage,
    message: emailSent ? 'Đã gửi báo cáo! Vui lòng kiểm tra hộp thư của bạn sau vài phút.' : ('Đăng ký thành công. ' + emailMessage)
  };
}

function calculateSchwartzDimensions(ranked) {
  var mapping = {
    "Thành tựu": "SE", "Sự thăng tiến": "SE", "Thu nhập cao": "SE", "Tính Độc Lập": "SE", "Lãnh đạo": "SE", "Được ghi nhận": "SE", "Thành công": "SE", "Nổi tiếng": "SE", "Độc lập": "SE", "Ảnh hưởng": "SE", "Sức mạnh": "SE", "Thanh thế": "SE", "Chất lượng làm việc": "SE", "Tài sản": "SE", "Cạnh tranh": "SE",
    "Phiêu lưu": "OC", "Sự tự chủ": "OC", "Sự sáng tạo": "OC", "Sự đa dạng": "OC", "Linh hoạt/Thích ứng": "OC", "Tự do": "OC", "Sự hài hước": "OC", "Học tập, phát triển": "OC", "Tự khám phá": "OC", "Niềm vui": "OC", "Tiến bộ": "OC", "Mạo hiểm": "OC", "Cảm nhận về nghệ thuật": "OC", "Sáng tạo": "OC", "Học văn": "OC", "Phát triển cá nhân": "OC", "Thoải mái": "OC",
    "Tình cảm": "ST", "Sự cân bằng": "ST", "Gắn kết cộng đồng": "ST", "Gắn kết gia đình": "ST", "Sự phục vụ": "ST", "Làm việc nhóm": "ST", "Bao dung/Tha thứ": "ST", "Tình bạn": "ST", "Sự bình đẳng": "ST", "Sự cống hiến": "ST", "Lãng mạn": "ST", "Đóng góp": "ST", "Hợp tác": "ST", "Công bằng": "ST", "Hạnh phúc gia đình": "ST", "Tha thứ": "ST", "Giúp đỡ": "ST", "Lòng khoan dung": "ST", "Tính phong phú": "ST",
    "Sự cam kết": "CO", "Sự tự tin": "CO", "Sức khoẻ": "CO", "Sức khỏe": "CO", "Sự trung thực": "CO", "Môi trường làm việc": "CO", "Năng suất": "CO", "Tôn giáo/Tín ngưỡng": "CO", "Sự an toàn": "CO", "An toàn": "CO", "Bình yên": "CO", "Trí tuệ": "CO", "Lòng dũng cảm": "CO", "Tính dũng cảm": "CO", "Tự kỷ luật": "CO", "Trách nhiệm": "CO", "Kiềm chế": "CO", "Bảo đảm kinh tế": "CO", "Sự tĩnh tâm": "CO", "Sự chính trực": "CO", "Trung thành": "CO", "Trật tự": "CO", "Tôn trọng bản thân": "CO", "Tâm linh": "CO", "Chính thống": "CO"
  };

  var scores = { ST: 0, SE: 0, OC: 0, CO: 0 };
  var total = 0;

  if (!Array.isArray(ranked)) {
    return { selfTranscendence: 25, selfEnhancement: 25, opennessToChange: 25, conservation: 25 };
  }

  ranked.forEach(function(item) {
    if (item && item.name) {
      var dim = mapping[item.name];
      if (dim) {
        var scoreVal = Number(item.score);
        if (!isNaN(scoreVal)) {
          scores[dim] += scoreVal;
          total += scoreVal;
        }
      }
    }
  });

  if (total === 0) {
    return { selfTranscendence: 25, selfEnhancement: 25, opennessToChange: 25, conservation: 25 };
  }

  return {
    selfTranscendence: Math.round((scores.ST / total) * 100),
    selfEnhancement: Math.round((scores.SE / total) * 100),
    opennessToChange: Math.round((scores.OC / total) * 100),
    conservation: Math.round((scores.CO / total) * 100)
  };
}

function sendPersonalValuesEmail(recipientEmail, fullName, parsedRanked) {
  var props = getScriptProperties_();
  var ss = getSpreadsheet();
  
  var testMode = props.getProperty('TEST_MODE') === 'true';
  var allowlistStr = props.getProperty('RECIPIENT_ALLOWLIST') || '';
  var allowlist = allowlistStr.split(',').map(function(e) { return e.trim(); }).filter(Boolean);
  
  var toAddress = testMode ? allowlist.join(',') : recipientEmail;
  if (!toAddress) {
    writeSystemLog(ss, 'WARN', 'Skipping PV email: testMode is true but RECIPIENT_ALLOWLIST is empty');
    return;
  }
  
  var subject = '[Delivering Happiness] DNA Giá Trị Cốt Lõi Của Bạn';
  
  var valuesHtml = parsedRanked.map(function(item, index) {
    var desc = item.details || '';
    return '<tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">' +
           '<td style="padding: 10px; font-weight: bold; color: #ea580c; width: 40px;">#' + (index + 1) + '</td>' +
           '<td style="padding: 10px; font-weight: bold; color: #1c1917;">' + item.name + '</td>' +
           '<td style="padding: 10px; color: #ea580c; font-weight: bold; text-align: center; width: 60px;">' + item.score + ' đ</td>' +
           '<td style="padding: 10px; color: #44403c; font-size: 0.9rem;">' + desc + '</td>' +
           '</tr>';
  }).join('');
  
  var dimensions = calculateSchwartzDimensions(parsedRanked);
  
  var dimensionsHtml = 
    '<div style="margin: 20px 0; padding: 15px; background-color: #fffbeb; border-radius: 12px; border: 1.5px dashed #f59e0b;">' +
    '<h3 style="color: #ea580c; margin-top: 0; margin-bottom: 10px;">📊 Định hình Nhóm Động Lực Chủ Đạo:</h3>' +
    '<ul style="margin: 0; padding-left: 20px; line-height: 1.6;">' +
    '<li><strong>Vượt lên Bản thân:</strong> ' + dimensions.selfTranscendence + '% (Học hỏi, cống hiến, giúp đỡ, yêu thương)</li>' +
    '<li><strong>Tự khẳng định Bản thân:</strong> ' + dimensions.selfEnhancement + '% (Vị thế, thành công, thăng tiến, sức mạnh)</li>' +
    '<li><strong>Sẵn sàng Thay đổi:</strong> ' + dimensions.opennessToChange + '% (Độc lập, sáng tạo, tự do, phiêu lưu)</li>' +
    '<li><strong>Duy trì Ổn định:</strong> ' + dimensions.conservation + '% (Kỷ luật, an toàn, trật tự, truyền thống)</li>' +
    '</ul>' +
    '<p style="margin: 10px 0 0 0; font-size: 0.85rem; color: #78716c; font-style: italic;">* Tỷ lệ thể hiện xu hướng ưu tiên năng lượng tinh thần của bạn dựa trên 7 giá trị dẫn đầu.</p>' +
    '</div>';

  var htmlBody = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; background-color: #ffffff; color: #1c1917;">' +
    '<div style="text-align: center; margin-bottom: 20px;">' +
    '<h2 style="color: #ea580c; margin-bottom: 5px; font-weight: bold;">DNA GIÁ TRỊ CỐT LÕI CỦA BẠN</h2>' +
    '<p style="color: #78716c; font-size: 0.95rem; margin-top: 0;">Chào <strong>' + fullName + '</strong>, dưới đây là kết quả phân tích La bàn Giá trị của riêng bạn.</p>' +
    '</div>' +
    
    dimensionsHtml +
    
    '<h3 style="color: #44403c; margin-bottom: 10px;">🏆 Bảng Xếp Hạng Top 7 Giá Trị Cốt Lõi:</h3>' +
    '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">' +
    '<thead>' +
    '<tr style="background-color: #f59e0b; color: #1c1917; font-weight: bold; text-align: left;">' +
    '<th style="padding: 10px; border-radius: 8px 0 0 8px;">Hạng</th>' +
    '<th style="padding: 10px;">Giá trị</th>' +
    '<th style="padding: 10px; text-align: center;">Điểm</th>' +
    '<th style="padding: 10px; border-radius: 0 8px 8px 0;">Ý nghĩa hành vi</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    valuesHtml +
    '</tbody>' +
    '</table>' +
    
    '<div style="margin-top: 30px; padding: 15px; background-color: #fdf2f8; border-radius: 12px; text-align: center;">' +
    '<h3 style="color: #db2777; margin-top: 0; margin-bottom: 5px;">🎯 Kêu Gọi Hành Động (Call to Action):</h3>' +
    '<p style="color: #44403c; font-size: 0.9rem; margin-bottom: 15px; line-height: 1.5;">Hãy cùng tham gia cộng đồng Delivering Happiness để cùng nhau thực hành đồng điệu hóa (alignment) và phát triển các giá trị cốt lõi này trong cuộc sống.</p>' +
    '<a href="https://zalo.me/g/3wrsaoygrfcjubr0ie44" style="background-color: #ea580c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-weight: bold; display: inline-block; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.2);">Tham gia nhóm Zalo DHM9 ngay</a>' +
    '</div>' +
    
    '<div style="text-align: center; margin-top: 30px; font-size: 0.8rem; color: #78716c; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 15px;">' +
    '<p>Báo cáo này được tự động tạo bởi Hệ thống Delivering Happiness &copy; 2026</p>' +
    '</div>' +
    '</div>';
    
  MailApp.sendEmail({
    to: toAddress,
    subject: subject,
    htmlBody: htmlBody
  });
}

function handleAbcdeSubmission(body) {
  var ss = getSpreadsheet();
  var props = getScriptProperties_();
  
  if (props.getProperty('KILL_SWITCH_ABCDE') === 'true') {
    return { success: false, error: 'ABCDE_DISABLED', message: 'Hệ thống thực hành đang tạm đóng. Vui lòng liên hệ BTC.' };
  }
  
  var fullName = (body.fullName || '').trim();
  var email = (body.email || '').trim();
  var passcode = (body.passcode || '').trim().toUpperCase();
  var chatVersion = (body.chatVersion || 'stable').trim();
  var data = body.data || {};
  
  if (!fullName || fullName.length > 100) {
    return { success: false, error: 'INVALID_NAME', message: 'Họ và tên không hợp lệ.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'INVALID_EMAIL', message: 'Địa chỉ Email không hợp lệ.' };
  }
  
  var sheetName = 'ABCDE_Data';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'FullName', 'Email', 'Passcode', 'A_Adversity', 'B_Belief', 'C_Consequence', 'D_Disputation', 'E_Energization', 'ChatVersion']);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
  } else {
    // Đảm bảo tiêu đề cột 10 là ChatVersion nếu chưa có
    var lastCol = sheet.getLastColumn();
    if (lastCol < 10) {
      sheet.getRange(1, 10).setValue('ChatVersion').setFontWeight('bold');
    }
  }
  
  sheet.appendRow([
    new Date(),
    fullName,
    email,
    passcode,
    data.A || '',
    data.B || '',
    data.C || '',
    data.D || '',
    data.E || '',
    chatVersion
  ]);
  
  try {
    sendAbcdeEmailReport_(email, fullName, data, chatVersion);
  } catch(mailErr) {
    Logger.log('Send email failed: ' + mailErr.toString());
  }
  
  return { success: true };
}

function sendAbcdeEmailReport_(email, fullName, data, chatVersion) {
  var subject = '☀️ Báo cáo Thực hành Lạc quan ABCDE - ' + fullName;
  var versionText = chatVersion === 'beta' ? 'Bản thử nghiệm (Có tri thức lớp học RAG)' : 'Bản ổn định (Thực hành nhanh)';
  var htmlBody = 
    '<div style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fcfbf7; color: #2c2520;">' +
    '<h2 style="color: #c97d54; text-align: center; border-bottom: 2px solid #c97d54; padding-bottom: 10px; margin-top: 0;">☀️ Báo cáo Thực hành Lạc quan ABCDE</h2>' +
    '<p>Xin chào <strong>' + fullName + '</strong>,</p>' +
    '<p>Chúc mừng bạn đã hoàn thành xuất sắc quy trình Socratic ABCDE của Martin Seligman để tự điều chỉnh cảm xúc và tư duy. Dưới đây là bản tổng hợp kết quả thực hành của bạn:</p>' +
    '<p style="font-size: 0.9rem; color: #64748b; margin-bottom: 20px;"><strong>Phiên bản thực hành:</strong> ' + versionText + '</p>' +
    
    '<div style="margin-top: 20px;">' +
    '<div style="background-color: #fff; padding: 15px; border-left: 4px solid #d45d55; margin-bottom: 15px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">' +
    '<strong style="color: #d45d55; font-size: 1.1rem;">A - Nghịch cảnh (Adversity)</strong>' +
    '<p style="margin: 5px 0 0 0; line-height: 1.5;">' + data.A + '</p>' +
    '</div>' +
    
    '<div style="background-color: #fff; padding: 15px; border-left: 4px solid #e2a85c; margin-bottom: 15px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">' +
    '<strong style="color: #e2a85c; font-size: 1.1rem;">B - Niềm tin tự động (Belief)</strong>' +
    '<p style="margin: 5px 0 0 0; line-height: 1.5;">' + data.B + '</p>' +
    '</div>' +
    
    '<div style="background-color: #fff; padding: 15px; border-left: 4px solid #6b9e78; margin-bottom: 15px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">' +
    '<strong style="color: #6b9e78; font-size: 1.1rem;">C - Hệ quả (Consequence)</strong>' +
    '<p style="margin: 5px 0 0 0; line-height: 1.5;">' + data.C + '</p>' +
    '</div>' +
    
    '<div style="background-color: #fff; padding: 15px; border-left: 4px solid #4a90e2; margin-bottom: 15px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">' +
    '<strong style="color: #4a90e2; font-size: 1.1rem;">D - Phản biện (Disputation)</strong>' +
    '<p style="margin: 5px 0 0 0; line-height: 1.5;">' + data.D + '</p>' +
    '</div>' +
    
    '<div style="background-color: #fff; padding: 15px; border-left: 4px solid #9c27b0; margin-bottom: 15px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">' +
    '<strong style="color: #9c27b0; font-size: 1.1rem;">E - Thiết lập Năng lượng (Energization)</strong>' +
    '<p style="margin: 5px 0 0 0; line-height: 1.5;">' + data.E + '</p>' +
    '</div>' +
    '</div>' +
    
    '<p style="margin-top: 20px; font-size: 0.9rem; color: #7f756d; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px;">' +
    'Được phát triển bởi CultureCode Community & Deliver Happiness Masterclass © 2026.' +
    '</p>' +
    '</div>';
    
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}
