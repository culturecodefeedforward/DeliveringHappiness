# KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN)
## ĐIỀU CHỈNH TIÊU CHUẨN ĐẠT CỔNG VƯỢT CHẶNG (≥ 80%) & TINH GỌN HEADER MICRO-LMS

- **Ngày tạo**: 04/10/2026
- **Trạng thái**: Chờ duyệt (Awaiting Approval - Cấp độ 2)
- **Nguồn chuẩn (Source of Truth)**:
  * Kho lưu trữ chính: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`
  * Bản mirror giảng dạy: `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH`
  * Live URL: `https://delivering-happiness.vercel.app/lms/`

---

### I. MỤC TIÊU & PHẠM VI (SCOPE & OBJECTIVES)

Tiếp nhận yêu cầu chỉnh sửa từ Sếp theo đúng cấu trúc EdTech hiện đại và nâng cao chất lượng đầu vào của học viên:
1. **Nâng ngưỡng đạt Cổng Vượt Chặng (Qualifying Gate)** từ `≥ 70%` (7/10 câu) lên **`≥ 80%` (8/10 câu)** cho bài kiểm tra 10 câu trắc nghiệm Chặng 1, áp dụng đồng bộ từ giao diện UI, thông báo phản hồi, logic chấm điểm JavaScript, tính toán thanh tiến độ đến tài liệu cẩm nang.
2. **Lược bỏ các nút và chỉ số trùng lặp trên thanh Header phía trên**:
   - Bỏ hàng chữ chỉ số `%` từng chặng bên dưới thanh tiến độ: `C1: 0%`, `C2: 0%`, `C3: 0%`. Giữ nguyên 3 thanh phân đoạn màu sắc đồ họa để thanh header trực quan, gọn gàng và sang trọng.
   - Bỏ 3 nút điều hướng ở góc phải header: `📘 Lộ Trình`, `▶ Tiếp Tục Học`, `⚡ Vượt Chặng` vì toàn bộ các chức năng này đã có vị trí hiển thị to, rõ ràng và đầy đủ ngữ cảnh ở khu vực Hero Action Banner và Bottom Bar bên dưới.

---

### II. DANH SÁCH TỆP ẢNH HƯỞNG (ALLOWLIST & BACKUP)

| STT | Đường dẫn tệp | Vai trò | Tệp sao lưu (Backup) |
|---|---|---|---|
| 1 | `dh4hn-website/lms/index.html` | Cấu trúc giao diện HTML chính (Header & Cổng vượt chặng) | `index.html.bak_20261004_gate80` |
| 2 | `dh4hn-website/lms/app.js` | Logic chấm điểm, ngưỡng pass ≥80%, xử lý an toàn sự kiện Header | `app.js.bak_20261004_gate80` |
| 3 | `dh4hn-website/lms/curriculum_data.json` | Dữ liệu mô tả bài học & quy chế vượt chặng | `curriculum_data.json.bak_20261004_gate80` |
| 4 | `dh4hn-website/docs/huong_dan_va_lo_trinh_hoc_dhm.md` | Cẩm nang học tập & quy chế chuẩn hóa | `huong_dan_va_lo_trinh_hoc_dhm.md.bak_20261004` |
| 5 | `Teaching DH/dhm-micro-lms/*` | Bản sao đồng bộ thư mục giảng dạy | Đồng bộ theo bản chính sau khi kiểm chứng |

---

### III. CHI TIẾT CÁC BƯỚC THỰC HIỆN (STEP-BY-STEP IMPLEMENTATION)

#### 1. Điều chỉnh điều kiện vượt chặng ≥ 80%
- **Trong `index.html`**:
  * Cập nhật badge trong Hero Banner Chặng 1: `Đạt ≥ 70%` ➔ `Đạt ≥ 80%`.
  * Cập nhật mô tả trong Module 1.4 / Mục 1.5 Accordion: `Đạt ≥70% (7/10 câu)` ➔ `Đạt ≥80% (8/10 câu)`.
  * Cập nhật nhãn điều kiện vượt chặng: `Điều kiện vượt chặng: ≥ 70%` ➔ `Điều kiện vượt chặng: ≥ 80%`.
  * Cập nhật hướng dẫn làm bài: `Học viên cần đạt từ 8/10 câu (80%) trở lên sau tối đa 3 lần thử...`
