# Kế hoạch sửa lỗi 404 `/program-interest` — 2026-08-06

## Mục tiêu

Khôi phục trang `program-interest.html` trên domain production và đưa frontend
Program Interest cùng backend `PROGRAM_INTEREST` về một bản phát hành có nguồn
chuẩn trong Git.

## Bằng chứng trước khi sửa

- Production URL `https://delivering-happiness.vercel.app/program-interest` trả
  `HTTP 404` và header `X-Vercel-Error: NOT_FOUND`.
- `origin/main` có `index.html`, `interest.html`, và backend nền nhưng không có
  `program-interest.html` hoặc phần `PROGRAM_INTEREST`.
- Working tree local có `program-interest.html` là file chưa được Git theo dõi;
  `Scripts/active_code_gs_final.js` chứa phần backend tương ứng nhưng đang sửa
  local.
- Báo cáo lịch sử ngày 2026-07-18 ghi rõ đã đưa bản trực tiếp lên public nhưng
  không commit hoặc Git push.

## Phạm vi file cho bản sửa

- `program-interest.html`
- `Scripts/active_code_gs_final.js` — phần `PROGRAM_INTEREST`
- `release-specs/dhm10-homepage.json` — khai báo route và contract marker
- Tài liệu kế hoạch và UAT/release evidence liên quan

Không stage các thay đổi local khác. Không đổi CTA homepage từ `interest.html`
sang `program-interest.html` trong lượt này.

## Quy trình thực hiện

1. Tạo worktree sạch từ `origin/main`; bảo toàn worktree local đang bẩn.
2. Port chính xác frontend và backend Program Interest vào worktree sạch.
3. Kiểm tra route inventory, release contract, endpoint/backend contract, cú
   pháp, và tạo package phát hành từ cùng commit bất biến.
4. Commit/push đúng allowlist sau khi có ủy quyền thao tác rủi ro của User.
5. Phát hành staged bằng `vercel --prod --skip-domain`, ghi deployment ID.
6. Chạy kiểm thử HTTP, browser/DOM và backend contract trên staged URL; lưu
   `UAT/releases/<release-id>/final-verdict.json`.
7. Chỉ `vercel promote <deployment-id>` sau khi có ủy quyền riêng và rollback
   về deployment production trước đó đã được ghi nhận.

## Tiêu chí hoàn tất

- Git chứa frontend và backend cùng một commit/release ID.
- Gói staged có `program-interest.html` và route trả HTTP 200.
- Production alias trả HTTP 200 cho `/program-interest` và giao diện form tải
  được trên desktop/mobile.
- Không có thay đổi ngoài allowlist bị đưa vào commit.

## Rủi ro và quay lui

- Worktree local đang có nhiều thay đổi không liên quan; không reset/clean/xóa.
- Nếu staged UAT thất bại, không promote; giữ production deployment cũ.
- Nếu sau promote có lỗi, quay lại deployment ID production trước đó.
