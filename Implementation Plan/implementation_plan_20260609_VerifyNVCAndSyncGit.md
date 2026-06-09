# Kế hoạch triển khai (Implementation Plan) - Xác minh UAT NVC & Đồng bộ Git

**Ngày tạo:** 09/06/2026  
**Dự án:** culturecodefeedforward/DeliveringHappiness (dh4hn-website)  
**Tác giả:** Antigravity Dev Bot  
**Đường dẫn file trong dự án (In-project File path):** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\implementation_plan_20260609_VerifyNVCAndSyncGit.md`

---

## 1. Đề bài (Goal Description)
Xác minh thực tế việc tích hợp trang đăng ký **Giao Tiếp Kết Nối (NVC - Nonviolent Communication)** thông qua `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) trên trang `live` (môi trường vận hành trực tuyến thực tế) của Vercel, đồng thời đồng bộ mã nguồn Git lên tất cả các `remote` (nhánh lưu trữ trên máy chủ từ xa) còn lại của dự án.

## 2. Hiện trạng (Current State)
*   **Mã nguồn local:** Đã thực hiện `commit` (lưu lại các thay đổi vào lịch sử Git) và `push` (đẩy mã nguồn lên máy chủ từ xa) commit mới nhất `223faa1` ("feat: integrate Google Apps Script Webhook for NVC and fix CSS typo in register.html") lên remote `origin/main`.
*   **Trang đăng ký NVC (`register_nvc.html`):** Đã cấu hình `webhook` (đường dẫn nhận phản hồi tự động) thật của Google Apps Script v1 và đã được Vercel tự động build & `deploy` (đưa ứng dụng lên môi trường chạy thực tế) thành công.
*   **Đồng bộ Git:**
    *   `origin` (https://github.com/culturecodefeedforward/DeliveringHappiness.git): Đã đồng bộ hoàn toàn (Up-to-date).
    *   `personal` (https://github.com/vuhoang2708/culture_code_VN.DH.git): Chưa được push commit mới nhất `223faa1`.
    *   `legacy_org` (https://github.com/culturecodeproject/Delivering-Happiness.git): Đang ở commit cũ từ tháng 3/2026.
*   **UAT:** Chưa thực hiện gửi đăng ký thử nghiệm thực tế để kiểm chứng luồng dữ liệu ghi vào Google Sheet và gửi email thông báo.

## 3. Giải pháp kỹ thuật (Technical Solution)

### Bước 1: Thực hiện UAT Live (Kiểm thử thực tế)
*   Sử dụng `browser subagent` (trình duyệt phụ trợ tự động) để truy cập link đăng ký NVC live trên Vercel:
    `https://delivering-happiness-1g21q3dc4-vuhoang2708s-projects.vercel.app/register_nvc.html`
*   Điền form với dữ liệu kiểm thử (ví dụ: Họ tên "UAT Test Gemini", SĐT Zalo, Email, chọn Vai trò, nhập Tình huống và chọn các lựa chọn Khảo sát).
*   Bấm gửi đăng ký (Submit).
*   Kiểm tra màn hình thành công và sự xuất hiện của mã QR Zalo Blooming On.
*   Chụp ảnh màn hình làm `evidence` (bằng chứng kiểm chứng thực tế) lưu tại thư mục `UAT/`.

### Bước 2: Kiểm tra Dữ liệu Phía Sau (Backend Verification)
*   Sử dụng công cụ MCP để đọc Google Sheet `CultureCode - NVC Leads` (ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`), xác nhận dòng dữ liệu UAT đã được thêm chính xác.
*   Sử dụng công cụ MCP kiểm tra hộp thư Gmail `vuhoang2708@gmail.com` để xác nhận email thông báo đăng ký mới đã được gửi thành công.

### Bước 3: Đồng bộ Git lên các Remote còn lại
*   Đẩy nhánh `main` lên remote `personal`:
    ```powershell
    git push personal main
    ```
*   Đối với remote `legacy_org`, vì đây là repo cũ (legacy), chúng ta cần xác nhận xem có cần đồng bộ nhánh `main` hay không. Kế hoạch đề xuất: Đồng bộ nhánh `main` sang `legacy_org` nếu được User đồng ý:
    ```powershell
    git push legacy_org main
    ```

---

## 4. Các file bị ảnh hưởng (Proposed Changes)

### dh4hn-website
#### [NEW] [implementation_plan_20260609_VerifyNVCAndSyncGit.md](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/implementation_plan_20260609_VerifyNVCAndSyncGit.md)
*   Tệp kế hoạch triển khai và kiểm thử hiện tại.

#### [NEW] [UAT_NVC_Success_20260609.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/UAT_NVC_Success_20260609.png)
*   Ảnh chụp màn hình kết quả UAT thành công (sẽ tạo sau khi chạy test).

---

## 5. Rủi ro tiềm ẩn & Biện pháp giảm thiểu (Risks & Mitigations)
*   **Rủi ro 1: Xung đột lịch sử commit (Non-fast-forward) khi push sang `personal` hoặc `legacy_org`.**
    *   *Biện pháp:* Chạy `git fetch --all` trước để kiểm tra lịch sử commit. Nếu cần thiết, tạo nhánh riêng hoặc dùng `--force-with-lease` sau khi đã trao đổi với User.
*   **Rủi ro 2: Lỗi CORS khi gửi dữ liệu client-side.**
    *   *Biện pháp:* Apps Script đang dùng chế độ `no-cors` trong `fetch` của `tracking.js`. Phương thức này cho phép gửi request thành công lên Google Sheet mặc dù trình duyệt hiển thị phản hồi dạng opaque. Chúng ta sẽ kiểm tra kết quả ghi Sheet thực tế để xác nhận.

---

## 6. Kế hoạch Quay lui (Rollback Plan)
*   Nếu quá trình push git lên `personal` hoặc `legacy_org` gặp lỗi, khôi phục lại trạng thái tracking của local và giữ nguyên nhánh `main` hoạt động ổn định trên `origin`.

---

## 7. Auditor Review (Codex Review)
*   **Đồng bộ Git:** Việc đồng bộ nhánh `main` sang `personal` giúp đảm bảo kho lưu trữ cá nhân luôn cập nhật. Cần cẩn trọng khi đẩy lên `legacy_org` để tránh ghi đè các cấu hình đặc thù cũ nếu có.
*   **UAT:** Quá trình kiểm thử UAT live sử dụng `browser subagent` là bước bắt buộc theo quy tắc dự án để đảm bảo trang hoạt động chính xác trước khi bàn giao.

---
*(Vui lòng phản hồi "Approve", "Đồng ý" hoặc "OK" để tiến hành thực hiện bước tiếp theo)*
