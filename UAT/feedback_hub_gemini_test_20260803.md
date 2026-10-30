# Kịch bản kiểm thử nhập phản hồi — Feedback Hub

**Ngày:** 03/08/2026  
**Mục đích:** kiểm tra một Ambassador có thể nhập và gửi một phản hồi có cấu trúc vào Google Form chung mà không cần điền dữ liệu cá nhân hoặc tải ảnh.  
**Liên kết người trả lời:** https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor  
**Mã Form:** `1FtWtZ4u0kUPItP4XLo76nSaoMBGGv3DoQi4Zsy_DbuQ`  
**Google Sheet:** `Delivering Happiness — Feedback Hub (Responses)`  
**Mã Google Sheet:** `1tuFiFAy-sGWwA9HtnloOOwyio2mW3CZf25I7vEDcnZU`

## Dữ liệu giả lập an toàn

Chỉ dùng đúng dữ liệu dưới đây; không nhập thông tin cá nhân, khách hàng hoặc dữ liệu thật.

| Trường | Giá trị kiểm thử |
|---|---|
| Sản phẩm/module | ABCDE |
| Loại phản hồi | Báo lỗi |
| Mức ảnh hưởng | Khó dùng |
| Phiên bản sử dụng | Bản thử nghiệm có tri thức lớp học (RAG Beta) |
| Tính năng/luồng hoặc bước liên quan | D |
| Tiêu đề ngắn | Bước D trả lời quá chung chung |
| Mô tả chi tiết | Đây là tình huống giả lập để kiểm tra luồng feedback. Tôi nhập một tình huống về cuộc họp bị trễ deadline. Ở bước D, tôi cung cấp bằng chứng: “Đã nhắc qua email ba lần nhưng chưa nhận phản hồi”. Kết quả quan sát: câu hỏi phản biện vẫn dùng khung chung và chưa bám vào bằng chứng này. Kết quả mong đợi: bước D tóm tắt bằng chứng đã nhập và đặt một câu hỏi phản biện cụ thể hơn cho tình huống. |
| Ảnh chụp màn hình | Để trống; không tải tệp trong ca này |
| Email liên hệ | Để trống |
| Số điện thoại/Zalo | Để trống |
| Cho phép CultureCode Team liên hệ lại? | Không cần liên hệ lại |

## Ca kiểm thử và kết quả mong đợi

### TC-01 — Gửi phản hồi lỗi tối thiểu

1. Mở liên kết người trả lời bằng Chrome ở khung nhìn desktop khoảng 1440 × 900.
2. Chọn đúng các giá trị trong bảng trên.
3. Để trống ảnh, email và số điện thoại/Zalo.
4. Chọn `Không cần liên hệ lại`.
5. Gửi biểu mẫu một lần duy nhất.

**Kết quả mong đợi:**

- Form không chặn việc gửi vì các trường liên hệ và ảnh là tùy chọn.
- Màn hình xác nhận gửi thành công xuất hiện.
- Một dòng mới được ghi vào Google Sheet; đối chiếu theo tên header (tiêu đề cột), vì cột `Loại phản hồi` có thể được Google thêm ở cuối khi Form đã liên kết Sheet trước đó.
- Không có dữ liệu cá nhân thật trong dòng kiểm thử.

## Bằng chứng Gemini cần trả về

- Ảnh chụp trước khi gửi, thể hiện các giá trị đã chọn (có thể chụp phần cuối Form nếu toàn trang quá dài).
- Ảnh chụp màn hình xác nhận sau khi gửi.
- Thời điểm gửi theo múi giờ `Asia/Bangkok`.
- URL đã kiểm tra, khung nhìn, kết quả mong đợi và kết quả quan sát.
- Lỗi trình duyệt, lỗi `console` (bảng điều khiển) hoặc lỗi mạng nếu có; không ghi token/cookie.
- Báo cáo phải được mirror (sao chép về nguồn chuẩn trong project) tại: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_evidence_20260803_feedback_hub.md`

## Ranh giới an toàn

- Chỉ gửi đúng một phản hồi giả lập.
- Không tải ảnh lên để tránh yêu cầu đăng nhập Google và tránh tạo tệp trong Drive.
- Không sửa câu hỏi, quyền chia sẻ, link công bố hoặc Google Sheet.
- Không gửi thêm dữ liệu sau khi đã thấy màn hình xác nhận.
