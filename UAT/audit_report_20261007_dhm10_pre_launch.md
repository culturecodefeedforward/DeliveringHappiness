# AUDIT REPORT — DHM10 PRE-LAUNCH CHECK
**Ngày audit:** 2026-10-07 14:51  
**Người thực hiện:** Gemini Antigravity  
**Confirmed by:** Sếp Dzũ (thông tin địa điểm, danh sách, faculty)

---

## THÔNG TIN ĐÃ XÁC NHẬN

| Hạng mục | Giá trị |
|---|---|
| Ngày học | **Thứ Bảy, 10/10/2026** |
| Địa điểm HN | Apollo English — 181-183-185 Phố Huế, Phường Phố Huế, Quận Hai Bà Trưng, Hà Nội |
| Địa điểm SG | Apollo English — 58 Phạm Ngọc Thạch, Phường 6, Quận 3, TP. Hồ Chí Minh |
| Học phí | 250.000đ (giữ nguyên DHM9) |
| Zalo Group | ⏳ Chờ link mới từ Chị Châu |
| Faculty DHM10 | Vũ, Châu, Hoàn, Hưng, Ngọc Hân (Kate — `diemhann@gmail.com`) |

---

## KẾT QUẢ AUDIT CÁC FILE

### 1. `register_dhm10.html`

| Kiểm tra | Kết quả |
|---|---|
| Ngày 10/10/2026 | ✅ Đã patch — hiển thị "🗓️ Thứ Bảy, 10/10/2026" trong subtitle |
| Địa chỉ HN chi tiết | ✅ Đã patch — "181-183-185 Phố Huế, Q. Hai Bà Trưng" |
| Địa chỉ SG chi tiết | ✅ Đã patch — "58 Phạm Ngọc Thạch, Q. 3" |
| Lane `dh10` | ✅ `hidden input lane="dh10"` đúng |
| SePay payment prefix | ✅ `DHM10<SDT>` theo convention |
| Location selector required | ✅ `required` attribute đúng trên cả 2 radio |
| Zalo URL | ⚠️ Còn trỏ DHM9 link — **CHỜ LINK MỚI** |
| Backup | ✅ `register_dhm10.html.bak_20261007_pre_patch` |
| Mirror release_package | ✅ Done |

### 2. `Artifacts/standardized_emails/dhm10_pending_email.html`

| Kiểm tra | Kết quả |
|---|---|
| Ngày 10/10/2026 | ✅ Đã patch vào event-box |
| Địa chỉ HN + SG chi tiết | ✅ Đã patch đủ 2 địa điểm |
| Template biến `{{FullName}}` | ✅ OK |
| Template biến `{{PaymentCode}}` | ✅ OK |
| QR SePay BIDV 8815369431 | ✅ OK |
| Chủ TK: Hà Ngọc Hoàn | ✅ OK |
| Backup | ✅ `dhm10_pending_email.html.bak_20261007_pre_patch` |

### 3. Apps Script Lane `dh10`

| Kiểm tra | Kết quả |
|---|---|
| `getLaneConfig_('dh10')` | ✅ Đã khai báo đầy đủ |
| `paymentPrefix: 'DHM10'` | ✅ OK |
| `dataSheetName: 'DHM10_Data'` | ✅ OK |
| `outboxSheetName: 'DHM10_Email_Outbox'` | ✅ OK |
| KILL_SWITCH_PAYMENT | ⚠️ Cần verify trên Google Apps Script Console trực tiếp |

### 4. Script gửi email `send_dhm10_registration_reminder.py`

| Kiểm tra | Kết quả |
|---|---|
| Dry-run | ✅ Chạy thành công — 25 targets |
| Danh sách target | ✅ 25 người DHM_Registration |
| Mã thanh toán sinh đúng | ✅ `DHM10<phone_last4>` |
| Safety gate Zalo URL | ✅ Block nếu còn PLACEHOLDER |
| Production confirm prompt | ✅ Yêu cầu gõ "CONFIRM DHM10 SEND" |

---

