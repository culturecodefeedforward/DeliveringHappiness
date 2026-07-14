# CTA interest recheck report - 2026-07-08

## Sentinel

- Rule evidence: `C:\Users\vu.hoang\.gemini\antigravity\scratch\SHARED_AGENT_RULES.md`
- Project rule evidence: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\AGENT_REPORTING_RULES.md`
- Google Sheet source: `DH4HN CRM Leads - Landing Page`
- Spreadsheet ID: `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`
- Baseline CSV: `C:\Users\vu.hoang\.gemini\antigravity\repo_hygiene_backups\dh4hn-website_20260708_134408\archive\Artifacts\dh_interest_since_2026_04_01_location_unverified_dedup_by_email.csv`

## Result

- Baseline interest list: 39 rows
- Eligible after DHM8/DHM9 suppression: 28 rows
- Excluded by registered email: 7 rows
- Excluded by registered phone: 2 rows
- Excluded as internal/test: 1 row
- Manual review possible test: 1 row

## Output files

- Full decision manifest: `Artifacts\dh_cta_low_spam_campaign_20260708\interest_recheck_manifest.csv`
- Send candidate CSV: `Artifacts\dh_cta_low_spam_campaign_20260708\eligible_recipients_after_dhm8_dhm9_suppression.csv`

## Proposed subject

`Cơ hội tham gia Delivering Happiness Masterclass`

## Proposed sender

`culturecodeproject@gmail.com`

## Proposed links

- TP.HCM: `https://delivering-happiness.vercel.app/register.html`
- Hà Nội: `https://delivering-happiness.vercel.app/register_dh9_hanoi.html`

## Copy/layout constraints

- Remove all registration deadline wording because the final deadline is not confirmed.
- Do not mention `10/08/2026` or any other cutoff date.
- Do not use `BTC` in user-facing copy; use `Đội ngũ CultureCode` where a team signature is needed.
- Do not mention gifts, bonuses, referral rewards, special training, or Hà Minh Châu add-on offers unless the user explicitly confirms the offer source of truth.
- Do not invent or rename brand/header lines, CTA button labels, footer links, or disclaimer/unsubscribe text. Preserve user-approved copy unless the user explicitly asks to rewrite it.
- Current approved CTA button labels: `Đăng ký TP.HCM` and `Đăng ký Hà Nội`.
- Current approved opening sentence: `Lời đầu tiên, Ban Tổ chức (BTC) xin gửi lời chào trân trọng và lời chúc sức khỏe đến Anh/Chị.`

## Approval boundary

No email was sent in this pass. Real send requires direct user approval with exact batch scope.
