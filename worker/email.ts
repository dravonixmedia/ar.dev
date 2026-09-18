import { escapeHtml } from "./util";
import type { ContactSubmission, ParsedAttachment, QuoteSubmission, Submission } from "./types";

function formatTimestamp(date: Date): string {
  try {
    return (
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(date) + " IST"
    );
  } catch {
    return date.toISOString();
  }
}

interface Row {
  label: string;
  value: string;
}

function textBlock(heading: string, rows: Row[]): string {
  const lines = rows.filter((r) => r.value).map((r) => `${r.label}: ${r.value}`);
  if (lines.length === 0) return "";
  return `${heading}\n\n${lines.join("\n")}`;
}

function htmlBlock(heading: string, rows: Row[]): string {
  const present = rows.filter((r) => r.value);
  if (present.length === 0) return "";
  const rowsHtml = present
    .map(
      (r) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;white-space:nowrap;vertical-align:top;">${escapeHtml(
          r.label
        )}</td><td style="padding:4px 0;color:#111;">${escapeHtml(r.value)}</td></tr>`
    )
    .join("");
  return `
    <h2 style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a6d1f;margin:24px 0 8px;">${escapeHtml(
      heading
    )}</h2>
    <table role="presentation" style="border-collapse:collapse;width:100%;font-size:14px;">${rowsHtml}</table>`;
}

function buildContact(submission: ContactSubmission, submittedAt: Date) {
  const subject = "New Website Enquiry — AR Hydraulics";
  const heading = "NEW WEBSITE ENQUIRY — GENERAL CONTACT FORM";

  const customerRows: Row[] = [
    { label: "Name", value: submission.name },
    { label: "Phone", value: submission.phone },
    { label: "Email", value: submission.email },
  ];
  const requirementRows: Row[] = [{ label: "Service", value: submission.serviceCategory }];
  const messageText = submission.message;
  const timestamp = formatTimestamp(submittedAt);

  const text = [
    heading,
    "AR HYDRAULICS & SEALING SOLUTIONS",
    "",
    textBlock("CUSTOMER DETAILS", customerRows),
    textBlock("REQUIREMENT", requirementRows),
    submission.message && `MESSAGE\n\n${messageText}`,
    `Submitted: ${timestamp}`,
    "Source: AR Hydraulics Website",
  ]
    .filter(Boolean)
    .join("\n\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a6d1f;margin:0 0 4px;">${escapeHtml(
        heading
      )}</p>
      <h1 style="font-size:18px;margin:0 0 16px;">AR Hydraulics &amp; Sealing Solutions</h1>
      ${htmlBlock("Customer Details", customerRows)}
      ${htmlBlock("Requirement", requirementRows)}
      ${
        submission.message
          ? `<h2 style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a6d1f;margin:24px 0 8px;">Message</h2><p style="font-size:14px;white-space:pre-wrap;margin:0;">${escapeHtml(
              submission.message
            )}</p>`
          : ""
      }
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
      <p style="font-size:12px;color:#777;margin:0;">Submitted: ${escapeHtml(timestamp)}<br/>Source: AR Hydraulics Website</p>
    </div>`;

  return { subject, html, text };
}

function buildQuote(submission: QuoteSubmission, submittedAt: Date) {
  const subject = "New Quote Request — AR Hydraulics";
  const heading = "NEW WEBSITE ENQUIRY — QUOTE / ENQUIRY FORM";

  const customerRows: Row[] = [
    { label: "Name", value: submission.fullName },
    { label: "Company", value: submission.companyName },
    { label: "Phone", value: submission.phone },
    { label: "WhatsApp", value: submission.whatsapp },
    { label: "Email", value: submission.email },
    { label: "Location", value: submission.location },
  ];
  const requirementRows: Row[] = [
    { label: "Service", value: submission.serviceRequired },
    { label: "Product", value: submission.productRequired },
    { label: "Equipment Brand", value: submission.equipmentBrand },
    { label: "Equipment Model", value: submission.equipmentModel },
    { label: "Part Number", value: submission.partNumber },
    { label: "Dimensions", value: submission.dimensions },
  ];
  const timestamp = formatTimestamp(submittedAt);
  const attachmentNote =
    submission.attachments.length > 0
      ? `Attachments: ${submission.attachments.length} file(s) attached to this email`
      : "";

  const text = [
    heading,
    "AR HYDRAULICS & SEALING SOLUTIONS",
    "",
    textBlock("CUSTOMER DETAILS", customerRows),
    textBlock("REQUIREMENT", requirementRows),
    submission.applicationDetails && `APPLICATION DETAILS\n\n${submission.applicationDetails}`,
    submission.message && `MESSAGE\n\n${submission.message}`,
    attachmentNote,
    `Submitted: ${timestamp}`,
    "Source: AR Hydraulics Website",
  ]
    .filter(Boolean)
    .join("\n\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a6d1f;margin:0 0 4px;">${escapeHtml(
        heading
      )}</p>
      <h1 style="font-size:18px;margin:0 0 16px;">AR Hydraulics &amp; Sealing Solutions</h1>
      ${htmlBlock("Customer Details", customerRows)}
      ${htmlBlock("Requirement", requirementRows)}
      ${
        submission.applicationDetails
          ? `<h2 style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a6d1f;margin:24px 0 8px;">Application Details</h2><p style="font-size:14px;white-space:pre-wrap;margin:0;">${escapeHtml(
              submission.applicationDetails
            )}</p>`
          : ""
      }
      ${
        submission.message
          ? `<h2 style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a6d1f;margin:24px 0 8px;">Message</h2><p style="font-size:14px;white-space:pre-wrap;margin:0;">${escapeHtml(
              submission.message
            )}</p>`
          : ""
      }
      ${attachmentNote ? `<p style="font-size:13px;color:#555;margin:16px 0 0;">${escapeHtml(attachmentNote)}</p>` : ""}
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
      <p style="font-size:12px;color:#777;margin:0;">Submitted: ${escapeHtml(timestamp)}<br/>Source: AR Hydraulics Website</p>
    </div>`;

  return { subject, html, text };
}

export function buildEmailContent(submission: Submission, submittedAt: Date) {
  return submission.formType === "contact" ? buildContact(submission, submittedAt) : buildQuote(submission, submittedAt);
}

interface SendEmailArgs {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  attachments: ParsedAttachment[];
}

// Calls Resend's HTTPS API directly (no SDK) — Workers-compatible fetch(),
// zero new runtime dependency.
export async function sendViaResend(args: SendEmailArgs): Promise<{ ok: true } | { ok: false; status: number }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      reply_to: args.replyTo,
      subject: args.subject,
      html: args.html,
      text: args.text,
      attachments: args.attachments.map((a) => ({ filename: a.filename, content: a.base64 })),
    }),
  });

  if (!res.ok) {
    return { ok: false, status: res.status };
  }
  return { ok: true };
}
