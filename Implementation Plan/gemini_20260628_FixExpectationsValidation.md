# Kế hoạch triển khai - Loại bỏ bắt buộc nhập trường kỳ vọng (expectations)

Kế hoạch này nhằm loại bỏ thuộc tính bắt buộc nhập (`required`) của trường ý kiến/kỳ vọng (`expectations`) trên các trang đăng ký còn lại để thống nhất trải nghiệm người dùng với trang chủ `register.html`.

## Hiện trạng & Vấn đề (Pain Point & Root Cause)

*   **Vấn đề:** Khi người dùng gửi biểu mẫu đăng ký ở các trang `register_dh9_hanoi.html`, `register_direct.html`, và `register-test.html`, trình duyệt hiển thị lỗi yêu cầu nhập trường kỳ vọng (03 điều mong đợi nhất sau khi kết thúc chương trình) mặc dù mục này theo chính sách của Ban tổ chức đã được chuyển thành không bắt buộc (không bắt buộc nhập - optional).
*   **Nguyên nhân gốc (Root Cause):** Thuộc tính `required` đã được loại bỏ khỏi `register.html` trước đó, nhưng các file nhân bản/phân nhánh bao gồm [register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html), [register_direct.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_direct.html), và [register-test.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register-test.html) vẫn giữ nguyên thuộc tính `required` và ký tự `*` trong thẻ `<label>`.

## Giải pháp kỹ thuật (Technical Solution)

1.  Loại bỏ thuộc tính `required` khỏi thẻ `<textarea name="expectations">` trong các file HTML bị ảnh hưởng.
2.  Bỏ ký hiệu `*` (đánh dấu bắt buộc nhập) ở thẻ `<label>` tương ứng.
3.  Đảm bảo mã nguồn sau khi sửa tuân thủ hoàn toàn cấu trúc dữ liệu gửi lên Google Apps Script (vốn đã hỗ trợ giá trị rỗng cho `expectations`).

## Các file bị ảnh hưởng (Files Affected)

*   [register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html)
*   [register_direct.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_direct.html)
*   [register-test.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register-test.html)

---

## Chi tiết thay đổi đề xuất (Proposed Changes)

### Component: Frontend HTML

#### [MODIFY] [register_dh9_hanoi.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html)

**Dòng 565-566:**
```diff
-                    <label>03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì? *</label>
-                    <textarea name="expectations" required rows="3" placeholder="Ví dụ: 1. Hiểu cách xây dựng văn hóa hạnh phúc; 2. ..."></textarea>
+                    <label>03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì?</label>
+                    <textarea name="expectations" rows="3" placeholder="Ví dụ: 1. Hiểu cách xây dựng văn hóa hạnh phúc; 2. ..."></textarea>
```

#### [MODIFY] [register_direct.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_direct.html)

**Dòng 533-534:**
```diff
-                    <label>03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì? *</label>
-                    <textarea name="expectations" required rows="3" placeholder="Ví dụ: 1. Hiểu cách xây dựng văn hóa hạnh phúc; 2. ..."></textarea>
+                    <label>03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì?</label>
+                    <textarea name="expectations" rows="3" placeholder="Ví dụ: 1. Hiểu cách xây dựng văn hóa hạnh phúc; 2. ..."></textarea>
```

#### [MODIFY] [register-test.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register-test.html)

**Dòng 574-576:**
```diff
-                    <label>03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì? *</label>
-                    <textarea name="expectations" required rows="3"
-                        placeholder="Ví dụ: 1. Hiểu cách xây dựng văn hóa hạnh phúc; 2. ..."></textarea>
+                    <label>03 điều bạn mong đợi nhất sau khi kết thúc chương trình là gì?</label>
+                    <textarea name="expectations" rows="3"
+                        placeholder="Ví dụ: 1. Hiểu cách xây dựng văn hóa hạnh phúc; 2. ..."></textarea>
```

---

## Kế hoạch kiểm chứng (Verification Plan)

### Automated Tests
Không áp dụng unit test trực tiếp cho form validation tĩnh này, tuy nhiên sẽ chạy lệnh kiểm tra cú pháp HTML tĩnh:
*   Sử dụng browser check thủ công (UAT) để đảm bảo form submit thành công khi bỏ trống trường kỳ vọng.

### Kiểm thử thủ công (Manual Verification / UAT)
1.  Mở trang đăng ký trực tiếp ở môi trường cục bộ hoặc staging (nếu có).
2.  Điền đầy đủ thông tin bắt buộc khác.
3.  Bỏ trống trường "03 điều bạn mong đợi nhất..."
4.  Nhấp "Gửi đăng ký & Hoàn tất" và xác nhận form gửi đi thành công mà không hiển thị tooltip yêu cầu điền dữ liệu của trình duyệt.

## Auditor Review
*Dành cho Codex hoặc Claude rà soát chéo.*
*   Mục tiêu: Đảm bảo không bỏ sót bất kỳ trang HTML nào đang chứa thuộc tính `required` của trường `expectations`.
