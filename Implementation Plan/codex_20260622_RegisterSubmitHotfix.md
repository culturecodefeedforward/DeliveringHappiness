# Register Submit Hotfix 2026-06-22

## Scope

- Fix the broken DHM8 public registration submit flow on `register.html`.
- Limit the tracked production hotfix to `register.js` only.
- Keep DH9 local parity fix out of the tracked production commit because `register_dh9.js` is currently untracked in this repo checkout.

## Files Affected

- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.js`
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register_dh9.js` local-only parity fix, not for this tracked commit

## Root Cause

- `register.js` calls `normalizePaymentCodeToken(...)` during `DOMContentLoaded`.
- The helper is missing, which throws a runtime error before the form `submit` handler is attached.
- Result: browser falls back to default `GET` form submission and leaks form data into the address bar.

## Verification Plan

- `node --check register.js`
- Mock-browser submit test for `register.html` confirming no `pageerror`, no query-string submit, and success-state transition.
- Public post-deploy browser check on `https://delivering-happiness.vercel.app/register.html` confirming the missing-helper error is gone.

## Rollback

- Revert the hotfix commit on `main` if the public page regresses.
- Because the tracked change is a 4-line helper restore, rollback scope stays isolated to `register.js`.

## Approval Boundary

- Local code edit: completed.
- Commit/push/live auto deploy: proceeding from the user's direct instruction on 2026-06-22 to "làm nhanh đi".
