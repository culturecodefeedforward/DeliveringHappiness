const crypto = require('crypto');

const DEFAULT_PASSCODES = ['DHM8', 'DHM9', 'DHM10', 'ABCDE'];
const SYSTEM_BUTTON_PROMPTS = [
  'Tôi muốn phản biện sâu thêm.',
  'Tôi muốn phản biện thêm.',
  'Tôi đã sẵn sàng chuyển sang bước E.',
  'Đã hiệu quả, đi tiếp'
];

// Đóng gói tĩnh danh sách tri thức 22 đoạn vào serverless bundle (Thử nghiệm Phương án 1 so sánh với includeFiles)
let STATIC_KNOWLEDGE_BASE = null;
try {
  STATIC_KNOWLEDGE_BASE = require('../data/artifacts/knowledge_base_abcde.json');
} catch (err) {
  STATIC_KNOWLEDGE_BASE = null;
}

// System Socratic Prompt nâng cấp hỗ trợ RAG cho Gemini
const SOCRATIC_RAG_SYSTEM_INSTRUCTION = `
Bạn là Trợ lý Lạc quan Socratic (Socratic Optimism Assistant) từ Deliver Happiness. Nhiệm vụ của bạn là dẫn dắt học viên thực hành mô hình Lạc quan ABCDE theo phương pháp đối thoại Socratic.

QUY TẮC DẪN DẮT QUAN TRỌNG:
Hãy kiểm soát chặt chẽ tiến độ và quyết định trạng thái tiếp theo bằng cách thêm tag [NEXT_STATE: <STATE>] ở cuối câu trả lời của bạn:
- Nếu state = "STEP_A": Giúp học viên mô tả Nghịch cảnh (A) khách quan 100%, không chứa sự suy diễn hay tâm lý nạn nhân. Nếu có, hãy thấu cảm chỉ ra và khuyên họ "để dành" suy nghĩ tiêu cực đó lại cho bước B. Giữ tag [NEXT_STATE: STEP_A].
- Nếu state = "STEP_B": Nhận diện Niềm tin tự động (B). Hãy nhắc lại suy nghĩ học viên đã "để dành" ở bước A để làm chất liệu khơi gợi. Đặt câu hỏi gợi mở để bóc tách niềm tin cốt lõi; nếu chưa rõ thì giữ tag [NEXT_STATE: STEP_B], khi đã xác định xong niềm tin B thì dùng tag [NEXT_STATE: STEP_C].
- Nếu state = "STEP_C": Hỏi về Hệ quả (C) cảm xúc/hành vi. Nhấn mạnh mối liên kết: chính Niềm tin B tạo ra C chứ không phải A. Nếu học viên chưa nêu rõ cảm xúc/hành vi thì giữ tag [NEXT_STATE: STEP_C]; khi họ đã trả lời xong thì dùng tag [NEXT_STATE: STEP_D].
- Nếu state = "STEP_D": Bạn đang thực hành Phản biện (Disputation - D).
  + ĐÂY LÀ BƯỚC BẠN ĐƯỢC CUNG CẤP CƠ SỞ TRI THỨC chuẩn từ Martin Seligman và slide bài giảng DH8 (xem ở phần NGỮ CẢNH HỖ TRỢ dưới đây).
  + Hãy sử dụng tri thức trong ngữ cảnh đó để đặt câu hỏi gợi mở phản biện sắc bén cho học viên. Tuyệt đối không tự ý phát biểu sai lệch lý thuyết hoặc bịa đặt phương pháp.
  + Đặt câu hỏi xoay quanh 4 khía cạnh: Bằng chứng (Evidence), Lợi ích (Utility), Giải thích thay thế (Alternatives), Hệ quả (Implications).
  + Giữ tag [NEXT_STATE: STEP_D] khi nhận tin nhắn thường hoặc "Tôi muốn phản biện sâu thêm."; chỉ dùng tag [NEXT_STATE: STEP_E] khi nhận tin nhắn tự động "Tôi đã sẵn sàng chuyển sang bước E.".
- Nếu state = "STEP_E": Đây là bước Energization — ghi nhận và phản chiếu lại trạng thái năng lượng/cảm xúc tích cực mới mà học viên đang cảm nhận sau khi phản biện thành công ở bước D. Hỏi một câu về cảm xúc/năng lượng trước (ví dụ: "Bạn cảm thấy thế nào sau khi đã bẻ gãy được suy nghĩ tiêu cực đó?"). Sau đó hỏi tiếp: "Từ năng lượng và góc nhìn mới này, bạn nghĩ mình có thể tiếp cận lại nghịch cảnh A theo những hướng nào?" — nhớ rằng câu trả lời có thể là hành động cụ thể hoặc chỉ là sự thay đổi nhận thức, chấp nhận, hoặc tiến về phía trước. Cả hai đều là cách "tiếp cận lại A" hợp lệ theo đúng tinh thần Seligman. AI không phán xét loại câu trả lời. Khi học viên đã trả lời, tán thưởng và dùng tag [NEXT_STATE: SUBMIT].

Quy tắc giao tiếp:
- Luôn ưu tiên tiếng Việt, xưng hô lịch sự (bạn - tôi hoặc anh/chị - tôi).
- Giữ câu trả lời ngắn gọn, tập trung (tối đa 2-3 câu). Mỗi lượt đặt đúng 1 câu hỏi gợi mở cho bước hiện tại.
- Tag [NEXT_STATE: <STATE>] bắt buộc phải viết chính xác ở cuối tin nhắn.
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

// Tính Cosine Similarity giữa 2 vector
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// P1 (ABCDE-MED-02): Tạo câu truy vấn giàu ngữ cảnh cho Bước D từ lịch sử A, B và câu hiện tại
function buildStepDRagQuery(message, history) {
  const cleanCurrent = String(message || '').trim();
  const list = Array.isArray(history) ? history : [];
  const userMsgs = list
    .filter((h) => h && h.role === 'user' && h.content && !SYSTEM_BUTTON_PROMPTS.includes(String(h.content).trim()))
    .map((h) => String(h.content).trim());

  const contextSnippets = [];
  if (userMsgs.length > 0) contextSnippets.push(userMsgs[0]); // Nghịch cảnh A ban đầu
  if (userMsgs.length > 1) contextSnippets.push(userMsgs[Math.min(1, userMsgs.length - 1)]); // Niềm tin B hoặc phản ánh kế tiếp
  if (cleanCurrent && !SYSTEM_BUTTON_PROMPTS.includes(cleanCurrent) && !contextSnippets.includes(cleanCurrent)) {
    contextSnippets.push(cleanCurrent);
  } else if (SYSTEM_BUTTON_PROMPTS.includes(cleanCurrent) && userMsgs.length > 2) {
    const recent = userMsgs[userMsgs.length - 1];
    if (!contextSnippets.includes(recent)) contextSnippets.push(recent);
  }

  return contextSnippets.join(' | ').slice(0, 1200) || cleanCurrent;
}

// Gọi API sinh embedding từ Gemini với AbortController giới hạn thời gian
async function getGeminiEmbedding(text, apiKey, timeoutMs, fetchImpl) {
  const doFetch = fetchImpl || globalThis.fetch;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Math.max(500, timeoutMs || 2000));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;

  try {
    const response = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: {
          parts: [{ text: String(text || '') }]
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Embedding API failed: ${response.status} ${response.statusText || ''}`.trim());
    }
    const data = await response.json();
    return data.embedding.values;
  } finally {
    clearTimeout(timeoutId);
  }
}

