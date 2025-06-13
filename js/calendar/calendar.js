/**
 * NEONpulseTechshop Calendar System
 * 
 * A lightweight calendar system for managing business hours, blocked days/slots,
 * and customer bookings. Uses localStorage for persistence and provides methods
 * for both admin management and customer-facing interfaces.
 */

class AppointmentCalendar {
    /**
     * Initialize the calendar system
     */
    constructor() {
        // Default business hours (10 AM to 6 PM, Monday-Saturday)
        this.defaultHours = {
            monday: this.generateHourSlots(10, 18),
            tuesday: this.generateHourSlots(10, 18),
            wednesday: this.generateHourSlots(10, 18),
            thursday: this.generateHourSlots(10, 18),
            friday: this.generateHourSlots(10, 18),
            saturday: this.generateHourSlots(10, 16),
            sunday: [] // Closed
        };
        
        // Load calendar data from localStorage or use defaults
        this.calendarData = this.loadCalendarData();
        
        safeConsole.log('Calendar initialized:', this.calendarData);
    }
    
    /**
     * Generate array of hour slots in format "HH:00"
     * @param {number} startHour - Starting hour (24h format)
     * @param {number} endHour - Ending hour (24h format, exclusive)
     * @returns {array} Array of hour slots
     */
    generateHourSlots(startHour, endHour) {
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    }
    
