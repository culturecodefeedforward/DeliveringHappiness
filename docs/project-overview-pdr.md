# 🚀 Tổng quan Dự án & PDR (Product Development Requirements)

## 1. Giới thiệu dự án
Dự án Website DH4HN là nền tảng chia sẻ thông tin và cổng đăng ký chính thức cho chuỗi chương trình đào tạo của **Delivering Happiness Masterclass** (đặc biệt là phiên bản **DHM8** và **DHM9**) và khóa học **CultureCode 101**. Ngoài ra, dự án còn tích hợp công cụ khảo sát và đánh giá giá trị cá nhân nâng cao nhằm giúp người dùng thấu hiểu bản thân trước khi tham gia các khóa học chuyên sâu.

Tài liệu PDR (Product Development Requirements - yêu cầu phát triển sản phẩm) mô tả mục tiêu và hành vi có trong mã nguồn. Trạng thái live của từng route, email, Sheet và thanh toán vẫn phải được kiểm chứng độc lập.

## 2. Mục tiêu chiến lược
*   **Trải nghiệm Khách hàng cao cấp:** Tối ưu hóa giao diện đăng ký dạng Native HTML/CSS giúp nâng cao tỷ lệ chuyển đổi (Conversion Rate) so với các giải pháp biểu mẫu nhúng iFrame cũ.
*   **Tích hợp CRM tự động:** Định tuyến dữ liệu đăng ký và khảo sát vào Google Sheets CRM của CultureCode Team qua Google Apps Script Webhook, theo từng hợp đồng dữ liệu riêng.
*   **Đo lường chi tiết:** Tích hợp bộ theo dõi hành vi cuộn trang và thời gian tương tác để cải tiến nội dung.
*   **Bảo mật và Tối ưu Vận hành:** Áp dụng các cơ chế bảo mật nghiêm ngặt nhằm tránh spam dữ liệu, bảo vệ tài nguyên hệ thống và tối ưu hóa việc sử dụng quota (hạn mức) API miễn phí của Google.

## 3. Các yêu cầu sản phẩm (PDR)
*   **FR-01 (Mẫu đăng ký Masterclass):** Form thu thập thông tin khách hàng cá nhân kèm mã VietQR theo cấu hình lane. Mã nguồn hiện đóng cổng DHM8 khi `paidCount >= DHM8_REGISTRATION_CAP`; hằng số local hiện là `32`. Sức chứa công bố và trạng thái live phải đọc từ backend thật, không suy ra từ tài liệu.
*   **FR-02 (Mẫu đăng ký CultureCode):** Form thu thập thông tin khách hàng doanh nghiệp kèm theo thông tin Công ty/Đơn vị công tác.
*   **FR-03 (Tự động hóa thông báo):** Các lane đăng ký có thể tạo email xác nhận hoặc job email theo cấu hình, quota và kill switch; không áp dụng cho luồng `PROGRAM_INTEREST`.
*   **FR-04 (Hỗ trợ định tuyến):** Mã nguồn có lối tắt `/dh8/`; DHM9 dùng trang `register_dh9_hanoi.html`. Không ghi nhận route `/dh9` vì thư mục/route đó không tồn tại trong checkout hiện tại.
*   **FR-05 (La bàn Giá trị Cá nhân - Personal Value Compass):** 
    *   Trò chơi tương tác lật thẻ giúp phân loại 41 giá trị sống cốt lõi.
    *   Cơ chế so sánh đối đầu trực tiếp để lọc ra Top 7 giá trị quan trọng nhất.
    *   Trực quan hóa kết quả dưới dạng biểu đồ radar sử dụng thư viện `Chart.js`.
    *   Cho phép xuất kết quả khảo sát ra định dạng tệp PDF tĩnh qua `html2pdf.js`.
    *   Gửi báo cáo kết quả khảo sát chi tiết về địa chỉ email cá nhân của người dùng.
