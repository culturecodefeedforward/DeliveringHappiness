# Kế hoạch thêm Logo CultureCode liên kết LinkedIn vào các trang Đăng ký và Quiz

Kế hoạch này nhằm mục đích tích hợp Logo CultureCode cân đối ở góc trên bên trái của toàn bộ các trang đăng ký và trang quiz (đánh giá). Logo này khi click sẽ dẫn trực tiếp về trang LinkedIn chính thức của CultureCode.

## User Review Required

> [!IMPORTANT]
> **Độ thống nhất về mặt UX/UI giữa các trang:**
> *   **Trên máy tính (Desktop > 768px):** Logo sẽ được định vị tuyệt đối (`position: absolute`) ở góc trái bên trên của thẻ biểu mẫu (`.form-card` hoặc `.quiz-container`), giữ khoảng cách cân đối (1.5rem = 24px) để không ảnh hưởng đến tiêu đề và bố cục chính.
> *   **Trên điện thoại (Mobile <= 768px):** Để tránh việc logo đè lên tiêu đề do màn hình hẹp, logo sẽ được chuyển sang định dạng khối thông thường (`position: static`) hiển thị căn giữa ở trên cùng, phía trên tiêu đề chính.

## Open Questions

*Không có.*

## Proposed Changes

Chúng tôi đề xuất thay đổi các tệp giao diện sau:

### 1. Thêm CSS dùng chung cho Logo

#### [MODIFY] [register.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html)
Thêm CSS của logo vào thẻ `<style>` và chèn mã HTML của logo làm con đầu tiên của `.form-card`:
```html
<a href="https://www.linkedin.com/company/culturecodecommunity" target="_blank" class="brand-logo-link">
    <img src="culturecode_logo_transparent.png" alt="CultureCode Logo" class="brand-logo">
</a>
```

#### [MODIFY] [register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html)
Tương tự như `register.html`, thêm CSS và HTML của logo vào `.form-card`.

#### [MODIFY] [register_direct.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_direct.html)
Tương tự như `register.html`, thêm CSS và HTML của logo vào `.form-card`.

#### [MODIFY] [register-test.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register-test.html)
Tương tự như `register.html`, thêm CSS và HTML của logo vào `.form-card`.

#### [MODIFY] [register_cc101.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_cc101.html)
Tương tự như `register.html`, thêm CSS và HTML of logo vào `.form-card`.

#### [MODIFY] [register_nvc.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_nvc.html)
Gỡ bỏ logo cũ căn giữa trong phần `.header` và thay bằng logo góc trái trên liên kết LinkedIn tương tự các trang khác.

---

### 2. Trang Quiz / Đánh giá

#### [MODIFY] [assessment.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/assessment.html)
Di chuyển ảnh logo ra ngoài khối `.quiz-header`, bọc trong thẻ `<a>` liên kết đến LinkedIn và đặt làm con đầu tiên của `.quiz-container`.

#### [MODIFY] [quiz.css](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/quiz.css)
Thêm class CSS `.brand-logo-link` và `.brand-logo` để định vị logo ở góc trên bên trái của `.quiz-container`. Xóa các class styling logo cũ không dùng đến.

---

### 3. Kịch bản chạy thử nghiệm UAT

#### [MODIFY] [take_local_uat_screenshots.py](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/take_local_uat_screenshots.py)
Cập nhật script chụp hình để kiểm tra thêm trang `assessment.html`, `register_cc101.html`, và `register_nvc.html` nhằm kiểm chứng trực quan logo hiển thị cân đối.

---

## Verification Plan

### Automated Tests
Không áp dụng.

### Manual Verification (Browser UAT)
1. Chạy script Python `take_local_uat_screenshots.py` để chụp ảnh màn hình cục bộ của các trang đăng ký và quiz.
2. Kiểm tra trực quan xem logo có nằm cân đối ở góc trên bên trái trên giao diện desktop hay không.
3. Kiểm tra xem click logo có mở tab mới dẫn đến `https://www.linkedin.com/company/culturecodecommunity`.
4. Nếu kết quả UAT local hoạt động tốt, tiến hành deploy lên Vercel.
