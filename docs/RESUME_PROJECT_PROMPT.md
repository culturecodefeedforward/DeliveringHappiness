# RESUME PROJECT PROMPT — DELIVERING HAPPINESS (DHM) LMS & CRM

> **Mục đích**: Khối mã bên dưới là prompt 1-chạm tự thân đầy đủ (Self-contained 1-Click Code Block). 
> Khi mở một **New Conversation (Phiên chat mới)** để tránh tràn context window, bạn chỉ cần sao chép toàn bộ khối mã `text` bên dưới và dán vào cửa sổ chat mới. Agent mới sẽ nắm trọn 100% bối cảnh và tiếp tục công việc ngay lập tức.

---

```text
BẮT ĐẦU PHIÊN LÀM VIỆC TIẾP THEO — DỰ ÁN DELIVERING HAPPINESS (DHM)

1. ĐỊNH VỊ TÀI NGUYÊN & NGUỒN CHUẨN (SOURCE OF TRUTH):
- Thư mục dự án chính: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
- Thư mục đồng bộ giảng dạy: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH
- Kho lưu trữ GitHub: https://github.com/culturecodefeedforward/DeliveringHappiness.git (nhánh main, commit b6950c8)
- Google Apps Script: Script ID 1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS (Deployment ID AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ phiên bản @74)
- Google Sheet CRM: Delivering Happiness Masterclass CRM (1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA)
- Production Live URLs:
  * Micro-LMS: https://delivering-happiness.vercel.app/lms/
  * Khảo sát Phong cách Xã hội (SS): https://khao-sat-tinh-cach.vercel.app
  * Khảo sát Xung đột (TKI): https://khao-sat-xung-dot-tki.vercel.app
  * La bàn Giá trị Cốt lõi (GTCL): https://delivering-happiness.vercel.app/personal-value.html
  * Đăng ký DHM10: https://delivering-happiness.vercel.app/register_dhm10.html
- Nguồn dữ liệu chuẩn:
  * Roster học viên: dh4hn-website/lms/master_learners_roster.json
  * Giáo trình 3 Chặng: dh4hn-website/lms/curriculum_data.json
  * Backend CRM: dh4hn-website/Scripts/active_code_gs_final.js

2. CÁC HẠNG MỤC ĐÃ HOÀN THÀNH & KIỂM CHỨNG 100% TRÊN LIVE:
- Hoàn thành Mô hình Đăng nhập Lai (Hybrid Auth Model) cho hệ thống LMS:
  * Xóa bỏ hoàn toàn lỗ hổng tự cấp quyền DHM9-TựPhụcVụ (không ai có thể tự gõ email/sđt giả để học cả 3 chặng).
  * Học viên Chính thức (có trong Roster): Đăng nhập 3 giây bằng Email + 4 số cuối SĐT, mở khóa 3 Chặng sau khi đạt ≥80% Cổng Vượt Chặng.
  * Người mới / Email lạ (chưa có trong Roster): Tự động chuyển sang form yêu cầu Magic Link học thử Chặng 1 qua Email (tuân thủ Nghị định 13/2023/NĐ-CP, cooldown 60s).
  * Xác thực Magic Link: Tự bóc tách param ?token=...&action=verify, xác thực qua Webhook CRM, cấp phiên currentUser.isTrial = true.
  * Khóa Cứng (Strict Lockout): Tài khoản học thử CHỈ ĐƯỢC HỌC CHẶNG 1 (Pre-Class 90 phút). Bấm vào Chặng 2/3 hoặc nút Tiếp tục ở cuối Chặng 1 sẽ hiện Modal Nâng Cấp Amber Corporate Minimalist mời đăng ký khóa chính thức.
  * Đã kiểm chứng Live: Vercel CDN trả về đầy đủ trial-upgrade-modal, trial-onboarding-group; Web App Apps Script @74 phản hồi HTTP 200 JSON chuẩn.

3. QUY TẮC BẤT BIẾN & RÀNG BUỘC KỸ THUẬT:
- Đọc và áp dụng nghiêm ngặt SHARED_AGENT_RULES.md và RULE_SENTINEL_DZU ở đầu mỗi phản hồi.
- Frontend: HTML5, Tailwind CSS (CDN), Vanilla JS ES6+, không dùng build tools phức tạp.
- Đọc/ghi tệp đa ngữ bắt buộc UTF-8 explicit.
- Tuyệt đối không can thiệp, xóa hoặc làm biến dạng cấu trúc dữ liệu CRM Google Sheet hiện hữu.
- Phê duyệt Cấp độ 2 cho phép sửa file local và chạy test; Cấp độ 3 bắt buộc trước git commit, push và deploy.

4. NHIỆM VỤ TIẾP THEO CẦN LÀM:
- Theo dõi ghi nhận dữ liệu người học thử LMS trong tab Leads_Directory của CRM Sheet.
- Rà soát các luồng tương tác trên Live và hỗ trợ người dùng theo yêu cầu mới của Sếp.
- Bạn hãy xác nhận đã hiểu toàn bộ bối cảnh trên và sẵn sàng tiếp nhận yêu cầu tiếp theo.
```
