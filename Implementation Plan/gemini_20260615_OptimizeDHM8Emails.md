# Kế hoạch Triển khai (Implementation Plan) - Tối ưu hóa Mẫu Email Hệ thống DHM8

**Mã Task**: OptimizeDHM8Emails  
**Ngày tạo**: 15/06/2026  
**Người thực hiện**: Gemini (Antigravity)  
**Trạng thái**: Chờ phê duyệt (Pending Approval)  
**Đường dẫn kế hoạch**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260615_OptimizeDHM8Emails.md`

---

## 1. Đề bài (Requirements)
Dựa trên kết quả `comparative analysis` (phân tích đối chiếu) tại `Artifacts/email_comparison_report.md`, tiến hành tối ưu hóa mẫu email tự động hóa của **Delivering Happiness Masterclass 8 (DHM8)** để nâng cao trải nghiệm học viên (`UX` - User Experience) và cải thiện tính kết nối.

Cụ thể:
*   **Mẫu 2 (Email Xác nhận Đã Thanh toán - Paid)**:
    *   Tích hợp box thông tin tham gia nhóm Zalo lớp học kèm nút kêu gọi hành động (`CTA` - Call-to-Action) nổi bật.
    *   Bổ sung hướng dẫn hậu cần thực tế (thời gian check-in trước 15 phút).
    *   Tích hợp thông điệp cam kết bảo vệ môi trường (mang bình nước cá nhân) và chính sách hoàn phí/chuyển nhượng mang đậm nét văn hóa của CultureCode.
*   Cập nhật tệp `Artifacts/dhm8_email_templates.md` để đồng bộ hóa thiết kế mới.

## 2. Đối chiếu & Thiết lập Nguồn chuẩn (Source of Truth Alignment)
*   **Nguồn chuẩn mẫu email hệ thống**: `Artifacts/dhm8_email_templates.md`. Tệp này sẽ được chỉnh sửa trực tiếp phần Mẫu 2 để lưu trữ mã nguồn HTML tối ưu.
*   **Tham chiếu đề xuất**: Phần đề xuất cải tiến tại mục 4 trong báo cáo đối chiếu `Artifacts/email_comparison_report.md`.

## 3. Giải pháp Kỹ thuật (Technical Solution)

### 3.1. Cập nhật HTML Mẫu 2 trong `Artifacts/dhm8_email_templates.md`
Chèn thêm hai khối nội dung mới vào trước phần lời chào kết thúc (`Cảm ơn bạn đã đồng hành...`):

1.  **Khối Zalo Group Link (Sử dụng đường link Zalo lớp học chính thức)**:
    Do link nhóm Zalo lớp học của DHM8 là cố định cho khoá học này (`https://zalo.me/g/idmxekeesuabqk2qxzld` - theo tham chiếu từ email CC101 cũ hoặc link mới do ban tổ chức cung cấp), ta sẽ nhúng trực tiếp link Zalo này dưới dạng một button HTML phong cách hiện đại.
    ```html
    <!-- Zalo Group Connection Card -->
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 20px 0; border-radius: 6px;">
      <h4 style="margin: 0 0 8px 0; color: #1e3a8a; font-size: 15px; font-weight: 600;">📱 Tham gia Nhóm Zalo Lớp học:</h4>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e293b;">Để dễ dàng kết nối với Ban tổ chức, giảng viên và nhận các thông báo quan trọng nhất trong suốt khóa học, bạn vui lòng tham gia nhóm Zalo hỗ trợ tại đây:</p>
      <a href="https://zalo.me/g/idmxekeesuabqk2qxzld" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">Tham gia Nhóm Zalo DHM8</a>
    </div>
    ```

2.  **Khối Hướng dẫn Hậu cần & Cam kết Xanh**:
    ```html
    <!-- Logistics & Culture Notes -->
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px 20px; margin: 15px 0;">
      <h4 style="margin-top: 0; color: #374151; font-size: 15px; font-weight: 600;">🌱 Một số lưu ý từ BTC:</h4>
      <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
        <li style="margin-bottom: 8px;"><strong>Thời gian có mặt</strong>: Lớp học sẽ bắt đầu đúng giờ. Bạn vui lòng có mặt trước 15 phút để hoàn tất check-in và nhận tài liệu in ấn.</li>
        <li style="margin-bottom: 8px;"><strong>Cam kết xanh</strong>: BTC khuyến khích bạn mang theo <strong>bình nước cá nhân</strong> để cùng hạn chế rác thải nhựa, bảo vệ môi trường.</li>
        <li style="margin-bottom: 0;"><strong>Chính sách hoàn phí</strong>: Chi phí hậu cần đã được sử dụng để chuẩn bị teabreak, ăn trưa và in ấn tài liệu nên BTC không hỗ trợ hoàn phí. Bạn có thể chuyển nhượng suất học cho người khác và báo lại cho BTC tối thiểu 3 ngày trước sự kiện. Chi phí còn dư (nếu có) sẽ được quyên góp vào Quỹ Nhân ái của Báo Dân trí.</li>
      </ul>
    </div>
    ```

## 4. Các file bị ảnh hưởng (Affected Files)
*   **Chỉnh sửa**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm8_email_templates.md`
*   **Tạo mới**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260615_OptimizeDHM8Emails.md`

## 5. Rào cản An toàn & Ranh giới Phê duyệt (Approval Boundary)
*   **Ranh giới Phê duyệt (Approval Boundary)**: Task này chỉ thực hiện cập nhật file template HTML lưu trữ dạng Markdown (`dhm8_email_templates.md`) cục bộ.
*   **Cấm tuyệt đối**:
    *   Không tự ý sửa đổi code logic của webhook chạy thật.
    *   Không tự ý gửi mail thử nghiệm từ hòm thư của dự án.
    *   Không tự ý `git commit`, `git push` hay `deploy` nếu chưa có sự phê duyệt độc lập sau khi hoàn thành sửa đổi.

## 6. Kế hoạch Kiểm chứng (Verification Plan)
Sau khi cập nhật file template:
1.  Sử dụng trình duyệt hoặc công cụ xem trước để kiểm tra tính toàn vẹn của mã HTML mới được nhúng vào template.
2.  Chạy lệnh kiểm tra cú pháp Markdown để đảm bảo tệp tin không bị lỗi hiển thị.

---

## 7. Đánh giá của Kiểm toán viên (Auditor Review)
*   *Dành cho Codex rà soát và đưa ra ý kiến phản biện.*

---
**Thuật ngữ song ngữ sử dụng:**
*   `comparative analysis` (phân tích đối chiếu)
*   `UX` (User Experience - trải nghiệm người dùng)
*   `CTA` (Call-to-Action - nút kêu gọi hành động)
*   `inline CSS` (mã phong cách nhúng)
