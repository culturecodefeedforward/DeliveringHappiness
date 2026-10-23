# Kế Hoạch Triển Khai: Tinh Chỉnh Nội Dung, Định Nghĩa Đam Mê & Chuẩn Hóa Slide Bài Giảng DHM

- **Ngày tạo:** 03/10/2026
- **Trạng thái:** Đang thực thi theo lệnh `/goal`
- **Mục tiêu:**
  1. Loại bỏ badge và các thông tin đề cập "Thầy Vũ Hoàng & Ban Giảng Huấn" trên giao diện LMS.
  2. Xóa bỏ triệt để từ ngữ nội bộ "Bản chụp slide", thay thế bằng "Slide Bài Giảng: [Tên]" hoặc "Slide Bài Giảng DHM".
  3. Chuẩn hóa định nghĩa Passion (Đam mê) theo Martin Seligman: Hạnh phúc từ sự dấn thân, gắn kết sâu sắc và phát huy thế mạnh cá nhân (The Engaged Life / Signature Strengths), tách bạch rõ ràng với thói quen Flow (Dòng chảy) ở Chặng 2.
  4. Thay thế slide bìa vô nghĩa `slide_22.png` bằng slide nội dung thực thụ `slide_23.png` (Mô hình 3 vòng tròn ME - WE - COMMUNITY & Kim tự tháp Giá trị).
  5. Kiểm thử cục bộ, commit & push Vercel live, kiểm chứng bằng trình duyệt trên production, gửi email báo cáo nghiệm thu.

---

## 1. Chi Tiết Các Hạng Mục Chỉnh Sửa

### Mục 1: Bỏ "Thầy Vũ Hoàng & Ban Giảng Huấn"
- **Giao diện chính (`lms/index.html`):**
  - Thêm `hidden` hoặc ẩn `#lesson-instructor-badge` (dòng 288-290) để không còn hiển thị badge giảng viên ở tiêu đề bài học.
  - Sửa nút dòng 1736: `⚡ Lưu & Đồng Bộ Về Ban Giảng Huấn` -> `⚡ Lưu & Đồng Bộ Dữ Liệu`.
  - Sửa modal hoàn thành dòng 2208: "Ban giảng huấn (Thầy Vũ, Cô Châu, Thầy Hưng, Cô Hân, Cô Hoàn)..." -> "đội ngũ điều phối DHM...".
- **Logic hiển thị (`lms/app.js`):**
  - Làm sạch `instructor: ""` ở dòng 16 và 159.
  - Đảm bảo `lessonInstructorBadge` tự động ẩn (`classList.add('hidden')`) khi không có giảng viên hiển thị.
  - Cập nhật thông báo alert dòng 1773 và 1967 thành "đã đồng bộ thành công vào hệ thống".
  - Đổi tên tài liệu gallery dòng 2722: "Ban Giảng Huấn (Your Guides)" -> "Đội Ngũ Đồng Hành (Your Guides)".
- **Dữ liệu bài học (`lms/curriculum_data.json`):**
  - Xóa chuỗi `instructor` tại các dòng 13, 490, 949.

### Mục 2: Rà soát & Loại bỏ "Bản chụp slide"
- **Giao diện chính (`lms/index.html`):**
  - Đổi tiêu đề modal dòng 2229: `Bản Chụp Slide Bài Giảng` -> `Slide Bài Giảng DHM`.
  - Sửa 10 nút bấm mở slide tại dòng 543, 551, 559, 741, 963, 971, 979, 987, 1163, 1166 từ `Bản Chụp Slide: ...` thành `Slide Bài Giảng: ...`.
- **Logic hiển thị (`lms/app.js`):**
  - Dòng 2433: `openInfographicModal("data/artifacts/slides/slide_25.png", "Slide Bài Giảng: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc")`.
  - Dòng 2537, 2578, 2597, 2707: Đổi `data-title` và text nút bấm "📷 Xem Bản Chụp Slide DHM" thành "📷 Xem Slide Bài Giảng DHM".
  - Dòng 2769: Sửa tiêu đề kho tàng 12 slide thành "Kho Tàng 12 Slide Bài Giảng DHM Chính Thức (HD Presentation)".
