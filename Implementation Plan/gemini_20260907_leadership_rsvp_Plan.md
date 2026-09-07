# Kế Hoạch Triển Khai: Hệ Thống Leadership RSVP & Thư Mời (20/09/2026)

## Mục Tiêu (Goal)
Chuẩn bị và triển khai toàn diện giải pháp RSVP 1-chạm cá nhân hóa (`leadership_rsvp.html` & `leadership_rsvp.js`), kịch bản email thư mời (`leadership_invitation_email.html`), và cấu hình Lane `dhl` backend độc lập (`DHL_Data`, `DHL_Payments`) cho khóa đào tạo đặc biệt **Team Happiness Starts With Your Leadership** diễn ra vào ngày 20/09/2026 tại Apollo Training Room, Phạm Ngọc Thạch, Quận 3, TP.HCM.

Dẫn giảng chính: **Chị Hà Minh Châu**.

---

## Các Quyết Định Kiến Trúc & Vận Hành Quan Trọng (Key Architectural Decisions)

1. **Cơ Chế Clone Lane Độc Lập (`Lane dhl`)**:
   - Nhân bản nguyên lý vận hành của DHM8 nhưng thiết lập một Lane hoàn toàn độc lập mang mã `dhl`.
   - Bảng dữ liệu học viên: **`DHL_Data`** (tự sinh trên Google Spreadsheet nếu chưa có).
   - Bảng lịch sử giao dịch: **`DHL_Payments`** (lưu log SePay cho các mã `DHL`).
   - Tiền tố thanh toán: **`DHL`** (mã `DHL<SĐT>`).
   - Tuyệt đối không lưu chung vào `DHM8_Data` hay dùng chung mã `DH8` để tránh làm ô nhiễm dữ liệu của lớp DHM8.

2. **Dẫn Giảng Chính**:
   - Cập nhật chuẩn: **"Dẫn giảng chính: Chị Hà Minh Châu"** trên toàn bộ các tệp liên quan.

3. **Chuẩn Hóa Danh Xưng Thương Hiệu (Brand Voice)**:
   - Thay thế 100% các từ ngữ "Ban Tổ chức", "Ban tổ chức", "BTC" bằng danh xưng chuẩn: **"CultureCode Team"**.

4. **Kịch Bản Kiểm Thử Giả Lập Toàn Trình (SePay Simulation UAT)**:
   - Cung cấp kịch bản test không cần chuyển tiền thật bằng 2 phương thức:
     - Dùng tính năng gửi webhook giả lập trên dashboard SePay.
     - Dùng lệnh PowerShell 1-chạm gửi payload webhook có token bảo mật về Web App endpoint.

---

## Chi Tiết Các Tệp Thay Đổi (Proposed Changes)

### 1. Frontend RSVP Web App
- `leadership_rsvp.html`:
  - Khối thông tin sự kiện: "Dẫn giảng chính: Chị Hà Minh Châu", "Chi phí đào tạo: Được CultureCode Team tài trợ 100%".
  - Giao diện 3 bước: Xác nhận ➔ Quét mã SePay 250k ➔ Hoàn tất & Join Zalo.
  - Loại bỏ hoàn toàn danh xưng "Ban Tổ chức".
- `leadership_rsvp.js`:
  - Prefill tham số URL (`email`, `phone`, `name`, `company`, `jobTitle`).
  - Tiền tố thanh toán: `DHL` + 9 số cuối SĐT (`DHL0978092749`).
  - Polling ngầm JSONP mỗi 3 giây kiểm tra trạng thái thanh toán từ Apps Script.
  - Loại bỏ hoàn toàn danh xưng "Ban Tổ chức" trong hộp thoại xác nhận.

### 2. Backend Google Apps Script
- `Scripts/active_code_gs_final.js`:
  - Thêm cấu hình `resolvedLane === 'dhl'`:
    - `dataSheetName: 'DHL_Data'`
    - `paymentsSheetName: 'DHL_Payments'`
    - `paymentPrefix: 'DHL'`
    - `registrationCap: 25`
    - `defaultEventId: 'LEADERSHIP_200926_HCM'`
    - `defaultLeadType: 'EVENT_LEAD_LEADERSHIP'`
    - `defaultLeadSource: 'Web_Leadership_RSVP'`
  - Thêm hàm nhận diện token `isDhlToken_` và `containsDhlToken_`.
  - Cập nhật `detectLaneKeyFromPaymentCode_` và `detectLaneKeyFromPayload_` nhận diện Lane `dhl`.

### 3. Email Thư Mời Khách Mời
- `Artifacts/standardized_emails/leadership_invitation_email.html`:
  - Cấu trúc chuẩn theo mẫu Premium CultureCode `dhm8_reminder_email.html`.
  - Khối thông tin: Dẫn giảng chính: Chị Hà Minh Châu; Chi phí đào tạo: CultureCode Team tài trợ 100%; Catering: 250,000 VNĐ.
  - Nút CTA 1-chạm `{LINK_XAC_NHAN}` dẫn đến trang RSVP.
  - Loại bỏ hoàn toàn danh xưng "Ban Tổ chức".
  - Kiểm định qua `Scripts/validate_email_template.py` đạt chuẩn `DYNAMIC VALIDATION PASSED PROPERLY`.

---

## Kế Hoạch Nghiệm Thu (Verification Plan)

1. **Static Verification**:
   - `node -c leadership_rsvp.js` ➔ PASS (Exit code 0).
   - `node -c Scripts/active_code_gs_final.js` ➔ PASS (Exit code 0).
   - `python Scripts/validate_email_template.py Artifacts/standardized_emails/leadership_invitation_email.html` ➔ PASS (Exit code 0).
2. **Local Simulation Verification**:
   - Hướng dẫn test giả lập Webhook SePay qua PowerShell.
3. **Artifact Mirroring**:
   - Mirror `implementation_plan.md` ➔ `Implementation Plan/gemini_20260907_leadership_rsvp_Plan.md`.
   - Mirror `task.md` ➔ `Implementation Plan/gemini_20260907_leadership_rsvp_Task.md`.
