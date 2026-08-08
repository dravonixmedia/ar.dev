export default function HeroGraphic() {
  return (
    <svg viewBox="0 0 600 700" fill="none" className="h-full w-full">
      <line x1="60" y1="60" x2="60" y2="640" stroke="#100F0D" strokeWidth="1" strokeDasharray="2 8" opacity="0.25" />
      <line x1="540" y1="60" x2="540" y2="640" stroke="#100F0D" strokeWidth="1" strokeDasharray="2 8" opacity="0.25" />

      {/* Cylinder body */}
      <rect x="120" y="280" width="260" height="90" rx="10" fill="#100F0D" />
      <rect x="120" y="280" width="120" height="90" rx="10" fill="#F6C515" />
      <rect x="380" y="305" width="120" height="40" fill="#100F0D" />
      <rect x="500" y="298" width="46" height="54" rx="6" stroke="#100F0D" strokeWidth="3" />
      <circle cx="523" cy="325" r="9" fill="#F0411E" />

      {/* base mount */}
      <rect x="90" y="270" width="30" height="110" rx="6" fill="#34363A" />

      {/* Floating seal ring */}
      <g transform="translate(430 130)">
        <circle cx="0" cy="0" r="46" stroke="#100F0D" strokeWidth="4" />
        <circle cx="0" cy="0" r="26" stroke="#F0411E" strokeWidth="8" opacity="0.85" />
      </g>

      {/* Floating hex bolt */}
      <g transform="translate(110 150)">
        <polygon
          points="24,0 44,12 44,36 24,48 4,36 4,12"
          fill="none"
          stroke="#100F0D"
          strokeWidth="3"
        />
        <circle cx="24" cy="24" r="8" fill="#F6C515" />
      </g>

      {/* Technical dimension lines */}
      <line x1="120" y1="410" x2="380" y2="410" stroke="#100F0D" strokeWidth="1" />
      <line x1="120" y1="400" x2="120" y2="420" stroke="#100F0D" strokeWidth="1" />
      <line x1="380" y1="400" x2="380" y2="420" stroke="#100F0D" strokeWidth="1" />

      <circle cx="230" cy="540" r="2.5" fill="#100F0D" />
      <circle cx="260" cy="540" r="2.5" fill="#100F0D" opacity="0.5" />
      <circle cx="290" cy="540" r="2.5" fill="#100F0D" opacity="0.25" />

      <path
        d="M80 560 Q300 610 520 560"
        stroke="#F0411E"
        strokeWidth="1.5"
        strokeDasharray="3 8"
        opacity="0.6"
      />
    </svg>
  );
}
