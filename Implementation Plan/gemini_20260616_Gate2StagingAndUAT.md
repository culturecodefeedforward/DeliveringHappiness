# Kế hoạch Triển khai Gate 2: Staging & UAT cho DHM8 Email Automation

## 1. Đề bài và Bối cảnh (Goal Description)
Thực hiện chạy toàn bộ 20 trường hợp kiểm thử `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) từ UAT-01 đến UAT-20 trên môi trường `staging` (môi trường thử nghiệm tách biệt với môi trường thực tế) cho hệ thống DHM8 Email Automation. 
Do công cụ `clasp` gặp lỗi phân quyền `Execution API` khi gọi API Apps Script từ xa (qua CLI), việc tự động chạy kiểm thử bằng script local tạm thời bị chặn. Ta sẽ chuyển hướng sang chạy trực tiếp các hàm kiểm thử trong Apps Script thông qua `Browser Tool` (Công cụ trình duyệt) kết hợp với các truy vấn và kiểm chứng tự động từ API và browser.

## 2. Hiện trạng và Khó khăn (Pain Points & Issues)
- Công cụ `clasp run` không thể thực thi do thiếu quyền API (chưa cấu hình đầy đủ OAuth hoặc GCP Project liên kết).
- Cần tạo và chuẩn bị đầy đủ các bảng dữ liệu `Google Sheets` trên môi trường Staging khớp 100% với schema yêu cầu trong mã nguồn.
- Cần đảm bảo dữ liệu PII (Personally Identifiable Information - thông tin định danh cá nhân) của học viên không bị lộ lọt trong các phản hồi JSONP và log.
- Cần thực hiện kiểm thử tự động toàn diện và xuất báo cáo nghiệm thu `UAT Report` theo đúng ranh giới an toàn (không ghi đè dữ liệu production, chỉ gửi email đến `RECIPIENT_ALLOWLIST`).

## 3. Giải pháp Kỹ thuật (Proposed Solution)

### Bước 1: Xác minh/Tạo Google Spreadsheet Staging
- Tạo một file `Google Spreadsheet` mới tên là `DHM8_Staging_Sheet_20260616` thông qua `workspace-mcp`.
- Thiết lập đầy đủ 5 tab dữ liệu với header chuẩn như thiết kế:
  - `DHM8_Data`
  - `DHM8_Payments`
  - `DHM8_Email_Outbox`
  - `DHM8_Inbox`
  - `DHM8_System_Logs`

### Bước 2: Đưa mã nguồn lên Apps Script Staging
- Sử dụng `Browser Tool` mở trang chỉnh sửa Google Apps Script của dự án Staging.
- Dán nội dung của hai file mã nguồn:
  1. `Scripts/active_code_gs_final.js` (Mã nguồn chạy chính)
  2. `Scripts/dhm8_gate2_uat_runner.js` (Kịch bản kiểm thử UAT)
- Lưu và triển khai Apps Script dưới dạng `Web App` (Ứng dụng web) môi trường Staging, phân quyền truy cập "Anyone" (Bất kỳ ai) để SePay có thể gọi webhook.

### Bước 3: Cấu hình Môi trường Staging (Bootstrap)
- Thực thi hàm `bootstrapDHM8Gate2Staging()` trong trình soạn thảo Apps Script thông qua `Browser Tool`. Hàm này sẽ tự động điền các thông số cấu hình an toàn cho Staging vào `Script Properties` (Thuộc tính tập lệnh).
- Xác minh các thuộc tính đã được thiết lập đúng, đặc biệt là `ENVIRONMENT=STAGING`, `TEST_MODE=true` và `RECIPIENT_ALLOWLIST=vuhoang2708@gmail.com`.

### Bước 4: Chạy bộ kiểm thử tự động UAT-01 đến UAT-19
- Thực thi hàm `runDHM8Gate2UAT()` trong Apps Script thông qua `Browser Tool`.
- Hàm này sẽ chạy tuần tự các ca kiểm thử từ UAT-01 đến UAT-19 và xuất kết quả trực tiếp ra tab `DHM8_UAT_Report` trong Google Sheet Staging.
- Đọc nội dung bảng `DHM8_UAT_Report` bằng `workspace-mcp` để ghi nhận trạng thái kiểm thử.

### Bước 5: Thực hiện Smoke Test UAT-20
- Lấy URL Web App Staging sau khi deploy.
- Sử dụng công cụ browser hoặc HTTP request để gọi thử:
  - `GET` request kiểm tra JSONP: `GET <WebAppURL>?action=checkStatus&uuid=<uuid>&callback=dhm8Jsonp_ABCDEFGHIJKLMNOP`
  - `POST` request giả lập webhook từ SePay với token staging, đúng định dạng số tài khoản nhận, số tiền và nội dung chuyển khoản.
- Xác nhận các row tương ứng trong `DHM8_Payments` và `DHM8_Data` được cập nhật đúng sang trạng thái `MATCHED` và `PAID`.

### Bước 6: Tổng hợp và Tạo Báo cáo UAT Gate 2
- Viết báo cáo đầy đủ tại `UAT/dhm8_email_uat_report_20260616_gate2.md`.
- Chụp ảnh minh chứng chạy test thành công từ Apps Script Editor và Google Sheet Staging, lưu ảnh vào thư mục `UAT/dhm8_gate2_evidence_20260616/`.

## 4. Các file bị ảnh hưởng (Files Affected)
- `[NEW]` [gemini_20260616_Gate2StagingAndUAT.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260616_Gate2StagingAndUAT.md) (File kế hoạch này)
- `[NEW]` [dhm8_email_uat_report_20260616_gate2.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_email_uat_report_20260616_gate2.md) (Báo cáo UAT nghiệm thu)

## 5. Rủi ro và Biện pháp Phòng ngừa (Risks & Mitigations)
- **Rủi ro ảnh hưởng dữ liệu thật:** Các hàm kiểm thử sẽ can thiệp trực tiếp vào Sheet.
  - *Biện pháp:* Đảm bảo tuyệt đối `ENVIRONMENT=STAGING` và `SPREADSHEET_ID` trỏ vào Spreadsheet Staging mới tạo. Không cấu hình các ID của Production.
- **Rủi ro rò rỉ PII:** JSONP checkStatus có thể trả về thông tin cá nhân.
  - *Biện pháp:* UAT-03 và UAT-04 sẽ xác minh nghiêm ngặt rằng payload JSONP chỉ chứa `success`, `state` và `registrationUuid`.
- **Rủi ro gửi email nhầm cho học viên thật:**
  - *Biện pháp:* Thiết lập `TEST_MODE=true` và `RECIPIENT_ALLOWLIST` chỉ chứa email test `vuhoang2708@gmail.com`.

## 6. Auditor Review (Codex Rà soát)
Kế hoạch này được chuẩn bị để Codex/Claude rà soát tính nhất quán và bảo mật trước khi bàn giao.

---
## 7. Ranh giới Phê duyệt (Approval Boundary)
Tôi sẽ tạm dừng và chờ lệnh **"Approve"**, **"Đồng ý"** hoặc **"OK"** từ User trước khi thực hiện bất kỳ thay đổi nào hoặc chạy các tool kiểm thử.
