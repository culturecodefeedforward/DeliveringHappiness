const assert = require('node:assert/strict');

function normalizePhone(phone) {
  if (!phone) return '';
  const digits = phone.toString().replace(/\D/g, '');
  if (digits.indexOf('0084') === 0 && digits.length > 6) return '0' + digits.slice(4);
  if (digits.indexOf('84') === 0 && digits.length > 6) return '0' + digits.slice(2);
  return digits;
}

function isActiveRegistrationStatus_(status) {
  const normalized = String(status || '').toUpperCase();
  return normalized === 'PENDING' || normalized === 'PAID';
}

function buildPaymentCodeFromPhone(phone, laneKey = 'dh8') {
  const prefix = laneKey === 'dh9' ? 'DH9' : 'DH8';
  const normalizedPhone = normalizePhone(phone);
  const codeDigits = normalizedPhone.replace(/^0/, '');
  if (!/^\d{3,}$/.test(codeDigits)) return '';
  return prefix + codeDigits.slice(-9);
}

function findActiveRegistrationsByPhone_(rows, phone) {
  const normalized = normalizePhone(phone);
  const submittedPaymentCode = buildPaymentCodeFromPhone(phone);
  if (!normalized && !submittedPaymentCode) return [];
  const matches = [];
  for (let i = 1; i < rows.length; i++) {
    const rowPhone = normalizePhone(rows[i][3]);
    const rowPaymentCode = buildPaymentCodeFromPhone(rowPhone);
    const status = String(rows[i][15] || '').toUpperCase();
    const samePhoneOrCode = (rowPhone === normalized) ||
      (submittedPaymentCode && rowPaymentCode === submittedPaymentCode);
    if (samePhoneOrCode && isActiveRegistrationStatus_(status)) {
      matches.push({
        rowIdx: i,
        uuid: rows[i][17],
        paymentStatus: status,
        email: rows[i][2],
        phone: rows[i][3],
      });
    }
  }
  return matches;
}

function lookupByPaymentCode(rows, paymentCode) {
  const matches = [];
  for (let i = 1; i < rows.length; i++) {
    const rowStatus = rows[i][15] || 'PENDING';
    if (!isActiveRegistrationStatus_(rowStatus)) continue;
    const rowCode = buildPaymentCodeFromPhone(rows[i][3]);
    if (rowCode === paymentCode) {
      matches.push({
        registrationUuid: rows[i][17],
        paymentStatus: rowStatus,
      });
    }
  }
  if (matches.length === 1) return { success: true, state: 'REGISTERED', ...matches[0] };
  const paidMatches = matches.filter((match) => String(match.paymentStatus).toUpperCase() === 'PAID');
  if (paidMatches.length === 1) return { success: true, state: 'REGISTERED', ...paidMatches[0] };
  if (matches.length > 1) return { success: false, error: 'AMBIGUOUS_PAYMENT_CODE' };
  return { success: false, error: 'NOT_FOUND' };
}

const header = Array.from({ length: 18 }, (_, i) => `col${i}`);
const pendingA = ['', 'Nguyen quoc hung', 'quochung.reo@gmail.com', '812468678', '', '', '', '', '', '', '', '', '', '', '', 'PENDING', 'DHM8_REG_040726', 'uuid-a'];
const pendingB = ['', 'Nguyen quoc Hungg', 'hungnq@kiennhan.net', '812468678', '', '', '', '', '', '', '', '', '', '', '', 'PENDING', 'DHM8_REG_040726', 'uuid-b'];
const paidA = ['', 'Paid learner', 'paid@example.com', '0901234567', '', '', '', '', '', '', '', '', '', '', '', 'PAID', 'DHM8_REG_040726', 'uuid-paid'];
const voidDuplicate = ['', 'Voided learner', 'void@example.com', '0901234567', '', '', '', '', '', '', '', '', '', '', '', 'DUPLICATE_VOID', 'DHM8_REG_040726', 'uuid-void'];

assert.equal(buildPaymentCodeFromPhone('0812468678'), 'DH8812468678');
assert.equal(buildPaymentCodeFromPhone('+84901234567'), 'DH8901234567');

assert.deepEqual(findActiveRegistrationsByPhone_([header], '0812468678'), []);
assert.equal(findActiveRegistrationsByPhone_([header, pendingA], '0812468678').length, 1);
assert.equal(findActiveRegistrationsByPhone_([header, pendingA], '812468678').length, 1);
assert.equal(findActiveRegistrationsByPhone_([header, pendingA, pendingB], '0812468678').length, 2);
assert.equal(findActiveRegistrationsByPhone_([header, paidA, voidDuplicate], '0901234567').length, 1);

assert.deepEqual(
  lookupByPaymentCode([header, pendingA], 'DH8812468678'),
  { success: true, state: 'REGISTERED', registrationUuid: 'uuid-a', paymentStatus: 'PENDING' }
);
assert.deepEqual(
  lookupByPaymentCode([header, pendingA, pendingB], 'DH8812468678'),
  { success: false, error: 'AMBIGUOUS_PAYMENT_CODE' }
);
assert.deepEqual(
  lookupByPaymentCode([header, paidA, voidDuplicate], 'DH8901234567'),
  { success: true, state: 'REGISTERED', registrationUuid: 'uuid-paid', paymentStatus: 'PAID' }
);

console.log('PASS dhm8_duplicate_phone_guardrail_mock_test_20260623');
