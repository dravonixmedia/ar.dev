import type { MetadataRoute } from "next";
import { siteInfo } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import { projects } from "@/lib/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteInfo.url;
  const now = new Date();

  // /privacy-policy is deliberately excluded — its page metadata sets
  // `robots: { index: false }`, and listing a noindex page in the
  // sitemap sends crawlers a conflicting signal.
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/products",
    "/sealing-solutions",
    "/industries",
    "/projects",
    "/quote",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
