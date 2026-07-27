# Production baseline before remediation — 2026-07-27

## Claim level

`VERIFIED FAILED BASELINE`: production đang phục vụ snapshot cũ và chưa đáp ứng nội dung DHM10 đã duyệt.

## Target identity

- Production URL: `https://delivering-happiness.vercel.app/`
- Vercel project: `delivering-happiness`
- Vercel project ID: `prj_WmpFNOKRpCmjkhvKAWAWLaTZOK9I`
- Production deployment ID: `dpl_GN9i6HjuBiXprEw8mVFC2b1j8tRq`
- Deployment URL: `https://delivering-happiness-h2po51hrf-vuhoang2708s-projects.vercel.app`
- Deployment created: 2026-07-23 16:11:39 +07:00
- Current Git HEAD: `b5678a5f861ca2921cc969796d3d66dde16d7b48`

`.vercel/project.json` ghi tên cũ `dh-crm-landing`, nhưng project ID trong file khớp chính xác project `delivering-happiness`. Đây là stale display name, không phải bằng chứng deploy nhầm project.

## HTTP and Git-blob comparison

| Route | Live file | Live Git blob | Match `b5678a5` | Match `b5678a5^` | Match `fa22c83` |
|---|---|---|---:|---:|---:|
| `/` | `index.html` | `5ed9bc1fbd3e4755a5098ce0826fa7a393c63e75` | No | Yes | Yes |
| `/assessment` | `assessment.html` | `be75c5bfc1ae0026afe4e404f7a9144d2885c8ba` | Yes | Yes | Yes |
| `/register` | `register.html` | `0b7e6c13792806b27483d317b47a5f40a295dd68` | No | No | Yes |
| `/register_direct` | `register_direct.html` | `a2b0bbc3943427341add376ec92717da9a14f635` | No | No | Yes |
| `/register-test` | `register-test.html` | `54a62d8f76a401549fb048cd270c051721577bbd` | Yes | Yes | Yes |
| `/dh8/` | `dh8/index.html` | `53c0b38984f0f77e2f1c61927172323b82a2747d` | No | No | Yes |

Kết luận: cả 6 file live đều khớp snapshot public của commit `fa22c83` ngày 16/07. Homepage live khớp byte-for-byte blob trước thay đổi của commit `b5678a5`.

## Browser evidence

| Viewport | DOM result | Console/page errors | Screenshot |
|---|---|---:|---|
| Desktop 1440×900 | DHM8, `08:00 - 18:00`; không có DHM10/câu dài/07:30 | 0 | `production_desktop_1440x900_before.png` |
| Mobile 390×844 | DHM8, `08:00 - 18:00`; không có DHM10/câu dài/07:30 | 0 | `production_mobile_390x844_before.png` |

Screenshot hashes:

- Desktop SHA-256: `0AAD6B7D7BDAA82B26BBE2A4CE6170FE9325A135C86889986007C2129C3E4C8F`
- Mobile SHA-256: `FD0A50CA57598081817341A802677C6A17B2879A46FAAC160C01800980091989`

## Root-cause status

- `VERIFIED`: production alias trỏ deployment có payload snapshot cũ `fa22c83`.
- `VERIFIED`: Git `main` mới hơn production nhưng vẫn chứa câu DHM10 ngắn, không đúng câu dài mong muốn.
- `UNVERIFIED`: lệnh/process cụ thể nào đã tạo deployment stale lúc 16:11; repo không có log lệnh chứa deployment ID này.
- `REFUTED`: cache trình duyệt là nguyên nhân chính; HTTP raw và hai browser viewport mới đều trả cùng snapshot cũ.
- `REFUTED`: Vercel project ID bị link nhầm; local project ID khớp project production.

## Surface matrix

| Verification surface | Method | Expected | Status |
|---|---|---|---|
| Local files | Git/UTF-8 grep | DHM10 + câu dài + DHM9 07:30 | `FAILED` vì câu ngắn |
| Production HTTP | curl 6 routes | Exact approved release | `FAILED` snapshot cũ |
| Browser desktop/mobile | In-app browser DOM + screenshot | Exact approved UI | `FAILED` snapshot cũ |
| Vercel identity | CLI inspect/project inspect | Correct project/deployment | `VERIFIED` identity; payload stale |
| Final verdict | Cross-surface comparison | All surfaces aligned | `FAILED BASELINE` |
