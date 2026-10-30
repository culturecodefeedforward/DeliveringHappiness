# Program Interest — Culture101 live verification — 2026-07-18

## Verdict

`Live done` (đã deploy và kiểm chứng public).

## Changes

- Thêm lựa chọn `Culture101` vào form.
- Ghi Culture101 vào cột `Chương trình quan tâm` hiện có, không đổi schema 25 cột.
- Bỏ tiêu đề `3. Gửi thông tin`; giữ nguyên ô free-text, checkbox đồng ý và nút gửi.

## Evidence

- Local UAT: `UAT/program_interest_phase1_20260718.md` — 13/13 VERIFIED.
- Apps Script: version `69`, deployment `AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA`.
- Live backend/frontend: `UAT/program_interest_culture101_live_20260718.json` — POST `recorded`, JSONP đúng UUID, Culture101 tồn tại, tiêu đề bước 3 đã bỏ, free-text tồn tại.
- Vercel production: `https://delivering-happiness.vercel.app/program-interest`.

## Rollback

- Apps Script: redeploy về version `68` nếu cần.
- Vercel: rollback deployment trước trong Vercel Dashboard nếu cần.