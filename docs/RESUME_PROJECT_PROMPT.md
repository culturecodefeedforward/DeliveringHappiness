# RESUME PROJECT PROMPT (BÀN GIAO & TIẾP TỤC DỰ ÁN 1-CHẠM)

> **Mục đích:** Sao chép toàn bộ khối mã `text` bên dưới và dán vào một **Cuộc hội thoại mới (New Chat)** để tiếp tục dự án ngay lập tức mà không sợ tràn context window hay mất bối cảnh kỹ thuật.

```text
gemini nói:
Tôi đang tiếp tục dự án Delivering Happiness Masterclass (DHM Blended Learning LMS, Team Happiness 6-Station IAM v2 App, Apollo Dedicated Admin Dashboard 18-Columns, TKI & Social Styles Surveys, Core Values, ABCDE Practice, Apps Script Auth Gate & Teaching Materials).
Hãy nạp toàn bộ bối cảnh kỹ thuật, trạng thái đã hoàn thành và các quy tắc bất biến dưới đây để tiếp tục công việc ngay lập tức:

1. ĐỊNH VỊ TÀI NGUYÊN & 5 TẦNG SOURCE OF TRUTH (VERIFIED 2026-10-21):
- Tầng 1 - Slide & Tài Liệu Sư Phạm Gốc:
  + File slide bài giảng gốc (Source of Truth v11): G:\My Drive\download\Team_Happiness_R11 For Apollo.pptx
  + Tài liệu in ấn giảng dạy: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\Team_Happiness_final_R6_Toolset_GTKN_SBI_TKI_Printable.pdf
  + Slide 96 (4 Màu Tính Cách Social Styles), Slide 94 (Bảng Đối Chiếu), Slide 82 (5 Phong Cách Xung Đột TKI), Slide 98 (Cam Kết Hành Động).
- Tầng 2 - Bộ Tài Liệu Chuẩn Dự Án (./docs/):
  + PDR & Tổng quan: docs/project-overview-pdr.md
  + Tóm tắt Codebase: docs/codebase-summary.md
  + Kiến trúc hệ thống: docs/system-architecture.md
  + Chuẩn mực mã nguồn & Mã màu slide: docs/code-standards.md
  + Lộ trình dự án & Milestones: docs/project-roadmap.md
  + Hướng dẫn triển khai & Rollback: docs/deployment-guide.md
  + Hướng dẫn thiết kế giao diện: docs/design-guidelines.md
  + Master prompt đóng gói skill: docs/PROMPT_DONG_GOI_SKILL.md
- Tầng 3 - Quy Tắc Hệ Thống & Kỹ Năng Toàn Cục:
  + Quy tắc kiến trúc & an toàn: C:\Users\vu.hoang\.gemini\config\AGENTS.md (Mục 4.A.4, Mục 5.A, Mục 19).
  + Quy tắc dùng chung: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md (Rule 18 - Post-Deployment Live Test Data Purge Gate).
  + Global Skill cốt lõi: C:\Users\vu.hoang\.gemini\config\skills\dhm-blended-lms\SKILL.md & deploy\SKILL.md.
- Tầng 4 - Tệp Mã Nguồn & CSDL Nòng Cốt:
  + Full Admin Dashboard (Dedicated Apollo 70 HV): C:\Users\vu.hoang\.gemini\antigravity\scratch\dhm-admin-full (index.html, generate_app.py, apollo_heatmap_data.json).
  + Apollo 6-Trạm IAM v2 (React Vite): C:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam-v2 (src/data/stationsData.ts, src/components/StationCard.tsx, src/components/IAMFormModal.tsx, apps_script/Code.js).
  + Website LMS chính (Micro-LMS): C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
  + CSDL Học viên chuẩn hóa (70 HV - HN: 38 HV, HCM: 32 HV): C:\Users\vu.hoang\.gemini\antigravity\scratch\dhm-admin-full\apollo_heatmap_data.json
- Tầng 5 - Môi Trường Live Production & Webhook (@clasp v2):
  + Apollo Full Dashboard (18 Cột): https://dhm-admin-full.vercel.app (HTTP 200, Deployment ID dpl_GEDam2jVQc6CeqyVpdSDAStUctmG)
  + Apollo 6-Station IAM v2: https://team-happiness-iam-v2.vercel.app (HTTP 200, Deployment ID dpl_CFBfs1UuFZtxBujK8rjyNENT6rrH)
  + Micro-LMS Học Viên: https://delivering-happiness.vercel.app/lms/index.html
  + Google Apps Script Webhook Live (Version 2 deploy qua clasp):
    URL: https://script.google.com/macros/s/AKfycbwF-KrHVdDwopgjqyvxTqwcrmSAGZWqFk8-ZT2216Sr6Y7kLzkdxf5CIQ6hVAZ7PiwAlA/exec
  + Google Sheets Trung Tâm: 1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak (Đã đồng bộ 37 cột chuẩn trên 'Tổng Hợp Học Viên'!A1:AK1).

2. CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH & KIỂM CHỨNG THỰC TẾ (LIVE DONE 100%):
- Khớp Chuẩn Sĩ Số 70 Học Viên & 15 Người Hoàn Thành Đủ 6 Trạm (2026-10-21):
  + Loại bỏ tài khoản test kỹ thuật viên (dung.levan@apollo.edu.vn - LMS) khỏi danh sách học viên, khớp 100% với danh sách chị Hoàn (HN: 38 HV, HCM: 32 HV).
  + Sửa lỗi tự động đôn trạm ảo: Học viên đợt Hà Nội (5/5 trạm) không bị tự động đánh dấu hoàn thành Trạm 6. Chỉ đúng 15 học viên đợt TP.HCM thực sự nộp bài Trạm 6 mới có trạng thái hoàn thành 6 trạm.
  + Áp dụng quy tắc che mờ PII thuần Việt: Giữ nguyên Tên chính ở cuối (L. V. Dũng, P. N. Lài, T. T. H. Đào), ẩn SĐT, email giữ chữ cái đầu (d***@apollo.edu.vn).
- Chuẩn Hóa Tên 6 Trạm & Triệt Tiêu Tiền Tố "IAM" Tại Trạm 6 (2026-10-21):
  + Trạm 1: DHM | Trạm 2: Mindset | Trạm 3: Skillset | Trạm 4: Social Styles | Trạm 5: TKI Modes | Trạm 6: CTA.
  + Trạm 6 chuyển hoàn toàn sang STOP (Dừng lại) • START (Bắt đầu) • CONTINUE (Duy trì), gỡ bỏ 100% chữ "IAM" khỏi: nút bấm ("Ghi Nhận CTA"), form modal, PDF export, bảng và file CSV.
  + Tinh gọn bảng dữ liệu và hàm xuất CSV trong dhm-admin-full từ 21 cột thừa xuống đúng 18 cột chuẩn (5 trạm x 3 ô IAM + Trạm 6 x 3 ô Stop/Start/Continue) kèm BOM UTF-8 hiển thị hoàn hảo trên Excel.
  + Khắc phục lỗi runtime ReferenceError: s6Done is not defined trong dhm-admin-full.
- Triển Khai Tự Động Qua Clasp & Dọn Sạch Dữ Liệu Live (2026-10-21):
  + Tự động deploy Google Apps Script Version 2 qua clasp CLI (clasp push --force & clasp deploy).
  + Deploy Vercel Production cho cả team-happiness-iam-v2 và dhm-admin-full.
  + Cập nhật trực tiếp 37 tiêu đề cột chuẩn tại 'Tổng Hợp Học Viên'!A1:AK1 của Google Sheets thật qua Sheets API.
  + Dọn sạch 100% dòng dữ liệu nộp thử nghiệm (Vũ Hoàng và dòng lỗi undefined tại dải A8:AK9).
  + Ban hành quy tắc toàn cục Post-Deployment Live Test Data Audit & Immediate Purge Gate vào AGENTS.md, SHARED_AGENT_RULES.md, deploy/SKILL.md và dhm-blended-lms/SKILL.md.
- Tái Cấu Trúc Bộ 10 Câu Hỏi Cổng Sát Hạch Chặng 1 Bám Sát Slide 12-24 & Chuyển 3 Đòn Bẩy Sang Trạm 0 Chặng 2 (2026-10-23):
  + Tinh gọn Chặng 1 vào Khoa học Hạnh phúc & Me Values; tách biệt Cổng Sát Hạch Đầu Vào độc lập (≥80%, 10 câu bám Slide 12-24: Q1 Aristotle, Q2 Flow, Q3 Higher Purpose, Q4 3 Tầng Lầu, Q5 Lan tỏa Me-We-Community, Q6 3 Cấp độ Seligman, Q7 Tony Hsieh, Q8 Me Values, Q9 La Bàn Trade-off, Q10 Hedonic Adaptation).
  + Chuyển giao toàn bộ 7 câu hỏi cũ về 3 Đòn Bẩy (Deci & Ryan, 2000) sang Trạm 0 Chặng 2 để giải mã trực tiếp tại lớp cùng Ban Giảng Huấn.
- Chuẩn Hóa Toàn Diện Ma Trận 20 Điểm Wording Sư Phạm KISS (2026-10-23):
  + Capstone Chặng 2: 'Đúc Kết & Chuyển Hóa' (thay cho 'Đúc kết tổng lực').
  + Cổng Sát Hạch Đầu Vào (thay cho 'Cổng vượt chặng').
  + Huy hiệu Chặng 1: '⏱ Trực Tuyến Tự Điều Tốc' (cắt bỏ '30 phút').
  + Trạm thực hành Chặng 2: '🎯 Trạm Thực Hành 5 Thói Quen Hạnh Phúc' (cắt bỏ '(10 Tiếng Tại Lớp)').
  + Triệt tiêu toàn bộ tiếng lóng/khẩu ngữ dã chiến ('hủy kèo', 'kéo tụt KPI', 'dội gáo nước lạnh', 'đấu trường thực chiến', 'podcast tiếp lửa').
  + Chuẩn hóa tác giả Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy là Deci & Ryan (Edward Deci & Richard Ryan, 2000), loại bỏ nhầm lẫn với Dan Pink.
  + Đồng bộ hóa 14 tệp tài liệu và Global Skill dhm-blended-lms thành Source of Truth duy nhất.
- Toàn Bộ Test Suite Tự Động Vượt Qua 100%:
  + test_station_names_audit.py: 60/60 PASSED (100%).
  + test_progress_filter.cjs: 70 HV, 0 lỗi JavaScript console.
  + verify_pii_sync_local.cjs: PASS 100% PII Masked.

3. BÀI HỌC XƯƠNG MÁU & QUY TẮC BẤT BIẾN (HARD-WON LESSONS & INVARIANTS):
- Quy Tắc Che Mờ PII Thuần Việt (Vietnamese Name Masking Rule): Tuyệt đối không viết tắt tên chính theo kiểu phương Tây (như "Nguyễn T. T. T."). Bắt buộc viết tắt Họ và Đệm, GIỮ NGUYÊN TÊN CHÍNH Ở CUỐI ("N. T. T. Trang") để người Việt có thể nhận diện đồng nghiệp.
- Không Tự Động Đôn Trạm Ảo (No Phantom Station Promotion): Học viên chỉ nộp 5 trạm thì giữ nguyên 5 trạm; cấm tự ý gán cam kết Trạm 5 sang Trạm 6 rồi tự động đánh dấu hoàn thành 6 trạm.
- Tinh Gọn Cột Dữ Liệu Chuẩn 18 Cột: Trạm 6 là cam kết hành động Stop/Start/Continue thay thế hoàn toàn cho 3 ô IAM. Tuyệt đối không để dôi dư thành 21 cột (vừa có IAM vừa có Stop/Start/Continue).
- Triển Khai Google Apps Script Bằng Clasp: Không bắt người dùng copy paste thủ công; sử dụng clasp CLI (`clasp push --force` & `clasp deploy`) từ thư mục `apps_script` để deploy trực tiếp.
- Kỷ Luật Dọn Dẹp Dữ Liệu Test Trên Live (Post-Deployment Live Test Data Purge Gate): Bất kỳ thao tác test nào trên môi trường live phải được theo dõi và dọn dẹp sạch sẽ 100% ngay lập tức (xóa row test, xóa tài khoản BTC probe); kiểm chứng lại bằng read-back trước khi công bố Live done.
- Cấp Độ 3 Phê Duyệt Triển Khai: Mọi thao tác deploy production, xóa dữ liệu hoặc can thiệp hạ tầng bắt buộc phải có câu quote phê duyệt Cấp độ 3 trực tiếp từ User.
- Absolute Path & Clickable Link Rule: Mọi đường dẫn tuyệt đối khi xuất ra phải đặt trong từng khối mã text độc lập kèm link markdown clickable `file:///` ngay bên dưới.

