/**
 * Drunk Navigation Menu Puzzle
 * A navigation menu where all the links are intoxicated
 */

class DrunkNavigation {
    constructor() {
        this.puzzleId = 'drunk-nav';
        this.isActive = false;
        this.drunkLevel = 10; // How drunk the menu is (0-10)
        this.clickAttempts = 0;
        this.missClicks = 0;
        this.solved = false;
        this.sobrietyTestVisible = false;
        this.consecutiveMisses = 0;
        this.teleportEnabled = true;
        this.mirageTimer = null;
        this.drunkVisionEnabled = true;
        
        this.menuItems = [
            { text: 'Home', href: '#home', correct: false, decoy: false },
            { text: 'About', href: '#about', correct: false, decoy: false },
            { text: 'Services', href: '#services', correct: false, decoy: false },
            { text: 'Contact', href: '#contact', correct: false, decoy: false },
            { text: 'Sobriety Test', href: '#sobriety', correct: true, decoy: false }, // The goal
            { text: 'Portfolio', href: '#portfolio', correct: false, decoy: false },
            { text: 'Blog', href: '#blog', correct: false, decoy: false },
            { text: 'Sobriety Fest', href: '#fake1', correct: false, decoy: true }, // Decoy!
            { text: 'Sanity Test', href: '#fake2', correct: false, decoy: true }, // Decoy!
            { text: 'Society Test', href: '#fake3', correct: false, decoy: true } // Decoy!
        ];
        
        this.drunkPhrases = [
            "I'm perfectly shober... I mean sober!",
            "These buttonsss keep moooving...",
            "Hic! Did you see that? The menu just winked at me!",
            "I swear the links are dancing...",
            "One more click and I'll get it... *hic*",
            "Why is everything so wobbly?",
            "I can quit clicking anytime I want!",
            "The navigation is spinning... or is it me?",
            "These links are playing hard to get!",
            "Was that the right one? They all look the same...",
            "I think the menu is mocking me!",
            "Stop teleporting away from me!",
            "Why are there THREE of everything?!"
        ];
        
        this.swayIntervals = [];
        this.mirageIntervals = [];
        this.currentMirages = [];
    }
    
    createDrunkModal() {
        safeConsole.log('Creating drunk navigation modal...');
        
        if (document.getElementById('drunk-nav-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'puzzle-modal';
        modal.id = 'drunk-nav-modal';
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
                <div class="terminal-container drunk-nav-container">
                    <div class="terminal-header">
                        <span class="terminal-title">NAVIGATION.EXE - BAC Level: <span id="drunk-level">0.08%</span></span>
                        <div class="terminal-controls">
                            <span class="terminal-control close" onclick="window.drunkNav.close()"></span>
                            <span class="terminal-control minimize"></span>
                            <span class="terminal-control maximize"></span>
                        </div>
                    </div>
                    <div class="terminal-body">
                        <div class="drunk-warning">
                            <p>⚠️ WARNING: Navigation system has been drinking!</p>
                            <p>Click on "Sobriety Test" to restore normal function.</p>
                        </div>
                        
                        <nav class="drunk-navigation" id="drunk-navigation">
                            <ul class="drunk-menu" id="drunk-menu">
                                <!-- Menu items will be added here -->
                            </ul>
                        </nav>
                        
                        <div class="drunk-status">
                            <div class="drunk-meter">
                                <span>Intoxication Level:</span>
                                <div class="drunk-bar">
                                    <div class="drunk-fill" id="drunk-fill" style="width: 100%"></div>
                                </div>
                            </div>
                            <p>Click Accuracy: <span id="accuracy">0%</span></p>
                            <p>Misclicks: <span id="missclicks">0</span></p>
                        </div>
                        
                        <div class="drunk-messages" id="drunk-messages"></div>
                        
                        <div class="puzzle-hint">
                            <p>Hint: The Sobriety Test is hidden at first! Click around to prove your determination. Beware of decoys and mirages!</p>
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
        safeConsole.log('Drunk Navigation activate() called');
        
        if (!document.getElementById('drunk-nav-modal')) {
            this.createDrunkModal();
        }
        
        this.isActive = true;
        this.solved = false;
        this.clickAttempts = 0;
        this.missClicks = 0;
        this.consecutiveMisses = 0;
        this.drunkLevel = 10;
        this.sobrietyTestVisible = false;
        this.teleportEnabled = true;
        this.drunkVisionEnabled = true;
        
        const modal = document.getElementById('drunk-nav-modal');
        modal.style.display = 'flex';
        
        this.populateMenu();
        this.startDrunkAnimation();
        this.updateDrunkMeter();
        
        this.addMessage("*hic* Welcome to the drunk navigation system!", 'drunk');
        this.addMessage("Warning: Sobriety Test only appears after proving your determination!", 'drunk');
        
        // Make hamburger menu drunk too
        this.makeHamburgerDrunk();
        
        // Start the new difficulty features
        this.startMirageEffect();
        this.startDrunkVision();
        this.hideCorrectButton();
    }
    
    populateMenu() {
        const menuContainer = document.getElementById('drunk-menu');
        menuContainer.innerHTML = '';
        
        this.menuItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'drunk-menu-item';
            li.innerHTML = `<a href="${item.href}" class="drunk-link" data-index="${index}">${item.text}</a>`;
            
            // Add dropdown to some items
            if (Math.random() > 0.6 && !item.correct) {
                const dropdown = document.createElement('ul');
                dropdown.className = 'drunk-dropdown';
                dropdown.innerHTML = `
                    <li><a href="#" class="drunk-sublink">Submenu 1</a></li>
                    <li><a href="#" class="drunk-sublink">Submenu 2</a></li>
                    <li><a href="#" class="drunk-sublink">*hic*</a></li>
                `;
                li.appendChild(dropdown);
            }
            
            menuContainer.appendChild(li);
        });
        
        // Add click handlers
        document.querySelectorAll('.drunk-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleMenuClick(e));
        });
        
