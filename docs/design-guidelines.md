# 🎨 Hướng dẫn Thiết kế (Design Guidelines)

Tài liệu định nghĩa ngôn ngữ thiết kế, quy chuẩn hiển thị và phong cách UI/UX được áp dụng trên toàn bộ hệ thống DH4HN Website.

## 1. Ngôn ngữ Thiết kế Glassmorphism & Premium UI
Website sử dụng phong cách Glassmorphism (hiệu ứng kính mờ) kết hợp tông màu ấm (warm theme) để tạo cảm giác hiện đại, thanh thoát, thân thiện và cao cấp.

### Các thuộc tính CSS cốt lõi áp dụng cho hộp nội dung (cards):
*   **Background mờ có độ trong suốt (Frosted Glass Background):**
    ```css
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    ```
*   **Viền mờ siêu mảnh (Subtle Border):**
    ```css
    border: 1px solid rgba(255, 255, 255, 0.25);
    ```
*   **Đổ bóng dịu nhẹ (Soft Box Shadow):**
    ```css
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
    ```

---

## 2. Bảng màu ấm áp (Warm Color Palette)
Dự án sử dụng bộ biến màu CSS chung trong `:root` để đồng bộ hóa giao diện:
*   `--warm-cream`: `#fffbeb` (Màu nền chủ đạo, mang lại cảm giác dễ chịu, ấm cúng).
*   `--dark`: `#1c1917` (Màu chữ chính và màu nền của các thẻ lật mặt sau).
*   `--warm-yellow`: `#f59e0b` (Màu vàng nhấn, đại diện cho hạnh phúc và năng lượng tích cực).
*   `--warm-orange`: `#ea580c` (Màu cam dùng cho các nút kêu gọi hành động CTA và các tiêu đề quan trọng).
*   `--light-text`: `#78716c` (Màu phụ đề, mô tả nhỏ).

---

## 3. Trải nghiệm Tương tác của La bàn Giá trị (Personal Value Compass UX)

### A. Hiệu ứng Lật thẻ 3D (3D Card Flipping)
Mỗi giá trị trong số 41 giá trị sống được thiết kế dưới dạng thẻ lật 3D hai mặt nhằm tăng tính khám phá cho người khảo sát:
*   Sử dụng thuộc tính `perspective: 1000px` trên thẻ cha và `backface-visibility: hidden` trên hai mặt trước/sau để tạo chiều sâu chân thực khi xoay.
*   Hiệu ứng chuyển đổi xoay 180 độ theo trục Y (`transform: rotateY(180deg)`) khi thẻ được nhấn hoặc chọn.

### B. Chỉ số Phản hồi Tương tác (Interactive Micro-animations)
*   **Hover effects:** Các thẻ và nút bấm phải có phản hồi thị giác ngay lập tức khi di chuột:
    ```css
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ```
*   **Tick Mark:** Khi một thẻ được xếp hạng "Rất quan trọng", một nút tick có vòng tròn cam rực rỡ và biểu tượng V sẽ xuất hiện ở góc trên bên phải để người dùng nhận diện nhanh.

---

## 4. Quy chuẩn Biểu đồ và Tệp PDF (Charts & PDF Layouts)

### A. Biểu đồ Radar Chart (Chart.js)
*   Vẽ biểu đồ mạng nhện (radar chart) hiển thị Top 7 giá trị cốt lõi đã được xếp hạng thông qua duel.
*   *Màu sắc biểu đồ:* Phần diện tích giá trị được tô màu cam bán trong suốt (`rgba(234, 88, 12, 0.2)`) với viền cam đậm (`#ea580c`) để khớp với warm theme của ứng dụng.

### B. Kết xuất Báo cáo PDF (html2pdf.js Layout)
*   Báo cáo PDF tải xuống phải được căn chỉnh lọt lòng trang A4 (không bị tràn viền hoặc vỡ hình).
*   *Cấu hình html2pdf.js chuẩn:*
    ```javascript
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'Báo cáo Giá trị Cốt lõi.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    ```
*   Sử dụng CSS page-break (`page-break-before: always`) để kiểm soát ngắt trang thủ công, tránh trường hợp biểu đồ hoặc chữ bị cắt đôi giữa các trang.

---

## 5. Quy chuẩn Tiếp cận & Khả dụng (WCAG 2.1 Accessibility & Usability)

Để đảm bảo trang web có thể tiếp cận tốt nhất cho tất cả người dùng, bao gồm cả những người khuyết tật sử dụng công cụ hỗ trợ (như trình đọc màn hình - Screen Readers):

### A. Kích thước vùng tương tác (Touch Targets)
*   Mọi nút bấm tương tác (ví dụ: `.abcde-btn-send`) phải có kích thước vùng bấm tối thiểu là `44px x 44px` để người dùng di động dễ dàng thao tác mà không bấm nhầm.

### B. Bẫy tiêu điểm (Keyboard Focus Trap)
*   Khi các hộp thoại dạng Modal (như ABCDE Chatbox hoặc Custom Value Modal) đang mở:
    *   Phím `Tab` và `Shift + Tab` phải được giới hạn di chuyển chỉ trong các phần tử tương tác của modal đó (Input, Button, Link). Tiêu điểm không được lọt ra các phần tử nền bên ngoài.
    *   Phím `Escape` phải đóng modal lập tức và trả lại tiêu điểm (`return focus`) về nút bấm đã mở modal đó trước đó.

### C. Khử chuyển động (Reduced Motion)
*   Hệ thống tôn trọng cấu hình hệ điều hành của người dùng. Khi phát hiện media query `prefers-reduced-motion: reduce`:
    *   Tất cả các hiệu ứng lật thẻ 3D xoay (`.flip-card-inner`) phải chuyển sang trạng thái chuyển đổi tức thời (không dùng transition).
    *   Các hiệu ứng nhấp nháy vô hạn (`blink-glow` trên `.flip-card.blinking`) và hiệu ứng phóng to modal (`zoomIn`) phải bị vô hiệu hóa hoàn toàn (`animation: none`).
