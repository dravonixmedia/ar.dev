import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { projects } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";
import { getProjectMedia } from "@/config/media";

export default function ProjectsSection() {
  const featured = projects.slice(0, 4);

  return (
    <section className="bg-warm py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <SectionLabel>Our Work</SectionLabel>
            <TextReveal
              as="h2"
              lines={["ENGINEERING", "IN ACTION."]}
              className="mt-6 max-w-2xl font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[3vw]"
            />
          </div>
          <Link
            href="/projects"
            data-cursor="link"
            className="group inline-flex w-fit items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
          >
            View All Projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {featured.map((project) => {
            const service = getServiceBySlug(project.serviceSlug);
            return (
              <Link key={project.slug} href={`/projects/${project.slug}`} data-cursor="view" className="group">
                <CinematicMedia
                  asset={getProjectMedia(project.slug)}
                  placeholderLabel={project.category}
                  placeholderIcon={service?.graphic}
                  frameClassName="rounded-2xl"
                  hoverScale
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div data-cursor="link">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
                      {project.category}
                    </span>
                    <h3 className="mt-1 font-heading text-[20px] font-semibold uppercase tracking-tight text-black transition-transform duration-300 group-hover:translate-x-1">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[13px] leading-relaxed text-charcoal/70 line-clamp-2">
                      {project.problem}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
