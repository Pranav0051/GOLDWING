"use client";

import "./theme.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { BookingPage } from "./pages/BookingPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AgentDashboard } from "./pages/AgentDashboard";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}