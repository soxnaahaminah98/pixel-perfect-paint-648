import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Bot,
  FileText,
  LayoutDashboard,
  Monitor,
  QrCode,
  Radio,
  Ticket,
} from "lucide-react";
import { AssistantIT } from "@/components/AssistantIT";
import { SiteLayout } from "@/components/SiteLayout";
import { BandeauEquipement, marqueDe } from "@/components/EquipementVisuel";
import { IllustrationParc } from "@/components/IllustrationParc";
import type { TypeEquipement } from "@/data/equipements";
import { useEquipements } from "@/lib/parc-store";
import { indicateurs } from "@/lib/parc-metrics";

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

const TYPES: TypeEquipement[] = ["Laptop", "PC Fixe", "Imprimante", "Smartphone"];

const fonctionnalites = [
  {
    icon: LayoutDashboard,
    titre: "Tableau de bord",
    texte: "Santé du parc, répartition des statuts et alertes en un coup d'œil.",
    to: "/tableau-de-bord",
  },
  {
    icon: QrCode,
    titre: "QR code par équipement",
    texte: "Scannez l'étiquette pour ouvrir la fiche et signaler une panne.",
    to: "/tableau-de-bord",
  },
  {
    icon: Bot,
    titre: "Agent IA",
    texte: "Posez vos questions en français : état, priorité, règle de maintenance.",
    hash: "assistant",
  },
  {
    icon: Ticket,
    titre: "Tickets",
    texte: "Suivi des interventions du signalement à la résolution (bientôt).",
    to: "/contact",
  },
  {
    icon: Bell,
    titre: "Alertes de maintenance",
    texte: "Les équipements en retard de plus de 180 jours sont signalés.",
    to: "/tableau-de-bord",
  },
  {
    icon: FileText,
    titre: "Rapport hebdomadaire",
    texte: "Exportez un rapport imprimable avec les pannes et les retards.",
    to: "/tableau-de-bord",
  },
] as const;

function Accueil() {
  const equipements = useEquipements();
  const ind = indicateurs(equipements);
  const familles = TYPES.map((type) => {
    const liste = equipements.filter((e) => e.type === type);
    return {
      type,
      nombre: liste.length,
      marques: [...new Set(liste.map((e) => marqueDe(e.modele)))],
    };
  }).filter((f) => f.nombre > 0);
  const kpis = [
    { label: "Équipements suivis", value: ind.total, cls: "text-navy", dot: "bg-primary" },
    { label: "En panne", value: ind.panne, cls: "text-destructive", dot: "bg-destructive" },
    { label: "En maintenance", value: ind.maintenance, cls: "text-warning", dot: "bg-warning" },
    {
      label: "En retard (plus de 180 jours)",
      value: ind.retard,
      cls: "text-warning",
      dot: "bg-accent",
    },
  ];

  return (
    <SiteLayout>
      <section className="bg-gradient-hero px-4 py-16 text-primary-foreground md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Monitor className="size-4" /> Plan International Sénégal · Service IT
          </span>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Votre parc informatique, sous contrôle en un clic
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 md:text-lg">
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
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              Je suis technicien IT
            </Link>
            <Link
              to="/tableau-de-bord"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
            >
              <Activity className="size-4" /> Ouvrir le tableau de bord
            </Link>
          </div>
          <IllustrationParc className="mx-auto mt-10 w-full max-w-lg drop-shadow-xl" />
        </div>
      </section>

      <section className="-mt-8 px-4 md:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-5 shadow-card">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Radio className="size-4 animate-pulse text-success" /> En direct
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center md:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl bg-muted p-4">
                <p className={"text-3xl font-bold " + k.cls}>{k.value}</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <span className={"size-2 rounded-full " + k.dot} /> {k.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-14 md:px-6 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy md:text-3xl">
            Votre parc en images
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Ordinateurs portables, postes fixes, imprimantes et smartphones, avec leurs marques.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {familles.map((f) => (
              <div
                key={f.type}
                className="rounded-2xl border border-border bg-card p-5 text-center shadow-card"
              >
                <BandeauEquipement type={f.type} compact />
                <p className="mt-3 text-3xl font-bold text-navy">{f.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {f.nombre > 1 ? "équipements" : "équipement"}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {f.marques.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy md:text-3xl">
            Tout ce qu'il faut pour piloter votre parc
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fonctionnalites.map((f) => {
              const contenu = (
                <>
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-navy">{f.titre}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.texte}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">En savoir plus →</p>
                </>
              );
              const cls =
                "block rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant";
              return "hash" in f ? (
                <Link key={f.titre} to="/" hash={f.hash} className={cls}>
                  {contenu}
                </Link>
              ) : (
                <Link key={f.titre} to={f.to} className={cls}>
                  {contenu}
                </Link>
              );
            })}
          </div>

          <div id="assistant" className="scroll-mt-24">
            <AssistantIT />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
