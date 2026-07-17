# 📅 Lộ trình Phát triển (Project Roadmap)

Lộ trình lưu trữ các cột mốc lịch sử phát triển và kế hoạch nâng cấp cho hệ thống DH4HN Website.

## 1. Lịch sử Phiên bản (Version History)

### Phiên bản 1.0 (Tháng 04/2026) - Khởi tạo CRM
*   **Hoàn thành tích hợp CRM:** Xây dựng Webhook của Google Apps Script xử lý dữ liệu và lưu vào CRM Google Sheet.
*   **Sửa lỗi CORS & Email:** Giải quyết lỗi phân quyền CORS khi gửi form từ trình duyệt và bật tính năng gửi mail thông báo tự động cho BTC thông qua Apps Script.

### Phiên bản 2.0 (Tháng 06/2026) - Chiến dịch DHM8
*   **Mở đăng ký Masterclass DHM8:** Cập nhật thông tin Landing Page chính cho chiến dịch khóa học Delivering Happiness Masterclass 8 khai giảng ngày 04/07/2026.
*   **Reactivate Native Form:** Kích hoạt lại biểu mẫu native (`register.html`) với tính năng thanh toán kép (Dual Payment Accounts: tích hợp VietQR và thông tin tài khoản chuyển khoản ngân hàng).
*   **Định tuyến tĩnh /dh8:** Tạo thư mục con tĩnh `/dh8` làm lối tắt chuyển hướng trang đăng ký.
*   **Workspace MCP Integration:** Xác thực thành công tài khoản quản trị `culturecodeproject@gmail.com` với Workspace MCP để cho phép AI tự động hóa quản lý Sheets và gửi email thông báo qua Gmail API.

### Phiên bản 3.0 (Tháng 07/2026) - Khảo sát Giá trị Cốt lõi, Thực hành ABCDE & Tăng cường Bảo mật (Hiện tại)
*   **Tích hợp La bàn Giá trị Cá nhân (Personal Value Compass):** Phát triển tính năng khảo sát 41 giá trị sống cốt lõi, cơ chế so sánh đúp Top 7, vẽ radar chart (Chart.js), xuất PDF (html2pdf.js) và gửi mail báo cáo tự động cho người dùng.
*   **Trang thực hành Lạc quan ABCDE tương tác & RAG tri thức:** Phát triển trang thực hành tương tác độc lập (`practice-abcde.html`) cho phép học viên quét mã QR từ slide để điền bài làm và đối chiếu song song với 18 case study chuẩn (bao gồm 3 tình huống bóc băng trực tiếp từ file audio bài giảng) được lưu trữ dưới dạng cơ sở dữ liệu JSON tĩnh.
*   **Cập nhật Đăng ký DHM9:** Mở rộng luồng dữ liệu sang phân hệ Delivering Happiness Masterclass 9 tại Hà Nội (`register_dh9_hanoi.html`).
*   **Tăng cường Bảo mật & Chống Spam:**
    *   *Math Puzzle CAPTCHA:* Ngăn chặn bot spam API bằng phép cộng ngẫu nhiên và giải thuật mã hóa token ở cả client và backend.
    *   *Rate Limiting:* Giới hạn mỗi email tối đa 3 lần gửi khảo sát trong 5 phút.
    *   *Email Quota Guard:* Tự động ngắt gửi email báo cáo khi quota hàng ngày của Google còn dưới 5 email để ưu tiên tài nguyên cho luồng đăng ký chính.
    *   *HTML Escaping:* Lọc sạch mã độc đầu vào (`XSS Protection`) trước khi đẩy vào CRM Sheets hoặc email.
*   **Chuẩn hóa quy trình triển khai:** 
    *   *Frontend:* Vercel CI/CD tự động deploy từ nhánh `main` và cấu hình khóa cứng đường dẫn `/Artifacts/`, `/UAT/` trong `.vercelignore` để tránh lỗi nuốt thư mục con.
    *   *Backend:* Dùng công cụ `clasp` đẩy code trực tiếp lên Google Apps Script Web App thay thế quy trình copy/paste thủ công cũ.

## 2. Giai đoạn Tiếp theo (Future Milestones)

### Giai đoạn 3.5: CRM Tự động hóa Gửi Mail Xác nhận cho Khách hàng
*   **Mục tiêu:** Khi khách hàng đăng ký thành công qua Form, hệ thống sẽ sử dụng Gmail API thông qua Workspace MCP để tự động gửi email xác nhận đăng ký và hướng dẫn chuyển khoản (kèm mã QR cá nhân hóa) trực tiếp tới email của khách hàng.
*   **Thời gian dự kiến:** Quý 3 / 2026.

### Giai đoạn 4.0: Tích hợp Dashboard Báo cáo Đăng ký (Live Dashboard)
*   **Mục tiêu:** Xây dựng trang báo cáo nội bộ tổng hợp dữ liệu đăng ký theo thời gian thực (realtime) từ Google Sheets CRM giúp Ban tổ chức nắm bắt nhanh số lượng học viên.
*   **Thời gian dự kiến:** Cuối năm 2026.
