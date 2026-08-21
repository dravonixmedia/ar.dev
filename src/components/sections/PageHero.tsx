import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/ui/Breadcrumbs";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import TextReveal from "@/components/ui/TextReveal";

export default function PageHero({
  crumbs,
  label,
  lines,
  intro,
  children,
}: {
  crumbs: Crumb[];
  label: string;
  lines: ReactNode[];
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-warm pb-16 pt-[calc(84px+3rem)] lg:pb-24 lg:pt-[calc(84px+5rem)]">
      <BreadcrumbSchema items={crumbs} />
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal">
            {label}
          </span>
        </div>
        <TextReveal
          as="h1"
          lines={lines}
          className="mt-6 max-w-4xl font-heading text-[11vw] font-semibold uppercase leading-[0.94] tracking-tight text-black sm:text-[7vw] lg:text-[4.2vw]"
        />
        {intro && (
          <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-charcoal">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}
