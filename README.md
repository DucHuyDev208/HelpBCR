# ⚫ Meta Bot Pro V9.0 Ultimate ⚫

Advanced AI-powered Baccarat prediction system with 10 cutting-edge algorithms.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/meta-bot-pro)

## 🚀 Features

- **10 AI Algorithms**: Neural, Deep Learning, Markov Chain, Bayesian, Ensemble, Quantum, Entropy, Pattern Recognition, HMM, Reinforcement Learning
- **7 Phase Detection**: Stable, Noisy, Reversal, Transition, Cycle, Entropy, Undefined
- **Adaptive Learning**: Methods learn and improve over time
- **Kelly Criterion**: Scientific bankroll management
- **Real-time Stats**: Track accuracy, streaks, and performance
- **Local Storage**: All data saved in browser
- **Password Protection**: Secure access control
- **Responsive Design**: Works on all devices

## 📦 Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Deploy in one click
4. Access your app at `https://your-project.vercel.app`

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/meta-bot-pro.git
cd meta-bot-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## 🔐 Security

### Default Password
```
metabot2024
```

### Change Password

1. Open `src/auth.js`
2. Find line: `const VALID_PASSWORD = 'metabot2024';`
3. Change to your password
4. Save and deploy

### Protect Algorithm

Before deploying, obfuscate `src/core.js`:

1. Visit [javascript-obfuscator.com](https://obfuscator.io/)
2. Paste code from `src/core.js`
3. Select "High Obfuscation"
4. Copy obfuscated code back to `src/core.js`
5. Commit and push

## 📁 Project Structure

```
meta-bot-pro/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── auth.js             # Authentication system
│   ├── core.js             # AI algorithms (protect this!)
│   └── app.js              # UI controller
├── vercel.json             # Vercel configuration
├── package.json            # NPM configuration
└── README.md              # Documentation
```

## 🎮 Usage

### Keyboard Shortcuts
- `B` - Add Banker result
- `P` - Add Player result
- `U` - Undo last result
- `R` - Reset all data

### Understanding Predictions

**Confidence Level:**
- 🟢 90%+ - Very High (Strong signal)
- 🟡 70-89% - High (Good signal)
- 🟠 50-69% - Medium (Moderate signal)
- 🔴 <50% - Low (Weak signal)

**Kelly Criterion:**
Shows recommended bankroll percentage based on confidence and win rate.

### Phase Types

1. **💠 Xu hướng (Trend)** - Stable streaks
2. **⚡ Xen kẽ (Alternating)** - High alternation rate
3. **🔄 Đảo chiều (Reversal)** - Trend reversal detected
4. **🔀 Cân bằng (Transition)** - Balanced state
5. **🔄 Chu kỳ (Cycle)** - Repeating patterns
6. **💎 Dự đoán cao (High Predictability)** - Low entropy
7. **🔮 Phân tích (Analyzing)** - Initial state

## 🧠 AI Methods

| Method | Description | Best For |
|--------|-------------|----------|
| Neural | Pattern recognition | General patterns |
| Deep | Sequence analysis | Trends |
| Markov | State transitions | Sequential data |
| Bayesian | Probability inference | Statistical analysis |
| Ensemble | Strategy voting | Combining signals |
| Quantum | Superposition states | Multi-scale analysis |
| Entropy | Predictability analysis | Chaos detection |
| Pattern | N-gram matching | Recurring patterns |
| HMM | Hidden states | Trend classification |
| DeepRL | Reinforcement learning | Adaptive learning |

## 📊 Statistics

The system tracks:
- Total games
- Prediction accuracy
- Win/loss streaks
- Banker/Player distribution
- AI performance score
- Method-specific win rates
- Phase-specific performance

## 🛠️ Configuration

### Session Duration

Edit `src/auth.js`:
```javascript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

### Storage Keys

All data stored with prefix `meta_baccarat_*`:
- `meta_baccarat_history_v9` - Game history
- `meta_baccarat_method_memory_v9` - Method performance
- `meta_baccarat_phase_v9` - Current phase
- `meta_baccarat_stats_v9` - Statistics
- `meta_baccarat_predictions_v9` - Prediction history
- `meta_baccarat_rl_v9` - RL Q-table

## 🐛 Debugging

Open browser console and access debug tools:

```javascript
// View current history
window.__metaDebug.getHistory()

// View method memory
window.__metaDebug.getMemory()

// Analyze current state
window.__metaDebug.analyze()

// View statistics
window.__metaDebug.getStats()

// Test Kelly calculation
window.__metaDebug.testKelly(0.75, 0.60)
```

## 🔄 Updates

To update after deployment:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel automatically redeploys on push.

## ⚠️ Disclaimer

This tool is for **educational and entertainment purposes only**. 

- Not financial advice
- Gambling involves risk
- Past performance ≠ future results
- Use responsibly
- Check local laws before using

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📞 Support

- Issues: [GitHub Issues](https://github.com/yourusername/meta-bot-pro/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/meta-bot-pro/discussions)

## 🌟 Credits

Developed with ❤️ by Meta Bot Team

Powered by:
- Advanced machine learning algorithms
- Statistical analysis
- Reinforcement learning
- Pattern recognition

---

**Version:** 9.0 Ultimate  
**Last Updated:** December 2025  
**Status:** Production Ready ✅
