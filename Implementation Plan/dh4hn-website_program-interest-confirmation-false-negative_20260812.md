# Incident + Implementation Plan: Program Interest báo thất bại giả khi xác nhận ghi nhận

Created: 2026-08-12, Asia/Bangkok  
Status: `OPTION A2 APPROVED — LOCAL IMPLEMENTATION/UAT VERIFIED; AWAITING CẤP ĐỘ 3`
Scope: `/program-interest` — chỉ sửa cơ chế gửi/xác nhận và khả năng chẩn đoán lỗi; không sửa nội dung/panel khóa học

## Terminology Notes

- `false negative` (báo thất bại giả): giao diện báo lỗi dù dữ liệu có thể đã được ghi.
- `JSONP` (JSON with Padding - gọi kiểm tra trạng thái khác miền bằng thẻ script).
- `no-cors` (chế độ gửi khác miền nhưng không đọc được phản hồi).
- `idempotency` (gửi lại cùng mã mà không tạo dòng trùng).
- `retry` (thử lại có giới hạn).
- `staged deployment` (bản triển khai thử tách khỏi địa chỉ production).
- `rollback` (đưa hệ thống về phiên bản trước).

## 1. Executive Summary

Bản trước Option A gửi `POST` tới Google Apps Script bằng `no-cors`, sau đó dùng JSONP để hỏi lại theo `interestUuid`. Hàm `confirmRecorded()` khi đó có vòng lặp 5 lần nhưng lại ném lỗi ngay khi lần đầu gặp `STATUS_TIMEOUT`; vì vậy vòng retry không chạy đúng ý đồ. Tất cả lỗi gửi/xác nhận sau đó bị gom vào một thông báo duy nhất.

Option A đã sửa lỗi retry dừng sớm và đã lên production ở release
`b9b18c0c860e-938d7d5324a7`, nhưng ảnh lỗi thật ngày 12/08 cho thấy cơ chế đó
vẫn chưa đủ bền: UUID và fingerprint chỉ tồn tại trong RAM, reload làm mất
trạng thái, bấm gửi lại luôn POST trước khi hỏi trạng thái, và chỉ poll 4 lần.

Phương án hiện hành đã được phê duyệt là **Option A2 — áp dụng cơ chế phục hồi
của DHM9 cho Program Interest**:

1. Lưu UUID, fingerprint dạng hash và trạng thái pending vào `sessionStorage`
   (bộ nhớ theo phiên trình duyệt); không lưu payload chứa dữ liệu cá nhân.
2. Trước mọi POST lại của cùng payload, hỏi trạng thái theo UUID trước; nếu đã
   `recorded` thì hoàn tất mà không POST.
3. Lỗi tạm thời (`not_found`, timeout, lỗi tải JSONP, lỗi máy chủ tạm thời) phải
   retry tối đa 10 lần, timeout 12 giây/lần và cách nhau 4 giây.
4. Nút “Kiểm tra lại” chỉ poll, tuyệt đối không POST.
5. Khi reload, tự đọc pending state và tiếp tục kiểm tra cùng UUID, không POST tự động.
6. Lỗi vĩnh viễn (`INVALID_UUID`, UUID phản hồi không khớp) dừng ngay.
7. Dù `fetch()` báo lỗi mạng, frontend vẫn kiểm tra trạng thái theo UUID vì
   backend có thể đã ghi trước khi kết nối bị ngắt.
8. Hết lượt thử chỉ báo “chưa kiểm tra được”, giữ UUID và hiện nút kiểm tra lại.
9. Gắn mã lỗi không chứa dữ liệu cá nhân vào DOM/console để lần sau xác định đúng điểm hỏng.

Không sửa UUID fallback vì bản hiện hành đã sinh 32 ký tự hex hợp lệ. Không sửa Google Apps Script, tên tab hoặc schema 25 cột.

## 2. User-Visible Symptoms

