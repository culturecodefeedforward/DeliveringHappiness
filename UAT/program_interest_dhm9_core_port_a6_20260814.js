'use strict';

/*
 * A6 local-only regression harness.
 * No request can leave 127.0.0.1; fake values only; no Google Sheet write.
 */
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const FORM_PATH = path.join(ROOT, 'program-interest.html');
const EVIDENCE_DIR = path.join(ROOT, 'UAT', 'evidence', 'program_interest_dhm9_core_port_a6_20260814');
const EVIDENCE_FILE = String(process.env.PROGRAM_INTEREST_A6_EVIDENCE_FILE || 'result.json');
const RESULT_PATH = path.join(EVIDENCE_DIR, EVIDENCE_FILE);
const CHROME_PATHS = [
  process.env.PROGRAM_INTEREST_CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe')
].filter(Boolean);
const BRAVE_PATHS = [
  process.env.PROGRAM_INTEREST_BRAVE_PATH,
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  path.join(process.env.LOCALAPPDATA || '', 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe')
].filter(Boolean);

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });
  return { promise, resolve, reject };
}

function findExecutable(candidates, label) {
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) {
    const error = new Error(`${label}_EXECUTABLE_NOT_FOUND`);
    error.code = 'BROWSER_UNAVAILABLE';
    throw error;
  }
  return executable;
}

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function closeServer(server) {
  if (typeof server.closeIdleConnections === 'function') server.closeIdleConnections();
  if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
  return new Promise((resolve) => server.close(resolve));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('error', reject);
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

async function createFakeAppsScript() {
  const postReceived = createDeferred();
  const postRelease = createDeferred();
  const state = {
    postSettled: false,
    recorded: new Set(),
    posts: [],
    gets: [],
    events: []
  };

  const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, 'http://127.0.0.1');
    response.setHeader('access-control-allow-origin', '*');
    response.setHeader('cache-control', 'no-store');

    if (request.method === 'POST' && requestUrl.pathname === '/exec') {
      const body = await readRequestBody(request);
      let payload = null;
      try {
        payload = JSON.parse(body);
      } catch (error) {
        payload = { parseError: true };
      }
      state.posts.push({
        interestUuid: String(payload && payload.interestUuid || ''),
        type: String(payload && payload.type || ''),
        phone: String(payload && payload.phone || ''),
        email: String(payload && payload.email || ''),
        parseError: Boolean(payload && payload.parseError)
      });
      state.events.push({ type: 'POST_RECEIVED', at: Date.now() });
      postReceived.resolve();
      await postRelease.promise;
      state.postSettled = true;
      if (payload && payload.interestUuid) state.recorded.add(String(payload.interestUuid));
      state.events.push({ type: 'POST_SETTLED', at: Date.now() });
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ success: true, state: 'recorded' }));
      return;
    }

    if (request.method === 'GET' && requestUrl.pathname === '/exec' &&
        requestUrl.searchParams.get('action') === 'checkProgramInterestStatus') {
      const uuid = String(requestUrl.searchParams.get('interestUuid') || '');
      const callback = String(requestUrl.searchParams.get('callback') || '');
      const recorded = state.recorded.has(uuid);
      state.gets.push({ uuid, beforePostSettled: !state.postSettled, recorded });
      state.events.push({ type: 'GET_STATUS', at: Date.now(), beforePostSettled: !state.postSettled });
      const payload = {
        success: true,
        state: recorded ? 'recorded' : 'not_found',
        interestUuid: uuid
      };
      response.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' });
      response.end(`${callback}(${JSON.stringify(payload)});`);
      return;
    }

    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('not found');
  });
  server.keepAliveTimeout = 1;
  server.headersTimeout = 2000;

  const port = await listen(server);
  return {
    origin: `http://127.0.0.1:${port}`,
    state,
    async waitForPost(timeoutMilliseconds) {
      return Promise.race([
        postReceived.promise,
        delay(timeoutMilliseconds).then(() => { throw new Error('POST_NOT_RECEIVED'); })
      ]);
    },
    releasePost() {
      postRelease.resolve();
    },
    markRecorded(uuid) {
      state.recorded.add(String(uuid));
    },
    async close() {
      postRelease.resolve();
      await closeServer(server);
    }
  };
}

