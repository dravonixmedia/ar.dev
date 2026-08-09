"use client";

import { useEffect, useRef, useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { services } from "@/lib/data/services";
import { mediaConfig, type ServiceMediaKey } from "@/config/media";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { cn } from "@/lib/utils";

export default function SignatureStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      // Shorter pin duration on mobile/tablet — same scroll-storytelling
      // character with less scroll distance to avoid feeling trapped.
      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: "(min-width: 1024px)", isCompact: "(max-width: 1023px)" },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: isDesktop ? "+=220%" : "+=130%",
            scrub: 0.6,
            onUpdate: (self) => {
              const progress = self.progress;
              line.style.transform = `scaleX(${progress})`;
              const index = Math.min(
                services.length - 1,
                Math.floor(progress * services.length)
              );
              setActive(index);
            },
          });
          return () => st.kill();
        }
      );
      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  const activeService = services[active];

  return (
    <section ref={sectionRef} className="relative bg-yellow-soft" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel>Signature Process</SectionLabel>
              <TextReveal
                as="h2"
                trigger={false}
                lines={["ENGINEERING IN SEQUENCE."]}
                className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
              />
            </div>
            <div className="w-full lg:max-w-[420px]">
              <CinematicMedia
                key={activeService.slug}
                asset={mediaConfig.services[activeService.graphic as ServiceMediaKey]}
                placeholderLabel={activeService.shortTitle}
                placeholderIcon={activeService.graphic}
                frameClassName="rounded-2xl"
                cursor="explore"
                cursorLabel="Explore"
              />
            </div>
          </div>

          <div className="relative mt-14 lg:mt-16">
            <div className="absolute left-0 right-0 top-[26px] h-px bg-black/10 sm:top-[30px]" />
            <div
              ref={lineRef}
              className="absolute left-0 right-0 top-[26px] h-px origin-left scale-x-0 bg-orange sm:top-[30px]"
            />

            <div className="grid grid-cols-2 gap-y-14 sm:grid-cols-3 lg:grid-cols-6">
              {services.map((service, i) => (
                <div key={service.slug} className="flex flex-col items-start gap-5">
                  <span
                    className={cn(
                      "h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 sm:h-4 sm:w-4",
                      i <= active ? "border-orange bg-orange" : "border-black/20 bg-warm"
                    )}
                  />
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl border transition-colors duration-300",
                      i <= active
                        ? "border-orange/30 bg-white text-orange"
                        : "border-black/10 bg-white/50 text-black/30"
                    )}
                  >
                    <ServiceGraphic kind={service.graphic} className="h-8 w-8" />
                  </div>
                  <span
                    className={cn(
                      "text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
                      i <= active ? "text-black" : "text-black/35"
                    )}
                  >
                    {service.shortTitle}
                  </span>
                  <span
                    className={cn(
                      "text-[12px] leading-snug transition-colors duration-300",
                      i <= active ? "text-charcoal" : "text-black/25"
                    )}
                  >
                    {service.tagline}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
