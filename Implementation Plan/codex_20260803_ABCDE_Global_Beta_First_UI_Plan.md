---
title: "ABCDE Global Beta-First UI"
artifact_slug: "abcde-global-beta-first-ui"
description: "Đưa RAG Beta thành giao diện chính cho mọi người dùng ABCDE; Stable chỉ còn là fallback khi Beta lỗi."
status: in-progress
priority: P1
effort: "0.5 ngày triển khai và staged UAT"
branch: "codex/abcde-global-beta-first-20260803"
tags: [feature, frontend, beta-first, uat]
blockedBy: []
blocks: []
created: 2026-08-03
---

# Kế hoạch giao diện ABCDE ưu tiên RAG Beta cho mọi người dùng

## Trạng thái và bề mặt claim

- `LOCAL IMPLEMENTATION`: runtime/docs đã được sửa trong worktree cô lập; browser UAT local đang được hoàn thiện; chưa deploy.
- `ck:plan CLI`: `VERIFIED AVAILABLE`; ClaudeKit global installation đã được sửa và `ck plan create/parse/validate` đã qua canary ngày 2026-08-03.
- `docs/development-rules.md`: không tồn tại. Đã đọc `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/design-guidelines.md`, `docs/system-architecture.md`.
- Repo hiện bẩn và branch `main` đang sau `origin/main` 2 commit; không triển khai trực tiếp trong checkout này.

## Annotation 1 được xử lý

Không tạo `entry mode` riêng cho Ambassador. Vì lượng người dùng public hiện còn ít, cùng một giao diện Beta-first được áp dụng cho tất cả người dùng ABCDE:

1. Người dùng vẫn chủ động mở chatbot từ nút hiện tại; không tự bật modal khi vừa vào landing page.
2. Vẫn yêu cầu passcode `ABCDE`.
3. Sau xác thực, RAG Beta là phiên bản chính và người dùng không phải chọn thủ công.
4. Stable không còn là lựa chọn ngang hàng; chỉ xuất hiện khi Beta lỗi hoặc bị tắt.

## Scope Challenge

### Những gì đã có

- `chat-abcde.js` đã có `openChatbox()`, passcode gate, selector Stable/Beta, `activeApiEndpoint`, `chatVersion` và `renderFallbackNotice()`.
- Beta đã dùng `/api/chat-abcde-rag`; Stable dùng `/api/chat-abcde`.
- Khi Beta lỗi, frontend đổi sang Stable và gửi lại tin nhắn cuối.
- `chatVersion` đã được gửi cùng payload báo cáo.

### Thay đổi tối thiểu

- Bỏ selector hai phiên bản sau passcode.
- Render màn hình Beta-first duy nhất cho mọi người dùng.
- Thêm CSS class cho thẻ Beta-primary và thông báo fallback thay vì tăng inline style.
- Cập nhật docs và UAT.
- Không đổi API, kho tri thức, Apps Script, Sheet, email hoặc passcode.

### Độ phức tạp

- Logic runtime: 1 file JavaScript.
- Giao diện: 1 file CSS.
- Docs/UAT: 5-7 artifact, không phải logic production.
- Không tạo service/class mới.
- Chọn mode: `HOLD SCOPE` — đổi mặc định giao diện toàn cục, không mở rộng thành hệ thống token hoặc LMS.

## Phương án đã đánh giá

| Phương án | Ưu điểm | Rủi ro | Kết luận |
|---|---|---|---|
| Đổi global default sang Beta | Ít code; đúng hướng sản phẩm; không cần link đặc biệt | Mọi người dùng ABCDE đi qua Beta | **Chọn theo quyết định mới của User** |
| Query-param scoped entry mode | Khoanh vùng Ambassador | Tăng nhánh logic và bước vận hành không cần thiết ở giai đoạn ít người dùng | Không chọn |
| Tạo trang `/abcde-ambassador` riêng | Tách trải nghiệm rõ | Duplicated UI, route/package/docs nhiều hơn | Hoãn |

## Thiết kế được đề xuất

### Luồng chung

1. Người dùng mở chatbot bằng nút hiện tại.
2. Hiển thị passcode như hiện tại; focus và Escape/focus trap không đổi.
3. Sau passcode thành công:
   - không render hai card Stable/Beta ngang hàng;
   - render một card “RAG Beta — phiên bản đang phát triển”;
   - ghi rõ Stable sẽ tự xuất hiện nếu Beta lỗi;
   - giữ nút “Bắt đầu thực hành” để người dùng chủ động bắt đầu.
