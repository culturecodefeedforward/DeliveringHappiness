# 🚀 Delivering Happiness Masterclass & CultureCode Website

Đây là mã nguồn và tài liệu của trang thông tin và đăng ký chương trình **Delivering Happiness Masterclass** và **CultureCode 101**.

---

## 📖 Tài liệu Dự án (Project Documentation)

Tất cả tài liệu kỹ thuật chi tiết của dự án được lưu trữ trong thư mục [docs/](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/):

1.  **[Tổng quan Dự án & PDR](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/project-overview-pdr.md):** Mục tiêu, yêu cầu phát triển và tính năng cốt lõi.
2.  **[Tóm tắt Codebase](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/codebase-summary.md):** Cấu trúc thư mục và chi tiết các file mã nguồn.
3.  **[Quy chuẩn Lập trình & Vận hành](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/code-standards.md):** Chuẩn code, quy trình quản lý Branch-based và Git Worktree.
4.  **[Kiến trúc Hệ thống](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/system-architecture.md):** Luồng dữ liệu CRM, GAS Webhook và tích hợp Workspace MCP.
5.  **[Lộ trình Phát triển](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/project-roadmap.md):** Lịch sử các phiên bản và các giai đoạn phát triển tiếp theo.
6.  **[Hướng dẫn Triển khai](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment-guide.md):** Cách deploy Vercel và cấu hình Google Apps Script Webhook.
7.  **[Hướng dẫn Thiết kế](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/design-guidelines.md):** Quy chuẩn UI/UX Glassmorphism, phong cách CSS và mã VietQR.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

*   **Core:** HTML5, CSS3 (Vanilla CSS), Javascript (ES6+).
*   **Hosting & CI/CD:** Vercel (Public & Preview Environments), GitHub Pages.
*   **Database & CRM:** Google Sheets CRM thông qua Google Apps Script Webhook.
*   **Workspace MCP Server:** Hỗ trợ tương tác Google Drive, Google Sheets và gửi Gmail qua API với tài khoản quản trị `culturecodeproject@gmail.com`.

---

## 🚦 Bắt đầu Nhanh (Quick Start)

### 1. Xem Local
Chạy một HTTP server cục bộ tại thư mục gốc:
```bash
python -m http.server 8000
```
Truy cập qua trình duyệt tại: `http://localhost:8000`

### 2. Định tuyến rút gọn DH8
*   Trang đăng ký chính của Delivering Happiness Masterclass 8: `http://localhost:8000/register.html`
*   Hoặc truy cập trực tiếp qua định tuyến tĩnh: `http://localhost:8000/dh8/`
