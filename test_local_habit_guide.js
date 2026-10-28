const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runLocalUAT() {
    console.log("=== STARTING LOCAL UAT FOR HABIT TRACKER GUIDE ON WEB LMS ===");
    
    // 1. Start python http.server at dh4hn-website root (port 3344)
    const serverDir = path.resolve(__dirname);
    console.log(`Starting local server at: ${serverDir} on port 3344...`);
    const serverProc = spawn('python', ['-m', 'http.server', '3344'], { cwd: serverDir });
    
    // Wait for server to spin up
    await new Promise(r => setTimeout(r, 1500));
    
    let browser;
    const testResults = [];
    
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        
        // Listen to console logs
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`[Browser Console Error]`, msg.text());
            }
        });

        // Step 1: Open Local LMS
        console.log("Loading http://localhost:3344/lms/ ...");
        await page.goto('http://localhost:3344/lms/', { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Disable modal-quick-start via localStorage to prevent overlap
        await page.evaluate(() => {
            localStorage.setItem("dhm_seen_quick_start", "true");
            const qm = document.getElementById("modal-quick-start");
            if (qm) qm.remove();
        });

        // Step 2: Login as test Coach account
        console.log("Logging in with vuhoang2708software@gmail.com / 1234 ...");
        await page.evaluate(() => {
            const emailInput = document.getElementById("login-identity");
            const pwdInput = document.getElementById("login-password");
            const form = document.getElementById("auth-form");
            if (emailInput && pwdInput && form) {
                emailInput.value = "vuhoang2708software@gmail.com";
                pwdInput.value = "1234";
                form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        // Verify login
        const loggedInName = await page.evaluate(() => {
            const el = document.getElementById("user-display-name");
            return el ? el.textContent.trim() : "";
        });
        const c1Pass = loggedInName.includes("Vũ Hoàng");
        testResults.push({ case: "Case 1: Đăng nhập nhận diện học viên test", pass: c1Pass, detail: loggedInName });

        // Step 3: Navigate to Stage 3 & Practice tab
        console.log("Navigating to Stage 3 -> Tab Practice...");
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("#syllabus-list button"));
            const s3Btn = btns.find(b => b.textContent.includes("Chặng 3"));
            if (s3Btn) s3Btn.click();
        });
        await new Promise(r => setTimeout(r, 800));

        await page.evaluate(() => {
            const pTab = document.querySelector('.tab-btn[data-tab="tab-practice"]');
            if (pTab) pTab.click();
        });
        await new Promise(r => setTimeout(r, 800));

        // Step 4: Verify Habit Guide Accordion on Stage 3 Tracker Section
        console.log("Verifying Habit Guide Accordion in #stage3-tracker-section...");
        const guideVerification = await page.evaluate(() => {
            const section = document.getElementById("stage3-tracker-section");
            if (!section) return { exists: false };
            const details = section.querySelector("details.explore-more");
            const summary = details ? details.querySelector("summary") : null;
            const summaryText = summary ? summary.textContent.trim() : "";
            
            // Check 5 habit cards
            const textContent = details ? details.textContent : "";
            const hasM = textContent.includes("Mindfulness") && textContent.includes("SBA");
            const hasG = textContent.includes("Gratitude") && textContent.includes("Biết ơn");
            const hasO = textContent.includes("Optimism") && textContent.includes("ABCDE");
            const hasF = textContent.includes("Flow") && textContent.includes("4%");
            const hasA = textContent.includes("Altruism") && textContent.includes("5-Minute Favors");
            
            // Check 3 steps
            const hasSteps = textContent.includes("Chạm Chọn Điểm Danh") &&
                             textContent.includes("Bấm Đồng Bộ Về BTC") &&
                             textContent.includes("An Tâm Lưu Trữ Tự Động");

            const hasDocBtn = !!section.querySelector("#btn-open-habit-full-doc");

            return {
                exists: !!details,
                isOpen: details ? details.hasAttribute("open") : false,
                summaryText,
                habitsOK: hasM && hasG && hasO && hasF && hasA,
                stepsOK: hasSteps,
                hasDocBtn
            };
        });

        const c2Pass = guideVerification.exists && guideVerification.habitsOK && guideVerification.stepsOK && guideVerification.hasDocBtn;
        testResults.push({
            case: "Case 2: Khối Accordion Hướng Dẫn & Chú Giải 5 Thói Quen (M-G-O-F-A) và 3 Bước Thao Tác",
            pass: c2Pass,
            detail: guideVerification
        });

        // Screenshot Stage 3 with Habit Guide
        const shot1Path = path.resolve(__dirname, 'UAT', 'screenshots', 'local_uat_habit_guide_section.png');
        const trackerElem = await page.$('#stage3-tracker-section');
        if (trackerElem) {
            await trackerElem.screenshot({ path: shot1Path });
            console.log(`Saved screenshot 1 to: ${shot1Path}`);
        }

        // Step 5: Test clicking #btn-open-habit-full-doc
        console.log("Clicking #btn-open-habit-full-doc to open Roadmap / Habit Guide Doc Modal...");
        await page.evaluate(() => {
            const btn = document.getElementById("btn-open-habit-full-doc");
            if (btn) btn.click();
        });
        await new Promise(r => setTimeout(r, 1200));

        // Step 6: Verify Doc Reader Modal opened and rendered images
        console.log("Verifying #doc-reader-modal and image rendering in renderSimpleMarkdown...");
        const docModalVerification = await page.evaluate(() => {
            const modal = document.getElementById("doc-reader-modal");
            const isVisible = modal && !modal.classList.contains("hidden");
            const title = document.getElementById("doc-reader-title");
            const titleText = title ? title.textContent.trim() : "";
            const body = document.getElementById("doc-reader-body");
            const bodyHtml = body ? body.innerHTML : "";
            
            // Check Part V text
            const hasPartV = bodyHtml.includes("PHẦN V: HƯỚNG DẪN THỰC HÀNH CHẶNG 3");
            const has5HabitsTable = bodyHtml.includes("Mindfulness") && bodyHtml.includes("Gratitude") && bodyHtml.includes("Altruism");
            
            // Check rendered images
            const imgs = body ? Array.from(body.querySelectorAll("img")) : [];
            const guideImgs = imgs.filter(img => img.src.includes("guide_step"));

            return {
                isVisible,
                titleText,
                hasPartV,
                has5HabitsTable,
                imgCount: guideImgs.length,
                imgSources: guideImgs.map(i => i.src)
            };
        });

        const c3Pass = docModalVerification.isVisible && docModalVerification.hasPartV && docModalVerification.imgCount >= 4;
        testResults.push({
            case: "Case 3: Modal Cẩm Nang Mở Đúng, Hiển Thị Phần V & Render 4 Ảnh Giao Diện Thực Tế",
            pass: c3Pass,
            detail: docModalVerification
        });

        // Screenshot Doc Reader Modal with Part V and Images
        const shot2Path = path.resolve(__dirname, 'UAT', 'screenshots', 'local_uat_doc_reader_part_v_with_images.png');
        await page.screenshot({ path: shot2Path });
        console.log(`Saved screenshot 2 to: ${shot2Path}`);

    } catch (err) {
        console.error("Error during test execution:", err);
        testResults.push({ case: "Execution Error", pass: false, detail: err.message });
    } finally {
        if (browser) await browser.close();
        serverProc.kill();
        console.log("Local server stopped.");
    }

    console.log("\n=================== LOCAL UAT RESULTS ===================");
    let allPass = true;
    testResults.forEach(r => {
        console.log(`[${r.pass ? "PASS" : "FAIL"}] ${r.case}`);
        console.log(`       Chi tiết:`, JSON.stringify(r.detail));
        if (!r.pass) allPass = false;
    });
    console.log(`OVERALL: ${allPass ? "ALL TESTS PASSED (3/3)" : "SOME TESTS FAILED"}`);
    
    process.exit(allPass ? 0 : 1);
}

runLocalUAT();
