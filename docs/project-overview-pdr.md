# Project Overview & PDR (Project Description Record)

## 🎯 Mục Tiêu (Objectives)
Chuẩn bị đầy đủ, chính xác và đồng bộ hóa tài liệu slide giảng dạy (PowerPoint), tài liệu nghiên cứu chuyên sâu, khung khảo sát, ứng dụng thu hoạch trạm I•A•M và kịch bản chi tiết cho ban giảng huấn của chương trình Delivering Happiness (DH8, DHM4, Inhouse B2B, DHM10, Cohort Apollo).
- **Tiêu chuẩn chất lượng:** Dịch thuật sát nghĩa chuyên môn, đúng slide, đúng kịch bản phân vai của từng giảng viên; gắn kết các lý thuyết học thuật tiêu chuẩn (Self-Determination Theory, Systems Thinking / Emergence, ABCDE Optimism, Flow/Microflow) với triết lý văn hóa Zappos (Tony Hsieh).
- **Tối ưu vận hành & B2B Customization:** Phát triển ứng dụng thu hoạch trạm trực tuyến thời gian thực (Team Happiness 6-Station IAM v2), Cổng Quản trị Ban Giảng Huấn lớn (`admin.html`), khung khảo sát 10 câu (10Q Assessment) và các phân hệ hỗ trợ lớp học trực tiếp.
- **Ranh giới bằng chứng:** Phân biệt rõ `VERIFIED`, `INFERRED`, `PROPOSAL` và `UNVERIFIED`; bản thảo nội bộ không được tự động nâng thành nghiên cứu học thuật, thang đo hợp lệ hoặc kết quả nhân quả.

## 👥 Phân Vai Giảng Dạy & Ban Giảng Huấn (Faculty)
- **Cô / Chị Hà Minh Châu (Lead Facilitator):** Phụ trách Phá băng (cùng Hưng), Thỏa thuận văn hóa (cùng Hân), Định nghĩa La bàn & Đồng hồ, Thói quen Vị nhân (Altruism).
- **Cô Hà Ngọc Hoàn (Facilitator / BTC):** Phụ trách Điều phối vận hành, hợp nhất giáo trình và kế hoạch bài giảng (Sequencing & Lesson Plan).
- **Thầy Vũ Hoàng (Facilitator):** Phụ trách Khoa học Hạnh phúc (3 cấp độ HP), Giá trị La bàn Me Values (Thực hành), Cảm giác Tiến bộ, Thói quen Lạc quan (ABCDE), Thói quen Phiêu (Flow/Microflow & WBS).
- **Thầy / Anh Hưng (Facilitator):** Phụ trách Phá băng (cùng Châu), Cảm giác Kết nối, Cảm giác Tự chủ, Tổng kết 3 đòn bẩy, Thói quen Tỉnh thức & Khoảng dừng SBA.
- **Cô Vũ Khánh Linh (Facilitator / Điều phối):** L&OD Lead M Village, phụ trách Điều phối bài giảng, hỗ trợ học viên và quản trị hệ thống Blended LMS.
- **Cô / Chị Hân (Facilitator):** Phụ trách Thỏa thuận văn hóa (cùng Châu), Thói quen Biết ơn (4 Điều biết ơn & Gratitude Cards).

## 💻 Hệ Thống Đào Tạo Kết Hợp & Bộ Ứng Dụng Thu Hoạch (Blended Learning & Apps)
Nền tảng đào tạo Delivering Happiness Blended Learning 3 Chặng kết nối chặt chẽ giữa học trực tuyến và lớp học trực tiếp:
- **Chặng 1 (Online — Khởi Động Với Hạnh Phúc & Trải Nghiệm Học Thử):** Nghiên cứu nền tảng Khoa học Hạnh phúc & Định vị La Bàn Giá Trị Cá Nhân (Me Values), vượt qua Cổng Sát Hạch Vượt Chặng (Qualifying Gate Quiz) 10 câu bám sát Slide 12–24 (≥ 80% sau tối đa 3 lần thử) để đủ điều kiện lên lớp. Hỗ trợ luồng Đăng ký học thử Chặng 1 trực tiếp cho người mới qua nút chuyển đổi `#btn-toggle-newcomer-trial` và nhận Magic Link kích hoạt email qua Webhook.
- **Chặng 2 (Offline — Gieo Thói Quen Hạnh Phúc):** Workshop Live mở đầu với Trạm 0 — 3 Đòn Bẩy Nơi Làm Việc (Thuyết Tự Quyết SDT — Edward Deci & Richard Ryan, 2000: Tự chủ, Tiến bộ, Kết nối); tiếp nối bằng Xưởng thực hành 5 Thói quen Hạnh phúc (Tỉnh thức SBA, Biết ơn, Lạc quan ABCDE, Phiêu Flow, Vị nhân) và Thu hoạch Đúc Kết & Chuyển Hóa (Trạm 2.6 Capstone I•A•M).
- **Chặng 3 (Action Learning — Tiếp Nối Hành Trình Hạnh Phúc):** Kế thừa toàn bộ chất liệu Chặng 1 & 2, nuôi dưỡng thói quen bền bỉ với Habit Tracker Grid (5 thói quen M-G-O-F-A), Khối Accordion Hướng Dẫn & Chú Giải 5 Thói Quen, tính toán Chuỗi thói quen (Streak Engine), đúc kết Weekly Check-in I•A•M và nút Đồng bộ tiến độ về Google Sheets CRM (gỡ bỏ hoàn toàn việc đóng khung thời gian cố định 21 hay 30 ngày).

