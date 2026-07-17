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

### C. Luồng Thực hành Lạc quan ABCDE Socratic (Socratic ABCDE Optimism Flow)
Luồng tương tác khi học viên thực hành rèn luyện tư duy lạc quan thông qua máy trạng thái Socratic AI, sau đó lưu kết quả và gửi báo cáo HTML:

```mermaid
sequenceDiagram
    participant User as Học viên (Browser)
    participant Web as Landing Page (Vercel)
    participant Proxy as Backend Proxy (Vercel Node.js)
    participant Gemini as Gemini Socratic AI
    participant GAS as Google Apps Script (Webhook)
    participant Sheet as Google Sheets (ABCDE_Data)
    participant Gmail as Google Mail Service

    User->>Web: Nhập passcode "DHM8" để mở khóa
    Web->>Proxy: POST /api/chat-abcde (action: "verify_passcode")
    Proxy-->>Web: Trả về success: true/false
    
    rect rgb(240, 240, 240)
        Note over User,Gemini: Vòng lặp đối thoại Socratic (A -> B -> C -> D -> E)
        User->>Web: Nhập nội dung (A/B/C/D/E)
        Web->>Proxy: POST /api/chat-abcde (action: "chat", message, history)
        Proxy->>Gemini: Gọi Gemini API (Socratic Prompt + System instruction)
        Gemini-->>Proxy: Phản hồi kèm tag [NEXT_STATE: <STATE>]
        Proxy-->>Web: Trả về nội dung hội thoại & trạng thái kế tiếp
        Web-->>User: Hiển thị phản hồi AI & cập nhật form bước tiếp theo
    end

    rect rgb(230, 245, 230)
        Note over User,Gmail: Bước Submit cuối cùng (Nhận báo cáo qua Email)
        User->>Web: Điền Họ tên, Email & click "Nhận báo cáo qua Email"
        Web->>Proxy: POST /api/chat-abcde (action: "submit", data: {A,B,C,D,E})
        Note over Proxy: Ký bảo mật HMAC-SHA256<br/>bằng Shared Token & sinh nonce
        Proxy->>GAS: POST Webhook (action: "submit_abcde", signature, data)
        GAS->>Sheet: Lưu kết quả thực hành vào tab ABCDE_Data
        GAS->>Gmail: Gửi email báo cáo HTML đẹp mắt cho học viên
        GAS-->>Proxy: Phản hồi success: true
        Proxy-->>Web: Trả về success: true
        Web-->>User: Hiển thị màn hình Hoàn thành thành công
    end
```

### D. Luồng Thực hành điền & đối chiếu Case Study qua QR (ABCDE Practice Sheet & Static RAG Flow)
Luồng tương tác của trang thực hành độc lập, tự động tải dữ liệu tri thức tĩnh từ server và phân rã các bước bằng Regex để đối chiếu bài làm:

```mermaid
sequenceDiagram
    participant User as Học viên (Browser)
    participant Web as Landing Page (Vercel)
    participant JSON as static DB (JSON file)

    User->>Web: Quét QR mở /practice-abcde
    Web->>JSON: Fetch /data/artifacts/knowledge_base_abcde.json
    JSON-->>Web: Trả về danh sách 18 case studies (ID, Adversity, Suggestion)
    Web->>User: Hiển thị danh sách tình huống trong Dropdown
    
    User->>Web: Chọn 1 case study
    Web->>User: Hiển thị Nghịch cảnh A, mở các ô nhập B, C, D, E
    
    User->>Web: Điền bài làm & Nhấn "Xem gợi ý & Đối chiếu"
    Note over Web: Sử dụng Regex bóc tách chuỗi gợi ý gốc<br/>thành các phần gợi ý B, C, D, E tương ứng
    Web->>User: Hiển thị bảng đối chiếu song song song (Side-by-Side Grid)
```

## 2. Các Thành phần Kỹ thuật (Technical Components)

### A. Giao diện Client (Frontend)
*   **HTML5 & CSS3:** Sử dụng Native Form để thu thập thông tin khách hàng, tránh trễ tải trang hoặc mất quyền kiểm soát CSS của Google Form iFrame. Hiệu ứng Glassmorphism giúp nâng cao trải nghiệm người dùng.
*   **Chart.js & html2pdf.js:** Hiển thị trực quan hóa biểu đồ radar kết quả khảo sát.
*   **JSONP & HTTP AJAX:** Gọi API chéo miền (cross-domain API) từ trình duyệt khách hàng tới Google Apps Script Web App và Vercel Backend.

### B. Vercel Backend Proxy (Serverless Functions)
*   **API Route:** `/api/chat-abcde.js` (Node.js).
*   **Chức năng:** 
    1.  *Mật mã lớp học:* Kiểm tra passcode chống truy cập trái phép.
    2.  *AI Socratic Integration:* Đóng vai trò cầu nối với Gemini API (`gemini-3.1-flash-lite`), gán System Prompt dẫn dắt, bóc tách tag trạng thái `[NEXT_STATE: <STATE>]` trả về phía client.
    3.  *HMAC Signature Generator:* Tạo chữ ký bảo mật SHA-256 kèm timestamp và nonce duy nhất trên payload trước khi gửi sang Google Apps Script để ngăn chặn các cuộc tấn công phát lại (Replay Attacks) và đảm bảo dữ liệu đến từ nguồn tin cậy.

### C. Google Apps Script Web App (Backend)
*   **Chức năng:** Microservice xử lý yêu cầu JSON/JSONP, điều hướng ghi chép vào CRM Sheets (`DHM8_Data`, `DHM9_Data`, `PV_Data`, `ABCDE_Data`) theo cấu trúc cột chuẩn, đồng thời gửi email thông báo tự động.
*   **Lớp bảo mật backend:**
    1.  *Math CAPTCHA:* Client-side sinh token và server-side giải mã để chống bot gửi request tự động.
    2.  *Rate Limiting:* Giới hạn mỗi email tối đa 3 lần gửi trong 5 phút. Quét sheet để kiểm tra timestamp.
    3.  *Quota Guard:* Kiểm tra quota gửi thư hàng ngày của Google, tự động tắt tính năng gửi email báo cáo khi quota sắp hết để ưu tiên các luồng quan trọng khác.
    4.  *HTML Escaping:* Lọc sạch ký tự nguy hại đầu vào để ngăn ngừa tấn công XSS.

### D. Workspace MCP Server (Quản trị & Tự động hóa)
*   **Mục đích:** Tích hợp với AI Antigravity cho phép tương tác trực tiếp với tài khoản Google để truy xuất CRM Sheet, đọc hoặc gửi email điều trị tự động thông qua Gmail API và Sheets API.
*   **Xác thực:** Google OAuth (OAuth 2.0 Client credentials), lưu trữ credentials tại thư mục cục bộ `C:\Users\vu.hoang\.google_workspace_mcp\credentials\`.
