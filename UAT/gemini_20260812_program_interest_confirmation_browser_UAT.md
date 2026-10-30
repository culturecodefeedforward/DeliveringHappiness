# Gemini Browser UAT — Program Interest confirmation reliability

**Ngày:** 2026-08-12 (Asia/Bangkok)  
**Mục tiêu:** Kiểm thử nghiệm thu người dùng (UAT - User Acceptance Testing) bằng trình duyệt cho bản staged của `/program-interest`, tập trung riêng vào lỗi xác nhận ghi nhận.  
**Phạm vi:** Read-only (chỉ đọc/kiểm tra); không ghi Google Sheet, không submit dữ liệu thật, không đổi Apps Script, không promote production.

## 1. Nguồn chuẩn và release đang kiểm thử

Repo root: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`

| Artifact | Vai trò | Claim level |
|---|---|---|
| `program-interest.html` tại commit `b9b18c0c860e059ef616ce9df5dcb0b3d054d301` | Frontend đã sửa | VERIFIED |
| `Implementation Plan/dh4hn-website_program-interest-confirmation-false-negative_20260812.md` | Root cause, allowlist, acceptance tests | VERIFIED |
| `UAT/program_interest_confirmation_reliability_20260812.js` | Harness AT-01 đến AT-10 bằng request interception | VERIFIED local |
| `UAT/program_interest_confirmation_reliability_20260812.md` | Local UAT report | VERIFIED local |
| `UAT/releases/b9b18c0c860e-938d7d5324a7/staged/authenticated-cli-verdict.json` | HTTP 7 route bằng phiên Vercel CLI đã xác thực | VERIFIED HTTP; browser UNVERIFIED |

**Staged target:** `https://delivering-happiness-5q8ym2riq-vuhoang2708s-projects.vercel.app`  
**Deployment ID:** `dpl_EUJHfXVfCG4FsDdPtLERY8rFib1q`  
**Release ID:** `b9b18c0c860e-938d7d5324a7`  
**Production URL:** `https://delivering-happiness.vercel.app` — chỉ tham chiếu, không mở để submit và không thay đổi.

HTTP bằng Vercel CLI đã xác nhận 7/7 route trả `200`, nội dung kỳ vọng đủ và ba header `X-Release-*` đúng. Probe trình duyệt ẩn danh trước đó bị Vercel SSO (Single Sign-On - đăng nhập một lần) `302`; vì vậy Gemini phải báo rõ nếu browser vẫn bị khóa, không tự đăng nhập hoặc tìm cách hạ Protection.

## 2. Root cause phải kiểm tra và mô tả đúng

### Chuỗi lỗi đã được xác minh

1. Trình duyệt gửi `POST` tới Google Apps Script bằng `no-cors` (gửi khác miền nhưng không đọc được response).
2. Sau đó frontend hỏi trạng thái bằng `JSONP` (JSON with Padding - kiểm tra khác miền qua thẻ script) theo cùng `interestUuid`.
3. Hàm cũ `confirmRecorded()` có vòng lặp retry nhưng `STATUS_TIMEOUT` bị ném ra ngay trong `catch`, nên lần timeout đầu đã kết thúc submit; retry dự kiến không chạy đúng.
4. Vì `no-cors` trả response opaque, POST có thể đã ghi Sheet nhưng frontend không biết; bước xác nhận chậm/lỗi làm UI báo thất bại giả (`false negative` - báo lỗi dù dữ liệu có thể đã ghi).
5. Nhánh lỗi chung không giữ `errorCode`/số lần thử, nên không phân biệt được timeout, lỗi mạng, UUID sai hay backend error.

### Những điều **không** phải root cause của bản này

- Không phải UUID fallback base36. Source hiện dùng `crypto.randomUUID()` hoặc `createHexToken()` 32 ký tự hex; không có `Date.now().toString(36)`.
- Không phải sai tab Google Sheet. Backend/Sheet/schema không nằm trong allowlist sửa.
- Không có bằng chứng Brave chặn hoàn toàn JSONP; đây là lỗi xác nhận tạm thời và khả năng quan sát response POST.
- Không phải panel chi tiết khóa học; Gemini không đánh giá hoặc sửa phần panel trong test này.

## 3. Những gì Codex đã sửa

Chỉ sửa frontend trong `program-interest.html`:

- `requestProgramInterestStatus(uuid, timeoutMilliseconds)` nhận timeout còn lại của ngân sách xác nhận, tối đa 8 giây cho mỗi request.
- `confirmRecorded(uuid)` dùng tối đa 4 lần thử trong ngân sách tổng 45 giây; hiển thị lần thử hiện tại.
- Lỗi tạm thời (`STATUS_TIMEOUT`, `STATUS_NETWORK_ERROR`, `STATUS_NOT_FOUND`, upstream temporary error) được retry với backoff hữu hạn.
- Lỗi vĩnh viễn (`INVALID_UUID`, `STATUS_UUID_MISMATCH`) dừng ngay, không báo thành công.
- Nếu POST `no-cors` ném lỗi, frontend vẫn kiểm tra trạng thái theo **cùng UUID** vì backend có thể đã ghi.
- Nếu hết ngân sách, UI nói “chưa kiểm tra được trạng thái ghi nhận”, gắn `CONFIRMATION_UNAVAILABLE`, không khẳng định “chưa ghi”.
- Lần submit lại cùng payload giữ `pendingInterestUuid`; không sinh UUID mới và không phá idempotency (tính lặp an toàn - gửi lại không tạo dòng trùng).
- Console/DOM chỉ ghi `code` và `attempts`, không ghi họ tên, email, điện thoại, payload hay PII (Personally Identifiable Information - dữ liệu nhận diện cá nhân).
- Không sửa Apps Script, `.clasp.json`, deployment `@69`, Sheet, schema, token, env, markup/CSS/panel khóa học.

