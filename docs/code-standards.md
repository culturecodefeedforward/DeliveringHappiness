# 📏 Quy chuẩn Lập trình & Vận hành (Code Standards)

Tài liệu này định nghĩa các quy chuẩn lập trình, tiêu chuẩn bảo mật và quy trình quản trị mã nguồn cho dự án DH4HN Website.

Các mục dưới đây là yêu cầu bắt buộc, không phải chứng nhận rằng mọi file hiện đã tuân thủ. Sai lệch giữa chuẩn và mã phải được ghi `UNVERIFIED` hoặc `BLOCKED` cho tới khi sửa và kiểm chứng đúng bề mặt.

## 1. Tiêu chuẩn Mã nguồn (Code Quality Standards)
*   **HTML:** Sử dụng HTML5 ngữ nghĩa (semantic tags như `<section>`, `<article>`, `<header>`). Luôn đặt thẻ tiêu đề `<title>` mô tả chính xác nội dung trang và bộ mã hóa UTF-8. **Tiêu chuẩn WCAG 2.1:** Các thành phần tương tác dạng hộp hội thoại (Modal/Dialog) phải có `role="dialog"` và `aria-modal="true"`. Các thẻ nhập liệu (`<input>`) phải được gắn nhãn `<label>` tương ứng thông qua thuộc tính `for`.
*   **CSS:** Sử dụng Vanilla CSS sạch, khai báo các biến CSS chung (CSS variables) tại khối `:root` trong `styles.css` để đồng bộ bảng màu (màu chủ đạo: `#1e3a8a`, v.v.). Tránh sử dụng CSS inline hoặc Tailwind CSS trừ khi có yêu cầu đặc biệt. **Độ tương thích & Trải nghiệm:** Kích thước vùng bấm tương tác (Touch Targets) tối thiểu là `44px` theo WCAG. Phải hỗ trợ tắt các hiệu ứng động vô hạn hoặc hiệu ứng lật khi người dùng bật cấu hình prefers-reduced-motion trên thiết bị.
*   **JavaScript:** Viết code JavaScript theo tiêu chuẩn ES6+. Các hàm xử lý sự kiện (event handlers) và tương tác API phải được đóng gói gọn gàng, sử dụng `async/await` để xử lý các cuộc gọi mạng và có xử lý ngoại lệ (try-catch). **Bẫy tiêu điểm (Focus Trap):** Khi mở Modal, tiêu điểm phải được khóa trong Modal (sử dụng phím `Tab` / `Shift+Tab`) và phải trả lại tiêu điểm về phần tử kích hoạt trước đó khi đóng Modal. Hỗ trợ phím `Escape` để thoát nhanh modal.

## 2. Tiêu chuẩn Bảo mật & Lập trình Backend (Apps Script Backend Standards)
Để tránh các lỗ hổng bảo mật phổ biến, các lập trình viên Apps Script bắt buộc phải tuân theo các quy tắc sau:
*   **HTML Escaping (Lọc mã HTML):** Mọi tham số chuỗi nhận được từ client-side (như Họ tên, Email, ý kiến đóng góp) phải đi qua hàm lọc sạch ký tự `escapeHtml_(value)` trước khi lưu vào Google Sheet hoặc dùng trong HTML Email template để ngăn ngừa lỗi tiêm mã độc `XSS` (Cross-Site Scripting).
*   **Secure JSONP Callback Verification (Xác minh Callback JSONP):** Khi viết các API hỗ trợ JSONP (qua `doGet`), hàm callback phải được xác thực bằng biểu thức chính quy (regular expression) để ngăn ngừa lỗ hổng Reflected XSS.
    *   Callback đăng ký dùng `CALLBACK_REGEX`; luồng đa chương trình dùng `PROGRAM_INTEREST_CALLBACK_REGEX`. Mỗi route phải kiểm tra đúng regex của hợp đồng đó.
    *   Nếu tham số callback không khớp regex, lập tức từ chối và trả về lỗi JSON thô.
