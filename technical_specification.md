# 🏗️ TÀI LIỆU KỸ THUẬT (TECHNICAL SPECIFICATION) — Dự án DH4HN Website

Dự án này là nền tảng chia sẻ và tập hợp dữ liệu đăng ký cho chương trình **Delivering Happiness Masterclass** và **CultureCode 101**.

---

## 🛠️ Giải pháp Kỹ thuật Đã triển khai

### 1. Hệ thống CRM & Pipeline Dữ liệu (GAS Webhook)
*   **Giải pháp:** Sử dụng Google Apps Script (GAS) làm Web App xử lý POST request từ Website và ghi trực tiếp vào CRM Google Sheets.
*   **Webhook CRM URL (Official):** `https://script.google.com/macros/s/AKfycby1-xHkVxBomRyqbL6GGDnwHXSLsmV7FOLX4XgFXCmoltvOeBM9r6WZQrRB_lIFFAUqyw/exec`
*   **Sheet CRM Link:** [DH4HN CRM Leads](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UghzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit)
*   **Cấu hình Triển khai (Bắt buộc):**
    *   *Execute as:* `Me` (Tài khoản culturecodeproject@gmail.com).
    *   *Who has access:* `Anyone` (Để cho phép fetch từ GitHub Pages).
*   **Mapping Dữ liệu (JSON Keys -> Cột Sheet):**
    | Cột | Tên Cột | JSON Key | Ghi chú |
    |---|---|---|---|
    | A | Timestamp | `new Date()` | Tự động sinh bởi GAS |
    | B | Event | `data.event` | Phân loại: SUBMIT/EVENT/VIEW |
    | C | FullName | `data.fullName` | Họ tên khách hàng |
    | D | Phone | `data.phone` | Số điện thoai/Zalo |
    | E | Email | `data.email` | Địa chỉ email |
    | F | Company | `data.company` | Chỉ dùng cho CC101 |
    | G | Type | `data.type` | Loại đăng ký |
    | H | Source | `data.source` | Nguồn (Landing/Quiz) |
    | I | Event ID | `data.event_id` | Mã định danh sự kiện |
    | J | Session ID | `data.sessionId` | Theo dõi hành trình phiên |
    | K | Referrer Name | `data.referrerName` | Người giới thiệu (Chỉ dùng cho DH) |
    | L | Referrer Phone | `data.referrerPhone` | SĐT người giới thiệu |

### 2. Hệ thống Analytics & Tracking (`tracking.js`)
*   **Giải pháp:** Tracker tổng hợp tích hợp `IntersectionObserver`.
*   **Cơ chế:** Ghi nhận sự kiện `PAGE_VIEW` khi tải trang và `SCROLL_REACH` khi người dùng cuộn đến khu vực đăng ký (Target: `#register` hoặc nút CTA).
*   **Lý do:** Đo lường chính xác điểm rơi của người dùng trên Landing Page trước khi họ quyết định nhấn vào Form.
*   **Cache Busting:** Sử dụng tham số `?v=TIMESTAMP` khi gọi script từ HTML.

---

## 🌳 Chiến lược Quản lý Repository (Branch-based Strategy)

Dự án sử dụng cơ chế **Branch-based** kết hợp **Git Worktree** để quản lý 2 luồng nội dung song song (Công khai & Nội bộ) trên cùng một Repository.

> [!IMPORTANT]
> Quy trình lỗi thời (dùng nhiều file như `index_OFFICIAL.html`, `index_BAK` hay `cp` thủ công) đã BỊ LOẠI BỎ hoàn toàn. Trên mỗi nhánh, chỉ tồn tại duy nhất **MỘT file `index.html`**. Vấn đề bảo mật nội dung DH7 hiện tại chỉ được chặn ở tầng Frontend (Login JS), **KHÔNG** dùng để bảo mật dữ liệu tuyệt đối.

| Nhánh (Branch) | Môi trường (Deployment) | Hiện trạng File `index.html` |
| :--- | :--- | :--- |
| **`main`** | Vercel Public / GitHub Pages | Là bản **OFFICIAL**: Hiện thông tin đăng ký và Nút Đăng nhập chờ. Tuyệt đối không để lộ artifacts. |
| **`07042026`** | Vercel Preview (Link Nội bộ) | Là bản **DH7 CORE**: Hiện trực tiếp 12 Audios, Video và các tài liệu LMS liên quan. |

---

## 📋 Cổng Đăng ký Native (Native Registration Portal)

Dự án đã loại bỏ hoàn toàn Google Form iFrame để chuyển sang Form thuần (Native HTML/CSS) nhằm tối ưu trải nghiệm và thẩm mỹ.

1.  **Masterclass DH (`register.html` & `register.js`):** Tập trung vào khách hàng đăng ký Delivering Happiness Masterclass 8.
    *   **Tích hợp thanh toán kép (Dual Payment Accounts):** Hỗ trợ hiển thị thông tin tài khoản ngân hàng và sinh mã VietQR động để quét thanh toán nhanh chóng.
    *   **Tự động điền (Prefill) & CRM Sync:** Hỗ trợ lưu trữ tiến trình nhập form, tự động đồng bộ thông tin đăng ký về CRM Google Sheets thông qua GAS Webhook.
