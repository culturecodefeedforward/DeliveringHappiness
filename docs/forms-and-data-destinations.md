# 📋 Danh mục Biểu mẫu, Endpoint & Điểm đến Dữ liệu CRM (Forms, Endpoints & CRM Data Destinations)

Tài liệu này là nguồn chuẩn (Source of Truth) dùng để tra cứu nhanh toàn bộ các biểu mẫu (`forms`), đường dẫn giao diện (`frontend URLs`), Webhook tiếp nhận (`Google Apps Script / Vercel API`), và bảng tính Google Sheets đích (`CRM Destinations`) trong hệ thống **Delivering Happiness (DH4HN)**.

---

## 1. Bảng Ma trận Tra cứu Nhanh (Quick Reference Matrix)

| STT | Chương trình / Tính năng | Tệp Frontend & Live URL | Webhook / Endpoint Backend | Google Sheet Nhận Dữ Liệu | Tab Google Sheet | Link Bảng Tính Trực Tiếp | Email Thông Báo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **NVC - Giao Tiếp Kết Nối** | `register_nvc.html`<br/>[`/register_nvc`](https://delivering-happiness.vercel.app/register_nvc) | GAS Webhook: `CultureCode - NVC Webhook`<br/>(`.../AKfycbxdjYGd.../exec`) | **`CultureCode - NVC Leads`**<br/>(ID: `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`) | `Trang tính1` / `Sheet1` (13 cột) | [Mở Google Sheet](https://docs.google.com/spreadsheets/d/12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk/edit) | `vuhoang2708@gmail.com`<br/>`quochung.reo@gmail.com`<br/>`chauhm71@gmail.com` |
| **2** | **DHM8 (Masterclass 8)** | `register.html`<br/>`register_direct.html`<br/>[`/register`](https://delivering-happiness.vercel.app/register.html) | GAS Webhook: `DHM8 Email Automation`<br/>(`.../AKfycbxMi_bQBce.../exec` @69) | **`Delivering Happiness Masterclass CRM`**<br/>(ID cấu hình trong Script Properties) | `DHM8_Data`<br/>`DHM8_Payments`<br/>`DHM8_Email_Outbox`<br/>`DH interest` | [Mở CRM Sheet](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | CultureCode Team (`BTC_EMAILS`) + Email học viên |
| **3** | **DHM9 (Masterclass 9 HN)** | `register_dh9_hanoi.html`<br/>[`/register_dh9_hanoi`](https://delivering-happiness.vercel.app/register_dh9_hanoi.html) | GAS Webhook: `.../AKfycbw0vTBMod.../exec` | **`Delivering Happiness Masterclass CRM`** | `DHM9_Data`<br/>`DHM9_Payments`<br/>`DHM9_Email_Outbox`<br/>`DHM9 interest` | [Mở CRM Sheet](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | CultureCode Team (`BTC_EMAILS`) + Email học viên |
| **4** | **Cổng Quan tâm Đa chương trình** | `program-interest.html`<br/>[`/program-interest`](https://delivering-happiness.vercel.app/program-interest.html) | GAS Webhook: `.../AKfycbxMi_bQBce.../exec`<br/>(Xác nhận qua JSONP `checkProgramInterestStatus`) | **`CRM Google Sheet`**<br/>(ID: `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`) | **`Program Interest`**<br/>(25 cột, khóa `interestUuid`) | [Mở tab Program Interest](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | Không gửi email (Chỉ ghi log CRM) |
| **5** | **CultureCode 101 (CC101)** | `register_cc101.html`<br/>[`/register_cc101`](https://delivering-happiness.vercel.app/register_cc101.html) | GAS Webhook: `.../AKfycbw3nzeW2.../exec` | **`CultureCode CRM`** | Tab sự kiện CC101 | [Mở Google Sheet](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | CultureCode Team |
| **6** | **La bàn Giá trị Cá nhân** | `personal-value.html`<br/>[`/personal-value`](https://delivering-happiness.vercel.app/personal-value.html) | GAS JSONP: `.../AKfycbw0vTBMod.../exec`<br/>(Lớp CAPTCHA + Rate Limiting) | **`Delivering Happiness Masterclass CRM`** | **`PV_Data`** | [Mở CRM Sheet](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | Gửi email báo cáo PDF kèm biểu đồ Radar cho người làm bài |
| **7** | **Thực hành Lạc quan ABCDE** | `practice-abcde.html`<br/>[`/practice-abcde`](https://delivering-happiness.vercel.app/practice-abcde.html) | Vercel Serverless: `/api/chat-abcde`<br/>+ GAS Webhook trung gian | **`Delivering Happiness Masterclass CRM`** | **`ABCDE_Data`** | [Mở CRM Sheet](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | Gửi email bài làm tổng hợp định dạng HTML cho học viên |
| **8** | **QR Check-in Sự kiện** | `checkin.html`<br/>[`/checkin`](https://delivering-happiness.vercel.app/checkin.html) | GAS Webhook: `.../AKfycbxMi_bQBce.../exec` | **`Delivering Happiness Masterclass CRM`** | `DHM8_Data` / `DHM9_Data`<br/>(Cập nhật cột Check-in) | [Mở CRM Sheet](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit) | Không |

---

## 2. Chi tiết Cấu hình Từng Biểu mẫu

### 2.1. Form Đăng ký NVC (Nonviolent Communication - Giao Tiếp Kết Nối)
* **Frontend:** `register_nvc.html` (Đường dẫn: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_nvc.html`).
* **Live Route:** `https://delivering-happiness.vercel.app/register_nvc` hoặc `https://delivering-happiness.vercel.app/register_nvc.html`.
* **Webhook Endpoint:**
  ```text
  https://script.google.com/macros/s/AKfycbxdjYGd8ki2f5LAyo5oCSUiFBUz3f-o9II6vz73VQIDULLS1J05mFaz-og4e1RjdTPg/exec
  ```
* **Apps Script Project ID:** `1jD15w91bPsE0xn0PyrlJgkeHfg-jqFXWoFG15KHBqFufuA4Dt7iiJsGu` (Tên dự án: `CultureCode - NVC Webhook`, Quản trị: `vuhoang2708@gmail.com`).
* **Google Sheet nhận dữ liệu:**
  * **Tên Sheet:** `CultureCode - NVC Leads`
  * **Spreadsheet ID:** `12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk`
  * **Link xem bảng tính:** [https://docs.google.com/spreadsheets/d/12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk/edit](https://docs.google.com/spreadsheets/d/12HNH6ANgtcRyF0lMqObkEGDB5U8LVi9kLWebJyHJ3kk/edit)
* **Cấu trúc 13 cột dữ liệu chuẩn:**
  1. `Timestamp`: Thời gian đăng ký (GMT+7)
  2. `FullName`: Họ và tên học viên
  3. `Phone`: Số điện thoại / Zalo
  4. `Email`: Email liên hệ
  5. `Role`: Vai trò trong doanh nghiệp / tổ chức
  6. `Company`: Tên công ty / tổ chức
  7. `ReferrerName`: Tên người giới thiệu
  8. `ReferrerPhone`: SĐT người giới thiệu
  9. `Q1_Situation`: Tình huống giao tiếp khó khăn nhất
  10. `Q2_Relationship`: Mối quan hệ cần kết nối/cải thiện
  11. `Q3_Expectation`: Kỳ vọng sau buổi học
  12. `Event_ID`: Mã sự kiện (`NVC_GTKN_0926`)
  13. `Session_ID`: Mã phiên làm việc client (`dh-...`)
* **Email thông báo:** Tự động gửi email HTML về 3 địa chỉ: `vuhoang2708@gmail.com`, `quochung.reo@gmail.com`, `chauhm71@gmail.com`.
* **Nhóm Zalo hỗ trợ sau đăng ký:** Nhóm *Blooming On* (`https://zalo.me/g/kizonq8jygheahn3urod`).

---

### 2.2. Form Đăng ký DHM8 & DHM9 (Delivering Happiness Masterclass)
* **Frontend:**
  * DHM8: `register.html`, `register_direct.html`, `dh8/index.html`.
  * DHM9: `register_dh9_hanoi.html`.
* **Webhook Endpoints:**
  * DHM8 Production: `https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec` (Deployment `@69`).
  * DHM9 Production: `https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec`.
* **Google Sheet đích:**
  * Các tab CRM: `DHM8_Data`, `DHM8_Payments`, `DHM8_Email_Outbox`, `DHM8_Inbox`, `DH interest`, `DHM9_Data`, `DHM9_Payments`, `DHM9_Email_Outbox`, `DHM9 interest`.
  * Cấu hình hạn mức đăng ký (`REGISTRATION_CAP`): DHM8 = 32 học viên; DHM9 = 40 học viên.
* **Tự động hóa thanh toán:** Tích hợp SePay Webhook (`/api/sepay-dh.js`) tự động khớp mã chuyển khoản (`DH8...` / `DHM9...`), cập nhật trạng thái thanh toán và kích hoạt hàng đợi gửi email vé tham dự.

---

### 2.3. Cổng Ghi nhận Quan tâm Đa chương trình (Program Interest Hub)
* **Frontend:** `program-interest.html` (Đường dẫn: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\program-interest.html`).
* **Live Route:** `https://delivering-happiness.vercel.app/program-interest.html`.
* **Webhook Endpoint:**
  ```text
  https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec
  ```
* **Google Sheet nhận dữ liệu:**
  * **Tên Tab:** `Program Interest` (nằm trong CRM Google Sheet)
  * **Link bảng tính:** [https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit](https://docs.google.com/spreadsheets/d/1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA/edit)
* **Cấu trúc 25 cột dữ liệu chuẩn:**
  1. `Timestamp` | 2. `Interest UUID` (Khóa chống trùng idempotency 32 ký tự hex) | 3. `Họ và tên` | 4. `Email` | 5. `Số điện thoại` | 6. `Công ty` | 7. `Vai trò` | 8. `Khu vực mong muốn` | 9. `Chương trình quan tâm` | 10. `DHM8` | 11. `DHM9` | 12. `NVC` | 13. `AI` | 14. `DHM kỳ vọng` | 15. `DHM khóa mong muốn` | 16. `NVC tình huống` | 17. `NVC mối quan hệ` | 18. `NVC kỳ vọng` | 19. `AI mức độ kinh nghiệm` | 20. `AI nhu cầu ứng dụng` | 21. `AI hình thức mong muốn` | 22. `Ghi chú` | 23. `Đồng ý liên hệ` | 24. `Source` (`Web_Program_Interest`) | 25. `Event ID` (`PROGRAM_INTEREST_V1`).
* **Cơ chế xác nhận:** Client gửi POST no-cors, sau đó gọi JSONP `checkProgramInterestStatus` với `interestUuid` để xác minh dữ liệu đã thực sự được ghi vào dòng trước khi hiển thị màn hình thành công.

---

### 2.4. Form Đăng ký CultureCode 101 (CC101)
* **Frontend:** `register_cc101.html`.
* **Live Route:** `https://delivering-happiness.vercel.app/register_cc101.html`.
* **Webhook Endpoint:**
  ```text
  https://script.google.com/macros/s/AKfycbw3nzeW2UU6RqArz6DSONtuyApU77jYz5TlW7AoQgYqH0uMNbh4oySWco61PCQNWpqK/exec
  ```
* **Payload Type:** `EVENT_LEAD`, `source: LinkedIn_CC101`.

---

### 2.5. Khảo sát La bàn Giá trị Cá nhân (Personal Value Compass)
* **Frontend:** `personal-value.html` & `personal-value.js`.
* **Live Route:** `https://delivering-happiness.vercel.app/personal-value.html`.
* **Webhook Endpoint:**
  ```text
  https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec
  ```
* **Google Sheet đích:** Tab `PV_Data` trong CRM Google Sheet.
* **Lớp bảo mật:** Math CAPTCHA token giải mã trên server, Rate limit tối đa 3 lượt/5 phút/email, kiểm tra Quota email Google (dừng gửi mail nếu quota < 5 mail/ngày).

---

### 2.6. Thực hành Lạc quan ABCDE Socratic
* **Frontend:** `practice-abcde.html` & `chat-abcde.js`.
* **Live Route:** `https://delivering-happiness.vercel.app/practice-abcde.html`.
* **Backend API:** `/api/chat-abcde` (Vercel Serverless) kết nối Gemini API (`gemini-3.1-flash-lite`) và chuyển tiếp webhook về Google Apps Script.
* **Google Sheet đích:** Tab `ABCDE_Data` trong CRM Google Sheet.

---

## 3. Quy tắc Bảo mật & Vận hành Cần Tuân Thủ (Compliance Rules)

1. **Khóa cứng Nguồn chuẩn Cấu hình (Rule 5 & 8):**
   * Tuyệt đối không hardcode thông tin tài khoản ngân hàng, ID bảng tính hoặc email nhận thông báo trong các file mã nguồn tĩnh nếu có thể cấu hình động qua Apps Script `Script Properties` hoặc `getPaymentConfig_`.
2. **Kiểm chứng Dữ liệu Thật (Rule 6):**
   * Các báo cáo vận hành về số lượng học viên đã đăng ký, slot còn lại phải truy vấn trực tiếp từ API live (`checkRegistrationAvailability`, `getRegistrationStatus`) hoặc đọc trực tiếp từ Google Sheet; không dùng dữ liệu giả lập/mock data.
3. **Định danh Thương hiệu & Email (Rule 8):**
   * Email chăm sóc và xác nhận tới học viên gửi từ `culturecodeproject@gmail.com`.
   * Danh xưng chuẩn là **CultureCode Team** (thay thế hoàn toàn cho từ "Ban tổ chức" hoặc "BTC").
