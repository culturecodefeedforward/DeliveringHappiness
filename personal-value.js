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

  btnAddCustom.onclick = () => {
    inputName.value = '';
    inputDesc.value = '';
    customValueModal.classList.add('active');
    inputName.focus();
  };

  btnCancelCustom.onclick = () => {
    customValueModal.classList.remove('active');
  };

  customValueModal.onclick = (e) => {
    if (e.target === customValueModal) {
      customValueModal.classList.remove('active');
    }
  };

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

    customValueModal.classList.remove('active');
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
    // Nếu chọn quá ít, bù thêm những cái "Quan trọng" (rating == 1)
    const tier1 = rawValues.filter(v => userRatings[v.id] === 1);
    const needed = 7 - topValues.length;
    topValues = topValues.concat(tier1.slice(0, needed));
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

  // Hiển thị tình huống giằng xé chi tiết
  conflictScenario.innerHTML = `Giữa việc <strong style="color:var(--warm-orange);">${pair[0].context}</strong> và việc <strong style="color:var(--warm-orange);">${pair[1].context}</strong>, bạn sẽ nhượng bộ điều gì để giữ lại điều kia?`;
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
  step4.classList.add('active');
  
  // Tính rank
  const ranked = selectedTop7.map(item => {
    return { ...item, score: duelScores[item.id] };
  }).sort((a, b) => b.score - a.score); // Giảm dần
  
  latestRankedData = ranked;
  renderResults(ranked);
  initReportFormEvents();
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
  
  // Tính toán và hiển thị nhóm động lực Schwartz
  renderSchwartzDimensions(ranked);
  
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
            color: 'rgba(28, 25, 23, 0.25)', 
            lineWidth: 1.5 
          }, // Nan hoa sẫm màu chạy từ tâm ra
          grid: { 
            color: 'rgba(28, 25, 23, 0.15)', 
            circular: false,
            lineWidth: 1
          }, // Vòng bánh xe đa giác
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
            color: 'rgba(28, 25, 23, 0.4)',
            backdropColor: 'transparent',
            font: { size: 10 }
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
      
      // Delay 400ms để Chart.js canvas render xong trước khi capture
      setTimeout(() => {
        const opt = {
          margin:       0.5,
          filename:     `DNA-Gia-Tri-Cot-Loi-${fullName.replace(/\s+/g, '-')}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, allowTaint: true, logging: false },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
          btnDownload.disabled = false;
          btnDownload.innerText = origText;
        }).catch(err => {
          console.error(err);
          btnDownload.disabled = false;
          btnDownload.innerText = origText;
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
  btnSendEmail.innerText = "Đang gửi báo cáo...";
  
  const callbackName = 'pvJsonp_' + Math.random().toString(36).substring(2, 15);
  
  window[callbackName] = function(data) {
    cleanup();
    if (data.success) {
      btnSendEmail.innerText = "Gửi thành công! Check mail nhé";
      btnSendEmail.style.background = "#059669";
      btnSendEmail.style.boxShadow = "none";
      alert(data.message || "Đã gửi yêu cầu gửi báo cáo! Vui lòng kiểm tra hộp thư của bạn sau vài phút.");
    } else {
      btnSendEmail.disabled = false;
      btnSendEmail.innerText = "Gửi báo cáo qua Email";
      alert("Lỗi gửi báo cáo: " + (data.message || data.error));
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
    btnSendEmail.innerText = "Gửi báo cáo qua Email";
    alert("Yêu cầu gửi báo cáo quá hạn (timeout). Vui lòng kiểm tra kết nối mạng và thử lại.");
    generateCaptcha();
  }, 12000);
  
  const webAppUrl = "https://script.google.com/macros/s/AKfycbw0vTBMod1rp4f_906BcjwXbPhlb9ltiDiwVPdaOg4fOWZZOlpmy7jp2fOSrETQQe9PZQ/exec";
  
  // Gửi payload gọn: chỉ name+score để tránh vượt URL query string limit (~2000 chars)
  const rankedSummary = latestRankedData.map(r => ({ n: r.name, s: r.score }));
  
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
    btnSendEmail.innerText = "Gửi báo cáo qua Email";
    alert("Lỗi kết nối: Không thể gửi tới máy chủ Google. Vui lòng kiểm tra mạng và thử lại.");
    generateCaptcha();
  };
  document.head.appendChild(scriptEl);
}

