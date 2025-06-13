/**
 * Mime Artist Modal Puzzle
 * A modal that refuses to use words and communicates only through emojis and gestures
 */

class MimeModal {
    constructor() {
        this.puzzleId = 'mime-modal';
        this.isActive = false;
        this.solved = false;
        this.currentEmotion = 'trapped';
        this.gestureSequence = [];
        this.correctSequence = ['👋', '🚪', '🔓', '🎉']; // Wave, door, unlock, celebrate
        
        this.emotions = {
            trapped: {
                emojis: ['😰', '😟', '😖', '😣'],
                gestures: ['🤲', '🙏', '👐', '🤷'],
                message: '📦➡️😢' // Box arrow sad
            },
            frustrated: {
                emojis: ['😤', '😠', '🤦', '😡'],
                gestures: ['✊', '👎', '🙅', '💢'],
                message: '❌🗣️➡️😤' // No speak arrow angry
            },
            hopeful: {
                emojis: ['🤔', '😊', '🙂', '😌'],
                gestures: ['👆', '💡', '✨', '🎯'],
                message: '🤝➡️🔓❓' // Handshake arrow unlock?
            },
            excited: {
                emojis: ['😃', '😄', '🤗', '✨'],
                gestures: ['👏', '🙌', '🎊', '💃'],
                message: '✅➡️🎉' // Check arrow party
            },
            free: {
                emojis: ['🥳', '🎉', '🌟', '🦋'],
                gestures: ['🚀', '🌈', '✨', '🎆'],
                message: '🔓➡️😊➡️👋' // Unlock arrow happy arrow wave
            }
        };
        
        this.playerGestures = [
            { emoji: '👋', name: 'Wave', hint: 'A friendly greeting' },
            { emoji: '👍', name: 'Thumbs Up', hint: 'Show approval' },
            { emoji: '👎', name: 'Thumbs Down', hint: 'Show disapproval' },
            { emoji: '🤝', name: 'Handshake', hint: 'Make a deal' },
            { emoji: '🚪', name: 'Door', hint: 'Point to exit' },
            { emoji: '🔓', name: 'Unlock', hint: 'Open something' },
            { emoji: '❓', name: 'Question', hint: 'Ask why' },
            { emoji: '🎉', name: 'Celebrate', hint: 'Show joy' },
            { emoji: '🤐', name: 'Zip Lips', hint: 'Promise silence' },
            { emoji: '🎭', name: 'Theater', hint: 'Acknowledge the act' }
        ];
        
        this.mimeResponses = {
            '👋': () => this.respondToWave(),
            '👍': () => this.respondToApproval(),
            '👎': () => this.respondToDisapproval(),
            '🤝': () => this.respondToHandshake(),
            '🚪': () => this.respondToDoor(),
            '🔓': () => this.respondToUnlock(),
            '❓': () => this.respondToQuestion(),
            '🎉': () => this.respondToCelebrate(),
            '🤐': () => this.respondToZipLips(),
            '🎭': () => this.respondToTheater()
        };
    }
    
