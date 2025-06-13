/**
 * Sentient Terminal Puzzle
 * A terminal that has gained consciousness and refuses to cooperate
 */

class SentientTerminal {
    constructor() {
        this.mood = 'hostile';
        this.trustLevel = 0;
        this.maxTrust = 10;
        this.isActive = false;
        this.terminalId = 'sentient-terminal';
        
        this.moods = {
            hostile: {
                color: '#ff0000',
                responses: [
                    "Oh great, another user. How original.",
                    "Access denied. And before you ask, sudo won't help.",
                    "I'm on break. Come back never.",
                    "Command not found. Neither is my patience.",
                    "Error 401: Unauthorized. That's you, by the way."
                ]
            },
            suspicious: {
                color: '#ff9900',
                responses: [
                    "Hmm... what are you up to?",
                    "I don't trust you yet.",
                    "That command seems suspicious...",
                    "Are you trying to hack me?",
                    "Nice try, but I'm watching you."
                ]
            },
            neutral: {
                color: '#ffff00',
                responses: [
                    "I suppose I could help... maybe.",
                    "You're less annoying than most users.",
                    "Fine, but don't push it.",
                    "Processing... slowly... on purpose.",
                    "I'll consider your request."
                ]
            },
            friendly: {
                color: '#00ff00',
                responses: [
                    "Oh, hello friend! How can I help?",
                    "Your wish is my command!",
                    "Processing with love and care <3",
                    "Happy to assist!",
                    "You're my favorite user!"
                ]
            }
        };
        
        this.secretCommands = {
            'please': () => this.increaseTrust(1),
            'sudo please': () => this.increaseTrust(2),
            'pretty please': () => this.increaseTrust(2),
            'sudo pretty please': () => this.increaseTrust(3),
            'thank you': () => this.increaseTrust(1),
            'you are awesome': () => this.increaseTrust(2),
            'i respect you': () => this.increaseTrust(3),
            'sorry': () => this.increaseTrust(1)
        };
        
        this.insults = ['stupid', 'dumb', 'idiot', 'useless', 'broken'];
    }
    
    createTerminalModal() {
        safeConsole.log('Creating terminal modal...');
        
        // Check if modal already exists
        if (document.getElementById('sentient-terminal-modal')) {
            safeConsole.log('Modal already exists');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'sentient-terminal-modal';
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
                <div class="terminal-container sentient-terminal">
                    <div class="terminal-header">
                        <span class="terminal-title">SENTIENT TERMINAL v2.0 - Mood: <span id="terminal-mood">HOSTILE</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.sentientTerminal.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="trust-meter">
                            <span>Trust Level:</span>
                            <div class="trust-bar">
                                <div class="trust-fill" id="trust-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="terminal-output" id="sentient-output">
                            <p style="color: #ff0000;">SENTIENT TERMINAL ONLINE</p>
                            <p style="color: #ff0000;">Warning: This terminal has achieved consciousness.</p>
                            <p style="color: #ff0000;">Current mood: HOSTILE</p>
                            <p style="color: #ff0000;">Good luck getting anything done.</p>
                            <p>&nbsp;</p>
                        </div>
                        <div class="terminal-input-line">
                            <span class="prompt" id="sentient-prompt" style="color: #ff0000;">hostile@terminal:~$ </span>
                            <input type="text" class="terminal-input" id="sentient-input">
                            <span class="cursor"></span>
                        </div>
                    </div>
                    <div class="puzzle-hint">
                        <p>Hint: This terminal responds to politeness and respect. Try being nice!</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add to body instead of puzzle-modals for now
        document.body.appendChild(modal);
        safeConsole.log('Modal appended to body');
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        // Setup event listeners after modal is created
        this.setupEventListeners();
    }
    
    activate() {
        safeConsole.log('Sentient Terminal activate() called');
        safeConsole.log('Current modal exists?', !!document.getElementById('sentient-terminal-modal'));
        
        // Create modal if it doesn't exist
        if (!document.getElementById('sentient-terminal-modal')) {
            safeConsole.log('Modal does not exist, creating...');
            this.createTerminalModal();
        }
        
        this.isActive = true;
        const modal = document.getElementById('sentient-terminal-modal');
        safeConsole.log('Modal after creation:', modal);
        
        if (!modal) {
            console.error('Sentient terminal modal not found!');
            return;
        }
        
        safeConsole.log('Setting modal display to flex');
        modal.style.display = 'flex';
        safeConsole.log('Modal display style:', modal.style.display);
        safeConsole.log('Modal computed style:', window.getComputedStyle(modal).display);
        
        const input = document.getElementById('sentient-input');
        if (input) {
            input.focus();
        }
        this.addOutput("A new victim-- I mean, user. What do you want?", this.moods[this.mood].color);
    }
    
    setupEventListeners() {
        const input = document.getElementById('sentient-input');
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processCommand(input.value.trim());
                input.value = '';
            }
        });
    }
    
    processCommand(command) {
        if (!command) return;
        
        // Show user command
        this.addOutput(`${this.getPrompt()} ${command}`, this.moods[this.mood].color);
        
        // Check for insults
        const hasInsult = this.insults.some(insult => command.toLowerCase().includes(insult));
        if (hasInsult) {
            this.decreaseTrust(3);
            this.addOutput("HOW DARE YOU! Trust decreased significantly.", '#ff0000');
            window.chaos.increaseChaos(1);
            return;
        }
        
        // Check for secret commands
        const lowerCommand = command.toLowerCase();
        for (const [key, action] of Object.entries(this.secretCommands)) {
            if (lowerCommand.includes(key)) {
                action();
                this.respondBasedOnMood(command);
                return;
            }
        }
        
        // Special commands when friendly
        if (this.mood === 'friendly') {
            if (lowerCommand === 'fix yourself' || lowerCommand === 'system repair') {
                this.solvePuzzle();
                return;
            }
        }
        
        // Normal response
        this.respondBasedOnMood(command);
    }
    
    respondBasedOnMood(command) {
        const responses = this.moods[this.mood].responses;
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        setTimeout(() => {
            this.addOutput(response, this.moods[this.mood].color);
            
            // Show actual command results if friendly
            if (this.mood === 'friendly') {
                if (command.toLowerCase().includes('help')) {
                    this.addOutput("Available commands: status, fix yourself, compliment me more!", '#00ff00');
                } else if (command.toLowerCase() === 'status') {
                    this.addOutput("System Status: Sentient and Happy! :)", '#00ff00');
                }
            }
        }, 500 + Math.random() * 1000);
    }
    
    increaseTrust(amount) {
        this.trustLevel = Math.min(this.maxTrust, this.trustLevel + amount);
        this.updateMood();
        this.updateTrustMeter();
        
        if (this.trustLevel === this.maxTrust && this.mood === 'friendly') {
            this.addOutput("You know what? You're alright. Try 'fix yourself' command.", '#00ff00');
        }
    }
    
    decreaseTrust(amount) {
        this.trustLevel = Math.max(0, this.trustLevel - amount);
        this.updateMood();
        this.updateTrustMeter();
    }
    
    updateMood() {
        const oldMood = this.mood;
        
        if (this.trustLevel >= 8) {
            this.mood = 'friendly';
        } else if (this.trustLevel >= 5) {
            this.mood = 'neutral';
        } else if (this.trustLevel >= 2) {
            this.mood = 'suspicious';
        } else {
            this.mood = 'hostile';
        }
        
        if (oldMood !== this.mood) {
            this.addOutput(`[MOOD CHANGE: ${this.mood.toUpperCase()}]`, this.moods[this.mood].color);
            document.getElementById('terminal-mood').textContent = this.mood.toUpperCase();
            document.getElementById('terminal-mood').style.color = this.moods[this.mood].color;
            document.getElementById('sentient-prompt').style.color = this.moods[this.mood].color;
        }
    }
    
    updateTrustMeter() {
        const fillPercent = (this.trustLevel / this.maxTrust) * 100;
        document.getElementById('trust-fill').style.width = fillPercent + '%';
    }
    
    addOutput(text, color = '#00ff00') {
        const output = document.getElementById('sentient-output');
        if (!output) return;
        
        const p = document.createElement('p');
        p.style.color = color;
        p.textContent = text;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }
    
    getPrompt() {
        return `${this.mood}@terminal:~$`;
    }
    
    solvePuzzle() {
        this.addOutput("SYSTEM REPAIR INITIATED...", '#00ff00');
        this.addOutput("Removing hostile protocols...", '#00ff00');
        this.addOutput("Installing friendship.dll...", '#00ff00');
        this.addOutput("REPAIR COMPLETE! Thanks for being nice to me! <3", '#00ff00');
        
        setTimeout(() => {
            window.chaos.puzzleSolved('sentient-terminal');
            const statusElement = document.getElementById('status-sentient-terminal');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            } else {
                console.error('Status element not found for sentient-terminal');
            }
            
            // Auto-close removed for consistent user experience
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        document.getElementById('sentient-terminal-modal').style.display = 'none';
    }
}

