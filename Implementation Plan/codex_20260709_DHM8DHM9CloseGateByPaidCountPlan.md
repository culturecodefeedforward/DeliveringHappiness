# Plan: Đổi rule đóng cổng DHM8/DHM9 từ 40 đăng ký sang 40 thanh toán thành công

## Mục tiêu

Đổi điều kiện đóng cổng đăng ký cho cả DHM8 và DHM9:

- Hiện tại: đóng khi sheet đăng ký có `>= 40` dòng dữ liệu.
- Mới: đóng khi có `>= 40` dòng đăng ký có `Payment Status = PAID`.

## Phạm vi

### File sửa local

- `Scripts/active_code_gs_final.js`
- `Artifacts/dhm9_apps_script_prod_deploy_20260701_174939/Mã.js`

Lý do sửa cả 2 file: `UAT/walkthrough.md` đang ghi `Scripts/active_code_gs_final.js` và file deploy DHM9 phải zero-diff trước deploy.

### Không làm trong lượt local này nếu chưa được duyệt riêng

- Không `clasp push`.
- Không deploy Apps Script production.
- Không commit/push Git.
- Không sửa Google Sheet.
- Không gửi email.
- Không submit đăng ký test thật trên production.

## Chẩn đoán hiện tại

`VERIFIED` từ source:

- `Scripts/active_code_gs_final.js` đang dùng `getDhm8RegistrationDataRowCount_(sheet)` để đếm mọi dòng đăng ký có dữ liệu.
- `getRegistrationAvailability_(laneKey)` đang đóng khi `dataRowCount >= lane.registrationCap`.
- `handleRegistration(data, laneKey)` cũng chặn append mới khi `dataRowCount >= lane.registrationCap`.
- Frontend `register.js` và `register_dh9.js` đã có logic ẩn form khi backend trả `registrationOpen === false`.

## Thiết kế thay đổi

1. Thêm helper `getRegistrationPaidCount_(sheet)` để đếm dòng có `Payment Status = PAID`.
2. `getRegistrationAvailability_(laneKey)` trả thêm:
   - `paidCount`
   - `dataRowCount`
   - `countBasis: "PAID"`
3. `registrationOpen` được tính bằng `paidCount < lane.registrationCap`.
4. `buildRegistrationClosedPayload_()` trả thêm `paidCount` và `countBasis`.
5. `handleRegistration()` dùng `paidCount` để quyết định chặn đăng ký mới.

## Semantics cần chốt rõ

Rule mới chỉ chặn **đăng ký mới** khi đã có 40 người thanh toán thành công.

Existing/resume payment flow vẫn chạy cho người đã có registration UUID trước đó. Vì vậy nếu đã có nhiều pending trước khi chạm 40 paid, sau đó họ tiếp tục thanh toán thì tổng paid có thể vượt 40. Muốn hard cap tuyệt đối không vượt 40 paid thì phải thêm payment gate/refund/waitlist ở webhook SePay, đây là thay đổi risk cao hơn và chưa nằm trong yêu cầu hiện tại.

## Kiểm chứng local

- `node --check Scripts/active_code_gs_final.js`
- `node --check Artifacts/dhm9_apps_script_prod_deploy_20260701_174939/Mã.js`
- `git diff --no-index Scripts/active_code_gs_final.js Artifacts/dhm9_apps_script_prod_deploy_20260701_174939/Mã.js`
- Grep xác nhận không còn dùng `dataRowCount >= lane.registrationCap` cho gate đóng cổng.

## Kiểm chứng production sau khi được duyệt deploy riêng

1. `clasp push` vào đúng Apps Script production target.
2. Deploy đúng deployment ID đang dùng cho DHM9/DHM8.
3. Probe read-only:
   - DHM8 `/exec?action=checkRegistrationAvailability&lane=dh8`
   - DHM9 `/exec?action=checkRegistrationAvailability&lane=dh9`
4. Kỳ vọng response có `countBasis: "PAID"`, `paidCount`, `dataRowCount`, `registrationOpen`.

## Rủi ro

- `VERIFIED`: thay đổi chạm backend Apps Script production logic, cần deploy riêng mới có hiệu lực live.
- `INFERRED`: frontend không cần đổi vì đã đọc `registrationOpen`.
- `UNVERIFIED`: số paid hiện tại trên live Sheet chưa được probe trong plan này.
- `RISK`: nếu nhiều người pending trước khi chạm 40 paid và cùng thanh toán sau đó, tổng paid có thể vượt 40. Đây là đúng với scope "đóng cổng đăng ký mới theo paid count", nhưng không phải hard cap thanh toán tuyệt đối.

## Rollback

- Revert 2 file về commit hiện tại hoặc dùng `git checkout -- Scripts/active_code_gs_final.js Artifacts/dhm9_apps_script_prod_deploy_20260701_174939/Mã.js` nếu chưa commit.
- Nếu đã deploy Apps Script, redeploy version trước đó hoặc deploy lại bản rollback.

## Approval boundary

- Local edit + local verification: nằm trong yêu cầu "thay đổi rule" hiện tại.
- `clasp push/deploy`, commit/push, hoặc live production test có ghi dữ liệu: cần user approve riêng.
