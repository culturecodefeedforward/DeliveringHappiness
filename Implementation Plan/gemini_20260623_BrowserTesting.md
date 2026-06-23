# Kế hoạch Triển khai Kiểm thử Tự động hóa Trình duyệt (Browser Automation Testing Implementation Plan)

- **Ngày tạo**: 2026-06-23
- **Tác giả**: Gemini BrowserTester (Subagent)
- **Dự án**: dh4hn-website
- **Đường dẫn file**: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_20260623_BrowserTesting.md`

---

## 1. Đề bài (Requirements)
Thực hiện `UAT` (User Acceptance Testing - kiểm thử nghiệm thu người dùng) tự động hóa trình duyệt tại `localhost:5000`:
1. Truy cập `http://localhost:5000/register_direct.html`.
   - Xác minh trực quan xem `form` (biểu mẫu nhập liệu) hiển thị đúng 2 trường nhập trực tiếp: "Tên người giới thiệu (nếu có)" và "Số điện thoại người giới thiệu (nếu có)", đồng thời KHÔNG có nhóm `radio button` (nút chọn một tùy chọn) chọn đối tác (GEM Global, Smart Train, Nguồn khác).
   - Chụp ảnh màn hình lưu vào: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\local_register_direct.png`.
2. Truy cập `http://localhost:5000/assessment.html`.
   - Xác minh ở dưới cùng (dưới phần câu hỏi động) có xuất hiện 2 nút điều hướng nhanh: "Xem thông tin chương trình" và "Đăng ký ngay".
   - Chụp ảnh màn hình lưu vào: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\local_assessment_quiz.png`.
3. Hoàn thành bài trắc nghiệm (trả lời qua 10 câu hỏi) để chuyển sang màn hình kết quả (Summary).
   - Xác minh khi ở màn hình kết quả, 2 nút điều hướng nhanh của `quiz` (bài trắc nghiệm) tự động ẩn đi để tránh trùng lặp nút.
   - Chụp ảnh màn hình lưu vào: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\local_assessment_summary.png`.
4. Báo cáo kết quả kiểm tra kèm đường dẫn các ảnh chụp màn hình tương ứng.

## 2. Hiện trạng (Current State)
- Các file `register_direct.html`, `assessment.html`, `quiz.js` đã tồn tại trong thư mục dự án và có cấu trúc sẵn sàng cho kiểm thử.
- Trình duyệt và môi trường kiểm thử cần được chạy cục bộ qua `localhost:5000`. Cần xác minh xem máy chủ cục bộ (local server) đang chạy trên cổng 5000 hay chưa.
- Chúng ta có các kịch bản mẫu từ kỹ năng `chrome-devtools` giúp tương tác với trình duyệt Chrome qua `Puppeteer` (thư viện NodeJS để điều khiển trình duyệt không đầu/có đầu).

## 3. Giải pháp kỹ thuật (Technical Solution)
- **Bước 1**: Kiểm tra trạng thái hoạt động của máy chủ cục bộ (local server) ở cổng 5000. Nếu chưa chạy, chúng ta sẽ bắt đầu khởi chạy máy chủ cục bộ bằng `npx serve` hoặc một lệnh tương đương trên thư mục gốc của dự án.
- **Bước 2**: Viết một script tự động hóa bằng Puppeteer nằm tại `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\run_browser_test.js` để tự động hóa toàn bộ quy trình:
  - Khởi chạy trình duyệt Chrome ở chế độ `headless` (chạy không có giao diện đồ họa).
  - Điều hướng tới `http://localhost:5000/register_direct.html`, chụp ảnh màn hình lưu tại `UAT\local_register_direct.png`.
  - Điều hướng tới `http://localhost:5000/assessment.html`, chụp ảnh màn hình lưu tại `UAT\local_assessment_quiz.png`.
  - Thực hiện nhấp chọn tự động qua 10 câu hỏi của bài trắc nghiệm bằng cách lựa chọn các phương án ngẫu nhiên hoặc phương án đầu tiên, nhấn nút "Tiếp theo" liên tiếp cho đến khi kết thúc.
  - Đợi màn hình kết quả (Summary) xuất hiện và xác nhận phần tử `#quizNavActions` có `display: none` hoặc bị ẩn khỏi màn hình. Chụp ảnh màn hình lưu tại `UAT\local_assessment_summary.png`.
- **Bước 3**: Chạy script thử nghiệm, kiểm tra `console log` (nhật ký bảng điều khiển) của trình duyệt để đảm bảo không phát sinh lỗi JS nghiêm trọng.
- **Bước 4**: Kiểm tra và đối chiếu các ảnh chụp màn hình được sinh ra trong thư mục `UAT\`.

## 4. Các file bị ảnh hưởng (Affected Files)
- **Tạo mới**:
  - `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\run_browser_test.js` (Script chạy kiểm thử tự động).
  - Các ảnh chụp màn hình trong `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\`:
    - `local_register_direct.png`
    - `local_assessment_quiz.png`
    - `local_assessment_summary.png`
- **Sửa đổi**: Không có file mã nguồn nào bị thay đổi.

## 5. Rủi ro tiềm ẩn & Giải pháp phòng ngừa (Potential Risks & Mitigations)
- **Rủi ro**: Máy chủ cổng 5000 không chạy hoặc bị chiếm dụng.
  - *Phòng ngừa*: Kiểm tra cổng trước và chạy lệnh start server nếu chưa chạy.
- **Rủi ro**: Không tìm thấy thư viện `puppeteer` cục bộ hoặc toàn cục gây lỗi không chạy được script Node.js.
  - *Phòng ngừa*: Sử dụng thư viện `puppeteer` từ kỹ năng `chrome-devtools` sẵn có bằng cách trỏ đường dẫn nạp module đến thư mục cài đặt của `chrome-devtools` (nằm ở `C:\Users\vu.hoang\.gemini\config\skills\chrome-devtools\node_modules\puppeteer`) hoặc tự cài đặt `puppeteer` nhanh vào thư mục dự án.

## 6. Auditor Review (Đánh giá của Kiểm toán viên)
- *Codex Review*: Mời Codex đánh giá kế hoạch kiểm thử tự động bằng Puppeteer. Kế hoạch này thuần túy kiểm thử, không can thiệp logic hay hạ tầng sản phẩm nên rủi ro thấp.
- *Gemini Verification*: Đảm bảo các ảnh chụp màn hình được tạo chính xác tại đường dẫn yêu cầu trước khi báo cáo hoàn thành.
