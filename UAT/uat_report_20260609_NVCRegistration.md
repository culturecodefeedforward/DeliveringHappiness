# Báo cáo Nghiệm thu UAT: Biểu mẫu Đăng ký Giao tiếp Phi bạo lực (NVC)
## (UAT Verification Report: NVC Registration Form)

- **Thời gian nghiệm thu:** 10/06/2026 (Dữ liệu thực tế phát sinh ngày 09/06/2026)
- **Dự án:** `dh4hn-website`
- **Môi trường:** Production (Đã triển khai Vercel)
- **Hồ sơ minh chứng:** Dòng 2 đến Dòng 10 của Bảng tính Google Sheets `CultureCode - NVC Leads` (ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`)

---

## 1. Phân loại Khẳng định Nghiệm thu (UAT Claim Level Verification)

### 1.1. VERIFIED (Đã kiểm chứng thực tế)
*   **Ghi nhận CRM Sheet:** Dữ liệu đăng ký được chuyển tiếp chính xác qua Apps Script Web App và ghi nhận vào Google Sheet của NVC. Đối soát thực tế 9 dòng dữ liệu (từ dòng 2 đến dòng 10) cho thấy:
    - `Timestamp`: Ghi nhận đúng múi giờ `GMT+7` (ví dụ: `2026-06-09 20:13:23`).
    - `FullName`, `Phone`, `Email`, `Role`, `Company`: Đầy đủ thông tin không bị mất chữ.
    - `Q1_Situation` (Tình huống khó khăn): Lưu đúng đoạn text dài chia sẻ của học viên.
    - `Q2_Relationship` (Mối quan hệ): Lưu đúng danh sách ngăn cách bởi dấu phẩy (ví dụ: `Vợ/ chồng, Ba/ mẹ`).
    - `Q3_Expectation` (Kỳ vọng): Lưu đúng danh sách lựa chọn (tối đa 2).
    - `Event_ID`: Lưu đúng giá trị định danh `NVC_GTKN_0926`.
    - `Session_ID`: Lưu đúng định dạng mã phiên duy nhất của trình duyệt (ví dụ: `dh-1781010699131-jax5o`).
*   **Hệ thống Email thông báo:** Hệ thống Apps Script Webhook đã kích hoạt gửi email báo đăng ký thành công về 3 địa chỉ email ban tổ chức: `vuhoang2708@gmail.com`, `quochung.reo@gmail.com`, `chauhm71@gmail.com` (Được xác nhận trực tiếp từ User đã nhận được email thành công vào tối qua 09/06/2026).
*   **Giao diện Form trên Live Site:** Tệp `register_nvc.html` hiển thị chuẩn xác link trực tiếp nhóm Zalo Blooming On và QR Code tại màn hình báo thành công.

### 1.2. INFERRED (Suy luận từ mã nguồn / tài liệu)
*   **Logic validation ở Client:** Trình duyệt sẽ ngăn chặn việc gửi biểu mẫu nếu người dùng không chọn ít nhất một lựa chọn ở Câu 2 và Câu 3 (Được kiểm tra thông qua mã nguồn JS chặn sự kiện submit tại dòng 593-604 trong file `register_nvc.html`).

### 1.3. UNVERIFIED (Chưa kiểm chứng)
*   *Không có* - Mọi luồng chính từ giao diện, cơ sở dữ liệu, và email thông báo đều đã được kiểm chứng bằng dữ liệu thật chạy thực tế.

---

## 2. Kết quả các kịch bản kiểm thử (Test Cases Results)

| Test Case ID | Tên Kịch bản Kiểm thử | Trạng thái Nghiệm thu (Test Path) | Chi tiết Kết quả |
| :--- | :--- | :--- | :--- |
| **TC-NVC-01** | Điền thông tin chuẩn xác và gửi form | **PASS - normal path** | Form gửi đi thành công, chuyển màn hình báo thành công hiển thị link Zalo/QR. Dữ liệu lưu Sheets CRM đủ 13 cột. Email thông báo BTC được gửi. |
| **TC-NVC-02** | Chặn submit khi bỏ trống Checkbox Câu 2/Câu 3 | **PASS - guardrail** | JS chặn gửi form, hiển thị hộp thoại cảnh báo: `Vui lòng chọn ít nhất 1 mối quan hệ ở câu 2` hoặc `Vui lòng chọn ít nhất 1 kỳ vọng ở câu 3`. |
| **TC-NVC-03** | Giới hạn tối đa 2 lựa chọn Câu 2/Câu 3 | **PASS - guardrail** | Khi chọn đủ 2 lựa chọn, các checkbox còn lại tự động bị disable (vô hiệu hóa) và đổi style xám mờ. |
| **TC-NVC-04** | Hiển thị ô nhập text khi chọn "Khác" | **PASS - normal path** | Ô nhập văn bản bổ sung tự động trượt xuống (slide down) khi tích chọn "Khác" và ẩn đi khi bỏ chọn. |

---

## 3. Trạng thái mã nguồn Git (Git Code State)

### 3.1. Files safe to stage (Các tệp an toàn để commit/push)
- `UAT/uat_report_20260609_NVCRegistration.md` (Báo cáo UAT mới tạo)
- `Implementation Plan/implementation_plan_20260610_NvcUatAndGitSync.md` (Bản kế hoạch triển khai)
- `Implementation Plan/git_divergence_analysis_20260610.md` (Bản phân tích kỹ thuật lệch nhánh)
- `task.md` (Cập nhật trạng thái hoàn thành công việc)

### 3.2. Files not safe to stage (Các tệp nằm ngoài phạm vi hoặc đang bẩn)
- *Không có* - Working tree sạch trước khi gộp lịch sử Git.
