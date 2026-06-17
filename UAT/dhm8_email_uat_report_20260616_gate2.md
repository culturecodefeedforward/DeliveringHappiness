# DHM8 Email Automation Gate 2 UAT Report

Date: 2026-06-16

## Stale Format Note

`STALE/ARCHIVE`: this report captures the pre-migration payment-code format for
the 2026-06-16 Gate 2 run. Historical examples below that show UUID-derived
`DH...` values remain valid evidence for that run, but the current local code
contract has been changed to phone-derived `DH8-<normalized phone>` for new
registrations.

## Deployment Update - 2026-06-16 22:22 ICT

`VERIFIED`:

```text
- staging mirror synced:
  - Scripts/active_code_gs_final.js -> Artifacts/dhm8_gate2_clasp_staging_20260616/Code.js
  - Scripts/dhm8_gate2_uat_runner.js -> Artifacts/dhm8_gate2_clasp_staging_20260616/DHM8Gate2UATRunner.js
- clasp push succeeded for 3 staging files
- created Apps Script version 9
- redeployed existing staging URL:
  AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @9
- smoke GET after redeploy returned:
  dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":false,"error":"NOT_FOUND"});
```

Interpretation:

```text
- existing staging deployment URL is still alive after redeploy
- register-test.html can keep using the same staging URL
- STALE/ARCHIVE: deployment @9 used the hyphenated DH8-<normalized phone>
  payment-code wording, which is not safe for a shared bank account if SePay
  is filtering by recognized payment code.
- Local code has been corrected after this report section to use a
  SePay-compatible code like DH8901234567 for phone 0901234567. That local fix
  still requires a new staging deploy before real-money retest.
```

## Deployment Update - 2026-06-16 22:42 ICT

`VERIFIED`:

```text
- local syntax checks passed:
  - node --check register.js
  - node --check Scripts/active_code_gs_final.js
  - node --check Scripts/dhm8_gate2_uat_runner.js
- local mock suite passed:
  - node UAT/dhm8_mock_tests_20260616.js
  - result: 79 assertions PASSED
- staging mirror synced:
  - Scripts/active_code_gs_final.js -> Artifacts/dhm8_gate2_clasp_staging_20260616/Code.js
  - Scripts/dhm8_gate2_uat_runner.js -> Artifacts/dhm8_gate2_clasp_staging_20260616/DHM8Gate2UATRunner.js
- clasp push succeeded for 3 staging files
- created Apps Script version 10
- redeployed existing staging URL:
  AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @10
- smoke GET after redeploy returned:
  dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":false,"error":"NOT_FOUND"});
```

Current payment-code contract:

```text
- phone 0901234567 -> payment code DH8901234567
- SePay webhook should keep filtering enabled for DH-related transactions only
- recommended SePay code structure:
  prefix = DH
  suffix length = 10
  suffix type = integer/number
```

## SePay Proxy Replay Result - 2026-06-17 08:38 ICT

`VERIFIED`:

```text
- SePay transaction: #63698796
- Amount: 3,000 VND
- Virtual account: 96247ABCD
- Transfer content: DH8534636223, MA GD 100000147483773
- SePay payment verification: successful
- SePay webhook after proxy change: DH returned HTTP 200 at 2026-06-16 23:11:47
- Apps Script debug for registration UUID 299889f4-ec56-4458-be14-324682393ff2:
  paymentStatus=PAID
  paymentRow.state=MATCHED
  paymentRow.transactionId=63698796
  paymentRow.content=DH8534636223, MA GD 100000147483773
  paymentRow.matchedUuid=299889f4-ec56-4458-be14-324682393ff2
```

Conclusion:

```text
PASS: SePay -> Vercel proxy -> Apps Script -> staging Sheet matching worked for
the replayed real 3,000 VND transaction.
```

## Status

`PARTIAL / HTTP STAGING SMOKE PASSED; CLI UAT RUNNER STILL BLOCKED`

Codex updated the Gate 2 plan and prepared the Apps Script staging UAT runner.
After user enabled Apps Script API for the intended `culturecodeproject` account
context, Codex created a spreadsheet-bound Apps Script staging project, pushed
the staging code package, and deployed versioned Web App/API executable builds.
After first-run authorization in the Apps Script editor, the public Web App
endpoint is reachable and accepts staging registration and SePay webhook smoke
requests. The remaining blocker is only the CLI-based full UAT runner:
`clasp run` still cannot execute Apps Script functions through the Execution API.

## VERIFIED Local Artifacts

- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register-test.html`
  exists as a dedicated test registration page. It points to the test Web App
  URL, warns users not to transfer real money, and does not include the
  production bank account numbers.
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register.js`
  now supports test-page JSONP polling overrides through `window` variables
  while preserving production defaults.
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260616_DHM8StagingAndUAT.md`
  now defines UAT-01 through UAT-20, exact report path, and SePay test readiness
  criteria.
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\dhm8_gate2_uat_runner.js`
  exists and is intended to run inside the Apps Script staging project alongside
  `active_code_gs_final.js`.
- `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\appsscript_staging_manifest.json`
  exists as the staging manifest template.
- `node --check Scripts/dhm8_gate2_uat_runner.js` passed.
- `node --check Scripts/active_code_gs_final.js` passed.
- `node UAT/dhm8_mock_tests_20260616.js` passed with `70/70` assertions.

## BLOCKERS

### Google Sheet creation

Attempted to create a native Google Sheet named `DHM8_Staging_Sheet_20260616`
through the Google Drive connector.

Result:

```text
Current action failed because this app connection is missing permissions or scopes required for this action.
Reauthenticate to grant the missing access; other actions on this app may still work.
```

Claim level: `VERIFIED`

### Apps Script deploy - initial credential state

Earlier in the session, local machine had npm/node but no existing clasp login
file:

```text
C:\Users\vu.hoang\.clasprc.json = missing
```

`npx --yes @google/clasp login --status` did not return before timeout, so
Codex could not verify an authenticated Apps Script CLI session or deploy a Web
App URL.

Claim level: `VERIFIED`

### Apps Script API enablement

After user logged into `clasp`, Codex attempted:

```text
npx --yes @google/clasp create --type sheets --title DHM8_Staging_Sheet_20260616 --rootDir "Artifacts\dhm8_gate2_clasp_staging_20260616"
```

Result:

```text
User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

Claim level: `VERIFIED`

### Apps Script staging creation and deploy

After user enabled Apps Script API for the intended account context, Codex ran:

```text
npx --yes @google/clasp create --type sheets --title DHM8_Staging_Sheet_20260616 --rootDir "Artifacts\dhm8_gate2_clasp_staging_20260616"
```

Result:

```text
Created new document: https://drive.google.com/open?id=1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac
Created new script: https://script.google.com/d/1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU/edit
```

Codex then pushed the staging package:

```text
Pushed 3 files at 4:04:34 PM.
└─ Artifacts\dhm8_gate2_clasp_staging_20260616\appsscript.json
└─ Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
└─ Artifacts\dhm8_gate2_clasp_staging_20260616\DHM8Gate2UATRunner.js
```

Codex added `executionApi` to the staging manifest, pushed again, created
version 2, and deployed:

```text
Deployed AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @2
```

Current staging identifiers:

```text
Spreadsheet URL: https://drive.google.com/open?id=1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac
Apps Script URL: https://script.google.com/d/1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU/edit
Web App deployment ID: AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg
Web App URL: https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec
```

Claim level: `VERIFIED`

### Apps Script first-run authorization

Codex attempted:

```text
npx --yes @google/clasp run bootstrapDHM8Gate2Staging
```

Result after enabling `executionApi` and deploying version 2:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

Interpretation: Google requires first-run authorization for this Apps Script
project before `clasp run` can execute staging bootstrap and UAT functions.

Claim level: `VERIFIED`

### Web App smoke before authorization

Codex attempted a public smoke request:

```text
curl.exe -i -L "https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec?action=checkStatus&uuid=smoke&callback=dhm8Jsonp_ABCDEFGHIJKLMNOP"
```

Result:

```text
HTTP/1.1 403 Forbidden
Title: Truy cập bị từ chối
Message: Bạn cần có quyền truy cập
```

Interpretation: the Web App deployment exists, but it is not yet publicly
testable. The staging project needs first-run authorization and/or Web App
deployment access confirmation under the `culturecodeproject` account.

Claim level: `VERIFIED`

### Web App HTTP smoke after authorization

After user authorized the Apps Script project, Codex retried the public Web App
smoke request.

Result:

```text
HTTP 200 OK
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":false,"error":"NOT_FOUND"});
```

Codex then executed a staging registration over HTTP:

```text
UUID=manual-smoke-a4592b2a-90d0-4087-83bc-fd8aedb79308
REG_STATUS=200 OK
{"success":true,"state":"REGISTERED","registrationUuid":"manual-smoke-a4592b2a-90d0-4087-83bc-fd8aedb79308","duplicate":false}
```

JSONP status check:

```text
STATUS_CODE=200 OK
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"manual-smoke-a4592b2a-90d0-4087-83bc-fd8aedb79308"});
```

Codex then executed a staging SePay webhook smoke request:

```text
TX=manual-smoke-tx-94ca2b23-b462-42bd-8377-2a58a82d0954
PAY_STATUS=200 OK
{"success":true}
```

Final JSONP status check still returns `REGISTERED`; this is expected from the
current public `checkStatus` contract, which intentionally exposes only
registration status and UUID, not payment/PII details.

Claim level: `VERIFIED`

### Test form polling issue after first manual browser test

User reported the test form displayed:

```text
Đăng ký của bạn đang được xử lý. Nếu chưa nhận được email xác nhận sau 5 phút,
vui lòng lưu lại Mã Đăng ký: 45beb6a8-3267-4f3a-99a7-2d2718dd3aef và liên hệ ban tổ chức.
```

Codex checked the same UUID against the test Web App:

```text
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"45beb6a8-3267-4f3a-99a7-2d2718dd3aef"});
```

Interpretation: the registration was saved successfully. The UI did not confirm
within the original JSONP polling window.

Mitigation applied:

```text
register.js: JSONP polling constants can now be overridden by window variables.
register-test.html: sets 10 attempts, 12-second per-request timeout, 4-second delay.
register-test.html: loads register.js?v=2.1-test to avoid stale browser cache.
```

After user reported the same message still appeared after 10 attempts, Codex
applied a narrower test-page mitigation:

```text
register.js: added fetchRegistrationStatus for pages that set DHM8_STATUS_CHECK_MODE="fetch".
register-test.html: sets DHM8_STATUS_CHECK_MODE="fetch".
register-test.html: loads register.js?v=2.2-test.
```

Verification:

```text
node --check register.js passed.
Local page http://127.0.0.1:8787/register-test.html returned HTTP 200.
Local page contains DHM8_STATUS_CHECK_MODE="fetch".
Local page contains register.js?v=2.2-test.
Server returned:
dhm8Jsonp_FetchStatus00ABCDEFGH({"success":true,"state":"REGISTERED","registrationUuid":"45beb6a8-3267-4f3a-99a7-2d2718dd3aef"});
```

Claim level: `VERIFIED`

### Test form browser success

After applying the fetch-mode test-page status check, user reported the browser
showed:

```text
Đăng ký thành công!
Cảm ơn bạn đã đăng ký **Delivering Happiness Masterclass (DHM8)**.
BTC đã nhận được thông tin đăng ký của bạn.
```

Interpretation: the dedicated test form now reaches the success screen after
registration status confirmation.

Claim level: `VERIFIED BY USER-OBSERVED BROWSER RESULT`

## Required Next Action To Reach SePay Testability

Open the Apps Script staging project as `culturecodeproject`:

```text
https://script.google.com/d/1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU/edit
```

Run function:

```text
bootstrapDHM8Gate2Staging
```

Authorize the requested scopes. This sets:

```text
ENVIRONMENT=STAGING
SPREADSHEET_ID=1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac
STAGING_ALLOWED_IDS=1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac
SEPAY_WEBHOOK_TOKEN=test-sepay-token-123456
OFFICIAL_ACCOUNT_NUMBER=123456789
TEST_MODE=true
RECIPIENT_ALLOWLIST=vuhoang2708@gmail.com
MOCK_QUOTA=100
KILL_SWITCH_REGISTRATION=false
KILL_SWITCH_EMAIL=false
KILL_SWITCH_PAYMENT=false
```

After authorization, Codex retried:

```text
npx --yes @google/clasp run bootstrapDHM8Gate2Staging
npx --yes @google/clasp run runDHM8Gate2UAT
```

Result:

```text
Unable to run script function. Please make sure you have permission to run the script function.
```

Manual staging tests through the Web App URL can now proceed. Full UAT runner
execution still requires either:

1. resolving Apps Script Execution API permission for `clasp run`; or
2. running `runDHM8Gate2UAT` manually in the Apps Script editor and mirroring the
   returned result / `DHM8_UAT_Report` tab here.

## SePay Test Readiness

Current state: `READY FOR MANUAL STAGING WEB APP AND SEPAY WEBHOOK SMOKE`.

Dedicated test form state: `PASS`.

Current payment amount for the borrowed-account SePay lane: `3.000đ / 3000 VND`.

Rationale: reduce real-money exposure while preserving end-to-end webhook
verification on the current borrowed-account test lane.

Admin config sync for the borrowed-account lane: `VERIFIED`.

Exact Web App admin calls performed against:

```text
https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec
```

Set command result:

```text
{"success":true,"officialAccountNumber":"1300244416","amount":3000}
```

Read-back result:

```text
{"success":true,"environment":"STAGING","officialAccountNumber":"1300244416","sepayWebhookTokenConfigured":true,"amount":3000}
```

Interpretation: borrowed-account test lane is now aligned on:
- `OFFICIAL_ACCOUNT_NUMBER=1300244416`
- `SEPAY_WEBHOOK_TOKEN=test-sepay-token-123456`
- payment amount `3000`

Latest real-money borrowed-account test for registration UUID
`b0df5648-d365-4d8e-89d5-9b6a37073a13`:

```text
paymentCode=DHB0DF5648D365
```

Apps Script debug read-back after user confirmed transfer success:

```text
{"success":true,"registrationUuid":"b0df5648-d365-4d8e-89d5-9b6a37073a13","paymentStatus":"PENDING","paymentCode":"DHB0DF5648D365","paymentRow":null,"paymentCandidates":[]}
```

Interpretation:
- registration exists
- no matched payment row yet
- no payment candidate row containing the exact payment code yet
- strongest current hypothesis: SePay webhook for this transaction has not reached the test Apps Script endpoint yet

Follow-up finding after inspecting SePay dashboard and QR generator:
- borrowed-account BIDV lane is currently tracked through `VA 96247ABCD`
- prior `register-test.html` revision generated QR against the primary account
  `1300244416` instead of the SePay-tracked VA
- this explains why money reached the bank account but did not appear inside
  SePay transaction history and did not fire webhook `DH`
- local test form has now been updated to generate the QR against
  `acc=96247ABCD`, bank `BIDV`, amount `3000`, while keeping the same
  `DH...` transfer content for Apps Script matching

Test form path:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register-test.html
```

