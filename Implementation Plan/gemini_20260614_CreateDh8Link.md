# KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN) - TẠO ĐƯỜNG DẪN MỚI `/dh8` CHO ĐĂNG KÝ DHM8
*Ngày thực hiện: 14/06/2026*
*Mã cuộc trò chuyện (Conversation ID): ffd397b9-8a66-46ff-8400-f1db9fe8b60d*

---

## 1. ĐỀ BÀI (REQUIREMENT)
Tạo một đường dẫn URL mới dạng `/dh8` cho trang đăng ký DHM8 để tăng nhận diện thương hiệu ngắn gọn và dễ chia sẻ cho chiến dịch.

---

## 2. HIỆN TRẠNG (CURRENT STATE)
- Trang đăng ký hiện tại nằm ở tập tin `register.html` tại thư mục gốc. Khi deploy lên Vercel, người dùng phải truy cập qua đường dẫn `/register.html`.
- Các tài nguyên như `tracking.js?v=2.3` và `register.js?v=1.0` được khai báo bằng đường dẫn tương đối (relative paths) trong `register.html`.

---

## 3. GIẢI PHÁP KỸ THUẬT (TECHNICAL SOLUTION)
Để giữ địa chỉ hiển thị thanh lịch là `/dh8` mà không cần cấu hình rewrite phức tạp hay làm hỏng khả năng chạy thử ngoại tuyến (offline), ta sẽ:
1. Tạo thư mục con `dh8/` tại thư mục gốc của dự án.
2. Sao chép nội dung của `register.html` thành `dh8/index.html`.
3. Trong tập tin `dh8/index.html`, điều chỉnh toàn bộ các đường dẫn tương đối trỏ ngược ra thư mục cha:
   - Thay `tracking.js?v=2.3` thành `../tracking.js?v=2.3`
   - Thay `register.js?v=1.0` thành `../register.js?v=1.0`
   - Thay `<a href="index.html"` thành `<a href="../index.html"`
4. Khi triển khai lên Vercel, việc truy cập vào `/dh8` hoặc `/dh8/` sẽ được Vercel tự động phân giải và phục vụ tập tin `dh8/index.html`.

---

## 4. CÁC TẬP TIN BỊ ẢNH HƯỞNG (FILES AFFECTED)
- `dh8/index.html` (Tập tin mới tạo)
- `Implementation Plan/gemini_20260614_CreateDh8Link.md` (Kế hoạch triển khai này)

---

## 5. RỦI RO & PHƯƠNG ÁN QUAY LUI (RISKS & ROLLBACK)
- **Rủi ro**: Không có rủi ro đáng kể đối với mã nguồn hiện tại vì không tác động đến các tập tin gốc ở thư mục mẹ (`register.html`, `register.js`, `tracking.js`).
- **Rollback (Quay lui)**: Xóa thư mục `dh8/` và commit lại.

---

## 6. AUDITOR REVIEW
- Codex hoặc Claude có thể phản biện cấu trúc thư mục tĩnh của Vercel. Cấu trúc thư mục con tĩnh là chuẩn an toàn nhất cho các website HTML tĩnh thuần túy.
