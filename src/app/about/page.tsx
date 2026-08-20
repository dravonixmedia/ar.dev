import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import Button from "@/components/ui/Button";
import CompanyStrip from "@/components/sections/home/CompanyStrip";
import { services } from "@/lib/data/services";
import { credentials } from "@/lib/data/site";
import { defaultOgImage } from "@/lib/data/seo";
import { mediaConfig } from "@/config/media";

const title = "About AR Hydraulics | Industrial Solutions in Kollam, Kerala";
const description =
  "AR Hydraulics is a DEV Group industrial workshop in Kollam, Kerala, covering hydraulics, sealing, machining, fabrication and roofing across six disciplines.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, images: [defaultOgImage] },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        label="About AR Hydraulics"
        lines={["ONE WORKSHOP.", "MULTIPLE CAPABILITIES."]}
        intro="AR Hydraulics and Sealing Solutions provides integrated industrial support covering hydraulics, mobile hydraulic works, sealing solutions, precision machining, structural fabrication and roofing works — part of DEV Group's engineering and workshop solutions."
      />

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <CinematicMedia
                asset={mediaConfig.company.workshop}
                placeholderLabel="AR Hydraulics Workshop"
                placeholderIcon="hydraulic"
                frameClassName="rounded-2xl"
              />
            </div>
            <div className="flex flex-col justify-center lg:col-span-6">
              <SectionLabel>Our Positioning</SectionLabel>
              <TextReveal
                as="h2"
                lines={["NOT JUST A SEAL", "SUPPLIER."]}
                className="mt-6 font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[4.5vw] lg:text-[2.4vw]"
              />
              <p className="mt-6 text-[15px] leading-relaxed text-charcoal">
                We are positioned as a broader industrial hydraulic maintenance company and
                workshop solutions provider — supporting customers across hydraulics (including
                excavators and other construction equipment), mobile hydraulic works, sealing,
                precision machining, structural fabrication and roofing works, so one team can be
                approached for a wide range of workshop and site requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 text-black lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-8">
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-orange">
                Mission
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-charcoal">
                To provide dependable, technically sound hydraulic, sealing, machining,
                fabrication and roofing support that keeps customer equipment and operations
                running.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 p-8">
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-orange">
                Vision
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-charcoal">
                To be the workshop customers turn to first for integrated industrial engineering
                support — from a single component to a complete fabrication requirement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <SectionLabel>Core Capabilities</SectionLabel>
          <TextReveal
            as="h2"
            lines={["SIX DISCIPLINES.", "ONE TEAM."]}
            className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
          />
          <div className="mt-14 grid grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-2 lg:grid-cols-3 lg:divide-x">
            {services.map((service) => (
              <div key={service.slug} className="flex flex-col gap-3 px-1 py-8 lg:px-8">
                <span className="font-heading text-[13px] font-semibold text-orange">
                  {service.number}
                </span>
                <h3 className="font-heading text-[18px] font-semibold uppercase text-black">
                  {service.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-charcoal">{service.summary}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Button href="/services" variant="primary">
              Explore All Services
            </Button>
          </div>
        </div>
      </section>

      <CompanyStrip />

      <section className="bg-grey py-16">
        <div className="mx-auto max-w-[1440px] px-6 text-[13px] text-charcoal/70 lg:px-10">
          Company credentials — KLMSME: {credentials.klmsme} · UDYAM: {credentials.udyam}
        </div>
      </section>
    </>
  );
}
