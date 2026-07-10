# DHM9 Hà Nội - Mẫu Email Thông Báo Dời Lịch (Adapted từ DHM8)

Tài liệu này lưu trữ nội dung email gốc dùng cho việc dời lịch DHM8 và phiên bản chuyển đổi (adapted) dùng cho DHM9 Hà Nội.

---

## 1. Mẫu Email Gốc DHM8 (Để tham chiếu)

- **Tiêu đề (Subject Line)**: `[Delivering Happiness Masterclass] Thông báo thay đổi lịch tổ chức sự kiện DHM8 & Tri ân đặc biệt`
- **Dòng xem trước (Preview Text)**: `Ngày tổ chức mới là Thứ Bảy, 18/07/2026. Món quà tri ân đặc biệt dành cho sự đồng hành của Anh/Chị.`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #333333; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #1e3a8a, #0d9488); padding: 30px 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; font-weight: 500; }
    .content { padding: 30px 25px; }
    .greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a; }
    .paragraph { margin-bottom: 15px; text-align: justify; font-size: 14.5px; }
    .highlight-section { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .highlight-section h3 { margin: 0 0 8px 0; color: #b45309; font-size: 14.5px; font-weight: 600; }
    .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .info-table td.label { font-weight: bold; color: #4b5563; width: 35%; }
    .info-table td.value { color: #1f2937; }
    .cta-container { text-align: center; margin: 25px 0; }
    .btn { display: inline-block; padding: 12px 24px; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; transition: background-color 0.3s; margin: 5px; }
    .btn-hcm { background-color: #0d9488; }
    .btn-hn { background-color: #1e3a8a; }
    .footer { background-color: #f9fafb; padding: 25px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Delivering Happiness Masterclass</h1>
      <p>Hành trình Kiến tạo Văn hóa Hạnh phúc & Nâng tầm Tổ chức</p>
    </div>
    
    <div class="content">
      <div class="greeting">Chào Anh/Chị {TEN_NGUOI_NHAN},</div>
      
      <p class="paragraph">
        Cảm ơn Anh/Chị đã ghi danh tham gia chương trình <strong>Delivering Happiness Masterclass (DHM8)</strong>.
      </p>

      <p class="paragraph">
        Để công tác chuẩn bị được chu đáo và mang lại trải nghiệm học tập trọn vẹn nhất, Ban tổ chức (BTC) xin thông báo: Lịch tổ chức sự kiện dự kiến ngày 04/07/2026 sẽ được <strong>dời lại 2 tuần, lịch chính thức mới là Thứ Bảy, ngày 18/07/2026</strong>.
      </p>

      <p class="paragraph">
        BTC hiểu rằng kế hoạch học tập và công tác của Anh/Chị đã được sắp xếp trước. Vì vậy, BTC xin gửi lời xin lỗi chân thành nhất về sự bất tiện do việc điều chỉnh lịch trình này gây ra. Rất mong nhận được sự thấu hiểu và thông cảm từ Anh/Chị.
      </p>

      <div class="highlight-section">
        <h3>📅 Thông tin lịch học mới của Anh/Chị:</h3>
        <table class="info-table">
          <tr>
            <td class="label">Thời gian mới:</td>
            <td class="value"><strong>Thứ Bảy, ngày 18/07/2026 (07:30 - 17:30)</strong></td>
          </tr>
          <tr>
            <td class="label">Địa điểm chốt:</td>
            <td class="value"><strong>Trung tâm đào tạo Circle K, TP. Hồ Chí Minh</strong></td>
          </tr>
        </table>
      </div>

      <p class="paragraph" style="font-size: 13.5px; color: #4b5563; font-style: italic;">
        * Chúng tôi rất hy vọng sự thay đổi này không ảnh hưởng nhiều đến kế hoạch của Anh/Chị. (Trường hợp lịch học mới không phù hợp, Anh/Chị vui lòng phản hồi email này kèm số tài khoản để BTC hoàn trả lại 100% chi phí hậu cần).
      </p>

      <p class="paragraph" style="margin-top: 25px;">
        Đặc biệt, khoảng thời gian giãn lịch này chính là <strong>cơ hội tuyệt vời để Anh/Chị rủ thêm đồng nghiệp hoặc đối tác đồng hành</strong>. Nhằm tri ân sâu sắc sự thấu hiểu và đồng hành của Anh/Chị, khi Anh/Chị giới thiệu người đăng ký mới cùng tham gia DHM8/DHM9 trong giai đoạn này, cả hai sẽ được <strong>tặng độc quyền suất tham gia chương trình huấn luyện đặc biệt của chị Hà Minh Châu:</strong>
      </p>

      <!-- Box Quà tặng Lãnh đạo Liên nhóm đặc biệt -->
      <div style="background-color: #f0fdf4; border: 1px dashed #0d9488; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 15px 0; font-size: 13.5px; line-height: 1.6; color: #374151; text-align: left; font-weight: 500;">
          🔗 Anh/Chị có thể gửi trực tiếp liên kết đăng ký dưới đây đến đồng nghiệp, đối tác của mình:
        </p>
        
        <div class="cta-container">
          <a href="{LINK_HCM}" class="btn btn-hcm">Đăng Ký DHM8 - TP.HCM</a>
          <a href="{LINK_HN}" class="btn btn-hn">Đăng Ký DHM9 - Hà Nội</a>
        </div>
        
        <img src="https://delivering-happiness.vercel.app/cross_team_command_offer.jpg" alt="Cross-Team Command Offer" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 15px;" />
      </div>
      
      <p class="paragraph" style="margin-top: 25px;">
        Hẹn gặp lại Anh/Chị tại lớp học vào ngày 18/07/2026 sắp tới!
      </p>
    </div>
    
    <div class="footer">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <tr>
          <td style="vertical-align: top; padding-right: 15px;">
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #1e3a8a;">Trân trọng,</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold; color: #374151;">Ban tổ chức Delivering Happiness Masterclass (DHM)</p>
            <p style="margin: 2px 0 10px 0; font-size: 12px; color: #6b7280; font-style: italic;">(Hoạt động thuộc sáng kiến CultureCode)</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #0d9488; font-weight: 500;">
              🔗 <a href="https://www.linkedin.com/company/culturecodecommunity" target="_blank" style="color: #0d9488; text-decoration: none; font-weight: bold;">Cập nhật thông tin mới nhất trên LinkedIn CultureCode</a>
            </p>
          </td>
          <td style="width: 130px; text-align: right; vertical-align: top;">
            <img src="https://delivering-happiness.vercel.app/culturecode_live_club_logo.jpg" alt="CultureCode Logo" style="width: 120px; height: auto; display: block; margin-left: auto;" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
```

---

## 2. Mẫu Email Adapted cho DHM9 Hà Nội (Chờ Duyệt)

- **Tiêu đề (Subject Line)**: `[Delivering Happiness Masterclass] Thông báo thay đổi lịch tổ chức sự kiện DHM9 & Tri ân đặc biệt`
- **Dòng xem trước (Preview Text)**: `Ngày tổ chức mới là Thứ Bảy, 12/09/2026. Món quà tri ân đặc biệt dành cho sự đồng hành của Anh/Chị.`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #333333; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; }
    .header { background: linear-gradient(135deg, #1e3a8a, #0d9488); padding: 30px 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; font-weight: 500; }
    .content { padding: 30px 25px; }
    .greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1e3a8a; }
    .paragraph { margin-bottom: 15px; text-align: justify; font-size: 14.5px; }
    .highlight-section { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 18px; margin: 20px 0; border-radius: 4px; }
    .highlight-section h3 { margin: 0 0 8px 0; color: #b45309; font-size: 14.5px; font-weight: 600; }
    .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .info-table td { padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .info-table td.label { font-weight: bold; color: #4b5563; width: 35%; }
    .info-table td.value { color: #1f2937; }
    .cta-container { text-align: center; margin: 25px 0; }
    .btn { display: inline-block; padding: 12px 24px; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; transition: background-color 0.3s; margin: 5px; }
    .btn-hcm { background-color: #0d9488; }
    .btn-hn { background-color: #1e3a8a; }
    .footer { background-color: #f9fafb; padding: 25px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Delivering Happiness Masterclass</h1>
      <p>Hành trình Kiến tạo Văn hóa Hạnh phúc & Nâng tầm Tổ chức</p>
    </div>
    
    <div class="content">
      <div class="greeting">Chào Anh/Chị {TEN_NGUOI_NHAN},</div>
      
      <p class="paragraph">
        Cảm ơn Anh/Chị đã ghi danh tham gia chương trình <strong>Delivering Happiness Masterclass (DHM9)</strong>.
      </p>

      <p class="paragraph">
        Để công tác chuẩn bị được chu đáo và mang lại trải nghiệm học tập trọn vẹn nhất, Ban tổ chức (BTC) xin thông báo: Lịch tổ chức sự kiện dự kiến ngày 22/08/2026 sẽ được <strong>dời lịch, lịch chính thức mới là Thứ Bảy, ngày 12/09/2026</strong>.
      </p>

      <p class="paragraph">
        BTC hiểu rằng kế hoạch học tập và công tác của Anh/Chị đã được sắp xếp trước. Vì vậy, BTC xin gửi lời xin lỗi chân thành nhất về sự bất tiện do việc điều chỉnh lịch trình này gây ra. Rất mong nhận được sự thấu hiểu và thông cảm từ Anh/Chị.
      </p>

      <div class="highlight-section">
        <h3>📅 Thông tin lịch học mới của Anh/Chị:</h3>
        <table class="info-table">
          <tr>
            <td class="label">Thời gian mới:</td>
            <td class="value"><strong>Thứ Bảy, ngày 12/09/2026 (08:00 - 18:00)</strong></td>
          </tr>
          <tr>
            <td class="label">Địa điểm chốt:</td>
            <td class="value"><strong>SBB Healthcare Premium; tầng 6 - San tea house; 199 Trường Chinh - Hà Nội</strong></td>
          </tr>
        </table>
      </div>

      <p class="paragraph" style="font-size: 13.5px; color: #4b5563; font-style: italic;">
        * Chúng tôi rất hy vọng sự thay đổi này không ảnh hưởng nhiều đến kế hoạch của Anh/Chị. (Trường hợp lịch học mới không phù hợp, Anh/Chị vui lòng phản hồi email này kèm số tài khoản để BTC hoàn trả lại 100% chi phí hậu cần).
      </p>

      <p class="paragraph" style="margin-top: 25px;">
        Đặc biệt, khoảng thời gian giãn lịch này chính là <strong>cơ hội tuyệt vời để Anh/Chị rủ thêm đồng nghiệp hoặc đối tác đồng hành</strong>. Nhằm tri ân sâu sắc sự thấu hiểu và đồng hành của Anh/Chị, khi Anh/Chị giới thiệu người đăng ký mới cùng tham gia DHM8/DHM9 trong giai đoạn này, cả hai sẽ được <strong>tặng độc quyền suất tham gia chương trình huấn luyện đặc biệt của chị Hà Minh Châu:</strong>
      </p>

      <!-- Box Quà tặng Lãnh đạo Liên nhóm đặc biệt -->
      <div style="background-color: #f0fdf4; border: 1px dashed #0d9488; border-radius: 6px; padding: 20px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 15px 0; font-size: 13.5px; line-height: 1.6; color: #374151; text-align: left; font-weight: 500;">
          🔗 Anh/Chị có thể gửi trực tiếp liên kết đăng ký dưới đây đến đồng nghiệp, đối tác của mình:
        </p>
        
        <div class="cta-container">
          <a href="{LINK_HCM}" class="btn btn-hcm">Đăng Ký DHM8 - TP.HCM</a>
          <a href="{LINK_HN}" class="btn btn-hn">Đăng Ký DHM9 - Hà Nội</a>
        </div>
        
        <img src="https://delivering-happiness.vercel.app/cross_team_command_offer.jpg" alt="Cross-Team Command Offer" style="max-width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-top: 15px;" />
      </div>
      
      <p class="paragraph" style="margin-top: 25px;">
        Hẹn gặp lại Anh/Chị tại lớp học vào ngày 12/09/2026 sắp tới!
      </p>
    </div>
    
    <div class="footer">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <tr>
          <td style="vertical-align: top; padding-right: 15px;">
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #1e3a8a;">Trân trọng,</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: bold; color: #374151;">Ban tổ chức Delivering Happiness Masterclass (DHM)</p>
            <p style="margin: 2px 0 10px 0; font-size: 12px; color: #6b7280; font-style: italic;">(Hoạt động thuộc sáng kiến CultureCode)</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #0d9488; font-weight: 500;">
              🔗 <a href="https://www.linkedin.com/company/culturecodecommunity" target="_blank" style="color: #0d9488; text-decoration: none; font-weight: bold;">Cập nhật thông tin mới nhất trên LinkedIn CultureCode</a>
            </p>
          </td>
          <td style="width: 130px; text-align: right; vertical-align: top;">
            <img src="https://delivering-happiness.vercel.app/culturecode_live_club_logo.jpg" alt="CultureCode Logo" style="width: 120px; height: auto; display: block; margin-left: auto;" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>
```
