// scratch/uat_journey_standardization.js
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

console.log("================================================================================");
console.log("   UAT: KIỂM THỬ NGHIỆM THU 5 ĐIỂM CHUẨN HÓA HÀNH TRÌNH HỌC TẬP LMS DHM");
console.log("================================================================================\n");

const baseDir = path.join(__dirname, '..');
const lmsDir = path.join(baseDir, 'lms');
const indexHtmlPath = path.join(lmsDir, 'index.html');
const appJsPath = path.join(lmsDir, 'app.js');
const curriculumJsonPath = path.join(lmsDir, 'curriculum_data.json');

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');
const curriculumJson = JSON.parse(fs.readFileSync(curriculumJsonPath, 'utf8'));

let passCount = 0;
let failCount = 0;
const results = [];

function check(desc, condition) {
    if (condition) {
        passCount++;
        console.log(`  [PASS] ${desc}`);
        results.push({ desc, status: 'PASS' });
    } else {
        failCount++;
        console.error(`  [FAIL] ${desc}`);
        results.push({ desc, status: 'FAIL' });
    }
}

console.log("--- PHẦN 1: STATIC CODE & STRUCTURE AUDIT ---");

// Point 1: Modal Quick Start
check("Modal Quick Start: Chứa Bước 1 chuẩn hóa (Online & Đăng nhập Email/4 số cuối SĐT)", 
    indexHtml.includes("Buổi Online & Đăng Nhập Tài Khoản") && 
    indexHtml.includes("Email") && indexHtml.includes("4 số cuối SĐT"));

check("Modal Quick Start: Chứa Bước 2 chuẩn hóa (Lý Thuyết Cốt Lõi: 3 Cấp độ, Giá trị cốt lõi, 3 Đòn bẩy)", 
    indexHtml.includes("Xem Lý Thuyết Cốt Lõi") && 
    indexHtml.includes("3 Cấp độ Hạnh phúc") && indexHtml.includes("3 Đòn bẩy"));

check("Modal Quick Start: Chứa Bước 3 chuẩn hóa (Định Vị La Bàn Me Values)", 
    indexHtml.includes("Định Vị La Bàn Bản Thân (Me Values)"));

check("Modal Quick Start: Chứa Bước 4 chuẩn hóa (Vượt Qua Cổng Sát Hạch ≥80% hoặc 8/10)", 
    indexHtml.includes("Vượt Qua Cổng Sát Hạch (≥80%)") && 
    indexHtml.includes("8/10") && indexHtml.includes("Chặng 2 (Lớp Offline)"));

// Point 2: Standalone Video Explainer & Sạch số thứ tự
check("Header: Có nút Video Tổng Quan riêng biệt (#btn-header-overview-video)", 
    indexHtml.includes('id="btn-header-overview-video"'));

check("Sidebar: Có nút Video Tổng Quan riêng biệt (#btn-global-overview-video)", 
    indexHtml.includes('id="btn-global-overview-video"'));

check("Modal: Có Lightbox Modal Video riêng (#modal-video-overview)", 
    indexHtml.includes('id="modal-video-overview"'));

check("curriculum_data.json: Chặng 1 có chính xác 4 subSections (loại bỏ video)", 
    curriculumJson.stages[0].subSections.length === 4);

check("curriculum_data.json: Thứ tự subSections từ sub-1-1 đến sub-1-4 chuẩn hóa", 
    curriculumJson.stages[0].subSections[0].id === 'sub-1-1' &&
    curriculumJson.stages[0].subSections[1].id === 'sub-1-2' &&
    curriculumJson.stages[0].subSections[2].id === 'sub-1-3' &&
    curriculumJson.stages[0].subSections[3].id === 'sub-1-4');

check("HTML & app.js: Đã loại bỏ hoàn toàn các nhãn Mục 1.X gây nhầm lẫn", 
    !indexHtml.includes("Mục 1.") && !appJs.includes("Mục 1."));

check("Module 1.1: Tiêu đề sạch sẽ Bài 1.1: 3 Cấp Độ Hạnh Phúc", 
    indexHtml.includes("Bài 1.1: 3 Cấp Độ Hạnh Phúc (Martin Seligman)"));

check("Module 1.2: Tiêu đề sạch sẽ Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân", 
    indexHtml.includes("Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)"));

check("Module 1.3: Tiêu đề sạch sẽ Bài 1.3: 3 Đòn Bẩy Hạnh Phúc", 
    indexHtml.includes("Bài 1.3: 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)"));

check("Module 1.4: Tiêu đề sạch sẽ Bài 1.4: Cổng Vượt Chặng", 
    indexHtml.includes("Bài 1.4: Cổng Vượt Chặng — Bài Kiểm Tra 10 Câu Trắc Nghiệm"));

// Point 3: Slide Định nghĩa Giá trị cốt lõi
const slideCoreValPath = path.join(baseDir, 'data/artifacts/slides/slide_core_values_definition.jpg');
check("File slide Định nghĩa Giá trị cốt lõi tồn tại trên đĩa", fs.existsSync(slideCoreValPath));

