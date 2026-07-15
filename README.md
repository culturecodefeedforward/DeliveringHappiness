# 🚀 Delivering Happiness Masterclass & CultureCode Website

Đây là mã nguồn và tài liệu của trang thông tin và đăng ký chương trình **Delivering Happiness Masterclass** (các khóa **DHM8**, **DHM9**) và khóa học **CultureCode 101**. Hệ thống được xây dựng trên kiến trúc serverless (không máy chủ) tối giản, bảo mật cao và vận hành tự động.

---

## 🌟 Tính năng Mới (New Features)

1.  **La bàn Giá trị Cá nhân (Personal Value Compass):** 
    *   Trải nghiệm tương tác lật thẻ khám phá 41 giá trị cốt lõi.
    *   Cơ chế duel (so sánh đối đầu) để chọn ra Top 7 giá trị quan trọng nhất.
    *   Trực quan hóa kết quả bằng radar chart (biểu đồ mạng nhện) qua Chart.js.
    *   Xuất báo cáo PDF trực tiếp trên trình duyệt qua html2pdf.js.
    *   Tự động gửi email báo cáo chi tiết cho người khảo sát thông qua Google Apps Script Web App backend.
2.  **Đăng ký DHM9 Hà Nội:** Luồng đăng ký mới cho khóa học Delivering Happiness Masterclass 9 tại Hà Nội.

---

## 🔒 Lớp Bảo mật Bổ sung (Security Hardening)

Để bảo vệ hệ thống trước spam và tấn công XSS (Cross-Site Scripting), backend Google Apps Script đã tích hợp:
*   **Math Puzzle CAPTCHA (Xác minh Phép tính):** Client sinh token ngẫu nhiên bằng công thức `(num1 * 3 + num2 * 7) ^ 90`. Server xác minh cả token và kết quả phép tính trước khi ghi nhận.
*   **Rate Limiting (Giới hạn Tần suất):** Giới hạn tối đa 3 lần gửi khảo sát từ cùng một email trong vòng 5 phút (kiểm tra timestamp trong dữ liệu).
*   **Daily Quota Guard (Kiểm soát Hạn mức):** Tự động phát hiện khi quota gửi email của Google Script còn dưới 5 email/ngày để tắt gửi mail báo cáo tự động, bảo vệ quota cho luồng đăng ký Masterclass chính.
*   **HTML Escaping (Lọc mã độc):** Lọc sạch dữ liệu đầu vào thông qua hàm `escapeHtml_()` trước khi lưu vào CRM Sheets hoặc đưa vào email.

---

## 🛠️ Công nghệ & Triển khai (Tech Stack & Deployment)

### 1. Giao diện (Frontend)
*   **Công nghệ:** Native HTML5, Vanilla CSS3 (Glassmorphism UI), JavaScript (ES6+).
*   **Triển khai:** Tự động deploy thông qua CI/CD của Vercel khi đẩy mã nguồn lên nhánh `main` (Production) hoặc `07042026` (Preview).
*   *Domain Production:* `https://delivering-happiness.vercel.app/`

### 2. Backend (Google Apps Script)
*   **Công nghệ:** Google Apps Script Web App (JSONP/JSON API).
*   **Triển khai:** Quản lý code offline tại thư mục `Scripts/` và deploy nhanh bằng công cụ **clasp** (Command Line Apps Script Projects):
    ```bash
    # Đăng nhập clasp với tài khoản culturecodeproject@gmail.com
    clasp login
    
    # Đẩy code lên Apps Script
    clasp push
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
6.  **[Hướng dẫn Triển khai](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment-guide.md):** Chi tiết cấu hình deploy Vercel, đồng bộ clasp push và thiết lập Script Properties.
7.  **[Hướng dẫn Thiết kế](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/design-guidelines.md):** Ngôn ngữ thiết kế Glassmorphism, CSS variables bảng màu ấm, hiệu ứng lật thẻ 3D, Chart.js radar và cấu hình html2pdf.js.
