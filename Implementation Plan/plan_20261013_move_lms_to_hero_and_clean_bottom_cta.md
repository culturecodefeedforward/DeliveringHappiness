# Kế Hoạch Triển Khai: Đưa Liên Kết LMS Lên Khối Công Cụ Hero & Tối Giản Khối Kêu Gọi Hành Động (CTA) Cuối Trang

**Ngày lập:** 13/10/2026  
**Mã kế hoạch:** `PLAN-20261013-MOVE-LMS-HERO-CLEAN-BOTTOM-CTA`  
**Mục tiêu:**
1. Đưa liên kết hệ thống LMS (`/lms` - Đăng nhập Hệ thống LMS / Học viện) lên nằm chung trong cụm công cụ tương tác ở phần đầu trang (`hero-tools-grid`).
2. Tinh giản khu vực CTA đăng ký DHM10 ở cuối trang (`section.register-cta`): loại bỏ 2 nút trắc nghiệm phụ (`personal-value.html` và `assessment.html`), chỉ giữ lại duy nhất 1 nút *"✨ Đăng ký quan tâm và nhận thông tin về DHM10"*.

---

## 1. Nguồn Chuẩn (Source of Truth) & Thay Đổi Cụ Thể

1. **Khối công cụ phía trên (`hero-tools-grid`):**
   - Thêm nút thứ 7: `<a href="/lms" class="tool-card-btn lms-card-btn"><span>📚 Đăng nhập Hệ thống LMS (Học viện)</span></a>`.
   - Trên Desktop: Chiếm trọn 2 cột (`grid-column: 1 / -1`) tạo điểm nhấn cân xứng.
   - Trên Mobile: Hiển thị 1 cột tự nhiên cùng các công cụ khác.
2. **Khối CTA cuối trang (`section.register-cta`):**
   - Giữ lại duy nhất nút: `<a href="interest_dh10.html" class="btn-primary" ...>✨ Đăng ký quan tâm và nhận thông tin về DHM10</a>`.
   - Xóa bỏ 2 nút trùng lặp: `🔍 La bàn Giá trị Cá nhân` và `🧠 Trắc nghiệm Hệ điều hành Hạnh phúc`.

---

## 2. Phạm Vi Tệp Tác Động (Allowlist)

1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html`
2. Tệp sao lưu an toàn: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_lms_hero_clean_cta`

---

## 3. Kế Hoạch Kiểm Thử Nghiệm Thu (UAT Plan)

1. **Kiểm thử cục bộ (Local UAT):**
   - Chạy kịch bản Puppeteer kiểm tra `scrollWidth <= clientWidth` trên tất cả 5 kích thước màn hình (375px, 390px, 430px, 768px, 1280px).
   - Kiểm tra nút LMS mới có mặt và trỏ đúng `/lms`.
   - Kiểm tra khối CTA cuối trang chỉ còn đúng 1 nút đăng ký DHM10.
2. **Kiểm thử trực tiếp (Live UAT):**
   - Kiểm tra trang Live sau khi deploy.

---

## 4. Kế Hoạch Quay Lui (Rollback Plan)

Lệnh khôi phục:
`Copy-Item -Path "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_lms_hero_clean_cta" -Destination "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html" -Force`
