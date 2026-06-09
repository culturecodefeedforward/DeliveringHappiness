# Kế hoạch Triển khai: Cập nhật Email Thông báo Đăng ký NVC, Thêm Link Zalo & Đồng bộ Git
## (Implementation Plan: Update NVC Notification Emails, Add Zalo Link & Sync Git)

- **Ngày tạo:** 09/06/2026
- **Tác giả:** Antigravity (AI Coding Assistant - Trợ lý Lập trình Trí tuệ Nhân tạo)
- **Dự án:** `dh4hn-website` (Trang web Delivering Happiness Hà Nội)
- **Đường dẫn dự án:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`

---

## 1. Đề bài & Hiện trạng (Goal & Current State)

### Đề bài (Goal)
1. Cấu hình nhận thông báo đăng ký khóa học Giao tiếp phi bạo lực (NVC - Nonviolent Communication) tới 3 email: `vuhoang2708@gmail.com`, `quochung.reo@gmail.com`, và `chauhm71@gmail.com`.
2. Trên màn hình đăng ký thành công của tệp `register_nvc.html`, bổ sung thêm liên kết dạng text `https://zalo.me/g/kizonq8jygheahn3urod` ngay phía trên ảnh QR Zalo của nhóm đồng hành **Blooming On** để người dùng sử dụng thiết bị di động có thể click trực tiếp thay vì chỉ có ảnh quét mã QR.
3. Đồng bộ hóa mã nguồn cục bộ lên 3 `remote` (kho lưu trữ mã nguồn trên máy chủ từ xa): `origin` (CultureCode Feedforward), `personal` (kho cá nhân) và `legacy_org` (kho tổ chức cũ).
4. Kiểm thử nghiệm thu người dùng `UAT` (User Acceptance Testing - kiểm tra trước khi bàn giao) trên môi trường `live` (môi trường vận hành trực tuyến thực tế) của Vercel để kiểm chứng toàn bộ luồng hoạt động.

### Hiện trạng (Current State)
* **Google Apps Script:** Tệp mã nguồn `Code` của dự án Apps Script `CultureCode - NVC Webhook` (ID: `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu`) đã được cập nhật thành công danh sách email nhận thông báo mới cục bộ trên server qua API. Tuy nhiên, phiên bản deploy thực tế vẫn chưa được tạo để áp dụng.
* **Frontend:** Tệp `register_nvc.html` hiện tại tại dòng 521 chỉ hiển thị mã QR:
  ```html
  <p style="margin-bottom: 1rem; font-weight: 600; color: #fff; font-size: 0.95rem;">Quét mã QR dưới đây để tham gia nhóm Zalo đồng hành **Blooming On**:</p>
  <img src="blooming_on_qr.jpg" alt="Blooming On Zalo Group QR" style="max-width: 200px; border-radius: 12px; border: 4px solid white; display: inline-block;">
  ```
  Chưa có dòng liên kết bấm trực tiếp cho người dùng di động.
* **Git:** Có một số tệp thay đổi chưa commit (`task.md`, `.gitignore`).

---

## 2. Giải pháp Kỹ thuật (Technical Solution)

### Bước 2.1: Cập nhật Google Apps Script (Đã thực hiện lưu mã nguồn)
* Đã cấu hình biến nhận thông báo trong script thành:
  ```javascript
  var notificationEmail = "vuhoang2708@gmail.com, quochung.reo@gmail.com, chauhm71@gmail.com";
  ```
* Cần thực hiện `deploy` (đưa phiên bản mới của mã nguồn lên môi trường vận hành trực tuyến) thông qua công cụ `browser_subagent` để tạo phiên bản Apps Script chạy thực tế mới (giữ nguyên URL Web App `/exec` cũ).