4. Khi bấm bắt đầu:
   - `chatVersion="beta"`;
   - `activeApiEndpoint="/api/chat-abcde-rag"`;
   - gọi `startPractice()`.
5. Nếu Beta lỗi, tái dùng nguyên `renderFallbackNotice(lastMessage)`.

Không auto-start ngay sau passcode. Giữ một nút xác nhận giúp người học nhận biết họ đang vào Beta và duy trì accessibility (khả năng tiếp cận).

Không tự mở modal trên landing page và không bỏ passcode trong thay đổi này.

## File allowlist

### Modify — runtime

1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\chat-abcde.js`
   - Đổi `chatVersion` và endpoint mặc định sang Beta sau passcode.
   - Thay selector hai phiên bản bằng một thẻ Beta-primary.
   - Giữ nguyên `renderFallbackNotice()` để chuyển Stable khi có lỗi.
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\chat-abcde.css`
   - Thêm class cho Beta-primary card và mô tả fallback.
   - Giữ touch target tối thiểu 44px và responsive mobile.

### Modify — source of truth/docs

3. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\abcde_chatbox_spec.md`
   - Ghi passcode boundary và Beta-first/Stable-fallback toàn cục.
4. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\docs\deployment-guide.md`
   - Ghi hành vi Beta-first và quy trình fallback/rollback.
5. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\abcde_alumni_invite_test_guide_20260803.md`
   - Bỏ bước chọn phiên bản; dùng URL trang chủ hiện tại.
6. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\ambassador_abcde_invitation_feedback_20260803.md`
   - Bỏ bước chọn Beta thủ công.
7. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_20260803_ABCDE_Ambassador_Prelaunch_UAT_Prompt.md`
   - Cập nhật expected result: Beta primary, Stable chỉ fallback.

### Create — test/evidence

8. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\abcde_global_beta_first_20260803.js`
   - Browser test chạy trên local/staged target; target URL truyền qua env/argument, không hardcode production mutation.
9. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\abcde-global-beta-first-20260803\`
   - Report, screenshot, console/network summary và final verdict.

### Derived release artifacts

- Không sửa tay `release_package/` trước source.
- Chỉ sinh package từ script đóng gói hiện hành sau khi source test đạt.
- Manifest/hash phải chứng minh `chat-abcde.js` và `chat-abcde.css` trong package trùng source đã UAT.

### Explicitly out of scope

- Không sửa `api/chat-abcde.js` hoặc `api/chat-abcde-rag.js`.
- Không đổi `DHM_PASSCODE`, env, token, Upstash, KB hoặc Apps Script.
- Không thêm account, query mode, token mời cá nhân, expiry, revoke hoặc analytics backend.
- Không gửi feedback form hoặc email thật trong implementation test mặc định.
- Không tự mở modal khi vào landing page và không bỏ passcode.

## Các giai đoạn triển khai

### Giai đoạn 1 — Baseline, isolation và test-first

1. Ghi `git status --short --branch`, `git log -5`, `origin/main` và live release identity.
2. Vì checkout hiện bẩn, tạo worktree sạch từ commit đã xác minh; branch đề xuất `codex/abcde-global-beta-first-20260803`.
3. Lưu hash baseline của `index.html`, `chat-abcde.js`, `chat-abcde.css`, API Stable/Beta và docs liên quan.
4. Đọc plan RAG cũ:
   - `Implementation Plan/260721-abcde-rag-production-hardening/plan.md` đang `pending` nhưng runtime hiện đã có Beta/fallback.
   - Đánh dấu `RELATED / STATUS-CONFLICT`, không coi nó là blocker cho UI plan này.
5. Viết browser test trước khi sửa source cho các hành vi:
   - URL `/` không tự mở modal.
   - Passcode vẫn bắt buộc.
   - Sau passcode, Beta là primary và không còn selector Stable/Beta.
   - Beta lỗi thì Stable xuất hiện và giữ lịch sử.

**Cổng hoàn tất:** baseline và test kỳ vọng mới được ghi; chưa sửa runtime nếu target commit/live chưa xác định.

### Giai đoạn 2 — UI implementation và documentation

1. Đổi mặc định sau passcode sang Beta endpoint.
2. Bỏ selector hai phiên bản và render Beta-primary panel cho mọi người.
3. Giữ fallback function hiện tại; không nhân đôi retry logic.
4. Thêm CSS class; giảm inline style trong phần mới.
5. Cập nhật docs và ba tài liệu UAT.
9. Chạy:
   - `node --check chat-abcde.js`;
   - `git diff --check`;
   - grep Beta endpoint mặc định, submit contract và fallback;
   - browser test local/preview không có mutation.

**Cổng hoàn tất:** `VERIFIED LOCAL` ngày 2026-08-03; source/diff/browser UAT local đạt, không claim UI live.

### Giai đoạn 3 — Staged UAT và release gate

1. Build package sạch bằng script hiện hành; kiểm manifest/hash.
2. Tạo staged deployment theo production lock:
   - `vercel --prod --skip-domain` từ package sạch;
   - không promote domain.
3. Chạy UAT desktop 1440×900 và mobile 390×844 trên staged URL.
4. Chạy regression luồng mở chatbot, passcode, Beta và fallback Stable.
5. Mirror evidence vào thư mục UAT đã nêu.
6. Chỉ khi final verdict đạt và User duyệt riêng mới:
   - commit/push branch;
   - promote deployment vào domain public.

**Cổng hoàn tất:** staged browser evidence đạt; promotion vẫn là approval riêng.

## Ma trận UAT bắt buộc

| ID | Bề mặt | Test | Expected result |
|---|---|---|---|
| UI-01 | Landing page | Mở `/` | Modal không tự mở; nút mở chatbot hoạt động |
| UI-02 | Access gate | Mở chatbot | Passcode vẫn bắt buộc; không thể vào A–E trước xác thực |
| UI-03 | Sau passcode | Nhập `ABCDE` | Beta primary; không có hai lựa chọn ngang hàng |
| UI-04 | Network | Bắt đầu bài | Request chat đầu tiên đi `/api/chat-abcde-rag` |
| UI-05 | Fallback preview | Intercept Beta 503 trên local/staged | Hiện Stable fallback; lịch sử còn; gửi lại tin nhắn cuối |
| UI-06 | Mobile | 390×844 | Không tràn; input/nút usable; touch target ≥44px |
| UI-07 | Keyboard | Tab/Shift+Tab/Escape | Focus trap hoạt động; đóng modal trả focus hợp lý |
| UI-08 | Submit contract | Trace payload trước submit | `chatVersion=beta`; payload cũ không bị phá vỡ |

Không ép lỗi trên production. UI-05 dùng network interception trên local/staged hoặc mock route đã nêu trong UAT plan.

## Acceptance criteria

- Người dùng vẫn chủ động mở chatbot và passcode không bị bỏ qua.
- Sau passcode, Beta là phiên bản chính cho tất cả người dùng; không phải chọn thủ công.
- Stable chỉ xuất hiện khi Beta lỗi hoặc bị tắt.
- Không đổi backend payload ngoài giá trị `chatVersion=beta` đã có.
- Landing page `/` không tự bật modal.
- Desktop/mobile/keyboard đạt bằng chứng trình duyệt.
- Fallback giữ lịch sử và gửi lại tin nhắn cuối trên bề mặt staged/local.
- Không có thay đổi backend, env, Sheet, email hoặc KB.
- Docs/UAT khớp runtime mới.

## Rủi ro và giảm thiểu

| Rủi ro | Tác động | Giảm thiểu |
|---|---|---|
| Beta ảnh hưởng toàn bộ người dùng ABCDE | Lỗi Beta có blast radius rộng hơn | Stable fallback, staged UAT và giữ kill switch |
| Beta bị tắt | Ambassador không bắt đầu được | Tái dùng Stable fallback; test staged |
| Bỏ selector làm hỏng luồng mở bài | Không bắt đầu được A–E | Regression UI-01 đến UI-04 |
| Inline style tiếp tục tăng | Khó bảo trì | Style phần mới qua class trong CSS |
| Repo bẩn/behind | Commit nhầm hoặc mất thay đổi | Worktree sạch, file allowlist, backup/hash |
| Live/staged lệch source | Claim sai | Release manifest/hash và 3-layer UAT |
| Plan RAG cũ trạng thái pending nhưng live đã đổi | Dependency sai | Ghi status conflict; revalidate runtime, không auto-update plan cũ |

## Rollback

### Trước promote

- Không promote staged deployment nếu bất kỳ UI-01 đến UI-08 fail.
- Xóa staged deployment chỉ khi có approval riêng; không cần rollback domain vì domain chưa đổi.

### Sau promote

- Promote lại deployment public trước đó bằng exact deployment ID đã lưu trong release evidence.
- Có thể tạm thời hướng dẫn người dùng dùng Stable fallback trong lúc rollback UI.
- `ABCDE_RAG_ENABLED=false` là kill switch Beta nhưng đổi env/redeploy cần approval riêng; không dùng nó thay cho rollback UI nếu lỗi nằm ở frontend.

### Source

- Revert chỉ commit của branch UI sau khi đã backup diff; không reset/revert các thay đổi ngoài allowlist.

## Approval boundaries

### Cấp độ 2 — cần duyệt plan trước implementation

Cho phép sửa đúng file allowlist, tạo test/evidence và chạy test local/staged đã mô tả.

### Cấp độ 3 — luôn xin riêng

- Tạo commit.
- Push branch.
- Tạo staged deployment `vercel --prod --skip-domain`.
- Promote staged deployment vào `delivering-happiness.vercel.app`.
- External submission ghi Sheet/email nếu UAT sau này cần.
- Xóa staged deployment, test row hoặc artifact.

Plan approval không tự cấp quyền cho các thao tác trên.

## Docs impact

`Docs touched`: `docs/abcde_chatbox_spec.md`, `docs/deployment-guide.md`, hai hướng dẫn Ambassador/tester và prompt Gemini UAT. Docs không thay browser/live evidence.

## Files safe to stage — chỉ sau implementation và diff review

- `chat-abcde.js`
- `chat-abcde.css`
- `docs/abcde_chatbox_spec.md`
- `docs/deployment-guide.md`
- Ba file UAT hiện có được plan nêu
- Test/evidence mới thuộc plan

Mọi file dirty khác là `Files not safe to stage` cho scope này.

## Quyết định mặc định cần User duyệt

1. Áp dụng Beta-first cho toàn bộ người dùng ABCDE tại URL hiện tại.
2. Không tự mở modal và không auto-start bài.
3. Beta-only primary panel sau passcode.
4. Stable chỉ là fallback.
5. Không tracking cohort/backend trong giai đoạn này.

## Handoff sau khi plan được duyệt

Implementation command gợi ý sau khi mở session sạch:

```text
/ck:cook C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\codex_20260803_ABCDE_Global_Beta_First_UI_Plan.md
```

Executor dùng ClaudeKit global workflow đã được kiểm chứng; commit, push, staged deploy và production promotion vẫn cần approval riêng.

## Trạng thái thực thi 2026-08-03

- Worktree sạch được tạo từ `origin/main` commit `0c7a3c23f5d655d4960c90ef3747c4aba7aa3acf` tại `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803`.
- Runtime, docs và UAT trong allowlist đã được triển khai.
- Browser UAT local UI-01 đến UI-08 đạt; evidence tại `UAT\abcde-global-beta-first-20260803\`.
- Release package chưa build vì script chuẩn chỉ nhận committed source ref và từ chối dirty worktree. Không tạo commit để lách approval Cấp độ 3.
- Commit, push, staged deploy và production promotion vẫn chưa được phép.

## Trạng thái thực thi 2026-08-04 — Gemini independent live UAT

- `VERIFIED`: deployment production đang phục vụ đúng release `2cfad112f2c5-08b69e028fca`; identity headers và release manifest khớp package evidence.
- `VERIFIED`: Gemini đã kiểm chứng độc lập trên `https://delivering-happiness.vercel.app/` các ca PRE-01, UI-01, UI-02, UI-03, UI-04, UI-05, UI-07 và UI-08 bằng desktop/mobile browser evidence.
- `VERIFIED-LIVE-ABCDE`: trạng thái này chỉ áp dụng cho core Beta-first practice flow (luồng thực hành Beta chính), không có nghĩa mọi điều kiện vận hành đã đóng.
- `UNVERIFIED-LIVE`: UI-06 Stable fallback chưa được ép lỗi trên production, đúng ranh giới an toàn của prompt; không dùng kết quả local để thay live evidence.
- `CONDITION`: `network_summary_20260803_abcde_global_beta_first_live.json` hiện chỉ chứa phản hồi favicon 404. Script có theo dõi request RAG để quyết định UI-04 nhưng chưa ghi request đó vào artifact mạng; cần Gemini mirror lại request URL/method/status mà không lưu request body trước khi coi evidence network là đầy đủ.
- `CONDITION`: report Gemini hiện chỉ có ma trận 19 dòng và đường dẫn thư mục; chưa ghi metadata bắt buộc cho từng screenshot (URL, viewport, timestamp GMT+7, expected/observed). Cần bổ sung manifest hoặc bảng metadata để evidence có thể truy vết.
- `CONDITION`: thư mục evidence có `node_modules/` và package metadata sinh ra trong lúc chạy UAT; các file này không thuộc allowlist release và chưa an toàn để stage.
- Verdict chuẩn hóa của Codex: `GO WITH CONDITIONS`; được phép chuẩn bị quy trình Ambassador ở mức bản nháp, chưa được gửi lời mời ra ngoài.
- Evidence report: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803\UAT\abcde-global-beta-first-20260803\gemini-live\uat_report_20260803_abcde_global_beta_first_live.md`.
- Final verdict JSON: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803\UAT\abcde-global-beta-first-20260803\gemini-live\final_verdict_20260803_abcde_global_beta_first_live.json`.
- Quy trình phát lời mời bản nháp: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803\UAT\ambassador_20260804_abcde_global_beta_first_rollout_plan.md`.

## Follow-up evidence 2026-08-04

- `VERIFIED`: network metadata addendum ghi `POST /api/chat-abcde-rag`, HTTP 200, timestamp GMT+7, duration và response state; không có request body/PII. Artifact: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803\UAT\abcde-global-beta-first-20260803\gemini-live\network_request_metadata_20260804_abcde_global_beta_first_live.json`.
- `VERIFIED`: screenshot manifest đủ sáu ảnh và metadata bắt buộc tại evidence path chuẩn: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803\UAT\abcde-global-beta-first-20260803\gemini-live\screenshot_manifest_20260804_abcde_global_beta_first_live.json`.
- `ARCHIVE OUTSIDE REPO`: bản manifest trùng nằm dưới thư mục typo `...\UAT\abcde-global-beta-first-20260803\abcde-global-beta-first-20260308\gemini-live\`; không stage hoặc xóa nếu chưa có approval cleanup.
- `VERIFIED`: Step 4/5 (independent live browser UAT) đã đóng cho core Beta-first flow với điều kiện UI-06; Step 5/5 chuyển sang chuẩn bị nội dung Ambassador, chưa external send.

## Kế hoạch cập nhật 2026-08-05 — thêm entry point cho bài tập ABCDE tự làm

### Quyết định sản phẩm

Landing page sẽ có thêm một liên kết phụ tới `/practice-abcde`, nhưng RAG Beta vẫn là luồng thực hành chính. Không dùng các nhãn `Bản ổn định`, `Stable` hoặc `Phiếu tự luyện tĩnh` cho worksheet vì dễ làm người dùng nhầm với fallback của RAG Beta và nghe không tự nhiên.

Nhãn người dùng đã chốt:

- Primary: `🧠 Trợ lý AI ABCDE — RAG Beta` — luồng AI (Artificial Intelligence - trí tuệ nhân tạo) hỏi gợi mở, cần mã `ABCDE`, gọi `/api/chat-abcde-rag`.
- Secondary: `📝 Bài tập ABCDE — Tự làm & đối chiếu` — chọn tình huống, điền B–E và xem gợi ý từ thư viện khóa học; hiện tải JSON tĩnh và không gọi endpoint chat.

### Vị trí và hành vi UI

- Giữ `id="btn-abcde-chat"` và hành vi mở modal hiện tại để không phá các test/UAT đã đạt.
- Đổi copy hiển thị của nút chính thành `Trợ lý AI ABCDE — RAG Beta` hoặc thêm subtitle xác nhận đây là luồng chính.
- Thêm thẻ `<a href="/practice-abcde">` ngay dưới hoặc cạnh nút chính trong khối CTA hiện tại tại `index.html` dòng 102–109.
- Trên mobile, hai hành động phải xếp dọc; RAG Beta đứng trước và có visual hierarchy (phân cấp thị giác) cao hơn.
- Trang worksheet giữ link logo quay về `/`; không đổi logic bài tập trong scope này.

### Phạm vi file allowlist

- Modify: `index.html` — copy và link entry point.
- Modify nếu cần: `styles.css` — lớp layout/spacing/responsive cho nhóm hai CTA; không sửa `chat-abcde.css` nếu không cần.
- Modify: `docs/abcde_chatbox_spec.md` — ghi rõ hai entry point và sự khác nhau giữa RAG Beta/worksheet.
- Modify: `UAT/ambassador_abcde_invitation_feedback_20260803.md` và `UAT/abcde_alumni_invite_test_guide_20260803.md` — cập nhật hướng dẫn chọn đúng luồng.
- External follow-up riêng: thêm lựa chọn `Bài tập ABCDE — Tự làm & đối chiếu` vào trường phiên bản của Google Form; không tự sửa Form trong scope implementation này.

### Phases (giai đoạn thực hiện)

1. **Implementation (triển khai):** thêm link và copy, giữ nguyên ID/event handler chatbot; không đổi API, passcode, RAG prompt hoặc Stable fallback.
2. **Local verification (kiểm chứng local):** kiểm tra HTML link, route `/practice-abcde`, link quay về landing, không có duplicate CTA và không có lỗi console mới.
3. **Browser UAT (UAT - kiểm thử nghiệm thu người dùng):** desktop `1440×900` và mobile `390×844`; xác nhận RAG Beta vẫn mở modal, worksheet điều hướng đúng, focus/keyboard/touch không lỗi.
4. **Release gate:** build package từ commit đã duyệt, staged deploy rồi production promote chỉ sau approval Cấp độ 3; chạy live browser evidence độc lập cho cả hai entry point.

### Acceptance criteria (tiêu chí nghiệm thu)

- Landing hiển thị hai lựa chọn, RAG Beta đứng trước và được mô tả là luồng chính.
- Link worksheet tới đúng `https://delivering-happiness.vercel.app/practice-abcde` và trả `HTTP 200`.
- Worksheet hiển thị rõ `Bài tập ABCDE — Tự làm & đối chiếu`, không bị gọi là Stable/fallback.
- Click RAG Beta vẫn yêu cầu passcode và gọi `/api/chat-abcde-rag` ở lượt thực hành bình thường.
- Click worksheet không gọi `/api/chat-abcde` hoặc `/api/chat-abcde-rag`; chỉ tải dữ liệu worksheet cần thiết.
- Desktop/mobile không tràn layout; Tab/Enter/Escape và focus visible (hiển thị focus) vẫn hoạt động.
- Feedback documentation có thể phân biệt `RAG Beta`, `Stable fallback` và `Bài tập ABCDE — Tự làm & đối chiếu`.

