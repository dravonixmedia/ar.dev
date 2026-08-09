import { Phone, MessageCircle, Wrench } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";
import { getServiceBySlug } from "@/lib/data/services";
import { mediaConfig } from "@/config/media";

export default function MobileHydraulicCTA() {
  const service = getServiceBySlug("mobile-hydraulic-works")!;

  return (
    <section className="relative overflow-hidden bg-yellow py-20 lg:py-24">
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/60">
              Mobile Hydraulic Solutions
            </span>
            <TextReveal
              as="h2"
              lines={["ON-SITE SUPPORT", "WHERE THE WORK", "HAPPENS."]}
              className="mt-4 font-heading text-[9vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[6vw] lg:text-[3.4vw]"
            />
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-black/75">
              Equipment down on site? Our mobile hydraulic team attends for inspection, fault
              finding and repair assistance — wherever the work is.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={buildWhatsappUrl(service.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                data-cursor-surface="dark"
                className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-yellow"
              >
                <Wrench className="h-4 w-4" /> Request Mobile Service
              </a>
              <a
                href={buildTelUrl()}
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-transparent px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-black"
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
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <CinematicMedia
              asset={mediaConfig.services.mobile}
              placeholderLabel="Mobile Hydraulic Works"
              placeholderIcon="mobile"
              frameClassName="rounded-2xl"
              cursor="explore"
              cursorLabel="Explore"
              cursorSurface="light"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
