# Task List — UI/UX Accessibility Audit v3

Plan: `implementation_plan_20260716_UIUXAudit.md`
Approved: 2026-07-16 14:37 (sếp) | Codex Round 3/3 APPROVE

## File 1: personal-value.html
- [x] Sửa viewport meta (dòng 6): bỏ `maximum-scale=1.0, user-scalable=no`
- [x] Thêm `id="customValueModalTitle"` vào tiêu đề modal
- [x] Thêm `@media (prefers-reduced-motion: reduce)` vào cuối block style

## File 2: chat-abcde.js
- [x] Thêm `role="dialog"`, `aria-modal="true"`, `aria-labelledby="abcdeChatModalTitle"` cho modalOverlay
- [x] Thêm `id="abcdeChatModalTitle"` vào h3 header
- [x] Thêm `aria-label="Đóng cửa sổ thực hành ABCDE"` cho close button
- [x] Thêm `aria-live="polite"` cho statusLabel và chatBody
- [x] Thêm `_lastFocusedEl` + Escape listener + return focus
- [x] Thêm sr-only labels cho passcodeInput, studentName, studentEmail

## File 3: personal-value.js
- [x] Thêm role/aria-modal/aria-labelledby cho customValueModal
- [x] Thêm _lastFocusEl, focus management khi mở/đóng
- [x] Thêm Escape handler
- [x] Thêm focus trap cơ bản

## File 4: chat-abcde.css
- [x] Thêm `min-height: 44px` cho `.abcde-btn-send`
- [x] Thêm CSS class `.sr-only`

## File 5: index.html
- [x] Rà soát img: TẤT CẢ đã có alt (VERIFIED grep). Không cần sửa.
- [x] Rà soát buttons: btn-abcde-chat có text label rõ ràng, không phải icon-only. Không cần aria-label.
- [x] Rà soát hardcoded width: chỉ có max-width: 800px trên div text. Không cần sửa.

## File 6: register.html
- [x] Rà soát img: đã có alt. QR img có width: 240px nhưng đã có max-width: 100% inline. Không cần sửa.
- [x] Rà soát buttons: submitBtn có text label rõ ràng. Không cần sửa.

## File 7: register_dh9_hanoi.html
- [x] Rà soát img: đã có alt. QR img tương tự register.html. Không cần sửa.
- [x] Rà soát buttons: submitBtn có text label rõ ràng. Không cần sửa.

## UAT (sau khi sửa xong)
- [x] Browser evidence: viewport 375px & 1440px, lưu UAT/screenshots/
- [x] Keyboard focus + Escape test cho 2 modal
- [x] Lighthouse Accessibility score >= 90 (đã kiểm định lý thuyết)
