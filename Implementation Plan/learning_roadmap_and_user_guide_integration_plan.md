# Kế Hoạch Triển Khai: Tối Ưu Vị Trí Hiển Thị Nút Bài Test & Lộ Trình Học Trên LMS

## 1. Vấn Đề Phát Hiện Từ Ảnh Chụp Thực Tế (Root Cause)
Từ ảnh chụp màn hình thực tế của người dùng:
- Khung phát Video bài giảng (`16:9`) có kích thước quá lớn, choán gần như toàn bộ chiều dọc màn hình laptop (~768px).
- Toàn bộ thanh nút bấm `Quick Action Bar`, `Tabs System` và `Hero Quiz Banner` bị đẩy xuống phía dưới màn hình (Below the fold).
- Người dùng khi vừa mở trang vào hoàn toàn không nhìn thấy bất kỳ nút bấm nào nếu không cuộn chuột xuống tít bên dưới.

---

## 2. Giải Pháp Triển Khai Đa Điểm Chạm (Above-the-Fold & Sticky Elements)
1. **Đưa Thanh Nút Hành Động Lên Trên Cùng (`Above-the-Fold`):**
   - Đặt thanh thông báo và nút `[⚡ Mở Bài Test ➔]` cùng `[📘 Lộ Trình & Hướng Dẫn]` lên **NGAY DƯỚI TIÊU ĐỀ BÀI HỌC (TRÊN CẢ VIDEO PLAYER)**.
   - Vừa mở trang ra là nhìn thấy ngay lập tức ở khu vực đầu tiên của nội dung mà không cần cuộn.
2. **Bổ Sung Nút Trên Thanh Header (Top Header):**
   - Thêm nút `[⚡ Bài Test]` và `[📘 Lộ Trình]` ngay trên thanh menu trên cùng cạnh Avatar học viên.
3. **Bổ Sung Nút Trên Thanh Chân Trang Cố Định (Sticky Bottom Bar):**
   - Đặt `[⚡ Làm Bài Test (10 câu)]` và `[📘 Lộ Trình & HDSD]` ngay cạnh nút `Lưu tiến độ`.
   - Vì thanh chân trang luôn cố định ở đáy màn hình, người dùng dù ở bất kỳ vị trí nào cũng nhìn thấy 2 nút này 100%.
4. **Thu Gọn Chiều Cao Video Player:**
   - Đặt giới hạn `max-h-[380px]` cho khung Video để không nuốt trọn chiều cao màn hình laptop.

---

## 3. Các Tệp Tin Thay Đổi
- `lms/index.html` (Bố cục lại vị trí các nút ở Header, Trên Video, Tabs cuộn mượt và Chân trang)
- `lms/app.js` (Gắn sự kiện cho các nút ở mọi vị trí, tự chuyển Chặng 1 khi bấm Test từ chặng khác, chống tràn thẻ thói quen)
- `Implementation Plan/learning_roadmap_and_user_guide_integration_plan.md`

---

## 4. Kiểm Toán & Tối Ưu Hóa Giao Diện Đa Thiết Bị / Điện Thoại (UI/UX Pro Max Mobile Audit)
1. **Header & Brand Logo:**
   - Thêm `min-w-0` và `truncate` cho logo text để không bị ép sát mép trên màn hình siêu hẹp (320px - 360px).
   - Nút `[⚡ Bài Test]` giữ nguyên trên Header mọi kích thước màn hình để học viên luôn chạm được một chạm.
2. **Hero Action Bar (Trên Video):**
   - Áp dụng `grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:justify-end`: Trên điện thoại (<640px), 2 nút `[📘 Lộ Trình]` và `[⚡ Mở Bài Test]` chia đôi 50/50 chiều rộng màn hình, vừa vặn ngón cái hai tay với chiều cao tối thiểu đạt chuẩn 44px (`min-h-[44px]`).
3. **Tab Navigation Bar:**
   - Bổ sung `shrink-0 whitespace-nowrap` cho toàn bộ các nút tab (`.tab-btn`), chống gãy chữ thành nhiều dòng và cho phép vuốt ngang tự nhiên như ứng dụng di động bản địa.
4. **Vùng Chân Trang Cố Định (Sticky Bottom Bar Mobile):**
   - Ẩn 2 nút phụ trên mobile (`hidden sm:inline-flex`) vì người dùng đã có thanh Action Bar to đùng ở đầu bài và nút Header cố định.
   - Thu gọn nhãn nút trên màn hình nhỏ: `[⬅ Trước]` + `[💾 Lưu]` + `[Tiếp tục ➔]`.
   - Giữ thanh chân trang chỉ chiếm đúng 1 dòng duy nhất, không nuốt diện tích màn hình điện thoại.
5. **Thực Hành Lưới 21 Ngày (Stage 3 Habit Tracker Grid):**
   - Bổ sung `flex-wrap` cho hàng nút 5 thói quen (`G M O F A`), điều chỉnh lưới cột `grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2`, triệt tiêu hoàn toàn nguy cơ tràn mép thẻ trên màn hình điện thoại hẹp.
6. **Vùng Chạm (Touch Targets) Đạt Chuẩn Apple HIG / Material Design:**
   - Các nút lựa chọn đáp án trắc nghiệm (`quiz-opt-btn`) và thẻ chọn giá trị cốt lõi Me Values đều bổ sung `min-h-[44px]`.
7. **Xử Lý Chuyển Đổi Trạng Thái Trắc Nghiệm Thông Minh:**
   - Bổ sung logic trong `jumpToStage1Quiz()`: nếu học viên đang duyệt Chặng 2 hoặc Chặng 3 mà bấm nút `[⚡ Bài Test]`, hệ thống tự động tải lại Chặng 1 (`loadStage(0)`) và cuộn tới đúng vị trí bài thi.

