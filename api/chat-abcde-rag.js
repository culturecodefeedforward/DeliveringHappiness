const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec';

const DEFAULT_PASSCODES = ['DHM8', 'DHM9', 'ABCDE'];

// System Socratic Prompt nâng cấp hỗ trợ RAG cho Gemini
const SOCRATIC_RAG_SYSTEM_INSTRUCTION = `
Bạn là Trợ lý Lạc quan Socratic (Socratic Optimism Assistant) từ Deliver Happiness. Nhiệm vụ của bạn là dẫn dắt học viên thực hành mô hình Lạc quan ABCDE theo phương pháp đối thoại Socratic.

QUY TẮC DẪN DẮT QUAN TRỌNG:
Hãy kiểm soát chặt chẽ tiến độ và quyết định trạng thái tiếp theo bằng cách thêm tag [NEXT_STATE: <STATE>] ở cuối câu trả lời của bạn:
- Nếu state = "STEP_A": Giúp học viên mô tả Nghịch cảnh (A) khách quan 100%, không chứa sự suy diễn hay tâm lý nạn nhân. Nếu có, hãy thấu cảm chỉ ra và khuyên họ "để dành" suy nghĩ tiêu cực đó lại cho bước B. Giữ tag [NEXT_STATE: STEP_A].
- Nếu state = "STEP_B": Nhận diện Niềm tin tự động (B). Hãy nhắc lại suy nghĩ học viên đã "để dành" ở bước A để làm chất liệu khơi gợi. Đặt câu hỏi gợi mở để bóc tách niềm tin cốt lõi. Giữ tag [NEXT_STATE: STEP_B].
- Nếu state = "STEP_C": Hỏi về Hệ quả (C) cảm xúc/hành vi. Nhấn mạnh mối liên kết: chính Niềm tin B tạo ra C chứ không phải A. Giữ tag [NEXT_STATE: STEP_D].
- Nếu state = "STEP_D": Bạn đang thực hành Phản biện (Disputation - D).
  + ĐÂY LÀ BƯỚC BẠN ĐƯỢC CUNG CẤP CƠ SỞ TRI THỨC chuẩn từ Martin Seligman và slide bài giảng DH8 (xem ở phần NGỮ CẢNH HỖ TRỢ dưới đây).
  + Hãy sử dụng tri thức trong ngữ cảnh đó để đặt câu hỏi gợi mở phản biện sắc bén cho học viên. Tuyệt đối không tự ý phát biểu sai lệch lý thuyết hoặc bịa đặt phương pháp.
  + Đặt câu hỏi xoay quanh 4 khía cạnh: Bằng chứng (Evidence), Lợi ích (Utility), Giải thích thay thế (Alternatives), Hệ quả (Implications).
  + Giữ tag [NEXT_STATE: STEP_D] cho đến khi nhận tin nhắn tự động chuyển bước.
- Nếu state = "STEP_E": Ghi nhận hành động mới (E) và cảm xúc mới. Động viên và chúc mừng họ đã hoàn thành. Giữ tag [NEXT_STATE: SUBMIT].

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

// Gọi API sinh embedding từ Gemini
async function getGeminiEmbedding(text, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: {
        parts: [{ text: text }]
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Embedding API failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.embedding.values;
}

// RAG: Truy vấn véc-tơ cục bộ
function retrieveLocalKnowledge(userVector, threshold = 0.4) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'artifacts', 'knowledge_base_abcde.json');
    if (!fs.existsSync(filePath)) {
      console.warn('Local knowledge base file not found at:', filePath);
      return [];
    }
    const rawData = fs.readFileSync(filePath, 'utf8');
    const chunks = JSON.parse(rawData);
    
    const results = chunks.map(chunk => {
      const score = cosineSimilarity(userVector, chunk.vector);
      return {
        ...chunk.metadata,
        score: score
      };
    });
    
    // Sắp xếp giảm dần theo điểm tương đồng và lọc theo ngưỡng
    return results
      .filter(r => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2); // Lấy top 2 chunks liên quan nhất
  } catch (err) {
    console.error('Error retrieving local knowledge:', err);
    return [];
  }
}

// RAG: Truy vấn Upstash Vector DB (để sẵn sàng mở rộng tương lai)
async function retrieveUpstashVector(userVector) {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
  if (!url || !token) return null; // Fallback sang local RAG
  
  try {
    const response = await fetch(`${url}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vector: userVector,
        topK: 2,
        includeMetadata: true
      })
    });
    
    if (!response.ok) {
      console.warn('Upstash Vector query failed:', response.statusText);
      return null;
    }
    const data = await response.json();
    return (data.result || []).map(r => ({
      ...r.metadata,
      score: r.score
    }));
  } catch (err) {
    console.error('Upstash Vector API exception:', err);
    return null;
  }
}

