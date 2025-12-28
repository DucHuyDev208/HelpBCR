// META BOT PRO V9.0 - CORE ALGORITHMS (COMPLETE & FIXED)
// ⚠️ OBFUSCATE FILE NÀY tại https://obfuscator.io/ trước khi deploy!

window.MetaBotCore = (function() {
  'use strict';

  const STORAGE = {
    HISTORY: 'meta_baccarat_history_v9',
    MEMORY: 'meta_baccarat_method_memory_v9',
    PHASE: 'meta_baccarat_phase_v9',
    STATS: 'meta_baccarat_stats_v9',
    PREDICTIONS: 'meta_baccarat_predictions_v9',
    RL: 'meta_baccarat_rl_v9'
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
  let methodMemory = {};
  let rlMemory = { qTable: {}, epsilon: 0.2, alpha: 0.1, gamma: 0.95 };
  let lastChosen = null;
  let persistentPhase = null;
  let phaseConfirmCount = 0;
  let stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };

  const THRESHOLDS = { 
    stable: 0.40, noisy: 0.50, reversal: 0.56, transition: 0.46, 
    undefined: 0.44, cycle: 0.48, entropy: 0.52 
  };

  // Storage Functions
  function load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function save(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.error('Save error:', e); }
  }

  // AI Algorithms (Simplified but functional)
  function neuralPattern(hist) {
    if (hist.length < 8) return null;
    const recent = hist.slice(-Math.min(50, hist.length));
    const patterns = [];
    
    for (let len = 2; len <= Math.min(10, Math.floor(recent.length / 2)); len++) {
      const current = recent.slice(-len).join('');
      let matches = 0, nextB = 0, nextP = 0;
      
      for (let i = 0; i <= recent.length - len - 1; i++) {
        if (recent.slice(i, i + len).join('') === current) {
          matches++;
          const next = recent[i + len];
          if (next === 'B') nextB++;
          else if (next === 'P') nextP++;
        }
      }
      
      if (matches >= 2 && nextB + nextP > 0) {
        const dominance = Math.max(nextB, nextP) / (nextB + nextP);
        const weight = len * 0.1 + matches * 0.08 + dominance * 0.3;
        patterns.push({ pred: nextB > nextP ? 'B' : 'P', weight });
      }
    }
    
    if (!patterns.length) return null;
    patterns.sort((a, b) => b.weight - a.weight);
    return { 
      method: 'neural', 
      pred: patterns[0].pred, 
      conf: Math.min(0.97, 0.50 + patterns[0].weight)
    };
  }

  function deepSequence(hist) {
    if (hist.length < 10) return null;
    const data = hist.slice(-Math.min(80, hist.length));
    const trans = { BB: 0, BP: 0, PB: 0, PP: 0 };
    
    for (let i = 0; i < data.length - 1; i++) {
      const pair = data[i] + data[i + 1];
      trans[pair] = (trans[pair] || 0) + Math.pow(0.93, data.length - 1 - i);
    }
    
    const last = data[data.length - 1];
    const predB = last === 'B' ? trans.BB : trans.PB;
    const predP = last === 'B' ? trans.BP : trans.PP;
    const pred = predB > predP ? 'B' : 'P';
    const ratio = Math.max(predB, predP) / (predB + predP);
    
    return { method: 'deep', pred, conf: Math.min(0.96, 0.52 + ratio * 0.38) };
  }

  function markovChain(hist) {
    if (hist.length < 6) return null;
    const predictions = [];
    
    for (const order of [1, 2, 3]) {
      if (hist.length < order + 3) continue;
      const state = hist.slice(-order).join('');
      const trans = { B: 0, P: 0 };
      let count = 0;
      
      for (let i = 0; i <= hist.length - order - 1; i++) {
        if (hist.slice(i, i + order).join('') === state) {
          const next = hist[i + order];
          if (next) { trans[next]++; count++; }
        }
      }
      
      if (count >= 2) {
        const pred = trans.B > trans.P ? 'B' : 'P';
        const conf = Math.max(trans.B, trans.P) / (trans.B + trans.P);
        predictions.push({ pred, conf: 0.47 + order * 0.12 + conf * 0.35 });
      }
    }
    
    if (!predictions.length) return null;
    const best = predictions.reduce((max, p) => p.conf > max.conf ? p : max);
    return { method: 'markov', pred: best.pred, conf: Math.min(0.95, best.conf) };
  }

  function bayesian(hist) {
    if (hist.length < 8) return null;
    const data = hist.slice(-Math.min(40, hist.length));
    let priorB = data.filter(x => x === 'B').length / data.length;
    
    const recent5 = data.slice(-5).join('');
    let likelihoodB = 0.5, likelihoodP = 0.5;
    
    for (let i = 0; i <= data.length - 6; i++) {
      if (data.slice(i, i + 5).join('') === recent5) {
        const next = data[i + 5];
        if (next === 'B') likelihoodB += 0.2;
        if (next === 'P') likelihoodP += 0.2;
      }
    }
    
    const evidenceB = likelihoodB * priorB;
    const evidenceP = likelihoodP * (1 - priorB);
    const posteriorB = evidenceB / (evidenceB + evidenceP);
    const pred = posteriorB > 0.5 ? 'B' : 'P';
    
    return { method: 'bayesian', pred, conf: Math.min(0.94, 0.50 + Math.abs(posteriorB - 0.5) * 0.8) };
  }

  function ensemble(hist) {
    if (hist.length < 10) return null;
    const last = hist[hist.length - 1];
    let streak = 1;
    
    for (let i = hist.length - 2; i >= 0; i--) {
      if (hist[i] === last) streak++;
      else break;
    }
    
    if (streak >= 4) {
      return { method: 'ensemble', pred: last, conf: Math.min(0.90, 0.55 + streak * 0.05) };
    }
    
    const recent = hist.slice(-20);
    const bCount = recent.filter(x => x === 'B').length;
    const pred = bCount > 10 ? 'B' : 'P';
    
    return { method: 'ensemble', pred, conf: 0.55 };
  }

  function quantum(hist) {
    if (hist.length < 15) return null;
    const window = hist.slice(-30);
    const bCount = window.filter(x => x === 'B').length;
    const bProb = bCount / window.length;
    const pred = bProb > 0.5 ? 'B' : 'P';
    const coherence = Math.abs(bProb - 0.5) * 2;
    
    return { method: 'quantum', pred, conf: Math.min(0.92, 0.48 + coherence * 0.4) };
  }

  function entropyAnalysis(hist) {
    if (hist.length < 20) return null;
    const window = hist.slice(-20);
    const bCount = window.filter(x => x === 'B').length;
    const bProb = bCount / 20;
    const entropy = -(bProb * Math.log2(bProb + 0.001) + (1 - bProb) * Math.log2(1 - bProb + 0.001));
    
    const pred = bProb > 0.5 ? 'B' : 'P';
    const conf = 0.48 + (1 - entropy) * 0.4;
    
    return { method: 'entropy', pred, conf: Math.min(0.93, conf) };
  }

  function patternRecognition(hist) {
    if (hist.length < 15) return null;
    const last3 = hist.slice(-3).join('');
    let matches = { B: 0, P: 0 };
    
    for (let i = 0; i <= hist.length - 4; i++) {
      if (hist.slice(i, i + 3).join('') === last3) {
        const next = hist[i + 3];
        if (next) matches[next]++;
      }
    }
    
    if (matches.B + matches.P < 2) return null;
    const pred = matches.B > matches.P ? 'B' : 'P';
    const conf = Math.max(matches.B, matches.P) / (matches.B + matches.P);
    
    return { method: 'pattern', pred, conf: Math.min(0.90, 0.50 + conf * 0.35) };
  }

  function hmm(hist) {
    if (hist.length < 20) return null;
    const recent = hist.slice(-20);
    let alternations = 0;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] !== recent[i - 1]) alternations++;
    }
    
    const altRate = alternations / 19;
    const last = recent[recent.length - 1];
    
    if (altRate > 0.7) {
      return { method: 'hmm', pred: last === 'B' ? 'P' : 'B', conf: 0.65 };
    }
    
    const bCount = recent.filter(x => x === 'B').length;
    return { method: 'hmm', pred: bCount > 10 ? 'B' : 'P', conf: 0.58 };
  }

  function rl(hist) {
    if (hist.length < 10) return null;
    const recent = hist.slice(-10);
    const bCount = recent.filter(x => x === 'B').length;
    const pred = bCount > 5 ? 'B' : 'P';
    
    return { method: 'rl', pred, conf: 0.60 };
  }

  // Phase Detection
  function detectPhase(hist) {
    if (!hist || hist.length < 4) {
      return { id: 'undefined', label: 'Khởi động', icon: '🔮', class: 'phase-undefined' };
    }
    
    const recent = hist.slice(-Math.min(25, hist.length));
    let longest = 1, current = 1;
    
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] === recent[i - 1]) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    
    if (longest >= 5) {
      return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
    }
    
    let alternations = 0;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] !== recent[i - 1]) alternations++;
    }
    const altRate = alternations / (recent.length - 1);
    
    if (altRate >= 0.7) {
      return { id: 'noisy', label: 'Xen kẽ', icon: '⚡', class: 'phase-noisy' };
    }
    
    return { id: 'undefined', label: 'Phân tích', icon: '🔮', class: 'phase-undefined' };
  }

  function updatePhase(candidate) {
    if (!persistentPhase) {
      persistentPhase = candidate.id;
      save(STORAGE.PHASE, persistentPhase);
      return candidate;
    }
    
    if (candidate.id !== persistentPhase) {
      phaseConfirmCount++;
      if (phaseConfirmCount >= 3) {
        persistentPhase = candidate.id;
        save(STORAGE.PHASE, persistentPhase);
        phaseConfirmCount = 0;
      }
    } else {
      phaseConfirmCount = 0;
    }
    
    return candidate;
  }

  // Memory & Learning
  function ensureMemory(id) {
    if (!methodMemory[id]) {
      methodMemory[id] = { wins: 0, attempts: 0, recentHistory: [], adaptiveFactor: 1.0 };
    }
  }

  function adjustWithMemory(det) {
    if (!det) return det;
    ensureMemory(det.method);
    const mem = methodMemory[det.method];
    
    const recentAcc = mem.recentHistory.length > 0 
      ? mem.recentHistory.filter(x => x).length / mem.recentHistory.length 
      : 0.5;
    const multiplier = Math.min(1.3, Math.max(0.7, 0.85 + (recentAcc - 0.5) * 0.9));
    
    return Object.assign({}, det, { conf: Math.min(0.98, det.conf * multiplier * mem.adaptiveFactor) });
  }

  function updateMemory(outcome, chosen) {
    if (!chosen) return;
    ensureMemory(chosen.method);
    const mem = methodMemory[chosen.method];
    
    mem.attempts++;
    const correct = chosen.pred === outcome;
    mem.recentHistory.push(correct);
    if (mem.recentHistory.length > 30) mem.recentHistory.shift();
    
    if (correct) {
      mem.wins++;
      mem.adaptiveFactor = Math.min(1.15, mem.adaptiveFactor + 0.02);
    } else {
      mem.adaptiveFactor = Math.max(0.85, mem.adaptiveFactor - 0.03);
    }
    
    save(STORAGE.MEMORY, methodMemory);
  }

  // Selection
  function selectBest(results) {
    if (!results || !results.length) return { chosen: null, all: results };
    results.sort((a, b) => b.conf - a.conf);
    
    const top = results[0];
    if (top.conf >= 0.45) return { chosen: top, all: results };
    
    return { chosen: null, all: results };
  }

  // Main Analysis
  function analyze() {
    const detectors = [
      neuralPattern, deepSequence, markovChain, bayesian, 
      ensemble, quantum, entropyAnalysis, patternRecognition, hmm, rl
    ];
    
    const raw = detectors.map(fn => {
      try { return fn(historyData); } 
      catch (e) { return null; }
    }).filter(r => r && (r.pred === 'B' || r.pred === 'P'));
    
    const candidatePhase = detectPhase(historyData);
    const phase = updatePhase(candidatePhase);
    
    const adjusted = raw.map(r => adjustWithMemory(r));
    const { chosen, all } = selectBest(adjusted);
    
    return { chosen, all, phase };
  }

  // Stats
  function recalculateStats() {
    stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    let tempStreak = 0;
    
    predictionHistory.forEach(p => {
      if (p.pred && p.actual) {
        stats.total++;
        if (p.correct) {
          stats.correct++;
          tempStreak = tempStreak >= 0 ? tempStreak + 1 : 1;
        } else {
          tempStreak = tempStreak <= 0 ? tempStreak - 1 : -1;
        }
        stats.longestWin = Math.max(stats.longestWin, tempStreak);
        if (tempStreak < 0) stats.longestLoss = Math.max(stats.longestLoss, Math.abs(tempStreak));
      }
    });
    
    stats.currentStreak = tempStreak;
    save(STORAGE.STATS, stats);
  }

  function calculateAIScore() {
    if (stats.total === 0) return 0;
    const accuracy = stats.correct / stats.total;
    const streakBonus = Math.min(20, stats.longestWin * 2);
    const consistencyScore = stats.currentStreak > 0 ? Math.min(15, stats.currentStreak * 3) : 0;
    
    let methodScore = 0;
    METHODS.forEach(m => {
      ensureMemory(m.id);
      const mem = methodMemory[m.id];
      if (mem.attempts > 0) methodScore += (mem.wins / mem.attempts) * 10;
    });
    methodScore = methodScore / METHODS.length;
    
    return Math.min(100, Math.round((accuracy * 50) + streakBonus + consistencyScore + methodScore));
  }

  function generateInsights(result) {
    if (!result.chosen || !historyData.length) return ['Đang chờ dữ liệu...'];
    
    const insights = [];
    const consensus = result.all.filter(r => r.pred === result.chosen.pred).length;
    insights.push(`📊 ${((consensus / result.all.length) * 100).toFixed(0)}%`);
    
    const recent = historyData.slice(-10);
    let streak = 1;
    for (let i = recent.length - 2; i >= 0; i--) {
      if (recent[i] === recent[recent.length - 1]) streak++;
      else break;
    }
    insights.push(`🔥 ${recent[recent.length - 1]}×${streak}`);
    insights.push(`🎯 ${result.phase.label}`);
    insights.push(`⚡ ${result.chosen.method.toUpperCase()}`);
    
    return insights;
  }

  // Public API
  function addResult(r) {
    if (r !== 'B' && r !== 'P') return;
    
    if (lastChosen && lastChosen.pred) {
      const correct = lastChosen.pred === r;
      predictionHistory.push({ pred: lastChosen.pred, actual: r, correct });
      save(STORAGE.PREDICTIONS, predictionHistory);
      updateMemory(r, lastChosen);
    }
    
    historyData.push(r);
    save(STORAGE.HISTORY, historyData);
    recalculateStats();
    
    const result = analyze();
    lastChosen = result.chosen ? Object.assign({}, result.chosen, { phase: result.phase.id }) : null;
  }

  function undo() {
    if (!historyData.length) return;
    historyData.pop();
    save(STORAGE.HISTORY, historyData);
    
    if (predictionHistory.length && predictionHistory[predictionHistory.length - 1].actual) {
      predictionHistory.pop();
      save(STORAGE.PREDICTIONS, predictionHistory);
    }
    
    recalculateStats();
  }

  function reset() {
    historyData = [];
    predictionHistory = [];
    stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    save(STORAGE.HISTORY, historyData);
    save(STORAGE.PREDICTIONS, predictionHistory);
    save(STORAGE.STATS, stats);
  }

  function init() {
    historyData = load(STORAGE.HISTORY) || [];
    methodMemory = load(STORAGE.MEMORY) || {};
    persistentPhase = load(STORAGE.PHASE);
    predictionHistory = load(STORAGE.PREDICTIONS) || [];
    stats = load(STORAGE.STATS) || { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    rlMemory = load(STORAGE.RL) || { qTable: {}, epsilon: 0.2, alpha: 0.1, gamma: 0.95 };
    
    METHODS.forEach(m => ensureMemory(m.id));
    recalculateStats();
  }

  init();

  return {
    analyze,
    addResult,
    undo,
    reset,
    getHistory: () => historyData.slice(),
    getStats: () => stats,
    getMethods: () => METHODS,
    getMethodMemory: (id) => { ensureMemory(id); return methodMemory[id]; },
    calculateKelly: (chosen) => {
      if (!chosen) return 0;
      const winRate = stats.total > 0 ? stats.correct / stats.total : 0.5;
      const kelly = (winRate - (1 - winRate));
      return Math.max(0, Math.min(0.25, kelly * chosen.conf));
    },
    calculateAIScore,
    generateInsights
  };

})();

console.log('✅ MetaBotCore loaded successfully');
