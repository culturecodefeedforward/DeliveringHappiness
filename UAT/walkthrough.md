# Walkthrough - UAT Form Đăng ký DH

## 1. Công việc đã thực hiện (Work Done)
- **Tạo kế hoạch kiểm thử:** Lập file kế hoạch kiểm thử [implementation_plan_20260606_UATRegisterForm.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/Implementation%20Plan/implementation_plan_20260606_UATRegisterForm.md) trong thư mục dự án và trình duyệt.
- **Thực thi UAT tự động:** Chạy `browser_subagent` để kiểm thử tương tác trên biểu mẫu thực tế tại [delivering-happiness.vercel.app/register.html](https://delivering-happiness.vercel.app/register.html).
- **Ghi nhận bằng chứng:** Chụp 3 ảnh màn hình và quay video làm minh chứng cho quá trình gửi thông tin mẫu (`Gemini UAT Test`).
- **Xác minh CRM Google Sheets:** Đối soát dòng `628` trên Google Sheets để chắc chắn dữ liệu được lưu đúng cột và đúng giá trị.
- **Sao lưu & Lập báo cáo:** Sao lưu toàn bộ minh chứng vào thư mục `UAT/evidence` của workspace và lập báo cáo chi tiết [uat_report_20260606_RegisterForm.md](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/uat_report_20260606_RegisterForm.md).

## 2. Kết quả kiểm tra (Verification Results)
- **Trạng thái:** **PASS - normal path**
- **Cấu trúc dữ liệu ghi nhận:**
  - `additionalCourses` = `NVC - giao tiếp phi bạo lực, AI thực chiến` (Cột M)
  - `wantsNvcCourse` = `Yes` (Cột N)
  - `wantsAiCourse` = `Yes` (Cột O)

## 3. Minh chứng hình ảnh (Visual Evidence)
- **Hình 1: Form điền thông tin test:**
  ![Form điền thông tin test](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/evidence/filled_form_1780731255279.png)
- **Hình 2: Màn hình báo thành công:**
  ![Màn hình báo thành công](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/evidence/success_message_1780731277893.png)
- **Hình 3: Ghi nhận CRM Sheets:**
  ![Ghi nhận CRM Sheets](file:///c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website/UAT/evidence/crm_data_verified_1780731522376.png)
