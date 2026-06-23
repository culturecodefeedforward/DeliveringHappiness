# UAT - DHM8 Duplicate Phone Guardrail - 2026-06-23

## Claim Level

- `VERIFIED`: `Scripts/active_code_gs_final.js` now has `findActiveRegistrationsByPhone_()` and `isActiveRegistrationStatus_()`.
- `VERIFIED`: `getRegistrationStatus()` payment-code lookup now ignores non-active statuses by using `isActiveRegistrationStatus_()`.
- `VERIFIED`: duplicate guard compares both normalized phone and phone-derived payment code, so `812468678` and `0812468678` are treated as the same payer code `DH8812468678`.
- `VERIFIED`: `register.js` now uses `result.registrationUuid || uuid` before `showSuccess()`.
- `VERIFIED`: `register.js` now handles `AMBIGUOUS_PAYMENT_CODE` with a user-facing inline error.
- `VERIFIED`: syntax checks passed after the combined Codex/Gemini local changes.
- `VERIFIED`: local mock test passed for duplicate pending, ambiguous duplicate, paid duplicate, and non-active duplicate filtering.
- `INFERRED`: browser/user-visible duplicate flow should work through JSONP payment-code lookup because the POST response is unreadable under `no-cors`.
- `UNVERIFIED`: browser UAT, Apps Script production deploy, live endpoint verification, Google Sheet mutation, Gmail sent verification, and transaction `64654974` recovery.

## Scope

Local-only guardrail for future duplicate active DHM8/DH9 registrations by phone-derived payment code.

Out of scope in this phase:

- No Apps Script deploy.
- No Google Sheet mutation.
- No transaction `64654974` manual recovery.
- No Git commit/push.

## Production Incident Reference

- Transaction ID: `64654974`
- Amount: `250000`
- Account: `8815369431`
- Content: `DH8812468678 FT26174681010433`
- State before recovery: `ERROR`
- Known duplicate active rows:
  - Row 9: UUID `19e225ee-86b8-4352-ac0d-b389f85083f8`, email `quochung.reo@gmail.com`, phone `812468678`, status `PENDING`
  - Row 10: UUID `bc068320-5e41-4de4-a614-b4fb73b660d4`, email `hungnq@kiennhan.net`, phone `812468678`, status `PENDING`

## Local Changes Verified

### Backend

- Added `isActiveRegistrationStatus_(status)` so active statuses are centralized:
  - `PENDING`
  - `PAID`
- Added `findActiveRegistrationsByPhone_(dataSheet, phone, laneKey)`.
- `handleRegistration()` now checks active registrations by normalized phone before `appendRow`.
- The duplicate check also compares payment code so leading-zero differences do not bypass the guard.
- `getRegistrationStatus()` now filters payment-code lookup to active statuses only. This prevents future non-active statuses such as `DUPLICATE_VOID` from still causing `AMBIGUOUS_PAYMENT_CODE`.

### Frontend

- `startPolling()` now uses:

```javascript
const resolvedUuid = result.registrationUuid || uuid;
showSuccess(resolvedUuid, result.paymentStatus || result.state);
```

- `startPolling()` now stops retry loop and shows inline BTC-support message for `AMBIGUOUS_PAYMENT_CODE`.

## Verification Commands

```powershell
node --check Scripts\active_code_gs_final.js
node --check register.js
node UAT\dhm8_duplicate_phone_guardrail_mock_test_20260623.js
```

Result:

- `VERIFIED`: all commands exited with code `0`.
- `VERIFIED`: mock test printed `PASS dhm8_duplicate_phone_guardrail_mock_test_20260623`.

## Test Matrix

| Case | Expected Result | Current Evidence |
|---|---|---|
| New phone registration | Appends one `PENDING` row and creates pending/BTC outbox jobs | `INFERRED` from preserved code path; not browser-tested |
| Same phone with one active `PENDING` | Does not append new row; JSONP lookup by payment code returns existing UUID | `VERIFIED` local mock for lookup; `INFERRED` for browser |
| Same phone with one active `PAID` | Does not append new row; JSONP lookup returns existing paid UUID | `VERIFIED` local mock for lookup; `INFERRED` for browser |
| Same phone with >=2 active rows | Does not append new row; frontend shows BTC manual handling message | `VERIFIED` local mock for ambiguous lookup; `INFERRED` for browser |
| Future duplicate row marked non-active | Payment-code lookup ignores non-active row | `VERIFIED` local mock and code inspection |

## Remaining Approval Gates

Before `Live done` can be claimed:

1. Deploy Apps Script to the active register endpoint only after direct user approval.
2. Verify active endpoint runtime/debug points to the deployed version.
3. Run controlled browser UAT or user-approved live duplicate probe.
4. Verify no new duplicate Sheet row is created.
5. Handle transaction `64654974` only after direct approval of exact row/UUID.
6. Verify outbox and Gmail sent after any approved recovery.

## Git Scope Warning

`Scripts/active_code_gs_final.js` also contains earlier local production fixes in the same file, including:

- BTC recipient debug field.
- Mail worker `props` scope fix.

Do not stage or commit this file as "duplicate guardrail only" unless the commit message/scope explicitly includes those earlier fixes, or the diff is split carefully.

## 2026-06-23 Apps Script Production Deploy Evidence

### VERIFIED

