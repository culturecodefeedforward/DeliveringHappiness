# 📅 Lộ trình Phát triển (Project Roadmap)

Lộ trình lưu trữ các cột mốc lịch sử phát triển và kế hoạch nâng cấp cho hệ thống DH4HN Website.

Trạng thái “có trong source” và “đã phát hành live” là hai bề mặt khác nhau. Mốc bên dưới chỉ được coi là live khi có release ID và bằng chứng production tương ứng.

## 1. Lịch sử Phiên bản (Version History)

### Phiên bản 1.0 (Tháng 04/2026) - Khởi tạo CRM
*   **Hoàn thành tích hợp CRM:** Xây dựng Webhook của Google Apps Script xử lý dữ liệu và lưu vào CRM Google Sheet.
*   **Sửa lỗi CORS & Email:** Cập nhật luồng gửi form và email thông báo qua Apps Script cho CultureCode Team.

### Phiên bản 2.0 (Tháng 06/2026) - Chiến dịch DHM8
*   **Mở đăng ký Masterclass DHM8:** Cập nhật thông tin Landing Page chính cho chiến dịch khóa học Delivering Happiness Masterclass 8 khai giảng ngày 04/07/2026.
*   **Reactivate Native Form:** Kích hoạt lại biểu mẫu native (`register.html`) với tính năng thanh toán kép (Dual Payment Accounts: tích hợp VietQR và thông tin tài khoản chuyển khoản ngân hàng).
*   **Định tuyến tĩnh /dh8:** Tạo thư mục con tĩnh `/dh8` làm lối tắt chuyển hướng trang đăng ký.
*   **Workspace MCP Integration:** Xác thực thành công tài khoản quản trị `culturecodeproject@gmail.com` với Workspace MCP để cho phép AI tự động hóa quản lý Sheets và gửi email thông báo qua Gmail API.

### Phiên bản 3.0 (Tháng 07/2026) - Các tính năng có trong source
*   **Tích hợp La bàn Giá trị Cá nhân (Personal Value Compass):** Phát triển tính năng khảo sát 41 giá trị sống cốt lõi, cơ chế so sánh đúp Top 7, vẽ radar chart (Chart.js), xuất PDF (html2pdf.js) và gửi mail báo cáo tự động cho người dùng.
*   **Trang thực hành Lạc quan ABCDE tương tác & RAG tri thức:** Phát triển trang thực hành tương tác độc lập (`practice-abcde.html`) cho phép học viên quét mã QR từ slide để điền bài làm và đối chiếu song song với 18 case study chuẩn (bao gồm 3 tình huống bóc băng trực tiếp từ file audio bài giảng) được lưu trữ dưới dạng cơ sở dữ liệu JSON tĩnh.
*   **Cập nhật Đăng ký DHM9:** Mở rộng luồng dữ liệu sang phân hệ Delivering Happiness Masterclass 9 tại Hà Nội (`register_dh9_hanoi.html`).
*   **Tăng cường Bảo mật & Chống Spam:**
    *   *Math Puzzle CAPTCHA:* Ngăn chặn bot spam API bằng phép cộng ngẫu nhiên và giải thuật mã hóa token ở cả client và backend.
    *   *Rate Limiting:* Giới hạn mỗi email tối đa 3 lần gửi khảo sát trong 5 phút, kết hợp Upstash Redis rate limit cho API Vercel.
    *   *Email Quota Guard:* Tự động ngắt gửi email báo cáo khi quota hàng ngày của Google còn dưới 5 email để ưu tiên tài nguyên cho luồng đăng ký chính.
    *   *HTML Escaping:* Lọc sạch mã độc đầu vào (`XSS Protection`) trước khi đẩy vào CRM Sheets hoặc email.
