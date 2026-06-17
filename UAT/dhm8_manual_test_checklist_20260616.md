## DHM8 Manual Test Checklist - 2026-06-16

Purpose: run one controlled `manual test` (kiem thu thu cong) for the staging
registration + SePay webhook lane after the QR target was corrected to
`VA 96247ABCD`.

Claim surface:
- `VERIFIED` in this file means the step can be executed or checked from the
  current local/staging setup.
- `UNVERIFIED` means the step still depends on a new registration submission,
  a real `3.000đ` transfer, or external SePay/Apps Script behavior.

Scope lock:
- Use only the staging test form:
  `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register-test.html`
- Do not switch production account, production Web App, or production form.
- Do not claim `Live done` from this checklist.

## Preconditions

`VERIFIED`:

```text
Test form QR config:
- acc = 96247ABCD
- bank = BIDV
- amount = 3000
- transfer content = DH8 + last 9 digits of normalized phone

Supporting evidence:
- C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_email_uat_report_20260616_gate2.md
- C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_register_test_chrome_20260616.png
```

`UNVERIFIED before run`:

```text
- a fresh registration UUID for this manual run
- a fresh payment code like DH8901234567 for phone 0901234567
- the next 3.000đ transfer appearing in SePay
- the next webhook reaching the staging Apps Script
```

## Test Steps

1. Open the test form:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register-test.html
```

Expected result:

```text
- title shows TEST - Đăng ký DH Masterclass (DHM8)
- payment info mentions VA SePay 96247ABCD (BIDV 1300244416)
- amount shows 3.000đ
```

Evidence to keep:

```text
- screenshot of the loaded form before submit
```

2. Submit one brand-new registration with clearly unique test data.

Suggested unique values:

```text
fullName  = MANUAL TEST 20260616
email     = manual-test-20260616@example.com
phone     = 09xxxxxxxx
company   = MANUAL TEST COMPANY
```

Expected result:

```text
- success screen appears
- a registration UUID is shown
- a payment code in the form DH8 + last 9 phone digits is shown
- QR/payment block shows account label VA 96247ABCD / BIDV 1300244416
- amount remains 3.000đ
```

Evidence to keep:

```text
- screenshot of the success screen
- copied registration UUID
- copied payment code, for example DH8901234567
```

3. Transfer exactly `3.000đ` using the QR shown on the success screen.

Rules:

```text
- transfer exactly 3000 VND
- use the QR generated for this new registration only
- keep the transfer content exactly as the displayed DH8... code
- do not edit the transfer content by hand unless the banking app forces it
```

Expected result:

```text
- banking app confirms a successful transfer
```

Evidence to keep:

```text
- screenshot or receipt from the banking app showing amount + content
```

4. Check staging registration/payment status after the transfer.

Primary check:

```text
- inspect the staging Apps Script debug/admin path already used in the repo
- compare the new registration UUID and payment code against the returned status
```

Expected result for a pass:

```text
- registration exists
- payment row or payment candidate references the exact DH8... code
- payment status no longer stays stuck at PENDING for the new run
```

Failure signal:

```text
- paymentStatus remains PENDING
- paymentRow is null
- paymentCandidates is empty
```

5. If the status still fails, check SePay-side visibility.

Expected result:

```text
- the new 3.000đ transaction should appear in the SePay lane that tracks VA 96247ABCD
```

Interpretation:

```text
- if bank transfer succeeded but SePay does not show the transaction, the issue
  is likely still between the bank lane and SePay tracking
- if SePay shows the transaction but Apps Script still stays PENDING, the issue
  is likely webhook delivery or Apps Script matching
```

## PASS / FAIL Decision

Mark this manual run `PASS` only if all conditions below are true:

```text
- new registration submitted successfully
- new QR/payment block shows VA 96247ABCD and amount 3000
- transfer 3.000đ succeeds
- staging status reflects the new payment for the same DH8... code
```

Mark this manual run `FAIL` if any of these happens:

```text
- success screen does not show a DH8... code
- QR target does not stay on 96247ABCD
- transfer succeeds but the payment still never appears in SePay
- SePay shows the payment but staging status still does not match it
```

## Evidence To Mirror After The Run

Mirror at least these items into the existing UAT report:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_email_uat_report_20260616_gate2.md
```

Add:

```text
- timestamp of the run
- registration UUID
- payment code DH8...
- result of the transfer
- staging status response
- SePay visibility result
- PASS / FAIL / BLOCKED with VERIFIED / UNVERIFIED labels
```
