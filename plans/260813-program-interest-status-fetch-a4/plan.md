---
title: Program Interest A4-FE fetch status hotfix
status: local-verified-awaiting-level-3
priority: P0
base_commit: faf4b49f66f56bc8e68dfc347d62b7decc18911d
branch: fix/program-interest-status-fetch-a4-20260813
created_at: 2026-08-13
---

# Program Interest A4-FE fetch status hotfix

## Tổng quan

A4-FE sửa lỗi báo thất bại giả trên form production `/program-interest` khi dữ
liệu có thể đã được Google Apps Script ghi nhưng trình duyệt không nhận được
trạng thái xác nhận. Thay đổi chỉ nằm ở frontend (mã chạy trong trình duyệt),
không sửa Apps Script, Google Sheet, `schema` (cấu trúc dữ liệu chuẩn), token
hoặc biến môi trường.

## Nguyên nhân gốc đã kiểm chứng

1. A3 tải trạng thái bằng thẻ `<script>` theo cơ chế JSONP (JSON with Padding -
   gọi API xuyên miền qua callback).
2. Trên Chrome sạch, request dừng sau phản hồi chuyển hướng HTTP 302 từ
   `script.google.com`; callback không chạy và timeout sau 10.010 ms.
3. Cùng URL, UUID và callback, `fetch GET` (gọi đọc trạng thái) theo chuyển
   hướng thành công, trả HTTP 200 sau 3.561 ms với `state=recorded` và UUID khớp.
4. DHM8/DHM9 đã dùng `fetch` cho kiểm tra trạng thái. A2/A3 chỉ chuyển state,
   retry và polling nhưng bỏ sót transport (cách vận chuyển request) này.
5. UAT A3 chặn request thật và trả mock (dữ liệu giả lập), nên không chạy qua
   chuyển hướng thật của Apps Script.

## Nguồn chuẩn

- Source base: commit `faf4b49f66f56bc8e68dfc347d62b7decc18911d`.
- Frontend: `program-interest.html`.
- Mẫu đang hoạt động: `register.js` và `register_dh9.js` ở chế độ `fetch`.
- Backend chỉ đọc để đối chiếu: `Scripts/active_code_gs_final.js`.
- Production URL: `https://delivering-happiness.vercel.app/program-interest`.
- UUID read-only đã tồn tại: `cb5016c3-e6e2-4a3d-bb67-8ab7db47b063`.

## Phạm vi và allowlist (danh sách file được phép sửa)

- `program-interest.html`.
- `UAT/program_interest_confirmation_reliability_20260812.js`.
- `UAT/program_interest_status_fetch_a4_20260813.js`.
- `UAT/program_interest_status_fetch_a4_20260813.md`.
- `UAT/evidence/program_interest_status_fetch_a4_20260813/`.
- `docs/system-architecture.md`.
- `docs/deployment-guide.md`.
- Các file trong `plans/260813-program-interest-status-fetch-a4/`.

Ngoài phạm vi: Apps Script, `schema`, token, env, panel khóa học, POST thật,
ghi/xóa Google Sheet, commit, push và deploy.

## Thiết kế sửa

1. Giữ nguyên POST `no-cors`, UUID, payload fingerprint, pending state,
   preflight, nút “Kiểm tra lại” và giới hạn 10 lần polling.
2. Đổi `requestProgramInterestStatus()` từ thẻ `<script>` sang `fetch GET` với
   `cache: no-store` và `AbortController` timeout.
3. Endpoint vẫn trả chuỗi JSONP; frontend kiểm tra chính xác prefix callback,
   hậu tố `);`, parse JSON và không thực thi chuỗi trả về.
4. Chỉ thành công khi `state=recorded` và `interestUuid` khớp tuyệt đối.
5. Timeout, lỗi mạng, HTTP lỗi và JSONP sai tiếp tục theo retry hiện tại; không
   tạo UUID mới và không POST lại.