- Sau khi bấm **Gửi thông tin quan tâm**, giao diện báo: “Hệ thống chưa xác nhận đã ghi nhận...”.
- Cùng thông báo xuất hiện cho nhiều nguyên nhân khác nhau: `POST` lỗi, JSONP timeout, JSONP bị chặn, backend trả lỗi hoặc UUID không khớp.
- Người dùng không biết dữ liệu đã vào Sheet hay chưa và có nguy cơ gửi lại nhiều lần.

## 3. Current Technical State

- Frontend production: `program-interest.html` gọi đúng Apps Script deployment `AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA`.
- Apps Script production: deployment `@69`, handler `PROGRAM_INTEREST`, tab `Program Interest` và endpoint `checkProgramInterestStatus` đang tồn tại.
- UUID frontend hiện dùng `crypto.randomUUID()` hoặc fallback `createHexToken()` dài 32 ký tự hex; backend chấp nhận cả hai định dạng.
- Public route hiện trả HTTP 200; Chromium và Brave đọc được JSONP `recorded` cho UUID đã có.
- `confirmRecorded()` hiện coi `STATUS_TIMEOUT` là lỗi dừng ngay, mâu thuẫn với vòng lặp retry bao quanh.
- `catch` cuối của submit chỉ hiển thị một thông báo chung, không lưu loại lỗi.
- Working tree hiện rất bẩn và branch local đang `behind`; implementation không được thực hiện trực tiếp trên checkout này.
- Option A production hiện dùng 4 lần poll trong tối đa 45 giây và chỉ giữ
  `pendingInterestUuid`/fingerprint trong RAM; đây là baseline của A2.
- Clean worktree A2 được khóa trực tiếp từ commit Option A
  `b9b18c0c860e059ef616ce9df5dcb0b3d054d301`; không copy `.env` hay file bẩn.

## 4. Evidence Collected

| Bằng chứng | Trạng thái | Kết luận được phép |
|---|---|---|
| `program-interest.html:748-867` | `VERIFIED` | POST dùng `no-cors`; xác nhận bằng JSONP; timeout 8 giây; `STATUS_TIMEOUT` bị throw ngay; UI gom lỗi |
| `Scripts/active_code_gs_final.js:1202-1205` | `VERIFIED` | Backend chấp nhận 32 hex và UUID chuẩn |
| `Scripts/active_code_gs_final.js:1427-1436` | `VERIFIED` | Status endpoint phân biệt `recorded`, `not_found`, `error` |
| `clasp deployments` | `VERIFIED` | Endpoint frontend dùng đang trỏ Apps Script `@69` |
| Public HTML so với local sau chuẩn hóa line ending | `VERIFIED` | Public đang dùng `return createHexToken()`; không có fallback base36 |
| Probe Chromium/Brave read-only | `VERIFIED` | JSONP public trả `recorded` cho UUID có thật và `INVALID_UUID` cho chuỗi base36 |
| Google Sheet CSV tab `Program Interest` | `VERIFIED` | Tab đích còn dữ liệu ngày 08/08 và các dòng kiểm thử 12/08 |
| Ảnh lỗi `Screenshot 2026-08-11 172423.png` | `VERIFIED` ở bề mặt UI | Giao diện đã đi vào nhánh lỗi chung; ảnh không chỉ ra lỗi con nào |
| Trigger chính xác của lượt 11/08 | `UNVERIFIED` | Không có mã lỗi/attempt log nên không thể phân biệt timeout, network hay upstream error cho đúng lượt đó |

## 5. Root Causes

### RC-1 — HIGH — Retry state machine sai

`confirmRecorded()` được viết với tối đa 5 lần thử nhưng `catch` lại throw ngay khi gặp `STATUS_TIMEOUT`. Một lần Apps Script khởi động chậm hoặc một lần JSONP chậm hơn 8 giây đủ làm toàn bộ submit kết thúc lỗi.

### RC-2 — HIGH — Kết quả POST không quan sát được

