import { useSyncExternalStore } from "react";

// Petit store persisté dans localStorage, partagé entre composants et onglets.
export function creerStore<T>(cle: string, initial: T) {
  const listeners = new Set<() => void>();
  let cache: T = initial;
  let brut: string | null = null;

  const lire = (): T => {
    if (typeof window === "undefined") return initial;
    const r = localStorage.getItem(cle);
    if (r === brut) return cache;
    brut = r;
    try {
      cache = r ? (JSON.parse(r) as T) : initial;
    } catch {
      cache = initial;
    }
    return cache;
  };

  const emit = () => listeners.forEach((l) => l());

  const ecrire = (valeur: T) => {
    brut = JSON.stringify(valeur);
    cache = valeur;
    localStorage.setItem(cle, brut);
    emit();
  };

  const subscribe = (l: () => void) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => e.key === cle && emit();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  };

  const useStore = () => useSyncExternalStore(subscribe, lire, () => initial);

  return { lire, ecrire, useStore };
}
