---
title: "ABCDE RAG Socratic Quality Upgrade and Production Hardening"
description: "Nâng cấp Socratic A-E, mở rộng corpus NotebookLM có nguồn, cải thiện retrieval/citation, rồi hardening và phát hành production cho ABCDE RAG Beta."
status: in_progress
priority: P1
branch: "codex/abcde-rag-production-hardening-20260721"
tags: [abcde, rag, production, vercel, apps-script, uat]
blockedBy: []
blocks: []
created: "2026-07-21T07:42:56.700Z"
createdBy: "ck:plan"
source: skill
---

# ABCDE RAG Socratic Quality Upgrade and Production Hardening

## Overview

### Kết luận xin duyệt

`READY FOR APPROVAL` (sẵn sàng để người dùng phê duyệt kế hoạch), chưa phải xác nhận đã triển khai.

Mục tiêu là hoàn tất phần còn thiếu của ABCDE RAG Beta theo một chuỗi có kiểm soát: cô lập thay đổi khỏi working tree (cây làm việc) đang bẩn, viết kiểm thử trước, sửa lỗi đóng gói kho tri thức, làm rõ trạng thái RAG trong API, đo chất lượng truy xuất, tạo deployment Google Apps Script riêng cho ABCDE, phát hành Vercel production, chạy `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) trên live, kiểm chứng `ChatVersion`, rồi gửi báo cáo Gmail.

### Người học sẽ thấy nâng cấp gì

1. **Socratic ở đủ A-B-C-D-E:** mỗi lượt phản chiếu ngắn rồi hỏi đúng một câu mở; không trả lời hộ, không dẫn dắt tới đáp án có sẵn.
2. **Bước A có cổng chất lượng riêng:** tách sự kiện quan sát được khỏi nhãn, suy diễn ý định và từ tuyệt đối. Ví dụ “sếp cố tình phá cuối tuần” chưa được chấp nhận là A; bot phải hỏi lại sự kiện cụ thể đã xảy ra.
3. **Chuyển bước có rubric:** A chỉ sang B khi sự kiện đủ khách quan; B cần niềm tin tự động; C cần cảm xúc và hành vi; D cần phản biện do học viên tạo ra; E cần góc nhìn mới và hành động cụ thể.
4. **RAG dùng toàn bộ A-B-C:** retrieval (truy xuất tri thức) dùng nghịch cảnh, niềm tin và hệ quả đã xác nhận để tìm kiến thức phù hợp; không xuất corpus hoặc ngữ cảnh D sang API embedding.
5. **Nguồn đa dạng, không lặp ý:** dùng lexical match (khớp từ khóa) để xếp hạng, TF-IDF unigram/bigram làm cổng độ tin cậy local, loại chunk gần trùng, ưu tiên ba nguồn và chọn một lăng kính Socratic chung để điều khiển câu hỏi D.
6. **Nguồn hiện ra cho người học:** câu hỏi ở D đi kèm citation ngắn có title/source thật; không còn yêu cầu giấu nguồn như code hiện tại.
7. **Corpus lớn hơn có provenance:** mở rộng từ 22 chunks lên mục tiêu 60-120 chunks đã duyệt từ các NotebookLM DH sở hữu; mỗi chunk có notebook ID, source ID, title và vị trí trong nội dung.
8. **Không đủ tự tin thì hỏi rõ:** retrieval dưới ngưỡng sẽ hỏi thêm ngữ cảnh hoặc dùng lý thuyết nền đã xác minh, không bơm một case gần giống rồi coi như đúng.

### Bằng chứng nền `VERIFIED`

| Hạng mục | Trạng thái hiện tại |
|---|---|
| Production alias | `https://delivering-happiness.vercel.app` đang trỏ deployment `dpl_HsmfZ5e85f7gUeidDNqB8QTVGrSX` |
| RAG live | STEP_D trả 2 citation sau khi KB được đóng gói bằng `includeFiles` trong gói deploy tạm |
| Lỗi nguồn | `vercel.json` trong repo chưa có `includeFiles`; deploy bình thường có thể làm mất KB lần nữa |
| Kho tri thức | `knowledge_base_abcde.json`: 22 chunks, vector 3072 chiều, khoảng 1.43 MB; đây chưa phải toàn bộ corpus NotebookLM |
| Apps Script | Script ID `1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS`; version 69 và snapshot 18/07 có `ChatVersion` |
| Cô lập Apps Script | API ABCDE đang dùng biến chung `DHM8_APPS_SCRIPT_URL` hoặc fallback deployment DHM9 `AKfycbw0v...@61`; không nên cập nhật deployment DHM9 chỉ vì ABCDE |
| Git | `main` ahead 6, hơn 1.000 thay đổi; khoảng 979 mục thuộc `node_modules`; không được stage/push đại trà |
| Email trước | Báo cáo go-live đầu tiên đã được Gmail xác nhận với message ID `19f8397c1061320b` |

### Phạm vi thực hiện