Not yet ready for real-money payment against the production bank account until
`OFFICIAL_ACCOUNT_NUMBER` and `SEPAY_WEBHOOK_TOKEN` are intentionally switched
from staging values to the intended SePay dashboard values under separate
approval.

Go-live sequence and step-by-step approval tracker:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\codex_20260616_DHM8GoLiveSequence.md
```

User may start manual test against the Web App test URL now, but the real form
and real SePay account must not be switched until the go-live sequence reaches
the explicit approval gates recorded in that file.

## Local QR Alignment Verification

Claim level: `VERIFIED` for local test-form QR configuration only.

Local checks completed on 2026-06-16:

```text
PASS test webapp url
PASS test account VA
PASS legacy account not configured as QR acc
PASS amount 3000
PASS cache bust v2.5-test
```

Derived QR output for registration UUID
`b0df5648-d365-4d8e-89d5-9b6a37073a13`:

```text
https://qr.sepay.vn/img?acc=96247ABCD&bank=BIDV&amount=3000&des=DHB0DF5648D365&template=compact&showinfo=false&holder=NGUYEN+TO+DUNG
```

Interpretation:
- local test form now builds the SePay QR against tracked VA `96247ABCD`
- the legacy primary account `1300244416` remains visible only as descriptive
  context inside the label `VA 96247ABCD / BIDV 1300244416`
- transfer content still preserves the `DH...` payment code required for Apps
  Script matching
- this closes the previously identified local QR misrouting bug, but does not
  prove that SePay has delivered a real webhook for the next payment yet

Additional evidence:

```text
register.js syntax check: PASS via `node --check register.js`
Mock suite: PASS 70/70 via `node UAT\dhm8_mock_tests_20260616.js`
Screenshot path: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_register_test_initial_20260616.png
```

Browser smoke evidence on 2026-06-16 via Chrome headless:

```text
<title>TEST - Đăng ký DH Masterclass - CultureCode</title>
<h1>TEST - Đăng ký DH Masterclass (DHM8)</h1>
Luồng nhận tiền: VA SePay 96247ABCD (BIDV 1300244416)
window.DHM8_PAYMENT_ACCOUNT = "96247ABCD";
<script src="register.js?v=2.5-test"></script>
Screenshot path: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_register_test_chrome_20260616.png
```

Interpretation:
- `VERIFIED`: browser-rendered page still exposes the intended test copy and VA
  configuration after HTML + script load
- `VERIFIED`: cache-busted `register.js?v=2.5-test` is the script reference
  currently rendered in the page
- `UNVERIFIED`: browser submit path through staging Web App for a brand-new
  registration in the current turn

Claim boundary:
- `Local done`: QR generation and on-page test copy are aligned locally
- `UNVERIFIED`: fresh real-money 3.000đ test through the updated QR
- `UNVERIFIED`: SePay dashboard transaction visibility for the next test
- `UNVERIFIED`: webhook delivery from SePay into the staging Apps Script for
  the next test

## Manual Staging Run - 2026-06-16 19:37

Claim level: `VERIFIED` for receipt evidence and staging read-back.

User-provided receipt evidence:

```text
Image path: G:\My Drive\download\z7943530731851_9841472d72dfa50a337807be64e08dab.jpg
Time: 19:37 - 16/06/2026
Amount: 3.000đ
Target VA / account: 96247ABCD / 1300244416
Transfer content: DH8E2E0D68FC19
Status in banking app: Thành công
```

Matching registration UUID supplied after the run:

```text
8e2e0d68-fc19-4bb5-9ac1-699ef6fa4be9
```

Staging registration status check:

```text
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"8e2e0d68-fc19-4bb5-9ac1-699ef6fa4be9"});
```

Staging payment debug read-back:

```text
{"success":true,"registrationUuid":"8e2e0d68-fc19-4bb5-9ac1-699ef6fa4be9","paymentStatus":"PENDING","paymentCode":"DH8E2E0D68FC19","paymentRow":null,"paymentCandidates":[]}
```

Interpretation:
- `VERIFIED`: the new manual run used the corrected VA lane and the exact
  `DH8E2E0D68FC19` transfer content
- `VERIFIED`: staging recognizes the registration UUID
- `VERIFIED`: staging still has no matched payment row and no payment candidate
  containing `DH8E2E0D68FC19`
- `INFERRED`: the failure has moved past local QR construction and is now
  either in SePay-side transaction visibility/delivery or in the webhook path
  before any row lands in `DHM8_Payments`

Current verdict for this run:

```text
Manual run result: FAIL
Reason: bank transfer succeeded, but staging payment debug still shows
paymentStatus=PENDING, paymentRow=null, paymentCandidates=[]
```

Most useful next check:

```text
Inspect SePay dashboard for transaction/content DH8E2E0D68FC19.
If absent there, issue is upstream of webhook delivery.
If present there, issue is likely between SePay webhook delivery and Apps Script matching/storage.
```

## SePay Webhook Log Finding - 2026-06-16 19:43

Claim level: `VERIFIED` from user-provided SePay log screenshot and replay curl.

SePay log evidence:

```text
Screenshot path:
C:\Users\vu.hoang\OneDrive - LPBank Securities Joint Stock Company\Pictures\screenshot\Screenshot 2026-06-16 194345.png

