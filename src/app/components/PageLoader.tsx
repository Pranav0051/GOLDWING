"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#0B0F19] flex items-center justify-center"
        >
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center justify-center"
            >
              <motion.img
                src="/goldwing-logo.png"
                alt="Goldwing Adventure Tour"
                className="w-full max-w-md h-auto object-contain px-4"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                }}
              />
            </motion.div>

            {/* Loading Bar */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7C948]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 mt-6 text-sm"
            >
              Preparing your adventure...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
