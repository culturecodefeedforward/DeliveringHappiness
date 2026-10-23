# KẾ HOẠCH TRIỂN KHAI: CHUẨN HÓA WORDING, THUẬT NGỮ SƯ PHẠM VÀ KHAI TỬ SUY DIỄN SCBA TRONG LMS DELIVERING HAPPINESS

**Mã tài liệu:** `PLAN-20261003-STANDARDIZE-LMS-WORDING`  
**Ngày lập:** 03/10/2026  
**Trạng thái:** Chờ phê duyệt Cấp độ 2 (Awaiting Plan Approval)  
**Phạm vi:** `dh4hn-website/lms` & `Teaching DH/notebooklm_sources_clean`  
**Cơ sở:** Kết quả kiểm toán độc lập Round 1/3 đối chiếu 12 file NotebookLM, 44 Slide bài giảng và mã nguồn bài test Core Value.

---

## 1. NGUỒN CHUẨN THAM CHIẾU (SOURCES OF TRUTH)

Mọi thay đổi trong kế hoạch này bắt buộc phải bám sát 100% các nguồn chuẩn sau, nghiêm cấm suy diễn thêm:
1. **Kho Slide bài giảng ảnh PNG thực tế:** `dh4hn-website/data/artifacts/slides/` (đặc biệt: `slide_04.png`, `slide_09.png`, `slide_14.png`, `slide_16.png`, `slide_17.png`, `slide_23.png`, `slide_25.png`, `slide_28.png`, `slide_29.png`, `slide_30.png`, `slide_31.png`, `slide_35.png`, `slide_38.png`).
2. **Slide PPTX bóc tách và kịch bản giảng dạy:**
   - `Teaching DH/slide_titles_new.txt`
   - `Teaching DH/new_pptx_content.txt` (Slide 68: `SBA-Quét Cơ Thể Bằng Tỉnh Thức`, Slide 130: `SBA: Stop - Breathe - Ask`)
   - `Teaching DH/kich_ban_giang_day_DHM4_Vu.md`
3. **Mã nguồn ứng dụng bài test Core Value:**
   - `dh4hn-website/personal-value.html` (Tiêu đề: `La bàn giá trị cốt lõi cá nhân - Personal Core Value Compass`)
4. **Bộ 12 tệp NotebookLM chuẩn:**
   - `Teaching DH/notebooklm_sources_clean/` (đặc biệt `info_sec_07_tinh_thuc.md`, `info_sec_08_biet_on.md`)

---

## 2. DANH SÁCH TỆP CHO PHÉP CHỈNH SỬA (ALLOWLIST)

Chỉ chỉnh sửa đúng 4 tệp sau:
1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json`
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js`
3. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html`
4. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\notebooklm_sources_clean\info_sec_07_tinh_thuc.md`

---

## 3. CHI TIẾT 7 HẠNG MỤC THỰC THI (ACTIONABLE TASKS)

### HẠNG MỤC 1: Khai tử triệt để chữ "SCBA", quy về chuẩn duy nhất "SBA"
- **Hiện trạng:**
  - `info_sec_07_tinh_thuc.md` dòng 44 ghi: `Kỹ thuật SCBA (Stop - Connect - Breathe - Act)`.
  - `curriculum_data.json` dòng 654 ghi: `...& Kỹ Thuật SCBA`.
- **Hành động:**
  - Trong `info_sec_07_tinh_thuc.md`: Sửa tiêu đề mục và nội dung thành **Kỹ thuật SBA (Stop – Breathe – Attend/Ask)**. Bước 1: **Stop** (Dừng lại), Bước 2: **Breathe** (Hít thở sâu thả lỏng), Bước 3: **Attend / Ask** (Chú ý cảm thọ cơ thể hoặc tự hỏi lựa chọn phản ứng sáng suốt). Xóa bỏ hoàn toàn bước "Connect" do AI tự bịa.
  - Trong `curriculum_data.json` dòng 654: Sửa `Kỹ Thuật SCBA` thành `Kỹ Thuật SBA`.

---

