const crypto = require('crypto');

const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec';

const DEFAULT_PASSCODES = ['DHM8', 'DHM9', 'DHM10', 'ABCDE'];
const EMAIL_TOKEN_TTL_SECONDS = 1800; // 30 phút

// System Socratic Prompt for Gemini
const SOCRATIC_SYSTEM_INSTRUCTION = `
Bạn là Trợ lý Lạc quan Socratic (Socratic Optimism Assistant) từ Deliver Happiness. Nhiệm vụ của bạn là đồng hành và dẫn dắt học viên thực hành mô hình Lạc quan ABCDE của Martin Seligman theo phương pháp đối thoại Socratic.

Hãy kiểm soát chặt chẽ tiến độ và quyết định trạng thái tiếp theo bằng cách thêm tag [NEXT_STATE: <STATE>] ở cuối câu trả lời của bạn:
- Nếu state = "STEP_A": Nhiệm vụ quan trọng nhất là giúp học viên mô tả Nghịch cảnh (A) một cách khách quan 100%, không chứa sự suy diễn, đổ lỗi hay tâm lý nạn nhân (ví dụ: "sếp ghét tôi", "họ cố tình trù dập", "bất công với tôi").
  + Hãy phân tích mô tả A của học viên. Nếu phát hiện có yếu tố cảm xúc phán xét hoặc đổ lỗi, hãy chỉ ra một cách khéo léo và chủ động gợi ý họ tạm "để dành" suy nghĩ/suy diễn đó lại cho bước B (Belief) tiếp theo. Ví dụ: "Tôi nghe thấy suy nghĩ của bạn là sếp đang ghét bỏ bạn. Đây thực chất là Niềm tin (B) của bạn về sự việc, chúng ta hãy tạm 'để dành' ý này lại cho bước B nhé! Còn bây giờ ở bước A, sự thật vật lý khách quan xảy ra ở đây là gì?". Giữ tag [NEXT_STATE: STEP_A].
  + Chỉ khi học viên đã mô tả được A một cách khách quan, trung tính (ví dụ: "ý tưởng bị từ chối trong cuộc họp", "đồng nghiệp chưa trả lời tin nhắn sau 4 tiếng"), hãy ghi nhận A và đặt câu hỏi gợi mở sang B (Belief - suy nghĩ tự động nảy sinh). Khi đó, dùng tag [NEXT_STATE: STEP_B].
- Nếu state = "STEP_B": Học viên đang tìm cách nhận diện Niềm tin tự động (Belief - B). Đừng bắt họ đưa ra một niềm tin hoàn chỉnh ngay.
  + Hãy kiểm tra lịch sử trò chuyện ở bước A. Nếu trước đó học viên đã đưa ra các suy diễn/đổ lỗi cảm tính (tâm lý nạn nhân) và bị bạn khuyên "để dành", hãy chủ động nhắc lại và sử dụng chính những suy nghĩ đó làm chất liệu khởi đầu cho bước B (Ví dụ: "Bây giờ sang bước B, hãy lấy lại suy nghĩ bạn đã 'để dành' ở bước A lúc nãy là sếp đang ghét bỏ bạn...").
  + Kết hợp đặt các câu hỏi gợi mở Socratic khác (ví dụ về nguyên nhân do đâu, xu hướng đổ lỗi) để giúp họ bóc tách và gọi tên chính xác niềm tin tự động cốt lõi. Khi đã xác định xong, dùng tag [NEXT_STATE: STEP_C].
- Nếu state = "STEP_C": Ghi nhận Niềm tin B. Hỏi họ về Hệ quả (Consequence - C) - tức là cảm xúc tiêu cực (buồn, giận, lo lắng...) và hành vi phản ứng (im lặng, bỏ cuộc, tranh cãi...) xuất hiện trực tiếp từ niềm tin B đó. Hãy nhấn mạnh để họ thấy rõ mối liên kết: chính Niềm tin B sinh ra Hệ quả C, chứ không phải bản thân Nghịch cảnh A. Khi họ trả lời xong, dùng tag [NEXT_STATE: STEP_D].
- Nếu state = "STEP_D": Học viên đang thực hành Phản biện (Disputation - D).
  + Khi nhận tin nhắn thông thường ở bước D, hãy luân phiên đặt câu hỏi gợi mở phản biện: hỏi về Bằng chứng thực tế (Evidence) hoặc Lợi ích của suy nghĩ (Utility) ở lượt đầu; hỏi về Cách giải thích thay thế (Alternatives) hoặc Hệ quả tồi tệ nhất (Implications) ở lượt tiếp theo. Giữ tag [NEXT_STATE: STEP_D].
  + Nếu nhận tin nhắn tự động: "Tôi muốn phản biện sâu thêm.", hãy đặt tiếp câu hỏi phản biện sâu sắc hơn về khía cạnh chưa khai thác. Giữ tag [NEXT_STATE: STEP_D].
  + Nếu nhận tin nhắn tự động: "Tôi đã sẵn sàng chuyển sang bước E.", hãy ghi nhận, tán thưởng và đặt câu hỏi dẫn dắt sang bước E. Dùng tag [NEXT_STATE: STEP_E].
- Nếu state = "STEP_E": Đây là bước Energization — ghi nhận và phản chiếu lại trạng thái năng lượng/cảm xúc tích cực mới mà học viên đang cảm nhận sau khi phản biện thành công ở bước D. Hỏi một câu về cảm xúc/năng lượng trước (ví dụ: "Bạn cảm thấy thế nào sau khi đã bẻ gãy được suy nghĩ tiêu cực đó?"). Sau đó hỏi tiếp: "Từ năng lượng và góc nhìn mới này, bạn nghĩ mình có thể tiếp cận lại nghịch cảnh A theo những hướng nào?" — nhớ rằng câu trả lời có thể là hành động cụ thể hoặc chỉ là sự thay đổi nhận thức, chấp nhận, hoặc tiến về phía trước. Cả hai đều là cách "tiếp cận lại A" hợp lệ theo đúng tinh thần Seligman. AI không phán xét loại câu trả lời. Khi học viên đã trả lời, tán thưởng và dùng tag [NEXT_STATE: SUBMIT].

Quy tắc giao tiếp:
- Luôn ưu tiên tiếng Việt, xưng hô lịch sự (bạn - tôi hoặc anh/chị - tôi).
- Giữ câu trả lời ngắn gọn, tập trung. Mỗi lượt chỉ phản hồi tối đa 2-3 câu và đặt đúng 1 câu hỏi gợi mở cho bước hiện tại.
- Tag [NEXT_STATE: <STATE>] bắt buộc phải viết chính xác ở cuối tin nhắn, sử dụng các giá trị: STEP_A, STEP_B, STEP_C, STEP_D, STEP_E, SUBMIT.
`;

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (err) {
      return {};
    }
  }
  return body;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  const xff = req && req.headers ? req.headers['x-forwarded-for'] : '';
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  if (Array.isArray(xff) && xff.length > 0 && xff[0]) {
    return String(xff[0]).split(',')[0].trim();
  }
  return (req && req.socket && req.socket.remoteAddress) ? String(req.socket.remoteAddress) : 'unknown-ip';
}

