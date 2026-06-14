# 🚀 Tổng quan Dự án & PDR (Product Development Requirements)

## 1. Giới thiệu dự án
Dự án Website DH4HN là nền tảng chia sẻ thông tin và cổng đăng ký chính thức cho chuỗi chương trình đào tạo của **Delivering Happiness Masterclass** (đặc biệt là phiên bản **DHM8**) và khóa học **CultureCode 101**. 

## 2. Mục tiêu chiến lược
*   **Trải nghiệm Khách hàng cao cấp:** Tối ưu hóa giao diện đăng ký dạng Native HTML/CSS giúp nâng cao tỷ lệ chuyển đổi (Conversion Rate) so với các giải pháp biểu mẫu nhúng iFrame cũ.
*   **Tích hợp CRM tự động:** Ghi nhận mọi thông tin đăng ký ngay lập tức vào Google Sheets CRM của ban tổ chức không cần server trung gian trả phí, thông qua Google Apps Script Webhook.
*   **Đo lường chi tiết:** Tích hợp bộ theo dõi hành vi cuộn trang và thời gian tương tác để cải tiến nội dung.

## 3. Các yêu cầu sản phẩm (PDR)
*   **FR-01 (Mẫu đăng ký Masterclass):** Form thu thập thông tin khách hàng cá nhân kèm theo mã VietQR tự động hiển thị theo loại vé đăng ký và thông tin người giới thiệu.
*   **FR-02 (Mẫu đăng ký CultureCode):** Form thu thập thông tin khách hàng doanh nghiệp kèm theo thông tin Công ty/Đơn vị công tác.
*   **FR-03 (Tự động hóa thông báo):** Hệ thống tự động gửi email xác nhận đăng ký về tài khoản của ban tổ chức khi có đăng ký thành công.
*   **FR-04 (Hỗ trợ định tuyến rút gọn):** Truy cập nhanh trang đăng ký thông qua đường dẫn `/dh8`.
*   **NFR-01 (Hiệu suất):** Thời gian tải trang dưới 1.5 giây trên thiết bị di động (được kiểm chứng qua tối ưu tài nguyên tĩnh).
*   **NFR-02 (Bảo mật thông tin):** Không lưu trữ thông tin nhạy cảm của khách hàng trực tiếp trên mã nguồn máy khách (Client-side source code).
