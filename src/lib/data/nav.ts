import type { NavLink } from "@/types";
import { services } from "./services";

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
      description: s.summary,
    })),
  },
  { label: "Products", href: "/products" },
  { label: "Sealing Solutions", href: "/sealing-solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const footerServiceLinks = services.map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
}));
