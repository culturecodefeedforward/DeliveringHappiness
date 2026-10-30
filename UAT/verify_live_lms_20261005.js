const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = 'C:\\Users\\vu.hoang\\.gemini\\antigravity\\scratch\\dh4hn-website\\UAT\\screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const TARGET_URL = 'https://delivering-happiness.vercel.app/lms/';
const USER_EMAIL = 'vuhoang2708software@gmail.com';
const USER_PASS = '1234';

const results = {
  targetUrl: TARGET_URL,
  testedAt: new Date().toISOString(),
  viewports: ['Desktop 1280x800', 'Mobile 375x812 (iPhone)'],
  cases: {},
  consoleErrors: [],
  networkStatuses: {},
  screenshots: []
};

async function runLiveUAT() {
  console.log('=== STARTING LIVE PRODUCTION LMS UAT ===');
  console.log(`Target: ${TARGET_URL}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  try {
    // -------------------------------------------------------------
    // PHASE 1: DESKTOP 1280x800
    // -------------------------------------------------------------
    console.log('\n--- PHASE 1: DESKTOP 1280x800 ---');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.error(`[BROWSER ERROR]: ${text}`);
        results.consoleErrors.push(text);
      }
    });

    page.on('pageerror', err => {
      console.error(`[PAGE ERROR]: ${err.message}`);
      results.consoleErrors.push(err.message);
    });

    page.on('response', resp => {
      const url = resp.url();
      const status = resp.status();
      if (url.includes('index.html') || url.includes('app.js') || url.includes('curriculum_data.json') || url.includes('slide_core_values_definition.jpg')) {
        results.networkStatuses[url] = status;
        console.log(`[NETWORK]: ${status} - ${url}`);
      }
    });

    console.log(`Navigating to ${TARGET_URL}...`);
    const mainResponse = await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 45000 });
    results.networkStatuses['main_page'] = mainResponse ? mainResponse.status() : 'unknown';

    // Wait until either auth modal is opened or user session is restored
    console.log('Waiting for initial bootstrap and auth state...');
    await page.waitForFunction(() => {
      const authModal = document.querySelector('#auth-modal');
      const userChip = document.querySelector('#user-chip');
      const modalOpen = authModal && !authModal.classList.contains('hidden');
      const alreadyLoggedIn = userChip && !userChip.classList.contains('hidden');
      return modalOpen || alreadyLoggedIn;
    }, { timeout: 15000 });

    const authModalNeeded = await page.evaluate(() => {
      const modal = document.querySelector('#auth-modal');
      return modal && !modal.classList.contains('hidden');
    });

    console.log(`Auth modal needs login: ${authModalNeeded}`);
    if (authModalNeeded) {
      console.log('Filling login credentials...');
      await page.waitForSelector('#login-identity', { visible: true });
      await page.type('#login-identity', USER_EMAIL);
      await page.type('#login-password', USER_PASS);
      
      console.log('Submitting login form...');
      await page.evaluate(() => {
        const btn = document.querySelector('#btn-submit-auth') || document.querySelector('#auth-form button[type="submit"]');
        if (btn) btn.click();
      });

      console.log('Waiting for auth modal to close...');
      await page.waitForFunction(() => {
        const modal = document.querySelector('#auth-modal');
        return !modal || modal.classList.contains('hidden');
      }, { timeout: 15000 });
      console.log('Login successful.');
    }

    // -------------------------------------------------------------
    // CASE 1: MODAL QUICK START (4 bước chuẩn hóa)
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 1: Modal Quick Start ---');
    console.log('Waiting for #modal-quick-start to appear...');
    await page.waitForFunction(() => {
      const m = document.querySelector('#modal-quick-start');
      return m && !m.classList.contains('hidden');
    }, { timeout: 10000 });

    const quickStartData = await page.evaluate(() => {
      const m = document.querySelector('#modal-quick-start');
      if (!m) return null;
      return {
        visible: !m.classList.contains('hidden'),
        text: m.innerText
      };
    });

    console.log(`Quick Start modal visible: ${quickStartData?.visible}`);

    const c1Screenshot = path.join(SCREENSHOT_DIR, 'case1_quick_start_modal_desktop.png');
    await page.screenshot({ path: c1Screenshot });
    results.screenshots.push(c1Screenshot);

    const step1Ok = quickStartData && quickStartData.text.includes('Buổi online') && quickStartData.text.includes('Email & 4 số cuối SĐT');
    const step2Ok = quickStartData && quickStartData.text.includes('3 Cấp độ Hạnh phúc') && quickStartData.text.includes('Giá trị cốt lõi') && quickStartData.text.includes('3 Đòn bẩy');
    const step3Ok = quickStartData && quickStartData.text.includes('Me Values');
    const step4Ok = quickStartData && (quickStartData.text.includes('≥80%') || quickStartData.text.includes('80%')) && quickStartData.text.includes('8/10') && quickStartData.text.includes('Chặng 2');
    const tipOk = quickStartData && quickStartData.text.includes('Focused Mode');

    console.log(`Step 1 text match: ${step1Ok}`);
    console.log(`Step 2 text match: ${step2Ok}`);
    console.log(`Step 3 text match: ${step3Ok}`);
    console.log(`Step 4 text match: ${step4Ok}`);
    console.log(`Tip match: ${tipOk}`);

    // Dismiss Quick Start Modal via DOM click
    await page.evaluate(() => {
      const btn = document.querySelector('#btn-quick-start-dismiss');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const quickStartDismissed = await page.evaluate(() => {
      const m = document.querySelector('#modal-quick-start');
      return m && m.classList.contains('hidden');
    });
    console.log(`Quick Start dismissed: ${quickStartDismissed}`);

    results.cases.case1 = {
      name: 'Modal Quick Start 4 bước chuẩn hóa',
      pass: !!(quickStartData && quickStartData.visible && step1Ok && step2Ok && step3Ok && step4Ok && tipOk && quickStartDismissed),
      details: { step1Ok, step2Ok, step3Ok, step4Ok, tipOk, quickStartDismissed },
      screenshot: c1Screenshot
    };

    // -------------------------------------------------------------
    // CASE 2: NÚT VIDEO TỔNG QUAN ĐỘC LẬP & LIGHTBOX MODAL
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 2: Overview Video Lightbox ---');
    const videoBtnExists = await page.evaluate(() => {
      const headerBtn = document.querySelector('#btn-header-overview-video');
      const sidebarBtn = document.querySelector('#btn-global-overview-video');
      return {
        headerBtn: !!headerBtn,
        sidebarBtn: !!sidebarBtn
      };
    });
    console.log(`Header video btn: ${videoBtnExists.headerBtn}, Sidebar video btn: ${videoBtnExists.sidebarBtn}`);

    // Click header video button
    await page.evaluate(() => {
      const btn = document.querySelector('#btn-header-overview-video');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const videoModalData = await page.evaluate(() => {
      const modal = document.querySelector('#modal-video-overview');
      if (!modal) return null;
      const isVisible = !modal.classList.contains('hidden');
      const title = modal.innerText;
      const video = modal.querySelector('video source, video');
      const src = video ? (video.getAttribute('src') || video.currentSrc) : null;
      return {
        isVisible,
        title,
        src
      };
    });

    console.log('Video Modal Data:', videoModalData);
    const c2Screenshot = path.join(SCREENSHOT_DIR, 'case2_video_lightbox_desktop.png');
    await page.screenshot({ path: c2Screenshot });
    results.screenshots.push(c2Screenshot);

    const titleOk = videoModalData && videoModalData.title.includes('Video Tổng Quan Về Delivering Happiness') && videoModalData.title.includes('7:27');
    const srcOk = videoModalData && videoModalData.src && videoModalData.src.includes('the_explainer.mp4');

    // Close video modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('#btn-close-video-overview');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const videoClosed = await page.evaluate(() => {
      const modal = document.querySelector('#modal-video-overview');
      const video = modal ? modal.querySelector('video') : null;
      const isHidden = modal && modal.classList.contains('hidden');
      const isPaused = video ? video.paused : true;
      return isHidden && isPaused;
    });
    console.log(`Video modal closed and paused: ${videoClosed}`);

    results.cases.case2 = {
      name: 'Nút Video Tổng quan Header/Sidebar & Lightbox Modal',
      pass: !!(videoBtnExists.headerBtn && videoBtnExists.sidebarBtn && videoModalData?.isVisible && titleOk && srcOk && videoClosed),
      details: { videoBtnExists, titleOk, srcOk, videoClosed },
      screenshot: c2Screenshot
    };

    // -------------------------------------------------------------
    // CASE 3: TIÊU ĐỀ SẠCH SẼ CHẶNG 1 & THANH MILESTONE 4 NẤC
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 3: Milestone Bar & Clean Lesson Titles ---');
    // Switch to tab practice
    await page.evaluate(() => {
      const btn = document.querySelector('.tab-btn[data-tab="tab-practice"]') || document.querySelector('[data-tab="tab-practice"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll Milestone bar into view so the screenshot clearly captures it
    await page.evaluate(() => {
      const bar = document.querySelector('#stage1-milestone-bar');
      if (bar) bar.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 400));

    const case3Data = await page.evaluate(() => {
      const milestoneBar = document.querySelector('#stage1-milestone-bar');
      const barText = milestoneBar ? milestoneBar.innerText : '';
      const pillLevels = document.querySelector('#m-pill-levels');
      const pillValues = document.querySelector('#m-pill-values');
      const pillDrivers = document.querySelector('#m-pill-drivers');
      const pillQuiz = document.querySelector('#m-pill-quiz');

      // Check titles of 4 modules
      const mod1 = document.querySelector('#stage1-mod-1-1')?.innerText || '';
      const mod2 = document.querySelector('#stage1-mod-1-2')?.innerText || '';
      const mod3 = document.querySelector('#stage1-mod-1-3')?.innerText || '';
      const mod4 = document.querySelector('#stage1-mod-quiz')?.innerText || document.querySelector('#stage1-mod-1-4')?.innerText || '';

      const practiceTab = document.querySelector('#tab-practice') || document.body;
      const hasOldMucLabel = practiceTab.innerHTML.includes('Mục 1.');

      return {
        barExists: !!milestoneBar,
        barText,
        pills: {
          levels: pillLevels?.innerText || '',
          values: pillValues?.innerText || '',
          drivers: pillDrivers?.innerText || '',
          quiz: pillQuiz?.innerText || ''
        },
        lesson1HasCleanTitle: mod1.includes('Bài 1.1: 3 Cấp Độ Hạnh Phúc'),
        lesson2HasCleanTitle: mod2.includes('Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân'),
        lesson3HasCleanTitle: mod3.includes('Bài 1.3: 3 Đòn Bẩy Hạnh Phúc'),
        lesson4HasCleanTitle: mod4.includes('Bài 1.4: Cổng Vượt Chặng') || mod4.includes('Cổng Vượt Chặng'),
        hasOldMucLabel
      };
    });

    console.log('Case 3 Data:', case3Data);
    const c3Screenshot = path.join(SCREENSHOT_DIR, 'case3_milestone_and_clean_titles_desktop.png');
    await page.screenshot({ path: c3Screenshot });
    results.screenshots.push(c3Screenshot);

    const milestoneTextOk = case3Data.barText.includes('Hoàn thành') && case3Data.barText.includes('/4');
    const pillsOk = case3Data.pills.levels.includes('3 Cấp Độ Hạnh Phúc') &&
                    case3Data.pills.values.includes('La Bàn Me Values') &&
                    case3Data.pills.drivers.includes('3 Đòn Bẩy Hạnh Phúc') &&
                    case3Data.pills.quiz.includes('Cổng Vượt Chặng');
    const cleanTitlesOk = case3Data.lesson1HasCleanTitle && case3Data.lesson2HasCleanTitle && case3Data.lesson3HasCleanTitle && case3Data.lesson4HasCleanTitle;
    const noMucLabel = !case3Data.hasOldMucLabel;

    results.cases.case3 = {
      name: 'Tiêu đề sạch sẽ Chặng 1 & Thanh Milestone 4 nấc',
      pass: !!(case3Data.barExists && milestoneTextOk && pillsOk && cleanTitlesOk && noMucLabel),
      details: { milestoneTextOk, pillsOk, cleanTitlesOk, noMucLabel, pills: case3Data.pills },
      screenshot: c3Screenshot
    };

    // -------------------------------------------------------------
    // CASE 4: BÀI 1.2 RENDER 2 SLIDE & SLIDE INLINE BÀI 1.1, 1.3
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 4: Lesson 1.2 Slide Definition & Inline Slides ---');
    // Open Bài 1.2 and scroll into view
    await page.evaluate(() => {
      const mod2 = document.querySelector('#stage1-mod-1-2');
      if (mod2) {
        const body = mod2.querySelector('.accordion-body');
        if (body) body.classList.remove('hidden');
        mod2.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    await new Promise(r => setTimeout(r, 800));

    const case4Data = await page.evaluate(() => {
      const mod2 = document.querySelector('#stage1-mod-1-2');
      if (!mod2) return null;

      const imgs = Array.from(mod2.querySelectorAll('img')).map(i => i.src);
      const hasDefSlide = imgs.some(src => src.includes('slide_core_values_definition.jpg'));
      const hasSlide23 = imgs.some(src => src.includes('slide_23.png'));

      // Check inline slides in 1.1 and 1.3
      const mod1 = document.querySelector('#stage1-mod-1-1');
      const mod1Imgs = Array.from(mod1?.querySelectorAll('img') || []).map(i => i.src);
      const mod1HasSlides = mod1Imgs.some(src => src.includes('slide_16')) &&
                            mod1Imgs.some(src => src.includes('slide_17')) &&
                            mod1Imgs.some(src => src.includes('slide_14'));

      const mod3 = document.querySelector('#stage1-mod-1-3');
      const mod3Imgs = Array.from(mod3?.querySelectorAll('img') || []).map(i => i.src);
      const mod3HasSlides = mod3Imgs.some(src => src.includes('slide_25')) &&
                            mod3Imgs.some(src => src.includes('slide_29')) &&
                            mod3Imgs.some(src => src.includes('slide_31')) &&
                            mod3Imgs.some(src => src.includes('slide_38'));

      return {
        hasDefSlide,
        hasSlide23,
        mod1HasSlides,
        mod3HasSlides,
        mod2Imgs: imgs
      };
    });

    console.log('Case 4 Data:', case4Data);

    // Scroll to the slides section of Bài 1.2
    await page.evaluate(() => {
      const slideImg = document.querySelector('#stage1-mod-1-2 img[src*="slide_core_values_definition"]');
      if (slideImg) slideImg.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    // Test HD modal on Bài 1.2 slide definition
    const hdModalOpened = await page.evaluate(() => {
      const mod2 = document.querySelector('#stage1-mod-1-2');
      const hdBtn = mod2 ? mod2.querySelector('button[onclick*="openInfographicModal"], button[data-hd-src], .btn-hd') : null;
      if (hdBtn) {
        hdBtn.click();
        const modal = document.querySelector('#infographic-modal');
        return modal && !modal.classList.contains('hidden');
      }
      const img = mod2 ? mod2.querySelector('img[src*="slide_core_values_definition"]') : null;
      if (img) {
        img.click();
        const modal = document.querySelector('#infographic-modal');
        return modal && !modal.classList.contains('hidden');
      }
      return false;
    });

    console.log(`HD Modal opened on click: ${hdModalOpened}`);
    if (hdModalOpened) {
      await page.evaluate(() => {
        const closeBtn = document.querySelector('#btn-close-infographic') || document.querySelector('#infographic-modal button');
        if (closeBtn) closeBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));
    }

    const c4Screenshot = path.join(SCREENSHOT_DIR, 'case4_lesson1_2_slides_desktop.png');
    await page.screenshot({ path: c4Screenshot });
    results.screenshots.push(c4Screenshot);

    results.cases.case4 = {
      name: 'Bài 1.2 render 2 slide inline & Slide inline Bài 1.1, 1.3',
      pass: !!(case4Data && case4Data.hasDefSlide && case4Data.hasSlide23 && case4Data.mod1HasSlides && case4Data.mod3HasSlides),
      details: case4Data,
      screenshot: c4Screenshot
    };

    // -------------------------------------------------------------
    // CASE 5: PHẦN 2 THỰC HÀNH CHẶNG 1 MẶC ĐỊNH THU NHỎ
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 5: Practice Accordion Collapsed & Expands ---');
    // Scroll to PHẦN 2 accordion in Bài 1.2
    await page.evaluate(() => {
      const details = document.querySelector('#stage1-mod-1-2 details.practice-accordion');
      if (details) details.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    const case5Before = await page.evaluate(() => {
      const mod2 = document.querySelector('#stage1-mod-1-2');
      const details = mod2 ? mod2.querySelector('details.practice-accordion') : null;
      if (!details) return null;
      const summary = details.querySelector('summary');
      return {
        hasDetails: true,
        isOpen: details.hasAttribute('open') && details.open,
        summaryText: summary ? summary.innerText.replace(/\s+/g, ' ').trim() : ''
      };
    });

    console.log('Case 5 Before Click:', case5Before);
    const c5BeforeScreenshot = path.join(SCREENSHOT_DIR, 'case5_accordion_collapsed_desktop.png');
    await page.screenshot({ path: c5BeforeScreenshot });
    results.screenshots.push(c5BeforeScreenshot);

    // Click summary to expand
    await page.evaluate(() => {
      const mod2 = document.querySelector('#stage1-mod-1-2');
      const summary = mod2 ? mod2.querySelector('details.practice-accordion summary') : null;
      if (summary) summary.click();
    });
    await new Promise(r => setTimeout(r, 600));

    const case5After = await page.evaluate(() => {
      const mod2 = document.querySelector('#stage1-mod-1-2');
      const details = mod2 ? mod2.querySelector('details.practice-accordion') : null;
      if (!details) return null;
      return {
        isOpen: details.hasAttribute('open') && details.open,
        hasContent: details.innerHTML.includes('I•A•M') || details.innerHTML.includes('La Bàn') || details.innerHTML.includes('giá trị')
      };
    });

    console.log('Case 5 After Click:', case5After);
    const c5AfterScreenshot = path.join(SCREENSHOT_DIR, 'case5_accordion_expanded_desktop.png');
    await page.screenshot({ path: c5AfterScreenshot });
    results.screenshots.push(c5AfterScreenshot);

    const defaultCollapsed = case5Before && !case5Before.isOpen && case5Before.summaryText.includes('PHẦN 2');
    const expandedOk = case5After && case5After.isOpen;

    results.cases.case5 = {
      name: 'PHẦN 2 thực hành Chặng 1 mặc định thu nhỏ (collapsed), mở rộng thành công',
      pass: !!(defaultCollapsed && expandedOk),
      details: { case5Before, case5After },
      screenshot: c5AfterScreenshot
    };

    await page.close();

    // -------------------------------------------------------------
    // PHASE 2: MOBILE 375x812 (IPHONE)
    // -------------------------------------------------------------
    console.log('\n--- PHASE 2: MOBILE 375x812 (IPHONE) ---');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({
      width: 375,
      height: 812,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });
    await mobilePage.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1');

    mobilePage.on('console', msg => {
      if (msg.type() === 'error') {
        results.consoleErrors.push(`[MOBILE] ${msg.text()}`);
      }
    });

    console.log(`Navigating mobile page to ${TARGET_URL}...`);
    await mobilePage.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait until either auth modal is opened or user session is restored
    console.log('Waiting for mobile auth state...');
    await mobilePage.waitForFunction(() => {
      const authModal = document.querySelector('#auth-modal');
      const userChip = document.querySelector('#user-chip');
      const modalOpen = authModal && !authModal.classList.contains('hidden');
      const alreadyLoggedIn = userChip && !userChip.classList.contains('hidden');
      return modalOpen || alreadyLoggedIn;
    }, { timeout: 15000 });

    const mobileAuthVisible = await mobilePage.evaluate(() => {
      const modal = document.querySelector('#auth-modal');
      return modal && !modal.classList.contains('hidden');
    });

    if (mobileAuthVisible) {
      console.log('Logging in on mobile...');
      await mobilePage.waitForSelector('#login-identity', { visible: true });
      await mobilePage.type('#login-identity', USER_EMAIL);
      await mobilePage.type('#login-password', USER_PASS);
      await mobilePage.evaluate(() => {
        const btn = document.querySelector('#btn-submit-auth') || document.querySelector('#auth-form button[type="submit"]');
        if (btn) btn.click();
      });
      await mobilePage.waitForFunction(() => {
        const modal = document.querySelector('#auth-modal');
        return !modal || modal.classList.contains('hidden');
      }, { timeout: 15000 });
      console.log('Mobile login complete.');
    }

    // Dismiss Quick Start if shown on mobile
    await new Promise(r => setTimeout(r, 800));
    await mobilePage.evaluate(() => {
      const btn = document.querySelector('#btn-quick-start-dismiss');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------------------------------------
    // CASE 6: DÀN NÚT DÍNH ĐÁY STICKY BOTTOM BAR TRÊN MOBILE
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 6: Sticky Bottom Bar on Mobile ---');
    const bottomBarData = await mobilePage.evaluate(() => {
      const btnRoadmap = document.querySelector('#btn-bottom-roadmap');
      const btnQuiz = document.querySelector('#btn-bottom-quiz');

      const rectRoadmap = btnRoadmap ? btnRoadmap.getBoundingClientRect() : null;
      const rectQuiz = btnQuiz ? btnQuiz.getBoundingClientRect() : null;

      const styleRoadmap = btnRoadmap ? window.getComputedStyle(btnRoadmap) : null;
      const styleQuiz = btnQuiz ? window.getComputedStyle(btnQuiz) : null;

      return {
        roadmap: {
          exists: !!btnRoadmap,
          text: btnRoadmap?.innerText || '',
          rect: rectRoadmap ? { width: rectRoadmap.width, height: rectRoadmap.height, top: rectRoadmap.top, left: rectRoadmap.left } : null,
          display: styleRoadmap ? styleRoadmap.display : 'none',
          visibility: styleRoadmap ? styleRoadmap.visibility : 'hidden'
        },
        quiz: {
          exists: !!btnQuiz,
          text: btnQuiz?.innerText || '',
          rect: rectQuiz ? { width: rectQuiz.width, height: rectQuiz.height, top: rectQuiz.top, left: rectQuiz.left } : null,
          display: styleQuiz ? styleQuiz.display : 'none',
          visibility: styleQuiz ? styleQuiz.visibility : 'hidden'
        }
      };
    });

    console.log('Mobile Bottom Bar Data:', JSON.stringify(bottomBarData, null, 2));

    const c6Screenshot = path.join(SCREENSHOT_DIR, 'case6_mobile_bottom_bar.png');
    await mobilePage.screenshot({ path: c6Screenshot });
    results.screenshots.push(c6Screenshot);

    const roadmapVisible = bottomBarData.roadmap.exists &&
                           bottomBarData.roadmap.rect &&
                           bottomBarData.roadmap.rect.width > 0 &&
                           bottomBarData.roadmap.rect.height > 0 &&
                           bottomBarData.roadmap.display !== 'none';

    const quizVisible = bottomBarData.quiz.exists &&
                        bottomBarData.quiz.rect &&
                        bottomBarData.quiz.rect.width > 0 &&
                        bottomBarData.quiz.rect.height > 0 &&
                        bottomBarData.quiz.display !== 'none';

    const roadmapHasIcon = bottomBarData.roadmap.text.includes('Lộ trình') || bottomBarData.roadmap.text.includes('📘');
    const quizHasIcon = bottomBarData.quiz.text.includes('Vượt chặng') || bottomBarData.quiz.text.includes('⚡');

    results.cases.case6 = {
      name: 'Mobile 375x812 hiển thị rõ ràng cả nút 📘 Lộ trình và ⚡ Vượt chặng ở Sticky Bottom Bar',
      pass: !!(roadmapVisible && quizVisible && roadmapHasIcon && quizHasIcon),
      details: { roadmapVisible, quizVisible, roadmapHasIcon, quizHasIcon, bottomBarData },
      screenshot: c6Screenshot
    };

    // -------------------------------------------------------------
    // CASE 7: ĐỘ SẠCH CONSOLE & NETWORK
    // -------------------------------------------------------------
    console.log('\n--- VERIFYING CASE 7: Console & Network Status ---');
    console.log('Total console errors captured:', results.consoleErrors.length);
    console.log('Network statuses captured:', results.networkStatuses);

    const staticFiles200 = Object.entries(results.networkStatuses).every(([url, status]) => {
      if (url.includes('index.html') || url.includes('app.js') || url.includes('curriculum_data.json') || url.includes('slide_core_values_definition.jpg')) {
        return status === 200 || status === 304;
      }
      return true;
    });

    results.cases.case7 = {
      name: 'Console Errors = 0, Network status 200 OK',
      pass: results.consoleErrors.length === 0 && staticFiles200,
      details: {
        consoleErrorCount: results.consoleErrors.length,
        errors: results.consoleErrors,
        networkStatuses: results.networkStatuses,
        staticFiles200
      }
    };

    await mobilePage.close();

  } catch (err) {
    console.error('Test execution failed:', err);
    results.executionError = err.message;
  } finally {
    await browser.close();
  }

  const reportPath = path.join(__dirname, 'live_uat_results_20261005.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\nResults saved to: ${reportPath}`);
  console.log('=== TEST SUMMARY ===');
  for (const [k, v] of Object.entries(results.cases)) {
    console.log(`- ${v.name}: ${v.pass ? 'PASS' : 'FAIL'}`);
  }
}

runLiveUAT();
