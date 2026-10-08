# RESUME PROJECT PROMPT (BÀN GIAO & TIẾP TỤC DỰ ÁN 1-CHẠM)

> **Mục đích:** Sao chép toàn bộ khối mã `text` bên dưới và dán vào một **Cuộc hội thoại mới (New Chat)** để tiếp tục dự án ngay lập tức mà không sợ tràn context window hay mất bối cảnh kỹ thuật.

```text
Tôi đang tiếp tục dự án Delivering Happiness Masterclass (DHM Blended Learning LMS).
Hãy nạp toàn bộ bối cảnh kỹ thuật và trạng thái đã hoàn thành dưới đây để tiếp tục công việc:

1. ĐỊNH VỊ TÀI NGUYÊN & SOURCE OF TRUTH:
- Thư mục dự án Teaching DH: C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH
- Thư mục mã nguồn Website LMS: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
- GitHub Repo: https://github.com/culturecodefeedforward/DeliveringHappiness.git (Branch: main)
- Commit mới nhất trên main: 880bfb8
- Live Production URL: https://delivering-happiness.vercel.app/lms/
- Google Sheets CRM đích: Sheet ID 1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA
- Tệp danh bạ chuẩn (Roster): lms/master_learners_roster.json và lms/authorized_roster.json
- Tệp giao diện chính: lms/index.html và lms/app.js
- Cẩm nang học tập & User Guide: data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md
- Thư mục ảnh giao diện tĩnh: data/artifacts/images/

2. CÁC TÀI KHOẢN KIỂM THỬ ĐẶC BIỆT (COACH ROLE - MỞ 100% 3 CHẶNG):
- Tài khoản 1: vuhoang2708software@gmail.com | Mật khẩu: 1234
- Tài khoản 2: culturecodeproject@gmail.com | Mật khẩu: 1234
(Đã đồng bộ trên cả 3 repo: dh4hn-website, khao-sat-xung-dot-tki, khao-sat-tinh-cach).

3. CÁC TÍNH NĂNG MỚI ĐÃ HOÀN THÀNH VÀ KIỂM CHỨNG LIVE 100% (LIVE DONE):
- Bảng Điểm Danh 5 Thói Quen 21 Ngày (Chặng 3): Tích chọn M-G-O-F-A, tính chuỗi Streak Hero, lưu Offline-first vào localStorage.
- Nút Đồng Bộ Tiến Độ Về BTC: Gửi Webhook lưu dữ liệu về Google Sheets CRM của BTC, phản hồi nhãn xanh ngọc bích kèm mốc thời gian lưu tự động.
- Khối Accordion Hướng Dẫn & Chú Giải 5 Thói Quen ngay tại Bảng Điểm Danh: Giải thích rõ ràng M (Mindfulness - SCBA), G (Gratitude - 4 điều biết ơn), O (Optimism - ABCDE), F (Flow - 4%), A (Altruism - 5-Minute Favors) cùng 3 bước thao tác chuẩn.
- Nâng cấp renderSimpleMarkdown trong lms/app.js: Render thẻ ảnh Markdown ![alt](url) thành thẻ <img> bo góc, đổ bóng đẹp mắt trong modal đọc cẩm nang.
- Bổ sung Phần V vào Cẩm nang học tập (huong_dan_va_lo_trinh_hoc_dhm.md) kèm trọn bộ 4 ảnh chụp giao diện thực tế.

4. QUY TẮC BẤT BIẾN & AN TOÀN (GUARDRAILS):
- Công nghệ: Vanilla JS, Tailwind CSS CDN (không tự ý cài thêm build tool hay package nặng).
- Rule 7: Khi verify trên Live Production Vercel sau khi push, bắt buộc chờ ít nhất 30-45 giây để CDN xóa cache trước khi chạy kiểm thử.
- Mọi thao tác sửa file cần Level 2 Approval; commit/push cần Level 3 Approval từ Sếp Dzũ.
- Mọi phản hồi mở đầu bằng RULE_SENTINEL_DZU và mỗi đường dẫn tuyệt đối Windows phải đặt trong một khối mã riêng biệt kèm link file:///.

5. NHIỆM VỤ TIẾP THEO CẦN LÀM:
- Sẵn sàng tiếp nhận phản hồi từ Core Team và học viên sau workshop 2 ngày để tinh chỉnh trải nghiệm Chặng 3.
- Xác nhận bạn đã đọc kỹ bối cảnh trên và sẵn sàng nhận lệnh tiếp theo từ Sếp Dzũ!
```
