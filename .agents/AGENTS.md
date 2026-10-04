# Project-Specific Rules for Delivering Happiness Project
*Đường dẫn: C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\.agents\AGENTS.md*

Tài liệu này định nghĩa các quy tắc bổ sung dành riêng cho dự án Delivering Happiness, hoạt động cùng với các quy tắc dùng chung (Shared Rules).

---

## 1. Quy tắc bắt buộc Sao Chép Planning Mode Artifacts (Mandatory Planning Artifacts Mirroring Rule)

### A. Bối cảnh
Môi trường IDE Antigravity yêu cầu các tệp tin `implementation_plan.md`, `task.md`, và `walkthrough.md` phải được lưu trữ trong thư mục tạm `brain` (`<appDataDir>\brain\<conversation-id>`) để render giao diện đồ họa cho người dùng theo dõi và duyệt. Tuy nhiên, thư mục này nằm ngoài cấu trúc dự án và sẽ bị xóa/thay đổi khi session bị hết hạn hoặc reset.

### B. Quy tắc bắt buộc
1.  **Sao chép sau mỗi Phase**: Sau khi tạo hoặc chỉnh sửa bất kỳ tệp Planning Artifact nào (`implementation_plan.md`, `task.md`, `walkthrough.md`) trong thư mục `brain`, Agent **BẮT BUỘC** phải sao chép (mirror) nội dung của chúng về cấu trúc thư mục của dự án trước khi kết thúc lượt làm việc.
2.  **Đường dẫn và Định dạng đặt tên chuẩn**:
    *   **Kế hoạch triển khai (Implementation Plan)**:
        *   Nguồn: `<appDataDir>\brain\<conversation-id>\implementation_plan.md`
        *   Đích: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_<yyyymmdd>_<short-slug>_Plan.md`
    *   **Walkthrough (Báo cáo hoàn thành)**:
        *   Nguồn: `<appDataDir>\brain\<conversation-id>\walkthrough.md`
        *   Đích: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\UAT\gemini_<yyyymmdd>_<short-slug>_Walkthrough.md`
    *   **Danh sách công việc (Task list)**:
        *   Nguồn: `<appDataDir>\brain\<conversation-id>\task.md`
        *   Đích: `c:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Implementation Plan\gemini_<yyyymmdd>_<short-slug>_Task.md`
3.  **Tuyệt đối không để sót**: Không được bàn giao công việc hay báo cáo hoàn thành nếu các tệp tin planning của session hiện tại chưa được sao chép đầy đủ về dự án.

## 2. Quy tắc Chuẩn Hóa Format Email (Email Format Standardization Rule)

### A. Bối cảnh
Dự án sử dụng một mẫu thiết kế email cao cấp (Premium Format) có Header và Footer chuẩn của CultureCode. Mẫu chuẩn này (Source of Truth) được lưu trữ tại `Artifacts/standardized_emails/dhm8_reminder_email.html`.

### B. Quy tắc bắt buộc
1. **Thiết kế mặc định (Default Design)**: Khi tạo mới hoặc chỉnh sửa bất kỳ luồng gửi email tự động nào (Check-in, Pending, Paid, Canceled...), Agent **BẮT BUỘC** phải tái sử dụng chính xác cấu trúc HTML, CSS (phong cách `container`, `header`, `content`, `footer`, `event-box`...) từ mẫu chuẩn `dhm8_reminder_email.html`.
2. **Không tự chế Header/Footer (No Custom Signatures)**: Tuyệt đối không được thêm các chữ ký rác như "Trân trọng, Ban tổ chức" hay chèn thẻ `<img>` logo thủ công vào cuối nội dung `bodyHtml` của email, vì phần `renderEmailShell_` đã có sẵn Footer cực kỳ chỉnh chu với logo và chữ ký chuẩn của CultureCode Team.
3. **Danh xưng (Pronouns)**: Ưu tiên dùng đại từ "Anh/Chị" và tên người nhận, tạo cảm giác lịch sự và chuyên nghiệp.

## 3. Cổng Nhất quán Phê duyệt và Cấm Xin duyệt Lặp

### A. Phân biệt hai loại phê duyệt
1. **Phán quyết rà soát** (`review verdict` - kết luận một plan/report có đạt hay
   không): các câu như “có duyệt được không?”, “approve chưa?” hoặc “cho ý kiến
   approve” mặc định yêu cầu Agent đưa ra kết luận `PHÊ DUYỆT`, `YÊU CẦU SỬA`
   hoặc `BỊ CHẶN`.
