const rawValues = [
  { id: 1, name: "Thành tựu", desc: "Đạt được kết quả cao và được công nhận.", details: "Khát khao vượt qua giới hạn, hoàn thành những mục tiêu khó khăn và được người khác hoặc xã hội ghi nhận công sức. Phù hợp với những người luôn hướng tới kết quả và sự xuất sắc." },
  { id: 2, name: "Sự thăng tiến", desc: "Liên tục phát triển và thăng tiến trong sự nghiệp.", details: "Không chấp nhận đứng yên một chỗ, luôn tìm kiếm cơ hội để bước lên những vị trí cao hơn, nhận thêm trách nhiệm và quyền lực trong công việc." },
  { id: 3, name: "Phiêu lưu", desc: "Trải nghiệm những điều mới mẻ và thú vị.", details: "Yêu thích sự thay đổi, sẵn sàng bước ra khỏi vùng an toàn để khám phá những vùng đất mới, ý tưởng mới hoặc những trải nghiệm chưa từng có." },
  { id: 4, name: "Tình cảm", desc: "Thể hiện và nhận lại tình cảm, sự yêu thương.", details: "Đề cao sự gắn kết về mặt cảm xúc. Trân trọng những cử chỉ quan tâm, sự ấm áp trong các mối quan hệ gia đình, bạn bè và tình yêu." },
  { id: 5, name: "Sự tự chủ", desc: "Có quyền quyết định và kiểm soát cuộc sống.", details: "Mong muốn tự định đoạt số phận của mình, không bị gò bó bởi các quy tắc cứng nhắc hay sự kiểm soát quá mức từ người khác." },
  { id: 6, name: "Sự cân bằng", desc: "Duy trì sự hài hoà giữa công việc và đời sống.", details: "Biết cách phân bổ thời gian hợp lý cho sự nghiệp, gia đình, sở thích cá nhân và sức khỏe. Tránh rơi vào tình trạng kiệt sức hoặc bỏ bê người thân." },
  { id: 7, name: "Sự cam kết", desc: "Tận tâm và trung thành với mục tiêu, mối quan hệ.", details: "Luôn giữ lời hứa và duy trì sự gắn bó lâu dài. Đã bắt đầu việc gì sẽ làm đến cùng, không dễ dàng bỏ cuộc dù gặp khó khăn." },
  { id: 8, name: "Gắn kết cộng đồng", desc: "Đóng góp và thuộc về một tập thể, cộng đồng.", details: "Cảm thấy có ý nghĩa khi tham gia vào các hoạt động tập thể, xây dựng một môi trường sống hoặc làm việc tốt đẹp hơn cho nhiều người." },
  { id: 9, name: "Sự tự tin", desc: "Tin tưởng vào khả năng và giá trị bản thân.", details: "Nhận thức rõ điểm mạnh và điểm yếu của mình, không dễ bị lung lay bởi lời phán xét của người khác và dám đối mặt với thử thách." },
  { id: 10, name: "Sự sáng tạo", desc: "Tạo ra những ý tưởng, giải pháp mới mẻ.", details: "Luôn tìm kiếm những cách thức tiếp cận khác biệt, thoát khỏi lối mòn tư duy. Phù hợp với những người làm nghệ thuật, thiết kế hoặc khởi nghiệp." },
  { id: 11, name: "Sự đa dạng", desc: "Trân trọng sự khác biệt và phong phú trong cuộc sống.", details: "Cởi mở với nhiều nền văn hóa, góc nhìn và lối sống khác nhau. Không phán xét những thứ trái ngược với bản thân mà coi đó là sự làm giàu trải nghiệm." },
  { id: 12, name: "Linh hoạt/Thích ứng", desc: "Dễ dàng thay đổi để phù hợp với hoàn cảnh mới.", details: "Có khả năng sinh tồn và phát triển trong môi trường đầy biến động. Không cứng nhắc mà luôn tìm cách 'nương theo dòng nước' để tiến lên." },
  { id: 13, name: "Tự do", desc: "Sống không bị ràng buộc bởi các định kiến hay giới hạn.", details: "Đề cao quyền tự quyết, muốn được làm những gì mình thích, đi những nơi mình muốn mà không bị ép buộc bởi bất kỳ ai hay quy chuẩn nào." },
  { id: 14, name: "Sức khoẻ", desc: "Duy trì thể chất và tinh thần khoẻ mạnh.", details: "Coi trọng việc chăm sóc cơ thể qua ăn uống, tập luyện và duy trì trạng thái tinh thần tích cực. Tin rằng sức khỏe là nền tảng của mọi hạnh phúc." },
  { id: 15, name: "Sự trung thực", desc: "Chân thành, thẳng thắn và không dối trá.", details: "Sống đúng với sự thật, không lừa dối bản thân hay người khác. Luôn đặt tính minh bạch và sự liêm chính lên hàng đầu trong mọi giao tiếp." },
  { id: 16, name: "Môi trường làm việc", desc: "Làm việc trong không gian thoải mái, tích cực.", details: "Đánh giá cao một văn hóa công ty lành mạnh, đồng nghiệp hỗ trợ lẫn nhau và không gian vật lý truyền cảm hứng sáng tạo." },
  { id: 17, name: "Thu nhập cao", desc: "Đạt được sự sung túc về mặt tài chính.", details: "Coi tiền bạc là thước đo của sự nỗ lực và là công cụ để đạt được các mục tiêu khác. Luôn tìm kiếm cơ hội gia tăng thu nhập." },
  { id: 18, name: "Sự hài hước", desc: "Mang lại niềm vui và tiếng cười cho bản thân và người khác.", details: "Luôn nhìn nhận cuộc sống qua lăng kính vui vẻ, dùng tiếng cười để hóa giải căng thẳng và kết nối mọi người xung quanh." },
  { id: 19, name: "Tính Độc Lập", desc: "Tự dựa vào sức mình, không phụ thuộc người khác.", details: "Mong muốn tự đứng trên đôi chân của mình cả về tài chính, tư duy lẫn cảm xúc. Không muốn trở thành gánh nặng của bất kỳ ai." },
  { id: 20, name: "Gắn kết gia đình", desc: "Đặt gia đình lên hàng đầu trong mọi quyết định.", details: "Gia đình là ưu tiên số 1, mọi sự cố gắng trong công việc và cuộc sống cuối cùng đều hướng về việc chăm lo cho những người thân yêu." },
  { id: 21, name: "Lãnh đạo", desc: "Dẫn dắt, truyền cảm hứng và định hướng cho người khác.", details: "Thích gánh vác trách nhiệm, đưa ra quyết định chiến lược và có khả năng tập hợp mọi người để hướng tới một mục tiêu chung." },
  { id: 22, name: "Học tập, phát triển", desc: "Không ngừng trau dồi kiến thức và kỹ năng.", details: "Coi cuộc đời là một trường học lớn. Luôn tò mò, thích đọc sách, tham gia khóa học và rút kinh nghiệm từ mọi vấp ngã." },
  { id: 23, name: "Năng suất", desc: "Làm việc hiệu quả, tối ưu hoá thời gian và nguồn lực.", details: "Ghét sự lãng phí. Luôn tìm cách làm được nhiều việc nhất với ít thời gian và công sức nhất, áp dụng công nghệ và quy trình thông minh." },
  { id: 24, name: "Được ghi nhận", desc: "Sự nỗ lực và thành quả được mọi người trân trọng.", details: "Cảm thấy được tiếp thêm động lực to lớn khi nhận được lời khen ngợi, giải thưởng hoặc sự tôn trọng từ cấp trên, đồng nghiệp và xã hội." },
  { id: 25, name: "Tôn giáo/Tín ngưỡng", desc: "Sống theo các giá trị tâm linh, đức tin.", details: "Tìm thấy sự bình an và kim chỉ nam cho hành động thông qua các triết lý tôn giáo, thiền định hoặc các hệ thống tín ngưỡng tâm linh." },
  { id: 26, name: "Lãng mạn", desc: "Trân trọng tình yêu và những phút giây thăng hoa cảm xúc.", details: "Luôn giữ lửa cho tình yêu lứa đôi, thích tạo ra những bất ngờ ngọt ngào và đề cao sự gắn kết sâu sắc về mặt tâm hồn." },
  { id: 27, name: "Sự an toàn", desc: "Tránh xa những rủi ro, duy trì sự ổn định.", details: "Thích sự chắc chắn, có quỹ dự phòng, công việc ổn định và môi trường sống an ninh. Rất cẩn trọng trước những quyết định mang tính thay đổi lớn." },
  { id: 28, name: "Tự khám phá", desc: "Thấu hiểu bản thân, điểm mạnh, điểm yếu và nội tâm.", details: "Thường xuyên phản tư (reflect), dành thời gian ở một mình để lắng nghe tiếng nói bên trong và giải mã những cảm xúc phức tạp của chính mình." },
  { id: 29, name: "Sự phục vụ", desc: "Hết lòng giúp đỡ và mang lại giá trị cho người khác.", details: "Tìm thấy hạnh phúc lớn nhất khi thấy người khác vui. Sẵn sàng hi sinh lợi ích cá nhân để hỗ trợ cộng đồng, khách hàng hoặc những người yếu thế." },
  { id: 30, name: "Bình yên", desc: "Sống thanh thản, không vướng bận lo âu.", details: "Tránh xa những cuộc tranh cãi vô bổ, drama hay sự xô bồ. Chọn lối sống tối giản, hòa mình với thiên nhiên và giữ cho tâm trí luôn tĩnh lặng." },
  { id: 31, name: "Thành công", desc: "Đạt được những mục tiêu lớn lao trong cuộc sống.", details: "Có tham vọng lớn, luôn đặt ra những KPI rõ ràng cho cuộc đời và cam kết theo đuổi đến cùng để vươn tới đỉnh cao." },
  { id: 32, name: "Làm việc nhóm", desc: "Hợp tác hiệu quả để đạt mục tiêu chung.", details: "Tin rằng 'muốn đi xa phải đi cùng nhau'. Đề cao sự đồng thuận, chia sẻ trách nhiệm và ăn mừng chiến thắng cùng tập thể." },
  { id: 33, name: "Bao dung/Tha thứ", desc: "Bỏ qua lỗi lầm, không thù dai nhớ vặt.", details: "Hiểu rằng ai cũng có thể mắc sai lầm. Sẵn sàng cho người khác (và cho cả bản thân) một cơ hội thứ hai để sửa chữa thay vì trừng phạt." },
  { id: 34, name: "Trí tuệ", desc: "Sự hiểu biết sâu rộng, cái nhìn thấu đáo về vạn vật.", details: "Đề cao sự uyên bác, khả năng nhìn thấu bản chất vấn đề và đưa ra những lời khuyên sâu sắc, đúng đắn cho mọi người xung quanh." },
  { id: 35, name: "Niềm vui", desc: "Luôn tìm thấy sự hân hoan trong những điều nhỏ bé.", details: "Không chờ đợi những điều lớn lao mới cảm thấy hạnh phúc. Luôn trân trọng một tách cà phê ngon, một ngày nắng đẹp hay một cuộc trò chuyện thú vị." },
  { id: 36, name: "Tình bạn", desc: "Trân trọng sự gắn kết với những người bạn tri kỷ.", details: "Đầu tư nhiều thời gian và tâm sức cho các mối quan hệ bạn bè. Sẵn sàng có mặt khi bạn bè cần giúp đỡ và chia sẻ mọi buồn vui." },
  { id: 37, name: "Lòng dũng cảm", desc: "Dám đương đầu với khó khăn, sợ hãi và bất công.", details: "Không chùn bước trước nghịch cảnh, dám lên tiếng bảo vệ lẽ phải và sẵn sàng nhận lấy phần rủi ro về mình để bảo vệ người khác." },
  { id: 38, name: "Sự bình đẳng", desc: "Đối xử công bằng, tôn trọng mọi người không phân biệt.", details: "Chống lại sự phân biệt đối xử. Đấu tranh cho một xã hội nơi ai cũng có cơ hội ngang nhau bất kể xuất thân, giới tính hay địa vị." },
  { id: 39, name: "Sự cống hiến", desc: "Dành trọn tâm huyết cho một lý tưởng hoặc công việc.", details: "Làm việc quên mình vì một mục đích cao cả hơn, không màng đến lợi ích vật chất hay sự đền đáp ngay lập tức." },
  { id: 40, name: "Tự kỷ luật", desc: "Nghiêm khắc với bản thân, giữ vững nguyên tắc.", details: "Có khả năng kiểm soát ham muốn nhất thời để tập trung cho mục tiêu dài hạn. Luôn duy trì những thói quen tốt dù không ai giám sát." },
  { id: 41, name: "Trách nhiệm", desc: "Dám làm dám chịu, hoàn thành nghĩa vụ được giao.", details: "Không bao giờ đổ lỗi cho hoàn cảnh hay người khác. Khi đã nhận việc sẽ đảm bảo làm đến nơi đến chốn, và tự đứng ra nhận lỗi nếu có sai sót." }
];

