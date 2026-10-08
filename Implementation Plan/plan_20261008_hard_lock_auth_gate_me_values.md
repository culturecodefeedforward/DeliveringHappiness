# 📋 Kế Hoạch Triển Khai: Chuẩn Hóa Cổng Khóa Cứng (Email & Mật Khẩu 4 Số Cuối SĐT) Cho Bài Test La Bàn Giá Trị (Me Values)

> **Mã kế hoạch:** `PLAN-20261008-HARD-LOCK-AUTH-GATE-ME-VALUES`  
> **Ngày lập:** 08/10/2026  
> **Dự án:** Delivering Happiness Masterclass (DHM) — `dh4hn-website`  
> **Người phê duyệt:** Sếp Vũ (Dzũ)  
> **Mục tiêu:** Clone chuẩn hóa 100% cơ chế khóa cứng của LMS sang bài test La Bàn Giá Trị (`personal-value.html` & `personal-value.js`), bắt buộc học viên nhập đúng **Email + Mật khẩu (4 số cuối SĐT)** mới được mở khóa làm bài, loại bỏ hoàn toàn cơ chế thả lỏng chỉ nhập 1 ô SĐT/Email không mật khẩu.

---

## I. BỐI CẢNH & YÊU CẦU NGHIỆP VỤ

1. **Vấn đề tồn đọng:**
   - Cổng xác thực của LMS chính (`/lms`): Bắt buộc kiểm tra danh bạ học viên bằng 2 trường: **Email đã đăng ký** và **Mật khẩu (4 số cuối SĐT)**.
   - Cổng của Me Values (`personal-value.html`): Hiện tại chỉ có 1 ô nhập liệu duy nhất (nhập Email hoặc SĐT) là mở khóa ngay mà không kiểm tra mật khẩu.
   - Điều này tạo lỗ hổng: Bất kỳ ai chỉ cần biết email hoặc số điện thoại của học viên khác là có thể vào làm bài test và ghi đè dữ liệu la bàn giá trị của học viên đó.
2. **Yêu cầu chuẩn hóa theo chỉ đạo của Sếp:**
   - Clone nguyên bản cơ chế khóa cứng của LMS sang Me Values: Bắt buộc học viên phải nhập **Email** và **Mật khẩu** (mặc định 4 số cuối SĐT).
   - Chỉ khi khớp cả Email và Mật khẩu trong danh bạ `authorized_roster.json` mới được mở khóa bài làm.
   - Nếu chưa đăng ký hoặc nhập sai thông tin: Khóa cứng hoàn toàn, chuyển hướng sang form đăng ký chính thức hoặc đăng ký nhận link trải nghiệm.
   - Giữ nguyên cơ chế kế thừa phiên LMS liền mạch (Seamless Session): Học viên đã đăng nhập LMS chuyển sang sẽ tự động nhận diện và vào thẳng 0 giây chờ.

---

## II. THIẾT KẾ KIẾN TRÚC CHI TIẾT

### 1. Giao diện Cổng Khóa Cứng (Auth Gate Modal) trên `personal-value.html`
- **Tiêu đề:** `Đăng Nhập Khảo Sát La Bàn Giá Trị`
- **Khối nhập liệu chính:**
  * **Trường 1:** `Email học viên đã đăng ký *` (`#agEmailInput`), placeholder: `Ví dụ: hocvien@gmail.com`.
  * **Trường 2:** `Mật khẩu truy cập *` (`#agPasswordInput`), placeholder: `Nhập 4 số cuối Số điện thoại của bạn`.
  * Nút `👁️ Hiện/Ẩn mật khẩu`.
  * Nút hành động: `[🚀 Đăng Nhập & Vào Làm Bài]` (`#agBtnVerifyLogin`).
- **Banner thông báo lỗi (`#agErrorBanner`):**
  * Lỗi sai mật khẩu: *"Mật khẩu không chính xác. Vui lòng nhập 4 số cuối Số điện thoại của bạn."*
  * Lỗi không tìm thấy email: *"Email không khớp với danh sách học viên chính thức."* -> Kèm nút mở Form Đăng Ký Trải Nghiệm.