- **Trong `app.js`**:
  * Sửa ngưỡng kiểm tra đạt: `const passed = percent >= 80;` (dòng 1871) và `currPct >= 80;` (dòng 1951).
  * Sửa số câu tối thiểu mở khóa: `Math.ceil(quizzes.length * 0.8)` (thay vì 0.7) ➔ 8 câu.
  * Cập nhật các câu alert thông báo khi khóa chặng: Đổi `70%` thành `80%`.
  * Cập nhật hàm tính tiến độ `calculateStage1Progress()`: Mốc 5 đạt bài kiểm tra khi `score >= 8 || percentage >= 80`.
- **Trong `curriculum_data.json` & docs**:
  * Cập nhật các trường mô tả quy chế vượt chặng từ `≥70%` sang `≥80%`.

#### 2. Tinh gọn thanh điều hướng Header phía trên
- **Trong `index.html`**:
  * Gỡ bỏ khối mã sub-labels:
    ```html
    <div class="grid grid-cols-3 gap-1.5 text-[9px] text-slate-500 mt-1 font-semibold">
        <span id="segment-label-1" class="truncate">C1: 0%</span>
        <span id="segment-label-2" class="truncate text-center">C2: 0%</span>
        <span id="segment-label-3" class="truncate text-right">C3: 0%</span>
    </div>
    ```
  * Gỡ bỏ 3 nút bấm ở Header:
    - `<button id="btn-header-roadmap"><span>📘 Lộ Trình</span></button>`
    - `<button id="btn-header-resume"><span>▶ Tiếp Tục Học</span></button>`
    - `<button id="btn-header-quiz"><span>⚡ Vượt Chặng</span></button>`
- **Trong `app.js`**:
  * Rà soát các hàm gán sự kiện cho `segmentLabel1..3`, `btnHeaderResume`, `btnHeaderQuiz`, `btnHeaderRoadmap`. Đảm bảo các đoạn mã này có điều kiện kiểm tra tồn tại an toàn (`if (el) ...`), không gây ra lỗi `TypeError: Cannot read properties of null` trong Console.

---

### IV. QUY TRÌNH KIỂM CHỨNG & TIÊU CHÍ NGHIỆM THU (VERIFICATION & ACCEPTANCE)

1. **Kiểm tra cú pháp & tính toàn vẹn (Syntax & Integrity Check)**:
   - Chạy script kiểm tra cú pháp file JavaScript `app.js` (không có lỗi cú pháp hoặc runtime error).
   - Kiểm tra mã hóa UTF-8 cho toàn bộ các file sửa đổi.
2. **Kiểm thử logic Cổng Vượt Chặng (Quiz Logic Simulation)**:
   - Giả lập bài test với 7/10 câu đúng ➔ Trạng thái: **Chưa đạt** (Hiển thị tiêu chuẩn ≥80%, cho phép làm lại nếu còn lượt thử).
   - Giả lập bài test với 8/10 câu đúng ➔ Trạng thái: **Đạt** (Mở khóa Chặng 2 & Chặng 3, hoàn tất Mốc 5 của Chặng 1).
3. **Kiểm tra hiển thị giao diện (UI Verification)**:
   - Kiểm tra Header trên cả màn hình Desktop và Mobile: Hiển thị thanh tiến độ 3 phân đoạn sạch sẽ, không còn nhãn `C1: 0%` và 3 nút dư thừa.
   - Kiểm tra Hero Banner: Hiển thị đúng badge `Đạt ≥ 80%`.

---

### V. KẾ HOẠCH QUAY LUI (ROLLBACK STRATEGY)

Nếu có bất kỳ sự cố phát sinh nào sau khi sửa đổi, Agent sẽ khôi phục ngay lập tức các tệp từ bản sao lưu:
- Sao chép đè các tệp `.bak_20261004_gate80` về lại các tệp gốc.
- Hệ thống trở lại nguyên trạng 100% trước khi can thiệp.
