# KỊCH BẢN KIỂM THỬ NGHIỆM THU TRÌNH DUYỆT (BROWSER UAT TEST PLAN)
## HỆ THỐNG LMS DELIVERING HAPPINESS (DHM) — 5 ĐIỂM CHUẨN HÓA HÀNH TRÌNH

- **Mục tiêu**: Hướng dẫn Agent đối tác (Codex / Claude / Browser Sub-agent) thực hiện kiểm thử nghiệm thu trực tiếp bằng trình duyệt trên môi trường Live Production.
- **Target URL**: `https://delivering-happiness.vercel.app/lms/`
- **Tài khoản kiểm thử chuẩn**:
  * Email / Identity: `vuhoang2708software@gmail.com`
  * Mật khẩu (4 số cuối SĐT): `1234`
- **Yêu cầu Viewport**:
  * Desktop: `1280 x 800` (hoặc `1440 x 900`)
  * Mobile: `375 x 812` (Apple iPhone Profile)

---

## 1. MA TRẬN 7 CA KIỂM THỬ (TEST CASES)

### Case 1: Modal Quick Start (Hành trình 4 Bước chuẩn hóa)
- **Thao tác**:
  1. Truy cập `https://delivering-happiness.vercel.app/lms/`.
  2. Nếu xuất hiện hộp thoại đăng nhập (`#auth-modal`), nhập Email `vuhoang2708software@gmail.com` và Pass `1234`, bấm "Đăng Nhập".
  3. Chờ 600ms để Modal Quick Start (`#modal-quick-start`) tự động mở.
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] Bước 1 ghi rõ: "Tham gia Buổi online và Đăng nhập tài khoản (Email & 4 số cuối SĐT)..."
  * [x] Bước 2 ghi rõ: "Xem Lý Thuyết Cốt Lõi qua Slide bài giảng chuẩn: 3 Cấp độ Hạnh phúc, Giá trị cốt lõi, và 3 Đòn bẩy."
  * [x] Bước 3 ghi rõ: "Định Vị La Bàn Giá Trị Bản Thân (Me Values)..."
  * [x] Bước 4 ghi rõ: "Vượt Qua Cổng Sát Hạch ≥80% (làm bài test 10 câu, đạt tối thiểu 8/10) để chính thức nhận vé tham dự Chặng 2 (Lớp Offline)."
  * [x] Có mẹo học nhanh: Hướng dẫn bấm nút thu gọn mục lục để bật Chế độ Tập Trung (Focused Mode).
  * [x] Bấm nút "Bắt Đầu Học Ngay ➔" (#btn-quick-start-dismiss), modal Quick Start đóng lại (thêm class `hidden`).
- **Bằng chứng cần thu thập**: Ảnh chụp màn hình Modal Quick Start trên Desktop.

---

### Case 2: Nút Video Tổng Quan độc lập & Lightbox Modal
- **Thao tác**:
  1. Trên Header, tìm nút `🎬 Video Tổng Quan (7:27)` (`#btn-header-overview-video`).
  2. Bấm vào nút này.
  3. Kiểm tra Modal Video Lightbox (`#modal-video-overview`).
  4. Bấm nút đóng `✕` (`#btn-close-video-overview`) hoặc click vùng đen bên ngoài.
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] Modal Video mở ra với tiêu đề: "Video Tổng Quan Về Delivering Happiness — Hệ Điều Hành Hạnh Phúc Tự Thân (Thời lượng: 7:27)".
  * [x] Thẻ video player hiển thị đúng nguồn `/data/artifacts/the_explainer.mp4`.
  * [x] Khi bấm đóng ✕, modal đóng lại và video tạm dừng phát (pause).
  * [x] Nút Video độc lập trên đỉnh Sidebar (`#btn-global-overview-video`) cũng hoạt động tương tự.
- **Bằng chứng cần thu thập**: Ảnh chụp modal video lightbox đang mở.

---

### Case 3: Tiêu đề sạch sẽ Chặng 1 & Thanh Milestone 4 nấc
- **Thao tác**:
  1. Chuyển sang Tab 2 "Thực Hành & Phản Tư" (`[data-tab="tab-practice"]`).
  2. Quan sát thanh tiến độ Chặng 1 (`#stage1-milestone-bar`) và tiêu đề 4 bài học.
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] Thanh tiến độ ghi `0/4 Hoàn thành` (hoặc tỷ lệ X/4 tương ứng tiến độ tài khoản), gồm đúng 4 chip mốc:
    - `1. 3 Cấp Độ Hạnh Phúc` (`#m-pill-levels`)
    - `2. La Bàn Me Values` (`#m-pill-values`)
    - `3. 3 Đòn Bẩy Hạnh Phúc` (`#m-pill-drivers`)
    - `4. Cổng Vượt Chặng (≥80%)` (`#m-pill-quiz`)
  * [x] Tiêu đề 4 bài học sạch sẽ, không còn nhãn kép `Mục 1.X ·`:
    - `Bài 1.1: 3 Cấp Độ Hạnh Phúc (Martin Seligman)`
    - `Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)`
    - `Bài 1.3: 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)`
    - `Bài 1.4: Cổng Vượt Chặng — Bài Kiểm Tra 10 Câu Trắc Nghiệm`
  * [x] Kiểm tra trong mã nguồn DOM không còn xuất hiện chuỗi "Mục 1.".
