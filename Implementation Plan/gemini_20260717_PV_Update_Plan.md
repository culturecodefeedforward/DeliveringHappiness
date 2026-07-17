# Kế hoạch Triển khai: Cập nhật Personal Value Compass (v2 — Full Scope)

**Ngày:** 2026-07-17  
**Người yêu cầu:** Sếp Dzũ  
**Trạng thái:** ⏳ Chờ Plan Approval Cấp độ 2

---

## Tóm tắt Scope (Phạm vi thay đổi)

| # | Yêu cầu | Files | Risk |
|---|---|---|---|
| YC-1 | Thay Schwartz bằng "Ý Nghĩa La Bàn Giá Trị" | `personal-value.html`, `personal-value.js`, `Scripts/active_code_gs_final.js` | 🔴 HIGH (GAS live) |
| YC-2 | Đảo wording bước So sánh Đối kháng | `personal-value.html`, `personal-value.js` | 🟡 MED |
| YC-3 | Thêm hình định nghĩa + text nhấn mạnh vào Bước 2 | `personal-value.html`, `assets/` | 🟢 LOW |

> [!CAUTION]
> **YC-1 phần GAS** là thay đổi HIGH RISK vì `Scripts/active_code_gs_final.js` là backend đang xử lý đồng thời email DHM8/DHM9 + đăng ký + thanh toán thật. Cần approve Cấp độ 3 riêng cho `clasp push`.

---

## Nguồn nội dung thay thế Schwartz

File gốc: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\personal_value_explanation_20260717.txt`

3 điểm ý nghĩa:
1. **Con người thật vs. Giá trị tuyên bố** — La bàn + Đồng hồ = Giá trị thực tế
2. **Thời khắc quyết định (Critical Decision Moments)** — 21 trận đối kháng mô phỏng giằng xé cuộc sống
3. **Sự đồng bộ (Alignment) & Cảm giác thuộc về chân thật** — Tìm điểm giao thoa với gia đình, tổ chức

---

## YC-1: Thay Schwartz bằng "Ý Nghĩa La Bàn Giá Trị"

### 1a. `personal-value.html` — Bước 4 (Kết quả)

**Vị trí:** Line 713–716 — xóa comment cũ + nội dung `#schwartzDimensionsCard`, thay bằng block mới.

```diff
- <!-- Nhóm động lực Schwartz (Được tính toán và hiển thị trực quan) -->
- <div id="schwartzDimensionsCard" style="background: white; border: 1px solid rgba(0,0,0,0.04); border-radius: 20px; padding: 1.5rem; margin-bottom: 2rem; text-align: left; box-shadow: 0 4px 16px rgba(0,0,0,0.01);">
-   <!-- Dynamic details injected via JS -->
- </div>
+ <!-- Ý Nghĩa La Bàn Giá Trị Cốt Lõi — Thay thế Schwartz 2026-07-17 -->
+ <div class="pv-explanation-box" style="background: white; border: 1px solid rgba(0,0,0,0.04); border-radius: 20px; padding: 1.5rem 1.8rem; margin-bottom: 2rem; text-align: left; box-shadow: 0 4px 16px rgba(0,0,0,0.01);">
+   <h3 style="color: var(--warm-orange, #ea580c); margin-top: 0; margin-bottom: 1rem; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
+     💡 Ý Nghĩa La Bàn Giá Trị Của Bạn
+   </h3>
+   <p style="color: var(--mid, #44403c); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.2rem;">
+     Chúc mừng bạn đã hoàn thành cuộc đối thoại nội tâm sâu sắc. La bàn trên không chỉ là những từ ngữ hoa mỹ, mà là tấm bản đồ định hình cuộc sống của bạn dựa trên các nguyên lý cốt lõi của <strong>Delivering Happiness</strong>:
+   </p>
+   <ul style="padding-left: 1.2rem; margin: 0; color: var(--dark, #1c1917); font-size: 0.95rem; line-height: 1.65; display: flex; flex-direction: column; gap: 0.8rem;">
+     <li><strong>Con người thật vs. Giá trị tuyên bố:</strong> Bài test đối kháng bắt buộc bạn phải đưa ra lựa chọn thực tế thay vì những "giá trị tuyên bố" lý thuyết. Hãy nhớ công thức: <em>La bàn (Định hướng) + Đồng hồ (Thời gian) = Giá trị thực tế của bạn</em>. Thừa nhận giá trị thật giúp bạn cởi bỏ áp lực phải gồng mình diễn vai hoàn hảo trước kỳ vọng xã hội.</li>
+     <li><strong>Thời khắc quyết định (Critical Decision Moments):</strong> 21 trận đối kháng bạn vừa vượt qua chính là mô phỏng những tình huống giằng xé trong cuộc sống. Bản chất thực sự của chúng ta không bộc lộ qua lời nói lúc bình yên, mà phát lộ rõ ràng nhất khi ta buộc phải hy sinh điều này để giữ lại điều quan trọng hơn.</li>
+     <li><strong>Sự đồng bộ (Alignment) & Cảm giác thuộc về chân thật:</strong> Thấu hiểu giá trị bản thân giúp bạn dễ dàng tìm kiếm điểm giao thoa (alignment) với giá trị của gia đình, tổ chức hay cộng đồng. Bạn không cần phải giống hệt môi trường xung quanh, mà chỉ cần tìm thấy sự đồng điệu để làm việc an vui và đạt được cảm giác thuộc về chân thật (True Belonging).</li>
+   </ul>
+ </div>
```

