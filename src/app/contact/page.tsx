import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { contact, formatAddress, addressMapQuery } from "@/lib/data/site";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";
import { mediaConfig } from "@/config/media";
import { defaultOgImage } from "@/lib/data/seo";

const title = "Contact AR Hydraulics | Kollam, Kerala";
const description =
  "Contact AR Hydraulics and Sealing Solutions at East Kallada, Kollam, Kerala — call, WhatsApp, email or send an enquiry.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, images: [defaultOgImage] },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        label="Get In Touch"
        lines={["LET'S DISCUSS YOUR", "REQUIREMENT."]}
        intro="Reach out by phone, WhatsApp, email or the form below — our team will respond with the right next step."
      />

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="mb-14 overflow-hidden rounded-3xl border border-border">
            <CinematicMedia
              asset={mediaConfig.company.exterior}
              placeholderLabel="AR Hydraulics Workshop, Kollam"
              frameClassName="rounded-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col gap-6 lg:col-span-4">
              <a href={buildTelUrl()} data-cursor="link" className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/60">Phone</span>
                  <span className="mt-1 block text-[15px] font-semibold text-black">{contact.phone}</span>
                </div>
              </a>
              <a
                href={buildWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6"
              >
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/60">WhatsApp</span>
                  <span className="mt-1 block text-[15px] font-semibold text-black">{contact.phone}</span>
                </div>
              </a>
              <a href={`mailto:${contact.email}`} data-cursor="link" className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/60">Email</span>
                  <span className="mt-1 block text-[15px] font-semibold text-black">{contact.email}</span>
                </div>
              </a>
              {contact.addresses.map((address) => (
                <div key={address.key} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                  <div>
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.1em] text-charcoal/60">
                      {address.label}
                    </span>
                    <span className="mt-1 block text-[15px] font-semibold text-black">
                      {formatAddress(address)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-border bg-white p-8 lg:p-12">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {contact.addresses.map((address) => (
              <div key={address.key}>
                <h2 className="mb-4 font-heading text-[13px] font-semibold uppercase tracking-[0.1em] text-charcoal/60">
                  {address.label}
                </h2>
                <div className="overflow-hidden rounded-3xl border border-border">
                  <iframe
                    title={`AR Hydraulics and Sealing Solutions — ${address.label}`}
                    src={`https://www.google.com/maps?q=${addressMapQuery(address)}&output=embed`}
                    className="h-[360px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
