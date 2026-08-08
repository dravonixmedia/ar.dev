import type { ProcessStep } from "@/types";

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Share Your Requirement",
    description:
      "Tell us about your equipment, component or service requirement — by call, WhatsApp or the enquiry form.",
  },
  {
    number: "02",
    title: "Inspection & Diagnosis",
    description:
      "We assess the requirement — on-site or at the workshop — to identify the cause and scope of work.",
  },
  {
    number: "03",
    title: "Solution Recommendation",
    description:
      "Based on the diagnosis, we recommend the appropriate repair, component or fabrication solution.",
  },
  {
    number: "04",
    title: "Quotation",
    description: "A clear quotation is shared covering parts, labour and expected timeline.",
  },
  {
    number: "05",
    title: "Repair / Service / Fabrication",
    description: "Our workshop or mobile team carries out the agreed work to specification.",
  },
  {
    number: "06",
    title: "Testing & Handover",
    description: "Completed work is tested before handover, ensuring it meets the requirement.",
  },
];
