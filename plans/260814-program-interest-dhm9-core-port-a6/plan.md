---
title: Program Interest A6 — port lõi xác nhận DHM9
description: >-
  Khóa và port đầy đủ phần lõi submit/xác nhận DHM9 phù hợp với hợp đồng Program
  Interest; không sửa Apps Script hoặc ghi Google Sheet.
status: completed
priority: P1
branch: fix/program-interest-dhm9-core-port-a6-20260814
tags:
  - bugfix
  - frontend
  - critical
blockedBy: []
blocks: []
created: '2026-08-14T07:11:49.788Z'
createdBy: 'ck:plan'
source: skill
---

# Program Interest A6 — port lõi xác nhận DHM9

## Overview

Mục tiêu là sửa Program Interest theo yêu cầu trực tiếp của User: bê phần lõi
xác nhận của DHM9 sang form này, chỉ thay adapter (lớp chuyển đổi) field và
Sheet. Baseline là commit `16bcaea4a579b64104ba16a502bd08ba91e5f9bf`; không
sửa Apps Script, `schema` (cấu trúc dữ liệu chuẩn), token, biến môi trường,
panel khóa học, không commit/push/deploy và không ghi Google Sheet.

### Scope challenge

- Có sẵn: A2/A3/A4 đã có UUID, fingerprint, `sessionStorage` (bộ nhớ phiên),
  retry, reload recovery và `fetch GET` cho status.
- Cần tối thiểu: port lại thứ tự `await POST -> polling` của DHM9, adapter
  validation phía trình duyệt khớp backend, cùng regression UAT (User
  Acceptance Testing - kiểm thử nghiệm thu người dùng) tái hiện race.
- Không mở rộng: không port QR/SePay/payment, duplicate phone nghiệp vụ hay
  Apps Script của DHM9 vì Program Interest không có các contract đó.
- Chế độ đã chọn: HOLD SCOPE — User đã duyệt làm đủ lõi cần thiết, không giảm
  thành chỉ retry/polling và không mở rộng sang backend.

## Source of truth và audit matrix

| Giai đoạn | DHM9 nguồn chuẩn | Program Interest A4 | Phán quyết A6 |
|---|---|---|---|
| Validation đầu vào | `validatePhoneRealtime()` + pre-submit guard | HTML chỉ `required`; backend còn kiểm họ tên/email/phone chặt | Port adapter client khớp validation backend, không gọi endpoint mới |
| State pending | UUID + resume state | UUID/fingerprint/state session | Giữ nguyên, không tạo UUID mới |
| Preflight | Kiểm availability/duplicate phù hợp lane | Chỉ kiểm UUID pending trước POST lại | Giữ preflight UUID; không giả lập duplicate phone không có contract |
| Dispatch POST | `await fetch(... no-cors ...)` | `fetch(...).catch(...)` chạy nền | **H-01 VERIFIED:** port lại `await` trước confirmation |
| Polling status | Chỉ chạy sau POST settlement | Bắt đầu ngay khi POST đang pending | Khắc phục race bằng thứ tự DHM9 |
| Thành công | registration success, sau đó payment nền | `recorded` + UUID khớp | Giữ Program Interest contract; không port QR/payment |
| Lỗi opaque | preflight giảm success giả | backend reject thành lỗi chung | **H-02 VERIFIED:** chặn lỗi field contract tại frontend; response POST vẫn opaque |
| UAT | Submit path + polling | A4 chỉ seed UUID cũ và chặn POST | **H-03 VERIFIED:** thêm browser/local E2E giả lập có POST mới nhưng không external write |

### Decision lane

- `H-01 / HIGH / VERIFIED source`: `program-interest.html` gọi POST không
  `await` rồi gọi `confirmRecorded`; `register_dh9.js` await POST trước
  `startPolling`. Rủi ro: race làm status bị kiểm trước khi request được browser
  dispatch/settle. Sửa: helper POST được await trước polling. Acceptance: test
  gate chứng minh GET không bắt đầu trước POST settlement.
- `H-02 / HIGH / VERIFIED source`: backend `validateProgramInterestPayload_()`
  bắt họ tên/email/phone nhưng frontend không kiểm cùng hợp đồng. Rủi ro: POST `no-cors`
  che reject thành lỗi “chưa xác nhận”. Sửa: adapter client cùng regex/range,
  field error rõ và không phát POST. Acceptance: test invalid input, POST=0.
- `H-03 / HIGH / VERIFIED scope`: A4 read-only dùng UUID đã tồn tại. Rủi ro:
  pass GET không chứng minh form mới ghi được. Sửa: local browser server giả lập
  kiểm POST mới -> status -> UI; production write vẫn chờ Cấp độ 3. Acceptance:
  một POST, polling sau settlement, UI success, external writes=0.
- `H-04 / HIGH / VERIFIED local browser`: retry button từng xuất hiện khi
  `confirmationRunning` còn true; click ngay bị return im lặng. Sửa: disabled
  đến cleanup rồi mới enabled. Acceptance: mobile retry phát GET thứ hai và
  `recorded` thành UI success, POST=0.

Không kết luận dữ liệu trong ảnh User là `INVALID_PHONE`: đó là `UNVERIFIED` vì
payload thực không được lưu. A6 làm lớp này không còn biến thành lỗi chung.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Audit and contract](./phase-01-audit-and-contract.md) | Completed |
| 2 | [Port submission core](./phase-02-port-submission-core.md) | Completed |
| 3 | [Regression and browser UAT](./phase-03-regression-and-browser-uat.md) | Completed |

## Dependencies

- Liên quan nhưng không block: `plans/260813-program-interest-production-e2e-a5/plan.md`
  là lane production E2E; A6 chỉ sửa local và không thực hiện external write.
- Rollback local: bỏ riêng worktree A6; A4 dirty worktree và production hiện có
  không bị sửa trong các phase này.
