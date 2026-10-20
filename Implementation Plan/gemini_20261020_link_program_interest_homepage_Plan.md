# Kế hoạch Triển khai: Gắn link Cổng quan tâm Đa chương trình vào Landing Page

## 1. Mục tiêu & Bối cảnh
Người dùng đã đồng ý bổ sung đường dẫn tới Cổng đăng ký quan tâm đa chương trình ([`program-interest.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/program-interest.html)) lên trang chủ ([`index.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)) để học viên dễ dàng tìm thấy và đăng ký các khóa học khác ngoài DHM (như NVC, Culture101, AI, An toàn tâm lý).

## 2. Danh mục Tệp được phép chỉnh sửa (Allowlist)
* Duy nhất 1 tệp:
  * Windows Absolute Path: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html`
  * Liên kết IDE: [`index.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)

## 3. Chi tiết Thay đổi Dự kiến
1. **Vị trí 1: Khối thẻ công cụ tại Header (`.hero-tools-grid`)**
   * Hiện tại: Đang có 7 thẻ tiện ích (số lẻ).
   * Thay đổi: Thêm thẻ thứ 8 trỏ đến `program-interest.html`, giúp lưới 2 cột trở nên cân đối 4 hàng x 2 cột:
     ```html
     <a href="program-interest.html" class="tool-card-btn">
       <span>🌱 Đăng ký quan tâm các khóa học khác</span>
       <span class="tool-subtext">(NVC, Culture101, AI, An toàn tâm lý...)</span>
     </a>
     ```
2. **Vị trí 2: Khối kêu gọi hành động ở chân trang (`#register`)**
   * Hiện tại: Chỉ có 1 nút `✨ Đăng ký quan tâm và nhận thông tin về DHM10`.
   * Thay đổi: Thêm nút phụ kế bên với phong cách viền nhã nhặn (outline button):
     ```html
     <a href="program-interest.html" class="btn-primary"
       style="background: transparent; color: var(--dark); border: 2px solid var(--dark); box-shadow: none; font-weight: 700;">
       🌱 Quan tâm các khóa học khác (NVC, Culture101...)
     </a>
     ```

## 4. Kế hoạch Kiểm chứng (Verification Plan)
* Chạy kiểm tra cú pháp HTML (thẻ đóng/mở, thuộc tính hợp lệ).
* Kiểm tra `href` khớp chính xác với tệp `program-interest.html`.
* Thực hiện UTF-8 read-back để đảm bảo không bị lỗi mã hóa (mojibake).
* Đối chiếu hiển thị trên responsive grid.

## 5. Phương án Quay lui (Rollback Plan)
* Khôi phục ngay tệp gốc bằng lệnh:
  ```powershell
  git checkout -- index.html
  ```

## 6. Ranh giới Phê duyệt (Approval Boundary)
* **Cấp độ 2 (Level 2 Approval):** Áp dụng thay đổi vào tệp trong danh mục cho phép (`index.html`).
* **Cấp độ 3 (Level 3 Approval):** Thao tác commit, push hoặc deploy Vercel (chưa thực hiện trong lượt này; chỉ thực hiện khi có yêu cầu phát hành riêng).
