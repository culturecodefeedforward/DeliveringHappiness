# 🎨 Hướng dẫn Thiết kế (Design Guidelines)

Tài liệu định nghĩa ngôn ngữ thiết kế, quy chuẩn hiển thị và phong cách UI/UX được áp dụng trên DH4HN Website.

## 1. Ngôn ngữ Thiết kế Glassmorphism
Website sử dụng phong cách Glassmorphism (hiệu ứng kính mờ) để tạo cảm giác hiện đại, thanh thoát và cao cấp.

### Các thuộc tính CSS cốt lõi:
*   **Background mờ:** Sử dụng màu nền có độ trong suốt (alpha channel) kết hợp bộ lọc backdrop.
    ```css
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    ```
*   **Viền siêu mảnh (Border):**
    ```css
    border: 1px solid rgba(255, 255, 255, 0.25);
    ```
*   **Đổ bóng nhẹ (Box Shadow):**
    ```css
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    ```

## 2. Bảng màu (Color Palette)
*   **Màu chủ đạo (Primary Dark Blue):** `#1e3a8a` (Đại diện cho sự chuyên nghiệp, tin cậy của khóa học).
*   **Màu nhấn (Accent Gold/Orange):** Khai báo màu vàng/cam ấm áp cho các nút Kêu gọi hành động (CTA buttons) để tăng tỷ lệ chuyển đổi.
*   **Màu nền mờ (Light Frosted Glass):** `rgba(255, 255, 255, 0.7)` hoặc `rgba(15, 23, 42, 0.6)` cho chế độ tối (dark mode nếu có).

## 3. Tích hợp thanh toán trực quan (VietQR & Payment UX)
*   **Sinh mã QR động:** Trong tệp `register.js`, mã QR được tạo động dựa trên giá trị vé được chọn và thông tin tài khoản ngân hàng của Ban tổ chức.
*   **Hướng dẫn thanh toán:** Luôn hiển thị song song cả ảnh mã VietQR và văn bản thông tin số tài khoản chi tiết để hỗ trợ người dùng không thể quét mã bằng điện thoại.
*   **Trạng thái tương tác (Interactive States):**
    *   *Hover effects:* Các nút bấm thanh toán hoặc gửi form phải có hiệu ứng thay đổi độ mờ (opacity) và tỷ lệ thu phóng nhẹ (`transform: scale(1.02)`) khi di chuột qua để tạo cảm giác sinh động.
