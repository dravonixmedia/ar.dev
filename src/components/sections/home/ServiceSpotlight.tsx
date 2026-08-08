import type { ServiceItem } from "@/types";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function splitHeadline(headline: string): string[] {
  const words = headline.split(" ");
  if (words.length <= 2) return [headline];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default function ServiceSpotlight({
  service,
  reverse = false,
  tint = "bg-grey",
}: {
  service: ServiceItem;
  reverse?: boolean;
  tint?: string;
}) {
  return (
    <section className="bg-warm py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className={cn("lg:col-span-5", reverse ? "lg:order-2" : "lg:order-1")}>
            <ImageReveal
              className={cn("aspect-[4/5] w-full rounded-2xl", tint)}
              direction={reverse ? "right" : "left"}
            >
              <div className="flex h-full w-full items-center justify-center p-12 text-black/50">
                <ServiceGraphic kind={service.graphic} className="h-full w-full" />
              </div>
            </ImageReveal>
          </div>

          <div className={cn("lg:col-span-7", reverse ? "lg:order-1" : "lg:order-2")}>
            <SectionLabel>
              {service.number} — {service.title}
            </SectionLabel>

            <TextReveal
              as="h2"
              lines={splitHeadline(service.headline)}
              className="mt-6 font-heading text-[8vw] font-semibold uppercase leading-[0.98] tracking-tight text-black sm:text-[5vw] lg:text-[2.6vw]"
            />

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-charcoal">
              {service.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {service.items.slice(0, 8).map((item) => (
                <span key={item} className="flex items-center gap-2 text-[13px] text-charcoal">
                  <span className="h-1 w-1 rounded-full bg-orange" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <Button href={`/services/${service.slug}`} variant="primary">
                {service.ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
