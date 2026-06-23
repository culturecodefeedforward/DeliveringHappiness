# DHM8 Direct Registration & Quiz Navigation Integration — Implementation Plan
_File location: `Implementation Plan/gemini_20260623_DirectRegisterAndQuizNav.md`_
_Created: 2026-06-23 | Executor: Gemini | Auditor Review: Codex_

---

## 1. Đề bài & Hiện trạng (Problem & Current State)

### 1.1. Yêu cầu 1: Đăng ký trực tiếp (Direct Registration Link)
- **Đề bài**: Tạo một liên kết đăng ký mới `register_direct.html` (clone từ file đăng ký `register.html` hiện tại) và đưa lên Vercel. 
- **Sự khác biệt**: Quay lại cách thể hiện cũ của hai trường "Tên người giới thiệu (nếu có)" và "Số điện thoại người giới thiệu (nếu có)". Điểm mấu chốt là **loại bỏ hoàn toàn** nhóm radio chọn đối tác (GEM Global, Smart Train, Nguồn khác).
- **Hiện trạng (Pain point)**: Hiện tại, form `register.html` bắt buộc hoặc mặc định người dùng tương tác qua một nhóm radio (`referrerSource`) và ẩn/hiện collapsible section chi tiết. Đối với một số chiến dịch đăng ký trực tiếp (direct campaign), việc bắt buộc này không cần thiết, cần tối giản hóa để tăng tỷ lệ chuyển đổi (conversion rate).

### 1.2. Yêu cầu 2: Nút điều hướng nhanh trong lúc làm Quiz (Quiz Navigation Buttons)
- **Đề bài**: Trong suốt quá trình đang thực hiện khảo sát/trắc nghiệm (quiz), hiển thị thêm 2 nút: **"Đăng ký Ngay"** và **"Xem thông tin chương trình"**.
- **Hiện trạng (Pain point)**: Giao diện trắc nghiệm hiện tại (`assessment.html`) chỉ hiển thị hai nút này ở màn hình tóm tắt kết quả cuối cùng (`quizSummary`). Nếu người dùng mất kiên nhẫn hoặc muốn đăng ký ngay lập tức mà không muốn hoàn thành hết 10 câu hỏi, họ không có lối thoát (exit path) trực quan để đi tới trang thông tin hay trang đăng ký.

---

## 2. Giải pháp kỹ thuật (Technical Solution)

### 2.1. Đăng ký trực tiếp (`register_direct.html` & `register_direct.js`)
- **Tạo mới `register_direct.html`**: Clone trực tiếp từ `register.html` hiện tại.
  - Loại bỏ phần Radio group của `referrerSource`.
  - Giữ lại và hiển thị trực tiếp hai trường nhập: `Tên người giới thiệu (nếu có)` và `Số điện thoại người giới thiệu (nếu có)`.
  - Thay đổi thẻ script liên kết từ `register.js` sang `register_direct.js` để tránh làm ảnh hưởng hoặc làm hỏng logic của form đăng ký chính (`register.html`).
- **Tạo mới `register_direct.js`**: Clone trực tiếp từ `register.js` hiện tại.
  - Loại bỏ hoàn toàn logic ẩn/hiện, mở rộng/thu gọn và các sự kiện change listener gắn vào radio buttons (`refGem`, `refSmart`, `refOther`).
  - Đảm bảo trong hàm submit form, dữ liệu `referrerName` và `referrerPhone` được lấy trực tiếp, cắt khoảng trắng (`trim()`), và gán thẳng vào payload gửi đi. Không có logic ghi đè hay xóa thuộc tính này.
  - Đặt `data.source = 'Web_DHM8_Direct';` để phân biệt nguồn đăng ký trên Google Sheets.

### 2.2. Tích hợp nút điều hướng Quiz (`assessment.html`, `quiz.css`, `quiz.js`)
- **Cấu trúc HTML (`assessment.html`)**:
  - Nhúng thêm một khối container `#quizNavActions` chứa 2 liên kết (nút) điều hướng nằm ngay dưới phần nội dung câu hỏi động `#quizContent` nhưng bên trong `.quiz-container`.
- **Logic hoạt động (`quiz.js`)**:
  - Khi đang làm quiz (từ câu 1 đến câu 10), container `#quizNavActions` này luôn luôn hiển thị.
  - Khi người dùng hoàn thành câu hỏi cuối cùng và chuyển sang màn hình tóm tắt (`showSummary()`), logic JavaScript sẽ tự động ẩn khối `#quizNavActions` đi (`style.display = 'none'`) để tránh xung đột hoặc hiển thị trùng lặp với các nút sẵn có ở màn hình Summary.
  - Tích hợp thêm tracking sự kiện click cho 2 nút mới này thông qua `logToSheet` với hành động `CTA_CLICK_DURING_QUIZ`.