    /**
     * Load calendar data from localStorage
     * @returns {object} Calendar data
     */
    loadCalendarData() {
        const storedData = localStorage.getItem('neonpulseCalendar');
        
        // Use defaults if no stored data exists
        if (!storedData) {
            return {
                businessHours: this.defaultHours,
                blockedDays: [],
                blockedSlots: {},
                bookedSlots: {}
            };
        }
        
        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error('Error parsing calendar data:', error);
            // Return defaults if data is corrupted
            return {
                businessHours: this.defaultHours,
                blockedDays: [],
                blockedSlots: {},
                bookedSlots: {}
            };
        }
    }
    
    /**
     * Save calendar data to localStorage
     */
    saveCalendarData() {
        localStorage.setItem('neonpulseCalendar', JSON.stringify(this.calendarData));
        safeConsole.log('Calendar data saved:', this.calendarData);
    }
    
    /**
     * Reset calendar to default settings
     */
    resetCalendar() {
        this.calendarData = {
            businessHours: this.defaultHours,
            blockedDays: [],
            blockedSlots: {},
            bookedSlots: {}
        };
        this.saveCalendarData();
    }
    
    /**
     * Update business hours for a specific day
     * @param {string} day - Day of week (lowercase)
     * @param {array} hours - Array of hour slots in format "HH:00"
     */
    updateBusinessHours(day, hours) {
        if (!['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(day)) {
            console.error('Invalid day of week:', day);
            return;
        }
        
        this.calendarData.businessHours[day] = hours;
        this.saveCalendarData();
    }
    
    /**
     * Block an entire day (no appointments possible)
     * @param {string} date - Date in format "YYYY-MM-DD"
     */
    blockDay(date) {
        if (!this.calendarData.blockedDays.includes(date)) {
            this.calendarData.blockedDays.push(date);
            // Remove any blocked slots for this day as they're redundant
            delete this.calendarData.blockedSlots[date];
            this.saveCalendarData();
        }
    }
    
    /**
     * Unblock a previously blocked day
     * @param {string} date - Date in format "YYYY-MM-DD"
     */
    unblockDay(date) {
        const index = this.calendarData.blockedDays.indexOf(date);
        if (index !== -1) {
            this.calendarData.blockedDays.splice(index, 1);
            this.saveCalendarData();
        }
    }
    
    /**
     * Block specific time slots on a day
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @param {array} slots - Array of time slots in format "HH:00"
     */
    blockTimeSlots(date, slots) {
        // Don't block slots if the entire day is already blocked
        if (this.calendarData.blockedDays.includes(date)) {
            console.warn(`Cannot block specific slots on ${date} because the entire day is blocked.`);
            return;
        }
        
        // Initialize array for this date if it doesn't exist
        if (!this.calendarData.blockedSlots[date]) {
            this.calendarData.blockedSlots[date] = [];
        }
        
        // Add each slot that isn't already blocked
        slots.forEach(slot => {
            if (!this.calendarData.blockedSlots[date].includes(slot)) {
                this.calendarData.blockedSlots[date].push(slot);
            }
        });
        
        this.saveCalendarData();
    }
    
    /**
     * Unblock specific time slots on a day
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @param {array} slots - Array of time slots in format "HH:00"
     */
    unblockTimeSlots(date, slots) {
        if (!this.calendarData.blockedSlots[date]) {
            return; // No blocked slots for this date
        }
        
        // Remove each specified slot
        slots.forEach(slot => {
            const index = this.calendarData.blockedSlots[date].indexOf(slot);
            if (index !== -1) {
                this.calendarData.blockedSlots[date].splice(index, 1);
            }
        });
        
        // Remove the date entry if no slots are blocked
        if (this.calendarData.blockedSlots[date].length === 0) {
            delete this.calendarData.blockedSlots[date];
        }
        
        this.saveCalendarData();
    }
    
    /**
     * Add a booked slot (after customer completes checkout)
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @param {string} slot - Time slot in format "HH:00"
     * @param {object} bookingData - Additional booking info (customer details, service type, etc.)
     * @returns {boolean} Success
     */
    addBooking(date, slot, bookingData = {}) {
        // Check if slot is available
        if (!this.isSlotAvailable(date, slot)) {
            console.error(`Slot ${slot} on ${date} is not available for booking.`);
            return false;
        }
        
        // Initialize array for this date if it doesn't exist
        if (!this.calendarData.bookedSlots[date]) {
            this.calendarData.bookedSlots[date] = [];
        }
        
        // Add booking with metadata
        this.calendarData.bookedSlots[date].push({
            time: slot,
            customerName: bookingData.customerName || '',
            customerEmail: bookingData.customerEmail || '',
            customerPhone: bookingData.customerPhone || '',
            serviceType: bookingData.serviceType || '',
            notes: bookingData.notes || '',
            createdAt: new Date().toISOString()
        });
        
        this.saveCalendarData();
        return true;
    }
    
    /**
     * Remove a booking (admin function)
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @param {string} slot - Time slot in format "HH:00"
     */
    removeBooking(date, slot) {
        if (!this.calendarData.bookedSlots[date]) {
            return; // No bookings for this date
        }
        
        // Find and remove the booking
        this.calendarData.bookedSlots[date] = this.calendarData.bookedSlots[date].filter(booking => booking.time !== slot);
        
        // Remove the date entry if no bookings remain
        if (this.calendarData.bookedSlots[date].length === 0) {
            delete this.calendarData.bookedSlots[date];
        }
        
        this.saveCalendarData();
    }
    
    /**
     * Check if a specific date is completely blocked
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @returns {boolean} True if date is blocked
     */
    isDateBlocked(date) {
        return this.calendarData.blockedDays.includes(date);
    }
    
    /**
     * Check if a specific time slot is available
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @param {string} slot - Time slot in format "HH:00"
     * @returns {boolean} True if slot is available
     */
    isSlotAvailable(date, slot) {
        // Check if date is completely blocked
        if (this.isDateBlocked(date)) {
            return false;
        }
        
        // Check if slot is specifically blocked
        if (this.calendarData.blockedSlots[date] && this.calendarData.blockedSlots[date].includes(slot)) {
            return false;
        }
        
        // Check if slot is already booked
        if (this.calendarData.bookedSlots[date]) {
            const bookedTimes = this.calendarData.bookedSlots[date].map(booking => booking.time);
            if (bookedTimes.includes(slot)) {
                return false;
            }
        }
        
        // Check if slot is within business hours for that day of week
        const dayOfWeek = this.getDayOfWeek(date).toLowerCase();
        if (!this.calendarData.businessHours[dayOfWeek].includes(slot)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if a date is a future calendar day (not today)
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @returns {boolean} True if date is at least tomorrow
     */
    isNextDayOrLater(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of today
        
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0); // Set to beginning of the appointment date
        
        // Check if appointment date is at least tomorrow
        return appointmentDate > today;
    }
    
    /**
     * Check if a slot requires a phone call (same day)
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @returns {boolean} True if slot is for today
     */
    isRequiringPhoneCall(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of today
        
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0); // Set to beginning of the appointment date
        
        // If dates are equal (same day), requires a call
        return appointmentDate.getTime() === today.getTime();
    }
    
    /**
     * Get day of week from date string
     * @param {string} dateStr - Date in format "YYYY-MM-DD"
     * @returns {string} Day of week
     */
    getDayOfWeek(dateStr) {
        const date = new Date(dateStr);
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    }
    
    /**
     * Get all available slots for a specific date
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @returns {array} Array of available time slots
     */
    getAvailableSlots(date) {
        // If date is blocked, return empty array
        if (this.isDateBlocked(date)) {
            return [];
        }
        
        // Get business hours for the day of week
        const dayOfWeek = this.getDayOfWeek(date).toLowerCase();
        const businessHours = this.calendarData.businessHours[dayOfWeek];
        
        // Filter out blocked and booked slots
        return businessHours.filter(slot => this.isSlotAvailable(date, slot));
    }
    
    /**
     * Get all available slots for a specific date for online booking
     * (respects next-day booking rule)
     * @param {string} date - Date in format "YYYY-MM-DD"
     * @param {boolean} enforceNextDayRule - Whether to enforce the next-day rule
     * @returns {object} Object with arrays of available slots and a message
     */
    getAvailableSlotsForOnlineBooking(date, enforceNextDayRule = true) {
        // Check if today
        const isSameDay = this.isRequiringPhoneCall(date);
        
        // Get all available slots
        const availableSlots = this.getAvailableSlots(date);
        
        // For next-day rule, display different message
        if (isSameDay && enforceNextDayRule) {
            return {
                slots: availableSlots,
                isSameDay: true,
                message: "Same-day appointments require phone confirmation. Please call (123) 456-7890.",
                shouldCallInstead: true
            };
        }
        
        return {
            slots: availableSlots,
            isSameDay: isSameDay,
            message: availableSlots.length === 0 ? 
                "No available time slots for this date." : 
                "Please select a time slot.",
            shouldCallInstead: false
        };
    }
    
    /**
     * Get all bookings for a specified date range
     * @param {string} startDate - Start date in format "YYYY-MM-DD"
     * @param {string} endDate - End date in format "YYYY-MM-DD"
     * @returns {object} Object with dates as keys and bookings as values
     */
    getBookingsInRange(startDate, endDate) {
        const bookings = {};
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Iterate through each date in range
        const current = new Date(start);
        while (current <= end) {
            const dateStr = this.formatDate(current);
            if (this.calendarData.bookedSlots[dateStr]) {
                bookings[dateStr] = this.calendarData.bookedSlots[dateStr];
            }
            current.setDate(current.getDate() + 1);
        }
        
        return bookings;
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
     * Get calendar data for a specific month
     * Useful for UI rendering of a month view
     * @param {number} year - Year (e.g., 2025)
     * @param {number} month - Month (1-12)
     * @returns {object} Calendar data for month
     */
    getMonthData(year, month) {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const daysInMonth = lastDay.getDate();
        
        const monthData = {
            year,
            month,
            daysInMonth,
            firstDayOfWeek: firstDay.getDay(), // 0 (Sunday) to 6 (Saturday)
            days: []
        };
        
        // Build data for each day in month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayOfWeek = new Date(date).getDay(); // 0-6
            
            // Determine availability
            const isBlocked = this.isDateBlocked(date);
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
            const businessHours = this.calendarData.businessHours[dayName.toLowerCase()];
            const isClosed = businessHours.length === 0;
            
            // Count available and total slots
            let availableSlots = 0;
            if (!isBlocked && !isClosed) {
                availableSlots = this.getAvailableSlots(date).length;
            }
            
            // Count bookings
            const bookings = this.calendarData.bookedSlots[date] || [];
            
            monthData.days.push({
                day,
                date,
                dayOfWeek,
                isBlocked,
                isClosed,
                availableSlots,
                totalSlots: businessHours.length,
                bookingCount: bookings.length
            });
        }
        
        return monthData;
    }
}

// Create global instance if running in browser
if (typeof window !== 'undefined') {
    window.appointmentCalendar = new AppointmentCalendar();
}