# BÁO CÁO KIỂM THỬ LIVE BROWSER E2E: TẠO TÀI KHOẢN TEST VUHOANG2708SOFTWARE & CULTURECODEPROJECT
## Mã kế hoạch: PLAN-20261005-CREATE-TEST-ACCOUNT-VUHOANG2708SOFTWARE
## Ngày thực hiện: 05/10/2026
## Môi trường: Production Vercel (`https://delivering-happiness.vercel.app/lms/`)
## Trạng thái nghiệm thu: LIVE DONE (6/6 hạng mục PASS 100%)

---

### I. THÔNG TIN 2 TÀI KHOẢN KIỂM THỬ ĐÃ TRIỂN KHAI

1. **Tài khoản 1:**
   - **Email:** `vuhoang2708software@gmail.com`
   - **Mật khẩu (4 số cuối SĐT):** `1234` (SĐT định danh: `0900001234`)
   - **Tên hiển thị:** `Vũ Hoàng (Test)`
   - **Mã định danh:** `COACH-007`
   - **Phân nhóm (Cohort):** `BTC / Coach`
   - **Vai trò (Role):** `Coach` (Mở full toàn bộ các chặng 1, 2, 3)

2. **Tài khoản 2:**
   - **Email:** `culturecodeproject@gmail.com`
   - **Mật khẩu (4 số cuối SĐT):** `1234` (SĐT định danh: `0900001234`)
   - **Tên hiển thị:** `Culture Code (Test)`
   - **Mã định danh:** `COACH-008`
   - **Phân nhóm (Cohort):** `BTC / Coach`
   - **Vai trò (Role):** `Coach` (Mở full toàn bộ các chặng 1, 2, 3)

---

### II. BẢNG KẾT QUẢ KIỂM THỬ LIVE TOÀN TRÌNH (6/6 PASS)

| STT | Tài khoản | Hạng mục kiểm thử | Kỳ vọng | Kết quả thực tế trên Live Vercel | Trạng thái |
|:---:|---|---|---|---|:---:|
| 1 | `vuhoang2708software@gmail.com` | Đăng nhập trên Live | Nhập email và pass `1234` | Đăng nhập thành công, hiển thị **"Vũ Hoàng (Test)"** | ✅ PASS |
| 2 | `vuhoang2708software@gmail.com` | Trạng thái 3 chặng | Chặng 1, 2, 3 đều mở khóa | Cả 3 chặng đều mở khóa (không có icon `🔒`) | ✅ PASS |
| 3 | `vuhoang2708software@gmail.com` | Điều hướng Chặng 3 | Bấm vào Chặng 3 xem bài tập | Chuyển sang Chặng 3 thành công | ✅ PASS |
| 4 | `culturecodeproject@gmail.com` | Đăng nhập trên Live | Nhập email và pass `1234` | Đăng nhập thành công, hiển thị **"Culture Code (Test)"** | ✅ PASS |
| 5 | `culturecodeproject@gmail.com` | Trạng thái 3 chặng | Chặng 1, 2, 3 đều mở khóa | Cả 3 chặng đều mở khóa (không có icon `🔒`) | ✅ PASS |
| 6 | `culturecodeproject@gmail.com` | Điều hướng Chặng 3 | Bấm vào Chặng 3 xem bài tập | Chuyển sang Chặng 3 thành công | ✅ PASS |

---

### III. BẰNG CHỨNG HÌNH ẢNH & THÔNG TIN COMMIT GIT

1. **Mã commit đã push lên origin main:**
   - `dh4hn-website`: Commit `fd1e35a` (*feat(roster): add test accounts vuhoang2708software and culturecodeproject with pass 1234 and coach role to unlock all stages*).
   - `khao-sat-xung-dot-tki`: Commit `94e085b` (*feat(roster): sync test accounts vuhoang2708software and culturecodeproject*).
   - `khao-sat-tinh-cach`: Commit `3d4d546` (*feat(roster): sync test accounts vuhoang2708software and culturecodeproject*).

2. **Ảnh chụp màn hình bằng chứng thực tế trên Live Vercel:**
   - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\live_uat_test_accounts_vuhoang_and_culturecode.png`
   - Hiển thị rõ danh tính `CC Culture Code (Test)` ở góc trên bên phải, toàn bộ 3 Chặng trong menu bên trái đều ở trạng thái mở khóa và đang truy cập vào Chặng 3.

3. **Kịch bản kiểm thử Live tự động:**
   - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\scratch\test_live_verify_both_accounts.js`
