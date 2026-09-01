import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { industries, equipmentManufacturers } from "@/lib/data/industries";
import { legalDisclaimers } from "@/lib/data/site";
import { buildOpenGraph } from "@/lib/data/seo";
import { mediaConfig } from "@/config/media";

const title = "Industries We Serve | AR Hydraulics Kerala";
const description =
  "AR Hydraulics supports construction equipment, heavy machinery, mining equipment, agricultural equipment and manufacturing across Kerala.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/industries" },
  openGraph: buildOpenGraph({ path: "/industries", title, description }),
};

export default function IndustriesPage() {
  const categories = Array.from(new Set(industries.map((i) => i.category)));

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        label="Industries We Serve"
        lines={["EQUIPMENT ACROSS", "EVERY HEAVY INDUSTRY."]}
        intro="Our hydraulic, sealing, machining, fabrication and roofing capabilities support a wide range of equipment types and industrial settings."
      />

      <section className="bg-warm pt-20 lg:pt-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <CinematicMedia
            asset={mediaConfig.industries.heavyEquipment}
            placeholderLabel="Heavy Equipment"
            frameClassName="rounded-2xl"
          />
        </div>
      </section>

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          {categories.map((category) => (
            <div key={category} className="border-t border-border py-10 first:border-t-0">
              <SectionLabel>{category}</SectionLabel>
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {industries
                  .filter((i) => i.category === category)
                  .map((i) => (
                    <span
                      key={i.name}
                      className="font-heading text-[6vw] font-semibold uppercase leading-none tracking-tight text-black transition-colors hover:text-blue sm:text-[3.4vw] lg:text-[1.9vw]"
                    >
                      {i.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-grey py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <SectionLabel>Equipment References</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[4vw] lg:text-[2.2vw]">
            Products &amp; Solutions For Equipment From Leading Manufacturers
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {equipmentManufacturers.map((brand) => (
              <span
                key={brand}
                className="rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium text-charcoal"
              >
                {brand}
              </span>
            ))}
          </div>
          <p className="mt-8 max-w-xl text-[12px] leading-relaxed text-charcoal/60">
            {legalDisclaimers.manufacturers} AR Hydraulics and Sealing Solutions is not an
            authorised dealer or distributor for the manufacturers listed above.
          </p>
        </div>
      </section>
    </>
  );
}
