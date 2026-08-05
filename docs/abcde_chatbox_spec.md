# 🧠 ĐẶC TẢ KỸ THUẬT CHATBOX ABCDE SOCRATIC (ABCDE SOCRATIC CHATBOX SPECIFICATION)

Tài liệu này mô tả chi tiết giải pháp kỹ thuật, kiến trúc hệ thống, quy tắc điều khiển trạng thái nhận thức và cơ chế bảo mật của Chatbox thực hành Lạc quan ABCDE theo phương pháp Socratic trong chương trình Delivering Happiness.

---

## 🛠️ 1. Kiến trúc Hệ thống & Luồng Dữ liệu (System Architecture)

Hệ thống được thiết kế theo mô hình **AI-driven State Control** (AI điều khiển trạng thái) kết hợp xác thực bảo mật nhiều lớp từ Frontend đến CRM Google Sheets qua API Vercel Serverless.

```mermaid
sequenceDiagram
    participant FE as Frontend (chat-abcde.js)
    participant API as Vercel API (Stable / RAG Beta)
    participant VDB as Upstash Vector (REST/Local)
    participant GEMINI as Gemini API (AI Studio)
    participant GAS as Apps Script Web App
    participant DB as Sheets (ABCDE_Data)

    FE->>FE: Xác thực passcode; hiển thị RAG Beta là luồng chính
    FE->>API: Gửi tin nhắn + passcode + state qua RAG endpoint
    Note over API: Kiểm tra Rate Limit (Redis)<br/>Xác thực passcode bằng SHA-256
    
    alt RAG Beta tại bước D
        API->>VDB: Truy vấn vector để tìm tri thức liên quan nhất
        VDB-->>API: Trả về ngữ cảnh tri thức (Seligman / slide DH8 / transcript)
        API->>GEMINI: Gửi Prompt + History + System Instruction + Ngữ cảnh Tri thức
    else Stable chỉ sau khi người dùng xác nhận fallback
        API->>GEMINI: Gửi Prompt + History + System Instruction cứng
    end
    
    GEMINI-->>API: Trả về câu trả lời + Tag [NEXT_STATE]
    Note over API: Bóc tách tag NEXT_STATE; chatVersion được gửi ở payload submit
    API-->>FE: Trả về cleanReply + nextState
    Note over FE: Lưu dữ liệu bước cũ cục bộ
    Note over FE: Khi hoàn thành bước E (SUBMIT)
    FE->>API: Request SUBMIT (A, B, C, D, E)
    API->>GAS: POST JSON (Kèm chữ ký Signature, Timestamp, Nonce)
    Note over GAS: Xác thực chữ ký HMAC-SHA256<br/>Chống replay attack (Timestamp & Nonce)
    GAS->>DB: Ghi dữ liệu vào Sheets
    GAS->>GAS: Gửi email HTML tổng hợp cho học viên
    GAS-->>API: Trả về success: true
    API-->>FE: Hiển thị thông báo thành công
```

### Các thành phần chính:
1.  **Frontend (`chat-abcde.js` & `chat-abcde.css`)**: 
    - Nhúng trực tiếp vào Landing Page bằng mã HTML tĩnh. Giao diện thiết kế theo ngôn ngữ hiện đại (Glassmorphism), đáp ứng tốt trên cả máy tính (Desktop) và điện thoại (Mobile).
    - Quản lý máy trạng thái cục bộ và lưu trữ tạm thời các câu trả lời của học viên qua từng bước.
2.  **Vercel Serverless Function API (`api/chat-abcde.js`)**:
    - Làm nhiệm vụ API Gateway trung gian kết nối sang Gemini API.
    - Tích hợp bộ lọc Rate Limiting (chặn theo IP và Email học viên, hạn chế 20 requests/phút).
    - Đóng vai trò ký xác thực bảo mật và bảo vệ API key tuyệt đối ở môi trường máy chủ.
3.  **Google Apps Script Web App (`active_code_gs_final.js`)**:
    - Nhận dữ liệu thực hành cuối cùng đã qua xác thực từ Vercel API.
    - Lưu trữ trực tiếp dữ liệu vào bảng tính Google Sheets CRM `ABCDE_Practice` và tự động gửi email báo cáo HTML tổng hợp cho học viên.

---

## 🧠 2. Quy tắc Nhận thức & Logic dẫn dắt Socratic (Cognitive Logic & Socratic Guidance)

