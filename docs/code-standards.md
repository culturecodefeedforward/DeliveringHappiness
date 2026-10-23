# Tiêu Chuẩn Mã Nguồn & Quy Chuẩn Dự Án (Code Standards)

Tài liệu này quy định các chuẩn mực kỹ thuật, quy tắc an toàn dữ liệu, mã hóa UTF-8 và nguyên tắc viết mã cho dự án Delivering Happiness (DHM) và hệ thống Micro-LMS.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

### A. Chống Khóa Cứng & Ưu Tiên Kiến Trúc Nhẹ (Zero Dependency / Vanilla First)
- Hệ thống Frontend Micro-LMS được xây dựng hoàn toàn bằng **Vanilla JavaScript (ES6+)**, HTML5 và CSS3 nguyên bản.
- Tuyệt đối không cài đặt các framework nặng nề (như React, Angular, Vue phức tạp) khi yêu cầu nghiệp vụ chỉ là một trang học tập và khảo sát SPA nhẹ nhàng.
- Sử dụng **Tailwind CSS qua CDN** để tối ưu hóa thời gian tải trang, kết hợp với các biến CSS tùy biến (`CSS Custom Properties`) trong `styles.css`.

### B. An Toàn Bộ Mã UTF-8 & Ngôn Ngữ Tiếng Việt (UTF-8 Explicit & Vietnamese Safety)
- Mọi tệp mã nguồn (`.html`, `.js`, `.json`, `.css`, `.md`) bắt buộc phải được lưu ở định dạng **UTF-8 không BOM (UTF-8 without BOM)**.
- Mọi thao tác đọc/ghi tệp qua script (Python, Node.js, PowerShell) phải khai báo rõ ràng tham số `encoding="utf-8"`.
- Tuyệt đối không sử dụng các lệnh PowerShell mặc định không chỉ định mã hóa (`Out-File`, `Set-Content` mặc định) vì sẽ gây ra lỗi vỡ font tiếng Việt (mojibake).

### C. Quy Tắc Chống Bịa Đặt & Nguồn Chuẩn (Anti-Fabrication & Source of Truth Rule)
- **Cấm tuyệt đối việc tự ý thêm thắt hoặc bịa đặt danh tính nhân sự:** Giữ đúng 100% họ tên, vai trò và thông tin liên hệ được ghi nhận trong `master_learners_roster.json` và `authorized_roster.json`.
- **Cấm kịch tính hóa hoặc phóng tác bài giảng:** Mọi case study, câu chuyện thực tế của giảng viên hay nghiên cứu khoa học phải phản ánh trung thực 100% sự kiện nguyên bản, không tự ý chèn các tình tiết gay cấn vô căn cứ.
- Ghi rõ nguồn gốc học thuật (tên tác giả, năm công bố, trường đại học/tổ chức nghiên cứu) đối với các lý thuyết khoa học hạnh phúc.

---

## 2. Quy Chuẩn Đặt Tên & Cấu Trúc Mã Nguồn (Naming & Conventions)

### A. JavaScript & JSON
- **Biến và Hàm:** Đặt tên theo quy tắc `camelCase` (ví dụ: `learnerProgress`, `renderStage1Quiz`, `openInfographicModal`).
- **Hằng số toàn cục:** Đặt tên theo quy tắc `UPPER_SNAKE_CASE` (ví dụ: `REGISTRY_KEY`, `WEBHOOK_URL`, `CURRENT_COHORT`).
- **Thuộc tính JSON:** Đặt tên rõ nghĩa, nhất quán giữa frontend và backend (ví dụ: `correctIndex`, `timeLimit`, `selectedValues`).
- **Xử lý sự kiện (Event Handlers):** Luôn dùng `addEventListener` hoặc gắn hàm qua trigger tập trung (`attachMediaTriggers`), tránh viết mã JS lồng trực tiếp vào thẻ HTML (`onclick="..."` inline).

### B. CSS & Giao Diện Người Dùng (UI/UX)
- Tuân thủ bảng màu chuẩn của thương hiệu Delivering Happiness:
  - Nền tối chủ đạo (Dark Canvas): `#0B0F19` (Brand Dark), `#111827` (Brand Surface), `#1F2937` (Brand Card).
  - Màu điểm nhấn Hổ Phách & Cam (Amber & Orange Accent): `#D97706` (Amber), `#EA580C` (Orange).
  - Màu trạng thái: `#10B981` (Thành công / Emerald), `#EF4444` (Cảnh báo / Red).
