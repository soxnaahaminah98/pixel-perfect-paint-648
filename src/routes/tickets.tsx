import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { changerStatutTicket, useTickets, type StatutTicket } from "@/lib/tickets-store";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Tickets — ParcIT" }] }),
  component: Tickets,
});

const statuts: StatutTicket[] = ["Ouvert", "En cours", "Résolu"];

function Tickets() {
  const tickets = useTickets();

  return (
    <SiteLayout>
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">Tickets</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Incidents créés depuis l'Assistant IT. Stockés localement dans ce navigateur.
          </p>

          {tickets.length === 0 ? (
            <p className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Aucun ticket pour le moment. Posez une question à l'Assistant IT depuis{" "}
              <Link to="/suivi" className="font-semibold text-primary underline">
                la page Équipements
              </Link>{" "}
              puis cliquez sur « Créer un ticket ».
            </p>
          ) : (
            <ul className="mt-8 space-y-3">
              {tickets.map((t) => (
                <li key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {t.id} · {t.titre || "Sans titre"}
                    </p>
                    <select
                      value={t.statut}
                      onChange={(e) => changerStatutTicket(t.id, e.target.value as StatutTicket)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                      aria-label={`Statut du ticket ${t.id}`}
                    >
                      {statuts.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.equipementId ? `Équipement ${t.equipementId} · ` : ""}Priorité {t.priorite} ·{" "}
                    {new Date(t.creeLe).toLocaleString("fr-FR")}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{t.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
