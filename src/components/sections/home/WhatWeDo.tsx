"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { services } from "@/lib/data/services";
import { mediaConfig, type ServiceMediaKey } from "@/config/media";
import { cn } from "@/lib/utils";

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const activeService = services[active];

  return (
    <section className="bg-black py-24 text-white lg:py-32" data-cursor-theme="dark">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel light>What We Do</SectionLabel>
            <TextReveal
              as="h2"
              lines={["HYDRAULICS TO FABRICATION.", "COMPLETE INDUSTRIAL SOLUTIONS."]}
              className="mt-6 max-w-3xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight sm:text-[5vw] lg:text-[3vw]"
            />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-cursor="link"
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "group flex items-center justify-between gap-6 border-t border-white/10 py-7 transition-colors last:border-b",
                  active === i && "bg-white/[0.03]"
                )}
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <span
                    className={cn(
                      "font-heading text-[15px] font-semibold transition-colors",
                      active === i ? "text-yellow" : "text-white/30"
                    )}
                  >
                    {service.number}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-[6vw] font-semibold uppercase leading-none tracking-tight transition-colors sm:text-[3.4vw] lg:text-[2.1vw]",
                      active === i ? "text-white" : "text-white/50"
                    )}
                  >
                    {service.shortTitle}
                  </span>
                </div>
                <ArrowUpRight
                  className={cn(
                    "h-6 w-6 shrink-0 transition-all duration-300",
                    active === i ? "translate-x-0 translate-y-0 text-yellow opacity-100" : "-translate-x-2 translate-y-2 text-white/30 opacity-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <Link href={`/services/${activeService.slug}`} data-cursor="explore" data-cursor-label="Explore" className="block">
                <CinematicMedia
                  key={activeService.slug}
                  asset={mediaConfig.services[activeService.graphic as ServiceMediaKey]}
                  placeholderLabel={activeService.shortTitle}
                  placeholderIcon={activeService.graphic}
                  frameClassName="rounded-xl"
                />
              </Link>
              <p className="mt-6 text-[14px] leading-relaxed text-white/60">
                {activeService.summary}
              </p>
              <Link
                href={`/services/${activeService.slug}`}
                data-cursor="link"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-yellow"
              >
                Explore Service <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