### Rollback và approval boundary

- Rollback chỉ cần revert nhóm copy/link/CSS; không rollback API hoặc deployment cũ nếu lỗi chỉ nằm ở CTA.
- Sửa local/docs được phép sau khi plan này được User duyệt; commit, push, staged deploy, production promote và external Form edit vẫn cần approval riêng.
- Không stage các UAT runtime artifact (`node_modules`, package metadata hoặc thư mục typo) vào release.

### Trạng thái

`IMPLEMENTATION LOCAL VERIFIED — COMMIT/DEPLOY NOT APPROVED`. Browser UAT local đã xác nhận hai entry point, modal chatbot, route worksheet và responsive desktop/mobile; chưa được claim UI live hoặc production ready.

Evidence local: `C:\Users\vu.hoang\.gemini\antigravity\scratch\worktrees\dh4hn-abcde-global-beta-first-20260803\UAT\abcde-worksheet-entry-20260805\local-browser-result.json` và screenshot desktop/mobile trong cùng thư mục.

Residual local noise: worksheet còn request 404 tới `assets/culturecode_logo_transparent.png` và analytics báo lỗi khi chạy qua local HTTP server; đây là artifact/tài nguyên có sẵn ngoài thay đổi CTA, không phải lỗi route `/practice-abcde` hoặc layout mới.
