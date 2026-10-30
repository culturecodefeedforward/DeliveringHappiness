# Real Sheet Write UAT Report

## Metadata
- **Timestamp**: 2026-08-12T10:24:32.274Z
- **Verdict**: BLOCKED_TARGET_MISMATCH
- **Target Endpoint**: https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec
- **Deployment**: @69
- **Verified Parent ID**: 1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac
- **Candidate Link ID**: 1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA
- **Tab**: Program Interest
- **UUID**: c6b87a8d-9527-4577-86ba-b363dc03d963
- **External writes count**: 0

## Findings
The verified `parentId` of the Apps Script deployment @69 is `1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac`.
This does **NOT** match the Candidate CRM Link `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`.
Furthermore, the verified `parentId` does not contain a `Program Interest` tab (HTTP 400 Unable to parse range).
Due to TARGET MISMATCH, execution is completely halted before any POST request was made.

## Claim Levels
- Frontend: UNVERIFIED
- Network: UNVERIFIED
- Spreadsheet: UNVERIFIED