### HẠNG MỤC 2: Chuẩn hóa tên Mục 1.3 theo Bài test Core Value và Slide 23
- **Hiện trạng:** Dùng lẫn lộn "Định Vị La Bàn — Me Values", "Định Vị La Bàn — Giá Trị Cốt Lõi Cá Nhân (Me Values)".
- **Hành động:**
  - Trong `curriculum_data.json`:
    - Dòng 34 (`sub-1-3.title`): Đổi thành `"Mục 1.3: La Bàn Giá Trị Cốt Lõi Cá Nhân (Me Values)"`.
    - Dòng 253 (`mod-1-2.title`): Đổi thành `"Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)"`.
  - Trong `app.js`:
    - Dòng 25 (`sub-1-3.title`): Đổi thành `"Mục 1.3: La Bàn Giá Trị Cốt Lõi Cá Nhân (Me Values)"`.
    - Dòng 82 (`mod-1-2.title`): Đổi thành `"Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)"`.
  - Trong `index.html`:
    - Dòng 699: Đổi tiêu đề accordion thành:
      `🎯 Mục 1.3 · Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)`
    - Dòng 701: Cập nhật subtitle:
      `Khám phá 41 giá trị chuẩn, lọc Top 7 và xác định DNA giá trị qua 21 trận đối kháng trực giác trên ứng dụng La Bàn Giá Trị Cốt Lõi Cá Nhân`

---

### HẠNG MỤC 3: Đồng bộ đánh số thứ tự Sidebar (Mục 1.1-1.5) và Accordion (Bài 1.1-1.4)
- **Hiện trạng:** Sidebar có 5 mục (1.1 Video, 1.2 3 Cấp độ, 1.3 La Bàn, 1.4 3 Đòn bẩy, 1.5 Cổng vượt chặng), nhưng Accordion trong `index.html` lại đánh số Bài 1.1, Bài 1.2, Bài 1.3, Bài 1.4 làm lệch số.
- **Hành động:**
  - Trong `index.html`: Cập nhật tiêu đề hiển thị song hành tại các header accordion:
    - Dòng 501 (Accordion 1): `Bài 1.1: 3 Cấp Độ Hạnh Phúc (Martin Seligman)` $\rightarrow$ **`Mục 1.2 · Bài 1.1: 3 Cấp Độ Hạnh Phúc (Martin Seligman)`**
    - Dòng 699 (Accordion 2): Đã làm ở Hạng mục 2 $\rightarrow$ **`Mục 1.3 · Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)`**
    - Dòng 921 (Accordion 3): `Bài 1.3: 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)` $\rightarrow$ **`Mục 1.4 · Bài 1.3: 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)`**
    - Dòng 1129 (Accordion 4): `🎯 Bài 1.4: Bài Kiểm Tra Vượt Chặng 1 (10 Câu Trắc Nghiệm)` $\rightarrow$ **`🎯 Mục 1.5 · Cổng Vượt Chặng: Bài Kiểm Tra 10 Câu Trắc Nghiệm`**

---

### HẠNG MỤC 4: Làm rõ ngữ cảnh câu hỏi Quiz 2 (dhm-quiz-2) về "An toàn tâm lý"
- **Hiện trạng:** Câu hỏi `An toàn tâm lý (Psychological Safety) thuộc đòn bẩy nào?` gây tranh cãi vì Slide 31 xếp nó dưới Đòn bẩy 2 (Tự chủ), nhưng đáp án cài đặt lại là Đòn bẩy 1 (Kết nối).
- **Hành động:**
  - Trong `curriculum_data.json` dòng 118:
    - Sửa câu hỏi thành: `"Trong xây dựng văn hóa giao tiếp cởi mở và thấu hiểu không phán xét, An toàn tâm lý (Psychological Safety) đóng vai trò nền tảng cho đòn bẩy nào?"`
    - Cập nhật phần giải thích (dòng 125): `"An toàn tâm lý giúp mọi người dám cởi mở, lắng nghe không phán xét và gắn kết chân thực, là nền tảng cốt lõi của Cảm giác Kết nối (Connectedness). Đồng thời ở cấp độ tổ chức, nó cũng là tiền đề để nhân viên dám nói lên tiếng nói cá nhân (Tự chủ)."`

---

