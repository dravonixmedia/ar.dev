// Deliberately minimal — only what the one-time OAuth setup callback
// needs. Does not include ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID,
// TURNSTILE_SECRET_KEY, CONTACT_FORM_RECIPIENT, or anything else from the
// enquiry-form backend; this branch does not bring that code in.
export interface Env {
  ASSETS: Fetcher;
  ZOHO_CLIENT_ID: string;
  ZOHO_CLIENT_SECRET: string;
  OAUTH_SETUP_SECRET: string;
}
