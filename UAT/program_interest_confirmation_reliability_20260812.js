'use strict';

const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = process.env.PROGRAM_INTEREST_ROOT
  ? path.resolve(process.env.PROGRAM_INTEREST_ROOT)
  : path.resolve(__dirname, '..');
const FORM_PATH = path.join(ROOT, 'program-interest.html');
const EVIDENCE_DIR = process.env.PROGRAM_INTEREST_EVIDENCE_DIR
  ? path.resolve(process.env.PROGRAM_INTEREST_EVIDENCE_DIR)
  : path.join(__dirname, 'evidence', 'program_interest_confirmation_a3_20260812');
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec';
const TEST_VALUES = {
  fullName: 'UAT Program Interest A3',
  email: 'uat-program-interest-a3@example.invalid',
  phone: '0000000000',
  note: 'UAT note must never enter storage or logs'
};
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

let uatPort = 0;
let currentTest = 'bootstrap';

function findExecutable(candidates, label) {
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) throw new Error(`${label}_EXECUTABLE_NOT_FOUND`);
  return executable;
}

function startServer() {
  const server = http.createServer((request, response) => {
    if (request.url === '/program-interest.html' || request.url === '/') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end(fs.readFileSync(FORM_PATH));
      return;
    }
    response.writeHead(404);
    response.end('not found');
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function responseFor(kind, uuid) {
  if (kind === 'recorded') return { state: 'recorded', interestUuid: uuid };
  if (kind === 'mismatch') return { state: 'recorded', interestUuid: 'ffffffffffffffffffffffffffffffff' };
  if (kind === 'invalid') return { state: 'error', error: 'INVALID_UUID' };
  if (kind === 'malicious') return { state: 'error', error: 'UPSTREAM <script> email@example.invalid' };
  if (kind === 'error') return { state: 'error', error: 'UPSTREAM_TEMPORARY' };
  return { state: 'not_found', interestUuid: uuid };
}

async function createBrowserHarness({
  browserName = 'chrome',
  incognito = false,
  viewport = { width: 1440, height: 900 },
  statuses = ['recorded'],
  post = 'recorded',
  disableRandomUuid = false
} = {}) {
  const executablePath = browserName === 'brave'
    ? findExecutable(BRAVE_PATHS, 'BRAVE')
    : findExecutable(CHROME_PATHS, 'CHROME');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-sync'
    ]
  });
  const context = incognito
    ? await browser.createIncognitoBrowserContext()
    : browser.defaultBrowserContext();
  const page = await context.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument((shouldDisableRandomUuid) => {
    if (shouldDisableRandomUuid && window.crypto) {
      try {
        Object.defineProperty(window.crypto, 'randomUUID', { configurable: true, value: undefined });
      } catch (_) {}
    }
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.__uatTimerDelays = [];
    window.setTimeout = function (callback, delay, ...args) {
      window.__uatTimerDelays.push(delay);
      var acceleratedDelay = delay;
      if (delay >= 8000) acceleratedDelay = 120;
      else if (delay >= 4000) acceleratedDelay = 15;
      else if (delay >= 1000) acceleratedDelay = 5;
      return nativeSetTimeout(callback, acceleratedDelay, ...args);
    };
  }, disableRandomUuid);

  const trace = {
    browserName,
    browserVersion: await browser.version(),
    incognito,
    viewport,
    postBodies: [],
    statusUrls: [],
    events: [],
    eventTimes: {},
    postResolvedAt: null,
    consoleMessages: [],
    externalRequestsBlocked: [],
    appsScriptRequestsContinued: 0
  };
  let statusPlan = statuses.slice();
  let statusIndex = 0;
  let postMode = post;
  const pendingPostResolvers = [];

  page.on('console', (message) => trace.consoleMessages.push(message.text()));
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    const requestUrl = request.url();
    const localPrefix = `http://127.0.0.1:${uatPort}`;
    try {
      if (requestUrl.startsWith(localPrefix)) {
        await request.continue();
        return;
      }
      if (!requestUrl.startsWith(WEBAPP_URL)) {
        trace.externalRequestsBlocked.push(requestUrl);
        await request.abort('blockedbyclient');
        return;
      }

      if (request.method() === 'POST') {
        trace.events.push('post');
        trace.eventTimes.postStart = trace.eventTimes.postStart || Date.now();
        trace.postBodies.push(JSON.parse(request.postData() || '{}'));
        if (postMode === 'network') {
          await request.abort('failed');
        } else if (postMode === 'pending') {
          await new Promise((resolve) => {
            pendingPostResolvers.push(async () => {
              if (!request.isInterceptResolutionHandled()) {
                await request.respond({ status: 204, body: '' });
              }
              trace.postResolvedAt = Date.now();
              resolve();
            });
          });
        } else {
          await request.respond({ status: 204, body: '' });
          trace.postResolvedAt = Date.now();
        }
        return;
      }

      const url = new URL(requestUrl);
      if (url.searchParams.get('action') !== 'checkProgramInterestStatus') {
        await request.abort('blockedbyclient');
        return;
      }
      const callback = url.searchParams.get('callback');
      const uuid = url.searchParams.get('interestUuid');
      trace.eventTimes.statusStart = trace.eventTimes.statusStart || Date.now();
      trace.statusUrls.push(requestUrl);
      const kind = statusPlan[Math.min(statusIndex++, statusPlan.length - 1)] || 'not_found';
      trace.events.push(`status:${kind}`);
      if (kind === 'timeout') {
        setTimeout(() => {
          if (!request.isInterceptResolutionHandled()) request.abort('timedout').catch(() => {});
        }, 180);
        return;
      }
      if (kind === 'network') {
        await request.abort('failed');
        return;
      }
      await request.respond({
        status: 200,
        contentType: 'application/javascript; charset=utf-8',
        body: `${callback}(${JSON.stringify(responseFor(kind, uuid))});`
      });
    } catch (error) {
      if (!request.isInterceptResolutionHandled()) {
        try { await request.abort('failed'); } catch (_) {}
      }
      trace.events.push(`interception-error:${error.message}`);
    }
  });

  async function goto() {
    await page.goto(`http://127.0.0.1:${uatPort}/program-interest.html`, { waitUntil: 'domcontentloaded' });
  }

  function setStatuses(nextStatuses) {
    statusPlan = nextStatuses.slice();
    statusIndex = 0;
  }

  function setPostMode(nextMode) {
    postMode = nextMode;
  }

  async function releasePendingPosts() {
    while (pendingPostResolvers.length) {
      await pendingPostResolvers.shift()();
    }
  }

  async function close() {
    await releasePendingPosts();
    await browser.close();
  }

  return { browser, context, page, trace, goto, setStatuses, setPostMode, releasePendingPosts, close };
}

