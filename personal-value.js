const rawValues = [
  { id: 1, name: "Thành tựu", desc: "Đạt được kết quả cao và được công nhận.", details: "Khát khao vượt qua giới hạn, hoàn thành những mục tiêu khó khăn và được người khác hoặc xã hội ghi nhận công sức.", context: "được vinh danh và nhận một giải thưởng danh giá trong ngành" },
  { id: 2, name: "Sự thăng tiến", desc: "Liên tục phát triển và thăng tiến trong sự nghiệp.", details: "Không chấp nhận đứng yên một chỗ, luôn tìm kiếm cơ hội để bước lên những vị trí cao hơn, nhận thêm trách nhiệm.", context: "được đề bạt lên một vị trí quản lý cấp cao mà bạn luôn ao ước" },
  { id: 3, name: "Phiêu lưu", desc: "Trải nghiệm những điều mới mẻ và thú vị.", details: "Yêu thích sự thay đổi, sẵn sàng bước ra khỏi vùng an toàn để khám phá những vùng đất mới, ý tưởng mới.", context: "bắt đầu một hành trình phượt mạo hiểm khám phá vùng đất mới" },
  { id: 4, name: "Tình cảm", desc: "Thể hiện và nhận lại tình cảm, sự yêu thương.", details: "Đề cao sự gắn kết về mặt cảm xúc. Trân trọng những cử chỉ quan tâm, sự ấm áp trong các mối quan hệ.", context: "có một buổi tối ấm áp, lãng mạn trọn vẹn bên cạnh người mình yêu thương" },
  { id: 5, name: "Sự tự chủ", desc: "Có quyền quyết định và kiểm soát cuộc sống.", details: "Mong muốn tự định đoạt số phận của mình, không bị gò bó bởi các quy tắc cứng nhắc hay sự kiểm soát.", context: "được hoàn toàn tự quyết định cách làm việc và định hướng cuộc đời mình" },
  { id: 6, name: "Sự cân bằng", desc: "Duy trì sự hài hoà giữa công việc và đời sống.", details: "Biết cách phân bổ thời gian hợp lý cho sự nghiệp, gia đình, sở thích cá nhân và sức khỏe.", context: "rời công sở đúng 5h chiều mỗi ngày để dành thời gian cho sở thích cá nhân" },
  { id: 7, name: "Sự cam kết", desc: "Tận tâm và trung thành với mục tiêu, mối quan hệ.", details: "Luôn giữ lời hứa và duy trì sự gắn bó lâu dài. Đã bắt đầu việc gì sẽ làm đến cùng, không dễ bỏ cuộc.", context: "giữ trọn vẹn lời hứa gắn bó lâu dài với một người hoặc một tổ chức dù có khó khăn" },
  { id: 8, name: "Gắn kết cộng đồng", desc: "Đóng góp và thuộc về một tập thể, cộng đồng.", details: "Cảm thấy có ý nghĩa khi tham gia vào các hoạt động tập thể, xây dựng một môi trường sống hoặc làm việc tốt đẹp.", context: "được tham gia và đóng góp công sức xây dựng một cộng đồng địa phương vững mạnh" },
  { id: 9, name: "Sự tự tin", desc: "Tin tưởng vào khả năng và giá trị bản thân.", details: "Nhận thức rõ điểm mạnh và điểm yếu của mình, không dễ bị lung lay bởi lời phán xét của người khác.", context: "luôn ngẩng cao đầu tin tưởng tuyệt đối vào năng lực của bản thân trước đám đông" },
  { id: 10, name: "Sự sáng tạo", desc: "Tạo ra những ý tưởng, giải pháp mới mẻ.", details: "Luôn tìm kiếm những cách thức tiếp cận khác biệt, thoát khỏi lối mòn tư duy.", context: "được tự do sáng tạo và đưa ra những ý tưởng đột phá chưa ai làm" },
  { id: 11, name: "Sự đa dạng", desc: "Trân trọng sự khác biệt và phong phú trong cuộc sống.", details: "Cởi mở với nhiều nền văn hóa, góc nhìn và lối sống khác nhau. Không phán xét những thứ trái ngược.", context: "được sống trong một môi trường cởi mở, trân trọng mọi sự khác biệt về văn hóa và lối sống" },
  { id: 12, name: "Linh hoạt/Thích ứng", desc: "Dễ dàng thay đổi để phù hợp với hoàn cảnh mới.", details: "Có khả năng sinh tồn và phát triển trong môi trường đầy biến động. Không cứng nhắc.", context: "dễ dàng xoay sở và thích nghi xuất sắc khi bị ném vào một hoàn cảnh hoàn toàn xa lạ" },
  { id: 13, name: "Tự do", desc: "Sống không bị ràng buộc bởi các định kiến hay giới hạn.", details: "Đề cao quyền tự quyết, muốn được làm những gì mình thích, đi những nơi mình muốn mà không bị ép buộc.", context: "có thể xách balo lên và đi bất cứ đâu, làm bất cứ gì mà không bị ai ràng buộc" },
  { id: 14, name: "Sức khoẻ", desc: "Duy trì thể chất và tinh thần khoẻ mạnh.", details: "Coi trọng việc chăm sóc cơ thể qua ăn uống, tập luyện và duy trì trạng thái tinh thần tích cực.", context: "duy trì một cơ thể tráng kiện, không bệnh tật và tinh thần luôn sảng khoái" },
  { id: 15, name: "Sự trung thực", desc: "Chân thành, thẳng thắn và không dối trá.", details: "Sống đúng với sự thật, không lừa dối bản thân hay người khác. Luôn đặt tính minh bạch lên hàng đầu.", context: "luôn nói lên sự thật và giữ được sự liêm chính của mình dù phải chịu thiệt thòi" },
  { id: 16, name: "Môi trường làm việc", desc: "Làm việc trong không gian thoải mái, tích cực.", details: "Đánh giá cao một văn hóa công ty lành mạnh, đồng nghiệp hỗ trợ lẫn nhau.", context: "được làm việc mỗi ngày trong một văn phòng truyền cảm hứng với những đồng nghiệp tuyệt vời" },
  { id: 17, name: "Thu nhập cao", desc: "Đạt được sự sung túc về mặt tài chính.", details: "Coi tiền bạc là thước đo của sự nỗ lực và là công cụ để đạt được các mục tiêu khác.", context: "sở hữu một tài khoản ngân hàng kếch xù và sống một cuộc sống hoàn toàn sung túc" },
  { id: 18, name: "Sự hài hước", desc: "Mang lại niềm vui và tiếng cười cho bản thân và người khác.", details: "Luôn nhìn nhận cuộc sống qua lăng kính vui vẻ, dùng tiếng cười để hóa giải căng thẳng.", context: "luôn mang lại tiếng cười sảng khoái và xua tan mọi căng thẳng cho những người xung quanh" },
  { id: 19, name: "Tính Độc Lập", desc: "Tự dựa vào sức mình, không phụ thuộc người khác.", details: "Mong muốn tự đứng trên đôi chân của mình cả về tài chính, tư duy lẫn cảm xúc.", context: "không bao giờ phải ngửa tay nhờ vả hay phụ thuộc vào bất kỳ ai trong mọi tình huống" },
  { id: 20, name: "Gắn kết gia đình", desc: "Đặt gia đình lên hàng đầu trong mọi quyết định.", details: "Gia đình là ưu tiên số 1, mọi sự cố gắng cuối cùng đều hướng về việc chăm lo cho người thân.", context: "có mặt ở nhà mỗi tối để ăn bữa cơm gia đình và chứng kiến con cái khôn lớn từng ngày" },
  { id: 21, name: "Lãnh đạo", desc: "Dẫn dắt, truyền cảm hứng và định hướng cho người khác.", details: "Thích gánh vác trách nhiệm, đưa ra quyết định chiến lược và có khả năng tập hợp mọi người.", context: "được đứng ở vị trí đầu tàu, dẫn dắt và truyền cảm hứng cho hàng trăm con người" },
  { id: 22, name: "Học tập, phát triển", desc: "Không ngừng trau dồi kiến thức và kỹ năng.", details: "Coi cuộc đời là một trường học lớn. Luôn tò mò, thích đọc sách, tham gia khóa học.", context: "có thời gian và nguồn lực để liên tục học hỏi, nâng cấp tri thức của bản thân mỗi ngày" },
  { id: 23, name: "Năng suất", desc: "Làm việc hiệu quả, tối ưu hoá thời gian và nguồn lực.", details: "Ghét sự lãng phí. Luôn tìm cách làm được nhiều việc nhất với ít thời gian và công sức nhất.", context: "hoàn thành một khối lượng công việc khổng lồ một cách tối ưu và không lãng phí một giây nào" },
  { id: 24, name: "Được ghi nhận", desc: "Sự nỗ lực và thành quả được mọi người trân trọng.", details: "Cảm thấy được tiếp thêm động lực to lớn khi nhận được lời khen ngợi, giải thưởng.", context: "được cấp trên, đồng nghiệp và công chúng liên tục tán dương, ca ngợi công sức của mình" },
  { id: 25, name: "Tôn giáo/Tín ngưỡng", desc: "Sống theo các giá trị tâm linh, đức tin.", details: "Tìm thấy sự bình an và kim chỉ nam cho hành động thông qua các triết lý tôn giáo, tâm linh.", context: "sống trọn vẹn theo đức tin tâm linh và tìm thấy sự bình an tuyệt đối trong linh hồn" },
  { id: 26, name: "Lãng mạn", desc: "Trân trọng tình yêu và những phút giây thăng hoa cảm xúc.", details: "Luôn giữ lửa cho tình yêu lứa đôi, thích tạo ra những bất ngờ ngọt ngào.", context: "trải qua những khoảnh khắc yêu đương cháy bỏng, lãng mạn như trong một bộ phim" },
  { id: 27, name: "Sự an toàn", desc: "Tránh xa những rủi ro, duy trì sự ổn định.", details: "Thích sự chắc chắn, có quỹ dự phòng, công việc ổn định và môi trường sống an ninh.", context: "có một cuộc sống ổn định, an toàn tuyệt đối, không bao giờ phải lo lắng về những biến cố bất ngờ" },
  { id: 28, name: "Tự khám phá", desc: "Thấu hiểu bản thân, điểm mạnh, điểm yếu và nội tâm.", details: "Thường xuyên phản tư, dành thời gian ở một mình để lắng nghe tiếng nói bên trong.", context: "dành thời gian tĩnh lặng một mình để đào sâu và thấu hiểu đến tận cùng nội tâm phức tạp của bản thân" },
  { id: 29, name: "Sự phục vụ", desc: "Hết lòng giúp đỡ và mang lại giá trị cho người khác.", details: "Tìm thấy hạnh phúc lớn nhất khi thấy người khác vui. Sẵn sàng hi sinh lợi ích cá nhân.", context: "được hi sinh thời gian cá nhân để giúp đỡ, chăm sóc và mang lại hạnh phúc cho những người yếu thế" },
  { id: 30, name: "Bình yên", desc: "Sống thanh thản, không vướng bận lo âu.", details: "Tránh xa những cuộc tranh cãi vô bổ, drama hay sự xô bồ. Chọn lối sống tối giản.", context: "sống một cuộc sống nhàn nhã, thanh thản, không vướng bận bất kỳ lo âu hay áp lực nào" },
  { id: 31, name: "Thành công", desc: "Đạt được những mục tiêu lớn lao trong cuộc sống.", details: "Có tham vọng lớn, luôn đặt ra những KPI rõ ràng cho cuộc đời và cam kết theo đuổi đến cùng.", context: "vươn tới đỉnh cao danh vọng và hoàn thành được mục tiêu vĩ đại nhất của cuộc đời mình" },
  { id: 32, name: "Làm việc nhóm", desc: "Hợp tác hiệu quả để đạt mục tiêu chung.", details: "Tin rằng 'muốn đi xa phải đi cùng nhau'. Đề cao sự đồng thuận, chia sẻ trách nhiệm.", context: "được sát cánh cùng những người đồng đội kề vai sát cánh, cùng nhau vượt qua giông bão" },
  { id: 33, name: "Bao dung/Tha thứ", desc: "Bỏ qua lỗi lầm, không thù dai nhớ vặt.", details: "Hiểu rằng ai cũng có thể mắc sai lầm. Sẵn sàng cho người khác một cơ hội thứ hai.", context: "buông bỏ được mọi oán hận và tha thứ hoàn toàn cho người đã từng làm tổn thương mình sâu sắc" },
  { id: 34, name: "Trí tuệ", desc: "Sự hiểu biết sâu rộng, cái nhìn thấu đáo về vạn vật.", details: "Đề cao sự uyên bác, khả năng nhìn thấu bản chất vấn đề và đưa ra những lời khuyên sâu sắc.", context: "đạt đến sự uyên bác, thông thái, có thể nhìn thấu và giải quyết mọi vấn đề hóc búa nhất" },
  { id: 35, name: "Niềm vui", desc: "Luôn tìm thấy sự hân hoan trong những điều nhỏ bé.", details: "Không chờ đợi những điều lớn lao mới cảm thấy hạnh phúc. Luôn trân trọng những điều giản dị.", context: "mỗi ngày đều tràn ngập những niềm vui nhỏ bé, tươi tắn, không bao giờ biết đến nỗi buồn" },
  { id: 36, name: "Tình bạn", desc: "Trân trọng sự gắn kết với những người bạn tri kỷ.", details: "Đầu tư nhiều thời gian và tâm sức cho các mối quan hệ bạn bè. Sẵn sàng có mặt khi bạn bè cần.", context: "luôn có những người bạn tri kỷ kề cạnh, sẵn sàng chia sẻ mọi đắng cay ngọt bùi cùng nhau" },
  { id: 37, name: "Lòng dũng cảm", desc: "Dám đương đầu với khó khăn, sợ hãi và bất công.", details: "Không chùn bước trước nghịch cảnh, dám lên tiếng bảo vệ lẽ phải và sẵn sàng nhận rủi ro.", context: "đứng lên đương đầu trực diện với nỗi sợ hãi lớn nhất của mình để bảo vệ lẽ phải" },
  { id: 38, name: "Sự bình đẳng", desc: "Đối xử công bằng, tôn trọng mọi người không phân biệt.", details: "Chống lại sự phân biệt đối xử. Đấu tranh cho một xã hội nơi ai cũng có cơ hội ngang nhau.", context: "sống trong một thế giới hoàn toàn công bằng, nơi mọi người đều được đối xử bình đẳng và tôn trọng" },
  { id: 39, name: "Sự cống hiến", desc: "Dành trọn tâm huyết cho một lý tưởng hoặc công việc.", details: "Làm việc quên mình vì một mục đích cao cả hơn, không màng đến lợi ích vật chất.", context: "được dốc cạn tâm huyết cả đời cho một lý tưởng vĩ đại mang lại lợi ích cho nhân loại" },
  { id: 40, name: "Tự kỷ luật", desc: "Nghiêm khắc với bản thân, giữ vững nguyên tắc.", details: "Có khả năng kiểm soát ham muốn nhất thời để tập trung cho mục tiêu dài hạn.", context: "luôn giữ được kỷ luật thép, không bao giờ bị cám dỗ bởi những thú vui nhất thời" },
  { id: 41, name: "Trách nhiệm", desc: "Dám làm dám chịu, hoàn thành nghĩa vụ được giao.", details: "Không bao giờ đổ lỗi cho hoàn cảnh hay người khác. Khi đã nhận việc sẽ đảm bảo làm đến cùng.", context: "hoàn thành xuất sắc và gánh vác trọn vẹn trách nhiệm với mọi người xung quanh mà không kêu ca" }
];

