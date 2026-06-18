# DHM8 Close Registration At 40 Rows - Live UAT - 2026-06-18

## Scope

- Commit/push lane đóng đăng ký ở mốc `40` dòng data thực.
- Deploy Apps Script production deployment đang dùng: `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`.
- Verify Vercel production alias: `https://delivering-happiness.vercel.app`.

## VERIFIED

- Git commit: `9760c0fdc009230cff45cd500b6ae3020a0e8a72`
- Git push:
  - `main -> origin/main`
- Apps Script production mirror push:
  - `npx --yes @google/clasp push -f`
  - output: `Pushed 2 files`
- Apps Script version:
  - `Created version 22`
- Apps Script deployment update:
  - `Deployed AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg @23`
- Vercel production inspect:
  - deployment `dpl_EgkEAQVkNdEMivocnqoZGqywinZK`
  - status `Ready`
  - alias contains `https://delivering-happiness.vercel.app`
- Live Apps Script probe:
  - `GET /exec?action=checkRegistrationAvailability`
  - response:
    - `success: true`
    - `state: OPEN`
    - `registrationOpen: true`
    - `cap: 40`
    - `interestLink: https://delivering-happiness.vercel.app/interest.html`
- Live landing page probe:
  - `https://delivering-happiness.vercel.app/index_OFFICIAL.html`
  - contains LinkedIn public URL `https://www.linkedin.com/company/culturecodecommunity/`
  - CTA points to `interest.html`
- Live interest page probe:
  - `https://delivering-happiness.vercel.app/interest.html`
  - page exists
  - contains form submit flow `DH_INTEREST`
  - contains `Quay về trang chủ` -> `index_OFFICIAL.html`
- Live register page probe:
  - `https://delivering-happiness.vercel.app/register.html`
  - still renders current DH8 registration form while backend reports `registrationOpen: true`
  - contains hidden closed-registration block and `window.DH_INTEREST_URL = "interest.html"`
  - contains Apps Script URL `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`

## INFERRED

- Khi `DHM8_Data < 40`, user vẫn đi theo luồng đăng ký DH8 hiện tại vì Apps Script probe đang trả `registrationOpen: true`.
- Khi `DHM8_Data >= 40`, backend sẽ fail-closed và frontend đã có sẵn CTA sang `interest.html`.

## UNVERIFIED

- Chưa có browser evidence dạng click-through thật để chứng minh transition tự động sang `interest.html` khi sheet đạt đúng `40` dòng.
- Chưa bơm test data thật để nâng `DHM8_Data` lên `40`, nên trạng thái `REGISTRATION_CLOSED` mới được verify ở source/runtime contract, chưa verify bằng scenario live end-to-end.