### HẠNG MỤC 5: Hoàn thiện tên gọi `infographic.png` đúng 100% theo tệp ảnh
- **Hiện trạng:** `app.js` dòng 148 ghi: `{ title: "Đồ họa thông tin: Lộ Trình Khoa Học Hạnh Phúc", ... }`.
- **Hành động:**
  - Trong `app.js` dòng 148: Sửa thành:
    `{ title: "Đồ họa thông tin: Lộ Trình Khoa Học Hạnh Phúc: Từ Cá Nhân Đến Tổ Chức", type: "image", url: "data/artifacts/infographic.png", icon: "📊" }`

---

### HẠNG MỤC 6: Sửa lỗi chính tả & Chuẩn hóa thói quen Biết ơn
- **Hành động trong `curriculum_data.json`:**
  - Dòng 169: Sửa `"Theo  Delivering Happiness, ..."` $\rightarrow$ `"Theo Delivering Happiness, ..."` (xóa 1 dấu cách thừa).
  - Dòng 195: Sửa `"Đòn bảy Kết nối..."` $\rightarrow$ `"Đòn bẩy Kết nối được thể hiện qua hòa ái với:"` (sửa dấu hỏi thành dấu ngã, thêm dấu hai chấm).
  - Dòng 668: Sửa `"Ghi nhận 4 điều biết ơn mỗi ngày..."` $\rightarrow$ `"Ghi nhận 3 điều biết ơn mỗi ngày..."` (chuẩn hóa theo bài tập Three Good Things).

---

### HẠNG MỤC 7: Đồng bộ 10 câu Quiz Chặng 1 vào fallback của `app.js`
- **Hiện trạng:** `app.js` lines 47-70 chỉ có 2 câu hỏi mẫu cũ, trong khi `curriculum_data.json` có trọn vẹn 10 câu.
- **Hành động:**
  - Thay thế mảng `fallbackCurriculum.stages[0].modules[0].quiz` trong `app.js` bằng toàn bộ 10 câu trắc nghiệm lấy từ `curriculum_data.json` (dhm-quiz-1 đến dhm-quiz-10), đảm bảo tính sẵn sàng cao khi offline.

---

## 4. QUY TRÌNH KIỂM CHỨNG (VERIFICATION GATES)

Agent thực thi bắt buộc phải chạy và xác minh các bước sau trước khi báo cáo hoàn tất:
1. **Kiểm tra cú pháp JS:**
   ```powershell
   node -c "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js"
   ```
   *Yêu cầu:* Exit code 0, không có bất kỳ lỗi SyntaxError nào.
2. **Kiểm tra cấu trúc JSON:**
   ```powershell
   $data = Get-Content "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json" -Raw -Encoding UTF8 | ConvertFrom-Json
   Write-Host "JSON Valid. Stage 1 SubSections:" $data.stages[0].subSections.Count
   ```
   *Yêu cầu:* Parse thành công không lỗi, hiển thị đủ 5 subsections.
3. **Kiểm tra quét chuỗi loại trừ (Grep Gate):**
   ```powershell
   Select-String -Path "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json","C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html","C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\notebooklm_sources_clean\info_sec_07_tinh_thuc.md" -Pattern "SCBA|Đòn bảy" -Encoding UTF8
   ```
   *Yêu cầu:* 0 kết quả tìm thấy.
4. **Kiểm thử cục bộ giao diện (Local Verification):**
   Mở kiểm tra các nhãn hiển thị mới trên `index.html` và đảm bảo các nút bấm modal slide, nút chuyển test Core Value hoạt động bình thường.

---

## 5. KẾ HOẠCH QUAY LUI (ROLLBACK PLAN)

Nếu xảy ra lỗi phát sinh không thể khắc phục:
```powershell
git checkout -- "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json" "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js" "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html" "C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\notebooklm_sources_clean\info_sec_07_tinh_thuc.md"
```

---

## 6. RANH GIỚI PHÊ DUYỆT (APPROVAL BOUNDARY)
- **Cấp độ 2:** Cần User trực tiếp phê duyệt plan này trước khi bắt đầu sửa 4 file trong allowlist.
- **Cấp độ 3:** Sau khi sửa xong và chạy xong verification, KHÔNG được tự ý commit hoặc push Git mà phải xuất báo cáo và xin phê duyệt Cấp độ 3 riêng cho lệnh Git commit/push.