**PDF:** Tự động — `html2pdf.js` capture `#resultReportCard` bao gồm card mới này. Không cần sửa thêm.

---

### 1b. `personal-value.js` — Comment out Schwartz functions

**Line 502–503:** Comment out lời gọi `renderSchwartzDimensions(ranked)`:
```diff
-   // Tính toán và hiển thị nhóm động lực Schwartz
-   renderSchwartzDimensions(ranked);
+   // [DISABLED 2026-07-17] Schwartz đã được thay bằng card Ý Nghĩa La Bàn trong HTML
+   // renderSchwartzDimensions(ranked);
```

**Line 594–666:** Comment out toàn bộ function `renderSchwartzDimensions()` bằng block comment `/* ... */`

---

### 1c. `Scripts/active_code_gs_final.js` — Thay Schwartz trong email

**VERIFIED code path:**
- Line 1931: `var dimensions = calculateSchwartzDimensions(parsedRanked);`
- Lines 1933–1943: `var dimensionsHtml = '...'` — block Schwartz HTML
- Line 1952: `dimensionsHtml +` — inject vào `htmlBody`

**Thay đổi:**

**Bước A** — Comment out lines 1931 + 1933–1943 (Schwartz calculation + HTML):
```diff
- var dimensions = calculateSchwartzDimensions(parsedRanked);
- var dimensionsHtml = '<div style=...>...</div>';
+ // [DISABLED 2026-07-17] Schwartz thay bằng Ý Nghĩa La Bàn
+ // var dimensions = calculateSchwartzDimensions(parsedRanked);
```

**Bước B** — Thay `dimensionsHtml +` ở line 1952 bằng block mới từ Mục 2 của txt file, đặt SAU bảng xếp hạng và TRƯỚC CTA:

```javascript
// [MỚI] Ý Nghĩa La Bàn Giá Trị — thay thế Schwartz
var explanationHtml =
  '<div style="background-color: #ffffff; border: 1px solid #f3f3f3; border-radius: 12px; padding: 20px; margin-top: 25px; text-align: left; font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">' +
  '<h3 style="color: #ea580c; margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: bold;">💡 Ý Nghĩa La Bàn Giá Trị Của Bạn</h3>' +
  '<p style="margin-bottom: 15px;">Chúc mừng bạn đã hoàn thành cuộc đối thoại nội tâm sâu sắc. La bàn giá trị này định hình cuộc sống của bạn dựa trên các nguyên lý cốt lõi của Delivering Happiness:</p>' +
  '<ul style="padding-left: 20px; margin: 0;">' +
  '<li style="margin-bottom: 10px;"><strong>Con người thật vs. Giá trị tuyên bố:</strong> Bài test đối kháng bắt buộc bạn phải đưa ra lựa chọn thực tế thay vì những "giá trị tuyên bố" lý thuyết. Hãy nhớ công thức: <em>La bàn (Định hướng) + Đồng hồ (Thời gian) = Giá trị thực tế của bạn</em>. Thừa nhận giá trị thật giúp bạn cởi bỏ áp lực phải gồng mình diễn vai hoàn hảo.</li>' +
  '<li style="margin-bottom: 10px;"><strong>Thời khắc quyết định (Critical Decision Moments):</strong> 21 trận đối kháng bạn vừa vượt qua chính là mô phỏng những tình huống giằng xé trong cuộc sống. Bản chất thực sự của chúng ta không bộc lộ qua lời nói lúc bình yên, mà phát lộ rõ ràng nhất khi ta buộc phải hy sinh điều này để giữ lại điều quan trọng hơn.</li>' +
  '<li style="margin-bottom: 10px;"><strong>Sự đồng bộ (Alignment) & Cảm giác thuộc về chân thật:</strong> Thấu hiểu giá trị bản thân giúp bạn dễ dàng tìm kiếm điểm giao thoa (alignment) với giá trị của gia đình, tổ chức hay cộng đồng để làm việc an vui và đạt được cảm giác thuộc về chân thật (True Belonging).</li>' +
  '</ul>' +
  '</div>';
```

Trong `htmlBody`, đổi vị trí:
```diff
- dimensionsHtml +
+ explanationHtml +   // đặt SAU valuesHtml, TRƯỚC CTA block
```

> [!WARNING]
> `calculateSchwartzDimensions` function (line ~1860–1903) vẫn giữ nguyên — không xóa để không gây lỗi nếu có code khác gọi. Chỉ ngưng gọi trong `sendPersonalValuesEmail`.

---

## YC-2: Đảo Wording Bước So sánh Đối kháng

### `personal-value.html` — Bước 3

| Vị trí | Nội dung cũ | Nội dung mới |
|---|---|---|
| Line 623 — tiêu đề bước | `Bước 3: Trực giác quyết định` | `Bước 3: Đây là lúc xác định những giá trị nào thật sự là quan trọng nhất của bạn` |
| Line 632 — label giữa 2 thẻ | `TÌNH HUỐNG GIẰNG XÉ` | `GIỮ GIÁ TRỊ NÀO?` |
| Line 634 — placeholder tĩnh | `Nếu bạn phải hi sinh [A] để giữ được [B]...` | `Giữa việc [A] và việc [B], bạn sẽ GIỮ LẠI điều nào?` |

### `personal-value.js` — Line 442 (dynamic conflict scenario)

```diff
- conflictScenario.innerHTML = `Giữa việc <strong ...>${pair[0].context}</strong> và việc <strong ...>${pair[1].context}</strong>, bạn sẽ nhượng bộ điều gì để giữ lại điều kia?`;
+ conflictScenario.innerHTML = `Giữa việc <strong style="color:var(--warm-orange);">${pair[0].context}</strong> và việc <strong style="color:var(--warm-orange);">${pair[1].context}</strong>, bạn sẽ <strong>GIỮ LẠI</strong> điều nào?`;
```

### Nút duel card — CSS compact

Thêm inline style vào `#duelA` và `#duelB` (hoặc class `duel-card` trong `styles.css`):
```css
.duel-card {
  width: fit-content;
  min-width: 120px;
  max-width: 220px;
  padding: 0.7rem 1.2rem;
  /* giữ nguyên các style khác */
}
```

---

## YC-3: Thêm Hình Định Nghĩa + Text Nhấn Mạnh vào Bước 2

### Copy ảnh vào project

