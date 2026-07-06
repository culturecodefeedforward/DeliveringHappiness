# UAT Report: Enable Fetch Status Check Hotfix (DHM9 Hanoi)

*   **Date**: 2026-07-06
*   **Author**: Gemini (Antigravity Agent)
*   **Resolved Project**: Delivering Happiness Website Form Revision
*   **Source of Truth File**: [register_dh9_hanoi.html](file:///C:/Users/vu.hoang/.gemini/antigravity/worktrees/dh4hn-website/revise-dh4hn-form-ui/register_dh9_hanoi.html)

---

## 1. Ma Trận Kiểm Chứng Bề Mặt (Surface Verification Matrix)

| Bề mặt kiểm chứng (Verification Surface) | Phương pháp kiểm chứng (Method) | Kết quả kỳ vọng (Expected Output) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- |
| **Local files** | Grep trong allowlist logic | File logic cục bộ chứa đúng flag `window.DHM9_ENABLE_FETCH_STATUS = true;` | **VERIFIED** |
| **Apps Script deployment** | Đối chiếu API call | Không thay đổi Apps Script backend | **VERIFIED** (No touch) |
| **Public frontend URLs** | Probe HTTP trực tiếp | Trả về file HTML chứa flag (chưa deploy) | **UNVERIFIED** (Chờ deploy) |
| **Browser evidence** | Kiểm tra console/network thực tế | `action=checkStatus` chạy bằng fetch, không báo lỗi trùng số điện thoại | **UNVERIFIED** (Chờ deploy) |
| **Final verdict** | Đối chiếu toàn diện ma trận | Cấu hình local đã khớp, chờ deploy lên live để UAT trình duyệt | **Local done** |

---

## 2. Bằng chứng thay đổi cục bộ (Local Diff & Grep Evidence)

### Diff Evidence
```diff
diff --git a/register_dh9_hanoi.html b/register_dh9_hanoi.html
index 400704c..4e3e45d 100644
--- a/register_dh9_hanoi.html
+++ b/register_dh9_hanoi.html
@@ -748,6 +748,7 @@
         window.DHM9_JSONP_TIMEOUT_MS = 12000;
         window.DHM9_JSONP_POLL_DELAY_MS = 4000;
         window.DHM9_STATUS_CHECK_MODE = "fetch";
+        window.DHM9_ENABLE_FETCH_STATUS = true;
         window.DHM9_PAYMENT_ACCOUNT = "96247CULTURECODE";
         window.DHM9_PAYMENT_ACCOUNT_LABEL = "VA 96247CULTURECODE / BIDV 8815369431 / Hà Ngọc Hoàn";
         window.DHM9_PAYMENT_BANK = "BIDV";
```

### Grep Evidence
```text
C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\revise-dh4hn-form-ui\register_dh9_hanoi.html:
750:         window.DHM9_STATUS_CHECK_MODE = "fetch";
751:         window.DHM9_ENABLE_FETCH_STATUS = true;
```

---

## 3. Kế hoạch khôi phục (Rollback Plan)
Revert (quay lui) thay đổi trong file [register_dh9_hanoi.html](file:///C:/Users/vu.hoang/.gemini/antigravity/worktrees/dh4hn-website/revise-dh4hn-form-ui/register_dh9_hanoi.html) bằng cách xóa bỏ dòng:
```javascript
window.DHM9_ENABLE_FETCH_STATUS = true;
```

---

## 4. Tác động tài liệu (Docs Impact)
* **Docs impact**: none.
* **Lý do**: Đây chỉ là cấu hình bật cờ đồng bộ hóa (`window flag sync`) với tính năng fetch đã có sẵn trong logic lõi JS (`register_dh9.js`). Không thay đổi hành vi nghiệp vụ hay quy trình thanh toán nên không làm stale tài liệu hiện tại.
