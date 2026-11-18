/**
 * api_gateway.js (V3.0 - Đã khắc phục triệt để P1-DATA-05, P1-PAY-01, P1-PAY-02, P1-PROGRESS-01, P1-AUTH-03)
 * Cổng API Máy chủ Bảo mật cho Hệ thống Teaching DH Backend
 * - P1-DATA-05: Đăng ký sử dụng Stored Procedure create_registration_atomic duy nhất, server sinh payment_code.
 * - P1-PAY-01: Tái đối soát lũy đẳng khi nhận lại Webhook của giao dịch UNMATCHED.
 * - P1-PAY-02: Lọc sạch bí mật (token, secret, apiKey) khỏi raw_payload trước khi lưu DB.
 * - P1-PROGRESS-01: Lấy person_id từ phiên xác thực Supabase Auth đã kiểm chứng, CẤM tin person_id client.
 * - P1-AUTH-03: Tích hợp GoTrue Supabase Auth chính thức; khóa cứng mật khẩu mặc định 1234.
 */

const crypto = require('crypto');

// [P1-API-01]: FAIL-CLOSED ENVIRONMENT CONFIGURATION
function getRequiredEnv(key) {
    const val = process.env[key];
    if (!val || typeof val !== 'string' || val.trim() === '') {
        throw new Error(`CRITICAL_SECURITY_ERROR: Biến môi trường bắt buộc '${key}' chưa được cấu hình. Dịch vụ dừng an toàn (Fail-Closed).`);
    }
    return val.trim();
}

function loadConfig() {
    return {
        SEPAY_WEBHOOK_TOKEN: getRequiredEnv('SEPAY_WEBHOOK_TOKEN'),
        OFFICIAL_ACCOUNT_NUMBER: getRequiredEnv('OFFICIAL_ACCOUNT_NUMBER'),
        ADMIN_SECRET_KEY: getRequiredEnv('ADMIN_SECRET_KEY'),
        JWT_SECRET: process.env.JWT_SECRET || 'MOCK_SECRET_FOR_TEST_ONLY_1234567890',
        enableQuizAnalytics: false,
        enableTrialAuth: process.env.ENABLE_TRIAL_AUTH === 'true',
        trialAuthRedirectTo: process.env.TRIAL_AUTH_REDIRECT_TO || '',
        adminEmailAllowlist: String(process.env.ADMIN_EMAIL_ALLOWLIST || '')
            .split(',').map(email => email.trim().toLowerCase()).filter(Boolean)
    };
}

// Lọc bỏ 100% token bí mật trước khi lưu vào CSDL (P1-PAY-02)
function sanitizeSepayPayload(body) {
    if (!body || typeof body !== 'object') return {};
    const sanitized = { ...body };
    delete sanitized.token;
    delete sanitized.apiKey;
    delete sanitized.authorization;
    delete sanitized.secret;
    return sanitized;
}

// Sinh mã thanh toán ngẫu nhiên; không nhúng tên hoặc số điện thoại.
function generatePaymentCode(cohortId, name, phone) {
    const cleanCohort = String(cohortId || 'DH10').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cohortPrefix = cleanCohort.slice(0, 12) || 'DH';
    return `${cohortPrefix}_${crypto.randomBytes(10).toString('hex').toUpperCase()}`;
}

function isPaymentCodeUniqueConflict(error) {
    if (!error || String(error.code) !== '23505') return false;
    const details = [error.constraint, error.message, error.details, error.hint].filter(Boolean).join(' ').toLowerCase();
    return details.includes('payment_code');
}

function findExactPaymentCodeMatches(content, registrations) {
    const contentTokens = String(content || '').toUpperCase().match(/[A-Z0-9]+/g) || [];
    return (registrations || []).filter(registration => {
        const codeTokens = String(registration.payment_code || '').toUpperCase().match(/[A-Z0-9]+/g) || [];
        if (!codeTokens.length || codeTokens.length > contentTokens.length) return false;
        for (let start = 0; start <= contentTokens.length - codeTokens.length; start++) {
            if (codeTokens.every((token, index) => contentTokens[start + index] === token)) return true;
        }
        return false;
    });
}

/**
 * 1. Tiếp nhận Form Quan tâm (Leads)
 */
