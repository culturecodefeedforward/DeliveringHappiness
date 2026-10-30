# Báo cáo Nghiệm thu: Dọn dẹp Dữ liệu Kiểm thử UAT trong DHM10_Data

## 1. Thông tin Tổng quan
- **Thời gian thực thi:** 24/10/2026 13:26:15 – 13:26:18
- **Đối tượng xử lý:** Bảng tính `DHM10_Data` (Sheet ID `1974314023` thuộc Spreadsheet `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`)
- **Tệp sao lưu an toàn:** `Artifacts/backups/DHM10_Data_backup_20261024_132617.json`
- **Biên bản kiểm toán:** `Artifacts/purge_audits/purge_audit_20261024_132618.json`

---

## 2. Chi tiết 4 Dòng Test Đã Xóa
| Vị trí ban đầu | Trạng thái | Họ tên | Email | SĐT | UUID |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **Dòng 2** | PENDING | Vũ Hoàng (Test UAT DHM10 HCM) | `vuhoang2708software@gmail.com` | 900001234 | `05d941da-e5f6-4232-81ec-f288ff001684` |
| **Dòng 4** | PAID | Test | `vuhoang2708@gmail.com` | 1213546785 | `126ed9ef-b17f-4c1e-95e3-72a463b8a278` |
| **Dòng 5** | PAID | Test 2 | `vuhoang2708@gmail.com` | 198756321 | `471b91e0-7db4-4245-be47-bbc405809af7` |
| **Dòng 6** | PENDING | Vũ Hoàng (Test UAT) | `vuhoang2708@gmail.com` | 0983453144 | `be3c0f8a-2d29-46e3-a3a3-a1adb2e22202` |

---

## 3. Kết quả Kiểm chứng Sau khi Dọn dẹp (Read-Back Verification)
- **Tổng số dòng hiện tại:** 20 dòng (1 dòng tiêu đề + **đúng 19 học viên thật**).
- **Học viên đã hoàn tất thanh toán (PAID):** **7 học viên**
  1. Dòng 3: Lê Vũ Nhật Vy (`vy.levunhat@apollo.edu.vn`)
  2. Dòng 4: Lê Thị Kim Cương (`cuong.le@apollo.edu.vn`)
  3. Dòng 5: Lý Thị Tố Viên (`vien.ly@apollo.edu.vn`)
  4. Dòng 6: Nguyễn Thị Như Ý (`nhuyschademan@gmail.com`)
  5. Dòng 18: Trần Đình Bảo Ngọc (`baongoc260604@gmail.com`)
  6. Dòng 19: Lê Nhã Nhật Hân (`nhathanln@gmail.com`)
  7. Dòng 20: **Phạm Uyên Trinh (`uyentrinhp@gmail.com`)**
- **Học viên chờ thanh toán (PENDING):** **12 học viên** (Trần Thị Thu Hà, Tran Thi Ngoc Ha, Tô Hoàng Phúc, Phuoc Nguyen, Hàn Phương Thanh, Phạm Trường Anh, Linh Tran Thi My, Hoàng Đặng Anh Khang, Nguyễn Phạm Đăng Khoa, Nguyễn Phi Yến, Yến Nguyễn, Vân).
- **Quota tuyển sinh:** `paidCount = 7 / 35` (chính xác 100%, không còn bị lệch hay đe dọa đóng sớm cổng đăng ký).
