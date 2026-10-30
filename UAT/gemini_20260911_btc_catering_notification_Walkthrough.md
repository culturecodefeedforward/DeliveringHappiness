# Báo Cáo Nghiệm Thu: Bổ Sung Email Thông Báo Cho BTC Khi Học Viên Nộp Phí Catering Khóa Leadership

**Ngày hoàn thành:** 11/09/2026  
**Bề mặt kiểm chứng:** Live verified (Xác minh trực tiếp trên Google Apps Script Production & Hộp thư Gmail BTC)  
**Tài khoản người gửi:** `culturecodeproject@gmail.com`  
**Danh sách nhận thông báo BTC:** `chauhm71@gmail.com`, `vuhoang2708@gmail.com`, `hoanhn.edu.vn@gmail.com`  

---

## 1. Mục Tiêu & Bối Cảnh
Bổ sung tính năng gửi email thông báo tự động tức thì cho Ban Tổ Chức (CultureCode Team) khi có học viên xác nhận tham gia và hoàn tất nộp khoản phí in ấn tài liệu & catering (250,000 VNĐ) cho chương trình **Team Happiness Starts With Your Leadership** (20/09/2026 tại Apollo English, 282 Phạm Ngọc Thạch, Q.3, TP.HCM).

---

## 2. Nguyên Nhân Gốc Rễ & Vấn Đề Đã Xử Lý
1. **Hàng đợi email Lane DHL bị bỏ quên trong cron/worker:**  
   Hàm `processEmailQueue()` trong Apps Script trước đây chỉ gọi xử lý cho `dh8` và `dh9`, thiếu dòng gọi `processEmailQueueForLane_('dhl')`. Hậu quả là các email `PENDING`, `BTC`, `PAID`, và `BTC_PAID` sinh ra sau khi học viên đăng ký hoặc SePay khớp lệnh đều bị kẹt lại ở trạng thái `PENDING` trong bảng tính `DHL_Email_Outbox`.
2. **Mẫu email thông báo BTC chưa cá nhân hóa cho phí catering:**  
   Nội dung email `BTC_PAID` mặc định của hệ thống trước đây dùng câu chữ chung cho các khóa học thông thường, thiếu thông tin khoản thu catering 250.000 VNĐ, chưa có tiến độ lớp học `X / 22 học viên` và còn sót chữ ký rác không đúng chuẩn nhận diện `CultureCode Team`.

---

## 3. Các Thay Đổi Kỹ Thuật Đã Thực Hiện
- **Mã nguồn Backend (`Scripts/active_code_gs_final.js` và `Artifacts/dhm8_gate2_clasp_production_20260617/Mã.js`):**
  1. Thêm `processEmailQueueForLane_('dhl');` vào `processEmailQueue()`.
  2. Bổ sung tham số `lane` vào endpoint `handleOperatorRunEmailQueueGet_` để hỗ trợ trigger và kiểm thử riêng từng lane.
  3. Cập nhật hàm `renderEmailBody`: Thiết kế mẫu email `BTC_PAID` chuyên biệt cho `laneKey === 'dhl'`:
     - **Tiêu đề email:** `[CultureCode] Thông báo BTC: Học viên hoàn tất nộp phí catering - Leadership Workshop (20/09)`
     - **Hộp thông tin học viên (`event-box`):** Họ tên, SĐT, Email, Đơn vị/Công ty, Mã chuyển khoản `DHL...`, Khoản thu (250.000 VNĐ), Trạng thái `PAID (Đã khớp lệnh SePay)`.
     - **Hộp tiến độ (`event-box`):** Thống kê động `X / 22 học viên chính thức hoàn thành nộp phí`.
     - **Chân trang thương hiệu:** 100% chuẩn nhận diện `CultureCode Team`, loại bỏ hoàn toàn các chữ ký rác và link ảnh tĩnh cũ.
- **Sao lưu an toàn trước triển khai:**
  - [active_code_gs_final.before.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/deploy_backups/20260911_btc_catering_notification_before_deploy/active_code_gs_final.before.js)
  - [Mã.before.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/deploy_backups/20260911_btc_catering_notification_before_deploy/Mã.before.js)
