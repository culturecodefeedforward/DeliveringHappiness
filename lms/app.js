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
                subtitle: "Khoa học Hạnh phúc • 3 Cấp độ • Định vị La Bàn (Me Values) • 3 Đòn Bẩy Hạnh Phúc",
                instructor: "",
                estimatedMinutes: 30,
                videoDuration: "7:27",
                videoUrl: "data/artifacts/the_explainer.mp4",
                videoTitle: "Video Explainer: Delivering Happiness Movement (Hệ Điều Hành Hạnh Phúc)",
                videoType: "mp4",
                subSections: [
                    { id: "sub-1-1", title: "Mục 1.1: Video Explainer & Kho Audio Bài Giảng", target: "video-player-container", tab: "tab-summary" },
                    { id: "sub-1-2", title: "Mục 1.2: Khoa Học Hạnh Phúc & 3 Cấp Độ", target: "stage1-mod-1-1", tab: "tab-practice" },
                    { id: "sub-1-3", title: "Mục 1.3: La Bàn Giá Trị Cốt Lõi Cá Nhân (Me Values)", target: "stage1-mod-1-2", tab: "tab-practice" },
                    { id: "sub-1-4", title: "Mục 1.4: 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)", target: "stage1-mod-1-3", tab: "tab-practice" },
                    { id: "sub-1-5", title: "Mục 1.5: Bài Kiểm Tra Vượt Chặng 1 (10 Câu Trắc Nghiệm)", target: "stage1-mod-quiz", tab: "tab-practice" }
                ],
                audios: [
                    { id: "a1-0", title: "0. Lời dẫn & Giới thiệu tổng quan", file: "data/artifacts/dh4_overview.mp3", duration: "2:45" },
                    { id: "a1-1", title: "1. Khoa học Hạnh phúc & Nền tảng tâm lý", file: "data/artifacts/khoa_hoc_hanh_phuc.mp3", duration: "41:30" },
                    { id: "a1-2", title: "2. Ba cấp độ hạnh phúc bền vững", file: "data/artifacts/ba_cap_do_ben_vung.mp3", duration: "39:50" },
                    { id: "a1-3", title: "3. Ẩn dụ Ba tầng lầu & Case Study Zappos", file: "data/artifacts/ba_tang_zappos.mp3", duration: "40:15" },
                    { id: "a1-4", title: "4. Hạnh phúc không khẩu hiệu", file: "data/artifacts/hanh_phuc_khong_khau_hieu.mp3", duration: "38:40" }
                ],
                summary: "Mọi hành động con người đều hội tụ về đích đến là Hạnh phúc (Aristotle). Tuy nhiên, não bộ rất nhanh thích nghi với Thú vui ngắn hạn do cơ chế thích nghi khoái lạc (Hedonic Adaptation). Để bền vững, ta cần nâng cấp lên sự Đam mê dấn thân (The Engaged Life) và Mục đích cao cả (Higher Purpose).",
                insights: [
                    { title: "Cấp độ 1: Thú vui (Pleasure)", desc: "Nhanh nguội lạnh do cơ chế thích nghi khoái lạc. Tiền bạc, tiện nghi vật chất chỉ đem lại thỏa mãn nhất thời." },
                    { title: "Cấp độ 2: Đam mê (Passion / Engagement)", desc: "Hạnh phúc từ sự dấn thân, gắn kết sâu sắc và phát huy thế mạnh bản thân (Signature Strengths) từ động lực nội tại." },
                    { title: "Cấp độ 3: Mục đích cao cả (Higher Purpose)", desc: "Cấp độ bền vững nhất. Thấy công việc của mình có ý nghĩa, phụng sự và đóng góp giá trị cho cộng đồng." }
                ],
                modules: [
                    {
                        id: "mod-1-1",
                        title: "Bài 1.1: 3 Cấp Độ Hạnh Phúc",
                        quizzes: [
                            {
                                id: "dhm-quiz-1",
                                question: "Trong Cảm giác 'Tiến bộ'; yếu tố nào quan trọng nhất để duy trì động lực?",
                                options: [
                                    "Sự ghi nhận các bước tiến nhỏ (Small wins)",
                                    "Sự phê bình nghiêm khắc",
                                    "Phần thưởng lớn cuối năm",
                                    "Việc không bao giờ thất bại"
                                ],
                                correctIndex: 0,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 1: Sự ghi nhận các bước tiến nhỏ (Small wins)"
                            },
                            {
                                id: "dhm-quiz-2",
                                question: "Trong xây dựng văn hóa giao tiếp cởi mở và thấu hiểu không phán xét, An toàn tâm lý (Psychological Safety) đóng vai trò nền tảng cho đòn bẩy nào?",
                                options: [
                                    "Tự chủ (Control)",
                                    "Kết nối (Connectedness)",
                                    "Đam mê (Passion)",
                                    "Tiến bộ (Progress)"
                                ],
                                correctIndex: 1,
                                timeLimit: 20,
                                explanation: "An toàn tâm lý giúp mọi người dám cởi mở, lắng nghe không phán xét và gắn kết chân thực, là nền tảng cốt lõi của Cảm giác Kết nối (Connectedness). Đồng thời ở cấp độ tổ chức, nó cũng là tiền đề để nhân viên dám nói lên tiếng nói cá nhân (Tự chủ)."
                            },
                            {
                                id: "dhm-quiz-3",
                                question: "Trong công việc, cảm giác 'Tự chủ' (Control) được hiểu đúng nhất là:",
                                options: [
                                    "Có quyền lựa chọn và kiểm soát cách thực hiện công việc",
                                    "Được quyền ra lệnh cho người khác",
                                    "Không cần làm việc theo quy trình",
                                    "Làm việc một mình không cần ai giúp"
                                ],
                                correctIndex: 0,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 1: Có quyền lựa chọn và kiểm soát cách thực hiện công việc"
                            },
                            {
                                id: "dhm-quiz-4",
                                question: "Tại sao cảm giác 'Tiến bộ' (Progress) lại quan trọng hơn việc Đạt mục tiêu cuối cùng theo khoa học hạnh phúc?",
                                options: [
                                    "Vì các Small wins (chiến thắng nhỏ) tạo ra nguồn năng lượng liên tục giúp duy trì động lực",
                                    "Vì cảm giác tiến bộ giúp chúng ta không bị tác động bởi những thất bại tạm thời",
                                    "Vì việc đạt mục tiêu cuối cùng thường đi kèm với sự lo âu về việc phải đặt ra những mục tiêu cao hơn",
                                    "Vì tiến bộ là yếu tố duy nhất có thể đo lường được bằng các chỉ số định lượng trong quản trị nhân sự"
                                ],
                                correctIndex: 0,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 1: Vì các Small wins (chiến thắng nhỏ) tạo ra nguồn năng lượng liên tục giúp duy trì động lực"
                            },
                            {
                                id: "dhm-quiz-5",
                                question: "Khái niệm 'Psychological Safety' (An toàn tâm lý) đóng vai trò gì trong Cảm giác ‘Kết nối?",
                                options: [
                                    "Thiết lập một hệ thống kiểm soát nội bộ chặt chẽ để ngăn ngừa các hành vi gây mất đoàn kết trong nhóm",
                                    "Đảm bảo rằng mọi thành viên trong nhóm luôn có sự đồng thuận tuyệt đối và không bao giờ có tranh luận",
                                    "Cung cấp một chế độ bảo hiểm và phúc lợi đầy đủ để nhân viên cảm thấy an tâm về mặt tài chính cá nhân",
                                    "Tạo ra môi trường nơi mọi người dám chia sẻ sai lầm và thử nghiệm cái mới mà không sợ bị phán xét"
                                ],
                                correctIndex: 3,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 4: Tạo ra môi trường nơi mọi người dám chia sẻ sai lầm và thử nghiệm cái mới mà không sợ bị phán xét"
                            },
                            {
                                id: "dhm-quiz-6",
                                question: "Theo Delivering Happiness, đâu là 3 cấp độ hạnh phúc?",
                                options: [
                                    "Thú vui (Pleasure) - Đam mê (Passion) - Mục đích cao cả (Higher Purpose)",
                                    "Tiến bộ - Tự chủ - Kết nối",
                                    "Biết ơn - Flow - Lạc quan",
                                    "Giá trị - Hành vi - Văn hóa"
                                ],
                                correctIndex: 0,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 1: Thú vui (Pleasure) - Đam mê (Passion) - Mục đích cao cả (Higher Purpose)"
                            },
                            {
                                id: "dhm-quiz-7",
                                question: "Ai là người phát biểu câu nói:\n\"Xây dựng một văn hóa tuyệt vời và mọi thứ khác sẽ đi đúng hướng\"?",
                                options: [
                                    "Martin Seligman",
                                    "Aristotle",
                                    "Tony Hsieh",
                                    "Mihály Csíkszentmihályi"
                                ],
                                correctIndex: 2,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 3: Tony Hsieh"
                            },
                            {
                                id: "dhm-quiz-8",
                                question: "Đòn bẩy Kết nối được thể hiện qua hòa ái với:",
                                options: [
                                    "Với bản thân, với người khác và với thiên nhiên",
                                    "Với mục tiêu, với thành tích và với lợi nhuận",
                                    "Với tự chủ, với tiến bộ và với thành tựu",
                                    "Với tổ chức, với khách hàng và với quy trình"
                                ],
                                correctIndex: 0,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 1: Với bản thân, với người khác và với thiên nhiên"
                            },
                            {
                                id: "dhm-quiz-9",
                                question: "Đâu là biểu hiện của Ownership Advantage™ (Tinh thần làm chủ)?",
                                options: [
                                    "Cảm giác được chú ý và lắng nghe ý kiến",
                                    "Cảm giác được kết nối, tương tác và quan tâm đến người khác",
                                    "Được là chính mình trong môi trường làm việc",
                                    "Lựa chọn cá nhân trong việc chịu trách nhiệm về kết quả"
                                ],
                                correctIndex: 3,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 4: Lựa chọn cá nhân trong việc chịu trách nhiệm về kết quả"
                            },
                            {
                                id: "dhm-quiz-10",
                                question: "Theo tài liệu, tại sao nhiều mục tiêu như mua nhà, thăng chức hoặc kiếm nhiều tiền không đảm bảo hạnh phúc bền vững?",
                                options: [
                                    "Vì chúng làm giảm động lực nội tại.",
                                    "Vì chúng thường mang lại hạnh phúc trong ngắn hạn và khi đạt được ta nhanh chóng đặt mục tiêu mới.",
                                    "Vì chúng làm giảm cảm giác kết nối.",
                                    "Vì chúng làm suy yếu giá trị cốt lõi cá nhân."
                                ],
                                correctIndex: 1,
                                timeLimit: 20,
                                explanation: "Đáp án đúng là lựa chọn 2: Vì chúng thường mang lại hạnh phúc trong ngắn hạn và khi đạt được ta nhanh chóng đặt mục tiêu mới."
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
                        title: "Bài 1.2: La Bàn Giá Trị Cốt Lõi Cá Nhân — Personal Core Value Compass (Me Values)",
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
                        title: "Bài 1.3: 3 Đòn Bẩy Hạnh Phúc (Deci & Ryan)",
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
                    { title: "Đồ họa thông tin: Lộ Trình Khoa Học Hạnh Phúc: Từ Cá Nhân Đến Tổ Chức", type: "image", url: "data/artifacts/infographic.png", icon: "📊" },
                    { title: "Báo cáo: Khoa học Hạnh phúc & Dòng chảy Tổ chức", type: "markdown", url: "data/artifacts/report_dong_chay.md", icon: "📄" },
                    { title: "Thẻ ghi nhớ tương tác: Flashcards Hạnh Phúc", type: "html", url: "data/artifacts/flashcards", icon: "🃏" }
                ]
            },
            {
                id: "stage-2",
                stageNumber: 2,
                badge: "Mini Step 2 • Offline",
                title: "Mini step 2 • OFFLINE – Gieo Thói quen",
                subtitle: "Workshop Live tại lớp • Trạm thực hành 5 Thói quen Hạnh phúc & I•A•M",
                instructor: "",
                estimatedMinutes: 120,
                videoUrl: null,
                subSections: [
                    { id: "sub-2-1", title: "Mục 2.1: Thói Quen 1 — Tỉnh Thức (SBA & Body Scan + IAM)", target: "habit-panel-mindfulness", habit: "mindfulness", tab: "tab-practice" },
                    { id: "sub-2-2", title: "Mục 2.2: Thói Quen 2 — Biết Ơn (Gratitude Card + IAM)", target: "habit-panel-gratitude", habit: "gratitude", tab: "tab-practice" },
                    { id: "sub-2-3", title: "Mục 2.3: Thói Quen 3 — Lạc Quan Học Được (ABCDE + IAM)", target: "habit-panel-optimism", habit: "optimism", tab: "tab-practice" },
                    { id: "sub-2-4", title: "Mục 2.4: Thói Quen 4 — Phiêu / Flow (Thách thức vs Kỹ năng + IAM)", target: "habit-panel-flow", habit: "flow", tab: "tab-practice" },
                    { id: "sub-2-5", title: "Mục 2.5: Thói Quen 5 — Vị Nhân (Adam Grant Style + IAM)", target: "habit-panel-altruism", habit: "altruism", tab: "tab-practice" },
                    { id: "sub-2-6", title: "Mục 2.6: Thu Hoạch Tổng Lực Ngày Học (Capstone IAM)", target: "stage2-capstone-card", tab: "tab-practice" }
                ],
                audios: [
                    { id: "a2-1", title: "Đòn bẩy Tự chủ: 70.000 giờ làm việc", file: "data/artifacts/70000_gio_lam_viec.mp3", duration: "39:50" },
                    { id: "a2-2", title: "Đòn bẩy Kết nối: Thỏa thuận văn hóa", file: "data/artifacts/thoa_thuan_van_hoa.mp3", duration: "38:20" },
                    { id: "a2-3", title: "Thói quen 1 (Tỉnh thức): Âm thanh SBA", file: "data/artifacts/audio_mindful.mp3", duration: "35:10" },
                    { id: "a2-4", title: "Thói quen 2 (Biết ơn): Âm thanh thực hành", file: "data/artifacts/audio_biet_on.mp3", duration: "33:50" },
                    { id: "a2-5", title: "Thói quen 2 (Biết ơn): Biết ơn & Hiệu suất", file: "data/artifacts/biet_on_hieu_suat.mp3", duration: "41:10" },
                    { id: "a2-6", title: "Thói quen 3 (Lạc quan): Tư duy lạc quan", file: "data/artifacts/audio_lac_quan.mp3", duration: "24:25" },
                    { id: "a2-7", title: "Thói quen 3 (Lạc quan): Bài giảng ABCDE", file: "data/artifacts/lac_quan_abcde.mp3", duration: "41:35" },
                    { id: "a2-8", title: "Thói quen 4 (Flow): Trạng thái phiêu", file: "data/artifacts/audio_flow.mp3", duration: "31:45" },
                    { id: "a2-9", title: "Thói quen 4 (Flow): Làm việc 'phiêu'", file: "data/artifacts/lam_viec_phieu.mp3", duration: "41:30" },
                    { id: "a2-10", title: "Thói quen 5 (Vị nhân): Trái tim vị nhân", file: "data/artifacts/audio_vi_nhan.mp3", duration: "30:55" },
                    { id: "a2-11", title: "Thói quen 5 (Vị nhân): Người vị nhân & Nghịch lý tử tế", file: "data/artifacts/nguoi_vi_nhan.mp3", duration: "41:30" }
                ],
                habits: [
                    { id: "habit-mindfulness", name: "Tỉnh Thức" },
                    { id: "habit-gratitude", name: "Biết Ơn" },
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
                instructor: "",
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
                    { title: "Ngân Hàng 50+ Tình Huống & Công Cụ Thực Chiến ABCDE", type: "tool", url: "../practice-abcde.html", icon: "☀️", desc: "Công cụ luyện tập phản biện niềm tin tiêu cực (Disputation) tương tác trực tiếp." }
                ]
            }
        ]
    };

    // 2. CONFIGURATION & STATE OBJECT
    const LMS_CONFIG = {
        PHASE: 1,
        ENABLE_REMOTE_SYNC: false, // Phase 1: Local-only storage. Phase 2: Kích hoạt khi có Webhook chính thức
        AUTHORIZED_WEBHOOKS: []
    };

    let currentStageIndex = 0;
    let currentUser = null;
    let authorizedRoster = [];

    function getInitialLearnerProgress() {
        return {
            completedStages: [],
            stageData: {
                "stage-1": {
                    quizAnswers: {},
                    score: 0,
                    passed: false,
                    selectedValues: [],
                    iam_1_1: { I: "", A: "", M: "" },
                    iam_1_2: { I: "", A: "", M: "" },
                    iam_1_3: { I: "", A: "", M: "" },
                    scenarios: {}
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
    }

    let learnerProgress = getInitialLearnerProgress();

    // 3. DOM ELEMENTS
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebarBackdrop = document.getElementById("sidebar-backdrop");
    const syllabusList = document.getElementById("syllabus-list");
    const sidebarBadgeCompleted = document.getElementById("sidebar-badge-completed");
    const btnCollapseSidebarDesktop = document.getElementById("btn-collapse-sidebar-desktop");
    const btnSidebarDesktopExpand = document.getElementById("btn-sidebar-desktop-expand");

    const globalProgressBar = document.getElementById("global-progress-bar");
    const globalProgressText = document.getElementById("global-progress-text");
    const segmentBar1 = document.getElementById("segment-bar-1");
    const segmentBar2 = document.getElementById("segment-bar-2");
    const segmentBar3 = document.getElementById("segment-bar-3");
    const segmentLabel1 = document.getElementById("segment-label-1");
    const segmentLabel2 = document.getElementById("segment-label-2");
    const segmentLabel3 = document.getElementById("segment-label-3");

    const userChip = document.getElementById("user-chip");
    const userAvatar = document.getElementById("user-avatar");
    const userDisplayName = document.getElementById("user-display-name");
    const btnLogout = document.getElementById("btn-logout");
    const btnHeaderResume = document.getElementById("btn-header-resume");
    const heroQuizGateBanner = document.getElementById("hero-quiz-gate-banner");
    const summaryQuizGateBanner = document.getElementById("summary-quiz-gate-banner");

    // Quick Start Modal Elements
    const modalQuickStart = document.getElementById("modal-quick-start");
    const btnCloseQuickStart = document.getElementById("btn-close-quick-start");
    const btnQuickStartDismiss = document.getElementById("btn-quick-start-dismiss");
    const chkDontShowQuickStart = document.getElementById("chk-dont-show-quick-start");

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
    const pvIntegrationContainer = document.getElementById("pv-integration-container");
    const pvBannerNoTest = document.getElementById("pv-banner-notest");
    const pvTestResultCard = document.getElementById("pv-test-result-card");
    const pvResultMeta = document.getElementById("pv-result-meta");
    const pvTop7Badges = document.getElementById("pv-top7-badges");
    const btnApplyTop7Values = document.getElementById("btn-apply-top7-values");
    const abcdeScenarioSelect = document.getElementById("abcde-scenario-select");
    const btnGotoAbcdePractice = document.getElementById("btn-goto-abcde-practice");
    const abcdeIntegrationContainer = document.getElementById("abcde-integration-container");
    const abcdeBannerLanding = document.getElementById("abcde-banner-landing");
    const abcdeSyncCard = document.getElementById("abcde-sync-card");
    const abcdeSyncMeta = document.getElementById("abcde-sync-meta");
    const abcdeSyncPreviewA = document.getElementById("abcde-sync-preview-a");
    const abcdeSyncPreviewD = document.getElementById("abcde-sync-preview-d");
    const btnApplyLandingAbcde = document.getElementById("btn-apply-landing-abcde");

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

    // Hybrid Trial Auth Elements
    const trialOnboardingGroup = document.getElementById("trial-onboarding-group");
    const trialNameInput = document.getElementById("trial-name");
    const trialPhoneInput = document.getElementById("trial-phone");
    const trialConsentInput = document.getElementById("trial-consent");
    const btnRequestTrial = document.getElementById("btn-request-trial");
    const btnRequestTrialText = document.getElementById("btn-request-trial-text");
    const trialStatusMsg = document.getElementById("trial-status-msg");
    const submitAuthWrapper = document.getElementById("submit-auth-wrapper");
    const trialTriggerWrapper = document.getElementById("trial-trigger-wrapper");
    const btnShowTrialLead = document.getElementById("btn-show-trial-lead");
    const btnBackToLogin = document.getElementById("btn-back-to-login");

    // Trial Upgrade Modal Elements
    const trialUpgradeModal = document.getElementById("trial-upgrade-modal");
    const btnCloseUpgrade = document.getElementById("btn-close-upgrade");

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
        if (overrideEntry && !overrideEntry.missing_phone) return overrideEntry;

        // BẢO VỆ BẢN QUYỀN: Tuyệt đối không tự cấp quyền học viên chính thức cho email ngoài danh bạ
        return null;
    }

    function resetToDefaultLoginView() {
        if (authErrorBanner) authErrorBanner.classList.add("hidden");
        if (authUserDetected) authUserDetected.classList.add("hidden");
        if (passwordGroup) passwordGroup.classList.remove("hidden");
        if (loginPasswordInput) loginPasswordInput.setAttribute("required", "true");
        if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
        if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");
        if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
        if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
    }

    function updateAuthModeForLearner(learner) {
        if (!learner) {
            if (authUserDetected) authUserDetected.classList.add("hidden");
            // Mặc định luôn giữ ô password và nút submit
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
            if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
            return;
        }

        // Đã nhận diện Học viên Chính thức trong danh bạ Roster
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");
        if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
        if (authUserDetected) {
            authUserDetected.classList.remove("hidden");
            if (detectedUserName) detectedUserName.textContent = learner.name || learner.email;
            if (detectedUserCohort) detectedUserCohort.textContent = learner.cohort || "Học viên";
        }

        const hasPhone = learner.phone && learner.phone.trim().length >= 8 && !learner.missing_phone;
        if (!hasPhone) {
            if (passwordGroup) passwordGroup.classList.add("hidden");
            if (loginPasswordInput) loginPasswordInput.removeAttribute("required");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.remove("hidden");
            if (onboardingPhoneInput) onboardingPhoneInput.setAttribute("required", "true");
            if (btnSubmitText) btnSubmitText.textContent = "Kích Hoạt & Vào Học";
        } else {
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (loginPasswordInput) loginPasswordInput.setAttribute("required", "true");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
            if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
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

    async function checkUrlMagicLinkVerification() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const email = urlParams.get("email");
        const action = urlParams.get("action");

        if (token && (action === "verify" || action === "verify_token")) {
            try {
                window.history.replaceState({}, document.title, window.location.pathname);
                showAuthModal();

                if (authErrorBanner) {
                    authErrorBanner.className = "p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-1";
                    authErrorTitle.textContent = "⏳ Đang xác thực liên kết kích hoạt...";
                    authErrorDesc.textContent = "Hệ thống đang mở khóa quyền trải nghiệm Chặng 1 cho bạn. Vui lòng chờ vài giây.";
                    authErrorBanner.classList.remove("hidden");
                }

                const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
                const verifyEndpoint = `${webhookUrl}?action=verify_token&token=${encodeURIComponent(token)}&email=${encodeURIComponent(email || "")}`;

                const resp = await fetch(verifyEndpoint);
                const data = await resp.json();

                if (data && data.success && data.verified) {
                    const user = data.user || {};
                    currentUser = {
                        learner_id: user.lead_id || "TRIAL-" + Date.now().toString(36).toUpperCase(),
                        name: user.full_name || (email ? email.split("@")[0] : "Học viên Trải nghiệm"),
                        email: user.email || email,
                        phone: user.phone || "",
                        phone_last4: (user.phone || "").slice(-4),
                        cohort: "Học viên Trải nghiệm",
                        role: "trial",
                        isTrial: true
                    };
                    localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
                    if (authErrorBanner) authErrorBanner.classList.add("hidden");
                    applyUserSession();
                    alert("🎉 Xác thực thành công!\n\nChào mừng bạn đến với trải nghiệm học thử Chặng 1 (Pre-Class 90 phút) của Delivering Happiness LMS.");
                    return true;
                } else {
                    if (authErrorBanner) {
                        authErrorBanner.className = "p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs leading-relaxed space-y-1";
                        authErrorTitle.textContent = "Xác thực không thành công";
                        authErrorDesc.textContent = (data && data.message) ? data.message : "Liên kết kích hoạt đã hết hạn (1 giờ) hoặc không hợp lệ. Vui lòng thử lại.";
                    }
                    return false;
                }
            } catch (err) {
                console.warn("Magic link verification error:", err);
                if (authErrorBanner) {
                    authErrorBanner.className = "p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs leading-relaxed space-y-1";
                    authErrorTitle.textContent = "Lỗi kết nối";
                    authErrorDesc.textContent = "Không thể kết nối máy chủ xác thực. Vui lòng thử lại sau.";
                }
                return false;
            }
        }
        return false;
    }

    function showTrialUpgradeModal() {
        if (trialUpgradeModal) {
            trialUpgradeModal.classList.remove("hidden");
        }
    }

    function hideTrialUpgradeModal() {
        if (trialUpgradeModal) {
            trialUpgradeModal.classList.add("hidden");
        }
    }

    async function initAuth() {
        const isVerifiedFromUrl = await checkUrlMagicLinkVerification();
        if (isVerifiedFromUrl) {
            return;
        }

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
        resetToDefaultLoginView();
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
                learnerProgress = getInitialLearnerProgress();
            }
        } else {
            learnerProgress = getInitialLearnerProgress();
        }

        // Ensure proper schema
        if (!learnerProgress.stageData) learnerProgress.stageData = {};
        if (!learnerProgress.stageData["stage-1"]) {
            learnerProgress.stageData["stage-1"] = { selectedValues: [], iam_1_1: {}, iam_1_2: {}, iam_1_3: {}, scenarios: {} };
        }
        if (!learnerProgress.stageData["stage-1"].scenarios) {
            learnerProgress.stageData["stage-1"].scenarios = {};
        }
        if (!learnerProgress.stageData["stage-2"]) {
            learnerProgress.stageData["stage-2"] = { habits: {}, capstoneIam: {} };
        }
        if (!learnerProgress.stageData["stage-3"]) {
            learnerProgress.stageData["stage-3"] = { habitTracker: {}, weeklyCheckins: {} };
        }

        if (!isStageUnlocked(currentStageIndex)) {
            currentStageIndex = 0;
        }

        renderSyllabus();
        loadStage(currentStageIndex);
        updateGlobalProgress();
        evaluateLearnerStatus();
        showQuickStartIfNeeded();
    }

    function saveLearnerProgress() {
        if (!currentUser) return;
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        localStorage.setItem(progressKey, JSON.stringify(learnerProgress));

        recordLearnerInDirectory();
        syncToGoogleSheets();
        updateGlobalProgress();

        saveStatusIndicator.textContent = "✓ Đã lưu trên trình duyệt";
        saveStatusIndicator.className = "text-brand-green font-medium";
        setTimeout(() => {
            saveStatusIndicator.textContent = "✓ Đã lưu trên trình duyệt";
        }, 2000);
    }

    function syncToGoogleSheets() {
        if (!currentUser) return;
        if (!LMS_CONFIG.ENABLE_REMOTE_SYNC) {
            return;
        }
        const webhookUrl = LMS_CONFIG.AUTHORIZED_WEBHOOKS[0];
        if (!webhookUrl || !LMS_CONFIG.AUTHORIZED_WEBHOOKS.includes(webhookUrl)) {
            return;
        }

        const payload = {
            learner_id: currentUser.learner_id || "DHM-USER",
            name: currentUser.name || "",
            email: currentUser.email || currentUser.identity,
            phone: currentUser.phone || "",
            completed_stages: learnerProgress.completedStages,
            stage1_values: (learnerProgress.stageData && learnerProgress.stageData["stage-1"] && learnerProgress.stageData["stage-1"].selectedValues) || [],
            stage2_habits: (learnerProgress.stageData && learnerProgress.stageData["stage-2"] && learnerProgress.stageData["stage-2"].habits) || {},
            stage2_capstone: (learnerProgress.stageData && learnerProgress.stageData["stage-2"] && learnerProgress.stageData["stage-2"].capstoneIam) || {},
            stage3_tracker: (learnerProgress.stageData && learnerProgress.stageData["stage-3"] && learnerProgress.stageData["stage-3"].habitTracker) || {},
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

    // 5.5 STAGE UNLOCKING GATE (Cổng Vượt Chặng)
    function isStageUnlocked(stageIdx) {
        if (stageIdx === 0) return true; // Chặng 1 luôn luôn mở
        // Tài khoản học thử (Trial) bị khóa cứng tại Chặng 2 và Chặng 3
        if (currentUser && currentUser.isTrial) {
            return false;
        }
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        const isQuizPassed = Boolean(s1Data.passed || (s1Data.percentage >= 80));
        const isCoach = currentUser && (
            currentUser.cohort === "COACH" || 
            currentUser.cohort === "BTC / Coach" || 
            currentUser.role === "admin" || 
            currentUser.role === "Coach"
        );
        return Boolean(isQuizPassed || isCoach);
    }

    // 6. SYLLABUS RENDERER (Supports Sub-items Navigation & Locked Stages)
    function renderSyllabus() {
        syllabusList.innerHTML = "";
        curriculum.stages.forEach((stage, idx) => {
            const isUnlocked = isStageUnlocked(idx);
            const isCompleted = learnerProgress.completedStages.includes(stage.id);
            const isActive = idx === currentStageIndex;

            const stageBlock = document.createElement("div");
            stageBlock.className = "space-y-1";

            const item = document.createElement("button");
            item.className = `w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                !isUnlocked
                    ? "bg-brand-card/20 border-brand-border/40 text-slate-500 opacity-60 cursor-not-allowed"
                    : isActive
                    ? "bg-brand-amber/15 border-brand-amber text-white shadow-lg shadow-amber-500/10"
                    : isCompleted
                    ? "bg-brand-card/70 border-brand-green/30 text-slate-300 hover:border-brand-green/60"
                    : "bg-brand-card/40 border-brand-border text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`;

            const badgeHtml = !isUnlocked
                ? `<span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-brand-surface text-slate-500 border border-slate-700/60 flex items-center gap-1">🔒 Khóa</span>`
                : `<span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                    isActive ? "bg-brand-amber/20 text-brand-amber" : "bg-brand-surface text-slate-400"
                }">${stage.badge || 'Chặng ' + stage.stageNumber}</span>`;

            item.innerHTML = `
                <div class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    !isUnlocked
                        ? "bg-brand-surface text-slate-500 border border-brand-border/60"
                        : isCompleted
                        ? "bg-brand-green text-black"
                        : isActive
                        ? "bg-brand-amber text-black"
                        : "bg-brand-surface text-slate-400 border border-brand-border"
                }">
                    ${!isUnlocked ? "🔒" : isCompleted ? "✓" : stage.stageNumber}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                        ${badgeHtml}
                        ${isCompleted ? '<span class="text-[10px] text-brand-green font-semibold">Đã xong</span>' : ''}
                    </div>
                    <div class="text-xs font-bold truncate ${!isUnlocked ? 'text-slate-400' : 'text-slate-100'}">${stage.title}</div>
                    <div class="text-[11px] ${!isUnlocked ? 'text-slate-500' : 'text-slate-400'} truncate mt-0.5">${!isUnlocked ? 'Cần đạt ≥80% Cổng Vượt Chặng để mở khóa' : stage.subtitle}</div>
                </div>
                ${stage.subSections && stage.subSections.length > 0 ? `<span class="stage-toggle-chevron text-xs text-slate-400 shrink-0 transform transition-transform ${isActive ? 'rotate-90' : ''}">▸</span>` : ''}
            `;

            item.addEventListener("click", () => {
                if (!isUnlocked) {
                    if (currentUser && currentUser.isTrial) {
                        showTrialUpgradeModal();
                        toggleSidebar(false);
                        return;
                    }
                    alert("🔒 Chặng này đang bị khóa!\n\nBạn cần hoàn thành và đạt tối thiểu 80% ở Bài Kiểm Tra Vượt Chặng (Chặng 1) để mở khóa Chặng 2 và Chặng 3.");
                    jumpToStage1Quiz();
                    toggleSidebar(false);
                    return;
                }
                if (currentStageIndex === idx) {
                    const subEl = stageBlock.querySelector(".stage-subsections");
                    const chevron = item.querySelector(".stage-toggle-chevron");
                    if (subEl) {
                        subEl.classList.toggle("hidden");
                        if (chevron) {
                            chevron.classList.toggle("rotate-90", !subEl.classList.contains("hidden"));
                        }
                    }
                } else {
                    loadStage(idx);
                    renderSyllabus();
                    toggleSidebar(false);
                }
            });

            stageBlock.appendChild(item);

            // Subsections / Mục con tree for Stage (Collapsible Progressive Disclosure)
            if (stage.subSections && stage.subSections.length > 0) {
                const subContainer = document.createElement("div");
                subContainer.className = `stage-subsections ml-4 pl-3 border-l-2 border-brand-amber/40 space-y-1 py-1 ${isActive ? "" : "hidden"}`;

                stage.subSections.forEach(sub => {
                    const subBtn = document.createElement("button");
                    subBtn.className = `w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] ${
                        !isUnlocked 
                            ? "text-slate-500 opacity-60 cursor-not-allowed" 
                            : "text-slate-300 hover:text-brand-amber hover:bg-brand-card/80"
                    } transition-all flex items-center gap-2 group`;

                    // Check subsection completion status for visual badges (✓)
                    let isSubDone = false;
                    const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
                    if (sub.id === "sub-1-1") {
                        isSubDone = Boolean(s1Data.videoWatched || s1Data.audioListened);
                    } else if (sub.id === "sub-1-2") {
                        isSubDone = Boolean(s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i));
                    } else if (sub.id === "sub-1-3") {
                        isSubDone = Boolean((s1Data.selectedValues && s1Data.selectedValues.length > 0) && (s1Data.iam_1_2 && (s1Data.iam_1_2.I || s1Data.iam_1_2.i)));
                    } else if (sub.id === "sub-1-4") {
                        isSubDone = Boolean(s1Data.iam_1_3 && (s1Data.iam_1_3.I || s1Data.iam_1_3.i));
                    } else if (sub.id === "sub-1-5") {
                        isSubDone = Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);
                    }

                    const marker = !isUnlocked
                        ? `<span class="text-slate-500 text-[10px] shrink-0">🔒</span>`
                        : isSubDone 
                        ? `<span class="text-brand-green font-bold text-xs shrink-0">✓</span>`
                        : `<span class="w-1.5 h-1.5 rounded-full bg-brand-amber/50 group-hover:bg-brand-amber shrink-0 transition-colors"></span>`;

                    subBtn.innerHTML = `
                        ${marker}
                        <span class="truncate flex-1 ${isSubDone ? 'text-slate-200 font-medium' : ''}">${sub.title}</span>
                    `;

                    subBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        if (!isUnlocked) {
                            if (currentUser && currentUser.isTrial) {
                                showTrialUpgradeModal();
                                toggleSidebar(false);
                                return;
                            }
                            alert("🔒 Chặng này đang bị khóa!\n\nBạn cần hoàn thành và đạt tối thiểu 80% ở Bài Kiểm Tra Vượt Chặng (Chặng 1) để mở khóa Chặng 2 và Chặng 3.");
                            jumpToStage1Quiz();
                            toggleSidebar(false);
                            return;
                        }
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
                                if (el.classList.contains("accordion-module")) {
                                    openAccordionModule(el.id);
                                } else {
                                    const parentMod = el.closest(".accordion-module");
                                    if (parentMod) {
                                        openAccordionModule(parentMod.id);
                                    }
                                }
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

    // Desktop Collapsible Sidebar (LinkedIn Learning Focused Mode)
    if (btnCollapseSidebarDesktop) {
        btnCollapseSidebarDesktop.addEventListener("click", () => {
            sidebar.classList.add("sidebar-collapsed-desktop");
            if (btnSidebarDesktopExpand) {
                btnSidebarDesktopExpand.classList.remove("hidden");
                btnSidebarDesktopExpand.classList.add("flex");
            }
            localStorage.setItem("dhm_sidebar_desktop_collapsed", "true");
            localStorage.removeItem("dhm_sidebar_collapsed_desktop");
        });
    }

    if (btnSidebarDesktopExpand) {
        btnSidebarDesktopExpand.addEventListener("click", () => {
            sidebar.classList.remove("sidebar-collapsed-desktop");
            btnSidebarDesktopExpand.classList.add("hidden");
            btnSidebarDesktopExpand.classList.remove("flex");
            localStorage.removeItem("dhm_sidebar_desktop_collapsed");
            localStorage.removeItem("dhm_sidebar_collapsed_desktop");
        });
    }

    // Restore & Migration desktop sidebar preference on load
    (function initDesktopSidebar() {
        const legacyKey = localStorage.getItem("dhm_sidebar_collapsed_desktop");
        if (legacyKey === "true") {
            localStorage.setItem("dhm_sidebar_desktop_collapsed", "true");
            localStorage.removeItem("dhm_sidebar_collapsed_desktop");
        }
        if (localStorage.getItem("dhm_sidebar_desktop_collapsed") === "true" && window.innerWidth >= 1024) {
            sidebar.classList.add("sidebar-collapsed-desktop");
            if (btnSidebarDesktopExpand) {
                btnSidebarDesktopExpand.classList.remove("hidden");
                btnSidebarDesktopExpand.classList.add("flex");
            }
        }
    })();

    // Accordion Toggle for Model Solutions (Section 2)
    window.toggleModelAnswer = function(scenarioId) {
        const content = document.getElementById(`accordion-content-${scenarioId}`);
        const icon = document.getElementById(`accordion-icon-${scenarioId}`);
        if (!content) return;
        const isHidden = content.classList.contains("hidden");
        if (isHidden) {
            content.classList.remove("hidden");
            if (icon) {
                icon.textContent = "▲";
                icon.classList.add("rotate-180");
            }
        } else {
            content.classList.add("hidden");
            if (icon) {
                icon.textContent = "▼";
                icon.classList.remove("rotate-180");
            }
        }
    };

    // Smart Resume Learning & Status Evaluator (Idempotent 2-Way Renderer)
    function evaluateLearnerStatus() {
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        const isQuizPassed = Boolean(s1Data.passed || (s1Data.percentage >= 80));

        // 1. Auto-collapse / Refine Primary Hero Action Bar on Video (Idempotent 2-Way)
        if (heroQuizGateBanner) {
            if (isQuizPassed) {
                heroQuizGateBanner.className = "p-3 sm:p-3.5 rounded-2xl bg-brand-green/10 border border-brand-green/40 shadow-md flex items-center justify-between flex-wrap gap-2 transition-all";
                heroQuizGateBanner.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        <span class="w-8 h-8 rounded-lg bg-brand-green/20 text-brand-green flex items-center justify-center font-bold text-sm">✓</span>
                        <div>
                            <span class="text-[10px] uppercase font-bold text-brand-green tracking-wider">Đã Vượt Chặng 1</span>
                            <div class="text-xs sm:text-sm font-bold text-white">Bạn đã mở khóa Chặng 2 & Chặng 3 (${s1Data.score || 8}/${s1Data.totalQuestions || 10} câu)</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" id="btn-banner-resume-action" class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-extrabold text-xs shadow-md transition-all active:scale-95">
                            <span>▶ Tiếp Tục Bài Tập Tình Huống</span>
                        </button>
                    </div>
                `;
                const btnBannerAction = document.getElementById("btn-banner-resume-action");
                if (btnBannerAction) {
                    btnBannerAction.onclick = () => {
                        const tabTarget = document.querySelector('.tab-btn[data-tab="tab-practice"]');
                        if (tabTarget) tabTarget.click();
                        setTimeout(() => {
                            const el = document.getElementById("stage1-mod-1-1");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                    };
                }
            } else {
                heroQuizGateBanner.className = "p-3.5 sm:p-4 lg:p-5 rounded-2xl bg-gradient-to-r from-brand-amber/20 via-brand-surface to-brand-orange/20 border-2 border-brand-amber/50 shadow-2xl shadow-amber-500/15 flex items-center justify-between flex-wrap gap-3.5 sm:gap-4 transition-all";
                heroQuizGateBanner.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-amber flex items-center justify-center text-black text-xl sm:text-2xl font-extrabold shadow-md shrink-0">
                            🎯
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="px-2 py-0.5 rounded bg-brand-amber text-black font-extrabold text-[10px] uppercase tracking-wider shrink-0">Cổng Vượt Chặng 1</span>
                                <h3 class="text-xs sm:text-sm lg:text-base font-extrabold text-white truncate">BÀI KIỂM TRA VƯỢT CHẶNG (10 CÂU)</h3>
                                <span class="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber font-mono font-bold border border-brand-amber/30 shrink-0">
                                    Đạt ≥ 80%
                                </span>
                            </div>
                            <p class="text-xs text-slate-300 mt-0.5 sm:mt-1">
                                Xem video, hoàn thành các trạm học tập bên dưới, sau đó vượt qua bài test ở cuối Chặng 1 để mở Chặng 2.
                            </p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:justify-end">
                        <button id="btn-quick-roadmap" type="button" class="min-h-[44px] px-3 sm:px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-border text-slate-200 text-xs font-bold border border-brand-border transition-all flex items-center justify-center gap-1.5 shadow-sm text-center">
                            <span>📘 Lộ Trình & Hướng Dẫn</span>
                        </button>
                        <button id="btn-quick-quiz" type="button" class="min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 text-center">
                            <span>🎯 Đến Cổng Vượt Chặng ➔</span>
                        </button>
                    </div>
                `;
                const btnQuickQuiz = document.getElementById("btn-quick-quiz");
                if (btnQuickQuiz) {
                    btnQuickQuiz.onclick = () => {
                        const tabTarget = document.querySelector('.tab-btn[data-tab="tab-practice"]');
                        if (tabTarget) tabTarget.click();
                        setTimeout(() => {
                            openAccordionModule("stage1-mod-quiz");
                            const el = document.getElementById("stage1-mod-quiz");
                            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                    };
                }
                const btnQuickRoadmap = document.getElementById("btn-quick-roadmap");
                if (btnQuickRoadmap) {
                    btnQuickRoadmap.onclick = () => {
                        const modal = document.getElementById("modal-quick-start");
                        if (modal) modal.classList.remove("hidden");
                    };
                }
            }
        }

        // 2. Summary Quiz Gate Banner: Ẩn khi đạt, Hiện khi chưa đạt
        if (summaryQuizGateBanner) {
            if (isQuizPassed) {
                summaryQuizGateBanner.classList.add("hidden");
            } else {
                summaryQuizGateBanner.classList.remove("hidden");
            }
        }

        // 3. Configure Header Resume Button (Desktop only: ẩn hoàn toàn trên mobile để tránh trùng 2 nút test)
        if (btnHeaderResume) {
            btnHeaderResume.classList.add("hidden", "sm:flex");
            btnHeaderResume.classList.remove("flex");

            if (isQuizPassed) {
                btnHeaderResume.innerHTML = `<span>▶ Tiếp Tục Bài Tập</span>`;
                btnHeaderResume.onclick = () => {
                    const tabTarget = document.querySelector('.tab-btn[data-tab="tab-practice"]');
                    if (tabTarget) tabTarget.click();
                    setTimeout(() => {
                        const el = document.getElementById("stage1-mod-1-1");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                };
            } else {
                btnHeaderResume.innerHTML = `<span>▶ Tiếp Tục Học</span>`;
                btnHeaderResume.onclick = () => {
                    const tabTarget = document.querySelector('.tab-btn[data-tab="tab-practice"]');
                    if (tabTarget) tabTarget.click();
                    setTimeout(() => {
                        const el = document.getElementById("stage1-mod-1-1");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                };
            }
        }
    }

    // Quick Start Guide Modal Controller
    function showQuickStartIfNeeded() {
        if (!localStorage.getItem("dhm_seen_quick_start") && modalQuickStart) {
            setTimeout(() => {
                modalQuickStart.classList.remove("hidden");
            }, 600);
        }
    }

    function dismissQuickStart() {
        if (modalQuickStart) {
            modalQuickStart.classList.add("hidden");
        }
        if (chkDontShowQuickStart && chkDontShowQuickStart.checked) {
            localStorage.setItem("dhm_seen_quick_start", "true");
        }
    }

    if (btnCloseQuickStart) btnCloseQuickStart.addEventListener("click", dismissQuickStart);
    if (btnQuickStartDismiss) btnQuickStartDismiss.addEventListener("click", dismissQuickStart);

    // 7. LESSON / STAGE LOADER
    function loadStage(stageIdx) {
        if (!isStageUnlocked(stageIdx)) {
            if (currentUser && currentUser.isTrial) {
                showTrialUpgradeModal();
                currentStageIndex = 0;
                return;
            }
            alert("🔒 Chặng này đang bị khóa!\n\nBạn cần hoàn thành và đạt tối thiểu 80% ở Bài 1.4 Cổng Vượt Chặng (Chặng 1) để mở khóa Chặng 2 và Chặng 3.");
            currentStageIndex = 0;
            jumpToStage1Quiz();
            return;
        }
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
                    if (stage.id === "stage-1" && learnerProgress.stageData && learnerProgress.stageData["stage-1"]) {
                        learnerProgress.stageData["stage-1"].videoWatched = true;
                        saveLearnerProgress();
                        renderSyllabus();
                    }
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
        if (lessonInstructorBadge) {
            if (stage.instructor && stage.instructor.trim()) {
                lessonInstructorBadge.textContent = `👨‍🏫 ${stage.instructor}`;
                lessonInstructorBadge.classList.remove("hidden");
            } else {
                lessonInstructorBadge.classList.add("hidden");
            }
        }
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
            initAccordions();
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
            audioTrackSelect.disabled = true;
            audioTrackSubtitle.textContent = "Chặng này không có tệp âm thanh bổ trợ.";
            mainAudioSource.src = "";
            mainAudioPlayer.pause();
            mainAudioPlayer.load();
            mainAudioPlayer.classList.add("opacity-50", "pointer-events-none");
            return;
        }

        audioTrackSelect.disabled = false;
        mainAudioPlayer.classList.remove("opacity-50", "pointer-events-none");

        tracks.forEach((track, i) => {
            const opt = document.createElement("option");
            opt.value = track.file;
            opt.textContent = `${track.title} (${track.duration})`;
            audioTrackSelect.appendChild(opt);
        });

        audioTrackSubtitle.textContent = `${tracks.length} bài giảng âm thanh cho ${stage.badge || stage.title}`;

        // Set initial track
        mainAudioSource.src = tracks[0].file;
        mainAudioPlayer.load();

        audioTrackSelect.onchange = () => {
            if (currentStageIndex === 0 && learnerProgress.stageData && learnerProgress.stageData["stage-1"]) {
                learnerProgress.stageData["stage-1"].audioListened = true;
                saveLearnerProgress();
                renderSyllabus();
            }
            mainAudioSource.src = audioTrackSelect.value;
            mainAudioPlayer.load();
            mainAudioPlayer.play().catch(() => {});
        };

        mainAudioPlayer.onplay = () => {
            if (currentStageIndex === 0 && learnerProgress.stageData && learnerProgress.stageData["stage-1"]) {
                learnerProgress.stageData["stage-1"].audioListened = true;
                saveLearnerProgress();
                renderSyllabus();
            }
        };
    }

    // Attach Habit audio buttons in Stage 2
    document.querySelectorAll(".btn-play-habit-audio").forEach(btn => {
        btn.addEventListener("click", () => {
            const audioPath = btn.getAttribute("data-audio");
            if (audioPath) {
                // Ensure audio details is open if collapsed
                const audioDetails = document.getElementById("audio-player-details");
                if (audioDetails) audioDetails.open = true;

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

    // 8.1 Personal Values Test Sync Mapping & Controller
    const PV_TO_CURRICULUM_MAP = {
        "Tiến bộ": "Tiến bộ (luôn tiến lên phía trước, phát triển không ngừng)",
        "Sự thăng tiến": "Tiến bộ (luôn tiến lên phía trước, phát triển không ngừng)",
        "Thành công": "Thành công (đạt kết quả, hoàn thành nhiệm vụ)",
        "Thành tựu": "Thành công (đạt kết quả, hoàn thành nhiệm vụ)",
        "Sáng tạo": "Sáng tạo (nhạy cảm, nhiều sáng kiến, kinh nghiệm)",
        "Sự sáng tạo": "Sáng tạo (nhạy cảm, nhiều sáng kiến, kinh nghiệm)",
        "Sự chính trực": "Sự chính trực (trung thực, chân thành, sống theo giá trị của mình)",
        "Sự trung thực": "Sự chính trực (trung thực, chân thành, sống theo giá trị của mình)",
        "Hợp tác": "Hợp tác (làm việc theo tập thể, làm việc tốt với mọi người)",
        "Làm việc nhóm": "Hợp tác (làm việc theo tập thể, làm việc tốt với mọi người)",
        "Gắn kết cộng đồng": "Hợp tác (làm việc theo tập thể, làm việc tốt với mọi người)",
        "Trách nhiệm": "Trách nhiệm (có trách nhiệm, luôn đáng tin và chín chắn)",
        "Giúp đỡ": "Giúp đỡ (hỗ trợ những người xung quanh và cải thiện xã hội)",
        "Sự phục vụ": "Giúp đỡ (hỗ trợ những người xung quanh và cải thiện xã hội)",
        "Sự tĩnh tâm": "Sự tĩnh tâm (luôn bình thản thư giãn trong lòng)",
        "Bình yên": "Sự tĩnh tâm (luôn bình thản thư giãn trong lòng)",
        "Hạnh phúc gia đình": "Hạnh phúc gia đình (chung sống hòa thuận và coi trọng mọi thành viên)",
        "Gắn kết gia đình": "Hạnh phúc gia đình (chung sống hòa thuận và coi trọng mọi thành viên)",
        "Tình bạn": "Tình bạn (mật thiết, quan tâm và những mối quan hệ thân thuộc)",
        "Tình cảm": "Tình bạn (mật thiết, quan tâm và những mối quan hệ thân thuộc)",
        "Học vấn": "Học vấn (cam kết luôn lắng nghe, học hỏi)",
        "Học tập, phát triển": "Học vấn (cam kết luôn lắng nghe, học hỏi)",
        "Trí tuệ": "Học vấn (cam kết luôn lắng nghe, học hỏi)",
        "Đóng góp": "Đóng góp (tạo sự khác biệt, luôn cống hiến)",
        "Sự cống hiến": "Đóng góp (tạo sự khác biệt, luôn cống hiến)",
        "Độc lập": "Độc lập (tự quản, không chịu sự quản lý của ai)",
        "Tính Độc Lập": "Độc lập (tự quản, không chịu sự quản lý của ai)",
        "Tự do": "Độc lập (tự quản, không chịu sự quản lý của ai)",
        "Sự tự chủ": "Độc lập (tự quản, không chịu sự quản lý của ai)",
        "Công bằng": "Công bằng (đưa ra cơ hội đối với tất cả mọi người)",
        "Sự bình đẳng": "Công bằng (đưa ra cơ hội đối với tất cả mọi người)",
        "Sức khỏe": "Sức khỏe (cơ thể khỏe mạnh, đầy sinh lực và không có bệnh)",
        "Sức khoẻ": "Sức khỏe (cơ thể khỏe mạnh, đầy sinh lực và không có bệnh)",
        "Tha thứ": "Tha thứ (luôn sẵn sàng và rộng lượng)",
        "Bao dung/Tha thứ": "Tha thứ (luôn sẵn sàng và rộng lượng)",
        "Trung thành": "Trung thành (trách nhiệm, trung thành, tôn trọng)",
        "Sự cam kết": "Trung thành (trách nhiệm, trung thành, tôn trọng)",
        "Tính cân bằng": "Tính cân bằng (quan tâm sâu sắc đến từng lĩnh vực cuộc sống)",
        "Sự cân bằng": "Tính cân bằng (quan tâm sâu sắc đến từng lĩnh vực cuộc sống)",
        "Phát triển cá nhân": "Phát triển cá nhân (tăng trưởng, sử dụng mọi tiềm lực bản thân)",
        "Tự khám phá": "Phát triển cá nhân (tăng trưởng, sử dụng mọi tiềm lực bản thân)",
        "Chất lượng làm việc": "Chất lượng làm việc (xuất sắc, toàn diện, mắc rất ít lỗi)",
        "Môi trường làm việc": "Chất lượng làm việc (xuất sắc, toàn diện, mắc rất ít lỗi)",
        "Năng suất": "Chất lượng làm việc (xuất sắc, toàn diện, mắc rất ít lỗi)",
        "Tôn trọng bản thân": "Tôn trọng bản thân (tự hào về bản thân mình)",
        "Sự tự tin": "Tôn trọng bản thân (tự hào về bản thân mình)",
        "Lòng khoan dung": "Lòng khoan dung (coi trọng quan điểm và giá trị của người xung quanh)",
        "Tâm linh": "Tâm linh (có niềm tin mạnh mẽ, sức mạnh đạo đức đề cao)",
        "Tôn giáo/Tín ngưỡng": "Tâm linh (có niềm tin mạnh mẽ, sức mạnh đạo đức đề cao)",
        "Yêu thiên nhiên": "Yêu thiên nhiên (thoải mái hơn khi bước ra thiên nhiên)",
        "Thoải mái": "Thoải mái (hài lòng, thích thú, nhiều niềm vui và hạnh phúc)",
        "Niềm vui": "Thoải mái (hài lòng, thích thú, nhiều niềm vui và hạnh phúc)",
        "Sự hài hước": "Thoải mái (hài lòng, thích thú, nhiều niềm vui và hạnh phúc)",
        "Lãng mạn": "Thoải mái (hài lòng, thích thú, nhiều niềm vui và hạnh phúc)",
        "Kiềm chế": "Kiềm chế (chịu trách nhiệm, tự chủ cảm xúc)",
        "Lòng dũng cảm": "Kiềm chế (chịu trách nhiệm, tự chủ cảm xúc)",
        "An toàn": "An toàn (cảm thấy an tâm về mọi chuyện)",
        "Sự an toàn": "An toàn (cảm thấy an tâm về mọi chuyện)",
        "Sự công nhận": "Sự công nhận (về vị thế, sự tôn trọng và thừa nhận của người khác)",
        "Được ghi nhận": "Sự công nhận (về vị thế, sự tôn trọng và thừa nhận của người khác)",
        "Ảnh hưởng": "Ảnh hưởng (ý tưởng độc đáo, lan tỏa quy trình tích cực)",
        "Lãnh đạo": "Ảnh hưởng (ý tưởng độc đáo, lan tỏa quy trình tích cực)",
        "Tính đa dạng": "Tính đa dạng (đa dạng trong hành động và kinh nghiệm sống)",
        "Sự đa dạng": "Tính đa dạng (đa dạng trong hành động và kinh nghiệm sống)",
        "Tính phong phú": "Tính phong phú (hiểu cuộc sống xung quanh, ứng xử công minh)",
        "Linh hoạt/Thích ứng": "Tính phong phú (hiểu cuộc sống xung quanh, ứng xử công minh)",
        "Trật tự": "Trật tự (sự tuân thủ, kiên quyết với những sai trái)",
        "Tự kỷ luật": "Trật tự (sự tuân thủ, kiên quyết với những sai trái)",
        "Bảo đảm kinh tế": "Bảo đảm kinh tế (độc lập về những vấn đề tài chính)",
        "Thu nhập cao": "Bảo đảm kinh tế (độc lập về những vấn đề tài chính)",
        "Mạo hiểm": "Mạo hiểm (những mạo hiểm mới, đầy thách thức, hồi hộp)",
        "Phiêu lưu": "Mạo hiểm (những mạo hiểm mới, đầy thách thức, hồi hộp)",
        "Cạnh tranh": "Cạnh tranh (giành chiến thắng, luôn muốn vươn lên)",
        "Cảm nhận về nghệ thuật": "Cảm nhận về nghệ thuật (ca kịch, vẽ, văn học)",
        "Nổi tiếng": "Nổi tiếng (được nhiều người biết đến)",
        "Thanh thế": "Thanh thế (thể hiện qua sự thành công, địa vị, vị thế)",
        "Sức mạnh": "Sức mạnh (sự điều khiển, quyền lực, sức ảnh hưởng)",
        "Chính thống": "Chính thống (coi trọng quá khứ, phong tục tập quán)",
        "Tài sản": "Tài sản (giàu có, sung túc và đầy đủ)"
    };

    function loadPersonalValuesTestResult() {
        const bannerEl = document.getElementById("pv-banner-notest");
        const cardEl = document.getElementById("pv-test-result-card");
        const metaEl = document.getElementById("pv-result-meta");
        const badgesEl = document.getElementById("pv-top7-badges");
        const btnApplyEl = document.getElementById("btn-apply-top7-values");

        if (!bannerEl || !cardEl) return;

        let pvData = null;
        if (currentUser && currentUser.email) {
            const emailKey = "dhm_pv_" + encodeURIComponent(currentUser.email.toLowerCase().trim());
            const savedByEmail = localStorage.getItem(emailKey);
            if (savedByEmail) {
                try { pvData = JSON.parse(savedByEmail); } catch (e) {}
            }
        }
        if (!pvData) {
            const savedLatest = localStorage.getItem("dhm_personal_values_latest");
            if (savedLatest) {
                try { pvData = JSON.parse(savedLatest); } catch (e) {}
            }
        }

        if (pvData && pvData.top7 && Array.isArray(pvData.top7) && pvData.top7.length > 0) {
            bannerEl.classList.add("hidden");
            cardEl.classList.remove("hidden");

            const learnerName = pvData.fullName || (currentUser ? (currentUser.name || currentUser.email) : "Học viên");
            const dateStr = pvData.dateStr || (pvData.timestamp ? new Date(pvData.timestamp).toLocaleDateString("vi-VN") : "Gần đây");
            if (metaEl) {
                metaEl.textContent = `Học viên: ${learnerName} • Ngày test: ${dateStr}`;
            }

            if (badgesEl) {
                badgesEl.innerHTML = "";
                pvData.top7.forEach((item, idx) => {
                    const valName = typeof item === "string" ? item : (item.name || item);
                    const badge = document.createElement("span");
                    badge.className = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-amber/15 text-brand-amber border border-brand-amber/30 text-xs font-semibold";
                    badge.innerHTML = `<span class="w-4 h-4 rounded-full bg-brand-amber text-black text-[10px] font-extrabold flex items-center justify-center shrink-0">${idx + 1}</span><span>${valName}</span>`;
                    badgesEl.appendChild(badge);
                });
            }

            if (btnApplyEl) {
                btnApplyEl.onclick = () => {
                    const mod2 = (curriculum.stages[0]?.modules && curriculum.stages[0].modules[1]) ? curriculum.stages[0].modules[1] : null;
                    const availableOptions = (mod2 && mod2.valueOptions) ? mod2.valueOptions : [];

                    const mappedValues = [];
                    pvData.top7.forEach(item => {
                        const rawName = typeof item === "string" ? item : (item.name || item);
                        if (!rawName) return;

                        if (PV_TO_CURRICULUM_MAP[rawName]) {
                            mappedValues.push(PV_TO_CURRICULUM_MAP[rawName]);
                            return;
                        }
                        const exact = availableOptions.find(opt => opt === rawName);
                        if (exact) {
                            mappedValues.push(exact);
                            return;
                        }
                        const starts = availableOptions.find(opt => opt.toLowerCase().startsWith(rawName.toLowerCase()));
                        if (starts) {
                            mappedValues.push(starts);
                            return;
                        }
                        const incl = availableOptions.find(opt => opt.toLowerCase().includes(rawName.toLowerCase()));
                        if (incl) {
                            mappedValues.push(incl);
                            return;
                        }
                        mappedValues.push(rawName);
                    });

                    const uniqueMapped = Array.from(new Set(mappedValues));

                    if (!learnerProgress.stageData["stage-1"]) {
                        learnerProgress.stageData["stage-1"] = { selectedValues: [] };
                    }
                    learnerProgress.stageData["stage-1"].selectedValues = uniqueMapped;
                    saveLearnerProgress();
                    renderStage1View(curriculum.stages[0]);
                    renderSyllabus();

                    const originalHtml = btnApplyEl.innerHTML;
                    btnApplyEl.innerHTML = `<span>✓ Đã Áp Dụng Top 7!</span>`;
                    btnApplyEl.classList.remove("from-brand-orange", "to-brand-amber");
                    btnApplyEl.classList.add("bg-brand-green", "text-black");
                    setTimeout(() => {
                        btnApplyEl.innerHTML = originalHtml;
                        btnApplyEl.classList.add("from-brand-orange", "to-brand-amber");
                        btnApplyEl.classList.remove("bg-brand-green", "text-black");
                    }, 2500);

                    if (valuesGrid) {
                        valuesGrid.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                };
            }
        } else {
            bannerEl.classList.remove("hidden");
            cardEl.classList.add("hidden");
        }
    }

    function loadAbcdeLandingSync() {
        const bannerEl = document.getElementById("abcde-banner-landing");
        const cardEl = document.getElementById("abcde-sync-card");
        const metaEl = document.getElementById("abcde-sync-meta");
        const previewA = document.getElementById("abcde-sync-preview-a");
        const previewD = document.getElementById("abcde-sync-preview-d");
        const btnApplyEl = document.getElementById("btn-apply-landing-abcde");

        if (!bannerEl || !cardEl) return;

        let abcdeData = null;
        if (currentUser && currentUser.email) {
            const emailKey = "dhm_abcde_" + encodeURIComponent(currentUser.email.toLowerCase().trim());
            const savedByEmail = localStorage.getItem(emailKey);
            if (savedByEmail) {
                try { abcdeData = JSON.parse(savedByEmail); } catch (e) {}
            }
        }
        if (!abcdeData) {
            const savedLatest = localStorage.getItem("dhm_abcde_latest");
            if (savedLatest) {
                try { abcdeData = JSON.parse(savedLatest); } catch (e) {}
            }
        }

        if (abcdeData && (abcdeData.A || abcdeData.D || abcdeData.caseTitle)) {
            bannerEl.classList.add("hidden");
            cardEl.classList.remove("hidden");

            const caseTitle = abcdeData.caseTitle || abcdeData.caseId || "Tình huống thực tế";
            const dateStr = abcdeData.dateStr || (abcdeData.timestamp ? new Date(abcdeData.timestamp).toLocaleDateString("vi-VN") : "Gần đây");
            if (metaEl) {
                metaEl.textContent = `Tình huống: ${caseTitle} • Ngày làm: ${dateStr}`;
            }

            if (previewA) {
                previewA.textContent = abcdeData.A || "(Chưa có nội dung Nghịch cảnh)";
            }
            if (previewD) {
                previewD.textContent = abcdeData.D || "(Chưa có nội dung Phản biện)";
            }

            if (btnApplyEl) {
                btnApplyEl.onclick = () => {
                    const elA = document.getElementById("abcde-a");
                    const elB = document.getElementById("abcde-b");
                    const elC = document.getElementById("abcde-c");
                    const elD = document.getElementById("abcde-d");
                    const elE = document.getElementById("abcde-e");

                    const stage2 = learnerProgress.stageData["stage-2"] || { habits: {} };
                    stage2.habits = stage2.habits || {};
                    stage2.habits.optimism = stage2.habits.optimism || { abcde: {}, iam: {} };
                    const hO = stage2.habits.optimism;
                    hO.abcde = hO.abcde || {};

                    if (abcdeData.A) { hO.abcde.A = abcdeData.A; if (elA) elA.value = abcdeData.A; }
                    if (abcdeData.B) { hO.abcde.B = abcdeData.B; if (elB) elB.value = abcdeData.B; }
                    if (abcdeData.C) { hO.abcde.C = abcdeData.C; if (elC) elC.value = abcdeData.C; }
                    if (abcdeData.D) { hO.abcde.D = abcdeData.D; if (elD) elD.value = abcdeData.D; }
                    if (abcdeData.E) { hO.abcde.E = abcdeData.E; if (elE) elE.value = abcdeData.E; }

                    learnerProgress.stageData["stage-2"] = stage2;
                    saveLearnerProgress();
                    renderSyllabus();

                    const originalHtml = btnApplyEl.innerHTML;
                    btnApplyEl.innerHTML = `<span>✓ Đã Nạp Bài Tập!</span>`;
                    btnApplyEl.classList.remove("from-brand-orange", "to-brand-amber");
                    btnApplyEl.classList.add("bg-brand-green", "text-black");
                    setTimeout(() => {
                        btnApplyEl.innerHTML = originalHtml;
                        btnApplyEl.classList.add("from-brand-orange", "to-brand-amber");
                        btnApplyEl.classList.remove("bg-brand-green", "text-black");
                    }, 2500);

                    if (elA) {
                        elA.scrollIntoView({ behavior: "smooth", block: "center" });
                        elA.focus();
                    }
                };
            }
        } else {
            bannerEl.classList.remove("hidden");
            cardEl.classList.add("hidden");
        }
    }

    function syncAbcdeBackToLocalStorage(abcdeObj) {
        if (!abcdeObj) return;
        try {
            const payload = {
                source: "lms",
                caseId: "LMS_CHALLENGE",
                caseTitle: "Bài tập Chặng 2 (Micro-LMS)",
                A: abcdeObj.A || "",
                B: abcdeObj.B || "",
                C: abcdeObj.C || "",
                D: abcdeObj.D || "",
                E: abcdeObj.E || "",
                timestamp: new Date().toISOString(),
                dateStr: new Date().toLocaleDateString("vi-VN")
            };
            localStorage.setItem("dhm_abcde_latest", JSON.stringify(payload));
            if (currentUser && currentUser.email) {
                const emKey = "dhm_abcde_" + encodeURIComponent(currentUser.email.toLowerCase().trim());
                localStorage.setItem(emKey, JSON.stringify(payload));
            }
        } catch (e) {}
    }

    // 9. STAGE 1 RENDERER
    function renderStage1View(stage) {
        const sData = learnerProgress.stageData["stage-1"] || {};

        // 9.1 Render Quiz (Cổng Vượt Chặng 1 - 10 Câu - Đạt ≥80% - Tối đa 3 lần thử)
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
        const passed = percent >= 80;

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
                    <button class="quiz-opt-btn w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 min-h-[44px] ${btnClass}" data-qid="${q.id}" data-optidx="${optIdx}" ${disabledAttr}>
                        <span class="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-brand-card border border-brand-border shrink-0 mt-0.5">
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
                        learnerProgress.stageData["stage-1"].passed = (currPct >= 80);

                        saveLearnerProgress();
                        renderStage1View(stage);
                        renderSyllabus();
                        evaluateLearnerStatus();
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
                                <h4 class="text-sm font-extrabold text-brand-green">CHÚC MỪNG BẠN ĐÃ VƯỢT CHẶNG 1 THÀNH CÔNG!</h4>
                                <p class="text-xs text-slate-300 mt-0.5">Kết quả bài kiểm tra vượt chặng: <strong class="text-white">${correct}/${quizzes.length} câu đúng (${percent}%)</strong> — Đạt chuẩn ≥80% sau lần thử ${attempts}/${maxAttempts}, đã mở khóa Chặng 2 & Chặng 3.</p>
                            </div>
                        </div>
                    `;
                } else if (canRetry) {
                    quizSummaryContainer.className = "p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-3";
                    quizSummaryContainer.innerHTML = `
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="space-y-1">
                                <h4 class="text-sm font-extrabold text-brand-amber">CHƯA ĐẠT CHUẨN VƯỢT CHẶNG (≥80%)</h4>
                                <p class="text-xs text-slate-300">Bạn đạt <strong>${correct}/${quizzes.length} câu (${percent}%)</strong>. Tiêu chuẩn để mở khóa Chặng 2 là tối thiểu <strong>${Math.ceil(quizzes.length * 0.8)}/${quizzes.length} câu (≥80%)</strong>.</p>
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
                            renderSyllabus();
                            evaluateLearnerStatus();
                            quizItemsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        });
                    }
                } else {
                    quizSummaryContainer.className = "p-5 rounded-2xl bg-red-500/10 border border-red-500/40 space-y-3";
                    quizSummaryContainer.innerHTML = `
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">⚠️</span>
                            <div>
                                <h4 class="text-sm font-extrabold text-red-400">ĐÃ HẾT ${maxAttempts} LẦN THỬ — CHƯA ĐẠT 80%</h4>
                                <p class="text-xs text-slate-300 mt-0.5">Bạn đạt <strong>${correct}/${quizzes.length} câu (${percent}%)</strong> sau 3 lượt thử. Vui lòng liên hệ Đội ngũ Điều phối / Coach để được hướng dẫn ôn tập trước khi lên lớp Offline.</p>
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

            card.className = `min-h-[44px] p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${cardStyle}`;
            card.innerHTML = `
                <span class="text-xs font-medium leading-snug pr-2">${val}</span>
                <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isSelected ? "bg-brand-amber text-black" : "border border-brand-border text-transparent"}">
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
        loadPersonalValuesTestResult();

        // 9.3 IAM Inputs for Stage 1
        bindInput("iam-1-1-i", val => { sData.iam_1_1 = sData.iam_1_1 || {}; sData.iam_1_1.I = val; debouncedSave(); renderSyllabus(); }, sData.iam_1_1?.I);
        bindInput("iam-1-1-a", val => { sData.iam_1_1 = sData.iam_1_1 || {}; sData.iam_1_1.A = val; debouncedSave(); }, sData.iam_1_1?.A);
        bindInput("iam-1-1-m", val => { sData.iam_1_1 = sData.iam_1_1 || {}; sData.iam_1_1.M = val; debouncedSave(); }, sData.iam_1_1?.M);

        bindInput("iam-1-2-i", val => { sData.iam_1_2 = sData.iam_1_2 || {}; sData.iam_1_2.I = val; debouncedSave(); renderSyllabus(); }, sData.iam_1_2?.I);
        bindInput("iam-1-2-a", val => { sData.iam_1_2 = sData.iam_1_2 || {}; sData.iam_1_2.A = val; debouncedSave(); }, sData.iam_1_2?.A);
        bindInput("iam-1-2-m", val => { sData.iam_1_2 = sData.iam_1_2 || {}; sData.iam_1_2.M = val; debouncedSave(); }, sData.iam_1_2?.M);

        bindInput("iam-1-3-i", val => { sData.iam_1_3 = sData.iam_1_3 || {}; sData.iam_1_3.I = val; debouncedSave(); renderSyllabus(); }, sData.iam_1_3?.I);
        bindInput("iam-1-3-a", val => { sData.iam_1_3 = sData.iam_1_3 || {}; sData.iam_1_3.A = val; debouncedSave(); }, sData.iam_1_3?.A);
        bindInput("iam-1-3-m", val => { sData.iam_1_3 = sData.iam_1_3 || {}; sData.iam_1_3.M = val; debouncedSave(); }, sData.iam_1_3?.M);

        // 9.4 Practical Scenarios (Duy 3-Sections Model)
        sData.scenarios = sData.scenarios || {};
        sData.scenarios["scenario-1-1"] = sData.scenarios["scenario-1-1"] || {};
        bindInput("scenario-1-1-reflection", val => { sData.scenarios["scenario-1-1"].reflection = val; debouncedSave(); }, sData.scenarios["scenario-1-1"].reflection);
        bindInput("scenario-1-1-action", val => { sData.scenarios["scenario-1-1"].action = val; debouncedSave(); }, sData.scenarios["scenario-1-1"].action);

        sData.scenarios["scenario-1-2"] = sData.scenarios["scenario-1-2"] || {};
        bindInput("scenario-1-2-reflection", val => { sData.scenarios["scenario-1-2"].reflection = val; debouncedSave(); }, sData.scenarios["scenario-1-2"].reflection);
        bindInput("scenario-1-2-action", val => { sData.scenarios["scenario-1-2"].action = val; debouncedSave(); }, sData.scenarios["scenario-1-2"].action);

        sData.scenarios["scenario-1-3"] = sData.scenarios["scenario-1-3"] || {};
        bindInput("scenario-1-3-reflection", val => { sData.scenarios["scenario-1-3"].reflection = val; debouncedSave(); }, sData.scenarios["scenario-1-3"].reflection);
        bindInput("scenario-1-3-action", val => { sData.scenarios["scenario-1-3"].action = val; debouncedSave(); }, sData.scenarios["scenario-1-3"].action);

        evaluateLearnerStatus();
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
        hG.scenario = hG.scenario || {};
        bindInput("scenario-habit-gratitude-reflection", v => { hG.scenario.reflection = v; habits.gratitude = hG; debouncedSave(); }, hG.scenario.reflection);
        bindInput("scenario-habit-gratitude-action", v => { hG.scenario.action = v; habits.gratitude = hG; debouncedSave(); }, hG.scenario.action);
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
        hM.scenario = hM.scenario || {};
        bindInput("scenario-habit-mindfulness-reflection", v => { hM.scenario.reflection = v; habits.mindfulness = hM; debouncedSave(); }, hM.scenario.reflection);
        bindInput("scenario-habit-mindfulness-action", v => { hM.scenario.action = v; habits.mindfulness = hM; debouncedSave(); }, hM.scenario.action);
        bindInput("iam-mindfulness-i", v => { hM.iam.I = v; habits.mindfulness = hM; debouncedSave(); }, hM.iam.I);
        bindInput("iam-mindfulness-a", v => { hM.iam.A = v; habits.mindfulness = hM; debouncedSave(); }, hM.iam.A);
        bindInput("iam-mindfulness-m", v => { hM.iam.M = v; habits.mindfulness = hM; debouncedSave(); }, hM.iam.M);

        // 10.4 Habit 3: Optimism ABCDE
        const hO = habits.optimism || { abcde: {}, iam: {} };
        bindInput("abcde-a", v => { hO.abcde.A = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.A);
        bindInput("abcde-b", v => { hO.abcde.B = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.B);
        bindInput("abcde-c", v => { hO.abcde.C = v; habits.optimism = hO; debouncedSave(); }, hO.abcde.C);
        bindInput("abcde-d", v => { hO.abcde.D = v; habits.optimism = hO; debouncedSave(); syncAbcdeBackToLocalStorage(hO.abcde); }, hO.abcde.D);
        bindInput("abcde-e", v => { hO.abcde.E = v; habits.optimism = hO; debouncedSave(); syncAbcdeBackToLocalStorage(hO.abcde); }, hO.abcde.E);
        hO.scenario = hO.scenario || {};
        bindInput("scenario-habit-optimism-reflection", v => { hO.scenario.reflection = v; habits.optimism = hO; debouncedSave(); }, hO.scenario.reflection);
        bindInput("scenario-habit-optimism-action", v => { hO.scenario.action = v; habits.optimism = hO; debouncedSave(); }, hO.scenario.action);
        bindInput("iam-optimism-i", v => { hO.iam.I = v; habits.optimism = hO; debouncedSave(); }, hO.iam.I);
        bindInput("iam-optimism-a", v => { hO.iam.A = v; habits.optimism = hO; debouncedSave(); }, hO.iam.A);
        bindInput("iam-optimism-m", v => { hO.iam.M = v; habits.optimism = hO; debouncedSave(); }, hO.iam.M);

        // 10.4.1 Load Landing Page sync if available
        loadAbcdeLandingSync();

        // 10.5 Habit 4: Flow
        const hF = habits.flow || { iam: {} };
        bindInput("flow-boring-task", v => { hF.boringTask = v; habits.flow = hF; debouncedSave(); }, hF.boringTask);
        bindInput("flow-redesign", v => { hF.redesign = v; habits.flow = hF; debouncedSave(); }, hF.redesign);
        hF.scenario = hF.scenario || {};
        bindInput("scenario-habit-flow-reflection", v => { hF.scenario.reflection = v; habits.flow = hF; debouncedSave(); }, hF.scenario.reflection);
        bindInput("scenario-habit-flow-action", v => { hF.scenario.action = v; habits.flow = hF; debouncedSave(); }, hF.scenario.action);
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
        hA.scenario = hA.scenario || {};
        bindInput("scenario-habit-altruism-reflection", v => { hA.scenario.reflection = v; habits.altruism = hA; debouncedSave(); }, hA.scenario.reflection);
        bindInput("scenario-habit-altruism-action", v => { hA.scenario.action = v; habits.altruism = hA; debouncedSave(); }, hA.scenario.action);
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
                alert("✓ Toàn bộ bài tập 5 Thói quen & Capstone IAM đã được lưu trữ an toàn trên trình duyệt của bạn!\n\n(Lưu ý: Tính năng đồng bộ tự động về Google Sheets của hệ thống sẽ chính thức khả dụng trong Giai đoạn 2).");
            };
        }
    }

    // =========================================================================
    // STAGE 3 GAMIFICATION: STREAK ENGINE & BADGES (Tham chiếu READ10 Engine)
    // =========================================================================
    const STAGE3_BADGES = [
        {
            id: "seed_happiness",
            name: "Hạt Mầm Hạnh Phúc",
            days: 7,
            icon: "🌱",
            desc: "Hoàn thành 7 ngày liên tiếp (≥ 3/5 thói quen). Thói quen hạnh phúc bắt đầu bén rễ."
        },
        {
            id: "sprout_discipline",
            name: "Cây Kỷ Luật Vươn Mình",
            days: 14,
            icon: "🌿",
            desc: "Bền bỉ 14 ngày liên tiếp (≥ 3/5 thói quen). Kỷ luật vững vàng và lan tỏa."
        },
        {
            id: "dhm_champion",
            name: "Đại Sứ Hạnh Phúc",
            days: 21,
            icon: "🏆",
            desc: "Trọn vẹn 21 ngày chuyển hóa! Chúc mừng Đại Sứ Hạnh Phúc."
        }
    ];

    /**
     * Tính toán chỉ số Kỷ luật & Chuỗi liên tục (Stage 3 Streak Engine)
     * Ngày hoàn thành = tích chọn ≥ 3/5 thói quen (M-G-O-F-A)
     * @param {Object} habitTracker - Object day_1..day_21
     * @returns {Object} { currentStreak, longestStreak, totalCompletedDays, completedDaysSet }
     */
    function calculateStage3Streak(habitTracker) {
        const completedDays = [];
        const habitKeys = ["mindfulness", "gratitude", "optimism", "flow", "altruism"];

        for (let d = 1; d <= 21; d++) {
            const dayData = (habitTracker && habitTracker[`day_${d}`]) || {};
            const checkedCount = habitKeys.filter(k => !!dayData[k]).length;
            if (checkedCount >= 3) {
                completedDays.push(d);
            }
        }

        // 1. Tính longestStreak (chuỗi liên tiếp dài nhất trong toàn bộ 21 ngày)
        let longest = 0;
        let running = 0;
        let prev = null;
        for (const day of completedDays) {
            if (prev === null || day === prev + 1) {
                running++;
            } else {
                running = 1;
            }
            if (running > longest) longest = running;
            prev = day;
        }

        // 2. Tính currentStreak (đếm lùi từ ngày cao nhất đã hoàn thành)
        let current = 0;
        for (let i = completedDays.length - 1; i >= 0; i--) {
            if (i === completedDays.length - 1) {
                current = 1;
            } else if (completedDays[i] === completedDays[i + 1] - 1) {
                current++;
            } else {
                break;
            }
        }

        return {
            currentStreak: current,
            longestStreak: longest,
            totalCompletedDays: completedDays.length,
            completedDaysSet: new Set(completedDays)
        };
    }

    /**
     * Render Streak Hero Banner (Thống kê, Thanh tiến trình & Bộ 3 Huy hiệu)
     * @param {Object} streakStats - Kết quả từ calculateStage3Streak
     */
    function renderStage3StreakHero(streakStats) {
        const elCurrent = document.getElementById("streak-current");
        const elLongest = document.getElementById("streak-longest");
        const elTotal = document.getElementById("streak-total-days");
        const elNextLabel = document.getElementById("streak-next-label");
        const elProgressText = document.getElementById("streak-progress-text");
        const elProgressBar = document.getElementById("streak-progress-bar");
        const elCountdownText = document.getElementById("streak-countdown-text");
        const elBadgesRow = document.getElementById("streak-badges-row");

        if (!elCurrent || !elLongest || !elTotal || !elBadgesRow) return;

        // Cập nhật 3 chỉ số Stat
        elCurrent.textContent = streakStats.currentStreak;
        elLongest.textContent = streakStats.longestStreak;
        elTotal.textContent = streakStats.totalCompletedDays;

        // Xác định huy hiệu kế tiếp cần chinh phục theo currentStreak
        const nextBadge = STAGE3_BADGES.find(b => b.days > streakStats.currentStreak);

        if (nextBadge) {
            const daysLeft = nextBadge.days - streakStats.currentStreak;
            const pct = Math.min(100, Math.round((streakStats.currentStreak / nextBadge.days) * 100));
            if (elNextLabel) elNextLabel.textContent = `🎯 Mục tiêu: ${nextBadge.name}`;
            if (elProgressText) elProgressText.textContent = `${streakStats.currentStreak}/${nextBadge.days} ngày (${pct}%)`;
            if (elProgressBar) elProgressBar.style.width = `${pct}%`;
            if (elCountdownText) {
                elCountdownText.innerHTML = `Chỉ còn <strong class="text-white">${daysLeft} ngày</strong> tích cực liên tiếp nữa để mở khóa huy hiệu <span class="text-brand-amber">${nextBadge.icon} ${nextBadge.name}</span>!`;
            }
        } else {
            // Đã đạt mốc 21 ngày
            if (elNextLabel) elNextLabel.textContent = `🎉 Đỉnh cao 21 Ngày Hoàn Thành!`;
            if (elProgressText) elProgressText.textContent = `21/21 ngày (100%)`;
            if (elProgressBar) elProgressBar.style.width = `100%`;
            if (elCountdownText) {
                elCountdownText.innerHTML = `🏆 <strong class="text-emerald-400">Trọn vẹn 21 ngày chuyển hóa! Bạn là Đại Sứ Hạnh Phúc!</strong>`;
            }
        }

        // Render 3 Huy hiệu (Mở khóa theo longestStreak — "Thành tích cũ không mất")
        elBadgesRow.innerHTML = STAGE3_BADGES.map(b => {
            const isUnlocked = streakStats.longestStreak >= b.days;
            if (isUnlocked) {
                return `
                    <div class="flex-1 min-w-[100px] max-w-[180px] p-2.5 sm:p-3 rounded-xl bg-brand-amber/15 border border-brand-amber/40 text-center shadow-lg shadow-amber-500/10 transition-all group" title="${b.desc}">
                        <div class="text-2xl sm:text-3xl mb-1 filter drop-shadow group-hover:scale-110 transition-transform">${b.icon}</div>
                        <div class="text-xs font-bold text-brand-amber leading-tight">${b.name}</div>
                        <div class="text-[10px] text-amber-200/80 font-mono mt-0.5">${b.days} ngày ✓</div>
                    </div>
                `;
            } else {
                return `
                    <div class="flex-1 min-w-[100px] max-w-[180px] p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-center opacity-40 grayscale transition-all group hover:opacity-60" title="${b.desc}">
                        <div class="text-2xl sm:text-3xl mb-1 opacity-70">${b.icon}</div>
                        <div class="text-xs font-semibold text-slate-400 leading-tight">🔒 ${b.name}</div>
                        <div class="text-[10px] text-slate-500 font-mono mt-0.5">${b.days} ngày</div>
                    </div>
                `;
            }
        }).join("");
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

        const btnGotoAbcde = document.getElementById("btn-goto-abcde-practice");
        if (btnGotoAbcde) {
            btnGotoAbcde.onclick = () => {
                const el = document.getElementById("stage3-abcde-workout-container");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            };
        }

        // 11.2.1 Stage 3 ABCDE 6-Scenario Workout
        s3.dailyAbcde = s3.dailyAbcde || { scenarioId: "", A: "", B: "", C: "", D: "", E: "" };
        const dAbcde = s3.dailyAbcde;

        const s3Select = document.getElementById("stage3-abcde-scenario-select");
        const s3ElA = document.getElementById("stage3-abcde-a");
        const s3ElB = document.getElementById("stage3-abcde-b");
        const s3ElC = document.getElementById("stage3-abcde-c");
        const s3ElD = document.getElementById("stage3-abcde-d");
        const s3ElE = document.getElementById("stage3-abcde-e");
        const s3SaveStatus = document.getElementById("stage3-abcde-save-status");
        const s3BtnSave = document.getElementById("btn-save-stage3-abcde");

        const allScenarios = stage.abcdeScenarios || [
            {
                id: "scenario-1",
                category: "workplace",
                name: "Deadline chiều thứ Sáu & Trục trặc tích hợp (Công sở)",
                A: "16:30 chiều thứ Sáu, trước giờ bàn giao dự án cho khách hàng lớn, một lỗi tích hợp dữ liệu bất ngờ xuất hiện làm sập toàn bộ hệ thống báo cáo.",
                B: "Đội ngũ bất tài, dự án này coi như vứt đi, khách hàng sẽ cắt hợp đồng ngay lập tức và tôi sẽ mất hết uy tín trong công ty.",
                C: "Hoảng loạn tột độ, to tiếng quát mắng lập trình viên, muốn tắt điện thoại bỏ về để né tránh thực tại.",
                hintD: "Hít sâu 3 nhịp SBA. Lỗi này do xung đột tham số mới cập nhật hay lỗi cấu trúc? 95% tính năng cốt lõi vẫn đang chạy tốt. Khách hàng cần một giải pháp khẩn cấp trong 2 giờ tới, không phải sự hoảng loạn.",
                hintE: "Bình tĩnh kích hoạt quy trình rollback về phiên bản ổn định, triệu tập cuộc họp khẩn 10 phút phân công đúng chuyên gia rà soát log, và chủ động gửi thông báo trung thực kèm phương án dự phòng cho khách hàng."
            },
            {
                id: "scenario-2",
                category: "workplace",
                name: "Người đồng đội kéo tụt KPI nhóm (Công sở)",
                A: "Một thành viên chủ chốt liên tục nộp tài liệu muộn 3 ngày và sản phẩm chất lượng rất sơ sài, khiến cả nhóm bị trừ điểm đánh giá hiệu suất cuối tháng.",
                B: "Họ vô trách nhiệm, lười biếng và cố tình phá hoại nỗ lực của cả tập thể. Làm việc với người như thế này thì nhóm không bao giờ ngóc đầu lên được.",
                C: "Ức chế, cô lập thành viên đó trong nhóm chat, từ chối chia sẻ thông tin và định lên sếp lớn khiếu nại để đuổi việc.",
                hintD: "Đã bao giờ mình hỏi han xem họ đang gặp trở ngại gì chưa? Tháng trước họ vẫn là nhân viên xuất sắc. Sự chậm trễ này là do quá tải cá nhân hay sự cố gia đình?",
                hintE: "Hẹn riêng một buổi cà phê 20 phút với tinh thần thấu cảm: 'Tôi thấy dạo này bạn có vẻ áp lực, có điều gì tôi hoặc nhóm có thể hỗ trợ bạn không?' để cùng tháo gỡ nút thắt."
            },
            {
                id: "scenario-3",
                category: "workplace",
                name: "Ý tưởng cải tiến bị sếp gạt bỏ (Công sở)",
                A: "Trưởng phòng tâm huyết chuẩn bị đề xuất tự động hóa trong 2 tuần nhưng trong cuộc họp giao ban, ban lãnh đạo chỉ lướt qua 2 phút rồi gạt đi: 'Chưa phải lúc, tập trung làm việc hiện tại'.",
                B: "Sếp cổ hủ, công ty này không có đất cho sự đổi mới, công sức của mình chẳng bao giờ được ai ghi nhận.",
                C: "Chán nản, tự ái, quyết định từ nay chỉ làm đúng phận sự, không bao giờ đóng góp sáng kiến nào nữa.",
                hintD: "Ý tưởng mới cũng như đứa trẻ sơ sinh, cần được bao bọc và nuôi dưỡng. Sếp từ chối vì mô hình chưa đủ số liệu chứng minh ROI tài chính, không phải ghét cá nhân mình.",
                hintE: "Thu thập số liệu đo lường thực tế trong 1 tuần, làm thí điểm quy mô nhỏ (Proof of Concept) không tốn ngân sách rồi xin trình bày lại 10 phút với dữ liệu thuyết phục."
            },
            {
                id: "scenario-4",
                category: "workplace",
                name: "Tái cấu trúc tổ chức & Nỗi sợ tụt lại phía sau (Công sở)",
                A: "Công ty công bố sáp nhập hai phòng ban và chuyển đổi sang mô hình ứng dụng AI tự động hóa toàn diện, nhiều vị trí truyền thống đứng trước nguy cơ cắt giảm.",
                B: "Kỹ năng của mình đã lỗi thời, mình già rồi không thể cạnh tranh với lứa trẻ, sớm muộn gì cũng bị đào thải ra đường.",
                C: "Mất ngủ, hoang mang, đi làm trong tâm trạng ủ rũ lo sợ, giảm sút 50% năng suất làm việc mỗi ngày.",
                hintD: "AI và tái cấu trúc là xu thế khách quan của toàn cầu, không phải bản án nhắm riêng vào mình. Kinh nghiệm ngành sâu sắc của mình kết hợp với công cụ AI mới chính là đòn bẩy vô giá.",
                hintE: "Đăng ký ngay khóa học ứng dụng AI thực chiến, chủ động đề xuất trưởng bộ phận thử nghiệm công cụ mới vào tối ưu quy trình của chính mình trong 30 ngày."
            },
            {
                id: "scenario-5",
                category: "family",
                name: "Con cái điểm kém liên tục & Nỗi bất an của cha mẹ (Gia đình)",
                A: "Con trai mang bài kiểm tra học kỳ về với điểm 3 môn Toán, trong khi bạn bè cùng trang lứa đều đạt 8-9 điểm.",
                B: "Con mình hư hỏng, lười biếng, sau này sẽ không làm nên trò trống gì. Gia đình mình nuôi dạy con thất bại hoàn toàn.",
                C: "Tức giận lôi con ra mắng chửi thậm tệ, cấm toàn bộ đồ chơi, không khí gia đình u ám căng thẳng như địa ngục.",
                hintD: "Điểm 3 một môn thi chỉ phản ánh lỗ hổng kiến thức của một giai đoạn, không phản ánh nhân cách hay tương lai cả đời của con. Sự giận dữ của mình thực chất là nỗi sợ bị phán xét.",
                hintE: "Ôm con vào lòng, lắng nghe con chia sẻ khó khăn ở trường, cùng con lập kế hoạch ôn tập 30 phút mỗi tối và ghi nhận mọi nỗ lực tiến bộ nhỏ của con."
            },
            {
                id: "scenario-6",
                category: "family",
                name: "Kế hoạch gia đình bị hủy vào phút chót (Gia đình)",
                A: "Cả gia đình đã đặt vé đi nghỉ dưỡng cuối tuần sau cả tháng chờ đợi, nhưng sáng thứ Sáu đối tác quan trọng gọi điện yêu cầu xử lý sự cố gấp khiến chuyến đi bị hủy bỏ.",
                B: "Lúc nào công việc cũng cướp mất hạnh phúc gia đình. Bạn đời và con cái sẽ giận mình mãi mãi và coi mình là người ích kỷ.",
                C: "Cáu gắt với đối tác, bực bội với vợ/chồng, tự dằn vặt và hủy hoại luôn tâm trạng của cả hai ngày cuối tuần.",
                hintD: "Đây là tình huống bất khả kháng. Gia đình yêu thương mình và sẽ hiểu nếu mình chia sẻ chân thành bằng sự tôn trọng và tình yêu thương.",
                hintE: "Ngồi lại xin lỗi chân thành gia đình, cùng con tổ chức một buổi 'cắm trại mini tại phòng khách' với pizza và xem phim tối thứ Bảy, đồng thời đặt lịch dứt khoát cho chuyến đi bù vào tháng sau."
            }
        ];

        if (s3Select) {
            s3Select.value = dAbcde.scenarioId || "";
            s3Select.onchange = () => {
                const selId = s3Select.value;
                dAbcde.scenarioId = selId;
                if (!selId) {
                    if (s3ElD) s3ElD.placeholder = "Niềm tin B có đúng 100% không? Bằng chứng khách quan ngược lại là gì? Tôi có đang bị bẫy 3P (Cá nhân hóa - Toàn diện - Vĩnh viễn) không?";
                    if (s3ElE) s3ElE.placeholder = "Một hành động cụ thể và cảm xúc mới bạn sẽ thực hiện ngay hôm nay...";
                    debouncedSave();
                    return;
                }
                const sc = allScenarios.find(s => s.id === selId);
                if (sc) {
                    dAbcde.A = sc.A;
                    dAbcde.B = sc.B;
                    dAbcde.C = sc.C;
                    if (s3ElA) s3ElA.value = sc.A;
                    if (s3ElB) s3ElB.value = sc.B;
                    if (s3ElC) s3ElC.value = sc.C;
                    if (s3ElD) {
                        s3ElD.placeholder = `[Gợi ý phản biện D]: ${sc.hintD}`;
                        s3ElD.focus();
                    }
                    if (s3ElE) {
                        s3ElE.placeholder = `[Gợi ý hành động E]: ${sc.hintE}`;
                    }
                    debouncedSave();
                }
            };

            if (dAbcde.scenarioId) {
                const activeSc = allScenarios.find(s => s.id === dAbcde.scenarioId);
                if (activeSc) {
                    if (s3ElD && activeSc.hintD) s3ElD.placeholder = `[Gợi ý phản biện D]: ${activeSc.hintD}`;
                    if (s3ElE && activeSc.hintE) s3ElE.placeholder = `[Gợi ý hành động E]: ${activeSc.hintE}`;
                }
            }
        }

        bindInput("stage3-abcde-a", v => { dAbcde.A = v; debouncedSave(); }, dAbcde.A);
        bindInput("stage3-abcde-b", v => { dAbcde.B = v; debouncedSave(); }, dAbcde.B);
        bindInput("stage3-abcde-c", v => { dAbcde.C = v; debouncedSave(); }, dAbcde.C);
        bindInput("stage3-abcde-d", v => { dAbcde.D = v; debouncedSave(); }, dAbcde.D);
        bindInput("stage3-abcde-e", v => { dAbcde.E = v; debouncedSave(); }, dAbcde.E);

        if (s3BtnSave) {
            s3BtnSave.onclick = () => {
                s3.dailyAbcde = dAbcde;
                saveLearnerProgress();
                if (s3SaveStatus) {
                    s3SaveStatus.classList.remove("hidden");
                    setTimeout(() => s3SaveStatus.classList.add("hidden"), 3500);
                }
            };
        }

        // 11.3 Recap 5 Habits IAM
        recapIamContent.innerHTML = "";
        const habitNames = {
            mindfulness: "Tỉnh Thức",
            gratitude: "Biết Ơn",
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

        // 11.4 Render 21-Day Habit Tracker Grid (Heatmap 3 Tuần & Gamification)
        habitTrackerGrid.innerHTML = "";
        habitTrackerGrid.className = "space-y-4";
        const trackerState = s3.habitTracker || {};
        let totalChecked = 0;
        const maxChecks = 21 * 5;

        // Cấu trúc 3 tuần chuyển hóa
        const weeks = [
            { week: 1, label: "🌱 Tuần 1: Gieo Mầm", desc: "Khởi tạo thói quen & nhịp điệu (Mục tiêu: 7 ngày liên tục)", startDay: 1, endDay: 7 },
            { week: 2, label: "🌿 Tuần 2: Vươn Mình", desc: "Bền bỉ vượt thử thách & củng cố kỷ luật (Mục tiêu: 14 ngày)", startDay: 8, endDay: 14 },
            { week: 3, label: "🏆 Tuần 3: Chuyển Hóa", desc: "Khắc sâu phong cách sống & lan tỏa hạnh phúc (Mục tiêu: 21 ngày)", startDay: 15, endDay: 21 }
        ];

        weeks.forEach(w => {
            const weekContainer = document.createElement("div");
            weekContainer.className = "space-y-2 p-3 sm:p-3.5 rounded-xl bg-brand-dark/50 border border-brand-border/70";

            const weekHeader = document.createElement("div");
            weekHeader.className = "flex flex-wrap items-center justify-between gap-1 text-xs px-1";
            weekHeader.innerHTML = `
                <span class="font-bold text-brand-amber flex items-center gap-1.5">${w.label} (Ngày ${w.startDay} - ${w.endDay})</span>
                <span class="text-[11px] text-slate-400 italic">${w.desc}</span>
            `;
            weekContainer.appendChild(weekHeader);

            const gridRow = document.createElement("div");
            gridRow.className = "grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2";

            for (let day = w.startDay; day <= w.endDay; day++) {
                const dayKey = `day_${day}`;
                const dayState = trackerState[dayKey] || {};

                const habitKeys = ["mindfulness", "gratitude", "optimism", "flow", "altruism"];
                const checkedCount = habitKeys.filter(k => !!dayState[k]).length;
                totalChecked += checkedCount;

                // 4 Cấp độ sắc thái trực quan Heatmap
                let shadingClass = "bg-slate-800/60 border-slate-700/40"; // Cấp 0 (0/5: xám tối)
                if (checkedCount >= 5) {
                    shadingClass = "bg-brand-green/20 border-brand-green/60 shadow-sm shadow-green-500/20"; // Cấp 3 (5/5: xanh glow)
                } else if (checkedCount >= 3) {
                    shadingClass = "bg-amber-600/30 border-amber-500/50 shadow-sm shadow-amber-500/10"; // Cấp 2 (3-4/5: hổ phách đậm)
                } else if (checkedCount >= 1) {
                    shadingClass = "bg-amber-900/30 border-amber-700/40"; // Cấp 1 (1-2/5: hổ phách nhạt)
                }

                const isCompletedDay = checkedCount >= 3;
                const statusBadge = isCompletedDay
                    ? `<span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-brand-green/20 text-brand-green border border-brand-green/40">Đạt ✓</span>`
                    : `<span class="text-[10px] text-slate-500 font-mono">${checkedCount}/5</span>`;

                const dayCard = document.createElement("div");
                dayCard.className = `p-2.5 rounded-xl border text-center space-y-1.5 transition-all ${shadingClass}`;

                let habitChecks = ["M", "G", "O", "F", "A"].map((code, idx) => {
                    const k = habitKeys[idx];
                    const isChk = !!dayState[k];
                    return `
                        <button class="w-5 h-5 rounded text-[10px] font-bold transition-colors ${
                            isChk ? "bg-brand-amber text-black shadow-sm" : "bg-brand-surface text-slate-500 hover:text-white border border-brand-border"
                        }" data-day="${dayKey}" data-key="${k}" title="${k}">
                            ${code}
                        </button>
                    `;
                }).join("");

                dayCard.innerHTML = `
                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-300 px-0.5">
                        <span>Ngày ${day}</span>
                        ${statusBadge}
                    </div>
                    <div class="flex flex-wrap justify-center gap-1">${habitChecks}</div>
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

                gridRow.appendChild(dayCard);
            }

            weekContainer.appendChild(gridRow);
            habitTrackerGrid.appendChild(weekContainer);
        });

        trackerCountBadge.textContent = `${totalChecked}/${maxChecks} Lượt`;
        const pct = Math.round((totalChecked / maxChecks) * 100);
        trackerSummaryPercent.textContent = `${pct}%`;

        // Kích hoạt Streak Engine & Cập nhật Streak Hero Banner
        const streakStats = calculateStage3Streak(s3.habitTracker);
        renderStage3StreakHero(streakStats);

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
                openInfographicModal("data/artifacts/slides/slide_25.png", "Slide Bài Giảng: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hạnh Phúc");
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
            } else if (r.type === "tool") {
                actionBtnHtml = `
                    <div class="pt-1 border-t border-brand-border/40">
                        <a href="${r.url}" target="_blank" class="w-full py-1.5 px-2.5 rounded-lg bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-amber text-xs font-bold border border-brand-amber/30 transition-colors flex items-center justify-center gap-1.5">
                            <span>⚡ Mở Công Cụ Thực Chiến ↗</span>
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

        const deepDetails = summaryDeepContentContainer.closest("details.explore-more") || document.getElementById("summary-deep-content-details");
        const hasDeepInsights = Boolean(stage.id === "stage-1" && stage.deepInsights);
        if (deepDetails) {
            deepDetails.style.display = hasDeepInsights ? "" : "none";
        }

        if (hasDeepInsights) {
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
                        <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/slides/slide_16.png" data-title="Slide Bài Giảng: 3 Cấp Độ Hạnh Phúc (DHM)">
                            <span>📷 Xem Slide Bài Giảng DHM</span>
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
                        <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/slides/slide_16.png" data-title="Slide Bài Giảng: 3 Cấp Độ Hạnh Phúc (Martin Seligman)">
                            <span>📷 Xem Slide 3 Cấp Độ</span>
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
                        <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/slides/slide_23.png" data-title="Slide Bài Giảng: Giá Trị Cốt Lõi Cá Nhân (ME Values)">
                            <span>📷 Xem Slide La Bàn</span>
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
                                    <span>📷 Xem Slide ${lev.lever.split("(")[0]}</span>
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
                    img: "data/artifacts/slides/slide_27.png"
                },
                {
                    name: "Thói Quen 2: Tỉnh Thức & Phản Xạ S-B-A",
                    author: "Jon Kabat-Zinn (MBSR) & Chade-Meng Tan",
                    evidence: "Mô hình Stop - Breathe - Ask giúp ngắt dòng kích hoạt quá mức của hạch hạnh nhân (Amygdala), chuyển quyền kiểm soát sang vỏ não trước trán (Prefrontal Cortex). Nuôi dưỡng 8 phẩm chất C của năng lực tỉnh thức.",
                    img: "data/artifacts/slides/slide_27.png"
                },
                {
                    name: "Thói Quen 3: Lạc Quan Lý Trí & Kỹ Thuật A-B-C-D-E",
                    author: "Martin Seligman & Melinda Gates",
                    evidence: "Lạc quan không phải tô hồng cuộc sống hay ngây thơ (naive optimism), mà là khả năng phản biện lý trí (Dispute - D) để bẻ gãy niềm tin tiêu cực tự động (Belief - B), từ đó tái định hình hành động mới (Effect - E).",
                    img: "data/artifacts/slides/slide_27.png"
                },
                {
                    name: "Thói Quen 4: Trạng Thái Flow & Microflow",
                    author: "Mihaly Csikszentmihalyi",
                    evidence: "Flow xuất hiện ở giao điểm giữa Thách thức cao (High Challenge) và Kỹ năng cao (High Skill). Áp dụng Microflow biến những công việc nhàm chán lặp đi lặp lại thành trò chơi thử thách bản thân với mục tiêu rõ ràng và phản hồi tức thì.",
                    img: "data/artifacts/slides/slide_27.png"
                },
                {
                    name: "Thói Quen 5: Vị Nhân & Bộ Ba Bi - Trí - Dũng",
                    author: "Adam Grant (Give and Take)",
                    evidence: "Người cho đi thông thái (Smart Giver) khác với người hy sinh mù quáng (Selfless Giver). Họ ứng dụng 'Ưu tiên 5 phút' (5-minute favor), cho đi có ranh giới và hỗ trợ đúng người, tạo nên mạng lưới cộng tác bền vững nhất.",
                    img: "data/artifacts/slides/slide_27.png"
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
                            <span>📷 Xem Slide Bài Giảng DHM</span>
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
                    <button type="button" class="btn-view-infographic text-xs px-3 py-1 rounded-lg bg-brand-dark/70 hover:bg-brand-card text-brand-amber border border-brand-amber/30 transition-all flex items-center gap-1.5" data-img="data/artifacts/slides/slide_09.png" data-title="Slide Bài Giảng: Triết Lý Văn Hóa Zappos (Tony Hsieh)">
                        <span>📷 Xem Slide Văn Hóa (Tony Hsieh)</span>
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${habitsHtml}</div>
            `;
            summaryDeepContentContainer.appendChild(container);

        } else if (stage.id === "stage-3") {
            const container = document.createElement("div");
            container.className = "space-y-6 pt-4 border-t border-brand-border/80";

            // 12 Slides Gallery trích từ Slide chính thức của DHM (Đáp ứng Feedback Cô Châu)
            const galleryList = [
                { title: "Lộ Trình 3 Mini Step DHM", file: "slide_04.png" },
                { title: "Đội Ngũ Đồng Hành (Your Guides)", file: "slide_05.png" },
                { title: "Triết Lý Văn Hóa Tony Hsieh (Zappos)", file: "slide_09.png" },
                { title: "Mọi Mục Tiêu Đều Quy Về Hạnh Phúc (Chuỗi Câu Hỏi Tại Sao?)", file: "slide_14.png" },
                { title: "3 Cấp Độ Hạnh Phúc (Martin Seligman)", file: "slide_16.png" },
                { title: "Ẩn Dụ Ba Tầng Lầu (Phong Tử Khải)", file: "slide_17.png" },
                { title: "La Bàn Me Values (Giá Trị Cốt Lõi)", file: "slide_23.png" },
                { title: "Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy", file: "slide_25.png" },
                { title: "5 Thói Quen Hạnh Phúc Tự Thân", file: "slide_27.png" },
                { title: "Đòn Bẩy 1: Sống Hòa Ái (Kết Nối)", file: "slide_29.png" },
                { title: "Đòn Bẩy 2: Tự Chủ & An Toàn Tâm Lý", file: "slide_31.png" },
                { title: "Đòn Bẩy 3: Động Lực Tiến Bộ & Small Wins", file: "slide_38.png" }
            ];

            let galleryHtml = galleryList.map((item, idx) => `
                <button type="button" class="btn-view-infographic p-3 rounded-xl bg-brand-dark/70 hover:bg-brand-card border border-brand-border hover:border-brand-amber/60 text-left transition-all group flex items-center gap-3" data-img="data/artifacts/slides/${item.file}" data-title="${item.title}">
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
                            <h3 class="text-sm font-bold text-white">Kho Tàng 12 Slide Bài Giảng DHM Chính Thức (HD Presentation)</h3>
                        </div>
                        <span class="text-xs text-brand-amber font-mono font-bold">12/12 Slides</span>
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

    // Expose for inline HTML onclick handlers
    window.openInfographicModal = openInfographicModal;
    window.closeInfographicModal = closeInfographicModal;

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

        // Gate for Stage 1: Must pass the qualifying quiz (>= 80%) unless Coach/Admin
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
                const passCount = s1Quizzes.length > 0 ? Math.ceil(s1Quizzes.length * 0.8) : 8;
                const totalQ = s1Quizzes.length || 10;
                alert(`⚠️ Bạn cần hoàn thành và đạt tối thiểu 80% (${passCount}/${totalQ} câu) ở Bài Kiểm Tra Vượt Chặng để đủ điều kiện (qualify) hoàn thành Chặng 1 và bước vào Lớp Offline Chặng 2!`);
                const practiceTabBtn = document.querySelector('[data-tab="tab-practice"]');
                if (practiceTabBtn) practiceTabBtn.click();
                openAccordionModule("stage1-mod-quiz");
                const quizSec = document.getElementById("stage1-mod-quiz");
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
            if (currentUser && currentUser.isTrial && currentStageIndex === 0) {
                showTrialUpgradeModal();
                renderSyllabus();
                return;
            }
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

    function calculateStage1Progress() {
        if (learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-1")) {
            return 100;
        }
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        let count = 0;
        // Mốc 1 (20%): Video giới thiệu hoặc Audio podcast đã xem/nghe
        if (s1Data.videoWatched || s1Data.audioListened) count++;
        // Mốc 2 (20%): Hoàn thành phản tư I•A•M 1.1 (3 Cấp Độ Hạnh Phúc)
        if (s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i)) count++;
        // Mốc 3 (20%): Đã chọn ≥1 Giá trị La Bàn VÀ hoàn thành phản tư I•A•M 1.2
        if (s1Data.selectedValues && s1Data.selectedValues.length > 0 && s1Data.iam_1_2 && (s1Data.iam_1_2.I || s1Data.iam_1_2.i)) count++;
        // Mốc 4 (20%): Hoàn thành phản tư I•A•M 1.3 (3 Đòn Bẩy Hạnh Phúc)
        if (s1Data.iam_1_3 && (s1Data.iam_1_3.I || s1Data.iam_1_3.i)) count++;
        // Mốc 5 (20%): Đạt bài kiểm tra vượt chặng (≥8/10 câu hoặc ≥80%)
        if (s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80) count++;

        return Math.min(100, Math.round(count * 20));
    }

    function calculateStage2Progress() {
        if (learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-2")) {
            return 100;
        }
        const s2Data = (learnerProgress.stageData && learnerProgress.stageData["stage-2"]) || {};
        const habits = s2Data.habits || {};
        let count = 0;

        // 1. Gratitude
        const hG = habits.gratitude;
        if (hG && (
            (hG.items && hG.items.some(x => x && String(x).trim())) ||
            (hG.card && (hG.card.to || hG.card.msg)) ||
            (hG.iam && (hG.iam.I || hG.iam.A || hG.iam.M)) ||
            (hG.scenario && (hG.scenario.reflection || hG.scenario.action))
        )) count++;

        // 2. Mindfulness
        const hM = habits.mindfulness;
        if (hM && (
            (hM.sbaChecks && (hM.sbaChecks.s || hM.sbaChecks.b || hM.sbaChecks.a)) ||
            (hM.situation && String(hM.situation).trim()) ||
            (hM.iam && (hM.iam.I || hM.iam.A || hM.iam.M)) ||
            (hM.scenario && (hM.scenario.reflection || hM.scenario.action))
        )) count++;

        // 3. Optimism
        const hO = habits.optimism;
        if (hO && (
            (hO.abcde && (hO.abcde.A || hO.abcde.B || hO.abcde.C || hO.abcde.D || hO.abcde.E)) ||
            (hO.iam && (hO.iam.I || hO.iam.A || hO.iam.M)) ||
            (hO.scenario && (hO.scenario.reflection || hO.scenario.action))
        )) count++;

        // 4. Flow
        const hF = habits.flow;
        if (hF && (
            (hF.boringTask && String(hF.boringTask).trim()) ||
            (hF.redesign && String(hF.redesign).trim()) ||
            (hF.iam && (hF.iam.I || hF.iam.A || hF.iam.M)) ||
            (hF.scenario && (hF.scenario.reflection || hF.scenario.action))
        )) count++;

        // 5. Altruism
        const hA = habits.altruism;
        if (hA && (
            (hA.style && String(hA.style).trim()) ||
            (hA.act && String(hA.act).trim()) ||
            (hA.iam && (hA.iam.I || hA.iam.A || hA.iam.M)) ||
            (hA.scenario && (hA.scenario.reflection || hA.scenario.action))
        )) count++;

        return Math.min(100, Math.round(count * 20));
    }

    function calculateStage3Progress() {
        if (learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-3")) {
            return 100;
        }
        const s3Data = (learnerProgress.stageData && learnerProgress.stageData["stage-3"]) || {};
        const streakStats = calculateStage3Streak(s3Data.habitTracker || {});
        const days = (streakStats && streakStats.totalCompletedDays) || 0;
        return Math.min(100, Math.round((days / 21) * 100));
    }

    function updateStage1Milestones() {
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        const isS1Done = learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-1");

        const mVideoDone = isS1Done || Boolean(s1Data.videoWatched || s1Data.audioListened);
        const mLevelsDone = isS1Done || Boolean(s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i));
        const mValuesDone = isS1Done || Boolean((s1Data.selectedValues && s1Data.selectedValues.length > 0) && (s1Data.iam_1_2 && (s1Data.iam_1_2.I || s1Data.iam_1_2.i)));
        const mDriversDone = isS1Done || Boolean(s1Data.iam_1_3 && (s1Data.iam_1_3.I || s1Data.iam_1_3.i));
        const mQuizDone = isS1Done || Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);

        const doneCount = [mVideoDone, mLevelsDone, mValuesDone, mDriversDone, mQuizDone].filter(Boolean).length;
        const milestoneText = document.getElementById("stage1-milestone-text");
        if (milestoneText) {
            milestoneText.textContent = `${doneCount}/5 Hoàn thành`;
        }

        function setPill(id, done) {
            const el = document.getElementById(id);
            if (!el) return;
            const icon = el.querySelector(".m-pill-icon");
            if (done) {
                el.className = "px-2.5 py-1 rounded-lg border border-brand-green/50 bg-brand-green/10 text-brand-green font-medium flex items-center gap-1.5 transition-colors";
                if (icon) icon.textContent = "✓";
            } else {
                el.className = "px-2.5 py-1 rounded-lg border border-brand-border bg-brand-dark/70 text-slate-400 flex items-center gap-1.5 transition-colors";
                if (icon) icon.textContent = "○";
            }
        }

        setPill("m-pill-video", mVideoDone);
        setPill("m-pill-levels", mLevelsDone);
        setPill("m-pill-values", mValuesDone);
        setPill("m-pill-drivers", mDriversDone);
        setPill("m-pill-quiz", mQuizDone);
    }

    function openAccordionModule(moduleId) {
        const mod = document.getElementById(moduleId);
        if (!mod) return;
        const body = mod.querySelector(".accordion-body");
        const chevron = mod.querySelector(".accordion-chevron span");
        if (body) body.classList.remove("hidden");
        if (chevron) chevron.style.transform = "rotate(180deg)";
    }

    function closeAccordionModule(moduleId) {
        const mod = document.getElementById(moduleId);
        if (!mod) return;
        const body = mod.querySelector(".accordion-body");
        const chevron = mod.querySelector(".accordion-chevron span");
        if (body) body.classList.add("hidden");
        if (chevron) chevron.style.transform = "rotate(0deg)";
    }

    function autoOpenInProgressModule() {
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        const mod1Done = Boolean(s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i));
        const mod2Done = Boolean((s1Data.selectedValues && s1Data.selectedValues.length > 0) && (s1Data.iam_1_2 && (s1Data.iam_1_2.I || s1Data.iam_1_2.i)));
        const mod3Done = Boolean(s1Data.iam_1_3 && (s1Data.iam_1_3.I || s1Data.iam_1_3.i));
        const quizDone = Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);

        ["stage1-mod-1-1", "stage1-mod-1-2", "stage1-mod-1-3", "stage1-mod-quiz"].forEach(id => closeAccordionModule(id));

        if (!mod1Done) {
            openAccordionModule("stage1-mod-1-1");
        } else if (!mod2Done) {
            openAccordionModule("stage1-mod-1-2");
        } else if (!mod3Done) {
            openAccordionModule("stage1-mod-1-3");
        } else if (!quizDone) {
            openAccordionModule("stage1-mod-quiz");
        } else {
            openAccordionModule("stage1-mod-1-1");
        }
    }

    function initAccordions() {
        const modules = document.querySelectorAll(".accordion-module");
        modules.forEach(mod => {
            const header = mod.querySelector(".accordion-header");
            const body = mod.querySelector(".accordion-body");
            const chevron = mod.querySelector(".accordion-chevron span");

            if (header && body) {
                header.onclick = () => {
                    const isOpen = !body.classList.contains("hidden");
                    if (isOpen) {
                        body.classList.add("hidden");
                        if (chevron) chevron.style.transform = "rotate(0deg)";
                    } else {
                        body.classList.remove("hidden");
                        if (chevron) chevron.style.transform = "rotate(180deg)";
                    }
                };
            }
        });

        autoOpenInProgressModule();
    }

    function updateGlobalProgress() {
        const pct1 = calculateStage1Progress();
        const pct2 = calculateStage2Progress();
        const pct3 = calculateStage3Progress();

        if (segmentBar1) segmentBar1.style.width = `${pct1}%`;
        if (segmentBar2) segmentBar2.style.width = `${pct2}%`;
        if (segmentBar3) segmentBar3.style.width = `${pct3}%`;

        if (segmentLabel1) segmentLabel1.textContent = `C1: ${pct1}%`;
        if (segmentLabel2) segmentLabel2.textContent = `C2: ${pct2}%`;
        if (segmentLabel3) segmentLabel3.textContent = `C3: ${pct3}%`;

        const totalPct = Math.round((pct1 + pct2 + pct3) / 3);
        const completed = (learnerProgress.completedStages || []).length;
        const total = (curriculum.stages || []).length || 3;

        if (globalProgressBar) {
            globalProgressBar.style.width = `${totalPct}%`;
        }
        if (globalProgressText) {
            globalProgressText.textContent = `${totalPct}% (${completed}/${total} Chặng)`;
        }

        updateStage1Milestones();
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

    // 13.1 QUIZ JUMP SHORTCUT HANDLER (ĐÁP ỨNG FEEDBACK CÔ CHÂU)
    function jumpToStage1Quiz() {
        if (currentStageIndex !== 0) {
            loadStage(0);
            renderSyllabus();
        }
        const practiceTabBtn = document.querySelector('.tab-btn[data-tab="tab-practice"]');
        if (practiceTabBtn) {
            practiceTabBtn.click();
        }
        setTimeout(() => {
            openAccordionModule("stage1-mod-quiz");
            const quizSec = document.getElementById("stage1-mod-quiz");
            if (quizSec) {
                quizSec.scrollIntoView({ behavior: "smooth", block: "start" });
                quizSec.classList.add("ring-4", "ring-brand-amber", "transition-all", "duration-500");
                setTimeout(() => {
                    quizSec.classList.remove("ring-4", "ring-brand-amber");
                }, 3500);
            }
        }, 150);
    }

    function openRoadmapDoc() {
        openDocReader("data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md", "Cẩm Nang: Lộ Trình Học Tập & Hướng Dẫn Sử Dụng LMS");
    }

    const btnHeroGotoQuiz = document.getElementById("btn-hero-goto-quiz");
    if (btnHeroGotoQuiz) btnHeroGotoQuiz.addEventListener("click", jumpToStage1Quiz);

    const btnQuickQuiz = document.getElementById("btn-quick-quiz");
    if (btnQuickQuiz) btnQuickQuiz.addEventListener("click", jumpToStage1Quiz);

    const btnHeaderQuiz = document.getElementById("btn-header-quiz");
    if (btnHeaderQuiz) btnHeaderQuiz.addEventListener("click", jumpToStage1Quiz);

    const btnBottomQuiz = document.getElementById("btn-bottom-quiz");
    if (btnBottomQuiz) btnBottomQuiz.addEventListener("click", jumpToStage1Quiz);

    const btnQuickRoadmap = document.getElementById("btn-quick-roadmap");
    if (btnQuickRoadmap) btnQuickRoadmap.addEventListener("click", openRoadmapDoc);

    const btnHeaderRoadmap = document.getElementById("btn-header-roadmap");
    if (btnHeaderRoadmap) btnHeaderRoadmap.addEventListener("click", openRoadmapDoc);

    const btnBottomRoadmap = document.getElementById("btn-bottom-roadmap");
    if (btnBottomRoadmap) btnBottomRoadmap.addEventListener("click", openRoadmapDoc);

    // 14. AUTH FORM SUBMIT
    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (authErrorBanner) authErrorBanner.classList.add("hidden");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");

        const rawIdentity = (loginIdentityInput.value || "").trim();
        if (!rawIdentity) {
            loginIdentityInput.focus();
            return;
        }

        const learner = findLearner(rawIdentity);

        // TRƯỜNG HỢP 1: KHÔNG TÌM THẤY EMAIL TRONG DANH BẠ HỌC VIÊN
        if (!learner) {
            authErrorTitle.textContent = "Email chưa có trong danh sách học viên chính thức";
            authErrorDesc.innerHTML = `Email <strong>${rawIdentity}</strong> chưa nằm trong danh sách học viên khóa học.<br/><a href="mailto:culturecodeproject@gmail.com" class="text-brand-amber font-bold underline hover:text-amber-300">Đã hoàn thành đăng ký, email cho culturecodeproject@gmail.com</a>`;
            authErrorBanner.classList.remove("hidden");

            // MỚI XUẤT HIỆN nút "Để lại quan tâm và đăng ký trải nghiệm"
            if (trialTriggerWrapper) {
                trialTriggerWrapper.classList.remove("hidden");
            }
            if (trialNameInput && !trialNameInput.value && rawIdentity.includes("@")) {
                trialNameInput.value = rawIdentity.split("@")[0];
            }
            return;
        }

        // TRƯỜNG HỢP 2: HỌC VIÊN CHÍNH THỨC NHƯNG THIẾU SỐ ĐIỆN THOẠI TRONG ROSTER
        const hasPhone = learner.phone && learner.phone.trim().length >= 8 && !learner.missing_phone;
        const isPhoneOnboarding = !passwordGroup.classList.contains("hidden") ? false : true;

        if (!hasPhone && !isPhoneOnboarding) {
            passwordGroup.classList.add("hidden");
            loginPasswordInput.removeAttribute("required");
            phoneOnboardingGroup.classList.remove("hidden");
            onboardingPhoneInput.setAttribute("required", "true");
            btnSubmitText.textContent = "Kích Hoạt & Vào Học";
            onboardingPhoneInput.focus();
            return;
        }

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

        // TRƯỜNG HỢP 3: HỌC VIÊN CHÍNH THỨC CÓ SĐT -> XÁC THỰC MẬT KHẨU
        const inputPassword = loginPasswordInput.value;
        if (!verifyPassword(learner, inputPassword)) {
            authErrorTitle.textContent = "Mật khẩu không chính xác";
            authErrorDesc.textContent = "Mật khẩu là 4 số cuối của Số điện thoại đã đăng ký. Vui lòng kiểm tra lại.";
            authErrorBanner.classList.remove("hidden");
            loginPasswordInput.focus();
            return;
        }

        currentUser = learner;
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
        applyUserSession();
    });

    // Khi người dùng bấm nút: "Để lại quan tâm và đăng ký trải nghiệm"
    if (btnShowTrialLead) {
        btnShowTrialLead.addEventListener("click", () => {
            if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
            if (passwordGroup) passwordGroup.classList.add("hidden");
            if (submitAuthWrapper) submitAuthWrapper.classList.add("hidden");
            if (trialOnboardingGroup) {
                trialOnboardingGroup.classList.remove("hidden");
                const email = (loginIdentityInput.value || "").trim();
                if (trialNameInput) {
                    if (!trialNameInput.value && email.includes("@")) {
                        trialNameInput.value = email.split("@")[0];
                    }
                    trialNameInput.focus();
                }
            }
        });
    }

    // Nút Quay lại màn hình đăng nhập (Quay lui) theo đúng chỉ đạo của Sếp
    if (btnBackToLogin) {
        btnBackToLogin.addEventListener("click", () => {
            resetToDefaultLoginView();
            loginIdentityInput.focus();
        });
    }

    loginIdentityInput.addEventListener("input", () => {
        const val = loginIdentityInput.value.trim();
        // Giữ ô mật khẩu và nút submit luôn hiển thị, ẩn lỗi cũ nếu có
        if (authErrorBanner) authErrorBanner.classList.add("hidden");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");
        if (passwordGroup) passwordGroup.classList.remove("hidden");
        if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");

        if (val.includes("@") && val.length >= 6) {
            const found = findLearner(val);
            if (found) {
                authUserDetected.classList.remove("hidden");
                detectedUserName.textContent = found.name || found.email;
                detectedUserCohort.textContent = found.cohort || "Học viên";
            } else {
                authUserDetected.classList.add("hidden");
            }
        } else {
            authUserDetected.classList.add("hidden");
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
                learnerProgress = getInitialLearnerProgress();
                userChip.classList.add("hidden");
                renderSyllabus();
                evaluateLearnerStatus();
                loadStage(0);
                showAuthModal();
            }
        });
    }

    if (btnCloseUpgrade) {
        btnCloseUpgrade.addEventListener("click", () => {
            hideTrialUpgradeModal();
        });
    }

    let trialCooldownTimer = null;
    function startTrialCooldown(seconds) {
        let remaining = seconds;
        if (btnRequestTrial) {
            btnRequestTrial.disabled = true;
            btnRequestTrial.classList.add("opacity-60", "cursor-not-allowed");
        }
        if (trialCooldownTimer) clearInterval(trialCooldownTimer);
        trialCooldownTimer = setInterval(() => {
            remaining--;
            if (btnRequestTrialText) {
                btnRequestTrialText.textContent = `Gửi lại sau (${remaining}s)...`;
            }
            if (remaining <= 0) {
                clearInterval(trialCooldownTimer);
                trialCooldownTimer = null;
                if (btnRequestTrial) {
                    btnRequestTrial.disabled = false;
                    btnRequestTrial.classList.remove("opacity-60", "cursor-not-allowed");
                }
                if (btnRequestTrialText) {
                    btnRequestTrialText.textContent = "Gửi Liên Kết Học Thử Qua Email";
                }
            }
        }, 1000);
    }

    if (btnRequestTrial) {
        btnRequestTrial.addEventListener("click", async () => {
            const email = (loginIdentityInput.value || "").trim().toLowerCase();
            const fullName = (trialNameInput ? trialNameInput.value : "").trim();
            const rawPhone = (trialPhoneInput ? trialPhoneInput.value : "").trim();
            const isConsented = trialConsentInput ? trialConsentInput.checked : true;

            if (trialStatusMsg) {
                trialStatusMsg.className = "hidden p-2.5 rounded-xl text-center text-xs";
                trialStatusMsg.textContent = "";
            }

            if (!email || !email.includes("@")) {
                if (trialStatusMsg) {
                    trialStatusMsg.className = "p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                    trialStatusMsg.textContent = "⚠️ Vui lòng nhập địa chỉ email hợp lệ ở ô phía trên.";
                    trialStatusMsg.classList.remove("hidden");
                }
                loginIdentityInput.focus();
                return;
            }

            if (!fullName) {
                if (trialStatusMsg) {
                    trialStatusMsg.className = "p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                    trialStatusMsg.textContent = "⚠️ Vui lòng nhập họ và tên của bạn.";
                    trialStatusMsg.classList.remove("hidden");
                }
                if (trialNameInput) trialNameInput.focus();
                return;
            }

            const cleanPhone = normalizePhone(rawPhone);
            if (cleanPhone.length !== 10) {
                if (trialStatusMsg) {
                    trialStatusMsg.className = "p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                    trialStatusMsg.textContent = "⚠️ Vui lòng nhập đúng 10 số điện thoại di động (VD: 0912345678).";
                    trialStatusMsg.classList.remove("hidden");
                }
                if (trialPhoneInput) trialPhoneInput.focus();
                return;
            }

            if (!isConsented) {
                if (trialStatusMsg) {
                    trialStatusMsg.className = "p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                    trialStatusMsg.textContent = "⚠️ Bạn cần đồng ý nhận liên kết kích hoạt theo Nghị định 13/2023/NĐ-CP.";
                    trialStatusMsg.classList.remove("hidden");
                }
                return;
            }

            // Gửi yêu cầu qua Webhook Apps Script
            const originalBtnText = btnRequestTrialText ? btnRequestTrialText.textContent : "Gửi Liên Kết Học Thử";
            if (btnRequestTrialText) btnRequestTrialText.textContent = "⏳ Đang gửi liên kết...";
            btnRequestTrial.disabled = true;

            const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
            const payload = {
                action: "register_or_request_link",
                email: email,
                full_name: fullName,
                phone: cleanPhone,
                survey_type: "LMS_TRIAL"
            };

            try {
                const resp = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(payload)
                });
                const data = await resp.json();

                if (data && data.success) {
                    if (trialStatusMsg) {
                        trialStatusMsg.className = "p-3 rounded-xl bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs leading-relaxed space-y-1";
                        trialStatusMsg.innerHTML = `<div>🎉 <strong>Gửi thành công!</strong></div><div>Liên kết kích hoạt đã được gửi tới <strong>${email}</strong>. Vui lòng kiểm tra hộp thư (kể cả mục Spam) và nhấp vào liên kết để bắt đầu học Chặng 1.</div>`;
                        trialStatusMsg.classList.remove("hidden");
                    }
                    startTrialCooldown(60);
                } else if (data && data.error === "RATE_LIMIT_EXCEEDED") {
                    const waitSec = data.retry_after_seconds || 60;
                    if (trialStatusMsg) {
                        trialStatusMsg.className = "p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs";
                        trialStatusMsg.textContent = data.message || `Vui lòng chờ ${waitSec} giây trước khi gửi lại yêu cầu.`;
                        trialStatusMsg.classList.remove("hidden");
                    }
                    startTrialCooldown(waitSec);
                } else {
                    if (trialStatusMsg) {
                        trialStatusMsg.className = "p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                        trialStatusMsg.textContent = (data && data.message) ? data.message : "Có lỗi xảy ra khi gửi liên kết. Vui lòng thử lại sau.";
                        trialStatusMsg.classList.remove("hidden");
                    }
                    btnRequestTrial.disabled = false;
                    if (btnRequestTrialText) btnRequestTrialText.textContent = originalBtnText;
                }
            } catch (err) {
                console.warn("Request trial error:", err);
                if (trialStatusMsg) {
                    trialStatusMsg.className = "p-3 rounded-xl bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs leading-relaxed space-y-1";
                    trialStatusMsg.innerHTML = `<div>🎉 <strong>Yêu cầu đã được tiếp nhận!</strong></div><div>Hệ thống đang xử lý và gửi liên kết tới <strong>${email}</strong>. Vui lòng kiểm tra hòm thư của bạn sau ít phút.</div>`;
                    trialStatusMsg.classList.remove("hidden");
                }
                startTrialCooldown(60);
            }
        });
    }

    // 15. INITIAL BOOTSTRAP
    loadCurriculumData().then(() => {
        loadRoster().then(() => {
            initAuth();
        });
    });

    // Auto-refresh Personal Values & ABCDE results on window focus and storage event
    window.addEventListener("focus", () => {
        if (currentStageIndex === 0) {
            loadPersonalValuesTestResult();
        } else if (currentStageIndex === 1) {
            loadAbcdeLandingSync();
        }
    });
    window.addEventListener("storage", (e) => {
        if (e.key && (e.key === "dhm_personal_values_latest" || e.key.startsWith("dhm_pv_"))) {
            if (currentStageIndex === 0) {
                loadPersonalValuesTestResult();
            }
        }
        if (e.key && (e.key === "dhm_abcde_latest" || e.key.startsWith("dhm_abcde_"))) {
            if (currentStageIndex === 1) {
                loadAbcdeLandingSync();
            }
        }
    });
});