### A. Bộ lọc Camera Khách quan ở Bước A (Objectivity Filter - Eliminating Victim Mentality)
*   **Vấn đề nhận thức**: Học viên thường có xu hướng trộn lẫn sự phán xét chủ quan, đổ lỗi hoặc mang **tâm lý nạn nhân** (`victim mentality`) vào Nghịch cảnh (A). Sự bóp méo này khiến họ cảm thấy bế tắc và không thể phản biện hiệu quả ở bước D.
*   **Giải pháp xử lý**:
    - AI ở Backend đóng vai trò bộ lọc camera khách quan 100% (chỉ ghi nhận sự thật vật lý).
    - Nếu phát hiện học viên trộn phán xét/suy diễn vào A, AI sẽ chỉ ra một cách thấu cảm và **chủ động gợi ý họ tạm "để dành" suy nghĩ tiêu cực đó cho bước B (Belief)**.
    - AI trả về tag ẩn `[NEXT_STATE: STEP_A]` để giữ học viên lại bước này.
    - Chỉ khi học viên mô tả được A một cách khách quan, trung tính, AI mới trả về `[NEXT_STATE: STEP_B]` để Frontend cho phép chuyển bước.

### B. Tinh lọc Socratic & Kích hoạt Tự nhận diện ở Bước B (Socratic Extraction & Attribution Style Analysis)
*   **Rào cản nhận thức**: Học viên rất khó tự nhận diện và gọi tên chính xác **Niềm tin tiêu cực tự động** (`Automatic Negative Thoughts` - ANT).
*   **Giải pháp xử lý (Chiến lược gợi mở 3 hướng của AI)**:
    - **Sử dụng chất liệu "để dành" từ bước A (Quan trọng)**: AI chủ động quét lại lịch sử hội thoại, trích xuất chính xác những suy diễn, đổ lỗi cảm tính mà học viên đã lỡ viết ra ở bước A (nhưng bị AI lọc và yêu cầu "để dành") để làm chất liệu xuất phát điểm cho bước B. Việc này giúp tối ưu hóa ngữ cảnh và chứng minh mối quan hệ giữa A và B trực quan cho học viên.
    - AI kiên trì đối thoại ít nhất 1-2 lượt bằng cách xoay vòng qua 3 hướng tiếp cận Socratic để bóc tách niềm tin cốt lõi:
        1. **Truy vấn Suy nghĩ tức thời (Immediate Thought)**.
        2. **Khai thác Phong cách Quy kết (Attribution Style)**.
        3. **Bóc tách Sự phóng đại tiêu cực (Catastrophizing)**.
*   **Chuyển bước**: AI sẽ giữ tag `[NEXT_STATE: STEP_B]` để gạn lọc. Chỉ khi học viên gọi tên rõ ràng được niềm tin cốt lõi, AI mới tóm tắt xác nhận và trả về tag `[NEXT_STATE: STEP_C]` để chuyển trạng thái.

### C. Gắn kết Hệ quả Nhận thức ở Bước C (Consequence - Connecting B & C)
*   **Vấn đề nhận thức**: Học viên thường lầm tưởng cảm xúc đau khổ (C) của họ sinh ra trực tiếp bởi Nghịch cảnh khách quan (A).
*   **Giải pháp xử lý**: AI làm rõ mối quan hệ nhân quả: chính Niềm tin B tạo ra Hệ quả C chứ không phải nghịch cảnh A. AI yêu cầu học viên chỉ rõ cảm xúc tiêu cực và hành vi phản ứng tự động xuất hiện. Trả về tag `[NEXT_STATE: STEP_D]` khi hoàn tất.

### D. Vòng lặp Tự đánh giá Nhận thức ở Bước D (Cognitive Validation Loop)
*   **Vấn đề nhận thức**: Phản biện tư duy (`Disputation` - D) là bước khó nhất.
*   **Giải pháp xử lý**:
    - Cuộc đối thoại phản biện ở bước D diễn ra theo cụm 2 lượt.
    - Sau mỗi lượt chẵn, Frontend hiển thị 2 nút phản hồi nhanh:
        *   `Đã hiệu quả, đi tiếp` 🟢: Frontend gán `currentState = "STEP_E"`.
        *   `Tôi muốn phản biện thêm` 🟡: Frontend giữ nguyên `currentState = "STEP_D"`, AI tiếp tục hỏi sâu về các khía cạnh (Utility, Implications).

### E. Năng lượng mới & Cam kết Hành động ở Bước E (Energization)
*   **Mục tiêu**: Chuyển dịch năng lượng nhận thức thành hành động thực tế.
*   **Giải pháp xử lý**:
    - AI yêu cầu học viên gọi tên cảm xúc mới và cam kết **1 hành động cụ thể, nhỏ nhất** có thể làm ngay trong ngày.
    - Khi nhận câu trả lời cho bước E, AI trả về `[NEXT_STATE: SUBMIT]` để kích hoạt form nhập email nhận báo cáo ở Frontend.

---

