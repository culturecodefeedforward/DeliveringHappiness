# DHM9 Dual Prefix Payment Hotfix Evidence

## Scope
- Date: `2026-07-01`
- Local target: `http://127.0.0.1:8010/register_dh9_hanoi.html`
- Related plan: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\codex_20260701_DHM9DualPrefixPaymentHotfixPlan.md`

## Claim Matrix
| Surface | Status | Evidence |
| :--- | :--- | :--- |
| Local frontend syntax | VERIFIED | `node --check register_dh9.js` exit `0` |
| Local backend syntax | VERIFIED | `node --check Scripts\active_code_gs_final.js` exit `0` |
| Backend DHM9 lane detection | VERIFIED static | `detectLaneKeyFromPaymentCode_` accepts `DH9` and `DHM9` |
| Backend payment matching variants | VERIFIED static | DHM9 lane has `paymentPrefix: 'DHM9'` and `paymentPrefixes: ['DHM9', 'DH9']` |
| Frontend payment code generation | VERIFIED browser local | `buildPaymentCodeFromPhone('0912345678')` returned `DHM9912345678` |
| Frontend backward compatibility | VERIFIED browser local | `isValidSePayPaymentCode('DHM9912345678') === true` and `isValidSePayPaymentCode('DH9912345678') === true` |
| Callback format | VERIFIED browser local | generated callback matched `dh9Jsonp_[A-Za-z0-9]{16,40}` |
| Clean home links | VERIFIED static/browser local | no `index_OFFICIAL.html` in `register_dh9_hanoi.html` DOM |
| Apps Script deployment | UNVERIFIED | Not deployed by Codex |
| Public live browser flow | UNVERIFIED | Must be tested by Gemini after deploy |

## Browser Probe Output
```json
{
  "title": "Đăng ký DH Masterclass (DHM9)",
  "eventId": "DHM9_REG_220826_HN",
  "generated": "DHM9912345678",
  "acceptsNew": true,
  "acceptsOld": true,
  "rejectsOther": false,
  "callbackPrefixOk": true,
  "hasIndexOfficial": false
}
```

## Notes
- This is local verification only.
- `Live done` cannot be claimed until Gemini verifies the deployed public frontend and deployed Apps Script backend with browser evidence and repo-visible screenshots/report.