*   **Dynamic Vector RAG & Socratic Chatbox:** Tích hợp Gemini AI với Upstash Redis (Cosine Similarity) để tạo chatbot tương tác hướng dẫn phương pháp ABCDE (RAG Beta).
*   **SePay Webhook Auto-Reconciliation:** Tự động đối soát thanh toán chuyển khoản với luồng xác thực bảo mật từ SePay webhook.
*   **Mở rộng Luồng NVC, CC101 & Program Interest:** Hỗ trợ đăng ký nhiều chương trình (NVC, CC101) thông qua một cổng `program-interest.html` sử dụng cơ chế UUID.
*   **Check-in Sự kiện Offline:** Tích hợp camera quét mã QR để đối chiếu danh sách tham dự sự kiện trực tiếp từ Google Sheets.
*   **CRM Tự động hóa Gửi Mail (Đã triển khai trong source):** Có các luồng email xác nhận/báo cáo và cấu hình động theo lane. Trạng thái live phải kiểm tra theo từng campaign, quota, kill switch và provider read-back.
*   **Chuẩn hóa quy trình triển khai (UAT Framework):**
    *   *Frontend:* Tạo package từ commit bất biến, deploy staged bằng `--skip-domain`, chạy UAT theo release contract, chờ phê duyệt riêng rồi mới promote và kiểm chứng production.
    *   *Backend:* Dùng công cụ `clasp push` đẩy code qua các cổng kiểm duyệt (Approval boundary) thay vì trực tiếp.

### Phiên bản 3.1 (Tháng 08/2026) - Toàn vẹn phát hành và khôi phục route trong Git
*   **Release integrity:** Bổ sung `Scripts/build_release_package.js`, `Scripts/verify_vercel_live_gate.js`, release contract và workflow kiểm chứng staged/production.
*   **Program Interest:** Commit `a0b4b6f` đưa `program-interest.html` và hợp đồng `PROGRAM_INTEREST` vào nguồn Git. Đây là bằng chứng repository, không phải bằng chứng route production hiện hành.
*   **Stable/Beta ABCDE:** Source duy trì đường Stable và RAG Beta cùng nút chuyển về Stable khi Beta lỗi; cần giữ fallback độc lập trong mọi release.

### Phiên bản 4.0 (Tháng 09/2026) - LMS Blended Learning Engine v3 & Cổng Sát Hạch Đầu Vào
*   **Delivering Happiness Blended LMS Engine v3:** Triển khai hành trình học tập số kết hợp 3 chặng hoàn chỉnh tại `/lms/` (`index.html`, `app.js`, `curriculum_data.json`).
*   **Hợp nhất Master Learner Roster 383 Thành viên:** Xây dựng danh bạ xác thực 383 bản ghi (`lms/master_learners_roster.json`, `lms/authorized_roster.json`) từ DHM3 đến DHM9 và 6 thành viên Ban Giảng Huấn.
*   **Ban Giảng Huấn 6 Giảng viên / Coach:** Cấp quyền Coach cho Cô Châu, Thầy Hưng, Cô Hoàn, Thầy Vũ, Cô Hân, Cô Khánh Linh với đặc quyền bypass cổng kiểm tra để kiểm tra lớp học.
*   **Cổng Sát Hạch Đầu Vào Chặng 1 (Qualifying Quiz 10 Câu):** Tích hợp bộ 10 câu hỏi trắc nghiệm sát hạch đầu vào chuẩn hóa từ `DHM quiz 10 questions.xlsx` (Sheet: `Mini step 1`) với ngưỡng đạt ≥70% (7/10 câu), giới hạn tối đa 3 lần thử, cơ chế lockout và cổng khóa mở Chặng 2 (Lớp Offline).
*   **Trải nghiệm Tương tác Chuyên sâu:** Video Explainer, Audio Player 5 bài giảng, Khảo sát La Bàn Me Values (41 giá trị), Khung phản tư I•A•M, 4 Thói quen cốt lõi và Bảng theo dõi 21 Ngày (Habit Tracker).

## 2. Giai đoạn Tiếp theo (Future Milestones)

### Giai đoạn 4.5: Tối ưu AI & Personalization (Dự kiến)
*   **Mục tiêu:** Nâng cấp AI RAG lên bản chính thức (Stable RAG), tự động phân tích hành vi của học viên để cung cấp lộ trình học tập cá nhân hóa trên LMS Dashboard.
*   **Thời gian dự kiến:** Quý 4 / 2026.

### Giai đoạn 5.0: Tích hợp Dashboard Báo cáo Đăng ký & Học tập Thời gian thực
*   **Mục tiêu:** Xây dựng trang báo cáo nội bộ tổng hợp dữ liệu đăng ký và tiến độ học viên LMS theo thời gian thực từ Google Sheets CRM giúp Ban Giảng Huấn và CultureCode Team nắm bắt toàn cảnh lớp học.
*   **Thời gian dự kiến:** Đầu năm 2027.
