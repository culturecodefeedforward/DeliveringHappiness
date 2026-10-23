# 📋 Kế Hoạch Triển Khai: Khóa Chặt Chặng 2 & 3 Đến Khi Vượt Qua Bài Sát Hạch Đầu Vào (Stage Unlocking Gate)

> **Ngày tạo:** 02/10/2026
> **Loại:** Implementation Plan (Kế hoạch triển khai)
> **Mục tiêu:** Đảm bảo học viên bắt buộc phải ĐẠT (≥ 70%) Bài 1.1 Kiểm Tra Sát Hạch Đầu Vào ở Chặng 1 mới được mở khóa (unlock) Chặng 2 (Workshop) và Chặng 3 (21 Ngày).
> **Phê duyệt:** Cấp độ 2 Plan Approval từ Sếp Dzũ

---

## 1. PHÂN TÍCH HIỆN TRẠNG & NGUYÊN NHÂN LỖI LOGIC

1. **Ở hàm `renderSyllabus` (Sidebar/Mục lục):**
   - Hiện tại không có kiểm tra điều kiện mở khóa `isStageUnlocked(idx)`.
   - Học viên khi chưa làm test hoặc test chưa đạt điểm vẫn có thể nhấp chuột vào Chặng 2, Chặng 3 và toàn bộ các mục con (subSections) bên trong để tải nội dung.
   - Giao diện mục lục hiển thị Chặng 2 và 3 như các chặng bình thường, không có biểu tượng ổ khóa `🔒` hay nhãn cảnh báo.

2. **Ở hàm `loadStage` (Core Stage Loader):**
   - Không có kiểm tra cổng chặn đầu vào (Guard Gate). Bất kỳ lệnh gọi `loadStage(1)` hoặc `loadStage(2)` đều tải trắng trợn nội dung của Chặng 2/3 mà không kiểm tra xem học viên đã qualify chưa.

3. **Ở lúc khôi phục dữ liệu (`loadLearnerProgress`):**
   - Nếu `currentStageIndex` trong bộ nhớ trình duyệt đang lưu chỉ số Chặng 2 hoặc 3, hệ thống sẽ mở ngay chặng đó mà không kiểm tra điều kiện qua bài test.

---

## 2. GIẢI PHÁP THỰC THI (PROPOSED ARCHITECTURE)

### A. Thiết lập hàm chuẩn hóa `isStageUnlocked(stageIdx)`:
```javascript
function isStageUnlocked(stageIdx) {
    if (stageIdx === 0) return true; // Chặng 1 luôn luôn mở
    const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
    const isQuizPassed = Boolean(s1Data.passed || (s1Data.percentage >= 70));
    const isCoach = currentUser && (
        currentUser.cohort === "COACH" || 
        currentUser.cohort === "BTC / Coach" || 
        currentUser.role === "admin" || 
        currentUser.role === "Coach"
    );
    return Boolean(isQuizPassed || isCoach);
}
```

### B. Chặn ở `loadStage(stageIdx)`:
- Nếu `!isStageUnlocked(stageIdx)`:
  - Ngăn không cho tải chặng bị khóa.
  - Hiển thị thông báo rõ ràng cho học viên:
    `"🔒 Chặng này đang bị khóa! Bạn cần hoàn thành và đạt tối thiểu 70% ở Bài Kiểm Tra Sát Hạch Đầu Vào (Chặng 1) để mở khóa Chặng 2 và Chặng 3."`
  - Tự động chuyển hướng về Chặng 1 và dẫn học viên tới vị trí làm bài test (`jumpToStage1Quiz()`).
  - Dừng thực thi hàm (`return`).

### C. Cập nhật giao diện trực quan ở Sidebar `renderSyllabus()`:
- Với các Chặng bị khóa (`!isUnlocked`):
  - Đổi icon số chặng thành `🔒`.
  - Đổi nhãn badge thành `🔒 Khóa`.
  - Thiết lập style làm mờ (`opacity-60 bg-brand-card/20 border-brand-border/40 text-slate-500 cursor-not-allowed`).
  - Gắn sự kiện click: Khi người dùng nhấp vào chặng bị khóa hoặc bất kỳ mục con nào của chặng đó, hệ thống sẽ bật thông báo hướng dẫn và tự động dẫn về bài test sát hạch Chặng 1.

### D. Đồng bộ thời gian thực khi nộp bài test:
- Khi nộp bài test đạt `≥ 70%`: Gọi `renderSyllabus()` và `evaluateLearnerStatus()` để ngay lập tức gỡ bỏ ổ khóa `🔒`, mở khóa Chặng 2 & 3 với hiệu ứng chuyển màu sống động.

---

## 3. FILE ALLOWLIST

Chỉ sửa đúng 1 file duy nhất:
```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js
```

> **TUYỆT ĐỐI CẤM** sửa các file ngoài danh sách (roster files, practice-abcde, styles, v.v.).

---

## 4. KẾ HOẠCH ROLLBACK

Trước khi sửa, sao lưu file `lms/app.js`:
```powershell
Copy-Item "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js" "C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\_backup_20261002\app_before_unlock_gate.js"
```
Nếu có sự cố, khôi phục ngay lập tức từ file backup trên.

---

## 5. VERIFICATION CHECKLIST (KIỂM CHỨNG)

1. Cú pháp: `node -c lms/app.js` không có lỗi.
2. Kiểm thử giả lập kịch bản người học:
   - Học viên mới chưa làm test: Chặng 2 và Chặng 3 hiển thị `🔒 Khóa`.
   - Bấm vào Chặng 2 / Chặng 3 trên Menu: Bị chặn lại, thông báo yêu cầu đạt ≥ 70% và tự cuộn về bài test.
   - Bấm vào các mục con của Chặng 2 / Chặng 3: Bị chặn lại và dẫn về bài test.
   - Làm bài test đạt < 70%: Chặng 2 và 3 vẫn tiếp tục bị khóa.
   - Làm bài test đạt ≥ 70%: Chặng 2 và 3 mở khóa ngay lập tức, nhấp vào xem được nội dung.
   - Tài khoản Coach / Admin: Mở khóa toàn bộ không bị chặn.

---

## 6. RANH GIỚI PHÊ DUYỆT (APPROVAL BOUNDARY)

- **Cấp độ 2:** Duyệt Kế hoạch triển khai này để tiến hành chỉnh sửa `lms/app.js` và kiểm thử cục bộ.
- **Cấp độ 3:** Chỉ xin phê duyệt riêng trước khi thực hiện `git add`, `git commit` và `git push`.
