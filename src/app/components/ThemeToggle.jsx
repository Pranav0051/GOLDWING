import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import AnimatedToggle from "./ui/AnimatedToggle";
export function ThemeToggle({ className }) {
    const [isDark, setIsDark] = useState(true);
    useEffect(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem("theme") || "dark";
        const isDarkTheme = savedTheme === "dark";
        setIsDark(isDarkTheme);
        if (!isDarkTheme) {
            document.documentElement.classList.add("light-theme");
            document.body.classList.add("light-theme");
            document.documentElement.classList.remove("dark");
        }
        else {
            document.documentElement.classList.remove("light-theme");
            document.body.classList.remove("light-theme");
            document.documentElement.classList.add("dark");
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
            document.documentElement.classList.add("dark");
        }
        else {
            // Switching to light theme
            document.documentElement.classList.add("light-theme");
            document.body.classList.add("light-theme");
            document.documentElement.classList.remove("dark");
        }
    };
    return (<AnimatedToggle checked={isDark} onChange={toggleTheme} variant="icon" icons={{
            on: <Moon className="w-5 h-5 text-amber-500 fill-amber-500"/>,
            off: <Sun className="w-5 h-5 text-amber-500 fill-amber-500"/>
        }} size="lg" className={className}/>);
}
