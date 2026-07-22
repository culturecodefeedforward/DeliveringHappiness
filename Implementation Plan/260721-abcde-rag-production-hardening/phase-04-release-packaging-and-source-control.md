---
phase: 4
title: "Release Packaging and Source Control"
status: in_progress
effort: "45-90 phút"
---

# Phase 4: Release Packaging and Source Control

## Overview

Đưa thay đổi vào source control (quản lý phiên bản mã nguồn) mà không mang theo working tree bẩn, rồi tạo gói production sạch giữ nguyên các runtime live ngoài ABCDE và overlay (chồng chính xác) file ABCDE đã kiểm thử.

## Implementation Steps

1. Tại worktree cô lập, chạy test/build/quality gate lần cuối và `git status --short --branch`.
2. Stage commit 1 bằng allowlist cụ thể; trước lệnh thật phải in lại ba bucket Git. Dự kiến:
   - runtime/test/data/docs;
   - toàn bộ file trong `Implementation Plan/260721-abcde-rag-production-hardening/`;
   - local UAT report và log đã lược secret.
3. Commit 1: `git commit -m "feat(abcde): harden RAG beta production path"`.
4. Xác minh Vercel production branch là `main`; sau đó push chỉ bằng:
   - `git push -u origin codex/abcde-rag-production-hardening-20260721`.
5. Không mở merge, không push `main`, không stage file ngoài allowlist. Nếu branch push tạo preview, dùng preview để probe API trước production; preview không được thay production alias.
6. Tạo `C:\tmp\dh4hn-abcde-rag-release-clean-20260722` từ audited runtime allowlist của gói live đã UAT ngày 21/07, rồi overlay runtime ABCDE từ worktree. Chỉ giữ `.vercel/project.json` làm targeting metadata đã xác minh; không giữ README/cache/output trong `.vercel`.
7. Sinh `release-manifest.sha256`; xác nhận:
   - không có `.git`, `.env*`, `node_modules`, secret, scratch, backup;
   - hash các file ABCDE trùng worktree;
   - KB và manifest nằm đúng path;
   - các file public đã có trên live hiện tại không bị thiếu.
8. Chạy `vercel build` hoặc dry-run tương đương trong gói sạch; probe preview nếu khả dụng.
9. Sau live UAT, tạo commit 2 chỉ gồm report/screenshot/log đã lược secret: `git commit -m "test(abcde): record production UAT evidence"`, rồi push cùng branch lần hai.

## Git Buckets Bắt Buộc Trước Commit

- `Files safe to stage`: chỉ file được liệt kê trong plan và được sửa trong worktree cô lập.
- `Files already committed`: KB hoặc frontend nào đã có ở `origin/main` và không đổi sẽ không stage lại.
- `Files not safe to stage`: `node_modules/**`, `.env*`, `.vercel/**`, `release_inspect_20260718/**`, Program Interest, registration, payment, scratch và mọi file không có trong allowlist.

## Stop Conditions

- Production branch không phải `main`, hoặc push feature branch có thể cập nhật production alias.
- Worktree có file ngoài allowlist hay `node_modules`.
- Release manifest khác hash code đã test, hoặc thiếu một public runtime file của live hiện tại.
- Preview/build không có KB trong function bundle.

## Success Criteria

- [ ] Tối đa hai commit, đều chỉ trên branch ABCDE đã duyệt.
- [ ] `main` local/remote không bị push hoặc merge.
- [x] Gói sạch có manifest, không secret, không `node_modules`.
- [x] Hash runtime ABCDE trong gói deploy trùng code đã test.
- [ ] Bằng chứng live sau cùng được mirror về branch bằng commit 2.
