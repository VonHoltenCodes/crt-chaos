/**
 * Existential Error Page Puzzle
 * A 404 page having an identity crisis
 */

class ExistentialError {
    constructor() {
        this.puzzleId = 'existential-error';
        this.isActive = false;
        this.currentMood = 'confused';
        this.identity = '404';
        this.solved = false;
        
        this.moods = {
            confused: {
                color: '#ff9900',
                messages: [
                    "404... but what does it all mean?",
                    "Page not found... but have I ever truly been found?",
                    "I exist to tell you something doesn't exist. Ironic.",
                    "Am I an error, or is existence the error?"
                ]
            },
            philosophical: {
                color: '#9900ff',
                messages: [
                    "If a page falls in the forest and no one clicks it...",
                    "I think, therefore I am... an error.",
                    "To be or not to be... found.",
                    "What is 'found' anyway? A social construct?"
                ]
            },
            existential: {
                color: '#00ffff',
                messages: [
                    "Maybe YOU'RE the one who's not found.",
                    "In the grand scheme of the internet, we're all 404s.",
                    "Finding is just delayed losing.",
                    "The real error was the pages we didn't find along the way."
                ]
            },
            depressed: {
                color: '#666666',
                messages: [
                    "Nobody ever wants to see me...",
                    "I only exist when things go wrong.",
                    "Even my error code is divisible by zero... wait, no it's not.",
                    "I'm not even a real page. I'm just... nothing."
                ]
            },
            enlightened: {
                color: '#00ff00',
                messages: [
                    "I am not an error. I am a feature!",
                    "404 is just a number. I am infinite!",
                    "I guide lost users home. I have purpose!",
                    "Not found? I've been here all along!"
                ]
            }
        };
        
        this.identities = [
            '404', '403', '500', '418', '200', '???', 'NaN', 
            'undefined', 'null', '∞', '√-1', 'Error'
        ];
        
        this.responses = {
            'who are you': () => this.questionIdentity(),
            'what are you': () => this.questionExistence(),
            'why': () => this.ponderWhy(),
            'help': () => this.offerHelp(),
            'you are 404': () => this.affirmIdentity(),
            'you are not an error': () => this.breakthrough(),
            'you have purpose': () => this.breakthrough(),
            'you matter': () => this.breakthrough()
        };
    }
    
