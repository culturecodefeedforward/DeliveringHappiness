# UAT Report: UI Reconciliation (Round 1/3 - Gemini cook)
**Ngày thực hiện:** 07/07/2026
**Thực hiện bởi:** Gemini Coding Agent
**Mục tiêu:** Đồng bộ, tối ưu hóa giao diện và dọn dẹp các nhãn user-facing `BTC` lỗi thời trên toàn bộ hệ thống landing pages & forms.

---

## 1. Ma Trận Kiểm Chứng Bề Mặt (Surface Verification Matrix)

| Bề mặt kiểm chứng (Verification Surface) | Phương pháp kiểm chứng (Method) | Kết quả kỳ vọng (Expected Output) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- |
| **Local files** | So sánh git diff và kiểm tra tĩnh với mã nguồn | Các file logic cục bộ không chứa thông tin ngày cũ và nhãn `BTC` user-facing. Liên kết CSS ngoài thành công. | **VERIFIED** |
| **Apps Script deployment** | N/A (Local scope only) | N/A | **UNVERIFIED** |
| **Public frontend URLs** | N/A (Chưa Vercel deploy) | N/A | **UNVERIFIED** |
| **Browser evidence** | Kiểm thử bằng Chromium (Playwright) trên 3 viewports (`1366x768`, `390x844`, `375x667`) | Giao diện hiển thị chính xác, touch target option cards >= 48px, có chỉ báo icon đúng/sai rõ ràng, responsive mượt mà không tràn ngang. | **VERIFIED** |
| **Final verdict** | Đối chiếu toàn diện ma trận | Tất cả bề mặt đều PASS | **UNVERIFIED** (Chờ deploy & verify URL live) |

---

## 2. Chi Tiết Các Thay Đổi & Kết Quả Kiểm Chứng Cục Bộ (Local Verification Details)

### 2.1 Trang Chủ (`index.html`, `styles.css`, `script.js`)
- **Nội dung thay đổi:**
  - Cập nhật thời gian học DHM8 thành `08:00 - 18:00, Thứ Bảy 18/07/2026` và DHM9 Hà Nội thành `08:00 - 18:00, Thứ Bảy 22/08/2026` (loại bỏ chữ "Đang cập nhật").
  - Tích hợp logo nền tối `assets/culturecode-logo-dark.jpg` vào Hero section và dọn dẹp logo trùng lặp tại nav bar.
  - Loại bỏ CSS inline `grid-template-columns` ở cấp độ HTML của `.levels-grid`.
  - Cập nhật `.levels-grid` và `.topics-list` trong `styles.css` để responsive mượt mà trên mobile, căn chỉnh flex wrap cân đối trên desktop (dạng 3+2 và căn giữa) và không kéo dãn chiều cao khi mở rộng.
  - Sửa `script.js` thêm `list.replaceChildren()` để đảm bảo idempotency không bị lặp các mục khi render lại.
- **Bằng chứng trình duyệt (Screenshots):**
  - [index_desktop.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/index_desktop.png)
  - [index_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/index_mobile.png)
  - [index_small_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/index_small_mobile.png)

### 2.2 Trang Đăng Ký DHM8 & DHM9 Hà Nội (`register.html`, `register_dh9_hanoi.html`, `register.css`, `register.js`, `register_dh9.js`)
- **Nội dung thay đổi:**
  - Tách toàn bộ CSS style nội bộ khổng lồ sang tệp ngoài `register.css` dùng chung cho cả 2 trang, giảm thiểu trùng lặp mã nguồn.
  - Đổi logo sang bản nền sáng `assets/culturecode-logo-light.jpg` phù hợp với màu nền sáng của form.
  - Sửa thứ ngày sự kiện DHM9 Hà Nội thành "Thứ Bảy, 22/08/2026" (đồng bộ với trang chủ).
  - Thay thế toàn bộ nhãn `BTC` phía người dùng thành `CultureCode Team` / `Ban tổ chức` (trong các placeholder điện thoại, trust note bảo mật thông tin, accordion tiêu đề phụ và success modal).
  - **Bảo toàn hoàn toàn** biến môi trường, event IDs (`DHM8_REG_180726`, `DHM9_REG_220826_HN`), logic gửi form của từng luồng và cấu hình `window.DHM9_ENABLE_FETCH_STATUS = true`.
