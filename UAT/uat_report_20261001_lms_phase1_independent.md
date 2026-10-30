# Independent UAT — LMS Live Production — Giai đoạn 1

## 1. Phạm vi và bề mặt kiểm chứng

- **Loại kiểm thử:** `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) độc lập, read-only trên trình duyệt.
- **Môi trường đích:** `https://delivering-happiness.vercel.app/lms/`.
- **Kế hoạch tham chiếu:** `Implementation Plan/lms_phase1_focused_mode_and_3sections_exercise_plan.md`.
- **Trình duyệt:** Chrome profile Hoang, tab kiểm thử riêng, kích thước ảnh chụp 1274×630 px; timestamp chính: 2026-10-01 04:56:56Z / 11:56:56 GMT+7.
- **Phạm vi mở rộng:** điều hướng Chặng 1–3, tab Tài liệu, trạng thái Quick Start, và các rủi ro dễ thấy trong luồng học.
- **Không thực hiện:** không điền email/mật khẩu, không đăng nhập lại, không trả lời/nộp quiz, không ghi câu trả lời phản tư, không bấm `Lưu & Đồng Bộ Về Ban Giảng Huấn`.

### Bối cảnh phiên kiểm thử

Live hiển thị session hiện có là **Vũ Hoàng**, tiến độ `0% (0/3 Chặng)`, không phải Coach và chưa có trạng thái sát hạch ≥70%. Vì vậy nhánh Coach/đạt sát hạch chỉ có thể ghi `UNVERIFIED` (chưa đủ bằng chứng), không được suy ra từ code hoặc từ session khác.

## 2. Bảng đối chiếu 4 tính năng Phase 1

| ID | Ca kiểm thử | Kỳ vọng | Quan sát trực tiếp trên Live | Kết quả |
|---|---|---|---|---|
| UAT-01 | Nhấp `#btn-collapse-sidebar-desktop` trên desktop | Sidebar ẩn/co về chế độ tập trung; `#btn-sidebar-desktop-expand` xuất hiện trên header | Cây trợ năng `AX` (Accessibility Tree - cây trợ năng) sau click không còn container Sidebar; xuất hiện button `Mở rộng mục lục`, ID `btn-sidebar-desktop-expand`. Ảnh chụp sau click cho thấy nội dung giãn ra và nút `Hiện mục lục` ở góc header. | **VERIFIED** |
| UAT-02 | F5 sau khi thu gọn | `localStorage` (bộ nhớ cục bộ trong trình duyệt) giữ cờ thu gọn; sau reload Sidebar vẫn ẩn | Sau F5, AX vẫn hiển thị `btn-sidebar-desktop-expand`, không hiển thị Sidebar. Hành vi persistence (duy trì trạng thái) **VERIFIED ở bề mặt UI**. Raw key chưa đọc trực tiếp được trong phiên này; source hiện dùng `dhm_sidebar_collapsed_desktop`, khác key User nêu `dhm_sidebar_desktop_collapsed`. | **PARTIAL / HIGH finding** |
| UAT-03 | Tab Thực hành của Bài 1.1 và accordion Case 1.1 | Hiện đủ 3 Sections; click accordion mở phân tích mẫu trơn tru và click lại đóng được | AX hiển thị Section 1 `Phản Tư & Đúc Kết Tư Duy`, Section 2 `Tình Huống Thực Tế & Bài Tập Mẫu Gợi Ý`, Section 3 `Cam Kết Hành Động Thực Tế`. Click mở đổi mũi tên `▼` thành `▲` và hiển thị `Phân tích nguyên lý`, `Bài tập mẫu gợi ý` cùng 3 bước; click lại đóng nội dung. | **VERIFIED** |
| UAT-04 | Đăng nhập Coach hoặc nộp bài đạt ≥70% để kiểm tra Hero Gate | Banner Hero Gate đổi thành huy hiệu trạng thái nhỏ gọn, có nút tiếp tục học | Không thực hiện vì không có phê duyệt/credential cụ thể để truyền email/mật khẩu hoặc nộp dữ liệu vào Live; session hiện tại là Vũ Hoàng `0%`. | **UNVERIFIED — blocked by safe scope** |

## 3. Điều hướng và audit xây dựng mở rộng

