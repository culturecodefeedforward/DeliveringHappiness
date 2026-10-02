# 📋 Implementation Plan + Agent Prompt: Gamification Chặng 3 — Streak Engine & Badges 21 Ngày

> **Ngày tạo:** 02/10/2026
> **Dự án:** DHM Blended LMS — Chặng 3 (Xưởng 21 Ngày, 5 Thói Quen Hạnh Phúc)
> **Nguồn tham chiếu kiến trúc:** Repo `read10-community-tracker` — `streakEngine.ts`, `badges.ts`, `StreakHero.tsx`
> **Phê duyệt:** Cấp độ 2 Plan Approval từ Sếp Dzũ

---

## MỤC TIÊU

Nâng cấp Bảng Điểm Danh 21 Ngày (hiện tại chỉ là grid checkbox tĩnh M•G•O•F•A) thành
**Hệ thống Gamification đầy đủ** gồm: Bộ đếm chuỗi liên tiếp (Streak Engine), Bộ 3 Huy hiệu
chuyển hóa, Heatmap 21 ô trực quan và Thanh tiến trình đếm ngược — tất cả trong Vanilla JS,
không thêm framework/thư viện bên ngoài.

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### Cấu trúc dữ liệu hiện tại (`localStorage`):
```javascript
learnerProgress.stageData["stage-3"] = {
    habitTracker: {
        // day_1..day_21, mỗi ngày: { mindfulness: bool, gratitude: bool, optimism: bool, flow: bool, altruism: bool }
    },
    weeklyCheckins: { w1: "", w2: "", w3: "" },
    dailyAbcde: { scenarioId: "", A: "", B: "", C: "", D: "", E: "" }
}
```

### Giao diện hiện tại (`app.js` dòng 2133-2179):
- Grid 21 ô, mỗi ô có 5 nút nhỏ `M G O F A` toggle on/off.
- Badge tổng hợp hiển thị `X/105 Lượt` và `Y%`.
- Không có khái niệm streak/chuỗi liên tiếp, không có huy hiệu, không có hiệu ứng tiến trình.

### DOM elements liên quan (`index.html`):
- `id="habit-tracker-grid"` — container grid 21 ô
- `id="tracker-count-badge"` — badge đếm tổng
- `id="tracker-summary-percent"` — phần trăm tổng
- `id="stage3-tracker-section"` — section bọc ngoài

---

## 2. KIẾN TRÚC GIẢI PHÁP

### 2.1. Streak Engine (Logic thuần — tham chiếu `read10-community-tracker/src/engine/streakEngine.ts`)

**Quy tắc tính Streak cho 5 Thói Quen:**
- Một ngày được tính là **"đã hoàn thành"** khi học viên tích ≥ 3/5 thói quen `M-G-O-F-A`.
- `currentStreak`: Đếm ngày liên tiếp (từ ngày hiện tại đếm lùi) mà mỗi ngày đều ≥ 3/5.
- `longestStreak`: Kỷ lục chuỗi dài nhất trong toàn bộ lịch sử 21 ngày (bảo toàn vĩnh viễn).
- `totalCompletedDays`: Tổng ngày đã hoàn thành (bất kể liền kề hay không).

**Hàm cần tạo trong `app.js`:**
```javascript
function calculateStage3Streak(habitTracker) {
    // Bước 1: Xác định ngày nào "đã hoàn thành" (≥ 3/5 thói quen)
    const completedDays = []; // Array of day numbers: [1, 2, 3, 5, 6, ...]
    for (let d = 1; d <= 21; d++) {
        const dayData = habitTracker[`day_${d}`] || {};
        const checkedCount = ["mindfulness","gratitude","optimism","flow","altruism"]
            .filter(k => !!dayData[k]).length;
        if (checkedCount >= 3) completedDays.push(d);
    }

    // Bước 2: Tính longestStreak (chuỗi liên tiếp dài nhất)
    let longest = 0, running = 0, prev = null;
    for (const day of completedDays) {
        if (prev === null || day === prev + 1) { running++; }
        else { running = 1; }
        if (running > longest) longest = running;
        prev = day;
    }

    // Bước 3: Tính currentStreak (đếm lùi từ ngày cao nhất đã hoàn thành)
    let current = 0;
    for (let i = completedDays.length - 1; i >= 0; i--) {
        if (i === completedDays.length - 1) { current = 1; }
        else if (completedDays[i] === completedDays[i + 1] - 1) { current++; }
        else { break; }
    }

    return {
        currentStreak: current,
        longestStreak: longest,
        totalCompletedDays: completedDays.length,
        completedDaysSet: new Set(completedDays)
    };
}
```

