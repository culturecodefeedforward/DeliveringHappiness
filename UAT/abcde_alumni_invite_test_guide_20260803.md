# ABCDE — Gói mời thử nghiệm cho học viên cũ

**Ngày:** 03/08/2026  
**Phạm vi:** thử nghiệm có kiểm soát với học viên cũ theo liên kết mời  
**Trạng thái:** `LOCAL VERIFIED / LIVE UNVERIFIED` — giao diện Beta-first đã qua browser UAT local trên desktop/mobile; public URL vẫn là release cũ cho tới khi có staged deploy và production promotion được duyệt riêng.

## 1. Liên kết mời dùng ngay

Đây là `soft invite` (liên kết mời kèm mã dùng chung), chưa phải liên kết cá nhân hóa theo từng người:

- **Chatbot AI ABCDE:** https://delivering-happiness.vercel.app/
- **Bài tập ABCDE — Tự làm & đối chiếu:** https://delivering-happiness.vercel.app/practice-abcde
- **Mã truy cập thử nghiệm:** `ABCDE`

Khi mở trang chủ, chọn **“Trợ lý AI ABCDE — RAG Beta”** để mở chatbot. Mã `ABCDE` không phải bí mật cá nhân; chỉ gửi riêng trong nhóm học viên được mời và không đăng lên trang công khai. Nếu muốn tự làm và đối chiếu, chọn **“Bài tập ABCDE — Tự làm & đối chiếu”**; đây là luồng worksheet riêng, không phải Stable fallback.

### Tin nhắn mời copy/paste

```text
Chào anh/chị, mình đang mời một nhóm học viên cũ thử công cụ thực hành Lạc quan ABCDE.

Link: https://delivering-happiness.vercel.app/
Mã truy cập: ABCDE

Sau khi nhập mã, RAG Beta sẽ là phiên bản chính. Anh/chị bấm “Bắt đầu thực hành”, hoàn thành một tình huống A–E, sau đó gửi lại mẫu [ABCDE FEEDBACK] hoặc [ABCDE BUG] nếu gặp vấn đề. Bản ổn định chỉ xuất hiện khi Beta lỗi. Vui lòng không nhập dữ liệu mật hoặc thông tin của người khác.
```

### Bằng chứng hiện có

- `VERIFIED`: trang chủ trả `HTTP 200`.
- `VERIFIED`: `/practice-abcde` trả `HTTP 200`.
- `VERIFIED`: `POST` (gửi yêu cầu dữ liệu) tới `/api/chat-abcde` với hành động `verify_passcode` và mã `ABCDE` trả `{"success":true}`; đây là kiểm tra trên `API` (Application Programming Interface - giao diện dịch vụ), không phải kiểm thử giao diện.
- `VERIFIED`: phản hồi public mang mã phát hành `0c7a3c23f5d6` tại thời điểm kiểm tra.
- `VERIFIED LOCAL`: browser UAT tại `UAT/abcde-global-beta-first-20260803/local-browser-result.json` xác nhận Beta-primary, RAG endpoint, Stable fallback, desktop/mobile và keyboard.
- `VERIFIED LOCAL`: browser UAT entry point tại `UAT/abcde-worksheet-entry-20260805/local-browser-result.json` xác nhận link worksheet, phân cấp RAG Beta, modal, desktop/mobile và route worksheet.
- `UNVERIFIED LIVE`: public URL chưa có giao diện mới; gửi email báo cáo đầu-cuối chưa được kiểm lại trong release này.

## 2. Cách sử dụng chatbot AI

### Chuẩn bị

1. Dùng Chrome, Edge hoặc Safari bản mới trên máy tính hoặc điện thoại.
2. Mở liên kết chatbot ở trên.
3. Bấm **Trợ lý AI ABCDE — RAG Beta**.
4. Nhập mã `ABCDE`, bấm **Xác nhận**.
5. Xem thẻ **RAG Beta — phiên bản đang phát triển**, rồi bấm **Bắt đầu thực hành**. `RAG` (Retrieval-Augmented Generation - sinh câu trả lời có truy xuất nguồn) bổ sung tri thức lớp học chủ yếu tại bước D — Phản biện.

RAG Beta được mở cho mọi người dùng ABCDE. Nếu Beta báo lỗi kết nối hoặc bị tắt, dùng nút **Chuyển về Bản ổn định** để tiếp tục bài đang làm; Stable không còn là lựa chọn trước khi bắt đầu.

### Cách trả lời 5 bước

Nên dùng một tình huống thật nhưng không chứa thông tin mật. Nếu không thoải mái, dùng tình huống giả lập.

1. **A — Nghịch cảnh:** mô tả sự kiện khách quan, có thể quan sát được; không phán đoán ý định người khác.
2. **B — Niềm tin:** ghi lại suy nghĩ tự động xuất hiện.
3. **C — Hậu quả:** ghi cảm xúc và hành vi phát sinh từ niềm tin B.
4. **D — Phản biện:** kiểm tra bằng chứng, cách giải thích khác và góc nhìn cân bằng hơn.
5. **E — Năng lượng/hành động mới:** ghi cảm xúc mới và một hành động cụ thể có thể làm tiếp theo.

Ở bước D, có thể chọn:

- **Đã hiệu quả, đi tiếp** khi đã đủ rõ để chuyển sang E.
- **Tôi muốn phản biện thêm** khi muốn AI hỏi sâu hơn.

Khi hoàn tất, nhập tên và email nếu muốn nhận báo cáo. Chỉ dùng email mà anh/chị đồng ý cho hệ thống lưu và gửi báo cáo.

### Cách dùng Bài tập ABCDE — Tự làm & đối chiếu