| Bề mặt | Quan sát | Claim level (mức kiểm chứng) |
|---|---|---|
| Chặng 2 | Điều hướng được; hiển thị 5 thói quen, Capstone I•A•M và nút `Lưu & Đồng Bộ Về Ban Giảng Huấn`. Nút ghi dữ liệu không được click. | `VERIFIED` cho render/điều hướng; sync thật `UNVERIFIED` |
| Chặng 3 | Điều hướng được; hiển thị recap, flashcards 1/25, tracker 0/105 và weekly check-in. | `VERIFIED` cho render/điều hướng |
| Tab Tài liệu & Slide | Hiển thị cẩm nang, 4 slide, báo cáo Markdown và flashcards với link/action tương ứng. | `VERIFIED` cho hiển thị; từng link tải/mở chưa được mở độc lập |
| Quick Start | Modal 4 bước hiển thị khi session chưa đánh dấu đã xem; có nút đóng và checkbox không hiện lại. | `VERIFIED` |
| Mobile/responsive | Chưa chạy viewport mobile trong lượt này. | `UNVERIFIED` |
| Console/network | Không dùng probe ngoài trình duyệt trong lượt này. | `UNVERIFIED` |

## 4. Decision lane — finding quan trọng

### F-01 — HIGH — Sai tên key trạng thái Sidebar giữa yêu cầu và implementation

- **Claim level:** `VERIFIED` rằng UI giữ trạng thái sau F5; `INFERRED` (suy luận từ source local) về tên key được dùng; raw key trên Live `UNVERIFIED`.
- **Evidence:** `lms/app.js:792`, `lms/app.js:801`, `lms/app.js:806` dùng `dhm_sidebar_collapsed_desktop`. UAT-02 xác nhận hành vi UI sau F5. Key User yêu cầu là `dhm_sidebar_desktop_collapsed`.
- **Risk:** nếu kiểm thử, telemetry hoặc code tích hợp đọc key theo tên yêu cầu, trạng thái có thể bị đánh giá sai hoặc không được khôi phục dù UI hiện tại vẫn hoạt động.
- **Exact correction:** chốt một canonical key (key chuẩn). Nếu `dhm_sidebar_desktop_collapsed` là source of truth (nguồn chuẩn), đổi cả set/get/remove sang key đó và có migration đọc key cũ một lần; nếu key hiện tại mới là chuẩn, cập nhật plan/UAT contract để không còn hai tên.
- **Acceptance test:** click thu gọn → raw key chuẩn có giá trị `"true"`; F5 → Sidebar vẫn thu gọn; click mở rộng → key chuẩn bị remove; test cả profile chưa có key và profile có key cũ.
- **Decision impact:** không nên đóng UAT-02 là full pass trước khi thống nhất contract key và có raw-storage probe.

### F-02 — HIGH — Hero Gate có hai phần tử trùng `id`, logic chỉ target phần tử đầu tiên

- **Claim level:** `INFERRED` từ source local; nhánh Live với trạng thái ≥70% `UNVERIFIED` do không được tạo/nộp kết quả thật trong lượt này.
- **Evidence:** `lms/index.html:224` và `lms/index.html:330` cùng dùng `id="hero-quiz-gate-banner"`; `lms/app.js:269` lấy một phần tử bằng `document.getElementById`, sau đó `lms/app.js:841-843` chỉ đổi class/HTML cho biến đơn đó.
- **Risk:** sau khi đạt ≥70%, một Hero Gate có thể đổi thành huy hiệu xanh còn banner cùng ID ở tab Summary vẫn còn màu vàng; người học nhìn thấy trạng thái không nhất quán giữa các vị trí.
- **Exact correction:** dùng ID duy nhất cho từng surface hoặc `querySelectorAll` với logic cập nhật đồng nhất; xác định rõ banner trên đầu trang và banner trong Tab Summary có cùng trạng thái hay chỉ một banner là nguồn hiển thị.
- **Acceptance test:** dùng fixture/profile test đã đạt ≥70% (không dùng tài khoản thật trong UAT này), mở Summary và Practice, xác nhận không còn banner vàng không mong muốn, có huy hiệu xanh và nút `Tiếp Tục Bài Tập` đúng surface.
- **Decision impact:** cần một ca kiểm thử seeded state (trạng thái dựng sẵn) trước khi claim Hero Gate đã pass.

## 5. Deferred optimization lane — không chặn kết luận Phase 1

### F-03 — MEDIUM — Caption Audio của Chặng 3 giữ lại nội dung Chặng 2

