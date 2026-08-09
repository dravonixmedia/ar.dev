import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import { mediaConfig } from "@/config/media";

export default function AboutIntro() {
  return (
    <section className="relative overflow-hidden bg-warm py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-5">
          <CinematicMedia
            asset={mediaConfig.company.workshop}
            placeholderLabel="AR Hydraulics Workshop"
            placeholderIcon="hydraulic"
            frameClassName="rounded-2xl"
          />
          <div className="relative -mt-10 ml-10 hidden aspect-square w-40 rounded-xl border border-border bg-white p-5 shadow-[0_20px_50px_-20px_rgba(16,15,13,0.3)] lg:block">
            <ServiceGraphic kind="sealing" className="h-full w-full text-orange" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <SectionLabel>About AR Hydraulics</SectionLabel>

          <TextReveal
            as="h2"
            lines={["ONE WORKSHOP.", <span key="line-2">MULTIPLE <span className="text-yellow [-webkit-text-stroke:1px_#100F0D]">CAPABILITIES.</span></span>]}
            className="mt-6 font-heading text-[10vw] font-semibold uppercase leading-[0.96] tracking-tight text-black sm:text-[6vw] lg:text-[3.6vw]"
          />

          <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-charcoal">
            AR Hydraulics and Sealing Solutions provides integrated industrial support covering
            hydraulics, mobile hydraulic works, sealing solutions, precision machining, structural
            fabrication and roofing works. Customers can approach one team for product
            identification, hydraulic repair, component requirements and specialised workshop or
            engineering support.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {["Hydraulics", "Sealing", "Machining", "Fabrication", "Roofing", "Mobile Works"].map(
              (item, i) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="font-heading text-[13px] font-semibold text-orange">
                    0{i + 1}
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-black">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>

          <Link
            href="/about"
            data-cursor="link"
            className="group mt-10 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
          >
            Discover AR Hydraulics
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
