# Task List: Triển khai Hệ Thống Leadership RSVP & Campaign (20/09/2026)

## Phase 1: Rà soát & Chốt Danh sách Khách Mời (22 Suất)
- [x] Rà soát và phân loại danh sách 22 khách mời (v4, v5) <!-- id: 1.1 -->
- [x] Làm rõ 3 suất Apollo: Phạm Thu Hà (tài trợ/chi trả), Nguyễn Đức Anh (KTC), Đoàn Dũng (KTC) <!-- id: 1.2 -->
- [x] Khớp nối chị Thu Hiền (Golden Gate DHM4) -> Tạ Thị Thu Hiền (Head of HCM Golden Gate Group) <!-- id: 1.3 -->
- [x] Khớp suất Giải Nhất: Chị Võ Thu Hằng (KTC Vietnam) <!-- id: 1.4 -->
- [ ] Bổ sung email cho 4 suất còn lại: Đoàn Dũng, Nguyễn Đức Anh, Huy Nguyễn và chốt suất 22 Tâm KTC <!-- id: 1.5 -->

## Phase 2: Chuẩn Hóa Frontend RSVP Web App (`leadership_rsvp.html` & `leadership_rsvp.js`)
- [x] Thiết kế giao diện 3 bước: Xác nhận ➔ Quét mã SePay 250k ➔ Hoàn tất & Join Zalo <!-- id: 2.1 -->
- [x] Cập nhật dẫn giảng: "Dẫn giảng chính: Chị Hà Minh Châu" <!-- id: 2.2 -->
- [x] Chuẩn hóa danh xưng: Thay thế 100% "Ban Tổ chức" / "BTC" thành "CultureCode Team" <!-- id: 2.3 -->
- [x] Tiền tố mã thanh toán độc lập: Chuẩn hóa tiền tố `DHL` (mã `DHL<SĐT>`) <!-- id: 2.4 -->
- [x] Định tuyến Lane `dhl` độc lập (`lane: 'dhl'`, `eventId: 'LEADERSHIP_200926_HCM'`) <!-- id: 2.5 -->
- [x] Tích hợp Group Zalo mới: `https://zalo.me/g/awqtf1ayfblnrwi1y4bq` & ảnh QR nội bộ `assets/dhl_zalo_group_qr.png` <!-- id: 2.6 -->
- [x] Polling JSONP thời gian thực mỗi 3 giây gọi về Apps Script check trạng thái `PAID` <!-- id: 2.7 -->
- [x] Syntax check Node.js pass (`node -c leadership_rsvp.js` -> 0) <!-- id: 2.8 -->

## Phase 3: Chuẩn Hóa Email Thư Mời (`leadership_invitation_email.html`)
- [x] Xây dựng mẫu email chuẩn Premium CultureCode theo `dhm8_reminder_email.html` <!-- id: 3.1 -->
- [x] Nhúng khối thông tin sự kiện: "Dẫn giảng chính: Chị Hà Minh Châu" <!-- id: 3.2 -->
- [x] Chuẩn hóa Brand voice: 100% "CultureCode Team", không dùng "Ban Tổ chức" <!-- id: 3.3 -->
- [x] Xác thực Dynamic Contract Email qua script `Scripts/validate_email_template.py` (PASS) <!-- id: 3.4 -->

## Phase 4: Backend Google Apps Script (Lane `dhl` Độc Lập)
- [x] Bổ sung cấu hình Lane `dhl` vào `Scripts/active_code_gs_final.js`:
  - `dataSheetName: 'DHL_Data'` (lưu dữ liệu học viên xác nhận)
  - `paymentsSheetName: 'DHL_Payments'` (lưu biến động số dư SePay)
  - `paymentPrefix: 'DHL'` (nhận diện tiền tố)
  - `zaloGroupUrl: 'https://zalo.me/g/awqtf1ayfblnrwi1y4bq'`
  - `registrationCap: 25` <!-- id: 4.1 -->
- [x] Bổ sung hàm nhận diện token `isDhlToken_` & `containsDhlToken_` trong Apps Script <!-- id: 4.2 -->
- [x] Syntax check Node.js pass (`node -c Scripts/active_code_gs_final.js` -> 0) <!-- id: 4.3 -->

## Phase 5: Chuẩn Bị Vận Hành, UAT & Triển Khai
- [x] Tạo Group Zalo mới cho lớp Leadership 20/09 & lấy link `zalo.me/g/...` (Đã cập nhật: `https://zalo.me/g/awqtf1ayfblnrwi1y4bq`) <!-- id: 5.1 -->
- [ ] Cập nhật mã Apps Script mới lên Google Spreadsheet dự án <!-- id: 5.2 -->
- [ ] Xin Cấp độ 3 của Sếp để Deploy Frontend lên Vercel Live <!-- id: 5.3 -->
- [ ] Chạy kịch bản UAT giả lập Webhook SePay (không tốn tiền thật) để nghiệm thu luồng từ PENDING -> PAID -> Step 3 <!-- id: 5.4 -->
- [ ] Bắn 1 email thử nghiệm tới `vuhoang2708@gmail.com` qua MCP Gmail để duyệt giao diện <!-- id: 5.5 -->
- [x] Sao chép Planning Artifacts về thư mục dự án theo quy định Mandatory Planning Artifacts Mirroring Rule <!-- id: 5.6 -->
