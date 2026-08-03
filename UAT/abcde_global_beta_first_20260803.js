const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const evidenceDir = path.join(__dirname, 'abcde-global-beta-first-20260803');
fs.mkdirSync(evidenceDir, { recursive: true });

const result = {
  generatedAt: new Date().toISOString(),
  target: process.env.ABCDE_UAT_BASE_URL || 'local-static-server',
  requests: [],
  checks: [],
  status: 'FAILED'
};

function assertCheck(condition, id, detail) {
  result.checks.push({ id, passed: Boolean(condition), detail });
  if (!condition) throw new Error(`${id}: ${detail}`);
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' })[ext]
    || 'application/octet-stream';
}

async function startLocalServer() {
  let ragFailure = false;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (req.method === 'POST' && url.pathname.startsWith('/api/chat-abcde')) {
      let raw = '';
      req.on('data', chunk => { raw += chunk; });
      req.on('end', () => {
        const body = raw ? JSON.parse(raw) : {};
        result.requests.push({ path: url.pathname, action: body.action, state: body.state || null, chatVersion: body.chatVersion || null });
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (body.action === 'verify_passcode') {
          res.end(JSON.stringify({ success: true }));
          return;
        }
        if (url.pathname === '/api/chat-abcde-rag' && ragFailure) {
          res.statusCode = 503;
          res.end(JSON.stringify({ success: false, message: 'RAG canary failure' }));
          return;
        }
        if (body.action === 'submit') {
          res.end(JSON.stringify({ success: true }));
          return;
        }
        const nextStates = { STEP_A: 'STEP_B', STEP_B: 'STEP_C', STEP_C: 'STEP_D', STEP_D: 'STEP_E', STEP_E: 'SUBMIT' };
        res.end(JSON.stringify({ success: true, reply: 'Phản hồi kiểm thử.', nextState: nextStates[body.state] || body.state }));
      });
      return;
    }

    const relative = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    const filePath = path.resolve(root, relative);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    res.setHeader('Content-Type', contentType(filePath));
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    failRag() { ragFailure = true; },
    recoverRag() { ragFailure = false; },
    close() { return new Promise(resolve => server.close(resolve)); }
  };
}

async function unlockBetaPanel(page) {
  await page.click('#btn-abcde-chat');
  await page.waitForSelector('#passcodeInput', { visible: true });
  await page.type('#passcodeInput', 'ABCDE');
  await page.click('#btnSubmitPasscode');
  await page.waitForSelector('#btnStartPractice', { visible: true });
}