`fetch(..., mode: 'no-cors')` chỉ trả opaque response, nên frontend không biết backend đã ghi, từ chối hay trả lỗi. Nếu kết nối lỗi sau khi backend append row, frontend vẫn có thể coi lượt gửi thất bại.

### RC-3 — HIGH — Mất thông tin chẩn đoán

Nhánh `catch` cuối gom mọi lỗi vào một thông báo. Không có `errorCode`, số lần thử hoặc trạng thái cuối để phân biệt lỗi ghi với lỗi xác nhận.

### RC-4 — HIGH — Trạng thái pending không bền qua reload/resubmit

Option A chỉ giữ UUID/fingerprint trong biến JavaScript của trang. Reload làm
mất khóa idempotency phía client; bấm gửi lại không có preflight và có thể POST
lại trước khi biết dòng cũ đã tồn tại. Đây là khoảng cách chính so với DHM9.

### Không phải root cause hiện tại

- Không phải fallback UUID base36: source local/public hiện không có logic đó.
- Không phải sai Google Sheet đích: tab `Program Interest` trong CRM đã được xác minh có dữ liệu.
- Không có bằng chứng Brave chặn endpoint hoàn toàn: probe Brave read-only đã nhận JSONP thành công.

## 6. Generalized Pattern or Design Flaw

Luồng đang tách một hành động thành hai kênh khác nhau:

`Browser -> no-cors POST -> Apps Script -> Sheet`  
`Browser -> JSONP GET -> Apps Script -> Sheet lookup`

Nếu kênh đầu hoàn thành nhưng kênh thứ hai chậm hoặc gián đoạn, UI tạo false negative. Đây là giới hạn kiến trúc hiện tại; Option A giảm và kiểm soát rủi ro, nhưng chưa xóa hoàn toàn sự phụ thuộc chéo miền.

## 7. Proposed Changes

### File allowlist của implementation được duyệt

| File | Hành động | Nội dung |
|---|---|---|
| `program-interest.html` | Modify | Sửa state machine gửi/xác nhận, phân loại lỗi, retry hữu hạn và thông báo không khẳng định sai |
| `UAT/program_interest_confirmation_reliability_20260812.js` | Modify | Mở rộng regression test cho persistence/preflight/reload/Chrome/Brave/incognito |
| `UAT/program_interest_confirmation_reliability_20260812.md` | Modify | Báo cáo evidence A2 local/staged/live |
| `docs/system-architecture.md` | Modify | Cập nhật luồng retry và trạng thái “chưa kiểm tra được” |
| `docs/deployment-guide.md` | Modify | Cập nhật ca UAT xác nhận timeout/idempotency |
| `docs/deployment.md` | Modify | Khóa project/org Vercel trong runbook release provenance |
| `Implementation Plan/dh4hn-website_program-interest-confirmation-false-negative_20260812.md` | Already created | Plan phê duyệt và nguồn quyết định |

`Scripts/active_code_gs_final.js`, `.clasp.json`, Sheet và Apps Script deployment là **read-only/out of scope** cho Option A.

### Thay đổi logic bắt buộc

1. `requestProgramInterestStatus()` timeout từng request ở 12 giây và trả mã lỗi có cấu trúc.
2. `confirmRecorded()` dùng tối đa 10 lần thử, cách nhau 4 giây:
   - `recorded` + đúng UUID: thành công.
   - `not_found`, `STATUS_TIMEOUT`, `STATUS_NETWORK_ERROR` và lỗi upstream tạm thời: retry với backoff hữu hạn.
   - `INVALID_UUID`, `STATUS_UUID_MISMATCH`: dừng ngay.
3. Ghi pending state vào `sessionStorage` trước POST, gồm version, UUID,
   fingerprint dạng hash, phase và thời điểm; cấm lưu payload thô/PII.
4. Cùng payload phải giữ nguyên UUID qua retry, resubmit và reload.
5. Trước POST lại cùng fingerprint, poll một lần:
   - `recorded` + UUID khớp: success, không POST.
   - chưa xác nhận/lỗi tạm thời: POST lại cùng UUID rồi chạy polling đầy đủ.
   - lỗi vĩnh viễn: dừng, không POST.
