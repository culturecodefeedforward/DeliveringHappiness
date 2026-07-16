# 📏 Quy chuẩn Lập trình & Vận hành (Code Standards)

Tài liệu này định nghĩa các quy chuẩn lập trình, tiêu chuẩn bảo mật và quy trình quản trị mã nguồn cho dự án DH4HN Website.

## 1. Tiêu chuẩn Mã nguồn (Code Quality Standards)
*   **HTML:** Sử dụng HTML5 ngữ nghĩa (semantic tags như `<section>`, `<article>`, `<header>`). Luôn đặt thẻ tiêu đề `<title>` mô tả chính xác nội dung trang và bộ mã hóa UTF-8. **Tiêu chuẩn WCAG 2.1:** Các thành phần tương tác dạng hộp hội thoại (Modal/Dialog) phải có `role="dialog"` và `aria-modal="true"`. Các thẻ nhập liệu (`<input>`) phải được gắn nhãn `<label>` tương ứng thông qua thuộc tính `for`.
*   **CSS:** Sử dụng Vanilla CSS sạch, khai báo các biến CSS chung (CSS variables) tại khối `:root` trong `styles.css` để đồng bộ bảng màu (màu chủ đạo: `#1e3a8a`, v.v.). Tránh sử dụng CSS inline hoặc Tailwind CSS trừ khi có yêu cầu đặc biệt. **Độ tương thích & Trải nghiệm:** Kích thước vùng bấm tương tác (Touch Targets) tối thiểu là `44px` theo WCAG. Phải hỗ trợ tắt các hiệu ứng động vô hạn hoặc hiệu ứng lật khi người dùng bật cấu hình prefers-reduced-motion trên thiết bị.
*   **JavaScript:** Viết code JavaScript theo tiêu chuẩn ES6+. Các hàm xử lý sự kiện (event handlers) và tương tác API phải được đóng gói gọn gàng, sử dụng `async/await` để xử lý các cuộc gọi mạng và có xử lý ngoại lệ (try-catch). **Bẫy tiêu điểm (Focus Trap):** Khi mở Modal, tiêu điểm phải được khóa trong Modal (sử dụng phím `Tab` / `Shift+Tab`) và phải trả lại tiêu điểm về phần tử kích hoạt trước đó khi đóng Modal. Hỗ trợ phím `Escape` để thoát nhanh modal.

## 2. Tiêu chuẩn Bảo mật & Lập trình Backend (Apps Script Backend Standards)
Để tránh các lỗ hổng bảo mật phổ biến, các lập trình viên Apps Script bắt buộc phải tuân theo các quy tắc sau:
*   **HTML Escaping (Lọc mã HTML):** Mọi tham số chuỗi nhận được từ client-side (như Họ tên, Email, ý kiến đóng góp) phải đi qua hàm lọc sạch ký tự `escapeHtml_(value)` trước khi lưu vào Google Sheet hoặc dùng trong HTML Email template để ngăn ngừa lỗi tiêm mã độc `XSS` (Cross-Site Scripting).
*   **Secure JSONP Callback Verification (Xác minh Callback JSONP):** Khi viết các API hỗ trợ JSONP (qua `doGet`), hàm callback phải được xác thực bằng biểu thức chính quy (regular expression) để ngăn ngừa lỗ hổng Reflected XSS.
    *   *Mẫu regex chuẩn:* `var CALLBACK_REGEX = /^dh(?:m8|9)Jsonp_[A-Za-z0-9]{16,40}$/;`
    *   Nếu tham số callback không khớp regex, lập tức từ chối và trả về lỗi JSON thô.
*   **Không Hardcode Khóa Bí mật (No Hardcoded Secrets):** Tất cả token xác thực (như `SEPAY_WEBHOOK_TOKEN`), Spreadsheet ID, hoặc cấu hình môi trường phải được lưu trữ trong **Script Properties** (Cài đặt thuộc tính dự án) và truy xuất thông qua `PropertiesService.getScriptProperties()`. Tuyệt đối không hardcode trong file code.
*   **Email Quota Protection (Bảo vệ Hạn mức Email):** Trước khi gọi `MailApp.sendEmail()`, luôn kiểm tra quota thông qua `MailApp.getRemainingDailyQuota()`. Nếu quota còn lại dưới 5 mail/ngày, phải dừng gửi mail tự động và chỉ ghi dữ liệu vào Sheet để bảo vệ luồng đăng ký chính không bị lỗi hệ thống.

## 3. Quản lý Nhánh Git (Git Branching & Deployment Strategy)
Dự án sử dụng cơ chế chia nhánh để phân tách môi trường phát triển và môi trường công khai:
*   **Nhánh `main`:**
    *   **Môi trường:** Vercel Production (`https://delivering-happiness.vercel.app/`).
    *   **Nội dung:** Chỉ chứa Landing Page sạch công khai dành cho khách hàng đăng ký khóa học mới (không để lộ audio/video nội bộ).
*   **Nhánh `07042026`:**
    *   **Môi trường:** Vercel Preview (Link nội bộ của khóa DH7).
    *   **Nội dung:** Bản LMS chứa các bài giảng audio/video phục vụ học viên cũ.

## 4. Vận hành với Git Worktree và clasp
*   **Git Worktree:** Sử dụng `git worktree` để phân rã 2 nhánh hoạt động độc lập ở 2 thư mục local:
    *   Mở thư mục `dh4hn-website` khi phát triển trang đăng ký mới trên `main`.
    *   Mở thư mục `dh4hn-website-dh7` khi cập nhật kho bài giảng cho học viên cũ trên `07042026`.
*   **Đồng bộ clasp:** Sử dụng công cụ `clasp` (Google Command Line Apps Script Projects) để đồng bộ mã nguồn Apps Script. File cấu hình `.clasp.json` phải được quản lý cẩn thận và không bao giờ commit các token xác thực cá nhân lên Git.
