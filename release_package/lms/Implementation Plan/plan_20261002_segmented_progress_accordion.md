# Kế Hoạch Triển Khai: Thanh Tiến Trình Phân Đoạn & Accordion Mô-đun LMS (Delivering Happiness)
*Mã tài liệu: `plan_20261002_segmented_progress_accordion.md`*  
*Ngày lập: 02/10/2026*  
*Người lập: Antigravity Multi-Agent Pair Programming*  
*Bề mặt tác động: `lms/index.html`, `lms/app.js`*  

---

## 1. Bối Cảnh & Động Lực (Context & Rationale)

Hiện tại, hệ thống LMS của Delivering Happiness đang gặp 2 điểm nghẽn lớn về trải nghiệm người dùng (UX):
1. **Thiếu cảm giác tiến bộ (Sense of Progress)**: Thanh tiến độ ở Header (`#global-progress-bar`) chỉ chia làm 3 nấc nhảy lớn thô sơ theo cấp Chặng (`0%`, `33%`, `67%`, `100%`). Khi học viên hoàn thành từng video, bài sát hạch, bài tập La Bàn Giá Trị hay phản tư I•A•M, thanh tiến độ vẫn đứng yên `0%`, gây cảm giác nản lòng và không ghi nhận nỗ lực vi mô.
2. **Quá tải thị giác (Visual Cognitive Overload)**: Tab Bài Tập & Sát Hạch (`tab-practice`) hiển thị tất cả các bài tập dài dằng dặc trên cùng một trang cuộn (bài test 10 câu, phản tư I•A•M, bài tập tình huống, La bàn 41 giá trị...). Học viên dễ bị "ngợp", khó tập trung vào mục tiêu trước mắt và mất nhiều thời gian cuộn trang.

**Mục tiêu giải pháp:**
- **Trụ cột 1: Segmented Progress Bar (Thanh tiến trình phân đoạn)**: Chia nhỏ thanh tiến trình header thành 3 thanh phân đoạn tương ứng 3 Chặng, trong đó mỗi Chặng tính % vi mô (Micro-Progress) dựa trên từng mục con đã hoàn thành.
- **Trụ cột 2: Collapsible Accordion Modules (Mô-đun dạng gập/mở)**: Mặc định thu gọn các khối bài tập lớn thành các Card Accordion gọn gàng. Học viên bấm vào Header/mũi tên hoặc bấm vào mục con ở Sidebar menu bên trái thì module sẽ tự động bung mở và cuộn tới vị trí học.
- **Trụ cột 3: Milestone Pills Bar (Hàng mốc tiến độ trực quan)**: Bổ sung hàng chip mốc tiến độ đầu mỗi Chặng để học viên thấy rõ lộ trình các bước nhỏ.

---

## 2. Phạm Vi & Danh Sách Tệp Cho Phép (Allowlist & Scope)

### Tệp cho phép chỉnh sửa (Allowlist):
1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html` (Cấu trúc DOM của Header Segmented Progress Bar và các thẻ Accordion wrapper).
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js` (Hàm tính micro-progress `calculateMicroProgress()`, nâng cấp `updateGlobalProgress()`, logic toggle Accordion và đồng bộ Sidebar menu).

### Tệp nguồn chuẩn tham chiếu (Read-only Source of Truth):
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json` (Danh mục stages và subSections).
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md` (Quy tắc an toàn).

### Tuyệt đối KHÔNG thay đổi:
- Cấu trúc `localStorage` key (Giữ nguyên schema `dh_learner_progress_v3` để đảm bảo 100% tương thích ngược).
- Không chạm các file ngoài thư mục `lms/`.

---

## 3. Kiến Trúc Kỹ Thuật Chi Tiết (Technical Architecture)

### 3.1. Trụ Cột 1: Segmented Progress Bar (Thanh Tiến Trình Phân Đoạn)

#### A. Cấu trúc DOM mới tại Header (`lms/index.html`)
Thay thế thanh `#global-progress-bar` đơn khối hiện tại bằng layout 3 đoạn (Segments):

```html
<!-- COURSE PROGRESS: 3-SEGMENTED PROGRESS BAR -->
<div class="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
    <div class="w-full">
        <div class="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span class="text-slate-400">Tiến độ khóa học</span>
            <span id="global-progress-text" class="text-brand-amber font-bold font-mono">0% (0/3 Chặng)</span>
        </div>
        <!-- 3 Segmented Bars Container -->
        <div class="grid grid-cols-3 gap-1.5 h-2 w-full">
            <!-- Segment 1: Chặng 1 -->
            <div class="h-full bg-brand-surface rounded-full overflow-hidden border border-brand-border/60 relative" title="Chặng 1: Nhận Thức">
                <div id="segment-bar-1" class="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 w-0"></div>
            </div>
            <!-- Segment 2: Chặng 2 -->
            <div class="h-full bg-brand-surface rounded-full overflow-hidden border border-brand-border/60 relative" title="Chặng 2: Trải Nghiệm">
                <div id="segment-bar-2" class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 w-0"></div>
            </div>
            <!-- Segment 3: Chặng 3 -->
            <div class="h-full bg-brand-surface rounded-full overflow-hidden border border-brand-border/60 relative" title="Chặng 3: Chuyển Hóa">
                <div id="segment-bar-3" class="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 w-0"></div>
            </div>
        </div>
        <!-- Sub-labels under segments -->
        <div class="grid grid-cols-3 gap-1.5 text-[9px] text-slate-500 mt-1 font-semibold">
            <span id="segment-label-1" class="truncate">C1: 0%</span>
            <span id="segment-label-2" class="truncate text-center">C2: 0%</span>
            <span id="segment-label-3" class="truncate text-right">C3: 0%</span>
        </div>
    </div>
</div>
```