### 2.2. Bộ 3 Huy Hiệu Chuyển Hóa 21 Ngày

Dựa trên kiến trúc `read10-community-tracker/src/engine/badges.ts`, thiết kế 3 mốc neo
vào tâm lý học hành vi phù hợp chu kỳ 21 ngày:

| Mốc | ID | Tên | Icon | Tiêu chí | Ý nghĩa tâm lý |
|-----|-----|-----|------|----------|-----------------|
| 7 ngày | `seed_happiness` | Hạt Mầm Hạnh Phúc | 🌱 | 7 ngày liên tiếp ≥ 3/5 | Vượt qua tuần thử thách đầu tiên |
| 14 ngày | `sprout_discipline` | Cây Kỷ Luật Vươn Mình | 🌿 | 14 ngày liên tiếp ≥ 3/5 | Bền bỉ 2 tuần liên tục |
| 21 ngày | `dhm_champion` | Đại Sứ Hạnh Phúc | 🏆 | 21 ngày liên tiếp ≥ 3/5 | Hoàn thành trọn vẹn chuyển hóa |

**Logic mở khóa:** Huy hiệu được kích hoạt theo `longestStreak` (kỷ lục chuỗi dài nhất),
giống READ10: `"Thành tích cũ không mất."` — nếu đã từng đạt 7 ngày liên tiếp rồi bị đứt,
huy hiệu 🌱 vẫn giữ nguyên.

### 2.3. Heatmap 3 Tuần (21 Ô Trực Quan)

Nâng cấp grid 21 ô hiện tại thành **heatmap 4 cấp độ sắc thái** (tham chiếu Heatmap365 của READ10):
- **Cấp 0 (Trống):** 0/5 thói quen — `bg-slate-800/60` (xám tối)
- **Cấp 1 (Nhạt):** 1-2/5 thói quen — `bg-amber-900/40` (hổ phách nhạt)
- **Cấp 2 (Vừa):** 3-4/5 thói quen — `bg-amber-600/60` (hổ phách đậm)
- **Cấp 3 (Rực):** 5/5 trọn vẹn — `bg-brand-green` (xanh sáng + hiệu ứng glow)

Chia grid thành 3 hàng 7 cột, mỗi hàng kèm nhãn tuần:
- Hàng 1 (Ngày 1-7): **Tuần Gieo Mầm**
- Hàng 2 (Ngày 8-14): **Tuần Vươn Mình**
- Hàng 3 (Ngày 15-21): **Tuần Chuyển Hóa**

### 2.4. Thanh Tiến Trình & Đếm Ngược (Goal-Gradient Effect)

Tham chiếu `StreakHero.tsx` dòng 56-83: Luôn tính toán `daysToNextBadge` và hiển thị:
- Thanh tiến trình gradient đỏ-vàng (`flame-gradient`) phát sáng.
- Dòng chữ đếm ngược: *"Chỉ còn X ngày nữa để mở khóa huy hiệu [tên]!"*

---

## 3. FILE ALLOWLIST

Chỉ sửa đúng 2 file:
1. `lms/app.js` — Thêm `calculateStage3Streak()`, nâng cấp `renderStage3View()` phần 11.4
2. `lms/index.html` — Thêm vùng DOM cho Streak Hero Banner phía trên habit tracker grid

> **CẤM TUYỆT ĐỐI:** Không sửa `curriculum_data.json`, `styles.css`, roster files,
> `practice-abcde.html/js`, `chat-abcde.js/css` hay bất kỳ file nào ngoài danh sách.

---

## 4. CẤU TRÚC DOM CẦN THÊM VÀO `index.html`

Chèn vào bên trong `id="stage3-tracker-section"`, **TRƯỚC** `id="habit-tracker-grid"`:

