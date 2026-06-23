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
