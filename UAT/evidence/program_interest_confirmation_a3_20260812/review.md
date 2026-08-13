# A3-FE review — Phase 1–3

## Decision lane

| ID | Severity | Finding | Evidence | Verdict |
|---|---|---|---|---|
| H-01 | HIGH | Status could be delayed until POST completion | A2 baseline failed `AT-A3-02`; A3 run passes status recorded before pending POST resolved | Fixed |
| H-02 | HIGH | Race `not_found` before append could cause duplicate POST | A3 keeps one POST per submit and existing polling/preflight; `AT-A2-07` passes same UUID | Controlled |
| H-03 | HIGH | Optimistic success would lose write proof | A3 still requires `recorded` + matching UUID in `inspectStatusResult` | Not introduced |
| H-04 | HIGH | Course panels or backend could change accidentally | Scope audit shows no forbidden tracked changes; panel hash unchanged | Controlled |
| M-01 | MEDIUM | Backend p95 may remain high | Read-only baseline p95 12.098s; docs explicitly separate status latency from write latency | Deferred to A3-BE |

## Checks

- No new dependencies or schema changes.
- No raw payload/PII added to sessionStorage, URL or console.
- `Apps Script requests continued: 0` in local harness.
- Browser matrix includes Chrome desktop, Brave mobile and Chrome incognito.
- `ck` subagent orchestration was unavailable (`unsupported call`); this report is
  direct severity-first review and not a delegated reviewer claim.

## Verdict

`REVIEWED — no open CRITICAL/HIGH finding for Phase 1–3 scope.` Phase 4 remains
blocked behind release/external-operation approvals and is not included here.
