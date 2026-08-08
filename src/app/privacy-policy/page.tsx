import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { contact, siteInfo } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteInfo.name}.`,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        label="Legal"
        lines={["PRIVACY POLICY"]}
      />
      <section className="bg-warm py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-[15px] leading-relaxed text-charcoal lg:px-10">
          <p>
            {siteInfo.name} ({siteInfo.group}) collects information you submit through our
            enquiry, quote request and contact forms — such as your name, phone number, email
            address, company details and any project or component information you choose to
            share — solely to respond to your enquiry and provide the requested products or
            services.
          </p>
          <p className="mt-6">
            We do not sell or share your information with third parties for marketing purposes.
            Information submitted through this website is sent directly to our team via email or
            WhatsApp and is retained only as needed to handle your enquiry.
          </p>
          <p className="mt-6">
            For any privacy-related questions or requests, contact us at{" "}
            <a href={`mailto:${contact.email}`} className="text-orange underline">
              {contact.email}
            </a>{" "}
            or {contact.phone}.
          </p>
        </div>
      </section>
    </>
  );
}