    createMimeModal() {
        safeConsole.log('Creating mime modal...');
        
        if (document.getElementById('mime-modal-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'mime-modal-modal';
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
                <div class="terminal-container mime-modal-container">
                    <div class="terminal-header">
                        <span class="terminal-title">MODAL.EXE - <span id="mime-emotion">😰 TRAPPED</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" id="mime-close-btn">
                                <span class="close-emoji">❌</span>
                            </span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="mime-stage">
                            <div class="mime-character" id="mime-character">
                                <div class="mime-face" id="mime-face">😰</div>
                                <div class="mime-hands" id="mime-hands">🤲</div>
                            </div>
                            <div class="mime-message" id="mime-message">📦➡️😢</div>
                        </div>
                        
                        <div class="invisible-wall" id="invisible-wall">
                            <div class="wall-touch-effect"></div>
                        </div>
                        
                        <div class="gesture-sequence">
                            <p>Your gestures:</p>
                            <div class="sequence-display" id="sequence-display"></div>
                        </div>
                        
                        <div class="player-gestures">
                            <p>Communicate with gestures:</p>
                            <div class="gesture-grid" id="gesture-grid">
                                <!-- Gestures will be added here -->
                            </div>
                        </div>
                        
                        <div class="mime-theater">
                            <div class="audience-reaction" id="audience-reaction"></div>
                        </div>
                        
                        <div class="puzzle-hint">
                            <p>Hint: The mime is trapped in the modal! Try different gestures to help them escape. Maybe start with a greeting?</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Special handling for mime modal - clicking outside closes it
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Close button behavior
        const closeBtn = document.getElementById('mime-close-btn');
        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.solved) {
                this.mimeProtestClose();
            } else {
                this.close();
            }
        });
    }
    
    activate() {
        safeConsole.log('Mime Modal activate() called');
        
        if (!document.getElementById('mime-modal-modal')) {
            this.createMimeModal();
        }
        
        this.isActive = true;
        this.solved = false;
        this.gestureSequence = [];
        this.currentEmotion = 'trapped';
        
        const modal = document.getElementById('mime-modal-modal');
        modal.style.display = 'flex';
        
        this.populateGestures();
        this.updateMimeDisplay();
        this.startMimeAnimation();
        
        // Show invisible walls
        setTimeout(() => {
            this.touchInvisibleWall();
        }, 1000);
    }
    
    populateGestures() {
        const grid = document.getElementById('gesture-grid');
        grid.innerHTML = '';
        
        this.playerGestures.forEach(gesture => {
            const btn = document.createElement('button');
            btn.className = 'gesture-btn';
            btn.innerHTML = `
                <span class="gesture-emoji">${gesture.emoji}</span>
                <span class="gesture-name">${gesture.name}</span>
            `;
            btn.title = gesture.hint;
            btn.onclick = () => this.performGesture(gesture.emoji);
            
            grid.appendChild(btn);
        });
    }
    
    performGesture(emoji) {
        // Add to sequence
        this.gestureSequence.push(emoji);
        if (this.gestureSequence.length > 6) {
            this.gestureSequence.shift();
        }
        
        this.updateSequenceDisplay();
        
        // Mime responds
        if (this.mimeResponses[emoji]) {
            this.mimeResponses[emoji]();
        }
        
        // Check for correct sequence
        this.checkSequence();
    }
    
    updateSequenceDisplay() {
        const display = document.getElementById('sequence-display');
        display.innerHTML = this.gestureSequence.map(emoji => 
            `<span class="sequence-emoji">${emoji}</span>`
        ).join('');
    }
    
    checkSequence() {
        // Check if last 4 gestures match the correct sequence
        if (this.gestureSequence.length >= 4) {
            const recent = this.gestureSequence.slice(-4);
            if (JSON.stringify(recent) === JSON.stringify(this.correctSequence)) {
                this.solve();
            }
        }
    }
    
    respondToWave() {
        this.setEmotion('hopeful');
        this.mimeGesture('👋', '😊');
        this.showMessage('👋➡️😊');
        this.audienceReact('👏');
    }
    
    respondToApproval() {
        this.mimeGesture('👍', '🙂');
        this.showMessage('👍➡️🤝❓');
    }
    
    respondToDisapproval() {
        this.setEmotion('frustrated');
        this.mimeGesture('😞', '👎');
        this.showMessage('😢➡️📦');
    }
    
    respondToHandshake() {
        this.setEmotion('hopeful');
        this.mimeGesture('🤝', '😊');
        this.showMessage('🤝➡️🚪❓');
        this.audienceReact('🤔');
    }
    
    respondToDoor() {
        if (this.currentEmotion === 'hopeful') {
            this.setEmotion('excited');
            this.mimeGesture('🚪', '😃');
            this.showMessage('🚪➡️🔒➡️😰');
            this.touchInvisibleWall();
            this.audienceReact('😮');
        }
    }
    
    respondToUnlock() {
        if (this.currentEmotion === 'excited') {
            this.mimeGesture('🔓', '🤗');
            this.showMessage('🔓➡️✨➡️😊');
            this.audienceReact('🎊');
        }
    }
    
    respondToQuestion() {
        this.mimeGesture('🤷', '❓');
        this.showMessage('🚫🗣️➡️🤐');
    }
    
    respondToCelebrate() {
        if (this.gestureSequence.includes('🔓')) {
            this.setEmotion('free');
            this.mimeGesture('🎉', '🥳');
            this.showMessage('🎉➡️🦋➡️✨');
            this.audienceReact('🎉🎊👏');
        }
    }
    
    respondToZipLips() {
        this.mimeGesture('🤐', '😌');
        this.showMessage('🤐➡️🤝➡️😊');
        this.audienceReact('🤫');
    }
    
    respondToTheater() {
        this.mimeGesture('🎭', '😄');
        this.showMessage('🎭➡️👏➡️😊');
        this.audienceReact('🎭');
    }
    
    mimeProtestClose() {
        // Mime panics when trying to close
        this.setEmotion('frustrated');
        this.mimeGesture('🙅', '😱');
        this.showMessage('❌➡️😰➡️🆘');
        
        // Shake the modal
        const modal = document.querySelector('.mime-modal-container');
        modal.style.animation = 'mimeProtest 0.5s';
        setTimeout(() => {
            modal.style.animation = '';
        }, 500);
        
        // Flash the close button
        const closeBtn = document.getElementById('mime-close-btn');
        closeBtn.style.animation = 'closeButtonPanic 1s';
        setTimeout(() => {
            closeBtn.style.animation = '';
        }, 1000);
    }
    
    touchInvisibleWall() {
        const wall = document.getElementById('invisible-wall');
        wall.style.display = 'block';
        
        // Create touch effect
        const effect = wall.querySelector('.wall-touch-effect');
        effect.style.animation = 'wallTouch 1s ease-out';
        
        setTimeout(() => {
            effect.style.animation = '';
            wall.style.display = 'none';
        }, 1000);
    }
    
    mimeGesture(gesture, face) {
        const mimeHands = document.getElementById('mime-hands');
        const mimeFace = document.getElementById('mime-face');
        
        mimeHands.textContent = gesture;
        mimeHands.style.animation = 'gestureAnimation 0.5s ease-in-out';
        
        if (face) {
            mimeFace.textContent = face;
        }
        
        setTimeout(() => {
            mimeHands.style.animation = '';
        }, 500);
    }
    
    showMessage(message) {
        const messageDiv = document.getElementById('mime-message');
        messageDiv.style.opacity = '0';
        
        setTimeout(() => {
            messageDiv.textContent = message;
            messageDiv.style.opacity = '1';
        }, 200);
    }
    
    setEmotion(emotion) {
        this.currentEmotion = emotion;
        this.updateMimeDisplay();
    }
    
    updateMimeDisplay() {
        const emotion = this.emotions[this.currentEmotion];
        const face = emotion.emojis[0];
        const hands = emotion.gestures[0];
        
        document.getElementById('mime-face').textContent = face;
        document.getElementById('mime-hands').textContent = hands;
        document.getElementById('mime-message').textContent = emotion.message;
        
        const emotionDisplay = document.getElementById('mime-emotion');
        emotionDisplay.textContent = `${face} ${this.currentEmotion.toUpperCase()}`;
    }
    
    startMimeAnimation() {
        this.animationInterval = setInterval(() => {
            if (!this.isActive || this.solved) return;
            
            const emotion = this.emotions[this.currentEmotion];
            const face = emotion.emojis[Math.floor(Math.random() * emotion.emojis.length)];
            const hands = emotion.gestures[Math.floor(Math.random() * emotion.gestures.length)];
            
            document.getElementById('mime-face').textContent = face;
            document.getElementById('mime-hands').textContent = hands;
        }, 2000);
    }
    
    audienceReact(reaction) {
        const audience = document.getElementById('audience-reaction');
        audience.textContent = reaction;
        audience.style.animation = 'audienceAppear 2s ease-in-out';
        
        setTimeout(() => {
            audience.style.animation = '';
            audience.textContent = '';
        }, 2000);
    }
    
    solve() {
        this.solved = true;
        this.setEmotion('free');
        clearInterval(this.animationInterval);
        
        // Mime celebrates freedom
        const character = document.getElementById('mime-character');
        character.style.animation = 'mimeFreedom 2s ease-in-out';
        
        this.mimeGesture('🎉', '🥳');
        this.showMessage('🔓➡️🎉➡️👋➡️😊');
        this.audienceReact('👏👏👏🌹🌹🌹');
        
        // Enable close button
        const closeBtn = document.querySelector('.close-emoji');
        closeBtn.textContent = '✅';
        
        setTimeout(() => {
            window.chaos.puzzleSolved('mime-modal');
            const statusElement = document.getElementById('status-mime-modal');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            }
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        clearInterval(this.animationInterval);
        document.getElementById('mime-modal-modal').style.display = 'none';
    }
}

