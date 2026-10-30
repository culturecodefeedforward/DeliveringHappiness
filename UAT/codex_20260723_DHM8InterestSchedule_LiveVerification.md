# UAT - DHM8 Interest CTA and 07:30 Schedule Live Verification

- Verification time: `2026-07-23T15:02:42+07:00`
- Vercel project: `delivering-happiness`
- Project ID: `prj_WmpFNOKRpCmjkhvKAWAWLaTZOK9I`
- Production deployment ID: `dpl_2w7YXhJGCUnTiwQ3U1xLgKgyPv8w`
- Immutable deployment URL: `https://delivering-happiness-jdhngylx7-vuhoang2708s-projects.vercel.app`
- Production URL: `https://delivering-happiness.vercel.app/`
- Rollback target retained during deployment: `https://delivering-happiness-hqkzjxl8q-vuhoang2708s-projects.vercel.app`

## Verification matrix

| Surface | Evidence | Result |
| --- | --- | --- |
| Release package | Built from `origin/main`, overlaid only with approved `index.html`; both SHA-256 hashes are `49B5EC2BA019445F963A25C2152AA97BA7B5E5B5C72168620D39E00AA0E7C8C9` | `VERIFIED` |
| Vercel deployment | CLI returned `READY`; production alias assigned | `VERIFIED` |
| Production raw HTTP | HTTP 200; contains `07:30 - 17:30` and `Để lại quan tâm`; excludes `08:00 - 18:00` and `Đăng ký TP.HCM` | `VERIFIED` |
| Chrome desktop | Both schedules and DHM8 interest links display correctly | `VERIFIED` |
| Chrome mobile | New schedule and interest CTA display; old schedule absent | `VERIFIED` |
| Interest flow | `/interest` opens with the correct title, heading, and form | `VERIFIED` |
| Core public URLs | Six core URLs and `/interest.html` returned HTTP 200 | `VERIFIED` |

## Browser evidence

- `UAT/codex_live_verified_desktop_20260723.png`
- `UAT/codex_live_verified_mobile_20260723.png`
- Both PNG files are ignored by the repository-wide `*.png` rule and remain local evidence.

## Gate note

The hotfix gate found the correct HTTP and DOM content but returned `LIVE_UNVERIFIED_FAILED` because Chromium reported main-document status `304` with `fromCache=false`; the script accepts only `200`. Independent Chrome verification confirmed the user-visible production result. This is a false-negative gate limitation.

## Final surface

`LIVE VERIFIED`: the requested homepage schedule and DHM8 interest CTA are visible on the public production domain. No Git push was performed.
