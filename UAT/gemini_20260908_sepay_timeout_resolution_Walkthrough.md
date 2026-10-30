# Báo Cáo Nghiệm Thu (Walkthrough): Khắc phục Triệt để Lỗi Timeout SePay & Cập nhật Vercel Proxy

## 1. Tóm tắt Sự cố & Kết quả Xử lý
- **Sự cố ban đầu**: SePay báo đỏ `Timeout 30.001ms` khi phát lại giao dịch `#80219327` (chuyển khoản 250.000đ cho khóa Leadership).
- **Nguyên nhân gốc rễ**:
  1. Vercel Proxy `dhm8-sepay-proxy` trỏ vào URL cũ (từ 64 ngày trước, chỉ biết DH8), không có cấu hình Lane `dhl`.
  2. Giao dịch bị đẩy nhầm vào `DHM8_Payments` và ghi nhận `NO_MATCH`.
  3. Lần phát đầu tiên bị nghẽn đồng bộ (> 30s) dẫn tới ngắt kết nối tại đúng mili-giây thứ 30.001 của SePay.
- **Kết quả xử lý**:
  - **Tài khoản học viên của Sếp**: Cả 2 dòng trên sheet **`DHL_Data`** đã chuyển thành công sang **`PAID`** (`VERIFIED`).
  - **Lịch sử giao dịch**: Sheet **`DHL_Payments`** đã được khởi tạo và ghi nhận đầy đủ giao dịch.
  - **Vercel Proxy**: Đã cập nhật `DEFAULT_APPS_SCRIPT_URL` và biến môi trường `DHM8_APPS_SCRIPT_URL` trên Vercel sang Deployment Apps Script **`@70`** (`AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA`).
  - **Triển khai Live**: Đã deploy thành công lên Vercel Production (`dhm8-sepay-proxy.vercel.app`, Deployment ID `dpl_Aff5rKLLZbtGezC6CevfewYFhadv`).
  - **Kiểm thử Live Webhook**: Gửi payload mô phỏng tới live endpoint nhận phản hồi **`HTTP 200 OK` trong 4.31 giây** (`VERIFIED`).

---

## 2. Bằng chứng Kiểm chứng (Verification Evidence)

### A. Trạng thái trên Google Sheet (`1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`)
- `DHL_Data` Dòng 2: `Hoàng Công Nguyên Vũ` (SĐT `0909028088`) ➔ **`PAID`**
- `DHL_Data` Dòng 3: `Hoàng Công Nguyên Vũ` (SĐT `0983453144`) ➔ **`PAID`**
- `DHL_Payments`: Giao dịch khớp mã `DHL909028088` ➔ **`MATCHED`**

### B. Triển khai Vercel Proxy Production
- Deployment URL: `https://dhm8-sepay-proxy.vercel.app`
- Trạng thái: `READY`
- Biến môi trường: `DHM8_APPS_SCRIPT_URL` trỏ trực tiếp về Apps Script Deployment `@70`.

### C. Live UAT Probe
- Lệnh: `python scratch/test_sepay_exact.py`
- Endpoint: `https://dhm8-sepay-proxy.vercel.app/api/sepay-dh?token=DHM8_SECURE_2026`
- Kết quả: `SUCCESS in 4.31s! Status: 200`
- Response: `{"success":true,"forwarded":true,"upstreamStatus":200,"upstream":{"success":true,"duplicate":true}}`