4. NHIỆM VỤ TIẾP THEO CẦN LÀM NGAY (IMMEDIATE NEXT STEPS):
- Tiếp nhận phản hồi từ Chị Hoàn / Chị Châu sau khi đối tác trải nghiệm giao diện Full Dashboard mới với 70 học viên và 15 người hoàn thành 6 trạm.
- Giám sát các lượt nộp bài mới từ học viên trên Webhook Google Apps Script Version 2 xem hàm `ensureSummaryHeaders` hoạt động ổn định và ghi nhận đúng cột Trạm 6 (Stop • Start • Continue).
- Hãy xác nhận đã nạp đầy đủ bối cảnh trên và sẵn sàng nhận lệnh tiếp theo từ sếp!
```


### ⚡ Cập Nhật Chuẩn Hóa Sư Phạm 3 Chặng & Lệnh Cấm 21/30 Ngày (22/10/2026):
1. **Source of Truth Quyết Định (Sếp Dzũ & Chị Châu 22/10/2026):**
   - **Chặng 1 — Khởi động với hạnh phúc** (Pre-Class Online & Webinar)
   - **Chặng 2 — Gieo thói quen hạnh phúc** (Workshop Offline trực tiếp — Chuyển 3 Đòn Bẩy sang Offline cùng 5 Thói Quen)
   - **Chặng 3 — Tiếp nối hành trình hạnh phúc** (Đồng hành chuyển hóa cùng Micro-LMS & Habit Tracker)
2. **Lệnh Cấm Tuyệt Đối Cột Mốc 21 Ngày / 30 Ngày:** CẤM TUYỆT ĐỐI nhắc đến hoặc đóng khung thời gian "21 ngày" hay "30 ngày" trong Chặng 3 trên tất cả tài liệu, giao diện LMS, Landing Page, bài đăng LinkedIn và kịch bản Email của dự án.
