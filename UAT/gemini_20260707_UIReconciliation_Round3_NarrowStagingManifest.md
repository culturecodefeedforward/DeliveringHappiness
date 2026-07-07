RULE_SENTINEL_DZU: đã đọc kỹ rule nghe sếp Dzũ
Rule evidence: C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md và C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\AGENT_REPORTING_RULES.md
Skill evidence: N/A
Task evidence: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_20260707_UIReconciliation_Round3_NarrowStagingManifest.md

# Round 3 Narrow Staging Manifest (Danh Sách Tách Biệt Đăng Ký Git Stage - Bản cập nhật Round 2.5)
**Ngày thực hiện:** 07/07/2026  
**Thực hiện bởi:** Gemini Coding Agent  
**Mã kế hoạch:** COD-20260707-UI-RECONCILE  
**Trạng thái phê duyệt:** Chờ phê duyệt từ sếp Dzũ để thực thi từng phân đoạn riêng biệt.  
**Bề mặt nghiệm thu (Claim Surface):** **Local done** (Môi trường cục bộ đã hoàn tất và kiểm chứng toàn diện, chưa commit/push/deploy).

---

## 1. Trạng Thái Git Hiện Tại (Current Git Status Summary)

Nhánh cục bộ `main` hiện đang chậm hơn `origin/main` đúng **1 commit** (HEAD đang trỏ ở `4ca9c7f`, còn origin/main trỏ ở `133913e`).

Trạng thái chi tiết của các tệp:
- **Tệp đang Stage (Changes to be committed):**
  - [register_dh9_hanoi.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/register_dh9_hanoi.html) (Trạng thái **MM**).
- **Tệp chưa Stage (Changes not staged for commit):**
  - Các tệp in-scope thuộc danh sách cho phép (allowlist) của UI lane.
  - Các tệp cấu hình, backend proxy và tệp Apps Script bị dirty ngoài scope.
- **Tệp bị bỏ qua (Ignored files):**
  - Hai tệp logo mới định dạng `.jpg` bị ignore bởi `.gitignore` dòng 9 (`*.jpg`).
- **Tệp chưa theo dõi (Untracked files):**
  - Các tệp báo cáo UAT, mã nguồn kiểm thử và các tệp nháp tạm thời trong thư mục `UAT/` và `Scripts/`.

---

## 2. Điểm Chồng Lấn Với origin/main (Overlap with origin/main)

Commit `133913e` (`fix(dhm9): enable fetch status checks on Hanoi form`) trên `origin/main` tác động trực tiếp đến:
- Tệp `register_dh9_hanoi.html` (đã kích hoạt `DHM9_ENABLE_FETCH_STATUS = true`).
- Tệp `UAT/gemini_20260706_EnableFetchStatusHotfix.md`.

*Lưu ý:* Mặc dù local branch main chưa tích hợp commit `133913e`, nhưng mã nguồn local của `register_dh9_hanoi.html` đã được cập nhật thủ công dựa trên mốc chuẩn `origin/main`. Khi đồng bộ hóa, cần đi theo trình tự cô lập để tránh xung đột hoặc ghi đè lỗi.

---

## 3. Tách Biệt Các Cấp Độ Phê Duyệt (Approval Lanes)

Để đảm bảo an toàn tuyệt đối cho hệ thống đang chạy trực tiếp, quy trình Round 3 được chia làm 3 làn duyệt độc lập:

- **Round 3A (Narrow Stage & Local Commit):** Chỉ thực hiện chuẩn bị (stage) các tệp an toàn và commit local tại máy cục bộ. *Cần phê duyệt từ sếp Dzũ để bắt đầu.*
- **Round 3B (Safe Synchronization & Push):** Thực hiện kéo thay đổi, giải quyết xung đột (nếu có) và đẩy lên nhánh preview. *Cần phê duyệt riêng từ sếp.*
- **Round 3C (Deploy & Verify Live URL):** Đưa ứng dụng lên môi trường công khai (Vercel) và chạy thử nghiệm. *Cần phê duyệt riêng từ sếp.*

---

## 4. Danh Sách Tệp Stage & Bị Ignore (Staging Manifest)

### 4.1 Files safe to stage (Các tệp an toàn để stage)
```text
index.html
styles.css
script.js
register.css
register.html
register_dh9_hanoi.html
register.js
register_dh9.js
interest.html
interest_dh9.html
assessment.html
quiz.css
```

### 4.2 Files requiring `git add -f` (Tệp bị ignore cần ép thêm)
```text
assets/culturecode-logo-dark.jpg
assets/culturecode-logo-light.jpg
```

### 4.3 UAT/Report Markdown (Báo cáo nghiệm thu cần Stage)
```text
UAT/gemini_20260707_UIReconciliation_UAT.md
UAT/gemini_20260707_UIReconciliation_Round2.md
UAT/gemini_20260707_UIReconciliation_Round25_VisualQA.md
UAT/gemini_20260707_UIReconciliation_Round3_NarrowStagingManifest.md
```
*Lưu ý:* Thư mục ảnh `UAT/screenshots/` (chứa `.png` bị ignore) sẽ **chỉ giữ local**, không được stage để tránh làm nặng repo.

### 4.4 Files NOT safe to stage (Tuyệt đối không được stage)
Mọi dirty file ngoài scope (như `.vercel/project.json`, `api/sepay-dh.js`, Apps Script logic, docs cũ, deleted data artifacts) bắt buộc không được stage trừ khi có phê duyệt riêng biệt từ user.

---

## 5. Trình Tự Lệnh Đề Xuất (Proposed Command Sequence)

*Tuyệt đối không tự động chạy các lệnh sau. Chỉ dùng để tham khảo sau khi nhận phê duyệt.*

### Phân đoạn 3A: Stage & Commit Local
```powershell
# 1. Stage các file logic an toàn và báo cáo UAT
git add index.html styles.css script.js register.css register.html register.js register_dh9.js interest.html interest_dh9.html assessment.html quiz.css
git add register_dh9_hanoi.html
git add UAT/gemini_20260707_UIReconciliation_UAT.md UAT/gemini_20260707_UIReconciliation_Round2.md UAT/gemini_20260707_UIReconciliation_Round25_VisualQA.md UAT/gemini_20260707_UIReconciliation_Round3_NarrowStagingManifest.md

# 2. Ép stage các file logo JPG bị ignore
git add -f assets/culturecode-logo-dark.jpg
git add -f assets/culturecode-logo-light.jpg

# 3. Kiểm tra lại vùng staged và unstaged (Chỉ các file in-scope và report được staged)
git status -uno

# 4. Commit local
git commit -m "style(ui): controlled ui reconciliation and branding standardization"
```

### Phân đoạn 3B: Đồng bộ hóa an toàn & Push (Yêu cầu duyệt riêng)
```powershell
# 1. Tải các thay đổi mới nhất từ máy chủ
git fetch origin

# 2. Rebase local commit lên trên origin/main (Để tích hợp commit 133913e an toàn)
git rebase origin/main

# 3. Đẩy lên nhánh remote
git push origin HEAD
```

### Phân đoạn 3C: Deploy & Verify Live (Yêu cầu duyệt riêng)
- Deploy bản dựng lên Vercel và thực hiện HTTP probe 6 URLs live theo quy chuẩn kiểm toán.
