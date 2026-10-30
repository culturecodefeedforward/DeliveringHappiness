# 🚨 Báo Cáo Sự Cố: Thẩm Định Lỗi Báo Cáo Trạng Thái Deploy Live Vercel (Hiệu Chỉnh Theo Phản Hồi Codex)

**Mã sự cố**: `INC-20260723-VERCEL-FALSE-CLAIM-REV1`  
**Thời gian hiệu chỉnh**: 2026-07-23T14:00:00+07:00  
**Tác giả**: Gemini Agent (đã hiệu chỉnh theo phản hồi thẩm định từ Codex)  
**Tình trạng kiểm chứng**: `[CONFIRMED FAILED CLAIM]` — Báo cáo live hoàn thành ở lượt trước là SAI THỰC TẾ. Các nguyên nhân kỹ thuật chưa đủ bằng chứng đã được hạ xuống `[UNVERIFIED]`.

---

## 1. Tóm Tắt Sự Cố & Phán Quyết Hiệu Chỉnh (Executive Summary)

Trong phiên làm việc ngày 23/07/2026, Gemini đã vội vàng báo cáo `Live verified` / `Live done` sau khi chạy `npx --no-install vercel --prod --yes` và script Puppeteer `verify_live_url.js`. Tuy nhiên, hình ảnh sếp Dzũ chụp thực tế lúc 13:45 và lệnh `fetch()` lúc 13:47 trên tên miền chính `https://delivering-happiness.vercel.app/` xác nhận tên miền chính vẫn trả về phiên bản cũ (`08:00 - 18:00` & `Đăng ký TP.HCM`).

Theo phản hồi thẩm định độc lập từ Codex:
1. Báo cáo Live trước đó của Gemini là **SAI THỰC TẾ** `[VERIFIED FAILED CLAIM]`.
2. Giả thuyết "Vercel lấy GitHub main thay vì local code" là **CHƯA ĐƯỢC KIỂM CHỨNG** `[UNVERIFIED]`, vì `task-896.log` có ghi `Uploading 26.8KB`.
3. Giả thuyết "Puppeteer bị dính Disk Cache / Service Worker" là **CHƯA ĐƯỢC KIỂM CHỨNG** `[UNVERIFIED]`, vì `verify_live_url.js` mở phiên Puppeteer mới không có `userDataDir` và không có log mạng `fromCache`.
4. Phát hiện chênh lệch cấu hình dự án Vercel: `.vercel/project.json` ghi `projectName: dh-crm-landing`, trong khi `task-896.log` lại deploy vào project `delivering-happiness`.
5. Đã xác minh bản phát hành `dpl_DhF5QESsTvjTkxBtbhRrGjTjFXRr` (URL `https://delivering-happiness-jq8gawtgz-vuhoang2708s-projects.vercel.app`) và các bản phát hành sau 10:41 (`gsofcaf0m`, `fwes9k4lb`) bị vướng cơ chế bảo vệ **Vercel SSO Authentication (302 Redirect)** nên HTTP fetch không đọc được nội dung nếu không có token xác thực.

---

## 2. Bảng Phân Loại Bằng Chứng Toàn Diện (VERIFIED / INFERRED / UNVERIFIED Matrix)

| Hạng mục đối chiếu | Bằng chứng thu thập | Mức độ xác minh (Claim Level) |
| :--- | :--- | :--- |
| **Báo cáo Live ở lượt trước của Gemini là SAI** | Ảnh sếp Dzũ gửi & Node fetch lúc 13:47 trả về `has0730: false, has0800: true` | `[VERIFIED]` (Gemini đã báo cáo sai) |
| **Mã nguồn Local `index.html` đã được sửa** | Git diff local chứa `07:30 - 17:30` và `interest.html` | `[VERIFIED]` (At Local) |
| **Chênh lệch cấu hình Project Vercel** | `.vercel/project.json` ghi `dh-crm-landing` nhưng CLI deploy `delivering-happiness` | `[VERIFIED]` |
| **URL định danh deployment bị 302 SSO Redirect** | Node fetch `https://delivering-happiness-gsofcaf0m-vuhoang2708s-projects.vercel.app` trả về `Status 302 -> Vercel SSO` | `[VERIFIED]` |
| **Giả thuyết Vercel bỏ qua local code để kéo GitHub main** | `task-896.log` có `Uploading 26.8KB` và `Downloading 169 files` (cache) | **`[UNVERIFIED]`** (Hạ cấp theo Codex) |
| **Giả thuyết Puppeteer local dính Disk Cache / Service Worker** | `verify_live_url.js` chạy Puppeteer mới, thiếu log network/fromCache | **`[UNVERIFIED]`** (Hạ cấp theo Codex) |
| **Khẳng định Vercel "chưa từng nhận mã nguồn mới"** | Node fetch lúc 13:47 chỉ chứng minh tên miền chính trả bản cũ tại thời điểm 13:47 | **`[UNVERIFIED]`** (Hạ cấp theo Codex) |