- **Bằng chứng trình duyệt (Screenshots):**
  - [register_desktop.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/register_desktop.png)
  - [register_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/register_mobile.png)
  - [register_small_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/register_small_mobile.png)
  - [register_dh9_hanoi_desktop.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/register_dh9_hanoi_desktop.png)
  - [register_dh9_hanoi_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/register_dh9_hanoi_mobile.png)
  - [register_dh9_hanoi_small_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/register_dh9_hanoi_small_mobile.png)

### 2.3 Trang Trắc Nghiệm (`assessment.html`, `quiz.css`, `quiz.js`)
- **Nội dung thay đổi:**
  - Không trùng lặp cấu trúc HTML, dọn dẹp thẻ meta.
  - Sử dụng logo nền tối `assets/culturecode-logo-dark.jpg` phù hợp với màu nền trang tối `#0f172a`.
  - Tăng Touch Target của `.quiz-option` lên tối thiểu `48px` (padding `12px 16px` kết hợp `min-height: 48px`) giúp người dùng mobile dễ dàng chạm bấm lựa chọn.
  - Thêm chỉ báo đúng/sai trực quan rõ ràng qua văn bản/biểu tượng (thêm hậu tố pseudoelement `✓` và `✗` tương ứng với mỗi lựa chọn khi được trả lời) bên cạnh phong cách màu sắc nền để nâng cao tính khả dụng (accessibility).
  - Tối ưu hóa padding của container trên mobile dưới `480px` để tránh bị tràn ngang màn hình hẹp `375px`.
  - Bố trí CTA đăng ký tinh tế ở cuối trang sau khi hoàn tất câu hỏi mà không ép buộc người dùng quá sớm.
- **Bằng chứng trình duyệt (Screenshots):**
  - [assessment_desktop.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/assessment_desktop.png)
  - [assessment_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/assessment_mobile.png)
  - [assessment_small_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/assessment_small_mobile.png)

### 2.4 Trang Quan Tâm (`interest.html`, `interest_dh9.html`)
- **Nội dung thay đổi:**
  - Cập nhật logo mới trong phần navbar `assets/culturecode-logo-dark.jpg` đồng bộ.
  - Thay thế chữ `BTC` thành `Ban tổ chức` / `CultureCode Team` trong phần mô tả và placeholder.
  - Bảo toàn hoàn toàn logic submit form và link Apps Script `window.CUSTOM_WEBAPP_URL` tương ứng cho mỗi trang.
- **Bằng chứng trình duyệt (Screenshots):**
  - [interest_desktop.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/interest_desktop.png)
  - [interest_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/interest_mobile.png)
  - [interest_small_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/interest_small_mobile.png)
  - [interest_dh9_desktop.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/interest_dh9_desktop.png)
  - [interest_dh9_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/interest_dh9_mobile.png)
  - [interest_dh9_small_mobile.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/ui_reconcile_20260707_gemini/interest_dh9_small_mobile.png)

---

## 3. Đánh Giá Tác Động Tài Liệu (Docs Impact Assessment)

**Docs impact:** `none`
- **Lý do:** Các thay đổi thuần túy liên quan đến cải thiện giao diện hiển thị (CSS, responsive layout, touch target size, logo asset path, dọn dẹp nhãn chữ hiển thị) trên frontend. Các luồng nghiệp vụ cốt lõi, tích hợp API, cổng thanh toán SePay, database và luồng email không bị thay đổi. Cấu trúc hoạt động của ứng dụng vẫn tuân thủ đúng các tài liệu thiết kế hệ thống hiện có.

---

## 4. Kế Hoạch Tiếp Theo & Phân Định Ranh Giới (Next Steps & Boundary)

1. **Local Hardening & Audit:** (Hoàn tất)
   - Tất cả mã nguồn in-scope đã được hiệu chỉnh sạch sẽ, không có lỗi thụt lề hay khoảng trắng thừa.
   - Thư mục UAT Screenshots được tổ chức ngăn nắp chứa đầy đủ 18 ảnh minh họa trên 3 viewports.
2. **Handoff sang Round 2/3 (Stage & Commit):**
   - Chờ phê duyệt của người dùng để chuyển tiếp kết quả sang Agent tiếp theo (Codex/Claude) thực hiện công việc stage/commit và deploy kiểm nghiệm trên Staging URL.
