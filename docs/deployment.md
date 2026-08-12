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
   vercel --cwd "<absolute-clean-output-dir>" `
     --project prj_WmpFNOKRpCmjkhvKAWAWLaTZOK9I `
     --scope team_EYFhiG6AAZHxuxmOMgk4wsS7 `
     --prod --skip-domain --yes
   ```

5. Chạy staged UAT cho đủ 7 routes (6 route lõi và `/program-interest`), header
   provenance và browser desktop/mobile:

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
