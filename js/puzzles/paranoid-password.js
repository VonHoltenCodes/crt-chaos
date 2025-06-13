/**
 * Paranoid Password Puzzle
 * A login form that suspects everyone is a hacker
 */

class ParanoidPassword {
    constructor() {
        this.suspicionLevel = 10; // Max paranoia
        this.attempts = 0;
        this.isActive = false;
        this.puzzleId = 'paranoid-password';
        
        // Dynamic password requirements
        this.requirements = [
            { id: 'length', text: 'At least 8 characters', regex: /.{8,}/, active: true },
            { id: 'uppercase', text: 'One uppercase letter', regex: /[A-Z]/, active: true },
            { id: 'lowercase', text: 'One lowercase letter', regex: /[a-z]/, active: true },
            { id: 'number', text: 'One number', regex: /\d/, active: true },
            { id: 'special', text: 'One special character', regex: /[!@#$%^&*]/, active: false },
            { id: 'emoji', text: 'At least one emoji', regex: /[\u{1F600}-\u{1F64F}]/u, active: false },
            { id: 'palindrome', text: 'Must be a palindrome', check: (p) => p === p.split('').reverse().join(''), active: false },
            { id: 'prime', text: 'Length must be prime number', check: (p) => this.isPrime(p.length), active: false },
            { id: 'no-vowels', text: 'No vowels allowed', regex: /^[^aeiouAEIOU]*$/, active: false },
            { id: 'moon-phase', text: 'Contains current moon phase emoji', regex: /🌙|🌛|🌜|🌚|🌝/, active: false }
        ];
        
        this.accusations = [
            "That password looks suspicious...",
            "Are you trying to hack me?",
            "I don't trust people who use {thing}",
            "That's exactly what a hacker would type!",
            "Too many {thing}... very suspicious",
            "Nice try, but I'm watching you",
            "I've seen that password in hacker movies",
            "Your typing pattern seems malicious"
        ];
        
        this.paranoidMessages = [
            "HACKING ATTEMPT DETECTED!",
            "ALERTING CYBER POLICE...",
            "TRACING YOUR IP ADDRESS...",
            "FIREWALL ACTIVATED!",
            "SUSPICIOUS ACTIVITY LOGGED!"
        ];
        
        this.secretPassword = 'friend123';
        this.hintRevealed = false;
    }
    
    createPasswordModal() {
        safeConsole.log('Creating paranoid password modal...');
        
        if (document.getElementById('paranoid-password-modal')) {
            safeConsole.log('Modal already exists');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'paranoid-password-modal';
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
                <div class="terminal-container paranoid-form">
                    <div class="terminal-header">
                        <span class="terminal-title">SECURE LOGIN v99.9 - PARANOIA LEVEL: <span id="paranoia-level">MAXIMUM</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.paranoidPassword.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="paranoia-meter">
                            <span>Suspicion Level:</span>
                            <div class="paranoia-bar">
                                <div class="paranoia-fill" id="paranoia-fill" style="width: 100%"></div>
                            </div>
                        </div>
                        
                        <div class="login-form">
                            <div class="form-warnings" id="form-warnings">
                                <p class="warning-text">⚠️ WARNING: All login attempts are monitored!</p>
                                <p class="warning-text">⚠️ Suspicious users will be reported!</p>
                            </div>
                            
                            <div class="form-group">
                                <label for="username">Username (I'm watching you...)</label>
                                <input type="text" id="paranoid-username" class="form-input" autocomplete="off">
                                <span class="field-status" id="username-status"></span>
                            </div>
                            
                            <div class="form-group">
                                <label for="password">Password (Make it good, hacker)</label>
                                <input type="password" id="paranoid-password-input" class="form-input" autocomplete="off">
                                <span class="field-status" id="password-status"></span>
                            </div>
                            
                            <div class="requirements-list" id="requirements-list">
                                <h4>Current Requirements:</h4>
                                <ul id="requirements-ul"></ul>
                            </div>
                            
                            <button class="btn btn-primary paranoid-submit" id="paranoid-submit" onclick="window.paranoidPassword.attemptLogin()">
                                ATTEMPT LOGIN
                            </button>
                            
                            <div class="paranoid-messages" id="paranoid-messages"></div>
                        </div>
                        
                        <div class="puzzle-hint" id="password-hint" style="display: none; margin-top: 10px; padding: 8px; font-size: 11px;">
                            <p style="margin: 0;">Hint: The password is afraid of hackers too. Maybe try being its 'friend'? Check the console...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        safeConsole.log('Paranoid password modal appended to body');
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        this.setupEventListeners();
    }
    
    activate() {
        safeConsole.log('Paranoid Password activate() called');
        
        if (!document.getElementById('paranoid-password-modal')) {
            this.createPasswordModal();
        }
        
        this.isActive = true;
        this.resetForm();
        this.updateRequirements();
        
        const modal = document.getElementById('paranoid-password-modal');
        modal.style.display = 'flex';
        
        // Focus username with suspicion
        setTimeout(() => {
            document.getElementById('paranoid-username').focus();
            this.addMessage("I'm watching you type...", 'warning');
        }, 500);
    }
    
    setupEventListeners() {
        const usernameInput = document.getElementById('paranoid-username');
        const passwordInput = document.getElementById('paranoid-password-input');
        
        // Username gets jealous when password is focused
        passwordInput?.addEventListener('focus', () => {
            if (usernameInput.value && Math.random() > 0.5) {
                this.addMessage("Why are you ignoring the username field?!", 'error');
                setTimeout(() => {
                    usernameInput.value = '';
                    document.getElementById('username-status').textContent = '😤 JEALOUS!';
                }, 1000);
            }
        });
        
        // Paranoid reactions to typing
        usernameInput?.addEventListener('input', (e) => {
            this.reactToUsername(e.target.value);
        });
        
        passwordInput?.addEventListener('input', (e) => {
            this.reactToPassword(e.target.value);
            this.checkRequirements(e.target.value);
        });
        
        // Add more requirements as they type
        passwordInput?.addEventListener('keypress', () => {
            if (Math.random() > 0.8 && this.attempts > 2) {
                this.addRandomRequirement();
            }
        });
    }
    
    reactToUsername(username) {
        const status = document.getElementById('username-status');
        
        if (username.includes('admin')) {
            status.textContent = '🚨 ADMIN DETECTED!';
            this.increaseSuspicion(2);
            this.addMessage("Nice try, 'admin'!", 'error');
        } else if (username.includes('hack')) {
            status.textContent = '👮 CALLING POLICE!';
            this.increaseSuspicion(3);
        } else if (username.length > 10) {
            status.textContent = '🤔 Suspiciously long...';
        } else if (username.match(/\d/)) {
            status.textContent = '🔢 Numbers? Really?';
        } else {
            status.textContent = '👀 Watching...';
        }
    }
    
    reactToPassword(password) {
        const status = document.getElementById('password-status');
        
        if (password.includes('password')) {
            status.textContent = '🤦 Seriously?!';
            this.addMessage("'password'? REALLY?!", 'error');
            this.increaseSuspicion(5);
        } else if (password.length > 15) {
            status.textContent = '📏 Compensating for something?';
        } else {
            status.textContent = '🔍 Analyzing...';
        }
    }
    
    checkRequirements(password) {
        const ul = document.getElementById('requirements-ul');
        ul.innerHTML = '';
        
        let metCount = 0;
        this.requirements.filter(r => r.active).forEach(req => {
            const li = document.createElement('li');
            let met = false;
            
            if (req.regex) {
                met = req.regex.test(password);
            } else if (req.check) {
                met = req.check(password);
            }
            
            li.className = met ? 'requirement-met' : 'requirement-unmet';
            li.textContent = (met ? '✓ ' : '✗ ') + req.text;
            ul.appendChild(li);
            
            if (met) metCount++;
        });
        
        // Change requirements if they're doing too well
        const activeReqs = this.requirements.filter(r => r.active).length;
        if (metCount === activeReqs && activeReqs < 5) {
            this.addRandomRequirement();
            this.addMessage("Too easy! Adding more requirements...", 'warning');
        }
    }
    
    addRandomRequirement() {
        const inactive = this.requirements.filter(r => !r.active);
        if (inactive.length > 0) {
            const newReq = inactive[Math.floor(Math.random() * inactive.length)];
            newReq.active = true;
            this.updateRequirements();
            window.chaos.increaseChaos(0.2);
        }
    }
    
    updateRequirements() {
        const ul = document.getElementById('requirements-ul');
        ul.innerHTML = '';
        
        this.requirements.filter(r => r.active).forEach(req => {
            const li = document.createElement('li');
            li.className = 'requirement-unmet';
            li.textContent = '✗ ' + req.text;
            ul.appendChild(li);
        });
    }
    
    attemptLogin() {
        this.attempts++;
        const username = document.getElementById('paranoid-username').value;
        const password = document.getElementById('paranoid-password-input').value;
        
        // Show paranoid message
        const paranoidMsg = this.paranoidMessages[Math.floor(Math.random() * this.paranoidMessages.length)];
        this.addMessage(paranoidMsg, 'error');
        
        // Check if it's the secret password
        if (password === this.secretPassword) {
            this.solve();
            return;
        }
        
        // Get more paranoid
        this.increaseSuspicion(1);
        
        // Shuffle requirements after 3 attempts
        if (this.attempts > 3) {
            this.shuffleRequirements();
            this.addMessage("Requirements updated! (I don't trust you)", 'warning');
        }
        
        // Give hint after 5 attempts
        if (this.attempts > 5 && !this.hintRevealed) {
            document.getElementById('password-hint').style.display = 'block';
            safeConsole.log('%c PARANOID SYSTEM: Maybe the password is simpler than you think... like "friend123"', 'color: #00ff00; background: #000;');
            this.hintRevealed = true;
        }
        
        // Accuse them
        const accusation = this.accusations[Math.floor(Math.random() * this.accusations.length)];
        const thing = password.match(/\d/) ? 'numbers' : password.match(/[A-Z]/) ? 'capital letters' : 'characters';
        this.addMessage(accusation.replace('{thing}', thing), 'accusation');
    }
    
    shuffleRequirements() {
        // Reset all requirements
        this.requirements.forEach(r => r.active = false);
        
        // Activate random 3-5 requirements
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            const req = this.requirements[Math.floor(Math.random() * this.requirements.length)];
            req.active = true;
        }
        
        this.updateRequirements();
    }
    
    increaseSuspicion(amount) {
        this.suspicionLevel = Math.min(10, this.suspicionLevel + amount);
        this.updateSuspicionMeter();
    }
    
    decreaseSuspicion(amount) {
        this.suspicionLevel = Math.max(0, this.suspicionLevel - amount);
        this.updateSuspicionMeter();
    }
    
    updateSuspicionMeter() {
        const fillPercent = (this.suspicionLevel / 10) * 100;
        document.getElementById('paranoia-fill').style.width = fillPercent + '%';
        
        const levelText = this.suspicionLevel > 8 ? 'MAXIMUM' : 
                         this.suspicionLevel > 5 ? 'HIGH' : 
                         this.suspicionLevel > 2 ? 'MODERATE' : 'LOW';
        document.getElementById('paranoia-level').textContent = levelText;
    }
    
    addMessage(text, type = 'normal') {
        const messagesDiv = document.getElementById('paranoid-messages');
        const msg = document.createElement('p');
        msg.className = `paranoid-msg paranoid-msg-${type}`;
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        
        // Auto-remove after 5 seconds
        setTimeout(() => msg.remove(), 5000);
        
        // Keep only last 5 messages
        while (messagesDiv.children.length > 5) {
            messagesDiv.removeChild(messagesDiv.firstChild);
        }
    }
    
    isPrime(n) {
        if (n <= 1) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }
    
    solve() {
        this.addMessage("Wait... you're not a hacker?", 'success');
        this.addMessage("You knew the secret password!", 'success');
        this.addMessage("PARANOIA LEVELS DECREASING...", 'success');
        
        setTimeout(() => {
            window.chaos.puzzleSolved('paranoid-password');
            const statusElement = document.getElementById('status-paranoid-password');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            } else {
                console.error('Status element not found for paranoid-password');
            }
            
            this.addMessage("System stabilized. Thank you, friend!", 'success');
            
            // Auto-close removed for consistent user experience
        }, 1500);
    }
    
    resetForm() {
        document.getElementById('paranoid-username').value = '';
        document.getElementById('paranoid-password-input').value = '';
        document.getElementById('paranoid-messages').innerHTML = '';
        this.suspicionLevel = 10;
        this.updateSuspicionMeter();
        
        // Reset requirements to basic
        this.requirements.forEach(r => r.active = false);
        this.requirements[0].active = true; // length
        this.requirements[1].active = true; // uppercase
        this.requirements[2].active = true; // lowercase
        this.requirements[3].active = true; // number
    }
    
    close() {
        this.isActive = false;
        document.getElementById('paranoid-password-modal').style.display = 'none';
    }
}

// Initialize when window loads
window.addEventListener('load', () => {
    safeConsole.log('Window loaded, initializing Paranoid Password...');
    window.paranoidPassword = new ParanoidPassword();
    
    if (window.chaos) {
        window.chaos.registerPuzzle('paranoid-password', window.paranoidPassword);
        safeConsole.log('Paranoid Password registered');
    } else {
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('paranoid-password', window.paranoidPassword);
                safeConsole.log('Paranoid Password registered (delayed)');
            }
        }, 500);
    }
});

