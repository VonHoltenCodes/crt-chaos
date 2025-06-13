# CSS Architecture & Design System

This directory contains the styling for NEONpulseTechshop's cyberpunk-themed interface.

## Directory Structure

```
css/
├── style.css           # Main stylesheet with imports
├── crt.css            # CRT monitor effects
├── cart.css           # Shopping cart styles
├── admin.css          # Admin panel styling
├── back-to-top.css    # Back-to-top button
└── calendar/
    └── calendar.css   # Calendar widget styles
```

## CSS Architecture

### Import Hierarchy (style.css)
```css
@import url('crt.css');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Roboto:wght@300;400;700&display=swap');
```

### Design System

#### Color Palette
```css
:root {
    /* Primary Colors */
    --primary-color: #00ff41;      /* Neon green */
    --secondary-color: #ff00ff;    /* Magenta */
    
    /* Background Colors */
    --dark-bg: #0c0c0c;           /* Main background */
    --darker-bg: #131313;         /* Darker sections */
    
    /* Accent Colors */
    --dark-accent: #1a1a1a;       /* Dark gray */
    --light-accent: #3d3d3d;      /* Light gray */
    
    /* Text Colors */
    --text-color: #ffffff;        /* Primary text */
    --text-secondary: #b0b0b0;    /* Secondary text */
    
    /* System Colors */
    --success-color: #00ff41;     /* Success state */
    --danger-color: #ff0040;      /* Error state */
    --warning-color: #ffaa00;     /* Warning state */
}
```

#### Typography
```css
/* Headings */
font-family: 'Share Tech Mono', monospace;

/* Body Text */
font-family: 'Roboto', sans-serif;

/* Font Sizes */
--font-size-base: 16px;
--font-size-large: 1.25rem;
--font-size-small: 0.875rem;
```

#### Spacing System
```css
/* Section Padding */
padding: 60px 0;

/* Container */
max-width: 1280px;
margin: 0 auto;
padding: 0 20px;

/* Grid Gaps */
gap: 30px;  /* Standard */
gap: 20px;  /* Compact */
```

## Visual Effects

### CRT Monitor Effects (crt.css)
1. **Grid Overlay** - Simulates monitor pixels
2. **Scanlines** - Horizontal lines animation
3. **Curve** - Screen edge distortion
4. **Flicker** - Random brightness variation
5. **Glow** - Neon color bleeding

### Animations
```css
/* Neon Glow */
text-shadow: 
    0 0 10px var(--primary-color),
    0 0 20px var(--primary-color),
    0 0 30px var(--primary-color);

/* Hover Effects */
transition: all 0.3s ease;
transform: translateY(-10px);

/* Pulse Animation */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
```

## Component Patterns

### Buttons
```css
.btn {
    padding: 15px 30px;
    background-color: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    transition: all 0.3s ease;
}

.btn:hover {
    background-color: var(--primary-color);
    color: #000;
    box-shadow: 0 5px 15px rgba(0, 255, 65, 0.5);
}
```

### Cards
```css
.service-card {
    background-color: var(--light-accent);
    border-radius: 8px;
    padding: 30px;
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}
```

### Forms
```css
.form-control {
    background-color: var(--dark-accent);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    padding: 12px 15px;
}

.form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 5px rgba(0, 255, 65, 0.3);
}
```

## Responsive Design

### Breakpoints
```css
/* Desktop First Approach */
@media (max-width: 1200px) { /* Large */}
@media (max-width: 992px)  { /* Medium */}
@media (max-width: 768px)  { /* Small */}
@media (max-width: 576px)  { /* Extra Small */}
```

### Common Patterns
```css
/* Desktop Grid → Mobile Stack */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
    }
}
```

## Performance Considerations

1. **CSS Variables** - Dynamic theming without JavaScript
2. **Import Strategy** - Modular CSS files for maintainability
3. **Animation Performance** - Using transform/opacity for smooth 60fps
4. **Specificity Control** - BEM-like naming to avoid !important
5. **Critical CSS** - Main styles loaded first

## Theming Architecture

### Admin Theme (admin.css)
```css
/* Dark theme for admin panel */
--admin-primary: #00ff41;
--admin-bg: #0a0a0a;
--admin-sidebar: #151515;
```

### Cart Styles (cart.css)
```css
/* Cart-specific components */
.cart-count {
    background-color: var(--secondary-color);
    color: #000;
    animation: pulse 1s infinite;
}
```

## Future Enhancements

1. CSS custom properties for dynamic theming
2. CSS Grid for more complex layouts
3. CSS containment for performance
4. Variable font implementation
5. Dark/light theme toggle
6. Print stylesheet
7. Reduced motion preferences

## Development Guidelines

1. Use CSS variables for all colors
2. Mobile-first responsive design
3. Semantic class naming
4. Avoid inline styles
5. Group related properties
6. Comment complex calculations
7. Test across browsers