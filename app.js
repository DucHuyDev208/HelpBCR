// META BOT PRO - Application Layer
(function() {
  'use strict';

  const predText = document.getElementById('predText');
  const confidenceFill = document.getElementById('confidenceFill');
  const confidenceText = document.getElementById('confidenceText');
  const signalStrength = document.getElementById('signalStrength');
  const kellyIndicator = document.getElementById('kellyIndicator');
  const historyEl = document.getElementById('history');
  const phaseIcon = document.getElementById('phaseIcon');
  const phaseText = document.getElementById('phaseText');
  const methodGrid = document.getElementById('methodGrid');
  const methodBox = document.getElementById('methodBox');
  const toggleBtn = document.getElementById('toggleBtn');
  const aiInsights = document.getElementById('aiInsights');
  
  const statTotal = document.getElementById('statTotal');
  const statAccuracy = document.getElementById('statAccuracy');
  const statStreak = document.getElementById('statStreak');
  const statSequence = document.getElementById('statSequence');
  const statBankerPct = document.getElementById('statBankerPct');
  const statPlayerPct = document.getElementById('statPlayerPct');
  const statAiScore = document.getElementById('statAiScore');

  const btnBanker = document.getElementById('btnBanker');
  const btnPlayer = document.getElementById('btnPlayer');
  const btnUndo = document.getElementById('btnUndo');
  const btnReset = document.getElementById('btnReset');

  let collapsed = false;

  function initApp() {
    if (!window.MetaBotCore) {
      setTimeout(initApp, 100);
      return;
    }

    const core = window.MetaBotCore;

    function renderHistory() {
      const history = core.getHistory();
      historyEl.innerHTML = '';
      
      history.forEach((r, i) => {
        const chip = document.createElement('div');
        chip.className = 'chip ' + (r === 'B' ? 'banker' : 'player');
        chip.textContent = r;
        chip.title = `#${i + 1} — ${r}`;
        historyEl.appendChild(chip);
      });
      
      historyEl.scrollTop = historyEl.scrollHeight;
    }

    function renderStats() {
      const stats = core.getStats();
      const history = core.getHistory();
      
      statTotal.textContent = history.length;
      statAccuracy.textContent = stats.total > 0 
        ? `${((stats.correct / stats.total) * 100).toFixed(1)}%` 
        : '--%';
      statStreak.textContent = stats.currentStreak;
      statAiScore.textContent = core.calculateAIScore();
      
      if (history.length > 0) {
        const last = history[history.length - 1];
        let seq = 1;
        for (let i = history.length - 2; i >= 0; i--) {
          if (history[i] === last) seq++;
          else break;
        }
        statSequence.textContent = `${last}×${seq}`;
        
        const bCount = history.filter(x => x === 'B').length;
        const pCount = history.filter(x => x === 'P').length;
        const total = history.length;
        statBankerPct.textContent = `${((bCount / total) * 100).toFixed(1)}%`;
        statPlayerPct.textContent = `${((pCount / total) * 100).toFixed(1)}%`;
      } else {
        statSequence.textContent = '--';
        statBankerPct.textContent = '--%';
        statPlayerPct.textContent = '--%';
      }
    }

    function renderSignalStrength(conf) {
      signalStrength.innerHTML = '';
      const bars = 5;
      const activeCount = Math.ceil((conf || 0) * bars);
      
      for (let i = 0; i < bars; i++) {
        const bar = document.createElement('div');
        bar.className = 'signal-bar';
        if (i < activeCount) bar.classList.add('active');
        signalStrength.appendChild(bar);
      }
    }

    function renderKellyIndicator(chosen) {
      const stats = core.getStats();
      
      if (!chosen || stats.total === 0) {
        kellyIndicator.textContent = '';
        return;
      }
      
      const kelly = core.calculateKelly(chosen);
      
      if (kelly > 0) {
        const percentage = (kelly * 100).toFixed(1);
        kellyIndicator.textContent = `💰 Kelly Criterion: ${percentage}% bankroll`;
      } else {
        kellyIndicator.textContent = '⚠️ Không nên đặt cược (Kelly < 0)';
      }
    }

    function renderPrediction(result) {
      if (!result || !result.chosen) {
        predText.textContent = 'Đang phân tích...';
        predText.className = 'pred-value waiting';
        confidenceFill.style.width = '0%';
        confidenceText.textContent = 'Cần thêm dữ liệu';
        renderSignalStrength(0);
        kellyIndicator.textContent = '';
        return;
      }

      const chosen = result.chosen;
      const displayText = chosen.pred === 'B' ? 'BANKER 🔴' : 'PLAYER 🔵';
      predText.textContent = displayText;
      predText.className = 'pred-value ' + (chosen.pred === 'B' ? 'blink-red' : 'blink-blue');
      
      const confPercent = chosen.conf * 100;
      confidenceFill.style.width = confPercent + '%';
      
      const confText = `Độ tin cậy: ${confPercent.toFixed(1)}% | ${chosen.method.toUpperCase()} Engine`;
      confidenceText.textContent = confText;
      
      renderSignalStrength(chosen.conf);
      renderKellyIndicator(chosen);
    }

    function renderPhase(phase) {
      phaseIcon.textContent = phase.icon;
      phaseText.textContent = phase.label;
      phaseText.className = 'phase-text ' + phase.class;
    }

    function renderMethods(result) {
      const methods = core.getMethods();
      const all = result.all || [];
      const chosen = result.chosen;
      
      methodGrid.innerHTML = '';
      
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
        
        methodGrid.appendChild(card);
      });
    }

    function renderAIInsights(result) {
      const history = core.getHistory();
      
      if (!result.chosen || history.length === 0) {
        aiInsights.textContent = 'Đang chờ dữ liệu để phân tích...';
        return;
      }
      
      const insights = core.generateInsights(result);
      aiInsights.textContent = insights.join(' • ');
    }

    function render() {
      renderHistory();
      renderStats();
      
      const result = core.analyze();
      
      renderPrediction(result);
      renderPhase(result.phase);
      renderMethods(result);
      renderAIInsights(result);
    }

    function handleBanker() {
      core.addResult('B');
      render();
    }

    function handlePlayer() {
      core.addResult('P');
      render();
    }

    function handleUndo() {
      core.undo();
      render();
    }

    function handleReset() {
      if (confirm('Xóa toàn bộ lịch sử và bắt đầu mới?')) {
        core.reset();
        render();
      }
    }

    function handleToggle() {
      collapsed = !collapsed;
      if (collapsed) {
        methodBox.classList.add('collapsed');
        toggleBtn.textContent = 'Mở rộng ▼';
      } else {
        methodBox.classList.remove('collapsed');
        toggleBtn.textContent = 'Thu gọn ▲';
      }
    }

    btnBanker.addEventListener('click', handleBanker);
    btnPlayer.addEventListener('click', handlePlayer);
    btnUndo.addEventListener('click', handleUndo);
    btnReset.addEventListener('click', handleReset);
    toggleBtn.addEventListener('click', handleToggle);

    document.addEventListener('keypress', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      if (e.key === 'b' || e.key === 'B') handleBanker();
      else if (e.key === 'p' || e.key === 'P') handlePlayer();
      else if (e.key === 'u' || e.key === 'U') handleUndo();
      else if (e.key === 'r' || e.key === 'R') handleReset();
    });

    render();
    console.log('🚀 Meta Bot Pro V9.0 - Ready!');
  }

  window.addEventListener('metabot:unlocked', initApp);

})();
