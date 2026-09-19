// Centralized Zoho India data-center endpoints — the one place these hosts
// are written, rather than scattered across the Worker.
//
// If a Zoho API call ever fails in a way that indicates this account
// actually lives on a different data center (e.g. the refresh-token
// exchange is rejected as invalid even though the value is correct), that
// is surfaced as an error and logged — never silently retried against a
// different DC. Changing DC means re-doing the OAuth grant against the
// correct accounts host, not a runtime fallback.
export const ZOHO_ACCOUNTS_BASE = "https://accounts.zoho.in";
export const ZOHO_MAIL_API_BASE = "https://mail.zoho.in";
