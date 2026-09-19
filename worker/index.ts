import { handleEnquiry } from "./enquiry";
import type { Env } from "./types";
import { jsonResponse } from "./util";

const ENQUIRY_PATH = "/api/enquiry";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === ENQUIRY_PATH) {
      if (request.method !== "POST") {
        return jsonResponse({ ok: false, reason: "method_not_allowed" }, 405);
      }
      return handleEnquiry(request, env);
    }

    // Everything else is a static asset (or a genuine 404) — hand it back to
    // the asset layer untouched so existing routing/behaviour is unchanged.
    return env.ASSETS.fetch(request);
  },
};
