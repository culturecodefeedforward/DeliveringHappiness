# Báo Cáo Kiểm Thử Nghiệm Thu (UAT) — Rà Soát & Chuẩn Hóa Danh Sách Học Viên Master LMS

- **Dự án:** Delivering Happiness Masterclass (DHM) — Micro-Learning Course Player & Master Registry
- **Thời gian hoàn tất:** 2026-09-29 12:45:00 (Giờ Hà Nội)
- **Mục tiêu:** Rà soát toàn diện 117 bản ghi học viên, Ban giảng huấn, loại bỏ triệt để dữ liệu giả lập/bịa đặt theo quy tắc Zero Tolerance, xác minh nguồn gốc từng trường thông tin và đảm bảo tính toàn vẹn xác thực.
- **Môi trường kiểm thử:** Local Node Test Runner & Logic Simulation
- **Kết quả:** 19/19 Ca Kiểm Thử Thành Công Tuyệt Đối (100% Pass)

---

## 1. Kết quả Rà soát Nguồn gốc Dữ liệu (Provenance & Audit Findings)

| Đối tượng | Email | Dữ liệu cũ (Sai / Ảo) | Dữ liệu chuẩn mới | Nguồn gốc xác minh (Source of Truth) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **COACH-001** | `chauhm71@gmail.com` | Tên: `"Hà Ngọc Hoàn"`<br>SĐT: `0913503505` | Tên: **`Hà Minh Châu`**<br>SĐT: `""` (`missing`) | Chị Hà Minh Châu là Dẫn giảng chính DHM. SĐT đặt `missing` để chờ SĐT cá nhân hoặc Onboarding tự phục vụ. | **VERIFIED** |
| **COACH-002** | `hoanhn.edu.vn@gmail.com` | Tên: `"Nguyễn Văn Hoàn"`<br>SĐT: `0988888888` (ảo) | Tên: **`Hà Ngọc Hoàn`**<br>SĐT: **`0913503505`** (`3505`) | Anh Hà Ngọc Hoàn là Co-founder & Giảng viên chính, đứng tên tài khoản BIDV BTC `8815369431`. | **VERIFIED** |
| **COACH-003** | `vuhoang2708@gmail.com` | SĐT: `0912345678` (ảo) | SĐT: **`0983453145`** (`3145`) | Sếp Vũ Hoàng (Teaching Team), SĐT khớp `all_registrations.csv` và `leadership_20092026_v9.csv`. | **VERIFIED** |
| **DHM9-024** | `ha.hapb@gmail.com` | SĐT: `""` (`missing`) | SĐT: **`0903253958`** (`3958`) | Phạm Bình Hà (Cán bộ trường THCS & THPT Tạ Quang Bửu), SĐT khớp danh sách Leadership. | **VERIFIED** |
| **Tài khoản Test** | `vuhoang2708+codexdhm9test202607072249@gmail.com` | Nằm trong khóa `DHM9` | Chuyển sang `DHM_Test` (`TEST-001`) | Tách biệt hoàn toàn khỏi danh sách học viên thật DHM9. | **VERIFIED** |

---

## 2. Chi tiết Kết quả Kiểm thử Tự động (19 Test Cases)

