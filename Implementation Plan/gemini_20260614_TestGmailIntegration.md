# Kế hoạch triển khai (Implementation Plan) - Thử nghiệm gửi Email qua Workspace MCP
**Ngày:** 14/06/2026  
**File Name:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260614_TestGmailIntegration.md`

## 1. Đề bài (Objective)
Thử nghiệm tính năng gửi email qua tích hợp Workspace MCP của tài khoản `culturecodeproject@gmail.com` tới địa chỉ nhận `vuhoang2708@gmail.com`.

## 2. Hiện trạng (Current State)
- **Tài khoản gửi:** `culturecodeproject@gmail.com` (Đã có file credential lưu tại `C:\Users\vu.hoang\.google_workspace_mcp\credentials\culturecodeproject@gmail.com.json`).
- **Phạm vi quyền (Scopes):** Tệp credential đã có sẵn các scope `gmail.send`, `gmail.compose`, `gmail.modify` (Đã xác nhận).
- **Yêu cầu:** Tạo một đoạn mã Python thử nghiệm (UAT) để gửi thử email, sau đó xác nhận kết quả gửi.

## 3. Giải pháp kỹ thuật (Technical Solution)
- Viết một script Python thử nghiệm `C:\Users\vu.hoang\.gemini\antigravity\brain\ffd397b9-8a66-46ff-8400-f1db9fe8b60d\scratch\test_send_email.py` sử dụng thư viện `googleapiclient` và Google OAuth credentials đã lưu.
- Cấu trúc email sẽ được mã hóa bằng base64 (`raw` message) theo đặc tả của Gmail API.
- Chạy script thử nghiệm và thu thập log kết quả trả về từ API.

## 4. Các file bị ảnh hưởng (Affected Files)
- Không chỉnh sửa tệp nguồn của dự án (Zero production files modified).
- Chỉ tạo script kiểm thử tạm thời trong thư mục `scratch`: `C:\Users\vu.hoang\.gemini\antigravity\brain\ffd397b9-8a66-46ff-8400-f1db9fe8b60d\scratch\test_send_email.py`.

## 5. Rủi ro tiềm ẩn (Risks)
- **Gmail API Limits:** Giới hạn quota gửi thư thử nghiệm của tài khoản Google chưa được xác minh (nhưng lượng gửi nhỏ 1 email không bị ảnh hưởng).
- **Spam Filter:** Mail thử nghiệm có thể bị rơi vào hộp thư rác (Spam) hoặc quảng cáo (Promotions) của người nhận.

## 6. Auditor Review (Đánh giá kiểm toán)
- **Codex / Claude Review:** Hãy đảm bảo cấu trúc gói MIME message được dựng chuẩn định dạng UTF-8 để tránh lỗi hiển thị ký tự đặc biệt.

---
*Vui lòng phản hồi "Approve", "Đồng ý" hoặc "OK" để tiến hành chạy script gửi email.*
