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
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec';
const TEST_NAME = 'UAT Program Interest';
const TEST_EMAIL = 'uat-program-interest@example.invalid';
const TEST_PHONE = '0000000000';
let uatPort = 0;

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
  if (kind === 'error') return { state: 'error', error: 'UPSTREAM_TEMPORARY' };
  return { state: 'not_found', interestUuid: uuid };
}

async function runScenario({ name, statuses, post = 'recorded', viewport = { width: 1440, height: 900 }, disableRandomUuid = false, repeatSubmit = false }) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument((shouldDisable) => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    if (shouldDisable && window.crypto) {
      try {
        Object.defineProperty(window.crypto, 'randomUUID', { configurable: true, value: undefined });
      } catch (_) {
        // The browser may expose randomUUID as non-configurable; the test still checks the source fallback guard.
      }
    }
    window.setTimeout = function (callback, delay, ...args) {
      return nativeSetTimeout(callback, delay >= 8000 ? 100 : delay >= 1000 ? 5 : delay, ...args);
    };
  }, disableRandomUuid);

  const postBodies = [];
  const statusUrls = [];
  const consoleMessages = [];
  const consoleObjects = [];
  let statusIndex = 0;
  let postCount = 0;
  page.on('console', async (message) => {
    consoleMessages.push(message.text());
    try {
      consoleObjects.push(await Promise.all(message.args().map((handle) => handle.jsonValue())));
    } catch (_) {
      consoleObjects.push([]);
    }
  });
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    if (!request.url().startsWith(WEBAPP_URL)) {
      await request.continue();
      return;
    }

    try {
      if (request.method() === 'POST') {
        postCount += 1;
        postBodies.push(JSON.parse(request.postData() || '{}'));
        if (post === 'network') {
          await request.abort('failed');
        } else {
          await request.respond({ status: 204, body: '' });
        }
        return;
      }

      const url = new URL(request.url());
      if (request.method() === 'OPTIONS') {
        await request.respond({ status: 204, body: '' });
        return;
      }
      if (url.searchParams.get('action') !== 'checkProgramInterestStatus') {
        await request.continue();
        return;
      }
      const callback = url.searchParams.get('callback');
      const uuid = url.searchParams.get('interestUuid');
      statusUrls.push(request.url());
      const kind = statuses[Math.min(statusIndex++, statuses.length - 1)] || 'not_found';
      if (kind === 'timeout') {
        setTimeout(() => {
          if (!request.isInterceptResolutionHandled()) request.abort('timedout').catch(() => {});
        }, 150);
        return;
      }
      if (kind === 'network') {
        await request.abort('failed');
        return;
      }
      await request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: `${callback}(${JSON.stringify(responseFor(kind, uuid))});`
      });
    } catch (error) {
      if (!request.isInterceptResolutionHandled()) throw error;
    }
  });

  if (!uatPort) throw new Error('UAT_SERVER_PORT_MISSING');
  await page.goto(`http://127.0.0.1:${uatPort}/program-interest.html`, { waitUntil: 'domcontentloaded' });

  const submit = async () => {
    await page.evaluate(() => {
      const set = (selector, value) => {
        const field = document.querySelector(selector);
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('#fullName', 'UAT Program Interest');
      set('#email', 'uat-program-interest@example.invalid');
      set('#phone', '0000000000');
      const program = document.querySelector('#program-culture101');
      if (!program.checked) program.click();
      const consent = document.querySelector('#consent');
      if (!consent.checked) consent.click();
      document.querySelector('#interest-form').requestSubmit();
    });
    await page.waitForFunction(() => {
      const box = document.querySelector('#form-status');
      return box && (box.classList.contains('is-success') || box.classList.contains('is-error') || box.dataset.errorCode);
    }, { timeout: 5000 });
  };

  await submit();
  if (repeatSubmit) await submit();
  const result = await page.$eval('#form-status', (box) => ({
    text: box.textContent,
    state: box.className,
    errorCode: box.dataset.errorCode || '',
    viewport: { width: window.innerWidth, height: window.innerHeight }
  }));
  await new Promise((resolve) => setTimeout(resolve, 25));
  const output = { name, result, postCount, postBodies, statusCount: statusUrls.length, statusUrls, consoleMessages, consoleObjects };
  await browser.close();
  return output;
}

