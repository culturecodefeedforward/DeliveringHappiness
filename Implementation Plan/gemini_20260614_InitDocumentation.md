# Kế hoạch triển khai (Implementation Plan) - Khởi tạo tài liệu dự án đầy đủ (docs init)
**Ngày:** 14/06/2026  
**File Name:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260614_InitDocumentation.md`

## 1. Đề bài (Objective)
Khởi tạo cấu trúc tài liệu tiêu chuẩn cho dự án trong thư mục `./docs/` và cập nhật tệp `README.md` theo workflow `/ck:docs init`.

## 2. Hiện trạng (Current State)
- Dự án hiện đã có tệp `technical_specification.md`, `DH_PROJECT_HANDOVER.md` và `COLLABORATION_GUIDE.md` ở thư mục gốc.
- Dự án chưa có cấu trúc thư mục `./docs/` tiêu chuẩn với các tệp phân tích chi tiết cho việc quản lý mã nguồn và hướng dẫn chuyển giao dài hạn.

## 3. Giải pháp kỹ thuật (Technical Solution)
- Quét toàn bộ mã nguồn của dự án (loại trừ các thư mục nhạy cảm, caches như `.git`, `.vercel`).
- Tạo thư mục `./docs/` nếu chưa tồn tại.
- Tạo mới các tệp tài liệu:
  - `README.md` (Cập nhật bản rút gọn dưới 300 dòng, liên kết đến các tài liệu trong `docs/`).
  - `docs/project-overview-pdr.md` (Giới thiệu dự án, mục tiêu kinh doanh và yêu cầu kỹ thuật - Product Development Requirements).
  - `docs/codebase-summary.md` (Tổng quan cấu trúc thư mục và các tệp mã nguồn chính).
  - `docs/code-standards.md` (Tiêu chuẩn lập trình, các quy tắc quản lý branch và git worktree của dự án).
  - `docs/system-architecture.md` (Kiến trúc hệ thống: luồng đi của dữ liệu từ Form -> Webhook GAS -> CRM Sheets, và tích hợp Workspace MCP).
  - `docs/project-roadmap.md` (Lộ trình phát triển và các cột mốc dự án).
  - `docs/deployment-guide.md` (Hướng dẫn triển khai chi tiết lên Vercel và Google Apps Script).
  - `docs/design-guidelines.md` (Hướng dẫn thiết kế giao diện Glassmorphism, VietQR động và các thành phần UI).

## 4. Các file bị ảnh hưởng (Affected Files)
- Tạo mới và ghi nội dung cho:
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\README.md` (Ghi đè)
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\project-overview-pdr.md`
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\codebase-summary.md`
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\code-standards.md`
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\system-architecture.md`
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\project-roadmap.md`
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\deployment-guide.md`
  - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\design-guidelines.md`

## 5. Rủi ro tiềm ẩn (Risks)
- **Ghi đè tệp README.md cũ:** Cần sao lưu README.md hiện tại (nếu có nội dung quan trọng) trước khi viết đè. Tuy nhiên, hiện tại dự án không có tệp README.md ở thư mục gốc (đã kiểm tra qua `list_dir`). Do đó rủi ro này bằng 0.

## 6. Auditor Review (Đánh giá kiểm toán)
- Đảm bảo tài liệu được phân tách rõ ràng và phản ánh đúng thực trạng kỹ thuật hiện tại của dự án.

---
*Vui lòng phản hồi "Approve", "Đồng ý" hoặc "OK" để tiến hành tạo tài liệu.*
