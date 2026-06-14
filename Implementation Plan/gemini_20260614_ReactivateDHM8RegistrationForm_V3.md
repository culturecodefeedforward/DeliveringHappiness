## Đề bài (Objective)
Cập nhật biểu mẫu đăng ký native (`register.html`) để chứa đầy đủ các trường thông tin theo đúng Google Form mới nhất của lớp **Delivering Happiness Masterclass Retreat** tại URL:
`https://docs.google.com/forms/d/e/1FAIpQLScx2XsoblKXpi8v5YQmjYdEwhgi4I-iONm_svnfQ3elG0RgOg/viewform`
Ngoại trừ câu hỏi cuối cùng về địa điểm tổ chức (Hà Nội, Hồ Chí Minh...) vì địa điểm này đã được chốt và thiết lập cố định trên trang web (Trung tâm đào tạo Circle K, Hồ Chí Minh, ngày 04/07/2026).
Biểu mẫu cần bổ sung hộp thông tin thanh toán (`payment-info`) với 2 tài khoản thanh toán cho cá nhân (BIDV - Hà Ngọc Hoàn) và tổ chức/doanh nghiệp (MB - HIPER CONSULTING) từ CC101, chỉ đổi cú pháp chuyển khoản thành `DHM8 - SĐT - Họ tên`.
Dữ liệu đăng ký được thu thập và lưu trữ vào CRM Google Sheets thông qua hệ thống Apps Script Webhook.

## Hiện trạng (Current State)
- Google Form mới nhất yêu cầu nhiều thông tin chi tiết về người đăng ký bao gồm: Họ tên, Email, SĐT, Tên công ty, Chức danh, Quy mô công ty, Nguồn biết đến chương trình, Các khóa đã học của CultureCode, Mục đích tham gia, Mức độ tìm hiểu về Delivering Happiness, và 03 điều mong đợi nhất.
- File `register.html` hiện tại chỉ có một số trường cơ bản, thiếu hộp thanh toán 2 tài khoản và cần được cấu trúc lại giao diện (form layout) để hiển thị đầy đủ, gọn gàng, và trực quan các trường câu hỏi trên.

## Giải pháp kỹ thuật (Technical Solution)
1. **Cập nhật `register.html`**:
   - Thiết lập cấu trúc lưới CSS (grid layout) để phân bổ hợp lý các trường (các trường nhập text ngắn chia thành 2 cột, các trường chọn trắc nghiệm/radio/checkbox và textarea chiếm toàn bộ chiều rộng).
   - Thêm hộp thông tin thanh toán (`payment-info`) mẫu ở ngay phía trên các trường nhập liệu của form với thông tin:
     - Chi phí hậu cần: 300.000đ.
     - Bao gồm: Tài liệu, Ăn trưa, Teabreak.
     - Tài khoản nhận phí:
       - 🏦 **Ngân hàng BIDV** (cá nhân, không cần xuất hoá đơn đỏ): `8815369431 - Hà Ngọc Hoàn`
       - 🏦 **Ngân hàng MB** (doanh nghiệp, cần xuất hoá đơn đỏ): `9600006868 - CONG TY TNHH HIPER CONSULTING`
       - ✍️ **Nội dung chuyển khoản**: `DHM8 - [SĐT] - [Họ tên]`
   - Thêm các trường nhập liệu cụ thể:
     - `fullName` (Họ tên *) - text
     - `email` (Business Email *) - email
     - `phone` (Số điện thoại Zalo *) - tel
     - `company` (Tên công ty *) - text
     - `jobTitle` (Chức danh *) - text
     - `companySize` (Quy mô công ty *) - radio (các mức `<50`, `50-200`, `200-1000`, `>1000`)
     - `sourceHearing` (Nguồn biết đến chương trình *) - radio (các nguồn và lựa chọn "Khác" kèm ô nhập văn bản)
     - `attendedPrograms` (Chương trình CultureCode đã tham gia *) - text
     - `purpose` (Mục đích tham gia *) - checkbox (cho chọn nhiều hoặc nhập mục khác)
     - `happinessKnowledge` (Mức độ tìm hiểu Delivering Happiness *) - radio (3 mức)
     - `expectations` (03 điều mong đợi nhất *) - textarea
   - Giữ trường ẩn `event_id` là `DHM8_REG_040726`.

2. **Cập nhật `register.js`**:
   - Điều chỉnh logic bắt sự kiện `submit`:
     - Thu thập toàn bộ các trường dữ liệu trên form.
     - Lọc và ghép giá trị của các tùy chọn "Khác" nếu được chọn.
     - Xử lý giá trị checkbox của trường `purpose` (ghép các lựa chọn thành chuỗi cách nhau bởi dấu phẩy).
     - Gửi payload qua hàm `window.logToSheet` cho sự kiện `REGISTER_SUBMIT`.

3. **Kiểm tra và Triển khai**:
   - Thực hiện `smoke test` (kiểm tra nhanh) bằng công cụ trình duyệt để đảm bảo dữ liệu gửi đi định dạng JSON chính xác.
   - Commit và push thay đổi lên repository GitHub, kích hoạt Vercel build.

## Các file bị ảnh hưởng (Affected Files)
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.html`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.js`

## Rủi ro và Lưu ý (Risks & Notes)
- **Rủi ro:** Số lượng trường nhập liệu nhiều có thể làm form dài hơn trên thiết bị di động, cần tối ưu hóa CSS để thân thiện với UI/UX di động.
- **Lưu ý:** Chờ lệnh phê duyệt `Approve` hoặc xác nhận trực tiếp từ người dùng trước khi sửa đổi file logic.

## Auditor Review
- Kế hoạch triển khai đã sẵn sàng để Codex rà soát.
