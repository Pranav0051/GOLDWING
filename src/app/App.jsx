import React, { Suspense } from "react";
import "./theme.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { PageLoader } from "./components/PageLoader";
// Lazy Load All Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const AdventureSelector = React.lazy(() => import("./pages/AdventureSelector").then(m => ({ default: m.AdventureSelector })));
const BookingPage = React.lazy(() => import("./pages/BookingPage").then(m => ({ default: m.BookingPage })));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AgentDashboard = React.lazy(() => import("./pages/AgentDashboard").then(m => ({ default: m.AgentDashboard })));
const LoginPage = React.lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const ScannerPage = React.lazy(() => import("./pages/ScannerPage").then(m => ({ default: m.ScannerPage })));
const StaffDashboard = React.lazy(() => import("./pages/StaffDashboard").then(m => ({ default: m.StaffDashboard })));

export default function App() {
  return (<BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<AdventureSelector />} />
        <Route path="/explore" element={<LandingPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/gate" element={<ScannerPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>);
}
