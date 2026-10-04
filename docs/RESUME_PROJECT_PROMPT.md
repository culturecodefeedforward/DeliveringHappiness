# RESUME PROJECT PROMPT — DELIVERING HAPPINESS (DHM) LMS & CRM

> **Mục đích**: Khối mã bên dưới là prompt 1-chạm tự thân đầy đủ (Self-contained 1-Click Code Block). 
> Khi mở một **New Conversation (Phiên chat mới)** để tránh tràn context window, bạn chỉ cần sao chép toàn bộ khối mã `text` bên dưới và dán vào cửa sổ chat mới. Agent mới sẽ nắm trọn 100% bối cảnh và tiếp tục công việc ngay lập tức.

---

```text
BẮT ĐẦU PHIÊN LÀM VIỆC TIẾP THEO — DỰ ÁN DELIVERING HAPPINESS (DHM)

1. ĐỊNH VỊ TÀI NGUYÊN & NGUỒN CHUẨN (SOURCE OF TRUTH):
- Thư mục dự án chính: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
- Thư mục đồng bộ giảng dạy: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH
- Kho lưu trữ GitHub: https://github.com/culturecodefeedforward/DeliveringHappiness.git (nhánh main, commit e3af8b1)
- Google Apps Script: Script ID 1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS (Deployment ID AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ)
- Google Sheet CRM: Delivering Happiness Masterclass CRM (1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA)
- Production Live URLs:
  * Micro-LMS: https://delivering-happiness.vercel.app/lms/
  * La bàn Giá trị Cá nhân (1vs1): https://delivering-happiness.vercel.app/personal-value.html
  * Khảo sát Phong cách Xã hội (SS): https://khao-sat-tinh-cach.vercel.app
  * Khảo sát Xung đột (TKI): https://khao-sat-xung-dot-tki.vercel.app
  * Đăng ký DHM10: https://delivering-happiness.vercel.app/register_dhm10.html
- Nguồn dữ liệu chuẩn:
  * Roster học viên: dh4hn-website/lms/master_learners_roster.json
  * Giáo trình 3 Chặng: dh4hn-website/lms/curriculum_data.json
  * Backend CRM: dh4hn-website/Scripts/active_code_gs_final.js
  * Báo cáo kiểm thử: dh4hn-website/UAT/uat_report_20261004_pv_history_and_matrix.md

2. CÁC HẠNG MỤC ĐÃ HOÀN THÀNH & KIỂM CHỨNG 100% (VERIFIED):
- Cập nhật liên kết hỗ trợ kích hoạt: Thay thế nhóm Zalo thành email culturecodeproject@gmail.com trong #trial-onboarding-group.
- Khắc phục lỗi lệch pha khóa lưu trữ: Loại bỏ encodeURIComponent trong lms/app.js, đồng bộ chuẩn hóa khóa dhm_pv_<email> với personal-value.js.
- Cơ chế lưu trữ Offline-First: Tự động lưu mảng lịch sử dhm_pv_history_<email> trong localStorage mỗi khi nộp bài test.
- Tích hợp Dropdown lịch sử PV trên LMS (#pv-test-result-card): Cho phép chọn xem lại kết quả bất kỳ lần làm bài nào trong quá khứ, nhãn Top 7 và ngày test tự động đổi theo tức thì.
- Tích hợp Khối Phân Tích Biến Động 4 Chiều (Personal Values Transformation Matrix):
  * 🧭 1. Mỏ neo cốt lõi (Core Anchors): Giá trị giữ vững trong Top 3 qua các lần làm bài.
  * 🚀 2. Thăng hạng (Ascending Values): Giá trị nhảy vọt lên thứ hạng cao hơn trong Top 7.
  * 🌱 3. Mới xuất hiện (Emerging Values): Lần đầu tiên bước vào Top 7.
  * 🍂 4. Buông bỏ / Lùi lại (Departed Values): Từng có trong Top 7 nhưng lần này rời khỏi bảng ưu tiên, đi kèm câu hỏi phản tư chuẩn hóa của sếp Dzũ: "Điều gì trong cuộc sống hoặc công việc thời gian qua đã giúp bạn nhận ra mình sẵn sàng buông bỏ điều này để tập trung cho những giá trị khác?"
- Điền tự động vào bài tập I-A-M: Nút tiện ích tự động nạp phân tích 4 chiều vào 3 ô nhập liệu iam-1-2-i, iam-1-2-a, iam-1-2-m của Module 1.2 (Chặng 1).
- Backend Apps Script: Thêm action get_pv_history quét tab PV_Data hỗ trợ hàm syncCrossDevicePVHistory đồng bộ xuyên thiết bị.
- Kiểm thử tự động UAT Browser (Puppeteer): Đạt 14/14 hạng mục PASS tuyệt đối (100%), lưu 3 ảnh minh chứng trong UAT/evidence_20261004_pv_matrix/.
- Đã Git commit và push thành công lên GitHub origin/main (Commit SHA: e3af8b1).

3. QUY TẮC BẤT BIẾN & RÀNG BUỘC KỸ THUẬT:
- Bắt buộc mở đầu phản hồi bằng RULE_SENTINEL_DZU và trích dẫn bằng chứng kiểm chứng.
- Frontend: HTML5, Tailwind CSS (CDN), Vanilla JS ES6+, không dùng build tools phức tạp.
- Đọc/ghi tệp đa ngữ bắt buộc UTF-8 explicit.
- Tuyệt đối không can thiệp, xóa hoặc làm biến dạng cấu trúc dữ liệu CRM Google Sheet hiện hữu.
- Phê duyệt Cấp độ 2 cho phép sửa file local và chạy test; Cấp độ 3 bắt buộc trước git commit, push và deploy.

4. NHIỆM VỤ TIẾP THEO CẦN LÀM:
- Kiểm tra xác minh giao diện trên Vercel Live sau khi CDN hoàn tất xóa cache.
- Rà soát các luồng tương tác trên Live và hỗ trợ người dùng theo yêu cầu mới của Sếp.
- Bạn hãy xác nhận đã hiểu toàn bộ bối cảnh trên và sẵn sàng tiếp nhận yêu cầu tiếp theo.
```
