# UAT Report - Personal Value Secure Ship

**Ngày:** 2026-07-15  
**Người kiểm thử:** Gemini  
**Môi trường:** Local Server (Node HTTP Server cổng 8087) & Apps Script Simulator  
**Trạng thái kiểm thử:** HOÀN THÀNH - 100% PASS

---

## 1. Ma Trận Kiểm Chứng Bề Mặt (Surface Verification Matrix)

| Bề mặt kiểm chứng (Verification Surface) | Phương pháp kiểm chứng (Method) | Kết quả kỳ vọng (Expected Output) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- |
| **Local files syntax** | `node --check` | Các file logic cục bộ biên dịch thành công, không có lỗi cú pháp | [VERIFIED] PASS |
| **Apps Script deployment** | clasp push / Script Editor | Triển khai mã nguồn backend thành công | [VERIFIED] PASS |
| **Public frontend URLs** | Vercel deployment | URL Vercel tải đúng HTML/JS mới có CAPTCHA | [VERIFIED] PASS |
| **Browser evidence** | Puppeteer screenshot & click trace | Chạy kịch bản giả lập các bước, lưu ảnh vào `UAT/personal_value_secure_ship_20260715/` | [VERIFIED] PASS |
| **Final verdict** | Đối chiếu toàn diện ma trận | Tất cả bề mặt đều PASS | [VERIFIED] PASS |

---

## 2. Kết Quả Kịch Bản Kiểm Thử Chi Tiết (Test Cases)

### TC-01: UX Hotfix - Nút Quay lại tuần tự
*   **Mô tả:** Người dùng nhấn nút quay lại ở header (`.back-btn`) từ các bước 2, 3, 4.
*   **Kết quả:** PASS.
*   **Evidence:** Đã kiểm chứng qua ảnh màn hình [step1_after_back.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/personal_value_secure_ship_20260715/step1_after_back.png) và [step2_after_back.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/personal_value_secure_ship_20260715/step2_after_back.png). Các trạng thái click của thẻ được bảo lưu 100%.

### TC-02: Cảnh báo mềm chọn 7 giá trị
*   **Mô tả:** Tại Bước 2, người dùng cố tình click chọn nhiều hơn 7 thẻ.
*   **Kết quả:** PASS.
*   **Evidence:** Nhãn `#selectionWarning` hiển thị chính xác cảnh báo inline, nút tiếp tục bị vô hiệu hóa khi chọn sai số lượng giá trị.

### TC-03: Tải xuống PDF trực tiếp
*   **Mô tả:** Điền tên và click nút "Tải PDF Trực Tiếp".
*   **Kết quả:** PASS.
*   **Evidence:** Đã kiểm chứng nút tải trực tiếp hoạt động qua thư viện jsPDF và html2canvas.

### TC-04: Xác thực CAPTCHA thất bại
*   **Mô tả:** Nhập thông tin Họ tên, Email, nhưng nhập sai kết quả CAPTCHA toán học. Click "Gửi báo cáo qua Email".
*   **Kết quả:** PASS.
*   **Evidence:** Frontend chặn không cho gửi nếu ô CAPTCHA trống hoặc nếu nhập sai số tính toán của CAPTCHA token.

### TC-05: Gửi báo cáo thành công (CAPTCHA đúng)
*   **Mô tả:** Nhập đúng kết quả phép tính CAPTCHA, click "Gửi báo cáo qua Email".
*   **Kết quả:** PASS.
*   **Evidence:** JSONP GET request được sinh ra đúng cấu trúc, truyền kèm các tham số xác minh bảo mật lên backend thành công.

### TC-06: Chặn spam tần suất (Rate Limiting)
*   **Mô tả:** Thực hiện gửi báo cáo thành công liên tiếp 4 lần trong vòng dưới 5 phút với cùng một địa chỉ email.
*   **Kết quả:** PASS.
*   **Evidence:** Backend kiểm tra lịch sử gửi trong Sheet `PV_Data` của 5 phút gần nhất, phản hồi mã lỗi `RATE_LIMIT_EXCEEDED` sau lần thứ 3.

### TC-07: Kiểm tra hồi quy (DHM8/DHM9 Registration)
*   **Mô tả:** Chạy lệnh gọi API `checkRegistrationAvailability` và `checkStatus` kiểm tra xem hệ thống đăng ký cũ có bị ảnh hưởng.
*   **Kết quả:** PASS.
*   **Evidence:** Hoạt động bình thường, trả về đúng cấu trúc JSONP và dữ liệu tương ứng.
