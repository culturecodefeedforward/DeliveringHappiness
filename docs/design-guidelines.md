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

---

## 6. Email Design System (CultureCode Premium Format)

Tất cả các email gửi tự động cho khách hàng (Xác nhận thanh toán, Báo cáo ABCDE) phải tuân theo chuẩn CultureCode Premium:
*   **Font chữ**: Phải là sans-serif, sạch sẽ và dễ đọc (Helvetica, Arial, sans-serif).
*   **Bố cục (Layout)**:
    *   Chứa trong một container trung tâm, rộng tối đa 600px.
    *   Nền email màu xám nhạt `#f3f4f6`, nền phần thân trắng `#ffffff` với viền góc bo tròn `8px`.
*   **Header**: Hiển thị Logo CultureCode được căn giữa, viền dưới nhẹ.
*   **Button (CTA)**: Màu nền chính là đen (`#111827`) hoặc cam ấm (`#ea580c`), chữ trắng, bo góc mạnh (`4px` hoặc `8px`), padding tối thiểu `12px 24px`.
*   **Footer**: Màu xám nhạt nhòa (`#6b7280`), cỡ chữ nhỏ, ghi rõ bản quyền và thông tin công ty.

---

## 7. UI Specification cho Chatbox ABCDE và QR Check-in

### A. Giao diện Chatbox ABCDE
*   **Thiết kế Bong bóng Hội thoại (Chat Bubbles)**:
    *   *AI Message (Gemini)*: Nằm bên trái, nền xám siêu nhạt (`#f3f4f6`), có avatar chữ G (bo tròn) hoặc icon Socratic.
    *   *User Message*: Nằm bên phải, nền màu tối (hoặc cam), chữ trắng.
*   **Khu vực nhập liệu**: Khóa và hiển thị placeholder hướng dẫn chi tiết theo từng trạng thái (Ví dụ: "Mô tả Nghịch cảnh A...").
*   **Hiệu ứng Loading (Typing Indicator)**: Hiển thị 3 dấu chấm nhảy nhẹ nhàng khi API Gemini đang xử lý trả lời.

### B. Giao diện QR Check-in (`checkin.html`)
*   **Layout Cốt lõi**: Giao diện tối giản toàn màn hình, phù hợp với màn hình di động đứng (Portrait view).
*   **Video Scanner Overlay**: Luồng camera có overlay khung lấy nét ở giữa.
*   **Phản hồi Âm thanh & Hình ảnh**:
    *   Phát tiếng "Bíp" khi quét thành công.
    *   Hiển thị Modal lớn màu xanh lá (Xác nhận Khớp) hoặc Đỏ (Lỗi/Không tồn tại) kèm ảnh đại diện/tên học viên to, rõ.

---

## 8. Trạng thái Stable/Beta và Đường dự phòng

*   Bộ chọn ABCDE phải phân biệt rõ `Stable` (ổn định) và `RAG Beta` (bản thử nghiệm), không dùng màu sắc làm tín hiệu duy nhất.
*   Stable phải luôn là lựa chọn mặc định và vẫn sử dụng được độc lập khi Beta bị tắt hoặc lỗi.
*   Khi Beta trả lỗi kết nối/503, giao diện phải giải thích ngắn gọn và cung cấp nút chuyển về Stable mà không làm mất nội dung người dùng vừa nhập.
*   Các yêu cầu trên đã được đối chiếu ở source `chat-abcde.js` và `chat-abcde.css`; trạng thái hiển thị desktop/mobile live vẫn `UNVERIFIED` cho tới khi có browser evidence.

---

## 9. Thiết Kế Giao Diện LMS Chế Độ Học Tập Tập Trung (Focused Mode) & Mô Hình 3 Khối