1. Tạo worktree (cây làm việc Git tách biệt) từ `origin/main` tại `C:\tmp\dh4hn-abcde-rag-hardening-20260721` và chỉ mang sang file thuộc ABCDE.
2. Xây stage-aware Socratic policy (quy tắc Socratic theo từng bước) cho A-B-C-D-E, structured state decision (quyết định trạng thái có cấu trúc) và context A-B-C gửi rõ từ frontend.
3. Nâng retrieval bằng truy vấn toàn ngữ cảnh, hybrid ranking (xếp hạng kết hợp), source diversity (đa dạng nguồn), confidence gate (cổng độ tin cậy) và citation hiển thị.
4. Trích xuất có chọn lọc tri thức ABCDE/lạc quan từ NotebookLM DH7, DHM3, DHM4 và DH8; tạo 60-120 chunks có provenance và audit citation.
5. Tạo bộ ca đánh giá full-flow A-E; đo stage accuracy, retrieval, citation và chất lượng hỏi kiểu Socratic.
6. Cập nhật tài liệu kiến trúc, triển khai, phạm vi KB và báo cáo UAT trong repo.
7. Commit/push chỉ lên branch (nhánh) `codex/abcde-rag-production-hardening-20260721`; không merge/push `main` trong đợt này.
8. Tạo deployment Apps Script riêng cho ABCDE từ version 69 đã kiểm chứng, không cập nhật deployment DHM8/DHM9 hiện hành.
9. Cấu hình production env, tạo gói deploy sạch, phát hành Vercel, UAT API + desktop + mobile, ghi đúng một dòng kiểm thử có nhãn rõ ràng vào Sheet và gửi đúng một email báo cáo cuối.

### Sai lệch kiến trúc được ghi nhận ngày 2026-07-22

- Người dùng đã duyệt gửi 61 chunk đã ẩn danh tới Gemini Embedding API, nhưng lớp an toàn thực thi chặn thao tác xuất dữ liệu tổ chức ra dịch vụ ngoài. Lệnh không chạy và không chunk nào được gửi.
- Không được lách qua proxy, endpoint trung gian hoặc nhờ người dùng chạy hộ.
- Phương án an toàn thay thế là `local-tfidf-ngram-v1`: KB giữ 79 chunk text đã duyệt nhưng không chứa vector neural; function tạo chỉ mục TF-IDF unigram/bigram trong bộ nhớ và xếp hạng toàn ngữ cảnh A-B-C-D.
- Runtime không gọi Gemini Embedding API và không dùng Upstash Vector trong release này. Gemini chat vẫn tạo câu hỏi Socratic nhưng không nhận toàn văn chunk, citation metadata hoặc vector; backend chọn citation cục bộ.
- Cổng độ tin cậy phải có cả điểm TF-IDF tối thiểu và độ phủ từ vựng corpus; ca ngoài miền bị trả `no_match`. Ngưỡng chỉ được chốt sau bộ eval mở rộng, không hạ ngưỡng để ép pass.

### Ngoài phạm vi

- Không ingest (nạp dữ liệu) hàng loạt mọi nội dung DH. Chỉ đoạn liên quan trực tiếp ABCDE/lạc quan, qua review và có source manifest (danh mục nguồn), mới được đưa vào KB.
- Không dọn, revert, commit hoặc push 979 thay đổi `node_modules` hay các thay đổi Program Interest/registration không thuộc ABCDE.
- Không cập nhật deployment DHM8/DHM9, không xóa deployment cũ, không xóa tự động dòng dữ liệu UAT.
- Không thay Stable bằng Beta; người dùng luôn còn đường quay về Stable.

### File dự kiến thay đổi hoặc tạo mới

| Nhóm | File |
|---|---|
| Runtime | `api/chat-abcde-rag.js`, `api/chat-abcde.js`, `chat-abcde.js`, `lib/abcde-socratic-policy.js`, `lib/abcde-rag-retrieval.js`, `vercel.json` |
| Ingest/corpus | `Scripts/build_abcde_kb.py`, `data/sources/abcde_source_manifest.json`, `data/artifacts/knowledge_base_abcde.json`, `data/artifacts/knowledge_base_abcde_manifest.json` |
| Kiểm thử | `tests/abcde-socratic-policy.test.js`, `tests/abcde-rag.test.js`, `data/evals/abcde-rag-golden-cases.json`, `data/evals/abcde-full-flow-cases.json`, `UAT/run_abcde_rag_quality_20260721.js` |
| Tài liệu | `docs/abcde_chatbox_spec.md`, `docs/deployment-guide.md`, `docs/system-architecture.md` |
| Bằng chứng | thư mục plan này, `Artifacts/abcde-rag-hardening-20260721/`, `UAT/abcde_rag_hardening_live_20260721.md`, ảnh PNG cùng tiền tố |

