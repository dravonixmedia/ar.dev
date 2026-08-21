export const siteInfo = {
  name: "AR Hydraulics and Sealing Solutions",
  shortName: "AR Hydraulics",
  group: "DEV GROUP",
  tagline: "One Workshop. Complete Industrial Solutions.",
  descriptor: "Hydraulics · Mobile Works · Sealing · Machining · Fabrication · Roofing",
  url: "https://www.arhydraulicssolutions.com",
  legacyUrl: "https://arhydraulicssolutions.com",
  locale: "en_IN",
} as const;

export const contact = {
  companyName: "AR Hydraulics and Sealing Solutions",
  addresses: [
    {
      key: "delivery",
      label: "Address 01",
      lines: [
        "7/628, Sathyalayam, Unnamed Road",
        "Near St. Thomas Residential Central School, Edakkad South, Poruvazhy",
      ],
      area: "Poruvazhy",
      city: "Kollam",
      state: "Kerala",
      pincode: "690520",
      country: "India",
    },
    {
      key: "registered",
      label: "Address 02",
      lines: ["Building No. 5/514", "East Kallada Town Ward, East Kallada P.O."],
      area: "East Kallada",
      city: "Kollam",
      state: "Kerala",
      pincode: "691502",
      country: "India",
    },
  ],
  phone: "+91 81297 41233",
  phoneRaw: "918129741233",
  email: "arhydraulicssolutions@gmail.com",
  website: "www.arhydraulicssolutions.com",
} as const;

export type Address = (typeof contact.addresses)[number];

// Full postal string, most-specific line first — for address cards and maps.
export function formatAddress(address: Address) {
  return [...address.lines, `${address.city} - ${address.pincode}`, address.state, address.country].join(", ");
}

// Locality-only, for compact UI (mobile nav, home teaser) where a full
// multi-line postal address would overflow the available space.
export function formatAddressShort(address: Address) {
  return `${address.area}, ${address.city}, ${address.state}`;
}

export function addressMapQuery(address: Address) {
  return encodeURIComponent([...address.lines, address.city, address.state, address.pincode].join(", "));
}

export const credentials = {
  klmsme: "6932/2025",
  udyam: "UDYAM-KL-06-0057785",
  gstin: "32GXZPS5553J1ZH",
} as const;

export const sisterConcerns = [
  {
    name: "Aravind Cranes",
    description: "Crane Rental",
    location: "Trivandrum / Kollam",
  },
  {
    name: "Sree Durga Concrete Works",
    description: "Concrete Works",
    location: "Kollam",
  },
] as const;

export const socialLinks = {
  whatsapp: `https://wa.me/918129741233`,
} as const;

export const legalDisclaimers = {
  mobileService:
    "Mobile and on-site service availability depends on location, equipment requirements and technician availability.",
  manufacturers:
    "Products and solutions for equipment from leading manufacturers.",
} as const;
