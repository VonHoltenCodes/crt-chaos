/**
 * CRT Chaos - Core Chaos Engine
 * Controls all glitches, themes, and puzzle management
 */

// Debug mode - set to false for production
const DEBUG_MODE = true;

// Safe console wrapper
const safeConsole = {
    log: (...args) => DEBUG_MODE && console.log(...args),
    error: (...args) => console.error(...args), // Always show errors
    warn: (...args) => DEBUG_MODE && console.warn(...args)
};

class ChaosEngine {
    constructor() {
        this.chaosLevel = 3; // 0-10 scale - starting with some chaos!
        this.maxChaos = 10;
        this.activePuzzles = new Map();
        this.solvedPuzzles = new Set();
        this.glitchTimers = [];
        this.themeStates = ['normal', 'inverted', 'monochrome', 'glitch', 'matrix'];
        this.currentTheme = 'normal';
        this.isStable = false;
        
        // Audio settings - disabled for now
        this.audioEnabled = false;
        this.sounds = {
            glitch: 'assets/sounds/glitch.mp3',
            error: 'assets/sounds/error.mp3',
            success: 'assets/sounds/success.mp3',
            typing: 'assets/sounds/typing.mp3'
        };
        
        this.init();
    }
    
    init() {
        safeConsole.log('ChaosEngine init() called');
        
        try {
            this.loadProgress();
            this.setupEventListeners();
            this.startChaos();
            this.initializeAudio();
            
            // Update chaos meter to correct initial value
            const fillElement = document.getElementById('chaos-meter-fill');
            if (fillElement) {
                const fillPercent = (this.chaosLevel / 10) * 100;
                fillElement.style.width = fillPercent + '%';
                console.log(`[CHAOS DEBUG] Initial chaos meter set to ${fillPercent}% (chaos level: ${this.chaosLevel})`);
            }
            
            safeConsole.log('%c CRT CHAOS INITIALIZED ', 'background: #00ff00; color: #000; font-size: 20px;');
            safeConsole.log('%c Chaos Level: ' + this.chaosLevel, 'color: #00ff00;');
        } catch (error) {
            console.error('ChaosEngine initialization error:', error);
        }
    }
    
    startChaos() {
        // Schedule random glitches based on chaos level
        this.scheduleRandomGlitch();
        
        // Start theme switcher chaos
        if (this.chaosLevel > 3) {
            this.scheduleThemeSwitches();
        }
        
        // Add CRT effects
        this.applyCRTEffects();
        
        // Initialize screen flicker
        if (this.chaosLevel > 5) {
            this.startScreenFlicker();
        }
    }
    
    scheduleRandomGlitch() {
        // More chaos = more frequent glitches
        const delay = Math.random() * (10000 / Math.max(1, this.chaosLevel)) + 1000;
        
        const timer = setTimeout(() => {
            this.triggerRandomGlitch();
            if (!this.isStable) {
                this.scheduleRandomGlitch();
            }
        }, delay);
        
        this.glitchTimers.push(timer);
    }
    
    triggerRandomGlitch() {
        const glitchTypes = [
            () => this.screenTear(),
            () => this.pixelate(),
            () => this.colorShift(),
            () => this.textScramble(),
            () => this.elementShake()
        ];
        
        // Higher chaos = multiple glitches at once!
        const glitchCount = this.chaosLevel > 7 ? 3 : this.chaosLevel > 5 ? 2 : 1;
        
        for (let i = 0; i < glitchCount; i++) {
            const randomGlitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
            setTimeout(() => randomGlitch(), i * 100);
        }
        
        // Play glitch sound
        if (window.audioManager && window.audioManager.enabled) {
            window.audioManager.playGlitch();
        }
    }
    
    screenTear() {
        document.body.classList.add('screen-tear');
        setTimeout(() => {
            document.body.classList.remove('screen-tear');
        }, 200);
    }
    
    pixelate() {
        document.body.style.filter = 'contrast(150%) brightness(120%)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 100);
    }
    
    colorShift() {
        const shifts = ['hue-rotate(90deg)', 'hue-rotate(180deg)', 'hue-rotate(270deg)'];
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        document.body.style.filter = shift;
        setTimeout(() => {
            document.body.style.filter = '';
        }, 300);
    }
    
    textScramble() {
        const elements = document.querySelectorAll('p, h1, h2, h3, button');
        const element = elements[Math.floor(Math.random() * elements.length)];
        
        if (element && !element.classList.contains('no-scramble')) {
            const originalText = element.textContent;
            element.textContent = this.scrambleText(originalText);
            
            setTimeout(() => {
                element.textContent = originalText;
            }, 500);
        }
    }
    
