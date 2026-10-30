# Phân tích kiểm chứng độc lập — Feedback Hub

**Ngày kiểm chứng:** 03/08/2026 (Asia/Bangkok)  
**Kết luận trước xử lý:** `BLOCKED` (bị chặn trước khi Form tải)  
**Kết luận sau xử lý:** `VERIFIED` cho luồng Form công khai và TC-01 ẩn danh.  
**Review verdict** (kết luận rà soát): `VERIFIED` trong phạm vi Form/Sheet; đã kiểm tra lại bằng trình duyệt không đăng nhập.  
**Operational authorization** (ủy quyền thao tác thật): đã thực hiện thay đổi quyền Form, đổi trường tải ảnh và gửi đúng một dòng TC-01 theo yêu cầu trực tiếp của User; không gửi thông báo Ambassador, không commit/push/deploy.

## Nguồn và bằng chứng

- Kịch bản `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng): `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_test_20260803.md` — [mở file](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/feedback_hub_gemini_test_20260803.md)
- Báo cáo trình duyệt Gemini: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_evidence_20260803_feedback_hub.md` — [mở file](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_evidence_20260803_feedback_hub.md)
- Snapshot kiểm tra độc lập: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\form_access_probe_20260803.md` — [mở file](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/form_access_probe_20260803.md)
- Ảnh trình duyệt thực tế: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshot_error.png` — [xem ảnh](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshot_error.png)
- HTML trang lỗi: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\error_page.html` — [mở HTML](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/error_page.html)
- Script Playwright (tự động hóa trình duyệt): `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\playwright_test\test.js` — [mở script](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/playwright_test/test.js)
- Quy chuẩn báo cáo: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\AGENT_REPORTING_RULES.md` — [mở quy chuẩn](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/AGENT_REPORTING_RULES.md)

## Tóm tắt cổng kiểm chứng trước xử lý

| Cổng | Kết quả | Mức bằng chứng |
|---|---|---|
| Mở Form ở chế độ không đăng nhập | Chuyển hướng sang `accounts.google.com` trước khi Form tải | `FAILED` — có ảnh, HTML và probe URL độc lập |
| Bỏ `usp=publish-editor` | Vẫn chuyển hướng đăng nhập | `VERIFIED` — probe ngày 03/08/2026 |
| Quyền file Google Drive | Chỉ có chủ sở hữu `culturecodeproject@gmail.com`; không có `Anyone with the link` | `VERIFIED` — snapshot quyền tài khoản chủ sở hữu |
| Nhập và gửi TC-01 | Không thể bắt đầu | `BLOCKED` |
| Màn hình xác nhận gửi | Không xuất hiện | `UNVERIFIED` |
| Ghi một dòng vào Google Sheet | Sheet chỉ có hàng tiêu đề | `FAILED` — không có dòng phản hồi |

## Ma trận bề mặt kiểm chứng

| Bề mặt kiểm chứng | Phương pháp | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|
| Local files (tệp cục bộ) | Đọc UTF-8 kịch bản, script, HTML, ảnh và report | Artifact tồn tại, đường dẫn đối chiếu được | `VERIFIED` (phát hiện link ảnh trong report Gemini bị sai vị trí) |
| Apps Script deployment (triển khai Apps Script) | Không thuộc luồng Google Form này | Không áp dụng | `UNVERIFIED` — ngoài phạm vi |
| Public frontend URLs (URL giao diện public) | Không thuộc luồng Google Form này | Không áp dụng | `UNVERIFIED` — ngoài phạm vi |
| Browser evidence (bằng chứng trình duyệt) | Playwright + ảnh `screenshot_error.png` + `error_page.html` | Form hiển thị, cho nhập TC-01 | `FAILED` — trang đăng nhập xuất hiện trước Form |
| Google Drive permission (quyền chia sẻ file) | Truy vấn quyền bằng tài khoản chủ sở hữu | Có quyền người có liên kết | `FAILED` — snapshot chỉ có owner |
| Google Sheet response (dòng phản hồi) | Đọc `'Form Responses 1'!A1:Z100` | Có thêm đúng một dòng TC-01 | `FAILED` — chỉ có hàng tiêu đề |
| Final verdict (kết luận cuối) | Đối chiếu toàn bộ cổng | Tất cả cổng đạt | `BLOCKED` |

## Chi tiết đối chiếu

### 1. Bằng chứng trình duyệt

