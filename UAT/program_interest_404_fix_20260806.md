# Program Interest 404 Fix — 2026-08-06

## Trạng thái

`PUBLIC_ROUTE_VERIFIED_RELEASE_GATE_INCOMPLETE`: bản sửa đã commit, push và
route public đã hoạt động; staged package chưa được đọc qua HTTP vì Vercel SSO
chặn URL riêng.

## Ma trận kiểm chứng

| Bề mặt | Bằng chứng | Trạng thái |
|---|---|---|
| Source/Git | Commit `a0b4b6f4cdcd`, frontend và backend cùng commit | VERIFIED |
| Release contract | Builder kiểm tra 7 route, gồm `/program-interest` | VERIFIED |
| Backend | Apps Script `checkProgramInterestStatus` trả JSONP read-only | VERIFIED |
| Browser local | Desktop 1440x900, mobile 390x844, form tồn tại, không console/page error | VERIFIED |
| Staged HTTP | Deployment `dpl_2tstTUq3tD9ktX8JrhBAeJAUZ9i6` trả 302 SSO ở `/release.json` | UNVERIFIED |
| Production alias | `/program-interest` trả HTTP 200, có form và `PROGRAM_INTEREST_V1` | VERIFIED |
| Public browser | Desktop/mobile form tải được, không console/page error | VERIFIED |

## Bản phát hành

- Release ID: `a0b4b6f4cdcd-c8fe3ee8a197`
- Staged URL: `https://delivering-happiness-omtnpwdii-vuhoang2708s-projects.vercel.app`
- Production URL: `https://delivering-happiness.vercel.app`
- Production alias deployment: `dpl_CUALTEhpSQiYXhY6roy8oXUJdBYR`
- Final verdict: `UAT/releases/a0b4b6f4cdcd-c8fe3ee8a197/final-verdict.json`

## Còn thiếu

Vercel vẫn cần một phương thức xác thực UAT staged: đăng nhập browser có quyền
vào project hoặc cấu hình bypass secret cho automation. Route public đã được
kiểm chứng; release identity của Git auto-deploy chưa có header nên không claim
full immutable release verification.
