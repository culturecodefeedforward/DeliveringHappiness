---
phase: 1
title: "Baseline and Isolation"
status: completed
effort: "45-75 phút"
---

# Phase 1: Baseline and Isolation

## Overview

Tạo baseline (mốc hiện trạng) có thể kiểm chứng, sao lưu bằng chứng và cô lập công việc khỏi `main` đang bẩn. Pha này không tác động hệ thống live.

## Implementation Steps

1. Ghi vào `Artifacts/abcde-rag-hardening-20260721/baseline.md`:
   - `git status --short --branch`, HEAD và `origin/main`.
   - SHA-256 của `api/chat-abcde-rag.js`, `api/chat-abcde.js`, `vercel.json`, KB và các file plan.
   - deployment Vercel đang giữ alias, deployment rollback và danh sách tên env production; không ghi secret vào report.
   - danh sách Apps Script deployments/versions và script ID.
2. Phân loại Git bắt buộc:
   - `Files safe to stage`: chỉ file ABCDE trong allowlist (danh sách cho phép) của plan.
   - `Files already committed`: xác định theo `origin/main`.
   - `Files not safe to stage`: toàn bộ `node_modules`, Program Interest, registration, scratch và file ngoài scope.
3. Tạo worktree tại `C:\tmp\dh4hn-abcde-rag-hardening-20260721` từ `origin/main`, branch `codex/abcde-rag-production-hardening-20260721`.
4. Copy có kiểm soát endpoint RAG và các artifact ABCDE chưa có ở `origin/main`; ghi manifest nguồn/đích và checksum, không copy cả thư mục bẩn.
5. Clone read-only Apps Script version 69 vào `C:\tmp\dh4hn-gas-v69-inspect-20260721`; xác nhận `ChatVersion`, `ABCDE_Data`, email report và không có syntax error.
6. Freeze source inventory (đóng băng danh mục nguồn) cho corpus: CSV/Markdown hiện tại và bốn NotebookLM DH7 `e9f7d3f6-036a-4c40-8580-66d688c7642f`, DHM3 `1601679f-ca32-40bb-bb8c-aaedc4e50906`, DHM4 `83c60631-fcfc-4138-b96a-bc99826be158`, DH8 `6a4d1fae-d0e6-4934-94f5-34d916c929f7`.
7. Chạy probe read-only (thăm dò chỉ đọc) với các deployment DHM8, DHM9 và Program Interest trước khi có bất kỳ thay đổi ngoài nào; lưu status code/kết quả đã lược secret.
8. Xác nhận project Vercel dùng production branch `main`; branch ABCDE không được tự kích hoạt production deploy.

## Stop Conditions

- `origin/main` đổi trong lúc tạo worktree hoặc branch đã tồn tại với nội dung không rõ nguồn.
- Không xác minh được script ID/version 69 hoặc clone version 69 không có `ChatVersion`.
- Không xác minh được deployment Vercel rollback.
- Phát hiện cần sửa file ngoài allowlist.

## Success Criteria

- [x] Baseline và checksum nằm trong repo-visible artifact (artifact nhìn thấy trong repo).
- [x] Worktree sạch trước khi port file; không có `node_modules` trong diff.
- [x] Remote Apps Script version 69 được xác nhận có contract `ChatVersion`.
- [x] Source inventory ghi đúng notebook/source counts và không chứa credential.
- [x] Các live probe cũ vẫn pass trước thay đổi.
- [x] Không có mutation (ghi thay đổi) live trong pha 1.
