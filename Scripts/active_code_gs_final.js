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
var DHM10_REGISTRATION_CAP = 40;
var DEFAULT_INTEREST_URL = 'https://delivering-happiness.vercel.app/interest.html';
var DEFAULT_DH9_INTEREST_URL = 'https://delivering-happiness.vercel.app/interest_dh9.html';
var DEFAULT_DH10_INTEREST_URL = 'https://delivering-happiness.vercel.app/interest_dh10.html';
var CALLBACK_REGEX = /^dh(?:m8|9|10)Jsonp_[A-Za-z0-9]{16,40}$/;
var PROGRAM_INTEREST_CALLBACK_REGEX = /^programInterestJsonp_[A-Za-z0-9]{16,40}$/;
var PROGRAM_INTEREST_SHEET_NAME = 'Program Interest';
var PROGRAM_INTEREST_EVENT_ID = 'PROGRAM_INTEREST_V1';
var PROGRAM_INTEREST_HEADERS = [
  'Timestamp', 'Interest UUID', 'Họ và tên', 'Email', 'Số điện thoại',
  'Công ty', 'Vai trò', 'Khu vực mong muốn', 'Chương trình quan tâm',
  'DHM8', 'DHM9', 'NVC', 'AI', 'DHM kỳ vọng', 'DHM khóa mong muốn',
  'NVC tình huống', 'NVC mối quan hệ', 'NVC kỳ vọng',
  'AI mức độ kinh nghiệm', 'AI nhu cầu ứng dụng', 'AI hình thức mong muốn',
  'Ghi chú', 'Đồng ý liên hệ', 'Source', 'Event ID'
];
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
var DEFAULT_DH10_PUBLIC_REGISTER_URL = 'https://delivering-happiness.vercel.app/register_dhm10.html';
var DEFAULT_DHL_PUBLIC_REGISTER_URL = 'https://delivering-happiness.vercel.app/leadership_rsvp.html';
var DEFAULT_DHM8_ZALO_GROUP_URL = 'https://zalo.me/g/hpf7qu45j6qkft6hpghx';
var DEFAULT_DH9_ZALO_GROUP_URL = 'https://zalo.me/g/3wrsaoygrfcjubr0ie44';
var DEFAULT_DH10_ZALO_GROUP_URL = 'https://zalo.me/g/3wrsaoygrfcjubr0ie44';
var DEFAULT_DHL_ZALO_GROUP_URL = 'https://zalo.me/g/awqtf1ayfblnrwi1y4bq';
var DHL_REGISTRATION_CAP = 25;

function getLaneKey_(value) {
  var normalized = String(value || '').toLowerCase();
  if (normalized === 'dh10' || normalized === 'dhm10') return 'dh10';
  if (normalized === 'dh9' || normalized === 'dhm9') return 'dh9';
  if (normalized === 'dhl' || normalized === 'leadership') return 'dhl';
  return 'dh8';
}

function isDhlToken_(value) {
  var normalized = normalizePaymentCodeToken(value || '');
  return normalized.indexOf('DHL') === 0;
}

