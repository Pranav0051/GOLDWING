"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";

const notifications = [
  { name: "Rahul", location: "Pune", package: "Premium Ride" },
  { name: "Priya", location: "Mumbai", package: "Sunrise Special" },
  { name: "Arjun", location: "Delhi", package: "Basic Ride" },
  { name: "Sneha", location: "Bangalore", package: "Premium Ride" },
  { name: "Vikram", location: "Chennai", package: "Sunrise Special" },
];

export function LiveNotifications() {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!hasScrolled) return;

    // Show first notification briefly 
    setIsVisible(true);
    const hideTimer = setTimeout(() => setIsVisible(false), 3000); // Reduced to 3s

    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Reduced to 3s

      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
      }, 4000);
    }, 20000); // Increased interval to 20s

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [hasScrolled]);

  const notification = notifications[currentNotification];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-24 left-4 right-4 md:top-auto md:left-6 md:right-auto md:bottom-24 z-50 md:max-w-sm pointer-events-none"
        >
          <div
            className="live-notification-toast bg-[#111827]/90 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl flex items-start gap-3 pointer-events-auto"
          >
            <div className="w-10 h-10 bg-[#16A34A]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium text-sm">
                {notification.name} from {notification.location}
              </div>
              <div className="text-white/70 text-xs mt-0.5">
                Just booked {notification.package}
              </div>
              <div className="text-white/40 text-xs mt-0.5">
                2 minutes ago
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
