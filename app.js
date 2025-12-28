// META BOT PRO - Application Layer (CLEAN VERSION - FIX FREEZE)
(function() {
  'use strict';

  // DOM Elements
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
    btnReset: document.getElementById('btnReset')
  };

  let collapsed = false;
  let core = null;

  // Khởi tạo app
  function initApp() {
    if (!window.MetaBotCore) {
      setTimeout(initApp, 100);
      return;
    }

    core = window.MetaBotCore;
    setupEventListeners();
    setupWakeUpDetection();
    render();
    
    console.log('🚀 Meta Bot Pro V9.0 - Ready!');
  }

  // Setup event listeners
  function setupEventListeners() {
    elements.btnBanker.addEventListener('click', () => {
      core.addResult('B');
      render();
    });

    elements.btnPlayer.addEventListener('click', () => {
      core.addResult('P');
      render();
    });

    elements.btnUndo.addEventListener('click', () => {
      core.undo();
      render();
    });

    elements.btnReset.addEventListener('click', () => {
      if (confirm('Xóa toàn bộ lịch sử và bắt đầu mới?')) {
        core.reset();
        render();
      }
    });

    elements.toggleBtn.addEventListener('click', () => {
      collapsed = !collapsed;
      elements.methodBox.classList.toggle('collapsed', collapsed);
      elements.toggleBtn.textContent = collapsed ? 'Mở rộng ▼' : 'Thu gọn ▲';
    });

    // Keyboard shortcuts
    document.addEventListener('keypress', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      const key = e.key.toLowerCase();
      if (key === 'b') { core.addResult('B'); render(); }
      else if (key === 'p') { core.addResult('P'); render(); }
      else if (key === 'u') { core.undo(); render(); }
      else if (key === 'r') { core.reset(); render(); }
    });
  }

  // Setup wake-up detection (FIX ĐƠ)
  function setupWakeUpDetection() {
    let lastInteraction = Date.now();
    
    // Phát hiện khi user tương tác sau khi để lâu
    const handleInteraction = () => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteraction;
      
      // Nếu không tương tác > 2 phút, có thể đã sleep
      if (timeSinceLastInteraction > 2 * 60 * 1000) {
        console.log('🔄 Wake up detected - Refreshing display...');
        render(); // Refresh lại display
      }
      
      lastInteraction = now;
    };

    // Listen các event
    ['click', 'touchstart', 'mousemove', 'keydown'].forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true });
    });

    // Phát hiện khi tab được focus lại
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('🔄 Tab visible - Refreshing display...');
        setTimeout(render, 100); // Delay nhỏ để đảm bảo DOM ready
      }
    });

    // Phát hiện khi window được focus
    window.addEventListener('focus', () => {
      console.log('🔄 Window focused - Refreshing display...');
      setTimeout(render, 100);
    });
  }

  // Render functions
  function renderHistory() {
    const history = core.getHistory();
    elements.historyEl.innerHTML = '';
    
    history.forEach((r, i) => {
      const chip = document.createElement('div');
      chip.className = 'chip ' + (r === 'B' ? 'banker' : 'player');
      chip.textContent = r;
      chip.title = `#${i + 1} — ${r}`;
      elements.historyEl.appendChild(chip);
    });
    
    elements.historyEl.scrollTop = elements.historyEl.scrollHeight;
  }

  function renderStats() {
    const stats = core.getStats();
    const history = core.getHistory();
    
    elements.statTotal.textContent = history.length;
    elements.statAccuracy.textContent = stats.total > 0 
      ? `${((stats.correct / stats.total) * 100).toFixed(1)}%` 
      : '--%';
    elements.statStreak.textContent = stats.currentStreak;
    elements.statAiScore.textContent = core.calculateAIScore();
    
    if (history.length > 0) {
      const last = history[history.length - 1];
      let seq = 1;
      for (let i = history.length - 2; i >= 0; i--) {
        if (history[i] === last) seq++;
        else break;
      }
      elements.statSequence.textContent = `${last}×${seq}`;
      
      const bCount = history.filter(x => x === 'B').length;
      const pCount = history.filter(x => x === 'P').length;
      const total = history.length;
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

  function renderKellyIndicator(chosen) {
    if (!chosen || core.getStats().total === 0) {
      elements.kellyIndicator.textContent = '';
      return;
    }
    
    const kelly = core.calculateKelly(chosen);
    
    if (kelly > 0) {
      elements.kellyIndicator.textContent = `💰 Kelly: ${(kelly * 100).toFixed(1)}% bankroll`;
    } else {
      elements.kellyIndicator.textContent = '⚠️ Không nên đặt cược';
    }
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
    elements.predText.textContent = chosen.pred === 'B' ? 'BANKER 🔴' : 'PLAYER 🔵';
    elements.predText.className = 'pred-value ' + (chosen.pred === 'B' ? 'blink-red' : 'blink-blue');
    
    const confPercent = chosen.conf * 100;
    elements.confidenceFill.style.width = confPercent + '%';
    elements.confidenceText.textContent = `Độ tin cậy: ${confPercent.toFixed(1)}% | ${chosen.method.toUpperCase()}`;
    
    renderSignalStrength(chosen.conf);
    renderKellyIndicator(chosen);
  }

  function renderPhase(phase) {
    elements.phaseIcon.textContent = phase.icon;
    elements.phaseText.textContent = phase.label;
    elements.phaseText.className = 'phase-text ' + phase.class;
  }

  function renderMethods(result) {
    const methods = core.getMethods();
    const all = result.all || [];
    const chosen = result.chosen;
    
    elements.methodGrid.innerHTML = '';
    
    methods.forEach(m => {
      const methodResult = all.find(r => r.method === m.id);
      const card = document.createElement('div');
      card.className = 'method-card ' + m.colorClass;
      if (chosen && chosen.method === m.id) card.classList.add('active');
      
      const name = document.createElement('div');
      name.className = 'method-name';
      name.textContent = m.label;
      
      const conf = document.createElement('div');
      conf.className = 'method-conf';
      conf.textContent = methodResult ? `${(methodResult.conf * 100).toFixed(0)}%` : '--';
      
      card.appendChild(name);
      card.appendChild(conf);
      
      if (methodResult) {
        const pred = document.createElement('div');
        pred.className = 'method-pred';
        pred.style.background = methodResult.pred === 'B' 
          ? 'linear-gradient(135deg,#ff2d55,#ff6b9d)' 
          : 'linear-gradient(135deg,#0a84ff,#5ac8fa)';
        card.appendChild(pred);
      }
      
      const memory = core.getMethodMemory(m.id);
      const winRate = memory.attempts > 0 
        ? ((memory.wins / memory.attempts) * 100).toFixed(0) 
        : '0';
      const winRateEl = document.createElement('div');
      winRateEl.className = 'method-winrate';
      winRateEl.textContent = `${winRate}% (${memory.attempts})`;
      card.appendChild(winRateEl);
      
      elements.methodGrid.appendChild(card);
    });
  }

  function renderAIInsights(result) {
    if (!result.chosen || core.getHistory().length === 0) {
      elements.aiInsights.textContent = 'Đang chờ dữ liệu để phân tích...';
      return;
    }
    
    const insights = core.generateInsights(result);
    elements.aiInsights.textContent = insights.join(' • ');
  }

  // Main render function
  function render() {
    try {
      renderHistory();
      renderStats();
      
      const result = core.analyze();
      
      renderPrediction(result);
      renderPhase(result.phase);
      renderMethods(result);
      renderAIInsights(result);
    } catch (e) {
      console.error('Render error:', e);
    }
  }

  // Start when unlocked
  window.addEventListener('metabot:unlocked', initApp);

})();
