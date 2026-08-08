"use client";

import { useEffect, useRef } from "react";
import { useIsFinePointer, usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";

const CURSOR_LABELS: Record<string, string> = {
  view: "View",
  explore: "Explore",
  drag: "Drag",
  next: "Next",
  play: "Play",
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = isFinePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("cursor-active");
      return;
    }

    document.documentElement.classList.add("cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!target) return;
      const state = target.getAttribute("data-cursor") || "";
      const customLabel = target.getAttribute("data-cursor-label");
      const text = customLabel || CURSOR_LABELS[state] || "";
      label.textContent = text;
      ring.classList.add("is-active");
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      if (!target) return;
      ring.classList.remove("is-active");
      label.textContent = "";
    };

    const handleDown = () => ring.style.setProperty("transform", ring.style.transform + " scale(0.92)");
    const handleUp = () => {};

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mouseout", handleOut, { passive: true });
    window.addEventListener("mousedown", handleDown, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cc-dot" aria-hidden="true" />
      <div ref={ringRef} className="cc-ring" aria-hidden="true">
        <span ref={labelRef} />
      </div>
    </>
  );
}
