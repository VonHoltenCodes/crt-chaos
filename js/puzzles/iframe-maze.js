/**
 * Recursive Iframe Maze Puzzle
 * Navigate through infinite nested realities to find your way back
 */

class IframeMaze {
    constructor() {
        this.puzzleId = 'iframe-maze';
        this.isActive = false;
        this.solved = false;
        this.currentDepth = 0;
        this.maxDepth = 5;
        this.breadcrumbs = [];
        this.portalColors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#80ff00'];
        
        // Messages at different depths
        this.depthMessages = {
            0: "Welcome to the reality nexus. Choose your portal wisely.",
            1: "You've entered a sub-reality. The way back is not always clear.",
            2: "Deeper still... Reality fragments around you.",
            3: "The void between realities. Can you remember where you came from?",
            4: "Warning: Reality coherence failing. Find your way back!",
            5: "MAXIMUM DEPTH: You're lost in the infinite recursion!"
        };
        
        // Portal configurations
        this.portalConfigs = [
            { id: 'alpha', symbol: 'α', hint: 'The beginning' },
            { id: 'beta', symbol: 'β', hint: 'The second path' },
            { id: 'gamma', symbol: 'γ', hint: 'The third way' },
            { id: 'delta', symbol: 'δ', hint: 'Change awaits' },
            { id: 'omega', symbol: 'Ω', hint: 'The end... or is it?' }
        ];
        
        this.correctPath = ['alpha', 'gamma', 'beta', 'delta', 'omega'];
        this.playerPath = [];
    }
    
