# Báo cáo UAT & Triển Khai Live: Cập nhật Nút Đăng ký DHM8 & Khung Giờ Lịch Học (07:30 - 17:30)

**Trạng thái kiểm chứng (Claim Level)**: `Live verified` / `Live done` *(Đã deploy thành công lên Vercel Production và probe trực tiếp live URL bằng Puppeteer)*.

---

## 1. Phạm Vi Thay Đổi Thực Tế (Actual Scope)

Gồm 3 tệp nội dung chính:
1. [index.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html): Giao diện trang chủ (Landing Page).
2. [dhm9_reschedule_email.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/standardized_emails/dhm9_reschedule_email.html): Mẫu email dời lịch DHM9 Hà Nội chuẩn hóa.
3. [dhm9_reschedule_email_draft.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md): Bản thảo mẫu email dời lịch.

Tài liệu quản lý đã cập nhật (`/ck:docs`):
- [docs/codebase-summary.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/codebase-summary.md): Cập nhật thông tin `index.html` (nút DHM8 trỏ `interest.html`, khung giờ `07:30 - 17:30`).
- [docs/deployment.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment.md): Cập nhật thông tin bản build deploy live mới nhất.

---

## 2. Ma Trận Kiểm Chứng Bề Mặt (Surface Verification Matrix)

Tuân thủ quy chuẩn `AGENT_REPORTING_RULES.md`:

| Bề mặt kiểm chứng (Verification Surface) | Phương pháp kiểm chứng (Method) | Kết quả kỳ vọng (Expected Output) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- |
| **Local files** | Git diff & Puppeteer DOM verification | Cả 3 file đổi đúng nút DHM8 & lịch `07:30 - 17:30` | `[VERIFIED]` |
| **Apps Script deployment** | N/A | Không thay đổi backend Apps Script | `[VERIFIED]` (N/A) |
| **Public frontend URLs** | Probe Puppeteer trực tiếp `https://delivering-happiness.vercel.app/` | Trả về nội dung nút DHM8 mới & khung giờ `07:30 - 17:30` | `[VERIFIED]` |
| **Browser evidence** | Puppeteer tự động kiểm thử UI & chụp ảnh | Nút DHM8 trỏ `interest.html`, khung giờ `07:30 - 17:30` | `[VERIFIED]` |
| **Final verdict** | Đối chiếu toàn diện ma trận | Tất cả bề mặt đều PASS (`Live verified`) | **PASS / Live done** |

---

## 3. Bằng Chứng Triển Khai & Kiểm Thử Live (Live Deploy & Browser Evidence)

### 3.1. Kết quả Vercel Deploy (`/ck:deploy`)
- **Lệnh thực thi**: `npx --no-install vercel --prod --yes`
- **Inspect URL**: `https://vercel.com/vuhoang2708s-projects/delivering-happiness/DhF5QESsTvjTkxBtbhRrGjTjFXRr`
- **Production Deployment URL**: `https://delivering-happiness-jq8gawtgz-vuhoang2708s-projects.vercel.app`
- **Official Aliased URL**: `https://delivering-happiness.vercel.app`
- **Trạng thái (ReadyState)**: `READY`

### 3.2. Kết quả Probe Live URL Thực Tế bằng Puppeteer
Đã chạy kịch bản kiểm thử Puppeteer [verify_live_url.js](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/scratch/verify_live_url.js) truy cập trực tiếp URL Production `https://delivering-happiness.vercel.app/` sau thời gian trễ CDN cache in-validation (35s):

1. **Live DHM8 Schedule**: `📅 07:30 - 17:30, Thứ Bảy 18/07/2026` — `[VERIFIED]`
2. **Live Hero DHM8 Button**: Nhãn `Để lại quan tâm`, href `interest.html` — `[VERIFIED]`
3. **Live DHM9 Schedule**: `📅 07:30 - 17:30, Thứ Bảy 12/09/2026` — `[VERIFIED]`
4. **Live Register CTA Button**: Nhãn `Để lại quan tâm (TP.HCM)`, href `interest.html` — `[VERIFIED]`
5. **Lỗi Console/Runtime Live**: `0` lỗi — `[VERIFIED]`

### 3.3. Ảnh Bằng Chứng Kiểm Thử UI (Screenshots Evidence)
- **Local Screenshots**:
  - Ảnh Desktop Trang chủ Local: [dhm8_interest_schedule_desktop_20260723.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_interest_schedule_desktop_20260723.png)
  - Ảnh Mobile Trang chủ Local: [dhm8_interest_schedule_mobile_20260723.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/dhm8_interest_schedule_mobile_20260723.png)
- **Live Production Screenshots**:
  - Ảnh Desktop Trang chủ Live: [live_dhm8_interest_schedule_desktop_20260723.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/live_dhm8_interest_schedule_desktop_20260723.png)
  - Ảnh Mobile Trang chủ Live: [live_dhm8_interest_schedule_mobile_20260723.png](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/live_dhm8_interest_schedule_mobile_20260723.png)

---

## 4. Tác Động Tài Liệu (Docs Impact)

- Updated [docs/codebase-summary.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/codebase-summary.md): Bổ sung mô tả nút DHM8 TP.HCM chuyển sang "Để lại quan tâm" và khung giờ chuẩn `07:30 - 17:30`.
- Updated [docs/deployment.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment.md): Cập nhật lịch sử bản build Vercel Production deployment mới nhất.

---

## 5. Trạng Thái Kho Mã Nguồn & Phân Loại File (Git Status & Hygiene)

### Phân loại nhóm File (File Buckets Classification):

#### 📂 Nhóm 1: Files safe to stage (Các tệp thuộc scope task hiện tại)
- [index.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/index.html)
- [Artifacts/standardized_emails/dhm9_reschedule_email.html](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/standardized_emails/dhm9_reschedule_email.html)
- [Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/dhm9_reschedule_20260710/dhm9_reschedule_email_draft.md)
- [docs/codebase-summary.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/codebase-summary.md)
- [docs/deployment.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/docs/deployment.md)
- [Implementation Plan/gemini_20260723_DHM8InterestAndScheduleUpdate730_Plan.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260723_DHM8InterestAndScheduleUpdate730_Plan.md)
- [Implementation Plan/gemini_20260723_DHM8InterestAndScheduleUpdate730_Task.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/gemini_20260723_DHM8InterestAndScheduleUpdate730_Task.md)
- [UAT/gemini_20260723_DHM8InterestAndScheduleUpdate730_Walkthrough.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_20260723_DHM8InterestAndScheduleUpdate730_Walkthrough.md)
- Các tệp ảnh chụp màn hình kiểm thử UAT trong thư mục `UAT/`.

#### 📂 Nhóm 2: Files already committed
- *Không có.*

#### 📂 Nhóm 3: Files not safe to stage
- `Scripts/active_code_gs_final.js`, `register.html`, `register_direct.html` (thay đổi cũ chưa commit).
- `node_modules/`, `scratch/verify_live_url.js` (script runner tạm).
