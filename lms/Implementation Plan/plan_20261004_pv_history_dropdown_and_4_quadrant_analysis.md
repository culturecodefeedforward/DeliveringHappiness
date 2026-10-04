# Kế Hoạch Triển Khai (Implementation Plan) — Lịch Sử Làm Bài Trắc Nghiệm Giá Trị Cá Nhân & Bảng Phân Tích Biến Động 4 Chiều

- **Ngày lập**: 04/10/2026
- **Trạng thái**: Chờ phê duyệt Cấp độ 2 (Awaiting Level 2 Approval)
- **Mục tiêu**: Bổ sung hộp danh sách thả xuống (`dropdown list`) chọn các lần làm bài trắc nghiệm giá trị cá nhân (1vs1) trên Micro-LMS, sửa lỗi khóa truy xuất dữ liệu `localStorage`, tích hợp thuật toán tự động đối chiếu và hiển thị Khối Phân Tích Biến Động 4 Chiều (kèm câu hỏi phản tư sư phạm chuẩn hóa của sếp Dzũ), hỗ trợ đồng bộ dữ liệu xuyên thiết bị (`cross-device sync`) từ Google Sheet CRM.

---

## 1. Nguồn Chuẩn (Source of Truth) & Yêu Cầu Nghiệp Vụ

1. **Lưu trữ nhiều lần làm bài trên Google Sheet (`PV_Data`)**:
   - `active_code_gs_final.js` sử dụng `sheet.appendRow(...)` để lưu kết quả mỗi lần làm bài của học viên. Dữ liệu các lần làm bài luôn được tích lũy theo thời gian (`timestamp`), không bị ghi đè.
2. **Khắc phục lỗi lệch pha khóa lưu trữ (`localStorage key mismatch`)**:
   - `personal-value.js` lưu: `'dhm_pv_' + email.toLowerCase()`.
   - `lms/app.js` (dòng 1640) hiện tại tìm: `"dhm_pv_" + encodeURIComponent(currentUser.email.toLowerCase().trim())`.
   - Với email chứa ký tự `@` (ví dụ: `vuhoang2708@gmail.com`), `encodeURIComponent` chuyển thành `%40`, dẫn đến việc LMS không tìm thấy bản ghi theo email và phải fallback sang bản `dhm_personal_values_latest`. Cần chuẩn hóa bỏ `encodeURIComponent` để đọc đúng khóa email.
3. **Cơ chế lưu trữ Offline-First & Mảng lịch sử (`Local History Array`)**:
   - Khi hoàn thành bài test trên `personal-value.js`, ngoài việc lưu bản mới nhất, hệ thống sẽ đẩy vào mảng lịch sử `dhm_pv_history_<email>` (xếp thứ tự thời gian mới nhất lên đầu).
4. **Bộ khung Phân tích Biến động 4 Chiều (Personal Values Transformation Matrix)**:
   - **Chiều 1 - Mỏ neo cốt lõi (`Core Anchors`)**: Giá trị liên tục nằm trong Top 3 qua các lần làm bài. Gợi ý phản tư: *"Điều gì khiến giá trị này luôn là kim chỉ nam vững chắc nhất trong mọi quyết định của bạn?"*
   - **Chiều 2 - Thăng hạng (`Ascending Values`)**: Giá trị nhảy vọt lên thứ hạng cao hơn trong Top 7 (hoặc từ ngoài lọt sâu vào Top 3). Gợi ý phản tư: *"Trải nghiệm hay bài học thực tế nào thời gian qua đã thôi thúc bạn coi trọng giá trị này nhiều hơn?"*
   - **Chiều 3 - Mới xuất hiện (`Emerging Values`)**: Giá trị lần đầu tiên bước vào Top 7. Gợi ý phản tư: *"Sự thay đổi nào trong công việc hoặc cuộc sống đã đánh thức sự quan tâm của bạn dành cho giá trị này?"*
   - **Chiều 4 - Buông bỏ / Rời khỏi ưu tiên (`Departed Values`)**: Từng có trong Top 7 lần trước nhưng lần này lùi bước/rời khỏi bảng ưu tiên. Gợi ý phản tư chuẩn hóa của sếp: **"Điều gì trong cuộc sống hoặc công việc thời gian qua đã giúp bạn nhận ra mình sẵn sàng buông bỏ điều này để tập trung cho những giá trị khác?"**
5. **Đồng bộ Xuyên Thiết Bị (`Cross-Device Sync`)**:
   - Backend Apps Script cung cấp endpoint `get_pv_history` đọc danh sách lịch sử nộp bài từ tab `PV_Data` theo email đã xác thực. LMS khi tải sẽ ưu tiên nạp từ `localStorage`, đồng thời gọi ngầm endpoint để lấy thêm các lần làm bài từ thiết bị khác (nếu có).

