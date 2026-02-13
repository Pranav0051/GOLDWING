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
        <button
            onClick={toggleTheme}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="transition-transform active:scale-95"
            style={{
                width: "100px",
                height: "40px",
                borderRadius: "40px",
                border: "1px solid rgba(255, 255, 255, 0.349)",
                backgroundColor: "rgb(12, 12, 12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transitionDuration: "0.3s",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    width: isHovered ? "90px" : "30px",
                    height: "30px",
                    background: "linear-gradient(to bottom, rgb(255, 136, 255), rgb(172, 70, 255))",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    zIndex: 2,
                    transitionDuration: "0.3s",
                }}
            >
                {isDark ? (
                    <Moon size={16} color="white" style={{ borderRadius: "1px" }} />
                ) : (
                    <Sun size={16} color="white" style={{ borderRadius: "1px" }} />
                )}
            </div>
            <div
                style={{
                    height: "100%",
                    width: isHovered ? "0" : "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    zIndex: 1,
                    transitionDuration: "0.3s",
                    fontSize: isHovered ? "0" : "1.04em",
                    transform: isHovered ? "translate(10px)" : "translate(0)",
                }}
            >
                {isDark ? "Dark" : "Light"}
            </div>
        </button>
    );
}
