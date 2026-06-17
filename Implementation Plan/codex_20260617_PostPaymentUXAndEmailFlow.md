# DHM8 Post-Payment UX And Email Flow Plan

Date: 2026-06-17

## Scope

Implement the next local iteration after the verified SePay real payment test:

1. Improve the registration success/payment UI with a clear paid-state celebration popup and Zalo group CTA.
2. Standardize the email sent after registration while payment is still pending.
3. Standardize the email sent after payment is completed.

Zalo group link supplied by user:

```text
https://zalo.me/g/hpf7qu45j6qkft6hpghx
```

## Files Expected To Change

```text
register.js
register-test.html
register.html
Scripts/active_code_gs_final.js
Artifacts/dhm8_gate2_clasp_staging_20260616/Code.js
UAT/dhm8_mock_tests_20260616.js
UAT/dhm8_email_uat_report_20260616_gate2.md
Artifacts/dhm8_email_templates.md
```

## Design Notes

- Frontend should keep QR/payment status visible after registration.
- When `paymentStatus` becomes `PAID`, show a modal/popup congratulating the learner for completing the logistics fee and provide a direct Zalo group link.
- The paid popup must only appear once per registration in the current browser session.
- Registration confirmation email should:
  - confirm registration was received,
  - show payment code and transfer instruction,
  - explain that Zalo group access is provided after payment.
- Paid email should:
  - confirm logistics fee payment,
  - include the Zalo group link,
  - include practical next steps.
- Email jobs must remain idempotent by `registrationUuid:emailType`.

## Verification Plan

Local/static:

```text
node --check register.js
node --check Scripts\active_code_gs_final.js
node --check Artifacts\dhm8_gate2_clasp_staging_20260616\Code.js
node UAT\dhm8_mock_tests_20260616.js
```

Browser/UAT:

```text
Open http://127.0.0.1:8787/register-test.html
Verify pending success state still shows QR/payment info.
Simulate/render PAID state and verify popup shows once and links to Zalo.
```

Apps Script:

```text
Run only local/static tests first.
Apps Script staging deploy requires separate explicit approval.
```

## Rollback

- Frontend rollback: revert `register.js`, `register-test.html`, `register.html`.
- Apps Script rollback: redeploy previous Apps Script staging version `@12` or use `Scripts/active_code_gs_rollback.js` if payment/email logic breaks.
- No Google Sheet mutation or email sending should be performed during local implementation.

## Approval Boundary

Approved now by user:

```text
Local code edits and local commit after verification.
```

Requires separate approval:

```text
Apps Script staging deploy
Vercel/public website deploy
Actual email sending test to real recipients
Git push if not already explicitly requested in the same turn
```
