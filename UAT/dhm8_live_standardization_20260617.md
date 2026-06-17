# DHM8 Live Standardization Report

Date: 2026-06-17

## Scope

Chuẩn hóa các bề mặt có thể làm ngay để public form DHM8 không còn lệch giữa:

- HTML copy
- frontend JS flow
- public Vercel route
- deployment docs

## Checkpoints

`VERIFIED`

Pre-change backup:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\checkpoints\dhm8_live_standardization_20260617_1225
```

Post-deploy backup:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\checkpoints\dhm8_live_standardization_20260617_1235_postdeploy
```

Post-production-cutover backup:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\checkpoints\20260617_1257_post_prod_cutover
```

## Local Changes Applied

`VERIFIED`

- `register.js`
  - fallback Apps Script URL đổi sang production backend:
    `AKfycbxxbba8bvb7H2Em179HgJUv0Tj8dnxWIuGynmVqjDcPVwADrTBXxx7UwE5AKroIQR5i`
  - giữ popup thanh toán thành công + Zalo
  - bỏ wording `test` trong QR/account fallback
- `tracking.js`
  - fallback URL đổi sang cùng Apps Script production URL
- `register.html`
  - bỏ hoàn toàn hướng dẫn chuyển khoản BIDV/MB cũ
  - thêm cấu hình `window.CUSTOM_WEBAPP_URL`
  - thêm dynamic success payment block: UUID, payment code, transfer content,
    account, amount, payment status, QR, Zalo CTA
  - set live cache-busting:
    `tracking.js?v=3.1-live`
    `register.js?v=2.6-live`
- `dh8/index.html`
  - đồng bộ payment flow mới
  - đồng bộ radio jitter fix
  - đồng bộ live config block
- `docs/deployment-guide.md`
  - production URL sửa từ `dh-crm-landing` sang `delivering-happiness`
  - thêm SePay proxy URL
  - thêm Apps Script URL DHM8 lane hiện hành

## Verification

### Static checks

`VERIFIED`

```text
node --check register.js
node --check tracking.js
node --check api/sepay-dh.js
```

### Public deploy

`VERIFIED`

```text
vercel --prod --yes
=> Production deployment:
https://delivering-happiness-fs6eufjrh-vuhoang2708s-projects.vercel.app
=> Aliased:
https://delivering-happiness.vercel.app
```

`VERIFIED`

```text
vercel inspect https://delivering-happiness.vercel.app
id: dpl_EEH2Jkyz3dH8hLf7toDJtNAnG6ou
target: production
status: Ready
created: 2026-06-17 12:31 ICT
```

`VERIFIED`

Second public deploy after production backend cutover:

```text
vercel --prod --yes
=> Production deployment:
https://delivering-happiness-714m0pyrt-vuhoang2708s-projects.vercel.app
=> Aliased:
https://delivering-happiness.vercel.app
```

### Public content probes

`VERIFIED`

`curl.exe -L https://delivering-happiness.vercel.app/register.html`

- contains `Chi phí xác nhận giữ chỗ hiện tại: 3.000đ`
- contains `VA SePay 96247ABCD / BIDV 1300244416`
- contains `window.CUSTOM_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxx.../exec"`
- contains dynamic payment success elements:
  `successPaymentCode`, `successTransferContent`, `successPaymentQr`,
  `successPaymentStatus`, `successZaloGroupLink`

`VERIFIED`

`curl.exe -L https://delivering-happiness.vercel.app/dh8/`

- contains same live payment flow copy/config
- contains updated radio-item CSS block with checked/focus states

`VERIFIED`

`curl.exe -L https://delivering-happiness.vercel.app/register.js`

- fallback URL now equals `AKfycbxxbba8bvb7H2Em179HgJUv0Tj8dnxWIuGynmVqjDcPVwADrTBXxx7UwE5AKroIQR5i`
- payment modal copy and QR fallback strings updated

`VERIFIED`

Public frontend after production backend cutover:

```text
curl.exe -L https://delivering-happiness.vercel.app/register.html
=> NO_STAGING_MARKER
=> FOUND_PROD_MARKER

curl.exe -L https://delivering-happiness.vercel.app/register.js
=> JS_PROD_OK
```

