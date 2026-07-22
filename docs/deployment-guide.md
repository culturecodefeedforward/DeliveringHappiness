# 🚀 Hướng dẫn Triển khai (Deployment Guide)

Tài liệu hướng dẫn quy trình deploy (triển khai) và cấu hình hệ thống trên các môi trường.

## 1. Triển khai Giao diện (Frontend Deployment - Vercel)

Giao diện trang web (HTML/CSS/JS tĩnh) được deploy tự động lên **Vercel** thông qua cơ chế tích hợp CI/CD từ kho lưu trữ GitHub `culturecodefeedforward/DeliveringHappiness`.

### Quy trình Deploy Frontend:
1.  **Nhánh Production (Chính thức):** Mọi thay đổi được commit và đẩy lên nhánh `main` sẽ tự động kích hoạt trigger build của Vercel và cập nhật lên domain chính thức:
    *   *URL trang chủ:* `https://delivering-happiness.vercel.app/`
    *   *Trang khảo sát giá trị:* `https://delivering-happiness.vercel.app/personal-value.html`
    *   *Trang đăng ký DHM8:* `https://delivering-happiness.vercel.app/register.html`
    *   *Trang đăng ký DHM9 Hà Nội:* `https://delivering-happiness.vercel.app/register_dh9_hanoi.html`
    *   *Trang thực hành ABCDE:* `https://delivering-happiness.vercel.app/practice-abcde`
2.  **Nhánh Preview/LMS (Bài học học viên):** Các cập nhật bài giảng cho học viên cũ được đẩy lên nhánh `07042026` và deploy lên môi trường Preview tương ứng.
3.  **Cấu hình dự án:** Tệp cấu hình `vercel.json` ở thư mục gốc chứa các quy tắc chuyển hướng hoặc header bảo mật (nếu có).
4.  **Cảnh báo .vercelignore:** Để tránh Vercel bỏ qua các thư mục con trùng tên (ví dụ: `data/artifacts` bị nhận diện nhầm do dòng `Artifacts/` trong file cấu hình), bắt buộc phải dùng dấu gạch chéo ở đầu để khóa cứng đường dẫn gốc (như `/Artifacts/`, `/UAT/`, `/Implementation Plan/`).

---

## 2. Runbook phát hành ABCDE RAG Beta

Luồng này là thay đổi production rủi ro cao. Không deploy từ working tree đang bẩn và không dùng kết quả local để claim live.

### 2.1. Cổng local trước phát hành

1. Chạy ba bộ test Node riêng:

       node tests/abcde-socratic-policy.test.js
       node tests/abcde-rag.test.js
       node tests/abcde-rag-endpoint.test.js

2. Dựng kho tri thức văn bản đã ẩn danh và chạy quality runner:

       python Scripts/build_abcde_kb.py --source-dir C:/tmp/abcde-nlm-sources-20260721 --preserve-case-studies-from C:/tmp/abcde-kb-backup-20260721/knowledge_base_abcde.before.json
       node UAT/run_abcde_rag_quality_20260721.js

3. Corpus phải có:

   - 61 chunk bài giảng mới đã ẩn danh.
   - 18 case study CASE-01 đến CASE-18 được bảo toàn.
   - Tổng 79 chunk, ít nhất 6 source IDs và 3 NotebookLM.
   - 100% provenance approved, duplicate rate dưới 5%.
   - Không chứa bốn chunk sách cũ có citation trang chưa xác minh.

4. Build phải tạo retrieval_model=local-tfidf-ngram-v1, vector_dimensions=0 và external_corpus_exported=false. Không gọi Gemini Embedding API, không gửi nội dung chunk trong request Gemini chat và không commit raw transcript trong C:/tmp.

5. vercel.json phải có includeFiles cho data/artifacts/knowledge_base_abcde*.json. rag_health phải báo manifestAvailable=true, retrievalModel=local-tfidf-ngram-v1, approvedCount bằng chunkCount, vectorDimensions=0 và SHA-256 khớp artifact manifest.

### 2.2. Deployment Apps Script riêng cho ABCDE

Deployment ABCDE không dùng chung deployment DHM8/DHM9. Target đã xác minh của lane này:

- Script ID: 1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS
- Version nguồn: 69
- Version 69 phải còn có ABCDE_Data, ChatVersion và sendAbcdeEmailReport_.

