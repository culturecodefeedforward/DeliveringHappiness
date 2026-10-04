# Báo Cáo Kiểm Thử Nghiệm Thu (UAT) — LMS v2.1: Email-Only Login & Mã PIN 4 Số Cuối SĐT

- **Dự án:** Delivering Happiness Masterclass (DHM) — Micro-Learning Course Player
- **Thời gian hoàn tất:** 28/09/2026 14:41:00 (Giờ Hà Nội)
- **Phạm vi cập nhật tinh chỉnh:**
  1. Tiêu đề phụ modal: Chuẩn hóa thành `Dành cho học viên Delivering Happiness Masterclass` (bỏ liệt kê DHM8, DHM9, DHM10).
  2. Bỏ hoàn toàn mật khẩu chung mặc định `dhm2026`.
  3. Bắt buộc đăng nhập chỉ bằng **Email** học viên; mật khẩu mặc định là **4 số cuối của Số điện thoại** đăng ký.
- **Môi trường kiểm thử:** Local Server (Port 3892) & Headless Chrome Puppeteer Automation
- **Kết quả:** 8/8 Ca Kiểm Thử Thành Công Tuyệt Đối (100% Pass)

---

## 1. Chi Tiết Kết Quả Kiểm Thử (Puppeteer Automation)

| STT | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---|:---|:---|:---|:---:|
| **TC1** | Xác minh Tiêu đề phụ & Kiểu ô nhập liệu | Mở modal đăng nhập | Không còn chữ "DHM8, DHM9, DHM10", trường là `type="email"` | Subtitle: "Dành cho học viên Delivering Happiness Masterclass", Input type: `email` | **PASS** |
| **TC2** | Nhận diện học viên qua Email | Gõ `hoatran1183@gmail.com` | Hiện lời chào: "Hoa Trần (DHM9)" | Hiện banner: "👋 Nhận diện học viên: Hoa Trần (DHM9)" | **PASS** |
| **TC3** | Xác minh BỎ mật khẩu `dhm2026` | Nhập pass `dhm2026` | Bị từ chối, báo lỗi mật khẩu | Báo lỗi: "Mật khẩu chưa chính xác" | **PASS** |
| **TC4** | Chặn dùng Số điện thoại làm tên đăng nhập | Gõ SĐT `0985557923` | Bị từ chối vì yêu cầu nhập Email | Báo lỗi không tìm thấy email | **PASS** |
| **TC5** | Đăng nhập bằng Email + 4 số cuối SĐT (`7923`) | Email + PIN `7923` | Đăng nhập thành công học viên Hoa Trần | Ẩn modal, hiển thị "Hoa Trần (DHM9)" | **PASS** |
| **TC6** | Điền và Lưu trữ Phản tư I • A • M | Nhập cả 3 ô I, A, M Chặng 1 | Dữ liệu được lưu và khôi phục sau reload | Khôi phục 100% nội dung cả 3 trường I, A, M | **PASS** |
| **TC7** | Xác minh Chặng 2: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy | Chuyển sang Chặng 2 | Hiển thị: Kết nối, Tự chủ, Tiến bộ | Hiển thị trọn vẹn 3 thẻ Đòn bẩy SDT | **PASS** |
| **TC8** | Đăng xuất & Đăng nhập học viên khác qua PIN SĐT | Email `chaupp89@gmail.com` + PIN `1943` | Đăng nhập thành công học viên Châu Phạm | Đăng nhập thành công: "Châu Phạm (DHM8)" | **PASS** |

---

## 2. Bằng Chứng Hình Ảnh Kiểm Thử (Screenshots)
- Màn hình Đăng nhập LMS v2.1: `Teaching DH/Artifacts/test_lms_v2_1_auth_modal.png`
- Nhận diện học viên qua Email: `Teaching DH/Artifacts/test_lms_v2_2_user_detected.png`
- Khung Phản Tư I • A • M đã điền: `Teaching DH/Artifacts/test_lms_v2_3_iam_filled.png`
- Chặng 2 Thuyết Tự Quyết (SDT): `Teaching DH/Artifacts/test_lms_v2_4_stage2_sdt.png`
