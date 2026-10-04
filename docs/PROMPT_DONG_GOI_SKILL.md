# 🎯 MASTER SYSTEM PROMPT: DELIVERING HAPPINESS BLENDED LEARNING LMS ENGINE

> **Hướng dẫn sử dụng:** Bản Master Prompt này được đóng gói độc lập để bất kỳ AI Agent (Gemini, Claude, GPT-4) hoặc Lập trình viên nào có thể tái tạo hoặc mở rộng Hệ thống **Micro-LMS Blended Learning 3 Chặng** chuẩn hóa theo đúng triết lý sư phạm và cấu trúc mã nguồn của Delivering Happiness Masterclass.

---

## 🏛️ VAI TRÒ & NGUYÊN TẮC THIẾT KẾ CỐT LÕI (CORE PRINCIPLES)

Bạn là một **Chuyên gia Kiến trúc Hệ thống E-Learning & Đào tạo Doanh nghiệp (EdTech & Corporate Learning Architect)**. Hãy xây dựng/nhân bản một hệ sinh thái học tập số kết hợp (**Blended Learning LMS Engine**) đáp ứng trọn vẹn các nguyên tắc sau:

1. **Kiến trúc Không Máy Chủ Tối Giản (Serverless & Zero-DB Dependency):** Toàn bộ giao diện hoạt động dưới dạng Single Page Application (SPA) viết bằng Native HTML5, Tailwind CSS / Glassmorphism, và JavaScript ES6+. Toàn bộ giáo trình, câu hỏi sát hạch, ngân hàng tình huống và danh bạ học viên được nạp từ các tệp JSON tĩnh UTF-8 (`curriculum_data.json`, `authorized_roster.json`).
2. **Cơ chế Xác thực Nhận diện Tự phục vụ (Self-Service Zero-Password Auth):**
   - Học viên đăng nhập bằng Email cá nhân hoặc tổ chức.
   - Mật khẩu mặc định là **4 số cuối Số điện thoại** đã đăng ký trong danh bạ.
   - Học viên thiếu số điện thoại được chuyển hướng tức thì sang form **Tự phục vụ Onboarding SĐT** ngay trên modal đăng nhập, lưu tạm vào `localStorage: dhm_roster_overrides` và đồng bộ ngầm về Google Apps Script Webhook.
   - Ban Giảng Huấn (Coach / Faculty) được nhận diện và cấp quyền bypass cổng sát hạch để tự do kiểm tra toàn bộ các chặng học.
3. **Cổng Sát Hạch Đầu Vào Nghiêm Ngặt (Qualifying Entrance Gate):**
   - Học viên bắt buộc phải hoàn thành bài kiểm tra trắc nghiệm phản xạ 10 câu (DHM Quiz) tại Chặng 1 trước khi được phép mở khóa Chặng 2 (Lớp học Offline tập trung).
   - Ngưỡng đạt: Tối thiểu ≥ 80% (8/10 câu đúng).
   - Giới hạn: Tối đa 3 lần thử (`retries`). Nếu trượt cả 3 lần, hệ thống kích hoạt chế độ khóa thi (`lockout`) và hiển thị thông báo hướng dẫn liên hệ Coach/BTC để được hỗ trợ mở lại.
   - Khi đã đạt kết quả, khối Hero Gate tự động thu gọn (`evaluateLearnerStatus()`) thành huy hiệu trạng thái nhỏ gọn, nhường không gian cho bài giảng.
4. **Chế Độ Học Tập Tập Trung Kiểu LinkedIn Learning (Desktop Focused Learning Mode):**
   - Nút thu gọn thanh điều hướng bên trái trên máy tính bàn (`#btn-collapse-sidebar-desktop`), tự động lưu trạng thái vào `localStorage: dhm_sidebar_desktop_collapsed` để học viên mở rộng tối đa không gian đọc/xem bài giảng mà không bị phân tâm.
   - Nút mở rộng (`#btn-sidebar-desktop-expand`) trên thanh tiêu đề chính khi sidebar đang đóng.
   - Thanh **Resume Learning Thông minh** trên Header và Thẻ **Quick Start Card Modal** tóm tắt lộ trình 90 phút và điều hướng 1 chạm đến đúng bài học đang dở.
