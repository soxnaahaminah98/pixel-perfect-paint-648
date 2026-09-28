import type { Statut } from "@/data/equipements";

const styles: Record<Statut, { wrap: string; dot: string }> = {
  "En service": { wrap: "bg-success/12 text-success", dot: "bg-success" },
  "En panne": { wrap: "bg-destructive/12 text-destructive", dot: "bg-destructive" },
  "En maintenance": { wrap: "bg-warning/15 text-warning", dot: "bg-warning" },
};

export function StatutBadge({ statut }: { statut: Statut }) {
  const s = styles[statut];
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold " + s.wrap}>
      <span className={"size-2 rounded-full " + s.dot} />
      {statut}
    </span>
  );
}