## 25 NGƯỜI TRONG DANH SÁCH DHM_Registration (Target Email Reminder)

| # | Họ tên | Email | Mã thanh toán |
|---|---|---|---|
| 1 | Hồ Lê Tấn | tan.hole@outlook.com | DHM106093 |
| 2 | Khoa Nguyễn | nguyenphamanhkhoa1807@gmail.com | DHM107093 |
| 3 | Linh Vu | vukhanhlinh91@gmail.com | DHM102632 |
| 4 | Lê Hoài Vân Anh | anh.le@fuchs.com | DHM103866 |
| 5 | Lê Thị Hiên | hienle292@gmail.com | DHM104124 |
| 6 | Lê Thị Thanh Hằng | lethi.thanhhang@yahoo.com | DHM103099 |
| 7 | Lương Thị Thu Phương | tina.15011999@gmail.com | DHM108668 |
| 8 | Nguyen Quoc Hung | quochung.reo@gmail.com | DHM108678 |
| 9 | Nguyễn Duy Trường | truongnd1989@gmail.com | DHM101710 |
| 10 | Nguyễn Hoàng Hương | hoanghuongs@gmail.com | DHM107688 |
| 11 | Nguyễn Ngọc Khánh Ngân | nnkngan4w@gmail.com | DHM100164 |
| 12 | Nguyễn Phương Hà | ha.nguyen@whitecoat.global | DHM103102 |
| 13 | Nguyễn Phương Vy | phuongvynguyen127@gmail.com | DHM105020 |
| 14 | Nguyễn Thùy Trân | tran.nguyen1@action-composites.com.vn | DHM107086 |
| 15 | Nguyễn Thạch Uyên Vy | vy.ntu2011@gmail.com | DHM109656 |
| 16 | Nguyễn Thị Phương Thanh | thanhntp.exp@gmail.com | DHM106259 |
| 17 | Nguyễn Trọng Đức | nguyentrong.duc@vn.sika.com | DHM108388 |
| 18 | Ngô Thị Phương Thảo | ngothiphuong.thao@vn.nestle.com | DHM105343 |
| 19 | Phúc HIPER | hiper@hiperconsulting.vn | DHM106674 |
| 20 | Sofia | quynhtruc90@gmail.com | DHM105001 |
| 21 | Thai Thi Van Anh | van.anh.thai@ktcvietnam.com | DHM109163 |
| 22 | Trần Tử Phú | phienbanbv@gmail.com | DHM106161 |
| 23 | Võ Hương | janevo0509@gmail.com | DHM102645 |
| 24 | Vũ Thị Thanh Tâm | dungtam1210@gmail.com | DHM100388 |
| 25 | Đoàn Trâm Anh | anh.doan@whitecoat.vn | DHM104594 |

---

## VIỆC CÒN LẠI (Checklist chặn)

- [ ] **BLOCKING:** Nhận link Zalo Group DHM10 mới từ Chị Châu → cập nhật vào `register_dhm10.html` (dòng 408), `active_code_gs_final.js` (`DEFAULT_DH10_ZALO_GROUP_URL`), và script `send_dhm10_registration_reminder.py` (`DHM10_ZALO_URL`)
- [ ] **BLOCKING:** Verify KILL_SWITCH_PAYMENT trong Google Apps Script — đảm bảo không phải "true" cho lane dh10
- [ ] **BLOCKING (Cấp độ 3):** Gửi test email về `vuhoang2708software@gmail.com` → confirm nhận được và QR đúng → xin approval → batch send 25 người
- [ ] **BLOCKING (Cấp độ 3):** Git commit + push → Vercel deploy
- [ ] Gửi email thông báo lịch cho faculty: Vũ, Châu, Hoàn, Hưng, Kate (`diemhann@gmail.com`)
- [ ] Verify Google Sheet `DHM10_Data` đã tồn tại trên Google Sheets
- [ ] Kiểm tra `checkin.html` hỗ trợ lane `dh10` chưa

---

*Audit done: 2026-10-07 | Claim level: LOCAL DONE — chưa verify live*
