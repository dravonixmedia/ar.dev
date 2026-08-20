import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import DevGroupLogo from "./DevGroupLogo";
import { contact, credentials, sisterConcerns, siteInfo, formatAddress } from "@/lib/data/site";
import { footerServiceLinks } from "@/lib/data/nav";
import { productFamilies } from "@/lib/data/products";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-yellow-soft pb-16 lg:pb-0">
      <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-20 lg:px-10">
        <div className="grid gap-14 border-b border-black/10 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-sm text-[14px] leading-relaxed text-charcoal">
              One workshop, complete industrial solutions — hydraulics, mobile hydraulic works,
              sealing, precision machining, structural fabrication and roofing works.
            </p>
            <div className="flex flex-col gap-2 text-[13px] text-charcoal">
              <a href={buildTelUrl()} data-cursor="link" className="flex items-center gap-2 hover:text-orange">
                <Phone className="h-4 w-4 shrink-0" /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} data-cursor="link" className="flex items-center gap-2 hover:text-orange">
                <Mail className="h-4 w-4 shrink-0" /> {contact.email}
              </a>
              {contact.addresses.map((address) => (
                <span key={address.key} className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-semibold text-black">{address.label}: </span>
                    {formatAddress(address)}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} data-cursor="link" className="text-[14px] text-black hover:text-orange">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sealing-solutions" data-cursor="link" className="text-[14px] font-semibold text-black hover:text-orange">
                  Hydraulic Seals in Kerala
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
              Products
            </h3>
            <ul className="flex flex-col gap-3">
              {productFamilies.map((family) => (
                <li key={family.slug}>
                  <Link href={`/products#${family.slug}`} data-cursor="link" className="text-[14px] text-black hover:text-orange">
                    {family.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/industries" data-cursor="link" className="text-[14px] text-black hover:text-orange">
                  Industries We Serve
                </Link>
              </li>
              <li>
                <Link href="/projects" data-cursor="link" className="text-[14px] text-black hover:text-orange">
                  Our Work
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
                Sister Concerns
              </h3>
              <ul className="flex flex-col gap-3">
                {sisterConcerns.map((c) => (
                  <li key={c.name} className="text-[13px] text-charcoal">
                    <span className="font-semibold text-black">{c.name}</span> — {c.description},{" "}
                    {c.location}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              data-cursor-surface="dark"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-yellow"
            >
              WhatsApp Enquiry
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-[12px] text-charcoal/70">
          <p>
            KLMSME: {credentials.klmsme} · UDYAM: {credentials.udyam} · GSTIN: {credentials.gstin}
          </p>
        </div>
      </div>

      <div className="border-t border-black/10 bg-cream">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 px-6 py-5 text-[12px] text-charcoal/70 lg:flex-row lg:px-10">
          <span>
            © {year} {siteInfo.name}. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <DevGroupLogo size={22} />
            <span>{siteInfo.group}</span>
            <Link href="/privacy-policy" className="hover:text-orange">
              Privacy Policy
            </Link>
            <span className="text-charcoal/30">·</span>
            <a
              href="https://dravonixmedia.com/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="hover:text-orange"
            >
              SEO &amp; Web Design by Dravonix Media Pvt. Ltd.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
