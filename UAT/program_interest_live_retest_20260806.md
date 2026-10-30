# Báo cáo UAT: program-interest (Live Retest)

**Ngày thực hiện:** 2026-08-06
**Mục tiêu:** Xác nhận hiện trạng live của lỗi 404 liên quan `/program-interest` và kiểm tra hồi quy CTA.
**Verdict:** `PUBLIC_ROUTE_VERIFIED_RELEASE_GATE_INCOMPLETE`

## Tóm tắt kết quả
- Tất cả 5 URL được kiểm thử trên Public Alias (`https://delivering-happiness.vercel.app`) đều **hoạt động bình thường**, không gặp lỗi 404. Các URL có đuôi `.html` tự động redirect (308) qua URL sạch và trả về HTTP 200/304 (hit cache).
- Không có lỗi Console hay Page Error trên cả Desktop và Mobile. DOM tải đầy đủ form.
- Do kiểm thử trên Public Alias, Vercel không trả về `deploymentId` trong header (không có `dpl_...`), dẫn đến không xác thực được tính bất biến của bản phát hành (Release Gate Incomplete).

## Bảng kết quả (5 URL x 2 Viewport)

| URL (Ca kiểm thử) | Viewport | Status | Final URL | Title | DOM Checks | Console/Network | Ảnh chụp | Claim Level |
|---|---|---|---|---|---|---|---|---|
| `/` | Desktop | 200 | `/` | Delivering Happiness... | CTA Tồn tại, Href: `interest.html` | Không có lỗi | `index_desktop.png` | VERIFIED |
| `/` | Mobile | 304 | `/` | Delivering Happiness... | CTA Tồn tại, Href: `interest.html` | Không có lỗi | `index_mobile.png` | VERIFIED |
| `/interest.html` | Desktop | 200 | `/interest` | Để lại quan tâm... | Form `#interestForm` tồn tại | Không có lỗi | `interest.html_desktop.png` | VERIFIED |
| `/interest.html` | Mobile | 304 | `/interest` | Để lại quan tâm... | Form `#interestForm` tồn tại | Không có lỗi | `interest.html_mobile.png` | VERIFIED |
| `/interest` | Desktop | 304 | `/interest` | Để lại quan tâm... | Form `#interestForm` tồn tại | Không có lỗi | `interest_desktop.png` | VERIFIED |
| `/interest` | Mobile | 304 | `/interest` | Để lại quan tâm... | Form `#interestForm` tồn tại | Không có lỗi | `interest_mobile.png` | VERIFIED |
| `/program-interest.html` | Desktop | 200 | `/program-interest` | Đăng ký quan tâm... | Có form, `#form-status`, script V1 | Không có lỗi | `program-interest.html_desktop.png` | VERIFIED |
| `/program-interest.html` | Mobile | 304 | `/program-interest` | Đăng ký quan tâm... | Có form, `#form-status`, script V1 | Không có lỗi | `program-interest.html_mobile.png` | VERIFIED |
| `/program-interest` | Desktop | 304 | `/program-interest` | Đăng ký quan tâm... | Có form, `#form-status`, script V1 | Không có lỗi | `program-interest_desktop.png` | VERIFIED |
| `/program-interest` | Mobile | 304 | `/program-interest` | Đăng ký quan tâm... | Có form, `#form-status`, script V1 | Không có lỗi | `program-interest_mobile.png` | VERIFIED |

## Bằng chứng lưu trữ (Evidence Paths)
- Thư mục ảnh screenshot: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\releases\retest-20260806-program-interest-live\`
- File JSON kết quả HTTP thô: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\releases\retest-20260806-program-interest-live\results.json`

## Quan sát Backend & Vercel Identity
- **Vercel Identity:** Không tìm thấy header `x-vercel-id` chứa ID phát hành (chỉ trả về vùng CDN như `hkg1::...`). Khẳng định `productionAliasDeploymentId` là `dpl_CUALTEhpSQiYXhY6roy8oXUJdBYR` không thể kiểm chứng qua public HTTP (UNVERIFIED).
- **An toàn Dữ liệu:** Không có bất kỳ HTTP POST hay hàm gọi ghi dữ liệu Google Sheet nào được kích hoạt. Luồng kiểm thử Read-only hoàn toàn.

## Khoảng trống kiểm chứng (Verification Gaps)
- 6 route cốt lõi cũ của dự án nằm ngoài phạm vi test này: UNVERIFIED.
- Staged URL (do bị chặn bởi Vercel SSO): UNVERIFIED.

## Xác nhận Quyền hạn (Operational Authorization)
- Agent thực hiện độc lập và **không có quyền** sửa code, commit, push, deploy, promote hoặc ghi dữ liệu trong quá trình này.
