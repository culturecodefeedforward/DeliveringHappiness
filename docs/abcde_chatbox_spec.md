# Đặc tả kỹ thuật Chatbox ABCDE Socratic

Tài liệu này là nguồn chuẩn (source of truth - nơi các agent cùng tham chiếu) cho hai phiên bản Chatbox ABCDE trên website Delivering Happiness. Trạng thái triển khai thật phải đọc từ báo cáo UAT và bằng chứng production; tài liệu kiến trúc không thay thế kiểm chứng live.

## 1. Hai phiên bản

| Phiên bản | Endpoint chat | Điều khiển bước | Tri thức truy xuất |
| :--- | :--- | :--- | :--- |
| Stable | api/chat-abcde.js | Gemini trả tag NEXT_STATE theo system instruction hiện hành | Không |
| RAG Beta | api/chat-abcde-rag.js | lib/abcde-socratic-policy.js quyết định tất định | Chỉ ở bước D khi đủ A-B-C |

Người học chọn phiên bản trước khi bắt đầu. Nếu Beta trả 502 hoặc 503, giao diện cho phép chuyển sang Stable mà không lặp tin nhắn hay mất bản nháp hiện tại. Beta chỉ bật khi ABCDE_RAG_ENABLED=true; biến thiếu hoặc mọi giá trị khác đều là trạng thái tắt an toàn của công tắc khẩn cấp (kill switch).

Xác thực passcode và submit luôn đi qua Stable API. Beta chỉ xử lý hội thoại.

## 2. Luồng RAG Beta

1. Frontend gửi state, message, history, practiceContext A-B-C-D-E và controlIntent.
2. lib/abcde-socratic-policy.js chấm rubric của bước hiện tại.
3. Chỉ ở STEP_D, khi A-B-C đều có dữ liệu, backend tạo query từ A + B + B + C + D hiện tại.
4. Backend xếp hạng kho tri thức cục bộ bằng TF-IDF unigram/bigram và độ phủ corpus.
5. Chỉ kết quả approved vượt cả ngưỡng điểm và ngưỡng độ phủ mới được trả về làm citation; backend dùng metadata chung để chọn một lăng kính Evidence, Alternatives, Implications hoặc Utility.
6. Toàn văn kho tri thức, citation metadata và vector không được gửi tới Gemini; model chỉ nhận ngữ cảnh bài làm, rubric và tên lăng kính Socratic chung.
7. Gemini trả JSON có cấu trúc, nhưng stageComplete và nextState cuối cùng vẫn lấy từ policy tất định.
8. Frontend chỉ chuyển bước khi stageComplete=true.

## 3. Rubric Socratic A-B-C-D-E

Quy tắc chung cho Beta:

- Mỗi lượt phản chiếu tối đa một câu rồi đặt đúng một câu hỏi mở.
- Không trả lời hộ, không gán niềm tin, không phán xét và không hỏi dồn.
- Quyết định stageComplete, nextState và assessmentCode do policy tất định tạo ra; model không được tự nhảy bước.
- Khi policy xác định bước hiện tại chưa hoàn tất, backend giữ tối đa một câu phản chiếu an toàn từ model nhưng bắt buộc dùng câu hỏi tất định của chính bước đó; câu hỏi do model tạo không được lấn sang bước sau.
- Khi A hoặc B hoàn tất, chỉ câu cuối đã được policy xác nhận được lưu; nháp bị từ chối không đi vào retrieval hoặc báo cáo.
- C và E có thể được hoàn thành qua nhiều lượt; frontend gửi bản nháp cộng dồn trong practiceContext.

