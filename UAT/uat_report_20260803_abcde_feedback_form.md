# UAT (User Acceptance Testing - kiểm thử nghiệm thu người dùng) — Delivering Happiness Feedback Hub

**Thời điểm:** 2026-08-03 16:33:01 +07:00  
**Bề mặt kiểm chứng:** Chrome đã đăng nhập, liên kết người trả lời của Google Forms  
**Kích thước khung nhìn quan sát:** 1422 × 654  
**URL kiểm tra:** https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor  
**Mã Form:** `1FtWtZ4u0kUPItP4XLo76nSaoMBGGv3DoQi4Zsy_DbuQ`  
**Mã Google Sheet:** `1tuFiFAy-sGWwA9HtnloOOwyio2mW3CZf25I7vEDcnZU`

## Kết quả kiểm chứng

| Ca kiểm thử | Bằng chứng DOM/UI (cấu trúc và giao diện thực tế) | Mức claim |
|---|---|---|
| Mở liên kết người trả lời | Hiển thị tiêu đề `Delivering Happiness — Feedback Hub — Ambassador`, mô tả chung và nút `Gửi`. | VERIFIED |
| Bốn nhóm phân loại | `Loại phản hồi`: Báo lỗi / Ý tưởng cải tiến / Trải nghiệm / Nội dung học tập; `Mức ảnh hưởng`: Không dùng được / Khó dùng / Góp ý nhỏ; `Phiên bản`: Bản ổn định / RAG Beta; `Bước liên quan`: Mã truy cập / A–E / Nhận báo cáo / Khác. | VERIFIED |
| Trường bắt buộc | Dấu `*` xuất hiện ở Loại phản hồi, Mức ảnh hưởng, Phiên bản sử dụng, Tiêu đề ngắn, Mô tả chi tiết và câu hỏi đồng ý liên hệ lại. | VERIFIED |
| Trường tùy chọn | Bước liên quan, Ảnh chụp màn hình, Email liên hệ và Số điện thoại/Zalo không có dấu `*`. Nhãn email và số điện thoại ghi rõ “khuyến nghị, không bắt buộc”. | VERIFIED |
| Tải ảnh | Trường tải 1 tệp, tối đa 10 MB; Google hiển thị cảnh báo người trả lời phải đăng nhập khi dùng trường tải tệp. | VERIFIED |
| Google Sheet | Form hiển thị `View in Sheets`; bảng có tiêu đề `Delivering Happiness — Feedback Hub (Responses)`. | VERIFIED |
| Quyền xử lý | UI Google Sheets hiển thị `Shared with 1 person` và trạng thái `Access updated` sau khi cấp quyền Editor cho `vuhoang2708@gmail.com`. | VERIFIED |

## Ranh giới kiểm thử

- Chưa gửi một phản hồi thử thật, để tránh tạo dữ liệu giả trong Sheet.
- Chưa kiểm tra thao tác tải tệp bằng tài khoản Ambassador khác; đây là phần cần xác nhận trong vòng thử nghiệm đầu tiên.
- Liên kết đã công bố ở chế độ người có liên kết có thể trả lời; chưa claim ẩn danh hoàn toàn vì trường tải tệp gắn với yêu cầu đăng nhập Google.

## Hành động tiếp theo

1. Gửi link Form trong nhóm Ambassador kèm lưu ý trường ảnh cần đăng nhập Google.
2. Khi có phản hồi đầu tiên, kiểm tra một lần dữ liệu đổ vào Sheet và bắt đầu gắn nhãn `NEW` / `NEED_INFO`.
3. Nếu yêu cầu đăng nhập làm giảm tỷ lệ gửi, cân nhắc thay trường tải tệp bằng trường dán liên kết ảnh ở vòng sau.

## Addendum 2026-08-03 17:00 +07:00 — chuẩn hóa tối thiểu

- Addendum này là trạng thái hiện tại và thay thế các nhãn ABCDE cũ trong bảng kiểm chứng phía trên.
- Form hiện hiển thị tên `Delivering Happiness — Feedback Hub — Ambassador` trên cùng một liên kết công khai.
- Đã thêm trường bắt buộc `Sản phẩm/module` với lựa chọn `ABCDE` và `Khác — ghi rõ trong mô tả`.
- Đã tách `Loại phản hồi` thành trường chung ngay sau trường sản phẩm/module.
- Đã đổi nhãn `Bước liên quan` thành `Tính năng/luồng hoặc bước liên quan` để mở rộng cho module sau này.
- Liên kết người trả lời sau thay đổi đã được mở lại trên Chrome; DOM (cấu trúc hiển thị) cho thấy đủ các trường mới và các trường cũ.
- Linked Sheet (bảng liên kết) đã tự thêm cột `Loại phản hồi` ở cuối hàng header (tiêu đề cột); khi phân tích phải đối chiếu theo tên cột, không giả định thứ tự cột giống thứ tự câu hỏi.
- Kịch bản và prompt Gemini: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_test_20260803.md` và `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_prompt_20260803_feedback_hub_test.md`.
