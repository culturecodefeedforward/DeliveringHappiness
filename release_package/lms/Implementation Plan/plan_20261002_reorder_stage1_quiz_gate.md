# Kế Hoạch Triển Khai: Phân Rã Vi Mô Chặng 1 (Micro-Learning) & Cấu Trúc 2 Phần Chuẩn Hóa
*Mã tài liệu: `plan_20261002_reorder_stage1_quiz_gate.md`*  
*Ngày lập: 02/10/2026 (Cập nhật lúc 23:00 theo chỉ đạo chuyên sâu của Sếp Dzũ)*  
*Bề mặt tác động: `lms/curriculum_data.json`, `lms/index.html`, `lms/app.js`*  

---

## 1. Bối Cảnh & Kiến Trúc Sư Phạm Mới (Micro-Learning Architecture)

Theo chỉ đạo mới nhất của Sếp Dzũ:
1. **Phân rã "3 Cấp Độ Hạnh Phúc" thành 3 mục con độc lập**:
   - Do slide gốc chỉ có 1 slide chung (`slide_16.png`), kiến thức lý thuyết chuyên sâu được lấy bổ sung từ kho **NotebookLM đã kiểm chứng** (`notebooklm_sources_clean/info_sec_02_khoa_hoc_hanh_phuc.md` và `info_sec_09_phieu.md`).
   - Gồm 3 mục: 1.1a (Cấp độ 1: Thú vui), 1.1b (Cấp độ 2: Đam mê & Dòng chảy Flow), 1.1c (Cấp độ 3: Mục đích cao cả & Ba tầng lầu).
2. **Phân rã "3 Đòn Bẩy Hạnh Phúc" thành 3 mục con độc lập**:
   - Lý thuyết chọn các slide chuyên biệt tương ứng: 1.3a (Kết nối - `slide_29`), 1.3b (Tự chủ - `slide_31`), 1.3c (Tiến bộ - `slide_38`), kèm slide tổng quan `slide_25`.
   - Bổ sung tài liệu từ NotebookLM (`info_sec_04_ket_noi.md`, `info_sec_05_tu_chu.md`, `info_sec_06_tien_bo.md`).
3. **Mỗi mục con đều tuân thủ kiến trúc chuẩn 2 phần**:
   - **Phần 1: Lý thuyết:**
     + *"Tài liệu"*: Slide bài giảng trích xuất (click xem modal HD qua `openInfographicModal`).
     + *"Xem thêm"*: Trích dẫn tinh hoa từ NotebookLM, Infographic HD và Podcast liên quan.
   - **Phần 2: Thực hành / Bài tập:** Phản tư I•A•M tập trung, Case study và Cam kết hành động.
4. **Cổng Vượt Chặng ở cuối Chặng 1**: 10 câu trắc nghiệm tổng hợp (Bài 1.4).

---

## 2. Bảng Đối Chiếu Nội Dung Toàn Diện (Mapping Matrix: Slide, NotebookLM & Thực Hành)

Tất cả slide, infographic và file nguồn NotebookLM dưới đây đều đã được kiểm chứng tồn tại 100% trên đĩa cục bộ:

| STT | Module / Mục Con | 1/ Lý Thuyết: "Tài Liệu" (Slide PNG) | 1/ Lý Thuyết: "Xem Thêm" (NotebookLM & Infographics) | 2/ Thực Hành / Bài Tập |
|:---:|:---|:---|:---|:---|
| **0** | **Mốc 1: Video & Audio Tổng Quan** | • `slide_04.png`: Lộ trình 3 Mini Step<br>• `slide_05.png`: Ban Giảng Huấn | • Audio `dh4_overview.mp3`<br>• Video Explainer `the_explainer.mp4` | Nghe và xem video nền tảng |
| **1** | **Bài 1.1a: Cấp Độ 1 — Thú Vui (Pleasure)** | • `slide_16.png`: 3 Cấp độ Hạnh phúc<br>• `slide_14.png`: Kim tự tháp mục tiêu | • **NotebookLM `info_sec_02`**: Cái bẫy *Hedonic Treadmill*, Dopamine ngắn hạn<br>• Infographic 3 Cấp độ HD | • Phản tư I•A•M 1.1a (Nhận diện Thú vui)<br>• Case Study: Trống rỗng sau đạt KPI<br>• Cam kết thoát bẫy ngắn hạn |
| **2** | **Bài 1.1b: Cấp Độ 2 — Đam Mê & Flow (Passion)** | • `slide_16.png`: Cấp độ 2 (Passion / Flow) | • **NotebookLM `info_sec_09`**: Trạng thái Flow (Csikszentmihalyi), Cân bằng Thử thách vs Kỹ năng, Vi dòng chảy Microflow<br>• Infographic Trạng thái Flow | • Phản tư I•A•M 1.1b (Khoảnh khắc Flow)<br>• Case Study: Thiết kế công việc tạo Flow<br>• Cam kết rèn luyện Microflow |
| **3** | **Bài 1.1c: Cấp Độ 3 — Mục Đích Cao Cả (Higher Purpose)** | • `slide_16.png`: Cấp độ 3 (Higher Purpose)<br>• `slide_17.png`: Ẩn dụ 3 Tầng Lầu (Phong Tử Khải) | • **NotebookLM `info_sec_02`**: Công thức AHA (Nền Mục đích - Thân Đam mê - Rắc Niềm vui)<br>• Podcast `ba_tang_zappos.mp3` | • Phản tư I•A•M 1.1c (Tầng lầu thứ 3)<br>• Case Study: Gắn kết công việc với sứ mệnh phụng sự<br>• Cam kết đóng góp |
| **4** | **Bài 1.2: Định Vị La Bàn (Me Values)** | • `slide_22.png`: La Bàn Me Values | • **NotebookLM `info_sec_03`**: 41 Giá trị cốt lõi, Kim chỉ nam nội tâm<br>• Infographic La Bàn & Đồng Hồ<br>• Tool test 1vs1: `../personal-value.html` | • Chọn 41 giá trị Me Values (hoặc áp dụng Top 7 từ 1vs1)<br>• Phản tư I•A•M 1.2<br>• Case Study: Chính trực vs Doanh số |
| **5** | **Bài 1.3a: Đòn Bẩy 1 — Cảm Giác Kết Nối (Relatedness)** | • `slide_25.png`: 3 Đòn Bẩy SDT<br>• `slide_29.png`: Sống Hòa Ái (Kết Nối) | • **NotebookLM `info_sec_04`**: An toàn tâm lý (Psychological Safety), Hòa ái bản thân - người khác - tự nhiên<br>• Infographic Sức Mạnh Kết Nối | • Phản tư I•A•M 1.3a<br>• Case Study: Hướng gió máy lạnh (Quan tâm nhu cầu nhỏ)<br>• Cam kết kết nối |
| **6** | **Bài 1.3b: Đòn Bẩy 2 — Cảm Giác Tự Chủ (Autonomy)** | • `slide_25.png`: 3 Đòn Bẩy SDT<br>• `slide_31.png`: Tự Chủ & Làm Chủ Bối Cảnh | • **NotebookLM `info_sec_05`**: *"You cannot change people, but change context"*, Làm vì SỢ sang làm vì TIN, Tinh thần làm chủ Ownership Advantage™<br>• Infographic Sức Mạnh Tự Chủ | • Phản tư I•A•M 1.3b<br>• Case Study: Chị An viết MSR, Chị Hà đối thoại 15 năm<br>• Cam kết chủ động bối cảnh |
| **7** | **Bài 1.3c: Đòn Bẩy 3 — Cảm Giác Tiến Bộ (Competence)** | • `slide_25.png`: 3 Đòn Bẩy SDT<br>• `slide_38.png`: Động Lực Tiến Bộ & Small Wins | • **NotebookLM `info_sec_06`**: *The Progress Principle* (Teresa Amabile), Tôn vinh bước tiến nhỏ, Vòng phản hồi tức thì<br>• Infographic Động Lực Tiến Bộ | • Phản tư I•A•M 1.3c<br>• Case Study: Thiết lập Small Wins<br>• Cam kết ghi nhận nỗ lực |
| **8** | **Bài 1.4: 🎯 Bài Kiểm Tra Vượt Chặng 1** | • `slide_04.png`: Lộ trình 3 Mini Step<br>• `slide_09.png`: Triết lý Tony Hsieh | • `huong_dan_on_tap_dhm.md`: Cẩm nang ôn tập Chặng 1 | • 10 câu trắc nghiệm tổng hợp vượt chặng (≥7/10 câu)<br>• Badge: `CỔNG VƯỢT CHẶNG` mở khóa Chặng 2 & 3 |

---

## 3. Cấu Trúc UI Accordion & Phân Nhóm Trực Quan

Để tránh làm danh sách bị quá dài, giao diện Chặng 1 sẽ được tổ chức thành **3 Cụm Accordion Lớn (Theme Clusters)**, bên trong mỗi cụm có các Sub-accordion (mục con) hoặc Tab con mượt mà:

- **Cụm 1: 🌟 3 Cấp Độ Hạnh Phúc (Martin Seligman)**:
  + Gồm 3 card con: `1.1a Thú Vui`, `1.1b Đam Mê & Flow`, `1.1c Mục Đích Cao Cả`.
- **Cụm 2: 🧭 Định Vị La Bàn — Giá Trị Cốt Lõi Cá Nhân (Me Values)**:
  + Gồm bài tập chọn 41 giá trị, đồng bộ 1vs1, phản tư La Bàn.
- **Cụm 3: 🚀 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)**:
  + Gồm 3 card con: `1.3a Cảm Giác Kết Nối`, `1.3b Cảm Giác Tự Chủ`, `1.3c Cảm Giác Tiến Bộ`.
- **Cụm 4: 🎯 Cổng Vượt Chặng — Bài Kiểm Tra 10 Câu**:
  + Card riêng biệt ở cuối cùng, badge `CỔNG VƯỢT CHẶNG`.

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu (Verification Steps)

1. `node -c lms/app.js` ➔ Exit code 0, không có SyntaxError.
2. Kiểm tra `curriculum_data.json` chuẩn cú pháp JSON sau khi cập nhật toàn bộ metadata NotebookLM và Slide.
3. Chạy script Puppeteer Headless UAT:
   - Kiểm tra hiển thị đầy đủ 2 phần (1/ Lý Thuyết: Slide + NotebookLM + Infographic; 2/ Thực Hành: IAM + Case) trong từng mục con.
   - Thử click xem Slide HD và Infographic modal.
   - Kiểm tra thanh tiến độ và nộp bài test vượt chặng.

---

## 5. Kế Hoạch Quay Lui (Rollback Strategy)

```powershell
Copy-Item "lms\_backup_20261002\app_before_accordion.js" "lms\app.js" -Force
Copy-Item "lms\_backup_20261002\index_before_accordion.html" "lms\index.html" -Force
git checkout -- lms/curriculum_data.json
```

---

## 6. Ranh Giới Phê Duyệt (Approval Boundaries)

- **Cấp độ 2 (Plan Approval):** Duyệt thực thi chỉnh sửa 3 tệp trong allowlist.
- **Cấp độ 3 (Risky Operation Approval):** Bắt buộc xin phê duyệt riêng trước khi commit, push hoặc deploy.
