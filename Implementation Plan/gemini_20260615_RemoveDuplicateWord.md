# Kế hoạch triển khai kỹ thuật - Loại bỏ lặp từ trong Email Template DHM8
**File Location**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260615_RemoveDuplicateWord.md`

## 1. Đề bài & Hiện trạng (Pain Point & Context)
- **Pain Point (Vấn đề)**: Trong mẫu email xác nhận đăng ký trạng thái Pending (Chưa thanh toán) của khóa học DHM8, câu thông báo tự động bị lặp từ "xác nhận" hai lần: `...sẽ xác nhận giao dịch và gửi email xác nhận giữ chỗ...`
- **Root Cause (Nguyên nhân)**: Sự kết hợp của việc thay đổi cụm từ "gạch nợ tự động" trước đó chưa tối ưu hết các câu chữ xung quanh dẫn đến lặp từ trong câu diễn đạt.
- **Mục tiêu**: Thay đổi cụm từ lặp để tăng sự mạch lạc, chuyên nghiệp của email mà vẫn đảm bảo tính chính xác về mặt thông tin.

## 2. Giải pháp kỹ thuật (Technical Solution)
- Thay đổi câu tại dòng 62 trong file `Artifacts/dhm8_email_templates.md` (Mẫu 1: Email Pending):
  - *Cũ*: `*Sau khi bạn chuyển khoản thành công, hệ thống tự động xác nhận của BTC sẽ kiểm tra giao dịch và tự động gửi email xác nhận giữ chỗ chính thức tới hòm thư này.*` (Lặp từ "xác nhận" 2 lần, lặp từ "tự động" 2 lần).
  - *Đề xuất mới*: `*Sau khi bạn chuyển khoản thành công, hệ thống tự động của BTC sẽ ghi nhận giao dịch và gửi email xác nhận giữ chỗ chính thức tới hòm thư này.*`
  - *Lý do*: Từ "xác nhận" thứ nhất được thay thế bằng "ghi nhận", đồng thời loại bỏ từ "tự động" thứ hai để câu văn ngắn gọn, súc tích hơn.

- Rà soát các file khác (`UAT/preview_email_dhm8_paid.html`):
  - Dòng 29: `Chúc mừng bạn! Hệ thống tự động xác nhận của Delivering Happiness đã ghi nhận giao dịch thanh toán chi phí hậu cần thành công cho hồ sơ của bạn.` -> Câu này đã dùng "ghi nhận" và "xác nhận" xen kẽ, không có hiện tượng lặp từ "xác nhận" hai lần. Tuy nhiên, có từ "xác nhận" ở cụm "Hệ thống tự động xác nhận". Chúng ta sẽ giữ nguyên vì nó thể hiện đúng tên hệ thống tự động xác nhận của BTC.

## 3. Các file ảnh hưởng (Scope of Changes)
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm8_email_templates.md`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\uat_report_20260615_RefineEmailTone.md` (nếu cần cập nhật báo cáo UAT cũ hoặc tạo báo cáo mới)

## 4. Rủi ro & Kế hoạch quay lui (Risks & Rollback Plan)
- **Rủi ro**: Không có rủi ro kỹ thuật nào vì đây chỉ là thay đổi văn bản tĩnh (static text) trong file markdown template.
- **Rollback**: Dùng `git checkout` để khôi phục lại trạng thái cũ của file.

## 5. Kế hoạch kiểm chứng (Verification Plan)
- Chạy lệnh `grep` để quét lại toàn bộ workspace nhằm đảm bảo không còn cụm từ bị lặp.
- Thực hiện xem trước bằng công cụ visual/browser (nếu cần) hoặc kiểm tra trực tiếp định dạng.

## 6. Auditor Review (Đánh giá kiểm toán)
- **APPROVED**: Được duyệt bởi User `OK` vào lúc 2026-06-15T22:13:14+07:00.
- **STATUS**: Đã thực hiện chỉnh sửa xong mẫu email `Artifacts/dhm8_email_templates.md` và cập nhật báo cáo UAT `UAT/uat_report_20260615_RefineEmailTone.md`.
