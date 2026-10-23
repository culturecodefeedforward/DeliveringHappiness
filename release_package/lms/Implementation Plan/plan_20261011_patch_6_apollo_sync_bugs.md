# Implementation Plan: Vá Dứt Điểm 6 Lỗi Đồng Bộ Dữ Liệu Học Viên Apollo (`PLAN-20261011-APOLLO-6-SYNC-BUGS`)

- **Mã kế hoạch (`Plan ID`):** `PLAN-20261011-APOLLO-6-SYNC-BUGS`
- **Ngày lập:** `2026-10-11`
- **Mức độ rủi ro (`Risk Tier`):** `HIGH-RISK` (chạm 5 tệp mã nguồn thuộc 3 lớp kiến trúc: Frontend Micro-LMS, Frontend 5-Station App `team-happiness-iam`, và Backend Google Apps Script Webhook; bảo vệ trực tiếp toàn vẹn dữ liệu điểm thi Post-Test và bài thu hoạch I•A•M của học viên khóa Team Happiness Apollo).
- **Trạng thái phê duyệt (`Approval Status`):** `⛔ AWAITING PLAN APPROVAL (Cấp độ 2)`

---

## 1. Mục tiêu & Tóm tắt 6 Hạng mục Kỹ thuật (`Scope & Objectives`)

Giải quyết triệt để 6 lỗ hổng kỹ thuật và vận hành trước khi thông báo cho học viên khóa **Team Happiness (Apollo)** mở lại đường dẫn trang web để thu hồi bài làm ngày `09/10/2026`:

1. **`[CRITICAL #1 - Chống ghi đè điểm 0 (Score=0 Empty-Device Clobber Bug)]`:**
   - Khắc phục việc `getInitialLearnerProgress()` khởi tạo `score: 0, passed: false` khiến `hasQuizData = (score !== null) || answeredCount > 0` luôn trả về `true` (`0 !== null`) và tự động bắn `score: 0, passed: false` lên Google Apps Script (`GAS`), ghi đè xóa mất điểm đậu thật trên Google Sheets khi học viên mở trang trên thiết bị thứ hai.
   - Chặn cả trường hợp trình duyệt đã lưu sẵn `"score": 0, "passed": false, "quizAnswers": {}` trong `localStorage` từ các phiên trước hoặc khi học viên bấm nút làm lại (`#btn-quiz-retry`).
2. **`[CRITICAL #2 - Hướng dẫn lệch tên miền & lệch trình duyệt Zalo (`Cross-Origin & In-App Browser Guidance`)]`:**
   - Trang LMS (`https://delivering-happiness.vercel.app/lms/`) và ứng dụng 5 Trạm I•A•M (`https://team-happiness-iam.vercel.app/`) nằm trên 2 tên miền khác nhau nên `localStorage` tách biệt hoàn toàn.
   - Khi trình duyệt hiện tại không có dữ liệu bài làm ngày `09/10/2026`, hiển thị thông báo hướng dẫn rõ ràng (nhắc mở lại đúng ứng dụng Zalo / điện thoại / trình duyệt đã dùng hôm học) kèm nút chuyển tiếp 1 chạm truyền sẵn thông tin định danh (`?name=...&email=...&phone=...&center=...`) giữa hai ứng dụng.
3. **`[HIGH #3 - Quét toàn bộ khóa LocalStorage kể cả khi đã đăng xuất (`Unauthenticated Multi-Key & Backup Queue Sweep`)]`:**
   - Trên **LMS (`app.js`)**: Gọi `triggerAutoTelemetryOnBoot()` ngay cả khi chưa đăng nhập (`dhm_lms_auth_user` trống); quét toàn bộ các khóa `dhm_lms_progress_*`, `dhm_quick_notes_*`, `dhm_pv_history_*`, `dhm_pv_*` trong `localStorage`, tra cứu danh tính từ `dhm_master_learners_directory` và `findLearner(identity)` (`authorizedRoster`), không làm hỏng biến toàn cục `learnerProgress`.
   - Trên **5 Trạm I•A•M (`team-happiness-iam`)**: Gọi `flushPendingIamOnBoot()` ngay khi khởi động kể cả khi `profile === null`; quét toàn bộ lịch sử trong `localStorage.getItem('team_happiness_webhook_backup')` (nơi đã lưu mọi lần bấm lưu trạm ngày `09/10/2026` kèm `profile`, `entry`, `allEntries`) cùng `apollo_iam_entries` và `team_happiness_all_pax_entries`, tự động tính `analytics` và đồng bộ lên GAS.
