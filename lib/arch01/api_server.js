/**
 * api_server.js (P1-API-06)
 * Máy chủ HTTP REST API hoàn chỉnh cho Backend Teaching DH & Supabase Free
 * Sử dụng native module http của Node.js, KHÔNG phụ thuộc express hay thư viện bên ngoài.
 * Khởi chạy độc lập hoặc tích hợp trong kiểm thử tự động.
 */

const http = require('http');
const url = require('url');
const {
    loadConfig,
    handleLeadSubmission,
    handleAssessmentAttempt,
    handlePersonalValuesAttempt,
    handleHubSurveyCompletionSync,
    handleQuizAnalytics,
    handleRegistration,
    handleSepayWebhook,
    handleLogin,
    handleAuthSession,
    handleAuthRefresh,
    handleAuthPasswordUpdate,
    handleAuthLogout,
    handleTrialAuthRequest,
    handleTrialAuthActivation,
    handleTrialAuthSession,
    handleTrialAuthRefresh,
    handleTrialAuthLogout,
    handleAdminLogin,
    handleAdminSession,
    handleAdminLogout,
    handleAdminRoster,
    handleAdminAnalyticsSummary,
    handleProgressSync,
    handleProgressRestore,
    handleCheckStatus
} = require('./api_gateway');
const { processOutboxBatch } = require('./reporting_outbox_worker');

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) { // Chống DoS payload quá 1MB
                req.destroy();
                reject(new Error('PAYLOAD_TOO_LARGE'));
            }
        });
        req.on('end', () => {
            if (!body || body.trim() === '') {
                return resolve({});
            }
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(new Error('INVALID_JSON'));
            }
        });
        req.on('error', err => reject(err));
    });
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sepay-token'
    });
    res.end(JSON.stringify(data));
}

