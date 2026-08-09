"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/ui/TextReveal";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import { ensureGsapRegistered, gsap } from "@/lib/gsapConfig";
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

// The site's --color-warm token (#fffdf7) is the exact rgb(255,253,247)
// the editorial panel is specified against — reused here as an inline
// rgba() so the same one value sits inside both the desktop (0.78-0.88)
// and mobile (0.84-0.9) opacity ranges the spec calls for.
const PANEL_BG = "rgba(255,253,247,0.86)";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mainLayerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const scrollFadeRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const showVideo = Boolean(mediaConfig.hero.video) && !reducedMotion;

  // Intro timeline — the panel itself slides/fades in first, then its
  // contents (eyebrow, headline, supporting line, paragraph, CTAs) settle
  // in a short stagger. Headline/tagline animate via TextReveal itself
  // (trigger={false} so they always play on mount, never waiting on a
  // scroll position the hero — being the first section — would never
  // naturally receive). Nothing here is hidden by default CSS: if this
  // effect never runs (JS error, disabled JS), every element stays at its
  // normal server-rendered visible state — the safe fallback.
  useEffect(() => {
    const panel = panelRef.current;
    const eyebrow = eyebrowRef.current;
    const paragraph = paragraphRef.current;
    const cta = ctaRef.current;
    if (!panel || !eyebrow || !paragraph || !cta) return;

    if (reducedMotion) {
      gsap.set([panel, eyebrow, paragraph, cta], { opacity: 1, x: 0, y: 0 });
      return;
    }

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.set(panel, { opacity: 0, x: -20 });
      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(paragraph, { opacity: 0, y: 16 });
      gsap.set(cta, { opacity: 0, y: 16 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(panel, { opacity: 1, x: 0, duration: 0.7 }, 0)
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.4 }, 0.1)
        .to(paragraph, { opacity: 1, y: 0, duration: 0.45 }, 0.55)
        .to(cta, { opacity: 1, y: 0, duration: 0.4 }, 0.68);
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  // Subtle mouse-follow on the video layer only — a small cinematic drift,
  // not tied to any text element.
  useEffect(() => {
    if (!isFinePointer || reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const mainTo = {
      x: gsap.quickTo(mainLayerRef.current, "x", { duration: 0.8, ease: "power3.out" }),
      y: gsap.quickTo(mainLayerRef.current, "y", { duration: 0.8, ease: "power3.out" }),
    };

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mainTo.x(relX * 16);
      mainTo.y(relY * 16);
    };

    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, [isFinePointer, reducedMotion]);

  // Scroll choreography — deliberately understated, unchanged from the
  // prior pass: the video carries a slow cinematic push-in (scale to
  // 1.035, ~3% vertical drift), the panel only drifts a few px upward
  // (no opacity fade — it must stay readable until the hero exits), and
  // mobile gets its own lighter matchMedia block with no text scroll at
  // all.
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
        if (scrollFadeRef.current) {
          gsap.to(scrollFadeRef.current, { opacity: 0.1, ease: "none", scrollTrigger: scrub });
        }
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, { opacity: 0, ease: "none", scrollTrigger: scrub });
        }
        if (panelRef.current) {
          gsap.to(panelRef.current, { y: -10, ease: "none", scrollTrigger: scrub });
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
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-[84px]"
    >
      {/* Full-bleed cinematic background: the poster — a real frame lifted
          from the hero video itself — paints instantly on first render, so
          there is nothing to flash before the video takes over. The video
          crossfades in fast (~300ms) once it can actually play, and because
          poster and video are literally the same footage at the same crop,
          the handoff reads as one continuous shot rather than a swap. No
          gradient sits over the footage anywhere — readability comes from
          the translucent editorial panel below, not from darkening the
          video. */}
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
        {/* Builds in on scroll only — a light cinematic transition toward
            the next (dark) section, not a resting-state darkener. */}
        <div ref={scrollFadeRef} className="pointer-events-none absolute inset-0 bg-black opacity-0" />
      </div>

      {/* Editorial content surface. Mobile: a compact floating card toward
          the lower-left, video visible above and around it. Desktop: a
          full-height translucent panel from the true left edge — an
          architectural layer the video reads faintly through, not a card
          floating over it. */}
      <div
        ref={panelRef}
        className="relative z-10 mx-4 mb-6 w-[calc(100%-2rem)] rounded-[16px] border border-white/40 shadow-[0_20px_60px_-30px_rgba(16,15,13,0.3)] will-change-transform lg:absolute lg:inset-y-0 lg:left-0 lg:mx-0 lg:mb-0 lg:w-[44%] lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:shadow-none"
        style={{
          background: PANEL_BG,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex h-full flex-col justify-center px-6 py-7 lg:mx-auto lg:max-w-[620px] lg:justify-start lg:px-0 lg:py-0 lg:pb-16 lg:pl-[5.5vw] lg:pr-[4vw] lg:pt-[18vh]">
          <div
            ref={eyebrowRef}
            className="mb-5 flex items-center gap-2.5 lg:mb-6"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal">
              Hydraulics · Sealing · Engineering
            </span>
          </div>

          <TextReveal
            as="h1"
            trigger={false}
            delay={0.2}
            duration={0.55}
            stagger={0.08}
            lines={[
              "COMPLETE",
              <span key="line-2" className="text-yellow">
                INDUSTRIAL
              </span>,
              "SOLUTIONS.",
            ]}
            className="font-heading text-[clamp(46px,11vw,58px)] font-bold uppercase leading-[0.9] tracking-[-0.045em] text-black lg:text-[clamp(64px,6vw,92px)]"
          />

          <TextReveal
            as="p"
            trigger={false}
            delay={0.5}
            duration={0.45}
            lines={["From hydraulics to fabrication."]}
            className="mt-5 text-[15px] font-semibold uppercase tracking-[0.12em] text-orange"
          />

          <p
            ref={paragraphRef}
            className="mt-6 max-w-[560px] text-[17px] font-normal leading-[1.6] text-charcoal lg:text-[18px]"
          >
            AR Hydraulics and Sealing Solutions provides hydraulic repair, mobile hydraulic
            services, sealing solutions, hydraulic testing, component support, precision
            machining, structural fabrication and roofing solutions for industrial and
            heavy-equipment requirements.
          </p>

          <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/quote" variant="secondary">
              Request a Quote
            </Button>
            <Button href="/services" variant="outline" magnetic={false}>
              Explore Our Solutions
            </Button>
          </div>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-8 right-8 z-10 hidden lg:block">
        <ScrollIndicator />
      </div>
    </section>
  );
}
