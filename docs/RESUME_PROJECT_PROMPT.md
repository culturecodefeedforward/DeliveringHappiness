# RESUME PROJECT PROMPT — DELIVERING HAPPINESS (DHM) LMS & CRM

> **Mục đích**: Khối mã bên dưới là prompt 1-chạm tự thân đầy đủ (Self-contained 1-Click Code Block). 
> Khi mở một **New Conversation (Phiên chat mới)** để tránh tràn context window, bạn chỉ cần sao chép toàn bộ khối mã `text` bên dưới và dán vào cửa sổ chat mới. Agent mới sẽ nắm trọn 100% bối cảnh và tiếp tục công việc ngay lập tức.

---

```text
RULE_SENTINEL_DZU: đã đọc kỹ rule nghe sếp Dzũ
Rule evidence: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md
Skill evidence: C:\Users\vu.hoang\.gemini\config\skills\dhm-blended-lms\SKILL.md
Task evidence: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\plan_20261004_personal_value_session_sync_and_roster_auth.md

BẮT ĐẦU PHIÊN LÀM VIỆC TIẾP THEO — DỰ ÁN DELIVERING HAPPINESS (DHM)

1. ĐỊNH VỊ TÀI NGUYÊN & NGUỒN CHUẨN (SOURCE OF TRUTH):
- Thư mục dự án chính: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
- Thư mục tài liệu & kế hoạch: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH
- Kho lưu trữ GitHub: https://github.com/culturecodefeedforward/DeliveringHappiness.git (nhánh main, commit cb6ac78)
- Live Production URL: https://delivering-happiness.vercel.app/lms/
- Trang La bàn Giá trị: https://delivering-happiness.vercel.app/personal-value.html
- Kế hoạch đã duyệt: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\plan_20261004_personal_value_session_sync_and_roster_auth.md
- Nguồn dữ liệu danh bạ học viên: dh4hn-website/lms/authorized_roster.json

2. CÁC HẠNG MỤC ĐÃ HOÀN THÀNH & KIỂM CHỨNG 100% (VERIFIED):
- Đã hoàn tất tái cấu trúc Micro-LMS Chặng 1 & Chặng 3 (commit cb6ac78):
  * Chặng 1 tinh gọn từ 14 xuống 11 bài học trọng tâm, loại bỏ slide/video phụ trùng lặp.
  * Chặng 3 bổ sung Đấu trường Bonus KUBA (game đối kháng xử lý tình huống văn hóa), Podcast chuyên sâu, và thiết lập Cổng Sát Hạch Đầu Vào (Qualifier Gate 1200 điểm) mở khóa chặng.
  * Kiểm thử UAT tự động Puppeteer 26/26 tests PASS 100%, đã deploy live thành công trên Vercel.

3. TRỌNG TÂM CẦN THỰC THI NGAY (ALLOWLIST: personal-value.html, personal-value.js, lms/app.js):
Khắc phục triệt để 2 vấn đề trải nghiệm tại trang La Bàn Giá Trị (personal-value.html) theo kế hoạch plan_20261004_personal_value_session_sync_and_roster_auth.md:
- Vấn đề 1 (Lưu & Kế thừa Session tự động): Khi học viên đã đăng nhập trên LMS (đã có session dhm_lms_auth_user), khi bấm liên kết [🧭 Làm bài test 1vs1 ↗] sang personal-value.html phải tự động nhận diện danh tính và mở khóa ngay lập tức vào Bước 1 làm bài, KHÔNG ĐƯỢC bật modal xác thực.
- Vấn đề 2 (Cổng xác thực Roster-First cho khách vãng lai): Khi truy cập trực tiếp chưa có session, modal ban đầu chỉ hiện 1 ô nhập Email hoặc Số điện thoại. Hệ thống đối chiếu ngay với lms/authorized_roster.json. Nếu có tên học viên chính thức -> Mở khóa vào làm bài ngay lập tức (0 giây chờ, không gửi email). Chỉ khi KHÔNG tìm thấy thông tin mới hiển thị form gửi liên kết kích hoạt bản dùng thử (Trial) qua Email.

4. QUY TRÌNH THỰC THI BẮT BUỘC:
- Tạo 3 bản sao lưu .bak_20261004_session cho 3 file trong Allowlist.
- Chỉnh sửa mã nguồn theo đúng kế hoạch plan_20261004_personal_value_session_sync_and_roster_auth.md.
- Viết script Puppeteer kiểm thử cục bộ đủ 3 trường hợp: (1) Đã login LMS; (2) Khách có trong Roster; (3) Khách lạ.
- Git commit & push lên origin main, sau đó dùng Puppeteer kiểm chứng Live Vercel Production.
- Báo cáo kết quả kèm bằng chứng cụ thể. Bắt đầu thực thi ngay!
```
