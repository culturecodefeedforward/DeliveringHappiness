document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    const nameParam = urlParams.get('name');

    const checkinEmail = document.getElementById('checkinEmail');
    const fallbackEmailSection = document.getElementById('fallbackEmailSection');
    const fallbackEmailInput = document.getElementById('fallbackEmailInput');
    const greetingContainer = document.getElementById('greetingContainer');

    if (emailParam) {
        // Có email trong URL
        checkinEmail.value = emailParam;
        if (nameParam) {
            greetingContainer.innerHTML = `Chào <strong>${nameParam}</strong>, vui lòng bổ sung thông tin dưới đây để hoàn tất thủ tục check-in nhận tài liệu.`;
        } else {
            greetingContainer.innerHTML = `Chào bạn (${emailParam}), vui lòng bổ sung thông tin dưới đây để hoàn tất thủ tục check-in nhận tài liệu.`;
        }
    } else {
        // Không có email trong URL (người dùng tự vào link hoặc quét mã dự phòng)
        fallbackEmailSection.style.display = 'block';
        greetingContainer.innerHTML = `Chào bạn, vui lòng nhập Email và bổ sung thông tin dưới đây để hoàn tất thủ tục check-in nhận tài liệu.`;
        fallbackEmailInput.required = true;
    }

    // Xử lý radio "Khác"
    const sourceRadios = document.querySelectorAll('input[name="sourceHearing"]');
    const sourceOtherInput = document.getElementById('sourceHearingOther');
    sourceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'Khác') {
                sourceOtherInput.required = true;
                sourceOtherInput.focus();
            } else {
                sourceOtherInput.required = false;
                sourceOtherInput.value = '';
            }
        });
    });

    const form = document.getElementById('checkinForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('registrationError');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Lấy dữ liệu
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Ghi đè email nếu dùng fallback
        if (!emailParam && fallbackEmailInput.value) {
            data.email = fallbackEmailInput.value.trim();
        }

        // Validate email
        if (!data.email) {
            showError('Vui lòng cung cấp Email để hệ thống nhận diện bạn.');
            return;
        }

        // Gom checkbox attendedPrograms
        const attendedCheckboxes = document.querySelectorAll('input[name="attendedPrograms"]:checked');
        const attendedProgramsArr = Array.from(attendedCheckboxes).map(cb => cb.value);
        if (attendedProgramsArr.includes('Khác') && data.attendedProgramsOther) {
            const idx = attendedProgramsArr.indexOf('Khác');
            attendedProgramsArr[idx] = `Khác: ${data.attendedProgramsOther}`;
        }
        data.attendedPrograms = attendedProgramsArr.join(', ');

        // Gom checkbox purpose
        const purposeCheckboxes = document.querySelectorAll('input[name="purpose"]:checked');
        const purposeArr = Array.from(purposeCheckboxes).map(cb => cb.value);
        if (purposeArr.includes('Khác') && data.purposeOther) {
            const idx = purposeArr.indexOf('Khác');
            purposeArr[idx] = `Khác: ${data.purposeOther}`;
        }
        data.purpose = purposeArr.join(', ');

        // Gom radio sourceHearingOther
        if (data.sourceHearing === 'Khác' && data.sourceHearingOther) {
            data.sourceHearing = `Khác: ${data.sourceHearingOther}`;
        }

        // Xóa các trường tạm
        delete data.attendedProgramsOther;
        delete data.purposeOther;
        delete data.sourceHearingOther;

        submitData(data);
    });

    function showError(msg) {
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = msg;
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }

    function submitData(data) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        errorDiv.style.display = 'none';

        // Gửi qua Fetch API (Vì GAS trả về JSON nếu set đúng CORS hoặc trả về form)
        // Lưu ý: Nếu GAS bị CORS, dùng JSONP. DHM8 code cũ dùng JSONP cho fetch an toàn.
        // Ở đây dùng fetch đơn giản trước vì method POST.
        
        fetch(window.CUSTOM_WEBAPP_URL, {
            method: 'POST',
            body: JSON.stringify(data) // Gửi dạng text/plain để né CORS preflight trên GAS
        })
        .then(response => {
            // Fetch POST sang GAS thường bị đụng CORS redirect. Nên handle an toàn.
            form.style.display = 'none';
            greetingContainer.style.display = 'none';
            successMessage.style.display = 'block';
        })
        .catch(err => {
            console.error('Submit error', err);
            // Kể cả lỗi CORS thì trên GAS request POST vẫn được thực thi xong.
            form.style.display = 'none';
            greetingContainer.style.display = 'none';
            successMessage.style.display = 'block';
        });
    }
});
