'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const reportPath = path.join(__dirname, 'program_interest_phase1_20260718.md');
const browserJsonPath = path.join(__dirname, 'program_interest_phase1_browser_20260718.json');
const screenshotDir = path.join(__dirname, 'screenshots', 'program_interest_phase1_20260718');
fs.mkdirSync(screenshotDir, { recursive: true });
const checks = [];
const browserEvidence = [];
function check(surface, name, ok, evidence, detail = '') {
  checks.push({ surface, name, status: ok ? 'VERIFIED' : 'FAILED', evidence, detail });
  if (!ok) throw new Error(`${surface}: ${name} :: ${detail}`);
}
function mime(file) {
  return { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' }[path.extname(file)] || 'application/octet-stream';
}
function serveRoot() {
  const server = http.createServer((req, res) => {
    const clean = decodeURIComponent(req.url.split('?')[0]);
    const rel = clean === '/' ? 'index.html' : clean.replace(/^\/+/, '');
    const file = path.resolve(root, rel);
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime(file) });
    res.end(fs.readFileSync(file));
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}
async function intercept(page, posts, mode) {
  let statusCount = 0;
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    if (url.startsWith('http://127.0.0.1:')) return request.continue();
    if (url.startsWith('https://fonts.googleapis.com/') || url.startsWith('https://fonts.gstatic.com/')) return request.respond({ status: 200, contentType: 'text/css', body: '' });
    if (url.endsWith('/favicon.ico')) return request.respond({ status: 204, contentType: 'image/x-icon', body: '' });
    if (!url.startsWith('https://script.google.com/')) return request.abort();
    if (request.method() === 'POST') {
      try { posts.push(JSON.parse(request.postData() || '{}')); } catch (_) { posts.push({}); }
      return request.respond({ status: 200, contentType: 'text/plain', body: '' });
    }
    statusCount += 1;
    const parsed = new URL(url);
    const cb = parsed.searchParams.get('callback');
    const uuid = parsed.searchParams.get('interestUuid');
    let response;
    if (mode === 'mismatch') response = { success: true, state: 'recorded', interestUuid: 'wrong-uuid' };
    else if (mode === 'status-error') response = { success: false, state: 'error', error: 'STATUS_TIMEOUT' };
    else if (mode === 'retry' && statusCount === 1) response = { success: false, state: 'error', error: 'STATUS_TIMEOUT' };
    else response = { success: true, state: 'recorded', interestUuid: uuid };
    return request.respond({ status: 200, contentType: 'application/javascript', body: `${cb}(${JSON.stringify(response)});` });
  });
}
async function fill(page) {
  await page.type('#fullName', 'Nguyen Van UAT');
  await page.type('#phone', '+84901234567');
  await page.type('#email', 'uat@example.com');
  await page.type('#role', 'Quan ly');
  await page.type('#company', 'CultureCode Test');
  await page.select('#preferredLocation', 'TP.HCM');
  await page.click('#consent');
}
async function submit(page) {
  await page.click('#submit-button');
  await page.waitForFunction(() => {
    const button = document.querySelector('#submit-button');
    const status = document.querySelector('#form-status');
    return button && !button.disabled && !status.classList.contains('is-pending');
  }, { timeout: 30000 });
  return page.$eval('#form-status', el => ({ text: el.textContent, className: el.className }));
}
async function newPage(browser, baseUrl, mode, viewport) {
  const page = await browser.newPage();
  const posts = [];
  await page.setViewport(viewport);
  await intercept(page, posts, mode);
  await page.goto(`${baseUrl}/program-interest.html`, { waitUntil: 'networkidle0' });
  return { page, posts };
}
async function run() {
  const source = fs.readFileSync(path.join(root, 'Scripts', 'active_code_gs_final.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'program-interest.html'), 'utf8');
  execFileSync(process.execPath, ['--check', path.join(root, 'Scripts', 'active_code_gs_final.js')], { stdio: 'pipe' });
  execFileSync(process.execPath, ['--check', path.join(root, 'UAT', 'program_interest_phase1_test_20260718.js')], { stdio: 'pipe' });
  check('Local files', 'Apps Script and UAT runner syntax pass', true, path.join(root, 'Scripts', 'active_code_gs_final.js'));
  check('Local files', 'PROGRAM_INTEREST route/schema/idempotency exist', source.includes("PROGRAM_INTEREST") && source.includes('interestUuid') && source.includes('Program Interest'), path.join(root, 'Scripts', 'active_code_gs_final.js'));
  check('Local files', 'form and production endpoint exist', html.includes('interest-form') && html.includes('WEBAPP_URL'), path.join(root, 'program-interest.html'));
  check('Local files', 'An toàn tâm lý, Culture101 and free-text field exist', html.includes('program-psychological-safety') && html.includes('program-culture101') && html.includes('Nội dung bạn quan tâm thêm') && !html.includes('<legend>3. Gửi thông tin</legend>'), path.join(root, 'program-interest.html'));
  const server = await serveRoot();
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    let t = await newPage(browser, baseUrl, 'success', { width: 1440, height: 900 });
    const initial = await t.page.$$eval('.conditional-panel', els => els.every(el => el.hidden));
    check('Browser UAT', 'initial conditional panels hidden', initial, path.join(screenshotDir, 'desktop-initial.png'));
    await t.page.screenshot({ path: path.join(screenshotDir, 'desktop-initial.png'), fullPage: true });
    await t.page.close();

    t = await newPage(browser, baseUrl, 'success', { width: 1440, height: 900 }); await fill(t.page); await t.page.click('#program-dhm8'); await t.page.select('#dhmPreferredCohort', 'DHM8 TP.HCM'); await t.page.type('#dhmExpectation', 'UAT DHM8'); let status = await submit(t.page); await t.page.screenshot({ path: path.join(screenshotDir, 'desktop-dhm8-success.png'), fullPage: true }); check('Browser UAT', 'DHM8 confirmed success', status.className.includes('is-success') && t.posts[0]?.wantsDhm8 === true, path.join(screenshotDir, 'desktop-dhm8-success.png'), JSON.stringify({ status, payload: t.posts[0] })); browserEvidence.push({ case: 'DHM8', payload: t.posts[0] }); await t.page.close();

    t = await newPage(browser, baseUrl, 'success', { width: 390, height: 844 }); await fill(t.page); await t.page.click('#program-dhm9'); await t.page.select('#dhmPreferredCohort', 'DHM9 Hà Nội'); await t.page.type('#dhmExpectation', 'UAT DHM9'); status = await submit(t.page); await t.page.screenshot({ path: path.join(screenshotDir, 'mobile-dhm9-success.png'), fullPage: true }); check('Browser UAT', 'DHM9 mobile confirmed success', status.className.includes('is-success') && t.posts[0]?.wantsDhm9 === true, path.join(screenshotDir, 'mobile-dhm9-success.png')); await t.page.close();

    t = await newPage(browser, baseUrl, 'success', { width: 1440, height: 900 }); await fill(t.page); await t.page.click('#program-nvc'); await t.page.type('#nvcSituation', 'UAT situation'); await t.page.select('#nvcRelationship', 'Đồng nghiệp / Đối tác'); await t.page.type('#nvcExpectation', 'UAT expectation'); status = await submit(t.page); await t.page.screenshot({ path: path.join(screenshotDir, 'desktop-nvc-success.png'), fullPage: true }); check('Browser UAT', 'NVC conditional payload succeeds', status.className.includes('is-success') && t.posts[0]?.wantsNvc === true && t.posts[0]?.nvcSituation === 'UAT situation', path.join(screenshotDir, 'desktop-nvc-success.png')); await t.page.close();

    t = await newPage(browser, baseUrl, 'success', { width: 1440, height: 900 }); await fill(t.page); await t.page.click('#program-ai'); await t.page.select('#aiExperienceLevel', 'Đã dùng công cụ cơ bản'); await t.page.select('#aiPreferredFormat', 'Kết hợp'); await t.page.type('#aiUseCase', 'UAT AI'); status = await submit(t.page); await t.page.screenshot({ path: path.join(screenshotDir, 'desktop-ai-success.png'), fullPage: true }); check('Browser UAT', 'AI conditional payload succeeds', status.className.includes('is-success') && t.posts[0]?.wantsAi === true && t.posts[0]?.aiUseCase === 'UAT AI', path.join(screenshotDir, 'desktop-ai-success.png')); await t.page.close();

    t = await newPage(browser, baseUrl, 'mismatch', { width: 1440, height: 900 }); await fill(t.page); await t.page.click('#program-dhm8'); await t.page.select('#dhmPreferredCohort', 'DHM8 TP.HCM'); await t.page.type('#dhmExpectation', 'mismatch'); status = await submit(t.page); await t.page.screenshot({ path: path.join(screenshotDir, 'desktop-uuid-mismatch-error.png'), fullPage: true }); check('Browser UAT', 'UUID mismatch never shows success', status.className.includes('is-error') && !status.className.includes('is-success'), path.join(screenshotDir, 'desktop-uuid-mismatch-error.png'), status.text); await t.page.close();

    t = await newPage(browser, 'http://127.0.0.1:' + server.address().port, 'status-error', { width: 1440, height: 900 }); await fill(t.page); await t.page.click('#program-dhm8'); await t.page.select('#dhmPreferredCohort', 'DHM8 TP.HCM'); await t.page.type('#dhmExpectation', 'status error'); status = await submit(t.page); await t.page.screenshot({ path: path.join(screenshotDir, 'desktop-status-error.png'), fullPage: true }); check('Browser UAT', 'JSONP status error never shows success', status.className.includes('is-error'), path.join(screenshotDir, 'desktop-status-error.png'), status.text); await t.page.close();

    t = await newPage(browser, baseUrl, 'retry', { width: 1440, height: 900 }); await fill(t.page); await t.page.click('#program-dhm8'); await t.page.select('#dhmPreferredCohort', 'DHM8 TP.HCM'); await t.page.type('#dhmExpectation', 'retry'); const first = await submit(t.page); const uuid1 = t.posts[0]?.interestUuid; const second = await submit(t.page); const uuid2 = t.posts[1]?.interestUuid; check('Browser UAT', 'retry recovers and reuses UUID', first.className.includes('is-error') && second.className.includes('is-success') && uuid1 === uuid2, path.join(root, 'UAT', 'program_interest_phase1_browser_20260718.json'), JSON.stringify({ first, second, uuid1, uuid2 })); await t.page.close();

    const home = await browser.newPage(); await home.setViewport({ width: 1440, height: 900 }); await intercept(home, [], 'success'); await home.goto(`${baseUrl}/index.html`, { waitUntil: 'networkidle0' }); const href = await home.$eval('a[href="program-interest.html"]', el => el.getAttribute('href')); await home.screenshot({ path: path.join(screenshotDir, 'homepage-cta.png'), fullPage: true }); check('Browser UAT', 'homepage links Program Interest', href === 'program-interest.html', path.join(screenshotDir, 'homepage-cta.png'), href); await home.close();
  } finally { await browser.close(); server.close(); }
  fs.writeFileSync(browserJsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), checks: checks.filter(c => c.surface === 'Browser UAT'), evidence: browserEvidence }, null, 2));
  const failed = checks.filter(c => c.status === 'FAILED').length;
  const lines = ['# UAT Program Interest Phase 1 - 2026-07-18', '', '## Summary', `- Total checks: ${checks.length}`, `- VERIFIED: ${checks.length - failed}`, `- FAILED: ${failed}`, '- Scope: local-only. No Apps Script push, Sheet write, commit, Git push, or deploy.', `- Browser evidence: ${path.resolve(screenshotDir)}`, '', '## Detailed Results', '| Surface | Check | Status | Evidence | Detail |', '| :--- | :--- | :--- | :--- | :--- |'];
  for (const c of checks) lines.push(`| ${c.surface} | ${c.name} | ${c.status} | ${c.evidence} | ${String(c.detail).replace(/\|/g, '/') } |`);
  lines.push('', '## Surface Verification Matrix', '| Surface | Status |', '| :--- | :--- |', `| Local files | ${checks.some(c => c.surface === 'Local files' && c.status === 'FAILED') ? 'FAILED' : 'VERIFIED'} |`, `| Browser evidence | ${checks.some(c => c.surface === 'Browser UAT' && c.status === 'FAILED') ? 'FAILED' : 'VERIFIED'} |`, '| Apps Script deployment | UNVERIFIED - not executed in local UAT |', '| Public frontend URLs | UNVERIFIED - not deployed in local UAT |', `| Final verdict | ${failed ? 'FAILED' : 'UNVERIFIED local-only; live surfaces pending'} |`);
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
  console.log(JSON.stringify({ reportPath, browserJsonPath, total: checks.length, failed, verified: checks.length - failed }, null, 2));
  if (failed) process.exitCode = 1;
}
run().catch(error => { console.error(error.stack || error); process.exitCode = 1; });