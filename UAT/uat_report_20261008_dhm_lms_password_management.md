# BÁO CÁO KIỂM THỬ NGHIỆM THU (UAT REPORT): HỆ THỐNG ĐỔI MẬT KHẨU & BẢO MẬT HỌC VIÊN DHM LMS

- **Ngày thực hiện:** 08/10/2026
- **Mã kế hoạch tham chiếu:** `PLAN-DHM-LMS-PWD-20261008`
- **Dự án:** Teaching DH (`dhm-micro-lms`)
- **Claim level:** `Local done` (Kiểm chứng hoàn tất 100% bằng tự động hóa Playwright headless browser trên môi trường máy chủ cục bộ)
- **Tập tin đã tác động (Allowlist):**
  1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\index.html`
  2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js`
  3. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\authorized_roster.json`
- **Tập tin sao lưu dự phòng (Safety Backups):**
  - `dhm-micro-lms\index.html.bak_20261008_pwd_mgmt`
  - `dhm-micro-lms\app.js.bak_20261008_pwd_mgmt`

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ (EXECUTIVE SUMMARY)

Tất cả 3 kịch bản kiểm thử trọng yếu (UAT-01, UAT-02, UAT-03) đã được thực thi tự động qua Playwright (Chromium) và vượt qua 100% các tiêu chí nghiêm ngặt về an toàn dữ liệu, trải nghiệm giao diện và bảo mật tài khoản.

| Mã Kịch Bản | Mục Tiêu Kiểm Thử | Trạng Thái | Chi Tiết Nghiệm Thu |
| :--- | :--- | :---: | :--- |
| **UAT-01** | Bắt buộc đổi mật khẩu lần đầu (Cohort Apollo) | **PASS 100%** | Nhận diện học viên Apollo; Đăng nhập pass mặc định `1234` kích hoạt `#force-change-pwd-modal`; Chặn pass < 6 ký tự; Chặn dùng lại `1234`; Chặn lệch xác nhận; Đổi pass thành công lưu SHA-256; Đăng xuất & cấm dùng lại `1234`; Đăng nhập thành công với pass mới. |
| **UAT-02** | Tự đổi mật khẩu chủ động (Học viên cũ) | **PASS 100%** | Học viên cũ có SĐT đăng nhập bằng 4 số cuối; Mở modal `#self-change-pwd-modal`; Báo lỗi nếu nhập sai pass hiện tại; Cập nhật pass mới thành công; Vô hiệu hóa 4 số cuối SĐT cũ; Đăng nhập thành công với mật khẩu mới. |
| **UAT-03** | Mã bypass khẩn cấp giảng viên (`8888`) | **PASS 100%** | Giảng viên đăng nhập bằng mã `8888` cho bất kỳ tài khoản nào bỏ qua kiểm tra pass và bỏ qua force change pass để hỗ trợ học viên tức thời tại lớp. |

---

## 2. BẰNG CHỨNG THỰC THI CHI TIẾT (EVIDENCE LOGS)

