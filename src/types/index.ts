export interface ServiceItem {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  headline: string;
  supportingHeadline?: string;
  summary: string;
  description: string;
  items: string[];
  ctaLabel: string;
  whatsappMessage: string;
  graphic: "hydraulic" | "mobile" | "sealing" | "machining" | "fabrication" | "roofing";
  isMajor?: boolean;
}

export interface ProductFamily {
  slug: string;
  title: string;
  summary: string;
  items: string[];
}

export interface IndustryItem {
  name: string;
  category: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  serviceSlug: string;
  problem: string;
  work: string;
  outcome: string;
  isPlaceholder?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