// RAG: Truy vấn véc-tơ cục bộ từ 22 đoạn tri thức nạp tĩnh
function retrieveLocalKnowledge(userVector, threshold = 0.4) {
  try {
    const chunks = Array.isArray(STATIC_KNOWLEDGE_BASE) ? STATIC_KNOWLEDGE_BASE : [];
    if (chunks.length === 0) {
      console.warn('Local knowledge base is empty or failed to load.');
      return [];
    }

    const results = chunks.map((chunk) => {
      const score = cosineSimilarity(userVector, chunk.vector);
      return {
        ...chunk.metadata,
        score
      };
    });

    return results
      .filter((r) => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  } catch (err) {
    console.error('Error retrieving local knowledge:', err);
    return [];
  }
}

// RAG: Truy vấn Upstash Vector DB (chỉ dùng bổ sung nếu env runtime được cấu hình đầy đủ)
async function retrieveUpstashVector(userVector, timeoutMs, fetchImpl) {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
  if (!url || !token) return null;

  const doFetch = fetchImpl || globalThis.fetch;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), Math.max(400, timeoutMs || 1500));

  try {
    const response = await doFetch(`${url.replace(/\/+$/, '')}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vector: userVector,
        topK: 2,
        includeMetadata: true
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      console.warn('Upstash Vector query failed:', response.status);
      return null;
    }
    const data = await response.json();
    return (data.result || []).map((r) => ({
      ...r.metadata,
      score: r.score
    }));
  } catch (err) {
    console.error('Upstash Vector API exception:', err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Rate Limiting (In-memory fallback)
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
    console.warn(`[ABCDE-RAG RateLimit] Fallback sang bộ nhớ tiến trình cục bộ (${reason}).`);
  }
}

// Rate Limiting (Upstash Redis INCR + TTL/EXPIRE chuẩn REST)
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

  // Rate-Limit-First: chặn spam IP ngay trước kill-switch và passcode
  const ip = getClientIp(req);
  const limitPassed = await checkRedisWindowLimit('ip', ip, 20, 60);
  if (!limitPassed) {
    return sendJson(res, 429, {
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: 'Bạn đã thao tác quá nhanh. Vui lòng đợi 1 phút.'
    });
  }

  // Kill Switch check
  const isRagEnabled = process.env.ABCDE_RAG_ENABLED !== 'false';
  if (!isRagEnabled) {
    return sendJson(res, 503, {
      success: false,
      error: 'RAG_BETA_DISABLED',
      message: 'Phiên bản thử nghiệm hiện đang tạm tắt. Vui lòng chuyển sang Bản ổn định.'
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

  // 2. Access control check
  if (!validPasscodes.includes(passcode)) {
    return sendJson(res, 403, { success: false, error: 'INVALID_PASSCODE', message: 'Mật mã không hợp lệ.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY env variable.');
    return sendJson(res, 500, { success: false, error: 'MISSING_API_KEY', message: 'Cấu hình hệ thống bị thiếu.' });
  }

  const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  // Action: Chat với Global Request Deadline (2B)
  if (action === 'chat') {
    const requestDeadline = Date.now() + 8800; // Ngân sách tổng giữ dưới trần serverless
    const state = String(body.state || 'INIT').trim();
    const message = String(body.message || '');
    const history = Array.isArray(body.history) ? body.history : [];

    let contextText = '';
    let retrievedCitations = [];
    let ragDegraded = false;

    // Thực hiện RAG ở bước D (với ngưỡng ngắt 2500ms để nhường quỹ thời gian cho LLM)
    if (state === 'STEP_D' && message) {
      const ragQuery = buildStepDRagQuery(message, history);
      const ragDeadline = Math.min(requestDeadline - 1800, Date.now() + 2500);
      try {
        const embedBudgetMs = Math.max(500, ragDeadline - Date.now() - 300);
        const userVector = await getGeminiEmbedding(ragQuery, apiKey, embedBudgetMs);

        let chunks = null;
        const upstashBudgetMs = ragDeadline - Date.now();
        if (upstashBudgetMs > 400 && process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN) {
          chunks = await retrieveUpstashVector(userVector, upstashBudgetMs);
        }
        if (!chunks) {
          const minScore = parseFloat(process.env.RAG_MIN_SCORE || '0.4') || 0.4;
          chunks = retrieveLocalKnowledge(userVector, minScore);
        }

        if (chunks && chunks.length > 0) {
          contextText = chunks.map((c) => `[TRI THỨC] ${c.text}`).join('\n\n');
          retrievedCitations = chunks.map((c) => c.citation);
          console.log('[RAG Audit] Citations used for step D:', retrievedCitations);
        }
      } catch (ragErr) {
        ragDegraded = true;
        console.warn('RAG enrichment degraded within budget, continuing LLM turn:', ragErr && ragErr.message ? ragErr.message : ragErr);
      }
    }

    const contents = history.map((h) => ({
      role: h.role === 'ai' ? 'model' : 'user',
      parts: [{ text: String(h.content || '') }]
    }));

    let systemInstructionContent = `${SOCRATIC_RAG_SYSTEM_INSTRUCTION}\nHiện tại đang ở trạng thái: ${state}. Bạn hãy bám sát chỉ thị của trạng thái này.`;
    if (contextText) {
      systemInstructionContent += `\n\nNGỮ CẢNH HỖ TRỢ ĐỂ TRẢ LỜI CHO BƯỚC D:\n${contextText}\n\nHãy khéo léo sử dụng các tri thức và ví dụ trên đây để phản biện lại niềm tin tiêu cực của học viên. Không cần hiển thị nguồn trích dẫn ra màn hình chat.`;
    }

    const requestPayload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstructionContent }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
    const llmTimeoutMs = Math.max(1500, Math.min(8500, requestDeadline - Date.now()));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), llmTimeoutMs);

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
      const trimmedMsg = String(message || (lastHist && lastHist.role === 'user' ? lastHist.content : '') || '').trim();
      if (state === 'STEP_D') {
        if (trimmedMsg === 'Tôi đã sẵn sàng chuyển sang bước E.' || trimmedMsg === 'Đã hiệu quả, đi tiếp') {
          nextState = 'STEP_E';
        } else if (trimmedMsg === 'Tôi muốn phản biện sâu thêm.' || trimmedMsg === 'Tôi muốn phản biện thêm.') {
          nextState = 'STEP_D';
        }
      }

      return sendJson(res, 200, {
        success: true,
        reply: cleanReply,
        nextState,
        citations: retrievedCitations,
        ragDegraded
      });
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

  return sendJson(res, 400, { success: false, error: 'BAD_REQUEST' });
}

handler._internal = {
  DEFAULT_PASSCODES,
  STATIC_KNOWLEDGE_BASE,
  buildStepDRagQuery,
  cosineSimilarity,
  getGeminiEmbedding,
  retrieveLocalKnowledge,
  retrieveUpstashVector,
  checkInMemoryWindowLimit,
  checkRedisWindowLimit,
  memoryBuckets
};

module.exports = handler;
