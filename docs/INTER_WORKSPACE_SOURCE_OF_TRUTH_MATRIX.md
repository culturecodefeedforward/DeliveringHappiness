# MA TRẬN LIÊN THÔNG SOURCE OF TRUTH GIỮA HAI WORKSPACE SONG SINH
*(Teaching DH ⇄ dh4hn-website)*
*Phiên bản: 1.0 — Ngày phê chuẩn: 30/10/2026*

---

## 1. Bản Chất Kiến Trúc Cặp Dự Án Song Sinh (Twin Projects)

Hệ thống đào tạo và vận hành Delivering Happiness Masterclass (DHM) được phân định thành hai không gian làm việc (workspace) bổ trợ tương hỗ:

```text
┌────────────────────────────────────────┐       Đồng Bộ Tự Động       ┌────────────────────────────────────────┐
│              TEACHING DH               │ ──────────────────────────> │             DH4HN-WEBSITE              │
│      (Kho Học Liệu & LMS Source)       │ <────────────────────────── │      (Cổng Thông Tin & Web Live)       │
├────────────────────────────────────────┤                             ├────────────────────────────────────────┤
│ • Slide bài giảng gốc (.pptx v11, DHM10)│                             │ • Cổng tuyển sinh & Landing pages      │
│ • Giáo trình, kịch bản, audio bóc băng │                             │ • Mirror triển khai Vercel Production  │
│ • Mã nguồn gốc LMS (dhm-micro-lms/)    │                             │ • LMS Production (lms/index, admin)    │
│ • Bộ test tự động E2E qua Edge CDP     │                             │ • Apps Script live endpoint integration│
└────────────────────────────────────────┘                             └────────────────────────────────────────┘
```

---

## 2. Ma Trận Phân Định Trách Nhiệm & Nguồn Chuẩn (Source of Truth Matrix)

| Lĩnh Vực / Tài Nguyên | Nguồn Gốc (Primary Origin) | Bản Sao / Triển Khai (Mirror / Replica) | Cơ Chế Đồng Bộ & Kiểm Tra |
| :--- | :--- | :--- | :--- |
| **Slide Bài Giảng Online DHM10** | `G:\My Drive\download\DHM10_online session_301026.pptx` (28 slides, 15.2 MB) | `Teaching DH/Artifacts/DHM10_online session_301026.pptx` | Quét Google Drive, copy về Artifacts khi chạy `/package-project` |
| **Slide Bài Giảng Offline DHM10** | `G:\My Drive\download\DHM10_Offline_011126 v2.pptx` (91 slides, 19.4 MB) | `Teaching DH/Artifacts/DHM10_Offline_011126 v2.pptx` | Bản v2 là chuẩn mới nhất; lưu trữ offline-first |
| **Slide Apollo Inhouse v11** | `G:\My Drive\download\Team_Happiness_R11 For Apollo.pptx` | `Teaching DH/Artifacts/` | Dành riêng cho lớp quản lý Inhouse (Slide 82, 93, 94, 96, 98) |
| **Danh Sách Đăng Ký DHM10** | `G:\My Drive\download\dang-ky-bootcamp-delivering-happiness-10-he-dieu-hanh-hanh-20261028.xlsx` | `Teaching DH/Artifacts/` & `dh4hn-website/lms/` | Nạp vào `authorized_roster.json` & Google Sheets |
| **Mã Nguồn Quản Trị LMS Admin** | `Teaching DH/dhm-micro-lms/admin.html` (434.709 bytes, 7 Tab) | `dh4hn-website/lms/admin.html` & `release_package/lms/admin.html` | Khóa SHA-256 đối xứng 100% trước khi deploy Vercel |
| **Dữ Liệu Heatmap 70 Quản Lý** | `Teaching DH/dhm-micro-lms/apollo_heatmap_data.js` (407.649 bytes) | `dh4hn-website/lms/apollo_heatmap_data.js` | Khóa SHA-256 đối xứng 100% |
| **Mã Nguồn Micro-LMS Học Viên** | `Teaching DH/dhm-micro-lms/index.html` & `app.js` | `dh4hn-website/lms/index.html` & `release_package/` | Đồng bộ cấu trúc 3 Chặng Blended Learning |
| **Kịch Bản Kiểm Thử E2E** | `Teaching DH/test_cdp_e2e.js` (Edge CDP Automation) | Chạy kiểm thử trên cả local `Teaching DH` và live `dh4hn-website` | 9/9 sections PASS, 0 console errors |
| **Tài Liệu Bàn Giao 1-Chạm** | `Teaching DH/docs/RESUME_PROJECT_PROMPT.md` | `dh4hn-website/docs/RESUME_PROJECT_PROMPT.md` | Giữ nội dung đồng nhất tuyệt đối |

---

## 3. Quy Tắc Liên Thông Bắt Buộc (Interconnected Rules)

1. **Quy Tắc Quét Nguồn Đa Chiều (Multi-Workspace Scanning Rule):**
   - Bất kỳ Agent nào khi thực thi tại `Teaching DH` hoặc `dh4hn-website` KHÔNG ĐƯỢC phép giới hạn tầm nhìn trong một workspace đơn lẻ.
   - Khi tìm kiếm học liệu, slide, kịch bản, dữ liệu học viên: BẮT BUỘC kiểm tra cả 2 workspace và thư mục Google Drive chuẩn (`G:\My Drive\download\`, `G:\My Drive\`).
2. **Quy Tắc Bảo Toàn Ngoại Tuyến (Offline-First Mirroring Rule):**
   - Mọi tệp học liệu tải từ Google Drive phải được lưu trữ bản sao dự phòng tại `Artifacts/` của workspace để các kịch bản kiểm thử và phân tích chạy độc lập không phụ thuộc kết nối mạng.
3. **Quy Tắc Khóa Bất Biến SHA-256 Triển Khai (Deployment Parity Rule):**
   - Trước khi thực hiện deploy mã nguồn từ `dh4hn-website` lên Vercel Production, bắt buộc kiểm tra hash SHA-256 của các file nòng cốt (`admin.html`, `apollo_heatmap_data.js`, `curriculum_data.json`) để đảm bảo khớp 100% với bản phát triển tại `Teaching DH/dhm-micro-lms/`.
4. **Quy Tắc Bàn Giao Đồng Bộ (Handoff Synchronization Rule):**
   - Khi cập nhật `docs/RESUME_PROJECT_PROMPT.md` ở một bên, phải đồng bộ mirror ngay sang bên còn lại.
