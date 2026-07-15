# Báo cáo rà soát an toàn Codex - Personal Value Report

Ngày: 2026-07-15
Người rà soát: Codex
Phạm vi: thay đổi cục bộ chưa commit trong `Scripts/active_code_gs_final.js`, `personal-value.html`, và `personal-value.js`

## Kết luận

BLOCKED (bị chặn) cho `deploy` (đưa lên public) / `clasp push` (đẩy mã lên Apps Script).

Nhánh `submit_pv` mới có vẻ tách route (đường xử lý request) khỏi luồng đăng ký DHM8/DHM9 và webhook SePay, nhưng nó thêm một bề mặt public chưa xác thực để gửi email + ghi Sheet, đồng thời bỏ qua `guardrails` (quy tắc an toàn bắt buộc) của hàng đợi email hiện hữu. Rủi ro này có thể làm cạn quota MailApp dùng chung và ảnh hưởng gián tiếp đến email đăng ký/thanh toán hiện tại.

## Bằng Chứng Đã Kiểm Chứng

- `git status --short --branch`: `Scripts/active_code_gs_final.js`, `personal-value.html`, và `personal-value.js` đang modified (đã sửa); `UAT/gemini_20260715_PersonalValueUAT.md`, `UAT/report.pdf`, và `dh4hn_uat.js` đang untracked (chưa được Git theo dõi).
- `git diff -- Scripts/active_code_gs_final.js`: thêm route `body.action === 'submit_pv'` ở dòng 696-699 và các handler PV ở dòng 1704-1857.
- `node --check Scripts/active_code_gs_final.js`: kiểm tra cú pháp đạt.
- `node --check personal-value.js`: kiểm tra cú pháp đạt.
- Mapping check (kiểm tra ánh xạ): frontend có 41 tên giá trị; mapping Schwartz ở backend thiếu `Sự cân bằng`.

## Phát Hiện Chính

### 1. Nghiêm trọng - endpoint public có thể bị lạm dụng để gửi email và làm bẩn Sheet

Evidence (bằng chứng):
- `Scripts/active_code_gs_final.js:696-699` đưa mọi JSON body (nội dung request dạng JSON) có `action: submit_pv` vào `handlePersonalValuesSubmission`.
- `Scripts/active_code_gs_final.js:1704-1751` ghi trực tiếp vào `PV_Data` rồi gọi gửi email.
- `Scripts/active_code_gs_final.js:1852-1856` gọi trực tiếp `MailApp.sendEmail`.
- Hàng đợi email hiện hữu ở `Scripts/active_code_gs_final.js:1427-1503` có `KILL_SWITCH_EMAIL`, `TEST_MODE`, `RECIPIENT_ALLOWLIST`, kiểm tra quota, và trạng thái retry (thử lại), nhưng nhánh PV mới bỏ qua các lớp này.

Impact (tác động):
- Bất kỳ ai gọi được Web App URL đều có thể kích hoạt email đến người nhận tùy ý và ghi không giới hạn vào `PV_Data`.
- Cạn quota MailApp có thể chặn hoặc làm chậm email đăng ký/thanh toán DHM8/DHM9 hiện tại.
- `no-cors` (chế độ không đọc được phản hồi backend) ở frontend có thể khiến user thấy thành công kể cả khi backend ghi/gửi thất bại.

Required fix (cần sửa):
- Thêm validation (kiểm tra dữ liệu đầu vào) và kill switch (công tắc tắt khẩn cấp) riêng cho PV.
- Reuse (tái dùng) hàng đợi email hiện hữu hoặc áp dụng kiểm tra quota/test-mode/allowlist tương đương.
- Kiểm tra `fullName`, `email`, `rankedData`, giới hạn kích thước payload, đúng 7 mục xếp hạng, điểm dạng số, và xử lý giá trị canonical/custom trước khi ghi hoặc gửi.

### 2. Cao - rủi ro HTML injection trong email

