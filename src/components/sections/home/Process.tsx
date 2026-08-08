import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { processSteps } from "@/lib/data/process";

export default function Process() {
  return (
    <section className="bg-yellow-soft py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionLabel>How We Work</SectionLabel>
        <TextReveal
          as="h2"
          lines={["A CLEAR PATH FROM", "ENQUIRY TO HANDOVER."]}
          className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
        />

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-black/10 lg:block" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
            {processSteps.map((step) => (
              <div key={step.number} className="relative flex flex-col gap-4">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-orange font-heading text-[13px] font-semibold text-white">
                  {step.number}
                </span>
                <h3 className="text-[14px] font-semibold uppercase tracking-[0.04em] text-black">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-charcoal">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
