# Kế hoạch Triển khai: Cập nhật Email Thông báo Đăng ký NVC & Đồng bộ Git
## (Implementation Plan: Update NVC Notification Emails & Sync Git)

- **Ngày tạo:** 09/06/2026
- **Tác giả:** Antigravity (AI Coding Assistant - Trợ lý Lập trình Trí tuệ Nhân tạo)
- **Dự án:** `dh4hn-website` (Trang web Delivering Happiness Hà Nội)
- **Đường dẫn dự án:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`

---

## 1. Đề bài & Hiện trạng (Goal & Current State)

### Đề bài (Goal)
1. Thêm 2 email `quochung.reo@gmail.com` và `chauhm71@gmail.com` vào danh sách nhận thông báo khi có học viên đăng ký trên trang biểu mẫu `register_nvc.html` (đăng ký khóa học Giao tiếp phi bạo lực - Nonviolent Communication). Thông báo này hiện tại chỉ gửi về `vuhoang2708@gmail.com`.
2. Đồng bộ hóa mã nguồn cục bộ lên 3 `remote` (kho lưu trữ mã nguồn trên máy chủ từ xa): `origin`, `personal`, và `legacy_org`.
3. Kiểm thử nghiệm thu người dùng `UAT` (User Acceptance Testing - kiểm tra trước khi bàn giao) trên môi trường `live` (môi trường vận hành trực tuyến thực tế) của Vercel để đảm bảo dữ liệu ghi nhận đúng vào `Google Sheets` (bảng tính trực tuyến của Google) và email gửi đi đồng thời cho cả 3 người nhận.

### Hiện trạng (Current State)
* **Backend:** Dự án Google Apps Script có ID `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu` (tên: `CultureCode - NVC Webhook`) sở hữu bởi tài khoản `vuhoang2708@gmail.com` đang quản lý logic webhook. Biến nhận email thông báo tại dòng 5 của tệp `Code` hiện đang cấu hình cứng:
  ```javascript
  var notificationEmail = "vuhoang2708@gmail.com";
  ```
* **Frontend:** Tệp `register_nvc.html` gửi dữ liệu đăng ký qua `fetch` (hàm gọi yêu cầu mạng) tới `window.CUSTOM_WEBAPP_URL` (địa chỉ webhook v1 hiện tại):
  ```javascript
  window.CUSTOM_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxdjYGd8ki2f5LAyo5oCSUiFBUz3f-o9II6vz73VQIDULLS1J05mFaz-og4e1RjdTPg/exec";
  ```
* **Git:** Nhánh `main` cục bộ đã được `push` (đẩy mã nguồn) lên `origin` (CultureCode Feedforward), nhưng chưa được đồng bộ lên `personal` (kho cá nhân) và `legacy_org` (kho tổ chức cũ).

---

## 2. Giải pháp Kỹ thuật (Technical Solution)

### Bước 2.1: Cập nhật Google Apps Script
* Sử dụng công cụ MCP `mcp_workspace-mcp_update_script_content` để cập nhật tệp `Code` trong dự án Apps Script.
* Thay đổi dòng 5 từ:
  ```javascript
  var notificationEmail = "vuhoang2708@gmail.com";
  ```
  thành:
  ```javascript
  var notificationEmail = "vuhoang2708@gmail.com, quochung.reo@gmail.com, chauhm71@gmail.com";
  ```
  *(Lưu ý: Thư viện `MailApp.sendEmail` mặc định hỗ trợ gửi danh sách nhiều địa chỉ ngăn cách bằng dấu phẩy).*

### Bước 2.2: Triển khai & Lấy Webhook URL mới
* Sau khi cập nhật Apps Script thành công, do Apps Script Web App yêu cầu tạo phiên bản triển khai mới (`deployment` - phiên bản chạy thực tế) để các thay đổi trong hàm `doPost` có hiệu lực.
* Ta sẽ hướng dẫn người dùng thực hiện deploy phiên bản mới trên giao diện Google Apps Script (hoặc tự động xác nhận nếu URL `/exec` không thay đổi do sử dụng chế độ chạy thử hoặc liên kết cố định). 
* *Thông tin cứu cánh:* Nếu URL thay đổi, ta sẽ ghi nhận URL Web App mới.

### Bước 2.3: Cập nhật mã nguồn Frontend (nếu cần)
* Nếu URL Web App thay đổi sau khi deploy phiên bản mới, ta sẽ cập nhật biến `window.CUSTOM_WEBAPP_URL` tại dòng 530 của file `register_nvc.html` bằng công cụ `replace_file_content`.

### Bước 2.4: Đồng bộ hóa Git
* Chạy `git status --short --branch` để rà soát trạng thái làm việc.
* Commit các thay đổi trên frontend (nếu có).
* Đẩy mã nguồn lên cả 3 remote:
  ```powershell
  git push origin main
  git push personal main
  git push legacy_org main
  ```

---

## 3. Các Tệp bị Ảnh hưởng (Affected Files)

1. **[MODIFY] Google Apps Script (`Code`):** Cập nhật danh sách email thông báo đăng ký.
2. **[MODIFY] [register_nvc.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_nvc.html):** Cập nhật URL Web App mới (nếu URL thay đổi sau khi redeploy).
3. **[NEW] [implementation_plan_20260609_UpdateNVCEmailsAndSyncGit.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/implementation_plan_20260609_UpdateNVCEmailsAndSyncGit.md):** Tệp kế hoạch này.

---

## 4. Rủi ro Tiềm ẩn & Hướng xử lý (Risks & Mitigations)

* **Rủi ro 1: Thay đổi Web App URL làm mất liên kết với Frontend cũ.**
  * *Hướng xử lý:* Kiểm tra kỹ xem URL mới có khớp với URL cũ không. Nếu thay đổi, cập nhật ngay lập tức vào frontend trước khi push lên GitHub để tránh làm gián đoạn trang Live.
* **Rủi ro 2: Gmail giới hạn hạn mức gửi thư hàng ngày (Quota).**
  * *Hướng xử lý:* Lượng đăng ký hàng ngày rất nhỏ, hoàn toàn nằm trong hạn mức 100 email/ngày của tài khoản Gmail cá nhân miễn phí.
* **Rủi ro 3: Xung đột nhánh Git giữa các remote khác nhau.**
  * *Hướng xử lý:* Rà soát `git status` trước khi push, đảm bảo nhánh cục bộ sạch sẽ và đồng bộ với remote trước khi tiến hành cập nhật.

---

## 5. Kịch bản Kiểm thử Nghiệm thu (UAT Verification Plan)

### Kiểm thử Tự động & Thủ công bằng Trình duyệt (Browser UAT)
1. Sử dụng công cụ `browser_subagent` truy cập URL trang live trên Vercel (sẽ lấy từ URL Vercel triển khai hiện tại).
2. Điền form đăng ký với các thông tin kiểm thử (ví dụ: Họ tên "UAT Test Gemini", SĐT "0912345678").
3. Nhấn "Gửi thông tin" và xác nhận giao diện chuyển tiếp hiển thị thành công (có mã QR Zalo nhóm đồng hành).
4. Kiểm tra Google Sheets `CultureCode - NVC Leads` (ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`) xem thông tin có ghi nhận dòng mới đúng thứ tự cột không.
5. Xác nhận với người dùng xem 3 địa chỉ email nhận thông báo đã nhận được email gửi về từ Apps Script hay chưa.
6. Chụp ảnh màn hình làm bằng chứng (evidence) và lưu vào thư mục `UAT/` trong dự án.

---

## 6. Auditor Review (Đánh giá của Codex/Claude)

*Để trống phần này cho Codex/Claude rà soát khi trao đổi chéo hoặc ghi nhận phản hồi.*
