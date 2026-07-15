# 🏛️ Kiến trúc Hệ thống (System Architecture)

Hệ thống DH4HN Website được xây dựng trên mô hình serverless (không máy chủ) gọn nhẹ, tối ưu hóa việc truyền và lưu trữ dữ liệu thông qua các API tiêu chuẩn, đồng thời tích hợp các cơ chế bảo mật nghiêm ngặt.

## 1. Sơ đồ Luồng Dữ liệu (Data Flow)

### A. Luồng Đăng ký và Xác thực Thanh toán (Registration & Payment Flow)
Dưới đây là luồng xử lý thông tin khi khách hàng gửi biểu mẫu đăng ký và thực hiện thanh toán chuyển khoản:

```mermaid
sequenceDiagram
    participant User as Khách hàng (Browser)
    participant Web as Landing Page (Vercel)
    participant GAS as Google Apps Script (Webhook)
    participant CRM as CRM Google Sheets
    participant BTC as Email Ban Tổ Chức

    User->>Web: Nhập thông tin & chọn loại vé
    Web->>User: Hiển thị mã VietQR động thanh toán
    User->>Web: Nhấn nút "Đăng ký ngay"
    Web->>GAS: HTTP POST (JSON payload)
    Note over GAS: Xác thực CORS &<br/>Phân loại nguồn đăng ký
    GAS->>CRM: Ghi thông tin (Timestamp, Name, Phone...)
    GAS->>BTC: MailApp.sendEmail (Thông báo đăng ký mới)
    GAS-->>Web: Phản hồi 200 OK (Success status)
    Web-->>User: Hiển thị popup Đăng ký thành công
```

### B. Luồng Khảo sát Giá trị Cốt lõi & Bộ lọc Bảo mật (Personal Value Compass & Security Flow)
Luồng tương tác khi người dùng thực hiện bài kiểm tra giá trị cá nhân, đi qua các lớp bảo mật captcha, rate-limiting, quota check trước khi lưu dữ liệu và gửi email:

```mermaid
sequenceDiagram
    participant User as Người dùng (Browser)
    participant PV as Trang Khảo sát (Vercel)
    participant GAS as Google Apps Script (JSONP)
    participant Sheet as Google Sheets (PV_Data)
    participant Gmail as Google Mail Service

    User->>PV: Tương tác lật 41 thẻ & Đấu Top 7
    PV->>User: Hiển thị Biểu đồ Radar (Chart.js)
    User->>PV: Nhập Họ tên, Email, giải Math CAPTCHA
    PV->>GAS: HTTP GET (JSONP Request với token CAPTCHA)
    
    rect rgb(240, 240, 240)
        Note over GAS: [LỚP BẢO MẬT 1] Xác minh CAPTCHA<br/>(captchaAnswer & token hash)
        Note over GAS: [LỚP BẢO MẬT 2] HTML Escaping<br/>(Lọc XSS đầu vào qua escapeHtml_)
        Note over GAS: [LỚP BẢO MẬT 3] Rate Limiting<br/>(Kiểm tra email gửi <= 3 lần/5 phút)
    end
    
    GAS->>Sheet: Ghi kết quả (Timestamp, Name, Top 7, Duel History)
    
    rect rgb(230, 245, 230)
        Note over GAS: [LỚP BẢO MẬT 4] Quota Check<br/>(Quota MailApp >= 5 ?)
        GAS->>Gmail: MailApp.sendEmail (Gửi PDF & báo cáo)
    end
    
    GAS-->>PV: Trả về JSONP Callback (success: true/false)
    PV-->>User: Hiển thị thông báo gửi thành công/thất bại
```

## 2. Các Thành phần Kỹ thuật (Technical Components)

### A. Giao diện Client (Frontend)
*   **HTML5 & CSS3:** Sử dụng Native Form để thu thập thông tin khách hàng, tránh trễ tải trang hoặc mất quyền kiểm soát CSS của Google Form iFrame. Hiệu ứng Glassmorphism giúp nâng cao trải nghiệm người dùng.
*   **Chart.js & html2pdf.js:** Hiển thị trực quan hóa biểu đồ radar kết quả khảo sát và kết xuất trực tiếp tệp PDF tĩnh ngay tại trình duyệt máy khách để người dùng có thể tải về.
*   **JSONP Protocol:** Gọi API chéo miền (cross-domain API) từ trình duyệt khách hàng tới Google Apps Script Web App mà không bị lỗi chính sách nguồn gốc giống nhau (CORS).

### B. Google Apps Script Web App (Backend)
*   **Chức năng:** Microservice xử lý yêu cầu JSON/JSONP, điều hướng ghi chép vào CRM Sheets (`DHM8_Data`, `DHM9_Data`, `PV_Data`) theo cấu trúc cột chuẩn, đồng thời gửi email thông báo tự động.
*   **Lớp bảo mật backend:**
    1.  *Math CAPTCHA:* Client-side sinh token: `(num1 * 3 + num2 * 7) ^ 90`. Server-side giải mã và đối chiếu để chống bot gửi request tự động.
    2.  *Rate Limiting:* Giới hạn mỗi email tối đa 3 lần gửi trong 5 phút. Quét sheet `PV_Data` để kiểm tra timestamp.
    3.  *Quota Guard:* Kiểm tra `MailApp.getRemainingDailyQuota()`. Nếu dưới 5 mail, tự động tắt tính năng gửi email báo cáo khảo sát để ưu tiên giữ quota cho luồng đăng ký Masterclass quan trọng.
    4.  *HTML Escaping:* Lọc sạch ký tự nguy hại (`&`, `<`, `>`, `"`, `'`) của dữ liệu nhập để ngăn ngừa XSS tấn công CRM Sheet và Admin Email.

### C. Workspace MCP Server (Quản trị & Tự động hóa)
*   **Mục đích:** Tích hợp với AI Antigravity cho phép tương tác trực tiếp với tài khoản Google để truy xuất CRM Sheet, đọc hoặc gửi email điều trị tự động thông qua Gmail API và Sheets API.
*   **Xác thực:** Google OAuth (OAuth 2.0 Client credentials), lưu trữ credentials tại thư mục cục bộ `C:\Users\vu.hoang\.google_workspace_mcp\credentials\`.