#### B. Thuật Toán Tính Micro-Progress (`calculateStageProgress(stageIdx)`)
Triển khai hàm chuẩn tính điểm vi mô theo từng mục con:

- **Chặng 1 (Trọng số 4 mốc con = 25% mỗi mốc):**
  1. `mốc 1` (25%): Video giới thiệu hoặc Audio podcast đã xem/nghe (`s1Data.videoWatched || s1Data.audioListened`).
  2. `mốc 2` (25%): Đạt sát hạch đầu vào (≥7/10 câu) VÀ hoàn thành phản tư I•A•M 1.1 (`(s1Data.passed || s1Data.percentage >= 70) && s1Data.iam_1_1?.I`).
  3. `mốc 3` (25%): Đã chọn ≥1 Giá trị La Bàn VÀ hoàn thành phản tư I•A•M 1.2 (`s1Data.selectedValues?.length > 0 && s1Data.iam_1_2?.I`).
  4. `mốc 4` (25%): Hoàn thành thiết kế công việc Job Crafting VÀ phản tư I•A•M 1.3 (`s1Data.iam_1_3?.I`).

- **Chặng 2 (Trọng số 5 thói quen = 20% mỗi thói quen):**
  - Đếm số thói quen (Mindfulness, Gratitude, Optimism, Altruism, Flow) đã được học viên làm bài tập hoặc ghi chú phản tư trong `s2Data`.

- **Chặng 3 (Trọng số Thử thách 21 ngày):**
  - Tận dụng `calculateStage3Streak()` vừa hoàn thiện:
  - Tỷ lệ hoàn thành = `Math.min(100, Math.round((streakStats.totalCompletedDays / 21) * 100))`.

- **Tiến độ tổng (`globalProgress`):**
  - `totalPct = Math.round((pct1 + pct2 + pct3) / 3)`.

---

### 3.2. Trụ Cột 2: Collapsible Accordion Modules (Mô-đun Gập/Mở Mặc Định)

#### A. Cấu trúc Accordion Card chuẩn
Mỗi khối module trong `tab-practice` (ví dụ `#stage1-mod-1-1`, `#stage1-mod-1-2`, `#stage1-mod-1-3`, `#stage3-tracker-section`) sẽ được chuẩn hóa cấu trúc:

```html
<div id="stage1-mod-1-1" class="accordion-module rounded-2xl bg-brand-card/30 border border-brand-border transition-all overflow-hidden">
    <!-- ACCORDION HEADER (Always visible, Clickable) -->
    <div class="accordion-header p-5 flex items-center justify-between cursor-pointer hover:bg-brand-card/60 transition-colors select-none" data-target="mod-1-1-body">
        <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-brand-amber/20 text-brand-amber flex items-center justify-center font-extrabold text-sm border border-brand-amber/30">1.1</span>
            <div>
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-brand-amber text-black font-extrabold text-[10px] uppercase">Cổng Sát Hạch</span>
                    <h3 class="text-sm font-bold text-white">Bài 1.1: Kiểm Tra Sát Hạch & Phản Tư I•A•M</h3>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">10 câu trắc nghiệm • Đạt ≥70% để mở khóa Chặng 2 & 3</p>
            </div>
        </div>
        <div class="flex items-center gap-2.5">
            <span id="badge-status-mod-1-1" class="text-xs px-2.5 py-1 rounded-full bg-brand-dark text-slate-400 font-medium border border-brand-border">Chưa làm</span>
            <button type="button" class="accordion-chevron w-7 h-7 rounded-lg bg-brand-surface flex items-center justify-center text-slate-400 hover:text-white transition-transform">
                <span class="transform transition-transform duration-300">▼</span>
            </button>
        </div>
    </div>
    
    <!-- ACCORDION BODY (Collapsible, default hidden hoặc open nếu là active module) -->
    <div id="mod-1-1-body" class="accordion-body hidden p-5 pt-0 border-t border-brand-border/40 space-y-6">
        <!-- Toàn bộ nội dung câu hỏi trắc nghiệm, I•A•M 1.1 hiện tại -->
    </div>
</div>
```

