# IMPLEMENTATION PLAN: CẬP NHẬT NỘI DUNG HƯỚNG DẪN BẢNG ĐIỂM DANH 5 THÓI QUEN 21 NGÀY TRÊN GIAO DIỆN WEB LMS & CẨM NANG HỌC TẬP

- **Mã kế hoạch:** `PLAN-20261005-LMS-WEB-HABIT-GUIDE`
- **Ngày lập:** 05/10/2026
- **Trạng thái:** Chờ phê duyệt (Awaiting Level 2 Approval)
- **Tác giả:** Antigravity (Pair Programming with Sếp Dzũ)

---

## 1. Bối Cảnh & Mục Tiêu

### A. Vấn đề thực tế
- Trước đó, tài liệu hướng dẫn kiểm thử mới chỉ được tạo dưới dạng file markdown độc lập (`docs/huong_dan_test_habit_tracker_core_team.md`) phục vụ nhóm kiểm thử nội bộ.
- Tuy nhiên, **trên chính giao diện Web LMS** (`https://delivering-happiness.vercel.app/lms/`):
  1. Khu vực Bảng Điểm Danh 21 Ngày (`#stage3-tracker-section`) chỉ có tiêu đề và các nút viết tắt **M - G - O - F - A** mà chưa có bảng chú giải rõ ràng từng thói quen, chưa có hướng dẫn các bước thao tác (chọn điểm danh -> điều kiện Đạt ✓ -> bấm đồng bộ -> cơ chế lưu tự động).
  2. Cẩm nang Lộ trình học tập (`data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md`) - vốn được người học mở ra đọc khi bấm nút `🗺️ Lộ Trình & Hướng Dẫn` trên thanh điều hướng web - hiện mới dừng lại ở Chặng 1 và Chặng 2, chưa có phần hướng dẫn chi tiết cho Chặng 3 và chưa có hình ảnh chụp giao diện thực tế.
  3. Trình đọc tài liệu trong web LMS (`renderSimpleMarkdown` trong `lms/app.js`) chưa hỗ trợ hiển thị thẻ ảnh Markdown `![alt](url)`, dẫn đến việc các ảnh chụp minh họa chưa hiển thị trực quan trong modal đọc tài liệu.

### B. Mục tiêu cụ thể
1. **Trực quan hóa ngay trên giao diện Web LMS:** Bổ sung khối **"📖 Hướng Dẫn Thực Hành & Ý Nghĩa 5 Thói Quen (M - G - O - F - A)"** dạng Accordion đóng/mở linh hoạt ngay tại Bảng Điểm Danh Chặng 3, giải thích cặn kẽ 5 thói quen và 3 bước điểm danh/đồng bộ.
2. **Cập nhật Cẩm nang Lộ trình LMS:** Bổ sung trọn vẹn Chương Hướng Dẫn Chặng 3 vào file `data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md`, tích hợp trọn bộ 4 ảnh chụp giao diện thật.
3. **Nâng cấp trình đọc Markdown của Web LMS:** Thêm parser ảnh vào `renderSimpleMarkdown` để người học bấm xem cẩm nang là nhìn thấy ngay các ảnh chụp giao diện từng bước sắc nét.
4. **Đồng bộ kho ảnh tĩnh:** Đưa 4 ảnh chụp giao diện chuẩn vào thư mục tĩnh `/data/artifacts/images/` của website.

---

## 2. Phạm Vi Thay Đổi (Allowlist)

| STT | Tệp tin / Thư mục | Loại thao tác | Mục đích |
| :---: | :--- | :---: | :--- |
| 1 | `dh4hn-website/data/artifacts/images/` | Tạo mới & Sao chép | Lưu trữ 4 ảnh chụp giao diện chuẩn (`guide_step1_...png` đến `guide_step4_...png`) |
| 2 | `dh4hn-website/data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md` | Chỉnh sửa | Bổ sung Phần V: Hướng dẫn chi tiết Chặng 3 & Bảng Điểm Danh 21 Ngày kèm 4 ảnh giao diện |
| 3 | `dh4hn-website/lms/index.html` | Chỉnh sửa | Bổ sung khối Accordion Hướng Dẫn & Chú Giải 5 Thói Quen tại `#stage3-tracker-section`, nút mở cẩm nang |
| 4 | `dh4hn-website/lms/app.js` | Chỉnh sửa | Hỗ trợ hiển thị ảnh trong `renderSimpleMarkdown`, liên kết nút mở cẩm nang từ Bảng điểm danh |

