# Homepage and Assessment Hotfix Push Plan

## Scope
- Push only the local homepage grid, assessment CTA, clean home-link, and UAT evidence hotfix.
- Do not push unrelated dirty working tree files.
- Do not push the unverified DHM9 payment/config variable rename currently present in `register_dh9_hanoi.html`.

## Files Affected
- Code:
  - `index.html`
  - `styles.css`
  - `assessment.html`
  - `register.html`
  - `register_dh9_hanoi.html` clean home-link hunks only
- UAT evidence:
  - `Scripts/take_uat_screenshots.py`
  - `UAT/uat_click_results_dh9_homepage_grid_20260701.json`
  - `UAT/uat_evidence_dh9_homepage_grid_20260701.md`
  - `UAT/index_desktop_uat.png`
  - `UAT/index_mobile_uat.png`
  - `UAT/assessment_desktop_uat.png`
  - `UAT/assessment_mobile_uat.png`

## Verification Plan
- Reuse completed local Playwright UAT:
  - desktop/mobile homepage screenshots
  - desktop/mobile assessment screenshots
  - click test matrix with 8/8 PASS
- Run `git diff --check` on staged files.
- Run secret scan on staged diff before commit.
- Review `git diff --cached --name-status` before committing.

## Rollback
- If push fails, leave commits local and report exact Git error.
- If pushed commit must be reverted later, use `git revert <commit>` instead of force push.

## Approval Boundary
- User approved Codex to push in the current chat on 2026-07-01.
- This approval does not include deploy or live verification.
