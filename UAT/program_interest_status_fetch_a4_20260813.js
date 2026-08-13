'use strict';

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const FORM_PATH = path.join(ROOT, 'program-interest.html');
const RELEASE_SPEC_PATH = path.join(ROOT, 'release-specs', 'dhm10-homepage.json');
const EVIDENCE_DIR = process.env.PROGRAM_INTEREST_EVIDENCE_DIR
  ? path.resolve(process.env.PROGRAM_INTEREST_EVIDENCE_DIR)
  : path.join(__dirname, 'evidence', 'program_interest_status_fetch_a4_20260813');
const RESULT_PATH = path.join(EVIDENCE_DIR, 'browser-read-only-results.json');
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec';
const RECORDED_UUID = 'cb5016c3-e6e2-4a3d-bb67-8ab7db47b063';
const PENDING_STATE_KEY = 'PROGRAM_INTEREST_pending_v2';
const UI_WAIT_TIMEOUT_MS = 180000;
const TARGET_URL = String(process.env.PROGRAM_INTEREST_TARGET_URL || '').trim();
const TARGET_PHASE = String(
  process.env.PROGRAM_INTEREST_TARGET_PHASE || (TARGET_URL ? 'staged' : 'local')
).trim().toLowerCase();
const BYPASS_SECRET = String(process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '').trim();
const EXPECTED_RELEASE = {
  id: String(process.env.PROGRAM_INTEREST_EXPECTED_RELEASE_ID || '').trim(),
  commit: String(process.env.PROGRAM_INTEREST_EXPECTED_RELEASE_COMMIT || '').trim(),
  manifest: String(process.env.PROGRAM_INTEREST_EXPECTED_RELEASE_MANIFEST || '').trim()
};
const TARGET_ORIGIN = TARGET_URL ? new URL(TARGET_URL).origin : '';
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

function findExecutable(candidates, label) {
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) throw new Error(`${label}_EXECUTABLE_NOT_FOUND`);
  return executable;
}