Log status: 403
Log message shown by SePay UI:
"Server đích từ chối quyền truy cập. Kiểm tra IP SePay có trong whitelist của server không."

Transaction id: 63671630
Timestamp: 2026-06-16 19:37:32
Target URL currently configured in SePay:
https://script.google.com/macros/s/AKfycbxmcMOJhlD2piS2dOgdwSjxvET_a8rn8vKBG7UaXoquLrGek_dlAoSFUUbJd-u4SM3vsw/exec
```

Replay curl provided from SePay:

```text
curl -X POST 'https://script.google.com/macros/s/AKfycbxmcMOJhlD2piS2dOgdwSjxvET_a8rn8vKBG7UaXoquLrGek_dlAoSFUUbJd-u4SM3vsw/exec'
-H 'Content-Type:application/json'
-d '{"gateway":"BIDV","transactionDate":"2026-06-16 19:37:28","accountNumber":"1300244416","subAccount":"96247ABCD","content":"133741179988 0983453144 DH8E2E0D68FC19","transferAmount":3000,"id":63671630}'
```

Repository contract for the current staging deployment:

```text
Current staging Web App URL in repo:
https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec

Current staging token in repo:
SEPAY_WEBHOOK_TOKEN=test-sepay-token-123456
```

Interpretation:
- `VERIFIED`: SePay is currently POSTing to deployment `AKfycbxmc...`, which is
  different from the staging deployment `AKfycbxfbK1...` verified in this repo
- `VERIFIED`: the replay request shown by SePay does not include token via
  `Authorization`, query `token`, body `token`, or a `source=sepay` marker
- `VERIFIED`: payload account fields are internally consistent with the test
  lane: `accountNumber=1300244416`, `subAccount=96247ABCD`, amount `3000`,
  content includes `DH8E2E0D68FC19`
- `INFERRED`: the 403 is most likely caused before the current staging webhook
  logic is reached, because the request is hitting the wrong deployment and
  does not match the current webhook auth/routing contract

Corrective direction:

```text
1. Replace the SePay webhook URL with the repo-verified staging deployment.
2. Include webhook auth token `test-sepay-token-123456`.
3. Ensure the request is marked for the SePay branch, for example via `source=sepay`.
4. Replay transaction 63671630 after the config change.
```

## Staging Deploy - Webhook Content Fallback

Claim level: `VERIFIED` for local code change, Apps Script push, version creation,
and deployment update.

Change deployed:

```text
Webhook parser now accepts SePay payload content from:
- transferContent
- transactionContent
- content
- description
```

Deployment evidence:

```text
Staging script ID:
1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU

Updated deployment:
AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @8

Version label:
8 - DHM8 webhook payload content fallback 20260616
```

Read-back after deploy:

```text
{"success":true,"environment":"STAGING","officialAccountNumber":"1300244416","sepayWebhookTokenConfigured":true,"amount":3000}
```

Local verification after deploy:

```text
node UAT\dhm8_mock_tests_20260616.js
=> PASS 71/71
```

Important boundary:

```text
Transaction 63671630 is no longer a clean validation case for the fix because it
has already been seen by the webhook path and now returns duplicate behavior on
direct replay.
```

Recommended next test after deploy:

```text
Create a brand-new registration UUID and brand-new DH... payment code, then send
one fresh 3.000đ transfer through the corrected DH webhook only.
```

## SePay Proxy 200 + UI Payment Status Surface - 2026-06-17 09:00 ICT

Claim level: `VERIFIED` for Apps Script staging deploy, webhook/payment matching
read-back, `checkStatus` response, local syntax/mock tests, and local HTTP static
server response.

Context:

```text
User confirmed SePay webhook attempt for transaction #63698796 reached HTTP 200.
SePay transaction content:
DH8534636223, MA GD 100000147483773

Registration UUID under test:
299889f4-ec56-4458-be14-324682393ff2
```

Deployment evidence:

```text
npx @google/clasp push -f
=> Pushed 3 files at 8:58:15 AM.

npx @google/clasp deploy --deploymentId AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg --description "DHM8 checkStatus paymentStatus 20260617"
=> Deployed AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @11
```

Payment debug read-back:

```text
{"success":true,"registrationUuid":"299889f4-ec56-4458-be14-324682393ff2","paymentStatus":"PAID","paymentPhone":"534636223","paymentCodeVariants":["DH8534636223","DH299889F4EC56"],"paymentRow":{"transactionId":63698796,"amount":3000,"account":1300244416,"content":"DH8534636223, MA GD 100000147483773","gateway":"BIDV","state":"MATCHED","matchedUuid":"299889f4-ec56-4458-be14-324682393ff2"}}
```

Public staging `checkStatus` read-back after deploy:

```text
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"299889f4-ec56-4458-be14-324682393ff2","paymentStatus":"PAID"});
```

Local UI/static verification:

```text
node --check register.js
node --check Scripts\active_code_gs_final.js
node --check Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
node UAT\dhm8_mock_tests_20260616.js
=> All 79 tests PASSED.

renderPaymentStatus assertions PASSED

http://127.0.0.1:8787/register-test.html
=> HTTP/1.0 200 OK
=> served HTML contains id="successPaymentStatus"
=> served register.js contains renderPaymentStatus/startPaymentStatusPolling/paymentStatus parsing
```

Interpretation:

```text
VERIFIED: SePay -> Vercel proxy -> Apps Script can update Sheet payment state.
VERIFIED: Google Sheet/App Script state for this UUID is PAID/MATCHED.
VERIFIED: checkStatus now exposes paymentStatus=PAID for the registration UI.
VERIFIED: local test page has the payment status element and local register.js
can render PAID as "Đã thanh toán".
UNVERIFIED: visual browser screenshot of the success screen after live polling,
because no browser automation tool was available in this Codex turn.
```

## Frontend Payment Code Fallback Fix - 2026-06-17 10:20 ICT

Claim level: `VERIFIED` for local code inspection, syntax check, focused Node
assertions, and local static server read-back.

Bug observed from user screenshot:

```text
register-test.html rendered payment code:
DHB9BCB43315F9

This is not SePay-compatible for the current DH webhook condition because the
suffix contains letters from the registration UUID fallback.
```

Root cause:

```text
register.js still had frontend fallback logic that generated a payment code from
registration UUID when phone-derived payment code was missing.
```

Fix applied locally:

```text
register.js now:
- normalizes phone by keeping digits only
- accepts 10-digit Vietnam phone numbers, with +84/84 normalized to leading 0
- generates payment code only as DH8 + last 9 phone digits
- rejects stored/legacy values that do not match /^DH8\d{9}$/
- removes frontend UUID-derived payment-code fallback entirely
- blocks submit with a visible error if the phone cannot produce a DH8 numeric code
```

Verification:

```text
node --check register.js
=> PASS

