// Applied to every response this Worker renders itself (both success and
// failure) — never to the env.ASSETS passthrough, which keeps the site's
// existing headers for all real pages untouched.
export function securityHeaders(): HeadersInit {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    // No script-src needed — the page has no <script>; default-src 'none'
    // blocks script execution entirely. style-src is relaxed only enough
    // to allow the inline styling on this simple response page.
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  };
}