async function fillAndSubmit(page, overrides = {}) {
  const values = Object.assign({}, TEST_VALUES, overrides);
  await page.evaluate((input) => {
    const set = (selector, value) => {
      const field = document.querySelector(selector);
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    };
    set('#fullName', input.fullName);
    set('#email', input.email);
    set('#phone', input.phone);
    set('#note', input.note);
    const program = document.querySelector('#program-culture101');
    if (!program.checked) program.click();
    const consent = document.querySelector('#consent');
    if (!consent.checked) consent.click();
    document.querySelector('#interest-form').requestSubmit();
  }, values);
}

async function waitForSuccess(page) {
  await page.waitForFunction(() => document.querySelector('#form-status')?.classList.contains('is-success'), { timeout: 8000 });
}

async function waitForError(page, expectedCode) {
  await page.waitForFunction((code) => {
    const box = document.querySelector('#form-status');
    return box && box.classList.contains('is-error') && (!code || box.dataset.errorCode === code);
  }, { timeout: 8000 }, expectedCode || '');
}

async function readUiState(page) {
  return page.evaluate(() => {
    const box = document.querySelector('#form-status');
    const storage = {};
    for (var i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      storage[key] = sessionStorage.getItem(key);
    }
    return {
      text: box?.textContent || '',
      className: box?.className || '',
      errorCode: box?.dataset.errorCode || '',
      retryButton: Boolean(document.querySelector('#retry-confirmation-button')),
      storage,
      timerDelays: window.__uatTimerDelays || []
    };
  });
}

