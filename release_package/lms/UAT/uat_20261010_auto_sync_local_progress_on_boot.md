# BÁO CÁO KIỂM THỬ NGHIỆM THU (UAT REPORT)
# CƠ CHẾ TỰ ĐỘNG ĐỒNG BỘ TIẾN ĐỘ CỤC BỘ LÊN GOOGLE SHEET KHI MỞ LMS (AUTO-SYNC ON BOOT)

- **Mã kế hoạch (Plan Code):** `PLAN-20261010-AUTO-SYNC-ON-BOOT`
- **Mã kiểm thử (UAT Code):** `UAT-20261010-AUTO-SYNC-ON-BOOT`
- **Ngày thực hiện:** 10/10/2026
- **Môi trường:** Local Chrome Puppeteer (Node.js Test Harness v20+)
- **Tệp kịch bản kiểm thử:** `dh4hn-website/scratch/test_auto_boot_sync_telemetry_uat.js`
- **Tệp mã nguồn được kiểm thử:**
  - `dh4hn-website/lms/app.js`
  - `Teaching DH/dhm-micro-lms/app.js`
- **Kết quả tổng quan:** **18/18 Tests PASS (100% ĐẠT CHUẨN)**

---

## I. TỔNG HỢP KẾT QUẢ THEO MA TRẬN KIỂM THỬ

| STT | Mã TC | Kịch bản kiểm thử | Hành động & Dữ liệu đầu vào | Kết quả thực tế quan sát được | Trạng thái |
|:---:|:---:|---|---|---|:---:|
| 1 | **TC1** | **Khởi động lần đầu có bài thi (Boot Dispatch)** | Giả lập `localStorage` có tài khoản Apollo và kết quả làm bài Chặng 1 (8/10 câu, 80%, Top 7 values). Tải trang LMS lần đầu. | Webhook `auto_boot_sync` kích hoạt sau độ trễ Jitter (3.837ms). Payload gửi đầy đủ: `score: 8`, `type: AUTO_BOOT_TELEMETRY`, `target_sheet_name: Thu Hoạch IAM`. Ghi nhận `stateHash` và timestamp vào `localStorage`. | **PASS** ✅ |
| 2 | **TC2** | **Chống spam trùng lặp (Idempotent Guard)** | F5 tải lại trang LMS khi bài làm và điểm số không đổi. Quan sát mạng trong toàn bộ chu kỳ 4.5s. | Hàm phát hiện `stateHash` trùng khớp và thời gian chưa vượt quá 60 phút -> **Bỏ qua (Skip), đúng 0 request phát ra mạng**. | **PASS** ✅ |
| 3 | **TC3** | **Cập nhật bài thi mới (Hash Mismatch Trigger)** | Thay đổi kết quả bài thi từ 8 lên 9 câu đúng (90%) trên `localStorage` và phát sự kiện `window focus` (quay lại tab LMS). | Hàm lập tức phát hiện lệch State Hash cũ, kích hoạt phát telemetry cập nhật mới với `score: 9`, `percentage: 90`. Ghi đè State Hash mới vào `localStorage`. | **PASS** ✅ |
| 4 | **TC4** | **Bảo vệ tải máy chủ (Anti-Throttling Jitter)** | Đo thời gian delay thực tế trước khi phát request. | Lần 1: **3.837ms**; Lần 2: **1.767ms**. Đảm bảo 100% request phân tán trong khung 1.000ms - 4.000ms, không phát tức thời làm nghẽn Webhook. | **PASS** ✅ |
| 5 | **TC5** | **Không ảnh hưởng UI & Trải nghiệm (Background Async)** | Đo lường tác động giao diện trong suốt quá trình đồng bộ ngầm. | Giao diện học tập hiển thị mượt mà, không gián đoạn, không bật modal đăng nhập đè lên, console sạch 0 lỗi cú pháp/ngoại lệ. | **PASS** ✅ |

---

## II. CHI TIẾT BẰNG CHỨNG THỰC NGHIỆM (EVIDENCE LOGS)

