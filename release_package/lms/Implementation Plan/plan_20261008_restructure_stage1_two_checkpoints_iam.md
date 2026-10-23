# Kế Hoạch Triển Khai: Tái Cấu Trúc Chặng 1 LMS Với 2 Trạm Phản Tư "Check Point: I . A . M"

- **Ngày khởi tạo:** 08/10/2026
- **Trạng thái:** Chờ Duyệt Cấp Độ 2 (Awaiting Level 2 Approval)
- **Dự án:** Delivering Happiness Masterclass (Teaching DH & dh4hn-website)
- **Tệp nằm trong danh sách cho phép (Allowlist):**
  + `dh4hn-website/lms/index.html`
  + `dh4hn-website/lms/app.js`
  + `dh4hn-website/lms/curriculum_data.json`
  + `Teaching DH/dhm-micro-lms/index.html`
  + `Teaching DH/dhm-micro-lms/app.js`
  + `Teaching DH/dhm-micro-lms/curriculum_data.json`

---

## 1. Bối Cảnh & Định Hướng Sư Phạm Mới Từ Sếp Dzũ

Theo chỉ đạo trực tiếp của Sếp Dzũ:
Cấu trúc Chặng 1 ban đầu gồm 4 mục:
- *Bài 1.1: 3 Cấp Độ Hạnh Phúc (Mihály Csíkszentmihályi & Martin Seligman)*
- *Bài 1.2: Giá Trị Cốt Lõi Cá Nhân (ME Values) & La Bàn Hành Động*
- *Bài 1.3: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc Ở Nơi Làm Việc*
- *Bài 1.4: Cổng Vượt Chặng — Bài Kiểm Tra*

Được điều chỉnh và tinh gọn thành **chuỗi 6 trạm học tập liền mạch với đúng 2 điểm dừng IAM**:
1. **Bài 1.1: 3 Cấp Độ Hạnh Phúc (Mihály Csíkszentmihályi & Martin Seligman)** (Tập trung lý thuyết nền tảng & slide)
2. **Bài 1.2: Giá Trị Cốt Lõi Cá Nhân (ME Values) & La Bàn Hành Động** (Lý thuyết, slide & trạm test Me Values 1vs1)
3. **Check point 1: I . A . M** (Điểm dừng phản tư tổng hợp đúc kết sau Bài 1.1 & Bài 1.2)
4. **Bài 1.3: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc Ở Nơi Làm Việc** (Lý thuyết 3 đòn bẩy kết nối • tự chủ • tiến bộ)
5. **Check point 2: I . A . M** (Điểm dừng phản tư ứng dụng cho Bài 1.3)
6. **Cổng Vượt Chặng — Bài Kiểm Tra** (Bài kiểm tra 10 câu trắc nghiệm tổng hợp Chặng 1)

**Lợi ích sư phạm vượt trội:**
- Không còn tình trạng mỗi bài đều nhét 1 khối IAM gây vụn vặt và mỏi mệt cho học viên.
- Toàn bộ Chặng 1 chỉ còn đúng **2 chỗ IAM** rõ ràng, có trọng lượng:
  + *Check point 1:* Tổng hợp Hạnh phúc tự thân & Định vị La bàn Me Values.
  + *Check point 2:* Chuyển hóa 3 Đòn bẩy thành hành động thực tế (Small Wins) tại nơi làm việc.
- Cổng Vượt Chặng đứng ở vị trí tổng kết độc lập, không bị gán số "Bài 1.4" mang tính cục bộ.

---

## 2. Chi Tiết Thay Đổi Mã Nguồn (Actionable Spec)

### A. Tệp `curriculum_data.json`
- Cập nhật danh sách `stages[0].subSections`:
  ```json
  [
    { "id": "sub-1-1", "title": "Bài 1.1: 3 Cấp Độ Hạnh Phúc (Mihály Csíkszentmihályi & Martin Seligman)", "target": "stage1-mod-1-1", "tab": "tab-practice" },
    { "id": "sub-1-2", "title": "Bài 1.2: Giá Trị Cốt Lõi Cá Nhân (ME Values) & La Bàn Hành Động", "target": "stage1-mod-1-2", "tab": "tab-practice" },
    { "id": "sub-1-cp1", "title": "Check point 1: I . A . M", "target": "stage1-mod-cp1", "tab": "tab-practice" },
    { "id": "sub-1-3", "title": "Bài 1.3: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc Ở Nơi Làm Việc", "target": "stage1-mod-1-3", "tab": "tab-practice" },
    { "id": "sub-1-cp2", "title": "Check point 2: I . A . M", "target": "stage1-mod-cp2", "tab": "tab-practice" },
    { "id": "sub-1-quiz", "title": "Cổng Vượt Chặng — Bài Kiểm Tra", "target": "stage1-mod-quiz", "tab": "tab-practice" }
  ]
  ```

