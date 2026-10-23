# KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN): TẠO TÀI KHOẢN TEST VUHOANG2708SOFTWARE
## Mã kế hoạch: PLAN-20261005-CREATE-TEST-ACCOUNT-VUHOANG2708SOFTWARE
## Ngày tạo: 05/10/2026
## Mục tiêu: Tạo tài khoản kiểm thử cho `vuhoang2708software@gmail.com` với mật khẩu `1234`, mở khóa toàn bộ các chặng (Chặng 1, Chặng 2, Chặng 3).

---

### I. ĐỐI TƯỢNG VÀ NGUYÊN TẮC CẤU HÌNH (SOURCE OF TRUTH)

1. **Thông tin định danh tài khoản kiểm thử:**
   - **Họ và tên:** `Vũ Hoàng (Test)`
   - **Email:** `vuhoang2708software@gmail.com`
   - **Số điện thoại:** `0900001234`
   - **4 số cuối SĐT (Mật khẩu đăng nhập mặc định):** `1234`
   - **Phân nhóm (Cohort):** `BTC / Coach`
   - **Vai trò (Role):** `Coach`
   - **Mã học viên (Learner ID):** `COACH-007`
   - **Trạng thái:** `active`

2. **Cơ chế mở full các chặng (Full-Stage Unlocking Principle):**
   - Theo hàm `isStageUnlocked(stageIdx)` trong `lms/app.js`: Các tài khoản có `cohort === "BTC / Coach"` hoặc `role === "Coach"` được phân quyền là Ban Giảng Huấn (`isCoach === true`).
   - Quyền hạn Coach cho phép:
     * Truy cập tự do Chặng 1, Chặng 2, Chặng 3 ngay sau khi đăng nhập mà không bị khóa cứng (khác với tài khoản Trial bị khóa ở Chặng 2, 3).
     * Bỏ qua yêu cầu bắt buộc phải thi đạt bài test sát hạch đầu vào Chặng 1 (≥80%) khi chuyển chặng.
     * Tự do xem video, làm bài tập, trải nghiệm Habit Tracker 21 ngày và nộp bài.

---

### II. PHẠM VI TỆP CHỈNH SỬA (ALLOWLIST)

1. `dh4hn-website/lms/master_learners_roster.json`: Thêm entry `COACH-007` cho `vuhoang2708software@gmail.com`.
2. `dh4hn-website/lms/authorized_roster.json`: Thêm entry học viên cho `vuhoang2708software@gmail.com`.
3. `Teaching DH/Artifacts/master_learners_roster.json`: Đồng bộ nguồn CSDL danh bạ gốc.
4. `khao-sat-xung-dot-tki/public/data/authorized_roster.json`: Đồng bộ cho công cụ khảo sát TKI.
5. `khao-sat-tinh-cach/public/data/authorized_roster.json`: Đồng bộ cho công cụ khảo sát Social Styles.

---

### III. KỊCH BẢN KIỂM THỬ XÁC MINH (VERIFICATION & ACCEPTANCE CRITERIA)

| STT | Kịch bản kiểm thử | Kỳ vọng |
|:---:|---|---|
| 1 | Xác thực đăng nhập LMS | Nhập `vuhoang2708software@gmail.com` và pass `1234` ➔ Đăng nhập thành công, hiển thị tên "Vũ Hoàng (Test)" |
| 2 | Kiểm tra mở khóa Chặng 1 | Chặng 1 mở, truy cập xem video và bài tập bình thường |
| 3 | Kiểm tra mở khóa Chặng 2 | Chặng 2 không bị khóa (`🔒 Khóa`), bấm vào chuyển sang Chặng 2 thành công |
| 4 | Kiểm tra mở khóa Chặng 3 | Chặng 3 không bị khóa, bấm vào chuyển sang Chặng 3, hiển thị Habit Tracker bình thường |
| 5 | Kiểm tra Roster vệ tinh | TKI và Social Styles tìm thấy `vuhoang2708software@gmail.com` trong `authorized_roster.json` |

---

### IV. CƠ CHẾ SAO LƯU & QUAY LUI (ROLLBACK)

- Tạo tệp sao lưu `.bak_20261005_test_account` cho các tệp JSON trước khi chỉnh sửa.
- Nếu xảy ra lỗi cú pháp JSON, khôi phục ngay từ tệp `.bak` hoặc dùng `git checkout`.

---

### V. RANH GIỚI PHÊ DUYỆT (APPROVAL BOUNDARIES)

- **Cấp độ 2 (Phê duyệt kế hoạch):** Cho phép sửa các tệp trong Allowlist ở môi trường cục bộ và chạy kiểm thử tự động xác minh.
- **Cấp độ 3 (Phê duyệt tác vụ rủi ro cao):** Yêu cầu phê duyệt riêng biệt từ Sếp Dzũ trước khi thực hiện `git commit`, `git push` lên GitHub và triển khai Live trên Vercel.