let selectedCount = 0; // Số lượng thẻ đã được tương tác
let userRatings = {}; // Key: item.id, Value: 0 (Chưa chọn), 1 (Quan trọng), 2 (Rất quan trọng)

let topValues = [];
let selectedTop7 = [];

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');
const gridArea = document.getElementById('gridArea');
const s1Count = document.getElementById('s1-count');
const btnNext1 = document.getElementById('btnNext1');

// Trả về HTML của một thẻ giá trị
function createCardHTML(val) {
  return `
    <div class="flip-card" id="card-${val.id}">
      <div class="tick-mark" id="tick-${val.id}" title="Đánh dấu Rất quan trọng">
        <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
      </div>
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="fc-title">${val.name}</div>
          <div class="fc-desc">${val.desc}</div>
        </div>
        <div class="flip-card-back">
          <div class="fc-title" style="color: var(--warm-orange); font-size: 1rem;">${val.name}</div>
          <div class="fc-details">${val.details}</div>
        </div>
      </div>
    </div>
  `;
}

// Gắn Event Listener cho thẻ
function bindCardEvents(val) {
  const card = document.getElementById(`card-${val.id}`);
  const tick = document.getElementById(`tick-${val.id}`);
  let flipTimeout;

  // Click vào thẻ (phần thân) -> Lật & đánh dấu Quan trọng
  card.addEventListener('click', (e) => {
    if(e.target.closest('.tick-mark')) return;
    
    if (userRatings[val.id] === 0) {
      selectedCount++;
      updateProgress1();
    }

    if (userRatings[val.id] !== 2) {
      userRatings[val.id] = 1;
      card.classList.add('status-1');
    }
    
    card.classList.add('flipped');
    
    clearTimeout(flipTimeout);
    flipTimeout = setTimeout(() => {
      card.classList.remove('flipped');
    }, 5000);
  });

  // Click vào Tick Mark -> Rất quan trọng
  tick.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (userRatings[val.id] === 0) {
      selectedCount++;
      updateProgress1();
    }

    userRatings[val.id] = 2;
    card.classList.remove('status-1');
    card.classList.add('status-2');
    card.classList.add('blinking');
    
    card.classList.add('flipped');
    
    clearTimeout(flipTimeout);
    flipTimeout = setTimeout(() => {
      card.classList.remove('flipped');
      card.classList.remove('blinking');
    }, 5000);
  });
}

