'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const puppeteer = require('puppeteer');

function parseArgs(argv) {
  const parsed = {
    phase: null,
    deploymentUrl: null,
    productionUrl: null,
    specPath: null,
    releaseId: null,
    commit: null,
    manifestHash: null,
    outDir: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i + 1];
    if (argv[i] === '--phase' && value) parsed.phase = argv[++i];
    else if (argv[i] === '--deployment-url' && value) parsed.deploymentUrl = argv[++i];
    else if (argv[i] === '--production-url' && value) parsed.productionUrl = argv[++i];
    else if (argv[i] === '--spec' && value) parsed.specPath = path.resolve(argv[++i]);
    else if (argv[i] === '--release-id' && value) parsed.releaseId = argv[++i];
    else if (argv[i] === '--commit' && value) parsed.commit = argv[++i];
    else if (argv[i] === '--manifest-hash' && value) parsed.manifestHash = argv[++i];
    else if (argv[i] === '--out-dir' && value) parsed.outDir = path.resolve(argv[++i]);
    else throw new Error('Unknown or incomplete argument: ' + argv[i]);
  }
  return parsed;
}

function validateArgs(options) {
  const required = ['phase', 'deploymentUrl', 'specPath', 'releaseId', 'commit', 'manifestHash', 'outDir'];
  const missing = required.filter((key) => !options[key]);
  if (missing.length) throw new Error('Missing required arguments: ' + missing.join(', '));
  if (!['staged', 'production'].includes(options.phase)) throw new Error('--phase must be staged or production');
  if (options.phase === 'production' && !options.productionUrl) throw new Error('--production-url is required for production phase');
}

function normalizeBaseUrl(value) {
  const url = new URL(value);
  const allowLoopback = process.env.ALLOW_LOOPBACK_HTTP_FOR_SELFTEST === '1' &&
    url.protocol === 'http:' &&
    url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !allowLoopback) {
    throw new Error('Only HTTPS targets are allowed: ' + value);
  }
  return url.origin;
}

function sanitizedUrl(value) {
  const url = new URL(value);
  url.searchParams.delete('_release_probe');
  url.searchParams.delete('_browser_probe');
  return url.toString();
}

function getBypassSecret(overrideSecret) {
  const raw = overrideSecret !== undefined ? overrideSecret : process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
}

