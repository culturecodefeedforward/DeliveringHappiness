const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  
  if (!fs.existsSync('UAT/screenshots')) {
    fs.mkdirSync('UAT/screenshots', { recursive: true });
  }

  const page = await browser.newPage();
  
  // 1. Desktop - personal-value.html
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8000/personal-value.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'UAT/screenshots/personal_value_desktop.png' });
  
  // Click Bổ sung giá trị
  await page.click('#btnAddCustom');
  await page.waitForSelector('#customValueModal.active', { visible: true });
  
  // Check focus (should be on customValueName)
  let activeId = await page.evaluate(() => document.activeElement.id);
  console.log(`Focus after opening customValueModal: ${activeId} (expected: customValueName)`);
  
  await page.screenshot({ path: 'UAT/screenshots/custom_value_modal.png' });
  
  // Press Escape
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#customValueModal').classList.contains('active'));
  activeId = await page.evaluate(() => document.activeElement.id);
  console.log(`Focus after closing customValueModal: ${activeId} (expected: btnAddCustom)`);

  // 2. Mobile - personal-value.html
  await page.setViewport({ width: 375, height: 667 });
  // scroll down a bit
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.screenshot({ path: 'UAT/screenshots/personal_value_mobile.png' });

  // 3. Desktop - index.html
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle0' });
  await page.click('#btn-abcde-chat');
  await page.waitForSelector('#abcdeChatModal.abcde-active', { visible: true });
  await page.screenshot({ path: 'UAT/screenshots/abcde_chat_modal.png' });
  
  // Press Escape
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#abcdeChatModal').classList.contains('abcde-active'));
  activeId = await page.evaluate(() => document.activeElement.id);
  console.log(`Focus after closing ABCDE chat: ${activeId} (expected: btn-abcde-chat)`);

  await browser.close();
  console.log('UAT Script completed successfully!');
})();
