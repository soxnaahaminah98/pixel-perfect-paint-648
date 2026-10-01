import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bot, CalendarClock, MapPin, QrCode, Siren, User } from "lucide-react";
import { AssistantIT } from "@/components/AssistantIT";
import { SiteLayout } from "@/components/SiteLayout";
import { StatutBadge } from "@/components/StatutBadge";
import { AlerteBadge, PrioriteBadge } from "@/components/Badges";
import { QrDialog } from "@/components/QrDialog";
import { nomComplet, trouverUtilisateur } from "@/data/equipements";
import { mettreAJour, useEquipements } from "@/lib/parc-store";
import { alerteMaintenance, joursDepuisMaintenance, priorite } from "@/lib/parc-metrics";

export const Route = createFileRoute("/equipement/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Équipement ${params.id} — ParcIT` }],
  }),
  component: FicheEquipement,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy">Équipement introuvable</h1>
        <Link to="/tableau-de-bord" className="mt-4 inline-block font-semibold text-primary">
          Retour au tableau de bord
        </Link>
      </div>
    </SiteLayout>
  ),
});

function FicheEquipement() {
  const { id } = Route.useParams();
  const equipements = useEquipements();
  const e = equipements.find((x) => x.id === id);
  const [qr, setQr] = useState(false);
  const [description, setDescription] = useState("");
  const [urgence, setUrgence] = useState("Normale");
  const [envoye, setEnvoye] = useState(false);
  const [agent, setAgent] = useState(false);

  if (!e) throw notFound();

  const u = trouverUtilisateur(e.utilisateurId);
  const alerte = alerteMaintenance(e);
  const prio = priorite(e);
  const jours = joursDepuisMaintenance(e.maintenance);

  const frise = [
    { date: e.acquisition, texte: "Acquisition de l'équipement" },
    ...(e.maintenance ? [{ date: e.maintenance, texte: "Dernière maintenance" }] : []),
    ...(e.observations ? [{ date: "Actuellement", texte: e.observations }] : []),
  ];

  return (
    <SiteLayout>
      <section className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/tableau-de-bord"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Tableau de bord
          </Link>

          <article className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {e.id} · {e.type}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy">{e.modele}</h1>
              </div>
              <StatutBadge statut={e.statut} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <AlerteBadge alerte={alerte} />
              <PrioriteBadge niveau={prio.niveau} delai={prio.delai} />
            </div>

            <div className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> {e.site}
              </p>
              <p className="flex items-center gap-2">
                <User className="size-4 text-primary" /> {nomComplet(u)} · {u?.service}
              </p>
              <p className="flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" />
                {jours === null ? "Aucune maintenance enregistrée" : `Dernière maintenance il y a ${jours} jours`}
              </p>
              <p>N° de série : {e.serie}{e.os ? ` · ${e.os}` : ""}</p>
            </div>

            <h2 className="mt-6 text-sm font-semibold text-navy">Historique</h2>
            <ol className="mt-3 space-y-3 border-l-2 border-secondary pl-4">
              {frise.map((f) => (
                <li key={f.texte} className="relative">
                  <span className="absolute -left-[22px] top-1.5 size-3 rounded-full border-2 border-card bg-primary" />
                  <p className="text-xs font-semibold text-muted-foreground">{f.date}</p>
                  <p className="text-sm text-navy">{f.texte}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setQr(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"
              >
                <QrCode className="size-4" /> Voir le QR code
              </button>
              <button
                type="button"
                onClick={() => setAgent((v) => !v)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
              >
                <Bot className="size-4" /> Demander à l'agent
              </button>
            </div>
          </article>

          <form
            className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card"
            onSubmit={(ev) => {
              ev.preventDefault();
              if (!description.trim()) return;
              mettreAJour(e.id, "En panne", `[${urgence}] ${description.trim().slice(0, 250)}`);
              setDescription("");
              setEnvoye(true);
            }}
          >
            <h2 className="flex items-center gap-2 text-base font-semibold text-navy">
              <Siren className="size-5 text-destructive" /> Signaler une panne
            </h2>
            <label className="mt-4 block text-sm font-medium text-foreground" htmlFor="desc">
              Description
            </label>
            <textarea
              id="desc"
              rows={3}
              maxLength={250}
              value={description}
              onChange={(ev) => {
                setDescription(ev.target.value);
                setEnvoye(false);
              }}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="Ex : l'écran reste noir au démarrage"
            />
            <label className="mt-3 block text-sm font-medium text-foreground" htmlFor="photo">
              Photo (facultatif)
            </label>
            <input id="photo" type="file" accept="image/*" capture="environment" className="mt-1 block w-full text-sm" />
            <label className="mt-3 block text-sm font-medium text-foreground" htmlFor="urg">
              Urgence
            </label>
            <select
              id="urg"
              value={urgence}
              onChange={(ev) => setUrgence(ev.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Normale</option>
              <option>Haute</option>
              <option>Critique</option>
            </select>
            <button
              type="submit"
              disabled={!description.trim()}
              className="mt-4 w-full rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground disabled:opacity-50"
            >
              Signaler la panne
            </button>
            {envoye && (
              <p className="mt-3 rounded-lg bg-success/12 px-4 py-3 text-sm font-medium text-success">
                Panne enregistrée : l'équipement passe « En panne » (intervention sous 48 h).
              </p>
            )}
          </form>

          {agent && (
            <AssistantIT
              questionInitiale={`Quel est l'état de ${e.modele} (${e.id}) et que faire ?`}
            />
          )}
        </div>
      </section>
      {qr && <QrDialog equipement={e} onClose={() => setQr(false)} />}
    </SiteLayout>
  );
}