function containsDhlToken_(value) {
  var raw = String(value || '').toUpperCase();
  var tokens = raw.split(/[^A-Z0-9]+/)
    .map(function(token) { return normalizePaymentCodeToken(token); })
    .filter(function(token) { return token !== ''; });
  var stripped = normalizePaymentCodeToken(raw);
  if (stripped && tokens.indexOf(stripped) === -1) {
    tokens.push(stripped);
  }
  return tokens.some(function(token) { return isDhlToken_(token); });
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

function isDhm10Token_(value) {
  var normalized = normalizePaymentCodeToken(value || '');
  return normalized.indexOf('DH10') === 0 || normalized.indexOf('DHM10') === 0;
}

function containsDhm10Token_(value) {
  var raw = String(value || '').toUpperCase();
  var tokens = raw.split(/[^A-Z0-9]+/)
    .map(function(token) { return normalizePaymentCodeToken(token); })
    .filter(function(token) { return token !== ''; });
  var stripped = normalizePaymentCodeToken(raw);
  if (stripped && tokens.indexOf(stripped) === -1) {
    tokens.push(stripped);
  }
  return tokens.some(function(token) { return isDhm10Token_(token); });
}

function detectLaneKeyFromPaymentCode_(paymentCode) {
  if (isDhm10Token_(paymentCode)) return 'dh10';
  if (isDhlToken_(paymentCode)) return 'dhl';
  if (isDhm9Token_(paymentCode)) return 'dh9';
  return 'dh8';
}

function detectLaneKeyFromPayload_(data) {
  var laneCandidate = String((data && (data.lane || data.registrationLane || data.eventLane)) || '').toLowerCase();
  if (laneCandidate === 'dh10' || laneCandidate === 'dhm10') return 'dh10';
  if (laneCandidate === 'dh9' || laneCandidate === 'dhm9') return 'dh9';
  if (laneCandidate === 'dhl' || laneCandidate === 'leadership') return 'dhl';
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
  if (eventId.indexOf('DH10') !== -1 || eventId.indexOf('DHM10') !== -1 ||
      type.indexOf('DH10') !== -1 || type.indexOf('DHM10') !== -1 ||
      source.indexOf('DH10') !== -1 || source.indexOf('DHM10') !== -1 ||
      containsDhm10Token_(content)) {
    return 'dh10';
  }
  if (eventId.indexOf('DHL') !== -1 || eventId.indexOf('LEADERSHIP') !== -1 ||
      type.indexOf('DHL') !== -1 || type.indexOf('LEADERSHIP') !== -1 ||
      source.indexOf('DHL') !== -1 || source.indexOf('LEADERSHIP') !== -1 ||
      containsDhlToken_(content)) {
    return 'dhl';
  }
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
  if (resolvedLane === 'dh10') {
    return {
      laneKey: 'dh10',
      paymentPrefix: 'DHM10',
      paymentPrefixes: ['DHM10', 'DH10'],
      registrationCap: parseInt(props.getProperty('DH10_REGISTRATION_CAP'), 10) || DHM10_REGISTRATION_CAP,
      dataSheetName: 'DHM10_Data',
      paymentsSheetName: 'DHM10_Payments',
      outboxSheetName: 'DHM10_Email_Outbox',
      inboxSheetName: 'DHM10_Inbox',
      interestSheetName: 'DHM10 interest',
      interestUrl: (props.getProperty('DH10_INTEREST_URL') || DEFAULT_DH10_INTEREST_URL).trim(),
      publicRegisterUrl: (props.getProperty('DH10_PUBLIC_REGISTER_URL') || DEFAULT_DH10_PUBLIC_REGISTER_URL).trim(),
      titleShort: 'DHM10',
      classLabel: 'Delivering Happiness Masterclass 10 (DHM10)',
      cityLabel: 'Hà Nội & TP.HCM',
      zaloGroupUrl: (props.getProperty('DH10_ZALO_GROUP_URL') || DEFAULT_DH10_ZALO_GROUP_URL).trim(),
      defaultEventId: 'DHM10_REG_2026_HYBRID',
      defaultInterestEventId: 'DHM10_INTEREST',
      defaultLeadType: 'EVENT_LEAD_DHM10',
      defaultLeadSource: 'Web_DHM10_Official',
      defaultInterestType: 'DHM10_INTEREST',
      defaultInterestSource: 'Web_DHM10_Interest'
    };
  }

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

  if (resolvedLane === 'dhl') {
    return {
      laneKey: 'dhl',
      paymentPrefix: 'DHL',
      paymentPrefixes: ['DHL'],
      registrationCap: parseInt(props.getProperty('DHL_REGISTRATION_CAP'), 10) || DHL_REGISTRATION_CAP,
      dataSheetName: 'DHL_Data',
      paymentsSheetName: 'DHL_Payments',
      outboxSheetName: 'DHL_Email_Outbox',
      inboxSheetName: 'DHL_Inbox',
      interestSheetName: 'DHL_Interest',
      interestUrl: '',
      publicRegisterUrl: (props.getProperty('DHL_PUBLIC_REGISTER_URL') || DEFAULT_DHL_PUBLIC_REGISTER_URL).trim(),
      titleShort: 'Leadership Workshop',
      classLabel: 'Team Happiness Starts With Your Leadership',
      cityLabel: 'TP.HCM',
      zaloGroupUrl: (props.getProperty('DHL_ZALO_GROUP_URL') || DEFAULT_DHL_ZALO_GROUP_URL).trim(),
      defaultEventId: 'LEADERSHIP_200926_HCM',
      defaultInterestEventId: 'DHL_INTEREST',
      defaultLeadType: 'EVENT_LEAD_LEADERSHIP',
      defaultLeadSource: 'Web_Leadership_RSVP',
      defaultInterestType: 'DHL_INTEREST',
      defaultInterestSource: 'Web_Leadership_Interest'
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
  var laneKey = ((e && e.parameter && e.parameter.lane) || 'dh8').toString().trim();
  var before = getEmailOutboxSummary_(ss, laneKey);
  processEmailQueue();
  var after = getEmailOutboxSummary_(ss, laneKey);
  return jsonOut({
    success: true,
    lane: laneKey,
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

    if (String(body.type || '').toUpperCase() === 'PROGRAM_INTEREST') {
      return handleProgramInterest_(body);
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

    // --- CỔNG ĐỊNH DANH AUTH GATE (SS, TKI, GTCL) ---
    if (body.action === 'register_or_request_link') {
      return handleAuthGateRegisterOrRequestLink_(body);
    }
    if (body.action === 'verify_token') {
      return handleAuthGateVerifyToken_(body.token, body.email);
    }
    if (body.action === 'sync_survey_completion') {
      return handleAuthGateSyncSurveyCompletion_(body);
    }

    // --- THỰC HÀNH LẠC QUAN ABCDE ---
    if (body.action === 'submit_abcde') {
      return jsonOut(handleAbcdeSubmission(body));
    }

    // --- FORM ĐIỂM DANH ---
    if (body.isCheckin === 'true' || body.isCheckin === true) {
      return handleCheckin(body, detectLaneKeyFromPayload_(body));
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
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  var callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : '';

  // --- CỔNG ĐỊNH DANH AUTH GATE (Xác thực Magic Link qua GET) ---
  if (action === 'verify_token' || (e && e.parameter && e.parameter.token)) {
    var token = ((e && e.parameter && e.parameter.token) || '').trim();
    var email = ((e && e.parameter && e.parameter.email) || '').trim().toLowerCase();
    return handleAuthGateVerifyToken_(token, email);
  }

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

  if (action === 'checkProgramInterestStatus') {
    if (!PROGRAM_INTEREST_CALLBACK_REGEX.test(callback)) {
      return ContentService.createTextOutput('{"error":"INVALID_CALLBACK"}')
        .setMimeType(ContentService.MimeType.JSON);
    }
    var interestStatus = getProgramInterestStatus_(e.parameter.interestUuid || e.parameter.uuid || '');
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(interestStatus) + ');')
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
      'Payment Status','Event ID','Registration UUID','Địa điểm học'
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
        'PENDING', data.event_id || lane.defaultEventId, uuid,
        data.learningLocation || ''
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

function isValidProgramInterestUuid_(value) {
  var uuid = String(value || '').trim();
  return /^[0-9a-f]{32}$/i.test(uuid) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

function sanitizeProgramInterestText_(value, maxLength) {
  var normalized = String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim();
  var limit = Math.max(1, parseInt(maxLength, 10) || 500);
  if (normalized.length > limit) normalized = normalized.slice(0, limit);
  if (/^[=+\-@]/.test(normalized)) normalized = "'" + normalized;
  return normalized;
}

function normalizeProgramInterestPrograms_(value) {
  var raw = Array.isArray(value) ? value : String(value || '').split(',');
  var allowed = ['DHM8', 'DHM9', 'NVC', 'AI', 'PSYCHOLOGICAL_SAFETY', 'CULTURE101'];
  var result = [];
  raw.forEach(function(item) {
    var program = String(item || '').trim().toUpperCase();
    if (allowed.indexOf(program) !== -1 && result.indexOf(program) === -1) {
      result.push(program);
    }
  });
  return result;
}

function formatProgramInterestPrograms_(programs) {
  return programs.map(function(program) {
    if (program === 'PSYCHOLOGICAL_SAFETY') return 'An toàn tâm lý';
    if (program === 'CULTURE101') return 'Culture101';
    return program;
  }).join(', ');
}

function isProgramInterestConsentGranted_(value) {
  if (value === true) return true;
  var normalized = String(value || '').trim().toLowerCase();
  return normalized === 'true' || normalized === 'yes' || normalized === 'on' || normalized === '1';
}

function validateProgramInterestPayload_(data) {
  var uuid = String(data.interestUuid || '').trim();
  var email = String(data.email || '').trim().toLowerCase();
  var phone = String(data.phone || '').trim();
  var programs = normalizeProgramInterestPrograms_(data.interestedPrograms);
  var phoneDigits = phone.replace(/\D/g, '');
  var lengthLimits = {
    fullName: 120,
    email: 254,
    phone: 24,
    company: 160,
    role: 120,
    preferredLocation: 80,
    dhmExpectation: 1000,
    dhmPreferredCohort: 120,
    nvcSituation: 1200,
    nvcRelationship: 500,
    nvcExpectation: 500,
    aiExperienceLevel: 120,
    aiUseCase: 1200,
    aiPreferredFormat: 120,
    note: 1200,
    source: 120
  };

  for (var fieldName in lengthLimits) {
    if (Object.prototype.hasOwnProperty.call(lengthLimits, fieldName) &&
        String(data[fieldName] || '').length > lengthLimits[fieldName]) {
      return { ok: false, error: 'FIELD_TOO_LONG', field: fieldName };
    }
  }

  if (!isValidProgramInterestUuid_(uuid)) return { ok: false, error: 'INVALID_UUID' };
  if (!String(data.fullName || '').trim()) return { ok: false, error: 'MISSING_FULL_NAME' };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'INVALID_EMAIL' };
  }
  if (!/^[0-9+().\s-]{8,24}$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    return { ok: false, error: 'INVALID_PHONE' };
  }
  if (!programs.length) return { ok: false, error: 'MISSING_PROGRAM' };
  if (!isProgramInterestConsentGranted_(data.consent)) {
    return { ok: false, error: 'CONSENT_REQUIRED' };
  }

  if (programs.indexOf('NVC') !== -1 &&
      (!String(data.nvcSituation || '').trim() ||
       !String(data.nvcRelationship || '').trim() ||
       !String(data.nvcExpectation || '').trim())) {
    return { ok: false, error: 'MISSING_NVC_DETAILS' };
  }

  if (programs.indexOf('AI') !== -1 &&
      (!String(data.aiExperienceLevel || '').trim() ||
       !String(data.aiUseCase || '').trim() ||
       !String(data.aiPreferredFormat || '').trim())) {
    return { ok: false, error: 'MISSING_AI_DETAILS' };
  }

  if ((programs.indexOf('DHM8') !== -1 || programs.indexOf('DHM9') !== -1) &&
      (!String(data.dhmExpectation || '').trim() ||
       !String(data.dhmPreferredCohort || '').trim())) {
    return { ok: false, error: 'MISSING_DHM_DETAILS' };
  }

  var dhmCohort = String(data.dhmPreferredCohort || '').trim();
  var allowedDhmCohorts = ['DHM8 TP.HCM', 'DHM9 Hà Nội', 'Chương trình tiếp theo'];
  if (dhmCohort && allowedDhmCohorts.indexOf(dhmCohort) === -1) {
    return { ok: false, error: 'INVALID_DHM_COHORT' };
  }
  if (programs.indexOf('DHM8') !== -1 && programs.indexOf('DHM9') === -1 && dhmCohort === 'DHM9 Hà Nội') {
    return { ok: false, error: 'DHM_COHORT_MISMATCH' };
  }
  if (programs.indexOf('DHM9') !== -1 && programs.indexOf('DHM8') === -1 && dhmCohort === 'DHM8 TP.HCM') {
    return { ok: false, error: 'DHM_COHORT_MISMATCH' };
  }

  return {
    ok: true,
    uuid: uuid,
    email: email,
    phone: phone,
    programs: programs
  };
}

function ensureProgramInterestSheet_(ss) {
  var sheet = ss.getSheetByName(PROGRAM_INTEREST_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PROGRAM_INTEREST_SHEET_NAME);
    sheet.appendRow(PROGRAM_INTEREST_HEADERS);
    sheet.getRange('1:1').setFontWeight('bold').setBackground('#dbeafe');
    sheet.setFrozenRows(1);
    return sheet;
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PROGRAM_INTEREST_HEADERS);
    sheet.getRange('1:1').setFontWeight('bold').setBackground('#dbeafe');
    sheet.setFrozenRows(1);
    return sheet;
  }

  var existingHeaders = sheet.getRange(1, 1, 1, PROGRAM_INTEREST_HEADERS.length).getValues()[0];
  for (var i = 0; i < PROGRAM_INTEREST_HEADERS.length; i++) {
    if (String(existingHeaders[i] || '').trim() !== PROGRAM_INTEREST_HEADERS[i]) {
      throw new Error('PROGRAM_INTEREST_SCHEMA_MISMATCH');
    }
  }
  return sheet;
}

function handleProgramInterest_(data) {
  var validation = validateProgramInterestPayload_(data || {});
  if (!validation.ok) return jsonOut({ success: false, state: 'error', error: validation.error });

  var ss = getSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var isDuplicate = false;

  try {
    var sheet = ensureProgramInterestSheet_(ss);
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var existingUuids = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingUuids.length; i++) {
        if (String(existingUuids[i][0] || '').trim() === validation.uuid) {
          isDuplicate = true;
          break;
        }
      }
    }

    if (!isDuplicate) {
      var programs = validation.programs;
      sheet.appendRow([
        new Date(),
        validation.uuid,
        sanitizeProgramInterestText_(data.fullName, 120),
        sanitizeProgramInterestText_(validation.email, 254),
        sanitizeProgramInterestText_(validation.phone, 24),
        sanitizeProgramInterestText_(data.company, 160),
        sanitizeProgramInterestText_(data.role, 120),
        sanitizeProgramInterestText_(data.preferredLocation, 80),
        formatProgramInterestPrograms_(programs),
        programs.indexOf('DHM8') !== -1 ? 'TRUE' : 'FALSE',
        programs.indexOf('DHM9') !== -1 ? 'TRUE' : 'FALSE',
        programs.indexOf('NVC') !== -1 ? 'TRUE' : 'FALSE',
        programs.indexOf('AI') !== -1 ? 'TRUE' : 'FALSE',
        sanitizeProgramInterestText_(data.dhmExpectation, 1000),
        sanitizeProgramInterestText_(data.dhmPreferredCohort, 120),
        sanitizeProgramInterestText_(data.nvcSituation, 1200),
        sanitizeProgramInterestText_(data.nvcRelationship, 500),
        sanitizeProgramInterestText_(data.nvcExpectation, 500),
        sanitizeProgramInterestText_(data.aiExperienceLevel, 120),
        sanitizeProgramInterestText_(data.aiUseCase, 1200),
        sanitizeProgramInterestText_(data.aiPreferredFormat, 120),
        sanitizeProgramInterestText_(data.note, 1200),
        'TRUE',
        'Web_Program_Interest',
        PROGRAM_INTEREST_EVENT_ID
      ]);
    }
  } finally {
    lock.releaseLock();
  }

  writeSystemLog(
    ss,
    'INFO',
    isDuplicate ? 'Duplicate program interest' : 'Program interest saved',
    validation.uuid
  );
  return jsonOut({
    success: true,
    state: 'recorded',
    interestUuid: validation.uuid,
    duplicate: isDuplicate
  });
}

function getProgramInterestStatus_(interestUuid) {
  var uuid = String(interestUuid || '').trim();
  if (!isValidProgramInterestUuid_(uuid)) {
    return { success: false, state: 'error', error: 'INVALID_UUID' };
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(PROGRAM_INTEREST_SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) {
    return { success: true, state: 'not_found', interestUuid: uuid };
  }

  var existingUuids = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < existingUuids.length; i++) {
    if (String(existingUuids[i][0] || '').trim() === uuid) {
      return { success: true, state: 'recorded', interestUuid: uuid };
    }
  }
  return { success: true, state: 'not_found', interestUuid: uuid };
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
    var btcSubject = lane.laneKey === 'dhl'
      ? '[CultureCode] Thông báo BTC: Học viên hoàn tất nộp phí catering - Leadership Workshop (20/09)'
      : ('Thanh toán xác nhận - ' + lane.titleShort);
    enqueueEmail(ss, m.uuid, PAYMENT_BTC_EMAIL_TYPE, paymentRecipients.join(','), btcSubject, lane.laneKey);
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
  processEmailQueueForLane_('dhl');
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
        data.learningLocation = rows[i][18] || '';
        data.paymentCode = getPaymentCodeInfo_(data.phone, regUuid, lane.laneKey).paymentCode;
        break;
      }
    }
  }
  return data;
}

