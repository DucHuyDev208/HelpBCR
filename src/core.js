// META BOT PRO V9.0 - CORE ALGORITHMS
// ⚠️ IMPORTANT: Obfuscate this file before deploying!
// Visit: https://obfuscator.io/ and paste this entire file

window.MetaBotCore = (function() {
  'use strict';

  const STORAGE_HISTORY = 'meta_baccarat_history_v9';
  const STORAGE_MEM = 'meta_baccarat_method_memory_v9';
  const STORAGE_PHASE = 'meta_baccarat_phase_v9';
  const STORAGE_STATS = 'meta_baccarat_stats_v9';
  const STORAGE_PREDICTIONS = 'meta_baccarat_predictions_v9';
  const STORAGE_RL = 'meta_baccarat_rl_v9';

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

  // ============ STORAGE FUNCTIONS ============
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
  
  function loadMemory() { 
    try { 
      const raw = localStorage.getItem(STORAGE_MEM); 
      return raw ? JSON.parse(raw) : {}; 
    } catch (e) { return {}; } 
  }

  function saveMemory() { 
    try { localStorage.setItem(STORAGE_MEM, JSON.stringify(methodMemory)); }
    catch (e) { console.error('Save memory error:', e); } 
  }

  function loadRL() {
    try {
      const raw = localStorage.getItem(STORAGE_RL);
      return raw ? JSON.parse(raw) : { qTable: {}, epsilon: 0.2, alpha: 0.1, gamma: 0.95 };
    } catch (e) { return { qTable: {}, epsilon: 0.2, alpha: 0.1, gamma: 0.95 }; }
  }

  function saveRL() {
    try { localStorage.setItem(STORAGE_RL, JSON.stringify(rlMemory)); }
    catch (e) { console.error('Save RL error:', e); }
  }

  function loadPhase() { 
    try { return localStorage.getItem(STORAGE_PHASE); }
    catch (e) { return null; } 
  }

  function savePhase(p) { 
    try { localStorage.setItem(STORAGE_PHASE, p); }
    catch (e) { console.error('Save phase error:', e); } 
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

  // ============ AI ALGORITHMS ============

  function neuralPatternRecognition(hist) {
    if (hist.length < 8) return null;
    
    const window = Math.min(50, hist.length);
    const recent = hist.slice(-window);
    const patterns = [];
    
    for (let len = 2; len <= Math.min(10, Math.floor(recent.length / 2)); len++) {
      const current = recent.slice(-len).join('');
      let matches = 0;
      let nextB = 0, nextP = 0;
      
      for (let i = 0; i <= recent.length - len - 1; i++) {
        if (recent.slice(i, i + len).join('') === current) {
          matches++;
          const next = recent[i + len];
          if (next === 'B') nextB++;
          else if (next === 'P') nextP++;
        }
      }
      
      if (matches >= 2) {
        const total = nextB + nextP;
        if (total > 0) {
          const dominance = Math.max(nextB, nextP) / total;
          const recency = Math.pow(0.95, window - matches);
          const weight = len * 0.1 + matches * 0.08 + dominance * 0.3 + recency * 0.15;
          patterns.push({ 
            len, pred: nextB > nextP ? 'B' : 'P', 
            weight, matches, dominance
          });
        }
      }
    }
    
    if (patterns.length === 0) return null;
    
    patterns.sort((a, b) => b.weight - a.weight);
    const top = patterns[0];
    
    let conf = 0.50 + top.weight;
    const consensus = patterns.filter(p => p.pred === top.pred).length;
    if (consensus >= 3) conf += 0.15;
    
    return { 
      method: 'neural', pred: top.pred, 
      conf: Math.min(0.97, conf),
      detail: { patterns: patterns.length, consensus, topWeight: top.weight }
    };
  }

  function deepSequenceAnalysis(hist) {
    if (hist.length < 10) return null;
    
    const lookback = Math.min(80, hist.length);
    const data = hist.slice(-lookback);
    const transitions = { BB: 0, BP: 0, PB: 0, PP: 0 };
    const weights = [];
    
    for (let i = 0; i < data.length - 1; i++) {
      const pair = data[i] + data[i + 1];
      const decay = Math.pow(0.93, data.length - 1 - i);
      transitions[pair] = (transitions[pair] || 0) + decay;
      weights.push(decay);
    }
    
    const last = data[data.length - 1];
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    let predB, predP;
    if (last === 'B') {
      predB = transitions.BB / totalWeight;
      predP = transitions.BP / totalWeight;
    } else {
      predB = transitions.PB / totalWeight;
      predP = transitions.PP / totalWeight;
    }
    
    const pred = predB > predP ? 'B' : 'P';
    const ratio = Math.max(predB, predP) / (predB + predP);
    const momentum = calculateMomentum(data);
    const volatility = calculateVolatility(data);
    
    let conf = 0.52 + ratio * 0.38 + momentum * 0.12 - volatility * 0.05;
    
    return { 
      method: 'deep', pred, 
      conf: Math.min(0.96, conf),
      detail: { ratio, momentum, volatility }
    };
  }

  function calculateMomentum(data) {
    const recentWindow = Math.min(15, data.length);
    const recent = data.slice(-recentWindow);
    const bCount = recent.filter(x => x === 'B').length;
    const pCount = recent.filter(x => x === 'P').length;
    return Math.abs(bCount - pCount) / recentWindow;
  }

  function calculateVolatility(data) {
    const window = Math.min(20, data.length);
    const recent = data.slice(-window);
    let changes = 0;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] !== recent[i - 1]) changes++;
    }
    return changes / (window - 1);
  }

  function markovChainPrediction(hist) {
    if (hist.length < 6) return null;
    
    const orders = [1, 2, 3, 4];
    const predictions = [];
    
    for (const order of orders) {
      if (hist.length < order + 3) continue;
      
      const state = hist.slice(-order).join('');
      const transitions = { B: 0, P: 0 };
      let count = 0;
      
      const lookback = Math.min(120, hist.length);
      const data = hist.slice(-lookback);
      
      for (let i = 0; i <= data.length - order - 1; i++) {
        if (data.slice(i, i + order).join('') === state) {
          const next = data[i + order];
          if (next) {
            const decay = Math.pow(0.97, data.length - i - order - 1);
            transitions[next] += decay;
            count++;
          }
        }
      }
      
      if (count >= 2) {
        const pred = transitions.B > transitions.P ? 'B' : 'P';
        const confidence = Math.max(transitions.B, transitions.P) / (transitions.B + transitions.P);
        const weight = order * 0.12 + confidence * 0.45;
        predictions.push({ pred, conf: 0.47 + weight, order, count });
      }
    }
    
    if (predictions.length === 0) return null;
    const best = predictions.reduce((max, p) => p.conf > max.conf ? p : max);
    
    return { 
      method: 'markov', pred: best.pred, 
      conf: Math.min(0.95, best.conf),
      detail: { order: best.order, predictions: predictions.length }
    };
  }

  function bayesianInference(hist) {
    if (hist.length < 8) return null;
    
    const window = Math.min(40, hist.length);
    const data = hist.slice(-window);
    
    let priorB = data.filter(x => x === 'B').length / data.length;
    let priorP = 1 - priorB;
    
    const recent5 = data.slice(-5).join('');
    let likelihoodB = 0.5, likelihoodP = 0.5;
    let evidenceCount = 0;
    
    for (let i = 0; i <= data.length - 6; i++) {
      if (data.slice(i, i + 5).join('') === recent5) {
        evidenceCount++;
        const next = data[i + 5];
        const weight = Math.pow(0.95, data.length - i - 6);
        if (next === 'B') likelihoodB += 0.25 * weight;
        if (next === 'P') likelihoodP += 0.25 * weight;
      }
    }
    
    const evidenceB = likelihoodB * priorB;
    const evidenceP = likelihoodP * priorP;
    const total = evidenceB + evidenceP;
    
    const posteriorB = evidenceB / total;
    const posteriorP = evidenceP / total;
    
    const pred = posteriorB > posteriorP ? 'B' : 'P';
    const conf = Math.max(posteriorB, posteriorP);
    const evidenceBonus = Math.min(0.1, evidenceCount * 0.02);
    
    return { 
      method: 'bayesian', pred, 
      conf: Math.min(0.94, 0.50 + conf * 0.42 + evidenceBonus),
      detail: { posteriorB, posteriorP, evidenceCount }
    };
  }

  function ensembleVoting(hist) {
    if (hist.length < 12) return null;
    
    const strategies = [];
    const last = hist[hist.length - 1];
    let streak = 1;
    
    for (let i = hist.length - 2; i >= 0; i--) {
      if (hist[i] === last) streak++;
      else break;
    }
    
    if (streak >= 4) {
      strategies.push({ pred: last, weight: Math.min(0.40, 0.18 + streak * 0.06) });
    } else if (streak === 2 || streak === 3) {
      strategies.push({ pred: last === 'B' ? 'P' : 'B', weight: 0.15 });
    }
    
    const recent10 = hist.slice(-10);
    let alternations = 0;
    for (let i = 1; i < recent10.length; i++) {
      if (recent10[i] !== recent10[i - 1]) alternations++;
    }
    if (alternations >= 6) {
      strategies.push({ pred: last === 'B' ? 'P' : 'B', weight: 0.28 });
    }
    
    const window = Math.min(25, hist.length);
    const recent = hist.slice(-window);
    const bCount = recent.filter(x => x === 'B').length;
    const pCount = recent.filter(x => x === 'P').length;
    const imbalance = Math.abs(bCount - pCount) / window;
    
    if (imbalance >= 0.32) {
      const minority = bCount < pCount ? 'B' : 'P';
      strategies.push({ pred: minority, weight: 0.22 + imbalance * 0.18 });
    }
    
    if (strategies.length === 0) return null;
    
    const votes = { B: 0, P: 0 };
    strategies.forEach(s => { votes[s.pred] += s.weight; });
    
    const pred = votes.B > votes.P ? 'B' : 'P';
    const totalWeight = votes.B + votes.P;
    const confidence = Math.max(votes.B, votes.P) / totalWeight;
    
    return { 
      method: 'ensemble', pred, 
      conf: Math.min(0.93, 0.54 + confidence * 0.36),
      detail: { strategies: strategies.length, voteB: votes.B, voteP: votes.P }
    };
  }

  function quantumSuperposition(hist) {
    if (hist.length < 15) return null;
    
    const scales = [5, 10, 15, 20, 30];
    const probabilities = [];
    
    for (const scale of scales) {
      if (hist.length < scale) continue;
      
      const window = hist.slice(-scale);
      const bCount = window.filter(x => x === 'B').length;
      const pCount = window.filter(x => x === 'P').length;
      
      const bProb = bCount / scale;
      const pProb = pCount / scale;
      
      const entropy = -((bProb * Math.log2(bProb + 0.001)) + (pProb * Math.log2(pProb + 0.001)));
      const weight = (1 / (1 + entropy)) * (scale / 30);
      
      probabilities.push({ scale, bProb, pProb, weight, entropy });
    }
    
    if (probabilities.length === 0) return null;
    
    let totalBProb = 0, totalPProb = 0, totalWeight = 0;
    
    probabilities.forEach(p => {
      totalBProb += p.bProb * p.weight;
      totalPProb += p.pProb * p.weight;
      totalWeight += p.weight;
    });
    
    const finalBProb = totalBProb / totalWeight;
    const finalPProb = totalPProb / totalWeight;
    
    const pred = finalBProb > finalPProb ? 'B' : 'P';
    const coherence = Math.abs(finalBProb - finalPProb);
    
    const last12 = hist.slice(-12).join('');
    const repeatingPattern = /(.{2,})\1+/.test(last12);
    const interferenceBonus = repeatingPattern ? 0.10 : 0;
    
    return { 
      method: 'quantum', pred, 
      conf: Math.min(0.95, 0.48 + coherence * 0.44 + interferenceBonus),
      detail: { scales: scales.length, coherence, interference: repeatingPattern }
    };
  }

  function entropyAnalysis(hist) {
    if (hist.length < 20) return null;
    
    const windows = [10, 15, 20, 30];
    const entropies = [];
    
    for (const w of windows) {
      if (hist.length < w) continue;
      
      const window = hist.slice(-w);
      const bCount = window.filter(x => x === 'B').length;
      const pCount = window.filter(x => x === 'P').length;
      
      const bProb = bCount / w;
      const pProb = pCount / w;
      
      const entropy = -(bProb * Math.log2(bProb + 0.001) + pProb * Math.log2(pProb + 0.001));
      entropies.push({ window: w, entropy, bProb, pProb });
    }
    
    const avgEntropy = entropies.reduce((a, b) => a + b.entropy, 0) / entropies.length;
    
    if (avgEntropy < 0.85) {
      const recent = entropies[entropies.length - 1];
      const pred = recent.bProb > recent.pProb ? 'B' : 'P';
      const conf = 0.54 + (1 - avgEntropy) * 0.38;
      return { 
        method: 'entropy', pred, 
        conf: Math.min(0.95, conf),
        detail: { avgEntropy, predictable: true }
      };
    }
    
    const recent20 = hist.slice(-20);
    const bCount = recent20.filter(x => x === 'B').length;
    const pred = bCount < 10 ? 'B' : 'P';
    
    return { 
      method: 'entropy', pred, 
      conf: Math.min(0.88, 0.48 + (1 - avgEntropy) * 0.25),
      detail: { avgEntropy, predictable: false }
    };
  }

  function advancedPatternRecognition(hist) {
    if (hist.length < 20) return null;
    
    const ngrams = {};
    const maxN = Math.min(7, Math.floor(hist.length / 3));
    
    for (let n = 2; n <= maxN; n++) {
      for (let i = 0; i <= hist.length - n - 1; i++) {
        const pattern = hist.slice(i, i + n).join('');
        const next = hist[i + n];
        
        if (!ngrams[pattern]) ngrams[pattern] = { B: 0, P: 0, total: 0, positions: [] };
        ngrams[pattern][next]++;
        ngrams[pattern].total++;
        ngrams[pattern].positions.push(i);
      }
    }
    
    const currentPattern = hist.slice(-maxN).join('');
    let bestMatch = null;
    let maxScore = 0;
    
    for (let len = maxN; len >= 2; len--) {
      const pattern = currentPattern.slice(-len);
      if (ngrams[pattern] && ngrams[pattern].total >= 3) {
        const recency = ngrams[pattern].positions[ngrams[pattern].positions.length - 1];
        const recencyScore = 1 / (1 + (hist.length - recency) * 0.1);
        const score = len * ngrams[pattern].total * recencyScore;
        
        if (score > maxScore) {
          maxScore = score;
          bestMatch = { data: ngrams[pattern], len };
        }
      }
    }
    
    if (!bestMatch) return null;
    
    const pred = bestMatch.data.B > bestMatch.data.P ? 'B' : 'P';
    const dominance = Math.max(bestMatch.data.B, bestMatch.data.P) / bestMatch.data.total;
    const conf = 0.48 + dominance * 0.42 + bestMatch.len * 0.03;
    
    return { 
      method: 'pattern', pred, 
      conf: Math.min(0.96, conf),
      detail: { patternLen: bestMatch.len, matches: bestMatch.data.total }
    };
  }

  function hiddenMarkovModel(hist) {
    if (hist.length < 25) return null;
    
    const states = ['trending_B', 'trending_P', 'alternating', 'random'];
    const observations = hist.slice(-30);
    
    let stateProbs = { trending_B: 0.25, trending_P: 0.25, alternating: 0.25, random: 0.25 };
    
    for (let i = 1; i < observations.length; i++) {
      const prev = observations[i - 1];
      const curr = observations[i];
      
      if (prev === curr && curr === 'B') {
        stateProbs.trending_B += 0.08;
        stateProbs.alternating -= 0.02;
      } else if (prev === curr && curr === 'P') {
        stateProbs.trending_P += 0.08;
        stateProbs.alternating -= 0.02;
      } else if (prev !== curr) {
        stateProbs.alternating += 0.06;
        stateProbs.trending_B -= 0.01;
        stateProbs.trending_P -= 0.01;
      }
    }
    
    const totalProb = Object.values(stateProbs).reduce((a, b) => a + b, 0);
    for (let key in stateProbs) stateProbs[key] /= totalProb;
    
    const mostLikelyState = Object.keys(stateProbs).reduce((a, b) => 
      stateProbs[a] > stateProbs[b] ? a : b
    );
    
    let pred, conf;
    const last = observations[observations.length - 1];
    
    if (mostLikelyState === 'trending_B') {
      pred = 'B';
      conf = 0.52 + stateProbs.trending_B * 0.40;
    } else if (mostLikelyState === 'trending_P') {
      pred = 'P';
      conf = 0.52 + stateProbs.trending_P * 0.40;
    } else if (mostLikelyState === 'alternating') {
      pred = last === 'B' ? 'P' : 'B';
      conf = 0.50 + stateProbs.alternating * 0.38;
    } else {
      const recent = observations.slice(-15);
      const bCount = recent.filter(x => x === 'B').length;
      pred = bCount < 8 ? 'B' : 'P';
      conf = 0.45;
    }
    
    return { 
      method: 'hmm', pred, 
      conf: Math.min(0.94, conf),
      detail: { state: mostLikelyState, stateProb: stateProbs[mostLikelyState] }
    };
  }

  function reinforcementLearning(hist) {
    if (hist.length < 15) return null;
    
    const state = getStateRepresentation(hist);
    const stateKey = state.join('_');
    
    if (!rlMemory.qTable[stateKey]) {
      rlMemory.qTable[stateKey] = { B: 0.5, P: 0.5 };
    }
    
    const qValues = rlMemory.qTable[stateKey];
    
    let pred;
    if (Math.random() < rlMemory.epsilon) {
      pred = Math.random() < 0.5 ? 'B' : 'P';
    } else {
      pred = qValues.B > qValues.P ? 'B' : 'P';
    }
    
    const maxQ = Math.max(qValues.B, qValues.P);
    const minQ = Math.min(qValues.B, qValues.P);
    const qDiff = maxQ - minQ;
    const conf = 0.50 + qDiff * 0.45;
    
    return { 
      method: 'rl', pred, 
      conf: Math.min(0.95, conf),
      detail: { qB: qValues.B.toFixed(3), qP: qValues.P.toFixed(3) }
    };
  }

  function getStateRepresentation(hist) {
    const last5 = hist.slice(-5);
    const bCount = last5.filter(x => x === 'B').length;
    
    let streak = 1;
    for (let i = hist.length - 2; i >= Math.max(0, hist.length - 6); i--) {
      if (hist[i] === hist[hist.length - 1]) streak++;
      else break;
    }
    
    const window = hist.slice(-20);
    let alternations = 0;
    for (let i = 1; i < window.length; i++) {
      if (window[i] !== window[i - 1]) alternations++;
    }
    const altRate = Math.floor((alternations / (window.length - 1)) * 10);
    
    return [hist[hist.length - 1], bCount, Math.min(streak, 5), altRate];
  }

  function updateRLQTable(state, action, reward, nextState) {
    const stateKey = state.join('_');
    const nextStateKey = nextState.join('_');
    
    if (!rlMemory.qTable[stateKey]) {
      rlMemory.qTable[stateKey] = { B: 0.5, P: 0.5 };
    }
    if (!rlMemory.qTable[nextStateKey]) {
      rlMemory.qTable[nextStateKey] = { B: 0.5, P: 0.5 };
    }
    
    const currentQ = rlMemory.qTable[stateKey][action];
    const maxNextQ = Math.max(rlMemory.qTable[nextStateKey].B, rlMemory.qTable[nextStateKey].P);
    
    const newQ = currentQ + rlMemory.alpha * (reward + rlMemory.gamma * maxNextQ - currentQ);
    rlMemory.qTable[stateKey][action] = newQ;
    
    rlMemory.epsilon = Math.max(0.05, rlMemory.epsilon * 0.995);
    saveRL();
  }

  // ============ PHASE DETECTION ============
  function detectPhase(hist) {
    if (!hist || hist.length < 4) return { id: 'undefined', label: 'Khởi động', icon: '🔮', class: 'phase-undefined' };
    
    const window = Math.min(25, hist.length);
    const recent = hist.slice(-window);
    
    let alternations = 0;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] !== recent[i - 1]) alternations++;
    }
    const altRate = alternations / (recent.length - 1);
    
    let longest = 1, current = 1;
    for (let i = 1; i < recent.length; i++) {
      if (recent[i] === recent[i - 1]) {
        current++;
        if (current > longest) longest = current;
      } else current = 1;
    }
    
    const bCount = recent.filter(x => x === 'B').length;
    const pCount = recent.filter(x => x === 'P').length;
    const balance = Math.abs(bCount - pCount) / window;
    
    const entropy = calculateEntropy(recent);
    
    if (detectCycle(recent)) {
      return { id: 'cycle', label: 'Chu kỳ', icon: '🔄', class: 'phase-cycle' };
    }
    
    if (entropy < 0.75) {
      return { id: 'entropy', label: 'Dự đoán cao', icon: '💎', class: 'phase-entropy' };
    }
    
    if (longest >= 5) {
      const recentStreak = recent.slice(-longest);
      const dominant = recentStreak[0];
      const oppositeRecent = recent.slice(-10).filter(x => x !== dominant).length;
      
      if (oppositeRecent >= 3) return { id: 'reversal', label: 'Đảo chiều', icon: '🔄', class: 'phase-reversal' };
      return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
    }
    
    if (altRate >= 0.72) return { id: 'noisy', label: 'Xen kẽ', icon: '⚡', class: 'phase-noisy' };
    if (balance <= 0.2 && altRate >= 0.45) return { id: 'transition', label: 'Cân bằng', icon: '🔀', class: 'phase-transition' };
    if (longest >= 3) return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
    
    return { id: 'undefined', label: 'Phân tích', icon: '🔮', class: 'phase-undefined' };
  }

  function calculateEntropy(data) {
    const bCount = data.filter(x => x === 'B').length;
    const pCount = data.filter(x => x === 'P').length;
    const total = data.length;
    
    const bProb = bCount / total;
    const pProb = pCount / total;
    
    return -(bProb * Math.log2(bProb + 0.001) + pProb * Math.log2(pProb + 0.001));
  }

  function detectCycle(data) {
    if (data.length < 12) return false;
    
    for (let cycleLen = 2; cycleLen <= 6; cycleLen++) {
      const pattern = data.slice(-cycleLen).join('');
      let matches = 0;
      
      for (let i = data.length - cycleLen * 2; i >= 0; i -= cycleLen) {
        if (data.slice(i, i + cycleLen).join('') === pattern) {
          matches++;
        } else {
          break;
        }
      }
      
      if (matches >= 2) return true;
    }
    
    return false;
  }

  function updatePhase(candidate) {
    if (!persistentPhase) {
      phaseConfirmCount++;
      if (phaseConfirmCount >= 2) {
        persistentPhase = candidate.id;
        savePhase(persistentPhase);
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
        savePhase(persistentPhase);
        phaseConfirmCount = 0;
        return candidate;
      }
      
      const phases = {
        stable: { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' },
        noisy: { id: 'noisy', label: 'Xen kẽ', icon: '⚡', class: 'phase-noisy' },
        reversal: { id: 'reversal', label: 'Đảo chiều', icon: '🔄', class: 'phase-reversal' },
        transition: { id: 'transition', label: 'Cân bằng', icon: '🔀', class: 'phase-transition' },
        cycle: { id: 'cycle', label: 'Chu kỳ', icon: '🔄', class: 'phase-cycle' },
        entropy: { id: 'entropy', label: 'Dự đoán cao', icon: '💎', class: 'phase-entropy' },
        undefined: { id: 'undefined', label: 'Phân tích', icon: '🔮', class: 'phase-undefined' }
      };
      return phases[persistentPhase] || candidate;
    }
  }

  // ============ MEMORY & LEARNING ============
  function ensureMemory(id) {
    if (!methodMemory[id]) {
      methodMemory[id] = { 
        wins: 0, attempts: 0, recentHistory: [],
        phaseWins: {}, phaseAttempts: {},
        adaptiveFactor: 1.0,
        confidenceHistory: []
      };
    }
  }

  function adjustWithMemory(det) {
    if (!det) return det;
    ensureMemory(det.method);
    const mem = methodMemory[det.method];
    
    const recentWindow = mem.recentHistory.slice(-25);
    const recentAccuracy = recentWindow.length > 0 
      ? recentWindow.filter(x => x).length / recentWindow.length 
      : 0.5;
    
    const longTermAccuracy = mem.attempts > 0 ? mem.wins / mem.attempts : 0.5;
    const combinedAccuracy = recentAccuracy * 0.75 + longTermAccuracy * 0.25;
    const multiplier = Math.min(1.45, Math.max(0.60, 0.80 + (combinedAccuracy - 0.5) * 1.2));
    
    let conf = det.conf * multiplier * mem.adaptiveFactor;
    
    if (recentWindow.length >= 5) {
      const last5 = recentWindow.slice(-5);
      const winCount = last5.filter(x => x).length;
      if (winCount >= 4) conf *= 1.15;
      else if (winCount <= 1) conf *= 0.85;
    }
    
    if (mem.confidenceHistory.length >= 10) {
      const avgConf = mem.confidenceHistory.reduce((a, b) => a + b, 0) / mem.confidenceHistory.length;
      if (avgConf > 0.7) conf *= 1.08;
    }
    
    return Object.assign({}, det, { conf: Math.min(0.98, conf) });
  }

  function applyPhaseWeight(det, phaseId) {
    if (!det) return det;
    
    const mapping = { 
      stable: 'deep',
      noisy: 'ensemble', 
      reversal: 'bayesian', 
      transition: 'quantum',
      cycle: 'pattern',
      entropy: 'entropy',
      undefined: 'neural'
    };
    
    if (det.method === mapping[phaseId]) {
      return Object.assign({}, det, { conf: Math.min(0.98, det.conf * 1.28) });
    }
    
    const secondary = {
      stable: ['neural', 'markov', 'hmm'],
      noisy: ['quantum', 'ensemble'],
      reversal: ['markov', 'ensemble', 'bayesian'],
      transition: ['bayesian', 'deep', 'quantum'],
      cycle: ['markov', 'neural'],
      entropy: ['bayesian', 'quantum'],
      undefined: ['markov', 'rl']
    };
    
    if (secondary[phaseId] && secondary[phaseId].includes(det.method)) {
      return Object.assign({}, det, { conf: Math.min(0.98, det.conf * 1.12) });
    }
    
    return det;
  }

  function updateMemory(outcome, chosen, phase) {
    if (!chosen) return;
    ensureMemory(chosen.method);
    const mem = methodMemory[chosen.method];
    
    mem.attempts++;
    const correct = chosen.pred === outcome;
    
    if (!mem.recentHistory) mem.recentHistory = [];
    mem.recentHistory.push(correct);
    if (mem.recentHistory.length > 40) mem.recentHistory.shift();
    
    if (!mem.confidenceHistory) mem.confidenceHistory = [];
    mem.confidenceHistory.push(chosen.conf);
    if (mem.confidenceHistory.length > 20) mem.confidenceHistory.shift();
    
    if (!mem.phaseAttempts[phase.id]) mem.phaseAttempts[phase.id] = 0;
    if (!mem.phaseWins[phase.id]) mem.phaseWins[phase.id] = 0;
    mem.phaseAttempts[phase.id]++;
    
    if (correct) {
      mem.wins++;
      mem.phaseWins[phase.id]++;
      mem.adaptiveFactor = Math.min(1.20, mem.adaptiveFactor + 0.025);
    } else {
      mem.adaptiveFactor = Math.max(0.80, mem.adaptiveFactor - 0.035);
    }
    
    saveMemory();
  }

  // ============ ENSEMBLE SELECTION ============
  function selectBest(results, phase) {
    if (!results || results.length === 0) return { chosen: null, all: results };
    
    results.sort((a, b) => b.conf - a.conf);
    
    const threshold = THRESHOLDS[phase.id] || 0.46;
    const top = results[0];
    
    const predCounts = { B: 0, P: 0 };
    results.forEach(r => predCounts[r.pred]++);
    const strongConsensus = Math.max(predCounts.B, predCounts.P) >= 6;
    
    if (strongConsensus && results.length >= 6) {
      const consensusPred = predCounts.B >= 6 ? 'B' : 'P';
      const consensusResults = results.filter(r => r.pred === consensusPred);
      const avgConf = consensusResults.reduce((sum, r) => sum + r.conf, 0) / consensusResults.length;
      
      const bestConsensus = consensusResults.reduce((max, r) => r.conf > max.conf ? r : max);
      
      return { 
        chosen: Object.assign({}, bestConsensus, { 
          conf: Math.min(0.98, avgConf * 1.22) 
        }), 
        all: results 
      };
    }
    
    const mapping = { 
      stable: 'deep', noisy: 'ensemble', reversal: 'bayesian', 
      transition: 'quantum', cycle: 'pattern', entropy: 'entropy', undefined: 'neural' 
    };
    
    if (results.length >= 3) {
      const second = results[1];
      const third = results[2];
      const preferred = mapping[phase.id];
      
      if (Math.abs(top.conf - second.conf) < 0.05) {
        const match = [top, second, third].find(r => r.method === preferred);
        if (match && match.conf >= threshold) return { chosen: match, all: results };
      }
    }
    
    if (top.conf >= threshold) return { chosen: top, all: results };
    
    const secondBest = results[1];
    if (secondBest && secondBest.conf >= threshold - 0.05) {
      return { chosen: secondBest, all: results };
    }
    
    return { chosen: null, all: results };
  }

  // ============ MAIN ANALYSIS ============
  function analyze() {
    const hist = historyData;
    
    const detectors = [
      neuralPatternRecognition, 
      deepSequenceAnalysis, 
      markovChainPrediction, 
      bayesianInference, 
      ensembleVoting, 
      quantumSuperposition,
      entropyAnalysis,
      advancedPatternRecognition,
      hiddenMarkovModel,
      reinforcementLearning
    ];
    
    const raw = [];
    
    for (const fn of detectors) {
      try {
        const r = fn(hist);
        if (r && (r.pred === 'B' || r.pred === 'P') && typeof r.conf === 'number') {
          raw.push(r);
        }
      } catch (e) {
        console.error('Detector error:', e);
      }
    }
    
    const candidatePhase = detectPhase(hist);
    const phase = updatePhase(candidatePhase);
    
    const adjusted = raw
      .map(r => adjustWithMemory(r))
      .map(r => applyPhaseWeight(r, phase.id));
    
    const { chosen, all } = selectBest(adjusted, phase);
    
    return { chosen, all, phase };
  }

  // ============ KELLY CRITERION ============
  function calculateKelly(chosen) {
    if (!chosen) return 0;
    
    const winRate = stats.total > 0 ? stats.correct / stats.total : 0.5;
    const conf = chosen.conf;
    
    const p = winRate;
    const q = 1 - p;
    const b = 1;
    
    const kelly = (b * p - q) / b;
    const adjustedKelly = kelly * conf;
    
    return Math.max(0, Math.min(0.25, adjustedKelly));
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
        if (Math.abs(tempStreak) > stats.longestLoss && tempStreak < 0) {
          stats.longestLoss = Math.abs(tempStreak);
        }
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
    
    let methodScore = 0;
    METHODS.forEach(m => {
      ensureMemory(m.id);
      const mem = methodMemory[m.id];
      if (mem.attempts > 0) {
        methodScore += (mem.wins / mem.attempts) * 10;
      }
    });
    methodScore = methodScore / METHODS.length;
    
    const totalScore = (accuracy * 50) + streakBonus + consistencyScore + methodScore;
    
    return Math.min(100, Math.round(totalScore));
  }

  function generateInsights(result) {
    const insights = [];
    
    if (!result.chosen || historyData.length === 0) {
      return ['Đang chờ dữ liệu để phân tích...'];
    }
    
    const consensus = result.all.filter(r => r.pred === result.chosen.pred).length;
    const totalMethods = result.all.length;
    const consensusRate = ((consensus / totalMethods) * 100).toFixed(0);
    
    insights.push(`📊 Đồng thuận: ${consensusRate}% (${consensus}/${totalMethods} phương pháp)`);
    
    const entropy = calculateEntropy(historyData.slice(-20));
    const entropyLevel = entropy < 0.75 ? 'Thấp (Dễ dự đoán)' : entropy < 0.9 ? 'Trung bình' : 'Cao (Khó dự đoán)';
    insights.push(`🎲 Entropy: ${entropyLevel}`);
    
    const recent10 = historyData.slice(-10);
    let streak = 1;
    for (let i = recent10.length - 2; i >= 0; i--) {
      if (recent10[i] === recent10[recent10.length - 1]) streak++;
      else break;
    }
    insights.push(`🔥 Chuỗi hiện tại: ${recent10[recent10.length - 1]}×${streak}`);
    
    insights.push(`🎯 Phase: ${result.phase.label}`);
    insights.push(`⚡ Phương pháp tốt nhất: ${result.chosen.method.toUpperCase()}`);
    
    return insights;
  }

  // ============ PUBLIC API ============
  function addResult(r) {
    if (r !== 'B' && r !== 'P') return;
    
    if (lastChosen && lastChosen.pred) {
      const correct = lastChosen.pred === r;
      predictionHistory.push({ pred: lastChosen.pred, actual: r, correct });
      savePredictions();
      
      updateMemory(r, lastChosen, { id: lastChosen.phase || 'undefined' });
      
      if (historyData.length >= 15) {
        const stateBefore = getStateRepresentation(historyData);
        historyData.push(r);
        const stateAfter = getStateRepresentation(historyData);
        const reward = correct ? 1 : -1;
        updateRLQTable(stateBefore, lastChosen.pred, reward, stateAfter);
        historyData.pop();
      }
    }
    
    historyData.push(r);
    saveHistory();
    recalculateStats();
    
    const result = analyze();
    lastChosen = result.chosen ? Object.assign({}, result.chosen, { phase: result.phase.id }) : null;
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
  }

  function reset() {
    historyData = [];
    predictionHistory = [];
    stats = { correct: 0, total: 0, currentStreak: 0, longestWin: 0, longestLoss: 0 };
    saveHistory();
    savePredictions();
    saveStats();
  }

  function init() {
    historyData = loadHistory();
    methodMemory = loadMemory();
    persistentPhase = loadPhase();
    predictionHistory = loadPredictions();
    stats = loadStats();
    rlMemory = loadRL();
    
    METHODS.forEach(m => ensureMemory(m.id));
    recalculateStats();
  }

  // Initialize
  init();

  // Public API
  return {
    analyze,
    addResult,
    undo,
    reset,
    getHistory: () => historyData.slice(),
    getStats: () => stats,
    getMethods: () => METHODS,
    getMethodMemory: (id) => {
      ensureMemory(id);
      return methodMemory[id];
    },
    calculateKelly,
    calculateAIScore,
    generateInsights
  };

})();

// Debug API
window.__metaDebug = {
  getHistory: () => window.MetaBotCore.getHistory(),
  getMemory: () => window.MetaBotCore.getMethodMemory,
  getStats: () => window.MetaBotCore.getStats(),
  analyze: () => window.MetaBotCore.analyze(),
  testKelly: (conf, winRate) => window.MetaBotCore.calculateKelly({ conf })
};
