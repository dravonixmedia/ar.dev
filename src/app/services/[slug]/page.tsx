import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import Button from "@/components/ui/Button";
import { services, getServiceBySlug } from "@/lib/data/services";
import { legalDisclaimers, siteInfo } from "@/lib/data/site";
import { defaultOgImage } from "@/lib/data/seo";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { mediaConfig, type ServiceMediaKey } from "@/config/media";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

// SEO-specific title/description per service, kept separate from the
// shared `services.ts` data (service.title/summary also feed nav, page
// headings etc. and must stay UI-focused, not keyword-focused).
const seoContent: Record<string, { title: string; description: string }> = {
  "hydraulic-fluid-power": {
    title: "Hydraulic Cylinder Repair & Fluid Power | AR Hydraulics",
    description:
      "Hydraulic cylinder, power pack, pump, motor and valve repair, testing and system support for industrial and heavy equipment across Kerala.",
  },
  "mobile-hydraulic-works": {
    title: "Mobile Hydraulic Services | AR Hydraulics Kerala",
    description:
      "On-site hydraulic inspection, fault finding, hose replacement and emergency repair assistance for equipment across Kerala, wherever the work is.",
  },
  "sealing-solutions": {
    title: "Hydraulic Sealing Solutions | AR Hydraulics",
    description:
      "O-rings, piston seals, rod seals, wipers and custom sealing components for hydraulic and industrial applications across Kerala.",
  },
  "precision-machining": {
    title: "Precision Machining & Workshop Services | AR Hydraulics",
    description:
      "Turning, boring, cylinder barrel honing and thread repair for custom shafts, bushes, rods and hydraulic components across Kerala.",
  },
  "structural-fabrication": {
    title: "Structural Fabrication Services | AR Hydraulics",
    description:
      "Industrial welding, structural steel fabrication and custom frameworks, gates and metal structures for sites across Kerala.",
  },
  "roofing-works": {
    title: "Industrial Roofing Works | AR Hydraulics",
    description:
      "Structural roofing fabrication, sheet installation, trusses and supporting steel works for industrial sites across Kerala.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const seo = seoContent[service.slug] ?? { title: service.title, description: service.summary };

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: seo.title, description: seo.description, images: [defaultOgImage] },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: { "@id": `${siteInfo.url}/#organization` },
    areaServed: "Kerala, India",
  };

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <BreadcrumbSchema items={crumbs} />

      <section className="border-b border-border bg-warm pb-16 pt-[calc(84px+3rem)] lg:pb-24 lg:pt-[calc(84px+5rem)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal">
                  {service.number} · {service.title}
                </span>
              </div>
              <TextReveal
                as="h1"
                lines={[service.headline]}
                className="mt-6 font-heading text-[10vw] font-semibold uppercase leading-[0.94] tracking-tight text-black sm:text-[6vw] lg:text-[3.6vw]"
              />
              {service.supportingHeadline && (
                <p className="mt-4 text-[16px] font-semibold uppercase tracking-[0.06em] text-orange">
                  {service.supportingHeadline}
                </p>
              )}
              <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-charcoal">
                {service.description}
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="/quote" variant="secondary">
                  {service.ctaLabel}
                </Button>
                <a
                  href={buildWhatsappUrl(service.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
                </a>
              </div>

              {service.slug === "mobile-hydraulic-works" && (
                <p className="mt-6 max-w-xl text-[12px] leading-relaxed text-charcoal/60">
                  {legalDisclaimers.mobileService}
                </p>
              )}
            </div>

            <div className="lg:col-span-5">
              <CinematicMedia
                asset={mediaConfig.services[service.graphic as ServiceMediaKey]}
                placeholderLabel={service.title}
                placeholderIcon={service.graphic}
                frameClassName="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal">
            What&apos;s Included
          </span>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.items.map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-border py-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span className="text-[14px] text-charcoal">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-grey py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-charcoal">
            Other Services
          </span>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-cursor="link"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6"
              >
                <span className="text-[15px] font-semibold uppercase tracking-tight text-black">
                  {s.title}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
