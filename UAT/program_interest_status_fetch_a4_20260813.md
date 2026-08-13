---
title: Program Interest A4-FE status fetch UAT
date: 2026-08-13
scope: local-and-browser-read-only
base_commit: faf4b49f66f56bc8e68dfc347d62b7decc18911d
branch: fix/program-interest-status-fetch-a4-20260813
---

# Program Interest A4-FE — Báo cáo UAT read-only

## Kết luận ngắn

`VERIFIED — Local done`: A4-FE đã đạt 18 ca hồi quy local và ba ca
`browser UAT` (kiểm thử nghiệm thu bằng trình duyệt) chỉ đọc trên endpoint Apps
Script thật. Chrome, Chrome ẩn danh và Brave đều nhận HTTP 200,
`state=recorded`, UUID khớp và hiển thị trạng thái thành công.

`UNVERIFIED — Live done`: mã A4 chưa được commit, push hoặc deploy. Production
không nằm trong bề mặt được duyệt ở Cấp độ 2 này.

Không có POST thật, external write (ghi ra hệ thống ngoài) hay Google Sheet
mutation (thay đổi dữ liệu Sheet). UUID dùng để đọc đã tồn tại:
`cb5016c3-e6e2-4a3d-bb67-8ab7db47b063`.

## Nguyên nhân và thay đổi

- A3 xác nhận trạng thái bằng thẻ `<script>` theo JSONP (JSON with Padding -
  chuỗi callback xuyên miền). Trên luồng redirect thật, Chrome có thể dừng sau
  HTTP 302 nên callback không chạy dù Sheet đã ghi.
- A4 đổi riêng status transport (cách gọi kiểm tra trạng thái) sang `fetch GET`:
  `cache: no-store`, `credentials: omit`, `redirect: follow` và timeout bằng
  `AbortController`.
- Response vẫn là JSONP text. Frontend kiểm tra đúng callback prefix và hậu tố
  `);`, sau đó mới `JSON.parse`; không thực thi chuỗi trả về.
- POST `no-cors`, UUID, payload fingerprint, pending state trong
  `sessionStorage`, 10 lần polling, manual retry và reload recovery giữ nguyên.

## Tổng quan kiểm thử

| Nhóm | Số ca | Kết quả | Bằng chứng |
|---|---:|---|---|
| Hồi quy local A2/A3/A4 | 18 | `VERIFIED` | `UAT/evidence/program_interest_status_fetch_a4_20260813/local-results.json` |
| Browser endpoint thật, read-only | 3 | `VERIFIED` | `UAT/evidence/program_interest_status_fetch_a4_20260813/browser-read-only-results.json` |
| Cú pháp hai UAT script | 2 | `VERIFIED` | `node --check`, exit code 0 |
| Inline JavaScript của form | 1 block | `VERIFIED` | `vm.Script`, exit code 0 |

Source SHA-256 của cả hai evidence JSON:
`1f82d097fb56fc0a527072ae60e600c1ea66ee99d2214b130bacbfcd330978ba`.

## Ma trận kiểm chứng bề mặt

| Bề mặt kiểm chứng | Phương pháp | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|
| Local files | Source guard, syntax check, 18 ca hồi quy | Fetch GET; không quay lại script-tag; A2/A3 không regression | `VERIFIED` |
| Apps Script status runtime | GET thật với UUID đã tồn tại | Redirect 302 → HTTP 200; JSONP hợp lệ; `recorded`; UUID khớp | `VERIFIED read-only contract` |
| Google Sheet | Hard-block POST/PUT/PATCH/DELETE; không submit form | Không có write attempt hoặc Sheet mutation | `VERIFIED NONE` |
| Browser evidence | Chrome desktop, Chrome ẩn danh mobile, Brave mobile | UI success; pending state bị xóa; không console/page error | `VERIFIED` |
| Public frontend production A4 | Chưa deploy theo ranh giới Cấp độ 2 | Production phục vụ đúng source hash A4 | `UNVERIFIED — ngoài scope` |
| Phán quyết | Đối chiếu code, local và browser read-only | Hoàn tất bề mặt local; không overclaim live | `VERIFIED Local done` |

