/**
 * Booking Controller for NEONpulseTechshop
 * 
 * Manages secure appointment booking with TidyCal integration
 * without exposing API keys client-side.
 */

class BookingController {
    constructor() {
        this.config = {
            tidycalAccount: 'neonpulsetechshop',
            bookingType: '1-hour-consultation', // Update with your actual booking type
            backendUrl: 'http://localhost:3001', // Backend URL
            minAdvanceHours: 24
        };
    }
    
    /**
     * Initialize booking after payment
     * @param {object} paymentData - Payment confirmation data
     */
    async initializePostPaymentBooking(paymentData) {
        try {
            // Call backend to validate payment and create booking session
            const response = await fetch(`${this.config.backendUrl}/api/payment/validate-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: paymentData.orderId,
                    paymentId: paymentData.paymentId,
                    amount: paymentData.amount
                })
            });
            
            if (!response.ok) {
                throw new Error('Payment validation failed');
            }
            
            const { bookingToken } = await response.json();
            
            // Show booking interface with validated token
            this.showBookingInterface(bookingToken);
            
        } catch (error) {
            console.error('Booking initialization error:', error);
            this.showError('Unable to initialize booking. Please contact support.');
        }
    }
    
    /**
     * Show booking interface
     * @param {string} bookingToken - Validated booking token
     */
    showBookingInterface(bookingToken) {
        const container = document.getElementById('booking-container');
        
        container.innerHTML = `
            <div class="booking-interface">
                <h2>Schedule Your Appointment</h2>
                
                <div class="booking-info">
                    <p><i class="fas fa-info-circle"></i> Appointments must be scheduled at least 24 hours in advance</p>
                </div>
                
                <div id="appointment-selector">
                    <div class="date-selector">
                        <h3>Select Date</h3>
                        <div id="date-picker"></div>
                    </div>
                    
                    <div class="time-selector">
                        <h3>Select Time</h3>
                        <div id="time-slots"></div>
                    </div>
                </div>
                
                <div class="booking-summary" style="display: none;">
                    <h3>Appointment Summary</h3>
                    <p>Date: <span id="selected-date"></span></p>
                    <p>Time: <span id="selected-time"></span></p>
                </div>
                
                <button id="confirm-booking" class="btn btn-primary" disabled>
                    Confirm Appointment
                </button>
            </div>
        `;
        
        // Initialize date and time selectors
        this.initializeDatePicker(bookingToken);
        this.setupEventHandlers(bookingToken);
    }
    
    /**
     * Initialize custom date picker
     * @param {string} bookingToken - Booking token
     */
    initializeDatePicker(bookingToken) {
        const picker = document.getElementById('date-picker');
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(minDate.getDate() + 1); // Minimum 24 hours advance
        
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30); // Maximum 30 days advance
        
        // Create calendar grid
        const calendar = this.createCalendarGrid(minDate, maxDate);
        picker.innerHTML = calendar;
        
        // Handle date selection
        picker.addEventListener('click', (e) => {
            if (e.target.classList.contains('available-date')) {
                document.querySelectorAll('.available-date').forEach(d => d.classList.remove('selected'));
                e.target.classList.add('selected');
                
                const selectedDate = e.target.dataset.date;
                this.loadAvailableTimeSlots(selectedDate, bookingToken);
            }
        });
    }
    
    /**
     * Create calendar grid
     * @param {Date} minDate - Minimum selectable date
     * @param {Date} maxDate - Maximum selectable date
     * @returns {string} HTML calendar grid
     */
    createCalendarGrid(minDate, maxDate) {
        let html = '<div class="calendar-grid">';
        const current = new Date(minDate);
        
        while (current <= maxDate) {
            const dateStr = current.toISOString().split('T')[0];
            const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = current.getDate();
            const isWeekend = current.getDay() === 0 || current.getDay() === 6;
            
            html += `
                <div class="calendar-day ${isWeekend ? 'weekend' : ''} available-date" 
                     data-date="${dateStr}">
                    <div class="day-name">${dayName}</div>
                    <div class="day-number">${dayNum}</div>
                </div>
            `;
            
            current.setDate(current.getDate() + 1);
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * Load available time slots for selected date
     * @param {string} date - Selected date
     * @param {string} bookingToken - Booking token
     */
    async loadAvailableTimeSlots(date, bookingToken) {
        try {
            // Call backend to get available slots
            const response = await fetch(`${this.config.backendUrl}/api/tidycal/available-slots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date,
                    bookingToken,
                    bookingType: this.config.bookingType
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to load time slots');
            }
            
            const { slots } = await response.json();
            this.displayTimeSlots(slots, date);
            
        } catch (error) {
            console.error('Error loading time slots:', error);
            this.showError('Unable to load available times. Please try again.');
        }
    }
    
