"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import ImageReveal from "@/components/ui/ImageReveal";
import ServiceGraphic from "@/components/graphics/ServiceGraphic";
import type { MediaAsset } from "@/config/media";
import { cn } from "@/lib/utils";

type GraphicKind = "hydraulic" | "mobile" | "sealing" | "machining" | "fabrication" | "roofing";

interface CinematicMediaProps {
  asset: MediaAsset;
  /** Small uppercase label shown on the placeholder (e.g. service/category name). */
  placeholderLabel?: string;
  /** Icon shown on the placeholder when no final photo is available yet. */
  placeholderIcon?: GraphicKind;
  className?: string;
  /** Rounded-corner / border classes for the outer frame. */
  frameClassName?: string;
  overlay?: "none" | "soft" | "strong";
  parallax?: boolean;
  hoverScale?: boolean;
  cursor?: string;
  cursorLabel?: string;
  cursorSurface?: "dark" | "light";
  sizes?: string;
}

/**
 * Single source of truth for every primary 16:9 media moment on the site.
 * Renders the supplied photo when mediaConfig has one, otherwise a
 * same-aspect-ratio placeholder — so a future image drop never reflows
 * the page around it.
 */
export default function CinematicMedia({
  asset,
  placeholderLabel,
  placeholderIcon,
  className,
  frameClassName,
  overlay = "none",
  parallax = false,
  hoverScale = false,
  cursor,
  cursorLabel,
  cursorSurface,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: CinematicMediaProps) {
  const objectPositionVars = {
    "--cm-op-mobile": asset.mobileObjectPosition ?? asset.desktopObjectPosition ?? "center",
    "--cm-op-desktop": asset.desktopObjectPosition ?? "center",
  } as CSSProperties;

  return (
    <ImageReveal
      className={cn("relative aspect-video w-full overflow-hidden", frameClassName, className)}
      direction={asset.revealDirection ?? "up"}
      parallax={parallax}
    >
      <div
        className="group/cm relative h-full w-full"
        data-cursor={cursor}
        data-cursor-label={cursorLabel}
        data-cursor-surface={cursorSurface}
      >
        {asset.src ? (
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            priority={asset.priority}
            sizes={sizes}
            style={objectPositionVars}
            className={cn(
              "cm-image object-cover transition-transform duration-700 ease-out",
              hoverScale && "group-hover/cm:scale-[1.05]"
            )}
          />
        ) : (
          <MediaPlaceholder label={placeholderLabel} icon={placeholderIcon} />
        )}

        {overlay !== "none" && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0",
              overlay === "strong"
                ? "bg-gradient-to-t from-black/75 via-black/15 to-transparent"
                : "bg-gradient-to-t from-black/45 via-transparent to-transparent"
            )}
          />
        )}
      </div>
    </ImageReveal>
  );
}

function MediaPlaceholder({ label, icon }: { label?: string; icon?: GraphicKind }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden border border-border bg-grey">
      <div className="absolute inset-0 opacity-[0.07] cm-placeholder-grid" aria-hidden="true" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-yellow/50" aria-hidden="true" />
      <div className="absolute bottom-0 left-[18%] h-1/2 w-px bg-black/10" aria-hidden="true" />
      {icon && (
        <div className="relative h-14 w-14 text-black/15 sm:h-16 sm:w-16">
          <ServiceGraphic kind={icon} className="h-full w-full" />
        </div>
      )}
      {label && (
        <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
          {label}
        </span>
      )}
    </div>
  );
}
