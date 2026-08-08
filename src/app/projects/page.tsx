import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import { projects } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Engineering in action — hydraulic repair, cylinder works, mobile hydraulic works, machining, fabrication and roofing projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        label="Our Work"
        lines={["ENGINEERING", "IN ACTION."]}
        intro="A selection of the work our team carries out across hydraulic repair, cylinder works, mobile hydraulic works, precision machining, fabrication and roofing."
      />

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const service = getServiceBySlug(project.serviceSlug);
              return (
                <Link key={project.slug} href={`/projects/${project.slug}`} data-cursor="view" className="group">
                  <ImageReveal className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-grey">
                    <div className="flex h-full w-full items-center justify-center p-12 text-black/40 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                      {service && <ServiceGraphic kind={service.graphic} className="h-full w-full" />}
                    </div>
                  </ImageReveal>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div data-cursor="link">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange">
                        {project.category}
                      </span>
                      <h2 className="mt-1 font-heading text-[18px] font-semibold uppercase tracking-tight text-black transition-transform duration-300 group-hover:translate-x-1">
                        {project.title}
                      </h2>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