async function fetchWithTimeout(url, headers, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs || 30000);
  try {
    return await fetch(url, { method: 'GET', headers, redirect: 'manual', signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function probeRoute(baseUrl, route, opts = {}) {
  const origin = normalizeBaseUrl(baseUrl);
  const bypassSecret = opts.useProtectionBypass ? getBypassSecret(opts.bypassSecret) : null;
  const nonce = Date.now().toString() + Math.random().toString(36).slice(2, 8);
  let current = new URL(route.path, origin + '/');
  current.searchParams.set('_release_probe', nonce);
  const requestedUrl = sanitizedUrl(current.toString());
  const redirects = [];
  let response = null;
  let body = '';
  let firstStatus = null;
  let firstLocationPath = null;
  let routeError = null;

  for (let hop = 0; hop < 6; hop += 1) {
    try {
      const headers = {
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache'
      };
      if (bypassSecret && current.origin === origin) {
        headers['x-vercel-protection-bypass'] = bypassSecret;
      }
      response = await fetchWithTimeout(current.toString(), headers, 30000);
    } catch (error) {
      routeError = 'Network or timeout error: ' + error.message;
      break;
    }

    if (firstStatus === null) firstStatus = response.status;
    const status = response.status;
    if (![301, 302, 303, 307, 308].includes(status)) {
      try {
        body = await response.text();
      } catch (error) {
        routeError = 'Response body read failed: ' + error.message;
      }
      break;
    }

    const location = response.headers.get('location');
    if (!location) {
      routeError = 'Redirect did not include a Location header';
      break;
    }

    let next;
    try {
      next = new URL(location, current);
    } catch (error) {
      routeError = 'Invalid redirect location: ' + location;
      break;
    }

    if (redirects.length === 0) firstLocationPath = next.pathname;
    redirects.push({ status, locationPath: next.pathname });

    if (next.origin !== origin) {
      routeError = 'External redirect blocked';
      break;
    }
    if (/\/(login|sso|auth)(\/|$)/i.test(next.pathname)) {
      routeError = 'Login or authentication redirect blocked';
      break;
    }
    if (hop === 5) {
      routeError = 'Redirect limit exceeded';
      break;
    }

    try {
      await response.arrayBuffer();
    } catch (_) {
    }
    current = next;
  }

  const expectedRedirect = route.expectedRedirect || null;
  const expectedRedirectPass = !expectedRedirect || (
    firstStatus === expectedRedirect.status &&
    firstLocationPath === expectedRedirect.path
  );
  const finalUrl = sanitizedUrl(current.toString());
  const finalPathPass = !route.expectedFinalPath || current.pathname === route.expectedFinalPath;
  const expectedTexts = route.expectedTexts || [];
  const forbiddenTexts = route.forbiddenTexts || [];
  const missingExpected = expectedTexts.filter((text) => !body.includes(text));
  const foundForbidden = forbiddenTexts.filter((text) => body.includes(text));
  let bodySha256 = null;
  if (route.expectedSha256) {
    bodySha256 = crypto.createHash('sha256').update(body, 'utf8').digest('hex').toUpperCase();
  }

  const status = response ? response.status : 0;
  const expectedStatus = route.expectedFinalStatus || 200;
  const hashPass = !route.expectedSha256 || bodySha256 === route.expectedSha256.toUpperCase();
  const pass = !routeError &&
    status === expectedStatus &&
    expectedRedirectPass &&
    finalPathPass &&
    missingExpected.length === 0 &&
    foundForbidden.length === 0 &&
    hashPass;

  return {
    route: route.path,
    requestedUrl,
    initialStatus: firstStatus,
    redirects,
    finalUrl,
    finalStatus: status,
    expectedFinalStatus: expectedStatus,
    expectedRedirectPass,
    expectedFinalPath: route.expectedFinalPath || null,
    finalPathPass,
    missingExpected,
    foundForbidden,
    bodySha256,
    expectedSha256: route.expectedSha256 || null,
    cache: response ? response.headers.get('x-vercel-cache') : null,
    age: response ? response.headers.get('age') : null,
    contentType: response ? response.headers.get('content-type') : null,
    error: routeError,
    pass
  };
}

async function probeHttpTarget(name, baseUrl, spec, opts = {}) {
  const bypassSecret = opts.useProtectionBypass ? getBypassSecret(opts.bypassSecret) : null;
  const routes = [];
  for (const route of spec.routes) {
    routes.push(await probeRoute(baseUrl, route, {
      useProtectionBypass: Boolean(opts.useProtectionBypass),
      bypassSecret
    }));
  }
  return {
    name,
    baseUrl: normalizeBaseUrl(baseUrl),
    protectionBypassHeaderUsed: Boolean(opts.useProtectionBypass && bypassSecret),
    routes,
    pass: routes.every((route) => route.pass)
  };
}

async function probeBrowser(baseUrl, spec, options) {
  const browserRoute = spec.routes.find((route) => route.path === spec.browserPath);
  if (!browserRoute) throw new Error('browserPath is missing from routes: ' + spec.browserPath);

  const browserOrigin = normalizeBaseUrl(baseUrl);
  const bypassSecret = options && options.phase === 'staged'
    ? getBypassSecret(options.bypassSecret)
    : null;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const report = {
    browserPath: spec.browserPath,
    cacheDisabled: true,
    protectionBypassHeaderUsed: Boolean(bypassSecret),
    desktop: null,
    mobile: null,
    consoleErrors: [],
    pageErrors: [],
    blockedNonReadRequests: 0,
    blockedLearnerDataRequests: 0,
    externalWrites: 0,
    pass: false
  };

  try {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    const client = await page.target().createCDPSession();
    if (typeof page.setBypassServiceWorker === 'function') {
      await page.setBypassServiceWorker(true);
    } else {
      await client.send('Network.setBypassServiceWorker', { bypass: true }).catch(() => {});
    }
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      const method = request.method().toUpperCase();
      const requestUrl = request.url();
      let pathname = '';
      let reqOrigin = '';
      try {
        const parsedReq = new URL(requestUrl);
        pathname = parsedReq.pathname.toLowerCase();
        reqOrigin = parsedReq.origin;
      } catch (_) {
      }

      if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        report.blockedNonReadRequests += 1;
        request.abort().catch(() => {});
        return;
      }
      if (/(authorized_roster|master_learners_roster|apollo_heatmap_data|\/data\/|\/api\/)/i.test(pathname)) {
        report.blockedLearnerDataRequests += 1;
        request.abort().catch(() => {});
        return;
      }
      if (bypassSecret && reqOrigin === browserOrigin) {
        const headers = { ...request.headers(), 'x-vercel-protection-bypass': bypassSecret };
        request.continue({ headers }).catch(() => {});
        return;
      }
      request.continue().catch(() => {});
    });

    page.on('console', (message) => {
      if (message.type() === 'error') report.consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => report.pageErrors.push(error.toString()));

    const expectedTexts = spec.browserExpectedTexts || browserRoute.expectedTexts || [];
    const focusText = spec.browserFocusText || expectedTexts[0] || '';
    const viewports = [
      { name: 'desktop-1440x900', width: 1440, height: 900, isMobile: false },
      { name: 'mobile-390x844', width: 390, height: 844, isMobile: true }
    ];

    async function capture(viewport) {
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        isMobile: viewport.isMobile
      });
      const target = new URL(spec.browserPath, browserOrigin + '/');
      target.searchParams.set('_browser_probe', viewport.name + '-' + Date.now());
      let response;
      try {
        response = await page.goto(target.toString(), { waitUntil: 'networkidle2', timeout: 60000 });
      } catch (error) {
        return {
          viewport: viewport.name,
          finalUrl: sanitizedUrl(page.url() || target.toString()),
          status: response ? response.status() : null,
          error: error.message,
          missingVisibleTexts: expectedTexts,
          screenshot: null,
          pass: false
        };
      }

      if (typeof page.waitForTimeout === 'function') {
        await page.waitForTimeout(400);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      const visibleTexts = await page.evaluate((expected) => {
        const bodyText = document.body ? document.body.innerText : '';
        return expected.map((text) => ({ text, visible: bodyText.includes(text) }));
      }, expectedTexts);

      if (focusText) {
        await page.evaluate((text) => {
          const nodes = Array.from(document.querySelectorAll('label, h1, h2, h3, p, span'));
          const targetNode = nodes.find((node) => node.innerText && node.innerText.includes(text));
          if (targetNode && targetNode.scrollIntoView) targetNode.scrollIntoView({ block: 'center' });
        }, focusText);
      }

      const screenshot = path.join(options.outDir, viewport.name + '.png');
      await page.screenshot({ path: screenshot, fullPage: false });
      const headers = response ? response.headers() : {};
      const missingVisibleTexts = visibleTexts.filter((item) => !item.visible).map((item) => item.text);
      return {
        viewport: viewport.name,
        status: response ? response.status() : null,
        finalUrl: sanitizedUrl(page.url()),
        cache: headers['x-vercel-cache'] || null,
        age: headers.age || null,
        visibleTexts,
        missingVisibleTexts,
        screenshot,
        pass: Boolean(response) && response.status() === 200 && missingVisibleTexts.length === 0
      };
    }

    fs.mkdirSync(options.outDir, { recursive: true });
    report.desktop = await capture(viewports[0]);
    report.mobile = await capture(viewports[1]);
    report.pass = report.desktop.pass &&
      report.mobile.pass &&
      report.pageErrors.length === 0;
    return report;
  } finally {
    await browser.close();
  }
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  validateArgs(options);
  if (!fs.existsSync(options.specPath)) throw new Error('Release spec not found: ' + options.specPath);

  const spec = JSON.parse(fs.readFileSync(options.specPath, 'utf8'));
  if (!Array.isArray(spec.routes) || spec.routes.length === 0) throw new Error('Release spec routes must be a non-empty array');
  if (spec.releaseId && spec.releaseId !== options.releaseId) throw new Error('Release ID does not match release spec');
  if (spec.commit && spec.commit !== options.commit) throw new Error('Commit does not match release spec');
  if (spec.manifestSha256 && spec.manifestSha256.toUpperCase() !== options.manifestHash.toUpperCase()) {
    throw new Error('Manifest hash does not match release spec');
  }

  fs.mkdirSync(options.outDir, { recursive: true });
  const deploymentUrl = normalizeBaseUrl(options.deploymentUrl);
  const targets = [{ name: 'deployment', baseUrl: deploymentUrl }];
  if (options.phase === 'production') {
    targets.push({ name: 'production', baseUrl: normalizeBaseUrl(options.productionUrl) });
  }

  const report = {
    timestamp: new Date().toISOString(),
    phase: options.phase,
    release: {
      releaseId: options.releaseId,
      commit: options.commit,
      manifestSha256: options.manifestHash,
      deploymentUrl,
      productionUrl: options.productionUrl ? normalizeBaseUrl(options.productionUrl) : null
    },
    targets: [],
    browser: null,
    externalWrites: 'NONE',
    verdict: 'UNVERIFIED',
    exitCode: 1
  };

  const bypassSecret = getBypassSecret();

  try {
    for (const target of targets) {
      report.targets.push(await probeHttpTarget(target.name, target.baseUrl, spec, {
        useProtectionBypass: target.name === 'deployment',
        bypassSecret
      }));
    }

    if (!report.targets.every((target) => target.pass)) {
      report.verdict = options.phase.toUpperCase() + '_HTTP_FAILED';
    } else {
      const browserBase = options.phase === 'production'
        ? normalizeBaseUrl(options.productionUrl)
        : deploymentUrl;
      report.browser = await probeBrowser(browserBase, spec, options);
      report.verdict = report.browser.pass
        ? (options.phase === 'production' ? 'LIVE_VERIFIED' : 'STAGED_RELEASE_VERIFIED')
        : options.phase.toUpperCase() + '_BROWSER_FAILED';
      report.exitCode = report.browser.pass ? 0 : 1;
    }
  } catch (error) {
    report.error = error.stack || error.message;
    report.verdict = options.phase.toUpperCase() + '_VERIFICATION_ERROR';
  }

  const verdictPath = path.join(options.outDir, 'final-verdict.json');
  fs.writeFileSync(verdictPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({
    verdict: report.verdict,
    exitCode: report.exitCode,
    verdictPath
  }, null, 2));
  return report.exitCode;
}

if (require.main === module) {
  run().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

module.exports = { run, probeRoute, probeHttpTarget, probeBrowser, normalizeBaseUrl };

