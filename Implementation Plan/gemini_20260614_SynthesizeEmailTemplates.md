# Kế hoạch Triển khai (Implementation Plan) - Tổng hợp Template Email từ Sent Items

**Mã Task**: SynthesizeEmailTemplates  
**Ngày tạo**: 14/06/2026 (Cập nhật: 15/06/2026)  
**Người thực hiện**: Gemini (Antigravity)  
**Trạng thái**: Chờ phê duyệt (Pending Approval)  
**Đường dẫn kế hoạch**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260614_SynthesizeEmailTemplates.md`

---

## 1. Đề bài (Requirements)
* Thu thập các email đã gửi (`sent items` - thư đã gửi) trong hòm thư `culturecodeproject@gmail.com` trong khoảng thời gian từ **15/06/2025 đến 15/06/2026**.
* Phân tích, chuẩn hóa và tổng hợp thành các mẫu thư chuẩn (`email templates` - mẫu thư điện tử) phục vụ mục đích lưu trữ và đối chiếu sau này.

## 2. Đối chiếu & Thiết lập Nguồn chuẩn (Source of Truth Alignment)
Trước khi bắt đầu, chúng ta đối chiếu ba nguồn tài liệu liên quan trong dự án:
1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm8_email_templates.md`: Chứa các mẫu email HTML đang dùng cho hệ thống tự động hóa đăng ký của DHM8 (bao gồm Email Xác nhận, Email Đã Thanh Toán, và Email Thông báo BTC).
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260614_ExtractGmailTemplates.md`: Kế hoạch ban đầu mô tả việc trích xuất Gmail. Kế hoạch `gemini_20260614_SynthesizeEmailTemplates.md` hiện tại sẽ là **kế hoạch cập nhật chính thức và duy nhất**, thay thế hoàn toàn cho kế hoạch cũ đó để tránh phân mảnh tài liệu.
3. **Artifact đầu ra dự kiến**: Tài liệu tổng hợp các mẫu email tìm được từ hộp thư gửi đi của `culturecodeproject@gmail.com`.

**Quy tắc thiết lập nguồn chuẩn:**
* **Nguồn chuẩn đầu vào**: Hộp thư gửi đi thực tế của `culturecodeproject@gmail.com` (15/06/2025 - 15/06/2026) là nguồn chuẩn duy nhất phản ánh những email thực tế đã gửi.
* **Đối chiếu cấu trúc**: Các mẫu email HTML mới tạo trong `dhm8_email_templates.md` sẽ được đối chiếu với các email lịch sử để xem có sự cải tiến hay khác biệt đáng kể nào về văn phong hoặc cấu trúc cần lưu ý hay không.
* **Nguồn chuẩn đầu ra**: Artifact `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\email_templates_synthesis.md` sẽ là tài liệu tổng hợp cuối cùng chứa toàn bộ các mẫu email lịch sử đã được chuẩn hóa và ẩn danh hóa.

## 3. Giải pháp Kỹ thuật (Technical Solution)
Sử dụng công cụ tích hợp Google Workspace (`workspace-mcp`) để thực hiện:
1. **Tìm kiếm phân tầng theo nhóm chủ đề (Stratified Search):**
   Thay vì tải toàn bộ thư hoặc giới hạn số lượng đơn giản, ta thực hiện tìm kiếm phân tầng theo 3 nhóm truy vấn trong khoảng thời gian `15/06/2025` đến `15/06/2026`:
   * **Nhóm 1 (Xác nhận/Chào mừng):** `from:me after:2025/06/15 before:2026/06/16 subject:( đăng ký OR "xác nhận" OR "welcome" )`
   * **Nhóm 2 (Thanh toán/Học phí):** `from:me after:2025/06/15 before:2026/06/16 subject:( "thanh toán" OR "chuyển khoản" OR "học phí" OR "chi phí" )`
   * **Nhóm 3 (Nhắc nhở/Tài liệu/Lớp học):** `from:me after:2025/06/15 before:2026/06/16 subject:( "nhắc nhở" OR "reminder" OR "tài liệu" OR "lớp học" OR "chuẩn bị" )`
2. **Tải nội dung chi tiết:** Tải nội dung chi tiết của các email tìm thấy theo từng phân tầng bằng `mcp_get_gmail_messages_content_batch`.
3. **Khử trùng và Chuẩn hóa nội dung (Content Normalization & Deduplication):**
   * Không khử trùng đơn giản bằng ngày và tiêu đề (`subject`).
   * Sử dụng nội dung email sau khi đã loại bỏ các biến động (tên học viên, số điện thoại, ngày giờ cụ thể) để so sánh nội dung.
   * Nếu có sự khác biệt về nội dung giữa các thư cùng loại, sẽ **giữ lại phiên bản gửi gần nhất (mới nhất)** làm mẫu chuẩn, hoặc ghi nhận dưới dạng biến thể kèm số phiên bản cụ thể.
4. **Bảo mật PII tuyệt đối (PII Protection):**
   * Tuyệt đối không ghi nội dung email thô, danh sách địa chỉ người nhận, hoặc bất kỳ thông tin `PII` (Personally Identifiable Information - thông tin định danh cá nhân) nào của học viên vào file markdown trong repo, log hay artifact trung gian.
   * Quá trình xử lý ẩn danh hóa PII sẽ diễn ra hoàn toàn trong bộ nhớ tạm (runtime memory) của Agent. Toàn bộ thông tin cá nhân như tên học viên, email, số điện thoại, số tài khoản, số tiền sẽ được tự động chuyển đổi thành `{FullName}`, `{Email}`, `{Phone}`, `{Amount}`, v.v. trước khi lưu trữ hoặc ghi nhận.

## 4. Các file bị ảnh hưởng (Affected Files)
* **Tạo mới:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\email_templates_synthesis.md` (chứa các template đã chuẩn hóa và ẩn danh hóa).
* **Không sửa đổi** bất kỳ file mã nguồn nào của website hay webhook.

