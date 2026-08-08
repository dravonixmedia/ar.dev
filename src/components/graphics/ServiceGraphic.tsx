type GraphicKind = "hydraulic" | "mobile" | "sealing" | "machining" | "fabrication" | "roofing";

const stroke = "currentColor";

function HydraulicSvg() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
      <rect x="60" y="170" width="200" height="60" rx="6" stroke={stroke} strokeWidth="2" />
      <rect x="60" y="170" width="90" height="60" rx="6" fill="currentColor" opacity="0.12" />
      <line x1="260" y1="200" x2="330" y2="200" stroke={stroke} strokeWidth="10" />
      <rect x="330" y="185" width="30" height="30" stroke={stroke} strokeWidth="2" />
      <circle cx="345" cy="200" r="6" fill="currentColor" />
      <line x1="60" y1="130" x2="60" y2="270" stroke={stroke} strokeWidth="2" />
      <line x1="40" y1="150" x2="60" y2="170" stroke={stroke} strokeWidth="2" />
      <line x1="40" y1="250" x2="60" y2="230" stroke={stroke} strokeWidth="2" />
      <path d="M100 300 Q200 340 300 300" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.5" />
      <circle cx="200" cy="80" r="3" fill="currentColor" />
      <circle cx="230" cy="80" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="260" cy="80" r="3" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function MobileSvg() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
      <rect x="70" y="220" width="180" height="60" rx="4" stroke={stroke} strokeWidth="2" />
      <path d="M250 230 h50 l30 30 v20 h-80 z" stroke={stroke} strokeWidth="2" />
      <circle cx="120" cy="290" r="18" stroke={stroke} strokeWidth="2" />
      <circle cx="240" cy="290" r="18" stroke={stroke} strokeWidth="2" />
      <line x1="90" y1="220" x2="90" y2="180" stroke={stroke} strokeWidth="2" />
      <line x1="90" y1="180" x2="150" y2="140" stroke={stroke} strokeWidth="2" />
      <circle cx="150" cy="140" r="5" fill="currentColor" />
      <path d="M60 120 L100 100 L140 120" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <line x1="40" y1="330" x2="360" y2="330" stroke={stroke} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function SealingSvg() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
      <circle cx="200" cy="200" r="90" stroke={stroke} strokeWidth="2" />
      <circle cx="200" cy="200" r="55" stroke={stroke} strokeWidth="10" opacity="0.15" />
      <circle cx="200" cy="200" r="55" stroke={stroke} strokeWidth="2" />
      <circle cx="200" cy="110" r="4" fill="currentColor" />
      <circle cx="290" cy="200" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="200" cy="290" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="110" cy="200" r="4" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

function MachiningSvg() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
      <line x1="60" y1="200" x2="340" y2="200" stroke={stroke} strokeWidth="2" />
      <rect x="90" y="180" width="60" height="40" stroke={stroke} strokeWidth="2" />
      <rect x="150" y="188" width="90" height="24" stroke={stroke} strokeWidth="2" />
      <rect x="240" y="192" width="40" height="16" stroke={stroke} strokeWidth="2" />
      <circle cx="120" cy="140" r="3" fill="currentColor" />
      <circle cx="120" cy="150" r="3" fill="currentColor" opacity="0.5" />
      <path d="M280 200 l30 -20 M280 200 l30 20" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function FabricationSvg() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
      <line x1="80" y1="300" x2="80" y2="120" stroke={stroke} strokeWidth="2" />
      <line x1="320" y1="300" x2="320" y2="120" stroke={stroke} strokeWidth="2" />
      <line x1="80" y1="120" x2="320" y2="120" stroke={stroke} strokeWidth="2" />
      <line x1="80" y1="210" x2="320" y2="210" stroke={stroke} strokeWidth="1.5" opacity="0.4" />
      <line x1="80" y1="120" x2="320" y2="210" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <line x1="320" y1="120" x2="80" y2="210" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <line x1="60" y1="300" x2="340" y2="300" stroke={stroke} strokeWidth="3" />
    </svg>
  );
}

function RoofingSvg() {
  return (
    <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
      <path d="M60 260 L200 130 L340 260" stroke={stroke} strokeWidth="2" />
      <line x1="200" y1="130" x2="200" y2="260" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <line x1="130" y1="195" x2="270" y2="195" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <line x1="60" y1="260" x2="340" y2="260" stroke={stroke} strokeWidth="2" />
      <line x1="90" y1="260" x2="90" y2="300" stroke={stroke} strokeWidth="2" />
      <line x1="310" y1="260" x2="310" y2="300" stroke={stroke} strokeWidth="2" />
      <line x1="140" y1="163" x2="140" y2="260" stroke={stroke} strokeWidth="1" opacity="0.3" />
      <line x1="260" y1="163" x2="260" y2="260" stroke={stroke} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

const map: Record<GraphicKind, () => React.JSX.Element> = {
  hydraulic: HydraulicSvg,
  mobile: MobileSvg,
  sealing: SealingSvg,
  machining: MachiningSvg,
  fabrication: FabricationSvg,
  roofing: RoofingSvg,
};

export default function ServiceGraphic({
  kind,
  className,
}: {
  kind: GraphicKind;
  className?: string;
}) {
  const Graphic = map[kind];
  return <div className={className}>{Graphic()}</div>;
}
