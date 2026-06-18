# DHM8 Close Registration At 40 Rows - Local UAT - 2026-06-18

## Scope

- Local edit only.
- Current DH8 registration flow should remain unchanged while `DHM8_Data` has fewer than `40` real data rows.
- New registration should close only when `DHM8_Data` reaches at least `40` real data rows.
- No Apps Script deploy.
- No Vercel deploy.
- No commit or push.

## VERIFIED

- `node --check register.js` completed with exit code `0`.
- `node --check Scripts\active_code_gs_final.js` completed with exit code `0`.
- `node --check Artifacts\dhm8_gate2_clasp_production_20260617\Mã.js` completed with exit code `0`.
- Source contains `DHM8_REGISTRATION_CAP = 40`.
- Source contains `checkRegistrationAvailability`.
- Backend guard is inside the non-duplicate append path, so duplicate/resume registrations are not blocked by the cap.
- Registration pages contain a hidden closed-registration block that only displays after the availability check reports closed.
- `interest.html` posts `DH_INTEREST` leads to the `DH interest` sheet path in local Apps Script source.
- `interest.html` has `Quay về trang chủ` pointing to `index_OFFICIAL.html`.

## INFERRED

- For `< 40` rows, the user-visible registration flow remains the same because the frontend only branches when `registrationOpen === false`, and backend only blocks when row count is at least `40`.
- For `>= 40` rows, new registrations are fail-closed before `appendRow` and routed to the interest flow.

## UNVERIFIED

- Browser UI evidence is not captured in this turn.
- Apps Script runtime behavior is not verified because deploy was not approved or executed.
- Live Vercel behavior is not verified because deploy was not approved or executed.
