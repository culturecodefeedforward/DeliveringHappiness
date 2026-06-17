// tracking.js - Analytics hợp nhất cho dự án DH4HN
// SCOPE: Analytics only (fire-and-forget). Logic đăng ký nghiệp vụ nằm trong register.js.

const SHEET_WEBAPP_URL = window.CUSTOM_WEBAPP_URL || "https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec";
const sessionId = 'dh-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

window.sessionId = sessionId; // Export cho quiz.js dùng chung

/**
 * Ghi nhận sự kiện analytics (fire-and-forget).
 * Lỗi analytics KHÔNG ảnh hưởng luồng đăng ký nghiệp vụ.
 */
async function logAnalytics(event, detail, extra = {}) {
    const targetUrl = window.CUSTOM_WEBAPP_URL || SHEET_WEBAPP_URL;
    if (!targetUrl) return;
    try {
        // Analytics dùng no-cors là hợp lệ vì không cần đọc response
        await fetch(targetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                event: event,
                detail: detail,
                url: window.location.href,
                ...extra
            })
        });
    } catch (e) { console.error('[Analytics] Tracking error', e); }
}

// Alias cũ để không phá các page dùng window.logToSheet cho analytics
window.logToSheet = logAnalytics;
window.logAnalytics = logAnalytics;

// --- Theo dõi lượt xem trang và cuộn trang ---
document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    logAnalytics('PAGE_VIEW', 'Truy cập trang: ' + pageName);

    if (pageName === 'index.html' || pageName === '') {
        const registerBtn = document.querySelector('a[href*="docs.google.com/forms"]');
        if (registerBtn) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        logAnalytics('SCROLL_REACH', 'Người dùng đã cuộn tới khu vực Đăng ký');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(registerBtn);

            registerBtn.addEventListener('click', () => {
                logAnalytics('CTA_CLICK', 'Nhấn nút Đăng ký (Landing Page)');
            });
        }
    }
});
