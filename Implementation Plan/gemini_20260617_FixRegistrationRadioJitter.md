# Kế hoạch Triển khai: Sửa lỗi Jitter giao diện Radio Button trên Form Đăng ký

## 1. Đề bài và Bối cảnh (Goal Description)
Khắc phục hiện tượng "nhún nhún, giật giật" (jitter) - tức là dịch chuyển bố cục (`layout shift`) - xảy ra khi người dùng hover, focus hoặc chọn (`checked`) các tùy chọn `radio button` (nút chọn một) và `checkbox` (nút chọn nhiều) trên form đăng ký. Đảm bảo giao diện ổn định, mượt mà trên cả máy tính (`desktop`) và điện thoại di động (`mobile viewport`).

## 2. Hiện trạng và Nguyên nhân (Pain Points & Root Cause)
- **Kế thừa thuộc tính không mong muốn:** CSS hiện tại áp dụng selector chung `input` cho toàn bộ các thẻ input, bao gồm cả `input[type="radio"]` và `input[type="checkbox"]`. Các thẻ này bị áp đặt `padding: 1rem;` và `width: 100%;` từ CSS chung.
- **Focus Ring gây giật:** Khi người dùng click chọn, trình duyệt tập trung focus vào thẻ input bên trong và áp dụng style `input:focus` chứa `box-shadow: 0 0 0 4px ...;`. Do các thẻ radio/checkbox thừa kế padding lớn, việc tính toán shadow và viền của trình duyệt bị lệch, gây ra hiện tượng giật cục bố cục của `.radio-item`.
- **Thiếu phản hồi trạng thái cho container:** Chưa có CSS tương ứng để làm nổi bật toàn bộ khung `.radio-item` bao ngoài khi tùy chọn bên trong được click chọn hoặc focus.

## 3. Giải pháp Kỹ thuật (Proposed Solution)

### Tách biệt và Reset Style cho Radio/Checkbox
Thêm CSS cụ thể để ghi đè và triệt tiêu các thuộc tính thừa kế không hợp lý từ thẻ `input` chung:
```css
/* Tách biệt input text thông thường và input radio/checkbox */
.radio-item input[type="radio"],
.radio-item input[type="checkbox"] {
    width: 18px !important;
    height: 18px !important;
    padding: 0 !important;
    margin: 0 10px 0 0 !important;
    background: transparent !important;
    border: 1px solid var(--glass-border) !important;
    flex-shrink: 0;
    cursor: pointer;
    box-shadow: none !important;
}

.radio-item input[type="radio"] {
    border-radius: 50% !important;
}

.radio-item input[type="checkbox"] {
    border-radius: 4px !important;
}
```

### Ổn định hóa Focus và Checked State
- Loại bỏ hiệu ứng `box-shadow 4px` trên chính nút chọn nhỏ để tránh vỡ bố cục.
- Chuyển hiệu ứng highlight lên thẻ container `.radio-item` bằng `:has(input:checked)` và `:focus-within` để tạo trải nghiệm mượt mà, chuyên nghiệp:
```css
/* Highlight container khi radio/checkbox được check hoặc focus */
.radio-item:has(input:checked) {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--warm-yellow);
    box-shadow: 0 0 0 1px var(--warm-yellow); /* Sử dụng shadow mỏng thay vì đổi border-width để tránh layout shift */
}

.radio-item:focus-within {
    border-color: var(--warm-yellow);
    box-shadow: 0 0 0 1px var(--warm-yellow);
}

/* Đảm bảo trạng thái hover không làm thay đổi viền hay kích thước */
.radio-item:hover {
    background: rgba(255, 255, 255, 0.08);
}
```

## 4. Các file bị ảnh hưởng (Files Affected)
- `[MODIFY]` [register-test.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register-test.html)
- `[MODIFY]` [register.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html)
- `[NEW]` [gemini_20260617_FixRegistrationRadioJitter.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260617_FixRegistrationRadioJitter.md) (File kế hoạch này)

## 5. Quy trình Kiểm chứng (Verification Plan)

### Kiểm thử Cục bộ (Local Verification)
1. Khởi chạy HTTP server thử nghiệm bằng Python:
   `python -m http.server 8787 --bind 127.0.0.1`
2. Mở trình duyệt thông qua `Browser Tool` để truy cập `http://127.0.0.1:8787/register-test.html`.
3. Kiểm thử tương tác:
   - Click liên tục vào các radio button.
   - Hover qua lại các nhóm tùy chọn.
   - Focus bằng phím Tab.
   - Kiểm tra hiển thị trên thiết bị di động (mobile viewport).
   - Chụp ảnh màn hình chứng minh không xảy ra hiện tượng giật hay dịch chuyển bố cục.

### Kiểm toán Git (Git Audit)
1. Chạy `git status --short --branch` để kiểm tra.
2. Chỉ `git add` đúng 2 file `register-test.html` và `register.html`.
3. Commit với thông điệp: `fix: stabilize registration radio interactions`
4. Thực hiện `git push` lên nhánh hiện tại.

---
## 6. Ranh giới Phê duyệt (Approval Boundary)
Em sẽ dừng lại tại đây và **chờ lệnh phê duyệt** (gõ trực tiếp `Approve`, `Đồng ý` hoặc `OK`) từ anh trước khi sửa đổi bất kỳ file code nào trong dự án.
