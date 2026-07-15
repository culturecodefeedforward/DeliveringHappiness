const puppeteer = require('C:\\Users\\vu.hoang\\.gemini\\config\\skills\\chrome-devtools\\scripts\\node_modules\\puppeteer');
const fs = require('fs');
const path = require('path');

async function runUAT() {
  console.log('Starting UAT for Delivering Happiness Personal Value secure ship...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const uatDir = 'C:\\Users\\vu.hoang\\.gemini\\antigravity\\scratch\\dh4hn-website\\UAT';
  if (!fs.existsSync(uatDir)) {
    fs.mkdirSync(uatDir, { recursive: true });
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Handle javascript dialogs (alerts)
  page.on('dialog', async dialog => {
    console.log(`Accepted dialog: ${dialog.message()}`);
    await dialog.accept();
  });

  // Log page errors
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.toString());
  });

  page.on('console', msg => {
    console.log('PAGE CONSOLE:', msg.text());
  });

  // 1. Go to local URL
  console.log('Navigating to live production URL...');
  await page.goto('https://delivering-happiness.vercel.app/personal-value.html', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot of step 1 grid
  await page.screenshot({ path: path.join(uatDir, 'step1_grid.png'), fullPage: true });
  console.log('Saved: step1_grid.png');

  // 2. Select 8 cards (very important)
  console.log('Selecting 8 "Very Important" cards...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.flip-card'));
    for (let i = 0; i < 8; i++) {
      const tick = cards[i].querySelector('.tick-mark');
      if (tick) tick.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(uatDir, 'step1_selected_8.png') });
  console.log('Saved: step1_selected_8.png');

  // 3. Click Next to Step 2
  console.log('Proceeding to Step 2...');
  await page.click('#btnNext1');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(uatDir, 'step2_filter.png') });
  console.log('Saved: step2_filter.png');

  // 4. Test dynamic back button from Step 2 to Step 1
  console.log('Testing Back Button from Step 2...');
  await page.click('.back-btn');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(uatDir, 'step1_after_back.png'), fullPage: true });
  console.log('Saved: step1_after_back.png. Verify selected count is still 8.');

  // Go back to Step 2
  console.log('Proceeding back to Step 2...');
  await page.click('#btnNext1');
  await new Promise(r => setTimeout(r, 1000));

  // 5. Select exactly 7 cards to proceed
  console.log('Selecting exactly 7 cards in Step 2...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.selectable-card'));
    for (let i = 0; i < 7; i++) {
      if (cards[i]) cards[i].click();
    }
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(uatDir, 'step2_exactly_7.png') });
  console.log('Saved: step2_exactly_7.png');

  // 6. Click Next to Step 3 (Duel)
  console.log('Proceeding to Step 3...');
  await page.click('#btnNext2');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(uatDir, 'step3_duel.png') });
  console.log('Saved: step3_duel.png');

  // Test dynamic back button from Step 3 to Step 2
  console.log('Testing Back Button from Step 3...');
  await page.click('.back-btn');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(uatDir, 'step2_after_back.png') });
  console.log('Saved: step2_after_back.png. Verify selected count is still 7.');

  // Go back to Step 3
  console.log('Proceeding back to Step 3...');
  await page.click('#btnNext2');
  await new Promise(r => setTimeout(r, 1000));

  // 7. Simulating the 21 duel choices
  console.log('Simulating 21 duel choices...');
  for (let i = 0; i < 21; i++) {
    await page.click('#duelA');
    await new Promise(r => setTimeout(r, 150));
  }
  await new Promise(r => setTimeout(r, 1500)); // wait for Chart.js animation
  
  // 8. Capture Step 4 Results before submission
  await page.screenshot({ path: path.join(uatDir, 'step4_results.png'), fullPage: true });
  console.log('Saved: step4_results.png');

  // 9. Solve CAPTCHA and submit report
  console.log('Solving CAPTCHA and submitting...');
  const captchaText = await page.evaluate(() => {
    return document.getElementById('captchaQuestion').innerText;
  });
  console.log('Captcha Text on page:', captchaText);
  const match = captchaText.match(/(\d+)\s*\+\s*(\d+)/);
  if (match) {
    const sum = parseInt(match[1]) + parseInt(match[2]);
    console.log(`Calculated sum: ${match[1]} + ${match[2]} = ${sum}`);
    await page.type('#reportName', 'Nguyen Van Test UAT');
    await page.type('#reportEmail', 'vuhoang2708@gmail.com');
    await page.type('#reportCaptcha', sum.toString());
    await page.screenshot({ path: path.join(uatDir, 'step4_form_filled.png') });
    console.log('Saved: step4_form_filled.png');

    console.log('Submitting form...');
    await page.click('#btnSendReportEmail');
    await new Promise(r => setTimeout(r, 5000)); // wait for JSONP response
    await page.screenshot({ path: path.join(uatDir, 'step4_after_submit.png'), fullPage: true });
    console.log('Saved: step4_after_submit.png');
  } else {
    console.error('Failed to match CAPTCHA numbers!');
  }

  await browser.close();
  console.log('UAT completed successfully!');
}

runUAT().catch(err => {
  console.error('UAT failed:', err);
  process.exit(1);
});
