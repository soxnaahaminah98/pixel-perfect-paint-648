import type { Alerte, Priorite } from "@/lib/parc-metrics";

const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap";

export function AlerteBadge({ alerte }: { alerte: Alerte }) {
  const cls =
    alerte === "À jour"
      ? "bg-success/12 text-success"
      : alerte === "En retard"
        ? "bg-warning/15 text-warning"
        : "bg-muted text-muted-foreground";
  return <span className={`${base} ${cls}`}>{alerte}</span>;
}

export function PrioriteBadge({ niveau, delai }: { niveau: Priorite; delai?: string }) {
  if (niveau === "—") return <span className="text-muted-foreground">—</span>;
  const cls =
    niveau === "Haute"
      ? "bg-destructive/12 text-destructive"
      : niveau === "Moyenne"
        ? "bg-warning/15 text-warning"
        : "bg-primary/10 text-primary";
  return (
    <span className={`${base} ${cls}`} title={delai}>
      {niveau}
      {delai ? <span className="ml-1 font-normal opacity-80">· {delai}</span> : null}
    </span>
  );
}