    scrambleText(text) {
        const chars = 'ÆΔłθΩ¡¿█▓▒░╫╬╩╦╠╣║';
        return text.split('').map(char => 
            Math.random() > 0.5 ? char : chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }
    
    elementShake() {
        const elements = document.querySelectorAll('.puzzle-container, .nav-menu, .hero-content');
        const element = elements[Math.floor(Math.random() * elements.length)];
        
        if (element) {
            element.classList.add('shake');
            setTimeout(() => {
                element.classList.remove('shake');
            }, 500);
        }
    }
    
    scheduleThemeSwitches() {
        const delay = Math.random() * 20000 + 10000;
        
        const timer = setTimeout(() => {
            if (this.chaosLevel > 3 && !this.isStable) {
                this.switchTheme();
                this.scheduleThemeSwitches();
            }
        }, delay);
        
        this.glitchTimers.push(timer);
    }
    
    switchTheme() {
        const themes = this.themeStates.filter(t => t !== this.currentTheme);
        const newTheme = themes[Math.floor(Math.random() * themes.length)];
        
        // Remove all theme classes
        this.themeStates.forEach(theme => {
            document.body.classList.remove(`theme-${theme}`);
        });
        
        // Add new theme
        document.body.classList.add(`theme-${newTheme}`);
        this.currentTheme = newTheme;
        
        // Play sound effect
        this.playSound('glitch');
        
        // Show theme notification
        this.showNotification(`THEME CORRUPTION: ${newTheme.toUpperCase()} MODE`);
    }
    
    applyCRTEffects() {
        // Add scanlines
        if (!document.querySelector('.crt-scanlines')) {
            const scanlines = document.createElement('div');
            scanlines.className = 'crt-scanlines';
            document.body.appendChild(scanlines);
        }
        
        // Add single sweep scanline
        if (!document.querySelector('.crt-scanline-sweep')) {
            const sweepScanline = document.createElement('div');
            sweepScanline.className = 'crt-scanline-sweep';
            document.body.appendChild(sweepScanline);
        }
        
        // Add vignette
        if (!document.querySelector('.crt-vignette')) {
            const vignette = document.createElement('div');
            vignette.className = 'crt-vignette';
            document.body.appendChild(vignette);
        }
    }
    
    startScreenFlicker() {
        const flicker = () => {
            if (Math.random() < 0.05) { // 5% chance
                document.body.style.opacity = '0.95';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 50);
            }
            
            if (!this.isStable && this.chaosLevel > 5) {
                requestAnimationFrame(flicker);
            }
        };
        
        requestAnimationFrame(flicker);
    }
    
    // Puzzle Management
    registerPuzzle(puzzleId, puzzleInstance) {
        this.activePuzzles.set(puzzleId, puzzleInstance);
        safeConsole.log(`%c Puzzle Registered: ${puzzleId}`, 'color: #00ff00;');
    }
    
    puzzleSolved(puzzleId) {
        if (this.solvedPuzzles.has(puzzleId)) return;
        
        console.log(`[CHAOS DEBUG] Puzzle solved: ${puzzleId}`);
        console.log(`[CHAOS DEBUG] Chaos level BEFORE: ${this.chaosLevel}`);
        
        this.solvedPuzzles.add(puzzleId);
        const oldChaos = this.chaosLevel;
        this.chaosLevel = Math.max(1, this.chaosLevel - 1); // Never go below 1 until all puzzles solved
        
        console.log(`[CHAOS DEBUG] Chaos level AFTER: ${this.chaosLevel} (reduced by ${oldChaos - this.chaosLevel})`);
        
        // Play success sound
        if (window.audioManager && window.audioManager.enabled) {
            window.audioManager.playSuccess();
        }
        this.showNotification(`SYSTEM STABILIZED: ${puzzleId}`);
        
        // Save progress
        this.saveProgress();
        
        // Check if all puzzles solved
        if (this.solvedPuzzles.size === this.activePuzzles.size && this.activePuzzles.size > 0) {
            console.log(`[CHAOS DEBUG] All puzzles solved! Calling victory()`);
            this.victory();
        }
        
        safeConsole.log(`%c Chaos Level: ${this.chaosLevel}`, 'color: #00ff00;');
    }
    
