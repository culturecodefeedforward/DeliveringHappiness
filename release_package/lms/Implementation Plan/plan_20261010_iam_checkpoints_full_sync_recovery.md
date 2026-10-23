# KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN)
# ĐỒNG BỘ TOÀN DIỆN CHECKPOINT I•A•M & THU HỒI DỮ LIỆU THẬT TỪ MÁY HỌC VIÊN VỀ GOOGLE SHEETS

- **Mã kế hoạch (`Plan Code`):** `PLAN-20261010-IAM-CHECKPOINTS-FULL-SYNC`
- **Ngày lập:** 10/10/2026
- **Trạng thái:** `AWAITING USER APPROVAL` (Chờ phê duyệt Cấp độ 2 để sửa mã nguồn cục bộ & chạy kiểm thử)
- **Mục tiêu cốt lõi:**
  1. Khắc phục triệt để 3 điểm đứt mạch kỹ thuật khiến các `checkpoint` (điểm kiểm tra thu hoạch) I•A•M (`iam_cp1_sets`, `iam_cp2_sets`, `iam_cp1`, `iam_cp2`, `iam_1_1..1_3`, `capstoneIam`, `quickNotes`, và 5 Trạm Apollo) chưa được ghi lên Google Sheet hôm qua (09/10/2026).
  2. Tự động thu hồi (`auto-recovery on boot`) 100% dữ liệu thật đang nằm trong `localStorage` (bộ nhớ cục bộ trình duyệt) trên điện thoại/laptop của học viên ngay khi học viên mở lại trang LMS hoặc trang 5 Trạm I•A•M, đẩy thẳng về Google Sheet.

---

## I. CHẨN ĐOÁN NGUYÊN NHÂN GỐC RỄ ĐÃ KIỂM CHỨNG (`VERIFIED ROOT CAUSES`)

1. **Điểm đứt 1 — Frontend LMS (`dh4hn-website/lms/app.js` & `Teaching DH/dhm-micro-lms/app.js`) bỏ sót dữ liệu Checkpoint I•A•M khi đóng gói `payload` (gói dữ liệu gửi đi):**
   - Trong `syncToGoogleSheets()` (dòng 1146–1167) và `triggerAutoTelemetryOnBoot()` (dòng 1263–1282), gói `payload` chỉ gửi `stage1_quiz_score`, `stage1_quiz_answers`, `stage1_values`, `stage2_habits`, `stage2_capstone`, `stage3_tracker`.
   - Hoàn toàn thiếu: `s1.iam_cp1`, `s1.iam_cp1_sets`, `s1.iam_cp2`, `s1.iam_cp2_sets`, `s1.iam_1_1`, `s1.iam_1_2`, `s1.iam_1_3`, `s1.scenarios`, `s2.capstone_sets`, và `quickNotes` (`dhm_quick_notes_<identity>`).
   - Chữ ký trạng thái (`stateHash`) trong `triggerAutoTelemetryOnBoot()` mới chỉ tính trên `score + answeredCount + topValues`, chưa tính số lượng bộ I•A•M (`iam_cp1_sets.length`, `iam_cp2_sets.length`, nội dung I•A•M), nên khi học viên nhập thêm bộ I•A•M mới hoặc mở lại trang, chữ ký không đổi để kích hoạt đẩy bù dữ liệu I•A•M.

2. **Điểm đứt 2 — Backend Webhook (`dh4hn-website/Scripts/active_code_gs_final.js`) chưa có nhánh xử lý `doPost` cho LMS Telemetry & I•A•M:**
   - `LMS_CONFIG.AUTHORIZED_WEBHOOKS[0]` trong `lms/app.js` đang trỏ tới Web App `AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec` (thuộc kịch bản `Scripts/active_code_gs_final.js`, Script ID: `1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS`).
   - Tuy nhiên, hàm `doPost(e)` trong `active_code_gs_final.js` (dòng 792–861) chưa có nhánh rẽ cho các `action`:
     * `"sync_full_progress"`
     * `"auto_boot_sync"`
     * `"sync_quiz_result"`
     * `"sync_me_values"`
     * `"sync_iam_checkpoint"`
     * và gói dữ liệu 5 Trạm (`type === "station_saved"` / `"full_submission"`).
   - Hệ quả: Mọi request gửi lên đều bị rơi xuống dòng 856 `handleRegistration(...)` và bị từ chối vì không phải form đăng ký khóa học.

3. **Điểm đứt 3 — Ứng dụng 5 Trạm (`team-happiness-iam/src/utils/webhook.ts`) vẫn đang để URL `placeholder` (giá trị giữ chỗ giả lập):**
   - Dòng 4 của `team-happiness-iam/src/utils/webhook.ts` đang là `https://script.google.com/macros/s/AKfycbz_iam_apollo_placeholder/exec` và hàm gửi tự động `return true` mà không phát request mạng.
   - Toàn bộ dữ liệu học viên nhập trên `team-happiness-iam.vercel.app` hiện đang nằm trong `localStorage` (`apollo_iam_entries` và `team_happiness_webhook_backup`).

