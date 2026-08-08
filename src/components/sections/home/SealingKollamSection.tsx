import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import Button from "@/components/ui/Button";

export default function SealingKollamSection() {
  return (
    <section id="hydraulic-seals-kollam" className="bg-yellow-soft py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ImageReveal className="aspect-[4/3] w-full rounded-2xl bg-white" direction="left">
              <div className="flex h-full w-full items-center justify-center p-12 text-orange">
                <ServiceGraphic kind="sealing" className="h-full w-full" />
              </div>
            </ImageReveal>
          </div>

          <div className="lg:col-span-7">
            <SectionLabel>Hydraulic Seals in Kollam</SectionLabel>
            <TextReveal
              as="h2"
              lines={["HYDRAULIC SEALS", "IN KOLLAM."]}
              className="mt-5 font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[2.6vw]"
            />
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-charcoal">
              Looking for hydraulic seals in Kollam? We support hydraulic and pneumatic sealing
              requirements including O-rings, seal kits, piston seals, rod seals, hydraulic
              wipers, backup rings and specialised sealing components — with product
              identification from dimensions, samples or part numbers.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/sealing-solutions" variant="secondary">
                Explore Sealing Solutions
              </Button>
              <Button href="/quote" variant="outline" magnetic={false}>
                Request a Seal Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
