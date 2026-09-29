# Kế hoạch Rà soát, Chuẩn hóa Dữ liệu Học viên & Ban Giảng huấn (Master Learner Registry)

> **Mã kế hoạch:** PLAN-20260929-ROSTER-AUDIT-STANDARDIZATION  
> **Dự án:** Delivering Happiness Masterclass (DHM) — Micro-Learning Course Player & Master Registry  
> **Thời gian khởi tạo:** 2026-09-29 12:40:00 (Giờ Hà Nội)  
> **Nguyên tắc tối thượng:** TUÂN THỦ TUYỆT ĐỐI QUY TẮC CẤM BỊA ĐẶT / SUY DIỄN DỮ LIỆU (Zero Tolerance for Hallucinated or Dummy Data)

---

## 1. Bối cảnh & Mục tiêu

Sau quá trình điều tra lịch sử Git commit (`da1b11c84` ngày 28/09/2026), hệ thống phát hiện một số sai lệch dữ liệu nghiêm trọng do agent trước tự sinh (hardcode) dữ liệu giả lập và suy diễn không có căn cứ:
1. **Sai lệch thông tin Coach:**
   - `chauhm71@gmail.com` (Chị Hà Minh Châu) bị gán nhầm tên `"Hà Ngọc Hoàn"` (lấy từ tên chủ tài khoản BIDV trong form thanh toán).
   - `hoanhn.edu.vn@gmail.com` (Coach Hà Ngọc Hoàn) bị suy diễn tên thành `"Nguyễn Văn Hoàn"` và bị gán số điện thoại giả lập `"0988888888"`.
   - `vuhoang2708@gmail.com` (Sếp Vũ Hoàng) bị gán số điện thoại giả lập `"0912345678"`.
2. **Tài khoản kiểm thử nằm lẫn trong danh sách học viên thật:**
   - `DHM9-003`: `Codex Live Test DHM9 20260707` (`vuhoang2708+codexdhm9test202607072249@gmail.com`) nằm trong khóa DHM9.
3. **Thiếu số điện thoại của học viên DHM9:**
   - 15 học viên DHM9 từ file `dhm9_data.json` chưa có số điện thoại. Trong đó, học viên `Pham Binh Ha` (`ha.hapb@gmail.com`) có số điện thoại thật đã được xác minh là `0903253958` trong file danh sách Leadership.

**Mục tiêu kế hoạch:**
- Rà soát toàn bộ 117 bản ghi trong hệ thống.
- Chuẩn hóa 100% dữ liệu Coach và học viên theo đúng Nguồn chuẩn (Source of Truth).
- Không tự bịa bất kỳ số điện thoại nào: nếu chưa có số thật từ hồ sơ gốc, bắt buộc đặt trạng thái `missing` (`""`) để hệ thống kích hoạt cơ chế tự phục vụ điền số điện thoại (Self-Service Phone Onboarding) khi học viên đăng nhập lần đầu.
- Tách bạch tài khoản test ra khỏi danh sách học viên chính thức.
- Sao lưu toàn bộ dữ liệu trước khi sửa đổi, kiểm thử cục bộ tự động và đóng gói sẵn sàng cho việc triển khai Vercel Production.

---

## 2. Nguồn dữ liệu Chuẩn (Source of Truth Map)

| Thành phần dữ liệu | Nguồn chuẩn xác minh (Source of Truth) | Bằng chứng đường dẫn |
| :--- | :--- | :--- |
| **Ban Giảng Huấn (Coach)** | Bảng tổng hợp Leadership Team & Xác thực Zalo / Ngân hàng BIDV | `Artifacts/danh_sach_25_hoc_vien_leadership_20092026_v9.csv`, `leadership_rsvp.html` |
| **DHM8 (55 học viên)** | Snapshot DHM8 CRM Google Sheet & GEM Global Cadivi / CFT Import | `UAT/gemini_20260715_ImportGemGlobalList_Backup_DHM8Data.md`, `Implementation Plan/gemini_20260715_ImportGemGlobalList_Plan.md` |
| **DHM9 (32 học viên thật)** | Bảng dữ liệu DHM9 CRM & Bảng Leadership CRM xác minh | `scratch/dhm9_data.json`, `Artifacts/danh_sach_25_hoc_vien_leadership_20092026_v9.csv` |
| **DHM_Registration (25 học viên)** | Bảng trích xuất Leads Đăng ký từ Landing Page CRM | `Artifacts/dh_cta_low_spam_campaign_20260708/eligible_recipients_after_dhm8_dhm9_suppression.csv` |

---

## 3. Danh mục Tệp tin Tác động (Allowlist)

1. `dh4hn-website/lms/authorized_roster.json` (Nguồn dữ liệu đăng nhập Web LMS)
2. `dh4hn-website/lms/master_learners_roster.json` (CSDL chuẩn hóa Master LMS)
3. `Teaching DH/scripts/generate_master_roster.js` (Script chuẩn hóa tạo Roster)
4. `Teaching DH/Artifacts/master_learners_roster.json` (Bản sao lưu CSDL Master)
5. `Teaching DH/Artifacts/master_learners_roster.csv` (Bản xuất Excel UTF-8 cho BTC)
6. `Teaching DH/dhm-micro-lms/authorized_roster.json` (Bản đồng bộ micro-lms nếu có)

