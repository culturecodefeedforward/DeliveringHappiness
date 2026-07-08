# Agent Reporting Rules - Delivering Happiness Project

Quy chuẩn báo cáo này bắt buộc áp dụng cho mọi Agent (Codex, Claude, Gemini) tham gia dự án.

## 1. Ma Trận Kiểm Chứng Bề Mặt (Surface Verification Matrix)
Mọi báo cáo UAT hoặc Handoff phải bao gồm bảng ma trận sau:

| Bề mặt kiểm chứng (Verification Surface) | Phương pháp kiểm chứng (Method) | Kết quả kỳ vọng (Expected Output) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- |
| **Local files** | Grep trong allowlist logic | Các file logic cục bộ không chứa thông tin ngày cũ | [VERIFIED / UNVERIFIED / FAILED] |
| **Apps Script deployment** | Clasp push & status | Phiên bản deploy hoạt động chính xác | [VERIFIED / UNVERIFIED / FAILED] |
| **Public frontend URLs** | Probe HTTP trực tiếp 6 URLs live | Trả về nội dung ngày và event_id mới | [VERIFIED / UNVERIFIED / FAILED] |
| **Browser evidence** | Ảnh chụp UI live thực tế | Giao diện hiển thị chính xác | [VERIFIED / UNVERIFIED / FAILED] |
| **Final verdict** | Đối chiếu toàn diện ma trận | Tất cả bề mặt đều PASS | [VERIFIED completed / FAILED] |

## 2. Quy Tắc Hard-Gate Nghiêm Ngặt
1. **Không overclaim:** Cấm claim `VERIFIED` cho frontend/public nếu chưa chạy probe live URL trực tiếp.
2. **Không kết luận vội vã:** Chỉ được phép claim `Live done` nếu đã pass toàn bộ 6 URL live cốt lõi:
   - `/`
   - `/assessment.html`
   - `/register.html`
   - `/register_direct.html`
   - `/register-test.html`
   - `/dh8/`
3. **CTA Probe Enforcement:** Mọi URL được trỏ tới từ nút CTA (Call to Action) trên trang chủ bắt buộc phải nằm trong `live probe allowlist`.
4. **Pre-deploy Audit:** Bắt buộc audit `file inventory` (đối chiếu file tĩnh trong public root vs danh sách public entrypoints/CTA) trước khi gọi lệnh deploy nếu sử dụng phương pháp "thư mục deploy tạm" (partial workspace).
5. Nếu có bất kỳ bề mặt nào chưa kiểm chứng hoặc thất bại, Trạng thái tổng (`Final verdict`) bắt buộc phải là `UNVERIFIED` hoặc `FAILED`.

## 3. Critical Production Change Pipeline

Với `dh4hn-website`, mọi thay đổi backend, payment, email, UI live, Apps Script,
Vercel, Google Sheets, hoặc luồng có người dùng thật phải đi theo pipeline bắt
buộc sau:

1. **Plan bắt buộc:** Dùng skill/plan mode hoặc cơ chế tương đương trước khi sửa
   code. Plan phải có file allowlist, source of truth, rollback, UAT, approval
   boundary, và đường dẫn artifact repo-visible trong `Implementation Plan/`,
   `UAT/`, hoặc `Artifacts/`.
2. **Code-read gate trước khi sửa:** Trước khi code, Agent phải grep/read code
   thật để chứng minh hàm, dòng code, file target, scriptId/deploymentId, URL,
   hoặc sheet target thật sự tồn tại. Cấm viết snippet bằng trí nhớ.
3. **Skill/tool routing bắt buộc:** Với bug fix dùng `ck:fix` hoặc workflow fix
   tương đương; với implementation dùng `ck:cook` hoặc workflow cook tương
   đương; với plan lớn dùng `ck:plan` hoặc plan repo-visible; với UI/live flow
   dùng `ck:agent-browser` hoặc browser automation tương đương trong UAT plan đã
   được duyệt. Nếu skill/tool không có, phải ghi rõ `UNVERIFIED skill evidence`
   và dùng workflow thay thế có cùng checklist.
4. **Post-edit evidence gate:** Sau khi code, phải chạy diff/grep/test/browser
   evidence đúng bề mặt thay đổi và mirror evidence về repo-visible path. Không
   dùng code trace để claim UI/live.
