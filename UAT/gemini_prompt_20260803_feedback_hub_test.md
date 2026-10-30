# Prompt gửi Gemini — kiểm thử nhập Feedback Hub

```text
gemini nói:
Round 1/3 — Hãy thực hiện đúng một ca kiểm thử nhập liệu trên Google Form công khai sau khi đọc đầy đủ kịch bản:

- Kịch bản nguồn chuẩn: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\feedback_hub_gemini_test_20260803.md
- Liên kết Form: https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor
- Google Sheet đích để Codex đối chiếu: https://docs.google.com/spreadsheets/d/1tuFiFAy-sGWwA9HtnloOOwyio2mW3CZf25I7vEDcnZU/edit
- Master plan step (bước trong kế hoạch tổng): Bước 3 — tạo kịch bản dữ liệu thử và prompt kiểm thử; artifact chi tiết ở đường dẫn kịch bản trên.
- Skills dự kiến sử dụng: công cụ trình duyệt (browser - kiểm thử giao diện và luồng người dùng) của Gemini; không sửa code, không sửa Form/Sheet.

Yêu cầu thực thi:
1. Đọc file kịch bản bằng UTF-8 trước khi thao tác.
2. Mở Form ở khung nhìn desktop khoảng 1440 × 900; kiểm tra tiêu đề, mô tả, các trường mới “Sản phẩm/module” và “Loại phản hồi”.
3. Nhập chính xác dữ liệu TC-01 trong file kịch bản: ABCDE / Báo lỗi / Khó dùng / RAG Beta / D / tiêu đề và mô tả giả lập tương ứng.
4. Để trống ảnh chụp màn hình, email và số điện thoại/Zalo; chọn “Không cần liên hệ lại”. Không dùng dữ liệu cá nhân thật.
5. Chụp bằng chứng trước khi gửi, sau đó gửi Form đúng một lần. Không tải ảnh lên.
6. Chụp màn hình xác nhận gửi thành công; ghi thời điểm theo Asia/Bangkok, URL, khung nhìn và kết quả quan sát.
7. Kiểm tra lỗi console (bảng điều khiển) hoặc mạng nếu có, nhưng tuyệt đối không ghi token, cookie hay dữ liệu đăng nhập.
8. Tạo báo cáo UTF-8 và mirror (sao chép về nguồn chuẩn trong project) tại đúng đường dẫn:
   C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_evidence_20260803_feedback_hub.md
   Báo cáo phải ghi rõ: VERIFIED (đã kiểm chứng) / UNVERIFIED (chưa kiểm chứng), đường dẫn ảnh chụp, test case, expected result (kết quả mong đợi), observed result (kết quả quan sát), thời điểm và lỗi nếu có.

Ranh giới dừng:
- Dừng sau khi thấy màn hình xác nhận; không gửi lần hai.
- Không sửa câu hỏi, quyền chia sẻ, trạng thái công bố hoặc Google Sheet.
- Nếu Form chặn gửi, không tự đổi cấu hình; ghi lại màn hình/lỗi và báo BLOCKED (bị chặn) trong báo cáo.
``` 
