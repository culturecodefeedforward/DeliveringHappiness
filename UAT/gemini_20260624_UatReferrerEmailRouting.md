# Báo cáo UAT (User Acceptance Testing) - Định tuyến Email Thông báo cho Đối tác (GEM Global & Smart Train)

*Thời gian thực hiện:* 16:55 ngày 24/06/2026  
*Người thực hiện:* Gemini (Antigravity Agent)  

---

## 1. Trạng thái kiểm chứng (Verification Level)
*   **Trạng thái:** `Staging done` (Đã vượt qua bộ test suite tĩnh 88 assertions bằng Node.js giả lập Apps Script Runtime).  
*   **Kết quả:** `PASS - normal path` (Tất cả các hàm logic nghiệp vụ chạy sạch sẽ, không phát sinh lỗi cú pháp hay logic).

---

## 2. Chi tiết logic định tuyến email được triển khai

### A. Gửi thông báo khi có đăng ký mới (New Registration Event)
*   Khi học viên chọn Nguồn giới thiệu là `"GEM Global"` -> Gửi email thông báo đăng ký mới tới:
    `chauhm71@gmail.com, vuhoang2708@gmail.com, hoanhn.edu.vn@gmail.com, hang.ho@gemglobal.edu.vn`
*   Khi học viên chọn Nguồn giới thiệu là `"Smart Train"` -> Gửi email thông báo đăng ký mới tới:
    `chauhm71@gmail.com, vuhoang2708@gmail.com, hoanhn.edu.vn@gmail.com, thanh.pham@smarttrain.edu.vn`
*   Các trường hợp nguồn khác -> Gửi email tới 3 địa chỉ BTC như cũ:
    `chauhm71@gmail.com, vuhoang2708@gmail.com, hoanhn.edu.vn@gmail.com`

### B. Gửi thông báo khi hoàn thành thanh toán (Payment Complete Event)
*   Hệ thống đọc cột giới thiệu trong hàng dữ liệu của học viên đã đăng ký.
*   Nếu học viên thuộc nguồn `"GEM Global"` -> Gửi email thông báo đã nhận thanh toán thành công tới BTC và gửi thêm tới đối tác:
    `hang.ho@gemglobal.edu.vn`
*   Nếu học viên thuộc nguồn `"Smart Train"` -> Gửi email thông báo đã nhận thanh toán thành công tới BTC và gửi thêm tới đối tác:
    `thanh.pham@smarttrain.edu.vn`

---

## 3. Danh sách tệp tin thay đổi (Files Changed)

### A. Hệ thống DH8 (Hồ Chí Minh)
1.  [Scripts/active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js) (Dòng 1027-1033; Dòng 1200-1207)
2.  [Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js) (Dòng 908-914; Dòng 1074-1081)

### B. Hệ thống DH9 (Hà Nội)
1.  [Artifacts/tmp_dh9_prod_package_20260618/Scripts/active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/tmp_dh9_prod_package_20260618/Scripts/active_code_gs_final.js) (Dòng 817-823; Dòng 980-987)
2.  [Artifacts/tmp_dh9_prod_package_20260618/Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/tmp_dh9_prod_package_20260618/Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js) (Dòng 817-823; Dòng 980-987)

---

## 4. Minh chứng chạy Test Suite (UAT Output)
```text
=== DHM8 Gate 1 Mock Tests (Rev 3) ===
...
=== Test run complete: 88 assertions ===
✅ All 88 tests PASSED.
```
