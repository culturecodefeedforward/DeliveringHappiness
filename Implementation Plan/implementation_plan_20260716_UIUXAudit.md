# [UI/UX Pro Max] Tổng thể giao diện HTML — v3 FINAL (Chờ Plan Approval Cấp độ 2)

Thực hiện kiểm tra và nâng cấp toàn bộ giao diện của các tệp HTML trong dự án theo bộ quy chuẩn `ck:ui-ux-pro-max`.

**Claim level:** `VERIFIED source scan` — Đã xác minh bằng việc đọc trực tiếp file source (`personal-value.html`, `chat-abcde.js`, `personal-value.js`, `chat-abcde.css`). Chưa có browser evidence. **Không được claim "UI verified"** sau khi sửa code nếu chưa chạy UAT Browser.

**Lịch sử phản biện:**
- Round 1/3 (Codex): Bổ sung modal semantics, reduced-motion, scope denylist
- Round 2/3 (Codex): Chốt sr-only cho label, allowlist register files, sửa target CSS sang `chat-abcde.css`
- Round 3/3: Plan Final — xin Plan Approval Cấp độ 2 từ sếp

---

## Scope Guardrails (Danh sách file được phép/cấm sửa)

> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG chạm vào các đường dẫn sau** nếu không có approval riêng từ sếp:
> - `node_modules/**`
> - `Artifacts/**`
> - `UAT/**`
> - `data/artifacts/**`
> - `index_OLD_*`
> - `index_BAK_020426.html`
> - `.env`, `vercel.json`, `package*.json`, `api/**` (bất kỳ file backend)
> - `register_direct.html`, `register-test.html`, `register_cc101.html`, `register_nvc.html`, `dh8\index.html` — để round audit riêng nếu sếp muốn

**Allowlist — File được phép sửa trong plan này (7 file):**

| File | Loại thay đổi |
|---|---|
| `personal-value.html` | Viewport meta, CSS @media reduced-motion |
| `chat-abcde.js` | Modal semantics, Escape handler, focus management, aria-live, sr-only labels |
| `personal-value.js` | customValueModal — role dialog, keyboard trap, Escape, focus return |
| `chat-abcde.css` | Touch target min-height cho `.abcde-btn-send` (VERIFIED Line 194) |
| `index.html` | Alt text cho img, aria-label cho icon buttons |
| `register.html` | Alt text cho img, label-for cho form inputs |
| `register_dh9_hanoi.html` | Alt text cho img, label-for cho form inputs |

---

## User Review Required

> [!WARNING]
> Kế hoạch này sẽ chỉnh sửa **7 file** (không có file backend, không có DB/deploy). Sếp vui lòng xem qua các hạng mục bên dưới. Nếu đồng ý, trả lời **"Approve"** để tôi bắt đầu thực thi và tạo Checklist theo dõi.

---

## Proposed Changes (Thay đổi đề xuất)

### 1. Viewport & Khả năng Thu phóng (Accessibility — Lỗi CRITICAL)

**Vấn đề (VERIFIED):** `personal-value.html` Line 6 — thẻ meta viewport chặn thu phóng (`maximum-scale=1.0, user-scalable=no`). Vi phạm WCAG 1.4.4 và Apple HIG.

#### [MODIFY] personal-value.html
- Đổi thẻ `<meta name="viewport">` thành: `content="width=device-width, initial-scale=1.0"`
- **Chỉ sửa dòng 6.** Không sửa thêm bất cứ gì trong block `<head>`.

---

### 2. Modal & Dialog Semantics — ABCDE Chatbox (Accessibility — Lỗi CAO)

**Vấn đề (VERIFIED source scan):** `chat-abcde.js` — hàm `createChatboxDOM()` (Line 58-106):
- `div.abcde-modal-overlay` thiếu `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Nút đóng chỉ có ký tự `×`, thiếu `aria-label`
- `closeChatbox()` (Line 52-56) không có `Escape` listener và không trả focus về nút mở
- `updateStatus()` và `appendMessage()` thay đổi nội dung động nhưng chưa có `aria-live`
- Form inputs `#passcodeInput`, `#studentName`, `#studentEmail` không có `<label>` liên kết

