import { ZOHO_ACCOUNTS_BASE, ZOHO_MAIL_API_BASE } from "./config";
import type { Env, ParsedAttachment } from "./types";

export type DeliveryFailureReason =
  | "token_refresh_failed"
  | "attachment_upload_failed"
  | "send_failed";

export type DeliveryResult = { ok: true } | { ok: false; reason: DeliveryFailureReason; status?: number };

interface TokenResponse {
  access_token?: string;
  error?: string;
}

// Exchanges the long-lived refresh token for a short-lived access token.
// Called once per request — deliberately no caching/KV in this first pass
// (traffic is low; a cache can be added later without changing this shape).
async function refreshAccessToken(env: Env): Promise<{ ok: true; token: string } | { ok: false; status: number; error?: string }> {
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("client_id", env.ZOHO_CLIENT_ID);
  body.set("client_secret", env.ZOHO_CLIENT_SECRET);
  body.set("refresh_token", env.ZOHO_REFRESH_TOKEN);

  const res = await fetch(`${ZOHO_ACCOUNTS_BASE}/oauth/v2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  // Zoho's OAuth endpoint sometimes returns HTTP 200 with an "error" field
  // instead of a non-2xx status, so both are checked.
  const data = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || !data.access_token) {
    return { ok: false, status: res.status, error: data.error };
  }
  return { ok: true, token: data.access_token };
}

interface UploadResponse {
  data?: { storeName?: string; attachmentPath?: string; attachmentName?: string };
  storeName?: string;
  attachmentPath?: string;
  attachmentName?: string;
}

interface UploadedAttachment {
  storeName: string;
  attachmentPath: string;
  attachmentName: string;
}

async function uploadAttachment(
  env: Env,
  accessToken: string,
  file: ParsedAttachment
): Promise<{ ok: true; attachment: UploadedAttachment } | { ok: false; status: number }> {
  const url = `${ZOHO_MAIL_API_BASE}/api/accounts/${env.ZOHO_ACCOUNT_ID}/messages/attachments?fileName=${encodeURIComponent(
    file.filename
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "content-type": "application/octet-stream",
    },
    body: file.bytes,
  });

  const json = (await res.json().catch(() => ({}))) as UploadResponse;
  // Zoho typically wraps the payload in a `data` object; tolerate a flat
  // shape too rather than assuming one exact envelope.
  const payload = json.data ?? json;
  if (!res.ok || !payload.storeName || !payload.attachmentPath) {
    return { ok: false, status: res.status };
  }

  return {
    ok: true,
    attachment: {
      storeName: payload.storeName,
      attachmentPath: payload.attachmentPath,
      attachmentName: payload.attachmentName ?? file.filename,
    },
  };
}

interface SendResponse {
  status?: { code?: number };
}

async function sendMessage(
  env: Env,
  accessToken: string,
  args: { subject: string; html: string; attachments: UploadedAttachment[] }
): Promise<{ ok: true } | { ok: false; status: number }> {
  const url = `${ZOHO_MAIL_API_BASE}/api/accounts/${env.ZOHO_ACCOUNT_ID}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      fromAddress: env.CONTACT_FORM_RECIPIENT,
      toAddress: env.CONTACT_FORM_RECIPIENT,
      subject: args.subject,
      content: args.html,
      mailFormat: "html",
      ...(args.attachments.length > 0 ? { attachments: args.attachments } : {}),
    }),
  });

  const json = (await res.json().catch(() => ({}))) as SendResponse;
  if (!res.ok || (json.status?.code !== undefined && json.status.code !== 200)) {
    return { ok: false, status: res.status };
  }
  return { ok: true };
}

// Orchestrates the full delivery: refresh token → upload each attachment →
// send the message referencing the uploaded attachments. The HTML content
// is what's actually delivered — Zoho's send-message API takes a single
// `mailFormat` (html OR plaintext) with one `content` field, so there is no
// separate plain-text part transmitted; the `text` build in email.ts is
// kept for our own tests/diagnostics.
export async function deliverViaZoho(
  env: Env,
  args: { subject: string; html: string; attachments: ParsedAttachment[] }
): Promise<DeliveryResult> {
  const tokenResult = await refreshAccessToken(env);
  if (!tokenResult.ok) {
    console.error("[enquiry] DELIVERY_FAILED", { stage: "token_refresh_failed", status: tokenResult.status });
    return { ok: false, reason: "token_refresh_failed", status: tokenResult.status };
  }

  const uploaded: UploadedAttachment[] = [];
  for (const file of args.attachments) {
    const result = await uploadAttachment(env, tokenResult.token, file);
    if (!result.ok) {
      console.error("[enquiry] DELIVERY_FAILED", { stage: "attachment_upload_failed", status: result.status });
      return { ok: false, reason: "attachment_upload_failed", status: result.status };
    }
    uploaded.push(result.attachment);
  }

  const sendResult = await sendMessage(env, tokenResult.token, {
    subject: args.subject,
    html: args.html,
    attachments: uploaded,
  });
  if (!sendResult.ok) {
    console.error("[enquiry] DELIVERY_FAILED", { stage: "send_failed", status: sendResult.status });
    return { ok: false, reason: "send_failed", status: sendResult.status };
  }

  return { ok: true };
}
