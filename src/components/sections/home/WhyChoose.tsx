"use client";

import { useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { whyChooseItems } from "@/lib/data/why-choose";
import { mediaConfig } from "@/config/media";
import { cn } from "@/lib/utils";

export default function WhyChoose() {
  const [active, setActive] = useState(0);
  const activeItem = whyChooseItems[active];

  return (
    <section className="bg-warm py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionLabel>Why Choose AR</SectionLabel>
        <TextReveal
          as="h2"
          lines={["ONE WORKSHOP.", "COMPLETE SUPPORT."]}
          className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col lg:col-span-5">
            {whyChooseItems.map((item, i) => (
              <button
                key={item.key}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                data-cursor="link"
                className={cn(
                  "flex items-center justify-between gap-4 border-t border-border py-5 text-left transition-colors last:border-b",
                  active === i && "text-orange"
                )}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-heading text-[13px] font-semibold transition-colors",
                      active === i ? "text-orange" : "text-charcoal/30"
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[16px] font-semibold uppercase tracking-[0.02em] transition-colors sm:text-[19px]",
                      active === i ? "text-black" : "text-charcoal/50"
                    )}
                  >
                    {item.label}
                  </span>
                </span>
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full transition-colors",
                    active === i ? "bg-orange" : "bg-transparent"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-white">
              {/* Decorative context image — same shot for every item since
                  these are business-wide differentiators, not per-service
                  claims, so there's no honest 1:1 image to swap in.
                  Default cursor only: nothing here is a click target. */}
              <CinematicMedia
                asset={mediaConfig.company.workshop}
                placeholderLabel="AR Hydraulics Workshop"
                placeholderIcon="hydraulic"
                frameClassName="rounded-none"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-4 select-none font-heading text-[15vw] font-extrabold leading-none text-black/[0.06] sm:text-[8vw] lg:text-[6vw]"
              >
                0{active + 1}
              </span>
              <div className="relative flex flex-col justify-center p-8 lg:p-10">
                <h3 className="font-heading text-[24px] font-semibold uppercase leading-tight text-black">
                  {activeItem.headline}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-charcoal">
                  {activeItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
