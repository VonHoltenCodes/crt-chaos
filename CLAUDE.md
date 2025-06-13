# CRT Chaos - Development Guidelines

## Project Overview
CRT Chaos is an interactive puzzle game featuring 8 unique challenges with a retro CRT monitor aesthetic. The game uses vanilla JavaScript with LocalStorage for progress persistence.

## Code Quality Commands

### Linting and Type Checking
Since this is a vanilla JavaScript project without a build system, use these commands to ensure code quality:

```bash
# Check for JavaScript syntax errors using Node.js
node -c js/*.js js/puzzles/*.js

# Use jshint for linting (if installed)
# npm install -g jshint
jshint js/*.js js/puzzles/*.js

# Use eslint for more comprehensive linting (if installed)
# npm install -g eslint
eslint js/*.js js/puzzles/*.js
```

### Security Headers
The following security headers have been added to index.html:
- Content Security Policy (CSP)
- Referrer Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### Console Logging
All `console.log` statements have been replaced with `safeConsole.log` which respects the DEBUG_MODE flag in chaos-core.js. Set DEBUG_MODE to false for production.

## Project Structure
```
crt-chaos/
├── index.html          # Main HTML file with security headers
├── css/
│   └── chaos.css      # All styles including CRT effects
├── js/
│   ├── chaos-core.js  # Core engine with safeConsole wrapper
│   └── puzzles/       # Individual puzzle implementations
├── assets/            # Images and future sound files
└── server.py         # Simple Python HTTP server
```

## Key Features Implemented
1. Safe console logging with DEBUG_MODE toggle
2. Security headers in index.html
3. SEO and social media meta tags
4. Progress persistence with LocalStorage
5. Chaos level management system
6. CRT visual effects and glitches

## Development Best Practices
1. Always use safeConsole instead of console for logging
2. Set DEBUG_MODE = false before deploying to production
3. Test all puzzles after making changes
4. Validate HTML and CSS for errors
5. Check browser console for any runtime errors
6. Test LocalStorage functionality across browsers

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (tested back-to-top scrolling)
- Mobile: Responsive design implemented

## Security Considerations
- CSP policy restricts inline scripts and external resources
- All user inputs in puzzles are validated
- No external dependencies or CDNs used
- LocalStorage used only for game progress (no sensitive data)

## Future Enhancements
- Add sound effects (assets/sounds/ directory prepared)
- Implement achievement system
- Add more puzzle types
- Create difficulty levels
- Add multiplayer/leaderboard features