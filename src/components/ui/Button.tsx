import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MagneticButton from "./MagneticButton";

type Variant = "primary" | "secondary" | "outline" | "outlineLight" | "ghost";

type Size = "md" | "sm";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  type?: "button" | "submit";
  cursor?: string;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-olive-deep text-yellow group-hover:bg-yellow group-hover:text-black",
  secondary: "bg-yellow text-black group-hover:bg-olive-deep group-hover:text-yellow",
  outline:
    "bg-transparent text-black border border-black/20 group-hover:bg-olive-deep group-hover:text-yellow group-hover:border-olive-deep",
  outlineLight:
    "bg-transparent text-white border border-white/25 group-hover:bg-yellow group-hover:text-black group-hover:border-yellow",
  ghost: "bg-transparent text-black border border-black/0",
};

const fillColor: Record<Variant, string> = {
  primary: "bg-yellow",
  secondary: "bg-olive-deep",
  outline: "bg-olive-deep",
  outlineLight: "bg-yellow",
  ghost: "bg-yellow",
};

// Cursor ring colour is chosen for contrast against the button's own
// resting surface (a "black button" gets a yellow ring, a "yellow button"
// gets a dark ring) rather than the ambient section theme, since a
// button's own colour can differ from what's around it.
const cursorSurface: Partial<Record<Variant, "dark" | "light">> = {
  primary: "dark",
  secondary: "light",
};

const sizeClasses: Record<Size, string> = {
  md: "gap-3 px-7 py-4 text-[13px] tracking-[0.08em]",
  sm: "gap-2 px-5 py-3 text-[12px] tracking-[0.06em]",
};

function ButtonInner({
  children,
  variant = "primary",
  size = "md",
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-full font-semibold uppercase transition-colors duration-500",
        sizeClasses[size],
        variantClasses[variant]
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 origin-center scale-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100",
          fillColor[variant]
        )}
      />
      <span className="relative z-10">{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </span>
  );
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  type = "button",
  cursor = "link",
  external = false,
}: ButtonProps) {
  const content = (
    <span
      className={cn("group inline-block", className)}
      data-cursor={cursor}
      data-cursor-surface={cursorSurface[variant]}
    >
      {href ? (
        external ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
            <ButtonInner variant={variant} size={size}>{children}</ButtonInner>
          </a>
        ) : (
          <Link href={href} className="inline-block">
            <ButtonInner variant={variant} size={size}>{children}</ButtonInner>
          </Link>
        )
      ) : (
        <button type={type} onClick={onClick} className="inline-block">
          <ButtonInner variant={variant} size={size}>{children}</ButtonInner>
        </button>
      )}
    </span>
  );

  if (!magnetic) return content;

  return <MagneticButton>{content}</MagneticButton>;
}
