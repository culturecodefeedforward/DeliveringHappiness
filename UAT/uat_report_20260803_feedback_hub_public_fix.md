# UAT (User Acceptance Testing - kiểm thử nghiệm thu người dùng) — Feedback Hub sau xử lý

**Thời điểm:** 03/08/2026, khoảng 18:28 Asia/Bangkok  
**Review verdict** (kết luận rà soát): `VERIFIED` cho luồng Form công khai và TC-01 ẩn danh  
**Phạm vi:** chỉ Google Form, Google Sheet liên kết và luồng gửi phản hồi; không phải kiểm chứng giao diện website public.

## Thay đổi đã thực hiện

1. Form được giữ ở chế độ `Anyone with the link` (ai có liên kết được truy cập) và `Accepting responses` (đang nhận phản hồi).
2. Phát hiện nguyên nhân Google bắt đăng nhập là câu hỏi `File upload` (tải tệp). Đã đổi thành `Short answer` (ô nhập văn bản) với nhãn `Liên kết ảnh chụp màn hình (không bắt buộc)`.
3. Cập nhật mô tả Form: nếu có ảnh thì dán liên kết chia sẻ công khai; không tải tệp và không cần đăng nhập.
4. Quyền `writer` (biên tập) cấp tạm cho `vuhoang2708@gmail.com` trên Form đã được thu hồi sau khi chỉnh xong. Quyền writer trên Sheet vẫn giữ nguyên.

## Bề mặt và bằng chứng

| Bề mặt | Bằng chứng | Trạng thái |
|---|---|---|
| Cài đặt Form | Giao diện chủ sở hữu hiển thị `Published options` → `Accepting responses` đã bật, `Responders: Anyone with the link` | `VERIFIED` |
| Quyền Form sau dọn | Snapshot quyền: `Anyone with the link (reader)` + owner; không còn writer tạm | `VERIFIED` |
| URL ẩn danh | Probe sau xử lý trả `HTTP 200`, không chuyển sang Google Sign-in | `VERIFIED` |
| Browser evidence (bằng chứng trình duyệt) | Playwright không có phiên đăng nhập điền và gửi TC-01 thành công | `VERIFIED` |
| Xác nhận gửi | Ảnh `screenshot_after_submit.png` hiển thị “Câu trả lời của bạn đã được ghi lại.” | `VERIFIED` |
| Google Sheet | Có đúng một dòng mới; đối chiếu theo tên header | `VERIFIED` |
| Quyền Sheet | Owner + `vuhoang2708@gmail.com` writer; không đổi | `VERIFIED` |

## Dữ liệu TC-01 đã gửi

- Sản phẩm/module: `ABCDE`
- Loại phản hồi: `Báo lỗi`
- Mức ảnh hưởng: `Khó dùng`
- Phiên bản: `Bản thử nghiệm có tri thức lớp học (RAG Beta)`
- Tính năng/bước: `D`
- Tiêu đề: `Bước D trả lời quá chung chung`
- Email, số điện thoại/Zalo, liên kết ảnh: để trống.
- Cho phép liên hệ lại: `Không cần liên hệ lại`.

Sheet ghi dòng mới với timestamp hiển thị `8/3/2026 18:27:10`; không có dữ liệu cá nhân thật.

## Artifact bằng chứng

- Kịch bản: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_test_20260803.md` — [mở](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/feedback_hub_gemini_test_20260803.md)
- Ảnh trước gửi: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshot_before_submit.png` — [xem](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshot_before_submit.png)
- Ảnh xác nhận: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\screenshot_after_submit.png` — [xem](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/screenshot_after_submit.png)
- Script đã sửa locator: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\playwright_test\test.js` — [mở](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/playwright_test/test.js)
- Snapshot quyền/URL: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\form_access_probe_20260803.md` — [mở](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/form_access_probe_20260803.md)
- Báo cáo phân tích: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_analysis_20260803.md` — [mở](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/feedback_hub_gemini_analysis_20260803.md)

## Quyết định vận hành

- Có thể gửi link trả lời chuẩn (không dùng `?usp=publish-editor`) cho nhóm Ambassador.
- Hướng dẫn phải nói rõ: ảnh là tùy chọn; nếu có ảnh thì dán liên kết công khai, che dữ liệu riêng tư.
- Dòng TC-01 đang được giữ lại làm bằng chứng kiểm thử; không tự xóa. Nếu cần xóa hoặc đánh dấu trong Sheet, phải có User duyệt riêng.
- Chưa gửi thông báo Ambassador, chưa commit/push/deploy.

## Docs impact (tác động tài liệu)

Đã cập nhật nội dung Form và tài liệu mời Ambassador để không còn hướng dẫn tải tệp/đăng nhập. Không thay đổi code website hay Apps Script.

## Independent Gemini retest (kiểm chứng chéo độc lập) — VERIFIED

Gemini đã kiểm tra read-only (chỉ đọc) trên desktop `1440×900` và mobile `390×844`: Form mở ẩn danh, không redirect (chuyển hướng) tới Google Sign-in, không có lỗi Console/Network, và không còn phần tử tải tệp.

- Report Gemini: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_evidence_20260803_feedback_hub_final_retest.md` — [mở report](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_evidence_20260803_feedback_hub_final_retest.md)
- Screenshot desktop: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_desktop_form.png` — [xem ảnh](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_desktop_form.png)
- Screenshot mobile: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_mobile_form.png` — [xem ảnh](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/gemini_mobile_form.png)

Master plan step 5 đủ điều kiện đóng ở mức `VERIFIED` cho bề mặt Form/Sheet pilot.
