import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Challenge } from "@/components/sections/Challenge";
import { LogisticsSection } from "@/components/sections/LogisticsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: { absolute: "SIWOM — Shipment coordination software for logistics in India" },
  description:
    "Shipment coordination software for Indian logistics companies: shipments, vehicles, documents and delays in one shared record. In development; pilots welcome.",
  alternates: { canonical: "/" },
};

/**
 * Homepage narrative: problem → what SIWOM Logistics does (with the demo) → how a
 * pilot works → who it is for → research tracks → how we work → next step.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Challenge />
      <LogisticsSection />
      <HowItWorksSection />
      <IndustriesSection />
      <ResearchSection />
      <HowWeWorkSection />
      <CtaSection />
    </>
  );
}