```text
--- KHỞI CHẠY KIỂM CHỨNG TOÀN DIỆN DHM LMS PASSWORD MANAGEMENT ---

1. Điều hướng tới trang LMS...

--- [UAT-01] BẮT ĐẦU KIỂM CHỨNG: APOLLO FORCE CHANGE PASSWORD ---
  ✓ Nhận diện học viên: Apollo Test Learner (Apollo)
  ✓ Placeholder mật khẩu: 'Nhập mật khẩu khởi tạo (1234)'
  ✓ Modal bắt buộc đổi pass (#force-change-pwd-modal) đã hiển thị thành công
  ✓ Lỗi độ dài < 6: 'Mật khẩu mới phải có tối thiểu 6 ký tự.'
  ✓ Lỗi trùng pass mặc định: 'Không được sử dụng lại mật khẩu mặc định (1234). Vui lòng chọn mật khẩu mới.'
  ✓ Lỗi không khớp xác nhận: 'Mật khẩu xác nhận không khớp với mật khẩu mới. Vui lòng nhập lại.'
  ✓ Đã vào học thành công! Tên hiển thị: Apollo Test Learner
  ✓ Đã đăng xuất an toàn
  ✓ Đăng nhập lại bằng 1234 bị từ chối chính xác: 'Mật khẩu truy cập không đúng. Vui lòng kiểm tra lại.'
  ✓ Đăng nhập lại bằng mật khẩu mới 'Apollo#2026' THÀNH CÔNG VÀO HỌC!
>>> [UAT-01] HOÀN TẤT: PASS 100% <<<

--- [UAT-02] BẮT ĐẦU KIỂM CHỨNG: HỌC VIÊN CŨ TỰ ĐỔI MẬT KHẨU ---
  ✓ Nhận diện học viên cũ: Bùi Thùy Hương
  ✓ Học viên cũ đăng nhập bằng 4 số cuối SĐT (4656) thành công
  ✓ Modal tự đổi pass (#self-change-pwd-modal) đã hiển thị thành công
  ✓ Nhập sai mật khẩu hiện tại báo lỗi: 'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.'
  ✓ Đổi mật khẩu chủ động thành công và modal tự động đóng!
  ✓ Đăng nhập bằng pass cũ (4 số SĐT 4656) bị từ chối chính xác: 'Mật khẩu truy cập không đúng. Vui lòng kiểm tra lại.'
  ✓ Đăng nhập bằng mật khẩu mới 'Huong#2026' THÀNH CÔNG VÀO HỌC!
>>> [UAT-02] HOÀN TẤT: PASS 100% <<<

--- [UAT-03] BẮT ĐẦU KIỂM CHỨNG: MÃ KHẨN CẤP 8888 CỦA GIẢNG VIÊN ---
  ✓ Giảng viên bypass bằng 8888 thành công cho Apollo Manager Test (bỏ qua bắt buộc đổi pass để cứu nguy)
>>> [UAT-03] HOÀN TẤT: PASS 100% <<<

=======================================================
TẤT CẢ 3 KỊCH BẢN UAT ĐÃ VƯỢT QUA 100% (LOCAL DONE)!
=======================================================
```

---

## 3. CÁC THAY ĐỔI KIẾN TRÚC ĐÃ TRIỂN KHAI

1. **Chuẩn Web Crypto API SHA-256 (`app.js`):**
   - Mã hóa băm một chiều client-side không phụ thuộc thư viện ngoại vi.
   - Lưu trữ an toàn trong `localStorage.dhm_roster_overrides` và đồng bộ qua Webhook CRM Google Sheets.
2. **Quy trình phân cấp xác thực (`verifyPassword`):**
   - *Ưu tiên 1:* Mã khẩn cấp giảng viên `8888` (bypass tức thì).
   - *Ưu tiên 2:* Mật khẩu cá nhân đã đổi (`password_hash`).
   - *Ưu tiên 3:* Mật khẩu khởi tạo `1234` kèm cờ `force_pwd_change` (bắt buộc đổi mật khẩu).
   - *Ưu tiên 4:* Cơ chế kế thừa 4 số cuối SĐT (học viên cũ chưa đổi pass).
3. **Giao diện Minimalist Amber Corporate (`index.html`):**
   - `#force-change-pwd-modal`: Popup bắt buộc đổi pass không có nút tắt, chặn thoát ra ngoài backdrop.
   - `#self-change-pwd-modal`: Popup tự đổi pass tích hợp nút 🔒 trên thanh điều hướng người dùng `#user-chip`.
4. **Dữ liệu Roster Mẫu (`authorized_roster.json`):**
   - Bổ sung 2 tài khoản mẫu của cohort Apollo: `learner.test@apollo.edu.vn` và `manager.test@apollo.edu.vn` với cờ `force_pwd_change: true`.
