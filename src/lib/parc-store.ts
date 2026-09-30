import { useEffect, useState, useSyncExternalStore } from "react";
import { equipementsInitiaux, type Equipement, type Statut } from "@/data/equipements";

// Simulated real-time store: shared via localStorage, refreshed every 5 s and across tabs.
export type EquipementLive = Equipement & { majLe: number };

const KEY = "parcit-equipements-v1";
const listeners = new Set<() => void>();
let cache: EquipementLive[] | null = null;
let raw: string | null = null;

const initial = (): EquipementLive[] => {
  const t = Date.now();
  return equipementsInitiaux.map((e) => ({ ...e, majLe: t }));
};
const serverSnapshot = initial();

function read(): EquipementLive[] {
  if (typeof window === "undefined") return serverSnapshot;
  const r = localStorage.getItem(KEY);
  if (cache && r === raw) return cache;
  if (!r) {
    cache = initial();
    raw = JSON.stringify(cache);
    localStorage.setItem(KEY, raw);
    return cache;
  }
  try {
    cache = JSON.parse(r);
    raw = r;
  } catch {
    cache = initial();
  }
  return cache!;
}

const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  const poll = window.setInterval(emit, 5000);
  const onStorage = (e: StorageEvent) => e.key === KEY && emit();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    clearInterval(poll);
    window.removeEventListener("storage", onStorage);
  };
}

export function useEquipements() {
  return useSyncExternalStore(subscribe, read, () => serverSnapshot);
}

export function mettreAJour(id: string, statut: Statut, observation?: string) {
  const next = read().map((e) =>
    e.id === id
      ? { ...e, statut, observations: observation?.trim() ? observation.trim() : e.observations, majLe: Date.now() }
      : e,
  );
  raw = JSON.stringify(next);
  cache = next;
  localStorage.setItem(KEY, raw);
  emit();
}

export function useMaintenant(ms = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

export function ilYa(ts: number, now: number) {
  const min = Math.max(0, Math.floor((now - ts) / 60000));
  if (min < 1) return "Mis à jour à l'instant";
  if (min < 60) return `Mis à jour il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Mis à jour il y a ${h} h`;
  return `Mis à jour il y a ${Math.floor(h / 24)} j`;
}

export const maintenanceEnRetard = (date: string | undefined, now: number) =>
  !date || (now - new Date(date).getTime()) / 86400000 > 180;

export function compter(list: Equipement[]) {
  return {
    service: list.filter((e) => e.statut === "En service").length,
    panne: list.filter((e) => e.statut === "En panne").length,
    maintenance: list.filter((e) => e.statut === "En maintenance").length,
  };
}