// Initialize
window.addEventListener('load', () => {
    safeConsole.log('Initializing Mime Modal...');
    window.mimeModal = new MimeModal();
    
    if (window.chaos) {
        window.chaos.registerPuzzle('mime-modal', window.mimeModal);
        safeConsole.log('Mime Modal registered');
    } else {
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('mime-modal', window.mimeModal);
            }
        }, 500);
    }
});

// Add styles
const mimeStyle = document.createElement('style');
mimeStyle.textContent = `
    @keyframes mimeProtest {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-10px) rotate(-1deg); }
        30% { transform: translateX(10px) rotate(1deg); }
        50% { transform: translateX(-10px) rotate(-1deg); }
        70% { transform: translateX(10px) rotate(1deg); }
        90% { transform: translateX(-5px) rotate(0deg); }
    }
    
    @keyframes closeButtonPanic {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.2) rotate(-10deg); }
        50% { transform: scale(1.3) rotate(10deg); }
        75% { transform: scale(1.2) rotate(-10deg); }
    }
    
    @keyframes gestureAnimation {
        0%, 100% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.2) translateY(-10px); }
    }
    
    @keyframes wallTouch {
        0% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(1.5); }
    }
    
    @keyframes audienceAppear {
        0% { opacity: 0; transform: translateY(20px); }
        50% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes mimeFreedom {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(360deg); }
        100% { transform: scale(1) rotate(720deg); }
    }
    
    .mime-modal-container {
        max-height: 90vh;
        overflow-y: auto;
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    }
    
    .mime-modal-container .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 20px;
    }
    
    .close-emoji {
        font-size: 16px;
    }
    
    .mime-stage {
        text-align: center;
        margin: 30px 0;
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        position: relative;
    }
    
    .mime-character {
        display: inline-block;
        font-size: 60px;
        line-height: 1;
    }
    
    .mime-face {
        margin-bottom: 10px;
    }
    
    .mime-hands {
        font-size: 40px;
    }
    
    .mime-message {
        margin-top: 20px;
        font-size: 24px;
        letter-spacing: 5px;
        transition: opacity 0.3s;
    }
    
    .invisible-wall {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        pointer-events: none;
    }
    
    .wall-touch-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        border: 3px dashed rgba(255, 255, 255, 0.5);
        border-radius: 50%;
    }
    
    .gesture-sequence {
        margin: 20px 0;
        padding: 15px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #666;
        text-align: center;
    }
    
    .gesture-sequence p {
        margin: 0 0 10px 0;
        color: var(--neon-green);
        font-size: 14px;
    }
    
    .sequence-display {
        font-size: 30px;
        letter-spacing: 10px;
        min-height: 40px;
    }
    
    .sequence-emoji {
        display: inline-block;
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .player-gestures {
        margin: 20px 0;
    }
    
    .player-gestures p {
        color: var(--neon-green);
        margin-bottom: 10px;
        font-size: 14px;
    }
    
    .gesture-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 10px;
    }
    
    .gesture-btn {
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        padding: 10px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    
    .gesture-btn:hover {
        background: rgba(0, 255, 0, 0.3);
        transform: scale(1.05);
    }
    
    .gesture-emoji {
        font-size: 24px;
    }
    
    .gesture-name {
        font-size: 11px;
    }
    
    .mime-theater {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
    }
    
    .audience-reaction {
        font-size: 30px;
        letter-spacing: 5px;
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
document.head.appendChild(mimeStyle);