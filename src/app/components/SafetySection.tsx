"use client";

import { motion } from "motion/react";
import { ShieldCheck, Clock, Users, Weight, Calendar, CloudRain } from "lucide-react";

const safetyPoints = [
  {
    icon: ShieldCheck,
    title: "Licensed Pilots",
    description: "DGCA certified with 500+ flight hours",
  },
  {
    icon: ShieldCheck,
    title: "Safety Gear Provided",
    description: "Premium helmets, harnesses & equipment",
  },
  {
    icon: Users,
    title: "Age Limit",
    description: "12+ years (with parental consent)",
  },
  {
    icon: Weight,
    title: "Weight Limit",
    description: "40-100 kg for optimal safety",
  },
  {
    icon: Clock,
    title: "Operating Hours",
    description: "6:00 AM - 6:00 PM daily",
  },
  {
    icon: CloudRain,
    title: "Weather Policy",
    description: "100% refund if weather cancels",
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="py-20 md:py-32 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#16A34A] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center max-w-7xl mx-auto">
          {/* Left: Pilot Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/safety-check.png"
                alt="Safety Check - Professional Pilot"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />

              {/* Stats Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-[#D4AF37]">2000+</div>
                    <div className="text-white/70 text-sm">Safe Flights</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#D4AF37]">100%</div>
                    <div className="text-white/70 text-sm">Safety Record</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 top-10 -left-10 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl" />
            <div className="absolute -z-10 bottom-10 -right-10 w-40 h-40 bg-[#16A34A]/20 rounded-full blur-3xl" />
          </motion.div>

          {/* Right: Safety Points */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Safety First, Thrills Always
              </h2>
              <p className="text-white/70 text-lg">
                Your safety is our top priority. We maintain the highest standards in equipment, training, and operations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safetyPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#16A34A] to-[#16A34A]/70 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <point.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{point.title}</h3>
                      <p className="text-white/60 text-sm">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Certification Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-gradient-to-r from-[#D4AF37]/10 to-[#16A34A]/10 border border-[#D4AF37]/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F7C948] rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#0B0F19]" />
                </div>
                <div>
                  <div className="text-white font-bold">DGCA Certified</div>
                  <div className="text-white/70 text-sm">Directorate General of Civil Aviation Approved</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
