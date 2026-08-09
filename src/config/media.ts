// Central 16:9 media configuration. Every image the site can show is
// declared once here — sections read from this file instead of hard-coding
// paths, so a future image batch only means editing this file.
//
// `src: null` means the final photo hasn't been supplied yet; CinematicMedia
// renders a design-level placeholder (same aspect ratio, no layout shift)
// until it's filled in.

export type RevealDirection = "up" | "left" | "right";

export interface MediaAsset {
  src: string | null;
  alt: string;
  /** object-position on tablet/desktop (lg breakpoint and up). */
  desktopObjectPosition?: string;
  /** object-position on mobile/tablet-down; falls back to desktop value. */
  mobileObjectPosition?: string;
  revealDirection?: RevealDirection;
  priority?: boolean;
}

export type ServiceMediaKey =
  | "hydraulic"
  | "mobile"
  | "sealing"
  | "machining"
  | "fabrication"
  | "roofing"
  | "customMetal";

export type ProductMediaKey = "sealing" | "hydraulic" | "industrial";

export type IndustryMediaKey =
  | "heavyEquipment"
  | "constructionEquipment"
  | "heavyMachinery"
  | "mining"
  | "agriculturalEquipment"
  | "manufacturing";

export type ProjectMediaKey =
  | "cylinderRepair"
  | "hoseReplacement"
  | "machining"
  | "fabrication"
  | "roofing"
  | "customGate";

interface MediaConfig {
  hero: {
    video: string | null;
    webm: string | null;
    poster: string | null;
  };
  company: {
    workshop: MediaAsset;
    exterior: MediaAsset;
  };
  services: Record<ServiceMediaKey, MediaAsset>;
  products: Record<ProductMediaKey, MediaAsset>;
  industries: Record<IndustryMediaKey, MediaAsset>;
  projects: Record<ProjectMediaKey, MediaAsset>;
}

