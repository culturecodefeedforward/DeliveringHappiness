# 📋 Implementation Plan — Nâng Cấp Wording, UX & Tích Hợp ABCDE cho Micro-LMS DHM

> **Ngày tạo:** 02/10/2026
> **Loại:** Implementation Plan (Kế hoạch triển khai)
> **Người duyệt:** Sếp Dzũ (Cấp độ 2 Plan Approval)
> **Source of Truth:** Báo cáo tham vấn `lms_wording_review_and_ux_proposal.md`
> **Commit baseline:** `3e24214` (branch `main`)

---

## TỔNG QUAN

3 giai đoạn triển khai tuần tự, mỗi giai đoạn verify xong mới sang giai đoạn tiếp:

| Giai đoạn | Mô tả | Files | Rủi ro |
|-----------|-------|-------|--------|
| **GĐ1** | Sửa wording text | `curriculum_data.json`, `index.html` | Low — chỉ text, không sửa logic |
| **GĐ2** | Progressive Disclosure UX | `index.html`, `app.js`, `styles.css` | Medium — sửa JS/CSS |
| **GĐ3** | Tích hợp ABCDE vào Chặng 3 | `index.html`, `app.js` | Medium — thêm section mới |

---

## FILE ALLOWLIST (Danh sách file được phép sửa)

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\styles.css
```

> **KHÔNG** được sửa: `practice-abcde.html`, `practice-abcde.js`, `chat-abcde.js`, `chat-abcde.css`, `authorized_roster.json`, `master_learners_roster.json`, bất kỳ file ngoài thư mục `lms/`.

---

## ROLLBACK PLAN

Trước khi sửa bất kỳ file nào, tạo bản backup:

```powershell
$backupDir = "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\_backup_20261002"
New-Item -ItemType Directory -Force -Path $backupDir
Copy-Item "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json" "$backupDir\"
Copy-Item "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html" "$backupDir\"
Copy-Item "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js" "$backupDir\"
Copy-Item "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\styles.css" "$backupDir\"
```

Rollback: copy ngược từ `_backup_20261002` về `lms/`.

---

## GIAI ĐOẠN 1 — SỬA WORDING (Low Risk)

### 1.1 Sửa `curriculum_data.json` — Tiêu đề Stage

| Trường | Giá trị hiện tại | Giá trị mới |
|--------|------------------|-------------|
| `stages[0].badge` | `"Mini Step 1 • Online"` | `"Chặng 1 · Online"` |
| `stages[1].badge` | `"Mini Step 2 • Offline"` | `"Chặng 2 · Workshop"` |
| `stages[2].badge` | `"Mini Step 3 • Online"` | `"Chặng 3 · Online"` |
| `stages[2].subtitle` | `"Nuôi dưỡng Thói quen Chuyển hóa • Kế thừa Toàn bộ Chất liệu • Đồng hành 21 ngày"` | `"Đồng hành 21 ngày • Nuôi dưỡng Thói quen Chuyển hóa"` |
| `stages[2].instructor` | `"Đội ngũ Giảng viên & Coach DHM Đồng Hành"` | `"Ban Giảng Huấn DHM Đồng Hành"` |

### 1.2 Sửa `curriculum_data.json` — Tiêu đề Sub-sections

**Chặng 1:**

| Hiện tại | Giá trị mới |
|----------|-------------|
| `"Mục 1.1: Video Explainer & Kho Audio Bài Giảng"` | `"Video & Audio Bài Giảng"` |
| `"Mục 1.2: ⚡ BÀI TEST SÁT HẠCH ĐẦU VÀO (10 Câu) & Khoa Học Hạnh Phúc"` | `"⚡ Bài Sát Hạch Đầu Vào"` |
| `"Mục 1.3: Định Vị La Bàn — Giá Trị Cốt Lõi Cá Nhân (Me Values)"` | `"La Bàn Giá Trị Cá Nhân"` |
| `"Mục 1.4: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc"` | `"3 Đòn Bẩy Hạnh Phúc"` |

**Chặng 2:**

| Hiện tại | Giá trị mới |
|----------|-------------|
| `"Mục 2.1: Thói Quen 1 — Tỉnh Thức (SBA & Body Scan + IAM)"` | `"🌿 Tỉnh Thức"` |
| `"Mục 2.2: Thói Quen 2 — Biết Ơn (Gratitude Card + IAM)"` | `"🙏 Biết Ơn"` |
| `"Mục 2.3: Thói Quen 3 — Lạc Quan Học Được (ABCDE + IAM)"` | `"☀️ Lạc Quan"` |
| `"Mục 2.4: Thói Quen 4 — Phiêu / Flow (Thách thức vs Kỹ năng + IAM)"` | `"🌀 Phiêu (Flow)"` |
| `"Mục 2.5: Thói Quen 5 — Vị Nhân (Adam Grant Style + IAM)"` | `"🤝 Vị Nhân"` |
| `"Mục 2.6: Thu Hoạch Tổng Lực Ngày Học (Capstone IAM)"` | `"🏆 Thu Hoạch Cuối Ngày"` |

**Chặng 3:**

| Hiện tại | Giá trị mới |
|----------|-------------|
| `"Mục 3.1: Bảng Vinh Danh Chất Liệu Đã Gieo (Recap Dashboard)"` | `"Tổng Kết Hành Trình"` |
| `"Mục 3.2: Bảng Điểm Danh 5 Thói Quen 21 Ngày (Habit Tracker)"` | `"Điểm Danh 21 Ngày"` |
| `"Mục 3.3: Đúc Kết Tuần (Weekly Check-in I•A•M)"` | `"Đúc Kết Hàng Tuần"` |
| `"Mục 3.4: Kho Tài Liệu Đính Kèm (Delivering Happiness Artifacts)"` | `"Tài Liệu & Công Cụ"` |

### 1.3 Sửa `curriculum_data.json` — Tiêu đề Habit trong Chặng 2

| Hiện tại | Giá trị mới |
|----------|-------------|
| `"Thói quen 1: Sống Tỉnh Thức & Kỹ Thuật SBA"` | `"Tỉnh Thức & Kỹ Thuật SBA"` |
| `"Thói quen 2: Biết Ơn Bền Vững (Robert Emmons)"` | `"Biết Ơn Bền Vững"` |
| `"Thói quen 3: Lạc Quan Học Được & Framework ABCDE"` | `"Lạc Quan & ABCDE"` |
| `"Thói quen 4: Thói Quen Phiêu & Trạng Thái Dòng Chảy"` | `"Phiêu & Trạng Thái Flow"` |
| `"Thói quen 5: Vị Nhân & Trao Giá Trị Không Vụ Lợi"` | `"Vị Nhân & Trao Giá Trị"` |

### 1.4 Sửa `index.html` — Nhãn tĩnh (hardcoded labels)

| Dòng ~ | Hiện tại | Sửa thành |
|--------|----------|-----------|
| 131 | `Tiến độ hành trình Blended` | `Tiến độ học tập` |
| 199 | `Chặng 1 • Pre-Class` | `Chặng 1 · Online` |
| 244 | `📘 Lộ Trình & HDSD` | `📘 Lộ Trình & Hướng Dẫn` |
| 295 | `Kho Audio Bài Giảng Gỡ Băng` | `Kho Audio Bài Giảng` |
| 296 | `Chọn tệp âm thanh bài giảng để lắng nghe chuyên sâu` | `Chọn bài giảng để nghe` |
| 316 | `📖 Tóm Tắt & Đúc Kết Cốt Lõi` | `📖 Tổng Quan` |
| 319 | `⚡ BÀI TEST SÁT HẠCH (10 CÂU) & THỰC HÀNH` | `⚡ Bài Tập & Sát Hạch` |
| 323 | `📂 Tài Liệu & Slide Đính Kèm` | `📂 Tài Liệu` |
| 338 | `BÀI KIỂM TRA SÁT HẠCH ĐẦU VÀO (10 CÂU)` | `Bài Sát Hạch Đầu Vào (10 Câu)` |
| 355 | `Luận Điểm Cốt Lõi (Core Philosophy)` | `Luận Điểm Cốt Lõi` |
| ~406+ | Tất cả `SECTION 1` / `SECTION 2` / `SECTION 3` | `PHẦN 1` / `PHẦN 2` / `PHẦN 3` |
| ~407+ | `💭 Phản Tư & Đúc Kết Tư Duy (I • A • M X.X)` | `💭 Phản Tư I·A·M` |
| ~430+ | `🏢 Tình Huống Thực Tế & Bài Tập Mẫu Gợi Ý` | `🏢 Tình Huống & Bài Mẫu` |
| ~445+ | `💡 Xem Phân Tích & Bài Tập Mẫu Gợi Ý Của Giảng Viên` | `💡 Xem Phân Tích & Gợi Ý` |
| ~451+ | `🔍 Phân tích nguyên lý (Faculty Analysis):` | `🔍 Phân tích nguyên lý:` |
| ~455+ | `🎯 Bài tập mẫu gợi ý (Model Solution):` | `🎯 Bài mẫu gợi ý:` |
| ~476+ | `🚀 Cam Kết Hành Động Thực Tế (Actionable Commitment)` | `🚀 Cam Kết Hành Động` |

> **Quan trọng:** Các label `SECTION`, `Phản Tư`, `Tình Huống`, accordion buttons lặp lại ở mỗi module/habit. Phải tìm ALL instances bằng grep, không chỉ sửa 1 chỗ.

### 1.5 Verification GĐ1

```powershell
node -e "JSON.parse(require('fs').readFileSync('curriculum_data.json','utf8')); console.log('JSON OK')"
Select-String -Path "curriculum_data.json" -Pattern "Mini Step|Explainer|Gratitude Card|Adam Grant Style|Capstone IAM" -Encoding utf8
Select-String -Path "index.html" -Pattern "SECTION 1|SECTION 2|SECTION 3|Core Philosophy|Gỡ Băng|HDSD" -Encoding utf8
```

Nếu grep trả về kết quả → còn sót, cần sửa tiếp.

---

## GIAI ĐOẠN 2 — PROGRESSIVE DISCLOSURE UX (Medium Risk)

### 2.1 Sidebar Collapsible theo Stage

**Thay đổi trong `app.js` — hàm render sidebar:**
- Bọc sub-sections mỗi Stage trong `<div class="stage-subsections">` có thể toggle
- Mặc định: chỉ mở Stage đang học, 2 Stage kia collapsed
- Click vào stage header → toggle `display: none/block`
- Khi navigate sang stage khác → auto-collapse stage cũ, auto-expand stage mới

### 2.2 Khối "Khám Phá Thêm" cho nội dung phụ

Bọc các phần sau vào `<details class="explore-more"><summary>📖 Khám phá thêm</summary>...</details>`:

| Chặng | Phần bị thu gọn | Selector/ID |
|-------|-----------------|-------------|
| 1 | Audio Player | `#audio-player-card` |
| 1 | Deep Scientific Content | `#summary-deep-content-container` |
| 2 | Audio Player (Stage 2) | `#audio-player-card` |
| 2 | Habits Science mỗi thói quen | habitsScience rendered sections |
| 3 | Flashcards | flashcard deck section |
| 3 | Infographic Tổng Kết | infographicSummary section |

