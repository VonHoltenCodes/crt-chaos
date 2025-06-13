# JavaScript Module Architecture

This directory contains the JavaScript modules that power NEONpulseTechshop's functionality.

## Directory Structure

```
js/
├── main.js                  # Core site functionality
├── back-to-top.js          # Back-to-top button behavior
├── calendar/               # Appointment booking system
│   ├── calendar.js         # Core calendar functionality
│   ├── calendar-ui.js      # Calendar UI components
│   ├── checkout-calendar.js # Checkout integration
│   └── contact-calendar.js  # Contact page calendar
├── cart/                   # Shopping cart system
│   └── cart.js             # Cart management (ShoppingCart class)
├── admin/                  # Admin panel functionality
│   ├── auth.js             # Authentication system
│   └── dashboard.js        # Dashboard components
└── data/                   # Data schemas and mock data
    ├── products.js         # Product catalog data
    ├── inventory.js        # Inventory management
    └── orders.js           # Order processing data
```

## Module Overview

### main.js
Core site functionality including:
- Mobile menu toggle
- Header scroll behavior
- Animation effects on scroll
- Utility functions for site-wide features

### cart/cart.js
Shopping cart implementation with ShoppingCart class:
- Add/remove items
- Update quantities
- Apply discount codes (WELCOME10, SUMMER25, VINTAGE15)
- Calculate totals with tax (7.25%)
- LocalStorage persistence
- Special pickup fee handling

### calendar/
Appointment booking system:
- `calendar.js`: Core booking logic and data management
- `calendar-ui.js`: UI components and interactions
- `checkout-calendar.js`: Integration with checkout flow
- `contact-calendar.js`: Contact page specific implementation

### admin/
Admin panel functionality:
- `auth.js`: Simple authentication (demo credentials: traxx/G@laxy19)
- `dashboard.js`: Dashboard metrics and management

### data/
Mock data and schemas:
- `products.js`: Product catalog with detailed specifications
- `inventory.js`: Stock levels and SKU management
- `orders.js`: Order history and processing

## Data Flow

```
LocalStorage                SessionStorage
    ↓                           ↓
ShoppingCart ←→ Checkout → Payment Gateway
    ↓                           ↓
Calendar   ←→   Admin   ←→   Orders
    ↓                           ↓
ContactForm              ProductCatalog
```

## Storage Strategy

### LocalStorage
- Shopping cart (`neonpulse_cart`)
- Calendar appointments (`neonpulse_appointments`)
- Admin session (`adminUser`, `isLoggedIn`)
- Orders (`neonpulseOrders`)

### SessionStorage
- Checkout progress (`checkoutData`)
- Delivery method selection
- Temporary payment information

## Integration Points

1. **Cart → Checkout**: Cart data passed to checkout process
2. **Calendar → Contact**: Service booking integration
3. **Admin → Orders**: Order management interface
4. **Products → Cart**: Product addition to cart
5. **Inventory → Admin**: Stock level management

## Security Considerations

- Authentication is client-side (demo only)
- No sensitive data in LocalStorage
- Payment info in SessionStorage only
- Input validation required
- XSS prevention needed

## Future Enhancements

- Server-side authentication for admin
- Real payment gateway integration
- WebSocket for real-time updates
- Service worker for offline functionality
- React/Vue migration for better state management

## Development Guidelines

1. Use ES6+ features consistently
2. Implement error handling for all API calls
3. Validate user input before processing
4. Clear sensitive data from storage after use
5. Comment complex business logic
6. Follow existing naming conventions
7. Test cross-browser compatibility