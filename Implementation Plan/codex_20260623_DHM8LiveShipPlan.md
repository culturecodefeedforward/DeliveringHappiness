# Codex Plan - DHM8 Live Ship - 2026-06-23

## Scope

Ship the already verified DH8 changes so a real tester can retest production:

- DH8 referrer source UI in `register.html` and `dh8/index.html`.
- DH8 frontend handling for duplicate/ambiguous payment polling in `register.js`.
- Apps Script source mirror in `Scripts/active_code_gs_final.js` for the duplicate-phone backend already deployed to active Apps Script.
- UAT artifacts produced by Codex for local browser verification and backend recovery evidence.

## Files Allowed To Stage

- `register.html`
- `dh8/index.html`
- `register.js`
- `Scripts/active_code_gs_final.js`
- `UAT/codex_20260623_DHM8BrowserUAT.md`
- `UAT/dhm8_duplicate_phone_guardrail_uat_20260623.md`
- `UAT/dhm8_duplicate_phone_guardrail_mock_test_20260623.js`
- `UAT/dhm8_referrer_ui_browser_probe_20260623.js`
- `UAT/dhm8_referrer_ui_browser_probe_20260623.json`
- `UAT/screenshots/dhm8_referrer_ui_20260623/*.png`

## Files Explicitly Not Allowed To Stage

- `.vercel/project.json`
- `api/sepay-dh.js`
- `Artifacts/**` unless separately approved
- `register-test.html`
- `tracking.js`
- `task.md`
- `full_chat_log*.md`
- Other untracked implementation plans, docs, temp scripts, and generated data outside the allowlist.

## Verification Plan

Before commit/push/deploy:

- `node --check register.js`
- `node --check Scripts/active_code_gs_final.js`
- `node UAT/dhm8_duplicate_phone_guardrail_mock_test_20260623.js`
- Re-run the Codex local browser probe if needed.
- Confirm staged diff contains only allowlisted paths.

After push/deploy:

- Probe `https://delivering-happiness.vercel.app/register.html` and verify the production DOM contains `input[name="referrerSource"]`.
- Verify visible options include `GEM Global`, `Smart Train`, and `Nguồn khác`.
- Do not submit production form unless separately approved.

## Rollback / Backup

- Rollback via Git revert of the shipping commit if frontend production regresses.
- Apps Script backend rollback is separate and already deployed; this ship primarily syncs source and frontend.

## Approval Boundary

Direct user approval was given in chat: "mày làm hết để bạn tao test lại đi".

This approval covers staging the allowlist, committing, pushing, deploying the frontend live, and verifying the production page. It does not cover submitting a real production duplicate registration or any further manual Google Sheet mutation.
