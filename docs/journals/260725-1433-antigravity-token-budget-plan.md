# Journal: Lập kế hoạch giảm Antigravity Customization Token Budget

**Ngày:** 2026-07-25
**Loại:** Research + planning
**Artifact chính:** `plans/260725-1433-antigravity-token-budget-ab-test/`

## Bối cảnh

Antigravity hiển thị 25.909 token tùy biến, xấp xỉ 129,5% ngân sách suy ra. Câu hỏi ban đầu là liệu có thể tinh gọn `AGENTS.md`/`GEMINI.md`, hạn chế skill ít dùng và dùng Second Brain để mở conversation mới mà không mất luồng hay không.

## Quyết định

Không sửa cấu hình ngay. Tạo một research report (báo cáo nghiên cứu), kế hoạch bốn phase và controlled experiment (thử nghiệm có đối chứng). Kiến trúc mục tiêu giữ always-on core (hạt nhân luôn nạp) ngắn, chuyển rule chuyên biệt sang project/workflow gọi khi cần, phân nhóm plugin/skill theo bằng chứng sử dụng và dùng Second Brain như checkpoint ngắn.

## Điều làm tốt

- Tách rõ customization budget (ngân sách tùy biến) khỏi conversation context (ngữ cảnh hội thoại).
- Phân loại claim thành `VERIFIED`, `INFERRED` và `UNVERIFIED`.
- Giữ approval boundary (ranh giới phê duyệt): chưa sửa global rule, plugin, IDE hay dữ liệu Second Brain.
- Thiết kế rollback (quay lui) và bằng chứng trước khi mutation (thao tác thay đổi).

## Bài học từ red-team

Bản nháp đầu chưa đủ để tạo kết luận nhân quả. Ba reviewer tìm thấy 15 rủi ro Critical/High: có thể gắn sai nhãn A/B, backup không bất biến, runtime chưa chắc nạp đúng profile, Second Brain đọc chéo project hoặc xóa hot buffer sớm, raw transcript có thể rò dữ liệu, và thứ tự A→B1→B2 bị nhiễu thời gian.

Các sửa đổi quan trọng là: ánh xạ UI breakdown sang canonical path trước khi sửa; activation contract (hợp đồng kích hoạt) cho từng block; crossover (đổi chéo cấu hình); toggle nguyên tử; namespace Second Brain theo project; lưu raw evidence ngoài repo; và coi critical invariant là zero-tolerance.

## Bước tiếp theo

Phase 1 chỉ được bắt đầu sau khi người dùng duyệt riêng việc tạo backup và thu baseline. Mọi thay đổi rule/plugin, refresh IDE, chạy A/B và rollback tiếp tục cần phê duyệt theo từng gate. Working tree hiện rất bẩn, nên artifact thử nghiệm phải dùng allowlist tuyệt đối và không được stage cùng thay đổi có sẵn.

