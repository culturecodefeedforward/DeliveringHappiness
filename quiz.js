// --- CONFIGURATION ---
// Quiz sử dụng chung logToSheet và SHEET_WEBAPP_URL từ tracking.js lo liệu.

const quizData = [
    {
        q: "Trong Cảm giác 'Tiến bộ' (Sense of Progress), yếu tố nào quan trọng nhất để nuôi dưỡng động lực nội tại?",
        options: [
            { text: "Sự ghi nhận liên tục các bước tiến nhỏ (Small wins) để kích hoạt Dopamine tự nhiên.", isCorrect: true },
            { text: "Những phần thưởng tài chính đột biến vào cuối năm (Annual bonuses) dựa trên kết quả KPI.", isCorrect: false },
            { text: "Việc duy trì tiêu chuẩn kỷ luật nghiêm ngặt (Strict accountability) để không bao giờ xảy ra lỗi.", isCorrect: false },
            { text: "Cán đích hoàn thành các đại dự án chiến lược (Milestone achievements) có quy mô lớn của tổ chức.", isCorrect: false }
        ],
        explanation: "Sự ghi nhận liên tục các bước tiến nhỏ (Small wins) giúp kích hoạt Dopamine tự nhiên, nuôi dưỡng cảm giác tiến bộ bền vững."
    },
    {
        q: "Trong mô hình 3 Đòn bẩy của Delivering Happiness, An toàn tâm lý (Psychological Safety) là điều kiện nền tảng để xây dựng đòn bẩy nào?",
        options: [
            { text: "Cảm giác Tự chủ (Autonomy) — dám lên tiếng, thử nghiệm và chịu trách nhiệm.", isCorrect: true },
            { text: "Cảm giác Kết nối (Connectedness) — tạo dựng mối quan hệ hòa ái và gắn kết sâu sắc.", isCorrect: false },
            { text: "Cảm giác Tiến bộ (Progress) — ghi nhận các bước tiến và thành tựu cá nhân.", isCorrect: false },
            { text: "Cảm giác Dấn thân (Engagement) — đắm chìm vào công việc với động lực nội tại.", isCorrect: false }
        ],
        explanation: "Theo Slide 31 của Delivering Happiness, An toàn tâm lý (Psychological Safety) là điều kiện nền tảng thuộc Đòn bẩy Tự chủ (Autonomy), giúp nhân viên dám nói lên tiếng nói cá nhân, thử nghiệm cách làm mới và chịu trách nhiệm."
    },
    {
        q: "Trong môi trường công việc, cảm giác 'Tự chủ' (Autonomy) được hiểu chính xác nhất là:",
        options: [
            { text: "Có quyền chủ động lựa chọn và kiểm soát phương pháp thực hiện công việc (Method Control).", isCorrect: true },
            { text: "Được quyền phân công mệnh lệnh và kiểm soát trực tiếp tiến độ của người khác (Task Authority).", isCorrect: false },
            { text: "Tự do làm việc độc lập hoàn toàn mà không cần phối hợp hay báo cáo quy trình (No Oversight).", isCorrect: false },
            { text: "Quyền miễn trừ khỏi các cam kết mục tiêu chung khi gặp trở ngại khách quan (Risk Exemption).", isCorrect: false }
        ],
        explanation: "Cảm giác Tự chủ (Autonomy) là có quyền chủ động lựa chọn và kiểm soát phương pháp thực hiện công việc (Method Control) để đạt mục tiêu chung."
    },
    {
        q: "Tại sao cảm giác 'Tiến bộ' (Progress) lại quan trọng hơn việc Đạt mục tiêu cuối cùng theo khoa học hạnh phúc?",
        options: [
            { text: "Vì các bước tiến nhỏ (Small wins) giải phóng Dopamine liên tục giúp duy trì năng lượng hành động.", isCorrect: true },
            { text: "Vì cảm giác tiến bộ giúp triệt tiêu hoàn toàn tác động tiêu cực của các thất bại tạm thời (Zero failures).", isCorrect: false },
            { text: "Vì đích đến cuối cùng luôn kích hoạt bẫy lo âu và áp lực phải liên tục đặt mục tiêu cao hơn (End-goal anxiety).", isCorrect: false },
            { text: "Vì sự tiến bộ là chỉ số duy nhất có thể định lượng chính xác bằng các khung đo lường năng lực (KPI metrics).", isCorrect: false }
        ],
        explanation: "Các bước tiến nhỏ (Small wins) giải phóng Dopamine liên tục, tạo động lực nội tại nuôi dưỡng năng lượng hành động bền bỉ."
    },
    {
        q: "Khái niệm 'Psychological Safety' (An toàn tâm lý) đóng vai trò gì đối với Đòn bẩy Tự chủ trong tổ chức?",
        options: [
            { text: "Thiết lập cơ chế kiểm soát nội bộ nghiêm ngặt để ngăn ngừa rủi ro sai sót quy trình (Internal Control).", isCorrect: false },
            { text: "Đảm bảo sự đồng thuận tuyệt đối trong mọi cuộc họp và hạn chế các tranh luận trái chiều (Strict Consensus).", isCorrect: false },
            { text: "Cung cấp chính sách phúc lợi và bảo đảm tài chính toàn diện để nhân viên an tâm làm việc (Job Security).", isCorrect: false },
            { text: "Tạo môi trường an toàn để mọi người dám chia sẻ sai sót và thử nghiệm ý tưởng mới (Safe to Speak Up).", isCorrect: true }
        ],
        explanation: "An toàn tâm lý tạo môi trường tin cậy để mọi người dám lên tiếng, chia sẻ sai sót và thử nghiệm ý tưởng mới (Safe to Speak Up) mà không sợ bị phán xét hay trừng phạt."
    },
    {
        q: "Theo mô hình Delivering Happiness (kế thừa từ Martin Seligman), đâu là 3 cấp độ hạnh phúc theo thứ tự độ bền vững tăng dần?",
        options: [
            { text: "Thú vui (Pleasure) ➔ Đam mê / Dòng chảy (Passion / Flow) ➔ Mục đích cao cả (Higher Purpose).", isCorrect: true },
            { text: "Cảm giác Kết nối (Connectedness) ➔ Cảm giác Tự chủ (Autonomy) ➔ Cảm giác Tiến bộ (Progress).", isCorrect: false },
            { text: "Thực hành Biết ơn (Gratitude) ➔ Trạng thái Tỉnh thức (Mindfulness) ➔ Tinh thần Vị nhân (Altruism).", isCorrect: false },
            { text: "Nhận thức Giá trị (Core Values) ➔ Chuẩn hóa Hành vi (Key Behaviors) ➔ Văn hóa Tổ chức (Culture).", isCorrect: false }
        ],
        explanation: "3 cấp độ hạnh phúc theo thứ tự bền vững tăng dần: Thú vui (Pleasure) ➔ Đam mê / Dòng chảy (Passion / Flow) ➔ Mục đích cao cả (Higher Purpose)."
    },
    {
        q: "Ai là tác giả của triết lý quản trị nổi tiếng: \"Xây dựng một văn hóa tuyệt vời và mọi thứ khác sẽ đi đúng hướng\" (Get the right culture, and everything else will fall into place)?",
        options: [
            { text: "Martin Seligman (Nhà tâm lý học, cha đẻ Tâm lý học Tích cực).", isCorrect: false },
            { text: "Mihály Csíkszentmihályi (Giáo sư tiên phong nghiên cứu về Dòng chảy).", isCorrect: false },
            { text: "Tony Hsieh (Cố CEO Zappos & Đồng sáng lập Delivering Happiness).", isCorrect: true },
            { text: "Aristotle (Triết gia Hy Lạp cổ đại với khái niệm Hạnh phúc Eudaimonia).", isCorrect: false }
        ],
        explanation: "Tony Hsieh (Cố CEO Zappos & Đồng sáng lập Delivering Happiness) là tác giả của triết lý quản trị kinh điển: 'Get the right culture, and everything else will fall into place'."
    },
    {
        q: "Trong Đòn bẩy Kết nối (Connectedness), trạng thái 'Sống hòa ái' được thể hiện trọn vẹn qua 3 mối quan hệ nào?",
        options: [
            { text: "Hòa ái với Bản thân (Self), với Người khác (Others) và với Thiên nhiên (Nature).", isCorrect: true },
            { text: "Hòa hợp với Mục tiêu (Goals), với Thành tích (Results) và với Lợi nhuận (Profit).", isCorrect: false },
            { text: "Đồng điệu với Tự chủ (Autonomy), với Tiến bộ (Progress) và với Năng lực (Competence).", isCorrect: false },
            { text: "Gắn kết với Tổ chức (Company), với Khách hàng (Clients) và với Quy trình (Process).", isCorrect: false }
        ],
        explanation: "Trong Đòn bẩy Kết nối (Connectedness), 'Sống hòa ái' gồm 3 mối quan hệ: với Bản thân (Self), với Người khác (Others) và với Thiên nhiên (Nature)."
    },
    {
        q: "Đâu là định nghĩa chuẩn xác nhất về Ownership Advantage™ (Lợi thế của tinh thần làm chủ) trên Slide bài giảng?",
        options: [
            { text: "Cảm giác được tổ chức chú ý và tôn trọng ý kiến đóng góp cá nhân (Being Heard & Valued).", isCorrect: false },
            { text: "Cảm giác gắn kết, tương tác cởi mở và quan tâm chân thành đến đồng đội (Sense of Connection).", isCorrect: false },
            { text: "Được tự do bộc lộ bản sắc con người thật trong môi trường công sở (Authentic Self at Work).", isCorrect: false },
            { text: "Lựa chọn cá nhân trong việc tự giác chịu trách nhiệm về kết quả (Personal Choice to Own Results).", isCorrect: true }
        ],
        explanation: "Ownership Advantage™ là sự lựa chọn cá nhân trong việc tự giác chịu trách nhiệm về kết quả hành động (Personal Choice to Own Results)."
    },
    {
        q: "Theo khoa học hạnh phúc, tại sao các mục tiêu bên ngoài như mua nhà, thăng chức hay tích lũy tài chính không đảm bảo hạnh phúc bền vững?",
        options: [
            { text: "Vì chúng làm triệt tiêu hoàn toàn động lực nội tại (Intrinsic Motivation) và khả năng sáng tạo tự thân.", isCorrect: false },
            { text: "Vì cơ chế thích nghi khoái lạc (Hedonic Adaptation) khiến cảm giác thỏa mãn tan biến nhanh và ta lại lập tức đặt cột mốc mới.", isCorrect: true },
            { text: "Vì các mục tiêu vật chất luôn làm suy yếu cảm giác kết nối sâu sắc (Deep Connectedness) giữa cá nhân với tổ chức.", isCorrect: false },
            { text: "Vì việc theo đuổi danh vọng bên ngoài sẽ trực tiếp phá vỡ la bàn giá trị cốt lõi (Core Values Compass) của mỗi người.", isCorrect: false }
        ],
        explanation: "Cơ chế thích nghi khoái lạc (Hedonic Adaptation) khiến con người nhanh chóng quen với tiện nghi mới, làm cảm xúc hưng phấn ban đầu mau chóng tan biến."
    }
];

