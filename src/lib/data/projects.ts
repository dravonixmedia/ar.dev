import type { ProjectItem } from "@/types";

// Placeholder project entries — architecture ready for real project data
// (client name, images, outcome) once confirmed. Marked isPlaceholder so the
// UI can flag them clearly rather than presenting invented results as fact.
export const projects: ProjectItem[] = [
  {
    slug: "excavator-cylinder-repair",
    title: "Excavator Cylinder Repair",
    category: "Cylinder Works",
    serviceSlug: "hydraulic-fluid-power",
    problem: "Hydraulic cylinder reported leakage and reduced lifting performance.",
    work: "On-site inspection followed by cylinder strip-down, seal replacement and pressure testing.",
    outcome: "Cylinder restored and returned to service.",
    isPlaceholder: true,
  },
  {
    slug: "on-site-hose-replacement",
    title: "On-Site Hose Replacement",
    category: "Mobile Hydraulic Works",
    serviceSlug: "mobile-hydraulic-works",
    problem: "Hydraulic hose failure on site halted equipment operation.",
    work: "Mobile team attended site, identified hose specification and carried out replacement.",
    outcome: "Equipment brought back into operation on the same visit.",
    isPlaceholder: true,
  },
  {
    slug: "custom-seal-kit-sourcing",
    title: "Custom Seal Kit Sourcing",
    category: "Sealing Solutions",
    serviceSlug: "sealing-solutions",
    problem: "Obsolete cylinder required a seal kit with no listed part number.",
    work: "Dimensions and sample profile assessed to identify and source a matching seal kit.",
    outcome: "Correct seal kit supplied for reassembly.",
    isPlaceholder: true,
  },
  {
    slug: "hydraulic-rod-machining",
    title: "Hydraulic Rod Machining",
    category: "Precision Machining",
    serviceSlug: "precision-machining",
    problem: "Damaged hydraulic rod required replacement with no OEM part available.",
    work: "Custom rod turned and finished to match original specification.",
    outcome: "Replacement rod fitted and cylinder returned to service.",
    isPlaceholder: true,
  },
  {
    slug: "workshop-steel-framework",
    title: "Workshop Steel Framework",
    category: "Fabrication",
    serviceSlug: "structural-fabrication",
    problem: "Client required a custom steel support framework for workshop equipment.",
    work: "Framework designed, fabricated and installed on site.",
    outcome: "Framework installed and commissioned.",
    isPlaceholder: true,
  },
  {
    slug: "industrial-shed-roofing",
    title: "Industrial Shed Roofing",
    category: "Roofing",
    serviceSlug: "roofing-works",
    problem: "Industrial shed required new roof trusses and sheeting.",
    work: "Structural trusses fabricated and roofing sheets installed with supporting steelwork.",
    outcome: "Roofing structure completed and handed over.",
    isPlaceholder: true,
  },
  {
    slug: "custom-entrance-gate",
    title: "Custom Entrance Gate",
    category: "Custom Gate Works",
    serviceSlug: "structural-fabrication",
    problem: "Site required a custom steel entrance gate.",
    work: "Gate designed, fabricated, welded and finished on-site.",
    outcome: "Gate installed and commissioned.",
    isPlaceholder: true,
  },
];

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
