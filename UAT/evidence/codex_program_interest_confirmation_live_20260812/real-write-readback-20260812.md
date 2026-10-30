# Program Interest — Real Production UAT (ghi và đọc lại)

## Kết quả

- **Claim level:** `VERIFIED` cho một lượt UAT tổng hợp trên production.
- **Thời điểm:** `2026-08-12T10:51:36Z` (`17:51:36` Asia/Bangkok)
- **URL:** https://delivering-happiness.vercel.app/program-interest
- **Release:** `b9b18c0c860e-938d7d5324a7`
- **Apps Script deployment:** `@69`
- **Endpoint:** `https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec`
- **Spreadsheet runtime target:** `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`
- **Tab:** `Program Interest`
- **UUID:** `ddb58649-d9ea-43d5-b950-1f637be160ba`

## Browser evidence

Một trình duyệt Chromium headless đã mở đúng production route, điền payload UAT giả (AI, không dùng dữ liệu khách hàng), bấm submit và nhận:

```text
CultureCode Team đã ghi nhận thông tin quan tâm của bạn. Chúng tôi sẽ liên hệ khi có chương trình phù hợp.
className: status is-visible is-success
```

Network evidence:

- `POST` tới Apps Script được gửi ở chế độ `no-cors`; trình duyệt ghi nhận redirect HTTP `302` và không đọc response POST trực tiếp, đúng hợp đồng hiện tại.
- JSONP `checkProgramInterestStatus` sau redirect trả HTTP `200` và payload `state: "recorded"` với đúng UUID trên.
- Console không có lỗi `error` hoặc `warning`.

## Sheet read-back

Sheets API đọc lại tab `Program Interest!A:Y` sau submit:

- Tổng số dòng có header: `8`.
- UUID trên xuất hiện đúng **1** lần.
- Dòng khớp: `8`.
- Timestamp dòng khớp: `12/08/2026 17:51:36`.
- Không xóa hoặc sửa dữ liệu cũ.

## Làm rõ `parentId`

`C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\.clasp.json` có `parentId` là `1nZVEowJu3j_WC1b3SO1UJU352g_547813-fWT3MQeac`. Đây là metadata container của Apps Script, **không phải** bằng chứng runtime rằng `SPREADSHEET_ID` đang trỏ tới Sheet đó. ID runtime phải được xác minh bằng Script Properties/authorized read-back (đọc lại có ủy quyền) hoặc bằng một lượt UAT có kiểm soát.

Lượt UAT này đã đọc lại đúng CRM candidate `1ZToRX6J5Vo6UgHzYEE_eUxU0bVnsGxBRLt-8tduI5CA`, vì vậy kết luận trước đó `BLOCKED_TARGET_MISMATCH` dựa riêng trên `parentId` là sai phương pháp.

## Ranh giới kết luận

- `VERIFIED`: production form hiện có thể ghi một dòng mới và xác nhận đúng UUID trên Chrome/Chromium.
- `VERIFIED`: UUID fallback 32 ký tự hex và luồng idempotency vẫn tương thích với backend.
- `UNVERIFIED`: nguyên nhân chính xác trong phiên trình duyệt của người dùng tại thời điểm ảnh lỗi; không có Network/console capture của phiên đó.
- `INFERRED`: ảnh lỗi phù hợp với false negative (báo thất bại giả) ở kênh xác nhận JSONP — POST có thể đã ghi nhưng trình duyệt không hoàn tất callback/đọc trạng thái trong thời gian cho phép. Đây là lỗi môi trường/thời điểm, chưa phải bằng chứng Sheet đang sai đích.

Đọc lại `DHM8_System_Logs!A:D` cho thấy có log `Program interest saved` lúc `17:51:36` cho UUID UAT trên; không có log `Program interest saved` tương ứng quanh thời điểm tạo ảnh `17:24:55`. Đây là bằng chứng hỗ trợ rằng phiên trong ảnh có thể đã bị chặn/đứt trước khi Apps Script xử lý. Vì không có UUID của phiên người dùng, kết luận này vẫn giữ mức `INFERRED`, không nâng thành root cause tuyệt đối.

## External write boundary

Đây là đúng **1** dòng UAT giả được ghi vào Sheet production và được đọc lại. Không gửi email, không thanh toán, không giữ chỗ. Dòng UAT không bị xóa.