---

## 2. Danh Sách Tệp Trong Phạm Vi (Allowlist)

1. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\personal-value.js`: Bổ sung lưu mảng lịch sử `dhm_pv_history_<email>`.
2. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\index.html`: Thêm dropdown chọn lần làm bài và container khối phân tích 4 chiều vào `#pv-test-result-card`.
3. `C:\Users\vu.hoang\.gemini\antigravity\scratch\Teaching DH\dhm-micro-lms\app.js`: Xử lý logic tải lịch sử, render dropdown, tính toán ma trận 4 chiều và điền vào mẫu bài tập IAM.
4. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\index.html`: Tệp đồng bộ phát hành cho `dhm-micro-lms\index.html`.
5. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js`: Tệp đồng bộ phát hành cho `dhm-micro-lms\app.js`.
6. `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Scripts\active_code_gs_final.js`: Thêm hàm xử lý action `get_pv_history`.

---

## 3. Ranh Giới An Toàn (Boundary & Exclusions)

- **Không can thiệp ngoài phạm vi**: Không sửa đổi cấu trúc dữ liệu của các bài trắc nghiệm khác (TKI, Phong cách lãnh đạo, Bảng nhu cầu 6 Core Needs).
- **Không phá vỡ dữ liệu cũ**: Cột và dòng trong Google Sheet CRM `PV_Data` được giữ nguyên vẹn 100%, chỉ đọc dữ liệu phục vụ hiển thị lịch sử.
- **Tương thích ngược (Backward Compatibility)**: Nếu học viên mới chỉ làm bài 1 lần duy nhất, giao diện chỉ hiển thị dropdown chọn lần 1 và Top 7 như hiện tại, không gây lỗi logic khi chưa có đủ 2 lần làm bài để đối chiếu 4 chiều.

---

## 4. Chi Tiết Thiết Kế Giao Diện & Logic (Design & Logic Specification)

### A. Giao diện Dropdown và Khối 4 Chiều trong `#pv-test-result-card` (`index.html`)
- Bổ sung thanh công cụ chọn lần làm bài:
  ```html
  <div class="flex items-center gap-2 mt-2 pt-2 border-t border-brand-border/40">
      <span class="text-[11px] text-slate-300 font-semibold whitespace-nowrap">Chọn lần làm bài:</span>
      <select id="pv-history-select" class="bg-brand-dark/80 border border-brand-border rounded-lg px-2.5 py-1 text-xs text-brand-amber font-medium focus:outline-none focus:border-brand-amber cursor-pointer flex-1">
          <!-- Các option mốc thời gian làm bài nạp tự động qua JS -->
      </select>
  </div>
  ```
- Khối phân tích biến động 4 chiều (xuất hiện khi có $\ge 2$ lần làm bài):
  ```html
  <div id="pv-transformation-matrix" class="hidden mt-3 p-3 rounded-lg bg-black/40 border border-brand-amber/30 space-y-2.5">
      <div class="flex items-center justify-between">
          <div class="text-[11px] font-bold text-brand-amber flex items-center gap-1.5">
              <span>📊 BẢNG PHÂN TÍCH BIẾN ĐỘNG GIÁ TRỊ (SO VỚI LẦN TRƯỚC)</span>
          </div>
          <button type="button" id="btn-fill-matrix-to-iam" class="text-[10px] text-slate-300 hover:text-white underline">
              ✨ Điền gợi ý vào bài tập IAM bên dưới
          </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <!-- 1. Mỏ neo cốt lõi -->
          <div class="p-2 rounded bg-brand-surface/60 border border-emerald-500/30">
              <div class="font-bold text-emerald-400 flex items-center gap-1">🧭 1. Mỏ neo cốt lõi (Core Anchors)</div>
              <p id="pv-dim-anchors" class="text-slate-300 mt-1 text-[11px]"></p>
              <p class="text-[10px] text-slate-400 italic mt-0.5">"Điều gì khiến giá trị này luôn là kim chỉ nam vững chắc nhất trong mọi quyết định của bạn?"</p>
          </div>
          <!-- 2. Thăng hạng -->
          <div class="p-2 rounded bg-brand-surface/60 border border-amber-500/30">
              <div class="font-bold text-amber-400 flex items-center gap-1">🚀 2. Thăng hạng (Ascending)</div>
              <p id="pv-dim-ascending" class="text-slate-300 mt-1 text-[11px]"></p>
              <p class="text-[10px] text-slate-400 italic mt-0.5">"Trải nghiệm hay bài học thực tế nào thời gian qua đã thôi thúc bạn coi trọng giá trị này nhiều hơn?"</p>
          </div>
          <!-- 3. Mới xuất hiện -->
          <div class="p-2 rounded bg-brand-surface/60 border border-cyan-500/30">
              <div class="font-bold text-cyan-400 flex items-center gap-1">🌱 3. Mới xuất hiện (Emerging)</div>
              <p id="pv-dim-emerging" class="text-slate-300 mt-1 text-[11px]"></p>
              <p class="text-[10px] text-slate-400 italic mt-0.5">"Sự thay đổi nào trong công việc hoặc cuộc sống đã đánh thức sự quan tâm của bạn dành cho giá trị này?"</p>
          </div>
          <!-- 4. Buông bỏ / Rời khỏi ưu tiên -->
          <div class="p-2 rounded bg-brand-surface/60 border border-rose-500/30">
              <div class="font-bold text-rose-400 flex items-center gap-1">🍂 4. Buông bỏ / Lùi lại (Departed)</div>
              <p id="pv-dim-departed" class="text-slate-300 mt-1 text-[11px]"></p>
              <p class="text-[10px] text-slate-400 italic mt-0.5">"Điều gì trong cuộc sống hoặc công việc thời gian qua đã giúp bạn nhận ra mình sẵn sàng buông bỏ điều này để tập trung cho những giá trị khác?"</p>
          </div>
      </div>
  </div>
  ```

