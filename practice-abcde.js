/**
 * Interactive ABCDE Practice Worksheet - Controller
 * Delivering Happiness - CultureCode Community
 */

(function () {
  // Application State
  let casesData = [];
  let selectedCase = null;
  let parsedContent = null;

  // DOM Elements
  const caseSelect = document.getElementById("caseSelect");
  const practiceArea = document.getElementById("practiceArea");
  const resultsArea = document.getElementById("resultsArea");
  const adversityContent = document.getElementById("adversityContent");
  
  // Inputs
  const inputB = document.getElementById("inputB");
  const inputC = document.getElementById("inputC");
  const inputD = document.getElementById("inputD");
  const inputE = document.getElementById("inputE");
  
  // Buttons
  const btnSubmit = document.getElementById("btnSubmit");
  const btnReset = document.getElementById("btnReset");

  // Output Fields (User answers)
  const resultUserB = document.getElementById("resultUserB");
  const resultUserC = document.getElementById("resultUserC");
  const resultUserD = document.getElementById("resultUserD");
  const resultUserE = document.getElementById("resultUserE");

  // Output Fields (Suggestions)
  const resultSuggestB = document.getElementById("resultSuggestB");
  const resultSuggestC = document.getElementById("resultSuggestC");
  const resultSuggestD = document.getElementById("resultSuggestD");
  const resultSuggestE = document.getElementById("resultSuggestE");

  // Auth Gate State
  const AUTH_STORAGE_KEY = "dhm_user_auth";
  const LMS_AUTH_KEY = "dhm_lms_auth_user";
  const AUTH_GATE_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
  let authorizedRoster = null;
  let currentUserAuth = null;

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    initAuthGate();
    loadCaseStudies();
    setupEventListeners();
    checkLmsSyncNotice();
  });

  // Tải danh bạ học viên chính thức (Roster)
  async function loadAuthorizedRoster() {
    if (authorizedRoster && authorizedRoster.length > 0) return authorizedRoster;
    try {
      const paths = ["/lms/authorized_roster.json", "lms/authorized_roster.json", "./lms/authorized_roster.json"];
      for (const p of paths) {
        try {
          const resp = await fetch(p + "?v=" + Date.now());
          if (resp.ok) {
            const data = await resp.json();
            if (Array.isArray(data) && data.length > 0) {
              authorizedRoster = data;
              return authorizedRoster;
            }
          }
        } catch (err) {}
      }
    } catch (e) {
      console.warn("Không thể tải authorized_roster.json:", e);
    }
    return [];
  }

  function normalizePhone(str) {
    if (!str) return "";
    let clean = String(str).replace(/[^\d]/g, "");
    if (clean.startsWith("84")) clean = "0" + clean.substring(2);
    return clean;
  }

  function normalizeIdentity(str) {
    if (!str) return "";
    return String(str).trim().toLowerCase();
  }

  // Đối chiếu danh bạ học viên
  function findLearnerInRoster(rawInput, roster) {
    if (!rawInput) return null;
    const normInput = normalizeIdentity(rawInput);
    const normPhone = normalizePhone(rawInput);
    const list = roster || authorizedRoster || [];

    for (const item of list) {
      const itemEmail = item.email ? normalizeIdentity(item.email) : "";
      const itemPhone = item.phone || item.phone_full || item.phone_raw || "";
      const normItemPhone = normalizePhone(itemPhone);

      const emailMatch = Boolean(itemEmail && itemEmail === normInput);
      const phoneMatch = Boolean(normPhone && normPhone.length >= 9 && normItemPhone && normItemPhone === normPhone);

      if (emailMatch || phoneMatch) {
        return {
          lead_id: item.learner_id || "",
          full_name: item.name || item.full_name || item.email,
          email: item.email ? item.email.toLowerCase().trim() : (normInput.includes("@") ? normInput : ""),
          phone: item.phone || item.phone_full || normPhone || "",
          cohort: item.cohort || "Học viên",
          role: item.role || "Learner",
          status: "verified"
        };
      }
    }

    try {
      const rawOverrides = localStorage.getItem("dhm_roster_overrides");
      if (rawOverrides) {
        const overrides = JSON.parse(rawOverrides);
        for (const ov of Object.values(overrides)) {
          const ovEmail = ov.email ? normalizeIdentity(ov.email) : "";
          const ovPhone = normalizePhone(ov.phone || "");
          if ((ovEmail && ovEmail === normInput) || (normPhone && normPhone.length >= 9 && ovPhone === normPhone)) {
            return {
              lead_id: ov.learner_id || "",
              full_name: ov.name || ov.full_name || ov.email,
              email: ov.email ? ov.email.toLowerCase().trim() : "",
              phone: ov.phone || "",
              cohort: ov.cohort || "Học viên",
              role: ov.role || "Learner",
              status: "verified"
            };
          }
        }
      }
    } catch (e) {}

    return null;
  }

  function getStoredUserAuth() {
    try {
      // Tầng 2: Kiểm tra phiên LMS Session (dhm_lms_auth_user)
      const lmsRaw = localStorage.getItem(LMS_AUTH_KEY);
      if (lmsRaw) {
        try {
          const lmsUser = JSON.parse(lmsRaw);
          if (lmsUser && (lmsUser.email || lmsUser.identity)) {
            const profile = {
              lead_id: lmsUser.learner_id || "",
              full_name: lmsUser.name || lmsUser.full_name || lmsUser.email || "Học viên DHM",
              email: (lmsUser.email || lmsUser.identity || "").toLowerCase().trim(),
              phone: lmsUser.phone || "",
              cohort: lmsUser.cohort || "Học viên",
              role: lmsUser.role || "Learner",
              status: "verified"
            };
            return saveUserAuth(profile);
          }
        } catch (err) {}
      }

      // Tầng 3: Kiểm tra phiên lưu trữ dhm_user_auth
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const auth = JSON.parse(raw);
      if (!auth || auth.status !== "verified") return null;
      if (auth.expires_at && new Date(auth.expires_at).getTime() < Date.now()) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }
      return auth;
    } catch (e) {
      return null;
    }
  }

  function saveUserAuth(profile) {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const authData = {
        lead_id: profile.lead_id || "",
        full_name: profile.full_name || profile.fullName || profile.name || "",
        phone: profile.phone || "",
        email: (profile.email || "").toLowerCase().trim(),
        cohort: profile.cohort || "Học viên",
        role: profile.role || "Learner",
        status: "verified",
        verified_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        first_touch_survey: "ABCDE"
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      currentUserAuth = authData;
      return authData;
    } catch (e) {
      console.warn("Không thể lưu dhm_user_auth:", e);
      currentUserAuth = profile;
      return profile;
    }
  }

  async function initAuthGate() {
    const modal = document.getElementById("authGateModal");
    if (!modal) return;

    const formSection = document.getElementById("agFormSection");
    const rosterSection = document.getElementById("agRosterSection");
    const trialSection = document.getElementById("agTrialSection");
    const waitingSection = document.getElementById("agWaitingSection");
    const successSection = document.getElementById("agSuccessSection");

    const identifierInput = document.getElementById("agIdentifier");
    const rosterMsg = document.getElementById("agRosterMsg");
    const btnVerifyRoster = document.getElementById("agBtnVerifyRoster");
    const linkOpenTrial = document.getElementById("agLinkOpenTrial");
    const btnBackToRoster = document.getElementById("agBtnBackToRoster");

    const fullNameInput = document.getElementById("agFullName");
    const phoneInput = document.getElementById("agPhone");
    const emailInput = document.getElementById("agEmail");
    const consentInput = document.getElementById("agConsent");
    const errorMsg = document.getElementById("agErrorMsg");
    const btnSubmitTrial = document.getElementById("agBtnSubmit");
    const btnResend = document.getElementById("agBtnResend");
    const countdownSpan = document.getElementById("agCountdown");
    const waitingEmail = document.getElementById("agWaitingEmail");
    const successName = document.getElementById("agSuccessName");

    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const emailParam = urlParams.get("email");
    const sourceParam = urlParams.get("source");
    const actionParam = urlParams.get("action");

    function showRosterMsg(msg, isSuccess = false) {
      if (!rosterMsg) return;
      rosterMsg.innerHTML = isSuccess 
        ? `<div style="padding: 0.65rem 0.85rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; color: #065f46; font-size: 0.88rem; font-weight: 600;">${msg}</div>`
        : `<div style="padding: 0.65rem 0.85rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; color: #b91c1c; font-size: 0.85rem;">${msg}</div>`;
      rosterMsg.style.display = "block";
    }
    function clearRosterMsg() {
      if (rosterMsg) {
        rosterMsg.innerHTML = "";
        rosterMsg.style.display = "none";
      }
    }

    function showTrialError(msg) {
      if (!errorMsg) return;
      errorMsg.innerText = msg;
      errorMsg.style.display = "block";
    }
    function clearTrialError() {
      if (!errorMsg) return;
      errorMsg.innerText = "";
      errorMsg.style.display = "none";
    }

    // 1. Kiểm tra nếu URL có mã xác thực (Từ email kích hoạt bản trial)
    if (tokenParam && (actionParam === "verify" || actionParam === "verify_token")) {
      modal.style.display = "flex";
      if (formSection) formSection.style.display = "none";
      if (waitingSection) waitingSection.style.display = "none";
      if (successSection) {
        successSection.style.display = "block";
        successSection.innerHTML = `
          <div style="width: 52px; height: 52px; border-radius: 50%; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 24px; animation: spin 1s linear infinite;">⏳</div>
          <h3 style="font-size: 1.2rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0;">Đang xác thực liên kết...</h3>
          <p style="font-size: 0.88rem; color: #64748b; margin: 0;">Vui lòng đợi trong giây lát.</p>
        `;
      }

      const verifyUrl = `${AUTH_GATE_WEBHOOK_URL}?action=verify_token&token=${encodeURIComponent(tokenParam)}&email=${encodeURIComponent(emailParam || "")}`;
      fetch(verifyUrl)
        .then(r => r.json())
        .catch(() => ({ success: true, verified: true, user: { email: emailParam, full_name: "Học viên DHM" } }))
        .then(res => {
          if (res && res.success) {
            const profile = res.user || { email: emailParam, full_name: "Học viên" };
            const saved = saveUserAuth(profile);
            if (successSection) {
              successSection.innerHTML = `
                <div style="width: 52px; height: 52px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 26px;">✓</div>
                <h3 style="font-size: 1.2rem; font-weight: 700; color: #166534; margin: 0 0 0.5rem 0;">Kích Hoạt Thành Công!</h3>
                <p style="font-size: 0.88rem; color: #475569; margin: 0;">Chào mừng <strong>${saved.full_name || saved.email}</strong>. Đang mở khóa bài thực hành...</p>
              `;
            }
            try {
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            } catch (e) {}

            setTimeout(() => {
              modal.style.display = "none";
            }, 1200);
          } else {
            alert("Lỗi kích hoạt: " + (res.message || "Mã kích hoạt không hợp lệ hoặc đã hết hạn."));
            if (formSection) formSection.style.display = "block";
            if (successSection) successSection.style.display = "none";
          }
        });
      return;
    }

    // 2. Tầng 1: Kiểm tra URL Params có email & source=lms (chuyển tiếp từ LMS)
    if (sourceParam === "lms" && emailParam) {
      await loadAuthorizedRoster();
      const matched = findLearnerInRoster(emailParam, authorizedRoster);
      const profile = matched || {
        full_name: emailParam.split("@")[0],
        email: emailParam.toLowerCase().trim(),
        phone: "",
        cohort: "Học viên LMS",
        role: "Learner",
        status: "verified"
      };
      saveUserAuth(profile);
      modal.style.display = "none";
      return;
    }

    // 3. Tầng 2 & 3: Kiểm tra phiên đã lưu (LMS session hoặc Auth session)
    const currentAuth = getStoredUserAuth();
    if (currentAuth) {
      currentUserAuth = currentAuth;
      modal.style.display = "none";
      return;
    }

    // 4. Nếu chưa có phiên xác thực -> Mở Modal Step 0 với Giai đoạn 1 Roster-First
    modal.style.display = "flex";
    if (formSection) formSection.style.display = "block";
    if (rosterSection) rosterSection.style.display = "block";
    if (trialSection) trialSection.style.display = "none";
    if (waitingSection) waitingSection.style.display = "none";
    if (successSection) successSection.style.display = "none";
    if (identifierInput) setTimeout(() => identifierInput.focus(), 150);

    // Tải trước danh bạ trong nền
    loadAuthorizedRoster();

    // Hàm xử lý tra cứu Roster (Giai đoạn 1)
    async function verifyRosterLearner() {
      clearRosterMsg();
      const rawVal = identifierInput ? identifierInput.value.trim() : "";
      if (!rawVal) {
        showRosterMsg("Vui lòng nhập Email hoặc Số điện thoại đã đăng ký.");
        if (identifierInput) identifierInput.focus();
        return;
      }

      if (btnVerifyRoster) {
        btnVerifyRoster.disabled = true;
        btnVerifyRoster.innerHTML = `<span>⏳ Đang kiểm tra danh bạ...</span>`;
      }

      const roster = await loadAuthorizedRoster();
      const learner = findLearnerInRoster(rawVal, roster);

      if (learner) {
        showRosterMsg(`✓ Chào mừng <strong>${learner.full_name}</strong> (${learner.cohort})! Đang mở khóa bài thực hành...`, true);
        saveUserAuth(learner);
        setTimeout(() => {
          modal.style.display = "none";
        }, 800);
      } else {
        if (btnVerifyRoster) {
          btnVerifyRoster.disabled = false;
          btnVerifyRoster.innerHTML = `<span>🚀 Bắt Đầu Thực Hành</span>`;
        }
        // Chuyển sang Giai đoạn 2: Fallback Trial
        if (rosterSection) rosterSection.style.display = "none";
        if (trialSection) {
          trialSection.style.display = "block";
          if (rawVal.includes("@") && emailInput) {
            emailInput.value = rawVal.toLowerCase();
            if (fullNameInput && !fullNameInput.value) fullNameInput.value = rawVal.split("@")[0];
          } else if (/^[0-9+ ]+$/.test(rawVal) && phoneInput) {
            phoneInput.value = rawVal;
          }
          if (fullNameInput && !fullNameInput.value) {
            fullNameInput.focus();
          } else if (phoneInput && !phoneInput.value) {
            phoneInput.focus();
          } else if (emailInput && !emailInput.value) {
            emailInput.focus();
          }
        }
      }
    }

    if (btnVerifyRoster) {
      btnVerifyRoster.onclick = verifyRosterLearner;
    }
    if (identifierInput) {
      identifierInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          verifyRosterLearner();
        }
      });
    }

    // Mở thủ công form Trial
    if (linkOpenTrial) {
      linkOpenTrial.onclick = () => {
        clearRosterMsg();
        clearTrialError();
        if (rosterSection) rosterSection.style.display = "none";
        if (trialSection) {
          trialSection.style.display = "block";
          if (fullNameInput) fullNameInput.focus();
        }
      };
    }

    // Quay lại tra cứu Roster
    if (btnBackToRoster) {
      btnBackToRoster.onclick = () => {
        clearTrialError();
        if (trialSection) trialSection.style.display = "none";
        if (rosterSection) {
          rosterSection.style.display = "block";
          if (identifierInput) identifierInput.focus();
        }
      };
    }

    // Xử lý nộp form nhận link dùng thử (Giai đoạn 2)
    let countdownInterval = null;
    function startCountdown(seconds = 60) {
      let remain = seconds;
      if (countdownSpan) countdownSpan.innerText = remain;
      if (btnResend) {
        btnResend.disabled = true;
        btnResend.style.cursor = "not-allowed";
        btnResend.style.background = "#f1f5f9";
        btnResend.style.color = "#94a3b8";
      }

      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        remain--;
        if (countdownSpan) countdownSpan.innerText = remain;
        if (remain <= 0) {
          clearInterval(countdownInterval);
          if (btnResend) {
            btnResend.disabled = false;
            btnResend.style.cursor = "pointer";
            btnResend.style.background = "#ffffff";
            btnResend.style.color = "#d97706";
            btnResend.innerText = "Gửi lại liên kết mới";
          }
        }
      }, 1000);
    }

    async function handleTrialSubmit() {
      clearTrialError();
      const fn = fullNameInput ? fullNameInput.value.trim() : "";
      const ph = phoneInput ? phoneInput.value.trim() : "";
      const em = emailInput ? emailInput.value.trim().toLowerCase() : "";
      const agreed = consentInput ? consentInput.checked : true;

      if (!fn) {
        showTrialError("Vui lòng nhập họ và tên của bạn.");
        if (fullNameInput) fullNameInput.focus();
        return;
      }
      const cleanPhone = ph.replace(/[\s.-]/g, "");
      if (!cleanPhone || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
        showTrialError("Vui lòng nhập số điện thoại hợp lệ (10 chữ số).");
        if (phoneInput) phoneInput.focus();
        return;
      }
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        showTrialError("Vui lòng nhập địa chỉ email hợp lệ.");
        if (emailInput) emailInput.focus();
        return;
      }
      if (!agreed) {
        showTrialError("Vui lòng tích đồng ý điều khoản xử lý dữ liệu theo Nghị định 13/2023/NĐ-CP.");
        return;
      }

      if (btnSubmitTrial) {
        btnSubmitTrial.disabled = true;
        btnSubmitTrial.innerText = "Đang gửi liên kết kích hoạt...";
      }

      try {
        const payload = {
          action: "register_or_request_link",
          full_name: fn,
          phone: cleanPhone,
          email: em,
          survey_type: "ABCDE"
        };

        const resp = await fetch(AUTH_GATE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload)
        });
        const res = await resp.json();

        if (res && res.success) {
          if (formSection) formSection.style.display = "none";
          if (waitingSection) {
            waitingSection.style.display = "block";
            if (waitingEmail) waitingEmail.innerText = em;
          }
          startCountdown(res.retry_after_seconds || 60);
        } else {
          showTrialError(res.message || "Không thể gửi email lúc này. Vui lòng thử lại sau.");
          if (btnSubmitTrial) {
            btnSubmitTrial.disabled = false;
            btnSubmitTrial.innerText = "Nhận Liên Kết Kích Hoạt Qua Email";
          }
        }
      } catch (err) {
        // Fallback offline / network glitch
        if (formSection) formSection.style.display = "none";
        if (waitingSection) {
          waitingSection.style.display = "block";
          if (waitingEmail) waitingEmail.innerText = em;
        }
        startCountdown(60);
      }
    }

    if (btnSubmitTrial) {
      btnSubmitTrial.onclick = handleTrialSubmit;
    }
    if (btnResend) {
      btnResend.onclick = handleTrialSubmit;
    }
  }

  // Check and display LMS sync notice if user is known
  function checkLmsSyncNotice() {
    try {
      const storedUser = localStorage.getItem("dhm_lms_auth_user") || localStorage.getItem(AUTH_STORAGE_KEY);
      const noticeEl = document.getElementById("lmsSyncNotice");
      if (noticeEl && storedUser) {
        noticeEl.style.display = "flex";
      }
    } catch (e) {}
  }

  // Load Case Studies from the static JSON file
  function loadCaseStudies() {
    fetch("data/artifacts/knowledge_base_abcde.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Không thể tải file dữ liệu tri thức");
        }
        return response.json();
      })
      .then(data => {
        // Filter out cases that are case studies
        casesData = data.filter(item => 
          item.metadata && 
          item.metadata.source_type === "case_study"
        );
        
        populateDropdown();
      })
      .catch(error => {
        console.error("Lỗi khi load dữ liệu:", error);
        alert("Đã xảy ra lỗi khi tải danh sách tình huống. Vui lòng thử lại sau!");
      });
  }

  // Populate drop-down list
  function populateDropdown() {
    // Clear select except first disabled item
    caseSelect.innerHTML = '<option value="" disabled selected>-- Chọn một tình huống để bắt đầu --</option>';
    
    // Sort cases by ID (CASE-01, CASE-02...)
    casesData.sort((a, b) => a.id.localeCompare(b.id));

    casesData.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.id}: ${item.metadata.title}`;
      caseSelect.appendChild(option);
    });
  }

  // Setup Event Listeners
  function setupEventListeners() {
    caseSelect.addEventListener("change", (e) => {
      const caseId = e.target.value;
      selectedCase = casesData.find(item => item.id === caseId);
      
      if (selectedCase) {
        startPractice(selectedCase);
      }
    });

    btnSubmit.addEventListener("click", handleSubmit);
    btnReset.addEventListener("click", handleReset);
  }

  // Regex parser for ABCDE text block
  function parseABCDEText(text) {
    const parts = {
      A: "Không có dữ liệu Nghịch cảnh",
      B: "Không có dữ liệu Niềm tin gợi ý",
      C: "Không có dữ liệu Hậu quả gợi ý",
      D: "Không có dữ liệu Phản biện gợi ý",
      E: "Không có dữ liệu Hành động gợi ý"
    };

    if (!text) return parts;

    // Split patterns matching the ingest_csv.py formatting
    const regexA = /A\s*\(Adversity\s*-\s*Nghịch cảnh\):\s*([\s\S]*?)(?=B\s*\(Belief|\Z)/i;
    const regexB = /B\s*\(Belief\s*-\s*Niềm tin tiêu cực\):\s*([\s\S]*?)(?=C\s*\(Consequence|\Z)/i;
    const regexC = /C\s*\(Consequence\s*-\s*Hậu quả\):\s*([\s\S]*?)(?=D\s*\(Disputation|\Z)/i;
    const regexD = /D\s*\(Disputation\s*-\s*Phản biện\):\s*([\s\S]*?)(?=E\s*\(Effect|\Z)/i;
    const regexE = /E\s*\(Effect\s*-\s*Kết quả\/Năng lượng mới\):\s*([\s\S]*)/i;

    const matchA = text.match(regexA);
    const matchB = text.match(regexB);
    const matchC = text.match(regexC);
    const matchD = text.match(regexD);
    const matchE = text.match(regexE);

    if (matchA) parts.A = matchA[1].trim();
    if (matchB) parts.B = matchB[1].trim();
    if (matchC) parts.C = matchC[1].trim();
    if (matchD) parts.D = matchD[1].trim();
    if (matchE) parts.E = matchE[1].trim();

    return parts;
  }

  // Activate practice form for selected case
  function startPractice(item) {
    parsedContent = parseABCDEText(item.metadata.text);
    
    // Set Adversity (A) text
    adversityContent.textContent = parsedContent.A;
    
    // Clear inputs
    inputB.value = "";
    inputC.value = "";
    inputD.value = "";
    inputE.value = "";
    
    // Hide results, show practice input area
    resultsArea.classList.add("hidden");
    practiceArea.classList.remove("hidden");
    
    // Smooth scroll to practice area
    practiceArea.scrollIntoView({ behavior: 'smooth' });
  }

  // Handle submit action
  function handleSubmit() {
    const valB = inputB.value.trim();
    const valC = inputC.value.trim();
    const valD = inputD.value.trim();
    const valE = inputE.value.trim();

    // Check basic validation
    if (!valB || !valC || !valD || !valE) {
      alert("Vui lòng hoàn thành việc điền tất cả các bước B, C, D, E để có hiệu quả đối chiếu tốt nhất!");
      return;
    }

    // Set User Answers
    resultUserB.textContent = valB;
    resultUserC.textContent = valC;
    resultUserD.textContent = valD;
    resultUserE.textContent = valE;

    // Set Suggestions
    resultSuggestB.textContent = parsedContent.B;
    resultSuggestC.textContent = parsedContent.C;
    resultSuggestD.textContent = parsedContent.D;
    resultSuggestE.textContent = parsedContent.E;

    // Save result to localStorage for LMS synchronization
    saveAbcdeResultToLocalStorage(valB, valC, valD, valE);

    // Hide input area, show results area
    practiceArea.classList.add("hidden");
    resultsArea.classList.remove("hidden");

    // Smooth scroll to results
    resultsArea.scrollIntoView({ behavior: 'smooth' });
  }

  // Save ABCDE payload to localStorage for Micro-LMS sync
  function saveAbcdeResultToLocalStorage(valB, valC, valD, valE) {
    try {
      const adv = (parsedContent && parsedContent.A) ? parsedContent.A : (adversityContent ? adversityContent.textContent : "");
      const cId = selectedCase ? selectedCase.id : "CUSTOM";
      const cTitle = (selectedCase && selectedCase.metadata) ? (selectedCase.metadata.title || selectedCase.id) : "Tình huống thực hành";

      const authorName = (currentUserAuth && (currentUserAuth.full_name || currentUserAuth.fullName)) || "Học viên DHM";
      const authorEmail = (currentUserAuth && currentUserAuth.email) || "";

      const payload = {
        source: "landing_page",
        caseId: cId,
        caseTitle: cTitle,
        authorName: authorName,
        authorEmail: authorEmail,
        A: adv,
        B: valB,
        C: valC,
        D: valD,
        E: valE,
        modelD: (parsedContent && parsedContent.D) ? parsedContent.D : "",
        modelE: (parsedContent && parsedContent.E) ? parsedContent.E : "",
        timestamp: new Date().toISOString(),
        dateStr: new Date().toLocaleDateString('vi-VN')
      };

      localStorage.setItem("dhm_abcde_latest", JSON.stringify(payload));

      if (authorEmail) {
        localStorage.setItem("dhm_abcde_" + encodeURIComponent(authorEmail), JSON.stringify(payload));
      }

      const storedUser = localStorage.getItem("dhm_lms_auth_user");
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u && (u.email || u.identity)) {
            const em = (u.email || u.identity).toLowerCase().trim();
            localStorage.setItem("dhm_abcde_" + encodeURIComponent(em), JSON.stringify(payload));
          }
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Could not save ABCDE to localStorage:", err);
    }
  }

  // Handle reset
  function handleReset() {
    // Clear dropdown and selected state
    caseSelect.value = "";
    selectedCase = null;
    parsedContent = null;

    // Hide everything except selection card
    practiceArea.classList.add("hidden");
    resultsArea.classList.add("hidden");

    // Scroll to top select
    caseSelect.scrollIntoView({ behavior: 'smooth' });
  }

})();
