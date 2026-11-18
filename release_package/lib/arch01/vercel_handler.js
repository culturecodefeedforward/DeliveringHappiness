const EventEmitter = require('events');
const { createServer } = require('./api_server');
const { createClient } = require('./supabase_client');

const ROUTE_METHODS = Object.freeze({
    '/api/leads': 'POST',
    '/api/assessment/attempts': 'POST',
    '/api/assessment/personal-values': 'POST',
    '/api/hub/survey-completion': 'POST',
    '/api/auth/login': 'POST',
    '/api/auth/session': 'GET',
    '/api/auth/refresh': 'POST',
    '/api/auth/password': 'POST',
    '/api/auth/logout': 'POST',
    '/api/auth/trial/request': 'POST',
    '/api/auth/trial/activate': 'POST',
    '/api/auth/trial/session': 'GET',
    '/api/auth/trial/refresh': 'POST',
    '/api/auth/trial/logout': 'POST',
    '/api/telemetry/progress': 'POST',
    '/api/telemetry/progress/restore': 'GET',
    '/api/admin/login': 'POST',
    '/api/admin/session': 'GET',
    '/api/admin/logout': 'POST',
    '/api/admin/roster': 'GET'
});

const OPTIONAL_ROUTE_FEATURES = Object.freeze({
    '/api/assessment/personal-values': 'ENABLE_PERSONAL_VALUES_API',
    '/api/hub/survey-completion': 'ENABLE_HUB_COMPLETION_SYNC'
});

class RequestAdapterError extends Error {
    constructor(code, statusCode) {
        super(code);
        this.code = code;
        this.statusCode = statusCode;
    }
}

function requiredEnv(env, name) {
    const value = env && env[name];
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('API_CONFIGURATION_UNAVAILABLE');
    }
    return value.trim();
}

function createProductionServer(env = process.env) {
    const supabaseUrl = requiredEnv(env, 'SUPABASE_URL');
    let parsedSupabaseUrl;
    try {
        parsedSupabaseUrl = new URL(supabaseUrl);
    } catch {
        throw new Error('API_CONFIGURATION_UNAVAILABLE');
    }
    if (parsedSupabaseUrl.protocol !== 'https:') {
        throw new Error('API_CONFIGURATION_UNAVAILABLE');
    }

    const anonKey = requiredEnv(env, 'SUPABASE_ANON_KEY');
    const serviceRoleKey = requiredEnv(env, 'SUPABASE_SERVICE_ROLE_KEY');
    const jwtSecret = requiredEnv(env, 'JWT_SECRET');
    const adminSecretKey = requiredEnv(env, 'ADMIN_SECRET_KEY');
    if (Buffer.byteLength(jwtSecret, 'utf8') < 32) {
        throw new Error('API_CONFIGURATION_UNAVAILABLE');
    }

    const enableTrialAuth = env.ENABLE_TRIAL_AUTH === 'true';
    const trialAuthRedirectTo = String(env.TRIAL_AUTH_REDIRECT_TO || '').trim();
    if (enableTrialAuth && !trialAuthRedirectTo) {
        throw new Error('API_CONFIGURATION_UNAVAILABLE');
    }

    const db = createClient(supabaseUrl, anonKey, { serviceRoleKey });
    const config = {
        SEPAY_WEBHOOK_TOKEN: '',
        OFFICIAL_ACCOUNT_NUMBER: '',
        ADMIN_SECRET_KEY: adminSecretKey,
        JWT_SECRET: jwtSecret,
        enableQuizAnalytics: false,
        enableTrialAuth,
        trialAuthRedirectTo,
        adminEmailAllowlist: String(env.ADMIN_EMAIL_ALLOWLIST || '')
            .split(',').map(email => email.trim().toLowerCase()).filter(Boolean)
    };

    return createServer(db, config);
}

