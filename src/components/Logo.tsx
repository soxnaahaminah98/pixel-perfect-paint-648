import { useId } from "react";

// Logo ParcIT : écran + circuit (parc informatique) sur fond dégradé bleu, point ambre = suivi en direct.
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="ParcIT" fill="none">
      <defs>
        <linearGradient id={`${id}-bg`} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#0b5ed7" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="46" rx="12" fill={`url(#${id}-bg)`} />
      <rect x="1" y="1" width="46" height="46" rx="12" stroke="#fff" strokeOpacity=".25" />
      <rect x="10" y="12" width="28" height="19" rx="3.5" stroke="#fff" strokeWidth="2.5" />
      <path d="M18 38h12M24 31v7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M15 24h5l2.5-5 3.5 8 2.5-3H33" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="39" cy="9" r="5" fill="#f59e0b" stroke="#0a2540" strokeWidth="2" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="text-lg font-extrabold leading-none tracking-tight text-white">
        Parc<span className="text-[#f59e0b]">IT</span>
      </span>
    </span>
  );
}
