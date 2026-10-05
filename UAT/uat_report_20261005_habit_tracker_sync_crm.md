# BÁO CÁO KIỂM THỬ UAT CỤC BỘ (LOCAL DONE): 21-DAY HABIT TRACKER SYNC CRM
## Mã kế hoạch: PLAN-20261005-HABIT-TRACKER-SYNC-CRM
## Ngày thực hiện: 05/10/2026
## Trạng thái nghiệm thu: LOCAL DONE (16/16 hạng mục PASS 100%)

---

### I. THÔNG TIN KIỂM THỬ TỔNG QUAN

- **Môi trường:** Local Static Server (`http://127.0.0.1:8124`) chạy Chrome Headless thông qua Puppeteer v24+.
- **Tài khoản kiểm thử:** Học viên Vũ Hoàng (`vuhoang2708@gmail.com` / Mật khẩu SĐT: `3145`).
- **Phạm vi tệp chỉnh sửa (Allowlist):**
  1. `dh4hn-website/lms/app.js`
  2. `dh4hn-website/lms/index.html`
- **Tệp sao lưu bảo toàn:**
  - `dh4hn-website/lms/app.js.bak_20261005_habit_sync`
  - `dh4hn-website/lms/index.html.bak_20261005_habit_sync`

---

### II. BẢNG KẾT QUẢ KIỂM THỬ CHI TIẾT (16/16 PASS)

| STT | Hạng mục kiểm thử | Kỳ vọng | Kết quả thực tế | Trạng thái |
|:---:|---|---|---|:---:|
| 1 | Xác thực đăng nhập Roster | Đăng nhập thành công với email và 4 số cuối SĐT | Nhận diện học viên: Vũ Hoàng, hiển thị `user-display-name` | ✅ PASS |
| 2 | Hiện diện phần tử DOM #stage3-tracker-section | Khối Habit Tracker hiển thị đúng vị trí | Tồn tại trong DOM Chặng 3 | ✅ PASS |
| 3 | Nút đồng bộ #btn-sync-habit-crm | Nút bấm giao diện theo chuẩn thiết kế Brand Green | Tồn tại và hiển thị đúng nhãn `💾 Đồng Bộ Tiến Độ Về BTC` | ✅ PASS |
| 4 | Huy hiệu trạng thái #habit-sync-status | Nhãn trạng thái font-medium | Tồn tại ngay dưới nút đồng bộ | ✅ PASS |
| 5 | Chặn đồng bộ khi dữ liệu trống | Khi chưa có lượt điểm danh nào, không gửi request | Hiển thị: `⚠️ Chưa có dữ liệu điểm danh để đồng bộ` | ✅ PASS |
| 6 | Kiểm soát Network khi trống | Không phát sinh request POST tới Webhook | Intercepted payload = null (Không gửi request) | ✅ PASS |
| 7 | Tương tác tích chọn điểm danh Ngày 1 | Bấm chọn M, G, O ngày 1 | Cập nhật huy hiệu: `3/105 Lượt` | ✅ PASS |
| 8 | Kích hoạt đồng bộ thủ công | Nhấn `[💾 Đồng Bộ Tiến Độ Về BTC]` | Cập nhật nhãn: `✅ Đã đồng bộ lúc 10:26 05/10/2026` | ✅ PASS |
| 9 | Gửi dữ liệu tới Google Apps Script Webhook | Kích hoạt `sendBeacon` / `fetch` tới URL đã cấu hình | Request POST được gửi thành công tới Webhook GAS | ✅ PASS |
| 10 | Xác thực Payload Action | Action phải là `sync_habit_tracker` | Payload `action: "sync_habit_tracker"` | ✅ PASS |
| 11 | Xác thực Payload Email | Email khớp danh tính người học | Payload `email: "vuhoang2708@gmail.com"` | ✅ PASS |
| 12 | Thống kê Streak & Tổng lượt điểm danh | `total_checks` khớp số lượt tích chọn | `streak_stats.total_checks = 3` | ✅ PASS |
| 13 | Chi tiết ma trận 21 ngày | Object `day_1` chứa dữ liệu thói quen | `habit_tracker.day_1` có đủ 5 keys | ✅ PASS |
| 14 | Lưu trữ LocalStorage Timestamp | Lưu thời gian đồng bộ vào key riêng theo email | Ghi nhận `dhm_habit_last_sync_vuhoang2708@gmail.com` | ✅ PASS |
| 15 | Phục hồi trạng thái sau Reload | Tải lại trang, chuyển Chặng 3, tự động hiện thời gian lần sync cuối | Tự động hiển thị: `✅ Đã đồng bộ lúc 10:26 05/10/2026` | ✅ PASS |
| 16 | Kiểm tra lỗi Console Runtime | 0 lỗi JavaScript TypeError/SyntaxError | 0 lỗi console runtime | ✅ PASS |

---

### III. BẰNG CHỨNG HÌNH ẢNH & LOGS

- **Ảnh chụp màn hình kết quả UAT:**
  - `dh4hn-website/UAT/screenshots/uat_habit_tracker_sync_crm_success.png`
- **Kịch bản kiểm thử tự động:**
  - `dh4hn-website/scratch/test_local_habit_tracker_sync_uat.js`

---

### IV. KẾT LUẬN & ĐỀ XUẤT CẤP ĐỘ 3

- Toàn bộ 16 ca kiểm thử đạt tỷ lệ thành công 100% trên môi trường cục bộ (`Local done`).
- Hệ thống sẵn sàng đẩy lên kho lưu trữ GitHub và cập nhật bản triển khai Live trên Vercel.
- Hiện đang dừng lại theo đúng quy tắc an toàn Cấp độ 3 (`AWAITING RISKY OPERATION APPROVAL`) để chờ phê duyệt chính thức từ Sếp Dzũ cho lệnh `git push`.