async function main() {
  const server = await startServer();
  const address = server.address();
  uatPort = address.port;

  try {
    const results = [];
    results.push(await runScenario({ name: 'AT-01 timeout then recorded', statuses: ['timeout', 'recorded'] }));
    assert.equal(results.at(-1).result.state.includes('is-success'), true);
    assert.equal(results.at(-1).statusCount, 2);
    assert.equal(results.at(-1).statusUrls[0].match(/interestUuid=([^&]+)/)[1], results.at(-1).statusUrls[1].match(/interestUuid=([^&]+)/)[1]);

    results.push(await runScenario({ name: 'AT-02 POST error then recorded', statuses: ['recorded'], post: 'network' }));
    assert.equal(results.at(-1).result.state.includes('is-success'), true);
    assert.equal(results.at(-1).consoleObjects.some((entry) => entry.some((value) => value && value.code === 'POST_NETWORK_ERROR')), true);

    results.push(await runScenario({ name: 'AT-03 not found twice then recorded', statuses: ['not_found', 'not_found', 'recorded'] }));
    assert.equal(results.at(-1).result.state.includes('is-success'), true);
    assert.equal(results.at(-1).statusCount, 3);

    results.push(await runScenario({ name: 'AT-04 confirmation unavailable', statuses: ['timeout', 'timeout', 'timeout', 'timeout'] }));
    assert.equal(results.at(-1).result.errorCode, 'CONFIRMATION_UNAVAILABLE');
    assert.match(results.at(-1).result.text, /chưa kiểm tra được trạng thái/);
    assert.doesNotMatch(results.at(-1).result.text, /chưa coi lượt này là thành công/);

    results.push(await runScenario({ name: 'AT-05 invalid UUID', statuses: ['invalid'] }));
    assert.equal(results.at(-1).result.errorCode, 'INVALID_UUID');
    assert.equal(results.at(-1).statusCount, 1);

    results.push(await runScenario({ name: 'AT-06 UUID mismatch', statuses: ['mismatch'] }));
    assert.equal(results.at(-1).result.errorCode, 'STATUS_UUID_MISMATCH');
    assert.equal(results.at(-1).statusCount, 1);

    results.push(await runScenario({ name: 'AT-07 32 hex fallback', statuses: ['recorded'], disableRandomUuid: true }));
    assert.match(results.at(-1).postBodies[0].interestUuid, /^[0-9a-f]{32}$/i);

    results.push(await runScenario({ name: 'AT-08 same UUID resubmit', statuses: ['not_found', 'not_found', 'not_found', 'not_found', 'recorded'], repeatSubmit: true }));
    assert.equal(results.at(-1).postCount, 2);
    assert.equal(results.at(-1).postBodies[0].interestUuid, results.at(-1).postBodies[1].interestUuid);

    results.push(await runScenario({ name: 'AT-09 no PII in status URL or console', statuses: ['recorded'] }));
    const audit = results.at(-1);
    assert.equal(audit.statusUrls.some((url) => /UAT|example\.invalid|0000000000/i.test(url)), false);
    assert.equal(audit.consoleMessages.some((message) => /UAT Program Interest|example\.invalid|0000000000/i.test(message)), false);

    const desktop = await runScenario({ name: 'AT-10 desktop', statuses: ['recorded'], viewport: { width: 1440, height: 900 } });
    const mobile = await runScenario({ name: 'AT-10 mobile', statuses: ['recorded'], viewport: { width: 390, height: 844 } });
    assert.equal(desktop.result.state.includes('is-success'), true);
    assert.equal(mobile.result.state.includes('is-success'), true);
    results.push(desktop, mobile);

    process.stdout.write(JSON.stringify({
      verdict: 'LOCAL_UAT_VERIFIED',
      tests: results.map(({ name, result, postCount, statusCount, postBodies }) => ({
        name,
        state: result.state,
        errorCode: result.errorCode,
        postCount,
        statusCount,
        uuid: postBodies[0] && postBodies[0].interestUuid
      }))
    }, null, 2) + '\n');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