Evidence:
- `sendPersonalValuesEmail` nối trực tiếp `fullName`, `item.name`, `item.score`, và `item.details` vào `htmlBody` tại `Scripts/active_code_gs_final.js:1793-1821` mà không escape (mã hóa ký tự HTML nguy hiểm).
- Helper (hàm hỗ trợ) `escapeHtml_` đã có sẵn tại `Scripts/active_code_gs_final.js:1572-1578`.

Impact:
- Payload được dàn dựng có thể đổi nội dung HTML email, chèn link gây hiểu sai, hoặc phá layout báo cáo.

Required fix:
- Áp dụng `escapeHtml_` cho mọi field (trường dữ liệu) do user kiểm soát trước khi dựng `htmlBody`.

### 3. Cao - kết quả Schwartz dimensions chưa đủ tin cậy

Evidence:
- Mapping backend thiếu giá trị frontend `Sự cân bằng`.
- Frontend hỗ trợ custom values (giá trị tự định nghĩa) tại `personal-value.js:155-218`; backend hiện default (mặc định) unknown values về `CO`.
- `calculateSchwartzDimensions` đang giả định `ranked.forEach` luôn tồn tại và điểm luôn là số.

Impact:
- Một kết quả hợp lệ có thể bị lệch về Conservation (nhóm duy trì ổn định) vì giá trị unknown/custom âm thầm rơi vào `CO`.
- Payload lỗi định dạng có thể làm fail (thất bại) việc tạo email hoặc sinh tỷ lệ `NaN`.

Required fix:
- Map (ánh xạ) đủ 41 giá trị canonical (danh sách chuẩn) ở frontend.
- Không default (mặc định) unknown/custom value về `CO`; hoặc đánh dấu `unknown`, hoặc loại khỏi denominator (mẫu số tính tỷ lệ), hoặc gửi dimension (nhóm động lực) từ frontend.
- Ép kiểu và validate điểm trước khi tính.

### 4. Cao - UAT chưa phủ thay đổi backend

Evidence:
- `UAT/gemini_20260715_PersonalValueUAT.md:10` says Apps Script deployment is N/A and no Apps Script changed.
- `dh4hn_uat.js:35-38` opens `http://127.0.0.1:8087/personal-value.html`, not the claimed production URL.
- Script UAT dừng sau screenshot kết quả và không test tải PDF, `submit_pv`, `PV_Data`, hoặc email delivery (gửi email đến nơi).

Impact:
- UAT hiện tại không đủ để claim (khẳng định) Sheet/email/backend đã được kiểm chứng.

Required fix:
- Thay hoặc bổ sung UAT bằng test plan có backend: target Apps Script staging an toàn, không production Sheet mutation (ghi dữ liệu production) nếu chưa được duyệt trực tiếp, có evidence cho `PV_Data`, trạng thái gửi/outbox email, và regression probes (kiểm tra hồi quy) cho route đăng ký/thanh toán DHM8/DHM9.

## Đánh Giá Regression Cho Đăng Ký / Thanh Toán

INFERRED (suy luận từ đọc code): route mới ít khả năng trực tiếp làm gãy đăng ký hiện tại hoặc matching (khớp giao dịch) SePay vì:
- SePay routing remains above the PV branch at `Scripts/active_code_gs_final.js:681-693`.
- Payload (gói dữ liệu gửi lên) đăng ký DHM8/DHM9 trong `register.js` và `register_dh9.js` dùng `type/source`, không dùng `action: submit_pv`.
- Code mới không đổi `handleRegistration`, `handleSePayWebhook`, lane config (cấu hình từng luồng), payment matching (khớp thanh toán), hoặc hằng số thanh toán.

Residual risk (rủi ro còn lại):
- Nhánh PV vẫn có thể ảnh hưởng gián tiếp tới DHM8/DHM9 nếu tiêu thụ quota MailApp và năng lực chạy Apps Script dùng chung.

## Cần Có Trước Khi Duyệt

1. Sửa bề mặt lạm dụng MailApp/Sheet trực tiếp.
2. Escape mọi HTML do user kiểm soát.
3. Sửa mapping Schwartz và validation đầu vào.
4. Tạo UAT cập nhật bao phủ backend/email/Sheet và bề mặt regression DHM8/DHM9, không chuyển tiền thật và không ghi production trái approval.