let currentStep = 0;
let score = 0;
let answered = false;

// --- TRACKING (Dùng chung bộ sessionId từ tracking.js) ---
if (typeof logToSheet === 'undefined') {
    window.logToSheet = () => { console.log('Hệ thống tracking chưa được tải'); };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initQuiz() {
    logToSheet('START_QUIZ', 'User entered assessment page');
    renderQuestion();

    // Track buttons at navigation of quiz
    const navActions = document.getElementById('quizNavActions');
    if (navActions) {
        navActions.querySelectorAll('.btn-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                logToSheet('CTA_CLICK_DURING_QUIZ', btn.innerText.trim());
            });
        });
    }
}

function renderQuestion() {
    const data = quizData[currentStep];
    const container = document.getElementById('quizContent');
    const progressBar = document.getElementById('quizProgressBar');

    progressBar.style.width = `${((currentStep) / quizData.length) * 100}%`;

    // Sort options to randomly place correct answer
    const currentOptions = [...data.options];
    shuffleArray(currentOptions);
    data.shuffledOptions = currentOptions;

    const labels = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
        <div class="quiz-question-tag">Câu hỏi ${currentStep + 1}/${quizData.length}</div>
        <div class="quiz-question-text">${data.q}</div>
        <div class="quiz-options">
            ${currentOptions.map((opt, idx) => `
                <div class="quiz-option" onclick="handleAnswer(${idx}, ${opt.isCorrect})">
                    <span style="font-weight:800; color:var(--warm-yellow); margin-right:12px; font-size:1.1rem">${labels[idx]}.</span>
                    ${opt.text}
                </div>
            `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback" style="display:none"></div>
        <button class="btn-quiz-next" id="quizNextBtn" onclick="nextQuestion()">Tiếp theo</button>
    `;
    answered = false;
}

function handleAnswer(index, isCorrect) {
    if (answered) return;
    answered = true;

    const options = document.querySelectorAll('.quiz-option');
    options[index].classList.add(isCorrect ? 'correct' : 'wrong');

    // Logging chi tiết từng câu
    logToSheet('ANSWER_QUESTION', quizData[currentStep].q, {
        questionNum: currentStep + 1,
        result: isCorrect ? 'Đúng' : 'Sai'
    });

    const feedbackEl = document.getElementById('quizFeedback');

    if (isCorrect) {
        score++;
        feedbackEl.className = 'quiz-feedback feedback-correct';
        feedbackEl.innerHTML = `
            <h4>Chính xác! ✓</h4>
            <p>${quizData[currentStep].explanation}</p>
        `;
    } else {
        // Khi người đánh giá chọn sai: chỉ báo sai, KHÔNG highlight đáp án đúng và KHÔNG tiết lộ đáp án đúng
        feedbackEl.className = 'quiz-feedback feedback-wrong';
        feedbackEl.innerHTML = `
            <h4>Chưa chính xác! ✗</h4>
            <p>Lựa chọn này chưa đúng. Hãy tiếp tục câu hỏi tiếp theo.</p>
        `;
    }

    feedbackEl.style.display = 'block';
    document.getElementById('quizNextBtn').style.display = 'block';
}

function nextQuestion() {
    currentStep++;
    if (currentStep < quizData.length) {
        renderQuestion();
    } else {
        showSummary();
    }
}

function showSummary() {
    document.getElementById('quizProgressBar').style.width = '100%';
    const container = document.getElementById('quizContent');
    const summary = document.getElementById('quizSummary');

    // Ẩn các nút điều hướng nhanh của quiz để tránh trùng lặp nút ở màn hình kết quả
    const navActions = document.getElementById('quizNavActions');
    if (navActions) navActions.style.display = 'none';

    if (container) container.style.display = 'none';
    if (summary) summary.style.display = 'block';

    const finalScoreEl = document.getElementById('finalScore');
    const scoreStr = `${score}/${quizData.length}`;
    if (finalScoreEl) finalScoreEl.innerText = scoreStr;

    // Logging tổng hợp khi xong bài
    logToSheet('FINISH_QUIZ', 'User reached summary screen', { score: scoreStr });

    // Track buttons at footer of summary
    document.querySelectorAll('.summary-actions a').forEach(btn => {
        btn.addEventListener('click', () => {
            logToSheet('CTA_CLICK', btn.innerText.trim());
        });
    });
}

function finishQuiz() {
    // Navigate back to home or just hide
    document.getElementById('quizOverlay').classList.add('fade-out');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
