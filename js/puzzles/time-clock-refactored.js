/**
 * Time-Traveling Clock Puzzle - REFACTORED VERSION
 * A clock that exists in multiple time streams simultaneously
 * Fixed: Math calculations, button controls, pause/play functionality
 */

class TimeTravelingClock {
    constructor() {
        this.puzzleId = 'time-clock';
        this.isActive = false;
        
        // Base time reference - all streams calculate from this
        this.baseTime = Date.now();
        
        // Time streams with their offsets and running state
        this.timeStreams = {
            unix: { offset: 0, running: true },
            binary: { offset: 0, running: true },
            hex: { offset: 0, running: true },
            roman: { offset: 0, running: true },
            mayan: { offset: 0, running: true }
        };
        
        this.temporalInstability = 10;
        this.glitchInterval = null;
        this.timeUpdateInterval = null;
        this.solved = false;
        
        // Time formats for display
        this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.futureDay = ['Suntime', 'Moonday', 'Toosday', 'Whensday', 'Thirstday', 'Fryday', 'Saturnday'];
        this.ancientDay = ['Sol', 'Luna', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
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
                                    <button class="time-btn" data-stream="unix" data-amount="-3600">-1hr</button>
                                    <button class="time-btn" data-stream="unix" data-amount="-60">-1m</button>
                                    <button class="pause-btn" data-stream="unix">⏸</button>
                                    <button class="time-btn" data-stream="unix" data-amount="60">+1m</button>
                                    <button class="time-btn" data-stream="unix" data-amount="3600">+1hr</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="binary-display">
                                <h3>BINARY TIME</h3>
                                <div class="time-value binary-time" id="binary-time">00000000</div>
                                <div class="time-controls">
                                    <button class="time-btn" data-stream="binary" data-amount="-5">-5m</button>
                                    <button class="time-btn" data-stream="binary" data-amount="-1">-1m</button>
                                    <button class="pause-btn" data-stream="binary">⏸</button>
                                    <button class="time-btn" data-stream="binary" data-amount="1">+1m</button>
                                    <button class="time-btn" data-stream="binary" data-amount="5">+5m</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="hex-display">
                                <h3>HEXADECIMAL</h3>
                                <div class="time-value hex-time" id="hex-time">0x00000000</div>
                                <div class="time-controls">
                                    <button class="time-btn" data-stream="hex" data-amount="-256">-0x100</button>
                                    <button class="time-btn" data-stream="hex" data-amount="-16">-0x10</button>
                                    <button class="pause-btn" data-stream="hex">⏸</button>
                                    <button class="time-btn" data-stream="hex" data-amount="16">+0x10</button>
                                    <button class="time-btn" data-stream="hex" data-amount="256">+0x100</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="roman-display">
                                <h3>ROMAN NUMERALS</h3>
                                <div class="time-value roman-time" id="roman-time">XII:XXX</div>
                                <div class="time-controls">
                                    <button class="time-btn" data-stream="roman" data-amount="-5">-V</button>
                                    <button class="time-btn" data-stream="roman" data-amount="-1">-I</button>
                                    <button class="pause-btn" data-stream="roman">⏸</button>
                                    <button class="time-btn" data-stream="roman" data-amount="1">+I</button>
                                    <button class="time-btn" data-stream="roman" data-amount="5">+V</button>
                                </div>
                            </div>
                            
                            <div class="time-display" id="mayan-display">
                                <h3>MAYAN CALENDAR</h3>
                                <div class="time-value mayan-time" id="mayan-time">🗿 ● ● ● ●</div>
                                <div class="time-controls">
                                    <button class="time-btn" data-stream="mayan" data-amount="-10">-10m</button>
                                    <button class="time-btn" data-stream="mayan" data-amount="-1">-1m</button>
                                    <button class="pause-btn" data-stream="mayan">⏸</button>
                                    <button class="time-btn" data-stream="mayan" data-amount="1">+1m</button>
                                    <button class="time-btn" data-stream="mayan" data-amount="10">+10m</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sync-status" id="sync-status">
                            <p>Temporal Variance: <span id="variance">∞</span></p>
                            <p>Reality Coherence: <span id="coherence">15%</span></p>
                        </div>
                        
                        <button class="btn btn-primary temporal-sync" id="sync-btn">
                            ATTEMPT TEMPORAL SYNCHRONIZATION
                        </button>
                        
                        <div class="temporal-messages" id="temporal-messages"></div>
                        
                        <div class="puzzle-hint" style="margin-top: 10px; padding: 8px; font-size: 12px;">
                            <p style="margin: 0;">Hint: All time displays must show the same moment. Pause streams to make adjustments easier.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners after modal is created
        this.setupEventListeners();
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    }
    
    setupEventListeners() {
        // Time adjustment buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stream = e.target.dataset.stream;
                const amount = parseInt(e.target.dataset.amount);
                this.adjustTime(stream, amount);
            });
        });
        
        // Pause/play buttons
        document.querySelectorAll('.pause-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stream = e.target.dataset.stream;
                this.toggleStream(stream);
            });
        });
        
        // Sync button
        const syncBtn = document.getElementById('sync-btn');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.attemptSync());
        }
    }
    
    activate() {
        safeConsole.log('Time Clock activate() called');
        
        if (!document.getElementById('time-clock-modal')) {
            this.createClockModal();
        }
        
        this.isActive = true;
        this.solved = false;
        
        // Reset time streams with random offsets
        this.baseTime = Date.now();
        Object.keys(this.timeStreams).forEach(stream => {
            this.timeStreams[stream].offset = Math.floor(Math.random() * 10000) - 5000;
            this.timeStreams[stream].running = true;
        });
        
        // Reset pause buttons
        document.querySelectorAll('.pause-btn').forEach(btn => {
            btn.textContent = '⏸';
            btn.closest('.time-display').classList.remove('paused');
        });
        
        const modal = document.getElementById('time-clock-modal');
        modal.style.display = 'flex';
        
        // Start the updates
        this.startTimeUpdate();
        this.startTemporalChaos();
        
        this.addMessage("Time streams detected. Reality unstable.", 'warning');
    }
    
    startTimeUpdate() {
        // Update display every 100ms
        this.timeUpdateInterval = setInterval(() => {
            this.updateTimeDisplays();
        }, 100);
    }
    
    updateTimeDisplays() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.baseTime;
        
        Object.entries(this.timeStreams).forEach(([streamName, stream]) => {
            // Calculate current offset including running time
            let totalOffset = stream.offset;
            if (stream.running) {
                totalOffset += elapsed;
            }
            
            const actualTime = this.baseTime + totalOffset;
            
            // Update display based on stream type
            switch(streamName) {
                case 'unix':
                    document.getElementById('unix-time').textContent = Math.floor(actualTime / 1000);
                    break;
                    
                case 'binary':
                    const binaryDate = new Date(actualTime);
                    const binaryHours = binaryDate.getHours().toString(2).padStart(5, '0');
                    const binaryMinutes = binaryDate.getMinutes().toString(2).padStart(6, '0');
                    const binarySeconds = binaryDate.getSeconds().toString(2).padStart(6, '0');
                    document.getElementById('binary-time').textContent = `${binaryHours}:${binaryMinutes}:${binarySeconds}`;
                    break;
                    
                case 'hex':
                    document.getElementById('hex-time').textContent = '0x' + Math.floor(actualTime / 1000).toString(16).toUpperCase();
                    break;
                    
                case 'roman':
                    const romanDate = new Date(actualTime);
                    document.getElementById('roman-time').textContent = 
                        `${this.toRoman(romanDate.getHours())}:${this.toRoman(romanDate.getMinutes())}:${this.toRoman(romanDate.getSeconds())}`;
                    break;
                    
                case 'mayan':
                    document.getElementById('mayan-time').textContent = this.toMayan(actualTime);
                    break;
            }
        });
        
        // Check sync status
        this.checkSyncStatus();
    }
    
    adjustTime(stream, amount) {
        // Different streams need different handling
        let adjustment;
        if (stream === 'binary' || stream === 'roman' || stream === 'mayan') {
            // These are minute-based adjustments
            adjustment = amount * 60 * 1000; // Convert minutes to ms
        } else if (stream === 'hex') {
            // Hex adjustments are in seconds
            adjustment = amount * 1000;
        } else {
            // Unix is in seconds
            adjustment = amount * 1000;
        }
        
        this.timeStreams[stream].offset += adjustment;
        
        this.addMessage(`Adjusted ${stream} time by ${amount > 0 ? '+' : ''}${amount}`, 'info');
        this.updateTimeDisplays();
    }
    
    toggleStream(stream) {
        const isRunning = this.timeStreams[stream].running;
        
        if (isRunning) {
            // Pausing - capture current time
            const currentTime = Date.now();
            const elapsed = currentTime - this.baseTime;
            this.timeStreams[stream].offset += elapsed;
            this.timeStreams[stream].running = false;
            
            // Update base time for other streams
            this.baseTime = currentTime;
            Object.entries(this.timeStreams).forEach(([name, str]) => {
                if (name !== stream && str.running) {
                    str.offset -= elapsed;
                }
            });
        } else {
            // Resuming
            this.timeStreams[stream].running = true;
        }
        
        // Update UI
        const btn = document.querySelector(`.pause-btn[data-stream="${stream}"]`);
        const display = document.getElementById(`${stream}-display`);
        
        if (btn) {
            btn.textContent = isRunning ? '▶' : '⏸';
        }
        
        if (display) {
            if (isRunning) {
                display.classList.add('paused');
            } else {
                display.classList.remove('paused');
            }
        }
        
        this.addMessage(`${stream} time ${isRunning ? 'paused' : 'resumed'}`, 'info');
    }
    
    checkSyncStatus() {
        // Get all current times
        const currentTime = Date.now();
        const elapsed = currentTime - this.baseTime;
        
        const times = Object.entries(this.timeStreams).map(([name, stream]) => {
            let totalOffset = stream.offset;
            if (stream.running) {
                totalOffset += elapsed;
            }
            return this.baseTime + totalOffset;
        });
        
        // Calculate variance
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const variance = Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length);
        
        // Update display
        const varianceDisplay = variance < 1000 ? Math.floor(variance) + 'ms' : 
                               variance < 60000 ? Math.floor(variance / 1000) + 's' : '∞';
        
        document.getElementById('variance').textContent = varianceDisplay;
        
        const coherence = Math.max(0, Math.min(100, 100 - (variance / 1000)));
        document.getElementById('coherence').textContent = Math.floor(coherence) + '%';
        
        // Update temporal stability
        const stability = coherence > 90 ? 'STABLE' : coherence > 50 ? 'UNSTABLE' : 'CRITICAL';
        document.getElementById('temporal-stability').textContent = stability;
        
        // Check if synchronized
        if (variance < 500 && !this.solved) {
            this.solve();
        }
    }
    
    attemptSync() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.baseTime;
        
        const times = Object.entries(this.timeStreams).map(([name, stream]) => {
            let totalOffset = stream.offset;
            if (stream.running) {
                totalOffset += elapsed;
            }
            return this.baseTime + totalOffset;
        });
        
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const variance = Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length);
        
        if (variance > 10000) {
            this.addMessage("SYNC FAILED: Time streams too divergent!", 'error');
            window.chaos.increaseChaos(1);
            this.temporalGlitch();
        } else if (variance > 1000) {
            this.addMessage("Getting closer... keep adjusting!", 'warning');
        } else {
            this.addMessage("Temporal synchronization in progress...", 'success');
        }
    }
    
    startTemporalChaos() {
        // Simplified chaos - less aggressive
        this.glitchInterval = setInterval(() => {
            if (!this.isActive || this.solved) return;
            
            const currentTime = Date.now();
            const elapsed = currentTime - this.baseTime;
            
            const times = Object.entries(this.timeStreams).map(([name, stream]) => {
                let totalOffset = stream.offset;
                if (stream.running) {
                    totalOffset += elapsed;
                }
                return this.baseTime + totalOffset;
            });
            
            const avg = times.reduce((a, b) => a + b, 0) / times.length;
            const variance = Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length);
            
            // Only glitch when variance is high
            if (variance > 5000 && Math.random() > 0.7) {
                this.temporalGlitch();
            }
        }, 3000);
    }
    
    temporalGlitch() {
        const glitchTypes = [
            () => this.visualGlitch(),
            () => this.scrambleDisplay(),
            () => this.showTemporalMessage()
        ];
        
        const glitch = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
        glitch();
    }
    
    visualGlitch() {
        const container = document.querySelector('.time-clock-container');
        container.style.animation = 'timeGlitch 0.5s';
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }
    
    scrambleDisplay() {
        this.addMessage("TEMPORAL INTERFERENCE DETECTED!", 'error');
        
        const displays = ['unix-time', 'binary-time', 'hex-time', 'roman-time', 'mayan-time'];
        const randomDisplay = displays[Math.floor(Math.random() * displays.length)];
        const element = document.getElementById(randomDisplay);
        
        if (element) {
            const original = element.textContent;
            element.textContent = '???ERROR???';
            element.style.color = '#ff0000';
            
            setTimeout(() => {
                element.textContent = original;
                element.style.color = '';
            }, 1000);
        }
    }
    
    showTemporalMessage() {
        const messages = [
            "Time is an illusion...",
            "Past, present, future - all one",
            "The clocks are watching you",
            "Tick tock goes the temporal lock",
            "Reality phase shift detected"
        ];
        
        this.addMessage(messages[Math.floor(Math.random() * messages.length)], 'warning');
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
    
    toMayan(timestamp) {
        const date = new Date(timestamp);
        const hour = date.getHours();
        const minute = date.getMinutes();
        
        const symbols = ['𝋠', '●', '●●', '●●●', '●●●●', '▬', '▬●', '▬●●', '▬●●●', '▬●●●●'];
        const tens = Math.floor(minute / 10);
        const ones = minute % 10;
        
        return `🗿 ${symbols[hour % 10]} : ${symbols[tens]} ${symbols[ones]}`;
    }
    
    addMessage(text, type = 'info') {
        const messagesDiv = document.getElementById('temporal-messages');
        if (!messagesDiv) return;
        
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
        
        // Reset all streams to synchronized
        Object.keys(this.timeStreams).forEach(stream => {
            this.timeStreams[stream].running = true;
            this.timeStreams[stream].offset = 0;
        });
        
        setTimeout(() => {
            window.chaos.puzzleSolved('time-clock');
            const statusElement = document.getElementById('status-time-clock');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            }
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        clearInterval(this.glitchInterval);
        clearInterval(this.timeUpdateInterval);
        
        document.getElementById('time-clock-modal').style.display = 'none';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    safeConsole.log('Initializing Refactored Time-Traveling Clock...');
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

// Keep existing styles from original file