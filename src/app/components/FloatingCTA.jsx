"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone } from "lucide-react";
export function FloatingCTA({ onBookClick }) {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (<>
      {/* WhatsApp Button */}
      <motion.a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`fixed right-6 z-40 w-16 h-16 bg-[#25D366] hover:bg-[#25D366]/90 rounded-full flex items-center justify-center shadow-[0_4_15px_rgba(37,211,102,0.4)] transition-all duration-300 ${isVisible ? 'bottom-24 opacity-100 translate-y-0' : 'bottom-6 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* @ts-ignore */}
        <lord-icon src="https://cdn.lordicon.com/qtenrimd.json" trigger="hover" stroke="light" colors="primary:#1a1a1a,secondary:#ffffff,tertiary:#ffffff" style={{ width: '44px', height: '44px' }}/>
      </motion.a>

      {/* Sticky Book Now Button (Mobile) */}
      <AnimatePresence>
        {isVisible && (<motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 p-4">
            <button onClick={onBookClick} className="w-full bg-gradient-to-r from-[#E10600] to-[#E10600]/80 hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] text-white py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2">
              <Phone className="w-5 h-5"/>
              <span>Book Your Flight Now</span>
            </button>
          </motion.div>)}
      </AnimatePresence>
    </>);
}
