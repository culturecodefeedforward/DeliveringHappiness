# Workflow Dang Ky Va Thanh Toan DHM8

Ngay cap nhat: 2026-07-09

Tai lieu nay mo ta thiet ke du kien trong:

- `Implementation Plan/gemini_20260616_HardenDHM8EmailAutomation.md`
- `Implementation Plan/codex_20260616_Gate1Approval.md`

Day la workflow thiet ke cho Gate 1, chua phai bang chung he thong live da chay
theo luong nay.

## 1. Tong Quan End-to-End

```mermaid
flowchart TD
    A[Hoc vien mo form DHM8] --> B[Tao registrationUuid bao mat]
    B --> C[Luu UUID trong sessionStorage]
    C --> D[Nhap thong tin va bam Dang ky]
    D --> E[POST no-cors den Apps Script]

    E --> F{Token/config/Sheet hop le?}
    F -->|Khong| F1[Dung xu ly va ghi log loi]
    F -->|Co| G{UUID da ton tai?}

    G -->|Co| H[Khong tao dong trung]
    G -->|Chua| I[Ghi hoc vien vao DHM8_Data]
    I --> J[Tao job PENDING va BTC trong Email Outbox]
    H --> K[Tra cuu trang thai hien tai]
    J --> K

    K --> L[Frontend poll GET JSONP bang UUID]
    L --> M{Tim thay registration?}
    M -->|Chua| N[Thu lai toi da 5 lan]
    N -->|Van chua thay| O[Giu UUID va hien nut Thu lai]
    N -->|Tim thay| P[Trang thai REGISTERED/PENDING]
    M -->|Co| P
    P --> Q[Hien dang ky thanh cong]
    Q --> R[Xoa UUID khoi sessionStorage]

    J --> S[Email worker claim job bang leaseOwner]
    S --> T{Quota va kill switch cho phep?}
    T -->|Khong| U[Giu job PENDING/RETRY]
    T -->|Co| V[Gui email Cho thanh toan cho hoc vien]
    V --> W[Gui thong bao BTC den 2 email duyet]

    Q --> X[Hoc vien chuyen 300.000 VND]
    X --> Y[SePay gui webhook]
    Y --> Z{Token webhook hop le?}
    Z -->|Khong| Z1[Tu choi xu ly va ghi log]
    Z -->|Co| AA[Ghi/doi chieu Transaction ID]

    AA --> AB{Webhook trung?}
    AB -->|Co| AC[Tang duplicateCount, khong tao dong moi]
    AB -->|Khong| AD[Kiem tra so tien, tai khoan va noi dung]

    AD --> AE{Khop duy nhat hoc vien?}
    AE -->|Khong tim thay| AF[NO_MATCH va doi soat thu cong]
    AE -->|Nhieu ket qua| AG[ERROR ambiguous match]
    AE -->|Khop dung| AH[Cap nhat hoc vien da thanh toan]

    AH --> AI[Tao job email PAID]
    AI --> AJ[Email worker gui xac nhan giu cho]
    AJ --> AK[Hoc vien nhan link nhom Zalo]
```

## 2. Trinh Tu Dang Ky Va Xac Nhan

```mermaid
sequenceDiagram
    actor HV as Hoc vien
    participant FE as register.js
    participant GAS as Apps Script
    participant DATA as DHM8_Data
    participant OUT as Email Outbox

    HV->>FE: Mo form
    FE->>FE: Tao va luu registrationUuid
    HV->>FE: Gui form
    FE->>GAS: POST no-cors kem UUID

    GAS->>GAS: Fail-closed config check
    GAS->>DATA: Kiem tra UUID duoi lock
    GAS->>DATA: Dem so dong Payment Status = PAID

    alt UUID chua ton tai
        GAS->>DATA: Chi ghi registration public neu paidCount < 32
        GAS->>OUT: Tao PENDING va BTC jobs
    else UUID da ton tai
        GAS->>GAS: Khong ghi trung
    end

    loop Toi da 5 lan, cach nhau 3 giay
        FE->>GAS: GET JSONP checkStatus UUID
        GAS->>DATA: Tim UUID
        GAS-->>FE: Callback REGISTERED/PENDING hoac NOT_FOUND
    end

    alt Da xac nhan registration
        FE->>HV: Hien Dang ky thanh cong
        FE->>FE: Xoa UUID khoi sessionStorage
    else Chua xac nhan duoc
        FE->>HV: Hien ma UUID va nut Thu lai
        FE->>FE: Giu nguyen UUID
    end
```

## 3. Trinh Tu Thanh Toan SePay

