# Báo cáo Kiểm thử Nghiệm thu (UAT Report - Local & Live Production)
**Ngày thực hiện:** 13/10/2026  
**Mục tiêu:** Kiểm chứng gộp thông tin tính năng trùng lặp của 2 điểm cầu lên phần thông tin chung của 2 miền tại `hero-hybrid-card`.  
**Tệp nguồn:** `dh4hn-website/index.html`  
**Production URL:** `https://delivering-happiness.vercel.app/`  
**Kịch bản kiểm thử tự động:**  
- Cục bộ: `dh4hn-website/scratch/test_consolidated_hubs_puppeteer.js`  
- Trực tuyến (Live): `dh4hn-website/scratch/test_live_consolidated_hubs_puppeteer.js`  
**Công cụ kiểm thử:** Puppeteer (Headless Chromium)  

---

## 1. Kết quả Kiểm thử Live Production (100% PASS trên cả 5 Viewports)

| Viewport | Kích thước (WxH) | scrollWidth | clientWidth | Tràn viền (Overflow) | Thông tin chung 2 miền ở Header | Điểm cầu HN gọn gàng | Điểm cầu HCM gọn gàng | Trạng thái Live |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **iPhone SE** | 375 x 667 | 375px | 375px | **0px (Không)** | Đạt (Không gian chuẩn QT + Giảng viên cơ hữu) | Đạt (Không trùng lặp) | Đạt (Không trùng lặp) | **PASS** |
| **iPhone 14** | 390 x 844 | 390px | 390px | **0px (Không)** | Đạt (Không gian chuẩn QT + Giảng viên cơ hữu) | Đạt (Không trùng lặp) | Đạt (Không trùng lặp) | **PASS** |
| **iPhone Pro Max**| 430 x 932 | 430px | 430px | **0px (Không)** | Đạt (Không gian chuẩn QT + Giảng viên cơ hữu) | Đạt (Không trùng lặp) | Đạt (Không trùng lặp) | **PASS** |
| **iPad** | 768 x 1024 | 768px | 768px | **0px (Không)** | Đạt (Không gian chuẩn QT + Giảng viên cơ hữu) | Đạt (Không trùng lặp) | Đạt (Không trùng lặp) | **PASS** |
| **Desktop HD** | 1280 x 800 | 1280px | 1280px | **0px (Không)** | Đạt (Không gian chuẩn QT + Giảng viên cơ hữu) | Đạt (Không trùng lặp) | Đạt (Không trùng lặp) | **PASS** |

---

## 2. Chi tiết Nghiệm thu Trực tiếp trên Live Production

1. **Khối Thông tin chung 2 Miền (Header `.hero-hybrid-card`):**
   - Đã đưa 2 ý chung lên phần tiêu đề chung của khóa học:
     - `🏛️ Không gian đào tạo chuẩn quốc tế`
     - `👨‍🏫 Giảng viên cơ hữu đồng hành tại chỗ`
   - Hiển thị căn giữa cân đối, màu sắc tương phản rõ ràng, responsive linh hoạt theo flexbox.

2. **Khối 2 Điểm cầu (`.hybrid-hubs-grid`):**
   - **Điểm cầu Hà Nội:** Chỉ giữ lại `📍 Điểm cầu Hà Nội` và `Cơ sở SBB`.
   - **Điểm cầu TP.HCM:** Chỉ giữ lại `📍 Điểm cầu TP.HCM` và `Cơ sở Apollo English`.
   - Toàn bộ nội dung lặp lại đã được loại bỏ hoàn toàn, không còn trùng lặp giữa 2 cột.

---

## 3. Lịch sử Git & Triển khai
- **Commit hash:** `2a99116` (`feat(ui): consolidate common hybrid hub features and remove duplicate descriptions`)
- **Remote branch:** `origin/main` (https://github.com/culturecodefeedforward/DeliveringHappiness.git)
- **Vercel Production:** Triển khai và xác thực thành công trên URL thực tế `https://delivering-happiness.vercel.app/`.
