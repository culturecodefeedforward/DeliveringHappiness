# Implementation Plan: Sắp Xếp Danh Sách & Gom Accordion Học Viên Chưa Có Dữ Liệu (`PLAN-20261011-SORT-AND-ACCORDION-ACTIVE-LEARNERS`)

- **Mã kế hoạch:** `PLAN-20261011-SORT-AND-ACCORDION-ACTIVE-LEARNERS`
- **Ngày lập:** `2026-10-11`
- **Yêu cầu từ User:** *"Ds học viên chi tiết bên dưới sorr theo kq test và thông tin từng mục aim. Hide accordion những học viên chưa có dữ liệu cho đỡ rối"*
- **Mức độ rủi ro:** `MEDIUM-RISK` (tinh chỉnh UI sắp xếp và thêm cơ chế Accordion thu gọn cho các học viên chưa có dữ liệu, giữ nguyên toàn bộ dữ liệu nền tảng).
- **Trạng thái phê duyệt:** `AWAITING PLAN APPROVAL (Cấp độ 2)`

---

## 1. Mục Tiêu & Phân Tích Kỹ Thuật

### 1.1 Vấn đề hiện tại
- Danh sách học viên tại 3 Tab chính (Tab 1 Test Analytics, Tab 2 I•A•M Stations, Tab 3 Blended 360°) đang hiển thị tuần tự theo thứ tự ban đầu của Roster (500+ học viên).
- Trong khi đó, số học viên đã nộp bài thi hoặc có bài thu hoạch 5 Trạm I•A•M chiếm một phần, khiến họ bị lẫn vào giữa hàng trăm dòng trống (`Chưa test`, `0/5 Trạm`, gạch ngang `—`).
- Người quản trị phải cuộn chuột rất nhiều hoặc tìm kiếm thủ công mới thấy người đã có kết quả.

### 1.2 Giải pháp thiết kế
1. **Sắp xếp thông minh (Smart Sorting) ưu tiên dữ liệu thực:**
   - **Tab 1 (Test Analytics):** Sắp xếp ưu tiên:
     - Nhóm 1: Học viên đã thi (sắp xếp giảm dần theo Điểm cao nhất `bestScore`, tiếp theo là số lần thi `totalAttempts`).
     - Nhóm 2: Học viên chưa thi (`totalAttempts === 0`).
   - **Tab 2 (Thu Hoạch 5 Trạm I•A•M):** Sắp xếp ưu tiên:
     - Nhóm 1: Số trạm hoàn thành giảm dần (5 -> 4 -> 3 -> 2 -> 1).
     - Nhóm 2: Tổng điểm I•A•M giảm dần (`iamTotalScore` cao xuống thấp).
     - Nhóm 3: Học viên chưa có dữ liệu trạm nào.
   - **Tab 3 (Hành Trình Blended 360°):** Sắp xếp ưu tiên:
     - Tiến độ 360° giảm dần (100% -> ... -> 0%).

2. **Cơ chế Accordion ẩn nhóm chưa có dữ liệu (Collapsible Accordion for Inactive Learners):**
   - Tại mỗi bảng danh sách, tách hiển thị thành 2 khu vực:
     - **Bảng chính (Active Data Table):** Chỉ hiển thị những học viên **ĐÃ CÓ DỮ LIỆU** (đã thi hoặc đã nộp trạm I•A•M). Bảng này sẽ rất gọn gàng (khoảng 7–10 học viên thực tế), xem được ngay tức thì.
     - **Accordion thu gọn (Collapsible Accordion / `<details>`):** Gom toàn bộ các học viên chưa có dữ liệu vào khối Accordion có tiêu đề trực quan:
       `🔽 Danh sách học viên chưa tham gia / chưa có dữ liệu (N học viên) — Bấm để xem chi tiết`
     - **Trạng thái mặc định:** Accordion này **BỊ ẨN / THU GỌN (`collapsed/closed`)** để không làm rối mắt người dùng. Khi cần tra cứu, người quản trị chỉ cần bấm 1 click là mở ra xem toàn bộ.

---

## 2. Allowlist Phạm Vi Sửa Đổi (Đúng 2 Tệp)

1. `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\admin.html`
2. `c:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\admin.html` (mirror đồng bộ 100%)

---

## 3. Các Bước Triển Khai Cụ Thể

1. **Phase 1: Nâng cấp Tab 2 (`#pane-iam-stations`):**
   - Tách danh sách học viên thành `activeIamLearners` (có >= 1 trạm) và `inactiveIamLearners` (0 trạm).
   - Sort `activeIamLearners` theo: (a) số trạm hoàn thành giảm dần; (b) tổng điểm IAM giảm dần.
   - Render bảng chính cho `activeIamLearners`.
   - Render Accordion `<details>` thu gọn cho `inactiveIamLearners` với giao diện Tailwind chuyên nghiệp, font-mono, số lượng HV rõ ràng.

2. **Phase 2: Nâng cấp Tab 1 (`#pane-test-analytics`):**
   - Tách danh sách thành `activeTestLearners` (`totalAttempts > 0`) và `inactiveTestLearners` (`totalAttempts === 0`).
   - Sort `activeTestLearners` theo điểm cao nhất (`bestScore` giảm dần), sau đó số lần thi (`totalAttempts`).
   - Render bảng chính cho học viên đã thi.
   - Render Accordion `<details>` thu gọn cho học viên chưa thi (mặc định đóng).

3. **Phase 3: Nâng cấp Tab 3 (`#pane-blended-journey`):**
   - Tách danh sách thành `activeBlendedLearners` (có tiến độ > 0%) và `inactiveBlendedLearners` (0%).
   - Sort theo tiến độ 360% giảm dần.
   - Render Accordion thu gọn cho nhóm 0%.

4. **Phase 4: Kiểm thử UAT Headless Chrome & Đồng Bộ Mirror:**
   - Chạy kiểm thử tự động kiểm tra: (a) Học viên có bài thi và trạm IAM nổi lên đầu; (b) Bảng chính hiển thị gọn gàng; (c) Accordion mặc định đóng; (d) Click mở accordion bung danh sách người chưa làm.
   - Đồng bộ nguyên vẹn sang tệp mirror.
