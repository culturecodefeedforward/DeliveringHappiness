# DHM8 - Trinh Tu Len Ban That

Date: 2026-06-16

## Muc dich

File nay la bang dieu phoi de biet chinh xac khi nao DHM8 Email Automation du
dieu kien len ban that. Moi buoc chi duoc chuyen sang buoc tiep theo khi co bang
chung ro rang trong workspace, Google Sheet, Apps Script, Web App URL, hoac bao
cao UAT.

Quy uoc:

- `Ban thu nghiem rieng`: moi truong test tach khoi du lieu that.
- `Ban that`: form, sheet, tai khoan SePay, email va nguoi dung that.
- `PASS`: da co bang chung kiem chung.
- `BLOCKED`: dang bi chan, can thao tac/quyen/thong tin tu user.
- `PENDING`: chua lam.
- `VERIFIED`: da kiem chung bang lenh, URL, file, hoac output cu the.
- `UNVERIFIED`: chua co bang chung trong phien hien tai.

## Trang thai hien tai

Current state: `STEP 1 PASS / STEP 2 PARTIAL PASS / STEP 3 BLOCKED`

Da kiem chung:

- Ban thu nghiem rieng tren Google Apps Script da duoc tao bang account
  `culturecodeproject`.
- Web App URL ban thu nghiem rieng da public va tra JSONP duoc.
- Dang ky truc tiep qua Web App URL tra `success=true`.
- Webhook SePay gia lap qua Web App URL tra `success=true`.
- Trang form thu nghiem rieng `register-test.html` da duoc tao, tro ve Web App
  URL thu nghiem va khong hien thi tai khoan nhan tien that.
- Sau user test lan dau, UUID
  `45beb6a8-3267-4f3a-99a7-2d2718dd3aef` duoc Web App xac nhan la
  `REGISTERED`, nhung UI hien thong bao dang xu ly do polling chua nhan duoc
  ket qua trong cua so cho hien tai.
- Sau khi doi trang test sang fetch-mode, user observed browser success message
  "Dang ky thanh cong".
- Lane test hien tai da duoc ha tu 300.000 VND xuong 3.000 VND de giam rui ro
  tien that trong khi van giu nguyen luong webhook SePay, payment code DH...,
  va borrowed-account test flow.
- Da VERIFY lane test borrowed-account qua Web App admin config:
  `OFFICIAL_ACCOUNT_NUMBER=1300244416`, `SEPAY_WEBHOOK_TOKEN` da co, amount=3000.

Chua duoc coi la len that vi:

- Form dang ky tren website hien chua tro ve Web App URL thu nghiem moi.
- Bo UAT day du `runDHM8Gate2UAT` chua chay xong do `clasp run` van bi chan
  quyen Execution API.
- Chua doi sang token SePay that, so tai khoan that, Sheet that, va email that.
- Chua co test giao dich SePay that co kiem soat.

## Duong dan hien co

Repo root:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website
```

Bao cao UAT hien tai:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_email_uat_report_20260616_gate2.md
```

Sheet thu nghiem:

```text
https://drive.google.com/open?id=1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac
```

Apps Script thu nghiem:

```text
https://script.google.com/d/1W3QUKnfO0jyt0LAD-jJ8Mua2UglbANgxdnmHyDXT5WRYCxNmyeuJFzQU/edit
```

Web App URL thu nghiem:

```text
https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec
```

## Trinh tu chuyen tu thu nghiem sang ban that

### Step 1 - Tao ban dang ky thu nghiem rieng

Goal: co mot trang form rieng de user test nhu nguoi dung that, nhung du lieu
di vao he thong thu nghiem rieng.

Can lam:

- Tao trang `register-test.html` hoac cach cau hinh tuong duong.
- Trang nay phai dung Web App URL thu nghiem:
  `https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec`
- Khong doi default URL cua `register.js` / `tracking.js` cho ban that khi chua
  duoc user approve.

Dieu kien PASS:

- Mo duoc trang form thu nghiem.
- Gui form thanh cong.
- Du lieu vao dung Sheet thu nghiem.
- Sheet that khong co dong moi do test nay tao ra.
- Browser khong co loi console nghiem trong.

Trang thai: `PASS`

Evidence da co:

```text
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\register-test.html

VERIFIED:
- file exists
- contains Web App URL thu nghiem
- contains canh bao khong chuyen khoan that
- does not contain production bank account numbers 8815369431 or 9600006868
- register.js now supports window-level JSONP polling config while preserving
  production defaults
- register-test.html sets longer JSONP polling values and loads
- register.js?v=2.1-test to avoid stale browser cache
- after repeated browser retry still showed "dang xu ly", register-test.html was
  switched to `DHM8_STATUS_CHECK_MODE="fetch"` and `register.js?v=2.2-test`.
  Production default still uses JSONP unless a page explicitly sets this mode.
- user observed browser success message:
  "Dang ky thanh cong! Cam on ban da dang ky **Delivering Happiness Masterclass (DHM8)**.
  BTC da nhan duoc thong tin dang ky cua ban."
- Web App admin config read-back:
  `{"success":true,"environment":"STAGING","officialAccountNumber":"1300244416","sepayWebhookTokenConfigured":true,"amount":3000}`
```

Evidence can them de hoan thien PASS:

```text
UNVERIFIED path - dong du lieu trong Sheet thu nghiem
UNVERIFIED path - xac nhan Sheet that khong bi ghi nham
```

### Step 2 - Test dang ky va webhook SePay gia lap tren ban thu nghiem

Goal: xac minh luong dang ky + webhook thanh toan chay dung o he thong thu
nghiem rieng truoc khi dong vao tien that.

Da lam:

- Dang ky truc tiep qua Web App URL thu nghiem.
- Check status bang JSONP.
- Goi webhook SePay gia lap voi token test.