### 2.3 Thu gọn Tình Huống Case Study

Hiện tại: mô tả tình huống luôn hiện, chỉ "Phân tích & Gợi ý" là accordion.
Đề xuất: cả block tình huống chỉ hiện tiêu đề 1 dòng, bấm để mở context + accordion.

### 2.4 CSS cho `<details>` trong `styles.css`

```css
details.explore-more > summary {
    cursor: pointer;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.2);
    color: #fbbf24;
    font-weight: 600;
    font-size: 0.8rem;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
details.explore-more > summary::before {
    content: '▸';
    transition: transform 0.2s;
}
details.explore-more[open] > summary::before {
    transform: rotate(90deg);
}
```

### 2.5 Verification GĐ2

```powershell
node -c lms/app.js
```

Checklist:
- [ ] Sidebar: chỉ Chặng hiện tại mở, 2 Chặng kia thu gọn
- [ ] Click Chặng khác → mở ra, Chặng cũ thu lại
- [ ] Audio ẩn trong "Khám phá thêm"
- [ ] Deep Insights ẩn trong "Khám phá thêm"
- [ ] Tình huống chỉ hiện tiêu đề, click mở chi tiết
- [ ] Flashcards ẩn trong "Khám phá thêm"
- [ ] Mobile: tất cả hoạt động bình thường

