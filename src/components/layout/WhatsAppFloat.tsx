"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { services } from "@/lib/data/services";
import { buildWhatsappUrl, defaultWhatsappMessage } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  const pathname = usePathname();

  const matchedService = services.find((s) => pathname.includes(s.slug));
  const message = matchedService?.whatsappMessage ?? defaultWhatsappMessage;

  return (
    <a
      href={buildWhatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      data-cursor-label="Chat"
      data-cursor-surface="light"
      className="group fixed bottom-8 right-8 z-40 hidden h-14 items-center gap-0 overflow-hidden rounded-full border border-black/10 bg-yellow px-0 shadow-[0_12px_30px_-10px_rgba(16,15,13,0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-3 hover:bg-black hover:px-5 lg:flex"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center">
        <MessageCircle className="h-6 w-6 text-black transition-colors group-hover:text-yellow" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.12em] text-yellow opacity-0 transition-all duration-500 group-hover:max-w-[220px] group-hover:opacity-100 group-hover:pr-1">
        WhatsApp Enquiry
      </span>
    </a>
  );
}
