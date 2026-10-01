import { creerStore } from "@/lib/store-local";

export type Priorite = "Basse" | "Normale" | "Haute" | "Critique";
export type StatutTicket = "Ouvert" | "En cours" | "Résolu";

export type Ticket = {
  id: string;
  equipementId: string;
  titre: string;
  description: string;
  priorite: Priorite;
  statut: StatutTicket;
  creeLe: string;
};

const store = creerStore<Ticket[]>("parcit-tickets-v1", []);

export const useTickets = store.useStore;

export function creerTicket(
  t: Pick<Ticket, "equipementId" | "titre" | "description" | "priorite">,
): Ticket {
  const existants = store.lire();
  const ticket: Ticket = {
    ...t,
    id: `T-${String(existants.length + 1).padStart(3, "0")}`,
    statut: "Ouvert",
    creeLe: new Date().toISOString(),
  };
  store.ecrire([ticket, ...existants]);
  return ticket;
}

export function changerStatutTicket(id: string, statut: StatutTicket) {
  store.ecrire(store.lire().map((t) => (t.id === id ? { ...t, statut } : t)));
}
