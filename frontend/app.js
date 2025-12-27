// Frontend App - Chỉ UI logic, gọi API backend
(() => {
  // API Configuration
  const API_URL = 'https://toolbcrvip.vercel.app/api/analyze';
  const API_KEY = 'duchuy208'; // Lưu trong e''nv variable

  // Storage keys
  const STORAGE_HISTORY = 'meta_baccarat_history_v9';
  const STORAGE_STATS = 'meta_baccarat_stats_v9';
  const STORAGE_PREDICTIONS = 'meta_baccarat_predictions_v9';

  // DOM elements
  const elements = {
    predText: document.getElementById('predText'),
    confidenceFill: document.getElementById('confidenceFill'),
    confidenceText: document.getElementById('confidenceText'),
    signalStrength: document.getElementById('signalStrength'),
    kellyIndicator: document.getElementById('kellyIndicator'),
    historyEl: document.getElementById('history'),
    phaseIcon: document.getElementById('phaseIcon'),
    phaseText: document.getElementById('phaseText'),
    methodGrid: document.getElementById('methodGrid'),
    methodBox: document.getElementById('methodBox'),
    toggleBtn: document.getElementById('toggleBtn'),
    aiInsights: document.getElementById('aiInsights'),
    statTotal: document.getElementById('statTotal'),
    statAccuracy: document.getElementById('statAccuracy'),
    statStreak: document.getElementById('statStreak'),
    statSequence: document.getElementById('statSequence'),
    statBankerPct: document.getElementById('statBankerPct'),
    statPlayerPct: document.getElementById('statPlayerPct'),
    statAiScore: document.getElementById('statAiScore'),
    btnBanker: document.getElementById('btnBanker'),
    btnPlayer: document.getElementById('btnPlayer'),
    btnUndo: document.getElementById('btnUndo'),
    btnReset: document.getElementById('btnReset'),
    loadingOverlay: document.getElementById('loadingOverlay')
  };

  const METHODS = [
    { id: 'neural', label: 'Neural', colorClass: 'm-neural' },
    { id: 'deep', label: 'Deep', colorClass: 'm-deep' },
    { id: 'markov', label: 'Markov', colorClass: 'm-markov' },
    { id: 'bayesian', label: 'Bayesian', colorClass: 'm-bayesian' },
    { id: 'ensemble', label: 'Ensemble', colorClass: 'm-ensemble' },
    { id: 'quantum', label: 'Quantum', colorClass: 'm-quantum' },
    { id: 'entropy', label: 'Entropy', colorClass: 'm-entropy' },
    { id: 'pattern', label: 'Pattern', colorClass: 'm-pattern' },
    { id: 'hmm', label: 'HMM', colorClass: 'm-hmm' },
    { id: 'rl', label: 'DeepRL', colorClass: 'm-rl' }
  ];

  let historyData = [];
  let predictionHistory = [];
  let stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
  let collapsed = false;
  let isProcessing = false;

  // ============ STORAGE ============
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY);
      return raw ? JSON.parse(raw).filter(x => x === 'B' || x === 'P') : [];
    } catch (e) { return []; }
  }

  function saveHistory() {
    try { localStorage.setItem(STORAGE_HISTORY, JSON.stringify(historyData)); }
    catch (e) { console.error('Save history error:', e); }
  }

  function loadPredictions() {
    try {
      const raw = localStorage.getItem(STORAGE_PREDICTIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function savePredictions() {
    try { localStorage.setItem(STORAGE_PREDICTIONS, JSON.stringify(predictionHistory)); }
    catch (e) { console.error('Save predictions error:', e); }
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem(STORAGE_STATS);
      return raw ? JSON.parse(raw) : { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    } catch (e) { return { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 }; }
  }

  function saveStats() {
    try { localStorage.setItem(STORAGE_STATS, JSON.stringify(stats)); }
    catch (e) { console.error('Save stats error:', e); }
  }

  // ============ API CALLS ============
  async function callAnalyzeAPI(history) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({ history })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  function showLoading() {
    isProcessing = true;
    elements.loadingOverlay.classList.add('active');
    elements.btnBanker.disabled = true;
    elements.btnPlayer.disabled = true;
  }

  function hideLoading() {
    isProcessing = false;
    elements.loadingOverlay.classList.remove('active');
    elements.btnBanker.disabled = false;
    elements.btnPlayer.disabled = false;
  }

  // ============ STATS ============
  function recalculateStats() {
    stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    let tempStreak = 0;

    predictionHistory.forEach((p) => {
      if (p.pred && p.actual) {
        stats.total++;
        if (p.correct) {
          stats.correct++;
          if (tempStreak >= 0) tempStreak++;
          else tempStreak = 1;
        } else {
          if (tempStreak <= 0) tempStreak--;
          else tempStreak = -1;
        }

        if (tempStreak > stats.longestWin) stats.longestWin = tempStreak;
        if (Math.abs(tempStreak) > stats.longestLoss && tempStreak < 0) stats.longestLoss = Math.abs(tempStreak);
      }
    });

    stats.currentStreak = tempStreak;
    saveStats();
  }

  function calculateAIScore() {
    if (stats.total === 0) return 0;

    const accuracy = stats.correct / stats.total;
    const streakBonus = Math.min(20, stats.longestWin * 2);
    const consistencyScore = stats.currentStreak > 0 ? Math.min(15, stats.currentStreak * 3) : 0;

    const totalScore = (accuracy * 70) + streakBonus + consistencyScore;

    return Math.min(100, Math.round(totalScore));
  }

  // ============ RENDERING ============
  function renderStats() {
    elements.statTotal.textContent = historyData.length;
    elements.statAccuracy.textContent = stats.total > 0 ? `${((stats.correct / stats.total) * 100).toFixed(1)}%` : '--%';
    elements.statStreak.textContent = stats.currentStreak;
    elements.statAiScore.textContent = calculateAIScore();

    if (historyData.length > 0) {
      const last = historyData[historyData.length - 1];
      let seq = 1;
      for (let i = historyData.length - 2; i >= 0; i--) {
        if (historyData[i] === last) seq++;
        else break;
      }
      elements.statSequence.textContent = `${last}×${seq}`;

      const bCount = historyData.filter(x => x === 'B').length;
      const pCount = historyData.filter(x => x === 'P').length;
      const total = historyData.length;
      elements.statBankerPct.textContent = `${((bCount / total) * 100).toFixed(1)}%`;
      elements.statPlayerPct.textContent = `${((pCount / total) * 100).toFixed(1)}%`;
    } else {
      elements.statSequence.textContent = '--';
      elements.statBankerPct.textContent = '--%';
      elements.statPlayerPct.textContent = '--%';
    }
  }

  function renderSignalStrength(conf) {
    elements.signalStrength.innerHTML = '';
    const bars = 5;
    const activeCount = Math.ceil((conf || 0) * bars);

    for (let i = 0; i < bars; i++) {
      const bar = document.createElement('div');
      bar.className = 'signal-bar';
      if (i < activeCount) bar.classList.add('active');
      elements.signalStrength.appendChild(bar);
    }
  }

  function renderKellyIndicator(kellyInfo) {
    if (!kellyInfo || !kellyInfo.kelly || kellyInfo.kelly <= 0) {
      elements.kellyIndicator.textContent = '';
      return;
    }

    const percentage = (kellyInfo.kelly * 100).toFixed(1);
    elements.kellyIndicator.textContent = `💰 Kelly Criterion: ${percentage}% bankroll`;
  }

  function renderHistory() {
    elements.historyEl.innerHTML = '';
    historyData.forEach((r, i) => {
      const chip = document.createElement('div');
      chip.className = 'chip ' + (r === 'B' ? 'banker' : 'player');
      chip.textContent = r;
      chip.title = `#${i + 1} — ${r}`;
      elements.historyEl.appendChild(chip);
    });
    elements.historyEl.scrollTop = elements.historyEl.scrollHeight;
  }

  function renderPrediction(result) {
    if (!result || !result.chosen) {
      elements.predText.textContent = 'Đang phân tích...';
      elements.predText.className = 'pred-value waiting';
      elements.confidenceFill.style.width = '0%';
      elements.confidenceText.textContent = 'Cần thêm dữ liệu';
      renderSignalStrength(0);
      elements.kellyIndicator.textContent = '';
      return;
    }

    const chosen = result.chosen;
    const displayText = chosen.pred === 'B' ? 'BANKER 🔴' : 'PLAYER 🔵';
    elements.predText.textContent = displayText;
    elements.predText.className = 'pred-value ' + (chosen.pred === 'B' ? 'blink-red' : 'blink-blue');

    const confPercent = chosen.conf * 100;
    elements.confidenceFill.style.width = confPercent + '%';

    const confText = `Độ tin cậy: ${confPercent.toFixed(1)}% | ${chosen.method.toUpperCase()} Engine`;
    elements.confidenceText.textContent = confText;

    renderSignalStrength(chosen.conf);
    renderKellyIndicator(result.kelly);
  }

  function renderMethods(result) {
    if (!result) return;

    const { all, chosen, phase } = result;

    elements.phaseIcon.textContent = phase.icon;
    elements.phaseText.textContent = phase.label;
    elements.phaseText.className = 'phase-text ' + phase.class;

    elements.methodGrid.innerHTML = '';
    METHODS.forEach(m => {
      const method = all.find(r => r.method === m.id);
      const card = document.createElement('div');
      card.className = 'method-card ' + m.colorClass;
      if (chosen && chosen.method === m.id) card.classList.add('active');

      const name = document.createElement('div');
      name.className = 'method-name';
      name.textContent = m.label;

      const conf = document.createElement('div');
      conf.className = 'method-conf';
      conf.textContent = method ? `${(method.conf * 100).toFixed(0)}%` : '--';

      card.appendChild(name);
      card.appendChild(conf);

      if (method) {
        const pred = document.createElement('div');
        pred.className = 'method-pred';
        pred.style.background = method.pred === 'B' ?
          'linear-gradient(135deg,#ff2d55,#ff6b9d)' :
          'linear-gradient(135deg,#0a84ff,#5ac8fa)';
        card.appendChild(pred);
      }

      if (method && method.winRate !== undefined) {
        const winRateEl = document.createElement('div');
        winRateEl.className = 'method-winrate';
        winRateEl.textContent = `${method.winRate}% (${method.attempts || 0})`;
        card.appendChild(winRateEl);
      }

      elements.methodGrid.appendChild(card);
    });
  }

  function renderAIInsights(result) {
    if (!result || !result.chosen || historyData.length === 0) {
      elements.aiInsights.textContent = 'Đang chờ dữ liệu để phân tích...';
      return;
    }

    elements.aiInsights.textContent = result.insights || 'AI đang phân tích...';
  }

  async function render() {
    renderHistory();
    renderStats();

    if (historyData.length === 0) {
      elements.predText.textContent = 'Sẵn sàng phân tích';
      elements.predText.className = 'pred-value';
      elements.confidenceFill.style.width = '0%';
      elements.confidenceText.textContent = 'Nhập kết quả để bắt đầu';
      renderSignalStrength(0);
      elements.kellyIndicator.textContent = '';
      renderMethods({ all: [], chosen: null, phase: { id: 'undefined', label: 'Khởi động', icon: '🔮', class: 'phase-undefined' } });
      elements.aiInsights.textContent = 'Đang chờ dữ liệu để phân tích...';
      return;
    }

    try {
      showLoading();
      const result = await callAnalyzeAPI(historyData);
      hideLoading();

      renderPrediction(result);
      renderMethods(result);
      renderAIInsights(result);

      // Store last prediction
      if (result.chosen) {
        sessionStorage.setItem('lastPrediction', JSON.stringify({
          pred: result.chosen.pred,
          method: result.chosen.method,
          phase: result.phase.id
        }));
      }
    } catch (error) {
      hideLoading();
      console.error('Analysis error:', error);
      elements.predText.textContent = 'Lỗi kết nối API';
      elements.predText.className = 'pred-value';
      alert('Không thể kết nối đến server. Vui lòng thử lại!');
    }
  }

  // ============ USER ACTIONS ============
  async function addResult(r) {
    if (r !== 'B' && r !== 'P') return;
    if (isProcessing) return;

    // Check if we had a prediction
    const lastPredStr = sessionStorage.getItem('lastPrediction');
    if (lastPredStr) {
      try {
        const lastPred = JSON.parse(lastPredStr);
        const correct = lastPred.pred === r;
        predictionHistory.push({ pred: lastPred.pred, actual: r, correct });
        savePredictions();
      } catch (e) { }
    }

    historyData.push(r);
    saveHistory();

    recalculateStats();
    await render();
  }

  function undo() {
    if (historyData.length === 0) return;

    historyData.pop();
    saveHistory();

    if (predictionHistory.length > 0 && predictionHistory[predictionHistory.length - 1].actual) {
      predictionHistory.pop();
      savePredictions();
    }

    recalculateStats();
    render();
  }

  function reset() {
    if (!confirm('Xóa toàn bộ lịch sử và bắt đầu mới?')) return;
    historyData = [];
    predictionHistory = [];
    stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    saveHistory();
    savePredictions();
    saveStats();
    sessionStorage.removeItem('lastPrediction');
    render();
  }

  // ============ EVENT LISTENERS ============
  elements.btnBanker.addEventListener('click', () => addResult('B'));
  elements.btnPlayer.addEventListener('click', () => addResult('P'));
  elements.btnUndo.addEventListener('click', undo);
  elements.btnReset.addEventListener('click', reset);

  elements.toggleBtn.addEventListener('click', () => {
    collapsed = !collapsed;
    if (collapsed) {
      elements.methodBox.classList.add('collapsed');
      elements.toggleBtn.textContent = 'Mở rộng ▼';
    } else {
      elements.methodBox.classList.remove('collapsed');
      elements.toggleBtn.textContent = 'Thu gọn ▲';
    }
  });

  // ============ INIT ============
  function init() {
    historyData = loadHistory();
    predictionHistory = loadPredictions();
    stats = loadStats();

    recalculateStats();
    render();
  }

  init();
})();