function uuidFromStatusUrl(url) {
  return new URL(url).searchParams.get('interestUuid');
}

function safeResult(id, harness, extra = {}) {
  return Object.assign({
    id,
    browser: harness.trace.browserName,
    browserVersion: harness.trace.browserVersion,
    incognito: harness.trace.incognito,
    viewport: harness.trace.viewport,
    postCount: harness.trace.postBodies.length,
    statusCount: harness.trace.statusUrls.length,
    postToStatusStartMs: harness.trace.eventTimes.postStart && harness.trace.eventTimes.statusStart
      ? harness.trace.eventTimes.statusStart - harness.trace.eventTimes.postStart
      : null,
    appsScriptRequestsContinued: harness.trace.appsScriptRequestsContinued
  }, extra);
}

async function scenarioTimeoutThenRecorded(results) {
  currentTest = 'AT-A2-01 timeout then recorded';
  const h = await createBrowserHarness({ statuses: ['timeout', 'recorded'] });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForSuccess(h.page);
    assert.equal(h.trace.postBodies.length, 1);
    assert.equal(h.trace.statusUrls.length, 2, JSON.stringify({ events: h.trace.events, console: h.trace.consoleMessages }));
    assert.equal(uuidFromStatusUrl(h.trace.statusUrls[0]), uuidFromStatusUrl(h.trace.statusUrls[1]));
    results.push(safeResult('AT-A2-01', h));
  } finally { await h.close(); }
}

async function scenarioPostFailure(results) {
  currentTest = 'AT-A2-02 POST network error then recorded';
  const h = await createBrowserHarness({ statuses: ['recorded'], post: 'network' });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForSuccess(h.page);
    assert.equal(h.trace.postBodies.length, 1);
    assert.equal(h.trace.statusUrls.length, 1);
    results.push(safeResult('AT-A2-02', h));
  } finally { await h.close(); }
}

async function scenarioStatusRunsBeforePostResolves(results) {
  currentTest = 'AT-A3-02 status recorded before POST resolves';
  const h = await createBrowserHarness({ statuses: ['recorded'], post: 'pending' });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForSuccess(h.page);
    assert.equal(h.trace.postBodies.length, 1);
    assert.equal(h.trace.statusUrls.length, 1);
    assert.equal(h.trace.postResolvedAt, null, JSON.stringify(h.trace));
    assert.equal(h.trace.eventTimes.statusStart - h.trace.eventTimes.postStart <= 100, true, JSON.stringify(h.trace.eventTimes));
    await h.releasePendingPosts();
    results.push(safeResult('AT-A3-02', h, {
      successBeforePostResolved: true,
      postToStatusStartMs: h.trace.eventTimes.statusStart - h.trace.eventTimes.postStart
    }));
  } finally { await h.close(); }
}

