# Kế hoạch triển khai Real-time Phone Validation & Asynchronous Email

Sếp đã phê duyệt phương án kết hợp tối ưu cả Frontend (kiểm tra trùng SĐT thời gian thực) và Backend (chuyển đổi gửi email xác nhận sang chế độ bất đồng bộ).

---

## 🛠️ Chi tiết giải pháp kỹ thuật

### 1. Phía Frontend (Real-time Validation)
- Lắng nghe sự kiện `blur` và `input` (kèm debounce 800ms) trên trường nhập liệu số điện thoại (`phone`).
- Tự động gọi API `checkStatus` kiểm tra trùng số điện thoại ngay trong khi người dùng đang điền thông tin và hiển thị cảnh báo đỏ trực tiếp dưới ô nhập liệu nếu trùng, đồng thời khóa nút Submit.
- Khi người dùng nhấn nút gửi (`Submit`), nếu số điện thoại đã được kiểm tra hợp lệ (`phoneValidated === true`), biểu mẫu sẽ **bỏ qua preflight check** gửi thẳng đăng ký đi, giúp tiết kiệm thêm 2-3 giây.

### 2. Phía Backend (Asynchronous Email)
- Trong luồng đăng ký của học viên (`handleRegistration` trong Apps Script), vô hiệu hóa cuộc gọi gửi email đồng bộ `kickEmailQueueSafely_`.
- Các email xác nhận (cho học viên và cho BTC) vẫn được tạo và lưu vào hàng đợi `outbox` trong Sheets như bình thường.
- Việc gửi email thật sẽ được chuyển giao hoàn toàn cho **Trigger ngầm** chạy background định kỳ mỗi phút.
- Thay đổi này sẽ giải phóng ngay lập tức luồng xử lý của user, giảm thời gian xử lý request POST từ 5-8s xuống còn ~1s.

---

## Các file bị ảnh hưởng (Proposed Changes)

### Frontend Component
#### [MODIFY] [register.js](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.js)
*(Đã thực hiện xong ở local: Tích hợp sự kiện blur/input và bỏ qua preflight check nếu đã validate)*

### Backend Google Apps Script Component
#### [MODIFY] [Mã.js (Staging)](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/dhm8_gate2_clasp_staging_20260616/Mã.js)
#### [MODIFY] [Mã.js (Production)](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js)
Vô hiệu hóa (comment) cuộc gọi gửi email đồng bộ trong hàm `handleRegistration`:
```javascript
// kickEmailQueueSafely_(ss, 'registration:' + uuid);
```

---

## Kế hoạch kiểm chứng (Verification Plan)

### Kiểm thử thủ công (Manual Verification)
1. Đẩy code lên Staging qua clasp và deploy.
2. Kiểm tra giao diện local/staging bằng trình duyệt:
   - Điền SĐT đã trùng -> xác nhận báo lỗi đỏ và nút Submit bị khóa.
   - Điền SĐT mới -> xác nhận lỗi biến mất, nhấn Submit và kiểm tra xem form hoàn tất gửi đi cực nhanh (< 2 giây).
3. Đẩy code lên Production (DH8 & DH9) qua clasp và deploy.
4. Rà soát live form trên Vercel để xác nhận kết quả hoạt động hoàn hảo.
