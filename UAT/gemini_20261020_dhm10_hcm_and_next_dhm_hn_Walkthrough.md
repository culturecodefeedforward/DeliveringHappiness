# Báo Cáo Walkthrough UAT: Hoàn Thiện Quy Hoạch DHM10 TP.HCM & Cổng Next DHM Hub 2 Miền (Production Live Done)

> **Thời gian thực hiện:** 20/10/2026  
> **Người thực hiện:** Antigravity (Gemini)  
> **Dự án:** Delivering Happiness Website (`dh4hn-website`)  
> **Trạng thái:** ✅ **LIVE DONE (Đã Promote Thành Công Lên Production Domain Công Khai)**

---

## 1. Tóm Tắt Nhiệm Vụ & Kết Quả Triển Khai

Theo đúng chỉ đạo của Sếp Dzũ:
1. **DHM10 TP.HCM:**
   - Tổ chức trực tiếp Offline trọn vẹn tại TP.HCM vào **Chủ Nhật 01/11/2026** (Cơ sở Apollo English, 58 Phạm Ngọc Thạch, Q.3), kèm Webinar kích hoạt LMS Chặng 1 vào tối **Thứ Sáu 30/10/2026** (19:30 – 21:00 qua Zoom).
   - Thiết lập giới hạn rõ ràng: **35 suất học viên** theo nguyên tắc **First-Come, First-Served**.
   - Cập nhật hằng số `DHM10_REGISTRATION_CAP = 35` trong backend `Scripts/active_code_gs_final.js`.
   - Cập nhật trang đăng ký `register_dhm10.html` hiển thị nổi bật badge hạn ngạch và điều hướng học viên Hà Nội / các khóa sau sang `next_dhm.html`.
   - **Production Live URL:** [https://delivering-happiness.vercel.app/register_dhm10](https://delivering-happiness.vercel.app/register_dhm10).

2. **Khởi tạo Cổng Next DHM Hub (`next_dhm.html`) & Tách Riêng Lane `next_dhm`:**
   - Clone toàn bộ xử lý của link quan tâm DHM10, nâng cấp thành Hub đăng ký nhận thông tin các khóa Masterclass tiếp theo cho cả 2 miền (Hà Nội & TP.HCM).
   - **Cơ chế điều hướng cấu hình động (`ACTIVE_COHORTS_CONFIG`):**
     * **TP.HCM (`isOpen: true`):** Khi học viên nhấp chọn thẻ TP.HCM, giao diện bật **Modal Popup điều hướng** thông báo khóa DHM10 đang mở đăng ký chính thức kèm link sang `register_dhm10.html` (hoặc ở lại để nhận thông tin các khóa sau).
     * **Hà Nội (`isOpen: false`):** Không mở popup, cho phép học viên điền thông tin và gửi yêu cầu bình thường.
     * **Khả năng mở rộng tương lai:** Khi mở lớp DHM11 Hà Nội, chỉ cần chuyển `hn.isOpen = true`, logic đảo chiều tự động.
   - **Tách riêng biệt dữ liệu trên Google Sheets:**
     * Tạo mới tab riêng **`Next DHM Interest`** (không lưu chung vào tab `DHM10 interest`).
     * **Bổ sung cột 11:** **`Trạng thái đăng ký chính thức`** (mặc định: `Chưa đăng ký`).
     * Cung cấp hàm tự động `markOfficialRegistrationInNextDhm_` và `getUnregisteredNextDhmLeads_` để tự động loại trừ học viên đã hoàn tất đăng ký/thanh toán khi gửi email thông báo khóa mới.
   - **Production Live URL:** [https://delivering-happiness.vercel.app/next_dhm](https://delivering-happiness.vercel.app/next_dhm).

3. **Chuẩn hóa Email Thông báo Tới Ban Giảng Huấn:**
   - Triệt tiêu 100% chữ `DHM10` và chữ `HYBRID` khi học viên nộp từ Next DHM.
   - Tiêu đề email: `[CultureCode] Thông báo Ban Giảng Huấn: Đăng ký quan tâm Next DHM - Tên (Điểm cầu)`
   - Header email: `Next DHM — Thông báo Đăng ký quan tâm mới`
   - Badge email: `✨ Có đăng ký quan tâm mới — Next DHM (Hà Nội & Đợt tiếp theo)`
   - Lời chào: `Kính gửi Ban Giảng Huấn & CultureCode Team,`

---

## 2. Bằng Chứng Xác Minh Thực Tế (Evidence)

### A. Bằng Chứng Live Production Puppeteer UAT
Kiểm thử trực tiếp trên Production Domain `https://delivering-happiness.vercel.app` đã thông qua 100% với 0 lỗi:
- `https://delivering-happiness.vercel.app/register_dhm10` -> Đã gỡ bỏ chuyển hướng, hiển thị chuẩn 35 suất First-Come First-Served.  
  Ảnh chụp: [uat_live_prod_register_dhm10.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/uat_live_prod_register_dhm10.png).
- `https://delivering-happiness.vercel.app/next_dhm` -> Thẻ TP.HCM bật Modal điều hướng sang `register_dhm10.html`; thẻ Hà Nội cho phép điền form bình thường.  
  Ảnh chụp Modal: [uat_live_prod_next_dhm_modal.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/uat_live_prod_next_dhm_modal.png).  
  Ảnh chụp Hà Nội: [uat_live_prod_next_dhm_hanoi.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/uat_live_prod_next_dhm_hanoi.png).
- `https://delivering-happiness.vercel.app/` -> Trang chủ hiển thị 2 nút CTA rõ ràng.  
  Ảnh chụp: [uat_live_prod_homepage.png](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots/uat_live_prod_homepage.png).

### B. Bằng Chứng Bảng Tính Google Sheets Live (`Next DHM Interest`)
Range `'Next DHM Interest'!A1:L2` trên Spreadsheet ID `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`:

| Cột | Dữ liệu ghi nhận thật |
| :--- | :--- |
| **Cột 1 (Timestamp)** | `20/10/2026 22:30:31` |
| **Cột 2 (Họ và tên)** | `Vũ Hoàng (Test QA Next DHM Hanoi)` |
| **Cột 3 (Email)** | `dev.nexthn.e2e@culturecode.test` |
| **Cột 4 (Số điện thoại)** | `911002233` |
| **Cột 5 (Công ty)** | `CultureCode Community Test` |
| **Cột 6 (Chức danh)** | `HR Manager & Culture Lead` |
| **Cột 7 (Ghi chú)** | `[Địa điểm mong muốn: Hà Nội - Cơ sở SBB]`<br>`[Người giới thiệu: Hoàng Nam Hưng (Tester) - SĐT: 0901234567]` |
| **Cột 8 (Source)** | `Web_Next_DHM_Interest` |
| **Cột 9 (Event ID)** | `NEXT_DHM_INTEREST` |
| **Cột 10 (UUID)** | `856c7693-d176-44dd-97e6-020974c28ee3` |
| **Cột 11 (Trạng thái ĐK chính thức)** | **`Chưa đăng ký`** |

### C. Bằng Chứng Email Thật (Google Message ID)
- **Message ID:** `1a159ef8648f85c2`
- **Sender:** `culturecodeproject@gmail.com`
- **To:** `chauhm71@gmail.com, vuhoang2708@gmail.com, hoanhn.edu.vn@gmail.com`
- **Tiêu đề:** `[CultureCode] Thông báo Ban Giảng Huấn: Đăng ký quan tâm Next DHM - Vũ Hoàng (Test QA Next DHM Hanoi) (Hà Nội - Cơ sở SBB)`
- **Nội dung:** Header `Next DHM — Thông báo Đăng ký quan tâm mới`, Badge `✨ Có đăng ký quan tâm mới — Next DHM (Hà Nội & Đợt tiếp theo)`.

---

## 3. Danh Sách Các Tệp Tin Thay Đổi & Tạo Mới

1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\next_dhm.html` ([next_dhm.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/next_dhm.html))
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\next_dhm.html` ([next_dhm.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/release_package/next_dhm.html))
3. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_dhm10.html` ([register_dhm10.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dhm10.html))
4. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\register_dhm10.html` ([register_dhm10.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/release_package/register_dhm10.html))
5. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js` ([active_code_gs_final.js](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/active_code_gs_final.js))
6. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html` ([index.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html))
7. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\index.html` ([index.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/release_package/index.html))
8. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\interest_dh10.html` ([interest_dh10.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/interest_dh10.html))
9. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\interest_dh10.html` ([interest_dh10.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/release_package/interest_dh10.html))
10. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\releases\dpl_FVCQkXHnnGBHnY1epjKwaDt5BWPE\final-verdict.json` ([final-verdict.json](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/releases/dpl_FVCQkXHnnGBHnY1epjKwaDt5BWPE/final-verdict.json))
