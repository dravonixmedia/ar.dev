export default function TechLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <line x1="0" y1="20" x2="1200" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" />
      {Array.from({ length: 13 }).map((_, i) => (
        <circle key={i} cx={i * 100} cy={20} r={i % 3 === 0 ? 3 : 1.6} fill="currentColor" />
      ))}
    </svg>
  );
}