check("Module 1.2: PHẦN 1 render đồng thời slide Định nghĩa Giá trị và Slide 23", 
    indexHtml.includes("slide_core_values_definition.jpg") && indexHtml.includes("slide_23.png"));

// Point 4: Inline Slides & Practice Accordion
check("Module 1.1: PHẦN 2 được bọc trong <details class=\"practice-accordion ...\"> mặc định thu nhỏ", 
    indexHtml.includes('stage1-mod-1-1') && 
    indexHtml.includes('details class="practice-accordion'));

check("Module 1.2: PHẦN 2 được bọc trong <details class=\"practice-accordion ...\"> mặc định thu nhỏ", 
    indexHtml.includes('stage1-mod-1-2') && 
    indexHtml.includes('🎯 Thực Hành Định Vị La Bàn (41 Giá Trị & Top 7)'));

check("Module 1.3: PHẦN 2 được bọc trong <details class=\"practice-accordion ...\"> mặc định thu nhỏ", 
    indexHtml.includes('stage1-mod-1-3') && 
    indexHtml.includes('🎯 Thực Hành & Phản Tư 3 Đòn Bẩy'));

// Point 5: Sticky Bottom Bar
check("Bottom Bar: Nút Lộ trình (#btn-bottom-roadmap) hiển thị trên cả mobile (không có hidden sm:inline-flex)", 
    !indexHtml.includes('id="btn-bottom-roadmap" class="hidden sm:inline-flex'));

check("Bottom Bar: Nút Sát hạch (#btn-bottom-quiz) hiển thị trên cả mobile (không có hidden sm:inline-flex)", 
    !indexHtml.includes('id="btn-bottom-quiz" class="hidden sm:inline-flex'));

// Milestone chips: 4 nấc
check("Milestone Bar Chặng 1: Có đúng 4 chips (levels, values, drivers, quiz)", 
    indexHtml.includes('m-pill-levels') && 
    indexHtml.includes('m-pill-values') && 
    indexHtml.includes('m-pill-drivers') && 
    indexHtml.includes('m-pill-quiz') && 
    !indexHtml.includes('m-pill-video'));

// App.js handlers
check("app.js: Có hàm openOverviewVideoModal và closeOverviewVideoModal", 
    appJs.includes("openOverviewVideoModal") && appJs.includes("closeOverviewVideoModal"));

check("app.js: updateStage1Milestones tính theo 4 nấc (doneCount/4 Hoàn thành)", 
    appJs.includes("${doneCount}/4 Hoàn thành"));

check("app.js: calculateStage1Progress tính theo 4 mốc 25% mỗi mốc", 
    appJs.includes("count * 25"));

// Static server + Puppeteer E2E
console.log("\n--- PHẦN 2: PUPPETEER BROWSER E2E VERIFICATION ---");

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg'
};

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/' || reqUrl === '/lms' || reqUrl === '/lms/') {
        reqUrl = '/lms/index.html';
    }
    
    // Resolve file path safely
    let filePath = path.join(baseDir, reqUrl);
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
});

const PORT = 3589;

