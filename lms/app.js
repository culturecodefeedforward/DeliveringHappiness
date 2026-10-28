    // Auto-check URL parameter for Stage 2B unlock (?unlock=2b&token=...)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const unlockParam = urlParams.get("unlock");
        if (unlockParam === "2b" || unlockParam === "stage-2b") {
            localStorage.setItem("dhm_unlocked_stage_2b", "true");
            console.log("[DHM LMS] Stage 2B unlocked via URL parameter.");
        }
    } catch (e) {
        console.warn("Could not parse URL search parameters for unlock flag", e);
    }

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
                title: "Chặng 1 • ONLINE – Khởi động với hạnh phúc",
                subtitle: "Khoa học Hạnh phúc • 3 Cấp độ • Định vị La Bàn (Me Values)",
                instructor: "",
                estimatedMinutes: 30,
                videoDuration: "7:27",
                videoUrl: "data/artifacts/the_explainer.mp4",
                videoTitle: "Video Explainer: Delivering Happiness Movement (Hệ Điều Hành Hạnh Phúc)",
                videoType: "mp4",
                subSections: [
                    { id: "sub-1-1", title: "Khoa Học Hạnh Phúc & 3 Cấp Độ (Pleasure • Passion • Higher Purpose)", target: "stage1-mod-1-1", tab: "tab-practice" },
                    { id: "sub-1-2", title: "Định Vị La Bàn Giá Trị Cá Nhân (ME Values)", target: "stage1-mod-1-2", tab: "tab-practice" },
                    { id: "sub-1-cp1", title: "Check point 1: Đúc Kết I • A • M", target: "stage1-mod-cp1", tab: "tab-practice" },
                    { id: "sub-1-quiz", title: "Cổng Sát Hạch Vượt Chặng (10 Câu • Đạt ≥ 80%)", target: "stage1-mod-quiz", tab: "tab-practice" }
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
                    { title: "Cấp độ 2: Đam mê & Dòng chảy Flow (Passion)", desc: "Phiêu và gắn kết. Thời gian trôi nhanh (Mihály Csíkszentmihályi & Martin Seligman)." },
                    { title: "Cấp độ 3: Mục đích cao cả (Higher Purpose)", desc: "Cấp độ bền vững nhất. Thấy công việc của mình có ý nghĩa, phụng sự và đóng góp giá trị cho cộng đồng." }
                ],
                modules: [
                    {
                        id: "mod-1-1",
                        title: "3 Cấp Độ Hạnh Phúc (Pleasure • Passion • Higher Purpose)",
                        quizzes: [
                            {
                                                        "id": "dhm-quiz-1",
                                                        "question": "Trong bài giảng, khi đào sâu chuỗi câu hỏi 'Tại sao điều đó lại quan trọng?' đối với các mục tiêu đời sống (mua nhà, kiếm tiền, thăng tiến, sức khỏe), lớp động lực sâu xa nhất mà con người chạm tới là gì (theo Aristotle & Delivering Happiness)?",
                                                        "options": [
                                                                                    "Trải nghiệm hạnh phúc và sự mãn nguyện tự thân (Happiness / Eudaimonia).",
                                                                                    "Sự công nhận về vị thế và danh tiếng cá nhân (Recognition / Prestige).",
                                                                                    "Sự an toàn tài chính và tích lũy của cải vật chất (Security / Affluence).",
                                                                                    "Sự hoàn thành các cột mốc và mục tiêu chiến lược (Milestones / Achievement)."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 14 & 18 và lời giảng, khi hỏi 'tại sao' đủ sâu, con người chạm tới mong muốn sâu nhất: tôi sẽ mãn nguyện hơn, hạnh phúc hơn (Eudaimonia - một đời sống có ý nghĩa, có sự phát triển và mãn nguyện)."
                            },
                            {
                                                        "id": "dhm-quiz-2",
                                                        "question": "Theo kịch bản bài giảng Delivering Happiness, ba dạng trải nghiệm hạnh phúc theo thứ tự chất lượng và độ bền tăng dần là:",
                                                        "options": [
                                                                                    "Thú vui (Pleasure) ➔ Đam mê / Dòng chảy (Flow) ➔ Mục đích cao cả (Higher Purpose).",
                                                                                    "Đam mê (Passion) ➔ Thú vui (Pleasure) ➔ Mục đích cao cả (Higher Purpose).",
                                                                                    "Thú vui (Pleasure) ➔ Mục đích cao cả (Higher Purpose) ➔ Đam mê (Passion).",
                                                                                    "Tự chủ (Autonomy) ➔ Tiến bộ (Progress) ➔ Kết nối đội ngũ (Connectedness)."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 16, Delivering Happiness phân loại ba dạng trải nghiệm: Thú vui (Pleasure - ngắn) ➔ Đam mê / Flow (bền hơn, gắn kết sâu) ➔ Higher Purpose / Meaning (bền vững nhất, kết nối điều lớn hơn bản thân)."
                            },
                            {
                                                        "id": "dhm-quiz-3",
                                                        "question": "Kịch bản bài giảng chỉ ra điểm lưu ý cốt lõi nào đối với các thành tựu vật chất hoặc niềm vui bên ngoài (Cấp độ Thú vui - Pleasure)?",
                                                        "options": [
                                                                                    "Cảm giác thỏa mãn không ở lại mãi, não bộ nhanh chóng thích nghi và ta lại có cột mốc mới.",
                                                                                    "Cảm giác thỏa mãn tạo ra áp lực tâm lý tiêu cực, khiến cá nhân kiệt quệ và mất phương hướng.",
                                                                                    "Cảm giác thỏa mãn làm suy giảm động lực nội tại, khiến cá nhân ngừng nỗ lực phát triển thêm.",
                                                                                    "Cảm giác thỏa mãn chỉ phụ thuộc hoàn cảnh bên ngoài, khiến cá nhân không thể tự quyết định."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 15, cảm giác hạnh phúc sau một thành tựu bên ngoài thường không ở lại mãi; rất nhanh ta lại có một cột mốc mới. Nếu luôn gửi hạnh phúc vào tương lai thì ta sẽ dành cả đời để... chờ được hạnh phúc."
                            },
                            {
                                                        "id": "dhm-quiz-4",
                                                        "question": "Trong bài giảng, trải nghiệm Đam mê / Dòng chảy (Flow) được mô tả chính xác nhất qua trạng thái nào?",
                                                        "options": [
                                                                                    "Khi kỹ năng gặp thử thách đủ hấp dẫn, tập trung rất sâu và cảm giác thời gian thay đổi.",
                                                                                    "Khi công việc diễn ra dễ dàng, không gặp bất kỳ trở ngại nào và hoàn thành trước thời hạn.",
                                                                                    "Khi nhận được sự tán thưởng liên tục từ đồng đội, cảm thấy tự hào về vị trí của bản thân.",
                                                                                    "Khi xử lý cùng lúc nhiều nhiệm vụ phức tạp, duy trì nhịp độ làm việc khẩn trương liên tục."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 16, trải nghiệm Flow xuất hiện khi kỹ năng gặp thử thách đủ hấp dẫn, tập trung rất sâu, nhìn lại đồng hồ thấy mấy tiếng trôi qua lúc nào không hay vì đang thật sự gắn kết với điều mình làm."
                            },
                            {
                                                        "id": "dhm-quiz-5",
                                                        "question": "Theo lời giảng, trải nghiệm 'Mục đích cao cả' (Higher Purpose / Meaning) mang lại chất lượng thỏa mãn sâu sắc vì:",
                                                        "options": [
                                                                                    "Thấy việc mình làm có ý nghĩa với người khác, công sức có giá trị vượt ra ngoài task trước mắt.",
                                                                                    "Đạt được vị thế lãnh đạo cao hơn trong tổ chức, có toàn quyền quyết định định hướng công việc.",
                                                                                    "Hoàn thành xuất sắc toàn bộ chỉ tiêu đánh giá định kỳ, mang lại nguồn thu nhập tài chính vượt trội.",
                                                                                    "Loại bỏ hoàn toàn mọi xung đột và áp lực công việc, duy trì trạng thái thoải mái ổn định lâu dài."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 16 & 21, Higher Purpose là khoảnh khắc thấy việc mình làm có ý nghĩa với người khác, đóng góp vào sự trưởng thành của ai đó, công sức có giá trị vượt ra ngoài task trước mắt và vượt lên trên việc chỉ hoàn thành KPI."
                            },
                            {
                                                        "id": "dhm-quiz-6",
                                                        "question": "Trong ẩn dụ 'Ba Tầng Lầu' của học giả Phong Tử Khải được trích dẫn ở bài giảng, ba tầng bậc của đời sống con người là:",
                                                        "options": [
                                                                                    "Tầng 1: Đời sống vật chất ➔ Tầng 2: Đời sống tinh thần ➔ Tầng 3: Đời sống tâm hồn.",
                                                                                    "Tầng 1: Nhu cầu sinh lý ➔ Tầng 2: Nhu cầu an toàn ➔ Tầng 3: Nhu cầu tự thể hiện.",
                                                                                    "Tầng 1: Kỹ năng chuyên môn ➔ Tầng 2: Năng lực quản trị ➔ Tầng 3: Tầm nhìn lãnh đạo.",
                                                                                    "Tầng 1: Trách nhiệm cá nhân ➔ Tầng 2: Hợp tác đội ngũ ➔ Tầng 3: Cống hiến xã hội."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 17, ba tầng lầu của Phong Tử Khải là vật chất, tinh thần và tâm hồn. Ngoài việc 'tôi có gì' và 'tôi đạt gì', ta còn sống vì điều gì, đóng góp cho điều gì để đời sống có chiều sâu."
                            },
                            {
                                                        "id": "dhm-quiz-7",
                                                        "question": "Ai là tác giả của triết lý quản trị nền tảng: 'Get the right culture, and everything else will fall into place' (Xây dựng văn hóa đúng đắn, rồi mọi thứ khác sẽ tự đi vào đúng vị trí)?",
                                                        "options": [
                                                                                    "Tony Hsieh (Cố CEO Zappos & Đồng sáng lập Delivering Happiness).",
                                                                                    "Martin Seligman (Giáo sư tâm lý học, cha đẻ Tâm lý học Tích cực).",
                                                                                    "Mihály Csíkszentmihályi (Giáo sư tiên phong nghiên cứu Dòng chảy).",
                                                                                    "Peter Drucker (Học giả tiên phong về Quản trị học hiện đại thế giới)."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 09 & 19, triết lý cốt lõi của Tony Hsieh là xây dựng văn hóa đúng đắn thì mọi thứ khác sẽ tự đi đúng hướng."
                            },
                            {
                                                        "id": "dhm-quiz-8",
                                                        "question": "Theo mô hình lan tỏa văn hóa trong Delivering Happiness (ME ➔ WE ➔ COMMUNITY), điểm khởi phát bắt đầu từ đâu?",
                                                        "options": [
                                                                                    "Bắt đầu từ ME (từng cá nhân tự hiểu mình, lựa chọn thái độ và chịu trách nhiệm với trải nghiệm).",
                                                                                    "Bắt đầu từ WE (tập thể ban hành chính sách phúc lợi, quy chuẩn hành vi và thỏa thuận văn hóa).",
                                                                                    "Bắt đầu từ LEADERSHIP (ban lãnh đạo truyền cảm hứng, định hình tầm nhìn và làm gương mẫu mực).",
                                                                                    "Bắt đầu từ COMMUNITY (khách hàng, học viên và đối tác phản hồi tích cực về dịch vụ tổ chức)."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 20 & 21, một tổ chức không thể 'làm cho' nhân viên hạnh phúc. Happiness bắt đầu từ từng cá nhân (ME) - cách tôi hiểu mình, lựa chọn và chịu trách nhiệm với trải nghiệm; rồi mới lan sang WE và COMMUNITY."
                            },
                            {
                                                        "id": "dhm-quiz-9",
                                                        "question": "Trong kịch bản bài giảng, Giá trị Cốt lõi Cá nhân (ME Values) được định nghĩa chuẩn xác nhất là gì?",
                                                        "options": [
                                                                                    "Những điều thật sự quan trọng đến mức chi phối cách mình ra quyết định, phản ứng và ưu tiên.",
                                                                                    "Danh sách các phẩm chất đạo đức chuẩn mực mà xã hội hoặc cấp trên kỳ vọng một người nên có.",
                                                                                    "Những khẩu hiệu hành động lý tưởng được đúc kết từ sổ tay văn hóa của các tập đoàn lớn.",
                                                                                    "Bộ quy tắc ứng xử bắt buộc mà cá nhân cần tuân thủ nghiêm ngặt trong môi trường làm việc."
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 22, giá trị cốt lõi không phải phẩm chất 'nên có' hay từ nghe cho hay, mà là những điều thật sự quan trọng đến mức có khả năng ảnh hưởng tới cách mình ra quyết định, phản ứng và ưu tiên."
                            },
                            {
                                                        "id": "dhm-quiz-10",
                                                        "question": "Theo lời dẫn bài giảng, khi đứng trước tình huống phải đánh đổi (Trade-off) giữa hai lựa chọn đều tốt đẹp, câu hỏi giúp La bàn Giá trị phát huy tác dụng là:",
                                                        "options": [
                                                                                    "'Khi phải đánh đổi, điều nào thường có trọng lượng lớn hơn trong quyết định của tôi?'",
                                                                                    "'Lựa chọn nào sẽ mang lại cho tôi sự an toàn và được nhiều người xung quanh ủng hộ nhất?'",
                                                                                    "'Phương án nào giúp tôi tối ưu hóa lợi ích tài chính và thăng tiến nghề nghiệp nhanh nhất?'",
                                                                                    "'Quyết định nào sẽ giúp tôi hạn chế tối đa sai sót và làm vừa lòng tất cả các bên liên quan?'"
                                                        ],
                                                        "correctIndex": 0,
                                                        "timeLimit": 20,
                                                        "explanation": "Theo Slide 23, lời giảng nhấn mạnh: 'nếu hai từ đều rất đẹp nhưng buộc phải chọn, hãy hỏi: khi phải đánh đổi, điều nào thường có trọng lượng lớn hơn trong quyết định của tôi?'"
                            }
],
                        iam: {
                            id: "iam_1_1",
                            title: "Đúc kết I • A • M 1.1 — 3 Cấp Độ Hạnh Phúc",
                            I: "Bạn tâm đắc nhất với điều gì từ nội dung 3 Cấp độ Hạnh phúc & Ẩn dụ 3 Tầng Lầu của Phong Tử Khải?",
                            A: "Bạn sẽ áp dụng điều này như thế nào để chuyển dịch dần từ Thú vui ngắn hạn (Pleasure) sang Đam mê (Passion) và Mục đích cao cả (Higher Purpose)?",
                            M: "Tại sao nhận thức này lại có ý nghĩa sâu sắc đối với bạn ở thời điểm hiện tại?"
                        }
                    },
                    {
                        id: "mod-1-2",
                        title: "La Bàn Giá Trị Cá Nhân (Me Values)",
                        iam: {
                            id: "iam_1_2",
                            title: "Đúc kết I • A • M 1.2 — La Bàn Giá Trị Sống",
                            I: "Bạn tâm đắc nhất với giá trị La Bàn nào bạn vừa lựa chọn?",
                            A: "Giá trị này sẽ định hướng cho một quyết định khó khăn hoặc hành vi sắp tới của bạn như thế nào?",
                            M: "Nếu kiên định sống đúng với La Bàn này, bạn sẽ kiến tạo phiên bản tốt đẹp hơn của chính mình ra sao?"
                        }
                    }
                ],
                resources: [
                    { title: "Slide Bài Giảng: Đích Đến Hạnh Phúc (Slide 14)", type: "image", url: "data/artifacts/slides/slide_14.png", icon: "📊" },
                    { title: "Slide Bài Giảng: Lời Dạy Aristotle 200BC — Hạnh Phúc Là Mục Đích Tồn Tại (Slide 18)", type: "image", url: "data/artifacts/slides/slide_18.png", icon: "📊" },
                    { title: "Slide Bài Giảng: Điều Gì Khiến Hạnh Phúc Bền Lâu? (Slide 19)", type: "image", url: "data/artifacts/slides/slide_19.png", icon: "📊" },
                    { title: "Slide Bài Giảng: Ai Khiến Hạnh Phúc Bền Lâu? (Cá Nhân • Tập Thể • Cộng Đồng) (Slide 20)", type: "image", url: "data/artifacts/slides/slide_20.png", icon: "📊" },
                    { title: "Slide Bài Giảng: Lộ Trình 3 Mini Step DHM (Slide 04)", type: "image", url: "data/artifacts/slides/slide_04.png", icon: "🗺️" },
                    { title: "Slide Bài Giảng: Triết Lý Văn Hóa Zappos — Tony Hsieh (Slide 09)", type: "image", url: "data/artifacts/slides/slide_09.png", icon: "💡" },
                    { id: "res-roadmap", title: "Cẩm Nang: Lộ Trình Học Tập & Hướng Dẫn Sử Dụng LMS", type: "markdown", url: "data/artifacts/huong_dan_va_lo_trinh_hoc_dhm.md", icon: "📘", readOnline: true, desc: "Hướng dẫn chi tiết toàn bộ lộ trình 3 Mini-steps, quy chế Cổng Sát Hạch Vượt Chặng (≥80%) và thao tác sử dụng hệ thống học tập LMS." },
                    { title: "Báo cáo Nghiên cứu: Khoa Học Hạnh Phúc & Dòng Chảy Tổ Chức", type: "markdown", url: "data/artifacts/report_dong_chay.md", icon: "📄", readOnline: true },
                    { title: "Bộ 25 Flashcards Văn Hóa Ghi Nhớ", type: "html", url: "data/artifacts/flashcards.html", icon: "🃏" }
                ]
            },
            {
                id: "stage-2",
                stageNumber: 2,
                badge: "Mini Step 2 • Offline",
                title: "Chặng 2 • OFFLINE – Gieo thói quen hạnh phúc",
                subtitle: "Workshop Live tại lớp • 3 Đòn Bẩy Nơi Làm Việc • Trạm thực hành 5 Thói quen & I•A•M",
                instructor: "",
                estimatedMinutes: 120,
                videoUrl: null,
                subSections: [
                    { id: "sub-2-0", title: "🚀 Trạm 0: 3 Đòn Bẩy Nơi Làm Việc (Deci & Ryan)", target: "habit-panel-drivers", habit: "drivers", tab: "tab-practice" },
                    { id: "sub-2-1", title: "🌿 Tỉnh Thức", target: "habit-panel-mindfulness", habit: "mindfulness", tab: "tab-practice" },
                    { id: "sub-2-2", title: "🙏 Biết Ơn", target: "habit-panel-gratitude", habit: "gratitude", tab: "tab-practice" },
                    { id: "sub-2-3", title: "☀️ Lạc Quan", target: "habit-panel-optimism", habit: "optimism", tab: "tab-practice" },
                    { id: "sub-2-4", title: "🌀 Phiêu (Flow)", target: "habit-panel-flow", habit: "flow", tab: "tab-practice" },
                    { id: "sub-2-5", title: "🤝 Vị Nhân", target: "habit-panel-altruism", habit: "altruism", tab: "tab-practice" },
                    { id: "sub-2-6", title: "🏆 Đúc Kết & Chuyển Hóa", target: "habit-panel-capstone", habit: "capstone", tab: "tab-practice" }
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
                    { id: "habit-drivers", number: 0, name: "3 Đòn Bẩy (SDT Drivers)", title: "3 Đòn Bẩy Hạnh Phúc Ở Nơi Làm Việc (Thuyết Tự Quyết SDT)", icon: "🚀" },
                    { id: "habit-mindfulness", number: 1, name: "Tỉnh Thức" },
                    { id: "habit-gratitude", number: 2, name: "Biết Ơn" },
                    { id: "habit-optimism", number: 3, name: "Lạc Quan" },
                    { id: "habit-flow", number: 4, name: "Phiêu (Flow)" },
                    { id: "habit-altruism", number: 5, name: "Vị Nhân" }
                ],
                resources: [
                    { title: "Slide Bài Giảng: Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy", type: "image", url: "data/artifacts/slides/slide_25.png", icon: "📊" },
                    { title: "Slide Bài Giảng: Đòn Bẩy Tự Chủ & Tinh Thần Làm Chủ (Ownership Advantage)", type: "image", url: "data/artifacts/slides/slide_29.png", icon: "📊" },
                    { title: "Slide Bài Giảng: An Toàn Tâm Lý (Psychological Safety) — Nền Tảng Tự Chủ", type: "image", url: "data/artifacts/slides/slide_31.png", icon: "📊" },
                    { title: "Slide Bài Giảng: Lợi Ích Của Đòn Bẩy Tiến Bộ (Dopamine & Small Wins)", type: "image", url: "data/artifacts/slides/slide_38.png", icon: "📊" },
                    { title: "Báo cáo: Quản Trị Con Người Trong Dòng Chảy", type: "markdown", url: "data/artifacts/report_quan_tri_con_nguoi.md", icon: "📄" },
                    { title: "Bản Thiết Kế Văn Hóa Tổ Chức (Culture Blueprint)", type: "pdf", url: "data/artifacts/culture_blueprint.pdf", icon: "📑" }
                ]
            },
            {
                id: "stage-3",
                stageNumber: 3,
                badge: "Mini Step 3 • Online",
                title: "Chặng 3 • ONLINE – Tiếp nối hành trình hạnh phúc",
                subtitle: "Nuôi dưỡng Thói quen Chuyển hóa • Focus on I•A•M • Đồng hành Chuyển Hóa",
                instructor: "",
                estimatedMinutes: 21,
                videoUrl: null,
                subSections: [
                    { id: "sub-3-1", title: "Mục 3.1: Bảng Vinh Danh Chất Liệu Đã Gieo (Recap Dashboard)", target: "stage3-recap-section", tab: "tab-practice" },
                    { id: "sub-3-2", title: "Mục 3.2: Bảng Điểm Danh 5 Thói Quen (Habit Tracker)", target: "stage3-tracker-section", tab: "tab-practice" },
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
        ENABLE_REMOTE_SYNC: true,
        AUTHORIZED_WEBHOOKS: [
            "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec"
        ]
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
                    score: null,
                    percentage: null,
                    passed: false,
                    quizAttempts: 0,
                    selectedValues: [],
                    iam_1_1: { I: "", A: "", M: "" },
                    iam_1_2: { I: "", A: "", M: "" },
                    iam_1_3: { I: "", A: "", M: "" },
                    scenarios: {}
                },
                "stage-2a": {
                    iam: { I: "", A: "", M: "" },
                    habits: {
                        drivers: { iam: { I: "", A: "", M: "" } },
                        gratitude: { items: ["", "", "", ""], card: { to: "", msg: "" }, iam: { I: "", A: "", M: "" } },
                        mindfulness: { sbaChecks: { s: false, b: false, a: false }, situation: "", iam: { I: "", A: "", M: "" } },
                        altruism: { style: "", act: "", iam: { I: "", A: "", M: "" } }
                    },
                    capstoneIam: { I: "", A: "", M: "" }
                },
                "stage-2b": {
                    habits: {
                        flow: { boringTask: "", redesign: "", iam: { I: "", A: "", M: "" } },
                        optimism: { abcde: { A: "", B: "", C: "", D: "", E: "" }, iam: { I: "", A: "", M: "" } }
                    },
                    capstoneIam: { I: "", A: "", M: "" }
                },
                "stage-3a": {
                    habitTracker: {},
                    weeklyCheckins: { w1: "", w2: "", w3: "" }
                },
                "stage-3b": {
                    habitTracker: {},
                    weeklyCheckins: { w1: "", w2: "" }
                },
                "stage-2": {
                    iam: { I: "", A: "", M: "" },
                    habits: {
                        drivers: { iam: { I: "", A: "", M: "" } },
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
    const btnBottomCloseDocReader = document.getElementById("btn-bottom-close-doc-reader");

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
    const stage2aPracticeContainer = document.getElementById("stage2a-practice-container") || stage2PracticeContainer;
    const stage2bPracticeContainer = document.getElementById("stage2b-practice-container");
    const stage3PracticeContainer = document.getElementById("stage3-practice-container");
    const stage3aPracticeContainer = document.getElementById("stage3a-practice-container") || stage3PracticeContainer;
    const stage3bPracticeContainer = document.getElementById("stage3b-practice-container");

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
    const btnCloseAuthModal = document.getElementById("btn-close-auth-modal");
    const btnHeaderLogin = document.getElementById("btn-header-login");
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
    const loginIdentityLabel = document.getElementById("login-identity-label");
    const trialOnboardingGroup = document.getElementById("trial-onboarding-group");
    const trialRosterNotice = document.getElementById("trial-roster-notice");
    const trialNameInput = document.getElementById("trial-name");
    const trialPhoneInput = document.getElementById("trial-phone");
    const trialConsentInput = document.getElementById("trial-consent");
    const btnRequestTrial = document.getElementById("btn-request-trial");
    const btnRequestTrialText = document.getElementById("btn-request-trial-text");
    const btnRequestTrialArrow = document.getElementById("btn-request-trial-arrow");
    const trialResendWrapper = document.getElementById("trial-resend-wrapper");
    const trialResendCountdown = document.getElementById("trial-resend-countdown");
    const btnResendTrial = document.getElementById("btn-resend-trial");
    const trialStatusMsg = document.getElementById("trial-status-msg");
    const submitAuthWrapper = document.getElementById("submit-auth-wrapper");
    const newcomerToggleWrapper = document.getElementById("newcomer-toggle-wrapper");
    const btnToggleNewcomerTrial = document.getElementById("btn-toggle-newcomer-trial");
    const trialTriggerWrapper = document.getElementById("trial-trigger-wrapper");
    const btnShowTrialLead = document.getElementById("btn-show-trial-lead");
    const btnBackToLogin = document.getElementById("btn-back-to-login");

    // Trial Upgrade Modal Elements
    const trialUpgradeModal = document.getElementById("trial-upgrade-modal");
    const btnCloseUpgrade = document.getElementById("btn-close-upgrade");

    const completionModal = document.getElementById("completion-modal");
    const btnCloseCompletion = document.getElementById("btn-close-completion");

    // Password Management Elements (Apollo & Self-Change)
    const forceChangePwdModal = document.getElementById("force-change-pwd-modal");
    const forceChangePwdForm = document.getElementById("force-change-pwd-form");
    const forceNewPwdInput = document.getElementById("force-new-pwd");
    const forceConfirmPwdInput = document.getElementById("force-confirm-pwd");
    const btnToggleForceNewPwd = document.getElementById("btn-toggle-force-new-pwd");
    const btnToggleForceConfirmPwd = document.getElementById("btn-toggle-force-confirm-pwd");
    const forcePwdErrorBanner = document.getElementById("force-pwd-error-banner");
    const forcePwdErrorTitle = document.getElementById("force-pwd-error-title");
    const forcePwdErrorDesc = document.getElementById("force-pwd-error-desc");
    const btnSubmitForcePwd = document.getElementById("btn-submit-force-pwd");
    const btnSubmitForcePwdText = document.getElementById("btn-submit-force-pwd-text");

    const selfChangePwdModal = document.getElementById("self-change-pwd-modal");
    const selfChangePwdForm = document.getElementById("self-change-pwd-form");
    const selfCurrentPwdInput = document.getElementById("self-current-pwd");
    const selfNewPwdInput = document.getElementById("self-new-pwd");
    const selfConfirmPwdInput = document.getElementById("self-confirm-pwd");
    const btnCloseSelfPwd = document.getElementById("btn-close-self-pwd");
    const btnCancelSelfPwd = document.getElementById("btn-cancel-self-pwd");
    const btnOpenChangePwd = document.getElementById("btn-open-change-pwd");
    const selfPwdErrorBanner = document.getElementById("self-pwd-error-banner");
    const selfPwdErrorTitle = document.getElementById("self-pwd-error-title");
    const selfPwdErrorDesc = document.getElementById("self-pwd-error-desc");
    const selfPwdSuccessBanner = document.getElementById("self-pwd-success-banner");
    const selfPwdSuccessDesc = document.getElementById("self-pwd-success-desc");
    const btnSubmitSelfPwd = document.getElementById("btn-submit-self-pwd");
    const btnSubmitSelfPwdText = document.getElementById("btn-submit-self-pwd-text");

    // 4. LOAD DYNAMIC CURRICULUM FROM JSON (Fallback to embedded)
    async function loadCurriculumData() {
        const candidatePaths = [
            "/lms/curriculum_data.json?v=" + Date.now(),
            "curriculum_data.json?v=" + Date.now()
        ];
        for (const p of candidatePaths) {
            try {
                const resp = await fetch(p);
                if (resp.ok) {
                    curriculum = await resp.json();
                    console.log("Loaded dynamic curriculum_data.json successfully from " + p);
                    return;
                }
            } catch (e) {
                // Try next candidate
            }
        }
        console.warn("Using embedded fallback curriculum");
    }

    // 5. HELPER FUNCTIONS
    // TRIAL AUTHORIZATION & ROSTER HELPERS
    const TRIAL_EMAILS_STORAGE_KEY = "dhm_lms_approved_trials";

    function getApprovedTrialEmails() {
        try {
            const stored = localStorage.getItem(TRIAL_EMAILS_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    function saveApprovedTrialEmail(email) {
        if (!email) return;
        const clean = String(email).trim().toLowerCase();
        if (!clean) return;
        const list = getApprovedTrialEmails();
        if (!list.includes(clean)) {
            list.push(clean);
            try {
                localStorage.setItem(TRIAL_EMAILS_STORAGE_KEY, JSON.stringify(list));
            } catch (e) {
                console.warn("Error saving approved trial email:", e);
            }
        }
    }

    function saveTrialUserProfile(email, name, phone) {
        if (!email) return;
        const clean = String(email).trim().toLowerCase();
        try {
            const raw = localStorage.getItem("dhm_lms_trial_profiles");
            const profiles = raw ? JSON.parse(raw) : {};
            profiles[clean] = {
                name: name || clean.split("@")[0],
                phone: phone || "",
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem("dhm_lms_trial_profiles", JSON.stringify(profiles));
        } catch (e) {
            console.warn("Error saving trial user profile:", e);
        }
    }

    function getTrialUserProfile(email) {
        if (!email) return {};
        const clean = String(email).trim().toLowerCase();
        try {
            const raw = localStorage.getItem("dhm_lms_trial_profiles");
            const profiles = raw ? JSON.parse(raw) : {};
            return profiles[clean] || {};
        } catch (e) {
            return {};
        }
    }

    function isTrialAccount(email) {
        if (!email) return false;
        const clean = String(email).trim().toLowerCase();
        if (!clean) return false;
        const list = getApprovedTrialEmails();
        return list.includes(clean);
    }

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

    // SHA-256 HASH HELPER (Web Crypto API)
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(String(message || "").trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // ROSTER & DIRECTORY
    async function loadRoster() {
        try {
            let res = await fetch("/lms/master_learners_roster.json");
            if (!res.ok) {
                res = await fetch("authorized_roster.json");
            }
            if (res.ok) {
                authorizedRoster = await res.json();
                return;
            }
        } catch (e) {
            // fallback
        }
        try {
            const resFallback = await fetch("authorized_roster.json");
            if (resFallback.ok) {
                authorizedRoster = await resFallback.json();
            }
        } catch (err) {
            console.warn("Offline/Fallback authorized roster mode", err);
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
        
        // Tìm tất cả các ứng viên khớp danh tính (hỗ trợ trường hợp 1 email có nhiều khóa học)
        const candidates = authorizedRoster.filter(l => {
            const lKey = (l.Compound_Key || l.compound_key || "").toLowerCase();
            const lEmail = (l.Email || l.email) ? normalizeIdentity(l.Email || l.email) : "";
            const lPhone = l.Phone || l.phone_full || l.phone_raw || l.phone || "";
            const keyMatch = lKey && lKey === id;
            const emailMatch = lEmail && (lEmail === id || lEmail.split('@')[0] === id);
            const phoneMatch = lPhone && normalizePhone(lPhone) === normalizePhone(id);
            return keyMatch || emailMatch || phoneMatch;
        });

        // Ưu tiên chọn bản ghi ACTIVE nếu có nhiều bản ghi của cùng email
        let match = candidates.find(c => (c.Enrollment_Status || c.enrollment_status || "ACTIVE") === "ACTIVE") || candidates[0];

        if (match) {
            let learner = {
                learner_id: match.Compound_Key || match.compound_key || match.learner_id || "DHM-LEARNER",
                compound_key: match.Compound_Key || match.compound_key || "",
                identity: match.Email || match.email || match.Phone || match.phone || match.learner_id || "DHM-LEARNER",
                name: match.Full_Name || match.full_name || match.name || match.Email || match.email,
                email: match.Email || match.email || "",
                phone: match.Phone || match.phone_full || match.phone_raw || match.phone || "",
                phone_last4: (match.Phone || match.phone_full || match.phone || "").slice(-4),
                cohort: match.Cohort_ID || match.cohort || "Học viên",
                enrollment_status: match.Enrollment_Status || match.enrollment_status || "ACTIVE",
                activation_status: match.Activation_Status || match.activation_status || "ACTIVATED",
                role: match.Role || match.role || "Learner",
                is_paid: Boolean(match.Is_Paid === true || match.is_paid === true || match.isPaid === true || match.Is_Paid === "TRUE"),
                payment_status: match.Payment_Status || match.payment_status || match.paymentStatus || null,
                missing_phone: match.phone_status === "legacy_partial" || !(match.Phone || match.phone_full || match.phone),
                force_pwd_change: (match.Force_Pwd_Change === true || match.force_pwd_change === true || match.Force_Pwd_Change === "TRUE"),
                default_pwd: match.Default_Password || match.default_pwd || "1234",
                password_hash: match.Password_Hash || match.password_hash || null
            };
            const ov = overrides[learner.email] || overrides[learner.learner_id];
            if (ov) {
                if (ov.phone) {
                    learner.phone = ov.phone;
                    learner.phone_last4 = ov.phone.slice(-4);
                    learner.missing_phone = false;
                }
                if (ov.password_hash !== undefined) {
                    learner.password_hash = ov.password_hash;
                }
                if (ov.force_pwd_change !== undefined) {
                    learner.force_pwd_change = ov.force_pwd_change;
                }
                if (ov.is_paid !== undefined) {
                    learner.is_paid = Boolean(ov.is_paid);
                }
                if (ov.payment_status !== undefined) {
                    learner.payment_status = ov.payment_status;
                }
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
        if (loginPasswordInput) {
            loginPasswordInput.removeAttribute("required");
            loginPasswordInput.value = "";
            loginPasswordInput.placeholder = "Nhập 4 số cuối Số điện thoại của bạn";
        }
        if (loginIdentityLabel) loginIdentityLabel.textContent = "Email học viên đã đăng ký";
        if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
        if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");
        if (trialRosterNotice) trialRosterNotice.classList.add("hidden");
        if (trialNameInput && trialNameInput.dataset.autoFilled === "true") {
            trialNameInput.value = "";
        }
        if (trialStatusMsg) {
            trialStatusMsg.classList.add("hidden");
            trialStatusMsg.textContent = "";
        }
        if (typeof resetTrialButtonState === "function") resetTrialButtonState();
        if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
        if (newcomerToggleWrapper) newcomerToggleWrapper.classList.remove("hidden");
        if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";

        const currentVal = (loginIdentityInput.value || "").trim();
        if (currentVal.includes("@") && currentVal.length >= 6) {
            const found = findLearner(currentVal);
            if (found) {
                updateAuthModeForLearner(found);
            }
        }
    }

    function showTrialOnboardingView(rawEmail, fromFailedLogin = false) {
        if (authErrorBanner) authErrorBanner.classList.add("hidden");
        if (authUserDetected) authUserDetected.classList.add("hidden");
        if (passwordGroup) passwordGroup.classList.add("hidden");
        if (loginPasswordInput) loginPasswordInput.removeAttribute("required");
        if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
        if (submitAuthWrapper) submitAuthWrapper.classList.add("hidden");
        if (newcomerToggleWrapper) newcomerToggleWrapper.classList.add("hidden");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");

        if (loginIdentityLabel) loginIdentityLabel.textContent = "Email nhận liên kết kích hoạt học thử";

        if (trialOnboardingGroup) {
            trialOnboardingGroup.classList.remove("hidden");
            if (trialRosterNotice) {
                if (fromFailedLogin) {
                    trialRosterNotice.classList.remove("hidden");
                } else {
                    trialRosterNotice.classList.add("hidden");
                }
            }
            if (typeof resetTrialButtonState === "function") resetTrialButtonState();

            const email = (rawEmail || loginIdentityInput.value || "").trim();
            if (email) {
                loginIdentityInput.value = email;
                if (trialNameInput && (!trialNameInput.value || trialNameInput.dataset.autoFilled === "true")) {
                    if (email.includes("@")) {
                        trialNameInput.value = email.split("@")[0];
                        trialNameInput.dataset.autoFilled = "true";
                    }
                }
                if (trialPhoneInput) {
                    trialPhoneInput.focus();
                } else if (trialNameInput) {
                    trialNameInput.focus();
                }
            } else {
                loginIdentityInput.focus();
            }
        }
    }

    function updateAuthModeForLearner(learner) {
        if (!learner) {
            if (authUserDetected) authUserDetected.classList.add("hidden");
            // Mặc định luôn giữ ô password và nút submit
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
            if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
            if (newcomerToggleWrapper) newcomerToggleWrapper.classList.remove("hidden");
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
            if (loginPasswordInput) {
                loginPasswordInput.removeAttribute("required");
                loginPasswordInput.placeholder = "Nhập 4 số cuối Số điện thoại hoặc để trống nếu là người mới";
            }
            if (loginIdentityLabel) loginIdentityLabel.textContent = "Email học viên đã đăng ký";
            return;
        }

        // Đã nhận diện Học viên Chính thức trong danh bạ Roster
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");
        if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
        if (newcomerToggleWrapper) newcomerToggleWrapper.classList.remove("hidden");
        if (loginIdentityLabel) loginIdentityLabel.textContent = "Email học viên đã đăng ký";
        if (authUserDetected) {
            authUserDetected.classList.remove("hidden");
            if (detectedUserName) detectedUserName.textContent = learner.name || learner.email;
            if (detectedUserCohort) detectedUserCohort.textContent = learner.cohort || "Học viên";
        }

        const isApolloOrPwdAuth = learner.force_pwd_change || learner.password_hash || learner.default_pwd || (learner.cohort && learner.cohort.toLowerCase().includes("apollo"));
        const hasPhone = learner.phone && learner.phone.trim().length >= 8 && !learner.missing_phone;

        if (!hasPhone && !isApolloOrPwdAuth) {
            if (passwordGroup) passwordGroup.classList.add("hidden");
            if (loginPasswordInput) loginPasswordInput.removeAttribute("required");
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.remove("hidden");
            if (onboardingPhoneInput) onboardingPhoneInput.setAttribute("required", "true");
            if (btnSubmitText) btnSubmitText.textContent = "Kích Hoạt & Vào Học";
        } else {
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (loginPasswordInput) {
                loginPasswordInput.removeAttribute("required");
                if (learner.force_pwd_change) {
                    loginPasswordInput.placeholder = "Nhập mật khẩu khởi tạo của bạn";
                } else if (learner.password_hash || learner.default_pwd) {
                    loginPasswordInput.placeholder = "Nhập mật khẩu truy cập của bạn";
                } else {
                    loginPasswordInput.placeholder = "Nhập 4 số cuối Số điện thoại của bạn";
                }
            }
            if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
            if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
        }
    }

    async function verifyPassword(learner, inputPassword) {
        if (!learner) return { valid: false };
        const pwd = String(inputPassword || "").trim();

        const overrides = getRosterOverrides();
        const ov = overrides[learner.email] || overrides[learner.learner_id] || {};
        const passwordHash = ov.password_hash !== undefined ? ov.password_hash : (learner.password_hash || null);
        const forcePwdChange = ov.force_pwd_change !== undefined ? ov.force_pwd_change : (learner.force_pwd_change === true);

        // Ưu tiên 2: Mật khẩu cá nhân đã đổi (đã có password_hash)
        if (passwordHash) {
            const inputHash = await sha256(pwd);
            if (inputHash === passwordHash) {
                return { valid: true, mustChange: false };
            }
            return { valid: false, hasCustomPassword: true };
        }

        // Ưu tiên 3: Mật khẩu mặc định khởi tạo
        const defaultPwd = learner.default_pwd || "1234";
        if (forcePwdChange && pwd === defaultPwd) {
            return { valid: true, mustChange: true };
        }
        if (learner.default_pwd && pwd === learner.default_pwd) {
            return { valid: true, mustChange: forcePwdChange };
        }

        // Ưu tiên 4: Cơ chế kế thừa 4 số cuối SĐT (học viên cũ có SĐT)
        if (learner.phone_last4 && pwd === String(learner.phone_last4).trim()) {
            return { valid: true, mustChange: false };
        }
        if (learner.phone) {
            const last4 = normalizePhone(learner.phone).slice(-4);
            if (last4 && pwd === last4) {
                return { valid: true, mustChange: false };
            }
        }

        return { valid: false };
    }
    window.verifyPassword = verifyPassword;

    async function saveNewPassword(learner, newPassword) {
        const hash = await sha256(newPassword);
        const overrides = getRosterOverrides();
        const currentOv = overrides[learner.email] || overrides[learner.learner_id] || {};
        const updatedLearner = {
            ...learner,
            ...currentOv,
            password_hash: hash,
            force_pwd_change: false
        };
        overrides[learner.email] = updatedLearner;
        localStorage.setItem("dhm_roster_overrides", JSON.stringify(overrides));

        // Cập nhật session currentUser
        currentUser = updatedLearner;
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));

        // Webhook đồng bộ về Google Sheets CRM (chạy ngầm, không chặn UI)
        const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
        const payload = {
            action: "update_password",
            email: learner.email,
            password_hash: hash,
            force_pwd_change: false
        };
        try {
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload)
            }).catch(err => console.warn("Background password sync notice:", err));
        } catch (e) {
            console.warn("Webhook update_password failed to dispatch:", e);
        }

        return updatedLearner;
    }

    async function checkUrlMagicLinkVerification() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const email = urlParams.get("email");
        const action = urlParams.get("action");

        if (token && (action === "verify" || action === "verify_token")) {
            const cleanEmail = (email || "").trim().toLowerCase();
            if (cleanEmail) {
                saveApprovedTrialEmail(cleanEmail);
            }

            // Dọn dẹp URL param để giữ đường dẫn sạch đẹp
            window.history.replaceState({}, document.title, window.location.pathname);

            // Tự động cấp quyền học thử Chặng 1 tức thì (Optimistic Access)
            // Ngăn chặn học viên bị chặn do mạng lag, lỗi CORS 302 của Apps Script, hoặc token đã dùng 1 lần
            const baseTrialUser = {
                learner_id: "TRIAL-" + Date.now().toString(36).toUpperCase(),
                name: cleanEmail ? cleanEmail.split("@")[0] : "Học viên Trải nghiệm",
                email: cleanEmail,
                phone: "",
                phone_last4: "",
                cohort: "Học viên Trải nghiệm",
                role: "trial",
                isTrial: true
            };

            currentUser = baseTrialUser;
            localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
            if (authErrorBanner) authErrorBanner.classList.add("hidden");
            hideAuthModal();
            applyUserSession();

            // Xác thực ngầm với Google Apps Script Webhook để đồng bộ Leads_Directory & làm giàu profile
            try {
                const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
                const verifyEndpoint = `${webhookUrl}?action=verify_token&token=${encodeURIComponent(token)}&email=${encodeURIComponent(cleanEmail)}`;

                const resp = await fetch(verifyEndpoint);
                const data = await resp.json();

                if ((data && data.success && data.verified) || (data && data.error === "TOKEN_ALREADY_USED")) {
                    const user = (data && data.user) || {};
                    if (user.lead_id) currentUser.learner_id = user.lead_id;
                    if (user.full_name) currentUser.name = user.full_name;
                    if (user.phone) {
                        currentUser.phone = user.phone;
                        currentUser.phone_last4 = user.phone.slice(-4);
                    }
                    localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
                    applyUserSession();
                }
            } catch (err) {
                console.warn("Background magic link verification error (optimistic login preserved):", err);
            }

            alert("🎉 Xác thực thành công!\n\nChào mừng bạn đến với trải nghiệm học thử Chặng 1 (Pre-Class 90 phút) của Delivering Happiness LMS.");
            return true;
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

    function initGuestPreview() {
        if (btnHeaderLogin) btnHeaderLogin.classList.remove("hidden");
        if (userChip) userChip.classList.add("hidden");
        renderSyllabus();
        loadStage(0);
        updateGlobalProgress();
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
                initGuestPreview();
                showAuthModal();
                triggerAutoTelemetryOnBoot();
            }
        } else {
            initGuestPreview();
            showAuthModal();
            triggerAutoTelemetryOnBoot();
        }
    }

    function showAuthModal() {
        resetToDefaultLoginView();
        authModal.classList.remove("hidden");
        setTimeout(() => loginIdentityInput.focus(), 100);
    }

    function hideAuthModal() {
        authModal.classList.add("hidden");
        if (!currentUser) {
            initGuestPreview();
        }
    }

    function applyUserSession() {
        hideAuthModal();
        if (btnHeaderLogin) btnHeaderLogin.classList.add("hidden");
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
        if (!currentUser.identity) {
            currentUser.identity = currentUser.email || currentUser.learner_id || "guest";
        }
        const progressKey = `dhm_lms_progress_${currentUser.identity}`;
        const saved = localStorage.getItem(progressKey);
        if (saved) {
            try {
                learnerProgress = JSON.parse(saved);
                migrateOldStageData(learnerProgress);
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
        updatePersonalValueLinks();
        triggerAutoTelemetryOnBoot();
    }

    function updatePersonalValueLinks() {
        updateAssessmentLinks();
    }

    function updateAssessmentLinks() {
        try {
            const selectors = [
                'a[href*="personal-value.html"]',
                'a[href*="practice-abcde.html"]',
                'a[href*="khao-sat-tinh-cach"]',
                'a[href*="khao-sat-xung-dot-tki"]'
            ];
            const targetLinks = document.querySelectorAll(selectors.join(', '));
            const targetEmail = (currentUser && (currentUser.email || currentUser.identity)) 
                ? (currentUser.email || currentUser.identity).toLowerCase().trim() 
                : "";
            targetLinks.forEach(link => {
                const href = link.getAttribute("href") || "";
                const baseUrl = href.split("?")[0];
                if (targetEmail) {
                    link.setAttribute("href", `${baseUrl}?email=${encodeURIComponent(targetEmail)}&source=lms`);
                } else {
                    link.setAttribute("href", baseUrl);
                }
            });
        } catch (e) {
            console.warn("Lỗi cập nhật liên kết khảo sát & thực hành:", e);
        }
    }

    function saveLearnerProgress() {
        if (!currentUser) return;
        if (!currentUser.identity) {
            currentUser.identity = currentUser.email || currentUser.learner_id || "guest";
        }
        syncLegacyStageData(learnerProgress);
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

    async function dispatchTelemetryPayloadWithAck(payload, webhookUrl, maxRetries = 2) {
        if (!webhookUrl) return { success: false, error: "MISSING_WEBHOOK_URL" };
        const bodyStr = JSON.stringify(payload);
        const retryDelayMs = (typeof window !== "undefined" && window.__DHM_TELEMETRY_RETRY_DELAY_MS !== undefined)
            ? Number(window.__DHM_TELEMETRY_RETRY_DELAY_MS)
            : 2000;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const resp = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: bodyStr,
                    redirect: "follow"
                });
                const text = await resp.text();
                let data = null;
                try {
                    data = JSON.parse(text);
                } catch (parseErr) {
                    data = null;
                }
                if (data && data.success === true) {
                    return { success: true, data: data, attempts: attempt + 1 };
                }
                if (data && data.retry === true && attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, retryDelayMs));
                    continue;
                }
                if (!resp.ok && attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, retryDelayMs));
                    continue;
                }
                return {
                    success: false,
                    error: (data && data.error) ? data.error : `HTTP_${resp.status}`,
                    retry: Boolean(data && data.retry),
                    data: data,
                    attempts: attempt + 1
                };
            } catch (err) {
                if (attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, retryDelayMs));
                    continue;
                }
                return {
                    success: false,
                    error: err && err.message ? err.message : "NETWORK_ERROR",
                    attempts: attempt + 1
                };
            }
        }
        return { success: false, error: "MAX_RETRIES_EXCEEDED" };
    }

    function dispatchTelemetryPayload(payload, webhookUrl) {
        if (!webhookUrl) return false;
        dispatchTelemetryPayloadWithAck(payload, webhookUrl, 2).catch(() => {});
        return true;
    }

    function buildFiveStationBridgeUrl(userObj) {
        const base = "https://team-happiness-iam.vercel.app/";
        const u = userObj || currentUser || null;
        if (!u) return base;
        const params = new URLSearchParams();
        if (u.name || u.full_name) params.set("name", u.name || u.full_name);
        if (u.email || u.identity) params.set("email", u.email || u.identity);
        if (u.phone) params.set("phone", u.phone);
        if (u.cohort) params.set("center", u.cohort);
        const qs = params.toString();
        return qs ? `${base}?${qs}` : base;
    }

    function renderLmsSyncStatusBanner(state, detail) {
        if (typeof document === "undefined") return;
        // Gỡ bỏ sạch sẽ toàn bộ biểu ngữ đồng bộ kỹ thuật trên giao diện học viên
        const topBanner = document.getElementById("dhm-sync-status-banner");
        if (topBanner) topBanner.remove();
        const modalBanner = document.getElementById("dhm-auth-modal-sync-banner");
        if (modalBanner) modalBanner.remove();
    }

    function syncQuizResultToWebhook(score, total, percentage, passed, attempt, answers) {
        if (!currentUser) return;
        const webhookUrl = LMS_CONFIG.AUTHORIZED_WEBHOOKS[0];
        if (!webhookUrl) return;

        const payload = {
            action: "sync_quiz_result",
            type: "QUIZ_SUBMISSION",
            learner_id: currentUser.learner_id || "DHM-USER",
            name: currentUser.name || "",
            email: currentUser.email || currentUser.identity || "",
            phone: currentUser.phone || "",
            cohort: currentUser.cohort || "Team Happiness Apollo",
            score: score,
            total_questions: total,
            percentage: percentage,
            passed: passed,
            attempt_number: attempt || 1,
            answers: answers || {},
            target_sheet_id: "1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak",
            target_sheet_name: "Thu Hoạch IAM",
            timestamp: new Date().toISOString()
        };

        dispatchTelemetryPayloadWithAck(payload, webhookUrl, 2).catch(() => {});
    }

    function syncMeValuesToWebhook(values) {
        if (!currentUser) return;
        const webhookUrl = LMS_CONFIG.AUTHORIZED_WEBHOOKS[0];
        if (!webhookUrl) return;

        const payload = {
            action: "sync_me_values",
            type: "ME_VALUES_SUBMISSION",
            learner_id: currentUser.learner_id || "DHM-USER",
            name: currentUser.name || "",
            email: currentUser.email || currentUser.identity || "",
            phone: currentUser.phone || "",
            cohort: currentUser.cohort || "Team Happiness Apollo",
            top7_values: values || [],
            target_sheet_id: "1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak",
            target_sheet_name: "Thu Hoạch IAM",
            timestamp: new Date().toISOString()
        };

        dispatchTelemetryPayloadWithAck(payload, webhookUrl, 2).catch(() => {});
    }

    function hasNonEmptyIamObj(obj) {
        if (!obj || typeof obj !== "object") return false;
        return Boolean((obj.I && String(obj.I).trim()) || (obj.A && String(obj.A).trim()) || (obj.M && String(obj.M).trim()));
    }

    function hasStage2HabitContent(habits) {
        if (!habits || typeof habits !== "object") return false;
        const d = habits.drivers || {};
        const g = habits.gratitude || {};
        const m = habits.mindfulness || {};
        const o = habits.optimism || {};
        const f = habits.flow || {};
        const a = habits.altruism || {};

        const hasDrivers = hasNonEmptyIamObj(d.iam);
        const hasGratitude = (Array.isArray(g.items) && g.items.some(x => String(x || "").trim()))
            || Boolean(g.card && (String(g.card.to || "").trim() || String(g.card.msg || "").trim()))
            || hasNonEmptyIamObj(g.iam);
        const hasMindfulness = Boolean(String(m.situation || "").trim())
            || Boolean(m.sbaChecks && (m.sbaChecks.s || m.sbaChecks.b || m.sbaChecks.a))
            || hasNonEmptyIamObj(m.iam);
        const hasOptimism = Boolean(o.abcde && Object.values(o.abcde).some(v => String(v || "").trim()))
            || hasNonEmptyIamObj(o.iam);
        const hasFlow = Boolean(String(f.boringTask || "").trim() || String(f.redesign || "").trim())
            || hasNonEmptyIamObj(f.iam);
        const hasAltruism = Boolean(String(a.style || "").trim() || String(a.act || "").trim())
            || hasNonEmptyIamObj(a.iam);

        return hasDrivers || hasGratitude || hasMindfulness || hasOptimism || hasFlow || hasAltruism;
    }

    function extractIamAndNotesTelemetry(prog, identity) {
        const s1 = (prog && prog.stageData && prog.stageData["stage-1"]) || {};
        const s2 = (prog && prog.stageData && prog.stageData["stage-2"]) || {};
        const cp1Sets = Array.isArray(s1.iam_cp1_sets) ? s1.iam_cp1_sets : [];
        const cp2Sets = Array.isArray(s1.iam_cp2_sets) ? s1.iam_cp2_sets : [];
        const cp1Legacy = s1.iam_cp1 || { I: "", A: "", M: "" };
        const cp2Legacy = s1.iam_cp2 || { I: "", A: "", M: "" };
        const iam11 = s1.iam_1_1 || { I: "", A: "", M: "" };
        const iam12 = s1.iam_1_2 || { I: "", A: "", M: "" };
        const iam13 = s1.iam_1_3 || { I: "", A: "", M: "" };
        const capstoneIam = s2.capstoneIam || { I: "", A: "", M: "" };
        const capstoneSets = Array.isArray(s2.capstone_sets) ? s2.capstone_sets : [];
        const habits = s2.habits || {};

        const effectiveCp1Sets = cp1Sets.length > 0
            ? cp1Sets
            : (hasNonEmptyIamObj(cp1Legacy) ? [{ id: "legacy_cp1", I: cp1Legacy.I || "", A: cp1Legacy.A || "", M: cp1Legacy.M || "" }] : []);
        const effectiveCp2Sets = cp2Sets.length > 0
            ? cp2Sets
            : (hasNonEmptyIamObj(cp2Legacy) ? [{ id: "legacy_cp2", I: cp2Legacy.I || "", A: cp2Legacy.A || "", M: cp2Legacy.M || "" }] : []);

        let quickNotes = "";
        try {
            if (identity) {
                quickNotes = localStorage.getItem(`dhm_quick_notes_${identity}`) || "";
            }
        } catch (e) {}

        const hasHabitIam = hasStage2HabitContent(habits);
        const hasIamData = effectiveCp1Sets.length > 0
            || effectiveCp2Sets.length > 0
            || hasNonEmptyIamObj(iam11)
            || hasNonEmptyIamObj(iam12)
            || hasNonEmptyIamObj(iam13)
            || hasNonEmptyIamObj(capstoneIam)
            || capstoneSets.length > 0
            || hasHabitIam
            || Boolean(quickNotes && String(quickNotes).trim());

        const habitsSig = hasHabitIam ? JSON.stringify(habits).length : 0;
        const sigParts = [
            `cp1:${effectiveCp1Sets.map(x => `${x.I || ""}|${x.A || ""}|${x.M || ""}`).join(";")}`,
            `cp2:${effectiveCp2Sets.map(x => `${x.I || ""}|${x.A || ""}|${x.M || ""}`).join(";")}`,
            `m11:${iam11.I || ""}|${iam11.A || ""}|${iam11.M || ""}`,
            `m12:${iam12.I || ""}|${iam12.A || ""}|${iam12.M || ""}`,
            `m13:${iam13.I || ""}|${iam13.A || ""}|${iam13.M || ""}`,
            `cap:${capstoneIam.I || ""}|${capstoneIam.A || ""}|${capstoneIam.M || ""}`,
            `capsets:${capstoneSets.length}`,
            `hab:${habitsSig}`,
            `qn:${quickNotes ? String(quickNotes).trim().length : 0}`
        ];
        const iamSignature = sigParts.join("__");

        return {
            iam_cp1: cp1Legacy,
            iam_cp1_sets: effectiveCp1Sets,
            iam_cp2: cp2Legacy,
            iam_cp2_sets: effectiveCp2Sets,
            iam_1_1: iam11,
            iam_1_2: iam12,
            iam_1_3: iam13,
            stage2_capstone: capstoneIam,
            stage2_capstone_sets: capstoneSets,
            stage2_habits: habits,
            quick_notes: quickNotes,
            hasIamData: hasIamData,
            iamSignature: iamSignature
        };
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

        const identity = currentUser.identity || currentUser.email || currentUser.learner_id || "guest";
        const s1 = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        const s1AnsweredCount = Object.keys(s1.quizAnswers || {}).length;
        const hasRealQuizAttempt = s1AnsweredCount > 0 || (typeof s1.score === "number" && s1.score > 0) || s1.passed === true;
        const iamTelemetry = extractIamAndNotesTelemetry(learnerProgress, identity);
        const payload = {
            action: "sync_full_progress",
            learner_id: currentUser.learner_id || "DHM-USER",
            name: currentUser.name || "",
            email: currentUser.email || currentUser.identity,
            phone: currentUser.phone || "",
            cohort: currentUser.cohort || "",
            completed_stages: learnerProgress.completedStages,
            stage1_quiz_score: hasRealQuizAttempt && s1.score !== undefined ? s1.score : null,
            stage1_quiz_total: s1.totalQuestions || 10,
            stage1_quiz_percentage: hasRealQuizAttempt && s1.percentage !== undefined ? s1.percentage : null,
            stage1_quiz_passed: hasRealQuizAttempt ? Boolean(s1.passed) : null,
            stage1_quiz_attempts: hasRealQuizAttempt ? (s1.quizAttempts || 1) : 0,
            stage1_quiz_answers: hasRealQuizAttempt ? (s1.quizAnswers || {}) : {},
            stage1_values: s1.selectedValues || [],
            stage1_iam_cp1: iamTelemetry.iam_cp1,
            stage1_iam_cp1_sets: iamTelemetry.iam_cp1_sets,
            stage1_iam_cp2: iamTelemetry.iam_cp2,
            stage1_iam_cp2_sets: iamTelemetry.iam_cp2_sets,
            stage1_iam_1_1: iamTelemetry.iam_1_1,
            stage1_iam_1_2: iamTelemetry.iam_1_2,
            stage1_iam_1_3: iamTelemetry.iam_1_3,
            stage2_habits: iamTelemetry.stage2_habits,
            stage2_capstone: iamTelemetry.stage2_capstone,
            stage2_capstone_sets: iamTelemetry.stage2_capstone_sets,
            stage3_tracker: (learnerProgress.stageData && learnerProgress.stageData["stage-3"] && learnerProgress.stageData["stage-3"].habitTracker) || {},
            quick_notes: iamTelemetry.quick_notes,
            target_sheet_id: "1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak",
            target_sheet_name: "Tổng Hợp Học Viên",
            timestamp: new Date().toISOString()
        };

        dispatchTelemetryPayloadWithAck(payload, webhookUrl, 2).catch(() => {});
    }

    let autoBootTelemetryTimer = null;

    function resolveLearnerProfileForIdentity(rawIdentity, storedAuthUser, directoryList) {
        const normId = normalizeIdentity(rawIdentity);
        if (currentUser) {
            const curId = normalizeIdentity(currentUser.identity || currentUser.email || currentUser.learner_id);
            if (curId && curId === normId) {
                return {
                    learner_id: currentUser.learner_id || "DHM-USER",
                    identity: rawIdentity,
                    name: currentUser.name || currentUser.full_name || rawIdentity,
                    email: currentUser.email || rawIdentity,
                    phone: currentUser.phone || "",
                    cohort: currentUser.cohort || "Team Happiness Apollo"
                };
            }
        }
        if (storedAuthUser) {
            const stId = normalizeIdentity(storedAuthUser.identity || storedAuthUser.email || storedAuthUser.learner_id);
            if (stId && stId === normId) {
                return {
                    learner_id: storedAuthUser.learner_id || "DHM-USER",
                    identity: rawIdentity,
                    name: storedAuthUser.name || storedAuthUser.full_name || rawIdentity,
                    email: storedAuthUser.email || rawIdentity,
                    phone: storedAuthUser.phone || "",
                    cohort: storedAuthUser.cohort || "Team Happiness Apollo"
                };
            }
        }
        if (Array.isArray(directoryList)) {
            const dirMatch = directoryList.find(u => u && (normalizeIdentity(u.email) === normId || normalizeIdentity(u.identity) === normId || normalizeIdentity(u.learner_id) === normId));
            if (dirMatch) {
                return {
                    learner_id: dirMatch.learner_id || "DHM-USER",
                    identity: rawIdentity,
                    name: dirMatch.name || dirMatch.full_name || dirMatch.email || rawIdentity,
                    email: dirMatch.email || rawIdentity,
                    phone: dirMatch.phone || "",
                    cohort: dirMatch.cohort || "Team Happiness Apollo"
                };
            }
        }
        const rosterMatch = findLearner(rawIdentity);
        if (rosterMatch) {
            return {
                learner_id: rosterMatch.learner_id || "DHM-USER",
                identity: rawIdentity,
                name: rosterMatch.name || rosterMatch.full_name || rosterMatch.email || rawIdentity,
                email: rosterMatch.email || rawIdentity,
                phone: rosterMatch.phone || "",
                cohort: rosterMatch.cohort || "Team Happiness Apollo"
            };
        }
        try {
            const pvHist = JSON.parse(localStorage.getItem(`dhm_pv_history_${rawIdentity}`) || "[]");
            if (Array.isArray(pvHist) && pvHist.length > 0 && pvHist[0]) {
                const p0 = pvHist[0];
                return {
                    learner_id: p0.learner_id || "DHM-USER",
                    identity: rawIdentity,
                    name: p0.name || p0.fullName || p0.email || rawIdentity,
                    email: p0.email || rawIdentity,
                    phone: p0.phone || "",
                    cohort: p0.cohort || "Team Happiness Apollo"
                };
            }
        } catch (e) {}

        return {
            learner_id: "DHM-USER",
            identity: rawIdentity,
            name: rawIdentity,
            email: rawIdentity,
            phone: "",
            cohort: "Team Happiness Apollo"
        };
    }

    function triggerAutoTelemetryOnBoot() {
        let storedAuthUser = null;
        try {
            const rawStoredUser = localStorage.getItem("dhm_lms_auth_user");
            if (rawStoredUser) {
                storedAuthUser = JSON.parse(rawStoredUser);
            }
        } catch (e) {}

        let directoryList = [];
        try {
            directoryList = JSON.parse(localStorage.getItem("dhm_master_learners_directory") || "[]");
        } catch (e) {
            directoryList = [];
        }

        // 1. Quét toàn bộ khóa trong localStorage kể cả khi đã đăng xuất
        const candidateMap = new Map();
        const addCandidate = (idVal) => {
            if (!idVal) return;
            const trimmed = String(idVal).trim();
            const norm = normalizeIdentity(trimmed);
            if (!norm) return;
            if (!candidateMap.has(norm)) {
                candidateMap.set(norm, trimmed);
            }
        };

        if (currentUser && (currentUser.identity || currentUser.email || currentUser.learner_id)) {
            addCandidate(currentUser.identity || currentUser.email || currentUser.learner_id);
        }
        if (storedAuthUser && (storedAuthUser.identity || storedAuthUser.email || storedAuthUser.learner_id)) {
            addCandidate(storedAuthUser.identity || storedAuthUser.email || storedAuthUser.learner_id);
        }

        const allKeys = new Set();
        try {
            if (typeof localStorage.length === "number" && typeof localStorage.key === "function") {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k) allKeys.add(k);
                }
            }
            Object.keys(localStorage).forEach(k => allKeys.add(k));
        } catch (e) {}

        allKeys.forEach(k => {
            if (k.startsWith("dhm_lms_progress_")) {
                addCandidate(k.substring("dhm_lms_progress_".length));
            } else if (k.startsWith("dhm_quick_notes_")) {
                addCandidate(k.substring("dhm_quick_notes_".length));
            } else if (k.startsWith("dhm_pv_history_")) {
                addCandidate(k.substring("dhm_pv_history_".length));
            } else if (k.startsWith("dhm_pv_") && k !== "dhm_personal_values_latest") {
                addCandidate(k.substring("dhm_pv_".length));
            }
        });

        // Kiểm tra thêm dhm_personal_values_latest nếu chưa có candidate nào
        let latestPvObj = null;
        try {
            const rawLatestPv = localStorage.getItem("dhm_personal_values_latest");
            if (rawLatestPv) {
                latestPvObj = JSON.parse(rawLatestPv);
                if (latestPvObj && latestPvObj.email) {
                    addCandidate(latestPvObj.email);
                }
            }
        } catch (e) {}

        const candidateEntries = Array.from(candidateMap.entries());
        const currentActiveNormId = currentUser
            ? normalizeIdentity(currentUser.identity || currentUser.email || currentUser.learner_id)
            : "";

        const pendingSyncItems = [];
        const syncedItems = [];
        let totalFoundWithRealData = 0;
        const now = Date.now();
        const sixtyMinutesMs = 60 * 60 * 1000;

        for (let idx = 0; idx < candidateEntries.length; idx++) {
            const [normId, rawIdentity] = candidateEntries[idx];
            const isCurrentActiveUser = Boolean(currentActiveNormId && normId === currentActiveNormId);

            let prog = null;
            try {
                const rawProgress = localStorage.getItem(`dhm_lms_progress_${rawIdentity}`)
                    || localStorage.getItem(`dhm_lms_progress_${normId}`);
                if (rawProgress) {
                    prog = JSON.parse(rawProgress);
                    // Tuyệt đối chỉ gán biến toàn cục learnerProgress nếu khớp với currentUser đang đăng nhập
                    if (isCurrentActiveUser && typeof learnerProgress !== "undefined" && learnerProgress) {
                        learnerProgress = prog;
                    }
                }
            } catch (e) {}

            if (!prog && isCurrentActiveUser && typeof learnerProgress !== "undefined" && learnerProgress && learnerProgress.stageData) {
                prog = learnerProgress;
            }

            const s1 = (prog && prog.stageData && prog.stageData["stage-1"]) || {};
            const answeredCount = Object.keys(s1.quizAnswers || {}).length;
            const hasRealQuizAttempt = answeredCount > 0 || (typeof s1.score === "number" && s1.score > 0) || s1.passed === true;
            const score = hasRealQuizAttempt && s1.score !== undefined && s1.score !== null ? s1.score : null;
            const percentage = hasRealQuizAttempt && s1.percentage !== undefined && s1.percentage !== null ? s1.percentage : null;
            const passed = hasRealQuizAttempt ? Boolean(s1.passed) : null;
            const attemptNumber = hasRealQuizAttempt ? (s1.quizAttempts || 1) : 0;
            const quizAnswers = hasRealQuizAttempt ? (s1.quizAnswers || {}) : {};

            // Đọc giá trị cá nhân từ s1.selectedValues, dhm_pv_history_<id>, dhm_pv_<id>, hoặc dhm_personal_values_latest (có kiểm tra quyền sở hữu)
            let topValues = (s1.selectedValues && Array.isArray(s1.selectedValues) && s1.selectedValues.length > 0)
                ? s1.selectedValues
                : [];
            if (topValues.length === 0) {
                try {
                    const pvHist = JSON.parse(localStorage.getItem(`dhm_pv_history_${rawIdentity}`) || localStorage.getItem(`dhm_pv_history_${normId}`) || "[]");
                    if (Array.isArray(pvHist) && pvHist.length > 0 && Array.isArray(pvHist[0].top7)) {
                        topValues = pvHist[0].top7.map(v => (typeof v === "object" && v && v.name) ? v.name : String(v));
                    }
                } catch (e) {}
            }
            if (topValues.length === 0) {
                try {
                    const pvSingle = JSON.parse(localStorage.getItem(`dhm_pv_${rawIdentity}`) || localStorage.getItem(`dhm_pv_${normId}`) || "null");
                    if (pvSingle && Array.isArray(pvSingle.top7)) {
                        topValues = pvSingle.top7.map(v => (typeof v === "object" && v && v.name) ? v.name : String(v));
                    }
                } catch (e) {}
            }
            if (topValues.length === 0 && latestPvObj && Array.isArray(latestPvObj.top7)) {
                const pvEmailNorm = latestPvObj.email ? normalizeIdentity(latestPvObj.email) : "";
                if ((pvEmailNorm && pvEmailNorm === normId) || (!pvEmailNorm && candidateEntries.length === 1)) {
                    topValues = latestPvObj.top7.map(v => (typeof v === "object" && v && v.name) ? v.name : String(v));
                }
            }

            const iamTelemetry = extractIamAndNotesTelemetry(prog, rawIdentity);
            const hasQuizData = hasRealQuizAttempt;
            const hasPvData = topValues.length > 0;

            if (!hasQuizData && !hasPvData && !iamTelemetry.hasIamData) {
                continue;
            }

            totalFoundWithRealData++;
            const resolvedUser = resolveLearnerProfileForIdentity(rawIdentity, storedAuthUser, directoryList);

            const summaryParts = [];
            if (hasQuizData) summaryParts.push(`Quiz ${score !== null ? score + "/10" : ""}`);
            if (hasPvData) summaryParts.push(`${topValues.length} Giá trị cốt lõi`);
            if (iamTelemetry.iam_cp1_sets.length > 0) summaryParts.push(`${iamTelemetry.iam_cp1_sets.length} bộ CP1`);
            if (iamTelemetry.iam_cp2_sets.length > 0) summaryParts.push(`${iamTelemetry.iam_cp2_sets.length} bộ CP2`);
            if (iamTelemetry.hasIamData && iamTelemetry.iam_cp1_sets.length === 0 && iamTelemetry.iam_cp2_sets.length === 0) {
                summaryParts.push("Thu hoạch I•A•M");
            }
            const itemSummaryText = summaryParts.join(", ") || "Bài làm LMS";

            const topValuesString = topValues.join(",");
            const stateHash = `${rawIdentity}__s:${score !== null ? score : 'none'}__a:${answeredCount}__v:${topValuesString}__iam:${iamTelemetry.iamSignature}`;

            const lastHashKey = `dhm_telemetry_last_hash_${rawIdentity}`;
            const lastTimeKey = `dhm_telemetry_last_sync_time_${rawIdentity}`;
            const lastHash = localStorage.getItem(lastHashKey);
            const lastTime = parseInt(localStorage.getItem(lastTimeKey) || "0", 10);

            if (lastHash === stateHash && (now - lastTime < sixtyMinutesMs)) {
                syncedItems.push({ user: resolvedUser, summaryText: itemSummaryText });
                continue;
            }

            pendingSyncItems.push({
                rawIdentity,
                normId,
                prog,
                s1,
                resolvedUser,
                score,
                percentage,
                passed,
                attemptNumber,
                quizAnswers,
                topValues,
                stateHash,
                lastHashKey,
                lastTimeKey,
                summaryText: itemSummaryText
            });
        }

        if (totalFoundWithRealData === 0) {
            renderLmsSyncStatusBanner("EMPTY_BROWSER", { user: currentUser || storedAuthUser });
            return;
        }

        if (pendingSyncItems.length === 0 && syncedItems.length > 0) {
            const firstSynced = syncedItems[0];
            renderLmsSyncStatusBanner("SUCCESS", {
                user: firstSynced.user,
                learnerName: syncedItems.map(x => x.user.name || x.user.email).join(", "),
                summaryText: syncedItems.map(x => x.summaryText).join(" • ")
            });
            return;
        }

        if (autoBootTelemetryTimer) {
            return;
        }

        const firstPending = pendingSyncItems[0];
        renderLmsSyncStatusBanner("SYNCING", {
            user: firstPending.resolvedUser,
            learnerName: pendingSyncItems.map(x => x.resolvedUser.name || x.resolvedUser.email).join(", "),
            summaryText: pendingSyncItems.map(x => x.summaryText).join(" • ")
        });

        const bootDelayMs = (typeof window !== "undefined" && window.__DHM_BOOT_TELEMETRY_DELAY_MS !== undefined)
            ? Number(window.__DHM_BOOT_TELEMETRY_DELAY_MS)
            : 250;

        autoBootTelemetryTimer = setTimeout(async () => {
            autoBootTelemetryTimer = null;
            const webhookUrl = LMS_CONFIG.AUTHORIZED_WEBHOOKS[0];
            if (!webhookUrl) return;

            const newlySynced = [...syncedItems];
            const failedSync = [];
            for (let i = 0; i < pendingSyncItems.length; i++) {
                const item = pendingSyncItems[i];
                const latestIam = extractIamAndNotesTelemetry(item.prog, item.rawIdentity);
                const payload = {
                    action: "auto_boot_sync",
                    type: "AUTO_BOOT_TELEMETRY",
                    learner_id: item.resolvedUser.learner_id || "DHM-USER",
                    name: item.resolvedUser.name || "",
                    email: item.resolvedUser.email || item.rawIdentity || "",
                    phone: item.resolvedUser.phone || "",
                    cohort: item.resolvedUser.cohort || "Team Happiness Apollo",
                    score: item.score,
                    total_questions: item.s1.totalQuestions || 10,
                    percentage: item.percentage,
                    passed: item.passed,
                    attempt_number: item.attemptNumber,
                    answers: item.quizAnswers,
                    top7_values: item.topValues,
                    stage1_iam_cp1: latestIam.iam_cp1,
                    stage1_iam_cp1_sets: latestIam.iam_cp1_sets,
                    stage1_iam_cp2: latestIam.iam_cp2,
                    stage1_iam_cp2_sets: latestIam.iam_cp2_sets,
                    stage1_iam_1_1: latestIam.iam_1_1,
                    stage1_iam_1_2: latestIam.iam_1_2,
                    stage1_iam_1_3: latestIam.iam_1_3,
                    stage2_habits: latestIam.stage2_habits,
                    stage2_capstone: latestIam.stage2_capstone,
                    stage2_capstone_sets: latestIam.stage2_capstone_sets,
                    quick_notes: latestIam.quick_notes,
                    target_sheet_id: "1Ju4y-KNDe7eiMvpbyq2mPfKTijH_1NIC3j8Rykl7cak",
                    target_sheet_name: "Thu Hoạch IAM",
                    telemetry_hash: item.stateHash,
                    timestamp: new Date().toISOString()
                };

                const ack = await dispatchTelemetryPayloadWithAck(payload, webhookUrl, 2);
                if (ack && ack.success === true) {
                    try {
                        localStorage.setItem(item.lastHashKey, item.stateHash);
                        localStorage.setItem(item.lastTimeKey, String(Date.now()));
                    } catch (e) {}
                    newlySynced.push({ user: item.resolvedUser, summaryText: item.summaryText });
                } else {
                    failedSync.push(item);
                }
            }

            if (newlySynced.length > 0) {
                renderLmsSyncStatusBanner("SUCCESS", {
                    user: newlySynced[0].user,
                    learnerName: newlySynced.map(x => x.user.name || x.user.email).join(", "),
                    summaryText: newlySynced.map(x => x.summaryText).join(" • ")
                });
            } else if (failedSync.length > 0) {
                renderLmsSyncStatusBanner("ERROR", {
                    user: failedSync[0].resolvedUser,
                    learnerName: failedSync.map(x => x.resolvedUser.name || x.resolvedUser.email).join(", ")
                });
            }
        }, bootDelayMs);
    }

    window.triggerAutoTelemetryOnBoot = triggerAutoTelemetryOnBoot;
    window.dispatchTelemetryPayload = dispatchTelemetryPayload;
    window.dispatchTelemetryPayloadWithAck = dispatchTelemetryPayloadWithAck;
    window.renderLmsSyncStatusBanner = renderLmsSyncStatusBanner;
    window.extractIamAndNotesTelemetry = extractIamAndNotesTelemetry;

    function syncHabitTrackerToCRM() {
        const statusEl = document.getElementById("habit-sync-status");
        if (statusEl) statusEl.textContent = "";
        if (!currentUser) {
            return;
        }

        const s3 = (learnerProgress.stageData && learnerProgress.stageData["stage-3"]) || { habitTracker: {}, weeklyCheckins: {} };
        const tracker = s3.habitTracker || {};
        const habitKeys = ["mindfulness", "gratitude", "optimism", "flow", "altruism"];
        let totalChecks = 0;
        for (let d = 1; d <= 21; d++) {
            const dayData = tracker[`day_${d}`] || {};
            totalChecks += habitKeys.filter(k => !!dayData[k]).length;
        }

        if (totalChecks === 0) {
            return;
        }

        const streakResult = calculateStage3Streak(tracker);
        const maxChecks = 21 * 5;
        const completionPct = Math.round((totalChecks / maxChecks) * 1000) / 10;

        const payload = {
            action: "sync_habit_tracker",
            learner_id: currentUser.learner_id || "DHM-USER",
            name: currentUser.name || "",
            email: currentUser.email || currentUser.identity || "",
            phone: currentUser.phone || "",
            cohort: currentUser.cohort || "",
            sync_timestamp: new Date().toISOString(),
            habit_tracker: tracker,
            streak_stats: {
                current_streak: streakResult.currentStreak || 0,
                longest_streak: streakResult.longestStreak || 0,
                total_days_active: streakResult.totalCompletedDays || 0,
                total_checks: totalChecks,
                completion_percent: completionPct
            },
            weekly_checkins: s3.weeklyCheckins || {}
        };

        const webhookUrl = LMS_CONFIG.AUTHORIZED_WEBHOOKS[0];
        if (!webhookUrl) {
            return;
        }

        let sent = false;
        try {
            if (navigator.sendBeacon) {
                sent = navigator.sendBeacon(webhookUrl, JSON.stringify(payload));
            }
        } catch (e) {
            sent = false;
        }

        if (!sent) {
            fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload),
                keepalive: true,
                mode: "no-cors"
            }).catch(() => {});
        }

        const now = new Date();
        const syncKey = "dhm_habit_last_sync_" + (currentUser.email || currentUser.identity);
        localStorage.setItem(syncKey, now.toISOString());
    }

    function recordLearnerInDirectory() {
        if (!currentUser) return;
        try {
            let directory = JSON.parse(localStorage.getItem("dhm_master_learners_directory") || "[]");
            const userIdentifier = currentUser.identity || currentUser.email || currentUser.learner_id || "guest";
            const idx = directory.findIndex(u => (u.email && u.email === currentUser.email) || (u.identity && u.identity === userIdentifier));
            const userEntry = {
                learner_id: currentUser.learner_id || userIdentifier,
                identity: userIdentifier,
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

    // 5.5 STAGE UNLOCKING & PAYMENT GATE (Cổng Vượt Chặng & Kiểm Tra Thanh Toán Các Khóa DH)
    const DHM_PAID_GATE_CONFIG = {
        LATEST_COHORTS: ["DHM9", "DHM10"],
        HISTORICAL_PAID_COHORTS: ["DHM3", "DHM4", "DHM5", "DHM6", "DHM7", "DHM8"],
        LINKEDIN_URL: "https://www.linkedin.com/company/culturecodecommunity/"
    };

    function isPaidDHMLearner(user) {
        if (!user) return false;
        if (user.isTrial === true || user.role === "trial") return false;

        // ƯU TIÊN 1: NẾU BỊ VÔ HIỆU HÓA HOẶC THU HỒI THANH TOÁN -> CHẶN NGAY LẬP TỨC
        if (user.enrollment_status === "DISABLED") return false;
        if (user.is_paid === false || String(user.payment_status || "").toUpperCase() === "UNPAID") {
            return false;
        }

        const isCoach = (
            user.cohort === "COACH" || 
            user.cohort === "BTC / Coach" || 
            user.role === "admin" || 
            user.role === "Coach"
        );
        if (isCoach) return true;

        const cohortStr = String(user.cohort || "").trim().toUpperCase();

        // 1. Kiểm tra trực tiếp cờ thanh toán trên user (từ roster, CRM, hoặc override)
        if (user.is_paid === true || user.isPaid === true || String(user.payment_status || user.paymentStatus || "").toUpperCase() === "PAID") {
            return true;
        }

        // 2. Kiểm tra session thanh toán SePay / VietQR trên trình duyệt (localStorage / sessionStorage)
        try {
            const sessionPayment = (typeof localStorage !== "undefined" && (
                localStorage.getItem("DHM10_lastPaymentStatus") ||
                localStorage.getItem("dhm_payment_status") ||
                (user.identity && localStorage.getItem(`dhm_paid_${user.identity}`)) ||
                (user.email && localStorage.getItem(`dhm_paid_${user.email}`))
            )) || (typeof sessionStorage !== "undefined" && (
                sessionStorage.getItem("DHM10_lastPaymentStatus") ||
                sessionStorage.getItem("dhm_payment_status")
            ));
            if (sessionPayment && String(sessionPayment).toUpperCase() === "PAID") {
                return true;
            }
        } catch (e) {}

        // 3. Khách đăng ký quan tâm / leads chưa hoàn tất học phí
        if (user.cohort === "DHM_Registration" || user.cohort === "REG") return false;

        // 4. Các khóa lịch sử đã kết thúc (DHM3 -> DHM8): Học viên đã hoàn tất học phí và tốt nghiệp từ trước
        const isHistoricalPaid = DHM_PAID_GATE_CONFIG.HISTORICAL_PAID_COHORTS.some(c => cohortStr.includes(c));
        if (isHistoricalPaid) return true;

        // 5. Doanh nghiệp Apollo (khóa đào tạo doanh nghiệp đã ký hợp đồng)
        if (cohortStr.includes("APOLLO")) return true;

        // 6. Khóa gần nhất (DHM9, DHM10) nếu chưa có cờ thanh toán -> chưa thanh toán
        const isLatestCohort = DHM_PAID_GATE_CONFIG.LATEST_COHORTS.some(c => cohortStr.includes(c));
        if (isLatestCohort) {
            return false;
        }

        return false;
    }
    window.isPaidDHMLearner = isPaidDHMLearner;

    function isCoachOrAdmin(user) {
        if (!user) return false;
        return (
            user.cohort === "COACH" || 
            user.cohort === "BTC / Coach" || 
            user.role === "admin" || 
            user.role === "Coach"
        );
    }
    window.isCoachOrAdmin = isCoachOrAdmin;

    function hasCompletedStage2AIam() {
        const s2a = (learnerProgress && learnerProgress.stageData && (learnerProgress.stageData["stage-2a"] || learnerProgress.stageData["stage-2"])) || {};
        const habits = s2a.habits || {};
        
        function hasNonEmpty(obj) {
            if (!obj) return false;
            return Boolean(String(obj.I || "").trim() || String(obj.A || "").trim() || String(obj.M || "").trim());
        }

        const hasM = hasNonEmpty(habits.mindfulness && habits.mindfulness.iam);
        const hasG = hasNonEmpty(habits.gratitude && habits.gratitude.iam);
        const hasA = hasNonEmpty(habits.altruism && habits.altruism.iam);

        return Boolean(hasM && hasG && hasA);
    }
    window.hasCompletedStage2AIam = hasCompletedStage2AIam;

    function getStage2AIamStatus() {
        const s2a = (learnerProgress && learnerProgress.stageData && (learnerProgress.stageData["stage-2a"] || learnerProgress.stageData["stage-2"])) || {};
        const habits = s2a.habits || {};
        
        function hasNonEmpty(obj) {
            if (!obj) return false;
            return Boolean(String(obj.I || "").trim() || String(obj.A || "").trim() || String(obj.M || "").trim());
        }

        const checks = [
            { name: "Tỉnh thức (SBA)", done: hasNonEmpty(habits.mindfulness && habits.mindfulness.iam) },
            { name: "Biết ơn", done: hasNonEmpty(habits.gratitude && habits.gratitude.iam) },
            { name: "Vị nhân (Smart Giver)", done: hasNonEmpty(habits.altruism && habits.altruism.iam) }
        ];

        const completedCount = checks.filter(c => c.done).length;
        const missingNames = checks.filter(c => !c.done).map(c => c.name);

        return {
            completedCount,
            total: 3,
            missingNames,
            isComplete: completedCount === 3
        };
    }
    window.getStage2AIamStatus = getStage2AIamStatus;

    function hasCompletedStage2BIam() {
        const s2b = (learnerProgress && learnerProgress.stageData && (learnerProgress.stageData["stage-2b"] || learnerProgress.stageData["stage-2"])) || {};
        const habits = s2b.habits || {};
        
        function hasNonEmpty(obj) {
            if (!obj) return false;
            return Boolean(String(obj.I || "").trim() || String(obj.A || "").trim() || String(obj.M || "").trim());
        }

        const hasF = hasNonEmpty(habits.flow && habits.flow.iam);
        const hasO = hasNonEmpty(habits.optimism && habits.optimism.iam);

        return Boolean(hasF && hasO);
    }
    window.hasCompletedStage2BIam = hasCompletedStage2BIam;

    function migrateOldStageData(prog) {
        if (!prog || !prog.stageData) return;
        const sd = prog.stageData;

        // 1. Migrate Stage 2 -> Stage 2A & Stage 2B
        if (sd["stage-2"]) {
            const s2 = sd["stage-2"];
            const s2Habits = s2.habits || {};

            if (!sd["stage-2a"]) {
                sd["stage-2a"] = {
                    iam: s2.iam || { I: "", A: "", M: "" },
                    habits: {
                        drivers: s2Habits.drivers || { iam: { I: "", A: "", M: "" } },
                        mindfulness: s2Habits.mindfulness || { sbaChecks: { s: false, b: false, a: false }, situation: "", iam: { I: "", A: "", M: "" } },
                        gratitude: s2Habits.gratitude || { items: ["", "", "", ""], card: { to: "", msg: "" }, iam: { I: "", A: "", M: "" } },
                        altruism: s2Habits.altruism || { style: "", act: "", iam: { I: "", A: "", M: "" } }
                    },
                    capstoneIam: s2.capstoneIam || { I: "", A: "", M: "" }
                };
            } else {
                sd["stage-2a"].habits = sd["stage-2a"].habits || {};
                if (!sd["stage-2a"].habits.drivers && s2Habits.drivers) sd["stage-2a"].habits.drivers = s2Habits.drivers;
                if (!sd["stage-2a"].habits.mindfulness && s2Habits.mindfulness) sd["stage-2a"].habits.mindfulness = s2Habits.mindfulness;
                if (!sd["stage-2a"].habits.gratitude && s2Habits.gratitude) sd["stage-2a"].habits.gratitude = s2Habits.gratitude;
                if (!sd["stage-2a"].habits.altruism && s2Habits.altruism) sd["stage-2a"].habits.altruism = s2Habits.altruism;
                if (!sd["stage-2a"].capstoneIam && s2.capstoneIam) sd["stage-2a"].capstoneIam = s2.capstoneIam;
            }

            if (!sd["stage-2b"]) {
                sd["stage-2b"] = {
                    habits: {
                        flow: s2Habits.flow || { boringTask: "", redesign: "", iam: { I: "", A: "", M: "" } },
                        optimism: s2Habits.optimism || { abcde: { A: "", B: "", C: "", D: "", E: "" }, iam: { I: "", A: "", M: "" } }
                    },
                    capstoneIam: { I: "", A: "", M: "" }
                };
            } else {
                sd["stage-2b"].habits = sd["stage-2b"].habits || {};
                if (!sd["stage-2b"].habits.flow && s2Habits.flow) sd["stage-2b"].habits.flow = s2Habits.flow;
                if (!sd["stage-2b"].habits.optimism && s2Habits.optimism) sd["stage-2b"].habits.optimism = s2Habits.optimism;
            }
        }

        // 2. Migrate Stage 3 -> Stage 3A & Stage 3B
        if (sd["stage-3"]) {
            const s3 = sd["stage-3"];
            if (!sd["stage-3a"]) {
                sd["stage-3a"] = {
                    habitTracker: s3.habitTracker || {},
                    weeklyCheckins: s3.weeklyCheckins || { w1: "", w2: "", w3: "" }
                };
            }
            if (!sd["stage-3b"]) {
                sd["stage-3b"] = {
                    habitTracker: s3.habitTracker || {},
                    weeklyCheckins: { w1: "", w2: "" }
                };
            }
        }
    }
    window.migrateOldStageData = migrateOldStageData;

    function syncLegacyStageData(prog) {
        if (!prog || !prog.stageData) return;
        const sd = prog.stageData;

        // Sync 2a & 2b -> legacy stage-2
        sd["stage-2"] = sd["stage-2"] || { habits: {}, capstoneIam: {} };
        sd["stage-2"].habits = sd["stage-2"].habits || {};

        const s2a = sd["stage-2a"] || {};
        const s2b = sd["stage-2b"] || {};
        const h2a = s2a.habits || {};
        const h2b = s2b.habits || {};

        if (h2a.drivers) sd["stage-2"].habits.drivers = h2a.drivers;
        if (h2a.mindfulness) sd["stage-2"].habits.mindfulness = h2a.mindfulness;
        if (h2a.gratitude) sd["stage-2"].habits.gratitude = h2a.gratitude;
        if (h2a.altruism) sd["stage-2"].habits.altruism = h2a.altruism;
        if (s2a.capstoneIam) sd["stage-2"].capstoneIam = s2a.capstoneIam;

        if (h2b.flow) sd["stage-2"].habits.flow = h2b.flow;
        if (h2b.optimism) sd["stage-2"].habits.optimism = h2b.optimism;

        // Sync 3a & 3b -> legacy stage-3
        sd["stage-3"] = sd["stage-3"] || { habitTracker: {}, weeklyCheckins: {} };
        const s3a = sd["stage-3a"] || {};
        const s3b = sd["stage-3b"] || {};

        sd["stage-3"].habitTracker = { ...(s3a.habitTracker || {}), ...(s3b.habitTracker || {}) };
        sd["stage-3"].weeklyCheckins = { ...(s3a.weeklyCheckins || {}), ...(s3b.weeklyCheckins || {}) };
    }
    window.syncLegacyStageData = syncLegacyStageData;
    function isStageUnlocked(stageIdOrIdx) {
        let stageId = "";
        let stageIdx = -1;

        if (typeof stageIdOrIdx === "number") {
            stageIdx = stageIdOrIdx;
            const stg = curriculum && curriculum.stages && curriculum.stages[stageIdx];
            if (stg) stageId = stg.id;
        } else if (typeof stageIdOrIdx === "string") {
            stageId = stageIdOrIdx;
            if (curriculum && curriculum.stages) {
                stageIdx = curriculum.stages.findIndex(s => s.id === stageId);
            }
        }

        // Chặng 1 luôn luôn mở
        if (stageIdx === 0 || stageId === "stage-1") return true;

        const isCoach = isCoachOrAdmin(currentUser);
        if (isCoach) return true;

        // Chặng 2A (hoặc index 1, hoặc legacy stage-2): Mở khi vượt Cổng Sát Hạch Chặng 1 (>= 80%) và là học viên chính thức
        if (stageIdx === 1 || stageId === "stage-2a" || stageId === "stage-2") {
            const s1Data = (learnerProgress && learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
            const isQuizPassed = Boolean(s1Data.passed || (s1Data.percentage >= 80) || (s1Data.score >= 8));
            const isPaid = isPaidDHMLearner(currentUser);
            return Boolean(isQuizPassed && isPaid);
        }

        // Chặng 2B (hoặc index 2): Luồng mở riêng (cờ danh bạ hoặc token tham số URL)
        if (stageIdx === 2 || stageId === "stage-2b") {
            const hasCohortFlag = Boolean(currentUser && (currentUser.hasStage2B || currentUser.canAccessStage2B || currentUser.cohort === "DHM-ADVANCED"));
            const hasTokenUnlocked = Boolean(localStorage.getItem("dhm_unlocked_stage_2b") === "true");
            return Boolean(hasCohortFlag || hasTokenUnlocked);
        }

        // Chặng 3A (hoặc index 3, hoặc legacy stage-3): Tự động mở khi hoàn thành đủ 100% bài thu hoạch I•A•M của 3 thói quen 2A
        if (stageIdx === 3 || stageId === "stage-3a" || stageId === "stage-3") {
            const is2AOpen = isStageUnlocked("stage-2a");
            const is2AIamDone = hasCompletedStage2AIam();
            return Boolean(is2AOpen && is2AIamDone);
        }

        // Chặng 3B (hoặc index 4): Mở khi Chặng 2B mở và hoàn thành IAM của 2B
        if (stageIdx === 4 || stageId === "stage-3b") {
            const is2BOpen = isStageUnlocked("stage-2b");
            const is2BIamDone = hasCompletedStage2BIam();
            return Boolean(is2BOpen && is2BIamDone);
        }

        return false;
    }
    window.isStageUnlocked = isStageUnlocked;

    function notifyLockedStage(stageIdOrIdx) {
        if (!currentUser) {
            showAuthModal();
            return;
        }

        if (currentUser && currentUser.isTrial) {
            showTrialUpgradeModal();
            return;
        }

        let stageId = "";
        let stageIdx = -1;
        if (typeof stageIdOrIdx === "number") {
            stageIdx = stageIdOrIdx;
            const stg = curriculum && curriculum.stages && curriculum.stages[stageIdx];
            if (stg) stageId = stg.id;
        } else if (typeof stageIdOrIdx === "string") {
            stageId = stageIdOrIdx;
            if (curriculum && curriculum.stages) {
                stageIdx = curriculum.stages.findIndex(s => s.id === stageId);
            }
        }

        // 1. Chặng 2A
        if (stageIdx === 1 || stageId === "stage-2a" || stageId === "stage-2") {
            const s1Data = (learnerProgress && learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
            const isQuizPassed = Boolean(s1Data.passed || (s1Data.percentage >= 80) || (s1Data.score >= 8));

            if (!isQuizPassed) {
                alert("🔒 Chặng 2A đang bị khóa!\n\nBạn cần hoàn thành và đạt tối thiểu 80% ở Cổng Sát Hạch Vượt Chặng (Chặng 1) để mở khóa Chặng 2A.");
                jumpToStage1Quiz();
                return;
            }

            const msg = "Chặng 2A chỉ dành cho học viên DHM offline chính thức, vui lòng theo dõi các thông báo từ CultureCode để đăng ký tham gia các chương trình tiếp theo.";
            if (window.confirm(`${msg}\n\n👉 Bạn có muốn mở trang LinkedIn của CultureCode để theo dõi thông báo mới nhất không?`)) {
                window.open(DHM_PAID_GATE_CONFIG.LINKEDIN_URL, "_blank", "noopener,noreferrer");
            }
            return;
        }

        // 2. Chặng 2B
        if (stageIdx === 2 || stageId === "stage-2b") {
            alert("🔒 Chặng 2B dành cho lớp chuyên sâu bứt phá (Flow & Lạc Quan ABCDE).\n\nVui lòng quét mã QR tại lớp hoặc liên hệ Coach/Ban Tổ Chức để nhận quyền truy cập.");
            return;
        }

        // 3. Chặng 3A
        if (stageIdx === 3 || stageId === "stage-3a" || stageId === "stage-3") {
            if (!isStageUnlocked("stage-2a")) {
                alert("🔒 Chặng 3A đang tạm khóa.\n\nBạn cần mở khóa và hoàn thành Chặng 2A trước khi truy cập Chặng 3A.");
                return;
            }
            const status = getStage2AIamStatus();
            alert(`🔒 Chặng 3A đang tạm khóa.\n\nBạn cần hoàn thành đủ bài thu hoạch I•A•M của cả 3 thói quen ở Chặng 2A (Tỉnh thức, Biết ơn, Vị nhân) để mở khóa hành trình đồng hành chuyển hóa.\n\nTiến độ hiện tại: ${status.completedCount}/3 trạm.\n${status.missingNames.length > 0 ? '👉 Còn thiếu bài I•A•M: ' + status.missingNames.join(', ') : ''}`);
            return;
        }

        // 4. Chặng 3B
        if (stageIdx === 4 || stageId === "stage-3b") {
            if (!isStageUnlocked("stage-2b")) {
                alert("🔒 Chặng 3B đang tạm khóa.\n\nBạn cần mở khóa và tham gia Chặng 2B (Workshop Bứt Phá) trước khi truy cập Chặng 3B.");
                return;
            }
            alert("🔒 Chặng 3B đang tạm khóa.\n\nBạn cần hoàn thành bài thu hoạch I•A•M của 2 thói quen ở Chặng 2B (Phiêu và Lạc quan) để mở khóa Chặng 3B.");
            return;
        }

        alert("🔒 Chặng này đang tạm khóa.");
    }
    window.notifyLockedStage = notifyLockedStage;

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
                    <div class="text-[11px] ${!isUnlocked ? 'text-slate-500' : 'text-slate-400'} truncate mt-0.5">${!isUnlocked ? (stage.id === 'stage-2b' ? 'Dành cho lớp chuyên sâu bứt phá' : (stage.id === 'stage-3a' ? 'Cần hoàn thành đủ 3 bài I•A•M ở Chặng 2A' : (stage.id === 'stage-3b' ? 'Cần hoàn thành Chặng 2B' : 'Cần đạt ≥80% Cổng Sát Hạch & Học viên chính thức'))) : stage.subtitle}</div>
                </div>
                ${stage.subSections && stage.subSections.length > 0 ? `<span class="stage-toggle-chevron text-xs text-slate-400 shrink-0 transform transition-transform ${isActive ? 'rotate-90' : ''}">▸</span>` : ''}
            `;

            item.addEventListener("click", () => {
                if (!isUnlocked) {
                    notifyLockedStage(idx);
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
                    const s2aData = (learnerProgress.stageData && (learnerProgress.stageData["stage-2a"] || learnerProgress.stageData["stage-2"])) || {};
                    const s2bData = (learnerProgress.stageData && (learnerProgress.stageData["stage-2b"] || learnerProgress.stageData["stage-2"])) || {};
                    const s3aData = (learnerProgress.stageData && (learnerProgress.stageData["stage-3a"] || learnerProgress.stageData["stage-3"])) || {};
                    const s3bData = (learnerProgress.stageData && (learnerProgress.stageData["stage-3b"] || learnerProgress.stageData["stage-3"])) || {};
                    const s2aHabits = s2aData.habits || {};
                    const s2bHabits = s2bData.habits || {};

                    if (sub.id === "sub-1-1") {
                        isSubDone = Boolean((s1Data.viewed && s1Data.viewed["1-1"]) || (s1Data.iam_cp1 && s1Data.iam_cp1.I) || (s1Data.iam_1_1 && s1Data.iam_1_1.I));
                    } else if (sub.id === "sub-1-2") {
                        isSubDone = Boolean((s1Data.selectedValues && s1Data.selectedValues.length > 0) || (s1Data.iam_cp1 && s1Data.iam_cp1.I) || (s1Data.iam_1_2 && s1Data.iam_1_2.I));
                    } else if (sub.id === "sub-1-cp1") {
                        isSubDone = Boolean((s1Data.iam_cp1_sets && s1Data.iam_cp1_sets.length > 0) || (s1Data.iam_cp1 && ((s1Data.iam_cp1.I && s1Data.iam_cp1.I.trim()) || (s1Data.iam_cp1.A && s1Data.iam_cp1.A.trim()) || (s1Data.iam_cp1.M && s1Data.iam_cp1.M.trim()))) || (s1Data.iam_1_2 && s1Data.iam_1_2.I) || (s1Data.iam_1_1 && s1Data.iam_1_1.I));
                    } else if (sub.id === "sub-1-quiz" || sub.id === "sub-1-4") {
                        isSubDone = Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);
                    } else if (sub.id === "sub-2a-0" || sub.id === "sub-2-0") {
                        isSubDone = Boolean((s2aHabits.drivers && s2aHabits.drivers.iam && (s2aHabits.drivers.iam.I || s2aHabits.drivers.iam.A || s2aHabits.drivers.iam.M)) || (s2aData.iam && (s2aData.iam.I || s2aData.iam.A || s2aData.iam.M)));
                    } else if (sub.id === "sub-2a-1" || sub.id === "sub-2-1") {
                        isSubDone = Boolean(s2aHabits.mindfulness && ((s2aHabits.mindfulness.sbaChecks && (s2aHabits.mindfulness.sbaChecks.s || s2aHabits.mindfulness.sbaChecks.b || s2aHabits.mindfulness.sbaChecks.a)) || (s2aHabits.mindfulness.situation && s2aHabits.mindfulness.situation.trim()) || (s2aHabits.mindfulness.iam && (s2aHabits.mindfulness.iam.I || s2aHabits.mindfulness.iam.A || s2aHabits.mindfulness.iam.M))));
                    } else if (sub.id === "sub-2a-2" || sub.id === "sub-2-2") {
                        isSubDone = Boolean(s2aHabits.gratitude && ((s2aHabits.gratitude.items && s2aHabits.gratitude.items.some(x => x && String(x).trim())) || (s2aHabits.gratitude.card && (s2aHabits.gratitude.card.to || s2aHabits.gratitude.card.msg)) || (s2aHabits.gratitude.iam && (s2aHabits.gratitude.iam.I || s2aHabits.gratitude.iam.A || s2aHabits.gratitude.iam.M))));
                    } else if (sub.id === "sub-2a-3" || sub.id === "sub-2-5") {
                        isSubDone = Boolean(s2aHabits.altruism && ((s2aHabits.altruism.style && s2aHabits.altruism.style.trim()) || (s2aHabits.altruism.act && s2aHabits.altruism.act.trim()) || (s2aHabits.altruism.iam && (s2aHabits.altruism.iam.I || s2aHabits.altruism.iam.A || s2aHabits.altruism.iam.M))));
                    } else if (sub.id === "sub-2a-capstone" || sub.id === "sub-2-6") {
                        isSubDone = Boolean(s2aData.capstoneIam && (s2aData.capstoneIam.I || s2aData.capstoneIam.A || s2aData.capstoneIam.M));
                    } else if (sub.id === "sub-2b-1" || sub.id === "sub-2-4") {
                        isSubDone = Boolean(s2bHabits.flow && ((s2bHabits.flow.boringTask && s2bHabits.flow.boringTask.trim()) || (s2bHabits.flow.redesign && s2bHabits.flow.redesign.trim()) || (s2bHabits.flow.iam && (s2bHabits.flow.iam.I || s2bHabits.flow.iam.A || s2bHabits.flow.iam.M))));
                    } else if (sub.id === "sub-2b-2" || sub.id === "sub-2-3") {
                        isSubDone = Boolean(s2bHabits.optimism && ((s2bHabits.optimism.abcde && (s2bHabits.optimism.abcde.A || s2bHabits.optimism.abcde.B || s2bHabits.optimism.abcde.C || s2bHabits.optimism.abcde.D || s2bHabits.optimism.abcde.E)) || (s2bHabits.optimism.iam && (s2bHabits.optimism.iam.I || s2bHabits.optimism.iam.A || s2bHabits.optimism.iam.M))));
                    } else if (sub.id === "sub-2b-capstone") {
                        isSubDone = Boolean(s2bData.capstoneIam && (s2bData.capstoneIam.I || s2bData.capstoneIam.A || s2bData.capstoneIam.M));
                    } else if (sub.id.startsWith("sub-3a-") || sub.id.startsWith("sub-3-")) {
                        isSubDone = Boolean(s3aData.habitTracker && Object.keys(s3aData.habitTracker).length > 0);
                    } else if (sub.id.startsWith("sub-3b-")) {
                        isSubDone = Boolean((s3bData.dailyAbcde && s3bData.dailyAbcde.A) || (s3bData.weeklyCheckins && (s3bData.weeklyCheckins.w1 || s3bData.weeklyCheckins.w2)));
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
                            notifyLockedStage(idx);
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
                                <span class="px-2 py-0.5 rounded bg-brand-amber text-black font-extrabold text-[10px] uppercase tracking-wider shrink-0">Cổng Sát Hạch Vượt Chặng</span>
                                <h3 class="text-xs sm:text-sm lg:text-base font-extrabold text-white truncate">BÀI SÁT HẠCH VƯỢT CHẶNG (10 CÂU)</h3>
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
                            <span>🎯 Đến Cổng Sát Hạch ➔</span>
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
            currentStageIndex = 0;
            notifyLockedStage(stageIdx);
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
        if (stage1PracticeContainer) stage1PracticeContainer.classList.add("hidden");
        if (stage2PracticeContainer) stage2PracticeContainer.classList.add("hidden");
        if (stage2aPracticeContainer) stage2aPracticeContainer.classList.add("hidden");
        if (stage2bPracticeContainer) stage2bPracticeContainer.classList.add("hidden");
        if (stage3PracticeContainer) stage3PracticeContainer.classList.add("hidden");
        if (stage3aPracticeContainer) stage3aPracticeContainer.classList.add("hidden");
        if (stage3bPracticeContainer) stage3bPracticeContainer.classList.add("hidden");

        if (stage.id === "stage-1") {
            if (stage1PracticeContainer) stage1PracticeContainer.classList.remove("hidden");
            renderStage1View(stage);
            initAccordions();
        } else if (stage.id === "stage-2a" || stage.id === "stage-2") {
            if (stage2aPracticeContainer) stage2aPracticeContainer.classList.remove("hidden");
            renderStage2AView(stage);
        } else if (stage.id === "stage-2b") {
            if (stage2bPracticeContainer) stage2bPracticeContainer.classList.remove("hidden");
            renderStage2BView(stage);
        } else if (stage.id === "stage-3a" || stage.id === "stage-3") {
            if (stage3aPracticeContainer) stage3aPracticeContainer.classList.remove("hidden");
            renderStage3AView(stage);
        } else if (stage.id === "stage-3b") {
            if (stage3bPracticeContainer) stage3bPracticeContainer.classList.remove("hidden");
            renderStage3BView(stage);
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

        const footerStageIndicator = document.getElementById("footer-stage-indicator");
        if (footerStageIndicator) {
            const subTitle = stage.stageNumber === 1 ? 'Định Vị La Bàn' : stage.stageNumber === 2 ? '5 Thói Quen' : 'Tiếp Nối Hành Trình';
            footerStageIndicator.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-brand-amber animate-pulse"></span>
                <span class="font-bold text-slate-200">Chặng ${stage.stageNumber}</span>
                <span class="text-slate-600 hidden xs:inline">•</span>
                <span class="text-slate-400 hidden xs:inline">${subTitle}</span>
            `;
        }
    }

    // 8. AUDIO PLAYER CONTROLLER
    function setupAudioPlayer(stage) {
        const audioDetails = document.getElementById("audio-player-details");
        const tracks = stage.audios || [];

        if (stage.id === "stage-1" || tracks.length === 0) {
            if (audioDetails) audioDetails.classList.add("hidden");
            if (audioTrackSelect) {
                audioTrackSelect.innerHTML = `<option value="">Không có tệp âm thanh ở chặng này</option>`;
                audioTrackSelect.disabled = true;
            }
            if (audioTrackSubtitle) audioTrackSubtitle.textContent = "Chặng này không có tệp âm thanh bổ trợ.";
            if (mainAudioSource) mainAudioSource.src = "";
            if (mainAudioPlayer) {
                mainAudioPlayer.pause();
                mainAudioPlayer.load();
                mainAudioPlayer.classList.add("opacity-50", "pointer-events-none");
            }
            return;
        }

        if (audioDetails) audioDetails.classList.remove("hidden");
        if (audioTrackSelect) {
            audioTrackSelect.innerHTML = "";
            audioTrackSelect.disabled = false;
        }
        if (mainAudioPlayer) mainAudioPlayer.classList.remove("opacity-50", "pointer-events-none");

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
        const historyContainer = document.getElementById("pv-history-container");
        const historySelect = document.getElementById("pv-history-select");
        const matrixEl = document.getElementById("pv-transformation-matrix");
        const btnFillIam = document.getElementById("btn-fill-matrix-to-iam");

        if (!bannerEl || !cardEl) return;

        // 1. Thu thập danh sách lịch sử làm bài từ localStorage
        let pvHistory = [];
        let emailKey = "";
        if (currentUser && currentUser.email) {
            emailKey = currentUser.email.toLowerCase().trim();
            const histKey = "dhm_pv_history_" + emailKey;
            const savedHist = localStorage.getItem(histKey);
            if (savedHist) {
                try {
                    const parsed = JSON.parse(savedHist);
                    if (Array.isArray(parsed)) pvHistory = parsed;
                } catch (e) {}
            }

            // Đọc thêm bản đơn lẻ theo email (bỏ encodeURIComponent để khớp định dạng)
            const singleKey = "dhm_pv_" + emailKey;
            const legacyKey = "dhm_pv_" + encodeURIComponent(emailKey);
            const savedByEmail = localStorage.getItem(singleKey) || localStorage.getItem(legacyKey);
            if (savedByEmail) {
                try {
                    const single = JSON.parse(savedByEmail);
                    if (single && single.top7 && Array.isArray(single.top7)) {
                        const exists = pvHistory.some(h => 
                            h.timestamp && single.timestamp && Math.abs(new Date(h.timestamp) - new Date(single.timestamp)) < 10000
                        );
                        if (!exists) pvHistory.unshift(single);
                    }
                } catch (e) {}
            }
        }

        // Đọc fallback bản latest nếu chưa có (chỉ nhận nếu khớp email của currentUser để chống rò rỉ session)
        const savedLatest = localStorage.getItem("dhm_personal_values_latest");
        if (savedLatest) {
            try {
                const latest = JSON.parse(savedLatest);
                const latestEmail = latest && latest.email ? String(latest.email).toLowerCase().trim() : "";
                const isMatchingUser = !emailKey || !latestEmail || (latestEmail === emailKey);
                if (latest && latest.top7 && Array.isArray(latest.top7) && isMatchingUser) {
                    const exists = pvHistory.some(h => 
                        h.timestamp && latest.timestamp && Math.abs(new Date(h.timestamp) - new Date(latest.timestamp)) < 10000
                    );
                    if (!exists) pvHistory.push(latest);
                }
            } catch (e) {}
        }

        // Lọc bản ghi hợp lệ
        pvHistory = pvHistory.filter(h => h && Array.isArray(h.top7) && h.top7.length > 0);

        // Sắp xếp giảm dần theo thời gian (mới nhất lên đầu)
        pvHistory.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeB - timeA;
        });

        // 2. Nếu không có dữ liệu
        if (pvHistory.length === 0) {
            bannerEl.classList.remove("hidden");
            cardEl.classList.add("hidden");
            return;
        }

        bannerEl.classList.add("hidden");
        cardEl.classList.remove("hidden");

        // 3. Hàm hiển thị dữ liệu của một lần làm bài cụ thể
        function displayPvSession(index) {
            const pvData = pvHistory[index] || pvHistory[0];
            if (!pvData) return;

            const learnerName = pvData.fullName || (currentUser ? (currentUser.name || currentUser.email) : "Học viên");
            const dateStr = pvData.dateStr || (pvData.timestamp ? new Date(pvData.timestamp).toLocaleString("vi-VN") : "Gần đây");
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
                    syncMeValuesToWebhook(uniqueMapped);
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

                    const bridgeEl = document.getElementById("pv-interactive-bridge") || document.getElementById("values-grid");
                    if (bridgeEl) {
                        bridgeEl.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                };
            }

            // 4. Ma trận phân tích biến động 4 chiều
            if (pvHistory.length >= 2 && matrixEl) {
                matrixEl.classList.remove("hidden");
                const prevIndex = index < pvHistory.length - 1 ? index + 1 : pvHistory.length - 1;
                const prevData = pvHistory[prevIndex];
                calculateAndRenderMatrix(pvData, prevData);
            } else if (matrixEl) {
                matrixEl.classList.add("hidden");
            }
        }

        function calculateAndRenderMatrix(currData, prevData) {
            const extractNames = (list) => (list || []).map(x => typeof x === "string" ? x.trim() : (x.name ? x.name.trim() : ""));
            const currNames = extractNames(currData.top7);
            const prevNames = extractNames(prevData.top7);

            const currTop3 = currNames.slice(0, 3);
            const prevTop3 = prevNames.slice(0, 3);

            // 1. Mỏ neo cốt lõi: Nằm trong Top 3 của cả 2 lần (hoặc có độ ổn định cao)
            let anchors = currTop3.filter(name => prevTop3.includes(name));
            if (anchors.length === 0) {
                currNames.forEach((name, idx) => {
                    const prevIdx = prevNames.indexOf(name);
                    if (prevIdx !== -1 && Math.abs(idx - prevIdx) <= 1 && !anchors.includes(name)) {
                        anchors.push(name);
                    }
                });
            }

            // 2. Thăng hạng: Tăng ít nhất 2 bậc hoặc từ ngoài lọt vào Top 3
            const ascending = [];
            currNames.forEach((name, currIdx) => {
                const prevIdx = prevNames.indexOf(name);
                if (prevIdx !== -1) {
                    if (prevIdx - currIdx >= 2 || (prevIdx >= 3 && currIdx < 3)) {
                        ascending.push(`${name} (#${prevIdx + 1} ➔ #${currIdx + 1})`);
                    }
                }
            });

            // 3. Mới xuất hiện: Lần đầu lọt Top 7
            const emerging = currNames.filter(name => !prevNames.includes(name));

            // 4. Buông bỏ / Rời khỏi ưu tiên: Từng có trong lần trước nhưng lần này vắng mặt
            const departed = prevNames.filter(name => !currNames.includes(name));

            const elAnchors = document.getElementById("pv-dim-anchors");
            const elAscending = document.getElementById("pv-dim-ascending");
            const elEmerging = document.getElementById("pv-dim-emerging");
            const elDeparted = document.getElementById("pv-dim-departed");

            if (elAnchors) elAnchors.textContent = anchors.length > 0 ? anchors.join(", ") : "(Chưa có mỏ neo bất biến)";
            if (elAscending) elAscending.textContent = ascending.length > 0 ? ascending.join(", ") : "(Không có thay đổi thứ hạng đáng kể)";
            if (elEmerging) elEmerging.textContent = emerging.length > 0 ? emerging.join(", ") : "(Không có giá trị mới)";
            if (elDeparted) elDeparted.textContent = departed.length > 0 ? departed.join(", ") : "(Không có giá trị nào bị lùi lại)";

            if (btnFillIam) {
                btnFillIam.onclick = () => {
                    const anchorText = anchors.length > 0 ? anchors.join(", ") : currNames[0];
                    const ascText = ascending.length > 0 ? ascending[0] : (emerging[0] || currNames[1] || "mới");
                    const valI = `Qua các lần tự đánh giá, mỏ neo cốt lõi vững chắc nhất của tôi là: ${anchorText}. Giá trị ${ascText} đang dần trở thành ưu tiên hàng đầu.`;
                    const valA = `Tôi sẽ dùng giá trị [${anchorText}] làm kim chỉ nam để đưa ra lựa chọn hành động dứt khoát, nhất quán trong quyết định sắp tới.`;
                    const valM = departed.length > 0 
                        ? `Nhận diện những giá trị đã buông bỏ (${departed.join(", ")}) giúp tôi hiểu sâu sắc rằng việc buông bỏ bớt những kỳ vọng cũ là cần thiết để tập trung trọn vẹn cho những giá trị sống đích thực.`
                        : `Sống trọn vẹn và nhất quán với các giá trị cốt lõi này giúp tôi xây dựng phiên bản chân thật, tràn đầy năng lượng và tự do nội tại.`;

                    const elInputI = document.getElementById("iam-cp1-i");
                    const elInputA = document.getElementById("iam-cp1-a");
                    const elInputM = document.getElementById("iam-cp1-m");

                    if (!learnerProgress.stageData["stage-1"]) {
                        learnerProgress.stageData["stage-1"] = {};
                    }
                    if (!learnerProgress.stageData["stage-1"].iam_cp1) {
                        learnerProgress.stageData["stage-1"].iam_cp1 = {};
                    }
                    if (!learnerProgress.stageData["stage-1"].iam_1_2) {
                        learnerProgress.stageData["stage-1"].iam_1_2 = {};
                    }

                    if (elInputI) {
                        elInputI.value = valI;
                        learnerProgress.stageData["stage-1"].iam_cp1.I = valI;
                        learnerProgress.stageData["stage-1"].iam_1_2.I = valI;
                    }
                    if (elInputA) {
                        elInputA.value = valA;
                        learnerProgress.stageData["stage-1"].iam_cp1.A = valA;
                        learnerProgress.stageData["stage-1"].iam_1_2.A = valA;
                    }
                    if (elInputM) {
                        elInputM.value = valM;
                        learnerProgress.stageData["stage-1"].iam_cp1.M = valM;
                        learnerProgress.stageData["stage-1"].iam_1_2.M = valM;
                    }

                    saveLearnerProgress();
                    renderSyllabus();
                    updateStage1Milestones();

                    const oldText = btnFillIam.innerHTML;
                    btnFillIam.innerHTML = `<span>✓ Đã điền gợi ý vào Đúc Kết I • A • M!</span>`;
                    setTimeout(() => { btnFillIam.innerHTML = oldText; }, 2500);

                    // Mở Đúc Kết I • A • M 1.1 accordion nếu đang đóng
                    openAccordionModule("stage1-mod-cp1");

                    if (elInputI) {
                        elInputI.scrollIntoView({ behavior: "smooth", block: "center" });
                        elInputI.focus();
                    }
                };
            }
        }

        // 5. Cấu hình Dropdown chọn lần làm bài
        if (historyContainer && historySelect) {
            if (pvHistory.length > 1) {
                historyContainer.classList.remove("hidden");
                historySelect.innerHTML = "";
                pvHistory.forEach((item, idx) => {
                    const opt = document.createElement("option");
                    opt.value = idx;
                    const dateFormatted = item.timestamp ? new Date(item.timestamp).toLocaleString("vi-VN") : `Lần ${pvHistory.length - idx}`;
                    opt.textContent = `Lần ${pvHistory.length - idx} (${dateFormatted}) ${idx === 0 ? "— Mới nhất" : ""}`;
                    historySelect.appendChild(opt);
                });
                historySelect.value = 0;
                historySelect.onchange = (e) => {
                    const selIdx = parseInt(e.target.value, 10) || 0;
                    displayPvSession(selIdx);
                };
            } else {
                historyContainer.classList.add("hidden");
            }
        }

        // Render lần làm bài mới nhất (index 0)
        displayPvSession(0);

        // 6. Cập nhật URL liên kết La Bàn kèm email và source=lms
        updatePersonalValueLinks();

        // 7. Kích hoạt đồng bộ ngầm xuyên thiết bị (Cross-device Sync)
        if (currentUser && currentUser.email) {
            syncCrossDevicePVHistory(currentUser.email, pvHistory);
        }
    }

    function syncCrossDevicePVHistory(email, localHistory) {
        if (!email) return;
        const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
        const emailLower = email.toLowerCase().trim();
        const url = `${webhookUrl}?action=get_pv_history&email=${encodeURIComponent(emailLower)}`;
        
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res && res.success && Array.isArray(res.history) && res.history.length > 0) {
                    let hasNew = false;
                    const merged = [...localHistory];
                    res.history.forEach(remote => {
                        const exists = merged.some(local => {
                            if (local.timestamp && remote.timestamp) {
                                return Math.abs(new Date(local.timestamp).getTime() - new Date(remote.timestamp).getTime()) < 60000;
                            }
                            return false;
                        });
                        if (!exists && remote.top7 && remote.top7.length > 0) {
                            merged.push(remote);
                            hasNew = true;
                        }
                    });
                    if (hasNew) {
                        merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                        localStorage.setItem("dhm_pv_history_" + emailLower, JSON.stringify(merged));
                        if (currentStageIndex === 0) {
                            loadPersonalValuesTestResult();
                        }
                    }
                }
            })
            .catch(err => {
                console.log("Cross-device PV sync notice:", err);
            });
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

        // Quiz version migration: if learner has unpassed quiz with legacy question keys, reset answers
        if (sData.quiz_version !== "v2_20261023" && !sData.passed) {
            const validQuizIds = new Set(quizzes.map(q => q.id));
            const hasLegacyKeys = Object.keys(sData.quizAnswers || {}).some(k => !validQuizIds.has(k));
            if (hasLegacyKeys) {
                sData.quizAnswers = {};
                sData.quiz_version = "v2_20261023";
            }
        }
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

            let explanationHtml = "";
            if (userSelected !== undefined && q.explanation) {
                const isUserCorrect = (userSelected === q.correctIndex);
                explanationHtml = `
                    <div class="mt-2.5 p-3 rounded-lg ${isUserCorrect ? 'bg-brand-green/10 border border-brand-green/30 text-emerald-300' : 'bg-brand-card border border-brand-border text-slate-300'} text-xs leading-relaxed space-y-1">
                        <div class="font-bold flex items-center gap-1.5 ${isUserCorrect ? 'text-brand-green' : 'text-brand-amber'}">
                            <span>${isUserCorrect ? '✓ Giải thích chi tiết:' : '💡 Giải thích chi tiết:'}</span>
                        </div>
                        <p class="text-[11px] text-slate-300">${q.explanation}</p>
                    </div>
                `;
            }

            qBox.innerHTML = `
                <div class="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span class="text-brand-amber">Câu ${qIndex + 1}:</span> ${q.question}
                </div>
                <div class="space-y-2 mt-2">${optionsHtml}</div>
                ${explanationHtml}
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

                        // Nếu đã trả lời trọn vẹn số câu hỏi của bài quiz, tự động bắn telemetry kết quả về Google Sheet
                        const answeredCount = Object.keys(learnerProgress.stageData["stage-1"].quizAnswers || {}).length;
                        if (answeredCount >= quizzes.length) {
                            syncQuizResultToWebhook(currCorrect, quizzes.length, currPct, (currPct >= 80), learnerProgress.stageData["stage-1"].quizAttempts || 1, learnerProgress.stageData["stage-1"].quizAnswers);
                        }

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
                                <p class="text-xs text-slate-300 mt-0.5">Kết quả bài kiểm tra vượt chặng: <strong class="text-white">${correct}/${quizzes.length} câu đúng (${percent}%)</strong> — Đạt chuẩn ≥80% sau lần thử ${attempts}/${maxAttempts}, ${isStageUnlocked("stage-2a") ? ", đã mở khóa Chặng 2A (hoàn thành các bài IAM sẽ mở tiếp Chặng 3A)." : ", bạn cần là học viên chính thức để mở Chặng 2A."}</p>
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
                            learnerProgress.stageData["stage-1"].score = null;
                            learnerProgress.stageData["stage-1"].percentage = null;
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

        // 9.2 Render Me Values Interactive Bridge (Top 7 DNA & 1-Click Fill IAM)
        function renderMeValuesInteractiveBridge(sData) {
            const bridgeBadges = document.getElementById("pv-bridge-badges");
            const cp1BridgeBadges = document.getElementById("cp1-bridge-badges");
            const bridgeBadge = document.getElementById("pv-bridge-badge");
            const bridgeHint = document.getElementById("pv-bridge-hint");
            if (!bridgeBadges && !cp1BridgeBadges) return;

            let displayValues = [];
            if (Array.isArray(sData.selectedValues) && sData.selectedValues.length > 0) {
                displayValues = sData.selectedValues;
            } else {
                let emailKey = currentUser && currentUser.email ? currentUser.email.toLowerCase().trim() : "";
                let savedTest = null;
                if (emailKey) {
                    try {
                        const hist = JSON.parse(localStorage.getItem("dhm_pv_history_" + emailKey) || "[]");
                        if (hist.length > 0 && hist[0].top7) savedTest = hist[0];
                    } catch (e) {}
                    if (!savedTest) {
                        try {
                            const single = JSON.parse(localStorage.getItem("dhm_pv_" + emailKey) || "null");
                            if (single && single.top7) savedTest = single;
                        } catch (e) {}
                    }
                }
                if (savedTest && Array.isArray(savedTest.top7)) {
                    displayValues = savedTest.top7.map(item => typeof item === "string" ? item : (item.name || item));
                    sData.selectedValues = displayValues;
                }
            }

            function handleBadgeClick(val) {
                const iamInput = document.getElementById("iam-cp1-i");
                if (iamInput) {
                    iamInput.value = val;
                    sData.iam_cp1 = sData.iam_cp1 || {};
                    sData.iam_cp1.I = val;
                    sData.iam_1_2 = sData.iam_1_2 || {};
                    sData.iam_1_2.I = val;
                    debouncedSave();
                    renderSyllabus();
                    updateStage1Milestones();
                    evaluateLearnerStatus();
                    openAccordionModule("stage1-mod-cp1");
                    iamInput.focus();
                    iamInput.classList.add("ring-2", "ring-brand-amber");
                    setTimeout(() => iamInput.classList.remove("ring-2", "ring-brand-amber"), 1200);
                }
            }

            function createBadgeBtn(val, idx) {
                const badge = document.createElement("button");
                badge.type = "button";
                badge.className = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-amber/40 text-xs font-semibold text-white hover:border-brand-amber hover:bg-brand-amber/15 transition-all shadow-sm active:scale-95 group";
                badge.innerHTML = `
                    <span class="w-4 h-4 rounded-full bg-brand-amber text-black text-[10px] font-extrabold flex items-center justify-center shrink-0">${idx + 1}</span>
                    <span class="text-brand-amber group-hover:text-amber-300">${val}</span>
                    <span class="text-[10px] text-slate-400 group-hover:text-white ml-0.5 opacity-60 group-hover:opacity-100">↵ Chọn</span>
                `;
                badge.title = `Nhấp để điền giá trị "${val}" vào ô I (Interested) của Đúc Kết I • A • M`;
                badge.onclick = () => handleBadgeClick(val);
                return badge;
            }

            if (displayValues.length > 0) {
                if (bridgeBadges) {
                    bridgeBadges.innerHTML = "";
                    displayValues.forEach((val, idx) => {
                        bridgeBadges.appendChild(createBadgeBtn(val, idx));
                    });
                }
                if (cp1BridgeBadges) {
                    cp1BridgeBadges.innerHTML = "";
                    displayValues.forEach((val, idx) => {
                        cp1BridgeBadges.appendChild(createBadgeBtn(val, idx));
                    });
                }

                if (bridgeBadge) {
                    bridgeBadge.textContent = `${displayValues.length} Giá Trị (Top DNA)`;
                    bridgeBadge.className = "text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30";
                }
                if (bridgeHint) {
                    bridgeHint.classList.remove("hidden");
                }
            } else {
                if (bridgeBadges) {
                    bridgeBadges.innerHTML = `
                        <p class="text-[11px] text-slate-400 italic leading-relaxed">
                            Bạn chưa hoàn thành bài test La Bàn Giá Trị. Hãy <a href="../personal-value.html" target="_blank" rel="noopener noreferrer" class="text-brand-amber font-bold underline hover:text-amber-300">nhấn vào đây để làm bài test 1vs1 Duel ↗</a> hoặc tự nhập giá trị tâm đắc nhất của bạn vào ô I trong Check point 1.
                        </p>
                    `;
                }
                if (cp1BridgeBadges) {
                    cp1BridgeBadges.innerHTML = `
                        <p class="text-[11px] text-slate-400 italic leading-relaxed">
                            Chưa có kết quả La Bàn Giá Trị. Bạn có thể tự nhập giá trị tâm đắc vào ô I bên dưới hoặc làm bài test 1vs1 ở phần La Bàn Giá Trị Cá Nhân (Me Values).
                        </p>
                    `;
                }
                if (bridgeBadge) {
                    bridgeBadge.textContent = "Chưa làm bài test";
                    bridgeBadge.className = "text-[10px] px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber font-mono font-bold";
                }
                if (bridgeHint) {
                    bridgeHint.classList.add("hidden");
                }
            }
        }

        renderMeValuesInteractiveBridge(sData);
        if (valuesGrid) valuesGrid.innerHTML = "";
        if (valuesCountBadge) valuesCountBadge.textContent = `${(sData.selectedValues || []).length} Đã chọn`;
        loadPersonalValuesTestResult();

        // 9.3 IAM Multi-Set Inputs for Stage 1 (2 Checkpoints: CP1 & CP2)
        if (!sData.iam_cp1) {
            sData.iam_cp1 = sData.iam_1_2 || sData.iam_1_1 || {};
        }
        if (!sData.iam_cp2) {
            sData.iam_cp2 = sData.iam_1_3 || {};
        }

        // Initialize multi-set arrays and backward compatibility migration
        if (!Array.isArray(sData.iam_cp1_sets)) {
            sData.iam_cp1_sets = [];
        }
        if (sData.iam_cp1_sets.length === 0 && (sData.iam_cp1?.I || sData.iam_cp1?.A || sData.iam_cp1?.M)) {
            sData.iam_cp1_sets.push({
                id: "set_cp1_legacy_" + Date.now(),
                I: sData.iam_cp1.I || "",
                A: sData.iam_cp1.A || "",
                M: sData.iam_cp1.M || "",
                createdAt: new Date().toISOString()
            });
        }
        if (sData.iam_cp1_sets.length > 0) {
            sData.iam_cp1.I = sData.iam_cp1_sets[0].I;
            sData.iam_cp1.A = sData.iam_cp1_sets[0].A;
            sData.iam_cp1.M = sData.iam_cp1_sets[0].M;
            sData.iam_1_2 = sData.iam_1_2 || {};
            sData.iam_1_2.I = sData.iam_cp1_sets[0].I;
            sData.iam_1_2.A = sData.iam_cp1_sets[0].A;
            sData.iam_1_2.M = sData.iam_cp1_sets[0].M;
        }

        if (!Array.isArray(sData.iam_cp2_sets)) {
            sData.iam_cp2_sets = [];
        }
        if (sData.iam_cp2_sets.length === 0 && (sData.iam_cp2?.I || sData.iam_cp2?.A || sData.iam_cp2?.M)) {
            sData.iam_cp2_sets.push({
                id: "set_cp2_legacy_" + Date.now(),
                I: sData.iam_cp2.I || "",
                A: sData.iam_cp2.A || "",
                M: sData.iam_cp2.M || "",
                createdAt: new Date().toISOString()
            });
        }
        if (sData.iam_cp2_sets.length > 0) {
            sData.iam_cp2.I = sData.iam_cp2_sets[0].I;
            sData.iam_cp2.A = sData.iam_cp2_sets[0].A;
            sData.iam_cp2.M = sData.iam_cp2_sets[0].M;
            sData.iam_1_3 = sData.iam_1_3 || {};
            sData.iam_1_3.I = sData.iam_cp2_sets[0].I;
            sData.iam_1_3.A = sData.iam_cp2_sets[0].A;
            sData.iam_1_3.M = sData.iam_cp2_sets[0].M;
        }

        // Render Multi-Set Cards List
        renderIamSetsCardList("iam-cp1-saved-sets-list", "iam-cp1-set-counter", sData.iam_cp1_sets, "cp1");
        updateDrawerIamHistory();

        // Setup save & clear buttons
        const btnCp1Save = document.getElementById("btn-iam-cp1-save-set");
        if (btnCp1Save) btnCp1Save.onclick = () => handleSaveIamSet("cp1");
        const btnCp1Clear = document.getElementById("btn-iam-cp1-clear");
        if (btnCp1Clear) btnCp1Clear.onclick = () => handleClearIamInputs("cp1");

        // Input bindings for draft typing
        bindInput("iam-cp1-i", val => { 
            sData.iam_cp1 = sData.iam_cp1 || {}; 
            if (sData.iam_cp1_sets.length === 0) {
                sData.iam_cp1.I = val; 
                sData.iam_1_2 = sData.iam_1_2 || {};
                sData.iam_1_2.I = val;
                debouncedSave(); 
                renderSyllabus(); 
                updateStage1Milestones(); 
            }
        }, sData.iam_cp1_sets.length === 0 ? sData.iam_cp1?.I : "");

        bindInput("iam-cp1-a", val => { 
            sData.iam_cp1 = sData.iam_cp1 || {}; 
            if (sData.iam_cp1_sets.length === 0) {
                sData.iam_cp1.A = val; 
                sData.iam_1_2 = sData.iam_1_2 || {};
                sData.iam_1_2.A = val;
                debouncedSave(); 
                renderSyllabus(); 
                updateStage1Milestones(); 
            }
        }, sData.iam_cp1_sets.length === 0 ? sData.iam_cp1?.A : "");

        bindInput("iam-cp1-m", val => { 
            sData.iam_cp1 = sData.iam_cp1 || {}; 
            if (sData.iam_cp1_sets.length === 0) {
                sData.iam_cp1.M = val; 
                sData.iam_1_2 = sData.iam_1_2 || {};
                sData.iam_1_2.M = val;
                debouncedSave(); 
                renderSyllabus(); 
                updateStage1Milestones(); 
            }
        }, sData.iam_cp1_sets.length === 0 ? sData.iam_cp1?.M : "");

        evaluateLearnerStatus();
    }

    // 10. STAGE 2A & 2B RENDERERS
    function renderStage2AView(stage) {
        const sData = (learnerProgress && learnerProgress.stageData && (learnerProgress.stageData["stage-2a"] || learnerProgress.stageData["stage-2"])) || { habits: {} };
        learnerProgress.stageData = learnerProgress.stageData || {};
        learnerProgress.stageData["stage-2a"] = sData;
        const habits = sData.habits || {};

        // 10.1 Setup Habit Pill Switching for 2A
        const habitTabs = document.querySelectorAll("#stage2a-practice-container .habit-tab, #habit-nav-tabs-2a .habit-tab");
        const habitPanels2A = document.querySelectorAll("#stage2a-practice-container .habit-panel");
        habitTabs.forEach(tab => {
            tab.onclick = () => {
                habitTabs.forEach(t => {
                    t.classList.remove("active", "text-black", "font-bold");
                    t.classList.add("text-slate-400");
                });
                tab.classList.add("active", "text-black", "font-bold");
                tab.classList.remove("text-slate-400");

                const targetHabit = tab.getAttribute("data-habit");
                habitPanels2A.forEach(p => {
                    if (p.id === `habit-panel-${targetHabit}`) p.classList.remove("hidden");
                    else p.classList.add("hidden");
                });
            };
        });

        // 10.1b Habit 0: 3 Drivers (Deci & Ryan)
        const hD = habits.drivers || { iam: {} };
        const s1DataFallback = learnerProgress.stageData && learnerProgress.stageData["stage-1"];
        if (!hD.iam) hD.iam = {};
        if (!sData.iam) sData.iam = {};
        if (!hD.iam.I && s1DataFallback) {
            const fbI = s1DataFallback.iam_cp2?.I || (s1DataFallback.iam_cp2_sets && s1DataFallback.iam_cp2_sets[0]?.I) || s1DataFallback.iam_1_3?.I || "";
            const fbA = s1DataFallback.iam_cp2?.A || (s1DataFallback.iam_cp2_sets && s1DataFallback.iam_cp2_sets[0]?.A) || s1DataFallback.iam_1_3?.A || "";
            const fbM = s1DataFallback.iam_cp2?.M || (s1DataFallback.iam_cp2_sets && s1DataFallback.iam_cp2_sets[0]?.M) || s1DataFallback.iam_1_3?.M || "";
            hD.iam.I = fbI;
            hD.iam.A = fbA;
            hD.iam.M = fbM;
        }
        if (!sData.iam.I && hD.iam.I) {
            sData.iam.I = hD.iam.I;
            sData.iam.A = hD.iam.A;
            sData.iam.M = hD.iam.M;
        }
        bindInput("iam-drivers-i", v => { 
            hD.iam.I = v; 
            habits.drivers = hD; 
            sData.iam = sData.iam || {};
            sData.iam.I = v;
            if (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) {
                learnerProgress.stageData["stage-1"].iam_cp2 = learnerProgress.stageData["stage-1"].iam_cp2 || {};
                learnerProgress.stageData["stage-1"].iam_cp2.I = v;
                learnerProgress.stageData["stage-1"].iam_1_3 = learnerProgress.stageData["stage-1"].iam_1_3 || {};
                learnerProgress.stageData["stage-1"].iam_1_3.I = v;
            }
            syncLegacyStageData(learnerProgress);
            debouncedSave(); 
            renderSyllabus(); 
        }, hD.iam.I);

        bindInput("iam-drivers-a", v => { 
            hD.iam.A = v; 
            habits.drivers = hD; 
            sData.iam = sData.iam || {};
            sData.iam.A = v;
            if (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) {
                learnerProgress.stageData["stage-1"].iam_cp2 = learnerProgress.stageData["stage-1"].iam_cp2 || {};
                learnerProgress.stageData["stage-1"].iam_cp2.A = v;
                learnerProgress.stageData["stage-1"].iam_1_3 = learnerProgress.stageData["stage-1"].iam_1_3 || {};
                learnerProgress.stageData["stage-1"].iam_1_3.A = v;
            }
            syncLegacyStageData(learnerProgress);
            debouncedSave(); 
            renderSyllabus(); 
        }, hD.iam.A);

        bindInput("iam-drivers-m", v => { 
            hD.iam.M = v; 
            habits.drivers = hD; 
            sData.iam = sData.iam || {};
            sData.iam.M = v;
            if (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) {
                learnerProgress.stageData["stage-1"].iam_cp2 = learnerProgress.stageData["stage-1"].iam_cp2 || {};
                learnerProgress.stageData["stage-1"].iam_cp2.M = v;
                learnerProgress.stageData["stage-1"].iam_1_3 = learnerProgress.stageData["stage-1"].iam_1_3 || {};
                learnerProgress.stageData["stage-1"].iam_1_3.M = v;
            }
            syncLegacyStageData(learnerProgress);
            debouncedSave(); 
            renderSyllabus(); 
        }, hD.iam.M);

        // 10.2 Habit 1: Gratitude Inputs
        const hG = habits.gratitude || { items: [], card: {}, iam: {} };
        hG.iam = hG.iam || {};
        bindInput("gratitude-1", v => { hG.items[0] = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.items[0]);
        bindInput("gratitude-2", v => { hG.items[1] = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.items[1]);
        bindInput("gratitude-3", v => { hG.items[2] = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.items[2]);
        bindInput("gratitude-4", v => { hG.items[3] = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.items[3]);
        bindInput("gratitude-card-to", v => { hG.card.to = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.card.to);
        bindInput("gratitude-card-msg", v => { hG.card.msg = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.card.msg);
        hG.scenario = hG.scenario || {};
        bindInput("scenario-habit-gratitude-reflection", v => { hG.scenario.reflection = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.scenario.reflection);
        bindInput("scenario-habit-gratitude-action", v => { hG.scenario.action = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); }, hG.scenario.action);
        bindInput("iam-gratitude-i", v => { hG.iam.I = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hG.iam.I);
        bindInput("iam-gratitude-a", v => { hG.iam.A = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hG.iam.A);
        bindInput("iam-gratitude-m", v => { hG.iam.M = v; habits.gratitude = hG; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hG.iam.M);

        // 10.3 Habit 2: Mindfulness Inputs
        const hM = habits.mindfulness || { sbaChecks: {}, iam: {} };
        hM.iam = hM.iam || {};
        const chkS = document.getElementById("sba-check-s");
        const chkB = document.getElementById("sba-check-b");
        const chkA = document.getElementById("sba-check-a");
        if (chkS) {
            chkS.checked = !!hM.sbaChecks.s;
            chkS.onchange = () => { hM.sbaChecks.s = chkS.checked; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); };
        }
        if (chkB) {
            chkB.checked = !!hM.sbaChecks.b;
            chkB.onchange = () => { hM.sbaChecks.b = chkB.checked; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); };
        }
        if (chkA) {
            chkA.checked = !!hM.sbaChecks.a;
            chkA.onchange = () => { hM.sbaChecks.a = chkA.checked; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); };
        }
        bindInput("sba-situation", v => { hM.situation = v; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); }, hM.situation);
        hM.scenario = hM.scenario || {};
        bindInput("scenario-habit-mindfulness-reflection", v => { hM.scenario.reflection = v; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); }, hM.scenario.reflection);
        bindInput("scenario-habit-mindfulness-action", v => { hM.scenario.action = v; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); }, hM.scenario.action);
        bindInput("iam-mindfulness-i", v => { hM.iam.I = v; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hM.iam.I);
        bindInput("iam-mindfulness-a", v => { hM.iam.A = v; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hM.iam.A);
        bindInput("iam-mindfulness-m", v => { hM.iam.M = v; habits.mindfulness = hM; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hM.iam.M);

        // 10.4 Habit 3: Altruism
        const hA = habits.altruism || { iam: {} };
        hA.iam = hA.iam || {};
        document.querySelectorAll('input[name="altruism-style"]').forEach(r => {
            if (r.value === hA.style) r.checked = true;
            r.onchange = () => { hA.style = r.value; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); };
        });
        bindInput("altruism-act", v => { hA.act = v; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); }, hA.act);
        hA.scenario = hA.scenario || {};
        bindInput("scenario-habit-altruism-reflection", v => { hA.scenario.reflection = v; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); }, hA.scenario.reflection);
        bindInput("scenario-habit-altruism-action", v => { hA.scenario.action = v; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); }, hA.scenario.action);
        bindInput("iam-altruism-i", v => { hA.iam.I = v; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hA.iam.I);
        bindInput("iam-altruism-a", v => { hA.iam.A = v; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hA.iam.A);
        bindInput("iam-altruism-m", v => { hA.iam.M = v; habits.altruism = hA; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hA.iam.M);

        // 10.5 Capstone 2A IAM
        const cap = sData.capstoneIam || {};
        sData.capstoneIam = cap;
        bindInput("iam-capstone-i", v => { cap.I = v; sData.capstoneIam = cap; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, cap.I);
        bindInput("iam-capstone-a", v => { cap.A = v; sData.capstoneIam = cap; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, cap.A);
        bindInput("iam-capstone-m", v => { cap.M = v; sData.capstoneIam = cap; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, cap.M);

        const btnSyncWorkshop = document.getElementById("btn-sync-workshop");
        if (btnSyncWorkshop) {
            btnSyncWorkshop.onclick = () => {
                syncLegacyStageData(learnerProgress);
                saveLearnerProgress();
                alert("✓ Toàn bộ bài tập 3 Thói quen Nền Tảng & Capstone 2A đã được lưu an toàn tại trình duyệt và đồng bộ lên Google Sheets!");
            };
        }
    }
    window.renderStage2AView = renderStage2AView;

    function renderStage2BView(stage) {
        const s2bData = (learnerProgress && learnerProgress.stageData && (learnerProgress.stageData["stage-2b"] || learnerProgress.stageData["stage-2"])) || { habits: {} };
        learnerProgress.stageData = learnerProgress.stageData || {};
        learnerProgress.stageData["stage-2b"] = s2bData;
        const habits = s2bData.habits || {};

        // 10.1 Setup Habit Pill Switching for 2B
        const habitTabs = document.querySelectorAll("#stage2b-practice-container .habit-tab, #habit-nav-tabs-2b .habit-tab");
        const habitPanels2B = document.querySelectorAll("#stage2b-practice-container .habit-panel");
        habitTabs.forEach(tab => {
            tab.onclick = () => {
                habitTabs.forEach(t => {
                    t.classList.remove("active", "text-black", "font-bold");
                    t.classList.add("text-slate-400");
                });
                tab.classList.add("active", "text-black", "font-bold");
                tab.classList.remove("text-slate-400");

                const targetHabit = tab.getAttribute("data-habit");
                habitPanels2B.forEach(p => {
                    if (p.id === `habit-panel-${targetHabit}`) p.classList.remove("hidden");
                    else p.classList.add("hidden");
                });
            };
        });

        // Habit 1 (2B): Flow
        const hF = habits.flow || { iam: {} };
        bindInput("flow-boring-task", v => { hF.boringTask = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); }, hF.boringTask);
        bindInput("flow-redesign", v => { hF.redesign = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); }, hF.redesign);
        hF.scenario = hF.scenario || {};
        bindInput("scenario-habit-flow-reflection", v => { hF.scenario.reflection = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); }, hF.scenario.reflection);
        bindInput("scenario-habit-flow-action", v => { hF.scenario.action = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); }, hF.scenario.action);
        bindInput("iam-flow-i", v => { hF.iam.I = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hF.iam.I);
        bindInput("iam-flow-a", v => { hF.iam.A = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hF.iam.A);
        bindInput("iam-flow-m", v => { hF.iam.M = v; habits.flow = hF; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hF.iam.M);

        // Habit 2 (2B): Optimism ABCDE
        const hO = habits.optimism || { abcde: {}, iam: {} };
        bindInput("abcde-a", v => { hO.abcde.A = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); }, hO.abcde.A);
        bindInput("abcde-b", v => { hO.abcde.B = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); }, hO.abcde.B);
        bindInput("abcde-c", v => { hO.abcde.C = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); }, hO.abcde.C);
        bindInput("abcde-d", v => { hO.abcde.D = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); syncAbcdeBackToLocalStorage(hO.abcde); }, hO.abcde.D);
        bindInput("abcde-e", v => { hO.abcde.E = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); syncAbcdeBackToLocalStorage(hO.abcde); }, hO.abcde.E);
        hO.scenario = hO.scenario || {};
        bindInput("scenario-habit-optimism-reflection", v => { hO.scenario.reflection = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); }, hO.scenario.reflection);
        bindInput("scenario-habit-optimism-action", v => { hO.scenario.action = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); }, hO.scenario.action);
        bindInput("iam-optimism-i", v => { hO.iam.I = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hO.iam.I);
        bindInput("iam-optimism-a", v => { hO.iam.A = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hO.iam.A);
        bindInput("iam-optimism-m", v => { hO.iam.M = v; habits.optimism = hO; syncLegacyStageData(learnerProgress); debouncedSave(); renderSyllabus(); }, hO.iam.M);

        loadAbcdeLandingSync();

        // Capstone 2B IAM
        const cap2b = s2bData.capstoneIam || {};
        bindInput("iam-capstone-2b-i", v => { cap2b.I = v; s2bData.capstoneIam = cap2b; syncLegacyStageData(learnerProgress); debouncedSave(); }, cap2b.I);
        bindInput("iam-capstone-2b-a", v => { cap2b.A = v; s2bData.capstoneIam = cap2b; syncLegacyStageData(learnerProgress); debouncedSave(); }, cap2b.A);
        bindInput("iam-capstone-2b-m", v => { cap2b.M = v; s2bData.capstoneIam = cap2b; syncLegacyStageData(learnerProgress); debouncedSave(); }, cap2b.M);

        const btnSync2B = document.getElementById("btn-sync-workshop-2b");
        if (btnSync2B) {
            btnSync2B.onclick = () => {
                syncLegacyStageData(learnerProgress);
                saveLearnerProgress();
                alert("✓ Toàn bộ bài tập 2 Thói quen Bứt Phá & Capstone 2B đã được lưu an toàn tại trình duyệt và đồng bộ lên Google Sheets!");
            };
        }
    }
    window.renderStage2BView = renderStage2BView;

    function renderStage2View(stage) {
        if (stage && stage.id === "stage-2b") {
            renderStage2BView(stage);
        } else {
            renderStage2AView(stage);
        }
    }
    window.renderStage2View = renderStage2View;

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
            desc: "Duy trì xuất sắc chuỗi thói quen! Chúc mừng Đại Sứ Hạnh Phúc."
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
            if (elNextLabel) elNextLabel.textContent = `🎉 Hoàn Thành Xuất Sắc Chuỗi Thói Quen!`;
            if (elProgressText) elProgressText.textContent = `21/21 ngày (100%)`;
            if (elProgressBar) elProgressBar.style.width = `100%`;
            if (elCountdownText) {
                elCountdownText.innerHTML = `🏆 <strong class="text-emerald-400">Trọn vẹn hành trình chuyển hóa! Bạn là Đại Sứ Hạnh Phúc!</strong>`;
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

    function renderStage3BView(stage) {
        const s3b = (learnerProgress && learnerProgress.stageData && (learnerProgress.stageData["stage-3b"] || learnerProgress.stageData["stage-3"])) || { weeklyCheckins: {} };

        // 1. ABCDE Workout
        s3b.dailyAbcde = s3b.dailyAbcde || { scenarioId: "", A: "", B: "", C: "", D: "", E: "" };
        const dAbcde = s3b.dailyAbcde;

        const s3Select = document.getElementById("stage3-abcde-scenario-select");
        const s3ElA = document.getElementById("stage3-abcde-a");
        const s3ElB = document.getElementById("stage3-abcde-b");
        const s3ElC = document.getElementById("stage3-abcde-c");
        const s3ElD = document.getElementById("stage3-abcde-d");
        const s3ElE = document.getElementById("stage3-abcde-e");
        const s3SaveStatus = document.getElementById("stage3-abcde-save-status");
        const s3BtnSave = document.getElementById("btn-save-stage3-abcde");

        const allScenarios = stage.abcdeScenarios || [];
        if (s3Select && allScenarios.length > 0) {
            s3Select.innerHTML = `<option value="">-- Chọn một tình huống để phân tích mẫu --</option>`;
            allScenarios.forEach(sc => {
                const opt = document.createElement("option");
                opt.value = sc.id;
                opt.textContent = sc.name || sc.title;
                if (sc.id === dAbcde.scenarioId) opt.selected = true;
                s3Select.appendChild(opt);
            });
            s3Select.onchange = () => {
                const selId = s3Select.value;
                dAbcde.scenarioId = selId;
                const found = allScenarios.find(x => x.id === selId);
                if (found) {
                    dAbcde.A = found.A || "";
                    dAbcde.B = found.B || "";
                    dAbcde.C = found.C || "";
                    dAbcde.D = found.hintD || "";
                    dAbcde.E = found.hintE || "";
                    if (s3ElA) s3ElA.value = dAbcde.A;
                    if (s3ElB) s3ElB.value = dAbcde.B;
                    if (s3ElC) s3ElC.value = dAbcde.C;
                    if (s3ElD) s3ElD.value = dAbcde.D;
                    if (s3ElE) s3ElE.value = dAbcde.E;
                }
                syncLegacyStageData(learnerProgress);
                saveLearnerProgress();
            };
        }

        bindInput("stage3-abcde-a", v => { dAbcde.A = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, dAbcde.A);
        bindInput("stage3-abcde-b", v => { dAbcde.B = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, dAbcde.B);
        bindInput("stage3-abcde-c", v => { dAbcde.C = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, dAbcde.C);
        bindInput("stage3-abcde-d", v => { dAbcde.D = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, dAbcde.D);
        bindInput("stage3-abcde-e", v => { dAbcde.E = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, dAbcde.E);

        if (s3BtnSave) {
            s3BtnSave.onclick = () => {
                syncLegacyStageData(learnerProgress);
                saveLearnerProgress();
                if (s3SaveStatus) {
                    s3SaveStatus.classList.remove("hidden");
                    setTimeout(() => s3SaveStatus.classList.add("hidden"), 3000);
                }
                alert("✓ Bài tập ABCDE Chuyên Sâu Chặng 3B đã được lưu an toàn!");
            };
        }

        // 2. Weekly Checkin 3B
        s3b.weeklyCheckins = s3b.weeklyCheckins || { w1: "", w2: "" };
        bindInput("weekly-checkin-3b-1", v => { s3b.weeklyCheckins.w1 = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, s3b.weeklyCheckins.w1);
        bindInput("weekly-checkin-3b-2", v => { s3b.weeklyCheckins.w2 = v; syncLegacyStageData(learnerProgress); debouncedSave(); }, s3b.weeklyCheckins.w2);

        const btnSaveWeekly3B = document.getElementById("btn-save-weekly-3b");
        if (btnSaveWeekly3B) {
            btnSaveWeekly3B.onclick = () => {
                syncLegacyStageData(learnerProgress);
                saveLearnerProgress();
                alert("✓ Đúc kết tuần Chặng 3B đã được lưu an toàn!");
            };
        }
    }
    window.renderStage3BView = renderStage3BView;

    function renderStage3AView(stage) {
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
                name: "Khi đồng đội gặp trở ngại về hiệu suất (Công sở)",
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
            { week: 3, label: "🏆 Tuần 3: Chuyển Hóa", desc: "Khắc sâu phong cách sống & lan tỏa hạnh phúc", startDay: 15, endDay: 21 }
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

        // 11.4.1 Habit Tracker CRM Sync Button & Status Badge
        const btnSyncHabitCRM = document.getElementById("btn-sync-habit-crm");
        if (btnSyncHabitCRM) {
            btnSyncHabitCRM.onclick = () => syncHabitTrackerToCRM();
        }
        const habitSyncStatusEl = document.getElementById("habit-sync-status");
        if (habitSyncStatusEl) {
            habitSyncStatusEl.textContent = "";
        }

        // 11.4.2 Open Full Roadmap / Habit Guide Doc Modal
        const btnOpenHabitFullDoc = document.getElementById("btn-open-habit-full-doc");
        if (btnOpenHabitFullDoc) {
            btnOpenHabitFullDoc.onclick = () => openRoadmapDoc();
        }

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

        // 11.8 Render Bonus Scenarios, Podcasts, and Rewards Hub
        renderStage3Scenarios(stage, s3);
        renderStage3Podcasts(stage, s3);
        renderStage3Rewards(stage, s3);
    }

    // 11.9 Stage 3 Bonus Gamification Points Calculator
    function calculateStage3BonusPoints(s3) {
        let total = 0;
        const details = {
            habits: 0,
            scenarios: 0,
            podcasts: 0,
            weekly: 0,
            linkedin: 0
        };

        // 1. Habit Tracker points: 5 pts per habit check + 10 bonus if >= 3 in a day
        const trackerState = s3.habitTracker || {};
        const habitKeys = ["mindfulness", "gratitude", "optimism", "flow", "altruism"];
        Object.keys(trackerState).forEach(dayKey => {
            const dayData = trackerState[dayKey] || {};
            const checked = habitKeys.filter(k => !!dayData[k]).length;
            details.habits += checked * 5;
            if (checked >= 3) {
                details.habits += 10;
            }
        });

        // 2. Bonus Scenarios: +50 pts per completed scenario
        const completedScenarios = s3.completedScenarios || {};
        const scCount = Object.keys(completedScenarios).filter(k => !!completedScenarios[k]).length;
        details.scenarios = scCount * 50;

        // 3. Podcasts: +30 pts per confirmed podcast
        const listenedPodcasts = s3.listenedPodcasts || {};
        const podCount = Object.keys(listenedPodcasts).filter(k => !!listenedPodcasts[k]).length;
        details.podcasts = podCount * 30;

        // 4. Weekly Check-ins: +100 pts per completed week checkin (min 10 chars)
        const wChecks = s3.weeklyCheckins || {};
        ['w1', 'w2', 'w3'].forEach(wk => {
            if (wChecks[wk] && wChecks[wk].trim().length >= 10) {
                details.weekly += 100;
            }
        });

        // 5. LinkedIn Story: +150 pts if verified
        if (s3.linkedinUrl && s3.linkedinUrl.includes("linkedin.com")) {
            details.linkedin = 150;
        }

        total = details.habits + details.scenarios + details.podcasts + details.weekly + details.linkedin;
        return { total, details };
    }

    // 11.10 Render Stage 3 Bonus Scenarios
    function renderStage3Scenarios(stage, s3) {
        const scenariosListContainer = document.getElementById("stage3-bonus-scenarios-list");
        const scenariosBadge = document.getElementById("bonus-scenarios-badge");
        if (!scenariosListContainer) return;

        const scenarios = stage.bonusScenarios || [];
        s3.completedScenarios = s3.completedScenarios || {};
        s3.scenarioNotes = s3.scenarioNotes || {};

        const completedCount = scenarios.filter(sc => !!s3.completedScenarios[sc.id]).length;
        if (scenariosBadge) {
            scenariosBadge.textContent = `${completedCount}/${scenarios.length} Đã giải (+${completedCount * 50}đ)`;
        }

        scenariosListContainer.innerHTML = "";
        if (scenarios.length === 0) {
            scenariosListContainer.innerHTML = `<p class="text-xs text-slate-500 italic">Không có tình huống bonus ở chặng này.</p>`;
            return;
        }

        scenarios.forEach((sc, idx) => {
            const isCompleted = !!s3.completedScenarios[sc.id];
            const savedNote = s3.scenarioNotes[sc.id] || "";
            const card = document.createElement("div");
            card.className = `p-4 sm:p-5 rounded-xl border transition-all ${
                isCompleted
                    ? "bg-brand-dark/90 border-brand-green/50 shadow-sm shadow-green-500/10"
                    : "bg-brand-dark/70 border-brand-border hover:border-brand-amber/40"
            } space-y-4`;

            card.innerHTML = `
                <div class="flex items-start justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2.5">
                        <span class="w-7 h-7 rounded-lg ${
                            isCompleted ? "bg-brand-green text-black" : "bg-brand-amber/20 text-brand-amber border border-brand-amber/30"
                        } flex items-center justify-center font-bold text-xs">
                            ${isCompleted ? "✓" : (idx + 1)}
                        </span>
                        <div>
                            <h5 class="text-xs sm:text-sm font-bold text-white">${sc.title}</h5>
                            <span class="text-[10px] text-slate-400">Bonus Challenge · Phần thưởng +50 điểm</span>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full ${
                        isCompleted ? "bg-brand-green/20 text-brand-green border border-brand-green/40" : "bg-brand-amber/15 text-brand-amber border border-brand-amber/30"
                    } text-[11px] font-mono font-bold">
                        ${isCompleted ? "Đã nhận +50đ ✓" : "+50 Điểm Thưởng"}
                    </span>
                </div>

                <!-- Bối cảnh tình huống -->
                <div class="p-3.5 rounded-lg bg-brand-surface/70 border border-brand-border/60 text-xs text-slate-300 leading-relaxed">
                    <span class="font-bold text-brand-amber">📌 Bối cảnh:</span> ${sc.context}
                </div>

                <!-- Nút xem phân tích và gợi ý -->
                <div>
                    <button type="button" class="btn-toggle-sc-hint w-full py-2 px-3 rounded-lg bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-amber text-xs font-bold border border-brand-amber/30 transition-all flex items-center justify-between gap-2" data-sc-id="${sc.id}">
                        <span class="flex items-center gap-1.5">
                            <span>💡 Xem Phân Tích Chuyên Gia & Gợi Ý Lời Giải Mẫu</span>
                        </span>
                        <span class="sc-hint-chevron text-xs">▼</span>
                    </button>
                    <div id="sc-hint-${sc.id}" class="hidden mt-2 p-3.5 rounded-lg bg-brand-surface border border-brand-amber/40 space-y-2 text-xs text-slate-300">
                        <div>
                            <div class="font-bold text-brand-amber mb-0.5">🔍 Phân tích nguyên lý chuyên sâu:</div>
                            <p class="leading-relaxed text-slate-300">${sc.facultyAnalysis || ""}</p>
                        </div>
                        <div class="pt-1.5 border-t border-brand-border/50">
                            <div class="font-bold text-brand-green mb-0.5">🎯 Gợi ý bài mẫu của Ban Giảng Huấn:</div>
                            <p class="leading-relaxed text-slate-200 whitespace-pre-line">${sc.modelAnswer || ""}</p>
                        </div>
                    </div>
                </div>

                <!-- Ô nhập suy ngẫm của học viên -->
                <div class="space-y-1.5">
                    <label class="block text-xs font-semibold text-slate-200">
                        ${sc.reflectionPrompt || "Góc nhìn & Bài học đúc kết của bạn:"}
                    </label>
                    <textarea class="sc-note-input w-full bg-brand-dark border border-brand-border rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-amber" rows="2" placeholder="Ghi lại giải pháp hoặc đúc kết hành động của bạn tại đây..." data-sc-id="${sc.id}">${savedNote}</textarea>
                </div>

                <!-- Nút bấm hoàn thành -->
                <div class="flex items-center justify-between flex-wrap gap-2 pt-1">
                    <span class="sc-save-msg text-[11px] text-brand-green hidden font-semibold">✓ Đã lưu đúc kết!</span>
                    <button type="button" class="btn-complete-sc px-4 py-2 rounded-xl ${
                        isCompleted
                            ? "bg-brand-surface hover:bg-brand-card text-brand-green border border-brand-green/40"
                            : "bg-gradient-to-r from-brand-orange to-brand-amber hover:brightness-110 text-black font-extrabold shadow-md"
                    } text-xs transition-all flex items-center gap-1.5 ml-auto active:scale-95" data-sc-id="${sc.id}">
                        <span>${isCompleted ? "✓ Đã Hoàn Thành (+50đ)" : "✓ Hoàn Thành & Nhận +50 Điểm"}</span>
                    </button>
                </div>
            `;

            // Bind events for hint toggle
            const hintBtn = card.querySelector(".btn-toggle-sc-hint");
            const hintBox = card.querySelector(`#sc-hint-${sc.id}`);
            const hintChevron = card.querySelector(".sc-hint-chevron");
            if (hintBtn && hintBox) {
                hintBtn.onclick = () => {
                    const isHidden = hintBox.classList.contains("hidden");
                    if (isHidden) {
                        hintBox.classList.remove("hidden");
                        hintChevron.textContent = "▲";
                    } else {
                        hintBox.classList.add("hidden");
                        hintChevron.textContent = "▼";
                    }
                };
            }

            // Bind input for note
            const noteInput = card.querySelector(".sc-note-input");
            if (noteInput) {
                noteInput.oninput = () => {
                    s3.scenarioNotes[sc.id] = noteInput.value;
                    debouncedSave();
                };
            }

            // Bind complete button
            const completeBtn = card.querySelector(".btn-complete-sc");
            if (completeBtn) {
                completeBtn.onclick = () => {
                    s3.completedScenarios[sc.id] = !s3.completedScenarios[sc.id];
                    saveLearnerProgress();
                    renderStage3Scenarios(stage, s3);
                    renderStage3Rewards(stage, s3);
                };
            }

            scenariosListContainer.appendChild(card);
        });
    }

    // 11.11 Render Stage 3 Podcasts & Deep Insights
    function renderStage3Podcasts(stage, s3) {
        const podBadge = document.getElementById("podcasts-listened-badge");
        const podSelect = document.getElementById("stage3-podcast-select");
        const podTitle = document.getElementById("stage3-podcast-title");
        const podSubtitle = document.getElementById("stage3-podcast-subtitle");
        const podPlayer = document.getElementById("stage3-podcast-player");
        const podSource = document.getElementById("stage3-podcast-source");
        const btnConfirm = document.getElementById("btn-confirm-podcast-listen");
        const deepInsightsContainer = document.getElementById("stage3-deep-insights-container");

        const podcasts = stage.inspirationPodcasts || [];
        s3.listenedPodcasts = s3.listenedPodcasts || {};

        const listenedCount = podcasts.filter(p => !!s3.listenedPodcasts[p.id]).length;
        if (podBadge) {
            podBadge.textContent = `${listenedCount}/${podcasts.length} Đã nghe (+${listenedCount * 30}đ)`;
        }

        if (podSelect && podcasts.length > 0) {
            podSelect.innerHTML = "";
            podcasts.forEach((p, idx) => {
                const opt = document.createElement("option");
                opt.value = p.id;
                const isListened = !!s3.listenedPodcasts[p.id];
                opt.textContent = `${isListened ? "✓ " : ""}${p.title} (${p.duration})`;
                podSelect.appendChild(opt);
            });

            const updateActivePodcast = (trackId) => {
                const trk = podcasts.find(p => p.id === trackId) || podcasts[0];
                if (!trk) return;
                if (podTitle) podTitle.textContent = trk.title;
                if (podSubtitle) podSubtitle.textContent = `Thời lượng: ${trk.duration} · Nhận +30 điểm khi nghe xong`;
                if (podSource && podPlayer) {
                    podSource.src = trk.file;
                    podPlayer.load();
                }
                if (btnConfirm) {
                    const isDone = !!s3.listenedPodcasts[trk.id];
                    btnConfirm.innerHTML = isDone
                        ? `<span>✓ Đã Nhận 30 Điểm (Bấm để hủy)</span>`
                        : `<span>✓ Xác Nhận Đã Nghe (+30đ)</span>`;
                    btnConfirm.className = `w-full sm:w-auto px-4 py-2 rounded-xl ${
                        isDone ? "bg-brand-green/20 text-brand-green border-brand-green/40" : "bg-brand-amber/20 text-brand-amber border-brand-amber/40"
                    } hover:brightness-110 text-xs font-bold border transition-all flex items-center justify-center gap-1.5 shrink-0`;
                    btnConfirm.onclick = () => {
                        s3.listenedPodcasts[trk.id] = !s3.listenedPodcasts[trk.id];
                        saveLearnerProgress();
                        renderStage3Podcasts(stage, s3);
                        renderStage3Rewards(stage, s3);
                    };
                }
            };

            podSelect.onchange = () => {
                updateActivePodcast(podSelect.value);
            };

            // Initialize with first track or saved selection
            if (podSelect.value) {
                updateActivePodcast(podSelect.value);
            }
        }

        // Render Deep Insights NotebookLM inside accordion
        if (deepInsightsContainer && stage.deepInsights) {
            const di = stage.deepInsights;
            deepInsightsContainer.innerHTML = "";

            let diHtml = "";
            if (di.zapposCaseStudy) {
                diHtml += `
                    <div class="p-4 rounded-xl bg-brand-dark/70 border border-brand-border space-y-2">
                        <div class="text-xs font-bold text-brand-amber flex items-center gap-1.5">
                            <span>🏢</span> ${di.zapposCaseStudy.title}
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${di.zapposCaseStudy.content}</p>
                    </div>
                `;
            }

            if (di.seligmanLevels && di.seligmanLevels.length > 0) {
                diHtml += `
                    <div class="p-4 rounded-xl bg-brand-dark/70 border border-brand-border space-y-3">
                        <div class="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>📚</span> 3 Cấp Độ Hạnh Phúc Bền Vững (Martin Seligman)
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            ${di.seligmanLevels.map(lvl => `
                                <div class="p-3 rounded-lg bg-brand-surface/70 border border-brand-border/60 space-y-1">
                                    <div class="text-xs font-bold text-brand-amber">${lvl.level}</div>
                                    <p class="text-[11px] text-slate-300 leading-snug">${lvl.nature}</p>
                                    <div class="text-[10px] text-slate-400 mt-1 font-mono">Đặc tính: ${lvl.duration}</div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }

            if (di.compassClock) {
                diHtml += `
                    <div class="p-4 rounded-xl bg-brand-dark/70 border border-brand-border space-y-2">
                        <div class="text-xs font-bold text-brand-orange flex items-center gap-1.5">
                            <span>🧭</span> ${di.compassClock.title}
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${di.compassClock.content}</p>
                        ${di.compassClock.intelExample ? `<div class="p-2.5 rounded-lg bg-brand-surface border border-brand-border/60 text-[11px] text-slate-300 italic"><strong class="text-white">Ví dụ Intel:</strong> ${di.compassClock.intelExample}</div>` : ""}
                    </div>
                `;
            }

            if (di.sdtLevers && di.sdtLevers.length > 0) {
                diHtml += `
                    <div class="p-4 rounded-xl bg-brand-dark/70 border border-brand-border space-y-3">
                        <div class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <span>🚀</span> Thuyết Tự Quyết (SDT) & 3 Đòn Bẩy Hiệu Suất Cao
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            ${di.sdtLevers.map(s => `
                                <div class="p-3 rounded-lg bg-brand-surface/70 border border-brand-border/60 space-y-1.5">
                                    <div class="text-xs font-bold text-emerald-400">${s.lever}</div>
                                    <div class="text-[11px] text-slate-300">${s.stat}</div>
                                    <div class="text-[11px] text-brand-amber font-medium">Hành động: ${s.action}</div>
                                    ${s.infographic ? `<button type="button" onclick="window.openInfographicModal('${s.infographic}', '${s.lever}')" class="text-[10px] text-brand-amber hover:underline flex items-center gap-1 pt-1">🔍 Xem Infographic HD</button>` : ""}
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }

            deepInsightsContainer.innerHTML = diHtml;
        }
    }

    // 11.12 Render Stage 3 Rewards Hub & Qualifier Gate
    function renderStage3Rewards(stage, s3) {
        const bonusScoreEl = document.getElementById("bonus-total-points");
        const bonusQualifierEl = document.getElementById("bonus-qualifier-status");
        const bonusProgressText = document.getElementById("bonus-progress-text");
        const bonusProgressBar = document.getElementById("bonus-progress-bar");
        const linkedinInput = document.getElementById("linkedin-story-url");
        const btnVerifyLinkedin = document.getElementById("btn-verify-linkedin");
        const linkedinStatus = document.getElementById("linkedin-verify-status");
        const rewardsGrid = document.getElementById("rewards-tiers-grid");

        const points = calculateStage3BonusPoints(s3);
        const targetPoints = 1200;
        const total = points.total;

        if (bonusScoreEl) bonusScoreEl.textContent = `${total} đ`;

        const pct = Math.min(100, Math.round((total / targetPoints) * 100));
        if (bonusProgressText) bonusProgressText.textContent = `${total} / ${targetPoints} Điểm (${pct}%)`;
        if (bonusProgressBar) bonusProgressBar.style.width = `${pct}%`;

        const isGoldQualified = total >= targetPoints;
        if (bonusQualifierEl) {
            if (isGoldQualified) {
                bonusQualifierEl.innerHTML = `<span class="text-brand-green font-bold">✓ ĐÃ ĐỦ ĐIỀU KIỆN VÉ VÀNG QUALIFIER!</span>`;
            } else {
                bonusQualifierEl.textContent = `Cần thêm ${targetPoints - total}đ để đạt Cổng Vàng`;
            }
        }

        // LinkedIn Handler
        if (linkedinInput) {
            linkedinInput.value = s3.linkedinUrl || "";
        }
        if (linkedinStatus && s3.linkedinUrl && s3.linkedinUrl.includes("linkedin.com")) {
            linkedinStatus.classList.remove("hidden");
            linkedinStatus.className = "text-xs font-semibold text-brand-green";
            linkedinStatus.innerHTML = `✓ Đã xác thực bài viết LinkedIn (+150đ): <a href="${s3.linkedinUrl}" target="_blank" class="underline text-sky-400">Xem bài viết</a>`;
        }

        if (btnVerifyLinkedin && linkedinInput) {
            btnVerifyLinkedin.onclick = () => {
                const val = linkedinInput.value.trim();
                if (!val) {
                    alert("Vui lòng nhập đường dẫn bài viết LinkedIn của bạn.");
                    return;
                }
                if (!val.includes("linkedin.com")) {
                    alert("Đường dẫn phải thuộc miền linkedin.com hợp lệ.");
                    return;
                }
                s3.linkedinUrl = val;
                saveLearnerProgress();
                renderStage3Rewards(stage, s3);
                alert("Chúc mừng! Đã ghi nhận đường dẫn bài viết LinkedIn và cộng +150 điểm thưởng.");
            };
        }

        // Render Reward Tiers
        if (rewardsGrid) {
            rewardsGrid.innerHTML = "";
            const rewards = stage.rewards || [];
            rewards.forEach(rw => {
                const isUnlocked = total >= rw.points;
                const card = document.createElement("div");
                card.className = `p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                        ? "bg-gradient-to-b from-brand-card to-brand-surface border-brand-amber shadow-lg shadow-amber-500/10"
                        : "bg-brand-dark/60 border-brand-border/60 opacity-80"
                } space-y-3`;

                card.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-extrabold ${isUnlocked ? "text-brand-amber" : "text-slate-400"}">${rw.badge}</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                isUnlocked ? "bg-brand-green/20 text-brand-green border border-brand-green/40" : "bg-brand-dark text-slate-400 border border-brand-border"
                            }">
                                ${isUnlocked ? "Đã Mở Khóa ✓" : `${rw.points} Điểm`}
                            </span>
                        </div>
                        <h5 class="text-xs sm:text-sm font-bold text-white">${rw.title}</h5>
                        <p class="text-[11px] text-slate-300 leading-relaxed">${rw.desc}</p>
                    </div>

                    <div class="pt-2 border-t border-brand-border/50">
                        ${
                            isUnlocked
                                ? `<button type="button" class="w-full py-2 px-3 rounded-xl bg-brand-amber hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5" onclick="alert('Đã ghi nhận yêu cầu nhận phần thưởng: ${rw.title}! Ban Tổ Chức sẽ liên hệ theo email đăng ký.')">
                                       <span>🎁 Yêu Cầu Nhận Thưởng</span>
                                   </button>`
                                : `<div class="text-[11px] text-slate-500 text-center font-semibold">Cần thêm ${rw.points - total}đ để mở khóa</div>`
                        }
                    </div>
                `;

                rewardsGrid.appendChild(card);
            });
        }
    }


    window.renderStage3AView = renderStage3AView;

    function renderStage3View(stage) {
        if (stage && stage.id === "stage-3b") {
            renderStage3BView(stage);
        } else {
            renderStage3AView(stage);
        }
    }
    window.renderStage3View = renderStage3View;
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
            } else if (r.type === "html") {
                actionBtnHtml = `
                    <div class="pt-1 border-t border-brand-border/40">
                        <a href="${r.url}" target="_blank" class="w-full py-1.5 px-2.5 rounded-lg bg-brand-amber/15 hover:bg-brand-amber/25 text-brand-amber text-xs font-bold border border-brand-amber/30 transition-colors flex items-center justify-center gap-1.5">
                            <span>🃏 Mở Flashcards Tương Tác ↗</span>
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

    // 12.4B STANDALONE VIDEO OVERVIEW MODAL
    const modalVideoOverview = document.getElementById("modal-video-overview");
    const btnCloseVideoOverview = document.getElementById("btn-close-video-overview");
    const overviewVideoEl = document.getElementById("global-overview-video-el");
    const btnHeaderOverviewVideo = document.getElementById("btn-header-overview-video");
    const btnGlobalOverviewVideo = document.getElementById("btn-global-overview-video");
    const overviewVideoErrorBox = document.getElementById("overview-video-error-box");
    const btnRetryOverviewVideo = document.getElementById("btn-retry-overview-video");

    if (overviewVideoEl) {
        overviewVideoEl.addEventListener("error", () => {
            overviewVideoEl.classList.add("hidden");
            if (overviewVideoErrorBox) {
                overviewVideoErrorBox.classList.remove("hidden");
                overviewVideoErrorBox.classList.add("flex");
            }
        });
        overviewVideoEl.addEventListener("loadeddata", () => {
            overviewVideoEl.classList.remove("hidden");
            if (overviewVideoErrorBox) {
                overviewVideoErrorBox.classList.add("hidden");
                overviewVideoErrorBox.classList.remove("flex");
            }
        });
    }

    if (btnRetryOverviewVideo && overviewVideoEl) {
        btnRetryOverviewVideo.addEventListener("click", () => {
            if (overviewVideoErrorBox) {
                overviewVideoErrorBox.classList.add("hidden");
                overviewVideoErrorBox.classList.remove("flex");
            }
            overviewVideoEl.classList.remove("hidden");
            overviewVideoEl.load();
            overviewVideoEl.play().catch(() => {});
        });
    }

    function openOverviewVideoModal() {
        if (!modalVideoOverview) return;
        modalVideoOverview.classList.remove("hidden");
        if (overviewVideoErrorBox) {
            overviewVideoErrorBox.classList.add("hidden");
            overviewVideoErrorBox.classList.remove("flex");
        }
        if (overviewVideoEl) {
            overviewVideoEl.classList.remove("hidden");
            overviewVideoEl.play().catch(() => {});
        }
    }

    function closeOverviewVideoModal() {
        if (!modalVideoOverview) return;
        modalVideoOverview.classList.add("hidden");
        if (overviewVideoEl) {
            overviewVideoEl.pause();
        }
    }

    if (btnHeaderOverviewVideo) btnHeaderOverviewVideo.addEventListener("click", openOverviewVideoModal);
    if (btnGlobalOverviewVideo) btnGlobalOverviewVideo.addEventListener("click", openOverviewVideoModal);
    if (btnCloseVideoOverview) btnCloseVideoOverview.addEventListener("click", closeOverviewVideoModal);
    if (modalVideoOverview) {
        modalVideoOverview.addEventListener("click", (e) => {
            if (e.target === modalVideoOverview) closeOverviewVideoModal();
        });
    }

    window.openOverviewVideoModal = openOverviewVideoModal;
    window.closeOverviewVideoModal = closeOverviewVideoModal;

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
    if (btnBottomCloseDocReader) {
        btnBottomCloseDocReader.addEventListener("click", closeDocReader);
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

            // Image (![alt](url))
            if (line.startsWith("![")) {
                const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
                if (imgMatch) {
                    if (inList) { html.push("</ul>"); inList = false; }
                    html.push(`<div class="my-5 text-center"><img src="${imgMatch[2]}" alt="${imgMatch[1]}" class="rounded-2xl border border-brand-border/80 max-w-full mx-auto shadow-2xl hover:border-brand-amber/60 transition-all" loading="lazy" /><p class="text-[11px] text-slate-400 mt-2 italic font-medium">📸 ${formatInline(imgMatch[1])}</p></div>`);
                    continue;
                }
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
                .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-brand-card border border-brand-border text-brand-amber text-[11px] font-mono">$1</code>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-amber hover:underline font-semibold">$1 ↗</a>');
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
        if (!currentUser) {
            showAuthModal();
            return;
        }

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
            let nextIdx = currentStageIndex + 1;
            // Nếu đang ở Chặng 2A và Chặng 2B đang khóa, ưu tiên chuyển tiếp sang Chặng 3A nếu đã mở khóa
            if (currentStageIndex === 1 && !isStageUnlocked(nextIdx)) {
                if (isStageUnlocked("stage-3a")) {
                    const idx3A = curriculum.stages.findIndex(s => s.id === "stage-3a");
                    if (idx3A !== -1) nextIdx = idx3A;
                }
            }
            if (!isStageUnlocked(nextIdx)) {
                notifyLockedStage(nextIdx);
                renderSyllabus();
                return;
            }
            loadStage(nextIdx);
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
        let pct = 0;
        const levelsDone = Boolean((s1Data.viewed && s1Data.viewed["1-1"]) || (s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i)));
        const valuesDone = Boolean(s1Data.selectedValues && s1Data.selectedValues.length > 0);
        const cp1Done = Boolean((s1Data.iam_cp1_sets && s1Data.iam_cp1_sets.length > 0) || (s1Data.iam_cp1 && (s1Data.iam_cp1.I || s1Data.iam_cp1.i)) || (s1Data.iam_1_2 && (s1Data.iam_1_2.I || s1Data.iam_1_2.i)) || (s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i)));
        const quizDone = Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);

        if (levelsDone) pct += 10;
        if (valuesDone) pct += 10;
        if (cp1Done) pct += 40;
        if (quizDone) pct += 40;

        return Math.min(100, pct);
    }
    window.calculateStage1Progress = calculateStage1Progress;

    function calculateStage2AProgress() {
        if (learnerProgress.completedStages && (learnerProgress.completedStages.includes("stage-2a") || learnerProgress.completedStages.includes("stage-2"))) {
            return 100;
        }
        const s2aData = (learnerProgress.stageData && (learnerProgress.stageData["stage-2a"] || learnerProgress.stageData["stage-2"])) || {};
        const habits = s2aData.habits || {};
        let count = 0;

        // 0. Drivers
        const hD = habits.drivers;
        if ((hD && hD.iam && (hD.iam.I || hD.iam.A || hD.iam.M)) || (s2aData.iam && (s2aData.iam.I || s2aData.iam.A || s2aData.iam.M))) {
            count++;
        }
        // 1. Mindfulness
        const hM = habits.mindfulness;
        if (hM && ((hM.sbaChecks && (hM.sbaChecks.s || hM.sbaChecks.b || hM.sbaChecks.a)) || (hM.situation && String(hM.situation).trim()) || (hM.iam && (hM.iam.I || hM.iam.A || hM.iam.M)) || (hM.scenario && (hM.scenario.reflection || hM.scenario.action)))) {
            count++;
        }
        // 2. Gratitude
        const hG = habits.gratitude;
        if (hG && ((hG.items && hG.items.some(x => x && String(x).trim())) || (hG.card && (hG.card.to || hG.card.msg)) || (hG.iam && (hG.iam.I || hG.iam.A || hG.iam.M)) || (hG.scenario && (hG.scenario.reflection || hG.scenario.action)))) {
            count++;
        }
        // 3. Altruism
        const hA = habits.altruism;
        if (hA && ((hA.style && String(hA.style).trim()) || (hA.act && String(hA.act).trim()) || (hA.iam && (hA.iam.I || hA.iam.A || hA.iam.M)) || (hA.scenario && (hA.scenario.reflection || hA.scenario.action)))) {
            count++;
        }
        // Capstone 2A
        if (s2aData.capstoneIam && (s2aData.capstoneIam.I || s2aData.capstoneIam.A || s2aData.capstoneIam.M)) {
            count++;
        }

        return Math.min(100, Math.round((count / 5) * 100));
    }
    window.calculateStage2AProgress = calculateStage2AProgress;

    function calculateStage2BProgress() {
        if (learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-2b")) {
            return 100;
        }
        const s2bData = (learnerProgress.stageData && (learnerProgress.stageData["stage-2b"] || learnerProgress.stageData["stage-2"])) || {};
        const habits = s2bData.habits || {};
        let count = 0;

        // Flow
        const hF = habits.flow;
        if (hF && ((hF.boringTask && String(hF.boringTask).trim()) || (hF.redesign && String(hF.redesign).trim()) || (hF.iam && (hF.iam.I || hF.iam.A || hF.iam.M)) || (hF.scenario && (hF.scenario.reflection || hF.scenario.action)))) {
            count++;
        }
        // Optimism
        const hO = habits.optimism;
        if (hO && ((hO.abcde && (hO.abcde.A || hO.abcde.B || hO.abcde.C || hO.abcde.D || hO.abcde.E)) || (hO.iam && (hO.iam.I || hO.iam.A || hO.iam.M)) || (hO.scenario && (hO.scenario.reflection || hO.scenario.action)))) {
            count++;
        }
        // Capstone 2B
        if (s2bData.capstoneIam && (s2bData.capstoneIam.I || s2bData.capstoneIam.A || s2bData.capstoneIam.M)) {
            count++;
        }

        return Math.min(100, Math.round((count / 3) * 100));
    }
    window.calculateStage2BProgress = calculateStage2BProgress;

    function calculateStage3AProgress() {
        if (learnerProgress.completedStages && (learnerProgress.completedStages.includes("stage-3a") || learnerProgress.completedStages.includes("stage-3"))) {
            return 100;
        }
        const s3aData = (learnerProgress.stageData && (learnerProgress.stageData["stage-3a"] || learnerProgress.stageData["stage-3"])) || {};
        const streakStats = calculateStage3Streak(s3aData.habitTracker || {});
        const days = (streakStats && streakStats.totalCompletedDays) || 0;
        return Math.min(100, Math.round((days / 21) * 100));
    }
    window.calculateStage3AProgress = calculateStage3AProgress;

    function calculateStage3BProgress() {
        if (learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-3b")) {
            return 100;
        }
        const s3bData = (learnerProgress.stageData && (learnerProgress.stageData["stage-3b"] || learnerProgress.stageData["stage-3"])) || {};
        const weekly = s3bData.weeklyCheckins || {};
        let count = 0;
        if (weekly.w1 || s3bData.weekly_3b_1) count++;
        if (weekly.w2 || s3bData.weekly_3b_2) count++;
        if (s3bData.dailyAbcde && s3bData.dailyAbcde.A) count++;
        return Math.min(100, Math.round((count / 3) * 100));
    }
    window.calculateStage3BProgress = calculateStage3BProgress;

    function calculateStage2Progress() {
        return Math.round((calculateStage2AProgress() + calculateStage2BProgress()) / 2);
    }
    window.calculateStage2Progress = calculateStage2Progress;

    function calculateStage3Progress() {
        return Math.round((calculateStage3AProgress() + calculateStage3BProgress()) / 2);
    }
    window.calculateStage3Progress = calculateStage3Progress;

    function updateStage1Milestones() {
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        const isS1Done = learnerProgress.completedStages && learnerProgress.completedStages.includes("stage-1");

        const mLevelsDone = isS1Done || Boolean((s1Data.viewed && s1Data.viewed["1-1"]) || (s1Data.iam_cp1 && s1Data.iam_cp1.I) || (s1Data.iam_1_1 && s1Data.iam_1_1.I));
        const mValuesDone = isS1Done || Boolean((s1Data.selectedValues && s1Data.selectedValues.length > 0) || (s1Data.iam_cp1 && s1Data.iam_cp1.I) || (s1Data.iam_1_2 && s1Data.iam_1_2.I));
        const mCp1Done = isS1Done || Boolean((s1Data.iam_cp1_sets && s1Data.iam_cp1_sets.length > 0) || (s1Data.iam_cp1 && ((s1Data.iam_cp1.I && s1Data.iam_cp1.I.trim()) || (s1Data.iam_cp1.A && s1Data.iam_cp1.A.trim()) || (s1Data.iam_cp1.M && s1Data.iam_cp1.M.trim()))) || (s1Data.iam_1_2 && s1Data.iam_1_2.I) || (s1Data.iam_1_1 && s1Data.iam_1_1.I));
        const mQuizDone = isS1Done || Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);

        const doneCount = [mLevelsDone, mValuesDone, mCp1Done, mQuizDone].filter(Boolean).length;
        const milestoneText = document.getElementById("stage1-milestone-text");
        if (milestoneText) {
            milestoneText.textContent = `${doneCount}/4 Hoàn thành`;
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

        setPill("m-pill-levels", mLevelsDone);
        setPill("m-pill-values", mValuesDone);
        setPill("m-pill-cp1", mCp1Done);
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
        const mod1Done = Boolean((s1Data.viewed && s1Data.viewed["1-1"]) || (s1Data.iam_1_1 && (s1Data.iam_1_1.I || s1Data.iam_1_1.i)));
        const mod2Done = Boolean(s1Data.selectedValues && s1Data.selectedValues.length > 0);
        const cp1Done = Boolean((s1Data.iam_cp1_sets && s1Data.iam_cp1_sets.length > 0) || (s1Data.iam_cp1 && (s1Data.iam_cp1.I || s1Data.iam_cp1.A || s1Data.iam_cp1.M)));
        const quizDone = Boolean(s1Data.passed || s1Data.score >= 8 || s1Data.percentage >= 80);

        ["stage1-mod-1-1", "stage1-mod-1-2", "stage1-mod-cp1", "stage1-mod-quiz"].forEach(id => closeAccordionModule(id));

        if (!mod1Done) {
            openAccordionModule("stage1-mod-1-1");
        } else if (!mod2Done) {
            openAccordionModule("stage1-mod-1-2");
        } else if (!cp1Done) {
            openAccordionModule("stage1-mod-cp1");
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
        const pct2a = calculateStage2AProgress();
        const pct2b = calculateStage2BProgress();
        const pct3a = calculateStage3AProgress();
        const pct3b = calculateStage3BProgress();

        const pct2 = Math.round((pct2a + pct2b) / 2);
        const pct3 = Math.round((pct3a + pct3b) / 2);

        if (segmentBar1) segmentBar1.style.width = `${pct1}%`;
        if (segmentBar2) segmentBar2.style.width = `${pct2}%`;
        if (segmentBar3) segmentBar3.style.width = `${pct3}%`;

        if (segmentLabel1) segmentLabel1.textContent = `C1: ${pct1}%`;
        if (segmentLabel2) segmentLabel2.textContent = `C2: ${pct2}%`;
        if (segmentLabel3) segmentLabel3.textContent = `C3: ${pct3}%`;

        const totalPct = Math.round((pct1 + pct2a + pct2b + pct3a + pct3b) / 5);
        const completed = (learnerProgress.completedStages || []).length;
        const total = (curriculum.stages || []).length || 5;

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

    // 13.0 CẦU NỐI VÀO NỘI DUNG CHÍNH TỪ TAB TỔNG QUAN
    const btnGotoMainContent = document.getElementById("btn-goto-main-content");
    if (btnGotoMainContent) {
        btnGotoMainContent.addEventListener("click", () => {
            const practiceTabBtn = document.querySelector('.tab-btn[data-tab="tab-practice"]');
            if (practiceTabBtn) {
                practiceTabBtn.click();
            }
            setTimeout(() => {
                openAccordionModule("stage1-mod-1-1");
                const mod1Sec = document.getElementById("stage1-mod-1-1");
                if (mod1Sec) {
                    mod1Sec.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        });
    }

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
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // NẾU ĐANG Ở GIAO DIỆN HỌC THỬ / NGƯỜI MỚI -> DELEGATE SANG NÚT GỬI LIÊN KẾT HỌC THỬ
        if (trialOnboardingGroup && !trialOnboardingGroup.classList.contains("hidden")) {
            if (btnRequestTrial) {
                btnRequestTrial.click();
            }
            return;
        }

        if (authErrorBanner) authErrorBanner.classList.add("hidden");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");

        const rawIdentity = (loginIdentityInput.value || "").trim();
        if (!rawIdentity) {
            loginIdentityInput.focus();
            return;
        }

        let learner = findLearner(rawIdentity);

        // NẾU CHƯA THẤY TRONG BỘ NHỚ TĨNH -> GỌI WEBHOOK PHÂN GIẢI DANH TÍNH TỪ MASTER ROSTER GOOGLE SHEETS
        if (!learner) {
            try {
                const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
                const probeRes = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({ action: "resolve_login_identity", identity: rawIdentity })
                });
                if (probeRes.ok) {
                    const probeData = await probeRes.json();
                    if (probeData.error === "ACCOUNT_DISABLED") {
                        authErrorTitle.textContent = "Tài khoản tạm ngưng hoạt động";
                        authErrorDesc.textContent = "Tài khoản học viên của bạn đang tạm ngưng hoạt động. Vui lòng liên hệ Ban Giảng Huấn để được kích hoạt lại.";
                        authErrorBanner.classList.remove("hidden");
                        return;
                    }
                    if (probeData.success && probeData.learner) {
                        learner = probeData.learner;
                        if (Array.isArray(authorizedRoster)) {
                            authorizedRoster.push(learner);
                        }
                    }
                }
            } catch (probeErr) {
                console.warn("[DHM LMS] Không phân giải được danh tính từ Webhook, fallback local:", probeErr);
            }
        }

        // NHẬN DIỆN HỌC VIÊN TRẢI NGHIỆM ĐÃ ĐƯỢC PHÊ DUYỆT / ĐĂNG KÝ
        if (!learner && isTrialAccount(rawIdentity)) {
            const profile = getTrialUserProfile(rawIdentity);
            currentUser = {
                learner_id: profile.learner_id || ("TRIAL-" + Date.now().toString(36).toUpperCase()),
                name: profile.name || rawIdentity.split("@")[0],
                email: rawIdentity.toLowerCase(),
                phone: profile.phone || "",
                phone_last4: profile.phone ? profile.phone.slice(-4) : "",
                cohort: "Học viên Trải nghiệm",
                role: "trial",
                isTrial: true
            };
            localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
            hideAuthModal();
            applyUserSession();
            return;
        }

        // TRƯỜNG HỢP 0: HỌC VIÊN BỊ VÔ HIỆU HÓA TRẠNG THÁI (DISABLED)
        if (learner && learner.enrollment_status === "DISABLED") {
            authErrorTitle.textContent = "Tài khoản tạm ngưng hoạt động";
            authErrorDesc.textContent = "Tài khoản học viên của bạn đang tạm ngưng hoạt động. Vui lòng liên hệ Ban Giảng Huấn để được kích hoạt lại.";
            authErrorBanner.classList.remove("hidden");
            return;
        }

        // TRƯỜNG HỢP 1: KHÔNG TÌM THẤY EMAIL TRONG DANH BẠ HỌC VIÊN CHÍNH THỨC
        // -> Tự động kích hoạt form Đăng ký & Nhận liên kết học thử Chặng 1 cho Người mới (kèm notice từ failed login)
        if (!learner) {
            showTrialOnboardingView(rawIdentity, true);
            return;
        }

        // TRƯỜNG HỢP 2: HỌC VIÊN CHÍNH THỨC NHƯNG THIẾU SỐ ĐIỆN THOẠI TRONG ROSTER (Không áp dụng cho Apollo/tài khoản có mật khẩu)
        const isApolloOrPwdAuth = learner.force_pwd_change || learner.password_hash || learner.default_pwd || (learner.cohort && learner.cohort.toLowerCase().includes("apollo"));
        const hasPhone = learner.phone && learner.phone.trim().length >= 8 && !learner.missing_phone;
        const isPhoneOnboarding = !passwordGroup.classList.contains("hidden") ? false : true;

        if (!hasPhone && !isApolloOrPwdAuth && !isPhoneOnboarding) {
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

        // TRƯỜNG HỢP 3: HỌC VIÊN CHÍNH THỨC -> XÁC THỰC MẬT KHẨU
        const inputPassword = (loginPasswordInput.value || "").trim();
        if (!inputPassword) {
            authErrorTitle.textContent = "Vui lòng nhập mật khẩu";
            if (learner.force_pwd_change) {
                authErrorDesc.textContent = "Mật khẩu khởi tạo không đúng hoặc chưa nhập. Vui lòng kiểm tra lại.";
            } else if (learner.password_hash || learner.default_pwd) {
                authErrorDesc.textContent = "Mật khẩu truy cập không đúng hoặc chưa nhập. Vui lòng kiểm tra lại.";
            } else {
                authErrorDesc.textContent = "Mật khẩu là 4 số cuối của Số điện thoại đã đăng ký. Vui lòng nhập mật khẩu.";
            }
            authErrorBanner.classList.remove("hidden");
            loginPasswordInput.focus();
            return;
        }

        const authResult = await verifyPassword(learner, inputPassword);
        if (!authResult.valid) {
            authErrorTitle.textContent = "Mật khẩu không chính xác";
            if (learner.force_pwd_change) {
                authErrorDesc.textContent = "Mật khẩu khởi tạo không đúng. Vui lòng kiểm tra lại.";
            } else if (learner.password_hash || learner.default_pwd) {
                authErrorDesc.textContent = "Mật khẩu truy cập không đúng. Vui lòng kiểm tra lại.";
            } else {
                authErrorDesc.textContent = "Mật khẩu là 4 số cuối của Số điện thoại đã đăng ký. Vui lòng kiểm tra lại.";
            }
            authErrorBanner.classList.remove("hidden");
            loginPasswordInput.focus();
            return;
        }

        // BẮT BUỘC ĐỔI MẬT KHẨU KHỞI TẠO (Apollo hoặc tài khoản mới gắn cờ force_pwd_change)
        if (authResult.mustChange) {
            hideAuthModal();
            showForceChangePasswordModal(learner);
            return;
        }

        currentUser = learner;
        localStorage.setItem("dhm_lms_auth_user", JSON.stringify(currentUser));
        applyUserSession();
    });

    // Nút chuyển sang form đăng ký học thử cho Người Mới
    if (btnToggleNewcomerTrial) {
        btnToggleNewcomerTrial.addEventListener("click", () => {
            showTrialOnboardingView(loginIdentityInput.value, false);
        });
    }

    // Khi người dùng bấm nút: "Để lại quan tâm và đăng ký trải nghiệm"
    if (btnShowTrialLead) {
        btnShowTrialLead.addEventListener("click", () => {
            showTrialOnboardingView(loginIdentityInput.value, true);
        });
    }

    // Nút Quay lại màn hình đăng nhập (Quay lui) theo đúng chỉ đạo của Sếp
    if (btnBackToLogin) {
        btnBackToLogin.addEventListener("click", () => {
            resetToDefaultLoginView();
            loginIdentityInput.focus();
        });
    }

    if (trialNameInput) {
        trialNameInput.addEventListener("input", () => {
            trialNameInput.dataset.autoFilled = "false";
        });
    }

    loginIdentityInput.addEventListener("input", () => {
        const val = loginIdentityInput.value.trim();

        // NẾU ĐANG Ở GIAO DIỆN HỌC THỬ (TRIAL ONBOARDING GROUP ĐANG MỞ):
        // Tuyệt đối không tự ý ẩn form học thử hay bung lại ô mật khẩu khi người dùng đang gõ email!
        if (trialOnboardingGroup && !trialOnboardingGroup.classList.contains("hidden")) {
            if (trialNameInput && (!trialNameInput.value || trialNameInput.dataset.autoFilled === "true")) {
                if (val.includes("@")) {
                    trialNameInput.value = val.split("@")[0];
                    trialNameInput.dataset.autoFilled = "true";
                }
            }
            return;
        }

        // Giữ ô mật khẩu và nút submit luôn hiển thị, ẩn lỗi cũ nếu có
        if (authErrorBanner) authErrorBanner.classList.add("hidden");
        if (trialTriggerWrapper) trialTriggerWrapper.classList.add("hidden");
        if (trialOnboardingGroup) trialOnboardingGroup.classList.add("hidden");
        if (newcomerToggleWrapper) newcomerToggleWrapper.classList.remove("hidden");
        if (loginIdentityLabel) loginIdentityLabel.textContent = "Email học viên đã đăng ký";

        if (val.includes("@") && val.length >= 6) {
            const found = findLearner(val);
            if (found) {
                updateAuthModeForLearner(found);
            } else if (isTrialAccount(val)) {
                // Nhận diện Học viên Trải nghiệm Chặng 1 đã kích hoạt / đăng ký
                if (authUserDetected) {
                    authUserDetected.innerHTML = `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-green/20 text-brand-green border border-brand-green/30">🌱 Học viên Trải nghiệm Chặng 1</span>`;
                    authUserDetected.classList.remove("hidden");
                }
                if (passwordGroup) passwordGroup.classList.add("hidden");
                if (loginPasswordInput) loginPasswordInput.removeAttribute("required");
                if (phoneOnboardingGroup) phoneOnboardingGroup.classList.add("hidden");
                if (onboardingPhoneInput) onboardingPhoneInput.removeAttribute("required");
                if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
                if (btnSubmitText) btnSubmitText.textContent = "Vào Học Chặng 1 Ngay";
            } else {
                if (authUserDetected) authUserDetected.classList.add("hidden");
                if (passwordGroup) passwordGroup.classList.remove("hidden");
                if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
                if (loginPasswordInput) {
                    loginPasswordInput.placeholder = "Nhập 4 số cuối SĐT (hoặc để trống nếu đăng ký mới)";
                    loginPasswordInput.removeAttribute("required");
                }
                if (btnSubmitText) btnSubmitText.textContent = "Vào Học / Đăng Ký";
            }
        } else {
            if (authUserDetected) authUserDetected.classList.add("hidden");
            if (passwordGroup) passwordGroup.classList.remove("hidden");
            if (submitAuthWrapper) submitAuthWrapper.classList.remove("hidden");
            if (loginPasswordInput) {
                loginPasswordInput.placeholder = "Nhập 4 số cuối Số điện thoại của bạn";
                loginPasswordInput.removeAttribute("required");
            }
            if (btnSubmitText) btnSubmitText.textContent = "Vào Học Ngay";
        }
    });

    if (btnTogglePwd) {
        btnTogglePwd.addEventListener("click", () => {
            const isPwd = loginPasswordInput.type === "password";
            loginPasswordInput.type = isPwd ? "text" : "password";
            btnTogglePwd.textContent = isPwd ? "🔒 Ẩn mật khẩu" : "👁️ Hiện mật khẩu";
        });
    }

    if (btnCloseAuthModal) {
        btnCloseAuthModal.addEventListener("click", () => {
            hideAuthModal();
        });
    }

    if (btnHeaderLogin) {
        btnHeaderLogin.addEventListener("click", () => {
            showAuthModal();
        });
    }

    if (authModal) {
        authModal.addEventListener("click", (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && authModal && !authModal.classList.contains("hidden")) {
            hideAuthModal();
        }
    });

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                localStorage.removeItem("dhm_lms_auth_user");
                currentUser = null;
                updatePersonalValueLinks();
                learnerProgress = getInitialLearnerProgress();
                userChip.classList.add("hidden");
                if (btnHeaderLogin) btnHeaderLogin.classList.remove("hidden");
                renderSyllabus();
                evaluateLearnerStatus();
                loadStage(0);
                showAuthModal();
            }
        });
    }

    // ==========================================
    // PASSWORD MANAGEMENT LOGIC (Apollo & Self-Change)
    // ==========================================
    let pendingForceChangeUser = null;

    function showForceChangePasswordModal(learner) {
        pendingForceChangeUser = learner;
        if (forceNewPwdInput) forceNewPwdInput.value = "";
        if (forceConfirmPwdInput) forceConfirmPwdInput.value = "";
        if (forcePwdErrorBanner) forcePwdErrorBanner.classList.add("hidden");
        if (btnSubmitForcePwdText) btnSubmitForcePwdText.textContent = "Xác Nhận & Vào Học";
        if (btnSubmitForcePwd) btnSubmitForcePwd.disabled = false;
        if (forceChangePwdModal) forceChangePwdModal.classList.remove("hidden");
        setTimeout(() => {
            if (forceNewPwdInput) forceNewPwdInput.focus();
        }, 100);
    }

    function hideForceChangePasswordModal() {
        if (forceChangePwdModal) forceChangePwdModal.classList.add("hidden");
        pendingForceChangeUser = null;
    }

    function showSelfChangePasswordModal() {
        if (!currentUser) return;
        if (selfCurrentPwdInput) selfCurrentPwdInput.value = "";
        if (selfNewPwdInput) selfNewPwdInput.value = "";
        if (selfConfirmPwdInput) selfConfirmPwdInput.value = "";
        if (selfPwdErrorBanner) selfPwdErrorBanner.classList.add("hidden");
        if (selfPwdSuccessBanner) selfPwdSuccessBanner.classList.add("hidden");
        if (btnSubmitSelfPwdText) btnSubmitSelfPwdText.textContent = "Cập Nhật Mật Khẩu";
        if (btnSubmitSelfPwd) btnSubmitSelfPwd.disabled = false;
        if (selfChangePwdModal) selfChangePwdModal.classList.remove("hidden");
        setTimeout(() => {
            if (selfCurrentPwdInput) selfCurrentPwdInput.focus();
        }, 100);
    }

    function hideSelfChangePasswordModal() {
        if (selfChangePwdModal) selfChangePwdModal.classList.add("hidden");
    }

    if (btnOpenChangePwd) {
        btnOpenChangePwd.addEventListener("click", (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            showSelfChangePasswordModal();
        });
    }

    if (btnCloseSelfPwd) {
        btnCloseSelfPwd.addEventListener("click", () => {
            hideSelfChangePasswordModal();
        });
    }

    if (btnCancelSelfPwd) {
        btnCancelSelfPwd.addEventListener("click", () => {
            hideSelfChangePasswordModal();
        });
    }

    if (btnToggleForceNewPwd && forceNewPwdInput) {
        btnToggleForceNewPwd.addEventListener("click", () => {
            const isPwd = forceNewPwdInput.type === "password";
            forceNewPwdInput.type = isPwd ? "text" : "password";
            btnToggleForceNewPwd.textContent = isPwd ? "🔒" : "👁️";
        });
    }

    if (btnToggleForceConfirmPwd && forceConfirmPwdInput) {
        btnToggleForceConfirmPwd.addEventListener("click", () => {
            const isPwd = forceConfirmPwdInput.type === "password";
            forceConfirmPwdInput.type = isPwd ? "text" : "password";
            btnToggleForceConfirmPwd.textContent = isPwd ? "🔒" : "👁️";
        });
    }

    if (forceChangePwdForm) {
        forceChangePwdForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (forcePwdErrorBanner) forcePwdErrorBanner.classList.add("hidden");

            const newPwd = (forceNewPwdInput.value || "").trim();
            const confirmPwd = (forceConfirmPwdInput.value || "").trim();
            const learner = pendingForceChangeUser || currentUser;

            if (!learner) {
                if (forcePwdErrorBanner) {
                    forcePwdErrorTitle.textContent = "Phiên làm việc hết hạn";
                    forcePwdErrorDesc.textContent = "Vui lòng tải lại trang và đăng nhập lại.";
                    forcePwdErrorBanner.classList.remove("hidden");
                }
                return;
            }

            const defaultPwd = learner.default_pwd || "1234";
            if (newPwd === defaultPwd || newPwd === "1234") {
                if (forcePwdErrorBanner) {
                    forcePwdErrorTitle.textContent = "Mật khẩu không an toàn";
                    forcePwdErrorDesc.textContent = "Không được sử dụng lại mật khẩu mặc định (1234). Vui lòng chọn mật khẩu mới.";
                    forcePwdErrorBanner.classList.remove("hidden");
                }
                forceNewPwdInput.focus();
                return;
            }

            if (newPwd.length < 6) {
                if (forcePwdErrorBanner) {
                    forcePwdErrorTitle.textContent = "Mật khẩu quá ngắn";
                    forcePwdErrorDesc.textContent = "Mật khẩu mới phải có tối thiểu 6 ký tự.";
                    forcePwdErrorBanner.classList.remove("hidden");
                }
                forceNewPwdInput.focus();
                return;
            }

            if (newPwd !== confirmPwd) {
                if (forcePwdErrorBanner) {
                    forcePwdErrorTitle.textContent = "Mật khẩu không khớp";
                    forcePwdErrorDesc.textContent = "Mật khẩu xác nhận không khớp với mật khẩu mới. Vui lòng nhập lại.";
                    forcePwdErrorBanner.classList.remove("hidden");
                }
                forceConfirmPwdInput.focus();
                return;
            }

            try {
                if (btnSubmitForcePwdText) btnSubmitForcePwdText.textContent = "Đang lưu...";
                if (btnSubmitForcePwd) btnSubmitForcePwd.disabled = true;

                await saveNewPassword(learner, newPwd);
                hideForceChangePasswordModal();
                applyUserSession();
            } catch (err) {
                console.error("Error saving force new password:", err);
                if (btnSubmitForcePwdText) btnSubmitForcePwdText.textContent = "Xác Nhận & Vào Học";
                if (btnSubmitForcePwd) btnSubmitForcePwd.disabled = false;
                if (forcePwdErrorBanner) {
                    forcePwdErrorTitle.textContent = "Lỗi lưu mật khẩu";
                    forcePwdErrorDesc.textContent = "Đã có lỗi xảy ra khi lưu mật khẩu. Vui lòng thử lại.";
                    forcePwdErrorBanner.classList.remove("hidden");
                }
            }
        });
    }

    if (selfChangePwdForm) {
        selfChangePwdForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (selfPwdErrorBanner) selfPwdErrorBanner.classList.add("hidden");
            if (selfPwdSuccessBanner) selfPwdSuccessBanner.classList.add("hidden");

            if (!currentUser) return;

            const currentPwd = (selfCurrentPwdInput.value || "").trim();
            const newPwd = (selfNewPwdInput.value || "").trim();
            const confirmPwd = (selfConfirmPwdInput.value || "").trim();

            const verifyResult = await verifyPassword(currentUser, currentPwd);
            if (!verifyResult.valid) {
                if (selfPwdErrorBanner) {
                    selfPwdErrorTitle.textContent = "Mật khẩu hiện tại không đúng";
                    selfPwdErrorDesc.textContent = "Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.";
                    selfPwdErrorBanner.classList.remove("hidden");
                }
                selfCurrentPwdInput.focus();
                return;
            }

            if (newPwd.length < 6) {
                if (selfPwdErrorBanner) {
                    selfPwdErrorTitle.textContent = "Mật khẩu quá ngắn";
                    selfPwdErrorDesc.textContent = "Mật khẩu mới phải có tối thiểu 6 ký tự.";
                    selfPwdErrorBanner.classList.remove("hidden");
                }
                selfNewPwdInput.focus();
                return;
            }

            if (newPwd === currentPwd) {
                if (selfPwdErrorBanner) {
                    selfPwdErrorTitle.textContent = "Mật khẩu không đổi";
                    selfPwdErrorDesc.textContent = "Mật khẩu mới phải khác mật khẩu hiện tại.";
                    selfPwdErrorBanner.classList.remove("hidden");
                }
                selfNewPwdInput.focus();
                return;
            }

            if (newPwd !== confirmPwd) {
                if (selfPwdErrorBanner) {
                    selfPwdErrorTitle.textContent = "Mật khẩu không khớp";
                    selfPwdErrorDesc.textContent = "Mật khẩu xác nhận không khớp với mật khẩu mới.";
                    selfPwdErrorBanner.classList.remove("hidden");
                }
                selfConfirmPwdInput.focus();
                return;
            }

            try {
                if (btnSubmitSelfPwdText) btnSubmitSelfPwdText.textContent = "Đang lưu...";
                if (btnSubmitSelfPwd) btnSubmitSelfPwd.disabled = true;

                await saveNewPassword(currentUser, newPwd);

                if (selfPwdSuccessBanner) selfPwdSuccessBanner.classList.remove("hidden");
                setTimeout(() => {
                    hideSelfChangePasswordModal();
                    if (btnSubmitSelfPwdText) btnSubmitSelfPwdText.textContent = "Cập Nhật Mật Khẩu";
                    if (btnSubmitSelfPwd) btnSubmitSelfPwd.disabled = false;
                }, 1200);
            } catch (err) {
                console.error("Error saving self-service new password:", err);
                if (btnSubmitSelfPwdText) btnSubmitSelfPwdText.textContent = "Cập Nhật Mật Khẩu";
                if (btnSubmitSelfPwd) btnSubmitSelfPwd.disabled = false;
                if (selfPwdErrorBanner) {
                    selfPwdErrorTitle.textContent = "Lỗi lưu mật khẩu";
                    selfPwdErrorDesc.textContent = "Đã có lỗi xảy ra khi lưu mật khẩu. Vui lòng thử lại.";
                    selfPwdErrorBanner.classList.remove("hidden");
                }
            }
        });
    }

    if (btnCloseUpgrade) {
        btnCloseUpgrade.addEventListener("click", () => {
            hideTrialUpgradeModal();
        });
    }

    let trialCooldownTimer = null;
    function resetTrialButtonState() {
        if (trialCooldownTimer) {
            clearInterval(trialCooldownTimer);
            trialCooldownTimer = null;
        }
        if (btnRequestTrial) {
            btnRequestTrial.classList.remove("hidden");
            btnRequestTrial.disabled = false;
            btnRequestTrial.className = "w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer";
        }
        if (btnRequestTrialText) {
            btnRequestTrialText.textContent = "Gửi Liên Kết Học Thử Qua Email";
        }
        if (btnRequestTrialArrow) {
            btnRequestTrialArrow.classList.remove("hidden");
        }
        if (trialResendWrapper) {
            trialResendWrapper.classList.add("hidden");
        }
        if (btnResendTrial) {
            btnResendTrial.disabled = true;
            btnResendTrial.className = "w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700";
            btnResendTrial.textContent = "Gửi lại liên kết sau (60s)";
        }
    }

    function startTrialCooldown(seconds) {
        let remaining = seconds;
        // Ẩn nút gửi ban đầu, chỉ hiển thị duy nhất 1 nút đếm ngược / gửi lại (Single State - Single CTA)
        if (btnRequestTrial) {
            btnRequestTrial.classList.add("hidden");
        }
        if (trialResendWrapper) {
            trialResendWrapper.classList.remove("hidden");
        }
        if (btnResendTrial) {
            btnResendTrial.disabled = true;
            btnResendTrial.className = "w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700";
            btnResendTrial.textContent = `Gửi lại liên kết sau (${remaining}s)`;
        }

        if (trialCooldownTimer) clearInterval(trialCooldownTimer);
        trialCooldownTimer = setInterval(() => {
            remaining--;
            if (btnResendTrial) {
                if (remaining > 0) {
                    btnResendTrial.textContent = `Gửi lại liên kết sau (${remaining}s)`;
                } else {
                    clearInterval(trialCooldownTimer);
                    trialCooldownTimer = null;
                    btnResendTrial.disabled = false;
                    btnResendTrial.className = "w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-orange to-brand-amber hover:brightness-110 active:scale-98 text-black shadow-md cursor-pointer";
                    btnResendTrial.textContent = "Gửi lại liên kết mới";
                }
            }
        }, 1000);
    }

    if (btnResendTrial) {
        btnResendTrial.addEventListener("click", () => {
            if (btnResendTrial.disabled) return;
            if (btnRequestTrial) {
                btnRequestTrial.click();
            }
        });
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
                    saveApprovedTrialEmail(email);
                    saveTrialUserProfile(email, fullName, cleanPhone);
                    // Ẩn khối cảnh báo vàng "Email này chưa có trong danh sách..." để người dùng không tưởng nhầm là lỗi
                    if (trialRosterNotice) trialRosterNotice.classList.add("hidden");

                    if (trialStatusMsg) {
                        trialStatusMsg.className = "p-3.5 rounded-xl bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs leading-relaxed space-y-2 text-left";
                        trialStatusMsg.innerHTML = `
                            <div class="flex items-center gap-2 font-bold text-sm text-white">
                                <span>🎉</span> <span>Đã gửi liên kết kích hoạt thành công!</span>
                            </div>
                            <div class="text-slate-200">
                                Hệ thống đã gửi liên kết mở khóa Chặng 1 tới <strong>${escapeHtml(email)}</strong>.
                            </div>
                            <div class="p-2.5 rounded-lg bg-black/40 border border-brand-green/20 text-[11px] text-slate-300 leading-relaxed">
                                <strong>💡 Lưu ý quan trọng:</strong> Thư tự động có thể bị bộ lọc đưa vào mục <strong>Spam / Thư rác</strong> hoặc tab <strong>Quảng cáo</strong>. Vui lòng kiểm tra các mục này và nhấp vào liên kết để bắt đầu học.
                            </div>
                        `;
                        trialStatusMsg.classList.remove("hidden");
                    }
                    startTrialCooldown(60);
                } else if (data && data.error === "RATE_LIMIT_EXCEEDED") {
                    saveApprovedTrialEmail(email);
                    saveTrialUserProfile(email, fullName, cleanPhone);
                    const waitSec = data.retry_after_seconds || 60;
                    if (trialStatusMsg) {
                        trialStatusMsg.className = "p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs text-left";
                        trialStatusMsg.textContent = data.message || `Hệ thống vừa gửi liên kết. Vui lòng chờ ${waitSec} giây trước khi gửi lại yêu cầu.`;
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
                saveApprovedTrialEmail(email);
                saveTrialUserProfile(email, fullName, cleanPhone);
                if (trialRosterNotice) trialRosterNotice.classList.add("hidden");
                if (trialStatusMsg) {
                    trialStatusMsg.className = "p-3.5 rounded-xl bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs leading-relaxed space-y-2 text-left";
                    trialStatusMsg.innerHTML = `
                        <div class="flex items-center gap-2 font-bold text-sm text-white">
                            <span>🎉</span> <span>Yêu cầu đã được tiếp nhận!</span>
                        </div>
                        <div class="text-slate-200">
                            Hệ thống đang xử lý và gửi liên kết tới <strong>${escapeHtml(email)}</strong>.
                        </div>
                        <div class="p-2.5 rounded-lg bg-black/40 border border-brand-green/20 text-[11px] text-slate-300 leading-relaxed">
                            <strong>💡 Lưu ý:</strong> Vui lòng kiểm tra hòm thư của bạn (kể cả mục <strong>Spam / Thư rác</strong>) sau ít phút.
                        </div>
                    `;
                    trialStatusMsg.classList.remove("hidden");
                }
                startTrialCooldown(60);
            }
        });
    }

    // =========================================================================
    // 14B. NEW ENHANCEMENTS: MULTI-SET I•A•M, QUICK NOTE FAB & CULTURECODE CONTACT
    // =========================================================================

    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 14B.1 MULTI-SET I•A•M CORE ENGINE
    function renderIamSetsCardList(containerId, counterId, setsArray, cpType) {
        const listEl = document.getElementById(containerId);
        const counterEl = document.getElementById(counterId);
        if (!listEl) return;
        listEl.innerHTML = "";

        const count = Array.isArray(setsArray) ? setsArray.length : 0;
        if (counterEl) {
            counterEl.textContent = `Đã lưu: ${count} bộ`;
        }

        if (!Array.isArray(setsArray) || setsArray.length === 0) {
            listEl.innerHTML = `
                <div class="p-3.5 text-center text-xs text-slate-400 italic bg-brand-dark/40 rounded-xl border border-dashed border-brand-border/60">
                    Chưa có bộ I•A•M nào được lưu. Hãy nhập 3 cột ở trên và bấm <strong class="text-brand-amber">"💾 Lưu & Nhập Tiếp Set Mới"</strong>.
                </div>`;
            return;
        }

        setsArray.forEach((set, idx) => {
            const card = document.createElement("div");
            card.className = "p-3.5 rounded-2xl bg-brand-surface/90 border border-brand-border hover:border-brand-amber/40 transition-all space-y-2.5 shadow-sm";
            card.innerHTML = `
                <div class="flex items-center justify-between pb-2 border-b border-brand-border/50">
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-brand-amber/20 text-brand-amber font-mono font-bold flex items-center justify-center text-[11px] border border-brand-amber/30">
                            ${idx + 1}
                        </span>
                        <span class="text-xs font-bold text-white">Bộ I•A•M #${idx + 1}</span>
                        ${set.createdAt ? `<span class="text-[10px] text-slate-500 font-mono hidden sm:inline">(${new Date(set.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>` : ''}
                    </div>
                    <div class="flex items-center gap-1.5">
                        <button type="button" class="btn-card-copy text-[10.5px] px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-border text-slate-300 font-medium transition-colors border border-brand-border/60 flex items-center gap-1 cursor-pointer" title="Sao chép bộ này">
                            <span>📋</span> Copy
                        </button>
                        <button type="button" class="btn-card-edit text-[10.5px] px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-amber/20 text-brand-amber font-medium transition-colors border border-brand-amber/30 flex items-center gap-1 cursor-pointer" title="Sửa bộ này (nạp lại vào ô nhập)">
                            <span>✏️</span> Sửa
                        </button>
                        <button type="button" class="btn-card-del text-[10.5px] px-2.5 py-1 rounded-lg bg-brand-card hover:bg-red-500/20 text-red-400 font-medium transition-colors border border-red-500/30 flex items-center gap-1 cursor-pointer" title="Xóa bộ này">
                            <span>🗑️</span> Xóa
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                    <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-emerald-500/20 space-y-1">
                        <div class="font-bold text-emerald-400 text-[10.5px] flex items-center gap-1">
                            <span>🧭</span> I (Interested / Insight):
                        </div>
                        <div class="text-slate-200 whitespace-pre-wrap leading-relaxed">${escapeHtml(set.I || "—")}</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-sky-500/20 space-y-1">
                        <div class="font-bold text-sky-400 text-[10.5px] flex items-center gap-1">
                            <span>🎯</span> A (Actionable):
                        </div>
                        <div class="text-slate-200 whitespace-pre-wrap leading-relaxed">${escapeHtml(set.A || "—")}</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-purple-500/20 space-y-1">
                        <div class="font-bold text-purple-400 text-[10.5px] flex items-center gap-1">
                            <span>✨</span> M (Meaningful):
                        </div>
                        <div class="text-slate-200 whitespace-pre-wrap leading-relaxed">${escapeHtml(set.M || "—")}</div>
                    </div>
                </div>
            `;

            const btnCopy = card.querySelector(".btn-card-copy");
            btnCopy.onclick = () => {
                const copyText = `Bộ I•A•M #${idx + 1} (${cpType === 'cp1' ? 'Trạm 1: Nhận Thức & La Bàn Giá Trị' : 'Trạm 2: Đòn Bẩy & Small Wins'}):\n` +
                    `- I (Insight): ${set.I || ''}\n` +
                    `- A (Actionable): ${set.A || ''}\n` +
                    `- M (Meaningful): ${set.M || ''}`;
                navigator.clipboard.writeText(copyText).then(() => {
                    const old = btnCopy.innerHTML;
                    btnCopy.innerHTML = "<span>✓</span> Đã copy!";
                    setTimeout(() => { btnCopy.innerHTML = old; }, 1500);
                });
            };

            const btnEdit = card.querySelector(".btn-card-edit");
            btnEdit.onclick = () => {
                const prefix = cpType === 'cp1' ? 'iam-cp1' : 'iam-cp2';
                const inputI = document.getElementById(`${prefix}-i`);
                const inputA = document.getElementById(`${prefix}-a`);
                const inputM = document.getElementById(`${prefix}-m`);
                if (inputI) inputI.value = set.I || "";
                if (inputA) inputA.value = set.A || "";
                if (inputM) inputM.value = set.M || "";

                // Remove this set from the array so saving will re-save
                setsArray.splice(idx, 1);
                syncIamLegacy(cpType);
                debouncedSave();
                renderIamSetsCardList(containerId, counterId, setsArray, cpType);
                updateDrawerIamHistory();

                if (inputI) {
                    inputI.focus();
                    inputI.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            };

            const btnDel = card.querySelector(".btn-card-del");
            btnDel.onclick = () => {
                if (confirm(`Bạn có chắc chắn muốn xóa Bộ I•A•M #${idx + 1} không?`)) {
                    setsArray.splice(idx, 1);
                    syncIamLegacy(cpType);
                    debouncedSave();
                    renderSyllabus();
                    updateStage1Milestones();
                    evaluateLearnerStatus();
                    renderIamSetsCardList(containerId, counterId, setsArray, cpType);
                    updateDrawerIamHistory();
                }
            };

            listEl.appendChild(card);
        });
    }

    function syncIamLegacy(cpType) {
        const s1Data = (learnerProgress.stageData && learnerProgress.stageData["stage-1"]) || {};
        if (cpType === "cp1") {
            const sets = s1Data.iam_cp1_sets || [];
            if (sets.length > 0) {
                s1Data.iam_cp1 = s1Data.iam_cp1 || {};
                s1Data.iam_cp1.I = sets[0].I;
                s1Data.iam_cp1.A = sets[0].A;
                s1Data.iam_cp1.M = sets[0].M;
                s1Data.iam_1_2 = s1Data.iam_1_2 || {};
                s1Data.iam_1_2.I = sets[0].I;
                s1Data.iam_1_2.A = sets[0].A;
                s1Data.iam_1_2.M = sets[0].M;
            } else {
                const inputI = document.getElementById("iam-cp1-i");
                const inputA = document.getElementById("iam-cp1-a");
                const inputM = document.getElementById("iam-cp1-m");
                s1Data.iam_cp1 = s1Data.iam_cp1 || {};
                s1Data.iam_cp1.I = inputI ? inputI.value.trim() : "";
                s1Data.iam_cp1.A = inputA ? inputA.value.trim() : "";
                s1Data.iam_cp1.M = inputM ? inputM.value.trim() : "";
            }
        } else if (cpType === "cp2") {
            const sets = s1Data.iam_cp2_sets || [];
            if (sets.length > 0) {
                s1Data.iam_cp2 = s1Data.iam_cp2 || {};
                s1Data.iam_cp2.I = sets[0].I;
                s1Data.iam_cp2.A = sets[0].A;
                s1Data.iam_cp2.M = sets[0].M;
                s1Data.iam_1_3 = s1Data.iam_1_3 || {};
                s1Data.iam_1_3.I = sets[0].I;
                s1Data.iam_1_3.A = sets[0].A;
                s1Data.iam_1_3.M = sets[0].M;
            } else {
                const inputI = document.getElementById("iam-cp2-i");
                const inputA = document.getElementById("iam-cp2-a");
                const inputM = document.getElementById("iam-cp2-m");
                s1Data.iam_cp2 = s1Data.iam_cp2 || {};
                s1Data.iam_cp2.I = inputI ? inputI.value.trim() : "";
                s1Data.iam_cp2.A = inputA ? inputA.value.trim() : "";
                s1Data.iam_cp2.M = inputM ? inputM.value.trim() : "";
            }
        }
    }

    function handleSaveIamSet(cpType) {
        const s1Data = learnerProgress.stageData["stage-1"] = learnerProgress.stageData["stage-1"] || {};
        const prefix = cpType === 'cp1' ? 'iam-cp1' : 'iam-cp2';
        const inputI = document.getElementById(`${prefix}-i`);
        const inputA = document.getElementById(`${prefix}-a`);
        const inputM = document.getElementById(`${prefix}-m`);
        const saveBtn = document.getElementById(`btn-${prefix}-save-set`);

        const valI = inputI ? inputI.value.trim() : "";
        const valA = inputA ? inputA.value.trim() : "";
        const valM = inputM ? inputM.value.trim() : "";

        if (!valI && !valA && !valM) {
            alert("Vui lòng nhập ít nhất 1 trong 3 ô (I, A hoặc M) trước khi lưu bộ mới.");
            if (inputI) inputI.focus();
            return;
        }

        const setsKey = cpType === 'cp1' ? 'iam_cp1_sets' : 'iam_cp2_sets';
        s1Data[setsKey] = s1Data[setsKey] || [];

        // Chống lưu trùng lặp cùng một bộ I•A•M (Deduplication Guard)
        const isDuplicate = s1Data[setsKey].some(s => (s.I || "").trim() === valI && (s.A || "").trim() === valA && (s.M || "").trim() === valM);
        if (isDuplicate) {
            if (saveBtn) {
                const oldContent = saveBtn.innerHTML;
                saveBtn.innerHTML = `<span>⚠️ Bộ này đã tồn tại!</span>`;
                setTimeout(() => { saveBtn.innerHTML = oldContent; }, 1500);
            }
            return;
        }

        const newSet = {
            id: `set_${cpType}_` + Date.now(),
            I: valI,
            A: valA,
            M: valM,
            createdAt: new Date().toISOString()
        };

        s1Data[setsKey].push(newSet);
        syncIamLegacy(cpType);

        // Reset ô nhập để học viên nhập tiếp bộ mới
        if (inputI) inputI.value = "";
        if (inputA) inputA.value = "";
        if (inputM) inputM.value = "";

        saveLearnerProgress();
        renderSyllabus();
        updateStage1Milestones();
        evaluateLearnerStatus();

        // Render lại danh sách
        const containerId = `${prefix}-saved-sets-list`;
        const counterId = `${prefix}-set-counter`;
        renderIamSetsCardList(containerId, counterId, s1Data[setsKey], cpType);
        updateDrawerIamHistory();

        // Feedback
        if (saveBtn) {
            const oldContent = saveBtn.innerHTML;
            saveBtn.innerHTML = `<span>✓ Đã lưu Bộ #${s1Data[setsKey].length}!</span>`;
            setTimeout(() => { saveBtn.innerHTML = oldContent; }, 1500);
        }
    }

    function handleClearIamInputs(cpType) {
        const prefix = cpType === 'cp1' ? 'iam-cp1' : 'iam-cp2';
        const inputI = document.getElementById(`${prefix}-i`);
        const inputA = document.getElementById(`${prefix}-a`);
        const inputM = document.getElementById(`${prefix}-m`);
        if (inputI) inputI.value = "";
        if (inputA) inputA.value = "";
        if (inputM) inputM.value = "";
        syncIamLegacy(cpType);
        debouncedSave();
    }

    // ==========================================
    // KHO LƯU TRỮ CỦA TÔI (4 TABS MODULAR VAULT)
    // ==========================================
    let activeVaultTab = "tab-iam";
    let lastVaultManualSync = 0;
    let vaultSyncTimer = null;

    function getVaultUserIdentity() {
        return (currentUser && (currentUser.identity || currentUser.email || currentUser.phone || currentUser.student_id)) || "guest";
    }

    function bindVaultCopyButtons(container) {
        if (!container) return;
        container.querySelectorAll(".btn-vault-copy-item").forEach(b => {
            b.onclick = (e) => {
                const targetBtn = e.currentTarget;
                const textToCopy = targetBtn.getAttribute("data-copy") || "";
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const original = targetBtn.textContent;
                    targetBtn.textContent = "✓ Đã copy";
                    setTimeout(() => { targetBtn.textContent = original; }, 1500);
                });
            };
        });
    }

    function renderVaultTabIam(container, progress) {
        const s1Data = (progress.stageData && progress.stageData["stage-1"]) || {};
        const cp1Sets = s1Data.iam_cp1_sets || [];
        const cp2Sets = s1Data.iam_cp2_sets || [];
        const s2Data = (progress.stageData && progress.stageData["stage-2"]) || {};
        const capstoneSets = s2Data.capstone_sets || [];
        const s2aData = (progress.stageData && (progress.stageData["stage-2a"] || progress.stageData["stage-2"])) || {};
        const habits2a = s2aData.habits || {};
        const s2bData = (progress.stageData && progress.stageData["stage-2b"]) || {};
        const habits2b = s2bData.habits || {};

        const habitEntries = [];
        const habitConfigs = [
            { key: "mindfulness", stage: "Chặng 2A", title: "Thói quen 1: Tỉnh Thức (Mindfulness & SBA)", icon: "🧘" },
            { key: "gratitude", stage: "Chặng 2A", title: "Thói quen 2: Biết Ơn (Gratitude)", icon: "🙏" },
            { key: "altruism", stage: "Chặng 2A", title: "Thói quen 3: Vị Nhân (Smart Giver)", icon: "🤝" },
            { key: "flow", stage: "Chặng 2B", title: "Thói quen 4: Phiêu (Flow)", icon: "🌊" },
            { key: "optimism", stage: "Chặng 2B", title: "Thói quen 5: Lạc Quan Thông Thái (Optimism)", icon: "☀️" }
        ];

        habitConfigs.forEach(cfg => {
            const hData = habits2a[cfg.key] || habits2b[cfg.key];
            if (hData && hData.iam && (hData.iam.I || hData.iam.A || hData.iam.M)) {
                habitEntries.push({ ...cfg, iam: hData.iam });
            }
        });

        const totalSavedSets = cp1Sets.length + cp2Sets.length + capstoneSets.length + habitEntries.length;
        const userId = getVaultUserIdentity();
        const quickNotes = localStorage.getItem(`dhm_quick_notes_${userId}`) || "";

        let html = `
            <!-- Tab 1 Header Overview -->
            <div class="p-3.5 rounded-xl bg-gradient-to-r from-brand-amber/15 via-brand-dark/60 to-brand-orange/15 border border-brand-amber/30 flex items-center justify-between">
                <div>
                    <h4 class="font-extrabold text-white text-xs flex items-center gap-1.5">
                        <span>📜</span> Đúc Kết I•A•M & Ghi Chú Nhanh
                    </h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Tổng hợp toàn bộ phản tư Chặng 1, Chặng 2 và sổ tay ghi chép.</p>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber text-[10px] font-bold border border-brand-amber/30">
                        ${totalSavedSets} bộ đã lưu
                    </span>
                </div>
            </div>

            <!-- CP1 Section -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                    <h5 class="font-bold text-brand-amber flex items-center gap-1.5 text-xs">
                        <span>🧭</span> Trạm 1: Nhận Thức & La Bàn Giá Trị (CP1)
                    </h5>
                    <span class="text-[11px] font-mono text-slate-400 font-semibold">${cp1Sets.length} bộ</span>
                </div>
                <div class="space-y-2">
        `;

        if (!cp1Sets.length) {
            html += `<div class="p-3 text-center text-[11px] text-slate-500 italic bg-brand-dark/40 rounded-xl border border-brand-border/40">Chưa có bộ phản tư nào tại Trạm 1.</div>`;
        } else {
            cp1Sets.forEach((s, idx) => {
                const copyText = `Bộ #${idx + 1} (Trạm 1 - CP1):\nI: ${s.I || ''}\nA: ${s.A || ''}\nM: ${s.M || ''}`;
                html += `
                    <div class="p-3 rounded-xl bg-brand-dark/60 border border-brand-border/70 space-y-2 text-[11px]">
                        <div class="flex items-center justify-between pb-1 border-b border-brand-border/40">
                            <span class="font-bold text-brand-amber">Bộ #${idx + 1}</span>
                            <button type="button" class="btn-vault-copy-item text-[10px] px-2 py-0.5 rounded bg-brand-card hover:bg-brand-border text-slate-300 cursor-pointer" data-copy="${escapeHtml(copyText)}">📋 Copy</button>
                        </div>
                        <div class="space-y-1">
                            <div><strong class="text-emerald-400">I (Insight):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.I || "—")}</span></div>
                            <div><strong class="text-sky-400">A (Action):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.A || "—")}</span></div>
                            <div><strong class="text-purple-400">M (Meaning):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.M || "—")}</span></div>
                        </div>
                    </div>
                `;
            });
        }
        html += `</div></div>`;

        // 5 Thói quen Hạnh Phúc (Chặng 2) Section
        if (habitEntries.length > 0) {
            html += `
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                        <h5 class="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                            <span>🌿</span> Phản Tư 5 Thói Quen Hạnh Phúc (Chặng 2)
                        </h5>
                        <span class="text-[11px] font-mono text-slate-400 font-semibold">${habitEntries.length} thói quen</span>
                    </div>
                    <div class="space-y-2">
            `;
            habitEntries.forEach(h => {
                const copyText = `${h.title} (${h.stage}):\nI: ${h.iam.I || ''}\nA: ${h.iam.A || ''}\nM: ${h.iam.M || ''}`;
                html += `
                    <div class="p-3 rounded-xl bg-brand-dark/60 border border-brand-border/70 space-y-2 text-[11px]">
                        <div class="flex items-center justify-between pb-1 border-b border-brand-border/40">
                            <span class="font-bold text-emerald-300 flex items-center gap-1">
                                <span>${h.icon}</span> <span>${escapeHtml(h.title)}</span>
                                <span class="text-[10px] px-1.5 py-0.2 rounded bg-brand-card text-slate-400 font-normal">(${h.stage})</span>
                            </span>
                            <button type="button" class="btn-vault-copy-item text-[10px] px-2 py-0.5 rounded bg-brand-card hover:bg-brand-border text-slate-300 cursor-pointer" data-copy="${escapeHtml(copyText)}">📋 Copy</button>
                        </div>
                        <div class="space-y-1">
                            <div><strong class="text-emerald-400">I (Insight):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(h.iam.I || "—")}</span></div>
                            <div><strong class="text-sky-400">A (Action):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(h.iam.A || "—")}</span></div>
                            <div><strong class="text-purple-400">M (Meaning):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(h.iam.M || "—")}</span></div>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        // CP2 Section (Chỉ hiển thị nếu học viên có dữ liệu lưu trữ lịch sử)
        if (cp2Sets.length > 0) {
            html += `
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                        <h5 class="font-bold text-sky-400 flex items-center gap-1.5 text-xs">
                            <span>🚀</span> Trạm 2: Đòn Bẩy Hạnh Phúc & Small Wins (Lưu trữ)
                        </h5>
                        <span class="text-[11px] font-mono text-slate-400 font-semibold">${cp2Sets.length} bộ</span>
                    </div>
                    <div class="space-y-2">
            `;
            cp2Sets.forEach((s, idx) => {
                const copyText = `Bộ #${idx + 1} (Trạm 2 - CP2):\nI: ${s.I || ''}\nA: ${s.A || ''}\nM: ${s.M || ''}`;
                html += `
                    <div class="p-3 rounded-xl bg-brand-dark/60 border border-brand-border/70 space-y-2 text-[11px]">
                        <div class="flex items-center justify-between pb-1 border-b border-brand-border/40">
                            <span class="font-bold text-sky-400">Bộ #${idx + 1}</span>
                            <button type="button" class="btn-vault-copy-item text-[10px] px-2 py-0.5 rounded bg-brand-card hover:bg-brand-border text-slate-300 cursor-pointer" data-copy="${escapeHtml(copyText)}">📋 Copy</button>
                        </div>
                        <div class="space-y-1">
                            <div><strong class="text-emerald-400">I (Insight):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.I || "—")}</span></div>
                            <div><strong class="text-sky-400">A (Action):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.A || "—")}</span></div>
                            <div><strong class="text-purple-400">M (Meaning):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.M || "—")}</span></div>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        // Chặng 2 Capstone Section if any
        if (capstoneSets.length > 0) {
            html += `
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                        <h5 class="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                            <span>🎓</span> Chặng 2: Capstone Hành Động Văn Hóa
                        </h5>
                        <span class="text-[11px] font-mono text-slate-400 font-semibold">${capstoneSets.length} bộ</span>
                    </div>
                    <div class="space-y-2">
            `;
            capstoneSets.forEach((s, idx) => {
                const copyText = `Bộ #${idx + 1} (Capstone):\nI: ${s.I || ''}\nA: ${s.A || ''}\nM: ${s.M || ''}`;
                html += `
                    <div class="p-3 rounded-xl bg-brand-dark/60 border border-brand-border/70 space-y-2 text-[11px]">
                        <div class="flex items-center justify-between pb-1 border-b border-brand-border/40">
                            <span class="font-bold text-amber-300">Bộ #${idx + 1}</span>
                            <button type="button" class="btn-vault-copy-item text-[10px] px-2 py-0.5 rounded bg-brand-card hover:bg-brand-border text-slate-300 cursor-pointer" data-copy="${escapeHtml(copyText)}">📋 Copy</button>
                        </div>
                        <div class="space-y-1">
                            <div><strong class="text-emerald-400">I (Insight):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.I || "—")}</span></div>
                            <div><strong class="text-sky-400">A (Action):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.A || "—")}</span></div>
                            <div><strong class="text-purple-400">M (Meaning):</strong> <span class="text-slate-200 whitespace-pre-wrap">${escapeHtml(s.M || "—")}</span></div>
                        </div>
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        // Quick Notes Snapshot
        html += `
            <div class="space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                    <h5 class="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                        <span>📝</span> Sổ Ghi Chú Nhanh (Quick Notes)
                    </h5>
                    ${quickNotes ? `<button type="button" class="btn-vault-copy-item text-[10px] px-2 py-0.5 rounded bg-brand-card hover:bg-brand-border text-slate-300 cursor-pointer" data-copy="${escapeHtml(quickNotes)}">📋 Copy ghi chú</button>` : ''}
                </div>
                <div class="p-3 rounded-xl bg-brand-dark/60 border border-brand-border/70 text-[11px] leading-relaxed">
                    ${quickNotes ? `<div class="text-slate-200 whitespace-pre-wrap">${escapeHtml(quickNotes)}</div>` : `<div class="text-center text-slate-500 italic">Chưa có ghi chú nào được lưu trong Sổ Ghi Chú Nhanh. Bạn có thể nhấn nút 📝 tròn ở góc phải dưới màn hình (hoặc phím tắt Ctrl+J) để mở sổ ghi chép bất cứ lúc nào.</div>`}
                </div>
            </div>
        `;

        container.innerHTML = html;
        bindVaultCopyButtons(container);
    }

    function renderVaultTabValues(container, progress) {
        const s1Data = (progress.stageData && progress.stageData["stage-1"]) || {};
        const selectedValues = s1Data.selectedValues || [];
        const score = (s1Data.score !== undefined && s1Data.score !== null) ? s1Data.score : null;
        const passed = !!s1Data.passed;
        const quizAttempts = s1Data.quizAttempts || 0;
        const totalQ = (typeof quizQuestions !== "undefined" && Array.isArray(quizQuestions)) ? quizQuestions.length : 10;

        let html = `
            <!-- Tab 2 Header Overview -->
            <div class="p-3.5 rounded-xl bg-gradient-to-r from-sky-500/15 via-brand-dark/60 to-brand-amber/15 border border-sky-500/30 flex items-center justify-between">
                <div>
                    <h4 class="font-extrabold text-white text-xs flex items-center gap-1.5">
                        <span>🧭</span> La Bàn Giá Trị & Cổng Sát Hạch
                    </h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Top 7 Me Values bản sắc và chứng chỉ sát hạch Chặng 1.</p>
                </div>
                <span class="px-2 py-0.5 rounded-full ${passed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700/50 text-slate-400 border-slate-600/40'} text-[10px] font-bold border">
                    ${passed ? '✓ Đã Vượt Cổng' : 'Chưa Vượt Cổng'}
                </span>
            </div>

            <!-- Top 7 Me Values -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                    <h5 class="font-bold text-brand-amber flex items-center gap-1.5 text-xs">
                        <span>💎</span> Top 7 Giá Trị Bản Thân (Me Values DNA)
                    </h5>
                    <span class="text-[11px] font-mono text-slate-400 font-semibold">${selectedValues.length}/7 giá trị</span>
                </div>
        `;

        if (!selectedValues.length) {
            html += `<div class="p-3 text-center text-[11px] text-slate-500 italic bg-brand-dark/40 rounded-xl border border-brand-border/40">Chưa hoàn tất chọn 7 Giá Trị Bản Thân tại Trạm 1.</div>`;
        } else {
            html += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">`;
            selectedValues.forEach((val, idx) => {
                html += `
                    <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-brand-border/70 flex items-center gap-2.5">
                        <span class="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-orange to-brand-amber text-black font-extrabold flex items-center justify-center text-[11px] shrink-0">
                            ${idx + 1}
                        </span>
                        <span class="font-semibold text-slate-200 text-xs">${escapeHtml(val)}</span>
                    </div>
                `;
            });
            html += `</div>`;
        }
        html += `</div>`;

        // Quiz Qualifying Gate
        html += `
            <div class="space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                    <h5 class="font-bold text-sky-400 flex items-center gap-1.5 text-xs">
                        <span>🎓</span> Kết Quả Cổng Sát Hạch Chặng 1 (Qualifying Gate)
                    </h5>
                    <span class="text-[11px] font-mono text-slate-400 font-semibold">${quizAttempts} lần thi</span>
                </div>

                <div class="p-4 rounded-xl ${passed ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-brand-dark/60 border-brand-border/70'} border space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <span class="text-2xl">${passed ? '🏅' : '⏳'}</span>
                            <div>
                                <div class="font-bold text-white text-xs">${passed ? 'ĐÃ VƯỢT QUA CỔNG SÁT HẠCH' : 'CHƯA ĐẠT CHUẨN ĐẦU RA'}</div>
                                <div class="text-[11px] text-slate-400">Yêu cầu tối thiểu: 80% (8/${totalQ} câu đúng)</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-black font-mono ${passed ? 'text-emerald-400' : (score !== null ? 'text-rose-400' : 'text-slate-500')}">
                                ${score !== null ? `${score}%` : 'Chưa thi'}
                            </div>
                            <div class="text-[10px] text-slate-400">${score !== null ? `${Math.round(score * totalQ / 100)}/${totalQ} câu đúng` : '—'}</div>
                        </div>
                    </div>

                    ${passed ? `
                        <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                            <span>✓</span> Bạn đã đủ điều kiện tốt nghiệp Pre-class và được mở khóa tham gia Workshop Offline Chặng 2.
                        </div>
                    ` : `
                        <div class="p-2.5 rounded-lg bg-brand-dark/80 border border-brand-border/60 text-[11px] text-slate-400 flex items-center gap-2">
                            <span>ℹ️</span> Hoàn thành bài trắc nghiệm ở cuối Chặng 1 đạt từ 80% trở lên để mở khóa quyền tham gia Chặng 2.
                        </div>
                    `}
                </div>
            </div>
        `;

        container.innerHTML = html;
        bindVaultCopyButtons(container);
    }

    function renderVaultTabHabits(container, progress) {
        const s3Data = (progress.stageData && progress.stageData["stage-3"]) || {};
        const habitTracker = s3Data.habitTracker || {};
        const streakInfo = (typeof calculateStage3Streak === "function") 
            ? calculateStage3Streak(habitTracker) 
            : { currentStreak: 0, longestStreak: 0, totalCompletedDays: 0, completedDaysSet: new Set() };
        const completedStages = progress.completedStages || [];
        const habitKeys = ["mindfulness", "gratitude", "optimism", "flow", "altruism"];

        let html = `
            <!-- Tab 3 Header Overview -->
            <div class="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-brand-dark/60 to-brand-amber/15 border border-emerald-500/30 flex items-center justify-between">
                <div>
                    <h4 class="font-extrabold text-white text-xs flex items-center gap-1.5">
                        <span>🎯</span> Thói Quen 21 Ngày & Bộ Huy Hiệu
                    </h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Theo dõi chuỗi kiên trì luyện tập và các cột mốc danh dự.</p>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    🔥 Chuỗi: ${streakInfo.currentStreak} ngày
                </span>
            </div>

            <!-- Streak Metrics -->
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-brand-border/70">
                    <div class="text-[10px] text-slate-400">Chuỗi hiện tại</div>
                    <div class="text-base font-black text-brand-amber font-mono mt-0.5">🔥 ${streakInfo.currentStreak}</div>
                </div>
                <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-brand-border/70">
                    <div class="text-[10px] text-slate-400">Kỷ lục dài nhất</div>
                    <div class="text-base font-black text-sky-400 font-mono mt-0.5">⭐ ${streakInfo.longestStreak}</div>
                </div>
                <div class="p-2.5 rounded-xl bg-brand-dark/60 border border-brand-border/70">
                    <div class="text-[10px] text-slate-400">Tổng ngày đạt</div>
                    <div class="text-base font-black text-emerald-400 font-mono mt-0.5">✓ ${streakInfo.totalCompletedDays}/21</div>
                </div>
            </div>

            <!-- Mini Heatmap 21 Days (7x3 grid) -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                    <h5 class="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                        <span>📅</span> Bản Đồ Nhiệt 21 Ngày (Mini-Heatmap)
                    </h5>
                    <div class="flex items-center gap-1 text-[9px] text-slate-400">
                        <span>Ít</span>
                        <span class="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span>
                        <span class="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800"></span>
                        <span class="w-2.5 h-2.5 rounded bg-emerald-700 border border-emerald-500"></span>
                        <span class="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-300"></span>
                        <span>Nhiều</span>
                    </div>
                </div>

                <div class="grid grid-cols-7 gap-1.5 p-3 rounded-xl bg-brand-dark/60 border border-brand-border/70">
        `;

        for (let d = 1; d <= 21; d++) {
            const dayData = (habitTracker && habitTracker[`day_${d}`]) || {};
            const doneCount = habitKeys.filter(k => !!dayData[k]).length;
            let cellClass = "bg-slate-800/80 text-slate-500 border-slate-700/50";
            if (doneCount === 5) {
                cellClass = "bg-emerald-500 text-black font-extrabold border-emerald-300 shadow-sm";
            } else if (doneCount >= 3) {
                cellClass = "bg-emerald-700 text-emerald-100 font-bold border-emerald-500";
            } else if (doneCount >= 1) {
                cellClass = "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
            }

            html += `
                <div class="aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${cellClass}" title="Ngày ${d}: ${doneCount}/5 thói quen">
                    <span class="text-[10px] font-mono">${d}</span>
                    <span class="text-[8px] opacity-80">${doneCount}/5</span>
                </div>
            `;
        }

        html += `
                </div>
            </div>

            <!-- Badges Gallery -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between pb-1 border-b border-brand-border/60">
                    <h5 class="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                        <span>🏆</span> Bộ Huy Hiệu Hành Trình Hạnh Phúc
                    </h5>
                    <span class="text-[11px] font-mono text-slate-400 font-semibold">
                        ${[completedStages.includes("stage-1"), completedStages.includes("stage-2"), completedStages.includes("stage-3"), (streakInfo.longestStreak >= 7 || streakInfo.totalCompletedDays >= 14)].filter(Boolean).length}/4 mở khóa
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <!-- Badge 1 -->
                    <div class="p-3 rounded-xl ${completedStages.includes('stage-1') ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-brand-dark/40 border-brand-border/50 text-slate-500 opacity-60'} border flex items-center gap-2.5">
                        <span class="text-2xl">${completedStages.includes('stage-1') ? '🧭' : '🔒'}</span>
                        <div>
                            <div class="font-bold text-xs text-white">Người Định Hướng</div>
                            <div class="text-[10px] text-slate-400">Hoàn thành Chặng 1</div>
                        </div>
                    </div>
                    <!-- Badge 2 -->
                    <div class="p-3 rounded-xl ${completedStages.includes('stage-2') ? 'bg-orange-500/15 border-orange-500/40 text-orange-300' : 'bg-brand-dark/40 border-brand-border/50 text-slate-500 opacity-60'} border flex items-center gap-2.5">
                        <span class="text-2xl">${completedStages.includes('stage-2') ? '🔥' : '🔒'}</span>
                        <div>
                            <div class="font-bold text-xs text-white">Người Thắp Lửa</div>
                            <div class="text-[10px] text-slate-400">Hoàn thành Chặng 2</div>
                        </div>
                    </div>
                    <!-- Badge 3 -->
                    <div class="p-3 rounded-xl ${completedStages.includes('stage-3') ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : 'bg-brand-dark/40 border-brand-border/50 text-slate-500 opacity-60'} border flex items-center gap-2.5">
                        <span class="text-2xl">${completedStages.includes('stage-3') ? '🌟' : '🔒'}</span>
                        <div>
                            <div class="font-bold text-xs text-white">Đại Sứ Hạnh Phúc</div>
                            <div class="text-[10px] text-slate-400">Hoàn thành Chặng 3</div>
                        </div>
                    </div>
                    <!-- Badge 4 -->
                    <div class="p-3 rounded-xl ${(streakInfo.longestStreak >= 7 || streakInfo.totalCompletedDays >= 14) ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' : 'bg-brand-dark/40 border-brand-border/50 text-slate-500 opacity-60'} border flex items-center gap-2.5">
                        <span class="text-2xl">${(streakInfo.longestStreak >= 7 || streakInfo.totalCompletedDays >= 14) ? '🛡️' : '🔒'}</span>
                        <div>
                            <div class="font-bold text-xs text-white">Chiến Binh Kiên Trì</div>
                            <div class="text-[10px] text-slate-400">Chuỗi >= 7 ngày</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        bindVaultCopyButtons(container);
    }

    function renderVaultTabSync(container, progress) {
        const userId = getVaultUserIdentity();
        const lastSyncRaw = localStorage.getItem(`dhm_telemetry_last_sync_time_${userId}`);
        let lastSyncFormatted = "Chưa có thông tin đồng bộ";
        if (lastSyncRaw) {
            const dateObj = new Date(parseInt(lastSyncRaw, 10));
            if (!isNaN(dateObj.getTime())) {
                lastSyncFormatted = dateObj.toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
            }
        }

        let html = `
            <!-- Tab 4 Header Overview -->
            <div class="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/15 via-brand-dark/60 to-brand-amber/15 border border-purple-500/30 flex items-center justify-between">
                <div>
                    <h4 class="font-extrabold text-white text-xs flex items-center gap-1.5">
                        <span>📦</span> Xuất Báo Cáo & Đồng Bộ Đám Mây
                    </h4>
                    <p class="text-[11px] text-slate-400 mt-0.5">Sao chép kho lưu trữ Markdown và kích hoạt đồng bộ dữ liệu.</p>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    Markdown Ready
                </span>
            </div>

            <!-- Export Full Markdown Card -->
            <div class="p-4 rounded-xl bg-brand-dark/60 border border-brand-border/70 space-y-3">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">📋</span>
                    <div>
                        <div class="font-bold text-white text-xs">Xuất Toàn Bộ Kho Dữ Liệu Học Tập (Markdown)</div>
                        <div class="text-[11px] text-slate-400">Gom trọn vẹn cả 4 Tabs (I•A•M, Me Values, Quiz, Thói quen 21 ngày & Huy hiệu) để dán vào Obsidian/Notion.</div>
                    </div>
                </div>
                <button id="btn-vault-copy-all-tab" type="button" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-amber to-brand-orange text-black font-extrabold text-xs shadow hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span>📋</span> Sao Chép Toàn Bộ (Markdown)
                </button>
            </div>

            <!-- Sync Telemetry Card with Throttle 60s -->
            <div class="p-4 rounded-xl bg-brand-dark/60 border border-brand-border/70 space-y-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">☁️</span>
                        <div>
                            <div class="font-bold text-white text-xs">Đồng Bộ Đám Mây (Google Sheets)</div>
                            <div class="text-[11px] text-slate-400">Lần cuối: <span class="font-mono text-emerald-400 font-semibold" id="vault-last-sync-time">${escapeHtml(lastSyncFormatted)}</span></div>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <button id="btn-vault-manual-sync" type="button" class="w-full py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-border text-slate-200 border border-brand-border/80 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <span>🔄</span> Đồng Bộ Ngay
                    </button>
                    <div id="vault-sync-status-msg" class="text-[10px] text-center text-slate-400 italic min-h-[16px]"></div>
                </div>
            </div>

            <!-- Storage Persistence Notice -->
            <div class="p-3 rounded-xl bg-brand-dark/40 border border-brand-border/50 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                <div class="font-bold text-slate-300 flex items-center gap-1.5">
                    <span>🛡️</span> Cơ chế bảo vệ & lưu trữ dữ liệu
                </div>
                <div>
                    • Tiến độ của bạn được lưu tự động trên thiết bị này theo tài khoản học viên.<br>
                    • Khi có kết nối mạng, hệ thống tự động đồng bộ ngầm định kỳ về CSDL trung tâm.<br>
                    • Nút "Đồng Bộ Ngay" có cơ chế đệm an toàn 60 giây để tránh làm nghẽn hạ tầng.
                </div>
            </div>
        `;

        container.innerHTML = html;
        bindVaultCopyButtons(container);

        // Bind Tab 4 specific buttons
        const copyAllBtn = container.querySelector("#btn-vault-copy-all-tab");
        if (copyAllBtn) {
            copyAllBtn.onclick = () => {
                copyAllVaultMarkdown(copyAllBtn);
            };
        }

        const syncBtn = container.querySelector("#btn-vault-manual-sync");
        const statusMsg = container.querySelector("#vault-sync-status-msg");
        if (syncBtn) {
            updateVaultSyncButtonState(syncBtn, statusMsg);
            syncBtn.onclick = () => {
                handleVaultManualSync(syncBtn, statusMsg);
            };
        }
    }

    function generateFullVaultMarkdown(progress) {
        const s1Data = (progress.stageData && progress.stageData["stage-1"]) || {};
        const cp1Sets = s1Data.iam_cp1_sets || [];
        const cp2Sets = s1Data.iam_cp2_sets || [];
        const s2Data = (progress.stageData && progress.stageData["stage-2"]) || {};
        const capstoneSets = s2Data.capstone_sets || [];
        const s2aData = (progress.stageData && (progress.stageData["stage-2a"] || progress.stageData["stage-2"])) || {};
        const habits2a = s2aData.habits || {};
        const s2bData = (progress.stageData && progress.stageData["stage-2b"]) || {};
        const habits2b = s2bData.habits || {};

        const habitEntries = [];
        const habitConfigs = [
            { key: "mindfulness", stage: "Chặng 2A", title: "Thói quen 1: Tỉnh Thức (Mindfulness & SBA)" },
            { key: "gratitude", stage: "Chặng 2A", title: "Thói quen 2: Biết Ơn (Gratitude)" },
            { key: "altruism", stage: "Chặng 2A", title: "Thói quen 3: Vị Nhân (Smart Giver)" },
            { key: "flow", stage: "Chặng 2B", title: "Thói quen 4: Phiêu (Flow)" },
            { key: "optimism", stage: "Chặng 2B", title: "Thói quen 5: Lạc Quan Thông Thái (Optimism)" }
        ];

        habitConfigs.forEach(cfg => {
            const hData = habits2a[cfg.key] || habits2b[cfg.key];
            if (hData && hData.iam && (hData.iam.I || hData.iam.A || hData.iam.M)) {
                habitEntries.push({ ...cfg, iam: hData.iam });
            }
        });

        const selectedValues = s1Data.selectedValues || [];
        const score = (s1Data.score !== undefined && s1Data.score !== null) ? s1Data.score : null;
        const passed = !!s1Data.passed;
        const quizAttempts = s1Data.quizAttempts || 0;
        const s3Data = (progress.stageData && progress.stageData["stage-3"]) || {};
        const habitTracker = s3Data.habitTracker || {};
        const streakInfo = (typeof calculateStage3Streak === "function")
            ? calculateStage3Streak(habitTracker)
            : { currentStreak: 0, longestStreak: 0, totalCompletedDays: 0 };
        const completedStages = progress.completedStages || [];
        const userId = getVaultUserIdentity();
        const quickNotes = localStorage.getItem(`dhm_quick_notes_${userId}`) || "";
        const learnerName = (currentUser && (currentUser.full_name || currentUser.name)) || "Học viên";
        const todayStr = new Date().toLocaleDateString("vi-VN");

        let md = `# KHO LƯU TRỮ CỦA TÔI — DELIVERING HAPPINESS MODEL\n`;
        md += `> **Học viên:** ${learnerName} | **Mã định danh:** ${userId} | **Ngày xuất:** ${todayStr}\n\n`;

        md += `## 1. 📜 ĐÚC KẾT I•A•M & GHI CHÚ NHANH\n\n`;
        md += `### Trạm 1: Nhận Thức & La Bàn Giá Trị (CP1)\n`;
        if (!cp1Sets.length) {
            md += `*(Chưa có bộ lưu)*\n\n`;
        } else {
            cp1Sets.forEach((s, i) => {
                md += `#### Bộ #${i + 1}:\n- **I (Insight):** ${s.I || '—'}\n- **A (Action):** ${s.A || '—'}\n- **M (Meaning):** ${s.M || '—'}\n\n`;
            });
        }

        if (habitEntries.length > 0) {
            md += `### Phản Tư 5 Thói Quen Hạnh Phúc (Chặng 2)\n`;
            habitEntries.forEach((h, i) => {
                md += `#### ${h.title} (${h.stage}):\n- **I (Insight):** ${h.iam.I || '—'}\n- **A (Action):** ${h.iam.A || '—'}\n- **M (Meaning):** ${h.iam.M || '—'}\n\n`;
            });
        }

        if (cp2Sets.length > 0) {
            md += `### Trạm 2: Đòn Bẩy Hạnh Phúc & Small Wins (Lưu trữ)\n`;
            cp2Sets.forEach((s, i) => {
                md += `#### Bộ #${i + 1}:\n- **I (Insight):** ${s.I || '—'}\n- **A (Action):** ${s.A || '—'}\n- **M (Meaning):** ${s.M || '—'}\n\n`;
            });
        }

        if (capstoneSets.length > 0) {
            md += `### Chặng 2: Capstone Hành Động Văn Hóa\n`;
            capstoneSets.forEach((s, i) => {
                md += `#### Bộ #${i + 1}:\n- **I (Insight):** ${s.I || '—'}\n- **A (Action):** ${s.A || '—'}\n- **M (Meaning):** ${s.M || '—'}\n\n`;
            });
        }

        md += `### Sổ Ghi Chú Nhanh\n`;
        md += quickNotes ? `${quickNotes}\n\n` : `*(Trống)*\n\n`;

        md += `---\n\n`;
        md += `## 2. 🧭 LA BÀN GIÁ TRỊ & CỔNG SÁT HẠCH\n\n`;
        md += `### Top 7 Me Values (DNA Cá Nhân)\n`;
        if (!selectedValues.length) {
            md += `*(Chưa chọn)*\n\n`;
        } else {
            selectedValues.forEach((val, i) => {
                md += `${i + 1}. **${val}**\n`;
            });
            md += `\n`;
        }

        md += `### Cổng Sát Hạch Chặng 1\n`;
        md += `- **Điểm số:** ${score !== null ? `${score}%` : 'Chưa thi'}\n`;
        md += `- **Trạng thái:** ${passed ? '✓ ĐÃ VƯỢT QUA' : 'CHƯA ĐẠT CHUẨN'}\n`;
        md += `- **Số lần thi:** ${quizAttempts}\n\n`;

        md += `---\n\n`;
        md += `## 3. 🎯 THÓI QUEN 21 NGÀY & HUY HIỆU\n\n`;
        md += `### Chuỗi Thói Quen (21 Days Habit Streak)\n`;
        md += `- **Chuỗi ngày hiện tại:** ${streakInfo.currentStreak} ngày 🔥\n`;
        md += `- **Kỷ lục chuỗi dài nhất:** ${streakInfo.longestStreak} ngày ⭐\n`;
        md += `- **Tổng số ngày hoàn thành:** ${streakInfo.totalCompletedDays}/21 ngày\n\n`;

        md += `### Bộ Huy Hiệu Hành Trình\n`;
        md += `- [${completedStages.includes('stage-1') ? 'x' : ' '}] 🧭 Người Định Hướng (Hoàn thành Chặng 1)\n`;
        md += `- [${completedStages.includes('stage-2') ? 'x' : ' '}] 🔥 Người Thắp Lửa (Hoàn thành Chặng 2)\n`;
        md += `- [${completedStages.includes('stage-3') ? 'x' : ' '}] 🌟 Đại Sứ Hạnh Phúc (Hoàn thành Chặng 3)\n`;
        md += `- [${(streakInfo.longestStreak >= 7 || streakInfo.totalCompletedDays >= 14) ? 'x' : ' '}] 🛡️ Chiến Binh Kiên Trì (Chuỗi >= 7 ngày)\n\n`;

        return md;
    }

    function copyAllVaultMarkdown(btn) {
        const md = generateFullVaultMarkdown(learnerProgress);
        navigator.clipboard.writeText(md).then(() => {
            if (btn) {
                const old = btn.innerHTML;
                btn.innerHTML = `<span>✓</span> Đã sao chép toàn bộ!`;
                setTimeout(() => { btn.innerHTML = old; }, 2000);
            }
        });
    }

    function updateVaultSyncButtonState(btn, statusMsg) {
        const now = Date.now();
        const remainMs = 60000 - (now - lastVaultManualSync);
        if (remainMs > 0) {
            const remainSec = Math.ceil(remainMs / 1000);
            btn.disabled = true;
            btn.classList.add("opacity-50", "cursor-not-allowed");
            btn.innerHTML = `<span>⏳</span> Đồng bộ lại sau (${remainSec}s)`;
            if (statusMsg) statusMsg.textContent = `Vui lòng chờ ${remainSec}s trước khi kích hoạt đồng bộ tiếp theo.`;

            if (!vaultSyncTimer) {
                vaultSyncTimer = setInterval(() => {
                    const curRemain = Math.ceil((60000 - (Date.now() - lastVaultManualSync)) / 1000);
                    if (curRemain <= 0) {
                        clearInterval(vaultSyncTimer);
                        vaultSyncTimer = null;
                        btn.disabled = false;
                        btn.classList.remove("opacity-50", "cursor-not-allowed");
                        btn.innerHTML = `<span>🔄</span> Đồng Bộ Ngay`;
                        if (statusMsg) statusMsg.textContent = "";
                    } else {
                        btn.innerHTML = `<span>⏳</span> Đồng bộ lại sau (${curRemain}s)`;
                        if (statusMsg) statusMsg.textContent = `Vui lòng chờ ${curRemain}s trước khi kích hoạt đồng bộ tiếp theo.`;
                    }
                }, 1000);
            }
        } else {
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
            btn.innerHTML = `<span>🔄</span> Đồng Bộ Ngay`;
            if (statusMsg) statusMsg.textContent = "";
        }
    }

    function handleVaultManualSync(btn, statusMsg) {
        const now = Date.now();
        if (now - lastVaultManualSync < 60000) {
            updateVaultSyncButtonState(btn, statusMsg);
            return;
        }
        lastVaultManualSync = now;
        btn.disabled = true;
        btn.innerHTML = `<span>🔄</span> Đang đồng bộ...`;
        if (statusMsg) statusMsg.textContent = "Đang gửi tín hiệu telemetry đồng bộ lên máy chủ...";

        if (typeof triggerAutoTelemetryOnBoot === "function") {
            triggerAutoTelemetryOnBoot();
        }

        setTimeout(() => {
            const userId = getVaultUserIdentity();
            localStorage.setItem(`dhm_telemetry_last_sync_time_${userId}`, String(Date.now()));
            const timeEl = document.getElementById("vault-last-sync-time");
            if (timeEl) {
                timeEl.textContent = new Date().toLocaleString("vi-VN", {
                    hour: "2-digit", minute: "2-digit", second: "2-digit", day: "2-digit", month: "2-digit", year: "numeric"
                });
            }
            if (statusMsg) statusMsg.textContent = "✓ Đã gửi yêu cầu đồng bộ thành công!";
            updateVaultSyncButtonState(btn, statusMsg);
        }, 1200);
    }

    const vaultTabRenderers = {
        "tab-iam": renderVaultTabIam,
        "tab-values": renderVaultTabValues,
        "tab-habits": renderVaultTabHabits,
        "tab-sync": renderVaultTabSync
    };

    function updateVaultTabHeaders() {
        document.querySelectorAll(".vault-tab-btn").forEach(btn => {
            const tabId = btn.getAttribute("data-tab");
            const isSelected = (tabId === activeVaultTab);
            btn.setAttribute("aria-selected", isSelected ? "true" : "false");
            if (isSelected) {
                btn.className = "vault-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer bg-brand-amber text-black shadow-sm";
            } else {
                btn.className = "vault-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white hover:bg-brand-card";
            }
        });
    }

    function switchVaultTab(tabId) {
        if (!vaultTabRenderers[tabId]) tabId = "tab-iam";
        activeVaultTab = tabId;
        updateVaultTabHeaders();
        const contentEl = document.getElementById("vault-tab-content");
        if (contentEl) {
            contentEl.innerHTML = ""; // Lazy Tab Rendering: chống DOM bloat
            vaultTabRenderers[tabId](contentEl, learnerProgress);
        }
    }

    function updateDrawerIamHistory() {
        switchVaultTab(activeVaultTab);
    }

    function initIamDrawer() {
        const btnOpen = document.getElementById("btn-iam-history");
        const drawer = document.getElementById("iam-history-drawer");
        const btnClose = document.getElementById("btn-close-iam-drawer");
        const btnDismiss = document.getElementById("btn-dismiss-iam-drawer");
        const backdrop = document.getElementById("iam-drawer-backdrop");
        const btnCopyAll = document.getElementById("btn-copy-all-iam");

        if (btnOpen) {
            btnOpen.onclick = () => {
                if (drawer) {
                    updateDrawerIamHistory();
                    drawer.classList.remove("hidden");
                }
            };
        }

        const closeDrawer = () => {
            if (drawer) drawer.classList.add("hidden");
        };

        if (btnClose) btnClose.onclick = closeDrawer;
        if (btnDismiss) btnDismiss.onclick = closeDrawer;
        if (backdrop) backdrop.onclick = closeDrawer;

        // Bind 4 Tabs buttons in Tab Bar
        document.querySelectorAll(".vault-tab-btn").forEach(btn => {
            btn.onclick = () => {
                const tabId = btn.getAttribute("data-tab");
                if (tabId) switchVaultTab(tabId);
            };
        });

        if (btnCopyAll) {
            btnCopyAll.onclick = () => {
                copyAllVaultMarkdown(btnCopyAll);
            };
        }
    }

    // 14B.2 FLOATING QUICK NOTE FAB (DEBOUNCED 400MS)
    function initQuickNoteFab() {
        const fabBtn = document.getElementById("btn-quick-note-fab");
        const popup = document.getElementById("quick-note-popup");
        const closeBtn = document.getElementById("btn-close-quick-note");
        const textarea = document.getElementById("quick-note-textarea");
        const stageBadge = document.getElementById("quick-note-stage-badge");
        const saveStatus = document.getElementById("quick-note-save-status");
        const copyBtn = document.getElementById("btn-quick-note-copy");
        const clearBtn = document.getElementById("btn-quick-note-clear");
        const toIamBtn = document.getElementById("btn-quick-note-to-iam");

        if (!fabBtn || !popup || !textarea) return;

        function getStorageKey() {
            const id = (currentUser && (currentUser.identity || currentUser.email)) || "guest";
            return `dhm_quick_notes_${id}`;
        }

        function updateStageBadge() {
            if (!stageBadge) return;
            const stageName = currentStageIndex === 0 
                ? "Chặng 1 · Online Pre-Class" 
                : currentStageIndex === 1 
                    ? "Chặng 2 · Offline Workshop" 
                    : "Chặng 3 · Tiếp Nối Hành Trình Hạnh Phúc";
            stageBadge.textContent = `📍 Đang học: ${stageName}`;
        }

        function loadNote() {
            const key = getStorageKey();
            const saved = localStorage.getItem(key) || "";
            textarea.value = saved;
            if (saveStatus) {
                saveStatus.textContent = saved ? "Đã lưu" : "";
            }
        }
        loadNote();

        function toggleQuickNote() {
            const isHidden = popup.classList.contains("hidden");
            if (isHidden) {
                popup.classList.remove("hidden");
                loadNote();
                updateStageBadge();
                textarea.focus();
            } else {
                popup.classList.add("hidden");
            }
        }

        fabBtn.onclick = toggleQuickNote;
        if (closeBtn) closeBtn.onclick = () => popup.classList.add("hidden");

        // Global shortcut Ctrl+J or Cmd+J
        window.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === "j" || e.key === "J")) {
                e.preventDefault();
                toggleQuickNote();
            }
        });

        // Debounced 400ms auto-save
        let saveTimeout = null;
        textarea.addEventListener("input", () => {
            if (saveStatus) saveStatus.textContent = "⏳ Đang lưu...";
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const key = getStorageKey();
                localStorage.setItem(key, textarea.value);
                if (saveStatus) {
                    const now = new Date();
                    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    saveStatus.textContent = `✓ Đã lưu (${timeStr})`;
                }
            }, 400);
        });

        // Copy note
        if (copyBtn) {
            copyBtn.onclick = () => {
                const val = textarea.value.trim();
                if (!val) return;
                navigator.clipboard.writeText(val).then(() => {
                    const old = copyBtn.innerHTML;
                    copyBtn.innerHTML = "<span>✓</span> Copy";
                    setTimeout(() => { copyBtn.innerHTML = old; }, 1500);
                });
            };
        }

        // Clear note
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (!textarea.value.trim()) return;
                if (confirm("Bạn có chắc chắn muốn xóa nội dung ghi chú nhanh này không?")) {
                    textarea.value = "";
                    const key = getStorageKey();
                    localStorage.removeItem(key);
                    if (saveStatus) saveStatus.textContent = "Đã xóa";
                }
            };
        }

        // Insert into active IAM
        if (toIamBtn) {
            toIamBtn.onclick = () => {
                const val = textarea.value.trim();
                if (!val) {
                    alert("Ghi chú đang trống, vui lòng nhập nội dung trước khi chèn.");
                    textarea.focus();
                    return;
                }

                // Check active view/station for IAM insertion target
                const driversPanel = document.getElementById("habit-panel-drivers");
                const isDriversActive = driversPanel && !driversPanel.classList.contains("hidden");
                let targetInputId = "iam-cp1-i";
                let label = "CP1";
                if (isDriversActive) {
                    targetInputId = "iam-drivers-i";
                    label = "Trạm 0";
                } else if (!document.getElementById("stage-1")?.classList.contains("hidden")) {
                    targetInputId = "iam-cp1-i";
                    label = "CP1";
                }

                const targetInput = document.getElementById(targetInputId);
                if (targetInput) {
                    if (targetInputId === "iam-cp1-i") {
                        openAccordionModule("stage1-mod-cp1");
                    }
                    const oldVal = targetInput.value.trim();
                    targetInput.value = oldVal ? `${oldVal}\n${val}` : val;

                    // Dispatch input event for listeners
                    targetInput.dispatchEvent(new Event("input", { bubbles: true }));

                    targetInput.focus();
                    targetInput.scrollIntoView({ behavior: "smooth", block: "center" });

                    const oldBtnText = toIamBtn.innerHTML;
                    toIamBtn.innerHTML = `<span>✓ Đã chèn vào ${label}!</span>`;
                    setTimeout(() => { toIamBtn.innerHTML = oldBtnText; }, 2000);
                }
            };
        }
    }

    // 14B.3 CONTACT CULTURECODE MODAL
    function initContactCulturecodeModal() {
        const modal = document.getElementById("culturecode-contact-modal");
        const openBtn = document.getElementById("btn-open-contact-culturecode");
        const closeBtn = document.getElementById("btn-close-culturecode-contact");
        const cancelBtn = document.getElementById("btn-cancel-contact");
        const nameInput = document.getElementById("contact-sender-name");
        const emailInput = document.getElementById("contact-sender-email");
        const subjectInput = document.getElementById("contact-subject");
        const messageInput = document.getElementById("contact-message");
        const statusMsg = document.getElementById("contact-status-msg");
        const sendBtn = document.getElementById("btn-send-contact");
        const sendBtnText = document.getElementById("btn-send-contact-text");
        const mailtoFallback = document.getElementById("btn-contact-mailto-fallback");
        const topicChips = document.querySelectorAll(".contact-topic-chip");

        if (!modal) return;

        function updateMailtoLink() {
            if (!mailtoFallback) return;
            const subj = subjectInput ? subjectInput.value.trim() : "";
            const msg = messageInput ? messageInput.value.trim() : "";
            const sender = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";

            let bodyText = msg;
            if (sender || email) {
                bodyText += `\n\n---\nNgười gửi: ${sender} (${email})`;
            }
            mailtoFallback.href = `mailto:culturecodeproject@gmail.com?subject=${encodeURIComponent(subj || "[Liên hệ DHM LMS]")}&body=${encodeURIComponent(bodyText)}`;
        }

        function openModal() {
            modal.classList.remove("hidden");
            if (statusMsg) statusMsg.classList.add("hidden");

            if (currentUser) {
                if (nameInput && !nameInput.value) {
                    nameInput.value = currentUser.full_name || currentUser.name || "";
                }
                if (emailInput && !emailInput.value) {
                    emailInput.value = currentUser.email || "";
                }
            }
            updateMailtoLink();
        }

        function closeModal() {
            modal.classList.add("hidden");
        }

        if (openBtn) openBtn.onclick = openModal;
        if (closeBtn) closeBtn.onclick = closeModal;
        if (cancelBtn) cancelBtn.onclick = closeModal;

        if (subjectInput) subjectInput.addEventListener("input", updateMailtoLink);
        if (messageInput) messageInput.addEventListener("input", updateMailtoLink);
        if (nameInput) nameInput.addEventListener("input", updateMailtoLink);
        if (emailInput) emailInput.addEventListener("input", updateMailtoLink);

        // 4 Topic Chips
        topicChips.forEach(chip => {
            chip.addEventListener("click", () => {
                topicChips.forEach(c => c.classList.remove("ring-2", "ring-brand-amber", "bg-brand-amber/20"));
                chip.classList.add("ring-2", "ring-brand-amber", "bg-brand-amber/20");

                const defSubject = chip.getAttribute("data-subject") || "";
                const defBody = chip.getAttribute("data-body") || "";
                const senderName = nameInput ? nameInput.value.trim() : "";

                if (subjectInput) {
                    subjectInput.value = senderName ? `${defSubject} - ${senderName}` : defSubject;
                }
                if (messageInput) {
                    messageInput.value = defBody;
                }
                updateMailtoLink();
                if (messageInput) messageInput.focus();
            });
        });

        // Send submission
        if (sendBtn) {
            sendBtn.addEventListener("click", async () => {
                const name = nameInput ? nameInput.value.trim() : "";
                const email = emailInput ? emailInput.value.trim() : "";
                const subject = subjectInput ? subjectInput.value.trim() : "";
                const message = messageInput ? messageInput.value.trim() : "";

                if (!name || !email || !subject || !message) {
                    if (statusMsg) {
                        statusMsg.className = "p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                        statusMsg.textContent = "⚠️ Vui lòng điền đầy đủ Họ tên, Email, Tiêu đề và Nội dung tin nhắn.";
                        statusMsg.classList.remove("hidden");
                    }
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    if (statusMsg) {
                        statusMsg.className = "p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs";
                        statusMsg.textContent = "⚠️ Định dạng Email không hợp lệ. Vui lòng kiểm tra lại.";
                        statusMsg.classList.remove("hidden");
                    }
                    if (emailInput) emailInput.focus();
                    return;
                }

                sendBtn.disabled = true;
                if (sendBtnText) sendBtnText.textContent = "⏳ Đang gửi thông điệp...";

                const webhookUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
                const payload = {
                    action: "contact_culturecode",
                    target_email: "culturecodeproject@gmail.com",
                    sender_name: name,
                    sender_email: email,
                    subject: subject,
                    message: message,
                    stage_context: currentStageIndex === 0 ? "Chặng 1 · Online" : currentStageIndex === 1 ? "Chặng 2 · Offline" : "Chặng 3 · Tiếp Nối",
                    timestamp: new Date().toISOString()
                };

                try {
                    fetch(webhookUrl, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain;charset=utf-8" },
                        body: JSON.stringify(payload),
                        mode: "no-cors"
                    }).catch(e => console.warn("Contact Webhook notice:", e));

                    if (statusMsg) {
                        statusMsg.className = "p-3 rounded-xl bg-brand-green/15 border border-brand-green/30 text-brand-green text-xs leading-relaxed space-y-1";
                        statusMsg.innerHTML = `<div>🎉 <strong>Thông điệp đã được gửi thành công!</strong></div><div>Hệ thống đã chuyển thư tới <strong>culturecodeproject@gmail.com</strong>. Ban điều phối sẽ phản hồi sớm nhất qua email <strong>${email}</strong>.</div>`;
                        statusMsg.classList.remove("hidden");
                    }

                    if (sendBtnText) sendBtnText.textContent = "✓ Gửi Thành Công!";

                    setTimeout(() => {
                        closeModal();
                        sendBtn.disabled = false;
                        if (sendBtnText) sendBtnText.textContent = "🚀 Gửi Thông Điệp";
                        if (subjectInput) subjectInput.value = "";
                        if (messageInput) messageInput.value = "";
                        if (statusMsg) statusMsg.classList.add("hidden");
                    }, 2500);

                } catch (err) {
                    console.error("Contact send error:", err);
                    if (statusMsg) {
                        statusMsg.className = "p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs";
                        statusMsg.innerHTML = `<div>⚠️ Không thể kết nối trực tiếp đến máy chủ. Vui lòng bấm vào liên kết <strong>"Mở bằng ứng dụng Email cá nhân ↗"</strong> bên dưới để gửi thư trực tiếp.</div>`;
                        statusMsg.classList.remove("hidden");
                    }
                    sendBtn.disabled = false;
                    if (sendBtnText) sendBtnText.textContent = "🚀 Thử Gửi Lại";
                }
            });
        }
    }

    // Initialize New Component Handlers
    initIamDrawer();
    initQuickNoteFab();
    initContactCulturecodeModal();

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
        triggerAutoTelemetryOnBoot();
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
