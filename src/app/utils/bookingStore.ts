export interface Booking {
    id: string;
    customerName: string;
    persons: number;
    slot: string;
    category: string;
    type: 'ONLINE' | 'OFFLINE';
    date: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    price: number;
    paymentMethod?: string;
    agentRef?: string;
}

const STORAGE_KEY = 'goldwing_bookings';

const MOCK_INITIAL_BOOKINGS: Booking[] = [
    { id: "GW-102934", customerName: "Rahul Sharma", persons: 1, slot: "06:00 AM", category: "Solo", type: "ONLINE", date: new Date().toISOString().split('T')[0], status: "Confirmed", price: 4365 },
    { id: "GW-837462", customerName: "Priya Desai", persons: 2, slot: "07:30 AM", category: "Couple", type: "ONLINE", date: new Date().toISOString().split('T')[0], status: "Confirmed", price: 8730 },
];

export const bookingStore = {
    getBookings: (): Booking[] => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_BOOKINGS));
            return MOCK_INITIAL_BOOKINGS;
        }
        return JSON.parse(saved);
    },

    addBooking: (booking: Booking) => {
        const bookings = bookingStore.getBookings();
        const updated = [booking, ...bookings];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // Trigger a custom event so other components can react if they are on the same page (unlikely for dashboard vs book, but good practice)
        window.dispatchEvent(new Event('bookingsChanged'));
    },

    updateStatus: (id: string, status: Booking['status']) => {
        const bookings = bookingStore.getBookings();
        const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('bookingsChanged'));
    },

    deleteBooking: (id: string) => {
        const bookings = bookingStore.getBookings();
        const updated = bookings.filter(b => b.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('bookingsChanged'));
    }
};
