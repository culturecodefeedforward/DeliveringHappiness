# SePay DH Vercel Proxy

Date: 2026-06-16

## Scope

Create a Vercel Function proxy for the DHM8 SePay webhook so SePay receives a
direct `200` response instead of the Google Apps Script `302` redirect.

Target endpoint:

```text
/api/sepay-dh
```

## Files

```text
- api/sepay-dh.js
```

## Current Root Cause

`VERIFIED`: Google Apps Script Web App returns `302 Moved Temporarily` before
the final `script.googleusercontent.com` response. SePay marks that webhook
delivery as failed with `302`.

## Proxy Contract

```text
SePay -> /api/sepay-dh?token=<DHM8_SEPAY_PROXY_TOKEN> -> Apps Script
```

The proxy:

```text
- accepts POST only
- validates the incoming proxy token
- adds source=sepay and token=<DHM8_SEPAY_WEBHOOK_TOKEN>
- forwards to Apps Script with redirect=follow
- returns 200 to SePay only if Apps Script succeeds
```

## Required Vercel Environment Variables

```text
DHM8_SEPAY_WEBHOOK_TOKEN=<same token configured in Apps Script SEPAY_WEBHOOK_TOKEN>
DHM8_SEPAY_PROXY_TOKEN=<token included in the SePay webhook URL>
DHM8_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec
```

If `DHM8_SEPAY_PROXY_TOKEN` is omitted, the proxy falls back to requiring the
same value as `DHM8_SEPAY_WEBHOOK_TOKEN`.

## Verification Plan

```text
- node --check api/sepay-dh.js
- mocked handler test for valid token -> 200
- mocked handler test for invalid token -> 403
- after Vercel deploy, POST a synthetic payload to /api/sepay-dh
- then update SePay webhook URL to the deployed proxy URL
```

## Local Verification - 2026-06-16

`VERIFIED`:

```text
- node --check api/sepay-dh.js
- mocked handler test with valid token returned 200
- mocked handler test with invalid token returned 403
- vercel env ls returned no existing environment variables for the linked project
```

`UNVERIFIED`:

```text
- Vercel deploy not run yet
- Vercel environment variables not set yet
- SePay webhook URL not changed yet
- no real SePay replay through /api/sepay-dh yet
```

## Production Proxy Deployment - 2026-06-16 23:08 ICT

`VERIFIED`:

```text
- Created separate Vercel project: dhm8-sepay-proxy
- Deployed only Artifacts/dhm8_sepay_proxy_vercel, not the dirty website root
- Production alias:
  https://dhm8-sepay-proxy.vercel.app
- Vercel inspect:
  target=production
  status=Ready
  function=api/sepay-dh
- Dry-run with valid proxy token:
  POST /api/sepay-dh?token=<token>&dryRun=true -> HTTP 200
  body={"success":true,"dryRun":true,"forwarded":false}
- Dry-run without proxy token:
  POST /api/sepay-dh?dryRun=true -> HTTP 403
  body={"success":false,"error":"INVALID_PROXY_TOKEN"}
```

`UNVERIFIED`:

```text
- SePay webhook URL has not been changed to the proxy URL yet
- No real SePay replay through the proxy yet
```

## Approval Boundary

Approved in current thread:

```text
- create local Vercel proxy files
```

Still requires separate approval:

```text
- Vercel deploy
- setting/updating Vercel env vars
- changing SePay webhook URL
- additional real-money transfer test
```
