import { createFileRoute, Link } from "@tanstack/react-router";
import { Monitor, ShieldCheck, Clock, Users, Radio } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { compter, useEquipements } from "@/lib/parc-store";

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

const stats = [
  {
    icon: Users,
    value: "150+",
    label: "utilisateurs équipés sur les sites de Dakar et des régions",
  },
  { icon: Clock, value: "48 h", label: "de délai moyen de remise en service" },
  {
    icon: ShieldCheck,
    value: "100 %",
    label: "des équipements avec numéro de série et date de maintenance tracés",
  },
];

function Accueil() {
  const c = compter(useEquipements());
  const live = [
    { label: "En service", value: c.service, cls: "text-success", dot: "bg-success" },
    { label: "En panne", value: c.panne, cls: "text-destructive", dot: "bg-destructive" },
    { label: "En maintenance", value: c.maintenance, cls: "text-warning", dot: "bg-warning" },
  ];
  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-16 text-primary-foreground md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Monitor className="size-4" /> Plan International Sénégal · Service IT
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Votre parc informatique, sous contrôle en un clic
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/85 md:text-lg">
            Consultez en temps réel l'état de vos équipements informatiques, du siège de Dakar au
            bureau de Kaolack
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to="/suivi"
              search={{ vue: "utilisateur" }}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
            >
              Je suis utilisateur
            </Link>
            <Link
              to="/suivi"
              search={{ vue: "technicien" }}
              className="inline-flex items-center justify-center rounded-lg border border-primary-foreground/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              Je suis technicien IT
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pt-10 md:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Radio className="size-4 animate-pulse text-success" /> En direct
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {live.map((l) => (
              <div key={l.label} className="rounded-xl bg-secondary/50 p-4">
                <p className={"text-3xl font-bold " + l.cls}>{l.value}</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <span className={"size-2 rounded-full " + l.dot} /> {l.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.value}
              className="rounded-2xl border border-border bg-card p-7 text-center shadow-card"
            >
              <s.icon className="mx-auto size-7 text-accent" />
              <p className="mt-4 text-4xl font-bold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

    </SiteLayout>
  );
}
