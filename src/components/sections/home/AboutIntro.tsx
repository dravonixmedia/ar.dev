"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { mediaConfig } from "@/config/media";
import { ensureGsapRegistered, gsap } from "@/lib/gsapConfig";
import { usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";

export default function AboutIntro() {
  const mediaColRef = useRef<HTMLDivElement | null>(null);
  const floatCardRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Floating detail card parallaxes at a different speed than the large
  // workshop image behind it (which has its own, slower internal parallax
  // via CinematicMedia's `parallax` prop) — the speed mismatch is what
  // reads as real depth rather than everything drifting together.
  useEffect(() => {
    const card = floatCardRef.current;
    const col = mediaColRef.current;
    if (!card || !col || reducedMotion) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      gsap.to(card, {
        y: -16,
        ease: "none",
        scrollTrigger: { trigger: col, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, col);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="relative overflow-hidden bg-warm py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div ref={mediaColRef} className="relative lg:col-span-5">
          <CinematicMedia
            asset={mediaConfig.company.workshop}
            placeholderLabel="AR Hydraulics Workshop"
            placeholderIcon="hydraulic"
            frameClassName="rounded-2xl"
            parallax
          />
          {/* Secondary decorative detail crop — intentionally square, not
              16:9, since this is a small floating accent rather than a
              primary media presentation. Reuses the sealing product photo
              (no new photography) as a colourful close-up counterpoint to
              the wide workshop establishing shot beside it. */}
          <div
            ref={floatCardRef}
            className="absolute -bottom-8 -right-4 hidden aspect-square w-36 overflow-hidden rounded-xl border border-border bg-white shadow-[0_20px_50px_-20px_rgba(16,15,13,0.35)] sm:w-40 lg:-right-8 lg:block lg:w-44"
          >
            {mediaConfig.services.sealing.src ? (
              <Image
                src={mediaConfig.services.sealing.src}
                alt="Close detail of hydraulic sealing components"
                fill
                sizes="176px"
                className="object-cover"
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-grey text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                Sealing Detail
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <SectionLabel>About AR Hydraulics</SectionLabel>

          <TextReveal
            as="h2"
            lines={["ONE WORKSHOP.", <span key="line-2">MULTIPLE <span className="text-yellow">CAPABILITIES.</span></span>]}
            className="mt-6 font-heading text-[10vw] font-semibold uppercase leading-[0.96] tracking-tight text-black sm:text-[6vw] lg:text-[3.6vw]"
          />

          <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-charcoal">
            AR Hydraulics and Sealing Solutions provides integrated industrial support covering
            hydraulics, mobile hydraulic works, sealing solutions, precision machining, structural
            fabrication and roofing works. Customers can approach one team for product
            identification, hydraulic repair, component requirements and specialised workshop or
            engineering support.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {["Hydraulics", "Sealing", "Machining", "Fabrication", "Roofing", "Mobile Works"].map(
              (item, i) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="font-heading text-[13px] font-semibold text-blue">
                    0{i + 1}
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-black">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>

          <Link
            href="/about"
            data-cursor="link"
            className="group mt-10 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
          >
            Discover AR Hydraulics
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