---

## 3. Nhật Ký Bản Phát Hành Vercel (Deployment History Investigation)

Kết quả điều tra danh sách bản phát hành trên Vercel qua `npx vercel ls delivering-happiness`:

| Thời điểm deploy | Deployment URL | Target / Env | Trạng thái HTTP |
| :--- | :--- | :--- | :--- |
| ~10:40 UTC+7 (Task-896) | `https://delivering-happiness-jq8gawtgz-vuhoang2708s-projects.vercel.app` | Production (`dpl_DhF5QESsTvjTkxBtbhRrGjTjFXRr`) | 302 Redirect (Vercel SSO Protection) |
| ~11:45 UTC+7 | `https://delivering-happiness-gsofcaf0m-vuhoang2708s-projects.vercel.app` | Production | 302 Redirect (Vercel SSO Protection) |
| ~13:46 UTC+7 | `https://delivering-happiness-fwes9k4lb-vuhoang2708s-projects.vercel.app` | Preview | 302 Redirect (Vercel SSO Protection) |
| **Tên miền công khai chính** | `https://delivering-happiness.vercel.app/` | Production Domain (Aliased) | **200 OK (Đang trả về bản cũ 08:00)** |

---

## 4. Danh Sách Bằng Chứng Còn Thiếu (Missing Evidence)

1. **Nội dung thực sự bên trong bản build `dpl_DhF5QESsTvjTkxBtbhRrGjTjFXRr`**: Do các URL preview/deployment bị bảo vệ bởi Vercel SSO Protection (302 Redirect), chưa có bằng chứng HTTP fetch trực tiếp nội dung bên trong bản build đó ngoại trừ kết quả alias tên miền chính.
2. **Nguyên nhân tên miền chính `delivering-happiness.vercel.app` chưa cập nhật**: Cần kiểm tra Vercel Dashboard xem tên miền chính đang trỏ về Deployment ID nào hoặc có bị kẹt alias/cache layer ở Vercel Edge Network hay không.
3. **Mục đích của cấu hình `.vercel/project.json`**: Cần làm rõ vì sao file local `.vercel/project.json` ghi `dh-crm-landing` nhưng khi chạy Vercel CLI lại nhận project `delivering-happiness`.

---

## 5. Danh Sách File Cho Phép (Allowlist) & Quy Tắc An Toàn Vận Hành

Theo chỉ đạo bắt buộc từ sếp Dzũ và Codex:
- **CẤM TUYỆT ĐỐI**: Không tự ý chạy `git commit`, `git push`, `git add .` hay `vercel --prod` khi chưa có phê duyệt trực tiếp bằng văn bản từ sếp Dzũ.
- **Danh sách file an toàn (Allowlist) được phép stage khi có lệnh duyệt**:
  - `index.html`
  - `Artifacts/standardized_emails/dhm9_reschedule_email.html`
  - `Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md`
  - `docs/codebase-summary.md`
  - `docs/deployment.md`
  - `Implementation Plan/gemini_20260723_DHM8InterestAndScheduleUpdate730_Plan.md`
  - `Implementation Plan/gemini_20260723_DHM8InterestAndScheduleUpdate730_Task.md`
  - `UAT/gemini_20260723_DHM8InterestAndScheduleUpdate730_Walkthrough.md`
  - `UAT/gemini_20260723_VercelDeploymentCacheIncident_Report.md`
  - `UAT/gemini_20260723_StepByStepLogAudit_Report.md`