### Bước 2.2: Cập nhật Frontend `register_nvc.html`
* Sử dụng công cụ `replace_file_content` sửa đổi tệp `register_nvc.html` để chèn thêm liên kết Zalo ngay phía trên thẻ `<img>`.
* Đoạn mã nguồn sẽ sửa từ:
  ```html
  <p style="margin-bottom: 1rem; font-weight: 600; color: #fff; font-size: 0.95rem;">Quét mã QR dưới đây để tham gia nhóm Zalo đồng hành **Blooming On**:</p>
  <img src="blooming_on_qr.jpg" alt="Blooming On Zalo Group QR" style="max-width: 200px; border-radius: 12px; border: 4px solid white; display: inline-block;">
  ```
  thành:
  ```html
  <p style="margin-bottom: 1rem; font-weight: 600; color: #fff; font-size: 0.95rem;">Quét mã QR dưới đây để tham gia nhóm Zalo đồng hành **Blooming On**:</p>
  <p style="margin-bottom: 1rem; font-size: 0.9rem; color: rgba(255, 255, 255, 0.85);">
      Hoặc nhấn vào link: <a href="https://zalo.me/g/kizonq8jygheahn3urod" target="_blank" style="color: var(--accent-soft); text-decoration: underline; font-weight: 600;">zalo.me/g/kizonq8jygheahn3urod</a>
  </p>
  <img src="blooming_on_qr.jpg" alt="Blooming On Zalo Group QR" style="max-width: 200px; border-radius: 12px; border: 4px solid white; display: inline-block;">
  ```

### Bước 2.3: UAT trên Live & Đồng bộ Git
* Đẩy mã nguồn frontend lên nhánh `main` để Vercel tự động build.
* Sử dụng `browser_subagent` để truy cập trang Vercel live:
  * Điền thông tin đăng ký mẫu.
  * Bấm nút gửi thông tin.
  * Xác nhận chuyển sang màn hình thành công, có liên kết nhóm Zalo hiển thị đầy đủ và hoạt động được.
  * Kiểm tra dữ liệu ghi nhận đúng vào Google Sheets `CultureCode - NVC Leads`.
  * Nhờ người dùng xác nhận xem cả 3 email có nhận được thông báo không.
* Chạy các lệnh đồng bộ Git lên 3 remote:
  ```powershell
  git push origin main
  git push personal main
  git push legacy_org main
  ```

---

## 3. Các Tệp bị Ảnh hưởng (Affected Files)

1. **[MODIFY] [register_nvc.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_nvc.html):** Thêm liên kết Zalo phía trên thẻ hình ảnh QR Zalo.
2. **[NEW] [implementation_plan_20260609_UpdateNVCEmailsLinkAndSyncGit.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/implementation_plan_20260609_UpdateNVCEmailsLinkAndSyncGit.md):** Tệp kế hoạch triển khai này.

---

## 4. Rủi ro Tiềm ẩn & Hướng xử lý (Risks & Mitigations)

* **Rủi ro 1: Liên kết Zalo bị lỗi hoặc chuyển tiếp sai.**
  * *Hướng xử lý:* Kiểm tra trực tiếp bằng cách kích hoạt trình duyệt và nhấp vào liên kết trên trang web để đảm bảo mở đúng nhóm Zalo Blooming On.
* **Rủi ro 2: Deploy Apps Script làm thay đổi URL Web App.**
  * *Hướng xử lý:* Chọn đúng phương án chỉnh sửa deployment cũ thay vì tạo deploy mới để đảm bảo URL `/exec` giữ nguyên. Nếu có thay đổi ngoài ý muốn, cập nhật ngay vào frontend trước khi push Git.

---

## 5. Kịch bản Kiểm thử Nghiệm thu (UAT Verification Plan)

### Kiểm thử Tự động & Thủ công bằng Trình duyệt (Browser UAT)
1. Sử dụng công cụ `browser_subagent` truy cập URL trang đăng ký live trên Vercel.
2. Thực hiện đăng ký thông tin kiểm thử.
3. Chờ trang phản hồi thành công và xác nhận liên kết `zalo.me/g/kizonq8jygheahn3urod` hiển thị phía trên QR code.
4. Click thử liên kết để kiểm tra tính khả dụng.
5. Kiểm tra Google Sheets xem thông tin có ghi nhận dòng mới đúng thứ tự cột không.
6. Xác nhận với người dùng về việc nhận được email thông báo ở cả 3 địa chỉ email.
7. Chụp ảnh màn hình làm bằng chứng (evidence) lưu vào thư mục `UAT/`.

---

## 6. Auditor Review (Đánh giá của Codex/Claude)

*Bản kế hoạch này sẵn sàng để Codex/Claude và anh Vũ đánh giá trước khi thực thi.*
