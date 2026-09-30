<<<<<<< Updated upstream
# Vercel production release runbook

Tài liệu này là `source of truth` (nguồn chuẩn) cho phát hành frontend Delivering Happiness. Phần frontend trong `docs/deployment-guide.md` là hướng dẫn lịch sử và không được dùng để thao tác production.

## Production identity

- Project: `delivering-happiness`
- Project ID: `prj_WmpFNOKRpCmjkhvKAWAWLaTZOK9I`
- Organization ID: `team_EYFhiG6AAZHxuxmOMgk4wsS7`
- Production URL: `https://delivering-happiness.vercel.app`
- Release contract: `release-specs/dhm10-homepage.json`

Tên `projectName` trong `.vercel/project.json` có thể là display name cũ sau khi project được đổi tên. Project ID và organization ID là binding có thẩm quyền; build gate sẽ fail-closed nếu hai ID này không khớp.

## Mandatory release flow

1. Bắt đầu từ một worktree sạch và commit đã được review.
2. Tạo package từ immutable Git snapshot:

   ```powershell
   node Scripts/build_release_package.js --source HEAD --out "<absolute-clean-output-dir>"
   ```

3. Đọc `release.json`; ghi lại release ID, commit SHA và manifest SHA-256.
4. Deploy staged production target nhưng không gắn domain:

   ```powershell
   vercel --cwd "<absolute-clean-output-dir>" --prod --skip-domain --yes
   ```

5. Chạy staged UAT cho đủ 6 routes, header provenance và browser desktop/mobile:

   ```powershell
   node Scripts/verify_vercel_live_gate.js `
     --phase staged `
     --deployment-url "<staged-deployment-url>" `
     --spec release-specs/dhm10-homepage.json `
     --release-id "<release-id>" `
     --commit "<commit-sha>" `
     --manifest-hash "<manifest-sha256>" `
     --out-dir "UAT/releases/<release-id>/staged"
   ```

6. Chỉ xin phê duyệt `vercel promote <deployment-id-or-url>` sau khi verdict là `STAGED_RELEASE_VERIFIED`.
7. Sau promotion, chạy lại gate với `--phase production` và `--production-url https://delivering-happiness.vercel.app`.
8. Chỉ claim `Live done` khi verdict là `LIVE_VERIFIED` và evidence đã mirror vào `UAT/releases/<release-id>/production/`.

## Protection and credentials

- Không in token/bypass secret vào log hoặc artifact.
- Nếu staged deployment dùng Vercel Protection, cấp `VERCEL_AUTOMATION_BYPASS_SECRET` qua môi trường runtime hoặc GitHub Actions secret.
- Nếu thiếu bypass secret và staged browser bị chuyển sang SSO, verdict phải fail-closed; không promote.
- Không thay đổi token, environment variable hoặc protection setting chỉ để vượt qua gate nếu chưa có phê duyệt riêng.

## Rollback

1. Ghi deployment đang giữ production alias trước khi promote.
2. Nếu post-promotion verification fail, chạy:

   ```powershell
   vercel rollback <previous-production-deployment-url>
   ```

3. Verify lại production URL bằng cùng release contract của deployment rollback.
4. Không dùng `git reset --hard`; nếu code cần quay lui, tạo revert commit có review.

## Prohibited shortcuts

- Không chạy `vercel --prod` trực tiếp từ dirty root.
- Không deploy từ thư mục tạm không có `release.json` và provenance headers.
- Không coi trạng thái Vercel `Ready` là `Live verified`.
- Không dùng localhost, screenshot cũ hoặc report cũ để chứng minh production.
- Không promote trước staged UAT.
=======
# Vercel Production Release Runbook

Tài liệu này là `source of truth` (nguồn chuẩn) cho phát hành frontend production của Delivering Happiness. `docs/deployment-guide.md` chỉ cung cấp hướng dẫn backend/config và không thay thế runbook này.

## 1. Release Sources

*   Production alias: `https://delivering-happiness.vercel.app`.
*   Release contract: file JSON được duyệt trong `release-specs/`.
*   Package builder: `Scripts/build_release_package.js`.
*   Verification gate: `Scripts/verify_vercel_live_gate.js`.
*   Workflow điều phối: `.github/workflows/production-release.yml`.
*   `vercel.json` hiện chỉ bật clean URLs; file này không phải route inventory.

Release contract là nơi gắn project identity, source file, route, expected text và forbidden text. Không chép lại các giá trị vận hành đó vào tài liệu khác.

## 2. Preconditions

1. Dùng worktree sạch tại commit đã review; chạy `git status --short --branch` và dừng nếu source/release config còn dirty ngoài allowlist.
2. Xác nhận package input và chính các release tool tồn tại trong cùng snapshot bằng `git ls-tree`; file chỉ tồn tại local/untracked không được đưa vào release.
3. Ghi lại commit SHA, rollback deployment hiện tại và phạm vi route thay đổi.
4. Không in token, bypass secret, environment variable hoặc credential vào log/artifact.

