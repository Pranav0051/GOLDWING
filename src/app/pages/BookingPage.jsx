import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Users, User, CreditCard, Check, Shield, Download, MapPin, Globe, ArrowLeft, ArrowRight, X, AlertCircle } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { bookingStore } from "../utils/bookingStore";
import { ThemeToggle } from "../components/ThemeToggle";
import { LiveNotifications } from "../components/LiveNotifications";
import { TermsAndConditionsModal } from "../components/TermsAndConditionsModal";

const MOCK_SLOTS = [
    { id: 1, date: new Date().toISOString().split("T")[0], time: "06:00 AM", totalSeats: 20, bookedSeats: 20 },
    { id: 2, date: new Date().toISOString().split("T")[0], time: "07:30 AM", totalSeats: 20, bookedSeats: 15 },
    { id: 3, date: new Date().toISOString().split("T")[0], time: "04:30 PM", totalSeats: 20, bookedSeats: 5 },
    { id: 4, date: new Date(Date.now() + 86400000).toISOString().split("T")[0], time: "06:00 AM", totalSeats: 20, bookedSeats: 0 },
];

const SOLO_PACKAGES = [
    { id: "basic", name: "Solo Basic", duration: "5-7 Minutes", price: 3499, points: ["Certified Pilot", "Safety Gear", "Ground Photos", "Basic Insurance"] },
    { id: "premium", name: "Solo Premium", duration: "10-15 Minutes", price: 5999, ribbon: "Most Popular", points: ["HD Video Recording", "Premium Safety Gear", "Full Insurance"] },
    { id: "sunrise", name: "Solo Sunrise", duration: "15-20 Minutes", price: 8999, ribbon: "Bestseller", points: ["4K Video", "Sunrise Slot", "Breakfast & Merch", "Professional Photoshoot"] },
];

const COUPLE_PACKAGES = [
    { id: "basic", name: "Couple Basic", duration: "5-7 Minutes", price: 3499, points: ["Certified Pilots", "Dual Safety Gear", "Ground Photos", "Basic Insurance"] },
    { id: "premium", name: "Romantic Premium", duration: "10-15 Minutes", price: 5999, discountBadge: "Special Couple Deal", ribbon: "Most Popular", points: ["HD Video Recording", "Couples Photography", "Full Insurance"] },
    { id: "sunrise", name: "Romantic Sunrise", duration: "15-20 Minutes", price: 8999, ribbon: "Bestseller", points: ["4K Video", "Sunrise Slot", "Breakfast & Merch", "Premium Photoshoot"] },
];

const FAMILY_PACKAGES = [
    { id: "basic", name: "Family Basic", duration: "5-7 Minutes", price: 3499, points: ["Certified Pilots", "Group Safety Gear", "Ground Photos", "Basic Insurance"] },
    { id: "premium", name: "Family Premium", duration: "10-15 Minutes", price: 5999, discountBadge: "Family Deal", ribbon: "Most Popular", points: ["HD Video", "Family Photography", "Full Insurance"] },
    { id: "sunrise", name: "Family Sunrise", duration: "15-20 Minutes", price: 8999, ribbon: "Bestseller", points: ["4K Video", "Sunrise Slot", "Breakfast & Merch", "Pro Photoshoot"] },
];

const SHARING_PACKAGES = [
    { id: "basic", name: "Shared Basic", duration: "5-7 Minutes", price: 3499, points: ["Certified Pilot", "Safety Gear", "Shared Flight Buddy", "Basic Insurance"] },
    { id: "premium", name: "Shared Premium", duration: "10-15 Minutes", price: 5999, ribbon: "Most Popular", points: ["HD Video Recording", "Premium Safety Gear", "Full Insurance"] },
    { id: "sunrise", name: "Shared Sunrise", duration: "15-20 Minutes", price: 8999, ribbon: "Bestseller", points: ["4K Video", "Sunrise Slot", "Breakfast & Merch", "Pro Photoshoot"] },
];

const PACKAGES_DATA = {
    SOLO: SOLO_PACKAGES,
    COUPLE: COUPLE_PACKAGES,
    FAMILY: FAMILY_PACKAGES,
    SHARING: SHARING_PACKAGES
};

const CATEGORIES = [
    { id: "SOLO", title: "Solo", icon: "/images/icon/single-person.png", bg: "/images/background/single para.webp", tagline: "Fly High & Free" },
    { id: "COUPLE", title: "Couple", icon: "/images/icon/couple.png", bg: "/images/background/2 seat para.avif", tagline: "Share the Sky" },
    { id: "FAMILY", title: "Family", icon: "/images/icon/family.png", bg: "/images/background/3 seat para.jpg", tagline: "Memories Together" },
    { id: "SHARING", title: "Sharing", icon: "/images/icon/share-ride.png", bg: "/images/background/2 seater para.avif", tagline: "Share & Save" }
];

