# CRT CHAOS - Interactive Puzzle Website

![CRT CHAOS](https://img.shields.io/badge/status-SYSTEM%20UNSTABLE-red)
![License](https://img.shields.io/badge/license-MIT-green)
![Puzzles](https://img.shields.io/badge/puzzles-8%20MALFUNCTIONS-yellow)

A retro-styled interactive puzzle website that simulates a broken CRT monitor system. Players must solve 8 unique puzzles to restore system stability while dealing with increasing chaos levels that affect the entire interface.

## 🎮 Overview

CRT CHAOS is an immersive web experience where you're tasked with debugging a malfunctioning computer system. Each puzzle represents a different system component that has gained sentience or broken in creative ways. As you progress, the website itself becomes increasingly chaotic with glitch effects, making the challenge progressively harder.

## 🚀 Features

- **8 Unique Puzzles**: Each with distinct mechanics and personality
- **Dynamic Chaos System**: Visual effects intensify as chaos levels increase
- **Retro CRT Aesthetic**: Authentic scanlines, screen flicker, and phosphor glow
- **Panic Menu**: Emergency controls when things get too chaotic (Press ESC)
- **Progress Persistence**: LocalStorage saves your progress
- **Terminal Interface**: Command-line access for advanced users
- **Easter Eggs**: Hidden features and secret commands

## 🧩 The Puzzles

### ✅ Completed Puzzles (8/8)

1. **Sentient Terminal** - A terminal that refuses commands until you're nice to it
   - Solution: Be polite (please, thank you), then "fix yourself"
   
2. **Paranoid Password** - Login system that thinks everyone is a spy
   - Solution: Username "trustno1", password "thetruthisoutthere"
   
3. **Time-Traveling Clock** - Synchronize temporal anomalies across timelines
   - Solution: Set all clocks to the same time to stabilize
   
4. **Drunk Navigation** - Menu items that won't stay still
   - Solution: Click "Sobriety Test" when it appears
   
5. **Conspiracy Search** - Search engine with escalating paranoia
   - Solution: Search for "the truth"
   
6. **Existential Error** - 404 page having an identity crisis
   - Solution: Reassure it with "you have purpose"
   
7. **Mime Modal** - Communicate through emojis only
   - Solution: 👋 → 🚪 → 🔓 → 🎉 (Wave → Door → Unlock → Celebrate)
   
8. **Recursive Iframe Maze** - Navigate through nested portal dimensions
   - Solution: Alpha → Gamma → Beta → Delta → Omega

## 🎯 How to Play

1. **Access Systems**: Click "ACCESS SYSTEM" on any malfunctioning component
2. **Solve Puzzles**: Each puzzle has a unique solution requiring different approaches
3. **Manage Chaos**: Use the panic menu (ESC) if things get too wild
4. **Track Progress**: Monitor your completion status and elapsed time
5. **Complete All 8**: Restore full system stability

### Controls

- **ESC** - Open Panic Menu (chaos management)
- **Ctrl+Shift+C** - Quick Calm (reduce effects)
- **Ctrl+Shift+R** - Emergency Reset (restart chaos)
- Click outside modals to close them
- **Konami Code** - ↑ ↑ ↓ ↓ ← → ← → B A (Dev mode)

## 💻 Installation

### Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Python 3.x (for local server)
- Desktop/laptop recommended (mobile support limited)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/VonHoltenCodes/crt-chaos.git
cd crt-chaos
```

2. Start the local server:
```bash
python -m http.server 8000
```

3. Open in browser:
```
http://localhost:8000
```

## 🏗️ Project Structure

```
crt-chaos/
├── index.html              # Main page with puzzle grid
├── css/
│   ├── style.css          # Base styles
│   ├── crt.css            # CRT monitor effects
│   ├── chaos-engine.css   # Glitch effects & chaos styling
│   └── back-to-top.css    # Navigation button
├── js/
│   ├── chaos-core.js      # Chaos management system
│   ├── main.js            # App initialization
│   ├── back-to-top.js     # Navigation helper
│   └── puzzles/           # Individual puzzle modules
│       ├── sentient-terminal.js
│       ├── paranoid-password.js
│       ├── time-clock.js
│       ├── drunk-nav.js
│       ├── conspiracy-search.js
│       ├── existential-error.js
│       ├── mime-modal.js
│       └── iframe-maze.js
├── images/
│   └── favicon.ico        # Site icon
└── server.log            # Server logs (generated)
```

## 🛠️ Terminal Commands

Access the terminal interface for advanced features:

- `help` - Show all available commands
- `status` - Display current system health
- `list` - Show all puzzles and their status
- `chaos` - Check current chaos level
- `puzzle [id]` - Launch specific puzzle by ID
- `hint [id]` - Get detailed hints for a puzzle
- `reset` - Reset all progress (requires confirmation)
- `clear` - Clear terminal output
- `easter egg` - Discover secret features

## 🎨 Technical Details

### Chaos Engine
The chaos system (`chaos-core.js`) manages:
- Visual glitch effects (screen tears, color shifts, element shakes)
- Theme variations (inverted, monochrome, matrix)
- Progressive difficulty through chaos levels
- Performance optimization for smooth animations

### Puzzle Architecture
Each puzzle extends a base pattern:
```javascript
class PuzzleName extends Puzzle {
    activate()    // Show puzzle modal
    close()       // Clean up and hide
    solve()       // Mark as complete
}
```

### Storage & Progress
- **LocalStorage**: Saves solved puzzles and chaos level
- **Session Persistence**: Progress survives page reloads
- **Reset Function**: Clear all progress via terminal

## 🐛 Troubleshooting

### Common Issues

1. **Puzzles not loading**: Clear browser cache and reload
2. **Progress not saving**: Check if LocalStorage is enabled
3. **Too much chaos**: Press ESC for panic menu options
4. **Performance issues**: Use "Calm Down" in panic menu

### Debug Mode
- Console access: `window.chaos`
- Manual solve: `window.chaos.puzzleSolved('puzzle-id')`
- Check status: `window.chaos.solvedPuzzles`

## 🎮 Game Mechanics

### Chaos Level System
- Starts at level 7 (high chaos)
- Decreases by 1.5 for each solved puzzle
- Affects frequency and intensity of glitches
- Can be managed through panic menu

### Visual Effects
- **CRT Effects**: Scanlines, vignette, screen curve
- **Glitch Types**: Random tears, color inversions, shakes
- **Theme Chaos**: Automatic theme switching at high chaos
- **Retro Aesthetic**: Green phosphor glow, monospace fonts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewPuzzle`)
3. Commit changes (`git commit -m 'Add new puzzle'`)
4. Push to branch (`git push origin feature/NewPuzzle`)
5. Open Pull Request

### Adding New Puzzles
1. Create puzzle class in `js/puzzles/`
2. Extend base puzzle structure
3. Register in `index.html` puzzle array
4. Add activation case in `loadPuzzle()`

## 📜 License

MIT License - see LICENSE file for details

## 🎭 Credits

- **Design & Development**: VonHoltenCodes
- **Inspiration**: Old CRT monitors, system errors, and escape rooms
- **Built**: With a gun to my head (2025)

## 🔗 Links

- [GitHub Repository](https://github.com/VonHoltenCodes)
- [Report Issues](https://github.com/VonHoltenCodes/crt-chaos/issues)

---

**WARNING**: This system is intentionally unstable. Side effects may include: temporal displacement, existential dread, and uncontrollable laughter. The frustration is the feature.

*Remember: When in doubt, press ESC to panic.*