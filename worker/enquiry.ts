import { buildEmailContent } from "./email";
import { verifyTurnstile, type TurnstileOutcome } from "./turnstile";
import { deliverViaZoho } from "./zoho";
import type { ContactSubmission, Env, ParsedAttachment, QuoteSubmission } from "./types";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  cleanString,
  extensionOf,
  isValidEmail,
  jsonResponse,
  sanitizeFilename,
  sniffMimeType,
} from "./util";

const SHORT_MAX = 200;
const LONG_MAX = 5000;

// Every early return here is deliberately generic — the browser only ever
// sees {ok:true}/{ok:false}; the `reason` field is for our own diagnostics
// via server logs, never rendered to the visitor.
export async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin) {
    const requestOrigin = new URL(request.url).origin;
    if (origin !== requestOrigin) {
      return jsonResponse({ ok: false, reason: "origin_mismatch" }, 403);
    }
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return jsonResponse({ ok: false, reason: "unsupported_content_type" }, 415);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    console.error("[enquiry] INVALID_FORM_DATA");
    return jsonResponse({ ok: false, reason: "invalid_form_data" }, 400);
  }

  // Honeypot: bots that fill every field get a fake success so they don't
  // learn to leave it blank; no email is sent.
  const honeypot = cleanString(form.get("website"), SHORT_MAX);
  if (honeypot) {
    return jsonResponse({ ok: true }, 200);
  }

  const turnstileToken = cleanString(form.get("turnstileToken"), 4000);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  const turnstileOutcome = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
  if (turnstileOutcome !== "success") {
    console.error(`[enquiry] ${TURNSTILE_DIAGNOSTIC_CODE[turnstileOutcome]}`);
    return jsonResponse({ ok: false, reason: "turnstile_failed" }, 400);
  }

  const formType = form.get("formType");
  if (formType === "contact") {
    return handleContact(form, env);
  }
  if (formType === "quote") {
    return handleQuote(form, env);
  }
  console.error("[enquiry] INVALID_FORM_TYPE");
  return jsonResponse({ ok: false, reason: "invalid_form_type" }, 400);
}

// Maps a non-success Turnstile outcome to its closed-set diagnostic code.
// "success" never reaches this lookup (guarded by the caller).
const TURNSTILE_DIAGNOSTIC_CODE: Record<Exclude<TurnstileOutcome, "success">, string> = {
  token_missing: "TURNSTILE_TOKEN_MISSING",
  verify_failed: "TURNSTILE_VERIFY_FAILED",
  network_error: "TURNSTILE_VERIFY_NETWORK_ERROR",
  response_error: "TURNSTILE_VERIFY_RESPONSE_ERROR",
};

async function handleContact(form: FormData, env: Env): Promise<Response> {
  const name = cleanString(form.get("name"), SHORT_MAX);
  const phone = cleanString(form.get("phone"), 40);
  const email = cleanString(form.get("email"), 254);
  const serviceCategory = cleanString(form.get("serviceCategory"), SHORT_MAX);
  const message = cleanString(form.get("message"), LONG_MAX);

  if (!name || !phone || !email || !message) {
    console.error("[enquiry] VALIDATION_FAILED");
    return jsonResponse({ ok: false, reason: "validation_failed" }, 400);
  }
  if (!isValidEmail(email)) {
    console.error("[enquiry] INVALID_EMAIL");
    return jsonResponse({ ok: false, reason: "invalid_email" }, 400);
  }

  const submission: ContactSubmission = { formType: "contact", name, phone, email, serviceCategory, message };
  return deliver(submission, [], env);
}

async function handleQuote(form: FormData, env: Env): Promise<Response> {
  const fullName = cleanString(form.get("fullName"), SHORT_MAX);
  const companyName = cleanString(form.get("companyName"), SHORT_MAX);
  const phone = cleanString(form.get("phone"), 40);
  const whatsapp = cleanString(form.get("whatsapp"), 40);
  const email = cleanString(form.get("email"), 254);
  const location = cleanString(form.get("location"), SHORT_MAX);
  const serviceRequired = cleanString(form.get("serviceRequired"), SHORT_MAX);
  const productRequired = cleanString(form.get("productRequired"), SHORT_MAX);
  const equipmentBrand = cleanString(form.get("equipmentBrand"), SHORT_MAX);
  const equipmentModel = cleanString(form.get("equipmentModel"), SHORT_MAX);
  const partNumber = cleanString(form.get("partNumber"), SHORT_MAX);
  const dimensions = cleanString(form.get("dimensions"), SHORT_MAX);
  const applicationDetails = cleanString(form.get("applicationDetails"), LONG_MAX);
  const message = cleanString(form.get("message"), LONG_MAX);

  if (!fullName || !phone || !email || !serviceRequired || !message) {
    console.error("[enquiry] VALIDATION_FAILED");
    return jsonResponse({ ok: false, reason: "validation_failed" }, 400);
  }
  if (!isValidEmail(email)) {
    console.error("[enquiry] INVALID_EMAIL");
    return jsonResponse({ ok: false, reason: "invalid_email" }, 400);
  }

  const files = form.getAll("attachments").filter((v): v is File => v instanceof File && v.size > 0);

  if (files.length > MAX_FILES) {
    console.error("[enquiry] TOO_MANY_FILES");
    return jsonResponse({ ok: false, reason: "too_many_files" }, 400);
  }

  const attachments: ParsedAttachment[] = [];
  let totalSize = 0;

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      console.error("[enquiry] FILE_TOO_LARGE");
      return jsonResponse({ ok: false, reason: "file_too_large" }, 400);
    }
    totalSize += file.size;
    if (totalSize > MAX_TOTAL_SIZE) {
      console.error("[enquiry] TOTAL_FILE_SIZE_EXCEEDED");
      return jsonResponse({ ok: false, reason: "payload_too_large" }, 413);
    }

    const ext = extensionOf(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      console.error("[enquiry] FILE_TYPE_NOT_ALLOWED");
      return jsonResponse({ ok: false, reason: "file_type_not_allowed" }, 400);
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error("[enquiry] FILE_TYPE_NOT_ALLOWED");
      return jsonResponse({ ok: false, reason: "file_type_not_allowed" }, 400);
    }

    const buffer = await file.arrayBuffer();
    const sniffed = sniffMimeType(new Uint8Array(buffer));
    if (!sniffed || sniffed !== file.type) {
      console.error("[enquiry] FILE_CONTENT_MISMATCH");
      return jsonResponse({ ok: false, reason: "file_content_mismatch" }, 400);
    }

    attachments.push({
      filename: sanitizeFilename(file.name),
      mimeType: sniffed,
      bytes: buffer,
    });
  }

  const submission: QuoteSubmission = {
    formType: "quote",
    fullName,
    companyName,
    phone,
    whatsapp,
    email,
    location,
    serviceRequired,
    productRequired,
    equipmentBrand,
    equipmentModel,
    partNumber,
    dimensions,
    applicationDetails,
    message,
    attachments,
  };
  return deliver(submission, attachments, env);
}

async function deliver(
  submission: ContactSubmission | QuoteSubmission,
  attachments: ParsedAttachment[],
  env: Env
): Promise<Response> {
  const { subject, html } = buildEmailContent(submission, new Date());

  const result = await deliverViaZoho(env, { subject, html, attachments });

  if (!result.ok) {
    console.error("[enquiry] DELIVERY_FAILED");
    return jsonResponse({ ok: false, reason: "provider_error" }, 502);
  }

  console.log("[enquiry] ENQUIRY_DELIVERED");
  return jsonResponse({ ok: true }, 200);
}
