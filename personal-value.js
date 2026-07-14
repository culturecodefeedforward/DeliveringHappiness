const rawValues = [
    { id: 1, name: "Thành công", desc: "Đạt kết quả, hoàn thành nhiệm vụ" },
    { id: 2, name: "Tiến bộ", desc: "Luôn tiến lên phía trước, phát triển không ngừng" },
    { id: 3, name: "Mạo hiểm", desc: "Những mạo hiểm mới, đầy thách thức, hồi hộp" },
    { id: 4, name: "Cảm nhận nghệ thuật", desc: "Ca kịch, vẽ, văn học" },
    { id: 5, name: "Tính cân bằng", desc: "Quan tâm sâu sắc đến từng lĩnh vực" },
    { id: 6, name: "Cạnh tranh", desc: "Giành chiến thắng, luôn muốn mạo hiểm" },
    { id: 7, name: "Đóng góp", desc: "Tạo sự khác biệt, luôn cống hiến" },
    { id: 8, name: "Kiềm chế", desc: "Chịu trách nhiệm" },
    { id: 9, name: "Hợp tác", desc: "Làm việc theo tập thể, làm việc tốt với mọi người" },
    { id: 10, name: "Sáng tạo", desc: "Nhạy cảm, nhiều sáng kiến, kinh nghiệm" },
    { id: 11, name: "Bảo đảm kinh tế", desc: "Độc lập về những vấn đề tài chính" },
    { id: 12, name: "Công bằng", desc: "Đưa ra cơ hội đối với tất cả mọi người" },
    { id: 13, name: "Nổi tiếng", desc: "Được nhiều người biết đến" },
    { id: 14, name: "Hạnh phúc gia đình", desc: "Chung sống hòa thuận và coi trọng mọi thành viên" },
    { id: 15, name: "Tình bạn", desc: "Mật thiết, quan tâm và những mối quan hệ thân thuộc" },
    { id: 16, name: "Tha thứ", desc: "Luôn sẵn sàng và rộng lượng" },
    { id: 17, name: "Sức khỏe", desc: "Cơ thể khỏe mạnh, đầy sinh lực và không có bệnh" },
    { id: 18, name: "Độc lập", desc: "Tự quản, không chịu sự quản lý của ai" },
    { id: 19, name: "Ảnh hưởng", desc: "Ý tưởng độc đáo, mọi người xung quanh, quy trình" },
    { id: 20, name: "Sự tĩnh tâm", desc: "Luôn bình thản thư giãn trong lòng" },
    { id: 21, name: "Sự chính trực", desc: "Trung thực, chân thành, sống theo giá trị của mình" },
    { id: 22, name: "Học vấn", desc: "Cam kết luôn lắng nghe, học hỏi" },
    { id: 23, name: "Trung thành", desc: "Trách nhiệm, trung thành, tôn trọng" },
    { id: 24, name: "Yêu thiên nhiên", desc: "Thoải mái hơn khi bước ra thiên nhiên" },
    { id: 25, name: "Trật tự", desc: "Của cơ quan, sự tuân thủ, kiên quyết với những sai trái" },
    { id: 26, name: "Phát triển cá nhân", desc: "Tăng trưởng, sử dụng mọi tiềm lực" },
    { id: 27, name: "Thoải mái", desc: "Hài lòng, thích thú, nhiều niềm vui và hạnh phúc" },
    { id: 28, name: "Sức mạnh", desc: "Sự điều khiển, quyền lực, sự ảnh hưởng" },
    { id: 29, name: "Thanh thế", desc: "Thể hiện qua sự thành công, địa vị, vị thế" },
    { id: 30, name: "Chất lượng làm việc", desc: "Xuất sắc, toàn diện, mắc rất ít lỗi" },
    { id: 31, name: "Sự công nhận", desc: "Về vị thế, sự tôn trọng và thừa nhận" },
    { id: 32, name: "Trách nhiệm", desc: "Luôn đáng tin và chín chắn" },
    { id: 33, name: "An toàn", desc: "Cảm thấy an tâm về mọi chuyện" },
    { id: 34, name: "Giúp đỡ", desc: "Hỗ trợ những người xung quanh và cải thiện xã hội" },
    { id: 35, name: "Tôn trọng bản thân", desc: "Tự hào về bản thân mình" },
    { id: 36, name: "Tâm linh", desc: "Niềm tin mạnh mẽ, sức mạnh đạo đức" },
    { id: 37, name: "Lòng khoan dung", desc: "Coi trọng quan điểm và giá trị của người khác" },
    { id: 38, name: "Chính thống", desc: "Coi trọng quá khứ, phong tục tập quán" },
    { id: 39, name: "Tính đa dạng", desc: "Đa dạng trong hành động và kinh nghiệm" },
    { id: 40, name: "Tài sản", desc: "Giàu có, sung túc và đầy đủ" },
    { id: 41, name: "Tính phong phú", desc: "Hiểu cuộc sống xung quanh, ứng xử công minh" }
];

let userRatings = {}; // id -> rating (0, 1, 2)
let topValues = []; // Array of objects
let selectedTop7 = []; // Array of objects
let duelPairs = [];
let duelIndex = 0;
let scores = {};

document.addEventListener('DOMContentLoaded', () => {
    initStep1();
});

