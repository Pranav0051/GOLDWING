"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
    Users, Banknote, Ticket, CalendarClock, TrendingUp,
    X, Plus, Edit, Trash2, AlertCircle, Home, LogOut, ChevronDown, ChevronUp
} from "lucide-react";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { bookingStore, Booking } from "../utils/bookingStore";
// --- CONSTANTS ---
const PACKAGES = [
    { id: "basic", name: "Basic Ride", price: 3499 },
    { id: "premium", name: "Premium Ride", price: 5999 },
    { id: "sunrise", name: "Sunrise Special", price: 8999 },
];
const INSURANCE_PRICE = 200;
const GST_RATE = 0.18;
const COLORS = ["#D4AF37", "#f97316", "#3b82f6", "#10b981"]; // Theme colors
const PIE_COLORS = ["#3b82f6", "#f97316"]; // Online = Blue, Offline = Orange

export function AdminDashboard() {
    const navigate = useNavigate();
    const [isLightTheme, setIsLightTheme] = useState(false);

    useEffect(() => {
        // Initial check
        setIsLightTheme(document.documentElement.classList.contains("light-theme"));

        // Watch for theme changes
        const observer = new MutationObserver(() => {
            setIsLightTheme(document.documentElement.classList.contains("light-theme"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => observer.disconnect();
    }, []);

    // Initialize from localStorage or default to true
    const [isOnlineBookingOpen, setIsOnlineBookingOpen] = useState(() => {
        const saved = localStorage.getItem("onlineBookingOpen");
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getBookings());

    // Sync toggle with localStorage and listen for booking changes
    useEffect(() => {
        localStorage.setItem("onlineBookingOpen", JSON.stringify(isOnlineBookingOpen));

        const handleUpdate = () => {
            setBookings(bookingStore.getBookings());
        };

        window.addEventListener('bookingsChanged', handleUpdate);
        return () => window.removeEventListener('bookingsChanged', handleUpdate);
    }, [isOnlineBookingOpen]);

    // Filters
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    // Modal & Delete States
    const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedBookingId(prev => (prev === id ? null : id));
    };

    // Form State (Offline Booking)
    const [newBooking, setNewBooking] = useState({
        customerName: "", persons: 1, slot: "06:00 AM", phone: "", date: "", package: "premium", paymentMethod: "UPI", passengers: [] as { name: string, age: string }[]
    });

    // --- COMPUTED DATA ---
    const today = new Date().toISOString().split("T")[0];

    const stats = useMemo(() => {
        const total = bookings.length;
        const online = bookings.filter(b => b.type === "ONLINE").length;
        const offline = bookings.filter(b => b.type === "OFFLINE").length;
        const todayBookings = bookings.filter(b => b.date === today).length;
        const revenue = bookings.reduce((sum, b) => b.status !== "Cancelled" ? sum + b.price : sum, 0);

        return { total, online, offline, todayBookings, revenue };
    }, [bookings, today]);

    const pieData = [
        { name: "Online", value: stats.online },
        { name: "Offline", value: stats.offline }
    ];

    const barData = PACKAGES.map(pkg => ({
        name: pkg.name,
        revenue: bookings.filter(b => b.status === "Confirmed" && b.price >= pkg.price).reduce((sum, b) => {
            return sum + (b.price);
        }, 0)
    }));

    // Filtered Table Data
    const filteredBookings = bookings.filter(b => {
        if (filterType !== "All" && b.type !== filterType.toUpperCase()) return false;
        if (filterStatus !== "All" && b.status !== filterStatus) return false;
        if (filterDate && b.date !== filterDate) return false;
        return true;
    });

    // --- HANDLERS ---
    const handleStatusChange = (id: string, newStatus: string) => {
        bookingStore.updateStatus(id, newStatus as Booking['status']);
    };

    const handleDelete = (id: string) => {
        bookingStore.deleteBooking(id);
        setDeleteConfirmId(null);
    };

    const handleCreateOfflineBooking = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedPkg = PACKAGES.find((p) => p.id === newBooking.package);
        const basicTourAmount = (selectedPkg?.price || 0) * newBooking.persons;
        const totalInsurance = INSURANCE_PRICE * newBooking.persons;
        const amountBeforeGst = basicTourAmount + totalInsurance;
        const gstAmount = amountBeforeGst * GST_RATE;
        const finalTotalAmount = amountBeforeGst + gstAmount;

        if (!newBooking.customerName || !newBooking.date) return;

        if (newBooking.persons > 1) {
            for (let i = 0; i < newBooking.persons - 1; i++) {
                if (!newBooking.passengers[i]?.name?.trim() || !newBooking.passengers[i]?.age?.trim()) {
                    alert(`Please fill out the name and age for Passenger ${i + 2}`);
                    return;
                }
            }
        }

        const createdBooking: Booking = {
            id: `GW-${Math.floor(Math.random() * 900000 + 100000)}`,
            customerName: newBooking.customerName,
            persons: newBooking.persons,
            passengers: newBooking.passengers.slice(0, newBooking.persons - 1),
            slot: newBooking.slot,
            category: newBooking.persons === 1 ? "Solo" : newBooking.persons === 2 ? "Couple" : "Group",
            type: "OFFLINE",
            date: newBooking.date,
            status: "Confirmed",
            price: Math.round(finalTotalAmount),
            paymentMethod: newBooking.paymentMethod
        };

        bookingStore.addBooking(createdBooking);
        setIsOfflineModalOpen(false);
        setNewBooking({ customerName: "", persons: 1, slot: "06:00 AM", phone: "", date: "", package: "premium", paymentMethod: "UPI", passengers: [] });
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isLightTheme ? "bg-gray-50 text-gray-900" : "bg-[#05070A] text-white"} p-4 md:p-8 font-sans`}>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Toggle */}
                <div className={`flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b ${isLightTheme ? "border-gray-200" : "border-white/10"} gap-6`}>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => navigate("/?skipLoader=true")}
                            className={`flex-shrink-0 w-12 h-12 md:w-10 md:h-10 ${isLightTheme ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"} rounded-xl flex items-center justify-center transition-all border group`}
                            title="Back to Home"
                        >
                            <Home className="w-5 h-5 group-hover:text-[#D4AF37]" />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                            <p className={`text-xs md:sm ${isLightTheme ? "text-gray-500" : "text-white/60"}`}>Manage bookings, revenue, and system settings</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsOfflineModalOpen(true)}
                            className="bg-[#D4AF37] hover:bg-[#F7C948] text-black font-bold px-5 py-3 rounded-xl flex items-center justify-center transition shadow-lg shadow-amber-500/10 order-2 sm:order-1"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Create Ticket
                        </button>
                        <div className={`flex items-center justify-between sm:justify-start gap-4 ${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-3 rounded-xl border order-1 sm:order-2`}>
                            <span className="text-sm font-semibold">Online Status</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsOnlineBookingOpen(!isOnlineBookingOpen)}
                                    className={`relative inline-flex h-7 w-12 md:h-8 md:w-16 items-center rounded-full transition-colors focus:outline-none ${isOnlineBookingOpen ? 'bg-green-500' : 'bg-red-500'}`}
                                >
                                    <span className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform ${isOnlineBookingOpen ? 'translate-x-[22px] md:translate-x-9' : 'translate-x-1'}`} />
                                </button>
                                <span className={`px-2 py-0.5 text-[10px] md:text-xs font-bold rounded-full border ${isOnlineBookingOpen ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                    {isOnlineBookingOpen ? "OPEN" : "CLOSED"}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("isAdminLoggedIn");
                                navigate("/login?skipLoader=true");
                            }}
                            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold transition-all group order-3"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-5 rounded-2xl shadow-sm border`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`${isLightTheme ? "text-gray-500" : "text-white/60"} text-xs font-semibold uppercase`}>Total Bookings</p>
                                <p className={`text-2xl font-bold mt-1 ${isLightTheme ? "text-gray-900" : "text-white"}`}>{stats.total}</p>
                            </div>
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><Ticket className="w-5 h-5" /></div>
                        </div>
                    </div>
                    <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-5 rounded-2xl shadow-sm border`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`${isLightTheme ? "text-gray-500" : "text-white/60"} text-xs font-semibold uppercase`}>Online Bookings</p>
                                <p className="text-2xl font-bold mt-1 text-blue-500">{stats.online}</p>
                            </div>
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                        </div>
                    </div>
                    <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-5 rounded-2xl shadow-sm border`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`${isLightTheme ? "text-gray-500" : "text-white/60"} text-xs font-semibold uppercase`}>Offline Bookings</p>
                                <p className="text-2xl font-bold mt-1 text-orange-500">{stats.offline}</p>
                            </div>
                            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg"><Users className="w-5 h-5" /></div>
                        </div>
                    </div>
                    <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-5 rounded-2xl shadow-sm border`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`${isLightTheme ? "text-gray-500" : "text-white/60"} text-xs font-semibold uppercase`}>Today's Bookings</p>
                                <p className="text-2xl font-bold mt-1 text-green-600">{stats.todayBookings}</p>
                            </div>
                            <div className="p-2 bg-green-500/20 text-green-600 rounded-lg"><CalendarClock className="w-5 h-5" /></div>
                        </div>
                    </div>
                    <div className={`${isLightTheme ? "bg-amber-50 border-amber-200" : "bg-[#1A1810] border-[#D4AF37]/30"} p-5 rounded-2xl shadow-sm border`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`${isLightTheme ? "text-amber-700/80" : "text-[#D4AF37]/80"} text-xs font-semibold uppercase`}>Total Revenue</p>
                                <p className={`text-2xl font-bold mt-1 ${isLightTheme ? "text-amber-700" : "text-[#D4AF37]"}`}>₹{stats.revenue.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg"><Banknote className="w-5 h-5" /></div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-6 rounded-2xl shadow-sm border`}>
                        <h3 className="text-lg font-bold mb-4">Online vs Offline Bookings</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: isLightTheme ? '#fff' : '#111827', borderColor: isLightTheme ? '#e5e7eb' : '#374151', color: isLightTheme ? '#111' : '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} p-6 rounded-2xl shadow-sm border`}>
                        <h3 className="text-lg font-bold mb-4">Revenue by Package</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" stroke={isLightTheme ? "#9ca3af" : "#6b7280"} />
                                    <YAxis stroke={isLightTheme ? "#9ca3af" : "#6b7280"} />
                                    <Tooltip contentStyle={{ backgroundColor: isLightTheme ? '#fff' : '#111827', borderColor: isLightTheme ? '#e5e7eb' : '#374151', color: isLightTheme ? '#111' : '#fff' }} cursor={{ fill: isLightTheme ? '#f3f4f6' : '#374151', opacity: 0.4 }} />
                                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                        {barData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Booking Table & Filters */}
                <div className={`${isLightTheme ? "bg-white border-gray-200" : "bg-[#111827] border-white/10"} rounded-2xl shadow-sm border overflow-hidden`}>
                    <div className={`p-6 border-b ${isLightTheme ? "border-gray-200 bg-[#F1F5F9]" : "border-white/10 bg-[#0f172a]"} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                        <h2 className="text-xl font-bold flex items-center">
                            <Ticket className="w-5 h-5 mr-2 text-[#D4AF37]" /> All Bookings
                        </h2>
                    </div>

                    <div className={`p-5 grid grid-cols-1 md:grid-cols-4 gap-4 ${isLightTheme ? "bg-gray-50" : "bg-white/5"} border-b ${isLightTheme ? "border-gray-200" : "border-white/10"}`}>
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider ${isLightTheme ? "text-gray-600" : "text-white/50"} mb-1.5 block`}>Type</label>
                            <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`w-full ${isLightTheme ? "bg-white border-gray-300 text-gray-900 shadow-sm" : "bg-[#0B0F19] border-white/10 text-white"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] transition-all`}>
                                <option value="All">All Types</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider ${isLightTheme ? "text-gray-600" : "text-white/50"} mb-1.5 block`}>Status</label>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`w-full ${isLightTheme ? "bg-white border-gray-300 text-gray-900 shadow-sm" : "bg-[#0B0F19] border-white/10 text-white"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] transition-all`}>
                                <option value="All">All Statuses</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider ${isLightTheme ? "text-gray-600" : "text-white/50"} mb-1.5 block`}>Date Flight</label>
                            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className={`w-full ${isLightTheme ? "bg-white border-gray-300 text-gray-900 shadow-sm" : "bg-[#0B0F19] border-white/10 text-white"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] transition-all`} />
                        </div>
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className={`text-xs uppercase font-bold tracking-wider ${isLightTheme ? "text-gray-700 bg-gray-100" : "text-white/60 bg-white/5"}`}>
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-lg">Ticket No.</th>
                                    <th className="px-6 py-4">Name & Persons</th>
                                    <th className="px-6 py-4">Booking Type</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Slot</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-[#D4AF37]">Total Price</th>
                                    <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isLightTheme ? "divide-gray-100" : "divide-white/10"}`}>
                                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                                    <React.Fragment key={booking.id}>
                                        <tr className={`${isLightTheme ? "hover:bg-gray-50" : "hover:bg-white/5"} transition-colors text-white`}>
                                            <td className={`px-6 py-4 font-bold ${isLightTheme ? "text-gray-900" : "text-white"} whitespace-nowrap`}>{booking.id}</td>
                                            <td className="px-6 py-4">
                                                <div className={`font-medium ${isLightTheme ? "text-gray-900" : "text-white"}`}>{booking.customerName}</div>
                                                <div
                                                    className={`inline-flex items-center gap-1 text-xs mt-1 select-none ${booking.persons > 1 ? "cursor-pointer hover:text-[#D4AF37] transition-colors" : ""} ${isLightTheme ? "text-gray-500" : "text-white/50"}`}
                                                    onClick={() => booking.persons > 1 && toggleExpand(booking.id)}
                                                    title={booking.persons > 1 ? "View passenger details" : ""}
                                                >
                                                    {booking.persons} {booking.persons === 1 ? 'Person' : 'Persons'}
                                                    {booking.persons > 1 && (
                                                        expandedBookingId === booking.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-lg font-semibold ${booking.type === 'ONLINE' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/20' : 'bg-orange-500/20 text-orange-500 border border-orange-500/20'}`}>
                                                    {booking.type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 tabular-nums ${isLightTheme ? "text-gray-600" : "text-white/80"}`}>{booking.date}</td>
                                            <td className={`px-6 py-4 font-semibold ${isLightTheme ? "text-gray-700" : "text-white/80"} whitespace-nowrap`}>{booking.slot}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                    className={`bg-transparent border ${booking.status === 'Confirmed' ? 'border-green-500 text-green-500' : booking.status === 'Pending' ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-500'} rounded-lg px-2 py-1 text-xs focus:outline-none`}
                                                >
                                                    <option value="Confirmed" className={isLightTheme ? "bg-white text-black" : "bg-[#111827] text-white"}>Confirmed</option>
                                                    <option value="Pending" className={isLightTheme ? "bg-white text-black" : "bg-[#111827] text-white"}>Pending</option>
                                                    <option value="Cancelled" className={isLightTheme ? "bg-white text-black" : "bg-[#111827] text-white"}>Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-[#D4AF37] tabular-nums font-semibold">₹{booking.price}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2 text-white">
                                                <button className={`${isLightTheme ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "text-white/50 hover:text-white hover:bg-white/10"} p-2 rounded-lg transition`} title="Print Ticket"><Ticket className="w-4 h-4" /></button>
                                                <button className={`${isLightTheme ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "text-white/50 hover:text-white hover:bg-white/10"} p-2 rounded-lg transition`} title="Edit (Disabled)"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => setDeleteConfirmId(booking.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                        {/* Expanded passenger rows */}
                                        {expandedBookingId === booking.id && booking.passengers && booking.passengers.length > 0 && (
                                            <tr className={isLightTheme ? "bg-green-50/50" : "bg-white/[0.02]"}>
                                                <td colSpan={8} className="px-6 py-4">
                                                    <div className={`p-4 rounded-xl border ${isLightTheme ? "bg-white border-yellow-200" : "bg-[#0B0F19] border-white/10"}`}>
                                                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLightTheme ? "text-gray-800" : "text-white/70"}`}>Passenger Details</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {booking.passengers.map((p, idx) => (
                                                                <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${isLightTheme ? "border-gray-100 bg-gray-50" : "border-white/5 bg-white/5"} transition-colors`}>
                                                                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                                                                        P{idx + 1}
                                                                    </div>
                                                                    <div>
                                                                        <div className={`text-sm font-semibold truncate ${isLightTheme ? "text-gray-900" : "text-white"}`}>{p.name || "N/A"}</div>
                                                                        <div className={`text-xs ${isLightTheme ? "text-gray-500" : "text-white/50"}`}>Age: {p.age || "N/A"}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className={`px-6 py-12 text-center ${isLightTheme ? "text-gray-400" : "text-white/50"}`}>
                                            No bookings found matching filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View for Bookings */}
                    <div className="md:hidden divide-y divide-white/10 divide-gray-100">
                        {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                            <div key={booking.id} className={`p-5 space-y-4 ${isLightTheme ? "bg-white" : "bg-[#111827]"}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className={`text-xs font-bold ${isLightTheme ? "text-gray-400" : "text-white/30"}`}>{booking.id}</div>
                                        <div className={`text-lg font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}>{booking.customerName}</div>
                                        <div
                                            className={`inline-flex items-center gap-1 text-xs mt-0.5 select-none ${booking.persons > 1 ? "cursor-pointer text-[#D4AF37]" : ""} ${isLightTheme ? "text-gray-500" : "text-white/50"}`}
                                            onClick={() => booking.persons > 1 && toggleExpand(booking.id)}
                                        >
                                            {booking.persons} {booking.persons === 1 ? 'Person' : 'Persons'}
                                            {booking.persons > 1 && (
                                                expandedBookingId === booking.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className={`${isLightTheme ? "bg-gray-100 text-gray-600" : "bg-white/5 text-white/50"} p-2 rounded-lg`}><Ticket className="w-4 h-4" /></button>
                                        <button onClick={() => setDeleteConfirmId(booking.id)} className="bg-red-500/10 text-red-500 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${isLightTheme ? "text-gray-400" : "text-white/30"}`}>Type & Date</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-[10px] rounded-md font-bold ${booking.type === 'ONLINE' ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                                {booking.type}
                                            </span>
                                            <span className={isLightTheme ? "text-gray-600" : "text-white/70"}>{booking.date}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`text-[10px] uppercase font-bold tracking-wider ${isLightTheme ? "text-gray-400" : "text-white/30"}`}>Slot & Total</p>
                                        <div className="mt-1">
                                            <span className={`font-bold ${isLightTheme ? "text-gray-800" : "text-white"}`}>{booking.slot}</span>
                                            <span className="mx-1.5 opacity-30 text-white">|</span>
                                            <span className="text-[#D4AF37] font-bold">₹{booking.price}</span>
                                        </div>
                                    </div>
                                </div>

                                {expandedBookingId === booking.id && booking.passengers && booking.passengers.length > 0 && (
                                    <div className="pt-2">
                                        <div className={`p-3 rounded-xl border ${isLightTheme ? "bg-gray-50 border-yellow-200" : "bg-[#0B0F19] border-white/10"}`}>
                                            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isLightTheme ? "text-gray-800" : "text-white/70"}`}>Passenger Details</h4>
                                            <div className="space-y-2">
                                                {booking.passengers.map((p, idx) => (
                                                    <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border ${isLightTheme ? "border-gray-100 bg-white" : "border-white/5 bg-white/5"}`}>
                                                        <div className={`text-xs font-semibold ${isLightTheme ? "text-gray-900" : "text-white"}`}>P{idx + 1}. {p.name || "N/A"}</div>
                                                        <div className={`text-[10px] ${isLightTheme ? "text-gray-500" : "text-white/50"}`}>Age: {p.age || "-"}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        className={`w-full bg-transparent border ${booking.status === 'Confirmed' ? 'border-green-500 text-green-500' : booking.status === 'Pending' ? 'border-yellow-500 text-yellow-600' : 'border-red-500 text-red-500'} rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none`}
                                    >
                                        <option value="Confirmed" className={isLightTheme ? "bg-white text-gray-900" : "bg-[#111827] text-white"}>Confirmed</option>
                                        <option value="Pending" className={isLightTheme ? "bg-white text-gray-900" : "bg-[#111827] text-white"}>Pending</option>
                                        <option value="Cancelled" className={isLightTheme ? "bg-white text-gray-900" : "bg-[#111827] text-white"}>Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        )) : (
                            <div className={`p-10 text-center ${isLightTheme ? "text-gray-400" : "text-white/30"}`}>No bookings found.</div>
                        )}
                    </div>
                </div>

                {/* Offline Booking Modal */}
                <AnimatePresence>
                    {isOfflineModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#111827] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
                            >
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#111827] to-[#1a2235]">
                                    <h3 className="text-xl font-bold">Create Offline Booking</h3>
                                    <button onClick={() => setIsOfflineModalOpen(false)} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
                                </div>
                                <form onSubmit={handleCreateOfflineBooking} className="p-6 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm text-white/70">Customer Name</label>
                                                <input required type="text" value={newBooking.customerName} onChange={e => setNewBooking({ ...newBooking, customerName: e.target.value })} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. John Doe" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-white/70">Total Persons</label>
                                                <input required type="number" min="1" value={newBooking.persons} onChange={e => setNewBooking({ ...newBooking, persons: parseInt(e.target.value) || 1 })} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#D4AF37]" placeholder="1" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm text-white/70">Flight Date</label>
                                                <input required type="date" min={today} value={newBooking.date} onChange={e => setNewBooking({ ...newBooking, date: e.target.value })} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#D4AF37]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm text-white/70">Slot Time</label>
                                                <select required value={newBooking.slot} onChange={e => setNewBooking({ ...newBooking, slot: e.target.value })} className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#D4AF37]">
                                                    <option value="06:00 AM">06:00 AM</option>
                                                    <option value="07:30 AM">07:30 AM</option>
                                                    <option value="04:30 PM">04:30 PM</option>
                                                    <option value="06:30 PM">06:30 PM</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm text-white/70">Payment Method</label>
                                                <select required value={newBooking.paymentMethod} onChange={e => setNewBooking({ ...newBooking, paymentMethod: e.target.value })} className="w-full bg-[#0B0F19] border border-emerald-500/50 text-emerald-400 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                                    <option value="UPI">UPI Payment</option>
                                                    <option value="Card">Credit / Debit Card</option>
                                                    <option value="Cash">Cash Counter</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm text-white/70 block">Package Selection</label>
                                            <select required value={newBooking.package} onChange={e => setNewBooking({ ...newBooking, package: e.target.value })} className="w-full bg-[#0B0F19] border border-[#D4AF37] text-[#D4AF37] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-bold">
                                                {PACKAGES.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name} (₹{pkg.price})</option>)}
                                            </select>
                                        </div>

                                        {newBooking.persons > 1 && (
                                            <div className="space-y-3">
                                                <label className="text-sm text-white/70">Other Passenger Details</label>
                                                {Array.from({ length: newBooking.persons - 1 }).map((_, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder={`Passenger ${i + 2} Name`}
                                                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#D4AF37]"
                                                            onChange={(e) => {
                                                                const p = [...newBooking.passengers];
                                                                p[i] = { ...p[i], name: e.target.value };
                                                                setNewBooking({ ...newBooking, passengers: p });
                                                            }}
                                                        />
                                                        <input
                                                            required
                                                            type="number"
                                                            placeholder="Age"
                                                            className="w-24 bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#D4AF37]"
                                                            onChange={(e) => {
                                                                const p = [...newBooking.passengers];
                                                                p[i] = { ...p[i], age: e.target.value };
                                                                setNewBooking({ ...newBooking, passengers: p });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {(() => {
                                        const selectedPkg = PACKAGES.find((p) => p.id === newBooking.package);
                                        const basicTourAmount = (selectedPkg?.price || 0) * newBooking.persons;
                                        const totalInsurance = INSURANCE_PRICE * newBooking.persons;
                                        const amountBeforeGst = basicTourAmount + totalInsurance;
                                        const gstAmount = amountBeforeGst * GST_RATE;
                                        const finalTotalAmount = amountBeforeGst + gstAmount;

                                        return (
                                            <div className="w-full md:w-[320px] flex flex-col justify-between h-full space-y-4">
                                                <div className="p-5 bg-[#0B0F19] border border-white/10 rounded-xl space-y-4 text-sm text-white/70 font-mono shadow-inner">
                                                    <div className="flex justify-between">
                                                        <span>Basic ({newBooking.persons}x ₹{selectedPkg?.price})</span>
                                                        <span>₹{basicTourAmount}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Insurance ({newBooking.persons}x ₹{INSURANCE_PRICE})</span>
                                                        <span>₹{totalInsurance}</span>
                                                    </div>
                                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                                        <span>GST (18%)</span>
                                                        <span>₹{gstAmount.toFixed(0)}</span>
                                                    </div>
                                                    <div className="flex justify-between pt-1 font-bold text-xl text-[#D4AF37]">
                                                        <span>Final Total</span>
                                                        <span>₹{finalTotalAmount.toFixed(0)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3 mt-auto">
                                                    <button type="submit" className="w-full py-3 bg-[#D4AF37] hover:bg-[#F7C948] text-black font-bold rounded-xl transition shadow-lg">Create Booking</button>
                                                    <button type="button" onClick={() => setIsOfflineModalOpen(false)} className="w-full py-3 rounded-xl text-white/70 hover:bg-white/10 transition border border-white/10">Cancel</button>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteConfirmId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#111827] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 mb-2">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold">Delete Booking?</h3>
                                <p className="text-white/60 text-sm">Are you sure you want to delete tracking for booking <span className="font-bold text-white">{deleteConfirmId}</span>? This action cannot be undone.</p>
                                <div className="flex justify-center gap-3 mt-6">
                                    <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">Cancel</button>
                                    <button onClick={() => handleDelete(deleteConfirmId)} className="px-6 py-2 bg-red-500 hover:bg-red-600 font-bold rounded-xl transition">Yes, Delete</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
