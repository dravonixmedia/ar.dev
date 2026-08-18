"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import { industries } from "@/lib/data/industries";
import { legalDisclaimers } from "@/lib/data/site";
import { mediaConfig, type IndustryMediaKey } from "@/config/media";
import { ensureGsapRegistered, gsap } from "@/lib/gsapConfig";
import { useIsFinePointer, usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";
import { cn } from "@/lib/utils";

// Grouped by the category field already in the data layer — no new
// taxonomy invented, just presented as an interactive stage instead of a
// flat wall of names.
function groupIndustries() {
  const categories = Array.from(new Set(industries.map((i) => i.category)));
  return categories.map((category) => ({
    category,
    items: industries.filter((i) => i.category === category),
  }));
}

const groups = groupIndustries();

// Maps each existing category string to its mediaConfig.industries slot —
// the 5 categories in the data layer line up 1:1 with the 5 media slots.
const CATEGORY_MEDIA_KEY: Record<string, IndustryMediaKey> = {
  "Construction Equipment": "constructionEquipment",
  "Heavy Machinery": "heavyMachinery",
  Mining: "mining",
  "Agricultural Equipment": "agriculturalEquipment",
  Manufacturing: "manufacturing",
};

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const isFinePointer = useIsFinePointer();

  return (
    <section className="bg-black py-24 text-white lg:py-32" data-cursor-theme="dark">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionLabel light>Industries We Serve</SectionLabel>
        <TextReveal
          as="h2"
          lines={["EQUIPMENT ACROSS", "EVERY HEAVY INDUSTRY."]}
          className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight sm:text-[5vw] lg:text-[3vw]"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-7">
            <Link
              href="/industries"
              data-cursor="explore"
              data-cursor-label="Explore"
              className="relative z-10 block"
            >
              <IndustryImageStage active={active} />
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-col">
              {groups.map((group, i) => (
                <button
                  key={group.category}
                  type="button"
                  // Hover-driven activation is desktop-only. On touch/
                  // coarse-pointer devices a lingering compatibility mouse
                  // position can otherwise re-fire as rows above collapse
                  // and shift content underneath it, overriding the tap
                  // that was just made — onClick alone is the source of
                  // truth for touch, matching the "tap changes the active
                  // industry" mobile requirement.
                  onMouseEnter={isFinePointer ? () => setActive(i) : undefined}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  data-cursor="link"
                  className="relative flex items-start gap-4 border-t border-white/10 py-6 text-left last:border-b"
                >
                  {active === i && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px origin-left bg-yellow"
                    />
                  )}
                  <span
                    className={cn(
                      "mt-1 font-heading text-[13px] font-semibold transition-colors duration-300",
                      active === i ? "text-yellow" : "text-white/25"
                    )}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <span
                      className={cn(
                        "block font-heading text-[16px] font-semibold uppercase tracking-tight transition-colors duration-300 sm:text-[19px]",
                        active === i ? "text-white" : "text-white/40"
                      )}
                    >
                      {group.category}
                    </span>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-500 ease-out",
                        active === i ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <p className="flex min-h-0 flex-wrap gap-x-1.5 gap-y-1 text-[13px] leading-relaxed text-white/50">
                        {group.items.map((item, idx) => (
                          <span key={item.name}>
                            {item.name}
                            {idx < group.items.length - 1 ? " ·" : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "mt-2 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300",
                      active === i ? "bg-yellow" : "bg-transparent"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-16 max-w-2xl text-[13px] leading-relaxed text-white/40">
          {legalDisclaimers.manufacturers}
        </p>
      </div>
    </section>
  );
}

// The large 16:9 stage behind the industry rows. Every industry's photo is
// mounted at once, stacked absolutely and preloaded (loading="eager") so
// the very first hover/tap never shows a blank frame — only opacity/scale
// crossfades between layers on `active` change. This sits inside
// ImageReveal purely for the section's one-time entrance clip/scale; the
// crossfade below runs on its own refs and never touches ImageReveal's
// own scroll-triggered tween, so the two never fight each other.
function IndustryImageStage({ active }: { active: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const layers = layerRefs.current;

    if (reducedMotion || isFirstRun.current) {
      layers.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === active ? 1 : 0, scale: 1 });
      });
      isFirstRun.current = false;
      return;
    }

    ensureGsapRegistered();
    const duration = window.matchMedia("(min-width: 768px)").matches ? 0.42 : 0.3;
    layers.forEach((el, i) => {
      if (!el) return;
      if (i === active) {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration, ease: "power2.out" }
        );
      } else {
        gsap.to(el, { opacity: 0, duration, ease: "power2.out" });
      }
    });
  }, [active, reducedMotion]);

  return (
    <ImageReveal className="relative aspect-video w-full overflow-hidden rounded-2xl" direction="up">
      <div className="group/cm relative h-full w-full">
        {groups.map((group, i) => {
          const asset =
            mediaConfig.industries[CATEGORY_MEDIA_KEY[group.category]] ?? mediaConfig.industries.heavyEquipment;
          return (
            <div
              key={group.category}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: i === active ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              {asset.src ? (
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  style={
                    {
                      "--cm-op-mobile": asset.mobileObjectPosition ?? asset.desktopObjectPosition ?? "center",
                      "--cm-op-desktop": asset.desktopObjectPosition ?? "center",
                    } as CSSProperties
                  }
                  className="cm-image object-cover transition-transform duration-700 ease-out group-hover/cm:scale-[1.05]"
                />
              ) : (
                <div className="h-full w-full bg-grey" />
              )}
            </div>
          );
        })}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
        />
      </div>
    </ImageReveal>
  );
}
