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
    *   *Trang thực hành ABCDE:* `https://delivering-happiness.vercel.app/practice-abcde`
2.  **Nhánh Preview/LMS (Bài học học viên):** Các cập nhật bài giảng cho học viên cũ được đẩy lên nhánh `07042026` và deploy lên môi trường Preview tương ứng.
3.  **Cấu hình dự án:** Tệp cấu hình `vercel.json` ở thư mục gốc chứa các quy tắc chuyển hướng hoặc header bảo mật (nếu có).
4.  **Cảnh báo .vercelignore:** Để tránh Vercel bỏ qua các thư mục con trùng tên (ví dụ: `data/artifacts` bị nhận diện nhầm do dòng `Artifacts/` trong file cấu hình), bắt buộc phải dùng dấu gạch chéo ở đầu để khóa cứng đường dẫn gốc (như `/Artifacts/`, `/UAT/`, `/Implementation Plan/`).

### Phát hành giao diện ABCDE Beta-first

- Runtime source gồm `chat-abcde.js` và `chat-abcde.css`; không sửa trực tiếp bản sao trong `release_package/`.
- Sau passcode, RAG Beta là luồng chính cho mọi người dùng ABCDE. Stable chỉ xuất hiện khi Beta lỗi hoặc bị tắt; landing page không tự mở modal.
- Thay đổi giao diện này không yêu cầu đổi API, passcode, Apps Script, Google Sheet, token hoặc biến môi trường.
- Trước khi promote production, phải tạo package sạch, kiểm hash source/package và chạy browser UAT desktop/mobile cho passcode, Beta endpoint, fallback Stable và keyboard focus.
- Staged deployment và production promotion là hai approval riêng. Nếu staged UAT fail, không promote. Nếu production cần rollback, promote lại deployment ID trước đó đã ghi trong release evidence.

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
    *Lưu ý:* Hãy đảm bảo thuộc tính `rootDir` trỏ chính xác đến thư mục `Scripts/` chứa file code `active_code_gs_final.js` và `appsscript.json`.
3.  **Cấu hình tệp loại trừ `.claspignore` (Bắt buộc):**
    Để tránh xung đột trùng lặp hàm `doPost` (Function Shadowing) do clasp đẩy cả tệp rollback/runner lên cloud, tạo tệp `.claspignore` ở thư mục gốc của dự án với nội dung:
    ```text
    # Ignore files relative to rootDir (Scripts)
    active_code_gs_rollback.js
    dhm8_gate2_uat_runner.js
    ```
4.  Đẩy mã nguồn từ máy local lên Google Apps Script:
    ```bash
    clasp push -f
    ```

### Bước 3: Tạo phiên bản Deploy Web App trên Console
Sau khi clasp push code thành công, thực hiện tạo bản deploy trên Google Apps Script:
1.  Truy cập trang quản trị Google Sheet CRM và mở **Extensions** -> **Apps Script**.
2.  Nhấp chọn **Deploy** -> **New Deployment**.
3.  Chọn loại cấu hình triển khai là **Web App**:
    *   *Execute as:* Chọn **Me** (chạy dưới danh nghĩa tài khoản culturecodeproject@gmail.com).
    *   *Who has access:* Chọn **Anyone** (để cho phép backend Vercel gọi API công khai).
4.  Nhấp **Deploy**, hệ thống sẽ sinh ra một URL Web App mới (ví dụ: `https://script.google.com/macros/s/AKfycb.../exec`).

### Bước 4: Cập nhật biến môi trường trên Vercel Backend
Không tự ý sửa URL trực tiếp trong mã nguồn backend. Mọi URL và token kết nối đều được cấu hình qua **Vercel Environment Variables**:
1.  Truy cập bảng điều khiển Vercel của dự án.
2.  Cấu hình các biến môi trường sau:
    *   `DHM8_APPS_SCRIPT_URL`: URL Web App mới deploy ở Bước 3.
    *   `DHM8_APPS_SCRIPT_TOKEN`: Token dùng để ký mã HMAC (Ví dụ: `shared-token-key-2026`).
    *   `GEMINI_API_KEY`: API Key của Google Gemini dùng để chạy chatbot Socratic.
    *   `GEMINI_MODEL`: Model sử dụng (mặc định: `gemini-3.1-flash-lite`).
3.  Chạy deploy lại dự án để áp dụng các biến môi trường mới:
    ```bash
    vercel --prod --yes
    ```

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
| `KILL_SWITCH_ABCDE` | Đặt là `true` để tạm dừng nhận bài thực hành ABCDE Socratic |
