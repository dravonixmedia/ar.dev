import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { productFamilies } from "@/lib/data/products";
import { mediaConfig, type ProductMediaKey } from "@/config/media";

const productMediaKey: Record<string, ProductMediaKey> = {
  "sealing-products": "sealing",
  "hydraulic-products": "hydraulic",
  "industrial-components": "industrial",
};

export default function ProductsSection() {
  return (
    <section className="bg-grey py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>Products</SectionLabel>
            <TextReveal
              as="h2"
              lines={["ORGANISED PRODUCT", "FAMILIES."]}
              className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
            />
          </div>
          <Link
            href="/products"
            data-cursor="link"
            className="group inline-flex w-fit items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
          >
            View All Products
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {productFamilies.map((family, i) => (
            <Link
              key={family.slug}
              href={`/products#${family.slug}`}
              data-cursor="link"
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white transition-colors hover:bg-black"
            >
              <CinematicMedia
                asset={mediaConfig.products[productMediaKey[family.slug]]}
                placeholderLabel={family.title}
                hoverScale
                frameClassName="rounded-none"
              />
              <div className="flex flex-1 flex-col justify-between p-8">
                <div>
                  <span className="font-heading text-[13px] font-semibold text-orange group-hover:text-yellow">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-heading text-[24px] font-semibold uppercase leading-tight text-black group-hover:text-white">
                    {family.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-charcoal group-hover:text-white/60">
                    {family.summary}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {family.items.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border px-3 py-1 text-[11px] text-charcoal group-hover:border-white/20 group-hover:text-white/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <ArrowUpRight className="mt-6 h-5 w-5 text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-yellow" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
