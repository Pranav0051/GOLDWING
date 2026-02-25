"use client";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
export function Footer() {
    return (<footer className="bg-[#0B0F19] border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/goldwing-logo.png" alt="Goldwing Adventure Tour" className="h-16 w-auto object-contain"/>
              <div>
                <h1 className="text-white font-bold tracking-tight text-lg">
                  GOLDWING
                </h1>
                <p className="text-[#D4AF37] text-xs tracking-widest">ADVENTURE TOUR</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              Experience the thrill of flight with premium paramotor adventures. Your safety is our top priority.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
                <Facebook className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
                <Instagram className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
                <Twitter className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#D4AF37] border border-white/10 hover:border-[#D4AF37] rounded-full flex items-center justify-center transition-all group">
                <Youtube className="w-5 h-5 text-white/70 group-hover:text-[#0B0F19]"/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#experiences" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Experiences
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#safety" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Safety
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-bold mb-4">Policies</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors">
                  Safety Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1"/>
                <span className="text-white/70 text-sm">
                  Arambol Beach, North Goa, India - 403524
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1"/>
                <a href="tel:+911234567890" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1"/>
                <a href="mailto:info@goldwingadventure.com" className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm">
                  info@goldwingadventure.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2026 Gold Wing Adventure. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse"/>
                <span className="text-white/60 text-sm">Live Weather Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>);
}