- Nguồn: `C:\Users\vu.hoang\.gemini\antigravity\brain\tempmediaStorage\media__1784273679629.png`
- Đích: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\assets\core_values_definition.png`

### `personal-value.html` — Sau Line 605 (sau `</p>` mô tả bước 2, trước `#topValuesList`)

```html
<!-- [MỚI YC-3] Hình định nghĩa giá trị cốt lõi + text nhấn mạnh -->
<div style="padding: 0 1.5rem; max-width: 800px; margin: 0 auto 1.5rem auto; text-align: center;">
  <img
    src="assets/core_values_definition.png"
    alt="Định nghĩa Giá trị Cốt lõi — Motivator, Moral, Guidance, Importance, Action"
    style="width: 100%; max-width: 680px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); display: block; margin: 0 auto 1rem auto;"
  />
  <p style="font-size: 0.95rem; color: var(--warm-orange); font-weight: 700; line-height: 1.6; background: rgba(245,158,11,0.06); border-left: 3px solid var(--warm-orange); padding: 0.8rem 1.2rem; border-radius: 0 12px 12px 0; text-align: left; margin: 0 auto; max-width: 680px;">
    💡 Hãy xem lại những tiêu chí này khi chọn lựa giá trị cá nhân mà bạn tin rằng <strong>Rất quan trọng</strong> với bản thân mình
  </p>
</div>
```

---

## Danh sách file thay đổi (Allowlist)

| File | Loại | Ghi chú |
|---|---|---|
| `personal-value.html` | MODIFY | YC-1a + YC-2 + YC-3 |
| `personal-value.js` | MODIFY | YC-1b + YC-2 JS |
| `Scripts/active_code_gs_final.js` | MODIFY | YC-1c — HIGH RISK |
| `assets/core_values_definition.png` | NEW (copy) | YC-3 |

**Không chạm:** `api/`, `vercel.json`, `.env`, `register*.html`, DB, scheduler

---

## Kế hoạch Kiểm chứng (Verification Plan)

### Giai đoạn 1 — Local (trước khi commit)
1. `node --check personal-value.js` → syntax OK
2. Mở `personal-value.html` local, test flow đầy đủ:
   - Step 2: Hình + text nhấn mạnh hiển thị trước grid
   - Step 3: Tiêu đề mới, label "GIỮ GIÁ TRỊ NÀO?", câu hỏi đúng, nút compact
   - Step 4: Schwartz biến mất, card "Ý Nghĩa La Bàn" xuất hiện đúng vị trí
3. Tải PDF: Xác nhận card mới có trong PDF, Schwartz không còn

### Giai đoạn 2 — Deploy & UAT live (Cần approve Cấp độ 3 riêng)
4. `git commit` + `git push` → Vercel auto-deploy
5. Browser UAT trên live URL (desktop 1440px + mobile 375px)
6. `clasp push` cho GAS → **Approve Cấp độ 3 riêng trước**
7. Test email PV: Xác nhận block "Ý Nghĩa La Bàn" xuất hiện trong email, Schwartz không còn

---

## Kế hoạch Quay lui (Rollback Plan)

| Tầng | Cách rollback |
|---|---|
| Frontend local | `git checkout -- personal-value.html personal-value.js` |
| Vercel | Revert commit hoặc dùng Vercel Dashboard → Instant Rollback |
| GAS | Deploy lại phiên bản GAS trước trên Apps Script Console (không mất dữ liệu Sheets) |

---

## Ranh giới Phê duyệt (Approval Boundary)

| Hành động | Cấp | Trạng thái |
|---|---|---|
| Sửa `personal-value.html`, `personal-value.js`, copy ảnh | Cấp độ 2 | ⏳ Chờ sếp "OK/Approve" |
| Sửa `Scripts/active_code_gs_final.js` | Cấp độ 2 | ⏳ Chờ sếp "OK/Approve" |
| `git commit` + `git push` | Cấp độ 3 | 🔒 Xin riêng sau khi local UAT xong |
| `clasp push` GAS + redeploy | Cấp độ 3 | 🔒 Xin riêng — HIGH RISK |
