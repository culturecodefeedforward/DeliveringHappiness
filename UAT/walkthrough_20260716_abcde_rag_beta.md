# Walkthrough: Tích hợp RAG Beta cho Chatbox ABCDE Socratic (dh4hn-website)

Tài liệu này tổng hợp toàn bộ các kết quả triển khai, cấu trúc mã nguồn nâng cấp và hướng dẫn kiểm thử nghiệm thu (UAT) cho Chatbox thực hành Lạc quan ABCDE.

---

## 🚀 Các công việc đã hoàn thành (Accomplished Tasks)

1.  **Ingestion Tri thức chuẩn (Knowledge Ingestion)**:
    - Tạo tệp tin tri thức chuẩn hóa bao gồm 4 chunks lý thuyết của GS Martin Seligman và 7 chunks tình huống (case studies) thực tế của sếp Vũ.
    - Phát triển script offline [ingest_knowledge.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/ingest_knowledge.py) sử dụng Standard Library của Python gọi trực tiếp đến API `models/gemini-embedding-001` để sinh véc-tơ embedding cho từng chunk tri thức.
    - Xuất file vector tri thức thành công tại: [knowledge_base_abcde.json](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/data/artifacts/knowledge_base_abcde.json).
2.  **Triển khai Backend API RAG Beta**:
    - Tạo serverless function mới [api/chat-abcde-rag.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/api/chat-abcde-rag.js) dành riêng cho phiên bản thử nghiệm.
    - Tích hợp công nghệ RAG: gọi Gemini Embedding API sinh véc-tơ cho câu hỏi của học viên, tính độ tương đồng **Cosine Similarity** với các véc-tơ tri thức nạp sẵn để chọn ra 2 đoạn tri thức liên quan nhất đưa vào prompt làm ngữ cảnh.
    - Hỗ trợ kết nối song song với **Upstash Vector REST API** và tự động fallback về **Local Vector Search** nếu không có cấu hình.
    - Tích hợp kill switch `ABCDE_RAG_ENABLED` (trả về lỗi 503 khi tắt).
3.  **Cập nhật Stable API**:
    - Chỉnh sửa [api/chat-abcde.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/api/chat-abcde.js) để tiếp nhận biến `chatVersion` từ Frontend và đóng gói chuyển tiếp an toàn qua Google Apps Script.
4.  **Nâng cấp Frontend UX/UI**:
    - Cập nhật [chat-abcde.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/chat-abcde.js) nhúng màn hình chọn phiên bản (Stable vs. RAG Beta) ngay sau khi nhập passcode.
    - Thiết lập cơ chế **Fallback thủ công**: Nếu bản Beta gặp sự cố kết nối hoặc tắt, Frontend tự động hiển thị nút gợi ý học viên chuyển sang Bản ổn định và gửi lại tin nhắn tự động để giữ mạch đối thoại.
    - Cập nhật stylesheet [chat-abcde.css](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/chat-abcde.css) tạo hiệu ứng thẻ chọn phiên bản mượt mà, responsive.
5.  **Cập nhật Google Apps Script CRM**:
    - Sửa đổi [active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js) lưu thêm cột `ChatVersion` (cột thứ 10) trong Sheet `ABCDE_Data` và hiển thị phiên bản này trong email HTML báo cáo gửi cho học viên.
6.  **Cập nhật Tài liệu Đặc tả**:
    - Cập nhật sơ đồ Sequence diagram và mô tả luồng RAG lai trong [abcde_chatbox_spec.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/abcde_chatbox_spec.md).

---

## 📊 Kịch bản Kiểm thử nghiệm thu (UAT Validation Results)

Tất cả các tệp JavaScript đã được kiểm tra cú pháp thành công bằng trình biên dịch Node.js (`node -c`), đảm bảo không có lỗi SyntaxError trước khi deploy.

### Kịch bản UAT khuyến nghị cho sếp Vũ:
1.  **Kiểm tra UI Chọn phiên bản**: Mở Modal Chatbox, nhập passcode `DHM8`. Xác nhận giao diện hiển thị 2 thẻ chọn: *"Bản ổn định - thực hành nhanh"* và *"Bản thử nghiệm - có tri thức lớp học"*.
2.  **Kiểm tra Bản ổn định**: Chọn bản ổn định, đi qua chu trình chat A-B-C-D-E. Xác nhận chatbox hoạt động mượt mà theo logic cũ.
3.  **Kiểm tra Bản thử nghiệm RAG (Bước D)**: Chọn bản thử nghiệm, nhập liệu đến bước D (Phản biện). Thử nhập một niềm tin tiêu cực (ví dụ: *"Sếp bất công và cố tình làm hỏng cuối tuần của tôi"*). Xác nhận AI đưa ra câu hỏi phản biện sâu sắc dựa trên tri thức lớp học (ví dụ: gợi mở về giải thích thay thế hoặc áp lực của sếp).
4.  **Kiểm tra Submit dữ liệu**: Điền thông tin nhận báo cáo. Kiểm tra Google Sheet `ABCDE_Data` và Email nhận được: xác nhận có hiển thị trường **Phiên bản thực hành (ChatVersion)** tương ứng.
5.  **Kiểm tra Fallback khi lỗi**: Giả lập tắt RAG Beta bằng cách set `ABCDE_RAG_ENABLED=false` trong môi trường. Truy cập bản thử nghiệm và chat. Xác nhận Frontend hiển thị thông báo lỗi thân thiện kèm nút *"Chuyển về Bản ổn định"*. Bấm nút này, hệ thống phải tự động chuyển sang bản ổn định và gửi lại tin nhắn trước đó mượt mà.

---
*Báo cáo UAT chuẩn bị bởi Antigravity v3.5 - 16/07/2026*