```text
======================================================================
   UAT SUITE: AUTO-SYNC LOCAL PROGRESS ON BOOT (PLAN-20261010)
======================================================================

[HTTP] Local test server running at http://127.0.0.1:8129
----------------------------------------------------------------------
TC1: KHỞI ĐỘNG LẦN ĐẦU CÓ BÀI THI (BOOT TELEMETRY DISPATCH)
----------------------------------------------------------------------
[TC1] Reloading LMS page with pre-existing Stage 1 quiz progress...
[TC1] Waiting for telemetry jitter window (1-4s)...
[NETWORK INTERCEPT] Webhook POST (auto_boot_sync): {"action":"auto_boot_sync","type":"AUTO_BOOT_TELEMETRY","learner_id":"APOLLO-TEST-01","name":"Học Viên Apollo Test","ema...
✅ [PASS] TC1.1: Webhook request được phát thành công khi khởi động LMS
✅ [PASS] TC1.2: Action payload đúng chuẩn 'auto_boot_sync' -> auto_boot_sync
✅ [PASS] TC1.3: Type payload đúng chuẩn 'AUTO_BOOT_TELEMETRY' -> AUTO_BOOT_TELEMETRY
✅ [PASS] TC1.4: Điểm số trích xuất chính xác -> Score: 8/10 (80%)
✅ [PASS] TC1.5: Đích ghi là sheet 'Thu Hoạch IAM'
✅ [PASS] TC1.6: Top values chứa đúng giá trị cá nhân
[TC1] Đo lường thời gian trễ thực tế: 3837ms
✅ [PASS] TC4.1: Độ trễ kích hoạt nằm trong khoảng Jitter an toàn (1-4s) -> 3837ms
✅ [PASS] TC1.7: State Hash đã được lưu vào localStorage -> apollo.learner.01@example.com__s:8__a:8__v:Biết ơn,Chân thành,Phụng sự
✅ [PASS] TC1.8: Timestamp đồng bộ đã được lưu vào localStorage -> 1791614118794

----------------------------------------------------------------------
TC2: CHỐNG SPAM TRÙNG LẶP / IDEMPOTENT GUARD
----------------------------------------------------------------------
[TC2] F5 tải lại trang khi dữ liệu bài thi KHÔNG thay đổi...
[TC2] Chờ hết chu kỳ jitter (4.5s) để quan sát request...
✅ [PASS] TC2.1: Ngăn chặn request trùng lặp hoàn toàn (0 request phát ra) -> Requests: 0

----------------------------------------------------------------------
TC3: CẬP NHẬT BÀI THI MỚI (HASH MISMATCH AUTO-TRIGGER)
----------------------------------------------------------------------
[TC3] Cập nhật bài làm mới: Điểm tăng từ 8 -> 9 (90%), trả lời thêm câu q9...
[TC3] Chờ phát request cập nhật sau Jitter (4.5s)...
[NETWORK INTERCEPT] Webhook POST (auto_boot_sync): {"action":"auto_boot_sync","type":"AUTO_BOOT_TELEMETRY","learner_id":"APOLLO-TEST-01","name":"Học Viên Apollo Test","ema...
✅ [PASS] TC3.1: Phát hiện State Hash thay đổi và phát request đồng bộ mới
✅ [PASS] TC3.2: Payload mang điểm số cập nhật mới nhất (9/10) -> Score: 9
✅ [PASS] TC3.3: Tỷ lệ phần trăm cập nhật thành 90%
✅ [PASS] TC3.4: State Hash mới đã ghi đè hash cũ trong localStorage -> apollo.learner.01@example.com__s:9__a:9__v:Biết ơn,Chân thành,Phụng sự
[TC3] Thời gian trễ update: 1767ms
✅ [PASS] TC4.2: Lần phát cập nhật cũng tuân thủ Jitter 1-4s -> 1767ms

----------------------------------------------------------------------
TC4 & TC5: CONCURRENCY JITTER & KHÔNG ẢNH HƯỞNG GIAO DIỆN / UI
----------------------------------------------------------------------
✅ [PASS] TC5.1: Giao diện học tập vẫn hiển thị bình thường, không bị gián đoạn
✅ [PASS] TC5.2: Không bị bật modal đăng nhập đè lên làm gián đoạn học viên
✅ [PASS] TC5.3: Hoàn toàn không phát sinh lỗi cú pháp hay ngoại lệ Console -> Errors: 0

======================================================================
   KẾT QUẢ KIỂM THỬ: 18/18 TESTS ĐẠT CHUẨN (100% PASS)
======================================================================
🎯 TOÀN BỘ TC1 - TC5 ĐÃ ĐƯỢC XÁC MINH VERIFIED TRÊN LOCAL!
```

---

## III. TỆP SAO LƯU & TRẠNG THÁI QUAY LUI (ROLLBACK INTEGRITY)

- **Tệp sao lưu gốc bảo toàn nguyên vẹn:**
  - `dh4hn-website/lms/app.js.bak_20261010_auto_sync_on_boot`
  - `Teaching DH/dhm-micro-lms/app.js.bak_20261010_auto_sync_on_boot`
- **Đồng bộ song song:**
  - Hai tệp `dh4hn-website/lms/app.js` và `Teaching DH/dhm-micro-lms/app.js` đạt độ đồng nhất 100% (`git diff --no-index` trả về rỗng).
- **Trạng thái kiểm chứng cú pháp:**
  - Cả hai tệp đều đạt chuẩn `node -c` (0 syntax errors).

---

## IV. RANH GIỚI BẢO MẬT & BƯỚC TIẾP THEO

- **Mức kiểm chứng hiện tại:** `Local done` (Đã hoàn tất kiểm thử tự động trên máy cục bộ).
- **Ranh giới:** Chưa thực hiện Git commit, push hay deploy Vercel (đang chờ phê duyệt Cấp độ 3 từ Sếp Dzũ).
