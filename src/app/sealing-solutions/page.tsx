import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import CinematicMedia from "@/components/ui/CinematicMedia";
import Button from "@/components/ui/Button";
import { getServiceBySlug } from "@/lib/data/services";
import { siteInfo } from "@/lib/data/site";
import { mediaConfig } from "@/config/media";

export const metadata: Metadata = {
  title: "Hydraulic Seals in Kollam | Sealing Solutions",
  description:
    "Hydraulic seals in Kollam — O-rings, piston seals, rod seals, wipers, backup rings and custom sealing components from AR Hydraulics and Sealing Solutions.",
  alternates: { canonical: "/sealing-solutions" },
};

export default function SealingSolutionsPage() {
  const service = getServiceBySlug("sealing-solutions")!;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Hydraulic and Industrial Sealing Solutions",
    provider: { "@type": "LocalBusiness", name: siteInfo.name },
    areaServed: "Kollam, Kerala, India",
    description: service.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Sealing Solutions" }]}
        label="Hydraulic Seals in Kollam"
        lines={["HYDRAULIC & INDUSTRIAL", "SEALING SOLUTIONS."]}
        intro="Looking for hydraulic seals in Kollam? AR Hydraulics and Sealing Solutions supports hydraulic, pneumatic and industrial sealing requirements including O-rings, seal kits, piston seals, rod seals, hydraulic wipers, backup rings and specialised sealing components."
      >
        <div className="mt-9 flex flex-wrap gap-4">
          <Button href="/quote" variant="secondary">
            Request a Seal Quote
          </Button>
          <Button href="#part-details" variant="outline" magnetic={false}>
            Share Your Part Details
          </Button>
        </div>
      </PageHero>

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <CinematicMedia
                asset={mediaConfig.services.sealing}
                placeholderLabel="Sealing Solutions"
                placeholderIcon="sealing"
                frameClassName="rounded-2xl"
              />
            </div>
            <div className="lg:col-span-7">
              <SectionLabel>Sealing Product Range</SectionLabel>
              <h2 className="mt-6 max-w-xl font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[4vw] lg:text-[2.2vw]">
                Identification &amp; Sourcing Support
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-charcoal">
                From standard O-rings to custom-profile sealing components, our team supports
                identification and sourcing across the full range below.
              </p>
              <div className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border pt-8 sm:grid-cols-2">
                {service.items.map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-border py-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span className="text-[14px] text-charcoal">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="part-details" className="scroll-mt-24 bg-yellow py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[4vw] lg:text-[2.4vw]">
              Share Your Part Details
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-black/75">
              Share dimensions, samples, equipment details, photographs or part numbers through
              our quote form and we&apos;ll get back with product identification and quotation
              support.
            </p>
            <div className="mt-8">
              <Button href="/quote" variant="primary" magnetic={false}>
                Go to Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
