export interface WhyChooseItem {
  key: string;
  label: string;
  headline: string;
  description: string;
}

// Actual differentiators, not a restatement of the service list already
// covered in What We Do. Kept to claims the current business scope
// supports — no certifications, guarantees or availability claims that
// haven't been verified.
export const whyChooseItems: WhyChooseItem[] = [
  {
    key: "one-workshop",
    label: "One Workshop. Multiple Capabilities.",
    headline: "One workshop. Multiple capabilities.",
    description:
      "Hydraulics, sealing, machining and fabrication can be coordinated through one workshop workflow.",
  },
  {
    key: "workshop-onsite",
    label: "Workshop + On-Site Support.",
    headline: "Workshop + on-site support.",
    description:
      "Requirements can be handled through workshop services or mobile hydraulic support depending on the job and location.",
  },
  {
    key: "component-id",
    label: "Component Identification Support.",
    headline: "Component identification support.",
    description:
      "Customers can share samples, dimensions, photos, equipment details or part numbers for identification and quotation support.",
  },
  {
    key: "repair-manufacturing",
    label: "Repair + Manufacturing Capability.",
    headline: "Repair + manufacturing capability.",
    description:
      "Repair requirements can be supported alongside machining, component modification and fabrication work where appropriate.",
  },
  {
    key: "industrial-focus",
    label: "Industrial & Heavy-Equipment Focus.",
    headline: "Industrial & heavy-equipment focus.",
    description:
      "Solutions are structured around hydraulic, workshop and heavy-equipment applications.",
  },
];