2.  **CultureCode 101 (`register_cc101.html`):** Tập trung vào khách hàng tổ chức, có thêm trường **Công ty/Đơn vị**.
*   **Cơ chế:** Các form đều gọi chung hàm `logToSheet` nhưng gửi bộ dữ liệu (JSON) khác nhau để GAS tự động điều hướng vào đúng cột.

---

## 🚦 Định tuyến tĩnh đường dẫn rút gọn (Static Subdirectory Routing)

*   **Đường dẫn:** `/dh8` (`dh8/index.html`)
*   **Mục đích:** Tạo lối tắt truy cập trực tiếp (`short link`) cho chiến dịch đăng ký Delivering Happiness Masterclass 8.
*   **Cơ chế:** Khi người dùng truy cập `domain/dh8/`, tệp tĩnh `dh8/index.html` sẽ tự động hiển thị trang thông tin và mẫu đăng ký (nhúng hoặc chuyển hướng mượt mà).

---


## 🚦 Quy trình Vận hành Local (Git Worktree)

Để giải quyết nhu cầu phát triển song song 2 phiên bản mà không cần chuyển (checkout) qua lại gây nhầm lẫn trên 1 folder, dự án sử dụng `git worktree`:

**Cấu trúc thư mục Khuyến nghị:**
```
/projects/dh4hn-website/ (Thư mục làm việc nhánh `main` - Bản Public)
/projects/dh4hn-website-dh7/ (Thư mục Worktree nhánh `07042026` - Bản LMS)
```

**Cách triển khai công việc:**
1. Mở IDE ở thư mục `main` nếu muốn sửa Public Landing Page. Gõ commit & push lên `main`.
2. Mở IDE ở thư mục `07042026` (worktree) nếu muốn thêm bớt Audio/Video cho Khóa DH7. Commit & push lên nhánh `07042026`.
3. Hai thư mục hoạt động độc lập, có thể chạy local server preview cùng lúc trên 2 cổng khác nhau để đối chiếu trực tiếp. Cuối ngày, push folder nào thì Vercel cập nhật link đó.

---

## 📧 Hệ thống Thông báo (Notification System)

*   **Vị trí:** Nằm trong hàm `doPost(e)` của Apps Script.
*   **Logic:**
    *   Chỉ gửi email khi nhận được sự kiện đăng ký thành công (`REGISTER_SUBMIT` hoặc `REGISTER_EVENT`).
    *   Sử dụng `MailApp.sendEmail` gửi đến danh sách `btcEmail`.
*   **Cấu trúc Email:** 
    *   Subject: `[DH4HN CRM] Đăng ký mới: {FullName}`
    *   Body: Chứa tất cả thông tin khách hàng vừa nhập.

---

## ⚙️ Tích hợp Máy chủ Workspace MCP (Workspace MCP & Google OAuth)

Hệ thống được kết nối với tài khoản Google `culturecodeproject@gmail.com` để chạy Workspace MCP server phục vụ cho các thao tác quản trị tài nguyên nâng cao:
*   **Default Target Email:** `culturecodeproject@gmail.com` (Được cấu hình thông qua biến môi trường `USER_GOOGLE_EMAIL` tại tệp `mcp_config.json`).
*   **OAuth Credentials Store:** Lưu trữ cục bộ tại `C:\Users\vu.hoang\.google_workspace_mcp\credentials\culturecodeproject@gmail.com.json`.
*   **Kiểm chứng (Verification):** Đã kiểm thử thành công khả năng kết nối Google Drive (truy xuất Sheets CRM) và gửi email qua Gmail API (`gmail.send` scope) bằng Python scripts.

---


## 🔗 Danh sách Link Tài nguyên

| Thành phần | Link URL |
| :--- | :--- |
| **Landing Page (Official)** | [Link](https://culturecodefeedforward.github.io/DeliveringHappiness/) |
| **Landing Page (Demo)** | [Link](https://vuhoang2708.github.io/culture_code_VN.DH/) |
| **Google Sheet CRM** | [Link](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UghzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) |

---

## 📅 Lịch sử Thay đổi (Change Log)

| Ngày | Nội dung | Chi tiết |
| :--- | :--- | :--- |
| **04/04** | CRM Integration | Hoàn thiện Webhook và Schema 12 cột cho CRM. |
| **06/04** | Notification Fix | Sửa lỗi CORS và kích hoạt Mail thông báo BTC. |
| **07/04** | **Technical Audit** | Đồng bộ tài liệu với thực tế: Loại bỏ Smart Redirect, chuẩn hóa quy trình Two-File Index. |
| **13/06** | **Open DHM8** | Mở link đăng ký cho Delivering Happiness Masterclass 8 ngày 04/07. |
| **14/06** | **Reactivate Form & MCP** | Kích hoạt lại Form Native (`register.html`) tích hợp thanh toán kép (VietQR/Bank). Cấu hình định tuyến tĩnh `/dh8`. Xác thực thành công Workspace MCP với tài khoản `culturecodeproject@gmail.com` và hoàn thành kiểm thử Gmail API. |

---
*Cập nhật bởi Antigravity v3.5 (Audit Mode) - 14/06/2026*