```html
<!-- Stage 3: Streak Hero Banner -->
<div id="stage3-streak-hero" class="p-4 sm:p-5 rounded-2xl bg-brand-dark/80 border border-brand-amber/30 space-y-4 mb-4">
    <!-- Row 1: Streak Stats -->
    <div class="grid grid-cols-3 gap-3">
        <div class="text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono" id="streak-current">0</div>
            <div class="text-[10px] uppercase font-bold text-brand-amber tracking-wider">Chuỗi Hiện Tại</div>
        </div>
        <div class="text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono" id="streak-longest">0</div>
            <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kỷ Lục</div>
        </div>
        <div class="text-center">
            <div class="text-2xl sm:text-3xl font-extrabold text-white font-mono" id="streak-total-days">0</div>
            <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng Ngày</div>
        </div>
    </div>
    <!-- Row 2: Progress Bar to Next Badge -->
    <div class="space-y-1.5">
        <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-400 font-medium" id="streak-next-label">🎯 Mục tiêu: Hạt Mầm Hạnh Phúc</span>
            <span class="font-mono font-bold text-brand-amber" id="streak-progress-text">0/7 ngày</span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div id="streak-progress-bar" class="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 transition-all duration-700 shadow-lg shadow-orange-500/30" style="width: 0%"></div>
        </div>
        <p class="text-[10px] text-slate-400" id="streak-countdown-text"></p>
    </div>
    <!-- Row 3: Badges Showcase -->
    <div class="flex items-center justify-center gap-4" id="streak-badges-row">
        <!-- Rendered by JS -->
    </div>
</div>
```

---

## 5. THAY ĐỔI TRONG `app.js`

### 5.1. Thêm hàm `calculateStage3Streak(habitTracker)` (trước `renderStage3View`)
Như mô tả ở mục 2.1.

### 5.2. Thêm hàm `renderStage3StreakHero(streakStats)` (trước `renderStage3View`)
- Cập nhật DOM elements: `streak-current`, `streak-longest`, `streak-total-days`
- Tính toán badge tiếp theo dựa trên `currentStreak` → cập nhật thanh tiến trình
- Render 3 huy hiệu: đã mở khóa (sáng + glow) vs chưa mở khóa (xám mờ + ổ khóa)

### 5.3. Nâng cấp phần 11.4 trong `renderStage3View` (dòng 2133-2179)
- Gọi `calculateStage3Streak()` trước khi render grid
- Nâng cấp mỗi ô trong grid thành heatmap 4 cấp độ sắc thái
- Chia grid thành 3 hàng kèm nhãn tuần
- Gọi `renderStage3StreakHero()` ở cuối

### 5.4. Schema dữ liệu — KHÔNG thay đổi
Giữ nguyên 100% cấu trúc `habitTracker` hiện có (`day_1..day_21`, mỗi ngày 5 boolean).
Streak và badge được **tính toán tại runtime** từ dữ liệu sẵn có, không lưu thêm field mới.
Điều này đảm bảo **backward-compatible** với dữ liệu của học viên đã tích checkbox trước đó.

---

## 6. VERIFICATION CHECKLIST

1. `node -c lms/app.js` → PASS (Không lỗi cú pháp)
2. Kịch bản 1 — Học viên mới: Streak = 0, 3 badge xám mờ, thanh tiến trình 0%
3. Kịch bản 2 — Tích 3/5 thói quen liên tiếp 7 ngày: Streak = 7, badge 🌱 sáng lên
4. Kịch bản 3 — Bị đứt chuỗi (ngày 8 tích < 3): currentStreak reset, longestStreak giữ 7, badge 🌱 vẫn sáng
5. Kịch bản 4 — Trọn vẹn 21 ngày: cả 3 badge sáng rực, thanh 100%, thông báo chúc mừng
6. Backward-compat: Dữ liệu `habitTracker` cũ (đã tích trước) vẫn hiển thị đúng trên heatmap mới

---

## 7. ROLLBACK

Backup trước khi sửa:
```powershell
Copy-Item lms/app.js lms/_backup_20261002/app_before_gamification.js -Force
Copy-Item lms/index.html lms/_backup_20261002/index_before_gamification.html -Force
```

