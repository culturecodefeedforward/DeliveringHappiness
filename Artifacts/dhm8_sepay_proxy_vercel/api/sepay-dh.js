const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec';

function getRequestToken(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  if (auth.indexOf('Bearer ') === 0) return auth.slice(7).trim();
  return (
    req.query.token ||
    req.query.Authorization ||
    req.query.authorization ||
    req.headers['x-webhook-token'] ||
    ''
  ).toString().trim();
}

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

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { success: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const appsScriptUrl = process.env.DHM8_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
  const webhookToken = process.env.DHM8_SEPAY_WEBHOOK_TOKEN || process.env.SEPAY_WEBHOOK_TOKEN || '';
  const proxyToken = process.env.DHM8_SEPAY_PROXY_TOKEN || webhookToken;

  if (!webhookToken) {
    return sendJson(res, 500, { success: false, error: 'MISSING_WEBHOOK_TOKEN' });
  }

  if (proxyToken && getRequestToken(req) !== proxyToken) {
    return sendJson(res, 403, { success: false, error: 'INVALID_PROXY_TOKEN' });
  }

  if (req.query.dryRun === 'true') {
    return sendJson(res, 200, { success: true, dryRun: true, forwarded: false });
  }

  const body = normalizeBody(req.body);
  const upstreamBody = {
    ...body,
    source: 'sepay',
    token: webhookToken,
  };
  const target = new URL(appsScriptUrl);
  target.searchParams.set('source', 'sepay');
  target.searchParams.set('token', webhookToken);

  try {
    const upstream = await fetch(target.toString(), {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upstreamBody),
    });
    const text = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      parsed = null;
    }

    if (!upstream.ok || (parsed && parsed.success === false)) {
      return sendJson(res, 502, {
        success: false,
        error: 'UPSTREAM_APPS_SCRIPT_FAILED',
        upstreamStatus: upstream.status,
        upstreamError: parsed && parsed.error ? parsed.error : undefined,
      });
    }

    return sendJson(res, 200, {
      success: true,
      forwarded: true,
      upstreamStatus: upstream.status,
      upstream: parsed || undefined,
    });
  } catch (err) {
    return sendJson(res, 502, {
      success: false,
      error: 'UPSTREAM_FETCH_ERROR',
      message: err.message,
    });
  }
}

module.exports = handler;
module.exports._private = {
  getRequestToken,
  normalizeBody,
};