    increaseChaos(amount = 0.5) {
        const oldChaos = this.chaosLevel;
        this.chaosLevel = Math.min(this.maxChaos, this.chaosLevel + amount);
        
        console.log(`[CHAOS DEBUG] Chaos INCREASED from ${oldChaos} to ${this.chaosLevel} (amount: ${amount})`);
        console.trace('[CHAOS DEBUG] Stack trace for chaos increase');
        
        // More chaos = more glitches!
        if (this.chaosLevel > 5) {
            this.startScreenFlicker();
        }
        if (this.chaosLevel > 7) {
            this.scheduleThemeSwitches();
        }
        
        safeConsole.log(`%c Chaos Level: ${this.chaosLevel}`, 'color: #ff0000;');
    }
    
    // Progress Management
    saveProgress() {
        const progress = {
            solvedPuzzles: Array.from(this.solvedPuzzles),
            chaosLevel: this.chaosLevel,
            timestamp: Date.now()
        };
        
        localStorage.setItem('crt-chaos-progress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('crt-chaos-progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.solvedPuzzles = new Set(progress.solvedPuzzles);
            this.chaosLevel = Math.max(3, progress.chaosLevel || 3); // Always start with some chaos
        }
    }
    
    resetProgress() {
        localStorage.removeItem('crt-chaos-progress');
        localStorage.removeItem('crt-chaos-start-time'); // Reset timer too
        this.solvedPuzzles.clear();
        this.chaosLevel = 3; // Start with chaos!
        location.reload();
    }
    
    // UI Helpers
    showNotification(message, type = 'system') {
        const notification = document.createElement('div');
        notification.className = `chaos-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Audio
    initializeAudio() {
        // Initialize audio manager if available
        if (window.audioManager) {
            window.audioManager.init();
            safeConsole.log('Audio manager initialized');
        } else {
            safeConsole.log('Audio manager not found - sounds will be disabled');
        }
    }
    
    playSound(soundName) {
        // Use audio manager if available
        if (window.audioManager) {
            window.audioManager.play(soundName);
        }
    }
    
    // Victory condition
    victory() {
        this.isStable = true;
        this.chaosLevel = 0;
        
        // Clear all timers
        this.glitchTimers.forEach(timer => clearTimeout(timer));
        
        // Remove all effects
        document.body.className = 'victory-state';
        
        // Show victory message
        setTimeout(() => {
            this.showNotification('SYSTEM FULLY STABILIZED - YOU WIN!', 'victory');
            document.querySelector('.hero-title').textContent = 'CHAOS CONQUERED';
        }, 1000);
    }
    
    // Event Listeners
    setupEventListeners() {
        // Listen for chaos events from puzzles
        window.addEventListener('chaos-event', (e) => {
            if (e.detail.type === 'increase') {
                this.increaseChaos(e.detail.amount);
            }
        });
        
        // Konami code for dev mode
        let konamiCode = [];
        const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            konamiCode = konamiCode.slice(-10);
            
            if (konamiCode.join(',') === konamiPattern.join(',')) {
                this.enableDevMode();
            }
            
            // Panic button: ESC key shows help
            if (e.key === 'Escape') {
                this.showPanicMenu();
            }
            
            // Emergency reset: Ctrl+Shift+R
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.emergencyReset();
            }
            
            // Quick calm: Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.calmDown();
            }
        });
    }
    
    enableDevMode() {
        safeConsole.log('%c DEV MODE ACTIVATED ', 'background: #ff00ff; color: #000; font-size: 20px;');
        this.showNotification('DEV MODE ACTIVATED');
        window.chaosEngine = this; // Expose to console
    }
    
    // Panic Menu and Emergency Controls
    showPanicMenu() {
        if (document.getElementById('panic-menu')) return;
        
        const menu = document.createElement('div');
        menu.id = 'panic-menu';
        menu.className = 'panic-menu';
        menu.innerHTML = `
            <div class="panic-content">
                <h2 class="glitch-text" data-text="PANIC MENU">PANIC MENU</h2>
                <p>System too chaotic? Here's help:</p>
                
                <div class="panic-options">
                    <button onclick="window.chaos.calmDown()">🧘 Calm Down (Reduce Chaos)</button>
                    <button onclick="window.chaos.stopAllGlitches()">🛑 Stop All Glitches</button>
                    <button onclick="window.chaos.resetTheme()">🎨 Reset Theme</button>
                    <button onclick="window.chaos.showHints()">💡 Show Puzzle Hints</button>
                    <button onclick="window.chaos.emergencyReset()">🚨 EMERGENCY RESET</button>
                </div>
                
                <div class="panic-shortcuts">
                    <h3>Keyboard Shortcuts:</h3>
                    <p><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> - Quick Calm</p>
                    <p><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> - Emergency Reset</p>
                    <p><kbd>ESC</kbd> - Close This Menu</p>
                </div>
                
                <button class="panic-close" onclick="window.chaos.closePanicMenu()">✕ Close</button>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Store close handler as a property so we can remove it later
        this.panicCloseHandler = (e) => {
            if (e.key === 'Escape' || (e.type === 'click' && e.target === menu)) {
                this.closePanicMenu();
            }
        };
        
        // Add temporary ESC handler
        document.addEventListener('keydown', this.panicCloseHandler);
        menu.addEventListener('click', this.panicCloseHandler);
    }
    
