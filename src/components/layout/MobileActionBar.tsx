"use client";

import Link from "next/link";
import { Phone, MessageCircle, Wrench } from "lucide-react";
import { buildTelUrl, buildWhatsappUrl } from "@/lib/whatsapp";

export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-white/95 backdrop-blur-md lg:hidden">
      <a
        href={buildTelUrl()}
        className="flex flex-1 flex-col items-center gap-1 border-r border-border py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-1 border-r border-border py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>
      <Link
        href="/quote"
        className="flex flex-1 flex-col items-center gap-1 bg-yellow py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-black"
      >
        <Wrench className="h-4 w-4" />
        Request Service
      </Link>
    </div>
  );
}