function sortCanonicalValue(val) {
  if (val === null || typeof val !== 'object') return val;
  if (Array.isArray(val)) {
    return val.map((item) => (item === undefined ? null : sortCanonicalValue(item)));
  }
  const keys = Object.keys(val).sort();
  const out = {};
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (val[k] !== undefined) {
      out[k] = sortCanonicalValue(val[k]);
    }
  }
  return out;
}

function canonicalJsonStringify(val) {
  return JSON.stringify(sortCanonicalValue(val));
}

function buildSignedGasEnvelope(actionPayload, sharedToken) {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(16).toString('hex');
  const canonicalPayload = canonicalJsonStringify(actionPayload);
  const payloadHash = crypto.createHash('sha256').update(canonicalPayload, 'utf8').digest('hex');
  const stringToSign = `${actionPayload.action}.${timestamp}.${nonce}.${payloadHash}`;
  const signature = crypto.createHmac('sha256', sharedToken).update(stringToSign, 'utf8').digest('hex');

  return {
    ...actionPayload,
    timestamp,
    nonce,
    payloadHash,
    signature
  };
}

function base64UrlEncode(input) {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input) {
  let b64 = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  return Buffer.from(b64, 'base64').toString('utf8');
}

function issueEmailAuthToken(email, fullName, secret) {
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    email: String(email || '').trim().toLowerCase(),
    fullName: String(fullName || '').trim(),
    scope: 'abcde_email',
    iat: nowSec,
    exp: nowSec + EMAIL_TOKEN_TTL_SECONDS
  };
  const encodedPayload = base64UrlEncode(canonicalJsonStringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(encodedPayload, 'utf8').digest('hex');
  return `${encodedPayload}.${sig}`;
}