function renderEmailShell_(title, preheader, bodyHtml) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>' +
    'body { font-family: "Segoe UI", Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #eae6df; } ' +
    '.container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; border: 1px solid #d1c9bd; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); } ' +
    '.header { background-color: #1a1a1a; padding: 35px 25px; text-align: center; color: #ffffff; } ' +
    '.header img { width: 120px; height: auto; display: block; margin: 0 auto; border-radius: 8px; } ' +
    '.header h1 { margin: 15px 0 0 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; } ' +
    '.header p { margin: 8px 0 0 0; opacity: 0.8; font-size: 13px; font-weight: 500; line-height: 1.5; color: #aaaaaa; } ' +
    '.content { padding: 35px 30px; background-color: #ffffff; } ' +
    '.greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1a1a1a; } ' +
    '.paragraph { margin-bottom: 15px; text-align: justify; font-size: 14.5px; color: #444444; } ' +
    '.event-box { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0; position: relative; } ' +
    '.event-badge { display: inline-block; font-size: 10px; font-weight: bold; text-transform: uppercase; background-color: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; margin-bottom: 10px; } ' +
    '.event-title { font-size: 18px; font-weight: bold; color: #1d4ed8; margin: 0 0 10px 0; } ' +
    '.event-detail { font-size: 14px; margin: 6px 0; color: #374151; } ' +
    '.event-detail strong { color: #111827; } ' +
    '.event-link { display: inline-block; margin-top: 12px; color: #1d4ed8; font-weight: bold; text-decoration: underline; font-size: 13.5px; } ' +
    '.footer { background-color: #ffffff; padding: 25px 30px; border-top: 1px solid #f3f4f6; } ' +
    '.footer-table { width: 100%; border-collapse: collapse; } ' +
    '.footer-left { text-align: left; vertical-align: top; } ' +
    '.footer-right { text-align: right; vertical-align: top; width: 100px; } ' +
    '.footer-logo { width: 90px; height: auto; display: block; margin-left: auto; border-radius: 4px; } ' +
    '.closing { font-size: 14.5px; font-weight: bold; color: #1a1a1a; margin: 0; } ' +
    '.team-name { font-size: 14.5px; font-weight: bold; color: #1a1a1a; margin: 4px 0 0 0; } ' +
    '.box { background:#f8fafc; border:1px solid #e5e7eb; border-radius:10px; padding:16px; margin:16px 0; } ' +
    '.success { background:#ecfdf5; border-color:#a7f3d0; } ' +
    '.warning { background:#fffbeb; border-color:#fde68a; } ' +
    '.code { font-family:Consolas,monospace; font-weight:700; background:#e5e7eb; border-radius:6px; padding:3px 7px; color:#b91c1c; } ' +
    '.btn { display:inline-block; background:#0068ff; color:#fff!important; text-decoration:none; font-weight:700; border-radius:9px; padding:12px 18px; }' +
    '</style></head><body>' +
    '<div class="container">' +
      '<div class="header">' +
        '<img src="https://delivering-happiness.vercel.app/assets/culturecode-logo-dark.jpg" alt="CultureCode Logo" width="120" style="width: 120px !important; max-width: 120px !important; height: auto !important; display: block; margin: 0 auto; border-radius: 8px;" />' +
        '<h1>' + escapeHtml_(title) + '</h1>' +
        '<p>' + escapeHtml_(preheader) + '</p>' +
      '</div>' +
      '<div class="content">' + bodyHtml + '</div>' +
      '<div class="footer" style="background-color: #ffffff; padding: 25px 30px; border-top: 1px solid #f3f4f6;">' +
        '<table class="footer-table" style="width: 100%; border-collapse: collapse;"><tr>' +
          '<td class="footer-left" style="text-align: left; vertical-align: top;">' +
            '<p class="closing" style="margin: 0; color: #4b5563; font-size: 14px;">Trân trọng,</p>' +
            '<p class="team-name" style="margin: 4px 0 8px 0; font-size: 15px; font-weight: bold; color: #1a1a1a;">CultureCode Team</p>' +
            '<p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6b7280;">' +
              '🌐 Website: <a href="https://delivering-happiness.vercel.app" target="_blank" style="color: #0f766e; text-decoration: none; font-weight: 500;">delivering-happiness.vercel.app</a><br>' +
              '🔗 LinkedIn: <a href="https://www.linkedin.com/company/culturecodecommunity" target="_blank" style="color: #0f766e; text-decoration: none; font-weight: 500;">CultureCode Community</a>' +
            '</p>' +
          '</td>' +
          '<td class="footer-right" style="text-align: right; vertical-align: top; width: 100px;">' +
            '<img src="https://delivering-happiness.vercel.app/assets/culturecode-logo-light.jpg" alt="CultureCode Logo" width="90" style="width: 90px !important; max-width: 90px !important; height: auto !important; display: block; margin-left: auto; border-radius: 4px;" class="footer-logo" />' +
          '</td>' +
        '</tr></table>' +
      '</div>' +
    '</div></body></html>';
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

  if (emailType === 'CHECKIN') {
    var checkinUrl = 'https://delivering-happiness.vercel.app/checkin.html?email=' + encodeURIComponent(data.email) + '&name=' + encodeURIComponent(name);
    return renderEmailShell_(
      lane.titleShort + ' - Check-in & Cập nhật thông tin',
      'Chuẩn bị cho ' + lane.titleShort,
      '<div class="greeting">Thân gửi Anh/Chị ' + name + ',</div>' +
      '<p class="paragraph">Chỉ còn chút thời gian nữa là sự kiện ' + escapeHtml_(lane.titleShort) + ' sẽ chính thức diễn ra. Để quá trình đón tiếp và nhận tài liệu tại Lễ tân được nhanh chóng, Anh/Chị vui lòng dành 1 phút để hoàn tất thông tin Check-in cá nhân hóa tại đường link dưới đây:</p>' +
      '<p><a class="btn" href="' + checkinUrl + '" target="_blank">Hoàn tất Check-in & Nhận tài liệu</a></p>' +
      '<div class="event-box" style="margin-top: 25px;"><div class="event-title">📌 Lưu ý:</div><div class="event-detail">Những thông tin này rất quan trọng để CultureCode Team hiểu rõ kỳ vọng của Anh/Chị và chuẩn bị tài liệu học tập phù hợp nhất.</div></div>'
    );
  }

  if (emailType === 'PENDING') {
    return renderEmailShell_(
      lane.titleShort + ' - Xác nhận đăng ký',
      'CultureCode Team đã nhận được thông tin đăng ký của Anh/Chị',
      '<div class="greeting">Thân gửi Anh/Chị ' + name + ',</div>' +
      '<p class="paragraph">CultureCode Team đã nhận được thông tin đăng ký ' + escapeHtml_(lane.classLabel) + ' của Anh/Chị.</p>' +
      '<div class="event-box" style="background-color: #fffbeb; border-color: #fde68a;"><div class="event-title" style="color: #b45309;">Bước tiếp theo:</div><div class="event-detail">Vui lòng hoàn tất chi phí hậu cần theo thông tin dưới đây.</div></div>' +
      '<div class="event-box" style="background-color: #f8fafc; border-color: #e5e7eb;">' +
      '<div class="event-detail"><strong>Số tiền:</strong> ' + paymentAmountLabel + '</div>' +
      '<div class="event-detail"><strong>Đích nhận tiền:</strong> ' + paymentAccountLabel + '</div>' +
      '<div class="event-detail"><strong>Nội dung chuyển khoản:</strong> <span class="code">' + paymentCode + '</span></div>' +
      '</div>' +
      (paymentQrUrl
        ? '<div style="text-align:center; margin:20px 0;">' +
          '<img src="' + paymentQrUrl + '" alt="QR thanh toán ' + escapeHtml_(lane.titleShort) + '" width="260" style="display:block; width:100%; max-width:260px !important; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;">' +
          '</div>'
        : '') +
      '<p><a class="btn" href="' + paymentResumeUrl + '" target="_blank">Mở lại trang thanh toán</a></p>' +
      '<p style="font-size:13px; color:#6b7280; font-style: italic;">Anh/Chị có thể mở link này trên thiết bị khác để xem lại QR và trạng thái thanh toán.</p>' +
      '<p class="paragraph">Sau khi hệ thống ghi nhận thanh toán, Anh/Chị sẽ nhận email xác nhận giữ chỗ chính thức và link tham gia nhóm Zalo lớp ' + escapeHtml_(lane.titleShort) + ' ' + escapeHtml_(lane.cityLabel) + '.</p>'
    );
  }
  if (emailType === 'PAID') {
    return renderEmailShell_(
      lane.titleShort + ' - Đã xác nhận thanh toán',
      'Hệ thống đã ghi nhận thanh toán chi phí hậu cần của Anh/Chị',
      '<div class="greeting">Thân gửi Anh/Chị ' + name + ',</div>' +
      '<div class="box success"><strong>Chúc mừng Anh/Chị!</strong><br>Hệ thống đã ghi nhận thanh toán chi phí hậu cần thành công. Suất tham dự ' + escapeHtml_(lane.titleShort) + ' của Anh/Chị đã được xác nhận chính thức.</div>' +
      '<p class="paragraph">Anh/Chị vui lòng tham gia nhóm Zalo ' + escapeHtml_(lane.titleShort) + ' ' + escapeHtml_(lane.cityLabel) + ' để nhận thông báo từ CultureCode Team, cập nhật thông tin lớp học và kết nối với cộng đồng học viên:</p>' +
      '<p><a class="btn" href="' + escapeHtml_(lane.zaloGroupUrl) + '" target="_blank">Vào nhóm Zalo ' + escapeHtml_(lane.titleShort) + ' ' + escapeHtml_(lane.cityLabel) + '</a></p>' +
      '<div class="box"><strong>Lưu ý nhanh:</strong><br>CultureCode Team sẽ tiếp tục gửi thông tin check-in, địa điểm và chuẩn bị trước sự kiện qua email này và nhóm Zalo.</div>'
    );
  }
  if (emailType === 'BTC' || emailType === 'BTC_PAID') {
    var isPaidNotice = emailType === 'BTC_PAID';
    var dataSheet = ss.getSheetByName(lane.dataSheetName);
    var paidCount = getRegistrationPaidCount_(dataSheet);

    if (lane.laneKey === 'dhl') {
      var dhlTitle = isPaidNotice
        ? 'Leadership Workshop - Thông báo nộp phí catering'
        : 'Leadership Workshop - Thông báo đăng ký mới';
      var dhlPreheader = isPaidNotice
        ? 'Học viên ' + name + ' đã hoàn tất nộp phí catering'
        : 'Có học viên vừa xác nhận thông tin tham dự';

      var dhlBody =
        '<div class="greeting">Kính gửi Ban Tổ Chức,</div>' +
        '<div class="badge-congrats" style="display:inline-block; background-color:' + (isPaidNotice ? '#dcfce7' : '#fef3c7') + '; color:' + (isPaidNotice ? '#166534' : '#92400e') + '; border:1px solid ' + (isPaidNotice ? '#bbf7d0' : '#fde68a') + '; padding:6px 12px; border-radius:6px; font-size:13px; font-weight:700; margin-bottom:18px; text-transform:uppercase;">' +
        (isPaidNotice ? '✓ Học viên đã hoàn tất nộp phí catering Leadership' : '📌 Học viên đã xác nhận tham dự (Chờ thanh toán)') +
        '</div>' +
        '<div class="event-box" style="background-color:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:20px; margin:20px 0;">' +
        '<div class="event-title" style="font-size:16px; font-weight:bold; color:#1d4ed8; margin-bottom:10px;">📋 Chi tiết thông tin học viên:</div>' +
        '<div class="event-detail"><strong>Họ và tên:</strong> ' + name + '</div>' +
        '<div class="event-detail"><strong>Số điện thoại:</strong> ' + escapeHtml_(data.phone) + '</div>' +
        '<div class="event-detail"><strong>Email:</strong> ' + escapeHtml_(data.email) + '</div>' +
        (data.company ? '<div class="event-detail"><strong>Đơn vị / Công ty:</strong> ' + escapeHtml_(data.company) + '</div>' : '') +
        '<div class="event-detail"><strong>Khoản thu:</strong> Phí in ấn tài liệu & catering: <strong>250,000 VNĐ</strong></div>' +
        '<div class="event-detail"><strong>Mã chuyển khoản:</strong> <span style="font-family:monospace; font-weight:bold; color:#0f766e; background:#f0fdf4; padding:2px 6px; border-radius:4px;">' + paymentCode + '</span></div>' +
        '<div class="event-detail"><strong>Trạng thái:</strong> ' + (isPaidNotice ? '<span style="color:#16a34a; font-weight:bold;">PAID (Đã khớp lệnh SePay)</span>' : '<span style="color:#d97706; font-weight:bold;">PENDING (Đang chờ thanh toán)</span>') + '</div>' +
        '</div>' +
        '<div class="event-box" style="background-color:#fefce8; border:1px solid #fef08a; border-radius:8px; padding:15px 20px; margin:15px 0;">' +
        '<div style="font-size:14px; color:#854d0e;">' +
        '📊 <strong>Tiến độ nộp phí catering:</strong> Đã có <strong>' + paidCount + ' / 22</strong> học viên chính thức hoàn thành nộp phí cho khóa <strong>Leadership (20/09/2026)</strong>.' +
        '</div>' +
        '</div>' +
        '<p class="paragraph" style="font-size:13.5px; color:#6b7280; font-style:italic; margin-top:15px;">Email này được gửi tự động từ hệ thống Delivering Happiness khi có cập nhật trạng thái từ học viên.</p>';

      return renderEmailShell_(dhlTitle, dhlPreheader, dhlBody);
    }

    return renderEmailShell_(
      lane.titleShort + ' - Thông báo nội bộ BTC',
      isPaidNotice ? 'Có học viên vừa hoàn tất thanh toán' : 'Có hoạt động mới liên quan đến đăng ký',
      '<p><strong>UUID:</strong> ' + escapeHtml_(regUuid) + '</p>' +
      '<p><strong>Họ tên:</strong> ' + name + '</p>' +
      '<p><strong>SĐT:</strong> ' + escapeHtml_(data.phone) + '</p>' +
      '<p><strong>Email:</strong> ' + escapeHtml_(data.email) + '</p>' +
      '<p><strong>Trạng thái thanh toán:</strong> ' + escapeHtml_(data.paymentStatus) + '</p>' +
      (isPaidNotice ? '<p><strong>Sự kiện:</strong> Học viên đã hoàn tất thanh toán.</p>' : '') +
      '<p>Tổng số lượng học viên hoàn thành thanh toán của ' + escapeHtml_(lane.titleShort) + ' là ' + paidCount + ' người.</p>'
    );
  }
  return '<p>Email notification - ' + escapeHtml_(lane.titleShort) + '</p>';
}

