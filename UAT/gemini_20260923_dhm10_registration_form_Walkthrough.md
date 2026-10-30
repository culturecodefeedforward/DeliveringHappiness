# Walkthrough: Hoàn Thành Triển Khai Form Đăng Ký DHM10 & Cấu Hình Hệ Thống

## 1. Tóm tắt Kết quả (Executive Summary)
Thực hiện theo chỉ đạo của Chị Châu (Delivering Happiness) và phê duyệt từ Sếp Dzũ, hệ thống đã hoàn tất triển khai trọn bộ các thành phần cho khóa học **Delivering Happiness Masterclass 10 (DHM10)**:
1. **Bài viết LinkedIn hoàn chỉnh**: Đúc kết chiều sâu văn hóa từ Leadership Workshop & DHM9, mở tuyển sinh DHM10 với Sense of Progress rõ nét.
2. **Giao diện Form Đăng ký DHM10 (`register_dhm10.html` & `register_dhm10.js`)**:
   - Tích hợp trường bắt buộc: Chọn địa điểm học tập trung (`Hà Nội - Cơ sở Apollo English` hoặc `TP.HCM - Cơ sở Apollo English`).
   - Nêu bật cấu trúc học Hybrid (Webinar trực tuyến chuẩn bị trước + 01 ngày Offline thực hành chuyên sâu) cùng giảng viên cơ hữu của CultureCode Team đồng hành trực tiếp tại lớp.
   - Cơ chế sinh mã thanh toán SePay tự động với cú pháp `DHM10<SĐT>` và tạo mã VietQR động.
3. **Cấu hình Lane Backend (`Scripts/active_code_gs_final.js`)**:
   - Thêm lane `dh10` kết nối các sheet: `DHM10_Data`, `DHM10_Payments`, `DHM10_Email_Outbox`, `DHM10_Inbox`.
   - Lưu trữ trường `Địa điểm học` (`data.learningLocation`) ở cột 19 (bảo đảm 100% backward compatibility với các hệ thống cũ).
   - Đạt 10/10 test unit kiểm thử logic cục bộ.
4. **Mẫu Email Chuẩn Nhận Diện CultureCode Team**:
   - Tạo mới `Artifacts/standardized_emails/dhm10_pending_email.html` và `dhm10_paid_email.html`.
   - Đạt 100% tiêu chí kiểm định Hợp đồng Nội dung Email qua `scripts/validate_email_template.py`.

---

## 2. Chi tiết các Tệp Tin Đã Xử lý (Processed Files)

| Thành phần | Đường dẫn Tệp | Trạng thái |
| :--- | :--- | :--- |
| **Giao diện Form** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_dhm10.html` | Tạo mới (Đã kiểm tra cấu trúc) |
| **Logic Client-side** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_dhm10.js` | Tạo mới (`node -c` PASS) |
| **Backend Lane** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js` | Cập nhật lane `dh10` (10/10 test PASS) |
| **Bản backup Backend** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js.bak_dhm10` | Đã lưu trữ an toàn |
| **Email Pending** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\standardized_emails\dhm10_pending_email.html` | Tạo mới (Validator PASS) |
| **Email Paid** | `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\standardized_emails\dhm10_paid_email.html` | Tạo mới (Validator PASS) |

---

## 3. Kết quả Kiểm thử & Nghiệm thu (Verification & UAT Results)

### A. Kiểm thử Cú pháp & Runtime Backend
- Lệnh: `node Scripts/active_code_gs_final.js -c` $\rightarrow$ Exit code 0 (Không có lỗi cú pháp).
- Lệnh: `node register_dhm10.js -c` $\rightarrow$ Exit code 0 (Không có lỗi cú pháp).
- Unit Test Suite (`scratch/test_backend_logic.js`):
  * Test 1: `getLaneKey_("dh10") === "dh10"` $\rightarrow$ **PASS**
  * Test 2: `getLaneKey_("dhm10") === "dh10"` $\rightarrow$ **PASS**
  * Test 3: `isDhm10Token_("DHM100912345678") === true` $\rightarrow$ **PASS**
  * Test 4: `detectLaneKeyFromPaymentCode_("DHM10987654321") === "dh10"` $\rightarrow$ **PASS**
  * Test 5: `detectLaneKeyFromPayload_({ lane: "dh10" }) === "dh10"` $\rightarrow$ **PASS**
  * Test 6: `detectLaneKeyFromPayload_({ event_id: "DHM10_REG_2026_HYBRID" }) === "dh10"` $\rightarrow$ **PASS**
  * Test 7: `getLaneConfig_("dh10").titleShort === "DHM10"` $\rightarrow$ **PASS**
  * Test 8: `getLaneConfig_("dh10").dataSheetName === "DHM10_Data"` $\rightarrow$ **PASS**
  * Test 9: `getLaneConfig_("dh10").paymentPrefix === "DHM10"` $\rightarrow$ **PASS**
  * Test 10: `getLaneConfig_("dh10").cityLabel === "Hà Nội & TP.HCM"` $\rightarrow$ **PASS**

### B. Kiểm định Hợp đồng Nội dung Email (Email Content Contract)
- Lệnh: `python scripts/validate_email_template.py Artifacts/standardized_emails/dhm10_pending_email.html`
  * Dynamic Source of Truth Config: BIDV 8815369431 (Hà Ngọc Hoàn) | CultureCode Team $\rightarrow$ **KHỚP**
  * Check HTTP Status hình ảnh trực tuyến: 3/3 URL HTTP 200 OK $\rightarrow$ **PASS**
  * Kết quả: `=== DYNAMIC VALIDATION PASSED PROPERLY ===`
- Lệnh: `python scripts/validate_email_template.py Artifacts/standardized_emails/dhm10_paid_email.html`
  * Check HTTP Status hình ảnh trực tuyến: 2/2 URL HTTP 200 OK $\rightarrow$ **PASS**
  * Chữ ký chuẩn nhận diện: `<p class="team-name">CultureCode Team</p>` $\rightarrow$ **PASS**
  * Kết quả: `=== DYNAMIC VALIDATION PASSED PROPERLY ===`

---

## 4. Hướng dẫn Triển khai Tiếp theo (Next Steps)
1. **Tạo Sheet trên Google Spreadsheet**: Khi Web App nhận bản ghi đầu tiên hoặc khởi tạo thủ công, tạo sheet `DHM10_Data`, `DHM10_Payments`, `DHM10_Email_Outbox`, `DHM10_Inbox` trong spreadsheet chính.
2. **Deploy Apps Script**: Sao chép nội dung `Scripts/active_code_gs_final.js` vào trình biên soạn Apps Script và tạo phiên bản triển khai mới (New Deployment).
3. **Phát hành Web**: File `register_dhm10.html` đã sẵn sàng để phục vụ tuyển sinh trên môi trường staging và production theo quy trình staged deployment.
