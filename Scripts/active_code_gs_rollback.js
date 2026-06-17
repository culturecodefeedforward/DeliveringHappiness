/**
 * DHM8 Email Automation - ROLLBACK VERSION
 * File: Scripts/active_code_gs_rollback.js
 *
 * Dùng khi cần quay lui về phiên bản đơn giản hơn.
 * Vẫn áp dụng fail-closed getSpreadsheet() và Script Properties.
 * KHÔNG chứa token hard-coded.
 *
 * Script Properties bắt buộc (giống final):
 *   ENVIRONMENT, SPREADSHEET_ID, STAGING_ALLOWED_IDS / PRODUCTION_ALLOWED_IDS
 *   SEPAY_WEBHOOK_TOKEN, KILL_SWITCH_REGISTRATION, KILL_SWITCH_PAYMENT
 */

// ─── FAIL-CLOSED (giống final - bắt buộc áp dụng cả ở rollback) ─
function getSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
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
    throw new Error('SECURITY_VIOLATION: Spreadsheet ID not in allowlist for ' + env + '.');
  }

  try {
    return SpreadsheetApp.openById(sheetId);
  } catch (e) {
    throw new Error('CRITICAL_ERROR: Cannot open spreadsheet: ' + e.message);
  }
}

// ─── doPost (simplified rollback) ────────────────────────────
function doPost(e) {
  var props = PropertiesService.getScriptProperties();

  try {
    var body = JSON.parse(e.postData.contents);

    // Webhook SePay - phát hiện sớm để KILL_SWITCH_PAYMENT chỉ áp dụng cho nhánh này
    if (e.parameter.source === 'sepay' || body.source === 'sepay') {
      var webhookToken = props.getProperty('SEPAY_WEBHOOK_TOKEN');
      var authToken = e.parameter.token || body.token || '';
      if (!webhookToken || authToken !== webhookToken) {
        return jsonOut({ success: false, error: 'INVALID_TOKEN' });
      }
      // Fix Bug #4: KILL_SWITCH_PAYMENT chỉ nằm trong nhánh SePay
      if (props.getProperty('KILL_SWITCH_PAYMENT') === 'true') {
        try {
          var ssSepay = getSpreadsheet();
          var log = ssSepay.getSheetByName('DHM8_System_Logs') || ssSepay.insertSheet('DHM8_System_Logs');
          log.appendRow([new Date(), 'WARN', 'Kill switch PAYMENT active - webhook dropped',
            JSON.stringify(body).slice(0, 200)]);
        } catch (logErr) { /* ignore */ }
        return jsonOut({ success: true, note: 'Payment kill switch active' });
      }
      return jsonOut({ success: true, note: 'Rollback mode: SePay not processed' });
    }

    // Kill switch đăng ký (chỉ áp dụng cho form registration)
    if (props.getProperty('KILL_SWITCH_REGISTRATION') === 'true') {
      return jsonOut({ success: false, error: 'REGISTRATION_DISABLED' });
    }

    // Form đăng ký - ghi đơn giản
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('DHM8_Data');
    if (!sheet) {
      sheet = ss.insertSheet('DHM8_Data');
      sheet.appendRow(['Timestamp','Họ và tên','Email','Số điện thoại',
        'Payment Status','Event ID','Registration UUID']);
      sheet.setFrozenRows(1);
    }

    var uuid = body.registrationUuid || '';
    if (!uuid) return jsonOut({ success: false, error: 'MISSING_UUID' });

    // Idempotency check
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][6] === uuid) {
        return jsonOut({ success: true, state: 'REGISTERED', registrationUuid: uuid, duplicate: true });
      }
    }

    sheet.appendRow([new Date(), body.fullName || '', body.email || '',
      body.phone || '', 'PENDING', body.event_id || 'DHM8_ROLLBACK', uuid]);

    return jsonOut({ success: true, state: 'REGISTERED', registrationUuid: uuid });

  } catch (err) {
    return jsonOut({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
}

// ─── doGet (JSONP checkStatus - rollback cũng hỗ trợ) ─────────
function doGet(e) {
  var CALLBACK_REGEX = /^dhm8Jsonp_[A-Za-z0-9]{16,40}$/;
  var action = e.parameter.action || '';
  var callback = e.parameter.callback || '';

  if (action === 'checkStatus') {
    if (!CALLBACK_REGEX.test(callback)) {
      return ContentService.createTextOutput('{"error":"INVALID_CALLBACK"}')
        .setMimeType(ContentService.MimeType.JSON);
    }
    var uuid = e.parameter.uuid || '';
    try {
      var ss = getSpreadsheet();
      var sheet = ss.getSheetByName('DHM8_Data');
      if (sheet) {
        var rows = sheet.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
          if (rows[i][6] === uuid) {
            var payload = JSON.stringify({ success: true, state: 'REGISTERED', registrationUuid: uuid });
            return ContentService.createTextOutput(callback + '(' + payload + ');')
              .setMimeType(ContentService.MimeType.JAVASCRIPT);
          }
        }
      }
    } catch (err) { /* fall through */ }
    var notFound = JSON.stringify({ success: false, error: 'NOT_FOUND' });
    return ContentService.createTextOutput(callback + '(' + notFound + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return jsonOut({ success: false, error: 'UNKNOWN_ACTION' });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