## Các giai đoạn

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| 1 | Khóa baseline, plan và test tái hiện | Hoàn tất — `VERIFIED` |
| 2 | Sửa transport xác nhận frontend | Hoàn tất — `VERIFIED` |
| 3 | Local regression và browser UAT read-only | Hoàn tất — `VERIFIED` |
| 4 | Cập nhật docs và rà diff | Hoàn tất — `VERIFIED` |
| 5 | Commit/push/deploy production | Chờ phê duyệt Cấp độ 3 riêng |

## Kết quả Phase 1–4

- 18/18 ca hồi quy local đạt `LOCAL_A4_UAT_VERIFIED`.
- Chrome desktop, Chrome ẩn danh mobile và Brave mobile đều nhận HTTP 200,
  `state=recorded` và đúng UUID qua `fetch GET` trên endpoint thật.
- Browser probe clone response chỉ đọc và lưu duy nhất status/state/UUID;
  staged target có thể được truyền qua `PROGRAM_INTEREST_TARGET_URL`. Nếu cần
  Vercel bypass, header chỉ được gắn vào đúng target origin và không được gửi
  sang Apps Script hoặc tài nguyên bên thứ ba.
- Staged gate phải trả `STAGED_RELEASE_VERIFIED_A4`; sau promote, production
  gate phải trả `LIVE_VERIFIED_A4` trên cùng release ID/commit/manifest.
- Source SHA-256 chung giữa local và browser evidence:
  `1f82d097fb56fc0a527072ae60e600c1ea66ee99d2214b130bacbfcd330978ba`.
- `externalWrites: NONE`, `sheetMutation: NONE`, Apps Script requests tiếp tục
  trong local mock harness: `0`.
- Báo cáo: `UAT/program_interest_status_fetch_a4_20260813.md`.
- Evidence: `UAT/evidence/program_interest_status_fetch_a4_20260813/`.
- Bề mặt production A4 vẫn `UNVERIFIED`: chưa commit, push hoặc deploy.

## Kế hoạch kiểm chứng

- Static gate: không còn `document.createElement('script')` trong hàm status;
  có `fetch`, timeout, kiểm tra HTTP và parser JSONP nghiêm ngặt.
- Mock regression: các ca recorded, not_found, timeout, network, UUID mismatch,
  reload và manual retry; tổng POST không vượt quá một.
- Browser read-only: dùng UUID đã tồn tại, không submit form, xác nhận HTTP 200,
  `recorded`, UUID khớp ở Chrome; kiểm tra Chromium incognito context và Brave
  nếu executable Brave có trên máy.
- Network guard: browser UAT fail ngay nếu thấy bất kỳ POST nào hoặc request ghi
  dữ liệu.
- Docs/runtime parity: docs mô tả đúng `fetch GET` và không còn claim JSONP
  script-tag cho Program Interest A4.

## Điều kiện đạt

- Fetch status trả HTTP 200, nội dung JSONP hợp lệ, `state=recorded` và đúng UUID.
- Tất cả regression test đạt; không có POST/external write trong browser UAT.
- Apps Script, Sheet, schema, token, env và panel khóa học không đổi.
- Diff chỉ gồm allowlist; UTF-8 và `git diff --check` đạt.

## Điều kiện dừng

- Fetch không đạt trên Chrome hoặc Chromium incognito.
- Brave khả dụng nhưng không đạt.
- UUID mismatch, response không phải JSONP hợp lệ, hoặc phát sinh POST/Sheet write.
- Diff chạm file ngoài allowlist hay source base không còn đúng commit đã duyệt.

## Rollback và ranh giới phê duyệt

Local rollback là bỏ riêng diff A4 trong worktree này; không chạm production.
Production hiện vẫn ở release `faf4b49f66f5-a912281ab788`, deployment
`dpl_Dn27eSa9CRycnRYFYkkF6BknAP56`. Commit, push và deploy chỉ được thực hiện
sau một phê duyệt Cấp độ 3 riêng, có exact command (lệnh chính xác), target
(đích tác động) và rollback (kế hoạch quay lui).
