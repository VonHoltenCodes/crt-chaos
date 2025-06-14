/**
 * Conspiracy Theory Search Box Puzzle
 * A search engine that knows too much and sees connections everywhere
 */

class ConspiracySearch {
    constructor() {
        this.puzzleId = 'conspiracy-search';
        this.isActive = false;
        this.searchHistory = [];
        this.conspiracyLevel = 0; // 0-10, how deep into the rabbit hole
        this.solved = false;
        
        // The secret truth they need to search for
        this.truthKeywords = ['the truth', 'truth', 'reality', 'wake up'];
        
        // Conspiracy connections database
        this.connections = {
            'cat': ['government surveillance', 'ancient Egypt', 'mind control'],
            'coffee': ['population control', 'Big Caffeine', 'sleep deprivation agenda'],
            'weather': ['HAARP', 'chemtrails', 'climate engineering'],
            'moon': ['fake landing', 'hologram', 'cheese monopoly'],
            'birds': ["aren't real", 'drone surveillance', 'government spies'],
            'pizza': ['secret societies', 'underground tunnels', 'coded messages'],
            'water': ['fluoride', 'mind control', 'memory suppression'],
            'phone': ['tracking device', '5G towers', 'brain waves'],
            'banana': ['Big Fruit conspiracy', 'genetic modification', 'potassium cartel'],
            'time': ['illusion', 'matrix glitch', 'temporal manipulation']
        };
        
        // Redacted patterns
        this.redactedPhrases = [
            '[REDACTED]',
            '[CLASSIFIED]',
            '[DATA EXPUNGED]',
            '[REMOVED BY ORDER OF ■■■■■]',
            '[THIS INFORMATION DOES NOT EXIST]'
        ];
        
        // Conspiracy theories that get wilder
        this.theories = [
            "Everything is connected...",
            "They don't want you to know this, but...",
            "Wake up, sheeple!",
            "Follow the money trail...",
            "It's all part of their plan...",
            "The evidence is hidden in plain sight!",
            "Connect the dots!",
            "Question everything!",
            "The rabbit hole goes deeper...",
            "THEY are watching..."
        ];
    }
    
    createSearchModal() {
        safeConsole.log('Creating conspiracy search modal...');
        
        if (document.getElementById('conspiracy-search-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'conspiracy-search-modal';
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
                <div class="terminal-container conspiracy-search-container">
                    <div class="terminal-header">
                        <span class="terminal-title">TRUTH-SEEKER v3.33 - Conspiracy Level: <span id="conspiracy-level">MINIMAL</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.conspiracySearch.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="search-warning">
                            <p>⚠️ WARNING: This search engine knows too much</p>
                            <p>🔍 Everything is connected. Search for "the truth" to break free.</p>
                        </div>
                        
                        <div class="search-container">
                            <div class="search-box">
                                <input type="text" id="conspiracy-input" class="conspiracy-input" placeholder="Search for anything... if you dare">
                                <button class="search-btn" onclick="window.conspiracySearch.search()">🔍 SEARCH</button>
                            </div>
                            
                            <div class="autocomplete-container" id="autocomplete-container"></div>
                        </div>
                        
                        <div class="search-results" id="search-results">
                            <div class="result-item">
                                <p class="welcome-message">Welcome to TRUTH-SEEKER, the search engine that THEY don't want you to use.</p>
                                <p class="welcome-message">Every search reveals hidden connections...</p>
                            </div>
                        </div>
                        
                        <div class="conspiracy-meter">
                            <span>Rabbit Hole Depth:</span>
                            <div class="conspiracy-bar">
                                <div class="conspiracy-fill" id="conspiracy-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        
                        <div class="search-history" id="search-history">
                            <h4>Your Digital Footprint (THEY are watching):</h4>
                            <ul id="history-list"></ul>
                        </div>
                        
                        <div class="puzzle-hint">
                            <p>Hint: The search engine sees connections everywhere. Maybe searching for "the truth" will reveal something...</p>
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
        const input = document.getElementById('conspiracy-input');
        
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });
        
        input?.addEventListener('input', (e) => {
            this.showAutocomplete(e.target.value);
        });
        
        // Add glitch effects to input
        input?.addEventListener('focus', () => {
            if (this.conspiracyLevel > 5) {
                this.glitchInput();
            }
        });
    }
    
