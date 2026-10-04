# Codebase Summary

## 📂 Danh Sách Tài Nguyên Chính

### 📊 Tệp Trình Chiếu PowerPoint (`.pptx`)
- [DH8_Full_Slides.pptx](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/DH8_Full_Slides.pptx): File gốc chứa toàn bộ 136 slides của chương trình.
- [DH8_Vu_Slides_VN_Notes.pptx](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/DH8_Vu_Slides_VN_Notes.pptx): 46 slides thuộc phần của Vũ đã được dịch toàn bộ ghi chú (Notes) sang tiếng Việt.
- [DH8_Vu_Slides_Script_Notes.pptx](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/DH8_Vu_Slides_Script_Notes.pptx): 46 slides của Vũ với phần Notes được thay thế hoàn toàn bằng kịch bản dẫn giảng chi tiết.
- [DH8_Hung_Slides.pptx](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/DH8_Hung_Slides.pptx): Slide phần việc sếp Hưng phụ trách (Phá băng, Kết nối, Tự chủ, Tỉnh thức).
- [DHM_In-house_001_080826.pptx](file:///C:/Users/vu.hoang/.workspace-mcp/attachments/DHM_In-house_001_080826_e03a4802.pptx): Slide bản mới nhất đồng bộ trực tiếp từ Google Slides (chứa cập nhật Slide 50 Eudaimonia, Slide 76 Manifest, Slide 112 Microflow WBS).

### 📁 Báo Cáo Nghiên Cứu & Khung Khảo Sát (`Artifacts/`)
- [Report_KTC_Vietnam_DH_Training.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/Report_KTC_Vietnam_DH_Training.md): Báo cáo nghiên cứu chuyên sâu KTC Vietnam (Russell Bedford KTC), khung ứng dụng 5 Thói quen Hạnh phúc cho ngành Kiểm toán và 2 đề xuất phiên Add-in (Case Study Clinic & Leadership Coaching).
- [KTC_Audit_DH_Questionnaire_10Q.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/KTC_Audit_DH_Questionnaire_10Q.md): Bảng khảo sát 10 câu thiết kế riêng cho nhân sự kiểm toán dựa trên ABCDE, SDT và 5 Happy Habits.
- [Research_Report_Motivation_Emergence.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/Research_Report_Motivation_Emergence.md): Báo cáo nghiên cứu lý thuyết Động lực Nội tại vs Ngoại lai, Hiện tượng Trồi sinh (Emergence) và Delivering Happiness (bản MD & PDF).

### 📝 Kịch Bản & Hướng Dẫn (`.md` / `.pdf` / `.html`)
- [DH8_Vu_Detailed_Script.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/DH8_Vu_Detailed_Script.md): Bản thảo kịch bản giảng dạy chi tiết của Vũ.
- [DH_Meeting_Transcript_Analysis_20260806.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/DH_Meeting_Transcript_Analysis_20260806.md): Báo cáo phân tích chuyên sâu cuộc họp thảo luận DH8.
- [dan_bai_chi_tiet_giang_day_DHM4_Vu.pdf](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/dan_bai_chi_tiet_giang_day_DHM4_Vu.pdf): Kế hoạch bài giảng chi tiết (Lesson Plan PDF).
- [slide_map.txt](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/slide_map.txt): Bản đồ văn bản trích xuất từ 136 slide gốc để đối chiếu vị trí.

### 🐍 Các Script Tự Động Hóa (Python & Node.js)
- [dump_slides.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/dump_slides.py): Script trích xuất toàn bộ văn bản PPTX ra file UTF-8 (`slide_dump.txt`).
- [extract_slides_vu_reorder.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/extract_slides_vu_reorder.py): Cắt slide cho Vũ và đảo thứ tự slide.
- [translate_notes.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/translate_notes.py): Dịch notes từ JSON tiếng Anh sang tiếng Việt.
- [inject_notes_new.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/inject_notes_new.py): Bơm notes tiếng Việt vào slide.
- [inject_script_notes_new.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/inject_script_notes_new.py): Bơm kịch bản chi tiết vào slide.
- [parse_quiz_excel.py](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/scripts/parse_quiz_excel.py): Bóc tách 20 câu hỏi trắc nghiệm phản xạ từ tệp Excel Blooket template (`DHM quiz 20 questions.xlsx`) sang JSON chuẩn hóa.

### 🌐 Phân Hệ Delivering Happiness Blended Learning LMS Engine v3
- [DHM_BLENDED_LMS_STANDARDIZED_ARCHITECTURE.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/docs/DHM_BLENDED_LMS_STANDARDIZED_ARCHITECTURE.md): Đặc tả kiến trúc tổng thể Blended Learning 3 Chặng, tích hợp bài kiểm tra sát hạch 10 câu (≥ 80% - 8/10 câu, 3 retries, lockout) và phân quyền 6 thành viên Ban Giảng Huấn.
- [dhm_quiz_20_questions.json](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/dhm_quiz_20_questions.json): CSDL 20 câu hỏi trắc nghiệm sát hạch đầu vào chuẩn hóa (đáp án 0-indexed, thời gian 20s).
- [master_learners_roster.json](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/master_learners_roster.json): Cơ sở dữ liệu 383 học viên và giảng viên từ DHM3 đến DHM9 (mã định danh `learner_id`, email, SĐT, phân loại tổ chức, vai trò `Coach`/`Learner`).
- [LEARNER_DATA_SCHEMA.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/LEARNER_DATA_SCHEMA.md): Đặc tả cấu trúc dữ liệu học viên, trạng thái số điện thoại (`verified`, `legacy_partial`, `missing`) và quy tắc nghiệp vụ.
- [personal-value.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/personal-value.js): Trang trắc nghiệm Giá trị cá nhân 1vs1, lưu mảng lịch sử `dhm_pv_history_<email>` trong `localStorage` và gửi `PV_Data` lên Google Sheet CRM.
- [uat_report_20261004_pv_history_and_matrix.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/UAT/uat_report_20261004_pv_history_and_matrix.md): Báo cáo kiểm thử tự động UAT Browser (14/14 PASS) xác nhận Dropdown lịch sử PV, Ma trận biến động 4 chiều (Mỏ neo cốt lõi, Thăng hạng, Mới xuất hiện, Buông bỏ/Lùi lại) kèm câu hỏi phản tư sư phạm chuẩn hóa của sếp Dzũ.