## Kết quả browser thật

| Ca | Viewport | Chuỗi HTTP | Thời gian | UI/pending state | Write |
|---|---|---|---:|---|---|
| Chrome 151 desktop | 1440×900 | 302 → 200 | 7.849 ms (~7,8 giây) | success / cleared | NONE |
| Chrome 151 ẩn danh | 390×844 | 302 → 200 | 3.723 ms (~3,7 giây) | success / cleared | NONE |
| Brave 151 mobile | 390×844 | 302 → 200 | 6.628 ms (~6,6 giây) | success / cleared | NONE |

Không có console error, page error hoặc POST lại. Probe clone response của cả
ba ca đều ghi trực tiếp
`status=200`, `state=recorded` và đúng UUID
`cb5016c3-e6e2-4a3d-bb67-8ab7db47b063`.

## Guard an toàn và phạm vi không đổi

- Browser harness preseed đúng pending UUID trong `sessionStorage`; không điền
  hoặc submit form.
- Request interception abort ngay mọi POST/PUT/PATCH/DELETE và fail test nếu có
  write attempt. Kết quả: `blockedWrites=[]`, vì ứng dụng không hề phát sinh
  phương thức ghi.
- Lượt browser hiện tại chạy `LOCAL_READ_ONLY`, bypass secret không được nạp.
  Khi chạy staged sau này, UAT chỉ gắn header bypass vào đúng origin (nguồn miền
  gốc) của target Vercel và không in giá trị secret.
- `externalWrites: NONE`, `sheetMutation: NONE`, local Apps Script requests
  continued: `0`.
- Không sửa Apps Script, `schema` (cấu trúc dữ liệu chuẩn), token, env, Vercel
  config hoặc panel khóa học.

## Artifact repo-visible

- `UAT/evidence/program_interest_status_fetch_a4_20260813/local-results.json`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/browser-read-only-results.json`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/chrome-desktop-1440x900.png`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/chrome-retry-desktop-1440x900.png`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/brave-mobile-390x844.png`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/chrome-desktop-read-only-1440x900.png`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/chrome-incognito-read-only-390x844.png`
- `UAT/evidence/program_interest_status_fetch_a4_20260813/brave-read-only-390x844.png`

Ba screenshot đầu thuộc local mock regression; ba screenshot `read-only` thuộc
browser run endpoint thật tại `2026-08-13T13:03:08.333Z`. Tên file ánh xạ trực
tiếp tới test case trong hai evidence JSON. Rule `*.png` ở `.gitignore` hiện bỏ
qua chúng, nên lệnh stage evidence ở Cấp độ 3 phải dùng `git add -f` đúng sáu
path này nếu cần lưu ảnh trong commit; hai JSON và báo cáo Markdown không bị bỏ
qua.

## Cổng kiểm tra cuối

- `node --check`: 2/2 UAT script đạt.
- Smoke test sau khi thêm staged route gate: Chrome desktop đạt HTTP 200,
  `recorded`, đúng UUID; output nằm ngoài repo backup để không ghi đè evidence
  3-browser canonical.
- Inline JavaScript: 1/1 block được `vm.Script` parse thành công.
- `git diff --check`: exit code 0; chỉ có cảnh báo Git sẽ chuẩn hóa LF/CRLF khi
  stage, không có whitespace error.
- Allowlist audit: 9 file tracked/untracked, 0 file ngoài phạm vi; sáu PNG bị
  ignore đã được liệt kê riêng.
- Base/merge-base đều là
  `faf4b49f66f56bc8e68dfc347d62b7decc18911d`.
- Thay đổi Apps Script, release spec, Vercel config, env: 0.
- UTF-8 read-back: 9/9 file không có replacement character.
- Quét mẫu secret phổ biến: 0 hit; script chỉ chứa tên biến môi trường, không
  chứa giá trị bypass secret.

## Việc còn lại

Commit, push, staged deployment, production promote và UAT ghi đúng một dòng
Sheet thật đều là thao tác Cấp độ 3 riêng. Báo cáo này không cấp quyền và không
chứng minh bất kỳ thao tác nào trong số đó đã xảy ra.
