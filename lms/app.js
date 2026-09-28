// Delivering Happiness Movement (DHM) — Micro-LMS Learning Journey Engine
document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "dhm_lms_learner_state";

    // Default initial state
    let state = {
        user: { name: "", email: "" },
        completedStages: [],
        currentStage: "stage-1",
        stageData: {
            "stage-1": { quizPassed: false, reflection: "" },
            "stage-2": { selectedValues: [], reflection: "" },
            "stage-3": { abcde: { A: "", B: "", C: "", D: "", E: "" } }
        }
    };

    // Load persisted state
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to load saved state", e);
        }
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateProgress();
    }

    function updateProgress() {
        const total = 3;
        const count = state.completedStages.length;
        const percent = Math.min(100, Math.round((count / total) * 100));

        const fill = document.getElementById("progress-fill");
        const text = document.getElementById("progress-text");
        const statusText = document.getElementById("progress-status");

        if (fill) fill.style.width = percent + "%";
        if (text) text.textContent = percent + "%";
        if (statusText) statusText.textContent = `Đã hoàn thành ${count}/${total} chặng`;

        // Check if all completed
        const celebration = document.getElementById("celebration-card");
        if (celebration) {
            if (count >= 3) {
                celebration.classList.add("visible");
            } else {
                celebration.classList.remove("visible");
            }
        }
    }

    // Initialize Stage Cards Accordion & Lock status
    function renderStages() {
        const stages = ["stage-1", "stage-2", "stage-3"];

        stages.forEach((id, index) => {
            const card = document.getElementById(id);
            if (!card) return;

            const isCompleted = state.completedStages.includes(id);
            const isUnlocked = index === 0 || state.completedStages.includes(stages[index - 1]);

            card.classList.remove("active", "completed", "locked", "open");

            if (isCompleted) {
                card.classList.add("completed");
                const badge = card.querySelector(".stage-status-badge");
                if (badge) {
                    badge.className = "stage-status-badge status-completed";
                    badge.textContent = "✓ Đã xong";
                }
            } else if (isUnlocked) {
                card.classList.add("active");
                const badge = card.querySelector(".stage-status-badge");
                if (badge) {
                    badge.className = "stage-status-badge status-active";
                    badge.textContent = "Đang mở";
                }
            } else {
                card.classList.add("locked");
                const badge = card.querySelector(".stage-status-badge");
                if (badge) {
                    badge.className = "stage-status-badge status-locked";
                    badge.textContent = "🔒 Chưa mở";
                }
            }

            // Auto-open current active or first incomplete
            if (state.currentStage === id && isUnlocked) {
                card.classList.add("open");
            }
        });

        updateProgress();
    }

    // Toggle card on header click
    document.querySelectorAll(".stage-header").forEach(header => {
        header.addEventListener("click", () => {
            const card = header.closest(".stage-card");
            if (card.classList.contains("locked")) {
                alert("Bạn cần hoàn thành chặng trước để mở khóa bài học này nhé!");
                return;
            }
            const isOpen = card.classList.contains("open");
            document.querySelectorAll(".stage-card").forEach(c => c.classList.remove("open"));
            if (!isOpen) {
                card.classList.add("open");
                state.currentStage = card.id;
                saveState();
            }
        });
    });

    // STAGE 1: QUIZ VALIDATION
    window.handleOptionSelect = function (btn, questionId, isCorrect, explanation) {
        const parent = btn.closest(".quiz-options");
        const feedback = btn.closest(".quiz-card").querySelector(".quiz-feedback");

        // Clear siblings
        parent.querySelectorAll(".quiz-option").forEach(opt => {
            opt.classList.remove("correct", "incorrect");
        });

        if (isCorrect) {
            btn.classList.add("correct");
            feedback.style.display = "block";
            feedback.style.background = "rgba(16, 185, 129, 0.2)";
            feedback.style.color = "#A7F3D0";
            feedback.textContent = "✓ " + explanation;
        } else {
            btn.classList.add("incorrect");
            feedback.style.display = "block";
            feedback.style.background = "rgba(239, 68, 68, 0.2)";
            feedback.style.color = "#FCA5A5";
            feedback.textContent = "✗ Chưa chính xác. Thử chọn lại hoặc xem gợi ý lý thuyết bên trên nhé.";
        }
    };

    // COMPLETE STAGE 1
    window.completeStage1 = function () {
        const reflection = document.getElementById("stage1-reflection")?.value.trim();
        if (!reflection) {
            alert("Vui lòng ghi lại một dòng phản tư ngắn trước khi hoàn thành chặng nhé!");
            return;
        }

        state.stageData["stage-1"].reflection = reflection;
        if (!state.completedStages.includes("stage-1")) {
            state.completedStages.push("stage-1");
        }
        state.currentStage = "stage-2";
        saveState();
        renderStages();
        alert("Chúc mừng bạn đã hoàn thành Chặng 1! Chặng 2 (La bàn & Đồng hồ) đã được mở khóa.");
    };

    // STAGE 2: VALUES SELECTOR
    window.toggleValuePill = function (pill, valueName) {
        let vals = state.stageData["stage-2"].selectedValues || [];
        if (vals.includes(valueName)) {
            vals = vals.filter(v => v !== valueName);
            pill.classList.remove("selected");
        } else {
            if (vals.length >= 3) {
                alert("Bạn chỉ nên chọn tối đa 3 giá trị cốt lõi quan trọng nhất!");
                return;
            }
            vals.push(valueName);
            pill.classList.add("selected");
        }
        state.stageData["stage-2"].selectedValues = vals;
        saveState();
    };

    // COMPLETE STAGE 2
    window.completeStage2 = function () {
        const vals = state.stageData["stage-2"].selectedValues || [];
        if (vals.length === 0) {
            alert("Vui lòng chọn ít nhất 1-3 giá trị cốt lõi của bạn.");
            return;
        }

        if (!state.completedStages.includes("stage-2")) {
            state.completedStages.push("stage-2");
        }
        state.currentStage = "stage-3";
        saveState();
        renderStages();
        alert("Tuyệt vời! Chặng 3 (Framework ABCDE) đã sẵn sàng.");
    };

    // COMPLETE STAGE 3: ABCDE WORKSHEET
    window.completeStage3 = function () {
        const a = document.getElementById("abcde-a")?.value.trim();
        const b = document.getElementById("abcde-b")?.value.trim();
        const c = document.getElementById("abcde-c")?.value.trim();
        const d = document.getElementById("abcde-d")?.value.trim();
        const e = document.getElementById("abcde-e")?.value.trim();

        if (!a || !d || !e) {
            alert("Vui lòng điền tối thiểu bước A (Nghịch cảnh), D (Phản biện lý trí) và E (Hành động mới)!");
            return;
        }

        state.stageData["stage-3"].abcde = { A: a, B: b, C: c, D: d, E: e };
        if (!state.completedStages.includes("stage-3")) {
            state.completedStages.push("stage-3");
        }
        saveState();
        renderStages();
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

    // Initial render
    renderStages();
});
