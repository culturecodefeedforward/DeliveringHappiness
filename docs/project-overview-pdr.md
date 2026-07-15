# 🚀 Tổng quan Dự án & PDR (Product Development Requirements)

## 1. Giới thiệu dự án
Dự án Website DH4HN là nền tảng chia sẻ thông tin và cổng đăng ký chính thức cho chuỗi chương trình đào tạo của **Delivering Happiness Masterclass** (đặc biệt là phiên bản **DHM8** và **DHM9**) và khóa học **CultureCode 101**. Ngoài ra, dự án còn tích hợp công cụ khảo sát và đánh giá giá trị cá nhân nâng cao nhằm giúp người dùng thấu hiểu bản thân trước khi tham gia các khóa học chuyên sâu.

## 2. Mục tiêu chiến lược
*   **Trải nghiệm Khách hàng cao cấp:** Tối ưu hóa giao diện đăng ký dạng Native HTML/CSS giúp nâng cao tỷ lệ chuyển đổi (Conversion Rate) so với các giải pháp biểu mẫu nhúng iFrame cũ.
*   **Tích hợp CRM tự động:** Ghi nhận mọi thông tin đăng ký và dữ liệu khảo sát ngay lập tức vào Google Sheets CRM của ban tổ chức không cần server trung gian trả phí, thông qua Google Apps Script Webhook.
*   **Đo lường chi tiết:** Tích hợp bộ theo dõi hành vi cuộn trang và thời gian tương tác để cải tiến nội dung.
*   **Bảo mật và Tối ưu Vận hành:** Áp dụng các cơ chế bảo mật nghiêm ngặt nhằm tránh spam dữ liệu, bảo vệ tài nguyên hệ thống và tối ưu hóa việc sử dụng quota (hạn mức) API miễn phí của Google.

## 3. Các yêu cầu sản phẩm (PDR)
*   **FR-01 (Mẫu đăng ký Masterclass):** Form thu thập thông tin khách hàng cá nhân kèm theo mã VietQR tự động hiển thị theo loại vé đăng ký và thông tin người giới thiệu.
*   **FR-02 (Mẫu đăng ký CultureCode):** Form thu thập thông tin khách hàng doanh nghiệp kèm theo thông tin Công ty/Đơn vị công tác.
*   **FR-03 (Tự động hóa thông báo):** Hệ thống tự động gửi email xác nhận đăng ký về tài khoản của ban tổ chức và học viên khi có đăng ký thành công.
*   **FR-04 (Hỗ trợ định tuyến rút gọn):** Truy cập nhanh trang đăng ký thông qua đường dẫn `/dh8`.
*   **FR-05 (La bàn Giá trị Cá nhân - Personal Value Compass):** 
    *   Trò chơi tương tác lật thẻ (interactive card flipping) giúp phân loại 41 giá trị sống cốt lõi theo các cấp độ quan trọng.
    *   Cơ chế duel (so sánh đối đầu trực tiếp) để lọc ra Top 7 giá trị quan trọng nhất.
    *   Trực quan hóa kết quả dưới dạng biểu đồ mạng nhện (radar chart) sử dụng thư viện `Chart.js`.
    *   Cho phép xuất kết quả khảo sát ra định dạng tệp PDF tĩnh qua `html2pdf.js`.
    *   Gửi báo cáo kết quả khảo sát chi tiết về địa chỉ email cá nhân của người dùng.
*   **NFR-01 (Hiệu suất):** Thời gian tải trang dưới 1.5 giây trên thiết bị di động (được kiểm chứng qua tối ưu tài nguyên tĩnh).
*   **NFR-02 (Bảo mật thông tin):** Không lưu trữ thông tin nhạy cảm của khách hàng trực tiếp trên mã nguồn máy khách (Client-side source code).
*   **NFR-03 (Bảo mật ứng dụng và chống spam):**
    *   **Math puzzle CAPTCHA:** Yêu cầu người dùng giải phép tính cộng ngẫu nhiên để xác minh trước khi gửi biểu mẫu.
    *   **Rate limiting (Giới hạn tần suất):** Giới hạn mỗi địa chỉ email chỉ được gửi tối đa 3 yêu cầu trong vòng 5 phút để chống tấn công từ chối dịch vụ (DoS).
    *   **Daily quota limits (Hạn mức hàng ngày):** Tự động phát hiện và xử lý khi quota gửi email của Google Apps Script cạn kiệt (dưới 5 mail/ngày) để tránh làm sập luồng đăng ký chính.
    *   **HTML escaping (Lọc ký tự HTML):** Lọc sạch các ký tự đặc biệt đầu vào nhằm tránh lỗ hổng bảo mật XSS (Cross-Site Scripting).
