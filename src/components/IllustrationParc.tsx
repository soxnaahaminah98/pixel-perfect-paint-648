/** Illustration originale : un poste de travail IT avec ordinateur, imprimante, smartphone et étiquette QR. */
export function IllustrationParc({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 300"
      className={className}
      role="img"
      aria-label="Illustration : ordinateur portable, imprimante, smartphone et étiquette QR sur un bureau"
    >
      <rect x="0" y="0" width="520" height="300" rx="24" fill="rgba(255,255,255,0.08)" />
      {/* bureau */}
      <rect x="30" y="236" width="460" height="14" rx="7" fill="rgba(255,255,255,0.55)" />
      <rect x="70" y="250" width="10" height="36" rx="4" fill="rgba(255,255,255,0.4)" />
      <rect x="440" y="250" width="10" height="36" rx="4" fill="rgba(255,255,255,0.4)" />
      {/* ordinateur portable */}
      <rect x="110" y="96" width="190" height="124" rx="10" fill="#0a2540" stroke="#fff" strokeWidth="4" />
      <rect x="122" y="108" width="166" height="100" rx="4" fill="#133a63" />
      <rect x="134" y="122" width="60" height="8" rx="4" fill="#4ade80" />
      <rect x="134" y="140" width="110" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
      <rect x="134" y="154" width="90" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
      <rect x="134" y="176" width="40" height="16" rx="5" fill="#f59e0b" />
      <rect x="182" y="176" width="40" height="16" rx="5" fill="#ef4444" />
      <path d="M90 220 H320 L306 236 H104 Z" fill="#fff" />
      {/* imprimante */}
      <rect x="338" y="166" width="104" height="54" rx="8" fill="#fff" />
      <rect x="352" y="148" width="76" height="22" rx="3" fill="rgba(255,255,255,0.75)" />
      <rect x="356" y="196" width="68" height="24" rx="2" fill="#dbeafe" />
      <circle cx="426" cy="182" r="4" fill="#22c55e" />
      {/* smartphone */}
      <rect x="236" y="154" width="46" height="82" rx="8" fill="#0a2540" stroke="#fff" strokeWidth="3" transform="translate(70 -12) rotate(8 259 195)" />
      <rect x="244" y="164" width="30" height="54" rx="3" fill="#133a63" transform="translate(70 -12) rotate(8 259 195)" />
      {/* étiquette QR */}
      <g transform="translate(40 120)">
        <rect width="64" height="64" rx="8" fill="#fff" />
        <g fill="#0a2540">
          <rect x="8" y="8" width="16" height="16" />
          <rect x="40" y="8" width="16" height="16" />
          <rect x="8" y="40" width="16" height="16" />
          <rect x="30" y="30" width="8" height="8" />
          <rect x="44" y="40" width="12" height="6" />
          <rect x="30" y="46" width="8" height="10" />
        </g>
      </g>
      {/* pastille d'alerte */}
      <circle cx="318" cy="92" r="20" fill="#ef4444" />
      <text x="318" y="100" textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff">!</text>
    </svg>
  );
}