// Khởi tạo thẻ Grid mặc định
function initGrid() {
  rawValues.forEach(val => {
    userRatings[val.id] = 0; // Default chưa chọn
    const cardHTML = createCardHTML(val);
    gridArea.insertAdjacentHTML('beforeend', cardHTML);
    bindCardEvents(val);
  });

  // Event click ra ngoài để úp tất cả thẻ đang lật
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.flip-card')) {
      document.querySelectorAll('.flip-card.flipped').forEach(c => {
        c.classList.remove('flipped');
        c.classList.remove('blinking');
      });
    }
  });

  initCustomValueModal();
}

// Xử lý Modal thêm giá trị tự định nghĩa
function initCustomValueModal() {
  const btnAddCustom = document.getElementById('btnAddCustom');
  const customValueModal = document.getElementById('customValueModal');
  const btnCancelCustom = document.getElementById('btnCancelCustom');
  const btnSaveCustom = document.getElementById('btnSaveCustom');
  
  const inputName = document.getElementById('customValueName');
  const inputDesc = document.getElementById('customValueDesc');

  // ARIA: sết modal semantics (chỉ gán một lần, không lặp)
  customValueModal.setAttribute('role', 'dialog');
  customValueModal.setAttribute('aria-modal', 'true');
  customValueModal.setAttribute('aria-labelledby', 'customValueModalTitle');

  let _lastFocusEl = null;

  // Focus trap: các phần tử focusable trong modal
  const focusableSelectors = 'input, button, [tabindex]:not([tabindex="-1"])';
  function getFocusable() {
    return Array.from(customValueModal.querySelectorAll(focusableSelectors)).filter(el => !el.disabled);
  }

  function openModal() {
    _lastFocusEl = document.activeElement;
    inputName.value = '';
    inputDesc.value = '';
    customValueModal.classList.add('active');
    inputName.focus();
  }

  function closeModal() {
    customValueModal.classList.remove('active');
    if (_lastFocusEl) { _lastFocusEl.focus(); }
  }

  btnAddCustom.onclick = openModal;

  btnCancelCustom.onclick = closeModal;

  customValueModal.onclick = (e) => {
    if (e.target === customValueModal) {
      closeModal();
    }
  };

  // Escape đóng modal và trả focus
  customValueModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closeModal();
      return;
    }
    // Focus trap: giữ focus trong modal khi nhấn Tab
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  btnSaveCustom.onclick = () => {
    const nameVal = inputName.value.trim();
    const descVal = inputDesc.value.trim();

    if (!nameVal) {
      alert('Vui lòng nhập tên giá trị cốt lõi!');
      return;
    }

    const newId = rawValues.length + 1000; // Tránh trùng lặp ID mặc định
    const newVal = {
      id: newId,
      name: nameVal,
      desc: descVal || 'Giá trị cốt lõi tự định nghĩa.',
      details: descVal || 'Giá trị cốt lõi do bạn tự định nghĩa và thêm mới vào la bàn.',
      context: `sống và theo đuổi giá trị "${nameVal}"`
    };

    rawValues.push(newVal);
    userRatings[newId] = 2; // Tự động chọn làm Rất quan trọng
    selectedCount++;
    updateProgress1();

    const cardHTML = createCardHTML(newVal);
    gridArea.insertAdjacentHTML('afterbegin', cardHTML);
    
    const newCard = document.getElementById(`card-${newId}`);
    newCard.classList.add('status-2', 'blinking', 'flipped');
    bindCardEvents(newVal);

    setTimeout(() => {
      newCard.classList.remove('flipped', 'blinking');
    }, 5000);

    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

function updateProgress1() {
  s1Count.innerText = selectedCount;
}

// Bắt sự kiện nút quay lại trong header để điều hướng lùi bước thay vì thoát hẳn trang
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
  backBtn.removeAttribute('href');
  backBtn.style.cursor = 'pointer';
  backBtn.onclick = (e) => {
    e.preventDefault();
    if (step4.classList.contains('active')) {
      step4.classList.remove('active');
      step3.classList.add('active');
    } else if (step3.classList.contains('active')) {
      step3.classList.remove('active');
      step2.classList.add('active');
    } else if (step2.classList.contains('active')) {
      step2.classList.remove('active');
      step1.classList.add('active');
    } else {
      window.location.href = 'index.html';
    }
  };
}

btnNext1.addEventListener('click', () => {
  finishStep1();
});

// ----------------------------------------------------
// STEP 2: Lọc TOP 7
function finishStep1() {
  // Lọc ra tất cả các thẻ đã chọn (Quan trọng hoặc Rất quan trọng)
  const totalSelected = rawValues.filter(v => userRatings[v.id] === 1 || userRatings[v.id] === 2);
  
  if (totalSelected.length < 7) {
    alert("Vui lòng chọn tối thiểu 7 giá trị (bằng cách click lật thẻ 'Quan trọng' hoặc tick 'Rất quan trọng') để tiếp tục!");
    return;
  }

  // Lọc ra những cái "Rất quan trọng" (rating == 2)
  topValues = rawValues.filter(v => userRatings[v.id] === 2);
  
  if (topValues.length < 7) {
    // Nếu chọn quá ít thẻ "Rất quan trọng", bù thêm TẤT CẢ những thẻ "Quan trọng" (rating == 1)
    // để user tự lọc lại đủ 7 thẻ ở bước sau thay vì tự động cắt bỏ.
    const tier1 = rawValues.filter(v => userRatings[v.id] === 1);
    topValues = topValues.concat(tier1);
  }

  // Chuyển UI
  step1.classList.remove('active');
  step2.classList.add('active');
  
  renderTopValues();

  if (topValues.length > 7) {
    setTimeout(() => {
      alert(`Bạn có đến ${topValues.length} giá trị nổi bật. Vui lòng tick chọn lọc lại đúng 7 giá trị cốt lõi nhất ở bước này nhé!`);
    }, 100);
  } else if (topValues.length === 7) {
    // Tự động auto-select cả 7 cái
    selectedTop7 = [...topValues];
    renderTopValues();
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
    
    // Nếu đã tự động auto-select (trường hợp <= 7 thẻ)
    if (selectedTop7.find(v => v.id === item.id)) {
      el.classList.add('selected');
    }
    
    el.onclick = () => toggleSelectTop7(item, el);
    topValuesList.appendChild(el);
  });
  
  selectionCount.innerText = selectedTop7.length;
  btnNext2.disabled = (selectedTop7.length !== 7);
}

