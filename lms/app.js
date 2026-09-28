// Delivering Happiness Movement (DHM) — Modern Course Player Engine
// Supports Authorized Roster Auth, Password & Phone PIN, IAM Reflection Framework, Two-Column Course Navigation, Quiz, Value Picker, ABCDE Worksheet & Google Sheets Webhook Sync

document.addEventListener("DOMContentLoaded", () => {
    // 1. EMBEDDED CURRICULUM FALLBACK (Ensures 100% offline/CDN resilience)
    const DEFAULT_CURRICULUM = {
        courseTitle: "Delivering Happiness Movement (DHM) — Micro-Learning Journey",
        stages: [
            {
                id: "stage-1",
                stageNumber: 1,
                title: "Khoa Học Hạnh Phúc & 3 Cấp Độ",
                subtitle: "Thú vui (Pleasure) → Đam mê (Passion) → Mục đích cao cả (Higher Purpose)",
                instructor: "Giảng viên Vũ",
                estimatedMinutes: 25,
                videoTitle: "Bài Giảng: 3 Cấp Độ Hạnh Phúc Theo Martin Seligman & Ẩn Dụ 3 Tầng Lầu",
                videoDuration: "06:30",
                videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                summaryText: "Mọi hành động con người đều hội tụ về đích đến là Hạnh phúc (Aristotle). Tuy nhiên, não bộ rất nhanh thích nghi với Thú vui ngắn hạn do cơ chế thích nghi khoái lạc (Hedonic Adaptation). Để bền vững, ta cần nâng cấp lên trạng thái Phiêu (Passion / Flow) và Mục đích cao cả (Higher Purpose) khi cống hiến cho điều lớn lao hơn bản thân.",
                insights: [
                    { title: "Cấp độ 1: Thú vui (Pleasure)", desc: "Nhanh nguội lạnh do cơ chế thích nghi khoái lạc. Tiền bạc, tiện nghi vật chất chỉ đem lại thỏa mãn nhất thời." },
                    { title: "Cấp độ 2: Đam mê (Passion / Flow)", desc: "Trạng thái Dòng chảy (Flow) khi tập trung giải quyết thử thách phù hợp với năng lực. Thời gian như ngừng trôi." },
                    { title: "Cấp độ 3: Mục đích cao cả (Higher Purpose)", desc: "Cấp độ bền vững nhất. Thấy công việc của mình có ý nghĩa, phụng sự và đóng góp giá trị cho cộng đồng." }
                ],
                quizzes: [
                    {
                        id: "q1",
                        question: "Theo nghiên cứu của Martin Seligman và triết lý DHM, cấp độ hạnh phúc nào có tính bền vững lâu dài nhất?",
                        options: [
                            "Thú vui (Pleasure) từ việc sở hữu vật chất (mua xe mới, mua điện thoại mới)",
                            "Đam mê (Passion) khi tập trung cao độ vào công việc yêu thích",
                            "Mục đích cao cả (Higher Purpose / Meaning) khi thấy mình là một phần của điều gì đó lớn lao hơn bản thân",
                            "Niềm vui sau mỗi bữa tiệc tùng cuối tuần"
                        ],
                        correctIndex: 2,
                        explanation: "Chính xác! Thú vui nguội lạnh rất nhanh do hiện tượng thích nghi tâm lý. Chỉ khi gắn với Mục đích cao cả (Higher Purpose), cảm giác hạnh phúc mới duy trì bền vững."
                    },
                    {
                        id: "q2",
                        question: "Ẩn dụ 'Ba tầng lầu' của Phong Tử Khải tương ứng thế nào với 3 cấp độ hạnh phúc?",
                        options: [
                            "Tầng 1: Đam mê — Tầng 2: Vật chất — Tầng 3: Danh vọng",
                            "Tầng 1: Đời sống vật chất (Thú vui) — Tầng 2: Đời sống tinh thần (Đam mê) — Tầng 3: Đời sống tâm hồn (Mục đích cao cả)",
                            "Tầng 1: Gia đình — Tầng 2: Bạn bè — Tầng 3: Công việc",
                            "Tầng 1: Kiến thức — Tầng 2: Kỹ năng — Tầng 3: Thái độ"
                        ],
                        correctIndex: 1,
                        explanation: "Đúng! Đời người có ba tầng lầu: Tầng 1 là vật chất (thú vui), Tầng 2 là tinh thần (đam mê sáng tạo), Tầng 3 là tâm hồn (mục đích cao cả cống hiến)."
                    }
                ],
                iam: {
                    I: "Bạn tâm đắc nhất với điều gì từ nội dung 3 Cấp độ Hạnh phúc & Ẩn dụ 3 Tầng Lầu của Phong Tử Khải?",
                    A: "Bạn sẽ áp dụng điều này như thế nào để chuyển dịch dần từ Thú vui ngắn hạn (Pleasure) sang Đam mê (Passion) và Mục đích cao cả (Higher Purpose)?",
                    M: "Tại sao nhận thức này lại có ý nghĩa sâu sắc đối với bạn ở thời điểm hiện tại?"
                }
            },
            {
                id: "stage-2",
                stageNumber: 2,
                title: "Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc",
                subtitle: "Cảm giác Kết nối • Cảm giác Tự chủ • Cảm giác Tiến bộ & La Bàn Me–We",
                instructor: "Giảng viên Châu & Vũ",
                estimatedMinutes: 30,
                videoTitle: "Bài Giảng: Khi Đồng Hồ Bận Rộn Lấn Át Chiếc La Bàn Cuộc Đời & 3 Đòn Bẩy SDT",
                videoDuration: "08:15",
                videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                summaryText: "Thuyết Tự Quyết (Self-Determination Theory - Deci & Ryan, 2000) khẳng định 3 nhu cầu tâm lý cốt lõi tạo nên động lực nội tại (Intrinsic Motivation) và hạnh phúc bền vững ở nơi làm việc: Cảm giác Kết nối, Cảm giác Tự chủ, và Cảm giác Tiến bộ. Chiếc Đồng hồ đại diện cho lịch trình bận rộn; Chiếc La bàn đại diện cho giá trị cốt lõi Me-We dẫn lối.",
                insights: [
                    {
                        title: "Đòn bẩy #1: Cảm giác Kết nối",
                        desc: "Sống hoà ái với bản thân, với người khác và với thiên nhiên. Xây dựng môi trường an toàn tâm lý và sự đồng cảm chân thành trong đội ngũ."
                    },
                    {
                        title: "Đòn bẩy #2: Cảm giác Tự chủ",
                        desc: "Khả năng là gì nếu không sợ? Quyền tự chủ trong hành động, can đảm lựa chọn và ra quyết định nhất quán theo La bàn giá trị cốt lõi."
                    },
                    {
                        title: "Đòn bẩy #3: Cảm giác Tiến bộ",
                        desc: "Tiến bộ là cảm giác tiến lên phía trước. Khi tích lũy kỹ năng mới & đạt Chiến thắng Nhỏ (Small Wins), não giải phóng Dopamine tự nhiên, tạo Cảm giác Tự hào Bản thân — nền tảng của Hạnh phúc Bền vững (Eudaimonia). Thiếu tiến bộ sẽ rơi vào Bất lực tích tụ (Learned Helplessness)."
                    }
                ],
                valueOptions: [
                    "Chân thật & Trung thực (Integrity)",
                    "Học hỏi & Đổi mới liên tục (Continuous Learning)",
                    "Đồng hành & Tận tâm (Commitment & Empathy)",
                    "Gia đình & Bình an (Family & Peace)",
                    "Tự do & Sáng tạo (Freedom & Creativity)",
                    "Vị nhân & Cống hiến (Altruism & Service)",
                    "Hiệu suất & Xuất sắc (Excellence)",
                    "Lạc quan & Niềm vui sống (Optimism & Joy)"
                ],
                iam: {
                    I: "Trong 3 Đòn bẩy (Cảm giác Kết nối, Cảm giác Tự chủ, Cảm giác Tiến bộ), đòn bẩy nào bạn thấy tâm đắc nhất và vì sao?",
                    A: "Bạn sẽ thiết lập Chiến thắng Nhỏ (Small Wins) nào trong tuần này để nuôi dưỡng cảm giác tiến bộ tự thân mỗi ngày?",
                    M: "Tại sao đòn bẩy và 3 giá trị La Bàn bạn vừa chọn lại có ý nghĩa then chốt đối với sự phát triển cá nhân và đội ngũ của bạn?"
                }
            },
            {
                id: "stage-3",
                stageNumber: 3,
                title: "Chuyển Hóa Nghịch Cảnh: Framework ABCDE",
                subtitle: "Kỹ thuật phản biện niềm tin giới hạn để kiến tạo hành động tích cực",
                instructor: "Giảng viên Vũ",
                estimatedMinutes: 35,
                videoTitle: "Bài Giảng: Cơ Chế A→B→C & Kỹ Thuật Phản Biện Chữ D (Stop-Breathe-Ask)",
                videoDuration: "09:40",
                videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
                summaryText: "Lạc quan không phải là ảo tưởng màu hồng phớt lờ thực tế. Lạc quan theo khoa học là tối ưu hóa các lựa chọn hành động dựa trên mô hình ABCDE của Martin Seligman. Nghịch cảnh (A) kích hoạt Niềm tin tiêu cực tự động (B) sinh ra Hậu quả tê liệt (C). Chìa khóa chuyển hóa nằm ở chữ D (Dispute - Phản biện lý trí bằng Stop-Breathe-Ask) để mở ra Hành động tích cực mới (E).",
                insights: [
                    { title: "A - B - C là cơ chế tự động", desc: "Khi sự cố xảy ra, não bộ sinh tồn có xu hướng thổi phồng thảm họa và tự phán xét bản thân tiêu cực." },
                    { title: "D - Dispute là kỹ năng ý thức", desc: "Thực hành 'Stop - Breathe - Ask': Niềm tin B có đúng 100% không? Bằng chứng ngược lại là gì? Có góc nhìn khách quan nào khác?" },
                    { title: "E - Effect & Action là sức bật", desc: "Chuyển hóa năng lượng lo âu thành hành động cụ thể, dù là hành động nhỏ nhất để tái lập quyền kiểm soát bối cảnh." }
                ],
                abcdeSteps: [
                    { key: "A", name: "A — Adversity (Nghịch cảnh)", hint: "Sự việc khó khăn, thất bại hoặc tình huống gây áp lực cụ thể vừa xảy ra là gì?", placeholder: "Ví dụ: Dự án bị trễ hạn, khách hàng phàn nàn gay gắt..." },
                    { key: "B", name: "B — Belief (Niềm tin tự động)", hint: "Tiếng nói tiêu cực, phán xét tự động trong đầu bạn lúc đó là gì?", placeholder: "Ví dụ: Mình là người thất bại, sếp sẽ không bao giờ tin tưởng mình nữa..." },
                    { key: "C", name: "C — Consequence (Hậu quả cảm xúc)", hint: "Cảm xúc và phản ứng tiêu cực ban đầu của bạn là gì?", placeholder: "Ví dụ: Lo sợ, tim đập nhanh, thu mình lại, muốn bỏ cuộc..." },
                    { key: "D", name: "D — Dispute (Phản biện lý trí - QUAN TRỌNG NHẤT)", hint: "Áp dụng 'Stop - Breathe - Ask': Niềm tin B có thật sự đúng 100% không? Có góc nhìn khách quan nào khác?", placeholder: "Ví dụ: Đây chỉ là sự cố kỹ thuật khách quan, các phần khác vẫn tốt. Khách phàn nàn vì họ cần việc gấp, không phải ghét cá nhân mình..." },
                    { key: "E", name: "E — Effect & Action (Hành động tích cực mới)", hint: "Cảm xúc mới sau khi phản biện là gì? Bạn sẽ làm hành động cụ thể nào ngay bây giờ?", placeholder: "Ví dụ: Cảm thấy bình tĩnh lại. Hành động: Gọi điện xin lỗi khách và gửi lộ trình xử lý trong 2 tiếng tới..." }
                ],
                iam: {
                    I: "Bạn tâm đắc nhất với nguyên lý nào trong cơ chế A→B→C→D→E của Martin Seligman?",
                    A: "Khi gặp một tình huống áp lực tiếp theo trong công việc, bạn sẽ thực hiện kỹ năng Stop - Breathe - Ask ở chữ D như thế nào?",
                    M: "Khả năng làm chủ chữ D mang lại ý nghĩa gì cho sự bình an nội tại và năng lực vượt khó của bạn?"
                }
            }
        ]
    };

    // 2. STATE OBJECT
    let curriculum = DEFAULT_CURRICULUM;
    let currentStageIndex = 0;
    let currentUser = null;
    let authorizedRoster = [];

    let learnerProgress = {
        completedStages: [],
        stageData: {
            "stage-1": { quizAnswers: {}, score: 0, passed: false, iam: { I: "", A: "", M: "" }, reflection: "" },
            "stage-2": { selectedValues: [], iam: { I: "", A: "", M: "" }, reflection: "" },
            "stage-3": { abcde: { A: "", B: "", C: "", D: "", E: "" }, iam: { I: "", A: "", M: "" }, reflection: "" }
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

    // Auth Elements
    const authModal = document.getElementById("auth-modal");
    const authForm = document.getElementById("auth-form");
    const loginIdentityInput = document.getElementById("login-identity");
    const loginPasswordInput = document.getElementById("login-password");
    const passwordGroup = document.getElementById("password-group");
    const phoneOnboardingGroup = document.getElementById("phone-onboarding-group");
    const onboardingPhoneInput = document.getElementById("onboarding-phone");
    const passwordGuide = document.getElementById("password-guide");
    const btnSubmitText = document.getElementById("btn-submit-text");
    const btnTogglePwd = document.getElementById("btn-toggle-pwd");
    const authErrorBanner = document.getElementById("auth-error-banner");
    const authErrorTitle = document.getElementById("auth-error-title");
    const authErrorDesc = document.getElementById("auth-error-desc");
    const authUserDetected = document.getElementById("auth-user-detected");
    const detectedUserName = document.getElementById("detected-user-name");
    const detectedUserCohort = document.getElementById("detected-user-cohort");

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

    // IAM Reflection Elements
    const promptLabelI = document.getElementById("prompt-label-i");
    const promptLabelA = document.getElementById("prompt-label-a");
    const promptLabelM = document.getElementById("prompt-label-m");
    const reflectionI = document.getElementById("reflection-i");
    const reflectionA = document.getElementById("reflection-a");
    const reflectionM = document.getElementById("reflection-m");
    const countI = document.getElementById("count-i");
    const countA = document.getElementById("count-a");
    const countM = document.getElementById("count-m");
    const saveStatusIndicator = document.getElementById("save-status-indicator");

    // Bottom Navigation
    const btnPrevLesson = document.getElementById("btn-prev-lesson");
    const btnNextLesson = document.getElementById("btn-next-lesson");
    const btnManualSave = document.getElementById("btn-manual-save");

    // 4. PHONE & IDENTITY NORMALIZATION UTILS
    function normalizePhone(str) {
        if (!str) return "";
        let digits = String(str).replace(/\D/g, "");
        if (digits.startsWith("84") && digits.length > 8) {
            digits = "0" + digits.slice(2);
        } else if (digits.length === 9 && !digits.startsWith("0")) {
            digits = "0" + digits;
        }
        return digits;
    }

    function normalizeIdentity(val) {
        if (!val) return "";
        const trimmed = val.trim();
        if (trimmed.includes("@")) {
            return trimmed.toLowerCase();
        }
        return normalizePhone(trimmed);
    }

    // 5. ROSTER INITIALIZATION & AUTHENTICATION
    async function loadRoster() {
        try {
            const res = await fetch("/lms/authorized_roster.json");
            if (res.ok) {
                authorizedRoster = await res.json();
            }
        } catch (e) {
            console.warn("Could not fetch remote roster, using local fallback if needed", e);
        }

        // Built-in fallback if roster empty (ensures test & BTC always work)
        if (!authorizedRoster || authorizedRoster.length === 0) {
            authorizedRoster = [
                { name: "Vũ Hoàng", email: "vuhoang2708@gmail.com", phone: "0912345678", cohort: "BTC / Coach", role: "Coach" },
                { name: "Hà Ngọc Hoàn", email: "chauhm71@gmail.com", phone: "0913503505", cohort: "BTC / Coach", role: "Coach" },
                { name: "Nguyễn Văn Hoàn", email: "hoanhn.edu.vn@gmail.com", phone: "0988888888", cohort: "BTC / Coach", role: "Coach" },
                { name: "Học viên Test", email: "hocvien.test@gmail.com", phone: "0901234567", cohort: "DHM_Test", role: "Learner" }
            ];
        }
    }

    function getRosterOverrides() {
        try {
            return JSON.parse(localStorage.getItem("dhm_roster_overrides") || "{}");
        } catch (e) {
            return {};
        }
    }

    function findLearner(rawIdentity) {
        const norm = (rawIdentity || "").trim().toLowerCase();
        if (!norm) return null;

        const base = authorizedRoster.find(item => {
            const itemEmail = (item.email || "").toLowerCase().trim();
            return itemEmail === norm;
        });

        if (!base) return null;

        // Apply local roster overrides (e.g. newly onboarded phone)
        const overrides = getRosterOverrides();
        if (overrides[norm] && overrides[norm].phone) {
            return Object.assign({}, base, { phone: overrides[norm].phone });
        }
        return base;
    }

    function updateAuthModeForLearner(learner) {
        if (!learner) {
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
            if (passwordGuide) passwordGuide.classList.remove("hidden");
            if (loginPasswordInput) loginPasswordInput.setAttribute("required", "required");
            if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
            return;
        }

        const normPhone = normalizePhone(learner.phone);
        // If learner has no valid phone (missing or less than 4 digits)
        if (!normPhone || normPhone.length < 4) {
            if (passwordGroup) passwordGroup.classList.add("hidden");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.remove("hidden");
            if (passwordGuide) passwordGuide.classList.add("hidden");
            if (loginPasswordInput) loginPasswordInput.removeAttribute("required");
            if (onboardingPhoneInput) onboardingPhoneInput.setAttribute("required", "required");
            if (btnSubmitText) btnSubmitText.textContent = "Kích Hoạt & Vào Học Ngay";
        } else {
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
            if (passwordGuide) passwordGuide.classList.remove("hidden");
            if (loginPasswordInput) loginPasswordInput.setAttribute("required", "required");
            if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
        }
    }

    function verifyPassword(learner, inputPassword) {
        const p = (inputPassword || "").trim();
        if (!p) return false;

        // Coach PIN fallback
        if ((learner.role === "Coach" || (learner.cohort && learner.cohort.includes("BTC"))) && p === "1979") {
            return true;
        }

        // Standard authentication: 4 last digits of registered phone number
        const normPhone = normalizePhone(learner.phone);
        if (normPhone && normPhone.length >= 4) {
            const last4 = normPhone.slice(-4);
            if (p === last4) return true;
        }

        return false;
    }

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

    // Real-time identification helper as user types email
    loginIdentityInput.addEventListener("input", () => {
        const val = loginIdentityInput.value.trim().toLowerCase();
        if (val.includes("@") && val.length >= 5) {
            const matched = findLearner(val);
            if (matched) {
                detectedUserName.textContent = matched.name;
                detectedUserCohort.textContent = matched.cohort;
                authUserDetected.classList.remove("hidden");
                authErrorBanner.classList.add("hidden");
                updateAuthModeForLearner(matched);
                return;
            }
        }
        authUserDetected.classList.add("hidden");
        updateAuthModeForLearner(null);
    });

    // Toggle password reveal
    btnTogglePwd.addEventListener("click", () => {
        if (loginPasswordInput.type === "password") {
            loginPasswordInput.type = "text";
            btnTogglePwd.textContent = "🙈 Ẩn mật khẩu";
        } else {
            loginPasswordInput.type = "password";
            btnTogglePwd.textContent = "👁️ Hiện mật khẩu";
        }
    });

    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const rawIdentity = loginIdentityInput.value.trim().toLowerCase();
        if (!rawIdentity) return;

        const learner = findLearner(rawIdentity);

        if (!learner) {
            authErrorTitle.textContent = "Không tìm thấy email học viên";
            authErrorDesc.innerHTML = `Email <strong>"${rawIdentity}"</strong> chưa có trong danh sách học viên Delivering Happiness Masterclass. Vui lòng kiểm tra lại email đã đăng ký hoặc liên hệ Zalo BTC (0913.503.505) để được kích hoạt.`;
            authErrorBanner.classList.remove("hidden");
            return;
        }

        const normPhone = normalizePhone(learner.phone);
        const isMissingPhone = !normPhone || normPhone.length < 4;

        if (isMissingPhone) {
            // Validate Onboarding Phone
            const rawPhone = (onboardingPhoneInput ? onboardingPhoneInput.value : "").trim();
            const cleanP = normalizePhone(rawPhone);

            // Valid VN phone: exactly 10 digits starting with 0 (03, 05, 07, 08, 09)
            const isValidVnPhone = /^0[35789]\d{8}$/.test(cleanP);
            if (!isValidVnPhone) {
                authErrorTitle.textContent = "Số điện thoại chưa hợp lệ";
                authErrorDesc.innerHTML = `Vui lòng nhập chính xác <strong>10 chữ số</strong> của số điện thoại Việt Nam (ví dụ: 0912345678, bắt đầu bằng 03, 05, 07, 08, 09) để kích hoạt tài khoản.`;
                authErrorBanner.classList.remove("hidden");
                if (onboardingPhoneInput) onboardingPhoneInput.focus();
                return;
            }

            // Save phone to overrides in localStorage
            const overrides = getRosterOverrides();
            overrides[rawIdentity] = {
                phone: cleanP,
                name: learner.name,
                updated_at: new Date().toISOString()
            };
            try {
                localStorage.setItem("dhm_roster_overrides", JSON.stringify(overrides));
            } catch (err) {
                console.warn("Could not save roster override", err);
            }

            // Update learner's phone
            learner.phone = cleanP;

            // Trigger background webhook sync to Google Apps Script
            try {
                fetch(GOOGLE_APPS_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        action: "update_phone",
                        email: learner.email,
                        name: learner.name,
                        phone: cleanP,
                        cohort: learner.cohort || "DHM9",
                        timestamp: new Date().toISOString()
                    })
                }).catch(err => console.warn("Background phone sync error:", err));
            } catch (err) {
                console.warn("Background phone sync failed:", err);
            }
        } else {
            // Normal authentication: check password (last 4 digits of phone)
            const rawPassword = loginPasswordInput.value.trim();
            if (!rawPassword) {
                authErrorTitle.textContent = "Thiếu mật khẩu truy cập";
                authErrorDesc.innerHTML = `Vui lòng nhập mật khẩu là <strong>4 số cuối của Số điện thoại</strong> bạn đã đăng ký với Ban tổ chức.`;
                authErrorBanner.classList.remove("hidden");
                loginPasswordInput.focus();
                return;
            }

            if (!verifyPassword(learner, rawPassword)) {
                authErrorTitle.textContent = "Mật khẩu chưa chính xác";
                authErrorDesc.innerHTML = `Mật khẩu là <strong>4 số cuối của Số điện thoại</strong> bạn đã đăng ký với Ban tổ chức. Vui lòng thử lại hoặc liên hệ Zalo BTC (0913.503.505).`;
                authErrorBanner.classList.remove("hidden");
                return;
            }
        }

        // Login Success
        authErrorBanner.classList.add("hidden");
        currentUser = {
            name: learner.name,
            identity: learner.email || learner.phone,
            email: learner.email,
            phone: learner.phone,
            cohort: learner.cohort,
            role: learner.role || "Learner",
            loginTime: new Date().toISOString()
        };

        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
        hideAuthModal();
        applyUserSession();
    });

    btnLogout.addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) {
            localStorage.removeItem("dhm_lms_auth_user");
            currentUser = null;
            userChip.classList.add("hidden");
            loginIdentityInput.value = "";
            loginPasswordInput.value = "";
            if (onboardingPhoneInput) onboardingPhoneInput.value = "";
            authUserDetected.classList.add("hidden");
            authErrorBanner.classList.add("hidden");
            updateAuthModeForLearner(null);
            showAuthModal();
        }
    });

    function applyUserSession() {
        if (!currentUser) return;

        userDisplayName.textContent = `${currentUser.name} (${currentUser.cohort || "Học viên"})`;
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

        // Ensure IAM structure exists in all stages
        ["stage-1", "stage-2", "stage-3"].forEach(sid => {
            if (!learnerProgress.stageData[sid]) {
                learnerProgress.stageData[sid] = {};
            }
            if (!learnerProgress.stageData[sid].iam) {
                // Migrate legacy single reflection if present
                const legacy = learnerProgress.stageData[sid].reflection || "";
                learnerProgress.stageData[sid].iam = { I: legacy, A: "", M: "" };
            }
        });

        renderSyllabus();
        loadStage(currentStageIndex);
        updateGlobalProgress();
    }

    function saveLearnerProgress() {
        if (!currentUser) return;
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        localStorage.setItem(progressKey, JSON.stringify(learnerProgress));

        // Push to global registry for coach portal viewing
        recordLearnerInDirectory();

        // Sync to Google Sheets via Webhook
        syncToGoogleSheets();

        saveStatusIndicator.textContent = "✓ Đã tự động lưu & đồng bộ";
        saveStatusIndicator.className = "text-brand-green font-medium";
        setTimeout(() => {
            saveStatusIndicator.textContent = "Đã lưu";
        }, 2000);
    }

    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxMi_bQBceGxVK_TjbcU5rQNAaLyUXOMuQJHyYWCwdeoWlsccq2kFkhRYVG2meySCsPdA/exec";

    function syncToGoogleSheets() {
        if (!currentUser) return;

        const s3 = learnerProgress.stageData["stage-3"]?.abcde || {};
        const s2 = learnerProgress.stageData["stage-2"]?.selectedValues || [];
        const s1 = learnerProgress.stageData["stage-1"] || {};

        const emailVal = currentUser.email || (currentUser.identity.includes("@") ? currentUser.identity : `${currentUser.identity}@dhm.vn`);
        const phoneVal = currentUser.phone || currentUser.identity;

        const payload = {
            action: "submit_abcde",
            full_name: currentUser.name,
            email: emailVal,
            phone: phoneVal,
            cohort: currentUser.cohort || "DHM_LMS",
            selected_values: s2.join(", "),
            stage1_passed: s1.passed ? "Pass" : "Not yet",
            completed_stages_count: learnerProgress.completedStages.length,
            iam_stage1: JSON.stringify(learnerProgress.stageData["stage-1"]?.iam || {}),
            iam_stage2: JSON.stringify(learnerProgress.stageData["stage-2"]?.iam || {}),
            iam_stage3: JSON.stringify(learnerProgress.stageData["stage-3"]?.iam || {}),
            a_adversity: s3.A || "",
            b_belief: s3.B || "",
            c_consequence: s3.C || "",
            d_dispute: s3.D || "",
            e_energy_action: s3.E || "",
            timestamp: new Date().toISOString()
        };

        try {
            fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).then(() => {
                console.log("✓ Webhook synced to Google Sheets successfully");
            }).catch(err => {
                console.warn("Webhook background sync notice (may be offline)", err);
            });
        } catch (e) {
            console.warn("Webhook sync error", e);
        }
    }

    function recordLearnerInDirectory() {
        if (!currentUser) return;
        const REGISTRY_KEY = "dhm_lms_all_learners_directory";
        let directory = [];
        try {
            const raw = localStorage.getItem(REGISTRY_KEY);
            directory = raw ? JSON.parse(raw) : [];
        } catch (e) {
            directory = [];
        }

        const idx = directory.findIndex(l => l.identity === currentUser.identity);
        const learnerRecord = {
            name: currentUser.name,
            identity: currentUser.identity,
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            cohort: currentUser.cohort || "",
            lastActive: new Date().toISOString(),
            completedStagesCount: learnerProgress.completedStages.length,
            stage1Passed: !!learnerProgress.stageData["stage-1"]?.passed,
            stage2ValuesCount: (learnerProgress.stageData["stage-2"]?.selectedValues || []).length,
            stage3AbcdeFilled: !!learnerProgress.stageData["stage-3"]?.abcde?.D,
            data: learnerProgress
        };

        if (idx >= 0) {
            directory[idx] = { ...directory[idx], ...learnerRecord };
        } else {
            directory.push(learnerRecord);
        }

        localStorage.setItem(REGISTRY_KEY, JSON.stringify(directory));
    }

    // 6. SYLLABUS & SIDEBAR NAVIGATION
    function renderSyllabus() {
        syllabusList.innerHTML = "";

        curriculum.stages.forEach((stage, idx) => {
            const isCurrent = (idx === currentStageIndex);
            const isCompleted = learnerProgress.completedStages.includes(stage.id);

            const li = document.createElement("li");

            let borderStyle = isCurrent ? "border-brand-amber bg-brand-amber/10" : "border-brand-border bg-brand-card/40 hover:bg-brand-card/80";
            if (isCompleted && !isCurrent) {
                borderStyle = "border-brand-green/30 bg-brand-green/5 hover:bg-brand-card/60";
            }

            let statusIcon = `<div class="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[11px] font-bold text-slate-400">${idx + 1}</div>`;
            if (isCompleted) {
                statusIcon = `<div class="w-6 h-6 rounded-full bg-brand-green/20 border border-brand-green text-brand-green flex items-center justify-center text-xs font-bold">✓</div>`;
            } else if (isCurrent) {
                statusIcon = `<div class="w-6 h-6 rounded-full bg-brand-amber text-black flex items-center justify-center text-xs font-bold animate-pulse">▶</div>`;
            }

            li.innerHTML = `
                <button class="w-full text-left p-3 rounded-xl border ${borderStyle} transition-all flex items-start gap-3 group" data-stage-idx="${idx}">
                    ${statusIcon}
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                            <span class="font-medium text-brand-amber">Chặng ${stage.stageNumber}</span>
                            <span>${stage.estimatedMinutes} phút</span>
                        </div>
                        <h4 class="text-xs font-bold text-slate-100 truncate group-hover:text-brand-amber transition-colors">${stage.title}</h4>
                        <p class="text-[11px] text-slate-400 truncate mt-0.5">${stage.subtitle}</p>
                    </div>
                </button>
            `;

            li.querySelector("button").addEventListener("click", () => {
                currentStageIndex = idx;
                loadStage(idx);
                renderSyllabus();

                // On mobile, close sidebar after pick
                if (window.innerWidth < 1024) {
                    toggleSidebar(false);
                }
            });

            syllabusList.appendChild(li);
        });

        // Update badge
        sidebarBadgeCompleted.textContent = `${learnerProgress.completedStages.length}/${curriculum.stages.length} Hoàn tất`;
    }

    function toggleSidebar(forceState) {
        const isHidden = sidebar.classList.contains("-translate-x-full");
        const nextState = forceState !== undefined ? forceState : isHidden;

        if (nextState) {
            sidebar.classList.remove("-translate-x-full");
            sidebarBackdrop.classList.remove("hidden");
        } else {
            sidebar.classList.add("-translate-x-full");
            sidebarBackdrop.classList.add("hidden");
        }
    }

    sidebarToggle.addEventListener("click", () => toggleSidebar());
    sidebarBackdrop.addEventListener("click", () => toggleSidebar(false));

    // 7. LESSON LOADER
    function loadStage(stageIdx) {
        currentStageIndex = stageIdx;
        const stage = curriculum.stages[stageIdx];
        if (!stage) return;

        // Reset video to poster state
        videoPoster.classList.remove("hidden");
        videoFrameContainer.classList.add("hidden");
        videoIframe.src = "";

        // Breadcrumbs & Header
        breadcrumbStage.textContent = `Chặng ${stage.stageNumber}`;
        breadcrumbLesson.textContent = stage.title;
        lessonInstructorBadge.textContent = `Giảng viên: ${stage.instructor}`;
        lessonDurationBadge.textContent = `${stage.estimatedMinutes} phút`;
        lessonMainTitle.textContent = stage.title;
        lessonSubtitle.textContent = stage.subtitle;

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

        // Setup 3 Achievements: I • A • M Reflection
        const iamPrompts = stage.iam || {
            I: "Bạn tâm đắc nhất điều gì từ bài học?",
            A: "Bạn sẽ áp dụng điều này vào thực tế như thế nào?",
            M: "Tại sao điều này lại có ý nghĩa quan trọng với bạn?"
        };

        promptLabelI.textContent = `1. Interested — ${iamPrompts.I}`;
        promptLabelA.textContent = `2. Actionable — ${iamPrompts.A}`;
        promptLabelM.textContent = `3. Meaningful — ${iamPrompts.M}`;

        const savedIam = stageData.iam || {};
        reflectionI.value = savedIam.I || "";
        reflectionA.value = savedIam.A || "";
        reflectionM.value = savedIam.M || "";

        countI.textContent = `${reflectionI.value.length} ký tự`;
        countA.textContent = `${reflectionA.value.length} ký tự`;
        countM.textContent = `${reflectionM.value.length} ký tự`;

        // Bottom Navigation Buttons
        btnPrevLesson.disabled = (stageIdx === 0);
        if (stageIdx === curriculum.stages.length - 1) {
            btnNextLesson.innerHTML = `<span>🏆 Hoàn Tất Khóa Học ➔</span>`;
        } else {
            btnNextLesson.innerHTML = `<span>Hoàn thành & Tiếp tục ➔</span>`;
        }
    }

    // 8. STAGE 1: QUIZ ENGINE
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

    // 9. STAGE 2: VALUES PICKER
    function renderStage2Values(stage, stageData) {
        valuesGrid.innerHTML = "";
        const selected = stageData.selectedValues || [];

        stage.valueOptions.forEach(val => {
            const isSelected = selected.includes(val);
            const card = document.createElement("button");

            let cardStyle = isSelected
                ? "border-brand-amber bg-brand-amber/15 text-white shadow-md shadow-amber-500/10"
                : "border-brand-border bg-brand-card/50 text-slate-300 hover:border-slate-500";

            card.className = `p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${cardStyle}`;
            card.innerHTML = `
                <span class="text-xs font-semibold leading-snug">${val}</span>
                <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? "bg-brand-amber text-black" : "border border-brand-border text-transparent"}">
                    ${isSelected ? "✓" : ""}
                </span>
            `;

            card.addEventListener("click", () => {
                let cur = learnerProgress.stageData["stage-2"].selectedValues || [];
                if (cur.includes(val)) {
                    cur = cur.filter(x => x !== val);
                } else {
                    if (cur.length >= 3) {
                        alert("Bạn chỉ được chọn tối đa 3 giá trị cốt lõi để làm chiếc La Bàn chuẩn xác nhất!");
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
    }

    // 10. STAGE 3: ABCDE WORKSHEET
    function renderStage3Abcde(stage, stageData) {
        abcdeStepsContainer.innerHTML = "";
        const savedAbcde = stageData.abcde || {};

        stage.abcdeSteps.forEach(step => {
            const card = document.createElement("div");
            card.className = "p-4 rounded-xl bg-brand-card/40 border border-brand-border space-y-2";

            const isKeyStep = (step.key === "D");
            const keyColor = isKeyStep ? "text-brand-amber" : "text-white";
            const borderColor = isKeyStep ? "border-brand-amber/40 focus:border-brand-amber" : "border-brand-border focus:border-brand-amber";

            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <label class="text-xs font-bold ${keyColor}" for="abcde-${step.key}">
                        ${step.name}
                    </label>
                    ${isKeyStep ? '<span class="text-[10px] px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber font-bold">Kỹ thuật mấu chốt</span>' : ''}
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed">${step.hint}</p>
                <textarea id="abcde-${step.key}" rows="2" class="w-full bg-brand-dark ${borderColor} border rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-amber transition-all" placeholder="${step.placeholder}">${savedAbcde[step.key] || ""}</textarea>
            `;

            card.querySelector("textarea").addEventListener("input", (e) => {
                if (!learnerProgress.stageData["stage-3"].abcde) {
                    learnerProgress.stageData["stage-3"].abcde = {};
                }
                learnerProgress.stageData["stage-3"].abcde[step.key] = e.target.value;
                debouncedSave();
            });

            abcdeStepsContainer.appendChild(card);
        });
    }

    // 11. I • A • M REFLECTION LISTENERS
    function handleIamInput(type, inputElem, countElem) {
        inputElem.addEventListener("input", () => {
            countElem.textContent = `${inputElem.value.length} ký tự`;
            const currentStageId = curriculum.stages[currentStageIndex].id;
            if (!learnerProgress.stageData[currentStageId].iam) {
                learnerProgress.stageData[currentStageId].iam = { I: "", A: "", M: "" };
            }
            learnerProgress.stageData[currentStageId].iam[type] = inputElem.value;
            debouncedSave();
        });
    }

    handleIamInput("I", reflectionI, countI);
    handleIamInput("A", reflectionA, countA);
    handleIamInput("M", reflectionM, countM);

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
        alert("Tiến độ và bài phản tư I • A • M của bạn đã được lưu an toàn!");
    });

    // 12. NAVIGATION CONTROLS
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

    // 13. TAB SWITCHING
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => {
                b.classList.remove("active");
                b.classList.remove("text-brand-amber");
                b.classList.add("text-slate-400");
                b.classList.remove("border-brand-amber");
                b.classList.add("border-transparent");
            });

            btn.classList.add("active");
            btn.classList.remove("text-slate-400");
            btn.classList.add("text-brand-amber");
            btn.classList.remove("border-transparent");
            btn.classList.add("border-brand-amber");

            const targetTab = btn.getAttribute("data-tab");
            tabContents.forEach(content => {
                if (content.id === targetTab || content.id === `tab-${targetTab}`) {
                    content.classList.remove("hidden");
                } else {
                    content.classList.add("hidden");
                }
            });
        });
    });

    // 14. INITIAL BOOTSTRAP
    loadRoster().then(() => {
        initAuth();
    });
});
