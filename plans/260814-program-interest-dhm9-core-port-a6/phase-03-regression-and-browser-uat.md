---
phase: 3
title: Regression và browser UAT
status: completed
priority: P1
effort: 2h
dependencies:
  - 2
---

# Phase 3: Regression và browser UAT

## Overview

Chạy kiểm thử regression và browser trên server Apps Script giả lập cục bộ. Mục
đích là chứng minh sequence/UI/data contract, không thay thế UAT production
thật và không gửi dữ liệu ra Google Sheet.

## Related Code Files

- Modify/create: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\UAT\program_interest_dhm9_core_port_a6_20260814.js`
- Create: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\UAT\evidence\program_interest_dhm9_core_port_a6_20260814\rerun-20260814.json`
- Modify: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\docs\system-architecture.md`
- Modify: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\docs\deployment-guide.md`

## Implementation Steps

1. Add a controllable local endpoint: POST settlement gate, JSONP status,
   recorded/not_found/error paths, and request log containing only fake fields.
2. Prove red-green behavior: old A4 source causes GET before POST settlement;
   A6 must not.
3. Run valid submit, invalid-phone/email, pending reload and manual retry cases;
   assert POST count, GET sequence, UUID/pending/UI and no external request.
4. Run Chrome desktop, Chrome incognito mobile and Brave mobile where available;
   capture screenshots, console/page errors and request log into repo-visible
   evidence.
5. Update docs with exact new sequence and clearly label live E2E as awaiting
   separate Cấp độ 3 approval.

## Success Criteria

- [x] Harness reports 19/19 cases pass with `externalWrites: NONE`.
- [x] Browser evidence proves responsive valid-success and invalid-blocked paths.
- [x] Docs/code/UAT describe the same `await POST -> GET polling` contract.
- [x] `git diff --check`, syntax and targeted UAT pass.

## Fresh evidence

- Local/browser UAT: `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/rerun-20260814.json` (`LOCAL_A6_UAT_VERIFIED`, 19/19).
- Compatibility regression: `UAT/evidence/program_interest_dhm9_core_port_a6_20260814/compat-a2-a4/local-results-rerun/local-results.json` (`LOCAL_A6_COMPAT_UAT_VERIFIED`).

## Approval Boundary

No commit, push, deploy, rollback or Sheet mutation belongs to this plan. After
local/browser completion, request one separate Cấp độ 3 quote for any such
operation with exact commands, target and rollback.
