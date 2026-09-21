"use client";

import { cloneElement, isValidElement, useRef, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { services } from "@/lib/data/services";
import { productFamilies } from "@/lib/data/products";
import { submitEnquiry } from "@/lib/submitEnquiry";
import Turnstile, { type TurnstileHandle } from "./Turnstile";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Kept in sync with worker/util.ts — the server enforces these limits
// authoritatively; this is only for immediate, friendlier client feedback.
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 15 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

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
type Status = "idle" | "submitting" | "success" | "error";

function inputClass(hasError?: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-black placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-error/40 ${
    hasError ? "border-error" : "border-border"
  }`;
}

function extensionOf(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) {
      setFiles([]);
      setFileError("");
      return;
    }

    if (selected.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} files.`);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const invalidType = selected.find((f) => !ALLOWED_EXTENSIONS.includes(extensionOf(f.name)));
    if (invalidType) {
      setFileError("Only JPG, PNG, WEBP and PDF files are accepted.");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const oversized = selected.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setFileError("Each file must be 5 MB or smaller.");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const totalSize = selected.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      setFileError("Total attachments must be 15 MB or smaller.");
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileError("");
    setFiles(selected);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;

    setStatus("submitting");

    const data = new FormData();
    data.set("formType", "quote");
    data.set("fullName", form.fullName);
    data.set("companyName", form.companyName);
    data.set("phone", form.phone);
    data.set("whatsapp", form.whatsapp);
    data.set("email", form.email);
    data.set("location", form.location);
    data.set("serviceRequired", form.serviceRequired);
    data.set("productRequired", form.productRequired);
    data.set("equipmentBrand", form.equipmentBrand);
    data.set("equipmentModel", form.equipmentModel);
    data.set("partNumber", form.partNumber);
    data.set("dimensions", form.dimensions);
    data.set("applicationDetails", form.applicationDetails);
    data.set("message", form.message);
    data.set("turnstileToken", turnstileToken);
    data.set("website", honeypotRef.current?.value ?? "");
    for (const file of files) {
      data.append("attachments", file);
    }

    const ok = await submitEnquiry(data);
    turnstileRef.current?.reset();
    setTurnstileToken("");

    if (ok) {
      setStatus("success");
      setForm(initialState);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-border bg-white p-8 text-center sm:col-span-2">
        <p className="text-[15px] font-semibold text-black">
          Thank you. Your enquiry has been submitted successfully. Our team will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6">
        <Field id="quote-full-name" label="Full Name" required error={errors.fullName}>
          <input
            className={inputClass(!!errors.fullName)}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field id="quote-company-name" label="Company Name" error={errors.companyName}>
          <input
            className={inputClass()}
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            autoComplete="organization"
          />
        </Field>
      </div>

      <Field id="quote-phone" label="Phone" required error={errors.phone}>
        <input
          className={inputClass(!!errors.phone)}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          type="tel"
          autoComplete="tel"
        />
      </Field>
      <Field id="quote-whatsapp" label="WhatsApp Number" error={errors.whatsapp}>
        <input
          className={inputClass()}
          value={form.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
          type="tel"
        />
      </Field>

      <Field id="quote-email" label="Email" required error={errors.email}>
        <input
          className={inputClass(!!errors.email)}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          type="email"
          autoComplete="email"
        />
      </Field>
      <Field id="quote-location" label="Location" error={errors.location}>
        <input
          className={inputClass()}
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="City / Site"
        />
      </Field>

      <Field id="quote-service-required" label="Service Required" required error={errors.serviceRequired}>
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
      <Field id="quote-product-required" label="Product Required" error={errors.productRequired}>
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

      <Field id="quote-equipment-brand" label="Equipment Brand" error={errors.equipmentBrand}>
        <input className={inputClass()} value={form.equipmentBrand} onChange={(e) => update("equipmentBrand", e.target.value)} />
      </Field>
      <Field id="quote-equipment-model" label="Equipment Model" error={errors.equipmentModel}>
        <input className={inputClass()} value={form.equipmentModel} onChange={(e) => update("equipmentModel", e.target.value)} />
      </Field>

      <Field id="quote-part-number" label="Part Number" error={errors.partNumber}>
        <input className={inputClass()} value={form.partNumber} onChange={(e) => update("partNumber", e.target.value)} />
      </Field>
      <Field id="quote-dimensions" label="Dimensions" error={errors.dimensions}>
        <input className={inputClass()} value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} placeholder="e.g. Bore x Rod x Stroke" />
      </Field>

      <div className="sm:col-span-2">
        <Field id="quote-application-details" label="Application Details" error={errors.applicationDetails}>
          <input
            className={inputClass()}
            value={form.applicationDetails}
            onChange={(e) => update("applicationDetails", e.target.value)}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field id="quote-message" label="Message" required error={errors.message}>
          <textarea
            className={inputClass(!!errors.message)}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={5}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="quote-attachments" className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
          Attach Files (product photo, seal photo, equipment plate, drawing)
        </label>
        <input
          id="quote-attachments"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
          className="block w-full text-[13px] text-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-olive-deep file:px-5 file:py-2.5 file:text-[12px] file:font-semibold file:uppercase file:tracking-[0.08em] file:text-yellow"
        />
        <p className="mt-2 text-[12px] text-charcoal/60">
          JPG, PNG, WEBP or PDF — up to {MAX_FILES} files, 5 MB each, 15 MB total.
        </p>
        {fileError && (
          <p role="alert" className="mt-1.5 text-[12px] text-error">
            {fileError}
          </p>
        )}
        {!fileError && files.length > 0 && (
          <p className="mt-1.5 text-[12px] text-charcoal/60">{files.length} file(s) selected.</p>
        )}
      </div>

      <div className="sm:col-span-2 flex items-start gap-3">
        <input
          id="quote-consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-blue"
        />
        <label htmlFor="quote-consent" className="text-[13px] leading-relaxed text-charcoal">
          I consent to AR Hydraulics and Sealing Solutions contacting me regarding this enquiry
          using the details provided above.
        </label>
      </div>
      {errors.consent && <p role="alert" className="sm:col-span-2 -mt-3 text-[12px] text-error">{errors.consent}</p>}

      {TURNSTILE_SITE_KEY && (
        <div className="sm:col-span-2">
          <Turnstile ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} />
        </div>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          data-cursor="link"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-3 rounded-full bg-olive-deep px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-yellow transition-colors hover:bg-yellow hover:text-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-olive-deep disabled:hover:text-yellow"
        >
          {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {status === "submitting" ? "Submitting…" : ""}
        </span>
        {status === "error" && (
          <p role="alert" className="mt-4 max-w-lg text-[12px] leading-relaxed text-error">
            We couldn&apos;t submit your enquiry right now. Please try again or contact us via WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactElement<{ id?: string }>;
}) {
  return (
    <div className="mb-6 sm:mb-0">
      <label htmlFor={id} className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {isValidElement(children) ? cloneElement(children, { id }) : children}
      {error && <p role="alert" className="mt-1.5 text-[12px] text-error">{error}</p>}
    </div>
  );
}
