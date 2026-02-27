"use client";
import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, ShieldCheck, XCircle, Search, ArrowLeft, Ticket, CheckCircle, X } from "lucide-react";
import { bookingStore } from "../utils/bookingStore";
export function ScannerPage() {
    const [scanData, setScanData] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 4000);
    };
    const handleSimulateScan = (e) => {
        e.preventDefault();
        setError("");
        setResult(null);
        const allBookings = bookingStore.getBookings();
        // Allow scanning by booking ID directly or the mock QR data (VERIFY:GW-1234|PAY...)
        const extractedId = scanData.includes("|") ? scanData.split("|")[0].replace("VERIFY:", "") : scanData;
        const booking = allBookings.find(b => b.id === extractedId.toUpperCase());
        if (booking) {
            setResult(booking);
        }
        else {
            setError("Invalid Ticket or Booking Not Found");
        }
    };
    const handleAdmit = () => {
        if (result && result.status !== "Cancelled") {
            bookingStore.updateStatus(result.id, "Completed");
            setResult({ ...result, status: "Completed" });
            showSuccess(`✅ ${result.customerName} marked as ATTENDED!`);
        }
    };
    return (<div className="min-h-screen bg-[#0B0F19] text-white p-4 font-sans flex flex-col items-center">
        {/* Success Toast */}
        <AnimatePresence>
            {successMsg && (<motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-8 left-1/2 z-[100] flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-semibold max-w-sm w-[90%]">
                <CheckCircle className="w-6 h-6 shrink-0" />
                <span className="flex-1 text-sm">{successMsg}</span>
                <button onClick={() => setSuccessMsg("")} className="shrink-0 p-1 hover:bg-white/20 rounded-full transition">
                    <X className="w-5 h-5" />
                </button>
            </motion.div>)}
        </AnimatePresence>

        <div className="w-full max-w-lg mb-8 mt-4 flex justify-between items-center">
            <Link to="/staff?skipLoader=true" className="flex items-center text-white/60 hover:text-white transition group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Staff Panel
            </Link>
            <div className="font-bold text-[#D4AF37] border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 rounded-full text-xs">
                DIGITAL GATE
            </div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-2xl font-bold">Ticket Scanner</h1>
                <p className="text-white/50 text-sm mt-1">Scan customer QR or enter ID manually</p>
            </div>

            <form onSubmit={handleSimulateScan} className="mb-6 relative">
                <input type="text" placeholder="e.g. GW-847291" value={scanData} onChange={(e) => setScanData(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl pl-4 pr-12 py-4 text-center font-mono text-lg uppercase focus:outline-none transition-colors" autoFocus />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition">
                    <Search className="w-5 h-5" />
                </button>
            </form>

            {error && (<motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-start gap-3">
                <XCircle className="w-6 h-6 shrink-0" />
                <div>
                    <p className="font-bold">Scan Failed</p>
                    <p className="text-sm opacity-80">{error}</p>
                </div>
            </motion.div>)}

            {result && (<motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                <div className={`p-5 rounded-2xl border ${result.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/30' : result.status === 'Completed' ? 'bg-gray-800/50 border-gray-700' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">{result.customerName}</h2>
                            <p className="text-white/60 font-mono mt-1 text-sm">{result.id}</p>
                        </div>
                        {result.status === 'Cancelled' ? (<span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"><XCircle className="w-4 h-4 inline mr-1" /> CANCELLED</span>) : result.status === 'Completed' ? (<span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"><ShieldCheck className="w-4 h-4 inline mr-1" /> ATTENDED</span>) : (<span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"><ShieldCheck className="w-4 h-4 inline mr-1" /> VALID ENTRY</span>)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 bg-black/20 p-4 rounded-xl">
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">DATE</p>
                            <p className="font-bold text-sm">{result.date}</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">SLOT</p>
                            <p className="font-bold text-sm">{result.slot}</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">PASSENGERS</p>
                            <p className="font-bold text-sm flex items-center"><Ticket className="w-4 h-4 mr-1 text-[#D4AF37]" /> {result.persons} {result.persons > 1 ? 'PAX' : 'PERSON'}</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">PAYMENT</p>
                            <p className="font-bold text-sm text-green-400">{result.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                {result.status !== 'Cancelled' && result.status !== 'Completed' && (<button onClick={handleAdmit} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex justify-center items-center shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all">
                    AUTHORIZE ENTRY <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </button>)}
            </motion.div>)}

        </motion.div>
    </div>);
}
