# Implementation Plan - Personal Value Secure Ship

**Ngày:** 2026-07-15  
**Tác giả:** Gemini  
**Trạng thái:** Chờ phê duyệt (Awaiting Approval)  
**Tài liệu tham chiếu:** [codex_20260715_personal_value_safety_review.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/codex_20260715_personal_value_safety_review.md)

---

## 1. Mục tiêu (Goal)
Hoàn thiện tính năng khảo sát Giá trị Cốt lõi (Personal Value Compass) đạt chuẩn an toàn môi trường chạy thực tế (production-ready). Giải quyết triệt để các lỗ hổng bảo mật được Codex chỉ ra bao gồm: spam gửi email, ghi nhiễm bẩn Google Sheets, HTML injection, lỗi tính toán tỷ lệ động lực Schwartz, lỗi điều hướng phím quay lại và cải tiến cảnh báo mềm Step 2.

---

## 2. Các thay đổi đề xuất (Proposed Changes)

### 2.1. Backend Google Apps Script (`Scripts/active_code_gs_final.js`)

#### A. Xác thực biểu mẫu và CAPTCHA (Cơ chế chặn bot spam)
*   **Bổ sung Xác minh CAPTCHA:**
    *   Sử dụng cơ chế kiểm chứng toán học nhẹ nhàng (Math puzzle verification) có mã hóa token ở client và giải mã kiểm tra ở backend.
    *   Công thức kiểm tra token: `captchaToken === (num1 * 3 + num2 * 7) ^ 90`.
    *   Học viên nhập kết quả tính toán `num1 + num2`. Server kiểm tra tính đúng đắn của phép tính và tính nhất quang của token.
*   **Kiểm soát Hạn mức & Tần suất (Rate Limiting & Quota Guard):**
    *   Kiểm tra số lượng gửi từ cùng 1 địa chỉ email nhận trong vòng 5 phút qua. Giới hạn tối đa **3 lượt gửi/5 phút** trên mỗi email để chặn các hành vi cố ý spam phá hoại.
    *   Bổ sung `KILL_SWITCH_PV` điều khiển qua thuộc tính kịch bản (Script Properties). Nếu được đặt là `'true'`, vô hiệu hóa toàn bộ API khảo sát PV.
    *   Tích hợp kiểm tra hạn mức email hàng ngày thông qua `getRemainingQuota()`. Nếu còn ít hơn 5 lượt gửi, ghi nhận cảnh báo hệ thống và chỉ ghi Sheet, không gửi mail tránh làm cạn kiệt quota dịch vụ chính (DHM8/DHM9).
    *   Tự động áp dụng `TEST_MODE` và `RECIPIENT_ALLOWLIST` giống như email outbox chính để chặn email thử nghiệm gửi tới khách hàng thật trong quá trình chạy thử.

#### B. Xác thực dữ liệu đầu vào (Input Validation)
*   Kiểm tra tính hợp lệ của địa chỉ Email bằng biểu thức chính quy (regular expression).
*   Kiểm tra và giới hạn độ dài của `fullName` (Tối đa 100 ký tự).
*   Mã hóa toàn bộ các ký tự HTML đặc biệt chống tấn công chèn mã độc (HTML Injection) trong email bằng hàm `escapeHtml_()` có sẵn cho: `fullName`, `item.name`, `item.score`, `item.details`.
*   Kiểm tra định dạng `rankedData` bắt buộc phải là mảng JSON chứa chính xác **7 đối tượng** xếp hạng, với giá trị điểm số từ 0 đến 6 (không cho phép điểm số âm hoặc cực đại bất thường).

#### C. Cập nhật Thuật toán Tính toán Nhóm Động Lực Schwartz
*   Bổ sung đầy đủ 41 giá trị cốt lõi canonical từ frontend vào bảng ánh xạ động lực (bao gồm `"Sự cân bằng"` được xếp vào nhóm Vượt lên Bản thân `ST`).
*   Loại trừ hoàn toàn các giá trị tự định nghĩa (custom values) ra khỏi mẫu số tính tỷ lệ (denominator) thay vì tự động xếp vào nhóm Duy trì Ổn định `CO`, giúp kết quả phân tích phản ánh chính xác nhất tâm lý người dùng.
*   Bảo vệ mã nguồn tránh phát sinh lỗi `NaN` bằng cách ép kiểu số `Number(item.score) || 0` và kiểm tra mảng an toàn.

