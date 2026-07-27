# Local UAT after source remediation — pre-commit

## Claim level

`VERIFIED LOCAL PASS`: source và UI local đã đạt release contract; chưa phải staged/live proof.

## Regression contract

- Old source ref: `b5678a5`
- Command: `node Scripts/build_release_package.js --source b5678a5 --spec release-specs/dhm10-homepage.json --check-contract-only`
- Expected/actual exit: non-zero
- Failure caught:
  - Missing `Sẽ thông báo sau khi CultureCode Team chốt lịch`
  - Found forbidden `Sẽ có thông báo sau`

Contract này chứng minh prevention gate sẽ chặn chính source cũ đang nằm ở HEAD trước bản sửa.

## Browser results

Target: `http://127.0.0.1:41727/` served trực tiếp từ clean worktree.

| Viewport | Required DOM state | Forbidden DOM state | Console/page errors | Result |
|---|---|---|---:|---|
| Desktop 1440×900 | DHM10, câu dài, DHM9 07:30, CTA `interest.html` | DHM8, câu ngắn, DHM9 08:00 | 0 | `VERIFIED PASS` |
| Mobile 390×844 | DHM10, câu dài, DHM9 07:30 | DHM8, câu ngắn, DHM9 08:00 | 0 | `VERIFIED PASS` |

Responsive evidence: desktop `scrollWidth = clientWidth = 1425`; mobile `scrollWidth = clientWidth = 375`, không có horizontal overflow.

## Evidence files

- `local_desktop_1440x900_after.png` — SHA-256 `7071CD91917D62F0EDD9F85A91E50C970FF5927EF5123D840EF8D68DC048C86F`
- `local_mobile_390x844_after.png` — SHA-256 `D77CFDCF3513E2B8DC0ED13A40A4EB912B49C5A8BD1A191D718CCC293CCC0250`

## Surface matrix

| Surface | Method | Expected | Status |
|---|---|---|---|
| Source contract | Snapshot/content assertions | Correct expected/forbidden texts | `VERIFIED PASS` on working tree |
| Old-source regression | Contract against `b5678a5` | Fail closed | `VERIFIED PASS` |
| Desktop DOM/UI | Browser 1440×900 | Correct cards/CTA/no errors | `VERIFIED PASS` |
| Mobile DOM/UI | Browser 390×844 | Correct cards/no overflow/no errors | `VERIFIED PASS` |
| Staged Vercel | Not deployed yet | Exact release headers/content | `UNVERIFIED` |
| Production | Baseline stale | Exact release | `FAILED BASELINE` |