async function createLocalFormServer(webAppOrigin, options = {}) {
  const source = fs.readFileSync(FORM_PATH, 'utf8');
  let injected = source
    .replace(
      /var WEBAPP_URL = 'https:\/\/script\.google\.com\/macros\/s\/[^']+\/exec';/,
      `var WEBAPP_URL = '${webAppOrigin}/exec';`
    )
    // Local harness keeps retry cases fast. Production constants are not changed.
    .replace('var STATUS_MAX_ATTEMPTS = 10;', 'var STATUS_MAX_ATTEMPTS = 1;')
    .replace('var STATUS_POLL_DELAY_MS = 4000;', 'var STATUS_POLL_DELAY_MS = 10;');
  if (options.postTimeoutMs) {
    injected = injected.replace('var POST_DISPATCH_TIMEOUT_MS = 12000;',
      `var POST_DISPATCH_TIMEOUT_MS = ${options.postTimeoutMs};`);
  }
  assert.notEqual(injected, source, 'WEBAPP_URL_INJECTION_FAILED');

  const server = http.createServer((request, response) => {
    if (request.url === '/' || request.url === '/program-interest.html') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end(injected);
      return;
    }
    if (request.url === '/favicon.ico') {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.url === '/assets/culturecode-logo-dark.jpg') {
      const assetPath = path.join(ROOT, 'assets', 'culturecode-logo-dark.jpg');
      if (fs.existsSync(assetPath)) {
        response.writeHead(200, { 'content-type': 'image/jpeg' });
        response.end(fs.readFileSync(assetPath));
      } else {
        response.writeHead(204);
        response.end();
      }
      return;
    }
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('not found');
  });
  server.keepAliveTimeout = 1;
  server.headersTimeout = 2000;
  const port = await listen(server);
  return {
    origin: `http://127.0.0.1:${port}`,
    async close() {
      await closeServer(server);
    }
  };
}

function getBrowserConfig() {
  const configs = [];
  try {
    configs.push({
      id: 'chrome-desktop',
      browser: 'chrome',
      executablePath: findExecutable(CHROME_PATHS, 'CHROME'),
      incognito: false,
      viewport: { width: 1440, height: 900 }
    });
    configs.push({
      id: 'chrome-incognito-mobile',
      browser: 'chrome',
      executablePath: findExecutable(CHROME_PATHS, 'CHROME'),
      incognito: true,
      viewport: { width: 390, height: 844, isMobile: true }
    });
  } catch (error) {
    throw new Error(`CHROME_REQUIRED_${error.message}`);
  }

  try {
    configs.push({
      id: 'brave-mobile',
      browser: 'brave',
      executablePath: findExecutable(BRAVE_PATHS, 'BRAVE'),
      incognito: true,
      viewport: { width: 390, height: 844, isMobile: true }
    });
  } catch (error) {
    configs.push({ id: 'brave-mobile', skipped: true, reason: error.message });
  }
  const requested = String(process.env.PROGRAM_INTEREST_A6_BROWSER || '').trim();
  return requested ? configs.filter((config) => config.id === requested) : configs;
}

async function makePage(browser, config) {
  const context = config.incognito
    ? await browser.createIncognitoBrowserContext()
    : browser.defaultBrowserContext();
  const page = await context.newPage();
  await page.setViewport(config.viewport);
  const trace = { requests: [], blockedExternalReads: [], pageErrors: [], console: [] };
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    trace.requests.push({ method: request.method(), url });
    if (url.startsWith('https://fonts.googleapis.com/') || url.startsWith('https://fonts.gstatic.com/')) {
      trace.blockedExternalReads.push(url);
      request.abort().catch(() => {});
      return;
    }
    request.continue().catch(() => {});
  });
  page.on('pageerror', (error) => trace.pageErrors.push(error.message));
  page.on('console', (message) => trace.console.push({ type: message.type(), text: message.text() }));
  return { context, page, trace };
}

async function fillValidForm(page, phone) {
  await page.type('#fullName', 'UAT A6 Program Interest');
  await page.type('#phone', phone || '0000000000');
  await page.type('#email', 'uat-a6@example.invalid');
  await page.evaluate(() => {
    const program = document.getElementById('program-psychological-safety');
    const consent = document.getElementById('consent');
    if (!program.checked) program.click();
    if (!consent.checked) consent.click();
  });
}

async function requestFormSubmit(page) {
  await page.evaluate(() => document.getElementById('interest-form').requestSubmit());
}

async function clickRetry(page) {
  await page.evaluate(() => document.getElementById('retry-confirmation-button').click());
}

