"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { services } from "@/lib/data/services";
import { contact } from "@/lib/data/site";

interface FormState {
  name: string;
  phone: string;
  email: string;
  serviceCategory: string;
  message: string;
  consent: boolean;
}

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  serviceCategory: "",
  message: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function inputClass(hasError?: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-black placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-orange/40 ${
    hasError ? "border-orange" : "border-border"
  }`;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "redirecting">("idle");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Please add a short message.";
    if (!form.consent) next.consent = "Consent is required to submit this enquiry.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("redirecting");

    const lines = [
      `Contact Enquiry — AR Hydraulics and Sealing Solutions`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      form.serviceCategory && `Service Category: ${form.serviceCategory}`,
      ``,
      `Message:`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const subject = encodeURIComponent(`Contact Enquiry — ${form.name}`);
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
            Name <span className="text-orange">*</span>
          </label>
          <input className={inputClass(!!errors.name)} value={form.name} onChange={(e) => update("name", e.target.value)} />
          {errors.name && <p className="mt-1.5 text-[12px] text-orange">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
            Phone <span className="text-orange">*</span>
          </label>
          <input className={inputClass(!!errors.phone)} value={form.phone} onChange={(e) => update("phone", e.target.value)} type="tel" />
          {errors.phone && <p className="mt-1.5 text-[12px] text-orange">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
          Email <span className="text-orange">*</span>
        </label>
        <input className={inputClass(!!errors.email)} value={form.email} onChange={(e) => update("email", e.target.value)} type="email" />
        {errors.email && <p className="mt-1.5 text-[12px] text-orange">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
          Service Category
        </label>
        <select
          className={inputClass()}
          value={form.serviceCategory}
          onChange={(e) => update("serviceCategory", e.target.value)}
        >
          <option value="">Select a service (optional)</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/70">
          Message <span className="text-orange">*</span>
        </label>
        <textarea className={inputClass(!!errors.message)} value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} />
        {errors.message && <p className="mt-1.5 text-[12px] text-orange">{errors.message}</p>}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="contact-consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-orange"
        />
        <label htmlFor="contact-consent" className="text-[13px] leading-relaxed text-charcoal">
          I consent to AR Hydraulics and Sealing Solutions contacting me regarding this enquiry.
        </label>
        {errors.consent && <p className="text-[12px] text-orange">{errors.consent}</p>}
      </div>

      <div>
        <button
          type="submit"
          data-cursor="link"
          className="inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-yellow transition-colors hover:bg-yellow hover:text-black"
        >
          {status === "redirecting" ? "Opening Your Email App…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