---

## 8. RANH GIỚI PHÊ DUYỆT

- **Cấp độ 2:** Duyệt plan này để tiến hành chỉnh sửa `lms/app.js` và `lms/index.html` kèm kiểm thử cục bộ.
- **Cấp độ 3:** Chỉ xin phê duyệt riêng trước khi thực hiện `git add`, `git commit` và `git push`.

---
---

# PROMPT GỬI AGENT KHÁC

Dưới đây là prompt copy-paste hoàn chỉnh:

---

```text
RULE_SENTINEL_DZU: đã đọc kỹ rule nghe sếp Dzũ

## NHIỆM VỤ
Nâng cấp Bảng Điểm Danh 21 Ngày Chặng 3 trong DHM Blended LMS thành hệ thống
Gamification đầy đủ: Streak Engine + Bộ 3 Huy Hiệu + Heatmap 21 ô + Thanh Tiến Trình.

## BỐI CẢNH DỰ ÁN
- Workspace: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
- GitHub: https://github.com/culturecodefeedforward/DeliveringHappiness.git (branch main)
- Live URL: https://delivering-happiness.vercel.app/lms/
- Tech stack: Vanilla JS + HTML + Tailwind CSS CDN (không framework nào khác)

## KẾ HOẠCH ĐÃ ĐƯỢC DUYỆT
Đọc kỹ plan đã duyệt tại:
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\Implementation Plan\plan_20261002_gamification_stage3.md

## KIẾN TRÚC THAM CHIẾU
Nghiên cứu 3 file mã nguồn gốc của dự án READ10 Community Tracker để hiểu logic đếm
chuỗi, huy hiệu và giao diện Streak Hero:
1. C:\Users\vu.hoang\.gemini\antigravity\scratch\read10-community-tracker\src\engine\streakEngine.ts
2. C:\Users\vu.hoang\.gemini\antigravity\scratch\read10-community-tracker\src\engine\badges.ts
3. C:\Users\vu.hoang\.gemini\antigravity\scratch\read10-community-tracker\src\components\StreakHero.tsx

## FILE ALLOWLIST (Chỉ được sửa 2 file này)
1. lms/app.js — Thêm calculateStage3Streak(), renderStage3StreakHero(), nâng cấp
   phần 11.4 Render 21-Day Habit Tracker Grid (dòng 2133-2179)
2. lms/index.html — Thêm DOM cho Streak Hero Banner bên trong
   id="stage3-tracker-section", TRƯỚC id="habit-tracker-grid"

## CẤM TUYỆT ĐỐI
- Không sửa file ngoài allowlist (curriculum_data.json, styles.css, roster files,
  practice-abcde, chat-abcde, v.v.)
- Không bịa đặt tên tuổi/chức danh nhân sự
- Không thay đổi schema dữ liệu habitTracker trong localStorage (giữ backward-compat)
- Không cài thêm package/thư viện bên ngoài

## YÊU CẦU KỸ THUẬT CHI TIẾT

### A. Hàm calculateStage3Streak(habitTracker) → object
- Đặt trước renderStage3View trong app.js
- Input: habitTracker (object day_1..day_21, mỗi ngày 5 boolean)
- Ngày "hoàn thành" = tích ≥ 3/5 thói quen (mindfulness, gratitude, optimism, flow, altruism)
- Output: { currentStreak, longestStreak, totalCompletedDays, completedDaysSet }
- currentStreak: đếm ngày liên tiếp từ ngày cao nhất đã hoàn thành đếm lùi xuống
- longestStreak: chuỗi liên tiếp dài nhất trong toàn bộ 21 ngày (bảo toàn vĩnh viễn)

### B. Hàm renderStage3StreakHero(streakStats) → void
Cập nhật các DOM elements trong Streak Hero Banner:
- id="streak-current" → streakStats.currentStreak
- id="streak-longest" → streakStats.longestStreak
- id="streak-total-days" → streakStats.totalCompletedDays
- id="streak-badges-row" → Render 3 huy hiệu:
  * 🌱 Hạt Mầm Hạnh Phúc (7 ngày) — sáng nếu longestStreak ≥ 7
  * 🌿 Cây Kỷ Luật Vươn Mình (14 ngày) — sáng nếu longestStreak ≥ 14
  * 🏆 Đại Sứ Hạnh Phúc (21 ngày) — sáng nếu longestStreak ≥ 21
  * Huy hiệu chưa đạt: opacity-40 + grayscale + text "🔒"
  * Huy hiệu đã đạt: full color + glow shadow + text tên huy hiệu
- Thanh tiến trình + đếm ngược đến huy hiệu kế tiếp chưa mở khóa:
  * progressPercent = (currentStreak / nextBadgeDays) * 100
  * Text: "Chỉ còn X ngày nữa để mở khóa [tên huy hiệu]!"
  * Nếu đã đạt hết 3 badge: "🏆 Trọn vẹn 21 ngày chuyển hóa! Bạn là Đại Sứ Hạnh Phúc!"

### C. Nâng cấp grid 21 ô thành Heatmap 3 tuần
Thay thế phần 11.4 (dòng 2133-2179) trong renderStage3View:
- Chia thành 3 khối (tuần), mỗi khối có nhãn:
  * Tuần 1 (Ngày 1-7): "🌱 Tuần Gieo Mầm"
  * Tuần 2 (Ngày 8-14): "🌿 Tuần Vươn Mình"
  * Tuần 3 (Ngày 15-21): "🏆 Tuần Chuyển Hóa"
- Mỗi ô (dayCard) đổi màu nền theo 4 cấp độ sắc thái:
  * 0/5: bg-slate-800/60 border-slate-700/40 (xám tối)
  * 1-2/5: bg-amber-900/40 border-amber-700/30 (hổ phách nhạt)
  * 3-4/5: bg-amber-600/40 border-amber-500/40 (hổ phách đậm)
  * 5/5: bg-brand-green/30 border-brand-green/50 shadow-sm shadow-green-500/20 (xanh glow)
- Giữ nguyên 5 nút toggle M•G•O•F•A bên trong mỗi ô (không đổi logic toggle)
- Cuối phần 11.4, gọi calculateStage3Streak() rồi renderStage3StreakHero()

### D. Backward-Compatible (Tương thích ngược)
- KHÔNG thêm field mới vào schema habitTracker trong localStorage
- Streak và badge tính toán tại runtime từ dữ liệu checkbox sẵn có
- Dữ liệu của học viên đã tích trước đó vẫn hiển thị đúng trên heatmap mới

## QUY TRÌNH THỰC THI

### Bước 1: Backup
Copy-Item lms/app.js lms/_backup_20261002/app_before_gamification.js -Force
Copy-Item lms/index.html lms/_backup_20261002/index_before_gamification.html -Force

### Bước 2: Thêm DOM vào index.html
Tìm id="stage3-tracker-section" trong lms/index.html.
Chèn Streak Hero Banner HTML (xem plan mục 4) VÀO BÊN TRONG section đó,
TRƯỚC id="habit-tracker-grid".

### Bước 3: Thêm hàm JS vào app.js
Thêm calculateStage3Streak() và renderStage3StreakHero() TRƯỚC hàm renderStage3View()

### Bước 4: Nâng cấp phần 11.4 trong renderStage3View
Thay thế block render grid (dòng 2133-2179) bằng Heatmap 3 tuần + gọi streak engine

### Bước 5: Kiểm thử cục bộ
1. node -c lms/app.js → PASS
2. Kiểm tra DOM: Streak Hero Banner render đúng trong Stage 3
3. Kiểm tra backward-compat: habitTracker cũ hiển thị đúng

### Bước 6: BÁO CÁO & CHỜ DUYỆT
Không được git commit, push hay deploy. Báo cáo kết quả kiểm thử và chờ
User cấp phê duyệt Cấp độ 3 riêng.

## LƯU Ý QUAN TRỌNG
- Đọc kỹ SHARED_AGENT_RULES.md tại: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md
- Sentinel Gate bắt buộc ở đầu mọi phản hồi
- UTF-8 read-back sau mỗi lần ghi file
- Không claim "đã xong" nếu chưa chạy node -c verification
```
