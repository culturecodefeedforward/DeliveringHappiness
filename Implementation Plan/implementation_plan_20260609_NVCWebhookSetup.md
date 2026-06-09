# Kế hoạch triển khai: Cấu hình Webhook & Frontend cho Đăng ký NVC (Giao Tiếp Kết Nối)

**Ngày:** 2026-06-09  
**Tác giả:** Antigravity (AI Coding Assistant)  
**Task:** Thiết lập mã nguồn Apps Script, khắc phục lỗi 400 manifest, cập nhật giao diện `register_nvc.html` với logo CultureCode và QR Blooming On, tích hợp biến `window.CUSTOM_WEBAPP_URL`.
**Trạng thái:** ⏳ Chờ duyệt (Pending Approval)

---

## 1. Đề bài (Objective)
Hoàn thiện hệ thống thu thập thông tin khách hàng tiềm năng (`lead capture`) cho lớp học **NVC - Giao Tiếp Kết Nối** độc lập với hệ thống Delivering Happiness (DH). 

Các yêu cầu chi tiết:
1. Khắc phục lỗi `400` khi cập nhật Apps Script dự án `CultureCode - NVC Webhook` (ID: `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu`) dưới tài khoản `vuhoang2708@gmail.com`.
2. Đẩy code xử lý webhook lưu dữ liệu vào Google Sheet `CultureCode - NVC Leads` (ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`) và tự động gửi email thông báo định dạng HTML về `vuhoang2708@gmail.com`.
3. Cập nhật frontend `register_nvc.html`:
   - Đổi nhãn nút CTA thành **"Đăng ký tham gia"**.
   - Bổ sung logo Culture Code ở phần đầu form (`culcurecode logo.jpeg`).
   - Tích hợp ảnh QR code của nhóm Zalo **Blooming On** (`blooming_on_qr.jpg`) vào thông báo thành công sau khi gửi form.
   - Thêm cấu hình biến `window.CUSTOM_WEBAPP_URL` trỏ tới URL Web App mới của Apps Script trước khi tải file `tracking.js`.
4. Thực hiện `UAT` (User Acceptance Testing - Kiểm thử nghiệm thu người dùng) qua trình duyệt và xác nhận dữ liệu đã được ghi nhận đúng vào Sheet, email được gửi thành công.

---

## 2. Hiện trạng (Current State & Pain Points)
- **Apps Script:** Dự án `CultureCode - NVC Webhook` đã được khởi tạo nhưng trống trơn (chỉ có file manifest mặc định). Các lượt lưu trước đó bị lỗi HTTP 400 do đặt tên file manifest sai định dạng (sử dụng `appsscript.json` thay vì `appsscript` không có đuôi mở rộng khi gọi qua API).
- **Google Sheet:** File `CultureCode - NVC Leads` đã được tạo sẵn cấu trúc 13 cột chuẩn:
  `['Timestamp', 'FullName', 'Phone', 'Email', 'Role', 'Company', 'ReferrerName', 'ReferrerPhone', 'Q1_Situation', 'Q2_Relationship', 'Q3_Expectation', 'Event_ID', 'Session_ID']`
- **Frontend `register_nvc.html`:**
  - Nút Submit vẫn hiển thị chữ "Gửi đăng ký trải nghiệm" thay vì "Đăng ký tham gia".
  - Chưa nhúng logo và chưa nhúng QR Blooming On.
  - Chưa có khai báo biến `window.CUSTOM_WEBAPP_URL` để trỏ webhook về Apps Script mới.

---

## 3. Giải pháp kỹ thuật (Technical Solution)

### 3.1. Cấu hình và Cập nhật Google Apps Script
- Sử dụng công cụ `mcp_workspace-mcp_update_script_content` với cấu trúc JSON chính xác:
  - File manifest: `name: "appsscript"`, `type: "JSON"`, `source` là chuỗi cấu hình JSON có timezone `Asia/Ho_Chi_Minh`.
  - File code: `name: "Code"`, `type: "SERVER_JS"`, `source` chứa hàm `doPost(e)` xử lý ghi dữ liệu vào Sheet ID `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk` và gửi email thông báo định dạng HTML qua `MailApp.sendEmail`.
- Tránh lỗi HTTP 400 bằng cách loại bỏ đuôi `.json` trong trường `name` của tệp manifest.

### 3.2. Triển khai Web App (Deployment)
- Do Apps Script API không hỗ trợ tạo bản phát hành (`deployment`) Web App mới trực tiếp từ MCP, ta sẽ hướng dẫn user click vào nút **Deploy > New deployment > Web app** trên giao diện Apps Script Editor trực tuyến (hoặc dùng `clasp` nếu user đã cấu hình đăng nhập trên máy).
- Khi có URL Web App, ta sẽ cập nhật URL này vào frontend.

### 3.3. Cập nhật Frontend `register_nvc.html`
- **Logo:** Chèn thẻ ảnh ngay trên thẻ `h1`:
  ```html
  <img src="culcurecode logo.jpeg" alt="CultureCode Logo" style="max-height: 80px; display: block; margin: 0 auto 1.5rem; border-radius: 8px;">
  ```
- **Nút CTA:** Đổi text của nút Submit (dòng 504) thành:
  ```html
  <span class="btn-text">Đăng ký tham gia</span>
  ```
- **QR Blooming On:** Chèn vào vùng `#successMessage` trước nút quay về trang chủ:
  ```html
  <div style="margin-top: 1.5rem; background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--glass-border); text-align: center;">
      <p style="margin-bottom: 1rem; font-weight: 600; color: #fff; font-size: 0.95rem;">Quét mã QR dưới đây để tham gia nhóm Zalo đồng hành **Blooming On**:</p>
      <img src="blooming_on_qr.jpg" alt="Blooming On Zalo Group QR" style="max-width: 200px; border-radius: 12px; border: 4px solid white; display: inline-block;">
  </div>
  ```
- **Cấu hình Webhook URL:** Chèn script block khai báo biến `window.CUSTOM_WEBAPP_URL` ngay trước khi import `tracking.js`:
  ```html
  <script>
      window.CUSTOM_WEBAPP_URL = "https://script.google.com/macros/s/NEW_DEPLOYMENT_ID/exec"; // Thay thế bằng URL thực tế sau khi Deploy
  </script>
  <script src="tracking.js?v=2.4"></script>
  ```

---

## 4. Các file bị ảnh hưởng (Files Affected)
- `register_nvc.html` (Sửa đổi trực tiếp)
- `CultureCode - NVC Webhook` (Apps Script project ID `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu`, cập nhật mã nguồn)

---

## 5. Rủi ro tiềm ẩn & Biện pháp giảm thiểu (Risks & Mitigations)
- **Rủi ro 1: Lỗi CORS khi gửi dữ liệu từ frontend lên Apps Script.**
  - *Giảm thiểu:* Apps Script Web App trả về `TextOutput` và cấu hình mode `no-cors` ở frontend fetch API để đảm bảo truyền dữ liệu thông suốt.
- **Rủi ro 2: Deployment ID thay đổi khi update code Apps Script.**
  - *Giảm thiểu:* Hướng dẫn user chọn "Manage deployments" và chọn "Edit" để cập nhật phiên bản mới trên cùng một URL, tránh đổi ID Web App liên tục.
- **Rủi ro 3: Trùng lặp hoặc lệch dữ liệu các cột trên Google Sheet.**
  - *Giảm thiểu:* Khóa cứng thứ tự index cột trong Apps Script `appendRow` đúng theo thứ tự tiêu đề ở Sheet.

---

## 6. Auditor Review (Codex Rà soát)
*Codex/Claude đối tác vui lòng kiểm tra:*
1. Tên trường dữ liệu gửi đi ở frontend (`fullName`, `phone`, `email`, `role`, `company`, `referrerName`, `referrerPhone`, `q1_situation`, `q2_relationship`, `q3_expectation`, `event_id`, `sessionId`) đã khớp hoàn toàn với phần xử lý biến của Apps Script chưa?
2. Bố cục hiển thị logo và QR Blooming On trên bản xem trước di động có bị tràn khung hay không?

---
*Vui lòng phản hồi "Approve" hoặc "Đồng ý" để tôi tiến hành sửa file và cập nhật Apps Script.*