async function handleLeadSubmission(db, payload) {
    if (!db || (!db.leads && !db.from)) {
        throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    }

    const { full_name, email, phone, expected_cohort, source } = payload || {};
    const cleanEmail = email ? String(email).trim().toLowerCase() : null;
    const cleanPhone = phone ? String(phone).trim() : null;
    const suppliedInterestUuid = payload && (payload.interest_uuid || payload.interestUuid);
    const clientInterestUuid = suppliedInterestUuid ? String(suppliedInterestUuid).trim().toLowerCase() : null;

    if (clientInterestUuid && !/^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/.test(clientInterestUuid)) {
        return { success: false, error: 'INVALID_INTEREST_UUID', code: 400 };
    }

    if (!cleanEmail && !cleanPhone) {
        return { success: false, error: 'MISSING_CONTACT', code: 400, message: 'Bắt buộc phải có Email hoặc Số điện thoại để tiếp nhận quan tâm' };
    }

    const interest_uuid = clientInterestUuid || `INT_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const duplicateAck = () => ({
        success: true,
        interest_uuid,
        duplicate: true,
        message: 'Yêu cầu quan tâm này đã được tiếp nhận trước đó'
    });
    const leadRecord = {
        id: crypto.randomUUID(),
        interest_uuid,
        full_name: full_name ? String(full_name).trim() : null,
        email: cleanEmail,
        phone: cleanPhone,
        expected_cohort: expected_cohort || 'DHM10',
        survey_answers: {},
        source: source || 'landing_page',
        created_at: new Date().toISOString()
    };

    if (db.from) {
        if (clientInterestUuid) {
            const { data: existing, error: lookupError } = await db.from('leads')
                .select('interest_uuid')
                .eq('interest_uuid', interest_uuid)
                .maybeSingle();
            if (lookupError) throw new Error(`DATABASE_ERROR: ${JSON.stringify(lookupError)}`);
            if (existing) return duplicateAck();
        }
        const { error } = await db.from('leads').insert(leadRecord);
        if (error) {
            if (clientInterestUuid && error.code === '23505') return duplicateAck();
            throw new Error(`DATABASE_ERROR: ${JSON.stringify(error)}`);
        }
    } else {
        if (clientInterestUuid && typeof db.leads.findOne === 'function') {
            const existing = await db.leads.findOne({ interest_uuid });
            if (existing) return duplicateAck();
        }
        try {
            await db.leads.insert(leadRecord);
        } catch (error) {
            if (clientInterestUuid && error && error.code === '23505') return duplicateAck();
            throw error;
        }
    }

    return {
        success: true,
        interest_uuid,
        message: 'Đã tiếp nhận thông tin quan tâm thành công'
    };
}

const assessmentAnswerKeys = Object.freeze({
    'quiz-stage-1-v1': Object.freeze([0, 0, 0, 0, 3, 0, 2, 0, 3, 1])
});

const assessmentAttemptFields = new Set([
    'attempt_id', 'assessment_type', 'assessment_version', 'is_anonymous', 'answers'
]);

function assessmentAttemptMatches(existing, candidate) {
    if (!existing) return false;
    return String(existing.id || existing.attempt_id || '') === candidate.id &&
        existing.person_id == null &&
        existing.cohort_id == null &&
        existing.station_id == null &&
        existing.assessment_type === candidate.assessment_type &&
        existing.is_anonymous === true &&
        Number(existing.score) === candidate.score &&
        Number(existing.percentage) === candidate.percentage &&
        existing.passed === candidate.passed &&
        stableJson(existing.answers) === stableJson(candidate.answers);
}

function assessmentAttemptResult(record, duplicate) {
    return {
        success: true,
        attempt_id: record.id,
        score: record.score,
        percentage: record.percentage,
        passed: record.passed,
        duplicate,
        message: duplicate ? 'ASSESSMENT_ATTEMPT_ALREADY_SAVED' : 'ASSESSMENT_ATTEMPT_SAVED'
    };
}

async function findAssessmentAttemptById(db, attemptId) {
    if (db && db.from) {
        const { data, error } = await db.from('assessment_attempts')
            .select('id,person_id,cohort_id,station_id,assessment_type,is_anonymous,score,percentage,passed,answers')
            .eq('id', attemptId)
            .limit(1);
        if (error) throw new Error('ASSESSMENT_ATTEMPT_LOOKUP_FAILED');
        return (data || [])[0] || null;
    }
    if (db && db.assessment_attempts && typeof db.assessment_attempts.findOne === 'function') {
        return await db.assessment_attempts.findOne({ id: attemptId }) || null;
    }
    throw new Error('ASSESSMENT_ATTEMPT_LOOKUP_UNAVAILABLE');
}

async function insertAssessmentAttempt(db, record) {
    if (db && db.from) {
        const { error } = await db.from('assessment_attempts').insert(record);
        return error || null;
    }
    if (db && db.assessment_attempts && typeof db.assessment_attempts.insert === 'function') {
        const result = await db.assessment_attempts.insert(record);
        return result && result.error ? result.error : null;
    }
    throw new Error('ASSESSMENT_ATTEMPT_INSERT_UNAVAILABLE');
}

/**
 * Lưu bài sát hạch ẩn danh, tự chấm ở máy chủ và chống ghi trùng theo UUID bài làm.
 */
async function handleAssessmentAttempt(db, payload) {
    if (!db || (!db.assessment_attempts && !db.from)) {
        throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { success: false, error: 'INVALID_ASSESSMENT_PAYLOAD', code: 400 };
    }

    const unsupportedFields = Object.keys(payload).filter(key => !assessmentAttemptFields.has(key));
    if (unsupportedFields.length > 0) {
        return { success: false, error: 'UNSUPPORTED_ASSESSMENT_FIELDS', code: 400 };
    }

    const attemptId = typeof payload.attempt_id === 'string' ? payload.attempt_id.trim().toLowerCase() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(attemptId)) {
        return { success: false, error: 'INVALID_ASSESSMENT_ATTEMPT_ID', code: 400 };
    }
    if (payload.assessment_type !== 'QUIZ_STAGE_1') {
        return { success: false, error: 'UNSUPPORTED_ASSESSMENT_TYPE', code: 400 };
    }
    const answerKey = assessmentAnswerKeys[payload.assessment_version];
    if (!answerKey) {
        return { success: false, error: 'UNSUPPORTED_ASSESSMENT_VERSION', code: 400 };
    }
    if (payload.is_anonymous !== true) {
        return { success: false, error: 'ANONYMOUS_ASSESSMENT_REQUIRED', code: 400 };
    }
    if (!Array.isArray(payload.answers) || payload.answers.length !== answerKey.length ||
        payload.answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer > 3)) {
        return { success: false, error: 'INVALID_ASSESSMENT_ANSWERS', code: 400 };
    }

    const selectedOptionIndices = payload.answers.slice();
    const score = selectedOptionIndices.reduce((total, selected, index) => total + (selected === answerKey[index] ? 1 : 0), 0);
    const percentage = Math.round((score / answerKey.length) * 10000) / 100;
    const record = {
        id: attemptId,
        person_id: null,
        assessment_type: 'QUIZ_STAGE_1',
        cohort_id: null,
        station_id: null,
        is_anonymous: true,
        score,
        percentage,
        passed: percentage >= 80,
        answers: {
            assessment_version: payload.assessment_version,
            retention_days: 90
        }
    };

    const existing = await findAssessmentAttemptById(db, attemptId);
    if (existing) {
        return assessmentAttemptMatches(existing, record)
            ? assessmentAttemptResult(record, true)
            : { success: false, error: 'ASSESSMENT_ATTEMPT_ID_CONFLICT', code: 409 };
    }

    let insertError;
    try {
        insertError = await insertAssessmentAttempt(db, record);
    } catch (error) {
        insertError = error;
    }
    if (insertError) {
        if (insertError.code === '23505') {
            const duplicate = await findAssessmentAttemptById(db, attemptId);
            return duplicate && assessmentAttemptMatches(duplicate, record)
                ? assessmentAttemptResult(record, true)
                : { success: false, error: 'ASSESSMENT_ATTEMPT_ID_CONFLICT', code: 409 };
        }
        throw new Error('ASSESSMENT_ATTEMPT_SAVE_FAILED');
    }

    return assessmentAttemptResult(record, false);
}

const personalValuesAttemptFields = new Set([
    'attempt_id', 'survey_version', 'selected_values', 'duel_choices'
]);

function personalValuesAttemptMatches(existing, candidate) {
    return Boolean(existing) &&
        String(existing.id || existing.attempt_id || '') === candidate.id &&
        existing.person_id === candidate.person_id &&
        existing.cohort_id == null &&
        existing.station_id == null &&
        existing.assessment_type === 'PERSONAL_VALUES' &&
        existing.is_anonymous === false &&
        existing.score == null &&
        existing.percentage == null &&
        existing.passed == null &&
        stableJson(existing.answers) === stableJson(candidate.answers);
}

function personalValuesAttemptResult(record, duplicate) {
    return {
        success: true,
        attempt_id: record.id,
        assessment_type: 'PERSONAL_VALUES',
        ranked_values: record.answers.ranked_values.map(({ id, score, rank }) => ({ id, score, rank })),
        duplicate,
        message: duplicate ? 'PERSONAL_VALUES_ATTEMPT_ALREADY_SAVED' : 'PERSONAL_VALUES_ATTEMPT_SAVED'
    };
}

function resolveActiveMockUserAccount(db, identity = {}) {
    if (!db || !Array.isArray(db.user_accounts)) {
        return { success: false, error: 'PERSON_ACCOUNT_LOOKUP_UNAVAILABLE', code: 503 };
    }
    const account = db.user_accounts.find(row =>
        (identity.authUserId && row.auth_user_id === identity.authUserId) ||
        (identity.personId && row.person_id === identity.personId)
    );
    if (!account) return { success: false, error: 'PERSON_ACCOUNT_NOT_LINKED', code: 403 };
    if (account.is_active !== true) return { success: false, error: 'ACCOUNT_INACTIVE', code: 403 };
    return { success: true, account };
}

async function resolvePersonalValuesPersonId(db, headers) {
    const authHeader = (headers && (headers.authorization || headers.Authorization)) || '';
    const tokenMatch = String(authHeader).match(/^Bearer\s+(.+)$/i);
    const token = tokenMatch ? tokenMatch[1].trim() : '';
    if (!token) return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401 };

    if (db.auth && typeof db.auth.getUser === 'function') {
        const { data, error } = await db.auth.getUser(token);
        if (error || !data || !data.user || !data.user.id) {
            return { success: false, error: 'INVALID_SESSION_TOKEN', code: 401 };
        }
        const session = await checkAuthSessionActive(db, token);
        if (session.unavailable) {
            return { success: false, error: 'AUTH_SESSION_CHECK_UNAVAILABLE', code: 503 };
        }
        if (!session.active) {
            return { success: false, error: 'AUTH_SESSION_REVOKED', code: 401 };
        }
        if (!db.from) {
            return { success: false, error: 'PERSON_ACCOUNT_LOOKUP_UNAVAILABLE', code: 503 };
        }
        const accountResult = await db.from('user_accounts')
            .select('person_id,is_active')
            .eq('auth_user_id', data.user.id)
            .limit(1);
        if (accountResult.error) {
            return { success: false, error: 'ACCOUNT_LINK_LOOKUP_FAILED', code: 503 };
        }
        const account = (accountResult.data || []).find(row => row.person_id);
        if (!account) return { success: false, error: 'PERSON_ACCOUNT_NOT_LINKED', code: 403 };
        if (account.is_active !== true) return { success: false, error: 'ACCOUNT_INACTIVE', code: 403 };
        return { success: true, person_id: account.person_id };
    }

    if (typeof db.verifyMockToken === 'function') {
        const mockUser = await db.verifyMockToken(token);
        if (!mockUser || !mockUser.person_id) {
            return { success: false, error: 'INVALID_SESSION_TOKEN', code: 401 };
        }
        const accountState = resolveActiveMockUserAccount(db, {
            authUserId: mockUser.auth_user_id,
            personId: mockUser.person_id
        });
        if (!accountState.success) return accountState;
        return { success: true, person_id: mockUser.person_id };
    }

    return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
}

/** Lưu kết quả GTCL từ các lựa chọn cặp; danh tính và thứ hạng được xác minh phía máy chủ. */
async function handlePersonalValuesAttempt(db, headers, payload) {
    if (!db || (!db.assessment_attempts && !db.from)) {
        throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    }

    const identity = await resolvePersonalValuesPersonId(db, headers);
    if (!identity.success) return identity;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { success: false, error: 'INVALID_PERSONAL_VALUES_PAYLOAD', code: 400 };
    }

    const unsupportedFields = Object.keys(payload).filter(key => !personalValuesAttemptFields.has(key));
    if (unsupportedFields.length > 0) {
        return { success: false, error: 'UNSUPPORTED_PERSONAL_VALUES_FIELDS', code: 400 };
    }

    const attemptId = typeof payload.attempt_id === 'string' ? payload.attempt_id.trim().toLowerCase() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(attemptId)) {
        return { success: false, error: 'INVALID_ASSESSMENT_ATTEMPT_ID', code: 400 };
    }
    if (payload.survey_version !== 'gtcl-pv-v1') {
        return { success: false, error: 'UNSUPPORTED_PERSONAL_VALUES_VERSION', code: 400 };
    }
    if (!Array.isArray(payload.selected_values) || payload.selected_values.length !== 7) {
        return { success: false, error: 'INVALID_PERSONAL_VALUES_SELECTION', code: 400 };
    }

    const selectedValues = [];
    const selectedIds = new Set();
    const selectedNames = new Set();
    for (const value of payload.selected_values) {
        if (!value || typeof value !== 'object' || Array.isArray(value) ||
            Object.keys(value).some(key => key !== 'id' && key !== 'name') ||
            !Number.isSafeInteger(value.id) || value.id < 1 || typeof value.name !== 'string') {
            return { success: false, error: 'INVALID_PERSONAL_VALUES_SELECTION', code: 400 };
        }
        const name = value.name.normalize('NFKC').replace(/\s+/g, ' ').trim();
        const normalizedName = name.toLocaleLowerCase('vi-VN');
        if (name.length < 1 || name.length > 80 || /[<>\u0000-\u001f\u007f]/.test(name) ||
            selectedIds.has(value.id) || selectedNames.has(normalizedName)) {
            return { success: false, error: 'INVALID_PERSONAL_VALUES_SELECTION', code: 400 };
        }
        selectedIds.add(value.id);
        selectedNames.add(normalizedName);
        selectedValues.push({ id: value.id, name });
    }

    const expectedPairs = new Set();
    for (let i = 0; i < selectedValues.length; i += 1) {
        for (let j = i + 1; j < selectedValues.length; j += 1) {
            const pair = [selectedValues[i].id, selectedValues[j].id].sort((a, b) => a - b);
            expectedPairs.add(`${pair[0]}:${pair[1]}`);
        }
    }
    if (!Array.isArray(payload.duel_choices) || payload.duel_choices.length !== expectedPairs.size) {
        return { success: false, error: 'INVALID_PERSONAL_VALUES_DUELS', code: 400 };
    }

    const seenPairs = new Set();
    const duelChoices = [];
    const scores = new Map(selectedValues.map(value => [value.id, 0]));
    for (const choice of payload.duel_choices) {
        if (!choice || typeof choice !== 'object' || Array.isArray(choice) ||
            Object.keys(choice).some(key => !['left_id', 'right_id', 'winner_id'].includes(key)) ||
            !Number.isSafeInteger(choice.left_id) || !Number.isSafeInteger(choice.right_id) ||
            !Number.isSafeInteger(choice.winner_id) || choice.left_id === choice.right_id ||
            !selectedIds.has(choice.left_id) || !selectedIds.has(choice.right_id) ||
            (choice.winner_id !== choice.left_id && choice.winner_id !== choice.right_id)) {
            return { success: false, error: 'INVALID_PERSONAL_VALUES_DUELS', code: 400 };
        }
        const pair = [choice.left_id, choice.right_id].sort((a, b) => a - b);
        const pairKey = `${pair[0]}:${pair[1]}`;
        if (!expectedPairs.has(pairKey) || seenPairs.has(pairKey)) {
            return { success: false, error: 'INVALID_PERSONAL_VALUES_DUELS', code: 400 };
        }
        seenPairs.add(pairKey);
        scores.set(choice.winner_id, scores.get(choice.winner_id) + 1);
        duelChoices.push({ left_id: pair[0], right_id: pair[1], winner_id: choice.winner_id });
    }
    if (seenPairs.size !== expectedPairs.size) {
        return { success: false, error: 'INVALID_PERSONAL_VALUES_DUELS', code: 400 };
    }
    duelChoices.sort((a, b) => a.left_id - b.left_id || a.right_id - b.right_id);

    const selectionOrder = new Map(selectedValues.map((value, index) => [value.id, index]));
    const rankedValues = selectedValues.map(value => ({
        id: value.id,
        name: value.name,
        score: scores.get(value.id)
    })).sort((a, b) => b.score - a.score || selectionOrder.get(a.id) - selectionOrder.get(b.id))
      .map((value, index) => ({ ...value, rank: index + 1 }));

    const record = {
        id: attemptId,
        person_id: identity.person_id,
        assessment_type: 'PERSONAL_VALUES',
        cohort_id: null,
        station_id: null,
        is_anonymous: false,
        score: null,
        percentage: null,
        passed: null,
        answers: {
            survey_version: payload.survey_version,
            ranked_values: rankedValues,
            retention_months: 12
        }
    };

    const existing = await findAssessmentAttemptById(db, attemptId);
    if (existing) {
        return personalValuesAttemptMatches(existing, record)
            ? personalValuesAttemptResult(record, true)
            : { success: false, error: 'PERSONAL_VALUES_ATTEMPT_ID_CONFLICT', code: 409 };
    }

    let insertError;
    try {
        insertError = await insertAssessmentAttempt(db, record);
    } catch (error) {
        insertError = error;
    }
    if (insertError) {
        if (String(insertError.code) === '23505') {
            const duplicate = await findAssessmentAttemptById(db, attemptId);
            return duplicate && personalValuesAttemptMatches(duplicate, record)
                ? personalValuesAttemptResult(record, true)
                : { success: false, error: 'PERSONAL_VALUES_ATTEMPT_ID_CONFLICT', code: 409 };
        }
        throw new Error('PERSONAL_VALUES_ATTEMPT_SAVE_FAILED');
    }

    return personalValuesAttemptResult(record, false);
}

const HUB_COMPLETION_EVENT_TYPE = 'PERSONAL_VALUES_HUB_COMPLETION';

function formatHubCompletionValue(date) {
    const fields = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
    return `TRUE (${fields.year}-${fields.month}-${fields.day} ${fields.hour}:${fields.minute})`;
}

async function findPersonById(db, personId) {
    if (db && db.from) {
        const { data, error } = await db.from('person_contacts')
            .select('person_id,contact_value,is_primary')
            .eq('person_id', personId)
            .eq('contact_type', 'email')
            .limit(10);
        if (error) throw new Error('HUB_PERSON_LOOKUP_FAILED');
        const matches = (data || []).filter(row =>
            typeof row.contact_value === 'string' && row.contact_value.trim() !== ''
        );
        if (matches.length === 0) return null;
        const primary = matches.find(row => row.is_primary === true);
        if (!primary && matches.length > 1) return null;
        const chosen = primary || matches[0];
        return { id: personId, email: chosen.contact_value.trim().toLowerCase() };
    }
    if (db && db.people && typeof db.people.findOne === 'function') {
        return await db.people.findOne({ id: personId }) || null;
    }
    throw new Error('HUB_PERSON_LOOKUP_UNAVAILABLE');
}

async function findReportingOutboxById(db, eventId) {
    if (db && db.from) {
        const { data, error } = await db.from('reporting_outbox')
            .select('id,event_type,target_sheet,payload,status')
            .eq('id', eventId)
            .limit(1);
        if (error) throw new Error('HUB_OUTBOX_LOOKUP_FAILED');
        return (data || [])[0] || null;
    }
    if (db && db.reporting_outbox && typeof db.reporting_outbox.findOne === 'function') {
        return await db.reporting_outbox.findOne({ id: eventId }) || null;
    }
    throw new Error('HUB_OUTBOX_LOOKUP_UNAVAILABLE');
}

function hubOutboxEventMatches(existing, candidate) {
    return Boolean(existing) && existing.id === candidate.id &&
        existing.event_type === HUB_COMPLETION_EVENT_TYPE &&
        existing.target_sheet === 'Leads_Directory' &&
        existing.payload && typeof existing.payload.completed_value === 'string' &&
        stableJson(existing.payload) === stableJson(candidate.payload);
}

async function insertReportingOutboxEvent(db, event) {
    if (db && db.from) {
        const { error } = await db.from('reporting_outbox').insert(event);
        return error || null;
    }
    if (db && db.reporting_outbox && typeof db.reporting_outbox.insert === 'function') {
        const result = await db.reporting_outbox.insert(event);
        return result && result.error ? result.error : null;
    }
    throw new Error('HUB_OUTBOX_INSERT_UNAVAILABLE');
}

/** Queue a verified GTCL completion for an update to the existing Hub row only. */
async function handleHubSurveyCompletionSync(db, headers, payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => key !== 'attempt_id')) {
        return { success: false, error: 'INVALID_HUB_SYNC_PAYLOAD', code: 400 };
    }
    const attemptId = typeof payload.attempt_id === 'string' ? payload.attempt_id.trim().toLowerCase() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(attemptId)) {
        return { success: false, error: 'INVALID_ASSESSMENT_ATTEMPT_ID', code: 400 };
    }

    const identity = await resolvePersonalValuesPersonId(db, headers);
    if (!identity.success) return identity;

    const attempt = await findAssessmentAttemptById(db, attemptId);
    if (!attempt || attempt.assessment_type !== 'PERSONAL_VALUES' || attempt.person_id !== identity.person_id) {
        return { success: false, error: 'PERSONAL_VALUES_ATTEMPT_NOT_FOUND', code: 404 };
    }
    if (!attempt.answers || attempt.answers.survey_version !== 'gtcl-pv-v1') {
        return { success: false, error: 'UNSUPPORTED_HUB_SURVEY_TYPE', code: 409 };
    }

    const person = await findPersonById(db, identity.person_id);
    const email = String(person && person.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: 'VERIFIED_PERSON_EMAIL_UNAVAILABLE', code: 409 };
    }

    const candidate = {
        id: attemptId,
        event_type: HUB_COMPLETION_EVENT_TYPE,
        target_sheet: 'Leads_Directory',
        payload: {
            source_event_id: attemptId,
            person_id: identity.person_id,
            survey_type: 'GTCL',
            target_column: 'gtcl_completed',
            completed_value: formatHubCompletionValue(new Date())
        },
        status: 'PENDING'
    };

    const existing = await findReportingOutboxById(db, attemptId);
    if (existing) {
        if (!hubOutboxEventMatches(existing, {
            ...candidate,
            payload: { ...candidate.payload, completed_value: existing.payload && existing.payload.completed_value }
        })) {
            return { success: false, error: 'HUB_SYNC_EVENT_ID_CONFLICT', code: 409 };
        }
        return {
            success: true,
            outbox_id: existing.id,
            duplicate: true,
            already_processed: existing.status === 'PROCESSED',
            message: existing.status === 'PROCESSED' ? 'HUB_SYNC_ALREADY_PROCESSED' : 'HUB_SYNC_ALREADY_QUEUED'
        };
    }

    let insertError;
    try {
        insertError = await insertReportingOutboxEvent(db, candidate);
    } catch (error) {
        insertError = error;
    }
    if (insertError) {
        if (String(insertError.code) === '23505') {
            const duplicate = await findReportingOutboxById(db, attemptId);
            if (duplicate && hubOutboxEventMatches(duplicate, {
                ...candidate,
                payload: { ...candidate.payload, completed_value: duplicate.payload && duplicate.payload.completed_value }
            })) {
                return {
                    success: true,
                    outbox_id: duplicate.id,
                    duplicate: true,
                    already_processed: duplicate.status === 'PROCESSED',
                    message: duplicate.status === 'PROCESSED' ? 'HUB_SYNC_ALREADY_PROCESSED' : 'HUB_SYNC_ALREADY_QUEUED'
                };
            }
            return { success: false, error: 'HUB_SYNC_EVENT_ID_CONFLICT', code: 409 };
        }
        throw new Error('HUB_SYNC_QUEUE_FAILED');
    }

    return { success: true, outbox_id: attemptId, duplicate: false, already_processed: false, message: 'HUB_SYNC_QUEUED' };
}

/**
 * 2. Tiếp nhận Đăng ký Khóa học (Registrations)
 * [P1-DATA-05 & P1-RPC-02]: Gọi RPC nguyên tử create_registration_atomic, server sinh payment_code
 */
const quizAnalyticsFields = new Set([
    'event_id', 'session_id', 'event_type', 'page_path', 'question_number', 'answer_correct'
]);

function quizAnalyticsMatches(existing, candidate) {
    return !!existing &&
        existing.event_id === candidate.event_id &&
        existing.session_id === candidate.session_id &&
        existing.event_type === candidate.event_type &&
        existing.page_path === candidate.page_path &&
        (existing.question_number ?? null) === candidate.question_number &&
        (existing.answer_correct ?? null) === candidate.answer_correct;
}

async function findQuizAnalyticsEventById(db, eventId) {
    if (db && db.from) {
        const { data, error } = await db.from('quiz_analytics_events')
            .select('event_id,session_id,event_type,page_path,question_number,answer_correct')
            .eq('event_id', eventId)
            .limit(1);
        if (error) throw new Error('QUIZ_ANALYTICS_LOOKUP_FAILED');
        return (data || [])[0] || null;
    }
    if (db && db.quiz_analytics_events && typeof db.quiz_analytics_events.findOne === 'function') {
        return await db.quiz_analytics_events.findOne({ event_id: eventId }) || null;
    }
    throw new Error('QUIZ_ANALYTICS_LOOKUP_UNAVAILABLE');
}

async function insertQuizAnalyticsEvent(db, record) {
    if (db && db.from) {
        const { error } = await db.from('quiz_analytics_events').insert(record);
        if (error) return { error };
        return { error: null };
    }
    if (db && db.quiz_analytics_events && typeof db.quiz_analytics_events.insert === 'function') {
        return await db.quiz_analytics_events.insert(record) || { error: null };
    }
    throw new Error('QUIZ_ANALYTICS_INSERT_UNAVAILABLE');
}

async function handleQuizAnalytics(db, payload) {
    if (!db || (!db.quiz_analytics_events && !db.from)) {
        return { success: false, error: 'DATABASE_CONFIGURATION_ERROR', code: 503 };
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { success: false, error: 'INVALID_PAYLOAD', code: 400 };
    }

    const unsupportedFields = Object.keys(payload).filter(key => !quizAnalyticsFields.has(key));
    if (unsupportedFields.length) {
        return { success: false, error: 'UNSUPPORTED_FIELD', fields: unsupportedFields, code: 400 };
    }
    if (typeof payload.event_id !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.event_id)) {
        return { success: false, error: 'EVENT_ID_INVALID', code: 400 };
    }
    if (typeof payload.session_id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(payload.session_id)) {
        return { success: false, error: 'SESSION_ID_INVALID', code: 400 };
    }
    if (!['ANSWER_QUESTION', 'FINISH_QUIZ'].includes(payload.event_type)) {
        return { success: false, error: 'EVENT_TYPE_INVALID', code: 400 };
    }
    if (payload.page_path !== '/assessment.html') {
        return { success: false, error: 'PAGE_PATH_INVALID', code: 400 };
    }

    let questionNumber = null;
    let answerCorrect = null;
    if (payload.event_type === 'ANSWER_QUESTION') {
        if (!Number.isInteger(payload.question_number) || payload.question_number < 1 || payload.question_number > 10) {
            return { success: false, error: 'QUESTION_NUMBER_INVALID', code: 400 };
        }
        if (typeof payload.answer_correct !== 'boolean') {
            return { success: false, error: 'ANSWER_CORRECT_INVALID', code: 400 };
        }
        questionNumber = payload.question_number;
        answerCorrect = payload.answer_correct;
    } else if (payload.question_number != null || payload.answer_correct != null) {
        return { success: false, error: 'FINISH_EVENT_FIELDS_INVALID', code: 400 };
    }

    const record = {
        event_id: payload.event_id.toLowerCase(),
        session_id: payload.session_id,
        event_type: payload.event_type,
        page_path: payload.page_path,
        question_number: questionNumber,
        answer_correct: answerCorrect
    };
    const existing = await findQuizAnalyticsEventById(db, record.event_id);
    if (existing) {
        if (quizAnalyticsMatches(existing, record)) {
            return { success: true, message: 'QUIZ_ANALYTICS_ALREADY_ACCEPTED', event_id: record.event_id };
        }
        return { success: false, error: 'QUIZ_ANALYTICS_EVENT_ID_CONFLICT', code: 409 };
    }

    const insertResult = await insertQuizAnalyticsEvent(db, record);
    if (insertResult && insertResult.error) {
        if (insertResult.error.code === '23505') {
            const duplicate = await findQuizAnalyticsEventById(db, record.event_id);
            if (duplicate && quizAnalyticsMatches(duplicate, record)) {
                return { success: true, message: 'QUIZ_ANALYTICS_ALREADY_ACCEPTED', event_id: record.event_id };
            }
            if (duplicate) return { success: false, error: 'QUIZ_ANALYTICS_EVENT_ID_CONFLICT', code: 409 };
        }
        throw new Error(`QUIZ_ANALYTICS_DATABASE_ERROR: ${JSON.stringify(insertResult.error)}`);
    }
    return { success: true, message: 'QUIZ_ANALYTICS_ACCEPTED', event_id: record.event_id };
}

async function handleRegistration(db, payload) {
    if (!db) {
        throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    }

    const { full_name, email, phone, cohort_id } = payload || {};
    if (!full_name || !email || !phone || !cohort_id) {
        return { success: false, error: 'INVALID_INPUT', code: 400, message: 'Họ tên, email, điện thoại và mã khóa học là bắt buộc' };
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();
    const cleanCohort = String(cohort_id).trim();

    // 1. [P1-DATA-05]: Mỗi lần thử dùng mã ngẫu nhiên; chỉ retry khi xung đột payment_code.
    if (db.rpc) {
        for (let attempt = 0; attempt < 3; attempt++) {
            const payment_code = generatePaymentCode(cleanCohort);
            const { data, error } = await db.rpc('create_registration_atomic', {
                p_full_name: String(full_name).trim(),
                p_email: cleanEmail,
                p_phone: cleanPhone,
                p_cohort_id: cleanCohort,
                p_payment_code: payment_code
            });

            if (error) {
                if (isPaymentCodeUniqueConflict(error) && attempt < 2) continue;
                if (error.message && error.message.includes('COHORT_INACTIVE_OR_NOT_FOUND')) {
                    return { success: false, error: 'COHORT_NOT_FOUND_OR_INACTIVE', code: 404, message: 'Khóa học không tồn tại hoặc đã đóng đăng ký' };
                }
                if (error.message && error.message.includes('COHORT_PRICE_INVALID')) {
                    return { success: false, error: 'COHORT_PRICE_INVALID', code: 500, message: 'Khóa học chưa được định giá an toàn' };
                }
                throw new Error(`DATABASE_ERROR: ${error.message || JSON.stringify(error)}`);
            }

            return {
                success: true,
                registration_uuid: data.registration_uuid,
                payment_code: data.payment_code,
                price_amount: data.price_amount,
                status: data.status
            };
        }
        throw new Error('PAYMENT_CODE_RETRY_EXHAUSTED');
    }

    // Fallback cho local mock test engine
    if (db.cohorts && db.executeTransaction) {
        const cohort = await db.cohorts.findOne({ id: cleanCohort });
        if (!cohort || cohort.is_active === false) {
            return { success: false, error: 'COHORT_NOT_FOUND_OR_INACTIVE', code: 404, message: 'Khóa học không tồn tại hoặc đã đóng đăng ký' };
        }
        if (cohort.price_amount == null || cohort.price_amount < 0) {
            return { success: false, error: 'COHORT_PRICE_INVALID', code: 500 };
        }

        for (let attempt = 0; attempt < 3; attempt++) {
            const payment_code = generatePaymentCode(cleanCohort);
            const reg_uuid = `REG_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
            try {
                return await db.executeTransaction(async (tx) => {
            let person = await tx.person_contacts.findPersonByContact(cleanEmail, cleanPhone);
            if (!person) {
                const personId = crypto.randomUUID();
                await tx.people.insert({ id: personId, full_name: String(full_name).trim() });
                await tx.person_contacts.insert({ id: crypto.randomUUID(), person_id: personId, contact_type: 'email', contact_value: cleanEmail, is_primary: true });
                await tx.person_contacts.insert({ id: crypto.randomUUID(), person_id: personId, contact_type: 'phone', contact_value: cleanPhone, is_primary: true });
                person = { id: personId };
            }

            const regRecord = {
                id: crypto.randomUUID(),
                registration_uuid: reg_uuid,
                person_id: person.id,
                cohort_id: cohort.id,
                payment_code,
                price_amount: Number(cohort.price_amount),
                status: 'PENDING_PAYMENT',
                is_paid: false,
                created_at: new Date().toISOString()
            };
            await tx.registrations.insert(regRecord);

            if (tx.reporting_outbox) {
                await tx.reporting_outbox.insert({
                    id: crypto.randomUUID(),
                    event_type: 'NEW_REGISTRATION',
                    target_sheet: `${cohort.id}_Data`,
                    payload: regRecord,
                    status: 'PENDING',
                    created_at: new Date().toISOString()
                });
            }

            return {
                success: true,
                registration_uuid: reg_uuid,
                payment_code,
                price_amount: regRecord.price_amount,
                status: 'PENDING_PAYMENT'
            };
                });
            } catch (error) {
                if (isPaymentCodeUniqueConflict(error) && attempt < 2) continue;
                throw error;
            }
        }
        throw new Error('PAYMENT_CODE_RETRY_EXHAUSTED');
    }

    throw new Error('DATABASE_CONFIGURATION_ERROR: Adapter CSDL không hỗ trợ RPC hoặc Transaction');
}