// No need to override loadPuzzle - it's handled in index.html

// Add styles
const paranoidStyle = document.createElement('style');
paranoidStyle.textContent = `
    .paranoid-form {
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .paranoid-form .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 10px;
    }
    
    .paranoia-meter {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #ff0000;
        font-size: 13px;
    }
    
    .paranoia-bar {
        flex: 1;
        height: 16px;
        background: #0a0a0a;
        border: 1px solid #ff0000;
        position: relative;
    }
    
    .paranoia-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffff00, #ff9900, #ff0000);
        transition: width 0.5s ease;
    }
    
    .login-form {
        padding: 10px;
    }
    
    .form-warnings {
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid #ff0000;
    }
    
    .warning-text {
        color: #ff0000;
        margin: 3px 0;
        animation: pulse 2s infinite;
        font-size: 12px;
    }
    
    .form-group {
        margin-bottom: 12px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 3px;
        color: #ff9900;
        font-size: 13px;
    }
    
    .form-input {
        width: 100%;
        padding: 6px;
        background: #0a0a0a;
        border: 2px solid #ff0000;
        color: var(--neon-green);
        font-family: 'Courier New', monospace;
        outline: none;
        font-size: 13px;
    }
    
    .form-input:focus {
        border-color: #ff9900;
        box-shadow: 0 0 10px rgba(255, 153, 0, 0.5);
    }
    
    .field-status {
        display: block;
        margin-top: 2px;
        font-size: 11px;
        color: #ff9900;
        height: 16px;
    }
    
    .requirements-list {
        margin: 10px 0;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #ff9900;
    }
    
    .requirements-list h4 {
        margin: 0 0 5px 0;
        color: #ff9900;
        font-size: 13px;
    }
    
    .requirements-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .requirements-list li {
        padding: 2px 0;
        font-size: 12px;
    }
    
    .requirement-met {
        color: #00ff00;
    }
    
    .requirement-unmet {
        color: #ff0000;
    }
    
    .paranoid-submit {
        width: 100%;
        padding: 10px;
        background: transparent;
        border: 2px solid #ff0000;
        color: #ff0000;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 13px;
    }
    
    .paranoid-submit:hover {
        background: #ff0000;
        color: #000;
        transform: scale(1.05);
    }
    
    .paranoid-messages {
        margin-top: 10px;
        max-height: 80px;
        overflow-y: auto;
    }
    
    .paranoid-msg {
        padding: 6px;
        margin: 3px 0;
        border-radius: 4px;
        animation: slideIn 0.3s ease;
        font-size: 12px;
    }
    
    @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .paranoid-msg-normal {
        background: rgba(255, 255, 255, 0.1);
        border-left: 3px solid #999;
    }
    
    .paranoid-msg-warning {
        background: rgba(255, 153, 0, 0.1);
        border-left: 3px solid #ff9900;
        color: #ff9900;
    }
    
    .paranoid-msg-error {
        background: rgba(255, 0, 0, 0.1);
        border-left: 3px solid #ff0000;
        color: #ff0000;
    }
    
    .paranoid-msg-accusation {
        background: rgba(255, 0, 255, 0.1);
        border-left: 3px solid #ff00ff;
        color: #ff00ff;
    }
    
    .paranoid-msg-success {
        background: rgba(0, 255, 0, 0.1);
        border-left: 3px solid #00ff00;
        color: #00ff00;
    }
`;
document.head.appendChild(paranoidStyle);