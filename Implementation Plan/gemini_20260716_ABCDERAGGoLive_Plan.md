# Kế hoạch Go-Live: ABCDE Chatbox RAG Beta

Mục tiêu: Đưa tính năng Chatbox ABCDE Socratic phiên bản "Thử nghiệm có tri thức lớp học" (RAG Beta) từ trạng thái **Local Done** lên **Live Done** trên Production Vercel.

---

## Rà soát tình trạng hiện tại (Status Audit)

| Hạng mục | File | Trạng thái | Ghi chú |
|---|---|---|---|
| Backend API RAG | `api/chat-abcde-rag.js` | ✅ Code xong, **chưa commit** | Untracked |
| Backend API Stable (cập nhật chatVersion) | `api/chat-abcde.js` | ✅ Đã commit lên main | Đã live |
| Frontend UI chọn phiên bản | `chat-abcde.js` | ✅ Đã commit lên main | Đã live |
| Knowledge Base (vector database tĩnh) | `data/artifacts/knowledge_base_abcde.json` | ✅ File đã tạo, **chưa commit** | Untracked, 33.959 dòng |
| Google Apps Script CRM | `Scripts/active_code_gs_final.js` | ⚠️ Code cập nhật xong, **chưa clasp push** | Chưa live trên GAS |
| Environment Variable | Vercel Dashboard | ❌ Chưa cấu hình | `ABCDE_RAG_ENABLED` còn thiếu |
| Kế hoạch RAG | `Implementation Plan/implementation_plan_20260716_abcde_rag_beta.md` | ✅ Xong, **chưa commit** | Untracked |
| Walkthrough RAG | `UAT/walkthrough_20260716_abcde_rag_beta.md` | ✅ Xong, **chưa commit** | Untracked |

> [!IMPORTANT]
> Vấn đề cốt lõi: 3 file quan trọng nhất (`api/chat-abcde-rag.js`, `data/artifacts/knowledge_base_abcde.json`, cập nhật GAS) **chưa được deploy** lên Production. Frontend đã có UI chọn phiên bản nhưng nếu người dùng bấm "Bản thử nghiệm" hiện tại sẽ nhận lỗi vì `api/chat-abcde-rag.js` chưa tồn tại trên Vercel.

---

## Kế hoạch Go-Live (Các bước cần thiết)

### Phase 1: Chuẩn bị & Commit code RAG lên Git

**P1-01 — Code Review nhanh `api/chat-abcde-rag.js`**
- Xác minh không còn hardcode API key hay bất kỳ thông tin nhạy cảm nào.
- Đảm bảo `knowledge_base_abcde.json` được đọc bằng đường dẫn `path.join(process.cwd(), ...)` (đã đúng).

**P1-02 — Kiểm tra `.gitignore` để tránh commit nhầm**
- Xác minh `demo_video.mp4`, `record_demo.js`, `node_modules/`, `*.bak` nằm trong `.gitignore`.
- Xác minh `data/artifacts/knowledge_base_abcde.json` **KHÔNG** bị gitignore (file này phải được commit để Vercel có knowledge base).

**P1-03 — Commit batch RAG Beta lên `main`**
Danh sách file cần stage và commit:
```
api/chat-abcde-rag.js
data/artifacts/knowledge_base_abcde.json
Implementation Plan/implementation_plan_20260716_abcde_rag_beta.md
UAT/walkthrough_20260716_abcde_rag_beta.md
Scripts/ingest_knowledge.py
```
Commit message: `feat(abcde): deploy rag beta endpoint with local vector knowledge base`

**P1-04 — Push lên remote GitHub `origin/main`**

---

### Phase 2: Cấu hình biến môi trường trên Vercel

Cần thiết lập các biến sau trên Vercel Dashboard (hoặc `vercel env add`):

| Biến môi trường | Giá trị | Ghi chú |
|---|---|---|
| `ABCDE_RAG_ENABLED` | `true` | Kích hoạt RAG Beta endpoint |
| `GEMINI_API_KEY` | `<api key>` | Đã có — xác minh lại |
| `GEMINI_MODEL` | `gemini-2.5-flash-lite` | Model dùng cho Socratic chat |
| `DHM_PASSCODE` | `DHM8,DHM9,ABCDE` | Mật mã hợp lệ |
| `UPSTASH_VECTOR_REST_URL` | (tùy chọn) | Nếu không set → tự động dùng Local RAG |
| `UPSTASH_VECTOR_REST_TOKEN` | (tùy chọn) | Như trên |

> [!NOTE]
> `UPSTASH_VECTOR_REST_URL` và `UPSTASH_VECTOR_REST_TOKEN` là **tùy chọn**. Nếu không cấu hình, hệ thống tự động fallback về Local Vector Search (Cosine Similarity tính trực tiếp trên Vercel Serverless từ file `knowledge_base_abcde.json`). Đây là cơ chế dự phòng thông minh, hoàn toàn không phụ thuộc dịch vụ bên ngoài.

---

### Phase 3: Deploy lên Vercel Production

**P3-01 — Chạy `vercel --prod`**
Vercel sẽ build lại và:
- Đưa `api/chat-abcde-rag.js` lên thành endpoint tại URL `https://delivering-happiness.vercel.app/api/chat-abcde-rag`.
- Đưa `data/artifacts/knowledge_base_abcde.json` lên server để `api/chat-abcde-rag.js` đọc được.

---

### Phase 4: Cập nhật Google Apps Script CRM

> [!WARNING]
> Đây là thao tác ảnh hưởng đến Backend đang chạy thật. Cần duyệt riêng.

**P4-01 — Xem diff code `active_code_gs_final.js` trước khi push**
Xác minh thay đổi chỉ bao gồm:
- Thêm ghi nhận cột `ChatVersion` vào Sheet `ABCDE_Data`.
- Thêm hiển thị ChatVersion trong email HTML báo cáo.

**P4-02 — Thực hiện `clasp push -f`**
Đẩy code mới lên Google Apps Script.

**P4-03 — Deploy phiên bản Web App mới trên Google Apps Script Console**
Tạo Deployment mới để URL Web App được cập nhật.

---

### Phase 5: Kiểm thử nghiệm thu (UAT) trên Production

Dựa theo 5 kịch bản đã định nghĩa trong `UAT/walkthrough_20260716_abcde_rag_beta.md`:
1. ✅ UI chọn phiên bản hiển thị sau khi nhập passcode.
2. ✅ Bản ổn định chạy mượt theo luồng cũ.
3. ✅ Bản thử nghiệm RAG tại bước D trả lời sâu hơn dựa trên tri thức.
4. ✅ Submit dữ liệu ghi nhận đúng cột `ChatVersion` vào Sheet và Email.
5. ✅ Fallback hoạt động khi `ABCDE_RAG_ENABLED=false`.

---

## Ranh giới phê duyệt (Approval Boundary)

| Bước | Hành động | Cần approve riêng? |
|---|---|---|
| P1-03 | `git commit` | ✅ Duyệt trước khi thực hiện |
| P1-04 | `git push` | ✅ Duyệt trước khi thực hiện |
| P2 | Set env vars trên Vercel | ✅ Cần cung cấp giá trị API Key |
| P3-01 | `vercel --prod` | ✅ Duyệt trước khi thực hiện |
| P4-01..03 | `clasp push` + Deploy GAS | ✅ Duyệt riêng (High Risk) |

---
*Soạn bởi Gemini — 16/07/2026*