---

### 2.2. Frontend Web App (`personal-value.html` & `personal-value.js`)

*   **Tích hợp UI CAPTCHA:**
    *   Thêm ô nhập xác minh toán học ngẫu nhiên vào Form Card ở Bước 4.
    *   Tự động tạo phép tính ngẫu nhiên `num1 + num2 = ?` khi hiển thị kết quả và gửi kèm các tham số mã hóa lên backend.
*   **Chuyển đổi giao thức gửi dữ liệu sang JSONP:**
    *   Thay thế lệnh gửi `fetch POST no-cors` vốn không đọc được kết quả phản hồi của Apps Script bằng cơ chế **JSONP GET**.
    *   Giúp frontend nhận biết chính xác trạng thái xử lý của server (ví dụ: gửi thành công, sai CAPTCHA, hoặc bị giới hạn tần suất) để hiển thị thông báo lỗi trực quan cho người dùng, thay vì báo thành công giả.
*   **Giữ nguyên UX Hotfix:**
    *   Đảm bảo điều hướng lùi bước tuần tự `step4 -> step3 -> step2 -> step1 -> index.html` hoạt động bền bỉ và giữ nguyên dữ liệu đã nhập/chọn.
    *   Đảm bảo nhãn cảnh báo đỏ `#selectionWarning` hiển thị mượt mà thay thế alert popup phiền phức.

---

## 3. Kế hoạch kiểm chứng (Verification / UAT Plan)

### 3.1. Kiểm thử tự động (Automated / Script Verification)
1.  Chạy `node --check personal-value.js` kiểm tra lỗi cú pháp frontend.
2.  Chạy script kiểm thử Puppeteer [dh4hn_uat.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/dh4hn_uat.js) trên môi trường cục bộ để kiểm tra tự động toàn bộ luồng khảo sát.

### 3.2. Kiểm thử nghiệm thu người dùng (Manual UAT)
Sử dụng browser để kiểm chứng thực tế:
*   **Chọn > 7 thẻ ở Bước 2:** Xác minh hiển thị nhãn cảnh báo `(Chỉ chọn đúng 7 giá trị!)` dạng nhấp nháy, nút tiếp tục bị khóa.
*   **Nhấn nút Quay lại ở Header:** Xác minh chuyển đổi lùi bước mượt mà không làm mất dữ liệu đã tương tác trước đó.
*   **Nhập sai CAPTCHA:** Xác minh frontend hiển thị thông báo lỗi và không ghi Sheets/gửi mail.
*   **Nhập đúng CAPTCHA:** Xác minh dữ liệu được ghi nhận chính xác tại sheet `PV_Data` và email được gửi về đúng địa chỉ nhận (trong chế độ test mode sẽ chuyển hướng về allowlist).
*   **Gửi liên tiếp nhiều lần:** Xác minh kích hoạt cơ chế giới hạn tần suất `RATE_LIMIT_EXCEEDED` sau 3 lần gửi liên tục.
*   **Regression check (Kiểm tra hồi quy):** Thử nghiệm chạy API đăng ký DHM9 (`checkRegistrationAvailability`) để đảm bảo hệ thống cốt lõi hoạt động bình thường.

---

## 4. Kế hoạch quay lui (Rollback Plan)
Nếu phát hiện lỗi nghiêm trọng trên live hoặc Apps Script:
1.  **Backend:** Triển khai lại phiên bản Apps Script cũ trước đó qua Apps Script Editor hoặc khôi phục mã nguồn file `active_code_gs_final.js` về commit gần nhất.
2.  **Vercel:** Chạy lệnh revert deploy hoặc trỏ domain về commit stable gần nhất trên bảng điều khiển Vercel.
