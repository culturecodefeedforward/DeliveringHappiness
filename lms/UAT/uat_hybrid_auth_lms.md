# BÁO CÁO KIỂM THỬ NGHIỆM THU (UAT REPORT)
# MÔ HÌNH ĐĂNG NHẬP LAI (HYBRID AUTH MODEL) CHO LMS

- **Dự án**: Delivering Happiness LMS (`dh4hn-website/lms`)
- **Ngày thực hiện**: 03/10/2026
- **Trạng thái**: ✅ **LOCAL PASS (100% Tiêu chí Đạt)**
- **Kế hoạch gốc tham chiếu**: `lms/Implementation Plan/plan_20261003_hybrid_auth_lms.md`
- **Mã kịch bản kiểm thử**: `lms/UAT/test_hybrid_auth_simulation.js`

---

## 1. MỤC TIÊU & BỐI CẢNH KIỂM THỬ

1. **Khóa hoàn toàn lỗ hổng bảo mật**: Loại bỏ đoạn mã `if (id.includes("@"))` tự cấp quyền lớp `DHM9-TựPhụcVụ` trước đây vốn cho phép người lạ nhập email và số điện thoại bất kỳ để vào học trọn vẹn cả 3 Chặng.
2. **Phân luồng định danh 2 nhóm người dùng**:
   - **Học viên Chính thức (Official Learners)**: Kiểm tra đối chiếu với danh bạ Roster (`master_learners_roster.json`). Đăng nhập nhanh 3 giây bằng Email + 4 số cuối SĐT. Mở khóa toàn bộ Chặng 1, 2, 3 sau khi vượt Cổng Vượt Chặng (≥70%).
   - **Người mới / Email lạ (Trial Learners)**: Tự động chuyển sang form yêu cầu **Magic Link học thử qua Email**. Sau khi bấm link xác thực (`?token=...&action=verify`), cấp quyền `isTrial: true` và **CHỈ ĐƯỢC HỌC CHẶNG 1 (Pre-Class 90 phút)**.
3. **Cơ chế Khóa Cứng (Strict Lockout)**: Tài khoản `isTrial` bị khóa hoàn toàn Chặng 2 (Workshop Offline 2 ngày) và Chặng 3 (21 Ngày Nuôi Dưỡng 5 Thói Quen). Nếu nhấp vào bài học Chặng 2/3 hoặc hoàn thành Chặng 1, hệ thống hiển thị `#trial-upgrade-modal` giải thích đặc quyền và dẫn tới trang đăng ký khóa học chính thức (`/program-interest.html`).

---

## 2. MA TRẬN KẾT QUẢ KIỂM THỬ (UAT TEST MATRIX)

| Mã Test | Hạng mục Kiểm thử | Kịch bản Thực hiện | Kết quả Kỳ vọng | Kết quả Thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | **Tra cứu Học viên Chính thức** | Nhập email đã đóng tiền có trong Roster | Khớp Roster, hiển thị ô mật khẩu 4 số cuối SĐT | Khớp chính xác, yêu cầu 4 số cuối SĐT | ✅ **PASS** |
| **TC-02** | **Xác thực Mật khẩu Học viên** | Nhập 4 số cuối SĐT khớp dữ liệu | Đăng nhập thành công, nạp lộ trình 3 Chặng | Đăng nhập thành công, vào Chặng 1 | ✅ **PASS** |
| **TC-03** | **Chặn Email lạ & Bật Form Trial** | Nhập email lạ không có trong Roster | Ẩn ô mật khẩu, hiển thị form thông tin nhận Magic Link | Form Họ tên, SĐT 10 số, Consent NĐ 13 hiển thị | ✅ **PASS** |
| **TC-04** | **Yêu cầu Magic Link Trial** | Nhập Họ tên, 10 số điện thoại, tích Consent, bấm gửi | Gửi POST tới Webhook CRM, trả về đếm ngược 60s | Nút gửi chuyển cooldown 60s, hiện banner xanh | ✅ **PASS** |
| **TC-05** | **Xác thực Magic Link URL** | Truy cập URL kèm `?token=...&action=verify` | Cấp phiên `currentUser.isTrial = true`, mở Chặng 1 | Phiên lưu `localStorage`, mở Chặng 1 thành công | ✅ **PASS** |
| **TC-06** | **Khóa cứng Chặng 2/3 với Trial** | Tài khoản `isTrial` click Chặng 2 hoặc Chặng 3 | Chặn truy cập, hiển thị `#trial-upgrade-modal` | Bật Modal Nâng Cấp Amber Corporate Minimalist | ✅ **PASS** |
| **TC-07** | **Khóa cứng Nút Next Cuối Chặng 1** | Tài khoản `isTrial` hoàn thành Chặng 1 bấm Tiếp tục | Không cho nhảy sang Chặng 2, hiện Modal Nâng Cấp | Bật Modal Nâng Cấp, giữ nguyên Chặng 1 | ✅ **PASS** |
| **TC-08** | **Cú pháp Toàn bộ Mã nguồn** | Chạy `node -c` trên `lms/app.js` và `active_code_gs_final.js` | 0 Lỗi cú pháp (Exit Code 0) | Cả 2 tệp đều Exit Code 0 sạch sẽ | ✅ **PASS** |

---

## 3. DANH SÁCH TỆP TIN THAY ĐỔI (AFFECTED FILES)

1. `dh4hn-website/Scripts/active_code_gs_final.js`:
   - Thêm cấu hình `LMS_TRIAL` trong `AUTH_GATE_CONFIG.SURVEY_CONFIG`.
2. `dh4hn-website/lms/index.html`:
   - Cải tiến `#auth-modal`: Phân tách `#password-group` (học viên chính thức) và `#trial-onboarding-group` (form học thử Chặng 1).
   - Thêm `#trial-upgrade-modal`: Modal Amber thông báo đặc quyền khóa học chính thức và nút dẫn tới `/program-interest.html`.
3. `dh4hn-website/lms/app.js`:
   - Xóa bỏ triệt để mã tự phục vụ `DHM9-TựPhụcVụ`.
   - Cập nhật `isStageUnlocked`: Khóa cứng `stageIdx > 0` đối với tài khoản `currentUser.isTrial`.
   - Bắt sự kiện click vào stage, subsection, và `btnNextLesson` để hiển thị `#trial-upgrade-modal`.
   - Cài đặt handler cho `#btn-request-trial` gửi webhook Apps Script kèm cooldown 60s.
4. `dh4hn-website/lms/UAT/test_hybrid_auth_simulation.js`:
   - Kịch bản Node.js kiểm thử tự động toàn diện cho mô hình Hybrid Auth.

---

## 4. KẾT LUẬN & ĐỀ XUẤT BƯỚC TIẾP THEO

- Tất cả các hạng mục theo Kế hoạch triển khai đã được hoàn thiện 100% tại môi trường **Local**.
- Toàn bộ kịch bản kiểm thử mô phỏng đã chạy đạt tiêu chuẩn (Local Pass).
- Bước tiếp theo: Xin **XÁC NHẬN CẤP ĐỘ 3** từ Sếp để thực hiện `git commit`, `git push` lên GitHub và triển khai đồng bộ lên Vercel Production & Google Apps Script Clasp.
