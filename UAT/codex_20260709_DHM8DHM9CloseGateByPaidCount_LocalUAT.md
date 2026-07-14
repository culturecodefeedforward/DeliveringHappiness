# DHM8/DHM9 close gate by paid count - Local UAT - 2026-07-09

## Scope

- Change rule from closing registration at `40` registration rows to closing at `40` paid registrations.
- Local files only.
- No `clasp push`.
- No Apps Script deployment.
- No Git commit/push.
- No Google Sheet mutation.
- No production submit/payment test.

## Files changed

- `Scripts/active_code_gs_final.js`
- `Artifacts/dhm9_apps_script_prod_deploy_20260701_174939/Mã.js`
- `docs/DHM8_REGISTRATION_PAYMENT_WORKFLOW.md`
- `docs/DHM9_REGISTRATION_PAYMENT_WORKFLOW.md`
- `Implementation Plan/codex_20260709_DHM8DHM9CloseGateByPaidCountPlan.md`

## VERIFIED - local source

- `Scripts/active_code_gs_final.js` now contains `getRegistrationPaidCount_(sheet)`.
- `getRegistrationAvailability_(laneKey)` now calculates:
  - `paidCount = getRegistrationPaidCount_(sheet)`
  - `registrationOpen = paidCount < lane.registrationCap`
  - `countBasis: 'PAID'`
- `handleRegistration(data, laneKey)` now blocks new append only when:
  - `paidCount >= lane.registrationCap`
- The old gate pattern was not found:
  - `dataRowCount >= lane.registrationCap`
  - `isOpen = dataRowCount < lane.registrationCap`

## VERIFIED - commands

```text
node --check Scripts\active_code_gs_final.js
ACTIVE_NODE_CHECK_EXIT=0

node --check Artifacts\dhm9_apps_script_prod_deploy_20260701_174939\Mã.js
DEPLOY_MIRROR_NODE_CHECK_EXIT=0

git diff --no-index Scripts\active_code_gs_final.js Artifacts\dhm9_apps_script_prod_deploy_20260701_174939\Mã.js
ZERO_DIFF_EXIT=0

git diff --check -- Scripts\active_code_gs_final.js Artifacts\dhm9_apps_script_prod_deploy_20260701_174939\Mã.js docs\DHM8_REGISTRATION_PAYMENT_WORKFLOW.md docs\DHM9_REGISTRATION_PAYMENT_WORKFLOW.md Implementation Plan\codex_20260709_DHM8DHM9CloseGateByPaidCountPlan.md
DIFF_CHECK_EXIT=0
```

## VERIFIED - docs

- `docs/DHM8_REGISTRATION_PAYMENT_WORKFLOW.md` documents that the gate closes on `paidCount >= 40`.
- `docs/DHM9_REGISTRATION_PAYMENT_WORKFLOW.md` documents that the gate closes on `paidCount >= 40`.
- Docs validation script was skipped because `.claude/scripts/validate-docs.cjs` does not exist in this repo.

## VERIFIED - current live read-only probes before deployment

These probes show current production behavior before deploying the local change.

### DHM8 live

URL:

```text
https://script.google.com/macros/s/AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg/exec?action=checkRegistrationAvailability&lane=dh8&callback=dhm8Jsonp_ABCDEFGHIJKLMNOP&_=20260709
```

Response:

```text
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTRATION_CLOSED","registrationOpen":false,"cap":40,"dataRowCount":40,"interestLink":"https://delivering-happiness.vercel.app/interest.html"});
```

Interpretation: current live DHM8 is still using the old surface because it returns `dataRowCount` and no `paidCount`/`countBasis`.

### DHM9 live

URL:

```text
https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec?action=checkRegistrationAvailability&lane=dh9&callback=dh9Jsonp_ABCDEFGHIJKLMNOP&_=20260709
```

Response:

```text
dh9Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"OPEN","registrationOpen":true,"cap":40,"dataRowCount":28,"interestLink":"https://delivering-happiness.vercel.app/interest_dh9.html"});
```

Interpretation: current live DHM9 is still using the old surface because it returns `dataRowCount` and no `paidCount`/`countBasis`.

## INFERRED

- Frontend does not need a code change for this rule because both `register.js` and `register_dh9.js` already branch on `registrationOpen === false`.

## UNVERIFIED

- Apps Script production deployment has not been updated.
- Live behavior after the paid-count rule is not verified.
- Current paid counts in Google Sheets were not read in this local UAT.

## Risk note

The implemented rule closes new registrations when paid registrations reach 40. Existing pending registrations can still resume/checkStatus/pay. If strict hard cap means no more than 40 total paid after pending users pay, that requires a separate payment/webhook gate design and is not included here.
