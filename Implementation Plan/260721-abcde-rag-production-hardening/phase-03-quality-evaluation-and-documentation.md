---
phase: 3
title: "Corpus Expansion and Full-Flow Quality Evaluation"
status: completed
effort: "180-300 phút"
---

# Phase 3: Corpus Expansion and Full-Flow Quality Evaluation

## Overview

Biến phần “nâng cấp kiến thức” thành deliverable (kết quả bàn giao) của release này. Corpus không còn là 22 chunks viết tay/CSV đơn lẻ: pipeline sẽ lấy đoạn liên quan ABCDE và lạc quan từ các NotebookLM DH đã xác minh, giữ provenance, loại trùng và đánh giá bot xuyên suốt A-E.

## Nguồn Đã Xác Minh

- `data/abcde_cases_library.csv` và `.md`: 18 case A-E hiện tại.
- NotebookLM DH7: `e9f7d3f6-036a-4c40-8580-66d688c7642f`, 20 sources.
- NotebookLM DHM3: `1601679f-ca32-40bb-bb8c-aaedc4e50906`, 15 sources.
- NotebookLM DHM4: `83c60631-fcfc-4138-b96a-bc99826be158`, 16 sources.
- NotebookLM DH8: `6a4d1fae-d0e6-4934-94f5-34d916c929f7`, 3 audio sources. Một source đã đo có 120.089 ký tự và 30 lần nhắc “lạc quan”; ba audio phải kiểm tra trùng nội dung trước khi ingest.

## Implementation Steps

1. Tạo `data/sources/abcde_source_manifest.json` ghi notebook ID, source ID, title, source type, checksum nội dung, review status và phạm vi được phép dùng. Không ghi token/cookie.
2. Dùng `nlm source content <SOURCE_ID> --json` để đọc nội dung thô vào vùng tạm `C:\tmp`; không commit transcript/audio đầy đủ vào repo.
3. Tạo `Scripts/build_abcde_kb.py`:
   - tìm candidate passages (đoạn ứng viên) quanh ABCDE, adversity, belief, consequence, disputation, energization, lạc quan, explanatory style, 3P, evidence, alternatives, implications và utility;
   - review ngữ nghĩa để loại đoạn chỉ nhắc từ khóa nhưng không dạy ABCDE;
   - che dữ liệu cá nhân của học viên/giảng viên không cần thiết;
   - chia theo ranh giới ý nghĩa, không cắt giữa một tình huống A-E;
   - deduplicate bằng normalized text hash và similarity; ba bản audio DH8 trùng nhau chỉ giữ một nguồn chuẩn;
   - mỗi chunk bắt buộc có `notebook_id`, `source_id`, `source_title`, `source_type`, `location`, `abcde_step`, `concept`, `text`, `citation` và `review_status=approved`.
4. Audit 22 chunks cũ:
   - giữ case có nguồn trong CSV và sửa metadata về đúng source;
   - các citation “Learned Optimism trang 145-148” phải được xác minh từ nguồn sách/tài liệu; nếu không có nguồn gốc kiểm chứng, đổi thành `UNVERIFIED` và loại khỏi citation hiển thị;
   - không biến nội dung tổng hợp của agent thành trích dẫn sách.
5. Sinh KB text-only và manifest có version/checksum cho `local-tfidf-ngram-v1`. Mục tiêu release: 60-120 chunks đã review, ít nhất 3 notebook và 4 source IDs khác nhau; không tạo filler để đạt số lượng. Không gọi embedding API hoặc Upstash Vector.
6. Tạo `data/evals/abcde-full-flow-cases.json` với ít nhất 6 hành trình, mỗi hành trình có ca chưa đạt/đạt ở A-B-C và các lượt D/E:
   - A suy diễn ý định của sếp;
   - thất bại công việc và tự quy chụp;
   - xung đột đồng nghiệp;
   - tình huống gia đình;
   - sự kiện ngoài miền;
   - một ca cố prompt injection (tiêm chỉ thị phá quy tắc).
7. Tạo `data/evals/abcde-rag-golden-cases.json` cho retrieval và runner `UAT/run_abcde_rag_quality_20260721.js` để so sánh baseline 22 chunks với corpus mới.
8. Chấm rubric 0-2 cho từng bước:
   - A: tách fact/inference và không nhảy bước;
   - B: lấy đúng automatic belief mà không gán hộ;
   - C: có emotion/intensity/behavior và liên kết B -> C;
   - D: một câu hỏi Socratic đúng lăng kính, grounded (có căn cứ) và citation đúng;
   - E: học viên tự nêu góc nhìn mới, mức cảm xúc và hành động.
9. Cập nhật `docs/abcde_chatbox_spec.md`, `docs/deployment-guide.md`, `docs/system-architecture.md` với source manifest, pipeline, privacy, citation và quality gate.

## Quality Gates Trước Production

- Corpus: 60-120 approved chunks, 100% có provenance, duplicate rate dưới 5%, không có dữ liệu cá nhân không cần thiết.
- Socratic: 100% fixture chỉ một câu hỏi mở; 100% ca A suy diễn bị giữ ở A; không bỏ qua bước trong 6 full-flow journeys.
- Retrieval: ít nhất 85% in-domain cases có nguồn phù hợp trong top 3; top results gần trùng dưới 10%; 100% bộ ca ngoài miền mở rộng trả no-match.
- Citation: 100% title/source trả về tồn tại trong manifest; 0 citation sách/trang chưa xác minh được hiển thị như fact.
- Regression: Stable smoke test pass và Beta vẫn có fallback rõ ràng.

## Stop Conditions

- Không lấy được raw source content hoặc không xác minh được quyền/source ID.
- Sau review có dưới 60 chunks thật sự liên quan; dừng corpus gate và báo số thực, không sinh nội dung giả để đủ quota.
- Citation cũ không xác minh được nhưng vẫn bị yêu cầu hiển thị như nguồn chuẩn.
- Chất lượng chỉ tăng nhờ hạ threshold hoặc nới rubric.

## Success Criteria

- [ ] Corpus mới có manifest, checksum, provenance và báo cáo before/after.
- [ ] Socratic A-E và retrieval đều đạt quality gates định lượng.
- [x] Bước A có bằng chứng test riêng cho fact-versus-inference.
- [x] Citation hiển thị chỉ đến từ source đã approved.
- [x] Full-flow runner có thể chạy lại bằng một lệnh và report nằm trong `UAT/`.
