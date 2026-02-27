"use client";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Copy, Users, Target, Trophy, ArrowRight, UserPlus, Link as LinkIcon, BadgePercent, Home, LogOut, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { bookingStore } from "../utils/bookingStore";

export function AgentDashboard() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Dynamic Agent Stats
    const agentData = useMemo(() => {
        const allBookings = bookingStore.getBookings();
        const agentBookings = allBookings.filter(b => b.agentRef === "AGT105" && b.status !== "Cancelled");
        const totalBookings = agentBookings.length;
        const totalSeatsSold = agentBookings.reduce((sum, b) => sum + b.persons, 0);
        const commissionEarned = totalSeatsSold * 200; // ₹200 per seat
        return {
            id: "AGT105",
            name: "Rahul Sharma",
            level: totalBookings > 100 ? "Gold" : totalBookings > 50 ? "Silver" : "Bronze",
            totalBookings,
            totalSeatsSold,
            commissionEarned,
            pendingCommission: totalSeatsSold * 50, // Mock pending
            withdrawableBalance: commissionEarned * 0.6, // Mock balance
            conversionRate: "12.4%",
            rank: 3,
            totalAgents: 45
        };
    }, []);

    const referralLink = `${window.location.origin}/book?ref=${agentData.id}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const startAssistedBooking = () => {
        // Navigate to booking system pre-filled with agent code
        navigate(`/book?ref=${agentData.id}`);
    };

    return (
        <div className="min-h-[100dvh] bg-[#0B0F19] p-4 md:p-8 font-sans text-white overflow-x-hidden">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <Link to="/?skipLoader=true" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-xl transition-all group">
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Back to Home
                    </Link>

                    <button onClick={() => navigate("/login?skipLoader=true")} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold transition-all group">
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>

                {/* Header & Level badge */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl gap-6 md:gap-4">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-700 to-[#111827] border-2 border-[#D4AF37] flex items-center justify-center text-xl md:text-2xl font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] shrink-0">
                            {agentData.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-xl md:text-2xl font-bold text-white truncate">{agentData.name}</h1>
                            <p className="text-[#D4AF37] font-semibold flex items-center text-sm md:text-base">
                                Agent ID: {agentData.id}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="flex-1 md:flex-none flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-white">
                            <span className="text-[10px] text-white/60 mb-1 uppercase tracking-wider">Top Rank</span>
                            <span className="font-bold text-lg flex items-center gap-1.5"><Trophy className="w-4 h-4 text-[#D4AF37]" /> #{agentData.rank}</span>
                        </div>
                        <div className="flex-1 md:flex-none flex flex-col items-center justify-center p-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl text-black">
                            <Trophy className="w-4 h-4 mb-1 text-gray-800" />
                            <span className="font-bold text-xs tracking-widest uppercase">{agentData.level}</span>
                            <span className="text-[9px] text-gray-800 mt-1 font-bold">{100 - agentData.totalBookings} to Gold</span>
                        </div>
                    </div>
                </div>

                {/* Action Grid (Referral & Assisted Booking) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LinkIcon className="w-24 h-24 text-white" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Your Referral Link</h2>
                        <p className="text-white/60 text-sm mb-4">Share this link to auto-track cookies for 7 days. If they book, you earn!</p>

                        <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
                            <input type="text" readOnly value={referralLink} className="bg-transparent w-full px-4 text-white/80 focus:outline-none" />
                            <button onClick={handleCopy} className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-bold flex items-center shrink-0 hover:bg-[#F7C948] transition">
                                {copied ? <span className="flex items-center"><Target className="w-4 h-4 mr-1" /> Copied</span> : <span className="flex items-center"><Copy className="w-4 h-4 mr-1" /> Copy</span>}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <UserPlus className="w-24 h-24 text-white" />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-white">Assisted Booking</h2>
                        <p className="text-white/80 text-sm mb-4">Book on behalf of a walk-in or offline customer. Booking is strictly tagged to your ID.</p>

                        <button onClick={startAssistedBooking} className="mt-2 w-full bg-white text-indigo-900 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-white/90 transition shadow-xl">
                            Create Booking for Customer <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>

                {/* Wallet & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h3 className="text-white/60 text-[10px] md:text-sm font-medium mb-1 uppercase tracking-wider">Total Earned</h3>
                        <p className="text-xl md:text-2xl font-bold text-white mb-2">₹{agentData.commissionEarned.toLocaleString()}</p>
                        <p className="text-white/40 text-[10px]">Pending: ₹{agentData.pendingCommission.toLocaleString()}</p>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h3 className="text-white/60 text-[10px] md:text-sm font-medium mb-1 uppercase tracking-wider">Bookings</h3>
                        <p className="text-xl md:text-2xl font-bold text-white mb-2">{agentData.totalBookings}</p>
                        <div className="flex items-center justify-between text-[10px] md:text-sm">
                            <span className="text-white/40">Link Clicks: 342</span>
                            <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {agentData.conversionRate}</span>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-[#111827] border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                        <h3 className="text-white/60 text-[10px] md:text-sm font-medium mb-1 uppercase tracking-wider">Seats Sold</h3>
                        <p className="text-xl md:text-2xl font-bold text-white flex items-center">
                            <Users className="w-4 h-4 mr-1 md:mr-2 text-[#D4AF37]" /> {agentData.totalSeatsSold}
                        </p>
                        <p className="text-white/40 text-[9px] md:text-[10px] mt-2 flex items-center"><BadgePercent className="w-3 h-3 mr-1" /> ₹200/seat</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
