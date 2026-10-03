# 🚀 Delivering Happiness Masterclass & CultureCode Website

Đây là mã nguồn và tài liệu của trang thông tin, đăng ký và các công cụ học tập cho **Delivering Happiness Masterclass** (các khóa **DHM8**, **DHM9**) và **CultureCode 101**. Hệ thống dùng kiến trúc `serverless` (không máy chủ tự quản), gồm giao diện tĩnh trên Vercel, các hàm API Vercel và Google Apps Script.

> **Ranh giới bằng chứng:** Tài liệu mô tả tính năng có trong mã nguồn. Nó không chứng minh URL public, Apps Script, Google Sheets, email hoặc thanh toán đang hoạt động; các bề mặt đó cần bằng chứng kiểm chứng riêng.

---

## 🌟 Tính năng Mới (New Features)

1.  **La bàn Giá trị Cá nhân (Personal Value Compass):** 
    *   Trải nghiệm tương tác lật thẻ khám phá 41 giá trị cốt lõi.
    *   Cơ chế duel (so sánh đối đầu) để chọn ra Top 7 giá trị quan trọng nhất.
    *   Trực quan hóa kết quả bằng radar chart (biểu đồ mạng nhện) qua Chart.js.
    *   Xuất báo cáo PDF trực tiếp trên trình duyệt qua html2pdf.js.
    *   Tự động gửi email báo cáo chi tiết cho người khảo sát thông qua Google Apps Script Web App backend.
2.  **Thực hành Lạc quan ABCDE Socratic:**
    *   Tích hợp Gemini AI xử lý đối thoại vấn đáp Socratic theo mô hình 5 bước A-B-C-D-E của Martin Seligman.
    *   Có bản `Stable` (ổn định) và `RAG Beta` (bản thử nghiệm truy xuất tri thức). Bản Beta ưu tiên Upstash Vector, có đường dự phòng tới `data/artifacts/knowledge_base_abcde.json`; khi endpoint Beta lỗi, giao diện cho phép chuyển về Stable.
3.  **Đăng ký DHM9 Hà Nội:** Luồng đăng ký mới cho khóa học Delivering Happiness Masterclass 9 tại Hà Nội.
4.  **Hệ Thống Delivering Happiness Blended Learning LMS Engine v3 (`/lms/`):**
    *   Hành trình học tập 3 Chặng kết hợp: Online Pre-Class 90 phút, Workshop Offline 2 ngày, và Hành trình đồng hành 21 ngày.
    *   **Mô hình Đăng nhập Lai & Cổng Khóa Học Thử (Hybrid Auth Model):** Phân luồng đăng nhập kép (Học viên chính thức tra Roster vào học tức thì 3 giây bằng 4 số cuối SĐT; Người mới tự động chuyển form nhận Magic Link học thử Chặng 1 qua Email). Khóa cứng Chặng 2 và Chặng 3 với tài khoản học thử, tích hợp Modal Nâng Cấp Amber chuyển đổi khách hàng tiềm năng.
    *   Cổng sát hạch đầu vào Bài 1.1 (10 câu trắc nghiệm phản xạ, ngưỡng đậu ≥70%, tối đa 3 lần thử, cơ chế khóa an toàn và bypass cho Coaches).
    *   Chế độ Focused Mode thu gọn Sidebar trên máy tính để bàn kiểu LinkedIn Learning, thanh Resume Learning thông minh và modal Quick Start Card.
    *   Mô hình 3 Khối Nội Dung theo đề xuất của Duy: (1) Bối cảnh & Trọng tâm, (2) Ngân hàng Tình huống Thực chiến (`practicalScenarios` với 8 case study chuẩn hóa cho cả 3 Đòn bẩy Chặng 1 và 5 Thói quen Chặng 2), (3) Bài tập mẫu kèm accordion phân tích đối chiếu.
    *   Bộ công cụ chuyển hóa: La bàn Giá trị Me Values (41 giá trị), Khung phản tư I•A•M, 4 Thói quen cốt lõi và Habit Tracker 21 ngày.

---

## 🔒 Kiểm soát Bảo mật trong Mã nguồn (Security Controls)

