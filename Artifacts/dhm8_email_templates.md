# DHM8 Email Templates (Mẫu Email Hệ Thống DHM8)
**File Location**: `C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website\Artifacts\dhm8_email_templates.md`

Tài liệu này chứa 3 mẫu email HTML dùng cho hệ thống tự động hóa đăng ký khóa học Delivering Happiness Masterclass 8 (DHM8).

---

## 1. Mẫu 1: Email Xác nhận Đăng ký - Trạng thái: CHƯA THANH TOÁN (Pending)
*   **Người nhận**: Học viên đăng ký (`data.email`)
*   **Tiêu đề**: `[DHM8] Xác nhận đăng ký & Hướng dẫn hoàn tất thủ tục giữ chỗ - {{FullName}}`
*   **Định dạng**: HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e3a8a, #0d9488); padding: 30px 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px 25px; }
    .greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; }
    .highlight-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
    .highlight-box h3 { margin: 0 0 8px 0; color: #b45309; font-size: 15px; }
    .payment-details { background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px 20px; margin: 15px 0; }
    .payment-details ul { list-style: none; padding: 0; margin: 0; }
    .payment-details li { margin-bottom: 8px; font-size: 14px; }
    .payment-details li strong { color: #1f2937; }
    .code-syntax { font-family: 'Courier New', Courier, monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #b91c1c; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; text-align: center; }
    .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DELIVERING HAPPINESS MASTERCLASS</h1>
      <p>Hành trình Kiến tạo Văn hóa Hạnh phúc & Nâng tầm Tổ chức (DHM8)</p>
    </div>
    <div class="content">
      <div class="greeting">Chào {{FullName}},</div>
      <p>Cảm ơn bạn đã đăng ký tham gia chương trình **Delivering Happiness Masterclass 8 (DHM8)** diễn ra vào ngày 04/07/2026 sắp tới.</p>
      <p>Ban Tổ chức (BTC) đã nhận được thông tin đăng ký của bạn. Để đảm bảo quyền lợi và hoàn tất thủ tục **giữ chỗ chính thức**, vui lòng hoàn thành chi phí hậu cần theo hướng dẫn bên dưới.</p>
      
      <div class="highlight-box">
        <h3>⚠️ Lưu ý quan trọng:</h3>
        Hạn mức số lượng học viên tham gia trực tiếp lớp học rất giới hạn. Vui lòng hoàn thành chuyển khoản sớm để hệ thống ghi nhận vị trí chính thức của bạn. Trạng thái đăng ký hiện tại: <strong>CHƯA THANH TOÁN (Pending)</strong>.
      </div>

      <div class="payment-details">
        <h4 style="margin-top: 0; color: #1e3a8a;">Thông tin chuyển khoản chi phí hậu cần (300.000đ):</h4>
        <ul>
          <li>🏦 <strong>Ngân hàng BIDV</strong> (cá nhân): <code>8815369431</code> - Hà Ngọc Hoàn</li>
          <li>🏦 <strong>Ngân hàng MB</strong> (doanh nghiệp): <code>9600006868</code> - CONG TY TNHH HIPER CONSULTING</li>
          <li>✍️ <strong>Cú pháp chuyển khoản</strong> (Bắt buộc đúng): <span class="code-syntax">DHM8 - {{Phone}} - {{FullName}}</span></li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #4b5563;">*Sau khi bạn chuyển khoản thành công, hệ thống gạch nợ tự động của BTC sẽ kiểm tra giao dịch và tự động gửi email xác nhận giữ chỗ chính thức tới hòm thư này.*</p>
      
      <p>Hẹn gặp lại bạn tại lớp học!</p>
      <p>Trân trọng,<br><strong>Ban Tổ chức Delivering Happiness</strong></p>
    </div>
    <div class="footer">
      Email này được gửi tự động từ hệ thống đăng ký Delivering Happiness.<br>
      © 2026 CultureCode. All rights reserved.
    </div>
  </div>
</body>
</html>
```

---

## 2. Mẫu 2: Email Xác nhận Đã Thanh toán - Trạng thái: ĐÃ THANH TOÁN (Paid)
*   **Người nhận**: Học viên đăng ký (`data.email`)
*   **Tiêu đề**: `[DHM8] Xác nhận thanh toán thành công & Giữ chỗ chính thức - {{FullName}}`
*   **Định dạng**: HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f9f9f9; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 30px 25px; }
    .greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; }
    .success-box { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
    .success-box h3 { margin: 0 0 8px 0; color: #065f46; font-size: 15px; }
    .info-list { background-color: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 15px 20px; margin: 15px 0; }
    .info-list ul { padding-left: 20px; margin: 0; }
    .info-list li { margin-bottom: 8px; font-size: 14px; color: #4b5563; }
    .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>XÁC NHẬN GIỮ CHỖ CHÍNH THỨC</h1>
      <p>Delivering Happiness Masterclass 8 (DHM8)</p>
    </div>
    <div class="content">
      <div class="greeting">Chào {{FullName}},</div>
      <p>Chúc mừng bạn! Hệ thống gạch nợ tự động của Delivering Happiness đã ghi nhận giao dịch thanh toán chi phí hậu cần thành công cho hồ sơ của bạn.</p>
      
      <div class="success-box">
        <h3>✅ Đã xác nhận giữ chỗ thành công:</h3>
        Hồ sơ đăng ký của bạn đã được chuyển trạng thái sang <strong>ĐÃ THANH TOÁN (Paid)</strong>. Vị trí tham gia lớp học của bạn đã được đảm bảo chính thức.
      </div>

      <div class="info-list">
        <h4 style="margin-top: 0; color: #065f46;">Thông tin lớp học của bạn:</h4>
        <ul>
          <li>📅 <strong>Thời gian</strong>: Ngày 04/07/2026 (Chi tiết giờ học cụ thể sẽ được gửi trước sự kiện 1 tuần)</li>
          <li>📍 <strong>Hình thức</strong>: Học trực tiếp (Offline)</li>
          <li>📚 <strong>Chương trình đăng ký</strong>: {{AttendedPrograms}}</li>
        </ul>
      </div>

      <p>BTC sẽ gửi email hướng dẫn chi tiết về tài liệu học tập, địa điểm học và các khâu chuẩn bị trước sự kiện qua email này. Bạn vui lòng chú ý theo dõi hòm thư (và kiểm tra mục Spam/Quảng cáo nếu không thấy thư gửi về nhé).</p>
      
      <!-- Zalo Group Connection Card -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 20px 0; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #1e3a8a; font-size: 15px; font-weight: 600;">📱 Tham gia Nhóm Zalo Lớp học:</h4>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e293b;">Để dễ dàng kết nối với Ban tổ chức, giảng viên và nhận các thông báo quan trọng nhất trong suốt khóa học, bạn vui lòng tham gia nhóm Zalo hỗ trợ tại đây:</p>
        <a href="https://zalo.me/g/idmxekeesuabqk2qxzld" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">Tham gia Nhóm Zalo DHM8</a>
      </div>

      <!-- Logistics & Culture Notes -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px 20px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #374151; font-size: 15px; font-weight: 600;">🌱 Một số lưu ý từ BTC:</h4>
        <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
          <li style="margin-bottom: 8px;"><strong>Thời gian có mặt</strong>: Lớp học sẽ bắt đầu đúng giờ. Bạn vui lòng có mặt trước 15 phút để hoàn tất check-in và nhận tài liệu in ấn.</li>
          <li style="margin-bottom: 8px;"><strong>Cam kết xanh</strong>: BTC khuyến khích bạn mang theo <strong>bình nước cá nhân</strong> để cùng hạn chế rác thải nhựa, bảo vệ môi trường.</li>
          <li style="margin-bottom: 0;"><strong>Chính sách hoàn phí</strong>: Chi phí hậu cần đã được sử dụng để chuẩn bị teabreak, ăn trưa và in ấn tài liệu nên BTC không hỗ trợ hoàn phí. Bạn có thể chuyển nhượng suất học cho người khác và báo lại cho BTC tối thiểu 3 ngày trước sự kiện. Chi phí còn dư (nếu có) sẽ được quyên góp vào Quỹ Nhân ái của Báo Dân trí.</li>
        </ul>
      </div>

      <p>Cảm ơn bạn đã đồng hành cùng Delivering Happiness!</p>
      <p>Trân trọng,<br><strong>Ban Tổ chức Delivering Happiness</strong></p>
    </div>
    <div class="footer">
      Email này được gửi tự động từ hệ thống đăng ký Delivering Happiness.<br>
      © 2026 CultureCode. All rights reserved.
    </div>
  </div>
</body>
</html>
```

---

## 3. Mẫu 3: Email Thông báo Đăng ký Mới cho Ban Tổ Chức (BTC Notification)
*   **Người nhận**: BTC (`quochung.reo@gmail.com, chauhm71@gmail.com`)
*   **Tiêu đề**: `[DHM8 - NEW REG] Đăng ký mới từ {{FullName}} - {{Phone}} ({{PaymentStatus}})`
*   **Định dạng**: HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; color: #333333; }
    .header { background-color: #1e293b; color: #ffffff; padding: 15px 20px; }
    .header h2 { margin: 0; font-size: 18px; }
    .content { padding: 20px; }
    .detail-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .detail-table th, .detail-table td { border: 1px solid #dddddd; text-align: left; padding: 10px; font-size: 14px; }
    .detail-table th { background-color: #f1f5f9; width: 35%; font-weight: bold; }
    .status-pending { color: #b45309; font-weight: bold; }
    .status-paid { color: #047857; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h2>[DHM8] THÔNG BÁO CÓ ĐĂNG KÝ MỚI</h2>
  </div>
  <div class="content">
    <p>Hệ thống vừa ghi nhận một lượt đăng ký mới cho khóa học **DHM8**. Chi tiết thông tin học viên như sau:</p>
    
    <table class="detail-table">
      <tr>
        <th>Họ tên</th>
        <td>{{FullName}}</td>
      </tr>
      <tr>
        <th>Số điện thoại</th>
        <td>{{Phone}}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{Email}}</td>
      </tr>
      <tr>
        <th>Công ty / Tổ chức</th>
        <td>{{Company}}</td>
      </tr>
      <tr>
        <th>Chức vụ</th>
        <td>{{JobTitle}}</td>
      </tr>
      <tr>
        <th>Chương trình đăng ký</th>
        <td>{{AttendedPrograms}}</td>
      </tr>
      <tr>
        <th>Nguồn biết thông tin</th>
        <td>{{SourceHearing}}</td>
      </tr>
      <tr>
        <th>Mục đích tham gia</th>
        <td>{{Purpose}}</td>
      </tr>
      <tr>
        <th>Mức độ hiểu biết DH</th>
        <td>{{HappinessKnowledge}}</td>
      </tr>
      <tr>
        <th>03 Mong đợi nhất</th>
        <td>{{Expectations}}</td>
      </tr>
      <tr>
        <th>Người giới thiệu</th>
        <td>{{ReferrerName}} (SĐT: {{ReferrerPhone}})</td>
      </tr>
      <tr>
        <th>Trạng thái thanh toán</th>
        <td class="{{StatusClass}}">{{PaymentStatus}}</td>
      </tr>
    </table>
    
    <p style="margin-top: 20px; font-size: 13px; color: #666;">Dữ liệu đã được ghi nhận tự động vào Google Sheet tab <strong>DHM8_Data</strong>.</p>
  </div>
</body>
</html>
```
