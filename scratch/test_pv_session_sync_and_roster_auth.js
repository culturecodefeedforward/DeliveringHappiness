const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 59999;
const ROOT_DIR = path.resolve(__dirname, '..');
const delay = ms => new Promise(r => setTimeout(r, ms));

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return map[ext] || 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const parsed = new URL(req.url, `http://localhost:${PORT}`);
        let pathname = decodeURIComponent(parsed.pathname);
        if (pathname === '/') pathname = '/index.html';
        if (pathname === '/lms' || pathname === '/lms/') pathname = '/lms/index.html';

        let target = path.join(ROOT_DIR, pathname);
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
          target = path.join(target, 'index.html');
        }

        if (!fs.existsSync(target)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
          return;
        }

        const mime = getMimeType(target);
        res.writeHead(200, {
          'Content-Type': mime,
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(target).pipe(res);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server Error: ' + err.message);
      }
    });

    server.listen(PORT, () => {
      console.log(`[Local Server] Started on http://localhost:${PORT}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

(async () => {
  let server;
  let browser;
  const testResults = [];

  function recordResult(id, name, pass, detail) {
    testResults.push({ id, name, pass, detail });
    const status = pass ? '✅ PASS' : '❌ FAIL';
    console.log(`[${status}] ${id}: ${name} - ${detail}`);
  }

  try {
    server = await startServer();
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const evidenceDir = path.resolve(ROOT_DIR, 'UAT/evidence');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

    // =========================================================================
    // TC-01: Đã đăng nhập LMS -> Bấm sang La Bàn -> Nhận diện ngay, Modal ẨN
    // =========================================================================
    console.log('\n--- Chạy TC-01: Session Sync từ LMS sang Personal Value ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      // Truy cập LMS
      await page.goto(`http://localhost:${PORT}/lms/index.html`, { waitUntil: 'domcontentloaded' });

      // Giả lập học viên đăng nhập LMS (Vũ Hoàng)
      await page.evaluate(() => {
        const mockUser = {
          learner_id: "DHM-018",
          name: "Vũ Hoàng",
          email: "vuhoang2708@gmail.com",
          phone: "0983453145",
          phone_last4: "3145",
          cohort: "BTC / Coach",
          role: "Coach",
          identity: "vuhoang2708@gmail.com"
        };
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(mockUser));
      });

      // Tải lại LMS sau khi có session
      await page.goto(`http://localhost:${PORT}/lms/index.html`, { waitUntil: 'domcontentloaded' });
      await delay(500);

      // Kiểm tra xem liên kết personal-value.html đã được gắn params chưa
      const linkHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="personal-value.html"]');
        return link ? link.getAttribute('href') : null;
      });

      const hasParams = linkHref && linkHref.includes('email=vuhoang2708%40gmail.com') && linkHref.includes('source=lms');
      recordResult('TC-01A', 'LMS Link Generation', !!hasParams, `Href: ${linkHref}`);

      // Bấm hoặc chuyển hướng sang personal-value.html
      await page.goto(`http://localhost:${PORT}/personal-value.html?email=vuhoang2708%40gmail.com&source=lms`, { waitUntil: 'domcontentloaded' });
      await delay(800);

      // Kiểm tra trạng thái modal trên personal-value.html
      const pvState = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const modalDisplay = modal ? window.getComputedStyle(modal).display : null;
        const authUser = JSON.parse(localStorage.getItem('dhm_user_auth') || 'null');
        const repName = document.getElementById('reportName')?.value || '';
        const repEmail = document.getElementById('reportEmail')?.value || '';
        return {
          modalDisplay,
          authUser,
          repName,
          repEmail
        };
      });

      const tc1Pass = pvState.modalDisplay === 'none' && pvState.authUser && pvState.authUser.status === 'verified';
      recordResult('TC-01B', 'Seamless LMS Auto-Unlock', tc1Pass, 
        `Modal display=${pvState.modalDisplay}, User=${pvState.authUser?.full_name}, Email=${pvState.authUser?.email}`);

      await page.screenshot({ path: path.join(evidenceDir, 'pv_tc01_lms_sync_unlocked.png') });
      await context.close();
    }

    // =========================================================================
    // TC-02: Khách vãng lai tra cứu Roster -> Mở khóa ngay lập tức (0s chờ)
    // =========================================================================
    console.log('\n--- Chạy TC-02: Khách vãng lai có tên trong Roster ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(`http://localhost:${PORT}/personal-value.html`, { waitUntil: 'domcontentloaded' });
      await delay(600);

      // Kiểm tra modal hiển thị 1 ô nhập ban đầu
      const initialUI = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const rosterSec = document.getElementById('agRosterSection');
        const trialSec = document.getElementById('agTrialSection');
        return {
          modalVisible: modal && window.getComputedStyle(modal).display !== 'none',
          rosterVisible: rosterSec && window.getComputedStyle(rosterSec).display !== 'none',
          trialVisible: trialSec && window.getComputedStyle(trialSec).display !== 'none'
        };
      });

      recordResult('TC-02A', 'Roster-First Initial UI', 
        initialUI.modalVisible && initialUI.rosterVisible && !initialUI.trialVisible,
        `Modal visible=${initialUI.modalVisible}, Roster visible=${initialUI.rosterVisible}, Trial hidden=${!initialUI.trialVisible}`);

      // Nhập số điện thoại của học viên Hà Ngọc Hoàn (0913503505)
      await page.type('#agIdentifier', '0913503505');
      await page.click('#agBtnVerifyRoster');

      // Chờ thông báo chào mừng & modal tự đóng
      await delay(1200);

      const verifiedState = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const authUser = JSON.parse(localStorage.getItem('dhm_user_auth') || 'null');
        return {
          modalDisplay: modal ? window.getComputedStyle(modal).display : null,
          authUser
        };
      });

      const tc2Pass = verifiedState.modalDisplay === 'none' && verifiedState.authUser?.full_name?.includes('Hoàn');
      recordResult('TC-02B', 'Roster-First 0s Unlock', tc2Pass,
        `Modal display=${verifiedState.modalDisplay}, Learner=${verifiedState.authUser?.full_name}, Phone=${verifiedState.authUser?.phone}`);

      await page.screenshot({ path: path.join(evidenceDir, 'pv_tc02_roster_found_unlocked.png') });
      await context.close();
    }

    // =========================================================================
    // TC-03: Khách vãng lai KHÔNG có tên trong Roster -> Hiện Fallback Trial Form
    // =========================================================================
    console.log('\n--- Chạy TC-03: Khách vãng lai KHÔNG có tên trong Roster ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      await page.goto(`http://localhost:${PORT}/personal-value.html`, { waitUntil: 'domcontentloaded' });
      await delay(600);

      // Nhập email không tồn tại trong danh bạ
      await page.type('#agIdentifier', 'unknown_guest_2026@dhm.example.com');
      await page.click('#agBtnVerifyRoster');

      await delay(600);

      // Kiểm tra chuyển đổi sang Fallback Trial
      const fallbackUI = await page.evaluate(() => {
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

      const tc3Pass = fallbackUI.modalVisible && fallbackUI.rosterHidden && fallbackUI.trialVisible && fallbackUI.emailPrefilled === 'unknown_guest_2026@dhm.example.com';
      recordResult('TC-03A', 'Trial Fallback Trigger & Prefill', tc3Pass,
        `Trial visible=${fallbackUI.trialVisible}, Email prefilled=${fallbackUI.emailPrefilled}`);

      // Bấm nút quay lại tra cứu Roster
      await page.click('#agBtnBackToRoster');
      await delay(300);

      const backUI = await page.evaluate(() => {
        const rosterSec = document.getElementById('agRosterSection');
        const trialSec = document.getElementById('agTrialSection');
        return {
          rosterVisible: rosterSec && window.getComputedStyle(rosterSec).display !== 'none',
          trialHidden: trialSec && window.getComputedStyle(trialSec).display === 'none'
        };
      });

      recordResult('TC-03B', 'Back to Roster Navigation', backUI.rosterVisible && backUI.trialHidden,
        `Roster restored=${backUI.rosterVisible}, Trial hidden=${backUI.trialHidden}`);

      await page.screenshot({ path: path.join(evidenceDir, 'pv_tc03_trial_fallback_form.png') });
      await context.close();
    }

    // =========================================================================
    // TC-04: URL Direct Param from LMS (Chế độ phòng thủ Partitioned Storage)
    // =========================================================================
    console.log('\n--- Chạy TC-04: Direct URL Param bypass ---');
    {
      const context = await browser.createIncognitoBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      // Vào thẳng trang La Bàn bằng link gắn query param của Hà Minh Châu
      await page.goto(`http://localhost:${PORT}/personal-value.html?email=chauhm71%40gmail.com&source=lms`, { waitUntil: 'domcontentloaded' });
      await delay(800);

      const directState = await page.evaluate(() => {
        const modal = document.getElementById('authGateModal');
        const authUser = JSON.parse(localStorage.getItem('dhm_user_auth') || 'null');
        return {
          modalDisplay: modal ? window.getComputedStyle(modal).display : null,
          authUser
        };
      });

      const tc4Pass = directState.modalDisplay === 'none' && directState.authUser?.full_name?.includes('Châu');
      recordResult('TC-04', 'Direct LMS Query Param Verification', tc4Pass,
        `Modal display=${directState.modalDisplay}, User=${directState.authUser?.full_name}`);

      await page.screenshot({ path: path.join(evidenceDir, 'pv_tc04_direct_lms_param.png') });
      await context.close();
    }

  } catch (error) {
    console.error('Lỗi thực thi test:', error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) {
      await new Promise(r => server.close(r));
      console.log('[Local Server] Closed.');
    }
  }

  // Tóm tắt kết quả kiểm thử
  console.log('\n====================================================');
  console.log('=== KẾT QUẢ KIỂM THỬ UAT PUPPETEER CỤC BỘ ===');
  console.log('====================================================');
  const allPassed = testResults.length > 0 && testResults.every(r => r.pass);
  testResults.forEach(r => {
    console.log(`${r.pass ? '✅' : '❌'} [${r.id}] ${r.name}: ${r.detail}`);
  });
  console.log(`\nTỔNG KẾT: ${testResults.filter(r => r.pass).length}/${testResults.length} tests PASS (${allPassed ? '100%' : 'CÓ LỖI'})`);

  if (!allPassed) {
    process.exit(1);
  }
})();