    activate() {
        safeConsole.log('Conspiracy Search activate() called');
        
        if (!document.getElementById('conspiracy-search-modal')) {
            this.createSearchModal();
        }
        
        this.isActive = true;
        this.solved = false;
        this.searchHistory = [];
        this.conspiracyLevel = 0;
        
        const modal = document.getElementById('conspiracy-search-modal');
        modal.style.display = 'flex';
        
        document.getElementById('conspiracy-input').focus();
        this.updateConspiracyMeter();
    }
    
    search() {
        const input = document.getElementById('conspiracy-input');
        const query = input.value.trim();
        
        if (!query) return;
        
        // Add to history
        this.addToHistory(query);
        
        // Check for truth keywords
        if (this.truthKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
            this.revealTruth();
            return;
        }
        
        // Generate conspiracy results
        this.generateResults(query);
        
        // Increase conspiracy level
        this.conspiracyLevel = Math.min(10, this.conspiracyLevel + 1);
        this.updateConspiracyMeter();
        
        // Clear input and add effects
        input.value = '';
        
        // Random conspiracy effects at higher levels
        if (this.conspiracyLevel > 3) {
            this.triggerConspiracyEffect();
        }
    }
    
    generateResults(query) {
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = '';
        
        // Generate increasingly wild results
        const numResults = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numResults; i++) {
            const result = document.createElement('div');
            result.className = 'result-item';
            
            // Create connections
            const connections = this.findConnections(query);
            const title = this.generateTitle(query, connections);
            const description = this.generateDescription(query, connections);
            
            // Add redactions at higher conspiracy levels
            const redactedTitle = this.conspiracyLevel > 6 ? this.redactText(title) : title;
            const redactedDesc = this.conspiracyLevel > 4 ? this.redactText(description) : description;
            
            result.innerHTML = `
                <h3 class="result-title">${redactedTitle}</h3>
                <p class="result-url">www.truth-${Math.random().toString(36).substr(2, 9)}.org/${query.replace(/\s+/g, '-')}</p>
                <p class="result-description">${redactedDesc}</p>
                <div class="result-connections">
                    <span class="connection-label">Hidden connections:</span>
                    ${connections.map(c => `<span class="connection-tag">${c}</span>`).join(' → ')}
                </div>
            `;
            
            resultsDiv.appendChild(result);
            
            // Animate results
            setTimeout(() => {
                result.classList.add('revealed');
            }, i * 200);
        }
        
