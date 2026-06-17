// register.js - Logic đăng ký nghiệp vụ DHM8
// Bao gồm: UUID generation, POST no-cors, JSONP polling, retry/backoff, UI state.
// SCOPE: Nghiệp vụ đăng ký. Analytics (fire-and-forget) nằm trong tracking.js.

// ============================================================
// CONFIG
// ============================================================
const DHM8_WEBAPP_URL = window.CUSTOM_WEBAPP_URL || "https://script.google.com/macros/s/AKfycbxfbK1IWH_fL-3BzcoYDsdl61L0EpKuuF_MwPgdzDMutHHqECGRRJaDfsBdHqty-Vjtpg/exec";
const JSONP_MAX_ATTEMPTS = Number(window.DHM8_JSONP_MAX_ATTEMPTS) || 5;
const JSONP_POLL_DELAY_MS = Number(window.DHM8_JSONP_POLL_DELAY_MS) || 3000;   // 3 giây giữa các lần thử
const JSONP_TIMEOUT_MS = Number(window.DHM8_JSONP_TIMEOUT_MS) || 5000;      // 5 giây timeout mỗi request JSONP
const PAYMENT_STATUS_MAX_ATTEMPTS = Number(window.DHM8_PAYMENT_STATUS_MAX_ATTEMPTS) || 120;
const PAYMENT_STATUS_POLL_DELAY_MS = Number(window.DHM8_PAYMENT_STATUS_POLL_DELAY_MS) || 5000;
const CALLBACK_PREFIX = 'dhm8Jsonp_';
const CALLBACK_REGEX = /^dhm8Jsonp_[A-Za-z0-9]{16,40}$/;
const DHM8_ZALO_GROUP_URL = window.DHM8_ZALO_GROUP_URL || 'https://zalo.me/g/hpf7qu45j6qkft6hpghx';

// ============================================================
// UUID GENERATION (Condition 1: crypto-safe, no Math.random)
// ============================================================
function generateRegistrationUuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback: crypto.getRandomValues (không dùng Math.random)
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const arr = new Uint8Array(16);
        crypto.getRandomValues(arr);
        arr[6] = (arr[6] & 0x0f) | 0x40; // version 4
        arr[8] = (arr[8] & 0x3f) | 0x80; // variant
        const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
    }
    throw new Error('[DHM8] crypto API không khả dụng - không thể tạo UUID an toàn.');
}

// ============================================================
// UUID SESSION MANAGEMENT
// ============================================================
function getOrCreateRegistrationUuid() {
    let uuid = sessionStorage.getItem('dhm8_registrationUuid');
    if (!uuid) {
        uuid = generateRegistrationUuid();
        sessionStorage.setItem('dhm8_registrationUuid', uuid);
    }
    return uuid;
}

function clearRegistrationUuid() {
    sessionStorage.removeItem('dhm8_registrationUuid');
}

function normalizePhone(phone) {
    if (!phone) return '';
    var digits = String(phone).replace(/\D/g, '');
    if (digits.indexOf('0084') === 0 && digits.length > 6) return '0' + digits.slice(4);
    if (digits.indexOf('84') === 0 && digits.length > 6) return '0' + digits.slice(2);
    return digits;
}

function buildPaymentCodeFromPhone(phone) {
    var normalizedPhone = normalizePhone(phone);
    var codeDigits = normalizedPhone.replace(/^0/, '');
    if (!/^\d{3,}$/.test(codeDigits)) return '';
    return 'DH8' + codeDigits.slice(-9);
}

function isValidSePayPaymentCode(code) {
    return /^DH8\d{3,9}$/.test(String(code || '').toUpperCase());
}

function rememberPaymentReference(data) {
    var paymentPhone = normalizePhone(data.phone || '');
    var paymentCode = buildPaymentCodeFromPhone(paymentPhone);
    sessionStorage.setItem('dhm8_paymentPhone', paymentPhone);
    sessionStorage.setItem('dhm8_paymentName', data.fullName || '');
    if (paymentCode) sessionStorage.setItem('dhm8_paymentCode', paymentCode);
    else sessionStorage.removeItem('dhm8_paymentCode');
    return paymentCode;
}

