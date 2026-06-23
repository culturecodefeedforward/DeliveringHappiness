# Codex UAT - DHM8 Referrer UI + Duplicate Phone Read-only - 2026-06-23

## Scope

- Repo root: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`
- Local URL tested: `http://127.0.0.1:8791/register.html`
- Production URL probed: `https://delivering-happiness.vercel.app/register.html`
- Active Apps Script endpoint probed:
  `https://script.google.com/macros/s/AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg/exec`
- No production form submit was performed.
- No manual Google Sheet mutation was performed in this UAT step.

## Artifacts

- Browser probe script:
  `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_referrer_ui_browser_probe_20260623.js`
- Browser probe JSON output:
  `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_referrer_ui_browser_probe_20260623.json`
- Screenshot folder:
  `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\dhm8_referrer_ui_20260623`

## VERIFIED

### Local browser UAT for DH8 referrer UI

Desktop viewport `1366x768` and mobile viewport `390x844` were tested with Playwright Chromium against local `register.html`.

- Referrer source options exist locally:
  - `GEM Global`
  - `Smart Train`
  - `Nguồn khác`
- Initial/default state:
  - Checked source: `Nguồn khác`
  - Details section ID: `referrerDetailsSection`
  - Details section class: `collapsible-section visible`
  - `referrerName.required = true`
- Selecting `GEM Global`:
  - Details section class becomes `collapsible-section`
  - `max-height = 0px`
  - `opacity = 0`
  - bounding height `0`
  - `referrerName.required = false`
  - mapped payload:
    - `referrerName = "GEM Global"`
    - `referrerPhone = ""`
    - `referrerSource` removed from payload
- Selecting `Smart Train`:
  - Details section class becomes `collapsible-section`
  - `max-height = 0px`
  - `opacity = 0`
  - bounding height `0`
  - `referrerName.required = false`
  - mapped payload:
    - `referrerName = "Smart Train"`
    - `referrerPhone = ""`
    - `referrerSource` removed from payload
- Selecting `Nguồn khác`:
  - Details section class becomes `collapsible-section visible`
  - `referrerName.required = true`
  - mapped payload after filling sample values:
    - `referrerName = "Nguyễn Văn A"`
    - `referrerPhone = "0912345678"`
    - `referrerSource` removed from payload

### Production frontend probe

Production Vercel page currently does not contain the new referrer UI:

- `hasReferrerSource = false`
- `sourceOptions = []`
- `hasDetailsBlock = false`

Conclusion: local UI is browser-verified, but production UI is not live yet.

### Duplicate phone read-only state

Live `checkStatus` JSONP probe:

```text
dhm8Jsonp_1234567890123456({"success":true,"state":"REGISTERED","registrationUuid":"19e225ee-86b8-4352-ac0d-b389f85083f8","paymentStatus":"PAID"});
```

Current Sheet read-only probe for phone `812468678`:

```json
{
  "hitsFor812468678": [
    {
      "row": 9,
      "name": "Nguyen quoc hung",
      "email": "quochung.reo@gmail.com",
      "phone": "812468678",
      "paymentStatus": "PAID",
      "uuid": "19e225ee-86b8-4352-ac0d-b389f85083f8"
    }
  ]
}
```

Conclusion: after approved recovery, the historical duplicate ambiguity has been cleaned up. This probe confirms current lookup state, not a fresh production duplicate-submit test.

### Local code checks

```powershell
node --check register.js
node UAT\dhm8_duplicate_phone_guardrail_mock_test_20260623.js
```

Result:

- `node --check register.js` exited `0`.
- Mock test printed `PASS dhm8_duplicate_phone_guardrail_mock_test_20260623`.

## UNVERIFIED

- Fresh production duplicate submit was not performed because it can create a real Sheet write if guardrail fails.
- Production browser UI for referrer source is not verified because production page does not currently contain the new UI.
- Email flow was not tested in this UAT step.

## Current Verdict

- DH8 local referrer UI: `VERIFIED`.
- DH8 production referrer UI: `UNVERIFIED / NOT LIVE`.
- Duplicate phone backend local/mock: `VERIFIED`.
- Duplicate phone current production read-only state: `VERIFIED`.
- Fresh production duplicate submit protection: `UNVERIFIED` until user explicitly approves a controlled live submit test.

## 2026-06-23 Production Verification After Push

### VERIFIED

- Commit pushed to `origin/main`:
  - `ed8b533 feat(dhm8): add duplicate guardrail and referrer source UI`
- Production URL probed:
  - `https://delivering-happiness.vercel.app/register.html`
- Production DOM now contains `input[name="referrerSource"]`.
- Production options verified by Playwright Chromium:
  - `GEM Global`
  - `Smart Train`
  - `Nguồn khác`
- Production interaction after waiting for CSS transition:
  - Selecting `GEM Global`:
    - checked value: `GEM Global`
    - `referrerName.required = false`
    - section class: `collapsible-section`
    - `max-height = 0px`
    - `opacity = 0`
    - bounding height `0`
  - Selecting `Nguồn khác`:
    - checked value: `Nguồn khác`
    - `referrerName.required = true`
    - section class: `collapsible-section visible`
    - `max-height = 250px`
    - `opacity = 1`
    - bounding height `80`
