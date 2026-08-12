# Incident + Implementation Plan: Program Interest báo thất bại giả khi xác nhận ghi nhận

Created: 2026-08-12, Asia/Bangkok  
Status: `OPTION A APPROVED — LOCAL IMPLEMENTATION/UAT IN PROGRESS`  
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

Form hiện gửi `POST` tới Google Apps Script bằng `no-cors`, sau đó dùng JSONP để hỏi lại theo `interestUuid`. Hàm `confirmRecorded()` có vòng lặp 5 lần nhưng lại ném lỗi ngay khi lần đầu gặp `STATUS_TIMEOUT`; vì vậy vòng retry không chạy đúng ý đồ. Tất cả lỗi gửi/xác nhận sau đó bị gom vào một thông báo duy nhất.

Phương án được đề nghị phê duyệt là **Option A — sửa máy trạng thái xác nhận ở frontend**:

1. Lỗi tạm thời (`not_found`, timeout, lỗi tải JSONP, lỗi máy chủ tạm thời) phải retry trong ngân sách thời gian hữu hạn.
2. Lỗi vĩnh viễn (`INVALID_UUID`, UUID phản hồi không khớp) dừng ngay.
3. Dù `fetch()` báo lỗi mạng, frontend vẫn phải kiểm tra trạng thái theo UUID vì backend có thể đã ghi trước khi kết nối bị ngắt.
4. Kết quả hết thời gian được hiển thị là “chưa kiểm tra được” thay vì khẳng định “chưa ghi”; giữ nguyên UUID để người dùng gửi lại mà không tạo dòng trùng.
5. Gắn mã lỗi không chứa dữ liệu cá nhân vào DOM/console để lần sau xác định đúng điểm hỏng.

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
| `UAT/program_interest_confirmation_reliability_20260812.js` | Create | Regression test bằng browser/request interception |
| `UAT/program_interest_confirmation_reliability_20260812.md` | Create | Báo cáo evidence local/staged/live |
| `docs/system-architecture.md` | Modify | Cập nhật luồng retry và trạng thái “chưa kiểm tra được” |
| `docs/deployment-guide.md` | Modify | Cập nhật ca UAT xác nhận timeout/idempotency |
| `Implementation Plan/dh4hn-website_program-interest-confirmation-false-negative_20260812.md` | Already created | Plan phê duyệt và nguồn quyết định |

`Scripts/active_code_gs_final.js`, `.clasp.json`, Sheet và Apps Script deployment là **read-only/out of scope** cho Option A.

### Thay đổi logic bắt buộc

1. `requestProgramInterestStatus()` tiếp tục timeout từng request ở 8 giây nhưng phải trả mã lỗi có cấu trúc.
2. `confirmRecorded()` dùng tối đa 4 lần thử, tổng ngân sách không quá 45 giây:
   - `recorded` + đúng UUID: thành công.
   - `not_found`, `STATUS_TIMEOUT`, `STATUS_NETWORK_ERROR` và lỗi upstream tạm thời: retry với backoff hữu hạn.
   - `INVALID_UUID`, `STATUS_UUID_MISMATCH`: dừng ngay.
3. Nếu `fetch()` throw, không dừng ngay; vẫn chạy xác nhận theo UUID.
4. Cùng payload và cùng trang phải giữ nguyên `pendingInterestUuid` cho mọi lần retry/resubmit.
5. Khi hết ngân sách xác nhận:
   - Không hiển thị “chưa ghi nhận”.
   - Hiển thị: “Hệ thống chưa kiểm tra được trạng thái ghi nhận. Bạn có thể bấm gửi lại; hệ thống sẽ dùng cùng mã và không tạo dòng trùng.”
6. Gắn `statusBox.dataset.errorCode` và `console.warn` chỉ với `{ code, attempts }`; cấm log payload, email, điện thoại, họ tên hoặc nội dung người dùng.
7. Không đổi layout, panel chi tiết, danh sách chương trình hoặc data contract.

## 8. Implementation Options

### Option A — Recommended và nằm trong phạm vi phê duyệt

