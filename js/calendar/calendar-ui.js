/**
 * NEONpulseTechshop Calendar UI
 * 
 * Renders a customer-facing calendar interface for selecting appointment
 * dates and times. Used in both the contact page (read-only) and checkout process.
 */

class CalendarUI {
    /**
     * Initialize calendar UI
     * @param {string} containerId - ID of container element
     * @param {object} options - Configuration options
     */
    constructor(containerId, options = {}) {
        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container element with ID ${containerId} not found.`);
            return;
        }
        
        // Default options
        this.options = {
            readOnly: false,            // Read-only mode (no selection)
            allowMultiple: false,       // Allow multiple day selections
            showTimeSlots: true,        // Show time slot selection
            minDate: null,              // Minimum selectable date (YYYY-MM-DD)
            maxDate: null,              // Maximum selectable date (YYYY-MM-DD)
            initialDate: null,          // Initial selected date (YYYY-MM-DD)
            onDateSelected: null,       // Callback when date is selected
            onTimeSelected: null,       // Callback when time is selected
            onSelectionComplete: null,  // Callback when selection is complete
            ...options
        };
        
        // Set initial state
        this.currentDate = new Date();
        this.selectedDate = this.options.initialDate ? new Date(this.options.initialDate) : null;
        this.selectedTime = null;
        
        // Calendar data access
        this.calendar = window.appointmentCalendar || new AppointmentCalendar();
        
        // Render calendar
        this.render();
        
        safeConsole.log('Calendar UI initialized with options:', this.options);
    }
    
    /**
     * Render calendar UI
     */
    render() {
        // Clear container
        this.container.innerHTML = '';
        this.container.className = 'neon-calendar';
        
        // Add admin class if in admin mode
        if (this.options.adminMode) {
            this.container.classList.add('admin-calendar');
        }
        
        // Create calendar structure
        this.container.innerHTML = `
            <div class="calendar-header">
                <h3 class="calendar-title">${this.getMonthName(this.currentDate.getMonth())} ${this.currentDate.getFullYear()}</h3>
                <div class="calendar-nav">
                    <button class="calendar-nav-btn" id="prev-month"><i class="fas fa-chevron-left"></i></button>
                    <button class="calendar-nav-btn" id="current-month">Today</button>
                    <button class="calendar-nav-btn" id="next-month"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            <div class="calendar-grid" id="calendar-grid">
                ${this.renderDayHeaders()}
                ${this.renderDays()}
            </div>
            ${this.options.showTimeSlots ? '<div class="time-slot-container" id="time-slot-container"></div>' : ''}
            <div class="calendar-footer">
                <div class="calendar-legend">
                    <div class="legend-item">
                        <div class="legend-color legend-available"></div>
                        <span>Available</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color legend-booked"></div>
                        <span>Booked</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color legend-blocked"></div>
                        <span>Unavailable</span>
                    </div>
                </div>
                ${!this.options.readOnly ? `
                <div class="calendar-actions">
                    <button class="calendar-action-btn" id="confirm-selection" ${!this.selectedDate ? 'disabled' : ''}>Confirm Selection</button>
                </div>` : ''}
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
        
        // Show time slots if date is selected
        if (this.selectedDate && this.options.showTimeSlots) {
            this.renderTimeSlots(this.formatDate(this.selectedDate));
        }
    }
    