// ─── HELPER ──────────────────────────────────────────────────
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── CHECKIN SERVICES ────────────────────────────────────────
function handleCheckin(data, laneKey) {
  var lane = getLaneConfig_(laneKey);
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(lane.dataSheetName);
  if (!sheet) return jsonOut({ success: false, error: 'SHEET_NOT_FOUND' });

  var email = (data.email || '').toString().trim().toLowerCase();
  if (!email) return jsonOut({ success: false, error: 'MISSING_EMAIL' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var dataRows = sheet.getDataRange().getValues();
    var rowIndex = -1;
    for (var i = 1; i < dataRows.length; i++) {
      if (String(dataRows[i][2]).trim().toLowerCase() === email) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      return jsonOut({ success: false, error: 'EMAIL_NOT_FOUND' });
    }

    if (data.linkedin) sheet.getRange(rowIndex, 5).setValue(data.linkedin);
    if (data.company) sheet.getRange(rowIndex, 6).setValue(data.company);
    if (data.jobTitle) sheet.getRange(rowIndex, 7).setValue(data.jobTitle);
    if (data.companySize) sheet.getRange(rowIndex, 8).setValue(data.companySize);
    if (data.sourceHearing) sheet.getRange(rowIndex, 9).setValue(data.sourceHearing);
    if (data.attendedPrograms) sheet.getRange(rowIndex, 10).setValue(data.attendedPrograms);
    if (data.purpose) sheet.getRange(rowIndex, 11).setValue(data.purpose);
    if (data.happinessKnowledge) sheet.getRange(rowIndex, 12).setValue(data.happinessKnowledge);
    if (data.expectations) sheet.getRange(rowIndex, 13).setValue(data.expectations);

    return jsonOut({ success: true, message: 'CHECKIN_SUCCESS' });
  } finally {
    lock.releaseLock();
  }
}

function sendPersonalizedEmails(laneKey) {
  var lane = getLaneConfig_(laneKey || 'dh8');
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(lane.dataSheetName);
  if (!sheet) return 'Sheet not found';
  
  var dataRows = sheet.getDataRange().getValues();
  var count = 0;
  for (var i = 1; i < dataRows.length; i++) {
    var email = String(dataRows[i][2]).trim();
    var status = String(dataRows[i][15]).trim().toUpperCase(); 
    var uuid = String(dataRows[i][17]).trim(); 
    
    if (email && status === 'PAID') {
      enqueueEmail(ss, uuid, 'CHECKIN', email, 'Thông tin Check-in ' + lane.titleShort + ' (Vui lòng điền trước sự kiện)', lane.laneKey);
      count++;
    }
  }
  return 'Đã đưa ' + count + ' email check-in vào hàng đợi.';
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
  
  // [YC-1 DISABLED 2026-07-17] Schwartz đã được thay thế bằng Ý Nghĩa La Bàn trong email
  // var dimensions = calculateSchwartzDimensions(parsedRanked);
  // var dimensionsHtml = '<div ...>...</div>';

  // [YC-1 MỚI] Ý Nghĩa La Bàn Giá Trị — thay thế Schwartz
  var explanationHtml =
    '<div style="background-color: #ffffff; border: 1px solid #f3f3f3; border-radius: 12px; padding: 20px; margin-top: 25px; text-align: left; font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">' +
    '<h3 style="color: #ea580c; margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: bold;">💡 Ý Nghĩa La Bàn Giá Trị Của Bạn</h3>' +
    '<p style="margin-bottom: 15px;">Chúc mừng bạn đã hoàn thành cuộc đối thoại nội tâm sâu sắc. La bàn giá trị này định hình cuộc sống của bạn dựa trên các nguyên lý cốt lõi của Delivering Happiness:</p>' +
    '<ul style="padding-left: 20px; margin: 0;">' +
    '<li style="margin-bottom: 10px;"><strong>Con người thật vs. Giá trị tuyên bố:</strong> Bài test đối kháng bắt buộc bạn phải đưa ra lựa chọn thực tế thay vì những &ldquo;giá trị tuyên bố&rdquo; lý thuyết. Hãy nhớ công thức: <em>La bàn (Định hướng) + Đồng hồ (Thời gian) = Giá trị thực tế của bạn</em>. Thừa nhận giá trị thật giúp bạn cởi bỏ áp lực phải gồng mình diễn vai hoàn hảo.</li>' +
    '<li style="margin-bottom: 10px;"><strong>Thời khắc quyết định (Critical Decision Moments):</strong> 21 trận đối kháng bạn vừa vượt qua chính là mô phỏng những tình huống giằng xé trong cuộc sống. Bản chất thực sự của chúng ta không bộc lộ qua lời nói lúc bình yên, mà phát lộ rõ ràng nhất khi ta buộc phải hy sinh điều này để giữ lại điều quan trọng hơn.</li>' +
    '<li style="margin-bottom: 10px;"><strong>Sự đồng bộ (Alignment) &amp; Cảm giác thuộc về chân thật:</strong> Thấu hiểu giá trị bản thân giúp bạn dễ dàng tìm kiếm điểm giao thoa (alignment) với giá trị của gia đình, tổ chức hay cộng đồng để làm việc an vui và đạt được cảm giác thuộc về chân thật (True Belonging).</li>' +
    '</ul>' +
    '</div>';

  var htmlBody = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid rgba(0,0,0,0.06); border-radius: 16px; background-color: #ffffff; color: #1c1917;">' +
    '<div style="text-align: center; margin-bottom: 20px;">' +
    '<h2 style="color: #ea580c; margin-bottom: 5px; font-weight: bold;">DNA GIÁ TRỊ CỐT LÕI CỦA BẠN</h2>' +
    '<p style="color: #78716c; font-size: 0.95rem; margin-top: 0;">Chào <strong>' + fullName + '</strong>, dưới đây là kết quả phân tích La bàn Giá trị của riêng bạn.</p>' +
    '</div>' +
    
    explanationHtml +
    
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

function testSendCheckinEmailToLastRow() {
  var laneKey = 'dh8';
  var lane = getLaneConfig_(laneKey);
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(lane.dataSheetName);
  var dataRows = sheet.getDataRange().getValues();
  
  if (dataRows.length <= 1) return 'Không có dữ liệu học viên để test';
  
  var lastRow = dataRows[dataRows.length - 1];
  var email = String(lastRow[2]).trim();
  var uuid = String(lastRow[17]).trim();
  
  if (!email || !uuid) return 'Dòng cuối thiếu email hoặc uuid, không thể test.';
  
  enqueueEmail(ss, uuid, 'CHECKIN', email, '[TEST] Thông tin Check-in ' + lane.titleShort, laneKey);
  return 'Đã đưa email check-in của dòng cuối (' + email + ') vào hàng đợi test. Vui lòng chờ 1 phút hoặc chạy thủ công processEmailQueue để xem kết quả.';
}

// ==============================================================================
// ─── CỔNG ĐĂNG NHẬP & KÍCH HOẠT EMAIL (AUTH GATE: SS, TKI, GTCL) ──────────────
// ==============================================================================

var AUTH_GATE_CONFIG = {
  APP_NAME: "Delivering Happiness Assessment Gate",
  SHEET_LEADS: "Leads_Directory",
  SHEET_TOKENS: "Activation_Tokens",
  SHEET_LOGS: "Activation_Logs",
  TOKEN_EXPIRATION_MS: 60 * 60 * 1000, // 1 giờ
  RATE_LIMIT_COOLDOWN_MS: 60 * 1000,
  SURVEY_CONFIG: {
    "SS": {
      id: "SS",
      name: "Khảo sát Phong cách Xã hội (Social Styles)",
      url: "https://khao-sat-tinh-cach.vercel.app"
    },
    "TKI": {
      id: "TKI",
      name: "Khảo sát Xử lý Xung đột (Thomas-Kilmann)",
      url: "https://khao-sat-xung-dot-tki.vercel.app"
    },
    "GTCL": {
      id: "GTCL",
      name: "La bàn Giá trị Cốt lõi Cá nhân (Core Values Compass)",
      url: "https://delivering-happiness.vercel.app/personal-value.html"
    },
    "LMS_TRIAL": {
      id: "LMS_TRIAL",
      name: "Trải nghiệm Học thử Chặng 1 - Delivering Happiness LMS",
      url: "https://delivering-happiness.vercel.app/lms/"
    }
  }
};

/**
 * Đảm bảo 3 bảng dữ liệu của Auth Gate tồn tại trong Spreadsheet hiện tại
 * Tuyệt đối không can thiệp hay xóa các sheet nghiệp vụ hiện hữu
 */
function ensureAuthGateTables_(ss) {
  ss = ss || getSpreadsheet();

  // 1. Leads_Directory
  var leadsSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_LEADS);
  if (!leadsSheet) {
    leadsSheet = ss.insertSheet(AUTH_GATE_CONFIG.SHEET_LEADS);
    leadsSheet.appendRow([
      "lead_id", "full_name", "phone", "email", "status",
      "registered_at", "verified_at", "first_touch_survey",
      "ss_completed", "tki_completed", "gtcl_completed"
    ]);
    leadsSheet.setFrozenRows(1);
    leadsSheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#F3F4F6");
  }

  // 2. Activation_Tokens
  var tokensSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_TOKENS);
  if (!tokensSheet) {
    tokensSheet = ss.insertSheet(AUTH_GATE_CONFIG.SHEET_TOKENS);
    tokensSheet.appendRow([
      "token", "email", "target_survey", "created_at",
      "expires_at", "is_used", "used_at"
    ]);
    tokensSheet.setFrozenRows(1);
    tokensSheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#F3F4F6");
  }

  // 3. Activation_Logs
  var logsSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_LOGS);
  if (!logsSheet) {
    logsSheet = ss.insertSheet(AUTH_GATE_CONFIG.SHEET_LOGS);
    logsSheet.appendRow([
      "log_id", "timestamp", "event_type", "email", "survey_type", "details"
    ]);
    logsSheet.setFrozenRows(1);
    logsSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#F3F4F6");
  }

  return { leadsSheet: leadsSheet, tokensSheet: tokensSheet, logsSheet: logsSheet };
}

