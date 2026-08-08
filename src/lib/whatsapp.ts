import { contact } from "./data/site";

export const defaultWhatsappMessage =
  "Hi AR Hydraulics and Sealing Solutions, I would like to enquire about your products/services.";

export function buildWhatsappUrl(message: string = defaultWhatsappMessage) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${contact.phoneRaw}?text=${encoded}`;
}

export function buildTelUrl() {
  return `tel:${contact.phone.replace(/\s+/g, "")}`;
}
