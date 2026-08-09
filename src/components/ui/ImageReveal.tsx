"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/gsapConfig";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  parallax?: boolean;
}

export default function ImageReveal({
  children,
  className,
  direction = "up",
  parallax = false,
}: ImageRevealProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(wrap, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(inner, { scale: 1 });
      return;
    }

    ensureGsapRegistered();

    const clipFrom =
      direction === "up"
        ? "inset(100% 0% 0% 0%)"
        : direction === "left"
        ? "inset(0% 0% 0% 100%)"
        : "inset(0% 100% 0% 0%)";

    // See TextReveal for why elements already in view at mount skip
    // ScrollTrigger and play immediately instead.
    const rect = wrap.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.92;

    const ctx = gsap.context(() => {
      gsap.set(wrap, { clipPath: clipFrom });
      gsap.set(inner, { scale: 1.06 });

      gsap.to(wrap, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: alreadyInView ? undefined : { trigger: wrap, start: "top 88%", once: true },
      });
      gsap.to(inner, {
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: alreadyInView ? undefined : { trigger: wrap, start: "top 88%", once: true },
      });

      if (parallax) {
        gsap.to(inner, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, wrap);

    return () => ctx.revert();
  }, [direction, parallax]);

  return (
    <div ref={wrapRef} className={cn("reveal-mask", className)}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