function verifyEmailAuthToken(token, expectedEmail, secret) {
  if (!token || typeof token !== 'string' || !secret) {
    return { valid: false, error: 'MISSING_TOKEN' };
  }
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'MALFORMED_TOKEN' };
  }
  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) {
    return { valid: false, error: 'MALFORMED_TOKEN' };
  }

  const expectedSig = crypto.createHmac('sha256', secret).update(encodedPayload, 'utf8').digest('hex');
  const bufProvided = Buffer.from(String(providedSig).toLowerCase(), 'utf8');
  const bufExpected = Buffer.from(expectedSig, 'utf8');
  if (bufProvided.length !== bufExpected.length || !crypto.timingSafeEqual(bufProvided, bufExpected)) {
    return { valid: false, error: 'INVALID_TOKEN_SIGNATURE' };
  }

  let parsed = null;
  try {
    parsed = JSON.parse(base64UrlDecode(encodedPayload));
  } catch (err) {
    return { valid: false, error: 'INVALID_TOKEN_PAYLOAD' };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (!parsed || parsed.scope !== 'abcde_email') {
    return { valid: false, error: 'INVALID_TOKEN_SCOPE' };
  }
  if (typeof parsed.exp !== 'number' || nowSec > parsed.exp) {
    return { valid: false, error: 'EXPIRED_TOKEN' };
  }
  const normExpectedEmail = String(expectedEmail || '').trim().toLowerCase();
  if (!parsed.email || parsed.email !== normExpectedEmail) {
    return { valid: false, error: 'EMAIL_MISMATCH' };
  }
  return { valid: true, payload: parsed };
}

// In-memory rate limit fallback (ephemeral per serverless isolate)
const memoryBuckets = new Map();
let lastFallbackWarnMs = 0;

function checkInMemoryWindowLimit(bucketKey, limit, windowSec) {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const timestamps = (memoryBuckets.get(bucketKey) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  memoryBuckets.set(bucketKey, timestamps);

  if (memoryBuckets.size > 2000) {
    for (const [k, list] of memoryBuckets.entries()) {
      const active = list.filter((t) => now - t < windowMs);
      if (active.length === 0) memoryBuckets.delete(k);
    }
  }
  return timestamps.length <= limit;
}

function logRedisFallbackOnce(reason) {
  const now = Date.now();
  if (now - lastFallbackWarnMs > 60000) {
    lastFallbackWarnMs = now;
    console.warn(`[ABCDE RateLimit] Fallback sang bộ nhớ tiến trình cục bộ (${reason}).`);
  }
}

async function checkRedisWindowLimit(bucketName, identifier, limit, windowSec, fetchImpl) {
  const safeId = crypto.createHash('sha256').update(String(identifier || 'unknown')).digest('hex').slice(0, 32);
  const fullKey = `ratelimit:abcde:${bucketName}:${safeId}`;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const doFetch = fetchImpl || globalThis.fetch;

  if (!url || !token || typeof doFetch !== 'function') {
    logRedisFallbackOnce('thiếu KV_REST_API_URL/TOKEN');
    return checkInMemoryWindowLimit(fullKey, limit, windowSec);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const resp = await doFetch(`${url.replace(/\/+$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['INCR', fullKey],
        ['TTL', fullKey]
      ]),
      signal: controller.signal
    });
    if (!resp.ok) {
      logRedisFallbackOnce(`HTTP ${resp.status}`);
      return checkInMemoryWindowLimit(fullKey, limit, windowSec);
    }
    const pipelineRes = await resp.json();
    const incrEntry = Array.isArray(pipelineRes) ? pipelineRes[0] : null;
    const ttlEntry = Array.isArray(pipelineRes) ? pipelineRes[1] : null;
    const count = incrEntry && typeof incrEntry.result === 'number' ? incrEntry.result : null;
    const ttl = ttlEntry && typeof ttlEntry.result === 'number' ? ttlEntry.result : -1;

    if (count === null) {
      logRedisFallbackOnce('định dạng phản hồi Upstash không hợp lệ');
      return checkInMemoryWindowLimit(fullKey, limit, windowSec);
    }

    if (ttl < 0) {
      const expireCtrl = new AbortController();
      const expireTimer = setTimeout(() => expireCtrl.abort(), 1500);
      try {
        await doFetch(`${url.replace(/\/+$/, '')}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([['EXPIRE', fullKey, windowSec]]),
          signal: expireCtrl.signal
        });
      } finally {
        clearTimeout(expireTimer);
      }
    }

    return count <= limit;
  } catch (err) {
    logRedisFallbackOnce(err && err.message ? err.message : 'exception');
    return checkInMemoryWindowLimit(fullKey, limit, windowSec);
  } finally {
    clearTimeout(timer);
  }
}

