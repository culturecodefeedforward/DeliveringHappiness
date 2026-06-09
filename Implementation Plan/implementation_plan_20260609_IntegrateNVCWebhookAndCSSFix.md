# Kế hoạch triển khai (Implementation Plan) - Tích hợp Webhook Đăng ký NVC & Sửa lỗi CSS

**Ngày tạo:** 09/06/2026  
**Dự án:** culturecodefeedforward/DeliveringHappiness (dh4hn-website)  
**Tác giả:** Antigravity Dev Bot  
**Đường dẫn file trong dự án (In-project File path):** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\implementation_plan_20260609_IntegrateNVCWebhookAndCSSFix.md`

---

## 1. Đề bài (Goal Description)
Tích hợp hệ thống lưu trữ `lead` (dữ liệu khách hàng tiềm năng) đăng ký cho chương trình **Giao Tiếp Kết Nối (NVC - Nonviolent Communication)** thông qua `webhook` (đường dẫn nhận phản hồi tự động) của Google Apps Script, đồng thời sửa lỗi cú pháp CSS trong trang đăng ký chính. Quy trình bao gồm:
1. Đăng ký thông tin học viên trên `landing page` (trang đích) `register_nvc.html`.
2. Gửi dữ liệu về Google Apps Script Web App.
3. Apps Script lưu thông tin vào Google Sheet `CultureCode - NVC Leads` (Sheet ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`).
4. Gửi email thông báo tự động về `vuhoang2708@gmail.com` khi có đăng ký mới.
5. Sau khi đăng ký thành công, hiển thị trang thông báo kèm mã QR để tham gia nhóm Zalo đồng hành **Blooming On**.
6. Sửa lỗi `typo` (lỗi đánh máy) CSS `input:focutaos` thành `input:focus` ở dòng 105 trong tệp `register.html` để đảm bảo giao diện form chuẩn hoạt động ổn định.
7. Đồng bộ mã nguồn lên GitHub `repository` (kho lưu trữ mã nguồn) và cập nhật phiên bản trực tuyến `live` trên Vercel.
8. Thực hiện `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) toàn diện trên môi trường `live` (môi trường vận hành thực tế) để chứng minh hệ thống hoạt động chính xác trước khi bàn giao.

## 2. Hiện trạng & Lỗi phát hiện (Current State)
*   **Apps Script Web App:** Dự án Apps Script với ID `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu` (thuộc tài khoản `vuhoang2708@gmail.com`) đã được viết mã, nhưng chưa được `deploy` (đưa lên môi trường chạy thực tế) phiên bản mới nhất dưới dạng Web App để nhận URL public `/exec`.
*   **Form Đăng ký NVC (`register_nvc.html`):** Phần cấu hình URL Web App vẫn đang sử dụng `placeholder` (trình giữ chỗ tạm thời) `AKfycbx_PLACEHOLDER_NVC_WEBHOOK_URL`.
*   **Trang Đăng ký gốc (`register.html`):** Dòng 105 đang tồn tại lỗi CSS nghiêm trọng `input:focutaos` thay vì `input:focus`, làm mất hiệu ứng khi người dùng trỏ chuột chọn ô nhập dữ liệu.
*   **Môi trường Live:** Các thay đổi mới chưa được cập nhật và đồng bộ lên Vercel. Do clasp CLI chưa đăng nhập local, việc deploy Apps Script sẽ được thực hiện trực tiếp thông qua trình duyệt (`browser subagent`).

## 3. Giải pháp kỹ thuật (Technical Solution)

### Bước 1: Deploy Google Apps Script Web App
*   Sử dụng `browser subagent` (trình duyệt phụ trợ tự động) để mở trình duyệt Chrome (đã đăng nhập tài khoản Google của người dùng) và truy cập link chỉnh sửa Apps Script:  
    `https://script.google.com/d/1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu/edit`
*   Thực hiện thao tác: **Deploy** -> **New deployment** -> Chọn loại **Web app**.
*   Cấu hình deployment:
    *   *Description*: `CultureCode - NVC Webhook v1`
    *   *Execute as*: **Me (vuhoang2708@gmail.com)**
    *   *Who has access*: **Anyone**
*   Bấm **Deploy**, xác thực quyền truy cập OAuth (như cấp quyền gửi Email và ghi Sheet) bằng cách chọn "Advanced" -> "Go to CultureCode - NVC Webhook (unsafe)" -> "Allow".
*   Sao chép URL Web App có dạng:  
    `https://script.google.com/macros/s/AKfycbx.../exec`