let currentIndex = 0;
let userRatings = [];
// 0: Không quan trọng, 1: Quan trọng, 2: Rất quan trọng

let topValues = [];
let selectedTop7 = [];

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');
const flashcardArea = document.getElementById('flashcardArea');
const s1Count = document.getElementById('s1-count');
const pb1 = document.getElementById('pb1');

// Khởi tạo thẻ Flashcard đầu tiên
function initFlashcards() {
  renderCard(0);
  updateProgress1();
}

function renderCard(index) {
  if (index >= rawValues.length) {
    finishStep1();
    return;
  }
  
  const val = rawValues[index];
  const cardHtml = `
    <div class="flashcard active" id="card-${index}">
      <div class="fc-title">${val.name}</div>
      <div class="fc-desc">${val.desc}</div>
      
      <button class="fc-details-btn" onclick="toggleDetails(${index})">Xem chi tiết <i class="fas fa-chevron-down"></i></button>
      <div class="fc-details-content" id="details-${index}">
        ${val.details}
      </div>

      <div class="action-group">
        <button class="btn-rate r-2" onclick="handleRate(${index}, 2)">Rất quan trọng</button>
        <button class="btn-rate r-1" onclick="handleRate(${index}, 1)">Quan trọng</button>
        <button class="btn-rate r-0" onclick="handleRate(${index}, 0)">Không quan trọng</button>
      </div>
    </div>
  `;
  flashcardArea.innerHTML = cardHtml;
  s1Count.innerText = index + 1;
}