Báo cáo Gemini ghi `BLOCKED` tại `2026-08-03T17:15:00+07:00`, khung nhìn desktop `1440 × 900`. Ảnh thực tế hiển thị trang `Google Sign in` với thông báo tiếp tục tới Google Forms; HTML có `base href="https://accounts.google.com/v3/signin/"`. Như vậy, trình duyệt chưa từng nhìn thấy các trường `Sản phẩm/module`, `Loại phản hồi`, hay nút gửi.

Script ghi ảnh lỗi bằng đường dẫn tương đối `../screenshot_error.png` và HTML bằng `../error_page.html`; vì script chạy trong thư mục `UAT\playwright_test`, hai file thực tế nằm ở thư mục `UAT`. Link ảnh trong báo cáo Gemini trỏ nhầm sang `UAT\playwright_test\screenshot_error.png` (file không tồn tại).

### 2. Kiểm tra URL độc lập

Probe (kiểm tra trực tiếp) lúc `2026-08-03T10:26:02Z` cho cả ba URL sau đều trả `HTTP 302` tới máy chủ đăng nhập Google:

1. `https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor`
2. `https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform`
3. `https://docs.google.com/forms/d/1FtWtZ4u0kUPItP4XLo76nSaoMBGGv3DoQi4Zsy_DbuQ/viewform`

Do đó, tham số `usp=publish-editor` là vấn đề cần loại bỏ khỏi liên kết gửi đi, nhưng **không phải nguyên nhân duy nhất** và việc chỉ xóa tham số không sửa được lỗi hiện tại.

### 3. Quyền chia sẻ và cài đặt công bố

Truy vấn bằng tài khoản chủ sở hữu `culturecodeproject@gmail.com` xác nhận file Form `1FtWtZ4u0kUPItP4XLo76nSaoMBGGv3DoQi4Zsy_DbuQ` có đúng chủ sở hữu nhưng không có quyền `Anyone with the link`. Đây là bằng chứng trực tiếp cho trạng thái chia sẻ file hiện tại.

Tuy nhiên, Google Forms còn có cài đặt công bố/người trả lời riêng; chưa có bằng chứng giao diện cài đặt để phân biệt chắc chắn giữa `Published` chưa bật, giới hạn miền/tổ chức, hoặc một chính sách tài khoản khác. Vì vậy, nguyên nhân cấp hệ thống được phân loại là:

- `VERIFIED`: truy cập ẩn danh thất bại trước khi Form tải.
- `VERIFIED`: snapshot quyền file không có người có liên kết.
- `UNVERIFIED`: công tắc công bố/người trả lời của Google Forms đang ở trạng thái nào.

### 4. Kiểu trường tải ảnh

Các tài liệu trước đây mô tả trường `Ảnh chụp màn hình (không bắt buộc)` như trường `File upload` (tải tệp), nhưng DOM Form chưa tải nên chưa thể xác nhận độc lập. Không được quy kết trường này là nguyên nhân của lần chặn hiện tại: ngay cả URL không có tham số `usp` cũng bị chuyển hướng trước khi người dùng có thể bỏ trống trường ảnh.

### 5. Google Sheet

Đọc bảng `Delivering Happiness — Feedback Hub (Responses)` bằng mã `1tuFiFAy-sGWwA9HtnloOOwyio2mW3CZf25I7vEDcnZU` trả về đúng một hàng là header (tiêu đề): `Timestamp`, `Sản phẩm/module`, `Mức ảnh hưởng`, `Phiên bản sử dụng`, `Tính năng/luồng hoặc bước liên quan`, `Tiêu đề ngắn`, `Mô tả chi tiết`, `Ảnh chụp màn hình (không bắt buộc)`, `Email liên hệ (khuyến nghị, không bắt buộc)`, `Số điện thoại/Zalo (khuyến nghị, không bắt buộc)`, `Cho phép CultureCode Team liên hệ lại?`, `Loại phản hồi`. Không có dòng TC-01.

Vì chưa có dòng submit, mức khớp dữ liệu là **0/11 trường ứng dụng được kiểm chứng**; đây là `UNVERIFIED` do không có dữ liệu, không phải kết luận rằng nội dung TC-01 sai.

## Đánh giá nguyên nhân và phạm vi ảnh hưởng

