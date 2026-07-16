# Thiết kế Hệ thống: Trang thực hành Lạc quan ABCDE Tương tác
*Dự án: Delivering Happiness (dh4hn-website)*
*Tính năng: Trang thực hành trích xuất từ Slide bài giảng qua mã QR*

---

## 1. Yêu cầu Nghiệp vụ & Trải nghiệm Người dùng (UX)

### A. Quy trình sử dụng (User Flow)
1. **Quét QR / Truy cập:** Học viên quét mã QR trên slide bài giảng, truy cập vào `https://<domain>/practice-abcde.html`.
2. **Chọn tình huống (Select Case):** Giao diện hiển thị danh sách các tình huống (ví dụ: 18 case study từ thư viện tri thức). Học viên chọn 1 tình huống phù hợp.
3. **Phân tích Nghịch cảnh (A):** Hệ thống chỉ hiển thị duy nhất phần **A — Nghịch cảnh (Adversity)** của tình huống đó để học viên đọc hiểu bối cảnh.
4. **Tự thực hành điền (Input Form):** Hệ thống hiển thị 4 ô nhập liệu để học viên tự điền theo cách hiểu của mình:
   - **B — Niềm tin tiêu cực (Belief)**
   - **C — Hậu quả (Consequence)**
   - **D — Phản biện (Disputation)**
   - **E — Năng lượng mới & Hành động (Effect & Energy)**
5. **Gửi bài & Đối chiếu (Submit & Compare):** Học viên bấm nút **"Xem Gợi ý & Đối chiếu"**.
6. **Hiển thị Kết quả:** Hệ thống hiển thị song song hai cột:
   - **Cột trái (Bài làm của bạn):** Hiện lại nội dung học viên vừa tự điền.
   - **Cột phải (Gợi ý áp dụng chuẩn):** Hiện nội dung B-C-D-E chuẩn đã được lưu sẵn trong thư viện tri thức để học viên đối chiếu, tự đúc kết bài học.
7. **Làm lại / Chọn case khác:** Nút bấm cho phép xóa sạch dữ liệu và chọn case study khác để tiếp tục thực hành.

---

## 2. Giải pháp Kiến trúc & Kỹ thuật (Technical Design)

### A. Frontend (practice-abcde.html & practice-abcde.js)
* **Giao diện:** Thiết kế theo phong cách Glassmorphism (nền mờ sang trọng, tối giản, font chữ Be Vietnam Pro). Tương thích hoàn hảo trên các dòng điện thoại thông minh (do học viên chủ yếu quét QR bằng điện thoại).
* **Nguồn dữ liệu:** Sử dụng hàm `fetch()` tải trực tiếp file JSON tĩnh `data/artifacts/knowledge_base_abcde.json`.
* **Cơ chế phân tách A-B-C-D-E:** 
  Vì file JSON lưu gộp các phần vào trường `text` của metadata, Javascript sẽ sử dụng các biểu thức chính quy (Regex) để bóc tách thành các phần riêng biệt khi học viên chọn case:
  - `A (Adversity - Nghịch cảnh):` -> Nghịch cảnh A
  - `B (Belief - Niềm tin tiêu cực):` -> Niềm tin B
  - `C (Consequence - Hậu quả):` -> Hậu quả C
  - `D (Disputation - Phản biện):` -> Phản biện D
  - `E (Effect - Kết quả/Năng lượng mới):` -> Năng lượng mới E

### B. Slide & QR Code Integration
* **Đường dẫn URL tạo QR:** `https://deliveringhappiness.vercel.app/practice-abcde.html` (hoặc domain custom của sếp).
* **Vị trí tích hợp:** Bổ sung slide hướng dẫn thực hành ABCDE trong tài liệu slide giảng dạy, chèn QR code nổi bật ở góc phải slide.

---

## 3. Các tệp tin ảnh hưởng (Files Affected)

### 🆕 Tạo mới (New Files)
1. `[NEW]` [practice-abcde.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/practice-abcde.html): Khung giao diện trang thực hành.
2. `[NEW]` [practice-abcde.css](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/practice-abcde.css): Stylesheet riêng biệt cho trang thực hành (thiết kế cao cấp, responsive).
3. `[NEW]` [practice-abcde.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/practice-abcde.js): Logic load JSON, Regex parsing dữ liệu, xử lý sự kiện hiển thị so sánh.

---

## 4. Kế hoạch Kiểm thử (Verification Plan)
* **Kiểm thử cục bộ (Local UAT):** Chạy thử file html trên trình duyệt local, kiểm tra load 18 case study, bóc tách chính xác trường A, hiển thị form, submit và so sánh đúng cột dữ liệu.
* **Responsive Test:** Test giao diện trên thiết bị di động (iPhone/Android qua Chrome DevTools Mobile Viewport).
* **Deploy & Public Test:** Đẩy code lên live, quét QR thực tế bằng điện thoại để nghiệm thu.

---

Sếp vui lòng xem qua Thiết kế trên. Hãy phản hồi **"Approve"**, **"Đồng ý"** hoặc **"OK"** để tôi bắt đầu lập trình chi tiết nhé!
