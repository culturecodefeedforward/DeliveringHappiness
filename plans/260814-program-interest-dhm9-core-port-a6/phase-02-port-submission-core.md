---
phase: 2
title: Port lõi gửi và xác nhận
status: completed
priority: P1
effort: 2h
dependencies:
  - 1
---

# Phase 2: Port lõi gửi và xác nhận

## Overview

Port đúng phần submit core của DHM9 phù hợp Program Interest: validate trước
POST, lưu pending state, await POST `no-cors`, sau đó poll cùng UUID. Giữ
idempotency (chống trùng dữ liệu) A2/A4 và không đọc response POST opaque.

## Related Code Files

- Modify: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\program-interest.html`
- Modify: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\UAT\program_interest_confirmation_reliability_20260812.js`
- Create: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\UAT\program_interest_dhm9_core_port_a6_20260814.js`
- Create: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a6-20260814\UAT\program_interest_dhm9_core_port_a6_20260814.md`

## Implementation Steps

1. Add an adapter that validates Program Interest full name, email, phone,
   program and consent using the applicable backend rules before POST; present
   field-level Vietnamese error and preserve user input.
2. Extract `postProgramInterest(payload)` from submit handler, retaining exact
   endpoint/payload/no-cors contract, and await it before `confirmRecorded`.
3. Keep POST transport opaque: catch transport failure then still poll same UUID
   because server may have received it; never create a second UUID or automatic
   second POST.
4. Make pending phases truthful: `posting` before dispatch and `confirming`
   only after POST settles/catches; retain reload/manual check-only behavior.
5. Do not change program panels, payload fields, backend, Sheet schema or docs
   until behavior is verified.

## Success Criteria

- [ ] Valid submit sends at most one POST and no GET status starts before it settles.
- [ ] Invalid client/backend-contract input sends zero POST and shows actionable UI.
- [ ] Existing pending reload and “Kiểm tra lại” execute GET-only.
- [ ] No source change outside approved frontend/UAT/docs/plan allowlist.

## Risk Assessment

- `no-cors` is opaque: do not promise HTTP-level POST diagnostics.
- Sequential dispatch can add response-settlement latency; measure it in local
  UAT rather than reintroduce fire-and-observe race.
- A real Apps Script deployment mismatch remains a production E2E question and
  cannot be resolved without Cấp độ 3 one-row UAT.