/**
 * Tiếp nhận đăng ký hoặc yêu cầu gửi liên kết Magic Link kích hoạt
 */
function handleAuthGateRegisterOrRequestLink_(payload) {
  try {
    var email = (payload.email || '').trim().toLowerCase();
    var fullName = (payload.full_name || '').trim();
    var phone = (payload.phone || '').trim();
    var surveyType = (payload.survey_type || 'SS').trim().toUpperCase();

    if (!email || email.indexOf('@') === -1) {
      return jsonOut({ success: false, error: 'INVALID_EMAIL', message: 'Email không hợp lệ.' });
    }

    var ss = getSpreadsheet();
    ensureAuthGateTables_(ss);

    // Kiểm tra Rate limit 60s
    var rateLimit = checkAuthGateRateLimit_(ss, email);
    if (!rateLimit.allowed) {
      logAuthGateActivity_(ss, 'RATE_LIMIT_BLOCKED', email, surveyType, 'Thử lại sau ' + rateLimit.remainingSeconds + 's');
      return jsonOut({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Vui lòng chờ ' + rateLimit.remainingSeconds + ' giây trước khi gửi lại yêu cầu.',
        retry_after_seconds: rateLimit.remainingSeconds
      });
    }

    var leadsSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_LEADS);
    var leadsData = leadsSheet.getDataRange().getValues();
    var now = new Date();
    var targetRow = -1;
    var leadId = '';

    for (var i = 1; i < leadsData.length; i++) {
      if (leadsData[i][3] && String(leadsData[i][3]).toLowerCase().trim() === email) {
        targetRow = i + 1;
        leadId = leadsData[i][0];
        break;
      }
    }

    if (targetRow === -1) {
      leadId = 'LEAD_' + Utilities.formatDate(now, 'GMT+7', 'yyyyMMdd_HHmmss') + '_' + Math.floor(100 + Math.random() * 900);
      leadsSheet.appendRow([
        leadId,
        fullName || 'Học viên',
        phone || '',
        email,
        'pending_activation',
        now.toISOString(),
        '',
        surveyType,
        'FALSE',
        'FALSE',
        'FALSE'
      ]);
      logAuthGateActivity_(ss, 'LEAD_REGISTERED', email, surveyType, 'Đăng ký mới: ' + fullName);
    } else {
      if (fullName) leadsSheet.getRange(targetRow, 2).setValue(fullName);
      if (phone) leadsSheet.getRange(targetRow, 3).setValue(phone);
      logAuthGateActivity_(ss, 'LEAD_UPDATED', email, surveyType, 'Yêu cầu liên kết lại');
    }

    // Sinh Token 32 ký tự hex
    var token = generateAuthGateHexToken_(32);
    var expiresAt = new Date(now.getTime() + AUTH_GATE_CONFIG.TOKEN_EXPIRATION_MS);

    var tokensSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_TOKENS);
    tokensSheet.appendRow([
      token,
      email,
      surveyType,
      now.toISOString(),
      expiresAt.toISOString(),
      false,
      ''
    ]);

    var surveyInfo = AUTH_GATE_CONFIG.SURVEY_CONFIG[surveyType] || AUTH_GATE_CONFIG.SURVEY_CONFIG['SS'];
    var sep = surveyInfo.url.indexOf('?') === -1 ? '?' : '&';
    var activationUrl = surveyInfo.url + sep + 'token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email) + '&action=verify';

    // Gửi email kích hoạt
    var emailResult = sendAuthGateActivationEmail_({
      toEmail: email,
      fullName: fullName || 'Học viên',
      surveyName: surveyInfo.name,
      activationUrl: activationUrl,
      expirationMinutes: 60
    });

    if (!emailResult.success) {
      logAuthGateActivity_(ss, 'EMAIL_SEND_FAILED', email, surveyType, emailResult.error);
      return jsonOut({
        success: false,
        error: 'EMAIL_SEND_FAILED',
        message: 'Lỗi khi gửi email kích hoạt: ' + emailResult.error
      });
    }

    logAuthGateActivity_(ss, 'TOKEN_SENT', email, surveyType, 'Đã gửi token kích hoạt qua email');

    return jsonOut({
      success: true,
      message: 'Liên kết kích hoạt đã được gửi đến email của bạn. Vui lòng kiểm tra hòm thư (kể cả mục Spam).',
      email: email,
      cooldown_seconds: 60
    });

  } catch (err) {
    return jsonOut({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
}

/**
 * Xác thực mã Token kích hoạt qua GET hoặc POST
 */
function handleAuthGateVerifyToken_(token, email) {
  try {
    if (!token) {
      return jsonOut({ success: false, verified: false, error: 'MISSING_TOKEN', message: 'Thiếu mã token xác thực.' });
    }

    var ss = getSpreadsheet();
    ensureAuthGateTables_(ss);

    var tokensSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_TOKENS);
    var tokensData = tokensSheet.getDataRange().getValues();
    var now = new Date();
    var foundIndex = -1;
    var tokenRecord = null;

    for (var i = 1; i < tokensData.length; i++) {
      var rowToken = String(tokensData[i][0]).trim();
      if (rowToken === token) {
        foundIndex = i + 1;
        tokenRecord = {
          token: rowToken,
          email: String(tokensData[i][1]).toLowerCase().trim(),
          targetSurvey: tokensData[i][2],
          createdAt: new Date(tokensData[i][3]),
          expiresAt: new Date(tokensData[i][4]),
          isUsed: tokensData[i][5] === true || String(tokensData[i][5]).toLowerCase() === 'true',
          usedAt: tokensData[i][6]
        };
        break;
      }
    }

    if (!tokenRecord) {
      logAuthGateActivity_(ss, 'VERIFY_FAIL_NOT_FOUND', email, '', 'Token không tồn tại');
      return jsonOut({ success: false, verified: false, error: 'TOKEN_NOT_FOUND', message: 'Mã xác thực không tồn tại.' });
    }

    if (tokenRecord.isUsed) {
      logAuthGateActivity_(ss, 'VERIFY_FAIL_ALREADY_USED', tokenRecord.email, tokenRecord.targetSurvey, 'Token đã sử dụng');
      return jsonOut({ success: false, verified: false, error: 'TOKEN_ALREADY_USED', message: 'Mã xác thực này đã được sử dụng trước đó.' });
    }

    if (now.getTime() > tokenRecord.expiresAt.getTime()) {
      logAuthGateActivity_(ss, 'VERIFY_FAIL_EXPIRED', tokenRecord.email, tokenRecord.targetSurvey, 'Token đã hết hạn 1h');
      return jsonOut({ success: false, verified: false, error: 'TOKEN_EXPIRED', message: 'Liên kết kích hoạt đã hết hạn (hiệu lực 1 giờ). Vui lòng yêu cầu gửi lại.' });
    }

    if (email && email.toLowerCase() !== tokenRecord.email) {
      logAuthGateActivity_(ss, 'VERIFY_FAIL_EMAIL_MISMATCH', email, tokenRecord.targetSurvey, 'Mismatch với ' + tokenRecord.email);
      return jsonOut({ success: false, verified: false, error: 'EMAIL_MISMATCH', message: 'Địa chỉ email không khớp với mã xác thực.' });
    }

    // Đánh dấu token đã sử dụng
    tokensSheet.getRange(foundIndex, 6).setValue(true);
    tokensSheet.getRange(foundIndex, 7).setValue(now.toISOString());

    // Cập nhật trạng thái verified trong Leads_Directory
    var leadsSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_LEADS);
    var leadsData = leadsSheet.getDataRange().getValues();
    var userProfile = null;

    for (var j = 1; j < leadsData.length; j++) {
      if (leadsData[j][3] && String(leadsData[j][3]).toLowerCase().trim() === tokenRecord.email) {
        leadsSheet.getRange(j + 1, 5).setValue('verified');
        leadsSheet.getRange(j + 1, 7).setValue(now.toISOString());
        userProfile = {
          lead_id: leadsData[j][0],
          full_name: leadsData[j][1],
          phone: leadsData[j][2],
          email: leadsData[j][3],
          status: 'verified',
          verified_at: now.toISOString()
        };
        break;
      }
    }

    logAuthGateActivity_(ss, 'VERIFY_SUCCESS', tokenRecord.email, tokenRecord.targetSurvey, 'Kích hoạt thành công');

    return jsonOut({
      success: true,
      verified: true,
      message: 'Xác thực danh tính thành công! Đang mở khóa bài khảo sát cho bạn.',
      user: userProfile || { email: tokenRecord.email, status: 'verified' },
      survey_type: tokenRecord.targetSurvey
    });

  } catch (err) {
    return jsonOut({ success: false, verified: false, error: 'SERVER_ERROR', message: err.message });
  }
}

