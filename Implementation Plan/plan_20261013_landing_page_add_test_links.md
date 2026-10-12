# Kế Hoạch Triển Khai: Bổ Sung Liên Kết Các Bộ Công Cụ Trắc Nghiệm & Thực Hành Lên Landing Page

**Ngày lập:** 13/10/2026  
**Mục tiêu:** Cập nhật khu vực điều hướng công cụ trên Landing Page (`https://delivering-happiness.vercel.app/`), mở rộng từ 2 nút hiện tại (`personal-value.html` và `btn-abcde-chat`) thành cụm 6 công cụ trắc nghiệm & thực hành tương tác đầy đủ của hệ sinh thái Delivering Happiness.

---

## 1. Nguồn Chuẩn (Source of Truth) & Đối Chiếu Đường Dẫn Thực Tế

| Tên công cụ / Khảo sát | Đường dẫn / Endpoint chuẩn | Nguồn xác thực |
| :--- | :--- | :--- |
| **1. La bàn Giá trị Cá nhân** | `personal-value.html` (Local route) | Hiện có trên Landing Page (`dh4hn-website/personal-value.html`) |
| **2. Thực hành Lạc quan ABCDE** | Action ID: `btn-abcde-chat` (kích hoạt chatbox Socratic ABCDE) | Hiện có trên Landing Page (`dh4hn-website/chat-abcde.js`) |
| **3. Khảo sát Xung đột TKI** | `https://khao-sat-xung-dot-tki.vercel.app/` | Dự án `khao-sat-xung-dot-tki` (Live HTTP 200) |
| **4. Khảo sát Phong cách Xã hội (Social Styles)** | `https://khao-sat-tinh-cach.vercel.app/` | Dự án `khao-sat-tinh-cach` (Live HTTP 200) |
| **5. Trạm thu hoạch I . A . M (dành cho khóa Team Happiness)** | `https://team-happiness-iam-v2.vercel.app/` | Dự án `team-happiness-iam-v2` (Phiên bản 2 cho Apollo, Live HTTP 200) |
| **6. Trắc nghiệm Hệ điều hành Hạnh phúc** | `assessment.html` (Local route) | Hiện có trên Landing Page (`dh4hn-website/assessment.html`) |

*Ghi chú về route `/h`:* Địa chỉ `https://delivering-happiness.vercel.app/h` hiện trả về HTTP 404 (do typo chữ `h` khi gõ link). Kế hoạch đề xuất bổ sung cấu hình chuyển hướng an toàn (`redirect`) trong `vercel.json` từ `/h` về `/` để đảm bảo trải nghiệm người dùng liền mạch.

---

## 2. Phạm Vi & Danh Sách Tệp Tác Động (Allowlist)

Chỉ tác động vào các tệp nằm trong allowlist được duyệt:
1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html` (Thêm 4 nút công cụ vào container hero)
2. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\vercel.json` (Thêm redirect `/h` -> `/`)
3. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_test_links` (Tệp backup trước khi sửa)

*Các tệp dirty có sẵn trong workspace (`lms/index.html`, `lms/authorized_roster.json`, `docs/RESUME_PROJECT_PROMPT.md`) đã được xác nhận là pre-existing, không bị tác động.*

---

## 3. Thiết Kế Giao Diện & Trải Nghiệm Người Dùng (UI/UX)

Thay thế khối 2 nút hiện tại:
```html
<div style="text-align: center; margin-top: 2.5rem;">
  <a href="personal-value.html" class="btn-primary" ...>🔍 Khám phá La bàn Giá trị Cá nhân</a>
  <button id="btn-abcde-chat" class="btn-primary" ...>🧠 Thực hành Lạc quan ABCDE</button>