- **Khối Đăng Ký Trải Nghiệm (Dành cho khách chưa có tài khoản):**
  * Giữ nguyên form thu thập: Họ tên, Số điện thoại (10 số), Email, Checkbox Nghị định 13/2023/NĐ-CP.
  * Nút: `[Nhận Liên Kết Kích Hoạt Qua Email]`.

### 2. Logic Xác Thực Khóa Cứng trong `personal-value.js`
- **Hàm `verifyLearnerCredentials(email, password, roster)`:**
  1. Tìm học viên trong `authorized_roster.json` theo `email.toLowerCase().trim()`.
  2. Nếu không thấy -> Trả về `{ success: false, reason: "not_found" }`.
  3. Nếu tìm thấy học viên -> Kiểm tra mật khẩu:
     - Khẩn cấp: `password === "8888"` -> Pass.
     - Đã đổi pass: Đối chiếu hash SHA-256 từ `dhm_roster_overrides`.
     - Pass mặc định khởi tạo: `default_pwd` hoặc `"1234"`.
     - Chuẩn mặc định: Đối chiếu với 4 số cuối của số điện thoại học viên (`phone_last4` hoặc 4 số cuối của `phone`).
  4. Nếu pass sai -> Trả về `{ success: false, reason: "wrong_password" }`.
  5. Nếu pass đúng -> Lưu session `dhm_user_auth` (và `dhm_lms_auth_user`), đóng Modal và vào thẳng Bước 1.

### 3. Cơ Chế Kế Thừa Phiên Liền Mạch (LMS Session Pass-through)
- Đọc `localStorage.getItem("dhm_lms_auth_user")`. Nếu có session học viên hợp lệ -> Đóng Modal, tự động điền thông tin và mở khóa bài làm.
- Đọc URL param `?source=lms&email=...`. Nếu hợp lệ -> Đóng Modal và mở khóa bài làm.

---

## III. ALLOWLIST TỆP TIN & BẢN SAO LƯU (ROLLBACK)

| Tệp tin tác động | Đường dẫn tuyệt đối | Bản sao lưu an toàn (.bak) |
|---|---|---|
| `personal-value.html` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\personal-value.html` | `personal-value.html.bak_20261008_hard_lock` |
| `personal-value.js` | `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\personal-value.js` | `personal-value.js.bak_20261008_hard_lock` |

---

## IV. MA TRẬN KIỂM THỬ NGHIỆM THU (UAT TEST MATRIX)

1. **TC-01 (Nhập Email đúng, Mật khẩu đúng 4 số cuối SĐT):**
   - Input: Email học viên trong roster + 4 số cuối SĐT.
   - Kỳ vọng: Đăng nhập thành công, mở khóa bài làm ngay lập tức.
2. **TC-02 (Nhập Email đúng, Mật khẩu sai):**
   - Input: Email học viên trong roster + Mật khẩu sai (ví dụ `0000`).
   - Kỳ vọng: Báo lỗi *"Mật khẩu không chính xác"*, KHÔNG mở khóa, bắt buộc nhập lại.
3. **TC-03 (Nhập Email không có trong Roster):**
   - Input: `unknown@gmail.com` + bất kỳ pass nào.
   - Kỳ vọng: Báo lỗi *"Email không khớp với danh sách học viên"*, hiển thị form đăng ký trải nghiệm.
4. **TC-04 (Đi từ LMS sang - Đã đăng nhập):**
   - Kỳ vọng: Modal tự động ẩn, vào thẳng bài làm mà không phải gõ lại pass.

---

## V. MA TRẬN PHÊ DUYỆT (APPROVAL BOUNDARIES)

- **Cấp độ 2 (Hiện tại - Đã duyệt):** Tiến hành sao lưu `.bak`, sửa mã nguồn cục bộ theo Allowlist, và chạy kiểm thử tự động.
- **Cấp độ 3 (Bắt buộc xin duyệt riêng):** Trước khi `git commit`, `git push`, hoặc `vercel --prod` lên môi trường public.