1. Mở `/practice-abcde`.
2. Chọn một tình huống.
3. Điền B, C, D, E.
4. Bấm **Xem Gợi ý & Đối chiếu**.
5. So sánh bài làm của mình với gợi ý; không coi gợi ý mẫu là đáp án duy nhất.

## 3. Ca kiểm thử đề nghị

Mỗi tester nên ghi `ID ca` trong feedback.

| ID | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| T01 | Mã `ABCDE` đúng | Hiện thẻ RAG Beta và nút bắt đầu; không có selector Stable/Beta |
| T02 | Mã sai, ví dụ `SAI-TEST` | Hiện thông báo mã không hợp lệ, không vào chat |
| T03 | Hoàn thành ABCDE bằng RAG Beta | Chuyển đủ A → B → C → D → E; bước D có phản hồi dựa trên tri thức và cuối luồng hiện form nhận báo cáo |
| T04 | Beta trả lỗi 502/503 | Có nút chuyển về bản ổn định; giữ lịch sử và gửi lại tin nhắn cuối |
| T05 | Bỏ trống hoặc nhập câu quá ngắn | AI hỏi làm rõ, không tự bịa nội dung thay người học |
| T06 | Bài tập ABCDE — Tự làm & đối chiếu | Chọn tình huống, nhập B–E và xem được đối chiếu |
| T07 | Gửi email báo cáo | Có thông báo kết quả; email đến đúng địa chỉ hoặc hiện lỗi rõ ràng |
| T08 | Điện thoại | Không bị tràn giao diện, bàn phím không che ô nhập và nút vẫn bấm được |

Không cần chạy tất cả ca trong một lần. Lượt đầu ưu tiên T01, T03 và T06.

## 4. Feedback trải nghiệm

Feedback (phản hồi trải nghiệm) không phải lỗi. Sau mỗi lượt, gửi 4 dòng:

```text
[ABCDE FEEDBACK]
Ca: T03
Điểm dễ dùng (1–5):
Điều hữu ích nhất:
Điều gây bối rối hoặc muốn cải thiện:
```

Nên phản hồi về:

- Câu hỏi AI có giúp nhìn rõ B, C, D, E không?
- Bước nào mất nhiều thời gian nhất?
- Phản hồi có quá chung chung, quá dài hoặc lệch tình huống không?
- Khi có fallback, việc chuyển sang Bản ổn định có rõ ràng và giữ được tiến trình không?
- Sau bài tập, anh/chị có biết hành động tiếp theo mình sẽ làm là gì không?

## 5. Report lỗi

Không gửi toàn bộ câu chuyện cá nhân vào nhóm chung. Có thể thay bằng `[đã ẩn nội dung riêng]` và gửi ảnh đã che email, tên, số điện thoại hoặc thông tin công việc.

```text
[ABCDE BUG]
Mức độ: P1 / P2 / P3
Ca kiểm thử: T__
URL: / hoặc /practice-abcde
Phiên bản: RAG Beta / Bản ổn định sau fallback / Bài tập ABCDE — Tự làm & đối chiếu
Thiết bị + trình duyệt:
Thời điểm (GMT+7):
Bước thực hiện:
Kết quả mong đợi:
Kết quả thực tế:
Thông báo lỗi nguyên văn (nếu có):
Số lần lặp lại: __/__. 
Ảnh/video đã che dữ liệu riêng tư: Có / Không
```

### Mức độ lỗi

- **P1 — Chặn:** không vào được, mất bài, gửi nhầm dữ liệu, hoặc không thể hoàn thành bài.
- **P2 — Nghiêm trọng:** vẫn dùng được nhưng một bước chính sai, phản hồi sai hướng hoặc báo cáo không đến.
- **P3 — Nhẹ:** lỗi chữ, bố cục, tốc độ, câu hỏi chưa tự nhiên nhưng vẫn hoàn thành được.

Một lỗi tốt cần có bước tái hiện rõ ràng. `Expected result` (kết quả mong đợi) và `actual result` (kết quả thực tế) phải tách riêng.

## 6. Ranh giới an toàn

- Không dùng công cụ để chẩn đoán hoặc xử lý khủng hoảng tâm lý.
- Không nhập bí mật công ty, dữ liệu khách hàng, thông tin sức khỏe hoặc thông tin định danh của người khác.
- Nếu nội dung khiến anh/chị thấy không an toàn, dừng bài và báo trực tiếp cho người hướng dẫn; không cố ép AI tiếp tục.
- Báo cáo thử nghiệm chỉ dùng để sửa sản phẩm và đánh giá trải nghiệm trong phạm vi pilot; chưa dùng làm kết luận về hiệu quả trị liệu hay thay đổi tâm lý.

## 7. Kênh nhận phản hồi tạm thời

Tạm thời gửi mẫu `[ABCDE FEEDBACK]` hoặc `[ABCDE BUG]` vào chính nhóm/luồng riêng nơi liên kết mời được phát. Không gửi dữ liệu nhạy cảm vào nhóm chung. Khi anh chốt kênh chính thức, tài liệu này cần được cập nhật thêm địa chỉ hoặc biểu mẫu nhận feedback.

## 8. Phạm vi chưa làm

- Chưa có token mời riêng theo từng học viên.
- Chưa có bảng điều khiển theo dõi tiến độ học viên.
- Chưa có kiểm chứng public release mới bằng trình duyệt trên desktop/mobile.
- Chưa xác nhận đầu-cuối việc lưu Google Sheets và gửi email cho mọi trường hợp.

Muốn có liên kết mời cá nhân hóa thật sự, cần thêm cơ chế token có hạn dùng, thu hồi, giới hạn số lần dùng và nhật ký kiểm toán; đó là một thay đổi code/deploy riêng, chưa nằm trong gói thử nghiệm này.