- Apps Script package synced from `Scripts/active_code_gs_final.js` to `Artifacts/dhm8_btc_recipient_prod_package_20260623/Mã.js`.
- Local/package verification passed before deploy:
  - `node --check Scripts\active_code_gs_final.js`
  - `node --check Artifacts\dhm8_btc_recipient_prod_package_20260623\Mã.js`
  - `node UAT\dhm8_duplicate_phone_guardrail_mock_test_20260623.js`
- `clasp push -f` completed and pushed 2 files: `appsscript.json`, `Mã.js`.
- `clasp version` created version `34` with description `Fix DH8 duplicate phone guardrail 20260623`.
- Active DH8 register deployment updated successfully:
  - deployment ID: `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`
  - deployed version: `@35`
  - description: `Fix DH8 duplicate phone guardrail 20260623`
- `clasp deployments` confirms active endpoint `AKfycbwyn...` is now at `@35`.
- Live read-only `getHealth` on active endpoint returned:
  - `success=true`
  - `environment=PRODUCTION`
  - `spreadsheetId=1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`
  - `officialAccountNumber=8815369431`
  - `processEmailQueueTriggerPresent=true`
  - `processEmailQueueTriggerCount=1`
  - `amount=250000`
- Live read-only `getRuntimeDebug` on active endpoint returned:
  - `success=true`
  - `paymentBtcEmailType=BTC_PAID`
  - `btcEmails=chauhm71@gmail.com,vuhoang2708@gmail.com,hoanhn.edu.vn@gmail.com`
  - `mailTriggerFunction=processEmailQueue`
  - `mailTriggerEveryMinutes=5`

### CURRENT CONCLUSION

- Backend duplicate-phone guardrail is deployed to the active DH8 Apps Script endpoint used by `register.html`, `register.js`, and `dh8/index.html`.
- No manual Google Sheet payment recovery was performed in this deploy step.
- No transaction `64654974` mutation was performed in this deploy step.

### STILL UNVERIFIED

- Browser/user-facing duplicate registration UAT on the public form.
- Real duplicate submit proof that no new `DHM8_Data` row is appended.
- Manual recovery of transaction `64654974`.

### Additional Live Read-only CheckStatus Probe

- Live `checkStatus` on active endpoint with `paymentCode=DH8812468678`, fake UUID, and `lane=dh8` returned:
  - `success=false`
  - `error=AMBIGUOUS_PAYMENT_CODE`
- This is read-only evidence that the active endpoint detects the current duplicate payment-code condition and exposes the expected error to frontend polling.

## 2026-06-23 Manual Recovery Evidence For Transaction `64654974`

### VERIFIED

- Direct user approval was given in chat to keep the correct row and delete the lower duplicate row.
- `DHM8_Data` now has exactly one active row for phone `812468678`:
  - Row `9`
  - Name: `Nguyen quoc hung`
  - Email: `quochung.reo@gmail.com`
  - Payment Status: `PAID`
  - Event ID: `DHM8_REG_040726`
  - Registration UUID: `19e225ee-86b8-4352-ac0d-b389f85083f8`
- Duplicate registration UUID `bc068320-5e41-4de4-a614-b4fb73b660d4` no longer exists in `DHM8_Data`.
- `DHM8_Payments` row `18` for transaction `64654974` now has:
  - Amount: `250000`
  - Account: `8815369431`
  - Content: `DH8812468678 FT26174681010433`
  - State: `MATCHED`
  - Matched UUID: `19e225ee-86b8-4352-ac0d-b389f85083f8`
- `DHM8_Email_Outbox` state count after queue run:
  - `SENT: 82`
- Outbox jobs for the correct UUID are all `SENT`:
  - `PENDING` to `quochung.reo@gmail.com`
  - `BTC` to `chauhm71@gmail.com,vuhoang2708@gmail.com,hoanhn.edu.vn@gmail.com`
  - `PAID` to `quochung.reo@gmail.com`
  - `BTC_PAID` to `chauhm71@gmail.com,vuhoang2708@gmail.com,hoanhn.edu.vn@gmail.com`
- Gmail sent-box verification found:
  - Student paid email to `quochung.reo@gmail.com`, date `Tue, 23 Jun 2026 08:00:10 +0000`, snippet begins `DHM8 - Đã xác nhận thanh toán`.
  - BTC paid email to `chauhm71@gmail.com, vuhoang2708@gmail.com, hoanhn.edu.vn@gmail.com`, date `Tue, 23 Jun 2026 08:00:16 +0000`, snippet begins `DHM8 - Thông báo nội bộ BTC`.

### KNOWN CAVEAT

- The two manually appended recovery jobs for `PAID` and `BTC_PAID` show mojibake in the email subject:
  - `X?c nh?n thanh to?n DHM8`
  - `Thanh to?n x?c nh?n - DHM8`
- The recipients and email body snippets are verified correct in Gmail. Earlier automated paid emails from Apps Script show proper Vietnamese subjects, so this caveat is limited to the manual recovery append path, not proven as a production automation regression.

### CURRENT RECOVERY CONCLUSION

- Transaction `64654974` is recovered.
- Correct row is paid.
- Duplicate data row is removed.
- Student and BTC paid emails were sent.
- Gemini may proceed with DH8 browser UAT for the duplicate-phone guardrail and referrer-source UI, but should not manually mutate Google Sheet rows during UAT.
