const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'UAT', 'screenshots', 'dhm8_referrer_ui_20260623');
fs.mkdirSync(outDir, { recursive: true });

const localPort = process.env.DHM8_UAT_PORT || '8791';
const localUrl = `http://127.0.0.1:${localPort}/register.html`;
const liveUrl = 'https://delivering-happiness.vercel.app/register.html';

async function inspectReferrerUi(page, label) {
  const state = await page.evaluate(() => {
    const block = document.querySelector('#referrerDetailsSection, #referrerDetailsBlock');
    const name = document.querySelector('#referrerName');
    const phone = document.querySelector('#referrerPhone');
    const checked = document.querySelector('input[name="referrerSource"]:checked');
    const style = block ? window.getComputedStyle(block) : null;
    if (block) block.scrollIntoView({ block: 'center', inline: 'nearest' });
    return {
      checkedValue: checked ? checked.value : null,
      blockExists: Boolean(block),
      blockId: block ? block.id : null,
      blockClassName: block ? block.className : null,
      blockDisplay: style ? style.display : null,
      blockMaxHeight: style ? style.maxHeight : null,
      blockOpacity: style ? style.opacity : null,
      blockVisibleByClass: block ? block.classList.contains('visible') : null,
      blockBoundingHeight: block ? block.getBoundingClientRect().height : null,
      nameRequired: name ? name.required : null,
      phoneRequired: phone ? phone.required : null,
      nameDisabled: name ? name.disabled : null,
      phoneDisabled: phone ? phone.disabled : null,
      sourceOptions: Array.from(document.querySelectorAll('input[name="referrerSource"]')).map((el) => el.value),
    };
  });
  await page.screenshot({ path: path.join(outDir, `${label}.png`), fullPage: false });
  return state;
}

async function testLocal(browser, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(localUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="referrerSource"]', { timeout: 5000 });

  const initial = await inspectReferrerUi(page, `local_${viewport.width}x${viewport.height}_initial`);

  await page.check('#refPartnerGem');
  await page.waitForTimeout(350);
  const gem = await inspectReferrerUi(page, `local_${viewport.width}x${viewport.height}_gem`);

  await page.check('#refPartnerSmart');
  await page.waitForTimeout(350);
  const smart = await inspectReferrerUi(page, `local_${viewport.width}x${viewport.height}_smart`);

  await page.check('#refPartnerOther');
  await page.waitForTimeout(350);
  const other = await inspectReferrerUi(page, `local_${viewport.width}x${viewport.height}_other`);

  const mapping = await page.evaluate(() => {
    const form = document.querySelector('form');
    const collect = () => {
      const data = Object.fromEntries(new FormData(form).entries());
      const refSourceVal = data.referrerSource || 'Nguồn khác';
      if (refSourceVal === 'GEM Global' || refSourceVal === 'Smart Train') {
        data.referrerName = refSourceVal;
        data.referrerPhone = '';
      }
      delete data.referrerSource;
      return {
        referrerName: data.referrerName || '',
        referrerPhone: data.referrerPhone || '',
        hasReferrerSource: Object.prototype.hasOwnProperty.call(data, 'referrerSource'),
      };
    };

    document.querySelector('#refPartnerGem').checked = true;
    const gemPayload = collect();
    document.querySelector('#refPartnerSmart').checked = true;
    const smartPayload = collect();
    document.querySelector('#refPartnerOther').checked = true;
    document.querySelector('#referrerName').value = 'Nguyễn Văn A';
    document.querySelector('#referrerPhone').value = '0912345678';
    const otherPayload = collect();
    return { gemPayload, smartPayload, otherPayload };
  });

  await page.close();
  return { viewport, initial, gem, smart, other, mapping };
}

async function inspectLive(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(liveUrl, { waitUntil: 'domcontentloaded' });
  const live = await page.evaluate(() => ({
    url: location.href,
    hasReferrerSource: Boolean(document.querySelector('input[name="referrerSource"]')),
    sourceOptions: Array.from(document.querySelectorAll('input[name="referrerSource"]')).map((el) => el.value),
    hasDetailsBlock: Boolean(document.querySelector('#referrerDetailsBlock')),
  }));
  await page.screenshot({ path: path.join(outDir, 'production_1366x768_referrer_section_probe.png'), fullPage: false });
  await page.close();
  return live;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const result = {
    generatedAt: new Date().toISOString(),
    localUrl,
    liveUrl,
    screenshotsDir: outDir,
    localDesktop: await testLocal(browser, { width: 1366, height: 768 }),
    localMobile: await testLocal(browser, { width: 390, height: 844 }),
    productionProbe: await inspectLive(browser),
  };
  await browser.close();
  console.log(JSON.stringify(result, null, 2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