/**
 * Ghi nhận tiến độ hoàn thành các bài khảo sát vào bảng Leads_Directory
 */
function handleAuthGateSyncSurveyCompletion_(payload) {
  try {
    var email = (payload.email || '').trim().toLowerCase();
    var surveyType = (payload.survey_type || '').trim().toUpperCase();
    var resultSummary = payload.result_summary || '';

    if (!email || !AUTH_GATE_CONFIG.SURVEY_CONFIG[surveyType]) {
      return jsonOut({ success: false, error: 'INVALID_PARAMS', message: 'Thiếu thông tin email hoặc loại khảo sát.' });
    }

    var ss = getSpreadsheet();
    ensureAuthGateTables_(ss);

    var leadsSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_LEADS);
    var leadsData = leadsSheet.getDataRange().getValues();
    var now = new Date();
    var targetRow = -1;

    for (var i = 1; i < leadsData.length; i++) {
      if (leadsData[i][3] && String(leadsData[i][3]).toLowerCase().trim() === email) {
        targetRow = i + 1;
        break;
      }
    }

    if (targetRow === -1) {
      return jsonOut({ success: false, error: 'LEAD_NOT_FOUND', message: 'Không tìm thấy hồ sơ người dùng.' });
    }

    // Cột I (9): ss_completed, Cột J (10): tki_completed, Cột K (11): gtcl_completed
    var colIndex = 9;
    if (surveyType === 'TKI') colIndex = 10;
    if (surveyType === 'GTCL') colIndex = 11;

    var completionValue = 'TRUE (' + Utilities.formatDate(now, 'GMT+7', 'yyyy-MM-dd HH:mm') + ')';
    leadsSheet.getRange(targetRow, colIndex).setValue(completionValue);

    logAuthGateActivity_(ss, 'SYNC_COMPLETION', email, surveyType, 'Kết quả: ' + (resultSummary || 'Hoàn thành'));

    return jsonOut({
      success: true,
      message: 'Đã ghi nhận hoàn tất bài khảo sát ' + surveyType + ' thành công.',
      email: email,
      survey_type: surveyType,
      completed_at: now.toISOString()
    });

  } catch (err) {
    return jsonOut({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
}

/**
 * Kiểm tra giới hạn tần suất gửi email (Tối đa 1 email / 60 giây)
 */
function checkAuthGateRateLimit_(ss, email) {
  try {
    var tokensSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_TOKENS);
    var lastRow = tokensSheet.getLastRow();
    if (lastRow <= 1) return { allowed: true, remainingSeconds: 0 };

    var now = new Date().getTime();
    var startRow = Math.max(2, lastRow - 20);
    var numRows = (lastRow - startRow) + 1;
    var recentTokens = tokensSheet.getRange(startRow, 1, numRows, 4).getValues();
    var latestCreatedTime = 0;

    for (var i = recentTokens.length - 1; i >= 0; i--) {
      var rowEmail = String(recentTokens[i][1]).toLowerCase().trim();
      if (rowEmail === email) {
        var createdTime = new Date(recentTokens[i][3]).getTime();
        if (createdTime > latestCreatedTime) {
          latestCreatedTime = createdTime;
        }
      }
    }

    if (latestCreatedTime > 0) {
      var elapsed = now - latestCreatedTime;
      if (elapsed < AUTH_GATE_CONFIG.RATE_LIMIT_COOLDOWN_MS) {
        var remainingSeconds = Math.ceil((AUTH_GATE_CONFIG.RATE_LIMIT_COOLDOWN_MS - elapsed) / 1000);
        return { allowed: false, remainingSeconds: remainingSeconds };
      }
    }

    return { allowed: true, remainingSeconds: 0 };
  } catch (err) {
    return { allowed: true, remainingSeconds: 0 };
  }
}

/**
 * Ghi nhật ký vào Activation_Logs
 */
function logAuthGateActivity_(ss, eventType, email, surveyType, details) {
  try {
    var logsSheet = ss.getSheetByName(AUTH_GATE_CONFIG.SHEET_LOGS);
    if (!logsSheet) return;
    var now = new Date();
    var logId = 'LOG_' + Utilities.formatDate(now, 'GMT+7', 'yyyyMMdd_HHmmss') + '_' + Math.floor(100 + Math.random() * 900);
    logsSheet.appendRow([
      logId,
      now.toISOString(),
      eventType,
      email || '',
      surveyType || '',
      details || ''
    ]);
  } catch (e) {
    console.warn('Ghi log AuthGate thất bại:', e);
  }
}

/**
 * Sinh mã token hex 32 ký tự an toàn
 */
function generateAuthGateHexToken_(length) {
  length = length || 32;
  var byteCount = Math.ceil(length / 2);
  var randomBytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    Utilities.getUuid() + '_' + (new Date().getTime()) + '_' + Math.random()
  );
  var hexString = '';
  for (var i = 0; i < byteCount && i < randomBytes.length; i++) {
    var byte = randomBytes[i];
    var unsignedByte = byte < 0 ? byte + 256 : byte;
    var hex = unsignedByte.toString(16);
    hexString += (hex.length === 1 ? '0' : '') + hex;
  }
  while (hexString.length < length) {
    hexString += Math.floor(Math.random() * 16).toString(16);
  }
  return hexString.substring(0, length);
}