Sửa frontend state machine như Mục 7.

Ưu điểm:

- Chạm đúng lỗi đã xác nhận trong code.
- Không thêm API, secret, env hoặc backend deployment.
- Có thể rollback bằng một file frontend.
- Giữ nguyên idempotency hiện hành.

Giới hạn:

- Vẫn phụ thuộc JSONP cho xác nhận cuối cùng.
- Không đọc trực tiếp được response của POST.

### Option B — Deferred, không nằm trong approval này

Thêm Vercel same-origin proxy `/api/program-interest` để frontend đọc trực tiếp phản hồi Apps Script, chỉ dùng JSONP khi upstream outcome mơ hồ.

Ưu điểm: giải quyết kiến trúc `no-cors` tận gốc hơn.  
Nhược điểm: thêm API production, kiểm soát spam/rate limit, cấu hình runtime, release surface và blast radius lớn hơn. Chỉ mở plan riêng nếu Option A vẫn tái phát có evidence.

## 9. Risks and Mitigations

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Người dùng chờ lâu hơn | MEDIUM | Giới hạn tổng <=45 giây; hiển thị trạng thái “đang xác nhận lần n” |
| Polling quá nhiều Apps Script | MEDIUM | Tối đa 4 lần, backoff, dừng ngay khi recorded/permanent error |
| Gửi lại tạo trùng | LOW | Giữ cùng UUID; backend đã kiểm tra cột UUID trước append |
| Lộ dữ liệu cá nhân qua log | HIGH | Chỉ log code/attempt count; test cấm payload/PII trong console và URL |
| Trộn nhầm dirty worktree | HIGH | Thực hiện trong clean worktree từ commit `origin/main` đã khóa; stage allowlist tuyệt đối |
| Local test đạt nhưng live vẫn lỗi | HIGH | Staged browser UAT và một live write/read-back có phê duyệt Cấp độ 3 riêng |
| Thay đổi ngoài scope panel/UI | MEDIUM | Diff gate cấm sửa markup/CSS/panelConfig ngoài phần submit/status |

## 10. Expected Outputs

- Một patch frontend khu trú trong các hàm gửi/xác nhận/trạng thái.
- Regression suite chứng minh retry chạy thật và không tạo UUID mới.
- Báo cáo UAT có ma trận `Local files / Browser / Apps Script / Sheet / Public URL`.
- Docs mô tả đúng hành vi sau sửa.
- Không có Apps Script version mới, schema mới, email, payment hoặc thay đổi panel.

### Acceptance Tests bắt buộc

| ID | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| AT-01 | Lần status đầu timeout, lần sau `recorded` | UI success; cùng UUID; không throw ở timeout đầu |
| AT-02 | POST throw nhưng status trả `recorded` | UI success, chứng minh không báo thất bại giả |
| AT-03 | `not_found -> not_found -> recorded` | Retry rồi success trong ngân sách |
| AT-04 | Mọi lần đều timeout/network | UI “chưa kiểm tra được”; có mã `CONFIRMATION_UNAVAILABLE`; không khẳng định chưa ghi |
| AT-05 | Backend trả `INVALID_UUID` | Dừng ngay, không retry vô ích |
| AT-06 | Backend trả UUID khác | Dừng ngay với `STATUS_UUID_MISMATCH`; không báo success |
| AT-07 | Ép tắt `crypto.randomUUID()` | UUID fallback đúng 32 hex |
| AT-08 | Người dùng bấm gửi lại cùng payload | Hai POST dùng cùng UUID; backend idempotency không thêm dòng trùng |
| AT-09 | Console/URL audit | Không có PII trong URL/log |
| AT-10 | Desktop 1440x900 và mobile 390x844 | Form gửi đúng; không đổi panel/layout ngoài scope |
| AT-11 | Staged deployment | Route `/program-interest` và các route release contract đều đạt gate |
| AT-12 | Live UAT có kiểm soát | Đúng một UUID được ghi; status `recorded`; gửi lại cùng UUID không tăng số dòng |

AT-12 là Sheet mutation thật và chỉ chạy sau phê duyệt Cấp độ 3 riêng.

