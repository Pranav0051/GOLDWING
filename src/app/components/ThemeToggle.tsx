"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem("theme") || "dark";
        const isDarkTheme = savedTheme === "dark";
        setIsDark(isDarkTheme);

        if (!isDarkTheme) {
            document.documentElement.classList.add("light-theme");
            document.body.classList.add("light-theme");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");

        if (newTheme) {
            // Switching to dark theme
            document.documentElement.classList.remove("light-theme");
            document.body.classList.remove("light-theme");
        } else {
            // Switching to light theme
            document.documentElement.classList.add("light-theme");
            document.body.classList.add("light-theme");
        }
    };

    return (
        <>
            {/* Mobile: Simple Transparent Icon Button */}
            <div className="md:hidden">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all active:scale-95 hover:bg-white/20"
                    aria-label="Toggle Theme"
                >
                    {isDark ? (
                        <Moon size={20} className="fill-current text-white" />
                    ) : (
                        <Sun size={20} className="fill-current text-yellow-400" />
                    )}
                </button>
            </div>

            {/* Desktop: Animated Pill Switch */}
            <button
                onClick={toggleTheme}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="hidden md:flex items-center justify-center transition-transform active:scale-95 relative overflow-hidden bg-black/50 backdrop-blur-md border border-white/30 rounded-full"
                style={{ width: "100px", height: "40px" }}
            >
                <div
                    className={`absolute left-1 flex items-center justify-center h-[30px] rounded-full bg-gradient-to-b from-[#ff88ff] to-[#ac46ff] z-20 transition-all duration-300 ${isHovered ? "w-[90px]" : "w-[30px]"
                        }`}
                >
                    {isDark ? (
                        <Moon size={16} className="text-white" />
                    ) : (
                        <Sun size={16} className="text-white" />
                    )}
                </div>
                <div
                    className={`flex items-center justify-center h-full text-white z-10 transition-all duration-300 ${isHovered ? "w-0 opacity-0 translate-x-2" : "w-[60px] opacity-100 translate-x-4 ml-auto"
                        }`}
                >
                    <span className="text-[1.04em] font-medium">{isDark ? "Dark" : "Light"}</span>
                </div>
            </button>
        </>
    );
}
