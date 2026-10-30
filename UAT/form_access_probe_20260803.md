# Bằng chứng kiểm tra độc lập — Feedback Hub (03/08/2026)

## Phạm vi và ranh giới

- Chỉ đọc quyền truy cập, URL trả lời và Google Sheet; không sửa Form/Sheet.
- Không lưu cookie, token, thông tin đăng nhập hoặc dữ liệu cá nhân.
- Form thuộc tài khoản `culturecodeproject@gmail.com`; các truy vấn quyền dùng đúng tài khoản chủ sở hữu này.

## Quyền file Google Drive (snapshot trước xử lý)

- Tên: `Delivering Happiness — Feedback Hub — Ambassador`
- Mã Form: `1FtWtZ4u0kUPItP4XLo76nSaoMBGGv3DoQi4Zsy_DbuQ`
- Loại: `application/vnd.google-apps.form`
- Chủ sở hữu: `CultureCode (culturecodeproject@gmail.com)`
- Quyền trả về: chỉ có `owner` của chủ sở hữu.
- `Anyone with the link` (ai có liên kết đều truy cập được): **không có** trong snapshot quyền file.

Giới hạn diễn giải: quyền file Google Drive là bằng chứng mạnh về việc file chưa được chia sẻ công khai, nhưng không tự nó mô tả đầy đủ cài đặt công bố/người trả lời riêng của Google Forms.

## Phân biệt quyền Form và quyền Sheet

- **Form:** snapshot quyền chỉ có `culturecodeproject@gmail.com` là `owner`; chưa có bằng chứng quyền người trả lời ẩn danh.
- **Sheet:** snapshot riêng xác nhận `culturecodeproject@gmail.com` là `owner` và `vuhoang2708@gmail.com` là `writer`.
- Vì vậy, trạng thái `Access updated`/`Shared with 1 person` trong báo cáo cũ là quyền xử lý **Sheet**, không phải quyền mở **Form** cho Ambassador.
- Báo cáo cũ: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\uat_report_20260803_abcde_feedback_form.md` — [mở báo cáo cũ](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/uat_report_20260803_abcde_feedback_form.md). Bề mặt kiểm tra của báo cáo này ghi `Chrome đã đăng nhập`; do đó không đủ để chứng minh truy cập ẩn danh.

## Kiểm tra URL trả lời không đăng nhập (trước xử lý)

Thời điểm probe (kiểm tra trực tiếp): `2026-08-03T10:26:02Z` (`17:26:02`, Asia/Bangkok).

| URL | Kết quả đã làm sạch |
|---|---|
| `https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor` | HTTP `302`, chuyển tới máy chủ `accounts.google.com` để đăng nhập |
| `https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform` | HTTP `302`, chuyển tới máy chủ `accounts.google.com` để đăng nhập |
| `https://docs.google.com/forms/d/1FtWtZ4u0kUPItP4XLo76nSaoMBGGv3DoQi4Zsy_DbuQ/viewform` | HTTP `302`, chuyển tới máy chủ `accounts.google.com` để đăng nhập |

Kết luận bề mặt URL: bỏ `usp=publish-editor` **không** loại bỏ yêu cầu đăng nhập trong lần kiểm tra này.

## Trạng thái sau xử lý

- Giao diện chủ sở hữu xác nhận `Accepting responses` đã bật và `Responders: Anyone with the link`.
- Câu hỏi `File upload` đã được đổi thành `Short answer` với nhãn `Liên kết ảnh chụp màn hình (không bắt buộc)`; mô tả Form cũng đã cập nhật để hướng dẫn dán liên kết ảnh.
- Probe ẩn danh lúc khoảng `2026-08-03T11:28:03Z` trả `HTTP 200` với nội dung Form; không còn chuyển tới `accounts.google.com`.
- Playwright không có phiên đăng nhập đã gửi TC-01 thành công; ảnh xác nhận: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshot_after_submit.png` — [xem ảnh](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshot_after_submit.png).
- Sau khi thu hồi quyền writer tạm, Form chỉ còn `Anyone with the link (reader)` + owner; Sheet vẫn giữ writer cho `vuhoang2708@gmail.com`.

## Đối chiếu bằng chứng Playwright (tự động hóa trình duyệt)

- Báo cáo Gemini: [gemini_evidence_20260803_feedback_hub.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_evidence_20260803_feedback_hub.md)
- Ảnh thực tế: [screenshot_error.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshot_error.png)
- HTML thực tế: [error_page.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/error_page.html)
- Script: [test.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/playwright_test/test.js)

Ảnh và HTML hiển thị trang `Google Sign in` trước khi Form được tải. Báo cáo Gemini đang trỏ ảnh tới `UAT/playwright_test/screenshot_error.png`, nhưng file tồn tại thực tế ở `UAT/screenshot_error.png`; đây là lỗi đường dẫn bằng chứng, không phải bằng chứng Form đã tải.

## Đối chiếu Google Sheet

- Sheet: `Delivering Happiness — Feedback Hub (Responses)`
- Mã: `1tuFiFAy-sGWwA9HtnloOOwyio2mW3CZf25I7vEDcnZU`
- Đọc vùng `'Form Responses 1'!A1:Z100` trả về **1 hàng duy nhất**, là hàng tiêu đề.
- Chưa có hàng phản hồi TC-01; không thể đối chiếu giá trị hoặc xác nhận ghi dữ liệu.

## Giới hạn còn lại

- Chưa có bằng chứng trực tiếp từ giao diện cài đặt Google Forms để xác định công tắc `Published` (đã công bố) hoặc giới hạn miền/tổ chức.
- Kiểu câu hỏi `Ảnh chụp màn hình (không bắt buộc)` có phải `File upload` (tải tệp) hay không chưa được xác nhận qua DOM; không được quy kết đây là nguyên nhân duy nhất của chuyển hướng cấp trang.
- Phần snapshot phía trên là trạng thái trước xử lý; kết quả gửi TC-01 sau xử lý được ghi ở `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\uat_report_20260803_feedback_hub_public_fix.md` — [mở report cuối](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/uat_report_20260803_feedback_hub_public_fix.md).
