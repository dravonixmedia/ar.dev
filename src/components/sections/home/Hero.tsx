"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import HeroGraphic from "@/components/graphics/HeroGraphic";
import { gsap } from "@/lib/gsapConfig";
import { useIsFinePointer, usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";
import { mediaConfig } from "@/config/media";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mainLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const lineLayerRef = useRef<HTMLDivElement | null>(null);
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isFinePointer || reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const mainTo = { x: gsap.quickTo(mainLayerRef.current, "x", { duration: 0.8, ease: "power3.out" }), y: gsap.quickTo(mainLayerRef.current, "y", { duration: 0.8, ease: "power3.out" }) };
    const midTo = { x: gsap.quickTo(midLayerRef.current, "x", { duration: 1, ease: "power3.out" }), y: gsap.quickTo(midLayerRef.current, "y", { duration: 1, ease: "power3.out" }) };
    const lineTo = { x: gsap.quickTo(lineLayerRef.current, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(lineLayerRef.current, "y", { duration: 1.2, ease: "power3.out" }) };

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mainTo.x(relX * 16);
      mainTo.y(relY * 16);
      midTo.x(relX * 30);
      midTo.y(relY * 24);
      lineTo.x(relX * 8);
      lineTo.y(relY * 8);
    };

    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, [isFinePointer, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.to(mainLayerRef.current, {
        yPercent: 12,
        scale: 1.04,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(lineLayerRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[84px]"
    >
      <div
        ref={lineLayerRef}
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      >
        <div className="absolute left-[6%] top-[18%] h-px w-[30%] bg-black/10" />
        <div className="absolute right-[8%] top-[30%] h-[40%] w-px bg-black/10" />
        <div className="absolute bottom-[14%] left-[10%] h-px w-[20%] bg-orange/40" />
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:py-0">
        <div className="lg:col-span-7">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/60 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal">
              Hydraulics · Sealing · Engineering
            </span>
          </div>

          <TextReveal
            as="h1"
            lines={[
              <span key="line-1">
                COMPLETE <span className="text-yellow [-webkit-text-stroke:1.5px_#100F0D]">INDUSTRIAL</span>
              </span>,
              <span key="line-2">SOLUTIONS.</span>,
            ]}
            className="font-heading text-[13vw] font-semibold uppercase leading-[0.94] tracking-tight text-black sm:text-[9vw] lg:text-[5.4vw]"
          />

          <TextReveal
            as="p"
            lines={["From hydraulics to fabrication."]}
            delay={0.3}
            className="mt-5 text-[15px] font-semibold uppercase tracking-[0.14em] text-orange"
          />

          <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-charcoal">
            AR Hydraulics and Sealing Solutions provides hydraulic repair, mobile hydraulic
            services, sealing solutions, hydraulic testing, component support, precision
            machining, structural fabrication and roofing solutions for industrial and
            heavy-equipment requirements.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/quote" variant="secondary">
              Request a Quote
            </Button>
            <Button href="/services" variant="outline" magnetic={false}>
              Explore Our Solutions
            </Button>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          {/* Hero media stage — poster/video/overlay layers are prepared
              here so a future ar-hydraulics-hero-workshop.mp4/.webm +
              poster can be dropped into mediaConfig.hero without touching
              this structure. Until supplied, the approved HeroGraphic
              still-treatment renders as the poster layer. No video tag is
              mounted while mediaConfig.hero.video is null — this task only
              prepares the architecture. */}
          <div
            ref={mainLayerRef}
            className="relative mx-auto aspect-[6/7] w-full max-w-[420px] overflow-hidden will-change-transform"
          >
            <div className="absolute inset-0" data-hero-layer="poster">
              <HeroGraphic />
            </div>
            {mediaConfig.hero.video && (
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
                data-hero-layer="video"
                autoPlay
                muted
                loop
                playsInline
                poster={mediaConfig.hero.poster ?? undefined}
              >
                <source src={mediaConfig.hero.video} type="video/mp4" />
                {mediaConfig.hero.webm && <source src={mediaConfig.hero.webm} type="video/webm" />}
              </video>
            )}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-warm/0"
              data-hero-layer="overlay"
              aria-hidden="true"
            />
          </div>
          <div
            ref={midLayerRef}
            className="pointer-events-none absolute -left-4 top-6 hidden h-24 w-24 items-center justify-center rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm lg:flex"
          >
            <span className="text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.1em] text-charcoal">
              Bore · Rod<br />Stroke
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden lg:block">
        <ScrollIndicator />
      </div>
    </section>
  );
}