async function scenarioTenAttemptsAndManualRetry(results) {
  currentTest = 'AT-A2-03 ten attempts and AT-A2-04 check only retry';
  const h = await createBrowserHarness({ statuses: Array(10).fill('timeout') });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForError(h.page, 'CONFIRMATION_UNAVAILABLE');
    const unavailable = await readUiState(h.page);
    assert.equal(h.trace.statusUrls.length, 10);
    assert.equal(h.trace.postBodies.length, 1);
    assert.equal(unavailable.retryButton, true);
    assert.equal(unavailable.timerDelays.filter((delay) => delay === 12000).length >= 10, true);
    assert.equal(unavailable.timerDelays.filter((delay) => delay === 4000).length >= 9, true);
    assert.match(unavailable.text, /chưa kiểm tra được trạng thái/i);
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    await h.page.screenshot({ path: path.join(EVIDENCE_DIR, 'chrome-retry-desktop-1440x900.png'), fullPage: true });
    results.push(safeResult('AT-A2-03', h, {
      retryButton: true,
      screenshot: 'chrome-retry-desktop-1440x900.png'
    }));

    h.setStatuses(['recorded']);
    const postCountBeforeRetry = h.trace.postBodies.length;
    const statusCountBeforeRetry = h.trace.statusUrls.length;
    await h.page.click('#retry-confirmation-button');
    await waitForSuccess(h.page);
    assert.equal(h.trace.postBodies.length, postCountBeforeRetry);
    assert.equal(h.trace.statusUrls.length, statusCountBeforeRetry + 1);
    results.push(safeResult('AT-A2-04', h, { postDelta: 0, statusDelta: 1 }));
  } finally { await h.close(); }
}

async function scenarioReloadRecovery(results) {
  currentTest = 'AT-A2-05 reload recovery';
  const h = await createBrowserHarness({ statuses: Array(10).fill('timeout') });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForError(h.page, 'CONFIRMATION_UNAVAILABLE');
    const pending = await readUiState(h.page);
    const pendingRaw = Object.values(pending.storage).join(' ');
    const firstUuid = h.trace.postBodies[0].interestUuid;
    assert.match(pendingRaw, new RegExp(firstUuid));
    const postsBeforeReload = h.trace.postBodies.length;
    h.setStatuses(['recorded']);
    await h.page.reload({ waitUntil: 'domcontentloaded' });
    await waitForSuccess(h.page);
    const recovered = await readUiState(h.page);
    assert.equal(h.trace.postBodies.length, postsBeforeReload);
    assert.equal(Object.keys(recovered.storage).length, 0);
    assert.equal(uuidFromStatusUrl(h.trace.statusUrls.at(-1)), firstUuid);
    results.push(safeResult('AT-A2-05', h, { postDeltaAfterReload: 0, recoveredUuid: firstUuid }));
  } finally { await h.close(); }
}

async function createPendingHarness() {
  const h = await createBrowserHarness({ statuses: Array(10).fill('timeout') });
  await h.goto();
  await fillAndSubmit(h.page);
  await waitForError(h.page, 'CONFIRMATION_UNAVAILABLE');
  return h;
}

async function scenarioPreflightRecorded(results) {
  currentTest = 'AT-A2-06 preflight recorded skips POST';
  const h = await createPendingHarness();
  try {
    const postsBefore = h.trace.postBodies.length;
    const uuid = h.trace.postBodies[0].interestUuid;
    h.setStatuses(['recorded']);
    await fillAndSubmit(h.page);
    await waitForSuccess(h.page);
    assert.equal(h.trace.postBodies.length, postsBefore);
    assert.equal(uuidFromStatusUrl(h.trace.statusUrls.at(-1)), uuid);
    results.push(safeResult('AT-A2-06', h, { postDelta: 0 }));
  } finally { await h.close(); }
}

async function scenarioPreflightThenPost(results) {
  currentTest = 'AT-A2-07 preflight not found then same UUID POST';
  const h = await createPendingHarness();
  try {
    const firstUuid = h.trace.postBodies[0].interestUuid;
    const eventStart = h.trace.events.length;
    h.setStatuses(['not_found', 'recorded']);
    await fillAndSubmit(h.page);
    await waitForSuccess(h.page);
    const secondUuid = h.trace.postBodies[1].interestUuid;
    assert.equal(firstUuid, secondUuid);
    const tail = h.trace.events.slice(eventStart);
    assert.equal(tail[0], 'status:not_found');
    assert.equal(tail.filter((event) => event === 'post').length, 1);
    assert.equal(tail.filter((event) => event === 'status:recorded').length, 1);
    results.push(safeResult('AT-A2-07', h, { sameUuid: true }));
  } finally { await h.close(); }
}