async function withFixture(browser, config, action, formOptions) {
  const fake = await createFakeAppsScript();
  const formServer = await createLocalFormServer(fake.origin, formOptions);
  const pageState = await makePage(browser, config);
  try {
    await pageState.page.goto(`${formServer.origin}/program-interest.html`, { waitUntil: 'networkidle0' });
    const result = await action({ fake, formServer, ...pageState });
    const externalRequests = pageState.trace.requests
      .filter((entry) => entry.url.startsWith('http://') || entry.url.startsWith('https://'))
      .filter((entry) => pageState.trace.blockedExternalReads.indexOf(entry.url) === -1)
      .filter((entry) => {
        const origin = new URL(entry.url).origin;
        return origin !== fake.origin && origin !== formServer.origin;
      });
    assert.equal(externalRequests.length, 0,
      `EXTERNAL_REQUEST_DETECTED ${externalRequests.map((entry) => entry.url).join(',')}`);
    assert.deepEqual(pageState.trace.pageErrors, [], 'PAGE_ERROR_DETECTED');
    return Object.assign({}, result, { blockedExternalReads: pageState.trace.blockedExternalReads.length });
  } finally {
    await pageState.page.close().catch(() => {});
    if (pageState.context.isIncognito && pageState.context.isIncognito()) {
      await pageState.context.close().catch(() => {});
    }
    await formServer.close();
    await fake.close();
  }
}