- **Triển khai Production lên Google Cloud:**
  - Thực hiện `clasp push` đẩy mã nguồn chuẩn lên Script ID `1qzwACGvT12j7rxoSW3w4OwpX5rt87Heh4CEA1qT85HJbTYe1yam6dwNS`.
  - Tạo thành công **Deployment `@71`**:
    - **Deployment ID:** `AKfycby1KIcyyL0BFravY1Ms88hWLB4GK7DekP86C1JCZCSBtiALmBpB_b0CJRMpFhPcMDvz_A`
    - **Web App URL:** `https://script.google.com/macros/s/AKfycby1KIcyyL0BFravY1Ms88hWLB4GK7DekP86C1JCZCSBtiALmBpB_b0CJRMpFhPcMDvz_A/exec`

---

## 4. Kết Quả Kiểm Thử Nghiệm Thu Thực Tế (Live Verification)

### A. Tình trạng Hàng đợi Outbox (`DHL_Email_Outbox`)
Toàn bộ **37 / 37** bản ghi trong sheet `DHL_Email_Outbox` (bao gồm các email gửi học viên và thông báo gửi BTC) đã được xử lý thành công và chuyển sang trạng thái `SENT` (100% không có lỗi, không có bản ghi nào bị kẹt hay DEAD).

### B. Bảng Đối Soát Bằng Chứng Google Message ID Thật (Email Thông Báo BTC Khi Học Viên Nộp Phí Catering)

| STT | Học viên | SĐT | Email Học viên | Mã CK | Google Message ID Thật | Liên kết kiểm chứng Gmail |
|:---:|:---|:---|:---|:---:|:---:|:---|
| 1 | **Phan Thị Ngọc Hội** | 0909425458 | hoi.ngoc.phan@ktcvietnam.com | `DHL909425458` | `1a08f9f1fb6153f7` | [Xem trên Gmail](https://mail.google.com/mail/u/0/#all/1a08f9f1fb6153f7) |
| 2 | **Nguyễn Anh Tuấn (Michael)** | 0398866031 | michael.nguyen@hansencx.com | `DHL398866031` | `1a08f9fbabd67498` | [Xem trên Gmail](https://mail.google.com/mail/u/0/#all/1a08f9fbabd67498) |
| 3 | **Nguyễn Đức Anh (KTC)** | 0374247294 | ducanh.nguyen@apollo.edu.vn | `DHL374247294` | `1a08fa0060a7a66f` | [Xem trên Gmail](https://mail.google.com/mail/u/0/#all/1a08fa0060a7a66f) |
| 4 | **Đoàn Dũng (KTC)** | 0905297813 | dung.doan@apollo.edu.vn | `DHL905297813` | `1a08fa0485ca1717` | [Xem trên Gmail](https://mail.google.com/mail/u/0/#all/1a08fa0485ca1717) |
| 5 | **Nguyễn Thị Hồng Lê** | 0904124299 | hongle.nguyen125@gmail.com | `DHL904124299` | `1a08fa19d415ab33` | [Xem trên Gmail](https://mail.google.com/mail/u/0/#all/1a08fa19d415ab33) |
| 6 | **Vũ Khánh Linh** | 0838712632 | vukhanhlinh91@gmail.com | `DHL838712632` | `1a08fa1d9deeccc4` | [Xem trên Gmail](https://mail.google.com/mail/u/0/#all/1a08fa1d9deeccc4) |

> **Ghi chú:** 100% email thông báo BTC đều hiển thị chính xác thông điệp:  
> `✓ Học viên đã hoàn tất nộp phí catering Leadership`  
> `Khoản thu: Phí in ấn tài liệu & catering: 250,000 VNĐ`  
> `Tiến độ nộp phí catering: Đã có 6 / 22 học viên chính thức hoàn thành nộp phí cho khóa Leadership (20/09/2026)`  
> `Trân trọng, CultureCode Team`
