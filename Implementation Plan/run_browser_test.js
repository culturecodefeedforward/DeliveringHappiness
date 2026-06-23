const puppeteer = require('C:\\Users\\vu.hoang\\.gemini\\config\\skills\\chrome-devtools\\scripts\\node_modules\\puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log("Khởi động kiểm thử trình duyệt...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 });

    // Đăng ký bắt lỗi console và lỗi mạng
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    
    page.on('pageerror', err => {
        console.error(`[BROWSER ERROR] ${err.toString()}`);
    });

    // 1. Kiểm thử register_direct.html
    console.log("Truy cập trang register_direct.html...");
    await page.goto('http://localhost:5000/register_direct.html', { waitUntil: 'networkidle2' });
    
    // Kiểm tra trực quan xem có 2 trường nhập trực tiếp không
    const referrerNameExists = await page.$('#referrerName') !== null;
    const referrerPhoneExists = await page.$('#referrerPhone') !== null;
    
    // Kiểm tra xem có nhóm radio chọn đối tác (GEM Global, Smart Train, Nguồn khác) hay không
    const pageContent = await page.content();
    const hasGEM = pageContent.includes("GEM Global");
    const hasSmartTrain = pageContent.includes("Smart Train");
    
    console.log(`- Tên người giới thiệu input: ${referrerNameExists ? "CÓ" : "KHÔNG"}`);
    console.log(`- SĐT người giới thiệu input: ${referrerPhoneExists ? "CÓ" : "KHÔNG"}`);
    console.log(`- Có radio chọn đối tác (GEM Global): ${hasGEM ? "CÓ" : "KHÔNG"}`);
    console.log(`- Có radio chọn đối tác (Smart Train): ${hasSmartTrain ? "CÓ" : "KHÔNG"}`);
    
    // Tạo thư mục UAT nếu chưa có
    const uatDir = 'c:\\Users\\vu.hoang\\.gemini\\antigravity\\scratch\\dh4hn-website\\UAT';
    if (!fs.existsSync(uatDir)){
        fs.mkdirSync(uatDir, { recursive: true });
    }
    
    // Chụp ảnh màn hình
    const registerImgPath = path.join(uatDir, 'local_register_direct.png');
    await page.screenshot({ path: registerImgPath, fullPage: true });
    console.log(`Đã chụp ảnh màn hình register_direct tại: ${registerImgPath}`);

    // 2. Kiểm thử assessment.html
    console.log("Truy cập trang assessment.html...");
    await page.goto('http://localhost:5000/assessment.html', { waitUntil: 'networkidle2' });

    // Xác minh ở dưới cùng có xuất hiện 2 nút điều hướng nhanh
    const navActionsVisible = await page.evaluate(() => {
        const el = document.getElementById('quizNavActions');
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
    });
    
    const navInfoText = await page.evaluate(() => {
        const el = document.getElementById('quizNavInfo');
        return el ? el.innerText.trim() : null;
    });

    const navRegisterText = await page.evaluate(() => {
        const el = document.getElementById('quizNavRegister');
        return el ? el.innerText.trim() : null;
    });

    console.log(`- Vùng điều hướng nhanh hiển thị: ${navActionsVisible ? "CÓ" : "KHÔNG"}`);
    console.log(`- Nút 1: ${navInfoText}`);
    console.log(`- Nút 2: ${navRegisterText}`);

    // Chụp ảnh màn hình
    const assessmentImgPath = path.join(uatDir, 'local_assessment_quiz.png');
    await page.screenshot({ path: assessmentImgPath });
    console.log(`Đã chụp ảnh màn hình assessment_quiz tại: ${assessmentImgPath}`);

    // 3. Hoàn thành thử nghiệm bài trắc nghiệm (trả lời qua 10 câu hỏi)
    console.log("Bắt đầu tự động trả lời 10 câu hỏi trắc nghiệm...");
    for (let i = 0; i < 10; i++) {
        console.log(`Trả lời câu hỏi ${i + 1}/10...`);
        // Đợi option xuất hiện
        await page.waitForSelector('.quiz-option');
        
        // Click tùy chọn đầu tiên
        await page.evaluate(() => {
            const options = document.querySelectorAll('.quiz-option');
            if (options.length > 0) {
                options[0].click();
            }
        });
        
        // Đợi nút Tiếp theo xuất hiện và click nó
        await page.waitForSelector('#quizNextBtn', { visible: true });
        await page.click('#quizNextBtn');
        
        // Đợi 200ms để quiz chuyển câu hỏi
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 200)));
    }

    console.log("Đã trả lời xong 10 câu hỏi. Đợi màn hình kết quả hiển thị...");
    await page.waitForSelector('#quizSummary', { visible: true });

    // Xác minh xem 2 nút điều hướng nhanh của quiz có tự động ẩn đi không
    const navActionsHidden = await page.evaluate(() => {
        const el = document.getElementById('quizNavActions');
        if (!el) return true;
        const style = window.getComputedStyle(el);
        return style.display === 'none';
    });

    const scoreText = await page.evaluate(() => {
        const el = document.getElementById('finalScore');
        return el ? el.innerText.trim() : null;
    });

    console.log(`- Điểm số hiển thị: ${scoreText}`);
    console.log(`- Vùng điều hướng nhanh đã ẩn: ${navActionsHidden ? "CÓ" : "KHÔNG"}`);

    // Chụp ảnh màn hình màn hình kết quả
    const summaryImgPath = path.join(uatDir, 'local_assessment_summary.png');
    await page.screenshot({ path: summaryImgPath });
    console.log(`Đã chụp ảnh màn hình assessment_summary tại: ${summaryImgPath}`);

    console.log("Kiểm thử kết thúc thành công.");
    await browser.close();
})();