    /**
     * Render day headers (Sun, Mon, etc.)
     * @returns {string} HTML for day headers
     */
    renderDayHeaders() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(day => `<div class="day-header">${day}</div>`).join('');
    }
    
    /**
     * Render days of month
     * @returns {string} HTML for days of month
     */
    renderDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        const monthData = this.calendar.getMonthData(year, month);
        
        // Get current date for "today" highlighting
        const today = new Date();
        const todayFormatted = this.formatDate(today);
        
        // Get first day of month and pad with empty cells
        const firstDayOfWeek = monthData.firstDayOfWeek;
        let html = '';
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDayOfWeek; i++) {
            html += '<div class="day-cell inactive"></div>';
        }
        
        // Add cells for each day of month
        monthData.days.forEach(dayData => {
            const isToday = dayData.date === todayFormatted;
            const isSelected = this.selectedDate && this.formatDate(this.selectedDate) === dayData.date;
            const isPast = new Date(dayData.date) < new Date(new Date().setHours(0, 0, 0, 0));
            const isDisabled = this.options.minDate && dayData.date < this.options.minDate || 
                              this.options.maxDate && dayData.date > this.options.maxDate || 
                              isPast;
            
            // Determine day class
            let dayClass = 'day-cell';
            if (isToday) dayClass += ' today';
            if (isSelected) dayClass += ' selected';
            if (dayData.isBlocked || dayData.isClosed) dayClass += dayData.isClosed ? ' closed' : ' blocked';
            if (isDisabled && !this.options.adminMode) dayClass += ' inactive';
            
            // Calculate availability percentage for indicator
            const availabilityPercentage = dayData.totalSlots > 0 
                ? (dayData.availableSlots / dayData.totalSlots) * 100 
                : 0;
            
            // Admin controls for blocking/unblocking days
            const adminControls = this.options.adminMode ? `
                <div class="day-controls">
                    ${dayData.isBlocked 
                        ? `<button class="day-control-btn unblock-day" data-date="${dayData.date}" title="Unblock Day"><i class="fas fa-lock-open"></i></button>` 
                        : `<button class="day-control-btn block-day" data-date="${dayData.date}" title="Block Day"><i class="fas fa-lock"></i></button>`
                    }
                    <button class="day-control-btn edit-slots" data-date="${dayData.date}" title="Edit Time Slots"><i class="fas fa-clock"></i></button>
                </div>
            ` : '';
            
            html += `
                <div class="${dayClass}" data-date="${dayData.date}">
                    <div class="day-number">${dayData.day}</div>
                    ${!dayData.isBlocked && !dayData.isClosed ? `
                        <div class="availability-indicator">
                            <div class="availability-fill" style="width: ${availabilityPercentage}%"></div>
                        </div>
                    ` : ''}
                    ${dayData.bookingCount > 0 ? `
                        <div class="booking-indicator">
                            <i class="fas fa-calendar-check"></i>${dayData.bookingCount}
                        </div>
                    ` : ''}
                    ${adminControls}
                </div>
            `;
        });
        
        return html;
    }
    
    /**
     * Render time slots for a selected date
     * @param {string} date - Selected date in YYYY-MM-DD format
     */
    renderTimeSlots(date) {
        const timeSlotContainer = document.getElementById('time-slot-container');
        if (!timeSlotContainer) return;
        
        // Get day of week and business hours
        const dayOfWeek = this.calendar.getDayOfWeek(date);
        const businessHours = this.calendar.calendarData.businessHours[dayOfWeek.toLowerCase()];
        
        // Check if date is blocked or closed
        if (this.calendar.isDateBlocked(date) || businessHours.length === 0) {
            timeSlotContainer.innerHTML = `
                <div class="no-slots-message">
                    <p>No appointments available on this date.</p>
                </div>
            `;
            return;
        }
        
        // Get available slots
        const availableSlots = this.calendar.getAvailableSlots(date);
        
        // Get blocked and booked slots
        const blockedSlots = this.calendar.calendarData.blockedSlots[date] || [];
        const bookedSlots = this.calendar.calendarData.bookedSlots[date] || [];
        const bookedTimes = bookedSlots.map(booking => booking.time);
        
        // Generate HTML for time slots
        let html = '';
        
        businessHours.forEach(timeSlot => {
            const isAvailable = availableSlots.includes(timeSlot);
            const isBlocked = blockedSlots.includes(timeSlot);
            const isBooked = bookedTimes.includes(timeSlot);
            const isSelected = this.selectedTime === timeSlot;
            
            let slotClass = 'time-slot';
            if (isSelected) slotClass += ' selected';
            if (isBlocked) slotClass += ' blocked';
            if (isBooked) slotClass += ' booked';
            if (!isAvailable && !isSelected) slotClass += ' inactive';
            
            const isDisabled = (!isAvailable || this.options.readOnly) ? 'disabled' : '';
            
            // Format time for display (e.g., "10:00" to "10:00 AM")
            const displayTime = this.formatTimeForDisplay(timeSlot);
            
            html += `
                <div class="${slotClass}" data-time="${timeSlot}" ${isDisabled}>
                    ${displayTime}
                </div>
            `;
        });
        
        timeSlotContainer.innerHTML = html;
        
        // Add event listeners to time slots
        if (!this.options.readOnly) {
            const timeSlots = timeSlotContainer.querySelectorAll('.time-slot:not(.inactive):not(.blocked):not(.booked)');
            timeSlots.forEach(slot => {
                slot.addEventListener('click', () => this.handleTimeSelection(slot));
            });
        }
    }
    
    /**
     * Add event listeners to calendar elements
     */
    addEventListeners() {
        // Navigation buttons
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        const currentMonthBtn = document.getElementById('current-month');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
        }
        
        if (currentMonthBtn) {
            currentMonthBtn.addEventListener('click', () => this.navigateToToday());
        }
        
        // Day selection
        if (!this.options.readOnly) {
            const days = this.container.querySelectorAll('.day-cell:not(.inactive):not(.blocked):not(.closed)');
            days.forEach(day => {
                day.addEventListener('click', () => this.handleDateSelection(day));
            });
        }
        
        // Confirm selection button
        const confirmBtn = document.getElementById('confirm-selection');
        if (confirmBtn && !this.options.readOnly) {
            confirmBtn.addEventListener('click', () => this.confirmSelection());
        }
        
        // Admin specific event listeners
        if (this.options.adminMode) {
            // Block/unblock day buttons
            const blockDayBtns = this.container.querySelectorAll('.block-day');
            blockDayBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent day selection
                    const date = btn.getAttribute('data-date');
                    this.calendar.blockDay(date);
                    this.render(); // Re-render calendar
                });
            });
            
            const unblockDayBtns = this.container.querySelectorAll('.unblock-day');
            unblockDayBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent day selection
                    const date = btn.getAttribute('data-date');
                    this.calendar.unblockDay(date);
                    this.render(); // Re-render calendar
                });
            });
            
            // Edit time slots button
            const editSlotsBtns = this.container.querySelectorAll('.edit-slots');
            editSlotsBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent day selection
                    const date = btn.getAttribute('data-date');
                    this.showTimeSlotEditor(date);
                });
            });
        }
    }
    
    /**
     * Handle date selection
     * @param {HTMLElement} dayElement - Selected day element
     */
    handleDateSelection(dayElement) {
        // Get date from data attribute
        const date = dayElement.getAttribute('data-date');
        if (!date) return;
        
        // Deselect previous date
        if (this.selectedDate && !this.options.allowMultiple) {
            const previousSelected = this.container.querySelector('.day-cell.selected');
            if (previousSelected) {
                previousSelected.classList.remove('selected');
            }
        }
        
        // Select new date
        dayElement.classList.add('selected');
        this.selectedDate = new Date(date);
        
        // Reset time selection
        this.selectedTime = null;
        
        // Enable confirm button
        const confirmBtn = document.getElementById('confirm-selection');
        if (confirmBtn) {
            confirmBtn.removeAttribute('disabled');
        }
        
        // Show time slots if enabled
        if (this.options.showTimeSlots) {
            this.renderTimeSlots(date);
        }
        
        // Callback
        if (this.options.onDateSelected && typeof this.options.onDateSelected === 'function') {
            this.options.onDateSelected(date);
        }
    }
    
    /**
     * Handle time slot selection
     * @param {HTMLElement} slotElement - Selected time slot element
     */
    handleTimeSelection(slotElement) {
        // Get time from data attribute
        const time = slotElement.getAttribute('data-time');
        if (!time) return;
        
        // Deselect previous time slot
        const previousSelected = this.container.querySelector('.time-slot.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Select new time slot
        slotElement.classList.add('selected');
        this.selectedTime = time;
        
        // Callback
        if (this.options.onTimeSelected && typeof this.options.onTimeSelected === 'function') {
            this.options.onTimeSelected(time);
        }
    }
    
    /**
     * Navigate to previous/next month
     * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
     */
    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.render();
    }
    
    /**
     * Navigate to current month
     */
    navigateToToday() {
        this.currentDate = new Date();
        this.render();
    }
    
    /**
     * Confirm date/time selection
     */
    confirmSelection() {
        if (!this.selectedDate) return;
        
        // Prepare selection data
        const selection = {
            date: this.formatDate(this.selectedDate),
            time: this.selectedTime,
            displayDate: this.formatDateForDisplay(this.selectedDate),
            displayTime: this.selectedTime ? this.formatTimeForDisplay(this.selectedTime) : null
        };
        
        // Callback
        if (this.options.onSelectionComplete && typeof this.options.onSelectionComplete === 'function') {
            this.options.onSelectionComplete(selection);
        }
    }
    
    /**
     * Show time slot editor for admin
     * @param {string} date - Date to edit in YYYY-MM-DD format
     */
    showTimeSlotEditor(date) {
        if (!this.options.adminMode) return;
        
        // Get time slots for this date
        const dayOfWeek = this.calendar.getDayOfWeek(date);
        const businessHours = this.calendar.calendarData.businessHours[dayOfWeek.toLowerCase()];
        const blockedSlots = this.calendar.calendarData.blockedSlots[date] || [];
        
        // Create modal for editing time slots
        const modal = document.createElement('div');
        modal.className = 'calendar-modal';
        modal.innerHTML = `
            <div class="calendar-modal-content">
                <h3>Edit Time Slots for ${this.formatDateForDisplay(new Date(date))}</h3>
                <div class="time-slot-editor">
                    ${businessHours.map(slot => {
                        const isBlocked = blockedSlots.includes(slot);
                        return `
                            <div class="time-slot-edit-item">
                                <label>
                                    <input type="checkbox" data-slot="${slot}" ${isBlocked ? '' : 'checked'}>
                                    ${this.formatTimeForDisplay(slot)}
                                </label>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="modal-actions">
                    <button class="calendar-action-btn secondary" id="cancel-edit">Cancel</button>
                    <button class="calendar-action-btn" id="save-time-slots">Save Changes</button>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('cancel-edit').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('save-time-slots').addEventListener('click', () => {
            // Get all unchecked slots (to be blocked)
            const slotsToBlock = [];
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]:not(:checked)');
            checkboxes.forEach(checkbox => {
                slotsToBlock.push(checkbox.getAttribute('data-slot'));
            });
            
            // Update calendar
            this.calendar.calendarData.blockedSlots[date] = slotsToBlock;
            this.calendar.saveCalendarData();
            
            // Remove modal
            document.body.removeChild(modal);
            
            // Re-render calendar
            this.render();
        });
    }
    
    /**
     * Format date object to YYYY-MM-DD string
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    /**
     * Format date for display
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     */
    formatDateForDisplay(date) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    /**
     * Format time for display
     * @param {string} time - Time in 24h format (HH:00)
     * @returns {string} Formatted time string
     */
    formatTimeForDisplay(time) {
        const [hour] = time.split(':');
        const hourNum = parseInt(hour, 10);
        
        if (hourNum === 0) {
            return '12:00 AM';
        } else if (hourNum === 12) {
            return '12:00 PM';
        } else if (hourNum > 12) {
            return `${hourNum - 12}:00 PM`;
        } else {
            return `${hourNum}:00 AM`;
        }
    }
    
    /**
     * Get month name from month number
     * @param {number} month - Month number (0-11)
     * @returns {string} Month name
     */
    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }
    
    /**
     * Update calendar options
     * @param {object} options - New options
     */
    updateOptions(options) {
        this.options = { ...this.options, ...options };
        this.render();
    }
    
    /**
     * Set selected date
     * @param {string} dateStr - Date string in YYYY-MM-DD format
     */
    setSelectedDate(dateStr) {
        this.selectedDate = new Date(dateStr);
        this.currentDate = new Date(dateStr);
        this.render();
    }
}

// Add to window if running in browser
if (typeof window !== 'undefined') {
    window.CalendarUI = CalendarUI;
}