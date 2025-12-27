// META BOT PRO V9.0 - CORE ALGORITHMS
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

  // AI Algorithms
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
          if (next === 'B') nextB++; else if (next === 'P') nextP++;
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
    
    for (const order of [1, 2, 3, 4]) {
      if (hist.length < order + 3) continue;
      const state = hist.slice(-order).join('');
      const trans = { B: 0, P: 0 };
      let count = 0;
      
      for (let i = 0; i <= hist.length - order - 1; i++) {
        if (hist.slice(i, i + order).join('') === state) {
          const next = hist[i + order];
          if (next) { trans[next] += Math.pow(0.97, hist.length - i - order - 1); count++; }
        }
      }
      
      if (count >= 2) {
        const pred = trans.B > trans.P ? 'B' : 'P';
        const conf = Math.max(trans.B, trans.P) / (trans.B + trans.P);
        predictions.push({ pred, conf: 0.47 + order * 0.12 + conf * 0.45 });
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
        if (next === 'B') likelihoodB += 0.25;
        if (next === 'P') likelihoodP += 0.25;
      }
    }
    
    const evidenceB = likelihoodB * priorB;
    const evidenceP = likelihoodP * (1 - priorB);
    const posteriorB = evidenceB / (evidenceB + evidenceP);
    const pred = posteriorB > 0.5 ? 'B' : 'P';
    
    return { method: 'bayesian', pred, conf: Math.min(0.94, 0.50 + Math.max(posteriorB, 1 - posteriorB) * 0.42) };
  }

  function ensemble(hist) {
    if (hist.length < 12) return null;
    const strategies = [];
    const last = hist[hist.length - 1];
    let streak = 1;
    
    for (let i = hist.length - 2; i >= 0; i--) {
      if (hist[i] === last) streak++; else break;
    }
    
    if (streak >= 4) strategies.push({ pred: last, weight: Math.min(0.40, 0.18 + streak * 0.06) });
    
    const votes = { B: 0, P: 0 };
    strategies.forEach(s => { votes[s.pred] += s.weight; });
    
    if (!strategies.length) return null;
    const pred = votes.B > votes.P ? 'B' : 'P';
    const conf = Math.max(votes.B, votes.P) / (votes.B + votes.P);
    
    return { method: 'ensemble', pred, conf: Math.min(0.93, 0.54 + conf * 0.36) };
  }

  function quantum(hist) {
    if (hist.length < 15) return null;
    const scales = [5, 10, 15, 20, 30];
    let totalBProb = 0, totalPProb = 0, totalWeight = 0;
    
    for (const scale of scales) {
      if (hist.length < scale) continue;
      const window = hist.slice(-scale);
      const bProb = window.filter(x => x === 'B').length / scale;
      const pProb = 1 - bProb;
      const entropy = -(bProb * Math.log2(bProb + 0.001) + pProb * Math.log2(pProb + 0.001));
      const weight = (1 / (1 + entropy)) * (scale / 30);
      
      totalBProb += bProb * weight;
      totalPProb += pProb * weight;
      totalWeight += weight;
    }
    
    const finalBProb = totalBProb / totalWeight;
    const pred = finalBProb > 0.5 ? 'B' : 'P';
    const coherence = Math.abs(finalBProb - 0.5) * 2;
    
    return { method: 'quantum', pred, conf: Math.min(0.95, 0.48 + coherence * 0.44) };
  }

  function entropyAnalysis(hist) {
    if (hist.length < 20) return null;
    let totalEntropy = 0, count = 0;
    
    for (const w of [10, 15, 20, 30]) {
      if (hist.length < w) continue;
      const window = hist.slice(-w);
      const bProb = window.filter(x => x === 'B').length / w;
      const entropy = -(bProb * Math.log2(bProb + 0.001) + (1 - bProb) * Math.log2(1 - bProb + 0.001));
      totalEntropy += entropy;
      count++;
    }
    
    const avgEntropy = totalEntropy / count;
    const recent = hist.slice(-20);
    const bCount = recent.filter(x => x === 'B').length;
    const pred = avgEntropy < 0.85 ? (bCount > 10 ? 'B' : 'P') : (bCount < 10 ? 'B' : 'P');
    
    return { method: 'entropy', pred, conf: Math.min(0.95, 0.48 + (1 - avgEntropy) * 0.38) };
  }

  function patternRecognition(hist) {
    if (hist.length < 20) return null;
    const ngrams = {};
    const maxN = Math.min(7, Math.floor(hist.length / 3));
    
    for (let n = 2; n <= maxN; n++) {
      for (let i = 0; i <= hist.length - n - 1; i++) {
        const pattern = hist.slice(i, i + n).join('');
        const next = hist[i + n];
        if (!ngrams[pattern]) ngrams[pattern] = { B: 0, P: 0 };
        ngrams[pattern][next]++;
      }
    }
    
    const currentPattern = hist.slice(-maxN).join('');
    let bestMatch = null, maxScore = 0;
    
    for (let len = maxN; len >= 2; len--) {
      const pattern = currentPattern.slice(-len);
      if (ngrams[pattern] && (ngrams[pattern].B + ngrams[pattern].P) >= 3) {
        const score = len * (ngrams[pattern].B + ngrams[pattern].P);
        if (score > maxScore) {
          maxScore = score;
          bestMatch = ngrams[pattern];
        }
      }
    }
    
    if (!bestMatch) return null;
    const pred = bestMatch.B > bestMatch.P ? 'B' : 'P';
    const dominance = Math.max(bestMatch.B, bestMatch.P) / (bestMatch.B + bestMatch.P);
    
    return { method: 'pattern', pred, conf: Math.min(0.96, 0.48 + dominance * 0.42) };
  }

  function hmm(hist) {
    if (hist.length < 25) return null;
    const observations = hist.slice(-30);
    let stateProbs = { trending_B: 0.25, trending_P: 0.25, alternating: 0.25, random: 0.25 };
    
    for (let i = 1; i < observations.length; i++) {
      const prev = observations[i - 1], curr = observations[i];
      if (prev === curr && curr === 'B') stateProbs.trending_B += 0.08;
      else if (prev === curr && curr === 'P') stateProbs.trending_P += 0.08;
      else if (prev !== curr) stateProbs.alternating += 0.06;
    }
    
    const totalProb = Object.values(stateProbs).reduce((a, b) => a + b, 0);
    for (let key in stateProbs) stateProbs[key] /= totalProb;
    
    const mostLikelyState = Object.keys(stateProbs).reduce((a, b) => stateProbs[a] > stateProbs[b] ? a : b);
    const last = observations[observations.length - 1];
    let pred, conf;
    
    if (mostLikelyState === 'trending_B') { pred = 'B'; conf = 0.52 + stateProbs.trending_B * 0.40; }
    else if (mostLikelyState === 'trending_P') { pred = 'P'; conf = 0.52 + stateProbs.trending_P * 0.40; }
    else if (mostLikelyState === 'alternating') { pred = last === 'B' ? 'P' : 'B'; conf = 0.50 + stateProbs.alternating * 0.38; }
    else { pred = hist.slice(-15).filter(x => x === 'B').length < 8 ? 'B' : 'P'; conf = 0.45; }
    
    return { method: 'hmm', pred, conf: Math.min(0.94, conf) };
  }

  function rl(hist) {
    if (hist.length < 15) return null;
    const state = getState(hist);
    const stateKey = state.join('_');
    
    if (!rlMemory.qTable[stateKey]) rlMemory.qTable[stateKey] = { B: 0.5, P: 0.5 };
    const qValues = rlMemory.qTable[stateKey];
    const pred = Math.random() < rlMemory.epsilon ? (Math.random() < 0.5 ? 'B' : 'P') : (qValues.B > qValues.P ? 'B' : 'P');
    const qDiff = Math.abs(qValues.B - qValues.P);
    
    return { method: 'rl', pred, conf: Math.min(0.95, 0.50 + qDiff * 0.45) };
  }

  function getState(hist) {
    const last5 = hist.slice(-5);
    const bCount = last5.filter(x => x === 'B').length;
    let streak = 1;
    for (let i = hist.length - 2; i >= Math.max(0, hist.length - 6); i--) {
      if (hist[i] === hist[hist.length - 1]) streak++; else break;
    }
    return [hist[hist.length - 1], bCount, Math.min(streak, 5)];
  }

  function updateRL(state, action, reward, nextState) {
    const stateKey = state.join('_');
    const nextStateKey = nextState.join('_');
    
    if (!rlMemory.qTable[stateKey]) rlMemory.qTable[stateKey] = { B: 0.5, P: 0.5 };
    if (!rlMemory.qTable[nextStateKey]) rlMemory.qTable[nextStateKey] = { B: 0.5, P: 0.5 };
    
    const currentQ = rlMemory.qTable[stateKey][action];
    const maxNextQ = Math.max(rlMemory.qTable[nextStateKey].B, rlMemory.qTable[nextStateKey].P);
    rlMemory.qTable[stateKey][action] = currentQ + rlMemory.alpha * (reward + rlMemory.gamma * maxNextQ - currentQ);
    rlMemory.epsilon = Math.max(0.05, rlMemory.epsilon * 0.995);
    save(STORAGE.RL, rlMemory);
  }

  // Phase Detection
  function detectPhase(hist) {
    if (!hist || hist.length < 4) return { id: 'undefined', label: 'Khởi động', icon: '🔮', class: 'phase-undefined' };
    
    const recent = hist.slice(-Math.min(25, hist.length));
    let alternations = 0;
    for (let i = 1; i < recent.length; i++) if (recent[i] !== recent[i - 1]) alternations++;
    const altRate = alternations / (recent.length - 1);
    
    let longest = 1, current = 1;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] === recent[i - 1]) { current++; longest = Math.max(longest, current); }
      else current = 1;
    }
    
    if (longest >= 5) return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
    if (altRate >= 0.72) return { id: 'noisy', label: 'Xen kẽ', icon: '⚡', class: 'phase-noisy' };
    if (longest >= 3) return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
    
    return { id: 'undefined', label: 'Phân tích', icon: '🔮', class: 'phase-undefined' };
  }

  function updatePhase(candidate) {
    if (!persistentPhase) {
      phaseConfirmCount++;
      if (phaseConfirmCount >= 2) {
        persistentPhase = candidate.id;
        save(STORAGE.PHASE, persistentPhase);
        phaseConfirmCount = 0;
      }
      return candidate;
    }
    
    if (candidate.id === persistentPhase) {
      phaseConfirmCount = 0;
      return candidate;
    } else {
      phaseConfirmCount++;
      if (phaseConfirmCount >= 3) {
        persistentPhase = candidate.id;
        save(STORAGE.PHASE, persistentPhase);
        phaseConfirmCount = 0;
        return candidate;
      }
      const phases = {
        stable: { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' },
        noisy: { id: 'noisy', label: 'Xen kẽ', icon: '⚡', class: 'phase-noisy' },
        undefined: { id: 'undefined', label: 'Phân tích', icon: '🔮', class: 'phase-undefined' }
      };
      return phases[persistentPhase] || candidate;
    }
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
    const multiplier = Math.min(1.45, Math.max(0.60, 0.80 + (recentAcc - 0.5) * 1.2));
    
    return Object.assign({}, det, { conf: Math.min(0.98, det.conf * multiplier * mem.adaptiveFactor) });
  }

  function applyPhaseWeight(det, phaseId) {
    if (!det) return det;
    const mapping = { stable: 'deep', noisy: 'ensemble', undefined: 'neural' };
    if (det.method === mapping[phaseId]) {
      return Object.assign({}, det, { conf: Math.min(0.98, det.conf * 1.28) });
    }
    return det;
  }

  function updateMemory(outcome, chosen, phase) {
    if (!chosen) return;
    ensureMemory(chosen.method);
    const mem = methodMemory[chosen.method];
    
    mem.attempts++;
    const correct = chosen.pred === outcome;
    mem.recentHistory.push(correct);
    if (mem.recentHistory.length > 40) mem.recentHistory.shift();
    
    if (correct) {
      mem.wins++;
      mem.adaptiveFactor = Math.min(1.20, mem.adaptiveFactor + 0.025);
    } else {
      mem.adaptiveFactor = Math.max(0.80, mem.adaptiveFactor - 0.035);
    }
    
    save(STORAGE.MEMORY, methodMemory);
  }

  // Selection
  function selectBest(results, phase) {
    if (!results || !results.length) return { chosen: null, all: results };
    results.sort((a, b) => b.conf - a.conf);
    
    const threshold = THRESHOLDS[phase.id] || 0.46;
    const top = results[0];
    
    if (top.conf >= threshold) return { chosen: top, all: results };
    return { chosen: null, all: results };
  }

  // Main Analysis
  function analyze() {
    const detectors = [neuralPattern, deepSequence, markovChain, bayesian, ensemble, quantum, entropyAnalysis, patternRecognition, hmm, rl];
    const raw = detectors.map(fn => {
      try { return fn(historyData); } catch (e) { return null; }
    }).filter(r => r && (r.pred === 'B' || r.pred === 'P'));
    
    const candidatePhase = detectPhase(historyData);
    const phase = updatePhase(candidatePhase);
    
    const adjusted = raw.map(r => adjustWithMemory(r)).map(r => applyPhaseWeight(r, phase.id));
    const { chosen, all } = selectBest(adjusted, phase);
    
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
    insights.push(`📊 Đồng thuận: ${((consensus / result.all.length) * 100).toFixed(0)}%`);
    
    const recent = historyData.slice(-10);
    let streak = 1;
    for (let i = recent.length - 2; i >= 0; i--) {
      if (recent[i] === recent[recent.length - 1]) streak++; else break;
    }
    insights.push(`🔥 Chuỗi: ${recent[recent.length - 1]}×${streak}`);
    insights.push(`🎯 Phase: ${result.phase.label}`);
    insights.push(`⚡ Engine: ${result.chosen.method.toUpperCase()}`);
    
    return insights;
  }

  // Public API
  function addResult(r) {
    if (r !== 'B' && r !== 'P') return;
    
    if (lastChosen && lastChosen.pred) {
      const correct = lastChosen.pred === r;
      predictionHistory.push({ pred: lastChosen.pred, actual: r, correct });
      save(STORAGE.PREDICTIONS, predictionHistory);
      
      updateMemory(r, lastChosen, { id: lastChosen.phase || 'undefined' });
      
      if (historyData.length >= 15) {
        const stateBefore = getState(historyData);
        historyData.push(r);
        const stateAfter = getState(historyData);
        updateRL(stateBefore, lastChosen.pred, correct ? 1 : -1, stateAfter);
        historyData.pop();
      }
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
      const p = winRate;
      const q = 1 - p;
      const kelly = (p - q);
      const adjustedKelly = kelly * chosen.conf;
      return Math.max(0, Math.min(0.25, adjustedKelly));
    },
    calculateAIScore,
    generateInsights
  };

})();
