import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AlertTriangle, MapPin, Radio, User, Wrench } from "lucide-react";
import { AssistantIT } from "@/components/AssistantIT";
import { SiteLayout } from "@/components/SiteLayout";
import { StatutBadge } from "@/components/StatutBadge";
import {
  nomComplet,
  trouverUtilisateur,
  utilisateurs,
  type Statut,
  type TypeEquipement,
} from "@/data/equipements";
import {
  compter,
  ilYa,
  maintenanceEnRetard,
  mettreAJour,
  useEquipements,
  useMaintenant,
  type EquipementLive,
} from "@/lib/parc-store";

const searchSchema = z.object({
  vue: z.enum(["utilisateur", "technicien"]).optional().catch(undefined),
});

export const Route = createFileRoute("/suivi")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Suivi des équipements en temps réel — ParcIT" },
      {
        name: "description",
        content:
          "Suivez en direct l'état des équipements informatiques de Plan International Sénégal : en service, en panne ou en maintenance.",
      },
      { property: "og:title", content: "Suivi des équipements en temps réel — ParcIT" },
      {
        property: "og:description",
        content: "Mon parc pour les employés, suivi complet et mise à jour des statuts pour les techniciens IT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Suivi,
});

const filtres: ("Tous" | TypeEquipement)[] = ["Tous", "Laptop", "PC Fixe", "Imprimante"];
const statuts: Statut[] = ["En service", "En panne", "En maintenance"];

function Suivi() {
  const { vue } = Route.useSearch();
  const technicien = vue === "technicien";
  const equipements = useEquipements();
  const now = useMaintenant();
  const [filtre, setFiltre] = useState<(typeof filtres)[number]>("Tous");
  const [userId, setUserId] = useState<string>(vue === "utilisateur" ? "U001" : "");

  const liste = useMemo(
    () =>
      equipements.filter(
        (e) => (filtre === "Tous" || e.type === filtre) && (!userId || e.utilisateurId === userId),
      ),
    [equipements, filtre, userId],
  );
  const c = compter(liste);

  return (
    <SiteLayout>
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                {technicien ? "Suivi des équipements — Vue technicien" : "Suivi des équipements"}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Radio className="size-4 animate-pulse text-success" /> En direct · {liste.length} équipement
                {liste.length > 1 ? "s" : ""} · {c.service} en service · {c.panne} en panne · {c.maintenance} en
                maintenance
              </p>
            </div>
            <div className="flex rounded-lg border border-border bg-card p-1 text-sm">
              <Link
                to="/suivi"
                search={{ vue: "utilisateur" }}
                className={"rounded-md px-3 py-1.5 font-medium " + (!technicien ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
              >
                Utilisateur
              </Link>
              <Link
                to="/suivi"
                search={{ vue: "technicien" }}
                className={"rounded-md px-3 py-1.5 font-medium " + (technicien ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
              >
                Technicien IT
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {filtres.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFiltre(f)}
                  className={
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                    (filtre === f
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-primary")
                  }
                >
                  {f}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              Mon espace
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
              >
                <option value="">Tous les utilisateurs</option>
                {utilisateurs.map((u) => (
                  <option key={u.id} value={u.id}>
                    {nomComplet(u)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {liste.map((e) => (
              <Carte key={e.id} e={e} now={now} technicien={technicien} />
            ))}
            {liste.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun équipement pour ces critères.</p>
            )}
          </div>

          <AssistantIT />
        </div>
      </section>
    </SiteLayout>
  );
}

function Carte({ e, now, technicien }: { e: EquipementLive; now: number; technicien: boolean }) {
  const u = trouverUtilisateur(e.utilisateurId);
  const retard = maintenanceEnRetard(e.maintenance, now);
  const [edition, setEdition] = useState(false);
  const [statut, setStatut] = useState<Statut>(e.statut);
  const [obs, setObs] = useState("");

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {e.id} · {e.type}
          </p>
          <h2 className="mt-1 text-base font-semibold text-foreground">{e.modele}</h2>
        </div>
        <div className="text-right">
          <StatutBadge statut={e.statut} />
          <p className="mt-1 text-xs text-muted-foreground">{ilYa(e.majLe, now)}</p>
        </div>
      </div>

      {retard && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-warning/15 px-3 py-2 text-xs font-medium text-warning">
          <AlertTriangle className="size-4 shrink-0" />
          {e.maintenance ? "Dernière maintenance il y a plus de 180 jours" : "Aucune maintenance enregistrée"}
        </p>
      )}

      <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" /> {e.site}
        </p>
        <p className="flex items-center gap-2">
          <User className="size-4 text-primary" /> {nomComplet(u)} · {u?.service}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
        <div><dt className="font-medium text-foreground">N° de série</dt><dd>{e.serie}</dd></div>
        <div><dt className="font-medium text-foreground">OS</dt><dd>{e.os ?? "—"}</dd></div>
        <div><dt className="font-medium text-foreground">Acquisition</dt><dd>{e.acquisition}</dd></div>
        <div><dt className="font-medium text-foreground">Dernière maintenance</dt><dd>{e.maintenance ?? "—"}</dd></div>
        <div className="col-span-2"><dt className="font-medium text-foreground">Observations</dt><dd>{e.observations ?? "—"}</dd></div>
      </dl>

      {technicien && (
        <div className="mt-4 border-t border-border pt-4">
          {!edition ? (
            <button
              type="button"
              onClick={() => { setStatut(e.statut); setEdition(true); }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
            >
              <Wrench className="size-4" /> Changer le statut
            </button>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(ev) => {
                ev.preventDefault();
                mettreAJour(e.id, statut, obs.slice(0, 300));
                setObs("");
                setEdition(false);
              }}
            >
              <select
                value={statut}
                onChange={(ev) => setStatut(ev.target.value as Statut)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {statuts.map((s) => <option key={s}>{s}</option>)}
              </select>
              <textarea
                value={obs}
                maxLength={300}
                onChange={(ev) => setObs(ev.target.value)}
                placeholder="Ajouter une observation (facultatif)"
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  Enregistrer
                </button>
                <button type="button" onClick={() => setEdition(false)} className="rounded-lg border border-border px-4 py-2 text-sm">
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </article>
  );
}
