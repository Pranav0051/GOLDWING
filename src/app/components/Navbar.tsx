"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ onBookClick }: { onBookClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? "bg-[#0B0F19] shadow-lg border-b border-white/10 py-2"
        : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <img
              src="/goldwing-logo.png"
              alt="Goldwing Adventure Tour"
              className="h-12 md:h-14 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-white font-bold tracking-tight text-base md:text-lg leading-tight">
                GOLDWING
              </h1>
              <p className="text-[#D4AF37] text-[10px] md:text-xs tracking-wider">ADVENTURE TOUR</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#experiences" className="text-white/80 hover:text-[#D4AF37] transition-colors">
              Experiences
            </a>
            <a href="#pricing" className="text-white/80 hover:text-[#D4AF37] transition-colors">
              Pricing
            </a>
            <a href="#safety" className="text-white/80 hover:text-[#D4AF37] transition-colors">
              Safety
            </a>
            <a href="#testimonials" className="text-white/80 hover:text-[#D4AF37] transition-colors">
              Reviews
            </a>
            <a href="tel:+911234567890" className="flex items-center gap-2 text-white/80 hover:text-[#D4AF37] transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 123 456 7890</span>
            </a>
            <ThemeToggle />
            <button
              onClick={onBookClick}
              className="bg-[#E10600] hover:bg-[#E10600]/90 text-white px-6 py-2.5 rounded-full transition-all hover:shadow-[0_0_20px_rgba(225,6,0,0.5)] hover:scale-105"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-lg">
              <a href="#experiences" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors">
                Experiences
              </a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors">
                Pricing
              </a>
              <a href="#safety" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors">
                Safety
              </a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-white/80 hover:text-[#D4AF37] transition-colors">
                Reviews
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-white/80 hover:text-[#D4AF37] transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 123 456 7890</span>
              </a>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onBookClick();
                }}
                className="bg-[#E10600] active:bg-[#E10600]/90 text-white px-6 py-3 rounded-full transition-all w-full mt-4"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