Các kiểm soát dưới đây tồn tại theo từng luồng; không mặc định áp dụng cho mọi API và không thay thế kiểm thử bảo mật:
*   **Math Puzzle CAPTCHA (Xác minh Phép tính):** Client sinh token ngẫu nhiên bằng công thức `(num1 * 3 + num2 * 7) ^ 90`. Server xác minh cả token và kết quả phép tính trước khi ghi nhận.
*   **Rate Limiting (Giới hạn Tần suất):** Giới hạn tối đa 3 lần gửi khảo sát từ cùng một email trong vòng 5 phút (kiểm tra timestamp trong dữ liệu).
*   **Daily Quota Guard (Kiểm soát Hạn mức):** Tự động phát hiện khi quota gửi email của Google Script còn dưới 5 email/ngày để tắt gửi mail báo cáo tự động, bảo vệ quota cho luồng đăng ký Masterclass chính.
*   **HTML Escaping (Lọc mã độc):** Lọc sạch dữ liệu đầu vào thông qua hàm `escapeHtml_()` trước khi lưu vào CRM Sheets hoặc đưa vào email.

---

## 🛠️ Công nghệ & Triển khai (Tech Stack & Deployment)

### 1. Giao diện (Frontend)
*   **Công nghệ:** Native HTML5, Vanilla CSS3 (Glassmorphism UI), JavaScript (ES6+).
*   **Triển khai production:** Nhánh `main` là ứng viên nguồn, không phải bằng chứng đã lên live. Quy trình bắt buộc là đóng gói từ commit bất biến, deploy bản staged không gắn domain, chạy UAT theo release contract, xin phê duyệt riêng, promote đúng deployment rồi kiểm chứng lại production.
*   *Domain Production:* `https://delivering-happiness.vercel.app/`
*   **Nguồn chuẩn vận hành:** `docs/deployment.md`.

### 2. Backend (Google Apps Script)
*   **Công nghệ:** Google Apps Script Web App (JSONP/JSON API).
*   **Triển khai:** Quản lý mã nguồn tại `Scripts/` bằng `clasp` (Command Line Apps Script Projects - công cụ dòng lệnh cho Apps Script). Trước thao tác ghi thật phải kiểm tra đúng project, chạy `clasp status`, rà soát tập file tải lên và xin phê duyệt Cấp độ 3 cho lệnh cụ thể:
    ```bash
    clasp login
    clasp status
    clasp push -f
    ```
*   *Apps Script Web App:* Cấu hình Web App chạy dưới quyền `Me` và cho phép truy cập bởi `Anyone` trên Apps Script Console.

---

## 📖 Tài liệu Dự án (Project Documentation)

Tài liệu chi tiết được lưu trữ trong thư mục [docs/](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/):

1.  **[Tổng quan Dự án & PDR](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/project-overview-pdr.md):** Giới thiệu dự án, mục tiêu chiến lược và danh sách yêu cầu tính năng (FR/NFR).
2.  **[Tóm tắt Codebase](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/codebase-summary.md):** Cấu trúc thư mục, tệp giao diện chính, file logic JS và backend script.
3.  **[Quy chuẩn Lập trình & Vận hành](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/code-standards.md):** Các chuẩn code, an toàn bảo mật, XSS escape, regex JSONP và làm việc với Git Worktree + clasp.
4.  **[Kiến trúc Hệ thống](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/system-architecture.md):** Sơ đồ luồng đăng ký học viên và sơ đồ luồng khảo sát Giá trị Cốt lõi đi qua các lớp bảo mật.
5.  **[Lộ trình Phát triển](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/project-roadmap.md):** Lịch sử phát triển các phiên bản (V1.0, V2.0, V3.0 hiện tại) và kế hoạch tương lai.
6.  **[Runbook phát hành production](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment.md):** Nguồn chuẩn cho package bất biến, staged UAT, promote, kiểm chứng production và rollback.
7.  **[Hướng dẫn Triển khai Backend](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment-guide.md):** Cấu hình Apps Script, biến môi trường, cổng kiểm chứng và liên kết sang runbook production.
8.  **[Hướng dẫn Thiết kế](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/design-guidelines.md):** Ngôn ngữ thiết kế Glassmorphism, CSS variables bảng màu ấm, hiệu ứng lật thẻ 3D, Chart.js radar và cấu hình html2pdf.js.
9.  **[Hướng dẫn & Lộ trình Học tập Toàn diện](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/huong_dan_va_lo_trinh_hoc_dhm.md):** Cẩm nang hướng dẫn chi tiết dành cho học viên và Ban Giảng Huấn, quy chế sát hạch và ngân hàng 8 tình huống thực chiến.
