const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotsDir = path.resolve(__dirname, '../');
  
  // 1. Desktop Test
  console.log('--- DESKTOP (1440x900) ---');
  const browser = await chromium.launch({ headless: true });
  let context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    timezoneId: 'Asia/Bangkok'
  });
  let page = await context.newPage();
  
  const url = 'https://docs.google.com/forms/d/e/1FAIpQLSeu-kqX2v7Pmse8rNvbxqluV9oHHPXBFwjzsEqKfq9pcwrieQ/viewform';
  console.log('Navigating to form...');
  
  let networkErrors = [];
  let consoleErrors = [];
  
  page.on('console', msg => {
      if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
      }
  });
  page.on('response', response => {
      if (response.status() >= 400 && response.status() < 600) {
          networkErrors.push(`${response.status()} ${response.url()}`);
      }
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  
  // Verify no redirect to login
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);
  if (currentUrl.includes('accounts.google.com') || currentUrl.includes('ServiceLogin')) {
      console.log('[ERROR] Redirected to Google Sign-in');
  } else {
      console.log('[OK] No redirect to Google Sign-in');
  }
  
  // Wait a bit just in case
  await page.waitForTimeout(2000);
  
  // Get text content to verify elements
  const pageText = await page.content();
  if (pageText.includes('Delivering Happiness — Feedback Hub')) {
      console.log('[OK] Has Title');
  } else {
      console.log('[ERROR] Missing Title');
  }
  
  if (pageText.includes('Sản phẩm/module') && pageText.includes('Loại phản hồi')) {
      console.log('[OK] Has required fields (Sản phẩm/module, Loại phản hồi)');
  } else {
      console.log('[ERROR] Missing required fields');
  }
  
  if (pageText.includes('Liên kết ảnh chụp màn hình (không bắt buộc)')) {
      console.log('[OK] Image field is text/link, not File upload');
  } else {
      console.log('[ERROR] Missing link field');
  }

  // Ensure no upload elements
  const fileInputs = await page.locator('input[type="file"]').count();
  if (fileInputs === 0) {
      console.log('[OK] No file upload elements found');
  } else {
      console.log('[ERROR] Found file upload element');
  }

  await page.screenshot({ path: path.join(screenshotsDir, 'gemini_desktop_form.png'), fullPage: true });
  console.log('Desktop Screenshot saved.');
  
  await context.close();
  
  // 2. Mobile Test
  console.log('--- MOBILE (390x844) ---');
  context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    timezoneId: 'Asia/Bangkok',
    isMobile: true,
    hasTouch: true,
  });
  page = await context.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle' });
  const mobileUrl = page.url();
  console.log('Mobile Current URL:', mobileUrl);
  if (mobileUrl.includes('accounts.google.com')) {
      console.log('[ERROR] Mobile redirected to Google Sign-in');
  } else {
      console.log('[OK] Mobile No redirect to Google Sign-in');
  }
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, 'gemini_mobile_form.png'), fullPage: true });
  console.log('Mobile Screenshot saved.');
  
  console.log('--- ERRORS ---');
  console.log('Console Errors:', consoleErrors);
  console.log('Network Errors:', networkErrors);

  await context.close();
  await browser.close();
})();
