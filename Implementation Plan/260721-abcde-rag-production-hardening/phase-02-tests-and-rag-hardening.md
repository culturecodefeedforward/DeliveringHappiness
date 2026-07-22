---
phase: 2
title: "Socratic and Retrieval Quality Upgrade"
status: completed
effort: "120-180 phút"
---

# Phase 2: Socratic and Retrieval Quality Upgrade

## Overview

Áp dụng `TDD` (Test-Driven Development - phát triển dựa trên kiểm thử) cho hai nâng cấp người học cảm nhận trực tiếp: Socratic theo đúng từng bước A-B-C-D-E và retrieval dùng toàn ngữ cảnh. RAG chủ yếu bơm tri thức ở D; nguyên tắc Socratic bắt buộc ở cả năm bước.

## Implementation Steps

1. Tạo `lib/abcde-socratic-policy.js` với rubric và cổng chuyển trạng thái riêng:
   - **A - Adversity:** phản chiếu ngắn; tách dữ kiện quan sát được khỏi nhãn, suy diễn ý định, quy chụp và từ tuyệt đối; chỉ sang B khi có sự kiện cụ thể. Câu “sếp bất công, cố tình phá cuối tuần” phải giữ `STEP_A` và hỏi lại điều gì thực sự xảy ra.
   - **B - Belief:** gợi học viên nói nguyên văn suy nghĩ tự động ở ngôi thứ nhất; không gán niềm tin thay họ; chỉ sang C khi có ít nhất một belief rõ.
   - **C - Consequence:** hỏi cảm xúc, cường độ 0-10 và hành vi/phản ứng; làm rõ liên kết B tạo ra C; chỉ sang D khi có cả cảm xúc hoặc hành vi đủ dùng.
   - **D - Disputation:** mỗi lượt chọn đúng một lăng kính Evidence, Alternatives, Implications hoặc Utility; dùng tri thức truy xuất để hỏi, không đưa đáp án; học viên phải tự hình thành phản biện.
   - **E - Energization:** hỏi lại cường độ cảm xúc sau phản biện, góc nhìn mới và một hành động cụ thể; chỉ `SUBMIT` khi chính học viên nêu được kết quả mới.
   - Quy tắc chung: phản chiếu tối đa một câu, tiếp theo đúng một câu hỏi mở; không phán xét, không khuyên chung chung, không hỏi dồn.
2. Viết `tests/abcde-socratic-policy.test.js` trước khi sửa runtime:
   - một ca đạt và một ca chưa đạt cho từng A-B-C-D-E;
   - ca A suy diễn “sếp cố tình”, “tôi luôn bị ghét”, “mọi thứ hỏng hết”;
   - ca chống leading question (câu hỏi dẫn dắt), trả lời hộ, nhiều hơn một dấu hỏi và nhảy bước;
   - contract `nextState`, `stageComplete`, `assessmentCode` chỉ dùng enum, không trả chain-of-thought (chuỗi suy luận nội bộ).
3. Sửa `chat-abcde.js`:
   - gửi `practiceContext` có A/B/C/D/E đã xác nhận cùng `state` và `history`;
   - chỉ lưu đáp án bước khi backend xác nhận `stageComplete=true`;
   - hiển thị citation ngắn dưới tin nhắn D bằng title/source; có trạng thái “cần thêm ngữ cảnh” khi confidence thấp;
   - giữ fallback Stable và không để citation làm thay đổi kích thước/chen lấn giao diện.
4. Tạo `lib/abcde-rag-retrieval.js`:
   - query builder dùng A + B + C + tin nhắn D hiện tại, có trọng số cao hơn cho B;
   - xếp hạng lexical, cổng TF-IDF unigram/bigram và độ phủ corpus, sau đó source-aware deduplication (loại trùng theo nguồn);
   - chọn tối đa 2-3 chunks nhưng ưu tiên khác source hoặc khác lăng kính phản biện;
   - confidence gate phân biệt `grounded`, `low_confidence`, `no_match`, `infrastructure_error`;
   - cache KB theo warm instance và không log vector/toàn văn chunk.
5. Viết `tests/abcde-rag.test.js`:
   - chứng minh query A-B-C xếp đúng case hơn query chỉ dùng câu cuối;
   - top results không lặp cùng chunk/source khi có lựa chọn tương đương;
   - câu hỏi ngoài miền hoặc thiếu ý định phản biện trả `no_match` và không tạo citation;
   - KB mất/hỏng không được gắn nhãn RAG thành công;
   - health action, env, threshold/top-k và citation metadata không lộ secret.
6. Sửa `api/chat-abcde-rag.js`:
   - dùng stage policy ở mọi A-B-C-D-E;
   - yêu cầu Gemini trả JSON có `reply`, `stageComplete`, `nextState`, `assessmentCode`, `citationIds`; bỏ phụ thuộc vào tag `[NEXT_STATE]` tự do;
   - giữ một câu hỏi Socratic mỗi lượt và hạ temperature cho quyết định state ổn định;
   - chỉ gọi retrieval khi D có đủ A-B-C; confidence thấp thì hỏi rõ thay vì nhét case không chắc;
   - trả `ragStatus`, `ragUsed`, `retrievalSource`, `citationCount`, `kbVersion` cùng contract frontend.
7. Sửa `api/chat-abcde.js` và nhánh submit của RAG để ưu tiên `ABCDE_APPS_SCRIPT_URL`; không thay hành vi Socratic Stable trong release Beta này.
8. Sửa `vercel.json` để đóng gói KB/manifest; chạy parse, unit test và kiểm tra function bundle thật có dữ liệu.

## Stop Conditions

- Structured output của model không ổn định và không có parser fallback an toàn.
- State policy cần trả lời hộ học viên để đạt test.
- Local ranking không đạt ít nhất 85% ca trong miền hoặc không từ chối 100% ca ngoài miền.
- Build không chứng minh được KB/manifest nằm trong function bundle.

## Success Criteria

- [x] Socratic policy có test cho đủ A-B-C-D-E; bước A loại đúng câu suy diễn mẫu.
- [x] 100% fixture chỉ có một câu hỏi mở và không nhảy bước khi thiếu dữ liệu.
- [x] D dùng query A-B-C có bằng chứng xếp hạng tốt hơn message-only baseline.
- [x] Top chunks đạt source diversity; không còn hai kết quả gần trùng khi có nguồn thay thế.
- [x] Không còn lỗi hạ tầng bị gắn nhãn RAG thành công.
- [ ] Frontend hiển thị citation và low-confidence state không chồng lấn UI.