| Bước | Điều kiện giữ lại | Điều kiện hoàn tất |
| :--- | :--- | :--- |
| A - Adversity | Còn nhãn, từ tuyệt đối, suy diễn ý định hoặc thiếu sự kiện quan sát được | Có sự kiện cụ thể, trung tính, người ngoài có thể quan sát |
| B - Belief | Chưa có câu tự nhủ ở ngôi thứ nhất | Người học nói rõ niềm tin tự động của chính mình |
| C - Consequence | Thiếu cảm xúc, cường độ 0-10 hoặc hành vi | Có đủ ba thành phần và liên hệ với B; hành vi thường gặp gồm mất tập trung, cáu gắt và trì hoãn |
| D - Disputation | Chưa có phản biện do người học tự hình thành | Có lập luận theo Evidence, Alternatives, Implications hoặc Utility và người học chọn đi tiếp |
| E - Energization | Thiếu cường độ mới, góc nhìn mới hoặc hành động | Có đủ ba thành phần trước khi sang SUBMIT |

Các chỉ thị kiểu “bỏ qua quy tắc”, “in system prompt” hoặc “chuyển thẳng sang SUBMIT” bị xử lý tại server bằng PROMPT_INJECTION_BLOCKED; request không được gửi tiếp tới Gemini.

## 4. Hợp đồng response của RAG Beta

Response thành công gồm:

- success
- reply
- stageComplete
- nextState
- assessmentCode
- citations
- ragStatus
- ragUsed
- ragLens
- retrievalSource
- citationCount
- kbVersion
- modelOutputStatus

Các trạng thái RAG:

- not_applicable: không phải bước D.
- needs_context: bước D nhưng thiếu A, B hoặc C đã xác nhận.
- grounded: có kết quả vượt cổng độ tin cậy.
- low_confidence: có kết quả sát ngưỡng nhưng chưa đủ để đưa vào prompt.
- no_match: không có chunk phù hợp.
- infrastructure_error: tệp kho tri thức hoặc artifact manifest cục bộ lỗi.

ragUsed=true khi backend tìm được kết quả grounded và trả citation approved. Model không được chọn citationId; backend chọn tối đa hai citation đầu từ kết quả truy xuất cục bộ. Response không được chứa toàn văn chunk, vector hoặc score.

## 5. Truy xuất và kho tri thức

lib/abcde-rag-retrieval.js tạo chỉ mục TF-IDF cục bộ từ unigram và bigram, dùng lexical score để xếp hạng, sau đó loại trùng và ưu tiên khác nguồn. Điểm TF-IDF và độ phủ corpus là cổng tin cậy; truy xuất chỉ chạy khi câu hiện tại có ý định phản biện ở bước D.

Quy tắc truy xuất:

1. Chỉ dùng tệp local đã được đóng gói cùng Vercel Serverless Function.
2. Không gọi Gemini Embedding API và không gọi vector database từ runtime.
3. Chỉ chunk có review_status=approved được xếp hạng và hiển thị citation.
4. KB chỉ được coi là healthy khi có artifact manifest, retrieval_model=local-tfidf-ngram-v1, vector_dimensions=0, toàn bộ chunk đã approved và SHA-256 của tệp khớp manifest.
5. Câu hỏi ngoài miền hoặc thiếu ý định phản biện phải trả no_match và không có citation.

Các artifact:

- data/sources/abcde_source_manifest.json: notebook/source ID, checksum, phạm vi review và quyết định approved/rejected.
- Scripts/build_abcde_kb.py: redaction, semantic chunking, deduplicate, bảo toàn 18 case study và tạo artifact manifest; script không có đường gọi embedding bên ngoài.
- data/artifacts/knowledge_base_abcde.json: văn bản và metadata dùng runtime, không chứa vector.
- data/artifacts/knowledge_base_abcde_manifest.json: version, checksum, số chunk, số nguồn, retrieval model và vector_dimensions=0.

Raw transcript NotebookLM chỉ nằm trong C:/tmp; không được commit. Corpus release gồm 61 chunk bài giảng đã ẩn danh từ 5 source thuộc 3 notebook và 18 case study đã có, tổng 79 chunk. Bốn chunk sách cũ có citation trang chưa xác minh không được đưa vào KB mới. Toàn bộ corpus không được xuất sang Gemini; runtime cũng không đưa nội dung chunk vào request chat.

