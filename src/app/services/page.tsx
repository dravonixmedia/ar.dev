import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import { services } from "@/lib/data/services";
import { defaultOgImage } from "@/lib/data/seo";

const title = "Hydraulic, Sealing & Industrial Services | AR Hydraulics";
const description =
  "Hydraulic & fluid power, mobile hydraulic works, sealing, precision machining, structural fabrication and roofing works — from AR Hydraulics, across Kerala.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/services" },
  openGraph: { title, description, images: [defaultOgImage] },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        label="What We Do"
        lines={["HYDRAULICS TO FABRICATION.", "COMPLETE SOLUTIONS."]}
        intro="Six major disciplines, one workshop — hydraulic and fluid power, mobile hydraulic works, sealing solutions, precision machining, structural fabrication and roofing works."
      />

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-cursor="link"
                className="group flex flex-col justify-between gap-8 rounded-2xl border border-border bg-white p-9 transition-colors hover:bg-black"
              >
                <div className="flex items-start justify-between">
                  <span className="font-heading text-[15px] font-semibold text-orange">
                    {service.number}
                  </span>
                  <div className="h-14 w-14 text-black/30 transition-colors group-hover:text-yellow">
                    <ServiceGraphic kind={service.graphic} className="h-full w-full" />
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black transition-colors group-hover:text-white sm:text-[4vw] lg:text-[2vw]">
                    {service.title}
                  </h2>
                  <p className="mt-3 max-w-md text-[14px] leading-relaxed text-charcoal transition-colors group-hover:text-white/60">
                    {service.summary}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-black transition-colors group-hover:text-yellow">
                  Learn More
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
