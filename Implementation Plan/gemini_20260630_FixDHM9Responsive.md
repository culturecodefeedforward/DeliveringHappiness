# Kế hoạch khắc phục lỗi Responsive trên di động của Form Đăng ký DHM9

## Đề bài & Hiện trạng (Pain Points & Issues)
- **Vấn đề:** Giao diện Form đăng ký DHM9 (`register_dh9_hanoi.html`) bị hiển thị lỗi trên điện thoại di động (không responsive). Form-card giữ nguyên padding lớn (3rem) và các nhóm trường (`form-grid`, `collapsible-section`, `additional-info-section`) không tự động chuyển về 1 cột trên màn hình nhỏ. Các input bị co ép nghiêm trọng gây tràn viền và khó thao tác.
- **Nguyên nhân:** Do quá trình clone form từ DHM8 sang DHM9 thiếu các khai báo trong media query `@media (max-width: 640px)` của `register_dh9_hanoi.html`, dẫn đến sự lệch pha giao diện so với `register.html` chuẩn.

## Giải pháp Kỹ thuật (Technical Solution)
- Cập nhật phần style `@media (max-width: 640px)` trong `register_dh9_hanoi.html` để đồng nhất với `register.html`:
  - Thêm config padding và border-radius cho `.form-card` trên mobile (`padding: 1.25rem !important; border-radius: 16px !important;`).
  - Ép các Grid layout `.form-grid`, `.additional-info-section`, và `.collapsible-section` về dạng 1 cột (`grid-template-columns: 1fr !important; gap: 1rem !important;`).
  - Thêm khoảng đệm cho `body` trên mobile (`padding: 10px 5px !important;`).

## Các file ảnh hưởng (Files Affected)
- `c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html`

## Rủi ro tiềm ẩn (Risks & Mitigations)
- **Rủi ro:** Sai lệch hiển thị trên một số kích thước màn hình đặc thù hoặc ảnh hưởng đến các layout khác.
- **Giải pháp:** Sử dụng chính xác cấu trúc CSS đã được xác thực (verified) là chạy ổn định trên form DHM8 (`register.html`), giảm thiểu tối đa rủi ro lệch cấu trúc.

---

## Proposed Changes (Các thay đổi đề xuất)

### Frontend Registration Form

#### [MODIFY] [register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html)
Đồng bộ hóa media query responsive cho các khối lưới và thẻ wrapper:

Cũ:
```css
        @media (max-width: 640px) {
            .form-grid {
                grid-template-columns: 1fr;
            }

            .input-group.full-width {
                grid-column: span 1;
            }

            .radio-group {
                grid-template-columns: 1fr !important;
            }

            .radio-item.full-width {
                grid-column: span 1 !important;
            }
        }
        .collapsible-section {
            ...
        }
        ...
        @media (max-width: 640px) {
            .collapsible-section {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
        }
```

Mới:
```css
        @media (max-width: 640px) {
            .form-card {
                padding: 1.25rem !important;
                border-radius: 16px !important;
            }

            .form-grid,
            .additional-info-section,
            .collapsible-section {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }

            .input-group.full-width {
                grid-column: span 1;
            }

            .radio-group {
                grid-template-columns: 1fr !important;
            }

            .radio-item.full-width {
                grid-column: span 1 !important;
            }
            body {
                padding: 10px 5px !important;
            }
        }
```

---

## Verification Plan (Kế hoạch Kiểm thử)

### Manual Verification
- Do thay đổi liên quan đến giao diện (UI) quy mô nhỏ, ta sẽ tiến hành kiểm chứng sau khi cập nhật bằng cách so sánh trực quan và chụp ảnh kiểm thử trên trình duyệt (nếu cần thiết hoặc theo lệnh UAT của sếp).