*Các tệp ngoài danh sách trên tuyệt đối không được chỉnh sửa.*

---

## 3. Các Bước Triển Khai Chi Tiết

### Bước 1: Đồng bộ 4 ảnh chụp giao diện vào static web folder
- Copy từ `Teaching DH/docs/images/` sang `dh4hn-website/data/artifacts/images/`:
  - `guide_step1_login_modal.png`
  - `guide_step2_dashboard_overview.png`
  - `guide_step3_stage3_practice.png`
  - `guide_step4_habit_tracker_synced.png`

### Bước 2: Nâng cấp `renderSimpleMarkdown` trong `dh4hn-website/lms/app.js`
- Bổ sung bộ lọc nhận diện ảnh `!\[(.*?)\]\((.*?)\)`:
  - Sinh thẻ `<div class="my-4 text-center"><img src="..." class="rounded-xl border border-brand-border max-w-full mx-auto shadow-lg" loading="lazy" /><p class="text-[11px] text-slate-400 mt-1.5 italic">...</p></div>`.
- Gắn sự kiện cho nút `#btn-open-habit-full-doc` (trong Bảng điểm danh) để mở trực tiếp modal Cẩm nang qua `openRoadmapDoc()`.

### Bước 3: Cập nhật giao diện `dh4hn-website/lms/index.html`
- Tại `#stage3-tracker-section`, chèn khối `<details open class="explore-more">` chứa:
  - Bảng 5 thẻ thói quen: **M** (Mindfulness - SCBA), **G** (Gratitude - 4 điều biết ơn), **O** (Optimism - ABCDE), **F** (Flow - Thử thách 4%), **A** (Altruism - 5-Minute Favors).
  - Khung 3 bước: 1. Chạm chọn điểm danh (đạt 3/5 là Ngày Đạt ✓) -> 2. Bấm Đồng bộ về BTC -> 3. Lưu trữ tự động & xem mốc giờ xanh emerald.
  - Nút chuyển nhanh: `📖 Mở Cẩm Nang Hướng Dẫn & Lộ Trình Chi Tiết ➔`.

### Bước 4: Cập nhật Cẩm nang `dh4hn-website/data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md`
- Thêm **PHẦN V: HƯỚNG DẪN THỰC HÀNH CHẶNG 3: BẢNG ĐIỂM DANH 5 THÓI QUEN 21 NGÀY & ĐỒNG BỘ VỀ BAN TỔ CHỨC**.
- Nhúng 4 ảnh giao diện với đường dẫn `/data/artifacts/images/...`.
- Cung cấp hướng dẫn chi tiết về chuỗi rèn luyện Streak, các mốc nhận huy hiệu và mở khóa 3 tầng quà tri ân.

### Bước 5: Kiểm chứng cục bộ (Local UAT)
- Chạy script kiểm thử Puppeteer tự động trên localhost hoặc file tĩnh:
  - Kiểm tra giao diện Chặng 3 hiển thị đầy đủ khối chú giải 5 thói quen M-G-O-F-A và 3 bước hướng dẫn.
  - Bấm nút mở cẩm nang, xác minh modal `#doc-reader-modal` mở ra và hiển thị đúng cả 4 hình ảnh minh họa.
  - Xác minh không có lỗi cú pháp JS (SyntaxError) hay vỡ giao diện.

---

## 4. Kế Hoạch Quay Lui (Rollback Plan)
- Trước khi chỉnh sửa, tạo file backup:
  - `dh4hn-website/lms/index.html.bak_20261005_habit_guide`
  - `dh4hn-website/lms/app.js.bak_20261005_habit_guide`
  - `dh4hn-website/data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md.bak_20261005_habit_guide`
- Nếu có bất kỳ lỗi hiển thị nào, khôi phục lại các file gốc bằng lệnh copy `.bak` đè lại tức thì.

---

## 5. Ranh Giới Phê Duyệt (Approval Boundary)
- **Cấp độ 2 (Level 2):** Phê duyệt thực thi sửa file cục bộ theo Allowlist và chạy kiểm thử tự động (Local verification).
- **Cấp độ 3 (Level 3):** Phê duyệt riêng biệt sau khi kiểm thử cục bộ 100% PASS để commit và push lên production live Vercel.
