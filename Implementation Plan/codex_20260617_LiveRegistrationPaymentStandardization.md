# DHM8 Live Registration Payment Standardization

Date: 2026-06-17

## Objective

Trong 1 giờ tới, chuẩn hóa các bề mặt có thể làm ngay mà không cần user thao tác
tay để luồng đăng ký + thanh toán DHM8 sẵn sàng hơn cho chạy thật trên môi
trường public.

## Current Findings

`VERIFIED`

- Public frontend hiện đang serve từ:
  `https://delivering-happiness.vercel.app/register.html`
- Public `register.js` đã chứa luồng SePay mới:
  - popup sau thanh toán
  - payment code `DH8` + số
  - poll `paymentStatus`
- Public `register.html` vẫn còn copy cũ:
  - tài khoản BIDV `8815369431`
  - tài khoản MB `9600006868`
  - cú pháp `DHM8 - [SĐT] - [Họ tên]`
- `register.js` và `tracking.js` mặc định vẫn trỏ tới Web App URL cũ:
  `AKfycbxxbba8bvb7H2Em179HgJUv0Tj8dnxWIuGynmVqjDcPVwADrTBXxx7UwE5AKroIQR5i`
- Web App URL cũ hiện trả text kiểu legacy `Webhook is active!`, không phải flow
  DHM8 gate 2.
- Web App URL mới:
  `AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg`
  đang trả `checkStatus` đúng schema DHM8 mới.
- README/deployment guide còn trỏ nhầm production URL cũ `dh-crm-landing`.

`INFERRED`

- Frontend public hiện đang ở trạng thái lai:
  UI copy/payment instruction cũ nhưng JS nghiệp vụ mới.
- Nếu cutover live lúc này, user có thể thấy hướng dẫn chuyển khoản sai bề mặt
  dù polling/payment modal đã đúng flow mới.

## Scope This Round

1. Tạo checkpoint backup trước khi sửa.
2. Chuẩn hóa source-of-truth cho frontend:
   - cấu hình endpoint
   - copy thanh toán
   - success state
3. Cập nhật tài liệu vận hành bị stale.
4. Thử mirror Apps Script production legacy về artifact riêng để đánh giá khả
   năng nâng production backend mà không đổi URL public.

## Files Expected

- `register.html`
- `dh8/index.html`
- `register.js`
- `tracking.js`
- `docs/deployment-guide.md`
- `Artifacts/checkpoints/dhm8_live_standardization_20260617_*`
- `Artifacts/dhm8_gate2_clasp_production_20260617/` nếu mirror thành công
- `UAT/dhm8_live_standardization_20260617.md`

## Verification Plan

- `node --check register.js`
- `curl.exe -L https://delivering-happiness.vercel.app/register.html`
- `curl.exe -L https://delivering-happiness.vercel.app/register.js`
- probe `checkStatus` against chosen Apps Script URL
- compare local HTML/JS against public after deploy-capable step nếu có

## Backup Plan

- Tạo thư mục checkpoint timestamped trong `Artifacts/checkpoints/`
- Copy nguyên trạng:
  - `register.html`
  - `dh8/index.html`
  - `register.js`
  - `tracking.js`
  - `api/sepay-dh.js`
  - `Scripts/active_code_gs_final.js`

## Approval Boundary

This round will avoid, unless separately justified by direct user request:

- real-money transfer
- manual SePay dashboard mutation
- Gmail queue send thử bằng dữ liệu thật

If production Apps Script push/deploy becomes clearly safe and feasible from
workspace evidence, it is aligned with the user objective but still must be
reported explicitly as a high-risk mutation in the final status.