// Khởi tạo UUID ổn định khi load trang (bền qua reload/retry)
const registrationUuid = getOrCreateRegistrationUuid();

// ============================================================
// CALLBACK NAME GENERATION (Condition 3: prefix cố định + độ dài giới hạn)
// ============================================================
function generateCallbackName() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const arr = new Uint8Array(20);
    crypto.getRandomValues(arr);
    const random = Array.from(arr).map(b => chars[b % chars.length]).join('');
    const name = CALLBACK_PREFIX + random; // dhm8Jsonp_ + 20 ký tự = 29 ký tự tổng
    if (!CALLBACK_REGEX.test(name)) {
        throw new Error('[DHM8] Callback name không hợp lệ: ' + name);
    }
    return name;
}

// ============================================================
// JSONP POLLING (Condition 2: chỉ trả success/state/registrationUuid/error)
// ============================================================
function pollRegistrationStatus(uuid, attempt) {
    if (window.DHM8_STATUS_CHECK_MODE === 'fetch') {
        return fetchRegistrationStatus(uuid, attempt);
    }

    return new Promise((resolve, reject) => {
        let callbackName;
        try {
            callbackName = generateCallbackName();
        } catch (e) {
            return reject(e);
        }

        let settled = false;
        let timeoutId;
        let scriptEl;

        // Định nghĩa hàm callback tạm thời trên window
        window[callbackName] = function (data) {
            if (settled) return;
            settled = true;
            cleanup();
            // Chỉ đọc các trường an toàn, không log data toàn bộ để tránh PII leakage
            resolve({
                success: !!data.success,
                state: data.state || null,
                registrationUuid: data.registrationUuid || null,
                paymentStatus: data.paymentStatus || null,
                error: data.error || null
            });
        };

        function cleanup() {
            clearTimeout(timeoutId);
            if (scriptEl && scriptEl.parentNode) {
                scriptEl.parentNode.removeChild(scriptEl);
            }
            // Xóa callback khỏi window để tránh rò rỉ bộ nhớ và DOM pollution
            try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
        }

        timeoutId = setTimeout(() => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('JSONP_TIMEOUT'));
        }, JSONP_TIMEOUT_MS);

        const url = DHM8_WEBAPP_URL
            + '?action=checkStatus'
            + '&uuid=' + encodeURIComponent(uuid)
            + '&callback=' + encodeURIComponent(callbackName);

        scriptEl = document.createElement('script');
        scriptEl.src = url;
        scriptEl.onerror = function () {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('JSONP_LOAD_ERROR'));
        };
        document.head.appendChild(scriptEl);
    });
}

async function fetchRegistrationStatus(uuid, attempt) {
    const callbackName = CALLBACK_PREFIX + 'FetchStatus' + String(attempt).padStart(2, '0') + 'ABCDEFGH';
    const url = DHM8_WEBAPP_URL
        + '?action=checkStatus'
        + '&uuid=' + encodeURIComponent(uuid)
        + '&callback=' + encodeURIComponent(callbackName)
        + '&_=' + Date.now();

    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    const text = await response.text();
    const prefix = callbackName + '(';
    if (!response.ok) {
        throw new Error('STATUS_HTTP_' + response.status);
    }
    if (text.indexOf(prefix) !== 0 || text.slice(-2) !== ');') {
        throw new Error('STATUS_BAD_JSONP');
    }

    const data = JSON.parse(text.slice(prefix.length, -2));
    return {
        success: !!data.success,
        state: data.state || null,
        registrationUuid: data.registrationUuid || null,
        paymentStatus: data.paymentStatus || null,
        error: data.error || null
    };
}

// ============================================================
// UI STATE HELPERS
// ============================================================
function setSubmitState(btn, spinnerEl, textEl, text, disabled) {
    if (!btn) return;
    btn.disabled = disabled;
    if (spinnerEl) spinnerEl.style.display = disabled ? 'inline-block' : 'none';
    if (textEl) textEl.innerText = text;
}