- Screenshot evidence added locally:
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\dhm8_referrer_ui_20260623\production_live_1366x768_after_deploy_waited.png`

### UPDATED VERDICT

- DH8 production referrer UI: `LIVE VERIFIED`.
- Fresh production duplicate submit protection remains `UNVERIFIED` because no real production form submit was performed in this verification step.

## 2026-06-23 Controlled Production Submit Verification

### First Submit Attempt - FAILED THEN RECOVERED

- Production duplicate-submit probe used phone `0812468678`, payment code `DH8812468678`, and test UUID `11a0bd06-54f5-48ee-bcc5-5a2cd492c8b4`.
- Result exposed a real production bug:
  - Tracking/analytics sent a secondary POST to the same Apps Script endpoint with `registrationUuid` but without required registration fields.
  - Backend accepted that incomplete payload and appended a blank `PENDING` row.
  - The blank row then made frontend polling show `Chờ thanh toán` instead of resolving to the existing paid registration.
- Immediate cleanup performed:
  - Deleted `DHM8_Data` test row `10`.
  - Deleted `DHM8_Email_Outbox` test rows `84` and `85`.
  - Verified after cleanup:
    - only one row remains for phone/payment code `812468678` / `DH8812468678`
    - no test UUID row remains
    - no test outbox jobs remain
    - outbox state count returned to `SENT: 82`

### Backend Hotfix

- Added server-side validation in `Scripts/active_code_gs_final.js`:
  - reject registration payloads missing `fullName`, `email`, or `phone`
  - return `MISSING_REQUIRED_REGISTRATION_FIELDS`
  - do not append Sheet row
  - do not enqueue email jobs
- Apps Script active deployment updated:
  - deployment ID: `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`
  - deployed version: `@37`
  - description: `Guard incomplete registration payloads 20260623`

### Incomplete Payload Guard Probe - VERIFIED

Direct incomplete payload probe returned:

```json
{
  "success": false,
  "error": "MISSING_REQUIRED_REGISTRATION_FIELDS",
  "missingFields": ["fullName", "email", "phone"]
}
```

### Second Controlled Production Submit - VERIFIED

- Production duplicate-submit probe used phone `0812468678`, payment code `DH8812468678`, and test UUID `14705567-b10b-432c-b772-aebe95cddc66`.
- Browser result:
  - `successVisible = true`
  - `modalVisible = true`
  - `errorVisible = false`
  - payment status text: `Đã thanh toán`
  - payment code text: `DH8812468678`
  - modal title: `Đã hoàn tất chi phí hậu cần`
- Sheet/outbox verification after submit:
  - exactly one row remains for phone/payment code `812468678` / `DH8812468678`
  - remaining row is the real paid registration:
    - row `9`
    - name `Nguyen quoc hung`
    - email `quochung.reo@gmail.com`
    - status `PAID`
    - UUID `19e225ee-86b8-4352-ac0d-b389f85083f8`
  - no row exists for test UUID `14705567-b10b-432c-b772-aebe95cddc66`
  - no outbox job exists for the test UUID or test email
  - outbox state count remains `SENT: 82`

### Final Verdict After Controlled Submit

- DH8 production referrer UI: `LIVE VERIFIED`.
- DH8 production duplicate paid-phone submit: `LIVE VERIFIED`.
- No new duplicate registration row was created after backend hotfix.
- No new test outbox/email job remained after the passing submit.

## 2026-06-23 Duplicate UX Hotfix Verification

### Root Cause

- Previous implementation protected Sheet rows but still returned success for duplicate phone/payment-code lookup.
- Frontend polling interpreted the existing paid registration as a successful new registration, so users on another device saw a success/paid state instead of being blocked.
- Same-device users could be stuck on the payment/success surface because DHM8 session state resumed automatically without a clear "register another person" action.

### Backend Fix - VERIFIED

- Apps Script active deployment updated:
  - deployment ID: `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`
  - deployed version: `@39`
  - description: `Block duplicate phone UX 20260623`
- Live `checkStatus` with a new UUID and existing payment code `DH8812468678` now returns:
  - `success=false`
  - `error=DUPLICATE_PAID`
  - message: `Số điện thoại này đã được đăng ký và thanh toán DHM8. Vui lòng không đăng ký lại.`

### Frontend Fix - VERIFIED

- Production `register.js` now contains:
  - duplicate preflight before `POST no-cors`
  - `DUPLICATE_PAID` / `DUPLICATE_PENDING` handling
  - `Đăng ký người khác` reset actions on success surface and paid modal

### Browser UAT - Duplicate Phone Block

Artifact:
`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_production_duplicate_preflight_block_after_fix_20260623.json`

Screenshot:
`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\dhm8_referrer_ui_20260623\production_duplicate_preflight_block_after_fix.png`

Observed result:

- Submitted production form with phone `0812468678`.
- UI result:
  - `successVisible=false`
  - `errorVisible=true`
  - error text: `Số điện thoại này đã có đăng ký DHM8. Vui lòng không đăng ký lại.`
  - `submitDisabled=false`
  - DHM8 session state cleared.
- Sheet/outbox probe after submit:
  - exactly one row remains for phone `812468678`
  - no test row for UUID `3547f869-e79e-4040-bf83-fae7032a5d80`
  - no test outbox job for that UUID/email

### Browser UAT - Same-device Reset

Artifact:
`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_production_reset_form_after_modal_fix_clean_20260623.json`

Screenshot:
`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\dhm8_referrer_ui_20260623\production_reset_form_after_modal_fix_clean.png`

Observed result:

- Simulated a device with previous paid DHM8 session state.
- Paid modal showed `Đăng ký người khác` button.
- Clicking the button reset to a fresh form:
  - `formVisible=true`
  - `successVisible=false`
  - modal not visible
  - old DHM8 session keys cleared; only a fresh `dhm8_registrationUuid` remains.

### Updated Verdict

- Duplicate phone on another device: `LIVE VERIFIED BLOCKED`.
- Same-device reset for another registrant: `LIVE VERIFIED`.
- No new Sheet row or outbox job was created by the final duplicate-preflight test.
