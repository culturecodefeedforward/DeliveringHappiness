# Walkthrough: Lọc Danh sách PENDING DHM9 & Gửi Thư Nhắc Thanh Toán Chặng Cuối

## 1. Tóm tắt Kết quả Thực hiện
Đã hoàn thành xuất sắc toàn bộ quy trình:
1. **Lọc và làm sạch dữ liệu:** Trích xuất CRM Google Sheet tab `DHM9_Data` (48 dòng, 31 PAID, 17 PENDING), loại trừ 4 bản ghi kiểm thử nội bộ, giữ lại đúng **13 học viên thật** ở trạng thái PENDING.
2. **Đối soát Backend Live:** Đối chiếu khớp 100% với API `checkRegistrationAvailability?lane=dh9` (31 suất chính thức hoàn tất, còn 9 suất trước khi đóng cổng).
3. **Hiệu chỉnh Mẫu Email Chuẩn hóa theo chỉ đạo của sếp Dzũ:**
   - Cập nhật thông điệp giữ chỗ nhẹ nhàng, chuyên nghiệp: *"Hiện tại, chương trình vẫn còn vài suất cuối cùng trước khi cổng tiếp nhận đóng lại để chốt công tác chuẩn bị và cattering."*
   - Cập nhật mốc thời gian: *"Thứ Bảy, 12/09/2026 (Từ 07:30 – 17:30, đón tiếp & check-in từ 07:15)"*.
   - Hướng dẫn xuất hóa đơn công ty: *"Trường hợp Anh/Chị đăng ký theo tổ chức/doanh nghiệp cần hóa đơn tài chính, xin vui lòng phản hồi trực tiếp email này kèm thông tin xuất hóa đơn (Tên công ty, MST, Địa chỉ, Email nhận hóa đơn) để được hướng dẫn tài khoản và nội dung chuyển tiền."*
   - Chạy script kiểm định động `Scripts/validate_email_template.py` đạt `=== DYNAMIC VALIDATION PASSED PROPERLY ===`.
4. **Kiểm thử gửi thư nghiệm thu (Live Test):** Đã gửi thành công email test tới `vuhoang2708@gmail.com` (Message ID: `1a0802549df03613`), sếp Dzũ đã kiểm tra Outlook và xác nhận nhận được thư lúc 15:32.
5. **Thực thi phát hành chính thức 100%:** Đã gọi trực tiếp công cụ `workspace-mcp-work` (`send_gmail_message`) gửi thành công trọn vẹn **13/13 email** từ tài khoản chính thức `culturecodeproject@gmail.com`, đính kèm **CC cho cả 3 thành viên BTC** (`vuhoang2708@gmail.com`, `chauhm71@gmail.com`, `hoanhn.edu.vn@gmail.com`), ghi nhận đầy đủ 13 Google Message ID thật.

---

## 2. Bảng Kết quả Phát hành 13 Email với Message ID Thật

| STT | Họ và tên | Email người nhận | Số điện thoại | Mã chuyển khoản | Google Message ID | Trạng thái Live |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| 1 | Hoa Trần | `hoatran1183@gmail.com` | 0985557923 | `DHM9985557923` | `1a08028fa9220a9f` | ✅ Đã gửi thành công |
| 2 | Hong Duong | `parentslearn2012@gmail.com` | 0912254650 | `DHM9912254650` | `1a080298110fc23e` | ✅ Đã gửi thành công |
| 3 | Ly Ngoc Anh | `lna.temp@gmail.com` | 0983081176 | `DHM9983081176` | `1a08029c5892d8e3` | ✅ Đã gửi thành công |
| 4 | Nguyen Kien | `ngayemradi_239@yahoo.com` | 0987115600 | `DHM9987115600` | `1a0802a12dcf8ce3` | ✅ Đã gửi thành công |
| 5 | Trần Thị Ngọc | `ngoccgv@gmail.com` | 0904522485 | `DHM9904522485` | `1a0802a4d32857d2` | ✅ Đã gửi thành công |
| 6 | Nguyễn Văn Đại | `dai.nguyen@mht.masangroup.com` | 0987566984 | `DHM9987566984` | `1a0802ae58e41836` | ✅ Đã gửi thành công |
| 7 | Ngọc Anh Đinh | `ngocanh.hrbp@gmail.com` | 0983725791 | `DHM9983725791` | `1a0802b1c5dabd0d` | ✅ Đã gửi thành công |
| 8 | Nguyễn Thị Thanh Huyền | `huyenhao2008@gmail.com` | 0988079798 | `DHM9988079798` | `1a0802b7ae790602` | ✅ Đã gửi thành công |
| 9 | Nguyễn Thanh Xuân | `xuannguyen24297@gmail.com` | 0967369742 | `DHM9967369742` | `1a0802bb427eadcc` | ✅ Đã gửi thành công |
| 10 | Nguyễn Quý Khoa | `support@keyperson.vn` | 0961695771 | `DHM9961695771` | `1a0802c110ff1ce1` | ✅ Đã gửi thành công |
| 11 | Nguyễn Quỳnh Anh | `anh.nq@gemsgroup.edu.vn` | 0983038396 | `DHM9983038396` | `1a0802c4a27c9cb6` | ✅ Đã gửi thành công |
| 12 | Nguyễn Tuyết Lê | `le.nt@gemsgroup.edu.vn` | 0931416813 | `DHM9931416813` | `1a0802cee1d7bc3b` | ✅ Đã gửi thành công |
| 13 | Lê thị kim bình | `kekimbinh07@gmail.com` | 0986256995 | `DHM9986256995` | `1a0802d2bd3f5ad0` | ✅ Đã gửi thành công |

---

## 3. Cấu hình Vận hành & Bằng chứng Kiểm toán (Audit Trails)
- **Kênh phát hành (Sender):** `culturecodeproject@gmail.com` (Display name: `CultureCode Team`)
- **Danh sách CC:** `vuhoang2708@gmail.com, chauhm71@gmail.com, hoanhn.edu.vn@gmail.com`
- **Tiêu đề email:** `[Delivering Happiness Masterclass] Nhắc lần cuối: Hoàn tất giữ chỗ tham gia lớp DHM9 cuối tuần này (Thứ Bảy, 12/09/2026)`
- **Tệp lưu vết kiểm toán:** `Artifacts/email_dispatches/dhm9_final_reminder_audit.json`
