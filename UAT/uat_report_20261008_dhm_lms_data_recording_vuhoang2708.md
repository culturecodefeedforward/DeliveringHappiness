# BÁO CÁO KIỂM THỬ NGHIỆM THU E2E: GHI NHẬN DỮ LIỆU & BẢO MẬT TÀI KHOẢN VUHOANG2708@GMAIL.COM

- **Ngày thực hiện:** 08/10/2026
- **Mã kế hoạch tham chiếu:** `UAT-DHM-LMS-DATA-PERSISTENCE-20261008`
- **Dự án:** Teaching DH (`dhm-micro-lms`)
- **Tài khoản kiểm thử:** `vuhoang2708@gmail.com` (Vũ Hoàng - BTC / Coach)
- **Claim level:** `Local done` (Kiểm chứng toàn trình 100% bằng tự động hóa Playwright Chromium Headless trên máy chủ cục bộ)
- **Tập tin kiểm thử:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\test_data_recording_vuhoang.py`
- **Tập tin đã khắc phục & tối ưu:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js`
- **Tập tin sao lưu an toàn:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js.bak_20261008_identity_fix`

---

## 1. TỔNG QUAN KẾT QUẢ NGHIỆM THU (EXECUTIVE SUMMARY)

Đã hoàn thành kiểm thử tự động hóa toàn trình (E2E) trên trình duyệt cho tài khoản `vuhoang2708@gmail.com`. Tất cả 7 bước kiểm thử bao gồm: nhận diện danh tính, xác thực mật khẩu SĐT, tự đổi mật khẩu cá nhân lưu băm SHA-256, ghi nhận dữ liệu thực hành Chặng 1, 2, 3 và kiểm chứng tính bền bỉ lưu trữ sau khi tải lại trang (`page reload`) đều **ĐẠT 100% (PASS)**.

| STT | Hạng Mục Kiểm Thử | Trạng Thái | Chi Tiết Nghiệm Thu Thực Tế |
| :---: | :--- | :---: | :--- |
| **01** | **Nhận diện & Đăng nhập ban đầu** | **PASS 100%** | Nhận diện chính xác tên "Vũ Hoàng", phân nhóm "BTC / Coach". Đăng nhập thành công bằng 4 số cuối SĐT (`3145`). Hiển thị `#user-chip` với avatar "VH". |
| **02** | **Tự đổi mật khẩu & Bảo mật Hash** | **PASS 100%** | Mở modal `#self-change-pwd-modal`; bắt lỗi khi nhập sai mật khẩu hiện tại; cập nhật mật khẩu mới `Hoang#2026` thành công; lưu chuỗi băm SHA-256 (64 ký tự) vào `localStorage.dhm_roster_overrides`; đăng xuất & từ chối mật khẩu cũ `3145`; đăng nhập thành công với `Hoang#2026`. |
| **03** | **Ghi nhận dữ liệu Chặng 1 (Pre-Class)** | **PASS 100%** | Lưu phản tư I•A•M Bài 1.1; chọn 3 giá trị La Bàn Me Values ("Tiến bộ", "Sự chính trực", "Hợp tác"); lưu I•A•M Bài 1.3; trả lời đúng 10/10 câu trắc nghiệm Cổng Vượt Chặng (Bài 1.4); điểm số 100% ĐẠT; ghi danh bạ học viên `dhm_master_learners_directory`. |
| **04** | **Ghi nhận dữ liệu Chặng 2 (Workshop Live)** | **PASS 100%** | Chuyển sang Chặng 2; nhập liệu bài tập Biết ơn (Gratitude); nhập liệu Capstone IAM; bấm `#btn-sync-workshop`; kiểm chứng dữ liệu được ghi vào `localStorage.stageData["stage-2"]`. |
| **05** | **Ghi nhận dữ liệu Chặng 3 (Habit Tracker)** | **PASS 100%** | Chuyển sang Chặng 3; tích chọn điểm danh Ngày 1 (Mindfulness & Gratitude); nhập và lưu bài tập phản tư ABCDE hôm nay; dữ liệu ghi nhận đầy đủ trong `localStorage.stageData["stage-3"]`. |
| **06** | **Kiểm chứng tính bền bỉ sau Reload** | **PASS 100%** | Thực hiện `page.reload()`; phiên đăng nhập duy trì nguyên vẹn; Chặng 1 giữ 100% điểm thi Cổng Vượt Chặng và 3 giá trị Me Values; Chặng 3 giữ nguyên tích xanh điểm danh Ngày 1. |

