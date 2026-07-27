const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

function parseArgs(argv = process.argv.slice(2)) {
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
  }
  return parsed;
}

function validateArgs(options) {
  const required = ['phase', 'deploymentUrl', 'specPath', 'releaseId', 'commit', 'manifestHash', 'outDir'];
  const missing = required.filter(key => !options[key]);
  if (missing.length) throw new Error(`Missing required arguments: ${missing.join(', ')}`);
  if (!['staged', 'production'].includes(options.phase)) throw new Error('--phase must be staged or production');
  if (options.phase === 'production' && !options.productionUrl) throw new Error('--production-url is required for production phase');
}

function normalizeBaseUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error(`Only HTTPS targets are allowed: ${value}`);
  return url.origin;
}

function expectedHeaders(options) {
  return {
    'x-release-id': options.releaseId,
    'x-release-commit': options.commit,
    'x-release-manifest': options.manifestHash
  };
}

async function probeRoute(baseUrl, route, options) {
  const url = new URL(route.path, `${baseUrl}/`);
  url.searchParams.set('_release_probe', Date.now().toString());
  const headers = { 'cache-control': 'no-store, no-cache, must-revalidate', pragma: 'no-cache' };
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }
  const response = await fetch(url, { redirect: 'manual', headers });
  const body = await response.text();
  const missingExpected = (route.expectedTexts || []).filter(text => !body.includes(text));
  const foundForbidden = (route.forbiddenTexts || []).filter(text => body.includes(text));
  const headerChecks = Object.entries(expectedHeaders(options)).map(([name, expected]) => ({
    name,
    expected,
    actual: response.headers.get(name),
    pass: response.headers.get(name) === expected
  }));
  const location = response.headers.get('location');
  const pass = response.status === 200
    && missingExpected.length === 0
    && foundForbidden.length === 0
    && headerChecks.every(check => check.pass);
  return {
    route: route.path,
    requestedUrl: url.toString(),
    status: response.status,
    location,
    contentLength: body.length,
    missingExpected,
    foundForbidden,
    headerChecks,
    cache: response.headers.get('x-vercel-cache'),
    age: response.headers.get('age'),
    pass
  };
}

async function probeHttpTarget(name, baseUrl, spec, options) {
  const routes = [];
  for (const route of spec.routes) routes.push(await probeRoute(baseUrl, route, options));
  return { name, baseUrl, routes, pass: routes.every(route => route.pass) };
}

async function probeBrowser(baseUrl, homepageRoute, options) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const report = { desktop: null, mobile: null, consoleErrors: [], pageErrors: [], pass: false };
  try {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      await page.setExtraHTTPHeaders({ 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET });
    }
    page.on('console', message => {
      if (message.type() === 'error') report.consoleErrors.push(message.text());
    });
    page.on('pageerror', error => report.pageErrors.push(error.toString()));

    async function capture(label, viewport) {
      await page.setViewport(viewport);
      const target = new URL(homepageRoute.path, `${baseUrl}/`);
      target.searchParams.set('_browser_probe', `${label}-${Date.now()}`);
      const response = await page.goto(target.toString(), { waitUntil: 'networkidle2', timeout: 60000 });
      const html = await page.content();
      const missingExpected = (homepageRoute.expectedTexts || []).filter(text => !html.includes(text));
      const foundForbidden = (homepageRoute.forbiddenTexts || []).filter(text => html.includes(text));
      const headers = response ? response.headers() : {};
      const headerChecks = Object.entries(expectedHeaders(options)).map(([name, expected]) => ({
        name,
        expected,
        actual: headers[name] || null,
        pass: headers[name] === expected
      }));
      const screenshot = path.join(options.outDir, `${options.phase}-${label}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      return {
        viewport,
        status: response ? response.status() : null,
        finalUrl: page.url(),
        fromCache: response && typeof response.fromCache === 'function' ? response.fromCache() : null,
        missingExpected,
        foundForbidden,
        headerChecks,
        screenshot,
        pass: Boolean(response)
          && response.status() === 200
          && missingExpected.length === 0
          && foundForbidden.length === 0
          && headerChecks.every(check => check.pass)
      };
    }

    report.desktop = await capture('desktop-1440x900', { width: 1440, height: 900 });
    report.mobile = await capture('mobile-390x844', { width: 390, height: 844, isMobile: true });
    report.pass = report.desktop.pass && report.mobile.pass && report.pageErrors.length === 0;
    return report;
  } finally {
    await browser.close();
  }
}

async function run() {
  const options = parseArgs();
  validateArgs(options);
  fs.mkdirSync(options.outDir, { recursive: true });
  const spec = JSON.parse(fs.readFileSync(options.specPath, 'utf8'));
  const deploymentUrl = normalizeBaseUrl(options.deploymentUrl);
  const targets = [{ name: 'deployment', baseUrl: deploymentUrl }];
  if (options.phase === 'production') targets.push({ name: 'production', baseUrl: normalizeBaseUrl(options.productionUrl) });

  const report = {
    timestamp: new Date().toISOString(),
    phase: options.phase,
    release: { releaseId: options.releaseId, commit: options.commit, manifestHash: options.manifestHash },
    targets: [],
    browser: null,
    verdict: 'UNVERIFIED',
    exitCode: 1
  };

  for (const target of targets) report.targets.push(await probeHttpTarget(target.name, target.baseUrl, spec, options));
  if (!report.targets.every(target => target.pass)) {
    report.verdict = `${options.phase.toUpperCase()}_HTTP_FAILED`;
  } else {
    const browserBase = options.phase === 'production' ? normalizeBaseUrl(options.productionUrl) : deploymentUrl;
    report.browser = await probeBrowser(browserBase, spec.routes.find(route => route.path === '/'), options);
    report.verdict = report.browser.pass
      ? (options.phase === 'production' ? 'LIVE_VERIFIED' : 'STAGED_RELEASE_VERIFIED')
      : `${options.phase.toUpperCase()}_BROWSER_FAILED`;
    report.exitCode = report.browser.pass ? 0 : 1;
  }

  const verdictPath = path.join(options.outDir, 'final-verdict.json');
  fs.writeFileSync(verdictPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ verdict: report.verdict, exitCode: report.exitCode, verdictPath }, null, 2));
  process.exit(report.exitCode);
}

run().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
