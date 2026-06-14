# 📅 Lộ trình Phát triển (Project Roadmap)

Lộ trình lưu trữ các cột mốc lịch sử phát triển và kế hoạch nâng cấp cho hệ thống DH4HN Website.

## 1. Lịch sử Phiên bản (Version History)

### Phiên bản 1.0 (Tháng 04/2026)
*   **Hoàn thành tích hợp CRM:** Xây dựng Webhook của Google Apps Script xử lý dữ liệu và lưu vào CRM Google Sheet.
*   **Fix CORS & Email:** Giải quyết lỗi phân quyền CORS và bật tính năng gửi mail thông báo tự động cho BTC thông qua Apps Script.

### Phiên bản 2.0 (Tháng 06/2026)
*   **Mở đăng ký Masterclass DHM8:** Cập nhật thông tin Landing Page chính cho chiến dịch khóa học Delivering Happiness Masterclass 8 khai giảng ngày 04/07/2026.
*   **Reactivate Native Form:** Kích hoạt lại biểu mẫu native (`register.html`) với tính năng thanh toán kép (Dual Payment Accounts: tích hợp VietQR và thông tin tài khoản chuyển khoản ngân hàng).
*   **Định tuyến tĩnh /dh8:** Tạo thư mục con tĩnh `/dh8` làm lối tắt chuyển hướng trang đăng ký.
*   **Workspace MCP Integration:** Xác thực thành công tài khoản quản trị `culturecodeproject@gmail.com` với Workspace MCP để cho phép AI tự động hóa quản lý Sheets và gửi email thông báo qua Gmail API.

## 2. Giai đoạn Tiếp theo (Future Milestones)

### Giai đoạn 2.5: CRM Tự động hóa Gửi Mail Xác nhận cho Khách hàng
*   **Mục tiêu:** Khi khách hàng đăng ký thành công qua Form, hệ thống sẽ sử dụng Gmail API thông qua Workspace MCP để tự động gửi email xác nhận đăng ký và hướng dẫn chuyển khoản (kèm mã QR cá nhân hóa) trực tiếp tới email của khách hàng.
*   **Thời gian dự kiến:** Quý 3 / 2026.

### Giai đoạn 3.0: Tích hợp Dashboard Báo cáo Đăng ký (Live Dashboard)
*   **Mục tiêu:** Xây dựng trang báo cáo nội bộ tổng hợp dữ liệu đăng ký theo thời gian thực (realtime) từ Google Sheets CRM giúp Ban tổ chức nắm bắt nhanh số lượng học viên.
*   **Thời gian dự kiến:** Cuối năm 2026.