---

## GIAI ĐOẠN 3 — TÍCH HỢP ABCDE VÀO CHẶNG 3 (Medium Risk)

### 3.1 Thêm 2 section mới trong nội dung Chặng 3

Vị trí: sau "6 Tình Huống Thực Hành Mẫu", trước Flashcards.

**Section A — "Tự Giải Tình Huống Mẫu" (Duy #1):**
- Mô tả: "Chọn một tình huống từ ngân hàng 50+ case study, tự phân tích B-C-D-E rồi đối chiếu với gợi ý của khóa học."
- Nút CTA: `🎯 Mở Xưởng Thực Hành ABCDE ➔` → mở `../practice-abcde.html` (tab mới)

**Section B — "Phân Tích Tình Huống Của Tôi" (Duy #2):**
- Mô tả: "Đưa ra tình huống thực tế của bạn, chương trình dẫn dắt từng bước A→B→C→D→E và gợi ý bổ sung."
- Nút CTA: `☀️ Bắt Đầu Phân Tích Tình Huống Của Tôi` → gọi chatbox từ `chat-abcde.js`

**Kiểm tra trước:** xem `chat-abcde.js` + `chat-abcde.css` đã load trong LMS `index.html` chưa. Nếu chưa, thêm `<script>` và `<link>` tags.

### 3.2 Thêm sub-sections mới vào `curriculum_data.json`

Thêm vào `stages[2].subSections[]`:
```json
{ "id": "sub-3-5", "title": "🎯 Tự Giải Tình Huống Mẫu", "target": "stage3-practice-solve", "tab": "tab-practice" },
{ "id": "sub-3-6", "title": "☀️ Phân Tích Tình Huống Của Tôi", "target": "stage3-my-scenario", "tab": "tab-practice" }
```

### 3.3 Verification GĐ3

- [ ] Nút "Mở Xưởng Thực Hành ABCDE" → mở `practice-abcde.html`
- [ ] Nút "Phân Tích Tình Huống Của Tôi" → mở Socratic Chatbox modal
- [ ] Chatbox hoạt động (nhập A → nhận gợi ý B...)
- [ ] Sidebar hiện 2 mục mới trong Chặng 3
- [ ] Mobile: 2 nút CTA hiển thị đúng

---

## APPROVAL BOUNDARY

| Hành động | Cấp độ |
|-----------|--------|
| Sửa file trong allowlist | Cấp độ 2 (cần duyệt plan này) |
| `node -c`, `JSON.parse`, grep verify | Cấp độ 1 (read-only, tự chạy) |
| `git add`, `git commit`, `git push` | ⛔ Cấp độ 3 — xin riêng sau verify |
| Deploy / verify live Vercel | ⛔ Cấp độ 3 — xin riêng |

## STOP CONDITIONS

- JSON parse fail → dừng, rollback, báo lỗi
- `node -c app.js` fail → dừng, rollback, báo lỗi
- Wording cũ còn sót (grep phát hiện) → sửa tiếp trước khi qua GĐ tiếp
- Mobile UI bị vỡ layout → dừng, rollback
- Chatbox không mở được → dừng, kiểm tra script load order
