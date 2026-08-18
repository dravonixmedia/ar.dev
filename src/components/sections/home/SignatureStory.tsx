"use client";

import { useEffect, useRef, useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { mediaConfig, type ServiceMediaKey, type MediaAsset } from "@/config/media";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { cn } from "@/lib/utils";

interface ProcessStep {
  number: string;
  title: string;
  copy: string;
  mediaKey: ServiceMediaKey | "workshop";
}

// A workflow, not a sixth restatement of the service list already covered
// in What We Do — four stages every job actually moves through, each
// mapped to whichever existing photo illustrates it most honestly.
const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Inspect & Diagnose",
    copy: "Understand the equipment, component, dimensions, symptoms or on-site requirement.",
    mediaKey: "mobile",
  },
  {
    number: "02",
    title: "Identify & Plan",
    copy: "Determine the appropriate repair, seal, replacement component, machining or fabrication approach.",
    mediaKey: "sealing",
  },
  {
    number: "03",
    title: "Repair / Build",
    copy: "Carry out the required workshop, machining, hydraulic, sealing, fabrication or on-site work.",
    mediaKey: "machining",
  },
  {
    number: "04",
    title: "Verify & Handover",
    copy: "Complete final checks and prepare the equipment, component or completed work for return to service.",
    mediaKey: "workshop",
  },
];

function getStepAsset(step: ProcessStep): MediaAsset {
  if (step.mediaKey === "workshop") return mediaConfig.company.workshop;
  return mediaConfig.services[step.mediaKey];
}

export default function SignatureStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // Desktop only: pinned scroll story driving the active stage. Mobile
  // gets a simple stacked flow below with no pin and no scroll-scrub —
  // gsap.matchMedia keeps the ScrollTrigger from ever being created
  // outside the desktop breakpoint, rather than just hiding its effects.
  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=340%",
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress;
            line.style.transform = `scaleX(${progress})`;
            const index = Math.min(
              processSteps.length - 1,
              Math.floor(progress * processSteps.length)
            );
            setActive(index);
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  const activeStep = processSteps[active];

  return (
    <section ref={sectionRef} className="relative bg-yellow-soft lg:h-[440vh]">
      <div className="flex flex-col justify-center overflow-hidden py-20 lg:sticky lg:top-0 lg:min-h-screen lg:py-16">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10">
          <SectionLabel>How We Work</SectionLabel>
          <TextReveal
            as="h2"
            trigger={false}
            lines={["FROM PROBLEM TO", "PERFORMANCE."]}
            className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
          />

          {/* Desktop: pinned interactive scroll story */}
          <div className="mt-14 hidden lg:block">
            <div className="grid grid-cols-12 items-center gap-10">
              <div className="col-span-7">
                <CinematicMedia
                  key={activeStep.number}
                  asset={getStepAsset(activeStep)}
                  placeholderLabel={activeStep.title}
                  frameClassName="rounded-2xl"
                />
              </div>
              <div className="col-span-5 flex flex-col justify-center">
                <span className="font-heading text-[6vw] font-extrabold leading-none text-black/10">
                  {activeStep.number}
                </span>
                <h3 className="mt-2 font-heading text-[2.1vw] font-semibold uppercase leading-tight text-black">
                  {activeStep.title}
                </h3>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-charcoal">
                  {activeStep.copy}
                </p>
              </div>
            </div>

            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-[26px] h-px bg-black/10" />
              <div
                ref={lineRef}
                className="absolute left-0 right-0 top-[26px] h-px origin-left scale-x-0 bg-orange"
              />
              <div className="grid grid-cols-4 gap-6">
                {processSteps.map((step, i) => (
                  <div key={step.number} className="flex flex-col items-start gap-4">
                    <span
                      className={cn(
                        "h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300",
                        i <= active ? "border-orange bg-orange" : "border-black/20 bg-warm"
                      )}
                    />
                    <span
                      className={cn(
                        "font-heading text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-300",
                        i <= active ? "text-black" : "text-black/35"
                      )}
                    >
                      {step.number} — {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile / tablet: simple stacked flow, no pin, no scroll-scrub —
              each step reveals with the standard lighter mount animation. */}
          <div className="mt-12 flex flex-col gap-12 lg:hidden">
            {processSteps.map((step) => (
              <div key={step.number}>
                <CinematicMedia
                  asset={getStepAsset(step)}
                  placeholderLabel={step.title}
                  frameClassName="rounded-2xl"
                />
                <div className="mt-5 flex items-start gap-4">
                  <span className="font-heading text-[13px] font-semibold text-orange">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-heading text-[20px] font-semibold uppercase leading-tight text-black">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-charcoal">{step.copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
