/**
 * NEONpulseTechshop Checkout Calendar Integration
 * 
 * Adds appointment selection to the checkout process, integrating with
 * the existing cart and checkout functionality.
 */

class CheckoutCalendar {
    /**
     * Initialize checkout calendar integration
     * @param {string} containerSelector - Selector for calendar container
     * @param {string} summarySelector - Selector for appointment summary container
     */
    constructor(containerSelector, summarySelector) {
        this.containerElement = document.querySelector(containerSelector);
        this.summaryElement = document.querySelector(summarySelector);
        
        if (!this.containerElement) {
            console.error(`Calendar container element with selector ${containerSelector} not found.`);
            return;
        }
        
        // Create container ID if not exists
        if (!this.containerElement.id) {
            this.containerElement.id = 'checkout-calendar-' + Date.now();
        }
        
        // Initialize state
        this.appointmentData = {
            date: null,
            time: null,
            displayDate: null,
            displayTime: null
        };
        
        // Get appointment data from session storage if exists
        const storedData = sessionStorage.getItem('appointmentData');
        if (storedData) {
            try {
                this.appointmentData = JSON.parse(storedData);
            } catch (error) {
                console.error('Error parsing stored appointment data:', error);
            }
        }
        
        // Initialize calendar UI
        this.initCalendar();
        
        // Update appointment summary
        this.updateAppointmentSummary();
    }
    
    /**
     * Initialize calendar UI
     */
    initCalendar() {
        // Set minimum date
        const today = new Date();
        
        // Set tomorrow as default minimum date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Set maximum date (60 days from now)
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 60);
        
        // Get calendar instance
        this.calendar = window.appointmentCalendar || new AppointmentCalendar();
        
        // Initialize calendar UI
        this.calendarUI = new CalendarUI(this.containerElement.id, {
            minDate: this.formatDate(today), // Allow selection from today
            maxDate: this.formatDate(maxDate),
            initialDate: this.appointmentData.date,
            onDateSelected: (date) => this.handleDateSelected(date),
            onTimeSelected: (time) => this.handleTimeSelected(time),
            onSelectionComplete: (selection) => this.handleSelectionComplete(selection)
        });
        
        // Add note about same-day appointments
        const noteElement = document.createElement('div');
        noteElement.className = 'calendar-note';
        noteElement.innerHTML = `
            <div class="calendar-note-content">
                <i class="fas fa-info-circle"></i>
                <p><strong>Note:</strong> Drop offs are by appointment only. For next-day or later appointments, you can book online. For same-day appointments, please call us directly at <a href="tel:+1234567890">(123) 456-7890</a>.</p>
            </div>
        `;
        
