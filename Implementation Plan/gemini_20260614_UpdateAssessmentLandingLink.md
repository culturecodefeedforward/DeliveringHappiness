# Kế hoạch Triển khai: Cập nhật đường dẫn Landing Page DHM8 trong assessment.html

- **Ngày tạo:** 14/06/2026
- **Tác giả:** Antigravity (AI Coding Assistant)
- **Dự án:** `dh4hn-website`
- **Đường dẫn dự án:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`

---

## 1. Đề bài & Hiện trạng (Goal & Current State)

### Đề bài (Goal)
* Cập nhật đường dẫn hành động "Xem thông tin chương trình" trong màn hình kết quả đánh giá (`assessment.html`) từ trang chủ mặc định (`index.html`) trỏ sang trang Landing Page chính thức của chương trình DHM8 (`dh8/index.html`).

### Hiện trạng (Current State)
* Trong tệp `assessment.html`, phần nút hành động ở cuối bài trắc nghiệm (`summary-actions`) đang có nút:
  ```html
  <a href="index.html" class="btn-primary" ...>Xem thông tin chương trình</a>
  ```
  Nút này đang trỏ về trang chủ cũ của website (`index.html`). Theo yêu cầu của người dùng, nút này cần được trỏ về trang Landing Page chính thức của khóa DHM8 nằm trong thư mục `/dh8` (`dh8/index.html`).

---

## 2. Giải pháp Kỹ thuật (Technical Solution)

* Sửa đổi tệp `assessment.html` để cập nhật thuộc tính `href` của thẻ `<a>` hành động:
  ```html
  <a href="dh8/index.html" class="btn-primary" ...>Xem thông tin chương trình</a>
  ```

---

## 3. Các Tệp bị Ảnh hưởng (Affected Files)

1. **[MODIFY] [assessment.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/assessment.html):** Thay đổi đường dẫn liên kết của nút xem thông tin chương trình.
2. **[NEW] [gemini_20260614_UpdateAssessmentLandingLink.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260614_UpdateAssessmentLandingLink.md):** Tệp kế hoạch này.

---

## 4. Rủi ro Tiềm ẩn & Hướng xử lý (Risks & Mitigations)

* **Rủi ro 1: Đường dẫn tương đối không chính xác.**
  * *Hướng xử lý:* Do `assessment.html` nằm ở thư mục root, đường dẫn trỏ đến `dh8/index.html` là đường dẫn tương đối hoàn toàn chính xác.
* **Chưa phát hiện rủi ro nào khác đáng kể.**

---

## 5. Kịch bản Kiểm thử Nghiệm thu (UAT Verification Plan)

* **Kiểm tra tĩnh DOM (DOM Static Verification):** Chạy kịch bản kiểm tra xem thuộc tính `href` của nút xem thông tin chương trình đã được đổi sang `dh8/index.html` hay chưa.

---

## 6. Auditor Review (Đánh giá của Codex)

*Để trống cho Codex rà soát.*
