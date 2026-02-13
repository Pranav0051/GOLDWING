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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length);
      }, 5000);
    }, 15000);

    // Show first notification after 5 seconds
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 4000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const notification = notifications[currentNotification];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-32 md:bottom-24 left-6 z-40 max-w-sm"
        >
          <div className="bg-[#111827]/95 backdrop-blur-xl border border-[#16A34A]/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#16A34A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-[#16A34A]" />
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">
                  {notification.name} from {notification.location}
                </div>
                <div className="text-white/70 text-xs mt-1">
                  Just booked {notification.package}
                </div>
                <div className="text-white/50 text-xs mt-1">
                  2 minutes ago
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
