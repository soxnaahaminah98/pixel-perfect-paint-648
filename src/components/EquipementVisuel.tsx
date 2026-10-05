import { Laptop, Monitor, Printer, Smartphone, type LucideIcon } from "lucide-react";
import type { TypeEquipement } from "@/data/equipements";

/** Marque = premier mot du modèle (ex. « HP EliteBook 840 » → « HP »). Texte seulement, pas de logo. */
export const marqueDe = (modele: string) => modele.split(" ")[0] ?? modele;

const ICONES: Record<TypeEquipement, LucideIcon> = {
  Laptop,
  "PC Fixe": Monitor,
  Imprimante: Printer,
  Smartphone,
};

const TEINTES: Record<TypeEquipement, string> = {
  Laptop: "from-sky-500 to-blue-700",
  "PC Fixe": "from-indigo-500 to-violet-700",
  Imprimante: "from-emerald-500 to-teal-700",
  Smartphone: "from-amber-500 to-orange-600",
};

export function IconeType({ type, className = "size-5" }: { type: TypeEquipement; className?: string }) {
  const Icone = ICONES[type];
  return <Icone className={className} aria-hidden="true" />;
}

/** Petite vignette pour les tableaux. */
export function VignetteEquipement({ type }: { type: TypeEquipement }) {
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${TEINTES[type]}`}
      title={type}
    >
      <IconeType type={type} className="size-4.5" />
    </span>
  );
}

/** Grande illustration pour la fiche équipement. */
export function BandeauEquipement({
  type,
  modele,
  compact = false,
}: {
  type: TypeEquipement;
  /** Modèle complet ; la marque en est déduite. Ignoré en mode compact. */
  modele?: string;
  /** Mode compact : icône et nom du type, sans marque (pour les cartes d'accueil). */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={`flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br px-3 py-4 text-white ${TEINTES[type]}`}
        role="img"
        aria-label={type}
      >
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/20">
          <IconeType type={type} className="size-8" />
        </span>
        <p className="text-sm font-bold tracking-tight">{type}</p>
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-4 rounded-xl bg-gradient-to-br p-4 text-white ${TEINTES[type]}`}
      role="img"
      aria-label={`${type} ${modele ?? ""}`}
    >
      <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
        <IconeType type={type} className="size-9" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">{type}</p>
        <p className="mt-0.5 text-2xl font-extrabold tracking-tight">{marqueDe(modele ?? type)}</p>
      </div>
    </div>
  );
}