const GST_RATE = 0.18;
const INSURANCE_PRICE = 200;

export function BookingPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const refCode = searchParams.get("ref");
    const [step, setStep] = useState(1); // 0 = Flash, 1 = Categories, 2 = Details, 3 = Packages, 4 = Slots, 5 = Payment, 6 = Confirmation
    const [selectedCat, setSelectedCat] = useState(null);
    const [backgroundIndex, setBackgroundIndex] = useState(2); // default fallback
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [bookingId, setBookingId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const showError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 4000);
    };

    useEffect(() => {
        setIsAdmin(localStorage.getItem("isAdminLoggedIn") === "true");
    }, []);

    // Consent state
    const [consent, setConsent] = useState({
        terms: false,
        media: false
    });
    const isConsentValid = consent.terms;

    // Passenger Detail state
    const [passengers, setPassengers] = useState([{ gender: "M", weight: "", age: "" }]);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", state: "", city: "" });
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    // Category change effect
    useEffect(() => {
        if (selectedCat) {
            const catInfo = CATEGORIES.find(c => c.id === selectedCat);
            if (catInfo) setBackgroundIndex(catInfo.bg);
        }
    }, [selectedCat]);

    // Handlers for selection
    const handleCategorySelect = (catId) => {
        setSelectedCat(catId);
        setSelectedPkg(null); // Explicitly unselect the package from previous choice
        // Initialize passengers array based on category
        if (catId === "SOLO" || catId === "SHARING") {
            setPassengers([{ gender: "M", weight: "", age: "" }]);
        } else if (catId === "COUPLE") {
            setPassengers([
                { gender: "M", weight: "", age: "" },
                { gender: "F", weight: "", age: "" }
            ]);
        } else if (catId === "FAMILY") {
            setPassengers([
                { gender: "M", weight: "", age: "" },
                { gender: "F", weight: "", age: "" },
                { gender: "M", weight: "", age: "" }
            ]);
        }
    };

    const handleProceedToDetails = (catId) => {
        handleCategorySelect(catId);
        setStep(2); // Goes to Packages now (swapped visually)
    };

    // Ensure package is unselected when entering the packages step
    useEffect(() => {
        if (step === 2) {
            setSelectedPkg(null);
        }
    }, [step]);

    const validateDetailsForm = () => {
        for (let i = 0; i < passengers.length; i++) {
            const age = parseInt(passengers[i].age);
            if (!age || age < 12) return showError(`Passenger ${i + 1} must be at least 12 years old.`);
        }

        if (selectedCat === "SOLO" || selectedCat === "SHARING") {
            const w = parseInt(passengers[0].weight);
            if (!w || w <= 0) return showError("Please enter a valid weight.");
            if (w > 75) {
                showError("Weight limit is 75 KG for this category. Please select Couple option.");
                return false;
            }
        } else if (selectedCat === "COUPLE") {
            const w1 = parseInt(passengers[0].weight) || 0;
            const w2 = parseInt(passengers[1].weight) || 0;
            if (!w1 || !w2) return showError("Please enter weight for both individuals.");
            if (w1 + w2 > 150) {
                showError("Combined weight exceeds 150 KG limit for Couple ride.");
                return false;
            }
        } else if (selectedCat === "FAMILY") {
            for (let i = 0; i < passengers.length; i++) {
                const w = parseInt(passengers[i].weight);
                if (!w || w <= 0) return showError(`Please enter weight for Member ${i + 1}`);
            }
            const totalW = passengers.reduce((sum, p) => sum + (parseInt(p.weight) || 0), 0);
            if (totalW > passengers.length * 75) {
                showError(`Total weight for ${passengers.length} members seems high, please contact support.`);
            }
        }

        if (!formData.name.trim()) return showError("Please enter contact name.");
        if (!formData.phone.trim() || formData.phone.length < 10) return showError("Valid 10-digit mobile number required.");

        setStep(4); // Next to Slots/Payment
        return true;
    };

    const calculateTotal = () => {
        const pkg = PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg);
        if (!pkg) return { total: 0, sub: 0, gst: 0, ins: 0, travelers: 1 };

        const travelersCount = passengers.length;
        let basePrice = pkg.price * travelersCount;

        const ins = INSURANCE_PRICE * travelersCount;
        const sub = basePrice + ins;
        const gst = sub * GST_RATE;
        const total = sub + gst;

        return {
            total: Math.round(total),
            sub: Math.round(sub),
            gst: Math.round(gst),
            ins,
            travelers: travelersCount,
            base: basePrice
        };
    };

    const handlePayment = () => {
        const id = `GW-${Math.floor(Math.random() * 900000 + 100000)}`;
        setBookingId(id);

        const calc = calculateTotal();
        const slotObj = MOCK_SLOTS.find(s => s.id === selectedSlot);

        const newBooking = {
            id,
            customerName: formData.name,
            persons: passengers.length,
            passengers: passengers.map(p => ({ name: "TBD", age: p.weight })), // Using weight creatively or need real names?
            slot: slotObj ? slotObj.time : "06:00 AM",
            category: selectedCat,
            type: "ONLINE",
            date: selectedDate,
            status: "Confirmed",
            price: calc.total,
            paymentMethod: paymentMethod,
            consentAccepted: true,
            consentTimestamp: new Date().toISOString(),
            consentMedia: consent.media,
            userIpAddress: "Client-IP-Logged",
            agent: refCode || "Direct",
        };
        bookingStore.addBooking(newBooking);
        setStep(6); // Go to confirmation
    };

    const handleDownloadTicket = async () => {
        const docHeight = 340 + (passengers.length * 8);
        const doc = new jsPDF({ format: [100, docHeight], unit: "mm" });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 100, docHeight, "F");
        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "normal");
        const payId = `PAY${Math.floor(Math.random() * 9000000 + 1000000)}`;
        const pkgObj = PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg);
        const tourDate = selectedDate;
        const pkgName = pkgObj?.name || "Tour Package";
        const slotObj = MOCK_SLOTS.find((s) => s.id === selectedSlot);
        const slotTime = slotObj ? slotObj.time : "N/A";
        let y = 15;
        const centerX = 50;
        const setCenteredText = (text, fontStyle = "normal", size = 10, yOffset = 5) => {
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
        doc.text(`Booking No: ${bookingId}`, 15, y);
        y += 6;
        const maskedPhone = formData.phone ? formData.phone.slice(-4).padStart(formData.phone.length, 'X') : "N/A";
        doc.text(`Mobile:     ${maskedPhone}`, 15, y);
        y += 6;
        drawDivider();
        doc.text(`Category: ${selectedCat || 'Unknown'}`, 15, y);
        y += 6;
        doc.text(`Tour: ${pkgName}`, 15, y);
        y += 6;
        doc.text(`Tour Date: ${tourDate.split("-").reverse().join("/")}`, 15, y);
        y += 6;
        doc.text(`Slot Time: ${slotTime}`, 15, y);
        y += 6;
        drawDivider();
        setCenteredText("Passenger Details", "bold", 10, 8);
        doc.setFont("times", "bold");
        doc.setFontSize(9);
        doc.text("Passenger", 15, y);
        doc.text("Gender/Weight", 85, y, { align: "right" });
        y += 6;
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        passengers.forEach((p, idx) => {
            doc.text(`P${idx + 1}: ${formData.name ? (idx === 0 ? formData.name : 'Co-Passenger') : 'Unknown'}`, 15, y);
            doc.text(`${p.gender || "-"} / ${p.weight || "-"} Kg`, 85, y, { align: "right" });
            y += 6;
        });
        drawDivider();
        const calc = calculateTotal();
        doc.text("ITEM", 15, y);
        doc.text("QTY", 55, y, { align: "right" });
        doc.text("RATE", 70, y, { align: "right" });
        doc.text("AMT", 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.text("Tour Package", 15, y);
        doc.text("1", 55, y, { align: "right" });
        doc.text(calc.base.toString(), 70, y, { align: "right" });
        doc.text(calc.base.toString(), 85, y, { align: "right" });
        y += 6;
        doc.text("Insurance", 15, y);
        doc.text(calc.travelers.toString(), 55, y, { align: "right" });
        doc.text(INSURANCE_PRICE.toString(), 70, y, { align: "right" });
        doc.text(calc.ins.toString(), 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.text("Sub Total", 15, y);
        doc.text(calc.sub.toString(), 85, y, { align: "right" });
        y += 6;
        doc.text("GST (18%)", 15, y);
        doc.text(calc.gst.toFixed(0), 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.text("GRAND TOTAL", 15, y);
        doc.text(calc.total.toFixed(0), 85, y, { align: "right" });
        y += 8;
        drawDivider();
        setCenteredText(`Payment Method: ${paymentMethod}`, "normal", 10, 6);
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
        const docHeight = 250;
        const doc = new jsPDF({ format: [100, docHeight], unit: "mm" });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 100, docHeight, "F");
        doc.setTextColor(0, 0, 0);
        let y = 15;
        const centerX = 50;
        const setCenteredText = (text, fontStyle = "normal", size = 10, yOffset = 5) => {
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
        setCenteredText("INVOICE", "bold", 12, 6);
        drawDivider();
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text(`Invoice No: INV-${Math.floor(Math.random() * 90000 + 10000)}`, 15, y);
        y += 6;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, y);
        y += 6;
        doc.text(`Customer: ${formData.name || "N/A"}`, 15, y);
        y += 6;
        doc.text(`Booking ID: ${bookingId}`, 15, y);
        y += 6;
        drawDivider();
        doc.setFont("times", "bold");
        doc.text("ITEM", 15, y);
        doc.text("QTY", 55, y, { align: "right" });
        doc.text("RATE", 70, y, { align: "right" });
        doc.text("AMT", 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.setFont("times", "normal");
        doc.setFontSize(9);
        const addRow = (desc, qty, rate, amt) => {
            if (desc.length > 20) {
                doc.text(desc.substring(0, 20), 15, y);
                y += 4;
                doc.text(desc.substring(20), 15, y);
            } else {
                doc.text(desc, 15, y);
            }
            doc.text(qty, 55, y, { align: "right" });
            doc.text(rate, 70, y, { align: "right" });
            doc.text(amt, 85, y, { align: "right" });
            y += 6;
        };
        const calc = calculateTotal();
        const pkgObj = PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg);
        addRow(`${pkgObj?.name || 'Package'}`, "1", `Rs. ${calc.base}`, `Rs. ${calc.base}`);
        addRow(`Insurance`, calc.travelers.toString(), `Rs. ${INSURANCE_PRICE}`, `Rs. ${calc.ins}`);

        y += 2;
        drawDivider();
        doc.setFontSize(10);
        doc.text("Sub Total", 15, y);
        doc.text(`Rs. ${calc.sub.toFixed(2)}`, 85, y, { align: "right" });
        y += 6;
        doc.text("GST (18%)", 15, y);
        doc.text(`Rs. ${calc.gst.toFixed(2)}`, 85, y, { align: "right" });
        y += 8;
        drawDivider();
        doc.setFont("times", "bold");
        doc.text("GRAND TOTAL", 15, y);
        doc.text(`Rs. ${calc.total.toFixed(2)}`, 85, y, { align: "right" });
        y += 8;
        drawDivider();
        setCenteredText("Thank you for choosing", "normal", 10, 5);
        setCenteredText("Goldwing Adventure Tours.", "normal", 10, 8);
        setCenteredText("This is a computer-generated invoice.", "normal", 9, 6);
        doc.save(`Goldwing_Invoice_${bookingId}.pdf`);
    };



    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white font-sans overflow-y-auto overflow-x-hidden relative selection-bg transition-colors duration-300">
            {/* Dynamic Background Image Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={backgroundIndex}
                        src={backgroundIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.85, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/10 dark:bg-[#0B0F19]/40" />
            </div>

            {/* Error Toast */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-8 left-1/2 z-[100] flex items-center gap-3 bg-red-600 px-6 py-4 rounded-full shadow-2xl font-bold max-w-sm w-[90%]"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="flex-1 text-sm">{errorMsg}</span>
                        <button onClick={() => setErrorMsg("")}><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 p-4 md:p-12 w-full max-w-6xl mx-auto min-h-[100dvh] flex flex-col justify-start md:justify-center pt-24 md:pt-16 pb-20">

                {/* Back navigation & Header */}
                <div className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 flex justify-between items-center z-50">
                    <div className="flex items-center gap-2 md:gap-4">
                        {step > 1 && step < 6 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center text-gray-900 dark:text-white/70 hover:text-black dark:hover:text-white transition bg-white/10 dark:bg-black/10 px-4 py-2 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </button>
                        ) : step === 6 ? (
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-gray-900 dark:text-white/70 hover:text-black dark:hover:text-white transition bg-white/10 dark:bg-black/10 px-4 py-2 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Home
                            </button>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to={isAdmin ? "/admin" : "/login"} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/40 text-gray-900 dark:text-white backdrop-blur-md transition border border-gray-200 dark:border-white/10 shadow-sm group">
                            <User className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAdmin ? "text-yellow-500 fill-yellow-500" : ""}`} />
                        </Link>
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <div className="text-center mb-8 md:mb-10">
                                <div className="inline-block bg-white/70 dark:bg-black/40 px-6 py-5 md:px-8 md:py-6 rounded-3xl shadow-xl border border-white/50 dark:border-white/10">
                                    <h1 className="text-3xl md:text-6xl font-black mb-2 md:mb-4 tracking-tight text-gray-900 dark:text-white">
                                        Select Your Ride Pattern
                                    </h1>
                                    <p className="text-base md:text-lg text-gray-900 dark:text-white font-bold">Choose how you want to experience the skies.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {CATEGORIES.map((cat, idx) => (
                                    <motion.div
                                        key={cat.id}
                                        onHoverStart={() => setBackgroundIndex(cat.bg)}
                                        className="group relative h-[320px] w-full [perspective:2000px] cursor-pointer"
                                    >
                                        {/* Card 3D Wrapper */}
                                        <div
                                            className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                                        >
                                            {/* Front Face */}
                                            <div
                                                className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(0deg)] rounded-3xl bg-white/70 dark:bg-black/20 border border-black/10 dark:border-white/10 shadow-xl flex flex-col items-center justify-center p-8 transition-all duration-700"
                                            >
                                                <div className="w-24 h-24 mb-6 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center p-4">
                                                    <img src={cat.icon} alt={cat.title} className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <h3 className="text-3xl font-black tracking-wide text-gray-900 dark:text-white">{cat.title}</h3>
                                            </div>

                                            {/* Back Face */}
                                            <div
                                                className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-black border border-yellow-500/30 shadow-2xl flex flex-col items-center justify-center p-8 transition-all duration-700"
                                            >
                                                <div className="flex-1 flex flex-col justify-center items-center w-full mt-4 z-10">
                                                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
                                                        <img src={cat.icon} alt={cat.title} className="w-20 h-20 object-contain filter brightness-200 invert opacity-100" />
                                                    </div>
                                                    <h3 className="text-4xl font-black mb-2 text-white leading-snug">{cat.title}</h3>
                                                    <p className="text-yellow-500 font-semibold italic text-center text-lg">{cat.tagline}</p>
                                                </div>

                                                <div className="w-full mt-auto mb-2 z-10">
                                                    <button
                                                        onClick={() => handleProceedToDetails(cat.id)}
                                                        className="w-full py-4 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-[1.02] active:scale-95 font-black transition-all flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                                                    >
                                                        Book Now <ArrowRight className="w-5 h-5 ml-2" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PACKAGES (Swapped visually to be before Details) */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full"
                        >
                            <div className="text-center mb-6 md:mb-10">
                                <div className="inline-block bg-white/70 dark:bg-black/40 px-6 py-5 md:px-8 md:py-6 rounded-3xl shadow-xl border border-white/50 dark:border-white/10">
                                    <h2 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-gray-900 dark:text-white">Select {selectedCat} Package</h2>
                                    <p className="text-base md:text-lg text-gray-900 dark:text-white font-bold">Pick the flight duration that suits you best.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-center gap-6 max-w-7xl mx-auto pb-8 px-4 w-full">
                                {PACKAGES_DATA[selectedCat]?.map((pkg, idx) => (
                                    <motion.div
                                        key={pkg.id}
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4, delay: idx * 0.15, type: "spring", stiffness: 100 }}
                                        onClick={() => { setSelectedPkg(pkg.id); setStep(3); }}
                                        className={`cursor-pointer flex flex-col rounded-3xl p-6 md:p-8 w-full md:w-[340px] lg:w-auto lg:flex-1 max-w-[380px] relative overflow-hidden border-2 transition-all duration-300 shadow-xl hover:shadow-2xl dark:shadow-none group transform hover:-translate-y-3 hover:scale-[1.02] ${selectedPkg === pkg.id ? "bg-yellow-500 border-yellow-500 text-black shadow-[0_0_40px_rgba(234,179,8,0.4)]" : "bg-white/70 dark:bg-black/40 border-black/10 dark:border-white/10 hover:border-yellow-500/50"
                                            }`}
                                    >
                                        {pkg.ribbon && (
                                            <div className="absolute top-4 right-[-30px] bg-red-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-lg">
                                                {pkg.ribbon}
                                            </div>
                                        )}
                                        <h3 className={`text-2xl font-black mb-1 ${selectedPkg === pkg.id ? "text-black" : "text-gray-900 dark:text-white"}`}>{pkg.name}</h3>

                                        <div className="my-6">
                                            <div className={`text-4xl font-black ${selectedPkg === pkg.id ? "text-black" : "text-yellow-600 dark:text-yellow-400"}`}>
                                                ₹{pkg.price.toLocaleString()}
                                            </div>
                                            {pkg.discountBadge && (
                                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${selectedPkg === pkg.id ? "bg-black text-yellow-400" : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"}`}>
                                                    {pkg.discountBadge}
                                                </span>
                                            )}
                                        </div>

                                        <div className={`flex items-center gap-3 font-semibold text-lg py-4 border-t ${selectedPkg === pkg.id ? "border-black/20 text-black" : "border-black/10 dark:border-white/10 text-gray-900 dark:text-white"}`}>
                                            <span className="text-3xl">⏱</span> {pkg.duration} Airtime
                                        </div>

                                        {/* Points rendering */}
                                        {pkg.points && pkg.points.length > 0 && (
                                            <div className="space-y-2 mb-4">
                                                {pkg.points.map((point, i) => (
                                                    <div key={i} className={`flex items-start gap-2 text-sm font-semibold ${selectedPkg === pkg.id ? 'text-black/80' : 'text-gray-900 dark:text-white'}`}>
                                                        <Check className={`w-4 h-4 flex-shrink-0 ${selectedPkg === pkg.id ? "text-green-800" : "text-green-600 dark:text-green-400"}`} />
                                                        <span>{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className={`mt-auto w-full font-bold text-center py-3 rounded-xl border-2 transition-colors ${selectedPkg === pkg.id ? "border-black bg-black text-yellow-500" : "border-black/20 dark:border-white/20 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 group-hover:border-black/40 dark:group-hover:border-white/40"}`}>
                                            {selectedPkg === pkg.id ? "Selected" : "Choose this"}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: DETAILS FORM */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-2xl mx-auto px-2"
                        >
                            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-sm border border-white/30 dark:border-white/5 p-5 md:p-8 rounded-3xl shadow-xl dark:shadow-none">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">{selectedCat} Verification</h2>
                                <p className="text-sm md:text-base text-gray-700 dark:text-white/60 mb-6">Safety parameter verification for your ride category.</p>

                                {/* Contact form for booking lead - Moved to top */}
                                <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-8">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Lead Contact Details</h3>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="text"
                                            placeholder="Lead Contact Name"
                                            className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 text-gray-900 dark:text-white"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 text-gray-900 dark:text-white"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Passenger Information</h3>
                                    {passengers.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-black/30 p-4 rounded-2xl border border-gray-200 dark:border-white/5">
                                            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center font-bold text-yellow-600 dark:text-yellow-400">
                                                #{idx + 1}
                                            </div>
                                            <div className="flex-1 flex gap-4 flex-wrap">
                                                <div className="flex-1 bg-gray-200 dark:bg-white/5 p-1 rounded-xl flex items-center relative">
                                                    {['M', 'F'].map(g => (
                                                        <button
                                                            key={g}
                                                            className={`flex-1 py-3 px-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${p.gender === g ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'}`}
                                                            onClick={() => {
                                                                const newP = [...passengers];
                                                                newP[idx].gender = g;
                                                                setPassengers(newP);
                                                            }}
                                                        >
                                                            <img src={g === 'M' ? '/images/sign/male.png' : '/images/sign/female.png'} className="w-5 h-5 invert dark:invert-0 brightness-0 dark:brightness-100" style={p.gender === g ? { filter: 'invert(0)' } : {}} alt={g} />
                                                            {g === 'M' ? 'Male' : 'Female'}
                                                        </button>
                                                    ))}
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="Age"
                                                    className="w-24 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold outline-none focus:border-yellow-500 text-center"
                                                    value={p.age}
                                                    onChange={(e) => {
                                                        const newP = [...passengers];
                                                        newP[idx].age = e.target.value;
                                                        setPassengers(newP);
                                                    }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Weight (KG)"
                                                    className="w-32 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold outline-none focus:border-yellow-500 text-center"
                                                    value={p.weight}
                                                    onChange={(e) => {
                                                        const newP = [...passengers];
                                                        newP[idx].weight = e.target.value;
                                                        setPassengers(newP);
                                                        // Auto Suggest Logic for overweight
                                                        if (selectedCat === "SOLO" && parseInt(e.target.value) > 75) {
                                                            showError("Solo ride limit is 75 KG. We recommend Couple option.");
                                                        }
                                                        if (selectedCat === "COUPLE" && idx === 1 && parseInt(newP[0].weight) + parseInt(e.target.value) > 150) {
                                                            showError("Combined weight exceeds 150 KG limit for Couple ride.");
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}


                                    {selectedCat === "FAMILY" && (
                                        <button
                                            className="w-full py-3 border border-dashed border-gray-400 dark:border-white/30 rounded-xl text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:border-gray-600 dark:hover:border-white/50 transition-colors bg-gray-100 dark:bg-white/5 font-bold flex items-center justify-center"
                                            onClick={() => setPassengers([...passengers, { gender: "M", weight: "", age: "" }])}
                                        >
                                            <Users className="w-5 h-5 mr-2" /> Add Family Member
                                        </button>
                                    )}
                                    {/* Moved Contact Form to Top */}


                                    <button
                                        onClick={validateDetailsForm}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 font-bold text-black text-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all"
                                    >
                                        Submit & Verify Slot
                                    </button>

                                    {selectedCat === "SHARING" && (
                                        <div className="text-center text-sm text-yellow-400 mt-2">
                                            "You may be paired with another rider based on slot availability."
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    )}



                    {/* STEP 4 & 5 Combined: Slot and Payment */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8"
                        >
                            {/* Slot Selection Panel */}
                            <div className="flex-1 bg-white/10 dark:bg-black/60 backdrop-blur-sm border border-white/30 dark:border-white/5 rounded-3xl p-8 h-fit shadow-xl dark:shadow-none">
                                <h3 className="text-2xl font-bold mb-6">Schedule Your Flight</h3>

                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl px-4 py-4 text-lg font-bold text-gray-900 dark:text-white outline-none focus:border-yellow-500 mb-6 dark:[color-scheme:dark]"
                                />

                                <div className="space-y-3">
                                    {MOCK_SLOTS.map(slot => {
                                        const available = slot.totalSeats - slot.bookedSeats;
                                        const isFull = available <= 0;
                                        return (
                                            <button
                                                key={slot.id}
                                                disabled={isFull}
                                                onClick={() => setSelectedSlot(slot.id)}
                                                className={`w-full p-4 rounded-xl border-2 flex justify-between items-center transition-all ${isFull ? 'opacity-50 bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-500/30 cursor-not-allowed' :
                                                    selectedSlot === slot.id ? 'bg-yellow-500 border-yellow-500 text-black font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                                                        'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-yellow-500/50 dark:hover:border-yellow-500/50'
                                                    }`}
                                            >
                                                <span className={`text-xl font-bold ${selectedSlot === slot.id ? 'text-black' : 'text-gray-900 dark:text-white'}`}>{slot.time}</span>
                                                {isFull ? (
                                                    <span className="text-red-600 dark:text-red-400 font-bold">SOLD OUT</span>
                                                ) : (
                                                    <span className={selectedSlot === slot.id ? 'text-black font-black text-sm' : 'text-green-600 dark:text-green-400 font-bold text-sm'}>
                                                        {available} Seats Left
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Payment Summary Panel */}
                            <div className="flex-[0.8] bg-white/80 dark:bg-black/60 backdrop-blur-sm text-black dark:text-white rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-xl border border-white/30 dark:border-white/5">
                                <h3 className="text-2xl font-black mb-6">Booking Summary</h3>

                                <div className="space-y-4 mb-8 flex-1">
                                    <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                                        <div>
                                            <div className="font-bold text-gray-500 text-sm">{selectedCat} Package</div>
                                            <div className="text-xl font-black">{PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg)?.name}</div>
                                        </div>
                                        <div className="text-xl font-bold">₹{calculateTotal().base.toLocaleString()}</div>
                                    </div>

                                    <div className="flex justify-between font-medium text-gray-600">
                                        <span>Safety Insurance ({calculateTotal().travelers} Pax)</span>
                                        <span>₹{calculateTotal().ins.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between font-medium text-gray-600">
                                        <span>GST (18%)</span>
                                        <span>₹{calculateTotal().gst.toLocaleString()}</span>
                                    </div>

                                    <div className="mt-4 bg-gray-100 p-4 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-500">GRAND TOTAL</span>
                                            <span className="text-3xl font-black text-yellow-600">₹{calculateTotal().total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <p className="font-bold text-sm text-gray-500">PAY VIA</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['UPI', 'Card', 'NetBanking', 'Pay Later'].map(method => (
                                            <button
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`py-3 rounded-xl border-2 font-bold transition-all ${paymentMethod === method ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CONSENT FORM & PAYMENT (Under Payment Summary Panel) */}
                    {step === 4 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl mx-auto mt-6"
                        >
                            <div className="bg-white/10 dark:bg-black/60 backdrop-blur-sm border border-white/30 dark:border-white/5 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    Participant Confirmation
                                </h3>
                                <p className="text-gray-600 dark:text-white/60 mb-6 font-medium text-sm">Review & accept the mandatory terms before proceeding.</p>

                                <div className="space-y-4 mb-8">
                                    <div className="space-y-3 p-5 rounded-2xl bg-yellow-50 dark:bg-black/40 border border-yellow-200 dark:border-yellow-500/20">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-yellow-500 focus:ring-yellow-500 transition-colors" checked={consent.terms} onChange={(e) => setConsent({ ...consent, terms: e.target.checked })} />
                                            <span className="text-sm font-semibold text-gray-800 dark:text-white/90 group-hover:text-black dark:group-hover:text-white flex-1 leading-relaxed">
                                                I confirm that I am medically fit, not under the influence of alcohol, and my weight is within the permitted limits (Solo/Sharing: 75kg max, Couple: 150kg combined max). I understand the risks involved, agree to follow all safety instructions, and accept the <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800">Terms & Conditions</a>. Incorrect info may result in cancellation without refund.
                                            </span>
                                        </label>
                                    </div>

                                    {/* Optional Checkbox */}
                                    <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                                        <h4 className="text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">Optional Media Consent</h4>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" checked={consent.media} onChange={(e) => setConsent({ ...consent, media: e.target.checked })} />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-white/70 group-hover:text-black dark:group-hover:text-white">I allow Goldwing Adventure Tours to use my photos/videos for promotional purposes.</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <p className="text-xs text-gray-500 dark:text-white/50 font-medium max-w-lg mx-auto leading-relaxed">
                                        By clicking “Confirm Booking”, I digitally agree to the above terms and acknowledge this as a legally binding electronic consent. <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800">View Full Terms & Conditions</a>
                                    </p>
                                </div>

                                <button
                                    disabled={!selectedSlot || !isConsentValid}
                                    onClick={handlePayment}
                                    className={`w-full py-5 rounded-2xl font-black text-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 ${!selectedSlot || !isConsentValid ? 'bg-gray-300 dark:bg-white/10 text-gray-500 dark:text-white/30 cursor-not-allowed' : 'bg-black text-white hover:scale-[1.01] shadow-2xl'}`}
                                >
                                    <CreditCard className="w-6 h-6" /> Pay & Confirm Booking
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: CONFIRMATION */}
                    {step === 6 && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-2xl mx-auto text-center"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                                <Check className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-4xl font-black mb-2">Booking Confirmed!</h2>
                            <p className="text-white/70 mb-8">Adventure awaits. Your slot is securely locked.</p>

                            <div className="bg-white/30 dark:bg-white/5 border border-white/30 dark:border-white/5 p-8 rounded-3xl text-left mb-8 shadow-2xl relative overflow-hidden text-gray-900 dark:text-white">
                                <p className="text-yellow-600 dark:text-yellow-400 font-bold text-sm mb-1">BOOKING ID</p>
                                <p className="text-3xl font-mono tracking-wider font-bold mb-6 text-gray-900 dark:text-white">{bookingId}</p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-gray-500 dark:text-white/50 text-sm font-semibold mb-1">DATE & TIME</p>
                                        <p className="font-bold text-lg">{selectedDate} / {MOCK_SLOTS.find(s => s.id === selectedSlot)?.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-white/50 text-sm font-semibold mb-1">RIDE TYPE</p>
                                        <p className="font-bold text-lg">{PACKAGES_DATA[selectedCat]?.find(p => p.id === selectedPkg)?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-white/50 text-sm font-semibold mb-1">PASSENGERS</p>
                                        <p className="font-bold text-lg">{passengers.length} Persons</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <button onClick={handleDownloadTicket} className="flex items-center justify-center px-8 py-4 bg-yellow-500 text-black hover:bg-yellow-400 rounded-xl font-bold transition shadow-lg">
                                    <Download className="w-5 h-5 mr-2" /> Download Ticket
                                </button>
                                <button onClick={handleDownloadInvoice} className="flex items-center justify-center px-8 py-4 bg-blue-500 text-white hover:bg-blue-600 rounded-xl font-bold transition shadow-lg">
                                    <Download className="w-5 h-5 mr-2" /> View Invoice
                                </button>
                                <button className="flex items-center justify-center px-8 py-4 bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-xl font-bold transition backdrop-blur-md" onClick={() => window.open('https://maps.google.com', '_blank')}>
                                    <MapPin className="w-5 h-5 mr-2" /> Start the Adventure
                                </button>
                            </div>

                            <div className="mt-8">
                                <button onClick={() => window.location.href = '/explore'} className="text-white/60 hover:text-white transition font-bold border-b border-transparent hover:border-white">
                                    Return to Home
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[200]">
                <a href="tel:+918087968502" className="bg-[#2E7CCB] hover:bg-blue-600 text-white shadow-[0_4px_15px_rgba(46,124,203,0.4)] transition-transform hover:scale-110 p-5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </a>
                <a href="https://wa.me/918087968502" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-green-600 text-white shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 p-5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </a>
            </div>

            {/* Live Notifications */}
            <LiveNotifications />

            {/* Terms and Conditions Modal */}
            <TermsAndConditionsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
        </div >
    );
}
