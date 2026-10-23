# Kế Hoạch Triển Khai: Chuẩn Hóa UI/UX Mobile, Luồng Me Values, Cấu Trúc Tab Sư Phạm & Thuật Ngữ Slide LMS Chặng 1

- **Ngày khởi tạo:** 08/10/2026
- **Trạng thái:** Sẵn sàng thực thi (Ready for Execution)
- **Dự án:** Delivering Happiness Masterclass (Teaching DH & dh4hn-website)
- **Mã nguồn tác động:**
  + `dh4hn-website/lms/index.html`
  + `dh4hn-website/lms/app.js`
  + `dh4hn-website/lms/curriculum_data.json`

---

## 1. Bối Cảnh & Mục Tiêu

Nhận chỉ đạo kỹ thuật và định hướng sư phạm trực tiếp từ Sếp Dzũ:
1. **Khắc phục lỗi vỡ layout mobile:** Trên màn hình 360px–390px, các Accordion Header bài 1.1, 1.2, 1.3, 1.4 bị dồn ép cột ngang khiến chữ bị bẻ thành cột dọc 5–6 dòng. Cần tối ưu theo `ck:ui-ux-pro-max`, xóa tag trùng lặp, mở rộng chiều ngang tiêu đề và đưa trạng thái xuống dòng phụ.
2. **Khắc phục luồng truy cập Me Values:** Hiện tại link bài test bị giấu kín qua 2 tầng accordion đóng (`mod-1-2-body` đóng ➔ `<details class="practice-accordion">` đóng). Đưa nút CTA nổi bật trực diện ra ngoài với nhãn chuẩn: `[ 🧭 Test Me values ↗ ]`.
3. **Cập nhật văn bản mô tả Bài 1.2:** Thay câu dài dòng cũ bằng câu chuẩn của Sếp: *"Khám phá các giá trị cốt lõi điển hình và xếp hạng qua các tình huống điển hình."*
4. **Loại bỏ bài test vượt chặng xuất hiện quá nhiều:** Gỡ bỏ 2 banner thừa (trên video `#hero-quiz-gate-banner` và ở tab tổng quan `#summary-quiz-gate-banner`), chỉ giữ đúng Bài 1.4 theo thứ tự bài học và nút Footer.
5. **Cấu trúc Tab chuẩn sư phạm:**
   - Cuối Tab Tổng quan: Thêm cầu nối trực tiếp để cuộn/chuyển thẳng vào Lý thuyết (`[ 📖 Vào Học: Nội Dung Chính ➔ ]`).
   - Đổi Tab 2 `🛠️ Trạm Thực Hành` thành `📖 Nội dung chính` (Chặng 1 bản chất là Lý thuyết nền tảng, chỉ có bài tập Me Values và IAM ở cuối).
   - Đổi Tab 3 `📂 Tài Liệu` thành `📚 Xem thêm`. Lọc bỏ hoàn toàn các slide trùng lặp với bài học chính, bổ sung các Slide & Artifact mở rộng thực thụ (Slide 14, 18, 19, 20, 38, Cẩm nang LMS, Báo cáo dòng chảy, Flashcards).
6. **Chuẩn hóa 100% thuật ngữ theo Slide gốc:**
   - Xóa bỏ triệt để từ "Signature Strengths" (vốn do agent cũ tự ý bịa vào ngày 03/10/2026).
   - Đưa về mô tả nguyên văn Slide: Đam mê là *"Phiêu và gắn kết. Thời gian trôi nhanh"*.
   - Ghi đầy đủ tác giả: *Mihály Csíkszentmihályi & Martin Seligman*.
   - Chuẩn hóa thứ tự và tên 3 Đòn bẩy SDT: *1. Cảm giác Kết nối • 2. Cảm giác Tự chủ (Autonomy) • 3. Cảm giác Tiến bộ*.
   - Đổi tên Bài 1.2 thành *Bài 1.2: Giá Trị Cốt Lõi Cá Nhân (ME Values) & La Bàn Hành Động*, bỏ chuỗi tiếng Anh rườm rà.

---

## 2. Chi Tiết Các Thay Đổi Mã Nguồn

### A. Tệp `dh4hn-website/lms/index.html`

1. **Tab Headers (Dòng 404–415):**
   - Đổi `<span>🛠️ Trạm Thực Hành</span>` thành `<span>📖 Nội dung chính</span>`.
   - Đổi `<span>📂 Tài Liệu</span>` thành `<span>📚 Xem thêm</span>`.
