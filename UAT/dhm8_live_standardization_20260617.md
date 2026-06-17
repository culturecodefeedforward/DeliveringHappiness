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

## Local Changes Applied

`VERIFIED`

- `register.js`
  - fallback Apps Script URL đổi sang:
    `AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg`
  - giữ popup thanh toán thành công + Zalo
  - bỏ wording `test` trong QR/account fallback
- `tracking.js`
  - fallback URL đổi sang cùng Apps Script URL mới
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

### Public content probes

`VERIFIED`

`curl.exe -L https://delivering-happiness.vercel.app/register.html`

- contains `Chi phí xác nhận giữ chỗ hiện tại: 3.000đ`
- contains `VA SePay 96247ABCD / BIDV 1300244416`
- contains `window.CUSTOM_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxfb.../exec"`
- contains dynamic payment success elements:
  `successPaymentCode`, `successTransferContent`, `successPaymentQr`,
  `successPaymentStatus`, `successZaloGroupLink`

`VERIFIED`

`curl.exe -L https://delivering-happiness.vercel.app/dh8/`

- contains same live payment flow copy/config
- contains updated radio-item CSS block with checked/focus states

`VERIFIED`

`curl.exe -L https://delivering-happiness.vercel.app/register.js`

- fallback URL now equals `AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg`
- payment modal copy and QR fallback strings updated

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
AKfycbxxbba8bvb7H2Em179HgJUv0Tj8dnxWIuGynmVqjDcPVwADrTBXxx7UwE5AKroIQR5i
```

### Backend probe

`VERIFIED`

```text
curl.exe -L "https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec?action=checkStatus&uuid=41a384ee-9f23-4744-aded-6b98d4874798&callback=dhm8Jsonp_TestStatusABCDEF"
=> {"success":true,"state":"REGISTERED","registrationUuid":"41a384ee-9f23-4744-aded-6b98d4874798","paymentStatus":"PAID"}
```

## Important Reality Check

`VERIFIED`

- Public frontend hiện đã được cấu hình chạy với Apps Script URL mới
  `AKfycbxfb...`, không còn dựa vào fallback legacy `AKfycbxx...`.

`INFERRED`

- Apps Script URL mới nhiều khả năng vẫn là lane từng dùng cho staging/gate 2,
  vì source hiện hành có cơ chế `ENVIRONMENT === STAGING` cho admin actions.

`UNVERIFIED`

- Sheet/data source đứng sau `AKfycbxfb...` đã phải là final production CRM hay
  chưa.
- Luồng gửi mail thật với registration mới trên public route sau deploy này.
- Một đăng ký mới đi từ public form -> sheet -> email -> payment poll trên
  public browser đã được nghiệm thu trực tiếp bằng browser evidence.

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

- `Mã.js` xác nhận production legacy hiện vẫn là flow cũ:
  - chỉ có `doPost`
  - không có `checkStatus`
  - không có `registrationUuid`
  - không có `processEmailQueue`
  - không có `buildPaymentCodeFromPhone`
  - không có fail-closed config model của gate 2

`UNVERIFIED`

- Chưa thực hiện push/deploy nâng đúng backend production legacy URL
  `AKfycbxx...` sang logic DHM8 gate 2.

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
