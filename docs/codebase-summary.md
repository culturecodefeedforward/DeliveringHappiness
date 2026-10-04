# 📂 Tóm tắt Codebase (Codebase Summary)

Thư mục gốc chứa các trang tĩnh, API serverless, mã Apps Script, tài liệu và artifact kiểm chứng. Danh mục này mô tả source hiện có, không chứng minh trạng thái live.

## 1. Các trang giao diện chính (Core UI Pages)
*   `index.html`: Trang chủ và các CTA (Call to Action - nút kêu gọi hành động). Nội dung lịch/CTA biến động phải được khóa bằng release contract thay vì chép cứng vào tài liệu.
*   `register.html` / `register_direct.html` / `register-test.html`: Biểu mẫu đăng ký native cho khóa học Delivering Happiness Masterclass 8 (DHM8). Hỗ trợ hiển thị mã VietQR động và điền nhanh thông tin.
*   `register_dh9_hanoi.html`: Biểu mẫu đăng ký dành riêng cho Delivering Happiness Masterclass 9 (DHM9) tại Hà Nội.
*   `register_cc101.html`: Biểu mẫu đăng ký cho khóa học CultureCode 101.
*   `register_nvc.html`: Biểu mẫu đăng ký cho khóa học Nonviolent Communication (NVC).
*   `personal-value.html`: Giao diện La bàn Giá trị Cá nhân (Personal Value Compass). Ứng dụng Glassmorphism UI cao cấp cho phép người dùng tự khảo sát giá trị cốt lõi, so sánh đối đầu trực tiếp, hiển thị kết quả biểu đồ mạng nhện và xuất báo cáo PDF.
*   `assessment.html`: Trang khảo sát/đánh giá nhu cầu học tập ban đầu.
*   `practice-abcde.html`: Trang thực hành Lạc quan ABCDE tương tác độc lập dành cho học viên quét mã QR từ slide bài giảng.
*   `program-interest.html`: Trang trung tâm ghi nhận quan tâm cho DHM8, DHM9, NVC và AI. Người dùng nhập thông tin chung một lần, chọn một hoặc nhiều chương trình và mở phần câu hỏi riêng; đây không phải đăng ký chính thức, giữ chỗ hay thanh toán.
*   `interest.html` / `interest_dh9.html`: Trang ghi nhận thông tin bày tỏ sự quan tâm của học viên khi các lớp học đã đủ chỉ tiêu (Closed).
*   `lms/index.html`: Giao diện ứng dụng Delivering Happiness Blended Learning LMS Engine v3 (Hành Trình Chuyển Hóa Hạnh Phúc 90 phút). Tích hợp modal đăng nhập phân luồng kép (#auth-modal: học viên chính thức vs form học thử Chặng 1 nhận Magic Link tuân thủ Nghị định 13/2023/NĐ-CP), modal khóa cứng nâng cấp Chặng 2 & 3 (#trial-upgrade-modal), nhận diện học viên thời gian thực, cổng sát hạch đầu vào Bài 1.1 (10 câu trắc nghiệm), bộ công cụ 4 thói quen, Bảng theo dõi 21 ngày, thanh điều hướng thu gọn kiểu LinkedIn Learning Desktop (`#btn-collapse-sidebar-desktop`, `#btn-sidebar-desktop-expand`), thanh Resume Learning thông minh (`#btn-header-resume`), modal Quick Start Card (`#modal-quick-start`) và khung 3 Khối Nội Dung (Duy 3-Sections Model).
*   `lms/admin.html`: Cổng quản trị Coach Portal phục vụ giảng viên kiểm tra tiến độ, xem phản tư học viên và điều phối lớp học.
*   `lms_dashboard.html` / `login.html`: Bề mặt LMS tĩnh cũ (đã được thay thế bởi `lms/index.html`).
*   `checkin.html`: Giao diện QR check-in bằng camera; hành vi đọc/ghi Sheet live cần UAT riêng.
*   `dh8/index.html`: Định tuyến tĩnh cho lối tắt `/dh8`.

## 2. Kịch bản logic & CSS (Scripts & Styles)
*   `styles.css` / `quiz.css` / `register.css`: Định nghĩa phong cách giao diện Glassmorphism, CSS Variables, và layout responsive cho toàn bộ trang web.
*   `chat-abcde.css`: Phong cách giao diện hiện đại, glassmorphism và responsive dành riêng cho Chatbox ABCDE Socratic (scoped qua tiền tố `.abcde-*`).
*   `practice-abcde.css`: Phong cách giao diện Glassmorphism responsive cho trang thực hành ABCDE.
*   `register.js` / `register_dh9.js` / `register_direct.js`: Quản lý trạng thái biểu mẫu đăng ký, tính toán mã QR thanh toán động và gọi Webhook gửi dữ liệu CRM qua giao thức JSONP/JSON.
*   `personal-value.js`: Xử lý logic khảo sát La bàn Giá trị Cá nhân.
*   `chat-abcde.js`: Quản lý luồng máy trạng thái hội thoại ABCDE phía client, hiển thị giao diện chat bong bóng và giao tiếp với API backend proxy.
*   `practice-abcde.js`: Xử lý logic hiển thị tình huống thực hành, bóc tách Regex phần B-C-D-E và so sánh side-by-side kết quả với gợi ý chuẩn.
*   `lms/app.js`: Bộ điều khiển trung tâm (Core Controller) của Blended Learning LMS Engine v3. Quản lý xác thực học viên qua Mô hình Đăng nhập Lai (Hybrid Auth Model: tra cứu Roster cho học viên chính thức, kích hoạt Magic Link cho người học thử), xử lý token URL `?token=...&action=verify`, cổng phân quyền nghiêm ngặt khóa cứng Chặng 2/3 đối với tài khoản học thử (Strict Stage Gating), máy trạng thái 3 chặng học, cổng sát hạch đầu vào Bài 1.1 (10 câu hỏi trắc nghiệm, ngưỡng đạt ≥80% (8/10 câu), giới hạn 3 lần thử, lockout an toàn và bypass cho Coaches), bài tập Me Values (41 giá trị), 5 thói quen văn hóa, Bảng theo dõi thói quen 21 ngày (Habit Tracker), chuyển đổi thu gọn Sidebar desktop kèm lưu trữ `localStorage: dhm_sidebar_desktop_collapsed`, hàm Smart Resume Learning (`resumeLearning()`), modal Quick Start Card (`showQuickStartModal()`), tự động thu gọn Hero Quiz Gate khi đậu (`evaluateLearnerStatus()`), mở/đóng accordion bài tập mẫu (`toggleModelAnswer()`), liên kết tự động dữ liệu phản tư và cam kết hành động của cả Stage 1 và Stage 2 (5 Habits) vào `learnerProgress.stageData`, và đánh dấu tích xanh `✓` trực quan cho tiểu mục hoàn thành.
*   `lms/authorized_roster.json`: Danh bạ xác thực 383 học viên và giảng viên được phân quyền truy cập LMS (CSDL hợp nhất từ DHM3 đến DHM9, bao gồm 6 thành viên Ban Giảng Huấn).
*   `lms/master_learners_roster.json`: Cơ sở dữ liệu học viên tổng quát đã chuẩn hóa của Delivering Happiness (383 bản ghi gồm `learner_id`, email, SĐT chuẩn hóa E.164, phân loại tổ chức và trạng thái xác thực).
*   `lms/curriculum_data.json`: Dữ liệu giáo trình Blended LMS 3 chặng học chuẩn hóa, cấu trúc bài giảng video, kho audio, bộ 10 câu hỏi sát hạch đầu vào (DHM Quiz), 3 bộ câu hỏi phản tư I•A•M, và Ngân hàng 8 tình huống thực chiến `practicalScenario` chuẩn hóa cho cả Chặng 1 (3 Đòn Bẩy) và Chặng 2 (5 Thói Quen) trích xuất từ kho bài giảng gốc của Ban Giảng Huấn qua NotebookLM (mỗi tình huống gồm mã `id`, tiêu đề, bối cảnh thực tế `context`, phân tích nguyên lý `facultyAnalysis`, bài tập mẫu gợi ý `modelAnswer`, câu hỏi phản tư `reflectionPrompt` và cam kết hành động `actionPrompt`).
*   `script.js`: Xử lý các hiệu ứng động trên trang chủ (cuộn trang mượt, tương tác micro-animations).
*   `tracking.js`: Bộ theo dõi phân tích hành vi cuộn trang và lượt truy cập của người dùng.
*   `dh4hn_uat.js`: Kịch bản kiểm thử tự động phục vụ UAT trên môi trường local.

## 3. Thư mục và tệp tin bổ sung
*   `docs/`: Nguồn chuẩn cho tài liệu bền vững.
    *   `forms-and-data-destinations.md`: Danh mục tra cứu nhanh toàn diện các biểu mẫu, webhook URLs và Google Sheets đích trong hệ sinh thái DH4HN.
    *   `deployment.md`: Runbook production có package bất biến, staged UAT, promote, kiểm chứng và rollback.
    *   `deployment-guide.md`: Hướng dẫn backend/config và cổng kiểm chứng; không thay thế runbook production.
*   `data/`: Thư mục chứa dữ liệu tĩnh của dự án:
    *   `artifacts/knowledge_base_abcde.json`: Cơ sở dữ liệu tri thức các tình huống thực hành ABCDE định dạng JSON tĩnh (bao gồm cả các case bóc băng từ audio bài giảng).
*   `api/`: Thư mục chứa các API Backend Proxy (Vercel Serverless Functions):
    *   `chat-abcde.js`: API xử lý hội thoại Socratic, kiểm soát passcode, gọi Gemini API (`gemini-3.1-flash-lite`) và ký bảo mật HMAC trước khi chuyển tiếp sang Google Apps Script.
    *   `chat-abcde-rag.js`: API Backend xử lý tìm kiếm truy xuất RAG trên cơ sở dữ liệu tri thức ABCDE.
    *   `sepay-dh.js`: API nhận dữ liệu webhook từ cổng thanh toán SePay để tự động đối soát giao dịch DHM8/DHM9.
*   `Scripts/`: Chứa mã nguồn Apps Script và các script bổ trợ:
    *   `active_code_gs_final.js`: Mã nguồn Apps Script backend chính thống (handling Webhook SePay, ghi CRM Sheets, gửi email đăng ký và xử lý kết quả khảo sát ABCDE/Giá trị Cốt lõi). Luồng `PROGRAM_INTEREST` ghi độc lập vào tab `Program Interest` có 25 cột, chống ghi trùng bằng `interestUuid` và xác nhận qua JSONP `checkProgramInterestStatus`; luồng này không kích hoạt email hoặc thanh toán.
    *   `active_code_gs_rollback.js`: Bản rollback local. Không được giả định file này bị loại khỏi upload; phải xác nhận bằng `clasp status` trước mỗi lần push.
    *   `appsscript_staging_manifest.json`: Tệp manifest cấu hình dự án Apps Script trên GCP.
    *   `dhm8_gate2_uat_runner.js`: Trình chạy kịch bản kiểm thử tích hợp tự động cho backend.
    *   `take_uat_screenshots.py` / `take_local_uat_screenshots.py`: Các script Python tự động hóa việc chụp ảnh màn hình UAT.
    *   `validate_email_template.py`: Kịch bản Python tự động kiểm thử và render các template HTML email.
    *   `build_release_package.js`: Script tạo package từ snapshot Git và manifest provenance.
    *   `verify_vercel_live_gate.js`: Bộ kiểm chứng route/header/browser theo release contract.
*   `release-specs/`: Hợp đồng route cho từng release; release line hiện hành có `dhm10-homepage.json`.
*   `.github/workflows/production-release.yml`: Workflow thủ công để kiểm chứng staged, chờ approval của môi trường production, promote đúng deployment và kiểm chứng lại.
*   `Implementation Plan/`: Lưu trữ kế hoạch chi tiết cho từng giai đoạn cập nhật mã nguồn (phiên bản hóa theo định dạng ngày).
*   `.agents/`: Thư mục cấu hình và prompts nội bộ dành cho các subagents AI hỗ trợ dự án.
*   `Artifacts/`: Thư mục chứa các file xuất (export) hệ thống, tài liệu PDF hoặc JSON được tạo ra tự động trong quá trình chạy.
*   `UAT/`: Chứa kết quả kiểm thử nghiệm thu người dùng (UAT reports) và bằng chứng kiểm thử giao diện thực tế.
*   `.clasp.json`: File cấu hình của clasp để đồng bộ mã nguồn Apps Script với Google Cloud.
*   `.claspignore`: Bộ lọc upload của `clasp`. Nội dung hiện tại phải được đối chiếu với `clasp status`; tài liệu không tự chứng nhận rollback/runner đã bị loại.

## 4. Hai hợp đồng ghi nhận quan tâm

*   `interest.html` gửi `type: DH_INTEREST` cho luồng quan tâm tối giản của DHM8.
*   `program-interest.html` gửi `type: PROGRAM_INTEREST`, `event_id: PROGRAM_INTEREST_V1` và xác nhận UUID qua `checkProgramInterestStatus` cho luồng đa chương trình.
*   Hai file không thay thế lẫn nhau. CTA, backend handler, release inventory và route public phải được kiểm tra theo đúng hợp đồng tương ứng.