## 4. Browser test procedure

### 4.1 Access gate

1. Mở đúng staged URL ở trên, không mở production URL.
2. Chạy hai viewport:
   - Desktop: `1440x900`.
   - Mobile: `390x844`, bật mobile emulation nếu công cụ hỗ trợ.
3. Nếu URL chuyển `302` tới `vercel.com/sso-api`:
   - Chụp screenshot và ghi `BLOCKED_STAGED_BROWSER_SSO`.
   - Không điền login, không click login, không tạo/chỉnh Protection, không dùng secret trong report.
   - Dừng browser test; không gọi đó là pass.
4. Nếu tải được HTML, kiểm tra DOM/read-only:
   - `#interest-form` tồn tại.
   - Có `PROGRAM_INTEREST_V1`.
   - Có `checkProgramInterestStatus`.
   - Không có `Date.now().toString(36)` trong source.
   - Có dòng fallback `return createHexToken()`.
   - Không coi sự hiện diện hay nội dung các detail panel là lỗi của release này.

### 4.2 Functional scenarios — chỉ mock/intercept, không ghi thật

Chỉ chạy các ca dưới đây nếu browser tool hỗ trợ request interception/mock. Không submit payload thật tới Apps Script.

| ID | Mô phỏng | Expected result |
|---|---|---|
| B-01 | Status lần 1 timeout, lần 2 `recorded` với đúng UUID | UI success; có 2 status request; UUID hai lần giống nhau |
| B-02 | POST bị network error, status trả `recorded` | UI success; console tối đa `{code: POST_NETWORK_ERROR, attempts: 0}`; không có PII |
| B-03 | `not_found` → `not_found` → `recorded` | Retry rồi success trong cùng ngân sách; không sinh UUID mới |
| B-04 | Tất cả status timeout/network đến hết ngân sách | UI error `CONFIRMATION_UNAVAILABLE`; câu chữ là “chưa kiểm tra được trạng thái ghi nhận”; không có câu khẳng định “chưa ghi” |
| B-05 | Backend trả `INVALID_UUID` | Dừng ngay; không retry thêm |
| B-06 | Backend trả `recorded` với UUID khác | UI error `STATUS_UUID_MISMATCH`; không success; không retry thêm |
| B-07 | Submit lại cùng payload sau lỗi xác nhận | POST lần 1 và lần 2 dùng cùng `interestUuid`; không ghi Sheet thật |

Nếu công cụ không hỗ trợ interception, đánh B-01 đến B-07 là `UNVERIFIED — tool limitation`, không tự thay bằng submit live.

### 4.3 Console/network/privacy audit

- Ghi console errors và page errors.
- Kiểm tra URL JSONP không chứa họ tên, email, số điện thoại hoặc nội dung form.
- Kiểm tra console không chứa payload/PII.
- Không chụp hoặc đưa secret/token/cookie vào report.

## 5. Evidence bắt buộc Gemini trả về

Mirror (sao chép về repo) report và screenshot tại:

`UAT/evidence/gemini_program_interest_confirmation_20260812/`

Report bắt buộc có:

- timestamp, URL, deployment ID, release ID;
- viewport và browser mode;
- HTTP status/final URL hoặc SSO location;
- DOM selectors đã kiểm tra;
- từng ca B-01 đến B-07: expected, observed, claim level;
- console/page errors và privacy audit;
- screenshot desktop/mobile hoặc screenshot SSO block;
- verdict duy nhất: `BROWSER_VERIFIED`, `BLOCKED_STAGED_BROWSER_SSO`, hoặc `BROWSER_FAILED`.

Chỉ được ghi `BROWSER_VERIFIED` khi browser thực sự tải staged HTML và các ca browser đã chạy/đủ evidence. Không được suy ra browser pass từ Vercel `READY`, HTTP CLI `200`, local UAT hoặc plan.

## 6. Stop conditions and approval boundary

Dừng ngay nếu có một trong các điều kiện sau:

- SSO/login/protection block;
- route không phải staged URL;
- thiếu provenance header hoặc nội dung DOM kỳ vọng;
- browser test muốn submit thật, ghi Sheet, gửi email, gọi Apps Script write, promote hoặc đổi cấu hình;
- xuất hiện PII/secret trong URL, console hoặc report.

Gemini chỉ làm browser UAT read-only trong handoff này. Không commit, push, deploy, promote, ghi Google Sheet, sửa Apps Script/token/env/schema hoặc sửa panel.

## 7. Kết quả phải phản hồi về Codex

Trả lời ngắn theo mẫu:

```text
GEMINI_BROWSER_UAT_VERDICT: <BROWSER_VERIFIED | BLOCKED_STAGED_BROWSER_SSO | BROWSER_FAILED>
Target: <staged URL>
Viewport: <desktop/mobile>
Release: b9b18c0c860e-938d7d5324a7
Deployment: dpl_EUJHfXVfCG4FsDdPtLERY8rFib1q
Evidence report: <repo-visible path>
Screenshots: <repo-visible paths>
HTTP/DOM/console/privacy summary: <ngắn gọn>
External writes: NONE
```

Không dùng verdict `STAGED_RELEASE_VERIFIED` nếu chưa có browser evidence đúng staged target.
