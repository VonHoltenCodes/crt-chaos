/**
 * NEONpulseTechshop Contact Page Calendar
 * 
 * Provides a read-only calendar view for the contact page to allow customers
 * to check availability before proceeding to book.
 */

class ContactCalendar {
    /**
     * Initialize contact page calendar
     * @param {string} containerSelector - Selector for calendar container
     */
    constructor(containerSelector) {
        console.log('ContactCalendar constructor called with:', containerSelector);
        this.containerElement = document.querySelector(containerSelector);
        
        if (!this.containerElement) {
            console.error(`Calendar container element with selector ${containerSelector} not found.`);
            return;
        }
        
        console.log('Container element found:', this.containerElement);
        
        // Create container ID if not exists
        if (!this.containerElement.id) {
            this.containerElement.id = 'contact-calendar-' + Date.now();
            console.log('Generated new container ID:', this.containerElement.id);
        }
        
        // Initialize calendar
        this.initCalendar();
        
        // Add availability note
        this.addAvailabilityNote();
        
        console.log('ContactCalendar initialization complete');
    }
    
    /**
     * Initialize calendar
     */
    initCalendar() {
        console.log('initCalendar method called');
        
        // Set minimum date (tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Set maximum date (30 days from now)
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        
        console.log('Min date:', this.formatDate(tomorrow), 'Max date:', this.formatDate(maxDate));
        console.log('Container element ID:', this.containerElement.id);
        
        try {
            // Initialize calendar UI
            this.calendarUI = new CalendarUI(this.containerElement.id, {
                readOnly: true,  // View only mode
                minDate: this.formatDate(tomorrow),
                maxDate: this.formatDate(maxDate),
                onDateSelected: (date) => this.showAvailability(date)
            });
            console.log('CalendarUI initialized successfully');
        } catch (error) {
            console.error('Error initializing CalendarUI:', error);
        }
    }
    
    /**
     * Add availability note
     */
    addAvailabilityNote() {
        const noteElement = document.createElement('div');
        noteElement.className = 'availability-note';
        noteElement.innerHTML = `
            <p><i class="fas fa-info-circle"></i> Select a date to view available appointment slots.</p>
            <p class="small">To book an appointment, please proceed to checkout after adding services to your cart.</p>
        `;
        
        // Add note before calendar
        this.containerElement.parentNode.insertBefore(noteElement, this.containerElement);
        
        // Create availability display element
        this.availabilityElement = document.createElement('div');
        this.availabilityElement.className = 'availability-display';
        this.availabilityElement.id = 'availability-display';
        
        // Add after calendar
        this.containerElement.parentNode.insertBefore(this.availabilityElement, this.containerElement.nextSibling);
    }
    
