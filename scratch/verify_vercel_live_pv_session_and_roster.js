const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const delay = ms => new Promise(r => setTimeout(r, ms));
const LIVE_BASE_URL = 'https://delivering-happiness.vercel.app';

(async () => {
  console.log('====================================================');
  console.log('=== BẮT ĐẦU KIỂM THỬ LIVE VERCEL PRODUCTION ===');
  console.log('Target:', LIVE_BASE_URL);
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const testResults = [];
  function recordResult(id, name, pass, detail) {
    testResults.push({ id, name, pass, detail });
    const status = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`[${status}] ${id}: ${name} - ${detail}`);
  }

  const evidenceDir = path.resolve(__dirname, '../UAT/evidence');
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

  try {
    // -------------------------------------------------------------------------
    // TC-LIVE-01: Auto-Unlock khi có param từ LMS
    // -------------------------------------------------------------------------
    console.log('\n--- Chạy TC-LIVE-01: Direct Param Unlock ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      const targetUrl = `${LIVE_BASE_URL}/personal-value.html?email=vuhoang2708%40gmail.com&source=lms`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
      await delay(1500);

      const state = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const modalDisplay = modal ? window.getComputedStyle(modal).display : null;
        const authUser = JSON.parse(localStorage.getItem('dhm_user_auth') || 'null');
        return { modalDisplay, authUser };
      });

      const pass = state.modalDisplay === 'none' && state.authUser && state.authUser.status === 'verified';
      recordResult('TC-LIVE-01', 'Live LMS Auto-Unlock', pass,
        `Modal display=${state.modalDisplay}, User=${state.authUser?.full_name}`);

      await page.screenshot({ path: path.join(evidenceDir, 'live_pv_tc01_unlocked.png') });
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TC-LIVE-02: Roster 0s Unlock trên Live Vercel
    // -------------------------------------------------------------------------
    console.log('\n--- Chạy TC-LIVE-02: Roster 0s Unlock ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(`${LIVE_BASE_URL}/personal-value.html`, { waitUntil: 'domcontentloaded' });
      await delay(1000);

      await page.type('#agIdentifier', '0913503505');
      await page.click('#agBtnVerifyRoster');
      await delay(1800);

      const state = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const modalDisplay = modal ? window.getComputedStyle(modal).display : null;
        const authUser = JSON.parse(localStorage.getItem('dhm_user_auth') || 'null');
        return { modalDisplay, authUser };
      });

      const pass = state.modalDisplay === 'none' && state.authUser?.full_name?.includes('Hoàn');
      recordResult('TC-LIVE-02', 'Live Roster 0s Unlock', pass,
        `Modal display=${state.modalDisplay}, Learner=${state.authUser?.full_name}`);

      await page.screenshot({ path: path.join(evidenceDir, 'live_pv_tc02_roster_unlocked.png') });
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TC-LIVE-03: Trial Fallback trên Live Vercel
    // -------------------------------------------------------------------------
    console.log('\n--- Chạy TC-LIVE-03: Trial Fallback ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(`${LIVE_BASE_URL}/personal-value.html`, { waitUntil: 'domcontentloaded' });
      await delay(1000);

      await page.type('#agIdentifier', 'guest_live_test_2026@dhm.example.com');
      await page.click('#agBtnVerifyRoster');
      await delay(1000);

      const state = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const rosterSec = document.getElementById('agRosterSection');
        const trialSec = document.getElementById('agTrialSection');
        const emailVal = document.getElementById('agEmail')?.value || '';
        return {
          modalVisible: modal && window.getComputedStyle(modal).display !== 'none',
          rosterHidden: rosterSec && window.getComputedStyle(rosterSec).display === 'none',
          trialVisible: trialSec && window.getComputedStyle(trialSec).display !== 'none',
          emailPrefilled: emailVal
        };
      });

      const pass = state.modalVisible && state.rosterHidden && state.trialVisible && state.emailPrefilled.includes('guest_live_test');
      recordResult('TC-LIVE-03', 'Live Trial Fallback Form', pass,
        `Trial visible=${state.trialVisible}, Email prefilled=${state.emailPrefilled}`);

      await page.screenshot({ path: path.join(evidenceDir, 'live_pv_tc03_trial_form.png') });
      await context.close();
    }

  } catch (err) {
    console.error('Lỗi kiểm thử Live:', err);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('=== KẾT QUẢ KIỂM THỬ LIVE VERCEL PRODUCTION ===');
  console.log('====================================================');
  testResults.forEach(r => {
    console.log(`${r.pass ? '✅' : '❌'} [${r.id}] ${r.name}: ${r.detail}`);
  });
  const allPassed = testResults.length > 0 && testResults.every(r => r.pass);
  console.log(`\nTỔNG KẾT LIVE: ${testResults.filter(r => r.pass).length}/${testResults.length} tests PASS (${allPassed ? '100%' : 'CÓ LỖI'})`);
  if (!allPassed) process.exit(1);
})();