### C. Bảo Mật Client-Side & Phòng Vệ Khóa Tiến Độ (Client-Side Security & State Patterns)
- **Chuẩn Băm Mật Khẩu Web Crypto API:**
  - Tuyệt đối không lưu mật khẩu dạng bản rõ (plaintext) trong `localStorage`.
  - Mọi thao tác lưu và đối chiếu mật khẩu tự đổi phải sử dụng chuẩn băm SHA-256 nguyên bản của trình duyệt:
    ```javascript
    async function hashPassword(password) {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    }
    ```
- **Quy Chuẩn Phòng Vệ Khóa Định Danh (Defensive Identity Fallback):**
  - Khi lưu trữ tiến độ hoặc truy xuất dữ liệu cá nhân theo người dùng, cấm giả định trường `identity` luôn tồn tại.
  - Bắt buộc phải triển khai cơ chế fallback đa tầng an toàn:
    ```javascript
    const idKey = currentUser.identity || currentUser.email || currentUser.learner_id || "guest";
    const progressKey = `dhm_lms_progress_${idKey}`;
    ```
  - Mọi hàm tra cứu danh tính (`findLearner()`) phải gán tường minh trường `identity` ngay từ đầu:
    ```javascript
    learner.identity = match.email || match.phone || match.learner_id;
    ```

### D. Quy Chuẩn Form Xác Thực Phân Nhánh & Chống Bẫy Bế Tắc HTML5 (Branching Auth & Anti-Deadlock Standard)
- **Cấm Gán Cứng Thuộc Tính `required` Cho Trường Phân Nhánh:**
  - Trong các biểu mẫu xác thực lai (Hybrid Auth: vừa phục vụ thành viên đã có mật khẩu, vừa phục vụ người mới kích hoạt qua email), tuyệt đối không gán cứng thuộc tính HTML5 `required` lên ô Mật khẩu. Trình duyệt sẽ chặn sự kiện `submit` trước khi JavaScript kịp phân nhánh cho người mới.
  - Chuyển toàn bộ logic kiểm tra mật khẩu vào hàm xử lý JavaScript trong sự kiện `submit`: chỉ yêu cầu mật khẩu khi đối tượng `findLearner(email)` tồn tại.
- **Lối Vào Trực Diện Cho Người Mới (Explicit Newcomer Affordance):**
  - Luôn bố trí nút chuyển đổi độc lập (như `#btn-toggle-newcomer-trial`) ngay trên bề mặt giao diện ban đầu; không bắt người mới phải submit lỗi hoặc mò mẫm mật khẩu thì hệ thống mới bung form đăng ký.
- **Ủy Quyền Phím Enter Trong Chế Độ Con (Sub-Form Enter Delegation):**
  - Khi form học thử hoặc form con đang mở, sự kiện `submit` của form cha phải ủy quyền trực tiếp sang nút hành động của form con (ví dụ: `btnRequestTrial.click()`), chống việc bấm Enter làm reset form.

---

## 3. Quy Trình Kiểm Thử An Toàn (Testing & Verification Gate)

1. **Local-First Verification:**
   - Trước khi thực hiện lệnh commit, luôn chạy kiểm tra cú pháp mã nguồn:
     ```bash
     node -c lms/app.js
     python -m json.tool lms/curriculum_data.json > nul
     ```
2. **CDN Cache & Parity Verification:**
   - Sau khi deploy lên Vercel Live, bắt buộc phải dùng script kiểm tra mã phản hồi HTTP `200 OK` trên chính Live URL của các tài nguyên tĩnh mới tải lên trước khi bàn giao cho người dùng.
   - Thêm thời gian chờ 30-45 giây để CDN Vercel xóa bộ nhớ cache phiên bản cũ.

3. **Cách Ly Dữ Liệu Thực Tế Khi Kiểm Thử:**
   - Cấm sử dụng số điện thoại thật, email thật của học viên cho các script test tự động gửi webhook hoặc email. Chỉ sử dụng dữ liệu kiểm thử giả lập (`mock data`) trỏ về email của người phụ trách kỹ thuật.

4. **Kiểm Thử Biên Thực Tế & Cấm Nhập Dữ Liệu Giả Che Giấu Lỗi (Realistic Form Boundary Testing):**
   - Khi nghiệm thu các form phân nhánh (học thử, người mới, kích hoạt), cấm tester/agent nhập mật khẩu giả ("dummy password") để lách qua thuộc tính `required` của form.
   - Bắt buộc phải kiểm thử đúng 100% hành vi người dùng thực tế: để trống hoàn toàn các trường chưa có thông tin và xác nhận hệ thống điều hướng trơn tru sang luồng kích hoạt.
   - Mọi bản sửa đổi luồng xác thực phải vượt qua bộ kiểm thử E2E tự động (như `verify_trial_flow.js` 15 test cases) trên cả môi trường local và staging trước khi commit.