function toggleDetails(index) {
  const el = document.getElementById(`details-${index}`);
  el.classList.toggle('open');
}

function handleRate(index, rating) {
  // Save rating
  userRatings.push({ ...rawValues[index], rating });
  
  // Animation swipe
  const card = document.getElementById(`card-${index}`);
  
  if (rating === 2) card.classList.add('slide-out-right');
  else if (rating === 0) card.classList.add('slide-out-left');
  else card.classList.add('slide-out-up');

  setTimeout(() => {
    currentIndex++;
    updateProgress1();
    renderCard(currentIndex);
  }, 350);
}

function updateProgress1() {
  const percent = (currentIndex / rawValues.length) * 100;
  pb1.style.width = `${percent}%`;
}

// ----------------------------------------------------
// STEP 2: Lọc TOP 7
function finishStep1() {
  // Lọc ra những cái "Rất quan trọng" (rating == 2)
  topValues = userRatings.filter(v => v.rating === 2);
  
  if (topValues.length < 7) {
    // Nếu chọn quá ít, bù thêm những cái "Quan trọng" (rating == 1)
    const tier1 = userRatings.filter(v => v.rating === 1);
    const needed = 7 - topValues.length;
    topValues = topValues.concat(tier1.slice(0, needed));
  }

  // Chuyển UI
  step1.classList.remove('active');
  step2.classList.add('active');
  
  renderTopValues();

  if (topValues.length > 7) {
    setTimeout(() => {
      alert(`Bạn có đến ${topValues.length} giá trị nổi bật. Vui lòng chọn lọc lại đúng 7 giá trị cốt lõi nhất ở bước này nhé!`);
    }, 100);
  }
}

