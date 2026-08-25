# Kế hoạch Triển khai: Bổ sung Thông tin Thời gian & Hình thức vào Form Đăng ký NVC

## 1. Mục tiêu (Objective)
Cập nhật giao diện biểu mẫu đăng ký **Giao Tiếp Kết Nối (NVC)** tại `register_nvc.html` để bổ sung thông tin thời gian tổ chức và hình thức học ngay tại phần đầu form (`header`), giúp học viên nắm bắt thông tin rõ ràng trước khi điền form đăng ký.

- **Thời gian chương trình:** `20:00 - 22:00 - Thứ Sáu 04/09/2026`
- **Hình thức:** `Online Zoom Meeting`

---

## 2. Phạm vi thay đổi (Proposed Changes)

### 2.1. Frontend UI (`register_nvc.html`)

#### [MODIFY] [register_nvc.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_nvc.html)
- **Bổ sung CSS:** Thêm các class `.event-meta-box`, `.event-meta-item`, `.event-meta-label` đồng bộ với phong cách Glassmorphism và màu chủ đạo `--accent-soft` (`#fb7185`) của trang NVC. Hỗ trợ responsive hiển thị gọn gàng trên cả mobile và desktop.
- **Bổ sung HTML:** Chèn khối thông tin sự kiện vào bên trong thẻ `<div class="header">` ngay dưới phần `.subtitle`:
  ```html
  <div class="event-meta-box">
      <div class="event-meta-item">
          <span class="event-meta-label">⏰ Thời gian chương trình:</span> 20:00 - 22:00 - Thứ Sáu 04/09/2026
      </div>
      <div class="event-meta-item">
          <span class="event-meta-label">💻 Hình thức:</span> Online Zoom Meeting
      </div>
  </div>
  ```

---

## 3. Danh sách tệp tin cho phép sửa (Allowlist)
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_nvc.html`

> [!NOTE]
> Không thay đổi bất kỳ logic submit, xử lý dữ liệu webhook hay kịch bản JavaScript nào. Toàn bộ cơ chế ghi nhận Google Sheet và gửi mail thông báo được bảo toàn 100%.

---

## 4. Kế hoạch Kiểm chứng (Verification Plan)

### Kiểm tra Cục bộ (Local Verification)
1. Kiểm tra cú pháp HTML/CSS trên file `register_nvc.html`.
2. Kiểm tra hiển thị trực quan (Visual Inspection) trên trình duyệt cục bộ / chụp screenshot để đảm bảo:
   - Thông tin hiển thị rõ ràng, thẩm mỹ, chuẩn Glassmorphism.
   - Không bị tràn khung trên màn hình di động (responsive <= 640px).
   - Không làm ảnh hưởng đến luồng nhập liệu và submit của form.

---

## 5. Kế hoạch Quay lui (Rollback Plan)
Nếu có bất kỳ vấn đề phát sinh, khôi phục lại file gốc bằng Git:
```powershell
git checkout HEAD -- register_nvc.html
```

---

## 6. Ranh giới Phê duyệt (Approval Boundary)
- **Cấp độ 2 (Plan Approval):** Duyệt kế hoạch sửa file `register_nvc.html` trên môi trường local.
- Thao tác commit, push, deploy public (Cấp độ 3) chỉ thực hiện khi có phê duyệt riêng biệt sau khi kiểm chứng UAT local đạt yêu cầu.
