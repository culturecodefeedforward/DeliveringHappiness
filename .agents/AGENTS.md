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
