import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbSchema from "@/components/ui/BreadcrumbSchema";
import CinematicMedia from "@/components/ui/CinematicMedia";
import Button from "@/components/ui/Button";
import { projects, getProjectBySlug } from "@/lib/data/projects";
import { getServiceBySlug } from "@/lib/data/services";
import { getProjectMedia } from "@/config/media";
import { buildOpenGraph } from "@/lib/data/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const description = `${project.category} — ${project.problem}`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: buildOpenGraph({ path: `/projects/${project.slug}`, title: project.title, description }),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const service = getServiceBySlug(project.serviceSlug);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: project.title },
  ];

  return (
    <section className="border-b border-border bg-warm pb-20 pt-[calc(84px+3rem)] lg:pb-28 lg:pt-[calc(84px+5rem)]">
      <BreadcrumbSchema items={crumbs} />
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-blue">
              {project.category}
            </span>
            <h1 className="mt-4 font-heading text-[9vw] font-semibold uppercase leading-[0.96] tracking-tight text-black sm:text-[5.5vw] lg:text-[3vw]">
              {project.title}
            </h1>

            {project.isPlaceholder && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-error/30 bg-yellow-soft px-5 py-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
                <p className="text-[13px] leading-relaxed text-charcoal">
                  This project entry is a placeholder illustrating the type of work carried out.
                  Real project details, images and outcomes will be added once confirmed.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-8 border-t border-border pt-8">
              <div>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                  Requirement
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-charcoal">{project.problem}</p>
              </div>
              <div>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                  Work Performed
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-charcoal">{project.work}</p>
              </div>
              <div>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                  Outcome
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-charcoal">{project.outcome}</p>
              </div>
            </div>

            {service && (
              <div className="mt-10">
                <Button href={`/services/${service.slug}`} variant="outline" magnetic={false}>
                  View {service.title}
                </Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-6">
            <CinematicMedia
              asset={getProjectMedia(project.slug)}
              placeholderLabel={project.category}
              placeholderIcon={service?.graphic}
              frameClassName="rounded-2xl"
            />
          </div>
        </div>

        <div className="mt-16">
          <Link
            href="/projects"
            data-cursor="link"
            className="text-[13px] font-semibold uppercase tracking-[0.12em] text-black hover:text-blue"
          >
            ← Back to Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}
