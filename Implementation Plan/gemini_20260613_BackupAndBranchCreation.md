# Kế hoạch triển khai: Backup phiên bản hiện tại & Tạo nhánh mới

## 1. Đề bài
Yêu cầu "Backup phiên bản hiện tại, tạo nhánh mới" trong tình trạng thư mục làm việc đang vướng quá trình Git Merge bị xung đột (Merge Conflicts).

## 2. Hiện trạng
- Repo `dh4hn-website` đang ở trạng thái kẹt do **Merge Conflict** chưa được giải quyết (`both modified: index.html`, `technical_specification.md`...).
- Do có `unmerged paths`, Git khóa các lệnh chuyển nhánh (`git checkout -b` hoặc `git branch`).
- **Root cause/Pain point:** Không thể tạo nhánh mới theo cách thông thường thông qua Git nếu không giải quyết xong hoặc hủy bỏ tiến trình merge hiện tại.

## 3. Giải pháp kỹ thuật
Vì không thể sử dụng Git để nhánh tạm trạng thái conflict, phương án an toàn nhất là:
1. **Bước 1 (Backup):** Dùng lệnh Copy hệ thống (Powershell `Copy-Item`) để tạo một bản sao nguyên vẹn của toàn bộ thư mục dự án `dh4hn-website` sang một thư mục mới cạnh đó (ví dụ: `dh4hn-website_backup_conflict`). Việc này giúp lưu trữ chính xác trạng thái hiện hành kèm các file đang chỉnh sửa dở dang.
2. **Bước 2 (Clear State):** Gọi lệnh `git merge --abort` trên thư mục dự án gốc để thoát khỏi tiến trình merge, đưa working tree về trạng thái sạch của `main`.
3. **Bước 3 (Tạo nhánh mới):** Chạy lệnh `git checkout -b <tên_nhánh>` để tạo nhánh làm việc mới từ `main`.
4. **Bước 4 (Khôi phục nếu cần):** Sau khi có nhánh mới, người dùng có thể tự copy đè các file cần thiết từ thư mục backup sang nếu muốn tiếp tục công việc.

## 4. Các file bị ảnh hưởng
- Không có mã nguồn nào bị thay đổi trực tiếp bằng code mới, chỉ xử lý trạng thái thư mục và Git.
- Lệnh `git merge --abort` sẽ vứt bỏ các dòng conflict marker và mọi thay đổi chưa commit sinh ra từ thao tác merge.

## 5. Rủi ro tiềm ẩn & Cảnh báo (Risk & Guardrails)
- **Rủi ro mất dữ liệu tạm thời:** `git merge --abort` sẽ hủy những file đã sửa dở nhưng CHƯA commit. Do đó **bắt buộc phải chạy thành công Bước 1 (Copy Folder)** rồi mới chạy Bước 2.

## 6. Auditor Review
- [ ] Xác nhận lệnh Copy đã copy đủ toàn bộ `.git` và file chưa tracked.
- [ ] Xác nhận `git merge --abort` chỉ thực hiện khi thư mục backup đã an toàn.
- [ ] Chờ User cung cấp tên nhánh mới để thực hiện tạo nhánh.
