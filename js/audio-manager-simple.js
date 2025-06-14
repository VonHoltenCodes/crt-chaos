/**
 * Simple Audio Manager for CRT Chaos
 * Just make the damn sounds play
 */

class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.sounds = {};
        this.initialized = false;
        
        // Use the WAV files that actually work
        this.soundFiles = {
            glitch: 'assets/sounds/glitch_real.wav',
            error: 'assets/sounds/error_real.wav',
            success: 'assets/sounds/success_real.wav',
            typing: 'assets/sounds/typing_real.wav',
            beep: 'assets/sounds/beep_real.wav',
            powerOn: 'assets/sounds/power-on_real.wav',
            powerOff: 'assets/sounds/power-off_real.wav',
            static: 'assets/sounds/static_real.wav'
        };
        
        this.loadSettings();
    }
    
    init() {
        if (this.initialized) return;
        
        // Pre-create audio elements
        Object.entries(this.soundFiles).forEach(([name, path]) => {
            this.sounds[name] = new Audio(path);
            this.sounds[name].volume = this.volume;
        });
        
        this.initialized = true;
        // Audio controls disabled - see README for help needed
        // this.createAudioControls();
    }
    
    play(soundName, options = {}) {
        if (!this.enabled) return;
        
        // Init if needed
        if (!this.initialized) {
            this.init();
        }
        
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        // Create a new audio element for overlapping sounds
        const audio = new Audio(sound.src);
        audio.volume = options.volume || this.volume;
        
        if (options.pitch) {
            audio.playbackRate = options.pitch;
        }
        
        // Just try to play it
        audio.play().catch(() => {
            // Silently fail - no spam in console
        });
        
        return audio;
    }
    
    // Convenience methods
    playGlitch() {
        const pitches = [0.5, 0.7, 1.0, 1.3, 1.5];
        const pitch = pitches[Math.floor(Math.random() * pitches.length)];
        this.play('glitch', { pitch, volume: this.volume * 0.7 });
    }
    
    playTyping() {
        this.play('typing', { volume: this.volume * 0.3 });
    }
    
    playError() {
        this.play('error', { volume: this.volume * 0.8 });
    }
    
    playSuccess() {
        this.play('success');
    }
    
    playBeep(pitch = 1.0) {
        this.play('beep', { pitch });
    }
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
        this.saveSettings();
    }
    
    toggle() {
        this.enabled = !this.enabled;
        this.saveSettings();
        this.updateControlsUI();
    }
    
    createAudioControls() {
        const controls = document.createElement('div');
        controls.id = 'audio-controls';
        controls.innerHTML = `
            <div class="audio-control-panel">
                <button class="audio-toggle" id="audio-toggle">
                    <span class="audio-icon">${this.enabled ? '🔊' : '🔇'}</span>
                </button>
                <input type="range" class="audio-slider" id="audio-volume" 
                       min="0" max="100" value="${this.volume * 100}">
                <span class="audio-volume-text">${Math.round(this.volume * 100)}%</span>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('audio-toggle').addEventListener('click', () => this.toggle());
        document.getElementById('audio-volume').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
            document.querySelector('.audio-volume-text').textContent = e.target.value + '%';
        });
        
        // Add styles
        this.addStyles();
    }
    
    updateControlsUI() {
        const toggle = document.getElementById('audio-toggle');
        if (toggle) {
            toggle.querySelector('.audio-icon').textContent = this.enabled ? '🔊' : '🔇';
        }
    }
    
    saveSettings() {
        localStorage.setItem('crt-chaos-audio', JSON.stringify({
            enabled: this.enabled,
            volume: this.volume
        }));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('crt-chaos-audio');
        if (saved) {
            const settings = JSON.parse(saved);
            this.enabled = settings.enabled;
            this.volume = settings.volume;
        }
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #audio-controls {
                position: fixed;
                bottom: 175px;
                right: 20px;
                z-index: 9999;
            }
            
            .audio-control-panel {
                display: flex;
                align-items: center;
                background: rgba(0, 0, 0, 0.9);
                padding: 10px;
                border: 2px solid var(--neon-green);
                border-radius: 5px;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
                gap: 10px;
            }
            
            .audio-toggle {
                background: transparent;
                border: 1px solid var(--neon-green);
                color: var(--neon-green);
                cursor: pointer;
                padding: 5px 10px;
                font-size: 20px;
                transition: all 0.3s;
            }
            
            .audio-toggle:hover {
                background: var(--neon-green);
                color: #000;
            }
            
            .audio-slider {
                width: 100px;
                cursor: pointer;
            }
            
            .audio-volume-text {
                color: var(--neon-green);
                font-family: monospace;
                min-width: 40px;
                text-align: right;
            }
            
            /* Custom slider styling */
            .audio-slider {
                -webkit-appearance: none;
                appearance: none;
                height: 5px;
                background: #333;
                outline: none;
            }
            
            .audio-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 15px;
                height: 15px;
                background: var(--neon-green);
                cursor: pointer;
                border-radius: 50%;
            }
            
            .audio-slider::-moz-range-thumb {
                width: 15px;
                height: 15px;
                background: var(--neon-green);
                cursor: pointer;
                border-radius: 50%;
                border: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// Create global instance
window.audioManager = new AudioManager();

// Initialize immediately
window.audioManager.init();