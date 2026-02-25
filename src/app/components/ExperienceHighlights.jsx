"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Mountain, Clock, Shield, Users } from "lucide-react";
const stats = [
    { icon: Mountain, value: 1000, suffix: " ft", label: "Height" },
    { icon: Clock, value: 15, suffix: " Min", label: "Flight Duration" },
    { icon: Shield, value: 100, suffix: "%", label: "Safety Record" },
    { icon: Users, value: 2000, suffix: "+", label: "Happy Flyers" },
];
export function ExperienceHighlights() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold: 0.3 });
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);
    return (<section id="experiences" ref={sectionRef} className="py-20 md:py-32 bg-gradient-to-b from-[#0B0F19] to-[#111827] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full blur-[100px]"/>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#E10600] rounded-full blur-[120px]"/>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Experience The Thrill
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Soar above the clouds with our premium paramotor experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.8 }} whileHover={{ y: -10, scale: 1.05 }} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#D4AF37]/50 transition-all duration-300">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-transparent transition-all duration-300"/>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#D4AF37] to-[#F7C948] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-[#0B0F19]"/>
                </div>
                
                {isVisible ? (<CountUp end={stat.value} suffix={stat.suffix} duration={2}/>) : (<div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    0{stat.suffix}
                  </div>)}
                
                <p className="text-white/70 text-sm md:text-base">{stat.label}</p>
              </div>
            </motion.div>))}
        </div>
      </div>
    </section>);
}
function CountUp({ end, suffix, duration }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime;
        let animationFrame;
        const animate = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);
            if (progress < 1) {
                setCount(Math.floor(end * progress));
                animationFrame = requestAnimationFrame(animate);
            }
            else {
                setCount(end);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    return (<div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>);
}
