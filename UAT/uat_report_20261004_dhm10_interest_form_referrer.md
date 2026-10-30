# BÁO CÁO KIỂM THỬ NGHIỆM THU (UAT): BỔ SUNG THÔNG TIN NGƯỜI GIỚI THIỆU VÀO FORM QUAN TÂM DHM10

**Thời gian:** 2026-10-04  
**Bề mặt kiểm chứng:** Local & Live Production (Kiểm chứng trực tiếp trên máy và Vercel Live).  
**Kế hoạch tham chiếu:** `plan_20261004_dhm10_interest_form_referrer.md`  
**Trạng thái kiểm thử:** `LIVE DONE - VERIFIED`

---

## 1. FILE ALLOWLIST & TÌNH TRẠNG SAO LƯU
- **Tệp nguồn chính:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\interest_dh10.html`
- **Tệp gói phát hành:** `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\release_package\interest_dh10.html`
- **Tệp sao lưu an toàn (Rollback):**
  * `interest_dh10.html.bak_20261004_before_referrer`
  * `release_package\interest_dh10.html.bak_20261004_before_referrer`

---

## 2. KẾT QUẢ KIỂM TRA ĐỒNG BỘ MÃ NGUỒN (CODE PARITY)
- **Đồng bộ 2 tệp:** `f1 === f2: true` (100% đồng nhất giữa bản gốc và bản `release_package`).
- **Thẻ nhập liệu mới:**
  * `<input type="text" name="referrerName" id="referrerName" placeholder="Ví dụ: Anh/Chị Nguyễn Văn B, đồng nghiệp, cựu học viên..." />`: ĐÃ CÓ.
  * `<input type="tel" name="referrerPhone" id="referrerPhone" placeholder="Số điện thoại hoặc Zalo người giới thiệu..." />`: ĐÃ CÓ.
  * Lớp CSS `.referrer-grid`: ĐÃ CÓ (Grid 2 cột trên desktop, 1 cột responsive trên màn hình <= 640px).
  * Trust note: `* CultureCode Team cam kết bảo mật thông tin và chỉ sử dụng để ghi nhận ưu đãi / hỗ trợ xác thực.`: ĐÃ CÓ.

---

## 3. KỊCH BẢN KIỂM THỬ LOGIC SUBMIT (SIMULATION CASES)

| STT | Kịch bản | Dữ liệu đầu vào người giới thiệu | Kết quả trong `payload` | Chuỗi `note` ghi vào Google Sheet | Trạng thái |
|---|---|---|---|---|---|
| TC-01 | Đầy đủ tên & SĐT người giới thiệu | `referrerName`: "Chị Nguyễn Thị Mai"<br/>`referrerPhone`: "0912345678" | `referrerName`: "Chị Nguyễn Thị Mai"<br/>`referrerPhone`: "0912345678" | `[Địa điểm mong muốn: Hà Nội - Cơ sở Apollo English]`<br/>`[Người giới thiệu: Chị Nguyễn Thị Mai - SĐT: 0912345678]`<br/>`[Kỳ vọng / Lời nhắn]: ...` | **PASS** |
| TC-02 | Chỉ có tên người giới thiệu | `referrerName`: "Anh Trần Hùng"<br/>`referrerPhone`: "" | `referrerName`: "Anh Trần Hùng"<br/>`referrerPhone`: "" | `[Địa điểm mong muốn: TP.HCM - Cơ sở Apollo English]`<br/>`[Người giới thiệu: Anh Trần Hùng]` | **PASS** |
| TC-03 | Không có người giới thiệu (bỏ trống) | `referrerName`: ""<br/>`referrerPhone`: "" | `referrerName`: ""<br/>`referrerPhone`: "" | `[Địa điểm mong muốn: Hà Nội - Cơ sở Apollo English]` (Không chèn dòng người giới thiệu thừa) | **PASS** |

---

## 4. BẰNG CHỨNG XÁC MINH TRÊN MÔI TRƯỜNG LIVE (LIVE VERIFICATION EVIDENCE)
- **Commit SHA:** `77aa224` (`feat(interest): add referrerName and referrerPhone fields to DHM10 interest form`)
- **Remote:** `https://github.com/culturecodefeedforward/DeliveringHappiness.git` (branch `main`)
- **URL kiểm tra:** `https://delivering-happiness.vercel.app/interest_dh10`
- **HTTP Status:** `200 OK`
- **Kết quả rà soát DOM Live:**
  * `Live contains referrerName`: **true**
  * `Live contains referrerPhone`: **true**
  * `Live contains referrer-grid`: **true**
  * `Live contains trust note`: **true**

---

## 5. KẾT LUẬN & ĐÁNH GIÁ TÁC ĐỘNG TÀI LIỆU
- **Bề mặt UAT:** `Live done - VERIFIED`. Tính năng bổ sung Người giới thiệu đã hoạt động chính thức trên cả máy chủ cục bộ và môi trường phát hành trực tiếp.
- **Tương thích Google Sheet:** Dữ liệu người giới thiệu được đưa vào cột `Ghi chú` (`noteCombined`), đảm bảo Google Sheet `DHM10 interest` ghi nhận tức thì mà không yêu cầu sửa đổi backend Apps Script.
- **Tài liệu tác động:** `Docs impact: none` (thay đổi UI trường phụ không làm thay đổi luồng kiến trúc hay quy trình đào tạo cốt lõi).