        // Track misclicks
        document.getElementById('drunk-navigation').addEventListener('click', (e) => {
            if (!e.target.classList.contains('drunk-link')) {
                this.missClicks++;
                this.updateAccuracy();
                this.showMissClickEffect(e.clientX, e.clientY);
            }
        });
    }
    
    startDrunkAnimation() {
        const menuItems = document.querySelectorAll('.drunk-menu-item');
        
        menuItems.forEach((item, index) => {
            // Random sway parameters for each item
            const swayAmount = 15 + Math.random() * 30; // Increased!
            const swaySpeed = 1.5 + Math.random() * 2.5; // Faster!
            const rotateAmount = 10 + Math.random() * 20; // More rotation!
            
            // Apply drunk animation
            item.style.animation = `drunkSway ${swaySpeed}s ease-in-out infinite`;
            item.style.animationDelay = `${index * 0.2}s`;
            
            // Add teleportation on hover for some items
            const link = item.querySelector('.drunk-link');
            if (link && Math.random() > 0.3) {
                this.teleportOnHover(link);
            }
            
            // Make click targets move more erratically
            const interval = setInterval(() => {
                if (!this.isActive) return;
                
                const link = item.querySelector('.drunk-link');
                if (link && this.drunkLevel > 0) {
                    const offsetX = (Math.random() - 0.5) * swayAmount * (this.drunkLevel / 10);
                    const offsetY = (Math.random() - 0.5) * swayAmount * (this.drunkLevel / 10);
                    const rotation = (Math.random() - 0.5) * rotateAmount;
                    link.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
                    
                    // Random scale changes
                    if (Math.random() > 0.9) {
                        link.style.transform += ` scale(${0.8 + Math.random() * 0.4})`;
                    }
                }
            }, 100);
            
            this.swayIntervals.push(interval);
        });
        
        // Make dropdowns fall upward and sideways
        document.querySelectorAll('.drunk-dropdown').forEach(dropdown => {
            dropdown.style.bottom = '100%';
            dropdown.style.top = 'auto';
            dropdown.style.transform = `rotate(${Math.random() * 360}deg)`;
        });
    }
    
    makeHamburgerDrunk() {
        // Create a fake hamburger menu that tries to escape
        const hamburger = document.createElement('div');
        hamburger.className = 'drunk-hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 30px;
            cursor: pointer;
            color: var(--neon-green);
            transition: all 0.3s;
        `;
        
        document.querySelector('.drunk-nav-container').appendChild(hamburger);
        
        hamburger.addEventListener('mouseenter', () => {
            // Run away from cursor
            const newX = Math.random() * (window.innerWidth - 100);
            const newY = Math.random() * 200;
            hamburger.style.transform = `translate(${newX}px, ${newY}px)`;
            this.addMessage("Hehe, can't catch me!", 'drunk');
        });
    }
    
    handleMenuClick(e) {
        e.preventDefault();
        this.clickAttempts++;
        
        const index = parseInt(e.target.dataset.index);
        const item = this.menuItems[index];
        
        if (item.correct && this.sobrietyTestVisible) {
            // Clicked on the real Sobriety Test!
            this.consecutiveMisses = 0;
            this.startSobrietyTest();
        } else if (item.decoy) {
            // Clicked on a decoy!
            this.missClicks++;
            this.consecutiveMisses++;
            this.addMessage("WRONG! That's a decoy! The menu laughs at you!", 'drunk');
            this.addMessage("Sobriety Fest? Really? You fell for that?", 'drunk');
            
            // Punish with extra drunk effect
            this.drunkLevel = Math.min(10, this.drunkLevel + 1);
            this.updateDrunkMeter();
            this.triggerDrunkEffect();
            this.triggerDrunkEffect(); // Double punishment!
        } else {
            // Wrong item
            this.consecutiveMisses++;
            const phrase = this.drunkPhrases[Math.floor(Math.random() * this.drunkPhrases.length)];
            this.addMessage(phrase, 'drunk');
            
            // Check if we should reveal the real button
            if (this.clickAttempts >= 10 && !this.sobrietyTestVisible) {
                this.addMessage("Your determination is noted...", 'success');
                this.revealSobrietyTest();
            }
            
            // Make things worse
            if (this.drunkLevel < 10) {
                this.drunkLevel = Math.min(10, this.drunkLevel + 0.5);
                this.updateDrunkMeter();
            }
            
            // Random effect
            this.triggerDrunkEffect();
        }
        
        // Extra punishment for too many consecutive misses
        if (this.consecutiveMisses >= 5) {
            this.addMessage("The menu is getting angry at your incompetence!", 'drunk');
            this.spinMenu();
            this.consecutiveMisses = 0;
        }
        
        this.updateAccuracy();
    }
    
    startSobrietyTest() {
        this.addMessage("Initializing sobriety test...", 'success');
        
        // Gradually sober up
        const soberInterval = setInterval(() => {
            this.drunkLevel = Math.max(0, this.drunkLevel - 1);
            this.updateDrunkMeter();
            
            if (this.drunkLevel === 0) {
                clearInterval(soberInterval);
                this.solve();
            }
        }, 300);
    }
    
    triggerDrunkEffect() {
        const effects = [
            () => this.spinMenu(),
            () => this.duplicateMenuItems(),
            () => this.invertColors(),
            () => this.blurVision(),
            () => this.hiccup()
        ];
        
        const effect = effects[Math.floor(Math.random() * effects.length)];
        effect();
    }
    
    spinMenu() {
        const nav = document.getElementById('drunk-navigation');
        nav.style.animation = 'drunkSpin 2s ease-in-out';
        setTimeout(() => {
            nav.style.animation = '';
        }, 2000);
    }
    
    duplicateMenuItems() {
        this.addMessage("Seeing double!", 'drunk');
        const items = document.querySelectorAll('.drunk-menu-item');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.style.opacity = '0.5';
            clone.style.position = 'absolute';
            clone.style.left = Math.random() * 100 + '%';
            item.appendChild(clone);
            
            setTimeout(() => clone.remove(), 2000);
        });
    }
    
    invertColors() {
        const container = document.querySelector('.drunk-nav-container');
        container.style.filter = 'invert(1)';
        setTimeout(() => {
            container.style.filter = '';
        }, 1000);
    }
    
    blurVision() {
        this.addMessage("Everything's so blurry...", 'drunk');
        const modal = document.getElementById('drunk-nav-modal');
        modal.style.filter = 'blur(3px)';
        setTimeout(() => {
            modal.style.filter = '';
        }, 1500);
    }
    
    hiccup() {
        this.addMessage("*HIC!*", 'drunk');
        const container = document.querySelector('.drunk-nav-container');
        container.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            container.style.transform = 'translateY(0)';
        }, 200);
    }
    
    showMissClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'miss-click-effect';
        effect.textContent = 'MISS!';
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: #ff0000;
            font-weight: bold;
            pointer-events: none;
            animation: missClickFade 1s ease-out forwards;
            z-index: 10001;
        `;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }
    
    updateDrunkMeter() {
        const fillPercent = (this.drunkLevel / 10) * 100;
        document.getElementById('drunk-fill').style.width = fillPercent + '%';
        
        const bacLevel = (0.08 * (this.drunkLevel / 10)).toFixed(3);
        document.getElementById('drunk-level').textContent = `${bacLevel}%`;
        
        // Update visual drunk effects based on level
        const container = document.querySelector('.drunk-nav-container');
        if (this.drunkLevel > 7) {
            container.classList.add('very-drunk');
        } else if (this.drunkLevel > 4) {
            container.classList.add('moderately-drunk');
        } else {
            container.classList.remove('very-drunk', 'moderately-drunk');
        }
    }
    
    updateAccuracy() {
        const accuracy = this.clickAttempts > 0 
            ? Math.round(((this.clickAttempts - this.missClicks) / this.clickAttempts) * 100)
            : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        document.getElementById('missclicks').textContent = this.missClicks;
    }
    
    addMessage(text, type = 'normal') {
        const messagesDiv = document.getElementById('drunk-messages');
        const msg = document.createElement('p');
        msg.className = `drunk-msg drunk-msg-${type}`;
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Keep only last 5 messages
        while (messagesDiv.children.length > 5) {
            messagesDiv.removeChild(messagesDiv.firstChild);
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => msg.remove(), 5000);
    }
    
    solve() {
        this.solved = true;
        this.addMessage("Navigation system sobered up!", 'success');
        this.addMessage("All menu items are now stable.", 'success');
        
        // Stop all animations
        this.swayIntervals.forEach(interval => clearInterval(interval));
        document.querySelectorAll('.drunk-menu-item').forEach(item => {
            item.style.animation = 'none';
            item.querySelector('.drunk-link').style.transform = 'none';
        });
        
        setTimeout(() => {
            window.chaos.puzzleSolved('drunk-nav');
            const statusElement = document.getElementById('status-drunk-nav');
            if (statusElement) {
                statusElement.classList.remove('unsolved');
                statusElement.classList.add('solved');
            } else {
                console.error('Status element not found for drunk-nav');
            }
            
            // Auto-close removed for consistent user experience
        }, 1500);
    }
    
    close() {
        this.isActive = false;
        this.swayIntervals.forEach(interval => clearInterval(interval));
        this.mirageIntervals.forEach(interval => clearInterval(interval));
        if (this.mirageTimer) clearInterval(this.mirageTimer);
        this.currentMirages.forEach(mirage => mirage.remove());
        this.currentMirages = [];
        document.getElementById('drunk-nav-modal').style.display = 'none';
    }
    
    // New difficulty methods
    hideCorrectButton() {
        // Initially hide the real Sobriety Test button
        const correctItem = this.menuItems.find(item => item.correct);
        const correctLink = document.querySelector(`[data-index="${this.menuItems.indexOf(correctItem)}"]`);
        if (correctLink && correctLink.parentElement) {
            correctLink.parentElement.style.display = 'none';
        }
    }
    
    revealSobrietyTest() {
        if (this.sobrietyTestVisible) return;
        
        this.sobrietyTestVisible = true;
        const correctItem = this.menuItems.find(item => item.correct);
        const correctLink = document.querySelector(`[data-index="${this.menuItems.indexOf(correctItem)}"]`);
        
        if (correctLink && correctLink.parentElement) {
            this.addMessage("The real Sobriety Test materializes!", 'success');
            correctLink.parentElement.style.display = 'block';
            correctLink.parentElement.style.animation = 'sobrietyReveal 2s ease-in-out';
            
            // Make it extra wobbly when it appears
            correctLink.style.animation = 'extremeWobble 1s ease-in-out infinite';
        }
    }
    
    startMirageEffect() {
        // Create fake duplicates that disappear when clicked
        this.mirageTimer = setInterval(() => {
            if (!this.isActive || this.drunkLevel < 5) return;
            
            this.createMirage();
        }, 3000);
    }
    
    createMirage() {
        const menuItems = document.querySelectorAll('.drunk-menu-item');
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        
        if (!randomItem) return;
        
        const mirage = randomItem.cloneNode(true);
        mirage.className = 'drunk-menu-item mirage';
        mirage.style.position = 'absolute';
        mirage.style.left = Math.random() * 80 + '%';
        mirage.style.top = Math.random() * 80 + '%';
        mirage.style.opacity = '0.7';
        mirage.style.filter = 'blur(1px)';
        
        // Make mirage disappear on click
        const mirageLink = mirage.querySelector('.drunk-link');
        if (mirageLink) {
            mirageLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.addMessage("That was just a mirage! *poof*", 'drunk');
                mirage.style.animation = 'mirageFade 0.5s ease-out';
                setTimeout(() => mirage.remove(), 500);
                this.missClicks++;
                this.consecutiveMisses++;
                this.updateAccuracy();
            });
        }
        
        document.getElementById('drunk-navigation').appendChild(mirage);
        this.currentMirages.push(mirage);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (mirage.parentElement) {
                mirage.style.animation = 'mirageFade 1s ease-out';
                setTimeout(() => mirage.remove(), 1000);
            }
        }, 5000);
    }
    
    startDrunkVision() {
        // Periodically add visual impairments
        setInterval(() => {
            if (!this.isActive || !this.drunkVisionEnabled) return;
            
            const effects = [
                () => this.doubleVision(),
                () => this.tunnelVision(),
                () => this.colorBlindness(),
                () => this.pixelateVision()
            ];
            
            if (this.drunkLevel > 7) {
                const effect = effects[Math.floor(Math.random() * effects.length)];
                effect();
            }
        }, 4000);
    }
    
    doubleVision() {
        this.addMessage("Seeing double!", 'drunk');
        const container = document.querySelector('.drunk-nav-container');
        container.style.filter = 'blur(2px)';
        container.style.textShadow = '3px 3px 5px rgba(0,255,0,0.5)';
        
        setTimeout(() => {
            container.style.filter = '';
            container.style.textShadow = '';
        }, 2000);
    }
    
    tunnelVision() {
        this.addMessage("Tunnel vision kicking in...", 'drunk');
        const modal = document.getElementById('drunk-nav-modal');
        modal.style.boxShadow = 'inset 0 0 200px 100px black';
        
        setTimeout(() => {
            modal.style.boxShadow = '';
        }, 3000);
    }
    
    colorBlindness() {
        this.addMessage("Colors look weird...", 'drunk');
        const container = document.querySelector('.drunk-nav-container');
        container.style.filter = 'grayscale(80%)';
        
        setTimeout(() => {
            container.style.filter = '';
        }, 2500);
    }
    
    pixelateVision() {
        this.addMessage("Everything's so pixelated!", 'drunk');
        const container = document.querySelector('.drunk-nav-container');
        container.style.imageRendering = 'pixelated';
        container.style.filter = 'contrast(200%)';
        
        setTimeout(() => {
            container.style.imageRendering = '';
            container.style.filter = '';
        }, 2000);
    }
    
    teleportOnHover(element) {
        if (!this.teleportEnabled || this.drunkLevel < 8) return;
        
        element.addEventListener('mouseenter', () => {
            if (Math.random() > 0.5) {
                const newX = Math.random() * 60 - 30;
                const newY = Math.random() * 60 - 30;
                element.style.transform = `translate(${newX}px, ${newY}px) rotate(${Math.random() * 360}deg)`;
                this.addMessage("Gotcha! Try again!", 'drunk');
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    safeConsole.log('Initializing Drunk Navigation...');
    window.drunkNav = new DrunkNavigation();
    safeConsole.log('Drunk Navigation instance created:', window.drunkNav);
    
    if (window.chaos) {
        window.chaos.registerPuzzle('drunk-nav', window.drunkNav);
        safeConsole.log('Drunk Navigation registered with chaos engine');
    } else {
        safeConsole.log('Chaos engine not ready for drunk nav, waiting...');
        setTimeout(() => {
            if (window.chaos) {
                window.chaos.registerPuzzle('drunk-nav', window.drunkNav);
                safeConsole.log('Drunk Navigation registered with chaos engine (delayed)');
            }
        }, 500);
    }
});

// Add styles
const drunkNavStyle = document.createElement('style');
drunkNavStyle.textContent = `
    @keyframes drunkSway {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-10px) rotate(-2deg); }
        50% { transform: translateX(10px) rotate(2deg); }
        75% { transform: translateX(-5px) rotate(-1deg); }
    }
    
    @keyframes drunkSpin {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(360deg) scale(0.8); }
        100% { transform: rotate(720deg) scale(1); }
    }
    
    @keyframes missClickFade {
        0% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
        }
        100% { 
            opacity: 0; 
            transform: translateY(-50px) scale(0.5);
        }
    }
    
    .drunk-nav-container {
        max-height: 90vh;
        overflow: hidden;
        position: relative;
    }
    
    .drunk-nav-container .terminal-body {
        max-height: calc(90vh - 60px);
        overflow-y: auto;
        padding: 15px;
    }
    
    .drunk-warning {
        background: rgba(255, 153, 0, 0.1);
        border: 2px solid #ff9900;
        padding: 10px;
        margin-bottom: 20px;
        text-align: center;
        animation: pulse 2s infinite;
    }
    
    .drunk-warning p {
        margin: 5px 0;
        color: #ff9900;
        font-size: 13px;
    }
    
    .drunk-navigation {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid var(--neon-green);
        padding: 20px;
        margin: 20px 0;
        min-height: 300px;
        position: relative;
        overflow: visible;
    }
    
    .drunk-menu {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: space-around;
    }
    
    .drunk-menu-item {
        position: relative;
        transition: all 0.3s;
    }
    
    .drunk-link {
        display: inline-block;
        padding: 10px 20px;
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid var(--neon-green);
        color: var(--neon-green);
        text-decoration: none;
        transition: all 0.3s;
        cursor: pointer;
        white-space: nowrap;
    }
    
    .drunk-link:hover {
        background: rgba(0, 255, 0, 0.3);
        transform: scale(1.1);
    }
    
    .drunk-dropdown {
        position: absolute;
        list-style: none;
        padding: 0;
        margin: 0;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid var(--neon-green);
        min-width: 150px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        transform: rotate(180deg);
    }
    
    .drunk-menu-item:hover .drunk-dropdown {
        opacity: 1;
        pointer-events: auto;
    }
    
    .drunk-sublink {
        display: block;
        padding: 8px 15px;
        color: var(--neon-green);
        text-decoration: none;
        transition: all 0.3s;
    }
    
    .drunk-sublink:hover {
        background: rgba(0, 255, 0, 0.2);
    }
    
    .drunk-status {
        margin: 20px 0;
    }
    
    .drunk-meter {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #ff9900;
        font-size: 13px;
    }
    
    .drunk-bar {
        flex: 1;
        height: 16px;
        background: #0a0a0a;
        border: 1px solid #ff9900;
        position: relative;
    }
    
    .drunk-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #ffff00, #ff9900, #ff0000);
        transition: width 0.5s ease;
    }
    
    .drunk-status p {
        margin: 5px 0;
        font-size: 13px;
        color: var(--neon-yellow);
    }
    
    .drunk-messages {
        margin-top: 10px;
        max-height: 80px;
        overflow-y: auto;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
    }
    
    .drunk-msg {
        margin: 3px 0;
        padding: 3px;
        font-size: 12px;
        font-style: italic;
    }
    
    .drunk-msg-drunk {
        color: #ff9900;
    }
    
    .drunk-msg-success {
        color: #00ff00;
    }
    
    .drunk-msg-normal {
        color: var(--neon-green);
    }
    
    .moderately-drunk {
        animation: slightSway 3s ease-in-out infinite;
    }
    
    .very-drunk {
        animation: heavySway 2s ease-in-out infinite;
    }
    
    @keyframes slightSway {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        50% { transform: translateX(-5px) rotate(-1deg); }
    }
    
    @keyframes heavySway {
        0%, 100% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-10px) rotate(-2deg); }
        75% { transform: translateX(10px) rotate(2deg); }
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
    
    @keyframes sobrietyReveal {
        0% {
            opacity: 0;
            transform: scale(0) rotate(720deg);
        }
        50% {
            opacity: 0.5;
            transform: scale(1.5) rotate(360deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
    
    @keyframes extremeWobble {
        0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
        25% { transform: translateX(-20px) translateY(-10px) rotate(-10deg) scale(1.1); }
        50% { transform: translateX(20px) translateY(10px) rotate(10deg) scale(0.9); }
        75% { transform: translateX(-10px) translateY(5px) rotate(-5deg) scale(1.05); }
        100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
    }
    
    @keyframes mirageFade {
        0% {
            opacity: 0.7;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) rotate(180deg);
        }
    }
    
    .mirage {
        z-index: 999;
        pointer-events: all;
    }
    
    .drunk-menu-item {
        z-index: 1000;
    }
    
    .drunk-link {
        position: relative;
        z-index: 1001;
    }
`;
document.head.appendChild(drunkNavStyle);