"use client";

import { motion } from "motion/react";
import { Shirt, CreditCard, Glasses, Droplet, Camera } from "lucide-react";

const items = [
  {
    icon: Shirt,
    title: "Comfortable Clothes",
    description: "Loose-fitting athletic wear",
  },
  {
    icon: CreditCard,
    title: "ID Proof",
    description: "Valid government ID required",
  },
  {
    icon: Glasses,
    title: "Sunglasses",
    description: "Protect your eyes from glare",
  },
  {
    icon: Droplet,
    title: "Water Bottle",
    description: "Stay hydrated before flight",
  },
  {
    icon: Camera,
    title: "Phone/Camera",
    description: "Capture the memories",
  },
];

export function ThingsToCarry() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-[#0B0F19] to-[#111827] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Things To Carry
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Pack light and prepare for your adventure
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#D4AF37]/50 transition-all text-center"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#F7C948] rounded-xl flex items-center justify-center mb-4"
              >
                <item.icon className="w-8 h-8 text-[#0B0F19]" />
              </motion.div>
              <h3 className="text-white font-semibold mb-2 text-sm md:text-base">
                {item.title}
              </h3>
              <p className="text-white/60 text-xs md:text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
            <p className="text-white/70">
              <span className="text-[#D4AF37] font-semibold">Note:</span> All safety equipment provided by us
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