    createMazeModal() {
        safeConsole.log('Creating iframe maze modal...');
        
        if (document.getElementById('iframe-maze-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'iframe-maze-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        modal.style.zIndex = '10000';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        modal.innerHTML = `
            <div class="puzzle-modal-content">
                <div class="terminal-container iframe-maze-container">
                    <div class="terminal-header">
                        <span class="terminal-title">REALITY.EXE - DEPTH: <span id="current-depth">0</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.iframeMaze.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="reality-viewport" id="reality-viewport">
                            <div class="depth-indicator">
                                <div class="depth-meter">
                                    <div class="depth-fill" id="depth-fill" style="height: 0%"></div>
                                </div>
                                <span class="depth-label">RECURSION</span>
                            </div>
                            
                            <div class="reality-message" id="reality-message">
                                Welcome to the reality nexus. Choose your portal wisely.
                            </div>
                            
                            <div class="portal-container" id="portal-container">
                                <!-- Portals will be generated here -->
                            </div>
                            
                            <div class="breadcrumb-trail" id="breadcrumb-trail">
                                <span class="breadcrumb-label">Path:</span>
                                <div class="breadcrumbs" id="breadcrumbs">ROOT</div>
                            </div>
                            
                            <div class="reality-effects" id="reality-effects"></div>
                        </div>
                        
                        <div class="maze-controls">
                            <button class="maze-btn" id="back-btn" onclick="window.iframeMaze.goBack()" disabled>
                                ← Go Back
                            </button>
                            <button class="maze-btn" id="reset-btn" onclick="window.iframeMaze.resetMaze()">
                                ⟲ Reset Reality
                            </button>
                            <button class="maze-btn escape-btn" id="escape-btn" onclick="window.iframeMaze.attemptEscape()" style="display: none;">
                                ⚡ ESCAPE RECURSION
                            </button>
                        </div>
                        
                        <div class="reality-glitches" id="reality-glitches"></div>
                        
                        <div class="puzzle-hint">
                            <p>Hint: Navigate through the portals to find the correct sequence. Remember your path - you might need to backtrack!</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    }
    
    activate() {
        safeConsole.log('Iframe Maze activate() called');
        
        if (!document.getElementById('iframe-maze-modal')) {
            this.createMazeModal();
        }
        
        this.isActive = true;
        this.solved = false;
        this.currentDepth = 0;
        this.breadcrumbs = ['ROOT'];
        this.playerPath = [];
        
        const modal = document.getElementById('iframe-maze-modal');
        modal.style.display = 'flex';
        
        this.updateDisplay();
        this.generatePortals();
        this.startRealityEffects();
    }
    
    generatePortals() {
        const container = document.getElementById('portal-container');
        container.innerHTML = '';
        
        // Shuffle portals for this depth
        const shuffled = [...this.portalConfigs].sort(() => Math.random() - 0.5);
        
        shuffled.forEach((portal, index) => {
            const portalEl = document.createElement('div');
            portalEl.className = 'reality-portal';
            portalEl.style.animationDelay = `${index * 0.1}s`;
            
            const color = this.portalColors[index % this.portalColors.length];
            portalEl.style.setProperty('--portal-color', color);
            
            portalEl.innerHTML = `
                <div class="portal-frame">
                    <div class="portal-vortex">
                        <span class="portal-symbol">${portal.symbol}</span>
                    </div>
                    <div class="portal-label">${portal.id.toUpperCase()}</div>
                    <div class="portal-hint">${portal.hint}</div>
                </div>
            `;
            
            portalEl.onclick = () => this.enterPortal(portal.id);
            container.appendChild(portalEl);
        });
    }
    
    enterPortal(portalId) {
        if (this.currentDepth >= this.maxDepth) {
            this.showGlitch('REALITY OVERFLOW - CANNOT GO DEEPER');
            return;
        }
        
        // Add to path
        this.playerPath.push(portalId);
        this.breadcrumbs.push(portalId.toUpperCase());
        this.currentDepth++;
        
        // Create portal transition effect
        this.portalTransition(() => {
            this.updateDisplay();
            
            // Check if at correct depth
            if (this.currentDepth === 5) {
                // Check if path is correct
                if (this.checkPath()) {
                    this.showEscapeButton();
                } else {
                    this.showGlitch('INCORRECT PATH - LOST IN RECURSION');
                    setTimeout(() => {
                        this.showGlitch('Try different portals or reset reality');
                    }, 2000);
                }
            } else {
                this.generatePortals();
            }
        });
        
        // Add chaos
        window.chaos.increaseChaos(0.3);
        
        // Reality gets more unstable at deeper levels
        if (this.currentDepth > 3) {
            this.destabilizeReality();
        }
    }
    
    portalTransition(callback) {
        const viewport = document.getElementById('reality-viewport');
        const effects = document.getElementById('reality-effects');
        
        // Create swirl effect
        effects.innerHTML = '<div class="portal-swirl"></div>';
        effects.style.display = 'block';
        
        // Apply transition
        viewport.style.animation = 'portalDive 1s ease-in-out';
        
        setTimeout(() => {
            viewport.style.animation = '';
            effects.style.display = 'none';
            effects.innerHTML = '';
            callback();
        }, 1000);
    }
    
    goBack() {
        if (this.currentDepth <= 0) return;
        
        this.currentDepth--;
        this.breadcrumbs.pop();
        this.playerPath.pop();
        
        this.portalTransition(() => {
            this.updateDisplay();
            this.generatePortals();
        });
    }
    
    resetMaze() {
        this.currentDepth = 0;
        this.breadcrumbs = ['ROOT'];
        this.playerPath = [];
        
        const viewport = document.getElementById('reality-viewport');
        viewport.style.animation = 'realityReset 1s ease-in-out';
        
        setTimeout(() => {
            viewport.style.animation = '';
            this.updateDisplay();
            this.generatePortals();
            document.getElementById('escape-btn').style.display = 'none';
        }, 500);
    }
    
    checkPath() {
        // Check if the player followed the correct path
        return JSON.stringify(this.playerPath) === JSON.stringify(this.correctPath);
    }
    
    showEscapeButton() {
        const escapeBtn = document.getElementById('escape-btn');
        escapeBtn.style.display = 'block';
        escapeBtn.style.animation = 'escapeGlow 1s ease-in-out infinite';
        
        this.showGlitch('ESCAPE ROUTE DETECTED!');
    }
    
    attemptEscape() {
        // Epic escape sequence
        const viewport = document.getElementById('reality-viewport');
        const container = document.querySelector('.iframe-maze-container');
        
        this.showGlitch('INITIATING REALITY ESCAPE SEQUENCE...');
        
        // Create multiple nested iframe illusions
        let iframeCount = 5;
        const createIframeIllusion = () => {
            if (iframeCount <= 0) {
                this.completeEscape();
                return;
            }
            
            const iframe = document.createElement('div');
            iframe.className = 'escape-iframe';
            iframe.style.animationDelay = `${(5 - iframeCount) * 0.2}s`;
            iframe.innerHTML = `<div class="iframe-border">REALITY LAYER ${iframeCount}</div>`;
            
            viewport.appendChild(iframe);
            
            setTimeout(() => {
                iframe.style.animation = 'iframeCollapse 0.5s ease-in forwards';
                setTimeout(() => iframe.remove(), 500);
            }, 1000);
            
            iframeCount--;
            setTimeout(createIframeIllusion, 300);
        };
        
        createIframeIllusion();
    }
    
    completeEscape() {
        this.solved = true;
        
        const viewport = document.getElementById('reality-viewport');
        viewport.innerHTML = `
            <div class="escape-success">
                <h2>REALITY RESTORED</h2>
                <p>You've escaped the infinite recursion!</p>
                <p>The path was: ${this.correctPath.map(p => p.toUpperCase()).join(' → ')}</p>
                <div class="reality-stable">✓ Reality Coherence: 100%</div>
            </div>
        `;
        
        viewport.style.animation = 'realityStabilize 2s ease-in-out';
        
        setTimeout(() => {
            window.chaos.puzzleSolved('iframe-maze');
            const statusElement = document.getElementById('status-iframe-maze');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            }
        }, 1500);
    }
    
    updateDisplay() {
        // Update depth indicator
        document.getElementById('current-depth').textContent = this.currentDepth;
        document.getElementById('depth-fill').style.height = (this.currentDepth / this.maxDepth * 100) + '%';
        
        // Update message
        document.getElementById('reality-message').textContent = this.depthMessages[this.currentDepth] || 'Unknown depth...';
        
        // Update breadcrumbs
        document.getElementById('breadcrumbs').textContent = this.breadcrumbs.join(' → ');
        
        // Update back button
        document.getElementById('back-btn').disabled = this.currentDepth === 0;
        
        // Apply depth-based visual effects
        const container = document.querySelector('.iframe-maze-container');
        container.style.filter = `hue-rotate(${this.currentDepth * 30}deg) contrast(${1 + this.currentDepth * 0.1})`;
    }
    
    startRealityEffects() {
        this.effectInterval = setInterval(() => {
            if (!this.isActive || this.solved) return;
            
            // Random glitches at deeper levels
            if (this.currentDepth > 2 && Math.random() > 0.7) {
                this.createGlitchEffect();
            }
            
            // Portal wobble
            if (this.currentDepth > 3 && Math.random() > 0.8) {
                this.wobblePortals();
            }
        }, 3000);
    }
    
    createGlitchEffect() {
        const glitches = document.getElementById('reality-glitches');
        const glitch = document.createElement('div');
        glitch.className = 'reality-glitch-line';
        glitch.style.top = Math.random() * 100 + '%';
        glitch.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        
        glitches.appendChild(glitch);
        
        setTimeout(() => glitch.remove(), 2000);
    }
    
    wobblePortals() {
        const portals = document.querySelectorAll('.reality-portal');
        portals.forEach(portal => {
            portal.style.animation = 'portalWobble 0.5s ease-in-out';
            setTimeout(() => {
                portal.style.animation = '';
            }, 500);
        });
    }
    
    destabilizeReality() {
        const viewport = document.getElementById('reality-viewport');
        viewport.style.animation = 'realityDestabilize 2s ease-in-out';
        
        setTimeout(() => {
            viewport.style.animation = '';
        }, 2000);
    }
    
    showGlitch(message) {
        const msg = document.getElementById('reality-message');
        const original = msg.textContent;
        
        msg.textContent = message;
        msg.style.color = '#ff0000';
        msg.style.animation = 'glitchText 0.5s';
        
        setTimeout(() => {
            msg.style.color = '';
            msg.style.animation = '';
            if (!this.solved) {
                msg.textContent = this.depthMessages[this.currentDepth] || original;
            }
        }, 2000);
    }
    
    close() {
        this.isActive = false;
        clearInterval(this.effectInterval);
        document.getElementById('iframe-maze-modal').style.display = 'none';
    }
}

// Initialize
window.addEventListener('load', () => {
    safeConsole.log('Initializing Iframe Maze...');
    window.iframeMaze = new IframeMaze();
    
    if (window.chaos) {
        window.chaos.registerPuzzle('iframe-maze', window.iframeMaze);
        safeConsole.log('Iframe Maze registered');
    } else {
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('iframe-maze', window.iframeMaze);
            }
        }, 500);
    }
});

// Add styles
const iframeStyle = document.createElement('style');
iframeStyle.textContent = `
    @keyframes portalDive {
        0% { transform: scale(1) rotateZ(0deg); opacity: 1; }
        50% { transform: scale(0.1) rotateZ(180deg); opacity: 0; }
        100% { transform: scale(1) rotateZ(360deg); opacity: 1; }
    }
    
    @keyframes realityReset {
        0%, 100% { transform: scale(1); filter: none; }
        50% { transform: scale(1.1); filter: brightness(2) contrast(2); }
    }
    
    @keyframes portalWobble {
        0%, 100% { transform: translateX(0) rotateZ(0deg); }
        25% { transform: translateX(-5px) rotateZ(-2deg); }
        75% { transform: translateX(5px) rotateZ(2deg); }
    }
    
    @keyframes realityDestabilize {
        0%, 100% { transform: skew(0deg); }
        20% { transform: skew(2deg, -1deg); }
        40% { transform: skew(-2deg, 1deg); }
        60% { transform: skew(1deg, -2deg); }
        80% { transform: skew(-1deg, 2deg); }
    }
    
    @keyframes escapeGlow {
        0%, 100% { box-shadow: 0 0 20px #ffff00; }
        50% { box-shadow: 0 0 40px #ffff00, 0 0 60px #ff00ff; }
    }
    
    @keyframes iframeCollapse {
        from { transform: scale(1) rotateY(0deg); opacity: 1; }
        to { transform: scale(0) rotateY(90deg); opacity: 0; }
    }
    
    @keyframes realityStabilize {
        0% { filter: blur(10px) hue-rotate(180deg); }
        50% { filter: blur(5px) hue-rotate(90deg); }
        100% { filter: blur(0) hue-rotate(0deg); }
    }
    
    @keyframes glitchText {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
    }
    
    @keyframes portalSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .iframe-maze-container {
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.5s;
    }
    
    .iframe-maze-container .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 20px;
    }
    
    .reality-viewport {
        position: relative;
        min-height: 400px;
        padding: 20px;
        background: radial-gradient(ellipse at center, rgba(128, 0, 255, 0.1) 0%, transparent 70%);
        border: 2px solid rgba(128, 0, 255, 0.5);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .depth-indicator {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 30px;
        height: 150px;
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid var(--neon-green);
        padding: 5px;
    }
    
    .depth-meter {
        width: 100%;
        height: 100px;
        background: rgba(0, 0, 0, 0.5);
        position: relative;
        border: 1px solid #333;
    }
    
    .depth-fill {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to top, #ff0000, #ff00ff, #0000ff);
        transition: height 0.5s ease;
    }
    
    .depth-label {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-size: 10px;
        text-align: center;
        margin-top: 10px;
        color: var(--neon-green);
    }
    
    .reality-message {
        text-align: center;
        font-size: 18px;
        color: #fff;
        margin: 20px 0;
        min-height: 30px;
    }
    
    .portal-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 20px;
        margin: 40px 0;
        min-height: 200px;
    }
    
    .reality-portal {
        cursor: pointer;
        transition: all 0.3s;
        animation: fadeIn 0.5s ease-in-out backwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .reality-portal:hover {
        transform: scale(1.1);
    }
    
    .portal-frame {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 auto;
    }
    
    .portal-vortex {
        width: 100%;
        height: 100%;
        border: 3px solid var(--portal-color, #ff00ff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at center, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%);
        position: relative;
        overflow: hidden;
    }
    
    .portal-vortex::before {
        content: '';
        position: absolute;
        width: 200%;
        height: 200%;
        background: conic-gradient(
            from 0deg,
            transparent,
            var(--portal-color, #ff00ff),
            transparent,
            var(--portal-color, #ff00ff),
            transparent
        );
        animation: portalSpin 3s linear infinite;
        opacity: 0.3;
    }
    
    .portal-symbol {
        font-size: 36px;
        font-weight: bold;
        color: var(--portal-color, #ff00ff);
        z-index: 1;
        text-shadow: 0 0 10px currentColor;
    }
    
    .portal-label {
        text-align: center;
        margin-top: 10px;
        color: var(--portal-color, #ff00ff);
        font-weight: bold;
        font-size: 14px;
    }
    
    .portal-hint {
        text-align: center;
        font-size: 11px;
        color: #999;
        font-style: italic;
        margin-top: 5px;
    }
    
    .breadcrumb-trail {
        margin: 30px 0 20px 0;
        padding: 15px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #666;
        border-radius: 5px;
    }
    
    .breadcrumb-label {
        color: var(--neon-green);
        font-size: 12px;
        margin-right: 10px;
    }
    
    .breadcrumbs {
        color: #fff;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        word-break: break-all;
    }
    
    .maze-controls {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin: 20px 0;
    }
    
    .maze-btn {
        padding: 10px 20px;
        background: transparent;
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        cursor: pointer;
        font-family: 'Courier New', monospace;
        transition: all 0.3s;
    }
    
    .maze-btn:hover:not(:disabled) {
        background: var(--neon-green);
        color: #000;
        box-shadow: 0 0 20px var(--neon-green);
    }
    
    .maze-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    
    .escape-btn {
        border-color: #ffff00 !important;
        color: #ffff00 !important;
        font-weight: bold;
    }
    
    .escape-btn:hover {
        background: #ffff00 !important;
        color: #000 !important;
    }
    
    .reality-effects {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: none;
    }
    
    .portal-swirl {
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(128, 0, 255, 0.5) 50%,
            rgba(255, 0, 255, 0.8) 100%
        );
        animation: portalSpin 1s ease-in-out;
    }
    
    .reality-glitches {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }
    
    .reality-glitch-line {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, 
            transparent, 
            #ff00ff, 
            #00ffff, 
            transparent
        );
        animation: glitchSlide 1s linear;
    }
    
    @keyframes glitchSlide {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
    }
    
    .escape-iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        border: 3px solid #00ff00;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-in-out backwards;
    }
    
    .iframe-border {
        color: #00ff00;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 0 10px currentColor;
    }
    
    .escape-success {
        text-align: center;
        padding: 40px;
        animation: fadeIn 1s ease-in-out;
    }
    
    .escape-success h2 {
        color: #00ff00;
        font-size: 32px;
        margin-bottom: 20px;
        text-shadow: 0 0 20px currentColor;
    }
    
    .escape-success p {
        color: #fff;
        margin: 10px 0;
        font-size: 16px;
    }
    
    .reality-stable {
        margin-top: 30px;
        padding: 15px;
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid #00ff00;
        color: #00ff00;
        font-weight: bold;
        font-size: 18px;
    }
    
    .puzzle-hint {
        margin-top: 10px;
        padding: 8px;
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid var(--neon-green);
        font-size: 11px;
        color: var(--neon-green);
    }
    
    .puzzle-hint p {
        margin: 0;
    }
`;
document.head.appendChild(iframeStyle);