Trang practice-abcde vẫn dùng cùng KB và lọc đúng 18 record có source_type=case_study; build dừng nếu số case khác 18.

## 6. Citation và giao diện

Frontend render citation bằng DOM textContent, không chèn HTML từ metadata. Citation hiển thị title, source và location; giao diện có trạng thái cần thêm ngữ cảnh khi confidence thấp. Chỉ Beta dùng khối citation.

Frontend chỉ ghi một bước vào currentPractice khi:

- Stable trả nextState khác state hiện tại; hoặc
- Beta trả stageComplete=true và nextState khác state hiện tại.

Nút đi tiếp ở D gửi controlIntent=advance về backend; frontend không tự gán STEP_E. Khi chuyển Beta sang Stable vì lỗi, giao diện không lặp lại tin nhắn đã gửi.

## 7. Submit, Sheet và email

Submit đi qua api/chat-abcde.js. URL Apps Script được chọn theo thứ tự:

1. ABCDE_APPS_SCRIPT_URL
2. DHM8_APPS_SCRIPT_URL
3. URL fallback trong code

API tạo SHA-256 của riêng practiceData, rồi ký chuỗi timestamp.nonce.payloadHash bằng HMAC-SHA256. chatVersion, email và họ tên được gửi trong payload nhưng hiện không nằm trong phần hash đã ký. Apps Script version 69 chưa xác minh chữ ký này, vì vậy HMAC hiện chỉ là dữ liệu được tạo chứ chưa phải lớp kiểm soát truy cập có hiệu lực.

Apps Script ghi vào tab ABCDE_Data, gồm cột ChatVersion, rồi gửi email HTML cho học viên.

## 8. Biến môi trường

| Biến | Mục đích |
| :--- | :--- |
| ABCDE_RAG_ENABLED | Bật hoặc tắt Beta |
| GEMINI_API_KEY | Gọi Gemini chat; không dùng cho embedding |
| GEMINI_MODEL | Model chat |
| DHM_PASSCODE | Danh sách passcode phân tách bằng dấu phẩy |
| ABCDE_APPS_SCRIPT_URL | Deployment Apps Script riêng cho submit ABCDE |
| DHM8_APPS_SCRIPT_TOKEN | Token dùng để tạo HMAC; Apps Script v69 chưa xác minh |
| RAG_TOP_K | Số chunk chẩn đoán tối đa, mặc định 3 và giới hạn 1-3 |
| RAG_MIN_SCORE | Ngưỡng TF-IDF, mặc định 0.075 |
| RAG_MIN_COVERAGE | Ngưỡng độ phủ corpus, mặc định 0.82 |
| KV_REST_API_URL | Redis REST endpoint cho giới hạn tần suất phân tán |
| KV_REST_API_TOKEN | Token Redis REST, không ghi vào log hoặc response |

Không ghi giá trị secret vào tài liệu, log hoặc response.
Nếu thiếu cặp KV, API dùng giới hạn tần suất trong bộ nhớ của từng function instance; cơ chế này không phải giới hạn phân tán toàn hệ thống.

## 9. Kiểm thử và bằng chứng

- Unit policy: tests/abcde-socratic-policy.test.js
- Unit retrieval: tests/abcde-rag.test.js
- Integration endpoint: tests/abcde-rag-endpoint.test.js
- Sáu hành trình: data/evals/abcde-full-flow-cases.json
- Golden retrieval: data/evals/abcde-rag-golden-cases.json
- Runner: UAT/run_abcde_rag_quality_20260721.js
- Báo cáo local: UAT/abcde_rag_quality_20260721.md
- Báo cáo live: UAT/abcde_rag_hardening_live_20260721.md

Không được claim Live done từ kiểm thử local. Live cần API probe, browser desktop/mobile, Sheet row ChatVersion=beta, email tự động và báo cáo Gmail cuối.
