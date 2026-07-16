# 📂 Tóm tắt Codebase (Codebase Summary)

Thư mục gốc chứa các trang tĩnh, tệp cấu hình phong cách và các kịch bản chạy thử nghiệm. Dưới đây là mô tả chi tiết:

## 1. Các trang giao diện chính (Core UI Pages)
*   `index.html`: Giao diện trang chủ công khai (Landing Page). Chứa thông tin giới thiệu chương trình, lộ trình khóa học và nút định hướng đăng ký.
*   `register.html` / `register_direct.html` / `register-test.html`: Biểu mẫu đăng ký native cho khóa học Delivering Happiness Masterclass 8 (DHM8). Hỗ trợ hiển thị mã VietQR động và điền nhanh thông tin.
*   `register_dh9_hanoi.html`: Biểu mẫu đăng ký dành riêng cho Delivering Happiness Masterclass 9 (DHM9) tại Hà Nội.
*   `register_cc101.html`: Biểu mẫu đăng ký cho khóa học CultureCode 101.
*   `register_nvc.html`: Biểu mẫu đăng ký cho khóa học Nonviolent Communication (NVC).
*   `personal-value.html`: Giao diện La bàn Giá trị Cá nhân (Personal Value Compass). Ứng dụng Glassmorphism UI cao cấp cho phép người dùng tự khảo sát giá trị cốt lõi, so sánh đối đầu trực tiếp, hiển thị kết quả biểu đồ mạng nhện và xuất báo cáo PDF.
*   `assessment.html`: Trang khảo sát/đánh giá nhu cầu học tập ban đầu.
*   `interest.html` / `interest_dh9.html`: Trang ghi nhận thông tin bày tỏ sự quan tâm của học viên khi các lớp học đã đủ chỉ tiêu (Closed).
*   `lms_dashboard.html` / `login.html`: Trang quản trị nội bộ dành cho học viên DH7 cũ.
*   `dh8/index.html`: Định tuyến tĩnh cho lối tắt `/dh8`.

## 2. Kịch bản logic & CSS (Scripts & Styles)
*   `styles.css` / `quiz.css` / `register.css`: Định nghĩa phong cách giao diện Glassmorphism, CSS Variables, và layout responsive cho toàn bộ trang web.
*   `chat-abcde.css`: Phong cách giao diện hiện đại, glassmorphism và responsive dành riêng cho Chatbox ABCDE Socratic (scoped qua tiền tố `.abcde-*`).
*   `register.js` / `register_dh9.js` / `register_direct.js`: Quản lý trạng thái biểu mẫu đăng ký, tính toán mã QR thanh toán động và gọi Webhook gửi dữ liệu CRM qua giao thức JSONP/JSON.
*   `personal-value.js`: Xử lý logic khảo sát La bàn Giá trị Cá nhân.
*   `chat-abcde.js`: Quản lý luồng máy trạng thái hội thoại ABCDE phía client, hiển thị giao diện chat bong bóng và giao tiếp với API backend proxy.
*   `script.js`: Xử lý các hiệu ứng động trên trang chủ (cuộn trang mượt, tương tác micro-animations).
*   `tracking.js`: Bộ theo dõi phân tích hành vi cuộn trang và lượt truy cập của người dùng.
*   `dh4hn_uat.js`: Kịch bản kiểm thử tự động phục vụ UAT trên môi trường local.

## 3. Thư mục và tệp tin bổ sung
*   `docs/`: Thư mục chứa tài liệu đặc tả và hướng dẫn kỹ thuật của dự án.
    *   `deployment.md` [NEW]: Tài liệu ghi chép cấu hình nền tảng, URL Live chính thức và lệnh deploy nhanh.
*   `api/`: Thư mục chứa các API Backend Proxy (Vercel Serverless Functions):
    *   `chat-abcde.js`: API xử lý hội thoại Socratic, kiểm soát passcode, gọi Gemini API (`gemini-3.1-flash-lite`) và ký bảo mật HMAC trước khi chuyển tiếp sang Google Apps Script.
*   `Scripts/`: Chứa mã nguồn Apps Script và các script bổ trợ:
    *   `active_code_gs_final.js`: Mã nguồn Apps Script backend chính thống (handling Webhook SePay, ghi CRM Sheets, gửi email đăng ký và xử lý kết quả khảo sát ABCDE/Giá trị Cốt lõi).
    *   `active_code_gs_rollback.js`: Bản sao lưu để khôi phục nhanh backend khi gặp sự cố (bị loại trừ khi push lên cloud bằng `.claspignore` để tránh xung đột hàm).
    *   `appsscript_staging_manifest.json`: Tệp manifest cấu hình dự án Apps Script trên GCP.
    *   `dhm8_gate2_uat_runner.js`: Trình chạy kịch bản kiểm thử tích hợp tự động cho backend.
    *   `take_uat_screenshots.py` / `take_local_uat_screenshots.py`: Các script Python tự động hóa việc chụp ảnh màn hình UAT.
    *   `run_uat_20260716.js` [NEW]: Script Puppeteer tự động chạy các test cases về Accessibility (Keyboard focus return, Focus trap, Esc) và chụp ảnh UAT.
*   `Implementation Plan/`: Lưu trữ kế hoạch chi tiết cho từng giai đoạn cập nhật mã nguồn (phiên bản hóa theo định dạng ngày).
*   `UAT/`: Chứa kết quả kiểm thử nghiệm thu người dùng (UAT reports) và bằng chứng kiểm thử giao diện thực tế.
*   `.clasp.json`: File cấu hình của clasp để đồng bộ mã nguồn Apps Script với Google Cloud.
*   `.claspignore`: File cấu hình loại trừ các tệp rollback/runner khỏi quá trình clasp push để tránh Function Shadowing (xung đột trùng tên hàm).