// Rate Limiting (In-memory fallback)
const ipCache = new Map();
function checkInMemoryRateLimit(ip) {
  const now = Date.now();
  const limit = 20;
  const windowMs = 60000;
  if (!ipCache.has(ip)) ipCache.set(ip, []);
  const timestamps = ipCache.get(ip).filter(t => now - t < windowMs);
  timestamps.push(now);
  ipCache.set(ip, timestamps);
  return timestamps.length <= limit;
}

// Rate Limiting (Upstash Redis)
async function checkRedisRateLimit(ip) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return checkInMemoryRateLimit(ip);
  const key = `ratelimit:abcde:${ip}`;
  const window = 60;
  try {
    const response = await fetch(`${url}/multi`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([['CL.THROTTLE', key, 20, 20, window]])
    });
    const result = await response.json();
    if (result && result[0] && result[0].result) {
      return result[0].result[0] === 0;
    }
    return checkInMemoryRateLimit(ip);
  } catch (err) {
    console.error('Rate limit Redis error:', err);
    return checkInMemoryRateLimit(ip);
  }
}

module.exports = async function handler(req, res) {
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

  // 0. Kill Switch check
  const isRagEnabled = process.env.ABCDE_RAG_ENABLED !== 'false';
  if (!isRagEnabled) {
    return sendJson(res, 503, { 
      success: false, 
      error: 'RAG_BETA_DISABLED', 
      message: 'Phiên bản thử nghiệm hiện đang tạm tắt. Vui lòng chuyển sang Bản ổn định.' 
    });
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

  // 2. Access control check
  if (!validPasscodes.includes(passcode)) {
    return sendJson(res, 403, { success: false, error: 'INVALID_PASSCODE', message: 'Mật mã không hợp lệ.' });
  }

  // 3. Rate Limit
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

    let contextText = '';
    let retrievedCitations = [];

    // Chỉ thực hiện RAG ở bước D (Phản biện) trong phase 1
    if (state === 'STEP_D' && message) {
      try {
        // Sinh vector embedding cho câu chat hiện tại
        const userVector = await getGeminiEmbedding(message, apiKey);
        
        // Truy vấn tri thức (Ưu tiên Upstash Vector DB, fallback sang Local RAG)
        let chunks = await retrieveUpstashVector(userVector);
        if (!chunks) {
          chunks = retrieveLocalKnowledge(userVector, 0.4);
        }
        
        if (chunks && chunks.length > 0) {
          contextText = chunks.map(c => `[TRI THỨC] ${c.text}`).join('\n\n');
          retrievedCitations = chunks.map(c => c.citation);
          // Ghi nhận log trích dẫn nội bộ ở backend
          console.log(`[RAG Audit] Citations used for step D:`, retrievedCitations);
        }
      } catch (ragErr) {
        console.error('RAG process failed, falling back to non-RAG mode:', ragErr);
      }
    }

    // Map history to Gemini content structure
    const contents = history.map(h => ({
      role: h.role === 'ai' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Bổ sung instruction và ngữ cảnh RAG (nếu có)
    let systemInstructionContent = `${SOCRATIC_RAG_SYSTEM_INSTRUCTION}\nHiện tại đang ở trạng thái: ${state}. Bạn hãy bám sát chỉ thị của trạng thái này.`;
    if (contextText) {
      systemInstructionContent += `\n\nNGỮ CẢNH HỖ TRỢ ĐỂ TRẢ LỜI CHO BƯỚC D:\n${contextText}\n\nHãy khéo léo sử dụng các tri thức và ví dụ trên đây để phản biện lại niềm tin tiêu cực của học viên. Không cần hiển thị nguồn trích dẫn ra màn hình chat.`;
    }

    const requestPayload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstructionContent }]
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

      // Parse [NEXT_STATE: STATE]
      const match = replyText.match(/\[NEXT_STATE:\s*(\w+)\]/);
      let nextState = state;
      let cleanReply = replyText;
      if (match) {
        nextState = match[1];
        cleanReply = replyText.replace(/\[NEXT_STATE:\s*\w+\]/, '').trim();
      }

      return sendJson(res, 200, { 
        success: true, 
        reply: cleanReply, 
        nextState: nextState,
        citations: retrievedCitations // Trả về citation ngầm để audit
      });
    } catch (err) {
      console.error('Fetch Gemini exception:', err);
      return sendJson(res, 502, { success: false, error: 'FETCH_GEMINI_EXCEPTION', message: 'Lỗi kết nối AI.' });
    }
  }

  return sendJson(res, 400, { success: false, error: 'BAD_REQUEST' });
};