function createServer(db, customConfig = null) {
    const config = customConfig || loadConfig();

    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method.toUpperCase();

        // Xử lý CORS Preflight
        if (method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sepay-token'
            });
            return res.end();
        }

        try {
            // 1. Health check
            if (pathname === '/health' && method === 'GET') {
                return sendJson(res, 200, { status: 'ok', version: '3.2.0', uptime: process.uptime() });
            }

            // 2. Tiếp nhận Lead quan tâm
            if (pathname === '/api/leads' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleLeadSubmission(db, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // Tiếp nhận bài sát hạch ẩn danh; máy chủ tự tính kết quả.
            if (pathname === '/api/assessment/attempts' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleAssessmentAttempt(db, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // Lưu khảo sát giá trị cá nhân bằng phiên đã xác thực.
            if (pathname === '/api/assessment/personal-values' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handlePersonalValuesAttempt(db, req.headers, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // Cập nhật cột hoàn tất khảo sát vào dòng Hub (trung tâm) đã có; bộ xử lý chỉ chạy khi có bộ chuyển đổi được tiêm tường minh.
            if (pathname === '/api/hub/survey-completion' && method === 'POST') {
                const body = await parseBody(req);
                const queued = await handleHubSurveyCompletionSync(db, req.headers, body);
                if (!queued.success) {
                    return sendJson(res, queued.code || 400, queued);
                }
                if (queued.already_processed) {
                    return sendJson(res, 200, { success: true, hub_status: 'ALREADY_UPDATED', outbox_id: queued.outbox_id });
                }
                if (!config.hubDirectoryAdapter) {
                    return sendJson(res, 202, { success: true, hub_status: 'PENDING', outbox_id: queued.outbox_id });
                }

                const report = await processOutboxBatch(db, config.hubDirectoryAdapter, 1, { onlyId: queued.outbox_id });
                if (report.processed === 1) {
                    return sendJson(res, 200, { success: true, hub_status: 'UPDATED', outbox_id: queued.outbox_id });
                }
                const candidateError = report.errors && report.errors[0] && report.errors[0].error;
                const safeHubErrors = new Set(['HUB_LEAD_NOT_FOUND', 'HUB_EMAIL_NOT_UNIQUE', 'HUB_PERSON_NOT_UNIQUE']);
                return sendJson(res, 502, {
                    success: false,
                    error: safeHubErrors.has(candidateError) ? candidateError : 'HUB_UPDATE_NOT_CONFIRMED',
                    hub_status: 'PENDING',
                    outbox_id: queued.outbox_id
                });
            }

            // Analytics quiz chỉ nhận khi được bật tường minh trong cấu hình máy chủ.
            if (pathname === '/api/telemetry/quiz' && method === 'POST') {
                if (config.enableQuizAnalytics !== true) {
                    return sendJson(res, 503, { success: false, error: 'QUIZ_ANALYTICS_DISABLED' });
                }
                const body = await parseBody(req);
                const result = await handleQuizAnalytics(db, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // 3. Đăng ký khóa học chính thức
            if (pathname === '/api/register' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleRegistration(db, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // 4. Webhook SePay
            if (pathname === '/api/sepay-webhook' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleSepayWebhook(db, req.headers, body, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // 5. Xác thực đăng nhập
            if (pathname === '/api/auth/login' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleLogin(db, body, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/session' && method === 'GET') {
                const result = await handleAuthSession(db, req.headers);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/refresh' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleAuthRefresh(db, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/password' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleAuthPasswordUpdate(db, req.headers, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/logout' && method === 'POST') {
                const result = await handleAuthLogout(db, req.headers);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // Trial chỉ gửi email khi được bật tường minh; xác minh token và quyền luôn nằm phía máy chủ.
            if (pathname === '/api/auth/trial/request' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleTrialAuthRequest(db, body, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/trial/activate' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleTrialAuthActivation(db, req.headers, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/trial/session' && method === 'GET') {
                const result = await handleTrialAuthSession(db, req.headers);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/trial/refresh' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleTrialAuthRefresh(db, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/auth/trial/logout' && method === 'POST') {
                const result = await handleTrialAuthLogout(db, req.headers);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // Admin và roster luôn được xác minh danh tính, phiên và email ở máy chủ.
            if (pathname === '/api/admin/login' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleAdminLogin(db, body, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/admin/session' && method === 'GET') {
                const result = await handleAdminSession(db, req.headers, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/admin/logout' && method === 'POST') {
                const result = await handleAdminLogout(db, req.headers, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/admin/roster' && method === 'GET') {
                const requestedView = parsedUrl.query && parsedUrl.query.view;
                if (requestedView !== undefined && requestedView !== 'roster' && requestedView !== 'summary') {
                    return sendJson(res, 400, { success: false, error: 'INVALID_ADMIN_ROSTER_VIEW' });
                }
                const result = requestedView === 'summary'
                    ? await handleAdminAnalyticsSummary(db, req.headers, config)
                    : await handleAdminRoster(db, req.headers, config);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // 6. Đồng bộ tiến độ LMS
            if (pathname === '/api/telemetry/progress' && method === 'POST') {
                const body = await parseBody(req);
                const result = await handleProgressSync(db, req.headers, body);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            if (pathname === '/api/telemetry/progress/restore' && method === 'GET') {
                const result = await handleProgressRestore(db, req.headers, parsedUrl.query);
                return sendJson(res, result.code || (result.success ? 200 : 400), result);
            }

            // 7. Tra cứu trạng thái đơn đăng ký
            if (pathname === '/api/registration/status' && method === 'GET') {
                const result = await handleCheckStatus(db, parsedUrl.query);
                return sendJson(res, result.code || (result.success ? 200 : 404), result);
            }

            // 404 Not Found
            return sendJson(res, 404, { success: false, error: 'ROUTE_NOT_FOUND', path: pathname });

        } catch (err) {
            const isClientErr = err.message === 'INVALID_JSON' || err.message === 'PAYLOAD_TOO_LARGE';
            return sendJson(res, isClientErr ? 400 : 500, {
                success: false,
                error: isClientErr ? err.message : 'INTERNAL_SERVER_ERROR',
                message: isClientErr ? 'Dữ liệu yêu cầu không hợp lệ' : 'Lỗi xử lý nội bộ phía máy chủ'
            });
        }
    });

    return server;
}

if (require.main === module) {
    const { createClient } = require('./supabase_client');
    const port = process.env.PORT || 3000;
    const config = loadConfig();
    const supabase = createClient(
        process.env.SUPABASE_URL || 'http://localhost:54321',
        process.env.SUPABASE_ANON_KEY || 'dummy_anon_key',
        { serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY }
    );
    const server = createServer(supabase, config);
    server.listen(port, () => {
        console.log(`[+] Teaching DH API Server đang chạy tại cổng http://localhost:${port}`);
    });
}

module.exports = {
    createServer,
    parseBody,
    sendJson
};