## 🔒 3. Cơ chế Bảo mật, Phân bản & Xác thực Dữ liệu (Security & Multi-Version Flow)

Để bảo vệ hệ thống Google Sheets CRM khỏi spam và đảm bảo tính bền vững của dịch vụ, luồng dữ liệu được thiết kế:

1.  **Kiến trúc Beta-first với Stable fallback**:
    - **RAG Beta là luồng chính**: Sau khi passcode hợp lệ, Frontend hiển thị một thẻ RAG Beta và nút `Bắt đầu thực hành`; người học không phải chọn giữa hai phiên bản. Tin nhắn chat đi qua `api/chat-abcde-rag.js`. Tại bước D, hệ thống truy vấn cơ sở dữ liệu véc-tơ để tìm tri thức chuyên sâu từ Martin Seligman và slide DH8.
    - **Bản ổn định chỉ là fallback**: Endpoint `api/chat-abcde.js` không được trình bày như lựa chọn ngang hàng. Khi Beta trả lỗi 502/503 hoặc lỗi mạng, Frontend mới hiển thị nút chuyển sang Stable.
    - **Bảo toàn tiến trình**: Khi người học xác nhận chuyển sang Stable, Frontend giữ lịch sử, đổi `chatVersion=stable`, gửi lại tin nhắn cuối và tiếp tục bài đang làm.
    - **Phạm vi giao diện**: Landing page không tự mở modal; passcode vẫn bắt buộc; nút bắt đầu giúp người học chủ động xác nhận trước khi vào bước A.
2.  **Cơ chế RAG lai (Hybrid RAG & Local Fallback)**:
    - **Upstash Vector DB**: Được gọi qua REST API nếu có cấu hình biến môi trường `UPSTASH_VECTOR_REST_URL`.
    - **Local Vector Search (Embedding Cosine Similarity)**: Nếu chưa cấu hình Upstash, backend tự động đọc file véc-tơ tri thức nạp sẵn `data/artifacts/knowledge_base_abcde.json`, gọi Gemini Embedding API (`gemini-embedding-001`) để sinh véc-tơ tin nhắn học viên và tính toán Cosine Similarity trực tiếp trên serverless function nhằm tối ưu hóa chi phí và đảm bảo hoạt động 100% độc lập.
3.  **Xác thực mật mã lớp học (Passcode Authentication)**:
    - Học viên phải nhập mật mã lớp học được cấu hình cho chương trình. Frontend gửi yêu cầu xác thực qua Stable endpoint trước khi hiển thị màn hình RAG Beta; thay đổi Beta-first không bỏ qua cổng này.
4.  **Ký chữ ký điện tử HMAC-SHA256 & Theo dõi phiên bản (chatVersion)**:
    - Khi Vercel API gửi kết quả submit sang Google Apps Script, nó đính kèm trường `chatVersion` (stable/beta) và ký chữ ký HMAC-SHA256 trên toàn bộ JSON payload (bao gồm cả `chatVersion` và `timestamp`/`nonce`).
    - Apps Script ghi nhận thuộc tính `chatVersion` vào cột thứ 10 của bảng tính `ABCDE_Data` và hiển thị phiên bản này trong email báo cáo HTML gửi về cho học viên.

### 3.5. Hai entry point thực hành trên landing page

Landing page có hai cách tiếp cận ABCDE, nhưng chỉ một luồng là trải nghiệm AI chính:

- **Trợ lý AI ABCDE — RAG Beta**: nút `btn-abcde-chat` mở chatbox modal, yêu cầu passcode `ABCDE`, dẫn dắt A–B–C–D–E bằng AI và gửi lượt chat bình thường qua `/api/chat-abcde-rag`. Đây là luồng Beta-first.
- **Bài tập ABCDE — Tự làm & đối chiếu**: liên kết `/practice-abcde` mở worksheet (trang bài tập), cho phép chọn tình huống, tự điền B–E và đối chiếu với gợi ý từ thư viện khóa học. Luồng này không phải Stable fallback và hiện không gọi endpoint chat.

Không dùng các nhãn `Stable`, `Bản ổn định` hoặc `Phiếu tự luyện tĩnh` để gọi worksheet; Stable chỉ xuất hiện trong chatbox khi RAG Beta gặp lỗi.


---

## 📊 4. Tài nguyên & Links liên quan

*   **Đường dẫn mã nguồn**:
    - Frontend JS: [chat-abcde.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/chat-abcde.js)
    - Backend API: [api/chat-abcde.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/api/chat-abcde.js)
    - Google Apps Script: [active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js)
*   **Google Sheet Thực hành**: [Sheet ABCDE_Practice](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UghzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit#gid=ABCDE)

---
*Cập nhật bởi Antigravity v3.5 (Audit Mode) - 15/07/2026*
