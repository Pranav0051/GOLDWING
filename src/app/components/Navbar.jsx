"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router";
export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        // Check initial login state
        setIsAdmin(localStorage.getItem("isAdminLoggedIn") === "true");
        // Initial check
        setIsLightTheme(document.documentElement.classList.contains("light-theme"));
        // Watch for theme changes
        const observer = new MutationObserver(() => {
            setIsLightTheme(document.documentElement.classList.contains("light-theme"));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);
    return (<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
            ? (isLightTheme ? "bg-white shadow-lg border-b border-black/10 py-2" : "bg-[#0B0F19] shadow-lg border-b border-white/10 py-2")
            : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
            <img src="/goldwing-logo.png" alt="Goldwing Adventure Tour" className="h-10 md:h-14 w-auto object-contain"/>
            <div className="block">
              <h1 className={`font-bold tracking-tight text-sm md:text-lg leading-tight transition-colors ${isScrolled && isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>
                GOLDWING
              </h1>
              <p className="text-[#D4AF37] text-[8px] md:text-xs tracking-wider">ADVENTURE TOUR</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#experiences" className={`transition-colors font-medium ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
              Experiences
            </a>
            <a href="#pricing" className={`transition-colors font-medium ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
              Pricing
            </a>
            <a href="#safety" className={`transition-colors font-medium ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
              Safety
            </a>

            <a href="tel:+911234567890" className={`flex items-center gap-2 transition-colors group font-medium ${(isScrolled && isLightTheme) ? "text-[#0B0F19]/80 hover:text-[#D4AF37]" : "text-white/80 hover:text-[#D4AF37]"}`}>
              <motion.div animate={{
            rotate: [0, -10, 10, -10, 10, 0],
        }} transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
        }} className="w-8 h-8 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#D4AF37]"/>
              </motion.div>
              <span>+91 123 456 7890</span>
            </a>
            <ThemeToggle className={(isScrolled && isLightTheme) ? "ring-1 ring-black/10 shadow-sm" : ""}/>
            <Link to={isAdmin ? "/admin" : "/login"} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${(isScrolled && isLightTheme) ? "bg-black/5 border-black/10 text-[#0B0F19]" : "bg-white/10 border-white/20 text-white"} hover:bg-[#D4AF37] hover:text-[#0B0F19] hover:border-[#D4AF37] group`}>
              <User className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAdmin ? "text-amber-500 fill-amber-500" : ""}`}/>
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <Link to={isAdmin ? "/admin" : "/login"} className={`p-2 rounded-lg flex items-center justify-center border ${(isScrolled && isLightTheme) ? "border-black/10 text-[#0B0F19]" : "border-white/20 text-white"}`}>
              <User className={`w-6 h-6 ${isAdmin ? "text-amber-500 fill-amber-500" : ""}`}/>
            </Link>
            <ThemeToggle className={(isScrolled && isLightTheme) ? "ring-1 ring-black/10 shadow-sm" : ""}/>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 transition-colors ${isScrolled && isLightTheme ? "text-[#0B0F19]" : "text-white"}`}>
              {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`md:hidden mt-4 pb-4 space-y-4 max-h-[80vh] overflow-y-auto rounded-2xl p-4 transition-colors ${isLightTheme ? "bg-white shadow-xl border border-black/5" : "bg-[#0B0F19] shadow-xl border border-white/5"}`}>
            <div className="flex flex-col gap-6 text-lg">
              <a href="#experiences" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors font-medium ${isLightTheme ? "text-[#0B0F19]/80" : "text-white/80"}`}>
                Experiences
              </a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors font-medium ${isLightTheme ? "text-[#0B0F19]/80" : "text-white/80"}`}>
                Pricing
              </a>
              <a href="#safety" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors font-medium ${isLightTheme ? "text-[#0B0F19]/80" : "text-white/80"}`}>
                Safety
              </a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors font-medium ${isLightTheme ? "text-[#0B0F19]/80" : "text-white/80"}`}>
                Reviews
              </a>
              <a href="tel:+911234567890" className={`flex items-center gap-3 transition-colors group font-semibold ${isLightTheme ? "text-[#0B0F19]/80" : "text-white/80"}`}>
                <motion.div animate={{
                rotate: [0, -10, 10, -10, 10, 0],
            }} transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
            }} className="w-10 h-10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#D4AF37]"/>
                </motion.div>
                <span>+91 123 456 7890</span>
              </a>
            </div>
          </motion.div>)}
      </div>
    </motion.nav>);
}
