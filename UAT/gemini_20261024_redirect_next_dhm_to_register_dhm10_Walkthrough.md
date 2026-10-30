# Báo Cáo Walkthrough: Triển Khai Production Live & Kiểm Chứng Triệt Để Popup Zalo TP.HCM

> **Thời gian thực hiện:** 21/10/2026  
> **Người thực hiện:** Antigravity (Gemini)  
> **Dự án:** Delivering Happiness Website (`dh4hn-website`)  
> **Trạng thái:** ✅ **PRODUCTION LIVE VERIFIED (100% Passed)**  
> **Deployment ID:** `dpl_5ApiPawLFGVhxJPQWBhWTdpK38Ry`  
> **Production URL:** `https://delivering-happiness.vercel.app`

---

## 1. Tóm Tắt Quá Trình Triển Khai

Sau khi nhận được phê duyệt Cấp độ 3 từ Sếp Dzũ:
1. **Staged Deployment:** Đã thực thi lệnh `vercel --cwd release_package --prod --skip-domain --yes` từ gói phát hành sạch `release_package/`, sinh deployment thành công: `dpl_5ApiPawLFGVhxJPQWBhWTdpK38Ry`.
2. **Promote Production:** Đã chạy lệnh `vercel promote dpl_5ApiPawLFGVhxJPQWBhWTdpK38Ry`, gán thành công deployment vào tên miền chính thức `delivering-happiness.vercel.app`.
3. **Read-back Verification:** Đã chạy script kiểm chứng trực tiếp bằng HTTP GET lên môi trường Production Live:
   - `https://delivering-happiness.vercel.app/register_dhm10.js`:
     + **Popup thành công:** `"nhóm Zalo DHM10 TP.HCM"` (ĐẠT)
     + **Nút bấm:** `"Vào nhóm Zalo DHM10 TP.HCM"` (ĐẠT)
     + **Chuỗi "Zalo DHM10 Hà Nội":** KHÔNG CÒN (ĐẠT)
     + **Nguồn lead:** `Web_DHM10_HCM_Official` (ĐẠT)
   - `https://delivering-happiness.vercel.app/register_dhm10.html`:
     + **Wording hậu cần:** `"Bao gồm: Session Webinar khởi động, LMS, Tài liệu chuyên sâu, Ăn trưa và 02 tiệc Teabreak cho 1 ngày offline trọn vẹn và công cụ thực hành tiếp nối."` (ĐẠT)
     + **Địa điểm Hà Nội:** Thẻ điều hướng `Apollo English - Phố Huế (Dự kiến DHM11)` chuyển sang `next_dhm.html` (ĐẠT)
     + **Nút Zalo:** `"Vào nhóm Zalo DHM10 TP.HCM"` (ĐẠT)
   - `https://delivering-happiness.vercel.app/` (Landing Page):
     + **Banner:** `🚀 CỘT MỐC SỐ 10 — ĐỘT PHÁ MÔ HÌNH ĐÀO TẠO KẾT HỢP BLENDED LMS` (ĐẠT)
     + **Cụm LMS:** `📱 Nền tảng Micro-LMS và công cụ đồng hành để tiếp nối hành trình hạnh phúc` (ĐẠT)
     + **Địa điểm Hà Nội:** `Apollo English - Phố Huế (Dự kiến DHM11)` (ĐẠT)
     + **Cơ sở SBB:** Đã xóa bỏ hoàn toàn (ĐẠT)
     + **Giảng viên cơ hữu đồng hành thực chiến:** Đã xóa bỏ hoàn toàn (ĐẠT)
   - `https://delivering-happiness.vercel.app/next_dhm.html` & `interest_dh10.html`:
     + **Địa điểm Hà Nội:** `Apollo English - Phố Huế` (ĐẠT)

---

## 2. Bảng Đối Soát Trực Tiếp Môi Trường Live

| Thành phần kiểm chứng | Kết quả trên Live CDN | Trạng thái |
| :--- | :--- | :--- |
| **Popup Modal thanh toán** | `"nhóm Zalo DHM10 TP.HCM"` | ✅ PASS (Đã hết Hà Nội) |
| **Nút Modal thanh toán** | `"Vào nhóm Zalo DHM10 TP.HCM"` | ✅ PASS (Đã hết Hà Nội) |
| **Wording chi phí hậu cần** | Khởi động Webinar, LMS, Ăn trưa, 02 Teabreak... | ✅ PASS |
| **Landing Page Hero Card** | Blended LMS, Apollo Phố Huế, Bỏ GV cơ hữu | ✅ PASS |
| **Next DHM Hub** | Apollo English - Phố Huế | ✅ PASS |

---

## 3. Khắc Phục Triệt Để Chuyển Hướng `next_dhm` Sang Form Đăng Ký DHM10 TP.HCM

