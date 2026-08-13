'use strict';

const crypto = require('crypto');

const ENDPOINT = process.env.PROGRAM_INTEREST_STATUS_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec';
const SAMPLE_COUNT = Math.max(1, Math.min(20, Number(process.env.PROGRAM_INTEREST_LATENCY_SAMPLES || 8)));
const TIMEOUT_MS = Math.max(1000, Math.min(60000, Number(process.env.PROGRAM_INTEREST_LATENCY_TIMEOUT_MS || 45000)));

function createProbeUuid() {
  return crypto.randomBytes(16).toString('hex');
}

function createCallbackName() {
  return `programInterestJsonp_${crypto.randomBytes(12).toString('hex')}`;
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

async function probeOnce(index) {
  const uuid = createProbeUuid();
  const callback = createCallbackName();
  const url = new URL(ENDPOINT);
  url.searchParams.set('action', 'checkProgramInterestStatus');
  url.searchParams.set('interestUuid', uuid);
  url.searchParams.set('callback', callback);
  url.searchParams.set('_', `${Date.now()}-${index}`);

  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal
    });
    const body = await response.text();
    const open = body.indexOf('(');
    const close = body.lastIndexOf(')');
    let payload = null;
    let parseError = '';
    if (open >= 0 && close > open) {
      try {
        payload = JSON.parse(body.slice(open + 1, close));
      } catch (error) {
        parseError = error.message;
      }
    } else {
      parseError = 'JSONP_PAYLOAD_NOT_FOUND';
    }
    return {
      index,
      uuid,
      elapsedMs: Date.now() - startedAt,
      httpStatus: response.status,
      finalUrl: response.url,
      state: payload && payload.state || '',
      interestUuidMatches: Boolean(payload && payload.interestUuid === uuid),
      parseError
    };
  } catch (error) {
    return {
      index,
      uuid,
      elapsedMs: Date.now() - startedAt,
      httpStatus: null,
      finalUrl: url.toString(),
      state: '',
      interestUuidMatches: false,
      error: error.name === 'AbortError' ? 'STATUS_TIMEOUT' : error.message
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  const samples = [];
  for (let index = 1; index <= SAMPLE_COUNT; index += 1) {
    const sample = await probeOnce(index);
    samples.push(sample);
    process.stdout.write(`sample ${index}/${SAMPLE_COUNT}: ${sample.elapsedMs}ms ${sample.state || sample.error || sample.parseError}\n`);
  }

  const timings = samples.map((sample) => sample.elapsedMs);
  const successfulStatus = samples.filter((sample) => sample.httpStatus === 200 && sample.state);
  const report = {
    verdict: samples.every((sample) => sample.state === 'not_found' && sample.interestUuidMatches)
      ? 'READ_ONLY_STATUS_PROBE_VERIFIED'
      : 'READ_ONLY_STATUS_PROBE_PARTIAL',
    claimSurface: 'status endpoint read-only; does not prove POST/write latency',
    endpoint: ENDPOINT,
    startedAt,
    completedAt: new Date().toISOString(),
    sampleCount: SAMPLE_COUNT,
    timeoutMs: TIMEOUT_MS,
    externalWrites: 'NONE',
    postRequests: 0,
    successfulStatusSamples: successfulStatus.length,
    metricsMs: {
      min: timings.length ? Math.min(...timings) : null,
      p50: percentile(timings, 0.5),
      p95: percentile(timings, 0.95),
      max: timings.length ? Math.max(...timings) : null
    },
    samples
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exitCode = 1;
});