    closePanicMenu() {
        const menu = document.getElementById('panic-menu');
        if (menu) {
            // Remove the temporary event handlers
            if (this.panicCloseHandler) {
                document.removeEventListener('keydown', this.panicCloseHandler);
                menu.removeEventListener('click', this.panicCloseHandler);
                this.panicCloseHandler = null;
            }
            menu.remove();
        }
    }
    
    calmDown() {
        // Reduce chaos level but not too much - this is CHAOS after all!
        this.chaosLevel = Math.max(2, this.chaosLevel - 1.5);
        this.showNotification('Taking deep breaths... Chaos reduced slightly', 'success');
        this.showNotification('But the chaos never truly stops...', 'warning');
        
        // Stop current glitches
        this.stopAllGlitches();
        
        // Reset any extreme visual effects
        document.body.style.filter = '';
        document.body.style.transform = '';
        document.body.style.opacity = '1';
        
        // But immediately start causing trouble again!
        setTimeout(() => {
            this.showNotification('The chaos returns...', 'error');
            this.scheduleRandomGlitch();
        }, 3000);
        
        safeConsole.log(`%c Chaos Level: ${this.chaosLevel}`, 'color: #00ff00;');
    }
    
    stopAllGlitches() {
        // Clear all timers
        this.glitchTimers.forEach(timer => clearTimeout(timer));
        this.glitchTimers = [];
        
        // Remove all glitch classes
        document.body.classList.remove('screen-tear', 'shake');
        document.querySelectorAll('.shake').forEach(el => el.classList.remove('shake'));
        
        // Reset visual effects
        document.body.style.filter = '';
        document.body.style.transform = '';
        
        this.showNotification('All glitches stopped', 'success');
        
        // Restart with reduced frequency
        if (this.chaosLevel > 0) {
            setTimeout(() => this.scheduleRandomGlitch(), 5000);
        }
    }
    
    resetTheme() {
        // Remove all theme classes
        this.themeStates.forEach(theme => {
            document.body.classList.remove(`theme-${theme}`);
        });
        
        // Set to normal theme
        this.currentTheme = 'normal';
        document.body.classList.add('theme-normal');
        
        this.showNotification('Theme reset to normal', 'success');
    }
    
    showHints() {
        const hints = {
            'sentient-terminal': 'Try complimenting the terminal. Say something nice!',
            'paranoid-password': 'The password thinks you\'re a spy. Try: trustno1',
            'time-clock': 'Sync all clocks to the same time to stabilize the temporal field',
            'drunk-nav': 'Look for the "Sobriety Test" option',
            'conspiracy-search': 'Search for "the truth" to blow its mind',
            'existential-error': 'Reassure it about its purpose. Say "you have purpose"',
            'mime-modal': 'Wave → Door → Unlock → Celebrate',
            'iframe-maze': 'Follow the breadcrumbs back to the root'
        };
        
        let hintText = 'PUZZLE HINTS:\n\n';
        
        this.activePuzzles.forEach((puzzle, id) => {
            if (!this.solvedPuzzles.has(id) && hints[id]) {
                hintText += `${puzzle.puzzleId || id}: ${hints[id]}\n\n`;
            }
        });
        
        alert(hintText);
    }
    
    emergencyReset() {
        if (confirm('⚠️ EMERGENCY RESET ⚠️\n\nThis will:\n- Reset all progress\n- Clear all glitches\n- Return to chaos level 1\n\nAre you sure?')) {
            // Stop everything
            this.isStable = true;
            this.glitchTimers.forEach(timer => clearTimeout(timer));
            
            // Reset all values
            this.chaosLevel = 3; // Even emergency reset starts with chaos!
            this.solvedPuzzles.clear();
            this.currentTheme = 'normal';
            
            // Clear all visual effects
            document.body.className = '';
            document.body.style = '';
            
            // Save and reload
            this.resetProgress();
        }
    }
}

// Initialize chaos when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    safeConsole.log('DOM loaded, initializing ChaosEngine...');
    try {
        window.chaos = new ChaosEngine();
        safeConsole.log('ChaosEngine created successfully');
    } catch (error) {
        console.error('Failed to create ChaosEngine:', error);
    }
});