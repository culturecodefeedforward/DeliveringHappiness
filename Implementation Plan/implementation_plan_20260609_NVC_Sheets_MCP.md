# Implementation Plan: Thiết lập Sheet riêng cho NVC qua MCP

**Ngày:** 2026-06-09  
**Task:** Thiết lập Sheet mới & Webhook riêng cho `register_nvc.html`  
**Trạng thái:** ⏳ Chờ duyệt (Pending Approval)

---

## 1. Giải pháp kỹ thuật

Hệ thống sẽ chạy độc lập với DH Masterclass để bảo mật dữ liệu. Quy trình gồm:

1. **Khởi tạo bảng tính mới:** Tạo Google Sheet tên `CultureCode - NVC Leads`.
2. **Thiết lập Header:** Gồm 13 cột tương ứng với form NVC:
   - `Timestamp` (Thời gian đăng ký)
   - `FullName` (Họ tên)
   - `Phone` (Số điện thoại/Zalo)
   - `Email` (Email liên hệ)
   - `Role` (Vai trò trong DN)
   - `Company` (Công ty/Tổ chức)
   - `ReferrerName` (Người giới thiệu)
   - `ReferrerPhone` (SĐT người giới thiệu)
   - `Q1_Situation` (Tình huống giao tiếp khó nhất)
   - `Q2_Relationship` (Mối quan hệ cần giúp đỡ)
   - `Q3_Expectation` (Kỳ vọng sau buổi học)
   - `Event_ID` (Mã sự kiện: NVC_GTKN_0926)
   - `Session_ID` (Mã phiên làm việc)
3. **Deploy Apps Script Web App:** Tạo script xử lý POST request và tự động ghi vào Sheet mới này.
4. **Cấu hình Webhook URL:** Gán URL nhận được vào biến `window.CUSTOM_WEBAPP_URL` trong file `register_nvc.html`.

## 2. Các file ảnh hưởng

| File | Hành động | Chi tiết |
|---|---|---|
| `register_nvc.html` | Cập nhật | Gán `window.CUSTOM_WEBAPP_URL` bằng URL Apps Script mới |

## 3. Phân công Agent
- **Gemini (Hiện tại):** Lập kế hoạch, chuẩn bị cấu trúc code, cấu hình frontend.
- **Codex / Claude (Đối tác MCP):** Thực thi gọi APIs tạo Sheet, setup Apps Script thông qua MCP tools.