### Bước 2: Cập nhật URL Webhook & Sửa lỗi CSS
*   **Sửa file `register_nvc.html`:** Thay thế `window.CUSTOM_WEBAPP_URL` tại dòng 530 bằng URL thực tế vừa lấy được từ Bước 1.
*   **Sửa file `register.html`:** Chỉnh sửa dòng 105 từ `input:focutaos,` thành `input:focus,`.

### Bước 3: Đồng bộ & Deploy lên Môi trường Live (Vercel)
*   Kiểm tra `git status` để dọn dẹp các tệp tin dư thừa hoặc tệp cấu hình không cần thiết.
*   Chỉ stage các tệp tin cần thiết: `register_nvc.html`, `register.html`, `blooming_on_qr.jpg`, và file kế hoạch triển khai này.
*   Thực hiện `git commit` với thông điệp: `feat: integrate Google Apps Script Webhook for NVC and fix CSS typo in register.html`.
*   `git push` lên nhánh `main` của remote `origin`.
*   Xác minh build status trên Vercel để đảm bảo trạng thái deploy hoàn tất.

### Bước 4: Kiểm thử UAT trên môi trường Live
*   Dùng `browser subagent` truy cập URL live của trang đăng ký NVC: `https://[vercel-domain]/register_nvc.html`.
*   Điền thông tin thử nghiệm và gửi đăng ký (Submit).
*   Kiểm tra và xác nhận:
    1.  Nút gửi đăng ký chuyển sang "Đang xử lý..." kèm hiệu ứng quay (spinner).
    2.  Hiển thị màn hình thành công kèm mã QR Zalo.
    3.  Mã QR Zalo `blooming_on_qr.jpg` hiển thị chính xác, sắc nét.
    4.  Dữ liệu được ghi thành công vào các cột tương ứng trong Google Sheet `CultureCode - NVC Leads`.
    5.  Hộp thư Gmail `vuhoang2708@gmail.com` nhận được email thông báo có định dạng HTML đầy đủ.
*   Chụp ảnh màn hình làm bằng chứng kiểm thử (Evidence) để lưu trữ.

---

## 4. Các file bị ảnh hưởng (Proposed Changes)

### dh4hn-website
#### [MODIFY] [register_nvc.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_nvc.html)
*   Thay đổi dòng 530 để tích hợp URL Webhook thật của Google Apps Script.

#### [MODIFY] [register.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register.html)
*   Sửa lỗi typo CSS tại dòng 105 từ `input:focutaos` thành `input:focus`.

#### [NEW] [implementation_plan_20260609_IntegrateNVCWebhookAndCSSFix.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/implementation_plan_20260609_IntegrateNVCWebhookAndCSSFix.md)
*   Tệp kế hoạch triển khai hiện tại.

---

## 5. Rủi ro tiềm ẩn & Biện pháp giảm thiểu (Risks & Mitigations)
*   **Rủi ro 1: Quyền truy cập Google Sheet/Gmail của Apps Script bị chặn.**
    *   *Biện pháp:* Đảm bảo khi tạo deployment mới, ta cấp quyền đầy đủ (Allow) qua màn hình OAuth của Google.
*   **Rủi ro 2: Nhầm lẫn nhánh hoặc Repo khi Push.**
    *   *Biện pháp:* Chạy `git remote -v` và `git status --short --branch` để xác định chính xác repo `dh4hn-website` và nhánh `main` trước khi commit/push.

---

## 6. Kế hoạch Quay lui (Rollback Plan)
Nếu phiên bản mới phát sinh lỗi nghiêm trọng trên trang live:
1.  Khôi phục các tệp tin frontend về trạng thái ổn định trước đó:
    ```powershell
    git restore register_nvc.html register.html
    ```
2.  Commit và push ngay lập tức để Vercel tự động khôi phục giao diện live về trạng thái hoạt động bình thường.

---

## 7. Auditor Review (Codex Review)
*   **Đánh giá kiến trúc:** Việc sửa lỗi CSS `input:focutaos` là cần thiết để khôi phục hành vi UI mặc định khi người dùng tương tác với form.
*   **Bảo mật:** URL Webhook dạng `/exec` của Apps Script không chứa Spreadsheet ID hay Access Token của tài khoản, do đó an toàn khi để công khai ở client-side Javascript.

---
*(Vui lòng phản hồi "Approve", "Đồng ý" hoặc "OK" để tiến hành thực hiện bước tiếp theo)*