4. **`[HIGH #4 - Đồng bộ xác thực phản hồi (`ACK-Verified Fetch`) & Bỏ khóa Hash 60 phút sớm]`:**
   - Thay thế cơ chế gửi mù `navigator.sendBeacon` / `fetch(..., { mode: 'no-cors' })` bằng `fetch` POST đọc phản hồi JSON `{ success: true }` từ GAS (`dispatchTelemetryPayloadWithAck` trên LMS và `postPayloadWithAck` trên 5 Trạm).
   - Giảm độ trễ khởi chạy xuống `250ms` (thay vì `1.2s–4.7s`).
   - **Chỉ ghi `lastHashKey` và `lastTimeKey` vào `localStorage` SAU KHI nhận được `ack && ack.success === true` từ GAS.** Tự động thử lại (`retry`) tối đa 2 lần (cách nhau `2000ms`) nếu GAS trả về `{ retry: true }` hoặc lỗi mạng tạm thời.
5. **`[HIGH #5 - Gia cố Backend Google Apps Script (`LockService Guard`, `High-Water Mark`, `Multi-Set Merge`, `Missing Actions`)]`:**
   - Tăng `lock.tryLock(25000)` (25 giây). Nếu `hasLock === false`, **tuyệt đối không chạy không khóa** vào `writeIamAndLmsToSpreadsheet_`, mà ghi dự phòng vào trang tính `Raw_Telemetry_Queue` (`enqueueRawTelemetryFallback_`) và trả về `{ success: false, error: 'LOCK_TIMEOUT', retry: true }`.
   - Áp dụng `High-Water Mark Protection` trong `upsertLmsCheckpointsRow_` và `upsertApolloSummaryRow_`: không bao giờ để gói tin có `score === 0` hoặc `answeredCount === 0` ghi đè lùi điểm đậu thật (`prevScore > 0` hoặc `prevPassed === true`).
   - Hợp nhất (`mergeIamSets_`) dữ liệu `cp1_sets` và `cp2_sets` từ `prev[25]` (`rawSetsJson`) để không làm mất bộ thẻ I•A•M khi học viên mở nhiều thiết bị.
   - Bảo vệ không để dữ liệu tổng hợp từ LMS (`profile.department === 'LMS'`) ghi đè mất nội dung `Trạm 1..5` đã làm trên ứng dụng 5 Trạm trong bảng `Tổng Hợp Học Viên`.
   - Bổ sung nhánh xử lý `action === 'update_password'` và `action === 'contact_culturecode'` trong `doPost(e)` để không bị rơi vào `handleRegistration` (`MISSING_UUID`).
6. **`[MEDIUM #6 - Thanh trạng thái đồng bộ trực quan (`Visible Sync Status Banner`) hiển thị trên cả Modal `z-50`]`:**
   - Hiển thị thanh thông báo trạng thái nổi rõ ràng cả ở màn hình chính lẫn bên trên/bên trong hộp thoại đăng nhập (`#auth-modal` `z-50` trên LMS và `OnboardingModal` `z-50` trên 5 Trạm) với 3 trạng thái: `SYNCING` (Đang đồng bộ...), `SUCCESS` (Đã đồng bộ thành công bài làm của [Họ tên] — có thể đóng trang), và `EMPTY_BROWSER` (Trình duyệt hiện tại chưa có dữ liệu ngày 09/10).

---

## 2. Danh sách Tệp Được Phép Chỉnh Sửa (`Allowlist` — 5 Tệp)

1. Tệp logic chính của Cổng Micro-LMS:
```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js
```
[app.js](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/lms/app.js)

2. Tệp mirror đồng bộ 100% của Micro-LMS trong workspace `Teaching DH` (theo Quy tắc 5 - `Holistic Consistency Audit Rule`):
```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js
```
[app.js](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/dhm-micro-lms/app.js)

3. Tệp Backend Google Apps Script Webhook:
```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js
```
[active_code_gs_final.js](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js)

4. Tệp tiện ích đồng bộ Webhook của ứng dụng 5 Trạm I•A•M:
```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\src\utils\webhook.ts
```
[webhook.ts](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/team-happiness-iam/src/utils/webhook.ts)

5. Tệp giao diện chính của ứng dụng 5 Trạm I•A•M:
```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\src\App.tsx
```
[App.tsx](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/team-happiness-iam/src/App.tsx)

---

## 3. Nguồn Chuẩn Tham Chiếu (`Source of Truth` — Chỉ Đọc)

```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\authorized_roster.json
```
[authorized_roster.json](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/lms/authorized_roster.json)

```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html
```
[index.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/lms/index.html)

```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\src\utils\auth.ts
```
[auth.ts](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/team-happiness-iam/src/utils/auth.ts)

```text
c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\src\components\OnboardingModal.tsx
```
[OnboardingModal.tsx](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/team-happiness-iam/src/components/OnboardingModal.tsx)

---

## 4. Thiết kế Chi Tiết Từng Dòng Mã Nguồn (`Exact Code Changes`)

*(Đồng bộ 100% với bản kế hoạch gốc tại `c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\Implementation Plan\plan_20261011_patch_6_apollo_sync_bugs.md`).*