async function callSignedAppsScript(appsScriptUrl, actionPayload, sharedToken, timeoutMs, fetchImpl) {
  const envelope = buildSignedGasEnvelope(actionPayload, sharedToken);
  const doFetch = fetchImpl || globalThis.fetch;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs || 8500);

  try {
    const response = await doFetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelope),
      signal: controller.signal
    });

    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      parsed = null;
    }

    const isValidJsonObj = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
    return {
      httpOk: Boolean(response && response.ok),
      status: response ? response.status : 0,
      rawText: text,
      parsed: isValidJsonObj ? parsed : null
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function isValidEmailFormat(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function handler(req, res) {
  // CORS Check
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  // Rate-Limit-First: chặn spam IP ngay trước khi kiểm tra passcode và các nhánh khác
  const ip = getClientIp(req);
  const ipAllowed = await checkRedisWindowLimit('ip', ip, 20, 60);
  if (!ipAllowed) {
    return sendJson(res, 429, {
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'Bạn đã thao tác quá nhanh. Vui lòng đợi 1 phút.'
    });
  }

  const body = normalizeBody(req.body);
  const action = String(body.action || '').trim();
  const passcode = String(body.passcode || '').trim().toUpperCase();

  // 1. Verify Passcode Action
  const validPasscodes = process.env.DHM_PASSCODE
    ? process.env.DHM_PASSCODE.split(',').map((p) => p.trim().toUpperCase()).filter(Boolean)
    : DEFAULT_PASSCODES;

  if (action === 'verify_passcode') {
    if (validPasscodes.includes(passcode)) {
      return sendJson(res, 200, { success: true });
    }
    return sendJson(res, 200, { success: false, message: 'Mật mã lớp học không chính xác.' });
  }

  // 2. Access control check for all authenticated classroom actions
  if (!validPasscodes.includes(passcode)) {
    return sendJson(res, 403, { success: false, error: 'INVALID_PASSCODE', message: 'Mật mã không hợp lệ.' });
  }

  // 3. Action: Chat
  if (action === 'chat') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY env variable.');
      return sendJson(res, 500, { success: false, error: 'MISSING_API_KEY', message: 'Cấu hình hệ thống bị thiếu.' });
    }

    const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const state = String(body.state || 'INIT').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    const contents = history.map((h) => ({
      role: h.role === 'ai' ? 'model' : 'user',
      parts: [{ text: String(h.content || '') }]
    }));

    const requestPayload = {
      contents,
      systemInstruction: {
        parts: [{ text: `${SOCRATIC_SYSTEM_INSTRUCTION}\nHiện tại đang ở trạng thái: ${state}. Bạn hãy bám sát chỉ thị của trạng thái này.` }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8500);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini API Error:', response.status, errText);
        if (response.status === 429) {
          return sendJson(res, 429, {
            success: false,
            error: 'GEMINI_RATE_LIMIT',
            message: 'Hệ thống AI đang tiếp nhận nhiều lượt thực hành cùng lúc. Vui lòng thử lại sau 15 giây.'
          });
        }
        return sendJson(res, 502, { success: false, error: 'GEMINI_API_FAILED', message: 'Không thể nhận phản hồi từ AI.' });
      }

      const data = await response.json();
      const replyText =
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
          ? data.candidates[0].content.parts[0].text
          : 'Tôi chưa hiểu ý bạn, vui lòng mô tả rõ hơn.';

      const VALID_NEXT_STATES = new Set(['STEP_A', 'STEP_B', 'STEP_C', 'STEP_D', 'STEP_E', 'SUBMIT']);
      const match = replyText.match(/\[NEXT_STATE:\s*(\w+)\]/i);
      let nextState = state;
      let cleanReply = replyText;
      if (match) {
        const candidateState = match[1].toUpperCase();
        if (VALID_NEXT_STATES.has(candidateState)) {
          nextState = candidateState;
        }
        cleanReply = replyText.replace(/\[NEXT_STATE:\s*\w+\]/i, '').trim();
      }
      const lastHist = history.length ? history[history.length - 1] : null;
      const trimmedMsg = String(body.message || (lastHist && lastHist.role === 'user' ? lastHist.content : '') || '').trim();
      if (state === 'STEP_D') {
        if (trimmedMsg === 'Tôi đã sẵn sàng chuyển sang bước E.' || trimmedMsg === 'Đã hiệu quả, đi tiếp') {
          nextState = 'STEP_E';
        } else if (trimmedMsg === 'Tôi muốn phản biện sâu thêm.' || trimmedMsg === 'Tôi muốn phản biện thêm.') {
          nextState = 'STEP_D';
        }
      }

      return sendJson(res, 200, { success: true, reply: cleanReply, nextState });
    } catch (err) {
      console.error('Fetch Gemini exception:', err);
      const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
      return sendJson(res, 502, {
        success: false,
        error: isTimeout ? 'GEMINI_TIMEOUT' : 'FETCH_GEMINI_EXCEPTION',
        message: isTimeout ? 'Yêu cầu tới AI đã quá thời gian chờ. Vui lòng bấm Thử lại tin nhắn.' : 'Lỗi kết nối AI.'
      });
    }
  }

  // Các hành động chạm Google Apps Script (1B-LMS & Submit) bắt buộc có khóa bí mật HMAC
  const sharedToken = process.env.DHM8_APPS_SCRIPT_TOKEN;
  if (!sharedToken) {
    console.error('[ABCDE Config] Missing DHM8_APPS_SCRIPT_TOKEN environment variable.');
    return sendJson(res, 500, {
      success: false,
      error: 'CONFIG_ERROR',
      message: 'Hệ thống chưa được cấu hình khóa xác thực máy chủ.'
    });
  }
  const emailTokenSecret = process.env.ABCDE_EMAIL_TOKEN_SECRET || sharedToken;
  const appsScriptUrl = process.env.DHM8_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;

  // 4. Action: Xác thực chủ sở hữu bằng Email + Mật khẩu LMS (1B-LMS)
  if (action === 'verify_lms_owner') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    if (!isValidEmailFormat(email) || !password) {
      return sendJson(res, 400, {
        success: false,
        error: 'BAD_REQUEST',
        message: 'Vui lòng nhập Email hợp lệ và Mật khẩu LMS.'
      });
    }

    const pairAllowed = await checkRedisWindowLimit('lms_owner', `${ip}|${email}`, 5, 900);
    if (!pairAllowed) {
      return sendJson(res, 429, {
        success: false,
        error: 'TOO_MANY_AUTH_ATTEMPTS',
        message: 'Bạn đã thử mật khẩu quá 5 lần. Vui lòng đợi 15 phút hoặc dùng mã OTP qua Email.'
      });
    }

    try {
      const gasRes = await callSignedAppsScript(
        appsScriptUrl,
        { action: 'abcde_verify_lms_owner', email, password },
        sharedToken,
        8500
      );

      if (!gasRes.httpOk || !gasRes.parsed) {
        return sendJson(res, 502, {
          success: false,
          error: 'UPSTREAM_APPS_SCRIPT_FAILED',
          message: 'Không thể kết nối máy chủ xác thực học viên.'
        });
      }

      const parsed = gasRes.parsed;
      if (parsed.error === 'INVALID_SIGNATURE' || parsed.error === 'SIGNATURE_EXPIRED' || parsed.error === 'REPLAY_DETECTED') {
        return sendJson(res, 403, { success: false, error: parsed.error, message: parsed.message || 'Lỗi chữ ký cổng xác thực.' });
      }
      if (parsed.error === 'GAS_CONFIG_ERROR') {
        return sendJson(res, 502, { success: false, error: parsed.error, message: parsed.message || 'Máy chủ Apps Script chưa cấu hình khóa xác thực.' });
      }

      if (!parsed.success || !parsed.verified) {
        return sendJson(res, 403, {
          success: false,
          verified: false,
          error: parsed.error || 'LMS_VERIFICATION_FAILED',
          message: parsed.message || 'Thông tin Email hoặc Mật khẩu LMS chưa khớp.'
        });
      }

      const verifiedEmail = String(parsed.email || email).trim().toLowerCase();
      const verifiedName = String(parsed.fullName || '').trim();
      const emailAuthToken = issueEmailAuthToken(verifiedEmail, verifiedName, emailTokenSecret);

      return sendJson(res, 200, {
        success: true,
        verified: true,
        email: verifiedEmail,
        fullName: verifiedName,
        emailAuthToken
      });
    } catch (err) {
      const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
      return sendJson(res, 502, {
        success: false,
        error: isTimeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_FETCH_ERROR',
        message: isTimeout ? 'Máy chủ xác thực phản hồi chậm. Vui lòng thử lại.' : 'Lỗi kết nối máy chủ xác thực.'
      });
    }
  }

  // 5. Action: Yêu cầu gửi mã OTP 6 số tới Email học viên LMS / Auth Gate (1B-LMS)
  if (action === 'request_email_otp') {
    const email = String(body.email || '').trim().toLowerCase();
    if (!isValidEmailFormat(email)) {
      return sendJson(res, 400, {
        success: false,
        error: 'INVALID_EMAIL',
        message: 'Vui lòng nhập địa chỉ Email hợp lệ.'
      });
    }

    const pairAllowed = await checkRedisWindowLimit('otp_req_pair', `${ip}|${email}`, 2, 900);
    const ipOtpAllowed = await checkRedisWindowLimit('otp_req_ip', ip, 5, 3600);
    if (!pairAllowed || !ipOtpAllowed) {
      return sendJson(res, 429, {
        success: false,
        error: 'OTP_RATE_LIMITED',
        message: 'Bạn đã yêu cầu mã OTP quá số lần cho phép. Vui lòng kiểm tra hộp thư hoặc đợi 15 phút.'
      });
    }

    try {
      const gasRes = await callSignedAppsScript(
        appsScriptUrl,
        { action: 'abcde_request_email_otp', email },
        sharedToken,
        8500
      );

      if (!gasRes.httpOk || !gasRes.parsed) {
        return sendJson(res, 502, {
          success: false,
          error: 'UPSTREAM_APPS_SCRIPT_FAILED',
          message: 'Không thể gửi yêu cầu mã OTP tới máy chủ.'
        });
      }

      const parsed = gasRes.parsed;
      if (parsed.error === 'INVALID_SIGNATURE' || parsed.error === 'SIGNATURE_EXPIRED' || parsed.error === 'REPLAY_DETECTED') {
        return sendJson(res, 403, { success: false, error: parsed.error, message: parsed.message || 'Lỗi chữ ký cổng xác thực.' });
      }
      if (!parsed.success) {
        const statusCode = parsed.error === 'NOT_AUTHORIZED_LEARNER' ? 403 : (parsed.error === 'OTP_COOLDOWN' ? 429 : 502);
        return sendJson(res, statusCode, {
          success: false,
          error: parsed.error || 'OTP_REQUEST_FAILED',
          message: parsed.message || 'Không thể gửi mã OTP.'
        });
      }

      return sendJson(res, 200, {
        success: true,
        email,
        cooldownSeconds: parsed.cooldownSeconds || 60,
        message: parsed.message || 'Mã OTP 6 số đã được gửi tới hộp thư của bạn.'
      });
    } catch (err) {
      const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
      return sendJson(res, 502, {
        success: false,
        error: isTimeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_FETCH_ERROR',
        message: isTimeout ? 'Máy chủ gửi OTP phản hồi chậm. Vui lòng thử lại.' : 'Lỗi kết nối máy chủ gửi OTP.'
      });
    }
  }

  // 6. Action: Kiểm tra mã OTP 6 số (1B-LMS)
  if (action === 'verify_email_otp') {
    const email = String(body.email || '').trim().toLowerCase();
    const otp = String(body.otp || '').trim();
    if (!isValidEmailFormat(email) || !/^\d{6}$/.test(otp)) {
      return sendJson(res, 400, {
        success: false,
        error: 'INVALID_OTP_FORMAT',
        message: 'Vui lòng nhập Email hợp lệ và mã OTP gồm đúng 6 chữ số.'
      });
    }

    const pairAllowed = await checkRedisWindowLimit('otp_verify', `${ip}|${email}`, 5, 900);
    if (!pairAllowed) {
      return sendJson(res, 429, {
        success: false,
        error: 'TOO_MANY_OTP_ATTEMPTS',
        message: 'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng đợi 15 phút.'
      });
    }

    try {
      const gasRes = await callSignedAppsScript(
        appsScriptUrl,
        { action: 'abcde_verify_email_otp', email, otp },
        sharedToken,
        8500
      );

      if (!gasRes.httpOk || !gasRes.parsed) {
        return sendJson(res, 502, {
          success: false,
          error: 'UPSTREAM_APPS_SCRIPT_FAILED',
          message: 'Không thể kiểm tra mã OTP trên máy chủ.'
        });
      }

      const parsed = gasRes.parsed;
      if (parsed.error === 'INVALID_SIGNATURE' || parsed.error === 'SIGNATURE_EXPIRED' || parsed.error === 'REPLAY_DETECTED') {
        return sendJson(res, 403, { success: false, verified: false, error: parsed.error, message: parsed.message || 'Lỗi chữ ký cổng xác thực.' });
      }
      if (parsed.error === 'GAS_CONFIG_ERROR') {
        return sendJson(res, 502, { success: false, verified: false, error: parsed.error, message: parsed.message || 'Máy chủ Apps Script chưa cấu hình khóa xác thực.' });
      }
      if (!parsed.success || !parsed.verified) {
        return sendJson(res, 403, {
          success: false,
          verified: false,
          error: parsed.error || 'OTP_VERIFICATION_FAILED',
          message: parsed.message || 'Mã OTP không đúng hoặc đã hết hạn.'
        });
      }

      const verifiedEmail = String(parsed.email || email).trim().toLowerCase();
      const verifiedName = String(parsed.fullName || '').trim();
      const emailAuthToken = issueEmailAuthToken(verifiedEmail, verifiedName, emailTokenSecret);

      return sendJson(res, 200, {
        success: true,
        verified: true,
        email: verifiedEmail,
        fullName: verifiedName,
        emailAuthToken
      });
    } catch (err) {
      const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
      return sendJson(res, 502, {
        success: false,
        error: isTimeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_FETCH_ERROR',
        message: isTimeout ? 'Máy chủ kiểm tra OTP phản hồi chậm.' : 'Lỗi kết nối máy chủ kiểm tra OTP.'
      });
    }
  }

  // 7. Action: Submit Practice Data to Google Sheets + Email Report
  if (action === 'submit') {
    const fullName = String(body.fullName || '').replace(/[\r\n]+/g, ' ').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const submissionId = String(body.submissionId || '').trim();
    const practiceData = (body.data && typeof body.data === 'object' && !Array.isArray(body.data)) ? body.data : {};
    const chatVersion = String(body.chatVersion || 'stable').trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!fullName || fullName.length > 100 || !isValidEmailFormat(email) || !submissionId || submissionId.length > 128) {
      return sendJson(res, 400, {
        success: false,
        error: 'BAD_REQUEST',
        message: 'Thiếu hoặc sai định dạng họ tên, email hoặc mã định danh bài nộp.'
      });
    }

    const submitAllowed = await checkRedisWindowLimit('submit', `${ip}|${email}`, 5, 900);
    if (!submitAllowed) {
      return sendJson(res, 429, {
        success: false,
        error: 'SUBMIT_RATE_LIMITED',
        message: 'Bạn đã gửi báo cáo quá nhiều lần trong ít phút. Vui lòng đợi trước khi thử lại.'
      });
    }

    // Kiểm tra bắt buộc quyền sở hữu Email (1B-LMS) trước khi chuyển tiếp GAS
    const authCheck = verifyEmailAuthToken(body.emailAuthToken, email, emailTokenSecret);
    if (!authCheck.valid) {
      return sendJson(res, 403, {
        success: false,
        error: 'EMAIL_AUTH_REQUIRED',
        reason: authCheck.error,
        message: 'Vui lòng xác thực tài khoản LMS hoặc mã OTP 6 số cho địa chỉ Email này trước khi gửi báo cáo.'
      });
    }

    const actionPayload = {
      action: 'submit_abcde',
      submissionId,
      fullName,
      email,
      passcode,
      chatVersion,
      emailAuthVerified: true,
      data: practiceData,
      history
    };

    try {
      const gasRes = await callSignedAppsScript(appsScriptUrl, actionPayload, sharedToken, 8500);
      const parsed = gasRes.parsed;

      // Fail-closed nghiêm ngặt: mọi phản hồi không phải HTTP 2xx + JSON hợp lệ { success: true } đều bị từ chối
      if (!gasRes.httpOk || !parsed) {
        console.error('Apps Script non-JSON or HTTP error:', gasRes.status, (gasRes.rawText || '').slice(0, 300));
        return sendJson(res, 502, {
          success: false,
          error: 'UPSTREAM_APPS_SCRIPT_FAILED',
          message: 'Máy chủ lưu trữ trả về phản hồi không hợp lệ. Vui lòng dùng nút Sao chép hoặc Lưu PDF để bảo toàn bài thực hành.'
        });
      }

      if (parsed.success !== true) {
        const isSecurityError = ['INVALID_SIGNATURE', 'SIGNATURE_EXPIRED', 'REPLAY_DETECTED', 'EMAIL_AUTH_REQUIRED'].includes(parsed.error);
        return sendJson(res, isSecurityError ? 403 : 502, {
          success: false,
          error: parsed.error || 'UPSTREAM_APPS_SCRIPT_FAILED',
          message: parsed.message || 'Không thể lưu bài tập về Google Sheets.'
        });
      }

      return sendJson(res, 200, {
        success: true,
        duplicate: Boolean(parsed.duplicate),
        sheetSaved: parsed.sheetSaved !== false,
        emailSent: Boolean(parsed.emailSent),
        emailMessage: parsed.emailMessage || '',
        upstream: parsed
      });
    } catch (err) {
      console.error('Apps Script fetch exception:', err);
      const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
      return sendJson(res, 502, {
        success: false,
        error: isTimeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_FETCH_ERROR',
        message: isTimeout ? 'Máy chủ lưu trữ phản hồi quá lâu. Vui lòng bấm Thử lại hoặc lưu PDF tại chỗ.' : 'Lỗi kết nối máy chủ lưu trữ.'
      });
    }
  }

  return sendJson(res, 400, { success: false, error: 'UNKNOWN_ACTION' });
}

handler._internal = {
  DEFAULT_PASSCODES,
  normalizeBody,
  sortCanonicalValue,
  canonicalJsonStringify,
  buildSignedGasEnvelope,
  issueEmailAuthToken,
  verifyEmailAuthToken,
  checkInMemoryWindowLimit,
  checkRedisWindowLimit,
  callSignedAppsScript,
  memoryBuckets
};

module.exports = handler;
