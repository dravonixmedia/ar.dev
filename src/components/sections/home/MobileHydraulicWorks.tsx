import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import Button from "@/components/ui/Button";
import { getServiceBySlug } from "@/lib/data/services";
import { legalDisclaimers } from "@/lib/data/site";

export default function MobileHydraulicWorks() {
  const service = getServiceBySlug("mobile-hydraulic-works")!;

  return (
    <section id="mobile-hydraulic-works" className="bg-black py-24 text-white lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionLabel light>{service.number} — Mobile Hydraulic Works</SectionLabel>
            <TextReveal
              as="h2"
              lines={["ON-SITE SUPPORT", <span key="line-2">WHERE THE <span className="text-yellow">WORK</span> HAPPENS.</span>]}
              className="mt-6 font-heading text-[9vw] font-semibold uppercase leading-[0.96] tracking-tight sm:text-[5.5vw] lg:text-[3vw]"
            />
            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-white/70">
              {service.description}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {service.items.map((item) => (
                <span key={item} className="flex items-center gap-2 text-[13px] text-white/70">
                  <span className="h-1 w-1 rounded-full bg-yellow" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/quote" variant="secondary">
                Request Mobile Hydraulic Support
              </Button>
              <Button href="tel:+918129741233" variant="outlineLight" magnetic={false}>
                Call for Service
              </Button>
            </div>

            <p className="mt-6 max-w-lg text-[12px] leading-relaxed text-white/40">
              {legalDisclaimers.mobileService}
            </p>
          </div>

          <div className="lg:col-span-6">
            <ImageReveal className="aspect-[4/3] w-full rounded-2xl bg-white/5" direction="right">
              <div className="flex h-full w-full items-center justify-center p-14 text-yellow">
                <ServiceGraphic kind="mobile" className="h-full w-full" />
              </div>
            </ImageReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