Tạo deployment mới từ version 69; không clasp push source trong release này:

    npx.cmd --yes @google/clasp deploy --versionNumber 69 --description "ABCDE submission dedicated deployment 20260721"

Lệnh phải chạy trong thư mục clone có .clasp.json trỏ đúng Script ID trên. Nếu Script ID hoặc version khác, dừng; không tận dụng approval cũ.

### 2.3. Biến môi trường Vercel

Production cần các tên biến sau:

- ABCDE_RAG_ENABLED=true
- DHM_PASSCODE có passcode ABCDE cùng các passcode hiện hành
- ABCDE_APPS_SCRIPT_URL trỏ deployment riêng vừa tạo
- RAG_TOP_K=3
- RAG_MIN_SCORE=0.075
- RAG_MIN_COVERAGE=0.82
- GEMINI_API_KEY và GEMINI_MODEL hiện hành
- KV_REST_API_URL và KV_REST_API_TOKEN nếu đã có Redis REST; nếu thiếu, API chỉ dùng giới hạn tần suất trong từng function instance và báo cáo release phải ghi rõ rủi ro này

Release này chỉ truy xuất local và không dùng Upstash Vector. Không ghi giá trị secret vào report hay terminal transcript.

Apps Script version 69 hiện không kiểm tra HMAC do Vercel tạo. Vì vậy không được mô tả `DHM8_APPS_SCRIPT_TOKEN` như một lớp xác thực đang có hiệu lực; việc bổ sung verifier phía Apps Script phải là một release riêng có test hồi quy cho DHM8/DHM9.

### 2.4. Gói deploy sạch

1. Tạo gói tại C:/tmp/dh4hn-abcde-rag-release-clean-20260722 từ runtime production đã audit.
2. Không copy .git, node_modules, file env, raw transcript, plan nội bộ hoặc secret. Chỉ giữ `.vercel/project.json` để khóa đúng project đã xác minh; không giữ cache/output Vercel.
3. Đối chiếu public entrypoints và CTA trước deploy. Các URL bắt buộc:

   - /
   - /assessment.html
   - /register.html
   - /register_direct.html
   - /register-test.html
   - /dh8/
   - /practice-abcde

4. Link gói sạch tới đúng Vercel project đã xác minh, chạy build, rồi mới deploy:

       vercel build
       vercel deploy --prod --yes

5. Production alias chuẩn là https://delivering-happiness.vercel.app.

### 2.5. UAT live

Sau deploy, phải có bằng chứng riêng cho từng bề mặt:

- HTTP probe bảy URL bắt buộc.
- Stable chat không hồi quy.
- Beta giữ câu suy diễn ở A, hoàn thành đúng A-B-C-D-E, dùng A-B-C để truy xuất ở D và chỉ hiện citation approved.
- Browser desktop 1440x900 và mobile 390x844; lưu screenshot, console và network evidence trong UAT/.
- Trang practice-abcde có đúng 18 case study.
- Một submit duy nhất có marker CODEX_UAT_ABCDE_RAG_20260721, email vuhoang2708@gmail.com và chatVersion=beta.
- Xác minh riêng Sheet row, email tự động của Apps Script và Gmail báo cáo cuối.

### 2.6. Quay lui

Ưu tiên tắt Beta bằng ABCDE_RAG_ENABLED=false nếu Stable vẫn bình thường. Nếu cần quay toàn deployment:

    vercel rollback https://delivering-happiness-cox2r4mqb-vuhoang2708s-projects.vercel.app

Không xóa deployment Apps Script hoặc dòng UAT tự động. Giữ marker để đối soát.

Mỗi thao tác commit, push, tạo Apps Script deployment, sửa env, Vercel production deploy, submit Sheet và gửi Gmail cần duyệt tác vụ rủi ro cao ngay trước lệnh cụ thể.

---

## 3. Triển khai Backend (Google Apps Script - clasp)

Backend của hệ thống chạy trên nền tảng Google Apps Script (GAS) Web App. Để quản lý mã nguồn ngoại tuyến chuyên nghiệp, dự án sử dụng công cụ **clasp** (Command Line Apps Script Projects) của Google.

### Bước 1: Cài đặt và Đăng nhập clasp
1.  Cài đặt clasp toàn cục thông qua npm:
    ```bash
    npm install -g @google/clasp
    ```