6. Nếu `fetch()` throw, không dừng ngay; vẫn chạy xác nhận theo UUID.
7. Khi hết lượt xác nhận:
   - Không hiển thị “chưa ghi nhận”.
   - Hiển thị: “Hệ thống chưa kiểm tra được trạng thái ghi nhận. Bạn có thể bấm gửi lại; hệ thống sẽ dùng cùng mã và không tạo dòng trùng.”
8. Hiện nút “Kiểm tra lại”; handler của nút chỉ gọi status polling và không có
   đường chạy tới POST.
9. Khi load trang, nếu pending state hợp lệ thì tự poll cùng UUID; không POST tự động.
10. Chuẩn hóa `errorCode` về allowlist ký tự `[A-Z0-9_]` trước khi ghi DOM/console;
    chỉ log `{ code, attempts }`, cấm log payload, email, điện thoại, họ tên hoặc nội dung người dùng.
11. Không đổi panel chi tiết, danh sách chương trình hoặc data contract.

## 8. Implementation Options

### Option A — Đã triển khai, giữ làm baseline lịch sử

Đã sửa frontend state machine 4 lần/45 giây ở release
`b9b18c0c860e-938d7d5324a7`, nhưng chưa có persistence/preflight/reload recovery.

Ưu điểm:

- Chạm đúng lỗi đã xác nhận trong code.
- Không thêm API, secret, env hoặc backend deployment.
- Có thể rollback bằng một file frontend.
- Giữ nguyên idempotency hiện hành.

Giới hạn đã được ảnh lỗi thật làm lộ ra:

- Vẫn phụ thuộc JSONP cho xác nhận cuối cùng.
- Không đọc trực tiếp được response của POST.

### Option A2 — Approved và là phạm vi thực thi hiện hành

Giữ nguyên backend Option A, bổ sung `sessionStorage`, fingerprint dạng hash,
preflight trước POST lại, polling 10 × 12 giây cách 4 giây, nút “Kiểm tra lại”
không POST và tự phục hồi sau reload. Đây là thay đổi frontend có rollback một
commit, không cần proxy, token, env hay schema mới.

### Option B — Deferred, không nằm trong approval này

Thêm Vercel same-origin proxy `/api/program-interest` để frontend đọc trực tiếp phản hồi Apps Script, chỉ dùng JSONP khi upstream outcome mơ hồ.

Ưu điểm: giải quyết kiến trúc `no-cors` tận gốc hơn.  
Nhược điểm: thêm API production, kiểm soát spam/rate limit, cấu hình runtime, release surface và blast radius lớn hơn. Chỉ mở plan riêng nếu Option A vẫn tái phát có evidence.

## 9. Risks and Mitigations

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Người dùng chờ lâu hơn | MEDIUM | Tối đa 10 lần; hiển thị trạng thái “đang xác nhận lần n”; có nút kiểm tra lại |
| Polling nhiều Apps Script | MEDIUM | 12 giây/lần, cách 4 giây, dừng ngay khi recorded/permanent error, khóa poll đồng thời |
| Gửi lại tạo trùng | LOW | Giữ cùng UUID; backend đã kiểm tra cột UUID trước append |
| PII nằm trong sessionStorage | HIGH | Chỉ lưu fingerprint hash; test cấm họ tên/email/điện thoại trong storage |
| Lộ dữ liệu cá nhân qua log | HIGH | Chỉ log code/attempt count; test cấm payload/PII trong console và URL |
| Trộn nhầm dirty worktree | HIGH | Thực hiện trong clean worktree khóa từ commit rollback Option A `b9b18c0c860e059ef616ce9df5dcb0b3d054d301`; stage allowlist tuyệt đối |
| Local test đạt nhưng live vẫn lỗi | HIGH | Staged browser UAT và một live write/read-back có phê duyệt Cấp độ 3 riêng |
| Thay đổi ngoài scope panel/UI | MEDIUM | Diff gate cấm sửa markup/CSS/panelConfig ngoài phần submit/status |

