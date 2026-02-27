import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, MapPin, AlertCircle, RefreshCw, FileText } from "lucide-react";

export function TermsAndConditionsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] p-4 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 text-gray-900 dark:text-white">
                                <FileText className="w-6 h-6 text-yellow-500" />
                                Terms & Conditions
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-900 dark:text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 text-gray-700 dark:text-white/80 select-text">

                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    1. Medical & Fitness Requirements
                                </h3>
                                <div className="pl-7 space-y-2 text-sm leading-relaxed">
                                    <p>• Participants must be physically and medically fit to undertake adventure flying.</p>
                                    <p>• Flying is Strictly Prohibited for individuals suffering from heart conditions, epilepsy, severe back or neck problems, uncontrolled high blood pressure, or pregnant women.</p>
                                    <p>• Participants must not be under the influence of alcohol, drugs, or any intoxicating substances before or during the flight.</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    2. Weight & Age Restrictions
                                </h3>
                                <div className="pl-7 space-y-2 text-sm leading-relaxed">
                                    <p>• <strong>Solo & Sharing Packages:</strong> Maximum permitted weight is <strong>75 KG</strong> per person.</p>
                                    <p>• <strong>Couple Package:</strong> Combined maximum permitted weight is <strong>150 KG</strong>.</p>
                                    <p>• <strong>Age Limit:</strong> Minimum age limit is 12 years. Minors must have written parental consent.</p>
                                    <p className="text-red-500 font-semibold mt-2 text-xs uppercase tracking-wide">
                                        Note: We weigh passengers individually before flights. Submitting false weight information during booking will result in immediate cancellation without refund.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <RefreshCw className="w-5 h-5 text-blue-500" />
                                    3. Rescheduling & Weather Policy
                                </h3>
                                <div className="pl-7 space-y-2 text-sm leading-relaxed">
                                    <p>• Paramotoring is highly dependent on wind and weather conditions. Flight times are approximate and subject to change.</p>
                                    <p>• The Chief Pilot reserves the final right to delay, abbreviate, or cancel flights for safety reasons.</p>
                                    <p>• If a flight is cancelled by us due to weather factors, you will be offered a free reschedule or a 100% refund.</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <MapPin className="w-5 h-5 text-yellow-500" />
                                    4. Reporting & General Guidelines
                                </h3>
                                <div className="pl-7 space-y-2 text-sm leading-relaxed">
                                    <p>• Passengers must report to the take-off site at least 30 minutes prior to their booked slot via the digitally issued map link.</p>
                                    <p>• Late arrivals may result in slot forfeiture without refund.</p>
                                    <p>• Loose clothing, scarves, unfastened dupattas, and open sandals/slippers are strictly prohibited. Wear comfortable fitted clothing and secure sports shoes.</p>
                                    <p>• Passengers must follow all instructions given by the Goldwing Adventure Tours staff unequivocally.</p>
                                </div>
                            </section>

                            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 p-4 rounded-xl mt-6">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                                    By proceeding with the booking, you acknowledge that you have read, understood, and agreed to all the terms listed above.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 md:p-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors shadow-lg"
                            >
                                I Understand & Agree
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
