# Implementation Plan: Trang Đăng Ký NVC - Giao Tiếp Kết Nối

**Ngày:** 2026-06-09  
**Task:** Clone form `register.html` → `register_nvc.html` cho chương trình NVC  
**Trạng thái:** ⏳ Chờ duyệt (Pending Approval)

---

## 1. Đề bài

Tạo trang đăng ký mới riêng cho chương trình **NVC** (Nonviolent Communication - Giao tiếp phi bạo lực), clone từ form `register.html` hiện tại. Form mới cần:

- Giữ các trường cơ bản: Họ tên, Email, SĐT, Người giới thiệu (nếu có)
- **Thêm trường mới:** Vai trò trong doanh nghiệp (HR / Manager / Chủ doanh nghiệp...)
- **Thêm 3 câu hỏi khảo sát chuyên biệt:**
  1. Tình huống giao tiếp khó nhất (free text / paragraph)
  2. Mối quan hệ mong GTKN giúp ích (checkbox, chọn tối đa 2)
  3. Kỳ vọng sau buổi 90' (checkbox, chọn tối đa 2)
- **Tiêu đề:** "Giao tiếp kết nối: Từ trái tim đến trái tim" / Subtitle sáng tạo
- **Color theme:** Khác biệt so với DH (warm-yellow) và CC101 (emerald) → dùng tông **Rose / Warm-Pink** để phù hợp chủ đề "trái tim, kết nối"

## 2. Hiện trạng (Pain Point / Issue)

| Hạng mục | Hiện trạng |
|---|---|
| `register.html` | Form đăng ký DH Masterclass - tông vàng, có checkbox NVC + AI |
| `register_cc101.html` | Form CC101 - tông emerald, có trường Công ty, inline JS |
| `register.js` | JS riêng cho `register.html`, hardcode `courseNvc` / `courseAi` |
| `tracking.js` | Hệ thống tracking chung, hỗ trợ `CUSTOM_WEBAPP_URL` |
| **Lỗi nhỏ:** | `register.html` dòng 105 có typo `input:focutaos` → không ảnh hưởng form mới |

## 3. Giải pháp kỹ thuật

### 3.1 File mới: `register_nvc.html`
- Clone cấu trúc từ `register_cc101.html` (pattern tốt hơn: inline JS, có `CUSTOM_WEBAPP_URL`)
- **Color theme:** Rose/Warm-Pink (`#e11d48` hoặc `#f43f5e`) - gradient background xanh tím hồng
- **Tiêu đề H1:** "Giao Tiếp Kết Nối" 
- **Subtitle:** "Từ trái tim đến trái tim — Một trải nghiệm ngắn để chạm vào cảm giác kết nối"

### 3.2 Cấu trúc form (theo thứ tự)

| # | Trường | Loại | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| 1 | Họ và tên | `text` | ✅ | |
| 2 | Số điện thoại (Zalo) | `tel` | ✅ | |
| 3 | Email liên hệ | `email` | ✅ | |
| 4 | Vai trò trong doanh nghiệp | `select` | ✅ | HR / Manager / Chủ doanh nghiệp / Nhân viên / Freelancer / Khác |
| 5 | Tên công ty / Tổ chức | `text` | ❌ | |
| 6 | Người giới thiệu (nếu có) | `text` | ❌ | |
| 7 | **Câu hỏi 1:** Tình huống giao tiếp khó nhất | `textarea` | ✅ | Có placeholder ví dụ chi tiết |
| 8 | **Câu hỏi 2:** Mối quan hệ mong GTKN giúp ích | `checkbox` (max 2) | ✅ | 7 lựa chọn + "Khác" có text input |
| 9 | **Câu hỏi 3:** Kỳ vọng sau buổi 90' | `checkbox` (max 2) | ✅ | 7 lựa chọn + "Khác" có text input |

### 3.3 Logic JavaScript (inline)
- Validate max 2 checkbox cho câu 2 & câu 3 (disable các checkbox còn lại khi đã chọn 2)
- Thu thập dữ liệu: serialize checkbox thành chuỗi, xử lý "Khác" input
- Gửi qua `window.logToSheet()` với `type: 'NVC_LEAD'`, `source: 'NVC_Register'`
- Hidden field: `event_id = "NVC_GTKN_0926"`

### 3.4 UI/UX đặc biệt
- Chia form thành **sections rõ ràng** với divider (separator) giữa phần thông tin cá nhân và phần khảo sát
- Section headers với icon emoji cho thân thiện
- Textarea có `rows="4"` cho câu hỏi mở
- Checkbox group có styling đẹp, hiển thị rõ trạng thái "đã chọn đủ 2"
- Success message phù hợp ngữ cảnh NVC

## 4. Các file bị ảnh hưởng

| File | Hành động | Mức độ |
|---|---|---|
| `register_nvc.html` | **TẠO MỚI** | Chính |
| `tracking.js` | Không thay đổi | Tái sử dụng |
| `register.js` | Không thay đổi | Không dùng |
| `index.html` | Không thay đổi (trừ khi cần thêm link) | Ngoài scope |

## 5. Rủi ro tiềm ẩn & Lưu ý

| Rủi ro | Mức | Biện pháp |
|---|---|---|
| Google Sheet Webhook URL chưa cấu hình cho NVC | ⚠️ Trung bình | Dùng `CUSTOM_WEBAPP_URL` - anh cần cung cấp URL nếu muốn ghi vào Sheet riêng, hoặc dùng chung Sheet hiện tại |
| Checkbox "max 2" validation chỉ client-side | 🟡 Thấp | Đủ cho use case hiện tại, server-side validation nằm ở Google Apps Script |
| Typo `input:focutaos` ở `register.html` gốc | 🟢 Thông tin | Không ảnh hưởng file mới, nhưng nên fix ở file gốc khi có dịp |

## 6. Auditor Review

> Mục này dành cho Codex/Claude rà soát kế hoạch trước khi triển khai.

- [ ] Cấu trúc form phù hợp yêu cầu?
- [ ] Color theme & UX design hợp lý?
- [ ] Logic max-2-checkbox có edge case nào?
- [ ] Dữ liệu gửi Sheet có đầy đủ?
