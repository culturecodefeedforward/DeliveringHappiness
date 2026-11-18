/**
 * Socratic ABCDE Chatbox - Frontend Controller
 * Delivering Happiness Project
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
  const SYSTEM_BUTTON_PROMPTS = [
    "Tôi muốn phản biện sâu thêm.",
    "Tôi muốn phản biện thêm.",
    "Tôi đã sẵn sàng chuyển sang bước E.",
    "Đã hiệu quả, đi tiếp"
  ];
  let rawStepMessages = {
    STEP_A: [],
    STEP_B: [],
    STEP_C: [],
    STEP_D: [],
    STEP_E: []
  };

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
      if (userPasscode) {
        renderVersionSelector();
      } else {
        renderPasscodeForm();
      }
    } else if (inputField && inputArea.style.display !== "none") {
      inputField.focus();
    }
  }

  function closeChatbox() {
    if (modalOverlay) {
      modalOverlay.classList.remove("abcde-active");
      if (_lastFocusedEl && typeof _lastFocusedEl.focus === "function") {
        _lastFocusedEl.focus();
      }
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

    const badges = ["A", "B", "C", "D", "E"];
    badges.forEach(b => {
      const badgeEl = document.getElementById(`abcdeBadge${b}`);
      if (badgeEl) {
        badgeEl.className = "abcde-step-badge";
      }
    });

    if (activeBadgeId) {
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
    return msgEl;
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

  function escapeHtmlText(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function parseJsonResponseSafe(response) {
    try {
      const contentType = response && response.headers && typeof response.headers.get === "function"
        ? String(response.headers.get("content-type") || "")
        : "";
      if (contentType && !contentType.toLowerCase().includes("application/json")) {
        return null;
      }
      return await response.json();
    } catch (err) {
      return null;
    }
  }

  function generateSubmissionId() {
    if (typeof window !== "undefined" && window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "abcde-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  }

  // Chỉ đọc gợi ý họ tên / email cho tiện lợi điền form (tuyệt đối không dùng làm bằng chứng xác thực)
  function getLocalIdentityPrefill() {
    try {
      const lmsRaw = localStorage.getItem("dhm_lms_auth_user");
      if (lmsRaw) {
        const lmsUser = JSON.parse(lmsRaw);
        if (lmsUser && lmsUser.email) {
          return {
            fullName: String(lmsUser.full_name || lmsUser.name || "").trim(),
            email: String(lmsUser.email || "").trim().toLowerCase()
          };
        }
      }
    } catch (e) {}
    try {
      const gateRaw = localStorage.getItem("dhm_user_auth");
      if (gateRaw) {
        const gateUser = JSON.parse(gateRaw);
        if (gateUser && gateUser.email) {
          return {
            fullName: String(gateUser.full_name || gateUser.name || "").trim(),
            email: String(gateUser.email || "").trim().toLowerCase()
          };
        }
      }
    } catch (e2) {}
    return { fullName: "", email: "" };
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
        const response = await fetch("/api/chat-abcde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify_passcode", passcode: code })
        });
        const result = await parseJsonResponseSafe(response);

        if (response.ok && result && result.success) {
          userPasscode = code;
          formEl.remove();
          renderVersionSelector();
        } else {
          passError.innerText = (result && result.message) || (response.ok ? "Mật mã không chính xác." : `Lỗi máy chủ (${response.status}). Vui lòng thử lại.`);
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
    selectorEl.setAttribute("role", "radiogroup");
    selectorEl.setAttribute("aria-label", "Chọn phiên bản thực hành ABCDE");
    selectorEl.innerHTML = `
      <p style="margin: 0 0 1.2rem; font-size: 0.95rem; color: #cbd5e1; text-align: center;">Chào mừng bạn! Hãy chọn phiên bản thực hành:</p>
      <div class="abcde-version-options" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
        <div class="abcde-version-card abcde-card-selected" id="cardStable" role="radio" aria-checked="true" tabindex="0" style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 2px solid #38bdf8; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: rgba(30, 41, 59, 0.5);">
          <input type="radio" name="abcdeVersion" value="stable" checked style="margin-top: 4px; pointer-events: none;" tabindex="-1" />
          <div>
            <div style="font-weight: 600; color: #f8fafc; font-size: 0.95rem;">Bản ổn định - thực hành nhanh</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px; line-height: 1.35;">Phiên bản tiêu chuẩn, đối thoại mượt mà và phản hồi nhanh chóng.</div>
          </div>
        </div>
        <div class="abcde-version-card" id="cardBeta" role="radio" aria-checked="false" tabindex="0" style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1px solid #475569; border-radius: 10px; cursor: pointer; transition: all 0.2s; background: rgba(30, 41, 59, 0.3);">
          <input type="radio" name="abcdeVersion" value="beta" style="margin-top: 4px; pointer-events: none;" tabindex="-1" />
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

    function selectVersion(version) {
      const isBeta = version === "beta";
      radioStable.checked = !isBeta;
      radioBeta.checked = isBeta;
      cardStable.classList[isBeta ? "remove" : "add"]("abcde-card-selected");
      cardBeta.classList[isBeta ? "add" : "remove"]("abcde-card-selected");
      cardStable.setAttribute("aria-checked", isBeta ? "false" : "true");
      cardBeta.setAttribute("aria-checked", isBeta ? "true" : "false");
      cardStable.style.borderColor = isBeta ? "#475569" : "#38bdf8";
      cardStable.style.borderWidth = isBeta ? "1px" : "2px";
      cardBeta.style.borderColor = isBeta ? "#38bdf8" : "#475569";
      cardBeta.style.borderWidth = isBeta ? "2px" : "1px";
    }

    function attachCardHandlers(card, version, otherCard, otherVersion) {
      card.addEventListener("click", () => selectVersion(version));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectVersion(version);
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          selectVersion(otherVersion);
          if (otherCard && typeof otherCard.focus === "function") otherCard.focus();
        }
      });
    }

    attachCardHandlers(cardStable, "stable", cardBeta, "beta");
    attachCardHandlers(cardBeta, "beta", cardStable, "stable");
    radioStable.addEventListener("change", () => { if (radioStable.checked) selectVersion("stable"); });
    radioBeta.addEventListener("change", () => { if (radioBeta.checked) selectVersion("beta"); });

    document.getElementById("btnStartPractice").addEventListener("click", () => {
      const checkedInput = selectorEl.querySelector("input[name='abcdeVersion']:checked");
      const selectedVal = checkedInput ? checkedInput.value : "stable";
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
    currentState = "STEP_A";
    updateStatus("Bước A - Mô tả Nghịch cảnh", "A");

    appendMessage("ai", `Chào mừng bạn đến với ${chatVersion === "beta" ? "Bản thử nghiệm RAG" : "Bản ổn định"}! Đầu tiên, hãy mô tả một nghịch cảnh hoặc sự việc bất lợi (Adversity - A) mà bạn vừa gặp phải gần đây (Ví dụ: Bị sếp chê ý tưởng trong cuộc họp, bị hủy chuyến đi chơi phút chót,...)`);
    inputField.placeholder = "Mô tả Nghịch cảnh của bạn...";
    inputField.focus();
  }

  function resetPracticeSession() {
    currentState = "INIT";
    chatHistory = [];
    disputationTurns = 0;
    currentPractice = { A: "", B: "", C: "", D: "", E: "" };
    rawStepMessages = { STEP_A: [], STEP_B: [], STEP_C: [], STEP_D: [], STEP_E: [] };
    chatBody.innerHTML = "";
    inputArea.style.display = "none";
    if (inputField) {
      inputField.value = "";
      inputField.disabled = false;
    }
    if (btnSend) {
      btnSend.disabled = false;
    }
    if (userPasscode) {
      renderVersionSelector();
    } else {
      renderPasscodeForm();
    }
  }

  // Handling Fallback to Stable UI when RAG is explicitly disabled
  function renderFallbackNotice(lastMessage) {
    const oldNotices = chatBody.querySelectorAll(".abcde-fallback-area");
    oldNotices.forEach(n => n.remove());

    appendMessage("system", "⚠️ Phiên bản thử nghiệm (RAG Beta) hiện đang tạm tắt. Bạn có muốn chuyển về Bản ổn định để tiếp tục bài thực hành không?");

    const fallbackEl = document.createElement("div");
    fallbackEl.className = "abcde-fallback-area";
    fallbackEl.style.display = "flex";
    fallbackEl.style.justifyContent = "center";
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
      chatVersion = "stable";
      activeApiEndpoint = "/api/chat-abcde";
      appendMessage("system", "🔄 Đã chuyển sang Bản ổn định. Đang gửi lại phản hồi của bạn...");
      inputField.value = lastMessage;
      return handleUserMessage();
    });
  }

  // Handling Transient Error in BOTH Stable and Beta (Optimistic Rollback: giữ nguyên ô nhập + Thử lại)
  function renderTransientError(lastMessage, errorMsg) {
    const oldRetries = chatBody.querySelectorAll(".abcde-retry-area");
    oldRetries.forEach(n => n.remove());

    const hintText = chatVersion === "beta"
      ? "Bạn có thể nhấn [Thử lại tin nhắn] hoặc [Chuyển về Bản ổn định]:"
      : "Bạn có thể nhấn [Thử lại tin nhắn] hoặc chỉnh sửa câu trả lời ở ô nhập bên dưới:";

    appendMessage("system", `⚠️ ${errorMsg || "Kết nối tới AI đang bị chậm hoặc gián đoạn."} ${hintText}`);

    const retryEl = document.createElement("div");
    retryEl.className = "abcde-retry-area";
    retryEl.style.display = "flex";
    retryEl.style.justifyContent = "center";
    retryEl.style.gap = "10px";
    retryEl.style.marginTop = "10px";
    retryEl.style.padding = "5px";
    retryEl.style.flexWrap = "wrap";

    const switchBtnHtml = chatVersion === "beta"
      ? `<button class="abcde-btn-send" id="btnSwitchToStable" style="background-color: #d97706; padding: 8px 16px; font-size: 0.9rem;">Chuyển về Bản ổn định</button>`
      : "";

    retryEl.innerHTML = `
      <button class="abcde-btn-send" id="btnRetryMessage" style="background: linear-gradient(135deg, #0284c7, #38bdf8); padding: 8px 16px; font-size: 0.9rem;">🔄 Thử lại tin nhắn</button>
      ${switchBtnHtml}
    `;
    chatBody.appendChild(retryEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    inputArea.style.display = "flex";
    inputField.disabled = false;
    btnSend.disabled = false;
    inputField.value = lastMessage;
    inputField.focus();

    const btnRetry = document.getElementById("btnRetryMessage");
    if (btnRetry) {
      btnRetry.addEventListener("click", () => {
        retryEl.remove();
        inputField.value = lastMessage;
        return handleUserMessage();
      });
    }

    const btnSwitch = document.getElementById("btnSwitchToStable");
    if (btnSwitch) {
      btnSwitch.addEventListener("click", () => {
        retryEl.remove();
        chatVersion = "stable";
        activeApiEndpoint = "/api/chat-abcde";
        appendMessage("system", "🔄 Đã chuyển sang Bản ổn định. Đang gửi lại phản hồi của bạn...");
        inputField.value = lastMessage;
        return handleUserMessage();
      });
    }
  }

  // Handling messages in Socratic loop với Client-Side Optimistic Rollback (ABCDE-HIGH-02)
  async function handleUserMessage() {
    const text = inputField.value.trim();
    if (!text || btnSend.disabled) return;

    const stepSnapshot = currentState;
    inputField.value = "";
    const pendingUserBubble = appendMessage("user", text);

    btnSend.disabled = true;
    inputField.disabled = true;
    showTypingIndicator();

    const outboundHistory = chatHistory.concat([{ role: "user", content: text }]);

    try {
      const response = await fetch(activeApiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          passcode: userPasscode,
          state: stepSnapshot,
          message: text,
          history: outboundHistory
        })
      });

      const contentType = response.headers.get("content-type") || "";
      let result = null;
      if (contentType.includes("application/json")) {
        try {
          result = await response.json();
        } catch (jsonErr) {
          result = null;
        }
      }

      removeTypingIndicator();
      btnSend.disabled = false;
      inputField.disabled = false;

      // 1. RAG Beta bị tắt chủ động (HTTP 503)
      if (response.status === 503 && result && result.error === "RAG_BETA_DISABLED") {
        if (pendingUserBubble && pendingUserBubble.remove) pendingUserBubble.remove();
        if (chatVersion === "beta") {
          renderFallbackNotice(text);
          return;
        }
      }

      // 2. Lỗi HTTP / JSON / nghiệp vụ -> không commit vào rawStepMessages hay chatHistory
      if (!response.ok || !result || result.success !== true) {
        if (pendingUserBubble && pendingUserBubble.remove) pendingUserBubble.remove();
        let errorMsg = result && result.message ? result.message : "";
        if (response.status === 429) {
          errorMsg = errorMsg || "Hệ thống AI đang tiếp nhận nhiều lượt thực hành. Vui lòng thử lại sau 15 giây.";
        } else if (response.status === 504 || response.status === 502) {
          errorMsg = errorMsg || "Máy chủ AI phản hồi chậm hơn thường lệ (kết nối mạng tạm ngắt quãng).";
        } else if (!errorMsg) {
          errorMsg = `Lỗi (${response.status}): Không thể tải phản hồi từ AI.`;
        }
        renderTransientError(text, errorMsg);
        return;
      }

      // Chỉ commit vào chatHistory và rawStepMessages khi server trả về thành công
      if (rawStepMessages[stepSnapshot] && !SYSTEM_BUTTON_PROMPTS.includes(text)) {
        rawStepMessages[stepSnapshot].push(text);
      }
      chatHistory.push({ role: "user", content: text });

      appendMessage("ai", result.reply);
      chatHistory.push({ role: "ai", content: result.reply });

      if (result.nextState && result.nextState !== currentState) {
        if (!SYSTEM_BUTTON_PROMPTS.includes(text)) {
          if (currentState === "STEP_A") {
            currentPractice.A = text;
          } else if (currentState === "STEP_B") {
            currentPractice.B = text;
          } else if (currentState === "STEP_C") {
            currentPractice.C = text;
          } else if (currentState === "STEP_E") {
            currentPractice.E = text;
          }
        }

        currentState = result.nextState;

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
      } else if (currentState === "STEP_D") {
        disputationTurns++;
        if (disputationTurns % 2 === 0) {
          inputArea.style.display = "none";
          renderDisputationDecision();
          return;
        } else {
          updateStatus(`Bước D - Tranh biện/Phản biện (Lượt ${disputationTurns + 1})`, "D");
        }
      }
      inputField.focus();
    } catch (err) {
      removeTypingIndicator();
      if (pendingUserBubble && pendingUserBubble.remove) pendingUserBubble.remove();
      btnSend.disabled = false;
      inputField.disabled = false;
      renderTransientError(text, "Lỗi kết nối mạng: Không thể gửi yêu cầu tới máy chủ.");
    }
  }

  // Xây dựng dữ liệu bài tập ABCDE chuẩn hóa và làm sạch
  function buildStructuredPracticeData() {
    let aText = "";
    if (rawStepMessages.STEP_A.length === 1) {
      aText = rawStepMessages.STEP_A[0];
    } else if (rawStepMessages.STEP_A.length > 1) {
      aText = "• Nghịch cảnh ban đầu: " + rawStepMessages.STEP_A[0] + "\n• Chi tiết bổ sung bối cảnh: " + rawStepMessages.STEP_A.slice(1).join(" — ");
    } else {
      aText = currentPractice.A || "";
    }

    const bText = rawStepMessages.STEP_B.length > 0 ? rawStepMessages.STEP_B.join("\n") : (currentPractice.B || "");
    const cText = rawStepMessages.STEP_C.length > 0 ? rawStepMessages.STEP_C.join("\n") : (currentPractice.C || "");

    let dText = "";
    if (rawStepMessages.STEP_D.length === 1) {
      dText = rawStepMessages.STEP_D[0];
    } else if (rawStepMessages.STEP_D.length > 1) {
      dText = rawStepMessages.STEP_D.map((m, idx) => `• Góc nhìn ${idx + 1}: ${m}`).join("\n");
    } else {
      dText = currentPractice.D || "";
    }

    let eText = "";
    if (rawStepMessages.STEP_E.length > 0) {
      eText = rawStepMessages.STEP_E.map(m => `• ${m}`).join("\n");
    } else {
      eText = currentPractice.E || "";
    }

    let lastAiMsg = "";
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].role === "ai" && chatHistory[i].content) {
        lastAiMsg = chatHistory[i].content.replace(/\[NEXT_STATE:[^\]]+\]/gi, "").trim();
        break;
      }
    }
    if (lastAiMsg) {
      eText += (eText ? "\n\n" : "") + "💡 Lời đúc kết từ AI Socratic:\n" + lastAiMsg;
    }

    return {
      A: aText,
      B: bText,
      C: cText,
      D: dText,
      E: eText
    };
  }

  function formatPlainReportText(fullName, structuredData, historyList) {
    const lines = [
      "☀️ BÁO CÁO THỰC HÀNH LẠC QUAN ABCDE (MARTIN SELIGMAN)",
      fullName ? `Học viên: ${fullName}` : "",
      `Phiên bản: ${chatVersion === "beta" ? "Bản thử nghiệm RAG" : "Bản ổn định"}`,
      "",
      "A - Nghịch cảnh (Adversity):",
      structuredData.A || "(Chưa có dữ liệu)",
      "",
      "B - Niềm tin tự động (Belief):",
      structuredData.B || "(Chưa có dữ liệu)",
      "",
      "C - Hệ quả (Consequence):",
      structuredData.C || "(Chưa có dữ liệu)",
      "",
      "D - Phản biện (Disputation):",
      structuredData.D || "(Chưa có dữ liệu)",
      "",
      "E - Thiết lập Năng lượng (Energization):",
      structuredData.E || "(Chưa có dữ liệu)"
    ];

    if (Array.isArray(historyList) && historyList.length > 0) {
      lines.push("", "📜 NHẬT KÝ ĐỐI THOẠI SOCRATIC:");
      historyList.forEach(item => {
        const clean = String(item.content || "").replace(/\[NEXT_STATE:[^\]]+\]/gi, "").trim();
        if (!clean) return;
        const label = (item.role === "ai" || item.role === "model") ? "Trợ lý Socratic" : (fullName || "Học viên");
        lines.push(`[${label}] ${clean}`);
      });
    }
    return lines.filter(line => line !== null && line !== undefined).join("\n");
  }

  function buildPrintableReportHtml(fullName, structuredData, historyList) {
    const safeName = escapeHtmlText(fullName || "Học viên");
    const verLabel = chatVersion === "beta" ? "Bản thử nghiệm (Có tri thức lớp học RAG)" : "Bản ổn định (Thực hành nhanh)";
    const fieldToHtml = (val) => escapeHtmlText(val || "").replace(/\n/g, "<br/>");
    const cards = [
      { color: "#d45d55", title: "A - Nghịch cảnh (Adversity)", val: structuredData.A },
      { color: "#e2a85c", title: "B - Niềm tin tự động (Belief)", val: structuredData.B },
      { color: "#6b9e78", title: "C - Hệ quả (Consequence)", val: structuredData.C },
      { color: "#4a90e2", title: "D - Phản biện (Disputation)", val: structuredData.D },
      { color: "#9c27b0", title: "E - Thiết lập Năng lượng (Energization)", val: structuredData.E }
    ].map(c => `
      <div style="border-left: 4px solid ${c.color}; padding: 12px 14px; margin-bottom: 12px; background: #fff; border-radius: 4px;">
        <div style="font-weight: 700; color: ${c.color}; margin-bottom: 4px;">${c.title}</div>
        <div style="line-height: 1.5; color: #1e293b;">${fieldToHtml(c.val)}</div>
      </div>
    `).join("");

    let dialogueHtml = "";
    if (Array.isArray(historyList) && historyList.length > 0) {
      const turns = historyList.map(item => {
        const clean = String(item.content || "").replace(/\[NEXT_STATE:[^\]]+\]/gi, "").trim();
        if (!clean) return "";
        const isAi = (item.role === "ai" || item.role === "model");
        const roleLabel = isAi ? "🤖 Trợ lý Socratic" : `👤 ${safeName}`;
        return `<div style="margin-bottom: 8px; padding: 8px 12px; border-left: 3px solid ${isAi ? "#94a3b8" : "#2563eb"}; background: ${isAi ? "#f8fafc" : "#eff6ff"};">
          <div style="font-weight: 700; font-size: 12px; margin-bottom: 2px;">${roleLabel}</div>
          <div style="font-size: 13px; line-height: 1.45;">${fieldToHtml(clean)}</div>
        </div>`;
      }).join("");
      dialogueHtml = `<h3 style="margin-top: 20px; border-top: 1px dashed #cbd5e1; padding-top: 14px;">📜 Nhật Ký Đối Thoại Socratic</h3>${turns}`;
    }

    return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"/><title>Báo cáo ABCDE - ${safeName}</title>
      <style>@page{size:A4;margin:16mm;}body{font-family:Arial,sans-serif;color:#1e293b;max-width:740px;margin:0 auto;background:#fcfbf7;padding:20px;}</style>
      </head><body>
      <h2 style="color:#c97d54;text-align:center;border-bottom:2px solid #c97d54;padding-bottom:8px;">☀️ Báo cáo Thực hành Lạc quan ABCDE</h2>
      <p><strong>Học viên:</strong> ${safeName} | <strong>Phiên bản:</strong> ${verLabel}</p>
      ${cards}${dialogueHtml}
      <script>window.onload=function(){setTimeout(function(){window.print();},250);};</script>
      </body></html>`;
  }

  // State: SUBMIT - Hiển thị kết quả ngay tại chỗ (Copy/PDF) + Cổng xác thực 1B-LMS nếu muốn nhận Email
  function renderSubmitForm() {
    updateStatus("Hoàn tất & Lưu báo cáo", null);

    const structuredData = buildStructuredPracticeData();
    const submissionId = generateSubmissionId();
    const prefill = getLocalIdentityPrefill();
    let emailAuthToken = "";
    let emailAuthVerifiedEmail = "";

    appendMessage("ai", "Tuyệt vời! Bạn đã hoàn thành xuất sắc 5 bước của mô hình ABCDE. Kết quả tổng hợp của bạn hiển thị ngay bên dưới — bạn có thể sao chép hoặc lưu PDF tức thì; nếu là Học viên LMS / Auth Gate, bạn có thể xác thực để nhận thêm bản sao qua Email.");

    // 1. Khối hiển thị tóm tắt A-B-C-D-E an toàn (dùng textContent, không innerHTML) + Sao chép / Lưu PDF tức thì
    const previewCard = document.createElement("div");
    previewCard.className = "abcde-local-summary";
    previewCard.style.cssText = "background: rgba(15, 23, 42, 0.72); border: 1px solid #334155; border-radius: 10px; padding: 14px; margin: 10px 0;";

    const previewTitle = document.createElement("div");
    previewTitle.style.cssText = "font-weight: 700; color: #38bdf8; margin-bottom: 10px; font-size: 0.95rem;";
    previewTitle.textContent = "☀️ Tổng hợp 5 bước ABCDE của bạn";
    previewCard.appendChild(previewTitle);

    const summarySteps = [
      { key: "A", label: "A - Nghịch cảnh", color: "#f87171", text: structuredData.A },
      { key: "B", label: "B - Niềm tin tự động", color: "#fbbf24", text: structuredData.B },
      { key: "C", label: "C - Hệ quả", color: "#4ade80", text: structuredData.C },
      { key: "D", label: "D - Phản biện", color: "#60a5fa", text: structuredData.D },
      { key: "E", label: "E - Năng lượng mới", color: "#c084fc", text: structuredData.E }
    ];
    summarySteps.forEach(step => {
      const box = document.createElement("div");
      box.style.cssText = `border-left: 3px solid ${step.color}; padding: 6px 10px; margin-bottom: 8px; background: rgba(30, 41, 59, 0.55); border-radius: 0 6px 6px 0;`;
      const heading = document.createElement("div");
      heading.style.cssText = `font-weight: 600; font-size: 0.82rem; color: ${step.color}; margin-bottom: 2px;`;
      heading.textContent = step.label;
      const bodyDiv = document.createElement("div");
      bodyDiv.style.cssText = "font-size: 0.85rem; color: #e2e8f0; white-space: pre-wrap; line-height: 1.45;";
      bodyDiv.textContent = step.text || "(Chưa có dữ liệu)";
      box.appendChild(heading);
      box.appendChild(bodyDiv);
      previewCard.appendChild(box);
    });

    const instantActions = document.createElement("div");
    instantActions.style.cssText = "display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;";

    const btnCopyReport = document.createElement("button");
    btnCopyReport.type = "button";
    btnCopyReport.id = "btnCopyAbcdeReport";
    btnCopyReport.className = "abcde-btn-send";
    btnCopyReport.style.cssText = "flex: 1; min-width: 140px; background: #0284c7; font-size: 0.85rem; padding: 9px 12px;";
    btnCopyReport.textContent = "📋 Sao chép toàn văn";

    const btnPdfReport = document.createElement("button");
    btnPdfReport.type = "button";
    btnPdfReport.id = "btnPrintAbcdePdf";
    btnPdfReport.className = "abcde-btn-send";
    btnPdfReport.style.cssText = "flex: 1; min-width: 140px; background: #475569; font-size: 0.85rem; padding: 9px 12px;";
    btnPdfReport.textContent = "📄 Lưu / In báo cáo PDF";

    instantActions.appendChild(btnCopyReport);
    instantActions.appendChild(btnPdfReport);
    previewCard.appendChild(instantActions);
    chatBody.appendChild(previewCard);

    // 2. Khối 1B-LMS: Nhận bản sao qua Email cho học viên LMS / Auth Gate
    const formEl = document.createElement("div");
    formEl.className = "abcde-submit-form";
    formEl.style.cssText = "margin-top: 12px; padding: 14px; border: 1px solid #334155; border-radius: 10px; background: rgba(15, 23, 42, 0.55);";
    formEl.innerHTML = `
      <div style="font-weight: 600; color: #f8fafc; font-size: 0.92rem; margin-bottom: 6px;">📧 Nhận bản sao qua Email (Dành cho Học viên LMS / Auth Gate)</div>
      <p style="margin: 0 0 10px; font-size: 0.8rem; color: #94a3b8; line-height: 1.4;">Để bảo vệ hộp thư học viên, vui lòng xác thực bằng Mật khẩu LMS hoặc Mã OTP 6 số gửi về Email của bạn.</p>
      <label class="sr-only" for="studentName">Họ và tên</label>
      <input type="text" class="abcde-form-input" id="studentName" placeholder="Họ và tên của bạn" />
      <label class="sr-only" for="studentEmail">Địa chỉ Email nhận báo cáo</label>
      <input type="email" class="abcde-form-input" id="studentEmail" placeholder="Email LMS hoặc Email đã kích hoạt" />
      <div id="emailAuthStatusBadge" style="font-size: 0.8rem; color: #fbbf24; margin: 4px 0 8px;">🔒 Trạng thái xác thực: Chưa xác thực chủ sở hữu email</div>
      <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
        <button type="button" id="btnTabLmsPwd" class="abcde-btn-send" style="flex: 1; font-size: 0.8rem; padding: 7px 10px; background: #0369a1;">🔑 Mật khẩu LMS</button>
        <button type="button" id="btnTabEmailOtp" class="abcde-btn-send" style="flex: 1; font-size: 0.8rem; padding: 7px 10px; background: #334155;">✉️ Mã OTP 6 số</button>
      </div>
      <div id="lmsPwdPanel" style="margin-bottom: 10px;">
        <label class="sr-only" for="lmsAuthPassword">Mật khẩu LMS</label>
        <input type="password" class="abcde-form-input" id="lmsAuthPassword" placeholder="Nhập mật khẩu đăng nhập LMS" />
        <button type="button" class="abcde-btn-send" id="btnVerifyLmsOwner" style="width: 100%; background: #0f766e; font-size: 0.85rem;">Xác nhận tài khoản LMS</button>
      </div>
      <div id="emailOtpPanel" style="display: none; margin-bottom: 10px;">
        <button type="button" class="abcde-btn-send" id="btnRequestEmailOtp" style="width: 100%; background: #0284c7; font-size: 0.85rem; margin-bottom: 8px;">Gửi mã OTP 6 số tới Email</button>
        <div id="otpVerifyBox" style="display: none;">
          <label class="sr-only" for="emailOtpInput">Mã OTP 6 số</label>
          <input type="text" inputmode="numeric" maxlength="6" class="abcde-form-input" id="emailOtpInput" placeholder="Nhập 6 chữ số OTP trong hộp thư" />
          <button type="button" class="abcde-btn-send" id="btnVerifyEmailOtp" style="width: 100%; background: #0f766e; font-size: 0.85rem;">Xác nhận mã OTP</button>
        </div>
      </div>
      <button class="abcde-btn-send" id="btnSubmitPractice" disabled style="width: 100%; opacity: 0.6;">Gửi báo cáo qua Email</button>
      <p id="submitError" style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #ef4444; display: none;"></p>
    `;
    chatBody.appendChild(formEl);
    chatBody.scrollTop = chatBody.scrollHeight;

    const nameInput = document.getElementById("studentName");
    const emailInput = document.getElementById("studentEmail");
    const badgeEl = document.getElementById("emailAuthStatusBadge");
    const btnTabLmsPwd = document.getElementById("btnTabLmsPwd");
    const btnTabEmailOtp = document.getElementById("btnTabEmailOtp");
    const lmsPwdPanel = document.getElementById("lmsPwdPanel");
    const emailOtpPanel = document.getElementById("emailOtpPanel");
    const lmsAuthPasswordInput = document.getElementById("lmsAuthPassword");
    const btnVerifyLmsOwner = document.getElementById("btnVerifyLmsOwner");
    const btnRequestEmailOtp = document.getElementById("btnRequestEmailOtp");
    const otpVerifyBox = document.getElementById("otpVerifyBox");
    const emailOtpInput = document.getElementById("emailOtpInput");
    const btnVerifyEmailOtp = document.getElementById("btnVerifyEmailOtp");
    const btnSubmit = document.getElementById("btnSubmitPractice");
    const submitError = document.getElementById("submitError");

    if (prefill.fullName) nameInput.value = prefill.fullName;
    if (prefill.email) emailInput.value = prefill.email;

    function showFormError(msg) {
      submitError.innerText = msg;
      submitError.style.display = "block";
    }
    function clearFormError() {
      submitError.style.display = "none";
      submitError.innerText = "";
    }

    function setVerifiedState(token, emailAddr, verifiedName) {
      emailAuthToken = token;
      emailAuthVerifiedEmail = String(emailAddr || "").trim().toLowerCase();
      if (verifiedName && !nameInput.value.trim()) {
        nameInput.value = verifiedName;
      }
      badgeEl.style.color = "#4ade80";
      badgeEl.innerText = `✅ Đã xác thực chủ sở hữu email: ${emailAuthVerifiedEmail}`;
      btnSubmit.disabled = false;
      btnSubmit.style.opacity = "1";
      clearFormError();
    }

    function resetVerifiedState() {
      emailAuthToken = "";
      emailAuthVerifiedEmail = "";
      badgeEl.style.color = "#fbbf24";
      badgeEl.innerText = "🔒 Trạng thái xác thực: Chưa xác thực chủ sở hữu email";
      btnSubmit.disabled = true;
      btnSubmit.style.opacity = "0.6";
    }

    emailInput.addEventListener("input", () => {
      const curr = emailInput.value.trim().toLowerCase();
      if (emailAuthToken && curr !== emailAuthVerifiedEmail) {
        resetVerifiedState();
      }
    });

    btnCopyReport.addEventListener("click", async () => {
      const plain = formatPlainReportText(nameInput.value.trim(), structuredData, chatHistory);
      try {
        if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          await navigator.clipboard.writeText(plain);
        } else {
          const ta = document.createElement("textarea");
          ta.value = plain;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        btnCopyReport.textContent = "✅ Đã sao chép toàn văn";
        setTimeout(() => { btnCopyReport.textContent = "📋 Sao chép toàn văn"; }, 2500);
      } catch (eCopy) {
        showFormError("Trình duyệt chặn quyền Clipboard. Vui lòng dùng nút Lưu / In báo cáo PDF.");
      }
    });

    btnPdfReport.addEventListener("click", () => {
      const htmlDoc = buildPrintableReportHtml(nameInput.value.trim(), structuredData, chatHistory);
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.open();
        printWin.document.write(htmlDoc);
        printWin.document.close();
      } else {
        const blob = new Blob([htmlDoc], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Bao-cao-ABCDE.html";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    });

    btnTabLmsPwd.addEventListener("click", () => {
      lmsPwdPanel.style.display = "block";
      emailOtpPanel.style.display = "none";
      btnTabLmsPwd.style.background = "#0369a1";
      btnTabEmailOtp.style.background = "#334155";
    });

    btnTabEmailOtp.addEventListener("click", () => {
      lmsPwdPanel.style.display = "none";
      emailOtpPanel.style.display = "block";
      btnTabEmailOtp.style.background = "#0369a1";
      btnTabLmsPwd.style.background = "#334155";
    });

    btnVerifyLmsOwner.addEventListener("click", async () => {
      const email = emailInput.value.trim().toLowerCase();
      const password = lmsAuthPasswordInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormError("Vui lòng nhập Email LMS hợp lệ trước khi xác thực.");
        return;
      }
      if (!password) {
        showFormError("Vui lòng nhập Mật khẩu LMS.");
        return;
      }

      btnVerifyLmsOwner.disabled = true;
      btnVerifyLmsOwner.innerText = "Đang kiểm tra tài khoản LMS...";
      clearFormError();
      try {
        const resp = await fetch("/api/chat-abcde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_lms_owner",
            passcode: userPasscode,
            email,
            password
          })
        });
        const resJson = await parseJsonResponseSafe(resp);
        if (resp.ok && resJson && resJson.success && resJson.emailAuthToken) {
          setVerifiedState(resJson.emailAuthToken, resJson.email || email, resJson.fullName);
        } else {
          resetVerifiedState();
          showFormError((resJson && resJson.message) || (resp.ok ? "Xác thực Mật khẩu LMS không thành công." : `Lỗi máy chủ (${resp.status}) khi xác thực LMS.`));
        }
      } catch (err) {
        resetVerifiedState();
        showFormError("Không thể kết nối máy chủ xác thực LMS.");
      } finally {
        btnVerifyLmsOwner.disabled = false;
        btnVerifyLmsOwner.innerText = "Xác nhận tài khoản LMS";
      }
    });

    btnRequestEmailOtp.addEventListener("click", async () => {
      const email = emailInput.value.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormError("Vui lòng nhập Email hợp lệ để nhận mã OTP.");
        return;
      }

      btnRequestEmailOtp.disabled = true;
      btnRequestEmailOtp.innerText = "Đang gửi mã OTP...";
      clearFormError();
      try {
        const resp = await fetch("/api/chat-abcde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "request_email_otp",
            passcode: userPasscode,
            email
          })
        });
        const resJson = await parseJsonResponseSafe(resp);
        if (resp.ok && resJson && resJson.success) {
          otpVerifyBox.style.display = "block";
          badgeEl.style.color = "#38bdf8";
          badgeEl.innerText = "✉️ Đã gửi mã OTP 6 số. Vui lòng kiểm tra hộp thư (cả mục Spam).";
        } else {
          showFormError((resJson && resJson.message) || (resp.ok ? "Không thể gửi mã OTP cho email này." : `Lỗi máy chủ (${resp.status}) khi gửi mã OTP.`));
        }
      } catch (err) {
        showFormError("Lỗi kết nối khi yêu cầu gửi mã OTP.");
      } finally {
        btnRequestEmailOtp.disabled = false;
        btnRequestEmailOtp.innerText = "Gửi mã OTP 6 số tới Email";
      }
    });

    btnVerifyEmailOtp.addEventListener("click", async () => {
      const email = emailInput.value.trim().toLowerCase();
      const otp = emailOtpInput.value.trim();
      if (!email || !/^\d{6}$/.test(otp)) {
        showFormError("Vui lòng nhập mã OTP gồm đúng 6 chữ số.");
        return;
      }

      btnVerifyEmailOtp.disabled = true;
      btnVerifyEmailOtp.innerText = "Đang kiểm tra OTP...";
      clearFormError();
      try {
        const resp = await fetch("/api/chat-abcde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_email_otp",
            passcode: userPasscode,
            email,
            otp
          })
        });
        const resJson = await parseJsonResponseSafe(resp);
        if (resp.ok && resJson && resJson.success && resJson.emailAuthToken) {
          setVerifiedState(resJson.emailAuthToken, resJson.email || email, resJson.fullName);
        } else {
          resetVerifiedState();
          showFormError((resJson && resJson.message) || (resp.ok ? "Mã OTP không đúng hoặc đã hết hạn." : `Lỗi máy chủ (${resp.status}) khi kiểm tra OTP.`));
        }
      } catch (err) {
        resetVerifiedState();
        showFormError("Lỗi kết nối khi kiểm tra OTP.");
      } finally {
        btnVerifyEmailOtp.disabled = false;
        btnVerifyEmailOtp.innerText = "Xác nhận mã OTP";
      }
    });

    btnSubmit.addEventListener("click", submitPracticeData);

    async function submitPracticeData() {
      const fullName = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();

      if (!fullName) {
        showFormError("Vui lòng nhập Họ và tên.");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormError("Vui lòng nhập Email hợp lệ.");
        return;
      }
      if (!emailAuthToken || email !== emailAuthVerifiedEmail) {
        showFormError("Vui lòng xác thực tài khoản LMS hoặc mã OTP 6 số cho Email này trước khi gửi.");
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.innerText = "Đang gửi báo cáo...";
      clearFormError();

      try {
        const response = await fetch("/api/chat-abcde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            passcode: userPasscode,
            submissionId,
            emailAuthToken,
            fullName,
            email,
            chatVersion,
            data: structuredData,
            history: chatHistory
          })
        });

        const result = await parseJsonResponseSafe(response);

        if (response.ok && result && result.success === true) {
          formEl.remove();
          currentState = "COMPLETED";
          updateStatus("Đã hoàn thành", null);

          if (result.emailSent === true) {
            appendMessage("ai", `Báo cáo ABCDE đã được lưu và gửi thành công đến hộp thư: ${email}. Hãy kiểm tra hộp thư đến (và mục Spam/Quảng cáo nếu chưa thấy). Chúc bạn luôn giữ vững tư duy Lạc quan bằng lý trí!`);
          } else {
            appendMessage("system", `⚠️ Bài thực hành đã được lưu vào hệ thống${result.duplicate ? " (ghi nhận trước đó)" : ""}, nhưng CHƯA gửi được email (${result.emailMessage || "hạn mức hoặc kết nối email tạm gián đoạn"}). Vui lòng dùng nút [Sao chép toàn văn] hoặc [Lưu / In báo cáo PDF] ngay phía trên để lưu giữ kết quả!`);
          }

          const actionsWrap = document.createElement("div");
          actionsWrap.style.display = "flex";
          actionsWrap.style.gap = "10px";
          actionsWrap.style.justifyContent = "center";
          actionsWrap.style.flexWrap = "wrap";
          actionsWrap.style.marginTop = "1rem";

          const restartBtn = document.createElement("button");
          restartBtn.className = "abcde-btn-send";
          restartBtn.id = "btnRestartPractice";
          restartBtn.style.backgroundColor = "#0284c7";
          restartBtn.innerText = "🔄 Thực hành tình huống mới";
          restartBtn.addEventListener("click", resetPracticeSession);

          const finishBtn = document.createElement("button");
          finishBtn.className = "abcde-btn-send";
          finishBtn.id = "btnFinishClose";
          finishBtn.innerText = "Đóng cửa sổ";
          finishBtn.addEventListener("click", closeChatbox);

          actionsWrap.appendChild(restartBtn);
          actionsWrap.appendChild(finishBtn);
          chatBody.appendChild(actionsWrap);
          chatBody.scrollTop = chatBody.scrollHeight;
        } else {
          showFormError((result && result.message) || "Gửi dữ liệu thất bại. Vui lòng thử lại hoặc dùng nút Sao chép / Lưu PDF ở trên.");
          btnSubmit.disabled = false;
          btnSubmit.innerText = "Gửi báo cáo qua Email";
        }
      } catch (err) {
        showFormError("Lỗi kết nối máy chủ. Bạn có thể bấm thử lại hoặc dùng nút Sao chép / Lưu PDF ở trên.");
        btnSubmit.disabled = false;
        btnSubmit.innerText = "Gửi báo cáo qua Email";
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
    formEl.style.justifyContent = "center";
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
      currentState = "STEP_D";
      inputField.value = "Tôi đã sẵn sàng chuyển sang bước E.";
      return handleUserMessage();
    });

    document.getElementById("btnDisputeMore").addEventListener("click", () => {
      formEl.remove();
      inputArea.style.display = "flex";
      currentState = "STEP_D";
      inputField.value = "Tôi muốn phản biện sâu thêm.";
      return handleUserMessage();
    });
  }
})();
