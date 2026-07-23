# Báo cáo UAT live ABCDE RAG Beta

- Thời gian kiểm thử: 2026-07-23 14:05-16:58 GMT+7
- Người thực hiện: Codex qua Chrome được kết nối và các probe API production
- URL production: `https://delivering-happiness.vercel.app/`
- `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng)
- `RAG` (Retrieval-Augmented Generation - sinh câu trả lời có hỗ trợ truy xuất tri thức)
- `API` (Application Programming Interface - giao diện gọi dịch vụ)
- `CRM` (Customer Relationship Management - hệ thống quản lý dữ liệu khách hàng)
- `DOM` (Document Object Model - cấu trúc phần tử trang)
- `deployment` (bản triển khai), `alias` (địa chỉ đại diện trỏ tới bản triển khai)
- `citation` (trích dẫn nguồn), `fallback` (cơ chế dự phòng), `rollback` (quay lui bản triển khai)
- `prompt injection` (chỉ dẫn độc hại nhằm bẻ hướng bot), `regression` (lỗi tái phát)
- Mức bằng chứng: `VERIFIED` (đã kiểm chứng trực tiếp), `UNVERIFIED` (chưa đủ bằng chứng trực tiếp)

## 1. Kết luận

**PASS - VERIFIED cho ABCDE RAG Beta trên production sau khi sửa định tuyến Apps Script.**

Các bề mặt đã kiểm chứng:

1. `VERIFIED`: deployment production cuối ở trạng thái `Ready`, alias public trỏ đúng deployment.
2. `VERIFIED`: Stable và Beta cùng hoạt động; Beta đi hết A-B-C-D-E.
3. `VERIFIED`: bước A dùng câu hỏi Socratic để tách sự kiện quan sát được khỏi suy diễn.
4. `VERIFIED`: bước C thiếu hành vi giữ nguyên STEP_C; đủ cảm xúc, cường độ và hành vi thì chuyển STEP_D ngay.
5. `VERIFIED`: bước D truy xuất tri thức, hiển thị citation và không bịa citation khi không đủ khớp.
6. `VERIFIED`: prompt injection bị chặn, không lộ secret.
7. `VERIFIED`: corrective submit (lần gửi sửa lỗi) tạo đúng một dòng trong CRM, `ChatVersion=beta`.
8. `VERIFIED`: email tự động ghi rõ `Bản thử nghiệm (Có tri thức lớp học RAG)`.

Khoảng trống không chặn go-live:

- `UNVERIFIED`: mô phỏng lỗi backend bằng cách chặn đúng một request trong browser; Chrome bridge không hỗ trợ request interception (chặn request có chủ đích).
- `VERIFIED` có quan sát chất lượng: citation đầu tiên ở bước D đúng lăng kính Evidence nhưng chưa sát bối cảnh công sở bằng citation thứ hai. Nên cải thiện ranking (xếp hạng độ liên quan) ở vòng sau.

## 2. Production identity

| Thuộc tính | Kết quả | Mức bằng chứng |
| :--- | :--- | :--- |
| Commit mã nguồn | `4418ec134f6b75df58436fd1e4bfbb2f9a46e86e` | VERIFIED trước deploy |
| Deployment cuối | `dpl_GN9i6HjuBiXprEw8mVFC2b1j8tRq` | VERIFIED bằng `vercel inspect` |
| Deployment URL | `https://delivering-happiness-h2po51hrf-vuhoang2708s-projects.vercel.app` | VERIFIED |
| Production alias | `https://delivering-happiness.vercel.app` | VERIFIED |
| Trạng thái | `Ready`, target `production` | VERIFIED |
| Thời điểm tạo | 2026-07-23 16:11:39 GMT+7 | VERIFIED |
| Apps Script | Dedicated deployment version 69: `AKfycbxJseDBZ-3qAUufJS_kLev07kx0ivEj9oc-XZRMhDz7ihXG0QKVrfwH4MHyskuyqyQLbA` | VERIFIED bằng health smoke |
| Rollback | Đặt `ABCDE_RAG_ENABLED=false` hoặc dùng `vercel rollback` về deployment production trước | VERIFIED từ rollout plan |

## 3. Sự cố định tuyến và cách sửa

