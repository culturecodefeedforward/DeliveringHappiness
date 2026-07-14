# DHM8 temporary operational cap 32 — Live UAT

Ngày: 2026-07-09

## Yêu cầu

- Ngưỡng vận hành cổng đăng ký public DHM8: 32 người `PAID`.
- Sĩ số công bố ngoài giao diện: 40.
- Tám người còn lại sẽ được import sau.
- DHM9 không thay đổi.

## Backup

`VERIFIED`

`Artifacts/deploy_backups/20260709_DHM8TemporaryOperationalCap32_before_deploy/`

## Local verification

`VERIFIED`

- `DHM8_REGISTRATION_CAP = 32`.
- `DHM9_REGISTRATION_CAP = 40`.
- Fallback DHM9 dùng `DHM9_REGISTRATION_CAP`, không dùng hằng số DHM8.
- Ba bản code zero-diff và đều qua `node --check`.
- `index.html`, `register.html`, `register_dh9_hanoi.html` vẫn ghi 40.

## Deployment

`VERIFIED`

- Apps Script project:
  `1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS`
- Version mới: `59`.
- Chỉ cập nhật deployment DHM8:
  `AKfycbwynSXvhSbrM4YMvZbXaOFR8fW-BJ5frBiyWfwkUCH5CgcWM-gEA0uuJ4xSdXLrKbQMQg`
- Deployment DHM9 giữ nguyên version `58`.
- Không deploy Vercel, không sửa Google Sheet, không gửi email, không submit form.

## Production probes

### DHM8

`VERIFIED` — HTTP 200:

```text
{"success":true,"state":"OPEN","registrationOpen":true,"cap":32,"paidCount":26,"dataRowCount":41,"countBasis":"PAID"}
```

### DHM9

`VERIFIED` — HTTP 200:

```text
{"success":true,"state":"OPEN","registrationOpen":true,"cap":40,"paidCount":17,"dataRowCount":28,"countBasis":"PAID"}
```

## Kết luận

`VERIFIED Live done` trong đúng bề mặt Apps Script:

- DHM8 sẽ đóng đăng ký public khi đạt 32 người thanh toán thành công.
- Sĩ số công bố trên frontend vẫn là 40.
- DHM9 vẫn giữ ngưỡng 40.
