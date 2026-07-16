# TODO List - Tích hợp Chatbox thực hành Lạc quan ABCDE

- `[x]` Khởi tạo các tệp logic & giao diện local
  - `[x]` Chỉnh sửa `index.html` (Thêm nút bấm và import JS/CSS)
  - `[x]` Tạo tệp `chat-abcde.css` (Giao diện scoped với prefix `.abcde-*`)
  - `[x]` Tạo tệp `chat-abcde.js` (Frontend State Machine & Điều khiển UI)
  - `[x]` Tạo tệp `api/chat-abcde.js` (Vercel Serverless Function gọi Gemini & ký HMAC)
  - `[x]` Chỉnh sửa `Scripts/active_code_gs_final.js` (Apps Script backend xác thực signature & lưu sheet/mail)
- `[x]` Cập nhật tài liệu kỹ thuật
  - `[x]` Cập nhật `docs/system-architecture.md`
  - `[x]` Cập nhật `docs/deployment-guide.md`
- `[x]` Thực hiện kiểm chứng (UAT) & Ghi nhận báo cáo
  - `[x]` Tạo file báo cáo UAT `UAT/abcde_chatbox_uat_report.md`
  - `[x]` Kiểm tra local các kịch bản UAT (TC-01 đến TC-09)
  - `[x]` Báo cáo checkpoint Cấp độ 3 cho sếp duyệt trước khi clasp push / Vercel deploy
- `[x]` Triển khai, Kiểm chứng Live & Fix lỗi liên thông
  - `[x]` Thiết lập `.claspignore` tránh xung đột trùng hàm doPost
  - `[x]` Deploy Apps Script sạch (@23) và cập nhật biến môi trường Vercel
  - `[x]` Verify liên thông E2E thành công 100% (lưu Sheet & gửi Email)
  - `[x]` Commit toàn bộ thay đổi sạch sẽ vào nhánh local main
