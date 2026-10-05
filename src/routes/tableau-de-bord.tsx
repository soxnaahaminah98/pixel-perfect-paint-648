import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Printer, QrCode, Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { StatutBadge } from "@/components/StatutBadge";
import { AlerteBadge, PrioriteBadge } from "@/components/Badges";
import { QrDialog } from "@/components/QrDialog";
import { VignetteEquipement } from "@/components/EquipementVisuel";
import { nomComplet, trouverUtilisateur, type Statut } from "@/data/equipements";
import { useEquipements, type EquipementLive } from "@/lib/parc-store";
import {
  DATE_REFERENCE,
  alerteMaintenance,
  couleurSante,
  indicateurs,
  priorite,
} from "@/lib/parc-metrics";

export const Route = createFileRoute("/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord du parc — ParcIT" },
      {
        name: "description",
        content: "Santé du parc informatique, statuts, alertes de maintenance et rapport imprimable.",
      },
    ],
  }),
  component: TableauDeBord,
});

const COULEURS: Record<Statut, string> = {
  "En service": "var(--success)",
  "En panne": "var(--destructive)",
  "En maintenance": "var(--accent)",
};

function Jauge({ score }: { score: number }) {
  const r = 70;
  const demi = Math.PI * r;
  const plein = (score / 100) * demi;
  const couleur = couleurSante(score);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 105" className="w-full max-w-[260px]" role="img" aria-label={`Santé du parc : ${score} sur 100`}>
        <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="var(--muted)" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M 20 90 A 70 70 0 0 1 160 90"
          fill="none"
          stroke={couleur}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${plein} ${demi}`}
        />
        <text x="90" y="80" textAnchor="middle" className="fill-navy text-[34px] font-extrabold">
          {score}
        </text>
        <text x="90" y="98" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          sur 100
        </text>
      </svg>
      <p className="mt-1 text-sm font-semibold" style={{ color: couleur }}>
        {score > 80 ? "Parc en bonne santé" : score >= 50 ? "Vigilance requise" : "Situation critique"}
      </p>
    </div>
  );
}

function TableauDeBord() {
  const equipements = useEquipements();
  const ind = indicateurs(equipements);
  const [recherche, setRecherche] = useState("");
  const [site, setSite] = useState("");
  const [statut, setStatut] = useState("");
  const [service, setService] = useState("");
  const [alerteFiltre, setAlerteFiltre] = useState("");
  const [qr, setQr] = useState<EquipementLive | null>(null);

  const lignes = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return equipements
      .map((e) => {
        const u = trouverUtilisateur(e.utilisateurId);
        return { e, u, alerte: alerteMaintenance(e), prio: priorite(e) };
      })
      .filter(
        ({ e, u, alerte }) =>
          (!site || e.site === site) &&
          (!statut || e.statut === statut) &&
          (!service || u?.service === service) &&
          (!alerteFiltre || alerte === alerteFiltre) &&
          (!q ||
            `${e.id} ${e.type} ${e.modele} ${e.serie} ${nomComplet(u)}`.toLowerCase().includes(q)),
      );
  }, [equipements, recherche, site, statut, service, alerteFiltre]);

  const parStatut = (["En service", "En panne", "En maintenance"] as Statut[]).map((s) => ({
    name: s,
    value: equipements.filter((e) => e.statut === s).length,
  }));
  const sites = [...new Set(equipements.map((e) => e.site))];
  const parSite = sites.map((s) => ({ name: s, value: equipements.filter((e) => e.site === s).length }));
  const services = [
    ...new Set(equipements.map((e) => trouverUtilisateur(e.utilisateurId)?.service ?? "—")),
  ];

  const aTraiter = ind.panne + ind.retard;
  const dateTxt = DATE_REFERENCE.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const champ =
    "rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30";

  return (
    <SiteLayout>
      <section className="px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
                Tableau de bord du parc
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Données au {dateTxt}</p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Printer className="size-4" /> Exporter le rapport
            </button>
          </div>

          {aTraiter > 0 && (
            <div className="mt-6 flex flex-col gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-medium text-navy">
                <AlertTriangle className="size-5 shrink-0 text-warning" />
                {ind.panne > 0 && `${ind.panne} équipement${ind.panne > 1 ? "s" : ""} en panne`}
                {ind.panne > 0 && ind.retard > 0 && " · "}
                {ind.retard > 0 &&
                  `${ind.retard} en retard de maintenance (plus de 180 jours)`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatut("");
                  setAlerteFiltre(ind.panne > 0 && ind.retard === 0 ? "" : "En retard");
                  if (ind.retard === 0) setStatut("En panne");
                  document.getElementById("liste")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="no-print text-left font-semibold text-primary hover:underline"
              >
                Voir la liste →
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-sm font-semibold text-navy">Santé du parc</h2>
              <div className="mt-3">
                <Jauge score={ind.sante} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-sm font-semibold text-navy">Répartition des statuts</h2>
              <div className="h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={parStatut} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2}>
                      {parStatut.map((d) => (
                        <Cell key={d.name} fill={COULEURS[d.name as Statut]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {parStatut.map((d) => (
                  <li key={d.name} className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full" style={{ background: COULEURS[d.name as Statut] }} />
                    {d.name} · {d.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="text-sm font-semibold text-navy">Équipements par site</h2>
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={parSite} margin={{ top: 16, right: 8, left: -24, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "var(--muted)" }} />
                    <Bar dataKey="value" name="Équipements" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div id="liste" className="mt-8 scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="no-print flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={recherche}
                  onChange={(ev) => setRecherche(ev.target.value)}
                  placeholder="Rechercher (ID, modèle, utilisateur…)"
                  className={`${champ} w-full pl-9`}
                />
              </div>
              <select value={site} onChange={(ev) => setSite(ev.target.value)} className={champ} aria-label="Site">
                <option value="">Tous les sites</option>
                {sites.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={statut} onChange={(ev) => setStatut(ev.target.value)} className={champ} aria-label="Statut">
                <option value="">Tous les statuts</option>
                <option>En service</option>
                <option>En panne</option>
                <option>En maintenance</option>
              </select>
              <select value={service} onChange={(ev) => setService(ev.target.value)} className={champ} aria-label="Service">
                <option value="">Tous les services</option>
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={alerteFiltre} onChange={(ev) => setAlerteFiltre(ev.target.value)} className={champ} aria-label="Alerte">
                <option value="">Toutes les alertes</option>
                <option>À jour</option>
                <option>En retard</option>
                <option>À planifier</option>
              </select>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">ID</th>
                    <th className="py-2 pr-3 font-semibold">Équipement</th>
                    <th className="py-2 pr-3 font-semibold">Site · Service</th>
                    <th className="py-2 pr-3 font-semibold">Statut</th>
                    <th className="py-2 pr-3 font-semibold">Maintenance</th>
                    <th className="py-2 pr-3 font-semibold">Priorité</th>
                    <th className="no-print py-2 font-semibold">QR</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map(({ e, u, alerte, prio }) => (
                    <tr key={e.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-3 font-semibold text-primary">
                        <Link to="/equipement/$id" params={{ id: e.id }} className="hover:underline">
                          {e.id}
                        </Link>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <VignetteEquipement type={e.type} />
                          <div>
                            <p className="font-medium text-navy">{e.modele}</p>
                            <p className="text-xs text-muted-foreground">{e.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground">
                        {e.site}
                        <br />
                        <span className="text-xs">{u?.service ?? "—"}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <StatutBadge statut={e.statut} />
                      </td>
                      <td className="py-3 pr-3">
                        <AlerteBadge alerte={alerte} />
                      </td>
                      <td className="py-3 pr-3">
                        <PrioriteBadge niveau={prio.niveau} delai={prio.delai} />
                      </td>
                      <td className="no-print py-3">
                        <button
                          type="button"
                          onClick={() => setQr(e)}
                          aria-label={`QR code ${e.id}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-secondary"
                        >
                          <QrCode className="size-4" /> QR
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lignes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Aucun équipement pour ces critères.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {qr && <QrDialog equipement={qr} onClose={() => setQr(null)} />}
    </SiteLayout>
  );
}
