# Kế hoạch triển khai (Implementation Plan) - Tích hợp Webhook Đăng ký NVC

**Ngày tạo:** 09/06/2026  
**Dự án:** culturecodefeedforward/DeliveringHappiness (dh4hn-website)  
**Tác giả:** Antigravity Dev Bot  
**File path:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\implementation_plan_20260609_IntegrateNVCWebhook.md`

---

## 1. Đề bài (Requirements)
Tích hợp hệ thống lưu trữ lead đăng ký cho chương trình **Giao Tiếp Kết Nối (NVC)** thông qua Google Apps Script Webhook. Quy trình bao gồm:
1. Đăng ký thông tin học viên trên landing page `register_nvc.html`.
2. Gửi dữ liệu về Google Apps Script Webhook.
3. Apps Script lưu thông tin vào Google Sheet `CultureCode - NVC Leads` (Sheet ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`).
4. Gửi email thông báo tự động về `vuhoang2708@gmail.com` khi có đăng ký mới.
5. Sau khi đăng ký thành công, hiển thị trang thông báo kèm mã QR để tham gia nhóm Zalo đồng hành **Blooming On**.
6. Đồng bộ mã nguồn lên GitHub và cập nhật bản `live` (môi trường production) trên Vercel.
7. Thực hiện `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) toàn diện trên môi trường `live` để chứng minh hệ thống hoạt động chính xác trước khi bàn giao.

## 2. Hiện trạng & Pain Points (Current State)
*   **Apps Script Webhook:** Đã được tạo script với ID `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu` dưới tài khoản `vuhoang2708@gmail.com` nhưng chưa được `deploy` (đưa lên môi trường chạy thực tế) phiên bản mới nhất dưới dạng Web App để lấy URL public `/exec`.
*   **Giao diện Đăng ký (`register_nvc.html`):** Phần cấu hình URL Web App vẫn đang sử dụng placeholder `AKfycbx_PLACEHOLDER_NVC_WEBHOOK_URL`.
*   **Môi trường Live:** Các thay đổi của form đăng ký NVC và file ảnh QR Zalo `blooming_on_qr.jpg` chưa được push lên GitHub và chưa deploy lên Vercel.
*   **Xác thực Credentials:** clasp CLI chưa được đăng nhập trên máy tính local này (không có file `.clasprc.json`). Do đó, việc deploy Apps Script sẽ được thực hiện trực tiếp bằng trình duyệt (`browser_subagent`) để đảm bảo an toàn và chính xác.

## 3. Giải pháp kỹ thuật (Technical Solution)

### Bước 1: Deploy Google Apps Script Web App
*   Sử dụng `browser_subagent` mở trình duyệt Chrome (đã đăng nhập tài khoản Google của user) và truy cập link chỉnh sửa Apps Script:  
    `https://script.google.com/d/1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu/edit`
*   Thực hiện thao tác: **Deploy** -> **New deployment** -> Chọn loại **Web app**.
*   Cấu hình deployment:
    *   *Description*: `CultureCode - NVC Webhook v1`
    *   *Execute as*: **Me (vuhoang2708@gmail.com)**
    *   *Who has access*: **Anyone**
*   Bấm **Deploy**, xác thực quyền truy cập nếu Google yêu cầu (như cấp quyền gửi Email và ghi Sheet).
*   Sao chép URL Web App có dạng:  
    `https://script.google.com/macros/s/AKfycbx.../exec`

### Bước 2: Cập nhật URL Webhook vào Frontend
*   Sửa file `register_nvc.html`, thay thế dòng:
    ```javascript
    window.CUSTOM_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx_PLACEHOLDER_NVC_WEBHOOK_URL/exec";
    ```
    bằng URL thực tế vừa lấy được ở Bước 1.

### Bước 3: Đồng bộ & Deploy lên Môi trường Live (Vercel)
*   Kiểm tra `git status` để lọc sạch các file rác.
*   Stage các file cần thiết: `register_nvc.html`, `blooming_on_qr.jpg`, và các file cấu hình cần thiết khác.
*   Thực hiện `git commit` với message chuẩn chỉnh: `feat: integrate Google Apps Script Webhook and Zalo QR for NVC registration`.
*   `git push` lên nhánh `main` của remote `origin`.
*   Verify trạng thái deployment trên Vercel để đảm bảo bản build thành công và trang web cập nhật live (không phỏng đoán mà sử dụng browser để truy cập trực tiếp URL live).