/**
 * Gửi email kích hoạt Corporate Minimalist Swiss Design
 */
function sendAuthGateActivationEmail_(opts) {
  try {
    var toEmail = opts.toEmail;
    var fullName = opts.fullName;
    var surveyName = opts.surveyName;
    var activationUrl = opts.activationUrl;
    var expirationMinutes = opts.expirationMinutes || 60;

    var subject = '[Delivering Happiness] Liên kết mở khóa bài ' + surveyName;
    var htmlBody = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<style>' +
      'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background-color:#FAFAFA;color:#111827;margin:0;padding:24px;}' +
      '.container{max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;}' +
      '.header{padding:28px 32px 20px;border-bottom:1px solid #F3F4F6;}' +
      '.brand{font-size:11px;font-weight:700;letter-spacing:0.1em;color:#D97706;text-transform:uppercase;}' +
      '.title{font-size:20px;font-weight:700;margin:8px 0 0;color:#111827;}' +
      '.body{padding:32px;line-height:1.6;font-size:15px;color:#374151;}' +
      '.btn-wrap{margin:28px 0;text-align:center;}' +
      '.btn{display:inline-block;padding:14px 28px;background-color:#D97706;color:#FFFFFF!important;text-decoration:none;font-weight:600;font-size:15px;border-radius:8px;}' +
      '.meta{background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px;font-size:13px;color:#92400E;margin-top:20px;}' +
      '.footer{background:#F9FAFB;padding:20px 32px;font-size:12px;color:#9CA3AF;text-align:center;border-top:1px solid #F3F4F6;}' +
      '</style></head><body><div class="container">' +
      '<div class="header"><div class="brand">DELIVERING HAPPINESS &bull; CULTURECODE</div><h1 class="title">Xác Thực Danh Tính Học Viên</h1></div>' +
      '<div class="body">' +
      '<p>Kính gửi anh/chị <strong>' + escapeHtml_(fullName) + '</strong>,</p>' +
      '<p>Anh/chị vừa yêu cầu thực hiện bài khảo sát <strong>' + escapeHtml_(surveyName) + '</strong> trong khuôn khổ chương trình <em>Delivering Happiness</em>.</p>' +
      '<p>Vui lòng nhấp vào nút bên dưới để mở khóa bài làm của anh/chị:</p>' +
      '<div class="btn-wrap"><a class="btn" href="' + activationUrl + '" target="_blank">BẮT ĐẦU LÀM BÀI KHẢO SÁT NGAY</a></div>' +
      '<div class="meta"><strong>Lưu ý bảo mật:</strong> Liên kết có hiệu lực trong <strong>1 giờ</strong> và chỉ sử dụng được <strong>một lần duy nhất</strong>. Thiết bị của anh/chị sẽ tự động được nhận diện trong 30 ngày.</div>' +
      '<p style="font-size:12px;color:#6B7280;word-break:break-all;margin-top:20px;">Hoặc copy đường dẫn:<br><a href="' + activationUrl + '" style="color:#D97706;">' + activationUrl + '</a></p>' +
      '</div>' +
      '<div class="footer">Thư gửi tự động từ Cổng Khảo Sát & Đo Lường Delivering Happiness Model.</div>' +
      '</div></body></html>';

    var plainBody = 'Kính gửi ' + fullName + ',\n\n' +
      'Anh/chị vừa yêu cầu thực hiện bài khảo sát: ' + surveyName + '.\n' +
      'Vui lòng truy cập liên kết sau (hiệu lực 1 giờ):\n' +
      activationUrl + '\n\n' +
      'Trân trọng,\nDelivering Happiness Model';

    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: 'Delivering Happiness Model'
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
