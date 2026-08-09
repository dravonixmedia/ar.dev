"use client";

import { useState } from "react";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { industries } from "@/lib/data/industries";
import { legalDisclaimers } from "@/lib/data/site";
import { mediaConfig } from "@/config/media";
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

export default function IndustriesSection() {
  const [active, setActive] = useState(0);

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
              <CinematicMedia
                asset={mediaConfig.industries.heavyEquipment}
                placeholderLabel="Heavy Equipment"
                frameClassName="rounded-2xl"
                overlay="soft"
                parallax
                hoverScale
              />
            </Link>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 -left-2 select-none font-heading text-[9rem] font-extrabold leading-none text-white/[0.05] transition-all duration-500 lg:text-[12rem]"
            >
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-col">
              {groups.map((group, i) => (
                <button
                  key={group.category}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
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