async function scenarioChangedPayload(results) {
  currentTest = 'AT-A2-08 changed payload creates new UUID';
  const h = await createPendingHarness();
  try {
    const firstUuid = h.trace.postBodies[0].interestUuid;
    const eventStart = h.trace.events.length;
    h.setStatuses(['recorded']);
    await fillAndSubmit(h.page, { note: 'Changed UAT note' });
    await waitForSuccess(h.page);
    const secondUuid = h.trace.postBodies[1].interestUuid;
    assert.notEqual(firstUuid, secondUuid);
    assert.equal(h.trace.events[eventStart], 'post');
    results.push(safeResult('AT-A2-08', h, { newUuid: true }));
  } finally { await h.close(); }
}

async function scenarioPermanentPreflightErrors(results) {
  currentTest = 'AT-A2-09 permanent preflight errors';
  for (const [kind, code] of [['invalid', 'INVALID_UUID'], ['mismatch', 'STATUS_UUID_MISMATCH']]) {
    const h = await createPendingHarness();
    try {
      const postsBefore = h.trace.postBodies.length;
      h.setStatuses([kind]);
      await fillAndSubmit(h.page);
      await waitForError(h.page, code);
      assert.equal(h.trace.postBodies.length, postsBefore);
      results.push(safeResult(`AT-A2-09-${kind}`, h, { errorCode: code, postDelta: 0 }));
    } finally { await h.close(); }
  }
}

async function scenarioPrivacy(results) {
  currentTest = 'AT-A2-10 privacy audit';
  const h = await createPendingHarness();
  try {
    const ui = await readUiState(h.page);
    const storageText = JSON.stringify(ui.storage);
    const forbidden = [TEST_VALUES.fullName, TEST_VALUES.email, TEST_VALUES.phone, TEST_VALUES.note];
    forbidden.forEach((value) => {
      assert.equal(storageText.includes(value), false);
      assert.equal(h.trace.statusUrls.some((url) => url.includes(encodeURIComponent(value)) || url.includes(value)), false);
      assert.equal(h.trace.consoleMessages.some((message) => message.includes(value)), false);
    });
    const parsedStates = Object.values(ui.storage).map((value) => JSON.parse(value));
    assert.equal(parsedStates.length, 1);
    assert.match(parsedStates[0].payloadFingerprint, /^[0-9a-f]{64}$/);
    assert.equal(Object.prototype.hasOwnProperty.call(parsedStates[0], 'payload'), false);
    results.push(safeResult('AT-A2-10', h, { storageKeys: Object.keys(ui.storage) }));
  } finally { await h.close(); }
}

async function scenarioFallbackUuid(results) {
  currentTest = 'AT-A2-G01 fallback UUID remains 32 hex';
  const h = await createBrowserHarness({ statuses: ['recorded'], disableRandomUuid: true });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForSuccess(h.page);
    assert.match(h.trace.postBodies[0].interestUuid, /^[0-9a-f]{32}$/i);
    results.push(safeResult('AT-A2-G01', h, { fallbackUuidFormat: '32_HEX' }));
  } finally { await h.close(); }
}

async function scenarioErrorCodeSanitization(results) {
  currentTest = 'AT-A2-G02 error code sanitization';
  const h = await createBrowserHarness({ statuses: ['malicious'] });
  try {
    await h.goto();
    await fillAndSubmit(h.page);
    await waitForError(h.page, 'CONFIRMATION_UNAVAILABLE');
    const ui = await readUiState(h.page);
    assert.equal(ui.errorCode, 'CONFIRMATION_UNAVAILABLE');
    assert.equal(h.trace.consoleMessages.some((message) => message.includes('email@example.invalid') || message.includes('<script>')), false);
    results.push(safeResult('AT-A2-G02', h, { sanitizedErrorCode: ui.errorCode }));
  } finally { await h.close(); }
}

