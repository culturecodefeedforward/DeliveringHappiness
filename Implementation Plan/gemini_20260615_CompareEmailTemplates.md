# Kế hoạch Triển khai (Implementation Plan) - Đối chiếu và So sánh Mẫu Email Lịch sử với DHM8

**Mã Task**: CompareEmailTemplates  
**Ngày tạo**: 15/06/2026  
**Người thực hiện**: Gemini (Antigravity)  
**Trạng thái**: Chờ phê duyệt (Pending Approval)  
**Đường dẫn kế hoạch**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260615_CompareEmailTemplates.md`

---

## 1. Đề bài (Requirements)
* Tiến hành `comparative analysis` (phân tích đối chiếu) chi tiết giữa 115 mẫu email lịch sử (trong `Artifacts/email_templates_synthesis.md`) và 3 mẫu email tự động hóa hiện tại của DHM8 (trong `Artifacts/dhm8_email_templates.md`).
* So sánh các khía cạnh: cấu trúc HTML/văn bản, tính nhất quán của văn phong (tone of voice), cơ chế liên kết Zalo Group Link, các lời kêu gọi hành động (Call-to-Action - CTA), và cách xử lý `PII` (Personally Identifiable Information - thông tin định danh cá nhân).
* Đề xuất các điểm cải tiến cụ thể cho hệ thống email của DHM8 để nâng cao trải nghiệm học viên (UX - User Experience) và hiệu quả chuyển đổi dựa trên dữ liệu lịch sử.
* Tạo tệp báo cáo so sánh `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\email_comparison_report.md` để ghi nhận các phát hiện.
* Sau khi được User chấp thuận, tiến hành `git commit` (lưu vết thay đổi) các tệp Artifacts và tài liệu kế hoạch vào repository để đồng bộ hóa mã nguồn.

## 2. Đối chiếu & Thiết lập Nguồn chuẩn (Source of Truth Alignment)
* **Nguồn chuẩn mẫu email hệ thống**: `Artifacts/dhm8_email_templates.md` là nguồn chuẩn duy nhất cho các email tự động hiện tại của DHM8.
* **Nguồn chuẩn mẫu email lịch sử**: `Artifacts/email_templates_synthesis.md` là kho lưu trữ các mẫu đã được lọc và ẩn danh hóa từ hộp thư `culturecodeproject@gmail.com`.
* **Sản phẩm đầu ra**: Báo cáo `Artifacts/email_comparison_report.md` sẽ mô tả chi tiết kết quả so sánh, các điểm cần kế thừa và đề xuất chỉnh sửa nếu có.

## 3. Giải pháp Thực hiện (Technical Solution)
1. **Phân tích so sánh cấu trúc:**
   * So sánh cấu trúc HTML tĩnh của các email cũ (thường là định dạng từ Gmail thô hoặc bảng biểu cũ) với cấu trúc HTML hiện đại có CSS nhúng (`inline CSS`) của DHM8.
   * Kiểm tra tính tương thích hiển thị trên thiết bị di động (mobile responsiveness).
2. **Đối chiếu nội dung và văn phong:**
   * Đánh giá xem văn phong lịch sự của CultureCode (trang trọng nhưng gần gũi, nhiều lời nhắc cá nhân hóa) đã được kế thừa trọn vẹn trong các email DHM8 tự động chưa.
   * Kiểm tra các yếu tố thiết yếu: Hướng dẫn giữ chỗ, thông tin chuyển khoản hậu cần (BIDV/MB), cú pháp chuyển khoản chính xác `DHM8 - {Phone} - {FullName}`.
3. **Kiểm tra các Liên kết & Lời kêu gọi hành động (CTA & Links):**
   * Đối chiếu link nhóm Zalo của các khóa học cũ (như `zalo.me/g/...` của CC101-HCM02) với các liên kết tương đương của DHM8.
   * Đảm bảo các link kêu gọi hành động nổi bật, rõ ràng.
4. **Bảo mật thông tin (PII Protection):**
   * Đảm bảo báo cáo so sánh tuyệt đối không chứa thông tin `PII` thực tế của học viên, chỉ dùng các biến giữ chỗ (placeholders) như `{{FullName}}`, `{{Phone}}`, v.v.
5. **Đồng bộ hóa Git:**
   * Sau khi hoàn tất và được User phê duyệt, thực hiện:
     ```powershell
     git add Artifacts/email_templates_synthesis.md
     git add Artifacts/dhm8_email_templates.md
     git add Artifacts/email_comparison_report.md
     git add "Implementation Plan/gemini_20260614_SynthesizeEmailTemplates.md"
     git add "Implementation Plan/gemini_20260615_CompareEmailTemplates.md"
     git commit -m "docs(email): synthesize historical templates and compare with dhm8 configurations"
     ```

## 4. Các file bị ảnh hưởng (Affected Files)
* **Tạo mới**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\email_comparison_report.md`
* **Không sửa đổi** các tệp logic hay hạ tầng vận hành.

## 5. Rào cản An toàn & Ranh giới Phê duyệt (Approval Boundary)
* **Ranh giới Phê duyệt (Approval Boundary):** Task này chỉ giới hạn ở việc **đối chiếu tài liệu, tạo báo cáo so sánh và thực hiện git commit cục bộ (local git commit)**.
* **Cấm tuyệt đối**:
  * Không chạy bất kỳ tiến trình gửi mail thực tế nào.
  * Không thay đổi file code logic (chỉ làm việc trên thư mục `Artifacts/` và `Implementation Plan/`).
  * Không tự động `git push` lên remote repository hoặc deploy lên Vercel khi chưa có chỉ thị rõ ràng của User.

## 6. Kế hoạch Kiểm chứng (Verification Plan)
Sau khi thực hiện, Gemini sẽ chạy các lệnh kiểm tra:
1. `git status` để xác nhận các file đã được add và commit đúng scope.
2. Kiểm tra tính toàn vẹn của file `Artifacts/email_comparison_report.md` để đảm bảo không bị lỗi cú pháp Markdown và không chứa bất kỳ rò rỉ PII nào.

---

## 7. Đánh giá của Kiểm toán viên (Auditor Review)
* *Dành cho Codex rà soát và đưa ra ý kiến phản biện.*

---
**Thuật ngữ song ngữ sử dụng:**
* `comparative analysis` (phân tích đối chiếu)
* `inline CSS` (mã phong cách nhúng)
* `PII` (Personally Identifiable Information - thông tin định danh cá nhân)
* `git commit` (lưu vết thay đổi cục bộ)
* `mobile responsiveness` (khả năng tương thích trên thiết bị di động)
