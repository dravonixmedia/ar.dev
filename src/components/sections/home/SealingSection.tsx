import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import Button from "@/components/ui/Button";
import { getServiceBySlug } from "@/lib/data/services";

export default function SealingSection() {
  const service = getServiceBySlug("sealing-solutions")!;

  return (
    <section id="hydraulic-seals-kollam" className="bg-warm py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 lg:order-2">
            <ImageReveal className="aspect-[4/3] w-full rounded-2xl bg-yellow-light" direction="right">
              <div className="flex h-full w-full items-center justify-center p-14 text-orange">
                <ServiceGraphic kind="sealing" className="h-full w-full" />
              </div>
            </ImageReveal>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 rounded-2xl border border-border bg-white p-6">
              {service.items.slice(0, 10).map((item) => (
                <span key={item} className="flex items-center gap-2 text-[13px] text-charcoal">
                  <span className="h-1 w-1 rounded-full bg-orange" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <SectionLabel>Hydraulic Seals in Kollam</SectionLabel>
            <TextReveal
              as="h2"
              lines={["HYDRAULIC & INDUSTRIAL", <span key="sealing-highlight" className="text-yellow [-webkit-text-stroke:1px_#100F0D]">SEALING SOLUTIONS.</span>]}
              className="mt-6 font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[2.8vw]"
            />

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-charcoal">
              Looking for hydraulic seals in Kollam? AR Hydraulics and Sealing Solutions supports
              hydraulic, pneumatic and industrial sealing requirements including O-rings, seal
              kits, piston seals, rod seals, hydraulic wipers, backup rings and specialised sealing
              components. Customers can share dimensions, samples, equipment details, photographs
              or part numbers for product identification and quotation support.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/quote" variant="secondary">
                Request a Seal Quote
              </Button>
              <Button href="/sealing-solutions" variant="outline" magnetic={false}>
                Share Your Part Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
