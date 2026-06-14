document.getElementById('crmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const spinner = btn.querySelector('.loading-spinner');
    const text = btn.querySelector('.btn-text');

    btn.disabled = true;
    spinner.style.display = 'inline-block';
    text.innerText = 'Đang xử lý...';

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Gather checkboxes for purpose
    const purposeChoices = formData.getAll('purpose');
    let purposeList = [...purposeChoices];
    const indexKhacPurp = purposeList.indexOf('Khác');
    if (indexKhacPurp !== -1) {
        purposeList[indexKhacPurp] = `Khác: ${data.purposeOther || ''}`;
    }
    data.purpose = purposeList.filter(p => p !== 'Khác').join(', ');
    delete data.purposeOther;

    // Gather checkboxes for attendedPrograms
    const progChoices = formData.getAll('attendedPrograms');
    let progList = [...progChoices];
    const indexKhacProg = progList.indexOf('Khác');
    if (indexKhacProg !== -1) {
        progList[indexKhacProg] = `Khác: ${data.attendedProgramsOther || ''}`;
    }
    // Set to empty string if no program is checked to avoid undefined behavior
    data.attendedPrograms = progList.length > 0 ? progList.filter(p => p !== 'Khác').join(', ') : 'Chưa tham gia';
    delete data.attendedProgramsOther;

    // Gather radio for sourceHearing
    if (data.sourceHearing === 'Khác') {
        data.sourceHearing = `Khác: ${data.sourceHearingOther || ''}`;
    }
    delete data.sourceHearingOther;

    try {
        if (window.logToSheet) {
            await window.logToSheet('REGISTER_SUBMIT', data.fullName, {
                ...data,
                type: 'EVENT_LEAD_DHM8',
                source: 'Web_DHM8_Official'
            });
        }

        document.getElementById('crmForm').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        btn.disabled = false;
        spinner.style.display = 'none';
        text.innerText = 'Gửi đăng ký & Hoàn tất';
    }
});
