import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { industries } from "@/lib/data/industries";
import { legalDisclaimers } from "@/lib/data/site";

export default function IndustriesSection() {
  return (
    <section className="bg-black py-24 text-white lg:py-32" data-cursor-theme="dark">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionLabel light>Industries We Serve</SectionLabel>
        <TextReveal
          as="h2"
          lines={["EQUIPMENT ACROSS", "EVERY HEAVY INDUSTRY."]}
          className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight sm:text-[5vw] lg:text-[3vw]"
        />

        <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-12">
          {industries.map((industry) => (
            <span
              key={industry.name}
              className="font-heading text-[7vw] font-semibold uppercase leading-none tracking-tight text-white/25 transition-colors duration-300 hover:text-yellow sm:text-[4vw] lg:text-[2.2vw]"
            >
              {industry.name}
            </span>
          ))}
        </div>

        <p className="mt-16 max-w-2xl text-[13px] leading-relaxed text-white/40">
          {legalDisclaimers.manufacturers}
        </p>
      </div>
    </section>
  );
}
