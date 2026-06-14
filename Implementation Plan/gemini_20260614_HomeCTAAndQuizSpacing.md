# Kế hoạch Triển khai: Bổ sung CTA trang chủ & Tối ưu hóa khoảng cách hiển thị Assessment

- **Ngày tạo:** 14/06/2026
- **Tác giả:** Antigravity (AI Coding Assistant)
- **Dự án:** `dh4hn-website`
- **Đường dẫn dự án:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`

---

## 1. Đề bài & Hiện trạng (Goal & Current State)

### Đề bài (Goal)
1. Trên trang chủ (`index.html`), kế bên nút "Đăng ký ngay", tạo thêm nút "Kiểm tra 'Hệ điều hành Hạnh Phúc'" trỏ đến liên kết `https://delivering-happiness.vercel.app/assessment.html` cho cả 2 vị trí CTA (Hero Header ở đầu trang và Register Section ở cuối trang).
2. Tối ưu hóa kích thước chữ và khoảng cách (spacing/padding) trong tệp CSS khảo sát (`quiz.css`) để đảm bảo nút "Tiếp theo" hiển thị trực quan ngay trên màn hình ở chế độ thu phóng 100% (zoom 100%) mà không phải cuộn trang.

### Hiện trạng (Current State)
* Trang chủ chỉ có duy nhất nút hành động đăng ký. Cần thêm nút khảo sát bên cạnh để gia tăng chuyển đổi (lead generation).
* Chiều cao giao diện bài trắc nghiệm (`assessment.html` sử dụng `quiz.css`) đang quá lớn (~780px bao gồm cả feedback), vượt quá chiều cao màn hình phổ thông (ví dụ: viewport 630px-700px), khiến nút "Tiếp theo" bị đẩy xuống dưới nếp gấp trang (below the fold) sau khi người dùng chọn đáp án.

---

## 2. Giải pháp Kỹ thuật (Technical Solution)

### Phần 1: Thêm nút CTA trên trang chủ (`index.html`)
* **Hero Header (Dòng 70-77):**
  Bọc hai nút trong một thẻ `div` hàng ngang (`flex-direction: row; gap: 15px; flex-wrap: wrap; justify-content: center;`) để căn chỉnh song song.
  Nút mới:
  ```html
  <a href="https://delivering-happiness.vercel.app/assessment.html" class="btn-primary" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2);">Kiểm tra "Hệ điều hành Hạnh Phúc"</a>
  ```
* **Bottom CTA Section (Dòng 240-241):**
  Thực hiện căn lề tương tự. Nút mới:
  ```html
  <a href="https://delivering-happiness.vercel.app/assessment.html" class="btn-primary" style="background: transparent; color: var(--dark); border: 2px solid var(--dark); box-shadow: none;">Kiểm tra "Hệ điều hành Hạnh Phúc"</a>
  ```

### Phần 2: Thu nhỏ giao diện bài trắc nghiệm (`quiz.css`)
Cập nhật các thuộc tính định dạng trong `quiz.css` để giao diện nhỏ gọn và vừa vặn:
1. **Container & Header:**
   * `.quiz-container`: padding giảm từ `30px 40px` xuống `20px 25px`.
   * `.quiz-header`: chuyển sang `flex-direction: row; gap: 15px; margin-bottom: 15px;` để đưa logo và tiêu đề lên cùng một hàng.
   * `.quiz-logo`: giảm chiều cao từ `80px` xuống `40px` và bỏ `margin-bottom`.
2. **Progress & Question:**
   * `.quiz-progress`: giảm `margin-bottom` từ `30px` xuống `15px`.
   * `.quiz-question-tag`: giảm `margin-bottom` từ `15px` xuống `8px`.
   * `.quiz-question-text`: giảm font từ `1.4rem` xuống `1.15rem`, `margin-bottom` từ `30px` xuống `15px`.
3. **Options & Next Button:**
   * `.quiz-options`: giảm khoảng cách `gap` từ `15px` xuống `8px`.
   * `.quiz-option`: giảm `padding` từ `18px 24px` xuống `10px 16px`, giảm font từ `1.05rem` xuống `0.95rem`.
   * `.quiz-feedback`: giảm `margin-top` từ `25px` xuống `15px`, `padding` từ `20px` xuống `12px`.
   * `.btn-quiz-next`: giảm `margin-top` từ `30px` xuống `15px`, `padding` từ `16px` xuống `12px`.

---

## 3. Các Tệp bị Ảnh hưởng (Affected Files)

1. **[MODIFY] [index.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html):** Thêm nút CTA khảo sát.
2. **[MODIFY] [quiz.css](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/quiz.css):** Thu nhỏ kích thước giao diện.
3. **[NEW] [gemini_20260614_HomeCTAAndQuizSpacing.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260614_HomeCTAAndQuizSpacing.md):** Kế hoạch triển khai này.

---

## 4. Rủi ro Tiềm ẩn & Hướng xử lý (Risks & Mitigations)

* **Rủi ro 1: Phá vỡ tính responsive của nút trên thiết bị di động.**
  * *Hướng xử lý:* Thêm `flex-wrap: wrap` vào container hàng của 2 nút để tự động xuống dòng thành cột đứng trên màn hình nhỏ.
* **Rủi ro 2: Giao diện quiz bị chen chúc khó đọc.**
  * *Hướng xử lý:* Việc đưa logo và tiêu đề lên cùng một hàng và thu nhỏ nhẹ cỡ chữ vẫn đảm bảo tỷ lệ hiển thị và tính premium của UI.

---

## 5. Kịch bản Kiểm thử Nghiệm thu (UAT Verification Plan)

* **Trình duyệt tự động (E2E UAT):** Dùng Browser Tool truy cập `assessment.html` để chụp ảnh màn hình ở độ phân giải tiêu chuẩn, kiểm tra nút "Tiếp theo" có hiển thị trực tiếp mà không cần cuộn trang.
* **Kiểm tra DOM:** Xác nhận sự hiện diện của 2 nút mới trên trang chủ.

---

## 6. Auditor Review (Đánh giá của Codex)

*Để trống cho Codex rà soát.*
