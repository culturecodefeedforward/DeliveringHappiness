# Kế Hoạch Triển Khai: Tích Hợp Cẩm Nang Lộ Trình Học Tập & Hướng Dẫn Sử Dụng Vào LMS

## 1. Mục Tiêu & Bối Cảnh
Soạn thảo và tích hợp tài liệu hướng dẫn học tập toàn diện cho chương trình **Delivering Happiness Masterclass (DHM)** nhằm:
1. Cung cấp bức tranh toàn cảnh về **Lộ trình 3 Mini-steps** (Online Gieo Thông Điệp ➔ Offline Gieo Thói Quen ➔ Online Focus on I•A•M).
2. Hướng dẫn chi tiết các bước thao tác trên LMS: Đăng nhập bằng Email + 4 số cuối SĐT, nghe podcast bài giảng, xem slide chính thức DHM, thực hiện bài kiểm tra sát hạch đầu vào (10 câu, đạt ≥ 70%), chọn La Bàn Giá Trị Cá Nhân (ME Values), viết đúc kết I•A•M, tra cứu tài liệu và lưu tiến độ.
3. Tích hợp trực tiếp vào hệ thống LMS để học viên có thể đọc trực tiếp bằng Document Reader hoặc tải về bất cứ lúc nào.

---

## 2. Các Thành Phần & Tệp Tin Triển Khai (Allowlist)

1. `data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md` (Tài liệu gốc phục vụ LMS tải và đọc trực tuyến)
2. `docs/huong_dan_va_lo_trinh_hoc_dhm.md` (Bản lưu trữ tài liệu chuẩn trong dự án)
3. `lms/curriculum_data.json` (Bổ sung tài liệu vào đầu danh sách `resources` của Stage 1 và Stage 3)
4. `lms/index.html` (Bổ sung nút `[📘 Lộ Trình & Hướng Dẫn]` tại thanh thao tác nhanh Quick Action Bar)
5. `lms/app.js` (Gắn sự kiện nhấp chuột mở Document Reader Modal hiển thị tài liệu ngay lập tức)
6. `Implementation Plan/learning_roadmap_and_user_guide_integration_plan.md` (Kế hoạch triển khai và hồ sơ nghiệm thu)

---

## 3. Kết Quả Kiểm Thử Cục Bộ (Local Verification)

- **Cú pháp JavaScript:** `node -c lms/app.js` ➔ Mã trả về `0` (PASS).
- **Kiểm tra dữ liệu JSON:** `python -c "import json..."` ➔ Đầy đủ 3 Stages, Stage 1 có 7 resources, Stage 3 có 6 resources; tệp cẩm nang nằm ở vị trí ưu tiên số 1 (PASS).
- **Kiểm tra tệp tài liệu:** Tồn tại trên đĩa tại `data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md` và `docs/huong_dan_va_lo_trinh_hoc_dhm.md` (PASS).
- **Kiểm tra sao lưu an toàn:** Đã tạo bản backup trước khi chỉnh sửa (`.bak_20260930_roadmap`).

---

## 4. Kế Hoạch Triển Khai & Quay Lui (Deployment & Rollback)

- **Đích triển khai (Target):** Repository `dh4hn-website` (nhánh `main`) ➔ Vercel CDN Production Auto-Deploy.
- **Phương án quay lui (Rollback):**
  * `git revert HEAD` để hủy commit trên Git.
  * Hoặc khôi phục trực tiếp từ các tệp backup:
    - `Copy-Item lms/curriculum_data.json.bak_20260930_roadmap lms/curriculum_data.json`
    - `Copy-Item lms/index.html.bak_20260930_roadmap lms/index.html`
    - `Copy-Item lms/app.js.bak_20260930_roadmap lms/app.js`
