"use client";
import { motion } from "motion/react";
import { MapPin, Shield, Package, Plane, Wind, CheckCircle } from "lucide-react";
const steps = [
    {
        icon: MapPin,
        title: "Arrival",
        description: "Meet at our adventure hub",
    },
    {
        icon: Shield,
        title: "Safety Briefing",
        description: "Complete safety instructions",
    },
    {
        icon: Package,
        title: "Gear Setup",
        description: "Professional equipment fitting",
    },
    {
        icon: Plane,
        title: "Take Off",
        description: "Begin your sky journey",
    },
    {
        icon: Wind,
        title: "Sky Ride",
        description: "Experience the thrill",
    },
    {
        icon: CheckCircle,
        title: "Smooth Landing",
        description: "Safe return to ground",
    },
];
export function FlightTimeline() {
    return (<section className="py-20 md:py-32 bg-gradient-to-b from-[#111827] to-[#0B0F19] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Your Flight Journey
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            A seamless experience from arrival to landing
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20"/>

          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, index) => (<motion.div key={step.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.8 }} className="relative">
                {/* Connector Dot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#0B0F19]"/>

                <div className="pt-12 flex flex-col items-center text-center">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F7C948] rounded-xl flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-[#0B0F19]"/>
                  </motion.div>
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.description}</p>
                </div>
              </motion.div>))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden max-w-md mx-auto relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20"/>

          <div className="space-y-8">
            {steps.map((step, index) => (<motion.div key={step.title} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.8 }} className="relative flex items-start gap-6">
                {/* Connector Dot */}
                <div className="relative z-10 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#0B0F19] flex-shrink-0 mt-6"/>

                <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F7C948] rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-[#0B0F19]"/>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1">{step.title}</h3>
                      <p className="text-white/70 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </div>
        </div>
      </div>
    </section>);
}
