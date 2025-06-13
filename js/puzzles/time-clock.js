/**
 * Time-Traveling Clock Puzzle
 * A clock that exists in multiple time streams simultaneously
 */

class TimeTravelingClock {
    constructor() {
        this.puzzleId = 'time-clock';
        this.isActive = false;
        this.timeStreams = {
            unix: { offset: 0, speed: 1 },
            binary: { offset: 0, speed: 1 },
            hex: { offset: 0, speed: 1 },
            roman: { offset: 0, speed: 1 },
            mayan: { offset: 0, speed: 1 }
        };
        
        this.temporalInstability = 10; // How unstable time is
        this.glitchInterval = null;
        this.timeUpdateInterval = null;
        this.pageStateHistory = [];
        this.maxHistory = 10;
        
        // Time formats for extra confusion
        this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.futureDay = ['Suntime', 'Moonday', 'Toosday', 'Whensday', 'Thirstday', 'Fryday', 'Saturnday'];
        this.ancientDay = ['Sol', 'Luna', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        
        this.solved = false;
    }
    
    createClockModal() {
        safeConsole.log('Creating time-traveling clock modal...');
        
        if (document.getElementById('time-clock-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'time-clock-modal';
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
                <div class="terminal-container time-clock-container">
                    <div class="terminal-header">
                        <span class="terminal-title">TEMPORAL ANOMALY DETECTED - STABILITY: <span id="temporal-stability">CRITICAL</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.timeClock.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="temporal-warning">
                            ⚠️ WARNING: Multiple time streams detected! Synchronize all displays to stabilize reality.
                        </div>
                        
                        <div class="time-displays">
                            <div class="time-display" id="unix-display">
                                <h3>UNIX EPOCH</h3>
                                <div class="time-value" id="unix-time">0000000000</div>
                                <div class="time-controls">
                                    <button onclick="window.timeClock.adjustTime('unix', -3600)">-1hr</button>
                                    <button onclick="window.timeClock.adjustTime('unix', -60)">-1m</button>
                                    <button id="pause-unix" onclick="window.timeClock.toggleSpeed('unix')">⏸</button>
                                    <button onclick="window.timeClock.adjustTime('unix', 60)">+1m</button>
                                    <button onclick="window.timeClock.adjustTime('unix', 3600)">+1hr</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="binary-display">
                                <h3>BINARY TIME</h3>
                                <div class="time-value binary-time" id="binary-time">00000000</div>
                                <div class="time-controls">
                                    <button onclick="window.timeClock.adjustTime('binary', -5)">-5m</button>
                                    <button onclick="window.timeClock.adjustTime('binary', -1)">-1m</button>
                                    <button id="pause-binary" onclick="window.timeClock.toggleSpeed('binary')">⏸</button>
                                    <button onclick="window.timeClock.adjustTime('binary', 1)">+1m</button>
                                    <button onclick="window.timeClock.adjustTime('binary', 5)">+5m</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="hex-display">
                                <h3>HEXADECIMAL</h3>
                                <div class="time-value hex-time" id="hex-time">0x00000000</div>
                                <div class="time-controls">
                                    <button onclick="window.timeClock.adjustTime('hex', -256)">-0x100</button>
                                    <button onclick="window.timeClock.adjustTime('hex', -16)">-0x10</button>
                                    <button id="pause-hex" onclick="window.timeClock.toggleSpeed('hex')">⏸</button>
                                    <button onclick="window.timeClock.adjustTime('hex', 16)">+0x10</button>
                                    <button onclick="window.timeClock.adjustTime('hex', 256)">+0x100</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="roman-display">
                                <h3>ROMAN NUMERALS</h3>
                                <div class="time-value roman-time" id="roman-time">XII:XXX</div>
                                <div class="time-controls">
                                    <button onclick="window.timeClock.adjustTime('roman', -5)">-V</button>
                                    <button onclick="window.timeClock.adjustTime('roman', -1)">-I</button>
                                    <button id="pause-roman" onclick="window.timeClock.toggleSpeed('roman')">⏸</button>
                                    <button onclick="window.timeClock.adjustTime('roman', 1)">+I</button>
                                    <button onclick="window.timeClock.adjustTime('roman', 5)">+V</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="mayan-display">
                                <h3>MAYAN CALENDAR</h3>
                                <div class="time-value mayan-time" id="mayan-time">🗿 ● ● ● ●</div>
                                <div class="time-controls">
                                    <button onclick="window.timeClock.adjustTime('mayan', -10)">-10m</button>
                                    <button onclick="window.timeClock.adjustTime('mayan', -1)">-1m</button>
                                    <button id="pause-mayan" onclick="window.timeClock.toggleSpeed('mayan')">⏸</button>
                                    <button onclick="window.timeClock.adjustTime('mayan', 1)">+1m</button>
                                    <button onclick="window.timeClock.adjustTime('mayan', 10)">+10m</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sync-status" id="sync-status">
                            <p>Temporal Variance: <span id="variance">∞</span></p>
                            <p>Reality Coherence: <span id="coherence">15%</span></p>
                        </div>
                        
                        <button class="btn btn-primary temporal-sync" onclick="window.timeClock.attemptSync()">
                            ATTEMPT TEMPORAL SYNCHRONIZATION
                        </button>
                        
                        <div class="temporal-messages" id="temporal-messages"></div>
                        
                        <div class="puzzle-hint" style="margin-top: 10px; padding: 8px; font-size: 12px;">
                            <p style="margin: 0;">Hint: All time displays must show the same moment. Use Date.now() as your reference point.</p>
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
        safeConsole.log('Time Clock activate() called');
        
        if (!document.getElementById('time-clock-modal')) {
            this.createClockModal();
        }
        
        this.isActive = true;
        this.solved = false;
        
        // Save current page state for potential rewind
        this.savePageState();
        
        // Reset time streams with random offsets
        Object.keys(this.timeStreams).forEach(stream => {
            this.timeStreams[stream].offset = Math.floor(Math.random() * 10000) - 5000;
            this.timeStreams[stream].speed = 1; // All start at normal speed
        });
        
        const modal = document.getElementById('time-clock-modal');
        modal.style.display = 'flex';
        
        // Start the chaos
        this.startTemporalChaos();
        this.updateTimeDisplays();
        
        this.addMessage("Time streams detected. Reality unstable.", 'warning');
        
        // Random time jumps - more frequent!
        this.glitchInterval = setInterval(() => {
            // Much higher chance when times are out of sync
            const variance = this.calculateVariance();
            const glitchChance = variance > 10000 ? 0.7 : variance > 5000 ? 0.5 : 0.3;
            
            if (Math.random() < glitchChance) {
                safeConsole.log('TEMPORAL GLITCH TRIGGERED!');
                this.temporalGlitch();
            }
        }, 2000); // More frequent checks
        
        // Update displays
        this.timeUpdateInterval = setInterval(() => {
            this.updateTimeDisplays();
        }, 100);
    }
    
    startTemporalChaos() {
        // Make the page experience time differently
        const elements = document.querySelectorAll('.glitch-text, .status-value, h1, h2');
        elements.forEach(el => {
            if (Math.random() > 0.7) {
                el.style.animation = `timeGlitch ${2 + Math.random() * 3}s infinite`;
            }
        });
        
        // Mess with the chaos meter's perception of time
        if (window.chaos) {
            window.chaos.increaseChaos(0.5);
        }
    }
    
    temporalGlitch() {
        const glitchTypes = [
            () => this.reverseTime(),
            () => this.jumpToFuture(),
            () => this.freezeTime(),
            () => this.scrambleTimeFormats(),
            () => this.rewindPage()
        ];
        
        const glitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        glitch();
    }
    
    reverseTime() {
        this.addMessage("TEMPORAL REVERSAL DETECTED!", 'error');
        this.addMessage("Reality inverted for 5 seconds!", 'warning');
        
        // Create a wrapper for visual effects to avoid breaking functionality
        const effectWrapper = document.createElement('div');
        effectWrapper.id = 'temporal-effect-wrapper';
        effectWrapper.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            transform: scaleX(-1);
            transition: transform 0.5s ease;
            background: transparent;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(effectWrapper);
        
        // Visual effect on non-modal elements only
        const modal = document.getElementById('time-clock-modal');
        if (modal) {
            modal.style.zIndex = '10001'; // Ensure modal stays on top
        }
        
        // Keep it flipped for 5 seconds
        setTimeout(() => {
            effectWrapper.style.transform = 'scaleX(1)';
            setTimeout(() => effectWrapper.remove(), 500);
            this.addMessage("Reality restored", 'info');
        }, 5000);
    }
    
    jumpToFuture() {
        this.addMessage("TIME SKIP: +37 YEARS (VISUAL ONLY)", 'warning');
        // Just a visual effect - don't actually jump time
        document.body.style.filter = 'sepia(1) hue-rotate(30deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
    
    freezeTime() {
        this.addMessage("TIME FREEZE EFFECT", 'error');
        // Visual freeze effect only - create overlay instead of modifying elements
        const freezeOverlay = document.createElement('div');
        freezeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9996;
            background: radial-gradient(circle, rgba(100,200,255,0.3), transparent);
            animation: freezePulse 3s ease-in-out;
        `;
        document.body.appendChild(freezeOverlay);
        
        // Visual effect on time displays without disabling them
        const displays = document.querySelectorAll('.time-value');
        displays.forEach(display => {
            display.style.textShadow = '0 0 10px #00ffff';
            display.style.transition = 'text-shadow 0.5s';
        });
        
        setTimeout(() => {
            freezeOverlay.remove();
            displays.forEach(display => {
                display.style.textShadow = '';
            });
        }, 3000);
    }
    
    scrambleTimeFormats() {
        this.addMessage("TIME FORMAT CORRUPTION!", 'error');
        // Temporarily show wrong format in each display
        document.getElementById('unix-time').textContent = this.toRoman(Date.now());
        document.getElementById('binary-time').textContent = this.toMayan(Date.now());
        document.getElementById('hex-time').textContent = this.toBinary(Date.now());
        
        setTimeout(() => this.updateTimeDisplays(), 2000);
    }
    
    rewindPage() {
        this.addMessage("PAGE STATE REWIND - TEMPORAL PARADOX!", 'error');
        
        // Create effect overlay instead of transforming body directly
        const effectOverlay = document.createElement('div');
        effectOverlay.id = 'rewind-effect';
        effectOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            background: linear-gradient(45deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1));
            animation: rewindEffect 1s ease-in-out;
        `;
        
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 9997;
            opacity: 0;
            pointer-events: none;
            animation: timeFlash 0.5s;
        `;
        
        document.body.appendChild(effectOverlay);
        document.body.appendChild(flash);
        
        // Ensure modal stays functional
        const modal = document.getElementById('time-clock-modal');
        if (modal) {
            modal.style.zIndex = '10001';
            modal.style.transform = 'none !important';
            modal.style.filter = 'none !important';
        }
        
        setTimeout(() => {
            effectOverlay.remove();
            flash.remove();
        }, 1000);
    }
    
    updateTimeDisplays() {
        const now = Date.now();
        
        // Unix time
        const unixTime = now + this.timeStreams.unix.offset;
        document.getElementById('unix-time').textContent = Math.floor(unixTime / 1000);
        
        // Binary (just hours and minutes for readability)
        const binaryDate = new Date(now + this.timeStreams.binary.offset);
        const binaryHours = binaryDate.getHours().toString(2).padStart(5, '0');
        const binaryMinutes = binaryDate.getMinutes().toString(2).padStart(6, '0');
        document.getElementById('binary-time').textContent = `${binaryHours}:${binaryMinutes}`;
        
        // Hexadecimal
        const hexTime = Math.floor((now + this.timeStreams.hex.offset) / 1000);
        document.getElementById('hex-time').textContent = '0x' + hexTime.toString(16).toUpperCase();
        
        // Roman numerals (hours and minutes)
        const romanDate = new Date(now + this.timeStreams.roman.offset);
        document.getElementById('roman-time').textContent = 
            `${this.toRoman(romanDate.getHours())}:${this.toRoman(romanDate.getMinutes())}`;
        
        // Mayan (simplified representation)
        document.getElementById('mayan-time').textContent = this.toMayan(now + this.timeStreams.mayan.offset);
        
        // Update time streams based on speed (only if not paused)
        Object.keys(this.timeStreams).forEach(stream => {
            if (this.timeStreams[stream].speed !== 0) {
                this.timeStreams[stream].offset += this.timeStreams[stream].speed * 100;
            }
        });
        
        // Check sync status
        this.checkSyncStatus();
    }
    
    adjustTime(stream, amount) {
        // Different streams need different handling
        if (stream === 'binary' || stream === 'roman' || stream === 'mayan') {
            // These are minute-based adjustments
            this.timeStreams[stream].offset += amount * 60 * 1000; // Convert minutes to ms
        } else {
            // Unix and hex are second-based
            this.timeStreams[stream].offset += amount * 1000; // Convert seconds to ms
        }
        
        this.addMessage(`Adjusted ${stream} time by ${amount > 0 ? '+' : ''}${amount}`, 'info');
        this.updateTimeDisplays(); // Immediate update
    }
    
    toggleSpeed(stream) {
        safeConsole.log(`toggleSpeed called for ${stream}`);
        
        // Validate stream exists
        if (!this.timeStreams[stream]) {
            console.error(`Stream ${stream} not found!`);
            return;
        }
        
        const current = this.timeStreams[stream].speed;
        safeConsole.log(`Current speed for ${stream}: ${current}`);
        
        // Toggle the speed
        this.timeStreams[stream].speed = current === 0 ? 1 : 0;
        safeConsole.log(`New speed for ${stream}: ${this.timeStreams[stream].speed}`);
        
        // Update visual state
        const display = document.getElementById(`${stream}-display`);
        safeConsole.log(`Display element for ${stream}:`, display);
        
        if (display) {
            if (this.timeStreams[stream].speed === 0) {
                display.classList.add('paused');
                safeConsole.log(`Added paused class to ${stream}`);
            } else {
                display.classList.remove('paused');
                safeConsole.log(`Removed paused class from ${stream}`);
            }
        } else {
            console.error(`Display element not found for ${stream}-display`);
        }
        
        // Update the button text/appearance
        const button = document.getElementById(`pause-${stream}`);
        if (button) {
            button.textContent = this.timeStreams[stream].speed === 0 ? '▶' : '⏸';
            safeConsole.log(`Updated button for ${stream}`);
        } else {
            console.warn(`Button not found for pause-${stream}`);
        }
        
        this.addMessage(`${stream} time ${current === 0 ? 'resumed' : 'paused'}`, 'info');
        
        // Force immediate display update
        this.updateTimeDisplays();
    }
    
    checkSyncStatus() {
        // Calculate variance between all time streams
        const offsets = Object.values(this.timeStreams).map(s => s.offset);
        const avg = offsets.reduce((a, b) => a + b, 0) / offsets.length;
        const variance = Math.sqrt(offsets.reduce((sum, offset) => sum + Math.pow(offset - avg, 2), 0) / offsets.length);
        
        const varianceDisplay = variance < 1000 ? Math.floor(variance) + 'ms' : 
                               variance < 60000 ? Math.floor(variance / 1000) + 's' : '∞';
        
        document.getElementById('variance').textContent = varianceDisplay;
        
        const coherence = Math.max(0, Math.min(100, 100 - (variance / 1000)));
        document.getElementById('coherence').textContent = Math.floor(coherence) + '%';
        
        // Update temporal stability
        this.temporalInstability = 10 - (coherence / 10);
        const stability = coherence > 90 ? 'STABLE' : coherence > 50 ? 'UNSTABLE' : 'CRITICAL';
        document.getElementById('temporal-stability').textContent = stability;
        
        // Check if synchronized
        if (variance < 500 && !this.solved) { // Within 500ms counts as synchronized
            this.solve();
        }
    }
    
    attemptSync() {
        const variance = this.calculateVariance();
        
        if (variance > 10000) {
            this.addMessage("SYNC FAILED: CATASTROPHIC TEMPORAL DIVERGENCE!", 'error');
            this.addMessage("TRIGGERING EMERGENCY TEMPORAL MEASURES!", 'error');
            window.chaos.increaseChaos(2);
            
            // Trigger multiple glitches!
            this.reverseTime();
            setTimeout(() => this.jumpToFuture(), 500);
            setTimeout(() => this.scrambleTimeFormats(), 1000);
            
            // Make the page go crazy
            document.body.style.animation = 'timeGlitch 2s';
            
        } else if (variance > 5000) {
            this.addMessage("SYNC FAILED: Time streams too divergent!", 'error');
            window.chaos.increaseChaos(1);
            this.temporalGlitch(); // Trigger a random glitch
            
        } else if (variance > 1000) {
            this.addMessage("Getting closer... keep adjusting!", 'warning');
            // Small glitch chance
            if (Math.random() > 0.5) {
                this.freezeTime();
            }
            
        } else {
            this.addMessage("Temporal synchronization in progress...", 'success');
        }
    }
    
    calculateVariance() {
        const offsets = Object.values(this.timeStreams).map(s => s.offset);
        const avg = offsets.reduce((a, b) => a + b, 0) / offsets.length;
        return Math.sqrt(offsets.reduce((sum, offset) => sum + Math.pow(offset - avg, 2), 0) / offsets.length);
    }
    
    toRoman(num) {
        if (num < 1) return '0';
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        let result = '';
        
        for (let i = 0; i < values.length; i++) {
            while (num >= values[i]) {
                result += symbols[i];
                num -= values[i];
            }
        }
        return result;
    }
    
    toBinary(timestamp) {
        const date = new Date(timestamp);
        return date.getHours().toString(2).padStart(5, '0') + ':' + 
               date.getMinutes().toString(2).padStart(6, '0');
    }
    
    toMayan(timestamp) {
        // Simplified Mayan representation using dots and bars
        const date = new Date(timestamp);
        const hour = date.getHours();
        const minute = date.getMinutes();
        
        const symbols = ['𝋠', '●', '●●', '●●●', '●●●●', '▬', '▬●', '▬●●', '▬●●●', '▬●●●●'];
        const tens = Math.floor(minute / 10);
        const ones = minute % 10;
        
        return `🗿 ${symbols[hour % 10]} : ${symbols[tens]} ${symbols[ones]}`;
    }
    
    savePageState() {
        this.pageStateHistory.push({
            chaosLevel: window.chaos?.chaosLevel || 0,
            timestamp: Date.now()
        });
        
        if (this.pageStateHistory.length > this.maxHistory) {
            this.pageStateHistory.shift();
        }
    }
    
    addMessage(text, type = 'info') {
        const messagesDiv = document.getElementById('temporal-messages');
        const msg = document.createElement('p');
        msg.className = `temporal-msg temporal-msg-${type}`;
        msg.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
        messagesDiv.appendChild(msg);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Keep only last 10 messages
        while (messagesDiv.children.length > 10) {
            messagesDiv.removeChild(messagesDiv.firstChild);
        }
    }
    
    solve() {
        this.solved = true;
        this.addMessage("TEMPORAL SYNCHRONIZATION ACHIEVED!", 'success');
        this.addMessage("All time streams aligned!", 'success');
        this.addMessage("Reality stabilizing...", 'success');
        
        // Stop the chaos
        clearInterval(this.glitchInterval);
        Object.keys(this.timeStreams).forEach(stream => {
            this.timeStreams[stream].speed = 1;
            this.timeStreams[stream].offset = 0;
        });
        
        setTimeout(() => {
            window.chaos.puzzleSolved('time-clock');
            const statusElement = document.getElementById('status-time-clock');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            } else {
                console.error('Status element not found for time-clock');
            }
            
            // Auto-close removed for consistent user experience
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        clearInterval(this.glitchInterval);
        clearInterval(this.timeUpdateInterval);
        
        // Remove time effects
        document.querySelectorAll('[style*="timeGlitch"]').forEach(el => {
            el.style.animation = '';
        });
        
        document.getElementById('time-clock-modal').style.display = 'none';
    }
}

// Initialize
window.addEventListener('load', () => {
    safeConsole.log('Initializing Time-Traveling Clock...');
    window.timeClock = new TimeTravelingClock();
    
    if (window.chaos) {
        window.chaos.registerPuzzle('time-clock', window.timeClock);
        safeConsole.log('Time Clock registered');
    } else {
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('time-clock', window.timeClock);
            }
        }, 500);
    }
});

// Add styles
const timeClockStyle = document.createElement('style');
timeClockStyle.textContent = `
    @keyframes timeGlitch {
        0% { transform: translateX(0); }
        10% { transform: translateX(-2px) translateY(1px); }
        20% { transform: translateX(2px) translateY(-1px); }
        30% { transform: translateX(-1px) translateY(2px); }
        40% { transform: translateX(1px) translateY(-2px); }
        50% { transform: translateX(0) translateY(0) scaleX(-1); }
        60% { transform: translateX(2px) translateY(1px) scaleX(1); }
        70% { transform: translateX(-2px) translateY(-1px); }
        80% { transform: translateX(1px) translateY(2px); }
        90% { transform: translateX(-1px) translateY(-2px); }
        100% { transform: translateX(0); }
    }
    
    @keyframes reverseTime {
        0% { transform: scaleX(1); }
        50% { transform: scaleX(-1); }
        100% { transform: scaleX(1); }
    }
    
    @keyframes timeFlash {
        0% { opacity: 0; }
        50% { opacity: 0.8; }
        100% { opacity: 0; }
    }
    
    @keyframes rewindEffect {
        0% { 
            transform: rotate(0deg) scale(1);
            filter: hue-rotate(0deg);
        }
        50% { 
            transform: rotate(180deg) scale(1.1);
            filter: hue-rotate(180deg);
        }
        100% { 
            transform: rotate(360deg) scale(1);
            filter: hue-rotate(360deg);
        }
    }
    
    @keyframes freezePulse {
        0% { 
            opacity: 0;
            transform: scale(0.8);
        }
        50% { 
            opacity: 0.5;
            transform: scale(1.2);
        }
        100% { 
            opacity: 0;
            transform: scale(1);
        }
    }
    
    .time-clock-container {
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .time-clock-container .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 15px;
    }
    
    /* Protect modal from body transforms */
    #time-clock-modal {
        transform: none !important;
        filter: none !important;
        position: fixed !important;
        isolation: isolate;
    }
    
    .time-clock-container {
        transform: none !important;
        filter: none !important;
        position: relative;
        z-index: 10001;
        isolation: isolate;
    }
    
    /* Ensure buttons remain clickable during glitches */
    .time-controls button {
        position: relative;
        z-index: 10002;
        pointer-events: auto !important;
    }
    
    /* Protect all interactive elements */
    #time-clock-modal * {
        pointer-events: auto !important;
    }
    
    .temporal-warning {
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid #ff0000;
        padding: 10px;
        margin-bottom: 15px;
        text-align: center;
        animation: pulse 2s infinite;
        font-size: 14px;
    }
    
    .time-displays {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
        margin: 15px 0;
    }
    
    .time-display {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid var(--neon-green);
        padding: 10px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    
    .time-display.paused {
        border-color: #ff0000;
        opacity: 0.7;
    }
    
    .time-display.paused::after {
        content: 'PAUSED';
        position: absolute;
        top: 5px;
        right: 5px;
        color: #ff0000;
        font-size: 10px;
        font-weight: bold;
        animation: pulse 1s infinite;
    }
    
    .time-display::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(0, 255, 0, 0.1), transparent);
        transform: rotate(45deg);
        animation: timeStream 3s linear infinite;
    }
    
    @keyframes timeStream {
        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }
    
    .time-display h3 {
        margin: 0 0 5px 0;
        color: var(--neon-green);
        font-size: 12px;
        position: relative;
        z-index: 1;
    }
    
    .time-value {
        font-size: 18px;
        font-family: 'Courier New', monospace;
        color: var(--neon-yellow);
        margin: 5px 0;
        position: relative;
        z-index: 1;
        min-height: 24px;
    }
    
    .binary-time {
        font-family: monospace;
        letter-spacing: 2px;
    }
    
    .hex-time {
        text-transform: uppercase;
    }
    
    .roman-time {
        font-family: 'Times New Roman', serif;
    }
    
    .mayan-time {
        font-size: 16px;
        letter-spacing: 3px;
    }
    
    .time-controls {
        display: flex;
        justify-content: center;
        gap: 2px;
        position: relative;
        z-index: 1;
        margin-top: 5px;
    }
    
    .time-controls button {
        padding: 3px 6px;
        background: transparent;
        border: 1px solid var(--neon-green);
        color: var(--neon-green);
        cursor: pointer;
        font-size: 10px;
        transition: all 0.3s;
    }
    
    .time-controls button:hover {
        background: var(--neon-green);
        color: #000;
    }
    
    .sync-status {
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid var(--neon-yellow);
        padding: 8px;
        margin: 10px 0;
        text-align: center;
    }
    
    .sync-status p {
        margin: 3px 0;
        color: var(--neon-yellow);
        font-size: 13px;
    }
    
    .sync-status span {
        color: var(--neon-green);
        font-weight: bold;
    }
    
    .temporal-sync {
        width: 100%;
        padding: 10px;
        background: transparent;
        border: 2px solid var(--neon-yellow);
        color: var(--neon-yellow);
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        text-transform: uppercase;
        font-size: 14px;
    }
    
    .temporal-sync:hover {
        background: var(--neon-yellow);
        color: #000;
        transform: scale(1.05);
    }
    
    .temporal-messages {
        margin-top: 10px;
        max-height: 100px;
        overflow-y: auto;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
        font-size: 11px;
    }
    
    .temporal-msg {
        margin: 5px 0;
        padding: 5px;
        font-size: 12px;
        font-family: 'Courier New', monospace;
    }
    
    .temporal-msg-info {
        color: #00ff00;
    }
    
    .temporal-msg-warning {
        color: #ffff00;
    }
    
    .temporal-msg-error {
        color: #ff0000;
        font-weight: bold;
    }
    
    .temporal-msg-success {
        color: #00ffff;
        font-weight: bold;
    }
`;
document.head.appendChild(timeClockStyle);