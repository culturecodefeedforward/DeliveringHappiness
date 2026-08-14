---
phase: 1
title: Audit và khóa hợp đồng
status: completed
priority: P1
effort: 1h
dependencies: []
---

# Phase 1: Audit và khóa hợp đồng

## Overview

Đọc toàn bộ lõi submit DHM9 và đối chiếu với Program Interest A4, tách phần
thuật toán dùng chung khỏi payment/QR/duplicate-phone theo lane DHM9.

## Related Code Files

- Read: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\register_dh9.js`
- Read: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\program-interest.html`
- Read-only backend contract: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\Scripts\active_code_gs_final.js`
- Update: `plans/260814-program-interest-dhm9-core-port-a6/plan.md`

## Implementation Steps

1. Trace form -> payload -> POST -> status -> UI success/error in both files.
2. Record every divergence, including ordering, validation, retry and evidence
   surface; do not infer production root cause from source alone.
3. Mark only reusable submission-confirmation core for port. Explicitly exclude
   payment code, QR, SePay webhook and phone duplicate semantics.
4. Lock H-01..H-03 and acceptance tests in the overview matrix.

## Success Criteria

- [ ] Matrix names source functions and exact behavioral divergence.
- [ ] Root cause claim level distinguishes VERIFIED source from UNVERIFIED live.
- [ ] Scope excludes Apps Script/schema/token/env/panel and all external writes.
