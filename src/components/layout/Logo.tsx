import Link from "next/link";
import DevGroupLogo from "./DevGroupLogo";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      data-cursor="link"
      aria-label="AR Hydraulics and Sealing Solutions — Home"
    >
      <DevGroupLogo size={42} onDark={dark} />
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
