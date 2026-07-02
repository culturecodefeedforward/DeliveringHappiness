# DHM9 Production Finish Full-Circle UAT - 2026-07-02

## Verdict

`VERIFIED Live done`: DHM9 production flow is usable end-to-end on the public site.

Verified surfaces:

- `VERIFIED`: Vercel live frontend serves DHM9 form and `register_dh9.js` with the two hotfixes.
- `VERIFIED`: Apps Script DHM9 production deployment is `@51`.
- `VERIFIED`: Browser live submit creates a real DHM9 registration and shows pending QR/payment instructions.
- `VERIFIED`: Simulated SePay webhook updates the registration to `PAID`.
- `VERIFIED`: Browser resume URL shows paid state and the "Dang ky nguoi khac" button surface.
- `VERIFIED`: Gmail inbox search found the test confirmation evidence for `vuhoang2708@gmail.com`.

## Production Targets

- Frontend URL: `https://delivering-happiness.vercel.app/register_dh9_hanoi.html`
- Live JS: `https://delivering-happiness.vercel.app/register_dh9.js`
- Apps Script DHM9 URL: `https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec`
- Apps Script deployment: `AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ @51 - DHM9 production finish UX async email 20260702`
- Git remote head: `7229b7b1d4eec3dd5fef29c87e6607ad5c2c022a`

## Code Changes Applied During Finish

Two targeted DHM9 frontend hotfixes were committed and pushed after live browser testing exposed submit blockers:

- `692fe42 fix(dhm9): use jsonp status checks by default`
  - File: `register_dh9.js`
  - Reason: avoid fetch status checks through Google Apps Script redirect unless explicitly opted in with `window.DHM9_ENABLE_FETCH_STATUS === true`.
- `7229b7b fix(dhm9): prevent realtime phone check blocking submit`
  - File: `register_dh9.js`
  - Reason: cancel pending phone debounce on submit and avoid disabling the submit button from realtime validation state.

No DHM8 Apps Script archive file was staged or touched by these finish commits.

## Static Browser UAT

Evidence:

- Report: `UAT/dhm9_browser_live_uat_20260702.json`
- Screenshots:
  - `UAT/screenshots/dhm9_production_finish_20260702/codex_desktop_initial.png`
  - `UAT/screenshots/dhm9_production_finish_20260702/codex_desktop_expanded.png`
  - `UAT/screenshots/dhm9_production_finish_20260702/codex_mobile_initial.png`
  - `UAT/screenshots/dhm9_production_finish_20260702/codex_mobile_expanded.png`

Observed:

- Desktop and mobile HTTP status: `200`
- `event_id`: `DHM9_REG_220826_HN`
- Form points to expected Apps Script deployment ID.
- Required fields present: name, email, phone, submit button.
- Fatal console count: `0`

## Full-Circle E2E Test

Evidence:

- Full E2E report: `Artifacts/dhm9_full_circle_e2e/codex_dhm9_browser_full_circle_20260702_013933.json`
- Valid callback follow-up: `UAT/dhm9_followup_valid_callback_status_20260702_013933.json`
- Pending screenshot: `UAT/screenshots/dhm9_production_finish_20260702/codex_e2e_pending_20260702_013933.png`
- Paid resume screenshot: `UAT/screenshots/dhm9_production_finish_20260702/codex_e2e_paid_resume_20260702_013933.png`
- Gmail search report: `UAT/dhm9_gmail_inbox_search_20260702_013933.json`

Test record:

- Name: `Codex DHM9 Browser E2E 20260702_013933`
- Email: `vuhoang2708@gmail.com`
- Phone: `0931173905`
- Registration UUID: `9ed7cdc0-80d6-4f5d-b7f4-7f4eef01fcc2`
- Payment code: `DHM9931173905`
- Simulated SePay transaction ID: `codex-dhm9-browser-e2e-20260702_013933`

Observed:

- Browser submit: `registeredInBrowser = true`
- Pending UI status: `Cho thanh toan`
- Simulated SePay webhook: `success = true`
- Valid callback follow-up:
  - `success = true`
  - `state = REGISTERED`
  - `paymentStatus = PAID`
- Browser paid resume:
  - `paidStatusText = Da thanh toan`
  - `successNewRegistrationButtonCount = 1`
- Gmail inbox search:
  - `verifiedByInboxSearch = true`
  - Query for payment code matched: `"DHM9931173905" newer_than:1d`
  - Query for full name matched: `"Codex DHM9 Browser E2E 20260702_013933" newer_than:1d`
  - Query for registration UUID matched: `"9ed7cdc0-80d6-4f5d-b7f4-7f4eef01fcc2" newer_than:1d`

## Notes

- The E2E JSON contains `INVALID_CALLBACK` for a few helper probes using `dh9Jsonp_BROWSER_E2E`; that helper callback name included underscores and violated the production callback regex. This does not affect the browser flow because the live browser uses generated valid callback names. The follow-up file `UAT/dhm9_followup_valid_callback_status_20260702_013933.json` verifies the same registration with a valid callback.
- One late page error `dh9Jsonp_... is not defined` appeared after timeout cleanup of an abandoned JSONP probe, but the final browser state, backend state, webhook result, and Gmail inbox search are all verified.
- Token values were used only in local requests and were intentionally omitted from all reports.