function serializeParsedBody(request) {
    let body;
    try {
        body = request.body;
    } catch {
        throw new RequestAdapterError('INVALID_JSON', 400);
    }

    if (body === undefined || body === null || body === '') return Buffer.alloc(0);

    let serialized;
    try {
        if (Buffer.isBuffer(body)) serialized = body;
        else if (typeof body === 'string') serialized = Buffer.from(body, 'utf8');
        else serialized = Buffer.from(JSON.stringify(body), 'utf8');
    } catch {
        throw new RequestAdapterError('INVALID_JSON', 400);
    }

    if (!Buffer.isBuffer(serialized)) {
        throw new RequestAdapterError('INVALID_JSON', 400);
    }
    if (serialized.length > 1e6) {
        throw new RequestAdapterError('PAYLOAD_TOO_LARGE', 413);
    }
    return serialized;
}

function createStreamRequest(request, body) {
    const streamRequest = new EventEmitter();
    streamRequest.method = request.method;
    streamRequest.url = request.url;
    streamRequest.headers = request.headers || {};
    streamRequest.destroy = () => streamRequest.emit('close');

    process.nextTick(() => {
        if (body.length > 0) streamRequest.emit('data', body);
        streamRequest.emit('end');
    });
    return streamRequest;
}

function withoutCorsHeaders(headers) {
    const safeHeaders = { ...(headers || {}) };
    for (const name of Object.keys(safeHeaders)) {
        if (name.toLowerCase().startsWith('access-control-')) delete safeHeaders[name];
    }
    return safeHeaders;
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
    });
    response.end(JSON.stringify(payload));
}

function dispatchToBackend(server, request, response) {
    return new Promise(resolve => {
        let ended = false;
        const adaptedResponse = {
            writeHead(statusCode, headers) {
                return response.writeHead(statusCode, withoutCorsHeaders(headers));
            },
            end(...args) {
                if (ended) return response;
                ended = true;
                response.end(...args);
                resolve();
                return response;
            }
        };

        try {
            server.emit('request', request, adaptedResponse);
        } catch {
            if (!ended) {
                ended = true;
                sendJson(response, 500, { success: false, error: 'INTERNAL_SERVER_ERROR' });
            }
            resolve();
        }
    });
}

function createVercelHandler(expectedPath, options = {}) {
    const routePath = new URL(expectedPath, 'http://localhost').pathname;
    const expectedMethod = ROUTE_METHODS[routePath];
    if (!expectedMethod) throw new Error('UNREGISTERED_API_ROUTE');

    let backendServer = null;
    return async function vercelHandler(request, response) {
        let pathname;
        try {
            pathname = new URL(request.url || '/', 'http://localhost').pathname;
        } catch {
            return sendJson(response, 400, { success: false, error: 'INVALID_REQUEST_PATH' });
        }

        if (pathname !== routePath) {
            return sendJson(response, 404, { success: false, error: 'ROUTE_NOT_FOUND' });
        }
        if (String(request.method || '').toUpperCase() !== expectedMethod) {
            response.writeHead(405, {
                'Allow': expectedMethod,
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store',
                'X-Content-Type-Options': 'nosniff'
            });
            return response.end(JSON.stringify({ success: false, error: 'METHOD_NOT_ALLOWED' }));
        }

        const featureFlag = OPTIONAL_ROUTE_FEATURES[routePath];
        const runtimeEnv = options.env || process.env;
        if (featureFlag && runtimeEnv[featureFlag] !== 'true') {
            return sendJson(response, 503, { success: false, error: 'API_FEATURE_DISABLED' });
        }

        let backendRequest = request;
        if ('body' in Object(request)) {
            let parsedBody;
            try {
                parsedBody = serializeParsedBody(request);
            } catch (error) {
                const statusCode = error instanceof RequestAdapterError ? error.statusCode : 400;
                const code = error instanceof RequestAdapterError ? error.code : 'INVALID_JSON';
                return sendJson(response, statusCode, { success: false, error: code });
            }
            backendRequest = createStreamRequest(request, parsedBody);
        }

        try {
            if (!backendServer) {
                backendServer = typeof options.getServer === 'function'
                    ? options.getServer()
                    : createProductionServer(options.env || process.env);
            }
        } catch {
            return sendJson(response, 503, {
                success: false,
                error: 'API_CONFIGURATION_UNAVAILABLE'
            });
        }

        return dispatchToBackend(backendServer, backendRequest, response);
    };
}

module.exports = {
    ROUTE_METHODS,
    createProductionServer,
    createVercelHandler
};
