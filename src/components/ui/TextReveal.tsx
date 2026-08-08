"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import { ensureGsapRegistered, gsap } from "@/lib/gsapConfig";

interface TextRevealProps {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  trigger?: boolean;
}

export default function TextReveal({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  delay = 0,
  trigger = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spans = el.querySelectorAll<HTMLElement>("[data-reveal-line-inner]");

    if (reducedMotion) {
      gsap.set(spans, { yPercent: 0, opacity: 1 });
      return;
    }

    ensureGsapRegistered();

    // Elements already within the viewport at mount (e.g. hero copy) can't
    // reliably rely on a ScrollTrigger "top 85%" crossing — it may already
    // be satisfied before the trigger's position is measured. Play those
    // immediately instead of waiting on a scroll trigger.
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.9;

    const ctx = gsap.context(() => {
      gsap.set(spans, { yPercent: 110, opacity: 0 });
      gsap.to(spans, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay,
        scrollTrigger:
          trigger && !alreadyInView
            ? {
                trigger: el,
                start: "top 85%",
                once: true,
              }
            : undefined,
      });
    }, el);

    return () => ctx.revert();
  }, [delay, trigger]);

  const Component = Tag as ElementType;

  return (
    <Component ref={containerRef} className={className}>
      {lines.map((line, i) => (
        <span className={`reveal-line ${lineClassName ?? ""}`} key={i}>
          <span data-reveal-line-inner className="inline-block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}