- **Bằng chứng cần thu thập**: Ảnh chụp Tab Thực hành hiển thị thanh Milestone và tiêu đề các bài học.

---

### Case 4: Slide Định nghĩa Giá trị cốt lõi & Slide Inline
- **Thao tác**:
  1. Nhấp vào header Bài 1.2 (`#stage1-mod-1-2 .accordion-header`) để mở nội dung.
  2. Quan sát PHẦN 1: Lý Thuyết & Tài Liệu Bài Giảng.
  3. Nhấp vào nút `🔍 HD` hoặc ảnh của slide Định nghĩa Giá trị cốt lõi.
  4. Đóng modal phóng to, kiểm tra slide 23 bên cạnh.
  5. Mở Bài 1.1 và Bài 1.3 để kiểm tra các slide inline khác.
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] Bài 1.2 render trực tiếp 2 ảnh slide theo dạng lưới (grid):
    - Slide Định nghĩa Giá trị cốt lõi: chứa 5 yếu tố cốt lõi (Động cơ, Đạo đức, Chỉ dẫn, Tầm quan trọng, Hành động) từ file `slide_core_values_definition.jpg`.
    - Slide 23: chứa mã QR La Bàn Me Values từ file `slide_23.png`.
  * [x] Bấm vào nút xem HD mở Infographic Modal (`#infographic-modal`) hiển thị ảnh chất lượng cao.
  * [x] Bài 1.1 hiển thị 3 slide inline: Slide 16, Slide 17, Slide 14.
  * [x] Bài 1.3 hiển thị 4 slide inline: Slide 25, Slide 29, Slide 31, Slide 38.
- **Bằng chứng cần thu thập**: Ảnh chụp 2 slide hiển thị inline trong Bài 1.2.

---

### Case 5: Accordion Thực Hành Chặng 1 mặc định thu nhỏ
- **Thao tác**:
  1. Khi mở bất kỳ bài nào trong Chặng 1 (Bài 1.1, 1.2, 1.3), quan sát PHẦN 2.
  2. Kiểm tra thuộc tính `open` của thẻ `<details class="practice-accordion ...">`.
  3. Bấm vào tiêu đề `🎯 Thực Hành & Phản Tư...` để mở rộng.
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] Khi mới mở bài học, PHẦN 2 luôn ở trạng thái **thu nhỏ (collapsed)**, `open = false`.
  * [x] Tiêu đề hiển thị nhãn xanh lá `PHẦN 2` và mũi tên chỉ xuống `▼`.
  * [x] Khi nhấp chuột vào thanh tiêu đề, accordion mở rộng mượt mà (`open = true`) làm lộ diện các ô phản tư I•A•M và bảng chọn 41 giá trị cốt lõi.
- **Bằng chứng cần thu thập**: Ảnh chụp accordion trước và sau khi nhấp mở.

---

### Case 6: Dàn nút dính đáy Sticky Bottom Bar trên Mobile
- **Thao tác**:
  1. Chuyển kích thước cửa sổ trình duyệt sang `375 x 812` (mô phỏng iPhone).
  2. Tải lại trang và đăng nhập.
  3. Quan sát thanh thanh dính đáy màn hình (Sticky Bottom Bar).
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] Dàn nút dính đáy hiển thị đầy đủ cả 2 nút bấm điều hướng:
    - Nút `📘 Lộ trình` (#btn-bottom-roadmap).
    - Nút `⚡ Vượt chặng` (#btn-bottom-quiz).
  * [x] Cả 2 nút có kích thước hiển thị thực tế (`width > 0, height > 0`), không bị ẩn bởi class `hidden sm:inline-flex` như phiên bản cũ.
  * [x] Bấm nút `📘 Lộ trình` mở tài liệu lộ trình khóa học.
  * [x] Bấm nút `⚡ Vượt chặng` tự động chuyển tab và mở Bài 1.4 kiểm tra trắc nghiệm.
- **Bằng chứng cần thu thập**: Ảnh chụp toàn màn hình Mobile hiển thị dàn nút dính đáy.

---

### Case 7: Độ sạch Console & Network
- **Thao tác**:
  1. Mở Console (F12) và Network Tab trong suốt quá trình kiểm thử.
- **Tiêu chuẩn nghiệm thu (Expected Results)**:
  * [x] 0 lỗi đỏ nghiêm trọng (Console Error = 0).
  * [x] Các tệp tĩnh `index.html`, `app.js`, `curriculum_data.json`, và ảnh `slide_core_values_definition.jpg` đều trả về HTTP Status `200 OK`.

---

## 2. QUY CHUẨN ĐẦU RA BÁO CÁO CỦA AGENT ĐỐI TÁC

Báo cáo bàn giao kết quả của Agent đối tác cần ghi rõ:
1. `Target URL đã test`
2. `Viewport đã test` (Desktop + Mobile)
3. `Bảng kết quả 7 Test Cases` (PASS/FAIL kèm ghi chú)
4. `Console/Network errors` (nếu có)
5. `Đường dẫn ảnh chụp màn hình chứng minh` (lưu vào thư mục `UAT/screenshots/` của repo).
