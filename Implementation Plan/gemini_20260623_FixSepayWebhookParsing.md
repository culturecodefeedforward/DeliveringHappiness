# Kế hoạch triển khai: Sửa đổi triệt để thuật toán bóc tách mã thanh toán từ Webhook SePay
*Mã tài liệu: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260623_FixSepayWebhookParsing.md*
*Thời gian tạo: 23/06/2026*

## 1. Đề bài & Hiện trạng (Problem & Current State)

### Đề bài
Khi người học chuyển khoản hoàn tất học phí qua cổng SePay, hệ thống ghi nhận giao dịch dưới dạng webhook. Một số giao dịch bị đánh dấu là `NO_MATCH` dù số tiền khớp và nội dung chuyển khoản chứa đúng mã thanh toán của học viên (ví dụ: `DH8913989172-230626-09:21:39`).

### Hiện trạng & Nguyên nhân gốc rễ (Pain Point & Root Cause)
* **File ảnh hưởng trực tiếp:** [active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js) tại dòng 1031-1039.
* **Nguyên nhân gốc rễ:** 
  Hàm xử lý webhook cắt chuỗi nội dung chuyển khoản bằng regex `/[\s\/\.,:;]+/`. Ký tự gạch ngang `-` không nằm trong danh sách ký tự phân tách này. Do đó, chuỗi `DH8913989172-230626-09:21:39` bị bóc tách thành từ khóa `DH8913989172-230626-09` (do bị cắt ở dấu hai chấm `:`); sau đó chuẩn hóa loại bỏ ký tự đặc biệt thành `DH891398917223062609`. Chuỗi này không trùng khớp với mã thanh toán chuẩn của học viên là `DH8913989172`.

---

## 2. Giải pháp kỹ thuật (Technical Solution)

Chúng ta sẽ sửa đổi thuật toán bóc tách token trong file [active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js) như sau:
1. **Phân tách theo toàn bộ ký tự không phải chữ và số:** Thay thế regex split cũ bằng `/[^A-Z0-9]+/i`. Việc này sẽ tách sạch các từ khóa dạng chữ và số đứng riêng biệt (ví dụ: `DH8913989172`, `230626`, `09`, `21`, `39`).
2. **Bảo toàn chuỗi viết liền không dấu:** Thêm chuỗi nội dung chuyển khoản đã loại bỏ toàn bộ ký tự đặc biệt (`strippedContent`) vào danh sách token tìm kiếm. Việc này giúp xử lý trường hợp người dùng nhập dạng `DH8-913989172` (sau khi stripped sẽ thành `DH8913989172` và khớp thành công).

### Chi tiết thay đổi code:
```javascript
  // Trích xuất các token bằng cách phân tách theo bất kỳ ký tự không phải chữ/số nào
  var rawTokens = content.split(/[^A-Z0-9]+/i).map(function(t) {
    return (t || '').toString().trim().toUpperCase();
  }).filter(function(t) { return t !== ''; });

  // Thêm toàn bộ nội dung chuyển khoản đã loại bỏ ký tự đặc biệt để phòng trường hợp mã bị phân tách bằng dấu gạch ngang
  var strippedContent = content.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  if (strippedContent && rawTokens.indexOf(strippedContent) === -1) {
    rawTokens.push(strippedContent);
  }
```

---

## 3. Kế hoạch kiểm thử nghiệm thu (UAT & Verification Plan)

### Kiểm thử cục bộ (Local Mock Tests)
Chúng ta sẽ bổ sung các ca kiểm thử trong [dhm8_mock_tests_20260616.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_mock_tests_20260616.js) để chạy trực tiếp bằng Node:
* **Ca 1 (Dính ngày giờ):** Nội dung `"DH8913989172-230626-09:21:39"` phải bóc tách được mã `'DH8913989172'`.
* **Ca 2 (Phân tách bằng dấu gạch ngang):** Nội dung `"DH8-913989172"` phải bóc tách được mã `'DH80913989172'`.
* **Ca 3 (Ký tự lạ khác):** Nội dung `"DH8913989172_note_123"` hoặc `"DH8913989172(note)"` phải khớp được mã `'DH8913989172'`.

### Kiểm thử trên Google Sheet thực tế (Live UAT)
Sử dụng `workspace-mcp` để đọc lại bảng tính sau khi cập nhật mã nguồn Apps Script và chạy thử nghiệm.

---

## 4. Auditor Review

Kính gửi Codex / Claude: Xin vui lòng rà soát thiết kế thuật toán phân tách token trên xem có rủi ro hồi quy (regression) hay bỏ sót trường hợp biên nào không.

---

## 5. Rủi ro & Kế hoạch quay lui (Risks & Rollback)
* **Rủi ro:** Một số nội dung chuyển khoản chứa thông tin dài có chữ `DH` ngẫu nhiên có thể bị khớp nhầm. Tuy nhiên, hệ thống đã có lớp phòng vệ kiểm tra trùng khớp mã thanh toán duy nhất (`matched.length === 1`) và kiểm tra số tiền chuyển khoản (`amountIn === DHM8_PRICE`), do đó rủi ro này cực kỳ thấp.
* **Quay lui:** Sử dụng git checkout / khôi phục từ file backup `active_code_gs_rollback.js`.