---

## 4. Kế hoạch Sao lưu An toàn (Rollback & Backup Strategy)

Trước khi thực hiện bất kỳ chỉnh sửa nào, Agent tạo bản sao lưu đóng dấu thời gian:
- `lms/authorized_roster.json.bak_20260929_audit`
- `lms/master_learners_roster.json.bak_20260929_audit`
- `Teaching DH/Artifacts/master_learners_roster.json.bak_20260929_audit`
- `Teaching DH/Artifacts/master_learners_roster.csv.bak_20260929_audit`

**Cơ chế quay lui (Rollback):**
Nếu có bất kỳ sự cố nào, chỉ cần khôi phục lại các file `.bak_20260929_audit` về tên gốc bằng lệnh copy/move đè trong 1 giây.

---

## 5. Các bước Triển khai Chi tiết

### Bước 1: Tạo bản sao lưu an toàn (Safety Backup)
Thực hiện sao lưu toàn bộ 4 file dữ liệu roster hiện có sang file `.bak_20260929_audit`.

### Bước 2: Chuẩn hóa dữ liệu Ban Giảng Huấn (Coach Roster)
- `COACH-001`:
  * Họ tên: **Hà Minh Châu**
  * Email: `chauhm71@gmail.com`
  * Số điện thoại: Đặt là `""` (`missing`) do chưa có nguồn xác minh số cá nhân riêng; hệ thống LMS sẽ yêu cầu cập nhật khi Chị Châu đăng nhập.
- `COACH-002`:
  * Họ tên: **Hà Ngọc Hoàn**
  * Email: `hoanhn.edu.vn@gmail.com`
  * Số điện thoại: **`0913503505`** (Đã xác minh từ hồ sơ giảng huấn & tài khoản BIDV). Trạng thái: `verified`, mã PIN: `3505`.
- `COACH-003`:
  * Họ tên: **Vũ Hoàng**
  * Email: `vuhoang2708@gmail.com`
  * Số điện thoại: **`0983453145`** (Đã xác minh từ hồ sơ all_registrations & danh sách giảng huấn). Trạng thái: `verified`, mã PIN: `3145`.

### Bước 3: Tách bạch Tài khoản Kiểm thử (Test Account Segregation)
- Di chuyển `DHM9-003` (`vuhoang2708+codexdhm9test202607072249@gmail.com`) ra khỏi khóa DHM9 và chuyển thành `TEST-002` trong nhóm `DHM_Test`, `status: "test"`.
- Đảm bảo khóa `DHM9` chỉ chứa đúng 32 học viên thực tế.

### Bước 4: Chuẩn hóa học viên DHM9 có số điện thoại xác minh
- Cập nhật số điện thoại cho học viên `Pham Binh Ha` (`ha.hapb@gmail.com`): `0903253958` (`verified`, mã PIN: `3958`).
- 14 học viên DHM9 còn lại chưa có số điện thoại: Giữ nguyên trạng thái `missing` (`phone: ""`), cấm tuyệt đối việc tự điền số giả lập.

### Bước 5: Cập nhật kịch bản sinh dữ liệu `generate_master_roster.js`
Nâng cấp mã script để:
- Tự động áp dụng các quy tắc kiểm tra nghiêm ngặt (chặn các số mẫu như `0988888888`, `0912345678`, dãy số lặp).
- Chuẩn hóa tên viết hoa, cắt khoảng trắng, mapping doanh nghiệp tự động.
- Sinh ra đồng thời cả `master_learners_roster.json` và `master_learners_roster.csv` (UTF-8 BOM).

### Bước 6: Kiểm thử Cục bộ Toàn diện (Local Verification & UAT)
- Chạy script kiểm toán dữ liệu độc lập:
  * 0 số điện thoại giả lập.
  * 0 họ tên sai lệch.
  * 100% khớp schema `LEARNER_DATA_SCHEMA.md`.
- Kiểm thử logic xác thực LMS (`app.js`) trên môi trường local:
  * Test đăng nhập Coach Hoàn (`hoanhn.edu.vn@gmail.com` + `3505`).
  * Test đăng nhập Coach Vũ Hoàng (`vuhoang2708@gmail.com` + `3145`).
  * Test đăng nhập Chị Châu (`chauhm71@gmail.com` -> hiển thị màn hình Onboarding yêu cầu điền SĐT).
  * Test đăng nhập học viên thường DHM8 và DHM9.

### Bước 7: Báo cáo & Trình Phê duyệt Cấp độ 3 để Đẩy lên Vercel
Sau khi hoàn tất toàn bộ kiểm thử cục bộ đạt 100% PASS, cung cấp khối mã phê duyệt Cấp độ 3 chuẩn xác để đẩy lên Vercel Production.
