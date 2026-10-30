# Program Interest — An toàn tâm lý + free-text live verification — 2026-07-18

## Verdict

`Live done` (đã deploy và kiểm chứng public).

## Changes

- Thêm lựa chọn `An toàn tâm lý` vào form.
- Dùng cột `Chương trình quan tâm` hiện có để lưu lựa chọn này, không đổi schema 25 cột.
- Đổi nhãn ô `Ghi chú thêm` thành `Nội dung bạn quan tâm thêm` với free-text placeholder mới.
- Giữ nguyên mã nội bộ DHM8/DHM9/NVC/AI.

## Evidence

- Local UAT: `UAT/program_interest_phase1_20260718.md` — 13/13 VERIFIED.
- Apps Script: version `68`, deployment `AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA`.
- Live backend row/status: `UAT/program_interest_psychological_safety_live_20260718.json` — `recorded`, status JSONP đúng UUID.
- Vercel production: `https://delivering-happiness.vercel.app/program-interest`.
- Live browser: `UAT/program_interest_psychological_safety_live_browser_20260718.json` — option, free-text label/placeholder tồn tại; console không lỗi.

## Rollback

- Apps Script: redeploy deployment về version `67` nếu cần.
- Vercel: rollback về deployment trước trong Vercel Dashboard nếu cần.