# DHM9 Dual Prefix Payment Hotfix Plan

## Scope
- Fix the DHM9 registration/payment mismatch introduced by changing the frontend payment code prefix from `DH9` to `DHM9`.
- Preserve backward compatibility for existing `DH9...` payment codes.
- Keep DHM8 behavior unchanged.
- Produce a handoff prompt for Gemini to run live browser UAT after deploy.

## Files Affected
- `Scripts/active_code_gs_final.js`
- `register_dh9.js`
- `register_dh9_hanoi.html`
- `UAT/uat_evidence_dh9_homepage_grid_20260701.md` if evidence needs clarification

## Fix Design
- Backend lane detection accepts both `DH9` and `DHM9`.
- Backend DHM9 payment variants include both `DH9...` and `DHM9...` for matching old and new transfers.
- Frontend `register_dh9.js` accepts both `DH9...` and `DHM9...` for resume/checkStatus compatibility.
- Frontend sends `data.paymentCode` in the registration payload so backend and client share the same transfer content.
- HTML metadata and display text are aligned to DHM9 where this page is the DHM9 Hanoi registration page.

## Verification Plan
- Static grep for DH9/DHM9 prefix handling in frontend and backend.
- `node --check register_dh9.js`.
- Local browser/UAT script for layout and link click regression where applicable.
- `git diff --check` on affected files.
- No live/browser claim by Codex; Gemini must run live browser UAT after deploy and mirror evidence.

## Rollback
- If local verification fails, do not commit/push/deploy.
- If a later pushed commit must be reverted, use `git revert <commit>` instead of force push.

## Approval Boundary
- User asked Codex to finish the fix and prepare Gemini handoff.
- This plan does not grant deploy approval.
- Live browser UAT remains a Gemini handoff task after deploy.
