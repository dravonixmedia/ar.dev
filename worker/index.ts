import { handleZohoOAuthCallback } from "./zoho-oauth-callback";
import { securityHeaders } from "./security-headers";
import type { Env } from "./types";

const CALLBACK_PATH = "/zoho-oauth-callback";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === CALLBACK_PATH) {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", { status: 405, headers: securityHeaders() });
      }
      return handleZohoOAuthCallback(request, env);
    }

    // Everything else is a static asset (or a genuine 404) — hand it back to
    // the asset layer untouched, so all existing SEO/canonical/404 behavior
    // is unaffected by this temporary callback.
    return env.ASSETS.fetch(request);
  },
};
