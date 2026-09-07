/**
 * leadership_rsvp.js - Logic xử lý Xác nhận tham gia & Quét mã VietQR SePay
 * Khóa học: Team Happiness Starts With Your Leadership (20/09/2026)
 * CultureCode Team
 */

(function () {
    'use strict';

    // ============================================================
    // CẤU HÌNH & HẰNG SỐ
    // ============================================================
    const CONFIG = {
        amount: Number(window.DHM_LEAD_PAYMENT_AMOUNT) || 250000,
        account: window.DHM_LEAD_PAYMENT_ACCOUNT || '96247CULTURECODE',
        bank: window.DHM_LEAD_PAYMENT_BANK || 'BIDV',
        holder: window.DHM_LEAD_PAYMENT_HOLDER || 'HA NGOC HOAN',
        holderDisplay: window.DHM_LEAD_PAYMENT_HOLDER_DISPLAY || 'Hà Ngọc Hoàn',
        prefix: window.DHM_LEAD_PAYMENT_PREFIX || 'DHL',
        zaloUrl: window.DHM_LEAD_ZALO_URL || 'https://zalo.me/g/awqtf1ayfblnrwi1y4bq',
        webAppUrl: window.CUSTOM_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec',
        pollIntervalMs: 4000,
        maxPollAttempts: 150
    };

    let currentUser = {
        name: '',
        email: '',
        phone: '',
        uuid: '',
        paymentCode: '',
        note: ''
    };

    let pollTimer = null;
    let pollAttempts = 0;

    // ============================================================
    // TIỆN ÍCH MẬT MÃ & CHUẨN HÓA
    // ============================================================
    function generateUuid() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
            const arr = new Uint8Array(16);
            crypto.getRandomValues(arr);
            arr[6] = (arr[6] & 0x0f) | 0x40;
            arr[8] = (arr[8] & 0x3f) | 0x80;
            const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
            return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        }
        return 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    }

    function normalizePhone(phone) {
        if (!phone) return '';
        let digits = String(phone).replace(/\D/g, '');
        if (digits.indexOf('0084') === 0 && digits.length > 6) digits = '0' + digits.slice(4);
        if (digits.indexOf('84') === 0 && digits.length > 6) digits = '0' + digits.slice(2);
        if (digits.length === 9 && digits.indexOf('0') !== 0) digits = '0' + digits;
        return digits;
    }

    function buildPaymentCode(phone, uuid) {
        const cleanPhone = normalizePhone(phone);
        const codeDigits = cleanPhone.replace(/^0/, '');
        if (/^\d{3,}$/.test(codeDigits)) {
            return CONFIG.prefix + codeDigits.slice(-9);
        }
        const shortHex = (uuid || generateUuid()).replace(/-/g, '').slice(0, 8).toUpperCase();
        return CONFIG.prefix + shortHex;
    }

    // ============================================================
    // ĐIỀU HƯỚNG BƯỚC (STEP MANAGEMENT)
    // ============================================================
    function showStep(stepId) {
        document.querySelectorAll('.step-container').forEach(el => el.classList.remove('active'));
        const target = document.getElementById(stepId);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ============================================================
    // BÓC TÁCH URL PARAMETERS & ĐỒNG BỘ INPUT
    // ============================================================
    function parseUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        const rawName = params.get('name') || params.get('fullname') || params.get('hoten') || '';
        const rawEmail = params.get('email') || params.get('mail') || '';
        const rawPhone = params.get('phone') || params.get('sdt') || params.get('tel') || '';

        currentUser.name = decodeURIComponent(rawName).trim();
        currentUser.email = decodeURIComponent(rawEmail).trim();
        currentUser.phone = decodeURIComponent(rawPhone).trim();

        // Lấy hoặc tạo UUID cho phiên
        let savedUuid = sessionStorage.getItem('dhm_lead_uuid');
        if (!savedUuid) {
            savedUuid = generateUuid();
            sessionStorage.setItem('dhm_lead_uuid', savedUuid);
        }
        currentUser.uuid = savedUuid;

        // Điền vào input fields nếu có
        const inputName = document.getElementById('inputName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPhone = document.getElementById('inputPhone');

        if (inputName && currentUser.name) inputName.value = currentUser.name;
        if (inputEmail && currentUser.email) inputEmail.value = currentUser.email;
        if (inputPhone && currentUser.phone) inputPhone.value = currentUser.phone;

        updateStateFromInputs();
    }

    function updateStateFromInputs() {
        const inputName = document.getElementById('inputName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPhone = document.getElementById('inputPhone');

        if (inputName) currentUser.name = inputName.value.trim();
        if (inputEmail) currentUser.email = inputEmail.value.trim();
        if (inputPhone) currentUser.phone = inputPhone.value.trim();

        // Cập nhật mã thanh toán và preview
        currentUser.paymentCode = buildPaymentCode(currentUser.phone, currentUser.uuid);

        const previewEl = document.getElementById('valPaymentCodePreview');
        if (previewEl) {
            previewEl.textContent = currentUser.paymentCode || 'DHL...';
        }
    }

    // ============================================================
    // CHUẨN BỊ MÀN HÌNH QUÉT MÃ VIETQR (STEP 2)
    // ============================================================
    function setupStep2Payment() {
        const qrUrl = 'https://qr.sepay.vn/img?' + new URLSearchParams({
            acc: CONFIG.account,
            bank: CONFIG.bank,
            amount: String(CONFIG.amount),
            des: currentUser.paymentCode,
            template: 'compact',
            showinfo: 'false',
            holder: CONFIG.holder
        }).toString();

        const qrImgEl = document.getElementById('sepayQrImg');
        const amountEl = document.getElementById('qrAmountDisplay');
        const contentEl = document.getElementById('qrContentDisplay');
        const accountEl = document.getElementById('qrAccountDisplay');
        const bankEl = document.getElementById('qrBankDisplay');
        const holderEl = document.getElementById('qrHolderDisplay');

        if (qrImgEl) qrImgEl.src = qrUrl;
        if (amountEl) amountEl.textContent = Number(CONFIG.amount).toLocaleString('vi-VN') + 'đ';
        if (contentEl) contentEl.textContent = currentUser.paymentCode;
        if (accountEl) accountEl.textContent = CONFIG.account;
        if (bankEl) bankEl.textContent = CONFIG.bank;
        if (holderEl) holderEl.textContent = CONFIG.holderDisplay;

        // Bắt đầu lắng nghe trạng thái thanh toán
        startPaymentPolling();
    }

    // ============================================================
    // POLLING KIỂM TRA TRẠNG THÁI THANH TOÁN (REALTIME)
    // ============================================================
    function startPaymentPolling() {
        if (pollTimer) clearInterval(pollTimer);
        pollAttempts = 0;

        pollTimer = setInterval(function () {
            pollAttempts++;
            if (pollAttempts > CONFIG.maxPollAttempts) {
                clearInterval(pollTimer);
                return;
            }
            checkPaymentStatus(false);
        }, CONFIG.pollIntervalMs);
    }

    function checkPaymentStatus(isManual) {
        if (!currentUser.paymentCode && !currentUser.uuid) return;

        const checkUrl = CONFIG.webAppUrl + '?action=checkStatus'
            + '&paymentCode=' + encodeURIComponent(currentUser.paymentCode)
            + '&uuid=' + encodeURIComponent(currentUser.uuid)
            + '&lane=dhl'
            + '&t=' + Date.now();

        // Sử dụng JSONP tuân thủ regex /^dh(?:m8|9)Jsonp_[A-Za-z0-9]{16,40}$/ của Apps Script
        const randomSuffix = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
        const callbackName = 'dhm8Jsonp_' + Date.now() + randomSuffix;
        window[callbackName] = function (res) {
            try {
                delete window[callbackName];
                const scriptEl = document.getElementById(callbackName);
                if (scriptEl) scriptEl.remove();
            } catch (e) { }

            if (res && (res.paymentStatus === 'PAID' || res.state === 'PAID' || res.paid)) {
                if (pollTimer) clearInterval(pollTimer);
                onPaymentSuccess();
            } else if (isManual) {
                alert('Hệ thống chưa nhận được khoản chuyển ' + Number(CONFIG.amount).toLocaleString('vi-VN') + 'đ với nội dung ' + currentUser.paymentCode + '. Nếu bạn vừa chuyển, vui lòng chờ khoảng 5-10 giây để ngân hàng đồng bộ.');
            }
        };

        const script = document.createElement('script');
        script.id = callbackName;
        script.src = checkUrl + '&callback=' + callbackName;
        script.onerror = function () {
            try {
                delete window[callbackName];
                script.remove();
            } catch (e) { }
        };
        document.body.appendChild(script);
    }

    // ============================================================
    // HOÀN TẤT THANH TOÁN & MỞ STEP 3
    // ============================================================
    function onPaymentSuccess() {
        const successNameEl = document.getElementById('successName');
        const successCodeEl = document.getElementById('successCode');
        const btnJoinZaloEl = document.getElementById('btnJoinZalo');

        if (successNameEl) successNameEl.textContent = currentUser.name || 'Học viên';
        if (successCodeEl) successCodeEl.textContent = currentUser.paymentCode;
        if (btnJoinZaloEl) btnJoinZaloEl.href = CONFIG.zaloUrl;

        // Lưu trạng thái hoàn tất vào sessionStorage
        sessionStorage.setItem('dhm_lead_paid', 'true');

        showStep('step3');
    }

    // ============================================================
    // GỬI DỮ LIỆU ĐĂNG KÝ BAN ĐẦU LÊN GOOGLE APPS SCRIPT
    // ============================================================
    function submitRsvpRegistration(status) {
        const payload = {
            registrationUuid: currentUser.uuid,
            fullName: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
            company: 'Leadership Workshop 20/09',
            jobTitle: 'Khách mời Leadership',
            eventId: 'LEADERSHIP_200926_HCM',
            lane: 'dhl',
            source: 'Web_Leadership_RSVP',
            status: status || 'PENDING',
            note: currentUser.note || '',
            timestamp: new Date().toISOString()
        };

        // Gửi qua POST no-cors
        try {
            fetch(CONFIG.webAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(err => {
                console.warn('[RSVP] fetch post error:', err);
            });
        } catch (e) {
            console.warn('[RSVP] post exception:', e);
        }
    }

    // ============================================================
    // TIỆN ÍCH COPY NHANH
    // ============================================================
    window.copyText = function (text, btn) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => markCopied(btn));
        } else {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            markCopied(btn);
        }
    };

    window.copyContent = function (btn) {
        window.copyText(currentUser.paymentCode, btn);
    };

    function markCopied(btn) {
        if (!btn) return;
        const oldText = btn.textContent;
        btn.textContent = 'Đã chép ✓';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = oldText;
            btn.classList.remove('copied');
        }, 2000);
    }

    // ============================================================
    // KHỞI TẠO EVENT LISTENERS
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        parseUrlParameters();

        // Gắn listener lắng nghe thay đổi input realtime
        const inputName = document.getElementById('inputName');
        const inputEmail = document.getElementById('inputEmail');
        const inputPhone = document.getElementById('inputPhone');

        if (inputName) inputName.addEventListener('input', updateStateFromInputs);
        if (inputEmail) inputEmail.addEventListener('input', updateStateFromInputs);
        if (inputPhone) inputPhone.addEventListener('input', updateStateFromInputs);

        // Kiểm tra xem học viên này đã hoàn tất thanh toán trước đó chưa
        if (sessionStorage.getItem('dhm_lead_paid') === 'true') {
            onPaymentSuccess();
            return;
        }

        // Nút Xác nhận tham dự -> Chuyển sang Step 2
        const btnProceed = document.getElementById('btnProceedToPayment');
        if (btnProceed) {
            btnProceed.addEventListener('click', function () {
                updateStateFromInputs();

                if (!currentUser.name) {
                    alert('Vui lòng nhập Họ và tên của bạn.');
                    if (inputName) inputName.focus();
                    return;
                }
                if (!currentUser.email || currentUser.email.indexOf('@') === -1) {
                    alert('Vui lòng nhập địa chỉ Email hợp lệ.');
                    if (inputEmail) inputEmail.focus();
                    return;
                }
                if (!currentUser.phone || normalizePhone(currentUser.phone).length < 9) {
                    alert('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9-10 chữ số) để tạo mã chuyển khoản SePay.');
                    if (inputPhone) inputPhone.focus();
                    return;
                }

                const noteInput = document.getElementById('rsvpNote');
                currentUser.note = noteInput ? noteInput.value.trim() : '';

                // Gửi ghi nhận PENDING lên hệ thống
                submitRsvpRegistration('PENDING');

                // Chuyển sang Step 2 và nạp mã QR
                setupStep2Payment();
                showStep('step2');
            });
        }

        // Nút Từ chối tham gia -> Chuyển sang Step Declined
        const btnDecline = document.getElementById('btnDecline');
        if (btnDecline) {
            btnDecline.addEventListener('click', function () {
                updateStateFromInputs();
                if (confirm('Bạn có chắc chắn muốn từ chối tham gia để CultureCode Team nhường suất cho nhân sự khác không?')) {
                    const noteInput = document.getElementById('rsvpNote');
                    currentUser.note = noteInput ? noteInput.value.trim() : 'Từ chối tham gia';
                    submitRsvpRegistration('DECLINED');
                    showStep('stepDeclined');
                }
            });
        }

        // Nút Kiểm tra thanh toán thủ công trên Step 2
        const btnCheckNow = document.getElementById('btnCheckPaymentNow');
        if (btnCheckNow) {
            btnCheckNow.addEventListener('click', function () {
                checkPaymentStatus(true);
            });
        }

        // Nút Quay lại Step 1
        const btnBack = document.getElementById('btnBackToStep1');
        if (btnBack) {
            btnBack.addEventListener('click', function () {
                if (pollTimer) clearInterval(pollTimer);
                showStep('step1');
            });
        }
    });

})();
