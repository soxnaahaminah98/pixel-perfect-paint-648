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
          Deux vidéos pour découvrir ParcIT : la présentation générale et le signalement d'une panne par QR code.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <figure>
            <video
              controls
              preload="metadata"
              className="mx-auto max-h-[75vh] w-full rounded-lg bg-black"
              src="/presentation.mp4"
            >
              Votre navigateur ne peut pas lire cette vidéo.{" "}
              <a href="/presentation.mp4">Télécharger la vidéo</a>.
            </video>
            <figcaption className="mt-2 text-sm">
              <span className="font-semibold text-navy">Présentation de ParcIT</span>
              <span className="block text-muted-foreground">Suivi du parc, tableau de bord et assistant IT.</span>
            </figcaption>
          </figure>
          <figure>
            <video
              controls
              preload="metadata"
              className="mx-auto max-h-[75vh] w-full rounded-lg bg-black"
              src="/signalement-qr.mp4"
            >
              Votre navigateur ne peut pas lire cette vidéo.{" "}
              <a href="/signalement-qr.mp4">Télécharger la vidéo</a>.
            </video>
            <figcaption className="mt-2 text-sm">
              <span className="font-semibold text-navy">Signaler une panne par QR code</span>
              <span className="block text-muted-foreground">Scannez le QR code d'un équipement pour déclarer une panne en quelques secondes.</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </SiteLayout>
  );
}
