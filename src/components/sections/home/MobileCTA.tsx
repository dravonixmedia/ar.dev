import { Phone, MessageCircle, Wrench } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";
import { getServiceBySlug } from "@/lib/data/services";

export default function MobileCTA() {
  const service = getServiceBySlug("mobile-hydraulic-works")!;

  return (
    <section className="relative overflow-hidden bg-yellow py-24 lg:py-28">
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 opacity-15 lg:block">
        <ServiceGraphic kind="mobile" className="h-full w-full text-black" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Mobile Hydraulic Support
          </span>
          <TextReveal
            as="h2"
            lines={["HYDRAULIC PROBLEM", "AT YOUR SITE?"]}
            className="mt-4 font-heading text-[11vw] font-semibold uppercase leading-[0.94] tracking-tight text-black sm:text-[7vw] lg:text-[4.4vw]"
          />
          <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-black/75">
            Contact our team for mobile hydraulic and on-site technical support for applicable
            equipment, component and maintenance requirements.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={buildTelUrl()}
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-yellow"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <a
              href={buildWhatsappUrl(service.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-transparent px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
            <Button href="/quote" variant="primary" magnetic={false}>
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Request Mobile Service
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