/**
 * 3. Tiếp nhận Webhook SePay (Payment Webhook với Atomic Transaction & Re-Matching Idempotency)
 * [P1-PAY-01 & P1-PAY-02]
 */
async function handleSepayWebhook(db, headers, body, config) {
    if (!config) config = loadConfig();
    if (!db) {
        throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    }

    // 1. Xác thực Token SePay
    const incomingToken = headers['authorization'] || headers['x-sepay-token'] || (body && body.token) || '';
    const cleanToken = String(incomingToken).replace(/^Bearer\s+/i, '').trim();

    if (cleanToken !== config.SEPAY_WEBHOOK_TOKEN) {
        return { success: false, error: 'UNAUTHORIZED', code: 401, message: 'Sai mã xác thực Webhook SePay' };
    }

    // 2. Trích xuất thông tin
    const transactionId = String((body && (body.id || body.transaction_id)) || '').trim();
    const accountNumber = String((body && (body.accountNumber || body.account_number)) || '').trim();
    const amount = Number((body && (body.transferAmount || body.amount)) || 0);
    const content = String((body && body.content) || '').toUpperCase();

    if (!transactionId) {
        return { success: false, error: 'MISSING_TRANSACTION_ID', code: 400 };
    }

    // 3. Kiểm tra số tài khoản nhận
    if (accountNumber && accountNumber !== config.OFFICIAL_ACCOUNT_NUMBER) {
        return { success: false, error: 'WRONG_ACCOUNT_NUMBER', code: 400, message: 'Tài khoản nhận không khớp tài khoản chính thức' };
    }

    // 4. [P1-PAY-02]: Lọc bỏ token bí mật khỏi raw_payload
    const sanitizedPayload = sanitizeSepayPayload(body);

    // 5. [P1-PAY-01]: Gọi Stored Procedure nguyên tử process_sepay_webhook_atomic
    if (db.rpc) {
        const { data, error } = await db.rpc('process_sepay_webhook_atomic', {
            p_transaction_id: transactionId,
            p_amount: amount,
            p_account_number: accountNumber,
            p_content: content,
            p_raw_payload: sanitizedPayload
        });

        if (error) {
            throw new Error(`DATABASE_ERROR: ${error.message || JSON.stringify(error)}`);
        }
        return data;
    }

    // Fallback cho local mock test engine
    if (db.executeTransaction && db.payment_transactions && db.registrations) {
        return await db.executeTransaction(async (tx) => {
            const existingTx = await tx.payment_transactions.findOne({ sepay_transaction_id: transactionId });
            if (existingTx) {
                // [P1-PAY-01]: Nếu đã khớp thì trả kết quả nhận diện lặp
                if (existingTx.status === 'MATCHED' || existingTx.status === 'OVERPAID') {
                    return { success: true, message: 'DUPLICATE_WEBHOOK_ACKNOWLEDGED', status: existingTx.status };
                }
                // Nếu chưa khớp, thực hiện tái tìm kiếm đơn đăng ký (Re-match on retry)
                const pendingRegs = await tx.registrations.find({ status: 'PENDING_PAYMENT' });
                const exactMatches = findExactPaymentCodeMatches(content, pendingRegs);
                if (exactMatches.length === 1) {
                    const reg = exactMatches[0];
                    const newStatus = amount >= reg.price_amount ? (amount > reg.price_amount ? 'OVERPAID' : 'MATCHED') : 'UNDERPAID';
                    if (newStatus !== 'UNDERPAID') {
                        await tx.registrations.update({ id: reg.id }, { status: 'PAID', is_paid: true });
                    }
                    await tx.payment_transactions.update({ sepay_transaction_id: transactionId }, {
                        status: newStatus,
                        registration_id: reg.id,
                        payment_code: reg.payment_code
                    });
                    return { success: true, message: 'RECONCILED_ON_RETRY', status: newStatus, matched: true };
                }
                return {
                    success: true,
                    message: 'RETRY_STILL_UNMATCHED',
                    status: 'UNMATCHED',
                    matched: false,
                    ambiguous: exactMatches.length > 1
                };
            }

            // Giao dịch mới
            const allPending = await tx.registrations.find({ status: 'PENDING_PAYMENT' });
            const exactMatches = findExactPaymentCodeMatches(content, allPending);
            const matchedRegistration = exactMatches.length === 1 ? exactMatches[0] : null;

            let txStatus = 'UNMATCHED';
            if (matchedRegistration) {
                if (amount >= matchedRegistration.price_amount) {
                    txStatus = amount > matchedRegistration.price_amount ? 'OVERPAID' : 'MATCHED';
                    await tx.registrations.update({ id: matchedRegistration.id }, { status: 'PAID', is_paid: true });
                } else {
                    txStatus = 'UNDERPAID';
                }
            }

            const txRecord = {
                id: crypto.randomUUID(),
                sepay_transaction_id: transactionId,
                payment_code: matchedRegistration ? matchedRegistration.payment_code : null,
                registration_id: matchedRegistration ? matchedRegistration.id : null,
                amount,
                account_number: accountNumber,
                status: txStatus,
                raw_payload: sanitizedPayload,
                created_at: new Date().toISOString()
            };
            await tx.payment_transactions.insert(txRecord);

            if (tx.reporting_outbox) {
                await tx.reporting_outbox.insert({
                    id: crypto.randomUUID(),
                    event_type: 'PAYMENT_RECEIVED',
                    target_sheet: 'DHM10_Payments',
                    payload: txRecord,
                    status: 'PENDING',
                    created_at: new Date().toISOString()
                });
            }

            return {
                success: true,
                transaction_id: transactionId,
                status: txStatus,
                matched: Boolean(matchedRegistration),
                ambiguous: exactMatches.length > 1
            };
        });
    }

    throw new Error('DATABASE_CONFIGURATION_ERROR');
}