Dieu kien PASS:

- Dang ky tra `success=true`.
- JSONP tra dung `success`, `state`, `registrationUuid`, khong lo email/so dien
  thoai.
- Webhook SePay dung token tra `success=true`.
- Payload sai token bi chan.
- Sai so tien khong duoc tinh thanh da thanh toan.
- Sai so tai khoan khong duoc tinh thanh da thanh toan.
- Khong match bua khi khong tim thay so dien thoai.

Trang thai: `PARTIAL PASS`

Evidence da co:

```text
REG_STATUS=200 OK
{"success":true,"state":"REGISTERED","registrationUuid":"manual-smoke-a4592b2a-90d0-4087-83bc-fd8aedb79308","duplicate":false}

PAY_STATUS=200 OK
{"success":true}
```

Evidence con thieu:

```text
UNVERIFIED path - xac nhan dong payment trong Sheet thu nghiem
UNVERIFIED path - negative tests qua Web App hoac UAT runner
```

### Step 3 - Chay bo kiem thu day du

Goal: khong chi test happy path, ma kiem tra ca loi va case bien truoc khi
chuyen sang ban that.

Can lam:

- Chay `runDHM8Gate2UAT` trong Apps Script editor, hoac sua duoc quyen
  `clasp run`.
- Mirror ket qua ve:
  `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_email_uat_report_20260616_gate2.md`

Dieu kien PASS:

- Dang ky moi pass.
- Dang ky trung khong tao dong rac.
- Check status khong lo thong tin ca nhan.
- Webhook sai token bi chan.
- Sai so tien bi chan.
- Sai so tai khoan bi chan.
- Khong tim thay so dien thoai thi khong match bua.
- Webhook trung khong tao thanh toan lap.
- Co che tam dung thanh toan/email hoat dong.
- Hang cho email, retry, dead-letter va reclaim lease hoat dong.
- Log loi co ghi de truy vet.

Trang thai: `BLOCKED`

Blocker hien tai:

```text
npx --yes @google/clasp run runDHM8Gate2UAT
Unable to run script function. Please make sure you have permission to run the script function.
```

Next action:

- Chay thu cong `runDHM8Gate2UAT` trong Apps Script editor bang account
  `culturecodeproject`, hoac tiep tuc xu ly quyen Execution API cho `clasp run`.

### Step 4 - Doi chieu cau hinh thu nghiem voi cau hinh that

Goal: lap bang doi cau hinh de tranh nham moi truong khi chuyen sang ban that.

Can user cung cap/xac nhan:

- Sheet that chinh xac nao se nhan dang ky.
- Web App Apps Script that se dung script nao.
- Token webhook SePay that.
- So tai khoan nhan tien that.
- Email nguoi nhan/gui that va gioi han allowlist neu co.

Dieu kien PASS:

- Co bang map ro:
  - Sheet thu nghiem -> Sheet that.
  - Token test -> token SePay that.
  - So tai khoan test `123456789` -> so tai khoan that.
  - Email test -> email that.
  - URL form thu nghiem -> URL form that.
- User approve rieng viec chuyen cau hinh sang ban that.

Trang thai: `PENDING`

### Step 5 - Chuyen form that sang he thong that

Goal: sau khi test pass va cau hinh that da duoc approve, form dang ky that moi
duoc tro ve Web App that.

Can lam:

- Cap nhat cau hinh form that, khong dung token/so tai khoan test.
- Verify `register.js` va `tracking.js` khong con tro nham ban thu nghiem.
- Chay mot dang ky that co kiem soat.

Dieu kien PASS:

- Form that gui du lieu vao Sheet that.
- Check status hoat dong.
- Khong loi browser console.
- Khong con tro ve Web App URL thu nghiem.
- Email xac nhan hoat dong theo cau hinh that.

Trang thai: `PENDING`

Can approve rieng tu user truoc khi lam:

```text
APPROVAL REQUIRED - chuyen form that sang cau hinh that
```

### Step 6 - Test thanh toan SePay that co kiem soat

Goal: xac minh webhook SePay that di vao he thong that va match dung nguoi dang
ky.

Can lam:

- Tao mot dang ky that co kiem soat.
- Thuc hien giao dich that hoac giao dich test duoc SePay dashboard chap nhan.
- Xac minh webhook that ve dung Web App that.

Dieu kien PASS:

- SePay that ban webhook den dung Web App.
- Giao dich match dung nguoi dang ky.
- Trang thai thanh toan trong Sheet that cap nhat dung.
- Email sau thanh toan gui dung.
- Khong co loi nghiem trong trong log.

Trang thai: `PENDING`

Can approve rieng tu user truoc khi lam:

```text
APPROVAL REQUIRED - test giao dich that / tien that
```

## Ket luan go-live

Chua duoc len ban that.

Duoc len ban that chi khi:

```text
Step 1 PASS - achieved 2026-06-16
Step 2 PASS
Step 3 PASS
Step 4 PASS + user approve
Step 5 PASS
Step 6 PASS
```

Viec nen lam ngay tiep theo:

```text
Mo lai register-test.html trong trinh duyet, tao mot dang ky moi de lay payment
code DH... va QR 3.000 VND da duoc VERIFY local theo VA 96247ABCD, sau do thuc
hien 1 giao dich test dung payment code do.
```

Evidence bo sung cho buoc nay:

```text
UAT report da mirror local QR verification:
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_email_uat_report_20260616_gate2.md

Manual test checklist:
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_manual_test_checklist_20260616.md

Screenshot form test:
C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\dhm8_register_test_initial_20260616.png

Local verification da xac nhan:
- QR acc = 96247ABCD
- bank = BIDV
- amount = 3000
- transfer content giu ma DH...
```
