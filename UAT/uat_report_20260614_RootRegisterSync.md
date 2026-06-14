# BÁO CÁO KIỂM THỬ NGHIỆM THU NGƯỜI DÙNG (UAT REPORT) - ĐỒNG BỘ HÓA BIỂU MẪU ĐĂNG KÝ GỐC REGISTER.HTML
*Ngày thực hiện: 14/06/2026*
*Mã cuộc trò chuyện (Conversation ID): f38ea60d-d6c2-48c3-871d-249e44527ed7*

---

## 1. MỨC ĐỘ XÁC THỰC (CLAIM LEVELS)

- **`VERIFIED` (Đã kiểm chứng)**:
  - Cấu trúc tệp [register.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html) đã được đồng bộ hóa thành công:
    - Trường **Linkedin Public profile & URL** (`name="linkedin"`) đã được thêm vào và đặt bắt buộc (`required`) ngay phía sau trường Email.
    - Hai trường thông tin người giới thiệu riêng biệt: **Tên người giới thiệu** (`name="referrerName"`) và **Số điện thoại người giới thiệu** (`name="referrerPhone"`) đã được thêm vào ở cuối form.
    - Trường chương trình đã tham gia (`attendedPrograms`) đã được chuyển đổi từ ô nhập text tự do thành nhóm **checkbox** (`CultureCode CC101`, `Trà Chiều`, `Blooming on`, và một mục checkbox `Khác` đi kèm input text).
    - Vị trí của trường `attendedPrograms` đã được di chuyển xuống sau phần nguồn nghe thông tin chương trình (`sourceHearing`).
  - Đã chạy kịch bản kiểm thử tự động trên DOM qua Python script ([verify_dom.py](file:///C:/Users/vu.hoang/.gemini/antigravity/brain/f38ea60d-d6c2-48c3-871d-249e44527ed7/scratch/verify_dom.py)), xác nhận thứ tự các trường, thuộc tính `name` và tính toàn vẹn của HTML. Kết quả: `DOM verification passed successfully!`.
  - Không có placeholder rác (`// ...` hoặc `TODO`) nào xuất hiện trong tệp logic hay HTML được sửa đổi.

- **`INFERRED` (Suy luận lý thuyết)**:
  - Do `register.js` sử dụng đối tượng `FormData` để tự động tuần tự hóa tất cả dữ liệu biểu mẫu động có thuộc tính `name` để gửi đi, các thuộc tính mới (`linkedin`, `referrerName`, `referrerPhone`) sẽ tự động được gửi thành công đến Webhook Google Apps Script CRM mà không cần sửa đổi thêm mã JavaScript.
  - Các ô checkbox `attendedPrograms` sẽ tự động được gộp thành chuỗi ngăn cách bởi dấu phẩy nhờ logic gộp chuỗi có sẵn trong `register.js`.

- **`UNVERIFIED` (Chưa kiểm chứng)**:
  - Dữ liệu thực tế ghi nhận đúng cột trên Google Sheet CRM (cần thực hiện gửi form live trên môi trường sản phẩm sau khi deploy và kiểm tra bản ghi mới nhất trên Google Sheets).

---

## 2. KẾT QUẢ KIỂM THỬ (TEST RESULTS)

- **Đường pass (UAT Path)**: `PASS - normal path` (luồng cấu trúc DOM và logic gom nhóm các trường được verify thành công).
- **Công cụ kiểm tra (Validation Tool)**: Script kiểm thử tự động [verify_dom.py](file:///C:/Users/vu.hoang/.gemini/antigravity/brain/f38ea60d-d6c2-48c3-871d-249e44527ed7/scratch/verify_dom.py). Output thực thi:
  ```text
  SUCCESS: Verified 'linkedin' field exists
  SUCCESS: Verified 'referrerName' field exists
  SUCCESS: Verified 'referrerPhone' field exists
  SUCCESS: Verified 'attendedPrograms' checkbox group exists
  SUCCESS: Verified order: sourceHearing comes before attendedPrograms
  SUCCESS: Verified order: email comes before linkedin

  DOM verification passed successfully!
  ```

---

## 3. PHÂN LOẠI FILE (FILE CATEGORIZATION)

Theo kết quả kiểm tra `git status --short --branch` lúc 17:50 ngày 14/06/2026:

- **`Files safe to stage` (File an toàn để stage)**:
  - [register.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html) (Mã nguồn giao diện biểu mẫu đã được cập nhật)
  - [UAT/uat_report_20260614_RootRegisterSync.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/uat_report_20260614_RootRegisterSync.md) (Báo cáo UAT này)
- **`Files already committed` (File đã được commit trước)**:
  - *Không có file nào.*
- **`Files not safe to stage` (File không an toàn để stage - Ngoài phạm vi commit)**:
  - Các kế hoạch triển khai và file nháp trong thư mục `Implementation Plan/` (sẽ giữ lại hoặc commit riêng rẽ).

---

## 4. KHUYẾN NGHỊ BƯỚC TIẾP THEO (NEXT STEPS RECOMMENDATION)

1. **User Approval (Yêu cầu phê duyệt từ User)**:
   - User gõ trực tiếp lệnh phê duyệt (ví dụ: `Approve` hoặc `OK`) để tiến hành Stage, Commit và Push các thay đổi của [register.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html) lên GitHub repository.
2. **Kiểm tra ghi nhận dữ liệu Live (Live Sheet Verification)**:
   - Sau khi Vercel tự động deploy bản cập nhật của [register.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html) lên production, tiến hành gửi 1 biểu mẫu thử nghiệm thực tế trên link Live để xác nhận cột `linkedin`, `referrerName` và `referrerPhone` nhận dữ liệu chuẩn xác trên Google Sheet CRM.
