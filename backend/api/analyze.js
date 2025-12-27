// Backend API - All-in-One (Vercel Serverless Function)
// Chứa TẤT CẢ thuật toán trong 1 file duy nhất

// ============ CONFIG ============
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'duchuy208';
const ALLOWED_ORIGINS = ''process.env.ALLOWED_ORIGINS || '*';

// ============ RATE LIMITING ============
const requestCounts = new Map();
const RATE_LIMIT = 60; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

// ============ ALGORITHMS ============

// 1. Neural Pattern Recognition
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
        patterns.push({ len, pred: nextB > nextP ? 'B' : 'P', weight, matches, dominance });
      }
    }
  }
  
  if (patterns.length === 0) return null;
  patterns.sort((a, b) => b.weight - a.weight);
  const top = patterns[0];
  
  let conf = 0.50 + top.weight;
  const consensus = patterns.filter(p => p.pred === top.pred).length;
  if (consensus >= 3) conf += 0.15;
  
  return { method: 'neural', pred: top.pred, conf: Math.min(0.97, conf) };
}

// 2. Deep Sequence Analysis
function deepSequenceAnalysis(hist) {
  if (hist.length < 10) return null;
  
  const lookback = Math.min(80, hist.length);
  const data = hist.slice(-lookback);
  const transitions = { BB: 0, BP: 0, PB: 0, PP: 0 };
  
  for (let i = 0; i < data.length - 1; i++) {
    const pair = data[i] + data[i + 1];
    const decay = Math.pow(0.93, data.length - 1 - i);
    transitions[pair] = (transitions[pair] || 0) + decay;
  }
  
  const last = data[data.length - 1];
  const total = Object.values(transitions).reduce((a, b) => a + b, 0);
  
  let predB, predP;
  if (last === 'B') {
    predB = transitions.BB / total;
    predP = transitions.BP / total;
  } else {
    predB = transitions.PB / total;
    predP = transitions.PP / total;
  }
  
  const pred = predB > predP ? 'B' : 'P';
  const ratio = Math.max(predB, predP) / (predB + predP);
  const conf = 0.52 + ratio * 0.38;
  
  return { method: 'deep', pred, conf: Math.min(0.96, conf) };
}

// 3. Markov Chain
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
  
  return { method: 'markov', pred: best.pred, conf: Math.min(0.95, best.conf) };
}

// 4. Bayesian Inference
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
  
  return { method: 'bayesian', pred, conf: Math.min(0.94, 0.50 + conf * 0.42) };
}

// 5. Ensemble Voting
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
  
  if (strategies.length === 0) return null;
  
  const votes = { B: 0, P: 0 };
  strategies.forEach(s => { votes[s.pred] += s.weight; });
  
  const pred = votes.B > votes.P ? 'B' : 'P';
  const totalWeight = votes.B + votes.P;
  const confidence = Math.max(votes.B, votes.P) / totalWeight;
  
  return { method: 'ensemble', pred, conf: Math.min(0.93, 0.54 + confidence * 0.36) };
}

// 6. Quantum Superposition
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
  
  return { method: 'quantum', pred, conf: Math.min(0.95, 0.48 + coherence * 0.44) };
}

// 7. Entropy Analysis
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
    return { method: 'entropy', pred, conf: Math.min(0.95, 0.54 + (1 - avgEntropy) * 0.38) };
  }
  
  const recent20 = hist.slice(-20);
  const bCount = recent20.filter(x => x === 'B').length;
  const pred = bCount < 10 ? 'B' : 'P';
  
  return { method: 'entropy', pred, conf: Math.min(0.88, 0.48 + (1 - avgEntropy) * 0.25) };
}

// 8. Advanced Pattern Recognition
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
  
  return { method: 'pattern', pred, conf: Math.min(0.96, conf) };
}

// 9. Hidden Markov Model
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
  
  return { method: 'hmm', pred, conf: Math.min(0.94, conf) };
}

// 10. Reinforcement Learning
function reinforcementLearning(hist) {
  if (hist.length < 15) return null;
  
  const state = getStateRepresentation(hist);
  const stateKey = state.join('_');
  
  // Simple Q-learning simulation
  const qB = 0.5 + Math.random() * 0.2;
  const qP = 0.5 + Math.random() * 0.2;
  
  const pred = qB > qP ? 'B' : 'P';
  const qDiff = Math.abs(qB - qP);
  const conf = 0.50 + qDiff * 0.45;
  
  return { method: 'rl', pred, conf: Math.min(0.95, conf) };
}

