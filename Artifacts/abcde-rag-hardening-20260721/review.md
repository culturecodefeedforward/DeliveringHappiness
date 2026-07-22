# Rà soát ABCDE RAG Production Hardening

- Thời điểm: 2026-07-22T10:19:09+07:00
- Worktree: `C:\tmp\dh4hn-abcde-rag-hardening-20260721`
- Branch: `codex/abcde-rag-production-hardening-20260721`
- Kết luận hiện tại: `VERIFIED local code/test/final KB`; `UNVERIFIED repo/live/browser/Sheet/email`

## Phạm vi đã rà soát

- Chính sách Socratic tất định cho đủ A-B-C-D-E.
- API Beta, truy xuất TF-IDF cục bộ, citation, chống chèn chỉ thị, giới hạn kích thước và timeout.
- Frontend lưu bản nháp, chuyển trạng thái, fallback Stable và hiển thị citation.
- Pipeline corpus, source manifest, 18 case study, runner chất lượng và tài liệu vận hành.
- Bằng chứng Vercel/Apps Script chỉ đọc; không có mutation production trong vòng review.

## Phát hiện đã sửa

1. **HIGH - local retrieval bỏ qua trạng thái audit của KB.**
   - Trước sửa, `rag_health` có thể báo manifest sai nhưng truy xuất local vẫn dùng tệp.
   - Đã bắt buộc `loadAuditedKnowledgeBase` kiểm tra manifest, retrieval model, toàn bộ chunk approved, không có vector và SHA-256 trước khi xếp hạng.
   - Bằng chứng: `lib/abcde-rag-retrieval.js`, `tests/abcde-rag.test.js` đạt 9/9.

2. **HIGH - nháp suy diễn bị từ chối ở A có thể đi vào retrieval/submit.**
   - Frontend từng cộng dồn mọi lượt A rồi lưu cả câu sai khi lượt sau được chấp nhận.
   - Đã đổi A/B sang chỉ lưu câu cuối được policy xác nhận; C/D/E vẫn cộng dồn theo yêu cầu nghiệp vụ.
   - Bằng chứng mã: `chat-abcde.js`. Bằng chứng UI/live còn `UNVERIFIED` và đã thêm ca kiểm thử vào Phase 5.

3. **HIGH - chèn chỉ thị có thể tồn tại trong history/context.**
   - Đã lọc user history có mẫu chèn chỉ thị, chặn cả practiceContext, xử lý guard tại server trước API key/model và gỡ lượt độc hại khỏi draft/history frontend.
   - Bằng chứng: `tests/abcde-rag-endpoint.test.js` đạt 7/7.

4. **MEDIUM - model có thể tự nhảy bước hoặc trả nhiều câu hỏi/lời khuyên.**
   - Policy tất định ghi đè state của model; response bị ép về tối đa một câu phản chiếu và đúng một câu hỏi; B cần ngôi thứ nhất, D chặn lặp từ khóa.
   - Bằng chứng: `tests/abcde-socratic-policy.test.js` đạt 15/15.

5. **MEDIUM - KB/manifest thiếu cổng toàn vẹn và pipeline có thể vượt 120 chunk.**
   - Đã kiểm tra SHA-256, retrieval_model, vector_dimensions=0 và chunk/approved counts; giới hạn 120 tính cả 18 case study; generated_at dùng thời gian chạy thật.
   - Build cuối tạo 61 chunk bài giảng đã ẩn danh + 18 case study, tổng 79 chunk.

6. **MEDIUM - request ngoài có thể treo hoặc làm context tăng không giới hạn.**
   - Đã thêm timeout cho Gemini chat và KV; giới hạn history, practiceContext, message/reply; giới hạn kích thước bộ nhớ rate limit local.

7. **HIGH - xuất corpus sang dịch vụ ngoài không vượt qua cổng an toàn.**
   - Người dùng đã duyệt gửi 61 chunk sang Gemini Embedding API, nhưng lớp an toàn thực thi chặn lệnh; không có dữ liệu nào được gửi.
   - Đã chuyển sang `local-tfidf-ngram-v1`, bỏ toàn bộ đường gọi embedding/Upstash và thêm test chứng minh request Gemini chat không chứa text của chunk truy xuất.