### B. Tệp `index.html`
1. **Thanh Mốc Lộ Trình Chặng 1 (`#stage1-milestone-bar`):**
   - Đổi số lượng hiển thị thành `0/6 Hoàn thành`.
   - Danh sách 6 chips mốc:
     + `m-pill-levels`: `1. 3 Cấp Độ Hạnh Phúc`
     + `m-pill-values`: `2. La Bàn Me Values`
     + `m-pill-cp1`: `📍 Check point 1: I•A•M`
     + `m-pill-drivers`: `3. 3 Đòn Bẩy SDT`
     + `m-pill-cp2`: `📍 Check point 2: I•A•M`
     + `m-pill-quiz`: `🎯 Cổng Vượt Chặng (≥80%)`
2. **Cấu trúc Accordion Chặng 1:**
   - **Bài 1.1 (`#stage1-mod-1-1`):** Giữ Phần 1 (Lý thuyết Slide 16, 17); gỡ bỏ accordion con phản tư IAM cũ.
   - **Bài 1.2 (`#stage1-mod-1-2`):** Giữ khối gợi ý test 1vs1, Phần 1 (Lý thuyết Slide định nghĩa & Slide 23), và vùng Top 7 badges. Gỡ bỏ 3 ô textarea IAM cũ.
   - **Check point 1 (`#stage1-mod-cp1` - MỚI):**
     + Header: `📍 Check point 1: I . A . M`
     + Phụ đề: `Phản tư tổng hợp sau Bài 1.1 & Bài 1.2: 3 Cấp Độ Hạnh Phúc & La Bàn Giá Trị (Me Values)`
     + Tích hợp nút chọn nhanh Top 7 giá trị để điền tự động vào ô I.
     + 3 ô Textarea I•A•M: `iam-cp1-i`, `iam-cp1-a`, `iam-cp1-m`.
   - **Bài 1.3 (`#stage1-mod-1-3`):** Giữ Phần 1 (Lý thuyết Slides 25, 29, 31, 38); gỡ bỏ accordion con phản tư IAM cũ.
   - **Check point 2 (`#stage1-mod-cp2` - MỚI):**
     + Header: `📍 Check point 2: I . A . M`
     + Phụ đề: `Phản tư ứng dụng sau Bài 1.3: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc Ở Nơi Làm Việc`
     + 3 ô Textarea I•A•M: `iam-cp2-i`, `iam-cp2-a`, `iam-cp2-m`.
   - **Cổng Vượt Chặng (`#stage1-mod-quiz`):**
     + Cập nhật tiêu đề: `Cổng Vượt Chặng — Bài Kiểm Tra` (xóa nhãn cũ "Bài 1.4: Cổng Vượt Chặng...").
     + Icon: `🎯`.

### C. Tệp `app.js`
1. **Fallback Curriculum:** Cập nhật mảng `subSections` của Chặng 1 đồng bộ 100% với file JSON.
2. **Data Binding & Tương Thích Ngược (Backward Compatibility):**
   - Bind `iam-cp1-i/a/m` vào `sData.iam_cp1` (tự động đọc dữ liệu cũ từ `sData.iam_1_2` hoặc `sData.iam_1_1` nếu có).
   - Bind `iam-cp2-i/a/m` vào `sData.iam_cp2` (tự động đọc dữ liệu cũ từ `sData.iam_1_3` nếu có).
   - Giữ liên kết click Top 7 badges để điền giá trị vào `iam-cp1-i`.
3. **Sidebar Completion Badges (`renderSyllabus`):**
   - Cập nhật điều kiện hiển thị dấu `✓` cho từng mục trong 6 mục của Chặng 1.
4. **Hàm Tính Tiến Độ & Cập Nhật Thanh Mốc:**
   - `calculateStage1Progress()`: Dựa trên hoàn thành CP1, CP2 và Cổng Vượt Chặng.
   - `updateStage1Milestones()`: Cập nhật trạng thái cho cả 6 chips mốc.

---

## 3. Quy Trình Kiểm Chứng (Verification Protocol)

1. **Kiểm tra cú pháp JS & JSON:**
   - Chạy `node -c dh4hn-website/lms/app.js` và `node -c Teaching DH/dhm-micro-lms/app.js`.
   - Parse JSON kiểm tra định dạng hợp lệ.
2. **Kịch bản kiểm thử cục bộ tự động:**
   - Viết script kiểm tra sự tồn tại của 6 mục trong Sidebar và Accordion DOM.
   - Kiểm tra chỉ còn đúng 2 cụm textarea IAM (`#iam-cp1-*` và `#iam-cp2-*`), không còn IAM phân mảnh ở các bài học.
   - Kiểm tra lưu đệm và đồng bộ dữ liệu vào `localStorage`.
3. **Kiểm tra trực quan Browser Subagent (nếu cần):**
   - Chụp ảnh màn hình giao diện Chặng 1 trên mobile/desktop để chứng minh bố cục hiển thị hoàn hảo.

---

## 4. Phương Án Quay Lui (Rollback Plan)

Nếu có bất kỳ sai lệch nào, hoàn tác ngay lập tức về snapshot commit trước đó:
```powershell
git checkout HEAD -- lms/
```
hoặc phục hồi từ bản sao lưu `.bak_20261008_cp_restructure`.