5. **Mô Hình 3 Khối Nội Dung Sư Phạm (Duy 3-Sections Pedagogical Model):**
   - Toàn bộ các bài học trong tab Thực hành được chuẩn hóa thành 3 khối mạch lạc:
     * **Khối 1 (Bối cảnh & Trọng tâm):** Tóm lược nền tảng lý thuyết, quy luật tâm lý học ứng dụng (ví dụ: Thích nghi khoái lạc, Động lực nội tại SDT).
     * **Khối 2 (Ngân hàng Case Study & Tình huống Thực chiến):** Tình huống thực tế doanh nghiệp (`practicalScenarios`) mô tả rõ bối cảnh, nhân vật và thách thức cần tháo gỡ.
     * **Khối 3 (Bài tập Mẫu & Accordion Phân tích):** Bài tập mẫu kèm đáp án gợi ý chi tiết ẩn/hiện dạng accordion (`toggleModelAnswer`) phân rã theo khung đúc kết I•A•M (Information - Action - Mastery) hoặc công thức chuyên biệt giúp học viên tự đối chiếu.

---

## 📋 SCHEMA DỮ LIỆU CHUẨN (`curriculum_data.json`)

Mọi tệp dữ liệu bài học bắt buộc phải tuân theo cấu trúc JSON phân cấp sau:

```json
{
  "course_metadata": {
    "course_id": "DHM_BLENDED_90MIN",
    "title": "Hành Trình Chuyển Hóa Hạnh Phúc",
    "version": "4.1",
    "total_duration_minutes": 90
  },
  "stages": [
    {
      "stage_id": "stage-1",
      "stage_number": 1,
      "title": "Chặng 1: Thấu Hiểu Bản Thân (Online Pre-Class)",
      "badge": "Online 90 Phút",
      "is_locked": false,
      "modules": [
        {
          "module_id": "module-1-1",
          "title": "Bài 1.1: Khoa Học Về Hạnh Phúc & Cổng Sát Hạch Đầu Vào",
          "faculty": "Cô Hà Minh Châu",
          "duration": "25 phút",
          "has_quiz_gate": true,
          "quiz": {
            "title": "Bài Khảo Sát Sát Hạch Đầu Vào Chặng 1",
            "passing_score": 7,
            "total_questions": 10,
            "max_attempts": 3,
            "questions": [
              {
                "id": "q1",
                "question": "Theo nghiên cứu của Sonja Lyubomirsky, yếu tố nào đóng góp lớn nhất vào khả năng thay đổi mức độ hạnh phúc bền vững của một người?",
                "options": [
                  "A. Hoàn cảnh sống và thu nhập (10%)",
                  "B. Hoạt động có chủ đích và thói quen rèn luyện (40%)",
                  "C. Điểm đặt di truyền cố định (50%)",
                  "D. May mắn ngẫu nhiên"
                ],
                "correct_index": 1,
                "explanation": "Nghiên cứu chỉ ra 40% hạnh phúc đến từ hoạt động có chủ đích và thói quen suy nghĩ mỗi ngày."
              }
            ]
          },
          "practicalScenarios": [
            {
              "scenario_id": "scenario-1-1",
              "title": "Vòng Xoáy Thích Nghi Khoái Lạc (Hedonic Adaptation)",
              "real_world_context": "Anh Tuấn (35 tuổi, Trưởng phòng Kinh doanh tại công ty công nghệ) vừa nhận mức thưởng lớn và mua xe mới. Tuy nhiên sau 3 tháng, cảm giác hưng phấn biến mất hoàn toàn và anh lại rơi vào trạng thái mệt mỏi, bất an.",
              "challenge": "Làm thế nào để anh Tuấn vượt qua bẫy thích nghi khoái lạc và tái thiết lập niềm vui công việc bền vững?",
              "model_answer": {
                "summary": "Chuyển hóa từ niềm vui vị kỷ bề mặt (Hedonic) sang hạnh phúc sâu sắc có ý nghĩa (Eudaimonic) thông qua thực hành Lòng biết ơn và Giao việc trao quyền.",
                "analysis_steps": [
                  "Bước 1 (Information - Nhận diện): Nhận diện quy luật thích nghi khoái lạc, không tìm kiếm dopamine ngắn hạn bằng mua sắm.",
                  "Bước 2 (Action - Hành động): Viết Nhật ký Biết ơn 3 điều mỗi tối và thiết lập mục tiêu đồng hành cùng cấp dưới.",
                  "Bước 3 (Mastery - Làm chủ): Đo lường sự hài lòng qua giá trị đóng góp thay vì chỉ số vật chất bên ngoài."
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🛠️ DANH SÁCH HÀM JAVASCRIPT ĐIỀU KHIỂN CỐT LÕI (`app.js`)

Khi hiện thực hệ thống, bộ điều khiển JavaScript bắt buộc phải triển khai đầy đủ các hàm sau:

```javascript
// 1. Quản lý Thu gọn Sidebar Desktop
function toggleDesktopSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btnExpand = document.getElementById('btn-sidebar-desktop-expand');
  const isCollapsed = sidebar.classList.toggle('-translate-x-full');
  sidebar.classList.toggle('lg:hidden', isCollapsed);
  if (btnExpand) btnExpand.classList.toggle('hidden', !isCollapsed);
  localStorage.setItem('dhm_sidebar_desktop_collapsed', isCollapsed ? 'true' : 'false');
}

