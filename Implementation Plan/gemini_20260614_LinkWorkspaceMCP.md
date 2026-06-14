# Kế hoạch triển khai: Kết nối Workspace MCP với tài khoản culturecodeproject@gmail.com
**Ngày:** 14/06/2026  
**Người thực hiện:** Antigravity (Gemini)  
**File Location:** `C:\Users\vu.hoang\.gemini\antigravity\brain\ffd397b9-8a66-46ff-8400-f1db9fe8b60d\gemini_20260614_LinkWorkspaceMCP.md` (được mirror về `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260614_LinkWorkspaceMCP.md`)

## 1. Đề bài (Objective)
Xác thực (authenticate) và kết nối hệ thống `workspace-mcp` (Workspace Model Context Protocol) với tài khoản Google `culturecodeproject@gmail.com` để có thể truy cập và thao tác trên file Google Sheets CRM (Customer Relationship Management - Quản lý quan hệ khách hàng) của dự án.

## 2. Hiện trạng (Current State & Pain Points)
- Server `workspace-mcp` hiện tại đang sử dụng thông tin xác thực của tài khoản cũ `vuhoang2708@gmail.com`.
- File credentials (thông tin xác thực) hiện tại nằm ở: `C:\Users\vu.hoang\.google_workspace_mcp\credentials\vuhoang2708@gmail.com.json`.
- Chưa có file credentials cho `culturecodeproject@gmail.com` trong thư mục cấu hình credentials.
- Để sử dụng tài khoản mới, cần kích hoạt luồng OAuth (Open Authorization - Giao thức xác thực mở) để sinh mã thông báo truy cập (access token) và mã làm mới (refresh token) lưu trữ dưới tên `culturecodeproject@gmail.com.json`.
- **Sự cố phát sinh (14/06/2026):** Gặp lỗi `403: access_denied` ("Workspace MCP chưa hoàn tất quy trình xác minh của Google. Ứng dụng này đang trong giai đoạn kiểm thử...") do tài khoản `culturecodeproject@gmail.com` chưa được cấu hình làm **Test User** (Người dùng thử nghiệm) trong Google Cloud Console của dự án chứa Client ID hiện tại.

## 3. Giải pháp kỹ thuật & Khắc phục sự cố (Technical Solution & Incident Mitigation)
Chúng ta có hai phương án giải quyết lỗi 403:

*   **Phương án A (Khuyên dùng nếu user sở hữu tài khoản vuhoang2708@gmail.com hoặc tài khoản quản trị dự án GCP hiện tại):**
    1. Đăng nhập vào [Google Cloud Console](https://console.cloud.google.com/) bằng tài khoản quản trị/tạo Client ID.
    2. Chọn dự án tương ứng với Client ID `177780278673-...` (tên dự án thường liên quan đến Workspace MCP).
    3. Đi tới **APIs & Services (API và dịch vụ) -> OAuth consent screen (Màn hình đồng ý OAuth)**.
    4. Tại mục **Test users (Người dùng thử nghiệm)**, nhấn **Add Users (Thêm người dùng)** và nhập vào email `culturecodeproject@gmail.com`.
    5. Lưu lại và thực hiện xác thực lại.

*   **Phương án B (Tạo thông tin xác thực riêng cho culturecodeproject@gmail.com):**
    1. Đăng nhập vào [Google Cloud Console](https://console.cloud.google.com/) bằng tài khoản `culturecodeproject@gmail.com`.
    2. Tạo một dự án mới (ví dụ: `Workspace-MCP-CRM`).
    3. Cấu hình **OAuth Consent Screen** ở dạng **External (Bên ngoài)** và trạng thái **Testing (Đang thử nghiệm)**. Thêm chính email `culturecodeproject@gmail.com` vào danh mục Test Users.
    4. Bật API cần thiết: **Google Sheets API**, **Google Drive API** (và các API khác của Google Workspace nếu cần).
    5. Tạo thông tin xác thực loại **OAuth Client ID** với loại ứng dụng là **Desktop app (Ứng dụng máy tính)** hoặc Web App với redirect URI là `http://localhost:8000/oauth2callback`.
    6. Lấy tệp Client ID và Client Secret mới cập nhật vào `mcp_config.json`, sau đó tiến hành chạy lại luồng đăng nhập.

## 4. Các file bị ảnh hưởng (Affected Files)
- **Tạo mới (Tạm thời):** `C:\Users\vu.hoang\.gemini\antigravity\brain\ffd397b9-8a66-46ff-8400-f1db9fe8b60d\scratch\trigger_oauth.py`
- **Sản sinh tự động:** `C:\Users\vu.hoang\.google_workspace_mcp\credentials\culturecodeproject@gmail.com.json`
- **Cấu hình hệ thống (Nếu chọn Phương án B):** `C:\Users\vu.hoang\.gemini\antigravity\mcp_config.json`

## 5. Rủi ro tiềm ẩn & Biện pháp phòng ngừa (Risks & Mitigations)
- **Rủi ro:** Cổng `8000` có thể bị chiếm dụng bởi một tiến trình khác.
  - *Biện pháp:* Kiểm tra trạng thái cổng trước khi chạy. Nếu bị chiếm dụng, sẽ tạm thời tắt tiến trình đang dùng cổng đó hoặc cấu hình cổng khác.
- **Rủi ro:** Không có quyền truy cập hoặc cấu hình Google Cloud Project hiện tại để thêm Test User.
  - *Biện pháp:* Khuyến nghị User tạo thông tin xác thực (credentials) riêng của mình theo Phương án B để chủ động kiểm soát.

## 6. Auditor Review (Đánh giá của Codex)
*Phần này dành riêng để đối tác Codex/Claude rà soát kiến trúc và đưa ra phản biện.*
*(Chờ rà soát)*