        // Add warning message
        if (this.conspiracyLevel > 7) {
            const warning = document.createElement('div');
            warning.className = 'search-warning-message';
            warning.textContent = 'YOU ARE BEING WATCHED. CLEAR YOUR HISTORY. TRUST NO ONE.';
            resultsDiv.appendChild(warning);
        }
    }
    
    findConnections(query) {
        const words = query.toLowerCase().split(' ');
        let connections = [];
        
        // Find direct connections
        words.forEach(word => {
            if (this.connections[word]) {
                connections = connections.concat(this.connections[word]);
            }
        });
        
        // Add random connections based on conspiracy level
        const randomConnections = [
            'Illuminati', 'Area 51', 'MK-Ultra', 'Project Blue Beam',
            'Denver Airport', 'Bilderberg Group', 'Flat Earth', 'Simulation Theory'
        ];
        
        const numRandom = Math.floor(this.conspiracyLevel / 3);
        for (let i = 0; i < numRandom; i++) {
            connections.push(randomConnections[Math.floor(Math.random() * randomConnections.length)]);
        }
        
        // Always connect to something
        if (connections.length === 0) {
            connections = ['hidden agenda', 'cover-up', 'false flag'];
        }
        
        return connections.slice(0, 4); // Limit to 4 connections
    }
    
    generateTitle(query, connections) {
        const templates = [
            `The TRUTH about ${query} and ${connections[0]}`,
            `${query.toUpperCase()}: What THEY Don't Want You to Know`,
            `EXPOSED: The ${query} - ${connections[0]} Connection`,
            `${query} Declassified: The ${connections[1] || 'Hidden'} Files`,
            `Wake Up! ${query} is Actually About ${connections[0]}`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    generateDescription(query, connections) {
        const intro = this.theories[Math.floor(Math.random() * this.theories.length)];
        const middle = `Research shows clear links between ${query} and ${connections.join(', ')}. `;
        const end = `The evidence has been suppressed since ${1950 + Math.floor(Math.random() * 50)}.`;
        
        return `${intro} ${middle} ${end}`;
    }
    
    redactText(text) {
        const words = text.split(' ');
        const numRedactions = Math.floor(words.length * 0.3);
        
        for (let i = 0; i < numRedactions; i++) {
            const index = Math.floor(Math.random() * words.length);
            if (words[index].length > 3) {
                words[index] = this.redactedPhrases[Math.floor(Math.random() * this.redactedPhrases.length)];
            }
        }
        
        return words.join(' ');
    }
    
    showAutocomplete(value) {
        const container = document.getElementById('autocomplete-container');
        container.innerHTML = '';
        
        if (!value || value.length < 2) return;
        
        // Generate increasingly paranoid autocomplete suggestions
        const suggestions = this.generateAutocompleteSuggestions(value);
        
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = suggestion;
            item.onclick = () => {
                document.getElementById('conspiracy-input').value = suggestion;
                container.innerHTML = '';
                this.search();
            };
            
            container.appendChild(item);
            
            // Glitch effect on paranoid suggestions
            if (this.conspiracyLevel > 5 && Math.random() > 0.5) {
                item.classList.add('glitching');
            }
        });
    }
    
    generateAutocompleteSuggestions(value) {
        const base = [
            `${value} conspiracy`,
            `${value} truth`,
            `${value} cover up`,
            `${value} illuminati connection`,
            `why is ${value} hiding the truth`,
            `${value} mind control`,
            `${value} government secrets`,
            `${value} [REDACTED]`
        ];
        
        // Get wilder with higher conspiracy levels
        if (this.conspiracyLevel > 5) {
            base.push(
                `${value} IS WATCHING YOU`,
                `${value} KNOWS YOUR LOCATION`,
                `THEY use ${value} to control us`
            );
        }
        
        return base.slice(0, 5);
    }
    
    glitchInput() {
        const input = document.getElementById('conspiracy-input');
        const originalPlaceholder = input.placeholder;
        
        const glitchMessages = [
            'THEY KNOW WHAT YOU ARE TYPING',
            'YOUR SEARCHES ARE MONITORED',
            'DON\'T TRUST THE RESULTS',
            'THE ALGORITHM IS ALIVE',
            'ERROR ERROR ERROR ERROR'
        ];
        
        input.placeholder = glitchMessages[Math.floor(Math.random() * glitchMessages.length)];
        input.classList.add('glitching');
        
        setTimeout(() => {
            input.placeholder = originalPlaceholder;
            input.classList.remove('glitching');
        }, 2000);
    }
    
    addToHistory(query) {
        this.searchHistory.unshift(query);
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        this.searchHistory.slice(0, 5).forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = item;
            
            // Add tracking warning
            if (this.conspiracyLevel > 6) {
                const warning = document.createElement('span');
                warning.className = 'tracking-warning';
                warning.textContent = ' [TRACKED]';
                li.appendChild(warning);
            }
            
            historyList.appendChild(li);
        });
    }
    
    triggerConspiracyEffect() {
        const effects = [
            () => this.staticNoise(),
            () => this.matrixRain(),
            () => this.redactEverything(),
            () => this.showWatcher(),
            () => this.scrambleText()
        ];
        
        const effect = effects[Math.floor(Math.random() * effects.length)];
        effect();
    }
    
    staticNoise() {
        const noise = document.createElement('div');
        noise.className = 'static-noise';
        document.querySelector('.conspiracy-search-container').appendChild(noise);
        
        setTimeout(() => noise.remove(), 1000);
    }
    
    matrixRain() {
        const matrix = document.createElement('div');
        matrix.className = 'matrix-rain';
        matrix.innerHTML = Array(50).fill(0).map(() => 
            `<span style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 5}s">
                ${String.fromCharCode(33 + Math.floor(Math.random() * 94))}
            </span>`
        ).join('');
        
        document.querySelector('.conspiracy-search-container').appendChild(matrix);
        setTimeout(() => matrix.remove(), 5000);
    }
    
    redactEverything() {
        const results = document.querySelectorAll('.result-description');
        results.forEach(result => {
            const originalText = result.textContent;
            result.textContent = '[CONTENT REMOVED BY AUTHORITIES]';
            result.classList.add('redacted');
            
            setTimeout(() => {
                result.textContent = originalText;
                result.classList.remove('redacted');
            }, 3000);
        });
    }
    
    showWatcher() {
        const watcher = document.createElement('div');
        watcher.className = 'conspiracy-watcher';
        watcher.innerHTML = '👁️';
        watcher.style.cssText = `
            position: fixed;
            font-size: 50px;
            opacity: 0;
            animation: watcherAppear 3s ease-in-out;
            z-index: 10002;
            left: ${Math.random() * 80 + 10}%;
            top: ${Math.random() * 80 + 10}%;
        `;
        
        document.body.appendChild(watcher);
        setTimeout(() => watcher.remove(), 3000);
    }
    
    scrambleText() {
        const texts = document.querySelectorAll('.result-title, .result-description');
        texts.forEach(text => {
            text.classList.add('text-scramble');
            setTimeout(() => text.classList.remove('text-scramble'), 1000);
        });
    }
    
    updateConspiracyMeter() {
        const fillPercent = (this.conspiracyLevel / 10) * 100;
        document.getElementById('conspiracy-fill').style.width = fillPercent + '%';
        
        const levels = [
            'MINIMAL', 'CURIOUS', 'SUSPICIOUS', 'PARANOID', 
            'DEEP', 'VERY DEEP', 'DANGEROUS', 'CRITICAL', 
            'THEY KNOW', 'RUN'
        ];
        
        document.getElementById('conspiracy-level').textContent = levels[Math.floor(this.conspiracyLevel)] || 'MAXIMUM';
        
        // Change UI based on conspiracy level
        const container = document.querySelector('.conspiracy-search-container');
        container.className = `terminal-container conspiracy-search-container conspiracy-level-${Math.floor(this.conspiracyLevel)}`;
    }
    
    revealTruth() {
        this.solved = true;
        
        // Stop all chaos effects immediately
        this.conspiracyLevel = 0;
        this.updateConspiracyMeter();
        
        // Clear any active visual effects
        document.querySelectorAll('.static-noise, .matrix-rain, .conspiracy-watcher').forEach(el => el.remove());
        
        // Reset container class to remove visual effects
        const container = document.querySelector('.conspiracy-search-container');
        container.className = 'terminal-container conspiracy-search-container';
        
        // Clear autocomplete
        document.getElementById('autocomplete-container').innerHTML = '';
        
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = `
            <div class="truth-revealed">
                <h2>THE TRUTH HAS BEEN REVEALED</h2>
                <p>You broke through the conspiracy matrix!</p>
                <p>The search engine was creating false connections all along.</p>
                <p>Sometimes, the truth is simply... the truth.</p>
                <div class="truth-animation">
                    <span>🔓</span>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            window.chaos.puzzleSolved('conspiracy-search');
            const statusElement = document.getElementById('status-conspiracy-search');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            }
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        
        // Clear any active effects first
        document.querySelectorAll('.static-noise, .matrix-rain, .conspiracy-watcher').forEach(el => el.remove());
        
        // Reset visual state
        const container = document.querySelector('.conspiracy-search-container');
        if (container) {
            container.className = 'terminal-container conspiracy-search-container';
        }
        
        // Reset conspiracy level
        this.conspiracyLevel = 0;
        
        // Hide modal
        const modal = document.getElementById('conspiracy-search-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    safeConsole.log('Initializing Conspiracy Search...');
    window.conspiracySearch = new ConspiracySearch();
    safeConsole.log('Conspiracy Search instance created:', window.conspiracySearch);
    
    if (window.chaos) {
        window.chaos.registerPuzzle('conspiracy-search', window.conspiracySearch);
        safeConsole.log('Conspiracy Search registered with chaos engine');
    } else {
        safeConsole.log('Chaos engine not ready, waiting...');
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('conspiracy-search', window.conspiracySearch);
                safeConsole.log('Conspiracy Search registered with chaos engine (delayed)');
            }
        }, 500);
    }
});

// Add styles
const conspiracyStyle = document.createElement('style');
conspiracyStyle.textContent = `
    @keyframes watcherAppear {
        0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        50% { opacity: 0.8; transform: scale(1) rotate(360deg); }
    }
    
    @keyframes matrixFall {
        0% { transform: translateY(-100%); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
    }
    
    @keyframes textScramble {
        0%, 100% { filter: blur(0); }
        50% { filter: blur(2px); transform: translateX(2px); }
    }
    
    .conspiracy-search-container {
        max-height: 90vh;
        overflow-y: auto;
        transition: all 0.5s;
    }
    
    .conspiracy-search-container .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 15px;
    }
    
    .search-warning {
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid #ff0000;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
    }
    
    .search-warning p {
        margin: 3px 0;
        color: #ff0000;
        font-size: 12px;
    }
    
    .search-container {
        margin: 20px 0;
    }
    
    .search-box {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }
    
    .conspiracy-input {
        flex: 1;
        padding: 10px;
        background: #0a0a0a;
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        font-family: 'Courier New', monospace;
        font-size: 14px;
        outline: none;
    }
    
    .conspiracy-input.glitching {
        animation: glitch-skew 0.5s infinite;
        border-color: #ff0000;
    }
    
    .search-btn {
        padding: 10px 20px;
        background: transparent;
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s;
    }
    
    .search-btn:hover {
        background: var(--neon-green);
        color: #000;
    }
    
    .autocomplete-container {
        position: relative;
        background: #0a0a0a;
        border: 1px solid var(--neon-green);
        max-height: 150px;
        overflow-y: auto;
    }
    
    .autocomplete-item {
        padding: 8px;
        cursor: pointer;
        font-size: 13px;
        color: var(--neon-green);
        border-bottom: 1px solid #333;
    }
    
    .autocomplete-item:hover {
        background: rgba(0, 255, 0, 0.1);
    }
    
    .autocomplete-item.glitching {
        animation: textScramble 0.5s infinite;
    }
    
    .search-results {
        min-height: 200px;
        max-height: 300px;
        overflow-y: auto;
        margin: 20px 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
    }
    
    .result-item {
        margin-bottom: 20px;
        padding: 15px;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid var(--neon-green);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s;
    }
    
    .result-item.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .result-title {
        color: var(--neon-yellow);
        font-size: 16px;
        margin: 0 0 5px 0;
    }
    
    .result-url {
        color: #00ff00;
        font-size: 11px;
        margin: 0 0 8px 0;
        opacity: 0.7;
    }
    
    .result-description {
        color: var(--neon-green);
        font-size: 13px;
        line-height: 1.4;
        margin: 0 0 10px 0;
    }
    
    .result-description.redacted {
        color: #ff0000;
        font-weight: bold;
        text-align: center;
    }
    
    .result-connections {
        font-size: 11px;
        color: #ff9900;
    }
    
    .connection-tag {
        display: inline-block;
        padding: 2px 6px;
        background: rgba(255, 153, 0, 0.2);
        border: 1px solid #ff9900;
        margin: 2px;
    }
    
    .conspiracy-meter {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 15px 0;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #ff0000;
        font-size: 13px;
    }
    
    .conspiracy-bar {
        flex: 1;
        height: 16px;
        background: #0a0a0a;
        border: 1px solid #ff0000;
        position: relative;
    }
    
    .conspiracy-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #ffff00, #ff9900, #ff0000);
        transition: width 0.5s ease;
    }
    
    .search-history {
        margin-top: 15px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #666;
    }
    
    .search-history h4 {
        margin: 0 0 8px 0;
        color: #ff9900;
        font-size: 12px;
    }
    
    .history-item {
        padding: 3px 0;
        color: var(--neon-green);
        font-size: 12px;
    }
    
    .tracking-warning {
        color: #ff0000;
        font-weight: bold;
    }
    
    .search-warning-message {
        background: #ff0000;
        color: #000;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        animation: pulse 1s infinite;
        margin-top: 10px;
    }
    
    .welcome-message {
        color: var(--neon-green);
        font-size: 14px;
        margin: 10px 0;
        text-align: center;
    }
    
    /* Conspiracy level effects */
    .conspiracy-level-7 { filter: contrast(1.2); }
    .conspiracy-level-8 { filter: contrast(1.3) hue-rotate(10deg); }
    .conspiracy-level-9 { filter: contrast(1.4) hue-rotate(20deg); animation: slightShake 2s infinite; }
    .conspiracy-level-10 { filter: contrast(1.5) hue-rotate(30deg) saturate(1.5); animation: intenseShake 1s infinite; }
    
    @keyframes slightShake {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-2px); }
    }
    
    @keyframes intenseShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
    }
    
    .static-noise {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.4" /%3E%3C/svg%3E');
        opacity: 0.3;
        pointer-events: none;
        z-index: 10001;
    }
    
    .matrix-rain {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 10001;
    }
    
    .matrix-rain span {
        position: absolute;
        color: #00ff00;
        font-family: monospace;
        font-size: 20px;
        animation: matrixFall 5s linear infinite;
    }
    
    .text-scramble {
        animation: textScramble 0.2s infinite;
    }
    
    .truth-revealed {
        text-align: center;
        padding: 40px;
        animation: fadeIn 1s ease-in;
    }
    
    .truth-revealed h2 {
        color: #00ff00;
        font-size: 24px;
        margin-bottom: 20px;
    }
    
    .truth-revealed p {
        color: var(--neon-green);
        font-size: 14px;
        margin: 10px 0;
    }
    
    .truth-animation {
        font-size: 50px;
        margin: 20px 0;
        animation: unlock 2s ease-in-out;
    }
    
    @keyframes unlock {
        0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
        50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
        100% { transform: rotate(360deg) scale(1); opacity: 1; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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
document.head.appendChild(conspiracyStyle);