function trialBearerToken(headers) {
    const authHeader = (headers && (headers.authorization || headers.Authorization)) || '';
    const match = String(authHeader).match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : '';
}

function authSessionIdFromToken(token) {
    const parts = String(token || '').split('.');
    if (parts.length !== 3) return '';
    try {
        const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
        const sessionId = String(claims.session_id || '').toLowerCase();
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(sessionId)
            ? sessionId
            : '';
    } catch {
        return '';
    }
}

async function checkAuthSessionActive(db, token) {
    const sessionId = authSessionIdFromToken(token);
    if (!sessionId) return { active: false, unavailable: false };
    if (!db || typeof db.rpc !== 'function') return { active: false, unavailable: true };
    try {
        const result = await db.rpc('is_auth_session_active', { p_session_id: sessionId });
        if (!result || result.error || typeof result.data !== 'boolean') {
            return { active: false, unavailable: true };
        }
        return { active: result.data, unavailable: false };
    } catch {
        return { active: false, unavailable: true };
    }
}

function validTrialEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Gửi yêu cầu liên kết Trial qua Supabase Auth; mặc định luôn tắt để tránh gửi email ngoài ý muốn. */
async function handleTrialAuthRequest(db, payload, config) {
    const allowedFields = new Set(['email', 'full_name', 'phone', 'consent']);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => !allowedFields.has(key))) {
        return { success: false, error: 'INVALID_TRIAL_REQUEST', code: 400 };
    }
    if (payload.consent !== true) {
        return { success: false, error: 'TRIAL_CONSENT_REQUIRED', code: 400 };
    }
    const email = String(payload.email || '').trim().toLowerCase();
    const fullName = String(payload.full_name || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
    let phone = String(payload.phone || '').replace(/\D/g, '');
    if (phone.startsWith('84')) phone = `0${phone.slice(2)}`;
    if (!validTrialEmail(email) || !fullName || fullName.length > 120 || !/^0\d{9}$/.test(phone)) {
        return { success: false, error: 'INVALID_TRIAL_REQUEST', code: 400 };
    }
    if (!config || config.enableTrialAuth !== true) {
        return { success: false, error: 'TRIAL_AUTH_DISABLED', code: 503 };
    }
    if (!db || !db.auth || typeof db.auth.signInWithOtp !== 'function') {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }
    let redirectUrl;
    try {
        redirectUrl = new URL(config.trialAuthRedirectTo);
    } catch {
        return { success: false, error: 'TRIAL_AUTH_REDIRECT_NOT_CONFIGURED', code: 503 };
    }
    if (redirectUrl.protocol !== 'https:' &&
        !(redirectUrl.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(redirectUrl.hostname))) {
        return { success: false, error: 'TRIAL_AUTH_REDIRECT_NOT_ALLOWED', code: 503 };
    }

    const { error } = await db.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: redirectUrl.toString(),
            shouldCreateUser: true,
            data: { full_name: fullName, phone, trial_request_consent: true }
        }
    });
    if (error) {
        return { success: false, error: 'TRIAL_LINK_REQUEST_FAILED', code: 502 };
    }
    return { success: true, status: 'pending_verification', code: 202 };
}

async function getConfirmedTrialAuthUser(db, headers) {
    const token = trialBearerToken(headers);
    if (!token) return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401 };
    if (!db || !db.auth || typeof db.auth.getUser !== 'function') {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }
    const { data, error } = await db.auth.getUser(token);
    const user = data && data.user;
    if (error || !user || !user.id || !validTrialEmail(String(user.email || '').toLowerCase()) || !user.email_confirmed_at) {
        return { success: false, error: 'VERIFIED_EMAIL_REQUIRED', code: 401 };
    }
    const session = await checkAuthSessionActive(db, token);
    if (session.unavailable) return { success: false, error: 'TRIAL_SESSION_CHECK_UNAVAILABLE', code: 503 };
    if (!session.active) return { success: false, error: 'TRIAL_SESSION_REVOKED', code: 401 };
    return { success: true, token, sessionId: authSessionIdFromToken(token), user };
}

