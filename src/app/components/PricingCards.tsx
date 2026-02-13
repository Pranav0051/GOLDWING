"use client";

import { motion } from "motion/react";
import { Check, X, Sparkles } from "lucide-react";

const packages = [
  {
    id: "basic",
    name: "Basic Ride",
    price: "₹3,499",
    popular: false,
    duration: "5-7 Minutes",
    height: "500 ft",
    distance: "2 km",
    includes: [
      "Certified Pilot",
      "Safety Gear",
      "Basic Insurance",
      "Ground Photos",
    ],
    excludes: [
      "Video Recording",
      "Extended Flight",
      "Premium Pick-up",
    ],
  },
  {
    id: "premium",
    name: "Premium Ride",
    price: "₹5,999",
    popular: true,
    duration: "10-15 Minutes",
    height: "1000 ft",
    distance: "5 km",
    includes: [
      "Certified Pilot",
      "Premium Safety Gear",
      "Full Insurance",
      "HD Video Recording",
      "Professional Photos",
      "Digital Certificate",
    ],
    excludes: [
      "Sunrise Slot",
      "Private Session",
    ],
  },
  {
    id: "sunrise",
    name: "Sunrise Special",
    price: "₹8,999",
    popular: false,
    duration: "15-20 Minutes",
    height: "1200 ft",
    distance: "8 km",
    includes: [
      "Expert Pilot",
      "Premium Safety Gear",
      "Full Insurance",
      "4K Video Recording",
      "Professional Photoshoot",
      "Digital Certificate",
      "Sunrise Slot",
      "Breakfast",
      "Free Merchandise",
    ],
    excludes: [],
  },
];

export function PricingCards({ onBookClick }: { onBookClick: (packageId: string) => void }) {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Choose Your Flight
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Select the perfect package for your adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ y: -10, scale: pkg.popular ? 1.02 : 1.05 }}
              className={`group relative bg-white/5 backdrop-blur-md border rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                pkg.popular
                  ? "border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.3)] md:scale-105"
                  : "border-white/10 hover:border-[#D4AF37]/50"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#F7C948] text-[#0B0F19] px-6 py-2 rounded-full flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-sm">MOST POPULAR</span>
                  </div>
                </div>
              )}

              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
                pkg.popular
                  ? "bg-gradient-to-br from-[#D4AF37]/10 to-transparent"
                  : "bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/5 group-hover:to-transparent"
              }`} />

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold text-[#D4AF37]">
                      {pkg.price}
                    </span>
                    <span className="text-white/60">/person</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 py-6 border-y border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Duration</span>
                    <span className="text-white font-semibold">{pkg.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Max Height</span>
                    <span className="text-white font-semibold">{pkg.height}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Distance</span>
                    <span className="text-white font-semibold">{pkg.distance}</span>
                  </div>
                </div>

                {/* Includes */}
                <div className="space-y-3">
                  <p className="text-white/90 font-semibold">Includes:</p>
                  <ul className="space-y-2">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excludes */}
                {pkg.excludes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-white/90 font-semibold">Excludes:</p>
                    <ul className="space-y-2">
                      {pkg.excludes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <X className="w-5 h-5 text-white/40 flex-shrink-0 mt-0.5" />
                          <span className="text-white/50 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => onBookClick(pkg.id)}
                  className={`w-full py-4 rounded-full font-semibold transition-all ${
                    pkg.popular
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F7C948] text-[#0B0F19] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-[#D4AF37]/50"
                  }`}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 text-center space-y-4"
        >
          <p className="text-white/70">
            <span className="text-[#16A34A]">✓</span> Full Refund Available · Weather Monitored Daily
          </p>
          <p className="text-white/60 text-sm">
            Pay ₹500 to reserve your slot · Balance on arrival
          </p>
        </motion.div>
      </div>
    </section>
  );
}
