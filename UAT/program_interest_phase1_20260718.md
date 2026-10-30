# UAT Program Interest Phase 1 - 2026-07-18

## Summary
- Total checks: 13
- VERIFIED: 13
- FAILED: 0
- Scope: local-only. No Apps Script push, Sheet write, commit, Git push, or deploy.
- Browser evidence: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718

## Detailed Results
| Surface | Check | Status | Evidence | Detail |
| :--- | :--- | :--- | :--- | :--- |
| Local files | Apps Script and UAT runner syntax pass | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js |  |
| Local files | PROGRAM_INTEREST route/schema/idempotency exist | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js |  |
| Local files | form and production endpoint exist | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\program-interest.html |  |
| Local files | An toàn tâm lý, Culture101 and free-text field exist | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\program-interest.html |  |
| Browser UAT | initial conditional panels hidden | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\desktop-initial.png |  |
| Browser UAT | DHM8 confirmed success | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\desktop-dhm8-success.png | {"status":{"text":"CultureCode Team đã ghi nhận thông tin quan tâm của bạn. Chúng tôi sẽ liên hệ khi có chương trình phù hợp.","className":"status is-visible is-success"},"payload":{"type":"PROGRAM_INTEREST","event_id":"PROGRAM_INTEREST_V1","source":"Web_Program_Interest","interestUuid":"29168ac6-dffd-4568-8028-120d3b0cd667","fullName":"Nguyen Van UAT","email":"uat@example.com","phone":"+84901234567","company":"CultureCode Test","role":"Quan ly","preferredLocation":"TP.HCM","interestedPrograms":["DHM8"],"wantsDhm8":true,"wantsDhm9":false,"wantsNvc":false,"wantsAi":false,"dhmExpectation":"UAT DHM8","dhmPreferredCohort":"DHM8 TP.HCM","nvcSituation":"","nvcRelationship":"","nvcExpectation":"","aiExperienceLevel":"","aiUseCase":"","aiPreferredFormat":"","note":"","consent":true}} |
| Browser UAT | DHM9 mobile confirmed success | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\mobile-dhm9-success.png |  |
| Browser UAT | NVC conditional payload succeeds | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\desktop-nvc-success.png |  |
| Browser UAT | AI conditional payload succeeds | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\desktop-ai-success.png |  |
| Browser UAT | UUID mismatch never shows success | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\desktop-uuid-mismatch-error.png | Hệ thống chưa xác nhận đã ghi nhận. Vui lòng kiểm tra kết nối và thử gửi lại; CultureCode chưa coi lượt này là thành công. |
| Browser UAT | JSONP status error never shows success | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\desktop-status-error.png | Hệ thống chưa xác nhận đã ghi nhận. Vui lòng kiểm tra kết nối và thử gửi lại; CultureCode chưa coi lượt này là thành công. |
| Browser UAT | retry recovers and reuses UUID | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\program_interest_phase1_browser_20260718.json | {"first":{"text":"Hệ thống chưa xác nhận đã ghi nhận. Vui lòng kiểm tra kết nối và thử gửi lại; CultureCode chưa coi lượt này là thành công.","className":"status is-visible is-error"},"second":{"text":"CultureCode Team đã ghi nhận thông tin quan tâm của bạn. Chúng tôi sẽ liên hệ khi có chương trình phù hợp.","className":"status is-visible is-success"},"uuid1":"7f9e4d02-69f0-47e0-87aa-207f11883e21","uuid2":"7f9e4d02-69f0-47e0-87aa-207f11883e21"} |
| Browser UAT | homepage links Program Interest | VERIFIED | C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\program_interest_phase1_20260718\homepage-cta.png | program-interest.html |

## Surface Verification Matrix
| Surface | Status |
| :--- | :--- |
| Local files | VERIFIED |
| Browser evidence | VERIFIED |
| Apps Script deployment | UNVERIFIED - not executed in local UAT |
| Public frontend URLs | UNVERIFIED - not deployed in local UAT |
| Final verdict | UNVERIFIED local-only; live surfaces pending |
