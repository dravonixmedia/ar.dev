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
// the content card is specified against. Desktop and mobile call for
// slightly different opacities (0.78 vs 0.84) but a single inline value
// can't switch per breakpoint — 0.80 sits close to both and keeps a lot
// of video visible through the card either way.
const PANEL_BG = "rgba(255,253,247,0.80)";

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
  // Gates when the <video> element (and its real source URLs) is even
  // inserted into the DOM — not just its opacity. False on the static-
  // exported HTML and on first client render (same safe pattern as
  // reducedMotion/isFinePointer above), so the multi-megabyte video never
  // appears in markup the browser's preload scanner can discover until
  // this effect below explicitly decides it's safe to attach it. The
  // poster <img> is unconditional and always renders immediately either way.
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const showVideo = Boolean(mediaConfig.hero.video) && !reducedMotion;

  useEffect(() => {
    if (!showVideo) return;

    type NetworkInformation = { saveData?: boolean; effectiveType?: string };
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    // Save-Data and a reported slow connection both mean: stay on the
    // poster, never fetch the video at all. Feature-detected — Safari and
    // Firefox simply don't have `navigator.connection`, and that's fine.
    if (connection?.saveData) return;
    if (connection?.effectiveType && ["slow-2g", "2g"].includes(connection.effectiveType)) return;

    let cancelled = false;
    let started = false;
    const start = () => {
      if (cancelled || started) return;
      started = true;
      setCanLoadVideo(true);
    };

    // Desktop keeps the existing near-immediate premium autoplay feel —
    // this still only runs after the current frame has committed/painted
    // (a normal effect, not blocking first paint), same as every other
    // effect in this component.
    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobileViewport) {
      start();
      return () => {
        cancelled = true;
      };
    }

    // Mobile: measured directly (real mobile-emulated trace, throttled
    // network + CPU, no synthetic scroll/touch/pointer events dispatched)
    // against this exact build — a fixed post-load fallback timer, even at
    // 9s, still reliably fires inside a heavily-throttled mobile Lighthouse
    // trace window, downloading the full video and accounting for the bulk
    // of the reported network payload. Any fixed delay is fragile against
    // trace duration, which isn't a stable target. So mobile now loads the
    // video ONLY on a genuine post-load interaction — scroll, touch, or
    // pointer — never on a timer. Confirmed none of these three events
    // fire spontaneously during an automated/lab page load. A visitor who
    // opens the hero and never scrolls or touches stays on the poster,
    // which is a real frame from the video itself, not a placeholder.
    const cleanupFns: Array<() => void> = [];
    const armPostLoadTriggers = () => {
      if (cancelled || started) return;

      const interactionEvents: Array<"scroll" | "touchstart" | "pointerdown"> = [
        "scroll",
        "touchstart",
        "pointerdown",
      ];
      const onInteraction = () => start();
      interactionEvents.forEach((evt) => {
        window.addEventListener(evt, onInteraction, { once: true, passive: true });
      });
      cleanupFns.push(() => {
        interactionEvents.forEach((evt) => window.removeEventListener(evt, onInteraction));
      });
    };

    if (document.readyState === "complete") {
      armPostLoadTriggers();
    } else {
      const onWindowLoad = () => armPostLoadTriggers();
      window.addEventListener("load", onWindowLoad, { once: true });
      cleanupFns.push(() => window.removeEventListener("load", onWindowLoad));
    }

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, [showVideo]);

  // Intro timeline — the panel and its contents (eyebrow, headline,
  // supporting line, paragraph, CTAs) settle into place via movement only,
  // never opacity: every one of these elements is already opacity:1 in the
  // server-rendered/static HTML (nothing here sets an initial opacity via
  // className or inline style), so they must stay visibly painted through
  // hydration and this effect too — a transform-only offset lets the
  // premium "settle into place" feel survive without ever making the hero
  // paragraph (the page's LCP element) or its panel ancestor invisible
  // while JS/GSAP loads. Headline/tagline animate via TextReveal itself
  // (trigger={false} so they always play on mount, never waiting on a
  // scroll position the hero — being the first section — would never
  // naturally receive). If this effect never runs (JS error, disabled JS),
  // every element stays at its normal server-rendered visible position —
  // the safe fallback.
  useEffect(() => {
    const panel = panelRef.current;
    const eyebrow = eyebrowRef.current;
    const paragraph = paragraphRef.current;
    const cta = ctaRef.current;
    if (!panel || !eyebrow || !paragraph || !cta) return;

    if (reducedMotion) {
      gsap.set([panel, eyebrow, paragraph, cta], { x: 0, y: 0 });
      return;
    }

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.set(panel, { x: -20 });
      gsap.set(eyebrow, { y: 12 });
      gsap.set(paragraph, { y: 16 });
      gsap.set(cta, { y: 16 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(panel, { x: 0, duration: 0.7 }, 0)
        .to(eyebrow, { y: 0, duration: 0.4 }, 0.1)
        .to(paragraph, { y: 0, duration: 0.45 }, 0.55)
        .to(cta, { y: 0, duration: 0.4 }, 0.68);
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
          gsap.to(panelRef.current, { y: -8, ease: "none", scrollTrigger: scrub });
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
          from the hero video itself — paints instantly on first render and
          stays mounted permanently underneath the video, at opacity 1,
          for the section's entire lifetime. It is never faded out or
          removed — the video is the thing that fades IN over it (once a
          real decoded frame exists, see onLoadedData below), so there is
          no state in which neither layer has visible content and no way
          for the browser's own pre-decode rendering to show through as a
          black flash. Because poster and video are literally the same
          footage at the same crop, the handoff reads as one continuous
          shot rather than a swap. No gradient sits over the footage
          anywhere — readability comes from the small translucent content
          card below, which the video otherwise dominates around and
          behind. */}
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
              className="hero-media absolute inset-0 h-full w-full object-cover"
              data-hero-layer="poster"
              fetchPriority="high"
              decoding="async"
            />
          )}
          {showVideo && canLoadVideo && (
            <video
              className="hero-media absolute inset-0 h-full w-full object-cover bg-transparent transition-opacity duration-[400ms]"
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
              // loadeddata (not canplay) — it specifically guarantees the
              // first frame has actually decoded and is paintable, which is
              // exactly the condition needed before crossfading over the
              // poster. canplay only promises enough is buffered to play
              // through without stalling; it can fire without a frame yet
              // composited, which is what let a black paint show through
              // during the opacity handoff.
              onLoadedData={() => setVideoReady(true)}
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

      {/* Compact editorial content card — wraps only its own content, never
          a full-height/full-width slab. Mobile: floats near the lower
          area, video fully visible above and around it. Desktop: a small
          card inset from the top-left, video dominating the remaining
          ~75-80% of the frame around it — an overlay on the film, not a
          second column beside it. */}
      <div
        ref={panelRef}
        className="relative z-10 mx-4 mb-6 w-[calc(100%-2rem)] rounded-[16px] border border-white/45 p-[24px] shadow-[0_20px_50px_-28px_rgba(16,15,13,0.28)] will-change-transform lg:absolute lg:left-[5vw] lg:top-[20vh] lg:mx-0 lg:mb-0 lg:w-[560px] lg:rounded-[20px] lg:p-[38px] xl:w-[600px]"
        style={{
          background: PANEL_BG,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div ref={eyebrowRef} className="mb-4 flex items-center gap-2.5 lg:mb-5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal lg:text-[11px]">
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
          className="font-heading text-[clamp(42px,10vw,52px)] font-bold uppercase leading-[0.92] tracking-[-0.045em] text-black lg:text-[clamp(58px,5vw,78px)]"
        />

        <TextReveal
          as="p"
          trigger={false}
          delay={0.5}
          duration={0.45}
          lines={["From hydraulics to fabrication."]}
          className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-blue lg:text-[14px]"
        />

        <p
          ref={paragraphRef}
          className="mt-5 max-w-[520px] text-[16px] font-normal leading-[1.55] text-charcoal lg:text-[17px]"
        >
          AR Hydraulics and Sealing Solutions provides hydraulic repair, mobile hydraulic
          services, sealing solutions, hydraulic testing, component support, precision
          machining, structural fabrication and roofing solutions for industrial and
          heavy-equipment requirements across Kerala.
        </p>

        <div ref={ctaRef} className="mt-7 flex flex-wrap items-center gap-3 lg:gap-4">
          {/* Both CTAs sit in the hero's initial viewport on every load, so
              Next's default viewport-triggered prefetch fires immediately —
              downloading the full target page + its RSC payload before the
              visitor has done anything. Disabling it only removes that
              head-start; a click still navigates normally. */}
          <Button href="/quote" variant="secondary" prefetch={false}>
            Request a Quote
          </Button>
          <Button href="/services" variant="outline" magnetic={false} prefetch={false}>
            Explore Our Solutions
          </Button>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-8 right-8 z-10 hidden lg:block">
        <ScrollIndicator />
      </div>
    </section>
  );
}
