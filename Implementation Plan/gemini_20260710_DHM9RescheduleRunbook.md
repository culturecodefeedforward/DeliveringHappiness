# DHM9 Hà Nội & DHM8 HCM - Event Reschedule Runbook & Implementation Plan (Phiên bản Cập nhật Địa chỉ & Google Map)

Tài liệu này ghi nhận **Kế hoạch triển khai** (Implementation Plan) cập nhật thông tin địa chỉ chi tiết theo địa giới hành chính mới và gắn link Google Map chính xác cho cả 2 khu vực Hà Nội (DHM9) và TP.HCM (DHM8) trên website Delivering Happiness.

---

## 1. Yêu cầu & Thay đổi chi tiết

### A. Địa chỉ và Google Map mới:
1. **Khu vực TP.HCM (DHM8)**:
   - Địa chỉ mới: `Trung tâm Đào tạo Circle K, Tầng 3 - Số 27 Nguyễn Gia Trí, P.Thạnh Mỹ Tây, Hồ Chí Minh (quận Bình Thạnh cũ)`
   - Link Google Map: `https://www.google.com/maps/search/?api=1&query=Trung+tâm+Đào+tạo+Circle+K,+27+Nguyễn+Gia+Trí,+Bình+Thạnh`
2. **Khu vực Hà Nội (DHM9)**:
   - Địa chỉ mới: `SBB Healthcare Premium; Tầng 6 - San Tea house; Số 199 Trường Chinh, P. Phương Liệt - Hà Nội (Quận Thanh Xuân cũ)`
   - Link Google Map: `https://www.google.com/maps/search/?api=1&query=SBB+Healthcare+Premium+199+Trường+Chinh+Hà+Nội`

### B. Các file bị ảnh hưởng (Files Affected):
1. **[index.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)**:
   - Cập nhật địa chỉ HCM và gắn link Map (dòng 68-69).
   - Cập nhật địa chỉ HN và gắn link Map (dòng 79).
2. **[register.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html)**:
   - Cập nhật địa chỉ HCM và gắn link Map (dòng 31).
3. **[register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html)**:
   - Cập nhật địa chỉ HN và gắn link Map (dòng 23).
4. **[interest_dh9.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/interest_dh9.html)**:
   - Cập nhật địa chỉ HN và gắn link Map (dòng 142).

---

## 2. Kế hoạch Khôi phục (Rollback Plan)
Nếu xảy ra lỗi, khôi phục các tệp bằng lệnh:
```powershell
git checkout -- index.html register.html register_dh9_hanoi.html interest_dh9.html
```

---

## 3. Kế hoạch Kiểm chứng (Verification Plan)
- Chạy local dev server để kiểm tra hiển thị trực quan và khả năng click của 2 link Google Map trên cả 4 file.
- Tiến hành stage, commit và push lên GitHub (sau khi sếp approve).
- Verify trên live URLs.
- Chụp ảnh screenshots UAT lưu vào thư mục `UAT/screenshots/dhm9_reschedule_20260710/` (nếu cần cập nhật).
