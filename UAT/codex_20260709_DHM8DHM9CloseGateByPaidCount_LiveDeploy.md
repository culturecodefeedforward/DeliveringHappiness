# DHM8/DHM9 — kiểm chứng production sau khi đổi cổng theo số người đã thanh toán

Ngày kiểm chứng: 2026-07-09

## Phạm vi đã được duyệt

- Đẩy mã lên đúng dự án Google Apps Script production.
- Cập nhật hai deployment đang được frontend DHM8 và DHM9 sử dụng.
- Chỉ probe HTTP read-only sau triển khai.
- Không gửi form đăng ký, không thanh toán test, không sửa Google Sheet.
- Không commit/push Git, không deploy Vercel.

## Backup

`VERIFIED` — bản trước triển khai được lưu tại:

`Artifacts/deploy_backups/20260709_AppsScriptPaidCountGate_before_deploy/`

Các file chính:

- `Mã.before.js`
- `appsscript.before.json`
- `.clasp.before.json`
- `clasp_deployments_before.txt`
- `clasp_deployments_before_production.txt`

## Target và triển khai

`VERIFIED`

- Apps Script project ID: `1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS`
- Production package: `Artifacts/dhm8_gate2_clasp_production_20260617`
- `clasp push -f`: đã đẩy 2 file.
- Version mới: `58`.
- DHM8 deployment:
  `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`
- DHM9 deployment:
  `AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ`
- Cả hai deployment đã được cập nhật sang version `58`.

## Probe production read-only

### DHM8

`VERIFIED` — HTTP 200:

```text
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"OPEN","registrationOpen":true,"cap":40,"paidCount":26,"dataRowCount":41,"countBasis":"PAID","interestLink":"https://delivering-happiness.vercel.app/interest.html"});
```

### DHM9

`VERIFIED` — HTTP 200:

```text
dh9Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"OPEN","registrationOpen":true,"cap":40,"paidCount":17,"dataRowCount":28,"countBasis":"PAID","interestLink":"https://delivering-happiness.vercel.app/interest_dh9.html"});
```

## Ma trận kiểm chứng bề mặt

| Bề mặt kiểm chứng | Phương pháp | Kỳ vọng | Trạng thái |
| --- | --- | --- | --- |
| Local files | Node syntax, zero-diff mirror, grep logic | Gate dùng `paidCount`, không dùng tổng số dòng | `VERIFIED` — xem Local UAT |
| Apps Script deployment | `clasp push`, version và deployment update | Hai endpoint chạy version 58 | `VERIFIED` |
| Public Apps Script URLs | Probe HTTP trực tiếp DHM8/DHM9 | HTTP 200, có `countBasis: "PAID"` | `VERIFIED` |
| Public frontend URLs | Không thay frontend/Vercel trong lane này | Không áp dụng cho thay đổi backend | `UNVERIFIED / OUT OF SCOPE` |
| Browser evidence | Không thay layout/UI | Không áp dụng cho thay đổi backend | `UNVERIFIED / OUT OF SCOPE` |
| Kết luận | Đối chiếu đúng bề mặt Apps Script gate | Cổng đăng ký mới dựa trên số `PAID` | `VERIFIED` |

## Kết luận

`VERIFIED Live done` trong đúng bề mặt Apps Script gate:

- DHM8 và DHM9 hiện đóng đăng ký mới khi `paidCount >= 40`.
- Hiện tại cả hai vẫn mở vì DHM8 có 26 và DHM9 có 17 thanh toán thành công.
- Git chưa được commit/push; việc đó không ảnh hưởng runtime Apps Script hiện tại,
  nhưng source local và remote Git chưa đồng bộ với production.

## Rủi ro còn lại

- Các đăng ký `PENDING` đã tồn tại vẫn có thể tiếp tục thanh toán sau khi cổng
  đăng ký mới đóng; tổng số `PAID` có thể vượt 40. Đây là semantics đã ghi trong
  plan, không phải hard cap thanh toán tuyệt đối.
- Nếu một lần triển khai Apps Script tương lai lấy code cũ từ Git, rule production
  có thể bị ghi đè. Cần commit/push riêng để đồng bộ nguồn chuẩn khi người dùng duyệt.
