import Hero from "@/components/sections/home/Hero";
import AboutIntro from "@/components/sections/home/AboutIntro";
import WhatWeDo from "@/components/sections/home/WhatWeDo";
import SignatureStory from "@/components/sections/home/SignatureStory";
import ServiceSpotlight from "@/components/sections/home/ServiceSpotlight";
import MobileHydraulicWorks from "@/components/sections/home/MobileHydraulicWorks";
import MobileCTA from "@/components/sections/home/MobileCTA";
import SealingSection from "@/components/sections/home/SealingSection";
import ProductsSection from "@/components/sections/home/ProductsSection";
import IndustriesSection from "@/components/sections/home/IndustriesSection";
import WhyChoose from "@/components/sections/home/WhyChoose";
import Process from "@/components/sections/home/Process";
import ProjectsSection from "@/components/sections/home/ProjectsSection";
import QuoteCTA from "@/components/sections/home/QuoteCTA";
import CompanyStrip from "@/components/sections/home/CompanyStrip";
import ContactTeaser from "@/components/sections/home/ContactTeaser";
import { getServiceBySlug } from "@/lib/data/services";

export default function Home() {
  const hydraulic = getServiceBySlug("hydraulic-fluid-power")!;
  const machining = getServiceBySlug("precision-machining")!;
  const fabrication = getServiceBySlug("structural-fabrication")!;
  const roofing = getServiceBySlug("roofing-works")!;

  return (
    <>
      <Hero />
      <AboutIntro />
      <WhatWeDo />
      <SignatureStory />
      <ServiceSpotlight service={hydraulic} tint="bg-yellow-light" />
      <MobileHydraulicWorks />
      <MobileCTA />
      <SealingSection />
      <ServiceSpotlight service={machining} reverse tint="bg-grey" />
      <ServiceSpotlight service={fabrication} tint="bg-blue-soft" />
      <ServiceSpotlight service={roofing} reverse tint="bg-yellow-light" />
      <ProductsSection />
      <IndustriesSection />
      <WhyChoose />
      <Process />
      <ProjectsSection />
      <QuoteCTA />
      <CompanyStrip />
      <ContactTeaser />
    </>
  );
}
