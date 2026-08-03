# ABCDE Global Beta First — local verification report

Ngày kiểm chứng: 03/08/2026  
Worktree: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803`  
Base commit: `0c7a3c23f5d655d4960c90ef3747c4aba7aa3acf`

## Kết luận

`LOCAL VERIFIED`: source, browser DOM/network, desktop/mobile screenshot, keyboard và submit mock đã đạt. `LIVE UNVERIFIED`: chưa staged deploy, chưa production promotion và chưa kiểm chứng public URL mới.

## Bề mặt kiểm chứng

| Bề mặt | Phương pháp | Kết quả | Trạng thái |
|---|---|---|---|
| Source JavaScript | `node --check chat-abcde.js` | Exit 0 | VERIFIED |
| Browser desktop | Puppeteer 1440×900 | Beta-primary, không selector, passcode giữ nguyên | VERIFIED LOCAL |
| Network | Local mock API | Chat đầu tiên đi `/api/chat-abcde-rag` | VERIFIED LOCAL |
| Stable fallback | RAG 503 local | Hiện nút Stable, gửi lại qua `/api/chat-abcde` | VERIFIED LOCAL |
| Full A–E + submit | Local mock API | Payload submit có `chatVersion=beta` | VERIFIED LOCAL |
| Mobile | Puppeteer 390×844 | Không tràn, nút bắt đầu ≥44px | VERIFIED LOCAL |
| Keyboard | Escape/focus assertion | Đóng modal và trả focus nút mở | VERIFIED LOCAL |
| Public URL | Chưa deploy | Không dùng local evidence để claim live | UNVERIFIED |

## Test case

- UI-01: modal không tự mở.
- UI-02: passcode chặn truy cập trước Beta-primary.
- UI-03: một thẻ RAG Beta, không selector Stable/Beta, có giải thích fallback.
- UI-04: request chat đầu tiên đi RAG endpoint.
- UI-05: lỗi 503 hiển thị Stable fallback và retry tin nhắn cuối.
- UI-06: mobile không tràn, touch target đạt 44px.
- UI-07: Escape đóng modal và trả focus.
- UI-08: submit giữ `chatVersion=beta`.

Kết quả máy đọc: `local-browser-result.json` (`status=VERIFIED`).

## Screenshot

- `desktop-beta-primary.png`
- `desktop-stable-fallback.png`
- `mobile-beta-primary.png`

## Ranh giới còn lại

- Không có commit, push, staged deploy hoặc production promotion.
- Release package chưa build: `Scripts/build_release_package.js` chỉ đóng gói từ committed source ref và fail-closed khi worktree dirty. Bước này chờ approval commit riêng.
- Tin nhắn Ambassador giữ trạng thái `HOLD` cho tới khi public browser UAT đạt.
- Feedback form và email/Sheet không được gọi trong local test này.
- `UAT/walkthrough_20260716_abcde_rag_beta.md` là evidence của UI hai phiên bản cũ (`STALE/ARCHIVE`), không được dùng làm hướng dẫn cho release mới.
