import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Challenge } from "@/components/sections/Challenge";
import { LogisticsSection } from "@/components/sections/LogisticsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { FoundationSection } from "@/components/sections/FoundationSection";
import { FocusIndustriesSection } from "@/components/sections/FocusIndustriesSection";
import { HomeRoadmapSection } from "@/components/sections/HomeRoadmapSection";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: { absolute: "SIWOM — Intelligence for the physical world" },
  description:
    "SIWOM builds the intelligence layer for industrial systems, starting with SIWOM Logistics: one shared record of every international shipment, from supplier to delivery.",
  alternates: { canonical: "/" },
};

/**
 * Homepage narrative: hero → 01 current product → 02 the platform (shipment
 * workspace) → 03 how an international shipment moves → 04 technology
 * foundation → 05 focus industries → 06 roadmap → 07 operating principles →
 * 08 next step.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Challenge />
      <LogisticsSection />
      <JourneySection />
      <FoundationSection />
      <FocusIndustriesSection />
      <HomeRoadmapSection />
      <HowWeWorkSection />
      <CtaSection />
    </>
  );
}