    /**
     * Display time slots
     * @param {array} slots - Available time slots
     * @param {string} date - Selected date
     */
    displayTimeSlots(slots, date) {
        const container = document.getElementById('time-slots');
        
        if (slots.length === 0) {
            container.innerHTML = '<p>No available times for this date</p>';
            return;
        }
        
        let html = '<div class="time-grid">';
        
        slots.forEach(slot => {
            html += `
                <button class="time-slot" data-time="${slot.time}" data-date="${date}">
                    ${slot.display}
                </button>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Handle time selection
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-slot')) {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                e.target.classList.add('selected');
                
                this.updateBookingSummary(date, e.target.dataset.time);
                document.getElementById('confirm-booking').disabled = false;
            }
        });
    }
    
    /**
     * Update booking summary
     * @param {string} date - Selected date
     * @param {string} time - Selected time
     */
    updateBookingSummary(date, time) {
        const summary = document.querySelector('.booking-summary');
        document.getElementById('selected-date').textContent = new Date(date).toLocaleDateString();
        document.getElementById('selected-time').textContent = time;
        summary.style.display = 'block';
    }
    
    /**
     * Setup event handlers
     * @param {string} bookingToken - Booking token
     */
    setupEventHandlers(bookingToken) {
        const confirmBtn = document.getElementById('confirm-booking');
        
        confirmBtn.addEventListener('click', async () => {
            const selectedDate = document.querySelector('.available-date.selected')?.dataset.date;
            const selectedTime = document.querySelector('.time-slot.selected')?.dataset.time;
            
            if (!selectedDate || !selectedTime) {
                alert('Please select both date and time');
                return;
            }
            
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Creating appointment...';
            
            try {
                // Call backend to create appointment
                const response = await fetch(`${this.config.backendUrl}/api/tidycal/create-appointment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        bookingToken,
                        date: selectedDate,
                        time: selectedTime,
                        bookingType: this.config.bookingType
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to create appointment');
                }
                
                const { appointmentId, confirmationUrl } = await response.json();
                
                // Show success and redirect
                this.showBookingSuccess(selectedDate, selectedTime, confirmationUrl);
                
            } catch (error) {
                console.error('Booking error:', error);
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirm Appointment';
                this.showError('Failed to create appointment. Please try again.');
            }
        });
    }
    
    /**
     * Show booking success
     * @param {string} date - Appointment date
     * @param {string} time - Appointment time
     * @param {string} confirmationUrl - Confirmation URL
     */
    showBookingSuccess(date, time, confirmationUrl) {
        const container = document.getElementById('booking-container');
        
        container.innerHTML = `
            <div class="booking-success">
                <i class="fas fa-check-circle"></i>
                <h2>Appointment Confirmed!</h2>
                <div class="appointment-details">
                    <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${time}</p>
                </div>
                <p>You'll receive a confirmation email shortly.</p>
                <a href="${confirmationUrl}" class="btn btn-primary">View Confirmation</a>
            </div>
        `;
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'booking-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        
        const container = document.getElementById('booking-container');
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Initialize booking controller
const bookingController = new BookingController();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingController;
}