const topValuesList = document.getElementById('topValuesList');
const selectionCount = document.getElementById('selectionCount');
const btnNext2 = document.getElementById('btnNext2');

function renderTopValues() {
  topValuesList.innerHTML = '';
  topValues.forEach(item => {
    const el = document.createElement('div');
    el.className = 'selectable-card';
    el.innerText = item.name;
    el.onclick = () => toggleSelectTop7(item, el);
    topValuesList.appendChild(el);
  });
}

function toggleSelectTop7(item, el) {
  const idx = selectedTop7.findIndex(v => v.id === item.id);
  if (idx > -1) {
    selectedTop7.splice(idx, 1);
    el.classList.remove('selected');
  } else {
    if (selectedTop7.length < 7) {
      selectedTop7.push(item);
      el.classList.add('selected');
    } else {
      alert("Bạn chỉ được chọn tối đa 7 giá trị!");
    }
  }
  
  selectionCount.innerText = selectedTop7.length;
  btnNext2.disabled = (selectedTop7.length !== 7);
}

btnNext2.addEventListener('click', () => {
  step2.classList.remove('active');
  step3.classList.add('active');
  initDuel();
});

// ----------------------------------------------------
// STEP 3: DUEL
let duelPairs = [];
let duelIndex = 0;
let duelScores = {}; // Lưu điểm số của từng item.id

