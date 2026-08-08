import { Phone, Mail, MapPin } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import Button from "@/components/ui/Button";
import { contact } from "@/lib/data/site";

export default function ContactTeaser() {
  return (
    <section className="bg-warm py-24 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 rounded-3xl border border-border bg-white p-10 lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-7">
            <SectionLabel>Get In Touch</SectionLabel>
            <TextReveal
              as="h2"
              lines={["LET'S DISCUSS YOUR", "REQUIREMENT."]}
              className="mt-6 font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[2.8vw]"
            />
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">
                Contact Us
              </Button>
              <Button href="/quote" variant="outline" magnetic={false}>
                Request a Quote
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 border-t border-border pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} data-cursor="link" className="flex items-center gap-3 text-[15px] font-semibold text-black">
              <Phone className="h-5 w-5 text-orange" /> {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} data-cursor="link" className="flex items-center gap-3 text-[15px] font-semibold text-black">
              <Mail className="h-5 w-5 text-orange" /> {contact.email}
            </a>
            <span className="flex items-start gap-3 text-[14px] text-charcoal">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
              {contact.address.line1}, {contact.address.line2}, {contact.address.line3},{" "}
              {contact.address.city}, {contact.address.state}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