2.  Đăng nhập bằng tài khoản quản trị dự án `culturecodeproject@gmail.com`:
    ```bash
    clasp login
    ```
    *Lưu ý:* Trình duyệt sẽ mở ra và yêu cầu cấp quyền truy cập Apps Script API. Hãy bật quyền này trong phần cấu hình Google Apps Script User Settings (`https://script.google.com/home/usersettings`).

### Bước 2: Đồng bộ mã nguồn lên Google Cloud
1.  Cấu hình trong tệp `.clasp.json` tại thư mục gốc quản lý ID của script và thư mục chứa code:
    ```json
    {
      "scriptId": "1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU",
      "rootDir": "Scripts"
    }
    ```
    *Lưu ý:* Hãy đảm bảo thuộc tính `rootDir` trỏ chính xác đến thư mục `Scripts/` chứa file code `active_code_gs_final.js` và `appsscript.json`.
3.  **Cấu hình tệp loại trừ `.claspignore` (Bắt buộc):**
    Để tránh xung đột trùng lặp hàm `doPost` (Function Shadowing) do clasp đẩy cả tệp rollback/runner lên cloud, tạo tệp `.claspignore` ở thư mục gốc của dự án với nội dung:
    ```text
    # Ignore files relative to rootDir (Scripts)
    active_code_gs_rollback.js
    dhm8_gate2_uat_runner.js
    ```
4.  Đẩy mã nguồn từ máy local lên Google Apps Script:
    ```bash
    clasp push -f
    ```

### Bước 3: Tạo phiên bản Deploy Web App trên Console
Sau khi clasp push code thành công, thực hiện tạo bản deploy trên Google Apps Script:
1.  Truy cập trang quản trị Google Sheet CRM và mở **Extensions** -> **Apps Script**.
2.  Nhấp chọn **Deploy** -> **New Deployment**.
3.  Chọn loại cấu hình triển khai là **Web App**:
    *   *Execute as:* Chọn **Me** (chạy dưới danh nghĩa tài khoản culturecodeproject@gmail.com).
    *   *Who has access:* Chọn **Anyone** (để cho phép backend Vercel gọi API công khai).
4.  Nhấp **Deploy**, hệ thống sẽ sinh ra một URL Web App mới (ví dụ: `https://script.google.com/macros/s/AKfycb.../exec`).

### Bước 4: Cập nhật biến môi trường trên Vercel Backend
Không tự ý sửa URL trực tiếp trong mã nguồn backend. Mọi URL và token kết nối đều được cấu hình qua **Vercel Environment Variables**:
1.  Truy cập bảng điều khiển Vercel của dự án.
2.  Cấu hình các biến môi trường sau:
    *   `DHM8_APPS_SCRIPT_URL`: URL Web App mới deploy ở Bước 3.
    *   `DHM8_APPS_SCRIPT_TOKEN`: Token dùng để ký mã HMAC (Ví dụ: `shared-token-key-2026`).
    *   `GEMINI_API_KEY`: API Key của Google Gemini dùng để chạy chatbot Socratic.
    *   `GEMINI_MODEL`: Model sử dụng (mặc định: `gemini-3.1-flash-lite`).
3.  Chạy deploy lại dự án để áp dụng các biến môi trường mới:
    ```bash
    vercel --prod --yes
    ```

---

## 4. Cấu hình Script Properties bắt buộc trên Apps Script Console

Để backend hoạt động chính xác và an toàn, cần thiết lập các thuộc tính biến môi trường (Script Properties) trong phần **Project Settings** của Apps Script Editor:

| Tên biến (Property Key) | Ý nghĩa & Cấu hình |
| :--- | :--- |
| `ENVIRONMENT` | `PRODUCTION` hoặc `STAGING` |
| `SPREADSHEET_ID` | ID của Google Sheet CRM chính |
| `SEPAY_WEBHOOK_TOKEN` | Token bí mật dùng để xác thực webhook thanh toán từ SePay |
| `OFFICIAL_ACCOUNT_NUMBER` | Số tài khoản ngân hàng chính thức nhận tiền (`8815369431`) |
| `KILL_SWITCH_EMAIL` | Đặt là `true` để tạm dừng tất cả các hoạt động gửi email |
| `KILL_SWITCH_REGISTRATION` | Đặt là `true` để tạm dừng nhận đăng ký mới |
| `KILL_SWITCH_PV` | Đặt là `true` để đóng cổng khảo sát Giá trị Cốt lõi |
| `KILL_SWITCH_ABCDE` | Đặt là `true` để tạm dừng nhận bài thực hành ABCDE Socratic |
