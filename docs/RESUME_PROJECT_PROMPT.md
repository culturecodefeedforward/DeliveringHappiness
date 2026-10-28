# RESUME PROJECT PROMPT (BÀN GIAO & TIẾP TỤC DỰ ÁN 1-CHẠM)

> **Mục đích:** Sao chép toàn bộ khối mã `text` bên dưới và dán vào một **Cuộc hội thoại mới (New Chat)** để tiếp tục dự án ngay lập tức mà không sợ tràn context window hay mất bối cảnh kỹ thuật.

```text
gemini nói:
Tôi đang tiếp tục dự án Delivering Happiness Masterclass (DHM Blended Learning LMS 3 Chặng, Team Happiness 6-Station IAM v2 App, Apollo Dedicated Admin Dashboard 18-Columns, TKI & Social Styles Surveys, Core Values, ABCDE Practice, Apps Script Auth Gate & Teaching Materials).
Hãy nạp toàn bộ bối cảnh kỹ thuật, trạng thái đã hoàn thành và các quy tắc bất biến dưới đây để tiếp tục công việc ngay lập tức:

1. ĐỊNH VỊ TÀI NGUYÊN & 5 TẦNG SOURCE OF TRUTH (VERIFIED 2026-10-23):
- Tầng 1 - Slide & Tài Liệu Sư Phạm Gốc:
  + File slide bài giảng gốc (Source of Truth v11): G:\My Drive\download\Team_Happiness_R11 For Apollo.pptx
  + Tài liệu in ấn giảng dạy: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\Team_Happiness_final_R6_Toolset_GTKN_SBI_TKI_Printable.pdf
  + Slide 12-24 (Khoa học Hạnh phúc & Me Values Chặng 1), Slide 96 (4 Màu Tính Cách Social Styles), Slide 94 (Bảng Đối Chiếu), Slide 82 (5 Phong Cách Xung Đột TKI), Slide 98 (Cam Kết Hành Động).
  + Quy tắc trích xuất Slide: Strict Minimal Slide Copy & Zero Fluff Rule (Slide ghi thế nào thì ghi đúng 100% từng chữ như vậy; cấm tự ý gộp tên tiếng Anh, cấm chêm linh vật hay từ lóng dã chiến).
- Tầng 2 - Bộ Tài Liệu Chuẩn Dự Án (./docs/):
  + PDR & Tổng quan: docs/project-overview-pdr.md
  + Tóm tắt Codebase: docs/codebase-summary.md
  + Kiến trúc hệ thống LMS: docs/system-architecture.md & docs/DHM_BLENDED_LMS_STANDARDIZED_ARCHITECTURE.md
  + Chuẩn mực mã nguồn & Mã màu slide: docs/code-standards.md
  + Lộ trình dự án & Milestones: docs/project-roadmap.md
  + Hướng dẫn triển khai & Rollback: docs/deployment-guide.md
  + Hướng dẫn thiết kế giao diện: docs/design-guidelines.md
  + Master prompt đóng gói skill: docs/PROMPT_DONG_GOI_SKILL.md
- Tầng 3 - Quy Tắc Hệ Thống & Kỹ Năng Toàn Cục:
  + Quy tắc kiến trúc & an toàn: C:\Users\vu.hoang\.gemini\config\AGENTS.md (Mục 0, 1, 4, 5.A, 19).
  + Quy tắc dùng chung: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md (Rule 18 - Post-Deployment Live Test Data Purge Gate, Cross-Agent Review Reply Rule).
  + Global Skills cốt lõi: C:\Users\vu.hoang\.gemini\config\skills\dhm-blended-lms\SKILL.md, ui-ux-pro-max\SKILL.md, package-project\SKILL.md, deploy\SKILL.md.
- Tầng 4 - Tệp Mã Nguồn & CSDL Nòng Cốt:
  + Kho lưu trữ LMS Website chính: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website (lms/index.html, lms/app.js, lms/curriculum_data.json, lms/authorized_roster.json).
  + Kho lưu trữ LMS Giảng huấn: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms (đồng bộ 100% với dh4hn-website/lms).
  + Apollo Full Dashboard (18 Cột): C:\Users\vu.hoang\.gemini\antigravity\scratch\dhm-admin-full (index.html, generate_app.py, apollo_heatmap_data.json).
  + Apollo 6-Trạm IAM v2 (React Vite): C:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam-v2 (src/data/stationsData.ts, src/components/StationCard.tsx, apps_script/Code.js).
- Tầng 5 - Môi Trường Live Production & Webhook (@clasp v2):
  + Micro-LMS Học Viên: https://delivering-happiness.vercel.app/lms/index.html (Deployment commit c856558 - Symmetrical 2x2 grid & Clean Titles).
  + Apollo Full Dashboard (18 Cột): https://dhm-admin-full.vercel.app (HTTP 200, 70 học viên).
  + Apollo 6-Station IAM v2: https://team-happiness-iam-v2.vercel.app (HTTP 200).
  + Google Apps Script Webhook Live: https://script.google.com/macros/s/AKfycbwF-KrHVdDwopgjqyvxTqwcrmSAGZWqFk8-ZT2216Sr6Y7kLzkdxf5CIQ6hVAZ7PiwAlA/exec
  + Google Sheets Trung Tâm: 1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak ('Tổng Hợp Học Viên'!A1:AK1).

2. CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH & KIỂM CHỨNG THỰC TẾ (LIVE DONE 100%):
- Chuẩn Hóa Lộ Trình Chặng 1 Đối Xứng Lưới 2x2 Cân Bằng (2026-10-23):
  + Thay thế flex flex-wrap lệch dòng bằng lưới cố định: grid grid-cols-2 sm:grid-cols-4 gap-2 w-full.
  + Trên mobile: hiển thị chuẩn 2 hàng x 2 cột (mỗi hàng đúng 2 thẻ, cân xứng tuyệt đối 50%-50%).
  + Trên desktop: hiển thị dàn đều 1 hàng x 4 cột thẳng tắp.
  + Tinh gọn nhãn thẻ Checkpoint 1 thành "Đúc Kết I • A • M" cân bằng hoàn hảo độ dài ký tự (~17-20 ký tự).
- Triệt Tiêu Số Bài 1.1 / 1.2 & Nâng Cấp Bộ Icon Sang Trọng (2026-10-23):
  + Bỏ hoàn toàn tiền tố "Bài 1.1: " và "Bài 1.2: " trong accordion headers, navigation sub-sections và curriculum_data.json.
  + Thay thế huy hiệu 1.1 và 1.2 bằng icon thương hiệu cao cấp: 🌟 (3 Cấp Độ Hạnh Phúc) và 🧭 (La Bàn Giá Trị Cá Nhân - Me Values), đồng bộ với 📍 (Đúc Kết I•A•M) và 🎯 (Cổng Sát Hạch).
  + Bỏ cụm từ "sau Bài 1.1 & Bài 1.2" trong nhãn phụ phản tư.
- Đồng Bộ Tuyệt Đối Phạm Vi Sư Phạm Chặng 1 & Rà Soát Wording (2026-10-23):
  + Tinh gọn Chặng 1: Khoa học Hạnh phúc & Me Values; Cổng Sát Hạch Vượt Chặng (≥80%, 10 câu bám sát Slide 12-24).
  + Cắt bỏ hoàn toàn nội dung "3 Đòn bẩy" bị rò rỉ khỏi Chặng 1 (Quick Start Modal & Quiz summary), chuyển về Trạm 0 Chặng 2 giải mã tại lớp cùng Ban Giảng Huấn.
  + Triệt tiêu chữ "Vietnam" bị thêm tùy tiện ở thương hiệu "Culturecode · Kênh Đồng Hành".
  + Đẩy commit c856558 lên nhánh main repo dh4hn-website, Vercel tự động build và deploy sạch 100%.

3. BÀI HỌC XƯƠNG MÁU & QUY TẮC BẤT BIẾN (HARD-WON LESSONS & INVARIANTS):
- Không Thêm Hậu Tố/Địa Danh Bịa Đặt Vào Thương Hiệu (Zero Fabricated Brand Suffixes): Thương hiệu gốc là "Culturecode", cấm tự ý gắn thêm "Vietnam" hay bất kỳ địa danh/hậu tố nào khi nguồn chuẩn không có.
- Ranh Giới Nội Dung Giữa Các Chặng (Cross-Stage Boundary Gate): Nội dung thuộc Chặng 2 (như 3 Đòn Bẩy) tuyệt đối không được xuất hiện trong modal/summary/bài test của Chặng 1.
- Phân Định Rạch Ròi Tên Thói Quen vs Tên Công Cụ (Strict Habit vs Tool Parity Gate - Updated 28/10/2026):
  + Ma Trận 5 Thói Quen Chuẩn: (1) Tỉnh thức (Mindfulness) — SBA (Stop - Breathe - Ask) & Body Scan; (2) Biết ơn (Gratitude) — Thẻ Biết Ơn & 4 Điều Biết Ơn; (3) Vị nhân (Altruism) — Smart Giver Bi-Trí-Dũng & 5-Minute Favors; (4) Phiêu (Flow) — Microflow & Thử thách 4%; (5) Lạc quan (Learned Optimism) — 5 Bước ABCDE Martin Seligman.
  + CẤM TUYỆT ĐỐI liệt kê: "5 thói quen (SCBA, ABCDE, Smart Giver)". Đây là lỗi đánh đồng công cụ thành thói quen và bỏ sót 2 thói quen Biết ơn và Phiêu.
  + Khai tử SCBA làm tên công cụ/thói quen: Kỹ thuật khoảng dừng chuẩn hóa duy nhất là SBA (Stop - Breathe - Ask). SCBA chỉ là câu chuyện cá nhân ca đại phẫu 2018 của Chị An trong case study.
  + Wording chuẩn cho Modal Quyền lợi / Khóa học: "• Tham gia Hành trình rèn luyện 5 thói quen hạnh phúc (Tỉnh thức, Biết ơn, Vị nhân, Phiêu, Lạc quan)."
- Bố Cục Lưới Cố Định Cho Lộ Trình (Symmetric Grid Over Flex-Wrap): Với số lượng mục cố định (ví dụ 4 mục), luôn ưu tiên dùng CSS Grid (grid-cols-2 sm:grid-cols-4) thay vì flex-wrap để tránh lỗi giao diện vỡ hàng bất đối xứng trên thiết bị di động.
- Quy Tắc Che Mờ PII Thuần Việt: Giữ nguyên TÊN CHÍNH Ở CUỐI (L. V. Dũng, P. N. Lài), ẩn SĐT, email giữ chữ cái đầu.
- Cấp Độ 3 Phê Duyệt Triển Khai: Mọi thao tác deploy production, xóa dữ liệu hoặc can thiệp hạ tầng bắt buộc phải có câu quote phê duyệt Cấp độ 3 trực tiếp từ User.
- Absolute Path & Clickable Link Rule: Mọi đường dẫn tuyệt đối khi xuất ra phải đặt trong từng khối mã text độc lập kèm link markdown clickable file:/// ngay bên dưới.

4. NHIỆM VỤ TIẾP THEO CẦN LÀM NGAY (IMMEDIATE NEXT STEPS):
- Rà soát toàn diện Responsive & UI/UX theo tiêu chuẩn /ck:ui-ux-pro-max trên toàn bộ các trang và modal của LMS (Chặng 1, 2, 3).
- Cào dữ liệu từ NotebookLM DHM7 để lấy lý thuyết cốt lõi & ví dụ thực tế bổ sung nội dung text chuyên sâu cho từng bài của 3 chặng.
- Hãy xác nhận đã nạp đầy đủ bối cảnh trên và sẵn sàng nhận lệnh tiếp theo từ sếp!
```

### ⚡ Cập Nhật Chuẩn Hóa Sư Phạm 3 Chặng & Lệnh Cấm 21/30 Ngày (22/10/2026):
1. **Source of Truth Quyết Định (Sếp Dzũ & Chị Châu 22/10/2026):**
   - **Chặng 1 — Khởi động với hạnh phúc** (Pre-Class Online & Webinar)
   - **Chặng 2 — Gieo thói quen hạnh phúc** (Workshop Offline trực tiếp — Chuyển 3 Đòn Bẩy sang Offline cùng 5 Thói Quen)
   - **Chặng 3 — Tiếp nối hành trình hạnh phúc** (Đồng hành chuyển hóa cùng Micro-LMS & Habit Tracker)
2. **Lệnh Cấm Tuyệt Đối Cột Mốc 21 Ngày / 30 Ngày:** CẤM TUYỆT ĐỐI nhắc đến hoặc đóng khung thời gian "21 ngày" hay "30 ngày" trong Chặng 3 trên tất cả tài liệu, giao diện LMS, Landing Page, bài đăng LinkedIn và kịch bản Email của dự án.
