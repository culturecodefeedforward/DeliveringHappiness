# Kế hoạch nhập danh sách học viên GEM Global vào DH8_Data — v3 (Sau Codex Review Round 2)

> Đã sync với dry-run v2: 8 học viên, 0 skip, paid 32→40.

## Bối cảnh

File Excel nguồn: `G:\My Drive\download\Danh sách đăng kí_từ GEM Global.xlsx`  
Spreadsheet ID đích: `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`  
MCP: `workspace-mcp-personal` (user: `vuhoang2708@gmail.com`) — VERIFIED đọc thành công  
Tabs đích: `DHM8_Data`, `DHM8_Email_Outbox`

---

## User Review Required

> [!CAUTION]
> **Paid Count:** 32 PAID hiện tại → **40 PAID** sau import. Sếp đã xác nhận OK.

> [!IMPORTANT]
> **Approval Boundary — 2 giai đoạn riêng biệt:**
> - **Phase 1**: Ghi 8 dòng học viên mới vào `DHM8_Data` (row 51–58)
> - **Phase 2**: Ghi 16 job email vào `DHM8_Email_Outbox` (row 298–313) → kích hoạt gửi email thật tới học viên và BTC. Không thể hủy sau khi ghi.

## Duplicate Policy

Sếp đã xác nhận: **giữ nguyên các dòng cũ, import đủ 8 học viên mới, không skip ai.**

- Võ Thị Minh Nguyệt (`nguyetvtm@cadivi.vn`) xuất hiện tại row 43 với tên "Phạm Thị Lan" — đây là dữ liệu bất thường của row 43, không phải duplicate của học viên này. Import bình thường.
- Phạm Thị Lan (`lanpt@cadivi.vn`) không có trong live sheet. Import bình thường.

## Proposed Changes

### Phase 1 — DHM8_Data: 8 rows mới (row 51–58)

**Backup trước khi ghi:** [Backup_DHM8Data.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_20260715_ImportGemGlobalList_Backup_DHM8Data.md) (50 dòng, VERIFIED 15/07/2026 18:46)

| Row | Tên | Email | Phone | Công ty | Chức vụ | UUID |
|-----|-----|-------|-------|---------|---------|------|
| 51 | Phạm Thị Lan | lanpt@cadivi.vn | 0918646738 | Công ty CP dây cáp điện VN | Giám đốc Khối NS HC | `b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd` |
| 52 | Cao Đức Phương | phuongcd@cadivi.vn | 0935363757 | Công ty CP dây cáp điện VN | Phó GĐ Khối NS HC | `671993d2-c345-45b2-8fe4-c63141257204` |
| 53 | Võ Thị Minh Nguyệt | nguyetvtm@cadivi.vn | 0934893399 | Công ty CP dây cáp điện VN | Phó phòng Thu hút & Phát triển NNL | `220fd342-82b5-4111-9623-aba23e226f01` |
| 54 | Lê Hoàng Anh Tú | tulha@cadivi.vn | 0378728340 | Công ty CP dây cáp điện VN | CV Truyền Thông Nội Bộ | `c42253b1-49cc-4a53-948b-8bf8231c0d0a` |
| 55 | Nguyễn Thị Hồng Vân | vannth@cadivi.vn | 0901187789 | Công ty CP dây cáp điện VN | TP Hệ Thống Chính Sách | `b934e30d-ca2a-4eb0-8186-2c0dead378b2` |
| 56 | Mai Đức Anh | anh@cft-vietnam.com | 0908168973 | CÔNG TY DÂY ĐỒNG VIỆT NAM CFT | Trưởng nhóm kỹ sư điện | `77587348-a69d-4c5e-b9d7-855e26d51c39` |
| 57 | Trương Minh Công | cong@cft-vietnam.com | 0919670534 | CÔNG TY DÂY ĐỒNG VIỆT NAM CFT | NV Kho vận & Điều độ | `487f3fff-5e90-4cc8-bc8f-0d84126b6a4e` |
| 58 | Nguyễn Đào Minh Hội | hoi@cft-vietnam.com | 0971380471 | CÔNG TY DÂY ĐỒNG VIỆT NAM CFT | NV Kinh doanh | `d666a8cb-dabf-486b-a03c-24229717252b` |

Tất cả rows: `Payment Status=PAID`, `Event ID=DHM8_REG_180726`, `Nguồn biết đến=GEM Global`, `Tên người giới thiệu=GEM Global`, `Timestamp=15/07/2026 18:45:50`

### Phase 2 — DHM8_Email_Outbox: 16 jobs mới (row 298–313)

**Backup trước khi ghi:** [Backup_EmailOutbox.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_20260715_ImportGemGlobalList_Backup_EmailOutbox.md) (297 dòng, VERIFIED 15/07/2026 19:06)

**Full 14-cột row shape (VERIFIED từ active_code_gs_final.js):**

| Cột | Field | Giá trị mẫu (PAID job) |
|-----|-------|----------------------|
| A | Job Key | `dh8:b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd:PAID` |
| B | Registration UUID | `b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd` |
| C | Email Type | `PAID` |
| D | Recipient | `lanpt@cadivi.vn` |
| E | Subject | `Xác nhận thanh toán DHM8` |
| F | Lease Owner | _(bỏ trống — worker sẽ claim)_ |
| G | State | `PENDING` |
| H | Attempt Count | `0` |
| I | Next Attempt At | `15/07/2026 18:45:50` |
| J | Lease Expires At | _(bỏ trống)_ |
| K | Last Error | _(bỏ trống)_ |
| L | Sent At | _(bỏ trống)_ |
| M | Template Data | `{"templateType":"PAID","registrationUuid":"b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd","laneKey":"dh8"}` |
| N | Lane Key | `dh8` |

**BTC_PAID job:** Subject=`Thanh toán xác nhận - DHM8`, Recipient=`chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn`, Template=`{"templateType":"BTC_PAID",...}`

Xem đầy đủ 16 jobs tại [DryRun.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_20260715_ImportGemGlobalList_DryRun.md)

## Verification Plan

- Sau Phase 1: đọc `DHM8_Data!A51:R58` — verify 8 dòng đúng UUID, PAID, Event ID
- Sau Phase 2: đọc `DHM8_Email_Outbox!A298:N313` — verify 16 jobs đúng job key và State=PENDING
- Manual: kiểm tra email tại `vuhoang2708@gmail.com` nhận được BTC_PAID notification

## Rollback Plan

> [!CAUTION]
> Email đã gửi **không thể thu hồi**. Chỉ rollback được dữ liệu sheet:
> - Phase 1 rollback: clear DHM8_Data row 51–58 (cần Approval riêng)
> - Phase 2 rollback: clear DHM8_Email_Outbox row 298–313 (cần Approval riêng)
