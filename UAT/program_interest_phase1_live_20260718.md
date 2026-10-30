# Program Interest — Cấp 3 live verification — 2026-07-18

## Verdict

`Live done` (đã đưa lên môi trường public và kiểm chứng production) cho phạm vi Program Interest Phase 1.

## Evidence

- Local UAT: `UAT/program_interest_phase1_20260718.md` — 12/12 kiểm thử local/browser đạt, không ghi production.
- Apps Script remote preflight: `release_inspect_20260718/active_code_gs_final.js` có SHA-256 trùng checkpoint `Artifacts/checkpoints/20260718_program_interest_phase1_pre_edit/active_code_gs_final.pre_edit.js`.
- Apps Script push: 5 file được push; tạo version `67`.
- Deployment cập nhật: `AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA` @67.
- Ghi thật một dòng: `UAT/program_interest_phase1_live_backend_20260718.json` — `recorded`, UUID `20260718-c0de-4a11-8abc-000000000001`.
- Idempotency: cùng UUID trả `duplicate:true`; JSONP trả `state=recorded` và đúng UUID.
- Vercel production: `https://delivering-happiness.vercel.app`.
- Public probes: `UAT/program_interest_phase1_live_frontend_20260718.json` — 7/7 URL HTTP 200; homepage có CTA; form có `#interest-form`.
- Live browser: `UAT/program_interest_phase1_live_browser_20260718.json` — form tồn tại, panel ban đầu ẩn, không có console error.

## Rollback

- Apps Script: redeploy deployment trên về version trước đó (`@66`) nếu cần; giữ dòng UAT để đối soát, không xóa tự động.
- Vercel: dùng `vercel rollback` tới deployment trước nếu phát sinh lỗi public.

## Scope note

Không commit hoặc Git push. Không gửi email, không sửa Sheet NVC riêng, không đổi luồng thanh toán/đăng ký chính thức.