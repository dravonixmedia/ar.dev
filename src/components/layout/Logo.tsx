import Link from "next/link";

// Original text-based lockup — placeholder until the supplied DEV GROUP
// logo artwork is dropped into /public and swapped in here as an <Image>.
export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" data-cursor="link" aria-label="AR Hydraulics and Sealing Solutions — Home">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-orange">
        <span className="text-[15px] font-bold tracking-tight text-white">AR</span>
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-[2px] bg-yellow" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[15px] font-bold tracking-tight ${dark ? "text-white" : "text-black"}`}>
          AR HYDRAULICS
        </span>
        <span className={`text-[10px] font-medium uppercase tracking-[0.2em] ${dark ? "text-white/60" : "text-charcoal/70"}`}>
          Sealing Solutions · DEV Group
        </span>
      </span>
    </Link>
  );
}
