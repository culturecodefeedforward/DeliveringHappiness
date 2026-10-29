# RESUME PROJECT PROMPT (BÀN GIAO & TIẾP TỤC DỰ ÁN 1-CHẠM)

> **Mục đích:** Sao chép toàn bộ khối mã `text` bên dưới và dán vào một **Cuộc hội thoại mới (New Chat)** để tiếp tục dự án ngay lập tức mà không sợ tràn context window hay mất bối cảnh kỹ thuật.

```text
gemini nói:
Tôi đang tiếp tục dự án Delivering Happiness Masterclass (DHM Blended Learning LMS 3 Chặng, Team Happiness 6-Station IAM v2 App, Apollo Dedicated Admin Dashboard 18-Columns, TKI & Social Styles Surveys, Core Values, ABCDE Practice, Apps Script Auth Gate & Teaching Materials).
Hãy nạp toàn bộ bối cảnh kỹ thuật, trạng thái đã hoàn thành và các quy tắc bất biến dưới đây để tiếp tục công việc ngay lập tức:

1. ĐỊNH VỊ TÀI NGUYÊN & 5 TẦNG SOURCE OF TRUTH (VERIFIED 2026-10-29):
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
  + Quy tắc kiến trúc & an toàn: C:\Users\vu.hoang\.gemini\config\AGENTS.md (Mục 0, 1, 4, 5.A, 7, 8, 9, 19).
  + Quy tắc dùng chung: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md (Ratio-Count Conflation Guard, Zero Fabricated Tangible Rewards, Zero Infrastructure Jargon on UI, Primary vs Supplementary Resources Deduplication Gate).
  + Global Skills cốt lõi: C:\Users\vu.hoang\.gemini\config\skills\dhm-blended-lms\SKILL.md, ui-ux-pro-max\SKILL.md, package-project\SKILL.md, deploy\SKILL.md.
- Tầng 4 - Tệp Mã Nguồn & CSDL Nòng Cốt:
  + Kho lưu trữ LMS Website chính: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website (lms/index.html, lms/app.js, lms/curriculum_data.json, lms/authorized_roster.json).
  + Kho lưu trữ LMS Giảng huấn: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms (đồng bộ 100% với dh4hn-website/lms).
  + Apollo Full Dashboard (18 Cột): C:\Users\vu.hoang\.gemini\antigravity\scratch\dhm-admin-full (index.html, generate_app.py, apollo_heatmap_data.json).
  + Apollo 6-Trạm IAM v2 (React Vite): C:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam-v2 (src/data/stationsData.ts, src/components/StationCard.tsx, apps_script/Code.js).
- Tầng 5 - Môi Trường Live Production & Webhook (@clasp v2):
  + Micro-LMS Học Viên: https://delivering-happiness.vercel.app/lms/index.html (Deployment commit cbe335e - Verified Live HTTP 200).
  + Apollo Full Dashboard (18 Cột): https://dhm-admin-full.vercel.app (HTTP 200, 70 học viên).
  + Apollo 6-Station IAM v2: https://team-happiness-iam-v2.vercel.app (HTTP 200).
  + Google Apps Script Webhook Live: https://script.google.com/macros/s/AKfycbwF-KrHVdDwopgjqyvxTqwcrmSAGZWqFk8-ZT2216Sr6Y7kLzkdxf5CIQ6hVAZ7PiwAlA/exec
  + Google Sheets Trung Tâm: 1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak ('Tổng Hợp Học Viên'!A1:AK1).

2. CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH & KIỂM CHỨNG THỰC TẾ (LIVE DONE 100% - COMMIT cbe335e 2026-10-29):
- Vá Lỗi Logic Hiển Thị Cổng Sát Hạch Chặng 1:
  + Sửa triệt để lỗi đánh đồng biến số câu đúng với tỷ lệ phần trăm (nguyên nhân gây hiển thị 9% • 1/10 câu đúng dù học viên làm đúng 9/10 câu và đã vượt cổng).
  + Chuẩn hóa 2 biến độc lập rawScore và rawPct; hiển thị chính xác 90% và 9/10 câu đúng cả trên giao diện Drawer và báo cáo Markdown cá nhân.
- Tái Cấu Trúc Kho Audio Bài Giảng:
  + Di chuyển khối audio player từ vị trí rời rạc bên ngoài vào bên trong tab "Xem thêm" (#tab-resources, phía trên #resources-grid-container).
  + Tự động kích hoạt chuyển tab "Xem thêm" và cuộn mượt mà khi học viên bấm nút nghe audio thói quen (.btn-play-habit-audio) tại bất kỳ bài giảng nào.
- Lọc Bỏ Triệt Để Slide Trùng Lặp Giữa Bài Giảng & Tab "Xem thêm":
  + Chặng 1: Loại bỏ Slide 14 & 18 khỏi resources do đã được nhúng tại Module 1.1 và Module 1.2 bên ngoài. Giữ lại Slide 04, 09, 19, 20.
  + Chặng 2A & 2B: Loại bỏ Slide 31 & 38 khỏi resources do đã có ở Trạm 1 và Trạm 2 bên ngoài. Giữ lại Slide 25 và 29.
- Xóa Bỏ Quà Tặng Hiện Vật Bịa Đặt & Chuẩn Hóa Phần Thưởng Số:
  + Xóa bỏ cam kết hiện vật vật lý "Bộ Thẻ Bỏ Túi 5 Thói Quen (In Màu Ép Kim) do BTC gửi tặng tận tay" ở mốc 700 điểm (tier-silver).
  + Chuẩn hóa thành: "Bộ Thẻ Số & Cẩm Nang 5 Thói Quen Hạnh Phúc (Digital Flashcards)" kèm câu hỏi phản tư định dạng PDF/trực tuyến.
- Thanh Lọc Toàn Diện Từ Khóa "21 Ngày" & Diễn Giải Kỹ Thuật Nội Bộ:
  + Tab 3 Kho lưu trữ đổi thành: 🎯 Thói Quen & Huy Hiệu.
  + Thẻ đồng bộ đổi thành: Đồng Bộ Học Tập Cá Nhân (loại bỏ phơi bày Google Sheets, CSDL trung tâm, bộ đệm 60s).
  + Placeholder tuần 3 và meta description đã làm sạch từ khóa 21 ngày theo chỉ đạo Ban Giảng Huấn.

3. BÀI HỌC XƯƠNG MÁU & QUY TẮC BẤT BIẾN (HARD-WON LESSONS & INVARIANTS):
- Phân Định Rạch Ròi Biến Số Đếm vs Tỷ Lệ % (Ratio-Count Conflation Guard): Cấm lấy biến lưu số lượng tuyệt đối (score = 9) rồi tùy tiện gắn đuôi % thành 9%, rồi lại chia 100 tính ngược thành 1/10 câu đúng. Luôn duy trì 2 biến count và percentage độc lập kèm chốt kiểm toán assertion guard.
- Cấm Bịa Đặt Quà Tặng Vật Lý & Cam Kết Ngoại Vi (No Fabricated Tangible Rewards): Cấm tự ý hứa hẹn quà hiện vật in ấn, cúp pha lê hay hỗ trợ 1-on-1 ngoài đời thực. Mọi phần thưởng trong hệ thống số mặc định 100% là tài sản số (Digital Flashcards, Ebook, Chứng nhận số).
- Thanh Lọc Thuật Ngữ Hạ Tầng Khỏi Giao Diện Người Học (Zero Infrastructure Jargon on UI): Giao diện người dùng cuối phải tuyệt đối tuân thủ KISS; cấm phơi bày tên dịch vụ lưu trữ (Google Sheets), cơ chế throttle, timeout hay schema DB.
- Khử Trùng Lặp Tài Nguyên Phụ Trợ vs Bài Giảng Cốt Lõi (Set Intersection Gate): Mọi slide/ảnh đã xuất hiện trong bài giảng chính bắt buộc phải bị loại bỏ khỏi tab "Xem thêm" (core ∩ supplementary == ∅).
- Lệnh Cấm Tuyệt Đối 21 Ngày / 30 Ngày (No Arbitrary Timeline Canonization): Khóa học là hành trình rèn luyện thói quen chuyển hóa mở, cấm đóng khung cứng nhắc vào mốc 21 ngày hay 30 ngày.

4. NHIỆM VỤ TIẾP THEO CẦN LÀM NGAY (IMMEDIATE NEXT STEPS):
- Rà soát toàn diện Responsive trên thiết bị di động cho Tab "Xem thêm" khi mở Audio Player kết hợp lưới tài liệu bổ trợ.
- Tiếp tục cào dữ liệu từ NotebookLM DHM7 để bổ sung case study thực tế và câu hỏi tự vấn chuyên sâu cho các thói quen Chặng 2 và Chặng 3.
- Hãy xác nhận đã nạp đầy đủ bối cảnh trên và sẵn sàng nhận lệnh tiếp theo từ sếp!
```