- **Failure class** (loại lỗi): lỗi quyền/trạng thái công bố của bề mặt trả lời Google Form; có thể kèm chính sách đăng nhập của tài khoản chủ sở hữu.
- **Broken assumption** (giả định sai): tài liệu mời Ambassador nói Form đã `Published` và `Anyone with the link`, nhưng kiểm tra độc lập hiện tại không chứng minh điều đó.
- **Blast radius** (phạm vi ảnh hưởng): mọi Ambassador chưa đăng nhập đều bị chặn ngay khi bấm link; chưa thể thu feedback nào qua luồng này.
- **Control point** (điểm chặn): tài khoản chủ sở hữu cần kiểm tra cài đặt công bố/người trả lời và quyền chia sẻ trước khi phát link.
- **Prevent / detect / recover** (ngăn / phát hiện / khôi phục): giữ một ca kiểm tra ẩn danh bắt buộc trước khi gửi; probe cả URL có và không có tham số; đối chiếu Sheet sau submit; chỉ phát hành lại sau khi có ảnh Form và dòng Sheet.

## Khuyến nghị xử lý

1. **Tạm dừng gửi link cho Ambassador.** Không dùng tuyên bố cũ “đã công bố cho người có liên kết” cho đến khi kiểm tra lại.
2. Chủ sở hữu `culturecodeproject@gmail.com` mở phần cài đặt người trả lời của Form, bật chế độ người có liên kết được trả lời nếu đó là lựa chọn đã duyệt, và kiểm tra lại trong cửa sổ ẩn danh. Đây là thao tác thay đổi quyền bên ngoài; chưa thực hiện trong lượt này.
3. Khi muốn giữ trường tải ảnh, ghi rõ người gửi ảnh phải đăng nhập Google. Nếu mục tiêu là ít ma sát và không đăng nhập, cân nhắc thay bằng ô nhập liên kết ảnh tùy chọn hoặc bỏ trường tải tệp; chỉ sửa sau khi User chốt phương án.
4. Sau khi cài đặt được User duyệt, chạy lại đúng TC-01 một lần: không tải ảnh, không dùng dữ liệu cá nhân, chụp ảnh trước/sau, rồi đọc Sheet theo tên header. Điều kiện đạt là Form tải được ẩn danh, có màn hình xác nhận và Sheet có đúng một dòng mới.

## Docs impact và trạng thái repo

- **Docs impact:** chỉ cập nhật UAT analysis và thêm snapshot bằng chứng; không đổi code, Apps Script, Form, Sheet, URL public hay user-flow production.
- Không commit, push, deploy, xóa file hoặc external write trong lượt này.
- File mới/cập nhật là artifact UAT có chủ đích; cần giữ để review. Việc dọn các file Playwright tạm (nếu muốn) phải có backup và User duyệt riêng.

## Routing evidence (bằng chứng định tuyến artifact)

- `cwd`: `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH`
- `resolved project`: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website`
- `original path`: artifact UAT đã có trong project; không dùng artifact từ thư mục brain.
- `mirrored path`: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\form_access_probe_20260803.md` — [mở snapshot](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/form_access_probe_20260803.md)
- `mirror time`: 03/08/2026, trong lượt kiểm chứng này.
- `reason`: bảo toàn bằng chứng quyền, URL và Sheet ở nguồn chuẩn repo-visible (nguồn nhìn thấy trong project).

## Addendum 03/08/2026 — đã xử lý và kiểm chứng lại

- Giao diện chủ sở hữu xác nhận `Published options`: `Accepting responses` bật và `Responders: Anyone with the link`.
- Nguyên nhân gây yêu cầu đăng nhập là câu hỏi `File upload` (tải tệp), dù trường được đánh dấu không bắt buộc. Đã đổi thành `Short answer` với nhãn `Liên kết ảnh chụp màn hình (không bắt buộc)` và cập nhật mô tả Form.
- Quyền file Form hiện là `Anyone with the link (reader)` + owner; quyền `writer` tạm cấp cho `vuhoang2708@gmail.com` đã thu hồi. Sheet vẫn có owner + `vuhoang2708@gmail.com` writer.
- Probe ẩn danh sau xử lý trả `HTTP 200`; không còn chuyển hướng Google Sign-in.
- Playwright không có phiên đăng nhập đã điền và gửi đúng một TC-01; ảnh xác nhận tại `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshot_after_submit.png` — [xem ảnh](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshot_after_submit.png).
- Sheet hiện có đúng một dòng test mới; report chi tiết: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\uat_report_20260803_feedback_hub_public_fix.md` — [mở report](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/uat_report_20260803_feedback_hub_public_fix.md).
- Gemini retest độc lập đã `VERIFIED` trên desktop/mobile, không redirect, không lỗi Console/Network và xác nhận trường ảnh là ô liên kết. Evidence: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_evidence_20260803_feedback_hub_final_retest.md` — [mở evidence](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_evidence_20260803_feedback_hub_final_retest.md).
