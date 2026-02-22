"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Mumbai",
    rating: 5,
    image: "https://images.unsplash.com/photo-1595956936239-4cad0fa009e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwdGVzdGltb25pYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    review:
      "Absolutely incredible experience! The pilot was professional and made me feel completely safe. The views were breathtaking. Highly recommend!",
    package: "Premium Ride",
  },
  {
    name: "Priya Patel",
    location: "Pune",
    rating: 5,
    image: "https://images.unsplash.com/photo-1595956936239-4cad0fa009e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwdGVzdGltb25pYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    review:
      "Best birthday gift ever! The sunrise special was magical. The team was amazing and the video they captured is something I'll treasure forever.",
    package: "Sunrise Special",
  },
  {
    name: "Arjun Mehta",
    location: "Delhi",
    rating: 5,
    image: "https://images.unsplash.com/photo-1595956936239-4cad0fa009e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwdGVzdGltb25pYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    review:
      "Life-changing experience! I was nervous at first but the safety briefing and the pilot's expertise put me at ease. Flying over the ocean was surreal!",
    package: "Basic Ride",
  },
  {
    name: "Sneha Reddy",
    location: "Bangalore",
    rating: 5,
    image: "https://images.unsplash.com/photo-1595956936239-4cad0fa009e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwdGVzdGltb25pYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA5NjM5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    review:
      "Gold Wing Adventure exceeded all expectations! Premium service, professional team, and unforgettable memories. Worth every rupee!",
    package: "Premium Ride",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-[#111827] to-[#0B0F19] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#D4AF37] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#E10600] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            What Our Flyers Say
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of happy adventurers who trusted us with their sky dreams
          </p>

          {/* Overall Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 mt-8"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">4.9/5</div>
              <div className="text-white/70 text-sm">Based on 2000+ reviews</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="w-12 h-12 text-[#D4AF37]/30" />
              </div>

              {/* Review Text */}
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
                "{testimonials[currentIndex].review}"
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-white/60 text-sm">
                    {testimonials[currentIndex].location} · {testimonials[currentIndex].package}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all ${index === currentIndex
                      ? "w-8 h-2 bg-[#D4AF37]"
                      : "w-2 h-2 bg-white/30 hover:bg-white/50"
                    } rounded-full`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