| STT | Kịch Bản Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Kết Quả Thực Tế | Trạng Thái |
|:---:|:---|:---|:---|:---|:---:|
| **TC1** | Số lượng bản ghi Web Roster | `dh4hn-website/lms/master_learners_roster.json` | Đúng 117 bản ghi | 117 bản ghi | **PASS** |
| **TC2** | Số lượng bản ghi Artifacts Roster | `Teaching DH/Artifacts/master_learners_roster.json` | Đúng 117 bản ghi | 117 bản ghi | **PASS** |
| **TC3** | Số lượng bản ghi Authorized Roster | `dh4hn-website/lms/authorized_roster.json` | Đúng 117 bản ghi | 117 bản ghi | **PASS** |
| **TC4** | Kiểm tra UTF-8 BOM file CSV | `Teaching DH/Artifacts/master_learners_roster.csv` | Có BOM `\uFEFF` mở được trên Excel | Ký tự đầu: `0xFEFF` | **PASS** |
| **TC5** | Quét chống số điện thoại giả lập | Quét toàn bộ SĐT thật trong Roster | 0 số chứa `0988888888`, `0912345678` | 0 số vi phạm | **PASS** |
| **TC6** | Xác minh định danh COACH-001 | Bản ghi `COACH-001` | Hà Minh Châu (`chauhm71@gmail.com`), SĐT missing | Đúng tên Chị Châu, SĐT missing | **PASS** |
| **TC7** | Xác minh định danh COACH-002 | Bản ghi `COACH-002` | Hà Ngọc Hoàn (`hoanhn.edu.vn@gmail.com`), SĐT 0913503505 | Đúng tên Anh Hoàn, SĐT 0913503505 | **PASS** |
| **TC8** | Xác minh định danh COACH-003 | Bản ghi `COACH-003` | Vũ Hoàng (`vuhoang2708@gmail.com`), SĐT 0983453145 | Đúng tên Sếp Vũ Hoàng, SĐT 0983453145 | **PASS** |
| **TC9** | Phân lập tài khoản Test | Khóa `DHM_Test` | Đúng 2 tài khoản test mang tiền tố `TEST-` | 2 tài khoản (`TEST-001`, `TEST-002`) | **PASS** |
| **TC10** | Trạng thái tài khoản Test | Cột `status` của tài khoản test | Giá trị là `test` | `status: "test"` | **PASS** |
| **TC11** | Toàn vẹn sĩ số khóa DHM9 | Khóa `DHM9` | Đúng 32 học viên chính thức | 32 học viên | **PASS** |
| **TC12** | Xác minh SĐT Phạm Bình Hà | Email `ha.hapb@gmail.com` | SĐT `0903253958`, PIN `3958` | Đầy đủ 10 số, PIN 3958 | **PASS** |
| **TC13** | Mô phỏng đăng nhập: Coach Hoàn | `hoanhn.edu.vn@gmail.com` + PIN `3505` | Đăng nhập thành công Coach Hà Ngọc Hoàn | Đăng nhập thành công | **PASS** |
| **TC14** | Mô phỏng đăng nhập: Coach Vũ Hoàng | `vuhoang2708@gmail.com` + PIN `3145` | Đăng nhập thành công Coach Vũ Hoàng | Đăng nhập thành công | **PASS** |
| **TC15** | Mô phỏng kích hoạt Phone Onboarding | `chauhm71@gmail.com` + PIN bất kỳ | Kích hoạt modal yêu cầu bổ sung SĐT | Bật modal Onboarding | **PASS** |
| **TC16** | Mô phỏng đăng nhập: Học viên Bình Hà | `ha.hapb@gmail.com` + PIN `3958` | Đăng nhập thành công Phạm Bình Hà | Đăng nhập thành công | **PASS** |
| **TC17** | Mô phỏng đăng nhập: SĐT kế thừa một phần | `anhnguyet.mba@gmail.com` + PIN `1731` | Đăng nhập thành công bằng 4 số kế thừa | Đăng nhập thành công | **PASS** |
| **TC18** | Mô phỏng từ chối mật khẩu sai | `hoanhn.edu.vn@gmail.com` + PIN `0000` | Bị từ chối xác thực | Báo lỗi `invalid_pin` | **PASS** |
| **TC19** | Mô phỏng từ chối tài khoản không tồn tại | `nobody@unknown.com` + PIN `1234` | Bị từ chối | Báo lỗi `user_not_found` | **PASS** |

---

## 3. Tệp tin Sao lưu An toàn (Safety Backups)

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\authorized_roster.json.bak_20260929_audit
```
[authorized_roster.json.bak_20260929_audit](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/lms/authorized_roster.json.bak_20260929_audit)

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\master_learners_roster.json.bak_20260929_audit
```
[master_learners_roster.json.bak_20260929_audit](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/lms/master_learners_roster.json.bak_20260929_audit)

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\Artifacts\master_learners_roster.json.bak_20260929_audit
```
[master_learners_roster.json.bak_20260929_audit](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/master_learners_roster.json.bak_20260929_audit)

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\Artifacts\master_learners_roster.csv.bak_20260929_audit
```
[master_learners_roster.csv.bak_20260929_audit](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/Teaching%20DH/Artifacts/master_learners_roster.csv.bak_20260929_audit)