2. **Ủy quyền thao tác thật** (`operational authorization` - cho phép thực hiện
   hành động có tác động): commit, push, deploy, promote, xóa, ghi dữ liệu hoặc
   kích hoạt workflow vẫn tuân theo approval boundary riêng.
3. Không được trộn hai loại trên để biến một câu hỏi xin phán quyết thành chuỗi
   yêu cầu User xác nhận lại nhiều lần.

### B. Quy tắc cấm mâu thuẫn và vòng lặp
1. Khi phần trả lời chính đã kết luận `PHÊ DUYỆT`, mọi prompt/handoff trong cùng
   phản hồi phải truyền đúng phán quyết đó. Cấm viết tiếp “vẫn chờ duyệt plan”,
   “chỉ bắt đầu sau khi duyệt lại”, hoặc nội dung khác làm mất hiệu lực chính
   phán quyết vừa đưa ra.
2. Nếu User chỉ hỏi phán quyết rà soát, Agent chỉ trả phán quyết và phạm vi của
   phán quyết. Không tự sinh thêm yêu cầu phê duyệt thao tác thật nếu User chưa
   hỏi thực thi.
3. Nếu User đã trực tiếp phê duyệt đúng một phạm vi trong session hiện tại,
   Agent không được xin lại chính phạm vi đó. Chỉ được hỏi thêm khi xuất hiện
   một hành động khác có approval boundary riêng.
4. Approval của Agent reviewer không thay thế ủy quyền thao tác thật cho Agent
   executor ở session khác; tuy nhiên reviewer không được dùng giới hạn này để
   đảo ngược verdict hoặc buộc User xác nhận lặp ngay trong câu trả lời verdict.
   Executor chỉ được hỏi đúng một lần khi thực sự chuẩn bị thực hiện hành động
   cần duyệt.

### C. Approval Quote Completeness (Đầy đủ câu quote phê duyệt)

Khi xin User một câu quote để duyệt thao tác, toàn bộ câu quote phải nằm trong
một khối mã `text` có thể Copy một lần. Với Cấp độ 3, dòng đầu phải mang ý
nghĩa `XÁC NHẬN CẤP ĐỘ 3:`; cùng khối đó phải có exact command, target, scope và
rollback. Cấm tách phần “xác nhận...” ra ngoài rồi để code block chỉ còn command.
Trước khi gửi, Agent phải kiểm tra paste-only: khối mã đứng một mình vẫn đủ
ngữ cảnh để User biết mình đang duyệt gì và quay lui thế nào. Quote chỉ là yêu
cầu duyệt, không phải approval trực tiếp.

## 4. Quy tắc Khóa Production & Staged Deployment Governance

1. **Cấm Deploy Trực tiếp Production (Production Lock):** Tuyệt đối cấm Agent tự ý chạy lệnh `vercel --prod` không kèm cờ `--skip-domain` trên local hoặc trong session để đẩy thẳng mã nguồn lên Production URL công khai.
2. **Quy trình Staged Deployment bắt buộc:** Mọi đợt phát hành Production đều phải qua lệnh `vercel --prod --skip-domain` từ gói `release_package` sạch, lấy `deployment-id`, thực hiện UAT 3 Lớp trên Staged URL, và lưu bằng chứng bất biến tại `UAT/releases/<release-id>/final-verdict.json`.
3. **Claim Gate:** Agent tuyệt đối KHÔNG được tuyên bố `Live verified` hoặc `Production Ready` nếu chưa pass cả 3 Lớp UAT và được Sếp Dzũ phê duyệt riêng cho thao tác `vercel promote <deployment-id>`.

## 5. 3 Nguyên tắc Kiến trúc Cấu hình Động & Binding Nguồn chuẩn (Dynamic Configuration & Contract Binding Principles)

1. **Kiểm toán Nguồn chuẩn Cấu hình Tự động (Automated Configuration Source of Truth Audit Gate)**:
   - Mọi dữ liệu vận hành (số tài khoản ngân hàng, chủ tài khoản, ngân hàng thụ hưởng, thời gian, địa điểm sự kiện, link bản đồ, logo, hạn mức) **TUYỆT ĐỐI KHÔNG ĐƯỢC HARDCODE CHUỖI TĨNH** trong các quy tắc hay mẫu HTML nháp.
   - Mọi script sinh email hoặc template generator BẮT BUỘC phải parse/load trực tiếp từ hàm cấu hình duy nhất `getPaymentConfig_(laneKey)` trong Backend (`Scripts/active_code_gs_final.js` hoặc file config JSON/ENV duy nhất của dự án).
   - Khi cấu hình ngân hàng thay đổi trong file mã nguồn chính, toàn bộ luồng tự động (Email, Mã QR SePay, Form đăng ký) phải tự động nhận cấu hình mới mà không cần sửa đổi bất kỳ quy tắc hay mã HTML tĩnh nào.