8. **MEDIUM - redaction cũ phân biệt hoa thường và có thể sót tên trong transcript ASR.**
   - Đã thêm alias không phân biệt hoa thường cho tên thực tế bị ASR viết thường, đồng thời giữ các tên đa nghĩa ở chế độ phân biệt hoa thường để không phá cụm từ phổ thông.
   - Quality runner đối chiếu cả hai danh sách; KB rebuild báo 0 phát hiện dữ liệu cá nhân tự động.

9. **MEDIUM - retrieval đúng nguồn nhưng chưa tác động rõ tới câu hỏi.**
   - Backend hiện chọn một lăng kính Socratic chung từ message/concept: Evidence, Alternatives, Implications hoặc Utility.
   - Chỉ tên lăng kính đi vào prompt; toàn văn chunk và citation metadata vẫn ở local. Endpoint test chứng minh lăng kính có mặt nhưng text fixture không có trong outbound body.

## Rủi ro còn lại

1. **HIGH - Apps Script version 69 không xác minh HMAC.**
   - `api/chat-abcde.js` tạo chữ ký, nhưng `C:\tmp\dh4hn-gas-v69-inspect-20260721\active_code_gs_final.js` gọi thẳng `handleAbcdeSubmission` mà không kiểm tra chữ ký.
   - Đây là rủi ro có sẵn của luồng Stable, không được claim là đã khắc phục trong release Beta.
   - Không sửa ngầm vì thay đổi source Apps Script dùng chung cần plan, test hồi quy và phê duyệt riêng.

2. **MEDIUM - production chưa có rate limit phân tán.**
   - `vercel env ls production` lúc 2026-07-22 chỉ có `DHM8_APPS_SCRIPT_URL`, `GEMINI_MODEL`, `GEMINI_API_KEY`.
   - Không có `KV_REST_API_URL`/`KV_REST_API_TOKEN`; runtime sẽ dùng giới hạn trong từng function instance.

3. **MEDIUM - chất lượng live của truy xuất local chưa được kiểm chứng.**
   - Bộ eval local đạt 6/6 ca trong miền và từ chối 6/6 ca ngoài miền.
   - Browser/API production vẫn phải chứng minh citation, độ trễ và không hồi quy trước khi claim live.

## Kết quả kiểm thử hiện tại

| Cổng | Kết quả | Mức claim |
| :--- | :--- | :--- |
| Socratic policy | 15/15 | VERIFIED local |
| Retrieval/audit | 10/10 | VERIFIED local |
| Endpoint integration | 7/7 | VERIFIED local |
| Full-flow | 61/61 lượt, 6 hành trình | VERIFIED local |
| Một câu hỏi | 100% | VERIFIED local |
| Final KB | 79 chunk, 18 case study, 6 source, 3 notebook | VERIFIED local |
| Trùng lặp | 1.27% | VERIFIED local |
| PII tự động | 0 phát hiện | VERIFIED local |
| TF-IDF/manifest/no-vector | local-tfidf-ngram-v1, SHA-256 khớp, vector 0 | VERIFIED local |
| Retrieval trong miền / ngoài miền | 6/6 / 6/6 | VERIFIED local |
| Browser/production/Sheet/email | Chưa chạy bản mới | UNVERIFIED |
| Runtime-only release package | 83 file được hash; 8/8 runtime ABCDE khớp worktree | VERIFIED local |
| Vercel bundle build | `vercel build` dừng trước build vì thiếu local project settings; không tự pull env | UNVERIFIED |

## Trạng thái Git và production

- Worktree vẫn chưa stage/commit/push.
- `main` nguồn bẩn không bị sửa, stage, commit hoặc push bởi lane này.
- Gói runtime-only: `C:\tmp\dh4hn-abcde-rag-release-clean-20260722`; không có `.git`, `.env*`, `node_modules`, raw transcript, plan hoặc scratch. Chỉ giữ `.vercel/project.json` làm targeting metadata.
- Release manifest: `C:\tmp\dh4hn-abcde-rag-release-clean-20260722\release-manifest.sha256`.
- Production alias vẫn ở deployment baseline `dpl_HsmfZ5e85f7gUeidDNqB8QTVGrSX`.
- Chưa tạo Apps Script deployment mới, chưa sửa env, chưa deploy Vercel, chưa ghi Sheet và chưa gửi Gmail.
