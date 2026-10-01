import { creerTicket } from "@/lib/tickets-store";
import { useState } from "react";
import { interrogerAgent } from "@/lib/dify.functions";
import { Bot, Loader2, Send } from "lucide-react";


function rendreGras(texte: string): React.ReactNode[] {
  const parties = texte.split(/\*\*(.+?)\*\*/g);
  return parties.map((partie, i) =>
    i % 2 === 1 ? <strong key={i}>{partie}</strong> : partie
  );
}

const EXEMPLES = [
  "Où en est le laptop HP ProBook 450 de Kaolack ?",
  "Le PC fixe Dell OptiPlex 7010 est en panne, quelle priorité ?",
  "Quelles imprimantes ont une maintenance en retard ?",
  "Le smartphone Samsung Galaxy A54 a-t-il déjà eu une maintenance ?",
];

export function AssistantIT({ questionInitiale = "", equipementId = "" }: { questionInitiale?: string; equipementId?: string }) {
  const [ticketCree, setTicketCree] = useState<string | null>(null);
  const [question, setQuestion] = useState(questionInitiale);
  const [chargement, setChargement] = useState(false);
  const [reponse, setReponse] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const interroger = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const q = question.trim();
    if (!q || chargement) return;

    setChargement(true);
    setErreur(null);
    setReponse(null);
    setTicketCree(null);

    try {
      const r = await interrogerAgent({ data: { question: q } });
      if (r.ok) setReponse(r.texte);
      else setErreur(r.message);
    } catch {
      setErreur("Service temporairement indisponible");
    } finally {
      setChargement(false);
    }
  };

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
        <Bot className="size-5 text-accent" /> Assistant IT
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Posez une question à l'agent IA sur vos équipements.
      </p>

      <form onSubmit={interroger} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question sur vos équipements (ex : Où en est mon laptop ?)"
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={!question.trim() || chargement}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow disabled:cursor-not-allowed disabled:opacity-50"
        >
          {chargement ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Interroger l'assistant IT
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXEMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setQuestion(ex)}
            className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {ex}
          </button>
        ))}
      </div>

      {chargement && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted px-4 py-4 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          L'assistant analyse votre demande…
        </div>
      )}

      {erreur && (
        <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {erreur}
        </p>
      )}

      {reponse && !chargement && (
        <div className="mt-4 rounded-lg bg-muted px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Réponse de l'assistant
          </p>
          <div className="mt-2 whitespace-pre-wrap text-sm text-foreground">
            {rendreGras(reponse)}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              disabled={ticketCree !== null}
              onClick={() => {
                const t = creerTicket({
                  equipementId,
                  titre: question.trim().slice(0, 80),
                  description: reponse,
                  priorite: "Normale",
                });
                setTicketCree(t.id);
              }}
              className="rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary disabled:opacity-60"
            >
              Créer un ticket
            </button>
            {ticketCree && <span className="text-xs text-muted-foreground">Ticket {ticketCree} créé (voir « Tickets »).</span>}
          </div>
        </div>
      )}
    </section>
  );
}
