# UAT Report: Nâng Cấp Admin Dashboard Thống Nhất 4 Tab (`PLAN-20261011-UNIFIED-DASHBOARD`)

- **Ngày kiểm thử:** `2026-10-11 23:08:14`
- **Mã kế hoạch:** `PLAN-20261011-UNIFIED-DASHBOARD`
- **Người thực hiện:** Antigravity / Gemini Pair Programming
- **Trạng thái:** `VERIFIED LOCAL PASS (10/10 Kịch Bản)`

---

## 1. Mục Tiêu & Phạm Vi Kiểm Thử

Khắc phục triệt để lỗi Admin Dashboard (`admin.html`) hiển thị `0 / 507 HV (0%)` do 404 tệp tĩnh `live_submissions.json` và hàm tự động purge dữ liệu Apollo. Nâng cấp thành Dashboard thống nhất 4 Tab đồng bộ thời gian thực từ Google Sheets Webhook.

### Allowlist tệp được sửa (đúng 2 tệp):
1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\admin.html`
2. `c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\admin.html` (mirror đồng bộ 100%)

---

## 2. Ma Trận Kết Quả Kiểm Thử (10/10 PASS)

| # | Kịch Bản Kiểm Thử | Trạng Thái | Chi Tiết Bằng Chứng |
|---|---|:---:|---|
| 1 | Nạp Dữ Liệu Thời Gian Thực Từ Google Sheets Webhook | **PASS** | Tổng HV nạp thành công (518 HV trên dh4hn-website, 508 HV trên Teaching DH), đã test: 6 HV (1%), không còn bị 0/507 HV. |
| 2 | Tab 1 (Đo Lường Bài Test): Hiển thị KPI, Phễu & Bảng học viên | **PASS** | Bảng Test hiển thị đầy đủ dòng, tỷ lệ đỗ L1 đạt chuẩn 67%. |
| 3 | Tab 2 (Thu Hoạch 5 Trạm I•A•M): Chuyển tab, KPI, Heatmap 5 trạm & Bảng dữ liệu | **PASS** | Đã nạp 7 HV tham gia Workshop, Heatmap hiển thị đủ 5 ô trạm, bảng dữ liệu lọc 126 dòng Apollo. |
| 4 | Modal Chi Tiết 5 Trạm I•A•M: Mở & Đóng kiểm tra nội dung phản tư | **PASS** | Mở modal hiển thị đúng tên, nội dung I•A•M từng trạm; đóng modal ẩn DOM an toàn. |
| 5 | Tab 3 (Hành Trình Blended 360°): Bảng tổng hợp 4 trụ cột Quiz + Values + ABCDE + 5 Trạm | **PASS** | Tổng hợp chính xác tiến độ 4 trụ cột, thanh tiến độ và huy hiệu hiển thị đầy đủ. |
| 6 | Tab 4 (Báo Cáo & Xuất CSV): Tiến độ tổng thể 3 Chặng Mini-LMS | **PASS** | Bảng tổng hợp hiển thị đầy đủ học viên, chức năng xuất CSV hỗ trợ UTF-8 BOM. |
| 7 | Nút Gạt Tự Động Làm Mới 60s: Bật/Tắt chu kỳ tự động | **PASS** | Toggle chuyển đổi trạng thái timer và text thông báo chính xác. |
| 8 | Bộ Lọc Center & Phòng Ban: Lọc động học viên theo cơ sở Apollo | **PASS** | Đổi bộ lọc Center lọc động danh sách theo đúng cơ sở được chọn. |
| 9 | Bảo Toàn Dữ Liệu Thi Thật (Hàm purgeSimulatedApolloData KHÔNG tự động xóa kết quả) | **PASS** | Học viên có kết quả thi thật không bị reset về 0 sau khi mở trang hoặc tải lại. |
| 10 | Không còn lỗi 404 `live_submissions.json` (Thay thế hoàn toàn bằng Webhook) | **PASS** | Console sạch hoàn toàn lỗi 404, request gọi trực tiếp tới GAS endpoint. |

---

## 3. Tính Toàn Vẹn Tệp Nguồn & Tệp Mirror

- **SHA256 Hash `dh4hn-website/lms/admin.html`:** `B266B11D8B69D0A8E21D09D6282B447D2E46FF9C3A6057E0014851F613A4D9B4`
- **SHA256 Hash `Teaching DH/dhm-micro-lms/admin.html`:** `B266B11D8B69D0A8E21D09D6282B447D2E46FF9C3A6057E0014851F613A4D9B4`
- **Khớp 100%:** Hai tệp đồng bộ tuyệt đối từng byte.