### B. Logic xử lý đối chiếu 4 chiều (`lms/app.js`)
- **Tập hợp Top 7 hiện tại ($T_1$) và Top 7 lần trước ($T_0$)**:
  - `Core Anchors`: Các giá trị vừa nằm trong Top 3 của $T_1$, vừa nằm trong Top 3 của $T_0$.
  - `Ascending`: Các giá trị có trong $T_1$ với thứ hạng cao hơn rõ rệt so với trong $T_0$ (ví dụ: từ hạng 6 lên hạng 2).
  - `Emerging`: Các giá trị có trong $T_1$ nhưng hoàn toàn không xuất hiện trong $T_0$.
  - `Departed`: Các giá trị từng nằm trong $T_0$ nhưng hoàn toàn vắng mặt trong $T_1$.

### C. Backend Google Apps Script (`active_code_gs_final.js`)
- Action `get_pv_history`:
  - Lấy parameter `email`.
  - Quét ngược tab `PV_Data` từ dưới lên để lấy các dòng khớp email.
  - Phân tích cột `Top 7 Values (Ranked)` để trả về mảng lịch sử gồm `{ timestamp, rankedDisplay, top7 }`.
  - Giới hạn tối đa 10 lần làm bài gần nhất để tối ưu hiệu năng.

---

## 5. Phương Án Triển Khai Từng Bước (Execution Steps)

1. **Bước 1 (Sao lưu an toàn)**:
   - Tạo bản sao lưu `.bak_20261004_pv_history` cho toàn bộ các tệp trong allowlist.
2. **Bước 2 (Chỉnh sửa Landing Page `personal-value.js`)**:
   - Thêm logic lưu mảng `dhm_pv_history_<email>` vào `localStorage`.
3. **Bước 3 (Chỉnh sửa Giao diện HTML LMS)**:
   - Cập nhật `#pv-test-result-card` trong cả `Teaching DH\dhm-micro-lms\index.html` và `dh4hn-website\lms\index.html`.
4. **Bước 4 (Chỉnh sửa Logic JS LMS)**:
   - Sửa khóa `localStorage` trong `Teaching DH\dhm-micro-lms\app.js` và `dh4hn-website\lms\app.js`.
   - Viết hàm `renderPVHistoryDropdown()`, `calculateTransformationMatrix()`, và sự kiện nút điền IAM.
5. **Bước 5 (Cập nhật Backend Apps Script File)**:
   - Cập nhật `dh4hn-website\Scripts\active_code_gs_final.js` với action `get_pv_history`.
6. **Bước 6 (Kiểm thử Cục bộ & Trình duyệt Browser UAT)**:
   - Mở giao diện kiểm tra: tạo dữ liệu giả lập 2 lần làm bài của `vuhoang2708@gmail.com`.
   - Xác minh dropdown hoạt động, nhãn Top 7 thay đổi tức thì, khối 4 chiều hiển thị đủ 4 nhóm giá trị và câu hỏi sư phạm chuẩn hóa của sếp Dzũ.
   - Bấm nút "Áp dụng Top 7 vào La Bàn" và nút "Điền gợi ý vào bài tập IAM" để kiểm chứng dữ liệu tự động điền chính xác.

---

## 6. Phương Án Quay Lui (Rollback Plan)

Nếu phát sinh lỗi hoặc giao diện không đạt yêu cầu:
1. Hoàn nguyên tức thì từ các file `.bak_20261004_pv_history`.
2. Dùng Git khôi phục trạng thái commit trước đó: `git checkout -- lms/ personal-value.js Scripts/active_code_gs_final.js`.
