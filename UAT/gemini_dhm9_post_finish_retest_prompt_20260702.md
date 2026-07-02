# Gemini Post-Finish Retest Prompt - DHM9 Production

```text
codex nói:
Gemini hãy retest độc lập sau production finish DHM9, không tạo thêm dữ liệu production mới.

Tình hình Codex đã xử lý xong:
- Apps Script DHM9 production đã deploy ở deployment `AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ @51 - DHM9 production finish UX async email 20260702`.
- Vercel live đang serve `register_dh9.js` có hai hotfix:
  - `692fe42 fix(dhm9): use jsonp status checks by default`
  - `7229b7b fix(dhm9): prevent realtime phone check blocking submit`
- Evidence đã push lên `origin/main` tới commit `bee3da9b2f3b241ddf50c346ad85a127298d32f7`.
- Full-circle E2E (End-to-End - kiểm thử đầu-cuối) thật đã chạy bằng email `vuhoang2708@gmail.com`:
  - registration UUID: `9ed7cdc0-80d6-4f5d-b7f4-7f4eef01fcc2`
  - payment code: `DHM9931173905`
  - simulated SePay transaction: `codex-dhm9-browser-e2e-20260702_013933`
  - backend follow-up trả `paymentStatus=PAID`
  - browser resume hiển thị `Đã thanh toán`
  - Gmail search đã thấy evidence theo payment code, full name và UUID.

Artifact/source of truth cần đọc bằng UTF-8:
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm9_production_finish_full_circle_20260702.md`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm9_browser_live_uat_20260702.json`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm9_full_circle_e2e\codex_dhm9_browser_full_circle_20260702_013933.json`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm9_followup_valid_callback_status_20260702_013933.json`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm9_gmail_inbox_search_20260702_013933.json`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\DHM9_REGISTRATION_PAYMENT_WORKFLOW.md`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\DHM9_Production_Finish_UAT_20260702.docx`

Yêu cầu retest:
1. Dùng đúng skill/browser workflow bắt buộc của Gemini, ghi rõ `Skill evidence` thật. Nếu không dùng được skill thì báo `UNVERIFIED skill evidence`, không claim VERIFIED.
2. Không submit form mới, không giả lập SePay mới, không gửi email mới, không commit/push/deploy/clasp push. Vòng này chỉ là retest độc lập read-only.
3. Mở live URL:
   - `https://delivering-happiness.vercel.app/register_dh9_hanoi.html`
   - viewport desktop `1440x900`
   - viewport mobile `375x812`
4. Kiểm chứng:
   - live JS có `DHM9_ENABLE_FETCH_STATUS` và `clearTimeout(_phoneDebounceTimer);`
   - form hiển thị DHM9, `event_id=DHM9_REG_220826_HN`
   - QR/payment surface vẫn hiện prefix `DHM9` nếu dùng resume URL.
5. Mở resume URL read-only:
   - `https://delivering-happiness.vercel.app/register_dh9_hanoi.html?uuid=9ed7cdc0-80d6-4f5d-b7f4-7f4eef01fcc2&paymentCode=DHM9931173905`
   - expected: status hiển thị `Đã thanh toán`, có nút `Đăng ký người khác`, không lỗi console fatal.
6. Nếu có quyền Workspace MCP read-only, dùng tool Gmail trong Workspace MCP để search lại inbox `vuhoang2708@gmail.com` theo `DHM9931173905` và UUID trên. Không gửi email mới.
7. Ghi report UAT (User Acceptance Testing - kiểm thử nghiệm thu người dùng) về repo-visible path:
   - `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_dhm9_post_finish_retest_20260702.md`
   - screenshot vào `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshots\dhm9_post_finish_retest_20260702\`
8. Báo cáo phải phân loại từng claim là `VERIFIED`, `INFERRED`, `UNVERIFIED`, hoặc `FAILED`, và ghi rõ không có mutation production mới.

Kết luận mong muốn: nếu tất cả đạt, trả về `VERIFIED read-only retest complete`; nếu thiếu bất kỳ evidence path nào, trả về `UNVERIFIED` hoặc `FAILED`, không nói pass.
```
