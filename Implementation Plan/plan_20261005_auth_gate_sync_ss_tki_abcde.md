# 📋 Kế Hoạch Triển Khai: Đồng Bộ Cơ Chế Xác Thực Kép (Seamless LMS Session & Cổng Roster-First 0 Giây) Cho Bộ Công Cụ SS, TKI & Thực Hành Lạc Quan ABCDE

> **Mã kế hoạch:** `PLAN-20261005-AUTH-GATE-SYNC-SS-TKI-ABCDE`  
> **Ngày lập:** 05/10/2026  
> **Người lập:** Antigravity AI Pair Programmer  
> **Dự án áp dụng:**
> 1. **SS (Social Styles):** `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-tinh-cach` (`khao-sat-tinh-cach.vercel.app`)
> 2. **TKI (Thomas-Kilmann):** `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki` (`khao-sat-xung-dot-tki.vercel.app`)
> 3. **ABCDE (Bài Tập Thực Hành Lạc Quan):** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\practice-abcde.html` (`delivering-happiness.vercel.app/practice-abcde.html`)
> 4. **LMS Navigation Links:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js`
>
> **Tài liệu tham chiếu chuẩn (Source of Truth):**
> - Mô hình chuẩn đã vận hành thành công: `dh4hn-website/personal-value.html` và `dh4hn-website/personal-value.js` (Commit `994c1c5`).
> - CSDL danh bạ học viên chuẩn: `dh4hn-website/lms/authorized_roster.json`.

---

## I. BỐI CẢNH & YÊU CẦU NGHIỆP VỤ

Sau khi triển khai thành công cơ chế xác thực kép cho bài khảo sát La Bàn Giá Trị (`personal-value.html`), Sếp Vũ yêu cầu mở rộng và áp dụng chuẩn xác cơ chế tương tự cho:
1. **SS (Social Styles - Khảo sát 4 Phong cách Xã hội):** Hiện đang bắt buộc nhập Họ tên, SĐT, Email và luôn gửi link qua email (kể cả với học viên chính thức).
2. **TKI (Thomas-Kilmann - Khảo sát Ứng xử Xung đột):** Hiện cũng đang áp dụng cơ chế form 3 trường và gửi link qua email.
3. **Thực hành Lạc quan ABCDE (`practice-abcde.html`):** Hiện chưa có cổng xác thực (khách vãng lai vào thẳng mà không thu thập danh tính), cần thiết lập cổng để nhận diện học viên hoặc thu thập lead dùng thử trước khi thực hành.
4. **LMS Navigation Link Auto-Enrichment:** Nâng cấp hàm cập nhật link trong `lms/app.js` để tự động đính kèm `?email=...&source=lms` cho tất cả các nút trỏ sang `personal-value.html`, `practice-abcde.html`, SS và TKI.

---

## II. THIẾT KẾ KIẾN TRÚC ĐỒNG BỘ 3 TẦNG & MODAL 2 GIAI ĐOẠN

### 1. Cơ Chế Nhận Diện Phiên 3 Tầng (3-Tier Authentication Flow)

Mỗi khi người dùng truy cập vào bất kỳ bài test nào (SS, TKI, ABCDE):
- **Tầng 1 (URL Parameters):** Kiểm tra `?email=...` và `source=lms`. Nếu có tham số từ LMS:
  * Tự động tra cứu email trong danh bạ `authorized_roster.json`.
  * Khởi tạo phiên `status: "verified"`, lưu vào `localStorage.setItem("dhm_user_auth", ...)` (và `dhm_lms_auth_user` nếu trên cùng domain).
  * Mở khóa bài làm ngay lập tức, **Modal ẩn 100% (0 giây chờ)**.
- **Tầng 2 (LMS Session Inheritance):** Nếu trên cùng domain (hoặc đã lưu phiên LMS trước đó), kiểm tra `localStorage.getItem("dhm_lms_auth_user")`.
  * Trích xuất thông tin học viên -> lưu sang `dhm_user_auth`.
  * Mở khóa ngay lập tức, **Modal ẩn 100% (0 giây chờ)**.
- **Tầng 3 (Local Test Session):** Kiểm tra `localStorage.getItem("dhm_user_auth")`.
  * Nếu còn hạn (< 30 ngày) và `status === "verified"` -> Mở khóa làm bài ngay lập tức.
- **Trường hợp chưa có phiên hợp lệ:** Hiển thị Modal Cổng Định Danh với **Giai đoạn 1 (Roster-First)**.

---

### 2. Thiết Kế Modal 2 Giai Đoạn (2-Stage Auth Gate Modal)

