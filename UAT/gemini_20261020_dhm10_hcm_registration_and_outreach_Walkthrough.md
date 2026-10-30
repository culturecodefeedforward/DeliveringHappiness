# BÁO CÁO NGHIỆM THU (UAT WALKTHROUGH): HOÀN TẤT ĐIỀU PHỐI VÀ TRIỂN KHAI DHM10 TP.HCM

**Ngày thực hiện:** 20/10/2026  
**Đơn vị thực hiện:** CultureCode Team  
**Môi trường kiểm thử:** Local Browser (Puppeteer Headless E2E) & Live Production Google Sheet (`1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`)  
**Trạng thái nghiệm thu:** `Local & Live Data VERIFIED`

---

## 1. TỔNG QUAN KẾT QUẢ ĐẠT ĐƯỢC

Đáp ứng trọn vẹn 3 yêu cầu cốt lõi theo chỉ đạo của Sếp Dzũ:
1. **Yêu cầu 1 — Soạn thảo Thông báo Chính thức:** Đã hoàn thiện văn bản thông báo chính thức với thông điệp tích cực, chân thành giải thích lý do tổ chức Offline trọn vẹn tại TP.HCM (ngày Chủ Nhật, 01/11/2026) kết hợp buổi Webinar trực tuyến 90 phút (LMS Chặng 1) vào tối Thứ Sáu, 30/10/2026. Tuân thủ tuyệt đối quy chuẩn thương hiệu CultureCode Team, văn phong chừng mực, chống khoa trương/cường điệu.
2. **Yêu cầu 2 — Cấu hình Link & Trang Đăng ký DHM10, Kiểm thử Trình duyệt E2E ghi dữ liệu thực tế vào Google Sheet:**
   - Đã gỡ bỏ hoàn toàn script tự động chuyển hướng (`window.location.replace("interest_dh10.html")`).
   - Cập nhật thông tin tiêu đề, thời gian, lịch trình, chi phí hậu cần 250.000đ và khối chọn địa điểm Offline TP.HCM.
   - Đồng bộ 100% giữa `register_dhm10.html` và `release_package/register_dhm10.html`.
   - Thực thi Puppeteer E2E Browser Test: Điền form thực tế, submit thành công, hiển thị giao diện chúc mừng kèm mã thanh toán SePay `DHM10...` và mã QR ngân hàng.
   - **Xác minh 2 lớp Google Sheet:** Đọc lại trực tiếp (`read-back`) từ Google Sheet CRM chính (`1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`), xác nhận tab `DHM10_Data` đã được tự động khởi tạo và ghi nhận đầy đủ 19 trường dữ liệu của lượt đăng ký thử nghiệm (UUID: `05d941da-e5f6-4232-81ec-f288ff001684`).
3. **Yêu cầu 3 — Lọc Danh Sách Học Viên Quan Tâm Đầu TP.HCM & Đóng Gói Template Email Xác Nhận Kèm VietQR / SePay:**
   - Trích xuất từ CSDL thực tế (tab `DHM10 interest` có 57 lượt quan tâm): Lọc ra chính xác **13 bản ghi** chọn điểm cầu TP.HCM (11 học viên tiềm năng từ các doanh nghiệp/tổ chức uy tín + 2 tài khoản kiểm thử/nội bộ).
   - Xuất dữ liệu sạch ra 2 định dạng: `Artifacts/danh_sach_quan_tam_dhm10_hcm.csv` và `Artifacts/danh_sach_quan_tam_dhm10_hcm.json`.
   - Chuẩn hóa mẫu Email `Artifacts/standardized_emails/dhm10_pending_email.html` theo nhận diện thương hiệu CultureCode Team, tích hợp mã QR VietQR / SePay động (`https://qr.sepay.vn/img?...`) và vượt qua 100% kịch bản kiểm tra tự động của `validate_email_template.py`.
   - Cập nhật script `Scripts/send_dhm10_registration_reminder.py` sẵn sàng cho chiến dịch gửi thư (bảo vệ bằng cổng an toàn Cấp độ 3).

---

## 2. BẰNG CHỨNG KIỂM THỬ CHI TIẾT (VERIFICATION EVIDENCE)

### A. Kiểm thử Trình duyệt E2E (Puppeteer Browser Test)
- **Kịch bản thực thi:** `node scratch/run_e2e_register_dhm10.js`
- **Kết quả điều hướng:** Mở trang `http://localhost:3456/register_dhm10.html` — Giữ nguyên trang, không bị redirect sang `interest_dh10.html`.
- **Dữ liệu nhập liệu:**
  + Họ và tên: `Vũ Hoàng (Test UAT DHM10 HCM)`
  + Email: `vuhoang2708software@gmail.com`
  + Số điện thoại: `0900001234`
  + Địa điểm học: `TP.HCM - Cơ sở Apollo English` (checked)
  + Tên người giới thiệu: `CultureCode Lead`
  + SĐT người giới thiệu: `0983453145`
