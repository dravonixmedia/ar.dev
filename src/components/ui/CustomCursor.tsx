"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useIsFinePointer, usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";

// Only large-visual targets (images, showcase areas, draggable zones) get
// the big filled/labeled ring. Everything else — nav, buttons, breadcrumbs,
// inline links, form controls — uses the compact outline-only "link" state
// so the word underneath always stays readable.
const LARGE_STATES = new Set(["view", "explore", "drag"]);

const CURSOR_LABELS: Record<string, string> = {
  view: "View",
  explore: "Explore",
  drag: "Drag",
};

const FORM_SELECTOR = "input, textarea, select, [contenteditable='true']";

// Single global cursor controller — one dot + one ring, always moving as one
// coordinated system. Interactive elements only ever change its STATE via
// data-cursor; they never mount cursor visuals of their own.
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  // Set by the effect below to whatever its current resetCursorState
  // closure is — the pathname effect calls through this ref rather than
  // depending on state directly, so a route change never has to re-run
  // (and re-bind all the listeners of) the main effect.
  const resetRef = useRef<() => void>(() => {});
  const isFinePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = isFinePointer && !reducedMotion;
  const pathname = usePathname();

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

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let hasMoved = false;
    let visible = false;
    let isLarge = false;
    let currentSurface = "";
    let rafId = 0;
    // The element currently driving the cursor's label/state. Tracked
    // separately from the native mouseover/mouseout pair because a route
    // change (or any DOM removal) unmounts this element without the
    // browser ever firing a mouseout for it — the pointer hasn't moved,
    // there's just nothing left where it's hovering.
    let activeCursorEl: HTMLElement | null = null;

    // The dot only fades out for the large filled state (view/explore/
    // drag) — the small default and compact link rings keep it, since a
    // thin same-colour outline + tiny dot reads as one cursor either way.
    const syncDotOpacity = () => {
      dot.style.opacity = visible && !isLarge ? "" : "0";
    };

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      ring.style.opacity = next ? "" : "0";
      syncDotOpacity();
    };

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        // First real movement: snap both elements straight to the pointer
        // instead of letting them fly in from an initial default position.
        hasMoved = true;
        dotX = ringX = mouseX;
        dotY = ringY = mouseY;
        setVisible(true);
      }
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => {
      if (hasMoved) setVisible(true);
    };

    const applyState = (state: string, customLabel: string | null) => {
      isLarge = LARGE_STATES.has(state);
      const isCompactLink = Boolean(state) && !isLarge;
      ring.classList.toggle("is-active", isLarge);
      ring.classList.toggle("is-link", isCompactLink);
      label.textContent = isLarge ? customLabel || CURSOR_LABELS[state] || "" : "";
      syncDotOpacity();
    };

    // The single centralized clear: drops the active target, the label,
    // the active/link classes, and forces the surface/theme override to
    // be freshly re-read on the next frame instead of trusting a value
    // computed against the page that just went away. Called on route
    // change (see the pathname effect below) and whenever the currently
    // hovered target is found to have vanished from the DOM.
    const resetCursorState = () => {
      activeCursorEl = null;
      currentSurface = "";
      applyState("", null);
    };
    resetRef.current = resetCursorState;

    const loop = () => {
      if (hasMoved) {
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate3d(-50%, -50%, 0)`;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;

        // Element-level surface override (e.g. a black button needing a
        // yellow ring even on an otherwise light section) wins; ambient
        // section theme is the fallback.
        const el = document.elementFromPoint(mouseX, mouseY);
        const surfaceEl = el?.closest?.("[data-cursor-surface]");
        const themeEl = el?.closest?.("[data-cursor-theme]");
        const surface = surfaceEl
          ? surfaceEl.getAttribute("data-cursor-surface")
          : themeEl?.getAttribute("data-cursor-theme") === "dark"
          ? "dark"
          : "light";
        if (surface !== currentSurface) {
          currentSurface = surface || "light";
          const onDark = currentSurface === "dark";
          ring.classList.toggle("cc-on-dark", onDark);
          dot.classList.toggle("cc-on-dark", onDark);
        }

        // The active target can vanish without ever firing a mouseout —
        // a route change or any conditional unmount just removes it from
        // under a pointer that never moved. Catch that here so the label
        // never survives into a page/state that no longer has it.
        if (activeCursorEl && !document.contains(activeCursorEl)) {
          resetCursorState();
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;

      const formEl = target.closest(FORM_SELECTOR);
      if (formEl) {
        setVisible(false);
        return;
      }

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (!cursorEl) return;
      activeCursorEl = cursorEl;
      applyState(cursorEl.getAttribute("data-cursor") || "", cursorEl.getAttribute("data-cursor-label"));
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if (!target?.closest) return;

      const formEl = target.closest(FORM_SELECTOR);
      if (formEl) {
        const stillOnForm = related?.closest?.(FORM_SELECTOR);
        if (!stillOnForm && hasMoved) setVisible(true);
        return;
      }

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (!cursorEl) return;
      // Ignore the "out" if we moved to a descendant still inside the same
      // data-cursor element — prevents flicker on nested hover targets.
      if (related && cursorEl.contains(related)) return;
      if (activeCursorEl === cursorEl) activeCursorEl = null;
      applyState("", null);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mouseout", handleOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("cursor-active");
    };
  }, [enabled]);

  // Route changes are the main real-world trigger for a vanished target —
  // force the clear immediately here rather than waiting for the next
  // animation frame's DOM-containment check, so a stale VIEW/EXPLORE
  // label from the previous page never has a chance to paint on the new
  // one. This runs for every navigation regardless of which component
  // triggered it — no per-section onClick/onMouseLeave patches needed.
  useEffect(() => {
    resetRef.current();
  }, [pathname]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cc-dot" aria-hidden="true" style={{ opacity: 0 }} />
      <div ref={ringRef} className="cc-ring" aria-hidden="true" style={{ opacity: 0 }}>
        <span ref={labelRef} />
      </div>
    </>
  );
}
