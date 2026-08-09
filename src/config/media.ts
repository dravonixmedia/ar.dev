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
  industries: {
    heavyEquipment: MediaAsset;
  };
  projects: Record<ProjectMediaKey, MediaAsset>;
}

export const mediaConfig: MediaConfig = {
  // Future ar-hydraulics-hero-workshop.mp4 / .webm / poster.webp — see
  // Hero.tsx for the layer architecture already prepared to receive these.
  hero: {
    video: null,
    webm: null,
    poster: null,
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
      src: null,
      alt: "AR Hydraulics and Sealing Solutions workshop exterior, Edakkadu, Kollam",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
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
      src: null,
      alt: "Sealing products range — O-rings, wipers and custom sealing components",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    hydraulic: {
      src: null,
      alt: "Hydraulic products — cylinders, power packs, pumps and valves",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    industrial: {
      src: null,
      alt: "Industrial components — bearings, couplings and workshop hardware",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
  },

  industries: {
    heavyEquipment: {
      src: null,
      alt: "Heavy equipment — excavator and construction machinery serviced by AR Hydraulics",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
  },

  projects: {
    cylinderRepair: {
      src: null,
      alt: "Excavator hydraulic cylinder repair in progress",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    hoseReplacement: {
      src: null,
      alt: "On-site hydraulic hose replacement by the mobile team",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    machining: {
      src: null,
      alt: "Hydraulic rod machining on a lathe for a precision replacement part",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    fabrication: {
      src: null,
      alt: "Workshop steel framework fabrication project",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    roofing: {
      src: null,
      alt: "Industrial shed roofing structure and truss installation project",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "up",
    },
    customGate: {
      src: null,
      alt: "Custom steel entrance gate fabrication project",
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
