## Đề bài
Sửa lại file `index.html` và `register.html` để mở lại đăng ký cho khóa học DHM8 diễn ra vào ngày Thứ Bảy 04/07/2026. Các thông tin về địa điểm và chi tiết khác giữ nguyên như khóa DHM7 diễn ra vào tháng 4. Sau khi hoàn thành, push lên GitHub, tạo link Vercel mới và hibernate máy.

## Hiện trạng
- File `index.html` hiện tại đang ở chế độ "Quan tâm đến chương trình" và đã ẩn khối thông tin sự kiện (thời gian, địa điểm) của khóa trước.
- File `register.html` vẫn còn form nhưng chưa hiển thị rõ thông tin cụ thể của khóa DHM8 (ngày tháng, địa điểm).

## Giải pháp kỹ thuật
1. **Sửa đổi `index.html`**:
   - Khôi phục khối `hero-event-info` ở phần `<header class="hero">` (lấy từ bản backup `index_BAK_020426.html`).
   - Cập nhật thời gian thành: `📅 07:30 - 17:30, Thứ Bảy 04/07/2026`.
   - Giữ nguyên thông tin địa điểm: `📍 Trung tâm đào tạo Circle K, Lầu 3 - Số 27 Nguyễn Gia Trí, Bình Thạnh, TP. Hồ Chí Minh.`
   - Đổi nút "Quan tâm đến chương trình" thành "Đăng ký ngay" (giữ nguyên link trỏ tới `register.html`).
   - Cập nhật tương tự phần văn bản ở section CTA (Register) phía dưới trang.
2. **Sửa đổi `register.html`**:
   - Cập nhật thẻ `<h1>` thành `Đăng ký DH Masterclass (DHM8)`.
   - Cập nhật `<p class="subtitle">` để hiển thị thêm thời gian và địa điểm: `Thứ Bảy, 04/07/2026 | Trung tâm đào tạo Circle K`.
3. **Triển khai (Deployment)**:
   - Dùng Git để commit (`git add`, `git commit`) và push (`git push`) thay đổi lên GitHub.
   - Vercel sẽ tự động build từ GitHub, sau đó kiểm tra tiến trình để lấy URL live gửi cho User.
4. **Hành động sau cùng**:
   - Sử dụng tool command line để chạy lệnh hibernate Windows (`shutdown /h`).

## Các file bị ảnh hưởng
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.html`

## Rủi ro và Lưu ý
- **Rủi ro:** Việc hibernate sẽ làm ngắt kết nối phiên làm việc hiện tại của agent và user, cần đảm bảo mọi tác vụ (commit, push, build Vercel) đã thành công hoàn toàn trước khi gọi lệnh.
- **Lưu ý:** Áp dụng Rule 1.2 (Hard-Gate Approval) — Chờ User xác nhận `Approve` hoặc đồng ý trước khi tiến hành viết code.

## Auditor Review
- Sẵn sàng để được Codex/Claude rà soát.
