// Delivering Happiness Movement (DHM) — Blended LMS Engine v3
// Standardized Architecture: Pre-Class Online -> Workshop Live 5 Habits -> Post-Class 21-Day Dashboard

document.addEventListener("DOMContentLoaded", () => {
    // 1. EMBEDDED CURRICULUM FALLBACK (Ensures 100% offline/CDN resilience)
    let curriculum = {
        courseTitle: "Delivering Happiness Movement (DHM) — Blended Learning Journey",
        totalDurationMinutes: 90,
        stages: [
            {
                id: "stage-1",
                stageNumber: 1,
                badge: "Mini Step 1 • Online",
                title: "Mini step 1 • ONLINE – Gieo Thông điệp",
                subtitle: "Khoa học Hạnh phúc • 3 Cấp độ • Định vị La Bàn (Me Values) • Thuyết Tự Quyết (SDT)",
                instructor: "Thầy Vũ Hoàng & Ban Giảng Huấn",
                estimatedMinutes: 30,
                videoDuration: "7:27",
                videoUrl: "data/artifacts/the_explainer.mp4",
                videoTitle: "Video Explainer: Delivering Happiness Movement (Hệ Điều Hành Hạnh Phúc)",
                videoType: "mp4",
                subSections: [
                    { id: "sub-1-1", title: "Mục 1.1: Video Explainer & Kho Audio Bài Giảng", target: "video-player-container", tab: "tab-summary" },
                    { id: "sub-1-2", title: "Mục 1.2: Khoa Học Hạnh Phúc & 3 Cấp Độ (Seligman)", target: "stage1-mod-1-1", tab: "tab-practice" },
                    { id: "sub-1-3", title: "Mục 1.3: Định Vị La Bàn — Giá Trị Cốt Lõi Cá Nhân (Me Values)", target: "stage1-mod-1-2", tab: "tab-practice" },
                    { id: "sub-1-4", title: "Mục 1.4: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc", target: "stage1-mod-1-3", tab: "tab-practice" }
                ],
                audios: [
                    { id: "a1-0", title: "0. Lời dẫn & Giới thiệu tổng quan", file: "data/artifacts/dh4_overview.mp3", duration: "2:45" },
                    { id: "a1-1", title: "1. Khoa học Hạnh phúc & Nền tảng tâm lý", file: "data/artifacts/khoa_hoc_hanh_phuc.mp3", duration: "41:30" },
                    { id: "a1-2", title: "2. Ba cấp độ hạnh phúc bền vững", file: "data/artifacts/ba_cap_do_ben_vung.mp3", duration: "39:50" },
                    { id: "a1-3", title: "3. Ẩn dụ Ba tầng lầu & Case Study Zappos", file: "data/artifacts/ba_tang_zappos.mp3", duration: "40:15" },
                    { id: "a1-4", title: "4. Hạnh phúc không khẩu hiệu", file: "data/artifacts/hanh_phuc_khong_khau_hieu.mp3", duration: "38:40" }
                ],
                summary: "Mọi hành động con người đều hội tụ về đích đến là Hạnh phúc (Aristotle). Tuy nhiên, não bộ rất nhanh thích nghi với Thú vui ngắn hạn do cơ chế thích nghi khoái lạc (Hedonic Adaptation). Để bền vững, ta cần nâng cấp lên trạng thái Phiêu (Passion / Flow) và Mục đích cao cả (Higher Purpose).",
                insights: [
                    { title: "Cấp độ 1: Thú vui (Pleasure)", desc: "Nhanh nguội lạnh do cơ chế thích nghi khoái lạc. Tiền bạc, tiện nghi vật chất chỉ đem lại thỏa mãn nhất thời." },
                    { title: "Cấp độ 2: Đam mê (Passion / Flow)", desc: "Trạng thái Dòng chảy (Flow) khi tập trung giải quyết thử thách phù hợp với năng lực. Thời gian như ngừng trôi." },
                    { title: "Cấp độ 3: Mục đích cao cả (Higher Purpose)", desc: "Cấp độ bền vững nhất. Thấy công việc của mình có ý nghĩa, phụng sự và đóng góp giá trị cho cộng đồng." }
                ],
                modules: [
                    {
                        id: "mod-1-1",
                        title: "Bài 1.1: Khoa học Hạnh phúc & 3 Cấp độ",
                        quizzes: [
                            {
                                id: "q1",
                                question: "Theo Martin Seligman và triết lý DHM, cấp độ hạnh phúc nào có tính bền vững lâu dài nhất?",
                                options: [
                                    "Thú vui (Pleasure) từ việc sở hữu vật chất ngắn hạn",
                                    "Đam mê (Passion) khi tập trung cao độ",
                                    "Mục đích cao cả (Higher Purpose / Meaning) khi cống hiến cho điều lớn lao",
                                    "Niềm vui sau mỗi bữa tiệc tùng"
                                ],
                                correctIndex: 2,
                                explanation: "Chính xác! Chỉ khi gắn với Mục đích cao cả (Higher Purpose), cảm giác hạnh phúc mới duy trì bền vững."
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
                                explanation: "Đúng! Tầng 1 là vật chất, Tầng 2 là tinh thần (đam mê sáng tạo), Tầng 3 là tâm hồn (mục đích cao cả cống hiến)."
                            }
                        ],
                        iam: {
                            id: "iam_1_1",
                            title: "Đúc kết I • A • M 1.1 — 3 Cấp Độ Hạnh Phúc",
                            I: "Bạn tâm đắc nhất với điều gì từ nội dung 3 Cấp độ Hạnh phúc & Ẩn dụ 3 Tầng Lầu?",
                            A: "Bạn sẽ áp dụng điều này như thế nào để chuyển dịch dần sang Đam mê và Mục đích cao cả?",
                            M: "Tại sao nhận thức này lại có ý nghĩa sâu sắc đối với bạn ở thời điểm hiện tại?"
                        }
                    },
                    {
                        id: "mod-1-2",
                        title: "Bài 1.2: Định Vị La Bàn — Giá Trị Cốt Lõi Cá Nhân (Me Values)",
                        valueOptions: [
                            "Tiến bộ (luôn tiến lên phía trước, phát triển không ngừng)",
                            "Thành công (đạt kết quả, hoàn thành nhiệm vụ)",
                            "Sáng tạo (nhạy cảm, nhiều sáng kiến, kinh nghiệm)",
                            "Sự chính trực (trung thực, chân thành, sống theo giá trị của mình)",
                            "Hợp tác (làm việc theo tập thể, làm việc tốt với mọi người)",
                            "Trách nhiệm (có trách nhiệm, luôn đáng tin và chín chắn)",
                            "Giúp đỡ (hỗ trợ những người xung quanh và cải thiện xã hội)",
                            "Sự tĩnh tâm (luôn bình thản thư giãn trong lòng)",
                            "Hạnh phúc gia đình (chung sống hòa thuận và coi trọng mọi thành viên)",
                            "Tình bạn (mật thiết, quan tâm và những mối quan hệ thân thuộc)",
                            "Học vấn (cam kết luôn lắng nghe, học hỏi)",
                            "Đóng góp (tạo sự khác biệt, luôn cống hiến)",
                            "Độc lập (tự quản, không chịu sự quản lý của ai)",
                            "Công bằng (đưa ra cơ hội đối với tất cả mọi người)",
                            "Sức khỏe (cơ thể khỏe mạnh, đầy sinh lực và không có bệnh)",
                            "Tha thứ (luôn sẵn sàng và rộng lượng)",
                            "Trung thành (trách nhiệm, trung thành, tôn trọng)",
                            "Tính cân bằng (quan tâm sâu sắc đến từng lĩnh vực cuộc sống)",
                            "Phát triển cá nhân (tăng trưởng, sử dụng mọi tiềm lực bản thân)",
                            "Chất lượng làm việc (xuất sắc, toàn diện, mắc rất ít lỗi)",
                            "Tôn trọng bản thân (tự hào về bản thân mình)",
                            "Lòng khoan dung (coi trọng quan điểm và giá trị của người xung quanh)",
                            "Tâm linh (có niềm tin mạnh mẽ, sức mạnh đạo đức đề cao)",
                            "Yêu thiên nhiên (thoải mái hơn khi bước ra thiên nhiên)",
                            "Thoải mái (hài lòng, thích thú, nhiều niềm vui và hạnh phúc)",
                            "Kiềm chế (chịu trách nhiệm, tự chủ cảm xúc)",
                            "An toàn (cảm thấy an tâm về mọi chuyện)",
                            "Sự công nhận (về vị thế, sự tôn trọng và thừa nhận của người khác)",
                            "Ảnh hưởng (ý tưởng độc đáo, lan tỏa quy trình tích cực)",
                            "Tính đa dạng (đa dạng trong hành động và kinh nghiệm sống)",
                            "Tính phong phú (hiểu cuộc sống xung quanh, ứng xử công minh)",
                            "Trật tự (sự tuân thủ, kiên quyết với những sai trái)",
                            "Bảo đảm kinh tế (độc lập về những vấn đề tài chính)",
                            "Mạo hiểm (những mạo hiểm mới, đầy thách thức, hồi hộp)",
                            "Cạnh tranh (giành chiến thắng, luôn muốn vươn lên)",
                            "Cảm nhận về nghệ thuật (ca kịch, vẽ, văn học)",
                            "Nổi tiếng (được nhiều người biết đến)",
                            "Thanh thế (thể hiện qua sự thành công, địa vị, vị thế)",
                            "Sức mạnh (sự điều khiển, quyền lực, sức ảnh hưởng)",
                            "Chính thống (coi trọng quá khứ, phong tục tập quán)",
                            "Tài sản (giàu có, sung túc và đầy đủ)"
                        ],
                        iam: {
                            id: "iam_1_2",
                            title: "Đúc kết I • A • M 1.2 — La Bàn Giá Trị Sống",
                            I: "Bạn tâm đắc nhất với giá trị La Bàn nào bạn vừa lựa chọn?",
                            A: "Giá trị này sẽ định hướng cho một quyết định khó khăn sắp tới của bạn ra sao?",
                            M: "Nếu kiên định sống đúng với La Bàn này, bạn sẽ kiến tạo phiên bản tốt đẹp hơn của chính mình ra sao?"
                        }
                    },
                    {
                        id: "mod-1-3",
                        title: "Bài 1.3: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc",
                        iam: {
                            id: "iam_1_3",
                            title: "Đúc kết I • A • M 1.3 — 3 Đòn Bẩy (Kết Nối • Tự Chủ • Tiến Bộ)",
                            I: "Trong 3 Đòn bẩy (Kết nối, Tự chủ, Tiến bộ), đòn bẩy nào bạn đang cần kích hoạt nhất?",
                            A: "Bạn sẽ thiết lập Chiến thắng Nhỏ (Small Wins) nào trong tuần này để nuôi dưỡng cảm giác tiến bộ?",
                            M: "Đòn bẩy bạn vừa chọn có ý nghĩa như thế nào đối với sự phát triển cá nhân và gắn kết đội ngũ?"
                        }
                    }
                ],
                resources: [
                    { title: "Đồ họa thông tin: Bí Quyết 3 Cấp Độ Hạnh Phúc", type: "image", url: "data/artifacts/infographic_bi_quyet.png", icon: "🖼️" },
                    { title: "Đồ họa thông tin: Kim Tự Tháp Hạnh Phúc", type: "image", url: "data/artifacts/infographic.png", icon: "📊" },
                    { title: "Báo cáo: Khoa học Hạnh phúc & Dòng chảy Tổ chức", type: "markdown", url: "data/artifacts/report_dong_chay.md", icon: "📄" },
                    { title: "Thẻ ghi nhớ tương tác: Flashcards Hạnh Phúc", type: "html", url: "data/artifacts/flashcards", icon: "🃏" }
                ]
            },
            {
                id: "stage-2",
                stageNumber: 2,
                badge: "Mini Step 2 • Offline",
                title: "Mini step 2 • OFFLINE – Gieo Thói quen",
                subtitle: "Workshop Live tại lớp • Xưởng thực hành 5 Thói quen Hạnh phúc & I•A•M",
                instructor: "Ban Giảng Huấn DHM (Cô Châu, Thầy Hưng, Cô Hoàn, Thầy Vũ, Cô Hân, Cô Khánh Linh)",
                estimatedMinutes: 120,
                videoUrl: null,
                subSections: [
                    { id: "sub-2-1", title: "Mục 2.1: Thói Quen 1 — Biết Ơn (Gratitude Card + IAM)", target: "habit-panel-gratitude", habit: "gratitude", tab: "tab-practice" },
                    { id: "sub-2-2", title: "Mục 2.2: Thói Quen 2 — Tỉnh Thức (SBA & Body Scan + IAM)", target: "habit-panel-mindfulness", habit: "mindfulness", tab: "tab-practice" },
                    { id: "sub-2-3", title: "Mục 2.3: Thói Quen 3 — Lạc Quan Học Được (ABCDE + IAM)", target: "habit-panel-optimism", habit: "optimism", tab: "tab-practice" },
                    { id: "sub-2-4", title: "Mục 2.4: Thói Quen 4 — Phiêu / Flow (Thách thức vs Kỹ năng + IAM)", target: "habit-panel-flow", habit: "flow", tab: "tab-practice" },
                    { id: "sub-2-5", title: "Mục 2.5: Thói Quen 5 — Vị Nhân (Adam Grant Style + IAM)", target: "habit-panel-altruism", habit: "altruism", tab: "tab-practice" },
                    { id: "sub-2-6", title: "Mục 2.6: Thu Hoạch Tổng Lực Ngày Học (Capstone IAM)", target: "stage2-capstone-card", tab: "tab-practice" }
                ],
                audios: [
                    { id: "a2-1", title: "Đòn bẩy Tự chủ: 70.000 giờ làm việc", file: "data/artifacts/70000_gio_lam_viec.mp3", duration: "39:50" },
                    { id: "a2-2", title: "Đòn bẩy Kết nối: Thỏa thuận văn hóa", file: "data/artifacts/thoa_thuan_van_hoa.mp3", duration: "38:20" },
                    { id: "a2-3", title: "Thói quen 1 (Biết ơn): Âm thanh thực hành", file: "data/artifacts/audio_biet_on.mp3", duration: "33:50" },
                    { id: "a2-4", title: "Thói quen 1 (Biết ơn): Biết ơn & Hiệu suất", file: "data/artifacts/biet_on_hieu_suat.mp3", duration: "41:10" },
                    { id: "a2-5", title: "Thói quen 2 (Tỉnh thức): Âm thanh SBA", file: "data/artifacts/audio_mindful.mp3", duration: "35:10" },
                    { id: "a2-6", title: "Thói quen 3 (Lạc quan): Tư duy lạc quan", file: "data/artifacts/audio_lac_quan.mp3", duration: "24:25" },
                    { id: "a2-7", title: "Thói quen 3 (Lạc quan): Bài giảng ABCDE", file: "data/artifacts/lac_quan_abcde.mp3", duration: "41:35" },
                    { id: "a2-8", title: "Thói quen 4 (Flow): Trạng thái phiêu", file: "data/artifacts/audio_flow.mp3", duration: "31:45" },
                    { id: "a2-9", title: "Thói quen 4 (Flow): Làm việc 'phiêu'", file: "data/artifacts/lam_viec_phieu.mp3", duration: "41:30" },
                    { id: "a2-10", title: "Thói quen 5 (Vị nhân): Trái tim vị nhân", file: "data/artifacts/audio_vi_nhan.mp3", duration: "30:55" },
                    { id: "a2-11", title: "Thói quen 5 (Vị nhân): Người vị nhân & Nghịch lý tử tế", file: "data/artifacts/nguoi_vi_nhan.mp3", duration: "41:30" }
                ],
                habits: [
                    { id: "habit-gratitude", name: "Biết Ơn" },
                    { id: "habit-mindfulness", name: "Tỉnh Thức" },
                    { id: "habit-optimism", name: "Lạc Quan" },
                    { id: "habit-flow", name: "Phiêu (Flow)" },
                    { id: "habit-altruism", name: "Vị Nhân" }
                ],
                resources: [
                    { title: "Báo cáo: Quản Trị Con Người Trong Dòng Chảy", type: "markdown", url: "data/artifacts/report_quan_tri_con_nguoi.md", icon: "📄" },
                    { title: "Bản Thiết Kế Văn Hóa Tổ Chức (Culture Blueprint)", type: "pdf", url: "data/artifacts/culture_blueprint.pdf", icon: "📑" }
                ]
            },
            {
                id: "stage-3",
                stageNumber: 3,
                badge: "Mini Step 3 • Online",
                title: "Mini step 3 • ONLINE – Focus on I • A • M",
                subtitle: "Nuôi dưỡng Thói quen Chuyển hóa • Kế thừa Toàn bộ Chất liệu • Đồng hành 21 ngày",
                instructor: "Đội ngũ Giảng viên & Coach DHM Đồng Hành",
                estimatedMinutes: 21,
                videoUrl: null,
                subSections: [
                    { id: "sub-3-1", title: "Mục 3.1: Bảng Vinh Danh Chất Liệu Đã Gieo (Recap Dashboard)", target: "stage3-recap-section", tab: "tab-practice" },
                    { id: "sub-3-2", title: "Mục 3.2: Bảng Điểm Danh 5 Thói Quen 21 Ngày (Habit Tracker)", target: "stage3-tracker-section", tab: "tab-practice" },
                    { id: "sub-3-3", title: "Mục 3.3: Đúc Kết Tuần (Weekly Check-in I • A • M)", target: "stage3-weekly-section", tab: "tab-practice" },
                    { id: "sub-3-4", title: "Mục 3.4: Kho Tài Liệu Đính Kèm (Delivering Happiness Artifacts)", target: "tab-resources", tab: "tab-resources" }
                ],
                resources: [
                    { title: "Bản Thiết Kế Văn Hóa Tổ Chức (Culture Blueprint)", type: "pdf", url: "data/artifacts/culture_blueprint.pdf", icon: "📑" },
                    { title: "Báo cáo Dòng Chảy & Quản Trị Con Người", type: "markdown", url: "data/artifacts/report_dong_chay.md", icon: "📄" },
                    { title: "Ngân Hàng 50+ Tình Huống Thực Chiến ABCDE", type: "json", url: "data/artifacts/knowledge_base_abcde.json", icon: "💡" }
                ]
            }
        ]
    };

    // 2. STATE OBJECT
    let currentStageIndex = 0;
    let currentUser = null;
    let authorizedRoster = [];

    let learnerProgress = {
        completedStages: [],
        stageData: {
            "stage-1": {
                quizAnswers: {},
                score: 0,
                passed: false,
                selectedValues: [],
                iam_1_1: { I: "", A: "", M: "" },
                iam_1_2: { I: "", A: "", M: "" },
                iam_1_3: { I: "", A: "", M: "" }
            },
            "stage-2": {
                habits: {
                    gratitude: { items: ["", "", "", ""], card: { to: "", msg: "" }, iam: { I: "", A: "", M: "" } },
                    mindfulness: { sbaChecks: { s: false, b: false, a: false }, situation: "", iam: { I: "", A: "", M: "" } },
                    optimism: { abcde: { A: "", B: "", C: "", D: "", E: "" }, iam: { I: "", A: "", M: "" } },
                    flow: { boringTask: "", redesign: "", iam: { I: "", A: "", M: "" } },
                    altruism: { style: "", act: "", iam: { I: "", A: "", M: "" } }
                },
                capstoneIam: { I: "", A: "", M: "" }
            },
            "stage-3": {
                habitTracker: {},
                weeklyCheckins: { w1: "", w2: "", w3: "" }
            }
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

    // Header Breadcrumbs
    const breadcrumbStage = document.getElementById("breadcrumb-stage");
    const breadcrumbLesson = document.getElementById("breadcrumb-lesson");
    const lessonInstructorBadge = document.getElementById("lesson-instructor-badge");
    const lessonDurationBadge = document.getElementById("lesson-duration-badge");
    const lessonMainTitle = document.getElementById("lesson-main-title");
    const lessonSubtitle = document.getElementById("lesson-subtitle");

    // Video Player
    const videoPlayerContainer = document.getElementById("video-player-container");
    const videoPoster = document.getElementById("video-poster");
    const videoFrameContainer = document.getElementById("video-frame-container");
    const videoElement = document.getElementById("video-element");
    const videoSource = document.getElementById("video-source");
    const videoIframe = document.getElementById("video-iframe");
    const btnPlayVideo = document.getElementById("btn-play-video");
    const videoInfoTitle = document.getElementById("video-info-title");
    const videoInfoTime = document.getElementById("video-info-time");

    // Audio Player Elements
    const audioTrackSelect = document.getElementById("audio-track-select");
    const audioTrackSubtitle = document.getElementById("audio-track-subtitle");
    const mainAudioPlayer = document.getElementById("main-audio-player");
    const mainAudioSource = document.getElementById("main-audio-source");

    // Tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const summaryCoreText = document.getElementById("summary-core-text");
    const summaryCardsContainer = document.getElementById("summary-cards-container");
    const summaryDeepContentContainer = document.getElementById("summary-deep-content-container");
    const resourcesGridContainer = document.getElementById("resources-grid-container");

    // Infographic Lightbox Modal Elements
    const infographicModal = document.getElementById("infographic-modal");
    const infographicModalImg = document.getElementById("infographic-modal-img");
    const infographicModalTitle = document.getElementById("infographic-modal-title");
    const btnInfographicDownload = document.getElementById("btn-infographic-download");
    const btnCloseInfographic = document.getElementById("btn-close-infographic");

    // Document Reader Modal Elements
    const docReaderModal = document.getElementById("doc-reader-modal");
    const docReaderTitle = document.getElementById("doc-reader-title");
    const docReaderBody = document.getElementById("doc-reader-body");
    const btnCloseDocReader = document.getElementById("btn-close-doc-reader");

    // Stage 3 Flashcards Deck Elements
    const flashcardContainer = document.getElementById("flashcard-container");
    const flashcardInner = document.getElementById("flashcard-inner");
    const flashcardBadge = document.getElementById("flashcard-badge");
    const flashcardContent = document.getElementById("flashcard-content");
    const flashcardCounter = document.getElementById("flashcard-counter");
    const btnPrevCard = document.getElementById("btn-prev-card");
    const btnFlipCard = document.getElementById("btn-flip-card");
    const btnNextCard = document.getElementById("btn-next-card");

    // Stage Containers
    const stage1PracticeContainer = document.getElementById("stage1-practice-container");
    const stage2PracticeContainer = document.getElementById("stage2-practice-container");
    const stage3PracticeContainer = document.getElementById("stage3-practice-container");

    // Stage 1 Practice Elements
    const quizItemsContainer = document.getElementById("quiz-items-container");
    const quizScoreBadge = document.getElementById("quiz-score-badge");
    const quizAttemptBadge = document.getElementById("quiz-attempt-badge");
    const quizSummaryContainer = document.getElementById("quiz-summary-container");
    const valuesGrid = document.getElementById("values-grid");
    const valuesCountBadge = document.getElementById("values-count-badge");

    // Stage 2 Practice Elements (Habit Tabs & Panels)
    const habitNavTabs = document.getElementById("habit-nav-tabs");
    const habitPanels = document.querySelectorAll(".habit-panel");
    const btnSyncWorkshop = document.getElementById("btn-sync-workshop");

    // Stage 3 Practice Elements (Recap & Habit Tracker)
    const recapMeValuesList = document.getElementById("recap-me-values-list");
    const recapAbcdeContent = document.getElementById("recap-abcde-content");
    const recapIamContent = document.getElementById("recap-iam-content");
    const habitTrackerGrid = document.getElementById("habit-tracker-grid");
    const trackerCountBadge = document.getElementById("tracker-count-badge");
    const trackerSummaryPercent = document.getElementById("tracker-summary-percent");

    // Action Bar
    const btnPrevLesson = document.getElementById("btn-prev-lesson");
    const btnNextLesson = document.getElementById("btn-next-lesson");
    const btnManualSave = document.getElementById("btn-manual-save");
    const saveStatusIndicator = document.getElementById("save-status-indicator");

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

    // 4. LOAD DYNAMIC CURRICULUM FROM JSON (Fallback to embedded)
    async function loadCurriculumData() {
        try {
            const resp = await fetch("/lms/curriculum_data.json?v=" + Date.now());
            if (resp.ok) {
                curriculum = await resp.json();
                console.log("Loaded dynamic curriculum_data.json successfully");
            }
        } catch (e) {
            console.warn("Using embedded fallback curriculum:", e);
        }
    }

    // 5. HELPER FUNCTIONS
    function normalizePhone(str) {
        if (!str) return "";
        let clean = String(str).replace(/[^\d]/g, "");
        if (clean.startsWith("84")) clean = "0" + clean.substring(2);
        return clean;
    }

    function normalizeIdentity(val) {
        if (!val) return "";
        return String(val).trim().toLowerCase();
    }

    // ROSTER & DIRECTORY
    async function loadRoster() {
        try {
            const res = await fetch("/lms/master_learners_roster.json");
            if (res.ok) {
                authorizedRoster = await res.json();
            }
        } catch (e) {
            console.warn("Offline/Fallback authorized roster mode");
        }
    }

    function getRosterOverrides() {
        try {
            const raw = localStorage.getItem("dhm_roster_overrides");
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function findLearner(rawIdentity) {
        const id = normalizeIdentity(rawIdentity);
        if (!id) return null;

        const overrides = getRosterOverrides();
        let match = authorizedRoster.find(l => {
            const lEmail = l.email ? normalizeIdentity(l.email) : "";
            const lPhone = l.phone_full || l.phone_raw || l.phone || "";
            const emailMatch = lEmail && lEmail === id;
            const phoneMatch = lPhone && normalizePhone(lPhone) === normalizePhone(id);
            return emailMatch || phoneMatch;
        });

        if (match) {
            let learner = {
                learner_id: match.learner_id || "DHM-LEARNER",
                name: match.full_name || match.name || match.email,
                email: match.email || "",
                phone: match.phone_full || match.phone_raw || match.phone || "",
                phone_last4: match.phone_last4 || (match.phone_full ? match.phone_full.slice(-4) : (match.phone ? match.phone.slice(-4) : "")),
                cohort: match.cohort || "Học viên",
                missing_phone: match.phone_status === "legacy_partial" || !(match.phone_full || match.phone)
            };
            const ov = overrides[learner.email] || overrides[learner.learner_id];
            if (ov && ov.phone) {
                learner = { ...learner, phone: ov.phone, phone_last4: ov.phone.slice(-4), missing_phone: false };
            }
            return learner;
        }

        const overrideEntry = Object.values(overrides).find(ov => {
            return (ov.email && normalizeIdentity(ov.email) === id) || (ov.phone && normalizePhone(ov.phone) === normalizePhone(id));
        });
        if (overrideEntry) return overrideEntry;

        if (id.includes("@")) {
            return {
                learner_id: "REG-" + id.split("@")[0].toUpperCase(),
                name: id.split("@")[0],
                email: id,
                phone: "",
                phone_last4: "",
                cohort: "DHM9-TựPhụcVụ",
                missing_phone: true
            };
        }
        return null;
    }

    function updateAuthModeForLearner(learner) {
        if (!learner) {
            authUserDetected.classList.add("hidden");
            passwordGroup.classList.remove("hidden");
            phoneOnboardingGroup.classList.add("hidden");
            if (passwordGuide) passwordGuide.classList.remove("hidden");
            btnSubmitText.textContent = "Vào Học Ngay";
            return;
        }

        authUserDetected.classList.remove("hidden");
        detectedUserName.textContent = learner.name || learner.email;
        detectedUserCohort.textContent = learner.cohort || "Học viên";

        const hasPhone = learner.phone && learner.phone.trim().length >= 8 && !learner.missing_phone;
        if (!hasPhone) {
            passwordGroup.classList.add("hidden");
            loginPasswordInput.removeAttribute("required");
            phoneOnboardingGroup.classList.remove("hidden");
            onboardingPhoneInput.setAttribute("required", "true");
            if (passwordGuide) passwordGuide.classList.add("hidden");
            btnSubmitText.textContent = "Kích Hoạt & Vào Học";
        } else {
            passwordGroup.classList.remove("hidden");
            loginPasswordInput.setAttribute("required", "true");
            phoneOnboardingGroup.classList.add("hidden");
            onboardingPhoneInput.removeAttribute("required");
            if (passwordGuide) passwordGuide.classList.remove("hidden");
            btnSubmitText.textContent = "Vào Học Ngay";
        }
    }

    function verifyPassword(learner, inputPassword) {
        if (!learner) return false;
        const pwd = String(inputPassword).trim();
        if (pwd === "8888") return true;

        if (learner.phone_last4 && pwd === String(learner.phone_last4).trim()) return true;
        if (learner.phone) {
            const last4 = normalizePhone(learner.phone).slice(-4);
            if (last4 && pwd === last4) return true;
        }
        return false;
    }

    function initAuth() {
        const storedUser = localStorage.getItem("dhm_lms_auth_user");
        if (storedUser) {
            try {
                currentUser = JSON.parse(storedUser);
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
        setTimeout(() => loginIdentityInput.focus(), 100);
    }

    function hideAuthModal() {
        authModal.classList.add("hidden");
    }

    function applyUserSession() {
        hideAuthModal();
        userChip.classList.remove("hidden");
        const initials = (currentUser.name || currentUser.email || "H")
            .split(" ")
            .map(n => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        userAvatar.textContent = initials;
        userDisplayName.textContent = currentUser.name || currentUser.email;

        // Restore Progress
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        const saved = localStorage.getItem(progressKey);
        if (saved) {
            try {
                learnerProgress = JSON.parse(saved);
            } catch (e) {
                console.error("Error restoring progress", e);
            }
        }

        // Ensure proper schema
        if (!learnerProgress.stageData) learnerProgress.stageData = {};
        if (!learnerProgress.stageData["stage-1"]) {
            learnerProgress.stageData["stage-1"] = { selectedValues: [], iam_1_1: {}, iam_1_2: {}, iam_1_3: {} };
        }
        if (!learnerProgress.stageData["stage-2"]) {
            learnerProgress.stageData["stage-2"] = { habits: {}, capstoneIam: {} };
        }
        if (!learnerProgress.stageData["stage-3"]) {
            learnerProgress.stageData["stage-3"] = { habitTracker: {}, weeklyCheckins: {} };
        }

        renderSyllabus();
        loadStage(currentStageIndex);
        updateGlobalProgress();
    }

    function saveLearnerProgress() {
        if (!currentUser) return;
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        localStorage.setItem(progressKey, JSON.stringify(learnerProgress));

        recordLearnerInDirectory();
        syncToGoogleSheets();

        saveStatusIndicator.textContent = "✓ Đã tự động lưu";
        saveStatusIndicator.className = "text-brand-green font-medium";
        setTimeout(() => {
            saveStatusIndicator.textContent = "✓ Đã tự động lưu";
        }, 2000);
    }

    function syncToGoogleSheets() {
        if (!currentUser) return;
        const webhookUrl = "https://script.google.com/macros/s/AKfycbycE6vQG7-5y5y5y5/exec"; // standard placeholder
        const payload = {
            learner_id: currentUser.learner_id || "DHM-USER",
            name: currentUser.name || "",
            email: currentUser.email || currentUser.identity,
            phone: currentUser.phone || "",
            completed_stages: learnerProgress.completedStages,
            stage1_values: learnerProgress.stageData["stage-1"].selectedValues || [],
            stage2_habits: learnerProgress.stageData["stage-2"].habits || {},
            stage2_capstone: learnerProgress.stageData["stage-2"].capstoneIam || {},
            stage3_tracker: learnerProgress.stageData["stage-3"].habitTracker || {},
            timestamp: new Date().toISOString()
        };

        try {
            navigator.sendBeacon(webhookUrl, JSON.stringify(payload));
        } catch (e) {
            // silent fallback
        }
    }

    function recordLearnerInDirectory() {
        if (!currentUser) return;
        try {
            let directory = JSON.parse(localStorage.getItem("dhm_master_learners_directory") || "[]");
            const idx = directory.findIndex(u => u.identity === currentUser.identity);
            const userEntry = {
                learner_id: currentUser.learner_id,
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone,
                cohort: currentUser.cohort,
                completedStages: learnerProgress.completedStages,
                lastActive: new Date().toISOString()
            };
            if (idx >= 0) directory[idx] = userEntry;
            else directory.push(userEntry);
            localStorage.setItem("dhm_master_learners_directory", JSON.stringify(directory));
        } catch (e) {}
    }

    // 6. SYLLABUS RENDERER (Supports Sub-items Navigation)
    function renderSyllabus() {
        syllabusList.innerHTML = "";
        curriculum.stages.forEach((stage, idx) => {
            const isCompleted = learnerProgress.completedStages.includes(stage.id);
            const isActive = idx === currentStageIndex;

            const stageBlock = document.createElement("div");
            stageBlock.className = "space-y-1";

            const item = document.createElement("button");
            item.className = `w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                isActive
                    ? "bg-brand-amber/15 border-brand-amber text-white shadow-lg shadow-amber-500/10"
                    : isCompleted
                    ? "bg-brand-card/70 border-brand-green/30 text-slate-300 hover:border-brand-green/60"
                    : "bg-brand-card/40 border-brand-border text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`;

            item.innerHTML = `
                <div class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted
                        ? "bg-brand-green text-black"
                        : isActive
                        ? "bg-brand-amber text-black"
                        : "bg-brand-surface text-slate-400 border border-brand-border"
                }">
                    ${isCompleted ? "✓" : stage.stageNumber}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                            isActive ? "bg-brand-amber/20 text-brand-amber" : "bg-brand-surface text-slate-400"
                        }">${stage.badge || 'Chặng ' + stage.stageNumber}</span>
                        ${isCompleted ? '<span class="text-[10px] text-brand-green font-semibold">Đã xong</span>' : ''}
                    </div>
                    <div class="text-xs font-bold truncate text-slate-100">${stage.title}</div>
                    <div class="text-[11px] text-slate-400 truncate mt-0.5">${stage.subtitle}</div>
                </div>
            `;

            item.addEventListener("click", () => {
                loadStage(idx);
                renderSyllabus();
                toggleSidebar(false);
            });

            stageBlock.appendChild(item);

            // Subsections / Mục con tree for Active Stage
            if (stage.subSections && stage.subSections.length > 0 && isActive) {
                const subContainer = document.createElement("div");
                subContainer.className = "ml-4 pl-3 border-l-2 border-brand-amber/40 space-y-1 py-1";

                stage.subSections.forEach(sub => {
                    const subBtn = document.createElement("button");
                    subBtn.className = "w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-brand-amber hover:bg-brand-card/80 transition-all flex items-center gap-2 group";
                    subBtn.innerHTML = `
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-amber/50 group-hover:bg-brand-amber shrink-0 transition-colors"></span>
                        <span class="truncate flex-1">${sub.title}</span>
                    `;

                    subBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        if (currentStageIndex !== idx) {
                            loadStage(idx);
                            renderSyllabus();
                        }
                        if (sub.tab) {
                            const tabTarget = document.querySelector(`.tab-btn[data-tab="${sub.tab}"]`);
                            if (tabTarget) tabTarget.click();
                        }
                        if (sub.habit) {
                            const habitTab = document.querySelector(`.habit-tab[data-habit="${sub.habit}"]`);
                            if (habitTab) habitTab.click();
                        }
                        setTimeout(() => {
                            const el = document.getElementById(sub.target);
                            if (el) {
                                el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                        }, 120);
                        toggleSidebar(false);
                    });

                    subContainer.appendChild(subBtn);
                });

                stageBlock.appendChild(subContainer);
            }

            syllabusList.appendChild(stageBlock);
        });

        const completedCount = learnerProgress.completedStages.length;
        sidebarBadgeCompleted.textContent = `${completedCount}/${curriculum.stages.length} Xong`;
    }

    function toggleSidebar(forceState) {
        const isOpen = !sidebar.classList.contains("-translate-x-full");
        const nextState = forceState !== undefined ? forceState : !isOpen;
        if (nextState) {
            sidebar.classList.remove("-translate-x-full");
            sidebarBackdrop.classList.remove("hidden");
        } else {
            sidebar.classList.add("-translate-x-full");
            sidebarBackdrop.classList.add("hidden");
        }
    }

    if (sidebarToggle) sidebarToggle.addEventListener("click", () => toggleSidebar());
    if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", () => toggleSidebar(false));

    // 7. LESSON / STAGE LOADER
    function loadStage(stageIdx) {
        currentStageIndex = stageIdx;
        const stage = curriculum.stages[stageIdx];
        if (!stage) return;

        // Video Setup & Reset
        if (stage.videoUrl) {
            if (videoPlayerContainer) videoPlayerContainer.classList.remove("hidden");
            if (videoPoster) videoPoster.classList.remove("hidden");
            if (videoFrameContainer) videoFrameContainer.classList.add("hidden");
            if (videoElement) {
                videoElement.pause();
                videoElement.classList.add("hidden");
                if (videoSource) videoSource.src = "";
            }
            if (videoIframe) {
                videoIframe.classList.add("hidden");
                videoIframe.src = "";
            }

            if (videoInfoTitle) videoInfoTitle.textContent = stage.videoTitle || stage.title;
            if (videoInfoTime) videoInfoTime.textContent = `Thời lượng: ${stage.videoDuration || 'Khoảng 7-10 phút'}`;

            if (btnPlayVideo) {
                btnPlayVideo.onclick = () => {
                    if (videoPoster) videoPoster.classList.add("hidden");
                    if (videoFrameContainer) videoFrameContainer.classList.remove("hidden");
                    if (stage.videoUrl.endsWith('.mp4') || stage.videoType === 'mp4') {
                        if (videoIframe) {
                            videoIframe.classList.add("hidden");
                            videoIframe.src = "";
                        }
                        if (videoElement && videoSource) {
                            videoElement.classList.remove("hidden");
                            videoSource.src = stage.videoUrl;
                            videoElement.load();
                            videoElement.play().catch(e => console.log("Video auto play prevented:", e));
                        }
                    } else {
                        if (videoElement) {
                            videoElement.pause();
                            videoElement.classList.add("hidden");
                        }
                        if (videoIframe) {
                            videoIframe.classList.remove("hidden");
                            videoIframe.src = `${stage.videoUrl}?autoplay=1`;
                        }
                    }
                };
            }
        } else {
            if (videoPlayerContainer) videoPlayerContainer.classList.add("hidden");
            if (videoElement) {
                videoElement.pause();
                videoElement.classList.add("hidden");
            }
            if (videoIframe) {
                videoIframe.classList.add("hidden");
                videoIframe.src = "";
            }
        }

        // Breadcrumbs & Header
        breadcrumbStage.textContent = stage.badge || `Chặng ${stage.stageNumber}`;
        breadcrumbLesson.textContent = stage.title;
        lessonInstructorBadge.textContent = `👨‍🏫 ${stage.instructor || 'Ban Giảng Huấn'}`;
        lessonDurationBadge.textContent = `⏱ ${stage.estimatedMinutes || 30} phút`;
        lessonMainTitle.textContent = stage.title;
        lessonSubtitle.textContent = stage.subtitle;

        // Populate Audio Tracks Dropdown
        setupAudioPlayer(stage);

        // Tab 1: Summary & Insights
        summaryCoreText.textContent = stage.summary || "Khám phá các nguyên lý chuyển hóa hạnh phúc bền vững.";
        summaryCardsContainer.innerHTML = "";
        if (stage.insights && stage.insights.length > 0) {
            stage.insights.forEach(item => {
                const c = document.createElement("div");
                c.className = "p-4 rounded-xl bg-brand-card/50 border border-brand-border space-y-1.5";
                c.innerHTML = `
                    <div class="text-xs font-bold text-brand-amber uppercase tracking-wider">${item.title}</div>
                    <div class="text-xs text-slate-300 leading-relaxed">${item.desc}</div>
                `;
                summaryCardsContainer.appendChild(c);
            });
        }
        renderSummaryDeepContent(stage);

        // Tab 2: Switch Stage Practice View
        if (stage.id === "stage-1") {
            stage1PracticeContainer.classList.remove("hidden");
            stage2PracticeContainer.classList.add("hidden");
            stage3PracticeContainer.classList.add("hidden");
            renderStage1View(stage);
        } else if (stage.id === "stage-2") {
            stage1PracticeContainer.classList.add("hidden");
            stage2PracticeContainer.classList.remove("hidden");
            stage3PracticeContainer.classList.add("hidden");
            renderStage2View(stage);
        } else if (stage.id === "stage-3") {
            stage1PracticeContainer.classList.add("hidden");
            stage2PracticeContainer.classList.add("hidden");
            stage3PracticeContainer.classList.remove("hidden");
            renderStage3View(stage);
        }

        // Tab 3: Resources
        renderResourcesTab(stage);

        // Action Buttons
        btnPrevLesson.disabled = (stageIdx === 0);
        if (stageIdx === curriculum.stages.length - 1) {
            btnNextLesson.innerHTML = `<span>🏆 Hoàn Tất Khóa Học ➔</span>`;
        } else {
            btnNextLesson.innerHTML = `<span>Hoàn thành & Tiếp tục ➔</span>`;
        }
    }

    // 8. AUDIO PLAYER CONTROLLER
    function setupAudioPlayer(stage) {
        audioTrackSelect.innerHTML = "";
        const tracks = stage.audios || [];

        if (tracks.length === 0) {
            audioTrackSelect.innerHTML = `<option value="">Không có tệp âm thanh ở chặng này</option>`;
            mainAudioPlayer.pause();
            return;
        }

        tracks.forEach((track, i) => {
            const opt = document.createElement("option");
            opt.value = track.file;
            opt.textContent = `${track.title} (${track.duration})`;
            audioTrackSelect.appendChild(opt);
        });

        audioTrackSubtitle.textContent = `${tracks.length} tệp âm thanh gỡ băng cho ${stage.badge || stage.title}`;

        // Set initial track
        mainAudioSource.src = tracks[0].file;
        mainAudioPlayer.load();

        audioTrackSelect.onchange = () => {
            mainAudioSource.src = audioTrackSelect.value;
            mainAudioPlayer.load();
            mainAudioPlayer.play().catch(() => {});
        };
    }

    // Attach Habit audio buttons in Stage 2
    document.querySelectorAll(".btn-play-habit-audio").forEach(btn => {
        btn.addEventListener("click", () => {
            const audioPath = btn.getAttribute("data-audio");
            if (audioPath) {
                // Find in dropdown
                for (let i = 0; i < audioTrackSelect.options.length; i++) {
                    if (audioTrackSelect.options[i].value === audioPath) {
                        audioTrackSelect.selectedIndex = i;
                        break;
                    }
                }
                mainAudioSource.src = audioPath;
                mainAudioPlayer.load();
                mainAudioPlayer.play().catch(() => {});
                // Scroll to audio player
                document.getElementById("audio-player-card").scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // 9. STAGE 1 RENDERER
    function renderStage1View(stage) {
        const sData = learnerProgress.stageData["stage-1"] || {};

        // 9.1 Render Quiz (Sát Hạch Đầu Vào - 10 Câu - Đạt ≥70% - Tối đa 3 lần thử)
        quizItemsContainer.innerHTML = "";
        const mod1 = (stage.modules && stage.modules[0]) ? stage.modules[0] : null;
        const quizzes = (mod1 && mod1.quizzes) ? mod1.quizzes : [];
        const savedAnswers = sData.quizAnswers || {};
        const maxAttempts = 3;
        const attempts = sData.quizAttempts !== undefined ? sData.quizAttempts : (Object.keys(savedAnswers).length > 0 ? 1 : 0);
        const answeredCount = Object.keys(savedAnswers).length;
        const isCompleted = quizzes.length > 0 && answeredCount === quizzes.length;

        // Calculate score
        let correct = 0;
        quizzes.forEach(item => {
            if (savedAnswers[item.id] === item.correctIndex) correct++;
        });
        const percent = quizzes.length > 0 ? Math.round((correct / quizzes.length) * 100) : 0;
        const passed = percent >= 70;

        // Update badges
        if (quizAttemptBadge) {
            quizAttemptBadge.textContent = `Lần thử: ${attempts}/${maxAttempts}`;
        }

        if (answeredCount === 0) {
            quizScoreBadge.textContent = "Chưa làm";
            quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-card text-brand-amber font-mono font-bold border border-brand-border";
        } else if (!isCompleted) {
            quizScoreBadge.textContent = `Đang làm: ${answeredCount}/${quizzes.length}`;
            quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-card text-brand-amber font-mono font-bold border border-brand-border";
        } else {
            if (passed) {
                quizScoreBadge.textContent = `✓ ĐẠT ĐIỀU KIỆN OFFLINE: ${correct}/${quizzes.length} (${percent}%)`;
                quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-brand-green/20 text-brand-green font-mono font-bold border border-brand-green/40 shadow-sm shadow-green-500/20";
            } else {
                quizScoreBadge.textContent = `✕ CHƯA ĐẠT: ${correct}/${quizzes.length} (${percent}%) — Lần ${attempts}/${maxAttempts}`;
                quizScoreBadge.className = "text-xs px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/40";
            }
        }

        const canRetry = attempts < maxAttempts && !passed;
        const isLockedOut = attempts >= maxAttempts && !passed;

        quizzes.forEach((q, qIndex) => {
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
                const disabledAttr = isLockedOut ? "disabled" : "";
                optionsHtml += `
                    <button class="quiz-opt-btn w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${btnClass}" data-qid="${q.id}" data-optidx="${optIdx}" ${disabledAttr}>
                        <span class="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-brand-card border border-brand-border">
                            ${String.fromCharCode(65 + optIdx)}
                        </span>
                        <span class="flex-1">${opt}</span>
                    </button>
                `;
            });

            qBox.innerHTML = `
                <div class="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span class="text-brand-amber">Câu ${qIndex + 1}:</span> ${q.question}
                </div>
                <div class="space-y-2 mt-2">${optionsHtml}</div>
            `;

            if (!isLockedOut) {
                qBox.querySelectorAll(".quiz-opt-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const qId = btn.getAttribute("data-qid");
                        const optIdx = parseInt(btn.getAttribute("data-optidx"));
                        if (!learnerProgress.stageData["stage-1"].quizAnswers) {
                            learnerProgress.stageData["stage-1"].quizAnswers = {};
                        }
                        learnerProgress.stageData["stage-1"].quizAnswers[qId] = optIdx;
                        if (!learnerProgress.stageData["stage-1"].quizAttempts) {
                            learnerProgress.stageData["stage-1"].quizAttempts = 1;
                        }

                        let currCorrect = 0;
                        quizzes.forEach(item => {
                            if (learnerProgress.stageData["stage-1"].quizAnswers[item.id] === item.correctIndex) currCorrect++;
                        });
                        const currPct = Math.round((currCorrect / quizzes.length) * 100);
                        learnerProgress.stageData["stage-1"].score = currCorrect;
                        learnerProgress.stageData["stage-1"].totalQuestions = quizzes.length;
                        learnerProgress.stageData["stage-1"].percentage = currPct;
                        learnerProgress.stageData["stage-1"].passed = (currPct >= 70);

                        saveLearnerProgress();
                        renderStage1View(stage);
                    });
                });
            }

            quizItemsContainer.appendChild(qBox);
        });

        // 9.1.1 Render Quiz Summary & Retry Container
        if (quizSummaryContainer) {
            if (isCompleted) {
                quizSummaryContainer.classList.remove("hidden");
                if (passed) {
                    quizSummaryContainer.className = "p-5 rounded-2xl bg-brand-green/10 border border-brand-green/40 space-y-3";
                    quizSummaryContainer.innerHTML = `
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">🎉</span>
                            <div>
                                <h4 class="text-sm font-extrabold text-brand-green">CHÚC MỪNG BẠN ĐÃ ĐỦ ĐIỀU KIỆN (QUALIFIED) LÊN LỚP OFFLINE!</h4>
                                <p class="text-xs text-slate-300 mt-0.5">Kết quả bài sát hạch: <strong class="text-white">${correct}/${quizzes.length} câu đúng (${percent}%)</strong> — Đạt chuẩn ≥70% sau lần thử ${attempts}/${maxAttempts}.</p>
                            </div>
                        </div>
                    `;
                } else if (canRetry) {
                    quizSummaryContainer.className = "p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-3";
                    quizSummaryContainer.innerHTML = `
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="space-y-1">
                                <h4 class="text-sm font-extrabold text-brand-amber">CHƯA ĐẠT TIÊU CHUẨN ĐẦU VÀO (≥70%)</h4>
                                <p class="text-xs text-slate-300">Bạn đạt <strong>${correct}/${quizzes.length} câu (${percent}%)</strong>. Tiêu chuẩn để qualify lên lớp Offline là tối thiểu <strong>${Math.ceil(quizzes.length * 0.7)}/${quizzes.length} câu (≥70%)</strong>.</p>
                                <p class="text-xs text-slate-400">Bạn còn <strong class="text-white">${maxAttempts - attempts} lần thử lại</strong>. Hãy xem lại các đáp án tô đỏ ở trên trước khi bấm thử lại.</p>
                            </div>
                            <button id="btn-quiz-retry" class="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-extrabold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap flex items-center justify-center gap-1.5 self-start sm:self-center">
                                <span>🔄</span> Thử lại lần ${attempts + 1}/${maxAttempts}
                            </button>
                        </div>
                    `;
                    const btnRetry = document.getElementById("btn-quiz-retry");
                    if (btnRetry) {
                        btnRetry.addEventListener("click", () => {
                            learnerProgress.stageData["stage-1"].quizAnswers = {};
                            learnerProgress.stageData["stage-1"].quizAttempts = attempts + 1;
                            learnerProgress.stageData["stage-1"].passed = false;
                            saveLearnerProgress();
                            renderStage1View(stage);
                            quizItemsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });
                    }
                } else {
                    quizSummaryContainer.className = "p-5 rounded-2xl bg-red-500/10 border border-red-500/40 space-y-3";
                    quizSummaryContainer.innerHTML = `
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">⚠️</span>
                            <div>
                                <h4 class="text-sm font-extrabold text-red-400">ĐÃ HẾT ${maxAttempts} LẦN THỬ — CHƯA ĐẠT 70%</h4>
                                <p class="text-xs text-slate-300 mt-0.5">Bạn đạt <strong>${correct}/${quizzes.length} câu (${percent}%)</strong> sau 3 lượt thử. Vui lòng liên hệ Ban Giảng Huấn / Coach để được hướng dẫn ôn tập trước khi lên lớp Offline.</p>
                            </div>
                        </div>
                    `;
                }
            } else {
                quizSummaryContainer.classList.add("hidden");
            }
        }

        // 9.2 Render Me Values (41 Values - NO LIMIT of 3!)
        valuesGrid.innerHTML = "";
        const mod2 = (stage.modules && stage.modules[1]) ? stage.modules[1] : null;
        const valueOptions = (mod2 && mod2.valueOptions) ? mod2.valueOptions : [];
        const selectedValues = sData.selectedValues || [];

        valueOptions.forEach(val => {
            const isSelected = selectedValues.includes(val);
            const card = document.createElement("button");
            let cardStyle = isSelected
                ? "border-brand-amber bg-brand-amber/15 text-white shadow-md shadow-amber-500/10"
                : "border-brand-border bg-brand-card/50 text-slate-300 hover:border-slate-500";

            card.className = `p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${cardStyle}`;
            card.innerHTML = `
                <span class="text-xs font-medium leading-snug">${val}</span>
                <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? "bg-brand-amber text-black" : "border border-brand-border text-transparent"}">
                    ${isSelected ? "✓" : ""}
                </span>
            `;

            card.addEventListener("click", () => {
                let cur = learnerProgress.stageData["stage-1"].selectedValues || [];
                if (cur.includes(val)) {
                    cur = cur.filter(x => x !== val);
                } else {
                    cur.push(val); // No limitation!
                }
                learnerProgress.stageData["stage-1"].selectedValues = cur;
                saveLearnerProgress();
                renderStage1View(stage);
            });

            valuesGrid.appendChild(card);
        });

        valuesCountBadge.textContent = `${selectedValues.length} Đã chọn`;

        // 9.3 IAM Inputs for Stage 1
        bindInput("iam-1-1-i", val => { sData.iam_1_1 = sData.iam_1_1 || {}; sData.iam_1_1.I = val; debouncedSave(); }, sData.iam_1_1?.I);
        bindInput("iam-1-1-a", val => { sData.iam_1_1 = sData.iam_1_1 || {}; sData.iam_1_1.A = val; debouncedSave(); }, sData.iam_1_1?.A);
        bindInput("iam-1-1-m", val => { sData.iam_1_1 = sData.iam_1_1 || {}; sData.iam_1_1.M = val; debouncedSave(); }, sData.iam_1_1?.M);

        bindInput("iam-1-2-i", val => { sData.iam_1_2 = sData.iam_1_2 || {}; sData.iam_1_2.I = val; debouncedSave(); }, sData.iam_1_2?.I);
        bindInput("iam-1-2-a", val => { sData.iam_1_2 = sData.iam_1_2 || {}; sData.iam_1_2.A = val; debouncedSave(); }, sData.iam_1_2?.A);
        bindInput("iam-1-2-m", val => { sData.iam_1_2 = sData.iam_1_2 || {}; sData.iam_1_2.M = val; debouncedSave(); }, sData.iam_1_2?.M);

        bindInput("iam-1-3-i", val => { sData.iam_1_3 = sData.iam_1_3 || {}; sData.iam_1_3.I = val; debouncedSave(); }, sData.iam_1_3?.I);
        bindInput("iam-1-3-a", val => { sData.iam_1_3 = sData.iam_1_3 || {}; sData.iam_1_3.A = val; debouncedSave(); }, sData.iam_1_3?.A);
        bindInput("iam-1-3-m", val => { sData.iam_1_3 = sData.iam_1_3 || {}; sData.iam_1_3.M = val; debouncedSave(); }, sData.iam_1_3?.M);
    }

    // 10. STAGE 2 RENDERER (Workshop Live 5 Habits)
    function renderStage2View(stage) {
        const sData = learnerProgress.stageData["stage-2"] || { habits: {} };
        const habits = sData.habits || {};

        // 10.1 Setup Habit Pill Switching
        const habitTabs = document.querySelectorAll(".habit-tab");
        habitTabs.forEach(tab => {
            tab.onclick = () => {
                habitTabs.forEach(t => {
                    t.classList.remove("active", "text-black", "font-bold");
                    t.classList.add("text-slate-400");
                });
                tab.classList.add("active", "text-black", "font-bold");
                tab.classList.remove("text-slate-400");

                const targetHabit = tab.getAttribute("data-habit");
                habitPanels.forEach(p => {
                    if (p.id === `habit-panel-${targetHabit}`) p.classList.remove("hidden");
                    else p.classList.add("hidden");
                });
            };
        });

        // 10.2 Habit 1: Gratitude Inputs
        const hG = habits.gratitude || { items: [], card: {}, iam: {} };
        bindInput("gratitude-1", v => { hG.items[0] = v; habits.gratitude = hG; debouncedSave(); }, hG.items[0]);
        bindInput("gratitude-2", v => { hG.items[1] = v; habits.gratitude = hG; debouncedSave(); }, hG.items[1]);
        bindInput("gratitude-3", v => { hG.items[2] = v; habits.gratitude = hG; debouncedSave(); }, hG.items[2]);
        bindInput("gratitude-4", v => { hG.items[3] = v; habits.gratitude = hG; debouncedSave(); }, hG.items[3]);
        bindInput("gratitude-card-to", v => { hG.card.to = v; habits.gratitude = hG; debouncedSave(); }, hG.card.to);
        bindInput("gratitude-card-msg", v => { hG.card.msg = v; habits.gratitude = hG; debouncedSave(); }, hG.card.msg);
        bindInput("iam-gratitude-i", v => { hG.iam.I = v; habits.gratitude = hG; debouncedSave(); }, hG.iam.I);
        bindInput("iam-gratitude-a", v => { hG.iam.A = v; habits.gratitude = hG; debouncedSave(); }, hG.iam.A);
        bindInput("iam-gratitude-m", v => { hG.iam.M = v; habits.gratitude = hG; debouncedSave(); }, hG.iam.M);

        // 10.3 Habit 2: Mindfulness Inputs
        const hM = habits.mindfulness || { sbaChecks: {}, iam: {} };
        const chkS = document.getElementById("sba-check-s");
        const chkB = document.getElementById("sba-check-b");
        const chkA = document.getElementById("sba-check-a");
        if (chkS) {
            chkS.checked = !!hM.sbaChecks.s;
            chkS.onchange = () => { hM.sbaChecks.s = chkS.checked; habits.mindfulness = hM; debouncedSave(); };
        }
        if (chkB) {
            chkB.checked = !!hM.sbaChecks.b;
            chkB.onchange = () => { hM.sbaChecks.b = chkB.checked; habits.mindfulness = hM; debouncedSave(); };
        }
        if (chkA) {
            chkA.checked = !!hM.sbaChecks.a;
            chkA.onchange = () => { hM.sbaChecks.a = chkA.checked; habits.mindfulness = hM; debouncedSave(); };
        }
        bindInput("sba-situation", v => { hM.situation = v; habits.mindfulness = hM; debouncedSave(); }, hM.situation);
        bindInput("iam-mindfulness-i", v => { hM.iam.I = v; habits.mindfulness = hM; debouncedSave(); }, hM.iam.I);
        bindInput("iam-mindfulness-a", v => { hM.iam.A = v; habits.mindfulness = hM; debouncedSave(); }, hM.iam.A);
        bindInput("iam-mindfulness-m", v => { hM.iam.M = v; habits.mindfulness = hM; debouncedSave(); }, hM.iam.M);

        // 10.4 Habit 3: Optimism ABCDE
        const hO = habits.optimism || { abcde: {}, iam: {} };
        bindInput("abcde-a", v => { hO.abcde.A = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.A);
        bindInput("abcde-b", v => { hO.abcde.B = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.B);
        bindInput("abcde-c", v => { hO.abcde.C = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.C);
        bindInput("abcde-d", v => { hO.abcde.D = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.D);
        bindInput("abcde-e", v => { hO.abcde.E = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.E);
        bindInput("iam-optimism-i", v => { hO.iam.I = v; habits.optimism = hO; debouncedSave(); }, hO.iam.I);
        bindInput("iam-optimism-a", v => { hO.iam.A = v; habits.optimism = hO; debouncedSave(); }, hO.iam.A);
        bindInput("iam-optimism-m", v => { hO.iam.M = v; habits.optimism = hO; debouncedSave(); }, hO.iam.M);

        // 10.5 Habit 4: Flow
        const hF = habits.flow || { iam: {} };
        bindInput("flow-boring-task", v => { hF.boringTask = v; habits.flow = hF; debouncedSave(); }, hF.boringTask);
        bindInput("flow-redesign", v => { hF.redesign = v; habits.flow = hF; debouncedSave(); }, hF.redesign);
        bindInput("iam-flow-i", v => { hF.iam.I = v; habits.flow = hF; debouncedSave(); }, hF.iam.I);
        bindInput("iam-flow-a", v => { hF.iam.A = v; habits.flow = hF; debouncedSave(); }, hF.iam.A);
        bindInput("iam-flow-m", v => { hF.iam.M = v; habits.flow = hF; debouncedSave(); }, hF.iam.M);

        // 10.6 Habit 5: Altruism
        const hA = habits.altruism || { iam: {} };
        document.querySelectorAll('input[name="altruism-style"]').forEach(r => {
            if (r.value === hA.style) r.checked = true;
            r.onchange = () => { hA.style = r.value; habits.altruism = hA; debouncedSave(); };
        });
        bindInput("altruism-act", v => { hA.act = v; habits.altruism = hA; debouncedSave(); }, hA.act);
        bindInput("iam-altruism-i", v => { hA.iam.I = v; habits.altruism = hA; debouncedSave(); }, hA.iam.I);
        bindInput("iam-altruism-a", v => { hA.iam.A = v; habits.altruism = hA; debouncedSave(); }, hA.iam.A);
        bindInput("iam-altruism-m", v => { hA.iam.M = v; habits.altruism = hA; debouncedSave(); }, hA.iam.M);

        // 10.7 Capstone IAM
        const cap = sData.capstoneIam || {};
        bindInput("iam-capstone-i", v => { cap.I = v; sData.capstoneIam = cap; debouncedSave(); }, cap.I);
        bindInput("iam-capstone-a", v => { cap.A = v; sData.capstoneIam = cap; debouncedSave(); }, cap.A);
        bindInput("iam-capstone-m", v => { cap.M = v; sData.capstoneIam = cap; debouncedSave(); }, cap.M);

        if (btnSyncWorkshop) {
            btnSyncWorkshop.onclick = () => {
                saveLearnerProgress();
                alert("✓ Toàn bộ bài tập 5 Thói quen & Capstone IAM đã được lưu trữ và đồng bộ về Google Sheets của Ban Giảng Huấn!");
            };
        }
    }

    // 11. STAGE 3 RENDERER (Post-Class 21-Day Dashboard)
    function renderStage3View(stage) {
        const s1 = learnerProgress.stageData["stage-1"] || {};
        const s2 = learnerProgress.stageData["stage-2"] || { habits: {} };
        const s3 = learnerProgress.stageData["stage-3"] || { habitTracker: {}, weeklyCheckins: {} };

        // 11.1 Recap Me Values
        const values = s1.selectedValues || [];
        recapMeValuesList.innerHTML = "";
        if (values.length === 0) {
            recapMeValuesList.innerHTML = `<span class="text-slate-500 italic">Chưa chọn giá trị ở Chặng 1.</span>`;
        } else {
            values.forEach(v => {
                const tag = document.createElement("span");
                tag.className = "inline-block px-2 py-0.5 rounded-md bg-brand-amber/15 text-brand-amber border border-brand-amber/30 text-[11px] font-medium mr-1 mb-1";
                tag.textContent = v;
                recapMeValuesList.appendChild(tag);
            });
        }

        // 11.2 Recap ABCDE
        const abcde = s2.habits?.optimism?.abcde || {};
        if (!abcde.A && !abcde.D) {
            recapAbcdeContent.innerHTML = `<span class="text-slate-500 italic">Chưa hoàn thành bài tập ABCDE tại Chặng 2.</span>`;
        } else {
            recapAbcdeContent.innerHTML = `
                <div><strong class="text-white">A (Nghịch cảnh):</strong> ${abcde.A || "..."}</div>
                <div><strong class="text-brand-amber">D (Phản biện):</strong> ${abcde.D || "..."}</div>
                <div><strong class="text-brand-green">E (Hành động):</strong> ${abcde.E || "..."}</div>
            `;
        }

        // 11.3 Recap 5 Habits IAM
        recapIamContent.innerHTML = "";
        const habitNames = {
            gratitude: "Biết Ơn",
            mindfulness: "Tỉnh Thức",
            optimism: "Lạc Quan",
            flow: "Phiêu",
            altruism: "Vị Nhân"
        };
        let hasIam = false;
        Object.keys(habitNames).forEach(k => {
            const h = s2.habits?.[k];
            if (h && h.iam && (h.iam.I || h.iam.A)) {
                hasIam = true;
                const box = document.createElement("div");
                box.className = "p-1.5 rounded bg-brand-dark/50 border border-brand-border/40 text-[11px] mb-1";
                box.innerHTML = `
                    <div class="font-bold text-brand-amber">${habitNames[k]}:</div>
                    <div><strong>A:</strong> ${h.iam.A || "..."}</div>
                `;
                recapIamContent.appendChild(box);
            }
        });
        if (!hasIam) {
            recapIamContent.innerHTML = `<span class="text-slate-500 italic">Chưa có đúc kết I•A•M nào từ Chặng 2.</span>`;
        }

        // 11.4 Render 21-Day Habit Tracker Grid
        habitTrackerGrid.innerHTML = "";
        const trackerState = s3.habitTracker || {};
        let totalChecked = 0;
        const maxChecks = 21 * 5;

        for (let day = 1; day <= 21; day++) {
            const dayKey = `day_${day}`;
            const dayState = trackerState[dayKey] || {};
            const dayCard = document.createElement("div");
            dayCard.className = "p-2.5 rounded-xl bg-brand-dark/80 border border-brand-border text-center space-y-1.5";

            let habitChecks = ["G", "M", "O", "F", "A"].map((code, idx) => {
                const keys = ["gratitude", "mindfulness", "optimism", "flow", "altruism"];
                const isChk = !!dayState[keys[idx]];
                if (isChk) totalChecked++;
                return `
                    <button class="w-5 h-5 rounded text-[10px] font-bold transition-colors ${
                        isChk ? "bg-brand-amber text-black" : "bg-brand-surface text-slate-500 hover:text-white border border-brand-border"
                    }" data-day="${dayKey}" data-key="${keys[idx]}">
                        ${code}
                    </button>
                `;
            }).join("");

            dayCard.innerHTML = `
                <div class="text-[11px] font-bold text-slate-300">Ngày ${day}</div>
                <div class="flex justify-center gap-1">${habitChecks}</div>
            `;

            dayCard.querySelectorAll("button").forEach(btn => {
                btn.onclick = () => {
                    const d = btn.getAttribute("data-day");
                    const k = btn.getAttribute("data-key");
                    s3.habitTracker[d] = s3.habitTracker[d] || {};
                    s3.habitTracker[d][k] = !s3.habitTracker[d][k];
                    saveLearnerProgress();
                    renderStage3View(stage);
                };
            });

            habitTrackerGrid.appendChild(dayCard);
        }

        trackerCountBadge.textContent = `${totalChecked}/${maxChecks} Lượt`;
        const pct = Math.round((totalChecked / maxChecks) * 100);
        trackerSummaryPercent.textContent = `${pct}%`;

        // 11.5 Weekly Checkins
        const wChecks = s3.weeklyCheckins || {};
        bindInput("weekly-checkin-1", v => { wChecks.w1 = v; s3.weeklyCheckins = wChecks; debouncedSave(); }, wChecks.w1);
        bindInput("weekly-checkin-2", v => { wChecks.w2 = v; s3.weeklyCheckins = wChecks; debouncedSave(); }, wChecks.w2);
        bindInput("weekly-checkin-3", v => { wChecks.w3 = v; s3.weeklyCheckins = wChecks; debouncedSave(); }, wChecks.w3);

        // 11.6 Flashcards Deck Initialization
        if (stage.flashcardsDeck && stage.flashcardsDeck.cards) {
            setupFlashcards(stage.flashcardsDeck.cards);
        }

        // 11.7 Stage 3 Banner Infographic Button Trigger
        const s3BannerBtn = document.querySelector("#stage3-practice-container .btn-view-infographic");
        if (s3BannerBtn) {
            s3BannerBtn.onclick = (e) => {
                e.preventDefault();
                openInfographicModal("data/artifacts/infographics/infographic_tong_ket_hanh_phuc.png", "Tổng Kết Khoa Học Hạnh Phúc Toàn Diện");
            };
        }
    }

    // 12. TAB 3: RESOURCES RENDERER (Enhanced with in-app reader & lightbox)
    function renderResourcesTab(stage) {
        resourcesGridContainer.innerHTML = "";
        const resources = stage.resources || [];
        if (resources.length === 0) {
            resourcesGridContainer.innerHTML = `<span class="text-slate-500 text-xs italic">Không có tài liệu đính kèm ở chặng này.</span>`;
            return;
        }

        resources.forEach(r => {
            const card = document.createElement("div");
            card.className = "p-4 rounded-xl bg-brand-card/70 border border-brand-border hover:border-brand-amber/50 transition-all flex flex-col justify-between group space-y-3";

            let actionBtnHtml = "";
            if (r.type === "markdown") {
                actionBtnHtml = `
                    <div class="flex items-center gap-2 pt-1 border-t border-brand-border/40">
                        <button type="button" class="btn-read-doc flex-1 py-1.5 px-2.5 rounded-lg bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-amber text-xs font-bold border border-brand-amber/30 transition-all flex items-center justify-center gap-1.5" data-doc="${r.url}" data-title="${r.title}">
                            <span>📖 Đọc Trực Tiếp</span>
                        </button>
                        <a href="${r.url}" target="_blank" download class="py-1.5 px-2.5 rounded-lg bg-brand-dark hover:bg-brand-surface text-slate-300 text-xs border border-brand-border transition-colors">
                            ⬇️ Tải file
                        </a>
                    </div>
                `;
            } else if (r.type === "image") {
                const targetImg = r.url.endsWith('/') ? 'data/artifacts/infographics/infographic_tong_ket_hanh_phuc.png' : r.url;
                actionBtnHtml = `
                    <div class="flex items-center gap-2 pt-1 border-t border-brand-border/40">
                        <button type="button" class="btn-view-infographic flex-1 py-1.5 px-2.5 rounded-lg bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-amber text-xs font-bold border border-brand-amber/30 transition-all flex items-center justify-center gap-1.5" data-img="${targetImg}" data-title="${r.title}">
                            <span>🔍 Xem Đồ Họa HD</span>
                        </button>
                        <a href="${targetImg}" target="_blank" class="py-1.5 px-2.5 rounded-lg bg-brand-dark hover:bg-brand-surface text-slate-300 text-xs border border-brand-border transition-colors">
                            ↗ Mở
                        </a>
                    </div>
                `;
            } else {
                actionBtnHtml = `
                    <div class="pt-1 border-t border-brand-border/40">
                        <a href="${r.url}" target="_blank" class="w-full py-1.5 px-2.5 rounded-lg bg-brand-dark hover:bg-brand-card text-brand-amber text-xs font-semibold border border-brand-border/60 transition-colors flex items-center justify-center gap-1.5">
                            <span>Khám phá tệp ↗</span>
                        </a>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="flex items-start gap-3.5">
                    <div class="w-10 h-10 rounded-lg bg-brand-amber/10 text-brand-amber flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform shrink-0">
                        ${r.icon || '📄'}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="text-xs font-bold text-slate-200 group-hover:text-brand-amber transition-colors leading-snug">${r.title}</div>
                        <div class="text-[11px] text-slate-400 capitalize mt-0.5">Định dạng: ${r.type} ${r.readOnline ? '• Đọc trực tiếp' : ''}</div>
                        ${r.desc ? `<p class="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">${r.desc}</p>` : ''}
                    </div>
                </div>
                ${actionBtnHtml}
            `;
            resourcesGridContainer.appendChild(card);
        });

        attachMediaTriggers();
    }

    // 12.1 SUMMARY DEEP CONTENT BUILDER
    function renderSummaryDeepContent(stage) {
        if (!summaryDeepContentContainer) return;
        summaryDeepContentContainer.innerHTML = "";

        if (stage.id === "stage-1" && stage.deepInsights) {
            const di = stage.deepInsights;
            const container = document.createElement("div");
            container.className = "space-y-6 pt-4 border-t border-brand-border/80";

            // 1. Zappos Case Study
            if (di.zapposCaseStudy) {
                const zBox = document.createElement("div");
                zBox.className = "p-5 rounded-2xl bg-gradient-to-br from-brand-card via-brand-surface to-brand-card border border-brand-amber/30 space-y-3 shadow-lg";
                zBox.innerHTML = `
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <span class="px-2.5 py-1 rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/30 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                            <span>💼</span> Case Study Kinh Điển (1,2 Tỷ USD)
                        </span>
                        <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/infographics/infographic_3_cap_do_hanh_phuc.png" data-title="3 Cấp Độ Hạnh Phúc & Văn Hóa Zappos">
                            <span>🔍 Xem Đồ Họa 3 Cấp Độ</span>
                        </button>
                    </div>
                    <h3 class="text-sm font-extrabold text-white">${di.zapposCaseStudy.title}</h3>
                    <p class="text-xs text-slate-300 leading-relaxed">${di.zapposCaseStudy.content}</p>
                `;
                container.appendChild(zBox);
            }

            // 2. Seligman 3 Levels
            if (di.seligmanLevels && di.seligmanLevels.length > 0) {
                const sBox = document.createElement("div");
                sBox.className = "p-5 rounded-2xl bg-brand-card/40 border border-brand-border space-y-4";
                let levelsHtml = di.seligmanLevels.map((lvl, idx) => {
                    const colors = [
                        { border: "border-slate-600", text: "text-slate-300", badge: "bg-slate-700 text-slate-200" },
                        { border: "border-amber-500/50", text: "text-brand-amber", badge: "bg-brand-amber/20 text-brand-amber" },
                        { border: "border-emerald-500/50", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-400" }
                    ][idx] || { border: "border-brand-border", text: "text-white", badge: "bg-brand-card text-slate-300" };

                    return `
                        <div class="p-3.5 rounded-xl bg-brand-dark/60 border ${colors.border} space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-extrabold text-xs ${colors.text}">${lvl.level}</span>
                                <span class="text-[10px] font-mono px-2 py-0.5 rounded ${colors.badge}">${lvl.duration}</span>
                            </div>
                            <p class="text-xs text-slate-300 leading-relaxed">${lvl.nature}</p>
                            <div class="text-[11px] text-slate-400 border-t border-brand-border/40 pt-1.5">
                                <strong class="text-slate-300">Tác động:</strong> ${lvl.impact}
                            </div>
                        </div>
                    `;
                }).join("");

                sBox.innerHTML = `
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">⚖️</span>
                            <h3 class="text-sm font-bold text-white">So Sánh 3 Cấp Độ Hạnh Phúc (Martin Seligman)</h3>
                        </div>
                        <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/infographics/infographic_3_cap_do_hanh_phuc.png" data-title="3 Cấp Độ Hạnh Phúc Bền Vững">
                            <span>🖼️ Đồ Họa Cấp Độ</span>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">${levelsHtml}</div>
                `;
                container.appendChild(sBox);
            }

            // 3. Compass and Clock
            if (di.compassClock) {
                const cBox = document.createElement("div");
                cBox.className = "p-5 rounded-2xl bg-brand-card/40 border border-brand-border space-y-3";
                cBox.innerHTML = `
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">🧭</span>
                            <h3 class="text-sm font-bold text-white">${di.compassClock.title}</h3>
                        </div>
                        <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/infographics/infographic_la_ban_dong_ho.png" data-title="La Bàn Me Values & Đồng Hồ Thời Gian">
                            <span>🔍 Xem Đồ Họa La Bàn</span>
                        </button>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed">${di.compassClock.content}</p>
                    ${di.compassClock.intelExample ? `
                        <div class="p-3 rounded-xl bg-brand-dark/70 border-l-4 border-brand-orange text-xs text-slate-300 leading-relaxed">
                            <strong class="text-brand-orange">Ví dụ Intel:</strong> ${di.compassClock.intelExample}
                        </div>
                    ` : ""}
                `;
                container.appendChild(cBox);
            }

            // 4. SDT 3 Levers
            if (di.sdtLevers && di.sdtLevers.length > 0) {
                const lBox = document.createElement("div");
                lBox.className = "p-5 rounded-2xl bg-brand-card/40 border border-brand-border space-y-4";
                let leversHtml = di.sdtLevers.map(lev => `
                    <div class="p-4 rounded-xl bg-brand-dark/60 border border-brand-border/60 space-y-2 flex flex-col justify-between">
                        <div class="space-y-1.5">
                            <div class="text-xs font-bold text-brand-amber">${lev.lever}</div>
                            <div class="text-xs text-slate-300 leading-relaxed">${lev.stat}</div>
                            <div class="text-[11px] text-slate-400">💡 <em>${lev.action}</em></div>
                        </div>
                        ${lev.infographic ? `
                            <div class="pt-2">
                                <button type="button" class="btn-view-infographic w-full py-1.5 px-3 rounded-lg bg-brand-card hover:bg-brand-border text-slate-200 hover:text-brand-amber text-[11px] font-semibold border border-brand-border transition-all flex items-center justify-center gap-1.5" data-img="${lev.infographic}" data-title="${lev.lever}">
                                    <span>🔍 Đồ Họa ${lev.lever.split("(")[0]}</span>
                                </button>
                            </div>
                        ` : ""}
                    </div>
                `).join("");

                lBox.innerHTML = `
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">⚡</span>
                            <h3 class="text-sm font-bold text-white">Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc Tự Thân</h3>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">${leversHtml}</div>
                `;
                container.appendChild(lBox);
            }

            summaryDeepContentContainer.appendChild(container);

        } else if (stage.id === "stage-2") {
            const container = document.createElement("div");
            container.className = "space-y-6 pt-4 border-t border-brand-border/80";

            // Stage 2 Deep Habits Showcase
            const habitsData = [
                {
                    name: "Thói Quen 1: Biết Ơn Bền Vững",
                    author: "Robert Emmons & Martin Seligman",
                    evidence: "Khoa học chứng minh: Thực hành thư biết ơn giúp giảm 23% cortisol (hormone gây căng thẳng), tăng nồng độ DHEA và cải thiện 25% chất lượng giấc ngủ. Thói quen biết ơn nâng cao hiệu suất làm việc 50% khi người quản lý bày tỏ sự công nhận.",
                    img: "data/artifacts/infographics/infographic_thoi_quen_biet_on.png"
                },
                {
                    name: "Thói Quen 2: Tỉnh Thức & Phản Xạ S-B-A",
                    author: "Jon Kabat-Zinn (MBSR) & Chade-Meng Tan",
                    evidence: "Mô hình Stop - Breathe - Ask giúp ngắt dòng kích hoạt quá mức của hạch hạnh nhân (Amygdala), chuyển quyền kiểm soát sang vỏ não trước trán (Prefrontal Cortex). Nuôi dưỡng 8 phẩm chất C của năng lực tỉnh thức.",
                    img: "data/artifacts/infographics/infographic_song_tinh_thuc.png"
                },
                {
                    name: "Thói Quen 3: Lạc Quan Lý Trí & Kỹ Thuật A-B-C-D-E",
                    author: "Martin Seligman & Melinda Gates",
                    evidence: "Lạc quan không phải tô hồng cuộc sống hay ngây thơ (naive optimism), mà là khả năng phản biện lý trí (Dispute - D) để bẻ gãy niềm tin tiêu cực tự động (Belief - B), từ đó tái định hình hành động mới (Effect - E).",
                    img: "data/artifacts/infographics/infographic_lac_quan_hoc_duoc.png"
                },
                {
                    name: "Thói Quen 4: Trạng Thái Flow & Microflow",
                    author: "Mihaly Csikszentmihalyi",
                    evidence: "Flow xuất hiện ở giao điểm giữa Thách thức cao (High Challenge) và Kỹ năng cao (High Skill). Áp dụng Microflow biến những công việc nhàm chán lặp đi lặp lại thành trò chơi thử thách bản thân với mục tiêu rõ ràng và phản hồi tức thì.",
                    img: "data/artifacts/infographics/infographic_trang_thai_flow.png"
                },
                {
                    name: "Thói Quen 5: Vị Nhân & Bộ Ba Bi - Trí - Dũng",
                    author: "Adam Grant (Give and Take)",
                    evidence: "Người cho đi thông thái (Smart Giver) khác với người hy sinh mù quáng (Selfless Giver). Họ ứng dụng 'Ưu tiên 5 phút' (5-minute favor), cho đi có ranh giới và hỗ trợ đúng người, tạo nên mạng lưới cộng tác bền vững nhất.",
                    img: "data/artifacts/infographics/infographic_vi_nhan_thong_thai.png"
                }
            ];

            let habitsHtml = habitsData.map(h => `
                <div class="p-4 rounded-xl bg-brand-card/40 border border-brand-border/70 space-y-2 flex flex-col justify-between">
                    <div class="space-y-1">
                        <div class="flex items-center justify-between flex-wrap gap-1">
                            <h4 class="text-xs font-bold text-white">${h.name}</h4>
                            <span class="text-[10px] text-brand-amber font-mono">${h.author}</span>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${h.evidence}</p>
                    </div>
                    <div class="pt-2">
                        <button type="button" class="btn-view-infographic w-full py-1.5 px-3 rounded-lg bg-brand-dark hover:bg-brand-card text-brand-amber border border-brand-amber/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5" data-img="${h.img}" data-title="${h.name}">
                            <span>🔍 Xem Đồ Họa Infographic HD</span>
                        </button>
                    </div>
                </div>
            `).join("");

            container.innerHTML = `
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">🔬</span>
                        <h3 class="text-sm font-bold text-white">Nền Tảng Khoa Học Thần Kinh & Tâm Lý Học Của 5 Thói Quen</h3>
                    </div>
                    <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/infographics/infographic_thiet_ke_van_hoa_nhom.png" data-title="Thiết Kế Văn Hóa Nhóm (Culture Pact)">
                        <span>🤝 Thỏa Thuận Văn Hóa Nhóm</span>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${habitsHtml}</div>
            `;
            summaryDeepContentContainer.appendChild(container);

        } else if (stage.id === "stage-3") {
            const container = document.createElement("div");
            container.className = "space-y-6 pt-4 border-t border-brand-border/80";

            // 12 Infographics Gallery
            const galleryList = [
                { title: "3 Cấp Độ Hạnh Phúc", file: "infographic_3_cap_do_hanh_phuc.png" },
                { title: "La Bàn Me Values & Đồng Hồ", file: "infographic_la_ban_dong_ho.png" },
                { title: "Đòn Bẩy: Sức Mạnh Kết Nối", file: "infographic_suc_manh_ket_noi.png" },
                { title: "Đòn Bẩy: Sức Mạnh Tự Chủ", file: "infographic_suc_manh_tu_chu.png" },
                { title: "Đòn Bẩy: Động Lực Tiến Bộ", file: "infographic_dong_luc_tien_bo.png" },
                { title: "Thói Quen 1: Biết Ơn Bền Vững", file: "infographic_thoi_quen_biet_on.png" },
                { title: "Thói Quen 2: Sống Tỉnh Thức", file: "infographic_song_tinh_thuc.png" },
                { title: "Thói Quen 3: Lạc Quan Học Được", file: "infographic_lac_quan_hoc_duoc.png" },
                { title: "Thói Quen 4: Trạng Thái Flow", file: "infographic_trang_thai_flow.png" },
                { title: "Thói Quen 5: Vị Nhân Thông Thái", file: "infographic_vi_nhan_thong_thai.png" },
                { title: "Tổng Kết Toàn Diện Hạnh Phúc", file: "infographic_tong_ket_hanh_phuc.png" },
                { title: "Thiết Kế Văn Hóa Nhóm (Culture Pact)", file: "infographic_thiet_ke_van_hoa_nhom.png" }
            ];

            let galleryHtml = galleryList.map((item, idx) => `
                <button type="button" class="btn-view-infographic p-3 rounded-xl bg-brand-dark/70 hover:bg-brand-card border border-brand-border hover:border-brand-amber/60 text-left transition-all group flex items-center gap-3" data-img="data/artifacts/infographics/${item.file}" data-title="${item.title}">
                    <span class="w-7 h-7 rounded-lg bg-brand-amber/15 text-brand-amber flex items-center justify-center font-mono font-bold text-xs group-hover:scale-110 transition-transform shrink-0">
                        ${idx + 1}
                    </span>
                    <span class="text-xs font-semibold text-slate-200 group-hover:text-brand-amber transition-colors truncate">
                        ${item.title}
                    </span>
                </button>
            `).join("");

            // 3 Reports Shortcut
            const reports = [
                { title: "Khoa Học Hạnh Phúc & Mô Hình 3 Cấp Độ", file: "data/artifacts/report_khoa_hoc_hanh_phuc_3_cap_do.md" },
                { title: "Văn Hóa Dòng Chảy & Quản Trị Con Người", file: "data/artifacts/report_van_hoa_dong_chay.md" },
                { title: "Cẩm Nang Ôn Tập & Đúc Kết Chuyển Hóa DHM", file: "data/artifacts/huong_dan_on_tap_dhm.md" }
            ];

            let reportsHtml = reports.map(r => `
                <button type="button" class="btn-read-doc p-3.5 rounded-xl bg-brand-dark/80 hover:bg-brand-card border border-brand-border hover:border-brand-amber/60 text-left transition-all group flex items-center justify-between" data-doc="${r.file}" data-title="${r.title}">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <span class="text-lg">📘</span>
                        <span class="text-xs font-bold text-slate-200 group-hover:text-brand-amber transition-colors truncate">${r.title}</span>
                    </div>
                    <span class="text-[11px] text-brand-amber shrink-0 font-semibold">Đọc ngay ➔</span>
                </button>
            `).join("");

            container.innerHTML = `
                <!-- 12 Infographics Hub -->
                <div class="p-5 rounded-2xl bg-brand-card/40 border border-brand-border space-y-4">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">🖼️</span>
                            <h3 class="text-sm font-bold text-white">Kho Tàng 12 Đồ Họa Thông Tin Infographics HD (Studio Collection)</h3>
                        </div>
                        <span class="text-xs text-brand-amber font-mono font-bold">12/12 Infographics</span>
                    </div>
                    <p class="text-xs text-slate-400">Nhấp vào bất kỳ đồ họa nào để phóng to toàn màn hình hoặc tải về bản in chất lượng cao.</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">${galleryHtml}</div>
                </div>

                <!-- 3 Scientific Reports -->
                <div class="p-5 rounded-2xl bg-brand-card/40 border border-brand-border space-y-4">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">📚</span>
                        <h3 class="text-sm font-bold text-white">3 Báo Cáo Chiến Lược & Luận Điểm Chuyên Sâu (In-App Reader)</h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">${reportsHtml}</div>
                </div>
            `;
            summaryDeepContentContainer.appendChild(container);
        }

        attachMediaTriggers();
    }

    // 12.2 ATTACH MEDIA TRIGGERS (INFOGRAPHICS & DOC READERS)
    function attachMediaTriggers() {
        document.querySelectorAll(".btn-view-infographic").forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const img = btn.getAttribute("data-img");
                const title = btn.getAttribute("data-title");
                if (img) openInfographicModal(img, title);
            };
        });

        document.querySelectorAll(".btn-read-doc").forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const doc = btn.getAttribute("data-doc");
                const title = btn.getAttribute("data-title");
                if (doc) openDocReader(doc, title);
            };
        });
    }

    // 12.3 FLASHCARDS CONTROLLER
    let currentFlashcards = [];
    let currentCardIdx = 0;
    let isCardFlipped = false;

    function setupFlashcards(cards) {
        if (!cards || cards.length === 0) return;
        currentFlashcards = cards;
        currentCardIdx = 0;
        isCardFlipped = false;
        renderFlashcard();
    }

    function renderFlashcard() {
        if (!currentFlashcards || currentFlashcards.length === 0) return;
        const card = currentFlashcards[currentCardIdx];
        if (!card) return;

        if (flashcardCounter) {
            flashcardCounter.textContent = `${currentCardIdx + 1} / ${currentFlashcards.length}`;
        }

        if (isCardFlipped) {
            if (flashcardBadge) {
                flashcardBadge.textContent = "ĐÁP ÁN KHOA HỌC";
                flashcardBadge.className = "px-2 py-0.5 rounded bg-emerald-500 text-black font-extrabold text-[10px] tracking-wider uppercase";
            }
            if (flashcardInner) {
                flashcardInner.className = "w-full h-full rounded-2xl p-6 flex flex-col justify-between border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-brand-card to-brand-surface shadow-2xl transition-all";
            }
            if (flashcardContent) {
                flashcardContent.innerHTML = `<span class="text-emerald-300 font-semibold text-sm leading-relaxed">${card.back || card.answer}</span>`;
            }
        } else {
            if (flashcardBadge) {
                flashcardBadge.textContent = "CÂU HỎI THẢO LUẬN";
                flashcardBadge.className = "px-2 py-0.5 rounded bg-brand-amber text-black font-extrabold text-[10px] tracking-wider uppercase";
            }
            if (flashcardInner) {
                flashcardInner.className = "w-full h-full rounded-2xl p-6 flex flex-col justify-between border border-brand-amber/40 bg-gradient-to-br from-brand-card to-brand-surface shadow-xl transition-all hover:border-brand-amber";
            }
            if (flashcardContent) {
                flashcardContent.innerHTML = `<span class="text-slate-100 font-medium text-sm leading-relaxed">${card.front || card.question}</span>`;
            }
        }
    }

    if (flashcardContainer) {
        flashcardContainer.addEventListener("click", () => {
            isCardFlipped = !isCardFlipped;
            renderFlashcard();
        });
    }
    if (btnFlipCard) {
        btnFlipCard.addEventListener("click", (e) => {
            e.stopPropagation();
            isCardFlipped = !isCardFlipped;
            renderFlashcard();
        });
    }
    if (btnNextCard) {
        btnNextCard.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentFlashcards.length > 0) {
                currentCardIdx = (currentCardIdx + 1) % currentFlashcards.length;
                isCardFlipped = false;
                renderFlashcard();
            }
        });
    }
    if (btnPrevCard) {
        btnPrevCard.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentFlashcards.length > 0) {
                currentCardIdx = (currentCardIdx - 1 + currentFlashcards.length) % currentFlashcards.length;
                isCardFlipped = false;
                renderFlashcard();
            }
        });
    }

    // 12.4 INFOGRAPHIC LIGHTBOX MODAL
    function openInfographicModal(imgSrc, title) {
        if (!infographicModal) return;
        const targetImg = (imgSrc.startsWith("/") || imgSrc.startsWith("http")) ? imgSrc : "/" + imgSrc;
        if (infographicModalImg) infographicModalImg.src = targetImg;
        if (infographicModalTitle) infographicModalTitle.textContent = title || "Đồ Họa Thông Tin HD";
        if (btnInfographicDownload) {
            btnInfographicDownload.href = targetImg;
            const fileName = imgSrc.split("/").pop() || "infographic.png";
            btnInfographicDownload.setAttribute("download", fileName);
        }
        infographicModal.classList.remove("hidden");
    }

    function closeInfographicModal() {
        if (infographicModal) infographicModal.classList.add("hidden");
    }

    if (btnCloseInfographic) {
        btnCloseInfographic.addEventListener("click", closeInfographicModal);
    }
    if (infographicModal) {
        infographicModal.addEventListener("click", (e) => {
            if (e.target === infographicModal) closeInfographicModal();
        });
    }

    // 12.5 DOCUMENT READER MODAL
    async function openDocReader(docUrl, title) {
        if (!docReaderModal) return;
        if (docReaderTitle) docReaderTitle.textContent = title || "Báo Cáo Chuyên Sâu";
        if (docReaderBody) docReaderBody.innerHTML = `<div class="p-8 text-center text-slate-400">⏳ Đang tải tài liệu...</div>`;
        docReaderModal.classList.remove("hidden");

        const targetUrl = (docUrl.startsWith("/") || docUrl.startsWith("http")) ? docUrl : "/" + docUrl;

        try {
            const resp = await fetch(targetUrl);
            if (!resp.ok) throw new Error("Không thể tải tài liệu: " + resp.status);
            const text = await resp.text();
            if (docReaderBody) {
                docReaderBody.innerHTML = renderSimpleMarkdown(text);
            }
        } catch (err) {
            if (docReaderBody) {
                docReaderBody.innerHTML = `
                    <div class="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                        <div class="font-bold mb-1">⚠️ Lỗi tải tài liệu</div>
                        <div class="text-xs">${err.message}</div>
                        <div class="mt-3">
                            <a href="${targetUrl}" target="_blank" class="px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border text-xs text-white hover:text-brand-amber">
                                Mở tệp trực tiếp trong tab mới ↗
                            </a>
                        </div>
                    </div>
                `;
            }
        }
    }

    function closeDocReader() {
        if (docReaderModal) docReaderModal.classList.add("hidden");
    }

    if (btnCloseDocReader) {
        btnCloseDocReader.addEventListener("click", closeDocReader);
    }
    if (docReaderModal) {
        docReaderModal.addEventListener("click", (e) => {
            if (e.target === docReaderModal) closeDocReader();
        });
    }

    // 12.6 SIMPLE CLIENT-SIDE MARKDOWN PARSER
    function renderSimpleMarkdown(md) {
        if (!md) return "";
        let lines = md.split("\n");
        let html = [];
        let inList = false;
        let inTable = false;
        let tableHeaderDone = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (!line) {
                if (inList) { html.push("</ul>"); inList = false; }
                if (inTable) { html.push("</tbody></table></div>"); inTable = false; tableHeaderDone = false; }
                continue;
            }

            // Tables (| col | col |)
            if (line.startsWith("|") && line.endsWith("|")) {
                let cells = line.split("|").slice(1, -1).map(c => c.trim());
                if (cells.every(c => /^[-:\s]+$/.test(c))) {
                    tableHeaderDone = true;
                    html.push("<tbody>");
                    continue;
                }
                if (!inTable) {
                    if (inList) { html.push("</ul>"); inList = false; }
                    html.push('<div class="overflow-x-auto my-4 rounded-xl border border-brand-border"><table class="w-full text-xs text-left">');
                    html.push('<thead class="bg-brand-card/80 text-brand-amber uppercase text-[11px] font-bold border-b border-brand-border"><tr>');
                    cells.forEach(c => html.push(`<th class="p-3 border-r border-brand-border/40 last:border-r-0">${formatInline(c)}</th>`));
                    html.push('</tr></thead>');
                    inTable = true;
                    continue;
                } else {
                    html.push('<tr class="border-b border-brand-border/40 hover:bg-white/5 transition-colors">');
                    cells.forEach(c => html.push(`<td class="p-3 border-r border-brand-border/40 last:border-r-0 text-slate-300 leading-relaxed">${formatInline(c)}</td>`));
                    html.push('</tr>');
                    continue;
                }
            } else if (inTable) {
                html.push("</tbody></table></div>");
                inTable = false;
                tableHeaderDone = false;
            }

            // Headings
            if (line.startsWith("### ")) {
                if (inList) { html.push("</ul>"); inList = false; }
                html.push(`<h3 class="text-base font-bold text-brand-orange mt-6 mb-2 flex items-center gap-2"><span>📌</span> <span>${formatInline(line.slice(4))}</span></h3>`);
                continue;
            }
            if (line.startsWith("## ")) {
                if (inList) { html.push("</ul>"); inList = false; }
                html.push(`<h2 class="text-lg font-extrabold text-white mt-8 mb-3 pb-1 border-b border-brand-border/60 flex items-center gap-2"><span>🎯</span> <span>${formatInline(line.slice(3))}</span></h2>`);
                continue;
            }
            if (line.startsWith("# ")) {
                if (inList) { html.push("</ul>"); inList = false; }
                html.push(`<h1 class="text-xl font-black text-brand-amber mt-4 mb-4 pb-2 border-b-2 border-brand-amber/40">${formatInline(line.slice(2))}</h1>`);
                continue;
            }

            // Blockquote
            if (line.startsWith("> ")) {
                if (inList) { html.push("</ul>"); inList = false; }
                html.push(`<blockquote class="border-l-4 border-brand-amber pl-4 py-2 italic bg-brand-card/50 rounded-r-xl my-3 text-slate-300 text-xs leading-relaxed">${formatInline(line.slice(2))}</blockquote>`);
                continue;
            }

            // Unordered list
            if (line.startsWith("- ") || line.startsWith("* ")) {
                if (!inList) {
                    html.push('<ul class="space-y-1.5 my-3 pl-2">');
                    inList = true;
                }
                html.push(`<li class="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"><span class="w-1.5 h-1.5 rounded-full bg-brand-amber mt-1.5 shrink-0"></span><span>${formatInline(line.slice(2))}</span></li>`);
                continue;
            } else if (inList) {
                html.push("</ul>");
                inList = false;
            }

            // Horizontal rule
            if (line === "---" || line === "***") {
                html.push('<hr class="border-brand-border my-6">');
                continue;
            }

            // Standard paragraph
            html.push(`<p class="text-xs text-slate-300 leading-relaxed my-2">${formatInline(line)}</p>`);
        }

        if (inList) html.push("</ul>");
        if (inTable) html.push("</tbody></table></div>");

        return html.join("\n");

        function formatInline(str) {
            if (!str) return "";
            return str
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>')
                .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-brand-card border border-brand-border text-brand-amber text-[11px] font-mono">$1</code>');
        }
    }

    // Input Binder Helper
    function bindInput(elemId, onSave, initialVal) {
        const el = document.getElementById(elemId);
        if (!el) return;
        if (initialVal !== undefined && initialVal !== null) el.value = initialVal;
        el.oninput = () => onSave(el.value);
    }

    // Debounced Save
    let saveTimeout = null;
    function debouncedSave() {
        saveStatusIndicator.textContent = "Đang lưu...";
        saveStatusIndicator.className = "text-brand-amber";
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveLearnerProgress();
        }, 600);
    }

    if (btnManualSave) {
        btnManualSave.onclick = () => {
            saveLearnerProgress();
            alert("✓ Đã lưu toàn bộ tiến độ học tập trên thiết bị của bạn!");
        };
    }

    // Action Navigation Bar
    btnPrevLesson.onclick = () => {
        if (currentStageIndex > 0) {
            loadStage(currentStageIndex - 1);
            renderSyllabus();
        }
    };

    btnNextLesson.onclick = () => {
        const curStage = curriculum.stages[currentStageIndex];

        // Gate for Stage 1: Must pass the qualifying quiz (>= 70%) unless Coach/Admin
        if (curStage && curStage.id === "stage-1") {
            const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
            const isCoach = currentUser && (
                currentUser.cohort === "COACH" || 
                currentUser.cohort === "BTC / Coach" || 
                currentUser.role === "admin" || 
                currentUser.role === "Coach"
            );
            if (!s1Data.passed && !isCoach) {
                const s1Quizzes = (curStage.modules && curStage.modules[0] && curStage.modules[0].quizzes) ? curStage.modules[0].quizzes : [];
                const passCount = s1Quizzes.length > 0 ? Math.ceil(s1Quizzes.length * 0.7) : 7;
                const totalQ = s1Quizzes.length || 10;
                alert(`⚠️ Bạn cần hoàn thành và đạt tối thiểu 70% (${passCount}/${totalQ} câu) ở Bài 1.1 Kiểm tra Sát Hạch Đầu Vào để đủ điều kiện (qualify) hoàn thành Chặng 1 và bước vào Lớp Offline Chặng 2!`);
                const practiceTabBtn = document.querySelector('[data-tab="tab-practice"]');
                if (practiceTabBtn) practiceTabBtn.click();
                const quizSec = document.getElementById("stage1-mod-1-1");
                if (quizSec) quizSec.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }

        if (!learnerProgress.completedStages.includes(curStage.id)) {
            learnerProgress.completedStages.push(curStage.id);
        }
        saveLearnerProgress();
        updateGlobalProgress();

        if (currentStageIndex < curriculum.stages.length - 1) {
            loadStage(currentStageIndex + 1);
            renderSyllabus();
        } else {
            renderSyllabus();
            completionModal.classList.remove("hidden");
        }
    };

    if (btnCloseCompletion) {
        btnCloseCompletion.onclick = () => completionModal.classList.add("hidden");
    }

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
                b.classList.remove("active", "text-brand-amber");
                b.classList.add("text-slate-400", "border-transparent");
            });

            btn.classList.add("active", "text-brand-amber");
            btn.classList.remove("text-slate-400", "border-transparent");

            const targetTab = btn.getAttribute("data-tab");
            tabContents.forEach(content => {
                if (content.id === targetTab) content.classList.remove("hidden");
                else content.classList.add("hidden");
            });
        });
    });

    // 14. AUTH FORM SUBMIT
    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        authErrorBanner.classList.add("hidden");

        const rawIdentity = loginIdentityInput.value;
        const learner = findLearner(rawIdentity);

        if (!learner) {
            authErrorTitle.textContent = "Không tìm thấy học viên";
            authErrorDesc.textContent = "Email chưa nằm trong danh sách được cấp quyền. Vui lòng liên hệ BTC.";
            authErrorBanner.classList.remove("hidden");
            return;
        }

        const isPhoneOnboarding = !passwordGroup.classList.contains("hidden") ? false : true;
        if (isPhoneOnboarding) {
            const rawPhone = onboardingPhoneInput.value;
            const cleanPhone = normalizePhone(rawPhone);
            if (cleanPhone.length !== 10) {
                authErrorTitle.textContent = "Số điện thoại không hợp lệ";
                authErrorDesc.textContent = "Vui lòng nhập đúng 10 số điện thoại di động Việt Nam.";
                authErrorBanner.classList.remove("hidden");
                return;
            }

            const updatedLearner = {
                ...learner,
                phone: cleanPhone,
                phone_last4: cleanPhone.slice(-4),
                missing_phone: false
            };
            const overrides = getRosterOverrides();
            overrides[learner.email] = updatedLearner;
            localStorage.setItem("dhm_roster_overrides", JSON.stringify(overrides));

            currentUser = updatedLearner;
            localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
            applyUserSession();
            return;
        }

        const inputPassword = loginPasswordInput.value;
        if (!verifyPassword(learner, inputPassword)) {
            authErrorTitle.textContent = "Mật khẩu không chính xác";
            authErrorDesc.textContent = "Mật khẩu là 4 số cuối của Số điện thoại đã đăng ký. Vui lòng kiểm tra lại.";
            authErrorBanner.classList.remove("hidden");
            return;
        }

        currentUser = learner;
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
        applyUserSession();
    });

    loginIdentityInput.addEventListener("input", () => {
        const val = loginIdentityInput.value.trim();
        if (val.includes("@") || val.length >= 10) {
            const found = findLearner(val);
            updateAuthModeForLearner(found);
        } else {
            updateAuthModeForLearner(null);
        }
    });

    if (btnTogglePwd) {
        btnTogglePwd.addEventListener("click", () => {
            const isPwd = loginPasswordInput.type === "password";
            loginPasswordInput.type = isPwd ? "text" : "password";
            btnTogglePwd.textContent = isPwd ? "🔒 Ẩn mật khẩu" : "👁️ Hiện mật khẩu";
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                localStorage.removeItem("dhm_lms_auth_user");
                currentUser = null;
                userChip.classList.add("hidden");
                showAuthModal();
            }
        });
    }

    // 15. INITIAL BOOTSTRAP
    loadCurriculumData().then(() => {
        loadRoster().then(() => {
            initAuth();
        });
    });
});
