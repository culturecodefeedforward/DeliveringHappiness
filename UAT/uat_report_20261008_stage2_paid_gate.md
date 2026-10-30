# 🧪 Báo Cáo Kiểm Thử Nghiệm Thu (UAT Report): Cổng Mở Chặng 2 & 3 Theo Danh Sách Thanh Toán Các Khóa DH
## Kịch Bản: Kiểm Tra Thanh Toán Bắt Buộc Cho Khóa Gần Nhất & Liên Kết LinkedIn CultureCode

> **Mã báo cáo:** `UAT-20261008-STAGE2-PAID-GATE`  
> **Thời gian thực thi:** 08/10/2026 18:30:34 (Giờ Hà Nội)  
> **Người thực hiện:** Antigravity Pairing Assistant  
> **Người phê duyệt:** Sếp Dzũ (Vu Hoang)  
> **Trạng thái:** ✅ **12/12 BÀI TEST ĐẠT (100% PASSED)**  

---

## 1. Mục Tiêu & Cơ Chế Kiểm Thử

1. **Xác nhận Rule mới:** Học viên hoàn thành Cổng Vượt Chặng Chặng 1 (≥ 80%) CHỈ được mở Chặng 2 & 3 khi nằm trong danh sách thanh toán thành công của các khóa DH (`isPaidDHMLearner(currentUser)`).
2. **Cơ chế khóa gần nhất:**
   - Các khóa học lịch sử đã kết thúc (`DHM3` đến `DHM8`): Học viên trong Roster mặc định đã thanh toán 100% học phí và tốt nghiệp từ trước ➔ Đạt test là mở khóa ngay.
   - Khóa gần nhất (`DHM9`, `DHM10`): Bắt buộc kiểm tra trạng thái thanh toán thực tế (`payment_status: 'PAID'` hoặc `is_paid: true` hoặc phiên VietQR/SePay `DHM10_lastPaymentStatus === 'PAID'`). Nếu chưa đóng tiền hoặc pending ➔ Bị khóa Chặng 2.
3. **Cơ chế Ban Giảng Huấn:** Ban Giảng Huấn (`BTC / Coach`, `COACH`, `role: Coach`, `role: admin`) luôn mở khóa toàn bộ (bypass).
4. **Thông báo tiêu chuẩn & Link LinkedIn:** Khi bị chặn, hiển thị đúng thông báo:
   > *"Chặng 2 và 3 chỉ dành cho học viên DHM offline, vui lòng theo dõi các thông báo từ CultureCode để đăng ký tham gia các chương trình tiếp theo"*  
   kèm nút/liên kết mở thẳng trang LinkedIn CultureCode: `https://www.linkedin.com/company/culturecodecommunity/`.

---

## 2. Kết Quả Kiểm Thử Chi Tiết (12/12 Tests Passed)

| STT | Mã kiểm thử | Đối tượng kiểm tra | Dữ liệu đầu vào | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | **CFG-01** | URL LinkedIn | `DHM_PAID_GATE_CONFIG.LINKEDIN_URL` | Khớp 100% `https://www.linkedin.com/company/culturecodecommunity/` | ✅ **PASS** |
| 2 | **CFG-02** | Danh mục Khóa gần nhất | `DHM_PAID_GATE_CONFIG.LATEST_COHORTS` | Chứa đầy đủ `DHM9` và `DHM10` | ✅ **PASS** |
| 3 | **CFG-03** | Danh mục Khóa lịch sử | `HISTORICAL_PAID_COHORTS` | Chứa đầy đủ `DHM3` đến `DHM8` | ✅ **PASS** |
| 4 | **COACH-01** | Coach Hà Minh Châu | `chauhm71@gmail.com`, `BTC / Coach`, chưa test | Mở khóa Chặng 2 (bypass) | ✅ **PASS** |
| 5 | **COACH-02** | Coach Vũ Hoàng | `vuhoang2708@gmail.com`, `COACH`, chưa test | Mở khóa Chặng 2 (bypass) | ✅ **PASS** |
| 6 | **TC-01** | Học viên DHM8 (Chưa test) | `thuyhuong.261291@gmail.com`, score: 50% | Bị khóa Chặng 2 (do chưa đạt 80% test) | ✅ **PASS** |
| 7 | **TC-02** | Học viên DHM8 (Đã test) | `thuyhuong.261291@gmail.com`, score: 100% | Mở khóa Chặng 2 & 3 thành công | ✅ **PASS** |
| 8 | **TC-03** | Khóa gần nhất DHM10 (Chưa đóng tiền) | `learner_unpaid@gmail.com`, score: 100% | Bị khóa Chặng 2 (do chưa có cờ PAID) | ✅ **PASS** |
| 9 | **TC-04A** | Khóa gần nhất DHM10 (Đã có cờ Roster PAID) | `payment_status: 'PAID'`, score: 100% | Mở khóa Chặng 2 & 3 thành công | ✅ **PASS** |
| 10 | **TC-04B** | Khóa gần nhất DHM10 (Session SePay PAID) | Session `DHM10_lastPaymentStatus: 'PAID'` | Mở khóa Chặng 2 & 3 thành công | ✅ **PASS** |
| 11 | **TC-05** | Leads đăng ký (`DHM_Registration`) | `tan.hole@outlook.com`, score: 100% | Bị khóa Chặng 2 (không tự mở cho leads) | ✅ **PASS** |
| 12 | **TC-06** | Học viên Dùng thử (`Trial`) | `role: 'trial'`, `isTrial: true`, score: 100% | Bị khóa Chặng 2 | ✅ **PASS** |

---

## 3. Tệp Tin Thực Hiện & Sao Lưu An Toàn

- Tệp mã nguồn cập nhật:
  * `Teaching DH/dhm-micro-lms/app.js`
  * `dh4hn-website/lms/app.js`
- Tệp sao lưu an toàn:
  * `Teaching DH/dhm-micro-lms/app.js.bak_20261008_stage2_paid_gate`
  * `dh4hn-website/lms/app.js.bak_20261008_stage2_paid_gate`
- Kịch bản kiểm thử tự động:
  * `Teaching DH/tests/test_stage2_paid_gate.js`
