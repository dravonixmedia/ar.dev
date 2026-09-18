export interface Env {
  ASSETS: Fetcher;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_FORM_RECIPIENT: string;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  ZOHO_REFRESH_TOKEN: string;
  ZOHO_ACCOUNT_ID: string;
}

export type FormType = "contact" | "quote";

export interface ParsedAttachment {
  filename: string;
  mimeType: string;
  bytes: ArrayBuffer;
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