*   **FR-06 (Thực hành Lạc quan ABCDE Socratic & RAG Beta):**
    *   Chatbox đối thoại dẫn dắt học viên thực hành mô hình Lạc quan ABCDE của Martin Seligman.
    *   Sử dụng phương pháp vấn đáp Socratic kết nối trực tiếp với Gemini AI (`gemini-3.1-flash-lite`).
    *   Bản Stable dùng `/api/chat-abcde`; bản RAG Beta dùng `/api/chat-abcde-rag`, ưu tiên Upstash Vector và dự phòng bằng kho JSON cục bộ ở bước D.
    *   Kiểm soát chặt chẽ trạng thái chuyển đổi (A -> B -> C -> D -> E) theo thời gian thực (real-time).
    *   Gạn lọc cảm xúc đổ lỗi, suy diễn tiêu cực ở bước Nghịch cảnh (A), hướng học viên tách bạch sự thật khách quan trước khi chuyển sang bước Niềm tin (B).
    *   Cho phép học viên đăng ký nhận toàn bộ bản tổng hợp bài tập qua Email dưới định dạng HTML sang xịn mịn.
    *   Luồng submit ghi vào Google Sheets `ABCDE_Data` trong mã Apps Script hiện tại.
*   **FR-07 (QR Check-in):** Có giao diện camera `checkin.html`; kết nối dữ liệu live và chống check-in trùng vẫn cần UAT riêng.
*   **FR-08 (Hệ thống LMS Blended Learning & Cổng Sát Hạch Đầu Vào):** 
    *   Hệ thống học tập kết hợp (Blended Learning) 3 Chặng tại `/lms/` (`lms/index.html`, `lms/app.js`, `lms/curriculum_data.json`).
    *   **Master Learner Directory:** CSDL 382 học viên và giảng viên từ DHM3 đến DHM9 (`lms/master_learners_roster.json`, `lms/authorized_roster.json`).
    *   **Cơ chế Xác thực & Nhận diện Học viên:** Đăng nhập an toàn bằng Email / Số điện thoại đăng ký, tự động nhận diện danh tính và khóa học.
    *   **Ban Giảng Huấn 5 Giảng viên / Coach:** Cô Hà Minh Châu, Thầy / Anh Hưng, Cô Hà Ngọc Hoàn, Thầy Vũ Hoàng, Cô / Chị Hân (phân quyền Coach, bypass cổng kiểm tra).
    *   **Cổng Sát Hạch Đầu Vào Chặng 1 (10 Câu Trắc Nghiệm):** Yêu cầu đạt tối thiểu ≥80% (8/10 câu) sau tối đa 3 lần thử để qualify mở khóa Chặng 2 (Offline). Khóa lại sau 3 lần trượt và yêu cầu liên hệ Coach/BTC.
    *   **Công cụ Tương tác:** Video Explainer, Audio Player bài giảng, La Bàn Giá Trị Me Values (41 giá trị), Khung đúc kết I•A•M, 4 Thói quen cốt lõi (Vị nhân, Biết ơn, Tỉnh thức SCBA, Lạc quan ABCDE) và Nhật ký 21 Ngày (Habit Tracker).
*   **FR-09 (SePay Webhook Auto-Reconciliation):** Có API `api/sepay-dh.js` và handler Apps Script để đối soát theo lane; trạng thái webhook production là `UNVERIFIED` trong lượt cập nhật tài liệu này.
*   **FR-10 (Program Interest Hub):** Trang đích chung ghi nhận sự quan tâm đối với nhiều chương trình (DHM8, DHM9, NVC, AI) với cơ chế chống spam bằng UUID.
*   **FR-11 (Mẫu đăng ký Giao tiếp Kết nối NVC):** Biểu mẫu đăng ký chuyên biệt cho khóa học Nonviolent Communication (`register_nvc.html`), lưu trữ CRM độc lập vào Sheet `CultureCode - NVC Leads` (13 cột) và tự động bắn email thông báo cho CultureCode Team.
*   **FR-12 (LMS Chế độ Học Tập Tập Trung Focused Mode & Mô hình 3 Sections Duy Đề xuất):**
    *   **Desktop Focused Mode (Thu gọn Sidebar):** Nút thu gọn thanh điều hướng bên trái trên máy tính bàn (`#btn-collapse-sidebar-desktop`), tự động lưu trạng thái thu gọn vào `localStorage: dhm_sidebar_desktop_collapsed` để học viên mở rộng tối đa không gian đọc/xem bài giảng mà không bị phân tâm. Có nút khôi phục nhanh trên thanh tiêu đề (`#btn-sidebar-desktop-expand`).
    *   **Thanh Tiếp Tục Học Tập Thông Minh (Smart Resume Learning):** Nút Resume Learning trên Header (`#btn-header-resume`) và Thẻ Khởi động Nhanh (`#modal-quick-start`) tự động ghi nhớ và chuyển hướng học viên đến đúng bài học hoặc tiểu mục đang học dở.
    *   **Mô hình 3 Khối Nội Dung (Duy 3-Sections Model):** Chuẩn hóa tab Bài tập & Thực hành thành 3 khối nội dung sư phạm:
        1. *Khối 1 (Bối cảnh & Trọng tâm):* Tóm lược cốt lõi lý thuyết, nguyên lý tâm lý học ứng dụng.
        2. *Khối 2 (Ngân hàng Case Study & Tình huống thực chiến):* Cung cấp các tình huống thực tế bám sát môi trường doanh nghiệp Việt Nam (`practicalScenarios` trong `lms/curriculum_data.json`).
        3. *Khối 3 (Bài tập mẫu & Accordion Phân tích):* Bài tập mẫu kèm đáp án chi tiết và cơ chế ẩn/hiện accordion (`toggleModelAnswer`) giúp học viên tự đối chiếu cách giải trước khi làm bài tập riêng.
    *   **Tự động Thu gọn Banner Sát Hạch (Hero Gate Auto-Collapse):** Khi học viên đạt ngưỡng đậu (≥80%), banner thi sát hạch tự động thu nhỏ thành huy hiệu trạng thái gọn gàng để nhường màn hình cho bài học.
    *   **Tích xanh Tiến độ Tiểu mục (Visual Subsection Checkmarks):** Hiển thị dấu kiểm `✓` trực quan bên cạnh các tiểu mục đã hoàn thành trên Sidebar.
