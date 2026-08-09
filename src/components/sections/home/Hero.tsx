"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
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
  const lineLayerRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const scrollFadeRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
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
    const lineTo = { x: gsap.quickTo(lineLayerRef.current, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(lineLayerRef.current, "y", { duration: 1.2, ease: "power3.out" }) };

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mainTo.x(relX * 16);
      mainTo.y(relY * 16);
      lineTo.x(relX * 8);
      lineTo.y(relY * 8);
    };

    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, [isFinePointer, reducedMotion]);

  // Scroll choreography — deliberately understated. The video carries the
  // motion (a slow cinematic push-in, nothing more); the headline stays
  // put through most of the hero and only eases back and softens slightly
  // near the very end, so scrolling never feels like the text is escaping.
  // Desktop and mobile get entirely separate ScrollTrigger instances via
  // gsap.matchMedia — mobile's text stays fully static (no scrub at all)
  // and the video gets a smaller, cheaper scale for smoothness/battery.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const scrub = { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 };

        gsap.to(mainLayerRef.current, {
          scale: 1.035,
          yPercent: 3,
          ease: "none",
          scrollTrigger: scrub,
        });
        gsap.to(lineLayerRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: scrub,
        });
        if (scrollFadeRef.current) {
          gsap.to(scrollFadeRef.current, { opacity: 0.1, ease: "none", scrollTrigger: scrub });
        }
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, { opacity: 0, ease: "none", scrollTrigger: scrub });
        }

        // Subtle object-position drift on the shared ancestor custom
        // property, so poster and video (both reading --hero-op-desktop)
        // stay in lockstep — a slow focal push, not an independent layer.
        const drift = { t: 0 };
        gsap.to(drift, {
          t: 1,
          ease: "none",
          scrollTrigger: scrub,
          onUpdate: () => {
            const x = 62 - 2 * drift.t;
            const y = 45 + 2 * drift.t;
            mainLayerRef.current?.style.setProperty("--hero-op-desktop", `${x}% ${y}%`);
          },
        });

        const TEXT_Y_MAX = 16;
        const FADE_START = 0.72;
        const FADE_FLOOR = 0.88;
        ScrollTrigger.create({
          ...scrub,
          onUpdate: (self) => {
            const p = self.progress;
            const fadeProgress = p <= FADE_START ? 0 : (p - FADE_START) / (1 - FADE_START);
            gsap.set(textColRef.current, {
              y: -TEXT_Y_MAX * p,
              opacity: 1 - fadeProgress * (1 - FADE_FLOOR),
            });
          },
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.to(mainLayerRef.current, {
          scale: 1.02,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-[84px]"
    >
      {/* Full-bleed cinematic background: the poster — a real frame lifted
          from the hero video itself — paints instantly on first render, so
          there is nothing to flash before the video takes over. The video
          crossfades in fast (~300ms) once it can actually play, and because
          poster and video are literally the same footage at the same crop,
          the handoff reads as one continuous shot rather than a swap. No
          gradient sits over the footage — the video is shown naturally,
          full-strength, across the whole hero. */}
      <div className="absolute inset-0 overflow-hidden bg-warm" aria-hidden="true">
        <div
          ref={mainLayerRef}
          className="absolute left-1/2 top-1/2 h-[150%] w-[125%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={
            {
              "--hero-op-mobile": HERO_VIDEO_OBJECT_POSITION_MOBILE,
              "--hero-op-desktop": HERO_VIDEO_OBJECT_POSITION_DESKTOP,
            } as CSSProperties
          }
        >
          {mediaConfig.hero.poster && (
            // eslint-disable-next-line @next/next/no-img-element -- static export + unoptimized images; a plain <img> avoids next/image wrapper overhead for this LCP-critical, always-absolute-fill layer.
            <img
              src={mediaConfig.hero.poster}
              alt=""
              className="hero-media absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              style={{ opacity: showVideo && videoReady ? 0 : 1 }}
              data-hero-layer="poster"
              fetchPriority="high"
              decoding="async"
            />
          )}
          {showVideo && (
            <video
              className="hero-media absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              style={{ opacity: videoReady ? 1 : 0 }}
              data-hero-layer="video"
              poster={mediaConfig.hero.poster ?? undefined}
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
        {/* Independent top scrim so the transparent header stays readable
            regardless of what the video shows in that band. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-warm/70 to-transparent" />
        {/* Builds in on scroll only — a light cinematic transition toward
            the next (dark) section, not a resting-state darkener. */}
        <div ref={scrollFadeRef} className="pointer-events-none absolute inset-0 bg-black opacity-0" />
      </div>

      {/* Minimal technical accents only — thin engineering lines, kept
          deliberately faint (~12%) and near-static so the real footage
          stays the hero, not the vectors. */}
      <div
        ref={lineLayerRef}
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
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
                COMPLETE <span className="text-yellow">INDUSTRIAL</span>
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

          <p
            ref={paragraphRef}
            className="mt-7 max-w-xl text-[16px] font-medium leading-relaxed text-charcoal [text-shadow:0_1px_2px_rgba(250,247,238,0.95),0_0_14px_rgba(250,247,238,0.6)]"
          >
            AR Hydraulics and Sealing Solutions provides hydraulic repair, mobile hydraulic
            services, sealing solutions, hydraulic testing, component support, precision
            machining, structural fabrication and roofing solutions for industrial and
            heavy-equipment requirements.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/quote" variant="secondary">
              Request a Quote
            </Button>
            {/* Small translucent backing (matches the eyebrow pill's own
                bg-white/60 treatment already used above) so the outline
                button's dark text stays readable without a gradient — not
                a new device, just the same local backing pattern already
                established in this hero. */}
            <span className="inline-flex rounded-full bg-white/55 backdrop-blur-sm">
              <Button href="/services" variant="outline" magnetic={false}>
                Explore Our Solutions
              </Button>
            </span>
          </div>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-8 right-8 hidden lg:block">
        <ScrollIndicator />
      </div>
    </section>
  );
}
