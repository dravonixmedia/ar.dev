import Image from "next/image";
import { cn } from "@/lib/utils";

// The official DEV GROUP logo, supplied as artwork and rendered exactly as
// provided — no redraw, recolour, or distortion. On dark backgrounds it sits
// on a plain white plate (a layout treatment around the mark, not an edit to
// the artwork itself) so it stays legible.
export default function DevGroupLogo({
  className,
  size = 40,
  onDark = false,
}: {
  className?: string;
  size?: number;
  onDark?: boolean;
}) {
  const image = (
    <Image
      src="/brand/dev-group-logo.png"
      alt="DEV Group"
      width={size}
      height={size}
      className="h-full w-auto object-contain"
      priority
    />
  );

  if (!onDark) {
    return (
      <span className={cn("inline-flex shrink-0", className)} style={{ height: size }}>
        {image}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-md bg-white p-1.5", className)}
      style={{ height: size }}
    >
      {image}
    </span>
  );
}
