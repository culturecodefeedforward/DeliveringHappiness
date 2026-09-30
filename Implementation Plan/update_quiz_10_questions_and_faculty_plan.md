# Kế Hoạch Triển Khai & Báo Cáo Kiểm Thử: Thay Thế Quiz Chặng 1 (10 Câu) & Cập Nhật Ban Giảng Huấn LMS

## 1. Mục Tiêu & Nguồn Chuẩn (Source of Truth)
- **Yêu cầu từ User:**
  1. Thay thế bộ quiz Chặng 1 bằng tệp Excel chuẩn: `"G:\My Drive\download\DHM quiz 10 questions.xlsx"`.
  2. Bổ sung Anh Hưng, Vũ Khánh Linh và Hân vào danh sách giảng viên (tổng cộng 6 thành viên Ban Giảng Huấn).
  3. Cập nhật toàn diện tài liệu dự án (`/ck:docs update`) phản ánh đúng hiện trạng kỹ thuật LMS Engine v3.
  4. Chuẩn bị triển khai lên Vercel Production (`https://delivering-happiness.vercel.app/lms/`).
- **Nguồn dữ liệu chuẩn (Source of Truth):**
  - Tệp Excel: `G:\My Drive\download\DHM quiz 10 questions.xlsx` (Sheet: `Mini step 1`, 10 câu hỏi, thời gian 20s/câu, 4 đáp án).
  - CSDL Học viên & Giảng viên: 383 bản ghi từ DHM3 đến DHM9.
  - Ban Giảng Huấn 6 Giảng viên / Coach: Cô Hà Minh Châu, Thầy / Anh Hưng, Cô Hà Ngọc Hoàn, Thầy Vũ Hoàng, Cô / Chị Hân, Cô Vũ Khánh Linh.

---

## 2. Các Thay Đổi Đã Thực Hiện (Allowlist Scope)

### A. Phân Hệ LMS (`lms/`)
1. **`lms/curriculum_data.json`**:
   - Cập nhật tiêu đề: `"Bài 1.1: Khoa học Hạnh phúc & Bài Sát Hạch Đầu Vào (10 Câu)"`.
   - Thay thế toàn bộ mảng `quizzes` bằng 10 câu hỏi chuẩn hóa từ Sheet `Mini step 1` (id: `dhm-quiz-1` đến `dhm-quiz-10`).
   - Cập nhật `stage-2` hiển thị đầy đủ 6 giảng viên Ban Giảng Huấn.
2. **`lms/app.js`**:
   - Chuyển đổi tính toán ngưỡng đạt thành động: `${Math.ceil(quizzes.length * 0.7)}/${quizzes.length} câu (≥70%)`.
   - Cập nhật kiểm tra cổng chuyển chặng (`stage progression gate`) tại `btnNextLesson.onclick`: yêu cầu đạt tối thiểu 70% (7/10 câu) đối với học viên phổ thông.
   - Miễn trừ kiểm tra cổng sát hạch (`gate bypass`) cho 6 tài khoản Coach/BTC để phục vụ giảng dạy.
3. **`lms/index.html`**:
   - Cập nhật tiêu đề Bài 1.1 thành: `Bài Kiểm Tra Sát Hạch Đầu Vào (10 Câu)`.
   - Cập nhật hướng dẫn: `Yêu cầu đạt tối thiểu 7/10 câu (≥70%) sau tối đa 3 lần thử để đủ điều kiện lên lớp Offline.`
   - Bổ sung tên Thầy Hưng, Cô Hân, Cô Khánh Linh vào thẻ Ban Giảng Huấn Chặng 2.
4. **`lms/authorized_roster.json` & `lms/master_learners_roster.json`**:
   - Mở rộng CSDL lên 383 tài khoản học viên và 6 thành viên Ban Giảng Huấn (`isCoach = true`, PIN cấu hình bảo mật).

### B. Tài Liệu Dự Án (`docs/`)
1. **`dh4hn-website/docs/project-overview-pdr.md`**: Cập nhật FR-08 phản ánh LMS Blended Learning Engine v3 (383 học viên, 6 coaches, 10 quiz questions).
2. **`dh4hn-website/docs/codebase-summary.md`**: Cập nhật danh mục các tệp `lms/*` phản ánh đúng hiện trạng.
3. **`dh4hn-website/docs/project-roadmap.md`**: Bổ sung Phiên bản 4.0 (Tháng 09/2026) cho LMS Blended Engine v3 & Cổng Sát Hạch Đầu Vào.
4. **`dh4hn-website/docs/system-architecture.md`**: Bổ sung phân hệ Blended LMS Engine v3, quy chế sát hạch 10 câu, cơ chế lockout 3 lần thử.
5. **`Teaching DH/docs/DHM_BLENDED_LMS_STANDARDIZED_ARCHITECTURE.md`**: Chuẩn hóa toàn bộ kiến trúc 3 chặng, 10 câu trắc nghiệm đầu vào, CSDL 383 học viên và phân công chuyên môn 6 giảng viên.

---

## 3. Kết Quả Kiểm Thử Cục Bộ (Local Verification - 100% PASS)

1. **Kiểm tra cú pháp JavaScript & JSON:**
   - `node -c lms/app.js`: 0 lỗi cú pháp.
   - `lms/curriculum_data.json`: 100% hợp lệ, tải trọn vẹn 10 câu hỏi.
2. **Kịch bản mô phỏng kiểm thử (`scratch/test_quiz_10_simulation.py`):**
   - Đạt 10/10 câu: `100% -> passed = true` (Đủ điều kiện lên lớp Offline).
   - Đạt 7/10 câu: `70% -> passed = true` (Đủ điều kiện lên lớp Offline).
   - Đạt 6/10 câu: `60% -> passed = false` (Chưa đạt, còn lượt thử lại).
   - Đạt 0/10 câu: `0% -> passed = false` (Chưa đạt).
   - Hết 3 lượt thử: Khóa bài thi (`lockout`), thông báo liên hệ Coach/BTC.
   - Tài khoản Coach: Được miễn trừ cổng chuyển chặng, truy cập tự do vào Chặng 2 và Chặng 3.
3. **Kiểm tra độ dài tài liệu (Phase 3 Size Check):**
   - 100% các tệp tài liệu trong `docs/` đều dưới 800 dòng (tối đa 302 dòng).

---

## 4. Phương Án Quay Lui (Rollback Strategy)
- Nếu cần hoàn tác, khôi phục từ các bản sao lưu đã tạo:
  - `lms/curriculum_data.json.bak_20260930_quiz10`
  - `lms/app.js.bak_20260930_quiz10`
  - `lms/index.html.bak_20260930_quiz10`
  - Hoặc thực hiện lệnh Git: `git checkout -- lms/ docs/`