- **Sự cố phát hiện:** Học viên tiềm năng (Thuyên Hilton) được Facilitator gửi link `https://delivering-happiness.vercel.app/next_dhm`, nhưng bị kẹt ở form "Quan tâm Next DHM" (chỉ lưu danh sách chờ, không có mã thanh toán SePay, không chọn lịch học 01/11/2026).
- **Nguyên nhân gốc rễ:** Liên quan đến thay đổi từ phiên trao đổi `85687a62-49ce-448e-9b2b-398c9714cd8a` ("Thắc Mắc Về Học Viên Next DHM"). Form `next_dhm.html` được tách ra để nhận lead quan tâm tương lai, nhưng cấu hình alias `vercel.json` cũ vẫn giữ `/next_dhm` phục vụ trang chờ thay vì form đăng ký lớp TP.HCM.
- **Giải pháp 2 tầng đã triển khai:**
  1. **Tầng 1 (Vercel Server-side Redirect):** Cập nhật `vercel.json` (root & `release_package/vercel.json`) thiết lập redirect HTTP 307 cho toàn bộ các route cũ (`/next_dhm`, `/next_dhm.html`, `/interest_dh10`, `/interest_dh10.html`, `/register`, `/register.html`) trỏ thẳng về `/register_dhm10`.
  2. **Tầng 2 (Client-side JS Fallback):** Thêm `<script>window.location.replace("register_dhm10.html" + window.location.search);</script>` vào `<head>` của các file `next_dhm.html`, `interest_dh10.html`, `register.html` để phòng ngừa trình duyệt đã cache HTML cũ.
- **Triển khai Production:**
  - Deployment ID mới: `dpl_88ARWnEJZ61QTnj4aAULKxVJfSyR`
  - Đã promote lên: `delivering-happiness.vercel.app`
- **Kết quả Kiểm chứng Trực tiếp trên Live:**
  - `https://delivering-happiness.vercel.app/next_dhm` -> **HTTP 307** trỏ sang `/register_dhm10` (ĐÃ XÁC NHẬN)
  - `https://delivering-happiness.vercel.app/next_dhm.html` -> **HTTP 308** sang `/next_dhm` -> **HTTP 307** sang `/register_dhm10` (ĐÃ XÁC NHẬN)
  - `https://delivering-happiness.vercel.app/register` -> **HTTP 307** trỏ sang `/register_dhm10` (ĐÃ XÁC NHẬN)
  - `https://delivering-happiness.vercel.app/register_dhm10` -> **HTTP 200 OK** (ĐÃ XÁC NHẬN - Form mở đầy đủ thông tin DHM10 TP.HCM, chi phí 250k, 35 suất, mã thanh toán SePay).

---

## 4. Khôi Phục Hub Next DHM Hà Nội & Cơ Chế Check Địa Điểm Điều Hướng Động TP.HCM

- **Tiếp thu chỉ đạo của Sếp Dzũ:**
  - Không redirect cứng toàn bộ `next_dhm` sang form TP.HCM vì sẽ làm mất cổng đăng ký giữ chỗ của học viên tại Hà Nội (DHM11).
  - Khôi phục Hub `next_dhm.html` và phân luồng thông minh ở cấp độ chọn địa điểm (`Active Cohort Modal Guard`).
- **Các giải pháp đã triển khai:**
  1. **Khôi phục `next_dhm.html`:** Xóa bỏ script tự động chuyển hướng ở đầu thẻ `<head>`; gỡ bỏ 2 quy tắc redirect cứng `/next_dhm` trong `vercel.json` (cả root & `release_package/`).
  2. **Mặc định chọn Hà Nội:** Cài đặt thẻ `Hà Nội - Apollo English - Phố Huế (Dự kiến DHM11)` là `selected` và radio `checked` mặc định khi tải trang.
  3. **Cơ chế Điều Hướng Động TP.HCM:**
     - Khi người dùng nhấp chọn thẻ **TP. Hồ Chí Minh**: Hệ thống lập tức hiển thị Popup Modal thông báo khóa DHM10 TP.HCM đang mở tuyển sinh chính thức kèm nút trực tiếp dẫn sang `register_dhm10.html`.
     - Khi người dùng bấm **Gửi đăng ký quan tâm** mà địa điểm đang chọn là TP.HCM: Hệ thống lập tức chặn submit, không lưu thành lead chờ rỗng, và tự động mở lại Modal điều hướng sang `register_dhm10.html`.
  4. **Kiểm thử tự động 2 lớp (Local & Live):**
     - Kịch bản Puppeteer kiểm chứng: URL giữ nguyên, Hà Nội chọn sẵn, chọn TP.HCM mở modal, submit với TP.HCM bị chặn và mở lại modal ➔ **100% Passed**.
- **Triển khai Production Live:**
  - Staged Deployment: `dpl_3eSmSWxE8qY9ApoAjjMp7LVcBErM`
  - Đã Promote lên Production: `https://delivering-happiness.vercel.app`
