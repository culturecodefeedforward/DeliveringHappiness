# 📂 Tóm tắt Codebase (Codebase Summary)

Thư mục gốc chứa các trang tĩnh, tệp cấu hình phong cách và các kịch bản chạy thử nghiệm. Dưới đây là mô tả chi tiết:

## 1. Các trang giao diện chính (Core UI Pages)
*   `index.html`: Giao diện trang chủ công khai (Landing Page). Chứa thông tin giới thiệu chương trình, lộ trình khóa học và nút định hướng đăng ký.
*   `register.html`: Biểu mẫu đăng ký native cho khóa học Delivering Happiness Masterclass 8. Hỗ trợ hiển thị mã VietQR động và điền nhanh thông tin.
*   `register_cc101.html`: Biểu mẫu đăng ký cho khóa học CultureCode 101.
*   `lms_dashboard.html` / `login.html`: Trang quản trị nội bộ dành cho học viên DH7 cũ.
*   `dh8/index.html`: Định tuyến tĩnh cho lối tắt `/dh8`.

## 2. Kịch bản logic & CSS (Scripts & Styles)
*   `styles.css` / `quiz.css`: Định nghĩa phong cách giao diện Glassmorphism và layout responsive.
*   `register.js`: Quản lý trạng thái biểu mẫu đăng ký, tính toán mã QR thanh toán động và gọi Webhook gửi dữ liệu CRM.
*   `script.js`: Xử lý các hiệu ứng động trên trang chủ (cuộn trang mượt, tương tác micro-animations).
*   `tracking.js`: Bộ theo dõi phân tích hành vi cuộn trang và lượt truy cập của người dùng.

## 3. Thư mục và tệp tin bổ sung
*   `docs/`: Thư mục chứa tài liệu đặc tả và hướng dẫn kỹ thuật của dự án.
*   `Implementation Plan/`: Lưu trữ kế hoạch chi tiết cho từng giai đoạn cập nhật mã nguồn (phiên bản hóa theo định dạng ngày).
*   `UAT/`: Chứa kết quả kiểm thử nghiệm thu người dùng (UAT reports) và bằng chứng kiểm thử giao diện thực tế.