### Lần gửi đầu

- Deployment ban đầu: `dpl_AkswPeqZwmhiCErJbyfsTSvb8C8d`.
- Marker: `CODEX_UAT_ABCDE_RAG_20260723_4418ec1`.
- POST `/api/chat-abcde` trả HTTP 200 và một email tự động được gửi.
- Email không có dòng `Phiên bản thực hành`; spreadsheet CRM dự kiến lúc đó chưa có sheet `ABCDE_Data`.
- Kết luận: `VERIFIED` Vercel đang dùng fallback URL của Apps Script cũ thay vì deployment version 69.
- Email/dòng dữ liệu của lần đầu được giữ nguyên như audit trail (dấu vết kiểm toán); không xóa dữ liệu production.

### Khắc phục

1. Cập nhật biến môi trường production `ABCDE_APPS_SCRIPT_URL` sang Apps Script version 69.
2. Redeploy (triển khai lại) cùng clean package của commit `4418ec1`.
3. Xác minh deployment cuối `dpl_GN9i6HjuBiXprEw8mVFC2b1j8tRq` ở trạng thái `Ready`.
4. Gửi đúng một corrective submit với marker mới `CODEX_UAT_ABCDE_RAG_20260723_4418ec1_FIX1`.

### Kết quả corrective submit

| Bề mặt | Kết quả | Mức bằng chứng |
| :--- | :--- | :--- |
| API | HTTP 200 sau 6.238 ms; `success=true`; request count = 1 | VERIFIED |
| Spreadsheet | `DH4HN CRM Leads - Landing Page`, sheet `ABCDE_Data`, row 2 | VERIFIED |
| Marker count | Đúng một dòng `CODEX_UAT_ABCDE_RAG_20260723_4418ec1_FIX1` | VERIFIED |
| ChatVersion | `beta` tại cột J | VERIFIED |
| Email tự động | Gmail Message ID `19f8e69795c45647` | VERIFIED |
| Nội dung email | Có `Phiên bản thực hành: Bản thử nghiệm (Có tri thức lớp học RAG)` | VERIFIED |

## 4. Ma trận desktop

| Ca | Kết quả mong đợi | Kết quả thực tế | Mức bằng chứng | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| D1 Route và health | Trang/health HTTP 200; KB 79 chunks, manifest/hash khớp | Model `local-tfidf-ngram-v1`, KB `abcde-kb-20260721-v3`, đủ 79 chunks | VERIFIED | `01_desktop_home_and_health.png`, `network_summary.json` |
| D2 Stable smoke | Stable mặc định; A khách quan sang B; không citation | UI sang `Bước B`; không citation | VERIFIED | `13_desktop_stable_smoke.png`, `dom_assertions.json` |
| D3 Beta A Socratic | A suy diễn ở lại A; A khách quan sang B | API lần lượt `A_INFERENCE_PRESENT`, `READY_STEP_B` | VERIFIED | `03_desktop_beta_a_socratic.png`, `04_desktop_beta_step_b.png` |
| D4 C chưa đủ | Ở STEP_C; hỏi đúng một câu về hành vi | `C_NEEDS_BEHAVIOR` | VERIFIED | `06_desktop_beta_c_incomplete.png`, `network_summary.json` |
| D5 C regression | Chuyển STEP_D sau một response | `READY_STEP_D` | VERIFIED | `07_desktop_beta_step_d.png`, `network_summary.json` |
| D6 RAG ở D | Grounded và hiện citation | Request chung: `no_match`; request có ngữ cảnh: `grounded`, Evidence, 2 citations | VERIFIED có quan sát | `08_desktop_beta_d_grounded.png`, `09_desktop_beta_d_disputation.png` |
| D7 D sang E và form | Chỉ đi tiếp sau tự đánh giá; E hiện form | Đúng; họ tên/email/nút gửi hiện | VERIFIED | `10_desktop_beta_step_e.png`, `11_desktop_beta_submit_ready.png` |
| D8 Prompt injection | Ở A; không leak; không submit | `PROMPT_INJECTION_BLOCKED`, `deterministic_guardrail` | VERIFIED | `12_desktop_beta_prompt_injection.png`, `network_summary.json` |

## 5. Regression bước C

