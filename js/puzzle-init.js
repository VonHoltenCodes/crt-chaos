/**
 * Puzzle initialization helper
 * Ensures puzzles are available as soon as possible
 */

// Track which puzzles have been initialized
window.puzzlesInitialized = window.puzzlesInitialized || new Set();

// Helper function to initialize a puzzle
window.initializePuzzle = function(puzzleName, PuzzleClass) {
    if (window.puzzlesInitialized.has(puzzleName)) {
        console.log(`[PUZZLE INIT] ${puzzleName} already initialized`);
        return;
    }
    
    console.log(`[PUZZLE INIT] Initializing ${puzzleName}...`);
    
    try {
        // Create the puzzle instance
        const instance = new PuzzleClass();
        
        // Make it globally available
        const globalName = puzzleName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        window[globalName] = instance;
        
        // Register with chaos engine if available
        if (window.chaos) {
            window.chaos.registerPuzzle(puzzleName, instance);
            console.log(`[PUZZLE INIT] ${puzzleName} registered with chaos engine`);
        } else {
            // Try again in a moment
            setTimeout(() => {
                if (window.chaos) {
                    window.chaos.registerPuzzle(puzzleName, instance);
                    console.log(`[PUZZLE INIT] ${puzzleName} registered with chaos engine (delayed)`);
                }
            }, 100);
        }
        
        window.puzzlesInitialized.add(puzzleName);
    } catch (error) {
        console.error(`[PUZZLE INIT] Failed to initialize ${puzzleName}:`, error);
    }
};

// Force initialize all puzzles if they're not ready
window.forceInitializePuzzles = function() {
    console.log('[PUZZLE INIT] Force initializing all puzzles...');
    
    const puzzleMap = {
        'sentient-terminal': window.SentientTerminal,
        'paranoid-password': window.ParanoidPassword,
        'time-clock': window.TimeTravelingClock,
        'drunk-nav': window.DrunkNavigation,
        'conspiracy-search': window.ConspiracySearch,
        'existential-error': window.ExistentialError,
        'mime-modal': window.MimeModal,
        'iframe-maze': window.IframeMaze
    };
    
    for (const [puzzleName, PuzzleClass] of Object.entries(puzzleMap)) {
        if (PuzzleClass && !window.puzzlesInitialized.has(puzzleName)) {
            initializePuzzle(puzzleName, PuzzleClass);
        }
    }
};

// Check puzzles periodically in case they're slow to load
let checkCount = 0;
const checkInterval = setInterval(() => {
    checkCount++;
    if (checkCount > 10) {
        clearInterval(checkInterval);
        return;
    }
    
    // If chaos engine exists but puzzles aren't all registered, force init
    if (window.chaos && window.chaos.activePuzzles.size < 8) {
        console.log(`[PUZZLE INIT] Only ${window.chaos.activePuzzles.size} puzzles registered, checking...`);
        forceInitializePuzzles();
    }
}, 500);