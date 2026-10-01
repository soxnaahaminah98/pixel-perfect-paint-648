import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, FlaskConical, Loader2, Play, XCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { TESTS_AGENT, verifier, type TestAgent } from "@/data/tests-agent";
import { interrogerAgent } from "@/lib/dify.functions";
import { creerStore } from "@/lib/store-local";

export const Route = createFileRoute("/tests")({
  head: () => ({ meta: [{ title: "Tests de l'agent — ParcIT" }] }),
  component: Tests,
});

type Resultat = { texte: string; erreur?: boolean; auto: boolean; details: string[]; humain?: "OK" | "KO"; le: string };
const store = creerStore<Record<string, Resultat>>("parcit-tests-v1", {});

function Tests() {
  const resultats = store.useStore();
  const [enCours, setEnCours] = useState<string | null>(null);

  const lancer = async (t: TestAgent) => {
    setEnCours(t.id);
    try {
      const r = await interrogerAgent({ data: { question: t.entree } });
      const texte = r.ok ? r.texte : r.message;
      const v = r.ok ? verifier(t, texte) : { auto: false, details: ["Erreur d'appel"] };
      store.ecrire({ ...store.lire(), [t.id]: { texte, erreur: !r.ok, ...v, le: new Date().toISOString() } });
    } finally {
      setEnCours(null);
    }
  };

  const toutLancer = async () => {
    // Pause entre les tests : le plan gratuit de Dify limite les appels à la base de connaissances.
    for (const t of TESTS_AGENT) {
      await lancer(t);
      await new Promise((r) => setTimeout(r, 15000));
    }
  };

  const valider = (id: string, humain: "OK" | "KO") => {
    const r = store.lire()[id];
    if (r) store.ecrire({ ...store.lire(), [id]: { ...r, humain } });
  };

  const exporter = () => {
    const lignes = ["Test;But;Entrée;Auto;Verdict humain;Date;Réponse"];
    for (const t of TESTS_AGENT) {
      const r = resultats[t.id];
      lignes.push([t.id, t.but, t.entree, r ? (r.auto ? "OK" : "KO") : "", r?.humain ?? "", r?.le ?? "", (r?.texte ?? "").replace(/[\r\n;]+/g, " ")].join(";"));
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + lignes.join("\n")], { type: "text/csv;charset=utf-8" }));
    a.download = "journal-tests-parcit.csv";
    a.click();
  };

  const ok = TESTS_AGENT.filter((t) => (resultats[t.id]?.humain ?? (resultats[t.id]?.auto ? "OK" : "KO")) === "OK" && resultats[t.id]).length;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 md:px-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-navy">
          <FlaskConical className="size-7 text-primary" /> Tests de l'agent
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          À rejouer après chaque modification (prompt, modèle, RAG, code). La vérification automatique est indicative : le verdict final est le vôtre.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => void toutLancer()} disabled={enCours !== null} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <Play className="size-4" /> Lancer les {TESTS_AGENT.length} tests
          </button>
          <button type="button" onClick={exporter} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium">
            <Download className="size-4" /> Exporter le journal (CSV)
          </button>
          <span className="text-sm font-semibold text-navy">{ok} / {TESTS_AGENT.length} réussis</span>
        </div>

        <ul className="mt-6 space-y-4">
          {TESTS_AGENT.map((t) => {
            const r = resultats[t.id];
            const verdict = r ? (r.humain ?? (r.auto ? "OK" : "KO")) : null;
            return (
              <li key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-navy">{t.id} · {t.but}</p>
                  {verdict === "OK" && <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><CheckCircle2 className="size-4" /> Réussi</span>}
                  {verdict === "KO" && <span className="flex items-center gap-1 text-sm font-semibold text-red-600"><XCircle className="size-4" /> Échoué</span>}
                </div>
                <p className="mt-2 text-sm"><span className="font-medium">Entrée :</span> {t.entree}</p>
                <p className="text-sm text-muted-foreground"><span className="font-medium">Attendu :</span> {t.attendu}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => void lancer(t)} disabled={enCours !== null} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary disabled:opacity-60">
                    {enCours === t.id ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />} Lancer
                  </button>
                  {r && (
                    <>
                      <button type="button" onClick={() => valider(t.id, "OK")} className="rounded-lg border border-border px-3 py-1.5 text-sm">Valider</button>
                      <button type="button" onClick={() => valider(t.id, "KO")} className="rounded-lg border border-border px-3 py-1.5 text-sm">Rejeter</button>
                    </>
                  )}
                </div>
                {r && (
                  <div className="mt-3 rounded-lg bg-muted p-3">
                    {r.details.length > 0 && <p className="mb-1 text-xs font-semibold text-amber-700">{r.details.join(" · ")}</p>}
                    <p className="whitespace-pre-wrap text-sm">{r.texte}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SiteLayout>
  );
}