*   **Không Hardcode Khóa Bí mật (No Hardcoded Secrets):** Tất cả token xác thực (như `SEPAY_WEBHOOK_TOKEN`), Spreadsheet ID, hoặc cấu hình môi trường phải được lưu trữ trong **Script Properties** (Cài đặt thuộc tính dự án) và truy xuất thông qua `PropertiesService.getScriptProperties()`. Tuyệt đối không hardcode trong file code.
*   **Email Quota Protection (Bảo vệ Hạn mức Email):** Trước khi gọi `MailApp.sendEmail()`, luôn kiểm tra quota thông qua `MailApp.getRemainingDailyQuota()`. Nếu quota còn lại dưới 5 mail/ngày, phải dừng gửi mail tự động và chỉ ghi dữ liệu vào Sheet để bảo vệ luồng đăng ký chính không bị lỗi hệ thống.

### Khoảng trống đã biết trong source hiện tại

*   `api/chat-abcde.js` và `Scripts/active_code_gs_final.js` còn các giá trị fallback nhạy cảm/cấu hình vận hành trong source. Không phát tán giá trị, không coi đây là cấu hình production hợp lệ và không claim tuân thủ `No Hardcoded Secrets` cho tới khi có kế hoạch loại bỏ, xoay vòng credential và UAT hồi quy.
*   Vercel API tạo HMAC cho payload ABCDE, nhưng Apps Script hiện chưa xác minh chữ ký/timestamp/nonce. Không claim chống giả mạo hoặc chống phát lại đầu-cuối.

## 3. Các Quy tắc Tuân thủ Kỹ thuật (Rules of Compliance)
*   **Rule 1 (Planning Artifacts Mirroring):** Mọi sự thay đổi về tài liệu hay file cấu trúc phải phản ánh chính xác các quy trình và được cập nhật vào thư mục `docs/`.
*   **Rule 2 & 5 (Email Standardized & Dynamic Binding Gate):** Tất cả các email template phải được chuẩn hóa và việc gán nội dung email theo chiến dịch phải thông qua cơ chế Dynamic Binding tự động (sử dụng hàm `getPaymentConfig_`), không hardcode trực tiếp vào mã nguồn.
*   **Rule 4 (Staged Deployment & Production Lock):** Mọi lệnh deploy phải tuân thủ qua môi trường UAT. Sử dụng lệnh `vercel --prod --skip-domain`, chạy UAT 3 Lớp, duyệt trước khi sử dụng `vercel promote`. Đối với backend, áp dụng `clasp push` có cổng kiểm duyệt.
*   **Evidence Status (Trạng thái bằng chứng):** Claim quan trọng phải dùng `VERIFIED`, `INFERRED`, `UNVERIFIED` hoặc `STALE/ARCHIVE`; bằng chứng source không thay thế bằng chứng browser, email, Sheet hay production.
*   **Immutable Release (Phát hành từ snapshot bất biến):** Package phải sinh từ commit đã review, kèm release manifest và release contract. Cấm deploy từ dirty root hoặc package tạm thiếu provenance.

## 4. Quản lý Nhánh Git (Git Branching & Deployment Strategy)
Dự án sử dụng cơ chế chia nhánh để phân tách môi trường phát triển và môi trường công khai:
*   **Nhánh `main`:**
    *   **Vai trò:** Nguồn ứng viên cho Vercel Production (`https://delivering-happiness.vercel.app/`). Commit/push vào `main` không tự chứng minh production đã đổi.
    *   **Nội dung:** Chỉ chứa bề mặt public đã được release inventory cho phép; dữ liệu/học liệu nội bộ không được lọt vào package.
*   **Nhánh `07042026`:**
    *   **Môi trường:** Vercel Preview (Link nội bộ của khóa DH7).
    *   **Nội dung:** Bản LMS chứa các bài giảng audio/video phục vụ học viên cũ.

## 5. Vận hành với Git Worktree và clasp
*   **Git Worktree:** Sử dụng `git worktree` để phân rã 2 nhánh hoạt động độc lập ở 2 thư mục local:
    *   Mở thư mục `dh4hn-website` khi phát triển trang đăng ký mới trên `main`.
    *   Mở thư mục `dh4hn-website-dh7` khi cập nhật kho bài giảng cho học viên cũ trên `07042026`.
*   **Đồng bộ clasp:** Sử dụng công cụ `clasp` (Google Command Line Apps Script Projects - công cụ dòng lệnh cho Apps Script) để đồng bộ mã nguồn. Trước `clasp push`, phải kiểm tra `.clasp.json`, `.claspignore`, `clasp status`, diff allowlist, backup/rollback và phê duyệt Cấp độ 3 cho exact command. Không commit token xác thực cá nhân lên Git.