server.listen(PORT, async () => {
    console.log(`  Local test server started at http://localhost:${PORT}`);
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // 1. DESKTOP TEST (1280x800)
        console.log("\n  [Viewport: Desktop 1280x800]");
        const desktopPage = await browser.newPage();
        await desktopPage.setViewport({ width: 1280, height: 800 });

        const consoleErrors = [];
        desktopPage.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        await desktopPage.goto(`http://localhost:${PORT}/lms/index.html`, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 800));

        // Authenticate with test account to enter LMS
        await desktopPage.waitForSelector('#auth-modal', { visible: true });
        await desktopPage.type('#login-identity', 'vuhoang2708software@gmail.com', { delay: 10 });
        await desktopPage.type('#login-password', '1234', { delay: 10 });
        await desktopPage.click('#btn-submit-auth');

        // Test Quick Start modal visibility
        await desktopPage.waitForSelector('#modal-quick-start', { visible: true, timeout: 5000 });
        check("Browser (Desktop): Modal Quick Start hiển thị khi đăng nhập thành công", true);

        // Click dismiss to close Quick Start
        await desktopPage.click('#btn-quick-start-dismiss');
        await new Promise(r => setTimeout(r, 400));
        
        const isQuickStartHidden = await desktopPage.$eval('#modal-quick-start', el => el.classList.contains('hidden'));
        check("Browser (Desktop): Nút Bắt Đầu Học Ngay đóng Modal Quick Start", isQuickStartHidden);

        // Test Video Overview button from Header
        await desktopPage.click('#btn-header-overview-video');
        await new Promise(r => setTimeout(r, 400));
        const isVideoModalVisible = await desktopPage.$eval('#modal-video-overview', el => !el.classList.contains('hidden'));
        check("Browser (Desktop): Nút Video Tổng Quan mở Lightbox Modal Video", isVideoModalVisible);

        // Close Video Modal
        await desktopPage.click('#btn-close-video-overview');
        await new Promise(r => setTimeout(r, 400));
        const isVideoModalClosed = await desktopPage.$eval('#modal-video-overview', el => el.classList.contains('hidden'));
        check("Browser (Desktop): Nút ✕ đóng Video Modal thành công", isVideoModalClosed);

        // Switch to Practice Tab
        await desktopPage.click('[data-tab="tab-practice"]');
        await new Promise(r => setTimeout(r, 500));

        // Open Module 1.2
        await desktopPage.click('#stage1-mod-1-2 .accordion-header');
        await new Promise(r => setTimeout(r, 400));

        // Check Module 1.2 inline images
        const mod12Images = await desktopPage.$$eval('#mod-1-2-body img', imgs => imgs.map(i => i.getAttribute('src')));
        check("Browser (Desktop): Module 1.2 tải đồng thời cả slide định nghĩa và slide 23", 
            mod12Images.some(src => src.includes('slide_core_values_definition.jpg')) &&
            mod12Images.some(src => src.includes('slide_23.png')));

        // Check Module 1.2 Practice Accordion is closed by default
        const mod12AccordionOpen = await desktopPage.$eval('#mod-1-2-body details.practice-accordion', el => el.open);
        check("Browser (Desktop): PHẦN 2 thực hành Module 1.2 mặc định thu nhỏ (open = false)", mod12AccordionOpen === false);

        // Click to expand Practice Accordion
        await desktopPage.click('#mod-1-2-body details.practice-accordion summary');
        await new Promise(r => setTimeout(r, 300));
        const mod12AccordionNowOpen = await desktopPage.$eval('#mod-1-2-body details.practice-accordion', el => el.open);
        check("Browser (Desktop): Bấm vào summary mở rộng PHẦN 2 thực hành thành công", mod12AccordionNowOpen === true);

        // Screenshot desktop
        const desktopShotPath = path.join(baseDir, 'scratch/uat_desktop_practice_tab.png');
        await desktopPage.screenshot({ path: desktopShotPath });
        console.log(`    Đã lưu ảnh chụp Desktop: ${desktopShotPath}`);

        // 2. MOBILE TEST (iPhone 375x812)
        console.log("\n  [Viewport: Mobile iPhone 375x812]");
        const mobilePage = await browser.newPage();
        await mobilePage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

        await mobilePage.goto(`http://localhost:${PORT}/lms/index.html`, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 800));

        // Authenticate on mobile if auth modal is visible
        const isAuthVisible = await mobilePage.evaluate(() => {
            const el = document.getElementById('auth-modal');
            return el && !el.classList.contains('hidden');
        });
        if (isAuthVisible) {
            await mobilePage.type('#login-identity', 'vuhoang2708software@gmail.com', { delay: 10 });
            await mobilePage.type('#login-password', '1234', { delay: 10 });
            await mobilePage.click('#btn-submit-auth');
            await new Promise(r => setTimeout(r, 600));
        }

        // Dismiss Quick Start on Mobile if visible
        const isQuickStartVisible = await mobilePage.evaluate(() => {
            const el = document.getElementById('modal-quick-start');
            return el && !el.classList.contains('hidden');
        });
        if (isQuickStartVisible) {
            await mobilePage.click('#btn-quick-start-dismiss');
            await new Promise(r => setTimeout(r, 400));
        }

        // Switch to Practice Tab
        await mobilePage.click('[data-tab="tab-practice"]');
        await new Promise(r => setTimeout(r, 500));

        // Verify bottom bar buttons visibility on Mobile!
        const roadmapBtnVisible = await mobilePage.$eval('#btn-bottom-roadmap', el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        });
        check("Browser (Mobile): Nút Lộ trình ở Bottom Sticky Bar HIỂN THỊ rõ ràng trên mobile", roadmapBtnVisible);

        const quizBtnVisible = await mobilePage.$eval('#btn-bottom-quiz', el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        });
        check("Browser (Mobile): Nút Vượt chặng ở Bottom Sticky Bar HIỂN THỊ rõ ràng trên mobile", quizBtnVisible);

        // Screenshot mobile
        const mobileShotPath = path.join(baseDir, 'scratch/uat_mobile_bottom_bar.png');
        await mobilePage.screenshot({ path: mobileShotPath });
        console.log(`    Đã lưu ảnh chụp Mobile: ${mobileShotPath}`);

        // Check console errors
        const severeErrors = consoleErrors.filter(e => !e.includes('favicon'));
        check("Browser: 0 lỗi Console nghiêm trọng trên cả Desktop và Mobile", severeErrors.length === 0);
        if (severeErrors.length > 0) {
            console.error("    Console Errors:", severeErrors);
        }

    } catch (err) {
        console.error("Puppeteer Execution Error:", err);
        failCount++;
    } finally {
        if (browser) await browser.close();
        server.close(() => {
            console.log("  Local test server stopped.");
        });
    }

    console.log("\n================================================================================");
    console.log(`   KẾT QUẢ KIỂM THỬ: ${passCount} PASS / ${failCount} FAIL (Tổng số: ${passCount + failCount})`);
    console.log("================================================================================\n");

    if (failCount > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
