# CRT Chaos Sound Effects

This directory contains sound effects for the CRT Chaos game. Currently, placeholder (silent) MP3 files are included to prevent 404 errors.

## Sound Files Needed

- **glitch.mp3** - Digital glitch/corruption sound (already exists)
- **error.mp3** - Error beep or buzz (already exists)
- **success.mp3** - Success chime or completion sound (already exists)
- **typing.mp3** - Mechanical keyboard typing sound (already exists)
- **beep.mp3** - Simple beep for UI interactions (placeholder)
- **power-on.mp3** - CRT monitor power on sound (placeholder)
- **power-off.mp3** - CRT monitor power off sound (placeholder)
- **static.mp3** - TV static/white noise (placeholder)

## Free Sound Resources

### 1. Freesound.org
- Create free account
- Search for: "glitch", "computer error", "retro beep", "CRT", "static"
- Most sounds are CC licensed (attribution required)

### 2. Zapsplat.com
- Free account = free downloads
- No attribution required for free account
- Great selection of tech/sci-fi sounds

### 3. Generated Sounds
- Use `generate-sounds.html` in the project root
- Creates basic synthesized sounds using Web Audio API
- Good for simple beeps and glitches

### 4. SFXR/BFXR
- [sfxr.me](https://sfxr.me/) - Online retro sound generator
- [Bfxr](https://www.bfxr.net/) - Enhanced version
- Perfect for 8-bit style effects

## Recommended Sound Profiles

### Glitch Sound
- Duration: 0.1-0.3 seconds
- Character: Digital corruption, bit crushing, static burst
- Keywords: "digital glitch", "data corruption", "bit error"

### Error Sound
- Duration: 0.3-0.5 seconds
- Character: Descending tone, buzzer, warning beep
- Keywords: "error beep", "warning sound", "computer error"

### Success Sound
- Duration: 0.5-1.0 seconds
- Character: Ascending chime, positive tone, completion fanfare
- Keywords: "success chime", "level complete", "achievement"

### Static Sound
- Duration: 1-2 seconds (loopable)
- Character: White noise, TV static, analog interference
- Keywords: "tv static", "white noise", "analog static"

## Implementation

The audio is managed by `js/audio-manager.js` which provides:
- Volume control
- Enable/disable toggle
- Preloading of all sounds
- Methods for playing each sound type

## Adding New Sounds

1. Replace placeholder files with actual sound effects
2. Keep file sizes small (< 100KB per sound)
3. Use MP3 format for compatibility
4. Test on multiple browsers
5. Consider adding OGG versions for better browser support

## Audio Credits

When using sounds from free resources, add attribution here:

```
Example:
- glitch.mp3: "Digital Glitch 01" by username (freesound.org) - CC BY 3.0
```