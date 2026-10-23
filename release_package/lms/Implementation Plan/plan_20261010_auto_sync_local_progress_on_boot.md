# KẾ HOẠCH TRIỂN KHAI (IMPLEMENTATION PLAN)
# CƠ CHẾ TỰ ĐỘNG ĐỒNG BỘ TIẾN ĐỘ CỤC BỘ LÊN GOOGLE SHEET KHI MỞ LMS (AUTO-SYNC ON BOOT)

- **Mã kế hoạch (Plan Code):** `PLAN-20261010-AUTO-SYNC-ON-BOOT`
- **Phiên bản:** `1.0.0`
- **Ngày lập:** 10/10/2026
- **Mục tiêu:** Khi bất kỳ học viên nào (đặc biệt là 123 học viên Apollo) mở trang web LMS (`/lms`), hệ thống tự động kiểm tra `localStorage` (bộ nhớ cục bộ trình duyệt), phát hiện các kết quả làm bài thi trắc nghiệm Chặng 1, giá trị cá nhân ME và tiến độ học tập đã làm trước đó trên máy, rồi tự động phát `silent background request` (yêu cầu gửi dữ liệu ngầm) đẩy lên Google Sheet chung của Ban Tổ Chức (`Team Happiness Apollo - Thu Hoạch IAM`) mà học viên không cần phải làm lại bài hay bấm bất kỳ nút nào.

---

## I. NGUYÊN TẮC CỐT LÕI & CÁC CHỐT AN TOÀN BẮT BUỘC (GUARDRAILS)

1. **Khử trùng lặp phát tin (Single-Flight & Resilient Dispatch Guard):**
   - *Phát hiện kiểm toán:* Hiện tại trong `app.js`, các hàm `syncQuizResultToWebhook`, `syncMeValuesToWebhook` và `syncToGoogleSheets` đều gọi song song cả `fetch(...)` lẫn `navigator.sendBeacon(...)` vô điều kiện, làm tăng gấp đôi số lượng request (duplicate dispatch) lên Webhook.
   - *Quy chuẩn mới:* Gom về một bộ phát duy nhất `dispatchTelemetryPayload(payload, webhookUrl)`: Ưu tiên `navigator.sendBeacon` trước; nếu không hỗ trợ hoặc trả về `false`, tự động fallback sang `fetch(..., { keepalive: true, mode: 'no-cors' })`.
2. **Tính chất `idempotent` (chạy nhiều lần vẫn ra đúng một kết quả duy nhất):**
   - Sinh chữ ký dữ liệu (State Hash) dựa trên: `identity + score + answeredCount + topValuesString`.
   - Lưu cờ `dhm_telemetry_last_hash_<identity>` và `dhm_telemetry_last_sync_time_<identity>`.
   - Nếu chữ ký không đổi VÀ lần sync trước đó chưa quá 60 phút: Bỏ qua (Skip), không gửi request thừa.
3. **Chống nghẽn Google Apps Script (Anti-Throttling Jitter Guard):**
   - Thêm độ trễ ngẫu nhiên (`Jitter`) từ 1.000ms đến 4.000ms (`Math.floor(Math.random() * 3000) + 1000`) trước khi phát request để phân tán tải, ngăn chặn việc 100+ học viên cùng mở LMS một lúc làm sập Webhook Google Apps Script.
4. **Khôi phục định danh khi chưa đăng nhập (Session Resilience):**
   - Nếu `currentUser` tạm thời chưa nạp vào bộ nhớ RAM, hàm tự động quét `localStorage` để tìm `dhm_lms_auth_user` hoặc `dhm_master_learners_directory` để xác định danh tính học viên trước khi đồng bộ.

---

## II. DANH SÁCH TỆP CHO PHÉP CHỈNH SỬA (ALLOWLIST)

