# Kế Hoạch Triển Khai: Tiếp Thu Phản Hồi Cô Châu (Audio, Slide Chính Thức & Trải Nghiệm Bài Test LMS)

## 1. Bối Cảnh & Mục Tiêu

Nhận phản hồi trực tiếp từ Cô Châu (Đồng sáng lập & Giảng viên dẫn dắt chương trình DHM - Delivering Happiness Masterclass):
1. **Audio Intro:** *"Phần audio intro rất cuốn: Keep"* ➔ Giữ nguyên toàn bộ kho âm thanh bài giảng AI (`data/artifacts/*.mp3`) và trình phát âm thanh tích hợp trong LMS.
2. **Infographics:** *"Infographic: chị prefer dùng bản chụp từ slide của DHM - Change"* ➔ Thay thế toàn bộ đồ họa tạo bằng AI bằng 44 bản chụp slide bài giảng chính thức được trích xuất từ tệp bài giảng gốc `G:\My Drive\download\DHM_online session_V1 2.pptx`.
3. **Bài Test Sát Hạch:** *"Test: chị không biết mở ở chỗ nào"* ➔ Tái cấu trúc và tối ưu triệt để tính trực quan (discoverability / visibility) của bài kiểm tra sát hạch 10 câu đầu vào để học viên và giảng viên dễ dàng tiếp cận ngay khi mở trang.

---

## 2. Giải Pháp Chi Tiết & Các Thay Đổi Kỹ Thuật

### A. Xuất 44 Slide Bài Giảng Chính Thức (Presentation Snapshots)
- Trích xuất tự động toàn bộ 44 trang slide từ tệp gốc PowerPoint sang định dạng hình ảnh PNG độ phân giải cao (1920x1080) bằng PowerPoint COM Automation.
- Tối ưu dung lượng hình ảnh từ 22.97 MB xuống 16.01 MB (giảm ~30% dung lượng giúp tải trang mượt mà) bằng Pillow.
- Lưu trữ tại: `dh4hn-website/data/artifacts/slides/slide_01.png` đến `slide_44.png`.
- Cấu hình `.gitignore`: bổ sung quy tắc ngoại lệ `!data/artifacts/slides/*.png` để hệ thống Git theo dõi và triển khai các slide lên Vercel CDN.

### B. Giải Quyết Triệt Để Trải Nghiệm Bài Test (Quiz Discoverability)
1. **Hero Quiz Gate Banner (`tab-summary`):**
   - Đặt một khung thông báo nổi bật màu hổ phách ngay đầu tab mặc định khi học viên truy cập LMS.
   - Thể hiện rõ tiêu chí sát hạch: Yêu cầu đạt tối thiểu **7/10 câu đúng (≥ 70%)** sau tối đa 3 lần làm bài để đủ điều kiện lên lớp Offline.
   - Nút kêu gọi hành động lớn: `[✍️ Bấm Vào Đây Để Mở Bài Test ➔]` (`#btn-hero-goto-quiz`).
2. **Quick Action Bar (Thanh lối tắt thao tác nhanh):**
   - Bổ sung thanh thao tác nhanh ngay phía trên các Tabs điều hướng với nút `[⚡ Mở Bài Test Sát Hạch (10 Câu) ➔]` (`#btn-quick-quiz`).
3. **Đổi Tên Tab Điều Hướng (Tab Navigation):**
   - Đổi tên Tab 2 từ `🎯 Thực Hành & Phản Tư (I • A • M)` thành `⚡ BÀI TEST SÁT HẠCH (10 CÂU) & THỰC HÀNH` kèm nhãn hiệu ứng nhấp nháy `LÀM NGAY`.
4. **Đổi Tên Mục Lục Bài Giảng (Curriculum Sidebar):**
   - Đổi tên mục `sub-1-2` thành: `"Mục 1.2: ⚡ BÀI TEST SÁT HẠCH ĐẦU VÀO (10 Câu) & Khoa Học Hạnh Phúc"`.
