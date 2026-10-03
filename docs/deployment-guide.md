# 🚀 Hướng dẫn Triển khai (Deployment Guide)

Tài liệu hướng dẫn cấu hình backend, Apps Script và các cổng kiểm chứng liên quan. `docs/deployment.md` là `source of truth` (nguồn chuẩn) duy nhất cho phát hành frontend production.

## 1. Triển khai Giao diện (Frontend Deployment - Vercel)

Giao diện gồm HTML/CSS/JS tĩnh và API serverless trên Vercel. Nhánh `main`, trạng thái Vercel `Ready` hoặc một URL deployment riêng lẻ không chứng minh production alias đã chạy đúng source.

### Quy trình Deploy Frontend:
1.  Bắt đầu từ worktree sạch và commit bất biến đã review; không dùng dirty root hiện tại làm nguồn phát hành.
2.  Bảo đảm checkout có **đúng bản tracked trong cùng commit** của `Scripts/build_release_package.js`, `Scripts/verify_vercel_live_gate.js`, `.github/workflows/production-release.yml` và release contract trong `release-specs/`; path tồn tại nhưng untracked/diverged vẫn phải fail-closed.
3.  Thực hiện đúng `docs/deployment.md`: build package → staged deployment bằng `--skip-domain` → UAT toàn bộ route trong release contract → phê duyệt Cấp độ 3 → promote → production UAT.
4.  Kiểm tra trực tiếp mọi CTA target. `interest.html` (`DH_INTEREST`) và `program-interest.html` (`PROGRAM_INTEREST`) là hai hợp đồng khác nhau.
5.  Chỉ claim `Live done` khi production alias và release identity khớp artifact `LIVE_VERIFIED` trong `UAT/releases/<release-id>/production/`.

---

## 2. Triển khai Backend (Google Apps Script - clasp)

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
1.  Đọc `.clasp.json` tại repo root và xác nhận `rootDir` là `Scripts`; không sao chép Script ID vào tài liệu hoặc log.
2.  Đọc `.claspignore`, sau đó chạy `clasp status` để lấy upload inventory thật. Fail-closed nếu rollback, runner, test hoặc file ngoài allowlist xuất hiện.
3.  Đối chiếu diff, tạo backup/rollback mapping và ghi commit SHA ↔ Apps Script version/deployment ID.
4.  `clasp push -f` là external write và ghi đè source cloud; chỉ chạy sau phê duyệt Cấp độ 3 cho exact command và target:
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

### Cổng triển khai và kiểm chứng cho `program-interest.html`
1. Chỉ deploy Apps Script sau khi đối chiếu `.clasp.json`, `.claspignore`, diff đúng allowlist và có phê duyệt Cấp độ 3 cho lệnh cụ thể.
2. Sau khi cập nhật deployment, probe read-only `checkProgramInterestStatus` bằng UUID thử hợp lệ; chỉ tiếp tục khi endpoint trả đúng `not_found` và không rơi vào route `DH_INTEREST`.
3. Chỉ deploy frontend khi probe backend đạt yêu cầu. Sau promote phải kiểm tra trực tiếp `/program-interest` và mọi CTA được thay đổi; không lấy `/interest` hoặc homepage làm bằng chứng thay thế.
4. **Đích lưu dữ liệu:** [CRM Google Sheet — tab Program Interest](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit). Apps Script production hiện được frontend gọi qua deployment `@69` với endpoint `AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec`; `SPREADSHEET_ID` vẫn phải đọc từ `Script Properties`, không ghi token/credential vào tài liệu.
5. **Luồng ghi:** frontend tạo payload `PROGRAM_INTEREST` và `interestUuid`, gửi `POST` `no-cors`; Apps Script validate dữ liệu, mở đúng spreadsheet theo `SPREADSHEET_ID` ở chế độ fail-closed, kiểm tra tab `Program Interest`, khóa thao tác, tìm UUID ở cột B rồi mới append một hàng 25 cột. Sau đó frontend gọi JSONP `checkProgramInterestStatus` với cùng UUID để xác nhận `recorded`.
6. **Chống ghi trùng:** POST đầu tiên trả `duplicate:false`; POST lại nguyên payload/UUID trả `duplicate:true` và không thêm hàng thứ hai trong `Program Interest`. Apps Script có thể ghi log vận hành vào `DHM8_System_Logs` cho mỗi POST; log này không được tính là dòng dữ liệu Program Interest.
7. Ghi thử vào tab `Program Interest` là thao tác Google Sheet thật, cần phê duyệt Cấp độ 3 riêng. Không dùng `parentId` trong `.clasp.json` để suy ra `SPREADSHEET_ID` runtime: `parentId` chỉ là metadata container của Apps Script. Trước POST phải xác minh runtime target bằng Script Properties/authorized read-back hoặc UAT có kiểm soát; sau POST phải đọc lại theo UUID, đối chiếu đúng một dòng và không xóa dòng UAT. Không phát sinh email, thanh toán hoặc giữ chỗ từ handler `PROGRAM_INTEREST`.