function initDuel() {
  // Tạo cặp đấu ngẫu nhiên (nCr)
  for (let i = 0; i < selectedTop7.length; i++) {
    duelScores[selectedTop7[i].id] = 0; // init score
    for (let j = i + 1; j < selectedTop7.length; j++) {
      duelPairs.push([selectedTop7[i], selectedTop7[j]]);
    }
  }
  // Shuffle cặp đấu cho tự nhiên
  duelPairs.sort(() => Math.random() - 0.5);
  
  renderDuel();
}

const duelA = document.getElementById('duelA');
const duelB = document.getElementById('duelB');
const duelCurrent = document.getElementById('duelCurrent');

function renderDuel() {
  if (duelIndex >= duelPairs.length) {
    finishDuel();
    return;
  }
  
  duelCurrent.innerText = duelIndex + 1;
  const pair = duelPairs[duelIndex];
  
  duelA.innerText = pair[0].name;
  duelA.onclick = () => handleDuelClick(pair[0].id);
  
  duelB.innerText = pair[1].name;
  duelB.onclick = () => handleDuelClick(pair[1].id);
}

function handleDuelClick(winnerId) {
  duelScores[winnerId] += 1;
  duelIndex++;
  renderDuel();
}

// ----------------------------------------------------
// STEP 4: RESULTS
function finishDuel() {
  step3.classList.remove('active');
  step4.classList.add('active');
  
  // Tính rank
  const ranked = selectedTop7.map(item => {
    return { ...item, score: duelScores[item.id] };
  }).sort((a, b) => b.score - a.score); // Giảm dần
  
  renderResults(ranked);
}

function renderResults(ranked) {
  const listEl = document.getElementById('resultRanking');
  listEl.innerHTML = '';
  
  const labels = [];
  const data = [];
  
  ranked.forEach((item, index) => {
    labels.push(item.name);
    data.push(item.score);
    
    listEl.innerHTML += `
      <div class="rank-item">
        <div class="rank-num">#${index + 1}</div>
        <div class="rank-name">${item.name}</div>
        <div class="rank-score">${item.score} điểm</div>
      </div>
    `;
  });
  
  // Vẽ Radar Chart (Style Dark Mode)
  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Sức mạnh Giá trị',
        data: data,
        backgroundColor: 'rgba(245, 158, 11, 0.4)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(245, 158, 11, 1)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.1)' },
          grid: { color: 'rgba(255,255,255,0.1)' },
          pointLabels: {
            color: 'rgba(255,255,255,0.8)',
            font: { size: 12, family: "'Be Vietnam Pro', sans-serif" }
          },
          ticks: { display: false } // Ẩn số điểm trên trục
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Khởi chạy
initFlashcards();
