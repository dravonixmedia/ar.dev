"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Phone, Send } from "lucide-react";
import { primaryNav } from "@/lib/data/nav";
import { contact } from "@/lib/data/site";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";
import { gsap } from "@/lib/gsapConfig";
import Logo from "./Logo";

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  // The panel starts hidden via CSS already, so there's nothing to animate
  // "closed" until it has actually been opened once. This also sidesteps
  // React StrictMode's dev-only double-invoke of effects: without this
  // guard, a phantom close tween can be scheduled during that double
  // mount and later force display:none right after a real, fast open.
  const hasOpenedOnce = useRef(false);

  useEffect(() => {
    if (!panelRef.current) return;

    if (open) {
      hasOpenedOnce.current = true;
      document.body.style.overflow = "hidden";
      gsap.set(panelRef.current, { display: "flex" });
      gsap.fromTo(
        panelRef.current,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.55, ease: "power4.out" }
      );
      gsap.fromTo(
        linksRef.current,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06, delay: 0.15 }
      );
    } else if (hasOpenedOnce.current) {
      document.body.style.overflow = "";
      gsap.to(panelRef.current, {
        yPercent: -100,
        duration: 0.45,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(panelRef.current, { display: "none" });
        },
      });
    }
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[100] hidden flex-col bg-black text-white"
      style={{ display: "none" }}
      data-cursor-theme="dark"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Logo dark />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-start gap-1 overflow-y-auto px-6 py-6">
        {primaryNav.map((link, i) => (
          <div key={link.href} className="reveal-line shrink-0 border-b border-white/10">
            <Link
              ref={(el) => {
                if (el) linksRef.current[i] = el;
              }}
              href={link.href}
              onClick={onClose}
              className="block py-2.5 text-[clamp(26px,8vw,38px)] leading-[1.05] font-heading font-semibold uppercase tracking-tight text-white transition-colors hover:text-yellow"
            >
              {link.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-6">
        <div className="text-[13px] text-white/60">
          {contact.address.line2}, {contact.address.city}, {contact.address.state}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={buildTelUrl()}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white"
          >
            <Phone className="h-4 w-4 shrink-0" /> Call Now
          </a>
          <a
            href={buildWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-yellow px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-black"
          >
            <Send className="h-4 w-4 shrink-0" /> WhatsApp
          </a>
        </div>
        <Link
          href="/quote"
          onClick={onClose}
          className="flex items-center justify-center rounded-full border border-white/20 px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  );
}
