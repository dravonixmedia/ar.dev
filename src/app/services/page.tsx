import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import { services } from "@/lib/data/services";
import { faqs } from "@/lib/data/faqs";
import { defaultOgImage } from "@/lib/data/seo";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
                className="group flex flex-col justify-between gap-8 rounded-2xl border border-border bg-white p-9 transition-colors hover:bg-olive-deep"
              >
                <div className="flex items-start justify-between">
                  <span className="font-heading text-[15px] font-semibold text-blue">
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

      <section className="bg-grey py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal">
            Common Questions
          </span>
          <h2 className="mt-4 max-w-2xl font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[4vw] lg:text-[2.2vw]">
            Hydraulic Repair — Frequently Asked
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-10 border-t border-border lg:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-border py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-black">
                  {faq.question}
                  <span className="mt-0.5 shrink-0 text-[13px] text-charcoal/50 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-charcoal">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