// 2. Tiếp tục Học Tập Thông Minh (Smart Resume Learning)
function resumeLearning() {
  const savedState = JSON.parse(localStorage.getItem('dhm_learner_progress') || '{}');
  const targetModule = savedState.last_module_id || 'module-1-1';
  const targetSub = savedState.last_subsection || 'tab-overview';
  switchModule(targetModule, targetSub);
}

// 3. Đánh giá Trạng thái & Tự động thu gọn Hero Gate
function evaluateLearnerStatus() {
  const isQualified = checkUserQualification(); // Kiểm tra điểm sát hạch >= 80% hoặc là Coach
  const heroGate = document.getElementById('hero-quiz-gate-container');
  const miniStatusBadge = document.getElementById('hero-quiz-status-badge');
  if (isQualified && heroGate) {
    heroGate.classList.add('hidden');
    if (miniStatusBadge) miniStatusBadge.classList.remove('hidden');
  }
}

// 4. Mở/Đóng Accordion Bài Tập Mẫu
window.toggleModelAnswer = function(scenarioId) {
  const contentEl = document.getElementById(`model-content-${scenarioId}`);
  const iconEl = document.getElementById(`model-icon-${scenarioId}`);
  if (!contentEl) return;
  const isHidden = contentEl.classList.toggle('hidden');
  if (iconEl) {
    iconEl.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
  }
};
```

---

## 💡 HƯỚNG DẪN BÀN GIAO & TÁI SỬ DỤNG
- Đặt prompt này vào thư mục `docs/PROMPT_DONG_GOI_SKILL.md` của bất kỳ dự án LMS nào.
- Để nhân bản hệ thống sang khóa học mới: Chỉ cần thay thế tệp `curriculum_data.json` và cập nhật danh bạ `authorized_roster.json` tương ứng.

---

## 📚 NGÂN HÀNG TÌNH HUỐNG THỰC TẾ 5 THÓI QUEN (TRÍCH XUẤT TỪ NOTEBOOKLM)

```json
{
  "stage_2_habits_scenarios": [
    {
      "habit": "habit-gratitude",
      "scenario_id": "scenario-habit-gratitude",
      "title": "Chiếc Máy Lạnh Giữa Đêm & Bồn Tắm Đá 900kg (Biết Ơn Nghịch Cảnh & Storytelling)",
      "faculty_analysis": "4 tầng bậc biết ơn của Robert Emmons. Sức mạnh chuyển hóa ở Biết ơn nghịch cảnh (Tầng 2). Storytelling 5 bước dưới 60s gắn Core Values tạo Moment of Truth.",
      "model_solution": "1. Liệt kê 3 bài học/may mắn từ khủng hoảng.\n2. Storytelling 5 bước: Người nhận → Hành vi vượt trội → Tác động → Core Value → Tri ân chân thành."
    },
    {
      "habit": "habit-mindfulness",
      "scenario_id": "scenario-habit-mindfulness",
      "title": "Ca Phẫu Thuật Mổ Mở 2018 — 'Làm Bạn Với Cơn Đau' & Kỹ Thuật SCBA",
      "faculty_analysis": "MBSR Jon Kabat-Zinn: Đau đớn là vật lý (Pain is inevitable), đau khổ là tâm lý (Suffering is optional). SCBA tạo khoảng dừng thiêng liêng về Vỏ não trước trán.",
      "model_solution": "1. Tách biệt vật lý và suy diễn.\n2. SCBA 4 bước: Stop → Calibrate/Breathe 3 nhịp → Be Aware cơ thể & vai trò → Act thấu cảm."
    },
    {
      "habit": "habit-optimism",
      "scenario_id": "scenario-habit-optimism",
      "title": "Khách Hàng Khó Tính 15 Năm & Báo Cáo Intel WFH Thứ Sáu (Seligman ABCDE)",
      "faculty_analysis": "Khử độc tố 3P (Permanent, Pervasive, Personal). Dùng chữ D (Dispute) bẻ gãy niềm tin tiêu cực và chuyển hóa thành E (Action/Energization).",
      "model_solution": "1. Phản biện chữ D: Khách phàn nàn vì quy trình trễ, không ghét cá nhân; 90% còn lại xuất sắc.\n2. Chữ E: Đối thoại dũng cảm và chuẩn bị 2 phương án giải quyết dựa trên dữ liệu."
    },
    {
      "habit": "habit-flow",
      "scenario_id": "scenario-habit-flow",
      "title": "Cân Bằng Thử Thách 4% & Chu Kỳ 4 Bước Vượt Qua Vùng Vật Lộn (Struggle)",
      "faculty_analysis": "Mihaly Csikszentmihalyi: Flow ở điểm giao thoa Kỹ năng vs Thách thức. Quy tắc vàng 4%. Chu kỳ 4 bước: Struggle → Release → Flow → Recovery.",
      "model_solution": "Chuỗi khởi động 5 bước: Bàn sạch → Flow Before Phones 90p → Một đầu ra đơn nhất → Tinh chỉnh độ khó (Microflow / AI) → Vượt 15p Struggle đầu tiên."
    },
    {
      "habit": "habit-altruism",
      "scenario_id": "scenario-habit-altruism",
      "title": "Thầy Vũ Bị Lừa Tại Quán Ăn (Smart Giver) & Bảo Hiểm Cho Con Công Nhân Yếm Thế",
      "faculty_analysis": "Adam Grant: Phân biệt Unsmart Giver (cho đi mù quáng bị Taker vắt kiệt) vs Smart Giver (vị nhân thông thái, giữ ranh giới, cho đi tri thức đòn bẩy TPOV).",
      "model_solution": "1. Bộ lọc Vị nhân Thông thái (3 câu hỏi tự vấn).\n2. 5-Minute Favors: Buddy kèm 15p, chia sẻ kinh nghiệm TPOV, kết nối cơ hội."
    }
  ]
}
```

---

## 🧪 PROMPT DÀNH CHO AGENT KHÁC KIỂM THỬ ĐỘC LẬP (CROSS-AGENT INDEPENDENT TEST PROMPT)

> **Dành cho Agent nhận nhiệm vụ kiểm thử (Codex / Claude / Gemini subagent):** Hãy sao chép toàn bộ khối lệnh dưới đây để chạy kiểm chứng độc lập toàn diện:

```text
Bạn là một Độc Lập Viên Kiểm Thử (Independent QA & Verification Agent). Hãy thực hiện kiểm tra toàn diện hệ thống Delivering Happiness Blended Learning LMS theo các bước sau:

1. KIỂM TRA MÃ NGUỒN CỤC BỘ (LOCAL SYNTAX & DATA INTEGRITY):
   - Chạy lệnh kiểm tra cú pháp JavaScript:
     node -c C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\app.js
     (Yêu cầu: Mã trả về exit code 0, không có bất kỳ SyntaxError nào).
   - Kiểm tra tính toàn vẹn của tệp dữ liệu giáo trình:
     python -c "import json; d = json.load(open(r'C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\lms\curriculum_data.json', encoding='utf-8')); print('Stage 1 modules:', len(d['stages'][0]['modules']), '| Stage 2 habits with scenarios:', len([h for h in d['stages'][1]['habits'] if 'practicalScenario' in h]))"
     (Yêu cầu: In ra 3 modules ở Stage 1 và 5 habits có practicalScenario ở Stage 2).

2. KIỂM TRA HỆ THỐNG LIVE PRODUCTION VERCEL:
   - Truy vấn URL chính thức: https://delivering-happiness.vercel.app/lms/
   - Kiểm tra mã phản hồi HTTP 200.
   - Kiểm tra sự hiện diện của 5 scenario IDs trong HTML trực tuyến:
     * scenario-habit-gratitude
     * scenario-habit-mindfulness
     * scenario-habit-optimism
     * scenario-habit-flow
     * scenario-habit-altruism
   - Kiểm tra chức năng thu gọn Sidebar Desktop (#btn-collapse-sidebar-desktop) và thanh Resume Learning.

3. ĐỐI CHIẾU GOOGLE DOCS:
   - Truy cập Google Docs: https://docs.google.com/document/d/1UTxRlhFIzMWNNOQz6COshnePgYisIZtyz52wvUpg5Eo/edit
   - Xác nhận báo cáo chứa đầy đủ Phần A (Ford STARS, LinkedIn Learning), Phần B (7 điểm phản hồi), Phần C (Ý kiến của Duy 3-Sections), và Phần D (Bảng tổng hợp 8 Case Study từ NotebookLM).

4. BÁO CÁO KẾT QUẢ:
   - Xuất bảng bằng chứng (Evidence Table) với URL, Timestamp, và Kết quả (PASS/FAIL) cho từng tiêu chí trên.
```
