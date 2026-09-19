import { REDIRECT_URI, TARGET_MAILBOX, ZOHO_ACCOUNTS_BASE, ZOHO_MAIL_API_BASE } from "./config";
import { securityHeaders } from "./security-headers";
import type { Env } from "./types";

// Manual constant-time string comparison. The Workers runtime exposes the
// Web Crypto API (crypto.subtle) but not Node's crypto.timingSafeEqual, so
// this accumulates an XOR difference over the full length of both inputs
// with no early exit, rather than short-circuiting on the first mismatch.
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  const len = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < len; i++) {
    const x = i < aBytes.length ? aBytes[i] : 0;
    const y = i < bBytes.length ? bBytes[i] : 0;
    diff |= x ^ y;
  }
  return diff === 0;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlResponse(status: number, bodyHtml: string): Response {
  return new Response(bodyHtml, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", ...securityHeaders() },
  });
}

// Generic on purpose — used for every failure path (missing/invalid state,
// missing code, token exchange failure, account lookup failure, mailbox
// not found) so the browser never learns which one occurred.
function failureResponse(): Response {
  return htmlResponse(
    400,
    `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Zoho OAuth setup — failed</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; color: #111;">
<h1 style="font-size: 20px;">Setup failed</h1>
<p>The request could not be completed. Generate a fresh authorization code and try again, or check the setup configuration.</p>
</body>
</html>`
  );
}

function successResponse(refreshToken: string, accountId: string): Response {
  return htmlResponse(
    200,
    `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Zoho OAuth setup — one-time result</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; color: #111;">
<h1 style="font-size: 20px;">Zoho OAuth setup complete</h1>
<p>Copy these two values into Cloudflare now, then close this page.</p>

<p style="margin-bottom:4px;"><strong>ZOHO_REFRESH_TOKEN</strong></p>
<pre style="background:#f4f4f4; padding:12px; border-radius:6px; overflow-x:auto; white-space:pre-wrap; word-break:break-all;">${escapeHtml(
      refreshToken
    )}</pre>

<p style="margin-bottom:4px;"><strong>ZOHO_ACCOUNT_ID</strong></p>
<pre style="background:#f4f4f4; padding:12px; border-radius:6px; overflow-x:auto; white-space:pre-wrap; word-break:break-all;">${escapeHtml(
      accountId
    )}</pre>

<ol>
<li>Copy <strong>ZOHO_REFRESH_TOKEN</strong> into Cloudflare as an encrypted Worker Secret.</li>
<li>Copy <strong>ZOHO_ACCOUNT_ID</strong> into the appropriate Cloudflare runtime configuration/secret.</li>
<li>Close this page.</li>
<li>Remove this temporary callback immediately afterward.</li>
</ol>
</body>
</html>`
  );
}

interface TokenExchangeResult {
  ok: boolean;
  status?: number;
  accessToken?: string;
  refreshToken?: string;
}

async function exchangeCodeForToken(code: string, env: Env): Promise<TokenExchangeResult> {
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", env.ZOHO_CLIENT_ID);
  body.set("client_secret", env.ZOHO_CLIENT_SECRET);
  body.set("redirect_uri", REDIRECT_URI);
  body.set("code", code);

  let res: Response;
  try {
    res = await fetch(`${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch {
    return { ok: false };
  }

  // Zoho's OAuth endpoint sometimes returns HTTP 200 with an "error" field
  // instead of a non-2xx status, so both are checked. The raw response body
  // is never logged — only the HTTP status.
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };
  if (!res.ok || data.error || !data.access_token) {
    return { ok: false, status: res.status };
  }
  return { ok: true, accessToken: data.access_token, refreshToken: data.refresh_token };
}

type AccountLookupResult =
  | { ok: true; accountId: string }
  | { ok: false; reason: "lookup_failed" | "not_found"; status?: number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Zoho's documented response for GET /api/accounts wraps the account list
// in a `data` field: {"status":{"code":200,...},"data":[{accountId,...}]}
// (confirmed against Zoho's own "Get all accounts of a user" doc page).
// A bare array is tolerated as a fallback in case a future API version
// drops the wrapper.
function extractAccountList(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) {
    return json.filter(isRecord);
  }
  if (isRecord(json) && Array.isArray(json.data)) {
    return json.data.filter(isRecord);
  }
  return [];
}

// The account's own address field is NOT reliably pinned down by primary
// Zoho documentation: `accountId` is confirmed, but the address field has
// been seen described as `emailAddress` — sometimes as an array of
// {mailId, isPrimary, isAlias, ...} objects (for accounts with aliases),
// sometimes as a plain string — and other Zoho API docs separately mention
// `mailboxAddress`/`incomingUserName`/`primaryEmailAddress` as account-ish
// fields elsewhere. Rather than assume one exact shape, every plausible
// candidate is checked; matching is case-insensitive.
function accountMatchesTarget(account: Record<string, unknown>, target: string): boolean {
  const normalizedTarget = target.toLowerCase();

  const emailAddress = account.emailAddress;
  if (Array.isArray(emailAddress)) {
    for (const entry of emailAddress) {
      if (isRecord(entry) && typeof entry.mailId === "string" && entry.mailId.toLowerCase() === normalizedTarget) {
        return true;
      }
    }
  }
  if (typeof emailAddress === "string" && emailAddress.toLowerCase() === normalizedTarget) {
    return true;
  }

  for (const key of ["mailboxAddress", "primaryEmailAddress", "incomingUserName"]) {
    const value = account[key];
    if (typeof value === "string" && value.toLowerCase() === normalizedTarget) {
      return true;
    }
  }

  return false;
}

async function findAccountId(accessToken: string): Promise<AccountLookupResult> {
  let res: Response;
  try {
    res = await fetch(`${ZOHO_MAIL_API_BASE}/api/accounts`, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
  } catch {
    return { ok: false, reason: "lookup_failed" };
  }

  if (!res.ok) {
    return { ok: false, reason: "lookup_failed", status: res.status };
  }

  const json = await res.json().catch(() => null);
  const accounts = json === null ? [] : extractAccountList(json);

  for (const account of accounts) {
    if (accountMatchesTarget(account, TARGET_MAILBOX) && typeof account.accountId === "string") {
      return { ok: true, accountId: account.accountId };
    }
  }

  return { ok: false, reason: "not_found" };
}

// Every early return here logs at most an operation name + HTTP status/
// reason classification — never the incoming code, state, Client Secret,
// access_token, refresh_token, or any raw Zoho response body.
export async function handleZohoOAuthCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    console.error("zoho oauth callback: missing code or state");
    return failureResponse();
  }

  if (!env.OAUTH_SETUP_SECRET || !timingSafeEqual(state, env.OAUTH_SETUP_SECRET)) {
    console.error("zoho oauth callback: state validation failed");
    return failureResponse();
  }

  const tokenResult = await exchangeCodeForToken(code, env);
  if (!tokenResult.ok || !tokenResult.accessToken) {
    console.error("zoho oauth callback: token exchange failed", { status: tokenResult.status });
    return failureResponse();
  }

  if (!tokenResult.refreshToken) {
    console.error("zoho oauth callback: token exchange succeeded but no refresh_token returned");
    return failureResponse();
  }

  const accountResult = await findAccountId(tokenResult.accessToken);
  if (!accountResult.ok) {
    console.error("zoho oauth callback: account lookup failed", {
      reason: accountResult.reason,
      status: accountResult.status,
    });
    return failureResponse();
  }

  console.log("zoho oauth callback: setup succeeded");
  return successResponse(tokenResult.refreshToken, accountResult.accountId);
}