2. **Tab Tổng Quan (`#tab-summary`):**
   - **Xóa bỏ** `#summary-quiz-gate-banner` (Dòng 420–440).
   - **Thêm Cầu Nối Vào Lý Thuyết** ở cuối `#tab-summary` (ngay dưới `#summary-cards-container`):
     ```html
     <div class="mt-8 pt-6 border-t border-brand-border/60">
         <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-amber/15 via-brand-surface to-brand-orange/15 border-2 border-brand-amber/50 shadow-xl shadow-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div class="flex items-center gap-3.5">
                 <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-amber flex items-center justify-center text-xl sm:text-2xl text-black font-extrabold shadow-md shrink-0">
                     📖
                 </div>
                 <div>
                     <span class="px-2 py-0.5 rounded bg-brand-amber text-black font-extrabold text-[10px] uppercase tracking-wider">BẮT ĐẦU HỌC TẬP</span>
                     <h3 class="text-sm sm:text-base font-extrabold text-white mt-0.5">Sẵn Sàng Đi Vào Nội Dung Chính?</h3>
                     <p class="text-xs text-slate-300 mt-1">
                         Khám phá chi tiết 3 Cấp Độ Hạnh Phúc, Định Vị La Bàn Me Values và 3 Đòn Bẩy Hạnh Phúc.
                     </p>
                 </div>
             </div>
             <button id="btn-goto-core-content" type="button" class="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0">
                 <span>Vào Học Nội Dung Chính ➔</span>
             </button>
         </div>
     </div>
     ```
3. **Loại bỏ Banner trên Video Player:**
   - **Xóa bỏ hoàn toàn** `#hero-quiz-gate-banner` (Dòng 311–337). Video Player sẽ lên vị trí đầu tiên sạch sẽ.
4. **Accordion Headers (Bài 1.1 -> 1.4):**
   - Áp dụng cấu trúc 2 tầng (Two-tier Visual Hierarchy):
     + Tầng 1: Icon số bài (`1.1`, `1.2`, `1.3`, `1.4`) + Tiêu đề bài học (`<h3>`) + Nút mũi tên chevron `▼`.
     + Tầng 2: Dòng tóm tắt + Badge trạng thái nằm ở đầu dòng phụ.
     + Xóa bỏ các Tag vàng trùng lặp đứng trước tiêu đề.
     + Đổi `p-5` thành `p-3.5 sm:p-5`.
5. **CTA La Bàn Me Values:**
   - **Tại Header Bài 1.2:** Thêm nút bấm 1-chạm:
     ```html
     <a href="../personal-value.html" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="text-[10px] sm:text-xs px-2.5 py-1 rounded-lg bg-brand-amber hover:bg-amber-400 text-black font-extrabold shadow-sm transition-all inline-flex items-center gap-1 shrink-0">
         <span>🧭 Test Me values ↗</span>
     </a>
     ```
   - **Đầu nội dung `mod-1-2-body`:** Đưa khối Hero Callout Banner làm bài test Me Values lên đầu tiên (trước cả 2 slide lý thuyết).
6. **Cập nhật văn bản mô tả Bài 1.2:**
   - Đổi thành: *"Khám phá các giá trị cốt lõi điển hình và xếp hạng qua các tình huống điển hình."*
7. **Tab Xem Thêm (`#tab-resources`):**
   - Đổi tiêu đề: `<span>📚 Tài Liệu Mở Rộng & Tri Thức Bổ Trợ (Xem thêm)</span>`.

---

### B. Tệp `dh4hn-website/lms/curriculum_data.json`

1. **Chuẩn hóa Tiêu đề & Tác giả:**
   - Dòng 22: `Bài 1.1: 3 Cấp Độ Hạnh Phúc (Mihály Csíkszentmihályi & Martin Seligman)`.
   - Dòng 28: `Bài 1.2: Giá Trị Cốt Lõi Cá Nhân (ME Values) & La Bàn Hành Động`.
   - Dòng 34: `Bài 1.3: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc Ở Nơi Làm Việc`.
   - Dòng 40: `Bài 1.4: Cổng Vượt Chặng — Bài Kiểm Tra 10 Câu Trắc Nghiệm`.
2. **Xóa triệt để "Signature Strengths" & Cập nhật mô tả Slide:**
   - Dòng 52–54 & dòng 1147–1150: Xóa cụm từ `(Signature Strengths)`. Thay bằng:
     *"Cấp độ 2: Đam mê (Passion) — Phiêu và gắn kết. Thời gian trôi nhanh. Trạng thái dấn thân đắm chìm vào công việc từ động lực nội tại."*
   - Cấp độ 1: Thêm mô tả nguyên văn: *"Sao nhạc rock theo đuổi đỉnh cao mới. Nhanh nguội lạnh do cơ chế thích nghi khoái lạc."*
   - Cấp độ 3: Thêm mô tả nguyên văn: *"Là một phần của điều gì đó lớn lao hơn chính bản thân. Cống hiến và phụng sự cộng đồng."*
