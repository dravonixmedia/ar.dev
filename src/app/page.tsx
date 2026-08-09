import Hero from "@/components/sections/home/Hero";
import AboutIntro from "@/components/sections/home/AboutIntro";
import WhatWeDo from "@/components/sections/home/WhatWeDo";
import SignatureStory from "@/components/sections/home/SignatureStory";
import MobileHydraulicCTA from "@/components/sections/home/MobileHydraulicCTA";
import ProductsSection from "@/components/sections/home/ProductsSection";
import IndustriesSection from "@/components/sections/home/IndustriesSection";
import WhyChoose from "@/components/sections/home/WhyChoose";
import ProjectsSection from "@/components/sections/home/ProjectsSection";
import SealingKollamSection from "@/components/sections/home/SealingKollamSection";
import QuoteCTA from "@/components/sections/home/QuoteCTA";
import ContactTeaser from "@/components/sections/home/ContactTeaser";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <WhatWeDo />
      <SignatureStory />
      <MobileHydraulicCTA />
      <ProductsSection />
      <IndustriesSection />
      <WhyChoose />
      <ProjectsSection />
      <SealingKollamSection />
      <QuoteCTA />
      <ContactTeaser />
    </>
  );
}