- **Căn chỉnh Style (`quiz.css`)**:
  - CSS bổ sung cho `.quiz-nav-actions` sử dụng mô hình hộp linh hoạt `flexbox` (flex-direction: column trên mobile, chuyển thành row trên màn hình rộng `>= 480px`) để tối ưu hóa hiển thị.
  - Nút "Đăng ký ngay" (`.btn-nav-register`) có background vàng `var(--warm-yellow)`, chữ đen nổi bật.
  - Nút "Xem thông tin chương trình" (`.btn-nav-info`) có background mờ `rgba(255, 255, 255, 0.05)`, viền trắng mỏng để tạo độ tương phản nhẹ nhàng, không lấn át nút chính.
  - Có đường kẻ phân tách phía trên (`border-top`) để phân biệt trực quan với khu vực nội dung câu hỏi.

---

## 3. Các tệp bị ảnh hưởng (Affected Files)

- **[NEW]** `register_direct.html` (Trang đăng ký trực tiếp mới)
- **[NEW]** `register_direct.js` (Logic xử lý cho trang đăng ký trực tiếp mới)
- **[MODIFY]** `assessment.html` (Thêm khối HTML cho 2 nút điều hướng khi đang làm quiz)
- **[MODIFY]** `quiz.js` (Ẩn khối điều hướng khi vào màn hình tóm tắt, bổ sung tracking click)
- **[MODIFY]** `quiz.css` (Bổ sung style cho 2 nút điều hướng động trong quiz)
- **[NEW]** `UAT/gemini_20260623_DirectRegisterAndQuizNavUAT.md` (Báo cáo UAT & bằng chứng nghiệm thu)

---

## 4. Chi tiết mã nguồn thay đổi (Code Diff Spec)

### 4.1. `register_direct.html` (Thay đổi so với `register.html`)
Thay thế khối chọn Radio và Collapsible section hiện tại:
```html
<!-- CŨ (Trong register.html) -->
<!-- Nguồn giới thiệu / Đối tác (Radio group) -->
<div class="input-group full-width"> ... </div>
<div id="referrerDetailsSection" class="collapsible-section visible"> ... </div>

<!-- MỚI (Trong register_direct.html) -->
<!-- 12. Tên người giới thiệu -->
<div class="input-group">
    <label id="referrerNameLabel">Tên người giới thiệu (nếu có)</label>
    <input type="text" id="referrerName" name="referrerName" placeholder="Nhập tên người giới thiệu...">
</div>

<!-- 13. Số điện thoại người giới thiệu -->
<div class="input-group">
    <label>Số điện thoại người giới thiệu (nếu có)</label>
    <input type="text" id="referrerPhone" name="referrerPhone" placeholder="Nhập số điện thoại...">
</div>
```
Và đổi đường dẫn script ở cuối trang:
```html
<script src="register_direct.js"></script>
```

### 4.2. `register_direct.js` (Thay đổi so với `register.js`)
Loại bỏ logic chuẩn hóa Radio:
```javascript
// CŨ (Trong register.js)
const refSourceVal = data.referrerSource || 'Nguồn khác';
if (refSourceVal === 'GEM Global' || refSourceVal === 'Smart Train') {
    data.referrerName = refSourceVal;
    data.referrerPhone = '';
} else {
    data.referrerName = (data.referrerName || '').trim();
    data.referrerPhone = (data.referrerPhone || '').trim();
}
delete data.referrerSource;

// MỚI (Trong register_direct.js)
data.referrerName = (data.referrerName || '').trim();
data.referrerPhone = (data.referrerPhone || '').trim();
data.source = 'Web_DHM8_Direct'; // Đặt nguồn direct
```
Loại bỏ toàn bộ phần logic collapsible ở cuối file (dòng 786 - 816).

### 4.3. `assessment.html` (Thêm HTML)
Chèn vào ngay dưới thẻ đóng `</div>` của `#quizContent` (khoảng dòng 53-54):
```html
            <div id="quizContent">
                <!-- Questions will be injected here -->
            </div>

            <!-- Nút điều hướng nhanh trong suốt quá trình quiz -->
            <div class="quiz-nav-actions" id="quizNavActions">
                <a href="dh8/index.html" class="btn-nav btn-nav-info" id="quizNavInfo">Xem thông tin chương trình</a>
                <a href="register_direct.html" class="btn-nav btn-nav-register" id="quizNavRegister">Đăng ký ngay</a>
            </div>
```
_Lưu ý: Nút Đăng ký ngay trong lúc làm quiz sẽ trỏ trực tiếp đến `register_direct.html` mới tạo để tối đa sự thuận tiện._

### 4.4. `quiz.css` (Bổ sung style ở cuối tệp)
```css
/* Nút điều hướng nhanh trong suốt quá trình làm quiz */
.quiz-nav-actions {
    display: flex;
    gap: 12px;
    flex-direction: column;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-nav-actions .btn-nav {
    display: block;
    text-align: center;
    padding: 10px 20px;
    border-radius: 12px;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.quiz-nav-actions .btn-nav:hover {
    transform: translateY(-2px);
}

.quiz-nav-actions .btn-nav-info {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-nav-actions .btn-nav-info:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
}

.quiz-nav-actions .btn-nav-register {
    background: var(--warm-yellow);
    color: #000;
    font-weight: 700;
}

.quiz-nav-actions .btn-nav-register:hover {
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

@media (min-width: 480px) {
    .quiz-nav-actions {
        flex-direction: row;
    }
    .quiz-nav-actions .btn-nav {
        flex: 1;
    }
}
```

