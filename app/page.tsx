import type { Metadata } from "next";
import { GlobalNetwork } from "@/components/sections/GlobalNetwork";
import { TechTradeSection } from "@/components/sections/TechTradeSection";
import { Hero } from "@/components/sections/Hero";
import { Principles } from "@/components/sections/Principles";
import { Challenge } from "@/components/sections/Challenge";
import { LogisticsSection } from "@/components/sections/LogisticsSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { BeyondSection } from "@/components/sections/BeyondSection";
import { ArchitectureSection } from "@/components/sections/ArchitectureSection";
import { IndiaSection } from "@/components/sections/IndiaSection";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: { absolute: "SIWOM — Global freight. Local connections." },
  description:
    "SIWOM is building a platform connecting global supply chains across logistics, space, robotics and automotive: international suppliers, Indian manufacturers and buyers, and the logistics partners who move it all. Built from India, safety first.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Principles />
      <GlobalNetwork />
      <TechTradeSection />
      <Challenge />
      <LogisticsSection />
      <SafetySection />
      <IndustriesSection />
      <BeyondSection />
      <ArchitectureSection />
      <IndiaSection />
      <RoadmapSection />
      <CtaSection />
    </>
  );
}
