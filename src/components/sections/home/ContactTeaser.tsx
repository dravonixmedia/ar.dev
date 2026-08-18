"use client";

import { useEffect, useRef } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import CinematicMedia from "@/components/ui/CinematicMedia";
import { contact } from "@/lib/data/site";
import { mediaConfig } from "@/config/media";
import { ensureGsapRegistered, gsap } from "@/lib/gsapConfig";
import { usePrefersReducedMotion } from "@/lib/hooks/useIsTouchDevice";

export default function ContactTeaser() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const rows = rowsRef.current?.children;
    const cta = ctaRef.current;
    if (!section || !card || !rows || !cta) return;

    if (reducedMotion) {
      gsap.set([card, ...Array.from(rows), cta], { opacity: 1, y: 0 });
      return;
    }

    ensureGsapRegistered();
    const rect = section.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.9;

    const ctx = gsap.context(() => {
      gsap.set(card, { y: 35, opacity: 0 });
      gsap.set(rows, { y: 12, opacity: 0 });
      gsap.set(cta, { y: 16, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: alreadyInView ? undefined : { trigger: section, start: "top 78%", once: true },
      });
      tl.to(card, { y: 0, opacity: 1, duration: 0.7 })
        .to(rows, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.35")
        .to(cta, { y: 0, opacity: 1, duration: 0.5 }, "-=0.25");
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-warm py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="relative">
          <CinematicMedia
            asset={mediaConfig.company.exterior}
            placeholderLabel="AR Hydraulics Workshop, Kollam"
            frameClassName="rounded-3xl"
            overlay="soft"
            parallax
          />

          <div
            ref={cardRef}
            className="relative z-10 mx-auto -mt-16 w-[calc(100%-2rem)] rounded-2xl border border-border bg-white p-8 shadow-[0_30px_80px_-30px_rgba(16,15,13,0.3)] sm:w-[92%] lg:-mt-24 lg:w-[86%] lg:p-12"
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <SectionLabel>Get In Touch</SectionLabel>
                <TextReveal
                  as="h2"
                  lines={["LET'S DISCUSS YOUR", "REQUIREMENT."]}
                  className="mt-6 font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[2.6vw]"
                />
                <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
                  <Button href="/contact" variant="primary">
                    Contact Us
                  </Button>
                  <Button href="/quote" variant="outline" magnetic={false}>
                    Request a Quote
                  </Button>
                </div>
              </div>

              <div
                ref={rowsRef}
                className="flex flex-col justify-center gap-5 border-t border-border pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
              >
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  data-cursor="link"
                  className="flex items-center gap-3 text-[15px] font-semibold text-black"
                >
                  <Phone className="h-5 w-5 text-orange" /> {contact.phone}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  data-cursor="link"
                  className="flex items-center gap-3 text-[15px] font-semibold text-black"
                >
                  <Mail className="h-5 w-5 text-orange" /> {contact.email}
                </a>
                <span className="flex items-start gap-3 text-[14px] text-charcoal">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                  {contact.address.line2}, {contact.address.line3},{" "}
                  {contact.address.city}, {contact.address.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
