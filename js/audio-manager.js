/**
 * Audio Manager for CRT Chaos
 * Handles all sound effects with volume control and preloading
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.initialized = false;
        
        // Sound file mappings - use WAV files (MP3s are corrupted)
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
        
        // Create audio elements for each sound
        Object.entries(this.soundFiles).forEach(([name, path]) => {
            const audio = new Audio();
            audio.src = path;
            audio.volume = this.volume;
            audio.preload = 'auto';
            
            // Handle loading errors
            audio.addEventListener('error', (e) => {
                console.error(`[AudioManager] Failed to load: ${name} from ${path}`);
                if (audio.error) {
                    console.error(`[AudioManager] Error code: ${audio.error.code}`);
                }
            });
            
            // Log successful loads
            audio.addEventListener('canplaythrough', () => {
                console.log(`[AudioManager] Successfully loaded: ${name} (${path})`);
            });
            
            this.sounds[name] = audio;
        });
        
        this.initialized = true;
        this.createAudioControls();
    }
    
    play(soundName, options = {}) {
        console.log(`[AudioManager] Attempting to play: ${soundName}, enabled: ${this.enabled}, initialized: ${this.initialized}, exists: ${!!this.sounds[soundName]}`);
        
        // Initialize if not already done
        if (!this.initialized) {
            console.log('[AudioManager] Not initialized, initializing now...');
            this.init();
        }
        
        if (!this.enabled || !this.sounds[soundName]) {
            console.warn(`[AudioManager] Cannot play ${soundName} - enabled: ${this.enabled}, exists: ${!!this.sounds[soundName]}`);
            return;
        }
        
        const sound = this.sounds[soundName];
        
        // Clone the audio to allow overlapping plays
        const audio = sound.cloneNode();
        audio.volume = options.volume || this.volume;
        
        if (options.loop) {
            audio.loop = true;
        }
        
        if (options.pitch) {
            audio.playbackRate = options.pitch;
        }
        
        audio.play().then(() => {
            console.log(`[AudioManager] Successfully playing: ${soundName}`);
        }).catch(e => {
            // Handle autoplay restrictions
            console.warn(`[AudioManager] Audio playback failed for ${soundName}:`, e);
        });
        
        return audio;
    }
    
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
        this.play('beep', { pitch, volume: this.volume * 1.2 }); // Beep slightly louder
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
                <button id="audio-toggle" class="audio-btn" title="Toggle Sound">
                    <span class="audio-icon">${this.enabled ? '🔊' : '🔇'}</span>
                </button>
                <input type="range" id="audio-volume" class="audio-slider" 
                       min="0" max="100" value="${this.volume * 100}" 
                       title="Volume">
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('audio-toggle').addEventListener('click', () => this.toggle());
        document.getElementById('audio-volume').addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
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
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid var(--neon-green);
                padding: 10px;
                border-radius: 5px;
            }
            
            .audio-btn {
                background: transparent;
                border: 1px solid var(--neon-green);
                color: var(--neon-green);
                padding: 5px 10px;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.3s;
            }
            
            .audio-btn:hover {
                background: var(--neon-green);
                color: #000;
            }
            
            .audio-slider {
                width: 100px;
                cursor: pointer;
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

// Create global audio manager instance
window.audioManager = new AudioManager();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Try to initialize immediately
    window.audioManager.init();
    console.log('[AudioManager] Initialized on DOMContentLoaded');
    
    // Also set up interaction-based init as fallback
    let interactionInit = false;
    const initOnInteraction = () => {
        if (!interactionInit) {
            interactionInit = true;
            window.audioManager.init();
            console.log('[AudioManager] Re-initialized on user interaction');
        }
        document.removeEventListener('click', initOnInteraction);
        document.removeEventListener('keydown', initOnInteraction);
    };
    
    document.addEventListener('click', initOnInteraction);
    document.addEventListener('keydown', initOnInteraction);
});