async function run() {
  const local = process.env.ABCDE_UAT_BASE_URL ? null : await startLocalServer();
  const baseUrl = process.env.ABCDE_UAT_BASE_URL || local.baseUrl;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const autoOpened = await page.$eval('#abcdeChatModal', el => el.classList.contains('abcde-active')).catch(() => false);
    assertCheck(!autoOpened, 'UI-01', 'Modal không tự mở trên landing page.');

    await page.click('#btn-abcde-chat');
    await page.waitForSelector('#passcodeInput', { visible: true });
    assertCheck(Boolean(await page.$('#passcodeInput')) && !await page.$('#btnStartPractice'), 'UI-02', 'Passcode chặn luồng trước Beta-primary.');
    await page.type('#passcodeInput', 'ABCDE');
    await page.click('#btnSubmitPasscode');
    await page.waitForSelector('#btnStartPractice', { visible: true });
    const panel = await page.$('.abcde-beta-primary');
    const versionRadios = await page.$$('input[name="abcdeVersion"]');
    const fallbackCopy = await page.$eval('.abcde-beta-fallback-note', el => el.textContent);
    assertCheck(Boolean(panel), 'UI-03A', 'Có thẻ Beta-primary sau passcode.');
    assertCheck(versionRadios.length === 0, 'UI-03B', 'Không còn selector Stable/Beta.');
    assertCheck(/ổn định/i.test(fallbackCopy), 'UI-03C', 'Copy nói rõ Stable chỉ xuất hiện khi Beta lỗi.');
    await page.screenshot({ path: path.join(evidenceDir, 'desktop-beta-primary.png'), fullPage: true });

    await page.click('#btnStartPractice');
    await page.waitForSelector('#abcdeInput', { visible: true });
    await page.type('#abcdeInput', 'Tình huống kiểm thử A');
    await page.click('#abcdeSendBtn');
    await page.waitForFunction(() => document.body.innerText.includes('Phản hồi kiểm thử.'));
    assertCheck(result.requests.some(item => item.path === '/api/chat-abcde-rag' && item.action === 'chat'), 'UI-04', 'Tin nhắn đầu tiên đi qua RAG endpoint.');

    if (local) {
      local.failRag();
      await page.type('#abcdeInput', 'Tình huống kiểm thử fallback');
      await page.click('#abcdeSendBtn');
      await page.waitForSelector('#btnFallbackToStable', { visible: true });
      assertCheck(Boolean(await page.$('#btnFallbackToStable')), 'UI-05A', 'Beta 503 hiển thị Stable fallback.');
      await page.click('#btnFallbackToStable');
      await page.waitForFunction(() => document.body.innerText.includes('Đã chuyển sang Bản ổn định'));
      assertCheck(result.requests.some(item => item.path === '/api/chat-abcde' && item.action === 'chat'), 'UI-05B', 'Fallback gửi lại tin nhắn qua Stable endpoint.');
      await page.screenshot({ path: path.join(evidenceDir, 'desktop-stable-fallback.png'), fullPage: true });
    }

    await page.keyboard.press('Escape');
    const closed = await page.$eval('#abcdeChatModal', el => !el.classList.contains('abcde-active'));
    const focusReturned = await page.$eval('#btn-abcde-chat', el => document.activeElement === el);
    assertCheck(closed && focusReturned, 'UI-07', 'Escape đóng modal và trả focus về nút mở.');

    if (local) {
      local.recoverRag();
      const submitPage = await browser.newPage();
      await submitPage.setViewport({ width: 1440, height: 900 });
      await submitPage.goto(baseUrl, { waitUntil: 'networkidle0' });
      await unlockBetaPanel(submitPage);
      await submitPage.click('#btnStartPractice');
      for (const answer of ['A kiểm thử', 'B kiểm thử', 'C kiểm thử', 'D kiểm thử', 'E kiểm thử']) {
        await submitPage.waitForSelector('#abcdeInput:not([disabled])', { visible: true });
        const aiMessageCount = await submitPage.$$eval('.abcde-message-ai', elements => elements.length);
        await submitPage.type('#abcdeInput', answer);
        await submitPage.click('#abcdeSendBtn');
        await submitPage.waitForFunction(count => document.querySelectorAll('.abcde-message-ai').length > count, {}, aiMessageCount);
      }
      await submitPage.waitForSelector('#btnSubmitPractice', { visible: true });
      await submitPage.type('#studentName', 'UAT Local');
      await submitPage.type('#studentEmail', 'uat@example.com');
      await submitPage.click('#btnSubmitPractice');
      await submitPage.waitForFunction(() => document.body.innerText.includes('Báo cáo ABCDE đã được gửi thành công'));
      const submitRequest = result.requests.find(item => item.action === 'submit');
      assertCheck(Boolean(submitRequest) && submitRequest.chatVersion === 'beta', 'UI-08', 'Submit giữ chatVersion=beta trong payload hiện hành.');
    }

    const mobile = await browser.newPage();
    await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await mobile.goto(baseUrl, { waitUntil: 'networkidle0' });
    await unlockBetaPanel(mobile);
    const mobileLayout = await mobile.$eval('.abcde-beta-primary', el => ({
      right: el.getBoundingClientRect().right,
      viewport: document.documentElement.clientWidth,
      buttonHeight: document.querySelector('#btnStartPractice').getBoundingClientRect().height
    }));
    assertCheck(mobileLayout.right <= mobileLayout.viewport && mobileLayout.buttonHeight >= 44, 'UI-06', 'Mobile không tràn và nút đạt 44px.');
    await mobile.screenshot({ path: path.join(evidenceDir, 'mobile-beta-primary.png'), fullPage: true });

    result.status = 'VERIFIED';
  } finally {
    await browser.close();
    if (local) await local.close();
  }
}

run()
  .catch(error => {
    result.error = error.stack || String(error);
    process.exitCode = 1;
  })
  .finally(() => {
    fs.writeFileSync(path.join(evidenceDir, 'local-browser-result.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(result, null, 2));
  });