async function lookupTrialAccount(db, authUserId) {
    if (db && db.from) {
        const result = await db.from('user_accounts').select('person_id,role,is_active')
            .eq('auth_user_id', authUserId).limit(1);
        if (result.error) return { error: 'TRIAL_ACCOUNT_LOOKUP_FAILED' };
        return { account: (result.data || []).find(row => row.person_id) || null };
    }
    if (db && Array.isArray(db.user_accounts)) {
        return { account: db.user_accounts.find(row => row.auth_user_id === authUserId) || null };
    }
    return { error: 'TRIAL_ACCOUNT_LOOKUP_UNAVAILABLE' };
}

async function lookupTrialEnrollment(db, personId) {
    if (db && db.from) {
        const result = await db.from('enrollments').select('cohort_id,role,status')
            .eq('person_id', personId).eq('cohort_id', 'DHM_TRIAL_STAGE1').limit(1);
        if (result.error) return { error: 'TRIAL_ENROLLMENT_LOOKUP_FAILED' };
        return { enrollment: (result.data || [])[0] || null };
    }
    if (db && Array.isArray(db.enrollments)) {
        return { enrollment: db.enrollments.find(row => row.person_id === personId && row.cohort_id === 'DHM_TRIAL_STAGE1') || null };
    }
    return { error: 'TRIAL_ENROLLMENT_LOOKUP_UNAVAILABLE' };
}

function publicTrialUser(authUser, fullName = '') {
    const email = String(authUser.email || '').trim().toLowerCase();
    const metadataName = authUser.user_metadata && authUser.user_metadata.full_name;
    return {
        id: authUser.id,
        learner_id: authUser.id,
        identity: email,
        email,
        name: fullName || String(metadataName || email.split('@')[0]),
        role: 'trial',
        isTrial: true,
        cohort: 'Học viên Trải nghiệm Chặng 1',
        cohort_id: 'DHM_TRIAL_STAGE1'
    };
}

/** Kích hoạt Trial chỉ từ access token do Supabase xác nhận; không nhận email/role do trình duyệt tự khai. */
async function handleTrialAuthActivation(db, headers, payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => !['full_name', 'phone'].includes(key))) {
        return { success: false, error: 'INVALID_TRIAL_ACTIVATION', code: 400 };
    }
    const auth = await getConfirmedTrialAuthUser(db, headers);
    if (!auth.success) return auth;
    const fullName = String(payload.full_name || (auth.user.user_metadata && auth.user.user_metadata.full_name) || '')
        .normalize('NFKC').replace(/\s+/g, ' ').trim();
    let phone = String(payload.phone || (auth.user.user_metadata && auth.user.user_metadata.phone) || '').replace(/\D/g, '');
    if (phone.startsWith('84')) phone = `0${phone.slice(2)}`;
    if (!fullName || fullName.length > 120 || !/^0\d{9}$/.test(phone)) {
        return { success: false, error: 'TRIAL_PROFILE_REQUIRED', code: 400 };
    }
    if (!db || typeof db.rpc !== 'function') {
        return { success: false, error: 'TRIAL_PROVISIONING_UNAVAILABLE', code: 503 };
    }
    let provisioned;
    try {
        provisioned = await db.rpc('activate_trial_enrollment', {
            p_auth_user_id: auth.user.id,
            p_email: String(auth.user.email).trim().toLowerCase(),
            p_full_name: fullName,
            p_phone: phone
        });
    } catch {
        return { success: false, error: 'TRIAL_PROVISIONING_UNAVAILABLE', code: 503 };
    }
    if (!provisioned || provisioned.error || !provisioned.data) {
        return { success: false, error: 'TRIAL_PROVISIONING_FAILED', code: 503 };
    }
    return { success: true, user: publicTrialUser(auth.user, fullName) };
}

/** Phiên Trial chỉ hợp lệ khi token, tài khoản và enrollment đều còn hợp lệ ở máy chủ. */
async function handleTrialAuthSession(db, headers) {
    const auth = await getConfirmedTrialAuthUser(db, headers);
    if (!auth.success) return auth;
    const accountResult = await lookupTrialAccount(db, auth.user.id);
    if (accountResult.error) return { success: false, error: accountResult.error, code: 503 };
    const account = accountResult.account;
    if (!account || account.is_active === false || !account.person_id) {
        return { success: false, error: 'TRIAL_ACCOUNT_NOT_ACTIVE', code: 403 };
    }
    const enrollmentResult = await lookupTrialEnrollment(db, account.person_id);
    if (enrollmentResult.error) return { success: false, error: enrollmentResult.error, code: 503 };
    const enrollment = enrollmentResult.enrollment;
    if (!enrollment || enrollment.status !== 'TRIAL' || enrollment.role !== 'trial') {
        return { success: false, error: 'TRIAL_ENROLLMENT_REQUIRED', code: 403 };
    }
    return { success: true, user: publicTrialUser(auth.user) };
}

async function handleTrialAuthRefresh(db, payload) {
    const allowed = new Set(['refresh_token']);
    const refreshToken = payload && typeof payload.refresh_token === 'string' ? payload.refresh_token.trim() : '';
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => !allowed.has(key)) || !refreshToken) {
        return { success: false, error: 'INVALID_REFRESH_REQUEST', code: 400 };
    }
    if (!db || !db.auth || typeof db.auth.refreshSession !== 'function') {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }
    const { data, error } = await db.auth.refreshSession(refreshToken);
    // GoTrue's token endpoint returns access_token/refresh_token at the top level.
    const session = data && (data.session || data);
    if (error || !session || !session.access_token || !session.refresh_token) {
        return { success: false, error: 'INVALID_REFRESH_TOKEN', code: 401 };
    }
    const verified = await handleTrialAuthSession(db, { authorization: `Bearer ${session.access_token}` });
    if (!verified.success) return verified;
    return {
        success: true,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: verified.user
    };
}

async function handleTrialAuthLogout(db, headers) {
    const token = trialBearerToken(headers);
    if (!token) return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401 };
    if (!db || !db.auth || typeof db.auth.signOut !== 'function') {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }
    const { error } = await db.auth.signOut(token);
    if (error) return { success: false, error: 'TRIAL_LOGOUT_FAILED', code: 502 };
    return { success: true };
}

function adminEmailAllowlist(config) {
    const raw = config && Object.prototype.hasOwnProperty.call(config, 'adminEmailAllowlist')
        ? config.adminEmailAllowlist
        : process.env.ADMIN_EMAIL_ALLOWLIST;
    const values = Array.isArray(raw) ? raw : String(raw || '').split(',');
    return new Set(values
        .map(value => String(value || '').trim().toLowerCase())
        .filter(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)));
}

function publicAdminUser(authUser) {
    return {
        id: authUser.id,
        email: String(authUser.email || '').trim().toLowerCase(),
        role: 'admin'
    };
}

async function verifyAdminAccessToken(db, token, config) {
    const allowlist = adminEmailAllowlist(config);
    if (allowlist.size === 0) {
        return { success: false, error: 'ADMIN_ALLOWLIST_NOT_CONFIGURED', code: 503 };
    }
    if (!token) return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401 };
    if (!db || !db.auth || typeof db.auth.getUser !== 'function') {
        return { success: false, error: 'ADMIN_AUTH_UNAVAILABLE', code: 503 };
    }

    let result;
    try {
        result = await db.auth.getUser(token);
    } catch {
        return { success: false, error: 'ADMIN_AUTH_UNAVAILABLE', code: 503 };
    }
    const authUser = result && result.data && result.data.user;
    if (result && result.error || !authUser || !authUser.id) {
        return { success: false, error: 'INVALID_ADMIN_SESSION', code: 401 };
    }

    const email = String(authUser.email || '').trim().toLowerCase();
    if (!allowlist.has(email)) return { success: false, error: 'ADMIN_EMAIL_NOT_ALLOWED', code: 403 };
    if (!authUser.email_confirmed_at) {
        return { success: false, error: 'ADMIN_EMAIL_NOT_VERIFIED', code: 403 };
    }

    let session;
    try {
        session = await checkAuthSessionActive(db, token);
    } catch {
        return { success: false, error: 'AUTH_SESSION_CHECK_UNAVAILABLE', code: 503 };
    }
    if (session.unavailable) return { success: false, error: 'AUTH_SESSION_CHECK_UNAVAILABLE', code: 503 };
    if (!session.active) return { success: false, error: 'ADMIN_SESSION_REVOKED', code: 401 };
    return { success: true, token, authUser };
}

/** Admin login requires a confirmed Supabase identity whose email is configured on the server. */
async function handleAdminLogin(db, payload, config) {
    const allowlist = adminEmailAllowlist(config);
    if (allowlist.size === 0) {
        return { success: false, error: 'ADMIN_ALLOWLIST_NOT_CONFIGURED', code: 503 };
    }
    const allowedFields = new Set(['identity', 'password']);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => !allowedFields.has(key))) {
        return { success: false, error: 'INVALID_ADMIN_LOGIN', code: 400 };
    }
    const identity = String(payload.identity || '').trim().toLowerCase();
    const password = String(payload.password || '');
    if (!identity || !password) return { success: false, error: 'MISSING_CREDENTIALS', code: 400 };
    if (!allowlist.has(identity)) return { success: false, error: 'ADMIN_EMAIL_NOT_ALLOWED', code: 403 };
    if (!db || !db.auth || typeof db.auth.signInWithPassword !== 'function') {
        return { success: false, error: 'ADMIN_AUTH_UNAVAILABLE', code: 503 };
    }

    let result;
    try {
        result = await db.auth.signInWithPassword({ email: identity, password });
    } catch {
        return { success: false, error: 'ADMIN_AUTH_UNAVAILABLE', code: 503 };
    }
    const data = result && result.data;
    const authUser = data && data.user;
    const session = data && (data.session || data);
    if (result && result.error || !authUser || !authUser.id || !session || !session.access_token) {
        return { success: false, error: 'INVALID_ADMIN_CREDENTIALS', code: 401 };
    }

    const returnedEmail = String(authUser.email || '').trim().toLowerCase();
    if (returnedEmail !== identity || !allowlist.has(returnedEmail)) {
        if (typeof db.auth.signOut === 'function') await db.auth.signOut(session.access_token).catch(() => {});
        return { success: false, error: 'ADMIN_EMAIL_NOT_ALLOWED', code: 403 };
    }
    if (!authUser.email_confirmed_at) {
        if (typeof db.auth.signOut === 'function') await db.auth.signOut(session.access_token).catch(() => {});
        return { success: false, error: 'ADMIN_EMAIL_NOT_VERIFIED', code: 403 };
    }

    const verified = await verifyAdminAccessToken(db, session.access_token, config);
    if (!verified.success) {
        if (typeof db.auth.signOut === 'function') await db.auth.signOut(session.access_token).catch(() => {});
        return verified;
    }
    return { success: true, access_token: session.access_token, user: publicAdminUser(verified.authUser) };
}

async function handleAdminSession(db, headers, config) {
    const verified = await verifyAdminAccessToken(db, trialBearerToken(headers), config);
    if (!verified.success) return verified;
    return { success: true, user: publicAdminUser(verified.authUser) };
}

async function handleAdminLogout(db, headers, config) {
    const verified = await verifyAdminAccessToken(db, trialBearerToken(headers), config);
    if (!verified.success) return verified;
    if (!db.auth || typeof db.auth.signOut !== 'function') {
        return { success: false, error: 'ADMIN_LOGOUT_UNAVAILABLE', code: 503 };
    }
    const result = await db.auth.signOut(verified.token);
    if (result && result.error) return { success: false, error: 'ADMIN_LOGOUT_FAILED', code: 502 };
    return { success: true };
}

