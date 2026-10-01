import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/tableau-de-bord", label: "Tableau de bord" },
  { to: "/suivi", label: "Équipements" },
  { to: "/tickets", label: "Tickets" },
  { to: "/tests", label: "Tests" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a2540]/95 text-white backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" onClick={() => setOpen(false)} aria-label="ParcIT — accueil">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white [&.active]:bg-white/15 [&.active]:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              hash="assistant"
              className="ml-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Demander à l'agent
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <nav className="flex flex-col gap-1 border-t border-white/10 bg-navy px-4 pb-4 pt-2 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white [&.active]:bg-white/15 [&.active]:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              hash="assistant"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground"
            >
              Demander à l'agent
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1 pt-16">{children}</main>

      <footer className="bg-navy text-white/75">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="flex items-center gap-2 font-semibold text-white">
              <LogoMark className="h-6 w-6" /> ParcIT — Plan International Sénégal
            </p>
            <p className="mt-1">Mentions légales · Usage interne · © {new Date().getFullYear()} ParcIT</p>
          </div>
          <div className="md:text-right">
            <p className="font-medium text-white">Service IT</p>
            <a className="transition-colors hover:text-white" href="mailto:mfaye@planinternational.org">
              mfaye@planinternational.org
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
