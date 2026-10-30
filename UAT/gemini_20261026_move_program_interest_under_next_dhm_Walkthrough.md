# Báo cáo Hoàn tất: Đưa nút Đăng ký quan tâm các chương trình khác lên ngay dưới nút DK next DHM

## 1. Tóm tắt Thực thi
Đã hoàn tất tái cấu trúc giao diện Landing Page theo yêu cầu của Sếp Dzũ: đưa nút **"Đăng ký quan tâm các chương trình khác"** (`program-interest.html`) lên vị trí ngay dưới nút **"DK next DHM"** (`next_dhm.html`) trong khối Hero CTA chính, đồng thời dọn dẹp thẻ công cụ thừa trong lưới `.hero-tools-grid` và đồng bộ gói phát hành `release_package/index.html`.

## 2. Chi tiết Thay đổi Mã nguồn

### Danh mục tệp trong Allowlist (Đã cập nhật):
1. **Trang chủ chính thức:**
   * Windows Absolute Path:
     ```text
     C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html
     ```
   * Liên kết IDE: [`index.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)

2. **Bản sao gói phát hành (Release Package Parity):**
   * Windows Absolute Path:
     ```text
     C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\index.html
     ```
   * Liên kết IDE: [`release_package/index.html`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/release_package/index.html)

### Các điểm điều chỉnh cụ thể:
1. **Khối Hero CTA Buttons (`.hero-hybrid-card`):**
   * Chuyển container sang bố cục cột dọc căn giữa (`flex-direction: column; align-items: center; gap: 10px;`) sắp xếp theo đúng thứ tự phân cấp hành động:
     - **Nút 1 (Primary CTA - Glow ấm):**
       ```html
       <a href="register_dhm10.html" class="btn-primary" style="display: inline-block; font-size: 1.05rem; box-shadow: 0 6px 25px rgba(245, 158, 11, 0.45);">
         👉 Đăng ký DHM10 TP.HCM (Giới hạn 35 suất)
       </a>
       ```
     - **Nút 2 (Secondary CTA - Solid outline sáng):**
       ```html
       <a href="next_dhm.html" class="btn-primary" style="display: inline-block; font-size: 1.05rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: #ffffff; box-shadow: none;">
         ✨ Quan tâm Next DHM (Hà Nội & Đợt tới)
       </a>
       ```
     - **Nút 3 (Tertiary CTA - Viền nét đứt nhã nhặn, nằm ngay dưới nút Next DHM):**
       ```html
       <a href="program-interest.html" class="btn-primary" style="display: inline-block; font-size: 1.05rem; background: rgba(255,255,255,0.06); border: 1px dashed rgba(255,255,255,0.3); color: rgba(255,255,255,0.9); box-shadow: none;">
         🌱 Đăng ký quan tâm các chương trình khác
       </a>
       ```
2. **Khối Hero Tools Grid (`.hero-tools-grid`):**
   * Gỡ bỏ thẻ `interest-card-btn`, trả lại bố cục 6 công cụ tương tác (2 cột x 3 hàng) đối xứng hoàn hảo cùng 1 nút LMS trải rộng toàn hàng bên dưới (`grid-column: 1 / -1`).
   * Dọn dẹp các selector CSS mồ côi `.tool-card-btn.interest-card-btn` trong thẻ `<style>` của Header và Media Query Mobile.
3. **Khối Footer CTA (`#register`):**
   * Cập nhật văn bản nút thành `🌱 Đăng ký quan tâm các chương trình khác` để đồng nhất 100% ngữ nghĩa trên toàn bộ trang.

## 3. Bằng chứng Kiểm chứng Kỹ thuật (UAT Browser Evidence)

Kịch bản kiểm thử tự động với Puppeteer ([`run_full_uat.js`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/scratch/run_full_uat.js)) đã chạy và pass 100% các tiêu chí trên 6 kích thước màn hình:

| Viewport | Thiết bị | Tọa độ Next DHM (Top/Bottom) | Tọa độ Quan tâm Khác (Top/Bottom) | Nút nằm ngay dưới Next DHM? | Số thẻ Tools Grid | Kết quả |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| `1440x900` | Desktop Large | 1148 / 1207 | 1217 / 1277 | ✅ ĐÚNG (Gap 10px) | 7 (6 công cụ + 1 LMS) | **PASS** |
| `1280x800` | Desktop Standard | 118 / 177 | 187 / 247 | ✅ ĐÚNG (Gap 10px) | 7 (6 công cụ + 1 LMS) | **PASS** |
| `820x1180` | iPad Air | 328 / 388 | 398 / 457 | ✅ ĐÚNG (Gap 10px) | 7 (6 công cụ + 1 LMS) | **PASS** |
| `768x1024` | iPad Mini | 509 / 568 | 578 / 638 | ✅ ĐÚNG (Gap 10px) | 7 (6 công cụ + 1 LMS) | **PASS** |
| `390x844` | iPhone 14 | 893 / 965 | 975 / 1046 | ✅ ĐÚNG (Gap 10px) | 7 (6 công cụ + 1 LMS) | **PASS** |
| `375x667` | iPhone SE | 816 / 887 | 897 / 969 | ✅ ĐÚNG (Gap 10px) | 7 (6 công cụ + 1 LMS) | **PASS** |

### Thư mục lưu trữ ảnh chụp màn hình UAT:
* Windows Absolute Path:
  ```text
  C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots_20261026_program_interest
  ```
* Liên kết IDE: [`screenshots_20261026_program_interest`](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshots_20261026_program_interest)

## 4. Mức độ Kiểm chứng (Claim Level)
* **Trạng thái:** `Local done`
  - Đã chỉnh sửa chính xác và kiểm chứng cục bộ trên workspace qua Puppeteer đa kích thước màn hình.
  - Chưa thực hiện commit, push git hoặc deploy production (đang chờ phê duyệt Cấp độ 3 từ User).
