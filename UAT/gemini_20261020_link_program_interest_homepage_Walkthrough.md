# Báo cáo Hoàn tất: Gắn link Cổng quan tâm Đa chương trình vào Landing Page

## 1. Tóm tắt Thực thi
Đã hoàn tất gắn đường dẫn tới Cổng đăng ký quan tâm đa chương trình ([`program-interest.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/program-interest.html)) trên trang chủ ([`index.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)) tại 2 vị trí chiến lược.

## 2. Chi tiết Thay đổi
* **Tệp chỉnh sửa:**
  * Windows Absolute Path: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html`
  * Liên kết IDE: [`index.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)

* **Vị trí 1 (Header `.hero-tools-grid`):**
  * Thêm thẻ công cụ `interest-card-btn` với class responsive (`grid-column: 1 / -1` trên Desktop, `grid-column: auto` trên Mobile):
    ```html
    <a href="program-interest.html" class="tool-card-btn interest-card-btn">
      <span>🌱 Đăng ký quan tâm các khóa học khác</span>
      <span class="tool-subtext">(NVC, Culture101, AI, An toàn tâm lý...)</span>
    </a>
    ```
* **Vị trí 2 (Footer `#register`):**
  * Thêm nút phụ outline bên cạnh nút đăng ký DHM10:
    ```html
    <a href="program-interest.html" class="btn-primary"
      style="background: transparent; color: var(--dark); border: 2px solid var(--dark); box-shadow: none; font-weight: 700;">🌱 Quan tâm các khóa học khác (NVC, Culture101...)</a>
    ```

## 3. Bằng chứng Kiểm chứng (Verification Evidence)
1. **Kiểm tra liên kết & số lần xuất hiện:**
   * Script Python kiểm tra chuỗi `program-interest.html` trong `index.html`: chính xác 2 vị trí (`Occurrences: 2`).
2. **Kiểm tra UTF-8 Read-back:**
   * Đọc lại toàn bộ nội dung tệp ở chế độ UTF-8 explicit, hiển thị tiếng Việt hoàn toàn chuẩn xác, không có hiện tượng mojibake hoặc lỗi thẻ HTML đóng/mở.
3. **Kiểm tra Git Diff:**
   * Thay đổi scoped gọn trong 12 dòng của `index.html`, không ảnh hưởng tới bất kỳ file ngoài allowlist.

## 4. Claim Level
* **Trạng thái:** `Local done` (Đã hoàn tất và kiểm chứng cục bộ tại workspace; chưa commit/push hoặc deploy production).