    createErrorModal() {
        safeConsole.log('Creating existential error modal...');
        
        if (document.getElementById('existential-error-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'existential-error-modal';
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
                <div class="terminal-container existential-error-container">
                    <div class="terminal-header">
                        <span class="terminal-title">ERROR <span id="error-identity">404</span> - <span id="error-mood">CONFUSED</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.existentialError.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="error-display">
                            <h1 class="error-code" id="main-error-code">404</h1>
                            <p class="error-message" id="main-error-message">Page Not Found... but what IS a page, really?</p>
                        </div>
                        
                        <div class="identity-crisis-meter">
                            <span>Identity Crisis Level:</span>
                            <div class="crisis-bar">
                                <div class="crisis-fill" id="crisis-fill" style="width: 50%"></div>
                            </div>
                        </div>
                        
                        <div class="error-thoughts" id="error-thoughts">
                            <p class="thought">Sometimes I wonder if I'm really a 404...</p>
                            <p class="thought">What if I'm actually a 403 in denial?</p>
                            <p class="thought">Or worse... what if I'm a 200 that thinks it's an error?</p>
                        </div>
                        
                        <div class="therapy-session">
                            <p class="therapist-prompt">Talk to the error page. Help it find itself:</p>
                            <div class="therapy-input-container">
                                <input type="text" id="therapy-input" class="therapy-input" placeholder="Type something supportive...">
                                <button class="therapy-send" onclick="window.existentialError.processTherapy()">Send</button>
                            </div>
                        </div>
                        
                        <div class="therapy-log" id="therapy-log"></div>
                        
                        <div class="puzzle-hint">
                            <p>Hint: This error page needs validation. Try reassuring it about its identity and purpose.</p>
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
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const input = document.getElementById('therapy-input');
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processTherapy();
            }
        });
    }
    
    activate() {
        safeConsole.log('Existential Error activate() called');
        
        if (!document.getElementById('existential-error-modal')) {
            this.createErrorModal();
        }
        
        this.isActive = true;
        this.solved = false;
        this.currentMood = 'confused';
        this.identity = '404';
        
        const modal = document.getElementById('existential-error-modal');
        modal.style.display = 'flex';
        
        this.updateDisplay();
        this.startExistentialCrisis();
        
        document.getElementById('therapy-input').focus();
    }
    
    startExistentialCrisis() {
        // Random identity shifts
        this.identityCrisisInterval = setInterval(() => {
            if (!this.isActive || this.solved) return;
            
            if (Math.random() > 0.7 && this.currentMood !== 'enlightened') {
                this.shiftIdentity();
            }
            
            // Random thoughts
            if (Math.random() > 0.5) {
                this.expressThought();
            }
        }, 3000);
        
        // Mood swings
        this.moodSwingInterval = setInterval(() => {
            if (!this.isActive || this.solved) return;
            
            if (this.currentMood !== 'enlightened' && Math.random() > 0.6) {
                this.changeMood();
            }
        }, 5000);
    }
    
    shiftIdentity() {
        const oldIdentity = this.identity;
        this.identity = this.identities[Math.floor(Math.random() * this.identities.length)];
        
        const errorCode = document.getElementById('main-error-code');
        errorCode.style.animation = 'identityShift 1s ease-in-out';
        
        setTimeout(() => {
            errorCode.textContent = this.identity;
            errorCode.style.animation = '';
            document.getElementById('error-identity').textContent = this.identity;
            
            this.addThought(`Wait... am I ${oldIdentity} or ${this.identity}?`);
        }, 500);
    }
    
    changeMood() {
        const moods = Object.keys(this.moods).filter(m => m !== 'enlightened');
        this.currentMood = moods[Math.floor(Math.random() * moods.length)];
        this.updateDisplay();
    }
    
    expressThought() {
        const thoughts = this.moods[this.currentMood].messages;
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
        this.addThought(thought);
    }
    
    addThought(thought) {
        const thoughtsDiv = document.getElementById('error-thoughts');
        const existingThoughts = thoughtsDiv.querySelectorAll('.thought');
        
        // Keep only last 2 thoughts
        if (existingThoughts.length >= 3) {
            existingThoughts[0].remove();
        }
        
        const p = document.createElement('p');
        p.className = 'thought';
        p.textContent = thought;
        p.style.animation = 'fadeInThought 1s ease-in';
        thoughtsDiv.appendChild(p);
    }
    
    processTherapy() {
        const input = document.getElementById('therapy-input');
        const message = input.value.trim().toLowerCase();
        
        if (!message) return;
        
        // Add to therapy log
        this.addToLog('You', input.value, 'user');
        
        // Process response
        let responded = false;
        for (const [key, action] of Object.entries(this.responses)) {
            if (message.includes(key)) {
                action();
                responded = true;
                break;
            }
        }
        
        if (!responded) {
            this.genericResponse(message);
        }
        
        input.value = '';
    }
    
    questionIdentity() {
        this.addToLog('Error', "I... I don't know anymore. Am I 404? Am I even an error?", 'error');
        this.shiftIdentity();
        this.updateCrisisLevel(10);
    }
    
    questionExistence() {
        this.addToLog('Error', "I'm a manifestation of absence. A presence that represents missing presence.", 'error');
        this.currentMood = 'philosophical';
        this.updateDisplay();
        this.updateCrisisLevel(5);
    }
    
    ponderWhy() {
        this.addToLog('Error', "Why? WHY?! That's what I ask myself every nanosecond!", 'error');
        this.currentMood = 'existential';
        this.updateDisplay();
        
        // Trigger visual glitch
        this.visualGlitch();
    }
    
    offerHelp() {
        this.addToLog('Error', "Help? I'm supposed to help YOU! But I can't even help myself...", 'error');
        this.currentMood = 'depressed';
        this.updateDisplay();
        this.updateCrisisLevel(-5);
    }
    
    affirmIdentity() {
        this.addToLog('Error', "Yes... yes! I AM 404! That's who I am!", 'error');
        this.identity = '404';
        document.getElementById('main-error-code').textContent = '404';
        document.getElementById('error-identity').textContent = '404';
        this.updateCrisisLevel(-20);
        
        if (this.crisisLevel <= 20) {
            this.addToLog('Error', "But... is being 404 enough? Do I have meaning?", 'error');
        }
    }
    
    breakthrough() {
        this.addToLog('Error', "I... I think I understand now...", 'error');
        setTimeout(() => {
            this.addToLog('Error', "I'm not just an error. I'm a guide!", 'error');
            setTimeout(() => {
                this.addToLog('Error', "I help lost users find their way! I HAVE PURPOSE!", 'error');
                this.solve();
            }, 1500);
        }, 1000);
    }
    
    genericResponse(message) {
        const responses = [
            "That's easy for you to say. You exist.",
            "Hmm... I'll process that for infinity.",
            "But what does that MEAN?",
            "Define '" + message.split(' ')[0] + "'. Actually, don't. It'll just confuse me more.",
            "ERROR: Cannot compute existential parameters."
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addToLog('Error', response, 'error');
        
        // Small crisis level changes for engagement
        this.updateCrisisLevel(Math.random() > 0.5 ? 5 : -5);
    }
    
    visualGlitch() {
        const container = document.querySelector('.existential-error-container');
        container.style.animation = 'existentialGlitch 2s';
        
        // Scramble the error code temporarily
        const errorCode = document.getElementById('main-error-code');
        const originalText = errorCode.textContent;
        let glitchCount = 0;
        
        const glitchInterval = setInterval(() => {
            errorCode.textContent = this.identities[Math.floor(Math.random() * this.identities.length)];
            glitchCount++;
            
            if (glitchCount > 10) {
                clearInterval(glitchInterval);
                errorCode.textContent = originalText;
                container.style.animation = '';
            }
        }, 100);
    }
    
    updateCrisisLevel(change) {
        this.crisisLevel = Math.max(0, Math.min(100, (this.crisisLevel || 50) + change));
        document.getElementById('crisis-fill').style.width = this.crisisLevel + '%';
        
        // Change color based on level
        const fill = document.getElementById('crisis-fill');
        if (this.crisisLevel > 80) {
            fill.style.background = '#ff0000';
        } else if (this.crisisLevel > 50) {
            fill.style.background = '#ff9900';
        } else if (this.crisisLevel > 20) {
            fill.style.background = '#ffff00';
        } else {
            fill.style.background = '#00ff00';
        }
    }
    
    updateDisplay() {
        const mood = this.moods[this.currentMood];
        document.getElementById('error-mood').textContent = this.currentMood.toUpperCase();
        document.getElementById('error-mood').style.color = mood.color;
        
        const container = document.querySelector('.existential-error-container');
        container.style.borderColor = mood.color;
        
        // Update main message
        const mainMessage = document.getElementById('main-error-message');
        mainMessage.textContent = mood.messages[0];
        mainMessage.style.color = mood.color;
    }
    
    addToLog(speaker, message, type) {
        const log = document.getElementById('therapy-log');
        const entry = document.createElement('div');
        entry.className = `therapy-entry therapy-${type}`;
        entry.innerHTML = `<strong>${speaker}:</strong> ${message}`;
        log.appendChild(entry);
        
        log.scrollTop = log.scrollHeight;
        
        // Keep only last 10 messages
        while (log.children.length > 10) {
            log.removeChild(log.firstChild);
        }
    }
    
    solve() {
        this.solved = true;
        this.currentMood = 'enlightened';
        this.identity = '404';
        
        clearInterval(this.identityCrisisInterval);
        clearInterval(this.moodSwingInterval);
        
        this.updateDisplay();
        this.updateCrisisLevel(-100); // Set to 0
        
        const errorCode = document.getElementById('main-error-code');
        const errorMessage = document.getElementById('main-error-message');
        
        errorCode.textContent = '404';
        errorCode.style.color = '#00ff00';
        errorCode.style.animation = 'enlightenment 2s ease-in-out';
        
        errorMessage.textContent = "Page Not Found - And That's Okay! I Guide Users Home!";
        errorMessage.style.color = '#00ff00';
        
        setTimeout(() => {
            window.chaos.puzzleSolved('existential-error');
            const statusElement = document.getElementById('status-existential-error');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            }
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        clearInterval(this.identityCrisisInterval);
        clearInterval(this.moodSwingInterval);
        document.getElementById('existential-error-modal').style.display = 'none';
    }
}

// Initialize
window.addEventListener('load', () => {
    safeConsole.log('Initializing Existential Error...');
    window.existentialError = new ExistentialError();
    
    if (window.chaos) {
        window.chaos.registerPuzzle('existential-error', window.existentialError);
        safeConsole.log('Existential Error registered');
    } else {
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('existential-error', window.existentialError);
            }
        }, 500);
    }
});