async function scenarioBrowserMatrix(results) {
  currentTest = 'AT-A2-11 Chrome Brave incognito desktop mobile';
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const matrix = [
    { browserName: 'chrome', incognito: false, viewport: { width: 1440, height: 900 }, screenshot: 'chrome-desktop-1440x900.png' },
    { browserName: 'brave', incognito: false, disableRandomUuid: true, viewport: { width: 390, height: 844 }, screenshot: 'brave-mobile-390x844.png' },
    { browserName: 'chrome', incognito: true, disableRandomUuid: true, viewport: { width: 390, height: 844 }, screenshot: null }
  ];
  for (const config of matrix) {
    const h = await createBrowserHarness(Object.assign({ statuses: ['recorded'] }, config));
    try {
      await h.goto();
      await fillAndSubmit(h.page);
      await waitForSuccess(h.page);
      assert.equal(h.trace.postBodies.length, 1);
      assert.equal(h.trace.statusUrls.length, 1);
      assert.equal(h.trace.appsScriptRequestsContinued, 0);
      if (config.disableRandomUuid) {
        assert.match(h.trace.postBodies[0].interestUuid, /^[0-9a-f]{32}$/i);
      }
      if (config.screenshot) {
        await h.page.screenshot({ path: path.join(EVIDENCE_DIR, config.screenshot), fullPage: true });
      }
      results.push(safeResult(`AT-A2-11-${config.browserName}${config.incognito ? '-incognito' : ''}`, h, {
        screenshot: config.screenshot || null,
        fallbackUuidFormat: config.disableRandomUuid ? '32_HEX' : null
      }));
    } finally { await h.close(); }
  }
}

async function main() {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const server = await startServer();
  uatPort = server.address().port;
  const results = [];
  try {
    await scenarioTimeoutThenRecorded(results);
    await scenarioPostFailure(results);
    await scenarioStatusRunsBeforePostResolves(results);
    await scenarioTenAttemptsAndManualRetry(results);
    await scenarioReloadRecovery(results);
    await scenarioPreflightRecorded(results);
    await scenarioPreflightThenPost(results);
    await scenarioChangedPayload(results);
    await scenarioPermanentPreflightErrors(results);
    await scenarioPrivacy(results);
    await scenarioFallbackUuid(results);
    await scenarioErrorCodeSanitization(results);
    await scenarioBrowserMatrix(results);

    const report = {
      verdict: 'LOCAL_A3_UAT_VERIFIED',
      sourceRoot: ROOT,
      formSha256: require('crypto').createHash('sha256').update(fs.readFileSync(FORM_PATH)).digest('hex'),
      externalWrites: 'NONE',
      appsScriptRequestsContinued: results.reduce((sum, result) => sum + result.appsScriptRequestsContinued, 0),
      results
    };
    fs.writeFileSync(path.join(EVIDENCE_DIR, 'local-results.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const failure = {
    verdict: process.env.PROGRAM_INTEREST_BASELINE_LABEL ? 'EXPECTED_BASELINE_FAILURE' : 'LOCAL_A2_UAT_FAILED',
    baselineLabel: process.env.PROGRAM_INTEREST_BASELINE_LABEL || null,
    currentTest,
    sourceRoot: ROOT,
    error: error.message,
    externalWrites: 'NONE'
  };
  const filename = process.env.PROGRAM_INTEREST_BASELINE_LABEL
    ? 'baseline-a1-failure.json'
    : 'local-failure.json';
  fs.writeFileSync(path.join(EVIDENCE_DIR, filename), JSON.stringify(failure, null, 2) + '\n', 'utf8');
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
