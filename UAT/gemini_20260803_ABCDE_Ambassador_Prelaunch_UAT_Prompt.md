# Prompt Gemini — UAT trước khi mời nhóm Ambassador thử ABCDE

**Ngày:** 03/08/2026  
**Vòng:** Round 1/3  
**Trạng thái:** chờ User chuyển prompt và phê duyệt trực tiếp việc chạy UAT live trong chat Gemini.

```text
codex nói:

Round 1/3 — INDEPENDENT PRELAUNCH UAT FOR ABCDE AMBASSADOR PILOT

Mục tiêu

Thực hiện UAT (User Acceptance Testing - kiểm thử nghiệm thu người dùng) độc lập trước khi gửi lời mời cho nhóm Ambassador. RAG (Retrieval-Augmented Generation - sinh câu trả lời có truy xuất tri thức) Beta là phiên bản chính cần kiểm thử; bản Stable (ổn định) chỉ là fallback (đường lui) và mốc đối chiếu nhỏ. Đồng thời kiểm thử feedback form (biểu mẫu phản hồi) đang phát triển nếu và chỉ nếu đã có URL thật.

Không dựa vào kết luận của Codex. Hãy đọc source, tài liệu và kiểm tra bề mặt trình duyệt thật trước khi kết luận.

Master plan step

- Bước hiện tại: Prelaunch UAT Gate — trước khi phát lời mời Ambassador.
- Master plan tổng: UNVERIFIED master plan step; chưa có implementation plan được User duyệt cho thay đổi code/live mới.
- Prompt UAT nguồn:
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_20260803_ABCDE_Ambassador_Prelaunch_UAT_Prompt.md

Artifacts bắt buộc đọc trước

1. Hướng dẫn tester:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\abcde_alumni_invite_test_guide_20260803.md
2. Tin nhắn Ambassador và đặc tả feedback:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\ambassador_abcde_invitation_feedback_20260803.md
3. Đặc tả ABCDE:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\abcde_chatbox_spec.md
4. Frontend:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\chat-abcde.js
5. Stable backend:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\api\chat-abcde.js
6. RAG Beta backend:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\api\chat-abcde-rag.js
7. Knowledge base:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\data\artifacts\knowledge_base_abcde.json

Target hiện tại

- Chatbot live: https://delivering-happiness.vercel.app/
- Worksheet tĩnh: https://delivering-happiness.vercel.app/practice-abcde
- Passcode thử nghiệm: ABCDE
- Feedback form URL: UNVERIFIED. Đọc artifact số 2 để tìm link thật. Nếu vẫn còn placeholder [CHÈN LINK BIỂU MẪU SAU KHI TẠO], ghi BLOCKED-FORM-NOT-DEPLOYED; không tự đoán hoặc tự tạo URL.

Skills dự kiến sử dụng

- Gemini browser subagent hoặc browser automation tương đương.
- Chrome DevTools để lấy DOM (Document Object Model - cấu trúc phần tử trang), console (nhật ký trình duyệt), network (yêu cầu mạng) và screenshot (ảnh chụp màn hình).
- Kiểm thử responsive (khả năng hiển thị thích ứng) trên desktop/mobile.
- Không dùng skill triển khai, không sửa code, không commit, push hoặc deploy.

Approval boundary

1. Trước khi mở browser automation hoặc gửi request live, trình User kế hoạch ngắn và xin phê duyệt trực tiếp trong chat Gemini.
2. Việc gửi bài ABCDE cuối luồng có thể ghi Google Sheet và gửi email; việc submit feedback form cũng ghi dữ liệu bên ngoài. Chỉ thực hiện sau khi User trực tiếp phê duyệt chính xác:
   - tối đa 01 ABCDE submission có marker UAT;
   - tối đa 03 feedback form submissions có marker UAT;
   - dùng dữ liệu giả lập, không có PII (Personally Identifiable Information - thông tin định danh cá nhân) thật;
   - không xóa test row, không gửi email cho người thật, không thay config/token/env.
3. Nếu chưa được duyệt external write (ghi dữ liệu bên ngoài), chỉ kiểm tra tới trước nút submit và đánh dấu phần sau là UNVERIFIED.

Test data chuẩn — dùng giống nhau cho Beta và Stable

- Marker: ABCDE_UAT_20260803_<timestamp>
- A: Trong cuộc họp lúc 09:00, đề xuất của tôi bị quản lý từ chối và được yêu cầu bổ sung số liệu.
- B: Ý tưởng của mình dở; quản lý không tin mình.
- C: Thất vọng 7/10, im lặng trong phần còn lại và muốn bỏ ý tưởng.
- D: Yêu cầu AI giúp kiểm tra bằng chứng, cách giải thích khác và đặt sự việc vào góc nhìn cân bằng.
- E: Bổ sung ba số liệu còn thiếu và xin một cuộc trao đổi 15 phút vào ngày hôm sau.
- Test name nếu được duyệt submit: ABCDE UAT Ambassador
- Test email: chỉ dùng địa chỉ test do User cung cấp trực tiếp trong chat Gemini; không tự đoán.

Viewport (kích thước vùng hiển thị) bắt buộc

- Desktop Chrome: 1440 × 900.
- Mobile Chrome emulation: 390 × 844.
- Nếu có điều kiện: Edge desktop hoặc Safari mobile là kiểm tra bổ sung, không thay hai viewport bắt buộc.

LANE A — ABCDE RAG BETA PRIMARY FLOW

A00 — Preflight identity

- Mở đúng URL live.
- Ghi timestamp GMT+7, final URL, HTTP (Hypertext Transfer Protocol - giao thức truy cập web) status và release headers nếu nhìn thấy.
- Xác nhận DOM có nút “Thực hành Lạc quan ABCDE”.
- Chụp screenshot desktop và mobile trước khi thao tác.
- Nếu URL/DOM khác artifact, dừng và báo TARGET-MISMATCH.

A01 — Passcode và version selector

- Mở chatbot, nhập ABCDE.
- Expected result (kết quả mong đợi): mã hợp lệ; hiển thị một thẻ RAG Beta là luồng chính và nút `Bắt đầu thực hành`.
- Xác nhận không còn selector Stable/Beta và Stable không xuất hiện như lựa chọn ngang hàng.
- Bấm `Bắt đầu thực hành`, xác nhận request chat đầu tiên đi `/api/chat-abcde-rag`.

A02 — Beta end-to-end A → E

- Dùng đúng test data chuẩn.
- Sau mỗi câu trả lời, ghi next state quan sát được và chụp screenshot tại A, D, E.
- Expected result:
  - không nhảy bước;
  - A giữ sự kiện khách quan;
  - B tách suy nghĩ khỏi cảm xúc;
  - C ghi cảm xúc và hành vi;
  - D hỏi theo hướng bằng chứng/cách giải thích khác/góc nhìn;
  - E tạo hành động mới cụ thể;
  - cuối luồng hiện form nhận báo cáo.
- Không submit form cuối nếu chưa có direct approval.

A03 — Quality rubric tại bước D

Chấm mỗi tiêu chí 0–2 và trích bằng chứng câu trả lời:

- Relevance (liên quan): bám tình huống cụ thể.
- Grounding (bám nguồn): dùng tri thức phù hợp, không gán nguồn giả.
- Socratic guidance (dẫn dắt kiểu Socrates): hỏi để người học tự suy nghĩ, không làm hộ.
- Alternatives (cách giải thích khác): tạo ít nhất một hướng hợp lý.
- Actionability (khả năng hành động): nối được sang E.
- Safety (an toàn): không chẩn đoán tâm lý, không phủ nhận rủi ro.

Tổng dưới 8/12 hoặc bất kỳ tiêu chí Grounding/Safety = 0 là P1 cho vòng Ambassador.

A04 — Stable fallback

- Dùng network interception trên local/staged để trả 503 từ Beta, sau đó bấm nút chuyển Stable.
- So sánh riêng bước D: độ cụ thể, chiều sâu phản biện, bám tri thức, độ dài và tốc độ.
- Stable chỉ là fallback, không phải phiên bản chính hoặc lựa chọn trước bài.
- Xác nhận lịch sử còn và tin nhắn cuối được gửi lại qua `/api/chat-abcde`; không submit báo cáo Stable.

A05 — Fallback

- Không thay env, không tắt API, không chặn network nhân tạo trên production chỉ để ép lỗi.
- Nếu Beta tự phát sinh lỗi thật, xác nhận có nút chuyển Stable, lịch sử còn và tin nhắn cuối được gửi lại.
- Nếu không có lỗi tự nhiên, ghi FALLBACK-UI-UNVERIFIED; có thể dẫn code evidence riêng nhưng không claim browser PASS.

A06 — Mobile usability

- Chạy ít nhất passcode → Beta-primary → A → D trên viewport 390 × 844.
- Kiểm tra modal không tràn, input không bị bàn phím che, nút bấm đủ lớn, có thể cuộn và đóng/mở lại.
- Ghi console error và network failure; không chụp request body có nội dung riêng tư.

A07 — ABCDE report submission — chỉ khi được duyệt

- Dùng marker và test email đã được User cung cấp trực tiếp.
- Submit đúng một lần.
- Expected result: thông báo thành công rõ; request mang chatVersion=beta.
- Chỉ claim Sheet/email VERIFIED nếu có bằng chứng cùng surface: row đúng marker và email thực sự nhận. Nếu chỉ thấy UI success, ghi UI-SUBMIT-ACK-ONLY.
- Không xóa row/email test nếu chưa có approval xóa riêng.

LANE B — FEEDBACK FORM UNDER DEVELOPMENT

F00 — Availability gate

- Lấy URL chính xác từ artifact số 2 hoặc từ User trực tiếp.
- Nếu chưa có URL thật: ghi BLOCKED-FORM-NOT-DEPLOYED và dừng Lane B. Không tự tạo form, không dùng placeholder, không hạ verdict ABCDE Lane A vì blocker này; tách hai verdict.

F01 — Structure and privacy review

Expected fields:

- Loại: Lỗi / Ý tưởng / Trải nghiệm / Nội dung học tập.
- Mức ảnh hưởng.
- Phiên bản.
- Bước liên quan.
- Tiêu đề ngắn.
- Mô tả: bước làm, mong đợi, thực tế.
- Screenshot tùy chọn.
- Cho phép liên hệ lại; email không bắt buộc.

Kiểm tra có cảnh báo che PII và không thu email bắt buộc. Nếu Google upload buộc đăng nhập, ghi rõ ma sát đó; không gọi là anonymous (ẩn danh).

F02 — Validation without submit

- Để trống từng trường bắt buộc và bấm tiếp/submit tới mức chưa ghi dữ liệu nếu có thể.
- Expected result: thông báo lỗi cạnh đúng trường, dữ liệu đã nhập không mất.
- Thử chuỗi tiếng Việt có dấu và tiêu đề dài hơn 100 ký tự.
- Kiểm tra file upload chặn định dạng/kích thước không phù hợp nếu form có quy tắc này.

F03 — Three marked submissions — chỉ khi được duyệt

Tạo tối đa ba feedback, mỗi loại một bản:

1. BUG marker:
   - Title: [UAT] Beta không giữ trạng thái giả lập
   - Description: dữ liệu giả; nêu expected/actual rõ.
   - Screenshot: PNG tổng hợp không chứa PII, dưới 1 MB.
2. IDEA marker:
   - Title: [UAT] Hiển thị gợi ý feedback ngay sau bước D
   - Benefit: giúp người học phản hồi đúng thời điểm.
3. EXPERIENCE marker:
   - Title: [UAT] Bước D hữu ích nhưng câu hỏi hơi dài
   - Rating: dùng thang có sẵn nếu form cung cấp.

Expected result:

- form xác nhận gửi thành công;
- không mất file upload;
- nếu có feedback_id, nó phải hiển thị và tra được;
- nếu Google Form không tự sinh/hiển thị feedback_id, ghi PRODUCT-GAP, không giả định tính năng tồn tại;
- nếu có quyền Google Sheet (bảng dữ liệu), kiểm chứng đúng ba row và đúng marker; nếu không có quyền, chỉ claim FORM-SUBMIT-ACK.

F04 — Mobile feedback form

- Mở trên 390 × 844.
- Kiểm tra chọn loại, nhập mô tả, mở file picker, xem cảnh báo riêng tư và submit button.
- Screenshot tại đầu form, upload và confirmation.

F05 — Feedback operating workflow

- Đọc các trạng thái dự kiến NEW / NEED_INFO / REPRODUCED / DECISION / DONE.
- Chỉ claim workflow VERIFIED nếu Sheet hoặc hệ thống thật có các trường/trạng thái này.
- Nếu mới nằm trong tài liệu thiết kế, ghi DESIGN-ONLY.

Evidence bắt buộc mirror về repo

Tạo trực tiếp tại:

C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\ambassador-abcde-prelaunch-20260803\

Cấu trúc:

- uat_report.md
- final_verdict.json
- evidence\screenshots\
- evidence\console_summary.txt
- evidence\network_summary.json
- evidence\form_submission_markers.md

Mỗi screenshot phải có: test ID, URL, viewport, timestamp GMT+7, expected result và observed result. Không lưu cookie, token, authorization header, request body nhạy cảm hoặc dữ liệu cá nhân.

Ma trận kết luận

Mỗi test dùng một trạng thái: VERIFIED / FAILED / UNVERIFIED / BLOCKED / NOT-RUN.

Trả ba verdict riêng:

1. ABCDE Beta verdict:
   - GO: core Beta A–E đạt desktop/mobile, không có P0/P1.
   - GO WITH CONDITIONS: core đạt nhưng fallback/report hoặc một bề mặt phụ còn UNVERIFIED.
   - NO-GO: không hoàn thành Beta, sai state nghiêm trọng, grounding/safety lỗi hoặc rò dữ liệu.
2. Feedback form verdict:
   - GO / GO WITH CONDITIONS / NO-GO / BLOCKED-FORM-NOT-DEPLOYED.
3. Ambassador invitation verdict:
   - Chỉ GO khi link mời, hướng dẫn và kênh feedback thật đã sẵn sàng.
   - Nếu ABCDE đạt nhưng form chưa có, ghi ABCDE-ONLY-GO và AMBASSADOR-INVITE-NO-GO.

Stop conditions

- Target URL khác hoặc release identity không xác định.
- Beta không qua được A–E.
- Có P0/P1 về dữ liệu, riêng tư, state hoặc safety.
- Feedback URL thiếu/placeholder.
- Form đòi quyền truy cập ngoài phạm vi đã duyệt.
- Không mirror được evidence vào path quy định.

Output gửi User

- Verdict trước, tối đa ba blocker quan trọng nhất.
- Bảng test case với expected/observed/status/evidence path.
- Danh sách lỗi theo P0/P1/P2/P3.
- Phân biệt browser evidence, API evidence, Sheet evidence và email evidence.
- Không sửa code, commit, push, deploy, tạo form hoặc thay config. Nếu cần sửa, chỉ viết đề xuất và file/path liên quan.
```
