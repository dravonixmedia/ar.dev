"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsapConfig";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    ensureGsapRegistered();

    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: coarsePointer ? 0.9 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: coarsePointer ? 1.6 : 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
