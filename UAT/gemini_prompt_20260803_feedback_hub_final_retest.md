# Prompt Gemini — kiểm chứng độc lập Feedback Hub sau xử lý

```text
gemini nói:
Round 2/3 — Hãy thực hiện kiểm chứng độc lập, chỉ đọc, cho Google Form Feedback Hub sau khi Codex đã xử lý lỗi đăng nhập.

Master plan step (bước trong kế hoạch tổng): Bước 5 — kiểm tra Form ẩn danh sau chỉnh sửa; kế hoạch tại:
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\form_feedback_hub_public_access_fix_20260803.md

Nguồn chuẩn cần đọc bằng UTF-8:
- Báo cáo UAT cuối:
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\uat_report_20260803_feedback_hub_public_fix.md
- Phân tích:
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_analysis_20260803.md
- Hướng dẫn Ambassador:
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\ambassador_abcde_invitation_feedback_20260803.md
- Kịch bản gốc:
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_test_20260803.md

Liên kết Form cuối cần kiểm tra:
https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform

Skills dự kiến sử dụng: công cụ trình duyệt của Gemini (browser - kiểm thử giao diện và luồng người dùng); đường dẫn skill trong môi trường Gemini: UNVERIFIED skill path.

Ranh giới bắt buộc:
1. Dùng phiên ẩn danh/không có tài khoản Google; không điền email, mật khẩu, OTP hoặc dữ liệu cá nhân.
2. Không submit (gửi) Form, không tải tệp, không sửa Form/Sheet và không tạo thêm dòng phản hồi. TC-01 đã được Codex gửi một lần.
3. Không ghi cookie, token, URL chứa thông tin phiên hoặc dữ liệu đăng nhập vào report.

Ca kiểm thử:

TC-GEMINI-01 — Desktop 1440 × 900
- Mở URL trên bằng phiên không đăng nhập.
- Kỳ vọng: Form tải trực tiếp, không chuyển sang Google Sign-in.
- Xác nhận tiêu đề `Delivering Happiness — Feedback Hub — Ambassador`.
- Xác nhận có các trường `Sản phẩm/module`, `Loại phản hồi`, `Tính năng/luồng hoặc bước liên quan`.
- Xác nhận trường ảnh hiển thị `Liên kết ảnh chụp màn hình (không bắt buộc)` và là ô nhập liên kết, không phải `File upload`.
- Xác nhận mô tả nói có thể dán liên kết ảnh và không cần đăng nhập.
- Chụp ảnh màn hình toàn trang hoặc phần liên quan; không click Gửi.

TC-GEMINI-02 — Mobile 390 × 844
- Lặp lại kiểm tra tải Form và các trường cốt lõi ở khung nhìn mobile.
- Chụp ảnh màn hình; không submit.

TC-GEMINI-03 — Đối chiếu tài liệu
- Đọc hướng dẫn Ambassador và kiểm tra không còn hướng dẫn “tải tệp/đăng nhập Google”.
- Nếu thấy mâu thuẫn, ghi rõ file và dòng; không tự sửa.

Evidence cần trả về:
- URL, viewport, timestamp Asia/Bangkok, trạng thái VERIFIED/FAILED/BLOCKED/UNVERIFIED.
- Ảnh desktop/mobile, console/network error nếu có (đã làm sạch token/cookie).
- Skills đã sử dụng và evidence path.
- Mirror report UTF-8 tại:
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_evidence_20260803_feedback_hub_final_retest.md

Điều kiện dừng:
- Nếu bị chuyển sang đăng nhập hoặc Form không hiển thị, dừng ngay, ghi BLOCKED và không tìm cách đăng nhập/bypass.
- Nếu kiểm chứng đạt, chỉ báo VERIFIED cho bề mặt trình duyệt; không tuyên bố Sheet có dữ liệu mới vì không được submit.
```
