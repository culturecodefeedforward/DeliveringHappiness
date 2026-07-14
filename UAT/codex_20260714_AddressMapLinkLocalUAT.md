# Local UAT - Address map link visual fix

Date: 2026-07-14

Scope: frontend-only fix for address display and Google Map link hierarchy.

## Claim levels

- VERIFIED: Local source now shows `Xem bản đồ` as the only Google Map anchor text in the checked pages.
- VERIFIED: Local browser check has no horizontal overflow on homepage desktop/mobile.
- VERIFIED: Local browser check found no console/page errors for checked pages.
- UNVERIFIED: Production live site is not updated with this fix yet because no commit/push/deploy was performed in this lane.

## Files changed in scope

- `index.html`
- `register.html`
- `register_dh9_hanoi.html`
- `interest_dh9.html`
- `styles.css`
- `register.css`

## Verification evidence

Command markers:

- `rg -n -F 'Xem bản đồ' index.html register.html register_dh9_hanoi.html interest_dh9.html styles.css register.css`
- `rg -n -F 'style="color: inherit; text-decoration: underline' index.html register.html register_dh9_hanoi.html interest_dh9.html styles.css register.css`

Browser evidence:

- `UAT/screenshots/address_map_link_fix_20260714/index_desktop.png`
- `UAT/screenshots/address_map_link_fix_20260714/index_mobile.png`
- `UAT/screenshots/address_map_link_fix_20260714/register_hcm_desktop.png`
- `UAT/screenshots/address_map_link_fix_20260714/register_hn_desktop.png`
- `UAT/screenshots/address_map_link_fix_20260714/interest_hn_desktop.png`

Browser DOM checks:

- `index.html` desktop: `xemBanDoCount = 2`, `fullAddressMapLinks = []`, `horizontalOverflow = false`, console/page errors = `[]`.
- `index.html` mobile: `xemBanDoCount = 2`, `fullAddressMapLinks = []`, `horizontalOverflow = false`, console/page errors = `[]`.
- `register.html`: `xemBanDoCount = 1`, `fullAddressMapLinks = []`, `horizontalOverflow = false`, console/page errors = `[]`.
- `register_dh9_hanoi.html`: `xemBanDoCount = 1`, `fullAddressMapLinks = []`, `horizontalOverflow = false`, console/page errors = `[]`.
- `interest_dh9.html`: `xemBanDoCount = 1`, `fullAddressMapLinks = []`, `horizontalOverflow = false`, console/page errors = `[]`.

## Approval boundary

To publish this fix, stage only these files plus this UAT report/screenshot folder. Do not stage unrelated dirty Apps Script, docs, campaign, or scratch files.
