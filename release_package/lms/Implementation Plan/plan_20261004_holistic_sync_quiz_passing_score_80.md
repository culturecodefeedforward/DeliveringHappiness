# Kế Hoạch Triển Khai (Implementation Plan) — Đồng Bộ Toàn Diện Quy Chế Cổng Vượt Chặng (≥ 80% / 8/10 Câu)

- **Ngày lập**: 04/10/2026
- **Trạng thái**: Chờ phê duyệt Cấp độ 2 (Awaiting Level 2 Approval)
- **Mục tiêu**: Đồng bộ hóa toàn diện thông tin quy chế sát hạch Cổng Vượt Chặng Chặng 1 (10 câu trắc nghiệm) từ mức cũ `≥ 70%` (7/10 câu) sang mức chuẩn hóa mới `≥ 80%` (8/10 câu đúng) trên toàn bộ hệ thống tài liệu kiến trúc, tài liệu dự án, prompt tái đóng gói và kỹ năng toàn cục (Global Skill `dhm-blended-lms`).

---

## 1. Nguồn Chuẩn (Source of Truth)
- **Quy chế Blended LMS DHM**: Cổng Sát Hạch / Vượt Chặng Chặng 1 (Bài 1.4) yêu cầu học viên đạt tối thiểu `8/10 câu đúng (≥ 80%)` sau tối đa 3 lần thử để đủ điều kiện mở khóa Chặng 2 (Lớp trực tiếp Offline) và Chặng 3.
- **Mã nguồn hệ thống thực tế**: Đã cập nhật và kiểm chứng thành công trên Live Vercel tại commit `9088bda` (`lms/app.js` và `lms/index.html`).

---

## 2. Danh Sách Tệp Trong Phạm Vi (Allowlist)

### Nhóm 1: Tài liệu Kỹ thuật & Dự án tại `dh4hn-website/docs/`
1. `docs/PROMPT_DONG_GOI_SKILL.md`: Cập nhật ngưỡng đạt sát hạch `≥ 80% (8/10 câu)`.
2. `docs/RESUME_PROJECT_PROMPT.md`: Cập nhật điều kiện mở khóa 3 Chặng sau khi đạt `≥ 80%`.
3. `docs/codebase-summary.md`: Cập nhật mô tả bộ điều khiển `app.js` với ngưỡng đạt `≥ 80%`.
4. `docs/project-overview-pdr.md`: Cập nhật cổng sát hạch đầu vào Chặng 1 và cơ chế tự thu gọn banner Hero khi đạt `≥ 80%`.
5. `docs/project-roadmap.md`: Cập nhật các mốc qualifying quiz `≥ 80%` và điều kiện mở khóa học viên chính thức.
6. `docs/system-architecture.md`: Cập nhật biểu đồ tuần tự và đặc tả bộ điều khiển client với ngưỡng `≥ 80%`.

### Nhóm 2: Tài liệu Đồng bộ tại `Teaching DH/docs/`
7. `Teaching DH/docs/DHM_BLENDED_LMS_STANDARDIZED_ARCHITECTURE.md`: Cập nhật quy chế qualify `8/10 câu đúng (≥ 80%)`.
8. `Teaching DH/docs/PROMPT_DONG_GOI_SKILL.md`: Đồng bộ với tệp tại `dh4hn-website`.
9. `Teaching DH/docs/RESUME_PROJECT_PROMPT.md`: Đồng bộ với tệp tại `dh4hn-website`.
10. `Teaching DH/docs/codebase-summary.md`: Đồng bộ với tệp tại `dh4hn-website`.
11. `Teaching DH/docs/project-overview-pdr.md`: Đồng bộ với tệp tại `dh4hn-website`.
12. `Teaching DH/docs/project-roadmap.md`: Đồng bộ với tệp tại `dh4hn-website`.
13. `Teaching DH/docs/system-architecture.md`: Đồng bộ với tệp tại `dh4hn-website`.

### Nhóm 3: Kỹ năng Toàn cục (Global Skills)
14. `C:\Users\vu.hoang\.gemini\config\skills\dhm-blended-lms\SKILL.md`: Cập nhật nguyên lý Qualifying Gate `≥ 80% (8/10 câu)`.
15. `C:\Users\vu.hoang\.gemini\config\skills\dhm-blended-lms\examples\prompt-template-1click.md`: Cập nhật prompt mẫu với ngưỡng `≥ 80%`.

---

## 3. Ranh Giới An Toàn (Boundary & Exclusions)
- **Giữ nguyên lý thuyết tâm lý học**: "Quy tắc vàng 4%" của Mihaly Csikszentmihalyi về trạng thái Flow (nhiệm vụ có độ khó thách thức khoảng 7/10) trong nội dung bài học văn hóa và tài liệu là nguyên lý học thuật, **không phải bài kiểm tra sát hạch** ➔ Giữ nguyên không can thiệp.
- **Không sửa các tệp ngoài Allowlist**: Không can thiệp vào các tệp mã nguồn HTML/JS của các biểu mẫu đăng ký khác (`register.html`, `checkin.html`...) do không chứa thông tin quy chế này.

---

## 4. Phương Án Triển Khai (Execution Steps)
1. **Bước 1 (Sao lưu)**: Tạo bản sao lưu `.bak_20261004_sync80` cho tất cả 15 tệp trong Allowlist.
2. **Bước 2 (Chỉnh sửa)**: Sử dụng `replace_file_content` chỉnh sửa chính xác từng đoạn văn bản từ `≥ 70%` / `7/10 câu` sang `≥ 80%` / `8/10 câu`.
3. **Bước 3 (Kiểm chứng UTF-8 & Đọc lại)**: Đọc lại toàn bộ nội dung tệp bằng UTF-8 explicit, chạy kịch bản quét tự động để khẳng định không còn sót quy chế cũ.
4. **Bước 4 (Báo cáo & Phê duyệt Cấp độ 3)**: Trình báo kết quả cục bộ (`Local done`) và cung cấp khối phê duyệt Cấp độ 3 trước khi commit/push lên GitHub.

---

## 5. Phương Án Quay Lui (Rollback Plan)
Nếu có bất kỳ sai lệch nào:
- Với các tệp chưa commit trong git: `git checkout -- <files>`
- Với các tệp global skill: Phục hồi trực tiếp từ bản sao lưu `.bak_20261004_sync80`.