Nếu trong lúc triển khai cần thêm file runtime ngoài danh sách này, dừng để báo lại; phê duyệt của thao tác trước không được dùng để mở rộng phạm vi ngầm.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Baseline and Isolation](./phase-01-baseline-and-isolation.md) | Complete |
| 2 | [Socratic and Retrieval Quality Upgrade](./phase-02-tests-and-rag-hardening.md) | Complete local - live UI evidence pending Phase 5 |
| 3 | [Corpus Expansion and Full-Flow Quality Evaluation](./phase-03-quality-evaluation-and-documentation.md) | Complete local - 79 text-only chunks, all quality gates passed |
| 4 | [Release Packaging and Source Control](./phase-04-release-packaging-and-source-control.md) | In progress - runtime-only package verified, commit/push pending approval |
| 5 | [Production Rollout and Live UAT](./phase-05-production-rollout-and-live-uat.md) | Pending |

## Dependencies

- Gemini chat API production còn hoạt động và có quota; embedding API không được dùng trong release này.
- Quyền Vercel của project `delivering-happiness` còn hiệu lực.
- Quyền `clasp` (Command Line Apps Script Projects - công cụ dòng lệnh cho Apps Script) đối với script ID nêu trên còn hiệu lực.
- Gmail Workspace MCP còn xác thực được tài khoản `vuhoang2708@gmail.com`.

## Cổng chấp nhận tổng

- `Local done` (hoàn tất ở máy local): test Socratic A-E và retrieval pass, corpus đạt quality gate, build/gói sạch có KB, quality matrix đạt ngưỡng.
- `Repo done` (hoàn tất trên repository): chỉ branch ABCDE được commit và push; `main` không đổi.
- `Live done` (hoàn tất trên môi trường public): production alias trả đúng bản mới, Stable không hồi quy, Beta hoàn thành đúng A-B-C-D-E, bước A loại được suy diễn, D dùng context A-B-C và hiện citation, browser không có lỗi console/network, `ChatVersion=beta` xuất hiện trong bằng chứng Sheet/email.
- Mọi claim phải ghi `VERIFIED`, `INFERRED`, `UNVERIFIED` hoặc `STALE/ARCHIVE` kèm đường dẫn bằng chứng.

## Phê duyệt theo từng thao tác

Mục tiêu tổng thể đã được duyệt không thay thế phê duyệt Cấp 3 ngay trước từng thao tác bên dưới. Trước mỗi lệnh, Codex phải nêu target, phạm vi, bằng chứng preflight và rollback; nếu target hoặc phạm vi khác kế hoạch thì dừng.

| Hành động cần duyệt riêng | Target/lệnh bị giới hạn | Rollback |
|---|---|---|
| Tạo embedding | `NOT EXECUTED`: người dùng đã duyệt nhưng safety gate chặn; release chuyển sang `local-tfidf-ngram-v1` và không xuất corpus | Khôi phục `C:\tmp\abcde-kb-backup-20260721\knowledge_base_abcde.before.json` nếu local retrieval không đạt gate |
| Tối đa hai commit | Chỉ allowlist ABCDE trên branch `codex/abcde-rag-production-hardening-20260721`; tuyệt đối không commit `main` | Có thể revert commit trên branch sau phê duyệt riêng |
| Một lần push | Chỉ push branch `codex/abcde-rag-production-hardening-20260721`; không push/merge `main` | Không merge branch; có thể xóa remote branch sau phê duyệt xóa riêng |
| Tạo deployment Apps Script mới | `npx.cmd --yes @google/clasp deploy --versionNumber 69 --description "ABCDE submission dedicated deployment 20260721"` trên script ID đã nêu | Gỡ `ABCDE_APPS_SCRIPT_URL` khỏi deploy kế tiếp hoặc trỏ về URL trước; không xóa deployment tự động |
| Ghi Vercel production env | `ABCDE_RAG_ENABLED=true`, `DHM_PASSCODE=DHM8,DHM9,ABCDE`, `ABCDE_APPS_SCRIPT_URL=<URL deployment ABCDE mới>`, `RAG_TOP_K=3`; ngưỡng TF-IDF/coverage lấy từ manifest đã qua eval | Khôi phục snapshot tên/giá trị đã lưu cục bộ; ưu tiên rollback deployment |
| Deploy Vercel production | `vercel deploy --prod --yes` chỉ từ gói sạch `C:\tmp\dh4hn-abcde-rag-release-clean-20260722` | `vercel rollback https://delivering-happiness-cox2r4mqb-vuhoang2708s-projects.vercel.app` |
| Một mutation UAT | Đúng một submit ABCDE có marker `CODEX_UAT_ABCDE_RAG_20260721`, email `vuhoang2708@gmail.com`, `chatVersion=beta` | Giữ dòng để đối soát, không xóa tự động; ghi rõ timestamp/UUID |
| Một email báo cáo cuối | Gmail từ tài khoản đã xác thực đến `vuhoang2708@gmail.com`, đính kèm report và ảnh chính | Không thể thu hồi đảm bảo; chỉ gửi sau khi toàn bộ claim đã được kiểm chứng |
