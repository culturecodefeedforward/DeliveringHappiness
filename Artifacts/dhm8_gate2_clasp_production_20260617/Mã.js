function doPost(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = "DHM8_Data"; // Tên Tab mới sẽ lưu dữ liệu sạch
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  // Tự động tạo Tab mới và chèn tiêu đề (Headers) nếu Tab chưa tồn tại
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    var headers = [
      "Timestamp", "Họ và tên", "Email", "Số điện thoại", "Linkedin", 
      "Tên công ty", "Chức danh", "Quy mô công ty", "Nguồn biết đến chương trình", 
      "Chương trình đã tham gia", "Mục đích tham gia", "Mức độ tìm hiểu DH", 
      "03 điều mong đợi", "Tên người giới thiệu", "SĐT người giới thiệu", 
      "Payment Status", "Event ID"
    ];
    sheet.appendRow(headers);
    sheet.getRange("A1:Q1").setFontWeight("bold").setBackground("#fff2cc");
    sheet.setFrozenRows(1); // Cố định dòng tiêu đề
  }

  var securityToken = "DHM8_SECURE_2026";

  try {
    // ---------------------------------------------------------------------
    // LUỒNG 1: XỬ LÝ WEBHOOK TỪ SEPAY BẮN VỀ (TỰ ĐỘNG GẠCH NỢ)
    // ---------------------------------------------------------------------
    if (e.parameter.source === "sepay") {
      if (e.parameter.token !== securityToken) {
        return ContentService.createTextOutput(JSON.stringify({success: false, message: "Invalid Token"})).setMimeType(ContentService.MimeType.JSON);
      }

      var sepayData = JSON.parse(e.postData.contents);
      var amountIn = parseInt(sepayData.transferAmount || sepayData.amountIn || 0);
      var content = (sepayData.transferContent || sepayData.transactionContent || "").toUpperCase();

      if (amountIn > 0) {
        var dataRange = sheet.getDataRange();
        var values = dataRange.getValues();
        var phoneColIndex = 3; // Cột D (Số điện thoại) - Array index là 3
        var statusColIndex = 15; // Cột P (Payment Status) - Array index là 15

        for (var i = 1; i < values.length; i++) { 
          var rowPhone = values[i][phoneColIndex] ? values[i][phoneColIndex].toString().trim() : "";
          
          // Dò tìm số điện thoại trong nội dung chuyển khoản
          if (rowPhone && rowPhone.length >= 8 && content.indexOf(rowPhone) !== -1) {
            sheet.getRange(i + 1, statusColIndex + 1).setValue("Confirmed - " + amountIn + "đ (" + sepayData.gateway + ")");
            break; 
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({success: true, message: "Webhook Processed"})).setMimeType(ContentService.MimeType.JSON);
    }

    // ---------------------------------------------------------------------
    // LUỒNG 2: XỬ LÝ FORM ĐĂNG KÝ TỪ WEBSITE ĐỔ VỀ
    // ---------------------------------------------------------------------
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),                             // A: Timestamp
      data.fullName || "",                    // B: Họ và tên
      data.email || "",                       // C: Email
      data.phone || "",                       // D: Số điện thoại
      data.linkedin || "",                    // E: Linkedin
      data.company || "",                     // F: Tên công ty
      data.jobTitle || "",                    // G: Chức danh
      data.companySize || "",                 // H: Quy mô công ty
      data.sourceHearing || "",               // I: Nguồn biết đến chương trình
      data.attendedPrograms || "Chưa tham gia", // J: Chương trình đã tham gia
      data.purpose || "",                     // K: Mục đích tham gia
      data.happinessKnowledge || "",          // L: Mức độ tìm hiểu DH
      data.expectations || "",                // M: 03 điều mong đợi
      data.referrerName || "",                // N: Tên người giới thiệu
      data.referrerPhone || "",               // O: SĐT người giới thiệu
      data.paymentStatus || "Pending",        // P: Trạng thái thanh toán
      data.event_id || "DHM8_REG_040726"      // Q: Mã event
    ]);

    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
                         
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
