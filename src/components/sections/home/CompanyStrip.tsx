import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import DevGroupLogo from "@/components/layout/DevGroupLogo";
import { sisterConcerns, credentials } from "@/lib/data/site";

export default function CompanyStrip() {
  return (
    <section className="bg-grey py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="mb-5">
              <DevGroupLogo size={48} />
            </div>
            <SectionLabel>DEV Group</SectionLabel>
            <h3 className="mt-4 font-heading text-[22px] font-semibold uppercase tracking-tight text-black">
              Sister Concerns
            </h3>
            <p className="mt-2 text-[13px] text-charcoal/70">
              KLMSME: {credentials.klmsme} · UDYAM: {credentials.udyam}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-8">
            {sisterConcerns.map((concern) => (
              <div key={concern.name} className="rounded-2xl border border-border bg-white p-6">
                <h4 className="font-heading text-[17px] font-semibold uppercase text-black">
                  {concern.name}
                </h4>
                <p className="mt-1 text-[13px] text-charcoal">
                  {concern.description} · {concern.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/about"
            data-cursor="link"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
          >
            More About Us
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
