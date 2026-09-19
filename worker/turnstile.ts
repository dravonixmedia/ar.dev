const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Closed set of outcomes — lets the caller log which stage failed without
// ever touching the token, secret, remote IP, or Cloudflare's response body.
// "http_error" carries only the numeric Siteverify HTTP status, never a body.
export type TurnstileResult =
  | { outcome: "success" }
  | { outcome: "token_missing" }
  | { outcome: "verify_failed" }
  | { outcome: "network_error" }
  | { outcome: "http_error"; status: number }
  | { outcome: "json_parse_error" };

// Verifies a Turnstile token server-side. Client-side widget state is never
// trusted on its own — this call is the actual gate.
export async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<TurnstileResult> {
  if (!token) return { outcome: "token_missing" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  let res: Response;
  try {
    res = await fetch(VERIFY_URL, { method: "POST", body });
  } catch {
    return { outcome: "network_error" };
  }

  if (!res.ok) return { outcome: "http_error", status: res.status };

  let data: { success?: boolean };
  try {
    data = (await res.json()) as { success?: boolean };
  } catch {
    return { outcome: "json_parse_error" };
  }

  return data.success === true ? { outcome: "success" } : { outcome: "verify_failed" };
}