5. **Logic Điều Hướng Mượt Mà (`lms/app.js`):**
   - Xây dựng hàm `jumpToStage1Quiz()`: Tự động kích hoạt chuyển sang Tab Thực hành, cuộn màn hình mượt mà (`smooth scroll`) đến khung bài test, và bật hiệu ứng viền vàng phát sáng (`ring-4 ring-brand-amber`) trong 3.5 giây để định vị chính xác vị trí bài test cho học viên.

### C. Đồng Bộ Dữ Liệu & Giao Diện Xem Slide (Modal & Gallery)
1. **Cập nhật `lms/curriculum_data.json`:**
   - Thay thế toàn bộ liên kết đồ họa cũ bằng bản chụp slide chuẩn:
     * `slide_16.png`: 3 Cấp Độ Hạnh Phúc (Martin Seligman)
     * `slide_17.png`: Ẩn Dụ Ba Tầng Lầu (Phong Tử Khải)
     * `slide_22.png`: La Bàn Giá Trị Cá Nhân (ME Values)
     * `slide_25.png`: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc
     * `slide_14.png`: Kim Tự Tháp Mục Tiêu & Hạnh Phúc
     * `slide_28.png`, `slide_30.png`, `slide_35.png`: 3 Đòn Bẩy Kết Nối, Tự Chủ, Tiến Bộ.
2. **Cập nhật `lms/app.js`:**
   - Cập nhật các nút xem chi tiết trong từng bài học và module 5 Thói quen sang bản chụp slide.
   - Tái cấu trúc Bộ sưu tập 12 Slide chính thức DHM (`galleryList`) trích từ các slide cốt lõi của khóa học.
   - Đổi tiêu đề Modal hiển thị từ "Đồ Họa Thông Tin" thành "📷 Bản Chụp Slide Bài Giảng DHM".

---

## 3. Danh Mục Tệp Thay Đổi (Allowlist)

1. `data/artifacts/slides/*.png` (44 tệp ảnh slide chính thức trích từ bài giảng DHM)
2. `.gitignore` (Cấu hình cho phép Git track thư mục slide)
3. `lms/curriculum_data.json` (Cập nhật tên mục 1.2 và đường dẫn slide chính thức)
4. `lms/index.html` (Thêm Banner sát hạch, thanh Shortcut, đổi nhãn Tab 2 và modal title)
5. `lms/app.js` (Cập nhật hàm jumpToStage1Quiz, gắn sự kiện nút và liên kết slide)
6. `Implementation Plan/feedback_chau_slides_and_test_ux_plan.md` (Kế hoạch và hồ sơ nghiệm thu)

---

## 4. Kết Quả Kiểm Thử Cục Bộ (Local Verification)

- **Kiểm tra cú pháp JavaScript:** `node -c lms/app.js` ➔ Mã trả về `0` (Cú pháp chuẩn xác 100%).
- **Kiểm tra toàn vẹn JSON:** `lms/curriculum_data.json` ➔ Cấu trúc JSON hợp lệ, đầy đủ 3 Stages và 10 câu hỏi trắc nghiệm sát hạch.
- **Kiểm tra tệp hình ảnh slide:** Đủ 44 slide PNG trong `data/artifacts/slides/`.
- **Kiểm tra an toàn sao lưu:** Đã lưu bản sao dự phòng `lms/app.js.bak_20260930_feedback_chau`.

---

## 5. Kế Hoạch Triển Khai & Quay Lui (Deployment & Rollback)

- **Đích triển khai (Target):** Repository `dh4hn-website` (nhánh `main`) ➔ Vercel CDN Production Auto-Deploy.
- **Phạm vi tác động (Scope):** Chỉ nằm trong thư mục `lms/`, `data/artifacts/slides/`, `.gitignore` và tệp kế hoạch triển khai.
- **Phương án quay lui (Rollback):**
  * `git revert HEAD` để hủy commit mới nhất trên Git.
  * Khôi phục trực tiếp mã nguồn bằng bản backup: `Copy-Item lms/app.js.bak_20260930_feedback_chau lms/app.js`.