`VERIFIED`

Negative markers after deploy:

```text
curl.exe -L https://delivering-happiness.vercel.app/register.html
=> NO_OLD_MARKERS

curl.exe -L https://delivering-happiness.vercel.app/dh8/
=> NO_OLD_MARKERS
```

Old markers checked:

```text
8815369431
9600006868
AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg
```

### Backend probe

`VERIFIED`

```text
curl.exe -L "https://script.google.com/macros/s/AKfycbxxbba8bvb7H2Em179HgJUv0Tj8dnxWIuGynmVqjDcPVwADrTBXxx7UwE5AKroIQR5i/exec?action=getHealth&token=DHM8_SECURE_2026"
=> {"success":true,"environment":"PRODUCTION","spreadsheetId":"1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA","officialAccountNumber":"1300244416","sepayWebhookTokenConfigured":true,"amount":3000}

curl.exe -L "https://script.google.com/macros/s/AKfycbxxbba8bvb7H2Em179HgJUv0Tj8dnxWIuGynmVqjDcPVwADrTBXxx7UwE5AKroIQR5i/exec?action=checkStatus&uuid=smoke&callback=dhm8Jsonp_ABCDEFGHIJKLMNOPQRST"
=> dhm8Jsonp_ABCDEFGHIJKLMNOPQRST({"success":false,"error":"NOT_FOUND"});
```

## Important Reality Check

`VERIFIED`

- Public frontend hiện đã được cấu hình chạy với production Apps Script URL
  `AKfycbxx...`.
- Production Apps Script URL cũ đã được nâng lên gate 2 bootstrap và tự
  bootstrap được:
  - `ENVIRONMENT=PRODUCTION`
  - `SPREADSHEET_ID=1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`
  - `OFFICIAL_ACCOUNT_NUMBER=1300244416`
  - `SEPAY_WEBHOOK_TOKEN` fallback legacy đã tồn tại

`UNVERIFIED`

- Luồng gửi mail thật với registration mới trên public route sau backend
  production cutover này.
- Một đăng ký mới đi từ public form -> production sheet -> email -> payment poll
  trên public browser đã được nghiệm thu trực tiếp bằng browser evidence.

## Attempted But Not Completed

`VERIFIED`

- Đã mirror được Apps Script production legacy script
  `1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS`
  về:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm8_gate2_clasp_production_20260617
```

- Pulled files:
  - `.clasp.json`
  - `appsscript.json`
  - `Mã.js`

- `Mã.js` trước khi nâng xác nhận production legacy chỉ là flow cũ:
  - chỉ có `doPost`
  - không có `checkStatus`
  - không có `registrationUuid`
  - không có `processEmailQueue`
  - không có `buildPaymentCodeFromPhone`
  - không có fail-closed config model của gate 2

`VERIFIED`

- Đã push + deploy production Apps Script legacy URL `AKfycbxx...` lên version
  `@5` với mô tả:
  `DHM8 production gate2 bootstrap 20260617`

## Remaining Verification Gap

`UNVERIFIED`

- Controlled live registration mutation qua direct `curl` POST vào Apps Script
  production chưa tạo được bằng chứng đủ mạnh, do Web App trả `302` và khi ép
  follow redirect bằng `curl --post302` thì rơi vào trang Google Drive
  `Không tìm thấy trang`.
- Vì vậy chưa thể claim đã verify được mutation
  `POST registration -> checkStatus REGISTERED -> simulated webhook -> PAID`
  trên production lane chỉ bằng CLI probe hiện tại.
- Browser-driven live submit hoặc đọc sheet trực tiếp vẫn là bước cần thêm bằng
  chứng để chốt end-to-end thật.

## Current Claim Surface

`Live done` cho:

- public Vercel HTML/JS surfaces tại:
  - `https://delivering-happiness.vercel.app/register.html`
  - `https://delivering-happiness.vercel.app/dh8/`

`Local done` cho:

- docs update
- backup checkpoints
- source alignment in repo working tree

`UNVERIFIED` cho:

- true production data lane finalization
- email delivery for new live registrations
- real user browser journey end-to-end after this deploy
