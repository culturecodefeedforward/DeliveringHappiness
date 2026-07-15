# 🚀 Hướng dẫn Triển khai (Deployment Guide)

Tài liệu hướng dẫn quy trình deploy (triển khai) và cấu hình hệ thống trên các môi trường.

## 1. Triển khai Giao diện (Frontend Deployment - Vercel)

Giao diện trang web (HTML/CSS/JS tĩnh) được deploy tự động lên **Vercel** thông qua cơ chế tích hợp CI/CD từ kho lưu trữ GitHub `culturecodefeedforward/DeliveringHappiness`.

### Quy trình Deploy Frontend:
1.  **Nhánh Production (Chính thức):** Mọi thay đổi được commit và đẩy lên nhánh `main` sẽ tự động kích hoạt trigger build của Vercel và cập nhật lên domain chính thức:
    *   *URL trang chủ:* `https://delivering-happiness.vercel.app/`
    *   *Trang khảo sát giá trị:* `https://delivering-happiness.vercel.app/personal-value.html`
    *   *Trang đăng ký DHM8:* `https://delivering-happiness.vercel.app/register.html`
    *   *Trang đăng ký DHM9 Hà Nội:* `https://delivering-happiness.vercel.app/register_dh9_hanoi.html`
2.  **Nhánh Preview/LMS (Bài học học viên):** Các cập nhật bài giảng cho học viên cũ được đẩy lên nhánh `07042026` và deploy lên môi trường Preview tương ứng.
3.  **Cấu hình dự án:** Tệp cấu hình `vercel.json` ở thư mục gốc chứa các quy tắc chuyển hướng hoặc header bảo mật (nếu có).

---

## 2. Triển khai Backend (Google Apps Script - clasp)

Backend của hệ thống chạy trên nền tảng Google Apps Script (GAS) Web App. Để quản lý mã nguồn ngoại tuyến chuyên nghiệp, dự án sử dụng công cụ **clasp** (Command Line Apps Script Projects) của Google.

### Bước 1: Cài đặt và Đăng nhập clasp
1.  Cài đặt clasp toàn cục thông qua npm:
    ```bash
    npm install -g @google/clasp
    ```
2.  Đăng nhập bằng tài khoản quản trị dự án `culturecodeproject@gmail.com`:
    ```bash
    clasp login
    ```
    *Lưu ý:* Trình duyệt sẽ mở ra và yêu cầu cấp quyền truy cập Apps Script API. Hãy bật quyền này trong phần cấu hình Google Apps Script User Settings (`https://script.google.com/home/usersettings`).

### Bước 2: Đồng bộ mã nguồn lên Google Cloud
1.  Cấu hình trong tệp `.clasp.json` tại thư mục gốc quản lý ID của script và thư mục chứa code:
    ```json
    {
      "scriptId": "1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU",
      "rootDir": "Scripts"
    }
    ```
    *Lưu ý:* Hãy đảm bảo thuộc tính `rootDir` trỏ chính xác đến thư mục `Scripts/` chứa file code `active_code_gs_final.js` và `appsscript.json` (nếu dùng clasp push cho thư mục này).
2.  Đẩy mã nguồn từ máy local lên Google Apps Script:
    ```bash
    clasp push
    ```

### Bước 3: Tạo phiên bản Deploy Web App trên Console
Sau khi clasp push code thành công, thực hiện tạo bản deploy trên Google Apps Script:
1.  Truy cập trang quản trị Google Sheet CRM và mở **Extensions** -> **Apps Script** (hoặc mở trực tiếp qua Script ID trên script.google.com).
2.  Nhấp chọn **Deploy** -> **New Deployment**.
3.  Chọn loại cấu hình triển khai là **Web App**:
    *   *Execute as:* Chọn **Me** (chạy dưới danh nghĩa tài khoản culturecodeproject@gmail.com).
    *   *Who has access:* Chọn **Anyone** (để cho phép trình duyệt của khách hàng gửi yêu cầu AJAX/JSONP mà không bị chặn phân quyền).
4.  Nhấp **Deploy**, hệ thống sẽ sinh ra một URL Web App mới (ví dụ: `https://script.google.com/macros/s/AKfycb.../exec`).

### Bước 4: Cập nhật URL Web App trên Frontend
1.  Sao chép URL Web App mới tạo ở Bước 3.
2.  Thay thế URL này vào biến cấu hình API tương ứng trên client-side:
    *   **Khảo sát giá trị:** Biến `webAppUrl` ở cuối tệp `personal-value.js` (khoảng dòng 684).
    *   **Form Đăng ký:** Biến `window.CUSTOM_WEBAPP_URL` hoặc cấu hình endpoint trong `register.js` và `register_dh9.js`.
3.  Commit và push frontend lên nhánh `main` để Vercel cập nhật thay đổi.

---

## 3. Cấu hình Script Properties bắt buộc trên Apps Script Console

Để backend hoạt động chính xác và an toàn, cần thiết lập các thuộc tính biến môi trường (Script Properties) trong phần **Project Settings** của Apps Script Editor:

| Tên biến (Property Key) | Ý nghĩa & Cấu hình |
| :--- | :--- |
| `ENVIRONMENT` | `PRODUCTION` hoặc `STAGING` |
| `SPREADSHEET_ID` | ID của Google Sheet CRM chính |
| `SEPAY_WEBHOOK_TOKEN` | Token bí mật dùng để xác thực webhook thanh toán từ SePay |
| `OFFICIAL_ACCOUNT_NUMBER` | Số tài khoản ngân hàng chính thức nhận tiền (`8815369431`) |
| `KILL_SWITCH_EMAIL` | Đặt là `true` để tạm dừng tất cả các hoạt động gửi email |
| `KILL_SWITCH_REGISTRATION` | Đặt là `true` để tạm dừng nhận đăng ký mới |
| `KILL_SWITCH_PV` | Đặt là `true` để đóng cổng khảo sát Giá trị Cốt lõi |
