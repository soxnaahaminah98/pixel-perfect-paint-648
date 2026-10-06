import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Bot, QrCode, Ticket } from "lucide-react";
import { AssistantIT } from "@/components/AssistantIT";
import { SiteLayout } from "@/components/SiteLayout";
import { IconeType, marqueDe } from "@/components/EquipementVisuel";
import type { Statut } from "@/data/equipements";
import { useEquipements } from "@/lib/parc-store";
import { indicateurs, joursDepuisMaintenance, SEUIL_RETARD_JOURS } from "@/lib/parc-metrics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ParcIT — Votre parc informatique, sous contrôle" },
      {
        name: "description",
        content:
          "ParcIT centralise l'inventaire, l'affectation et la maintenance des équipements informatiques de Plan International Sénégal.",
      },
      { property: "og:title", content: "ParcIT — Votre parc informatique, sous contrôle" },
      {
        property: "og:description",
        content:
          "Suivez l'état, l'affectation et la maintenance de chaque équipement, du siège de Dakar au bureau de Kaolack.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Accueil,
});

const LED: Record<Statut, { led: string; texte: string; pulse: boolean }> = {
  "En service": { led: "bg-[#2fd47f] shadow-[0_0_8px_#2fd47f]", texte: "text-[#7ee8b0]", pulse: false },
  "En maintenance": { led: "bg-[#f2b33d] shadow-[0_0_8px_#f2b33d]", texte: "text-[#f6cd7a]", pulse: true },
  "En panne": { led: "bg-[#ff5a5a] shadow-[0_0_8px_#ff5a5a]", texte: "text-[#ff9a9a]", pulse: true },
};

const acces = [
  { icon: Activity, titre: "Tableau de bord", texte: "Santé du parc, alertes et rapport imprimable.", to: "/tableau-de-bord" },
  { icon: QrCode, titre: "Étiquettes QR", texte: "Scannez un équipement pour ouvrir sa fiche et signaler une panne.", to: "/suivi" },
  { icon: Ticket, titre: "Tickets", texte: "Suivez chaque intervention, du signalement à la résolution.", to: "/tickets" },
] as const;

function Accueil() {
  const equipements = useEquipements();
  const ind = indicateurs(equipements);
  const kpis = [
    { label: "Équipements suivis", value: ind.total, bar: "border-primary" },
    { label: "En panne", value: ind.panne, bar: "border-destructive" },
    { label: "En maintenance", value: ind.maintenance, bar: "border-accent" },
    { label: `Maintenance > ${SEUIL_RETARD_JOURS} jours`, value: ind.retard, bar: "border-warning" },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Plan International Sénégal · Service IT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Parc informatique</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              État, affectation et maintenance de chaque équipement, du siège de Dakar au bureau de
              Kaolack.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/suivi"
              search={{ vue: "utilisateur" }}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
            >
              Je suis utilisateur
            </Link>
            <Link
              to="/suivi"
              search={{ vue: "technicien" }}
              className="inline-flex items-center rounded-md border border-input bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Je suis technicien IT
            </Link>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Indicateurs">
          {kpis.map((k) => (
            <div key={k.label} className={"rounded-md border-l-4 bg-card px-4 py-3 shadow-card " + k.bar}>
              <p className="font-mono-id text-3xl font-medium">{k.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8" aria-label="Baie des équipements">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Baie des équipements</h2>
            <Link to="/suivi" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Tout voir <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-white/10 overflow-hidden rounded-lg border-2 border-[#243249] bg-[#0e1a2b] text-white">
            {equipements.map((e) => {
              const l = LED[e.statut];
              const j = joursDepuisMaintenance(e.maintenance);
              return (
                <li key={e.id}>
                  <Link
                    to="/equipement/$id"
                    params={{ id: e.id }}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-white/6 md:grid md:grid-cols-[auto_4rem_2rem_1fr_8rem_8rem_9rem] md:gap-x-4"
                  >
                    <span
                      className={"size-2.5 rounded-full " + l.led + (l.pulse ? " led-pulse" : "")}
                      aria-hidden="true"
                    />
                    <span className="font-mono-id text-sm text-white/60 md:order-none">{e.id}</span>
                    <span className="hidden text-white/70 md:block">
                      <IconeType type={e.type} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {e.modele}
                      <span className="ml-2 hidden text-xs font-normal text-white/45 sm:inline">
                        {marqueDe(e.modele)} · {e.type}
                      </span>
                    </span>
                    <span className={"w-full pl-[22px] text-sm font-medium md:w-auto md:pl-0 " + l.texte}>{e.statut}</span>
                    <span className="hidden text-sm text-white/55 md:block">{e.site}</span>
                    <span className="hidden font-mono-id text-xs text-white/45 md:block">
                      {j === null ? "jamais" : `maint. il y a ${j} j`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="assistant" className="mt-10 scroll-mt-6" aria-label="Agent IA">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Bot className="size-5 text-primary" aria-hidden="true" /> Demander à l'agent
          </h2>
          <AssistantIT />
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-3" aria-label="Accès rapide">
          {acces.map((a) => (
            <Link
              key={a.titre}
              to={a.to}
              className="group flex gap-3 rounded-md border border-border bg-card p-4 shadow-card transition-colors hover:border-primary"
            >
              <a.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold group-hover:text-primary">{a.titre}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{a.texte}</span>
              </span>
            </Link>
          ))}
        </section>
      </div>
    </SiteLayout>
  );
}