```mermaid
sequenceDiagram
    actor HV as Hoc vien
    participant BANK as Ngan hang
    participant SEP as SePay
    participant GAS as Apps Script
    participant PAY as DHM8_Payments
    participant DATA as DHM8_Data
    participant OUT as Email Outbox
    participant MAIL as MailApp

    HV->>BANK: Chuyen 300.000 VND kem SDT
    BANK->>SEP: Ghi nhan giao dich
    SEP->>GAS: Webhook kem transaction va token
    GAS->>GAS: Xac thuc token + config fail-closed

    alt Payment kill switch dang bat
        GAS->>GAS: Luu raw event vao DHM8_Inbox
        GAS-->>SEP: success true
    else Xu ly binh thuong
        GAS->>PAY: Upsert theo Transaction ID

        alt Transaction da ton tai
            GAS->>PAY: Tang duplicateCount
            GAS-->>SEP: success true
        else Transaction moi
            GAS->>GAS: Validate 300k, account, phone
            GAS->>DATA: Tim registration chua thanh toan

            alt Khop duy nhat
                GAS->>DATA: Cap nhat da thanh toan
                GAS->>PAY: State MATCHED
                GAS->>OUT: Tao PAID job
                GAS-->>SEP: success true
                OUT->>MAIL: Gui email xac nhan
                MAIL-->>HV: Xac nhan giu cho + link Zalo
            else Khong khop
                GAS->>PAY: State NO_MATCH
                GAS-->>SEP: success true
            else Nhieu ket qua
                GAS->>PAY: State ERROR
                GAS-->>SEP: success true
            end
        end
    end
```

## 4. Vong Doi Trang Thai

### Payment

```mermaid
stateDiagram-v2
    [*] --> RECEIVED
    RECEIVED --> PROCESSING
    PROCESSING --> MATCHED: Khop duy nhat
    PROCESSING --> NO_MATCH: Chua tim thay
    PROCESSING --> ERROR: Du lieu sai/khop mo ho
    NO_MATCH --> PROCESSING: Doi soat lai
    ERROR --> PROCESSING: Sua loi va xu ly lai
    MATCHED --> [*]
```

### Email Outbox

```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> SENDING: Worker claim + leaseOwner
    RETRY --> SENDING: Den nextAttemptAt
    SENDING --> SENT: MailApp thanh cong
    SENDING --> RETRY: Loi tam thoi
    SENDING --> RETRY: Lease het han
    RETRY --> DEAD: Vuot maxAttempts
    SENT --> [*]
    DEAD --> [*]
```

## 5. Cac Cong Kiem Tra Bat Buoc

- UUID phai tao bang `crypto.randomUUID()` hoac `crypto.getRandomValues()`.
- Chi hien dang ky thanh cong sau khi JSONP xac nhan UUID co trong `DHM8_Data`.
- Si so cong bo cua DHM8 van la 40. Nguong van hanh tam thoi cua cong dang ky
  public la `paidCount >= 32`; 8 hoc vien con lai duoc import sau theo quy trinh
  rieng. `paidCount` la so dong `DHM8_Data` co `Payment Status = PAID`; khong
  dong theo tong so dong dang ky PENDING.
- `checkRegistrationAvailability` phai tra `countBasis: "PAID"`, `paidCount`,
  `dataRowCount`, `cap`, va `registrationOpen` de de audit.
- Viec dong cong chi chan dang ky moi. Luong resume/checkStatus va thanh toan
  cua registration da ton tai van tiep tuc hoat dong.
- `getSpreadsheet()` phai fail-closed, khong fallback sang active spreadsheet.
- Webhook SePay phai xac thuc token truoc khi xu ly giao dich.
- Giao dich chi auto-match khi dung 300.000 VND va co dung mot hoc vien phu hop.
- Job email duoc cap nhat theo `jobKey` va `leaseOwner`.
- Email BTC chi gui den `chauhm71@gmail.com` va `vuhoang2708@gmail.com`.
- Moi staging, trigger, Sheet mutation va deploy deu can phe duyet rieng.

## 6. Bang Chung Can Co Truoc Khi Len Production

- Static/mock test output cho UUID, JSONP injection, duplicate POST va webhook.
- Browser evidence tai `UAT/dhm8_browser_evidence_20260616/`.
- UAT report tai `UAT/dhm8_email_uat_report_20260616.md`.
- Diff chinh xac cua frontend, final Apps Script va rollback Apps Script.
- Backup code va Sheet truoc cutover.
- Xac minh URL webhook SePay van giu nguyen sau deploy.