*   *(Chi tiết toàn bộ biểu mẫu và điểm đến dữ liệu xem tại [forms-and-data-destinations.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/forms-and-data-destinations.md)).*
*   **NFR-01 (Hiệu suất):** Mục tiêu tải trang dưới 1,5 giây trên thiết bị di động. Chưa có phép đo hiệu năng hiện hành trong lượt cập nhật này, nên trạng thái là `UNVERIFIED`.
*   **NFR-02 (Bảo mật thông tin):** Secret, token và thông tin vận hành nhạy cảm không được đặt trong mã máy khách hoặc tài liệu. Mọi giá trị phải đến từ cấu hình runtime thích hợp.
*   **NFR-03 (Bảo mật ứng dụng và chống spam):**
    *   **Math puzzle CAPTCHA:** Yêu cầu người dùng giải phép tính cộng ngẫu nhiên để xác minh trước khi gửi biểu mẫu.
    *   **HMAC Secure Signature:** Vercel API hiện tạo HMAC-SHA256 cho payload ABCDE, nhưng Apps Script chưa có bộ xác minh tương ứng trong mã nguồn hiện tại. Bảo vệ toàn vẹn đầu-cuối và chống phát lại vì vậy vẫn `UNVERIFIED`.
    *   **Rate limiting (Giới hạn tần suất):** Giới hạn mỗi địa chỉ email chỉ được gửi tối đa 3 yêu cầu trong vòng 5 phút để chống tấn công từ chối dịch vụ (DoS).
    *   **Daily quota limits (Hạn mức hàng ngày):** Tự động phát hiện và xử lý khi quota gửi email của Google Apps Script cạn kiệt (dưới 5 mail/ngày).
    *   **HTML escaping (Lọc ký tự HTML):** Lọc sạch các ký tự đặc biệt đầu vào nhằm tránh lỗ hổng bảo mật XSS.

## 4. Các Quy tắc Tuân thủ Kỹ thuật (Rules of Compliance)
*   **Rule 5 (Dynamic Configuration & Email Binding):** Tự động điều hướng và ghép file email template chính xác cho từng loại email/chiến dịch thay vì hardcode trong App Script. Mọi config (giá vé, template email, trạng thái mở/đóng) phải linh hoạt lấy từ hàm `getPaymentConfig_`.
*   **Rule 6 (Live Data Only):** Trong các luồng quan trọng (như Check-in, Thanh toán), Frontend bắt buộc phải gọi API kiểm tra dữ liệu thật từ Sheets thay vì dựa vào cache (Tránh tình trạng Duplicate Check-in hoặc nhận thanh toán khi đã hết chỗ).
*   **Release Integrity:** Frontend production phải được đóng gói từ commit bất biến, kiểm chứng staged theo release contract, phê duyệt riêng trước promote và kiểm chứng lại đúng production alias.
