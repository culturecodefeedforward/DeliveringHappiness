# Kế hoạch triển khai: Thiết lập Cổng Đăng ký NVC (Giao Tiếp Kết Nối) Độc lập (Cập nhật)

**Ngày:** 2026-06-09  
**Tác giả:** Antigravity (AI Coding Assistant)  
**Task:** Khởi tạo Google Sheet mới, cấu hình Apps Script Web App dưới email `vuhoang2708@gmail.com`, bổ sung QR nhóm Blooming On và hoàn thiện frontend `register_nvc.html`  
**Trạng thái:** ⏳ Chờ duyệt (Pending Approval)  

---

## 1. Đề bài (Objective)
Thiết lập hệ thống đăng ký hoàn chỉnh cho chương trình **NVC - Giao Tiếp Kết Nối** (Nonviolent Communication - Giao tiếp phi bạo lực) hoàn toàn độc lập với hệ thống dữ liệu hiện tại của Delivering Happiness (DH) Masterclass. Dữ liệu đăng ký mới cần được bảo mật và phân quyền riêng cho người phụ trách lớp học NVC này.

Các yêu cầu cụ thể:
1. Sử dụng tài khoản Google **`vuhoang2708@gmail.com`** để thực hiện các thao tác Google Drive/Sheets và Apps Script.
2. Khởi tạo một Google Sheet độc lập tên là `CultureCode - NVC Leads` gồm cấu trúc 13 cột chuẩn.
3. Viết và triển khai Google Apps Script (GAS) Web App (`deploy` - đưa ứng dụng lên môi trường public) làm webhook xử lý lưu dữ liệu và gửi email thông báo tự động cho ban tổ chức (BTC).
4. Hoàn thiện tệp giao diện đăng ký `register_nvc.html`:
   - Đổi nhãn nút CTA (Call to Action - Nút kêu gọi hành động) từ "Gửi đăng ký trải nghiệm" thành **"Đăng ký tham gia"**.
   - Bổ sung logo chính thức của Culture Code (lấy từ file `culcurecode logo.jpeg` có sẵn trong workspace).
   - Tích hợp QR code để tham gia nhóm **Blooming On** sau khi đăng ký thành công (sử dụng file ảnh `blooming_on_qr.jpg` vừa copy vào workspace).
   - Tích hợp URL Web App mới vào frontend qua biến `window.CUSTOM_WEBAPP_URL`.
5. Tiến hành kiểm tra và thực hiện `UAT` (User Acceptance Testing - Kiểm thử nghiệm thu người dùng) để xác nhận dữ liệu được ghi đúng vào Sheet và email được gửi thành công.

## 2. Hiện trạng (Current State & Pain Points)
- **Tập tin `register_nvc.html`:** Đã được clone thô từ `register.html`, tuy nhiên:
  - Nút submit vẫn mang nhãn cũ: "Gửi đăng ký trải nghiệm".
  - Chưa tích hợp logo Culture Code chính thức.
  - Vẫn đang sử dụng hệ thống tracking dùng chung `tracking.js` với `SHEET_WEBAPP_URL` cũ hoặc chưa cấu hình URL webhook độc lập của NVC.
  - Chưa hiển thị QR Zalo nhóm Blooming On sau khi người dùng đăng ký thành công.
- **Hình ảnh QR Blooming On:** Đã được copy từ file tải lên của user thành file `blooming_on_qr.jpg` trong thư mục gốc của workspace.
- **Xác thực:** Tài khoản `vuhoang2708@gmail.com` đã được xác thực thành công trên workspace-mcp.

## 3. Giải pháp kỹ thuật (Technical Solution)

### 3.1. Cấu hình CRM Google Sheet (`CultureCode - NVC Leads`)
Khởi tạo bảng tính mới dưới tài khoản `vuhoang2708@gmail.com` và đặt tên các cột tiêu đề (Headers) tại hàng 1:
- Cột A: `Timestamp` (Thời gian đăng ký)
- Cột B: `FullName` (Họ tên)
- Cột C: `Phone` (Số điện thoại/Zalo)
- Cột D: `Email` (Email liên hệ)
- Cột E: `Role` (Vai trò trong doanh nghiệp)
- Cột F: `Company` (Công ty/Tổ chức)
- Cột G: `ReferrerName` (Người giới thiệu)
- Cột H: `ReferrerPhone` (SĐT người giới thiệu)
- Cột I: `Q1_Situation` (Tình huống giao tiếp khó nhất)
- Cột J: `Q2_Relationship` (Mối quan hệ mong GTKN giúp ích)
- Cột K: `Q3_Expectation` (Kỳ vọng sau buổi học)
- Cột L: `Event_ID` (Mã sự kiện: `NVC_GTKN_0926`)
- Cột M: `Session_ID` (Mã phiên làm việc)

