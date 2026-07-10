# DHM9 Hà Nội - Event Reschedule Runbook & Implementation Plan (Phiên bản Cập nhật)

Tài liệu này là **Quy trình dời lịch sự kiện** (Event Reschedule Runbook) và **Kế hoạch triển khai** (Implementation Plan) cho chương trình **Delivering Happiness Masterclass 9 (DHM9)** tại Hà Nội. Mục tiêu là dời ngày tổ chức từ **22/08/2026** sang **12/09/2026** và cập nhật địa điểm chính thức, giữ nguyên cơ sở hạ tầng kỹ thuật và event_id để đảm bảo an toàn tuyệt đối.

---

## 1. Quyết định nghiệp vụ đã chốt
1. **Một lớp học duy nhất**: DHM9 là cùng một lớp bị dời ngày, không phải event mới.
2. **Bảo toàn định danh (Event ID)**: Không thay đổi `event_id` kỹ thuật. Giữ nguyên `DHM9_REG_220826_HN` và `DH9_INTEREST_220826_HN` ở cả frontend và backend (Apps Script) để tránh lỗi downstream trong Google Sheet, đối soát thanh toán, và các báo cáo tự động.
3. **Chỉ sửa hiển thị public**: Chỉ cập nhật thông tin ngày/địa điểm hiển thị cho người dùng trên website.
4. **Không mutate Google Sheet**: Không thêm cột phụ, không cập nhật tự động dòng dữ liệu cũ trong lượt này.
5. **Không sửa đổi backend/Apps Script**: Không clasp push hay cập nhật Apps Script.
6. **Email & Zalo**: Chỉ chuẩn bị nội dung thông báo dựa trên email dời lịch DHM8 cũ, không gửi thật, không đổi tên nhóm/ghim tin Zalo khi chưa được approve riêng.

---

## 2. Các điểm dừng khẩn cấp (Hard Stop)
BTC và hệ thống bắt buộc dừng lại và báo `BLOCKED` nếu:
- Phát hiện bắt buộc phải thay đổi backend/event_id mới chạy được hệ thống.
- Phát hiện có yêu cầu thay đổi dữ liệu hoặc cấu trúc Google Sheet (mutate Sheet).
- **Không tìm thấy nội dung email dời lịch DHM8 cũ** trong lịch sử (Gmail Sent, repo, local logs, hay transcripts). Không tự viết email mới.
- Thư mục làm việc (working tree) bị dirty ngoài phạm vi cho phép và không cô lập được trước khi deploy.

---

## 3. Các Phase triển khai chi tiết

### Phase 1 - Chỉnh sửa website public tối giản
Chỉ chỉnh sửa phần text hiển thị ngày và địa điểm của DHM9 Hà Nội (ngày: `12/09/2026`, địa điểm: `SBB Healthcare Premium; tầng 6 - San tea house; 199 Trường Chinh - Hà Nội`):
- **[index.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)**: Thay đổi ngày hiển thị (dòng 78) và địa điểm (dòng 79).
- **[register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html)**: Thay đổi ngày và địa điểm hiển thị ở phụ đề (dòng 23). Giữ nguyên `<input type="hidden" name="event_id" value="DHM9_REG_220826_HN">` ở dòng 250.
- **[interest_dh9.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/interest_dh9.html)**: Thay đổi ngày hiển thị ở đoạn văn (dòng 141). Giữ nguyên `data.event_id = 'DH9_INTEREST_220826_HN'` ở dòng 214.
- **Kiểm tra [assessment.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/assessment.html)**: Xác nhận không chứa ngày/địa điểm cũ cứng.

### Phase 2 - Deploy live frontend và UAT
*Lưu ý: Chỉ thực hiện deploy và UAT sau khi sếp approve trực tiếp.*
- **Kiểm tra trạng thái Git**: Chạy `git status --short --branch` để đảm bảo tách biệt các tệp dirty ngoài phạm vi.
- **Cô lập & Bảo vệ phạm vi (Staging & Isolation)**:
  - Chỉ stage đúng 3 file frontend và 2 file tài liệu dời lịch mới:
    - `index.html`
    - `register_dh9_hanoi.html`
    - `interest_dh9.html`
    - `Implementation Plan/gemini_20260710_DHM9RescheduleRunbook.md`
    - `UAT/gemini_20260710_DHM9RescheduleEmailReuseReport.md`
    - `Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md`
  - Tuyệt đối không stage/push/deploy các file bẩn ngoài scope như:
    - `Scripts/active_code_gs_final.js` (Cấu hình Apps Script)
    - `docs/DHM8_REGISTRATION_PAYMENT_WORKFLOW.md` và `docs/DHM9_REGISTRATION_PAYMENT_WORKFLOW.md`
    - `Artifacts/deploy_backups/` và các artifacts cũ.
  - Sử dụng narrow staging (`git add <file>`) để đảm bảo không lẫn lộn file. Nếu không cô lập được, lập tức báo `BLOCKED`.
- **Deploy**: Thực hiện đẩy phần sửa đổi frontend lên Vercel.
- **Kiểm thử nghiệm thu (UAT)**:
  - Xác nhận hiển thị ngày mới/địa điểm mới trên 3 URL:
    - https://delivering-happiness.vercel.app/
    - https://delivering-happiness.vercel.app/register_dh9_hanoi.html
    - https://delivering-happiness.vercel.app/interest_dh9.html
  - Chụp ảnh màn hình desktop/mobile cho 3 trang và lưu tại: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\dhm9_reschedule_20260710\`
  - Tạo tài liệu báo cáo UAT tại: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_20260710_DHM9RescheduleLiveUAT.md`

### Phase 3 - Tìm và chuyển đổi email thông báo dời lịch DHM8 (Chưa gửi)
- **Tìm kiếm nguồn**:
  - Quét Gmail Sent của `culturecodeproject@gmail.com` qua Workspace MCP/browser.
  - Quét trong repo/artifacts/local transcripts bằng các từ khóa: `DHM8`, `dời lịch`, `đổi lịch`, `04/07`, `18/07`, `hoàn tiền`, `phí hậu cần`.
- **Nếu tìm thấy**:
  - Chuyển đổi thông tin sang DHM9 Hà Nội (thay ngày dời từ 22/08 sang 12/09, địa điểm mới `SBB Healthcare Premium...`, chính sách hoàn phí 250k). Giữ nguyên tone, câu cú và xưng hô của bản cũ.
  - Lưu bản DHM8 gốc và bản DHM9 adapted tại: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm9_reschedule_20260710\`
  - Tạo báo cáo tìm kiếm tại: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_20260710_DHM9RescheduleEmailReuseReport.md`
- **Nếu không tìm thấy**:
  - Dừng Phase 3, báo `BLOCKED` và chờ chỉ thị của sếp.

---

## 4. Kế hoạch Khôi phục (Rollback Plan)
Nếu xảy ra lỗi trong quá trình thực hiện sửa đổi frontend:
- Để khôi phục nhanh trên local: Export patch các file thay đổi hiện tại trước khi checkout, hoặc chỉ khôi phục các file frontend bằng:
  ```powershell
  git checkout -- index.html register_dh9_hanoi.html interest_dh9.html
  ```
- Trên live production: Trigger deploy lại Vercel từ commit stable gần nhất.
- Tuyệt đối không dùng `git reset --hard` hay các lệnh làm mất dữ liệu của các tệp đang dirty ngoài scope.
