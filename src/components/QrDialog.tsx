import { QRCodeSVG } from "qrcode.react";
import { Printer, X } from "lucide-react";
import type { Equipement } from "@/data/equipements";

export function urlEquipement(id: string): string {
  const origine = typeof window !== "undefined" ? window.location.origin : "";
  return `${origine}/equipement/${id}`;
}

export function QrDialog({ equipement, onClose }: { equipement: Equipement; onClose: () => void }) {
  const url = urlEquipement(equipement.id);

  const imprimer = () => {
    const svg = document.getElementById("qr-etiquette")?.outerHTML ?? "";
    const w = window.open("", "_blank", "width=420,height=320");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Étiquette ${equipement.id}</title>
<style>
  @page { size: 6cm 4cm; margin: 0 }
  body { margin: 0; width: 6cm; height: 4cm; display: flex; align-items: center; gap: 0.3cm; padding: 0.3cm; box-sizing: border-box; font-family: Arial, sans-serif; }
  svg { width: 3cm; height: 3cm; flex: none }
  .t { font-size: 10pt; line-height: 1.25 }
  .id { font-weight: 700; font-size: 13pt }
</style></head><body>
${svg}
<div class="t"><div class="id">${equipement.id}</div><div>${equipement.modele}</div><div>${equipement.site}</div></div>
<script>window.onload=()=>{window.print();}</script></body></html>`);
    w.document.close();
  };

  return (
    <div
      className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`QR code ${equipement.id}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {equipement.id} · {equipement.type}
            </p>
            <h2 className="mt-1 text-base font-semibold text-navy">{equipement.modele}</h2>
            <p className="text-xs text-muted-foreground">{equipement.site}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 flex justify-center rounded-xl border border-border bg-white p-4">
          <QRCodeSVG id="qr-etiquette" value={url} size={176} level="M" marginSize={0} />
        </div>
        <p className="mt-3 break-all text-center text-xs text-muted-foreground">{url}</p>
        <button
          type="button"
          onClick={imprimer}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
        >
          <Printer className="size-4" /> Imprimer l'étiquette (6 × 4 cm)
        </button>
      </div>
    </div>
  );
}
