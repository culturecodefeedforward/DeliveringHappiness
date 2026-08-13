# Program Interest A3-FE — latency baseline

## Verdict

`VERIFIED` trên đúng bề mặt status endpoint read-only (chỉ đọc). Kết quả này
không chứng minh độ trễ `POST` ghi Google Sheet, vì không có POST nào được gửi.

## Probe contract

- Endpoint production Apps Script `@69` được gọi bằng `GET`
  `checkProgramInterestStatus`/JSONP.
- 8 UUID 32-hex ngẫu nhiên, chưa dùng để ghi dữ liệu.
- Mỗi mẫu timeout 45 giây.
- `postRequests: 0`; `externalWrites: NONE`.
- Mọi mẫu trả HTTP 200, `state: not_found`, UUID phản hồi khớp UUID truy vấn.
- Raw response URL chứa redirect token tạm thời không được mirror vào repo; chỉ
  lưu metrics đã sanitize.

## Metrics

| Metric | Value |
|---|---:|
| Samples | 8 |
| Min | 2,262 ms |
| P50 | 2,760 ms |
| P95 | 12,098.3 ms |
| Max | 14,843 ms |

Evidence JSON: `UAT/evidence/program_interest_confirmation_a3_20260812/latency-baseline.json`.
Probe source: `UAT/program_interest_confirmation_latency_a3_20260812.js`.

## Interpretation

P95 khoảng 12.1 giây vượt timeout A2 là 12 giây; max khoảng 14.8 giây. Điều này
giải thích false-negative (báo chưa xác nhận dù backend có thể vẫn đang xử lý),
nhưng chưa tách được thời gian mở Sheet/quét UUID/append của POST. A3-FE vì vậy
chỉ được claim giảm thời gian chờ cảm nhận bằng cách chạy POST và status polling
song song; không claim đã tối ưu backend.

## Phase 1 gate

- [x] Clean A2 snapshot `d7ef9d37669fafe7d533340ca201f8b5bf469e97`.
- [x] Baseline metrics có min/p50/p95/max.
- [x] Không POST, không Sheet mutation, không Apps Script source change.
- [x] Invariant A3-FE được map vào plan và test cases.