Focused assertion:
buildPaymentCodeFromPhone('0983453144') => DH8983453144
buildPaymentCodeFromPhone('+84983453144') => DH8983453144
isValidSePayPaymentCode('DHB9BCB43315F9') => false
isValidSePayPaymentCode('DH8983453144') => true
register.js no longer contains buildLegacyPaymentCodeFromUuid

Local static read-back:
http://127.0.0.1:8787/register.js
=> contains isValidSePayPaymentCode
=> contains no buildLegacyPaymentCodeFromUuid
```

Boundary:

```text
This is a local frontend fix. It has not been committed, pushed, or deployed to
the public website.
```

## Phone Length Validation Relaxed - 2026-06-17 10:35 ICT

Claim level: `VERIFIED` for local code, local static read-back, and automated
test assertions.

Issue:

```text
The frontend error message incorrectly required "số điện thoại Việt Nam 10 số".
That validation was too strict for real user input and not required for SePay.
```

Updated rule:

```text
Phone input is normalized by keeping digits only.
Country-code forms beginning with 84 or 0084 are normalized back to leading 0.
Payment code is generated as:
DH8 + last 9 phone digits after removing one leading 0

This preserves the SePay-compatible constraint:
prefix DH + numeric suffix, suffix length <= 10.
```

Verification:

```text
0983453144 => 0983453144 => DH8983453144
+84983453144 => 0983453144 => DH8983453144
0084983453144 => 0983453144 => DH8983453144
024 1234 5678 => 02412345678 => DH8412345678
123 => 123 => DH8123
DHB9BCB43315F9 => invalid

node UAT\dhm8_mock_tests_20260616.js
=> All 83 tests PASSED.
```

Boundary:

```text
Local code and staging deploy copy have been updated.
Apps Script staging has not yet been redeployed with this relaxed phone logic.
```

## Apps Script Staging Deploy - Relaxed Phone Code - 2026-06-17 10:55 ICT

Claim level: `VERIFIED` for local checks, Apps Script push/deploy, deployment
metadata, and read-only endpoint probes.

Pre-deploy verification:

```text
node --check Scripts\active_code_gs_final.js
node --check Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
node UAT\dhm8_mock_tests_20260616.js
=> All 83 tests PASSED.
```

Deployment evidence:

```text
npx @google/clasp status
=> tracked files only:
   Artifacts\dhm8_gate2_clasp_staging_20260616\appsscript.json
   Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
   Artifacts\dhm8_gate2_clasp_staging_20260616\DHM8Gate2UATRunner.js

npx @google/clasp push -f
=> Pushed 3 files at 10:54:56 AM.

npx @google/clasp deploy --deploymentId AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg --description "DHM8 relaxed phone payment code 20260617"
=> Deployed AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @12
```

Read-only post-deploy probes:

```text
checkStatus for UUID 299889f4-ec56-4458-be14-324682393ff2
=> dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"299889f4-ec56-4458-be14-324682393ff2","paymentStatus":"PAID"});

getPaymentDebug for same UUID
=> paymentStatus=PAID
=> paymentCode=DH8534636223
=> paymentCodeLegacy=DH299889F4EC56
=> paymentCodeVariants=["DH8534636223","DH299889F4EC56"]
=> paymentRow.state=MATCHED
=> paymentRow.transactionId=63698796
```

Boundary:

```text
Apps Script staging is deployed at @12.
No git commit/push was performed.
No public website/Vercel deployment was performed.
No new SePay transfer was initiated by this verification.
```

## Real SePay Payment Test - 2026-06-17 11:40 ICT

Claim level: `VERIFIED` from user UI confirmation plus read-only staging
`checkStatus` and `getPaymentDebug` probes.

Test registration:

```text
registrationUuid:
41a384ee-9f23-4744-aded-6b98d4874798

paymentCode shown in local UI:
DH8334122

User observation:
Registration UI updated to "Đã thanh toán".
```

Read-only server evidence:

```text
checkStatus:
dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"41a384ee-9f23-4744-aded-6b98d4874798","paymentStatus":"PAID"});