### Bước 4: Kiểm thử UAT trên môi trường Live
*   Dùng `browser_subagent` truy cập URL live của trang đăng ký NVC (ví dụ: `https://[vercel-domain]/register_nvc.html`).
*   Điền thông tin giả lập và submit form.
*   Xác nhận:
    1.  Nút submit chuyển trạng thái "Đang xử lý..." và hiển thị spinner.
    2.  Hiển thị màn hình thành công kèm mã QR Zalo.
    3.  Kiểm tra Google Sheet để đảm bảo dữ liệu lead được ghi đúng vào các cột.
    4.  Kiểm tra Gmail `vuhoang2708@gmail.com` xem có nhận được email thông báo định dạng HTML đẹp mắt hay không.
*   Chụp ảnh màn hình kết quả kiểm thử làm bằng chứng nghiệm thu.

## 4. Các file bị ảnh hưởng (Affected Files)
*   `register_nvc.html` (Sửa đổi: thay thế URL webhook).
*   `Implementation Plan/implementation_plan_20260609_IntegrateNVCWebhook.md` (Thêm mới: file kế hoạch triển khai).

## 5. Rủi ro tiềm ẩn & Biện pháp giảm thiểu (Risks & Mitigations)
*   **Rủi ro 1: Google Apps Script yêu cầu Authorization OAuth khi deploy lần đầu.**
    *   *Biện pháp:* `browser_subagent` sẽ phát hiện màn hình yêu cầu cấp quyền (nếu có), nhấp vào "Advanced" -> "Go to CultureCode - NVC Webhook (unsafe)" -> "Allow" để hoàn tất cấp quyền.
*   **Rủi ro 2: Lỗi CORS khi gửi dữ liệu từ trang live về Apps Script.**
    *   *Biện pháp:* File `tracking.js` đã cấu hình gửi request với `mode: 'no-cors'`. Ngoài ra, hàm `doPost` trong Apps Script trả về JSON output hợp lệ. Ta sẽ verify kỹ bước này trong UAT.
*   **Rủi ro 3: Push nhầm file nhạy cảm hoặc file rác lên GitHub.**
    *   *Biện pháp:* Chỉ stage đích danh `register_nvc.html`, `blooming_on_qr.jpg` và file kế hoạch triển khai. Không chạy `git add .` vô điều kiện.

## 6. Kế hoạch Rollback (Quay lui)
Nếu xảy ra lỗi nghiêm trọng trên trang live sau khi deploy:
1.  Khôi phục file `register_nvc.html` về trạng thái ban đầu bằng lệnh:
    ```bash
    git restore register_nvc.html
    ```
2.  Commit và push bản sửa lỗi/rollback lên GitHub để Vercel tự động redeploy về bản cũ ổn định.

---

## 7. Auditor Review (Codex Review)
*(Phần dành cho Codex / Claude rà soát và phản biện)*
*   **Kiến trúc:** Việc tích hợp Apps Script trực tiếp từ frontend qua cơ chế `no-cors` giúp tránh lỗi CORS nhưng giới hạn khả năng đọc trực tiếp response JSON ở frontend. Tuy nhiên, logic trong `tracking.js` đã xử lý tốt việc này bằng cách coi mọi request gửi đi thành công (hoặc bắt lỗi mạng cơ bản). Điều này phù hợp với landing page tĩnh.
*   **Bảo mật:** Webhook mở cho `ANYONE` để nhận lead từ công chúng. Cần đảm bảo Spreadsheet ID không bị lộ ra ngoài ngoài mã nguồn server Apps Script (đã được cấu hình ẩn trong script `Code.gs` và không hiển thị ở mã nguồn HTML của client).

---
*(Vui lòng phản hồi "Approve", "Đồng ý" hoặc "OK" để tiến hành thực hiện bước tiếp theo)*