#### [MODIFY] chat-abcde.js
- Trong `createChatboxDOM()`:
  - Thêm `role="dialog"`, `aria-modal="true"`, `aria-labelledby="abcdeChatModalTitle"` cho `modalOverlay`
  - Thêm `id="abcdeChatModalTitle"` vào thẻ `h3`
  - Thêm `aria-label="Đóng cửa sổ thực hành ABCDE"` cho `abcdeCloseBtn`
  - Thêm `aria-live="polite"` cho `#abcdeStatusLabel` và `#abcdeChatBody`
- Khai báo biến module-level `let _lastFocusedEl = null;`
- Trong `openChatbox()`: gán `_lastFocusedEl = document.activeElement;` trước khi `classList.add("abcde-active")`
- Trong `closeChatbox()`: sau khi `classList.remove("abcde-active")`, gọi `_lastFocusedEl?.focus()`
- Sau vòng bind event listeners trong `createChatboxDOM()`: thêm document-level `keydown` listener — nếu modal đang active (`modalOverlay.classList.contains("abcde-active")`) và `e.key === "Escape"` thì gọi `closeChatbox()`
- Trong `renderPasscodeForm()`: thêm `<label class="sr-only" for="passcodeInput">Mật mã lớp học</label>` trước input `#passcodeInput`
- Trong `renderSubmitForm()`: thêm `<label class="sr-only" for="studentName">Họ và tên</label>` và `<label class="sr-only" for="studentEmail">Địa chỉ Email nhận báo cáo</label>` trước các input tương ứng

> **Lưu ý sr-only (screen-reader only — chỉ hiển thị cho trình đọc màn hình):** Label ẩn trên giao diện người dùng thường, chỉ được đọc bởi screen reader. CSS class `.sr-only` cần được thêm vào `chat-abcde.css` (xem Mục 6).

---

### 3. Modal & Dialog Semantics — customValueModal (Accessibility — Lỗi CAO)

**Vấn đề (VERIFIED source scan):** `personal-value.js` — `initCustomValueModal()` (Line 156-219):
- `#customValueModal` mở bằng `classList.add('active')` nhưng thiếu `role="dialog"`, `aria-modal="true"`
- Không có `Escape` handler
- Không có keyboard focus trap (Tab có thể thoát ra ngoài modal)
- Đóng modal không trả focus về `#btnAddCustom`

#### [MODIFY] personal-value.js
- Đầu hàm `initCustomValueModal()`, sau khi lấy ref `customValueModal`:
  - `customValueModal.setAttribute('role', 'dialog')`
  - `customValueModal.setAttribute('aria-modal', 'true')`
  - `customValueModal.setAttribute('aria-labelledby', 'customValueModalTitle')` *(cần thêm `id="customValueModalTitle"` vào tiêu đề modal trong HTML — xem Mục 3a)*
- Khai báo `let _lastFocusEl = null;` ở đầu scope hàm
- `btnAddCustom.onclick`: gán `_lastFocusEl = document.activeElement;` trước `classList.add('active')`. Sau khi add active, gọi `inputName.focus()`
- `btnCancelCustom.onclick` và click-outside handler: sau `classList.remove('active')`, gọi `_lastFocusEl?.focus()`
- Thêm `keydown` listener trên `customValueModal`: `e.key === 'Escape'` → `classList.remove('active')` + `_lastFocusEl?.focus()`
- Thêm focus trap cơ bản: `e.key === 'Tab'` khi focus ở phần tử cuối → cycle về `inputName`

#### 3a. [MODIFY] personal-value.html
- Thêm `id="customValueModalTitle"` vào thẻ tiêu đề bên trong `#customValueModal` (để khớp với `aria-labelledby` bên trên)

---

### 4. Reduced Motion — CSS Animation Guard

**Vấn đề (VERIFIED):** `personal-value.html` có flip animation và `.blinking` không có fallback cho `prefers-reduced-motion: reduce`.

#### [MODIFY] personal-value.html (cuối block `<style>` inline)
```css
@media (prefers-reduced-motion: reduce) {
  .flip-card-inner { transition: none; }
  .blinking { animation: none; }
}
```

---

### 5. Responsive Images — Chỉ Target Cụ thể (KHÔNG đại trà)