- **Màn hình thành công (`#successMessage`):**
  + Mã nội dung chuyển khoản: `DHM10900001234`
  + Tài khoản nhận tiền: `VA 96247CULTURECODE / BIDV 8815369431 / Hà Ngọc Hoàn`
  + Số tiền: `250.000đ`
  + Mã QR SePay: Hiển thị hợp lệ, URL `https://qr.sepay.vn/img?acc=96247CULTURECODE&bank=BIDV&amount=250000&des=DHM10900001234&template=compact&showinfo=false&holder=HA+NGOC+HOAN`
- **Ảnh chụp bằng chứng:**
  + Màn hình form đã điền: [uat_dhm10_hcm_browser_form_filled.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/uat_dhm10_hcm_browser_form_filled.png) (`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\uat_dhm10_hcm_browser_form_filled.png`)
  + Màn hình đăng ký thành công: [uat_dhm10_hcm_browser_success.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/uat_dhm10_hcm_browser_success.png) (`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\uat_dhm10_hcm_browser_success.png`)

### B. Kiểm chứng Đọc Lại Bảng Tính Google Sheet (Google Sheets API Read-Back)
- **ID Bảng tính:** `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`
- **Tab dữ liệu:** `DHM10_Data`
- **Dòng dữ liệu thứ 2 (ghi nhận thực tế):**
  ```json
  [
    "20/10/2026 20:22:45",
    "Vũ Hoàng (Test UAT DHM10 HCM)",
    "vuhoang2708software@gmail.com",
    "900001234",
    "", "", "", "", "", "Chưa tham gia", "", "", "",
    "CultureCode Lead",
    "983453145",
    "PENDING",
    "DHM10_REG_2026_OFFLINE_HCM",
    "05d941da-e5f6-4232-81ec-f288ff001684",
    "TP.HCM - Cơ sở Apollo English"
  ]
  ```
- **Kiểm chứng API trạng thái Backend:**
  Endpoint `?action=checkRegistrationAvailability&lane=dh10` trả về:
  `{"success":true,"state":"OPEN","registrationOpen":true,"cap":40,"paidCount":0,"dataRowCount":1,"countBasis":"PAID"}`.

### C. Kiểm định Hợp đồng Nội dung Mẫu Email (Email Content Contract Validation)
- **Lệnh thực thi:** `python Scripts/validate_email_template.py Artifacts/standardized_emails/dhm10_pending_email.html`
- **Kết quả:**
  + Source of Truth Account: BIDV 8815369431 (Hà Ngọc Hoàn) — **PASS**
  + Official Signature: `CultureCode Team` — **PASS**
  + HTTP 200 OK cho toàn bộ link logo và QR code SePay — **PASS**
  + Kết luận: `=== DYNAMIC VALIDATION PASSED PROPERLY ===`

---

## 3. DANH SÁCH TẬP TIN TÁC ĐỘNG & BÀN GIAO (ARTIFACTS MANIFEST)

| Tên tệp tin | Đường dẫn tuyệt đối Windows | Liên kết nhấp chuột | Mô tả nội dung |
| :--- | :--- | :--- | :--- |
| **Thông báo chính thức** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\thong_bao_dhm10_offline_hcm.md` | [thong_bao_dhm10_offline_hcm.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/thong_bao_dhm10_offline_hcm.md) | Văn bản thông báo chính thức DHM10 TP.HCM và lý do tập trung Offline |
| **Trang đăng ký DHM10** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_dhm10.html` | [register_dhm10.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dhm10.html) | Giao diện đăng ký DHM10 chính thức (gỡ redirect, chốt lịch 01/11 & 30/10) |
| **Gói phát hành đăng ký** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\register_dhm10.html` | [release_package/register_dhm10.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/release_package/register_dhm10.html) | Bản sao đồng bộ phục vụ triển khai Vercel / Production |
| **Mẫu Email xác nhận** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\standardized_emails\dhm10_pending_email.html` | [dhm10_pending_email.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/standardized_emails/dhm10_pending_email.html) | Mẫu email gửi học viên kèm VietQR / SePay tự động và lịch trình TP.HCM |
| **DS quan tâm TP.HCM (CSV)** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\danh_sach_quan_tam_dhm10_hcm.csv` | [danh_sach_quan_tam_dhm10_hcm.csv](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/danh_sach_quan_tam_dhm10_hcm.csv) | Bảng dữ liệu 13 cá nhân quan tâm TP.HCM kèm mã thanh toán và link QR |
| **DS quan tâm TP.HCM (JSON)** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\danh_sach_quan_tam_dhm10_hcm.json` | [danh_sach_quan_tam_dhm10_hcm.json](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/danh_sach_quan_tam_dhm10_hcm.json) | Dữ liệu cấu trúc phục vụ script gửi email tự động |
| **Script gửi email** | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\send_dhm10_registration_reminder.py` | [send_dhm10_registration_reminder.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/send_dhm10_registration_reminder.py) | Script kích hoạt luồng gửi email tự động (có cờ an toàn Cấp độ 3) |
