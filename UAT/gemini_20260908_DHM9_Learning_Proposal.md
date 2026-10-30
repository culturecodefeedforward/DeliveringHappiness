# Đề xuất Củng cố Quy tắc từ Bài học Thực tế (/learn)

**Ngày ghi nhận:** 08/09/2026  
**Sự cố đối chiếu:** Báo thành công ảo đợt gửi email nhắc thanh toán DHM9 (FastMCP subprocess token hết hạn `invalid_grant`, script con nuốt lỗi và tự gán `SUCCESS_NO_ID`, vi phạm Acceptance Surface Parity).  
**Nguyên tắc áp dụng:** Tuân thủ triệt để quy tắc **Consolidation First** (không tạo mục đánh số mới, tích hợp trực tiếp vào mục quy tắc tương ứng đã tồn tại).

---

## 1. Phân loại & Rà soát Toàn diện (Classification & Holistic Review)

| Phạm vi | Loại quy tắc | Vị trí đề xuất tích hợp (Consolidation Target) | Lý do lựa chọn vị trí |
| :--- | :--- | :--- | :--- |
| **Toàn cục (Antigravity Global)** | **Rule** | `C:\Users\vu.hoang\.gemini\config\AGENTS.md`<br>👉 **Mục 14:** *Quy tắc Kiểm toán Năng lực Công cụ MCP/CLI* | Mục 14 chuyên trách về kiểm toán schema, công cụ MCP, CLI và tài nguyên sinh từ API. Bổ sung điều khoản về cơ chế bắt lỗi MCP và cách ly phiên Auth là đúng vị trí gốc rễ. |
| **Cục bộ Dự án (Project-Local)** | **Rule** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\.agents\AGENTS.md`<br>👉 **Mục 6:** *Quy tắc Cấm Dùng Dữ liệu Giả lập cho Báo cáo Vận hành Live* | Mục 6 đang quản lý việc cấm báo cáo bằng dữ liệu mock/dry-run. Cần bổ sung hard gate yêu cầu Message ID thật và kiểm thử email trước khi gửi hàng loạt. |

---

## 2. Chi tiết Sửa đổi Đề xuất (Proposed Exact Diffs)

### Đề xuất 1: Củng cố Mục 14 trong `C:\Users\vu.hoang\.gemini\config\AGENTS.md`

Bổ sung Khoản 5 vào sau Khoản 4 của Mục 14:

```markdown
5. **Phòng chống Nuốt lỗi MCP & Lệch pha Phiên Xác thực (MCP Silent Error Masking & Subprocess Auth Decoupling):**
   - **Bắt buộc kiểm tra cờ lỗi MCP Protocol:** Các client/script gọi MCP (FastMCP, Python MCP Client) khi gặp lỗi từ Google API / External API thường không ném ngoại lệ (`raise Exception`) mà trả về payload JSON có cờ `isError: true` và `content: [{"type": "text", "text": "Error: ..."}]`. Agent và mọi script phụ trợ BẮT BUỘC phải kiểm tra rõ ràng:
     `if resp.get("isError") or "Error:" in send_text: raise RuntimeError(...)`
   - **Cấm Tuyệt đối Fallback Giả lập Thành công (`SUCCESS_NO_ID`):** Tuyệt đối không được viết code fallback tự gán thành công hoặc gán mã ID giả lập khi không bóc tách được mã định danh từ kết quả trả về của công cụ. Thiếu mã định danh hợp lệ (Message ID, Job ID, Transaction ID) thì mặc định là THẤT BẠI.
   - **Nhận diện Tách biệt Phiên Xác thực (Auth Session Decoupling):** Phiên MCP Server đang chạy trực tiếp trong Antigravity IDE duy trì token OAuth sống qua runtime của IDE; trong khi tiến trình con CLI chạy độc lập (như script Python tự gọi `workspace-mcp.exe`) đọc token từ tệp tĩnh có thể đã hết hạn (`invalid_grant`). Khi gửi dữ liệu hoặc email vận hành quan trọng, ưu tiên gọi trực tiếp qua công cụ Native MCP của Antigravity (`call_mcp_tool`) thay vì ủy quyền qua tiến trình con Python CLI không kiểm soát được trạng thái token.
```

---

### Đề xuất 2: Củng cố Mục 6 trong `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\.agents\AGENTS.md`

Bổ sung Khoản 4 vào sau Khoản 3 của Mục 6:

```markdown
4. **Cổng Kiểm chứng Bề mặt Phát hành Email Thật (Live Email Dispatch Verification Hard Gate):**
   - **Hard Gate Message ID thật:** Agent tuyệt đối KHÔNG được báo cáo một email hoặc chiến dịch gửi email là `Live done` hay `SUCCESS` nếu chưa có mã Google Message ID hợp lệ (chuỗi hex định dạng `^1a[0-9a-f]{14,}$`) trả về trực tiếp từ máy chủ Gmail. Báo cáo hoàn tất gửi email bắt buộc phải đính kèm bảng tra cứu Message ID thật của từng người nhận.
   - **Quy trình Kiểm thử Gửi 1 Bước (Pre-Flight Test Email):** Trước khi bấm nút gửi email hàng loạt cho học viên hoặc khách hàng, Agent bắt buộc phải thực hiện 1 lần gửi thử nghiệm (Test Email) tới hòm thư của người phụ trách/BTC, chờ phản hồi xác nhận đã thấy email xuất hiện trong hộp thư đến (Inbox) thực tế rồi mới được kích hoạt luồng gửi hàng loạt.
```

---

## 3. Kế hoạch Kiểm chứng (Verification Plan)
1. Kiểm tra UTF-8 encoding và cú pháp Markdown sau khi áp dụng vào 2 tệp quy tắc.
2. Kiểm tra việc hiển thị đúng của các liên kết và cấu trúc phân mục.
3. Không làm ảnh hưởng đến các mục quy tắc đã có xung quanh.
