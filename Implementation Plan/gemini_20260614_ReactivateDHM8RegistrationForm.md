## Đề bài (Objective)
Cập nhật và tối ưu hóa biểu mẫu đăng ký native (event registration form) của khóa **Delivering Happiness Masterclass (DHM8)** diễn ra vào ngày **Thứ Bảy, 04/07/2026**. Biểu mẫu cần được clone (sao chép cấu hình câu hỏi) chính xác từ Google Form thực tế của sự kiện, bổ sung thông tin thanh toán học phí và gửi dữ liệu trực tiếp về hệ thống CRM (Customer Relationship Management - quản lý quan hệ khách hàng) qua Google Sheets Webhook.

## Hiện trạng (Current State)
- File `register.html` hiện tại chỉ chứa các trường thông tin cơ bản: Họ tên, SĐT, Email, Người giới thiệu, và một câu hỏi khảo sát khóa học khác (NVC, AI).
- Google Form thực tế của sự kiện có bộ câu hỏi cụ thể hơn bao gồm: Mong đợi từ chương trình và Cảm nhận/Hiểu biết về Delivering Happiness.
- Form đăng ký hiện tại chưa hiển thị hộp thông tin thanh toán (payment box) như form của lớp `CC101` (CultureCode 101), trong khi sự kiện DHM8 có phí tham dự là 300.000 VNĐ cần chuyển khoản tới ngân hàng HSBC của chủ tài khoản Nguyễn Ngọc Khánh Ngân.

## Giải pháp kỹ thuật (Technical Solution)
1. **Cập nhật `register.html`**:
   - Thêm hộp thông tin chuyển khoản thanh toán (`payment-info`) ở ngay phía trên các trường nhập liệu của form với thông tin:
     - Số tiền: 300.000 VNĐ.
     - Tài khoản: STK `092292341001` - Ngân hàng **HSBC** - **Nguyễn Ngọc Khánh Ngân**.
     - Cú pháp chuyển khoản: `DHM8 - SĐT - Họ tên`.
   - Cập nhật các trường nhập liệu (form inputs) để khớp chính xác với Google Form:
     - `fullName` (Họ Tên) - Bắt buộc (Required).
     - `email` (Email) - Bắt buộc (Required).
     - `phone` (Số điện thoại liên hệ (Zalo)) - Bắt buộc (Required).
     - `expectations` (03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì?) - Bắt buộc (Required) - Định dạng textarea.
     - `happinessThought` (Bạn đã tìm hiểu gì về "Delivering Happiness" chưa? Hãy chia sẻ một chút về cách bạn nghĩ về hạnh phúc.) - Không bắt buộc (Optional) - Định dạng textarea.
   - Loại bỏ các trường thông tin không liên quan của form cũ (như `referrerName`, `referrerPhone`, và phần khảo sát khóa học NVC/AI).
   - Thêm trường ẩn `event_id` với giá trị là `DHM8_REG_040726` để phân loại dữ liệu trên Google Sheets.

2. **Cập nhật `register.js`**:
   - Điều chỉnh logic thu thập dữ liệu form trong hàm xử lý sự kiện `submit`: thu thập các trường mới (`expectations`, `happinessThought`, `event_id`).
   - Gọi hàm `window.logToSheet` để đẩy payload dữ liệu về webhook.
   - Gắn tham số `type: 'EVENT_LEAD_DHM8'` và `source: 'Web_DHM8_Official'`.

3. **Kiểm tra và Triển khai**:
   - Sử dụng Trình duyệt `Browser Tool` (Công cụ trình duyệt) để kiểm thử khói `smoke test` (chạy thử nghiệm nhanh) luồng gửi biểu mẫu.
   - Thực hiện quy trình commit và push mã nguồn lên nhánh hiện tại.
   - Đồng bộ hóa bản dựng build và theo dõi triển khai live trên Vercel.

## Các file bị ảnh hưởng (Affected Files)
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.html`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.js`

## Rủi ro và Lưu ý (Risks & Notes)
- **Rủi ro:** Google Sheets Webhook URL cần đảm bảo hoạt động bình thường để ghi nhận lead đăng ký mới.
- **Lưu ý:** Chờ lệnh phê duyệt `Approve` hoặc xác nhận trực tiếp từ người dùng trước khi sửa đổi file logic.

## Auditor Review
- Kế hoạch triển khai đã sẵn sàng để Codex rà soát.
