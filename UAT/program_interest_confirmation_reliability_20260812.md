# UAT Report — 2026-08-12 — Program Interest Option A2

## Phạm vi và nguồn chuẩn (source of truth - nơi tham chiếu chính)

- Claim surface: `Local done` (đã kiểm chứng local), chưa phải repo/live.
- Worktree sạch: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a2-20260812`.
- Branch: `fix/program-interest-confirmation-a2-20260812`.
- Baseline/rollback commit: `b9b18c0c860e059ef616ce9df5dcb0b3d054d301` (Option A đang live trước A2).
- Frontend: `program-interest.html`.
- Harness: `UAT/program_interest_confirmation_reliability_20260812.js`.
- Local result: `UAT/evidence/program_interest_confirmation_a2_20260812/local-results.json`.
- Baseline failure: `UAT/evidence/program_interest_confirmation_a2_20260812/baseline-a1-failure.json`.
- Google Sheet dự kiến cho live UAT: [CRM Google Sheet — tab Program Interest](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit?gid=903619227#gid=903619227).
- Apps Script runtime được frontend tham chiếu: deployment `@69`; local harness chặn toàn bộ request thật.

## Root cause và thay đổi A2

Option A đã sửa lỗi timeout dừng retry sớm, nhưng UUID/fingerprint vẫn chỉ nằm
trong RAM, reload làm mất pending state, resubmit POST trước khi hỏi lại trạng
thái, và polling chỉ có 4 lần trong tối đa 45 giây. Đây là khoảng cách so với
cơ chế phục hồi của DHM9.

Option A2 bổ sung:

- `sessionStorage` (bộ nhớ theo phiên trình duyệt) key
  `PROGRAM_INTEREST_pending_v2`, chỉ lưu version, UUID, fingerprint hash 64 hex,
  phase và timestamp; không lưu payload thô.
- Preflight JSONP trước POST lại cùng payload; `recorded` thì không POST.
- Polling tối đa 10 lần, timeout 12 giây/lần, cách nhau 4 giây.
- Nút **Kiểm tra lại** chỉ poll, không POST.
- Reload tự poll cùng UUID và không tự POST.
- Payload đổi tạo UUID mới; payload chưa xác nhận giữ UUID cũ.
- Lỗi vĩnh viễn `INVALID_UUID`/UUID mismatch dừng ngay.

Không sửa Apps Script, token, env, schema, panel hoặc danh sách chương trình.

## Baseline đỏ trước sửa

Harness A2 được chạy với `PROGRAM_INTEREST_ROOT` trỏ tới worktree Option A tại
commit `b9b18c0c...`. Kết quả dừng ở AT-A2-03:

- Expected: 10 status attempts.
- Observed: 4 status attempts.
- Verdict: `EXPECTED_BASELINE_FAILURE`.
- External writes: `NONE`.

Baseline này chứng minh test mới bắt đúng khoảng trống A2; không phải lỗi giả
của harness sau sửa.

## Lệnh kiểm thử và kết quả

```text
node --check UAT\program_interest_confirmation_reliability_20260812.js
node UAT\program_interest_confirmation_reliability_20260812.js
```

Kết quả cuối: `LOCAL_A2_UAT_VERIFIED`, exit code `0`, 16 kết quả chi tiết,
`Apps Script requests continued: 0`, `External writes: NONE`.
Form SHA-256 của lượt chạy cuối: `db3e57621fa0461e5af0b7f424c1245bae4d669c639a3a2e3ea48bcd99d8d34f`.

| ID | Bề mặt quan sát | Kết quả | Trạng thái |
|---|---|---|---|
| AT-A2-01 | timeout → recorded | 1 POST, 2 status, cùng UUID, UI success | VERIFIED |
| AT-A2-02 | POST network error → recorded | Vẫn poll và UI success | VERIFIED |
| AT-A2-03 | 10 timeout | Đúng 10 status; timer 12 giây + 9 delay 4 giây; hiện retry | VERIFIED |
| AT-A2-04 | Nút Kiểm tra lại | POST delta 0; status delta 1; UI success | VERIFIED |
| AT-A2-05 | Reload pending | POST delta 0; poll cùng UUID; clear storage sau recorded | VERIFIED |
| AT-A2-06 | Resubmit cùng payload đã recorded | Preflight success; POST delta 0 | VERIFIED |
| AT-A2-07 | Resubmit cùng payload chưa recorded | Event order status:not_found → POST → status:recorded; cùng UUID | VERIFIED |
| AT-A2-08 | Payload thay đổi | UUID mới; không preflight UUID cũ | VERIFIED |
| AT-A2-09 | INVALID_UUID / mismatch | Mỗi case dừng preflight; POST delta 0 | VERIFIED |
| AT-A2-10 | Privacy audit | Storage chỉ có một state hash; URL/console không có tên/email/điện thoại/note | VERIFIED |
| AT-A2-G01 | Tắt `crypto.randomUUID()` | UUID fallback đúng 32 hex | VERIFIED |
| AT-A2-G02 | Error string bất thường | `errorCode` chuẩn hóa; không leak chuỗi vào DOM/console | VERIFIED |
| AT-A2-11 | Chrome desktop | Chrome 151, 1440×900, success | VERIFIED |
| AT-A2-11 | Brave mobile | Brave/Chromium 151, 390×844, ép tắt `randomUUID`, fallback 32 hex, success | VERIFIED |
| AT-A2-11 | Chrome incognito | Chrome 151, 390×844, ép tắt `randomUUID`, fallback 32 hex, success | VERIFIED |

## Browser evidence (bằng chứng trình duyệt)

- `UAT/evidence/program_interest_confirmation_a2_20260812/chrome-desktop-1440x900.png`:
  form desktop và success state.
- `UAT/evidence/program_interest_confirmation_a2_20260812/brave-mobile-390x844.png`:
  form mobile Brave và success state.
- `UAT/evidence/program_interest_confirmation_a2_20260812/chrome-retry-desktop-1440x900.png`:
  thông báo không khẳng định thất bại và CTA **Kiểm tra lại**.

Ảnh local có logo/font ngoài origin bị chặn có chủ đích bởi request interception;
đây không phải bằng chứng asset production hỏng. DOM/form/status CTA vẫn được
kiểm chứng trên đúng file A2.

Phạm vi panel được đối chiếu bằng hash: baseline và A2 cùng
`A19B5528E501EE333B58B0075B6907E8593ABA265DC654BFEF13B465529848CF`; không có
thay đổi markup panel. Chi tiết nằm trong
`UAT/evidence/program_interest_confirmation_a2_20260812/scope-audit.json`.

## Review gate (cổng rà soát)

Skill `ck:cook` yêu cầu tester/reviewer độc lập, nhưng công cụ điều phối agent
trong lượt này trả `unsupported call`; không có reviewer giả lập được claim.
Fallback tuần tự theo `ck:code-review` đã chạy đủ spec → quality → adversarial →
fresh verification. Bốn finding hợp lệ đã được sửa: chuẩn hóa error code, fallback
in-memory khi storage không ghi được, payload/fingerprint cùng snapshot và xóa
ví dụ nhạy cảm cũ trong deployment docs. Kết quả sau sửa: 0 CRITICAL/HIGH/MEDIUM
đang mở. Evidence: `UAT/evidence/program_interest_confirmation_a2_20260812/local-review.json`.

## Ma trận bề mặt kiểm chứng (verification surface - lớp kiểm tra)

| Bề mặt | Phương pháp | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|
| Local files | UTF-8 read-back, syntax, `git diff --check`, grep constants | A2 đúng allowlist, không sửa backend/panel | VERIFIED |
| Local Chrome/Brave/incognito | Puppeteer + request interception | AT-A2-01..11/G01 đạt; không request thật | VERIFIED |
| Apps Script deployment | Không gọi trong local lane | Backend `@69` giữ nguyên | UNVERIFIED runtime trong A2; source target không đổi |
| Google Sheet thật | Chưa ghi trong local lane | Một UUID đúng một dòng; duplicate không tăng dòng | UNVERIFIED — chờ Cấp độ 3 |
| Staged Vercel | Chưa deploy | Route/provenance/release contract đạt | UNVERIFIED — chờ Cấp độ 3 |
| Public frontend URLs (`/`, `/assessment.html`, `/register.html`, `/register_direct.html`, `/register-test.html`, `/dh8/`) | Chưa probe live trong local lane | Sáu URL trả đúng route trước khi claim Live done | UNVERIFIED — project hard-gate còn chờ staged/live |
| Production `/program-interest` | Production hiện vẫn là Option A | Alias khớp commit A2 và browser/live UAT đạt | UNVERIFIED cho A2 |
| Final verdict | Tổng hợp đúng surface | Không overclaim live từ local | `LOCAL_A2_UAT_VERIFIED` — chỉ local |

## Documentation impact

Docs touched:

- `docs/system-architecture.md`: Sheet URL/tab/gid, 25 cột và data flow A2.
- `docs/deployment-guide.md`: local browser matrix, staged gate, live one-row
  UAT và rollback.
- `docs/deployment.md`: khóa project/org Vercel trong runbook release để package
  không bị liên kết nhầm project.

Docs, plan, code và harness đều dùng cùng constants: 10 attempts, 12-second
timeout, 4-second delay, storage key `PROGRAM_INTEREST_pending_v2`. Docs không
được dùng thay runtime/staged/live verification.

## Gate tiếp theo và rollback

Local gate đã đạt. Trước external operation (thao tác ra hệ thống bên ngoài),
phải đối chiếu scoped diff, file inventory và Git status; sau đó xin đúng một
block `XÁC NHẬN CẤP ĐỘ 3` tự đủ cho commit, push, staged deployment, gated
production promote và đúng một dòng Sheet UAT thật.

Rollback source là commit Option A `b9b18c0c...`; rollback production là promote
lại deployment production ngay trước A2. Nếu bất kỳ staged/live/Sheet gate nào
không đạt, dừng và không claim `Live done`.
