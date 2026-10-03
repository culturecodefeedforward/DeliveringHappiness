const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const baseDir = path.resolve(__dirname, '../../');
const PORT = 3893;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/lms/index.html';
    const filePath = path.join(baseDir, reqPath);
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('404');
        return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
});

async function testMobile() {
    await new Promise(r => server.listen(PORT, r));
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Mobile viewport (iPhone 14/15)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:' + PORT + '/lms/index.html', { waitUntil: 'networkidle2' });

    // Check header buttons visibility
    const resumeDisplay = await page.$eval('#btn-header-resume', el => window.getComputedStyle(el).display).catch(() => 'error');
    const quizDisplay = await page.$eval('#btn-header-quiz', el => window.getComputedStyle(el).display).catch(() => 'error');
    const quizText = await page.$eval('#btn-header-quiz', el => el.innerText.trim()).catch(() => '');
    const heroTitle = await page.$eval('#hero-quiz-gate-banner h3', el => el.innerText.trim()).catch(() => '');

    console.log('Mobile Verification Results:');
    console.log('  btn-header-resume display (should be none):', resumeDisplay);
    console.log('  btn-header-quiz display (should be flex):', quizDisplay);
    console.log('  btn-header-quiz text:', quizText);
    console.log('  Hero banner title:', heroTitle);
    console.log('  Console errors count:', consoleErrors.length);

    const shotPath = path.join(baseDir, 'lms/UAT/evidence_20261002_browser/05_mobile_header_and_hero_fixed.png');
    await page.screenshot({ path: shotPath, clip: { x: 0, y: 0, width: 390, height: 750 } });
    console.log('Screenshot saved to:', shotPath);

    await browser.close();
    server.close();
}

testMobile().catch(e => { console.error(e); server.close(); process.exit(1); });
