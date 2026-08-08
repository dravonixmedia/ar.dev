export default function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`} aria-hidden="true">
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-charcoal [writing-mode:vertical-rl]">
        Scroll Down
      </span>
      <span className="relative h-16 w-px overflow-hidden bg-black/15">
        <span className="absolute inset-x-0 top-0 h-1/2 w-full animate-scroll-indicator bg-orange" />
      </span>
    </div>
  );
}
