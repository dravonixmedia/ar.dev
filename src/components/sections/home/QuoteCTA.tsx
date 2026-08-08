import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import TechLine from "@/components/graphics/TechLine";

export default function QuoteCTA() {
  return (
    <section className="relative overflow-hidden bg-black py-24 text-white lg:py-32">
      <TechLine className="pointer-events-none absolute inset-x-0 top-10 h-8 w-full text-white/10" />
      <TechLine className="pointer-events-none absolute inset-x-0 bottom-10 h-8 w-full text-white/10" />

      <div className="relative mx-auto max-w-[1440px] px-6 text-center lg:px-10">
        <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-yellow">
          Get Started
        </span>
        <TextReveal
          as="h2"
          lines={["READY TO SOLVE YOUR", "INDUSTRIAL REQUIREMENT?"]}
          className="mx-auto mt-6 max-w-3xl font-heading text-[9vw] font-semibold uppercase leading-[0.96] tracking-tight sm:text-[6vw] lg:text-[3.6vw]"
        />
        <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-white/60">
          Share your requirement — hydraulic, sealing, machining, fabrication or roofing — and our
          team will get back with the right solution.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/quote" variant="secondary">
            Request a Quote
          </Button>
          <Button href="/contact" variant="outlineLight" magnetic={false}>
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
