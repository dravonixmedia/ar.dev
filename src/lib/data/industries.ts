import type { IndustryItem } from "@/types";

export const industries: IndustryItem[] = [
  { name: "Excavators", category: "Construction Equipment" },
  { name: "Loaders", category: "Construction Equipment" },
  { name: "Dozers", category: "Construction Equipment" },
  { name: "Motor Graders", category: "Construction Equipment" },
  { name: "Cranes", category: "Heavy Machinery" },
  { name: "Tippers", category: "Heavy Machinery" },
  { name: "Mining Equipment", category: "Mining" },
  { name: "Concrete Equipment", category: "Construction Equipment" },
  { name: "Skid Loaders", category: "Construction Equipment" },
  { name: "Tractors", category: "Agricultural Equipment" },
  { name: "Engineering Workshops", category: "Manufacturing" },
  { name: "Industrial Maintenance", category: "Manufacturing" },
];

export const equipmentManufacturers = [
  "Komatsu",
  "CAT",
  "Volvo",
  "Hitachi",
  "JCB",
  "Kubota",
  "Bobcat",
  "Manitou",
  "Case",
  "Hyundai",
  "SANY",
  "Kobelco",
  "Doosan",
  "Liebherr",
  "John Deere",
  "BEML",
] as const;
