// Centralized Zoho India data-center endpoints and fixed constants for the
// temporary OAuth setup callback — the one place these are written.
//
// If a Zoho API call ever fails in a way that indicates this account
// actually lives on a different data center, that is surfaced as an error
// and logged (status/reason only) — never silently retried against a
// different DC.
export const ZOHO_ACCOUNTS_BASE = "https://accounts.zoho.in";
export const ZOHO_MAIL_API_BASE = "https://mail.zoho.in";

// Must exactly match the redirect_uri registered in the Zoho API Console.
export const REDIRECT_URI = "https://arhydraulicssolutions.com/zoho-oauth-callback";

// The mailbox we're resolving a Zoho accountId for.
export const TARGET_MAILBOX = "sales@arhydraulicssolutions.com";