2. **Kiểm định Hợp đồng Nội dung Email Động (Comprehensive Dynamic Email Content Contract Gate)**:
   - Mỗi loại email tương tác với người dùng đều có một **Hợp đồng Nội dung (`Content Contract`)** bắt buộc gồm 4 khối thành phần được bind động:
     * **Khối Header & Footer Logo**: 100% link ảnh trả về `HTTP 200 OK` (verify tự động qua HTTP HEAD/GET từ URL cấu hình).
     * **Khối Thông tin Sự kiện (`Event Box`)**: Tên chương trình, Thời gian chính xác, Địa điểm chi tiết & Link Google Maps chỉ đường.
     * **Khối Thông tin Thanh toán (`Payment Box`)**: Ngân hàng, Số tài khoản, Chủ tài khoản đọc động từ Source of Truth (`getPaymentConfig_`), Chi phí hậu cần & Nội dung chuyển khoản SePay.
     * **Khối Mã QR Thanh toán (`QR Code Box`)**: Ảnh QR VietQR/SePay sinh tự động từ tài khoản hiện hành trong cấu hình & mã thanh toán.
   - Trước khi gửi bất kỳ email thử nghiệm (test/preview) hay bắn hàng loạt nào qua MCP Gmail / Apps Script, Agent BẮT BUỘC phải thực thi script:
     `python scripts/validate_email_template.py <đường_dẫn_file_html>`
   - Script tự động load cấu hình Runtime hiện tại và chỉ cho phép phát hành khi trả về log `=== VALIDATION PASSED PROPERLY ===`.

3. **Phòng thủ Chiều sâu & Lưu vết Kiểm toán Phát hành (Defense-in-Depth & Dispatch Audit Trail)**:
   - Mọi thao tác gửi email thử nghiệm đều phải tạo bản ghi kiểm toán (`Audit Record`) lưu tại `Artifacts/email_dispatches/<timestamp>/` kèm theo kết quả kiểm định validation, log HTTP status của tài nguyên và danh sách người nhận trước khi chuyển từ giai đoạn Test sang Batch Production.

## 6. Quy tắc Cấm Dùng Dữ liệu Giả lập cho Báo cáo Vận hành Live (No Mock Data for Live Operational Reports Rule)

1. **Bắt buộc dùng Dữ liệu Thực tế (Mandatory Live Data Verification)**:
   - Khi được yêu cầu xuất báo cáo, gửi email đối soát, hoặc thông báo tình hình vận hành cho Ban Tổ chức (`BTC`), Học viên, hoặc Đối tác, Agent **BẮT BUỘC** phải gọi API live (`checkRegistrationAvailability`, `getRegistrationStatus`) hoặc đọc trực tiếp từ Google Spreadsheet thực tế.
2. **Cấm dùng Dữ liệu Test/Mock (Strict Prohibition of Sample Data in Reports)**:
   - Tuyệt đối KHÔNG ĐƯỢC dùng kết quả đầu ra của các script chạy thử (`dry-run`), dữ liệu mẫu (`mock data`), hoặc dữ liệu test local để lập báo cáo gửi cho người dùng thật.
3. **Quy trình Kiểm chứng 2 Lớp (Dual Verification Gate)**:
   - Trước khi gọi lệnh gửi mail báo cáo qua MCP Gmail / Apps Script, Agent phải in ra console và kiểm chứng các chỉ số cốt lõi (`paidCount`, `availableSlots`, `dataRowCount`) đối chiếu 100% khớp với Backend Live.