- **Giai đoạn 1: Màn hình Roster-First (Tối giản 1 ô nhập):**
  * Tiêu đề: `Xác Thực Học Viên`.
  * Nhãn: `Email hoặc Số điện thoại *`.
  * Placeholder: `Nhập Email hoặc SĐT đã đăng ký với BTC...`.
  * Nút bấm: `[🚀 Vào Làm Bài Khảo Sát]` (hoặc `[🚀 Bắt Đầu Thực Hành]`).
  * Hành vi:
    * Tra cứu trực tiếp trong `authorized_roster.json` (hỗ trợ cả email chuẩn hóa chữ thường và số điện thoại chuẩn hóa 10 chữ số đầu 0/84).
    * Hỗ trợ đọc cả `dhm_roster_overrides` trong localStorage.
    * **Tìm thấy:** Thông báo *"Chào mừng [Họ tên]! Đang mở khóa bài làm..."* -> Lưu `dhm_user_auth` -> Vào bài ngay (0 giây chờ, không gửi mail, không phiền toái).
    * **Không tìm thấy:** Báo *"Email/SĐT chưa nằm trong danh sách học viên chính thức"* và chuyển sang Giai đoạn 2.
  * Có liên kết nhanh bên dưới: *"Chưa đăng ký khóa học chính thức? Nhận quyền trải nghiệm qua Email →"*.

- **Giai đoạn 2: Fallback Trải Nghiệm Dùng Thử (Trial Request Form):**
  * Hiển thị khi khách vãng lai không có tên trong danh bạ học viên.
  * Nhập: Họ và tên, Số điện thoại (10 số), Địa chỉ Email.
  * Checkbox: Đồng thuận bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.
  * Nút bấm: `[Nhận Liên Kết Kích Hoạt Qua Email]`.
  * Gọi Webhook Google Apps Script (`action: "register_or_request_link"`).
  * Chuyển sang màn hình chờ có đồng hồ đếm ngược 60 giây (`agWaitingSection`).
  * Khi người dùng nhấp liên kết trong thư (`?token=...&action=verify`), hệ thống gọi `verify_token` và mở khóa bài làm.

---

## III. DANH SÁCH TỆP TIN TÁC ĐỘNG (ALLOWLIST) & PHƯƠNG ÁN SAO LƯU (.BAK)

| Nhóm / Dự án | Tệp tin tác động | Đường dẫn tuyệt đối | Bản sao lưu an toàn (.bak) |
|---|---|---|---|
| **DHM Main (`dh4hn-website`)** | `practice-abcde.html` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\practice-abcde.html` | `practice-abcde.html.bak_20261005_auth_gate` |
| | `practice-abcde.js` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\practice-abcde.js` | `practice-abcde.js.bak_20261005_auth_gate` |
| | `practice-abcde.css` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\practice-abcde.css` | `practice-abcde.css.bak_20261005_auth_gate` |
| | `lms/app.js` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js` | `lms/app.js.bak_20261005_auth_links` |
| **SS (`khao-sat-tinh-cach`)** | `src/utils/auth.ts` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-tinh-cach\src\utils\auth.ts` | `src/utils/auth.ts.bak_20261005_roster_auth` |
| | `src/components/AuthGateModal.tsx` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-tinh-cach\src\components\AuthGateModal.tsx` | `src/components/AuthGateModal.tsx.bak_20261005_roster_auth` |
| | `src/App.tsx` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-tinh-cach\src\App.tsx` | `src/App.tsx.bak_20261005_roster_auth` |
| | `public/data/authorized_roster.json` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-tinh-cach\public\data\authorized_roster.json` | (Tạo mới từ `dh4hn-website/lms/authorized_roster.json`) |
| **TKI (`khao-sat-xung-dot-tki`)** | `src/utils/auth.ts` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki\src\utils\auth.ts` | `src/utils/auth.ts.bak_20261005_roster_auth` |
| | `src/components/AuthGateModal.tsx` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki\src\components\AuthGateModal.tsx` | `src/components/AuthGateModal.tsx.bak_20261005_roster_auth` |
| | `src/App.tsx` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki\src\App.tsx` | `src/App.tsx.bak_20261005_roster_auth` |
| | `public/data/authorized_roster.json` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki\public\data\authorized_roster.json` | (Tạo mới từ `dh4hn-website/lms/authorized_roster.json`) |

---

## IV. LỘ TRÌNH THỰC HIỆN 4 GIAI ĐOẠN

### Giai đoạn 1: Chuẩn bị & Đồng bộ Danh bạ Roster vào các kho mã
1. Tạo bản sao lưu `.bak` cho toàn bộ các tệp tin trong Allowlist.
2. Sao chép tệp danh bạ chuẩn `dh4hn-website/lms/authorized_roster.json` vào:
   - `khao-sat-tinh-cach/public/data/authorized_roster.json`
   - `khao-sat-xung-dot-tki/public/data/authorized_roster.json`
3. Cập nhật `dh4hn-website/vercel.json` để thêm CORS header cho `/lms/authorized_roster.json` đảm bảo truy cập từ xa cross-domain.

