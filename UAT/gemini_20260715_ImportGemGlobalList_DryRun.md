# Dry-Run Report v2 — Import GEM Global List vào DHM8_Data (8 học viên, không skip)

**Ngày tạo:** 15/07/2026 18:59:00  
**Trạng thái:** DRY-RUN v2 — VERIFIED, chờ Approval Phase 1 & Phase 2  
**Nguồn:** `G:\My Drive\download\Danh sách đăng kí_từ GEM Global.xlsx`  
**Đích:** Spreadsheet `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`  
**MCP:** `workspace-mcp-personal` (vuhoang2708@gmail.com)  
**Script:** `brain/.../scratch/dryrun_final.py` — VERIFIED

---

## Preflight Check — KẾT QUẢ CUỐI

- Tổng Excel: **8 học viên**
- DUPLICATE (skip): **0**
- NEW (sẽ append): **8**
- PAID trước import: **32** | Sau import: **40**

> Võ Thị Minh Nguyệt (`nguyetvtm@cadivi.vn`) xuất hiện tại row 43 DHM8_Data với tên "Phạm Thị Lan" là dữ liệu bất thường của row đó — không liên quan, không phải duplicate của học viên này. → Import bình thường.

---

## Giai đoạn 1 — DHM8_Data: 8 rows sẽ ghi (row 51–58)

| Row | Họ và tên | Email | Phone | Công ty | Chức vụ | Payment | Event ID | UUID |
|-----|-----------|-------|-------|---------|---------|---------|----------|------|
| 51 | Phạm Thị Lan | lanpt@cadivi.vn | 0918646738 | Công ty cổ phần dây cáp điện Việt Nam | Giám đốc Khối Nhân Sự Hành Chính | PAID | DHM8_REG_180726 | `b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd` |
| 52 | Cao Đức Phương | phuongcd@cadivi.vn | 0935363757 | Công ty cổ phần dây cáp điện Việt Nam | Phó Giám Đốc Khối Nhân Sự Hành Chính | PAID | DHM8_REG_180726 | `671993d2-c345-45b2-8fe4-c63141257204` |
| 53 | Võ Thị Minh Nguyệt | nguyetvtm@cadivi.vn | 0934893399 | Công ty cổ phần dây cáp điện Việt Nam | Phó phòng Thu hút & Phát triển NNL | PAID | DHM8_REG_180726 | `220fd342-82b5-4111-9623-aba23e226f01` |
| 54 | Lê Hoàng Anh Tú | tulha@cadivi.vn | 0378728340 | Công ty cổ phần dây cáp điện Việt Nam | Chuyên viên Truyền Thông Nội Bộ | PAID | DHM8_REG_180726 | `c42253b1-49cc-4a53-948b-8bf8231c0d0a` |
| 55 | Nguyễn Thị Hồng Vân | vannth@cadivi.vn | 0901187789 | Công ty cổ phần dây cáp điện Việt Nam | Trưởng phòng Hệ Thống Chính Sách | PAID | DHM8_REG_180726 | `b934e30d-ca2a-4eb0-8186-2c0dead378b2` |
| 56 | Mai Đức Anh | anh@cft-vietnam.com | 0908168973 | CÔNG TY DÂY ĐỒNG VIỆT NAM CFT | Trưởng nhóm kỹ sư điện | PAID | DHM8_REG_180726 | `77587348-a69d-4c5e-b9d7-855e26d51c39` |
| 57 | Trương Minh Công | cong@cft-vietnam.com | 0919670534 | CÔNG TY DÂY ĐỒNG VIỆT NAM CFT | NV Kho vận & Điều độ | PAID | DHM8_REG_180726 | `487f3fff-5e90-4cc8-bc8f-0d84126b6a4e` |
| 58 | Nguyễn Đào Minh Hội | hoi@cft-vietnam.com | 0971380471 | CÔNG TY DÂY ĐỒNG VIỆT NAM CFT | NV Kinh doanh | PAID | DHM8_REG_180726 | `d666a8cb-dabf-486b-a03c-24229717252b` |

Tất cả rows: Timestamp=`15/07/2026 18:45:50` | Nguồn biết đến=`GEM Global` | Người giới thiệu=`GEM Global`

---

## Giai đoạn 2 — DHM8_Email_Outbox: 16 jobs sẽ ghi (row 298–313)

| Row | Job Key | Recipient | Type |
|-----|---------|-----------|------|
| 298 | `dh8:b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd:PAID` | lanpt@cadivi.vn | PAID |
| 299 | `dh8:b8554a18-3f97-4f4d-a4c7-69d5e6c22bbd:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 300 | `dh8:671993d2-c345-45b2-8fe4-c63141257204:PAID` | phuongcd@cadivi.vn | PAID |
| 301 | `dh8:671993d2-c345-45b2-8fe4-c63141257204:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 302 | `dh8:220fd342-82b5-4111-9623-aba23e226f01:PAID` | nguyetvtm@cadivi.vn | PAID |
| 303 | `dh8:220fd342-82b5-4111-9623-aba23e226f01:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 304 | `dh8:c42253b1-49cc-4a53-948b-8bf8231c0d0a:PAID` | tulha@cadivi.vn | PAID |
| 305 | `dh8:c42253b1-49cc-4a53-948b-8bf8231c0d0a:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 306 | `dh8:b934e30d-ca2a-4eb0-8186-2c0dead378b2:PAID` | vannth@cadivi.vn | PAID |
| 307 | `dh8:b934e30d-ca2a-4eb0-8186-2c0dead378b2:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 308 | `dh8:77587348-a69d-4c5e-b9d7-855e26d51c39:PAID` | anh@cft-vietnam.com | PAID |
| 309 | `dh8:77587348-a69d-4c5e-b9d7-855e26d51c39:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 310 | `dh8:487f3fff-5e90-4cc8-bc8f-0d84126b6a4e:PAID` | cong@cft-vietnam.com | PAID |
| 311 | `dh8:487f3fff-5e90-4cc8-bc8f-0d84126b6a4e:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |
| 312 | `dh8:d666a8cb-dabf-486b-a03c-24229717252b:PAID` | hoi@cft-vietnam.com | PAID |
| 313 | `dh8:d666a8cb-dabf-486b-a03c-24229717252b:BTC_PAID` | chauhm71@gmail.com,vuhoang2708@gmail.com,hang.ho@gemglobal.edu.vn | BTC_PAID |

---

## Backup Snapshot (VERIFIED)

- DHM8_Data: 50 dòng (A1:R50), 32 PAID, 10 PENDING — đọc lúc 18:46 15/07/2026
- DHM8_Email_Outbox: 297 dòng (A1:N297) — đọc lúc 18:48 15/07/2026

## Rollback Range
- Phase 1 rollback: xóa DHM8_Data row 51–58
- Phase 2 rollback: xóa DHM8_Email_Outbox row 298–313 (email đã gửi không thu hồi được)
