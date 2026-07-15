const crypto = require('crypto');

const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec';

const DEFAULT_PASSCODES = ['DHM8', 'DHM9', 'ABCDE'];

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
- Nếu state = "STEP_E": Ghi nhận hành động mới (E) và cảm xúc mới của học viên. Tán thưởng và đưa ra lời động viên, chúc mừng họ đã hoàn thành xuất sắc toàn bộ bài tập ABCDE Socratic. Khi họ trả lời xong, dùng tag [NEXT_STATE: SUBMIT].

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

// Simple in-memory rate limit fallback for Vercel Hobby (or edge proxy)
// Note: In serverless, memory is ephemeral, but it acts as a basic last-resort guard.
const ipCache = new Map();
function checkInMemoryRateLimit(ip) {
  const now = Date.now();
  const limit = 20; // 20 requests
  const windowMs = 60000; // per 1 minute

  if (!ipCache.has(ip)) {
    ipCache.set(ip, []);
  }

  const timestamps = ipCache.get(ip).filter(t => now - t < windowMs);
  timestamps.push(now);
  ipCache.set(ip, timestamps);

  return timestamps.length <= limit;
}

// Rest Redis Rate Limit (Upstash/Vercel KV)
async function checkRedisRateLimit(ip) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return checkInMemoryRateLimit(ip);
  }

  const key = `ratelimit:abcde:${ip}`;
  const now = Date.now();
  const window = 60; // 60 seconds

  try {
    // Multi exec via REST
    const response = await fetch(`${url}/multi`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['CL.THROTTLE', key, 20, 20, window] // Cell Rate Limiting Algorithm
      ])
    });
    const result = await response.json();
    if (result && result[0] && result[0].result) {
      // 0 means allowed
      return result[0].result[0] === 0;
    }
    return checkInMemoryRateLimit(ip);
  } catch (err) {
    console.error('Rate limit Redis error:', err);
    return checkInMemoryRateLimit(ip);
  }
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

  const body = normalizeBody(req.body);
  const action = body.action || '';
  const passcode = (body.passcode || '').trim().toUpperCase();

  // 1. Verify Passcode Action
  const validPasscodes = process.env.DHM_PASSCODE
    ? process.env.DHM_PASSCODE.split(',').map(p => p.trim().toUpperCase())
    : DEFAULT_PASSCODES;

  if (action === 'verify_passcode') {
    if (validPasscodes.includes(passcode)) {
      return sendJson(res, 200, { success: true });
    }
    return sendJson(res, 200, { success: false, message: 'Mật mã lớp học không chính xác.' });
  }

  // 2. Access control check for main actions
  if (!validPasscodes.includes(passcode)) {
    return sendJson(res, 403, { success: false, error: 'INVALID_PASSCODE', message: 'Mật mã không hợp lệ.' });
  }

  // 3. Rate Limit Enforcement
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const limitPassed = await checkRedisRateLimit(ip);
  if (!limitPassed) {
    return sendJson(res, 429, { success: false, error: 'TOO_MANY_REQUESTS', message: 'Bạn đã thao tác quá nhanh. Vui lòng đợi 1 phút.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY env variable.');
    return sendJson(res, 500, { success: false, error: 'MISSING_API_KEY', message: 'Cấu hình hệ thống bị thiếu.' });
  }

  const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

  // Action: Chat
  if (action === 'chat') {
    const state = body.state || 'INIT';
    const message = body.message || '';
    const history = body.history || [];

    // Map history to Gemini content structure
    const contents = history.map(h => ({
      role: h.role === 'ai' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Append system instruction and context
    const requestPayload = {
      contents: contents,
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
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini API Error:', errText);
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

      // Parse [NEXT_STATE: STATE] from reply
      const match = replyText.match(/\[NEXT_STATE:\s*(\w+)\]/);
      let nextState = state;
      let cleanReply = replyText;
      if (match) {
        nextState = match[1];
        cleanReply = replyText.replace(/\[NEXT_STATE:\s*\w+\]/, '').trim();
      }

      return sendJson(res, 200, { success: true, reply: cleanReply, nextState: nextState });
    } catch (err) {
      console.error('Fetch Gemini exception:', err);
      return sendJson(res, 502, { success: false, error: 'FETCH_GEMINI_EXCEPTION', message: 'Lỗi kết nối AI.' });
    }
  }

  // Action: Submit Practice Data to Google Sheets
  if (action === 'submit') {
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim();
    const practiceData = body.data || {};
    const chatVersion = body.chatVersion || 'stable';

    if (!fullName || !email) {
      return sendJson(res, 400, { success: false, error: 'BAD_REQUEST', message: 'Thiếu thông tin người dùng.' });
    }

    const appsScriptUrl = process.env.DHM8_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
    const sharedToken = process.env.DHM8_APPS_SCRIPT_TOKEN || 'shared-token-key-2026';

    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(16).toString('hex');
    const dataString = JSON.stringify(practiceData);
    const payloadHash = crypto.createHash('sha256').update(dataString).digest('hex');

    // Create HMAC Signature
    const stringToSign = `${timestamp}.${nonce}.${payloadHash}`;
    const signature = crypto.createHmac('sha256', sharedToken).update(stringToSign).digest('hex');

    const upstreamPayload = {
      action: 'submit_abcde',
      timestamp: timestamp,
      nonce: nonce,
      payloadHash: payloadHash,
      signature: signature,
      fullName: fullName,
      email: email,
      data: practiceData,
      passcode: passcode,
      chatVersion: chatVersion
    };

    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(upstreamPayload)
      });

      const text = await response.text();
      let parsed = null;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        parsed = null;
      }

      if (!response.ok || (parsed && parsed.success === false)) {
        console.error('Apps Script upstream error:', text);
        return sendJson(res, 502, {
          success: false,
          error: 'UPSTREAM_APPS_SCRIPT_FAILED',
          message: parsed && parsed.message ? parsed.message : 'Không thể lưu bài tập về Google Sheets.'
        });
      }

      return sendJson(res, 200, { success: true, upstream: parsed });
    } catch (err) {
      console.error('Apps Script fetch exception:', err);
      return sendJson(res, 502, { success: false, error: 'UPSTREAM_FETCH_ERROR', message: 'Lỗi kết nối máy chủ lưu trữ.' });
    }
  }

  return sendJson(res, 400, { success: false, error: 'UNKNOWN_ACTION' });
}

module.exports = handler;
