# Kế Hoạch Triển Khai: Cổng Kiểm Chứng Vercel Live Hotfix (Vercel Live Verification Gate Hotfix Plan - Rev 2)

**Mã Kế Hoạch**: `PLAN-20260723-VERCEL-LIVE-GATE-HOTFIX-REV2`  
**Dự Án**: Delivering Happiness (`c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`)  
**Tác Giả**: Gemini Agent (theo chỉ đạo từ Codex & Sếp Dzũ)  
**Mục Tiêu**: Xây dựng một cổng kiểm chứng tối thiểu (`Scripts/verify_vercel_live_gate.js`) và hard-gate báo cáo để ngăn chặn triệt để tình trạng tự ý dùng trạng thái `Vercel READY` hoặc một lần đọc DOM thiếu kiểm chứng để tuyên bố `Live verified` / `Live done`.

---

## 1. Danh Sách File Cho Phấp (Allowlist Files & Artifact Inventory)

### Tệp thuộc phạm vi mã nguồn & tài liệu được Git theo dõi:
1. [NEW] [Scripts/verify_vercel_live_gate.js](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Scripts/verify_vercel_live_gate.js) — Script kiểm thử độc lập 2 tầng (HTTP Raw + Browser CDP).
2. [MODIFY] [AGENT_REPORTING_RULES.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/AGENT_REPORTING_RULES.md) — Bổ sung hard-gate bắt buộc output của `Scripts/verify_vercel_live_gate.js`.
3. [NEW] [Implementation Plan/gemini_20260723_VercelLiveVerificationHotfix_Plan.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260723_VercelLiveVerificationHotfix_Plan.md) — Tệp kế hoạch này.
4. [NEW] [UAT/gemini_20260723_VercelLiveVerificationHotfix_UAT.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_20260723_VercelLiveVerificationHotfix_UAT.md) — Báo cáo UAT kiểm chứng hotfix.
5. [NEW] [UAT/live_gate_result_20260723.json](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/live_gate_result_20260723.json) — Tệp dữ liệu JSON kết quả kiểm thử audit gate.

### Tệp Artifact hình ảnh cục bộ (Bị `.gitignore` quy tắc `*.png` bỏ qua, KHÔNG phải tệp Git quản lý):
- `UAT/live_gate_desktop_20260723.png`
- `UAT/live_gate_mobile_20260723.png`

---

## 2. Chi Tiết Thiết Kế & Thuật Toán (`Scripts/verify_vercel_live_gate.js`)

Script nhận các tham số CLI: `--deployment-url`, `--production-url`, `--expected-text` (bắt buộc ít nhất 1 chuỗi), `--forbidden-text` (tùy chọn).

### Kiểm tra tham số đầu vào:
- `--deployment-url` và `--production-url` là bắt buộc.
- `options.expectedTexts.length > 0` là bắt buộc. Nếu thiếu `--expected-text`, script lập tức in lỗi `"Error: At least one --expected-text parameter is required."` và thoát với **Exit Code 1**.

### Tầng 1: Kiểm thử HTTP Raw Response (Fetch API)
- **Thực thi**: Gọi `fetch()` cho cả `--deployment-url` và `--production-url`.
- **Cấu hình an toàn**:
  - Thêm URL parameter chống cache (`?_nocache=<timestamp>`).
  - Set header `cache-control: no-store`.
  - Disable tự động theo redirect (`redirect: 'manual'`).
- **Ghi nhận Metadata**:
  - Timestamp, HTTP Status Code, Redirect Location/Chain, Final URL, Content Length.
- **Xử lý Redirect SSO**: Nếu Deployment URL bị 302 tới Vercel SSO, đánh dấu trạng thái Deployment Content là `UNVERIFIED` (không coi SSO page là nội dung deployment).

### Tầng 2: Kiểm thử Trình duyệt Trực tiếp (Puppeteer CDP)
- **Thực thi**: Mở Puppeteer với Browser Context mới (profile sạch).
- **Tắt Cache tuyệt đối**: Dùng Chrome DevTools Protocol (`page.target().createCDPSession()`) gọi `Network.setCacheDisabled({ cacheDisabled: true })`.
- **Ghi nhận Metadata**:
  - Main Document Response Status, Final URL, `response.fromCache()` (nếu có), Console Errors, Page Errors.
- **Chụp ảnh bằng chứng**: Fullpage Desktop (`1440x900`) và Mobile (`375x812`) lưu vào `UAT/`.
- **Đối chiếu DOM vs HTTP**: Nếu HTTP và DOM mâu thuẫn, trả về `EXIT CODE 1`.

### Quy tắc Phán Quyết (Verdict Rules):
- Trạng thái `Vercel CLI READY` chỉ được ghi nhận là `DEPLOYMENT_READY`.
- Chỉ xuất nhãn `LIVE_VERIFIED` khi Production HTTP + Browser CDP đều thấy toàn bộ `--expected-text`, KHÔNG thấy bất kỳ `--forbidden-text` nào, và không bị redirect sai.
- Bất kỳ lớp nào thất bại -> Exit Code khác 0 (`exit(1)`).

---

## 3. Kế Hoạch Kiểm Chứng (Verification & UAT Plan)

Chạy thử `node Scripts/verify_vercel_live_gate.js` với tham số:
```bash
node Scripts/verify_vercel_live_gate.js \
  --production-url https://delivering-happiness.vercel.app/ \
  --deployment-url https://delivering-happiness-jq8gawtgz-vuhoang2708s-projects.vercel.app \
  --expected-text "07:30 - 17:30" \
  --expected-text "Để lại quan tâm" \
  --forbidden-text "08:00 - 18:00"
```
**Kết quả kỳ vọng**:
Script phát hiện trang Production Live hiện tại vẫn chứa `08:00 - 18:00` (thuộc `--forbidden-text`), in log chi tiết failure, xuất nhãn `LIVE_UNVERIFIED_FAILED` và thoát với **Exit Code 1** (**VERIFIED: chặn đúng ca dương tính giả của sự cố ngày 23/07/2026**).

---

## 4. Kế Hoạch Quay Lui (Rollback Plan)

Nếu có sự cố phát sinh trong quá trình chạy script hotfix:
- Xóa file script mới: `Scripts/verify_vercel_live_gate.js`.
- Revert thay đổi trên `AGENT_REPORTING_RULES.md` qua `git checkout AGENT_REPORTING_RULES.md`.

---

## 5. Ranh Giới Phê Duyệt (Approval Boundaries)

- ⛔ **CẤM TUYỆT ĐỐI**: Không `git add .`, không `git commit`, không `git push`, không `deploy`, không sửa `index.html`, không sửa `.vercel/project.json` hay `.gitignore`.