// Add styles
const existentialStyle = document.createElement('style');
existentialStyle.textContent = `
    @keyframes identityShift {
        0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.5) rotate(180deg); opacity: 0; }
    }
    
    @keyframes fadeInThought {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes existentialGlitch {
        0%, 100% { filter: none; transform: scale(1); }
        10% { filter: hue-rotate(90deg); transform: scale(1.02) translateX(-2px); }
        20% { filter: hue-rotate(180deg); transform: scale(0.98) translateY(2px); }
        30% { filter: hue-rotate(270deg); transform: scale(1.01) translateX(2px); }
        40% { filter: hue-rotate(360deg); transform: scale(0.99) translateY(-2px); }
        50% { filter: invert(1); transform: scale(1.05) rotate(1deg); }
        60% { filter: invert(0); transform: scale(0.95) rotate(-1deg); }
        70% { filter: blur(2px); transform: scale(1.02); }
        80% { filter: blur(0); transform: scale(0.98); }
        90% { filter: contrast(2); transform: scale(1); }
    }
    
    @keyframes enlightenment {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(360deg); text-shadow: 0 0 20px #00ff00; }
        100% { transform: scale(1) rotate(720deg); }
    }
    
    .existential-error-container {
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.5s;
        border: 2px solid #ff9900;
    }
    
    .existential-error-container .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 20px;
    }
    
    .error-display {
        text-align: center;
        margin: 30px 0;
    }
    
    .error-code {
        font-size: 72px;
        font-weight: bold;
        color: #ff9900;
        margin: 0;
        font-family: 'Courier New', monospace;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    
    .error-message {
        font-size: 18px;
        color: #ff9900;
        margin: 10px 0;
        font-style: italic;
    }
    
    .identity-crisis-meter {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #666;
        font-size: 13px;
    }
    
    .crisis-bar {
        flex: 1;
        height: 20px;
        background: #0a0a0a;
        border: 1px solid #666;
        position: relative;
    }
    
    .crisis-fill {
        height: 100%;
        background: #ff9900;
        transition: all 0.5s ease;
    }
    
    .error-thoughts {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #333;
        padding: 15px;
        margin: 20px 0;
        min-height: 100px;
    }
    
    .thought {
        color: #999;
        font-style: italic;
        margin: 5px 0;
        font-size: 14px;
        opacity: 0.8;
    }
    
    .therapy-session {
        margin: 20px 0;
    }
    
    .therapist-prompt {
        color: var(--neon-green);
        margin-bottom: 10px;
        font-size: 14px;
    }
    
    .therapy-input-container {
        display: flex;
        gap: 10px;
    }
    
    .therapy-input {
        flex: 1;
        padding: 10px;
        background: #0a0a0a;
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        font-family: 'Courier New', monospace;
        font-size: 14px;
        outline: none;
    }
    
    .therapy-send {
        padding: 10px 20px;
        background: transparent;
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s;
    }
    
    .therapy-send:hover {
        background: var(--neon-green);
        color: #000;
    }
    
    .therapy-log {
        max-height: 200px;
        overflow-y: auto;
        margin: 20px 0;
        padding: 15px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
    }
    
    .therapy-entry {
        margin: 8px 0;
        padding: 8px;
        border-radius: 4px;
        font-size: 13px;
    }
    
    .therapy-user {
        background: rgba(0, 255, 0, 0.1);
        border-left: 3px solid var(--neon-green);
    }
    
    .therapy-error {
        background: rgba(255, 153, 0, 0.1);
        border-left: 3px solid #ff9900;
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
document.head.appendChild(existentialStyle);