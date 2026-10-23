# Kế Hoạch Triển Khai: Chuẩn Hóa Ngôn Từ "Trạm Thực Hành" (Thay Thế "Xưởng Thực Hành")
*Mã tài liệu: `plan_20261002_wording_tram_thuc_hanh.md`*  
*Ngày lập: 02/10/2026*  
*Bề mặt tác động: `lms/index.html`, `lms/app.js`, `lms/curriculum_data.json`*  

---

## 1. Bối Cảnh & Mục Tiêu (Context & Objectives)

Cụm từ "Xưởng thực hành" dịch thô từ chữ tiếng Anh `workshop`, mang cảm giác cơ khí công nghiệp nặng, không ăn nhập với sắc thái ngôn từ (`tone & mood`) tinh tế, nhân văn và chuyển hóa của Delivering Happiness.

**Mục tiêu:**
- Chuẩn hóa toàn diện (Holistic Audit) toàn bộ các vị trí chứa từ "Xưởng" sang **"Trạm Thực Hành"** (đồng bộ với mô hình 3 Chặng hành trình: Chặng 1 Online ➔ Trạm Thực Hành Workshop Live ➔ Chặng 3 Rèn Luyện 21 Ngày).
- Đổi biểu tượng công cụ thợ máy `🛠️` thành biểu tượng mục tiêu/gieo mầm `🎯` hoặc `🌱`.

---

## 2. Phạm Vi & Danh Sách Tệp Cho Phép (Allowlist & Scope)

### Tệp cho phép chỉnh sửa (Allowlist):
1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json`
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js`
3. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html`

### Tuyệt đối KHÔNG thay đổi:
- Cấu trúc `localStorage` key (`dhm_lms_progress_*`).
- Cấu trúc DOM logic, class Accordion, logic tính điểm tiến độ.
- Các tệp ngoài thư mục `lms/`.

---

## 3. Chi Tiết Thay Đổi Cụ Thể (Detailed Changes)

| STT | Vị trí / Tệp | Nội dung cũ ("Xưởng") | Nội dung mới ("Trạm Thực Hành") |
|:---:|:---|:---|:---|
| 1 | `lms/curriculum_data.json` (dòng 483) | `"subtitle": "...Xưởng thực hành 5 Thói quen..."` | `"subtitle": "Workshop Live tại lớp • Trạm thực hành 5 Thói quen Hạnh phúc & I•A•M"` |
| 2 | `lms/app.js` (dòng 157) | `subtitle: "...Xưởng thực hành 5 Thói quen..."` | `subtitle: "Workshop Live tại lớp • Trạm thực hành 5 Thói quen Hạnh phúc & I•A•M"` |
| 3 | `lms/index.html` (dòng 892) | `🛠️ Xưởng Thực Hành 5 Thói Quen Hạnh Phúc (10 Tiếng Tại Lớp)` | `🎯 Trạm Thực Hành 5 Thói Quen Hạnh Phúc (10 Tiếng Tại Lớp)` |
| 4 | `lms/index.html` (dòng 1519) | `XƯỞNG RÈN LUYỆN 21 NGÀY` | `TRẠM RÈN LUYỆN 21 NGÀY` |
| 5 | `lms/index.html` (dòng 1619) | `⚡ Mở Xưởng Thực Hành ABCDE ↗` | `⚡ Mở Trạm Thực Hành ABCDE ↗` |
| 6 | `lms/index.html` (dòng 1896) | `...hoàn thành Xưởng thực hành 5 Thói quen...` | `...hoàn thành Trạm thực hành 5 Thói quen tại Chặng 2...` |

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification Steps)

1. **Cú pháp JavaScript:**
   ```powershell
   node -c lms/app.js
   ```
2. **Quét đối chiếu toàn diện (Holistic Scan):**
   Kiểm tra chắc chắn không còn từ "Xưởng" nào sót lại trong thư mục `lms/` (ngoại trừ các file sao lưu `_backup_`).
3. **Kiểm tra hiển thị:** Chạy Puppeteer test kiểm tra hiển thị đồng bộ trên giao diện.

---

## 5. Kế Hoạch Quay Lui (Rollback Strategy)

Nếu phát hiện bất kỳ lỗi nào, khôi phục từ bản sao lưu tại `lms/_backup_20261002/`:
```powershell
Copy-Item "lms\_backup_20261002\app_before_accordion.js" "lms\app.js" -Force
Copy-Item "lms\_backup_20261002\index_before_accordion.html" "lms\index.html" -Force
git checkout -- lms/curriculum_data.json
```

---

## 6. Ranh Giới Phê Duyệt (Approval Boundaries)

- **Cấp độ 2 (Plan Approval):** Duyệt thực hiện chỉnh sửa 3 tệp trong allowlist theo đúng bảng đối chiếu trên.
- **Cấp độ 3 (Risky Operation Approval):** Bắt buộc xin phê duyệt riêng trước khi chạy `git commit`, `git push` hoặc `deploy`.