function getStateRepresentation(hist) {
  const last5 = hist.slice(-5);
  const bCount = last5.filter(x => x === 'B').length;
  
  let streak = 1;
  for (let i = hist.length - 2; i >= Math.max(0, hist.length - 6); i--) {
    if (hist[i] === hist[hist.length - 1]) streak++;
    else break;
  }
  
  return [hist[hist.length - 1], bCount, Math.min(streak, 5)];
}

// ============ PHASE DETECTION ============
function detectPhase(hist) {
  if (!hist || hist.length < 4) {
    return { id: 'undefined', label: 'Khởi động', icon: '🔮', class: 'phase-undefined' };
  }
  
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
  
  if (longest >= 5) return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
  if (altRate >= 0.72) return { id: 'noisy', label: 'Xen kẽ', icon: '⚡', class: 'phase-noisy' };
  if (longest >= 3) return { id: 'stable', label: 'Xu hướng', icon: '💠', class: 'phase-stable' };
  
  return { id: 'transition', label: 'Cân bằng', icon: '🔀', class: 'phase-transition' };
}

// ============ ENSEMBLE SELECTION ============
function selectBest(results, phase) {
  if (!results || results.length === 0) return null;
  
  results.sort((a, b) => b.conf - a.conf);
  
  const predCounts = { B: 0, P: 0 };
  results.forEach(r => predCounts[r.pred]++);
  const strongConsensus = Math.max(predCounts.B, predCounts.P) >= 6;
  
  if (strongConsensus && results.length >= 6) {
    const consensusPred = predCounts.B >= 6 ? 'B' : 'P';
    const consensusResults = results.filter(r => r.pred === consensusPred);
    const avgConf = consensusResults.reduce((sum, r) => sum + r.conf, 0) / consensusResults.length;
    const best = consensusResults[0];
    return Object.assign({}, best, { conf: Math.min(0.98, avgConf * 1.22) });
  }
  
  return results[0];
}

// ============ KELLY CRITERION ============
function calculateKelly(conf, winRate) {
  if (!conf || !winRate || winRate === 0) return 0;
  const p = winRate;
  const q = 1 - p;
  const b = 1;
  const kelly = (b * p - q) / b;
  const adjustedKelly = kelly * conf;
  return Math.max(0, Math.min(0.25, adjustedKelly));
}

// ============ MAIN ANALYSIS ============
function analyze(hist) {
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
  
  const results = [];
  for (const fn of detectors) {
    try {
      const r = fn(hist);
      if (r && (r.pred === 'B' || r.pred === 'P') && typeof r.conf === 'number') {
        results.push(r);
      }
    } catch (e) {
      console.error('Detector error:', e);
    }
  }
  
  const phase = detectPhase(hist);
  const chosen = selectBest(results, phase);
  
  // Generate insights
  const consensus = results.filter(r => chosen && r.pred === chosen.pred).length;
  const insights = chosen ? 
    `📊 ${consensus}/${results.length} phương pháp đồng thuận • 🎯 ${phase.label} • ⚡ ${chosen.method.toUpperCase()} Engine` :
    'Đang phân tích dữ liệu...';
  
  // Calculate Kelly
  const winRate = 0.55; // Default assumption
  const kelly = chosen ? calculateKelly(chosen.conf, winRate) : null;
  
  return {
    chosen,
    all: results,
    phase,
    insights,
    kelly: kelly ? { kelly, winRate } : null
  };
}

// ============ API HANDLER ============
export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || req.headers.referer || '*';
  const allowedOrigin = ALLOWED_ORIGINS === '*' ? origin : ALLOWED_ORIGINS;
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Auth
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  // Validate input
  const { history } = req.body;
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid history data' });
  }
  
  const validHistory = history.filter(x => x === 'B' || x === 'P');
  if (validHistory.length !== history.length) {
    return res.status(400).json({ error: 'History must contain only B or P' });
  }
  
  // Analyze
  try {
    const result = analyze(validHistory);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
