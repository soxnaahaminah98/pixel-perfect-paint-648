import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bot,
  FlaskConical,
  House,
  LayoutDashboard,
  Mail,
  Menu,
  Server,
  Ticket,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Accueil", icon: House },
  { to: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/suivi", label: "Équipements", icon: Server },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/tests", label: "Tests de l'agent", icon: FlaskConical },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

function Marque() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#0b7a7a" />
        <rect x="7" y="8" width="18" height="5" rx="1.5" fill="#fff" />
        <rect x="7" y="15" width="18" height="5" rx="1.5" fill="#fff" fillOpacity="0.75" />
        <rect x="7" y="22" width="18" height="3" rx="1.5" fill="#fff" fillOpacity="0.45" />
        <circle cx="22" cy="10.5" r="1.3" fill="#e8a317" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-white">ParcIT</span>
    </span>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <nav className="flex flex-col gap-0.5" aria-label="Navigation principale">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white [&.active]:border-accent [&.active]:bg-white/10 [&.active]:text-white"
          >
            <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        to="/"
        hash="assistant"
        onClick={onNavigate}
        className="mt-5 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
      >
        <Bot className="size-4.5" aria-hidden="true" /> Demander à l'agent
      </Link>
    </>
  );
}

function PiedSidebar() {
  return (
    <div className="mt-auto border-t border-white/10 pt-4 text-xs text-white/55">
      <p className="font-medium text-white/80">Plan International Sénégal</p>
      <p className="mt-0.5">Dakar · Kaolack</p>
      <a
        className="mt-2 block transition-colors hover:text-white"
        href="mailto:mfaye@planinternational.org"
      >
        mfaye@planinternational.org
      </a>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Barre de navigation latérale (ordinateur) */}
      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy px-4 py-5 md:flex">
        <Link to="/" className="mb-8 px-1" aria-label="ParcIT, accueil">
          <Marque />
        </Link>
        <Navigation />
        <PiedSidebar />
      </aside>

      {/* Barre du haut (mobile) */}
      <header className="no-print sticky top-0 z-40 flex h-14 items-center justify-between bg-navy px-4 text-white md:hidden">
        <Link to="/" onClick={() => setOpen(false)} aria-label="ParcIT, accueil">
          <Marque />
        </Link>
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-md hover:bg-white/10"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        {open && (
          <div className="absolute inset-x-0 top-14 flex flex-col bg-navy px-4 pb-5 pt-2 shadow-elegant">
            <Navigation onNavigate={() => setOpen(false)} />
          </div>
        )}
      </header>

      <div className="app-main flex min-h-screen flex-col md:pl-64">
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground md:px-6">
          ParcIT · Usage interne · © {new Date().getFullYear()} Plan International Sénégal
        </footer>
      </div>
    </div>
  );
}
