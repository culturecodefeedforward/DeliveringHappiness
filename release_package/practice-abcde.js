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

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    loadCaseStudies();
    setupEventListeners();
  });

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

    // Hide input area, show results area
    practiceArea.classList.add("hidden");
    resultsArea.classList.remove("hidden");

    // Smooth scroll to results
    resultsArea.scrollIntoView({ behavior: 'smooth' });
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