### 3.2. Google Apps Script Web App
Viết mã code GAS lưu trữ trong một script mới liên kết với Sheet:
- Nhận request POST từ frontend, parse JSON.
- Ghi dữ liệu vào hàng tiếp theo tương ứng 13 cột nêu trên.
- Sử dụng `MailApp.sendEmail` gửi thông báo cho BTC:
  - Người nhận: `vuhoang2708@gmail.com`.
  - Tiêu đề: `[NVC Đăng ký mới] - {FullName} - {Role}`
  - Nội dung email trình bày chi tiết, định dạng đẹp mắt các thông tin đăng ký và các câu hỏi khảo sát 1, 2, 3 để BTC dễ dàng theo dõi.
- Cấu hình CORS (`no-cors` compatibility) trả về response JSON phù hợp.

### 3.3. Hoàn thiện Frontend (`register_nvc.html`)
- **Logo Integration:** Bổ sung thẻ hình ảnh logo Culture Code ở phần đầu form. Tham chiếu ảnh từ file cục bộ `culcurecode logo.jpeg`.
- **CTA Button Update:** Đổi nội dung thẻ nút (dòng 504) thành:
  ```html
  <span class="btn-text">Đăng ký tham gia</span>
  ```
- **QR Code Blooming On Integration:** Bổ sung QR Zalo nhóm Blooming On vào phần modal/success message hiển thị sau khi submit form thành công, kèm hướng dẫn quét QR để tham gia nhóm Zalo đồng hành.
- **Webhook Integration:** Khai báo biến cấu hình ở đầu khối `<script>`:
  ```javascript
  window.CUSTOM_WEBAPP_URL = "https://script.google.com/macros/s/NEW_DEPLOYMENT_ID/exec";
  ```

## 4. Các file bị ảnh hưởng (Files Affected)
- `register_nvc.html`: Sửa đổi nhãn CTA, nhúng logo, nhúng QR code Blooming On, cập nhật biến URL Webapp.
- `blooming_on_qr.jpg`: File hình ảnh QR mới thêm vào.
- `Implementation Plan/implementation_plan_20260609_NVCSetup.md`: File kế hoạch hiện tại.

## 5. Rủi ro tiềm ẩn & Biện pháp giảm thiểu (Risks & Mitigations)
- **Rủi ro 1: Link hình ảnh `blooming_on_qr.jpg` không hiển thị đúng.**
  - *Biện pháp:* Đảm bảo dùng đường dẫn tương đối `./blooming_on_qr.jpg` trong mã nguồn và file được push đầy đủ lên Git.
- **Rủi ro 2: CORS policy ngăn chặn gửi POST từ website tĩnh (GitHub Pages/Vercel) lên Google Apps Script.**
  - *Biện pháp:* GAS Web App trả về `TextOutput` và cấu hình mode `no-cors` ở frontend fetch API để đảm bảo truyền dữ liệu thông suốt.
- **Rủi ro 3: Dữ liệu bị ghi đè hoặc lệch cột.**
  - *Biện pháp:* Khóa cứng thứ tự index cột trong GAS trùng khớp 100% với thứ tự gửi đi.

## 6. Auditor Review (Codex Rà soát)
*Codex/Claude đối tác vui lòng kiểm tra:*
1. Thứ tự và tên cột Sheet đã khớp với key JSON gửi đi chưa?
2. Layout của QR Code Blooming On trên modal thành công có được canh lề cân đối không?
3. GAS Web App có cần xử lý gì thêm về múi giờ Việt Nam (GMT+7) khi ghi Timestamp hay không?

---
*Vui lòng duyệt qua kế hoạch này trước khi chúng ta thực hiện bước tiếp theo.*
