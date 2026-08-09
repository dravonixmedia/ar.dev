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
      src: null,
      alt: "Hydraulic cylinder and fluid power component undergoing repair",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    mobile: {
      src: null,
      alt: "Mobile hydraulic works team attending equipment on site",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    sealing: {
      src: null,
      alt: "Hydraulic sealing components — O-rings, piston seals and rod seals",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    machining: {
      src: null,
      alt: "Precision machining of a hydraulic shaft on a lathe",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    fabrication: {
      src: null,
      alt: "Structural steel fabrication and industrial welding work",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    roofing: {
      src: null,
      alt: "Industrial roofing structure with trusses and sheet installation",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
      revealDirection: "left",
    },
    customMetal: {
      src: null,
      alt: "Custom steel gate and metal works fabrication",
      desktopObjectPosition: "center",
      mobileObjectPosition: "center",
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
