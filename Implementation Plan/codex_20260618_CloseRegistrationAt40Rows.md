# DHM8 Close Registration At 40 Rows - 2026-06-18

## Correct Intent

- From now until `DHM8_Data` reaches `40` real registration rows, the current DH8 registration flow must remain unchanged for users.
- After `DHM8_Data` reaches `40` real rows excluding header, new users should be moved to the interest flow.
- Existing/resume payment flow should still work for registrations that already exist.

## Local Implementation

- Backend Apps Script checks row count before appending a new non-duplicate registration.
- If row count is `< 40`, `handleRegistration()` appends as before.
- If row count is `>= 40`, `handleRegistration()` returns `REGISTRATION_CLOSED` and does not append to `DHM8_Data`.
- Frontend registration pages call `checkRegistrationAvailability`; if open, nothing visible changes.
- If closed, frontend hides the registration form and shows CTA to `interest.html`.
- `interest.html` saves `DH_INTEREST` leads to sheet tab `DH interest`.
- `interest.html` has `Quay về trang chủ` pointing to `index_OFFICIAL.html`, because after closure the home context is the information landing page.

## Files Affected

- `Scripts/active_code_gs_final.js`
- `Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js`
- `register.js`
- `register.html`
- `dh8/index.html`
- `interest.html`
- `index_OFFICIAL.html`

## Approval Boundary

- Local edit only.
- Apps Script deploy requires separate direct user approval.
- Vercel deploy requires separate direct user approval.
- Commit/push requires separate direct user approval.