4. **Cổng Kiểm chứng Bề mặt Phát hành Email Thật (Live Email Dispatch Verification Hard Gate)**:
   - **Hard Gate Message ID thật:** Agent tuyệt đối KHÔNG được báo cáo một email hoặc chiến dịch gửi email là `Live done` hay `SUCCESS` nếu chưa có mã Google Message ID hợp lệ (chuỗi hex định dạng `^1a[0-9a-f]{14,}$`) trả về trực tiếp từ máy chủ Gmail. Báo cáo hoàn tất gửi email bắt buộc phải đính kèm bảng tra cứu Message ID thật của từng người nhận.
   - **Quy trình Kiểm thử Gửi 1 Bước (Pre-Flight Test Email):** Trước khi bấm nút gửi email hàng loạt cho học viên hoặc khách hàng, Agent bắt buộc phải thực hiện 1 lần gửi thử nghiệm (Test Email) tới hòm thư của người phụ trách/BTC, chờ phản hồi xác nhận đã thấy email xuất hiện trong hộp thư đến (Inbox) thực tế rồi mới được kích hoạt luồng gửi hàng loạt.

### C. Kiểm tra bắt buộc trước khi gửi
Agent phải so sánh phần trả lời chính với prompt/handoff cuối câu:
- Verdict, scope và trạng thái chờ phải nhất quán.
- Nếu phần chính nói `PHÊ DUYỆT`, prompt phải nói rõ `ĐÃ PHÊ DUYỆT`.
- Nếu chưa có ủy quyền cho commit/push/deploy, chỉ ghi “không nằm trong phạm vi
  phê duyệt này”; không được diễn đạt thành “plan chưa được duyệt”.

Nếu vi phạm, Agent phải nhận lỗi và sửa ngay trong lượt kế tiếp, không mở thêm
vòng review, không thêm điều kiện mới và không biện minh bằng mẫu an toàn chung.

---

## 7. Quy tắc Cung cấp Đường dẫn Tuyệt đối & Clickable Link (Mandatory Dual Path Format)

1. **Bắt buộc cung cấp đồng thời 2 định dạng**: Trong mọi phản hồi nhắc tới tệp tin, thư mục, mã nguồn, tài liệu, plan, UAT hay artifact, Agent **BẮT BUỘC** phải cung cấp đủ:
   - **Đường dẫn tuyệt đối chuẩn hệ điều hành (Windows Absolute Path)** để sếp dễ dàng copy/paste (Ví dụ: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\standardized_emails\dhm9_pending_email.html`).
   - **Liên kết nhấp chuột (Clickable Markdown Link)** chuẩn `file:///` để nhấp trực tiếp trong IDE (Ví dụ: [dhm9_pending_email.html](file:///C:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Artifacts/standardized_emails/dhm9_pending_email.html)).
2. **Cấm chỉ dùng đường dẫn tương đối**: Tuyệt đối KHÔNG xuất ra mỗi đường dẫn tương đối (như `Artifacts/standardized_emails/...`) mà không kèm đường dẫn tuyệt đối chuẩn Windows và link `file:///`.

---

## 8. Quy tắc Nhận diện Thương hiệu & Định tuyến Giao tiếp (Brand Identity & Communication Routing Rule)

### A. Định tuyến Tài khoản Gửi Email (Mandatory Sender Routing)
1. **Email Chiến dịch / Chăm sóc Khách hàng:** Mọi email tự động (nhắc thanh toán, đính chính, vé điện tử, thông báo chương trình) gửi tới Học viên / Khách hàng qua công cụ Workspace MCP **BẮT BUỘC** phải được cấu hình gửi từ địa chỉ chính thức: `culturecodeproject@gmail.com`. TUYỆT ĐỐI CẤM dùng `vuhoang2708@gmail.com` hoặc tài khoản cá nhân khác để gửi campaign.
2. **Email Báo cáo Nội bộ:** Các email báo cáo kết quả vận hành (Report, Log, Alert) gửi cho Ban tổ chức (BTC) thì mới được gửi tới danh sách nhận nội bộ (`vuhoang2708@gmail.com`, `chauhm71@gmail.com`, `hoanhn.edu.vn@gmail.com`).

### B. Ngôn ngữ Thương hiệu (Universal Brand Voice)
1. **Cấm dùng "Ban tổ chức":** Trong tất cả các văn bản tương tác với người dùng cuối (Nội dung Email, Giao diện Web, Chatbox Socratic, Hướng dẫn), Agent **TUYỆT ĐỐI KHÔNG ĐƯỢC** dùng các từ ngữ "Ban Tổ chức", "Ban tổ chức", hay "BTC".
2. **Bắt buộc dùng "CultureCode Team":** Thay thế toàn bộ các danh xưng trên bằng từ khóa chuẩn **"CultureCode Team"**.