function startServer() {
  const server = http.createServer((request, response) => {
    if (request.url === '/' || request.url === '/program-interest.html') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      response.end(fs.readFileSync(FORM_PATH));
      return;
    }
    if (request.url === '/assets/culturecode-logo-dark.jpg') {
      response.writeHead(200, { 'content-type': 'image/jpeg' });
      response.end(fs.readFileSync(path.join(ROOT, 'assets', 'culturecode-logo-dark.jpg')));
      return;
    }
    if (request.url === '/favicon.ico') {
      response.writeHead(204);
      response.end();
      return;
    }
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('not found');
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function safeUrl(value) {
  const url = new URL(value);
  if (url.hostname === 'script.googleusercontent.com') {
    return `${url.origin}${url.pathname}`;
  }
  return value;
}

async function verifyExternalTargetRoutes() {
  assert.equal(Boolean(TARGET_URL), true, 'EXTERNAL_TARGET_REQUIRED');
  assert.equal(Boolean(EXPECTED_RELEASE.id), true, 'EXPECTED_RELEASE_ID_REQUIRED');
  assert.equal(Boolean(EXPECTED_RELEASE.commit), true, 'EXPECTED_RELEASE_COMMIT_REQUIRED');
  assert.equal(Boolean(EXPECTED_RELEASE.manifest), true, 'EXPECTED_RELEASE_MANIFEST_REQUIRED');
  const spec = JSON.parse(fs.readFileSync(RELEASE_SPEC_PATH, 'utf8'));
  const expectedHeaders = {
    'x-release-id': EXPECTED_RELEASE.id,
    'x-release-commit': EXPECTED_RELEASE.commit,
    'x-release-manifest': EXPECTED_RELEASE.manifest
  };
  const routes = [];

  for (const route of spec.routes) {
    const url = new URL(route.path, `${TARGET_ORIGIN}/`);
    url.searchParams.set('_a4_read_only_probe', Date.now().toString());
    const headers = {
      'cache-control': 'no-store, no-cache, must-revalidate',
      pragma: 'no-cache'
    };
    if (BYPASS_SECRET) headers['x-vercel-protection-bypass'] = BYPASS_SECRET;
    const response = await fetch(url, { method: 'GET', redirect: 'manual', headers });
    const body = await response.text();
    const missingExpected = (route.expectedTexts || []).filter((text) => !body.includes(text));
    const foundForbidden = (route.forbiddenTexts || []).filter((text) => body.includes(text));
    const releaseHeaders = Object.fromEntries(
      Object.keys(expectedHeaders).map((name) => [name, response.headers.get(name)])
    );
    const result = {
      route: route.path,
      status: response.status,
      location: response.headers.get('location'),
      missingExpected,
      foundForbidden,
      releaseHeaders
    };
    routes.push(result);
    assert.equal(result.status, 200, `ROUTE_HTTP_NOT_200 ${route.path}`);
    assert.deepEqual(result.missingExpected, [], `ROUTE_EXPECTED_TEXT_MISSING ${route.path}`);
    assert.deepEqual(result.foundForbidden, [], `ROUTE_FORBIDDEN_TEXT_FOUND ${route.path}`);
    for (const [name, expected] of Object.entries(expectedHeaders)) {
      assert.equal(result.releaseHeaders[name], expected, `ROUTE_RELEASE_HEADER_MISMATCH ${route.path} ${name}`);
    }
  }

  return {
    specPath: RELEASE_SPEC_PATH,
    routeCount: routes.length,
    externalWrites: 'NONE',
    routes
  };
}

async function runBrowserCase(serverPort, config) {
  const executablePath = config.browserName === 'brave'
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
  const context = config.incognito
    ? await browser.createIncognitoBrowserContext()
    : browser.defaultBrowserContext();
  const page = await context.newPage();
  await page.setViewport(config.viewport);

  const trace = {
    id: config.id,
    browserName: config.browserName,
    browserVersion: await browser.version(),
    incognito: config.incognito,
    viewport: config.viewport,
    requests: [],
    responses: [],
    failedRequests: [],
    blockedWrites: [],
    consoleErrors: [],
    pageErrors: []
  };

  page.on('console', (message) => {
    if (message.type() === 'error') {
      const location = message.location();
      trace.consoleErrors.push({
        text: message.text(),
        url: location && location.url ? safeUrl(location.url) : ''
      });
    }
  });
  page.on('pageerror', (error) => trace.pageErrors.push(error.message));
  page.on('response', (response) => {
    const url = response.url();
    if (url.startsWith(WEBAPP_URL) || url.startsWith('https://script.googleusercontent.com/macros/')) {
      trace.responses.push({
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
        url: safeUrl(url)
      });
    }
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (url.startsWith(WEBAPP_URL) || url.startsWith('https://script.googleusercontent.com/macros/')) {
      trace.failedRequests.push({
        method: request.method(),
        error: request.failure() ? request.failure().errorText : 'UNKNOWN',
        url: safeUrl(url)
      });
    }
  });

  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    const method = request.method().toUpperCase();
    const url = request.url();
    try {
      if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
        trace.blockedWrites.push({ method, url: safeUrl(url) });
        await request.abort('blockedbyclient');
        return;
      }
      if (url.startsWith(WEBAPP_URL)) {
        trace.requests.push({ method, url: safeUrl(url) });
      }
      if (TARGET_ORIGIN && BYPASS_SECRET && new URL(url).origin === TARGET_ORIGIN) {
        await request.continue({
          headers: {
            ...request.headers(),
            'x-vercel-protection-bypass': BYPASS_SECRET
          }
        });
        return;
      }
      await request.continue();
    } catch (error) {
      if (!request.isInterceptResolutionHandled()) {
        try { await request.abort('failed'); } catch (_) {}
      }
    }
  });

  await page.evaluateOnNewDocument((key, uuid, endpoint) => {
    window.__PROGRAM_INTEREST_A4_STATUS_RESPONSES__ = [];
    const nativeFetch = window.fetch.bind(window);
    window.fetch = async function (...args) {
      const response = await nativeFetch(...args);
      const requestUrl = String(args[0] || '');
      if (requestUrl.startsWith(endpoint)) {
        response.clone().text().then((body) => {
          window.__PROGRAM_INTEREST_A4_STATUS_RESPONSES__.push({
            url: requestUrl,
            status: response.status,
            body
          });
        }).catch(() => {});
      }
      return response;
    };
    sessionStorage.setItem(key, JSON.stringify({
      version: 2,
      interestUuid: uuid,
      payloadFingerprint: 'a'.repeat(64),
      phase: 'checking',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }));
  }, PENDING_STATE_KEY, RECORDED_UUID, WEBAPP_URL);

  try {
    const startedAt = Date.now();
    const pageTarget = TARGET_URL || `http://127.0.0.1:${serverPort}/program-interest.html`;
    const navigationResponse = await page.goto(pageTarget, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    const navigationHeaders = navigationResponse ? navigationResponse.headers() : {};
    trace.page = {
      requestedUrl: pageTarget,
      finalUrl: page.url(),
      status: navigationResponse ? navigationResponse.status() : null,
      releaseHeaders: {
        id: navigationHeaders['x-release-id'] || null,
        commit: navigationHeaders['x-release-commit'] || null,
        manifest: navigationHeaders['x-release-manifest'] || null
      }
    };
    assert.equal(trace.page.status, 200, 'TARGET_PAGE_HTTP_NOT_200');
    assert.equal(new URL(trace.page.finalUrl).origin, new URL(pageTarget).origin, 'TARGET_PAGE_REDIRECTED_OFF_ORIGIN');
    if (EXPECTED_RELEASE.id) assert.equal(trace.page.releaseHeaders.id, EXPECTED_RELEASE.id, 'RELEASE_ID_MISMATCH');
    if (EXPECTED_RELEASE.commit) assert.equal(trace.page.releaseHeaders.commit, EXPECTED_RELEASE.commit, 'RELEASE_COMMIT_MISMATCH');
    if (EXPECTED_RELEASE.manifest) assert.equal(trace.page.releaseHeaders.manifest, EXPECTED_RELEASE.manifest, 'RELEASE_MANIFEST_MISMATCH');
    await page.waitForFunction(() => {
      const status = document.querySelector('#form-status');
      return status && status.classList.contains('is-success');
    }, { timeout: UI_WAIT_TIMEOUT_MS });
    await page.waitForFunction(() => (
      Array.isArray(window.__PROGRAM_INTEREST_A4_STATUS_RESPONSES__) &&
      window.__PROGRAM_INTEREST_A4_STATUS_RESPONSES__.some((entry) => entry.status === 200)
    ), { timeout: 5000 });
    trace.elapsedMs = Date.now() - startedAt;
    trace.ui = await page.evaluate((key) => {
      const status = document.querySelector('#form-status');
      return {
        text: status ? status.textContent : '',
        className: status ? status.className : '',
        pendingStateCleared: sessionStorage.getItem(key) === null
      };
    }, PENDING_STATE_KEY);
    const capturedStatusResponses = await page.evaluate(() => (
      window.__PROGRAM_INTEREST_A4_STATUS_RESPONSES__ || []
    ));
    trace.statusPayloads = capturedStatusResponses.map((entry) => {
      const callback = new URL(entry.url).searchParams.get('callback') || '';
      const prefix = `${callback}(`;
      const parsed = entry.status === 200 && callback && entry.body.startsWith(prefix) && entry.body.endsWith(');')
        ? JSON.parse(entry.body.slice(prefix.length, -2))
        : null;
      return {
        status: entry.status,
        state: parsed ? parsed.state : null,
        interestUuid: parsed ? parsed.interestUuid : null
      };
    });

    assert.equal(trace.blockedWrites.length, 0, 'UNEXPECTED_EXTERNAL_WRITE_ATTEMPT');
    assert.equal(trace.requests.length >= 1, true, 'STATUS_GET_NOT_OBSERVED');
    trace.requests.forEach((request) => {
      assert.equal(request.method, 'GET');
      const url = new URL(request.url);
      assert.equal(url.searchParams.get('action'), 'checkProgramInterestStatus');
      assert.equal(url.searchParams.get('interestUuid'), RECORDED_UUID);
      assert.match(url.searchParams.get('callback') || '', /^programInterestJsonp_[0-9a-f]{32}$/i);
    });
    assert.equal(
      trace.responses.some((response) => response.status === 200 && /javascript/i.test(response.contentType)),
      true,
      'STATUS_HTTP_200_JAVASCRIPT_NOT_OBSERVED'
    );
    assert.equal(
      trace.statusPayloads.some((payload) => (
        payload.status === 200 &&
        payload.state === 'recorded' &&
        payload.interestUuid === RECORDED_UUID
      )),
      true,
      'STATUS_RECORDED_UUID_NOT_OBSERVED'
    );
    assert.equal(trace.ui.pendingStateCleared, true);
    assert.match(trace.ui.text, /đã ghi nhận thông tin quan tâm/i);
    assert.deepEqual(trace.pageErrors, [], `BROWSER_PAGE_ERRORS_PRESENT ${JSON.stringify(trace.pageErrors)}`);
    trace.transientStatusConsoleErrors = trace.consoleErrors.filter((entry) => (
      entry.url.startsWith(WEBAPP_URL) ||
      entry.url.startsWith('https://script.googleusercontent.com/macros/')
    ));
    const unexpectedConsoleErrors = trace.consoleErrors.filter((entry) => (
      !trace.transientStatusConsoleErrors.includes(entry)
    ));
    assert.deepEqual(
      unexpectedConsoleErrors,
      [],
      `BROWSER_CONSOLE_ERRORS_PRESENT ${JSON.stringify(unexpectedConsoleErrors)}`
    );

    const screenshotPath = path.join(EVIDENCE_DIR, config.screenshot);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    trace.screenshot = config.screenshot;
    trace.verdict = 'VERIFIED_READ_ONLY';
    return trace;
  } finally {
    await browser.close();
  }
}