## 10. Expected Outputs

- Một patch frontend khu trú trong các hàm gửi/xác nhận/trạng thái và style của nút retry.
- Regression suite chứng minh persistence, preflight, reload recovery và retry không POST.
- Báo cáo UAT có ma trận `Local files / Browser / Apps Script / Sheet / Public URL`.
- Docs mô tả đúng hành vi sau sửa.
- Không có Apps Script version mới, schema mới, email, payment hoặc thay đổi panel.

### Acceptance Tests A2 bắt buộc

| ID | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| AT-A2-01 | `timeout -> recorded` | UI success; 2 status request; cùng UUID |
| AT-A2-02 | POST throw nhưng status `recorded` | UI success; không báo thất bại giả |
| AT-A2-03 | 10 lần đều timeout/network | Đúng 10 status request; timeout cấu hình 12 giây, delay 4 giây; hiện retry |
| AT-A2-04 | Bấm “Kiểm tra lại” | Chỉ phát status request; số POST không tăng; recorded thì success |
| AT-A2-05 | Reload khi pending | Tự poll cùng UUID; không POST; recorded thì clear storage |
| AT-A2-06 | Submit lại cùng payload đã recorded | Preflight success; không POST lại |
| AT-A2-07 | Submit lại cùng payload chưa recorded | Preflight trước; POST cùng UUID; không tạo UUID mới |
| AT-A2-08 | Payload đổi | Fingerprint đổi và dùng UUID mới |
| AT-A2-09 | `INVALID_UUID` hoặc UUID mismatch | Dừng ngay; không POST ở preflight lỗi vĩnh viễn |
| AT-A2-10 | Privacy audit | Storage/URL/console không chứa họ tên, email, điện thoại hoặc payload thô |
| AT-A2-11 | Chrome, Brave và incognito; desktop/mobile | Tất cả chạy local với request interception; không gọi Apps Script thật |
| AT-A2-G02 | Backend trả error string bất thường | `errorCode` được chuẩn hóa; không leak chuỗi vào DOM/console |
| AT-A2-12 | Staged/live có kiểm soát | Route đúng release; đúng một UUID ghi một dòng và read-back `recorded` |

AT-A2-12 là Sheet mutation thật và chỉ chạy sau phê duyệt Cấp độ 3 riêng.

## 11. Execution Plan After Approval

### Phase 0 — Isolation và baseline

1. Tạo clean worktree/branch trực tiếp từ commit Option A `b9b18c0c...`.
2. Ghi commit SHA, endpoint `@69`, file hash và baseline status vào UAT report.
3. Xác nhận allowlist; không copy dirty files ngoài phạm vi từ checkout hiện tại.

### Phase 1 — Regression tests trước sửa

1. Mở rộng harness thành AT-A2-01 đến AT-A2-11 bằng Puppeteer/request interception.
2. Chạy test A2 trên baseline Option A để chứng minh persistence/reload/preflight còn thiếu.

### Phase 2 — Implement Option A2

1. Sửa riêng state machine và style nút retry trong `program-interest.html`.
2. Không sửa Apps Script hoặc UUID generator ngoài việc giữ regression guard.
3. Rà diff theo allowlist và kiểm tra UTF-8.

### Phase 3 — Local verification

1. Chạy syntax check và toàn bộ AT-A2-01 đến AT-A2-11.
2. Chạy Chrome, Brave và incognito ở desktop/mobile trên local HTTP server.
3. Ghi report và evidence repo-visible.

### Phase 4 — Documentation impact

1. Cập nhật `docs/system-architecture.md`, `docs/deployment-guide.md` và
   `docs/deployment.md`.
2. Đối chiếu docs với code/test; docs không thay runtime UAT.

### Phase 5 — Handoff trước production

