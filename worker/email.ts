import { escapeHtml } from "./util";
import type { ContactSubmission, QuoteSubmission, Submission } from "./types";

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

// Zoho Mail's send-message API has no per-message Reply-To (or custom
// header) parameter — only fromAddress/toAddress/ccAddress/bccAddress/
// subject/content/mailFormat/attachments are documented, and the API's
// only reply-to mechanism is an account-level "update reply-to address"
// setting, not something that can vary per outgoing message. So instead
// of a real Reply-To header, the notification gives staff a one-click
// mailto: link straight to the customer, built only from `submission.email`
// — which has already passed isValidEmail()'s whitespace-excluding regex
// in worker/enquiry.ts before this ever runs, so it cannot contain a CR,
// LF, or any other header/URL-breaking whitespace. escapeHtml() below is
// still applied to the assembled mailto: URL as defense in depth, in case
// the local/domain part ever contains an HTML-attribute-breaking
// character that regex alone wouldn't catch.
function buildMailtoLink(email: string, subject: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
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

// Contact info goes first and is visually emphasised — this is how staff
// reach the customer back. The "Email" row renders as a mailto: link
// (mailtoHref, from buildMailtoLink above) rather than plain text, since
// Reply-To can't be set on the notification itself — see buildMailtoLink.
function htmlContactBlock(rows: Row[], mailtoHref: string): string {
  const present = rows.filter((r) => r.value);
  if (present.length === 0) return "";
  const rowsHtml = present
    .map((r) => {
      const value =
        r.label === "Email"
          ? `<a href="${escapeHtml(mailtoHref)}" style="color:#111;text-decoration:underline;">${escapeHtml(r.value)}</a>`
          : escapeHtml(r.value);
      return `<tr><td style="padding:5px 12px 5px 0;color:#555;white-space:nowrap;vertical-align:top;font-weight:600;">${escapeHtml(
        r.label
      )}</td><td style="padding:5px 0;color:#111;font-weight:600;">${value}</td></tr>`;
    })
    .join("");
  return `
    <div style="background:#fdf6e3;border:1px solid #e8d9a0;border-radius:8px;padding:16px 20px;margin:0 0 20px;">
      <h2 style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a6d1f;margin:0 0 10px;">Customer Contact</h2>
      <table role="presentation" style="border-collapse:collapse;width:100%;font-size:15px;">${rowsHtml}</table>
    </div>`;
}

// A visually prominent button-style link near the top of the email, right
// next to the heading — the fastest path for staff to reply, without
// having to scan down to the contact table and copy the address by hand.
function replyToCustomerButton(mailtoHref: string): string {
  return `<a href="${escapeHtml(
    mailtoHref
  )}" style="display:inline-block;margin:0 0 16px;padding:10px 18px;border-radius:999px;background:#1f2937;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;">Reply to Customer</a>`;
}

function buildContact(submission: ContactSubmission, submittedAt: Date) {
  const subject = "New Website Enquiry — AR Hydraulics";
  const heading = "NEW WEBSITE ENQUIRY — GENERAL CONTACT FORM";

  const contactRows: Row[] = [
    { label: "Name", value: submission.name },
    { label: "Email", value: submission.email },
    { label: "Phone", value: submission.phone },
  ];
  const requirementRows: Row[] = [{ label: "Service", value: submission.serviceCategory }];
  const timestamp = formatTimestamp(submittedAt);
  const mailtoHref = buildMailtoLink(submission.email, "Re: Website Enquiry — AR Hydraulics");

  const text = [
    heading,
    "AR HYDRAULICS & SEALING SOLUTIONS",
    "",
    textBlock("CUSTOMER CONTACT", contactRows),
    textBlock("REQUIREMENT", requirementRows),
    submission.message && `MESSAGE\n\n${submission.message}`,
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
      ${replyToCustomerButton(mailtoHref)}
      ${htmlContactBlock(contactRows, mailtoHref)}
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

  const contactRows: Row[] = [
    { label: "Name", value: submission.fullName },
    { label: "Email", value: submission.email },
    { label: "Phone", value: submission.phone },
    { label: "WhatsApp", value: submission.whatsapp },
    { label: "Location", value: submission.location },
  ];
  const requirementRows: Row[] = [
    { label: "Company", value: submission.companyName },
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
  const mailtoHref = buildMailtoLink(submission.email, "Re: Quote Request — AR Hydraulics");

  const text = [
    heading,
    "AR HYDRAULICS & SEALING SOLUTIONS",
    "",
    textBlock("CUSTOMER CONTACT", contactRows),
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
      ${replyToCustomerButton(mailtoHref)}
      ${htmlContactBlock(contactRows, mailtoHref)}
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

// Returns both an HTML and a plain-text rendering. Only `html` is actually
// transmitted (Zoho's send-message API takes one `mailFormat` with a single
// `content` field, not an html+text multipart pair) — `text` is kept for
// our own tests/diagnostics and as groundwork if a future format needs it.
export function buildEmailContent(submission: Submission, submittedAt: Date) {
  return submission.formType === "contact" ? buildContact(submission, submittedAt) : buildQuote(submission, submittedAt);
}
