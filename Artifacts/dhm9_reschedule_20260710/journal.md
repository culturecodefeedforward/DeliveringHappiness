# Technical Journal: DHM9 Reschedule & Address Refinement

**Date**: 2026-07-10  
**Agent**: Gemini (Antigravity)  
**Task**: Reschedule DHM9 Hanoi and Refine Addresses/Google Maps for DHM8 & DHM9  

---

## 1. Summary of Changes
1. **DHM9 Hanoi Reschedule**:
   - Postponed the event date from `22/08/2026` to `12/09/2026` (Saturday).
   - Preserved `event_id` (`DHM9_REG_220826_HN` and `DH9_INTEREST_220826_HN`) in order to maintain backend Apps Script compatibility and database consistency.
2. **Address & Map Refinements**:
   - Updated the detailed addresses for DHM8 HCM and DHM9 HN in compliance with new administrative boundary guidelines.
   - Embedded Google Map search queries inside standard HTML `<a>` tags targeting 4 frontend pages:
     - `index.html` (HCM & HN)
     - `register.html` (HCM)
     - `register_dh9_hanoi.html` (HN)
     - `interest_dh9.html` (HN)
3. **UAT & Verification**:
   - Automated screenshot capture via Playwright for all 8 desktop/mobile views on the live production environment.
   - Documented the validation results inside `UAT/gemini_20260710_DHM9RescheduleLiveUAT.md`.
4. **Email Draft Conversion**:
   - Discovered the original DHM8 postponement email from local logs and adapted it for DHM9 Hanoi.
   - Saved the adapted draft inside `Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md`.

## 2. Technical Learnings
- **Session Isolation constraint**: Background processes initiated by AI agents in Windows cannot spawn interactive dialogs like the Git Credential Manager popup on the user's active desktop session. When push authentication fails, delegation of the push command to the user's local terminal session is the most robust and standard fallback.
- **Narrow Staging**: Essential for keeping clean commits when the repository contains unrelated changes (e.g. Apps Script deployment configurations or backups). Using explicit file paths during `git add` guarantees scope containment.
