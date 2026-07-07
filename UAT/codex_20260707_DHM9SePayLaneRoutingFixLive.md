# UAT (User Acceptance Testing - kiểm thử nghiệm thu người dùng): DHM9 SePay lane routing live fix

Date: 2026-07-07

## Summary

`Live done` for the payment lane routing fix (sửa định tuyến luồng thanh toán) affecting transaction `67016776`.

The production Apps Script deployment was updated to version `@54`, the affected SePay webhook payload was replayed once, and production `checkStatus` reports the affected DHM9 registration as `PAID`.

## Root cause

`VERIFIED` from local source read and reproduction snippet:

Before the fix, `detectLaneKeyFromPayload_()` called `isDhm9Token_(content)`. For real SePay content:

```text
BIDV;96247CULTURECODE;DHM9908192388
```

the normalized full string becomes:

```text
BIDV96247CULTURECODEDHM9908192388
```

Because that string does not start with `DHM9`, the webhook fell back to `dh8`.

## Code fix

Added `containsDhm9Token_()` to tokenize (tách token) SePay fields and detect DHM9/DH9 payment codes anywhere in:

- `transferContent`
- `transactionContent`
- `content`
- `description`
- `paymentCode`
- `code`

## Local verification

`VERIFIED` by Node.js reproduction:

```text
{"paymentCode":"DHM9908192388"} => dh9 PASS
{"content":"BIDV;96247CULTURECODE;DHM9908192388"} => dh9 PASS
{"description":"BankAPINotify BIDV;96247CULTURECODE;DHM9908192388"} => dh9 PASS
{"code":"DHM9908192388"} => dh9 PASS
{"content":"BIDV;96247CULTURECODE;DH8123456789"} => dh8 PASS
{"content":"BIDV;96247CULTURECODE;RANDOM"} => dh8 PASS
```

## Deploy and recovery evidence

`VERIFIED` Apps Script deploy:

```text
Deployed AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ @54
```

`VERIFIED` replayed exactly transaction `67016776` once:

```text
status=200
{"success":true,"forwarded":true,"upstreamStatus":200,"upstream":{"success":true}}
```

## Production verification

`VERIFIED` DHM9 status by payment code:

```text
dh9Jsonp_4444555566667777({"success":true,"state":"REGISTERED","registrationUuid":"3737ddff-acc4-45a5-82dd-fc0aae559bf6","paymentStatus":"PAID"});
```

`VERIFIED` DHM8 no longer resolves this DHM9 payment code:

```text
dhm8Jsonp_4444555566667777({"success":false,"error":"NOT_FOUND"});
```

`VERIFIED` production health:

```text
{"success":true,"environment":"PRODUCTION","spreadsheetId":"1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA","officialAccountNumber":"8815369431","sepayWebhookTokenConfigured":true,"processEmailQueueTriggerPresent":true,"processEmailQueueTriggerCount":1,"processEmailQueueTriggerError":"","amount":250000}
```

## Limitation

Exact Gmail delivery for this UUID is `UNVERIFIED` because local Google OAuth credentials returned `invalid_grant: Token has been expired or revoked`. No manual email was sent outside the existing queue workflow.