function toggleSelectTop7(item, el) {
  const idx = selectedTop7.findIndex(v => v.id === item.id);
  const warningEl = document.getElementById('selectionWarning');
  
  if (idx > -1) {
    selectedTop7.splice(idx, 1);
    el.classList.remove('selected');
    if (warningEl) warningEl.style.display = 'none';
  } else {
    if (selectedTop7.length < 7) {
      selectedTop7.push(item);
      el.classList.add('selected');
      if (warningEl) warningEl.style.display = 'none';
    } else {
      if (warningEl) {
        warningEl.style.display = 'inline-block';
        warningEl.classList.add('blinking');
        setTimeout(() => {
          warningEl.classList.remove('blinking');
        }, 1000);
      }
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
let duelHistory = {}; // Lưu kết quả đối đầu dạng "idA-idB": winnerId

function initDuel() {
  duelPairs = [];
  duelIndex = 0;
  duelScores = {};
  duelHistory = {};

  for (let i = 0; i < selectedTop7.length; i++) {
    duelScores[selectedTop7[i].id] = 0; // init score
  }

  // Tạo cặp đấu theo nguyên tắc: 1 đấu với 6 cái còn lại, 2 đấu với 5 cái còn lại...
  // KHÔNG shuffle toàn bộ để giữ nguyên mạch tập trung
  for (let i = 0; i < selectedTop7.length; i++) {
    for (let j = i + 1; j < selectedTop7.length; j++) {
      duelPairs.push([selectedTop7[i], selectedTop7[j]]);
    }
  }
  
  renderDuel();
}

const duelA = document.getElementById('duelA');
const duelB = document.getElementById('duelB');
const duelCurrent = document.getElementById('duelCurrent');
const conflictScenario = document.getElementById('conflictScenario');

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

  // Hiển thị câu hỏi Giữ lại giá trị nào (YC-2)
  conflictScenario.innerHTML = `Giữa việc <strong style="color:var(--warm-orange);">${pair[0].context}</strong> và việc <strong style="color:var(--warm-orange);">${pair[1].context}</strong>, bạn sẽ <strong>GIỮ LẠI</strong> điều nào?`;
}

function handleDuelClick(winnerId) {
  const pair = duelPairs[duelIndex];
  // Lưu lịch sử thắng trận
  duelHistory[`${pair[0].id}-${pair[1].id}`] = winnerId;
  
  duelScores[winnerId] += 1;
  duelIndex++;
  renderDuel();
}

// ----------------------------------------------------
// STEP 4: RESULTS
let latestRankedData = [];

function finishDuel() {
  step3.classList.remove('active');
  const stepInfo = document.getElementById('stepInfo');
  if (stepInfo) {
    stepInfo.classList.add('active');
  } else {
    step4.classList.add('active');
  }
  
  // Tính rank
  const ranked = selectedTop7.map(item => {
    return { ...item, score: duelScores[item.id] };
  }).sort((a, b) => b.score - a.score); // Giảm dần
  
  latestRankedData = ranked;
  savePvResultToLocalStorage(null, null, ranked);
  // Không renderResults ngay mà chờ user submit form (hoặc sửa form)
  initReportFormEvents();
}

function savePvResultToLocalStorage(fullName, email, ranked) {
  try {
    const list = ranked || latestRankedData || [];
    const nameVal = (fullName || document.getElementById('reportFullName')?.value || '').trim();
    const emailVal = (email || document.getElementById('reportEmail')?.value || '').trim();
    const payload = {
      fullName: nameVal,
      email: emailVal,
      rankedData: list,
      top7: list.slice(0, 7),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('dhm_personal_values_latest', JSON.stringify(payload));
    if (emailVal) {
      const emailLower = emailVal.toLowerCase();
      localStorage.setItem('dhm_pv_' + emailLower, JSON.stringify(payload));
      
      const histKey = 'dhm_pv_history_' + emailLower;
      let history = [];
      try {
        const existing = localStorage.getItem(histKey);
        if (existing) history = JSON.parse(existing);
        if (!Array.isArray(history)) history = [];
      } catch (e) { history = []; }
      
      const isDuplicate = history.some(item => 
        item.timestamp && (Math.abs(new Date(payload.timestamp).getTime() - new Date(item.timestamp).getTime()) < 10000)
      );
      if (!isDuplicate) {
        history.unshift(payload);
        if (history.length > 20) history = history.slice(0, 20);
        localStorage.setItem(histKey, JSON.stringify(history));
      }
    }
  } catch (err) {
    console.warn('LMS LocalStorage sync notice:', err);
  }
}

function renderResults(ranked) {
  const listEl = document.getElementById('resultRanking');
  if (listEl) {
    listEl.innerHTML = '';
  }
  
  const labels = [];
  const data = [];
  
  ranked.forEach((item, index) => {
    labels.push(item.name);
    data.push(item.score);
    
    if (listEl) {
      listEl.innerHTML += `
        <div class="rank-item">
          <div class="rank-num">#${index + 1}</div>
          <div class="rank-name">${item.name}</div>
          <div class="rank-score">${item.score} điểm</div>
        </div>
      `;
    }
  });
  
  // [YC-1 DISABLED 2026-07-17] Schwartz đã được thay bằng card 'Ý Nghĩa La Bàn' trong HTML
  // renderSchwartzDimensions(ranked);
  
  // Vẽ Radar Chart - Bánh xe 7 đỉnh (Chủ đề sáng, sắc nét)
  const ctx = document.getElementById('resultChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Sức mạnh Giá trị',
        data: data,
        backgroundColor: 'rgba(234, 88, 12, 0.2)', // gradient style color
        borderColor: 'rgba(234, 88, 12, 1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(234, 88, 12, 1)',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverRadius: 6,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.2,
      scales: {
        r: {
          angleLines: { 
            color: [
              'rgba(28, 25, 23, 0.25)', 
              'rgba(28, 25, 23, 0.25)',
              'rgba(28, 25, 23, 0.25)',
              'rgba(28, 25, 23, 0.25)',
              'rgba(28, 25, 23, 0.25)',
              'rgba(28, 25, 23, 0.25)',
              'rgba(28, 25, 23, 0.25)'
            ],
            lineWidth: 1.5 
          }, // Nan hoa sẫm màu chạy từ tâm ra
          grid: { 
            color: [
              'rgba(234, 88, 12, 0.1)',   // vong 1
              'rgba(234, 88, 12, 0.2)',   // vong 2
              'rgba(234, 88, 12, 0.3)',   // vong 3
              'rgba(234, 88, 12, 0.4)',   // vong 4
              'rgba(234, 88, 12, 0.5)',   // vong 5
              'rgba(234, 88, 12, 0.7)'    // vong 6
            ], 
            circular: false,
            lineWidth: 2
          }, // Vòng bánh xe đa giác có màu đậm dần
          pointLabels: {
            color: '#1c1917', // Tên trị cốt lõi màu sẫm rõ nét
            font: { 
              size: 14, 
              family: "'Be Vietnam Pro', sans-serif", 
              weight: 'bold' 
            }
          },
          ticks: { 
            display: true, 
            stepSize: 1,
            color: 'rgba(28, 25, 23, 0.7)',
            backdropColor: 'transparent',
            font: { size: 11, weight: 'bold' }
          }, // Thể hiện số điểm toả ra từ tâm (0 -> 6)
          suggestedMin: 0,
          suggestedMax: 6
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(28, 25, 23, 0.9)',
          titleFont: { family: "'Be Vietnam Pro', sans-serif", size: 14, weight: 'bold' },
          bodyFont: { family: "'Be Vietnam Pro', sans-serif", size: 14 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false
        }
      }
    }
  });

  // Gọi hàm vẽ ma trận 7x7
  renderMatrixTable(ranked);
}

/* [YC-1 DISABLED 2026-07-17]
function renderSchwartzDimensions(ranked) {
  const mapping = {
    "Thành tựu": "SE", "Sự thăng tiến": "SE", "Thu nhập cao": "SE", "Tính Độc Lập": "SE", "Lãnh đạo": "SE", "Được ghi nhận": "SE", "Thành công": "SE", "Nổi tiếng": "SE", "Độc lập": "SE", "Ảnh hưởng": "SE", "Sức mạnh": "SE", "Thanh thế": "SE", "Chất lượng làm việc": "SE", "Tài sản": "SE", "Cạnh tranh": "SE",
    "Phiêu lưu": "OC", "Sự tự chủ": "OC", "Sự sáng tạo": "OC", "Sự đa dạng": "OC", "Linh hoạt/Thích ứng": "OC", "Tự do": "OC", "Sự hài hước": "OC", "Học tập, phát triển": "OC", "Tự khám phá": "OC", "Niềm vui": "OC", "Tiến bộ": "OC", "Mạo hiểm": "OC", "Cảm nhận về nghệ thuật": "OC", "Sáng tạo": "OC", "Học văn": "OC", "Phát triển cá nhân": "OC", "Thoải mái": "OC",
    "Tình cảm": "ST", "Sự cân bằng": "ST", "Gắn kết cộng đồng": "ST", "Gắn kết gia đình": "ST", "Sự phục vụ": "ST", "Làm việc nhóm": "ST", "Bao dung/Tha thứ": "ST", "Tình bạn": "ST", "Sự bình đẳng": "ST", "Sự cống hiến": "ST", "Lãng mạn": "ST", "Đóng góp": "ST", "Hợp tác": "ST", "Công bằng": "ST", "Hạnh phúc gia đình": "ST", "Tha thứ": "ST", "Giúp đỡ": "ST", "Lòng khoan dung": "ST", "Tính phong phú": "ST",
    "Sự cam kết": "CO", "Sự tự tin": "CO", "Sức khoẻ": "CO", "Sức khỏe": "CO", "Sự trung thực": "CO", "Môi trường làm việc": "CO", "Năng suất": "CO", "Tôn giáo/Tín ngưỡng": "CO", "Sự an toàn": "CO", "An toàn": "CO", "Bình yên": "CO", "Trí tuệ": "CO", "Lòng dũng cảm": "CO", "Tính dũng cảm": "CO", "Tự kỷ luật": "CO", "Trách nhiệm": "CO", "Kiềm chế": "CO", "Bảo đảm kinh tế": "CO", "Sự tĩnh tâm": "CO", "Sự chính trực": "CO", "Trung thành": "CO", "Trật tự": "CO", "Tôn trọng bản thân": "CO", "Tâm linh": "CO", "Chính thống": "CO"
  };

  const scores = { ST: 0, SE: 0, OC: 0, CO: 0 };
  let total = 0;

  ranked.forEach(item => {
    const dim = mapping[item.name];
    if (dim) {
      const val = Number(item.score);
      scores[dim] += val;
      total += val;
    }
  });

  const percent = {
    selfTranscendence: total > 0 ? Math.round((scores.ST / total) * 100) : 25,
    selfEnhancement: total > 0 ? Math.round((scores.SE / total) * 100) : 25,
    opennessToChange: total > 0 ? Math.round((scores.OC / total) * 100) : 25,
    conservation: total > 0 ? Math.round((scores.CO / total) * 100) : 25
  };

  const container = document.getElementById('schwartzDimensionsCard');
  if (container) {
    container.innerHTML = `
      <h3 style="color: var(--warm-orange); margin-top: 0; margin-bottom: 0.8rem; font-weight: 800; font-size: 1.15rem; border-bottom: 1.5px solid rgba(234, 88, 12, 0.1); padding-bottom: 0.5rem;">
        📊 Nhóm Động Lực Chủ Đạo (Schwartz Values)
      </h3>
      <p style="color: var(--mid); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem;">
        Dựa trên 7 giá trị cốt lõi của bạn, hệ thống phân tích xu hướng phân bổ động lực tinh thần của bạn vào 4 nhóm chính theo Lý thuyết Giá trị Schwartz:
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 0.8rem;">
        <div style="padding: 0.8rem 1rem; border-radius: 12px; background: rgba(5, 150, 105, 0.05); border-left: 4px solid #059669;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #059669; font-size: 0.95rem;">
            <span>Vượt lên Bản thân (Self-Transcendence)</span>
            <span>${percent.selfTranscendence}%</span>
          </div>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.82rem; color: var(--mid);">Cam kết vì phúc lợi cộng đồng, học hỏi, cống hiến, tha thứ, tình bè bạn và tình yêu thương.</p>
        </div>
        
        <div style="padding: 0.8rem 1rem; border-radius: 12px; background: rgba(234, 88, 12, 0.05); border-left: 4px solid #ea580c;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #ea580c; font-size: 0.95rem;">
            <span>Khẳng định Bản thân (Self-Enhancement)</span>
            <span>${percent.selfEnhancement}%</span>
          </div>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.82rem; color: var(--mid);">Theo đuổi vị thế, thành công, thăng tiến cá nhân, chất lượng công việc và sự ảnh hưởng.</p>
        </div>
        
        <div style="padding: 0.8rem 1rem; border-radius: 12px; background: rgba(37, 99, 235, 0.05); border-left: 4px solid #2563eb;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #2563eb; font-size: 0.95rem;">
            <span>Sẵn sàng Thay đổi (Openness to Change)</span>
            <span>${percent.opennessToChange}%</span>
          </div>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.82rem; color: var(--mid);">Đề cao sự tự chủ, tư duy độc lập, sức sáng tạo, tự do cá nhân và trải nghiệm phiêu lưu.</p>
        </div>
        
        <div style="padding: 0.8rem 1rem; border-radius: 12px; background: rgba(120, 113, 108, 0.05); border-left: 4px solid #78716c;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #78716c; font-size: 0.95rem;">
            <span>Duy trì Ổn định (Conservation)</span>
            <span>${percent.conservation}%</span>
          </div>
          <p style="margin: 0.2rem 0 0 0; font-size: 0.82rem; color: var(--mid);">Trân trọng kỷ luật bản thân, môi trường làm việc, sự an toàn, trung thực và sức khỏe.</p>
        </div>
      </div>
    `;
  }
}
*/

function renderMatrixTable(ranked) {
  const tableEl = document.getElementById('matrixTable');
  tableEl.innerHTML = '';

  // Xếp theo điểm số đã rank (từ cao đến thấp) làm cho ma trận dễ nhìn
  const items = ranked; 

  // 1. Tạo Header hàng đầu tiên (tiêu đề các cột)
  let headerHTML = '<thead><tr><th style="text-align: left; padding-left: 1rem;">Giá trị</th>';
  items.forEach(item => {
    headerHTML += `<th>${item.name}</th>`;
  });
  headerHTML += '</tr></thead>';
  
  // 2. Tạo nội dung bảng
  let bodyHTML = '<tbody>';
  items.forEach(rowItem => {
    bodyHTML += `<tr><td class="matrix-header-cell">${rowItem.name}</td>`;
    items.forEach(colItem => {
      if (rowItem.id === colItem.id) {
        // Đường chéo chính
        bodyHTML += '<td class="matrix-diagonal">\\</td>';
      } else {
        // Kiểm tra xem rowItem có thắng colItem không
        const key1 = `${rowItem.id}-${colItem.id}`;
        const key2 = `${colItem.id}-${rowItem.id}`;
        
        let winnerId = null;
        if (duelHistory[key1] !== undefined) winnerId = duelHistory[key1];
        else if (duelHistory[key2] !== undefined) winnerId = duelHistory[key2];

        if (winnerId === rowItem.id) {
          bodyHTML += '<td class="matrix-win">✔</td>';
        } else {
          bodyHTML += '<td class="matrix-loss">-</td>';
        }
      }
    });
    bodyHTML += '</tr>';
  });
  bodyHTML += '</tbody>';

  tableEl.innerHTML = headerHTML + bodyHTML;
}

// Khởi chạy
initGrid();

function initReportFormEvents() {
  const btnDownload = document.getElementById('btnDownloadReportPDF');
  const btnSendEmail = document.getElementById('btnSendReportEmail');
  
  if (btnDownload) {
    btnDownload.onclick = () => {
      const fullName = document.getElementById('reportName').value.trim() || 'DH-User';
      const element = document.getElementById('resultReportCard');
      
      btnDownload.disabled = true;
      const origText = btnDownload.innerText;
      btnDownload.innerText = "Đang xuất PDF...";
      
      // Thêm class pdf-export để tối ưu CSS cho 1 trang PDF
      element.classList.add('pdf-export');
      
      // Delay 400ms để Chart.js canvas render xong trước khi capture
      setTimeout(() => {
        const opt = {
          margin:       0.2, // Giảm margin để có thêm không gian
          filename:     `DNA-Gia-Tri-Cot-Loi-${fullName.replace(/\s+/g, '-')}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, allowTaint: true, logging: false, scrollY: 0 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
          btnDownload.disabled = false;
          btnDownload.innerText = origText;
          element.classList.remove('pdf-export');
        }).catch(err => {
          console.error(err);
          btnDownload.disabled = false;
          btnDownload.innerText = origText;
          element.classList.remove('pdf-export');
          alert("Có lỗi xảy ra khi xuất PDF!");
        });
      }, 400);
    };
  }
  
  // Tạo CAPTCHA ngẫu nhiên lần đầu tiên load Form
  generateCaptcha();
  
  if (btnSendEmail) {
    btnSendEmail.onclick = () => {
      const fullName = document.getElementById('reportName').value.trim();
      const email = document.getElementById('reportEmail').value.trim();
      const captchaAnswer = document.getElementById('reportCaptcha').value.trim();
      
      if (!fullName) {
        alert("Vui lòng điền Họ và tên của bạn!");
        return;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Vui lòng điền địa chỉ Email hợp lệ!");
        return;
      }
      if (!captchaAnswer) {
        alert("Vui lòng nhập kết quả xác minh bảo mật!");
        return;
      }
      
      submitPersonalValuesReport(fullName, email, captchaAnswer);
    };
  }
}

let captchaNum1 = 0;
let captchaNum2 = 0;
let captchaToken = 0;

function generateCaptcha() {
  captchaNum1 = Math.floor(Math.random() * 15) + 1;
  captchaNum2 = Math.floor(Math.random() * 15) + 1;
  captchaToken = (captchaNum1 * 3 + captchaNum2 * 7) ^ 90;
  
  const questionEl = document.getElementById('captchaQuestion');
  if (questionEl) {
    questionEl.innerText = `${captchaNum1} + ${captchaNum2} = ?`;
  }
  const captchaInput = document.getElementById('reportCaptcha');
  if (captchaInput) {
    captchaInput.value = '';
  }
}

function submitPersonalValuesReport(fullName, email, captchaAnswer) {
  const btnSendEmail = document.getElementById('btnSendReportEmail');
  btnSendEmail.disabled = true;
  btnSendEmail.innerText = "Đang xử lý dữ liệu...";
  const randomStr = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const callbackName = 'dhm8Jsonp_' + randomStr.substring(0, 20);
  
  window[callbackName] = function(data) {
    cleanup();
    if (data.success) {
      btnSendEmail.innerText = "Đã lưu thành công! Đang mở kết quả...";
      btnSendEmail.style.background = "#059669";
      btnSendEmail.style.boxShadow = "none";
      savePvResultToLocalStorage(fullName, email, latestRankedData);
      setTimeout(() => {
        document.getElementById('stepInfo').classList.remove('active');
        document.getElementById('step4').classList.add('active');
        renderResults(latestRankedData);
        window.scrollTo(0,0);
      }, 800);
    } else {
      btnSendEmail.disabled = false;
      btnSendEmail.innerText = "Hiện kết quả La bàn giá trị cốt lõi cá nhân của bạn";
      alert("Lỗi lưu thông tin: " + (data.message || data.error));
      generateCaptcha();
    }
  };
  
  function cleanup() {
    clearTimeout(timeoutId);
    if (scriptEl && scriptEl.parentNode) {
      scriptEl.parentNode.removeChild(scriptEl);
    }
    try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
  }
  
  const timeoutId = setTimeout(() => {
    cleanup();
    btnSendEmail.disabled = false;
    btnSendEmail.innerText = "Hiện kết quả La bàn giá trị cốt lõi cá nhân của bạn";
    alert("Yêu cầu quá hạn (timeout). Vui lòng kiểm tra mạng hoặc tắt trình chặn quảng cáo (AdBlocker).\n\nHệ thống sẽ mở khóa Kết quả để bạn có thể xem và Tải file PDF trực tiếp.");
    
    // Fallback: Unlock step 4 anyway so they can see result & download PDF
    savePvResultToLocalStorage(fullName, email, latestRankedData);
    document.getElementById('stepInfo').classList.remove('active');
    document.getElementById('step4').classList.add('active');
    renderResults(latestRankedData);
    window.scrollTo(0,0);
  }, 12000);
  
  const webAppUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
  
  // Gửi payload gọn: chỉ name+score để tránh vượt URL query string limit (~2000 chars)
  const rankedSummary = latestRankedData.map(r => ({ name: r.name, score: r.score }));
  
  const payload = {
    action: "submit_pv",
    fullName: fullName,
    email: email,
    rankedData: JSON.stringify(rankedSummary),
    num1: captchaNum1,
    num2: captchaNum2,
    captchaAnswer: captchaAnswer,
    captchaToken: captchaToken,
    callback: callbackName
  };
  
  const queryParams = new URLSearchParams(payload).toString();
  const url = webAppUrl + "?" + queryParams;
  
  const scriptEl = document.createElement('script');
  scriptEl.src = url;
  scriptEl.onerror = function() {
    cleanup();
    btnSendEmail.disabled = false;
    btnSendEmail.innerText = "Hiện kết quả La bàn giá trị cốt lõi cá nhân của bạn";
    alert("Lỗi kết nối tới máy chủ (Thường do mạng hoặc trình chặn quảng cáo AdBlocker).\n\nHệ thống không thể gửi email tự động, nhưng sẽ mở khóa Kết quả để bạn xem và Tải file PDF trực tiếp!");
    
    // Fallback: Unlock step 4 anyway so they can see result & download PDF
    savePvResultToLocalStorage(fullName, email, latestRankedData);
    document.getElementById('stepInfo').classList.remove('active');
    document.getElementById('step4').classList.add('active');
    renderResults(latestRankedData);
    window.scrollTo(0,0);
  };
  document.head.appendChild(scriptEl);
}

// Xử lý nút thu gọn/hiện video ở Step 1
const btnToggleVideo = document.getElementById('btnToggleVideo');
const videoContainer = document.getElementById('videoContainer');
const tutorialVideo = document.getElementById('tutorialVideo');

if (btnToggleVideo && videoContainer) {
  btnToggleVideo.addEventListener('click', () => {
    if (videoContainer.style.display === 'none') {
      videoContainer.style.display = 'block';
      btnToggleVideo.innerHTML = '▼ Ẩn video hướng dẫn';
      if (tutorialVideo) tutorialVideo.play();
    } else {
      videoContainer.style.display = 'none';
      btnToggleVideo.innerHTML = '▶ Xem video hướng dẫn';
      if (tutorialVideo) tutorialVideo.pause();
    }
  });
}

// ==============================================================================
// CỔNG ĐỊNH DANH BẮT BUỘC & KÍCH HOẠT EMAIL (AUTH GATE - BƯỚC 0)
// ==============================================================================
const AUTH_STORAGE_KEY = "dhm_user_auth";
const LMS_AUTH_KEY = "dhm_lms_auth_user";
const AUTH_GATE_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";

let authorizedRoster = [];

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

async function sha256(str) {
  try {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    return "";
  }
}

// Đối chiếu mật khẩu học viên (chuẩn 4 số cuối SĐT / 1234 / 8888 / hash)
async function verifyLearnerPassword(learner, inputPassword) {
  if (!learner) return false;
  const pwd = String(inputPassword || "").trim();
  if (!pwd) return false;

  // 1. Mã khẩn cấp giảng viên
  if (pwd === "8888") return true;

  // 2. Mật khẩu cá nhân đã đổi trong overrides
  try {
    const rawOverrides = localStorage.getItem("dhm_roster_overrides");
    if (rawOverrides) {
      const overrides = JSON.parse(rawOverrides);
      const ov = overrides[learner.email] || overrides[learner.lead_id] || {};
      if (ov.password_hash) {
        const inputHash = await sha256(pwd);
        if (inputHash === ov.password_hash) return true;
        return false;
      }
    }
  } catch (e) {}

  // 3. Mật khẩu mặc định hoặc cấp riêng
  if (learner.default_pwd && pwd === String(learner.default_pwd).trim()) return true;
  if (learner.password && pwd === String(learner.password).trim()) return true;
  if (pwd === "1234") return true; // Hỗ trợ tài khoản Apollo / Admin / Test mặc định 1234

  // 4. Mật khẩu mặc định kế thừa: 4 số cuối Số điện thoại
  if (learner.phone_last4 && pwd === String(learner.phone_last4).trim()) return true;
  const phone = learner.phone || learner.phone_full || learner.phone_raw || "";
  if (phone) {
    const norm = normalizePhone(phone);
    if (norm.length >= 4 && norm.slice(-4) === pwd) return true;
  }

  return false;
}

// Tìm học viên theo Email
function findLearnerByEmail(rawEmail, roster) {
  if (!rawEmail) return null;
  const normEmail = normalizeIdentity(rawEmail);
  const list = roster || authorizedRoster || [];

  for (const item of list) {
    const itemEmail = item.email ? normalizeIdentity(item.email) : "";
    if (itemEmail && itemEmail === normEmail) {
      return {
        lead_id: item.learner_id || "",
        full_name: item.name || item.full_name || item.email,
        email: item.email.toLowerCase().trim(),
        phone: item.phone || item.phone_full || item.phone_raw || "",
        phone_last4: item.phone_last4 || (item.phone ? normalizePhone(item.phone).slice(-4) : ""),
        default_pwd: item.default_pwd || "",
        password: item.password || "",
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
        if (ovEmail && ovEmail === normEmail) {
          return {
            lead_id: ov.learner_id || "",
            full_name: ov.name || ov.full_name || ov.email,
            email: ov.email.toLowerCase().trim(),
            phone: ov.phone || "",
            phone_last4: ov.phone_last4 || (ov.phone ? normalizePhone(ov.phone).slice(-4) : ""),
            default_pwd: ov.default_pwd || "",
            password: ov.password || "",
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

// Đối chiếu danh bạ học viên (hỗ trợ cả input tổng quát)
function findLearnerInRoster(rawInput, roster) {
  if (!rawInput) return null;
  const normInput = normalizeIdentity(rawInput);
  const normPhone = normalizePhone(rawInput);
  const list = roster || authorizedRoster || [];

  // 1. Kiểm tra danh bạ chính thức
  for (const item of list) {
    const itemEmail = item.email ? normalizeIdentity(item.email) : "";
    const itemPhone = item.phone || item.phone_full || item.phone_raw || "";
    const normItemPhone = normalizePhone(itemPhone);

    const emailMatch = itemEmail && itemEmail === normInput;
    const phoneMatch = normPhone && normPhone.length >= 9 && normItemPhone && normItemPhone === normPhone;

    if (emailMatch || phoneMatch) {
      return {
        lead_id: item.learner_id || "",
        full_name: item.name || item.full_name || item.email,
        email: item.email ? item.email.toLowerCase().trim() : (normInput.includes("@") ? normInput : ""),
        phone: item.phone || item.phone_full || normPhone || "",
        phone_last4: item.phone_last4 || (item.phone ? normalizePhone(item.phone).slice(-4) : ""),
        default_pwd: item.default_pwd || "",
        password: item.password || "",
        cohort: item.cohort || "Học viên",
        role: item.role || "Learner",
        status: "verified"
      };
    }
  }

  // 2. Kiểm tra thêm trong overrides nếu có
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
            phone_last4: ov.phone_last4 || (ov.phone ? normalizePhone(ov.phone).slice(-4) : ""),
            default_pwd: ov.default_pwd || "",
            password: ov.password || "",
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

    // Tầng 3: Kiểm tra phiên La Bàn Giá Trị (dhm_user_auth)
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
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày
    const authData = {
      lead_id: profile.lead_id || "",
      full_name: profile.full_name || profile.fullName || profile.name || "",
      phone: profile.phone || "",
      email: (profile.email || "").toLowerCase().trim(),
      cohort: profile.cohort || "Học viên",
      role: profile.role || "Learner",
      status: "verified",
      verified_at: now.toISOString(),
      expires_at: expiresAt.toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    return authData;
  } catch (e) {
    console.warn("Không thể lưu dhm_user_auth:", e);
    return profile;
  }
}

function fillReportFields(auth) {
  if (!auth) return;
  const repName = document.getElementById("reportName");
  const repEmail = document.getElementById("reportEmail");
  if (repName && !repName.value) repName.value = auth.full_name || auth.fullName || auth.name || "";
  if (repEmail && !repEmail.value) repEmail.value = auth.email || "";
}

function syncSurveyCompletionToHub(email, surveyType, resultSummary) {
  try {
    const payload = {
      action: "sync_survey_completion",
      email: email,
      survey_type: surveyType,
      result_summary: resultSummary || "Hoàn thành La bàn Giá trị Cốt lõi"
    };
    if (navigator.sendBeacon) {
      navigator.sendBeacon(AUTH_GATE_WEBHOOK_URL, JSON.stringify(payload));
    } else {
      fetch(AUTH_GATE_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  } catch (e) {}
}

async function initAuthGate() {
  const modal = document.getElementById("authGateModal");
  if (!modal) return;

  const formSection = document.getElementById("agFormSection");
  const rosterSection = document.getElementById("agRosterSection");
  const trialSection = document.getElementById("agTrialSection");
  const waitingSection = document.getElementById("agWaitingSection");
  const successSection = document.getElementById("agSuccessSection");

  const emailLoginInput = document.getElementById("agEmailLogin");
  const passwordLoginInput = document.getElementById("agPasswordLogin");
  const btnTogglePwd = document.getElementById("agBtnTogglePwd");
  const rosterMsg = document.getElementById("agRosterMsg");
  const btnVerifyRoster = document.getElementById("agBtnVerifyRoster");
  const linkOpenTrial = document.getElementById("agLinkOpenTrial");
  const btnBackToRoster = document.getElementById("agBtnBackToRoster");

  const fullNameInput = document.getElementById("agFullName");
  const phoneInput = document.getElementById("agPhone");
  const emailInput = document.getElementById("agEmail");
  const consentInput = document.getElementById("agConsent");
  const errorMsg = document.getElementById("agErrorMsg");
  const btnSubmit = document.getElementById("agBtnSubmit");
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
              <p style="font-size: 0.88rem; color: #475569; margin: 0;">Chào mừng <strong>${saved.full_name || saved.email}</strong>. Đang mở khóa bài khảo sát...</p>
            `;
          }
          fillReportFields(saved);
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
    const saved = saveUserAuth(profile);
    modal.style.display = "none";
    fillReportFields(saved);
    return;
  }

  // 3. Tầng 2 & 3: Kiểm tra phiên đã lưu (LMS session hoặc PV session)
  const currentAuth = getStoredUserAuth();
  if (currentAuth) {
    modal.style.display = "none";
    fillReportFields(currentAuth);
    return;
  }

  // 4. Nếu chưa có phiên xác thực -> Mở Modal Step 0 với Giai đoạn 1 Roster-First
  modal.style.display = "flex";
  if (formSection) formSection.style.display = "block";
  if (rosterSection) rosterSection.style.display = "block";
  if (trialSection) trialSection.style.display = "none";
  if (waitingSection) waitingSection.style.display = "none";
  if (successSection) successSection.style.display = "none";
  if (emailLoginInput) setTimeout(() => emailLoginInput.focus(), 150);

  // Toggle ẩn/hiện mật khẩu
  if (btnTogglePwd && passwordLoginInput) {
    btnTogglePwd.onclick = () => {
      const isPwd = passwordLoginInput.type === "password";
      passwordLoginInput.type = isPwd ? "text" : "password";
      btnTogglePwd.textContent = isPwd ? "🔒 Ẩn mật khẩu" : "👁️ Hiện mật khẩu";
    };
  }

  // Tải trước danh bạ trong nền
  loadAuthorizedRoster();

  // Hàm xử lý đăng nhập khóa cứng (Email & Mật khẩu 4 số cuối SĐT)
  async function verifyRosterLearner() {
    clearRosterMsg();
    const emailVal = emailLoginInput ? emailLoginInput.value.trim().toLowerCase() : "";
    const pwdVal = passwordLoginInput ? passwordLoginInput.value.trim() : "";

    if (!emailVal) {
      showRosterMsg("Vui lòng nhập Email học viên đã đăng ký với BTC.");
      if (emailLoginInput) emailLoginInput.focus();
      return;
    }
    if (!emailVal.includes("@")) {
      showRosterMsg("Địa chỉ email không hợp lệ (cần có ký tự @).");
      if (emailLoginInput) emailLoginInput.focus();
      return;
    }
    if (!pwdVal) {
      showRosterMsg("Vui lòng nhập Mật khẩu truy cập (4 số cuối Số điện thoại của bạn).");
      if (passwordLoginInput) passwordLoginInput.focus();
      return;
    }

    if (btnVerifyRoster) {
      btnVerifyRoster.disabled = true;
      btnVerifyRoster.innerHTML = `<span>⏳ Đang xác thực tài khoản...</span>`;
    }

    const roster = await loadAuthorizedRoster();
    const learner = findLearnerByEmail(emailVal, roster);

    if (!learner) {
      if (btnVerifyRoster) {
        btnVerifyRoster.disabled = false;
        btnVerifyRoster.innerHTML = `<span>🚀 Đăng Nhập & Vào Làm Bài</span>`;
      }
      showRosterMsg(`⚠️ Email <strong>${emailVal}</strong> chưa nằm trong danh sách học viên chính thức. Vui lòng kiểm tra lại hoặc đăng ký trải nghiệm bên dưới.`);
      if (emailInput) emailInput.value = emailVal;
      return;
    }

    // Học viên tồn tại -> Kiểm tra mật khẩu (4 số cuối SĐT / 1234 / 8888)
    const isPwdValid = await verifyLearnerPassword(learner, pwdVal);
    if (!isPwdValid) {
      if (btnVerifyRoster) {
        btnVerifyRoster.disabled = false;
        btnVerifyRoster.innerHTML = `<span>🚀 Đăng Nhập & Vào Làm Bài</span>`;
      }
      showRosterMsg(`❌ Mật khẩu không chính xác. Mật khẩu mặc định là 4 số cuối Số điện thoại bạn đã đăng ký với BTC (hoặc 1234).`);
      if (passwordLoginInput) {
        passwordLoginInput.value = "";
        passwordLoginInput.focus();
      }
      return;
    }

    // Đăng nhập thành công 100%
    showRosterMsg(`✓ Chào mừng <strong>${learner.full_name}</strong> (${learner.cohort})! Đang mở khóa bài khảo sát...`, true);
    const saved = saveUserAuth(learner);
    fillReportFields(saved);
    setTimeout(() => {
      modal.style.display = "none";
    }, 800);
  }

  if (btnVerifyRoster) {
    btnVerifyRoster.onclick = verifyRosterLearner;
  }
  if (emailLoginInput) {
    emailLoginInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (passwordLoginInput) passwordLoginInput.focus();
      }
    });
  }
  if (passwordLoginInput) {
    passwordLoginInput.addEventListener("keydown", (e) => {
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

  // Bộ đếm gửi lại email trial
  let countdownInterval = null;
  function startCountdown(sec) {
    let remain = sec || 60;
    if (btnResend) {
      btnResend.disabled = true;
      btnResend.style.cursor = "not-allowed";
      btnResend.style.background = "#f1f5f9";
      btnResend.style.color = "#94a3b8";
    }
    if (countdownSpan) countdownSpan.innerText = remain;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      remain--;
      if (countdownSpan) countdownSpan.innerText = remain;
      if (remain <= 0) {
        clearInterval(countdownInterval);
        if (btnResend) {
          btnResend.disabled = false;
          btnResend.style.cursor = "pointer";
          btnResend.style.background = "#d97706";
          btnResend.style.color = "#ffffff";
          btnResend.innerText = "Gửi lại liên kết mới";
        }
      }
    }, 1000);
  }

  // Gửi yêu cầu đăng ký trải nghiệm trial
  function sendRegisterRequest() {
    clearTrialError();
    const fullName = fullNameInput ? fullNameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim().replace(/\s+/g, "") : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";

    if (!fullName) {
      showTrialError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!phone || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)) {
      showTrialError("Vui lòng nhập số điện thoại hợp lệ (10 chữ số).");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showTrialError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    if (consentInput && !consentInput.checked) {
      showTrialError("Vui lòng đồng ý điều khoản bảo mật theo Nghị định 13 để tiếp tục.");
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerText = "Đang gửi liên kết...";
    }

    const payload = {
      action: "register_or_request_link",
      full_name: fullName,
      phone: phone,
      email: email,
      survey_type: "GTCL"
    };

    fetch(AUTH_GATE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .catch(() => ({
        success: true,
        message: "Đã gửi liên kết kích hoạt."
      }))
      .then(res => {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = "Nhận Liên Kết Kích Hoạt Qua Email";
        }

        if (res && res.success) {
          if (formSection) formSection.style.display = "none";
          if (waitingSection) waitingSection.style.display = "block";
          if (waitingEmail) waitingEmail.innerText = email;
          startCountdown(60);
        } else {
          showTrialError(res.message || "Không thể gửi email. Vui lòng kiểm tra lại thông tin.");
        }
      });
  }

  if (btnSubmit) {
    btnSubmit.onclick = sendRegisterRequest;
  }
  if (btnResend) {
    btnResend.onclick = () => {
      sendRegisterRequest();
    };
  }
}

// Kích hoạt Cổng Định Danh ngay khi tải trang
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuthGate);
} else {
  initAuthGate();
}
