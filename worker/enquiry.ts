import { buildEmailContent, sendViaResend } from "./email";
import { verifyTurnstile } from "./turnstile";
import type { ContactSubmission, Env, ParsedAttachment, QuoteSubmission } from "./types";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  arrayBufferToBase64,
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
  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
  if (!turnstileOk) {
    return jsonResponse({ ok: false, reason: "turnstile_failed" }, 400);
  }

  const formType = form.get("formType");
  if (formType === "contact") {
    return handleContact(form, env);
  }
  if (formType === "quote") {
    return handleQuote(form, env);
  }
  return jsonResponse({ ok: false, reason: "invalid_form_type" }, 400);
}

async function handleContact(form: FormData, env: Env): Promise<Response> {
  const name = cleanString(form.get("name"), SHORT_MAX);
  const phone = cleanString(form.get("phone"), 40);
  const email = cleanString(form.get("email"), 254);
  const serviceCategory = cleanString(form.get("serviceCategory"), SHORT_MAX);
  const message = cleanString(form.get("message"), LONG_MAX);

  if (!name || !phone || !email || !message) {
    return jsonResponse({ ok: false, reason: "validation_failed" }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, reason: "invalid_email" }, 400);
  }

  const submission: ContactSubmission = { formType: "contact", name, phone, email, serviceCategory, message };
  return deliver(submission, email, [], env);
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
    return jsonResponse({ ok: false, reason: "validation_failed" }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, reason: "invalid_email" }, 400);
  }

  const files = form.getAll("attachments").filter((v): v is File => v instanceof File && v.size > 0);

  if (files.length > MAX_FILES) {
    return jsonResponse({ ok: false, reason: "too_many_files" }, 400);
  }

  const attachments: ParsedAttachment[] = [];
  let totalSize = 0;

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ ok: false, reason: "file_too_large" }, 400);
    }
    totalSize += file.size;
    if (totalSize > MAX_TOTAL_SIZE) {
      return jsonResponse({ ok: false, reason: "payload_too_large" }, 413);
    }

    const ext = extensionOf(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return jsonResponse({ ok: false, reason: "file_type_not_allowed" }, 400);
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return jsonResponse({ ok: false, reason: "file_type_not_allowed" }, 400);
    }

    const buffer = await file.arrayBuffer();
    const sniffed = sniffMimeType(new Uint8Array(buffer));
    if (!sniffed || sniffed !== file.type) {
      return jsonResponse({ ok: false, reason: "file_content_mismatch" }, 400);
    }

    attachments.push({
      filename: sanitizeFilename(file.name),
      mimeType: sniffed,
      base64: arrayBufferToBase64(buffer),
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
  return deliver(submission, email, attachments, env);
}

async function deliver(
  submission: ContactSubmission | QuoteSubmission,
  replyTo: string,
  attachments: ParsedAttachment[],
  env: Env
): Promise<Response> {
  const { subject, html, text } = buildEmailContent(submission, new Date());

  const result = await sendViaResend({
    apiKey: env.EMAIL_API_KEY,
    from: env.EMAIL_FROM,
    to: env.CONTACT_FORM_RECIPIENT,
    replyTo,
    subject,
    html,
    text,
    attachments,
  });

  if (!result.ok) {
    console.error("enquiry delivery failed", { formType: submission.formType, providerStatus: result.status });
    return jsonResponse({ ok: false, reason: "provider_error" }, 502);
  }

  console.log("enquiry delivered", { formType: submission.formType });
  return jsonResponse({ ok: true }, 200);
}
