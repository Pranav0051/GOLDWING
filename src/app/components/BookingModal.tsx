"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Check } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackageId?: string;
}

const packages = [
  { id: "basic", name: "Basic Ride", price: 3499 },
  { id: "premium", name: "Premium Ride", price: 5999 },
  { id: "sunrise", name: "Sunrise Special", price: 8999 },
];

export function BookingModal({ isOpen, onClose, selectedPackageId }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(selectedPackageId || "premium");
  const [selectedDate, setSelectedDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const selectedPkg = packages.find((p) => p.id === selectedPackage);
  const totalPrice = selectedPkg ? selectedPkg.price * travelers : 0;
  const advancePayment = 500 * travelers;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setStep(5);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full md:max-w-2xl bg-[#111827] border border-white/10 rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#111827] border-b border-white/10 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">Book Your Flight</h2>
              <p className="text-white/60 text-sm mt-1">Step {step} of 5</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/5">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 5) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7C948]"
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Select Package</h3>
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedPackage === pkg.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold text-lg">{pkg.name}</div>
                        <div className="text-white/60 text-sm">₹{pkg.price.toLocaleString()} per person</div>
                      </div>
                      {selectedPackage === pkg.id && (
                        <Check className="w-6 h-6 text-[#D4AF37]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Choose Date</h3>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37] pointer-events-none" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 cursor-pointer hover:bg-white/10 transition-all"
                    style={{
                      colorScheme: 'dark',
                    }}
                  />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-white/70 text-sm mb-3">Available Time Slots</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { time: "6:00 AM", total: 20, booked: 18 },
                      { time: "7:00 AM", total: 20, booked: 5 },
                      { time: "4:00 PM", total: 20, booked: 20 },
                      { time: "5:00 PM", total: 20, booked: 2 },
                    ].map((slot) => {
                      const remaining = slot.total - slot.booked;
                      const isFull = remaining === 0;

                      return (
                        <button
                          key={slot.time}
                          disabled={isFull}
                          className={`flex flex-col text-left border rounded-lg p-3 transition-all ${isFull ? 'border-red-500/30 bg-red-500/10 opacity-50 cursor-not-allowed' : 'bg-white/5 hover:bg-[#D4AF37]/10 border-white/10 hover:border-[#D4AF37]/50'} `}
                        >
                          <div className="flex justify-between w-full items-center mb-1">
                            <span className="text-white font-bold">{slot.time}</span>
                            <span className={isFull ? "text-red-400 text-xs" : "text-[#D4AF37] text-xs font-bold"}>
                              {isFull ? "FULL" : `🔥 ${remaining} Left`}
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                            <div className={`h-full ${isFull ? 'bg-red-500' : 'bg-[#16A34A]'}`} style={{ width: `${(slot.booked / slot.total) * 100}%` }}></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Add Travelers</h3>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Number of Travelers</div>
                      <div className="text-white/60 text-sm">Age 12+</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all"
                      >
                        -
                      </button>
                      <span className="text-white font-bold text-xl w-8 text-center">{travelers}</span>
                      <button
                        onClick={() => setTravelers(Math.min(10, travelers + 1))}
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Total Price</span>
                    <span className="text-[#D4AF37] font-bold text-2xl">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Enter Details</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]/50"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]/50"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]/50"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]/50"
                  />
                  <button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B0F19] px-6 rounded-2xl font-semibold transition-all">
                    Apply
                  </button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Advance Payment</span>
                    <span>₹{advancePayment.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
                    <span>Pay Now</span>
                    <span className="text-[#D4AF37]">₹{advancePayment.toLocaleString()}</span>
                  </div>
                  <div className="text-white/60 text-xs">
                    Balance ₹{(totalPrice - advancePayment).toLocaleString()} due on arrival
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8 }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-[#16A34A] to-[#16A34A]/70 rounded-full flex items-center justify-center mb-6"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h3>
                <p className="text-white/70 mb-2">Your adventure awaits!</p>
                <p className="text-white/60 text-sm mb-8">
                  Confirmation sent to {formData.email}
                </p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F7C948] text-[#0B0F19] px-8 py-3 rounded-full font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {step < 5 && (
            <div className="sticky bottom-0 bg-[#111827] border-t border-white/10 p-6 flex gap-3">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-full font-semibold transition-all"
                >
                  Back
                </button>
              )}
              <button
                onClick={step === 4 ? handleSubmit : handleNext}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#F7C948] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] text-[#0B0F19] py-3 rounded-full font-semibold transition-all"
              >
                {step === 4 ? "Confirm & Pay" : "Continue"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
