const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Closed set of outcomes — lets the caller log which stage failed without
// ever touching the token, secret, remote IP, or Cloudflare's response body.
export type TurnstileOutcome = "success" | "token_missing" | "verify_failed" | "network_error" | "response_error";

// Verifies a Turnstile token server-side. Client-side widget state is never
// trusted on its own — this call is the actual gate.
export async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<TurnstileOutcome> {
  if (!token) return "token_missing";

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  let res: Response;
  try {
    res = await fetch(VERIFY_URL, { method: "POST", body });
  } catch {
    return "network_error";
  }

  if (!res.ok) return "response_error";

  let data: { success?: boolean };
  try {
    data = (await res.json()) as { success?: boolean };
  } catch {
    return "response_error";
  }

  return data.success === true ? "success" : "verify_failed";
}
