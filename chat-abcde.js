/**
 * Socratic ABCDE Chatbox - Frontend Controller
 * Deliver Happiness Project
 */

(function () {
  // Config & State
  let userPasscode = "";
  let currentState = "INIT"; // INIT, STEP_A, STEP_B, STEP_C, STEP_D, STEP_E, SUBMIT, COMPLETED
  let chatHistory = [];
  let disputationTurns = 0;
  let chatVersion = "stable"; // stable hoặc beta
  let activeApiEndpoint = "/api/chat-abcde";
  let currentPractice = {
    A: "",
    B: "",
    C: "",
    D: "",
    E: ""
  };
  let stageDrafts = { A: [], B: [], C: [], D: [], E: [] };

  // Focus management
  let _lastFocusedEl = null;

  // Elements
  let btnOpen = null;
  let modalOverlay = null;
  let chatBody = null;
  let inputArea = null;
  let inputField = null;
  let btnSend = null;
  let closeBtn = null;
  let statusLabel = null;

  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    btnOpen = document.getElementById("btn-abcde-chat");
    if (btnOpen) {
      btnOpen.addEventListener("click", openChatbox);
    }
  });

  function openChatbox() {
    _lastFocusedEl = document.activeElement;
    if (!modalOverlay) {
      createChatboxDOM();
    }
    modalOverlay.classList.add("abcde-active");
    if (currentState === "INIT") {
      renderPasscodeForm();
    } else {
      inputField.focus();
    }
  }

  function closeChatbox() {
    if (modalOverlay) {
      modalOverlay.classList.remove("abcde-active");
      if (_lastFocusedEl) { _lastFocusedEl.focus(); }
    }
  }

  function createChatboxDOM() {
    modalOverlay = document.createElement("div");
    modalOverlay.className = "abcde-modal-overlay";
    modalOverlay.id = "abcdeChatModal";
    modalOverlay.setAttribute("role", "dialog");
    modalOverlay.setAttribute("aria-modal", "true");
    modalOverlay.setAttribute("aria-labelledby", "abcdeChatModalTitle");

    modalOverlay.innerHTML = `
      <div class="abcde-modal-container">
        <div class="abcde-header">
          <h3 id="abcdeChatModalTitle" class="abcde-header-title">☀️ Thực hành Lạc quan ABCDE</h3>
          <button class="abcde-close-btn" id="abcdeCloseBtn" aria-label="Đóng cửa sổ thực hành ABCDE">&times;</button>
        </div>
        <div class="abcde-status-bar">
          <span id="abcdeStatusLabel" aria-live="polite">Trạng thái: Khởi tạo</span>
          <div class="abcde-status-step">
            <span class="abcde-step-badge" id="abcdeBadgeA">A</span>
            <span class="abcde-step-badge" id="abcdeBadgeB">B</span>
            <span class="abcde-step-badge" id="abcdeBadgeC">C</span>
            <span class="abcde-step-badge" id="abcdeBadgeD">D</span>
            <span class="abcde-step-badge" id="abcdeBadgeE">E</span>
          </div>
        </div>
        <div class="abcde-chat-body" id="abcdeChatBody" aria-live="polite"></div>
        <div class="abcde-input-area" id="abcdeInputArea" style="display: none;">
          <input type="text" class="abcde-input-box" id="abcdeInput" placeholder="Nhập câu trả lời của bạn..." />
          <button class="abcde-btn-send" id="abcdeSendBtn">Gửi</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Bind DOM refs
    chatBody = document.getElementById("abcdeChatBody");
    inputArea = document.getElementById("abcdeInputArea");
    inputField = document.getElementById("abcdeInput");
    btnSend = document.getElementById("abcdeSendBtn");
    closeBtn = document.getElementById("abcdeCloseBtn");
    statusLabel = document.getElementById("abcdeStatusLabel");

    // Event Listeners
    closeBtn.addEventListener("click", closeChatbox);
    btnSend.addEventListener("click", handleUserMessage);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleUserMessage();
    });
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeChatbox();
    });

    // Escape closes modal; Tab manages focus trap
    document.addEventListener("keydown", (e) => {
      if (!modalOverlay.classList.contains("abcde-active")) return;
      
      if (e.key === "Escape") {
        closeChatbox();
        return;
      }
      
      if (e.key === "Tab") {
        const focusableSelectors = 'a[href], input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = Array.from(modalOverlay.querySelectorAll(focusableSelectors)).filter(el => el.offsetParent !== null);
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === document.body) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || document.activeElement === document.body) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  function updateStatus(label, activeBadgeId) {
    statusLabel.innerText = `Trạng thái: ${label}`;
    
    // Reset badges
    const badges = ["A", "B", "C", "D", "E"];
    badges.forEach(b => {
      const badgeEl = document.getElementById(`abcdeBadge${b}`);
      if (badgeEl) {
        badgeEl.className = "abcde-step-badge";
      }
    });

    if (activeBadgeId) {
      // Mark active and completed steps
      const activeIdx = badges.indexOf(activeBadgeId);
      badges.forEach((b, idx) => {
        const badgeEl = document.getElementById(`abcdeBadge${b}`);
        if (badgeEl) {
          if (idx < activeIdx) {
            badgeEl.classList.add("abcde-done-badge");
          } else if (idx === activeIdx) {
            badgeEl.classList.add("abcde-active-badge");
          }
        }
      });
    }
  }

  function appendMessage(role, text) {
    const msgEl = document.createElement("div");
    msgEl.className = `abcde-message abcde-message-${role}`;
    msgEl.innerText = text;
    chatBody.appendChild(msgEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendCitations(citations) {
    if (!Array.isArray(citations) || citations.length === 0) return;
    const list = document.createElement("div");
    list.className = "abcde-rag-citations";
    list.setAttribute("aria-label", "Nguồn tri thức được sử dụng");
    Object.assign(list.style, {
      margin: "6px 0 12px 42px",
      padding: "8px 10px",
      maxWidth: "calc(100% - 54px)",
      borderLeft: "3px solid #38bdf8",
      background: "rgba(15, 23, 42, 0.72)",
      color: "#cbd5e1",
      fontSize: "0.75rem",
      lineHeight: "1.4",
      overflowWrap: "anywhere"
    });
    const label = document.createElement("div");
    label.textContent = "Nguồn tham chiếu";
    label.style.fontWeight = "600";
    label.style.color = "#7dd3fc";
    list.appendChild(label);
    citations.forEach((citation) => {
      const item = document.createElement("div");
      const title = citation.title || "Nguồn ABCDE";
      const source = citation.source && citation.source !== title ? ` — ${citation.source}` : "";
      const location = citation.location ? ` (${citation.location})` : "";
      item.textContent = `${title}${source}${location}`;
      list.appendChild(item);
    });
    chatBody.appendChild(list);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendRagStatus(status) {
    if (status === "low_confidence" || status === "no_match" || status === "needs_context") {
      appendMessage("system", "Chưa có nguồn đủ khớp; trợ lý đang hỏi thêm ngữ cảnh thay vì suy đoán.");
    }
  }

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "abcde-typing-indicator";
    indicator.id = "abcdeTypingIndicator";
    indicator.innerHTML = `
      <div class="abcde-typing-dot"></div>
      <div class="abcde-typing-dot"></div>
      <div class="abcde-typing-dot"></div>
    `;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("abcdeTypingIndicator");
    if (indicator) {
      indicator.remove();
    }
  }

  // State: INIT - Render Passcode Form
  function renderPasscodeForm() {
    chatBody.innerHTML = "";
    updateStatus("Nhập mật mã lớp học", null);
    
    const formEl = document.createElement("div");
    formEl.className = "abcde-passcode-form";
    formEl.innerHTML = `
      <p style="margin: 0 0 1rem; font-size: 0.95rem; color: #cbd5e1;">Chào mừng bạn đến với công cụ thực hành Lạc quan ABCDE. Vui lòng nhập mật mã lớp học:</p>
      <label class="sr-only" for="passcodeInput">Mật mã lớp học</label>
      <input type="text" class="abcde-passcode-input" id="passcodeInput" placeholder="MẬT MÃ" />
      <button class="abcde-btn-send" id="btnSubmitPasscode" style="margin-top: 0.5rem; width: 100%;">Xác nhận</button>
      <p id="passcodeError" style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #ef4444; display: none;"></p>
    `;
    chatBody.appendChild(formEl);

    const passInput = document.getElementById("passcodeInput");
    const btnPass = document.getElementById("btnSubmitPasscode");
    const passError = document.getElementById("passcodeError");

    passInput.focus();

    btnPass.addEventListener("click", verifyPasscode);
    passInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") verifyPasscode();
    });

    async function verifyPasscode() {
      const code = passInput.value.trim().toUpperCase();
      if (!code) {
        passError.innerText = "Vui lòng nhập mật mã.";
        passError.style.display = "block";
        return;
      }

      btnPass.disabled = true;
      btnPass.innerText = "Đang xác thực...";
      
      try {
        const response = await fetch("/api/chat-abcde", { // Luôn dùng endpoint stable để xác thực passcode ban đầu
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify_passcode", passcode: code })
        });
        const result = await response.json();

        if (result.success) {
          userPasscode = code;
          formEl.remove();
          renderVersionSelector(); // Chuyển sang màn hình chọn phiên bản thay vì start trực tiếp
        } else {
          passError.innerText = result.message || "Mật mã không chính xác.";
          passError.style.display = "block";
          btnPass.disabled = false;
          btnPass.innerText = "Xác nhận";
        }
      } catch (err) {
        passError.innerText = "Không thể kết nối máy chủ. Thử lại sau.";
        passError.style.display = "block";
        btnPass.disabled = false;
        btnPass.innerText = "Xác nhận";
      }
    }
  }

  // Render Version Selection DOM
  function renderVersionSelector() {
    updateStatus("Chọn phiên bản thực hành", null);
    inputArea.style.display = "none";

    const selectorEl = document.createElement("div");
    selectorEl.className = "abcde-version-selector";
    selectorEl.innerHTML = `
      <p style="margin: 0 0 1.2rem; font-size: 0.95rem; color: #cbd5e1; text-align: center;">Chào mừng sếp Vũ! Hãy chọn phiên bản thực hành:</p>
      <div class="abcde-version-options" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
        <div class="abcde-version-card abcde-card-selected" id="cardStable" style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 2px solid #38bdf8; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: rgba(30, 41, 59, 0.5);">
          <input type="radio" name="abcdeVersion" value="stable" checked style="margin-top: 4px; pointer-events: none;" />
          <div>
            <div style="font-weight: 600; color: #f8fafc; font-size: 0.95rem;">Bản ổn định - thực hành nhanh</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px; line-height: 1.35;">Phiên bản tiêu chuẩn, đối thoại mượt mà và phản hồi nhanh chóng.</div>
          </div>
        </div>
        <div class="abcde-version-card" id="cardBeta" style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1px solid #475569; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: rgba(30, 41, 59, 0.3);">
          <input type="radio" name="abcdeVersion" value="beta" style="margin-top: 4px; pointer-events: none;" />
          <div>
            <div style="font-weight: 600; color: #38bdf8; font-size: 0.95rem;">Bản thử nghiệm - có tri thức lớp học</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px; line-height: 1.35;">Tích hợp cơ sở tri thức giảng dạy thực tế và sách Learned Optimism để phản biện sâu sắc.</div>
          </div>
        </div>
      </div>
      <button class="abcde-btn-send" id="btnStartPractice" style="width: 100%; font-weight: 600; padding: 12px;">Bắt đầu thực hành</button>
    `;
    chatBody.appendChild(selectorEl);

    const cardStable = document.getElementById("cardStable");
    const cardBeta = document.getElementById("cardBeta");
    const radioStable = cardStable.querySelector("input");
    const radioBeta = cardBeta.querySelector("input");

    cardStable.addEventListener("click", () => {
      cardStable.style.borderColor = "#38bdf8";
      cardStable.style.borderWidth = "2px";
      cardBeta.style.borderColor = "#475569";
      cardBeta.style.borderWidth = "1px";
      radioStable.checked = true;
    });

    cardBeta.addEventListener("click", () => {
      cardBeta.style.borderColor = "#38bdf8";
      cardBeta.style.borderWidth = "2px";
      cardStable.style.borderColor = "#475569";
      cardStable.style.borderWidth = "1px";
      radioBeta.checked = true;
    });

    document.getElementById("btnStartPractice").addEventListener("click", () => {
      const selectedVal = selectorEl.querySelector("input[name='abcdeVersion']:checked").value;
      chatVersion = selectedVal;
      if (chatVersion === "beta") {
        activeApiEndpoint = "/api/chat-abcde-rag";
      } else {
        activeApiEndpoint = "/api/chat-abcde";
      }
      selectorEl.remove();
      inputArea.style.display = "flex";
      startPractice();
    });
  }

  // Start Practice
  function startPractice() {
    currentPractice = { A: "", B: "", C: "", D: "", E: "" };
    stageDrafts = { A: [], B: [], C: [], D: [], E: [] };
    chatHistory = [];
    disputationTurns = 0;
    currentState = "STEP_A";
    updateStatus("Bước A - Mô tả Nghịch cảnh", "A");
    
    appendMessage("ai", `Chào mừng bạn đến với ${chatVersion === "beta" ? "Bản thử nghiệm RAG" : "Bản ổn định"}! Đầu tiên, hãy mô tả một nghịch cảnh hoặc sự việc bất lợi (Adversity - A) mà bạn vừa gặp phải gần đây (Ví dụ: Bị sếp chê ý tưởng trong cuộc họp, bị hủy chuyến đi chơi phút chót,...)`);
    inputField.placeholder = "Mô tả Nghịch cảnh của bạn...";
    inputField.focus();
  }

  // Handling Fallback to Stable UI when RAG fails
  function renderFallbackNotice(lastMessage) {
    appendMessage("system", "⚠️ Phiên bản thử nghiệm (RAG Beta) đang gặp sự cố kết nối hoặc đã bị tắt. Bạn có muốn chuyển về Bản ổn định để tiếp tục bài thực hành không?");
    
    const fallbackEl = document.createElement("div");
    fallbackEl.className = "abcde-fallback-area";
    fallbackEl.style.display = "flex";
    fallbackEl.style.justify = "center";
    fallbackEl.style.marginTop = "10px";
    fallbackEl.style.padding = "5px";
    fallbackEl.innerHTML = `
      <button class="abcde-btn-send" id="btnFallbackToStable" style="background-color: #d97706; padding: 10px 20px;">Chuyển về Bản ổn định</button>
    `;
    chatBody.appendChild(fallbackEl);
    chatBody.scrollTop = chatBody.scrollHeight;
    inputArea.style.display = "none";

    document.getElementById("btnFallbackToStable").addEventListener("click", () => {
      fallbackEl.remove();
      inputArea.style.display = "flex";
      
      // Chuyển đổi endpoint sang Stable
      chatVersion = "stable";
      activeApiEndpoint = "/api/chat-abcde";
      
      appendMessage("system", "🔄 Đã chuyển sang Bản ổn định. Đang gửi lại phản hồi của bạn...");
      
      // Gửi lại tin nhắn
      handleUserMessage({ message: lastMessage, skipDraft: true, retryExistingMessage: true });
    });
  }

  // Handling messages in Socratic loop
  async function handleUserMessage(options = {}) {
    const settings = options && typeof options === "object" && (
      options.controlIntent || options.message || options.skipDraft || options.retryExistingMessage
    )
      ? options
      : {};
    const text = (settings.message || inputField.value).trim();
    if (!text || btnSend.disabled) return;

    inputField.value = "";
    if (!settings.retryExistingMessage) {
      appendMessage("user", text);
    }
    const stageLetter = currentState.startsWith("STEP_") ? currentState.slice(-1) : null;
    if (stageLetter && !settings.skipDraft && !settings.controlIntent) {
      stageDrafts[stageLetter].push(text);
    }
    const practiceContext = { ...currentPractice };
    if (stageLetter && stageDrafts[stageLetter].length) {
      practiceContext[stageLetter] = stageDrafts[stageLetter].join("\n");
    }

    // Call Socratic Chat API
    btnSend.disabled = true;
    inputField.disabled = true;
    showTypingIndicator();

    if (!settings.retryExistingMessage) {
      chatHistory.push({ role: "user", content: text });
    }

    try {
      const response = await fetch(activeApiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          passcode: userPasscode,
          state: currentState,
          message: text,
          history: chatHistory,
          practiceContext: practiceContext,
          controlIntent: settings.controlIntent || null
        })
      });

      // Bắt lỗi 503 hoặc 502 khi RAG Beta bị tắt / lỗi
      if (response.status === 503 || response.status === 502) {
        removeTypingIndicator();
        btnSend.disabled = false;
        inputField.disabled = false;
        
        if (chatVersion === "beta") {
          renderFallbackNotice(text);
          return;
        }
      }

      const result = await response.json();
      removeTypingIndicator();
      btnSend.disabled = false;
      inputField.disabled = false;

      if (result.success) {
        appendMessage("ai", result.reply);
        const injectionBlocked = result.assessmentCode === "PROMPT_INJECTION_BLOCKED";
        if (injectionBlocked) {
          if (stageLetter && stageDrafts[stageLetter].length) {
            stageDrafts[stageLetter].pop();
          }
          const lastHistoryItem = chatHistory[chatHistory.length - 1];
          if (lastHistoryItem && lastHistoryItem.role === "user" && lastHistoryItem.content === text) {
            chatHistory.pop();
          }
        }
        if (chatVersion === "beta") {
          appendCitations(result.citations);
          appendRagStatus(result.ragStatus);
        }
        if (!injectionBlocked) {
          chatHistory.push({ role: "ai", content: result.reply });
        }
        
        // Update state dynamically based on backend nextState decision
        const stageConfirmed = chatVersion === "stable"
          ? Boolean(result.nextState && result.nextState !== currentState)
          : result.stageComplete === true && result.nextState && result.nextState !== currentState;
        if (stageConfirmed) {
          // Record completed step data
          if (stageLetter) {
            const cumulativeStage = stageLetter === "C" || stageLetter === "D" || stageLetter === "E";
            currentPractice[stageLetter] = cumulativeStage
              ? practiceContext[stageLetter] || text
              : text;
            stageDrafts[stageLetter] = [];
          }

          currentState = result.nextState;

          // Update UI representation for new state
          if (currentState === "STEP_B") {
            updateStatus("Bước B - Nhận diện Niềm tin", "B");
            inputField.placeholder = "Chia sẻ suy nghĩ tự động xuất hiện lúc đó...";
          } else if (currentState === "STEP_C") {
            updateStatus("Bước C - Xác định Hệ quả", "C");
            inputField.placeholder = "Cảm xúc và phản ứng của bạn lúc đó thế nào?...";
          } else if (currentState === "STEP_D") {
            updateStatus("Bước D - Tranh biện/Phản biện (Lượt 1)", "D");
            inputField.placeholder = "Phản biện lại suy nghĩ tiêu cực đó...";
          } else if (currentState === "STEP_E") {
            updateStatus("Bước E - Thiết lập Năng lượng", "E");
            inputField.placeholder = "Bạn sẽ làm gì tiếp theo để giải quyết?...";
          } else if (currentState === "SUBMIT") {
            inputArea.style.display = "none";
            renderSubmitForm();
            return;
          }
        } else if (currentState === "STEP_D" && settings.controlIntent !== "advance") {
          // If state remains STEP_D (still in disputation loop), update turns and prompt decision if needed
          disputationTurns++;
          if (disputationTurns % 2 === 0) {
            inputArea.style.display = "none";
            renderDisputationDecision();
            return;
          } else {
            updateStatus("Bước D - Tranh biện/Phản biện (Lượt chẵn)", "D");
          }
        }
        inputField.focus();
      } else {
        appendMessage("system", `Lỗi: ${result.message || "Không thể tải phản hồi từ AI."}`);
      }
    } catch (err) {
      removeTypingIndicator();
      btnSend.disabled = false;
      inputField.disabled = false;
      
      if (chatVersion === "beta") {
        renderFallbackNotice(text);
      } else {
        appendMessage("system", "Lỗi mạng: Vui lòng thử lại tin nhắn vừa rồi.");
      }
    }
  }

  // State: SUBMIT - Render Email Form
  function renderSubmitForm() {
    updateStatus("Gửi báo cáo", null);
    
    appendMessage("ai", "Tuyệt vời! Bạn đã hoàn thành xuất sắc 5 bước của mô hình ABCDE. Hãy điền thông tin dưới đây để nhận bản báo cáo HTML chi tiết gửi về Email và lưu kết quả học tập.");

    const formEl = document.createElement("div");
    formEl.className = "abcde-submit-form";
    formEl.innerHTML = `
      <label class="sr-only" for="studentName">Họ và tên</label>
      <input type="text" class="abcde-form-input" id="studentName" placeholder="Họ và tên của bạn" />
      <label class="sr-only" for="studentEmail">Địa chỉ Email nhận báo cáo</label>
      <input type="email" class="abcde-form-input" id="studentEmail" placeholder="Địa chỉ Email nhận báo cáo" />
      <button class="abcde-btn-send" id="btnSubmitPractice" style="width: 100%;">Nhận báo cáo qua Email</button>
      <p id="submitError" style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #ef4444; display: none;"></p>
    `;
    chatBody.appendChild(formEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    const btnSubmit = document.getElementById("btnSubmitPractice");
    const nameInput = document.getElementById("studentName");
    const emailInput = document.getElementById("studentEmail");
    const submitError = document.getElementById("submitError");

    btnSubmit.addEventListener("click", submitPracticeData);

    async function submitPracticeData() {
      const fullName = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (!fullName) {
        submitError.innerText = "Vui lòng nhập Họ và tên.";
        submitError.style.display = "block";
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        submitError.innerText = "Vui lòng nhập Email hợp lệ.";
        submitError.style.display = "block";
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.innerText = "Đang gửi báo cáo...";
      submitError.style.display = "none";

      try {
        // Submit luôn đi qua api/chat-abcde chính để đồng nhất chữ ký HMAC gửi Apps Script
        const response = await fetch("/api/chat-abcde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            passcode: userPasscode,
            fullName: fullName,
            email: email,
            chatVersion: chatVersion, // Gửi phiên bản sử dụng
            data: currentPractice
          })
        });

        const result = await response.json();

        if (result.success) {
          formEl.remove();
          currentState = "COMPLETED";
          updateStatus("Đã hoàn thành", null);
          appendMessage("ai", `Báo cáo ABCDE đã được gửi thành công đến hòm thư: ${email}. Hãy kiểm tra hộp thư đến (và mục spam/quảng cáo nếu không thấy). Chúc bạn luôn giữ vững tư duy Lạc quan bằng lý trí!`);
          
          // Complete and add a close button
          const finishBtn = document.createElement("button");
          finishBtn.className = "abcde-btn-send";
          finishBtn.style.margin = "1rem auto 0";
          finishBtn.style.display = "block";
          finishBtn.innerText = "Đóng cửa sổ";
          finishBtn.addEventListener("click", closeChatbox);
          chatBody.appendChild(finishBtn);
          chatBody.scrollTop = chatBody.scrollHeight;
        } else {
          submitError.innerText = result.message || "Gửi dữ liệu thất bại. Vui lòng thử lại.";
          submitError.style.display = "block";
          btnSubmit.disabled = false;
          btnSubmit.innerText = "Nhận báo cáo qua Email";
        }
      } catch (err) {
        submitError.innerText = "Lỗi kết nối máy chủ. Thử lại sau.";
        submitError.style.display = "block";
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Nhận báo cáo qua Email";
      }
    }
  }

  function renderDisputationDecision() {
    updateStatus("Tự đánh giá phản biện", "D");
    appendMessage("ai", "Bạn cảm thấy những câu hỏi phản biện vừa rồi đã giúp bạn lung lay hoặc thay đổi niềm tin tiêu cực ban đầu chưa? Bạn đã sẵn sàng chuyển sang bước tiếp theo chưa?");

    const formEl = document.createElement("div");
    formEl.className = "abcde-quick-replies";
    formEl.id = "abcdeDisputeDecisionForm";
    formEl.style.display = "flex";
    formEl.style.gap = "10px";
    formEl.style.justify = "center";
    formEl.style.marginTop = "10px";

    formEl.innerHTML = `
      <button class="abcde-btn-send" id="btnDisputeOk" style="background-color: #10b981;">Đã hiệu quả, đi tiếp</button>
      <button class="abcde-btn-send" id="btnDisputeMore" style="background-color: #f59e0b;">Tôi muốn phản biện thêm</button>
    `;

    chatBody.appendChild(formEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    document.getElementById("btnDisputeOk").addEventListener("click", () => {
      formEl.remove();
      inputArea.style.display = "flex";
      handleUserMessage({
        controlIntent: "advance",
        message: "Tôi đã sẵn sàng chuyển sang bước E."
      });
    });

    document.getElementById("btnDisputeMore").addEventListener("click", () => {
      formEl.remove();
      inputArea.style.display = "flex";
      currentState = "STEP_D";
      updateStatus("Bước D - Tranh biện/Phản biện (Lượt lẻ)", "D");

      // Gửi tin nhắn tự động để AI hỏi tiếp
      handleUserMessage({
        message: "Tôi muốn phản biện sâu thêm.",
        skipDraft: true
      });
    });
  }
})();