## 5. Rào cản An toàn & Ranh giới Phê duyệt (Approval Boundary & Rollback)
* **Ranh giới Phê duyệt (Approval Boundary):** Task này được giới hạn nghiêm ngặt trong việc **chỉ đọc dữ liệu Gmail và ghi nhận artifact ẩn danh hóa**. Nghiêm cấm:
  * Không gửi bất kỳ email nào (No outgoing emails).
  * Không chỉnh sửa cấu hình webhook hay mã nguồn (No code modifications).
  * Không tự động thực hiện commit, push hoặc deploy lên production (môi trường vận hành thực tế).
* **Quay lui (Rollback/Backup Plan):**
  * Do không thay đổi code hay cấu hình hệ thống, việc quay lui chỉ đơn giản là xóa bỏ file artifact `email_templates_synthesis.md` vừa được tạo mới nếu cần thiết.

## 6. Kế hoạch Kiểm chứng (Verification Plan)
Sau khi thực hiện, Gemini sẽ in ra báo cáo kiểm chứng (verification report) bao gồm các thông số:
1. **Tổng số thư tìm thấy** qua tìm kiếm phân tầng.
2. **Số thư đã đọc** thành công.
3. **Số nhóm template** được xác định.
4. **Số bản trùng bị loại** (dựa trên thuật toán so sánh nội dung đã chuẩn hóa).
5. **Kết quả quét PII**: Xác nhận không có dữ liệu nhạy cảm nào bị lọt vào file artifact hoặc log thông qua việc chạy lệnh grep quét số điện thoại, email thực tế.

---

## 7. Đánh giá của Kiểm toán viên (Auditor Review)
* *Chờ Codex phản hồi và duyệt lại kế hoạch đã chỉnh sửa này.*

---
**Bảo mật & Quy tắc song ngữ:**
* `sent items` (thư đã gửi)
* `email templates` (mẫu thư điện tử)
* `PII` (Personally Identifiable Information - thông tin định danh cá nhân)
* `placeholders` (biến giữ chỗ cấu trúc)
* `rate limits` (giới hạn tần suất gọi API)
* `stratified search` (tìm kiếm phân tầng)
* `content normalization` (chuẩn hóa nội dung)
