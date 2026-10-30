# UAT Report: Feedback Hub Gemini Test

**Date:** 2026-08-03
**Time:** 2026-08-03T17:15:00+07:00 (Asia/Bangkok)
**URL Tested:** https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor
**Viewport:** Desktop 1440 × 900

## TC-01 — Gửi phản hồi lỗi tối thiểu

### Expected Result (Kết quả mong đợi)
- Form không chặn việc gửi vì các trường liên hệ và ảnh là tùy chọn.
- Màn hình xác nhận gửi thành công xuất hiện.
- Không yêu cầu dữ liệu cá nhân thật trong dòng kiểm thử.

### Observed Result (Kết quả quan sát)
- **BLOCKED**: Trình duyệt bị chuyển hướng (redirect) sang trang đăng nhập của Google (Google Sign-in) ngay khi truy cập URL liên kết.
- Không thể điền form vì form yêu cầu phải đăng nhập (có thể do form bị giới hạn nội bộ tổ chức hoặc tham số `usp=publish-editor` yêu cầu quyền chỉnh sửa/đăng nhập).

### Lỗi/Lý do chặn
- Timeout error trong Playwright khi chờ load form do URL bị redirect sang `https://accounts.google.com/v3/signin/...`.

### Bằng chứng
- **Ảnh lỗi/bị chặn:** ![Lỗi đăng nhập](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/playwright_test/screenshot_error.png)

(Do bị chặn ngay từ đầu, không có ảnh trước/sau khi gửi thành công).