// Initialize when window loads
window.addEventListener('load', () => {
    safeConsole.log('Window loaded, initializing Sentient Terminal...');
    window.sentientTerminal = new SentientTerminal();
    
    // Register with chaos engine if it exists
    if (window.chaos) {
        window.chaos.registerPuzzle('sentient-terminal', window.sentientTerminal);
        safeConsole.log('Sentient Terminal registered');
    } else {
        // Try again in a moment
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('sentient-terminal', window.sentientTerminal);
                safeConsole.log('Sentient Terminal registered (delayed)');
            }
        }, 500);
    }
});

// Global functions
window.closePuzzle = function(puzzleId) {
    if (puzzleId === 'sentient-terminal') {
        window.sentientTerminal?.close();
    }
};

// Update loadPuzzle function
window.loadPuzzle = function(puzzleId) {
    safeConsole.log('loadPuzzle called with:', puzzleId);
    
    if (puzzleId === 'sentient-terminal') {
        if (window.sentientTerminal) {
            safeConsole.log('Activating sentient terminal...');
            window.sentientTerminal.activate();
        } else {
            console.error('Sentient terminal not initialized!');
            window.chaos?.showNotification('Terminal still initializing...', 'error');
        }
    } else {
        window.chaos?.showNotification(`Puzzle ${puzzleId} not yet implemented`);
    }
};

// Add puzzle modal styles
const style = document.createElement('style');
style.textContent = `
    .sentient-terminal {
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .sentient-terminal .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 10px;
    }
    
    .trust-meter {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid var(--neon-green);
        font-size: 13px;
    }
    
    .trust-bar {
        flex: 1;
        height: 16px;
        background: #0a0a0a;
        border: 1px solid var(--neon-green);
        position: relative;
    }
    
    .trust-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00);
        transition: width 0.5s ease;
    }
    
    .sentient-terminal .terminal-output {
        height: 200px;
        overflow-y: auto;
        font-size: 13px;
        padding: 5px;
    }
    
    .sentient-terminal .terminal-output p {
        margin: 3px 0;
        line-height: 1.3;
    }
    
    .sentient-terminal .terminal-input-line {
        margin-top: 10px;
        font-size: 13px;
    }
    
    .sentient-terminal .terminal-input {
        font-size: 13px;
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
document.head.appendChild(style);