### Bước 4: Cập nhật biến môi trường trên Vercel Backend
Không tự ý sửa URL trực tiếp trong mã nguồn backend. Mọi URL và token kết nối đều được cấu hình qua **Vercel Environment Variables**:
1.  Truy cập bảng điều khiển Vercel của dự án.
2.  Cấu hình các key mà source hiện đọc; giá trị thật chỉ nằm trong Vercel Environment Variables/secret store và không được ghi vào tài liệu:
    *   ABCDE Stable: `DHM_PASSCODE`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `DHM8_APPS_SCRIPT_URL`, `DHM8_APPS_SCRIPT_TOKEN`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`.
    *   ABCDE Beta: các key Stable cộng `ABCDE_RAG_ENABLED`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`.
    *   SePay proxy: `DHM8_APPS_SCRIPT_URL`, `SEPAY_WEBHOOK_TOKEN`, `DHM8_SEPAY_WEBHOOK_TOKEN`, `DHM8_SEPAY_PROXY_TOKEN`.
3.  Chạy deploy lại dự án để áp dụng các biến môi trường mới (tuân thủ Rule 4):
    ```bash
    vercel --prod --skip-domain
    ```

---

## 3. Cấu hình Script Properties bắt buộc trên Apps Script Console

Để backend hoạt động chính xác và an toàn, cần thiết lập các thuộc tính biến môi trường (Script Properties) trong phần **Project Settings** của Apps Script Editor:

| Tên biến (Property Key) | Ý nghĩa & Cấu hình |
| :--- | :--- |
| `ENVIRONMENT` | `PRODUCTION` hoặc `STAGING` |
| `SPREADSHEET_ID` | ID của Google Sheet CRM chính |
| `SEPAY_WEBHOOK_TOKEN` | Token bí mật dùng để xác thực webhook thanh toán từ SePay |
| `OFFICIAL_ACCOUNT_NUMBER` | Số tài khoản vận hành; lấy từ Script Properties/runtime, không ghi giá trị vào docs |
| `KILL_SWITCH_EMAIL` | Đặt là `true` để tạm dừng tất cả các hoạt động gửi email |
| `KILL_SWITCH_REGISTRATION` | Đặt là `true` để tạm dừng nhận đăng ký mới |
| `KILL_SWITCH_PAYMENT` | Đặt là `true` để chặn xử lý thanh toán tự động theo nhánh SePay |
| `KILL_SWITCH_PV` | Đặt là `true` để đóng cổng khảo sát Giá trị Cốt lõi |
| `KILL_SWITCH_ABCDE` | Đặt là `true` để tạm dừng nhận bài thực hành ABCDE Socratic |

## 4. Khoảng trống cần xử lý trước phát hành

*   `.claspignore` trong working tree không khớp ví dụ từng được ghi trong tài liệu cũ; upload inventory phải coi là `UNVERIFIED` cho tới khi `clasp status` được review.
*   Snapshot 08/08/2026: local `main` chậm `origin/main` ba commit; release tool local bị lệch bản committed và release contract chưa có trong checkout. Chỉ dùng clean worktree tại commit release đã review.
*   Source còn fallback cấu hình nhạy cảm và Apps Script chưa xác minh HMAC của submit ABCDE. Không dùng tài liệu này để claim security hardening đã hoàn tất.
*   Lượt cập nhật tài liệu không chạy network, browser, Apps Script, Sheet, email hoặc payment probe; mọi trạng thái live vẫn `UNVERIFIED`.

## 5. Quy Trình Kiểm Thử Pre-flight & Xác Minh CDN Cho Phân Hệ LMS
Trước khi commit, push và deploy phân hệ LMS (`/lms/`), bắt buộc thực hiện kiểm tra pre-flight 3 lớp:
1.  **Cú pháp JavaScript Client:** Chạy lệnh `node -c lms/app.js` để đảm bảo 100% không có lỗi cú pháp (SyntaxError).
2.  **Toàn vẹn Dữ liệu JSON:** Chạy script kiểm tra nạp dữ liệu UTF-8 trên các file JSON cốt lõi:
    ```powershell
    python -c "import json; json.load(open('lms/curriculum_data.json', encoding='utf-8')); print('curriculum_data: PASS')"
    python -c "import json; json.load(open('lms/authorized_roster.json', encoding='utf-8')); print('authorized_roster: PASS')"
    ```
3.  **Xác minh Độ trễ CDN Cache sau khi Deploy:** Do mạng phân phối nội dung (CDN) của Vercel có thể có độ trễ bộ đệm (cache delay 30-45 giây), kiểm tra live production phải tải trực tiếp tệp từ URL live kèm header không lưu cache (`Cache-Control: no-cache`) và kiểm tra sự xuất hiện của các trường dữ liệu hoặc ID mới (ví dụ: `scenario-1-1` đến `scenario-1-3` cho Chặng 1, `scenario-2-1` đến `scenario-2-5` cho Chặng 2, hoặc `#btn-collapse-sidebar-desktop`). Ví dụ lệnh kiểm chứng HTTP no-cache:
    ```powershell
    $res = Invoke-WebRequest -Uri "https://delivering-happiness.vercel.app/lms/curriculum_data.json" -Headers @{"Cache-Control"="no-cache"}
    ($res.Content | ConvertFrom-Json).stages[1].modules[0].lessons[0].practicalScenarios.id
    ```
    Chỉ kết luận `Live done` khi toàn bộ 8 case study và các thành phần UI mới nhất đã phản ánh đầy đủ trên production.
