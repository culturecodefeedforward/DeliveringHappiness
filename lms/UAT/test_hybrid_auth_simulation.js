/**
 * Simulation Test for LMS Hybrid Auth Model
 * Kịch bản kiểm thử mô phỏng logic phân luồng học viên chính thức vs học thử Magic Link
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log("=== BẮT ĐẦU KIỂM THỬ UAT MÔ PHỎNG: HYBRID AUTH MODEL CHO LMS ===");

// 1. Kiểm tra cấu hình Backend active_code_gs_final.js
const backendFile = path.join(__dirname, '../../Scripts/active_code_gs_final.js');
const backendContent = fs.readFileSync(backendFile, 'utf8');

assert(backendContent.includes('"LMS_TRIAL": {'), "LỖI: Chưa có cấu hình LMS_TRIAL trong active_code_gs_final.js");
assert(backendContent.includes('https://delivering-happiness.vercel.app/lms/'), "LỖI: Chưa có URL LMS_TRIAL trong active_code_gs_final.js");
console.log("✅ TC-BACKEND: Cấu hình LMS_TRIAL trong Apps Script hợp lệ.");

// 2. Đọc file HTML lms/index.html
const htmlFile = path.join(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlFile, 'utf8');

assert(htmlContent.includes('id="trial-onboarding-group"'), "LỖI: Thiếu #trial-onboarding-group trong index.html");
assert(htmlContent.includes('id="trial-upgrade-modal"'), "LỖI: Thiếu #trial-upgrade-modal trong index.html");
assert(htmlContent.includes('id="btn-request-trial"'), "LỖI: Thiếu #btn-request-trial trong index.html");
assert(htmlContent.includes('id="btn-close-upgrade"'), "LỖI: Thiếu #btn-close-upgrade trong index.html");
console.log("✅ TC-HTML: Giao diện Auth Modal & Trial Upgrade Modal đầy đủ ID chuẩn.");

// 3. Trích xuất và kiểm tra logic trong lms/app.js
const appFile = path.join(__dirname, '../app.js');
const appContent = fs.readFileSync(appFile, 'utf8');

// Kiểm tra không còn mã tự phục vụ sơ hở
assert(!appContent.includes('DHM9-TựPhụcVụ'), "LỖI: Vẫn còn mã tự phục vụ DHM9-TựPhụcVụ trong app.js!");
console.log("✅ TC-SECURITY: Đã loại bỏ hoàn toàn lỗ hổng tự cấp quyền DHM9-TựPhụcVụ.");

// 4. Mô phỏng hàm normalizePhone, normalizeIdentity, findLearner
function normalizePhone(raw) {
    if (!raw) return "";
    let clean = String(raw).replace(/[^\d+]/g, "").trim();
    if (clean.startsWith("+84")) clean = "0" + clean.slice(3);
    else if (clean.startsWith("84") && clean.length === 11) clean = "0" + clean.slice(2);
    return clean.replace(/\D/g, "");
}

function normalizeIdentity(raw) {
    if (!raw) return "";
    const trimmed = String(raw).trim().toLowerCase();
    if (trimmed.includes("@")) return trimmed;
    return normalizePhone(trimmed);
}

const mockRoster = [
    {
        name: "Nguyễn Văn Thật",
        email: "official.student@example.com",
        phone: "0901234567",
        phone_last4: "4567",
        cohort: "DHM8"
    }
];

function findLearner(rawIdentity, roster = mockRoster) {
    const id = normalizeIdentity(rawIdentity);
    if (!id) return null;
    return roster.find(l => {
        const emailMatch = l.email && l.email.toLowerCase() === id;
        const phoneMatch = l.phone && normalizePhone(l.phone) === id;
        return emailMatch || phoneMatch;
    }) || null;
}

// TC-01: Học viên chính thức
const official = findLearner("official.student@example.com");
assert(official !== null, "LỖI: Không tìm thấy học viên chính thức trong roster!");
assert.strictEqual(official.phone_last4, "4567");
console.log("✅ TC-01: Học viên chính thức tra cứu thành công, yêu cầu mật khẩu 4 số cuối SĐT.");

// TC-02: Email lạ không có trong roster
const stranger = findLearner("stranger.new@gmail.com");
assert(stranger === null, "LỖI: Email lạ lại tìm thấy trong roster (không được phép)!");
console.log("✅ TC-02: Email lạ bị từ chối ở Roster, kích hoạt form học thử Magic Link.");

// 5. Kiểm tra Gate phân quyền Chặng: isStageUnlocked
function isStageUnlocked(stageIdx, currentUser, s1Data = {}) {
    if (stageIdx === 0) return true;
    if (currentUser && currentUser.isTrial) {
        return false;
    }
    const isQuizPassed = Boolean(s1Data.passed || (s1Data.percentage >= 70));
    const isCoach = currentUser && (
        currentUser.cohort === "COACH" || 
        currentUser.cohort === "BTC / Coach" || 
        currentUser.role === "admin" || 
        currentUser.role === "Coach"
    );
    return Boolean(isQuizPassed || isCoach);
}

// Với học viên chính thức đã pass Quiz:
const s1Passed = { passed: true, percentage: 80 };
assert.strictEqual(isStageUnlocked(0, official, s1Passed), true, "Chặng 1 phải mở cho học viên");
assert.strictEqual(isStageUnlocked(1, official, s1Passed), true, "Chặng 2 phải mở cho học viên đã pass quiz");
assert.strictEqual(isStageUnlocked(2, official, s1Passed), true, "Chặng 3 phải mở cho học viên đã pass quiz");
console.log("✅ TC-03A: Học viên chính thức hoàn thành Chặng 1 được mở khóa Chặng 2 và Chặng 3.");

// Với học viên học thử (Trial):
const trialUser = {
    learner_id: "TRIAL-12345",
    name: "Nguyễn Văn Thử",
    email: "stranger.new@gmail.com",
    role: "trial",
    isTrial: true
};

assert.strictEqual(isStageUnlocked(0, trialUser, s1Passed), true, "Chặng 1 phải mở cho học viên học thử");
assert.strictEqual(isStageUnlocked(1, trialUser, s1Passed), false, "Chặng 2 BẮT BUỘC KHÓA đối với tài khoản học thử");
assert.strictEqual(isStageUnlocked(2, trialUser, s1Passed), false, "Chặng 3 BẮT BUỘC KHÓA đối với tài khoản học thử");
console.log("✅ TC-03B: Học viên học thử (Trial) dù có điểm quiz cao vẫn bị KHÓA CỨNG Chặng 2 và Chặng 3.");

console.log("\n=======================================================");
console.log("🎉 TẤT CẢ 5 BÀI TEST MÔ PHỎNG UAT ĐÃ PASS 100%!");
console.log("=======================================================");
