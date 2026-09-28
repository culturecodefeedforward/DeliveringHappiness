// Delivering Happiness Movement (DHM) — Modern Course Player Engine
// Supports User Auth, Two-Column Course Navigation, Quiz, Value Picker, ABCDE Worksheet & Progress Persistence

document.addEventListener("DOMContentLoaded", () => {
    // 1. EMBEDDED CURRICULUM FALLBACK (Ensures 100% reliability even if fetch fails)
    const DEFAULT_CURRICULUM = {
        courseTitle: "Delivering Happiness Movement (DHM) — Micro-Learning Journey",
        stages: [
            {
                id: "stage-1",
                stageNumber: 1,
                title: "Khoa Học Hạnh Phúc & 3 Cấp Độ",
                subtitle: "Thú vui (Pleasure) → Đam mê (Passion) → Mục đích cao cả (Higher Purpose)",
                instructor: "Anh Vũ",
                estimatedMinutes: 25,
                videoTitle: "Bài Giảng: 3 Cấp Độ Hạnh Phúc Theo Martin Seligman & Ẩn Dụ 3 Tầng Lầu",
                videoDuration: "06:30",
                videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                summaryText: "Mọi hành động con người đều hội tụ về đích đến là Hạnh phúc (Aristotle). Não bộ thích nghi rất nhanh với Thú vui ngắn hạn (Pleasure). Để duy trì hạnh phúc bền vững, con người bắt buộc phải nâng cấp lên trạng thái Phiêu (Passion / Flow) và cao nhất là Mục đích cao cả (Higher Purpose) khi cống hiến cho điều lớn lao hơn bản thân.",
                insights: [
                    { title: "Cấp độ 1: Thú vui", desc: "Nhanh nguội lạnh do cơ chế thích nghi khoái lạc (Hedonic adaptation). Tiền bạc, đồ chơi mới chỉ đem lại thỏa mãn nhất thời." },
                    { title: "Cấp độ 2: Đam mê", desc: "Trạng thái Dòng chảy (Flow) khi tập trung giải quyết thử thách phù hợp với kỹ năng. Thời gian như ngừng trôi." },
                    { title: "Cấp độ 3: Mục đích cao cả", desc: "Cấp độ bền vững nhất. Thấy công việc của mình có ý nghĩa, phụng sự và đóng góp giá trị cho cộng đồng." }
                ],
                quizzes: [
                    {
                        id: "q1",
                        question: "Theo nghiên cứu của Martin Seligman và triết lý DHM, cấp độ hạnh phúc nào có tính bền vững lâu dài nhất?",
                        options: [
                            "Thú vui (Pleasure) từ việc mua sắm đồ mới, đổi xe, ăn ngon",
                            "Đam mê (Passion) khi tập trung giải quyết công việc",
                            "Mục đích cao cả (Higher Purpose) khi cống hiến cho điều lớn lao hơn bản thân",
                            "Sự thoải mái khi không có áp lực công việc"
                        ],
                        correctIndex: 2,
                        explanation: "Chính xác! Thú vui nguội lạnh rất nhanh. Chỉ có Mục đích cao cả mới duy trì cảm xúc trọn vẹn và bền vững nhất qua thời gian."
                    },
                    {
                        id: "q2",
                        question: "Ẩn dụ 'Ba tầng lầu' của Phong Tử Khải tương ứng thế nào với 3 cấp độ hạnh phúc?",
                        options: [
                            "Tầng 1: Đam mê — Tầng 2: Vật chất — Tầng 3: Danh vọng",
                            "Tầng 1: Đời sống vật chất (Thú vui) — Tầng 2: Đời sống tinh thần (Đam mê) — Tầng 3: Đời sống tâm hồn (Mục đích cao cả)",
                            "Tầng 1: Gia đình — Tầng 2: Công việc — Tầng 3: Bạn bè",
                            "Tầng 1: Học tập — Tầng 2: Trải nghiệm — Tầng 3: Nghỉ ngơi"
                        ],
                        correctIndex: 1,
                        explanation: "Đúng! Đời người có ba tầng lầu: Tầng 1 là vật chất, Tầng 2 là tinh thần nghệ thuật/trí tuệ, Tầng 3 là tâm linh/mục đích cao cả phụng sự."
                    }
                ],
                reflectionPromptTitle: "Khoảnh khắc mãn nguyện nhất của bạn",
                reflectionPromptDesc: "Hãy nhớ lại một khoảnh khắc bạn cảm thấy thực sự hạnh phúc trong công việc gần đây. Khoảnh khắc đó thuộc cấp độ nào (Thú vui, Đam mê, hay Mục đích cao cả)? Tại sao?"
            },
            {
                id: "stage-2",
                stageNumber: 2,
                title: "Định Vị Bản Thân: La Bàn Gặp Đồng Hồ",
                subtitle: "Căn chỉnh Giá trị cá nhân (Me Values) với Giá trị tổ chức (We Values)",
                instructor: "Chị Châu & Anh Vũ",
                estimatedMinutes: 30,
                videoTitle: "Bài Giảng: Khi Đồng Hồ Bận Rộn Lấn Át Chiếc La Bàn Cuộc Đời",
                videoDuration: "08:15",
                videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                summaryText: "Đồng hồ biểu trưng cho lịch trình, thời hạn (deadline) và các việc khẩn cấp mỗi ngày. La bàn biểu trưng cho phương hướng, nguyên tắc và giá trị cốt lõi cuộc đời. Khi chỉ cắm đầu nhìn đồng hồ mà bỏ quên la bàn, ta có thể chạy rất nhanh nhưng lại tới nhầm đích.",
                insights: [
                    { title: "Bẫy chiếc Đồng hồ", desc: "Sự bận rộn giả tạo. Càng xử lý nhiều việc khẩn cấp không tên, ta càng thấy kiệt sức và mất phương hướng." },
                    { title: "Sức mạnh chiếc La bàn", desc: "Bộ lọc ra quyết định. Giúp bạn can đảm nói 'Không' với những thứ nằm ngoài giá trị cốt lõi của mình." },
                    { title: "Hòa nhịp Me & We", desc: "Tìm ra điểm giao thoa giữa giá trị cá nhân (Me Values) và văn hóa tổ chức/đội ngũ (We Values)." }
                ],
                valueOptions: [
                    "Chân thật & Trung thực (Integrity)",
                    "Học hỏi & Đổi mới (Continuous Learning)",
                    "Đồng hành & Tận tâm (Empathy & Care)",
                    "Bình an & Gia đình (Peace & Family)",
                    "Tự do & Sáng tạo (Freedom & Creativity)",
                    "Vị nhân & Cống hiến (Altruism & Service)",
                    "Kỷ luật & Xuất sắc (Excellence)",
                    "Lạc quan & Yêu đời (Joy & Positivity)"
                ],
                reflectionPromptTitle: "Giải quyết xung đột giữa Đồng hồ và La bàn",
                reflectionPromptDesc: "Khi có xung đột giữa áp lực deadline gấp (Đồng hồ) và việc giữ đúng giá trị cốt lõi của bản thân (La bàn), bạn đã hoặc sẽ hành xử như thế nào?"
            },
            {
                id: "stage-3",
                stageNumber: 3,
                title: "Chuyển Hóa Nghịch Cảnh: Framework ABCDE",
                subtitle: "Kỹ thuật phản biện niềm tin giới hạn để kiến tạo hành động tích cực",
                instructor: "Anh Vũ",
                estimatedMinutes: 35,
                videoTitle: "Bài Giảng: Cơ Chế A→B→C & Kỹ Thuật Phản Biện Chữ D (Stop-Breathe-Ask)",
                videoDuration: "09:40",
                videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                summaryText: "Lạc quan không phải là ảo tưởng màu hồng phớt lờ thực tế. Lạc quan theo khoa học là tối ưu hóa các lựa chọn hành động dựa trên mô hình ABCDE của Martin Seligman. Nghịch cảnh (A) kích hoạt Niềm tin tiêu cực (B) dẫn đến Hậu quả tê liệt (C). Chìa khóa hóa giải nằm ở chữ D (Dispute - Phản biện lý trí).",
                insights: [
                    { title: "A - B - C là tự động", desc: "Não bộ có xu hướng trầm trọng hóa vấn đề khi gặp sự cố, tự động sinh ra tiếng nói chỉ trích bản thân." },
                    { title: "D - Dispute là ý thức", desc: "Chủ động 'Stop - Breathe - Ask': Niềm tin này có đúng 100% không? Bằng chứng ngược lại là gì? Có giải pháp nào khác?" },
                    { title: "E - Effect & Action", desc: "Chuyển hóa năng lượng tiêu cực thành hành động cụ thể, dù là hành động nhỏ nhất để tái lập quyền kiểm soát." }
                ],
                abcdeSteps: [
                    { key: "A", name: "A — Adversity (Nghịch cảnh)", hint: "Sự việc khó khăn, thất bại hoặc tình huống gây áp lực cụ thể vừa xảy ra là gì?", placeholder: "Ví dụ: Dự án bị trễ hạn, khách hàng phàn nàn gay gắt..." },
                    { key: "B", name: "B — Belief (Niềm tin tự động)", hint: "Tiếng nói tiêu cực, phán xét tự động trong đầu bạn lúc đó là gì?", placeholder: "Ví dụ: Mình là người thất bại, sếp sẽ không bao giờ tin tưởng mình nữa..." },
                    { key: "C", name: "C — Consequence (Hậu quả cảm xúc)", hint: "Cảm xúc và phản ứng tiêu cực ban đầu của bạn là gì?", placeholder: "Ví dụ: Lo sợ, tim đập nhanh, thu mình lại, muốn bỏ cuộc..." },
                    { key: "D", name: "D — Dispute (Phản biện lý trí - QUAN TRỌNG NHẤT)", hint: "Áp dụng 'Stop - Breathe - Ask': Niềm tin B có thật sự đúng 100% không? Có góc nhìn khách quan nào khác?", placeholder: "Ví dụ: Đây chỉ là sự cố kỹ thuật khách quan, các phần khác vẫn tốt. Khách phàn nàn vì họ cần việc gấp, không phải ghét cá nhân mình..." },
                    { key: "E", name: "E — Effect & Action (Hành động tích cực mới)", hint: "Cảm xúc mới sau khi phản biện là gì? Bạn sẽ làm hành động cụ thể nào ngay bây giờ?", placeholder: "Ví dụ: Cảm thấy bình tĩnh lại. Hành động: Gọi điện xin lỗi khách và gửi lộ trình xử lý trong 2 tiếng tới..." }
                ],
                reflectionPromptTitle: "Bài học chuyển hóa sâu sắc nhất của bạn",
                reflectionPromptDesc: "Sau khi hoàn thành bài tập ABCDE, bạn thấy góc nhìn của mình về những áp lực trong công việc đã thay đổi như thế nào?"
            }
        ]
    };

    // 2. STATE OBJECT
    let curriculum = DEFAULT_CURRICULUM;
    let currentStageIndex = 0;
    let currentUser = null;

    let learnerProgress = {
        completedStages: [],
        stageData: {
            "stage-1": { quizAnswers: {}, score: 0, passed: false, reflection: "" },
            "stage-2": { selectedValues: [], reflection: "" },
            "stage-3": { abcde: { A: "", B: "", C: "", D: "", E: "" }, reflection: "" }
        }
    };

    // 3. DOM ELEMENTS
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebarBackdrop = document.getElementById("sidebar-backdrop");
    const syllabusList = document.getElementById("syllabus-list");
    const sidebarBadgeCompleted = document.getElementById("sidebar-badge-completed");

    const globalProgressBar = document.getElementById("global-progress-bar");
    const globalProgressText = document.getElementById("global-progress-text");

    const userChip = document.getElementById("user-chip");
    const userAvatar = document.getElementById("user-avatar");
    const userDisplayName = document.getElementById("user-display-name");
    const btnLogout = document.getElementById("btn-logout");

    const authModal = document.getElementById("auth-modal");
    const authForm = document.getElementById("auth-form");
    const loginNameInput = document.getElementById("login-name");
    const loginIdentityInput = document.getElementById("login-identity");

    const completionModal = document.getElementById("completion-modal");
    const btnCloseCompletion = document.getElementById("btn-close-completion");

    // Lesson view elements
    const breadcrumbStage = document.getElementById("breadcrumb-stage");
    const breadcrumbLesson = document.getElementById("breadcrumb-lesson");
    const lessonInstructorBadge = document.getElementById("lesson-instructor-badge");
    const lessonDurationBadge = document.getElementById("lesson-duration-badge");
    const lessonMainTitle = document.getElementById("lesson-main-title");
    const lessonSubtitle = document.getElementById("lesson-subtitle");

    // Video Player
    const videoPoster = document.getElementById("video-poster");
    const btnPlayVideo = document.getElementById("btn-play-video");
    const videoFrameContainer = document.getElementById("video-frame-container");
    const videoIframe = document.getElementById("video-iframe");
    const videoInfoTitle = document.getElementById("video-info-title");
    const videoInfoTime = document.getElementById("video-info-time");

    // Tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // Tab 1 Elements
    const summaryCoreText = document.getElementById("summary-core-text");
    const summaryCardsContainer = document.getElementById("summary-cards-container");

    // Tab 2 Elements
    const practiceQuizSection = document.getElementById("practice-quiz-section");
    const quizItemsContainer = document.getElementById("quiz-items-container");
    const quizScoreBadge = document.getElementById("quiz-score-badge");

    const practiceValuesSection = document.getElementById("practice-values-section");
    const valuesGrid = document.getElementById("values-grid");
    const valuesCountBadge = document.getElementById("values-count-badge");

    const practiceAbcdeSection = document.getElementById("practice-abcde-section");
    const abcdeStepsContainer = document.getElementById("abcde-steps-container");

    const reflectionInput = document.getElementById("reflection-input");
    const reflectionPromptTitle = document.getElementById("reflection-prompt-title");
    const reflectionPromptDesc = document.getElementById("reflection-prompt-desc");
    const reflectionCharCount = document.getElementById("reflection-char-count");
    const saveStatusIndicator = document.getElementById("save-status-indicator");

    // Bottom Navigation
    const btnPrevLesson = document.getElementById("btn-prev-lesson");
    const btnNextLesson = document.getElementById("btn-next-lesson");
    const btnManualSave = document.getElementById("btn-manual-save");

    // 4. INITIALIZATION & AUTHENTICATION FLOW
    function initAuth() {
        const savedUserStr = localStorage.getItem("dhm_lms_auth_user");
        if (savedUserStr) {
            try {
                currentUser = JSON.parse(savedUserStr);
                applyUserSession();
            } catch (e) {
                showAuthModal();
            }
        } else {
            showAuthModal();
        }
    }

    function showAuthModal() {
        authModal.classList.remove("hidden");
    }

    function hideAuthModal() {
        authModal.classList.add("hidden");
    }

    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = loginNameInput.value.trim();
        const identity = loginIdentityInput.value.trim().toLowerCase();

        if (!name || !identity) return;

        currentUser = { name, identity, loginTime: new Date().toISOString() };
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));

        hideAuthModal();
        applyUserSession();
    });

    btnLogout.addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) {
            localStorage.removeItem("dhm_lms_auth_user");
            currentUser = null;
            userChip.classList.add("hidden");
            showAuthModal();
        }
    });

    function applyUserSession() {
        if (!currentUser) return;

        userDisplayName.textContent = currentUser.name;
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        userChip.classList.remove("hidden");

        // Load specific user progress from localStorage
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
            try {
                learnerProgress = JSON.parse(savedProgress);
            } catch (e) {
                console.error("Error loading learner progress", e);
            }
        }

        renderSyllabus();
        loadStage(currentStageIndex);
        updateGlobalProgress();
    }

    function saveLearnerProgress() {
        if (!currentUser) return;
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        localStorage.setItem(progressKey, JSON.stringify(learnerProgress));

        // Also push to global registry for coach portal viewing
        recordLearnerInDirectory();

        saveStatusIndicator.textContent = "✓ Đã tự động lưu";
        saveStatusIndicator.className = "text-brand-green font-medium";
        setTimeout(() => {
            saveStatusIndicator.textContent = "Đã lưu";
        }, 2000);
    }

    function recordLearnerInDirectory() {
        if (!currentUser) return;
        const registryKey = "dhm_lms_all_learners_registry";
        let registry = [];
        try {
            const raw = localStorage.getItem(registryKey);
            if (raw) registry = JSON.parse(raw);
        } catch (e) {}

        const existingIdx = registry.findIndex(item => item.identity === currentUser.identity);
        const record = {
            name: currentUser.name,
            identity: currentUser.identity,
            lastActive: new Date().toISOString(),
            completedStagesCount: learnerProgress.completedStages.length,
            stage1Passed: !!learnerProgress.stageData["stage-1"]?.passed,
            stage2ValuesCount: learnerProgress.stageData["stage-2"]?.selectedValues?.length || 0,
            stage3AbcdeFilled: !!(learnerProgress.stageData["stage-3"]?.abcde?.D),
            data: learnerProgress
        };

        if (existingIdx >= 0) {
            registry[existingIdx] = record;
        } else {
            registry.push(record);
        }

        localStorage.setItem(registryKey, JSON.stringify(registry));
    }

    // 5. RENDER SYLLABUS SIDEBAR
    function renderSyllabus() {
        syllabusList.innerHTML = "";

        curriculum.stages.forEach((stage, idx) => {
            const isCompleted = learnerProgress.completedStages.includes(stage.id);
            const isCurrent = idx === currentStageIndex;
            // Locked if previous stage not completed (Stage 0 is always open)
            const isLocked = idx > 0 && !learnerProgress.completedStages.includes(curriculum.stages[idx - 1].id);

            const card = document.createElement("div");
            card.className = `p-3.5 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                    ? "bg-brand-card border-brand-amber/60 shadow-md shadow-amber-500/10"
                    : isCompleted
                    ? "bg-brand-surface border-brand-green/30 hover:border-brand-green/60"
                    : isLocked
                    ? "opacity-50 cursor-not-allowed bg-brand-surface/40 border-brand-border"
                    : "bg-brand-surface border-brand-border hover:border-slate-600"
            }`;

            card.innerHTML = `
                <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCompleted
                                ? "bg-brand-green/20 text-brand-green"
                                : isCurrent
                                ? "bg-brand-amber text-black"
                                : "bg-brand-card text-slate-400"
                        }">
                            ${isCompleted ? "✓" : stage.stageNumber}
                        </span>
                        <span class="text-xs font-bold text-slate-200">Chặng ${stage.stageNumber}</span>
                    </div>
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isCompleted
                            ? "bg-brand-green/10 text-brand-green"
                            : isCurrent
                            ? "bg-brand-amber/15 text-brand-amber"
                            : "bg-brand-dark text-slate-500"
                    }">
                        ${isCompleted ? "Đã xong" : isCurrent ? "Đang học" : isLocked ? "🔒 Khóa" : "Mở"}
                    </span>
                </div>
                <h4 class="text-xs font-bold text-slate-100 mt-2 line-clamp-1">${stage.title}</h4>
                <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-brand-border/40">
                    <span>⏱ ${stage.estimatedMinutes} phút</span>
                    <span>${stage.instructor}</span>
                </div>
            `;

            if (!isLocked) {
                card.addEventListener("click", () => {
                    currentStageIndex = idx;
                    loadStage(currentStageIndex);
                    renderSyllabus();
                    // Close mobile sidebar
                    closeMobileSidebar();
                });
            }

            syllabusList.appendChild(card);
        });

        const completedCount = learnerProgress.completedStages.length;
        sidebarBadgeCompleted.textContent = `${completedCount}/${curriculum.stages.length} Xong`;
    }

    // 6. LOAD ACTIVE STAGE
    function loadStage(stageIdx) {
        const stage = curriculum.stages[stageIdx];
        if (!stage) return;

        // Reset video to poster state
        videoPoster.classList.remove("hidden");
        videoFrameContainer.classList.add("hidden");
        videoIframe.src = "";

        // Header info
        breadcrumbStage.textContent = `Chặng ${stage.stageNumber}`;
        breadcrumbLesson.textContent = stage.title;
        lessonMainTitle.textContent = stage.title;
        lessonSubtitle.textContent = stage.subtitle;
        lessonInstructorBadge.textContent = `👨‍🏫 Giảng viên: ${stage.instructor}`;
        lessonDurationBadge.textContent = `⏱ ${stage.estimatedMinutes} phút`;

        // Video info
        videoInfoTitle.textContent = stage.videoTitle;
        videoInfoTime.textContent = `Thời lượng: ${stage.videoDuration}`;

        // Play video button action
        btnPlayVideo.onclick = () => {
            videoPoster.classList.add("hidden");
            videoFrameContainer.classList.remove("hidden");
            videoIframe.src = `${stage.videoUrl}?autoplay=1`;
        };

        // Tab 1: Summary & Insights
        summaryCoreText.textContent = stage.summaryText;
        summaryCardsContainer.innerHTML = "";
        stage.insights.forEach(item => {
            const c = document.createElement("div");
            c.className = "p-4 rounded-xl bg-brand-card/50 border border-brand-border space-y-1.5";
            c.innerHTML = `
                <div class="text-xs font-bold text-brand-amber uppercase tracking-wider">${item.title}</div>
                <div class="text-xs text-slate-300 leading-relaxed">${item.desc}</div>
            `;
            summaryCardsContainer.appendChild(c);
        });

        // Tab 2: Dynamic Practice sections
        const stageData = learnerProgress.stageData[stage.id] || {};

        if (stage.id === "stage-1") {
            practiceQuizSection.classList.remove("hidden");
            practiceValuesSection.classList.add("hidden");
            practiceAbcdeSection.classList.add("hidden");
            renderStage1Quiz(stage, stageData);
        } else if (stage.id === "stage-2") {
            practiceQuizSection.classList.add("hidden");
            practiceValuesSection.classList.remove("hidden");
            practiceAbcdeSection.classList.add("hidden");
            renderStage2Values(stage, stageData);
        } else if (stage.id === "stage-3") {
            practiceQuizSection.classList.add("hidden");
            practiceValuesSection.classList.add("hidden");
            practiceAbcdeSection.classList.remove("hidden");
            renderStage3Abcde(stage, stageData);
        }

        // Reflection section
        reflectionPromptTitle.textContent = `✍️ Phản tư cá nhân: ${stage.reflectionPromptTitle}`;
        reflectionPromptDesc.textContent = stage.reflectionPromptDesc;
        reflectionInput.value = stageData.reflection || "";
        reflectionCharCount.textContent = `${reflectionInput.value.length} ký tự`;

        // Bottom Navigation Buttons
        btnPrevLesson.disabled = (stageIdx === 0);
        if (stageIdx === curriculum.stages.length - 1) {
            btnNextLesson.innerHTML = `<span>🏆 Hoàn Tất Khóa Học ➔</span>`;
        } else {
            btnNextLesson.innerHTML = `<span>Hoàn thành & Tiếp tục ➔</span>`;
        }
    }

    // 7. STAGE 1: QUIZ ENGINE
    function renderStage1Quiz(stage, stageData) {
        quizItemsContainer.innerHTML = "";
        const savedAnswers = stageData.quizAnswers || {};

        stage.quizzes.forEach((q, qIndex) => {
            const qBox = document.createElement("div");
            qBox.className = "p-4 rounded-xl bg-brand-card/40 border border-brand-border space-y-3";

            const userSelected = savedAnswers[q.id];

            let optionsHtml = "";
            q.options.forEach((opt, optIdx) => {
                let btnClass = "border-brand-border bg-brand-dark/70 text-slate-300 hover:border-brand-amber/50";
                if (userSelected !== undefined) {
                    if (optIdx === q.correctIndex) {
                        btnClass = "border-brand-green bg-brand-green/10 text-brand-green font-semibold";
                    } else if (optIdx === userSelected) {
                        btnClass = "border-red-500 bg-red-500/10 text-red-400";
                    }
                }

                optionsHtml += `
                    <button class="quiz-opt-btn w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${btnClass}" data-qid="${q.id}" data-optidx="${optIdx}">
                        <span class="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-brand-card border border-brand-border">
                            ${String.fromCharCode(65 + optIdx)}
                        </span>
                        <span class="flex-1">${opt}</span>
                    </button>
                `;
            });

            let feedbackHtml = "";
            if (userSelected !== undefined) {
                const isCorrect = (userSelected === q.correctIndex);
                feedbackHtml = `
                    <div class="p-3 rounded-lg text-xs mt-2 ${isCorrect ? "bg-brand-green/10 text-brand-green border border-brand-green/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}">
                        ${isCorrect ? "✓ " : "✕ "}${q.explanation}
                    </div>
                `;
            }

            qBox.innerHTML = `
                <div class="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span class="text-brand-amber">Câu ${qIndex + 1}:</span> ${q.question}
                </div>
                <div class="space-y-2 mt-2">
                    ${optionsHtml}
                </div>
                ${feedbackHtml}
            `;

            // Attach listeners
            qBox.querySelectorAll(".quiz-opt-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const qId = btn.getAttribute("data-qid");
                    const optIdx = parseInt(btn.getAttribute("data-optidx"));

                    if (!learnerProgress.stageData["stage-1"].quizAnswers) {
                        learnerProgress.stageData["stage-1"].quizAnswers = {};
                    }
                    learnerProgress.stageData["stage-1"].quizAnswers[qId] = optIdx;

                    // Calculate score
                    let correctCount = 0;
                    stage.quizzes.forEach(item => {
                        if (learnerProgress.stageData["stage-1"].quizAnswers[item.id] === item.correctIndex) {
                            correctCount++;
                        }
                    });

                    learnerProgress.stageData["stage-1"].score = correctCount;
                    learnerProgress.stageData["stage-1"].passed = (correctCount === stage.quizzes.length);

                    saveLearnerProgress();
                    renderStage1Quiz(stage, learnerProgress.stageData["stage-1"]);
                });
            });

            quizItemsContainer.appendChild(qBox);
        });

        // Score badge update
        const total = stage.quizzes.length;
        const score = stageData.score || 0;
        if (stageData.passed) {
            quizScoreBadge.textContent = `Xuất sắc: ${score}/${total} Đúng`;
            quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-green/20 text-brand-green font-bold border border-brand-green/30";
        } else if (Object.keys(savedAnswers).length > 0) {
            quizScoreBadge.textContent = `Điểm: ${score}/${total} (Chọn lại để đạt 100%)`;
            quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-amber/20 text-brand-amber font-bold border border-brand-amber/30";
        } else {
            quizScoreBadge.textContent = "Chưa làm";
            quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-card text-brand-amber font-mono font-bold border border-brand-border";
        }
    }

    // 8. STAGE 2: VALUES PICKER
    function renderStage2Values(stage, stageData) {
        valuesGrid.innerHTML = "";
        const selected = stageData.selectedValues || [];

        stage.valueOptions.forEach(val => {
            const isSelected = selected.includes(val);
            const card = document.createElement("button");
            card.type = "button";
            card.className = `p-3.5 rounded-xl border text-left text-xs font-semibold transition-all relative flex flex-col justify-between h-20 ${
                isSelected
                    ? "bg-brand-amber/15 border-brand-amber text-brand-amber shadow-md shadow-amber-500/10"
                    : "bg-brand-card/50 border-brand-border text-slate-300 hover:border-slate-500"
            }`;

            card.innerHTML = `
                <span>${val}</span>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-brand-border/30 text-[10px]">
                    <span class="text-slate-500">Me Value</span>
                    ${isSelected ? '<span class="font-bold text-brand-amber">✓ Đã chọn</span>' : '<span class="text-slate-500">+ Chọn</span>'}
                </div>
            `;

            card.addEventListener("click", () => {
                let cur = learnerProgress.stageData["stage-2"].selectedValues || [];
                if (cur.includes(val)) {
                    cur = cur.filter(item => item !== val);
                } else {
                    if (cur.length >= 3) {
                        alert("Bạn chỉ được chọn tối đa 3 giá trị làm La bàn cốt lõi nhất!");
                        return;
                    }
                    cur.push(val);
                }
                learnerProgress.stageData["stage-2"].selectedValues = cur;
                saveLearnerProgress();
                renderStage2Values(stage, learnerProgress.stageData["stage-2"]);
            });

            valuesGrid.appendChild(card);
        });

        valuesCountBadge.textContent = `${selected.length}/3 Đã chọn`;
        if (selected.length === 3) {
            valuesCountBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-green/20 text-brand-green font-bold border border-brand-green/30";
        } else {
            valuesCountBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-amber/20 text-brand-amber font-bold border border-brand-amber/30";
        }
    }

    // 9. STAGE 3: ABCDE WORKSHEET
    function renderStage3Abcde(stage, stageData) {
        abcdeStepsContainer.innerHTML = "";
        const abcdeState = stageData.abcde || { A: "", B: "", C: "", D: "", E: "" };

        stage.abcdeSteps.forEach(step => {
            const stepBox = document.createElement("div");
            const isDispute = (step.key === "D");

            stepBox.className = `p-4 rounded-xl border transition-all ${
                isDispute
                    ? "bg-brand-card border-brand-amber/70 shadow-lg shadow-amber-500/10"
                    : "bg-brand-card/40 border-brand-border"
            }`;

            stepBox.innerHTML = `
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-xs font-bold ${isDispute ? "text-brand-amber" : "text-slate-200"}">
                        ${step.name}
                    </span>
                    ${isDispute ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-amber text-black uppercase tracking-wider">Trọng tâm chuyển hóa</span>' : ''}
                </div>
                <p class="text-[11px] text-slate-400 mb-2">${step.hint}</p>
                <textarea rows="2" class="abcde-input w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-amber transition-colors" data-step="${step.key}" placeholder="${step.placeholder}">${abcdeState[step.key] || ""}</textarea>
            `;

            stepBox.querySelector(".abcde-input").addEventListener("input", (e) => {
                const k = e.target.getAttribute("data-step");
                if (!learnerProgress.stageData["stage-3"].abcde) {
                    learnerProgress.stageData["stage-3"].abcde = {};
                }
                learnerProgress.stageData["stage-3"].abcde[k] = e.target.value;
                debouncedSave();
            });

            abcdeStepsContainer.appendChild(stepBox);
        });
    }

    // 10. REFLECTION ESSAY LISTENER
    reflectionInput.addEventListener("input", () => {
        reflectionCharCount.textContent = `${reflectionInput.value.length} ký tự`;
        const currentStageId = curriculum.stages[currentStageIndex].id;
        learnerProgress.stageData[currentStageId].reflection = reflectionInput.value;
        debouncedSave();
    });

    let saveTimeout = null;
    function debouncedSave() {
        saveStatusIndicator.textContent = "Đang lưu...";
        saveStatusIndicator.className = "text-brand-amber";
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveLearnerProgress();
        }, 600);
    }

    btnManualSave.addEventListener("click", () => {
        saveLearnerProgress();
        alert("Tiến độ và bài làm của bạn đã được lưu an toàn!");
    });

    // 11. NAVIGATION CONTROLS
    btnPrevLesson.addEventListener("click", () => {
        if (currentStageIndex > 0) {
            currentStageIndex--;
            loadStage(currentStageIndex);
            renderSyllabus();
        }
    });

    btnNextLesson.addEventListener("click", () => {
        const curStageId = curriculum.stages[currentStageIndex].id;

        // Validation before advance
        if (curStageId === "stage-1" && !learnerProgress.stageData["stage-1"].passed) {
            if (!confirm("Bạn chưa hoàn thành đúng 100% phần trắc nghiệm phản xạ. Bạn có muốn tiếp tục sang chặng sau không?")) {
                return;
            }
        }

        if (curStageId === "stage-2") {
            const vals = learnerProgress.stageData["stage-2"].selectedValues || [];
            if (vals.length === 0) {
                alert("Vui lòng chọn ít nhất 1 giá trị cốt lõi (Me Value) để làm la bàn trước khi tiếp tục!");
                return;
            }
        }

        // Mark completed
        if (!learnerProgress.completedStages.includes(curStageId)) {
            learnerProgress.completedStages.push(curStageId);
        }

        saveLearnerProgress();
        updateGlobalProgress();

        if (currentStageIndex < curriculum.stages.length - 1) {
            currentStageIndex++;
            loadStage(currentStageIndex);
            renderSyllabus();
        } else {
            // Completed all stages!
            renderSyllabus();
            completionModal.classList.remove("hidden");
        }
    });

    btnCloseCompletion.addEventListener("click", () => {
        completionModal.classList.add("hidden");
    });

    function updateGlobalProgress() {
        const completed = learnerProgress.completedStages.length;
        const total = curriculum.stages.length;
        const pct = Math.round((completed / total) * 100);

        globalProgressBar.style.width = `${pct}%`;
        globalProgressText.textContent = `${pct}% (${completed}/${total} Chặng)`;
    }

    // 12. TAB SWITCHING
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => {
                b.classList.remove("active");
                b.classList.remove("text-brand-amber");
                b.classList.add("text-slate-400");
                b.classList.add("border-transparent");
            });

            btn.classList.add("active");
            btn.classList.add("text-brand-amber");
            btn.classList.remove("text-slate-400");
            btn.classList.remove("border-transparent");

            const target = btn.getAttribute("data-tab");
            tabContents.forEach(c => {
                if (c.id === target) {
                    c.classList.remove("hidden");
                } else {
                    c.classList.add("hidden");
                }
            });
        });
    });

    // 13. MOBILE SIDEBAR TOGGLE
    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("-translate-x-full");
        sidebarBackdrop.classList.toggle("hidden");
    });

    sidebarBackdrop.addEventListener("click", () => {
        closeMobileSidebar();
    });

    function closeMobileSidebar() {
        sidebar.classList.add("-translate-x-full");
        sidebarBackdrop.classList.add("hidden");
    }

    // START
    initAuth();
});