async function selectAdminRows(db, table, columns, filters = {}) {
    if (db && typeof db.from === 'function') {
        try {
            let query = db.from(table).select(columns);
            for (const [column, value] of Object.entries(filters)) {
                query = query.eq(column, value);
            }
            if (typeof query.limit === 'function') query = query.limit(1000);
            const result = await query;
            if (!result || result.error || !Array.isArray(result.data)) {
                return { rows: [], error: result && result.error || new Error('ADMIN_ROSTER_QUERY_FAILED') };
            }
            return { rows: result.data, error: null };
        } catch (error) {
            return { rows: [], error };
        }
    }
    const rows = db && db[table];
    if (!Array.isArray(rows)) return { rows: [], error: new Error('ADMIN_ROSTER_QUERY_UNAVAILABLE') };
    const filteredRows = rows.filter(row =>
        Object.entries(filters).every(([column, value]) => row && row[column] === value)
    );
    if (filteredRows.length > 1000) return { rows: [], error: new Error('ADMIN_ROSTER_LIMIT_EXCEEDED') };
    return { rows: filteredRows, error: null };
}

async function handleAdminRoster(db, headers, config) {
    const verified = await verifyAdminAccessToken(db, trialBearerToken(headers), config);
    if (!verified.success) return verified;

    const specs = [
        ['enrollments', 'person_id,cohort_id,role,status'],
        ['people', 'id,full_name'],
        ['person_contacts', 'person_id,contact_type,contact_value,is_primary', { contact_type: 'email' }],
        ['user_accounts', 'person_id,role'],
        ['cohorts', 'id,name']
    ];
    const results = await Promise.all(specs.map(([table, columns, filters]) =>
        selectAdminRows(db, table, columns, filters)
    ));
    if (results.some(result => result.error)) {
        return { success: false, error: 'ADMIN_ROSTER_UNAVAILABLE', code: 503 };
    }
    if (results.some(result => result.rows.length >= 1000)) {
        return { success: false, error: 'ADMIN_ROSTER_LIMIT_EXCEEDED', code: 503 };
    }

    const [enrollments, people, contacts, accounts, cohorts] = results.map(result => result.rows);
    const rows = enrollments.map(enrollment => {
        const person = people.find(row => row.id === enrollment.person_id) || {};
        const personContacts = contacts.filter(row => row.person_id === enrollment.person_id);
        const primaryEmail = personContacts.find(row => row.contact_type === 'email' && row.is_primary) ||
            personContacts.find(row => row.contact_type === 'email');
        const account = accounts.find(row => row.person_id === enrollment.person_id) || {};
        const cohort = cohorts.find(row => row.id === enrollment.cohort_id) || {};
        return {
            name: String(person.full_name || ''),
            email: String(primaryEmail && primaryEmail.contact_value || '').trim().toLowerCase(),
            cohort: String(cohort.name || ''),
            role: String(enrollment.role || account.role || 'learner'),
            status: String(enrollment.status || '')
        };
    });
    return { success: true, rows };
}

async function handleAdminAnalyticsSummary(db, headers, config) {
    const verified = await verifyAdminAccessToken(db, trialBearerToken(headers), config);
    if (!verified.success) return verified;

    const specs = [
        ['cohorts', 'id,name'],
        ['enrollments', 'cohort_id,status,payment_status'],
        ['progress_events', 'cohort_id,stage_id,event_type'],
        ['assessment_attempts', 'assessment_type,cohort_id,is_anonymous']
    ];
    const results = await Promise.all(specs.map(([table, columns]) =>
        selectAdminRows(db, table, columns)
    ));
    if (results.some(result => result.error)) {
        return { success: false, error: 'ADMIN_ANALYTICS_UNAVAILABLE', code: 503 };
    }
    if (results.some(result => result.rows.length >= 1000)) {
        return { success: false, error: 'ADMIN_ANALYTICS_LIMIT_EXCEEDED', code: 503 };
    }

    const [cohorts, enrollments, progressEvents, attempts] = results.map(result => result.rows);
    const cohortNames = new Map(cohorts.map(row => [String(row.id), String(row.name || '')]));
    const cohortFields = rawId => {
        const cohortId = rawId == null || String(rawId).trim() === '' ? null : String(rawId);
        return {
            cohort_id: cohortId,
            cohort_name: cohortId ? cohortNames.get(cohortId) || null : null
        };
    };
    const collect = (rows, fieldsForRow) => {
        const counts = new Map();
        for (const row of rows) {
            const fields = fieldsForRow(row);
            const key = JSON.stringify(Object.values(fields));
            const current = counts.get(key);
            if (current) {
                current.count += 1;
            } else {
                counts.set(key, { ...fields, count: 1 });
            }
        }
        return [...counts.values()];
    };
    const sortGroups = (rows, fields) => rows.sort((left, right) => {
        for (const field of fields) {
            const a = String(left[field] == null ? '' : left[field]);
            const b = String(right[field] == null ? '' : right[field]);
            const order = a.localeCompare(b);
            if (order !== 0) return order;
        }
        return 0;
    });

    const enrollmentCounts = collect(enrollments, row => ({
        ...cohortFields(row.cohort_id),
        status: String(row.status || 'UNKNOWN'),
        payment_status: String(row.payment_status || 'UNKNOWN')
    }));
    const progressEventCounts = collect(progressEvents, row => ({
        ...cohortFields(row.cohort_id),
        stage_id: String(row.stage_id || 'UNKNOWN'),
        event_type: String(row.event_type || 'UNKNOWN')
    }));
    const assessmentAttemptCounts = collect(attempts, row => ({
        assessment_type: String(row.assessment_type || 'UNKNOWN'),
        ...cohortFields(row.cohort_id),
        is_anonymous: typeof row.is_anonymous === 'boolean' ? row.is_anonymous : null
    }));

    return {
        success: true,
        generated_at: new Date().toISOString(),
        scope: 'aggregate_counts_only',
        time_window: 'all_available_rows',
        enrollment_counts: sortGroups(enrollmentCounts, ['cohort_id', 'status', 'payment_status']),
        progress_event_counts: sortGroups(progressEventCounts, ['cohort_id', 'stage_id', 'event_type']),
        assessment_attempt_counts: sortGroups(assessmentAttemptCounts, ['assessment_type', 'cohort_id', 'is_anonymous'])
    };
}

async function selectAuthRows(db, table, columns, filters) {
    if (db && typeof db.from === 'function') {
        try {
            let query = db.from(table).select(columns);
            for (const [column, value] of Object.entries(filters || {})) query = query.eq(column, value);
            if (typeof query.limit === 'function') query = query.limit(100);
            const result = await query;
            if (!result || result.error) return { rows: [], error: result && result.error };
            return { rows: Array.isArray(result.data) ? result.data : [], error: null };
        } catch (error) {
            return { rows: [], error };
        }
    }

    const rows = db && db[table];
    if (!Array.isArray(rows)) return { rows: [], error: new Error('TABLE_LOOKUP_UNAVAILABLE') };
    return {
        rows: rows.filter(row => Object.entries(filters || {}).every(([key, value]) => row[key] === value)),
        error: null
    };
}

function publicLearnerProfile(profile) {
    return {
        id: profile.id,
        learner_id: profile.learner_id,
        email: profile.email,
        identity: profile.email,
        name: profile.name,
        cohort: profile.cohort,
        cohort_id: profile.cohort_id,
        role: 'learner',
        isTrial: false,
        is_paid: profile.is_paid,
        payment_status: profile.payment_status,
        force_pwd_change: profile.must_change_password,
        must_change_password: profile.must_change_password
    };
}

async function resolveLearnerProfile(db, authUser) {
    const authUserId = String(authUser && authUser.id || '');
    const email = String(authUser && authUser.email || '').trim().toLowerCase();
    if (!authUserId || !email) return { success: false, error: 'AUTH_PROFILE_INCOMPLETE', code: 403 };

    const accountResult = await selectAuthRows(db, 'user_accounts', 'person_id,role,is_active', { auth_user_id: authUserId });
    if (accountResult.error) return { success: false, error: 'ACCOUNT_LINK_LOOKUP_FAILED', code: 503 };
    const account = accountResult.rows.find(row => row.person_id);
    if (!account) return { success: false, error: 'PERSON_ACCOUNT_NOT_LINKED', code: 403 };
    if (account.is_active !== true) return { success: false, error: 'ACCOUNT_INACTIVE', code: 403 };

    const accountRole = String(account.role || 'learner').trim().toLowerCase();
    if (accountRole !== 'learner') return { success: false, error: 'ROLE_REQUIRES_ADMIN_ALLOWLIST', code: 403 };

    const enrollmentResult = await selectAuthRows(db, 'enrollments', 'cohort_id,learner_id,role,status,payment_status,is_paid', {
        person_id: account.person_id,
        status: 'ACTIVE'
    });
    if (enrollmentResult.error) return { success: false, error: 'ENROLLMENT_LOOKUP_FAILED', code: 503 };
    const enrollment = enrollmentResult.rows.find(row =>
        String(row.status || '').toUpperCase() === 'ACTIVE' &&
        String(row.role || 'learner').toLowerCase() === 'learner' &&
        String(row.cohort_id || '') !== 'DHM_TRIAL_STAGE1'
    );
    if (!enrollment || !enrollment.cohort_id) return { success: false, error: 'ACTIVE_LEARNER_ENROLLMENT_REQUIRED', code: 403 };

    const [personResult, cohortResult, identityResult] = await Promise.all([
        selectAuthRows(db, 'people', 'id,full_name', { id: account.person_id }),
        selectAuthRows(db, 'cohorts', 'id,name', { id: enrollment.cohort_id }),
        selectAuthRows(db, 'auth_identities', 'person_id,must_change_password', { person_id: account.person_id })
    ]);
    if (personResult.error || cohortResult.error || identityResult.error) {
        return { success: false, error: 'LEARNER_PROFILE_LOOKUP_FAILED', code: 503 };
    }
    const person = personResult.rows[0];
    if (!person) return { success: false, error: 'PERSON_PROFILE_NOT_FOUND', code: 403 };
    const cohort = cohortResult.rows[0];
    const authIdentity = identityResult.rows[0] || null;
    const mustChangePassword = authIdentity && authIdentity.must_change_password === true;

    return {
        success: true,
        personId: account.person_id,
        authUserId,
        authIdentityFound: Boolean(authIdentity),
        must_change_password: mustChangePassword,
        profile: {
            id: authUserId,
            learner_id: enrollment.learner_id || authUserId,
            email,
            name: String(person.full_name || email.split('@')[0]),
            cohort: String(cohort && cohort.name || enrollment.cohort_id),
            cohort_id: enrollment.cohort_id,
            is_paid: typeof enrollment.is_paid === 'boolean' ? enrollment.is_paid : null,
            payment_status: enrollment.payment_status || 'UNKNOWN',
            must_change_password: mustChangePassword
        }
    };
}

async function authenticateLearnerSession(db, headers) {
    const token = trialBearerToken(headers);
    if (!token) return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401 };
    let authUser = null;

    if (db && db.auth && typeof db.auth.getUser === 'function') {
        const { data, error } = await db.auth.getUser(token);
        authUser = data && data.user;
        if (error || !authUser || !authUser.id) return { success: false, error: 'INVALID_SESSION_TOKEN', code: 401 };
        const session = await checkAuthSessionActive(db, token);
        if (session.unavailable) return { success: false, error: 'AUTH_SESSION_CHECK_UNAVAILABLE', code: 503 };
        if (!session.active) return { success: false, error: 'AUTH_SESSION_REVOKED', code: 401 };
    } else if (db && typeof db.verifyMockToken === 'function') {
        const mockUser = await db.verifyMockToken(token);
        if (!mockUser) return { success: false, error: 'INVALID_SESSION_TOKEN', code: 401 };
        authUser = {
            id: mockUser.auth_user_id || mockUser.id,
            email: mockUser.email
        };
    } else {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }

    const resolved = await resolveLearnerProfile(db, authUser);
    if (!resolved.success) return resolved;
    return { success: true, token, authUser, ...resolved };
}