> **Cảnh báo checkout ngày 08/08/2026:** `main` local đang chậm `origin/main` ba commit; working copy của package builder/verification workflow bị lệch bản committed, và release contract chưa có trong working tree. Không chạy các lệnh bên dưới từ checkout bẩn này. Hãy tạo clean worktree tại `a0b4b6f` hoặc commit mới hơn đã review, rồi xác minh lại tool CLI và release contract.

## 3. Mandatory Release Flow

### Bước 1 — Tạo package bất biến

```powershell
node Scripts/build_release_package.js --source HEAD --out "<absolute-clean-output-dir>"
```

Đọc `release.json`; ghi release ID, commit SHA và manifest SHA-256. Package phải được tạo từ cùng commit sẽ dùng để kiểm chứng và promote.

### Bước 2 — Deploy bản staged không gắn domain

```powershell
vercel --cwd "<absolute-clean-output-dir>" --prod --skip-domain --yes
```

Lệnh này là thao tác production có rủi ro và cần phê duyệt Cấp độ 3 cho exact command/target. Trạng thái Vercel `Ready` chỉ chứng minh deployment tồn tại, không chứng minh production alias.

### Bước 3 — UAT staged

Chạy `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) cho **toàn bộ route trong release contract**, gồm HTTP, provenance header và browser desktop/mobile:

```powershell
node Scripts/verify_vercel_live_gate.js `
  --phase staged `
  --deployment-url "<staged-deployment-url>" `
  --spec "<release-spec-path>" `
  --release-id "<release-id>" `
  --commit "<commit-sha>" `
  --manifest-hash "<manifest-sha256>" `
  --out-dir "UAT/releases/<release-id>/staged"
```

Chỉ chuyển bước khi verdict là `STAGED_RELEASE_VERIFIED` và artifact khớp release identity.

### Bước 4 — Promote có phê duyệt riêng

Xin phê duyệt Cấp độ 3 trực tiếp từ User cho đúng lệnh và deployment đã qua staged UAT:

```powershell
vercel promote "<deployment-id-or-url>" --yes
```

Approval của GitHub environment hoặc agent khác không thay thế phê duyệt trực tiếp này.

### Bước 5 — Kiểm chứng production

Chạy lại cùng gate với `--phase production` và đúng production alias. Chỉ claim `Live done` khi verdict là `LIVE_VERIFIED` và evidence đã lưu tại `UAT/releases/<release-id>/production/`.

## 4. Route Integrity

*   Với `cleanUrls`, `/program-interest` ánh xạ tới `program-interest.html`; route vẫn phải có trong package Git snapshot và release contract.
*   `interest.html` dùng hợp đồng `DH_INTEREST`; `program-interest.html` dùng `PROGRAM_INTEREST` và UUID confirmation. Không dùng kết quả của route này để chứng minh route kia.
*   Mọi CTA target thay đổi phải được thêm vào release contract và probe trực tiếp trên production alias.

## 5. GitHub Workflow

Workflow `Verified production release` dùng `workflow_dispatch` (chạy thủ công) với staged URL, release ID, commit SHA và manifest hash. Job đầu kiểm chứng staged; job production promote đúng deployment rồi kiểm chứng lại. Workflow không tự hợp thức hóa dirty source, thiếu artifact hoặc thiếu phê duyệt User.

## 6. Protection, Rollback và Điều cấm

*   Nếu staged deployment dùng Vercel Protection, cấp bypass secret qua secret store/runtime; thiếu secret hoặc bị chuyển sang SSO phải fail-closed.
*   Trước promote, ghi deployment đang giữ production alias. Nếu post-promotion verification fail, rollback đúng deployment trước đó rồi chạy lại production gate.
*   Không dùng `git reset --hard`; quay lui source bằng revert commit đã review.
*   Cấm deploy trực tiếp từ dirty root, package tạm thiếu `release.json`, localhost, screenshot cũ hoặc report cũ.
*   Cấm coi docs, build thành công, HTTP 200 ở URL khác hoặc Vercel `Ready` là bằng chứng production.

## 7. Evidence Boundary

Lượt cập nhật tài liệu ngày 08/08/2026 chỉ kiểm chứng file local và Git tracking state. Các lệnh `--source`, `--out`, `--spec` và `--phase` được đối chiếu với bản committed ở `origin/main`, không phải working copy đang lệch. Không chạy deploy, promote, HTTP/browser live probe hoặc thay đổi cấu hình Vercel; trạng thái production hiện hành vẫn `UNVERIFIED`.
>>>>>>> Stashed changes