async function main() {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  assert.equal(['local', 'staged', 'production'].includes(TARGET_PHASE), true, 'TARGET_PHASE_INVALID');
  assert.equal(Boolean(TARGET_URL) || TARGET_PHASE === 'local', true, 'NON_LOCAL_PHASE_REQUIRES_TARGET_URL');
  if (TARGET_URL) {
    const target = new URL(TARGET_URL);
    const isLoopback = target.hostname === '127.0.0.1' || target.hostname === 'localhost';
    assert.equal(target.protocol === 'https:' || isLoopback, true, 'EXTERNAL_TARGET_MUST_USE_HTTPS');
  }
  const routeVerification = TARGET_URL ? await verifyExternalTargetRoutes() : null;
  const server = TARGET_URL ? null : await startServer();
  const serverPort = server ? server.address().port : null;
  const matrix = [
    {
      id: 'A4-BROWSER-CHROME-DESKTOP',
      browserName: 'chrome',
      incognito: false,
      viewport: { width: 1440, height: 900 },
      screenshot: 'chrome-desktop-read-only-1440x900.png'
    },
    {
      id: 'A4-BROWSER-CHROME-INCOGNITO-MOBILE',
      browserName: 'chrome',
      incognito: true,
      viewport: { width: 390, height: 844 },
      screenshot: 'chrome-incognito-read-only-390x844.png'
    },
    {
      id: 'A4-BROWSER-BRAVE-MOBILE',
      browserName: 'brave',
      incognito: false,
      viewport: { width: 390, height: 844 },
      screenshot: 'brave-read-only-390x844.png'
    }
  ];
  const selectedCase = process.env.PROGRAM_INTEREST_BROWSER_CASE || '';
  const selectedMatrix = selectedCase
    ? matrix.filter((config) => config.id === selectedCase)
    : matrix;
  assert.equal(selectedMatrix.length >= 1, true, 'BROWSER_CASE_NOT_FOUND');
  const results = [];

  try {
    for (const config of selectedMatrix) {
      results.push(await runBrowserCase(serverPort, config));
    }
    const report = {
      verdict: TARGET_PHASE === 'production'
        ? 'LIVE_VERIFIED_A4'
        : (TARGET_PHASE === 'staged' ? 'STAGED_RELEASE_VERIFIED_A4' : 'A4_BROWSER_READ_ONLY_VERIFIED'),
      testedAt: new Date().toISOString(),
      sourceRoot: ROOT,
      sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(FORM_PATH)).digest('hex'),
      pageTarget: TARGET_URL || 'LOCAL_HARNESS',
      targetMode: TARGET_URL ? 'EXTERNAL_READ_ONLY' : 'LOCAL_READ_ONLY',
      targetPhase: TARGET_PHASE,
      protectionBypass: BYPASS_SECRET ? 'SCOPED_TO_TARGET_ORIGIN' : 'NOT_SET',
      expectedRelease: EXPECTED_RELEASE,
      routeVerification,
      endpoint: WEBAPP_URL,
      recordedUuid: RECORDED_UUID,
      externalWrites: 'NONE',
      sheetMutation: 'NONE',
      results
    };
    fs.writeFileSync(RESULT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const failure = {
    verdict: TARGET_PHASE === 'production'
      ? 'LIVE_VERIFICATION_FAILED_A4'
      : (TARGET_PHASE === 'staged' ? 'STAGED_RELEASE_FAILED_A4' : 'A4_BROWSER_READ_ONLY_FAILED'),
    testedAt: new Date().toISOString(),
    sourceRoot: ROOT,
    externalWrites: 'NONE_OR_BLOCKED',
    error: error.message
  };
  fs.writeFileSync(RESULT_PATH, `${JSON.stringify(failure, null, 2)}\n`, 'utf8');
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