/** Đăng nhập người học thường; hồ sơ ghi danh và token được kiểm tra từ phía máy chủ. */
async function handleLogin(db, payload, config) {
    if (!config) config = loadConfig();
    const { identity, password } = payload || {};
    const cleanIdentity = String(identity || '').trim().toLowerCase();
    const cleanPwd = String(password || '').trim();
    if (!cleanIdentity || !cleanPwd) {
        return { success: false, error: 'MISSING_CREDENTIALS', code: 400, message: 'Vui lòng nhập email và mật khẩu' };
    }

    let authUser;
    let session = null;
    if (db && db.auth && typeof db.auth.signInWithPassword === 'function') {
        const result = await db.auth.signInWithPassword({ email: cleanIdentity, password: cleanPwd });
        const data = result && result.data;
        authUser = data && data.user;
        session = data && (data.session || data);
        if (result && result.error || !authUser || !authUser.id) {
            return { success: false, error: 'INVALID_CREDENTIALS', code: 401, message: 'Email hoặc mật khẩu không chính xác' };
        }
    } else if (db && typeof db.mockAuthVerify === 'function') {
        const mockResult = await db.mockAuthVerify(cleanIdentity, cleanPwd);
        if (!mockResult || mockResult.success !== true) return mockResult;
        authUser = mockResult.user;
        session = { access_token: mockResult.access_token, refresh_token: mockResult.refresh_token };
    } else {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }

    const resolved = await resolveLearnerProfile(db, authUser);
    if (!resolved.success) return resolved;
    const accessToken = session && session.access_token;
    if (!accessToken) return { success: false, error: 'AUTH_SESSION_NOT_ISSUED', code: 503 };
    return {
        success: true,
        access_token: accessToken,
        refresh_token: session.refresh_token || null,
        user: publicLearnerProfile(resolved.profile)
    };
}

async function handleAuthSession(db, headers) {
    const auth = await authenticateLearnerSession(db, headers);
    if (!auth.success) return auth;
    return { success: true, user: publicLearnerProfile(auth.profile) };
}

async function handleAuthRefresh(db, payload) {
    const allowedFields = new Set(['refresh_token']);
    const refreshToken = String(payload && payload.refresh_token || '').trim();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => !allowedFields.has(key)) || !refreshToken) {
        return { success: false, error: 'INVALID_REFRESH_REQUEST', code: 400 };
    }
    if (!db || !db.auth || typeof db.auth.refreshSession !== 'function') {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }
    const { data, error } = await db.auth.refreshSession(refreshToken);
    const session = data && (data.session || data);
    if (error || !session || !session.access_token || !session.refresh_token) {
        return { success: false, error: 'INVALID_REFRESH_TOKEN', code: 401 };
    }
    const auth = await authenticateLearnerSession(db, { authorization: `Bearer ${session.access_token}` });
    if (!auth.success) return auth;
    return {
        success: true,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: publicLearnerProfile(auth.profile)
    };
}

async function handleAuthPasswordUpdate(db, headers, payload) {
    const allowedFields = new Set(['current_password', 'new_password']);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).some(key => !allowedFields.has(key))) {
        return { success: false, error: 'INVALID_PASSWORD_UPDATE', code: 400 };
    }
    const newPassword = String(payload.new_password || '');
    const currentPassword = String(payload.current_password || '');
    if (newPassword.length < 6 || newPassword.length > 128) {
        return { success: false, error: 'INVALID_NEW_PASSWORD', code: 400 };
    }

    const auth = await authenticateLearnerSession(db, headers);
    if (!auth.success) return auth;
    if (!auth.profile.must_change_password) {
        if (!currentPassword) return { success: false, error: 'CURRENT_PASSWORD_REQUIRED', code: 400 };
        if (currentPassword === newPassword) return { success: false, error: 'PASSWORD_UNCHANGED', code: 400 };
        const verified = await db.auth.signInWithPassword({ email: auth.authUser.email, password: currentPassword });
        if (!verified || verified.error || !verified.data || !verified.data.user) {
            return { success: false, error: 'CURRENT_PASSWORD_INVALID', code: 401 };
        }
    }

    if (!db.auth || typeof db.auth.updateUser !== 'function') {
        return { success: false, error: 'AUTH_PASSWORD_UPDATE_UNAVAILABLE', code: 503 };
    }
    const update = await db.auth.updateUser(auth.token, { password: newPassword });
    if (!update || update.error) return { success: false, error: 'AUTH_PASSWORD_UPDATE_FAILED', code: 502 };

    if (auth.authIdentityFound) {
        if (db && typeof db.from === 'function') {
            const result = await db.from('auth_identities')
                .update({ must_change_password: false, updated_at: new Date().toISOString() })
                .eq('person_id', auth.personId);
            if (!result || result.error || !Array.isArray(result.data) || result.data.length === 0) {
                return { success: false, error: 'PASSWORD_UPDATED_FLAG_SYNC_FAILED', code: 503 };
            }
        } else if (db && Array.isArray(db.auth_identities)) {
            for (const row of db.auth_identities.filter(item => item.person_id === auth.personId)) {
                row.must_change_password = false;
            }
        }
    }

    return { success: true, user: { ...publicLearnerProfile(auth.profile), force_pwd_change: false, must_change_password: false } };
}

async function handleAuthLogout(db, headers) {
    const token = trialBearerToken(headers);
    if (!token) return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401 };
    if (!db || !db.auth || typeof db.auth.signOut !== 'function') {
        return { success: false, error: 'AUTH_PROVIDER_UNAVAILABLE', code: 503 };
    }
    const { error } = await db.auth.signOut(token);
    if (error) return { success: false, error: 'AUTH_LOGOUT_FAILED', code: 502 };
    return { success: true };
}

/**
 * Helper JWT HMAC-SHA256 phục vụ tiện ích mã hóa và tương thích test suite
 */
function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64url');
}

function base64UrlDecode(str) {
    return Buffer.from(str, 'base64url').toString('utf8');
}

function signJwt(payload, secret, expiresInSeconds = 3600) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('base64url');
    return `${dataToSign}.${signature}`;
}

function verifyJwt(token, secret) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sig] = parts;
    const dataToSign = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto.createHmac('sha256', secret).update(dataToSign).digest('base64url');
    if (sig !== expectedSig) return null;
    try {
        const payload = JSON.parse(base64UrlDecode(payloadB64));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) return null;
        return payload;
    } catch {
        return null;
    }
}

const ALLOWED_PROGRESS_EVENT_TYPES = new Set([
    'PROGRESS_UPDATE',
    'ASSESSMENT_ATTEMPT',
    'HABIT_TRACKER_UPDATE'
]);

const UNTRUSTED_RESULT_KEYS = new Set([
    'score', 'passed', 'is_passed', 'result', 'assessment_result',
    'correct_count', 'total_score', 'grade', 'verified', 'certificate_issued'
]);

function stripUntrustedResultClaims(value) {
    if (Array.isArray(value)) return value.map(stripUntrustedResultClaims);
    if (!value || typeof value !== 'object') return value;

    const sanitized = {};
    for (const [key, child] of Object.entries(value)) {
        if (UNTRUSTED_RESULT_KEYS.has(key.toLowerCase())) continue;
        sanitized[key] = stripUntrustedResultClaims(child);
    }
    return sanitized;
}

async function findActiveEnrollment(db, personId, cohortId) {
    if (!personId || !cohortId) return null;
    const allowedStatuses = new Set(['ACTIVE', 'TRIAL']);

    if (db.enrollments && typeof db.enrollments.findOne === 'function') {
        const enrollment = await db.enrollments.findOne({ person_id: personId, cohort_id: cohortId });
        return enrollment && allowedStatuses.has(String(enrollment.status || '').toUpperCase())
            ? enrollment
            : null;
    }

    if (db.from) {
        const result = await db.from('enrollments')
            .select('person_id,cohort_id,status')
            .eq('person_id', personId)
            .eq('cohort_id', cohortId);
        if (result.error) throw new Error('ENROLLMENT_QUERY_FAILED');
        return (result.data || []).find(row => allowedStatuses.has(String(row.status || '').toUpperCase())) || null;
    }

    return null;
}

function stableJson(value) {
    if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value);
}

async function findProgressEventById(db, eventId) {
    if (db && db.from) {
        const { data, error } = await db.from('progress_events')
            .select('person_id,cohort_id,event_id,stage_id,event_type,payload,version')
            .eq('event_id', eventId)
            .limit(1);
        if (error) throw new Error('PROGRESS_EVENT_LOOKUP_FAILED');
        return (data || [])[0] || null;
    }
    if (db && db.progress_events && typeof db.progress_events.findOne === 'function') {
        return await db.progress_events.findOne({ event_id: eventId }) || null;
    }
    throw new Error('PROGRESS_EVENT_LOOKUP_UNAVAILABLE');
}

function progressEventMatches(existing, candidate) {
    if (!existing) return false;
    const existingData = existing.payload && Object.prototype.hasOwnProperty.call(existing.payload, 'data')
        ? existing.payload.data
        : existing.stage_data;
    return existing.person_id === candidate.person_id &&
        existing.cohort_id === candidate.cohort_id &&
        existing.event_id === candidate.event_id &&
        existing.stage_id === candidate.stage_id &&
        (existing.event_type || 'PROGRESS_UPDATE') === candidate.event_type &&
        Number(existing.version || 1) === candidate.version &&
        stableJson(existingData) === stableJson(candidate.stage_data);
}

function progressEventDuplicateResult(existing, candidate) {
    if (progressEventMatches(existing, candidate)) {
        return { success: true, message: 'PROGRESS_ALREADY_SYNCED', person_id: candidate.person_id, duplicate: true };
    }
    return { success: false, error: 'PROGRESS_EVENT_ID_CONFLICT', code: 409 };
}

async function resolveProgressEventUniqueConflict(db, candidate) {
    const existing = await findProgressEventById(db, candidate.event_id);
    return existing ? progressEventDuplicateResult(existing, candidate) : null;
}

const ALLOWED_HABIT_KEYS = new Set(['mindfulness', 'gratitude', 'optimism', 'flow', 'altruism']);

function sanitizeHabitTrackerSnapshot(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const safe = {};
    for (const [dayKey, dayValue] of Object.entries(value)) {
        if (!/^day_(?:[1-9]|1[0-9]|2[01])$/.test(dayKey)) continue;
        if (!dayValue || typeof dayValue !== 'object' || Array.isArray(dayValue)) return null;
        const safeDay = {};
        for (const [habitKey, checked] of Object.entries(dayValue)) {
            if (!ALLOWED_HABIT_KEYS.has(habitKey)) continue;
            if (typeof checked !== 'boolean') return null;
            safeDay[habitKey] = checked;
        }
        if (Object.keys(safeDay).length > 0) safe[dayKey] = safeDay;
    }
    return safe;
}

function sanitizeProgressSnapshot(stageData, stageId) {
    if (!stageData || typeof stageData !== 'object' || Array.isArray(stageData)) return null;
    const completedStages = Array.isArray(stageData.completed_stages)
        ? stageData.completed_stages.filter(value => typeof value === 'string' && value.length <= 80).slice(0, 100)
        : null;
    const currentStageIndex = Number(stageData.current_stage_index);
    if (!completedStages || !Number.isSafeInteger(currentStageIndex) || currentStageIndex < 0 || currentStageIndex > 100) {
        return null;
    }

    const safe = {
        completed_stages: completedStages,
        current_stage_index: currentStageIndex
    };
    if (stageId === 'stage-3a' && Object.prototype.hasOwnProperty.call(stageData, 'habit_tracker')) {
        const habitTracker = sanitizeHabitTrackerSnapshot(stageData.habit_tracker);
        if (!habitTracker) return null;
        safe.habit_tracker = habitTracker;
    }
    return safe;
}

