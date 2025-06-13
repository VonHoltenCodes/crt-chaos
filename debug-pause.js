// Debug script for testing pause functionality
// To use: paste this into browser console after loading the Time Clock puzzle

function debugPause() {
    console.log('=== PAUSE DEBUG TEST ===');
    
    if (!window.timeClock) {
        console.error('Time Clock not loaded!');
        return;
    }
    
    console.log('Initial state:');
    Object.keys(window.timeClock.timeStreams).forEach(stream => {
        console.log(`${stream}: speed=${window.timeClock.timeStreams[stream].speed}`);
    });
    
    // Test toggling each stream
    ['unix', 'binary', 'hex', 'roman', 'mayan'].forEach(stream => {
        console.log(`\nTesting ${stream} pause...`);
        const beforeSpeed = window.timeClock.timeStreams[stream].speed;
        window.timeClock.toggleSpeed(stream);
        const afterSpeed = window.timeClock.timeStreams[stream].speed;
        console.log(`${stream}: ${beforeSpeed} -> ${afterSpeed}`);
        
        // Check visual state
        const display = document.getElementById(`${stream}-display`);
        const button = document.getElementById(`pause-${stream}`);
        console.log(`Display has paused class: ${display?.classList.contains('paused')}`);
        console.log(`Button text: ${button?.textContent}`);
    });
    
    console.log('\n=== TEST COMPLETE ===');
}

// Run the test
debugPause();

// Monitor offset changes
let lastOffsets = {};
setInterval(() => {
    let changed = false;
    Object.keys(window.timeClock.timeStreams).forEach(stream => {
        const current = window.timeClock.timeStreams[stream].offset;
        if (lastOffsets[stream] !== current) {
            changed = true;
            console.log(`${stream} offset changed: ${lastOffsets[stream]} -> ${current} (speed: ${window.timeClock.timeStreams[stream].speed})`);
        }
        lastOffsets[stream] = current;
    });
    if (changed) console.log('---');
}, 1000);