function ensurePaidModal() {
    let modal = document.getElementById('paymentCompleteModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'paymentCompleteModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'paymentCompleteTitle');
    modal.style.cssText = 'display:none; position:fixed; inset:0; z-index:9999; background:rgba(10,15,28,0.72); align-items:center; justify-content:center; padding:20px;';
    modal.innerHTML = `
        <div style="width:min(520px, 100%); background:#ffffff; color:#111827; border-radius:16px; padding:28px; box-shadow:0 24px 70px rgba(0,0,0,0.28); text-align:center;">
            <div style="font-size:3rem; line-height:1; margin-bottom:14px;">✅</div>
            <h2 id="paymentCompleteTitle" style="margin:0 0 12px; color:#047857; font-size:1.45rem;">Đã hoàn tất chi phí hậu cần</h2>
            <p style="margin:0 0 18px; color:#374151; line-height:1.55;">Chúc mừng bạn! Hệ thống đã ghi nhận thanh toán thành công. Bạn có thể tham gia nhóm Zalo DH8 HCM để nhận thông báo, lịch trình và kết nối với BTC.</p>
            <a id="paymentCompleteZaloLink" href="${DHM8_ZALO_GROUP_URL}" target="_blank" rel="noopener" style="display:block; background:#0068ff; color:#ffffff; text-decoration:none; font-weight:700; border-radius:10px; padding:13px 18px; margin-bottom:10px;">Vào nhóm Zalo DH8 HCM</a>
            <button id="paymentCompleteClose" type="button" style="width:100%; border:1px solid #d1d5db; background:#ffffff; color:#374151; font-weight:700; border-radius:10px; padding:12px 18px; cursor:pointer;">Đóng</button>
        </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.id === 'paymentCompleteClose') {
            modal.style.display = 'none';
        }
    });
    return modal;
}

function showPaymentCompleteModal(uuid) {
    const modalKey = 'dhm8_paid_modal_shown_' + String(uuid || registrationUuid || '');
    if (sessionStorage.getItem(modalKey) === 'true') return;
    sessionStorage.setItem(modalKey, 'true');
    const modal = ensurePaidModal();
    modal.style.display = 'flex';
}

function renderPaymentStatus(paymentStatus) {
    const statusEl = document.getElementById('successPaymentStatus');
    if (!statusEl) return;

    const status = String(paymentStatus || 'PENDING').toUpperCase();
    if (status === 'PAID') {
        statusEl.textContent = 'Đã thanh toán';
        statusEl.style.color = '#86efac';
        const zaloEl = document.getElementById('successZaloGroupLink');
        if (zaloEl) zaloEl.style.display = 'inline-block';
        return;
    }
    statusEl.textContent = 'Chờ thanh toán';
    statusEl.style.color = 'var(--warm-yellow)';
}

function renderPaymentReference(uuid) {
    const paymentPhone = sessionStorage.getItem('dhm8_paymentPhone') || '';
    const storedPaymentCode = sessionStorage.getItem('dhm8_paymentCode') || '';
    const paymentCode = isValidSePayPaymentCode(storedPaymentCode)
        ? storedPaymentCode
        : buildPaymentCodeFromPhone(paymentPhone);
    if (!paymentCode) sessionStorage.removeItem('dhm8_paymentCode');
    const transferContent = paymentCode || 'Số điện thoại không hợp lệ';
    const paymentAmount = String(window.DHM8_PAYMENT_AMOUNT || 300000);
    const paymentAccount = window.DHM8_PAYMENT_ACCOUNT || '';
    const paymentAccountLabel = window.DHM8_PAYMENT_ACCOUNT_LABEL || paymentAccount;
    const paymentBank = window.DHM8_PAYMENT_BANK || '';
    const qrTemplate = window.DHM8_QR_TEMPLATE || 'compact';
    const qrShowInfo = window.DHM8_QR_SHOW_INFO === false ? 'false' : 'true';
    const qrHolder = window.DHM8_PAYMENT_HOLDER || '';
    const qrUrl = paymentAccount && paymentBank && paymentCode
        ? 'https://qr.sepay.vn/img?' + new URLSearchParams({
            acc: paymentAccount,
            bank: paymentBank,
            amount: paymentAmount,
            des: transferContent,
            template: qrTemplate,
            showinfo: qrShowInfo,
            holder: qrHolder
        }).toString()
        : '';

    const uuidEl = document.getElementById('successRegistrationUuid');
    const paymentCodeEl = document.getElementById('successPaymentCode');
    const contentEl = document.getElementById('successTransferContent');
    const qrEl = document.getElementById('successPaymentQr');
    const qrWrapperEl = document.getElementById('successPaymentQrWrapper');
    const accountEl = document.getElementById('successPaymentAccount');
    const amountEl = document.getElementById('successPaymentAmount');

    if (uuidEl) uuidEl.textContent = uuid || '';
    if (paymentCodeEl) paymentCodeEl.textContent = paymentCode || 'Đang tạo mã';
    if (contentEl) contentEl.textContent = transferContent || 'DH89xxxxxxxx';
    if (accountEl) accountEl.textContent = paymentAccountLabel || 'Chưa cấu hình tài khoản thanh toán';
    if (amountEl) amountEl.textContent = Number(paymentAmount).toLocaleString('vi-VN') + 'đ';
    if (qrEl && qrWrapperEl) {
        if (qrUrl) {
            qrEl.src = qrUrl;
            qrEl.alt = 'QR thanh toán DHM8';
            qrWrapperEl.style.display = 'block';
        } else {
            qrEl.removeAttribute('src');
            qrWrapperEl.style.display = 'none';
        }
    }
}

function showInlineError(message) {
    const errorDiv = document.getElementById('registrationError');
    if (!errorDiv) return;
    errorDiv.style.display = 'block';
    errorDiv.textContent = message;
}

async function startPaymentStatusPolling(uuid, initialStatus) {
    renderPaymentStatus(initialStatus);
    if (String(initialStatus || '').toUpperCase() === 'PAID') {
        showPaymentCompleteModal(uuid);
        return;
    }

    for (let attempt = 0; attempt < PAYMENT_STATUS_MAX_ATTEMPTS; attempt++) {
        await new Promise(r => setTimeout(r, PAYMENT_STATUS_POLL_DELAY_MS));
        try {
            const result = await pollRegistrationStatus(uuid, attempt);
            if (result.success) {
                renderPaymentStatus(result.paymentStatus || result.state);
                if (String(result.paymentStatus || '').toUpperCase() === 'PAID') {
                    showPaymentCompleteModal(uuid);
                    return;
                }
            }
        } catch (err) {
            console.warn('[DHM8] Không kiểm tra được trạng thái thanh toán:', err.message);
        }
    }
}

function showSuccess(uuid, paymentStatus) {
    const form = document.getElementById('crmForm');
    const header = document.querySelector('.header');
    const success = document.getElementById('successMessage');
    renderPaymentReference(uuid);
    renderPaymentStatus(paymentStatus);
    if (String(paymentStatus || '').toUpperCase() === 'PAID') showPaymentCompleteModal(uuid);
    if (form) form.style.display = 'none';
    if (header) header.style.display = 'none';
    if (success) success.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clearRegistrationUuid();
    startPaymentStatusPolling(uuid, paymentStatus);
}

function showRetryMessage(uuid) {
    const errorDiv = document.getElementById('registrationError');
    if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `
            <p>Đăng ký của bạn đang được xử lý. Nếu chưa nhận được email xác nhận sau 5 phút,
            vui lòng lưu lại <strong>Mã Đăng ký: ${uuid}</strong> và liên hệ ban tổ chức.</p>
            <button id="retryPollBtn" type="button" class="btn-retry">Kiểm tra lại</button>`;
        const retryBtn = document.getElementById('retryPollBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                errorDiv.style.display = 'none';
                startPolling(uuid, 0);
            });
        }
    }
}

// ============================================================
// POLLING ORCHESTRATOR
// ============================================================
async function startPolling(uuid, startAttempt) {
    const btn = document.getElementById('submitBtn');
    const spinner = btn ? btn.querySelector('.loading-spinner') : null;
    const textEl = btn ? btn.querySelector('.btn-text') : null;

    for (let attempt = startAttempt; attempt < JSONP_MAX_ATTEMPTS; attempt++) {
        setSubmitState(btn, spinner, textEl,
            `Đang xác nhận đăng ký... (Lần ${attempt + 1}/${JSONP_MAX_ATTEMPTS})`, true);

        try {
            const result = await pollRegistrationStatus(uuid, attempt);

            // Condition 4: chỉ thành công khi state là REGISTERED (UUID tồn tại thực sự)
            // PENDING = trạng thái thanh toán của registration đã tồn tại
            if (result.success && (result.state === 'REGISTERED' || result.state === 'PENDING' || result.state === 'PAID')) {
                showSuccess(uuid, result.paymentStatus || result.state);
                return;
            }

            // NOT_FOUND: Sheets có thể đang trễ, thử tiếp
            if (result.error === 'NOT_FOUND') {
                console.info(`[DHM8] Lần ${attempt + 1}: NOT_FOUND - có thể Sheets đang trễ, thử tiếp.`);
            } else {
                console.warn('[DHM8] Phản hồi không nhận ra:', result.state, result.error);
            }
        } catch (err) {
            console.error(`[DHM8] Lần ${attempt + 1} lỗi:`, err.message);
        }

        // Chờ trước lần thử tiếp theo (trừ lần cuối)
        if (attempt < JSONP_MAX_ATTEMPTS - 1) {
            await new Promise(r => setTimeout(r, JSONP_POLL_DELAY_MS));
        }
    }

    // Thất bại sau toàn bộ lần thử - KHÔNG xóa UUID
    setSubmitState(btn, spinner, textEl, 'Gửi đăng ký & Hoàn tất', false);
    showRetryMessage(uuid);
}

// ============================================================
// FORM SUBMIT HANDLER
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crmForm');
    if (!form) return;

    // Ghi UUID vào hidden field nếu có
    const uuidInput = document.getElementById('registrationUuid');
    if (uuidInput) uuidInput.value = registrationUuid;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const spinner = btn ? btn.querySelector('.loading-spinner') : null;
        const textEl = btn ? btn.querySelector('.btn-text') : null;

        setSubmitState(btn, spinner, textEl, 'Đang gửi đăng ký...', true);

        // --- Thu thập dữ liệu form ---
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Checkboxes purpose
        const purposeChoices = formData.getAll('purpose');
        let purposeList = [...purposeChoices];
        const idxPurp = purposeList.indexOf('Khác');
        if (idxPurp !== -1) purposeList[idxPurp] = `Khác: ${data.purposeOther || ''}`;
        data.purpose = purposeList.filter(p => p !== 'Khác').join(', ');
        delete data.purposeOther;

        // Checkboxes attendedPrograms
        const progChoices = formData.getAll('attendedPrograms');
        let progList = [...progChoices];
        const idxProg = progList.indexOf('Khác');
        if (idxProg !== -1) progList[idxProg] = `Khác: ${data.attendedProgramsOther || ''}`;
        data.attendedPrograms = progList.length > 0 ? progList.filter(p => p !== 'Khác').join(', ') : 'Chưa tham gia';
        delete data.attendedProgramsOther;

        // Radio sourceHearing
        if (data.sourceHearing === 'Khác') {
            data.sourceHearing = `Khác: ${data.sourceHearingOther || ''}`;
        }
        delete data.sourceHearingOther;

        // Gắn UUID và metadata
        data.registrationUuid = registrationUuid;
        data.type = 'EVENT_LEAD_DHM8';
        data.source = 'Web_DHM8_Official';
        data.event = 'REGISTER_SUBMIT';
        const paymentCode = rememberPaymentReference(data);
        if (!paymentCode) {
            setSubmitState(btn, spinner, textEl, 'Gửi đăng ký & Hoàn tất', false);
            showInlineError('Không đọc được đủ chữ số từ số điện thoại để tạo mã thanh toán SePay. Vui lòng kiểm tra lại số điện thoại đã nhập.');
            return;
        }

        // --- POST no-cors (gửi dữ liệu - không đọc response) ---
        try {
            await fetch(DHM8_WEBAPP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (err) {
            // Lỗi mạng: vẫn tiến hành polling để kiểm tra nếu request đã tới server
            console.warn('[DHM8] POST gặp lỗi mạng, tiến hành polling kiểm tra:', err.message);
        }

        // --- Analytics (fire-and-forget, không block đăng ký) ---
        if (window.logAnalytics) {
            window.logAnalytics('REGISTER_SUBMIT', data.fullName, { registrationUuid }).catch(() => {});
        }

        // --- JSONP Polling để xác nhận nghiệp vụ ---
        await startPolling(registrationUuid, 0);
    });
});