</div>
```

Bằng khối hiển thị linh hoạt (flex-wrap), tự co giãn theo kích thước màn hình máy tính và điện thoại:
```html
<div class="hero-tools-container" style="text-align: center; margin-top: 2.5rem; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; max-width: 980px; margin-left: auto; margin-right: auto;">
  <a href="personal-value.html" class="btn-primary" style="background: var(--warm-cream); color: var(--warm-dark); font-weight: 700; box-shadow: 0 4px 15px rgba(250, 240, 230, 0.2); font-size: 1.05rem; padding: 0.9rem 1.6rem;">
    🔍 Khám phá La bàn Giá trị Cá nhân
  </a>
  <button id="btn-abcde-chat" class="btn-primary" style="background: var(--warm-cream); color: var(--warm-dark); font-weight: 700; box-shadow: 0 4px 15px rgba(250, 240, 230, 0.2); font-size: 1.05rem; padding: 0.9rem 1.6rem; border: none; cursor: pointer;">
    🧠 Thực hành Lạc quan ABCDE
  </button>
  <a href="https://khao-sat-xung-dot-tki.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--warm-cream); color: var(--warm-dark); font-weight: 700; box-shadow: 0 4px 15px rgba(250, 240, 230, 0.2); font-size: 1.05rem; padding: 0.9rem 1.6rem;">
    ⚔️ Khảo sát Xung đột TKI
  </a>
  <a href="https://khao-sat-tinh-cach.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--warm-cream); color: var(--warm-dark); font-weight: 700; box-shadow: 0 4px 15px rgba(250, 240, 230, 0.2); font-size: 1.05rem; padding: 0.9rem 1.6rem;">
    🎭 Khảo sát Phong cách Xã hội
  </a>
  <a href="https://team-happiness-iam-v2.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--warm-cream); color: var(--warm-dark); font-weight: 700; box-shadow: 0 4px 15px rgba(250, 240, 230, 0.2); font-size: 1.05rem; padding: 0.9rem 1.6rem;">
    💡 Trạm thu hoạch I . A . M (dành cho khóa Team Happiness)
  </a>
  <a href="assessment.html" class="btn-primary" style="background: var(--warm-cream); color: var(--warm-dark); font-weight: 700; box-shadow: 0 4px 15px rgba(250, 240, 230, 0.2); font-size: 1.05rem; padding: 0.9rem 1.6rem;">
    📊 Trắc nghiệm Hệ điều hành Hạnh phúc
  </a>
</div>
```

---

## 4. Kế Hoạch Kiểm Thử Nghiệm Thu (UAT Plan)

1. **UAT Cục bộ (Local Verification):**
   - Kiểm tra cú pháp HTML của `index.html`.
   - Kiểm tra sự tồn tại và tính hợp lệ của tất cả 6 liên kết/nút bấm.
   - Thử nghiệm trên kích thước màn hình Desktop (1280px) và Mobile (375px) để đảm bảo không bị vỡ layout hoặc tràn viền ngang.
   - Kiểm tra nút `#btn-abcde-chat` vẫn mở modal chat bình thường không bị ảnh hưởng.
2. **UAT Môi trường Production (Live Verification sau khi User phê duyệt Cấp độ 3):**
   - Kiểm tra HTTP status và load trang thực tế trên `https://delivering-happiness.vercel.app/`.
   - Kiểm tra chuyển hướng `/h` -> `/`.

---

## 5. Kế Hoạch Quay Lui (Rollback Plan)

Nếu có bất kỳ lỗi hiển thị nào phát sinh:
- Phục hồi tệp `index.html` từ tệp sao lưu: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_test_links`.
- Lệnh khôi phục: `Copy-Item -Path "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html.bak_20261013_test_links" -Destination "c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\index.html" -Force`.

---

## 6. Ranh Giới Phê Duyệt (Approval Boundaries)

- **Cấp độ 2 (Plan Approval):** Duyệt sửa đổi tệp cục bộ theo allowlist và tạo bản sao lưu.
- **Cấp độ 3 (Risky Operation Approval):** Chỉ thực hiện khi có xác nhận riêng trước lệnh `git commit`, `git push`, hoặc `vercel deploy`.