export const mediaConfig: MediaConfig = {
  // See Hero.tsx for the poster/video/overlay layer architecture. The
  // poster is a real frame extracted from the hero video itself (0.5s),
  // so the poster→video handoff is visually seamless — same footage,
  // same framing, no fallback illustration underneath.
  hero: {
    video: "/media/hero/ar-hydraulics-hero-workshop.mp4",
    webm: "/media/hero/ar-hydraulics-hero-workshop.webm",
    poster: "/media/hero/ar-hydraulics-hero-poster.webp",
  },

  company: {
    workshop: {
      src: "/media/company/about-workshop-overview.png",
      alt: "AR Hydraulics workshop floor — two technicians assembling hydraulic components at workbenches, with a yellow hydraulic cylinder in the foreground and cylinder rods and seal kits stored on shelving behind",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    exterior: {
      src: "/media/company/contact-workshop-exterior.png",
      alt: "AR Hydraulics and Sealing Solutions workshop exterior with an open bay door, forklift and parked vehicles, surrounded by palm trees",
      desktopObjectPosition: "62% 55%",
      mobileObjectPosition: "50% 55%",
      revealDirection: "up",
    },
  },

  services: {
    hydraulic: {
      src: "/media/services/service-hydraulic-fluid-power.png",
      alt: "Technician assembling a hydraulic manifold and fittings beside a yellow hydraulic cylinder and a hydraulic power pack unit in the workshop",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    mobile: {
      src: "/media/services/service-mobile-hydraulic-works.png",
      alt: "Technician in a blue hard hat repairing the hydraulic hose block on an excavator on site, palm trees in the background",
      desktopObjectPosition: "62% center",
      mobileObjectPosition: "70% center",
      revealDirection: "left",
    },
    sealing: {
      src: "/media/services/service-sealing-solutions.png",
      alt: "Assortment of hydraulic seals, O-rings, wipers and seal kits in orange, yellow, black and white laid out on a workbench",
      desktopObjectPosition: "center",
      mobileObjectPosition: "40% center",
      revealDirection: "left",
    },
    machining: {
      src: "/media/services/service-precision-machining.png",
      alt: "Technician machining a steel shaft on a lathe, with coolant running and machined components on the bench in front",
      desktopObjectPosition: "center",
      mobileObjectPosition: "35% center",
      revealDirection: "left",
    },
    fabrication: {
      src: "/media/services/service-structural-fabrication.png",
      alt: "Technician welding a steel structural frame in the workshop, with a second welder working in the background",
      desktopObjectPosition: "center",
      mobileObjectPosition: "58% center",
      revealDirection: "left",
    },
    roofing: {
      src: "/media/services/service-roofing-works.png",
      alt: "Aerial view of technicians installing metal roofing sheets on an industrial building at sunset, with a crane lift alongside",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    customMetal: {
      src: "/media/services/service-custom-gate-metal-works.png",
      alt: "Technician welding a custom steel gate with a diagonal slat pattern in the workshop",
      desktopObjectPosition: "center",
      mobileObjectPosition: "62% center",
      revealDirection: "left",
    },
  },

  products: {
    sealing: {
      src: "/media/products/products-sealing-products.png",
      alt: "Sealing products range — O-rings, piston seals, rod seals, wipers and a seal kit case laid out on a workshop floor",
      desktopObjectPosition: "center",
      mobileObjectPosition: "40% center",
      revealDirection: "up",
    },
    hydraulic: {
      src: "/media/products/products-hydraulic-products.png",
      alt: "Hydraulic products — a yellow hydraulic cylinder, pump, hoses, fittings and flanges arranged on a workshop bench",
      desktopObjectPosition: "center",
      mobileObjectPosition: "45% center",
      revealDirection: "up",
    },
    industrial: {
      src: "/media/products/products-industrial-components.png",
      alt: "Industrial components — machined shafts, bushings, flanges and couplings arranged on a workshop table",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
  },

  // Per-industry photos for the homepage Industries stage's image switcher.
  // Each of the 5 category slots now has its own dedicated photo (1672x941,
  // matching 16:9) — object-positions below reflect where the actual
  // subject sits in each specific photo, not a blind "center" default.
  industries: {
    heavyEquipment: {
      src: "/media/industries/industry-heavy-equipment.png",
      alt: "Technician in a hard hat and hi-vis vest inspecting a yellow excavator at a quarry site",
      desktopObjectPosition: "center",
      mobileObjectPosition: "45% center",
      revealDirection: "up",
    },
    constructionEquipment: {
      src: "/media/industries/industry-construction-equipment.png",
      alt: "Yellow excavator digging alongside a wheel loader at a construction site, with a multi-storey building under construction and a tower crane in the background",
      desktopObjectPosition: "42% 55%",
      mobileObjectPosition: "38% 60%",
      revealDirection: "up",
    },
    heavyMachinery: {
      src: "/media/industries/industry-heavy-machinery.png",
      alt: "Wheel loader dumping crushed rock from its bucket at a quarry, with a rocky cliff face in the background",
      desktopObjectPosition: "58% 62%",
      mobileObjectPosition: "62% 65%",
      revealDirection: "up",
    },
    mining: {
      src: "/media/industries/industry-mining.png",
      alt: "Technician in an orange hi-vis jacket standing beside a large excavator at an open-pit mine, with terraced rock walls under an overcast sky",
      desktopObjectPosition: "55% 58%",
      mobileObjectPosition: "60% 55%",
      revealDirection: "up",
    },
    agriculturalEquipment: {
      src: "/media/industries/industry-agricultural-equipment.png",
      alt: "Tractor with a rotary tiller attachment working a flooded rice paddy field, with palm trees and hills in the background",
      desktopObjectPosition: "65% 55%",
      mobileObjectPosition: "70% 55%",
      revealDirection: "up",
    },
    manufacturing: {
      src: "/media/industries/industry-manufacturing.png",
      alt: "Technician in a workshop inspecting a precision-machined metal shaft beside a CNC machining center control panel",
      desktopObjectPosition: "center",
      mobileObjectPosition: "48% 50%",
      revealDirection: "up",
    },
  },

  projects: {
    cylinderRepair: {
      src: "/media/projects/project-cylinder-repair.png",
      alt: "Technician disassembling a hydraulic cylinder for seal replacement, with the seal kit laid out on the workbench",
      desktopObjectPosition: "center",
      mobileObjectPosition: "55% center",
      revealDirection: "up",
    },
    hoseReplacement: {
      src: "/media/projects/project-hose-replacement.png",
      alt: "Technician in a hard hat replacing hydraulic hoses on an excavator boom on site",
      desktopObjectPosition: "center",
      mobileObjectPosition: "35% center",
      revealDirection: "up",
    },
    machining: {
      src: "/media/projects/project-machining.png",
      alt: "Technician measuring a machined shaft with a micrometer on a lathe",
      desktopObjectPosition: "center",
      mobileObjectPosition: "62% center",
      revealDirection: "up",
    },
    fabrication: {
      src: "/media/projects/project-fabrication.png",
      alt: "Technician welding a steel support framework in the workshop",
      desktopObjectPosition: "center",
      mobileObjectPosition: "35% center",
      revealDirection: "up",
    },
    roofing: {
      src: "/media/projects/project-roofing.png",
      alt: "Interior view of a steel-framed industrial shed under construction, with workers on scissor lifts installing roof insulation",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    customGate: {
      src: "/media/projects/project-custom-gate.png",
      alt: "Finished custom steel sliding gate with a vertical bar and mesh panel design in the workshop",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
  },
};

const projectMediaKeyBySlug: Partial<Record<string, ProjectMediaKey>> = {
  "excavator-cylinder-repair": "cylinderRepair",
  "on-site-hose-replacement": "hoseReplacement",
  "hydraulic-rod-machining": "machining",
  "workshop-steel-framework": "fabrication",
  "industrial-shed-roofing": "roofing",
  "custom-entrance-gate": "customGate",
};

/**
 * Resolves the media asset for a project by slug. Projects without a
 * dedicated project photo (e.g. the sealing seal-kit project) reuse the
 * matching service image rather than inventing a duplicate file.
 */
export function getProjectMedia(slug: string): MediaAsset {
  const key = projectMediaKeyBySlug[slug];
  return key ? mediaConfig.projects[key] : mediaConfig.services.sealing;
}