async function validSubmitCase(browser, config) {
  return withFixture(browser, config, async ({ page, fake, trace }) => {
    await fillValidForm(page);
    await requestFormSubmit(page);
    try {
      await fake.waitForPost(6000);
    } catch (error) {
      const runtime = await page.evaluate(() => ({
        status: document.getElementById('form-status').textContent.trim(),
        statusClass: document.getElementById('form-status').className,
        phoneValidity: document.getElementById('phone').validationMessage,
        submitDisabled: document.getElementById('submit-button').disabled,
        formValid: document.getElementById('interest-form').checkValidity(),
        selectedProgram: document.getElementById('program-psychological-safety').checked,
        consent: document.getElementById('consent').checked,
        email: document.getElementById('email').value
      }));
      throw new Error(`${error.message}; runtime=${JSON.stringify(runtime)}; requests=${JSON.stringify(trace.requests)}; console=${JSON.stringify(trace.console)}`);
    }
    await delay(180);
    const earlyGets = fake.state.gets.filter((entry) => entry.beforePostSettled);
    if (earlyGets.length) {
      fake.releasePost();
      throw new Error('STATUS_GET_STARTED_BEFORE_POST_SETTLED');
    }
    fake.releasePost();
    try {
      await page.waitForFunction(
        () => document.getElementById('form-status').classList.contains('is-success'),
        { timeout: 7000 }
      );
    } catch (error) {
      throw new Error(`${error.message}; posts=${JSON.stringify(fake.state.posts)}; gets=${JSON.stringify(fake.state.gets)}; events=${JSON.stringify(fake.state.events)}`);
    }
    const ui = await page.evaluate(() => ({
      status: document.getElementById('form-status').textContent.trim(),
      fullName: document.getElementById('fullName').value,
      pending: window.sessionStorage.getItem('PROGRAM_INTEREST_pending_v2')
    }));
    assert.equal(fake.state.posts.length, 1, 'VALID_POST_COUNT_MUST_BE_ONE');
    assert.equal(fake.state.gets.some((entry) => !entry.beforePostSettled && entry.recorded), true,
      'RECORDED_STATUS_NOT_CONFIRMED');
    assert.equal(ui.fullName, '', 'FORM_NOT_RESET_AFTER_RECORDED');
    assert.equal(ui.pending, null, 'PENDING_STATE_NOT_CLEARED_AFTER_RECORDED');
    const screenshot = path.join(EVIDENCE_DIR, `${config.id}-valid-success.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    return { postCount: fake.state.posts.length, getCount: fake.state.gets.length, ui, screenshot };
  });
}

async function invalidPhoneCase(browser, config) {
  return withFixture(browser, config, async ({ page, fake }) => {
    await fillValidForm(page, 'abc');
    await requestFormSubmit(page);
    await delay(350);
    const errorText = await page.evaluate(() => {
      const node = document.getElementById('phone-input-error');
      return node ? node.textContent.trim() : '';
    });
    const postCount = fake.state.posts.length;
    fake.releasePost();
    assert.equal(postCount, 0, 'INVALID_PHONE_MUST_NOT_POST');
    assert.match(errorText, /Số điện thoại/, 'INVALID_PHONE_MUST_SHOW_FIELD_ERROR');
    const screenshot = path.join(EVIDENCE_DIR, `${config.id}-invalid-phone.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    return { postCount, errorText, screenshot };
  });
}

async function postTimeoutRecoveryCase(browser, config) {
  return withFixture(browser, config, async ({ page, fake }) => {
    await fillValidForm(page);
    await requestFormSubmit(page);
    await fake.waitForPost(2000);
    await page.waitForFunction(() => {
      const status = document.getElementById('form-status');
      const retry = document.getElementById('retry-confirmation-button');
      return status.classList.contains('is-error') && retry && !retry.disabled;
    }, { timeout: 3000 });
    assert.equal(fake.state.posts.length, 1, 'POST_TIMEOUT_MUST_NOT_REPOST');
    assert.equal(fake.state.gets.length, 1, 'POST_TIMEOUT_MUST_START_STATUS_CHECK');
    return { postCount: fake.state.posts.length, getCount: fake.state.gets.length };
  }, { postTimeoutMs: 80 });
}

async function blankFullNameCase(browser, config) {
  return withFixture(browser, config, async ({ page, fake }) => {
    await page.type('#fullName', '   ');
    await page.type('#phone', '0000000000');
    await page.type('#email', 'uat-a6@example.invalid');
    await page.evaluate(() => {
      const program = document.getElementById('program-psychological-safety');
      const consent = document.getElementById('consent');
      if (!program.checked) program.click();
      if (!consent.checked) consent.click();
    });
    await requestFormSubmit(page);
    await delay(350);
    const errorText = await page.evaluate(() => {
      const node = document.getElementById('full-name-input-error');
      return node ? node.textContent.trim() : '';
    });
    assert.equal(fake.state.posts.length, 0, 'BLANK_FULL_NAME_MUST_NOT_POST');
    assert.match(errorText, /họ và tên/i, 'BLANK_FULL_NAME_MUST_SHOW_FIELD_ERROR');
    return { postCount: fake.state.posts.length, errorText };
  });
}

async function pendingRetryCase(browser, config) {
  return withFixture(browser, config, async ({ page, fake, trace }) => {
    const uuid = '4a9f139b-a911-40c3-9552-03fda729492a';
    const pendingState = {
      version: 2,
      interestUuid: uuid,
      payloadFingerprint: 'a'.repeat(64),
      phase: 'unconfirmed',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await page.evaluate((state) => {
      window.sessionStorage.setItem('PROGRAM_INTEREST_pending_v2', JSON.stringify(state));
    }, pendingState);
    await page.reload({ waitUntil: 'networkidle0' });
    try {
      await page.waitForFunction(() => {
        const retry = document.getElementById('retry-confirmation-button');
        return retry && !retry.disabled;
      }, { timeout: 15000 });
    } catch (error) {
      const runtime = await page.evaluate(() => ({
        status: document.getElementById('form-status').textContent.trim(),
        statusClass: document.getElementById('form-status').className,
        pending: window.sessionStorage.getItem('PROGRAM_INTEREST_pending_v2')
      }));
      throw new Error(`RETRY_BUTTON_TIMEOUT; runtime=${JSON.stringify(runtime)}; gets=${JSON.stringify(fake.state.gets)}; requests=${JSON.stringify(trace.requests)}; console=${JSON.stringify(trace.console)}`);
    }
    fake.markRecorded(uuid);
    await clickRetry(page);
    try {
      await page.waitForFunction(
        () => document.getElementById('form-status').classList.contains('is-success'),
        { timeout: 15000 }
      );
    } catch (error) {
      const runtime = await page.evaluate(() => ({
        status: document.getElementById('form-status').textContent.trim(),
        statusClass: document.getElementById('form-status').className,
        pending: window.sessionStorage.getItem('PROGRAM_INTEREST_pending_v2')
      }));
      throw new Error(`RETRY_SUCCESS_TIMEOUT; runtime=${JSON.stringify(runtime)}; gets=${JSON.stringify(fake.state.gets)}; requests=${JSON.stringify(trace.requests)}; console=${JSON.stringify(trace.console)}`);
    }
    assert.equal(fake.state.posts.length, 0, 'CHECK_ONLY_RETRY_MUST_NOT_POST');
    assert.ok(fake.state.gets.length >= 2, 'PENDING_RETRY_MUST_POLL_TWICE');
    const screenshot = path.join(EVIDENCE_DIR, `${config.id}-pending-retry-success.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    return { postCount: fake.state.posts.length, getCount: fake.state.gets.length, screenshot };
  });
}

async function fieldBlurIsolationCase(browser, config) {
  return withFixture(browser, config, async ({ page, fake }) => {
    await page.type('#phone', '0000000000');
    await page.click('#fullName');
    await delay(100);
    const errors = await page.evaluate(() => ({
      phone: (document.getElementById('phone-input-error') || {}).textContent || '',
      email: (document.getElementById('email-input-error') || {}).textContent || ''
    }));
    assert.equal(fake.state.posts.length, 0, 'BLUR_VALIDATION_MUST_NOT_POST');
    assert.equal(errors.phone.trim(), '', 'VALID_PHONE_MUST_NOT_SHOW_ERROR');
    assert.equal(errors.email.trim(), '', 'PHONE_BLUR_MUST_NOT_SHOW_EMAIL_ERROR');
    return { postCount: fake.state.posts.length, errors };
  });
}

function staticContractCase() {
  const source = fs.readFileSync(FORM_PATH, 'utf8');
  assert.match(source, /async function postProgramInterest\(payload\)/,
    'POST_HELPER_MISSING');
  assert.match(source, /await postProgramInterest\(payload\);/,
    'POST_MUST_SETTLE_BEFORE_CONFIRMATION');
  assert.match(source, /POST_DISPATCH_TIMEOUT_MS/,
    'POST_DISPATCH_TIMEOUT_MISSING');
  assert.match(source, /function validateProgramInterestSubmission\(/,
    'BACKEND_COMPATIBLE_CLIENT_VALIDATION_MISSING');
  assert.match(source, /phone-input-error/,
    'PHONE_FIELD_ERROR_SURFACE_MISSING');
  assert.match(source, /full-name-input-error/,
    'FULL_NAME_FIELD_ERROR_SURFACE_MISSING');
  return { source: path.basename(FORM_PATH) };
}

async function captureCase(results, id, action) {
  const startedAt = Date.now();
  try {
    const details = await action();
    results.push({ id, status: 'passed', durationMs: Date.now() - startedAt, details });
  } catch (error) {
    results.push({ id, status: 'failed', durationMs: Date.now() - startedAt, error: error.message });
  }
}

async function runBrowserConfig(config) {
  if (config.skipped) return { id: config.id, status: 'skipped', reason: config.reason, cases: [] };
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: config.executablePath,
    args: ['--no-sandbox', '--disable-background-networking', '--disable-component-update', '--disable-sync']
  });
  const cases = [];
  try {
    await captureCase(cases, 'B-01-valid-submit-sequential', () => validSubmitCase(browser, config));
    await captureCase(cases, 'B-02-invalid-phone-blocked', () => invalidPhoneCase(browser, config));
    await captureCase(cases, 'B-03-blank-full-name-blocked', () => blankFullNameCase(browser, config));
    await captureCase(cases, 'B-04-pending-retry-get-only', () => pendingRetryCase(browser, config));
    await captureCase(cases, 'B-05-field-blur-isolation', () => fieldBlurIsolationCase(browser, config));
    await captureCase(cases, 'B-06-post-timeout-checks-same-uuid', () => postTimeoutRecoveryCase(browser, config));
    return { id: config.id, browser: await browser.version(), status: 'completed', cases };
  } finally {
    await browser.close();
  }
}

async function main() {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const results = {
    harness: 'program_interest_dhm9_core_port_a6_20260814',
    timestamp: new Date().toISOString(),
    target: 'local 127.0.0.1 only',
    externalWrites: 'NONE',
    static: [],
    browsers: []
  };
  await captureCase(results.static, 'S-01-source-contract', staticContractCase);
  for (const config of getBrowserConfig()) {
    results.browsers.push(await runBrowserConfig(config));
  }
  const failures = [
    ...results.static.filter((item) => item.status === 'failed'),
    ...results.browsers.flatMap((browser) => browser.cases.filter((item) => item.status === 'failed'))
  ];
  results.verdict = failures.length === 0 ? 'LOCAL_A6_UAT_VERIFIED' : 'LOCAL_A6_UAT_FAILED';
  results.failureCount = failures.length;
  fs.writeFileSync(RESULT_PATH, JSON.stringify(results, null, 2) + '\n', 'utf8');
  process.stdout.write(JSON.stringify({ verdict: results.verdict, failureCount: failures.length, evidence: RESULT_PATH }) + '\n');
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  const fallback = { verdict: 'LOCAL_A6_UAT_FAILED', error: error.message, externalWrites: 'NONE' };
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  fs.writeFileSync(RESULT_PATH, JSON.stringify(fallback, null, 2) + '\n', 'utf8');
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
