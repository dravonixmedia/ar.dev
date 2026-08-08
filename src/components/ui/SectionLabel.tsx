import { cn } from "@/lib/utils";

export default function SectionLabel({
  children,
  className,
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={cn("h-[6px] w-[6px] rounded-full", light ? "bg-yellow" : "bg-orange")} />
      <span
        className={cn(
          "text-[12px] font-semibold uppercase tracking-[0.22em]",
          light ? "text-yellow" : "text-charcoal"
        )}
      >
        {children}
      </span>
    </div>
  );
}