Chỉ được phép chỉnh sửa các tệp trong danh sách sau:
1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js`
2. `c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js`

*Tệp tham chiếu (Chỉ đọc - Read-Only):*
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\admin.html`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\authorized_roster.json`
- `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\live_submissions.json`

---

## III. CHI TIẾT THAY ĐỔI MÃ NGUỒN (CODE MODIFICATIONS)

### 1. Chuẩn hóa hàm phát dữ liệu viễn trắc `dispatchTelemetryPayload`
Thay thế toàn bộ các lời gọi trùng lặp `fetch + sendBeacon` bằng:
```javascript
function dispatchTelemetryPayload(payload, webhookUrl) {
    if (!webhookUrl) return false;
    const bodyStr = JSON.stringify(payload);
    let sent = false;
    try {
        if (navigator.sendBeacon) {
            sent = navigator.sendBeacon(webhookUrl, bodyStr);
        }
    } catch (e) {
        sent = false;
    }
    if (!sent) {
        try {
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: bodyStr,
                keepalive: true,
                mode: "no-cors"
            }).catch(() => {});
            sent = true;
        } catch (err) {
            sent = false;
        }
    }
    return sent;
}
```

### 2. Xây dựng hàm `triggerAutoTelemetryOnBoot()`
- Đặt tại module Telemetry trong `app.js`.
- Nội dung:
  1. Trích xuất danh tính học viên từ `currentUser` hoặc `dhm_lms_auth_user`.
  2. Đọc tiến độ từ `dhm_lms_progress_<identity>` và `dhm_personal_values_latest`.
  3. Kiểm tra xem có dữ liệu hoàn thành bài thi Stage 1 hoặc Giá trị cá nhân hay không.
  4. Tính toán State Hash. So sánh với `dhm_telemetry_last_hash_<identity>`.
  5. Nếu cần gửi: Chạy `setTimeout` với Jitter 1.000ms - 4.000ms.
  6. Gói payload với action: `"auto_boot_sync"`, loại: `"AUTO_BOOT_TELEMETRY"`.
  7. Gọi `dispatchTelemetryPayload(payload, webhookUrl)`.
  8. Lưu hash và thời gian đồng bộ vào `localStorage`.

### 3. Gắn Hook kích hoạt vào chuỗi Boot
Gắn lời gọi `triggerAutoTelemetryOnBoot()` vào:
1. `applyUserSession()` (sau khi phiên học viên đã được nạp thành công).
2. Sự kiện `window.addEventListener("focus", ...)` (sau khi học viên quay lại tab từ bài khảo sát vệ tinh).

---

## IV. KỊCH BẢN KIỂM THỬ XÁC MINH (VERIFICATION & UAT SCENARIOS)

| STT | Kịch bản kiểm thử | Hành động & Dữ liệu đầu vào | Kết quả kỳ vọng |
|:---:|---|---|---|
| **TC1** | **Khởi động lần đầu có bài thi** | Giả lập `localStorage` có tài khoản và bài làm Chặng 1 | Hàm kích hoạt sau Jitter (1-4s), phát đúng payload, lưu hash và timestamp vào `localStorage`. |
| **TC2** | **Chống spam trùng lặp (Idempotent)** | F5 tải lại trang khi dữ liệu bài thi không thay đổi | Hàm phát hiện hash trùng khớp, lập tức bỏ qua (Skip), **0 request** phát ra mạng. |
| **TC3** | **Cập nhật bài thi mới** | Thay đổi đáp án/điểm số từ 8 lên 9 | Hash thay đổi, hàm phát hiện lệch hash và tự động gửi bản ghi cập nhật mới nhất. |
| **TC4** | **Bảo vệ tải (Concurrency Jitter)** | Đo thời gian delay trước khi phát | Đảm bảo request không bao giờ phát tức thời 0ms mà nằm trong khoảng 1.000ms - 4.000ms. |
| **TC5** | **Không ảnh hưởng UI** | Đo lường tác động hiển thị | Quá trình diễn ra 100% ngầm (async/background), không chặn luồng render, không hiện popup làm phiền người dùng. |

---

## V. KẾ HOẠCH SAO LƯU & QUAY LUI (ROLLBACK)

- **Trước khi sửa:**
  Tạo tệp sao lưu an toàn:
  - `dh4hn-website/lms/app.js.bak_20261010_auto_sync_on_boot`
  - `Teaching DH/dhm-micro-lms/app.js.bak_20261010_auto_sync_on_boot`
- **Lệnh quay lui tức thì nếu phát sinh lỗi:**
  ```powershell
  Copy-Item -Path "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js.bak_20261010_auto_sync_on_boot" -Destination "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js" -Force
  Copy-Item -Path "c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js.bak_20261010_auto_sync_on_boot" -Destination "c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js" -Force
  ```

---

## VI. RANH GIỚI PHÊ DUYỆT (APPROVAL BOUNDARIES)

- **Cấp độ 2 (Plan Approval):** Duyệt kế hoạch triển khai mã nguồn trên môi trường cục bộ và chạy kịch bản kiểm thử tự động.
- **Cấp độ 3 (Risky Operation Approval):** Bắt buộc phê duyệt riêng biệt từ Sếp Dzũ trước khi thực hiện `git commit`, `git push` lên GitHub và cập nhật bản live trên Vercel.
