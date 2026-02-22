"use client";

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Users, CreditCard, Check, Shield, Download, ArrowLeft } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { bookingStore, Booking } from "../utils/bookingStore";

// Mock Data
const MOCK_SLOTS = [
    { id: 1, date: new Date().toISOString().split("T")[0], time: "06:00 AM", totalSeats: 20, bookedSeats: 20 }, // Full
    { id: 2, date: new Date().toISOString().split("T")[0], time: "07:30 AM", totalSeats: 20, bookedSeats: 15 },
    { id: 3, date: new Date().toISOString().split("T")[0], time: "04:30 PM", totalSeats: 20, bookedSeats: 5 },
    { id: 4, date: new Date(Date.now() + 86400000).toISOString().split("T")[0], time: "06:00 AM", totalSeats: 20, bookedSeats: 0 },
];

const PACKAGES = [
    { id: "basic", name: "Basic Ride", price: 3499 },
    { id: "premium", name: "Premium Ride", price: 5999 },
    { id: "sunrise", name: "Sunrise Special", price: 8999 },
];
const INSURANCE_PRICE = 200; // Mandatory per person
const GST_RATE = 0.18; // 18%

export function BookingPage() {
    const [searchParams] = useSearchParams();
    const source = searchParams.get("source");
    const refCode = searchParams.get("ref");

    const [step, setStep] = useState(1);
    const pkgParam = searchParams.get("pkg");
    const [selectedPackage, setSelectedPackage] = useState(pkgParam || "premium");
    const [isPackageConfirmed, setIsPackageConfirmed] = useState(!!pkgParam);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [travelers, setTravelers] = useState(1);
    const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
    const [agentCode, setAgentCode] = useState(refCode || "");
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    // Sync passenger inputs with traveler count
    useEffect(() => {
        setPassengers(prev => {
            const newPass = [...prev];
            if (travelers > prev.length) {
                for (let i = prev.length; i < travelers; i++) {
                    newPass.push({ name: "", age: "" });
                }
            } else if (travelers < prev.length) {
                newPass.length = travelers;
            }
            return newPass;
        });
    }, [travelers]);
    const [bookingId, setBookingId] = useState("");

    // Generate random booking ID when starting the payment
    useEffect(() => {
        if (step === 5 && !bookingId) {
            setBookingId(`GW-${Math.floor(Math.random() * 900000 + 100000)}`);
        }
    }, [step, bookingId]);

    const [isBookingOpen, setIsBookingOpen] = useState(true);
    useEffect(() => {
        if (source !== "center") { // Center can always book (offline)
            const saved = localStorage.getItem("onlineBookingOpen");
            if (saved !== null) {
                setIsBookingOpen(JSON.parse(saved));
            }
        }
    }, [source]);

    // Filtering Logic base on requirement: Shows only PRESENT and FUTURE dates, hides past dates.
    const today = new Date().toISOString().split("T")[0];
    const availableSlots = MOCK_SLOTS.filter(
        (slot) => slot.date === selectedDate && slot.date >= today
    );

    // Billing Calculation
    const selectedPkg = PACKAGES.find((p) => p.id === selectedPackage);
    const basicTourAmount = (selectedPkg?.price || 0) * travelers;
    const totalInsurance = INSURANCE_PRICE * travelers;
    const amountBeforeGst = basicTourAmount + totalInsurance;
    const gstAmount = amountBeforeGst * GST_RATE;
    const finalTotalAmount = amountBeforeGst + gstAmount;

    // Set default date to today
    useEffect(() => {
        setSelectedDate(today);
    }, [today]);

    useEffect(() => {
        if (refCode) {
            document.cookie = `agent_ref=${refCode}; max-age=${7 * 24 * 60 * 60}; path=/`; // 7 days
        }
    }, [refCode]);

    const validateStep3 = () => {
        for (let i = 0; i < passengers.length; i++) {
            if (!passengers[i].name.trim() || !passengers[i].age.trim() || parseInt(passengers[i].age) <= 0) {
                alert(`Please provide a valid name and age for Traveler ${i + 1}.`);
                return false;
            }
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            alert("Please provide a valid email address.");
            return false;
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
            alert("Please provide a valid 10-digit mobile number.");
            return false;
        }
        return true;
    };

    const handlePayment = () => {
        const id = bookingId || `GW-${Math.floor(Math.random() * 900000 + 100000)}`;
        if (!bookingId) setBookingId(id);

        const slotTime = MOCK_SLOTS.find(s => s.id === selectedSlot)?.time || "06:00 AM";

        const newBooking: Booking = {
            id,
            customerName: formData.name || "Customer",
            persons: travelers,
            passengers: passengers,
            slot: slotTime,
            category: travelers === 1 ? "Solo" : travelers === 2 ? "Couple" : "Group",
            type: source === "center" ? "OFFLINE" : "ONLINE",
            date: selectedDate,
            status: "Confirmed",
            price: Math.round(finalTotalAmount),
            paymentMethod: paymentMethod,
            agentRef: agentCode || undefined
        };

        bookingStore.addBooking(newBooking);
        setStep(5);
    };

    const handleDownloadTicket = async () => {
        const docHeight = 340 + (travelers * 8);
        const doc = new jsPDF({ format: [100, docHeight], unit: "mm" });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 100, docHeight, "F");

        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "normal");
        const payId = `PAY${Math.floor(Math.random() * 9000000 + 1000000)}`;
        const tourDate = selectedDate || "25/02/2026";
        const pkgName = selectedPkg?.name || "Tour Package";
        const slotObj = MOCK_SLOTS.find((s) => s.id === selectedSlot);
        const slotTime = slotObj ? slotObj.time : "N/A";

        let y = 15;
        const centerX = 50;

        const setCenteredText = (text: string, fontStyle: "normal" | "bold" = "normal", size: number = 10, yOffset: number = 5) => {
            doc.setFont("times", fontStyle);
            doc.setFontSize(size);
            doc.text(text, centerX, y, { align: "center" });
            y += yOffset;
        };

        const drawDivider = () => {
            y += 4;
            doc.setLineDashPattern([1.5, 1.5], 0);
            doc.line(15, y - 4, 85, y - 4);
            doc.setLineDashPattern([], 0);
            y += 6;
        };

        setCenteredText("GOLDWING ADVENTURE TOURS", "bold", 10, 6);
        setCenteredText("Adventure | Safety | Experience", "normal", 9, 6);
        setCenteredText("Mumbai, Maharashtra - 400001", "normal", 9, 6);
        setCenteredText("Phone: +91-XXXXXXXXXX", "normal", 9, 6);
        setCenteredText("GSTIN: 27AAACR5055K1ZQ", "normal", 9, 6);

        drawDivider();

        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text(`Booking No: ${bookingId}`, 15, y); y += 6;
        doc.text(`Mobile:     ${formData.phone || "N/A"}`, 15, y); y += 6;

        drawDivider();

        doc.text(`Tour: ${pkgName}`, 15, y); y += 6;
        doc.text(`Tour Date: ${tourDate.split("-").reverse().join("/")}`, 15, y); y += 6;
        doc.text(`Slot Time: ${slotTime}`, 15, y); y += 6;

        drawDivider();

        setCenteredText("Passenger Details", "bold", 10, 8);

        doc.setFont("times", "bold");
        doc.setFontSize(9);
        doc.text("Passenger Name", 15, y);
        doc.text("Age", 85, y, { align: "right" });
        y += 6;

        doc.setFont("times", "normal");
        doc.setFontSize(10);
        passengers.forEach((p, idx) => {
            doc.text(`P${idx + 1}: ${p.name || "Unknown"}`, 15, y);
            doc.text(`${p.age || "-"}`, 85, y, { align: "right" });
            y += 6;
        });

        drawDivider();

        doc.text("ITEM", 15, y);
        doc.text("QTY", 55, y, { align: "right" });
        doc.text("RATE", 70, y, { align: "right" });
        doc.text("AMT", 85, y, { align: "right" });
        y += 8;

        drawDivider();

        doc.text("Tour Package", 15, y);
        doc.text(travelers.toString(), 55, y, { align: "right" });
        doc.text((selectedPkg?.price || 0).toString(), 70, y, { align: "right" });
        doc.text(basicTourAmount.toString(), 85, y, { align: "right" });
        y += 6;

        doc.text("Insurance", 15, y);
        doc.text(travelers.toString(), 55, y, { align: "right" });
        doc.text(INSURANCE_PRICE.toString(), 70, y, { align: "right" });
        doc.text(totalInsurance.toString(), 85, y, { align: "right" });
        y += 8;

        drawDivider();

        doc.text("Sub Total", 15, y);
        doc.text(amountBeforeGst.toString(), 85, y, { align: "right" });
        y += 6;

        doc.text("GST (18%)", 15, y);
        doc.text(gstAmount.toFixed(0), 85, y, { align: "right" });
        y += 8;

        drawDivider();

        doc.text("GRAND TOTAL", 15, y);
        doc.text(finalTotalAmount.toFixed(0), 85, y, { align: "right" });
        y += 8;

        drawDivider();

        setCenteredText(`Payment Method: ${source === "center" ? "Offline" : "Online"}`, "normal", 10, 6);
        setCenteredText(`Payment ID: ${payId}`, "normal", 10, 8);

        drawDivider();

        setCenteredText("Scan QR for Verification", "normal", 10, 6);

        try {
            const qrDataUrl = await QRCode.toDataURL(`VERIFY:${bookingId}|${payId}`, { width: 150, margin: 1 });
            doc.addImage(qrDataUrl, "PNG", 35, y, 30, 30);
            y += 35;
        } catch (err) {
            y += 10;
            setCenteredText("[ QR CODE ]", "normal", 10, 20);
        }

        drawDivider();

        setCenteredText("This is a computer-generated ticket.", "normal", 10, 6);
        setCenteredText("Mandatory insurance included.", "normal", 10, 6);
        setCenteredText("Report 30 minutes before slot time.", "normal", 10, 8);
        setCenteredText("Thank You & Ride Safe!", "bold", 11, 8);

        drawDivider();

        doc.save(`Goldwing_Ticket_${bookingId}.pdf`);
    };

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("INVOICE", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text(`Invoice No: INV-${Math.floor(Math.random() * 90000 + 10000)}`, 14, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 47);
        doc.text(`Customer Name: ${formData.name || "N/A"}`, 14, 54);
        doc.text(`Booking ID: ${bookingId}`, 14, 61);

        autoTable(doc, {
            startY: 75,
            head: [["Description", "Qty", "Rate", "Amount"]],
            body: [
                [`${selectedPkg?.name} (Basic Tour Amount)`, travelers, `₹${selectedPkg?.price}`, `₹${basicTourAmount}`],
                [`Mandatory Insurance`, travelers, `₹${INSURANCE_PRICE}`, `₹${totalInsurance}`],
                [`GST (18%)`, 1, `-`, `₹${gstAmount.toFixed(2)}`],
            ],
            foot: [
                ["", "", "Grand Total", `₹${finalTotalAmount.toFixed(2)}`]
            ],
            theme: "striped",
            headStyles: { fillColor: [212, 175, 55] },
            footStyles: { fillColor: [11, 15, 25], textColor: [255, 255, 255] }
        });

        doc.setFontSize(10);
        doc.text("Thank you for choosing Goldwing Adventure Tours.", 14, (doc as any).lastAutoTable.finalY + 20);

        doc.save(`Goldwing_Invoice_${bookingId}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] p-4 md:p-8 font-sans text-gray-900 dark:text-white transition-colors duration-300">
            <Link to="/?skipLoader=true" className="inline-flex items-center text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white mb-6 transition">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
            </Link>

            <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-300">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between z-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#111827] dark:to-[#1a2235]">
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-[#D4AF37] dark:to-[#F7C948]">
                            {source === "center" ? "Center Booking Gateway" : "Book Your Adventure"}
                        </h2>
                        <p className="text-gray-600 dark:text-white/60 text-sm mt-1">
                            {source === "center" ? "Universal QR Offline Center" : "Secure Online Booking"}
                        </p>
                    </div>
                    {source === "center" && (
                        <span className="mt-4 md:mt-0 px-4 py-1.5 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 text-yellow-700 dark:text-[#F7C948] rounded-full text-sm font-semibold border border-[#D4AF37]/30">
                            Offline Center Mode
                        </span>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7C948]"
                        animate={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold">1. Select Package</h3>
                                    {isPackageConfirmed && (
                                        <button
                                            onClick={() => setIsPackageConfirmed(false)}
                                            className="text-sm text-[#D4AF37] hover:underline font-semibold"
                                        >
                                            Change Package
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PACKAGES.filter(p => !isPackageConfirmed || p.id === selectedPackage).map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => {
                                                setSelectedPackage(pkg.id);
                                                setIsPackageConfirmed(true);
                                            }}
                                            disabled={!isBookingOpen}
                                            className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${selectedPackage === pkg.id && isBookingOpen ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"} ${!isBookingOpen ? 'opacity-50 cursor-not-allowed' : ''} ${isPackageConfirmed ? 'md:col-span-2' : ''}`}
                                        >
                                            <div className="text-xl font-bold">{pkg.name}</div>
                                            <div className="text-[#D4AF37] text-lg font-semibold mt-2">₹{pkg.price.toLocaleString()} RS</div>
                                            {selectedPackage === pkg.id && isBookingOpen && <Check className="absolute top-4 right-4 w-6 h-6 text-[#D4AF37]" />}
                                        </button>
                                    ))}
                                </div>
                                {!isBookingOpen ? (
                                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-red-500 font-semibold">
                                        Online booking is currently closed. Please contact admin.
                                    </div>
                                ) : (
                                    <button onClick={() => setStep(2)} className="w-full bg-[#D4AF37] text-black font-bold text-lg py-4 rounded-xl mt-6 hover:bg-[#F7C948] transition">Next Step</button>
                                )}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <h3 className="text-2xl font-bold">2. Select Date & Slot</h3>
                                <div>
                                    <label className="block text-gray-600 dark:text-white/70 mb-2">Select Date (Past dates hidden)</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                                        min={today}
                                        className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 dark:text-white/70 mb-2">Available Slots (Real-time)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableSlots.length > 0 ? availableSlots.map((slot) => {
                                            const remaining = slot.totalSeats - slot.bookedSeats;
                                            const isFull = remaining === 0;

                                            return (
                                                <button
                                                    key={slot.id}
                                                    disabled={isFull}
                                                    onClick={() => setSelectedSlot(slot.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left flex justify-between items-center ${isFull ? "border-red-500/30 bg-red-500/10 opacity-60 cursor-not-allowed" :
                                                        selectedSlot === slot.id ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="text-lg font-bold">{slot.time}</div>
                                                        <div className={isFull ? "text-red-500 dark:text-red-400" : "text-[#D4AF37]"}>
                                                            {isFull ? "Slot Full" : `${remaining} Seats Remaining`}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        }) : (
                                            <div className="col-span-2 text-center text-gray-500 dark:text-white/50 p-6 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5">
                                                No slots available for this date.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="w-1/3 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition">Back</button>
                                    <button disabled={!selectedSlot} onClick={() => setStep(3)} className="w-2/3 bg-[#D4AF37] text-black font-bold py-4 rounded-xl disabled:opacity-50 hover:bg-[#F7C948] transition">Continue</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <h3 className="text-2xl font-bold">3. Traveler Details</h3>

                                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <h4 className="text-xl font-bold">Number of Travelers</h4>
                                        <p className="text-gray-600 dark:text-white/60 text-sm">Mandatory insurance per person will be added.</p>
                                    </div>
                                    <div className="flex items-center gap-6 bg-white dark:bg-[#111827] px-6 py-2 rounded-full border border-gray-300 dark:border-white/10">
                                        <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="text-2xl hover:text-[#D4AF37]">-</button>
                                        <span className="text-2xl font-bold">{travelers}</span>
                                        <button onClick={() => setTravelers(Math.min(10, travelers + 1))} className="text-2xl hover:text-[#D4AF37]">+</button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {passengers.map((p, index) => (
                                        <div key={index} className="flex gap-4">
                                            <input
                                                type="text"
                                                placeholder={`Traveler ${index + 1} Name`}
                                                value={p.name}
                                                onChange={(e) => {
                                                    const newP = [...passengers];
                                                    newP[index].name = e.target.value;
                                                    setPassengers(newP);
                                                    if (index === 0) setFormData({ ...formData, name: e.target.value });
                                                }}
                                                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                value={p.age}
                                                onChange={(e) => {
                                                    const newP = [...passengers];
                                                    newP[index].age = e.target.value;
                                                    setPassengers(newP);
                                                }}
                                                className="w-24 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
                                            />
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-6 space-y-4">
                                        <p className="text-gray-700 dark:text-white/70 font-semibold mb-2">Booking Contact Details</p>
                                        <input type="email" placeholder="Email Address (For PDF Tickets)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]" />
                                        <input type="tel" placeholder="Mobile Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]" />
                                        <input type="text" placeholder="Agent Code (Optional)" value={agentCode} onChange={(e) => setAgentCode(e.target.value)} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]" />
                                        <p className="text-xs text-yellow-600 dark:text-[#D4AF37]/80 italic">No agent code entered later will be accepted for commission.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="w-1/3 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition">Back</button>
                                    <button onClick={() => { if (validateStep3()) setStep(4); }} className="w-2/3 bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:bg-[#F7C948] transition">Proceed to Billing</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <h3 className="text-2xl font-bold">4. Final Billing Breakdown</h3>

                                <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 space-y-4 font-mono text-sm md:text-base">
                                    <div className="flex justify-between text-gray-700 dark:text-white/80 border-b border-gray-200 dark:border-white/10 pb-4">
                                        <span>Basic Tour Amount ({travelers} x ₹{selectedPkg?.price})</span>
                                        <span>₹{basicTourAmount.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-gray-700 dark:text-white/80 border-b border-gray-200 dark:border-white/10 pb-4">
                                        <span className="flex items-center"><Shield className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" /> Mandatory Insurance ({travelers} x ₹{INSURANCE_PRICE})</span>
                                        <span>₹{totalInsurance.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-700 dark:text-white/80 border-b border-gray-200 dark:border-white/10 pb-4">
                                        <span>GST (18%)</span>
                                        <span>₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="flex justify-between text-xl font-bold text-yellow-600 dark:text-[#D4AF37] pt-2">
                                        <span>Final Total Amount</span>
                                        <span>₹{finalTotalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl text-yellow-800 dark:text-yellow-300 text-sm flex">
                                    <Shield className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <p>Booking logic assigns you a temporary seat lock for 5 minutes. If payment is unsuccessful, the seat returns to the pool automatically.</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <p className="text-gray-700 dark:text-white/80 font-bold">Select Payment Method</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['UPI', 'Card', 'Net Banking', ...(source === 'center' ? ['Cash'] : [])].map(method => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`px-4 py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === method
                                                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-yellow-700 dark:text-[#D4AF37]"
                                                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 bg-white dark:bg-[#111827] hover:border-gray-300 dark:hover:border-white/30"
                                                    }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                                    <button onClick={() => setStep(3)} className="w-1/3 bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white font-bold py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition">Back</button>
                                    <button onClick={handlePayment} className="w-2/3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-500/50 transition flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 mr-2" /> Pay ₹{finalTotalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div key="step5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold">Payment Successful!</h3>
                                <p className="text-gray-500 dark:text-white/60">Your booking is confirmed.</p>

                                <div className="max-w-md mx-auto bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-xl text-left space-y-3">
                                    <p className="text-sm text-gray-400 dark:text-white/50 mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Booking ID: {bookingId}</p>
                                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{selectedPkg?.name}</p>
                                    <p className="text-gray-600 dark:text-white/80">
                                        <div className="inline-block w-6 h-6 mr-2 align-middle">
                                            <DotLottieReact
                                                src="https://lottie.host/8e512483-7c2f-44cd-b746-668388ea278c/iIsy7tRpSg.lottie"
                                                loop
                                                autoplay
                                            />
                                        </div>
                                        {selectedDate}
                                    </p>

                                    <p className="text-gray-600 dark:text-white/80"><Users className="inline w-4 h-4 mr-2" /> {travelers} Travelers</p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                                    <button onClick={handleDownloadTicket} className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition">
                                        <Download className="w-5 h-5 mr-2" /> Download Ticket (PDF)
                                    </button>
                                    <button onClick={handleDownloadInvoice} className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">
                                        <Download className="w-5 h-5 mr-2" /> Download Invoice (PDF)
                                    </button>
                                </div>

                                <p className="text-gray-400 dark:text-white/40 text-sm mt-8">Email confirmation with attachments sent to {formData.email || "your email"}.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