---

## 2. PHÁT HIỆN LỖI KỸ THUẬT & GIẢI PHÁP ĐÃ XỬ LÝ (BUG FIXES)

Trong quá trình chạy kiểm thử tự động, hệ thống đã phát hiện một khiếm khuyết tiềm ẩn trong `app.js`:
- **Vấn đề:** Khi học viên đăng nhập từ `authorized_roster.json` (vốn chỉ chứa các trường `name`, `email`, `phone`, `cohort`, `role`), hàm `findLearner()` không khởi tạo trường `identity`. Dẫn đến việc các hàm `applyUserSession()` và `saveLearnerProgress()` sử dụng khóa lưu trữ `dhm_lms_progress_${currentUser.identity}` bị suy biến thành `dhm_lms_progress_undefined`, gây nguy cơ xung đột dữ liệu giữa các học viên khác nhau trên cùng một trình duyệt.
- **Giải pháp đã xử lý:**
  1. Cập nhật `findLearner()`: Bổ sung tường minh `identity: match.email || match.phone || match.learner_id` và `role: match.role || "Learner"`.
  2. Cập nhật `applyUserSession()` & `saveLearnerProgress()`: Thêm cơ chế bảo vệ dự phòng `if (!currentUser.identity) currentUser.identity = currentUser.email || currentUser.learner_id || "guest";`.
  3. Cập nhật `recordLearnerInDirectory()`: Hỗ trợ tìm kiếm học viên linh hoạt theo cả `email` lẫn `identity`, lưu trữ đầy đủ `identity` trong danh bạ quản trị.

---

## 3. DANH SÁCH ẢNH CHỤP MINH CHỨNG (SCREENSHOT EVIDENCE)

Tất cả 6 ảnh chụp màn hình độ phân giải 1280x850 đã được xuất và lưu trữ tại thư mục `UAT/screenshots`:

1. `uat_vuhoang_01_login_success.png`: Minh chứng đăng nhập thành công bằng 4 số cuối SĐT `3145`, hiển thị danh tính "Vũ Hoàng".
2. `uat_vuhoang_02_password_changed_relogin.png`: Minh chứng đổi mật khẩu thành công sang `Hoang#2026`, đăng xuất và đăng nhập lại bằng mật khẩu mới.
3. `uat_vuhoang_03_stage1_data_recorded.png`: Minh chứng Chặng 1 đạt 10/10 câu trắc nghiệm Cổng Vượt Chặng, 3 giá trị Me Values đã chọn và bài tập phản tư I•A•M.
4. `uat_vuhoang_04_stage2_data_recorded.png`: Minh chứng Chặng 2 lưu bài tập 5 Thói quen & Capstone IAM qua nút `#btn-sync-workshop`.
5. `uat_vuhoang_05_stage3_data_recorded.png`: Minh chứng Chặng 3 điểm danh Ngày 1 (Chánh niệm & Biết ơn) và lưu bài tập ABCDE hôm nay.
6. `uat_vuhoang_06_reload_persistence_verified.png`: Minh chứng sau khi reload trang, phiên đăng nhập và 100% tiến độ học tập các chặng vẫn được giữ nguyên vẹn.

---

## 4. KẾT LUẬN & ĐỀ XUẤT TIẾP THEO

- **Kết luận:** Hệ thống LMS đã vận hành trơn tru, bảo mật cao, phân tách danh tính độc lập và lưu trữ dữ liệu an toàn trên trình duyệt cho tài khoản cá nhân của giảng viên `vuhoang2708@gmail.com`.
- **Đề xuất tiếp theo:** Sẵn sàng cho việc đồng bộ mã nguồn lên Git repository và triển khai phát hành phiên bản mới nếu có yêu cầu từ cấp quản lý.
