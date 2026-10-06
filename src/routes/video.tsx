import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/video")({
  head: () => ({ meta: [{ title: "Vidéo de présentation — ParcIT" }] }),
  component: Video,
});

function Video() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 md:px-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-navy">
          <Play className="size-7 text-primary" /> Vidéo de présentation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Découvrez ParcIT en moins d'une minute : suivi du parc, tableau de bord, tickets et assistant IT.
        </p>
        <video
          controls
          preload="metadata"
          className="mx-auto mt-6 max-h-[80vh] w-full rounded-lg bg-black"
          src="/presentation.mp4"
        >
          Votre navigateur ne peut pas lire cette vidéo.{" "}
          <a href="/presentation.mp4">Télécharger la vidéo</a>.
        </video>
      </div>
    </SiteLayout>
  );
}
