# Lộ Trình Phát Triển Dự Án (Project Roadmap) — Delivering Happiness

Tài liệu này ghi nhận các mốc phát triển đã hoàn thành, hiện trạng hệ thống và lộ trình nâng cấp các tính năng tiếp theo cho hệ thống đào tạo Delivering Happiness.

---

## 🏁 Lộ Trình 4 Giai Đoạn (4-Phase Roadmap)

### Giai Đoạn 1: Chuẩn Hóa Khung Sư Phạm & Thiết Kế Slide Bài Giảng (ĐÃ HOÀN TẤT)
- [x] Rà soát và đồng bộ hóa toàn bộ slide bài giảng PowerPoint (DH8, DHM4, Inhouse B2B) với triết lý Tony Hsieh và các tác giả kinh điển.
- [x] Phân chia vai trò giảng dạy rõ ràng cho từng giảng viên trong Ban Giảng Huấn.
- [x] Trích xuất và lập chỉ mục kho 44 bản chụp slide bài giảng chính thức (`slide_01.png` đến `slide_44.png`).
- [x] Xây dựng bộ khảo sát 10 câu (10Q Assessment) và các tình huống thực hành ABCDE chuẩn hóa.

### Giai Đoạn 2: Xây Dựng Hệ Thống Micro-LMS Blended Learning (ĐÃ HOÀN TẤT)
- [x] Phát triển giao diện đơn trang SPA phong cách Focused Mode (LinkedIn Learning / MasterClass).
- [x] Tích hợp cơ chế xác thực không mật khẩu (Passwordless Identity Gate) đối chiếu danh bạ học viên.
- [x] Thiết kế Chặng 1: Khởi động với hạnh phúc & Cổng Sát Hạch Đầu Vào 10 câu bám sát Slide 12-24 (≥ 80% - 8/10 câu sau tối đa 3 lần thử).
- [x] Thiết kế Chặng 2: Gieo thói quen hạnh phúc (Trạm 0: 3 Đòn Bẩy Deci & Ryan, Xưởng 5 Thói Quen và Đúc Kết & Chuyển Hóa).
- [x] Thiết kế Chặng 3: Tiếp nối hành trình hạnh phúc (Habit Tracker 5 thói quen & Weekly Check-in I•A•M, gỡ bỏ nhãn số cứng 21/30 ngày).
- [x] Tích hợp bộ đúc kết 3 thành tựu I • A • M (Interested • Actionable • Meaningful) cho từng chặng.
- [x] Đồng bộ dữ liệu tiến độ thời gian thực về Google Sheets qua Google Apps Script Webhook.

