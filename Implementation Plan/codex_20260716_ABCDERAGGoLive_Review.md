# Codex Review: ABCDE RAG Beta Go-Live Plan

Date: 2026-07-16
Reviewer: Codex
Target plan: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260716_ABCDERAGGoLive_Plan.md`
Related UAT: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\walkthrough_20260716_abcde_rag_beta.md`

## Rule And Skill Evidence

- Shared rules: `C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md`
- Project rules: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\AGENT_REPORTING_RULES.md`
- Skill: `C:\Users\vu.hoang\.codex\skills\check-before-approve\SKILL.md`
- Vercel docs checked:
  - `https://vercel.com/docs/functions/limitations`
  - `https://vercel.com/kb/guide/troubleshooting-function-250mb-limit`
  - `https://vercel.com/docs/functions/runtimes/wasm`

## Verdict

REQUEST CHANGES before approving commit, Vercel production deploy, or Google Apps Script push.

Core direction is good: stable and beta are separate, RAG is behind a kill switch, and frontend has fallback to stable. The plan still misses two production blockers:

1. Vercel function packaging for `data/artifacts/knowledge_base_abcde.json` is not guaranteed by the current `vercel.json`.
2. Git and clasp hygiene are not strict enough for a production push from the current dirty workspace.

## Verified Evidence

- `data/artifacts/knowledge_base_abcde.json` exists locally and is 711,863 bytes.
- The JSON contains 11 chunks and 3072-dimensional vectors.
- `api/chat-abcde-rag.js` reads the local knowledge base with `fs.readFileSync(path.join(process.cwd(), 'data', 'artifacts', 'knowledge_base_abcde.json'), 'utf8')`.
- `vercel.json` currently contains only `{ "cleanUrls": true }`, with no function `includeFiles`.
- `node --check api/chat-abcde-rag.js` and `node --check chat-abcde.js` returned exit code 0.
- `git status --short --branch` shows untracked files that must not be swept into a production commit: `node_modules/`, `package.json`, `package-lock.json`, `demo_video.mp4`, `record_demo.js`, `Scripts/active_code_gs_final.js.bak`, and other artifacts.
- `.gitignore` does not currently ignore `node_modules/`, `demo_video.mp4`, `record_demo.js`, `*.bak`, `package.json`, or `package-lock.json`.
- `.claspignore` currently excludes only `active_code_gs_rollback.js` and `dhm8_gate2_uat_runner.js`; `Scripts/run_uat_20260716.js` is a `.js` file under clasp `rootDir` and is not excluded.
- `Scripts/active_code_gs_final.js` has no tracked diff against git, but it contains `ChatVersion` handling in `handleAbcdeSubmit_`.

## Required Plan Fixes

### 1. Vercel Packaging Gate

Add a plan step before commit/deploy:

- Update `vercel.json` to explicitly include the RAG knowledge base in the beta function bundle, for example using function `includeFiles` for `data/artifacts/knowledge_base_abcde.json`.
- Run a local or preview build/probe that proves `/api/chat-abcde-rag` can read the file after Vercel packaging.
- If that proof fails, do not deploy production. Move the knowledge base to a supported external storage path such as Vercel Blob or Upstash Vector.

Assessment: 711KB is acceptable for beta local file search and does not require Blob or Edge Config by size alone. The risk is packaging and cold-start/runtime overhead, not raw file size.

### 2. Commit Hygiene Gate

Before staging:

- Add or verify ignore rules for `node_modules/`, `demo_video.mp4`, `record_demo.js`, `*.bak`, and other local-only artifacts.
- Do not stage `package.json` or `package-lock.json` unless the plan explicitly justifies why Puppeteer dependencies belong in production.
- Stage only the exact allowlist needed for RAG beta and docs.
- Run `git diff --cached --name-status` before commit and mirror it into the UAT/report.

### 3. Google Apps Script Push Gate

Before `clasp push -f`:

- Run `clasp status` or equivalent file-list audit.
- Confirm only production-intended Apps Script files will be pushed, especially `active_code_gs_final.js` and `appsscript.json`.
- Exclude local UAT scripts from `.claspignore` if they are not meant for production.
- Create or confirm backup/rollback path for the current Apps Script deployment.

After `clasp push -f` and deployment:

- Verify the active deployment ID and URL match the Vercel `DHM8_APPS_SCRIPT_URL`.
- Submit one controlled ABCDE test with `chatVersion=stable` and one with `chatVersion=beta`, or use an approved no-money test route if available.
- Verify `ABCDE_Data` header includes `ChatVersion` and rows record the correct value.
- Verify the report email contains the correct version label.
- Re-run core registration/payment health probes that share the same Apps Script backend, because this script also handles live registration/payment workflows.

### 4. UAT Expansion

Add these UAT surfaces:

- API probe for `/api/chat-abcde-rag` with `ABCDE_RAG_ENABLED=true`, proving `citations` is non-empty or logs show local knowledge retrieval at STEP_D.
- Kill-switch probe with `ABCDE_RAG_ENABLED=false`, proving beta returns 503 and frontend offers stable fallback.
- Browser evidence on production desktop and mobile after deploy.
- Vercel build log evidence showing function bundle includes the knowledge base and does not include accidental Puppeteer/browser artifacts.
- Docs impact check for `docs/abcde_chatbox_spec.md`, `docs/deployment-guide.md`, or an explicit `Docs impact: none` with evidence.

## Answers To The Four Questions

1. `knowledge_base_abcde.json` at 711KB is acceptable as a beta local file in a Node.js Vercel Function. It should not move to Blob or Edge Config purely because of size. It does need explicit packaging verification, and likely `includeFiles`, because current `vercel.json` does not guarantee the runtime file is included.
2. Separate commits are not required for rollback if the beta route is isolated and kill-switched. Prefer one narrow commit for endpoint + knowledge base + Vercel packaging + docs/UAT. Do not mix Apps Script push or unrelated dirty files into that commit.
3. `clasp push -f` is high-risk. Treat it as a separate approval lane with file-list audit, backup, deployment ID verification, ABCDE stable/beta submit checks, email check, and shared backend health probes.
4. Missing pieces: Vercel `includeFiles`/packaging proof, dirty workspace cleanup, `.claspignore` audit, docs impact gate, preview/prod API probes, browser evidence, and explicit rollback commands for env toggle, Vercel rollback, and Apps Script deployment rollback.