#### B. Quy Tắc Tự Động Mở (Expansion Rules)
1. **Trạng thái khởi tạo**:
   - Nếu học viên chưa làm module nào -> Mở sẵn module đầu tiên (`stage1-mod-1-1`), các module sau gập lại (`hidden`).
   - Nếu học viên đã hoàn thành module 1.1 nhưng chưa làm 1.2 -> Tự động mở module 1.2, đóng module 1.1 (để gọn màn hình nhưng vẫn có thể bấm mở lại khi cần xem lại).
2. **Đồng bộ với Sidebar Click (Menu bên trái)**:
   - Trong `renderSyllabus()` tại `app.js`, khi học viên bấm vào `subBtn` (ví dụ `sub-1-2`):
     - Xác định phần tử mục tiêu `sub.target`.
     - Tìm container Accordion cha hoặc thân accordion `accordion-body`.
     - Loại bỏ class `hidden` và xoay mũi tên `rotate-180`.
     - Gọi `el.scrollIntoView({ behavior: "smooth", block: "start" })` sau khi mở để cuộn mượt mắt nhìn tới ngay đầu bài tập.

---

### 3.3. Trụ Cột 3: Milestone Pills Bar (Hàng Mốc Tiến Độ Chặng)
- Bổ sung thanh Milestone Pills đặt ở đầu `tab-practice`:
  - Thể hiện trực quan 4 viên chip con của Chặng 1:
    - `[✓ Video & Audio]`
    - `[✓ Cổng Sát Hạch (≥70%)]`
    - `[⏳ La Bàn Giá Trị]`
    - `[○ Thiết Kế Công Việc]`
  - Giúp học viên có "Bản đồ thu nhỏ" ngay trước mắt.

---

## 4. Kế Hoạch Triển Khai & Kiểm Thử (Implementation & Verification Steps)

### Bước 1: Sao lưu mã nguồn (Pre-flight Backup)
Tạo bản sao lưu an toàn tại `lms/_backup_20261002/`:
- `lms/_backup_20261002/app_before_accordion.js`
- `lms/_backup_20261002/index_before_accordion.html`

### Bước 2: Cập nhật DOM trong `lms/index.html`
1. Thay thế khối `#global-progress-bar` bằng layout 3-segment progress bars.
2. Thêm thanh Milestone Pills Bar tại đầu `#tab-practice`.
3. Bọc các module `stage1-mod-1-1`, `stage1-mod-1-2`, `stage1-mod-1-3` thành các thẻ Accordion hoàn chỉnh với header, chevron và body.

### Bước 3: Cập nhật Logic trong `lms/app.js`
1. Xây dựng hàm `calculateStage1Progress()`, `calculateStage2Progress()`, `calculateStage3Progress()`.
2. Nâng cấp `updateGlobalProgress()` để cập nhật độ rộng cả 3 thanh phân đoạn (`segment-bar-1`, `segment-bar-2`, `segment-bar-3`) cùng các nhãn %.
3. Viết hàm `initAccordions()` để xử lý click đóng/mở và animation xoay mũi tên.
4. Cập nhật `renderSyllabus()` để khi click vào mục con bên sidebar sẽ tự động bung mở Accordion mục tiêu trước khi cuộn màn hình (`scrollIntoView`).
5. Gọi `updateGlobalProgress()` ngay sau mỗi thao tác lưu bài tập (nộp bài test, lưu IAM, chọn giá trị, đánh dấu thói quen).

### Bước 4: Kiểm chứng cục bộ (Local Verification)
1. Kiểm tra cú pháp JavaScript:
   ```powershell
   node -c lms/app.js
   ```
2. Mở trình duyệt kiểm tra:
   - Thanh header chia làm 3 đoạn rõ ràng, đổi % ngay khi làm xong bài test hoặc chọn giá trị.
   - Các card bài tập hiển thị gọn gàng, bấm vào mở ra mượt mà.
   - Bấm vào mục con bên sidebar trái: accordion bung ra và cuộn chính xác tới bài tập.

---

## 5. Kế Hoạch Quay Lui (Rollback Strategy)

Nếu phát hiện bất kỳ lỗi gián đoạn nào về mặt hiển thị hoặc xung đột JavaScript:
1. Khôi phục trực tiếp từ backup:
   ```powershell
   Copy-Item "lms\_backup_20261002\app_before_accordion.js" "lms\app.js" -Force
   Copy-Item "lms\_backup_20261002\index_before_accordion.html" "lms\index.html" -Force
   ```
2. Kiểm tra lại cú pháp: `node -c lms/app.js`.

---

## 6. Ranh Giới Phê Duyệt (Approval Boundaries)

- **Cấp độ 2 (Plan Approval)**: Cho phép tạo backup và chỉnh sửa `lms/index.html`, `lms/app.js`, chạy kiểm thử cục bộ `node -c`.
- **Cấp độ 3 (Risky Operation Approval)**: Bắt buộc dừng lại xin duyệt riêng trước khi chạy bất kỳ lệnh `git add`, `git commit` hoặc `git push` nào.
