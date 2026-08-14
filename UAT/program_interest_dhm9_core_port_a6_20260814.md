# Program Interest A6 — local/browser UAT

## Phạm vi và claim level

- Source: `program-interest.html`, commit baseline `16bcaea4a579b64104ba16a502bd08ba91e5f9bf`.
- Target: fake Apps Script local `127.0.0.1`; không gọi endpoint production.
- Claim: `VERIFIED local/browser`; production, Google Sheet và Apps Script deploy là `UNVERIFIED` trong lane này.
- External writes: `NONE`.

## Root cause và sửa

| ID | Evidence | Sửa A6 |
|---|---|---|
| H-01 | Baseline Chrome gửi GET status trước POST settlement | `await postProgramInterest(payload)` trước `confirmRecorded(uuid)` |
| H-02 | Backend kiểm họ tên/phone/email nhưng frontend chỉ `required` | Adapter field validation khớp họ tên/phone/email contract trước POST |
| H-04 | Retry button hiện trước cleanup nên click sớm bị bỏ qua | Button disabled khi confirmation đang chạy, enabled sau cleanup |

Baseline đỏ: `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/red-baseline-chrome-diagnostic.json`.
Nó ghi POST payload giả hợp lệ, GET status xuất hiện 3 ms trước POST settle và
họ tên whitespace và phone `abc` vẫn có thể phát POST.

## Kết quả cuối

Command:

```text
node UAT/program_interest_dhm9_core_port_a6_20260814.js
```

Verdict: `LOCAL_A6_UAT_VERIFIED` — 19/19 case pass.

| Case | Chrome desktop | Chrome ẩn danh mobile | Brave mobile |
|---|---:|---:|---:|
| S-01 source contract | Pass | chung | chung |
| B-01 valid submit | Pass | Pass | Pass |
| B-02 invalid phone, POST=0 | Pass | Pass | Pass |
| B-03 blank full name, POST=0 | Pass | Pass | Pass |
| B-04 pending retry, GET-only | Pass | Pass | Pass |
| B-05 field blur isolation | Pass | Pass | Pass |
| B-06 POST timeout, same UUID | Pass | Pass | Pass |

Evidence JSON: `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/rerun-20260814.json`.

Compatibility regression A2/A4/A6 cũng đạt `LOCAL_A6_COMPAT_UAT_VERIFIED` với
`appsScriptRequestsContinued=0`, retry 10 lần, reload recovery, preflight UUID,
fallback UUID 32 hex và browser matrix. Đặc biệt AT-A6-01 giữ POST pending để
chứng minh status GET = 0 trước settlement, rồi đúng 1 sau settlement. Evidence:
`UAT/evidence/program_interest_dhm9_core_port_a6_20260814/compat-a2-a4/local-results-rerun/local-results.json`.

AT-A6-01 mới xác nhận `statusCount=0` trong lúc POST còn pending và đúng một
GET sau khi POST settle; `appsScriptRequestsContinued=0` và `externalWrites=NONE`.

Ảnh chính:

- `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/chrome-desktop-valid-success.png`
- `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/chrome-incognito-mobile-invalid-phone.png`
- `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/brave-mobile-pending-retry-success.png`

Google Fonts được harness chặn trước mạng để giữ UAT local-only; không ảnh hưởng
luồng submit. Payload chỉ chứa dữ liệu UAT giả và evidence không chứa secret.

## Ranh giới còn lại

Không commit, push, deploy, rollback hoặc ghi/xóa Google Sheet trong kết quả này.
Trước production cần một phê duyệt Cấp độ 3 riêng cho exact command, immutable
release target, rollback và tối đa một dòng Sheet UAT thật.