getPaymentDebug:
paymentStatus=PAID
paymentPhone=334122
paymentCode=DH8334122
paymentCodeLegacy=DH41A384EE9F23
paymentCodeVariants=["DH8334122","DH41A384EE9F23"]
paymentRow.transactionId=63753115
paymentRow.amount=3000
paymentRow.account=1300244416
paymentRow.content="133815205028 0983453144 DH8334122"
paymentRow.gateway=BIDV
paymentRow.state=MATCHED
paymentRow.matchedUuid=41a384ee-9f23-4744-aded-6b98d4874798
```

Interpretation:

```text
VERIFIED: real SePay transfer was received by the webhook path.
VERIFIED: payment matcher linked DH8334122 to the correct registration UUID.
VERIFIED: Sheet/App Script state is PAID/MATCHED.
VERIFIED: registration UI observed by user updated to "Đã thanh toán".
```

## Post-Payment UX And Email Flow Local Update - 2026-06-17

Claim level: `VERIFIED` for local code inspection, static server read-back, and
automated tests. `UNVERIFIED` for actual email delivery because no email worker
was run and Apps Script staging was not redeployed in this step.

Plan:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\codex_20260617_PostPaymentUXAndEmailFlow.md
```

Changes:

```text
Frontend:
- register.js now shows a paid-state modal when paymentStatus becomes PAID.
- The modal congratulates the learner for completing the logistics fee.
- The modal links to the Zalo group:
  https://zalo.me/g/hpf7qu45j6qkft6hpghx
- register-test.html has a persistent Zalo CTA that appears after PAID.

Apps Script email renderer:
- PENDING email confirms registration and shows the payment code.
- PAID email confirms completed logistics fee and includes the Zalo group link.
- BTC email contains a compact internal registration/payment summary.

Template artifact:
- Artifacts/dhm8_email_templates.md now uses {{PaymentCode}} instead of the old
  "DHM8 - phone - name" transfer syntax.
- Old Zalo link was replaced with the current user-provided Zalo group link.
```

Verification:

```text
node --check register.js
node --check Scripts\active_code_gs_final.js
node --check Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
node UAT\dhm8_mock_tests_20260616.js
=> All 86 tests PASSED.

Local static read-back:
http://127.0.0.1:8787/register.js
=> contains paymentCompleteModal
=> contains hpf7qu45j6qkft6hpghx
=> contains "Đã hoàn tất chi phí hậu cần"

http://127.0.0.1:8787/register-test.html
=> contains successZaloGroupLink
=> contains hpf7qu45j6qkft6hpghx

Source scan:
Scripts\active_code_gs_final.js
Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
Artifacts\dhm8_email_templates.md
=> contain current Zalo link and new pending/paid template markers.
```

Boundary:

```text
Local code updated only.
Apps Script staging has NOT been redeployed after the email renderer changes.
No email was sent.
No git commit/push was performed for this local update.
```

## Apps Script Staging Deploy - Post-Payment UX Email Templates - 2026-06-17 12:07 ICT

Claim level: `VERIFIED` for commit, Apps Script push/deploy metadata, and
read-only endpoint probes. `UNVERIFIED` for real email delivery because no
email worker was run in this step.

Git commit:

```text
bd9fe2a feat: add DHM8 post-payment UX and emails
```

Pre-deploy verification:

```text
node --check register.js
node --check Scripts\active_code_gs_final.js
node --check Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
node UAT\dhm8_mock_tests_20260616.js
=> All 86 tests PASSED.
```

Deployment evidence:

```text
npx @google/clasp status
=> tracked files only:
   Artifacts\dhm8_gate2_clasp_staging_20260616\appsscript.json
   Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
   Artifacts\dhm8_gate2_clasp_staging_20260616\DHM8Gate2UATRunner.js

npx @google/clasp push -f
=> Pushed 3 files at 12:06:41 PM.

npx @google/clasp deploy --deploymentId AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg --description "DHM8 post-payment UX email templates 20260617"
=> Deployed AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg @13
```

Read-only post-deploy probes:

```text
checkStatus for UUID 41a384ee-9f23-4744-aded-6b98d4874798
=> dhm8Jsonp_ABCDEFGHIJKLMNOP({"success":true,"state":"REGISTERED","registrationUuid":"41a384ee-9f23-4744-aded-6b98d4874798","paymentStatus":"PAID"});

getPaymentDebug for same UUID
=> paymentStatus=PAID
=> paymentCode=DH8334122
=> paymentRow.transactionId=63753115
=> paymentRow.state=MATCHED
=> paymentRow.matchedUuid=41a384ee-9f23-4744-aded-6b98d4874798
```

Boundary:

```text
Apps Script staging is deployed at @13.
No git push was performed.
No public website/Vercel deployment was performed.
No email worker run or real email-send test was performed.
```
