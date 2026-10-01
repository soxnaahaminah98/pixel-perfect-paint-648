import { createServerFn } from "@tanstack/react-start";

// Appel Dify côté serveur : la clé reste dans process.env, jamais dans le navigateur.
const URL_DIFY = "https://api.dify.ai/v1/workflows/run";

export type ReponseDify = { ok: true; texte: string } | { ok: false; message: string };

export const interrogerAgent = createServerFn({ method: "POST" })
  .inputValidator((d: { question: string }) => ({ question: String(d?.question ?? "").slice(0, 1000) }))
  .handler(async ({ data }): Promise<ReponseDify> => {
    const cle = process.env["DIFY_API_KEY"];
    if (!cle) return { ok: false, message: "Clé API absente du serveur" };
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch(process.env["DIFY_API_URL"] ?? URL_DIFY, {
        method: "POST",
        headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: { query: data.question }, response_mode: "blocking", user: "parcit-" + Date.now() }),
        signal: ctrl.signal,
      });
      const json = (await res.json().catch(() => null)) as
        | { data?: { outputs?: unknown; status?: string; error?: string }; code?: string; message?: string }
        | null;
      if (!res.ok) {
        // Message lisible : code HTTP + message Dify, jamais la clé.
        return { ok: false, message: `Service temporairement indisponible (Dify ${res.status} : ${json?.code ?? "erreur"} — ${json?.message ?? "sans détail"})` };
      }
      if (json?.data?.status === "failed") {
        return { ok: false, message: `Le workflow a échoué (${json.data.error ?? "voir Dify → Journaux"})` };
      }
      const o = json?.data?.outputs as Record<string, unknown> | undefined;
      const texte = [o?.["text"], o?.["message_erreur"]].find((v) => typeof v === "string" && v) as string | undefined;
      return { ok: true, texte: texte ?? "Réponse vide" };
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return { ok: false, message: "La réponse prend trop de temps — réessayez" };
      return { ok: false, message: "Service temporairement indisponible" };
    } finally {
      clearTimeout(t);
    }
  });