---

## II. DANH SÁCH TỆP CHO PHÉP CHỈNH SỬA (`ALLOWLIST`)

Chỉ tác động đúng 5 tệp trong phạm vi sau:
1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js`
2. `c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js`
3. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js`
4. `c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\src\utils\webhook.ts`
5. `c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\src\App.tsx`

*Nguồn chuẩn tham chiếu (`Source of Truth` - Chỉ đọc):*
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\authorized_roster.json`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam\apps_script\Code.js`

---

## III. CHI TIẾT KỸ THUẬT TRIỂN KHAI (`IMPLEMENTATION DETAILS`)

### 1. Nâng cấp `dh4hn-website/lms/app.js` (và đồng bộ sang `Teaching DH/dhm-micro-lms/app.js`)
- **Hàm trích xuất trọn vẹn dữ liệu I•A•M & Ghi chú nhanh (`extractIamAndNotesTelemetry(prog, identity)`)**:
  - Đọc toàn bộ từ `prog.stageData["stage-1"]`:
    * `iam_cp1` (`{ I, A, M }`) và mảng đa bộ `iam_cp1_sets` (`[{ id, I, A, M, createdAt }, ...]`)
    * `iam_cp2` (`{ I, A, M }`) và mảng đa bộ `iam_cp2_sets` (`[{ id, I, A, M, createdAt }, ...]`)
    * `iam_1_1`, `iam_1_2`, `iam_1_3`
  - Đọc từ `prog.stageData["stage-2"]`:
    * `capstoneIam`, `capstone_sets`, và `habits` (từng thói quen gồm cả phần `.iam`).
  - Đọc ghi chú nhanh từ `localStorage.getItem("dhm_quick_notes_" + identity)`.
- **Cập nhật `syncToGoogleSheets()` & `handleSaveIamSet(cpType)`**:
  - Đính kèm toàn bộ các trường I•A•M trên vào `payload` của `syncToGoogleSheets()`.
  - Khi học viên bấm lưu ở `handleSaveIamSet(cpType)`, ngoài việc gọi `saveLearnerProgress()` (đã kích hoạt `syncToGoogleSheets()`), cập nhật lại `dhm_telemetry_last_hash_<identity>` để đồng bộ nhất quán.
- **Cập nhật `triggerAutoTelemetryOnBoot()`**:
  - Cho phép kích hoạt tự động khi học viên có **bất kỳ** dữ liệu nào trong 3 nhóm: (a) Điểm/câu trả lời Quiz (`hasQuizData`), (b) Giá trị cốt lõi (`hasPvData`), hoặc (c) Đã nhập ít nhất 1 ô/bộ I•A•M hoặc Ghi chú (`hasIamData`).
  - Cập nhật công thức tính `stateHash` bao gồm cả chữ ký nội dung I•A•M (`iamSignature`):
    `const stateHash = "${identity}__s:${score}__a:${answeredCount}__v:${topValuesString}__iam:${iamSignature}";`
  - Nhờ `stateHash` mới có thêm nhánh `__iam:...`, ngay khi học viên mở lại trang LMS, trình duyệt sẽ phát hiện `lastHash !== stateHash` và **tự động gửi bù toàn bộ dữ liệu Checkpoint I•A•M đã làm hôm qua lên Google Sheet**.

### 2. Nâng cấp Backend Google Apps Script `dh4hn-website/Scripts/active_code_gs_final.js`
- Trong hàm `doPost(e)` (trước dòng `handleRegistration`), bổ sung nhánh xử lý cho các sự kiện từ LMS và 5 Trạm I•A•M:
  - Các `action`: `"sync_full_progress"`, `"auto_boot_sync"`, `"sync_quiz_result"`, `"sync_me_values"`, `"sync_iam_checkpoint"`, `"sync_habit_tracker"`.
  - Các `type` từ ứng dụng 5 Trạm: `"station_saved"`, `"full_submission"`.
- **Cơ chế ghi dữ liệu kép an toàn (`Dual-Target Sheet Persistence`)**:
  - **Đích 1**: Mở bảng tính `Team Happiness Apollo - Thu Hoạch IAM` (`1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak`) (nếu tài khoản thực thi có quyền ghi) và cập nhật trực tiếp vào:
    * Trang tính `Tổng Hợp Học Viên` (upsert theo `email` / `phone`, điền đầy đủ Điểm Quiz, Top 7 Giá trị, các bộ Checkpoint 1 `iam_cp1_sets`, Checkpoint 2 `iam_cp2_sets`, Bài 1.1–1.3, Capstone, và 5 Trạm).
    * Trang tính `Nhật Ký Từng Trạm` (ghi nhật ký chi tiết từng lần lưu bộ I•A•M hoặc trạm).
  - **Đích 2 (Bảo hiểm 100% không bao giờ mất dữ liệu kể cả khi khác quyền sở hữu file)**: Ghi đồng thời vào trang tính `LMS_IAM_ThuHoach` và `LMS_IAM_NhatKy` ngay trên bảng tính Production chính của hệ thống (`getTargetSpreadsheet()`).