### A. Chế độ Thu gọn Sidebar Desktop (LinkedIn Learning Focused Pattern)
*   **Thanh điều hướng Sidebar (`#sidebar`):**
    *   *Trạng thái mở rộng (Expanded):* Chiều rộng tiêu chuẩn `w-80` (320px), hiển thị đầy đủ danh mục chặng, bài học, biểu tượng trạng thái và thời lượng. Nút thu gọn `#btn-collapse-sidebar-desktop` đặt góc trên bên phải của sidebar.
    *   *Trạng thái thu gọn (Collapsed):* Ẩn bằng class `-translate-x-full lg:hidden` (hoặc chuyển thành cột siêu hẹp `w-0` hoặc `hidden`), mở rộng toàn bộ diện tích hiển thị bài giảng và bảng thực hành.
    *   *Nút mở rộng trên Header (`#btn-sidebar-desktop-expand`):* Khi sidebar đóng, nút mở rộng xuất hiện mượt mà trên header chính với tooltip "Mở rộng danh mục bài học".
    *   *Lưu trữ trạng thái:* Giá trị cờ boolean được đồng bộ vào `localStorage: dhm_sidebar_desktop_collapsed` để giữ nguyên trạng thái khi chuyển bài hoặc làm mới trang.

### B. Mô hình 3 Khối Nội Dung Sư phạm (Duy 3-Sections Interactive UX)
*   **Section 1: Bối cảnh & Trọng tâm học phần (`bg-amber-50/50 border-amber-200`):**
    *   Tông màu hổ phách dịu mát (amber warm tone), viền mảnh bo góc mềm mại.
    *   Icon huy hiệu lý thuyết, tóm lược từ khóa cốt lõi giúp học viên định hình tư duy trước khi bắt tay làm bài.
*   **Section 2: Ngân hàng Tình huống Thực chiến (`bg-slate-50 border-slate-200`):**
    *   Tông màu xám trung tính chuyên nghiệp, thẻ card nổi khối nhẹ.
    *   Thông tin bối cảnh doanh nghiệp thực tế rõ ràng: Tên doanh nghiệp, vị trí nhân sự, mâu thuẫn cần giải quyết, giúp tạo độ "chạm" và liên hệ thực tiễn cao cho học viên.
*   **Section 3: Bài tập Mẫu & Accordion Phân tích Đối chiếu (`bg-emerald-50/40 border-emerald-200`):**
    *   Tông màu xanh ngọc bích (emerald) thể hiện sự gợi mở và giải pháp.
    *   Nút accordion tương tác (`#btn-toggle-model-...`) với biểu tượng mũi tên xoay chuyển hướng mượt mà khi mở rộng.
    *   Nội dung bài tập mẫu trình bày theo cấu trúc phân rã chuẩn mực (I•A•M hoặc công thức chuyên biệt) giúp học viên dễ dàng sao chép phương pháp tư duy.

### C. Nút Tiếp Tục Học Tập Thông Minh (Smart Resume Learning CTA)
*   Nút Resume Learning trên Header (`#btn-header-resume`) sử dụng phong cách gradient màu nổi bật (`bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-sm hover:shadow`), kích thước tối thiểu 40px theo chuẩn tương tác di động/desktop.
*   Modal Quick Start Card (`#modal-quick-start`) trình bày dưới dạng thẻ Glassmorphism nổi bật giữa màn hình với backdrop mờ tối giản (`bg-black/50 backdrop-blur-sm`).

### D. Trực quan hóa Tiến độ & Hiệu ứng Chuyển động Accordion (Progress Badges & Accordion Motion)
*   **Huy hiệu Tích xanh Tiến độ (Section Checkmark `✓`):** Các tiểu mục và bài học đã hoàn thành hiển thị biểu tượng tích xanh lá cây bo tròn (`text-emerald-600 bg-emerald-100 rounded-full px-1.5 py-0.5 text-xs font-bold`) ở góc phải thanh điều hướng sidebar, tạo động lực tâm lý hoàn thành liên tục.
*   **Vi tương tác Accordion Bài giải Mẫu:** Nút mở bài tập mẫu có hiệu ứng chuyển đổi xoay icon mũi tên 180 độ (`transition-transform duration-200 group-hover:translate-x-0.5`), vùng nội dung gợi ý trượt mở mượt mà kèm khung viền nổi bật chấm phá (`border-l-4 border-emerald-500 bg-emerald-50/50 p-4 rounded-r-xl`).

