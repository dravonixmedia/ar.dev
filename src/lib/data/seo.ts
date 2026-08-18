import { siteInfo } from "./site";

// Geographic strategy: Kerala is the primary market/service-area term
// (used across most keywords and pages); Kollam is retained as the
// physical-location / local-SEO term (address, Contact page, the
// dedicated Sealing Solutions landing page, footer). Kerala is not a
// blanket find-replace of Kollam — both are used where each is
// factually accurate.
export const defaultSeo = {
  titleTemplate: `%s | ${siteInfo.shortName}`,
  homeTitle: "Hydraulic & Industrial Solutions in Kerala | AR Hydraulics",
  homeDescription:
    "AR Hydraulics provides hydraulic, mobile hydraulic, sealing, machining, fabrication and industrial workshop solutions across Kerala, based in Kollam.",
  keywords: [
    "Hydraulic Services in Kerala",
    "Hydraulic Repair in Kerala",
    "Hydraulic Cylinder Repair in Kerala",
    "Mobile Hydraulic Services in Kerala",
    "Hydraulic Testing Services in Kerala",
    "Hydraulic Components in Kerala",
    "Hydraulic System Design in Kerala",
    "Hydraulic Hoses in Kerala",
    "Precision Machining in Kerala",
    "Industrial Fabrication in Kerala",
    "Structural Fabrication in Kerala",
    "Roofing Works in Kerala",
    "Industrial Roofing in Kerala",
    "Hydraulic Seals in Kollam",
    "Sealing Solutions in Kollam",
    "Hydraulic Seal Kits in Kollam",
    "Hydraulic Services in Kollam",
  ],
} as const;

// Reused across every page's openGraph.images so social/link previews
// have a consistent, real photo instead of the previously-broken
// /og-image.jpg reference (that file was never actually supplied).
export const defaultOgImage = {
  url: `${siteInfo.url}/media/company/contact-workshop-exterior.png`,
  width: 1672,
  height: 941,
  alt: "AR Hydraulics and Sealing Solutions workshop exterior in Kollam, Kerala",
} as const;
