"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import MobileNav from "./MobileNav";
import { primaryNav } from "@/lib/data/nav";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > lastY.current && y > 160) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div
          className={cn(
            "border-b transition-all duration-400",
            scrolled
              ? "border-border bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(16,15,13,0.04)]"
              : // Flat, uniform tint (no gradient/vignette) so nav text and the
                // logo subtitle stay readable over the hero video without a
                // fade — barely visible on other pages, which already sit on
                // this same warm base color.
                "border-transparent bg-warm/35 backdrop-blur-[2px]"
          )}
        >
          <div className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
            <Logo />

            <nav className="hidden items-center gap-6 xl:flex">
              {primaryNav.map((link) =>
                link.children ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-black transition-colors hover:text-blue",
                        pathname.startsWith(link.href) && "text-blue"
                      )}
                      data-cursor="link"
                      aria-expanded={servicesOpen}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>

                    <div
                      className={cn(
                        "absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-4 transition-all duration-300",
                        servicesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-2 opacity-0"
                      )}
                    >
                      <div className="rounded-2xl border border-border bg-white p-3 shadow-[0_20px_60px_-20px_rgba(16,15,13,0.25)]">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            data-cursor="link"
                            className="group flex items-start justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-yellow-soft"
                          >
                            <span>
                              <span className="block text-[13px] font-semibold text-black">
                                {child.label}
                              </span>
                              <span className="mt-0.5 block text-[12px] text-charcoal/70 line-clamp-1">
                                {child.description}
                              </span>
                            </span>
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-cursor="link"
                    className={cn(
                      "text-[13px] font-semibold uppercase tracking-[0.06em] text-black transition-colors hover:text-blue",
                      pathname === link.href && "text-blue"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden xl:block">
                <Button href="/quote" variant="secondary" size="sm" cursor="link">
                  Request a Quote
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 xl:hidden"
                aria-label="Open menu"
                data-cursor="link"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
