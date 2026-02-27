"use client";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { ExperienceHighlights } from "../components/ExperienceHighlights";
import { PricingCards } from "../components/PricingCards";
import { FlightTimeline } from "../components/FlightTimeline";
import { SafetySection } from "../components/SafetySection";
import { ThingsToCarry } from "../components/ThingsToCarry";
import { FAQ } from "../components/FAQ";
import { Testimonials } from "../components/Testimonials";
import { FutureAdventures } from "../components/FutureAdventures";
import { FloatingCTA } from "../components/FloatingCTA";
import { Footer } from "../components/Footer";
import { LiveNotifications } from "../components/LiveNotifications";
import { useNavigate } from "react-router";
export function LandingPage() {
    const navigate = useNavigate();
    const handleBookClick = (packageId) => {
        const url = packageId ? `/book?pkg=${packageId}` : "/book";
        navigate(url);
    };
    return (<div className="min-h-[100dvh] bg-[#0B0F19] overflow-x-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero onBookClick={() => handleBookClick()} />

        {/* Experience Highlights */}
        <ExperienceHighlights />

        {/* Pricing Cards */}
        <PricingCards onBookClick={handleBookClick} />

        {/* Flight Timeline */}
        <FlightTimeline />

        {/* Safety Section */}
        <SafetySection />

        {/* Things To Carry */}
        <ThingsToCarry />

        {/* FAQ Section */}
        <FAQ />

        {/* Testimonials */}
        <Testimonials />

        {/* Future Adventures */}
        <FutureAdventures />

        {/* Footer */}
        <Footer />

        {/* Floating CTA */}
        <FloatingCTA onBookClick={() => handleBookClick()} />

        {/* Live Notifications */}
        <LiveNotifications />
    </div>);
}
