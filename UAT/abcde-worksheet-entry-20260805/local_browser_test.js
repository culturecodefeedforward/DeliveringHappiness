const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const outputDir = __dirname;

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const responseErrors = [];
  page.on('pageerror', (error) => consoleErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      responseErrors.push({ url: response.url(), status: response.status() });
    }
  });

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4173/index.html', { waitUntil: 'networkidle0' });

  const landing = {
    href: await page.$eval('a[href="/practice-abcde"]', (element) => element.getAttribute('href')),
    text: await page.$eval('a[href="/practice-abcde"]', (element) => element.textContent.trim()),
    primaryText: await page.$eval('#btn-abcde-chat', (element) => element.textContent.trim()),
    noHorizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  };
  await page.$eval('.hero-actions', (element) => element.scrollIntoView({ block: 'center' }));
  await new Promise((resolve) => setTimeout(resolve, 700));
  landing.ctaVisible = await page.$eval('.abcde-entry-actions', (element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
  });
  await page.screenshot({ path: path.join(outputDir, 'landing-desktop-1440x900.png') });

  await page.click('#btn-abcde-chat');
  await page.waitForSelector('#abcdeChatModal.abcde-active');
  const chat = { modalOpened: true };
  await page.keyboard.press('Escape');
  chat.modalClosed = await page.$eval('#abcdeChatModal', (element) => !element.classList.contains('abcde-active'));

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.$eval('.hero-actions', (element) => element.scrollIntoView({ block: 'center' }));
  await new Promise((resolve) => setTimeout(resolve, 700));
  const mobile = {
    noHorizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    linkVisible: await page.$eval('a[href="/practice-abcde"]', (element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }),
    ctaVisible: await page.$eval('.abcde-entry-actions', (element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
    }),
  };
  await page.screenshot({ path: path.join(outputDir, 'landing-mobile-390x844.png') });

  const worksheetResponse = await page.goto('http://127.0.0.1:4173/practice-abcde.html', { waitUntil: 'networkidle0' });
  const worksheet = {
    status: worksheetResponse.status(),
    title: await page.title(),
    heading: await page.$eval('h1', (element) => element.textContent.replace(/\s+/g, ' ').trim()),
    backHref: await page.$eval('.logo-area a', (element) => element.getAttribute('href')),
    noHorizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  };

  const result = { target: 'local-http://127.0.0.1:4173', landing, chat, mobile, worksheet, consoleErrors, responseErrors };
  fs.writeFileSync(path.join(outputDir, 'local-browser-result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