- **Kết quả Kiểm chứng Trực tiếp trên Live Production:**
  - `https://delivering-happiness.vercel.app/next_dhm` ➔ **HTTP 200 OK** (Trang Hub Next DHM hiển thị bình thường).
  - Script Puppeteer Live chạy trực tiếp trên `https://delivering-happiness.vercel.app/next_dhm`:
    + URL không bị chuyển hướng ngoài ý muốn: **ĐẠT**
    + Thẻ Hà Nội được chọn sẵn: **ĐẠT**
    + Nhấp thẻ TP.HCM mở modal điều hướng: **ĐẠT**
    + Submit với TP.HCM kích hoạt chặn và mở modal điều hướng sang `register_dhm10.html`: **ĐẠT**
    + Kết luận: `=== 100% PRODUCTION LIVE VERIFICATION PASSED! ===`

---

## 5. Tinh Gọn KISS Triệt Để Form Đăng Ký DHM10 TP.HCM (`register_dhm10.html`)

- **Vấn đề nhận diện từ Sếp Dzũ:**
  - Form đăng ký chính thức của DHM10 TP.HCM (`register_dhm10.html`) bị nhét một thẻ to đùng cho Hà Nội bên phải trong phần chọn địa điểm, gây rối rắm và vi phạm nguyên tắc KISS (Keep It Simple, Stupid), trong khi bên dưới đã có sẵn dòng ghi chú nhỏ có link.
- **Xử lý dứt điểm:**
  1. Xóa bỏ hoàn toàn thẻ `Hà Nội (Dự kiến DHM11)` nằm bên phải thẻ TP.HCM trong `register_dhm10.html` (cả root & `release_package/`).
  2. Đưa CSS `.location-options` về 1 cột duy nhất (`grid-template-columns: 1fr`) để thẻ TP.HCM mở rộng 100% toàn chiều ngang, hiển thị trọn vẹn thông tin ngày giờ và địa điểm.
  3. Dòng ghi chú nhỏ bên dưới được tinh gọn:
     `* Lưu ý: Khóa DHM10 tổ chức Offline trọn vẹn tại TP.HCM. Học viên tại Hà Nội (Dự kiến DHM11 tại Apollo English - Phố Huế) vui lòng để lại thông tin tại Form quan tâm Next DHM để nhận thông báo sớm nhất.`
- **Deploy & Promote Production:**
  - Deployment ID: `dpl_68wtZJq7GK221kiwdAJdnXdF8PsL`
  - Đã Promote lên `delivering-happiness.vercel.app`
- **Kết quả Kiểm chứng Trực tiếp trên Live:**
  - Số lượng thẻ địa điểm trong form: **Duy nhất 1 thẻ TP.HCM (Pass)**.
  - Thẻ Hà Nội to bên phải: **ĐÃ BIẾN MẤT HOÀN TOÀN (Pass)**.
  - Giao diện form: Cực kỳ tinh gọn, trực diện, chuẩn xác 100% mục tiêu tuyển sinh DHM10 TP.HCM.

---

## 6. Nâng Cấp UI/UX Pro Max: Cân Xứng 3 Mục Thông Tin Cá Nhân & Triệt Tiêu Bug Radio 274px

- **Phát hiện sâu sắc từ Sếp Dzũ:**
  1. **Bố cục cọc cạch:** 3 mục thông tin cá nhân thì 2 cái nằm 1 hàng, 1 cái nằm 1 hàng trơ trọi bên dưới.
  2. **Bug nút radio chiếm 1/2 bên trái:** Sau khi xóa thẻ Hà Nội, nút radio vẫn chiếm tới 274px (do dính quy tắc `input { width: 100%; }` kế thừa từ `register.css`), đẩy toàn bộ text sang nửa bên phải.
- **Xử lý triệt để chuẩn UI/UX Pro Max:**
  1. **Tái cấu trúc 3 trường thông tin:**
     - `Họ và tên *` (`.full-width`): Đặt riêng ở Hàng 1, trải dài 100% (702px), tạo không gian thoải mái cho tên người Việt có dấu.
     - `Email *` và `Số điện thoại liên hệ (Zalo) *`: Đặt song song ở Hàng 2, mỗi bên chiếm đúng 50% (339px mỗi bên), tạo sự cân xứng tuyệt đối 100%.
  2. **Trị dứt điểm CSS Radio:**
     - Thiết lập `width: 20px !important; min-width: 20px !important; max-width: 20px !important; height: 20px !important; flex-shrink: 0 !important; margin: 3px 0 0 0 !important;` cho `input[type="radio"]`.
     - Gán `flex: 1` cho `.location-label`.
- **Triển khai & Kiểm chứng Trực tiếp trên Production Live (`https://delivering-happiness.vercel.app/register_dhm10`):**
  - Deployment ID: `dpl_CJgzJewhjuqtAyvgrXfmyLFzotiq`
  - Kết quả đo đạc DOM thực tế trên Live CDN:
    + `Họ và tên *`: Rộng 702px (Full row) ✅
    + `Email *`: Rộng 339px (50% row 2) ✅
    + `Số điện thoại (Zalo) *`: Rộng 339px (50% row 2) ✅
    + `Radio dot`: Đúng 20px x 20px sát lề trái ✅
    + `Location text`: Rộng 582px chiếm trọn phần còn lại của thẻ ✅
  - **Kết luận:** Bố cục form đạt độ hoàn thiện cao cấp, hài hòa và cân xứng tuyệt đối.
