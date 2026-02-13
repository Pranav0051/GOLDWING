"use client";

import { motion } from "motion/react";
import { Plane, Bike, Gamepad2, Mountain, Waves, Users } from "lucide-react";

const adventures = [
  {
    id: "paramotor",
    icon: Plane,
    title: "Paramotor",
    description: "Fly like a bird over stunning landscapes",
    image: "https://images.unsplash.com/photo-1760736243132-4ca7758d7c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhbW90b3IlMjBmbHlpbmclMjBzdW5zZXQlMjBza3klMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcwOTYzOTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    available: true,
  },
  {
    id: "atv",
    icon: Bike,
    title: "ATV Ride",
    description: "Conquer rugged terrains on powerful ATVs",
    image: "https://images.unsplash.com/photo-1542762002-45279e010961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdHYlMjBxdWFkJTIwYmlrZSUyMGFkdmVudHVyZXxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: false,
  },
  {
    id: "indoor",
    icon: Gamepad2,
    title: "Indoor Games",
    description: "Fun-filled activities for all ages",
    image: "https://images.unsplash.com/photo-1761583186607-2ef32d185b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBzcG9ydHMlMjBvdXRkb29yJTIwZXhwZXJpZW5jZXxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: false,
  },
  {
    id: "trekking",
    icon: Mountain,
    title: "Trekking",
    description: "Explore scenic mountain trails",
    image: "https://images.unsplash.com/photo-1761583186607-2ef32d185b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBzcG9ydHMlMjBvdXRkb29yJTIwZXhwZXJpZW5jZXxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: false,
  },
  {
    id: "watersports",
    icon: Waves,
    title: "Water Sports",
    description: "Thrilling aquatic adventures await",
    image: "https://images.unsplash.com/photo-1734438237000-d3a70f1e4e88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHNwb3J0cyUyMGFkdmVudHVyZSUyMGFjdGl2aXR5fGVufDF8fHx8MTc3MDk2Mzk3MHww&ixlib=rb-4.1.0&q=80&w=1080",
    available: false,
  },
  {
    id: "corporate",
    icon: Users,
    title: "Corporate Packages",
    description: "Team building activities for companies",
    image: "https://images.unsplash.com/photo-1761583186607-2ef32d185b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBzcG9ydHMlMjBvdXRkb29yJTIwZXhwZXJpZW5jZXxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    available: false,
  },
];

export function FutureAdventures() {
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
            More Adventures
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Explore our complete range of thrilling experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {adventures.map((adventure, index) => (
            <motion.div
              key={adventure.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-[#D4AF37]/50 transition-all cursor-pointer"
            >
              {/* Background Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={adventure.image}
                  alt={adventure.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-transparent" />

                {/* Status Badge */}
                {!adventure.available && (
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1">
                    <span className="text-white text-sm font-semibold">Coming Soon</span>
                  </div>
                )}

                {/* Icon */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F7C948] rounded-xl flex items-center justify-center">
                    <adventure.icon className="w-6 h-6 text-[#0B0F19]" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-white font-bold text-xl mb-2">{adventure.title}</h3>
                <p className="text-white/70">{adventure.description}</p>

                {adventure.available && (
                  <button className="mt-4 text-[#D4AF37] font-semibold hover:text-[#F7C948] transition-colors">
                    Explore →
                  </button>
                )}
              </div>

              {/* Hover Reveal */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
