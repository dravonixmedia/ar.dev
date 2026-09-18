export interface Env {
  ASSETS: Fetcher;
  EMAIL_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  EMAIL_FROM: string;
  CONTACT_FORM_RECIPIENT: string;
}

export type FormType = "contact" | "quote";

export interface ParsedAttachment {
  filename: string;
  mimeType: string;
  base64: string;
}

export interface ContactSubmission {
  formType: "contact";
  name: string;
  phone: string;
  email: string;
  serviceCategory: string;
  message: string;
}

export interface QuoteSubmission {
  formType: "quote";
  fullName: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  serviceRequired: string;
  productRequired: string;
  equipmentBrand: string;
  equipmentModel: string;
  partNumber: string;
  dimensions: string;
  applicationDetails: string;
  message: string;
  attachments: ParsedAttachment[];
}

export type Submission = ContactSubmission | QuoteSubmission;
