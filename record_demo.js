const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 414,
      height: 896
    }
  });
  
  const page = await browser.newPage();
  
  // Handle alerts so it doesn't hang
  page.on('dialog', async dialog => {
    console.log("Dialog message:", dialog.message());
    await new Promise(r => setTimeout(r, 500));
    await dialog.accept();
  });
  
  const Config = {
    followNewTab: false,
    fps: 30,
    ffmpeg_Path: null,
    videoFrame: { width: 414, height: 896 },
    aspectRatio: '9:16',
  };
  
  const recorder = new PuppeteerScreenRecorder(page, Config);
  
  console.log("Starting recording...");
  await recorder.start('demo_video.mp4');

  try {
    console.log("Navigating to page...");
    await page.goto('http://localhost:8080/personal-value.html', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    // --- STEP 1 ---
    console.log("Step 1: Selecting 8 cards...");
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 1000));
    
    // Select 8 cards as "Very Important" (tick marks)
    await page.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const cards = document.querySelectorAll('.flip-card');
      for (let i = 0; i < 8; i++) {
        const tick = cards[i].querySelector('.tick-mark');
        if (tick) tick.click();
        await sleep(400);
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click Next 1
    console.log("Clicking Next 1...");
    await page.evaluate(() => document.getElementById('btnNext1').click());
    await new Promise(r => setTimeout(r, 3000)); // Wait longer for alert to dismiss
    
    // --- STEP 2 ---
    console.log("Step 2: Selecting Top 7...");
    await page.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const topCards = document.querySelectorAll('#topValuesList .selectable-card');
      for (let i = 0; i < 7; i++) {
        if (topCards[i]) topCards[i].click();
        await sleep(400);
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click Next 2
    console.log("Clicking Next 2...");
    await page.evaluate(() => document.getElementById('btnNext2').click());
    await new Promise(r => setTimeout(r, 2000));
    
    // --- STEP 3 ---
    console.log("Step 3: Duels (21 times)...");
    for (let i = 0; i < 21; i++) {
      await page.evaluate(() => {
        // Randomly choose duelA or duelB
        const choice = Math.random() > 0.5 ? 'duelA' : 'duelB';
        const el = document.getElementById(choice);
        if(el) el.click();
      });
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Wait for Results to render
    await new Promise(r => setTimeout(r, 3000));
    
    // --- STEP 4 ---
    console.log("Step 4: Results and Form...");
    // Scroll down slowly to show results
    await page.evaluate(async () => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      window.scrollBy({ top: 300, behavior: 'smooth' });
      await sleep(1500);
      window.scrollBy({ top: 400, behavior: 'smooth' });
      await sleep(1500);
      window.scrollBy({ top: 400, behavior: 'smooth' });
      await sleep(1500);
    });
    
    // Fill the form
    await page.type('#reportName', 'Vu Hoang', {delay: 100});
    await page.type('#reportEmail', 'vuhoang@example.com', {delay: 100});
    
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Done interactions.");
  } catch (err) {
    console.error("Error during recording: ", err);
  }

  await recorder.stop();
  await browser.close();
  console.log("Recording saved to demo_video.mp4");
})();
