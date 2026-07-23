const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    deploymentUrl: null,
    productionUrl: null,
    expectedTexts: [],
    forbiddenTexts: []
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--deployment-url' && args[i + 1]) {
      parsed.deploymentUrl = args[++i];
    } else if (args[i] === '--production-url' && args[i + 1]) {
      parsed.productionUrl = args[++i];
    } else if (args[i] === '--expected-text' && args[i + 1]) {
      parsed.expectedTexts.push(args[++i]);
    } else if (args[i] === '--forbidden-text' && args[i + 1]) {
      parsed.forbiddenTexts.push(args[++i]);
    }
  }

  return parsed;
}

async function runLiveGate() {
  const options = parseArgs();
  console.log('=== VERCEL LIVE VERIFICATION GATE (HOTFIX V1) ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Options:', JSON.stringify(options, null, 2));

  if (!options.productionUrl || !options.deploymentUrl) {
    console.error('Error: Both --production-url and --deployment-url parameters are required.');
    process.exit(1);
  }

  if (options.expectedTexts.length === 0) {
    console.error('Error: At least one --expected-text parameter is required.');
    process.exit(1);
  }

  const rootDir = 'c:/Users/vu.hoang/.gemini/antigravity/scratch/dh4hn-website';
  const uatDir = path.join(rootDir, 'UAT');
  if (!fs.existsSync(uatDir)) fs.mkdirSync(uatDir, { recursive: true });

  let gateFailed = false;
  const auditReport = {
    timestamp: new Date().toISOString(),
    deploymentUrlCheck: {},
    productionUrlHttpCheck: {},
    productionUrlBrowserCheck: {},
    verdict: 'UNVERIFIED',
    exitCode: 1
  };

  // --- LAYER 1: HTTP RAW FETCH CHECKS ---
  console.log('\n--- [LAYER 1] HTTP RAW FETCH PROBE ---');

  // 1.1 Deployment URL HTTP Probe
  try {
    const dplNoCacheUrl = `${options.deploymentUrl}?_nocache=${Date.now()}`;
    const dplRes = await fetch(dplNoCacheUrl, {
      redirect: 'manual',
      headers: { 'cache-control': 'no-store, no-cache, must-revalidate' }
    });

    const locationHeader = dplRes.headers.get('location');
    const isSsoRedirect = dplRes.status >= 300 && dplRes.status < 400 && (locationHeader && (locationHeader.includes('sso') || locationHeader.includes('login') || locationHeader.includes('vercel.com')));

    auditReport.deploymentUrlCheck = {
      requestedUrl: options.deploymentUrl,
      httpStatus: dplRes.status,
      locationHeader: locationHeader || null,
      isSsoRedirect,
      contentState: isSsoRedirect ? 'UNVERIFIED (Redirected to Vercel SSO Protection)' : 'ACCESSIBLE'
    };

    console.log('Deployment URL Status:', dplRes.status);
    if (isSsoRedirect) {
      console.log('⚠️ Deployment URL redirected to Vercel SSO Authentication. Content marked as UNVERIFIED.');
    }
  } catch (err) {
    auditReport.deploymentUrlCheck = { error: err.toString(), contentState: 'UNVERIFIED' };
    console.error('Deployment URL HTTP Error:', err.message);
  }

  // 1.2 Production URL HTTP Probe
  try {
    const prodNoCacheUrl = `${options.productionUrl}?_nocache=${Date.now()}`;
    const prodRes = await fetch(prodNoCacheUrl, {
      redirect: 'manual',
      headers: { 'cache-control': 'no-store, no-cache, must-revalidate' }
    });

    const prodText = await prodRes.text();
    const missingExpected = options.expectedTexts.filter(t => !prodText.includes(t));
    const foundForbidden = options.forbiddenTexts.filter(t => prodText.includes(t));

    const httpPass = prodRes.status === 200 && missingExpected.length === 0 && foundForbidden.length === 0;
    if (!httpPass) gateFailed = true;

    auditReport.productionUrlHttpCheck = {
      requestedUrl: options.productionUrl,
      httpStatus: prodRes.status,
      contentLength: prodText.length,
      missingExpected,
      foundForbidden,
      httpPass
    };

    console.log('Production URL HTTP Status:', prodRes.status);
    console.log('HTTP Missing Expected Texts:', missingExpected);
    console.log('HTTP Found Forbidden Texts:', foundForbidden);
    console.log('Layer 1 HTTP Pass:', httpPass);
  } catch (err) {
    gateFailed = true;
    auditReport.productionUrlHttpCheck = { error: err.toString(), httpPass: false };
    console.error('Production URL HTTP Error:', err.message);
  }

  // --- LAYER 2: BROWSER CDP PROBE ---
  console.log('\n--- [LAYER 2] PUPPETEER CDP BROWSER PROBE ---');
  const consoleErrors = [];
  const pageErrors = [];

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create fresh isolated context
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    // Disable Cache via Chrome DevTools Protocol (CDP)
    const client = await page.target().createCDPSession();
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    console.log('Chrome DevTools Protocol (CDP) Cache Disabled: ACTIVE');

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => pageErrors.push(err.toString()));

    let mainResponseFromCache = false;
    let mainResponseStatus = null;

    page.on('response', res => {
      if (res.url() === options.productionUrl || res.url() === `${options.productionUrl}/`) {
        mainResponseStatus = res.status();
        if (typeof res.fromCache === 'function') {
          mainResponseFromCache = res.fromCache();
        }
      }
    });

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(options.productionUrl, { waitUntil: 'networkidle2' });

    const finalUrl = page.url();
    const pageContent = await page.content();

    const browserMissingExpected = options.expectedTexts.filter(t => !pageContent.includes(t));
    const browserFoundForbidden = options.forbiddenTexts.filter(t => pageContent.includes(t));

    // Save Screenshots
    const desktopScreenshot = path.join(uatDir, 'live_gate_desktop_20260723.png');
    await page.screenshot({ path: desktopScreenshot, fullPage: true });

    await page.setViewport({ width: 375, height: 812, isMobile: true });
    const mobileScreenshot = path.join(uatDir, 'live_gate_mobile_20260723.png');
    await page.screenshot({ path: mobileScreenshot, fullPage: true });

    await browser.close();

    const browserPass = 
      mainResponseStatus === 200 &&
      finalUrl === options.productionUrl &&
      browserMissingExpected.length === 0 &&
      browserFoundForbidden.length === 0 &&
      pageErrors.length === 0;

    if (!browserPass) gateFailed = true;

    auditReport.productionUrlBrowserCheck = {
      mainResponseStatus,
      mainResponseFromCache,
      finalUrl,
      browserMissingExpected,
      browserFoundForbidden,
      consoleErrorsCount: consoleErrors.length,
      pageErrorsCount: pageErrors.length,
      desktopScreenshot,
      mobileScreenshot,
      browserPass
    };

    console.log('Browser Main Response Status:', mainResponseStatus);
    console.log('Browser Response From Cache:', mainResponseFromCache);
    console.log('Browser Final URL:', finalUrl);
    console.log('Browser Missing Expected Texts:', browserMissingExpected);
    console.log('Browser Found Forbidden Texts:', browserFoundForbidden);
    console.log('Layer 2 Browser Pass:', browserPass);

  } catch (err) {
    gateFailed = true;
    auditReport.productionUrlBrowserCheck = { error: err.toString(), browserPass: false };
    console.error('Browser CDP Error:', err.message);
  }

  // --- FINAL VERDICT EVALUATION ---
  console.log('\n=== VERDICT EVALUATION ===');
  if (!gateFailed && auditReport.productionUrlHttpCheck.httpPass && auditReport.productionUrlBrowserCheck.browserPass) {
    auditReport.verdict = 'LIVE_VERIFIED';
    auditReport.exitCode = 0;
    console.log('✅ VERDICT: LIVE_VERIFIED (All public HTTP and Browser CDP checks passed)');
  } else {
    auditReport.verdict = 'LIVE_UNVERIFIED_FAILED';
    auditReport.exitCode = 1;
    console.log('❌ VERDICT: LIVE_UNVERIFIED_FAILED (Public checks detected missing expected text, forbidden text, or errors)');
  }

  const jsonReportPath = path.join(uatDir, 'live_gate_result_20260723.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(auditReport, null, 2));
  console.log('Saved JSON Audit Report:', jsonReportPath);

  process.exit(auditReport.exitCode);
}

runLiveGate();
