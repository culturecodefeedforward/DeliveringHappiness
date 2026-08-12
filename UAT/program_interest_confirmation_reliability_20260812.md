# UAT Report: Program Interest confirmation reliability

## Phạm vi và nguồn chuẩn (source of truth - nơi tham chiếu chính)

- Worktree sạch: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn_program_interest_fix_20260812`
- Baseline commit: `a0b4b6f4cdcdf22582e4245ccba797752a37323b` (`origin/main`)
- Frontend: `program-interest.html`
- Regression harness (bộ kiểm thử hồi quy): `UAT/program_interest_confirmation_reliability_20260812.js`
- Apps Script production read-only target: deployment `@69`
- Sheet target read-only ngoài local UAT: tab `Program Interest`

## Thay đổi đã thực hiện

Option A chỉ sửa state machine (máy trạng thái) xác nhận ở frontend:

- Retry tối đa 4 lần, ngân sách xác nhận tối đa 45 giây.
- `STATUS_TIMEOUT`, lỗi mạng, `not_found` và lỗi upstream tạm thời được thử lại.
- `INVALID_UUID` và UUID mismatch dừng ngay.
- Nếu `POST` `no-cors` (gửi khác miền không đọc được phản hồi) phát sinh lỗi,
  frontend vẫn kiểm tra trạng thái theo cùng UUID.
- Hết ngân sách hiển thị “chưa kiểm tra được”, không khẳng định dữ liệu chưa ghi.
- DOM/console chỉ nhận mã lỗi và số lần thử; không ghi PII (Personally
  Identifiable Information - dữ liệu định danh cá nhân).
- Giữ nguyên UUID khi người dùng gửi lại cùng payload để bảo toàn
  `idempotency` (gửi lại không tạo dòng trùng).

Không sửa Apps Script, UUID generator, Sheet schema hoặc panel khóa học.

## Lệnh kiểm thử và kết quả

Lệnh đã chạy trong worktree sạch:

```text
node UAT/program_interest_confirmation_reliability_20260812.js
```

Kết quả stdout: `{"verdict":"LOCAL_UAT_VERIFIED"}`.

Đối chứng trước sửa: chạy cùng harness với `PROGRAM_INTEREST_ROOT` trỏ tới
worktree detached `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn_program_interest_baseline_20260812`
(commit `a0b4b6f`) dừng ở AT-01 với exit code `1`, đúng failure class timeout
không retry thành công. Đây là baseline evidence (bằng chứng trước sửa), không
phải lỗi của harness sau sửa.

| Ca | Kết quả quan sát được | Trạng thái |
|---|---|---|
| AT-01 timeout rồi recorded | 2 status requests, success, cùng UUID | VERIFIED |
| AT-02 POST lỗi rồi recorded | POST network error vẫn success sau status recorded | VERIFIED |
| AT-03 not_found → not_found → recorded | 3 status requests rồi success | VERIFIED |
| AT-04 timeout toàn bộ | `CONFIRMATION_UNAVAILABLE`, thông báo “chưa kiểm tra được” | VERIFIED |
| AT-05 INVALID_UUID | Dừng sau 1 status request, mã `INVALID_UUID` | VERIFIED |
| AT-06 UUID mismatch | Dừng sau 1 status request, mã `STATUS_UUID_MISMATCH` | VERIFIED |
| AT-07 fallback UUID | Payload dùng đúng 32 ký tự hex | VERIFIED |
| AT-08 gửi lại | 2 POST dùng cùng UUID, không sinh UUID mới | VERIFIED |
| AT-09 URL/console audit | Không thấy dữ liệu UAT/PII trong URL hoặc console | VERIFIED |
| AT-10 desktop/mobile | 1440x900 và 390x844 đều success | VERIFIED |

Syntax check inline script cũng đạt: `INLINE_SCRIPT_SYNTAX_OK`.

## Ma trận bề mặt kiểm chứng (verification surface - lớp kiểm tra)

| Bề mặt kiểm chứng | Phương pháp | Kỳ vọng | Trạng thái |
|---|---|---|---|
| Local files | `git diff`, `node` syntax check, regression harness | Đúng allowlist, state machine mới chạy được | VERIFIED |
| Apps Script deployment | Đọc-only source/deployment hiện hành | Không tạo version mới; `@69` còn là target | VERIFIED (read-only) |
| Google Sheet thật | Chưa chạy trong local UAT | Một UUID ghi đúng một dòng, đọc lại `recorded`, retry không tăng dòng | UNVERIFIED — chờ staged gate và exact external-write approval |
| Browser evidence | Puppeteer local, desktop/mobile | Form success/error states đúng | VERIFIED — local surface only |
| Public frontend URLs | Chưa có staged deployment | Route staged/public khớp release commit | UNVERIFIED |
| Final verdict | Đối chiếu toàn bộ ma trận | Tất cả local/staged/live surface đạt | UNVERIFIED — chưa staged/live |

## Docs impact

`Docs touched`: `docs/system-architecture.md`, `docs/deployment-guide.md`.
Hai tài liệu đã mô tả luồng `no-cors POST + JSONP status`, retry budget,
idempotency và các gate UAT. Không có thay đổi Apps Script/schema.

## Gate tiếp theo và rollback

- Commit/push: chỉ stage allowlist, không dùng `git add .`; rollback source bằng
  revert commit.
- Staged deploy: phải ghi source SHA, Vercel project `dh-crm-landing`, deployment
  URL/ID và kiểm tra `/program-interest` trên staged surface.
- Sheet UAT thật: đúng một payload giả, giữ UUID, đọc lại rồi gửi lại cùng UUID;
  không xóa dòng UAT.
- Promote production: chỉ xin duyệt sau khi có exact staged deployment ID; nếu
  live gate lỗi thì promote rollback về deployment trước.

## Verdict

`LOCAL_UAT_VERIFIED`; `STAGED_RELEASE_VERIFIED`, `REPO_DONE` và `LIVE_VERIFIED`
chưa được claim vì chưa thực hiện các bề mặt tương ứng.
