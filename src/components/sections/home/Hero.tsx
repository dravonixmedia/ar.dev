"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import HeroGraphic from "@/components/graphics/HeroGraphic";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { useIsFinePointer, usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";
import { mediaConfig } from "@/config/media";

// Hydraulic cylinder + hoses fill the frame edge-to-edge in the foreground;
// the two technicians (the secondary focal point) sit right-of-center in
// the background. Biasing the crop right keeps them in frame once the
// video is cropped narrower than its native 16:9 — which happens on both
// typical laptop viewports (~16:10) and, much more aggressively, on
// portrait mobile.
const HERO_VIDEO_OBJECT_POSITION_DESKTOP = "62% 45%";
const HERO_VIDEO_OBJECT_POSITION_MOBILE = "68% center";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mainLayerRef = useRef<HTMLDivElement | null>(null);
  const midLayerRef = useRef<HTMLDivElement | null>(null);
  const lineLayerRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const scrollFadeRef = useRef<HTMLDivElement | null>(null);
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const showVideo = Boolean(mediaConfig.hero.video) && !reducedMotion;

  // Intro timeline — a single coordinated sequence for every non-line-
  // masked element (the headline/tagline lines animate via TextReveal
  // itself, with trigger={false} so they always play on mount rather than
  // waiting on a scroll position). Nothing here is hidden by default CSS:
  // if this effect never runs (JS error, disabled JS), every element stays
  // at its normal server-rendered visible state — the safe fallback.
  useEffect(() => {
    const eyebrow = eyebrowRef.current;
    const paragraph = paragraphRef.current;
    const cta = ctaRef.current;
    if (!eyebrow || !paragraph || !cta) return;

    if (reducedMotion) {
      gsap.set([eyebrow, paragraph, cta], { opacity: 1, y: 0 });
      return;
    }

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(paragraph, { opacity: 0, y: 20 });
      gsap.set(cta, { opacity: 0, y: 20 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.45 }, 0.15)
        .to(paragraph, { opacity: 1, y: 0, duration: 0.5 }, 0.65)
        .to(cta, { opacity: 1, y: 0, duration: 0.5 }, 0.82);
    });

    return () => ctx.revert();
  }, [reducedMotion]);

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

  // Scroll choreography — the hero should feel like the deepest, most
  // cinematic scroll moment on the page: video scales/drifts, the
  // technical line layer parallaxes at its own (shallower) speed, the
  // text column lifts slightly and only starts fading past the midpoint
  // of the hero's scroll range (never an abrupt disappearance), and a
  // thin dark wash builds under everything as the next section approaches.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.to(mainLayerRef.current, {
        scale: 1.06,
        yPercent: 8,
        xPercent: -2,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(lineLayerRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      if (scrollFadeRef.current) {
        gsap.to(scrollFadeRef.current, {
          opacity: 0.16,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      }

      const FADE_START = 0.58;
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const fadeProgress = p <= FADE_START ? 0 : (p - FADE_START) / (1 - FADE_START);
          gsap.set(textColRef.current, {
            y: -42 * p,
            opacity: 1 - fadeProgress,
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[84px]"
    >
      {/* Full-bleed cinematic background: HeroGraphic paints instantly as
          the fallback (no black flash, no fake poster), the real video
          crossfades in once it can play, and a warm gradient — strongest
          right at the text edge, opening up quickly so the footage reads
          clearly across the center-right — keeps the current black/
          yellow copy readable without washing out the video. */}
      <div className="absolute inset-0 overflow-hidden bg-warm" aria-hidden="true">
        <div
          ref={mainLayerRef}
          className="absolute left-1/2 top-1/2 h-[150%] w-[125%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
            style={{ opacity: showVideo && videoReady ? 0 : 1 }}
            data-hero-layer="poster"
          >
            <div className="aspect-[6/7] h-[70%] max-h-[560px]">
              <HeroGraphic />
            </div>
          </div>
          {showVideo && (
            <video
              className="hero-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              style={
                {
                  opacity: videoReady ? 1 : 0,
                  "--hero-op-mobile": HERO_VIDEO_OBJECT_POSITION_MOBILE,
                  "--hero-op-desktop": HERO_VIDEO_OBJECT_POSITION_DESKTOP,
                } as CSSProperties
              }
              data-hero-layer="video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              aria-hidden="true"
              onCanPlay={() => setVideoReady(true)}
            >
              <source src={mediaConfig.hero.video!} type="video/mp4" />
              {mediaConfig.hero.webm && <source src={mediaConfig.hero.webm} type="video/webm" />}
            </video>
          )}
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-warm from-0% via-warm/40 via-28% to-transparent to-56%"
          data-hero-layer="overlay"
        />
        {/* Independent top scrim so the transparent header stays readable
            regardless of what the video shows in that band. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-warm/70 to-transparent" />
        {/* Builds in on scroll only — a light cinematic transition toward
            the next (dark) section, not a resting-state darkener. */}
        <div ref={scrollFadeRef} className="pointer-events-none absolute inset-0 bg-black opacity-0" />
      </div>

      <div
        ref={lineLayerRef}
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
      >
        <div className="absolute left-[6%] top-[18%] h-px w-[30%] bg-black/10" />
        <div className="absolute right-[8%] top-[30%] h-[40%] w-px bg-black/10" />
        <div className="absolute bottom-[14%] left-[10%] h-px w-[20%] bg-orange/40" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:py-0">
        <div ref={textColRef} className="lg:col-span-7">
          <div
            ref={eyebrowRef}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/60 px-4 py-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal">
              Hydraulics · Sealing · Engineering
            </span>
          </div>

          <TextReveal
            as="h1"
            trigger={false}
            delay={0.25}
            duration={0.68}
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
            trigger={false}
            delay={0.6}
            duration={0.6}
            lines={["From hydraulics to fabrication."]}
            className="mt-5 text-[15px] font-semibold uppercase tracking-[0.14em] text-orange"
          />

          <p ref={paragraphRef} className="mt-7 max-w-xl text-[16px] leading-relaxed text-charcoal">
            AR Hydraulics and Sealing Solutions provides hydraulic repair, mobile hydraulic
            services, sealing solutions, hydraulic testing, component support, precision
            machining, structural fabrication and roofing solutions for industrial and
            heavy-equipment requirements.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/quote" variant="secondary">
              Request a Quote
            </Button>
            <Button href="/services" variant="outline" magnetic={false}>
              Explore Our Solutions
            </Button>
          </div>
        </div>

        {/* Right column is intentionally content-free — the video reads
            directly behind it. Only the floating spec badge remains,
            anchored at roughly its original position over the footage. */}
        <div className="relative hidden lg:col-span-5 lg:block">
          <div
            ref={midLayerRef}
            className="pointer-events-none absolute -left-4 top-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm"
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
