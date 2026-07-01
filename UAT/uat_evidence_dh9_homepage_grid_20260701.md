# UAT Evidence: Homepage Grid & Routing Update

## Scope
- Local target: `http://127.0.0.1:8000`
- Date: `2026-07-01`
- UAT script: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\take_uat_screenshots.py`
- Click result JSON: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\uat_click_results_dh9_homepage_grid_20260701.json`

## Claim Levels
| Surface | Status | Evidence |
| :--- | :--- | :--- |
| Local homepage layout | VERIFIED | Playwright screenshots below, viewport `1440x900` and `375x812` |
| Local assessment layout | VERIFIED | Playwright screenshots below, viewport `1440x900` and `375x812` |
| Local click routing | VERIFIED | `uat_click_results_dh9_homepage_grid_20260701.json`, `allPassed: true` |
| Vercel clean URL behavior | INFERRED | Source links now use `/` for home; public Vercel deployment was not tested in this UAT |
| Public/live site | UNVERIFIED | No deploy or public URL verification was performed |

## Screenshot Evidence
- Desktop homepage: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\index_desktop_uat.png`
- Mobile homepage: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\index_mobile_uat.png`
- Desktop assessment: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\assessment_desktop_uat.png`
- Mobile assessment: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\assessment_mobile_uat.png`

## Click Matrix
| Source page | Link label | Expected target | Observed target | Result |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Đăng ký TP.HCM` | `/register.html` | `/register.html` | PASS |
| `/` | `Đăng ký Hà Nội` | `/register_dh9_hanoi.html` | `/register_dh9_hanoi.html` | PASS |
| `/` | `Kiểm tra "Hệ điều hành Hạnh Phúc"` | `/assessment.html` | `/assessment.html` | PASS |
| `/register.html` | `Quay về trang chủ` | `/` | `/` | PASS |
| `/register_dh9_hanoi.html` | `Quay về trang chủ` | `/` | `/` | PASS |
| `/assessment.html` | `Thông tin chương trình` | `/` | `/` | PASS |
| `/assessment.html` | `Đăng ký TP.HCM` | `/register.html` | `/register.html` | PASS |
| `/assessment.html` | `Đăng ký Hà Nội` | `/register_dh9_hanoi.html` | `/register_dh9_hanoi.html` | PASS |

## Layout Validation
- VERIFIED: `.hero-event-grid` renders as two columns on desktop and one column on mobile.
- VERIFIED: mobile homepage no longer has horizontal overflow; measured `documentElement.clientWidth = 375` and `scrollWidth = 375`.
- VERIFIED: `assessment.html` desktop action buttons render in one row without the previous squeezed narrow nested button.
- VERIFIED: `assessment.html` mobile action buttons stack vertically and the `Đăng ký Hà Nội` button is fully visible in the rendered screenshot.

## Notes
- Codex hotfix removed the extra `.quiz-register-actions` / `.quiz-register-actions-bottom` wrapper approach and restored direct children under existing `.quiz-nav-actions` / `.summary-actions`.
- This is a Local done result only. Commit, push, deploy, and live verification remain out of scope until separately approved.
