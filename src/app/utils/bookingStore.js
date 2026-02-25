const STORAGE_KEY = 'goldwing_bookings';
const MOCK_INITIAL_BOOKINGS = [
    { id: "GW-102934", customerName: "Rahul Sharma", persons: 1, slot: "06:00 AM", category: "Solo", type: "ONLINE", date: new Date().toISOString().split('T')[0], status: "Confirmed", price: 4365, location: "Goa" },
    { id: "GW-837462", customerName: "Priya Desai", persons: 2, slot: "07:30 AM", category: "Couple", type: "ONLINE", date: new Date().toISOString().split('T')[0], status: "Confirmed", price: 8730, location: "Goa" },
];
export const bookingStore = {
    getBookings: () => {
        if (typeof window === 'undefined')
            return [];
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_BOOKINGS));
            return MOCK_INITIAL_BOOKINGS;
        }
        return JSON.parse(saved);
    },
    addBooking: (booking) => {
        const bookings = bookingStore.getBookings();
        const updated = [booking, ...bookings];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // Trigger a custom event so other components can react if they are on the same page (unlikely for dashboard vs book, but good practice)
        window.dispatchEvent(new Event('bookingsChanged'));
    },
    updateStatus: (id, status) => {
        const bookings = bookingStore.getBookings();
        const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('bookingsChanged'));
    },
    deleteBooking: (id) => {
        const bookings = bookingStore.getBookings();
        const updated = bookings.filter(b => b.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('bookingsChanged'));
    }
};
