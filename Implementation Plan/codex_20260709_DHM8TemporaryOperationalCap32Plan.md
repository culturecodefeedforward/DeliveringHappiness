# Plan: Đặt ngưỡng vận hành DHM8 là 32, giữ sĩ số công bố là 40

## Mục tiêu

- Cổng đăng ký mới DHM8 đóng khi có `32` người thanh toán thành công.
- Sĩ số công bố ngoài giao diện vẫn là `40`.
- Tám người còn lại được import sau theo quy trình riêng.
- DHM9 tiếp tục giữ ngưỡng `40`.

## Nguyên nhân cần tách hằng số

Code hiện dùng `DHM8_REGISTRATION_CAP` làm cả ngưỡng DHM8 và giá trị fallback
cho DHM9. Nếu chỉ đổi hằng số này từ `40` thành `32`, một lần deploy DHM9 sau
đó có thể làm DHM9 vô tình nhận ngưỡng `32`.

Giải pháp tối thiểu là tách hai hằng số:

- `DHM8_REGISTRATION_CAP = 32`
- `DHM9_REGISTRATION_CAP = 40`

## File allowlist

### Code

- `Scripts/active_code_gs_final.js`
- `Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js`
- `Artifacts/dhm9_apps_script_prod_deploy_20260701_174939/Mã.js`

### Tài liệu và bằng chứng

- `docs/DHM8_REGISTRATION_PAYMENT_WORKFLOW.md`
- `Implementation Plan/codex_20260709_DHM8TemporaryOperationalCap32Plan.md`
- `UAT/codex_20260709_DHM8TemporaryOperationalCap32_LiveUAT.md`
- `Artifacts/deploy_backups/20260709_DHM8TemporaryOperationalCap32_before_deploy/`

## Ngoài phạm vi

- Không sửa `index.html`, `register.html`, `register_dh9_hanoi.html`.
- Không thay chữ công bố sĩ số `40`.
- Không deploy Vercel.
- Không sửa Google Sheet, gửi email, submit form hay chạy thanh toán test.
- Không cập nhật deployment DHM9.
- Không commit/push Git.

## Backup và quay lui

Trước khi sửa/deploy:

- Sao lưu code và `.clasp.json` của production package.
- Lưu danh sách deployment hiện tại.

Nếu probe sau deploy không đạt:

- Khôi phục code backup.
- Tạo version rollback.
- Cập nhật riêng deployment DHM8 về version rollback.

## Kiểm chứng

### Local

- `node --check` cho cả ba bản code.
- Zero-diff giữa ba bản code sau sửa.
- Grep xác nhận DHM8 = 32 và DHM9 = 40.
- Grep xác nhận nội dung frontend vẫn ghi 40.

### Production

- Tạo version Apps Script mới.
- Chỉ cập nhật deployment DHM8:
  `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`
- Probe read-only `checkRegistrationAvailability`.
- Kỳ vọng DHM8 trả `cap: 32`, `countBasis: "PAID"`.
- Probe DHM9 để xác nhận vẫn trả `cap: 40`.

## Ranh giới phê duyệt

Yêu cầu trực tiếp “update dh8 cap là 32” được hiểu là cho phép thay đổi và cập
nhật production DHM8 trong đúng phạm vi trên. Không bao gồm commit/push Git,
Vercel deploy, Google Sheet mutation hoặc deployment DHM9.
