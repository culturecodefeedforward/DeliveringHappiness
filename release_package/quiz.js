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
            { text: "Cảm giác Tự chủ (Control) — dám lên tiếng, thử nghiệm và chịu trách nhiệm.", isCorrect: true },
            { text: "Cảm giác Kết nối (Connectedness) — tạo dựng mối quan hệ hòa ái và gắn kết sâu sắc.", isCorrect: false },
            { text: "Cảm giác Tiến bộ (Progress) — ghi nhận các bước tiến và thành tựu cá nhân.", isCorrect: false },
            { text: "Cảm giác Dấn thân (Engagement) — đắm chìm vào công việc với động lực nội tại.", isCorrect: false }
        ],
        explanation: "Trong mô hình Delivering Happiness, An toàn tâm lý (Psychological Safety) là điều kiện nền tảng thuộc Đòn bẩy Tự chủ (Autonomy), giúp nhân viên dám nói lên tiếng nói cá nhân, thử nghiệm cách làm mới và chịu trách nhiệm."
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
        q: "Một nhân viên báo cáo sai sót trong công việc. Theo tinh thần xây dựng môi trường An toàn tâm lý, người quản lý nên phản ứng như thế nào?",
        options: [
            { text: "Xem mọi sai sót là không thể chấp nhận và yêu cầu nhân viên chịu trách nhiệm như nhau, bất kể nguyên nhân.", isCorrect: false },
            { text: "Bỏ qua sai sót để nhân viên không cảm thấy áp lực hoặc mất tự tin.", isCorrect: false },
            { text: "Tập trung tìm người chịu trách nhiệm trước khi tìm hiểu nguyên nhân và cách khắc phục.", isCorrect: false },
            { text: "Cùng nhân viên tìm hiểu nguyên nhân, phân biệt lỗi phòng tránh được (prevented), lỗi phức tạp của hệ thống (complexity) và lỗi thông minh phát sinh khi thử nghiệm điều mới (intelligence), từ đó lựa chọn cách xử lý phù hợp.", isCorrect: true }
        ],
        explanation: "Phân biệt các loại lỗi giúp tổ chức lựa chọn cách phản hồi phù hợp thay vì quy mọi sai sót về lỗi cá nhân."
    },
    {
        q: "Theo mô hình Delivering Happiness (kế thừa từ Martin Seligman), đâu là 3 cấp độ hạnh phúc theo thứ tự độ bền vững tăng dần?",
        options: [
            { text: "Thú vui (Pleasure) ➔ Đam mê (Passion) ➔ Mục đích cao cả (Higher Purpose).", isCorrect: true },
            { text: "Cảm giác Kết nối (Connectedness) ➔ Cảm giác Tự chủ (Autonomy) ➔ Cảm giác Tiến bộ (Progress).", isCorrect: false },
            { text: "Thực hành Biết ơn (Gratitude) ➔ Trạng thái Tỉnh thức (Mindfulness) ➔ Tinh thần Vị nhân (Altruism).", isCorrect: false },
            { text: "Nhận thức Giá trị (Core Values) ➔ Chuẩn hóa Hành vi (Key Behaviors) ➔ Văn hóa Tổ chức (Culture).", isCorrect: false }
        ],
        explanation: "3 cấp độ hạnh phúc theo thứ tự bền vững tăng dần: Thú vui (Pleasure) ➔ Đam mê (Passion) ➔ Mục đích cao cả (Higher Purpose)."
    },
    {
        q: "Trong Delivering Happiness, ME Values có vai trò như một chiếc la bàn định hướng hành động. Tình huống nào dưới đây thể hiện rõ nhất việc một người thực sự sống theo giá trị cốt lõi của mình, thay vì chỉ tuyên ngôn những giá trị đó?",
        options: [
            { text: "Luôn nhắc đến sự trung thực như một giá trị quan trọng, nhưng che giấu sai sót khi việc thừa nhận có thể ảnh hưởng đến hình ảnh cá nhân.", isCorrect: false },
            { text: "Chỉ thể hiện những giá trị được tổ chức đề cao khi có lãnh đạo quan sát hoặc đánh giá.", isCorrect: false },
            { text: "Kiên định với giá trị trung thực bằng cách chủ động thừa nhận sai sót, minh bạch thông tin và chịu trách nhiệm, ngay cả khi điều đó khiến bản thân gặp bất lợi trước mắt.", isCorrect: true },
            { text: "Lựa chọn hành động theo số đông để tránh bất đồng, dù điều đó trái với những giá trị bản thân đã xác định.", isCorrect: false }
        ],
        explanation: "Giá trị cốt lõi thực sự được thể hiện qua lựa chọn và hành động, đặc biệt trong những tình huống khó khăn khi sống đúng với giá trị có thể phải trả giá. Giá trị không chỉ nằm ở điều ta nói, mà còn ở cách ta hành động khi không có ai giám sát."
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
        q: "Khi quan sát một đội ngũ làm việc hiệu quả, bạn nhận thấy các thành viên được chủ động lựa chọn cách thực hiện công việc trong phạm vi mục tiêu chung. Bài học nào dưới đây phù hợp nhất với đòn bẩy Tự chủ?",
        options: [
            { text: "Tự chủ có nghĩa là mỗi người được làm theo ý mình mà không cần quan tâm đến mục tiêu chung.", isCorrect: false },
            { text: "Để đảm bảo chất lượng, người quản lý nên quyết định chi tiết cách làm và yêu cầu nhân viên tuân thủ tuyệt đối.", isCorrect: false },
            { text: "Tự chủ chỉ phù hợp với những nhân viên có thâm niên và không cần áp dụng cho nhân viên mới.", isCorrect: false },
            { text: "Trao quyền chủ động giúp nhân viên phát huy khả năng, đưa ra quyết định và tự chịu trách nhiệm về kết quả trong phạm vi được thống nhất.", isCorrect: true }
        ],
        explanation: "Tự chủ tạo điều kiện để mỗi người chủ động hành động và phát huy năng lực, đồng thời vẫn gắn với mục tiêu chung và trách nhiệm cá nhân."
    },
    {
        q: "Theo khoa học hạnh phúc, tại sao các mục tiêu bên ngoài như mua nhà, thăng chức hay tích lũy tài chính không đảm bảo hạnh phúc bền lâu?",
        options: [
            { text: "Vì chúng làm triệt tiêu hoàn toàn động lực nội tại (Intrinsic Motivation) và khả năng sáng tạo tự thân.", isCorrect: false },
            { text: "Vì niềm vui từ việc đạt được thành tựu bên ngoài có thể giảm dần theo thời gian, trong khi hạnh phúc bền lâu phụ thuộc vào đam mê, mục đích cao cả, lẽ sống của mỗi chúng ta.", isCorrect: true },
            { text: "Vì các mục tiêu vật chất luôn làm suy yếu cảm giác kết nối sâu sắc (Deep Connectedness) giữa cá nhân với tổ chức.", isCorrect: false },
            { text: "Vì việc theo đuổi danh vọng bên ngoài sẽ trực tiếp phá vỡ la bàn giá trị cốt lõi (Core Values Compass) của mỗi người.", isCorrect: false }
        ],
        explanation: "Thành công vật chất vẫn có thể đóng góp vào hạnh phúc, đặc biệt khi giúp đáp ứng nhu cầu thiết yếu và tạo sự an toàn. Tuy nhiên, niềm vui từ thành tựu thường không duy trì nguyên vẹn mãi mãi; những yếu tố như ý nghĩa và lẽ sống rất quan trọng."
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
