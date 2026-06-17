# DHM8 Payment Code Migration To DH8-Phone

Date: 2026-06-16

## Scope

Change the payment code format for new DHM8 registrations from UUID-derived
`DH...` to phone-derived `DH8-<normalized phone>`.

Target surfaces:

```text
- register.js
- register-test.html
- Scripts/active_code_gs_final.js
- Scripts/dhm8_gate2_uat_runner.js
- UAT/dhm8_mock_tests_20260616.js
- UAT/dhm8_email_uat_report_20260616_gate2.md
```

## Assumption

`DH8-<số đt>` means:

```text
DH8-0901234567
```

where the phone is normalized to the same format already used by Apps Script:
- keep leading `0`
- convert `+84xxxxxxxxx` -> `0xxxxxxxxx`
- convert `84xxxxxxxxx` -> `0xxxxxxxxx`
- remove spaces, dashes, and dots

## Change Plan

1. Frontend:
   generate and display payment code from the submitted phone number instead of
   registration UUID.
2. Backend matching:
   derive the expected payment code from each registration row phone.
3. Compatibility:
   keep legacy UUID-derived `DH...` matching as a fallback for older rows and
   historical test payments.
4. Debug endpoints:
   return the new phone-derived payment code for rows found by UUID.
5. Tests and UAT artifacts:
   update local mock/UAT coverage and mirror the new contract into UAT notes.

## Verification

```text
- node --check register.js
- node --check Scripts/active_code_gs_final.js
- node UAT/dhm8_mock_tests_20260616.js
- local QR render should show DH8-<normalized phone>
```

## Rollback

If the new code format causes unexpected matching failures:

```text
- revert payment-code generation to UUID-derived format in frontend
- keep webhook content fallback patch already deployed
- preserve legacy matching helper during the migration window
```

## Approval Boundary

Approved in current thread:

```text
- local code changes
- staging Apps Script deploy related to this payment-code change if needed
```

Still requires separate approval:

```text
- production deploy
- DB mutation / row cleanup
- new real-money retest after code change
```
