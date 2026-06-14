# BÁO CÁO KIỂM THỬ NGHIỆM THU NGƯỜI DÙNG (UAT REPORT) - KHÔI PHỤC BIỂU MẪU ĐĂNG KÝ DHM8 & ĐƯỜNG DẪN `/dh8`
*Ngày thực hiện: 14/06/2026*
*Mã cuộc trò chuyện (Conversation ID): ffd397b9-8a66-46ff-8400-f1db9fe8b60d*

---

## 1. MỨC ĐỘ XÁC THỰC (CLAIM LEVELS)

- **`VERIFIED` (Đã kiểm chứng)**:
  - Bố cục trang đăng ký `register.html` tải đầy đủ, responsive (tương thích mọi thiết bị) và không bị lỗi hiển thị.
  - Đường dẫn URL mới `/dh8/` (sử dụng thư mục con `dh8/index.html`) hoạt động hoàn hảo. Nhật ký máy chủ (server logs) xác nhận trình duyệt tải thành công tài nguyên từ thư mục cha thông qua tương đối trỏ ngược (`../tracking.js?v=2.3` và `../register.js?v=1.0` đều trả về HTTP 200).
  - Hộp thông tin thanh toán (`payment-info`) hiển thị chính xác **2 tài khoản ngân hàng** (cá nhân BIDV và doanh nghiệp MB) kèm theo đúng cú pháp chuyển khoản chuẩn: `DHM8 - [SĐT] - [Họ tên]`.
  - Logic Javascript trong `register.js` xử lý chuẩn xác dữ liệu khi người dùng chọn "Khác" (cho cả nguồn biết và mục đích), ghép chuỗi tự động và gửi payload về CRM qua `window.logToSheet` với tag `EVENT_LEAD_DHM8` và `event_id` cố định: `DHM8_REG_040726`.
  - Luồng gửi biểu mẫu hoạt động tốt dưới môi trường local, hiển thị màn hình thông báo **"Đăng ký thành công!"** ngay sau khi gửi form và ẩn form/header đi để tránh gửi trùng lặp.
- **`INFERRED` (Suy luận lý thuyết)**:
  - Máy chủ live Vercel sẽ tự động phục vụ thư mục con `/dh8` mà không cần bất cứ cấu hình rewrite đặc biệt nào.
- **`UNVERIFIED` (Chưa kiểm chứng)**:
  - Bản ghi thực tế trong Google Sheets CRM trực tiếp trên tài khoản Google của Admin (cần Admin mở Google Sheet kiểm tra xem dữ liệu test đã đổ về dòng mới nhất chưa).

---

## 2. KẾT QUẢ KIỂM THỬ (TEST RESULTS)

- **Đường pass (UAT Path)**: `PASS - normal path` (luồng đăng ký, xử lý payload và hiện màn hình thanh toán hoạt động trơn tru).
- **Bằng chứng kiểm thử (Evidence Screenshots)**:
  - **Trang đăng ký lúc mới tải**: [dhm8_register_loaded.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_register_loaded.png)
  - **Form điền đầy đủ thông tin (Phần 1)**: [dhm8_form_filled_part1.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_form_filled_part1.png)
  - **Form điền đầy đủ thông tin (Phần 2)**: [dhm8_form_filled_part2.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_form_filled_part2.png)
  - **Màn hình thông báo đăng ký thành công & thông tin chuyển khoản**: [dhm8_register_success.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_register_success.png)
  - **Log tải tài nguyên thành công từ /dh8/**:
    - `GET /dh8/ HTTP/1.1` -> 200
    - `GET /tracking.js?v=2.3 HTTP/1.1` -> 200 (parent file parsed)
    - `GET /register.js?v=1.0 HTTP/1.1` -> 200 (parent file parsed)

---

## 3. PHÂN LOẠI FILE (FILE CATEGORIZATION)

Theo kết quả kiểm tra `git status --short --branch` lúc 12:32 ngày 14/06/2026:

- **`Files safe to stage` (File an toàn để stage)**:
  - `dh8/index.html` (Mã nguồn trang định tuyến mới)
  - `register.html` (Mã nguồn giao diện native form)
  - `register.js` (Mã nguồn logic xử lý biểu mẫu)
  - `UAT/dhm8_register_loaded.png` (Ảnh minh chứng UAT)
  - `UAT/dhm8_form_filled_part1.png` (Ảnh minh chứng UAT)
  - `UAT/dhm8_form_filled_part2.png` (Ảnh minh chứng UAT)
  - `UAT/dhm8_register_success.png` (Ảnh minh chứng UAT)
  - `UAT/dhm8_register_uat_report_20260614.md` (Báo cáo UAT này)
- **`Files already committed` (File đã được commit trước)**:
  - *Không có file nào.*
- **`Files not safe to stage` (File không an toàn để stage - Ngoài phạm vi commit)**:
  - Các kế hoạch triển khai nháp trong thư mục `Implementation Plan/` (cần giữ lại để lưu lịch sử cục bộ hoặc commit riêng lẻ sau, tránh trộn lẫn vào commit tính năng).

---

## 4. KHUYẾN NGHỊ BƯỚC TIẾP THEO (NEXT STEPS RECOMMENDATION)

1. **User Approval (Yêu cầu phê duyệt từ User)**:
   - User gõ trực tiếp lệnh phê duyệt (ví dụ: `Approve` hoặc `OK`) để tiến hành Stage, Commit và Push các file trong nhóm `Files safe to stage` lên GitHub repository.
2. **Deploy & Live Verification**:
   - Sau khi push code, User hoặc Vercel CI/CD sẽ triển khai lên môi trường live. Tiến hành kiểm tra nhanh trên link live của trang để xác nhận.
