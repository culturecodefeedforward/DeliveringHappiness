# Kế Hoạch & Báo Cáo Triển Khai: Tích Hợp 20 Câu Hỏi Sát Hạch Đầu Vào (Blended Learning Quiz Gate)

- **Dự án:** `dh4hn-website` (LMS Delivering Happiness)
- **Thời gian thực hiện:** 29/09/2026
- **Nguồn dữ liệu trắc nghiệm:** `G:\My Drive\download\DHM quiz 20 questions.xlsx`
- **Nguồn quy chế & thuật ngữ:** `Teaching DH\transcript_hop_chau_linh_25092026.txt` (Phút `[18:20]`, `[19:11]`, `[85:36]`)

---

## 1. Bối Cảnh & Mục Tiêu

Hệ thống LMS không chỉ phục vụ cựu học viên ôn tập mà là **Nền tảng Blended Learning (Học tập kết hợp) 3 Chặng**:
- **Chặng 1 (Online):** Học viên nghiên cứu tài liệu, video, audio nền tảng. Kết thúc chặng, học viên bắt buộc phải vượt qua bài kiểm tra sát hạch đầu vào (Pass test ≥ 70%, tương đương tối thiểu 14/20 câu đúng) sau tối đa 3 lần thử để đủ điều kiện (qualify) bước vào Lớp Offline Chặng 2.
- **Chặng 2 (Offline):** Thực hành chuyên sâu tại lớp cùng Ban Giảng Huấn.
- **Chặng 3 (Action Learning):** Rèn luyện thói quen và duy trì chuyển hóa sau khóa học.

---

## 2. Các Thay Đổi Kỹ Thuật Đã Triển Khai

1. **Trích xuất CSDL Trắc nghiệm:**
   - Đọc 20 câu hỏi trắc nghiệm từ tệp Excel Blooket template sang định dạng JSON chuẩn.
   - Mỗi câu gồm: `id`, `question`, `options` (4 lựa chọn), `correctIndex` (0-3), `timeLimit` (20 giây), `explanation`.
   - Nạp vào `curriculum_data.json` tại `stage-1` -> Module 1.1 (`mod-1-1`).

2. **Giao diện Người dùng (`lms/index.html`):**
   - Đổi tiêu đề: *Bài 1.1: Bài Kiểm Tra Sát Hạch Đầu Vào (20 Câu)*.
   - Thêm phần giải thích quy chế đạt ≥ 70% sau tối đa 3 lần thử.
   - Bổ sung huy hiệu theo dõi lượt thử: `#quiz-attempt-badge` (`Lần thử: 0/3`).
   - Bổ sung container hiển thị tổng kết & nút thử lại: `#quiz-summary-container`.

3. **Logic Xử Lý & Khóa Chuyển Chặng (`lms/app.js`):**
   - Tính toán tỷ lệ phần trăm chính xác theo công thức: `Math.round((correct / 20) * 100)`.
   - Đạt (≥ 70%): Hiện thông báo chúc mừng xanh lá, ghi nhận `passed = true`.
   - Chưa đạt (< 70%) & còn lượt (< 3): Hiện cảnh báo màu hổ phách, hiển thị nút *🔄 Thử lại lần X+1/3*. Bấm nút sẽ reset câu trả lời để làm lại và cuộn mượt lên đầu bài thi.
   - Hết 3 lượt (< 70%): Khóa toàn bộ các nút chọn, đổi giao diện sang màu đỏ, hướng dẫn học viên liên hệ Coach để được hướng dẫn ôn tập.
   - Cổng kiểm soát chuyển chặng (`btnNextLesson.onclick`): Chặn học viên phổ thông bấm "Hoàn thành & Tiếp tục" nếu chưa vượt qua bài sát hạch (trừ tài khoản Coach/Admin được xem trước).

4. **Chuẩn Hóa Danh Xưng Ban Giảng Huấn:**
   - **Cô Hà Ngọc Hoàn** (Facilitator / BTC) — Email: `hoanhn.edu.vn@gmail.com` | Mã PIN: `3505`.
   - **Cô / Chị Hà Minh Châu** (Lead Facilitator) — Email: `chauhm71@gmail.com` | Mã PIN: `8888`.
   - **Thầy Vũ Hoàng** (Facilitator) — Email: `vuhoang2708@gmail.com` | Mã PIN: `3145`.

---

## 3. Kết Quả Kiểm Thử Mô Phỏng Cục Bộ (8/8 PASS)

- [x] **PASS 1:** CSDL chứa đủ 20 câu hỏi trắc nghiệm thực tế từ tệp Excel.
- [x] **TEST 1:** Làm dở dang 10/20 câu -> Chưa hoàn thành (`isCompleted = false`), chưa đạt (`passed = false`).
- [x] **TEST 2:** Làm đúng 13/20 câu (65%) -> Chưa đạt tiêu chuẩn 70%, hiển thị nút Thử lại lần 2.
- [x] **TEST 3:** Làm đúng 14/20 câu (70%) -> Đạt tiêu chuẩn đầu vào, ẩn nút Thử lại, cấp quyền Qualify.
- [x] **TEST 4:** Làm đúng 20/20 câu (100%) -> Đạt điểm tuyệt đối, cấp quyền Qualify.
- [x] **TEST 5:** Lần 3 không đạt (65%) -> Bị khóa (Lockout), không cho thử lại lần 4, yêu cầu liên hệ Coach.
- [x] **TEST 6:** Học viên phổ thông chưa đạt bài test -> Bị chặn không thể bấm "Hoàn thành & Tiếp tục" Chặng 1.
- [x] **TEST 7:** Học viên đạt bài test -> Được phép bấm hoàn thành Chặng 1 để sang Chặng 2.
- [x] **TEST 8:** Tài khoản Coach/Admin -> Được phép duyệt qua các chặng để kiểm tra nội dung bài giảng.