1. Chụp `git status --short --branch` trong clean worktree.
2. Phân loại file stage được và file ngoài scope.
3. Dừng xin một block Cấp độ 3 tự đủ cho commit, push, staged deploy, promote
   production có gate, và đúng một AT-A2-12 Sheet write/read-back.

## 12. Open Questions

Không còn câu hỏi thiết kế chặn Option A2. Trigger chính xác của lượt 11/08 vẫn không thể hồi cứu do source cũ không lưu error code; mục tiêu của plan là sửa lỗi đã xác nhận và tạo evidence để lần sau không mất nguyên nhân.

## 13. Notes for Other Agents

- Không áp dụng plan UUID fallback của Gemini trong brain; public hiện đã dùng 32 hex.
- Không sửa panel chi tiết theo yêu cầu User.
- Không claim fixed/live nếu mới đạt local AT-A2-01 đến AT-A2-11.
- Không dùng checkout dirty hiện tại làm release source.
- Không được coi plan approval là quyền commit/push/deploy/Sheet write.

## 14. Final Assessment

**Phán quyết rà soát:** `OPTION A2 APPROVED`.

Option A2 đóng khoảng trống persistence/preflight/reload còn lại của Option A,
giữ blast radius ở frontend và rollback rõ. Option B chỉ được xem xét bằng plan
mới nếu A2 vẫn tái phát kèm network/runtime evidence thật.

**Operational authorization:** User đã trực tiếp phê duyệt Option A2 và phạm vi
implementation/UAT trong phiên hiện tại. Các thao tác Cấp độ 3
(commit/push/deploy/promote và ghi Google Sheet thật) vẫn phải dừng ngay trước
từng lệnh để xác nhận exact command (lệnh cụ thể), target (đích tác động) và
rollback (kế hoạch quay lui) theo shared rules. Không dùng approval này để sửa
Apps Script, token, env, schema hoặc panel khóa học.

## 15. Historical Option A checkpoint (2026-08-12; STALE/ARCHIVE)

- Historical clean worktree: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn_program_interest_fix_20260812`
- Historical source baseline: `origin/main` at `a0b4b6f4cdcdf22582e4245ccba797752a37323b`
- Implemented: `program-interest.html` Option A state machine.
- Added regression harness: `UAT/program_interest_confirmation_reliability_20260812.js`.
- Docs touched: `docs/system-architecture.md`, `docs/deployment-guide.md`.
- Local UAT: AT-01 through AT-10 passed in the harness; evidence is mirrored in
  `UAT/program_interest_confirmation_reliability_20260812.md`.
- Historical remaining gates at that checkpoint: commit, push, staged deployment,
  one real Sheet UAT row/read-back, and production promote. They are superseded by
  the A2 checkpoint below; Apps Script deployment remains read-only at `@69`.

## 16. Option A2 checkpoint (2026-08-12)

- Clean worktree: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a2-20260812`
- Branch: `fix/program-interest-confirmation-a2-20260812`
- Immutable rollback/source commit: `b9b18c0c860e059ef616ce9df5dcb0b3d054d301`
- A2 SHA-256 `program-interest.html` after final local run:
  `db3e57621fa0461e5af0b7f424c1245bae4d669c639a3a2e3ea48bcd99d8d34f`
- User approval: Option A2 local implementation plus local Chrome/Brave/incognito
  UAT with all Apps Script requests intercepted; no external writes.
- Implemented: persistent UUID/hash/phase state, preflight before repeat POST,
  10 × 12-second polling with 4-second delay, check-only retry and reload recovery.
- Local UAT: `LOCAL_A2_UAT_VERIFIED`; Chrome, Brave and Chrome incognito passed;
  fallback UUID guard and error-code sanitization passed; 16 result records;
  `Apps Script requests continued: 0`, external writes `NONE`.
- Evidence: `UAT/evidence/program_interest_confirmation_a2_20260812/`.
- Cấp độ 3 remains required for commit, push, deployment and one real Sheet row.
