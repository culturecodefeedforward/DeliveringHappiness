# Kế hoạch Triển khai (Implementation Plan)
**Ngày lập:** 13/10/2026  
**Mục tiêu:** Gộp các thông tin tính năng trùng lặp ("Không gian đào tạo chuẩn quốc tế" và "Giảng viên cơ hữu đồng hành tại chỗ") từ 2 cột điểm cầu Hà Nội và TP.HCM lên phần thông tin chung của 2 miền trong thẻ `.hero-hybrid-card` tại `dh4hn-website/index.html`.  
**Phạm vi (Scope):** Chỉ chỉnh sửa `index.html` trong `dh4hn-website`.  
**Trạng thái:** Sẵn sàng triển khai.

---

## 1. Nguồn chuẩn & Đối tượng tác động (Source of Truth & Targets)
- **Tệp nguồn chính:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html`
- **Tệp sao lưu an toàn:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_consolidate_hybrid_hub_features`

---

## 2. Chi tiết Thay đổi Cấu trúc Giao diện

### Hiện trạng (Bị trùng lặp thông tin):
- Cả Điểm cầu Hà Nội lẫn Điểm cầu TP.HCM đều hiển thị lặp lại 2 dòng:
  - `Không gian đào tạo chuẩn quốc tế`
  - `Giảng viên cơ hữu đồng hành tại chỗ`

### Thiết kế sau khi gộp (Chuẩn hóa thông tin chung):
1. **Khối thông tin chung (Header của `.hero-hybrid-card`):**
   - Tiêu đề: `DHM10 — Mô hình Hybrid Song Song 2 Điểm Cầu`
   - Thời gian: `📅 Dự kiến Quý 4/2026` kèm chú thích `(Sẽ công bố ngày chính thức sau khi chốt lịch)`.
   - **Bổ sung thông tin chung của 2 miền:**
     `🏛️ Không gian đào tạo chuẩn quốc tế • 👨‍🏫 Giảng viên cơ hữu đồng hành tại chỗ`
2. **Khối 2 Điểm cầu (`.hybrid-hubs-grid`):**
   - **Điểm cầu Hà Nội:** Chỉ giữ lại nhãn định danh: `📍 Điểm cầu Hà Nội` và `Cơ sở SBB`.
   - **Điểm cầu TP.HCM:** Chỉ giữ lại nhãn định danh: `📍 Điểm cầu TP.HCM` và `Cơ sở Apollo English`.
   - Tối ưu khoảng đệm (`padding`/`margin`) để thẻ gọn gàng, cân đối, trực quan.

---

## 3. Kịch bản Kiểm thử Nghiệm thu (Verification & UAT)
- Chạy Puppeteer đo đạc trên 5 viewports:
  - `iPhone-SE-375px` (375 x 667)
  - `iPhone-14-390px` (390 x 844)
  - `iPhone-ProMax-430px` (430 x 932)
  - `iPad-768px` (768 x 1024)
  - `Desktop-1280px` (1280 x 800)
- Tiêu chí đạt:
  1. `scrollWidth === clientWidth` (0px horizontal overflow).
  2. Khối thông tin chung chứa đúng cụm từ: "Không gian đào tạo chuẩn quốc tế" và "Giảng viên cơ hữu đồng hành tại chỗ".
  3. Cả 2 khối con Hà Nội và TP.HCM không còn chứa 2 đoạn text lặp lại trên.

---

## 4. Phương án Quay lui (Rollback)
Nếu phát sinh bất kỳ lỗi hiển thị nào:
```powershell
Copy-Item -Path "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_consolidate_hybrid_hub_features" -Destination "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html" -Force
```
