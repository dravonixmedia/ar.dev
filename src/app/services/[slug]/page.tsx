import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import Button from "@/components/ui/Button";
import { services, getServiceBySlug } from "@/lib/data/services";
import { legalDisclaimers, siteInfo } from "@/lib/data/site";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.title} | ${siteInfo.shortName}`, description: service.summary },
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
    provider: { "@type": "LocalBusiness", name: siteInfo.name },
    areaServed: "Kollam, Kerala, India",
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
              <ImageReveal className="aspect-square w-full rounded-2xl bg-yellow-light">
                <div className="flex h-full w-full items-center justify-center p-14 text-orange">
                  <ServiceGraphic kind={service.graphic} className="h-full w-full" />
                </div>
              </ImageReveal>
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
