import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center bg-warm px-6 pt-[84px] text-center">
      <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-blue">
        404
      </span>
      <h1 className="mt-5 font-heading text-[16vw] font-semibold uppercase leading-[0.9] tracking-tight text-black sm:text-[10vw] lg:text-[7vw]">
        PAGE NOT FOUND.
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Head back home or
        explore our services.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="secondary">
          Back to Home
        </Button>
        <Button href="/services" variant="outline" magnetic={false}>
          Explore Services
        </Button>
      </div>
      <Link href="/contact" className="mt-8 text-[13px] font-semibold uppercase tracking-[0.1em] text-charcoal/60 hover:text-blue">
        Or Contact Us
      </Link>
    </section>
  );
}
