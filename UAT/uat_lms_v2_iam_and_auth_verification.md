# Báo Cáo Kiểm Thử Nghiệm Thu (UAT) — LMS v2: Roster Authentication & Khung Phản Tư I • A • M

- **Dự án:** Delivering Happiness Masterclass (DHM) — Micro-Learning Course Player
- **Thời gian kiểm thử:** 28/09/2026 13:55:15 (Giờ Hà Nội)
- **Môi trường:** Local Server (Port 3892) & Headless Chrome Puppeteer Automation
- **Trạng thái kiểm thử:** 8/8 Kịch bản Thành Công Tuyệt Đối (100% Pass)

---

## 1. Mục Tiêu & Phạm Vi Triển Khai
1. **Tổng hợp Danh sách Học viên Hợp lệ (`Authorized Learner Roster`):**
   - Trích xuất và chuẩn hóa từ dữ liệu lịch sử các khóa DHM8, DHM9, các bản ghi đăng ký hợp lệ và đội ngũ BTC.
   - Tổng cộng: **117 học viên hợp lệ** được cấp quyền truy cập.
   - Tệp lưu trữ: `lms/authorized_roster.json`.
2. **Cơ chế Đăng nhập & Xác thực Thân thiện nhưng Bảo mật:**
   - Hỗ trợ đăng nhập linh hoạt bằng **Email** hoặc **Số điện thoại** đã đăng ký.
   - Nhận diện tức thì học viên theo thời gian thực khi gõ (Real-time detection).
   - Cơ chế mật khẩu kép:
     - Mật khẩu mặc định: `dhm2026`
     - Hoặc mã PIN **4 số cuối của Số điện thoại** đã đăng ký (ví dụ: SĐT `0985557923` -> PIN `7923`).
     - Mã PIN Giảng viên/Coach: `1979`.
   - Ngăn chặn triệt để người lạ ngoài danh sách với thông báo hướng dẫn rõ ràng liên hệ BTC.
3. **Cập nhật Khung Phản Tư 3 Thành Tựu I • A • M (Hạnh Phúc Bắt Đầu Từ TÔI):**
   - Áp dụng nguyên văn từ slide chính thức `DHM_online session_V1 2.pptx`:
     - **I — Interested (Tâm đắc nhất):** Bạn tâm đắc nhất điều gì từ bài học?
     - **A — Actionable (Hành động áp dụng):** Bạn sẽ áp dụng điều này vào thực tế như thế nào?
     - **M — Meaningful (Ý nghĩa sâu sắc):** Tại sao điều này lại có ý nghĩa quan trọng với bạn?
4. **Cập nhật Kiến thức Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc:**
   - Chặng 2 đưa đúng thuật ngữ Thuyết Tự Quyết (Self-Determination Theory - Deci & Ryan) cùng 3 Đòn bẩy:
     - **Đòn bẩy #1:** Cảm giác Kết nối
     - **Đòn bẩy #2:** Cảm giác Tự chủ
     - **Đòn bẩy #3:** Cảm giác Tiến bộ (Small Wins -> Dopamine tự nhiên -> Tự hào bản thân -> Hạnh phúc bền vững Eudaimonia; cảnh báo bẫy Bất lực tích tụ Learned Helplessness).

---

## 2. Kết Quả 8 Ca Kiểm Thử Tự Động (Puppeteer Automation)

| STT | Kịch bản Kiểm Thử (Test Case) | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---|:---|:---|:---|:---:|
| **TC1** | Khởi tạo trang & Kiểm tra Modal Đăng nhập | Mở `/lms/index.html` lần đầu | Modal đăng nhập hiển thị chắn màn hình, khóa nội dung | Modal `#auth-modal` hiển thị chính xác | **PASS** |
| **TC2** | Nhận diện học viên thời gian thực | Nhập `hoatran1183@gmail.com` | Hiện lời chào: "Hoa Trần (DHM9)" | Hiện banner: "👋 Nhận diện học viên: Hoa Trần (DHM9)" | **PASS** |
| **TC3** | Từ chối mật khẩu không hợp lệ | Nhập sai mật khẩu `wrongpass123` | Báo lỗi mật khẩu, hướng dẫn dùng `dhm2026` hoặc 4 số cuối SĐT | Banner lỗi hiển thị: "Mật khẩu chưa chính xác" | **PASS** |
| **TC4** | Chặn truy cập người lạ ngoài danh sách | Nhập `stranger@nowhere.com` | Báo lỗi chưa kích hoạt, hướng dẫn liên hệ Zalo BTC | Hiển thị thông báo hướng dẫn liên hệ Zalo BTC (0913.503.505) | **PASS** |
| **TC5** | Đăng nhập thành công với Pass mặc định | Email `hoatran1183@gmail.com` + Pass `dhm2026` | Ẩn modal, nạp session học viên, hiện tên trên thanh điều hướng | Đăng nhập thành công, hiển thị "Hoa Trần (DHM9)" | **PASS** |
| **TC6** | Điền và Lưu trữ Phản tư I • A • M | Nhập cả 3 ô I, A, M Chặng 1, bấm Lưu và tải lại trang | Dữ liệu phản tư được lưu nguyên vẹn sau reload | Kiểm chứng khôi phục 100% nội dung cả 3 trường I, A, M | **PASS** |
| **TC7** | Xác minh Chặng 2: Thuyết Tự Quyết & 3 Đòn bẩy | Chuyển sang Chặng 2 | Tiêu đề và thẻ tóm tắt hiển thị đúng 3 Đòn bẩy: Kết nối, Tự chủ, Tiến bộ | Hiển thị trọn vẹn 3 thẻ Đòn bẩy SDT và bộ chọn Me-We Values | **PASS** |
| **TC8** | Đăng xuất & Đăng nhập bằng SĐT + PIN 4 số cuối | SĐT `0985557923` + PIN `7923` | Đăng nhập thành công học viên Hoa Trần | Đăng nhập thành công, khôi phục đúng tiến độ | **PASS** |

---

## 3. Bằng Chứng Hình Ảnh Kiểm Thử (Screenshots Evidence)

1. **Màn hình Đăng nhập LMS v2 (Auth Modal):**
   - Đường dẫn: `Teaching DH/Artifacts/test_lms_v2_1_auth_modal.png`
2. **Nhận diện học viên tự động khi gõ Email/SĐT:**
   - Đường dẫn: `Teaching DH/Artifacts/test_lms_v2_2_user_detected.png`
3. **Giao diện 3 Thành Tựu I • A • M đã điền và lưu:**
   - Đường dẫn: `Teaching DH/Artifacts/test_lms_v2_3_iam_filled.png`
4. **Giao diện Chặng 2: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc:**
   - Đường dẫn: `Teaching DH/Artifacts/test_lms_v2_4_stage2_sdt.png`