- **Claim level:** `VERIFIED` trên Live khi điều hướng Chặng 2 → Chặng 3; `INFERRED` từ source.
- **Evidence:** ở Chặng 3, dropdown hiển thị `Không có tệp âm thanh ở chặng này` nhưng subtitle vẫn ghi `11 tệp âm thanh gỡ băng cho Mini Step 2 • Offline`. Trong `lms/app.js:1047-1050`, nhánh `tracks.length === 0` return trước khi cập nhật subtitle tại `lms/app.js:1060`.
- **Risk:** người học hiểu sai rằng Chặng 3 có 11 audio của Chặng 2.
- **Correction/acceptance:** cập nhật subtitle trước nhánh return hoặc đặt copy explicit cho trạng thái không có audio; test chuyển Chặng 2 → Chặng 3 và xác nhận subtitle không còn nhắc Mini Step 2.

### F-04 — MEDIUM — Luồng đồng bộ Google Sheets chưa có bằng chứng consumer-visible

- **Claim level:** `VERIFIED` rằng UI hiển thị lời hứa đồng bộ và nút ghi dữ liệu; sync thật `UNVERIFIED`.
- **Risk:** người học có thể hiểu `Đã tự động lưu` là đã nhận được bản ghi ở phía Giảng viên/Coach, trong khi chưa có receipt (biên nhận) hoặc correlation ID (mã đối chiếu) được kiểm tra.
- **Correction/acceptance:** trong một UAT riêng có test account và User approval cho external write (ghi ra hệ thống bên ngoài), kiểm tra request, phản hồi thành công/thất bại và read-back phía nhận; hiển thị lỗi rõ nếu sync không thành công.

## 6. Ma trận chuẩn hóa bề mặt kiểm chứng

| Verification Surface (bề mặt kiểm chứng) | Method (phương pháp) | Expected | Status |
|---|---|---|---|
| Local files | Đọc plan và grep source allowlist; không sửa source | Đối chiếu được key, selector, renderer và acceptance path | **VERIFIED** cho source-read; không phải runtime proof |
| Apps Script deployment | Không chạy clasp/push; không thuộc phạm vi UAT read-only này | Deployment hoạt động | **UNVERIFIED / out of scope** |
| Public frontend URL | Mở đúng LMS route Live bằng Chrome | Route trả đúng LMS và render các surface đã test | **VERIFIED** cho `/lms/`; chưa đủ 6 URL hard-gate của project |
| Browser evidence | AX + ảnh chụp sau các click/F5 trên tab Chrome kiểm thử riêng | UI người dùng nhìn thấy đúng kết quả | **VERIFIED** cho UAT-01/UAT-03 và điều hướng; UAT-02 chỉ partial; ảnh chụp đang ở browser evidence stream, chưa có file PNG repo-visible |
| Final verdict | Đối chiếu toàn bộ scope, blocker và evidence gap | Tất cả surface đều đủ bằng chứng | **UNVERIFIED** |

## 7. Kết luận và ranh giới vận hành

- **Đã kiểm chứng:** Sidebar desktop có thể thu gọn/mở rộng; trạng thái giao diện giữ qua F5; tab Thực hành Bài 1.1 có đủ 3 Sections; accordion Case 1.1 mở/đóng và hiển thị phân tích mẫu; Chặng 2, Chặng 3 và tab Tài liệu render được.
- **Chưa thể đóng:** raw `localStorage` key theo đúng tên User nêu; nhánh Coach/≥70% Hero Gate; sync Google Sheets; mobile viewport; console/network; từng link tài liệu.
- **Review verdict (phán quyết rà soát):** `REQUEST CHANGES` cho contract key và test Hero Gate; các finding MEDIUM để xử lý sau, không mở thêm vòng sửa chỉ vì tối ưu wording.
- **Operational authorization (ủy quyền vận hành):** Không commit, push, deploy, logout, login, submit quiz, upload, sync hoặc external write. Không có User approval cho các thao tác đó trong lượt này.
- **Docs impact:** `Docs impact: none` đối với runtime; chỉ tạo báo cáo UAT, không sửa implementation plan hay source code.
- **Backup/rollback:** Không cần backup source vì không sửa source. Repo đang có dirty state từ trước; báo cáo này là file mới cần giữ riêng, không được dùng `git add .`.

## 8. Repo hygiene

`git status --short --branch` trước khi tạo báo cáo đã cho thấy working tree (trạng thái file local) bẩn với nhiều thay đổi có sẵn ngoài phạm vi LMS UAT. Không khôi phục, xóa, stage, commit hoặc push các file đó. Sau khi tạo báo cáo cần phân loại file mới này vào `Keep/commit later`; các thay đổi cũ ngoài scope giữ nguyên để User quyết định cleanup riêng.

