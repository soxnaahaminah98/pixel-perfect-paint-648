import type { Equipement, Statut } from "@/data/equipements";

// Date de référence des indicateurs (déterministe pour la démo et les règles de maintenance).
export const DATE_REFERENCE = new Date("2026-09-30T00:00:00Z");
export const SEUIL_RETARD_JOURS = 180;

export type Alerte = "À jour" | "En retard" | "À planifier";
export type Priorite = "Haute" | "Normale" | "Moyenne" | "—";

export function joursDepuisMaintenance(date: string | undefined): number | null {
  if (!date) return null;
  return Math.floor((DATE_REFERENCE.getTime() - new Date(date).getTime()) / 86400000);
}

export function alerteMaintenance(e: Pick<Equipement, "maintenance">): Alerte {
  const j = joursDepuisMaintenance(e.maintenance);
  if (j === null) return "À planifier";
  return j > SEUIL_RETARD_JOURS ? "En retard" : "À jour";
}

export function priorite(e: Pick<Equipement, "statut" | "maintenance">): {
  niveau: Priorite;
  delai: string;
} {
  if (e.statut === "En panne") return { niveau: "Haute", delai: "sous 48 h" };
  if (e.statut === "En maintenance") return { niveau: "Normale", delai: "retour sous 5 jours ouvrés" };
  if (alerteMaintenance(e) === "En retard") return { niveau: "Moyenne", delai: "sous 15 jours" };
  return { niveau: "—", delai: "" };
}

export function indicateurs(list: Pick<Equipement, "statut" | "maintenance" | "site">[]) {
  const nb = (s: Statut) => list.filter((e) => e.statut === s).length;
  const panne = nb("En panne");
  const maintenance = nb("En maintenance");
  const service = nb("En service");
  const retard = list.filter((e) => alerteMaintenance(e) === "En retard").length;
  const aPlanifier = list.filter((e) => alerteMaintenance(e) === "À planifier").length;
  const sante = Math.max(0, Math.min(100, 100 - 15 * panne - 5 * maintenance - 5 * retard));
  return { total: list.length, service, panne, maintenance, retard, aPlanifier, sante };
}

export function couleurSante(score: number): string {
  if (score > 80) return "var(--success)";
  if (score >= 50) return "var(--accent)";
  return "var(--destructive)";
}