- Bổ sung nhánh `doGet` (`action === "get_lms_iam_submissions"`) để Admin Dashboard hoặc công cụ đồng bộ có thể đọc trực tiếp toàn bộ dữ liệu thật bất kỳ lúc nào.

### 3. Nâng cấp `team-happiness-iam/src/utils/webhook.ts` & `src/App.tsx`
- Thay hằng số `WEBHOOK_URL` từ `placeholder` sang URL Web App chính thức đang hoạt động:
  `https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec`
- Thêm hàm `flushPendingIamOnBoot(profile, entries)` trong `webhook.ts` và gọi trong `useEffect` khi khởi động `App.tsx`:
  - Nếu trong `localStorage` của học viên đã có `apollo_iam_entries` (dữ liệu 5 trạm nhập hôm qua) mà chữ ký `apollo_iam_last_sync_hash` chưa khớp, tự động gửi `submitFullReportToWebhook(profile, entries)` sau độ trễ ngẫu nhiên 1–3 giây để thu hồi toàn bộ các trạm đã nhập hôm qua về Google Sheet.

---

## IV. KẾ HOẠCH KIỂM CHỨNG (`VERIFICATION & UAT MATRIX`)

1. **Kiểm tra cú pháp (`Syntax & Build Verification`)**:
   - Chạy `node --check` cho `dh4hn-website/lms/app.js`, `Teaching DH/dhm-micro-lms/app.js`, và `dh4hn-website/Scripts/active_code_gs_final.js` đạt `exit code 0`.
   - Chạy `npm run build` trong `team-happiness-iam` đạt `exit code 0`.
2. **Kiểm thử tự động cục bộ (`Local Automated UAT` — 6 kịch bản)**:
   - **TC1**: Học viên chỉ có dữ liệu `iam_cp1_sets` (2 bộ I•A•M) và `iam_cp2_sets` (1 bộ I•A•M) từ hôm qua trong `localStorage` $\rightarrow$ Mở LMS (`triggerAutoTelemetryOnBoot`) $\rightarrow$ Tự động phát gói `auto_boot_sync` chứa đầy đủ mảng `iam_cp1_sets` và `iam_cp2_sets`.
   - **TC2**: Học viên bấm lưu thêm Bộ I•A•M #3 ở Checkpoint 1 (`handleSaveIamSet('cp1')`) $\rightarrow$ Gói `sync_full_progress` gửi đi có đủ 3 bộ trong `iam_cp1_sets` và cập nhật `stateHash`.
   - **TC3**: Chống gửi trùng lặp (`Idempotent State Hash`) $\rightarrow$ Khi không thêm/sửa bộ I•A•M nào và F5 tải lại trang trong 60 phút, hệ thống phát đúng **0 request** thừa.
   - **TC4**: Kiểm thử hàm `handleLmsAndIamTelemetry_` trong `active_code_gs_final.js` với dữ liệu giả lập cục bộ (`mock SpreadsheetApp`) $\rightarrow$ Xác nhận ghi đúng từng cột `iam_cp1_sets`, `iam_cp2_sets`, `top7_values`, `score` và 5 Trạm I•A•M.
   - **TC5**: Kiểm thử `flushPendingIamOnBoot` trong `team-happiness-iam` $\rightarrow$ Khi `localStorage` có sẵn các trạm từ hôm qua, mở trang tự động phát gói `full_submission` về Webhook thật.

---

## V. SAO LƯU & QUAY LUI (`BACKUP & ROLLBACK`)

- **Tạo bản sao lưu trước khi sửa:**
  - `dh4hn-website/lms/app.js.bak_20261010_iam_sync`
  - `Teaching DH/dhm-micro-lms/app.js.bak_20261010_iam_sync`
  - `dh4hn-website/Scripts/active_code_gs_final.js.bak_20261010_iam_sync`
  - `team-happiness-iam/src/utils/webhook.ts.bak_20261010_iam_sync`
  - `team-happiness-iam/src/App.tsx.bak_20261010_iam_sync`
- **Lệnh quay lui tức thì (`Rollback`):**
  Khôi phục toàn bộ 5 tệp từ bản `.bak_20261010_iam_sync` tương ứng nếu phát sinh bất kỳ lỗi cú pháp hoặc sai lệch nào.

---

## VI. RANH GIỚI PHÊ DUYỆT (`APPROVAL BOUNDARY`)

- **Cấp độ 2 (`Plan Approval`)**: Sếp duyệt kế hoạch này để em tiến hành sao lưu, sửa 5 tệp mã nguồn cục bộ trong `Allowlist` và chạy bộ kiểm thử tự động cục bộ (`Local UAT`).
- **Cấp độ 3 (`Risky Operation Approval`)**: Sau khi kiểm thử cục bộ đạt 100%, em sẽ trình câu quote Cấp độ 3 riêng để sếp duyệt trước khi chạy `clasp push/deploy` cập nhật Webhook Apps Script, chia sẻ quyền ghi bảng tính `1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak` và `git push` lên GitHub / Vercel Production.
