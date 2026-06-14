# 📏 Quy chuẩn Lập trình & Vận hành (Code Standards)

Tài liệu này định nghĩa các quy chuẩn lập trình và quy trình quản trị mã nguồn cho dự án DH4HN Website.

## 1. Tiêu chuẩn Mã nguồn (Code Quality Standards)
*   **HTML:** Sử dụng HTML5 ngữ nghĩa (semantic tags như `<section>`, `<article>`, `<header>`). Luôn đặt thẻ tiêu đề `<title>` mô tả chính xác nội dung trang và bộ mã hóa UTF-8.
*   **CSS:** Sử dụng Vanilla CSS sạch, khai báo các biến CSS chung (CSS variables) tại khối `:root` trong `styles.css` để đồng bộ bảng màu (màu chủ đạo: `#1e3a8a`, v.v.). Tránh sử dụng CSS inline hoặc Tailwind CSS trừ khi có yêu cầu đặc biệt.
*   **JavaScript:** Viết code JavaScript theo tiêu chuẩn ES6+. Các hàm xử lý sự kiện (event handlers) và tương tác API phải được đóng gói gọn gàng, sử dụng `async/await` để xử lý các cuộc gọi mạng và có xử lý ngoại lệ (try-catch).

## 2. Quản lý Nhánh Git (Git Branching & Deployment Strategy)
Dự án sử dụng cơ chế chia nhánh nghiêm ngặt để phân tách môi trường phát triển nội bộ và môi trường công khai:

*   **Nhánh `main`:**
    *   **Môi trường:** Vercel Production (`https://dh-crm-landing.vercel.app/`).
    *   **Nội dung:** Chỉ chứa Landing Page sạch công khai dành cho khách hàng đăng ký khóa học mới (không để lộ audio/video nội bộ).
*   **Nhánh `07042026`:**
    *   **Môi trường:** Vercel Preview (Link nội bộ của khóa DH7).
    *   **Nội dung:** Bản LMS chứa các bài giảng audio/video phục vụ học viên cũ.

## 3. Vận hành song song với Git Worktree
Để tránh việc chuyển đổi nhánh liên tục gây nhầm lẫn trên cùng một thư mục, lập trình viên bắt buộc phải sử dụng `git worktree` để phân rã 2 nhánh hoạt động độc lập ở 2 thư mục local:
*   Mở thư mục `dh4hn-website` khi phát triển trang đăng ký mới trên `main`.
*   Mở thư mục `dh4hn-website-dh7` khi cập nhật kho bài giảng cho học viên cũ trên `07042026`.
