# Kế Hoạch Triển Khai: Tối Ưu Hóa Toàn Diện Giao Diện Đáp Ứng (Responsive) Cụm Công Cụ & Nút Kêu Gọi Hành Động (CTA) Trên Mobile

**Ngày lập:** 13/10/2026  
**Mã kế hoạch:** `PLAN-20261013-FIX-RESPONSIVE-HERO-TOOLS-GRID`  
**Mục tiêu:** Khắc phục triệt để lỗi tràn viền ngang (`horizontal overflow`), chữ bị cắt cụt (`text clipping`) trên điện thoại (như phản ánh trong ảnh chụp màn hình), nâng cấp cụm công cụ thành dạng lưới thẻ đáp ứng (`Responsive Tool Grid`) chuẩn mực, thẩm mỹ cao trên cả Desktop và Mobile.

---

## 1. Phân Tích Nguyên Nhân Gốc Rễ (Root Cause Analysis)

1. **Thuộc tính `white-space: nowrap` của `.btn-primary`:** Ép toàn bộ các nút phải nằm trên 1 hàng đơn lẻ, không được phép xuống dòng. Nút số 5 dài tới 58 ký tự khiến chiều rộng nút phình to hơn 460px (vượt xa chiều rộng màn hình điện thoại 375px–390px).
2. **Khung chứa `.hero` có `overflow: hidden` và padding lớn (`2rem` = 32px mỗi bên):** Khi nội dung bên trong vượt quá 311px chiều rộng khả dụng, toàn bộ mép phải bị cắt cụt không thương tiếc.
3. **Nút cam DHM10 phía trên cũng bị cắt tương tự:** Nút "✨ Đăng ký quan tâm và nhận thông tin về DHM10" cũng bị tràn mép phải trên màn hình hẹp do `white-space: nowrap` và padding ngang `2.5rem`.

---

## 2. Giải Pháp Kiến Trúc & Thiết Kế Giao Diện (UI/UX)

1. **Chuyển sang cấu trúc lưới thẻ hiện đại (`.hero-tools-grid`):**
   - **Desktop (>= 641px):** Hiển thị lưới 2 cột (`grid-template-columns: repeat(2, 1fr)`), 3 hàng cân xứng tuyệt đối, đồng bộ bề rộng tối đa với thẻ DHM10 Hybrid (`max-width: 820px`).
   - **Mobile (<= 640px):** Tự động co về 1 cột duy nhất (`grid-template-columns: 1fr`), chiều rộng `100%`, cho phép văn bản tự xuống dòng (`white-space: normal`), căn giữa hoàn hảo.
2. **Tách phân cấp thông tin cho nút số 5:**
   - Dòng tiêu đề chính: `Trạm thu hoạch I . A . M`
   - Dòng phụ đề nhỏ tinh tế: `(Dành cho khóa Team Happiness)`
3. **Tối ưu hóa nút cam đăng ký DHM10 trên Mobile:**
   - Cho phép xuống dòng tự nhiên, co giãn `width: 100%`, padding `0.85rem 1.2rem` để không bao giờ bị cắt cụt.
4. **Tối ưu padding `.hero` trên Mobile:**
   - Giảm padding ngoài từ `2rem` xuống `2rem 1rem` để tối đa hóa không gian hiển thị cho thiết bị di động.

---

## 3. Phạm Vi Tệp Tác Động (Allowlist)

1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html` (Thêm khối CSS đáp ứng trong `<style>` và cập nhật cấu trúc HTML của cụm công cụ).
2. Tệp sao lưu an toàn: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_responsive_grid`.

---

## 4. Kế Hoạch Kiểm Thử Nghiệm Thu (UAT Plan)

1. **Kiểm thử cục bộ (Local UAT):**
   - Thử nghiệm mô phỏng trên các kích thước màn hình: 360px (Android nhỏ), 375px (iPhone SE), 390px (iPhone 13/14), 430px (iPhone Pro Max), 768px (iPad), 1280px (Desktop).
   - Kiểm tra `scrollWidth <= clientWidth` để đảm bảo 0 lỗi tràn viền ngang (`zero horizontal overflow`).
2. **Kiểm thử trực tiếp (Live UAT):**
   - Sau khi deploy, kiểm tra trên trình duyệt mobile thật.

---

## 5. Kế Hoạch Quay Lui (Rollback Plan)

Lệnh khôi phục:
`Copy-Item -Path "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_responsive_grid" -Destination "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html" -Force`
