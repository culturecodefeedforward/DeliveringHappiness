const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    timezoneId: 'Asia/Bangkok'
  });
  const page = await context.newPage();
  
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform?usp=publish-editor';
  console.log('Navigating to form...');
  await page.goto(url, { waitUntil: 'networkidle' });

  // Function to click radio or checkbox by exact name
  const clickOptionText = async (optionText) => {
      console.log(`Clicking option exact text: ${optionText}`);
      try {
          // Google forms often use role="radio" with name being the option text
          await page.getByRole('radio', { name: optionText, exact: true }).click({ timeout: 5000 });
      } catch(e) {
          try {
             await page.getByRole('checkbox', { name: optionText, exact: true }).click({ timeout: 5000 });
          } catch(e2) {
             // Fallback to div containing the text
             await page.locator(`div`).filter({ hasText: new RegExp(`^${optionText}$`) }).first().click();
          }
      }
  }

  // Function to fill text input by question title
  const fillInput = async (questionPrefix, value) => {
    console.log(`Filling input for: ${questionPrefix}`);
    // Find the container for the question
    const questionContainer = page.locator('div[role="listitem"]').filter({ hasText: new RegExp(questionPrefix, 'i') });
    
    // Find the text input or textarea within this container
    const input = questionContainer.locator('input[type="text"], textarea').first();
    await input.fill(value);
  };

  try {
    // Wait for the form to be visible
    await page.waitForSelector('div[role="listitem"]');

    await clickOptionText('ABCDE');
    await clickOptionText('Báo lỗi');
    await clickOptionText('Khó dùng');
    await clickOptionText('Bản thử nghiệm có tri thức lớp học (RAG Beta)');
    await clickOptionText('D');
    
    await fillInput('Tiêu đề ngắn', 'Bước D trả lời quá chung chung');
    await fillInput('Mô tả chi tiết', 'Đây là tình huống giả lập để kiểm tra luồng feedback. Tôi nhập một tình huống về cuộc họp bị trễ deadline. Ở bước D, tôi cung cấp bằng chứng: “Đã nhắc qua email ba lần nhưng chưa nhận phản hồi”. Kết quả quan sát: câu hỏi phản biện vẫn dùng khung chung và chưa bám vào bằng chứng này. Kết quả mong đợi: bước D tóm tắt bằng chứng đã nhập và đặt một câu hỏi phản biện cụ thể hơn cho tình huống.');
    
    await clickOptionText('Không cần liên hệ lại');

    console.log('Taking screenshot before submit...');
    await page.screenshot({ path: '../screenshot_before_submit.png', fullPage: true });

    console.log('Submitting form...');
    // Google Forms may normalize the Vietnamese label differently by locale; use the submit control's stable jsname.
    await page.locator('div[role="button"][jsname="M2UYVd"]').click();

    await page.waitForNavigation({ waitUntil: 'networkidle' });
    
    console.log('Taking screenshot after submit...');
    await page.screenshot({ path: '../screenshot_after_submit.png' });
    
    console.log('Test completed successfully');
  } catch (e) {
    console.error('Error during test execution:', e);
    await page.screenshot({ path: '../screenshot_error.png', fullPage: true });
    
    // Also dump the html for debugging
    const html = await page.content();
    fs.writeFileSync('../error_page.html', html);
  }

  await browser.close();
})();