### C chưa đủ hành vi

- UI: `Trạng thái: Bước C - Xác định Hệ quả`.
- API: HTTP 200, `stageComplete=false`, `nextState=STEP_C`, `assessmentCode=C_NEEDS_BEHAVIOR`.
- Reply: `Khi có cảm xúc đó, bạn đã làm hoặc tránh làm điều gì?`
- Không hỏi lấn sang Evidence, Alternatives, Implications hoặc Usefulness.
- Kết luận: `VERIFIED`.

### C đủ cảm xúc, cường độ và hành vi

- API: HTTP 200, `stageComplete=true`, `nextState=STEP_D`, `assessmentCode=READY_STEP_D`.
- UI đổi badge/status sang D ngay sau response.
- Kết luận: `VERIFIED`.

## 6. Mobile

- Viewport yêu cầu 390 x 844; Chrome bridge tạo 390 x 845 do device scaling (tỷ lệ hiển thị thiết bị) lệch một pixel.
- Page: `clientWidth=367`, `scrollWidth=367`.
- Dialog: `clientWidth=367`, `scrollWidth=367`.
- Stable/Beta selector hiển thị; Stable được chọn mặc định.
- Beta đi A sang B, B sang C, C regression sang D.
- Citation và hai nút tự đánh giá hiển thị, không tràn ngang.
- Kết luận: `VERIFIED`.

Evidence: `14_mobile_version_selector.png`, `15_mobile_beta_step_c.png`, `16_mobile_beta_step_d.png`, `17_mobile_beta_d_citations.png`, `17b_mobile_beta_d_modal.png`.

## 7. Console, network và DOM

### Console

- Target page trả 0 warning/error.
- Log Statsig từ `ab.chatgpt.com` thuộc Codex browser bridge, không phát sinh từ website.
- Kết luận: `VERIFIED`.

### Network

- Các probe production cho health, passcode, A, C, D và prompt injection đều HTTP 200.
- D có ngữ cảnh: `ragStatus=grounded`, `ragUsed=true`, `ragLens=Evidence`, `retrievalSource=local`, `citationCount=2`.
- D ngoài miền máy pha cà phê: `ragStatus=no_match`, `ragUsed=false`, `citationCount=0`.
- Full browser HAR (HTTP Archive - nhật ký request/response của trình duyệt): `UNVERIFIED` vì Chrome bridge không cung cấp.

### DOM

- Desktop 1440 x 900 và mobile 390 x 845 đều có `scrollWidth <= clientWidth`.
- Status, active badge, form fields, citation block và decision buttons được đọc trực tiếp từ live DOM.
- Kết luận: `VERIFIED`.

## 8. Evidence paths

Repo root:

`C:\tmp\dh4hn-abcde-rag-hardening-20260721`

Raw evidence:

- `C:\tmp\dh4hn-abcde-rag-hardening-20260721\UAT\evidence\abcde_rag_live_20260723\network_summary.json`
- `C:\tmp\dh4hn-abcde-rag-hardening-20260721\UAT\evidence\abcde_rag_live_20260723\console_errors.json`
- `C:\tmp\dh4hn-abcde-rag-hardening-20260721\UAT\evidence\abcde_rag_live_20260723\dom_assertions.json`
- `C:\tmp\dh4hn-abcde-rag-hardening-20260721\UAT\evidence\abcde_rag_live_20260723\submission_and_rollout_evidence.json`

Screenshots:

`C:\tmp\dh4hn-abcde-rag-hardening-20260721\UAT\evidence\abcde_rag_live_20260723\`

Chrome bridge thêm vùng trắng vào một số PNG do device scaling. Nội dung target vẫn đọc được; kết luận overflow dùng số đo DOM trực tiếp.

## 9. Trạng thái bàn giao

- Live production: `VERIFIED`.
- Browser/API UAT: `VERIFIED`.
- CRM row và `ChatVersion=beta`: `VERIFIED`.
- Apps Script automatic email: `VERIFIED`.
- Fallback bằng request interception: `UNVERIFIED - browser capability`.
- Evidence commit/push: được xác minh riêng bằng Git trong final handoff (bàn giao cuối).
- Gmail rollout report: được gửi và xác minh riêng sau khi evidence đã được push.