function initStep1() {
    const listEl = document.getElementById('allValuesList');
    listEl.innerHTML = '';
    
    rawValues.forEach(val => {
        const item = document.createElement('div');
        item.className = 'value-item';
        item.innerHTML = `
            <h4>${val.name}</h4>
            <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 10px; min-height: 40px;">${val.desc}</p>
            <div class="rating-group" data-id="${val.id}">
                <button class="rating-btn btn-0" onclick="rateValue(${val.id}, 0, this)">Không Q.Trọng</button>
                <button class="rating-btn btn-1" onclick="rateValue(${val.id}, 1, this)">Hơi Q.Trọng</button>
                <button class="rating-btn btn-2" onclick="rateValue(${val.id}, 2, this)">Rất Q.Trọng</button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

function rateValue(id, rating, btnEl) {
    userRatings[id] = rating;
    const group = btnEl.parentElement;
    group.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('selected'));
    btnEl.classList.add('selected');
    
    checkStep1Completion();
}

function checkStep1Completion() {
    const totalRated = Object.keys(userRatings).length;
    const btnNext = document.getElementById('btnNext1');
    if (totalRated === rawValues.length) {
        btnNext.disabled = false;
        btnNext.innerText = "Tiếp tục Bước 2";
    }
}

document.getElementById('btnNext1').addEventListener('click', () => {
    // Filter out only rating 2
    topValues = rawValues.filter(v => userRatings[v.id] === 2);
    if (topValues.length < 7) {
        alert("Bạn có ít hơn 7 giá trị 'Rất quan trọng'. Vui lòng chọn lại để có ít nhất 7 giá trị.");
        return;
    }
    
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    initStep2();
});

function initStep2() {
    const listEl = document.getElementById('topValuesList');
    listEl.innerHTML = '';
    selectedTop7 = [];
    updateTop7Count();
    
    topValues.forEach(val => {
        const item = document.createElement('div');
        item.className = 'selectable-value';
        item.innerText = val.name;
        item.onclick = () => toggleSelectTop7(val, item);
        listEl.appendChild(item);
    });
}

function toggleSelectTop7(val, element) {
    const index = selectedTop7.findIndex(v => v.id === val.id);
    if (index > -1) {
        selectedTop7.splice(index, 1);
        element.classList.remove('selected');
    } else {
        if (selectedTop7.length >= 7) {
            alert("Chỉ được chọn tối đa 7 giá trị!");
            return;
        }
        selectedTop7.push(val);
        element.classList.add('selected');
    }
    updateTop7Count();
}

function updateTop7Count() {
    document.getElementById('selectionCount').innerText = selectedTop7.length;
    document.getElementById('btnNext2').disabled = selectedTop7.length !== 7;
}

document.getElementById('btnBack2').addEventListener('click', () => {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
});

document.getElementById('btnNext2').addEventListener('click', () => {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    initStep3();
});

function initStep3() {
    // Generate pairwise combinations (21 pairs for 7 items)
    duelPairs = [];
    for (let i = 0; i < selectedTop7.length; i++) {
        for (let j = i + 1; j < selectedTop7.length; j++) {
            duelPairs.push([selectedTop7[i], selectedTop7[j]]);
        }
    }
    
    // Shuffle pairs slightly for random experience
    duelPairs.sort(() => Math.random() - 0.5);
    
    // Init scores
    scores = {};
    selectedTop7.forEach(v => scores[v.id] = 0);
    
    duelIndex = 0;
    renderDuel();
}

function renderDuel() {
    if (duelIndex >= duelPairs.length) {
        finishDuels();
        return;
    }
    
    const pair = duelPairs[duelIndex];
    document.getElementById('duelCurrent').innerText = duelIndex + 1;
    document.getElementById('duelProgress').style.width = ((duelIndex) / duelPairs.length * 100) + '%';
    
    const cardA = document.getElementById('duelA');
    const cardB = document.getElementById('duelB');
    
    cardA.innerText = pair[0].name;
    cardB.innerText = pair[1].name;
    
    cardA.onclick = () => handleDuelChoice(pair[0].id);
    cardB.onclick = () => handleDuelChoice(pair[1].id);
}

function handleDuelChoice(winnerId) {
    scores[winnerId] += 1;
    duelIndex++;
    
    // Add small animation
    const container = document.querySelector('.duel-container');
    container.style.opacity = 0;
    setTimeout(() => {
        renderDuel();
        container.style.opacity = 1;
    }, 200);
}

function finishDuels() {
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step4').classList.add('active');
    
    // Sort results
    const results = selectedTop7.map(v => {
        return { name: v.name, score: scores[v.id] };
    }).sort((a, b) => b.score - a.score);
    
    renderResults(results);
}

function renderResults(results) {
    const html = results.map((r, i) => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">
            <span><strong>#${i+1}</strong> ${r.name}</span>
            <span style="color: var(--warm-yellow); font-weight: bold;">${r.score} điểm</span>
        </div>
    `).join('');
    
    document.getElementById('resultRanking').innerHTML = html;
    
    // ChartJS Radar
    const ctx = document.getElementById('resultChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: results.map(r => r.name),
            datasets: [{
                label: 'Điểm mức độ quan trọng',
                data: results.map(r => r.score),
                backgroundColor: 'rgba(255, 193, 7, 0.4)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 193, 7, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: {
                        font: { size: 14, family: "'Be Vietnam Pro', sans-serif" },
                        color: '#333'
                    },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}
