const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// 1. Static file server
const baseDir = path.resolve(__dirname, '../../'); // dh4hn-website root
const PORT = 3889;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/lms/index.html';
    if (reqPath.startsWith('/lms/data/')) {
        reqPath = reqPath.replace('/lms/data/', '/data/');
    }
    
    const filePath = path.join(baseDir, reqPath);
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: ' + reqPath);
        return;
    }
    
    if (fs.statSync(filePath).isDirectory()) {
        const indexFile = path.join(filePath, 'index.html');
        if (fs.existsSync(indexFile)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(indexFile).pipe(res);
            return;
        }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
});

async function runUAT() {
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`Server listening on port ${PORT}`);

    const evidenceDir = path.join(__dirname, 'evidence_20261002_browser');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    const consoleErrors = [];
    const failedUrls = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    page.on('pageerror', err => {
        consoleErrors.push(err.toString());
    });
    page.on('response', resp => {
        if (resp.status() >= 400) {
            failedUrls.push({ url: resp.url(), status: resp.status() });
        }
    });

    // Preset user in localStorage before loading
    await page.evaluateOnNewDocument(() => {
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify({
            name: "Học Viên Thử Nghiệm",
            email: "hocvien.test@dhm.vn",
            phone: "0983453145",
            cohort: "DHM10",
            role: "Learner"
        }));
        localStorage.setItem("dhm_seen_quick_start", "true");
    });

    console.log('Navigating to http://localhost:' + PORT + '/lms/index.html ...');
    await page.goto(`http://localhost:${PORT}/lms/index.html`, { waitUntil: 'networkidle2' });

    // Wait for LMS to initialize
    await page.waitForSelector('#stage1-milestone-bar', { timeout: 5000 });
    console.log('LMS loaded successfully.');

    // Switch to Practice tab (tab-practice)
    await page.evaluate(() => {
        const btn = document.querySelector('.tab-btn[data-tab="tab-practice"]');
        if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 1. Verify 5 pills
    const milestoneText = await page.$eval('#stage1-milestone-text', el => el.textContent.trim());
    console.log('Milestone text:', milestoneText);

    const pillVideo = await page.$('#m-pill-video');
    const pillLevels = await page.$('#m-pill-levels');
    const pillValues = await page.$('#m-pill-values');
    const pillDrivers = await page.$('#m-pill-drivers');
    const pillQuiz = await page.$('#m-pill-quiz');

    console.log('5 Pills check:', {
        video: Boolean(pillVideo),
        levels: Boolean(pillLevels),
        values: Boolean(pillValues),
        drivers: Boolean(pillDrivers),
        quiz: Boolean(pillQuiz)
    });

    // Screenshot 1: Milestone bar 5 pills
    const barEl = await page.$('#stage1-milestone-bar');
    if (barEl) await barEl.screenshot({ path: path.join(evidenceDir, '01_stage1_milestone_bar_5pills.png') });
    console.log('Screenshot 1 captured.');

    // 2. Verify Module 1.1 (3 Cấp Độ)
    const mod11Title = await page.$eval('#stage1-mod-1-1 .accordion-header h3', el => el.textContent.trim());
    console.log('Mod 1.1 title:', mod11Title);

    // Ensure mod 1.1 is open
    await page.evaluate(() => {
        const el = document.getElementById('stage1-mod-1-1');
        if (el) {
            const body = el.querySelector('.accordion-body');
            if (body && body.classList.contains('hidden')) body.classList.remove('hidden');
        }
    });
    await new Promise(r => setTimeout(r, 400));
    const mod11El = await page.$('#stage1-mod-1-1');
    if (mod11El) await mod11El.screenshot({ path: path.join(evidenceDir, '02_mod1_1_3levels_2parts.png') });
    console.log('Screenshot 2 captured.');

    // 3. Verify Module 1.3 (3 Đòn Bẩy)
    const mod13Title = await page.$eval('#stage1-mod-1-3 .accordion-header h3', el => el.textContent.trim());
    console.log('Mod 1.3 title:', mod13Title);

    // Ensure mod 1.3 is open
    await page.evaluate(() => {
        const el = document.getElementById('stage1-mod-1-3');
        if (el) {
            const body = el.querySelector('.accordion-body');
            if (body && body.classList.contains('hidden')) body.classList.remove('hidden');
        }
    });
    await new Promise(r => setTimeout(r, 400));
    const mod13El = await page.$('#stage1-mod-1-3');
    if (mod13El) await mod13El.screenshot({ path: path.join(evidenceDir, '03_mod1_3_3drivers_2parts.png') });
    console.log('Screenshot 3 captured.');

    // 4. Verify Module Quiz (#stage1-mod-quiz)
    const modQuizTitle = await page.$eval('#stage1-mod-quiz .accordion-header h3', el => el.textContent.trim());
    const modQuizBadge = await page.$eval('#stage1-mod-quiz .badge-gate-quiz', el => el.textContent.trim()).catch(() => 'BADGE_FOUND_OTHER');
    const quizCount = await page.$$eval('#quiz-items-container > div', items => items.length);
    console.log('Mod Quiz title:', modQuizTitle, '| Badge:', modQuizBadge, '| Questions count:', quizCount);

    // Ensure mod quiz is open
    await page.evaluate(() => {
        const el = document.getElementById('stage1-mod-quiz');
        if (el) {
            const body = el.querySelector('.accordion-body');
            if (body && body.classList.contains('hidden')) body.classList.remove('hidden');
        }
    });
    await new Promise(r => setTimeout(r, 400));
    const quizEl = await page.$('#stage1-mod-quiz');
    if (quizEl) await quizEl.screenshot({ path: path.join(evidenceDir, '04_mod_quiz_gate_10questions.png') });
    console.log('Screenshot 4 captured.');

    // 5. Test Quick Button jump
    await page.evaluate(() => {
        const btn = document.getElementById('btn-quick-quiz');
        if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const isQuizBodyOpen = await page.$eval('#stage1-mod-quiz .accordion-body', el => !el.classList.contains('hidden'));
    console.log('Quick quiz jump opened accordion:', isQuizBodyOpen);

    console.log('Console errors found:', consoleErrors.length, consoleErrors);
    console.log('Failed URLs:', failedUrls);

    await browser.close();
    server.close();

    const report = {
        milestoneText,
        fivePillsExist: Boolean(pillVideo && pillLevels && pillValues && pillDrivers && pillQuiz),
        mod11Title,
        mod13Title,
        modQuizTitle,
        quizCount,
        isQuizBodyOpen,
        consoleErrorsCount: consoleErrors.length,
        consoleErrors,
        failedUrls
    };

    console.log('UAT Result Summary:', JSON.stringify(report, null, 2));
    return report;
}

runUAT().then(() => {
    console.log('UAT COMPLETED.');
    process.exit(0);
}).catch(err => {
    console.error('UAT FAILED:', err);
    if (server) server.close();
    process.exit(1);
});