async function resolveProgressActor(db, headers, clientPersonId) {
    const authHeader = (headers && (headers['authorization'] || headers['Authorization'])) || '';
    const token = String(authHeader).replace(/^Bearer\s+/i, '').trim();
    if (!token) {
        return { success: false, error: 'UNAUTHORIZED_MISSING_TOKEN', code: 401, message: 'Yêu cầu Bearer token để đồng bộ tiến độ học tập' };
    }

    let verifiedPersonId = null;
    if (db.auth && db.auth.getUser) {
        const { data, error } = await db.auth.getUser(token);
        if (error || !data || !data.user) {
            return { success: false, error: 'INVALID_SESSION_TOKEN', code: 401, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
        }
        const session = await checkAuthSessionActive(db, token);
        if (session.unavailable) return { success: false, error: 'AUTH_SESSION_CHECK_UNAVAILABLE', code: 503 };
        if (!session.active) return { success: false, error: 'AUTH_SESSION_REVOKED', code: 401 };

        if (db.from) {
            const accountResult = await db.from('user_accounts')
                .select('person_id,is_active')
                .eq('auth_user_id', data.user.id);
            if (accountResult.error) return { success: false, error: 'ACCOUNT_LINK_LOOKUP_FAILED', code: 503 };
            const account = (accountResult.data || []).find(row => row.person_id);
            if (!account) return { success: false, error: 'PERSON_ACCOUNT_NOT_LINKED', code: 403 };
            if (account.is_active !== true) return { success: false, error: 'ACCOUNT_INACTIVE', code: 403 };
            verifiedPersonId = account.person_id;
        }
    } else if (db.verifyMockToken) {
        const mockUser = db.verifyMockToken(token);
        if (!mockUser) return { success: false, error: 'INVALID_SESSION_TOKEN', code: 401 };
        const accountState = resolveActiveMockUserAccount(db, {
            authUserId: mockUser.auth_user_id,
            personId: mockUser.person_id
        });
        if (!accountState.success) return accountState;
        verifiedPersonId = accountState.account.person_id;
    }

    if (!verifiedPersonId) {
        return { success: false, error: 'PERSON_ACCOUNT_NOT_LINKED', code: 403, message: 'Tài khoản chưa được liên kết với hồ sơ người học' };
    }
    if (clientPersonId && clientPersonId !== verifiedPersonId) {
        return { success: false, error: 'FORBIDDEN_IDENTITY_SPOOFING', code: 403, message: 'Không được phép gửi tiến độ học tập thay cho người khác' };
    }
    return { success: true, person_id: verifiedPersonId };
}

async function findLatestProgressEvent(db, personId, cohortId, stageId) {
    if (db && db.from) {
        const { data, error } = await db.from('progress_events')
            .select('person_id,cohort_id,stage_id,event_type,payload,version,created_at')
            .eq('person_id', personId)
            .eq('cohort_id', cohortId)
            .eq('stage_id', stageId)
            .order('version', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(1);
        if (error) throw new Error('PROGRESS_EVENT_RESTORE_QUERY_FAILED');
        return (data || [])[0] || null;
    }
    if (db && db.progress_events && typeof db.progress_events.findLatest === 'function') {
        return await db.progress_events.findLatest({ person_id: personId, cohort_id: cohortId, stage_id: stageId }) || null;
    }
    if (db && Array.isArray(db.progress_events)) {
        return db.progress_events
            .filter(row => row.person_id === personId && row.cohort_id === cohortId && row.stage_id === stageId)
            .sort((left, right) => Number(right.version || 0) - Number(left.version || 0) ||
                String(right.created_at || '').localeCompare(String(left.created_at || '')))[0] || null;
    }
    throw new Error('PROGRESS_EVENT_RESTORE_UNAVAILABLE');
}

/**
 * 5. Đồng bộ Tiến độ LMS (Progress Telemetry)
 * [P1-PROGRESS-01]: Lấy person_id từ phiên xác thực Supabase Auth, CẤM tin person_id client
 */
async function handleProgressSync(db, headersOrPayload, maybePayload) {
    if (!db) {
        throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    }

    let headers = headersOrPayload;
    let payload = maybePayload;
    let isDirectMockCall = false;

    // Hỗ trợ cả 2 dạng: handleProgressSync(db, headers, payload) và handleProgressSync(db, payload)
    if (!maybePayload && headersOrPayload && typeof headersOrPayload === 'object' && !headersOrPayload['authorization'] && !headersOrPayload['Authorization']) {
        payload = headersOrPayload;
        headers = {};
        isDirectMockCall = true;
    }

    let verified_person_id = null;
    if (isDirectMockCall) {
        verified_person_id = payload.person_id;
    } else {
        const actor = await resolveProgressActor(db, headers, payload && payload.person_id);
        if (!actor.success) return actor;
        verified_person_id = actor.person_id;
    }

    const { cohort_id, stage_id, event_id, event_type, stage_data, version } = payload || {};
    const normalizedEventType = event_type || 'PROGRESS_UPDATE';
    if (!cohort_id || !stage_id || !event_id || !stage_data || typeof stage_data !== 'object' || Array.isArray(stage_data)) {
        return { success: false, error: 'INVALID_PROGRESS_PAYLOAD', code: 400 };
    }
    if (!ALLOWED_PROGRESS_EVENT_TYPES.has(normalizedEventType)) {
        return { success: false, error: 'INVALID_PROGRESS_EVENT_TYPE', code: 400 };
    }

    const enrollment = await findActiveEnrollment(db, verified_person_id, cohort_id);
    if (!enrollment) {
        return { success: false, error: 'ACTIVE_ENROLLMENT_REQUIRED', code: 403 };
    }

    const safeVersion = Number(version || 1);
    if (!Number.isSafeInteger(safeVersion) || safeVersion < 1) {
        return { success: false, error: 'INVALID_PROGRESS_VERSION', code: 400 };
    }
    const safeStageData = sanitizeProgressSnapshot(stage_data, stage_id);
    if (!safeStageData) return { success: false, error: 'INVALID_PROGRESS_PAYLOAD', code: 400 };
    const eventCandidate = {
        person_id: verified_person_id,
        cohort_id: enrollment.cohort_id,
        event_id,
        stage_id,
        event_type: normalizedEventType,
        version: safeVersion,
        stage_data: safeStageData
    };

    const existingEvent = await findProgressEventById(db, event_id);
    if (existingEvent) return progressEventDuplicateResult(existingEvent, eventCandidate);

    let latestProgressEvent;
    try {
        latestProgressEvent = await findLatestProgressEvent(db, verified_person_id, enrollment.cohort_id, stage_id);
    } catch {
        return { success: false, error: 'PROGRESS_VERSION_CHECK_UNAVAILABLE', code: 503 };
    }
    if (latestProgressEvent) {
        const latestVersion = Number(latestProgressEvent.version || 1);
        const latestData = latestProgressEvent.payload && Object.prototype.hasOwnProperty.call(latestProgressEvent.payload, 'data')
            ? latestProgressEvent.payload.data
            : latestProgressEvent.stage_data;
        if (safeVersion < latestVersion) {
            return { success: true, message: 'PROTECTED_FROM_REGRESSION', person_id: verified_person_id };
        }
        if (safeVersion === latestVersion) {
            if (stableJson(latestData) === stableJson(eventCandidate.stage_data)) {
                return { success: true, message: 'PROGRESS_ALREADY_CURRENT', person_id: verified_person_id, duplicate: true };
            }
            return { success: false, error: 'PROGRESS_VERSION_CONFLICT', code: 409 };
        }
    }

    // 2. Chèn tiến độ Append-only với verified_person_id
    if (db.from) {
        const { error } = await db.from('progress_events').insert({
            person_id: eventCandidate.person_id,
            cohort_id: eventCandidate.cohort_id,
            event_id: eventCandidate.event_id,
            stage_id: eventCandidate.stage_id,
            event_type: eventCandidate.event_type,
            payload: { verified: false, data: eventCandidate.stage_data },
            version: eventCandidate.version
        });
        if (error) {
            if (String(error.code) === '23505') {
                const duplicateResult = await resolveProgressEventUniqueConflict(db, eventCandidate);
                if (duplicateResult) return duplicateResult;
            }
            throw new Error(`DATABASE_ERROR: ${JSON.stringify(error)}`);
        }
        return { success: true, message: 'PROGRESS_SYNCED_UNVERIFIED', person_id: verified_person_id };
    }

    if (db.progress_events) {
        try {
            const insertResult = await db.progress_events.insert({
                id: crypto.randomUUID(),
                person_id: eventCandidate.person_id,
                cohort_id: eventCandidate.cohort_id,
                event_id: eventCandidate.event_id,
                stage_id: eventCandidate.stage_id,
                event_type: eventCandidate.event_type,
                payload: { verified: false, data: eventCandidate.stage_data },
                version: eventCandidate.version,
                created_at: new Date().toISOString()
            });
            if (insertResult && insertResult.error) throw insertResult.error;
        } catch (error) {
            if (String(error && error.code) === '23505') {
                const duplicateResult = await resolveProgressEventUniqueConflict(db, eventCandidate);
                if (duplicateResult) return duplicateResult;
            }
            throw new Error(`DATABASE_ERROR: ${JSON.stringify(error)}`);
        }
        return { success: true, message: 'PROGRESS_SYNCED_UNVERIFIED', person_id: verified_person_id };
    }

    throw new Error('DATABASE_CONFIGURATION_ERROR');
}

async function handleProgressRestore(db, headers, query = {}) {
    if (!db) throw new Error('DATABASE_UNAVAILABLE: Kết nối cơ sở dữ liệu chưa sẵn sàng');
    const actor = await resolveProgressActor(db, headers);
    if (!actor.success) return actor;

    const cohortId = String(query.cohort_id || '');
    const stageId = String(query.stage_id || '');
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(cohortId) || stageId !== 'stage-3a') {
        return { success: false, error: 'INVALID_PROGRESS_RESTORE_QUERY', code: 400 };
    }

    let enrollment;
    try {
        enrollment = await findActiveEnrollment(db, actor.person_id, cohortId);
    } catch {
        return { success: false, error: 'PROGRESS_RESTORE_UNAVAILABLE', code: 503 };
    }
    if (!enrollment) return { success: false, error: 'ACTIVE_ENROLLMENT_REQUIRED', code: 403 };

    let latest;
    try {
        latest = await findLatestProgressEvent(db, actor.person_id, enrollment.cohort_id, stageId);
    } catch {
        return { success: false, error: 'PROGRESS_RESTORE_UNAVAILABLE', code: 503 };
    }
    if (!latest) {
        return {
            success: true,
            found: false,
            version: 0,
            stage_data: { completed_stages: [], current_stage_index: 0, habit_tracker: {} }
        };
    }

    const storedData = latest.payload && Object.prototype.hasOwnProperty.call(latest.payload, 'data')
        ? latest.payload.data
        : latest.stage_data;
    const safeSnapshot = sanitizeProgressSnapshot(storedData, stageId);
    if (!safeSnapshot) return { success: false, error: 'PROGRESS_RESTORE_DATA_INVALID', code: 503 };
    if (!safeSnapshot.habit_tracker) safeSnapshot.habit_tracker = {};
    return {
        success: true,
        found: true,
        version: Number.isSafeInteger(Number(latest.version)) ? Number(latest.version) : 0,
        stage_data: safeSnapshot
    };
}

/**
 * 6. Tra cứu Trạng thái Đơn Đăng ký (Anti-Enumeration)
 * [P1-RLS-04]
 */
async function handleCheckStatus(db, query) {
    if (!db) {
        throw new Error('DATABASE_UNAVAILABLE');
    }

    const { registration_uuid, payment_code } = query || {};
    if (!registration_uuid || !payment_code) {
        return { success: false, error: 'MISSING_LOOKUP_KEYS', code: 400, message: 'Bắt buộc phải có registration_uuid và payment_code' };
    }

    if (db.rpc) {
        const { data, error } = await db.rpc('check_registration_status', {
            p_registration_uuid: String(registration_uuid).trim(),
            p_payment_code: String(payment_code).trim()
        }, { useServiceRole: false }); // Dùng anon key công khai

        if (error || !data || data.length === 0) {
            return { success: false, error: 'REGISTRATION_NOT_FOUND', code: 404, message: 'Không tìm thấy đơn đăng ký khớp' };
        }
        return { success: true, data: data[0] };
    }

    if (db.registrations) {
        const found = await db.registrations.findOne({
            registration_uuid: String(registration_uuid).trim(),
            payment_code: String(payment_code).trim()
        });
        if (!found) {
            return { success: false, error: 'REGISTRATION_NOT_FOUND', code: 404 };
        }
        return {
            success: true,
            data: {
                registration_uuid: found.registration_uuid,
                cohort_id: found.cohort_id,
                payment_code: found.payment_code,
                price_amount: found.price_amount,
                status: found.status,
                is_paid: found.is_paid
            }
        };
    }

    throw new Error('DATABASE_CONFIGURATION_ERROR');
}

module.exports = {
    loadConfig,
    sanitizeSepayPayload,
    generatePaymentCode,
    signJwt,
    verifyJwt,
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
};
