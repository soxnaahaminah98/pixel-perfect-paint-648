import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, User } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { equipements, type TypeEquipement } from "@/data/equipements";

export const Route = createFileRoute("/inventaire")({
  head: () => ({
    meta: [
      { title: "Inventaire des équipements — ParcIT" },
      {
        name: "description",
        content:
          "Consultez les équipements informatiques de Plan International Sénégal : état, site, utilisateur affecté et dernière maintenance.",
      },
      { property: "og:title", content: "Inventaire des équipements — ParcIT" },
      {
        property: "og:description",
        content: "État, affectation et maintenance de chaque ordinateur, imprimante et smartphone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inventaire,
});

const filtres: { key: string; label: string; types: TypeEquipement[] | null }[] = [
  { key: "tous", label: "Tous", types: null },
  { key: "ordis", label: "Ordinateurs", types: ["Laptop", "PC Fixe"] },
  { key: "imprimantes", label: "Imprimantes", types: ["Imprimante"] },
  { key: "smartphones", label: "Smartphones", types: ["Smartphone"] },
];

function Inventaire() {
  const [actif, setActif] = useState("tous");

  const liste = useMemo(() => {
    const f = filtres.find((x) => x.key === actif);
    if (!f?.types) return equipements;
    return equipements.filter((e) => f.types!.includes(e.type));
  }, [actif]);

  return (
    <SiteLayout>
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Inventaire des équipements
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {liste.length} équipement{liste.length > 1 ? "s" : ""} affiché
            {liste.length > 1 ? "s" : ""} · sites de Dakar et Kaolack
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {filtres.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActif(f.key)}
                className={
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                  (actif === f.key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:text-primary")
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {liste.map((e) => {
              const dispo = e.statut === "En service";
              return (
                <article
                  key={e.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {e.type}
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-foreground">{e.nom}</h2>
                    </div>
                    <div className="text-right">
                      <span
                        className={
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold " +
                          (dispo
                            ? "bg-success/12 text-success"
                            : "bg-destructive/12 text-destructive")
                        }
                      >
                        <span
                          className={
                            "size-2 rounded-full " + (dispo ? "bg-success" : "bg-destructive")
                          }
                        />
                        {dispo ? "Disponible" : "Indisponible"}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">{e.statut}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" /> {e.site}
                    </p>
                    <p className="flex items-center gap-2">
                      <User className="size-4 text-primary" /> {e.utilisateur} · {e.service}
                    </p>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                    <div>
                      <dt className="font-medium text-foreground">ID</dt>
                      <dd>{e.id}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">N° de série</dt>
                      <dd>{e.serie}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">OS</dt>
                      <dd>{e.os ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Acquisition</dt>
                      <dd>{e.acquisition}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Dernière maintenance</dt>
                      <dd>{e.maintenance ?? "Aucune maintenance"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-foreground">Observations</dt>
                      <dd>{e.observations ?? "—"}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