        // Insert note before calendar
        this.containerElement.parentNode.insertBefore(noteElement, this.containerElement);
    }
    
    /**
     * Handle date selection
     * @param {string} date - Selected date in YYYY-MM-DD format
     */
    handleDateSelected(date) {
        this.appointmentData.date = date;
        this.appointmentData.displayDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Check if date is today
        const isSameDay = this.calendar.isRequiringPhoneCall(date);
        this.appointmentData.requiresPhoneCall = isSameDay;
        
        // Reset time selection
        this.appointmentData.time = null;
        this.appointmentData.displayTime = null;
        
        // Update appointment summary
        this.updateAppointmentSummary();
        
        // Show same-day booking notification if needed
        if (isSameDay) {
            this.showSameDayBookingNotice();
        }
    }
    
    /**
     * Show same-day booking notification
     */
    showSameDayBookingNotice() {
        // Find existing notification or create new one
        let noticeElement = document.querySelector('.same-day-notice');
        
        if (!noticeElement) {
            noticeElement = document.createElement('div');
            noticeElement.className = 'same-day-notice';
            
            // Add to time slot container
            const timeSlotContainer = document.getElementById('time-slot-container');
            if (timeSlotContainer) {
                timeSlotContainer.parentNode.insertBefore(noticeElement, timeSlotContainer);
            } else {
                this.containerElement.appendChild(noticeElement);
            }
        }
        
        noticeElement.innerHTML = `
            <div class="same-day-notice-content">
                <i class="fas fa-phone"></i>
                <div>
                    <h4>Same-Day Appointment Selected</h4>
                    <p>Please call us at <a href="tel:+1234567890">(123) 456-7890</a> to confirm availability for today.</p>
                    <p class="small">Our online booking system only allows next-day appointments and beyond.</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Handle time selection
     * @param {string} time - Selected time in HH:MM format
     */
    handleTimeSelected(time) {
        this.appointmentData.time = time;
        this.appointmentData.displayTime = this.formatTimeForDisplay(time);
        
        // Update appointment summary
        this.updateAppointmentSummary();
    }
    
    /**
     * Handle selection complete
     * @param {object} selection - Selected date and time
     */
    handleSelectionComplete(selection) {
        // Store selection in session storage
        sessionStorage.setItem('appointmentData', JSON.stringify(selection));
        
        // Update appointment data
        this.appointmentData = selection;
        
        // Update appointment summary
        this.updateAppointmentSummary();
        
        // Enable continue button
        this.enableContinueButton();
        
        // Show confirmation message
        this.showConfirmation();
    }
    
    /**
     * Update appointment summary
     */
    updateAppointmentSummary() {
        if (!this.summaryElement) return;
        
        if (this.appointmentData.date && this.appointmentData.time) {
            // Basic appointment details
            let summaryHTML = `
                <div class="appointment-summary">
                    <h3>Appointment Details</h3>
                    <div class="appointment-detail">
                        <span class="appointment-label">Date:</span>
                        <span class="appointment-value">${this.appointmentData.displayDate}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="appointment-label">Time:</span>
                        <span class="appointment-value">${this.appointmentData.displayTime}</span>
                    </div>
            `;
            
            // Add call requirement notice if same day
            if (this.appointmentData.requiresPhoneCall) {
                summaryHTML += `
                    <div class="appointment-detail same-day-alert">
                        <i class="fas fa-phone-alt"></i>
                        <span>Same-day appointment requires confirmation by phone.</span>
                        <a href="tel:+1234567890" class="btn btn-sm">Call (123) 456-7890</a>
                    </div>
                `;
            }
            
            summaryHTML += `</div>`;
            this.summaryElement.innerHTML = summaryHTML;
        } else if (this.appointmentData.date) {
            // Only date selected
            let summaryHTML = `
                <div class="appointment-summary">
                    <h3>Appointment Details</h3>
                    <div class="appointment-detail">
                        <span class="appointment-label">Date:</span>
                        <span class="appointment-value">${this.appointmentData.displayDate}</span>
                    </div>
                    <div class="appointment-detail">
                        <span class="appointment-label">Time:</span>
                        <span class="appointment-value">Please select a time</span>
                    </div>
            `;
            
            // Add call requirement notice if same day
            if (this.appointmentData.requiresPhoneCall) {
                summaryHTML += `
                    <div class="appointment-detail same-day-alert">
                        <i class="fas fa-phone-alt"></i>
                        <span>Same-day appointment requires confirmation by phone.</span>
                        <a href="tel:+1234567890" class="btn btn-sm">Call (123) 456-7890</a>
                    </div>
                `;
            }
            
            summaryHTML += `</div>`;
            this.summaryElement.innerHTML = summaryHTML;
        } else {
            // Nothing selected yet
            this.summaryElement.innerHTML = `
                <div class="appointment-summary">
                    <h3>Appointment Details</h3>
                    <p>Please select a date and time for your appointment.</p>
                </div>
            `;
        }
    }
    
    /**
     * Enable continue button
     */
    enableContinueButton() {
        const continueBtn = document.getElementById('next-step-btn');
        if (continueBtn) {
            continueBtn.removeAttribute('disabled');
        }
    }
    
    /**
     * Show confirmation message
     */
    showConfirmation() {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'appointment-confirmation';
        
        // Different message for same-day appointments
        if (this.appointmentData.requiresPhoneCall) {
            confirmationMessage.innerHTML = `
                <div class="appointment-confirmation-content same-day">
                    <i class="fas fa-phone-alt"></i>
                    <div>
                        <p><strong>Same-day appointment selected</strong></p>
                        <p>Please call us at <a href="tel:+1234567890">(123) 456-7890</a> to confirm your appointment for ${this.appointmentData.displayDate} at ${this.appointmentData.displayTime}.</p>
                    </div>
                </div>
            `;
        } else {
            confirmationMessage.innerHTML = `
                <div class="appointment-confirmation-content">
                    <i class="fas fa-check-circle"></i>
                    <p>Your appointment has been selected for ${this.appointmentData.displayDate} at ${this.appointmentData.displayTime}.</p>
                </div>
            `;
        }
        
        // Add to page
        document.body.appendChild(confirmationMessage);
        
        // Remove after delay (longer for same-day notifications)
        setTimeout(() => {
            document.body.removeChild(confirmationMessage);
        }, this.appointmentData.requiresPhoneCall ? 5000 : 3000);
    }
    
    /**
     * Format date to YYYY-MM-DD
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
     * Get appointment data
     * @returns {object} Appointment data
     */
    getAppointmentData() {
        return this.appointmentData;
    }
    
    /**
     * Check if appointment is selected
     * @returns {boolean} True if appointment is selected
     */
    isAppointmentSelected() {
        // Basic check for date and time
        const hasDateAndTime = !!this.appointmentData.date && !!this.appointmentData.time;
        
        // For same-day appointments, we'll consider them "selected" but will show 
        // additional messages to call for confirmation in the UI
        return hasDateAndTime;
    }
    
    /**
     * Check if appointment requires phone confirmation (same-day)
     * @returns {boolean} True if requires phone confirmation
     */
    requiresPhoneConfirmation() {
        return this.appointmentData.requiresPhoneCall === true;
    }
    
    /**
     * Reset appointment data
     */
    resetAppointmentData() {
        this.appointmentData = {
            date: null,
            time: null,
            displayDate: null,
            displayTime: null
        };
        
        // Clear session storage
        sessionStorage.removeItem('appointmentData');
        
        // Update appointment summary
        this.updateAppointmentSummary();
    }
}

// Add to window if running in browser
if (typeof window !== 'undefined') {
    window.CheckoutCalendar = CheckoutCalendar;
}