5. **Claim gate:** Không claim `VERIFIED`, `done`, `ready`, `safe`, hoặc `PASS`
   nếu chưa có evidence path cụ thể.
6. **Risky operation gate:** Không commit, push, deploy, `clasp push`, DB/sheet
   mutation, scheduler mutation, hoặc external write nếu chưa có approval cấp
   độ 3 trực tiếp từ User trong phiên hiện tại.

Nếu thiếu bất kỳ bước nào, Agent phải dừng và báo `BLOCKED`, nêu rõ bước/evidence
còn thiếu; không tự execute để "làm tiếp cho nhanh".

## 4. Documentation Impact Gate

Với `dh4hn-website`, mọi thay đổi backend, payment, email, UI live, Apps Script,
Vercel, Google Sheets, hoặc luồng có người dùng thật phải có đánh giá tác động
tài liệu trước khi xin commit, push, deploy, `clasp push`, hoặc external write.

1. **Docs update bắt buộc khi đổi hành vi:** Nếu thay đổi làm đổi Apps Script,
   thanh toán, email, Google Sheets, public URL, deployment, user flow, UAT,
   runbook, hoặc source of truth, Agent phải dùng `ck:docs update` hoặc workflow
   tài liệu tương đương để cập nhật docs/runbook liên quan trong `docs/`,
   `Implementation Plan/`, `UAT/`, hoặc artifact repo-visible phù hợp.
2. **Docs impact none:** Nếu không cần sửa docs, báo cáo phải ghi rõ
   `Docs impact: none` kèm lý do và evidence từ `git diff`, file path, hoặc code
   đọc được. Không được im lặng bỏ qua.
3. **Pre-commit docs report:** Trước mọi đề xuất stage/commit/push/deploy,
   báo cáo phải có `Docs touched` hoặc `Docs impact: none`, và nêu rõ docs,
   plan, UAT, code, runtime target không mâu thuẫn.
4. **Stale docs block:** Nếu docs/runbook liên quan còn stale hoặc chưa kiểm tra,
   trạng thái tổng phải là `BLOCKED`; không được viết `ready`, `safe`, `PASS`,
   hoặc xin approve Cấp độ 3.
5. **Docs không thay verification:** Cập nhật docs không được dùng để claim
   frontend/live/email/payment đã chạy. Các bề mặt đó vẫn cần evidence riêng.

## 5. Repo Hygiene Continuity Gate

Với `dh4hn-website`, sau mỗi task có sửa/tạo file, sinh report, tạo artifact,
chạy workflow email/sheet/deploy, hoặc nhận handoff từ agent khác, Agent phải
chủ động kiểm tra và báo trạng thái repo trước khi kết thúc lượt.

Quy tắc bắt buộc:

1. **Git status bắt buộc:** Chạy `git status --short --branch` và phân loại mọi
   thay đổi còn lại thành 3 nhóm:
   - `Keep/commit later` (giữ lại để commit sau): file tài liệu, UAT, report,
     hoặc code có giá trị dài hạn.
   - `Archive outside repo` (lưu trữ ngoài worktree): file tạm, payload, script
     one-off, bản nháp, hoặc artifact chỉ phục vụ thao tác hiện tại.
   - `Restore/revert` (khôi phục về nguồn chuẩn): thay đổi tracked không còn
     nằm trong scope đã duyệt.
2. **Chủ động đề xuất cleanup:** Nếu repo còn dirty, Agent phải đề xuất một
   cleanup lane (luồng dọn dẹp) rõ ràng, có backup, không push/deploy/delete
   vĩnh viễn nếu chưa được User duyệt trực tiếp.
3. **Không để bẩn âm thầm:** Không được kết thúc bằng claim `done`, `safe`,
   `ready`, hoặc `VERIFIED` nếu vừa tạo dirty files mà không nêu rõ dirty files
   đó thuộc nhóm nào và bước xử lý tiếp theo.
4. **Backup-first:** Trước mọi restore/remove untracked, phải export patch tracked
   changes, copy untracked artifacts ra backup ngoài worktree, tạo manifest, và
   verify backup tồn tại.
5. **Rule update/Docs update ngoại lệ có kiểm soát:** Nếu task cuối cùng là cập
   nhật rule/docs, repo có thể còn dirty đúng file rule/docs đó, nhưng Agent phải
   nói rõ đây là intentional dirty state (trạng thái bẩn có chủ đích) và xin
   approval riêng nếu User muốn commit.