**Vấn đề:** Một số `<img>` trong `index.html`, `register.html`, `register_dh9_hanoi.html` có hardcoded width có thể vỡ layout trên màn hình nhỏ.

> [!IMPORTANT]
> **GUARDRAIL max-width (bắt buộc):** Chỉ áp `max-width: 100%` cho `img`, `video`, `canvas`, `.embed-container`.
> **TUYỆT ĐỐI KHÔNG** áp cho:
> - `.matrix-table`, `.matrix-table-wrapper` — scroll ngang có chủ đích (VERIFIED `personal-value.html` Line 449-462)
> - `.flip-card`, `.flip-card-inner`, `.flip-card-front`, `.flip-card-back` — dùng `position: absolute` (vỡ layout nếu áp max-width)
> - `#resultChart` canvas — đã có `max-width: 100%` inline (VERIFIED Line 616, không sửa)

#### [MODIFY] index.html / register.html / register_dh9_hanoi.html
- Rà soát thủ công từng `<img>` có inline `width` → thêm `style="max-width:100%; height:auto;"`
- Không dùng CSS selector wildcard `img { max-width: 100% }` (có thể ảnh hưởng icon SVG)

---

### 6. Touch Targets — Sửa đúng file CSS chứa class

**Vấn đề (VERIFIED):** `.abcde-btn-send` nằm trong `chat-abcde.css` Line 194, **không có trong `styles.css`**. Plan cũ target sai file.

> [!IMPORTANT]
> Rule touch target cho `.abcde-btn-send` phải vào `chat-abcde.css`, không phải `styles.css`.

#### [MODIFY] chat-abcde.css
- Thêm vào rule `.abcde-btn-send` (Line 194): `min-height: 44px;`
- Đảm bảo `gap` tối thiểu 8px giữa các phần tử tương tác trong `.abcde-input-area`
- Thêm class `.sr-only` (hỗ trợ screen reader, ẩn khỏi giao diện) vào cuối file:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### [MODIFY] styles.css (nếu tồn tại)
- Chỉ rà soát `.btn`, `.btn-primary` (không phải `.abcde-btn-send`) để đảm bảo `min-height: 44px`
- Nếu `styles.css` không tồn tại hoặc không chứa `.btn`, bỏ qua mục này

---

## Verification Plan (Kế hoạch Kiểm chứng)

> [!CAUTION]
> Claim level sau khi sửa code vẫn chỉ là **VERIFIED code edit**. Chỉ được nâng lên **UI verified** sau khi hoàn thành đủ 3 bước UAT Browser dưới đây và lưu evidence vào `UAT/screenshots/`.

### Bước 1 — Browser Evidence (Bắt buộc, lưu `UAT/screenshots/`)
- Viewport 375px (mobile) và 1440px (desktop): `personal-value.html`, `index.html`
- Kiểm tra: (a) Flip-card không vỡ; (b) Matrix table vẫn cuộn ngang; (c) Canvas radar chart không bị méo
- Chụp screenshot **trước** và **sau** khi sửa

### Bước 2 — Keyboard Focus & Modal UAT
- Chatbox ABCDE: Tab nhiều lần → focus không thoát ngoài modal; Escape → modal đóng, focus trả về nút mở
- `customValueModal`: lặp lại quy trình tương tự

### Bước 3 — Lighthouse Accessibility Score
- Chạy Lighthouse trên `personal-value.html` và `index.html`
- Target: Accessibility score >= 90
- Lưu kết quả vào `UAT/lighthouse_20260716.json` hoặc screenshot

---

## Rollback Plan (Kế hoạch Quay lui)

Nếu sau khi sửa có lỗi layout:
- Dùng `git diff` để xem thay đổi
- Dùng `git checkout -- <file>` để rollback từng file riêng lẻ mà không ảnh hưởng file khác
- Không có thay đổi DB, deploy, hay push — rollback hoàn toàn an toàn ở local

---

## Tóm tắt Scope

| Tiêu chí | Giá trị |
|---|---|
| Số file logic sẽ sửa | 7 |
| Chạm DB/deploy/push | Không |
| Chạm auth/env/token | Không |
| Cần browser UAT sau | Có (bắt buộc trước khi claim UI verified) |
| Approval cần thiết | Plan Approval Cấp độ 2 từ sếp |
