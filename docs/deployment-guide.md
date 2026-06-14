# 🚀 Hướng dẫn Triển khai (Deployment Guide)

Tài liệu hướng dẫn quy trình deploy và cấu hình hệ thống trên các môi trường.

## 1. Triển khai Giao diện (Frontend Deployment)

Trang web được deploy tĩnh hoàn toàn lên Vercel và GitHub Pages từ repository `culturecodefeedforward/DeliveringHappiness`.

### A. Triển khai qua Vercel
*   **Trang chính (Official Production):** Deploy tự động từ nhánh `main` khi có commit mới. URL: `https://dh-crm-landing.vercel.app/`
*   **Trang LMS nội bộ (DH7 Preview):** Deploy tự động từ nhánh `07042026`.

### B. Triển khai GitHub Pages
*   Nếu ban tổ chức sử dụng GitHub Pages để backup, mã nguồn sẽ tự động được build tĩnh khi đẩy lên nhánh `main`. URL: `https://culturecodefeedforward.github.io/DeliveringHappiness/`

## 2. Cấu hình Google Apps Script Webhook

Apps Script hoạt động như một microservice backend xử lý lưu trữ dữ liệu.

### Quy trình cập nhật hoặc deploy mới Apps Script:
1.  Truy cập vào trang quản trị Google Drive bằng tài khoản `culturecodeproject@gmail.com`.
2.  Mở tệp Google Sheet CRM: `DH4HN CRM Leads`.
3.  Nhấp chọn **Extensions** -> **Apps Script**.
4.  Copy toàn bộ mã nguồn của file xử lý Webhook (`doPost` handler) dán vào cửa sổ Editor.
5.  Nhấp chọn **Deploy** -> **New Deployment**.
6.  Chọn loại deployment là **Web App**:
    *   *Execute as:* `Me` (tài khoản culturecodeproject@gmail.com)
    *   *Who has access:* `Anyone` (để tránh lỗi chặn CORS khi gọi API từ trình duyệt khách hàng).
7.  Copy URL Web App mới sinh ra và cập nhật vào biến `webhookUrl` trong tệp `register.js` ở mã nguồn Frontend.

## 3. Cấu hình Workspace MCP Server

Để tích hợp AI quản trị hệ thống, cần thiết lập Workspace MCP cục bộ:
1.  Đảm bảo tệp `C:\Users\vu.hoang\.gemini\antigravity\mcp_config.json` chứa biến môi trường trỏ đúng email:
    ```json
    "env": {
      "USER_GOOGLE_EMAIL": "culturecodeproject@gmail.com"
    }
    ```
2.  Đảm bảo tệp credentials OAuth JSON hợp lệ đã được lưu tại `C:\Users\vu.hoang\.google_workspace_mcp\credentials\culturecodeproject@gmail.com.json`.