## 11. Execution Plan After Approval

### Phase 0 — Isolation và baseline

1. Tạo clean worktree/branch từ commit `origin/main` hiện hành sau khi fetch read-only.
2. Ghi commit SHA, endpoint `@69`, public hash và baseline status vào UAT report.
3. Xác nhận allowlist; không copy dirty files ngoài phạm vi từ checkout hiện tại.

### Phase 1 — Regression tests trước sửa

1. Tạo test AT-01 đến AT-10 bằng Playwright/request interception.
2. Chạy trên source trước sửa và lưu bằng chứng ít nhất AT-01/AT-02 thất bại đúng nguyên nhân.

### Phase 2 — Implement Option A

1. Sửa riêng state machine trong `program-interest.html`.
2. Không sửa Apps Script hoặc UUID generator ngoài việc giữ regression guard.
3. Rà diff theo allowlist và kiểm tra UTF-8.

### Phase 3 — Local verification

1. Chạy syntax check và toàn bộ AT-01 đến AT-10.
2. Chạy browser desktop/mobile trên local HTTP server.
3. Ghi report và evidence repo-visible.

### Phase 4 — Documentation impact

1. Cập nhật `docs/system-architecture.md` và `docs/deployment-guide.md`.
2. Đối chiếu docs với code/test; docs không thay runtime UAT.

### Phase 5 — Handoff trước production

1. Chụp `git status --short --branch` trong clean worktree.
2. Phân loại file stage được và file ngoài scope.
3. Dừng xin Cấp độ 3 riêng cho từng nhóm: commit, push, staged deploy, promote production và AT-12 Sheet write.

## 12. Open Questions

Không còn câu hỏi thiết kế chặn Option A. Trigger chính xác của lượt 11/08 vẫn không thể hồi cứu do source cũ không lưu error code; mục tiêu của plan là sửa lỗi đã xác nhận và tạo evidence để lần sau không mất nguyên nhân.

## 13. Notes for Other Agents

- Không áp dụng plan UUID fallback của Gemini trong brain; public hiện đã dùng 32 hex.
- Không sửa panel chi tiết theo yêu cầu User.
- Không claim fixed/live nếu mới đạt local AT-01 đến AT-10.
- Không dùng checkout dirty hiện tại làm release source.
- Không được coi plan approval là quyền commit/push/deploy/Sheet write.

## 14. Final Assessment

**Khuyến nghị rà soát:** `APPROVE OPTION A`.

Option A sửa trực tiếp lỗi retry và false-negative classification đã được chứng minh trong source, có blast radius nhỏ và rollback rõ. Option B chỉ được xem xét bằng plan mới nếu sau Option A vẫn có tái phát kèm evidence.

**Operational authorization:** User đã trực tiếp phê duyệt Option A và phạm vi
implementation/UAT trong phiên hiện tại. Các thao tác Cấp độ 3
(commit/push/deploy/promote và ghi Google Sheet thật) vẫn phải dừng ngay trước
từng lệnh để xác nhận exact command (lệnh cụ thể), target (đích tác động) và
rollback (kế hoạch quay lui) theo shared rules. Không dùng approval này để sửa
Apps Script, token, env, schema hoặc panel khóa học.

## 15. Execution checkpoint (2026-08-12)

- Clean worktree: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn_program_interest_fix_20260812`
- Source baseline: `origin/main` at `a0b4b6f4cdcdf22582e4245ccba797752a37323b`
- Implemented: `program-interest.html` Option A state machine.
- Added regression harness: `UAT/program_interest_confirmation_reliability_20260812.js`.
- Docs touched: `docs/system-architecture.md`, `docs/deployment-guide.md`.
- Local UAT: AT-01 through AT-10 passed in the harness; evidence is mirrored in
  `UAT/program_interest_confirmation_reliability_20260812.md`.
- Remaining gates: commit, push, staged deployment, one real Sheet UAT row/read-back,
  and production promote require their exact-operation approvals and fresh
  evidence. Apps Script deployment remains read-only at `@69`.
