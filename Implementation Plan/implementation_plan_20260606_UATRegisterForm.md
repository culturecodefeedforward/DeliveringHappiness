# Kế hoạch Kiểm thử UAT Form Đăng ký DH Masterclass

## 1. Đề bài & Mục tiêu
Kiểm thử nghiệm thu người dùng (UAT - User Acceptance Testing) nhanh form đăng ký DH Masterclass nhằm xác nhận form đã chạy được bình thường và dữ liệu đẩy về CRM Google Sheets chính xác.

- **Link Form Đăng ký:** [delivering-happiness.vercel.app/register.html](https://delivering-happiness.vercel.app/register.html)
- **Link Google Sheets CRM:** [DH4HN CRM Leads - Landing Page](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit)

## 2. Hiện trạng (Context)
- Form đăng ký đã được cập nhật thêm câu hỏi: “Bạn có nguyện vọng tham gia thêm khóa nào khác ngoài DH?” và 2 checkbox:
  - “NVC - giao tiếp phi bạo lực”
  - “AI thực chiến”
- Cần chạy UAT để kiểm tra tính toàn vẹn của luồng dữ liệu từ giao diện Frontend đến hệ thống CRM Google Sheets qua Google Apps Script Webhook.

## 3. Giải pháp Kỹ thuật & Kịch bản Kiểm thử
Việc kiểm thử sẽ được thực hiện tự động bằng công cụ trình duyệt (Browser Subagent) theo các bước:

1. **Kiểm tra giao diện (UI Verification):**
   - Mở URL: `https://delivering-happiness.vercel.app/register.html`
   - Xác nhận trang tải thành công (không lỗi trắng trang, CSS hiển thị đúng).
   - Kiểm tra xem có xuất hiện câu hỏi mới và đủ 2 checkbox ứng với NVC và AI thực chiến hay không.
2. **Nhập dữ liệu kiểm thử (Form Submission):**
   - Điền thông tin:
     - Họ tên: `Gemini UAT Test`
     - Phone: `0900000000`
     - Email: `gemini.uat.test@example.com`
     - Tick cả 2 checkbox: “NVC - giao tiếp phi bạo lực” và “AI thực chiến”.
   - Nhấn submit form.
   - Chụp ảnh màn hình (screenshot) hoặc quay video lúc xuất hiện màn hình/thông báo đăng ký thành công làm bằng chứng (evidence).
3. **Xác minh Google Sheet (CRM Data Verification):**
   - Truy cập URL Google Sheets: `https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit`
   - Tìm dòng cuối cùng (dòng mới nhất vừa submit).
   - Xác nhận dữ liệu tại các cột:
     - `additionalCourses` = `NVC - giao tiếp phi bạo lực, AI thực chiến`
     - `wantsNvcCourse` = `Yes`
     - `wantsAiCourse` = `Yes`
4. **Báo cáo kết quả:**
   - Trả kết quả theo format yêu cầu của User:
     ```text
     PASS/FAIL
     Link đã test
     Screenshot hoặc bằng chứng submit
     Dòng/cột trong Sheet đã thấy
     Vấn đề còn lại nếu có
     ```

## 4. Các file bị ảnh hưởng
- **Không có file nào bị thay đổi.** Đảm bảo tuân thủ nguyên tắc:
  - Không sửa code.
  - Không commit, push, deploy.

## 5. Rủi ro tiềm ẩn & Lưu ý
- **Rủi ro phân quyền Google Sheets:** Nếu link Google Sheets yêu cầu đăng nhập tài khoản Google có quyền truy cập và trình duyệt tự động của subagent chưa đăng nhập, subagent có thể không đọc được dữ liệu trực tiếp từ Google Sheets.
  - *Phương án xử lý:* Nếu gặp lỗi phân quyền, Agent sẽ báo cáo rõ và nhờ User hỗ trợ mở quyền xem (View-only) cho link hoặc tự tay kiểm tra Sheet để xác nhận, đồng thời nhấn mạnh đây là vấn đề phân quyền chứ không phải lỗi form.
- **Lỗi Apps Script Webhook:** Dữ liệu có thể gửi thành công từ trình duyệt nhưng Google Apps Script bị lỗi ánh xạ cột (Sheet mapping). Nếu Google Sheet không ghi nhận 3 cột mới, Agent sẽ báo rõ lỗi ở Apps Script hoặc Sheet mapping chứ không kết luận form web hỏng.

---

## Auditor Review
- Kế hoạch được đề xuất bởi **Antigravity**. Kính mời **Codex** rà soát và đánh giá tính an toàn.