- **Dữ liệu (`lms/curriculum_data.json`):**
  - Sửa toàn bộ các tiêu đề tài liệu tại dòng 373, 379, 385, 391, 462, 467, 472, 477 từ `Bản chụp Slide: ...` thành `Slide Bài Giảng: ...`.

### Mục 3: Chuẩn hóa Định Nghĩa Passion vs Flow
- **Nguyên lý Sư phạm:**
  - Martin Seligman chia hạnh phúc làm 3 cấp độ:
    1. *The Pleasant Life (Pleasure)*: Thú vui giác quan, mau nguội lạnh.
    2. *The Engaged Life (Passion / Đam mê)*: Hạnh phúc đến từ việc dấn thân, gắn kết sâu sắc và phát huy thế mạnh bản thân (Signature Strengths) từ động lực nội tại. Trong quá trình dấn thân này, con người trải nghiệm trạng thái Dòng chảy (Flow).
    3. *The Meaningful Life (Higher Purpose)*: Mục đích cao cả, cống hiến cho điều lớn hơn bản thân.
  - Phân định rõ: Đam mê là Cấp độ hạnh phúc nội tại; còn "Phiêu (Flow)" là trạng thái tâm lý đỉnh cao và là 1 trong 5 Thói quen rèn luyện ở Chặng 2.
- **Cập nhật code & data:**
  - `lms/app.js`: Cập nhật thẻ tóm tắt dòng 39 và câu hỏi dòng 52.
  - `lms/curriculum_data.json`: Cập nhật dòng 90, 423-426, 464 để thể hiện chuẩn xác định nghĩa Passion.

### Mục 4: Thay thế Slide Core Values (Slide 22 -> Slide 23)
- **Vấn đề:** Slide 22 chỉ có tiêu đề bìa trắng vô hồn "GIÁ TRỊ CỐT LÕI CÁ NHÂN (ME Values)".
- **Giải pháp:** Đổi sang `slide_23.png` chứa mô hình thực thụ:
  - 3 vòng tròn đồng tâm: CÁ NHÂN (Me) -> TỔ CHỨC (We) -> CỘNG ĐỒNG (Community).
  - Triết lý: "Sự thống nhất bắt đầu với CÁ NHÂN: Bằng cách hiểu được giá trị cốt lõi của bản thân, chúng ta có thể tìm thấy sự thống nhất trong cuộc sống ở nhà và nơi làm việc."
- **Các vị trí cập nhật:**
  - `lms/index.html` dòng 741: `slide_23.png` và nhãn `Slide 23: La Bàn Me Values — Giá Trị Cốt Lõi Cá Nhân`.
  - `lms/app.js` dòng 2597, 2727: Trỏ sang `slide_23.png`.
  - `lms/curriculum_data.json` dòng 472-474: Trỏ sang `slide_23.png`.

---

## 2. Kế Hoạch Xác Minh (Verification & Live Delivery)
1. **Kiểm tra cú pháp & tính toàn vẹn cục bộ:** Chạy script Node.js kiểm tra JSON valid, JS không có cú pháp lỗi.
2. **Kiểm thử trình duyệt Puppeteer:** Xác minh giao diện không còn badge "Thầy Vũ Hoàng", các modal slide mở đúng `slide_23.png`, không còn chữ "Bản chụp slide", console errors = 0.
3. **Commit & Deploy Vercel:** Push nhánh `main`, chờ 35 giây để CDN purge.
4. **Kiểm thử trực tiếp trên Live Vercel:** Kiểm tra URL `https://delivering-happiness.vercel.app/lms/` bằng Puppeteer.
5. **Gửi email báo cáo nghiệm thu:** Báo cáo chi tiết kết quả qua Gmail API (`vuhoang2708@gmail.com`).
