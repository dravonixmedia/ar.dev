"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { services } from "@/lib/data/services";
import { productFamilies } from "@/lib/data/products";
import { contact } from "@/lib/data/site";

interface FormState {
  fullName: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  serviceRequired: string;
  productRequired: string;
  equipmentBrand: string;
  equipmentModel: string;
  partNumber: string;
  dimensions: string;
  applicationDetails: string;
  message: string;
  consent: boolean;
}

const initialState: FormState = {
  fullName: "",
  companyName: "",
  phone: "",
  whatsapp: "",
  email: "",
  location: "",
  serviceRequired: "",
  productRequired: "",
  equipmentBrand: "",
  equipmentModel: "",
  partNumber: "",
  dimensions: "",
  applicationDetails: "",
  message: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function inputClass(hasError?: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-black placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-error/40 ${
    hasError ? "border-error" : "border-border"
  }`;
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [fileNote, setFileNote] = useState("");
  const [status, setStatus] = useState<"idle" | "redirecting">("idle");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.serviceRequired) next.serviceRequired = "Select a service.";
    if (!form.message.trim()) next.message = "Please describe your requirement.";
    if (!form.consent) next.consent = "Consent is required to submit this enquiry.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === "redirecting") return;
    if (!validate()) return;

    setStatus("redirecting");

    const lines = [
      `Quote Request — AR Hydraulics and Sealing Solutions`,
      ``,
      `Full Name: ${form.fullName}`,
      form.companyName && `Company: ${form.companyName}`,
      `Phone: ${form.phone}`,
      form.whatsapp && `WhatsApp: ${form.whatsapp}`,
      `Email: ${form.email}`,
      form.location && `Location: ${form.location}`,
      `Service Required: ${form.serviceRequired}`,
      form.productRequired && `Product Required: ${form.productRequired}`,
      form.equipmentBrand && `Equipment Brand: ${form.equipmentBrand}`,
      form.equipmentModel && `Equipment Model: ${form.equipmentModel}`,
      form.partNumber && `Part Number: ${form.partNumber}`,
      form.dimensions && `Dimensions: ${form.dimensions}`,
      form.applicationDetails && `Application Details: ${form.applicationDetails}`,
      ``,
      `Message:`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = encodeURIComponent(`Quote Request — ${form.fullName}`);
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    // If no mail client is configured, the browser never navigates away and
    // the button would otherwise stay disabled/stuck forever — reset after
    // a few seconds so the form is usable again either way.
    window.setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6">
        <Field label="Full Name" required error={errors.fullName}>
          <input
            className={inputClass(!!errors.fullName)}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Company Name" error={errors.companyName}>
          <input
            className={inputClass()}
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            autoComplete="organization"
          />
        </Field>
      </div>

      <Field label="Phone" required error={errors.phone}>
        <input
          className={inputClass(!!errors.phone)}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          type="tel"
          autoComplete="tel"
        />
      </Field>
      <Field label="WhatsApp Number" error={errors.whatsapp}>
        <input
          className={inputClass()}
          value={form.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
          type="tel"
        />
      </Field>

      <Field label="Email" required error={errors.email}>
        <input
          className={inputClass(!!errors.email)}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          type="email"
          autoComplete="email"
        />
      </Field>
      <Field label="Location" error={errors.location}>
        <input
          className={inputClass()}
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="City / Site"
        />
      </Field>

      <Field label="Service Required" required error={errors.serviceRequired}>
        <select
          className={inputClass(!!errors.serviceRequired)}
          value={form.serviceRequired}
          onChange={(e) => update("serviceRequired", e.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Product Required" error={errors.productRequired}>
        <select
          className={inputClass()}
          value={form.productRequired}
          onChange={(e) => update("productRequired", e.target.value)}
        >
          <option value="">Select a product family (optional)</option>
          {productFamilies.map((p) => (
            <option key={p.slug} value={p.title}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Equipment Brand" error={errors.equipmentBrand}>
        <input className={inputClass()} value={form.equipmentBrand} onChange={(e) => update("equipmentBrand", e.target.value)} />
      </Field>
      <Field label="Equipment Model" error={errors.equipmentModel}>
        <input className={inputClass()} value={form.equipmentModel} onChange={(e) => update("equipmentModel", e.target.value)} />
      </Field>

      <Field label="Part Number" error={errors.partNumber}>
        <input className={inputClass()} value={form.partNumber} onChange={(e) => update("partNumber", e.target.value)} />
      </Field>
      <Field label="Dimensions" error={errors.dimensions}>
        <input className={inputClass()} value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} placeholder="e.g. Bore x Rod x Stroke" />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Application Details" error={errors.applicationDetails}>
          <input
            className={inputClass()}
            value={form.applicationDetails}
            onChange={(e) => update("applicationDetails", e.target.value)}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field label="Message" required error={errors.message}>
          <textarea
            className={inputClass(!!errors.message)}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={5}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
          Attach Files (product photo, seal photo, equipment plate, drawing)
        </label>
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(e) =>
            setFileNote(
              e.target.files && e.target.files.length > 0
                ? `${e.target.files.length} file(s) selected — attachments require the email/WhatsApp step below since this form has no backend configured yet.`
                : ""
            )
          }
          className="block w-full text-[13px] text-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-olive-deep file:px-5 file:py-2.5 file:text-[12px] file:font-semibold file:uppercase file:tracking-[0.08em] file:text-yellow"
        />
        {fileNote && <p className="mt-2 text-[12px] text-charcoal/60">{fileNote}</p>}
      </div>

      <div className="sm:col-span-2 flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-blue"
        />
        <label htmlFor="consent" className="text-[13px] leading-relaxed text-charcoal">
          I consent to AR Hydraulics and Sealing Solutions contacting me regarding this enquiry
          using the details provided above.
        </label>
      </div>
      {errors.consent && <p role="alert" className="sm:col-span-2 -mt-3 text-[12px] text-error">{errors.consent}</p>}

      <div className="sm:col-span-2">
        <button
          type="submit"
          data-cursor="link"
          disabled={status === "redirecting"}
          className="inline-flex items-center gap-3 rounded-full bg-olive-deep px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-yellow transition-colors hover:bg-yellow hover:text-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-olive-deep disabled:hover:text-yellow"
        >
          {status === "redirecting" ? "Opening Your Email App…" : "Submit Enquiry"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {status === "redirecting" ? "Opening your email app…" : ""}
        </span>
        <p className="mt-4 max-w-lg text-[12px] leading-relaxed text-charcoal/60">
          Submitting opens your email app with the enquiry pre-filled to {contact.email}, since a
          server-side form endpoint is not yet configured for this site. For a faster response,
          you can also send the same details directly via WhatsApp.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 sm:mb-0">
      <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="mt-1.5 text-[12px] text-error">{error}</p>}
    </div>
  );
}
