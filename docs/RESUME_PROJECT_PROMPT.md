# RESUME PROJECT PROMPT (BÀN GIAO & TIẾP TỤC DỰ ÁN 1-CHẠM)

> **Mục đích:** Sao chép toàn bộ khối mã `text` bên dưới và dán vào một **Cuộc hội thoại mới (New Chat)** để tiếp tục dự án ngay lập tức mà không sợ tràn context window hay mất bối cảnh kỹ thuật.

```text
gemini nói:
Tôi đang tiếp tục dự án Delivering Happiness Masterclass (DHM Blended Learning LMS, Team Happiness 6-Station IAM v2 App, Admin Portal, TKI & Social Styles Surveys, Core Values, ABCDE Practice, Apps Script Auth Gate, SePay Webhook Proxy & DHM10 TP.HCM Operations).
Hãy nạp toàn bộ bối cảnh kỹ thuật, trạng thái đã hoàn thành và các quy tắc bất biến dưới đây để tiếp tục công việc ngay lập tức:

1. WORKSPACE & COMPREHENSIVE SOURCE OF TRUTH (5 TẦNG NGUỒN CHUẨN ĐẦY ĐỦ - VERIFIED 2026-10-23):
- Tầng 1: Slide & Tài Liệu Sư Phạm Gốc (Original Pedagogy & Design Truth):
  * Slide bài giảng DHM gốc: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\
  * Slide master v11: G:\My Drive\download\Team_Happiness_R11 For Apollo.pptx
  * Slide 96 (4 Phong Cách Xã Hội), Slide 94 (Khung Năng Lực Cảm Xúc), Slide 81-82 (TKI 5 Phong Cách Xử Lý Xung Đột), Slide 98 (La Bàn Giá Trị & Cam Kết Hành Động).
  * Quy tắc chép nguyên văn nhãn chữ từ slide: Strict Minimal Slide Copy & Zero Fluff Rule (chữ trên slide sao chép 100%, cấm gộp tên tiếng Anh, cấm chèn linh vật từ slide khác).
- Tầng 2: Bộ Tài Liệu Chuẩn Dự Án (Standard Docs Suite trong ./docs/):
  * PDR & Yêu cầu: docs/project-overview-pdr.md
  * Sơ đồ kiến trúc toàn hệ thống: docs/system-architecture.md
  * Tóm tắt Codebase & Directory Map: docs/codebase-summary.md
  * Quy chuẩn mã nguồn & Bảng màu: docs/code-standards.md
  * Lộ trình dự án & Milestones: docs/project-roadmap.md
  * Hướng dẫn triển khai & Rollback: docs/deployment-guide.md
  * Triết lý thiết kế phẳng & Typography: docs/design-guidelines.md
  * Master prompt đóng gói skill: docs/PROMPT_DONG_GOI_SKILL.md
- Tầng 3: Quy Tắc Hệ Thống & Kỹ Năng Toàn Cục (System Rules & Global Skills):
  * AGENTS.md: C:\Users\vu.hoang\.gemini\config\AGENTS.md (Mục 0-5: Chống Vendor Lock-in, Search-First, Webhook Safety, Holistic Audit).
  * Shared Agent Rules: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md (Rule 18: Post-Deployment Live Test Data Purge Gate, Approval Quote Completeness Gate).
  * Project Rules: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\.agents\AGENTS.md (Mirror planning artifacts, chuẩn hóa format email CultureCode Team, Dual Path Format, Hard Gate Message ID thật, Khóa Production Vercel).
  * Global Skills: dhm-blended-lms, package-project, brain-save, windows-uat.
- Tầng 4: Tệp Mã Nguồn & CSDL Nòng Cốt (Core Codebase & Datasets):
  * Thư mục mã nguồn Website chính: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
  * Thư mục dự án Teaching DH: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH
  * Thư mục TKI Khảo Sát Xung Đột (React Vite): C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-xung-dot-tki
  * Thư mục Social Styles Khảo Sát Tính Cách (React Vite): C:\Users\vu.hoang\.gemini\antigravity\scratch\khao-sat-tinh-cach
  * Thư mục Apollo 6 Trạm I•A•M v2: C:\Users\vu.hoang\.gemini\antigravity\scratch\team-happiness-iam-v2
  * Backend Apps Script Webhook (@84): Scripts/active_code_gs_final.js (Script ID: 1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS)
  * Webhook Proxy Vercel: Artifacts/dhm8_sepay_proxy_vercel/ (Project: dhm8-sepay-proxy)
  * Đăng ký DHM10 Frontend: register_dhm10.js & register_dhm10.html (kèm bản sao release_package/)
  * Trang chủ Website: index.html (kèm bản sao release_package/index.html)
  * Google Sheets Dữ Liệu Trung Tâm:
    + CSDL Vận Hành DHM (Đăng ký, Payments, Outbox): 1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA
    + CSDL Thu Hoạch IAM Apollo 6 Trạm: 1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak
- Tầng 5: Môi Trường Live & Phân Quyền (Production Live & Scopes):
  * Website Landing Page & Đăng ký: https://delivering-happiness.vercel.app/ (Deployment ID: dpl_DNCLqYW3MjUqj9YF2tyF6mCaUcJo)
  * Đăng ký DHM10 TP.HCM: https://delivering-happiness.vercel.app/register_dhm10.html
  * Cổng Giữ Chỗ Next DHM (Hà Nội): https://delivering-happiness.vercel.app/next_dhm.html
  * Webhook Proxy SePay: https://dhm8-sepay-proxy.vercel.app/api/sepay-dh?token=DHM8_SECURE_2026
  * Google Apps Script Webhook Live (@84): https://script.google.com/macros/s/AKfycbw6XcQgf367Uusg4CKBV3cA6NWRWHfEi3RGLKf5NIIMmpYqkf0AQdTTNYBdO-wJmjzHvw/exec
  * Cổng Quản Trị LMS Ban Giảng Huấn: https://delivering-happiness.vercel.app/lms/admin.html (PIN: 1234)
  * Tài khoản gửi mail chiến dịch: culturecodeproject@gmail.com (CẤM dùng mail cá nhân).

2. CÁC TÍNH NĂNG ĐÃ HOÀN THÀNH & KIỂM CHỨNG THỰC TẾ (LIVE DONE 100%):
- Tinh Chỉnh 3 Điểm Nội Dung Landing Page & Staged Promote Live Vercel (22/10/2026):
  + Loại bỏ hoàn toàn khối levers-note ('Ba đòn bẩy → 5 thói quen...').
  + Cập nhật Thói quen Lạc quan (Optimism): 'Optimism — Nhìn nhận cơ hội trong thách thức thông qua công cụ tái tư duy ABCDE.'
  + Tinh giản Thói quen Vị nhân (Altruism): 'Altruism — Cho đi thông minh (Giver) để tạo ra giá trị chung lớn nhất.' và xóa sạch khối rườm rà phân biệt 3 nhóm.
  + Quy trình Staged Deploy (dpl_DNCLqYW3MjUqj9YF2tyF6mCaUcJo) & Promote lên delivering-happiness.vercel.app, HTTP read-back assertion trực tiếp đạt 100% PASS trên tất cả các route sống còn (/, /register_dhm10.html, /next_dhm.html, /personal-value.html).
- Chuyển Đổi Mô Hình DHM10 Sang Blended LMS & Tách Bạch 2 Miền (21-22/10/2026):
  + Landing Page (index.html): Cập nhật banner "🚀 CỘT MỐC SỐ 10 — ĐỘT PHÁ MÔ HÌNH ĐÀO TẠO KẾT HỢP BLENDED LMS", chuyển địa điểm Hà Nội sang "Apollo English - Phố Huế (Dự kiến DHM11)", loại bỏ hoàn toàn "Giảng viên cơ hữu đồng hành thực chiến", chuẩn hóa dòng đồng hành thành "📱 Nền tảng Micro-LMS và công cụ đồng hành để tiếp nối hành trình hạnh phúc".
  + Form Đăng Ký (register_dhm10.html): Chi phí hậu cần cập nhật chuẩn: "Bao gồm: Session Webinar khởi động, LMS, Tài liệu chuyên sâu, Ăn trưa và 02 tiệc Teabreak cho 1 ngày offline trọn vẹn và công cụ thực hành tiếp nối.", bổ sung thẻ chọn điều hướng cho Hà Nội (Apollo English - Phố Huế) dẫn sang next_dhm.html.
  + Popup Modal & Logic (register_dhm10.js): Sửa triệt để popup thanh toán thành công thành "nhóm Zalo DHM10 TP.HCM" và nút "Vào nhóm Zalo DHM10 TP.HCM", cờ tracking Web_DHM10_HCM_Official (xóa bỏ 100% chữ "Hà Nội" trong modal sau thanh toán).
  + Thống kê & Báo cáo Quan tâm DHM10: Lọc và xuất file danh sách 44 học viên quan tâm Hà Nội (10 Termo + 34 ngoài Termo), gửi qua Drive & Gmail API (Message ID: 1a15ce401d11b4bc).
  + Truyền thông: Soạn thảo 2 bản thông điệp chuẩn mực (Bản tin Zalo/Group và Bài đăng LinkedIn) định vị mô hình Blended LMS tại TP.HCM (35 suất) và hẹn lại Hà Nội tại Apollo English - Phố Huế.
- Tái Cấu Trúc Bộ 10 Câu Hỏi Cổng Sát Hạch Chặng 1 Bám Sát Slide 12-24, Chuyển 3 Đòn Bẩy Sang Trạm 0 Chặng 2 & Chuẩn Hóa Ma Trận 20 Điểm Wording Sư Phạm KISS (23/10/2026):
  + Bộ 10 câu bám sát Slide 12-24: Q1 Aristotle, Q2 Flow, Q3 Higher Purpose, Q4 3 Tầng Lầu, Q5 Lan tỏa Me-We-Community, Q6 3 Cấp độ Seligman, Q7 Tony Hsieh, Q8 Me Values, Q9 La Bàn Trade-off, Q10 Hedonic Adaptation.
  + Ma trận wording KISS: Capstone Chặng 2 'Đúc Kết & Chuyển Hóa', Cổng Sát Hạch Vượt Chặng (≥80%), Huy hiệu Chặng 1 '⏱ Trực Tuyến Tự Điều Tốc', Trạm Chặng 2 '🎯 Trạm Thực Hành 5 Thói Quen Hạnh Phúc', triệt tiêu tiếng lóng hè phố.
- Toàn Bộ Hệ Thống Đăng Ký & Webhook SePay Tự Động: Đã thông luồng 100% từ đăng ký -> SePay -> Sheet -> kích hoạt LMS & vé điện tử.

3. BÀI HỌC XƯƠNG MÁU & QUY TẮC BẤT BIẾN (HARD-WON LESSONS & INVARIANTS):
- Bài học #1 (Kiểm toán Template Literal / JS Injected DOM): Khi đổi thông tin sự kiện/địa điểm, không bao giờ chỉ sửa HTML tĩnh. BẮT BUỘC phải grep toàn bộ file .js để sửa text hardcode trong các hàm sinh DOM động (ensurePaidModal, alert, toast, tracking tags) tránh để lọt text cũ.
- Bài học #2 (Ranh giới Local vs Live & Quy trình Phê duyệt 2-Cấp độ Tự Đủ): Khi sửa giao diện, luôn nêu rõ "Đã sửa Local, CHƯA phản ánh trên Live". Cấp độ 2 duyệt plan trước khi sửa file, Cấp độ 3 duyệt Staged deploy & promote; toàn bộ command, target, scope và rollback phải nằm trọn trong 1 khối mã text tự đủ để User bấm Copy 1 lần.
- Bài học #3 (Vercel Preview Deployment Protection): Các preview URLs (*.vercel.app phụ) khi deploy với --skip-domain có thể bị Vercel Deployment Protection chuyển hướng về màn hình SSO Login. Verification phải thực hiện qua public alias đã bypass hoặc xác minh ngay sau khi promote lên tên miền chính thức delivering-happiness.vercel.app.
- Bài học #4 (Hard Gate Message ID thật): Không claim gửi email thành công nếu chưa có chuỗi Google Message ID thật (^1a[0-9a-f]{14,}$) từ máy chủ Gmail.
- Bài học #5 (Brand Voice): 100% "CultureCode Team", cấm "Ban tổ chức" / "BTC". Sender luôn là culturecodeproject@gmail.com.
- Bài học #6 (Lệnh Cấm Tuyệt Đối 21 Ngày / 30 Ngày): CẤM TUYỆT ĐỐI nhắc đến hoặc đóng khung thời gian "21 ngày" hay "30 ngày" trong Chặng 3 trên tất cả tài liệu, giao diện LMS, Landing Page, bài đăng LinkedIn và kịch bản Email của dự án.

4. NHIỆM VỤ TIẾP THEO CẦN LÀM NGAY (IMMEDIATE NEXT STEPS):
- Giám sát luồng đăng ký 35 suất DHM10 TP.HCM và các đăng ký giữ chỗ Hà Nội tại next_dhm.html trên hệ thống Live.
- Kiểm tra tính ổn định của các kịch bản email tự động khi có học viên mới thanh toán qua SePay vào tài khoản TP.HCM.
- Hãy xác nhận đã nạp đầy đủ bối cảnh trên và sẵn sàng nhận lệnh tiếp theo từ Sếp!
```
