# BÁO CÁO KIỂM THỬ NGHIỆM THU (`LOCAL & LIVE UAT REPORT`)
# ĐỒNG BỘ TOÀN DIỆN CHECKPOINT I•A•M & THU HỒI DỮ LIỆU TỪ LOCALSTORAGE VỀ GOOGLE SHEETS

- **Mã kế hoạch (`Plan Code`):** `PLAN-20261010-IAM-CHECKPOINTS-FULL-SYNC`
- **Ngày thực hiện:** 10/10/2026
- **Trạng thái kiểm chứng (`Claim Surface`):** `Live done` (`VERIFIED` trên Local 35/35 tests pass + `VERIFIED` trên GitHub `1051e15`, Apps Script Webhook `@78`, Google Sheet `1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak`, `delivering-happiness.vercel.app/lms/app.js` và `team-happiness-iam.vercel.app`).
- **Tệp kịch bản kiểm thử:**
  - `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\scratch\test_iam_checkpoints_full_sync_uat.js`
  - `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\scratch\test_auto_boot_sync_telemetry_uat.js`

---

## I. DANH SÁCH TỆP ĐÃ CHỈNH SỬA & TRIỂN KHAI PRODUCTION

| STT | Tệp mã nguồn | Đích triển khai (`Production Target`) | Trạng thái |
|:---:|---|---|---|
| 1 | `dh4hn-website/lms/app.js` | `https://delivering-happiness.vercel.app/lms/app.js` (`commit 1051e15`) | `Live done` (`VERIFIED`) |
| 2 | `Teaching DH/dhm-micro-lms/app.js` | Đồng bộ 100% với tệp #1 | `Local done` (`VERIFIED`) |
| 3 | `dh4hn-website/Scripts/active_code_gs_final.js` | Google Apps Script `AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ` (`@78`) | `Live done` (`VERIFIED`) |
| 4 | `team-happiness-iam/src/utils/webhook.ts` | `https://team-happiness-iam.vercel.app` (`dpl_35M3DtTPUb9LFQGdfTmpWhdYwPBZ`) | `Live done` (`VERIFIED`) |
| 5 | `team-happiness-iam/src/App.tsx` | `https://team-happiness-iam.vercel.app` (`dpl_35M3DtTPUb9LFQGdfTmpWhdYwPBZ`) | `Live done` (`VERIFIED`) |

---

## II. MA TRẬN KẾT QUẢ KIỂM THỬ (`VERIFICATION MATRIX` — 35/35 LOCAL + LIVE PASS)

| Mã kiểm thử | Nội dung kiểm chứng | Kết quả thực tế | Trạng thái |
|---|---|---|:---:|
| **Parity-01** | Đối chiếu đồng nhất 100% giữa `dh4hn-website/lms/app.js` và `Teaching DH/dhm-micro-lms/app.js` | Khớp từng byte (`lmsCode === teachingCode`) | **PASS** |
| **TC1.1 - TC1.4** | Học viên có dữ liệu `iam_cp1_sets`, `iam_cp2_sets`, `quick_notes` trong `localStorage` $\rightarrow$ Mở LMS | Tự động hẹn giờ sau `jitter` (1.000ms–4.000ms) và phát đúng 1 gói `auto_boot_sync` chứa trọn vẹn các bộ CP1, CP2 và ghi chú nhanh | **PASS** |
| **TC2.1 - TC2.2** | Học viên bấm lưu thêm Bộ I•A•M mới vào Checkpoint 1 / 2 | Chữ ký `stateHash` thay đổi tức thì, tự động phát gói đồng bộ mới chứa đủ toàn bộ các bộ I•A•M | **PASS** |
| **TC3** | Tính chất `idempotent` (chống gửi trùng lặp) khi dữ liệu I•A•M không đổi trong vòng 60 phút | Gọi lại `triggerAutoTelemetryOnBoot()` phát đúng **0 request** thừa | **PASS** |
| **TC4.1 - TC4.5** | Kiểm thử hàm `handleLmsAndIamTelemetry_` trong `active_code_gs_final.js` | Ghi thành công vào cả bảng tính Apollo (`1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak`) và bảng tính hệ thống chính (`Thu Hoạch LMS & Checkpoints`, `Tổng Hợp Học Viên`, `Nhật Ký Từng Trạm`) kèm chống ghi trùng dòng | **PASS** |
| **TC5.1 - TC5.2** | Kiểm thử `team-happiness-iam` (`webhook.ts` & `App.tsx`) | Đã thay thế URL `placeholder` bằng URL Webhook thật và kích hoạt `flushPendingIamOnBoot` khi mở ứng dụng | **PASS** |
| **LIVE-01** | Kiểm chứng trực tiếp endpoint Apps Script `@78` (`?action=get_lms_iam_submissions`) | Trả về JSON `{"success":true,"apolloSummary":[...],"apolloLogs":[...],"lmsCheckpoints":[]}` kết nối thông suốt với Google Sheet `1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak` | **PASS** |
| **LIVE-02** | Kiểm chứng trực tiếp `https://delivering-happiness.vercel.app/lms/app.js` | Mã nguồn trên CDN đã cập nhật hàm `extractIamAndNotesTelemetry` và `stage1_iam_cp1_sets` / `stage1_iam_cp2_sets` | **PASS** |
| **LIVE-03** | Kiểm chứng trực tiếp `https://team-happiness-iam.vercel.app` | Bản build `dpl_35M3DtTPUb9LFQGdfTmpWhdYwPBZ` đạt trạng thái `READY` trên Production | **PASS** |
