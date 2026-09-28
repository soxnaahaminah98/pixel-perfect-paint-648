import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { equipementsInitiaux } from "@/data/equipements";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & signalement de panne — ParcIT" },
      {
        name: "description",
        content:
          "Contactez le Service IT de Plan International Sénégal pour signaler une panne ou demander une maintenance.",
      },
      { property: "og:title", content: "Contact & signalement de panne — ParcIT" },
      {
        property: "og:description",
        content: "Écrivez au Service IT du bureau national de Dakar via le formulaire ParcIT.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").max(100, "100 caractères maximum"),
  email: z.string().trim().email("Adresse e-mail invalide").max(255),
  telephone: z
    .string()
    .trim()
    .min(6, "Numéro trop court")
    .max(20, "Numéro trop long")
    .regex(/^[0-9+\s().-]+$/, "Numéro invalide"),
  equipement: z.string().max(10),
  message: z.string().trim().min(1, "Le message est requis").max(1000, "1000 caractères maximum"),
});

type Champs = z.infer<typeof schema>;
const vide: Champs = { nom: "", email: "", telephone: "", equipement: "", message: "" };

function Contact() {
  const [valeurs, setValeurs] = useState<Champs>(vide);
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Champs, string>>>({});
  const [envoye, setEnvoye] = useState(false);

  const champ = (k: keyof Champs) => ({
    value: valeurs[k],
    onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValeurs((v) => ({ ...v, [k]: ev.target.value }));
      setEnvoye(false);
    },
  });

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const res = schema.safeParse(valeurs);
    if (!res.success) {
      const errs: Partial<Record<keyof Champs, string>> = {};
      for (const issue of res.error.issues) {
        const key = issue.path[0] as keyof Champs;
        if (!errs[key]) errs[key] = issue.message;
      }
      setErreurs(errs);
      return;
    }
    setErreurs({});
    setValeurs(vide);
    setEnvoye(true);
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <SiteLayout>
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
              Contacter le Service IT
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signalez une panne ou demandez une maintenance d'équipement.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="nom" className="text-sm font-medium text-foreground">
                  Nom complet
                </label>
                <input id="nom" className={inputClass} maxLength={100} {...champ("nom")} />
                {erreurs.nom && <p className="mt-1 text-xs text-destructive">{erreurs.nom}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  maxLength={255}
                  {...champ("email")}
                />
                {erreurs.email && <p className="mt-1 text-xs text-destructive">{erreurs.email}</p>}
              </div>
              <div>
                <label htmlFor="telephone" className="text-sm font-medium text-foreground">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  type="tel"
                  className={inputClass}
                  maxLength={20}
                  {...champ("telephone")}
                />
                {erreurs.telephone && (
                  <p className="mt-1 text-xs text-destructive">{erreurs.telephone}</p>
                )}
              </div>
              <div>
                <label htmlFor="equipement" className="text-sm font-medium text-foreground">
                  Équipement concerné
                </label>
                <select id="equipement" className={inputClass} {...champ("equipement")}>
                  <option value="">— Aucun / autre demande —</option>
                  {equipementsInitiaux.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.id} · {e.type} {e.modele} ({e.serie})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={inputClass}
                  maxLength={1000}
                  {...champ("message")}
                />
                {erreurs.message && (
                  <p className="mt-1 text-xs text-destructive">{erreurs.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-glow"
              >
                Envoyer
              </button>

              {envoye && (
                <p className="rounded-lg bg-success/12 px-4 py-3 text-sm font-medium text-success">
                  Merci, votre message a bien été enregistré. Le Service IT vous répondra sous 48 h.
                </p>
              )}
            </form>
          </div>

          <aside className="space-y-4 text-sm">
            <div className="rounded-2xl border border-border bg-secondary/50 p-6">
              <h2 className="font-semibold text-primary">Adresse</h2>
              <p className="mt-3 flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                Plan International Sénégal, Dakar, Sénégal
              </p>
              <p className="mt-3 flex items-start gap-2 text-muted-foreground">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <a className="hover:text-primary" href="mailto:mfaye@planinternational.org">
                  mfaye@planinternational.org
                </a>
              </p>
              <p className="mt-3 flex items-start gap-2 text-muted-foreground">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                Service IT — assistance interne
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
