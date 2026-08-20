import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { productFamilies, technicalSpecFields } from "@/lib/data/products";
import { defaultOgImage } from "@/lib/data/seo";
import { mediaConfig, type ProductMediaKey } from "@/config/media";

const productMediaKey: Record<string, ProductMediaKey> = {
  "sealing-products": "sealing",
  "hydraulic-products": "hydraulic",
  "industrial-components": "industrial",
};

const title = "Hydraulic & Sealing Products | AR Hydraulics Kerala";
const description =
  "Sealing products, hydraulic products and industrial components supplied by AR Hydraulics, serving customers across Kerala from Kollam.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/products" },
  openGraph: { title, description, images: [defaultOgImage] },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
        label="Products"
        lines={["ORGANISED PRODUCT", "FAMILIES."]}
        intro="From sealing components to hydraulic power units and supporting industrial parts — organised into clear product families for easy identification."
      />

      {productFamilies.map((family, i) => (
        <section
          id={family.slug}
          key={family.slug}
          className={`scroll-mt-24 py-20 lg:py-24 ${i % 2 === 0 ? "bg-warm" : "bg-grey"}`}
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                <CinematicMedia
                  asset={mediaConfig.products[productMediaKey[family.slug]]}
                  placeholderLabel={family.title}
                  frameClassName="rounded-2xl"
                />
              </div>
              <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                <SectionLabel>{`0${i + 1}`}</SectionLabel>
                <h2 className="mt-6 font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[4vw] lg:text-[2.2vw]">
                  {family.title}
                </h2>
                <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-charcoal">
                  {family.summary}
                </p>
                <div className="mt-8">
                  <Button href="/quote" variant="outline" magnetic={false}>
                    Enquire About {family.title}
                  </Button>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
                  {family.items.map((item) => (
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
      ))}

      <section className="bg-cream py-20 text-black lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <SectionLabel>Technical Specifications</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-heading text-[7vw] font-semibold uppercase leading-[0.98] tracking-tight sm:text-[4vw] lg:text-[2.2vw]">
            Share Your Component Details
          </h2>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-charcoal">
            For an accurate quotation, share the relevant specifications for your requirement —
            our team will confirm suitability against your application.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {technicalSpecFields.map((field) => (
              <span
                key={field}
                className="rounded-full border border-black/15 px-4 py-2 text-[12px] uppercase tracking-[0.06em] text-charcoal"
              >
                {field}
              </span>
            ))}
          </div>
          <div className="mt-9">
            <Button href="/quote" variant="secondary">
              Request a Quote
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
