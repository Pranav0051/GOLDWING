"use client";

import "./theme.css";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ExperienceHighlights } from "./components/ExperienceHighlights";
import { PricingCards } from "./components/PricingCards";
import { FlightTimeline } from "./components/FlightTimeline";
import { SafetySection } from "./components/SafetySection";
import { ThingsToCarry } from "./components/ThingsToCarry";
import { FAQ } from "./components/FAQ";
import { Testimonials } from "./components/Testimonials";
import { FutureAdventures } from "./components/FutureAdventures";
import { BookingModal } from "./components/BookingModal";
import { FloatingCTA } from "./components/FloatingCTA";
import { Footer } from "./components/Footer";
import { LiveNotifications } from "./components/LiveNotifications";
import { PageLoader } from "./components/PageLoader";

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>();

  const handleBookClick = (packageId?: string) => {
    setSelectedPackage(packageId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] overflow-x-hidden">
      {/* Page Loader */}
      <PageLoader />

      {/* Navbar */}
      <Navbar onBookClick={() => handleBookClick()} />

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

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedPackage(undefined);
        }}
        selectedPackageId={selectedPackage}
      />
    </div>
  );
}