    /**
     * Show availability for selected date
     * @param {string} date - Selected date in YYYY-MM-DD format
     */
    showAvailability(date) {
        console.log('showAvailability called for date:', date);
        
        try {
            // Make sure AppointmentCalendar class is available
            if (typeof AppointmentCalendar === 'undefined') {
                console.error('AppointmentCalendar class is not defined');
                throw new Error('AppointmentCalendar class is not defined');
            }
            
            // Try to get the global appointment calendar or create a new one if it doesn't exist
            if (!window.appointmentCalendar) {
                console.log('Creating new AppointmentCalendar instance');
                window.appointmentCalendar = new AppointmentCalendar();
            }
            
            const calendar = window.appointmentCalendar;
            console.log('Using calendar instance:', calendar);
            
            // Get day of week
            const dayOfWeek = calendar.getDayOfWeek(date);
            console.log('Day of week:', dayOfWeek);
            
            // Format date for display
            const displayDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            console.log('Display date:', displayDate);
            
            // Check if date is blocked or closed
            const isBlocked = calendar.isDateBlocked(date);
            const isClosed = calendar.calendarData.businessHours[dayOfWeek.toLowerCase()].length === 0;
            console.log('Is blocked:', isBlocked, 'Is closed:', isClosed);
            
            // Check if date is today
            const isSameDay = calendar.isRequiringPhoneCall(date);
            
            let html = `<h3>Availability for ${displayDate}</h3>`;
            
            // Add same-day notice if applicable
            if (isSameDay) {
                html += `
                    <div class="same-day-notice">
                        <div class="same-day-notice-content">
                            <i class="fas fa-phone"></i>
                            <div>
                                <h4>Same-Day Appointment</h4>
                                <p>Please call us at <a href="tel:+1234567890">(123) 456-7890</a> to confirm availability for today.</p>
                                <p class="small">Drop offs are by appointment only. For same-day service, phone confirmation is required.</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (isBlocked) {
                html += `
                    <div class="availability-status blocked">
                        <i class="fas fa-times-circle"></i> This date is fully booked. Please select another date.
                    </div>
                `;
            } else if (isClosed) {
                html += `
                    <div class="availability-status closed">
                        <i class="fas fa-door-closed"></i> We are closed on this day. Please select another date.
                    </div>
                `;
            } else {
                // Get available slots
                const availableSlots = calendar.getAvailableSlots(date);
                console.log('Available slots:', availableSlots);
                
                if (availableSlots.length === 0) {
                    html += `
                        <div class="availability-status booked">
                            <i class="fas fa-calendar-times"></i> All appointment slots are booked for this date. Please select another date.
                        </div>
                    `;
                } else {
                    html += `
                        <div class="availability-status available">
                            <i class="fas fa-calendar-check"></i> The following time slots are available:
                        </div>
                        <div class="availability-slots">
                    `;
                    
                    // Group slots by morning, afternoon, evening
                    const morning = availableSlots.filter(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        return hour >= 7 && hour < 12;
                    });
                    
                    const afternoon = availableSlots.filter(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        return hour >= 12 && hour < 17;
                    });
                    
                    const evening = availableSlots.filter(slot => {
                        const hour = parseInt(slot.split(':')[0]);
                        return hour >= 17;
                    });
                    
                    console.log('Morning slots:', morning);
                    console.log('Afternoon slots:', afternoon);
                    console.log('Evening slots:', evening);
                    
                    // Format times for display
                    const formatTimeList = (slots) => {
                        return slots.map(slot => {
                            const [hour] = slot.split(':');
                            const hourNum = parseInt(hour);
                            
                            if (hourNum === 0) {
                                return '12:00 AM';
                            } else if (hourNum === 12) {
                                return '12:00 PM';
                            } else if (hourNum > 12) {
                                return `${hourNum - 12}:00 PM`;
                            } else {
                                return `${hourNum}:00 AM`;
                            }
                        }).join(', ');
                    };
                    
                    if (morning.length > 0) {
                        html += `
                            <div class="time-group">
                                <h4>Morning</h4>
                                <p>${formatTimeList(morning)}</p>
                            </div>
                        `;
                    }
                    
                    if (afternoon.length > 0) {
                        html += `
                            <div class="time-group">
                                <h4>Afternoon</h4>
                                <p>${formatTimeList(afternoon)}</p>
                            </div>
                        `;
                    }
                    
                    if (evening.length > 0) {
                        html += `
                            <div class="time-group">
                                <h4>Evening</h4>
                                <p>${formatTimeList(evening)}</p>
                            </div>
                        `;
                    }
                    
                    html += `</div>`;
                    
                    // Different CTA based on whether date is today or future
                    if (isSameDay) {
                        html += `
                            <div class="booking-cta">
                                <p>For same-day appointments, please call us directly.</p>
                                <a href="tel:+1234567890" class="btn btn-primary">
                                    <i class="fas fa-phone"></i> Call (123) 456-7890
                                </a>
                            </div>
                        `;
                    } else {
                        html += `
                            <div class="booking-cta">
                                <p>To book an appointment, add services to your cart and proceed to checkout.</p>
                                <a href="#services" class="btn btn-primary">View Services</a>
                            </div>
                        `;
                    }
                }
            }
            
            // Update availability display
            if (this.availabilityElement) {
                console.log('Updating availability element with HTML');
                this.availabilityElement.innerHTML = html;
                
                // Scroll to availability
                this.availabilityElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.error('Availability element not found');
            }
        } catch (error) {
            console.error('Error showing availability:', error);
            
            // Create error message
            const errorHtml = `
                <div class="availability-status blocked">
                    <i class="fas fa-exclamation-circle"></i> Sorry, there was an error loading the availability calendar. Please try again later or contact us directly.
                </div>
            `;
            
            // Update availability display with error message
            if (this.availabilityElement) {
                this.availabilityElement.innerHTML = errorHtml;
            }
        }
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
}

// Add to window if running in browser
if (typeof window !== 'undefined') {
    window.ContactCalendar = ContactCalendar;
}