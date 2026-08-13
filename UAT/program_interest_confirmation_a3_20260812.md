# UAT Report — Program Interest A3-FE — 2026-08-13

## Verdict

`LOCAL_A3_UAT_VERIFIED` trên local/browser interception surface (bề mặt local
và trình duyệt được chặn request thật). Chưa phải `Repo done` (đã commit/push)
hoặc `Live done` (đã deploy production).

- Source worktree: `C:\Users\vu.hoang\.gemini\antigravity\worktrees\dh4hn-website\program-interest-a3-20260813`
- Base commit: `d7ef9d37669fafe7d533340ca201f8b5bf469e97` (A2)
- Form SHA-256: `409b38cb9f76f5fc53b9e47393b1953474797c3a727ef5e8a17bb7f784eb8852`
- Course detail panel hash: `8B533EAEBFD505425548397A3A519C38E923EA1B3455207FA963FE825E6B44AC`
  unchanged from A2 baseline.
- Detailed result: `UAT/evidence/program_interest_confirmation_a3_20260812/local-results.json`
- Browser evidence: `UAT/evidence/program_interest_confirmation_a3_20260812/*.png`
- External writes: `NONE`
- Apps Script requests continued: `0`

## Root cause addressed

A2 `submit` handler awaited the `no-cors POST` before starting status JSONP. A3-FE
now fires exactly one POST with a rejection observer and starts status polling
immediately using the same UUID. Success still requires `recorded` plus matching
UUID; no optimistic success was added.

Apps Script, Google Sheet schema, token, env, panels and program options were not
changed.

## Negative baseline

The same A3 race test was run against the A2 frontend (`A2_EXPECTED_A3_FAILURE`).
It failed at `AT-A3-02` after 8 seconds because A2 waited for the intentionally
pending POST and never started status polling. Evidence:

`UAT/evidence/program_interest_confirmation_a3_20260812/baseline-a1-failure.json`

This is an expected red baseline, not a production failure.

## Test results

17 result records passed in the A3 run:

- `AT-A3-02`: status `recorded` completed UI success before pending POST resolved;
  1 POST, 1 status, post→status start `2 ms`.
- `AT-A2-01/02`: timeout and POST network failure still recover with one POST.
- `AT-A2-03/04/05`: ten-attempt retry, manual “Kiểm tra lại” and reload recovery;
  retry/manual paths do not add POST.
- `AT-A2-06/07/08`: preflight idempotency, same UUID for unchanged payload,
  new UUID for changed payload.
- `AT-A2-09/G02`: permanent UUID errors and malicious error text fail closed and
  sanitize error code.
- `AT-A2-10/G01`: storage privacy and 32-hex fallback UUID.
- `AT-A2-11`: Chrome desktop 1440×900, Brave mobile 390×844 and Chrome
  incognito 390×844.

## Surface verification matrix

| Surface | Method | Result | Status |
|---|---|---|---|
| Local source | `node --check`, `git diff --check`, allowlist grep | Syntax/diff clean; no backend/schema/env/panel edit | VERIFIED |
| A2 regression | Existing reliability scenarios | All A2 cases pass in A3 worktree | VERIFIED |
| A3 race | Pending POST interception + recorded status | UI success before POST resolution; one POST | VERIFIED |
| Browser | Puppeteer request interception, Chrome/Brave/incognito | Desktop/mobile/fallback evidence captured | VERIFIED |
| Apps Script runtime | Intentionally blocked in local harness | No real request continued | UNVERIFIED for live runtime |
| Google Sheet | No write in Phase 1–3 | Not exercised | UNVERIFIED / intentionally deferred |
| Production URL | No deploy/promote in Phase 1–3 | A2 production unchanged | UNVERIFIED for A3 |

## Docs impact

Updated in this worktree:

- `docs/system-architecture.md`: A3-FE parallel POST/status flow, one-POST
  invariant and client-vs-backend latency boundary.
- `docs/deployment-guide.md`: A3 race assertions, latency baseline path and
  release boundary.

## Remaining gates

- Phase 4 requires clean release packaging and separate Cấp độ 3 approval for
  commit, push, staged deploy, promote and one real Sheet UAT row.
- Staged browser SSO/Protection failure remains fail-closed; no bypass.
- `A3-BE` (Apps Script index/cache) is deferred and not part of this change.
