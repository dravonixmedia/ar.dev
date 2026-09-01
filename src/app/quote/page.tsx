import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import QuoteForm from "@/components/forms/QuoteForm";
import { contact, formatAddress } from "@/lib/data/site";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";
import { buildOpenGraph } from "@/lib/data/seo";

const title = "Request a Hydraulic Service Quote";
const description =
  "Request a quote from AR Hydraulics for hydraulic repair, sealing, machining, fabrication or roofing requirements across Kerala.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/quote" },
  openGraph: buildOpenGraph({ path: "/quote", title, description }),
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]}
        label="Request a Quote"
        lines={["TELL US WHAT", "YOU NEED."]}
        intro="Share your requirement and our team will get back with the right solution — repair, product, machining or fabrication."
      />

      <section className="bg-warm py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-border bg-white p-8 lg:p-12">
                <QuoteForm />
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="sticky top-28 flex flex-col gap-6 rounded-3xl border border-border bg-grey p-8">
                <h2 className="font-heading text-[18px] font-semibold uppercase text-black">
                  Prefer To Talk Directly?
                </h2>
                <a href={buildTelUrl()} data-cursor="link" className="flex items-center gap-3 text-[14px] font-semibold text-black">
                  <Phone className="h-5 w-5 shrink-0 text-blue" /> {contact.phone}
                </a>
                <a
                  href={buildWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="flex items-center gap-3 text-[14px] font-semibold text-black"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-blue" /> WhatsApp Enquiry
                </a>
                <div className="flex flex-col gap-3">
                  {contact.addresses.map((address) => (
                    <div key={address.key} className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                      <p className="text-[13px] leading-relaxed text-charcoal">
                        <span className="font-semibold text-black">{address.label}: </span>
                        {formatAddress(address)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
