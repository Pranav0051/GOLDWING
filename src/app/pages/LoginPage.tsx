"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { EyeOff, Eye, ArrowRight, AlertCircle, X } from "lucide-react";

export function LoginPage() {
    const navigate = useNavigate();
    const [loginRole, setLoginRole] = useState<"agent" | "admin">("agent");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const showError = (msg: string) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 4000);
    };

    // Persist login state
    useState(() => {
        const loggedIn = localStorage.getItem("isAdminLoggedIn");
        if (loggedIn === "true") {
            navigate("/admin");
        }
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            showError("Please enter both email and password.");
            return;
        }

        // Simple logic: admin@... goes to admin, anything else goes to agent
        // Or if the toggle is set to admin, it goes to admin
        if (email.includes("admin") || loginRole === "admin") {
            if (password === "admin123" || email.includes("admin")) { // Mock simple check
                localStorage.setItem("isAdminLoggedIn", "true");
                navigate("/admin");
            } else {
                showError("Incorrect password for Admin access.");
            }
        } else {
            navigate("/agent");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#9Bc2d3] to-[#e4a8c9] flex items-center justify-center p-4 lg:p-12 font-sans relative">
            {/* Error Toast */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-8 left-1/2 z-[100] flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-semibold max-w-sm w-[90%]"
                    >
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <span className="flex-1 text-sm">{errorMsg}</span>
                        <button onClick={() => setErrorMsg("")} className="shrink-0 p-1 hover:bg-white/20 rounded-full transition">
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Link to="/?skipLoader=true" className="absolute top-6 left-6 inline-flex items-center text-white/90 font-bold hover:text-white transition drop-shadow-md">
                ← Back to Home
            </Link>

            <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Left Form Section */}
                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white relative">

                    {/* Admin/Agent Toggle via small pills at top right for functionality */}
                    <div className="absolute top-8 right-8 flex gap-2">
                        <button
                            onClick={() => setLoginRole("agent")}
                            className={`px-3 py-1 text-xs rounded-full font-bold transition ${loginRole === "agent" ? 'bg-[#d98cb3] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Agent Login
                        </button>
                        <button
                            onClick={() => setLoginRole("admin")}
                            className={`px-3 py-1 text-xs rounded-full font-bold transition ${loginRole === "admin" ? 'bg-[#d98cb3] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Admin Access
                        </button>
                    </div>

                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-[#d98cb3]">Goldwing</h2>
                    </div>

                    <p className="text-sm text-gray-400 mb-6 font-medium">Welcome back !!!</p>

                    <h1 className="text-5xl font-extrabold text-[#1a1a1a] mb-8 tracking-tight">Log In</h1>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#dae9f2] text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d98cb3]"
                                placeholder="login@gmail.com"
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-gray-500">Password</label>
                                <a href="#" className="text-[10px] text-gray-400 hover:text-[#d98cb3]">Forgot Password ?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#dae9f2] text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d98cb3]"
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d98cb3]/70 hover:text-[#d98cb3]"
                                >
                                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="bg-[#cc7a9c] hover:bg-[#b06181] text-white text-sm font-bold py-3 px-8 rounded-full flex items-center justify-center transition shadow-lg shadow-[#cc7a9c]/30"
                            >
                                LOGIN <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="flex items-center justify-center space-x-2 text-center text-xs text-[#8fb4ce] mb-6">
                            <span className="h-px w-8 bg-[#dae9f2]"></span>
                            <span>or continue with</span>
                            <span className="h-px w-8 bg-[#dae9f2]"></span>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button className="w-12 h-12 rounded-full border border-[#dae9f2] flex items-center justify-center hover:bg-[#dae9f2]/50 transition">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-8">
                            Don't have an account yet? <a href="#" className="text-[#cc7a9c] font-bold">Sign up for free</a>
                        </p>
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="hidden md:block w-1/2 bg-[#c2e0ee] rounded-[30px] p-2 m-4 shadow-inner relative overflow-hidden">
                    <img
                        src="/login-illustration.png"
                        alt="Login Illustration"
                        className="w-full h-full object-cover object-center rounded-[20px]"
                    />
                </div>

            </div>
        </div>
    );
}