### Ứng Dụng Thu Hoạch Trạm I•A•M Apollo v2 (`team-happiness-iam-v2`)
- **Nhận diện thương hiệu & Thông điệp:** Chuẩn hóa thương hiệu `TEAM HAPPINESS`, gỡ bỏ hoàn toàn từ ngữ bịa đặt (`DEDICATED`) và text kỹ thuật thừa (`Đồng bộ Sheet cũ`).
- **Giao diện Hero:** *"Chào mừng bạn đến với hệ thống thu hoạch 6 Trạm I • A • M. Hãy nhập trực tiếp cảm nhận & kế hoạch hành động vào 6 trạm theo tiến độ lớp học và hướng dẫn của Giảng viên."*
- **Dashboard Giảng Viên 18 Cột:** Tối ưu hóa hiển thị bảng ma trận 18 cột x 155px có `line-clamp-3` (3 dòng), cột tên cố định 180px, gỡ bỏ `sticky` trên mobile để cuộn ngang mượt mà.
- **Hệ thống IAM v1 (`team-happiness-iam`):** Tạm đóng an toàn đến 20/10/2026 với màn hình thông báo sang trọng và auto-redirect 4 giây sang v2; gắn tag Git `backup_iam1_full_pre_pause_20261012`.

### Cổng Quản Trị Ban Giảng Huấn (`dhm-micro-lms/admin.html`)
- Bảo toàn trọn vẹn toàn bộ tính năng: Quản lý học viên, chấm bài tập ABCDE, duyệt bài test sát hạch 80%, Heatmap lớp học, Cohort Analytics. Chuẩn hóa 100% câu từ dashboard theo Source of Truth: chuyển toàn bộ tên trạm sang số thứ tự thuần túy `Trạm 1` .. `Trạm 6` (hoặc `TRẠM 1` .. `TRẠM 6` ở tiêu đề bảng), xóa bỏ hoàn toàn các tên trạm do AI tự bịa (`Mindset`, `Leadership`...) theo phản ánh của Chị Châu, khắc phục triệt để lỗi rò rỉ dữ liệu Trạm 1 sang Trạm 6 trong Tab 5 và đảm bảo modal quản lý luôn render trọn vẹn đủ 6 thẻ trạm. Xóa bỏ text chân trang bịa đặt, cách ly công cụ chẩn đoán kỹ thuật vào ngăn kéo ẩn `#dev-tools-panel`, đồng bộ ngầm 60s tĩnh lặng và bổ sung `min-w-[950px]` cho bảng trạm Tab 2 phục vụ hiển thị trên mobile.

## 🛠️ Công Nghệ & Công Cụ Sử Dụng
- **Frontend SPA & Micro-LMS:** React 19, TypeScript, Tailwind CSS, Vite (hoặc Vanilla JS + Tailwind CDN cho LMS portal).
- **Backend & Đồng bộ dữ liệu:** Google Apps Script Webhook (@79), Google Sheets API (CRM & Apollo IAM Sheet).
- **Ngôn ngữ xử lý tài liệu:** Python 3.12+ (`python-pptx`, `reportlab`, `PyPDF2`).
- **Kiểm thử tự động:** Playwright / Puppeteer E2E Testing.
- **Hạ tầng triển khai:** Vercel Production Serverless.
