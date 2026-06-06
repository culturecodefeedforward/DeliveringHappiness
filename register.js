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
    const additionalCourses = formData.getAll('additionalCourses');
    data.additionalCourses = additionalCourses.join(', ');
    data.wantsNvcCourse = document.getElementById('courseNvc').checked ? 'Yes' : 'No';
    data.wantsAiCourse = document.getElementById('courseAi').checked ? 'Yes' : 'No';

    try {
        if (window.logToSheet) {
            await window.logToSheet('REGISTER_SUBMIT', data.fullName, {
                ...data,
                type: 'CRM_LEAD'
            });
        }

        document.getElementById('crmForm').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        btn.disabled = false;
        spinner.style.display = 'none';
        text.innerText = 'Gửi đăng ký';
    }
});