### Giai đoạn 2: Nâng cấp Module SS (Social Styles) & TKI (Thomas-Kilmann)
1. Cập nhật `src/utils/auth.ts` trên cả 2 dự án:
   - Bổ sung hàm `loadAuthorizedRoster()` (tải từ `/data/authorized_roster.json` kèm fallback URL live).
   - Bổ sung các hàm chuẩn hóa `normalizePhone()`, `normalizeIdentity()`, `findLearnerInRoster()`.
   - Nâng cấp `getStoredAuth()` hỗ trợ nhận diện query params `?email=...&source=lms` và `dhm_lms_auth_user`.
2. Nâng cấp `src/components/AuthGateModal.tsx` trên cả 2 dự án:
   - Thêm trạng thái `roster` (1 ô nhập Email/SĐT) làm giao diện mặc định.
   - Thêm nút chuyển đổi qua lại giữa Tra cứu học viên và Form nhận link dùng thử.
   - Khi tìm thấy học viên trong roster: tự động lưu session và gọi `onVerified`, đóng modal ngay lập tức (0s chờ).
3. Chạy `npm run build` trên cả 2 dự án để xác nhận không có lỗi cú pháp hoặc TypeScript linter.

### Giai đoạn 3: Nâng cấp Bài Tập Thực Hành Lạc Quan ABCDE & LMS Links
1. Thêm cấu trúc HTML Cổng Định Danh (Step 0 Modal) vào `practice-abcde.html` và CSS tương ứng vào `practice-abcde.css`.
2. Thêm logic xác thực 3 tầng và đối chiếu Roster vào `practice-abcde.js`:
   - Hàm `loadAuthorizedRoster()`, `findLearnerInRoster()`, `getStoredUserAuth()`.
   - Tự động điền danh tính học viên đã xác thực vào kết quả nộp bài ABCDE.
3. Trong `dh4hn-website/lms/app.js`:
   - Nâng cấp hàm `updatePersonalValueLinks()` thành `updateAssessmentLinks()`.
   - Tự động gắn query param `?email=${encodeURIComponent(targetEmail)}&source=lms` vào:
     * `personal-value.html`
     * `practice-abcde.html`
     * Các liên kết ngoài trỏ tới SS (`khao-sat-tinh-cach`) và TKI (`khao-sat-xung-dot-tki`).
4. Chạy `node --check` kiểm tra cú pháp toàn bộ tệp JavaScript.

### Giai đoạn 4: Kiểm Thử Nghiệm Thu (UAT) Tự Động & Báo Cáo
1. Viết kịch bản kiểm thử Puppeteer tự động kiểm chứng 100% các ca kiểm thử:
   - **TC-01:** Khách vãng lai nhập Email có trong Roster -> Mở khóa ngay lập tức (0s).
   - **TC-02:** Khách vãng lai nhập SĐT có trong Roster -> Mở khóa ngay lập tức (0s).
   - **TC-03:** Khách vãng lai nhập Email lạ -> Hiện thông báo và mở form dùng thử.
   - **TC-04:** Học viên từ LMS (có param `?email=...&source=lms` hoặc có session `dhm_lms_auth_user`) -> Modal hoàn toàn ẩn, vào thẳng bài làm.
2. Kiểm thử độc lập trên cả 3 hệ thống: SS, TKI, và ABCDE.
3. Xuất báo cáo UAT chi tiết lưu tại thư mục dự án và mirror sang `Teaching DH/Artifacts`.

---

## V. MA TRẬN PHÊ DUYỆT (APPROVAL BOUNDARIES)

- **Cấp độ 2 (Plan Approval):** Người dùng phê duyệt kế hoạch triển khai này để Agent tiến hành sao lưu `.bak`, sửa mã nguồn nội bộ trên các tệp Allowlist, và chạy kiểm thử cục bộ/build kiểm tra.
- **Cấp độ 3 (Risky Operations Approval):** Bắt buộc phải có phê duyệt riêng biệt từ Người dùng trước khi thực hiện:
  1. `git commit` hoặc `git push` trên bất kỳ kho mã nào (`dh4hn-website`, `khao-sat-tinh-cach`, `khao-sat-xung-dot-tki`).
  2. `vercel --prod` hoặc triển khai lên môi trường Live Production.
  3. Gửi email nghiệm thu ra bên ngoài qua `send-email` / MCP.

---

## VI. PHƯƠNG ÁN QUAY LUI AN TOÀN (ROLLBACK PLAN)

Nếu xảy ra bất kỳ lỗi hồi quy hoặc sự cố biên dịch:
1. Với các tệp `.bak`: Khôi phục nguyên trạng tệp gốc bằng lệnh ghi đè từ bản sao lưu.
2. Với Git: Chạy `git checkout -- <file>` để khôi phục mã nguồn về commit sạch trước đó.
