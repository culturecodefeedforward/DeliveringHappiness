# BÁO CÁO KIỂM THỬ CỤC BỘ (LOCAL UAT): NỘI DUNG HƯỚNG DẪN BẢNG ĐIỂM DANH VÀ RENDER ẢNH CẨM NANG TRÊN WEB LMS

- **Mã kế hoạch:** `PLAN-20261005-LMS-WEB-HABIT-GUIDE`
- **Thời gian thực hiện:** 05/10/2026 13:19 (Giờ Việt Nam)
- **Môi trường kiểm thử:** Localhost (Puppeteer Headless, viewport 1280x900)
- **Tài khoản kiểm thử:** `vuhoang2708software@gmail.com` (Pass: `1234`, Role: Coach, Cohort: BTC / Coach)
- **Trạng thái tổng hợp:** **3/3 TEST CASES PASSED (100% PASS - LOCAL DONE)**

---

## 1. Kết Quả Kiểm Thử Chi Tiết Từng Ca

| Ca kiểm thử | Tiêu chí đánh giá | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :---: |
| **Case 1** | Đăng nhập tài khoản test Coach, mở khóa toàn bộ 3 chặng | Tên hiển thị `#user-display-name` ghi nhận: `Vũ Hoàng (Test)`, menu 3 chặng hoạt động trơn tru. | **PASS** |
| **Case 2** | Khối Accordion Hướng Dẫn & Chú Giải 5 Thói Quen (M-G-O-F-A) tại `#stage3-tracker-section` | `<details open class="explore-more">` hiển thị mở sẵn, đầy đủ 5 thẻ thói quen (M, G, O, F, A), 3 bước thao tác chuẩn và nút liên kết mở cẩm nang `#btn-open-habit-full-doc`. | **PASS** |
| **Case 3** | Modal Cẩm Nang Lộ Trình mở đúng, hiển thị Phần V & Render 4 ảnh giao diện thực tế | Modal `#doc-reader-modal` hiển thị, tiêu đề `Cẩm Nang: Lộ Trình Học Tập & Hướng Dẫn Sử Dụng LMS`, tải trọn vẹn `huong_dan_va_lo_trinh_hoc_dhm.md`, hàm `renderSimpleMarkdown` render thành công **4 thẻ `<img>` sắc nét**. | **PASS** |

---

## 2. Bằng Chứng Ảnh Chụp Màn Hình (Local UAT Screenshots)

1. **Khối Hướng Dẫn & Chú Giải 5 Thói Quen trên Bảng Điểm Danh Chặng 3:**
   - Đường dẫn ảnh: `dh4hn-website/UAT/screenshots/local_uat_habit_guide_section.png`
   - Bằng chứng: Hiển thị 5 thẻ M-G-O-F-A màu hổ phách, 3 khung hướng dẫn thao tác chuẩn và nút xanh Đồng Bộ Về BTC.

2. **Modal Đọc Cẩm Nang Lộ Trình hiển thị Phần V và 4 Ảnh Giao Diện Thực Tế:**
   - Đường dẫn ảnh: `dh4hn-website/UAT/screenshots/local_uat_doc_reader_part_v_with_images.png`
   - Bằng chứng: Văn bản Phần V hiển thị sắc nét cùng 4 khối ảnh chụp giao diện có bo góc và đổ bóng shadow-2xl.

---

## 3. Danh Mục Tệp Tin Đã Chỉnh Sửa & Sẵn Sàng Commit
- `dh4hn-website/data/artifacts/images/` (4 tệp ảnh tĩnh)
- `dh4hn-website/data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md` (Bổ sung Phần V)
- `dh4hn-website/lms/index.html` (Thêm khối Accordion hướng dẫn tại `#stage3-tracker-section`)
- `dh4hn-website/lms/app.js` (Hỗ trợ parse ảnh trong markdown và gắn sự kiện mở cẩm nang)

---

## 4. Kết Luận
Tính năng đã hoàn thành kiểm thử cục bộ đạt chuẩn 100% (Local Done). Sẵn sàng chờ lệnh phê duyệt Cấp độ 3 từ Sếp Dzũ để commit và push lên production live Vercel.