### 4.5. `quiz.js` (Bổ sung logic ẩn & tracking)
1. Thêm ẩn `#quizNavActions` trong hàm `showSummary()`:
```javascript
function showSummary() {
    document.getElementById('quizProgressBar').style.width = '100%';
    const container = document.getElementById('quizContent');
    const summary = document.getElementById('quizSummary');
    
    // Ẩn các nút điều hướng nhanh của quiz để tránh trùng lặp nút ở màn hình kết quả
    const navActions = document.getElementById('quizNavActions');
    if (navActions) navActions.style.display = 'none';

    if (container) container.style.display = 'none';
    if (summary) summary.style.display = 'block';
    ...
```
2. Thêm tracking click cho các nút điều hướng nhanh ở cuối phần khởi chạy:
```javascript
    // Track buttons at navigation of quiz
    const navActions = document.getElementById('quizNavActions');
    if (navActions) {
        navActions.querySelectorAll('.btn-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                logToSheet('CTA_CLICK_DURING_QUIZ', btn.innerText.trim());
            });
        });
    }
```

---

## 5. Kế hoạch kiểm chứng & Nghiệm thu (Verification & UAT Plan)

### 5.1. Kiểm thử Local (Local Verification)
1. Chạy server phát triển cục bộ (`Local dev server`).
2. Mở trình duyệt truy cập:
   - `http://localhost:5000/register_direct.html`:
     - Xác minh giao diện chỉ hiển thị 2 trường nhập trực tiếp (Tên, SĐT). Không còn radio button của GEM/Smart Train.
     - Thực hiện submit đăng ký thử nghiệm để kiểm tra tính năng gửi dữ liệu (POST payload) xem cấu trúc dữ liệu gửi đi có chứa chính xác `referrerName` và `referrerPhone` hay không.
   - `http://localhost:5000/assessment.html`:
     - Xác minh 2 nút "Xem thông tin chương trình" và "Đăng ký ngay" xuất hiện ở cuối container câu hỏi trong suốt 10 câu hỏi.
     - Click thử các nút này và kiểm tra xem có chuyển hướng đúng về `dh8/index.html` và `register_direct.html` hay không.
     - Trả lời hết 10 câu hỏi để đảm bảo khi vào màn hình Summary, 2 nút này biến mất hoàn toàn, nhường chỗ cho 2 nút Summary gốc.

### 5.2. Nghiệm thu Live (Live Production Verification)
- Sau khi được người dùng chấp thuận kế hoạch và tiến hành triển khai, code sẽ được đẩy lên Vercel.
- Do đây là thay đổi về mặt giao diện (UI) quy mô vừa (thay đổi cấu trúc file đăng ký mới và thêm nút bấm trên trang quiz), theo **Rule 6.3: End-to-End Ownership**, chúng tôi sẽ kích hoạt `Browser Tool` (Công cụ trình duyệt) để chụp ảnh thực tế kiểm tra hiển thị trên môi trường live:
  - Chụp ảnh trang đăng ký trực tiếp live `https://delivering-happiness.vercel.app/register_direct.html` (hoặc domain tương đương).
  - Chụp ảnh trang trắc nghiệm live `https://delivering-happiness.vercel.app/assessment.html` để chứng minh các nút hiển thị đúng đắn.
- Báo cáo kết quả chi tiết trong tệp `UAT/gemini_20260623_DirectRegisterAndQuizNavUAT.md`.

---

## 6. Rủi ro & Kế hoạch quay lui (Risks & Rollback Plan)

- **Rủi ro 1: Lệch cột Google Sheets do sửa đổi cấu trúc payload**
  - *Giải pháp*: Trang `register_direct.html` và `register_direct.js` giữ nguyên tên các trường `referrerName` và `referrerPhone` như form gốc, chỉ loại bỏ trường tạm `referrerSource` trước khi gửi. Điều này đảm bảo hoàn toàn tương thích ngược (backward compatible) với script xử lý của Apps Script hiện tại trên Google Sheets.
- **Rủi ro 2: Layout bị chen chúc hoặc mất nút "Tiếp theo" trên mobile**
  - *Giải pháp*: Định dạng `.quiz-nav-actions` có padding và margin hợp lý, font chữ nút vừa phải (0.95rem). Chúng ta sẽ thực hiện smoke test trên viewport mobile để đảm bảo nút "Tiếp theo" và 2 nút này không đè lên nhau.
- **Kế hoạch quay lui (Rollback plan)**:
  - Nếu gặp sự cố, chỉ cần xóa tệp `register_direct.html` và `register_direct.js` trên môi trường live, hoàn tác thay đổi trên `assessment.html`, `quiz.js` và `quiz.css` bằng lệnh `git checkout`.

---

## 7. Auditor Review (Codex Review)
_Phần này dành riêng cho Codex rà soát, đánh giá các điểm rủi ro tiềm ẩn (bảo mật, nghiệp vụ, tính toàn vẹn)._
- **Đánh giá**: Chờ ý kiến phản biện từ Codex.
