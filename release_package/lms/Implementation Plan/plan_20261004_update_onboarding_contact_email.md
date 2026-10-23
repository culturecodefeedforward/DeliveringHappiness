# Kế Hoạch Triển Khai (Implementation Plan) — Cập Nhật Thông Báo Kích Hoạt Tài Khoản Sang Email CultureCode

- **Ngày lập**: 04/10/2026
- **Trạng thái**: Chờ phê duyệt Cấp độ 2 (Awaiting Level 2 Approval)
- **Mục tiêu**: Thay thế liên kết kích hoạt học viên chưa có trong danh sách từ nhóm Zalo BTC sang hướng dẫn gửi email hỗ trợ trực tiếp cho `culturecodeproject@gmail.com`.

---

## 1. Nguồn Chuẩn (Source of Truth) & Yêu Cầu Người Dùng
- **Nội dung cũ**:
  ```markdown
  [Đã đóng học phí? Nhắn Zalo BTC để kích hoạt ➔](https://zalo.me/g/kizonq8jygheahn3urod)
  ```
- **Nội dung mới theo yêu cầu**:
  ```text
  "Đã hoàn thành đăng ký, email cho culturecodeproject@gmail.com"
  ```
- **Hành vi tương tác UI**:
  Thẻ liên kết `<a>` được cập nhật `href="mailto:culturecodeproject@gmail.com"` để học viên nhấp vào sẽ tự động mở ứng dụng gửi thư điện tử gửi trực tiếp tới hòm thư BTC CultureCode.

---

## 2. Danh Sách Tệp Trong Phạm Vi (Allowlist)

1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\index.html` (dòng ~2173)
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html` (dòng ~2173 - tệp đồng bộ phát hành)

---

## 3. Ranh Giới An Toàn (Boundary & Exclusions)
- **Không can thiệp ngoài phạm vi**: Không sửa đổi biểu mẫu đăng ký trải nghiệm học thử (Trial Form), logic xác thực số điện thoại, danh bạ học viên hoặc mã nguồn backend Apps Script.
- **Không động chạm biểu mẫu khác**: Tệp `register_nvc.html` là biểu mẫu dành riêng cho chương trình Giao tiếp trắc ẩn (NVC) với mã QR nhóm Zalo Blooming On giữ nguyên, không thuộc phạm vi xử lý.

---

## 4. Chi Tiết Đoạn Mã Thay Đổi (Code Diff Specification)

### Tại `dhm-micro-lms/index.html` và `lms/index.html`:
```html
<!-- TRƯỚC KHI SỬA -->
<div class="mt-1">
    <a href="https://zalo.me/g/kizonq8jygheahn3urod" target="_blank" rel="noopener noreferrer" class="text-brand-amber font-bold underline hover:text-amber-300">
        Đã đóng học phí? Nhắn Zalo BTC để kích hoạt ➔
    </a>
</div>

<!-- SAU KHI SỬA -->
<div class="mt-1">
    <a href="mailto:culturecodeproject@gmail.com" class="text-brand-amber font-bold underline hover:text-amber-300">
        Đã hoàn thành đăng ký, email cho culturecodeproject@gmail.com
    </a>
</div>
```

---

## 5. Phương Án Triển Khai (Execution Steps)
1. **Bước 1 (Sao lưu)**: Tạo bản sao lưu `.bak_20261004_email_contact` cho cả 2 tệp `index.html` trước khi sửa.
2. **Bước 2 (Chỉnh sửa)**: Sử dụng công cụ `replace_file_content` thực hiện thay đổi chính xác khối mã HTML đã định rõ.
3. **Bước 3 (Kiểm chứng UTF-8 & Đọc lại)**: Đọc lại toàn bộ nội dung tệp bằng UTF-8 explicit, chạy `git diff` để xác minh chỉ thay đổi đúng 3 dòng mã mong muốn, không phát sinh side-effect.
4. **Bước 4 (Báo cáo & Phê duyệt Cấp độ 3)**: Báo cáo kết quả kiểm tra cục bộ (`Local done`), sẵn sàng cấp phê duyệt Cấp độ 3 nếu người dùng muốn commit hoặc deploy.

---

## 6. Phương Án Quay Lui (Rollback Plan)
Nếu có bất kỳ sai sót nào trong quá trình thực thi:
- Phục hồi tức thì bằng Git: `git checkout -- dhm-micro-lms/index.html` và `git checkout -- lms/index.html`.
- Hoặc sao chép đè từ các bản sao lưu `.bak_20261004_email_contact`.