3. **Mô tả Bài 1.2:**
   - Đổi thành: *"Khám phá các giá trị cốt lõi điển hình và xếp hạng qua các tình huống điển hình."*
4. **Chuẩn hóa 3 Đòn Bẩy SDT:**
   - Đổi `Tự chủ (Control)` ở các câu hỏi trắc nghiệm thành `Cảm giác Tự chủ (Autonomy)`.
   - Thứ tự chuẩn: 1. Cảm giác Kết nối • 2. Cảm giác Tự chủ (Autonomy) • 3. Cảm giác Tiến bộ.
5. **Lọc sạch kho tài nguyên Chặng 1 (`stage.resources`):**
   - **XÓA BỎ:** Slide 16, 17, 23, 25 (đã có trong bài học).
   - **BỔ SUNG:**
     1. `Slide 14`: *Slide Bài Giảng: Mọi Mục Tiêu Đều Quy Về Hạnh Phúc (Chuỗi Câu Hỏi Tại Sao?)* (`data/artifacts/slides/slide_14.png`)
     2. `Slide 18`: *Slide Bài Giảng: Lời Dạy Aristotle 200BC — Hạnh Phúc Là Mục Đích Tồn Tại* (`data/artifacts/slides/slide_18.png`)
     3. `Slide 19`: *Slide Bài Giảng: Điều Gì Khiến Hạnh Phúc Bền Lâu?* (`data/artifacts/slides/slide_19.png`)
     4. `Slide 20`: *Slide Bài Giảng: Ai Khiến Hạnh Phúc Bền Lâu? (Cá Nhân • Tập Thể • Cộng Đồng)* (`data/artifacts/slides/slide_20.png`)
     5. `Slide 38`: *Slide Bài Giảng: Lợi Ích Của Đòn Bẩy Tiến Bộ (Dopamine & Small Wins)* (`data/artifacts/slides/slide_38.png`)
     6. *Cẩm Nang Lộ Trình Học Tập & Hướng Dẫn LMS* (`data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md`)
     7. *Báo cáo Nghiên cứu: Khoa Học Hạnh Phúc & Dòng Chảy Tổ Chức* (`data/artifacts/report_dong_chay.md`)
     8. *Bộ 25 Flashcards Văn Hóa Ghi Nhớ*

---

### C. Tệp `dh4hn-website/lms/app.js`

1. **Chuẩn hóa Text trong JS:**
   - Xóa bỏ `(Signature Strengths)` ở dòng 38 và các vị trí render tương ứng.
   - Chuẩn hóa tiêu đề bài 1.1, 1.2, 1.3 theo đúng Slide.
2. **Sự kiện Nút Cầu Nối `#btn-goto-core-content`:**
   - Gắn sự kiện click để tự động chuyển tab sang `tab-practice`, mở Accordion Module 1.1 và cuộn mượt đến bài học.
3. **Dọn dẹp an toàn các tham chiếu banner đã gỡ:**
   - Giữ nguyên các hàm nhưng không còn phụ thuộc vào `#hero-quiz-gate-banner` và `#summary-quiz-gate-banner`.

---

## 3. Kế Hoạch Kiểm Chứng (Verification Protocol)

1. **Cú pháp JS & JSON:**
   - `node -c lms/app.js` (Phải trả về 0 lỗi).
   - `python -c "import json; json.load(open('lms/curriculum_data.json', encoding='utf-8'))"` (Phải hợp lệ 100%).
2. **Kiểm thử hiển thị & luồng trên Mobile:**
   - Sử dụng Playwright / Chrome DevTools với viewport di động (`375x667` và `390x844`):
     * Xác minh tiêu đề Bài 1.1 -> 1.4 không còn bị bóp thành cột dọc.
     * Xác minh nút `[ 🧭 Test Me values ↗ ]` hiển thị rõ ràng tại Header Bài 1.2.
     * Xác minh video player nằm ở đầu trang sạch sẽ, không còn banner quiz che mắt.
     * Xác minh cuối tab Tổng quan có khối cầu nối chuyển sang Lý thuyết mượt mà.
     * Xác minh Tab 2 hiển thị "Nội dung chính", Tab 3 hiển thị "Xem thêm" với các tài liệu không trùng lặp.
     * Xác minh tuyệt đối không còn chữ "Signature Strengths" nào trên giao diện.

---

## 4. Phương Án Quay Lui (Rollback)

- Tạo bản sao dự phòng trước khi can thiệp:
  + `lms/index.html.bak_20261008_ui_sync`
  + `lms/app.js.bak_20261008_ui_sync`
  + `lms/curriculum_data.json.bak_20261008_ui_sync`
- Nếu có sự cố, khôi phục ngay lập tức bằng lệnh copy file `.bak` hoặc `git checkout lms/`.