### Giai Đoạn 3: Tái Cấu Trúc 3 Chặng Chuẩn Xác & Ẩn Danh Hóa Case Study (ĐÃ HOÀN TẤT)
- [x] Làm sạch 100% dữ liệu phóng tác, khôi phục nguyên bản bài giảng thực tế của giảng viên.
- [x] Đưa 44 bản chụp slide bài giảng chính thức vào Git tracking và triển khai lên Vercel Live (Commit a4a61c4, HTTP 200 OK).
- [x] Đồng bộ công cụ La Bàn Me Values và Thực hành Lạc quan ABCDE giữa Landing Page và Micro-LMS (Commit 82989f2).
- [x] Tái cấu trúc 3 Chặng theo đúng Transcript gốc và Slide Master v11 của Cô Châu: Chặng 1 — Khởi động với hạnh phúc; Chặng 2 — Gieo thói quen hạnh phúc (Trạm 0: 3 Đòn Bẩy Nơi Làm Việc Deci & Ryan, 5 Thói quen, Đúc Kết & Chuyển Hóa); Chặng 3 — Tiếp nối hành trình hạnh phúc (Habit Tracker & Action Learning).
- [x] Ẩn danh hóa nhân vật (PII Protection): Chị An, Anh Nam, Chị Hà, Bình; giữ nguyên danh tính Ban Giảng Huấn chính thức (Commit f49874f).
- [x] Gỡ bỏ thông báo đồng bộ Ban Giảng Huấn chân trang, hoàn thiện trải nghiệm tự động lưu (Commit 3e24214).
- [x] Triển khai Cổng Định Danh Kép (Unified Dual-Mode Auth Gate) cho toàn bộ 4 công cụ vệ tinh PV, ABCDE, TKI, SS (Commit 96e8f43, 17/17 PASS).
- [x] Triển khai Đồng bộ Điểm danh Thói quen 21 Ngày (21-Day Habit Tracker Sync CRM Engine) gửi Webhook về Google Sheets CRM (Commit cf166c6, Live Done 7/7 PASS 100%).
- [x] Cấu hình 2 tài khoản kiểm thử Coach mở sẵn 100% cả 3 chặng (`vuhoang2708software@gmail.com` và `culturecodeproject@gmail.com`, pass 1234) đồng bộ trên 3 repo (Commits fd1e35a, 94e085b, 3d4d546).
- [x] Tích hợp Khối Accordion Hướng Dẫn & Chú Giải 5 Thói Quen (M-G-O-F-A), nâng cấp bộ đọc markdown hiển thị ảnh trực quan và cập nhật Phần V Cẩm nang học tập (Commit 880bfb8, Live Done 3/3 PASS).
- [x] Chuẩn hóa 5 điểm Hành trình học tập LMS Chặng 1, Video Tổng quan độc lập và Thanh điều hướng Sticky Bottom Mobile (Commit f128935, c7f7727).
- [x] Độc lập kiểm thử trình duyệt (Independent Browser UAT) trên Live Production Vercel: 7/7 ca PASS, 0 console errors, HTTP 200 OK across assets (Báo cáo: `uat_report_20261005_live_browser_verification.md`).
- [x] Chuẩn hóa và lưu trữ Bộ Kịch bản Lời dẫn Apollo DHM 90-phút chính thức (`Apollo_DHM_Online_90min_Loi_dan_Hoang_Vu_Official.docx` & Markdown artifacts).
- [x] Tái Cấu Trúc Chặng 1 Tinh Gọn (6 Mục & 2 Trạm Dừng Check point 1 & 2 I•A•M), tích hợp cầu nối Top 7 DNA từ bài test La Bàn Me Values và Cổng Sát Hạch độc lập (Commits b75e13b, 538b37c).
- [x] Kiểm Thử Trình Duyệt Tự Động Toàn Trình (Playwright E2E UAT) 8/8 bước đạt 100% PASS trên Live Vercel: nạp tài khoản, kiểm tra 3 bài học không còn textarea phân mảnh, kiểm tra 2 trạm IAM, làm quiz 10/10 và kiểm chứng độ bền dữ liệu sau khi F5 (Báo cáo: `uat_report_20261009_stage1_restructure_browser_e2e.md`).
- [x] Chuẩn Hóa Câu Chữ Bước 3 & Bước 4 trong Modal Khởi Động Nhanh (#modal-quick-start) theo phản hồi thực tế của Sếp Dzũ, kiểm chứng trực quan trên cả 2 khung nhìn Desktop & Mobile iPhone 13 đạt 100% PASS (Commit 538b37c, Báo cáo: `uat_report_20261009_quick_start_modal_wording.md`).
- [x] Hệ Thống Quản Lý Mật Khẩu 4 Tầng & Đổi Mật Khẩu Tự Phục Vụ: Modal đổi mật khẩu an toàn (#change-pass-modal), mã hóa băm SHA-256 Web Crypto API, nút 🔒 trên header, Webhook CRM đồng bộ `update_password`, cơ chế cưỡng chế đổi mật khẩu tài khoản Apollo và mã PIN khẩn cấp 8888.
- [x] Cổng Khóa Học Thử & Phân Luồng Học Viên Chặng 2: Khóa cứng nội dung Chặng 2 & 3 đối với tài khoản trải nghiệm thử (`isTrial = true`), Modal nâng cấp (#trial-upgrade-modal) tích hợp gửi Magic Link xác thực tuân thủ Nghị định 13/2023/NĐ-CP (cooldown 60s).
- [x] Tối Ưu Hóa & Tăng Độ Khó Đề Thi Sát Hạch Đầu Vào: Chuẩn hóa 10 câu hỏi theo Thuyết Tự Quyết (Deci & Ryan) và văn hóa Zappos (Tony Hsieh), cân bằng phương án gây nhiễu, ẩn hiển thị đáp án khi làm sai để chống học vẹt, ngưỡng đạt 80% (8/10), tự động khóa thi an toàn khi làm sai quá 3 lần.
- [x] Bộ 3 Tính Năng Tương Tác Mới LMS: Multi-Set I•A•M 3 cột không giới hạn số bộ thẻ cho Checkpoint 1 & 2; Header Drawer "Kho I•A•M" duyệt toàn bộ lịch sử ghi chép; Floating Quick Note FAB (📝 debounced 400ms, phím tắt `Ctrl+J`, tự động gắn ngữ cảnh chặng học, nút 1-chạm chèn vào ô I); Modal liên hệ Culturecode 4 chủ đề 1-chạm gửi kép Webhook & Mailto.
- [x] Hoàn Thiện Bộ Kịch Bản & Lời Dẫn Apollo DHM 90 Phút: Biên soạn chi tiết lời dẫn giảng dạy trực tuyến 90 phút Apollo (`loi_dan_hien_tai_full.md`), chuẩn hóa cấu trúc đối thoại theo tiến trình sư phạm từ transcript bóc băng thực tế.
- [x] Kiểm chứng thực tế mã phản hồi HTTP `200 OK` và giao diện live trên `delivering-happiness.vercel.app/lms/`.
- [x] Đồng Bộ Tự Động Tiến Độ Cục Bộ Khi Mở Trang (Auto-Sync Local Progress on Boot — Commit `a106a30`, 10/10/2026): Chuẩn hóa hàm điều phối `dispatchTelemetryPayload(payload)` (ưu tiên `navigator.sendBeacon` với `Blob text/plain`, fallback `fetch no-cors`), tích hợp `triggerAutoTelemetryOnBoot()` với chữ ký trạng thái `dhm_telemetry_last_hash_<identity>`, độ trễ ngẫu nhiên 1–4 giây và khóa đơn luồng (`isAutoTelemetryInFlight`), đạt 18/18 ca kiểm thử UAT cục bộ và Live Verified.
- [x] Nối Mạch Toàn Diện Checkpoints I•A•M & 5 Trạm Thu Hoạch Lên Google Sheets (Commit `1051e15`, Google Apps Script `@78`, Vercel `team-happiness-iam`, 10/10/2026): Bổ sung `extractIamAndNotesTelemetry(prog, identity)` thu thập trọn vẹn `stage1_iam_cp1_sets`, `stage1_iam_cp2_sets`, `stage1_iam_1_1..1_3`, `stage2_habits`, `stage2_capstone_sets`, `quick_notes`; nâng cấp Webhook GAS ghi và khử trùng lặp vào Sheet Apollo (`1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak` — 3 tab: `Tổng Hợp Học Viên`, `Nhật Ký Từng Trạm`, `Thu Hoạch LMS & Checkpoints`) và Sheet CRM chính; đạt 35/35 ca kiểm thử UAT tự động và Live Verified 100%.
- [x] Triển Khai Bản Vá 6 Lỗi Đồng Bộ Hai Chiều Apollo & Nghiệm Thu Trình Duyệt Chuyên Sâu 10 Ca `BW-01..BW-10` (Commit `5fd2a6fc`, Google Apps Script `@79`, Vercel `dpl_N4c3DvWzdDE2d2d58fwG1MymVGbn`, 11/10/2026): Thay thế `no-cors` bằng `fetch` đọc phản hồi JSON thực tế trước khi đóng dấu hash, tự động khôi phục dữ liệu đám mây khi đăng nhập thiết bị mới (`hydrateProgressFromCloudOnBoot` & `hydrateStationsFromCloudOnBoot`), sửa nút Lưu ở các trạm Checkpoint, chuẩn hóa `await syncHabitTrackerToCRM()` và sửa cột Email trên GAS `@79`; vượt qua 10/10 ca UAT trình duyệt chuyên sâu có đối chiếu ngược 3 tab Google Sheets (`uat_browser_script_20261011_apollo_sync_write_test.md`).
- [x] Triệt Tiêu 6 Lỗ Hổng Bảo Mật Cấp Bách P0 (Commit `a0ee05dc`, 12/10/2026): Gỡ bỏ CORS wildcard `*`, làm sạch PII học viên trong demo dữ liệu, băm SHA-256 mã PIN Admin qua Web Crypto API, escapeHTML chống Stored XSS, xóa mã PIN 8888 và bypass thanh toán localStorage; vượt qua 9/9 kiểm thử tự động `verify_security_patch.py`.
- [x] Phát Hành & Tối Ưu Hóa Toàn Diện Apollo 6 Trạm I•A•M v2 & Dashboard Giảng Viên 18 Cột (`team-happiness-iam-v2`, 12/10/2026): Chuẩn hóa nhận diện thương hiệu `TEAM HAPPINESS`, gỡ bỏ hoàn toàn từ ngữ bịa đặt (`DEDICATED`) và text kỹ thuật (`Đồng bộ Sheet cũ`), hero copy sư phạm trong sáng; tối ưu hiển thị bảng 18 cột x 155px có `line-clamp-3`, cố định 3210px, non-sticky mobile cuộn ngang mượt mà, Live Verified 100%.
- [x] Tạm Dừng An Toàn IAM v1 (`team-happiness-iam`) Đến 20/10/2026 (12/10/2026): Tạo Git Tag `backup_iam1_full_pre_pause_20261012`, render màn hình thông báo tạm dừng sang trọng và tự động chuyển hướng 4s sang v2, Live Verified.
- [x] Bảo Toàn Cổng Quản Trị Lớn Ban Giảng Huấn (`dhm-micro-lms/admin.html`, 12/10/2026): Bảo toàn nguyên vẹn 100% 3.480 dòng mã, quản lý LMS, chấm bài ABCDE, bài test 80%, Heatmap và Cohort Analytics; bổ sung `min-w-[950px]` cho Tab 2 hiển thị chuẩn trên di động.

### Giai Đoạn 4: Trí Tuệ Nhân Tạo Đồng Hành & Mở Rộng Cộng Đồng (HIỆN TẠI & KẾ TIẾP)
- [x] Khắc Phục Triệt Để Cơ Chế Phân Quyền Drive & Token OAuth (PLAN-20261012-FIX-DRIVE-MAILER-PERMISSION-SYSTEMIC, 12/10/2026): Tích hợp cổng hậu kiểm đọc lại (read-back audit gate) bắt buộc shared==True & type: anyone, thêm cờ CLI --set-permission <file_id>, bắt RefreshError, bổ sung Google Drive Permission Verification Gate vào Rule 17 SHARED_AGENT_RULES.md và lưu hồ sơ bài học Second Brain.
- [x] Hoàn Thiện & Đồng Bộ Cẩm Nang Kiểm Thử LMS & IAM Song Song .MD + .PDF (12/10/2026): Bổ sung 2 trường hợp phản hồi (Lỗi kỹ thuật vs Góp ý wording), Mục 5 giải thích chi tiết 3 tab Google Sheets (Tổng Hợp Học Viên, Nhật Ký Từng Trạm, Thu Hoạch LMS & Checkpoints); xuất bản PDF A4 4 trang (582 KB), đồng bộ Drive (ID: 1Dlme_nx-vURL1uSOpNVdJalKWw9-Iduc, anyone: writer) và gửi email qua drive_report_mailer.py.
- [x] Thiết Lập Chuẩn Prompt Chuyển Giao Kiểm Toán Bảo Mật 6 Hạng Mục (13/10/2026): Soạn prompt chuyển giao chuẩn SHARED_AGENT_RULES.md rà soát CORS, PIN SHA-256, URL Bypass, XSS, PII và Webhook cho các ứng dụng khảo sát vệ tinh (Social Styles assessment.html, TKI React SPA, Me Values personal-value.html, Register forms).
- [x] Khắc Phục Triệt Để Luồng Kích Hoạt Email Cho Người Mới & Gỡ Bỏ Bẫy Bế Tắc HTML5 (Commit `f98336c`, 17/10/2026): Bổ sung nút chuyển đổi trực quan `#btn-toggle-newcomer-trial`, gỡ bỏ thuộc tính `required` native trên ô Mật khẩu, bổ sung cơ chế chống sập form khi đang gõ email, ủy quyền phím Enter sang nút gửi yêu cầu học thử, lưu trữ toàn vẹn hồ sơ học thử (Họ tên & SĐT) vào `localStorage["dhm_lms_trial_profiles"]`, và vượt qua 15/15 ca kiểm thử E2E tự động Puppeteer (`verify_trial_flow.js`); Live Verified 100% trên Vercel.
- [x] Tiếp Thu Bài Học Kinh Nghiệm (/learn) Vào `config/AGENTS.md` (Mục 5.4, 17/10/2026): Bổ sung quy tắc "Chống Bẫy Bế Tắc HTML5 Required & Điểm Mù UAT Trong Form Xác Thực Phân Nhánh" theo nguyên tắc Consolidation First, giải quyết dứt điểm nguyên nhân gốc rễ và triệt tiêu thói quen kiểm thử bằng dữ liệu giả (dummy password).
- [x] Đồng Nhất Toàn Diện Trải Nghiệm Xác Thực & Modal Đăng Nhập Trên Toàn Bộ 5 Hệ Thống (Commits `5dfa935`, `be3f0ce`, `3f5bb8d`, 17/10/2026):
  - Bổ sung nút đóng `[X]` nổi bật ở góc trên bên phải, backdrop click, Escape key dismiss và chế độ Xem Trước (Guest Preview Mode) cho LMS Chặng 1, TKI Conflict Survey, Social Styles Survey, Core Values và ABCDE Practice.
  - Bổ sung nút `[🔑 Đăng Nhập]` cố định trên thanh điều hướng Header ở tất cả các ứng dụng để học viên dễ dàng mở lại form bất cứ lúc nào.
  - Áp dụng triệt để nguyên tắc Single State - Single CTA (gộp nút đếm ngược `Gửi lại liên kết sau (Xs)` / `Gửi lại liên kết mới`, loại bỏ nút gửi thừa gây nhầm lẫn).
  - Chuẩn hóa văn bản chấp thuận Nghị định 13: `"Đăng ký thông tin & nhận liên kết kích hoạt học thử qua email."`.
  - Triệt tiêu hoàn toàn vi phạm lộ mật khẩu/mã PIN trên UI theo Rule 5.4 tại Core Values (`personal-value.html`), chuẩn hóa Roster-First 1 ô nhập duy nhất.
  - Nâng cấp Backend Google Apps Script (`active_code_gs_final.js`): Bổ sung định tuyến khảo sát `ABCDE` (cột 12), rẽ nhánh email kích hoạt học thử (`LMS_TRIAL`) với tiêu đề và CTA riêng biệt `[KÍCH HOẠT TÀI KHOẢN VÀ HỌC THỬ NGAY]`, bảo toàn nguyên vẹn email bài khảo sát `[BẮT ĐẦU LÀM BÀI KHẢO SÁT NGAY]`.
  - Kiểm thử trình duyệt tự động E2E (Puppeteer) 5/5 hệ thống trên môi trường Production Live đạt 100% PASS (`scratch/verify_live_auth_modal_e2e.js`).
- [x] Chuẩn Hóa 100% Số Thứ Tự Trạm Thuần Túy Trên Admin Dashboard & Khắc Phục Lỗi Giao Diện Tab 5 (Commits `491c830`, `785386d`, `33f2947`, 18/10/2026):
  - Dọn sạch triệt để toàn bộ các tên trạm do AI tự bịa (`Mindset`, `Leadership`, `Situational`, `Skills & OILS`, `Styles`, `Action Plan`, `Bóng Lãnh Đạo`, `Nền Tảng Hạnh Phúc`...) trên Tab 2 Thead (`TRẠM 1` .. `TRẠM 6`), Tab 2 Heatmap 6 Trạm, Tab 2 Modal chi tiết học viên, Tab 5 Sub-tab IAM filter pills, và thẻ thu hoạch. Bám sát 100% chỉ đạo của Sếp Dzũ, phản ánh của Chị Châu và Source of Truth Apollo IAM v2.
  - Xóa bỏ bẫy rò rỉ dữ liệu `|| st1` trong `renderHeatmapIAMGrid` của Trạm 1 sang Trạm 6; hiển thị thông báo rõ ràng *"Học viên chưa gửi bài thu hoạch trạm này."*
  - Nâng cấp `openHeatmapStudentModal` (Modal Quản Lý Tab 5) lặp cố định 6 trạm `[1..6]`, hiển thị đủ cả 6 thẻ trạm kèm huy hiệu trạng thái (`✓ Đã nộp` hoặc `Chưa nộp`).
  - Sửa điều kiện xuất CSV `exportHeatmapDataCSV` kiểm tra `!== undefined` chống lỗi falsy khi học viên có 0 trạm.
  - Đảm bảo tính toàn vẹn song phương byte-to-byte 100% giữa `Teaching DH/dhm-micro-lms/admin.html` và `dh4hn-website/lms/admin.html` (`filecmp.cmp == True`).
  - Kiểm thử Playwright Live E2E trên Production Vercel (`verify_live_admin_stations_v2.py`): 100% PASS, 0 console errors, lưu 4 ảnh chụp bằng chứng tại `UAT/screenshots/`.
  - Báo cáo UAT: `Teaching DH/UAT/uat_admin_station_names_standardization.md`.
- [x] Chuẩn Hóa Dashboard Heatmap Admin Theo Slide v11 & Ô Đơn Sắc Đồng Nhất (Commit `b5d1b35`, 19/10/2026):
  - Áp dụng hệ màu chuẩn Slide 93 & 94 ("MY COLOR") cho Social Styles: Hòa Nhã (#92D050), Biểu Cảm (#FFC000), Phân Tích (#2563EB), Tiên Phong (#C00000).
  - Áp dụng hệ màu chuẩn Slide 82 ("What's the best way to handle conflict") cho TKI 5 phong cách xung đột: Cạnh Tranh Gold (#DFAB45), Hợp Tác Coral (#D15E32), Thỏa Hiệp Crimson (#C90D40), Né Tránh Purple (#911084), Nhượng Bộ Indigo (#280980).
  - Loại bỏ hoàn toàn vầng nhiệt gradient cầu vồng đa sắc; chuyển sang thiết kế ô góc phần tư SVG đơn sắc đồng nhất, toàn bộ điểm chấm học viên trong ô mang 1 màu chuẩn duy nhất.
  - Nhãn góc phần tư hiển thị 2 dòng: Tên phong cách (Dòng 1) + Badge Số lượng học viên & Tỷ lệ % (Dòng 2).
  - UAT tự động Puppeteer 100% PASS, 0 console errors; đã deploy và kiểm chứng Live Production Vercel HTTP 200.
  - Xuất bản song song báo cáo .pdf + .md, đồng bộ Google Drive (public writer) và gửi email qua Gmail API tới `vuhoang2708@gmail.com` (Message ID: `1a154982d09fada3`).
  - Soạn thảo sẵn bản thảo tin nhắn gửi Ban Giảng Huấn và team kiểm thử.
- [x] Tái Cấu Trúc Bộ 10 Câu Hỏi Cổng Sát Hạch Chặng 1 Bám Sát Slide 12-24, Chuyển 3 Đòn Bẩy Sang Trạm 0 Chặng 2 & Chuẩn Hóa Ma Trận 20 Điểm Wording Sư Phạm KISS (23/10/2026):
  - **Tái Cấu Trúc Bộ 10 Câu Hỏi Sát Hạch Chặng 1**: Bám sát 100% Slide 12–24 (Q1 Aristotle Eudaimonia, Q2 Flow, Q3 Higher Purpose, Q4 3 Tầng Lầu, Q5 Lan tỏa Me-We-Community, Q6 3 Cấp độ Seligman, Q7 Tony Hsieh, Q8 Me Values, Q9 La Bàn Trade-off, Q10 Hedonic Adaptation). Chuyển giao toàn bộ 7 câu hỏi cũ về 3 Đòn Bẩy sang Trạm 0 Chặng 2.
  - **Chuẩn Hóa Ma Trận 20 Điểm Wording Sư Phạm KISS**: Capstone Chặng 2 đổi thành 'Đúc Kết & Chuyển Hóa'; Trắc nghiệm Chặng 1 đổi thành 'Cổng Sát Hạch Đầu Vào'; Huy hiệu Chặng 1 đổi thành '⏱ Trực Tuyến Tự Điều Tốc'; Trạm Chặng 2 đổi thành '🎯 Trạm Thực Hành 5 Thói Quen Hạnh Phúc'; triệt tiêu tiếng lóng hè phố và dã chiến; chuẩn hóa tác giả Thuyết Tự Quyết (SDT) là Deci & Ryan (2000).
  - **Đồng Bộ Hóa Toàn Diện 14 Tệp Tài Liệu & Global Skill**: Hợp nhất toàn bộ tài liệu kiến trúc, hướng dẫn học tập, kịch bản test, prompt bàn giao và Global Skill dhm-blended-lms thành Source of Truth duy nhất.
- [x] Khớp Chuẩn Sĩ Số 70 Học Viên Apollo, Đổi Tên 6 Trạm, Gỡ IAM Trạm 6, Tự Động Triển Khai Clasp & Ban Hành Quy Tắc Dọn Dẹp Dữ Liệu Live (21/10/2026):
  - **Khớp chuẩn sĩ số 70 học viên**: Loại bỏ tài khoản test kỹ thuật viên LMS, khớp 100% danh sách học viên Apollo thực tế (HN: 38 HV, HCM: 32 HV). Sửa lỗi đôn trạm ảo, ghi nhận chính xác 15 học viên thực tế hoàn thành đủ 6 trạm.
  - **Che mờ PII chuẩn Việt**: Viết tắt họ và đệm, giữ nguyên tên chính ở cuối (`L. V. Dũng`, `P. N. Lài`, `T. T. H. Đào`), che SĐT và email (`d***@apollo.edu.vn`).
  - **Chuẩn hóa tên 6 trạm**: Trạm 1: `DHM`, Trạm 2: `Mindset`, Trạm 3: `Skillset`, Trạm 4: `Social Styles`, Trạm 5: `TKI Modes`, Trạm 6: `CTA`.
  - **Triệt tiêu 100% tiền tố IAM tại Trạm 6**: Trạm 6 chuyển sang cam kết STOP • START • CONTINUE. Xóa bỏ hoàn toàn nhãn "IAM" ở nút CTA, form modal, PDF export, bảng matrix và file CSV.
  - **Tinh gọn bảng và CSV 18 cột**: Thu gọn từ 21 cột thừa xuống đúng 18 cột chuẩn (5 trạm x 3 ô IAM + Trạm 6 x 3 ô Stop/Start/Continue) kèm UTF-8 BOM `\uFEFF` chống lỗi font Excel. Sửa lỗi runtime `ReferenceError: s6Done is not defined`.
  - **Tự động hóa triển khai & Webhook v2**: Đẩy code tự động bằng clasp CLI (`clasp push --force` & `clasp deploy`) sinh Version 2 cho Google Apps Script; triển khai Vercel Production cho `team-happiness-iam-v2` (`dpl_CFBfs1UuFZtxBujK8rjyNENT6rrH`) và `dhm-admin-full` (`dpl_GEDam2jVQc6CeqyVpdSDAStUctmG`).
  - **Đồng bộ Google Sheets & Kỷ luật Dọn dẹp Dữ liệu Live**: Cập nhật 37 tiêu đề cột chuẩn tại `Tổng Hợp Học Viên!A1:AK1`; xóa sạch toàn bộ dòng dữ liệu test và tài khoản probe; ban hành quy tắc toàn cục `Post-Deployment Live Test Data Audit & Immediate Purge Gate` vào `AGENTS.md`, `SHARED_AGENT_RULES.md`, `deploy/SKILL.md` và `dhm-blended-lms/SKILL.md`.
  - **Kiểm thử tự động 100% PASS**: `test_station_names_audit.py` (60/60 PASS), `test_progress_filter.cjs` (70 HV, 0 errors), `verify_pii_sync_local.cjs` (100% PII Masked).
- [ ] Hỗ trợ Ban Giảng Huấn vận hành lớp học Apollo và giám sát thu hoạch 6 Trạm trên dashboard Live v2.
- [ ] Khôi phục phiên bản đầy đủ IAM v1 (team-happiness-iam) sau ngày 20/10/2026 từ git tag.
- [ ] Tích hợp Trợ lý AI Huấn luyện Hạnh phúc (AI Happiness Coach) hỗ trợ học viên giải đáp tình huống ABCDE sau khóa học.
- [ ] Mở rộng bảng điều khiển quản trị (Admin Dashboard) phân tích chỉ số chuyển hóa thói quen bền bỉ.
- [ ] Đóng gói phiên bản Micro-LMS Offline PWA (Progressive Web App) có thể cài đặt trực tiếp lên màn hình chính điện thoại.
- [ ] Phát triển các chuyên đề chuyên sâu B2B dành cho khối Y tế (CME), Giáo dục và Doanh nghiệp sản xuất.


