# Kế hoạch triển khai: Chuẩn hóa email hệ thống theo Layout mới

Kế hoạch này chi tiết hóa việc chuẩn hóa toàn bộ các mẫu email gửi đi của chương trình Delivering Happiness sử dụng layout cao cấp mới (nền đen-trắng sang trọng, cấu trúc tối giản và hiện đại) dựa theo hình ảnh sếp cung cấp.

## Khảo sát Layout mới (Scout & Design Audit)

Dựa trên hình ảnh sếp cung cấp, layout mới có các đặc điểm thiết kế sau:
1.  **Nền chung (Background)**: Màu cát nhạt/xám cát ấm `#eae6df`.
2.  **Khung chứa (Container)**: Màu trắng `#ffffff`, bo góc nhẹ, đổ bóng tinh tế.
3.  **Header (Đầu thư)**: Nền đen sẫm `#1a1a1a`, chứa:
    *   Logo CultureCode ở giữa (nền đen): `https://delivering-happiness.vercel.app/culturecode_live_club_logo.jpg`
    *   Tiêu đề lớn màu trắng: `Delivering Happiness Masterclass`
    *   Mô tả nhỏ màu xám nhạt: `Một ngày học sâu về văn hóa hạnh phúc, động lực đội ngũ và cách tổ chức vận hành từ bên trong.`
4.  **Body (Thân thư)**: Nền trắng, font chữ sans-serif hiện đại (Segoe UI/Arial). Dòng chào màu xanh navy sẫm.
5.  **Footer (Chân thư)**: Nền xám nhạt, logo CultureCode nhỏ ở góc phải.

## Phạm vi thay đổi (Scope of Work)

Chúng ta sẽ tạo các file mẫu email HTML chuẩn hóa tại thư mục `Artifacts/standardized_emails/` để làm nguồn chuẩn (Source of Truth) cho dự án, bao gồm:
1.  [NEW] `Artifacts/standardized_emails/dhm9_reschedule_email.html`: Mẫu email dời lịch DHM9 Hà Nội.
2.  [NEW] `Artifacts/standardized_emails/dhm8_pending_email.html`: Mẫu xác nhận đăng ký (Chưa thanh toán) của DHM8/DHM9.
3.  [NEW] `Artifacts/standardized_emails/dhm8_paid_email.html`: Mẫu xác nhận thanh toán thành công (Giữ chỗ) của DHM8/DHM9.
4.  [MODIFY] `Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md`: Cập nhật nội dung HTML đã chuẩn hóa theo layout mới.

> [!IMPORTANT]
> **Ranh giới an toàn (Safety Boundary)**:
> Theo quy định nghiêm ngặt của sếp: **Không sửa đổi mã nguồn Apps Script (`active_code_gs_final.js`)** để tránh ảnh hưởng đến hệ thống gửi tự động đang chạy. Các email chuẩn hóa này sẽ được lưu ở dạng file tĩnh HTML trong dự án để sếp nghiệm thu trực quan và phục vụ việc tích hợp/cập nhật thủ công sau này khi có phê duyệt riêng.

## Kế hoạch kiểm thử (Verification Plan)

1.  **Kiểm tra trực quan (Visual UAT)**: Chạy lại script `scratch/send_test_email.py` để gửi email dời lịch DHM9 Hà Nội theo layout mới tới `vuhoang2708@gmail.com`.
2.  **Verify trên các hòm thư**: Sếp duyệt hiển thị trực quan của layout mới trên cả máy tính (Desktop) và điện thoại (Mobile).
