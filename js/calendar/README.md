# NEONpulseTechshop Calendar System

A lightweight, vanilla JavaScript calendar system for appointment booking and scheduling.

## Features

- No external dependencies - 100% free to use
- Blocking entire days (for holidays, vacations, etc.)
- Blocking specific time slots for specific dates
- Setting regular business hours by day of week
- Managing booked appointments
- Cyberpunk/retro styled UI matching site aesthetic
- Session storage for checkout flow
- Local storage for admin settings
- Export functionality for easy record keeping

## Files

- **calendar.js**: Core calendar data management system
- **calendar-ui.js**: Reusable UI component for calendar display
- **checkout-calendar.js**: Integration with checkout process
- **contact-calendar.js**: Read-only calendar for contact page

## Admin Interface

The calendar system includes a complete admin interface accessible at `/admin/calendar/` with the following features:

- Calendar view with interactive day/time slot management
- Business hours management by day of week
- View and management of upcoming bookings
- Export options (CSV and iCalendar formats)

## Usage Examples

### Basic Calendar Initialization

```javascript
// Initialize calendar data
const calendar = new AppointmentCalendar();

// Initialize calendar UI
const calendarUI = new CalendarUI('calendar-container', {
    // Options
    readOnly: false,
    showTimeSlots: true,
    onDateSelected: function(date) {
        console.log('Selected date:', date);
    },
    onTimeSelected: function(time) {
        console.log('Selected time:', time);
    }
});
```

### Adding to Contact Page

```javascript
// Initialize read-only calendar for contact page
const contactCalendar = new ContactCalendar('#availability-calendar');
```

### Adding to Checkout Process

```javascript
// Initialize calendar for checkout
const checkoutCalendar = new CheckoutCalendar(
    '#appointment-calendar', 
    '#appointment-summary'
);
```

## Calendar Data Structure

The calendar system uses localStorage to persist the following data structure:

```javascript
{
    // Regular business hours by day of week
    "businessHours": {
        "monday": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        "tuesday": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        "wednesday": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        "thursday": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        "friday": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
        "saturday": ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
        "sunday": [] // Closed
    },
    
    // Completely blocked days (holidays, vacations, etc.)
    "blockedDays": ["2025-07-04", "2025-12-25"],
    
    // Specific time slots blocked on specific days
    "blockedSlots": {
        "2025-06-10": ["13:00", "14:00"],
        "2025-06-11": ["11:00", "15:00"]
    },
    
    // Booked appointments
    "bookedSlots": {
        "2025-06-12": [
            {
                "time": "10:00",
                "customerName": "John Doe",
                "customerEmail": "john@example.com",
                "customerPhone": "123-456-7890",
                "serviceType": "Computer Repair",
                "notes": "Blue desktop PC, won't boot",
                "createdAt": "2025-06-01T12:00:00Z"
            }
        ]
    }
}
```

## API Reference

### AppointmentCalendar Class

Core data management system for calendar.

- `constructor()`: Initialize calendar system
- `loadCalendarData()`: Load calendar data from localStorage
- `saveCalendarData()`: Save calendar data to localStorage
- `resetCalendar()`: Reset calendar to default settings
- `updateBusinessHours(day, hours)`: Update business hours for a day
- `blockDay(date)`: Block entire day
- `unblockDay(date)`: Unblock a day
- `blockTimeSlots(date, slots)`: Block specific time slots
- `unblockTimeSlots(date, slots)`: Unblock time slots
- `addBooking(date, slot, bookingData)`: Add a booking
- `removeBooking(date, slot)`: Remove a booking
- `isDateBlocked(date)`: Check if date is blocked
- `isSlotAvailable(date, slot)`: Check if slot is available
- `getAvailableSlots(date)`: Get all available slots for a date
- `getBookingsInRange(startDate, endDate)`: Get bookings in date range
- `getMonthData(year, month)`: Get calendar data for a month

### CalendarUI Class

Reusable UI component for displaying interactive calendar.

- `constructor(containerId, options)`: Initialize calendar UI
- `render()`: Render calendar UI
- `navigateMonth(direction)`: Navigate to previous/next month
- `navigateToToday()`: Navigate to current month
- `setSelectedDate(dateStr)`: Set selected date
- `updateOptions(options)`: Update calendar options

### CheckoutCalendar Class

Integration with checkout process.

- `constructor(containerSelector, summarySelector)`: Initialize checkout calendar
- `getAppointmentData()`: Get selected appointment data
- `isAppointmentSelected()`: Check if appointment is selected
- `resetAppointmentData()`: Reset appointment selection

### ContactCalendar Class

Read-only calendar for contact page.

- `constructor(containerSelector)`: Initialize contact calendar
- `showAvailability(date)`: Show availability for a date

## CSS Customization

The calendar system includes a comprehensive CSS file with custom properties that can be overridden to match your site's theme. Key properties include:

```css
.neon-calendar {
    --calendar-bg: #121212;
    --day-bg: #1a1a1a;
    --day-hover-bg: #252525;
    --day-selected-bg: rgba(0, 255, 65, 0.1);
    --day-text: #e0e0e0;
    --day-inactive-text: #666;
    --day-disabled-bg: #0d0d0d;
    --day-disabled-text: #333;
    --day-blocked-bg: rgba(255, 0, 0, 0.1);
    --day-today-border: var(--primary-color);
    --calendar-header-bg: #1a1a1a;
    --time-slot-bg: #1a1a1a;
    --time-slot-hover-bg: #252525;
    --time-slot-active-bg: rgba(0, 255, 65, 0.2);
    --time-slot-booked-bg: rgba(255, 0, 255, 0.2);
    --time-slot-blocked-bg: rgba(255, 0, 0, 0.1);
    --time-slot-border: #333;
    --calendar-border: var(--light-accent);
}
```

## Integration with Checkout Flow

The calendar system integrates with the checkout process using sessionStorage to maintain the selected appointment details between steps:

1. Customer selects a service and adds to cart
2. In the checkout process, customer selects date and time
3. Appointment data is stored in sessionStorage
4. At checkout completion, the appointment is confirmed and added to booked slots

## Future Enhancements

- Google Calendar export option
- SMS/Email appointment reminders
- Recurring appointments
- Multiple appointment durations (30m, 1h, 2h, etc.)
- Staff assignment for appointments