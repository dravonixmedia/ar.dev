// Hero-only (sits directly over raw video, never over a light background),
// so it's styled light/warm-white at reduced opacity rather than the dark
// charcoal used for on-light-background text elsewhere on the site.
export default function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 opacity-[0.65] ${className ?? ""}`} aria-hidden="true">
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-warm [writing-mode:vertical-rl]">
        Scroll Down
      </span>
      <span className="relative h-16 w-px overflow-hidden bg-white/30">
        <span className="absolute inset-x-0 top-0 h-1/2 w-full animate-scroll-indicator bg-yellow" />
      </span>
    </div>
  );
}
